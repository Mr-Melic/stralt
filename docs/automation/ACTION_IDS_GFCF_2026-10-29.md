# Game Feel ACTION_IDs — 2026-10-29

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-10-29.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-3300fda7-8e7f-4bee-a4d7-b3c5b05855d9`

Prior IDs `GFCF-2026-08-31-001` … `015` live in `ACTION_IDS_2026-08-31.md`.  
`GFCF-2026-09-01-001` … `003` live in `ACTION_IDS_2026-09-01.md`.  
`GFCF-2026-09-02-001` … `005` live in `ACTION_IDS_GFCF_2026-09-02.md`.  
`GFCF-2026-09-21-001` … `004` are **queued in #363** (not on `main`).  
`GFCF-2026-09-21-005` and `GFCF-2026-09-22-001` … `009` are **queued in #419** (not on `main`).  
`GFCF-2026-09-23-001` … `005` are **queued in #478** (not on `main`).  
`GFCF-2026-09-24-001` … `004` are **queued in #523** (not on `main`).  
`GFCF-2026-09-25-001` … `005` are **queued in #571** (not on `main`).  
`GFCF-2026-09-26-001` … `004` are **queued in #610** (not on `main`).  
`GFCF-2026-09-27-001` … `004` are **queued in #678** (not on `main`).  
`GFCF-2026-09-28-001` … `004` are **queued in #735** (not on `main`).  
`GFCF-2026-09-29-001` … `004` are **queued in #772** (not on `main`).  
`GFCF-2026-10-21-001` … `004` are **queued in #845** (not on `main`).  
`GFCF-2026-10-22-001` … `004` are **queued in #894** (not on `main`).  
`GFCF-2026-10-23-001` … `004` are **queued in #954** (not on `main`).  
`GFCF-2026-10-24-001` … `004` are **queued in #1003** (not on `main`).  
`GFCF-2026-10-25-001` … `004` are **queued in #1061** (not on `main`).  
`GFCF-2026-10-26-001` … `004` are **queued in #1133** (not on `main`).  
`GFCF-2026-10-27-001` … `004` are **queued in #1184** (not on `main`).  
`GFCF-2026-10-28-001` … `004` are **queued in #1227** (not on `main`).  
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 / #954 / #1003 / #1061 / #1133 / #1184 / #1227 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx` (`handleBattleEnd` recap payload, `handleBossRushRoomClear` `bossDefeated` / roomDef names), `PostBattleRecap.tsx` Depth defaults, and `useBossRush.ts` resume-read catch. Oldest WX owner is **#327**; **#363** / **#419** already queue feel floats. **#845** / **#354** own Recap chrome. `#803` owns `useBossRush.ts` abort persist order — do not toast-wire abort here.

Hover-crit omission stays a matrix note. Cooldown-slot pulse stays unfiled. Challenge HUD ongoing chrome stays a non-hole. Rest nearby-label stays unfiled. White / BR nearby stay #1003. Death Realm *Escape* nearby stays #1061. Death Realm *HUD chip* stays #1133. Ground Doka float-before-commit stays a listed 10-26 non-hole. Overworld Doka-heal *success* toast stays a non-hole; persist-*fail* after that toast stays #1133. Portal +10 *success* float stays #478; *level-up sound* stays #1184; *fail toast* stays #1184. Death-save fail stays #1184. Dungeon/BR *run-ended on death* stays #1184. Dungeon-complete persist-*fail* stays #1227. Feat unlock *confirm* stays #1227. BR room-advance persist-*fail* stays #1227. BR *entry* log stays #1227. White / rest gen-fail after `cleanupMap` stays AQA / GMI. BoostToggle disconnected from WX stays PXA. Unused `enemy_death` / `leader_boost` / `combo` SFX stay dead hooks.

---

ACTION_ID: GFCF-2026-10-29-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Dungeon-chain recap badge must not default to Depth 1/?  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `handleBattleEnd` recap (`WX` 12456–12472) sets `dungeonMultiplier: chainMult \|\| 1` and never copies `dungeonChainDepthRef` / `dungeonChainMaxDepthRef`. `PostBattleRecap` shows the badge whenever `dungeonMultiplier > 1` (`PostBattleRecap.tsx` 448–493) and interpolates `Depth {data.dungeonDepth ?? 1}/{data.dungeonMaxDepth ?? "?"}`. `dungeonDokaMultiplierFor(true, 1) === 1.5` (`portalRules.ts` 155–162; `portalRules.test.ts`), so every in-chain fight — depth 5 at 4× included — reads “Depth 1/?”. Live HUD already tells the truth (`⚔️ Dungeon {dungeonChainDepth}/{dungeonChainMaxDepth}` at `WX` 17562–17575). Nearby dungeon label already says `Continue Chain (N/M)` (`WX` 7916–7941). Distinct from dungeon-enter / progress / trophy *logs* (cited non-holes). Distinct from dungeon-complete persist-*fail* after the trophy log (#1227 / 10-28-001). Distinct from recap challenge *rows* (#845 / 10-21-002). Distinct from 008 recap LEVEL UP chrome. Distinct from BR recap `mapTitle` Room N (that path is not a dungeon chain).  
SYSTEMS_AFFECTED: WorldExploration `handleBattleEnd` recap payload (`WX` 12456–12472); PostBattleRecap dungeon badge (`PostBattleRecap.tsx` 448–493); existing `dungeonChainDepthRef` / `dungeonChainMaxDepthRef`  
RECOMMENDED_ACTION: When `dungeonChainActiveRef.current`, copy `dungeonDepth: dungeonChainDepthRef.current` and `dungeonMaxDepth: dungeonChainMaxDepthRef.current` onto the recap. In PostBattleRecap, omit the Depth clause when either field is missing (show `×{multiplier}` only) so a future miss cannot lie “1/?”. Do **not** change `dungeonDokaMultiplierFor`. Do not add a second HUD chip. Do not toast every dungeon victory. Live `Dungeon N/M` chip stays the progress non-hole.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing recap badge; HUD chip as the copy source of truth; #327 owns WX; union Recap with #845 / #354  
REGRESSION_RISK: LOW — presentation of refs the HUD already displays. Overworld fights (`chainMult === 1`) must still hide the badge. Depth 0 / inactive must not paint Depth 1. Trophy log / persist-fail stay #1227.  
VALIDATION_REQUIRED: Win a depth-1 chain fight → badge `Depth 1/{max} — 1.5×`. Win a depth-3 fight → `Depth 3/{max} — 2.5×`, matching the HUD chip. Overworld victory → no dungeon badge. Recap with multiplier but missing depth → `×N` only, never `1/?`. Challenge rows still #845. Dungeon-complete persist-fail still #1227.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-29-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Overworld recap must not drop the per-enemy Doka rows it already computed  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `handleBattleEnd` builds `dokaBreakdown` with the jackpot tiers (`WX` 12380–12415: 90% 1–3×, 0.01% `level * [1, 1e9]`), reduces it to `rawDoka`, then passes `dokaBreakdown: []` (`WX` 12468). PostBattleRecap already renders the array when `length > 0` (`PostBattleRecap.tsx` 494–509). Boss Rush recap on the same overlay **does** pass rows (`WX` 12885–12889; equal split, not jackpot). `resolveBattleRewards` also returns `dokaBreakdown: []` (`rewardResolver.ts` 222) — the live overlay uses the WX object. Official comment on why the 1e9 band exists: `applyRewardsResult.ts` 41–44 (uncapped recap used to advertise a grant the canister then `#err`d). Recap *total* is already `clampApplyRewardsDeltas` (`WX` 12447–12450). Distinct from Doka Fever ×2 (announce + recap *total* stay enough). Distinct from recap challenge *rows* (#845 — those fields are unread; this field is wired and emptied). Distinct from Ground Doka float. Distinct from dungeon-complete bonus (#1227). Distinct from 001 (depth badge).  
SYSTEMS_AFFECTED: WorldExploration `handleBattleEnd` recap payload (`WX` 12380–12468); PostBattleRecap doka list (`PostBattleRecap.tsx` 494–509); `clampApplyRewardsDeltas`  
RECOMMENDED_ACTION: Pass a **clamped / scaled** copy of `dokaBreakdown` whose rows sum to `recapGrant.dokaDelta` (scale by `recapGrant.dokaDelta / rawDoka` after modifiers, or cap the jackpot row). Optional one-line “Capped at canister max” only when the clamp actually cut. Do **not** pass raw 1e9 rows (that is why they were emptied). Do not change jackpot odds or `APPLY_REWARDS_MAX_DOKA_DELTA`. Do not add a jackpot banner on recap (Doka Fever announce is enough). BR recap rows stay as they are. Challenge rows stay #845.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing recap list UI; `clampApplyRewardsDeltas`; #327 owns WX; union Recap with #845 / #354 / 001  
REGRESSION_RISK: MEDIUM only if raw jackpot rows are shown (total would not match, or the list would explode). LOW if rows are scaled to the clamped total. Recap total / persist clamp must still match. 90% 1–3× fights must show short rows, not a scrollbar of noise.  
VALIDATION_REQUIRED: Normal 1–3× overworld win → one row per defeated enemy, sum equals `dokaEarned`. Forced jackpot → recap total stays ≤ 100_000, rows sum to that total, no 1e9 line. Doka Fever map still announces ×2; recap total includes it. BR recap rows unchanged. Challenge rows still unread until #845. Depth badge still 001.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-29-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Boss Rush room-clear recap must name the two bosses just beaten  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `handleBossRushRoomClear` loads `const _currentRoom = BOSS_RUSH_ROOMS[currentRoomIndex]` (`WX` 12693) and never reads `boss1Name` / `boss2Name`. Recap payload is `mapTitle: \`Boss Rush - Room ${currentRoomIndex + 1}\`` with **no** `bossDefeated` (`WX` 12876–12895). Overworld `handleBattleEnd` sets `bossDefeated: currentBossConfigRef.current?.name` (`WX` 12471), which drives the recap `BOSS DEFEATED` banner (`PostBattleRecap.tsx` 148–176). `spawnBossRushRoom` never writes `currentBossConfigRef` (`WX` 5288–5378; ids are `boss-rush-${roomIndex}-0/1`), so `if (activeBossConf) logBattleEntry("☠️ BOSS DEFEATED: …")` (`WX` 12917–12919) also never fires on a Rush room. Every Rush room is a named pair (`useBossRush.ts` 24–79). Distinct from BR *Complete* (#845 / 10-21-001 — run-end trophy). Distinct from room-advance *banner* (#419 / 09-22-005). Distinct from BR *entry* log (#1227 / 10-28-004). Distinct from BR *nearby* (#1003). Distinct from 009 PHASE 2. Distinct from run-*ended on death* (#1184). Distinct from recap LEVEL UP (008 remaining).  
SYSTEMS_AFFECTED: WorldExploration `handleBossRushRoomClear` recap (`WX` 12693 / 12876–12895) and optional `☠️ BOSS DEFEATED` log (`WX` 12917–12919); PostBattleRecap `bossDefeated` banner (`PostBattleRecap.tsx` 148–176); `BOSS_RUSH_ROOMS` names  
RECOMMENDED_ACTION: Set `bossDefeated` from `_currentRoom` (e.g. `"Pale Archbishop & Weeping Pawn"`). Optionally fire the existing `☠️ BOSS DEFEATED` log from those names instead of `currentBossConfigRef`. Do **not** add a 1.5s encounter banner on recap (recap chrome is enough; 009 stays in-fight). Do not change room spawn, persist, or Complete. `mapTitle` Room N can stay. Nearby stays #1003. Entry log stays #1227. Complete stays #845.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing recap banner; `BOSS_RUSH_ROOMS`; #327 owns WX; union Recap with #845 / #354 / 001 / 002  
REGRESSION_RISK: LOW — presentation after an already-committed room clear. Overworld boss recap must still use `currentBossConfigRef.name` (do not steal Rush pair copy). Final-room Complete stays #845 (do not replace the white-gateway log with a second Complete). Double-name string must not overflow the banner.  
VALIDATION_REQUIRED: Clear Rush room 0 → recap banner names Archbishop & Pawn; `mapTitle` still Room 1; no extra 1.5s banner. Overworld named-boss victory still uses `currentBossConfigRef`. Room-advance still #419. Complete still only on room 10 (#845). Entry log still #1227. Resume-read fail still 004.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-29-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Boss Rush resume-read fail needs a player cue before Room 1 starts  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: MEDIUM  
EVIDENCE: `startBossRush` (`useBossRush.ts` 251–284) catch on `getBossRushState` is `console.error("[BossRush] Failed to read resume room:", e)` only. Fallback is `resumeRoomFromPersisted(currentRoomRef.current)` (`useBossRush.ts` 275–277`). Mount load catch is also console-only (`useBossRush.ts` 203–205`) and never sets `active` (by design — overlay waits for the portal). Dual-fail, or a principal that never hydrated (`resolveBossRushQueryPrincipalText` / `bossRushProgress.ts` 24–36), leaves `resumeRoom === 0`. HUD then paints `Boss Rush — Room 1 / 10` (`WX` 17577–17598`). A player who had Room 5 persisted cannot tell the run restarted. Distinct from room-advance *persist-fail after the next room spawned* (#1227 / 10-28-003 — that ID is the *write* after a successful clear). Distinct from BR *entry* log (#1227 / 10-28-004 — missing dungeon-enter-style cue on a *successful* start). Distinct from abort persist order (#803). Distinct from run-*ended on death* (#1184). Distinct from 003 (recap names). Distinct from Complete (#845).  
SYSTEMS_AFFECTED: `useBossRush.ts` `startBossRush` catch (`useBossRush.ts` 270–272`) and optional mount-load catch (`useBossRush.ts` 203–205`); WorldExploration BR HUD chip (`WX` 17577–17598`)  
RECOMMENDED_ACTION: `toast.error` once when the *live* `getBossRushState` throws (`"Couldn't load Boss Rush progress"` / existing err), then still use the mount-cache fallback. If that fallback is also 0, the Room 1 HUD is honest *after* the fail toast. Do **not** toast the mount-load catch (player is not in a run yet). Do not change `resumeRoomFromPersisted` / `adoptPersistedResumeRoom`. Do not toast every successful start (entry *success* log stays #1227). Do not block `spawnBossRushRoom`.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing sonner toast; #1227 entry log + room-advance persist-fail; #803 abort persist order; union `useBossRush.ts` with #803 / #1227  
REGRESSION_RISK: LOW — presentation on an already-failing read. Success must stay quiet (or #1227’s one enter log). A true new run (backend currentRoom 0, no throw) must not toast. Abort / death still #803 / #1184. Do not invent a resume room from `highestRoomCompleted`.  
VALIDATION_REQUIRED: Fresh start, live read ok → Room 1, no error toast (#1227 enter log if wired). Mid-run Room 5, live read ok → Room 5, no error toast. Live read throw + mount cache 5 → Room 5, one error toast. Live read throw + cache 0 → Room 1, one error toast. Abort / death still #803 / #1184. Room-advance persist throw still #1227-003. Recap boss names still 003.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 … 10-28 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF). Still zero render call sites (`effects.ts` 331).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference). Distinct from #1003 spell-*book* upgrade. Distinct from #1184 portal *sound*.  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote (`WX` 15790–15799). Distinct from #845 Boss Rush *Complete*, from #1003 BR *nearby*, from #1227 BR *entry* log, and from 003 this ledger (BR recap *names*).  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan (`WX` 8514–8529). Distinct from 09-29-002 (spell-slot AP) and from #894 hover *damage*.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT / Sacrifice source labels. Lava/spikes still sit in the movement RAF. Mirror Field reflect stays here. Lethal lava skipping Game Over is #1133-001. Thorn/rift *numbers* stay #523.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`). Item-buff chips are 09-29-001. Apply *float* is #845 / 10-21-003. True *expiry* is #845 / 10-21-004.  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait. Toast after teleport (`WX` 13486) is not the wait. #554 is the walk block. Nearby *Escape* is #1061. HUD *chip* is #1133-004.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number (`WX` 9344). Drain heal is still log-only. Distinct from #894 heal *hover*. Distinct from #1133-002 (overworld Doka-heal persist-fail).  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004. Potion *drink* stays 09-02-004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009 (003 is shrine *juice*; 002 is ability *numbers* / AP *drain*; 005 is BR *room-advance banner*; 006 is victory-persist *portal block*). Altar *tile* is #954; AP *grant* is #954; BR *nearby* is #1003. Recap persist-*fail* is #1133-003. Portal XP persist-*fail* is #1184-004. BR *entry* log is #1227. BR *room-advance persist fail* is #1227.  
- **#478 queue** — GFCF-2026-09-23-001…005. Portal +10 *success* float stays 005 there. Portal *level-up sound* is #1184-002.  
- **#523 queue** — GFCF-2026-09-24-001…004. Void Rift *cell* stays 001 there. Plague / Thorned *numbers* stay 002 there.  
- **#571 queue** — GFCF-2026-09-25-001…005.  
- **#610 queue** — GFCF-2026-09-26-001…004. Sealed *log* stays 001 there.  
- **#678 queue** — GFCF-2026-09-27-001…004.  
- **#735 queue** — GFCF-2026-09-28-001…004.  
- **#772 queue** — GFCF-2026-09-29-001…004.  
- **#845 queue** — GFCF-2026-10-21-001…004. Recap *challenge rows* stay 002 there; fail *rising-edge* is #1003. BR *Complete* stays 001 there; run-*ended on death* is #1184-003. Recap *Depth* is 001 this ledger; recap *dokaBreakdown* is 002 this ledger; recap *bossDefeated* on Rush is 003 this ledger.  
- **#894 queue** — GFCF-2026-10-22-001…004. Rest-*exit* stays 001 there.  
- **#954 queue** — GFCF-2026-10-23-001…004. Shock *cell* / shrine *tile* / rim / Dawn +AP stay there.  
- **#1003 queue** — GFCF-2026-10-24-001…004. White / BR nearby, spell-upgrade toast, challenge-*fail* rising-edge.  
- **#1061 queue** — GFCF-2026-10-25-001…004. Death Realm *Escape* nearby, challenge offer/expire, shop Buy persist-fail.  
- **#1133 queue** — GFCF-2026-10-26-001…004. In-battle lava skip Game Over, heal persist-fail after success toast, victory persist-fail after recap, Death Realm HUD chip.  
- **#1184 queue** — GFCF-2026-10-27-001…004. Death-save fail, portal level-up sound, run-ended on death, portal XP persist-fail.  
- **#1227 queue** — GFCF-2026-10-28-001…004. Dungeon-complete persist-fail, feat unlock confirm, BR room-advance persist-fail, BR entry log. Resume-*read fail* is 004 this ledger, not 10-28-003.

TBC remains WAITING (**#1277**; #1232 was 10-28). Do not invent feel-telemetry (015 / AQA-012).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs stay PXA/MIMA. **Invincible / `damageImmune`:** unread on player hits — stay MIMA. **Shell Armor** on the player-spell path is applied — #735 / 09-28-002. **Vampiric Ground** `onDamageDealt` mutates a throwaway `attacker` object in `enemyTakesDamage` — MIMA, not a heal float (#1148 commits it *off* `main`). **`mirrorRedirect`** never fires — dead-code, not a feel ID. **`_leaderBoostMultiplier`** unread — MIMA. **`applyRangeModification` / `tickModifiableRangeBonuses`** are `void`ed unused — dead-code, not a mute range chip. **Summon-control walk thorns / Void Rift:** `applyControlledSummonWalk` never calls `applyBattleWalkHazards` — no damage applied (MIMA parity), not a mute float. **#803** persist `complete(9)` / `abortBossRush` order is not 004’s resume-read fail and not #1227’s room-advance fail / entry log. **#754** Swap landing tax is not the Swap puff (#523). **#799** bomber/Inferno share is combat truth; detonate already `processCombatantDeath`s. **#850–#1217** kit execute-share / remount-wipe / portal snaps / pack-enemy buffs / leftover-XP wipe / Glass Realm ×2 / Iron Curse / Vampiric Ground / Chaos shuffle / larva-explode commit are combat/persist/map truth, not on `main`. **#728** End Turn lock is combat; leftover *title* is #894. **`res.newPositions`** unread in WX — MIMA. **`res.damageToTargets`** unread — MIMA. **`boardClaimZone`** stored and never taxed — MIMA; do not tint. **Ink Veil `glyphedTiles`:** designed invisible — MIMA, not a missing tint. **Boss `void` hazard** paints as spikes and landing ignores it — MIMA. **Dawn `damageToPlayer: -10`:** WX requires `> 0` — MIMA, not #954-004. **`covenantBuffMapsRef`:** written, unread — PXA/MIMA. **Resonance counter** deadlock — MIMA, not a countdown HUD. **Illusions / larvae / `reflectShieldTurnsLeft` / `magicReflectActive`:** unread or never ticked — MIMA. **Swift Winds / Mending Mist on the player:** hooks do not land — MIMA (#1199 / #1202 commit them *off* `main`). **Glass Realm 2×:** `applyDamageToEnemy` never calls `applyDamageDealt` on `main` — MIMA, not a hover-lie ID (#894 is Fury/Blood Moon; #1160 commits Glass Realm *off* `main`). **White / rest gen-fail after `cleanupMap`:** AQA / GMI, not this ledger (Death Realm already has fallback + toast). **Enemy AI `decide/apply` throw:** exception path, silent advance — not a listed player moment. **BoostToggle** disconnected (`GameFlow` `_boostMode`; WX `_setBoostMode` unused, always `"xp"`) — PXA, not a recap “+50% XP” ID. **`handleBattleEnd` catch 0-XP recap** (`WX` 12629–12650) — exception path, not a listed player moment.

## Explicit non-holes from this search

- Flee: confirm dialogs present on dungeon / Boss Rush (`WX` 18918–18935). Overworld flee is intentionally unconfirmed.  
- Player End Turn: `title=` already says leftover AP/MP are lost (`BattleUIPanel.tsx` 553). Summon End Turn *title* is #894. Controlled-summon 0/0 auto-end is next-turn log + dock dismiss — not filed.  
- Rest / sanctuary *entry*: toasts present (`WX` 6142 / 6205). Rest-*exit* is #894. Rest whirlpool rings are enough — **do not add a rest nearby label**. White *sanctuary* nearby is #1003. Death Realm *exit* nearby is #1061. Death Realm *HUD chip* is #1133-004. Do **not** add a sanctuary HUD chip (`generateRestMap` sets `isRestMap`).  
- Ground Doka: sound + float + log. Wallet credits on persist commit; `#err` releases the claim so the coin can retry — 10-26 listed this as a non-hole (not a lying *toast*). Do not twin as a persist-fail ID. Dungeon-complete *success* trophy log stays a non-hole; persist-*fail* after that log is #1227.  
- Map modifiers: log + `MapModifiersPanel`. Time Warp footer timer is enough. Blood Moon *number* is #894. Ice / lava / spikes floor tints already exist. Doka Fever ×2: announce + recap *total* are enough (per-kill rows are 002 this ledger, not a Fever badge).  
- Challenge HUD: `shouldShowChallengeHud` keeps the panel after accept. Recap rows stay #845. Rising-edge fail is #1003. Offer *log* / unaccepted *expire* stay #1061.  
- **Player** summon spawn: puff + SFX + log. Fade log already says `"{name} fades away..."` (`summonLifespan.ts` 36). Fade *canvas* stays #419.  
- Dungeon-chain *enter* / *progress* logs already name the run (`WX` 6332–6336 / 6398–6401). Nearby dungeon portal label stays a non-hole. Live HUD `Dungeon N/M` stays a non-hole; recap *Depth 1/?* is 001 this ledger. Complete *success* trophy log stays a non-hole; persist-*fail* is #1227.  
- Player DoT ticks: already go through `playerTakesDamage`. Enemy DoT ticks already go through `enemyTakesDamage`.  
- Leader death: `"LEADER DEFEATED!"` overlay. Erratic *why* is #735. Unused `leader_boost` / `enemy_death` / `combo` SFX are dead hooks — do not add spectacle.  
- Spell fizzle: canvas `"✦ FIZZLED! ✦"` + SFX.  
- Attack Nearest cooldown: already floats `"On cooldown"`. Do **not** pulse the slot.  
- Hover crit omission: matrix note only.  
- Barrier fade: tower disappears; leftover `Barrier at ${bKey}` log is ugly but IMPACT exists — still not filed.  
- `comboTextRef` is drawn but never written — dead overlay, not a mute mechanic.  
- Enemy AI 5s watchdog: not a player “time’s up” (09-23-003). A `decide/apply` throw is `console.error` then a silent advance (`WX` 16956–16959) — exception path, not a listed player moment; leave it.  
- Jackpot heal: 3s banner already exists. Persist-*fail* of that button is #1133-002.  
- Recap Doka Fever ×2: announce + recap total are enough.  
- Game Over 20/40: already shows penalty lines on the *modal* path. In-battle lava skip is #1133-001. Persist-*fail* of that same penalty is #1184-001. Run-*ended* copy is #1184-003.  
- Death Realm *arrival* toast (`WX` 13486) after the 1.5s wait — the *wait* stays 013; nearby *Escape* is #1061; HUD *chip* is #1133-004. Fallback gen on throw still toasts (`WX` 13565).  
- White / rest *gen-fail* after `cleanupMap` is `console.error` (`WX` 6150 / 6214) — rare map-integrity, not a listed feel moment (AQA / GMI). Death Realm gen-fail already has a fallback map + toast.  
- Stun / root / silence / blind / confuse / charm / taunt / fear turn-skip: **no live CC skip path**.  
- Pushback / attract / non-Swap teleport: occupancy resolvers exist; still unimplemented in live cast.  
- Rest heal IMPACT: no rest-heal commit to float.  
- Chat send `catch { /* ignore */ }` is general UX, not GFCF.  
- Fury wore-off already logs (`WX` 14293). Shield remaining logs on melee absorb.  
- Zone Lock button + dialog already exist (`WX` 17600–17666).  
- `abortBossRush` `resetBossRush` fail is `console.error` (`useBossRush.ts` 348) — persist order owned by **#803**; do not re-file as GFCF. Run-*ended copy* is #1184-003. Room-*advance persist fail* is #1227-003. Resume-*read fail* is 004 this ledger.  
- Portal +10 *success* HUD-after-commit is the unpaid-XP fix; the missing *level-up sound* is #1184-002; the missing *fail toast* is #1184-004; the missing *float* stays #478.  
- Feat *claim reward* already toasts success and fail. Unlock *show* on `#ok` is the cited non-hole; mute `#err` after a shown toast is #1227-002.  
- BR *HUD chip* after `bossRushState.active` is the cited non-hole for *progress*. *Entry* log / SFX is #1227-004. Recap *names* are 003 this ledger. Resume-*read fail* is 004 this ledger.  
- BR recap `mapTitle` `Boss Rush - Room N` already names the room index — 003 is the missing *boss names*, not the room number.  
- Shrine 300 Doka has no success juice on `main` (#419) and no lying success log — do not twin as a persist-fail ID this ledger.  
- `playSound("map_transition")` after the BR / white / rest early-returns (`WX` 6283) — BR *entry* SFX is #1227-004; white / rest already toast.  

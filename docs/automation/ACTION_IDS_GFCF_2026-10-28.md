# Game Feel ACTION_IDs — 2026-10-28

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-10-28.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-97972a01-938c-4b1f-a4d8-5e81879a2398`

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
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 / #954 / #1003 / #1061 / #1133 / #1184 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx` (dungeon-complete persist catch, Boss Rush entry log, room-advance persist catch), `useMarkAchievementUnlocked` `#err` / `onError`, and `useBossRush.ts` room-advance catch. Oldest WX owner is **#327**; **#363** / **#419** already queue feel floats. `#803` owns `useBossRush.ts` abort persist order — do not toast-wire abort here.

Hover-crit omission stays a matrix note. Cooldown-slot pulse stays unfiled. Challenge HUD ongoing chrome stays a non-hole. Rest nearby-label stays unfiled. White / BR nearby stay #1003. Death Realm *Escape* nearby stays #1061. Death Realm *HUD chip* stays #1133. Ground Doka float-before-commit stays a listed 10-26 non-hole. Overworld Doka-heal *success* toast stays a non-hole; persist-*fail* after that toast stays #1133. Portal +10 *success* float stays #478; *level-up sound* stays #1184; *fail toast* stays #1184. Death-save fail stays #1184. Dungeon/BR *run-ended on death* stays #1184. White / rest gen-fail after `cleanupMap` stays AQA / GMI.

---

ACTION_ID: GFCF-2026-10-28-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Dungeon-complete bonus persist-fail needs a player cue after the trophy log already promised the Doka  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `decideDungeonChainPortal` `kind === "complete"` (`WX` 6337–6377) `tryClaimDungeonChainBonus` then `void progressPersistRef.enqueue` → `persistDokaCreditResult` / `resolveOneShotCreditSettle` (`WX` 6341–6364). Wallet moves only on `settle.kind === "commit"`. `#err` `releaseFlag(dungeonCompletionSavedRef)` — but `dungeonChainActiveRef` is already zeroed and `generateRandomMap` is about to run, so the player cannot step that portal again. The trophy line `🏆 Dungeon Chain COMPLETE! Bonus: ${chainBonus} Doka!` (`WX` 6374–6377) is **unconditional** and was the cited 10-24 / 10-27 non-hole (“wallet credits on commit”). Ground Doka float-before-commit stays a 10-26 non-hole because `#err` releases the *same coin on the same tile* (`WX` 11366–11420). Victory persist-fail after recap *showed the grant* is #1133 / 10-26-003. Portal XP persist-fail after the *map swapped* is #1184 / 10-27-004. Shrine *juice* stays #419 (no log on `main`). Distinct from dungeon-enter / depth-progress logs (not grants). Distinct from dungeon-complete *trophy log on success* (non-hole). Distinct from white-gateway log (`WX` 6390).  
SYSTEMS_AFFECTED: WorldExploration dungeon-chain `kind === "complete"` persist enqueue (`WX` 6341–6364) and trophy log (`WX` 6374–6377)  
RECOMMENDED_ACTION: `toast.error` once when settle is not `commit` (`"Dungeon bonus didn't save"` / existing err). Keep the one-shot claim / `#err` release / transport-keep rules. Do **not** optimistic-HUD the bonus (same unpaid-Doka class as portal +10). Do not change `chainBonus` math. Do not toast every successful complete (the trophy log already speaks). Optionally move the trophy log to the `commit` branch so a fail cannot lie — then keep one fail toast so the player knows why the log stayed quiet.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing sonner toast; `tryClaimDungeonChainBonus` / `settleOneShotPersistLock`; 10-26-003 victory fail; 10-27-004 portal XP fail; #327 owns WX  
REGRESSION_RISK: LOW — presentation on an already-failing settle. Success must stay a single trophy log. Double-complete guard must not toast twice. Transport-keep must not release the claim. `#err` release must still allow a *future* run to pay; this fail toast is for the run that just ended.  
VALIDATION_REQUIRED: Complete a 3–5 map chain; persist ok → one trophy log, wallet +bonus, no error toast. Force persist `#err` → one error toast, wallet unchanged, no second mint on the next overworld portal, next *new* chain can still pay. Force transport miss → claim kept, one error toast, no second mint. Victory persist throw still #1133-003. Portal XP throw still #1184-004. Ground Doka `#err` still retries the same coin.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-28-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Feat unlock toast / recap must not claim success before `markAchievementUnlocked` confirms  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `checkAndFireAchievement` (`WX` 2217–2250) `achievementsShownRef.current.add(cfg.id)` then `markAchievementUnlocked.mutate(cfg.id)` then either `setPendingAchievementToast(cfg)` (world, 4s `AchievementToast`) or `appendRecapUnlock` (in-battle → `attachRecapUnlocks`, #007 / #159). `useMarkAchievementUnlocked` (`useAdminQueries.ts` 346–367) has **no** `onError`, logs `[FEATS] UNLOCK`, and `return res` even when the actor payload is `#err`. AGENTS.md: `markAchievementUnlocked` rejects projected wallet/level totals against the pre-credit snapshot — a legal `#err` after the toast already claimed the feat. Shown-set then blocks a retry for the session. Claim-*reward* fail already toasts (`AchievementsPanel.tsx` 124 / 166 / 181). Spell-upgrade fail stays #1003 (`console.warn`). Distinct from #485 “Feat Unlocked” *copy*. Distinct from recap *section wiring* (#007). Distinct from `shouldDeferAchievementUnlockUntilRewardsPersist` (the defer is the mechanic; mute `#err` after a shown toast is INFORMATION). Distinct from challenge *fail* (#1003) and offer/expire (#1061).  
SYSTEMS_AFFECTED: `useMarkAchievementUnlocked` (`useAdminQueries.ts`); WorldExploration `checkAndFireAchievement` shown-set + toast/recap order (`WX` 2230–2244)  
RECOMMENDED_ACTION: Parse `#ok` / `#err` in the mutation. Toast error once on throw or `#err` (`"Feat didn't save"` / existing err). Do not add the world toast / recap row until `#ok` (or remove `cfg.id` from `achievementsShownRef` on fail so a later persist can retry). Do **not** change unlock conditions, Doka claim math, or the 4s toast duration. Do not toast every successful unlock twice (world toast *or* recap row is enough). Keep wallet/level feats deferred until `applyRewards` commits.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing sonner / `AchievementToast`; `attachRecapUnlocks`; #485 copy; #327 owns WX; union Recap if #845-002 is wired later  
REGRESSION_RISK: LOW — presentation / order on an already-failing write. Success must stay one toast or one recap row. In-battle queue must not drop a feat that later `#ok`s after persist. `doka_1000` / `level_10` must still wait for the post-credit snapshot. Double-fire guard (`achievementsShownRef`) must not toast twice on success.  
VALIDATION_REQUIRED: Unlock `explore_25_maps` in world with actor `#ok` → one toast, no error. Force `#err` / throw → one error toast, no “unlocked” chrome, a later successful persist can still show the feat. Victory recap feat row still appears only after `#ok` (or retries). Claim-reward fail still toasts from the panel. Spell-upgrade fail still #1003.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-28-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Boss Rush room-advance persist-fail needs a player cue after the next room already spawned  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Progression-portal advance (`WX` 6095–6110) `void advanceBossRushRoom()` then `cleanupMap()` + `spawnBossRushRoom(nextRoomIndex)` on the same tick — ACTION (next room) does not wait for persist. `advanceBossRushRoom` (`useBossRush.ts` 311–337) `setBossRushState` *before* `persistBossRushRoomAdvance`; catch is `console.error("[BossRush] Failed to save room progress:", e)` only. HUD already paints `Boss Rush — Room N / 10` (`WX` 17577–17598`). A reload can `resumeRoomFromPersisted` the *previous* room. #419 / 09-22-005 is the *success* room-advance *banner*. #845 / 10-21-001 is *Complete* on *victory*. #1133 / 10-26-003 is room-clear *reward* persist after recap showed the grant (`WX` 12863–12868). #803 is `complete(9)` / `abortBossRush` order — do not re-file. #1184 / 10-27-004 is overworld portal +10 XP persist-fail, not BR room index. Distinct from BR *nearby* (#1003). Distinct from run-*ended on death* (#1184-003). Distinct from BR *entry* IMPACT (004 this ledger).  
SYSTEMS_AFFECTED: WorldExploration BR progression-portal advance (`WX` 6095–6110); `useBossRush.ts` `advanceBossRushRoom` catch (`useBossRush.ts` 335–337)  
RECOMMENDED_ACTION: `toast.error` once on the room-advance persist catch (`"Boss Rush progress didn't save"` / existing err). Keep HUD / spawn order (do not block the next room on a replica blip). Do **not** change `persistBossRushRoomAdvance`, portal lock, or `abortBossRush` epoch. Success stays #419’s banner (or HUD chip). Do not toast every successful advance.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing sonner toast; #419 room-advance banner; #1133-003 room-clear reward fail; #803 abort persist order; #327 owns WX; union `useBossRush.ts` with #803  
REGRESSION_RISK: LOW — presentation on an already-failing catch. Success must stay quiet (or #419’s one banner). Abort mid-advance must still honour `persistEpoch` (no late restore). Death mid-Rush run-ended copy stays #1184-003. Final-room Complete stays #845.  
VALIDATION_REQUIRED: Clear room 0, step progression portal; persist ok → next room spawns, HUD Room 2/10, no error toast (#419 banner if wired). Force `persistBossRushRoomAdvance` throw → next room still spawns, one error toast, reload must not silently farm room 0’s grant again (persist order stays #803 / existing lock). Abort / death still #803 / #1184-003. Room-clear reward throw still #1133-003.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-28-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Boss Rush overworld-portal entry needs the same enter cue dungeon-chain already has  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `portal.isBossRushPortal || portal.color === "bossRush"` (`WX` 6077–6089) sets `lastPortalRef`, `cleanupMap()`, `bossRushActiveRef`, `void startBossRush().then(spawnBossRushRoom)`, and **returns before** `playSound("map_transition")` (`WX` 6283). `spawnBossRushRoom` (`WX` 5288–5378) writes the roster with no log, toast, or `setBossEncounterBanner`. Dungeon *enter* on the same function already logs `⚔️ Dungeon Chain entered! Prepare for ${newMaxDepth} escalating maps.` (`WX` 6332–6336) — 10-24 listed that log as the cited non-hole. BR *HUD chip* after `bossRushState.active` (`WX` 17577–17598`) is the cited non-hole for *progress*, not entry IMPACT. BR *nearby* is #1003 / 10-24-002. Room-*advance* banner is #419 / 09-22-005. *Complete* is #845 / 10-21-001. Rest/white *entry* toasts stay non-holes (`WX` 6142 / 6205). Rest-*exit* stays #894. Run-*ended on death* stays #1184-003. Room-advance *persist fail* is 003 this ledger. Distinct from boss-*colored* overworld encounter banner (`WX` 6496–6504) — that path is not `isBossRushPortal`.  
SYSTEMS_AFFECTED: WorldExploration Boss Rush entry branch (`WX` 6077–6089); optional `spawnBossRushRoom` (`WX` 5288–5378); existing `map_transition` / dungeon-enter log pattern  
RECOMMENDED_ACTION: One battle-log line (`"Boss Rush entered — Room 1 / 10"`) and reuse `playSound("map_transition")`. Optional short toast. Do **not** add a 1.5s banner that would stack with the first-room encounter. Do not change `startBossRush`, portal lock, or room 0 resume. Nearby label stays #1003. Room-advance banner stays #419. Complete stays #845.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing `map_transition`; dungeon-enter log as the copy pattern; #1003 nearby; #419 room-advance banner; #327 owns WX  
REGRESSION_RISK: LOW — presentation after an already-committed entry. Resume-into-room-N must not claim “Room 1” if `startBossRush` returned a later index — use the resolved `roomIndex`. Rest/white entry toasts must stay unique (do not steal their copy). Double-step guard (`lastPortalRef`) must not log twice.  
VALIDATION_REQUIRED: Step a Boss Rush overworld portal; one enter log (room index matches `startBossRush`); `map_transition` plays once; HUD chip appears; first-room encounter still starts. Resume into room 4 logs room 4, not room 1. Dungeon enter log unchanged. Rest/white entry toasts unchanged. Room-to-room step still #419 (not a second “entered” line). Complete still only on room 10 (#845).  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 … 10-27 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF). Still zero render call sites (`effects.ts` 331).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference). Distinct from #1003 spell-*book* upgrade. Distinct from #1184 portal *sound*.  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote (`WX` 15790–15799). Distinct from #845 Boss Rush *Complete*, from #1003 BR *nearby*, and from 004 this ledger (BR *entry* log).  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan (`WX` 8514–8529). Distinct from 09-29-002 (spell-slot AP) and from #894 hover *damage*.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT / Sacrifice source labels. Lava/spikes still sit in the movement RAF. Mirror Field reflect stays here. Lethal lava skipping Game Over is #1133-001. Thorn/rift *numbers* stay #523.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`). Item-buff chips are 09-29-001. Apply *float* is #845 / 10-21-003. True *expiry* is #845 / 10-21-004.  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait. Toast after teleport (`WX` 13486) is not the wait. #554 is the walk block. Nearby *Escape* is #1061. HUD *chip* is #1133-004.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number (`WX` 9344). Drain heal is still log-only. Distinct from #894 heal *hover*. Distinct from #1133-002 (overworld Doka-heal persist-fail).  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004. Potion *drink* stays 09-02-004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009 (003 is shrine *juice*; 002 is ability *numbers* / AP *drain*; 005 is BR *room-advance banner*; 006 is victory-persist *portal block*). Altar *tile* is #954; AP *grant* is #954; BR *nearby* is #1003. Recap persist-*fail* is #1133-003. Portal XP persist-*fail* is #1184-004. BR *entry* log is 004 this ledger. BR *room-advance persist fail* is 003 this ledger.  
- **#478 queue** — GFCF-2026-09-23-001…005. Portal +10 *success* float stays 005 there. Portal *level-up sound* is #1184-002.  
- **#523 queue** — GFCF-2026-09-24-001…004. Void Rift *cell* stays 001 there.  
- **#571 queue** — GFCF-2026-09-25-001…005.  
- **#610 queue** — GFCF-2026-09-26-001…004. Sealed *log* stays 001 there.  
- **#678 queue** — GFCF-2026-09-27-001…004.  
- **#735 queue** — GFCF-2026-09-28-001…004.  
- **#772 queue** — GFCF-2026-09-29-001…004.  
- **#845 queue** — GFCF-2026-10-21-001…004. Recap *rows* stay 002 there; fail *rising-edge* is #1003. BR *Complete* stays 001 there; run-*ended on death* is #1184-003.  
- **#894 queue** — GFCF-2026-10-22-001…004. Rest-*exit* stays 001 there.  
- **#954 queue** — GFCF-2026-10-23-001…004. Shock *cell* / shrine *tile* / rim / Dawn +AP stay there.  
- **#1003 queue** — GFCF-2026-10-24-001…004. White / BR nearby, spell-upgrade toast, challenge-*fail* rising-edge.  
- **#1061 queue** — GFCF-2026-10-25-001…004. Death Realm *Escape* nearby, challenge offer/expire, shop Buy persist-fail.  
- **#1133 queue** — GFCF-2026-10-26-001…004. In-battle lava skip Game Over, heal persist-fail after success toast, victory persist-fail after recap, Death Realm HUD chip.  
- **#1184 queue** — GFCF-2026-10-27-001…004. Death-save fail, portal level-up sound, run-ended on death, portal XP persist-fail.

TBC remains WAITING (**#1165**; #1108 was 10-26). Do not invent feel-telemetry (015 / AQA-012).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs stay PXA/MIMA. **Invincible / `damageImmune`:** unread on player hits — stay MIMA. **Shell Armor** on the player-spell path is applied — #735 / 09-28-002. **Vampiric Ground** `onDamageDealt` mutates a throwaway `attacker` object in `enemyTakesDamage` — MIMA, not a heal float (#1148 commits it *off* `main`). **`mirrorRedirect`** never fires — dead-code, not a feel ID. **`_leaderBoostMultiplier`** unread — MIMA. **`applyRangeModification` / `tickModifiableRangeBonuses`** are `void`ed unused — dead-code, not a mute range chip. **Summon-control walk thorns / Void Rift:** `applyControlledSummonWalk` never calls `applyBattleWalkHazards` — no damage applied (MIMA parity), not a mute float. **#803** persist `complete(9)` / `abortBossRush` order is not 003’s room-advance fail and not 004’s entry log. **#754** Swap landing tax is not the Swap puff (#523). **#799** bomber/Inferno share is combat truth; detonate already `processCombatantDeath`s. **#850–#1217** kit execute-share / remount-wipe / portal snaps / pack-enemy buffs / leftover-XP wipe / Glass Realm ×2 / Iron Curse / Vampiric Ground / Chaos shuffle / larva-explode commit are combat/persist/map truth, not on `main`. **#728** End Turn lock is combat; leftover *title* is #894. **`res.newPositions`** unread in WX — MIMA. **`res.damageToTargets`** unread — MIMA. **`boardClaimZone`** stored and never taxed — MIMA; do not tint. **Ink Veil `glyphedTiles`:** designed invisible — MIMA, not a missing tint. **Boss `void` hazard** paints as spikes and landing ignores it — MIMA. **Dawn `damageToPlayer: -10`:** WX requires `> 0` — MIMA, not #954-004. **`covenantBuffMapsRef`:** written, unread — PXA/MIMA. **Resonance counter** deadlock — MIMA, not a countdown HUD. **Illusions / larvae / `reflectShieldTurnsLeft` / `magicReflectActive`:** unread or never ticked — MIMA. **Swift Winds / Mending Mist on the player:** hooks do not land — MIMA (#1199 / #1202 commit them *off* `main`). **Glass Realm 2×:** `applyDamageToEnemy` never calls `applyDamageDealt` on `main` — MIMA, not a hover-lie ID (#894 is Fury/Blood Moon; #1160 commits Glass Realm *off* `main`). **White / rest gen-fail after `cleanupMap`:** AQA / GMI, not this ledger (Death Realm already has fallback + toast). **Enemy AI `decide/apply` throw:** exception path, silent advance — not a listed player moment.

## Explicit non-holes from this search

- Flee: confirm dialogs present on dungeon / Boss Rush (`WX` 18918–18935). Overworld flee is intentionally unconfirmed.  
- Player End Turn: `title=` already says leftover AP/MP are lost (`BattleUIPanel.tsx` 553). Summon End Turn *title* is #894. Controlled-summon 0/0 auto-end is next-turn log + dock dismiss — not filed.  
- Rest / sanctuary *entry*: toasts present (`WX` 6142 / 6205). Rest-*exit* is #894. Rest whirlpool rings are enough — **do not add a rest nearby label**. White *sanctuary* nearby is #1003. Death Realm *exit* nearby is #1061. Death Realm *HUD chip* is #1133-004. Do **not** add a sanctuary HUD chip (`generateRestMap` sets `isRestMap`).  
- Ground Doka: sound + float + log. Wallet credits on persist commit; `#err` releases the claim so the coin can retry — 10-26 listed this as a non-hole (not a lying *toast*). Do not twin as a persist-fail ID. Dungeon-complete *success* trophy log stays a non-hole; persist-*fail* after that log is 001 this ledger.  
- Map modifiers: log + `MapModifiersPanel`. Time Warp footer timer is enough. Blood Moon *number* is #894. Ice / lava / spikes floor tints already exist.  
- Challenge HUD: `shouldShowChallengeHud` keeps the panel after accept. Recap rows stay #845. Rising-edge fail is #1003. Offer *log* / unaccepted *expire* stay #1061.  
- **Player** summon spawn: puff + SFX + log. Fade log already says `"{name} fades away..."` (`summonLifespan.ts` 36). Fade *canvas* stays #419.  
- Dungeon-chain *enter* / *progress* logs already name the run (`WX` 6332–6336 / 6398–6401). Nearby dungeon portal label stays a non-hole. Complete *success* trophy log stays a non-hole; persist-*fail* is 001 this ledger.  
- Player DoT ticks: already go through `playerTakesDamage`. Enemy DoT ticks already go through `enemyTakesDamage`.  
- Leader death: `"LEADER DEFEATED!"` overlay. Erratic *why* is #735. Unused `leader_boost` SFX is a dead hook — do not add spectacle.  
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
- `abortBossRush` `resetBossRush` fail is `console.error` (`useBossRush.ts` 348) — persist order owned by **#803**; do not re-file as GFCF. Run-*ended copy* is #1184-003. Room-*advance persist fail* is 003 this ledger.  
- Portal +10 *success* HUD-after-commit is the unpaid-XP fix; the missing *level-up sound* is #1184-002; the missing *fail toast* is #1184-004; the missing *float* stays #478.  
- Feat *claim reward* already toasts success and fail. Unlock *show* on `#ok` is the cited non-hole; mute `#err` after a shown toast is 002 this ledger.  
- BR *HUD chip* after `bossRushState.active` is the cited non-hole for *progress*. *Entry* log / SFX is 004 this ledger.  

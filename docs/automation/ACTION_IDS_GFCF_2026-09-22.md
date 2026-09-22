# Game Feel ACTION_IDs — 2026-09-22

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-09-22.md`  
**HEAD:** `0f5363f`

Prior IDs `GFCF-2026-08-31-001` … `015` live in `ACTION_IDS_2026-08-31.md`.  
`GFCF-2026-09-01-001` … `003` live in `ACTION_IDS_2026-09-01.md`.  
`GFCF-2026-09-02-001` … `005` live in `ACTION_IDS_GFCF_2026-09-02.md`.  
`GFCF-2026-09-21-001` … `004` are **queued in #363** (not on `main`).  
This file records this run’s implementations and **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 items as NEW.

---

ACTION_ID: GFCF-2026-09-21-005  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Attack Nearest no-legal-target is footer flash only  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `attackNearestEnemy` already `setNoTargetFlash(true)` for 1.2s when the heal probe fails or `pickNearestAttackableHostile` is null (`WX` ~17300 / ~17317). Footer copy is `"⚠️ No target in range"` (`WX` 19037). Tile/sprite illegal clicks already float a reason. The flash is easy to miss if the panel is folded. Post-fix: `NO_TARGET_COPY` (`"No target"`) at the player tile; flash kept. Distinct from 09-02-005 (AP, #363) and 09-21-001 (turn, #363).  
SYSTEMS_AFFECTED: `engine/attackNearestFeel.ts`; WorldExploration `attackNearestEnemy` no-target returns  
RECOMMENDED_ACTION: IMPLEMENT. One `"No target"` float. Keep the existing flash. Do not widen range.  
AUTONOMY: IMPLEMENTED_THIS_PR  
DEPENDENCIES: none; string matches #363 `SUMMON_NO_TARGET_COPY`  
REGRESSION_RISK: LOW — copy on an already-failing return.  
VALIDATION_REQUIRED: Attack mode + Strike with no hostile in range; press S; one float; no cast; flash still runs. `attackNearestFeel.test.ts`.  
STATUS: IMPLEMENTED

---

ACTION_ID: GFCF-2026-09-22-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Give enemy melee the same IMPACT juice as spell hits (without changing RES)  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemy spell path calls `playerTakesDamage` (`WX` 16566–16593) which spawns a damage float, hit-flash, shake, and log. The melee / fallback path (`WX` 16749–16788) mutates HP via `setCharacterStats`, optionally logs shield absorb, logs `"strikes you for N dmg"`, and never calls `spawnDamageAtTile` / `playSound`. A basic claw hit is quieter than a spell. Distinct from GFCF-003 (player→enemy) and GFCF-011 (lava/spikes/reflect labels). **Do not** call `playerTakesDamage` here — that helper applies RES (`WX` 3428–3432) which melee currently skips (combat-parity / MIMA).  
SYSTEMS_AFFECTED: WorldExploration enemy melee branch only  
RECOMMENDED_ACTION: After the existing shield + HP write, `spawnDamageAtTile(..., meleeDmg, "damage")` and the existing player-hit sound when `meleeDmg > 0`. Keep the death bisect (`characterStats.hp - meleeDmg`). Do not change melee math.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-08-31-001  
REGRESSION_RISK: LOW if juice-only; MEDIUM if routed through `playerTakesDamage` (RES + double shield).  
VALIDATION_REQUIRED: Force an adjacent melee hit; one red float; HP matches log; lethal melee still opens Game Over; RES does not newly apply.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Announce boss-ability damage and AP drain on the canvas  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Boss ability resolution (`WX` 16025–16045) applies `damageToPlayer` and `playerApModifier` with no `logBattleEntry`, no float, no sound. Shield absorb on this path is also mute. `logMessage` on the AI action is optional and often absent. Distinct from 001 (normal enemy melee). Do not route through `playerTakesDamage` (RES).  
SYSTEMS_AFFECTED: WorldExploration boss-ability apply block  
RECOMMENDED_ACTION: Log + `spawnDamageAtTile` when `finalDmg > 0`. Float `"-N AP"` when `playerApModifier < 0`. Shield full-absorb should log Shield. Do not change ability formulas.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-08-31-001  
REGRESSION_RISK: LOW — presentation on an already-committed ability result.  
VALIDATION_REQUIRED: Trigger a damaging boss ability; float + log match `finalDmg`; AP drain shows a short float; shield full-absorb still says Shield.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Shrine altar needs the same pickup juice as ground Doka  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Altar step (`WX` 11298–11354) claims 300 Doka and may set a 3-map covenant, then `setShrineCompleted(true)` into unused `_shrineCompleted` (no render). No `logBattleEntry`, toast, `playSound`, or `spawnDoka`. Ground Doka on the same movement tick (`WX` 11366–11420) already plays sound + float + log. Player can finish a shrine room without knowing anything paid. PXA owns covenant honesty; this ID is IMPACT only.  
SYSTEMS_AFFECTED: WorldExploration shrine altar branch  
RECOMMENDED_ACTION: On successful `tryClaimFlag`, reuse `playSound("doka_collected")` + `spawnDoka` / float `"300"` and one log line (`"Shrine grants 300 Doka"` / covenant line if pure). Do not change the 300 grant or persist lock.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: none for juice; PXA for covenant meaning  
REGRESSION_RISK: LOW — presentation after `tryClaimFlag`.  
VALIDATION_REQUIRED: Walk onto altar; one Doka pickup juice; impure path still pays 300 without covenant copy; double-step does not double-mint.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float when Attack Nearest hotkey fires outside Attack mode / with no spell  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `attackNearestEnemy` returned immediately when `battleActionMode !== "attack"` or `!selectedSpellIdRef.current` (`WX` 17219–17224) with no float. Footer `canAttackNearest` already requires Attack mode + selected spell and disables the button, but `[S]` (`WX` 17368–17374) still calls the function. Post-fix: `attackNearestModeRejectCopy` floats `"Switch to Attack"` or `SELECT_SPELL_COPY`. Overworld `[S]` stays quiet. Distinct from owned off-turn / `no_ap` (#363) and no-target (09-21-005).  
SYSTEMS_AFFECTED: `engine/attackNearestFeel.ts`; WorldExploration `attackNearestEnemy` early return  
RECOMMENDED_ACTION: IMPLEMENT. Do not enable the button. Do not change targeting.  
AUTONOMY: IMPLEMENTED_THIS_PR  
DEPENDENCIES: `SELECT_SPELL_COPY`  
REGRESSION_RISK: LOW — copy on already-failing returns.  
VALIDATION_REQUIRED: Walk mode + press S → one `"Switch to Attack"`; Attack mode no spell → one `"Select a spell"`; legal Attack Nearest unchanged. `attackNearestFeel.test.ts`.  
STATUS: IMPLEMENTED

---

ACTION_ID: GFCF-2026-09-22-005  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Banner Boss Rush room transitions like boss portal entry  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Progression portal advance (`WX` 6095–6110) calls `advanceBossRushRoom` + `spawnBossRushRoom` (`5288–5378`) with no log, toast, or `setBossEncounterBanner`. Boss-colored portal entry already shows `☠️ BOSS ENCOUNTER: …` for 1.5s (`WX` 6496–6504). Room clears feel like a silent map swap. Distinct from phase-2 log-only (009).  
SYSTEMS_AFFECTED: WorldExploration boss-rush portal advance + optional `spawnBossRushRoom`  
RECOMMENDED_ACTION: Reuse `setBossEncounterBanner` with `"Room N"` (or log + short toast). Do not auto-start combat or change portal lock rules.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing `bossEncounterBanner` UI  
REGRESSION_RISK: LOW — presentation only.  
VALIDATION_REQUIRED: Clear room 0, step progression portal; one banner/toast; room index advances once.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-006  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Explain victory-persist portal blocks  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `checkPortalInteraction` silently returns while `victoryPersistPendingRef` is set (`WX` 5986–5990). The player has already stepped onto the tile; nothing happens. Distinct from Death Realm guard (013) and sealed-progression log (`WX` 6060–6064). In-battle `shouldBlockWorldMoveOntoPortal` is world-mode-only after the `inBattle` return — desync-only, not filed.  
SYSTEMS_AFFECTED: WorldExploration `shouldBlockPortalDuringVictoryPersist` early return  
RECOMMENDED_ACTION: Float `"Rewards settling…"` once per attempt. Do not change the block.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: none  
REGRESSION_RISK: LOW — copy only.  
VALIDATION_REQUIRED: During victory persist, step on a portal; one float; portal does not fire twice.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-007  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Canvas float when a summon’s lifespan expires  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `expireSummonsAtTurnStart` only logs `"fades away..."` (`summonLifespan.ts` 36). Spawn already has puff + SFX + log. Distinct from #363 summon-control walk/kit silence. Drain heal stays under 014 (do not duplicate).  
SYSTEMS_AFFECTED: `summonLifespan.ts` caller in WorldExploration (~14074)  
RECOMMENDED_ACTION: One `"Fades"` float (or reuse the existing death puff) at the summon tile. Do not change lifespan rules.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-08-31-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Summon at 0 remaining turns; one fade float + existing log; turn queue still drops the id.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-008  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float when Attack / spell-slot clicks are ignored at 0 AP  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `onSetAttack` only switches when `currentBattleAp > 0` (`WX` 18911–18913). Spell-slot `onSelectSpell` ignores selection in battle when AP is 0 (`WX` 18842–18848). Titles/opacity exist on the Attack button, but the click itself produces no float. Distinct from tile `SELECT_SPELL_COPY` (already shipped for empty Attack-mode canvas clicks).  
SYSTEMS_AFFECTED: WorldExploration BattleUIPanel wiring  
RECOMMENDED_ACTION: Float `"Not enough AP"` on ignored Attack toggle / spell select (same copy as tile `playerFacingCastResult("no_ap")`). Do not allow selecting spells at 0 AP.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: none  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Spend to 0 AP; click Attack and a spell slot; one float each; End Turn still works.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-009  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Optional “Your turn” canvas banner (log already exists)  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: MEDIUM  
EVIDENCE: Turn start logs `"Your turn"` (`WX` 14399; battle start 12235–12237). Initiative strip / panel name update. Summon control already gets top chrome `"Summon's Turn"` (`WX` 18822–18826). No reuse of `bossEncounterBanner` for the player. Easy to miss after a long enemy cycle. Distinct from phase-2 (009). **Do not** add a long banner — that would slow turns.  
SYSTEMS_AFFECTED: WorldExploration player-turn dispatch  
RECOMMENDED_ACTION: Short fade banner `"Your turn"` (≤1s) or pulse the existing strip. Do not pause the timer. Skip if it stacks with summon chrome.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: optional reuse of `bossEncounterBanner`  
REGRESSION_RISK: LOW if short; avoid spectacle  
VALIDATION_REQUIRED: End enemy turn → one brief banner; timer still 30s; summon turn still shows Summon's Turn.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`).  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004.

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf).

## Explicit non-holes from this search

- Flee: confirm dialogs present.  
- End Turn disabled: `title=` explains summon / wait.  
- Rest portal: toast present.  
- Ground Doka: sound + float + log.  
- Map modifiers: log + `MapModifiersPanel`.  
- Challenge HUD: panel fail/on-track chrome.  
- Summon spawn: puff + SFX + log.  
- In-battle world-mode portal click: only reachable on `inBattle` / ref desync.

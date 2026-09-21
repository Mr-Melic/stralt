# Game Feel ACTION_IDs — 2026-09-21

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-09-21.md`

Prior IDs `GFCF-2026-08-31-001` … `015` live in `ACTION_IDS_2026-08-31.md`.  
`GFCF-2026-09-01-001` … `003` live in `ACTION_IDS_2026-09-01.md`.  
`GFCF-2026-09-02-001` … `005` live in `ACTION_IDS_GFCF_2026-09-02.md`.  
This file records this run’s implementations and **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 as NEW.

---

ACTION_ID: GFCF-2026-09-02-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float controlled-summon walk rejects on the canvas  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Player battle-walk already floated `"Not enough MP"` / `"Can't reach"` (006). Controlled-summon walk logged those strings and returned silently on empty path (pre-fix `WX` ~10086 / ~10785). Post-fix: `classifySummonControlWalkReject` (`walkRejectCopy.ts`) + `playerFacingWalkReject` at mouse/touch control branches. Self-tile stays quiet. Empty path (including adjacent blocked) floats `"Can't reach"`. 0 leftover MP uses `"No MP"` to match player walk.  
SYSTEMS_AFFECTED: `engine/walkRejectCopy.ts`; WorldExploration summon-control click/touch walk branch  
RECOMMENDED_ACTION: IMPLEMENT. Reuse player walk copy. Do not change `findPath`, MP debit, or summon AI.  
AUTONOMY: IMPLEMENTED_THIS_PR  
DEPENDENCIES: GFCF-2026-08-31-006  
REGRESSION_RISK: LOW — copy only. Occupied / wall cases must not start a walk.  
VALIDATION_REQUIRED: Control a wolf; click a far tile with 0 leftover MP; one canvas float; adjacent legal walk unchanged. `walkRejectCopy.test.ts`.  
STATUS: IMPLEMENTED

---

ACTION_ID: GFCF-2026-09-02-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Canvas float when Paper Windstorm blows a spell off course  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Player miss is a 30% `paperWindstormMiss` that only logged (pre-fix `WX` ~9563). Enemy miss is 50% when `range > 1` (pre-fix ~16491 / ~16729), also log-only. Announce text still claims “reach halved” (PXA owns that copy lie). Post-fix: `PAPER_WINDSTORM_MISS_COPY` (`"Missed!"`) at the target tile on all three branches. Rolls unchanged.  
SYSTEMS_AFFECTED: `engine/rejectCopy.ts`; WorldExploration `paperWindstormMiss` + enemy AI miss branches  
RECOMMENDED_ACTION: IMPLEMENT. One short `"Missed!"` float. Do not change the 30%/50% rolls or range. Do not add extra particles.  
AUTONOMY: IMPLEMENTED_THIS_PR  
DEPENDENCIES: none for the float; PXA owns announce-text vs live miss  
REGRESSION_RISK: LOW — single float. No modal or 1.5s banner.  
VALIDATION_REQUIRED: Force the miss branch; one float; AP still spent; no second fizzle string. `rejectCopy.test.ts`.  
STATUS: IMPLEMENTED

---

ACTION_ID: GFCF-2026-09-02-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Potion / item use needs the same IMPACT as spell heals  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `handleUseItem` restored HP / AP / MP and only logged (pre-fix `WX` ~3545). Post-fix: `buffItemHealAmount` / `buffItemResourceFloat` (`itemUseFeel.ts`) spawn the existing green heal number or `+3 AP` / `+2 MP` / `+20 Shield` / `+25% Dmg` at the player tile. Math unchanged.  
SYSTEMS_AFFECTED: `engine/itemUseFeel.ts`; WorldExploration `handleUseItem`  
RECOMMENDED_ACTION: IMPLEMENT. Reuse `spawnDamageAtTile` / `spawnFloatText`. Do not change potion math or shop prices.  
AUTONOMY: IMPLEMENTED_THIS_PR  
DEPENDENCIES: GFCF-2026-08-31-001  
REGRESSION_RISK: LOW — presentation on an already-committed item use.  
VALIDATION_REQUIRED: Use a health potion in battle; green number matches the log amount; wallet/item count still decrements once. `itemUseFeel.test.ts`.  
STATUS: IMPLEMENTED

---

ACTION_ID: GFCF-2026-09-02-005  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Attack Nearest hotkey should float when AP is missing  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Footer button already requires `canAffordCastAp` and disables. `attackNearestEnemy` returned with no float when `planPlayerCastResources` failed for `no_ap` (pre-fix only `"On cooldown"` floated). `[S]` bypasses the disabled button. Tile casts already used `playerFacingCastResult("no_ap")` → `"Not enough AP"`. Post-fix: both `no_ap` and `on_cooldown` use that helper.  
SYSTEMS_AFFECTED: WorldExploration `attackNearestEnemy` only  
RECOMMENDED_ACTION: IMPLEMENT. Same copy as tile `castResult === "no_ap"`. Do not enable the button. Do not change AP math.  
AUTONOMY: IMPLEMENTED_THIS_PR  
DEPENDENCIES: none  
REGRESSION_RISK: LOW — copy on an already-failing return.  
VALIDATION_REQUIRED: Select a 4-AP spell with 1 AP left; press S; one float; no cast. Button stays disabled.  
STATUS: IMPLEMENTED

---

ACTION_ID: GFCF-2026-09-21-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Attack Nearest hotkey should float when it is not the player turn  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `shouldAllowPlayerCastEntry` already blocked Attack Nearest off-turn (`WX` ~17226) with no float. Tile/sprite leftover-spell clicks floated `WAIT_FOR_TURN_COPY` (09-02-001). `[S]` bypasses the disabled footer. Post-fix: same copy at the player tile.  
SYSTEMS_AFFECTED: WorldExploration `attackNearestEnemy` only  
RECOMMENDED_ACTION: IMPLEMENT. Do not change the gate.  
AUTONOMY: IMPLEMENTED_THIS_PR  
DEPENDENCIES: GFCF-2026-09-02-001  
REGRESSION_RISK: LOW — copy on an already-failing return.  
VALIDATION_REQUIRED: Select a spell; wait for an enemy turn; press S; one `"Wait for your turn"`; no cast.  
STATUS: IMPLEMENTED

---

ACTION_ID: GFCF-2026-09-21-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float summon-control kit cast failures on the canvas  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `castControlledSummonSpell` logged `summonControlCastFailMessage` (`no_ap` / `out_of_range` / `illegal_target`) and returned with no canvas reason (pre-fix `WX` ~9843). Player tile casts already float the same class of copy. Post-fix: one float at the clicked target tile.  
SYSTEMS_AFFECTED: WorldExploration `castControlledSummonSpell`  
RECOMMENDED_ACTION: IMPLEMENT. Reuse `summonControlCastFailMessage`. Do not change AP debit or the live gate.  
AUTONOMY: IMPLEMENTED_THIS_PR  
DEPENDENCIES: none  
REGRESSION_RISK: LOW — copy on an already-failing return.  
VALIDATION_REQUIRED: Control a wolf; pick a kit spell; click a target out of range; one float matching the log; no AP spend.  
STATUS: IMPLEMENTED

---

ACTION_ID: GFCF-2026-09-21-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Explain summon-control kit clicks that have no target  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: With `selectedSummonSpellId` set, mouse/touch only cast when `pickSummonControlClickTarget` found a hostile (pre-fix `WX` ~10075 / ~10774). Empty floor / wall clicks returned with no float, so a selected kit looked dead. Post-fix: `SUMMON_NO_TARGET_COPY` (`"No target"`).  
SYSTEMS_AFFECTED: `engine/rejectCopy.ts`; WorldExploration summon-control click/touch kit branch  
RECOMMENDED_ACTION: IMPLEMENT. Do not start a walk while a kit spell is selected.  
AUTONOMY: IMPLEMENTED_THIS_PR  
DEPENDENCIES: none  
REGRESSION_RISK: LOW — copy only. Legal kit casts unchanged.  
VALIDATION_REQUIRED: Control a wolf; select Bite; click empty floor; one `"No target"`; click a legal enemy still casts.  
STATUS: IMPLEMENTED

---

ACTION_ID: GFCF-2026-09-21-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Sacrifice self-HP needs a canvas damage number  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `loseSelfHp` records challenge damage and writes HP with a floor of 1 (`WX` ~9374) but never called `playerTakesDamage`, so there was no number/flash. Distinct from 011 (lava/spikes live in the movement RAF — do not touch). Post-fix: `spawnDamageAtTile(..., recorded.lost, "damage")` when `lost > 0`.  
SYSTEMS_AFFECTED: WorldExploration `loseSelfHp` callback  
RECOMMENDED_ACTION: IMPLEMENT. Do not route Sacrifice through `playerTakesDamage` (would change Untouchable / shield / RES). Number only.  
AUTONOMY: IMPLEMENTED_THIS_PR  
DEPENDENCIES: GFCF-2026-08-31-001  
REGRESSION_RISK: LOW — presentation on already-recorded loss.  
VALIDATION_REQUIRED: Cast Sacrifice; red number equals `recorded.lost`; HP floors at 1; challenge total still matches.  
STATUS: IMPLEMENTED

---

ACTION_ID: GFCF-2026-09-21-005  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Attack Nearest no-legal-target is footer flash only  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `attackNearestEnemy` still `setNoTargetFlash(true)` for 1.2s when heal probe fails or `pickNearestAttackableHostile` is null (`WX` after this PR, same flash as before). Tile/sprite illegal clicks float a reason. The footer flash is easy to miss if the panel is folded or off-screen (MAA-007). Distinct from 09-02-005 (AP) and 09-21-001 (turn).  
SYSTEMS_AFFECTED: WorldExploration `attackNearestEnemy`  
RECOMMENDED_ACTION: One `"No target"` float at the player tile on those two returns. Keep the existing flash. Do not widen range.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-09-21-003 copy may be reused  
REGRESSION_RISK: LOW — copy on an already-failing return.  
VALIDATION_REQUIRED: Attack mode + Strike with no hostile in range; press S; one float; no cast; flash still runs.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF — do not add juice there without an RAF exemption.  
- **GFCF-2026-08-31-012** P2 — duration digit on status pills.  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf).

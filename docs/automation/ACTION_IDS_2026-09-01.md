# Game Feel ACTION_IDs — 2026-09-01

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**HEAD:** `dd275aa`  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-09-01.md`

Prior IDs `GFCF-2026-08-31-001` … `015` live in `ACTION_IDS_2026-08-31.md`. This file records this run’s implementations and **new unique** recommendations only. Do not re-open 003–005 / 009–015 as NEW.

---

ACTION_ID: GFCF-2026-08-31-006  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float walk rejects (no MP / unreachable)  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Battle walk (WX mouse ~11123 / touch ~11759) returned on `currentBattleMp <= 0`, wall/void, `!reachable`, empty path, and `cost > currentBattleMp` with no float. Occupied already said `"Occupied"`. Hover MP (WX ~9150) still uses Manhattan `dist`, not `findPath.length`. Post-fix: `spawnWalkRejectFloat` on those five returns (mouse + touch). Hover path cost left unchanged (RAF-hot).  
SYSTEMS_AFFECTED: `engine/walkRejectCopy.ts`; WorldExploration walk click/touch only  
RECOMMENDED_ACTION: IMPLEMENT. Float `"No MP"` / `"Can't walk there"` / `"Can't reach"` / `"Not enough MP"`. Do not change `findPath` or `MOVEMENT_DURATION`.  
AUTONOMY: IMPLEMENTED_THIS_PR  
DEPENDENCIES: None  
REGRESSION_RISK: LOW — copy only. Hover label can still disagree with path cost (ANTICIPATION leftover; do not pathfind every RAF frame).  
VALIDATION_REQUIRED: 0 MP click → “No MP”. Wall → “Can't walk there”. Distant tile → “Can't reach”. `node --experimental-strip-types --test src/frontend/src/engine/walkRejectCopy.test.ts`.  
STATUS: IMPLEMENTED  

---

ACTION_ID: GFCF-2026-08-31-008  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Play the existing level_up sound when recap level increases  
CATEGORY: reward-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `level_up` existed in `useSoundHooks.ts` / `soundEngine.ts` and was never played. #108/#138 merged leftover XP (`recapXpAfterGrant`). This PR plays `level_up` when `shouldAnnounceLevelUp(characterStats.level, recapXp.level)` (victory WX ~13161) or `leveled.newLevel` (Boss Rush WX ~13501). Recap header still shows only `Level {currentLevel}` (`PostBattleRecap.tsx` ~257 / ~285) with no LEVEL UP chrome.  
SYSTEMS_AFFECTED: `engine/rewardFeel.ts`; WorldExploration recap fire sites only  
RECOMMENDED_ACTION: Sound shipped. Remaining: one-line gold “Level N” on the existing recap header when level increased. Do not add confetti. Do not reopen the curve.  
AUTONOMY: IMPLEMENTED_THIS_PR (sound) / RECOMMEND (banner)  
DEPENDENCIES: #108/#138 merged  
REGRESSION_RISK: LOW — one sound, gated on level increase. No XP write.  
VALIDATION_REQUIRED: Grant enough XP to cross a level; `level_up` once; bar still `100 * 2^(N-1)`. No sound when leftover XP stays in-level. `rewardFeel.test.ts`.  
STATUS: PARTIAL  

---

ACTION_ID: GFCF-2026-09-01-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Map barrier live-cast tokens and leftover invalid-target floats  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: After barrier LoS landed, `isTileCastableLive` emits `ground_barrier`, `line_blocked_barrier`, `line_los_blocked`, `barrier_tile` (`targeting.ts` ~598–665). `REJECT_COPY` omitted them, so `playerFacingRejectReason` fell through to “Invalid target”. Tile-branch self-hit and `!shouldExecuteLiveCast` floated raw `"invalid target"` (pre-fix WX ~11017 / ~11644) instead of the probe reason.  
SYSTEMS_AFFECTED: `engine/rejectCopy.ts`; WorldExploration tile-cast leftovers  
RECOMMENDED_ACTION: IMPLEMENT. Add the four tokens. Use `playerFacingRejectReason("self_other_tile")` and `_live.reason` on the leftover tile misses. DEV `recordClickOutcome` tokens stay raw.  
AUTONOMY: IMPLEMENTED_THIS_PR  
DEPENDENCIES: GFCF-2026-08-31-002  
REGRESSION_RISK: LOW — copy only. Unknown future tokens still fall back to “Invalid target”.  
VALIDATION_REQUIRED: Cast into a barrier / blocked LoS; float is “Blocked” or “No line of sight”. Self-tile hostile → “Invalid target”. `rejectCopy.test.ts`.  
STATUS: IMPLEMENTED  

---

ACTION_ID: GFCF-2026-09-01-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Explain attack-mode clicks when no spell is selected  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Mouse and touch battle handlers fall through to `else { /* Attack mode with no spell selected — silent return */ }` (WX ~11197 / ~11833). INFORMATION is empty: the player cannot tell whether another action is possible (select a spell vs End Turn vs walk). UX #132 titled the Attack button; canvas clicks still have no float.  
SYSTEMS_AFFECTED: WorldExploration attack-mode empty branch  
RECOMMENDED_ACTION: Float `"Select a spell"` (or reuse footer copy) at `tileCenter`. One float, no modal, no gameplay change.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Enter attack with no spell; click a tile; one float. Selecting a spell then clicking a target is unchanged.  
STATUS: NEW  

---

ACTION_ID: GFCF-2026-09-01-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float world-mode unreachable (non-adjacent empty path)  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: MEDIUM  
EVIDENCE: World-mode click (WX ~11189+) sets `clickedTile` then `findPath`. Empty path only auto-steps if Chebyshev-adjacent; otherwise the gold tint appears and nothing walks. Player cannot tell *why* (blocked vs void vs no path). Distinct from battle-walk 006.  
SYSTEMS_AFFECTED: WorldExploration world-mode click/touch  
RECOMMENDED_ACTION: Float `"Can't reach"` when path is empty and the adjacent fallback does not apply. Do not change `findPath` or portal guards.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Click an isolated floor across a wall; float once; adjacent floor still steps.  
STATUS: NEW  

---

## Still open from 2026-08-31 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count).  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels.  
- **GFCF-2026-08-31-012** P2 — duration digit on status pills.  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped).

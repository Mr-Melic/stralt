# ACTION_IDs — 2026-10-25 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-10-25.md`](./DATA_EVOLUTION_AUDIT_2026-10-25.md).  
HEAD: `0f5363f`.  
Do not clone #490 / #1014 / #508 / #577. Do not edit WX / main.mo / BuffShop /
versionGate / deathPenalty / App / AchievementsPanel / combatMath this stack.

---

## NEW (this run)

ACTION_ID: SDEG-2026-10-25-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Ground-Doka feat counter increments before credit settle (release retries re-count)  
CATEGORY: persist-evolution  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 11366–11407 increments `groundDokaPickupCountRef` and writes `*_pbv_ground_doka_pickups` immediately after `tryClaimPickupId`, outside `resolveOneShotCreditSettle`. On `release` (11391–11392) the pickup id is freed for wallet safety but the counter is not rolled back — each failed credit + retry adds toward `loot_10_doka` → `markAchievementUnlocked`. Victory/idle gates read that counter (2277–2278, 12486).  
SYSTEMS_AFFECTED: `WorldExploration.tsx` (call site); feat progress canister  
RECOMMENDED_ACTION: Helper `shouldCountGroundDokaPickupForFeat(settle)` + bump/persist only on `commit`. Do not change applyRewards amounts. **WX edit required for lock** — defer while WX persist PRs queue; ship helper+tests only if stack allows.  
AUTONOMY: HELPER_ONLY_UNTIL_WX  
HELPER_ONLY_WITHOUT_FORBIDDEN_FILES: NO (needs WX)  
STATUS: OPEN  
PLAYER_BENEFIT: HIGH — stops unearned loot feat unlocks  
CORRECTNESS_BENEFIT: HIGH  
COMPLEXITY: LOW  
REGRESSION_RISK: LOW — counter only; wallet settle path unchanged  

---

ACTION_ID: SDEG-2026-10-25-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Overworld `loot_10_doka` recheck is gated on mapsVisited delta only  
CATEGORY: persist-evolution  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 2260–2284 runs `groundDokaPickupCountRef >= 10` only inside `if (mapsVisited !== prev.mapsVisited)`. Pickup commits change `dokaBalance` but that branch never evaluates loot_10. Battle victory still passes `groundDokaPickups` (12483–12496). Pure overworld 10th coin waits for next portal or a win.  
SYSTEMS_AFFECTED: `WorldExploration.tsx` idle achievement effect  
RECOMMENDED_ACTION: Also evaluate loot_10 when the pickup counter (or a dedicated tick) changes after commit. Helper can own the predicate; WX must call it.  
AUTONOMY: HELPER_ONLY_UNTIL_WX  
HELPER_ONLY_WITHOUT_FORBIDDEN_FILES: NO (needs WX)  
STATUS: OPEN  
PLAYER_BENEFIT: MEDIUM — feat unlocks when earned  
CORRECTNESS_BENEFIT: MEDIUM  
COMPLEXITY: LOW  
REGRESSION_RISK: LOW  

---

ACTION_ID: SDEG-2026-10-25-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Display-name HUD localStorage can poison principal `saveUserUiLayout`  
CATEGORY: persist-evolution  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `GameFlow.tsx` 256/278 `userId = userProfile.id ?? name` (no Candid id → display name). `DraggablePanel.tsx` 45–68 name-keyed cache; 475 empty blob keeps cache; 533–538 failure keeps cache; 80–88 / 552–571 drag uploads `loadLayout(userId)` via `saveUserUiLayout` to the caller principal. Same display name on a shared browser can copy another II’s HUD onto the canister. `ChallengePanel.tsx` 26/56/88–90 is name-keyed local-only. Distinct from spell-key #1014 helper and from `uiLayout:""` profile replace.  
SYSTEMS_AFFECTED: `DraggablePanel.tsx`, `GameFlow.tsx`, `ChallengePanel.tsx`, `userProfiles.uiLayout`  
RECOMMENDED_ACTION: Pass II principal text into panel layout keys (dual-read name key once, copy-if-missing, delete name key). Refuse `saveUserUiLayout` from a cache that was not reconciled from this principal’s blob this session. **No forbidden-file edits required.**  
AUTONOMY: IMPLEMENT  
HELPER_ONLY_WITHOUT_FORBIDDEN_FILES: YES  
STATUS: IMPLEMENTED (this PR)  
EVIDENCE_FIX: `uiLayoutStorageKey.ts` + `DraggablePanel.tsx` principal cache / reconcile gate; `ChallengePanel.tsx` principal local cache.  
PLAYER_BENEFIT: MEDIUM — HUD stays per-principal  
CORRECTNESS_BENEFIT: HIGH — stops cross-account uiLayout writes  
COMPLEXITY: LOW  
REGRESSION_RISK: LOW — layout only; copy-if-missing migrate  

---

## Carry-forward (do not restack)

| ID | Notes |
| :--- | :--- |
| #490 | BuffShop + maps/ground **keying** by principal (draft). Still live: `principalId={userId}` at WX 17943. |
| SDEG-2026-10-24-003 | mapsVisited / ground-doka wipe/inherit (keying half ⊂ #490) |
| SDEG-2026-10-24-013 / #1014 | display-name spell level/bar keys |
| SDEG-2026-10-24-017 / #1014 | legacy `pbv_active_spells` overwrite |
| SDEG-2026-09-29-003 | `saveCallerUserProfile` full-replace wipes uiLayout |
| SDEG-2026-09-25-001 / #508/#577 | feat/covenant/shrine version-gate keep-list |

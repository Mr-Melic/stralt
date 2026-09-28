# ACTION_IDs — 2026-09-28 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-09-28.md`](./DATA_EVOLUTION_AUDIT_2026-09-28.md).  
Prior: `ACTION_IDS_SDEG_2026-09-27.md` (#667).  
Do not edit shipped `20260831` / `20260901` NewActor. Do not edit `WorldExploration.tsx` / `main.mo` / `BuffShop.tsx` / `deathPenalty.ts` / `versionGate.ts` / `App.tsx` while older persist PRs are queued. Do not clone #362 / #385 / #386 / #388 / #400 / #408 / #437 / #466 / #490 / #508 / #577 / #622 / #667 helpers.

---

## Carry-forward (still OPEN — do not re-mint)

All SDEG-2026-08-31 through SDEG-2026-09-27 items remain as previously ledgered. Vehicles: #362, #385, #386, #388, #400, #408, #437, #466, #490, #508, #577, #622, #667.

HEAD is still `0f5363f`. No persist schema landed on main since 2026-09-21. This run does **not** approve any new required persist field.

---

## New (2026-09-28)

ACTION_ID: SDEG-2026-09-28-001
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: Treat frontend APP_VERSION wipe as the live client migration; do not split changelog authority
CATEGORY: stale-client
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: Official wipe is `App.tsx` **13–14** / **297–317**: `APP_VERSION = "v163"` vs `pbv_app_version`, then `localStorage.clear()` and restore only `shouldPreserveVersionGateKey` (spawn / levelup / `*_inventory`). Dismiss writes `pbv_show_changelog` only (**332–334**). No component calls `markChangelogShown` / `getChangelogShownVersion` / `getChangelog`. Canister `appVersion` / `changelogShownVersions` (`main.mo` **2180–2370**) empty-seed `v163` and are unused by official play. `setAppVersion` does not wipe browsers. Version-gate tests already assert `pbv_show_changelog` / `pbv_app_version` are not kept. `pbv_boss_configs` / `pbv_color_palette` / `pbv_boss_rush_config` also drop — live encounter caches, not Character fields. Distinct from #508 / #577 (keep-list contents) and 09-25-003 (session APIs).
SYSTEMS_AFFECTED: `App.tsx` version wipe; `changelogShownVersions`; feat/unpaid-death caches; `pbv_boss_configs`
RECOMMENDED_ACTION: One authority. Either official dismiss calls `markChangelogShown` and wipe keys off canister `appVersion`, or document the canister maps as raw-client-only and stop treating `setAppVersion` as a player migration. Keep expanding the version-gate preserve list on #508 ∪ #577 — do not edit `versionGate.ts` / `App.tsx` here. Do not add a required Character lastSeenVersion.
AUTONOMY: IMPLEMENT (contract helper this run); HUMAN (App.tsx / Motoko after older persist PRs)
DEPENDENCIES: #508 / #577 own the keep-list; do not clone
MIGRATION_REQUIREMENT: None for documenting dual authority. YES if last-seen moves onto a required field (later chain file after `20260901`).
REGRESSION_RISK: HIGH if wipe is removed without another re-login path; LOW for keep-list union
VALIDATION_REQUIRED: Frontend bump still wipes unlisted keys; canister `setAppVersion` does not clear feat counters; official dismiss still does not write `changelogShownVersions` on this HEAD. `node --experimental-strip-types --test src/frontend/src/utils/appVersionAuthorityPersist.test.ts`
STATUS: NEW

---

ACTION_ID: SDEG-2026-09-28-002
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: Freeze leftover-XP curve as persist semantics; convert remainder before any formula change
CATEGORY: unbounded-progression
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: `applyRewards` (`main.mo` **2126–2139**) subtracts `100 * 2^(level-1)` from `character.experience` and increments `level`. Frontend `xpThresholdBigInt` (`xpCurve.ts` **23–26**) matches. Stored `experience` is leftover in the current level, not lifetime total (CHANGELOG_ITEMS and AGENTS). A six-month player at L10 with leftover 150 is valid under threshold 51200. Swapping to a cheaper table (threshold 100) makes `leftoverWouldExtraLevelUnderNewThreshold(150n, 100n) === true` — the next `applyRewards` extra-levels without new XP. Motoko has no max level. Distinct from 09-21-004 (pow2 cost), 09-27-003 (Number hydrate), 09-01-004 (per-call ceilings).
SYSTEMS_AFFECTED: `applyRewards`; Character.experience / level; HUD leftover bar
RECOMMENDED_ACTION: Treat `100 * 2^(N-1)` as frozen persist semantics. Any curve change needs a one-shot conversion (or store lifetime total) with a write generation (SDEG-006). Do not “fix” the formula in a deploy. Do not Number() leftover on the persist path (09-27-003).
AUTONOMY: IMPLEMENT (contract helper this run); HUMAN (never change Motoko loop without conversion)
DEPENDENCIES: SDEG-2026-08-31-006 complementary; do not edit `main.mo`
MIGRATION_REQUIREMENT: YES if the curve changes — convert every row; idempotent generation; replay must not re-level
REGRESSION_RISK: HIGH if the live threshold changes without conversion
VALIDATION_REQUIRED: L10 leftover 150 does not extra-level under the current table; fixture leftover 150 under threshold 100 is flagged. `node --experimental-strip-types --test src/frontend/src/utils/leftoverXpCurvePersist.test.ts`
STATUS: NEW

---

ACTION_ID: SDEG-2026-09-28-003
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: saveBattleStats must not cut stored AP/MP on a stale incoming snapshot
CATEGORY: stale-client
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `saveBattleStats` writes `safeAp = min(maxAp, persistApWriteCap)` and the same for MP (`main.mo` **2044–2055**). XP/Doka use `min(incoming, stored)` (**2087–2088**). AP/MP do **not**. Official create seeds AP=10 / MP=5 (`startingChampionStats.ts` **10–11**) above PLAYER_BASE 8/4; `persistApWriteCap` grandfathers that stored value as the *cap* only. `saveBattleStatsApWrite(10, 8, 1, 25) === 8` — a stale L1 heal after a later write raised the pool cuts it. Incoming can also raise toward the formula (`stored 8 → incoming 9` at level 25 / threshold 25). applyRewards does not write AP/MP. Distinct from SDEG-006 (generation for XP/Doka), 09-21-003 (hard cap 20), and HP (incoming lower is intended for damage/death).
SYSTEMS_AFFECTED: `saveBattleStats`; CharacterStats.ap / mp; heal / death / shop absolute writes
RECOMMENDED_ACTION: Keep-store `max(incoming, stored)` for AP/MP *or* reject older writes via writeGeneration (SDEG-006). Do not raise the raw-client cap to 20 at level 1. Do not edit `main.mo` while older persist PRs queue.
AUTONOMY: IMPLEMENT (contract helper this run); HUMAN (Motoko after `main.mo` queue)
DEPENDENCIES: SDEG-2026-08-31-006 complementary; do not clone #362
MIGRATION_REQUIREMENT: None (behavior-only). Do not add required fields.
REGRESSION_RISK: LOW for keep-store of AP/MP (pools only grow with level); MEDIUM if an intended AP decrease exists
VALIDATION_REQUIRED: Stored AP 10 + incoming 8 at L1 writes 10 (after Motoko); raw incoming 20 at L1 still cannot mint past grandfather/formula. `node --experimental-strip-types --test src/frontend/src/utils/persistApMpMonotonic.test.ts`
STATUS: NEW

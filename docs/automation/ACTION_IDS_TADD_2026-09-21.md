# Telemetry Admin Dashboard Designer — ACTION_IDs (2026-09-21)

Source automation: Telemetry Admin Dashboard Designer (`4b026695`).  
Design only. No production code in this run.

Prior IDs `TADD-2026-08-31-001` … `007`, `AQA-2026-08-30-012`,
`TADD-2026-09-01-002` … `005`, and `TADD-2026-09-02-001` … `006` remain
**OPEN** except: `TADD-2026-09-01-001` bindgen half is **done**;
`TADD-2026-09-02-002` dual-path shop-credit wording is **superseded** by
`TADD-2026-09-21-001` (the “never `processPendingPurchases`” clause
stands). Do not open a second counter set. This file is the delta after
HEAD `0f5363f`.

---

ACTION_ID: TADD-2026-09-21-001  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Attach AQA-012 shop_credit_committed only to shouldCommitGameKeyRedeem — the #279 path has landed  
CATEGORY: telemetry  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: AQA-012 / TADD-2026-08-31-001 still not shipped. TADD-2026-09-02-002 still described a dual-path: HEAD wallet-query + `shouldCommitShopCredit` vs older open PR #279 `#ok` + `shouldCommitGameKeyRedeem`. On `0f5363f`, `redeemGameKeyThroughPersist` commits only when `shouldCommitGameKeyRedeem(persist.isWalletSeeded(), gained)` (`shopPurchase.ts` 275–328). Unseeded grants call `noteUnseededCredit` and must not tick. `processPendingPurchases` still always returns 0 (`main.mo` 1338–1348). World remount still calls `creditPendingPurchasesThroughPersist` (`WorldExploration.tsx` 1494–1497).  
SYSTEMS_AFFECTED: future sidecar only; `redeemGameKeyThroughPersist`; do not revive auto-complete  
RECOMMENDED_ACTION: When TADD-001 is implemented, increment `shop_credit_committed` only when `shouldCommitGameKeyRedeem` is true (seeded lock and `#ok` granted > 0). Do not increment from a second `getCallerDokaBalance`. Do not increment on request, approve, reject, email-mark, World remount, or `processPendingPurchases`. Keep TADD-2026-09-01-003 rules for victory/death/persist. Do not enqueue a second wallet write on `progressPersistRef`. Swallow sidecar errors.  
AUTONOMY: IMPLEMENT_WITH_TADD-2026-08-31-001 — do not open a second counter set  
DEPENDENCIES: AQA-2026-08-30-012; TADD-2026-08-31-001; TADD-2026-09-01-003; TADD-2026-09-02-002 (never-pending-purchases clause)  
REGRESSION_RISK: MEDIUM if counters write off the persist lock, tick on the always-0 remount, or tick the unseeded `noteUnseededCredit` path  
VALIDATION_REQUIRED: One successful redeem whose persist helper commits → `shop_credit_committed` +1. Remount / `processPendingPurchases` → 0. Failed or already-used key → 0. Unseeded lock → 0. Next Quality Auditor can cite weekly persist-ok/fail, victory-paid, and shop-credit, or still say “not shipped.”  
STATUS: NEW  

---

ACTION_ID: TADD-2026-09-21-002  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Caption Health H9 totalBossRushRuns as master finishes occupying room 9 — not attempts  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `AdminGuard.shouldCountBossRushRun` (`adminGuard.mo` 696–700) is true only when `roomIndex == 9 and currentRoom == 9`. `completeBossRushRoom` uses that flag for `totalBossRushRuns` and to reset `currentRoom` (`main.mo` 3347–3351). Repeat `complete(9)` after leaving room 9 no longer inflates the counter. `resetBossRush` (`main.mo` 3373–3387) zeroes `currentRoom` and does not increment. Attempts / flee remain UNSUPPORTED.  
SYSTEMS_AFFECTED: Health H9 captions only; do not change Boss Rush writers  
RECOMMENDED_ACTION: Label the H9 scalar “master finishes (occupying room 9),” not “runs” or “attempts.” Histogram `highestRoomCompleted` 0–10 with survivorship caption. Do not derive average attempts. Do not mix in `BossConfig.defeated`. Hide rates when n < 20.  
AUTONOMY: IMPLEMENT_WITH_TADD-2026-08-31-002  
DEPENDENCIES: TADD-2026-08-31-002  
REGRESSION_RISK: LOW (caption). MEDIUM if someone charts `totalBossRushRuns` as attempt volume and balances jackpot room 9 from it.  
VALIDATION_REQUIRED: H9 empty state never says “0 attempts.” Fixture with two `complete(9)` while still on room 9 vs after reset shows +1 then +0.  
STATUS: NEW  

---

ACTION_ID: TADD-2026-09-21-003  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: H2 captions — Boss Rush room-clear fires the same client-trusted victory feats; boss_defeated_* is not a persistable funnel  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `clientTrustedVictoryAchievementConditions` (`victoryAchievements.ts` 27–45) now runs from both `handleBattleEnd` and Boss Rush room-clear (`WorldExploration.tsx` 12897–12916). Wallet/level feats stay deferred until `applyRewards` commits. The helper also emits `boss_defeated_${bossId}`, but `knownAchievementCondition` (`adminGuard.mo` 515–530) has no such string, so `validateAchievementConfig` cannot save a matching row and `checkAndFireAchievement` no-ops without an active config. Four keys remain server-gated (`achievementUnlockRejected` 677–693). Combat feats stay client-trusted.  
SYSTEMS_AFFECTED: Health H2 captions only  
RECOMMENDED_ACTION: Caption H2: combat-feat rows may include Boss Rush room-clear as well as overworld victory; they are still “client said unlocked.” Do not add a Boss Health series from `boss_defeated_*` or `BossConfig.defeated`. Keep TADD-2026-09-02-004 split for the four server-gated keys.  
AUTONOMY: IMPLEMENT_WITH_TADD-2026-08-31-002  
DEPENDENCIES: TADD-2026-08-31-002; TADD-2026-09-02-004  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: H2 never titles combat keys “proven completions” or “boss clear rate.” Server-gated keys may say “canister refused if snapshot short.”  
STATUS: NEW  

---

ACTION_ID: TADD-2026-09-21-004  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Land telemetry maps in a new later EOP file after 20260901 — GameKey EOP is already on main  
CATEGORY: telemetry  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Frozen chain is `20260801` genesis, `20260803_185500`, `20260827_000000`, `20260831_000000` (deployed 42-stable tail, no GameKey), `20260901_000000` (GameKey). `mops.toml` `check-limit = 5`. PR #259 / #324 GameKey EOP has merged; the 09-02 “do not hitchhike onto #259” wait is over. New `telemetryLifetime` / `telemetryDay` still need bindgen, mock shape, `python3 scripts/check-eop-stables.py`, and `bash scripts/caffeine-import-gate.sh backend`. Empty-canister M0263 if `.old` is skipped or a stable is required at the 20260831 position.  
SYSTEMS_AFFECTED: `src/backend/main.mo` maps (future); `src/backend/migrations/YYYYMMDD_*.mo` after `20260901`; `mops.toml` `check-limit`; mock `backend.ts`; do not edit shipped `NewActor` files; do not blank `.old`  
RECOMMENDED_ACTION: When a human picks TADD-001, add a **new later** migration with `OldActor = {}` producing the increment maps. Bump `check-limit` to the chain length. Run the EOP gate vs `.old` (Caffeine 2026-08-31 signature) and `snapshots/deployed/*.most`. Do not put GameKey-era or telemetry fields on `20260831_000000`. Do not OQL-expose the maps with an owner column.  
AUTONOMY: IMPLEMENT_WITH_TADD-2026-08-31-001  
DEPENDENCIES: TADD-2026-08-31-001; GTAD-2026-09-02 migration note; caffeine-import-gate backend  
REGRESSION_RISK: HIGH if someone amends a frozen `NewActor` or requires telemetry fields at the deployed 20260831 position (Caffeine M0263 / IC0503).  
VALIDATION_REQUIRED: `python3 scripts/check-eop-stables.py` pass; `mops check` vs `.old` pass; `snapshots/unsupported/` still fail; empty-canister genesis still compiles.  
STATUS: NEW  

---

ACTION_ID: TADD-2026-09-21-005  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Do not chart SDE observe/owned discovery until those persist maps exist  
CATEGORY: telemetry  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md (PR #300) is design-only and states there are still no `ownedSpellIds` / `observedSpellIds`. `Character` (`main.mo` 122–145) still has `spellLevelKeys` / `spellBarOrder` only. `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 711–718) is retirement gating. Starter catalog remains 32. GTAD-S-003/S-004 remain PROPOSED. Charting “observed but rarely obtained” from this HEAD would invent data.  
SYSTEMS_AFFECTED: Health H3 / Spell Health; do not add Character fields for analytics alone  
RECOMMENDED_ACTION: Keep H3 labeled upgrade-persist + retirement gating. Hide discovery / acquisition-source / underused-overused / observed-not-obtained panels. If SDE persist later ships, attach GTAD-S-003/S-004 to those writers — do not pre-build a discovery inventory for Health.  
AUTONOMY: POLICY — implement captions with TADD-002 / H3  
DEPENDENCIES: TADD-2026-08-31-004; TADD-2026-09-01-004; SDE persist IDs (still NEW)  
REGRESSION_RISK: LOW. Residual risk is a future agent treating SDE docs as collectors.  
VALIDATION_REQUIRED: Health Spell section has no “discoveries = 0” empty state. Next dashboard PR does not add observe/owned series unless the maps exist.  
STATUS: NEW  

---

ACTION_ID: TADD-2026-09-21-006  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Keep banned principals and GameKey email off Health — Settings list and OQL bannedPrincipals are new identifiable dumps  
CATEGORY: privacy  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Admin Settings now renders a live `getBannedPrincipals` list (`AdminDashboard.tsx` 5426, 5466, 7080–7100). OQL exposes `bannedPrincipals` with `principalText` (`main.mo` 3798–3806) — missing from the 09-02 Health inventory. `gameKeyRequests` still includes `email` and `userPrincipal` (3787–3788). Audit GameKey actions still store `userPrincipal.toText()` in `objectId` (1596 / 1618 / 1649). TADD-2026-08-31-005 / 09-02-003 already forbade GameKey PII; they did not name the Settings ban list or the OQL ban entity.  
SYSTEMS_AFFECTED: Health only; do not remove the Settings ops list  
RECOMMENDED_ACTION: Health must not call `getBannedPrincipals`, must not query OQL `bannedPrincipals`, and must not mount Settings or Purchases inside the Health tab. H14 drops principal-shaped `objectId`. H6 strips email/principal before setState. Aggregate GameKey status counts remain allowed.  
AUTONOMY: IMPLEMENT_WITH_TADD-2026-08-31-002  
DEPENDENCIES: TADD-2026-08-31-005; TADD-2026-09-02-003  
REGRESSION_RISK: MEDIUM if Health stores the ban list or GameKey request rows in React state (email/principal leak). LOW if aggregated first.  
VALIDATION_REQUIRED: Network inspector on Health shows no principals, emails, or 120-char keys. Settings ban list still works on the Settings tab.  
STATUS: NEW  

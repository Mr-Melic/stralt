# ACTION_IDs — 2026-10-24 Admin Feature & Drift Auditor

Durable ledger. Reuses AFDA-2026-08-31-* / AFDA-2026-09-01-020 / AFDA-2026-09-02-* / AFDA-2026-09-21-* / AFDA-2026-09-22-* / AFDA-2026-09-23-* / AFDA-2026-09-25-* / AFDA-2026-09-27-031 / AFDA-2026-09-28-* / AFDA-2026-09-29-* / AFDA-2026-10-21-037 / AFDA-2026-10-21-038 / AFDA-2026-10-22-039 / AFDA-2026-10-23-040 / AFDA-2026-10-23-041 for the same underlying problems. New ACTION_ID this run: AFDA-2026-10-24-042 (`boss_defeated_*` victory conditions never match the admin catalog).

SOURCE_AUTOMATION: Admin Feature & Drift Auditor

Do not delete admin CRUD because a tab looks unused. Prove obsolescence first.

HEAD `0f5363f` (origin/main), identical to the 2026-09-21–10-23 AFDA baselines. Open AdminDashboard siblings (oldest first): #334, #341, #413, #415, #457, #470, #531, #539, #564, #585. Motoko type comments #620. Last-live guards #626 / #650 / #703 / #733. usePanelLayout #741. combatMath #780. #818 (037/038), #887 (039 / gameTypes), #934 (040–041 / progression), #904 (victoryAchievements helpers), #911 (packEnemyKitAssign, WX still unwired), #889 (useAdminQueries / useSpellQueries). This run does **not** restack those hunks.

Did not edit WorldExploration, AdminDashboard, `victoryAchievements.ts`, `progression.ts`, `gameTypes.ts`, `combatMath.ts`, `useBossQueries.ts`, `useBossRush.ts`, `useSpellQueries.ts`, `useAdminQueries.ts`, `longHorizonSim.ts`, BuffShop, or Motoko comments.

Visual fallback unchanged: empty sprite URL keeps Default Pixel Visual; no `ctx.drawImage` in `src/`. Custom art is not required.

Tiny honesty this run: `playerAchievements.ts` documents that victory `boss_defeated_*` conditions can never unlock (042).

Prior IDs 001–041 are unchanged from `docs/automation/ACTION_IDS_AFDA_2026-10-23.md` (#934) / earlier ledgers. Only the new record is expanded below.

---

ACTION_ID: AFDA-2026-10-24-042
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Victory emits `boss_defeated_${bossId}` conditions that the achievement catalog can never match
CATEGORY: BROKEN
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: `clientTrustedVictoryAchievementConditions` (`victoryAchievements.ts` 41–44; test expects `boss_defeated_starved_pawn`) pushes `boss_defeated_${bossId}` into the victory unlock loop. `checkAndFireAchievement` (WX 2218–2223) does `achievementConfigs.find(a => a.active && a.condition === condition)` and returns if none. Motoko `defaultAchievements()` (`lib/admin.mo` 309–326) lists only the fifteen fixed conditions (`first_battle_win` … `doka_10000`) — no `boss_defeated_*`. Frontend `KNOWN_ACHIEVEMENT_CONDITIONS` (`adminSafety.ts` 306–322) and `adminGuard.knownAchievementCondition` (515–531) reject unknown strings, so `validateAchievementConfig` / admin Feats CRUD cannot create a matching row; `achievementUnlockRejected` would also reject a raw `markAchievementUnlocked` on an unknown condition. `gameTypes.ts` AchievementConfig comment (374) lists the fifteen, not boss-defeat. Prefer documenting; do not restack `victoryAchievements.ts` (#904 adds Boss Rush persist helpers on that file). Custom art is not involved (013).
SYSTEMS_AFFECTED: Feats / achievements admin; victory unlock; Boss Rush / boss portals
CURRENT_BEHAVIOUR: After a boss kill, victory still fires `checkAndFireAchievement("boss_defeated_<id>")`. No catalog row matches; nothing unlocks, no toast, no claimable reward. Admin cannot add the condition.
AUTHORITATIVE_BEHAVIOUR: Either drop the `boss_defeated_*` push, or add a recognized condition pattern (and seed/admin allow-list) with real AchievementConfig rows. Do not leave a silent no-op that looks like a boss feat.
RECOMMENDED_ACTION: Prefer removing the push or gating it behind a real catalog entry after #904 lands. Do not widen `knownAchievementCondition` without seeding rows and claim UI. Do not restack AdminDashboard Feats dropdown in this auditor.
AUTONOMY: IMPLEMENT for drop-or-gate after #904; HUMAN if adding a new boss-feat schema
DEPENDENCIES: None for documentation; wiring waits on achievement schema choice
REGRESSION_RISK: MEDIUM if `knownAchievementCondition` is widened to prefix-match without seeds (players could mark arbitrary `boss_defeated_*` strings)
VALIDATION_REQUIRED: Defeat a named boss; `boss_defeated_<id>` does not appear in unlocked feats. Admin Feats condition dropdown has no `boss_defeated_*`. Creating a config with that condition is rejected.
STATUS: NEW

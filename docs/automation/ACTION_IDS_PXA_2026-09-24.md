# ACTION_IDs — 2026-09-24 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-09-24.md`](./PX_COHERENCE_AUDIT_2026-09-24.md)

Prior PX records remain **open** unless noted. Do not re-file:

- `PXA-2026-08-31-001` … `015` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (006 HUD hide done)
- `PXA-2026-09-01-001` … `003` in [`ACTION_IDS_2026-09-01.md`](./ACTION_IDS_2026-09-01.md)
- `PXA-2026-09-02-001` and `PXA-2026-09-02-003` in [`ACTION_IDS_PXA_2026-09-02.md`](./ACTION_IDS_PXA_2026-09-02.md) (002 HUD done)
- `PXA-2026-09-21-001` … `003` in open draft [PR #343](https://github.com/Mr-Melic/stralt/pull/343)
- `PXA-2026-09-22-001` … `003` in open draft [PR #393](https://github.com/Mr-Melic/stralt/pull/393)
- `PXA-2026-09-23-001` … `003` in open draft [PR #481](https://github.com/Mr-Melic/stralt/pull/481)

**Closed this cycle (do not re-open):**

- `PXA-2026-09-02-002` — accepted challenge HUD. Live gate is `shouldShowChallengeHud`.
- `PXA-2026-08-31-006` display half — Blood bar remains gone.

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21 / 09-22 / 09-23 audits. New IDs are new *reads* of the same bytes (Board ranks unused kills; betrayal 6× rewrite; portal-verb overload).

---

ACTION_ID: PXA-2026-09-24-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Keep the Board off the tactical bar, or rank something the official client actually plays  
CATEGORY: progression  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: GameFlow realm-tool row mounts **Board** next to Items / Feats / Bosses (`GameFlow.tsx` 317–326). The modal columns are Rank / Name / Level / Kills / Achievements (`596`). Sort is highest character **level** (`main.mo` `getLeaderboard` 3428–3432). Empty state copy is “defeat some enemies to appear here!” (`GameFlow.tsx` 576). Official combat never imports `useSaveKillCount` (hook defined in `useLeaderboardQueries.ts` 43–50; zero callers under `components/`). Canister `saveKillCount` exists and rejects `kills > 64` (`main.mo` 3078–3087) but the live client never increments. Achievements counted are **claimed** feat rows (`3414–3417`), which mix mastery with chores and RNG (PXA-009). UX already owns tablet collision of this cluster (`UX-HUD-TOOL-CLUSTER`); it does not ask the four PX questions. This ID is the identity read: a social ladder that cannot measure a fight, sits on the combat chrome, and teaches “kills matter” while killCount stays 0. Do not treat sort-by-level as a level cap.  
SYSTEMS_AFFECTED: progression, achievements, visual feedback, terminology  
RECOMMENDED_ACTION: SIMPLIFY. Pick one: (a) move Board behind pause / character select and drop Kills until a persist path exists; empty copy must match the sort key (level, or claimed feats — not “defeat enemies”); or (b) DEPRECATE the realm-tool button until the official client writes the columns it shows; or (c) HUMAN_DESIGN a ladder that answers a PX question without a finite endgame (e.g. deepest honest boss room cleared — only after rush pairs are real). Do not start writing `saveKillCount` from victory as a drive-by just to fill the column. Do not add a seasonal reset / cap.  
AUTONOMY: HUMAN_DESIGN_REQUIRED to pick (a)/(b)/(c). ORCHESTRATOR_MAY_DRAFT (a) hide the realm-tool button + fix empty copy if design keeps the query.  
DEPENDENCIES: PXA-2026-08-31-009 (feat list); PXA-2026-08-31-012 (Feats vs Achievements vs Board). UX-HUD-TOOL-CLUSTER (layout only). Does not close LHIPS-001. Does not authorize a kill-counter persist PR.  
REGRESSION_RISK: LOW if only the button moves. MEDIUM if `getLeaderboard` is deleted while an unmerged client still polls it. HIGH if `saveKillCount` is wired without the 64-cap and persist-lock story (AGENTS.md).  
VALIDATION_REQUIRED: Realm row during Play is Items / Feats / Bosses (and Admin if gated) — or Board’s first sentence matches the live sort key and every shown column is written by the official client. `pnpm typecheck`. Spectate: a victory does not change Kills unless a designed writer exists.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-24-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Betrayal must not silently 6× an encounter  
CATEGORY: enemies  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: During an enemy turn, if `aiTier >= 10` and an ally lives, `Math.random() < 0.05` (`WorldExploration.tsx` 15594–15598) deals `level * 2 + 0..4` to a random ally. On a kill, the betrayer is added to `enragedEnemies` and `updateCombatant` sets HP/maxHP to **6×** (`15625–15653`); later melee multiplies damage by 6 when `enragedEnemies.has(enemyId)` (`16257`). Initiative strip / BattleUIPanel can badge “enraged” after the fact (`InitiativeStrip.tsx` 351–352). There is no Map Effects line, no Register sentence, no telegraph before the roll. `computeAITier` still returns a uniform 1–10 on 30% of units (`combatMath.ts` 48–50), so a first-map pawn can be tier 10. `ENEMY_AI_TIER_GATES.betrayal = 10` (`gameConstants.ts` 204) is documentation; the live test is the hardcoded `>= 10`. Feats `betrayal_witness` / `double_betrayal` (15% second roll at `15658`) remain spectator stamps (PXA-009). Random-tier noise stays owned by MTD / ENEMY docs — this ID is the **6× rewrite**, not the 30% roll. Answers none of the four questions: no decision, no readable mastery, no counterplay except hoping the 5% misses.  
SYSTEMS_AFFECTED: enemies, AI, visual feedback, achievements, challenges (HP contracts on a 6× unit)  
RECOMMENDED_ACTION: REWORK or DEPRECATE. Recommend: (a) delete the 6× HP/damage mutation and keep at most a logged ally-attack that uses normal kit damage; or (b) make betrayal a **named, once-per-fight, telegraphed** rule (announce + crown/enrage before the swing, and only when `computeAITier` is deterministic — after the 30% noise is removed). Do not add a fourth family hook. Do not teach it on EnemyRegister until the engine matches the card (09-01-001). Do not twin a second random-tier PR.  
AUTONOMY: HUMAN_DESIGN_REQUIRED to keep a betrayal fantasy. ORCHESTRATOR_MAY_DRAFT (a) remove the 6× block + enrage multiplier + double-betrayal 15% if design drops the rewrite.  
DEPENDENCIES: Random-tier ID (do not re-file). PXA-2026-08-31-009 (spectator feats). PXA-2026-09-01-001 (Register honesty). Does not close EBA-013.  
REGRESSION_RISK: HIGH if 6× stays and only copy is added (players still cannot play around 5%). MEDIUM if ally-attack remains without the 6× (feat predicates may fire less). LOW if only the enrage badge is hidden while the 6× stays — that is worse.  
VALIDATION_REQUIRED: A tier-10 unit with an ally either never 6×s, or the player can read the rule before the swing. Recap/feats still only credit designed spectator rows. `pnpm typecheck`. No RAF / mapGen / kit-table expansion in this ID.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-24-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: One overworld map must not teach five portal verbs  
CATEGORY: dungeons  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: A single non-dungeon generate pass can stamp a **solo boss** door at 15% (`WorldExploration.tsx` 4884–4911, `color: "boss"`, random `BOSS_IDS`), a **Rest** door at 10% (`4916–4934`), and a **Boss Rush** door at 8% (`4939–4959`), on top of region-color and dungeon portals. Rest Area (`isRestMap`, zone name “Rest Area”, `5513–5522`) then offers three exits: roam / dungeon / boss (`5483–5510`) with no unique recover rule except the silent +1 HP/10s interval (09-23-003). Rush rooms still advertise unused `combinedMechanic` copy (`useBossRush.ts` 23–134). Dungeon chain is still the overworld plus a Doka multiplier (PXA-010). The player is asked to learn “purple star,” “rest,” “rush magenta,” “dungeon,” and “white sanctuary” as if they were different games. That is information overload and feature bloat: most doors do not add a new decision, mastery, or counterplay — they reroute the same generator. UX collision of chrome is a different ID.  
SYSTEMS_AFFECTED: dungeons, bosses, world events, visual feedback, death (Rest vs Death Realm vs white sanctuary as three “safe” words)  
RECOMMENDED_ACTION: SIMPLIFY. Cap **one special door per overworld map** (or a reserved dungeon/rest/boss table the player can learn). Rest is either (a) a named recover room whose banner states the rule, or (b) a mode hub — not both with the word “Rest.” Solo boss and Rush may both exist if they look different **and** Rush actually runs a pair rule (PXA-003). Do not add Wave-6 / world-feature portals (09-21-002). Do not retune mapGen solvability in this ID beyond removing surplus door rolls.  
AUTONOMY: HUMAN_DESIGN_REQUIRED to pick the learnable door set. ORCHESTRATOR_MAY_DRAFT copy-only (Rest banner + portal tooltips) if spawn rates stay. Spawn-rate cuts touch generate — HUMAN_APPROVE vs AQA-006 mapGen freeze.  
DEPENDENCIES: PXA-2026-08-31-010 (dungeon unique rule); PXA-2026-08-31-003 (rush pairs); PXA-2026-09-23-003 (if Rest becomes the only regen room). 09-21-002 (do not stack new catalogs).  
REGRESSION_RISK: MEDIUM if rest/dungeon/boss rolls are removed without an alternate entry (players lose Rush/dungeon access). HIGH if mapGen is edited without `finalizePlayableLayout` (AGENTS.md). LOW if only tooltips/banners change.  
VALIDATION_REQUIRED: A new overworld map has a countable, named door set the player can recite. Rest banner either states a recover rate or stops saying Rest. Rush still only starts from a door that is not also a solo-boss star. Import gate if any gameplay file is touched.  
STATUS: NEW

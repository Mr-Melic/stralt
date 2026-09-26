# ACTION_IDs — 2026-09-26 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-09-26.md`](./DATA_EVOLUTION_AUDIT_2026-09-26.md).  
Prior: `ACTION_IDS_SDEG_2026-09-25.md` (#577), `ACTION_IDS_SDEG_2026-09-24.md` (#508).  
Do not edit shipped `20260831` / `20260901` NewActor. Do not edit `WorldExploration.tsx` / `main.mo` / `BuffShop.tsx` / `deathPenalty.ts` / `versionGate.ts` while older persist PRs are queued.

---

## Carry-forward (still OPEN — do not re-mint)

All SDEG-2026-08-31 through SDEG-2026-09-25 items remain as previously ledgered. Vehicles: #362, #385, #386, #388, #400, #408, #437, #466, #490, #508, #577.

HEAD is still `0f5363f`. No persist schema landed on main since 2026-09-21.

---

## New (2026-09-26)

ACTION_ID: SDEG-2026-09-26-001
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: Protect live innate spell ids in isBuiltInSpellId (physical_attack + starter-*)
CATEGORY: content-id-stability
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `AdminGuard.isBuiltInSpellId` (`adminGuard.mo` **21–24**) and frontend `BUILT_IN_SPELL_IDS` (`adminSafety.ts` **9–16**) list only the six Motoko seed ids. Live innates `physical_attack` / `starter-shield` / `starter-poison` / `starter-blast` / `starter-heal` / `starter-drain` / `starter-frost` come from `spellData.ts`. `adminDeleteSpellConfig` (`main.mo` **882–901**) hard-deletes non-built-in ids that no player array references. Boot `OLD_SPELL_IDS` (`main.mo` **686–697**) still `remove`s `physical_attack` on every start. Helper `builtInStarterProtectEvolve.ts` locks `builtInSpellIdsProtectLiveInnates() === false`. Distinct from SDEG-003 (ownership remap) and SDEG-2026-09-24-004 (boss-kit seed overlap).
SYSTEMS_AFFECTED: `adminDeleteSpellConfig`; `isBuiltInSpellId`; starter library; future discovery
RECOMMENDED_ACTION: Add live innates to Motoko `isBuiltInSpellId` (and the frontend mirror) so they can only be retired, never hard-deleted. Stop purging `physical_attack` while it is a starter (SDEG-003). Do not remap ids in this PR.
AUTONOMY: IMPLEMENT (contract helper this run); HUMAN (Motoko after older persist PRs release `main.mo`)
DEPENDENCIES: SDEG-2026-08-31-003; do not edit `adminGuard.mo` / `adminSafety.ts` while #437 owns those files
MIGRATION_REQUIREMENT: None for the built-in list (behavior-only). YES if existing catalog rows are rewritten — one-shot generation, not every upgrade.
REGRESSION_RISK: LOW for refuse-delete; HIGH if boot purge is removed without keeping a catalog row for Strike
VALIDATION_REQUIRED: `physical_attack` / `starter-frost` cannot be hard-deleted; `custom_bolt` still can; two upgrades later `physical_attack` remains a player starter. `node --test src/frontend/src/utils/builtInStarterProtectEvolve.test.ts`
STATUS: NEW

---

ACTION_ID: SDEG-2026-09-26-002
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: Leaderboard must count unlocked feats and not Number() unbounded Nats
CATEGORY: unbounded-progression
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: `getLeaderboard` (`main.mo` **3414–3417**) increments `achCount` only when `prog.claimed`. Unlocked-but-unclaimed rows (#437 freeze, or a player who has not opened Feats) rank as 0. Official UI never calls `saveKillCount` (`useLeaderboardQueries.ts` **43–50**; zero TSX callers) so `killCount` stays 0. Frontend maps `Number(entry.level|killCount|achievementsCompleted)` (**33–35**). `leaderboardNatWouldSaturateJsNumber(MAX_SAFE_INTEGER+1n)` is true. Distinct from MTD-005 (unused hook) and SDEG-008 (claim amount).
SYSTEMS_AFFECTED: `getLeaderboard`; Feats claim; GameFlow leaderboard; future high-level ranks
RECOMMENDED_ACTION: Count `unlocked` (claimed remains the payout flag). Hydrate Nats with bigint / clamp display. Do not start writing `saveKillCount` from victory without an idempotent battle id (additive double-count). Motoko not wired this run (`main.mo` queue).
AUTONOMY: IMPLEMENT (contract helper); HUMAN (Motoko + `useLeaderboardQueries` bigint)
DEPENDENCIES: Do not edit `main.mo` while older persist PRs queue; #437 claim freeze is complementary
MIGRATION_REQUIREMENT: None (derived query). Do not add a leaderboard stable.
REGRESSION_RISK: LOW for unlocked count (ranks rise, never drop claimed-only players below unlock count); MEDIUM if killCount is bulk-backfilled without idempotency
VALIDATION_REQUIRED: Unlock-without-claim increments the board; claim does not double-count; fixture Nat above `MAX_SAFE_INTEGER` does not become `MAX_SAFE_INTEGER` in UI. `node --test src/frontend/src/utils/leaderboardPersistEvolve.test.ts`
STATUS: NEW

---

ACTION_ID: SDEG-2026-09-26-003
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: Treat pieceType as the visual persist key; do not make pixelPattern or sprite URLs mandatory
CATEGORY: visuals
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: CharacterCreation save writes `JSON.stringify(chessPiecePatterns[selectedPiece])` (`CharacterCreation.tsx` **273**), not the editor grid. WorldExploration portrait **3719** and player draw **8289** call `getPersistedPiecePattern(pieceType)` and never read `character.pixelPattern`. Unknown ids already fall back to `king.front` (`pieceArt.ts` **653–658**). `adminDeletePlayerSpriteConfig` (`main.mo` **854–860**) removes the config only. Catalog piece art changes therefore rewrite every old champion's look without a migration. Helper `pieceTypeVisualPersistEvolve.ts` locks the fallback.
SYSTEMS_AFFECTED: Character `pieceType` / `pixelPattern`; portrait; player draw; PlayerSpriteConfig URLs
RECOMMENDED_ACTION: Keep sprite URLs optional. Document `pieceType` as the live visual persist key. Do not parse stored JSON in the RAF path. If custom grids must survive, that is a **later** optional field + one-shot copy after SDEG-001 — not a required Text rewrite.
AUTONOMY: IMPLEMENT (contract + king.front assertion); HUMAN (product: catalog-art changes vs stored JSON)
DEPENDENCIES: None. Do not edit WorldExploration / CharacterCreation while UX/combat PRs queue.
MIGRATION_REQUIREMENT: None if catalog art remains the live source. YES if stored JSON becomes the draw source (must tolerate invalid JSON).
REGRESSION_RISK: LOW for keeping current fallback; HIGH if RAF starts `JSON.parse`ing six-month blobs without a try/fallback
VALIDATION_REQUIRED: `pieceType: "unknown"` paints king.front; king/queen unchanged; delete sprite config leaves the row loadable. `node --test src/frontend/src/utils/pieceTypeVisualPersistEvolve.test.ts`
STATUS: NEW

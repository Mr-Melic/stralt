# ACTION_IDs — 2026-10-21 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-10-21.md`](./DATA_EVOLUTION_AUDIT_2026-10-21.md).  
Prior: `ACTION_IDS_SDEG_2026-09-29.md` (#778).  
Do not edit shipped `20260831` / `20260901` NewActor. Do not edit `WorldExploration.tsx` / `main.mo` / `BuffShop.tsx` / `deathPenalty.ts` / `versionGate.ts` / `App.tsx` / `AchievementsPanel.tsx` while older persist PRs are queued. Do not clone #362 / #385 / #386 / #388 / #400 / #408 / #437 / #466 / #490 / #508 / #577 / #622 / #667 / #731 / #778 / #803 helpers.

---

## Carry-forward (still OPEN — do not re-mint)

All SDEG-2026-08-31 through SDEG-2026-09-29 items remain as previously ledgered. Vehicles: #362, #385, #386, #388, #400, #408, #437, #466, #490, #508, #577, #622, #667, #731, #778, #803.

HEAD is still `0f5363f`. No persist schema landed on main since 2026-09-21. This run does **not** approve any new required persist field.

---

## New (2026-10-21)

ACTION_ID: SDEG-2026-10-21-001
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: Treat official dungeon progress as session-only; do not migrate dungeonRecords as live player history
CATEGORY: progress-idempotency
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: Official chain is `snapshotDungeonChain` session refs (`portalRules.ts` **183–193**; `WorldExploration.tsx` **6288**). `updateDungeonProgress` / `getDungeonRecord` / `resetDungeonChain` have **zero** component callers (bindgen + `mocks/backend.ts` **212–214** only). Canister writer (`main.mo` **2905–2924**) is Principal-keyed, always `totalMapsCompleted + 1`, depth-clamped 16, Float multiplier. `deleteCharacter` does not clear the map. A player created yesterday who finished dungeon maps has no durable depth; reload / new device / APP_VERSION wipe restarts the chain. Distinct from SDEG-007 (make that writer idempotent if/when wired) and 09-27-002 (leftovers **if** a raw client wrote).
SYSTEMS_AFFECTED: `dungeonRecords`; `updateDungeonProgress`; live dungeon refs; dungeon-complete bonus
RECOMMENDED_ACTION: Document session refs as the live authority on this HEAD. If official play must persist depth, add a **later** chain file after `20260901` with empty defaults = “no official history”, key `principal#slot`, increment only when depth increases (SDEG-007). Do not backfill six-month null rows as completed maps. Do not edit `main.mo` / WX while older persist PRs queue.
AUTONOMY: IMPLEMENT (contract helper this run); HUMAN (Motoko + WX wire after queue)
DEPENDENCIES: SDEG-2026-08-31-007 complementary; do not clone #466 / #778 helpers
MIGRATION_REQUIREMENT: YES if the canister map becomes official — optional/defaulted; empty = 0; idempotent; replay must not +1 maps
REGRESSION_RISK: HIGH if null rows are treated as “reset a chain that never persisted”; MEDIUM if the dead writer is wired without SDEG-007
VALIDATION_REQUIRED: No TSX caller of `updateDungeonProgress` on this HEAD; fixture null record still reads null; session snapshot survives `cleanupMap` via `snapshotDungeonChain`. `node --experimental-strip-types --test src/frontend/src/utils/dungeonRecordsOfficialPersist.test.ts`
STATUS: NEW

---

ACTION_ID: SDEG-2026-10-21-002
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: Do not enforce SpellConfig.minLevel at hydrate without a stored ownership set
CATEGORY: spell-discovery
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` **712–718**) ignores minLevel. `upgradeSpell` (`main.mo` **964–1014**) checks catalog existence + retired-if-not-owned, not minLevel. Admin copy: “minLevel is not enforced at hydrate” (`AdminDashboard.tsx` **3644**). Seeded `void_collapse` has `minLevel = 30` (`admin.mo` **190**). Empty `spellLevelKeys` on create (`main.mo` **225–226**). A later library filter `player.level < minLevel` would hide catalog spells from yesterday / six-month / pre-minLevel players who never paid upgradeSpell. Distinct from SDEG-004 (owned vs catalog-all) and from #466 minLevel *grant* tests.
SYSTEMS_AFFECTED: spell library; `upgradeSpell`; future discovery; `void_collapse` and any raised minLevel
RECOMMENDED_ACTION: Keep hydrate ignoring minLevel until SDEG-004 ownership exists. Then gate *unowned* catalog rows only; already-owned ids and starters stay. Do not add required `ownedSpellIds` until a later chain file after `20260901`. Do not edit WX / `main.mo` this run.
AUTONOMY: IMPLEMENT (contract helper this run); HUMAN (hydrate gate after SDEG-004)
DEPENDENCIES: SDEG-2026-08-31-004; SDEG-2026-08-31-001
MIGRATION_REQUIREMENT: YES if ownership is persisted — empty keys = starters ∪ upgraded, not catalog-all. Idempotent. Replay must not wipe keys.
REGRESSION_RISK: HIGH if minLevel is enforced on empty-keys rows; LOW if ownership is stored first
VALIDATION_REQUIRED: L1 + usable void_collapse still included; retired unowned still excluded; `minLevelGateWithoutOwnershipWouldHideCatalogSpell({playerLevel:1,minLevel:30,usableByPlayer:true,alreadyOwned:false}) === true`. `node --experimental-strip-types --test src/frontend/src/utils/spellMinLevelHydrate.test.ts`
STATUS: NEW

---

ACTION_ID: SDEG-2026-10-21-003
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: Never promote stored pixelPattern JSON or sprite URLs to mandatory combat art
CATEGORY: visuals
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: Combat portrait/player draw uses `getPersistedPiecePattern(pieceType)` (`WorldExploration.tsx` **3719**, **8289**; `pieceArt.ts` **653–658**) and ignores `Character.pixelPattern`. Official create/update writes `JSON.stringify(chessPiecePatterns[selectedPiece])` (`CharacterCreation.tsx` **273**) — not the editor random grid (**102–114**). The blob is still a **required** Text field (size cap 16_384, `main.mo` **315–316**, **395–396**). `adminDeletePlayerSpriteConfig` (`main.mo` **854–860**) removes the catalog row only. Unknown `pieceType` → `king.front`. Distinct from 09-26-003 (stored blob unused): this locks create-as-catalog-JSON and forbids making the blob/URL a load dependency.
SYSTEMS_AFFECTED: Character.pixelPattern; pieceType; playerSpriteConfigs; CharacterCreation; combat draw
RECOMMENDED_ACTION: Keep pieceType + king.front fallback as the persist-safe look. If custom pixels must persist, version the JSON, treat parse failure as catalog fallback (editor already try/catch **125–136**), and keep URLs optional. Do not require a sprite URL on Character. Do not edit WX / CharacterCreation while older PRs queue.
AUTONOMY: IMPLEMENT (contract helper this run); HUMAN (optional blob schema later)
DEPENDENCIES: None for the keep-pieceType rule
MIGRATION_REQUIREMENT: YES if the blob becomes the live draw source — schema version + fallback; replay must not trap on old JSON
REGRESSION_RISK: HIGH if RAF indexes stored JSON without a fallback; LOW if pieceType remains the source
VALIDATION_REQUIRED: Unknown pieceType equals king.front; delete sprite config does not delete Character; combat helper `combatDrawUsesStoredPixelPattern() === false`. `node --experimental-strip-types --test src/frontend/src/utils/pixelPatternPersistVisual.test.ts`
STATUS: NEW

---

ACTION_ID: SDEG-2026-10-21-004
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: Keep official Claim visible for unlocked unclaimed feats when the catalog row is retired
CATEGORY: achievements
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: Soft-retire sets `active=false` and keeps the id (`main.mo` **2397–2405**). `markAchievementUnlocked` rejects inactive (**2472–2474**). `claimAchievementReward` does **not** check `config.active` and pays live `config.dokaReward` (**2517–2550**). Official panel `configs.filter((cfg) => cfg.active)` (`AchievementsPanel.tsx` **191–193**) hides the row, so yesterday’s unlocked-but-unclaimed feat cannot be claimed in the UI after retire; a raw client still can. Distinct from SDEG-008 (freeze amount at unlock) and 09-25-009 (rename-by-new-id orphans the key).
SYSTEMS_AFFECTED: `achievementProgress`; `claimAchievementReward`; AchievementsPanel; admin retire
RECOMMENDED_ACTION: Official list should include inactive rows that are unlocked and unclaimed (Claim only; no new unlocks). Prefer SDEG-008 snapshot amount. Do not delete progress. Do not edit AchievementsPanel / `main.mo` while older persist PRs queue.
AUTONOMY: IMPLEMENT (contract helper this run); HUMAN (panel + optional claim `active` policy after queue)
DEPENDENCIES: SDEG-2026-08-31-008 complementary; #437 vehicle for freeze amount
MIGRATION_REQUIREMENT: None (behavior-only visibility). Optional `dokaRewardAtUnlock` remains SDEG-008.
REGRESSION_RISK: LOW for showing Claim on retired unlocked rows; MEDIUM if inactive rows become unlockable again
VALIDATION_REQUIRED: `retiredUnclaimedFeatHiddenFromOfficialClaim({active:false,unlocked:true,claimed:false}) === true` on this HEAD; claimed retired stays hidden; mark still rejects inactive. `node --experimental-strip-types --test src/frontend/src/utils/retiredFeatClaimHidden.test.ts`
STATUS: NEW

# ACTION_IDs — 2026-10-29 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.
Source of every record: Save/Data Evolution Guardian.
Audit: [`DATA_EVOLUTION_AUDIT_2026-10-29.md`](./DATA_EVOLUTION_AUDIT_2026-10-29.md).
HEAD: `0f5363f`.
Do not clone #362 / #388 / #400 / #408 / #429 / #466 / #490 / #508 / #577 / #828 / #893 / #1014 / #1083 / #1126 / #1171 / #1253.
Do not edit WorldExploration / main.mo / BuffShop / versionGate / deathPenalty / App / AchievementsPanel / combatMath / DraggablePanel / ChallengePanel / SpellbookModal / victoryAchievements / CharacterCreation / spellData this stack.

---

ACTION_ID: SDEG-2026-10-29-001
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: Frontend starterSpells[] is an unversioned innate grant; Motoko defaultSpells overlap is empty
CATEGORY: spell-discovery / content-id-stability
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: `starterSpells` is 32 ids (`spellData.ts` 27–691). WX 2395–2416 unions every row into `ownedSpells` as "never removable." Motoko `defaultSpells()` is six different ids (`admin.mo` 168–191; `BUILT_IN_SPELL_IDS`). Intersection on HEAD is `[]`. `upgradeSpell` (`main.mo` 974–977) `#err`s `Spell not found` for `starter-shield` / `spell-swap` / `summon-dire-wolf` / `physical_attack`. `physical_attack` is also an `OLD_SPELL_IDS` boot purge (`main.mo` 689–697). Appending a 33rd innate grants it to yesterday / six-month / pre-feature cohorts with no `spellLevelKeys` row. Removing a row revokes it. Rename cannot preserve ownership. Distinct from SDEG-004 (catalog ∪ starters *rule*), 09-26-001 (`isBuiltInSpellId`), 10-22-003 (localStorage level fallback), 10-27-002 (empty-only Motoko seed).
SYSTEMS_AFFECTED: `starterSpells`; spell library hydrate; `upgradeSpell`; `spellLevelKeys`; future discovery
RECOMMENDED_ACTION: Helper `starterSpellGrantPersist` landed. Do not append/remove innate ids without an alias table. Paid upgrades of innates need Motoko catalog rows (insert-missing, 10-27-002) or must stay unupgradable. Do not add required `Character.ownedSpellIds` until a later chain file after 20260901 with empty-array default = starters-at-ship-time, idempotent replay.
AUTONOMY: HELPER
DEPENDENCIES: SDEG-004; 10-27-002; do not edit WX / main.mo / spellData this stack; do not clone #400 / #1171
MIGRATION_REQUIREMENT: None for helper. YES before any required owned-id field (later file after 20260901 + alias map). Innate list changes today are undeployed migrations.
REGRESSION_RISK: LOW for helper; HIGH if a later `starterSpells` edit is treated as "just content"
VALIDATION_REQUIRED: Live starter ids match the locked 32; overlap with `BUILT_IN_SPELL_IDS` is empty; `upgradeSpellCanPersistLevelForInnateId("starter-heal")` false; `shouldAddRequiredCharacterOwnedSpellIds()` false.
STATUS: NEW

---

ACTION_ID: SDEG-2026-10-29-002
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: create/updateCharacter skip name uniqueness; appearance editor is a free rename
CATEGORY: identity / stale-overwrite
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `renameCharacter` (`main.mo` 1860–1903) costs 100 Doka and rejects when **any** slot already has that exact name, including the slot being renamed (same-name no-op `#err`s). `createCharacter` 309–310 and `updateCharacter` 389–391 only check length 1–20. Official Edit Champion (`CharacterCreation.tsx` 267 / 290–294) sends `name` through `updateCharacter` with no fee. `getLeaderboard` 3400–3403 uses `Character.name`. `UserProfile.name` is a separate column (chat / HUD `userId`). Distinct from 09-29-003 (profile uiLayout wipe), 10-24-013 (display-name spell keys), 10-25-003 (HUD display-name poison).
SYSTEMS_AFFECTED: `createCharacter`; `updateCharacter`; `renameCharacter`; CharacterCreation; leaderboard identity
RECOMMENDED_ACTION: Helper landed. Enforce uniqueness on create/update against **other** slots. Keep appearance editor from being a rename writer (paid `renameCharacter` only, or charge + uniqueness there). Do not add a required Character.displayName field. Do not edit CharacterCreation / main.mo this stack.
AUTONOMY: HELPER
DEPENDENCIES: Do not clone #778 (profile replace); do not edit main.mo while persist vehicles queue
MIGRATION_REQUIREMENT: None for helper. YES only if displayName becomes a required field (later file after 20260901; empty = Character.name). Duplicate names already in slots must be grandfathered or uniquified in a one-shot, idempotent pass.
REGRESSION_RISK: LOW for helper; MEDIUM if uniqueness is applied without grandfathering yesterday’s two-"Hero" account
VALIDATION_REQUIRED: HEAD create/update uniqueness false; paid rename rejects own name; recommended policy allows same-slot no-op and rejects the other slot.
STATUS: NEW

---

ACTION_ID: SDEG-2026-10-29-003
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: Ground Doka pickup ids are Date.now(); shrine/dungeon credits are constants
CATEGORY: progress-idempotency / entity IDs
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: WX 6779 writes `doka-${Date.now()}-${x}-${y}`. Claim set is in-memory and cleared on map apply (6790 / 6799). `SHRINE_ALTAR_CREDIT_ID` / `DUNGEON_CHAIN_COMPLETE_CREDIT_ID` (`dokaPersist.ts` 4–7) are constants. `oneShotCredit.shrineCreditId(visitId)` / `dungeonCompleteCreditId(runId)` exist and have **zero** WX callers. A six-month player’s collected coins cannot be reconstructed; `loot_10_doka` is a counter (10-24-003 / 10-25-001). Persisting a map seed without stable ids would remint. Distinct from 10-26-001 (explore_25 unique map ids) and 10-25-001 (count-before-settle).
SYSTEMS_AFFECTED: ground Doka loot; shrine altar credit; dungeon-complete bonus; future map-seed persist
RECOMMENDED_ACTION: Helper landed. Wire `recommendedGroundDokaPickupId(mapSeed,x,y)` and the unused visit/run helpers from WX later. Do not add required `Character.claimedPickupIds` until a later chain file after 20260901 with empty-set default. Do not persist map loot without stable ids.
AUTONOMY: HELPER
DEPENDENCIES: None for helper; WX vehicle for lock; do not clone #1014 / #1083 / #1126
MIGRATION_REQUIREMENT: None for helper. YES before any required pickup-id field or persisted map seed (later file, empty default, idempotent; replay must not remint applyRewards).
REGRESSION_RISK: LOW for helper; HIGH if a later map-seed persist reuses Date.now() ids
VALIDATION_REQUIRED: HEAD id with two timestamps differs; recommended seed ids match across reload; shrine/dungeon HEAD constants are not visit/run scoped; `shouldAddRequiredCharacterPickupIdSet()` false.
STATUS: NEW

---

## Carry-forward (do not restack)

| ID | Notes |
| :--- | :--- |
| SDEG-001/002 | live `actor {`; GameKey on 20260901; new fields → later file only |
| SDEG-004 | no ownedSpellIds; catalog ∪ starters *rule* — 001 is the innate *list* as a grant |
| #490 | BuffShop + maps/ground **keying** by principal |
| SDEG-2026-10-24-003 | mapsVisited / ground-doka wipe/inherit (keying half ⊂ #490) |
| SDEG-2026-10-25-001 | ground-Doka feat count-before-settle — not pickup **id** stability |
| SDEG-2026-10-26-001 | explore_25_maps portal counter — not ground Doka ids |
| SDEG-2026-10-27-002 | empty-only Motoko catalog seed — innates still frontend-only after a seed |
| SDEG-2026-10-28-001 | HUD post-wipe one-panel replace — not Character.name |
| #1253 | 10-28 helpers; do not clone |

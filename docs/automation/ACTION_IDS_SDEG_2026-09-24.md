# ACTION_IDs — 2026-09-24 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-09-24.md`](./DATA_EVOLUTION_AUDIT_2026-09-24.md).  
Prior: `ACTION_IDS_SDEG_2026-09-23.md` (#466), `ACTION_IDS_SDEG_2026-09-22.md` (#400), `ACTION_IDS_SDEG_2026-09-21.md` (#362).  
Do not edit shipped `20260831` / `20260901` NewActor. New stables → `20260902+` with `OldActor = {}`.  
Do not edit `WorldExploration.tsx` while #327 / #331 are still open.  
Do not edit `main.mo` while older persist PRs (#362, #437, …) are queued.

---

## Closed / landed since 2026-09-23 (on this HEAD: none except this run’s version-gate)

HEAD is still `0f5363f`. Vehicles remain draft. This run wired version-gate preserve only.

ACTION_ID: SDEG-2026-09-24-001  
STATUS: IMPLEMENTED  
EVIDENCE: `shouldPreserveVersionGateKey` keeps `pbv_pending_death_penalty*` (`versionGate.ts`; tests in `versionGate.test.ts`). App.tsx already uses `collectPreservedLocalStorage`. Complementary to #385 owner-key (do not clone).

---

## Carry-forward (still OPEN — do not re-mint twins)

See `ACTION_IDS_SDEG_2026-09-21.md` / `ACTION_IDS_SDEG_2026-09-22.md` / `ACTION_IDS_SDEG_2026-09-23.md` for full records.

- SDEG-2026-08-31-001 / 002 — later chain file after `20260901` before any required field
- SDEG-2026-08-31-003 — stop every-upgrade `OLD_SPELL_IDS` purge; remap ownership
- SDEG-2026-08-31-004 — persist owned spell ids separately from the live catalog
- SDEG-2026-08-31-005 — hydrate BuffShop from canister inventory
- SDEG-2026-08-31-006 — Character `writeGeneration`
- SDEG-2026-08-31-007 — dungeon progress idempotent + slot-scoped
- SDEG-2026-08-31-008 — snapshot achievement reward at unlock
- SDEG-2026-08-31-011 — do not deploy `dfx.json` `backend_extended`
- SDEG-2026-09-01-004 — split applyRewards ceilings from official payouts
- SDEG-2026-09-02-001 — victory HP floor vs persist cap (vehicle #386)
- SDEG-2026-09-02-004 — leftover KYC `purchaseRecords`
- SDEG-2026-09-02-005 — GameKey serial wrap (vehicle #362)
- SDEG-2026-09-02-006 — redeem credits caller, not requester
- SDEG-2026-09-21-001 — `saveActiveSpells` keep-store (vehicle #362)
- SDEG-2026-09-21-002 — stop hiding live spells by display name (WX; #327/#331)
- SDEG-2026-09-21-003 — persist AP/MP cap 20
- SDEG-2026-09-21-004 — applyRewards pow2 O(level) — helper on #466; Motoko not wired
- SDEG-2026-09-22-001 — compounding battle HP vs linear persist cap — helper on #466
- SDEG-2026-09-22-002 — empty keys drop starters on `setSpellBarOrder` (vehicle #400)
- SDEG-2026-09-22-003 — empty keys hydrate spell levels from localStorage (vehicle #388)
- SDEG-2026-09-22-004 — atk/res never grow — helper on #466
- SDEG-2026-09-22-005 — unpaid death slot-only keys (vehicle #385)
- SDEG-2026-09-23-001 — BuffShop `greater_health_potion` alias (vehicle #466)
- SDEG-2026-09-23-002 — `upgradeSpell` minLevel grandfather (vehicle #466)
- SDEG-2026-09-23-003 — `saveKillCount` additive
- SDEG-2026-09-23-004 — `getSessionState` blood default 50; covenant by name
- SDEG-2026-09-23-005 — Motoko pow2 short-circuit (vehicle #466 helper)

---

## New (2026-09-24)

ACTION_ID: SDEG-2026-09-24-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Preserve unpaid death 20/40 localStorage keys across APP_VERSION wipe  
CATEGORY: stale-client  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `App.tsx` **297–317** `localStorage.clear()` then restores only keys `shouldPreserveVersionGateKey` accepts. Before this run that was spawn/level-up config + `*_inventory`. Unpaid death lives at `pbv_pending_death_penalty_slotN` (`deathPenalty.ts` **310**). The canister has no pending-death map. A player who died yesterday, failed `saveBattleStats`, then hit a version bump lost the replay and kept pre-cut XP/Doka. #385 will write `pbv_pending_death_penalty_${principal}_slotN` — both prefixes now keep. Panel layout `pbv_panel_layout_*` remains wipeable (canister `uiLayout` is authority).  
SYSTEMS_AFFECTED: `versionGate.ts`; `App.tsx` version wipe; `deathPenalty.ts`; heal/shop `applyUnpaidDeathPenaltyToWrite`  
RECOMMENDED_ACTION: Landed this run. Keep the prefix when #385 lands. Do not store the marker on a required Character field.  
AUTONOMY: IMPLEMENT  
DEPENDENCIES: None; complementary to #385 (do not clone)  
MIGRATION_REQUIREMENT: None (browser cache policy; idempotent keep)  
REGRESSION_RISK: LOW — still wipes auth/session noise; does not re-apply a cut that already confirmed  
VALIDATION_REQUIRED: Fixture `pbv_pending_death_penalty_slot1` survives `collectPreservedLocalStorage` after a fake version bump; II-scoped key also kept. `pnpm typecheck` / `pnpm check`.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-24-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: saveCallerUserProfile must keep stored uiLayout on name-only writes  
CATEGORY: stale-client  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `saveCallerUserProfile` (`main.mo` **69–85**) does `userProfiles.add(caller, profile)` with no field merge. Official ProfileSetup always sends `uiLayout: ""` (`ProfileSetup.tsx` **45–52**). `saveUserUiLayout` is the layout writer and **does** merge (`main.mo` **101–108**). `useGetCallerUserProfile` returns `null` on throw (`useCharacterQueries.ts` **36–38**). App.tsx **369–393** treats timed-out / null profile as ProfileSetup. A six-month player whose layout already lives on the canister can re-submit name + empty blob and wipe panels. Helper `mergeUserProfileWrite` / `profileSetupWouldWipeLayout` landed this run. Motoko not wired (older persist PRs own `main.mo`).  
SYSTEMS_AFFECTED: `saveCallerUserProfile`; `userProfiles`; `saveUserUiLayout`; ProfileSetup; DraggablePanel  
RECOMMENDED_ACTION: Motoko: `{ existing with name = profile.name }` when incoming `uiLayout` is empty; keep full replace only when the blob is non-empty. Frontend: merge before mutate. First-create (stored null) still stores `""`.  
AUTONOMY: IMPLEMENT (helper this run); HUMAN (Motoko after older persist PRs)  
DEPENDENCIES: Do not edit `main.mo` until #362/#437 land or restack  
MIGRATION_REQUIREMENT: None — behavior-only; empty uiLayout remains valid  
REGRESSION_RISK: LOW if empty still means first create; MEDIUM if a client used empty to intentionally clear layout  
VALIDATION_REQUIRED: Stored layout + name-only save keeps the blob; first create with no row still writes `""`; second merge is a no-op.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-24-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Clear dungeon + canister buff maps on deleteCharacter (slot occupancy)  
CATEGORY: progress-idempotency  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `deleteCharacter` / `createCharacter` call `_clearBossRushForSlot` (`main.mo` **368–370**, **489–491**). `dungeonRecords` is Principal-keyed (`main.mo` **2894–2924**) and is not removed. `buffInventories` is `principal#slot` (`_buffKey` **2791–2793**) and is not removed. A player who deletes slot 2 and creates a new champion there resumes the account dungeon chain and any leftover `purchaseBuff` stacks. Official BuffShop never uses the canister map (`${principal}_inventory` is account-wide). SDEG-005 hydrate that copies localStorage into slot maps must not sum stacks (`hydrateBuffStacksIntoSlot`). Related to SDEG-007 (idempotent dungeon writes) but this is occupancy, not +1 maps.  
SYSTEMS_AFFECTED: `deleteCharacter`; `createCharacter`; `dungeonRecords`; `buffInventories`; SDEG-005  
RECOMMENDED_ACTION: On delete (and create into a vacant slot): remove `_buffKey(caller, slot)`. Decide whether dungeon stays account-wide (document) or becomes `principal#slot` with SDEG-007. Do not wipe Doka or achievements (principal-scoped by design).  
AUTONOMY: HUMAN (Motoko occupancy); IMPLEMENT (contract helper this run)  
DEPENDENCIES: SDEG-2026-08-31-007 for dungeon key change; SDEG-2026-08-31-005 for buff hydrate  
MIGRATION_REQUIREMENT: YES if dungeon keys change to principal#slot (copy Principal-only onto slot 1). Buff clear is behavior-only.  
REGRESSION_RISK: MEDIUM if dungeon reset on delete surprises players who treat it as account progress  
VALIDATION_REQUIRED: Delete slot 1, create new character: Boss Rush (0,0,0); dungeon either documented inherit or reset; canister buff slot empty; Doka unchanged.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-24-004  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Stop seeding boss kits with spell ids the boot purge deletes  
CATEGORY: content-id-stability  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Every start/upgrade `spellConfigs.remove`s `OLD_SPELL_IDS` (`main.mo` **686–697**), including live starter `physical_attack`. `AdminLib.defaultBossConfigs` (`admin.mo` **349–568**) still seeds `fireball`, `blood_nova`, `mist_form`, `drain_life`, `physical_attack`, … Empty-only seed: a canister that already has `bossConfigs` keeps those ids forever; a fresh import writes them then immediately purges the catalog rows. `upgradeSpell` / enemy catalog lookup uses `spellConfigs.get`. Frontend `bossKits.ts` already uses live ids (`spell-inferno`, …) plus `physical_attack`. Helper `motokoBossKitIdsPurgedFromSpellConfigs` lists 14 overlapping ids. Do not change combat resolution in this run.  
SYSTEMS_AFFECTED: `spellConfigs` boot purge; `bossConfigs` seed; enemy/boss kits; future discovery  
RECOMMENDED_ACTION: Align Motoko seed pools with live catalog ids (same as `bossKits.ts`) **or** stop purging ids kits still need (`physical_attack`). Persist `oldId → newId` before any destructive kit rewrite (SDEG-003). Never match display names.  
AUTONOMY: HUMAN (seed/purge policy; combat-adjacent); IMPLEMENT (id-overlap helper this run)  
DEPENDENCIES: SDEG-2026-08-31-003  
MIGRATION_REQUIREMENT: YES if existing `bossConfigs` rows are rewritten — one-shot generation, not every upgrade  
REGRESSION_RISK: HIGH if kits are rewritten without an alias (yesterday’s canister vs six-month admin edits)  
VALIDATION_REQUIRED: After two upgrades, `pale_archbishop` phase1 ids resolve in `spellConfigs`; `physical_attack` remains a player starter.  
STATUS: NEW  

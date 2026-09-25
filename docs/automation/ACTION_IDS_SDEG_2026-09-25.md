# ACTION_IDs — 2026-09-25 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-09-25.md`](./DATA_EVOLUTION_AUDIT_2026-09-25.md).  
Prior: `ACTION_IDS_SDEG_2026-09-24.md` (#508), `ACTION_IDS_SDEG_2026-09-23.md` (#466).  
Do not edit shipped `20260831` / `20260901` NewActor. Do not edit `WorldExploration.tsx` / `main.mo` / `BuffShop.tsx` / `deathPenalty.ts` while older persist PRs are queued.

---

## Carry-forward (still OPEN — do not re-mint)

All SDEG-2026-08-31 through SDEG-2026-09-24 items remain as previously ledgered. Vehicles: #362, #385, #386, #388, #400, #408, #437, #466, #490, #508.

---

## New (2026-09-25)

ACTION_ID: SDEG-2026-09-25-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Preserve feat counters and shrine/covenant caches across APP_VERSION wipe  
CATEGORY: stale-client  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Pre-fix `versionGate.ts` **7–13** kept only spawn/levelup/`*_inventory`. `App.tsx` **297–317** clears everything else. Official feat progress for `explore_25_maps` / `loot_10_doka` is `localStorage` only (`WorldExploration.tsx` **2193–2200**, **6471–6477**, **11398–11406**). Covenant maps + shrine feat counts: **1373–1403**, **11330–11352**. Canister `markAchievementUnlocked` only fires after the counter crosses the threshold — a wipe mid-grind resets progress. Already-unlocked `achievementProgress` rows are unaffected. #508 preserves unpaid death only; #490 rekeys counters by principal but does not survive version wipe.  
SYSTEMS_AFFECTED: `versionGate.ts`; `App.tsx` wipe; feat unlock path; shrine/covenant UX  
RECOMMENDED_ACTION: Landed this run (union #508 unpaid-death prefix + feat/covenant/shrine keys). Do not preserve `*_pbv_active_spells` / `*_pbv_spell_levels` while #388 empty-keys hydrate is open.  
AUTONOMY: IMPLEMENT  
DEPENDENCIES: Union with #508 `versionGate.ts`  
MIGRATION_REQUIREMENT: None (browser cache policy)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Fixture keys for maps/ground-doka/covenant/shrine/unpaid-death survive `collectPreservedLocalStorage`; panel layout and active_spells still drop.  
STATUS: IMPLEMENTED  

---

ACTION_ID: SDEG-2026-09-25-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Clear slot-scoped browser leftovers on deleteCharacter  
CATEGORY: progress-idempotency  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Canister `deleteCharacter` (`main.mo` **450–492**) clears the slot + `_clearBossRushForSlot` only. Official UI (`CharacterSelection.tsx` **875**) does not remove `${owner}_slotN_pbv_maps_visited_count`, `pbv_ground_doka_pickups`, `pbv_active_spells`, `pbv_spell_levels`, `pbv_covenant_buff_*`, `pbv_shrine_count_*`, or `pbv_pending_death_penalty_slotN`. A new champion in the same slot inherits those caches. Distinct from canister dungeon/buff leftovers (SDEG-2026-09-24-003).  
SYSTEMS_AFFECTED: deleteCharacter UX; feat counters; unpaid death; shrine/covenant  
RECOMMENDED_ACTION: Helper lists keys (`slotBrowserLeftoverEvolve.ts`). Wire `localStorage.removeItem` in CharacterSelection after successful delete (not on older persist PR file set).  
AUTONOMY: IMPLEMENT (helper); HUMAN (CharacterSelection wire)  
DEPENDENCIES: Prefer after #490 principal keys land so clears target the canonical owner  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: LOW if only cleared on successful delete of that slot  
VALIDATION_REQUIRED: Delete slot 2 → recreate → mapsVisited 0, no inherited covenant, no unpaid death replay for the new row.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-25-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Official client never persists blood/covenant/shrine via updateSessionState; saveActiveSpells Nat path is dead  
CATEGORY: dual-write / orphan API  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Grep of `src/frontend/src/components` finds no `updateSessionState` / `getSessionState` / `saveActiveSpells(` call sites. WX **2830–2831** states saveActiveSpells was removed in favor of `setSpellBarOrder`. Backend still mutates optionals at `main.mo` **3120–3207** and defaults blood to 50 at **3232**. Covenant is free Text (name). Live play uses localStorage only — ties to 001 wipe + 002 delete leftovers. Distinct from SDEG-2026-09-23-004 (API default) and #362 (keep-store if something still writes Nat loadouts).  
SYSTEMS_AFFECTED: session state API; Character optionals; localStorage shrine/covenant  
RECOMMENDED_ACTION: Either wire official UI to `updateSessionState` **or** document localStorage as sole authority and eventually stop writing Character session fields from raw clients. Do not delete `activeSpells` field (M0169). Helper: `sessionStateEvolve.ts`.  
AUTONOMY: IMPLEMENT (contract); HUMAN (WX wire or Motoko reject raw session writes)  
DEPENDENCIES: Do not edit WX while combat/persist PRs queue  
MIGRATION_REQUIREMENT: None for documentation; YES if session fields move to required  
REGRESSION_RISK: MEDIUM if Motoko starts rejecting null blood while six-month rows are null  
VALIDATION_REQUIRED: Official play never invokes those three methods; raw saveActiveSpells still accepted on main.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-25-004  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Guard upgradeSpell against spellLevelKeys/Values length mismatch  
CATEGORY: schema-corruption  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `upgradeSpell` (`main.mo` **998–1000**) does `spellLevelValues[idx]` while iterating keys with no `idx < values.size()` check. Misaligned arrays trap the update. Official create clears both (`_starterCharacter` **225–226**); update keep-stores (**429–430**); upgrade appends pairwise when granting. Raw clients or historical corruption can brick a slot's paid upgrades.  
SYSTEMS_AFFECTED: `upgradeSpell`; Character parallel arrays  
RECOMMENDED_ACTION: Frontend preflight (`spellLevelArrayEvolve.ts`) before mutate. Motoko: return `#err` when sizes differ (after older persist PRs release `main.mo`).  
AUTONOMY: IMPLEMENT (helper); HUMAN (Motoko)  
DEPENDENCIES: main.mo queue  
MIGRATION_REQUIREMENT: Optional one-shot truncate/pad misaligned rows — only with generation  
REGRESSION_RISK: LOW for reject-on-mismatch; HIGH for silent truncate  
VALIDATION_REQUIRED: keys=["a","b"] values=[1] → helper rejects; Motoko later returns `#err` not trap.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-25-005  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: One-shot Doka claim ids are memory-only (document remount remint surface)  
CATEGORY: remint  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Claims use in-memory `Set` (`WorldExploration.tsx` **1371**, `dokaPersist.ts` **71–75**). Map loot spawn resets the Set (**6790 / 6799**). Not in localStorage → version wipe cannot lose a claim id. Remount mid-map that respawns loot with `collected: false` can remint.  
SYSTEMS_AFFECTED: ground Doka; shrine; dungeon-complete one-shots  
RECOMMENDED_ACTION: Helper documents storage class (`oneShotClaimStorageEvolve.ts`). Durable claims would need WX or canister one-shot map (later chain file) — do not edit WX this run.  
AUTONOMY: IMPLEMENT (document); HUMAN (durable claims)  
DEPENDENCIES: WX queue for wire-up  
MIGRATION_REQUIREMENT: YES if canister one-shot map is added (later file after 20260901)  
REGRESSION_RISK: MEDIUM for durable claims (false keep vs remint tradeoff already handled by settleOneShot*)  
VALIDATION_REQUIRED: versionWipeRemintsOneShotViaClaimLoss() === false; remount case remains OPEN.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-25-006  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Align gameTypes.Character with Motoko/bindgen (drop dokaBalance; require pattern/stats)  
CATEGORY: stale-client  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `gameTypes.ts` **29–50** still has `dokaBalance?`, optional `pixelPattern`/`stats`, `[key: string]: unknown`. Motoko Character (`main.mo` **122–145**) requires pattern/stats/spell arrays and has no dokaBalance. CharacterCreation **271** still sends `dokaBalance`. Bindgen `backend.ts` **85–102** matches Motoko.  
SYSTEMS_AFFECTED: CharacterCreation; create/update payloads; TypeScript honesty  
RECOMMENDED_ACTION: Tighten gameTypes; strip dokaBalance from forge payload. Helper locks drift (`characterClientShapeEvolve.ts`).  
AUTONOMY: IMPLEMENT (helper + optional gameTypes follow-up)  
DEPENDENCIES: CharacterCreation touched by UX PRs (#372/#526) — restack union if editing  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: typecheck; forge create still succeeds without dokaBalance field.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-25-007  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: upgradeSpell cost Nat doubling can wrap  
CATEGORY: overflow  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `main.mo` **1018–1023** `cost := cost * 2` in a loop with no saturation. Distinct from applyRewards pow2 and GameKey wrap.  
SYSTEMS_AFFECTED: `upgradeSpell` pricing  
RECOMMENDED_ACTION: Frontend refuse past safe exponent (`upgradeSpellCostEvolve.ts`); Motoko saturating mul or `#err` later.  
AUTONOMY: IMPLEMENT (helper); HUMAN (Motoko)  
DEPENDENCIES: main.mo queue  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: LOW if refuse-only on absurd levels  
VALIDATION_REQUIRED: level 3 OK; level ≥130 flagged.  
STATUS: NEW  

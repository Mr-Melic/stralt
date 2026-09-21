# ACTION_IDs — 2026-09-21 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-09-21.md`](./PX_COHERENCE_AUDIT_2026-09-21.md)

Prior PX records remain **open** unless noted. Do not re-file:

- `PXA-2026-08-31-001` … `015` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md)
- `PXA-2026-09-01-001` … `003` in [`ACTION_IDS_2026-09-01.md`](./ACTION_IDS_2026-09-01.md)
- `PXA-2026-09-02-001` and `PXA-2026-09-02-003` in [`ACTION_IDS_PXA_2026-09-02.md`](./ACTION_IDS_PXA_2026-09-02.md)

**Closed this cycle (do not re-open):**

- `PXA-2026-09-02-002` — accepted challenge HUD. Live gate is `shouldShowChallengeHud` (`challengeHudVisibility.ts`). WX still passes accept-window `visible`; the panel keeps `accepted && hasChallenge`.
- `PXA-2026-08-31-006` display half — Blood bar remains gone (`GameFlow.tsx` 282–290). Session field `bloodBalance` stays inert.

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

---

ACTION_ID: PXA-2026-09-21-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Move flavor-lore Enemy Register off the world HUD  
CATEGORY: visual-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `#328` (`9e28cf9`) labeled the panel `FLAVOR LORE` and “not the live spawn roster” (`enemyRegisterCopy.ts` 6–12; `EnemyRegister.tsx` 322–370; tests in `enemyRegisterCopy.test.ts`). The world leftover-XP bar still opens it with a button titled **Enemies** (`WorldExploration.tsx` 17845–17857). Inside, `MONSTERS` still teach wall-phase, ice weakness, magic immunity, evasion (`EnemyRegister.tsx` 28–88) while live families are a 30% overlay (`WX` 5862–5866) with Ember burn / Tide −1 MP / Void 25% reflect (`WX` 16789–16820; `castHelpers.ts` 336–345). Archbishop tip still claims pawn-invuln (91–96) — unused `combinedMechanic` copy (`useBossRush.ts` 31–32). GameFlow already has a **Bosses** guide (337–346). A combat-bar control whose first sentence is “this is not the game” answers none of the four PX questions; it adds a language the player must unlearn. Copy rewrite of the card itself remains PXA-2026-09-01-001.  
SYSTEMS_AFFECTED: enemies, visual feedback, bosses, terminology  
RECOMMENDED_ACTION: SIMPLIFY. Remove the **Enemies** control from the leftover-XP / world HUD. If lore is wanted, put it behind pause / codex / a Feats-adjacent menu, not next to Center and Buy Doka. Do not teach wall-phase or elemental types from combat chrome. Do not implement EBA-024 (admin-lore wire) until PXA-2026-09-01-001 makes every remaining sentence traceable to `buildEnemyKit`, a family hook, or `BossAbility`. Do not delete `enemyRegisterCopy` honesty strings while the panel exists.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT to hide the world-HUD button and mount the panel from GameFlow’s realm-tool row (or drop it). HUMAN_DESIGN_REQUIRED to keep it as a live bestiary.  
DEPENDENCIES: PXA-2026-09-01-001 (honest copy if the panel stays); PXA-2026-08-31-007 (one poster); PXA-2026-08-31-012 (Enemies vs Bosses vs Flavor Lore). Does not close 09-01-001.  
REGRESSION_RISK: LOW for moving or hiding the button. MEDIUM if the panel is deleted while a test or ocid `enemy_register.open_modal_button` is treated as a player journey gate.  
VALIDATION_REQUIRED: World leftover-XP row has XP, Doka, zone, Center — not Enemies. Opening a unit in combat still shows live HP. If the panel remains elsewhere, the honesty banner still says flavor. Typecheck clean.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-21-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Do not overlay Wave-3/4 design catalogs on the live gifted book and 22 modifiers  
CATEGORY: feature-bloat  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: After `58302bc`, identity-named merges were docs-only: formations drop 3 (`docs/design/ENEMY_FORMATIONS_2026-09-02.md`, `#276`), AI evolution increment (`docs/ENEMY_AI_EVOLUTION_2026-09-02.md`, `#280`), spell Wave 3 (`SPELL_PROPOSALS_2026-09-02.md`, `#282`), boss Wave 4 sheets (`BOSS_AND_SPELL_DISCOVERY.md`, `#293`), discovery Wave 3 (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`, `#300`). Live loop is unchanged: innate 32-id book (`WX` 2395–2400), `shouldIncludeBackendSpellInLibrary` is not a gate (`adminSafety.ts` 711–718), kits NaN-stuck at zone 0 (`WX` 11920), 22 map modifiers (`mapModifiers.ts` 152–471), `worldFeatures.ts` still test-only (`pickWeightedFeatures` callers). Formations are a fifth poster on piece + family + aiTier + lore Register. Wave-3 spell ids into a gifted book are more clones, not discovery. Rune Bearer / Grimoire Stalker remain a second unlock language beside PXA-001. Shipping any of these before PXA-001 / 007 / 008 makes encounter rules less comprehensible. PXA-2026-09-01-003 owns World Dynamics overlay only; this ID owns the **new** catalogs.  
SYSTEMS_AFFECTED: enemies, AI, spells, spell discovery, bosses, world events, dungeons  
RECOMMENDED_ACTION: MERGE or hold. Keep the catalogs as design notes. Do not wire formation packs, SDE Wave-3 ids, boss Wave-4 sheets, or spell-proposal ids into spawn, `starterSpells`, or `ownedSpells` until (1) innate set is Strike + 2–3 starters, (2) one enemy poster + working kit bands, (3) live events are a learnable set whose announce matches the hook. Do not treat `#300` as a live discovery ship. Do not add a formation HUD.  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-001; PXA-2026-08-31-007; PXA-2026-08-31-008; PXA-2026-09-01-003; EBA-013 (kit adapter). Supersedes “later implementer may overlay” notes in those design docs for production.  
REGRESSION_RISK: LOW while docs-only. HIGH if overlay lands in `mapGen.ts`, `spawnPolicy.ts`, or WX without a solvability re-check (AGENTS.md forbids casual mapGen).  
VALIDATION_REQUIRED: No `pickWeightedFeatures` / formation pack caller in spawn/map install. New character still would own ≤4 spells after PXA-001 (today owns 32 — do not “fix” by adding more). Import gate if any gameplay file is touched.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-21-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Replace Crush / Fire Bolt melee fallback with the live Strike id  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: When an enemy kit action does not land, WX melee fallback builds an inline pool `{ id: "e-crush", name: "Crush" }` / `{ id: "e-firebolt", name: "Fire Bolt", range: 3 }` (`WorldExploration.tsx` 16703–16715). Those ids are absent from `starterSpells` (`spellData.ts` 9–691), from `bossKits.ts` `SPELL_ID_CATALOG`, and from canister `defaultSpells()`. Adjacent melee (`nd <= 1`) can log **Fire Bolt**. On Paper Windstorm maps the same fake row is ranged-gated (`isPaperWindstorm && fb.range > 1 && Math.random() < 0.5` at 16729), so an adjacent “Fire Bolt” can miss 50% while player Windstorm is 30% any hit (9563–9572) and announce says reach halved (`mapModifiers.ts` 251). Kit assignment comment still says “10 random spells” (11915) while `buildEnemyKit` is the real path (11920). Uncatalogued verbs fail explicit-metadata, overlapping identities, and comprehensible encounter rules. Windstorm dual-rate remains PXA-2026-09-02-003; this ID is the fake spell names.  
SYSTEMS_AFFECTED: enemies, AI, spells, world events, visual feedback  
RECOMMENDED_ACTION: MERGE. Adjacent fallback is `physical_attack` / Strike (same id the zone-0 kit already uses). Delete `e-crush` / `e-firebolt`. Do not add them to the catalog. Do not roll a ranged id for `nd <= 1`. Do not invent a second melee damage table. Log the live spell name. Stale “10 random spells” comment should match `buildEnemyKit`.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT (replace the two-object pool with Strike; drop Windstorm’s `fb.range` branch by using real kit range). HUMAN_DESIGN_REQUIRED to keep a named Crush as a new catalog spell.  
DEPENDENCIES: PXA-2026-08-31-002 (clone merge); PXA-2026-09-02-003 (one Windstorm function — fallback must call it, not a third rate). EBA-013 does not block this: zone-0 kits already include Strike.  
REGRESSION_RISK: MEDIUM — Fire Bolt’s 8 vs Crush’s 12 (then `level/5`) changes adjacent chip damage. LOW if both map to Strike’s existing melee math. Do not restack the whole enemy-turn block while **#327** owns WX challenge/targeting overlap.  
VALIDATION_REQUIRED: Adjacent fallback logs Strike, not Fire Bolt. No `e-crush` / `e-firebolt` in `src/frontend`. Windstorm miss for that hit uses the single chosen hook. `pnpm typecheck`. Spectate a pawn that fails a kit cast: damage path is physical_attack.  
STATUS: NEW

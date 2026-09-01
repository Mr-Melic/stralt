# ACTION_IDs — 2026-09-01 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `dd275aa`  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-09-01.md`](./PX_COHERENCE_AUDIT_2026-09-01.md)

Prior PX records `PXA-2026-08-31-001` … `015` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) are **still open**. Do not re-file them.

Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

---

ACTION_ID: PXA-2026-09-01-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Make the Enemies register describe only rules the engine runs  
CATEGORY: encounter-honesty  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: World HUD **Enemies** (`WorldExploration.tsx` 18211–18224) opens `EnemyRegister.tsx`. `MONSTERS` 22–83 teach wall-phase, elemental weaknesses, evasion, magic immunity, poison stacks, burning **tiles**, HP regen, earth-weak, storm clouds. Live family overlay (`WorldExploration.tsx` 6448–6537) is a 30% stat/pixel roll over seven ids. Only three have combat hooks, and they do not match the card: Ember Knight applies a 3/3 melee DoT (17224–17238), not burning tiles; Tide Shade applies −1 MP / 2 turns on melee (17240–17255), not adjacent slow + regen + lightning weakness; Void Mirror reflects 25% of pre-mitigation damage (`castHelpers.ts` 326–336), not “immune to magic until physical.” Crimson Spawn / Shadow Lurker / Storm Caller are **not in the roll**. Archbishop tip (90) claims invulnerability while pawns live — that is unused rush-pair copy (`useBossRush.ts` 31–32), not `BossAbility`. `evasion` is persist-only (`combatMath.ts` has no reader). Combat has no earth/lightning weakness table. This is a player-facing rule card for a different game. EBA-2026-08-31-024 would wire the same panel to admin lore and make the lie data-driven.  
SYSTEMS_AFFECTED: enemies, visual feedback, bosses, AI, admin-enabled content  
RECOMMENDED_ACTION: REWORK. Rewrite Register (and Boss tips that invent pair rules) so each line is traceable to `buildEnemyKit`, a family hook, or a `BossAbility`. Promote Ember / Tide / Void hooks to explicit kit metadata (not `family === "ember_knight"` name tests). Remove elemental / evasion / immunity sentences until combat implements them. Do not implement EBA-024 until this card is honest. Fold leftover family names into PXA-007’s single poster.  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-007 (one poster); PXA-2026-08-31-003 (do not teach unused rush pairs as general boss rules); blocks EBA-2026-08-31-024  
REGRESSION_RISK: LOW for copy-only. MEDIUM if family hooks move into kits without retargeting `BOSS_KITS` / `ENEMY_KITS`.  
VALIDATION_REQUIRED: Every Register sentence has a cited engine path. A Wraith Bishop does not drain MP unless that hook exists. Spectate Ember melee: card says burn DoT, not tiles. Typecheck clean.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-01-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Modifier announce, admin labels, and live hooks must be the same sentence  
CATEGORY: world-events  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Paper Windstorm announce is “ranged spell reach halved” (`mapModifiers.ts` 249–257); registry comment says targeting applies ×0.5; `targeting.ts` has no windstorm branch. Live WX is `isPaperWindstorm && spellRange > 1 && Math.random() < 0.5` miss (16926–16930; enemy path 17164). Blood Moon announce is flavor (`mapModifiers.ts` 261–267, hook marked placeholder) while `spellEngine.ts` 895 applies ×1.25 to non-heals; admin label claims “−25% heal” (`AdminDashboard.tsx` 4485) — no heal cut exists. Gravity Well / Fog of War announce and admin labels claim push/pull and 3-tile hide (4484–4486); registry hooks are empty (280–296); WX stores `_isGravityWell` / `_isFogOfWar` (2326–2328) unused. Frozen Terrain admin claims “LoS +1” (4494–4495); engine is `onMpCost * 2` only (164–172), identical to Slime Flood. AFDA-2026-08-31-016 owns **id-list** drift; this ID owns **rule-card** drift on ids that already roll. Violates “comprehensible encounter rules” and “admin-enabled content changes.”  
SYSTEMS_AFFECTED: world events, admin-enabled content, visual feedback, challenges  
RECOMMENDED_ACTION: REWORK copy immediately: Paper Windstorm announce = “ranged spells miss half the time”; Blood Moon announce = “+25% non-heal damage” (drop −25% heal from admin). DEPRECATE or implement Gravity Well / Fog of War (no announce, no admin label, no roll until a hook exists). MERGE Frozen into Slime or give Frozen a real extra rule. Cap at one player-facing modifier unless a named dungeon rule (PXA-008).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT for announce/admin string fixes only; HUMAN_DESIGN_REQUIRED to implement or delete empty ids  
DEPENDENCIES: PXA-2026-08-31-008 (slim the set); AFDA-2026-08-31-016 (dropdown = registry ids)  
REGRESSION_RISK: LOW for string-only. MEDIUM if empty ids are removed from a live canister roll table without a migrate.  
VALIDATION_REQUIRED: Announce text, Map Effects description, and admin label match the hook that fired. Paper Windstorm never changes range. Blood Moon does not reduce heals. Gravity/Fog never appear until implemented.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-01-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Do not stack the World Dynamics catalog on 22 modifiers or a second discovery path  
CATEGORY: world-events  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `worldFeatures.ts` 1–18 is an unwired catalog. `WORLD_DYNAMICS.md` 43 keeps the live 22-modifier two-roll **and** adds up to `MAX_ROLLED_FEATURES` (3) extra tile/encounter/event rolls (`worldFeatures.ts` 30, 875–893). WDD-2026-08-31-001 tells a later implementer to overlay `pickWeightedFeatures` after finalize. Rune Bearer (`worldFeatures.ts` 499–516) grants a **map-only attune** of an enemy spell id — a second discovery language beside the gifted innate book (PXA-001) and the designed observe→win→unlock (SDE). Blood Altar (528–541) adds a fourth “Blood” (unused HUD bar, Blood Moon, Blood Mend, altar). Live maps already fail the “learnable event list” test (PXA-008, PXA-2026-09-01-002). Stacking a third language answers none of the four PX questions; it adds explanation load.  
SYSTEMS_AFFECTED: world events, spell discovery, dungeons, rewards, visual feedback  
RECOMMENDED_ACTION: MERGE or hold. Keep the catalog as design notes. Do not wire `pickWeightedFeatures` onto the current 22. After PXA-008 slims live events and PXA-001 picks one discovery path, promote at most a short list of *new* decisions (risk tiles that use % max HP are the ones that stay relevant with no cap). Kill or rename Blood Altar until Blood is a real spend. Do not ship Rune Bearer attune as a substitute for observe→win→unlock.  
AUTONOMY: HUMAN_DESIGN_REQUIRED  
DEPENDENCIES: PXA-2026-08-31-001; PXA-2026-08-31-008; PXA-2026-09-01-002; supersedes WDD-2026-08-31-001’s “later implementer may overlay” for production  
REGRESSION_RISK: LOW while unwired. HIGH if overlay lands in `mapGen.ts` or WX without a solvability re-check (AGENTS.md forbids casual mapGen).  
VALIDATION_REQUIRED: No `pickWeightedFeatures` caller in spawn/map install. Death Realm still rolls empty. A design review picks one discovery path before any attune tile.  
STATUS: NEW

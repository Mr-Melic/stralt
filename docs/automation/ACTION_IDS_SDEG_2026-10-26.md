# ACTION_IDs — 2026-10-26 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-10-26.md`](./DATA_EVOLUTION_AUDIT_2026-10-26.md).  
HEAD: `0f5363f`.  
Do not clone #362 / #388 / #400 / #408 / #466 / #490 / #508 / #577 / #828 / #893 / #1014 / #1083.  
Do not edit WorldExploration / main.mo / BuffShop / versionGate / deathPenalty / App / AchievementsPanel / combatMath / DraggablePanel / ChallengePanel / SpellbookModal this stack.

---

ACTION_ID: SDEG-2026-10-26-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: explore_25_maps persist is a portal-transition counter, not unique map IDs  
CATEGORY: achievements / entity IDs  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 6469–6477 increments `mapsVisitedCountRef` and writes `${userId}_slotN_pbv_maps_visited_count` on every map apply after a portal. Hydrate at 2191–2198. Idle feat gate 2275–2276 fires `explore_25_maps` when the counter ≥ 25. Catalog copy is “Visit 25 different maps.” (`admin.mo` 315; `victoryAchievements.ts` 32). Procedural maps have no stable id. Death Realm / Rest Area / revisits all increment. Distinct from mapsVisited **keying/wipe/inherit** (10-24-003 / #490) and from loot_10 idle gating (10-25-002).  
SYSTEMS_AFFECTED: WorldExploration portal apply; `explore_25_maps` / explorer feat; localStorage visit counter  
RECOMMENDED_ACTION: Helper `shouldCountPortalTransitionTowardExplore25` skips Death Realm and Rest Area. Do not persist a required Character map-id set until a later chain file after 20260901. A counter cannot be expanded into which maps a six-month-old player visited. Wire WX when that file is editable.  
AUTONOMY: HELPER  
DEPENDENCIES: None for helper; WX vehicle for lock; do not clone #1014 slot keys  
MIGRATION_REQUIREMENT: None (client counter). YES only if unique map ids become a required Character / progress field (later file after 20260901, empty-set default, idempotent).  
REGRESSION_RISK: LOW for helper; MEDIUM if WX stops counting Death Realm without updating feat copy  
VALIDATION_REQUIRED: Overworld portal → count; Death Realm / Rest → predicate false; unique-id recovery flag false.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-26-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: APP_VERSION wipe drops live boss / Boss Rush localStorage catalogs  
CATEGORY: configuration references / stale-client  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Official bosses load from `pbv_boss_configs` (`useBossQueries.ts` 12–21; WX 6486–6489). Canister `getAllBossConfigs` is unused; Motoko vs frontend BossConfig schema skew (10-24-008). Admin rush drafts use `bossRushConfig`; WX writes `pbv_boss_rush_config` (10-24-016). HEAD `shouldPreserveVersionGateKey` (`versionGate.ts` 8–12) keeps only `pbv_tier_spawn_config`, `pbv_levelup_config`, and `*_inventory`. `App.tsx` 297–317 `localStorage.clear()` then restores that keep-list. Distinct from unpaid-death keep (#508) and from palette not being a mandatory gameplay dep (10-24-019).  
SYSTEMS_AFFECTED: version-gate wipe; `pbv_boss_configs`; `bossRushConfig`; `pbv_boss_rush_config`; boss portals  
RECOMMENDED_ACTION: Helper landed. OR these keys into `shouldPreserveVersionGateKey` on the #508 vehicle (union the death prefix; do not overwrite). Do not make a boss-config id required on Character.  
AUTONOMY: HELPER  
DEPENDENCIES: #508 (union versionGate.ts; do not clone; do not edit versionGate this stack)  
MIGRATION_REQUIREMENT: None (browser cache policy; idempotent keep). YES if live bosses move to canister as a new required map — later file after 20260901, empty defaults.  
REGRESSION_RISK: LOW for helper; MEDIUM if keep restores a schema-skewed blob without parse fallback  
VALIDATION_REQUIRED: HEAD keep-list drops `pbv_boss_configs`; intended keep predicate true; `pbv_color_palette` stays optional.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-26-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Spell-upgrade advertised JS cost overflows and can zero the persist-lock wallet  
CATEGORY: unbounded progression / stale-overwrite  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Motoko `upgradeSpell` (`main.mo` 1017–1023) charges `base * 2^level` with Nat — no spell-level cap. SpellbookModal 443–447 advertises `10 * 2 ** currentLevel` (summons 10×). Around level 53 that product leaves `Number.MAX_SAFE_INTEGER`; high exponents are `Infinity`. `spellUpgradeCanisterSpend(Infinity)` (`spellUpgrade.ts` 135–141) returns Infinity; `committedDokaAfterSpellUpgrade` 164 does `max(0, before - Infinity) = 0`. `saveBattleStats` 2087 writes the lower wallet. Distinct from leftover-XP Number() on applyRewards (10-24-001 / 09-27-003). Advertised cost also ignores live `levelUpConfig.spellLevelingBaseCost` (WX never fetches it — 10-23-001).  
SYSTEMS_AFFECTED: SpellbookModal upgradeCost; persistSpellUpgrade lock; saveBattleStats Doka; upgradeSpell Nat cost  
RECOMMENDED_ACTION: Helper `spellUpgradeCanisterCostBigInt` + freeze the seeded wallet when advertised cost is not a safe integer. Wire Spellbook / persistSpellUpgrade later. Do not add a Character spell-level cap. Do not edit spellUpgrade.ts this stack (persist vehicles).  
AUTONOMY: HELPER  
DEPENDENCIES: None for helper; Spellbook / WX / spellUpgrade.ts vehicles for lock  
MIGRATION_REQUIREMENT: None (client debit guard). No schema.  
REGRESSION_RISK: LOW for helper; HIGH if Infinity advertised cost still reaches saveBattleStats as 0  
VALIDATION_REQUIRED: Level 53 advertised cost is not persist-safe; Infinity freeze keeps 50000; finite backend-after decrease still wins; Motoko-style bigint cost at 53 is `10 * 2^53`.  
STATUS: NEW  

---

## Carry-forward (do not restack)

| ID | Notes |
| :--- | :--- |
| SDEG-001/002 | live `actor {`; GameKey on 20260901; new fields → later file only |
| #490 | BuffShop + maps/ground **keying** by principal |
| SDEG-2026-10-24-003 | mapsVisited / ground-doka wipe/inherit (keying half ⊂ #490) |
| SDEG-2026-10-25-002 | loot_10 idle gate (mapsVisited-only) — not explorer unique-ids |
| SDEG-2026-10-24-008 | live bosses = `pbv_boss_configs` (schema skew); this run is the version-wipe half |
| SDEG-2026-10-24-016 | WX double-encodes `pbv_boss_rush_config` |
| SDEG-2026-10-24-019 | color palette is not a mandatory gameplay persist dep |
| #508 | unpaid-death version-gate keep; union 002 into that file |
| SDEG-2026-10-24-001 | applyRewards Number() leftover XP — not spell-upgrade advertised cost |
| SDEG-2026-09-29-001 | MAX_PERSISTED_AP/MP=20 |
| SDEG-004 | no ownedSpellIds; catalog ∪ starters |

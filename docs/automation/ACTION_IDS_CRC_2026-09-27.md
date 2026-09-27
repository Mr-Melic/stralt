# ACTION_IDs — Content Retirement & Compatibility Manager 2026-09-27

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Content Retirement & Compatibility Manager.  
Audit: [`CONTENT_RETIREMENT_AUDIT_2026-09-27.md`](./CONTENT_RETIREMENT_AUDIT_2026-09-27.md).  
HEAD: `0f5363f`. Production catalogs were **not** modified this run.

Do not implement deletions from this file unless a later human or orchestrator picks an ID **and** a persist-safe alias / lifecycle write is specified. Soft-retire is the default. Do not twin SDA / SDEG / CDA / VAL tickets — those remain the implementer contract for schema and verb-splits; CRC ids are the **deletion-safety** gate.

---

ACTION_ID: CRC-2026-09-27-001  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Stop classifying live starter Strike (`physical_attack`) as obsolete  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Frontend starter id is `physical_attack`, display name Strike (`spellData.ts` 9–25, also first row of `starterSpells`). Motoko `OLD_SPELL_IDS` includes `"physical_attack"` and `remove`s it from `spellConfigs` on every start/upgrade (`main.mo` 686–697). WX `OLD_SPELL_NAMES_SET` includes both `"physical_attack"` and `"Physical Attack"` (`WorldExploration.tsx` 2356–2389). `spellPool` uses filtered backend rows when any exist, else starters **also** filtered by that set (2688–2694). `ENEMY_KITS` request `physical_attack` (`enemyAI.ts` 163–174). `assignEnemySpells` resolves kit ids against `normalizedSpellPool` (WX 11919–11924). `upgradeSpell` needs `spellConfigs.get`. Built-in six (`adminGuard.mo` 21–24) do **not** include this id.  
CURRENT_LIFECYCLE: ACTIVE (combat + starters); wrongly listed DEPRECATED on purge lists  
RECOMMENDED_LIFECYCLE: ACTIVE  
PLAYER_DATA_REFERENCES: `spellLevelKeys` / `spellBarOrder` may hold the id; starters are also granted in UI without keys  
SYSTEM_REFERENCES: `spellData.ts`; `ENEMY_KITS`; `bossKits.ts` `SPELL_ID_CATALOG`; WX hydrate; Motoko purge  
MIGRATION_REQUIRED: No persist remap. Remove the id from `OLD_SPELL_IDS` and `OLD_SPELL_NAMES_SET`. Optionally seed `physical_attack` in `defaultSpells` so `upgradeSpell` resolves. Never `remove` a live starter.  
RECOMMENDED_ACTION: Keep the id forever as innate Strike. Delete it only from the obsolete lists, not from the game. Do not rename to `starter-strike` without an alias table (SDEG).  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDEG-2026-09-02 old-spell purge ticket; SDA-2026-09-02-007 seed starters on canister  
REGRESSION_RISK: HIGH if the id is deleted from `spellData.ts` while kits still name it; HIGH if purge stays and kits stay empty  
VALIDATION_REQUIRED: Enemy pawn kit band 0 includes Strike after hydrate with a non-empty backend pool; `upgradeSpell(slot, "physical_attack")` is not `#err("Spell not found")`; new character still sees Strike on the bar  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-002  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Remap remaining OLD_SPELL_IDS; do not hard-delete ownership  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Same Motoko block (686–697) also purges `blood_nova`, `crimson_heal`, `cursed_gust`, `drain_life`, `entangle`, `fireball`, `frost_nova`, `heal`, `ice_shard`, `inferno`, `meteor_strike`, `mist_form`, `obliterate`, `plague_wave`, `poison_dart`. Comment in `defaultSpells` (`admin.mo` 164–167) says those “have been removed.” Replacement combat ids are hyphenated (`spell-inferno`, `spell-frost-nova`, `starter-heal` named Blood Mend — not `"Heal"`). No `oldId → newId` table. `_spellReferencedByPlayers` only scans keys/bar (`main.mo` 253–284). Motoko boss seeds still list several of these strings (`admin.mo` 358–415).  
CURRENT_LIFECYCLE: DEPRECATED in catalog; possible LEGACY ownership on characters  
RECOMMENDED_LIFECYCLE: LEGACY_SUPPORTED until remap; then MIGRATED. Never SAFE_TO_REMOVE of the string if any character key holds it.  
PLAYER_DATA_REFERENCES: `spellLevelKeys` / `spellBarOrder` / localStorage `pbv_active_spells` (namespaced + legacy, WX 2714–2722)  
SYSTEM_REFERENCES: Motoko purge; WX name set; Motoko `defaultBossConfigs` phase pools; live kits use **new** ids in `bossKits.ts`  
MIGRATION_REQUIRED: YES — one-shot generation + alias table; max level if both old and new exist. Do not keep the every-upgrade `remove` as the migration.  
RECOMMENDED_ACTION: Implement SDEG remap. Keep a retired tombstone row (`lifecycle=retired` per SDA, not a second `usableByPlayer` hack) so owned casts still resolve. Do not concatenate a second purge list.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDEG-2026-09-01/02 OLD_SPELL purge ids; SDA-2026-09-02-001 lifecycle field; CRC-001 (exclude `physical_attack`)  
REGRESSION_RISK: HIGH if `inferno` is aliased onto `spell-inferno` while both exist at different levels; HIGH if name filter `"Heal"` ever matches a new display name  
VALIDATION_REQUIRED: Character with `fireball` in keys still casts after remap; empty keys stay empty; `mops check` unchanged (no new stables required for a one-shot bool — if a flag is added it must be a **later** chain file after 20260901)  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-003  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep both spell catalogs until ownership split; do not delete the six built-ins  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `isBuiltInSpellId` / `BUILT_IN_SPELL_IDS` are `shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse` (`adminGuard.mo` 21–24; `adminSafety.ts` 9–16). `adminDeleteSpellConfig` refuses to delete them (main.mo 886–887). Frontend combat library is `spellData.ts` (32 ids). Hydrate unions starters ∪ backend rows with `usableByPlayer !== false` (`adminSafety.ts` 712–718; WX 2426–2440).  
CURRENT_LIFECYCLE: ACTIVE (both sets)  
RECOMMENDED_LIFECYCLE: ACTIVE. Six built-ins = LEGACY_SUPPORTED as canister seed, not obsolete.  
PLAYER_DATA_REFERENCES: Any of the six may be in `spellLevelKeys` if a player paid `upgradeSpell` on them  
SYSTEM_REFERENCES: `defaultSpells`; Admin Spell editor; Candid `SpellConfig`  
MIGRATION_REQUIRED: No deletion. Ownership split is SDA-2026-09-02-003 (do not implement here).  
RECOMMENDED_ACTION: Do not `remove` the six. Do not drop `spellData.ts` ids because backend seed “replaced” them. Graceful path: seed frontend starters onto the canister; hide unowned backend rows.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-09-02-003 / 007  
REGRESSION_RISK: HIGH if built-ins are deleted while Admin/Candid still round-trip them  
VALIDATION_REQUIRED: `adminDeleteSpellConfig("shadow_strike")` still `#err`; new character still has Strike + starters  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-004  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Clone spell pairs stay ACTIVE until a verb-split; do not retire-by-delete  
CATEGORY: spells  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: CDA-2026-09-02-005 documents Shield ≡ Iron Skin, Poison ≡ Venom, Expose ≈ Shadow Veil, Blood Mend ≈ Rallying Cry (`spellData.ts` starter-shield / spell-iron-skin / starter-poison / spell-venom-strike / …). Guardian summon kit lists both Shield and Iron Skin. All ids `usableByPlayer: true`.  
CURRENT_LIFECYCLE: ACTIVE (duplicate verbs)  
RECOMMENDED_LIFECYCLE: ACTIVE until human picks retire-one vs diverge. If one is later unpublished: NO_LONGER_ACQUIRABLE + LEGACY_SUPPORTED for owners — never SAFE_TO_REMOVE.  
PLAYER_DATA_REFERENCES: Either id may be in keys/bar  
SYSTEM_REFERENCES: `spellData.ts`; `ENEMY_KITS`; `BOSS_KITS`; summon kits  
MIGRATION_REQUIRED: Only if an id is unpublished — alias or owned-set carve-out. Do not use `usableByPlayer=false` as the only signal (SDA-001).  
RECOMMENDED_ACTION: Defer to CDA-2026-09-02-005. CRC forbids deleting `spell-iron-skin` (or any pair member) because a replacement exists.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-005; SDA lifecycle  
REGRESSION_RISK: MEDIUM — guardian kit currently needs both ids  
VALIDATION_REQUIRED: After any retire, owned id still casts; unowned cannot `upgradeSpell`; `validateBossKits()` still passes  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-005  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep summonAI aliases `kiter` / `kamikaze`  
CATEGORY: spells  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Canonical archetypes are `archer` / `bomber`. `inferSummonArchetype` maps `kiter→archer`, `kamikaze→bomber` (`enemyAI.ts` 205–207). `gameConstants.ts` 69 and AP/MP/HP tables still index both keys (41–77). Admin `SUMMON_AIS` set includes the aliases (`adminSafety.ts` 19–27).  
CURRENT_LIFECYCLE: LEGACY_SUPPORTED  
RECOMMENDED_LIFECYCLE: LEGACY_SUPPORTED  
PLAYER_DATA_REFERENCES: `SpellConfig.summonAI` on canister rows; not a Character field  
SYSTEM_REFERENCES: summon spawn; Admin summon writes; `adminGuard` unknown-AI reject  
MIGRATION_REQUIRED: No. Optional later rewrite of stored `"kiter"` → `"archer"` is cosmetic.  
RECOMMENDED_ACTION: Keep the alias branch. Do not delete table keys. New writes may prefer canonical names.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if aliases drop while an admin row still stores `kiter` (spawn would fail unknown AI)  
VALIDATION_REQUIRED: Catalog row `summonAI="kiter"` still maps to archer budgets; `"kamikaze"` still bomber  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-006  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Family catalog `ap` / `mp` are unused fields, not removable family ids  
CATEGORY: enemies  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Live families: `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror` (`spawnPolicy.ts` 49–57; `gameTypes.ts` 12–20). `FamilyStatMult.mp` / `ap` documented unused at spawn (64–66, AGENTS.md). Paper families `hex_chorister` / `glass_sniper` / `cinder_martyr` / `null_censor` have **zero** hits under `src/`.  
CURRENT_LIFECYCLE: Seven ids ACTIVE. Paper families = design-only (never shipped). Unused ap/mp = catalog fields, not ids.  
RECOMMENDED_LIFECYCLE: ACTIVE for the seven. Design-only names must not be deleted from docs as if they were persist keys.  
PLAYER_DATA_REFERENCES: Family is overlay on the combatant, not a Character stable. Unknown `pieceType` → `king.front` (`pieceArt.ts` 653–658).  
SYSTEM_REFERENCES: `spawnPolicy.ts`; WX generateEnemies; family pixel hooks  
MIGRATION_REQUIRED: No. Applying ap/mp at spawn is a spawn-policy change, not retirement.  
RECOMMENDED_ACTION: Do not remove family ids because overlay HP is overwritten at battle start (CDA-001). Do not add paper families to `FAMILY_TYPES` from this CRC run.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-001 (bind overlay); do not touch WX spawn this run  
REGRESSION_RISK: HIGH if a family id is removed while 30% overlay still rolls `FAMILY_TYPES`  
VALIDATION_REQUIRED: 30% overlay still only picks the seven; unknown pieceType paints king.front  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-007  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep admin EnemyConfig map even though world spawn ignores it  
CATEGORY: enemies  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `enemyConfigs` is a persistent map (`main.mo` 587) with `adminSet` / `adminDelete` / `getEnemyConfigs`. No default seed loop (unlike spells/achievements). `WorldExploration` never calls `getEnemyConfigs` (`adminVisualStatus.ts` 3–7). `adminDeleteEnemyConfig` is unconditional `remove` (798–802). Combat `EnemyConfig` in `types/common.mo` is a **different** type (damage/res/sp — AGENTS.md).  
CURRENT_LIFECYCLE: ACTIVE as admin catalog; unused as spawn table  
RECOMMENDED_LIFECYCLE: LEGACY_SUPPORTED (API + map). Not SAFE_TO_REMOVE — live canister may hold admin-authored rows and OQL `enemyConfigs`.  
PLAYER_DATA_REFERENCES: None on Character. Optional `spriteUrl` on the config row only.  
SYSTEM_REFERENCES: Admin dashboard; Candid; OQL expose (`main.mo` ~3603)  
MIGRATION_REQUIRED: No. Do not drop the map to “clean unused.” Wiring spawn is VAL/EBA, not CRC delete.  
RECOMMENDED_ACTION: Keep ids. Soft-retire a row by not spawning it (already the live behavior). Hard-delete only empty unused drafts after a dependency report (SDA-2026-09-02-004).  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-004 dependency graph; VAL sprite resolver  
REGRESSION_RISK: MEDIUM if Candid methods are removed while Admin still calls them  
VALIDATION_REQUIRED: `getEnemyConfigs` still returns []; Admin save still round-trips; world spawn still uses chess + family overlay  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-008  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Alias Boss Rush room 9 `weeping_pawn_2` — do not invent a second persist id  
CATEGORY: bosses  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `BOSS_RUSH_ROOMS[9].boss2Id = "weeping_pawn_2"` (`useBossRush.ts` 124–127). `BOSS_IDS` and `DEFAULT_BOSS_CONFIGS` have `weeping_pawn` only (`bossTypes.ts` 390–410; `bossDefaults.ts` 171). Admin copy: “Room 10 lists Weeping Pawn; live room 9 uses weeping_pawn_2” (`AdminDashboard.tsx` 7142–7145). Design doc `BOSS_AND_SPELL_DISCOVERY.md` names `second_lament` / deprecated alias. `spawnBossRushRoom` writes `pieceType: roomDef.boss2Name` (“Weeping Pawn”), not the id, onto the unit (WX 5348+). Persist is `currentRoom` index, not boss id (`bossRushProgress.ts`). Victory `boss_defeated_${bossId}` uses encounter `bossId` (`victoryAchievements.ts` 41–43).  
CURRENT_LIFECYCLE: Broken alias (id not in catalog)  
RECOMMENDED_LIFECYCLE: MIGRATION_REQUIRED → treat as `weeping_pawn` (or a future `second_lament` **alias of the same catalog row**). Do not add a second stable boss id “because Rush needs uniqueness.”  
PLAYER_DATA_REFERENCES: Rush progress is room index 0–9. Achievement condition strings may include `boss_defeated_weeping_pawn` if overworld used that id — not `_2`.  
SYSTEM_REFERENCES: `useBossRush.ts`; Admin Rush labels; `getBossConfig` lookup miss  
MIGRATION_REQUIRED: YES — code alias `weeping_pawn_2` → `weeping_pawn` (or documented `second_lament` synonym). No Motoko stable.  
RECOMMENDED_ACTION: Prefer graceful alias in the Rush table / lookup. Do not delete `weeping_pawn`. Do not persist `weeping_pawn_2` as a new BossConfig row without a human sheet.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: Design `second_lament` sheet; do not restack onto WX spawn this CRC PR  
REGRESSION_RISK: HIGH if room 9 lookup against `DEFAULT_BOSS_CONFIGS` is `undefined` and kits/stats fall through  
VALIDATION_REQUIRED: Room 9 still places two units; kit resolve uses weeping_pawn pools; `validateBossKits()` has no `weeping_pawn_2` requirement  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-009  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Frontend 19 bosses vs Motoko seed 12 — keep the extra seven  
CATEGORY: bosses  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Motoko `defaultBossConfigs` ends at `final_pawn` (12 rows, `admin.mo` 349–568). Frontend extras: `alabaster_fortress`, `chessboard_lich`, `mirror_sovereign`, `starved_vampire_pawn`, `pale_archivist`, `twin_monarchs`, `enthroned_void` (`bossTypes.ts` 390–410). Live play reads `pbv_boss_configs` / `DEFAULT_BOSS_CONFIGS` (`useBossQueries.ts`, WX 6486–6492). Rush rooms 3–9 reference the extras. Empty-only canister seed does not delete frontend ids.  
CURRENT_LIFECYCLE: ACTIVE on frontend catalog; Motoko seed incomplete  
RECOMMENDED_LIFECYCLE: ACTIVE (all 19). Motoko seed = LEGACY_SUPPORTED subset, not a license to drop frontend ids.  
PLAYER_DATA_REFERENCES: `pbv_boss_configs` localStorage may hold 19 rows. Canister `bossConfigs` map if admin saved.  
SYSTEM_REFERENCES: `bossKits.ts`; Boss Guide; Rush table; portal `bossPortalId`  
MIGRATION_REQUIRED: Optional seed-align of the seven onto canister — additive, never delete the 12.  
RECOMMENDED_ACTION: Do not remove extras because Motoko lacks them. Do not remove Motoko 12 because frontend kits superseded phase spell strings.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: EBA admin re-audit; CRC-008; CRC-010  
REGRESSION_RISK: HIGH if extras are dropped from `BOSS_IDS` while Rush still names them  
VALIDATION_REQUIRED: Boss Guide still lists 19; Rush rooms 3–9 still resolve names; `validateBossKits()` covers all `BOSS_IDS`  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-010  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Motoko boss phase pools still name purged spell ids — keep boss rows  
CATEGORY: bosses  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Example: Pale Archbishop phase1 `["fireball", "cursed_gust", "entangle"]` (`admin.mo` 357–361); Crimson Countess phase2 includes `blood_nova` (378–379); Void Grandmaster phase2 `obliterate` (396–397); Bone Cavalier `ice_shard` / `frost_nova` (411–415). Those strings are in `OLD_SPELL_IDS`. Live kits are `bossKits.ts` against `spellData.ts`.  
CURRENT_LIFECYCLE: Boss ids ACTIVE; Motoko pool strings DEPRECATED  
RECOMMENDED_LIFECYCLE: Boss ids ACTIVE. Pool strings LEGACY_SUPPORTED until rewritten to `spell-*` / starter ids.  
PLAYER_DATA_REFERENCES: None for pool strings. Boss `defeated` flag is on config, not per-player (per-player rush is room index).  
SYSTEM_REFERENCES: `defaultBossConfigs`; live `bossKits.ts`  
MIGRATION_REQUIRED: Content rewrite of Motoko arrays (no stable shape change if still `[Text]`). Not a player-data migration.  
RECOMMENDED_ACTION: Rewrite pool ids to live catalog; do not delete boss ids because pools are stale. Do not re-seed purged spells just to satisfy Motoko strings.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CRC-002; live `bossKits.ts` is source of truth for combat  
REGRESSION_RISK: LOW for combat (frontend kits win today); MEDIUM if something starts hydrating Motoko pools into battle  
VALIDATION_REQUIRED: `validateBossKits()` still passes; Admin boss editor does not show `fireball` as a live player spell  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-011  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep all 15 seeded achievement ids; soft-retire only  
CATEGORY: achievements  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `defaultAchievements` 15 rows all `active = true` (`admin.mo` 308–326). Ids: `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`. Progress key is principal+id. Delete-with-progress sets `active=false` (`main.mo` 2398–2405); claim of retired id `#err("Achievement is retired")` (2473). Wallet/level conditions `doka_1000` / `doka_10000` / `level_10` defer until `applyRewards` (`shouldDeferAchievementUnlockUntilRewardsPersist`).  
CURRENT_LIFECYCLE: ACTIVE  
RECOMMENDED_LIFECYCLE: ACTIVE. If unpublished: NO_LONGER_ACQUIRABLE + keep progress rows. Never SAFE_TO_REMOVE of an id with any progress.  
PLAYER_DATA_REFERENCES: `achievementProgress` map; claimed flags. Ban must not wipe claimed (`shouldWipeAchievementsOnBan` false).  
SYSTEM_REFERENCES: WX `checkAndFireAchievement`; `victoryAchievements.ts`; Feats panel  
MIGRATION_REQUIRED: No for keep. Condition string ≠ id (`doka_hoarder` vs `doka_1000`) — do not rename either without alias.  
RECOMMENDED_ACTION: Prefer `active=false`. Do not delete because a “better” feat exists. Claim still pays **current** `dokaReward` — freeze reward on retire if economics change (SDA).  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA achievement retire graph  
REGRESSION_RISK: HIGH if id rename breaks `principal#id` keys  
VALIDATION_REQUIRED: Unlock + claim still works for each seeded id; `active=false` hides from new unlocks but preserves the row  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-012  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Battle challenges stay session-only; ids are not persist keys  
CATEGORY: challenges  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `DEFAULT_CHALLENGES` ids `easy_1`…`legendary_3` (`challengeCompletion.ts` 44–109). Rewards go through `applyRewards` via recap. No canister challenge history (DATA_EVOLUTION: do not persist onto required Character fields). Badges Untouchable / Blitz / Striker are reward chrome, not achievement ids.  
CURRENT_LIFECYCLE: ACTIVE  
RECOMMENDED_LIFECYCLE: ACTIVE. Removing a challenge id does not need player migration, but still is a live UX change — not SAFE_TO_REMOVE from a content-ops view without a replacement roll.  
PLAYER_DATA_REFERENCES: None on canister. Panel layout `pbv_panel_layout_challenge_*` is chrome.  
SYSTEM_REFERENCES: `ChallengePanel`; WX random pick (`12211–12212`); `challengeRewards.ts`  
MIGRATION_REQUIRED: No  
RECOMMENDED_ACTION: Do not persist challenges onto Character to “retire” them. Do not drop Untouchable (`legendary_1`) — it is live economy (500 Doka / 1000 XP).  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if `legendary_1` is removed while HUD still advertises Untouchable  
VALIDATION_REQUIRED: All nine conditions still evaluated by `isChallengeCompleted`; recap still credits via `applyRewards`  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-013  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Custom sprite URLs may be dropped as assets; keep pieceType / pixelPattern  
CATEGORY: visuals  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Combat is chess-piece pixels. `getPersistedPiecePattern` unknown id → `king.front` (`pieceArt.ts` 653–658). `adminDeletePlayerSpriteConfig` removes catalog only (main.mo 854–860). `spriteUrl` / facing URLs “stored, not rendered” (`adminVisualStatus.ts` 1–22). Character `pixelPattern` is persist JSON.  
CURRENT_LIFECYCLE: Pixel fallback ACTIVE. URL fields LEGACY_SUPPORTED unused-in-combat.  
RECOMMENDED_LIFECYCLE: Pixel fallback ACTIVE. URLs may be SAFE_TO_REMOVE **as hosted files** if unused, provided no resolver ships (VAL). Persist string fields stay optional — never make URL required.  
PLAYER_DATA_REFERENCES: `Character.pieceType`, `pixelPattern`; optional playerSpriteConfigs map  
SYSTEM_REFERENCES: portrait/RAF draw; Admin visual tab  
MIGRATION_REQUIRED: No for URL delete. Do not null `pieceType`.  
RECOMMENDED_ACTION: Default pixel fallback remains. Do not delete `pieceType` enums because custom art exists. VAL resolver is additive.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: VAL-001/011 (open design PRs — do not hitchhike)  
REGRESSION_RISK: LOW for URL blob delete; HIGH if `pieceType` strings are renamed without `getCreaturePattern` fallback  
VALIDATION_REQUIRED: Delete sprite config → character still draws; empty URL → default pixel copy; unknown pieceType → king.front (no throw)  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-014  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep map-modifier aliases `lava_fields` / `ice_fields` / `spike_pit`  
CATEGORY: admin configuration  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Admin `LEGACY_MODIFIER_TYPES` labels them “legacy id (no engine hook)” (`AdminDashboard.tsx` 4943–4951) **but** WX still maps them to hazards: `spike_pit`→spikes, `ice_fields`→ice, `lava_fields`→lava (`WorldExploration.tsx` 6696–6709). Engine registry ids are `frozen_terrain` / `thorned_ground` / `plague_zone` / `void_rift` (`mapModifiers.ts` 152–194). Canister seed is only `slime_flood` + `paper_windstorm` (`admin.mo` 136–154). Live canister may already store the legacy `modifierType` strings.  
CURRENT_LIFECYCLE: LEGACY_SUPPORTED (hazard alias); incomplete as registry hooks  
RECOMMENDED_LIFECYCLE: LEGACY_SUPPORTED. Prefer mapping to `frozen_terrain` / spikes / lava **in lookup**, not deleting rows.  
PLAYER_DATA_REFERENCES: `mapModifierConfigs` rows if admin saved those types  
SYSTEM_REFERENCES: Admin editor; WX portal hazard seed; `MAP_MODIFIERS` registry  
MIGRATION_REQUIRED: Optional rewrite of stored `modifierType` to canonical ids. Keep alias branch until then.  
RECOMMENDED_ACTION: Do not remove Admin options or WX alias arms. Do not treat “no engine hook” copy as permission to delete.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Do not restack onto AdminDashboard / WX in this docs PR.  
REGRESSION_RISK: HIGH if alias arms drop while a live row still triggers `lava_fields`  
VALIDATION_REQUIRED: A config with `modifierType=lava_fields` still places lava; `frozen_terrain` still doubles MP  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-015  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Empty-hook modifiers (`gravity_well`, `fog_of_war`, `mirror_field`) are incomplete, not obsolete  
CATEGORY: world content  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Registry entries exist with placeholder hooks (`mapModifiers.ts` 271–296). WX binds `_isGravityWell` / `_isFogOfWar` (2324–2326) — unused locals. Announce still fires via registry names. They are in `EXISTING_MAP_MODIFIER_IDS` (`worldFeatures.ts` 1890–1913).  
CURRENT_LIFECYCLE: ACTIVE id, unimplemented mechanics  
RECOMMENDED_LIFECYCLE: ACTIVE (keep id). Not DEPRECATED. Not SAFE_TO_REMOVE.  
PLAYER_DATA_REFERENCES: Possible admin `mapModifierConfigs` rows  
SYSTEM_REFERENCES: `MAP_MODIFIERS`; WX flags; world-feature catalog comments  
MIGRATION_REQUIRED: No  
RECOMMENDED_ACTION: Keep ids for future hooks. Do not delete because `_isGravityWell` is unused. Do not add mechanics from this CRC run.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: Map-modifier implementer (not CRC)  
REGRESSION_RISK: MEDIUM if id removed while Admin can still save it (orphan announce / no-op)  
VALIDATION_REQUIRED: Rolling the id still announces; combat does not throw  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-016  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: `WF-*` world-feature catalog is unpublished — keep the module, do not spawn-delete live hazards  
CATEGORY: world content  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `WORLD_FEATURES` ids `WF-HAZ-EMBER_VEIN` … wave 3 (`worldFeatures.ts` 163+). Importers: `worldFeatures.test.ts` only — not `WorldExploration.tsx`. Live hazards remain lava/ice/spikes + 22 map modifiers.  
CURRENT_LIFECYCLE: Design catalog (not player-facing)  
RECOMMENDED_LIFECYCLE: Keep as design. Not SAFE_TO_REMOVE of production content because it was never persist. Deleting the TS catalog would only drop tests/docs.  
PLAYER_DATA_REFERENCES: None  
SYSTEM_REFERENCES: `docs/WORLD_DYNAMICS.md`; tests  
MIGRATION_REQUIRED: No  
RECOMMENDED_ACTION: Do not delete lava/ice/spikes or `MAP_MODIFIERS` to “replace” with WF ids. Do not wire WF from this CRC run.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: WDEAD / WDD tickets  
REGRESSION_RISK: LOW for catalog delete; HIGH if live hazard types are removed as a “cleanup”  
VALIDATION_REQUIRED: WX still rolls lava/ice/spikes; `worldFeatures.test.ts` still compiles if the module stays  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-017  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: `FSN-*` formations are design-only; live spawn stays quadrant scatter  
CATEGORY: formations  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Zero `FSN-` hits under `src/`. Formation docs in `docs/design/ENEMY_FORMATIONS_*.md`. Live placement: Chebyshev ≥ 4 then battle-start scatter (CDA-2026-09-02-004).  
CURRENT_LIFECYCLE: Unpublished design ids  
RECOMMENDED_LIFECYCLE: Keep docs. Do not delete chess pieceTypes or family ids to “make room” for formations.  
PLAYER_DATA_REFERENCES: None  
SYSTEM_REFERENCES: `generateEnemies`; battle-start placement  
MIGRATION_REQUIRED: No  
RECOMMENDED_ACTION: Prefer wiring a named formation later (CDA-004). CRC: never treat design ids as orphan production rows.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-004  
REGRESSION_RISK: HIGH if spawn spacing constants are removed as “unused formation leftovers”  
VALIDATION_REQUIRED: Packs still place with Chebyshev ≥ 4; solvability flood-fill unchanged  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-018  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Encounter evolution sheets stay design-only  
CATEGORY: encounters  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `docs/encounters/ENCOUNTER_EVOLUTION_*.md` status PROPOSED. Live encounters are overworld packs + dungeon chain + 10 Rush rooms. No `ENCOUNTER_ID` persist on Character.  
CURRENT_LIFECYCLE: Unpublished  
RECOMMENDED_LIFECYCLE: Keep docs. Live Rush/dungeon ids stay ACTIVE.  
PLAYER_DATA_REFERENCES: Dungeon `currentMap` / depth; Rush `currentRoom`  
SYSTEM_REFERENCES: `portalRules.ts`; `useBossRush.ts`; WX generateEnemies  
MIGRATION_REQUIRED: No  
RECOMMENDED_ACTION: Do not delete Rush rooms or dungeon chain because a sheet proposed a replacement room. Do not implement EED rooms from CRC.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: EED catalogs (docs only)  
REGRESSION_RISK: HIGH if `BOSS_RUSH_ROOMS` length changes without `BOSS_RUSH_ROOM_COUNT` / persist compatibility  
VALIDATION_REQUIRED: Ten Rush rooms still index 0–9; `completeBossRushRoom` contract unchanged  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-019  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Shop `pkg_*` rows are NO_LONGER_ACQUIRABLE — keep the map  
CATEGORY: admin configuration  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `defaultShopPackages` still seeds `pkg_10` … `pkg_1_6m` (`admin.mo` 265–283). Player Buy Doka is GameKey (`DokaGameKeyShop`; Admin “Multi-tier Doka packages are retired” 6932–6934). `initiatePurchase` always `#err` (main.mo 1152–1169). `purchaseRecords.packageId` is persist. `getShopPackages` / admin CRUD remain.  
CURRENT_LIFECYCLE: NO_LONGER_ACQUIRABLE (player UI) + LEGACY_SUPPORTED (canister map + history)  
RECOMMENDED_LIFECYCLE: NO_LONGER_ACQUIRABLE. Not SAFE_TO_REMOVE.  
PLAYER_DATA_REFERENCES: `purchaseRecords` (KYC + `packageId` + status); possibly pending rows never auto-completed (`processPendingPurchases` returns 0, 1338–1348)  
SYSTEM_REFERENCES: Candid shop APIs; `useShopQueries.ts` (zero TSX callers); Admin shop tab  
MIGRATION_REQUIRED: No deletion. Optional hide in Admin. Never drop `packageId` from historical rows.  
RECOMMENDED_ACTION: Keep seed/map. Do not mint from packages. GameKey is the live credit path.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: GameKey shop (live); do not productize `initiatePurchase`  
REGRESSION_RISK: HIGH if `shopPackages` map is removed while OQL / Admin still list packages; MEDIUM if pending KYC rows are deleted (audit)  
VALIDATION_REQUIRED: `initiatePurchase` still `#err` with GameKey copy; `redeemGameKey` still credits; `getShopPackages` still returns the seed on empty-only canisters  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-020  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep Candid stubs `initiatePurchase`, `processPendingPurchases`, `calculateAndAwardDoka`  
CATEGORY: admin configuration  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: All three are documented no-ops / always-err (`main.mo` 1152–1169, 1338–1348, 3073–3076). Official credits: `applyRewards`, `redeemGameKey`, `upgradeSpell`, `claimAchievementReward`. Bindgen + mocks still expose them. WX remount still calls the shop no-op (`shouldCommitShopCredit`).  
CURRENT_LIFECYCLE: LEGACY_SUPPORTED  
RECOMMENDED_LIFECYCLE: LEGACY_SUPPORTED. Removing Candid methods is a breaking client change, not content cleanup.  
PLAYER_DATA_REFERENCES: None minted. Pending `purchaseRecords` remain.  
SYSTEM_REFERENCES: `backend.ts`; mocks; `shopPurchase.ts`; progress persist comments  
MIGRATION_REQUIRED: No. Do not delete methods to “retire IAP.”  
RECOMMENDED_ACTION: Keep signatures. Do not call `calculateAndAwardDoka` from the official funnel (AGENTS.md).  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if methods disappear while old clients still call them (decode/trap vs `#err`)  
VALIDATION_REQUIRED: Old nine-arg purchase still gets `#err` (no mint); `processPendingPurchases` returns 0; `calculateAndAwardDoka` returns 0  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-021  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Alias BuffShop `greater_health_potion` with canister `greater_potion`  
CATEGORY: admin configuration  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Canister `BUFF_CATALOG` uses `greater_potion` (`main.mo` 2772–2778). BuffShop / `itemShop.ts` use `greater_health_potion` (`BuffShop.tsx` 14–40). Live consume path is `${principal}_inventory` (AGENTS.md), not `getBuffInventory`. Other ids (`health_potion`, `battle_elixir`, `swift_boots`, `shield_charm`, `fury_potion`) match **names** but costs differ (canister elixir 200 vs shop 80).  
CURRENT_LIFECYCLE: Dual catalogs; frontend ACTIVE; canister map LEGACY_SUPPORTED unused by BuffShop  
RECOMMENDED_LIFECYCLE: MIGRATION_REQUIRED for the greater-potion **string**. Keep both keys as aliases until localStorage inventories are rewritten.  
PLAYER_DATA_REFERENCES: `${principal}_inventory` JSON keys; canister `buffInventories` if anything called `buyBuff`  
SYSTEM_REFERENCES: BuffShop; `tryConsumeBuffItem`; `getBuffCatalog`  
MIGRATION_REQUIRED: YES — alias table in consume/purchase helpers. Do not delete either string.  
RECOMMENDED_ACTION: Accept both ids in consume. Do not wipe `_inventory` keys. Do not switch BuffShop to canister as the only store without a persist-lock design (SDEG-005).  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDEG buffInventories vs localStorage  
REGRESSION_RISK: HIGH if `greater_health_potion` is renamed in place and stacks become unconsumable  
VALIDATION_REQUIRED: Stacks under either key still heal; `tryConsumeBuffItem` cannot double-spend  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-022  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: No production telemetry fields to retire; do not recycle KYC/GameKey PII as metrics  
CATEGORY: telemetry fields  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: No `recordTelemetryIncrements` / sidecar in `src/`. `longHorizonSim.telemetry.available === false`. WX “caller-side telemetry” is a comment. `PurchaseRecord` still has name/email/address/postal/proof URL (`types/admin.mo` 200–217). `GameKeyRequest.email` is persist. GTAD: Intelligence must never join these.  
CURRENT_LIFECYCLE: Telemetry counters = not shipped. KYC/email fields = LEGACY_SUPPORTED persist (fulfillment).  
RECOMMENDED_LIFECYCLE: Keep PII fields until a dedicated redaction migration. Do not mark them SAFE_TO_REMOVE because “telemetry does not need them.”  
PLAYER_DATA_REFERENCES: `purchaseRecords`; `gameKeyRequests`  
SYSTEM_REFERENCES: OQL expose; Admin GameKey inbox; GTAD docs  
MIGRATION_REQUIRED: Only for PII redaction (human + legal), not CRC content delete.  
RECOMMENDED_ACTION: Do not add Intelligence entities with owner columns. Do not delete KYC columns to “clean telemetry.” Debug ring (`debugLogger.ts`) stays — not production telemetry.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: GTAD-2026-09-01/02 (still unimplemented); AQA-012  
REGRESSION_RISK: HIGH if OQL stops exposing fields Admin fulfillment still reads; HIGH if email is copied into a metrics map  
VALIDATION_REQUIRED: GameKey approve/redeem still works; `longHorizonSim` still reports telemetry unavailable  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-023  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: CharacterStats wp/wr/scp stay MIGRATED off persist — do not resurrect  
CATEGORY: admin configuration  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Live `CharacterStats` is 12 fields including `killCount`, no wp/wr/scp (`main.mo` 147–160; AGENTS.md). Root `declarations/backend/` is a stale 14-field snapshot (DEAD_CODE audit). `backend_extended/` is the 15-field leftover actor.  
CURRENT_LIFECYCLE: MIGRATED (12-field live). Stale bindgen / extended actor = LEGACY_SUPPORTED reference.  
RECOMMENDED_LIFECYCLE: MIGRATED. Do not delete `killCount`. Do not re-add wp/wr/scp. Do not delete `backend_extended/` (upgrade/compat reference).  
PLAYER_DATA_REFERENCES: Live characters are 12-field. A lagging 15-field actor still rejects 12-field saves (deploy lag).  
SYSTEM_REFERENCES: bindgen `src/frontend/src/backend.ts`; `.old` / snapshots  
MIGRATION_REQUIRED: Already done on source. Deploy lag is ops, not CRC delete.  
RECOMMENDED_ACTION: Keep 12-field contract. Do not “clean” killCount. Do not blank `.old`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: EOP rules; never edit shipped NewActor  
REGRESSION_RISK: CRITICAL if 12-field type is “simplified” further; CRITICAL if `.old` is blanked  
VALIDATION_REQUIRED: Character create/update still sends all 12; `pnpm typecheck`; `mops check` vs `.old`  
STATUS: NEW  

---

ACTION_ID: CRC-2026-09-27-024  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep SpellConfig legacy `range` field  
CATEGORY: spells  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `range : Nat; // legacy range field (kept for backwards compat)` (`types/admin.mo` 104). Live targeting uses `minRange` / `maxRange`. Default spells still populate `range` (`admin.mo` 172+).  
CURRENT_LIFECYCLE: LEGACY_SUPPORTED  
RECOMMENDED_LIFECYCLE: LEGACY_SUPPORTED. Not SAFE_TO_REMOVE (Candid + persist SpellConfig).  
PLAYER_DATA_REFERENCES: Every `spellConfigs` row  
SYSTEM_REFERENCES: Admin editor; bindgen SpellConfig  
MIGRATION_REQUIRED: Dropping `range` is a Candid break + check-stable concern — **forbidden** as a drive-by.  
RECOMMENDED_ACTION: Keep writing both `range` and min/max. Prefer min/max in new logic.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if field dropped from Motoko type while live `spellConfigs` still store it  
VALIDATION_REQUIRED: `adminSetSpellConfig` still accepts current bindgen shape; `mops check`  
STATUS: NEW  

---

## Index (lifecycle)

| ID | Item | Recommended |
| :--- | :--- | :--- |
| 001 | `physical_attack` on obsolete lists | ACTIVE (fix lists) |
| 002 | Other `OLD_SPELL_IDS` | LEGACY_SUPPORTED + MIGRATION_REQUIRED |
| 003 | Six built-in backend spells | ACTIVE / LEGACY_SUPPORTED seed |
| 004 | Clone spell pairs | ACTIVE (no delete) |
| 005 | `kiter` / `kamikaze` | LEGACY_SUPPORTED |
| 006 | Seven families; unused ap/mp | ACTIVE |
| 007 | Admin `enemyConfigs` | LEGACY_SUPPORTED |
| 008 | `weeping_pawn_2` | MIGRATION_REQUIRED alias |
| 009 | 19 vs 12 bosses | ACTIVE (keep extras) |
| 010 | Motoko boss pool strings | Rewrite strings; keep boss ids |
| 011 | 15 achievements | ACTIVE; soft-retire only |
| 012 | 9 challenges | ACTIVE |
| 013 | Sprite URLs vs pixels | Pixels ACTIVE; URLs optional |
| 014 | `lava_fields` et al. | LEGACY_SUPPORTED |
| 015 | Empty-hook modifiers | ACTIVE ids |
| 016 | `WF-*` | Design-only keep |
| 017 | `FSN-*` | Design-only keep |
| 018 | Encounter sheets | Design-only keep |
| 019 | `pkg_*` shop | NO_LONGER_ACQUIRABLE |
| 020 | IAP Candid stubs | LEGACY_SUPPORTED |
| 021 | Greater potion ids | MIGRATION_REQUIRED alias |
| 022 | Telemetry / KYC | No counters to drop; PII stay |
| 023 | wp/wr/scp | MIGRATED |
| 024 | SpellConfig `range` | LEGACY_SUPPORTED |

**SAFE_TO_REMOVE persistent IDs this run: none.**

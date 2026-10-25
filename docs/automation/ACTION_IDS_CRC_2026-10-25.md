# ACTION_IDs — Content Retirement & Compatibility Manager 2026-10-25

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Content Retirement & Compatibility Manager.  
Audit: [`CONTENT_RETIREMENT_2026-10-25.md`](./CONTENT_RETIREMENT_2026-10-25.md).  
HEAD: `0f5363f`. Gameplay / production catalogs were **not** modified this run.

Do not twin SDA / CDA / SDEG / EBA / DCA ids. CRC is deletion-safety and graceful retirement only. Zero persistent ids are SAFE_TO_REMOVE.

Do not implement combat or EOP schema from this file unless a later human or orchestrator picks an ID.

---

ACTION_ID: CRC-2026-10-25-001  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Stop purging and tombstoning live starter physical_attack (Strike)  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `physical_attack` is the live Strike starter (`src/frontend/src/data/spellData.ts` 9–25, also `starterSpells` 27–28). It is still listed in `OLD_SPELL_IDS` (`src/backend/main.mo` 689–697), which `spellConfigs.remove`s the id on every canister start/upgrade. The same id is in `OLD_SPELL_NAMES_SET` (`WorldExploration.tsx` 2356–2389), so `filteredBackendSpells` and the empty-backend starter fallback (`2688–2694`) drop Strike from `normalizedSpellPool`. `buildEnemyKit` still returns `physical_attack` for pawn/knight/rook (`enemyAI.ts` 163–174); summon hunter kits and Attack Nearest look up that id (`10142`, `10834`). `upgradeSpell` requires `spellConfigs.get` (`main.mo` 1008–1012) → "Spell not found" for Strike. `defaultSpells()` (`admin.mo` 168–191) does not seed it; comments at 161–167 still claim Physical Attack was removed.  
CURRENT_LIFECYCLE: ACTIVE (frontend innate) incorrectly treated as obsolete by purge + tombstone  
RECOMMENDED_LIFECYCLE: ACTIVE  
PLAYER_DATA_REFERENCES: Possible `spellLevelKeys` / `spellBarOrder` entries on older slots; `_characterHasSpell` walks both (`main.mo` 253–270). Create path does not seed keys (`_starterCharacter`). Innate ownership is frontend `baseSpells` (`WorldExploration.tsx` 2397–2404).  
SYSTEM_REFERENCES: `ENEMY_KITS`, `SUMMON_KIT`, `bossKits.ts` SPELL_ID_CATALOG and several phase pools, AdminLib `defaultBossConfigs()` phase arrays, Attack Nearest.  
MIGRATION_REQUIRED: YES — remove the id from `OLD_SPELL_IDS` and from `OLD_SPELL_NAMES_SET`. Optionally seed Strike into `defaultSpells()` so paid upgrades resolve. Do not rename to a new id. Do not delete character array rows.  
RECOMMENDED_ACTION: Treat Strike as live content. Drop it from the obsolete lists only. Keep the persistent id `physical_attack`. Human-approve; this run does not edit those files.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-002 (`buildEnemyKit` still receives `currentMap.levelZone` object at `WorldExploration.tsx` 11920 — band NaN is a separate kit bug). Do not twin that CDA id.  
REGRESSION_RISK: HIGH if the id is deleted from starters or kits instead of being removed from the purge list. LOW if only the obsolete lists are corrected.  
VALIDATION_REQUIRED: After the list fix, `normalizedSpellPool` contains `physical_attack` even when backend built-ins are present; pawn band-0 kit resolves Strike; `upgradeSpell("physical_attack")` finds a catalog row if seeded; `mops check` / `pnpm check` unchanged otherwise.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-002  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Stop tombstoning live Inferno and Frost Nova by display name  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Live starters `spell-inferno` name "Inferno" and `spell-frost-nova` name "Frost Nova" (`spellData.ts` 502–526). `OLD_SPELL_NAMES_SET` includes both display names and the purged ids `inferno` / `frost_nova` (`WorldExploration.tsx` 2366–2381). Filter is id-or-name (`WorldExploration.tsx` 2390–2393). Queen/king kits request `spell-inferno` at zone ≥ 2 (`enemyAI.ts` 176–184); bomber summon kit is `["spell-inferno"]` (145). Purged ids remain correctly obsolete; the **names** collide with live replacements. No other live starter names match the remaining tombstone labels (Strike ≠ "Physical Attack", Blood Mend ≠ "Heal", Poison Arrow ≠ "Poison Dart").  
CURRENT_LIFECYCLE: ACTIVE live ids; DEPRECATED purged ids; tombstone incorrectly hides the live names  
RECOMMENDED_LIFECYCLE: ACTIVE for `spell-inferno` / `spell-frost-nova`; NO_LONGER_ACQUIRABLE for `inferno` / `frost_nova` ids  
PLAYER_DATA_REFERENCES: Legacy keys may still hold `inferno` / `frost_nova`. Live characters own `spell-inferno` / `spell-frost-nova` via starters ∪ catalog.  
SYSTEM_REFERENCES: Enemy/boss/summon kits use the live hyphenated ids, not the purged ones.  
MIGRATION_REQUIRED: YES — remove display names "Inferno" and "Frost Nova" from `OLD_SPELL_NAMES_SET`. Keep purged ids in the set. No alias table; do not rewrite character keys in this slice.  
RECOMMENDED_ACTION: Name-filter only the obsolete labels that no longer exist on live starters. Do not delete `spell-inferno` / `spell-frost-nova`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CRC-2026-10-25-001 (same tombstone set). CDA-2026-09-02-002 for zone band.  
REGRESSION_RISK: MEDIUM if purged ids are also dropped from the set (admin could re-seed old ids into the enemy pool). LOW if only the two display names are removed.  
VALIDATION_REQUIRED: `filteredBackendSpells` keeps rows named Inferno/Frost Nova whose id is `spell-*`; still drops id `inferno` / `frost_nova`. Queen kit can resolve `spell-inferno` from the pool.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-003  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep remaining OLD_SPELL_IDS as legacy character keys; do not remap or wipe  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Sixteen ids in `OLD_SPELL_IDS` (`main.mo` 689–694). Aside from `physical_attack` (001), none are live starter ids. Replacements where they exist use new ids (`heal` → `starter-heal`, `drain_life` ≈ `starter-drain`) with **no** alias table. `_spellReferencedByPlayers` still treats keys/bar as ownership. `upgradeSpell` on a purged id is "Spell not found". `SpellbookModal.tsx` 46–47 still maps cosmetic colors for `obliterate` / `plague_wave` as effectType keys (not catalog ids). AdminLib boss seeds still list many of these ids (005).  
CURRENT_LIFECYCLE: NO_LONGER_ACQUIRABLE in catalog (hard-removed every upgrade)  
RECOMMENDED_LIFECYCLE: LEGACY_SUPPORTED on character arrays; NO_LONGER_ACQUIRABLE for new grants  
PLAYER_DATA_REFERENCES: `spellLevelKeys` / `spellBarOrder` may still hold any of the 16 strings on pre-purge slots.  
SYSTEM_REFERENCES: Motoko `defaultBossConfigs()` phase `spellPoolIds`; SpellbookModal color map keys.  
MIGRATION_REQUIRED: NO for leaving arrays intact. YES before any key rewrite (alias table + writeGeneration — SDEG, not this CRC card).  
RECOMMENDED_ACTION: Leave the 15 non-Strike purge ids in `OLD_SPELL_IDS` so they cannot re-enter `spellConfigs`. Do not strip them from characters. Do not add a silent remap. Cosmetic SpellbookModal keys are not persistent ids.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CRC-2026-10-25-001 must carve Strike out first. SDA-2026-09-02-001 lifecycle enum is a separate retire-path redesign — do not twin.  
REGRESSION_RISK: CRITICAL if character arrays are wiped or ids are rewritten without aliases (`upgradeSpell` / bar restore / `_spellReferencedByPlayers` lie).  
VALIDATION_REQUIRED: A fixture character with `spellLevelKeys: ["fireball"]` still loads; UI may hide the name; canister does not trap. `spellConfigs.get("fireball")` stays null after upgrade.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-004  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Alias or catalog Boss Rush room-9 weeping_pawn_2; do not delete the slot  
CATEGORY: bosses  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `BOSS_RUSH_ROOMS[9].boss2Id` is `"weeping_pawn_2"` (`useBossRush.ts` 125–133). `BOSS_IDS` has `weeping_pawn` only (`bossTypes.ts` 390–410). `DEFAULT_BOSS_CONFIGS` / `BOSS_KITS` / `useBossAI` have no twin. Room 0 already uses catalogued `weeping_pawn` (28). Admin honesty copy (`AdminDashboard.tsx` 7142–7145). Design remap `second_lament` is still spec-only (`docs/design/BOSS_AND_SPELL_DISCOVERY.md` 22, 1255) — not a live BossId. Rush spawn uses placeholder units `boss-rush-*` (`WorldExploration.tsx` ~5323–5371), so the string is a label today, not an AI key.  
CURRENT_LIFECYCLE: Orphan system label (not in catalog)  
RECOMMENDED_LIFECYCLE: MIGRATION_REQUIRED — alias to a real BossId **or** add a full catalog twin. Not SAFE_TO_REMOVE.  
PLAYER_DATA_REFERENCES: Boss Rush persist is `principal#slot` room index (`currentRoom` 0–9), not this string. Changing the label does not rewrite canister rush progress.  
SYSTEM_REFERENCES: `BOSS_RUSH_ROOMS`, Admin Rush tab labels, design Wave-3 `second_lament`.  
MIGRATION_REQUIRED: YES before any AI/kit wiring that looks up `boss2Id` against `BOSS_IDS`.  
RECOMMENDED_ACTION: Do not empty room 9. Do not spawn a second live `weeping_pawn` just to reuse the name. Prefer an explicit alias map (`weeping_pawn_2` → chosen catalog id) until `second_lament` kits ship. Do not mint Wave-3 ids in the same PR as a string-only alias unless kits exist.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: EBA / boss-system design cards for `second_lament`. Do not twin those implementer contracts.  
REGRESSION_RISK: HIGH if the room slot is deleted (jackpot room index 9). MEDIUM if remapped before AI looks up the id.  
VALIDATION_REQUIRED: Room index 9 still exists; persist `completeBossRushRoom` still accepts `currentRoom` / `currentRoom-1`; lookup of `boss2Id` never throws; if aliased, kits/AI resolve.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-005  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep AdminLib defaultBossConfigs spell pools; do not blank superseded purged ids  
CATEGORY: bosses  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `defaultBossConfigs()` (`admin.mo` 349–568) still lists `fireball`, `cursed_gust`, `entangle`, `mist_form`, `physical_attack`, `blood_nova`, `ice_shard`, `frost_nova`, `poison_dart`, `plague_wave`, `inferno`, `obliterate`, `meteor_strike`, `drain_life` on phase pools. Those texts are in `OLD_SPELL_IDS` and are removed from `spellConfigs` every upgrade. Live portal combat resolves kits via frontend `BOSS_KITS` / `starterSpells` (`WorldExploration.tsx` ~15814). Canister seed still writes these strings into `bossConfigs` on empty store.  
CURRENT_LIFECYCLE: SUPERSEDED seed content (frontend kits are source of truth for combat)  
RECOMMENDED_LIFECYCLE: LEGACY_SUPPORTED / SUPERSEDED_KEEP until a deliberate canister rewrite  
PLAYER_DATA_REFERENCES: `bossConfigs` map on canister (admin). Not character spell arrays.  
SYSTEM_REFERENCES: Admin boss editor, `getBossConfigs`, empty-canister seed.  
MIGRATION_REQUIRED: YES to replace pools with live kit ids (must not add unknown required stables). NO to leave as-is.  
RECOMMENDED_ACTION: Do not `remove` boss rows or blank `spellPoolIds` as a “cleanup.” A later admin-seed rewrite should copy frontend `getBossPhase*SpellIds`, including Strike if 001 seeds it.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CRC-2026-10-25-001 (Strike). CRC-2026-10-25-019 (seven missing boss rows).  
REGRESSION_RISK: HIGH if canister boss rows are deleted while `bossPortalAssignments` still names those ids (`main.mo` 3022–3031 requires a `bossConfigs` row).  
VALIDATION_REQUIRED: Fresh canister still seeds 12 bosses; portal assign for `pale_archbishop` still finds a row; live WX portal fight still uses frontend kits.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-006  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep lava_fields / ice_fields / spike_pit as wired legacy hazard aliases  
CATEGORY: world content  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Admin dropdown labels them “legacy id (no engine hook)” (`AdminDashboard.tsx` 4943–4950). That copy is false: `WorldExploration.tsx` 6696–6709 maps `spike_pit`/`blood_moon`/`thorned_ground` → spikes, `ice_fields`/`frozen_terrain` → ice, `lava_fields`/`plague_zone`/`void_rift` → lava. They are intentionally absent from `MAP_MODIFIERS` / `listAdminModifierTypeOptions` (`mapModifiers.test.ts` 16–17) so the live registry is 22 ids (`worldFeatures.ts` `EXISTING_MAP_MODIFIER_IDS` 1890–1913). Saved `mapModifierConfigs.modifierType` may still be one of the three legacy strings.  
CURRENT_LIFECYCLE: LEGACY_SUPPORTED and still wired  
RECOMMENDED_LIFECYCLE: LEGACY_SUPPORTED  
PLAYER_DATA_REFERENCES: Canister `mapModifierConfigs` rows (admin). Not Character fields.  
SYSTEM_REFERENCES: WX hazard placement; Admin ModifierEditor `LEGACY_MODIFIER_TYPES`; `custom` remains a free-text escape.  
MIGRATION_REQUIRED: NO for keeping aliases. YES before removing the three strings from the WX `triggered.has` checks.  
RECOMMENDED_ACTION: Do not delete the aliases. Optional honesty-copy fix: change “no engine hook” to “legacy hazard alias (still places ice/lava/spikes).” Do not merge Manhattan/Chebyshev keep-clear with this work.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None of CDA/SDA. Honesty copy only is a docs/UI string.  
REGRESSION_RISK: HIGH if the three ids are removed from WX while admin rows still store them (maps lose intended hazards). LOW if only the label is corrected.  
VALIDATION_REQUIRED: Activating a modifier with `modifierType: "lava_fields"` still paints lava; registry dropdown still lists 22 live ids plus the four legacy/custom entries.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-007  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Classify pkg_* shop packages as no longer acquirable; keep Candid and last-row floor  
CATEGORY: admin configuration  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Admin copy: “Multi-tier Doka packages are retired” (`AdminDashboard.tsx` 6932–6934). Live pay path is GameKey (`requestGameKeyPurchase` → approve → `redeemGameKey`). `defaultShopPackages()` still seeds `pkg_10`…`pkg_1_6m` (`admin.mo` 265–282) when `shopPackages` is empty (`main.mo` 1075–1077). `adminDeleteShopPackage` hard-removes but refuses the last row (1105–1107). `initiatePurchase` is a stub (1152–1169). SDEG-2026-10-25-005 (open #1083) already locks “hard delete vs `purchaseRecords.packageId`” — CRC does not twin that helper.  
CURRENT_LIFECYCLE: NO_LONGER_ACQUIRABLE for players; catalog map still seeded  
RECOMMENDED_LIFECYCLE: NO_LONGER_ACQUIRABLE + LEGACY_SUPPORTED (Candid / EOP map / last-row)  
PLAYER_DATA_REFERENCES: Historical `purchaseRecords.packageId` (KYC leftover). Character stores no package id. GameKey ledger is a different map.  
SYSTEM_REFERENCES: `getShopPackages`, `useShopQueries.ts` (no dashboard caller for packages), Admin GameKey tab.  
MIGRATION_REQUIRED: YES to drop the `shopPackages` stable (later chain file after `20260901`, empty defaults, never edit shipped NewActor). NO to leave the map.  
RECOMMENDED_ACTION: Do not delete `pkg_*` ids as a cleanup. Do not re-enable `initiatePurchase`. Point remaining UI at GameKey only (already). Defer schema drop to SDEG.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDEG-2026-10-25-005. Do not clone #1083 helpers.  
REGRESSION_RISK: HIGH if the map or DID methods are removed while old clients still query `getShopPackages` / `initiatePurchase`.  
VALIDATION_REQUIRED: `getShopPackages` still returns rows on a seeded canister; `initiatePurchase` still `#err` with the GameKey message; redeem path unchanged.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-008  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep initiatePurchase, processPendingPurchases, and calculateAndAwardDoka as Candid stubs  
CATEGORY: admin configuration  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `initiatePurchase` always `#err` (`main.mo` 1152–1169). `processPendingPurchases` returns `0` (`1338–1348`); `WorldExploration` remount still invokes it via `shopPurchase.ts` (`shouldCommitShopCredit` only commits a real gain). `calculateAndAwardDoka` ignores args and returns `0` (`3070–3076`); AGENTS.md: do not call it from the official reward funnel. Bindgen + mocks still declare all three.  
CURRENT_LIFECYCLE: DEPRECATED / STUB_KEEP  
RECOMMENDED_LIFECYCLE: LEGACY_SUPPORTED  
PLAYER_DATA_REFERENCES: None minted by these bodies. `purchaseRecords` is separate (016).  
SYSTEM_REFERENCES: Official shop remount, bindgen, mocks, `shopPurchase.legacyCredit*.test.ts`.  
MIGRATION_REQUIRED: YES to remove methods from Candid (client prove-out). NO to leave stubs.  
RECOMMENDED_ACTION: Do not delete the methods. Do not restore awarding bodies. Keep signatures until old clients are gone.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CRC-2026-10-25-007. Reward funnel stays `applyRewards` only.  
REGRESSION_RISK: HIGH if methods are removed (old client trap) or if bodies are restored (economy mint).  
VALIDATION_REQUIRED: Remount + no-op still returns 0 and does not commit jitter (`shopPurchase` tests). `calculateAndAwardDoka` stays 0.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-009  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Custom sprite URLs are catalog-only; pieceType and pixelPattern stay  
CATEGORY: visuals  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Honesty copy (`adminVisualStatus.ts` 1–22): WorldExploration never draws `spriteUrl` / facing URLs; default chess-piece pixels are the live fallback. `getPersistedPiecePattern` maps unknown/retired `pieceType` to king.front (`pieceArt.ts` 653–658; WX 3697, 3719, 8289). `adminDeletePlayerSpriteConfig` removes a catalog row only (`main.mo` 854–860) and does not delete Character. `pixelPattern` remains a required Character `Text` written at create (`CharacterCreation.tsx` 273) and size-checked (`main.mo` 315–316). Numbered boss pixels `boss_1`…`boss_12` are the unknown-boss fallback (`enemyPixelPatterns.ts` 430–431); named keys exist for seven wave-2 bosses only.  
CURRENT_LIFECYCLE: URL catalog ORPHANED_FROM_ENGINE; `pieceType` ACTIVE; `pixelPattern` SUPERSEDED_WRITE but required Candid  
RECOMMENDED_LIFECYCLE: Hosted URL *assets* may be cleared because fallback exists. Persistent fields `pieceType`, `pixelPattern`, sprite-config map keys, and `boss_N` pixel keys are NOT SAFE_TO_REMOVE.  
PLAYER_DATA_REFERENCES: Character.`pieceType`, Character.`pixelPattern`, optional Character appearance URLs if ever written; `playerSpriteConfigs` admin map.  
SYSTEM_REFERENCES: Portrait/RAF draw, Admin sprite tab, boss pixel fallback.  
MIGRATION_REQUIRED: YES to drop `pixelPattern` from Character (later chain file). NO to delete unused catalog URLs via existing admin delete.  
RECOMMENDED_ACTION: Continue using admin delete for unused sprite configs. Never make a URL required. Do not delete `boss_1`…`boss_12` until every `BOSS_IDS` name has its own pattern.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: VAL renderer cards (do not bind URLs into combat to “make copy true”). SDEG visuals keep-list.  
REGRESSION_RISK: CRITICAL if `pieceType` / `pixelPattern` are removed from Character without EOP. LOW if an empty sprite-config row is deleted.  
VALIDATION_REQUIRED: After sprite-config delete, the character still draws king/piece pixels. Unknown pieceType does not throw.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-010  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Do not mint or delete Enemy Register lore extras as spawn ids  
CATEGORY: enemies  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Register MONSTERS includes Crimson Spawn, Shadow Lurker, Storm Caller (`EnemyRegister.tsx` 71–88) plus a “Final Enthroned Void” boss blurb (~208) beside live Enthroned Void. Chrome is explicitly flavor (`enemyRegisterCopy.ts` 11–15). Live families are the seven `FAMILY_TYPES` (`spawnPolicy.ts` 49–57). Admin `EnemyConfig` is canister catalog only (`AdminDashboard.tsx` 2117–2121); WX spawn does not read `getEnemyConfigs`.  
CURRENT_LIFECYCLE: LORE_ONLY (UI) vs KEEP_UNWIRED (admin enemy map) vs ACTIVE (7 families)  
RECOMMENDED_LIFECYCLE: Keep lore as lore. Admin enemy ids LEGACY_SUPPORTED even if unused by spawn. Families ACTIVE.  
PLAYER_DATA_REFERENCES: `enemyConfigs` canister map (admin). No character enemy-id ownership. Families are runtime overlays.  
SYSTEM_REFERENCES: Enemy Register, Admin Enemies tab, `generateEnemies`, `spawnPolicy.ts`.  
MIGRATION_REQUIRED: NO  
RECOMMENDED_ACTION: Do not add Register-only names to `EnemyFamily`. Do not wipe `enemyConfigs` because spawn ignores them. Do not treat lore rows as deprecated spawn templates.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-001 (family bind). Do not twin.  
REGRESSION_RISK: HIGH if admin enemy map is cleared (admin data loss) or if lore names are implemented as thin skins without kits.  
VALIDATION_REQUIRED: Register still labeled FLAVOR LORE; overworld still rolls 7 families; Admin enemy save still persists.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-011  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep kiter and kamikaze summonAI aliases  
CATEGORY: admin configuration  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `inferSummonArchetype` maps `kiter`→archer and `kamikaze`→bomber (`enemyAI.ts` 205–207). `SUMMON_BASE_HP` includes both keys (`gameConstants.ts` 69–77). Admin allow-list includes them (`adminSafety.ts` 19–27). Catalog summon writes reject unknown `summonAI` (adminGuard). Historical admin spells may already store the aliases.  
CURRENT_LIFECYCLE: LEGACY_SUPPORTED aliases of live archetypes  
RECOMMENDED_LIFECYCLE: LEGACY_SUPPORTED  
PLAYER_DATA_REFERENCES: SpellConfig.`summonAI` on canister catalog rows (not Character).  
SYSTEM_REFERENCES: Summon AI, HP scale, admin validation.  
MIGRATION_REQUIRED: YES before removing the aliases (rewrite stored summonAI). NO to keep them.  
RECOMMENDED_ACTION: Do not drop the aliases. New content should write `archer` / `bomber`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None.  
REGRESSION_RISK: MEDIUM if aliases are removed while catalog rows still say `kiter`/`kamikaze` (summon AI falls through to name heuristics).  
VALIDATION_REQUIRED: A summon with `summonAI: "kiter"` still behaves as archer; `"kamikaze"` as bomber.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-012  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep achievement soft-retire and the fifteen default ids; do not add boss_defeated_*  
CATEGORY: achievements  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Defaults `first_blood`…`rich_vampire` all `active=true` (`admin.mo` 309–326). Delete-with-progress sets `active=false` (`main.mo` 2397–2404); hard `remove` only if no `achievementProgress` rows. `markAchievementUnlocked` rejects retired (`2472–2473`). `claimAchievementReward` does not check `active` and pays current `dokaReward` (`2517–2550`). Client emits `boss_defeated_${bossId}` (`victoryAchievements.ts` 41–44`) but `knownAchievementCondition` has no such prefix (`adminGuard.mo` 515–530`) — fails closed. Progress key is `principal#achievementId` (`2528`).  
CURRENT_LIFECYCLE: Defaults ACTIVE. Soft-retire path KEEP. `boss_defeated_*` is an orphan emitter, not a catalog id.  
RECOMMENDED_LIFECYCLE: ACTIVE for the fifteen; LEGACY_SUPPORTED for any admin-retired id with progress; do not mint `boss_defeated_*` without allow-list + configs.  
PLAYER_DATA_REFERENCES: `achievementProgress` map (unlocked/claimed). Wallet feats deferred until `applyRewards` (`shouldDeferAchievementUnlockUntilRewardsPersist`).  
SYSTEM_REFERENCES: AchievementsPanel hides inactive; Feats fire `a.active`.  
MIGRATION_REQUIRED: YES to rename any default id. NO to leave them.  
RECOMMENDED_ACTION: Never hard-delete an id that has progress. Do not block claim after retire without an economy decision. Do not treat the orphan emitter as removable content — it is a client string.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDEG claim-current-reward known item. Do not twin.  
REGRESSION_RISK: HIGH if default ids are renamed or progress is wiped. LOW if the unused emitter stays.  
VALIDATION_REQUIRED: Retire-with-progress leaves `active=false` and still allows claim; unknown `boss_defeated_*` does not unlock.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-013  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep all nine session challenge ids; none are unused  
CATEGORY: challenges  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `DEFAULT_CHALLENGES` ids `easy_1`…`easy_3`, `hard_1`…`hard_3`, `legendary_1`…`legendary_3` (`challengeCompletion.ts` 44–109). Random pick in WorldExploration. No Motoko challenge store. Rewards go through `applyRewards` only when `isChallengeCompleted` is true. `recordChallengeDamageTaken` / `recordInBattleChallengeDamage` are live combat hooks. Badges Untouchable/Blitz/Striker are session cosmetic.  
CURRENT_LIFECYCLE: ACTIVE (session catalog)  
RECOMMENDED_LIFECYCLE: ACTIVE  
PLAYER_DATA_REFERENCES: None on canister. Session + local HUD.  
SYSTEM_REFERENCES: Challenge panel, combat debit helpers, reward funnel.  
MIGRATION_REQUIRED: NO (session-only). Do not persist challenge history onto required Character fields.  
RECOMMENDED_ACTION: Do not remove any of the nine without replacing the roller and tests together.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None.  
REGRESSION_RISK: HIGH if an id is removed while the roller still references it, or if damage recording is dropped (false Untouchable).  
VALIDATION_REQUIRED: Each of the nine still selectable; legendary_1 still requires `recordChallengeDamageTaken`.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-014  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Formations and second_lament are design-only; do not delete runtime ids for them  
CATEGORY: formations  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: No formation runtime ids under `src/frontend` (grep hits flavor text in `bossKits.ts` only). Formation / Wave-3 boss sheets live in `docs/`. `second_lament` is the documented remap for `weeping_pawn_2` (`docs/design/BOSS_AND_SPELL_DISCOVERY.md`) and is not in `BOSS_IDS`. Open design PRs from 2026-10-25 (#1075 formations, #1080 boss sheets) are not on `main`.  
CURRENT_LIFECYCLE: PROPOSED_ONLY  
RECOMMENDED_LIFECYCLE: Keep design. Do not mint persistent ids until kits exist. Do not retire live rush/boss ids to make room.  
PLAYER_DATA_REFERENCES: None.  
SYSTEM_REFERENCES: Docs only; live rush table (004).  
MIGRATION_REQUIRED: YES when/if `second_lament` ships (alias `weeping_pawn_2`, kits, pixels). Not this run.  
RECOMMENDED_ACTION: No runtime deletion. Implementation of `second_lament` must alias, not delete, room 9.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CRC-2026-10-25-004. Boss-system design PRs — do not clone.  
REGRESSION_RISK: HIGH if Wave-3 ids are added to `BOSS_IDS` without kits, or if `weeping_pawn_2` is deleted first.  
VALIDATION_REQUIRED: `BOSS_IDS` length stays 19 until a kit-complete add; room 9 index remains.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-015  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: No live telemetry fields to retire; do not build persist-lock increments  
CATEGORY: telemetry fields  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Production telemetry is absent (`longHorizonSim.ts` ~532 `available: false`). Architecture docs through 2026-09-02 never landed counters. WX “telemetry” at ~16443 is a comment. Pre-GameKey shop increment series in older TELEMETRY docs is superseded (use `redeemGameKey`, not `processPendingPurchases`). GTAD forbids enqueueing telemetry on `createProgressPersist`.  
CURRENT_LIFECYCLE: NOT_SHIPPED / SUPERSEDED_DESIGN  
RECOMMENDED_LIFECYCLE: Leave unimplemented. Nothing to delete from the actor.  
PLAYER_DATA_REFERENCES: None. Do not reuse `getLeaderboard`, OQL, `PurchaseRecord` PII, or GameKey email as telemetry.  
SYSTEM_REFERENCES: Design docs only.  
MIGRATION_REQUIRED: NO  
RECOMMENDED_ACTION: Do not add required telemetry stables. Do not delete Candid because a doc named a future counter.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: GTAD telemetry cards. Do not twin.  
REGRESSION_RISK: CRITICAL if increments are attached to the persist lock or if PII dumps are treated as metrics.  
VALIDATION_REQUIRED: Sim still reports telemetry unavailable; no new actor fields this work.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-016  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep 12-field CharacterStats, session optionals, purchaseRecords, and backend_extended 15-field reference  
CATEGORY: admin configuration  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live `CharacterStats` is 12 fields including `evasion` / `resilience` / `killCount` (`main.mo` 147–160) — unread in `combatMath.ts` is not a delete license. Optional Character `bloodBalance` / `covenantBuff` / `shrineCount` (`137–139`) have `updateSessionState` (`3118–3158`) with no official TSX caller. `purchaseRecords` remains an EOP map; official client does not write it (SDEG helper `officialClientWritesPurchaseRecords`). Root `backend_extended/main.mo` 55–58 still has `wp`/`wr`/`scp`. Live actor must not revive those three or drop the 12.  
CURRENT_LIFECYCLE: LIVE 12-field contract; session fields LEGACY_SUPPORTED unused writers; KYC map LEGACY_SUPPORTED; extended actor LEGACY_KEEP  
RECOMMENDED_LIFECYCLE: Same. None SAFE_TO_REMOVE.  
PLAYER_DATA_REFERENCES: Every character row (stats + optionals). `purchaseRecords` may hold PII on a live canister.  
SYSTEM_REFERENCES: Bindgen `backend.ts`, create/update payloads, AGENTS.md CharacterStats rule, dfx stale pointer.  
MIGRATION_REQUIRED: YES for any field add/drop (new later file after `20260901`, `OldActor = {}`). Never amend shipped NewActor.  
RECOMMENDED_ACTION: Do not strip unread stats. Do not delete `purchaseRecords`. Do not delete `backend_extended` as unused. Do not wire `updateSessionState` as a required path without SDEG.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: EOP rules; SDEG-2026-10-25-005 for packageId on KYC rows.  
REGRESSION_RISK: CRITICAL (Candid 12-field, IC0503 / missing stables, PII).  
VALIDATION_REQUIRED: Character create still sends all 12 stats + `killCount`. `python3 scripts/check-eop-stables.py` remains the gate for any later schema idea — not this PR.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-017  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Keep placeholder map modifiers selectable; blood_moon is also a spike alias  
CATEGORY: world content  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Registry placeholders `blood_moon`, `mirror_field`, `gravity_well`, `fog_of_war` (`mapModifiers.ts` 260–296) announce only in hooks. `blood_moon` additionally aliases spikes in WX 6697–6700 (comment in mapModifiers is stale). Admin can set `active=true`. Seeded defaults are only `slime_flood` and `paper_windstorm` (`admin.mo` 135–155). Fresh canisters lack the other 20 until admin adds them — PARTIAL_SEED, not obsolete.  
CURRENT_LIFECYCLE: INCOMPLETE_KEEP (placeholders) + KEEP_LIVE (seeded two) + KEEP_WIRED_LEGACY (blood_moon alias)  
RECOMMENDED_LIFECYCLE: INCOMPLETE_KEEP — wire or leave; do not delete registry ids while admin rows can name them  
PLAYER_DATA_REFERENCES: `mapModifierConfigs` ids / `modifierType`.  
SYSTEM_REFERENCES: Modifier registry, WX trigger set, Admin dropdown.  
MIGRATION_REQUIRED: YES before removing a registry id that may exist on canister rows.  
RECOMMENDED_ACTION: Do not delete placeholder ids. Optional: fix the blood_moon “mechanism not located” comment. Open combat PRs that soak Mirror Field (#1079) are not this CRC card.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CRC-2026-10-25-006. Do not clone #1079.  
REGRESSION_RISK: MEDIUM if placeholders are removed from the dropdown while rows exist; HIGH if `blood_moon` is removed from WX aliases.  
VALIDATION_REQUIRED: 22 `EXISTING_MAP_MODIFIER_IDS` still list; `blood_moon` still places spikes.  
STATUS: NEW  

---

ACTION_ID: CRC-2026-10-25-018  
SOURCE_AUTOMATION: Content Retirement & Compatibility Manager  
TITLE: Backfill is not retirement — keep seven wave-2 boss ids on the frontend catalog  
CATEGORY: bosses  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Frontend `BOSS_IDS` has 19 (`bossTypes.ts` 390–410) including `alabaster_fortress`, `chessboard_lich`, `mirror_sovereign`, `starved_vampire_pawn`, `pale_archivist`, `twin_monarchs`, `enthroned_void`. AdminLib seeds 12 (`admin.mo` 349–568). Portal assignment requires a `bossConfigs` row (`main.mo` 3022–3031`) — wave-2 ids fail canister assign until seeded. Overworld random portal uses `BOSS_IDS` client-side (`WorldExploration.tsx` 4900–4901). Named pixel patterns exist for those seven (`enemyPixelPatterns.ts` 274–427).  
CURRENT_LIFECYCLE: ACTIVE on frontend; missing from empty-canister AdminLib seed  
RECOMMENDED_LIFECYCLE: ACTIVE. Not deprecated. BACKFILL_ADMINLIB is a content add, not a delete.  
PLAYER_DATA_REFERENCES: Possible `bossConfigs` / `bossPortalAssignments` if an admin already added rows.  
SYSTEM_REFERENCES: Boss guide, kits, AI, rush rooms 3–9 (those rooms already name several wave-2 ids as boss1/boss2).  
MIGRATION_REQUIRED: NO to leave frontend ids. YES only in the sense of adding seed rows (empty-store add is not an EOP field add).  
RECOMMENDED_ACTION: Do not remove wave-2 ids from `BOSS_IDS` because AdminLib is short. A later seed PR may append the seven rows; do not rewrite frozen migrations.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CRC-2026-10-25-005. EBA admin-seed cards — do not twin.  
REGRESSION_RISK: HIGH if the seven ids are dropped from frontend (rush rooms 3–9 break labels/kits).  
VALIDATION_REQUIRED: `BOSS_IDS.length === 19`; `validateBossKits()` still covers all 19; AdminLib remains 12 until a seed PR.  
STATUS: NEW  

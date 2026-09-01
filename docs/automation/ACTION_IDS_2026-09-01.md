# ACTION_IDs — 2026-09-01 Admin Feature & Drift Auditor

Durable ledger. Reuses AFDA-2026-08-31-* for the same underlying problems.
Source of every record: Admin Feature & Drift Auditor.
Do not delete admin CRUD because a tab looks unused. Prove obsolescence first.

---

ACTION_ID: AFDA-2026-08-31-001
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Spell admin writes used frontend `hitsMultiple` and omitted Candid `cooldown` / `multiTarget`
CATEGORY: BROKEN
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: Adapter still in `adminContract.ts` `toBackendSpellConfig` / `fromBackendSpellConfig` (235–247, 298–307). Bindgen `SpellConfig` (`backend.ts` 115–145) requires `multiTarget`, `hitsAllies`, `cooldown`. Combat still reads `hitsMultiple`. Motoko `admin.mo` 92–127 now also requires summon fields the bindgen record lacks (see AFDA-2026-09-01-020).
SYSTEMS_AFFECTED: Admin Spells tab; `adminSetSpellConfig`; player/enemy cast targeting
CURRENT_BEHAVIOUR: Cooldown and multi-target round-trip via adapter. Frontend-only mechanic flags still drop (018).
AUTHORITATIVE_BEHAVIOUR: One wire name (`multiTarget`); hydrate maps to `hitsMultiple`. Persist or hide frontend-only flags.
RECOMMENDED_ACTION: Keep the adapter. Persist `targetType` / mechanic flags or stop editing them (018). Regenerate bindgen for summon fields (020).
AUTONOMY: HUMAN — remaining work is a schema decision
DEPENDENCIES: AFDA-2026-08-31-018; AFDA-2026-09-01-020
REGRESSION_RISK: MEDIUM if a later change drops the adapter without updating combat
VALIDATION_REQUIRED: Admin create a multi-target spell with cooldown 2; Candid save succeeds; combat applies both.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-08-31-002
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Boss admin and world load `pbv_boss_configs` while the canister already has boss CRUD
CATEGORY: LEGACY
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `useBossQueries.ts` 1–31 and `useAdminQueries.ts` 484–524 still read/write `localStorage.pbv_boss_configs`. `WorldExploration.tsx` 7151 loads the same key. `main.mo` 2602–2645: `setBossConfig`, `deleteBossConfig`, `getAllBossConfigs`. Frontend `BossConfig` (`bossTypes.ts` 91–110) has `iconEmoji`, `loreText`, `chc`; bindgen/Motoko (`backend.ts` 251–264; `admin.mo` 291–304) have `defeated`, `adminNotes`, no `chc`. Admin Bosses tab still states browser-local drafts (`AdminDashboard.tsx` ~7333).
SYSTEMS_AFFECTED: Admin Bosses tab; boss portals; Boss Rush kits
CURRENT_BEHAVIOUR: Admin edits are browser-local. Canister boss maps stay empty unless written elsewhere.
AUTHORITATIVE_BEHAVIOUR: Backend-authoritative configs; localStorage cache only.
RECOMMENDED_ACTION: Unify schemas, then wire hooks to `getAllBossConfigs` / `setBossConfig`. Do not delete the local fallback until a live canister read succeeds.
AUTONOMY: HUMAN — schema merge
DEPENDENCIES: None
REGRESSION_RISK: HIGH if wired without mapping `iconEmoji`/`loreText`
VALIDATION_REQUIRED: Save a boss in admin on machine A; load on machine B against the same canister.
STATUS: NEW

---

ACTION_ID: AFDA-2026-08-31-003
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Level-up admin still omits canister fields the game and `upgradeSpell` use
CATEGORY: PARTIAL
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: This run added all nine inputs and `toBackendLevelUpConfig` (`adminContract.ts` 273–296). Settings hydrates `getLevelUpConfig`. Frontend `LevelUpConfig` (`gameTypes.ts` 408–424) still uses `apMpGrowthEveryNLevels` and omits `spellLevelingBaseCost` / multiplier / `spellDmgGrowthPercent`. `WorldExploration.tsx` 2308–2316 still reads only `pbv_levelup_config`, never `getLevelUpConfig()`. `upgradeSpell` uses canister `spellLevelingBaseCost`.
SYSTEMS_AFFECTED: Settings tab; spell upgrade cost; HP/AP growth
CURRENT_BEHAVIOUR: Admin can edit and persist all nine canister fields. Live combat still hydrates fail/range from localStorage.
AUTHORITATIVE_BEHAVIOUR: Admin edits all nine fields; world hydrates `getLevelUpConfig()`.
RECOMMENDED_ACTION: Point WorldExploration at `getLevelUpConfig` (cache only). Align `gameTypes.LevelUpConfig` names with Candid (`apMpLevelThreshold`).
AUTONOMY: IMPLEMENT
DEPENDENCIES: None
REGRESSION_RISK: MEDIUM — wrong defaults would change upgrade prices
VALIDATION_REQUIRED: Change `spellLevelingBaseCost` on canister; confirm summon upgrade UI and debit match.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-08-31-004
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Shop packages are hardcoded in the player shop; admin Shop tab cannot CRUD them
CATEGORY: MISSING
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `adminSetShopPackage` / `adminDeleteShopPackage` / `getShopPackages` (`main.mo` 1051–1082). Admin Shop tab is grant-Doka + ban; “Configure payment links below” has no form. Player shop (`WorldExploration.tsx` 19609–19627) hardcodes 15 packages. `useGetShopPackages` exists and is unused by AdminDashboard.
SYSTEMS_AFFECTED: Economy; Doka shop; admin Shop tab
CURRENT_BEHAVIOUR: Players buy a fixed catalog. Canister packages are unused by the UI.
AUTHORITATIVE_BEHAVIOUR: Player shop lists `getShopPackages`; admin CRUD writes that catalog and payment links.
RECOMMENDED_ACTION: Add package CRUD to the Shop tab; drive the player shop from `getShopPackages` with the hardcoded list as fallback only.
AUTONOMY: HUMAN — pricing / payment-link policy
DEPENDENCIES: None
REGRESSION_RISK: HIGH if the live catalog is emptied
VALIDATION_REQUIRED: Admin add/edit a package; player shop shows it; `initiatePurchase` still uses nine positional args.
STATUS: NEW

---

ACTION_ID: AFDA-2026-08-31-005
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Purchases tab called non-existent `getPurchaseRecords`
CATEGORY: BROKEN
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: Hook now calls `getPurchases` and maps via `readPurchasesResult` (`useShopQueries.ts` 70–89; `adminContract.ts` 77–141). Canister also has `adminGetPurchaseRecords` (`main.mo` 1198). Price column stays empty (`priceEur` not on `PurchaseRecord`; cents live on `ShopPackage`).
SYSTEMS_AFFECTED: Admin Purchases tab
CURRENT_BEHAVIOUR: Query hits a live method and maps customer fields. Price column empty.
AUTHORITATIVE_BEHAVIOUR: Admin list uses `adminGetPurchaseRecords`; join package price if needed.
RECOMMENDED_ACTION: Switch the hook to `adminGetPurchaseRecords(null)`; show `priceEuroCents` via package join.
AUTONOMY: IMPLEMENT
DEPENDENCIES: AFDA-2026-08-31-004
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After a real purchase, admin Purchases shows name, email, status, and proof URL.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-08-31-006
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Admin enemy records are not consumed by encounter spawn
CATEGORY: MISLEADING
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `useGetEnemyConfigs` is admin-only. Spawn uses `pickEnemyLevelFromTiers` + `getEnemyBaseStats`. Admin `EnemyConfig` is hp/ap/mp/initStat/levelMin/levelMax/regions/spriteUrl — not `types/common.mo` combat template. No `spriteUrl` reader in WorldExploration. This run labeled the Enemies tab catalog-only. Do not delete CRUD.
SYSTEMS_AFFECTED: Enemies tab; encounters; player-relative tiers
CURRENT_BEHAVIOUR: Saving an enemy does not change overworld packs. Tiers tab does affect spawn. Enemy **names** from `getEnemyNames` are used at spawn (`WorldExploration.tsx` 2172, 6332).
AUTHORITATIVE_BEHAVIOUR: Either wire spawn to admin enemy templates (optional visual, default pixel) or keep the catalog-only label.
RECOMMENDED_ACTION: Keep CRUD. Prove no other caller before any delete. Optional spawn integration is a separate project (EBA-001).
AUTONOMY: HUMAN
DEPENDENCIES: AFDA-2026-08-31-013
REGRESSION_RISK: HIGH if spawn is rewritten
VALIDATION_REQUIRED: Grep-confirmed no game caller for getEnemyConfigs; optional spawn playtest.
STATUS: NEW

---

ACTION_ID: AFDA-2026-08-31-007
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Battle challenges have no admin surface
CATEGORY: MISSING
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Catalog is `DEFAULT_CHALLENGES` in `utils/challengeCompletion.ts`. AdminDashboard has zero challenge editors. Backend has no challenge config map.
SYSTEMS_AFFECTED: Challenges; recap rewards
CURRENT_BEHAVIOUR: Operators cannot change conditions or rewards without a code change.
AUTHORITATIVE_BEHAVIOUR: If challenges stay code-owned, say so in admin. If editable, add a gated catalog that `handleBattleEnd` reads.
RECOMMENDED_ACTION: Report-only unless product wants operator-tunable rewards.
AUTONOMY: HUMAN
DEPENDENCIES: None
REGRESSION_RISK: HIGH if rewards move off the persist lock
VALIDATION_REQUIRED: N/A until a design exists
STATUS: NEW

---

ACTION_ID: AFDA-2026-08-31-008
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Boss Rush admin enable/reward JSON is ignored by the live 10-room table
CATEGORY: MISLEADING
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: Admin writes `room_N_enabled` / `room_N_reward` to localStorage + `adminSetBossRushConfig`. `useBossRush.ts` 233–247 only applies `parsed.rewardMultiplier`. Rooms come from `BOSS_RUSH_ROOMS` (room 9 uses `weeping_pawn_2`). This run labeled the tab.
SYSTEMS_AFFECTED: Boss Rush; admin Boss Rush tab
CURRENT_BEHAVIOUR: Toggling a room off does not skip it. Reward `x` does not change `dokaReward`/`xpReward`.
AUTHORITATIVE_BEHAVIOUR: Either consume the JSON (enable + multiplier) or replace the tab with a read-only view of `BOSS_RUSH_ROOMS`.
RECOMMENDED_ACTION: Do not invent a second room table. Wire or relabel.
AUTONOMY: HUMAN
DEPENDENCIES: AFDA-2026-08-31-002
REGRESSION_RISK: HIGH if rooms are duplicated
VALIDATION_REQUIRED: Disable room 3 in admin; start a rush; confirm skip or confirm the control is labeled display-only.
STATUS: NEW

---

ACTION_ID: AFDA-2026-08-31-009
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Player sprite walk-frame field names drifted (`walkFramesFront` vs `frontWalkFrames`)
CATEGORY: BROKEN
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Adapter still maps both directions (`adminContract.ts` 179–227; `useSpellQueries.ts` 223–246). Motoko / bindgen use `frontWalkFrames`. Admin type uses `walkFramesFront`. WorldExploration still never reads `getPlayerSpriteConfigs` (017).
SYSTEMS_AFFECTED: Admin Player Sprites tab
CURRENT_BEHAVIOUR: Walk-frame arrays can round-trip the canister. Game still draws built-in pixel pieces.
AUTHORITATIVE_BEHAVIOUR: Same field names on admin type and Candid; optional custom URL with pixel fallback.
RECOMMENDED_ACTION: Rename the frontend type to match bindgen; keep the adapter until callers migrate.
AUTONOMY: IMPLEMENT
DEPENDENCIES: AFDA-2026-08-31-017
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Save walk frames; refetch; arrays still populated.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-08-31-010
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Visuals tab and world hydrate used different palette cache keys
CATEGORY: BROKEN
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Admin still dual-writes `paperVertexPalette` and `pbv_color_palette` (`AdminDashboard.tsx` ~4271–4272). World hydrates `getColorPalette` into `pbv_color_palette`.
SYSTEMS_AFFECTED: Visuals tab; paper-vertex landscape
CURRENT_BEHAVIOUR: Admin save updates both caches and the canister.
AUTHORITATIVE_BEHAVIOUR: Single cache key matching world hydrate.
RECOMMENDED_ACTION: Drop `paperVertexPalette` after one version-gate cycle.
AUTONOMY: IMPLEMENT
DEPENDENCIES: None
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Save palette in admin; reload world; vertex colors match.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-08-31-011
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Finite-level defaults and copy contradict “no player level cap”
CATEGORY: MISLEADING
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: This run defaults new enemy/region `levelMax` to 9999 and rewrote fail-chance help. Region effects still apply only when `level <= region.levelMax` (`WorldExploration.tsx` 3717–3721). Death Realm `maxLevel` is 5 at 14004 and 14136 vs 9999 at 6021. `pickEnemyLevelFromTiers` caps at `floor(999 / tierSize)` (`combatMath.ts` 58). Motoko `LevelUpConfig` comment still says fail reaches 0 at level 200 (`admin.mo` 148).
SYSTEMS_AFFECTED: Regions; enemies; spell fail; Death Realm; player-relative spawn
CURRENT_BEHAVIOUR: New admin drafts no longer seed a 1–5 career band. A saved region with max 5 still excludes level 6+. Spawn math still stops climbing after level 999.
AUTHORITATIVE_BEHAVIOUR: No player level cap. `levelMax` on templates is a band, not a career ceiling. Death Realm must not use maxLevel 5.
RECOMMENDED_ACTION: Fix Death Realm zone to 9999 (do not edit mapGen). Lift or document the 999 spawn band (EBA-003). Treat existing region max=5 as content, not a product cap.
AUTONOMY: IMPLEMENT for Death Realm zone only. Do not touch mapGen / combat math in this auditor.
DEPENDENCIES: None
REGRESSION_RISK: MEDIUM if region matching becomes unbounded without a fallback
VALIDATION_REQUIRED: Level 20 character still gets a region (or an explicit “no region” state). Death Realm HUD does not show 1–5.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-08-31-012
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Backend/game systems with no admin management
CATEGORY: MISSING
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Present in actor or live game, absent from AdminDashboard tabs: dungeon records; buff catalog; `setAppVersion` / `setChangelog`; `getBannedPrincipals` list; `setBossPortalAssignment` (hook is a no-op, `useAdminQueries.ts` 541–557); `getAllCharacters`; enemy AI; variants; telemetry (comment only at WorldExploration 16878); `getAdminAuditLog` (`main.mo` 3101) — also missing from bindgen `backend.ts`.
SYSTEMS_AFFECTED: Dungeons; economy/buffs; ops; portals; AI; telemetry
CURRENT_BEHAVIOUR: Operators cannot tune these from the dashboard.
AUTHORITATIVE_BEHAVIOUR: Admin covers every persisted config map. Code-owned systems should be labeled as such.
RECOMMENDED_ACTION: Add only configs that already have canister CRUD (version, changelog, ban list, portal assignments, shop packages, audit log). Do not invent telemetry.
AUTONOMY: HUMAN — pick which surfaces
DEPENDENCIES: AFDA-2026-08-31-004; AFDA-2026-09-01-020
REGRESSION_RISK: LOW for read-only ops panels
VALIDATION_REQUIRED: Per surface
STATUS: NEW

---

ACTION_ID: AFDA-2026-08-31-013
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Custom enemy artwork is optional; admin `spriteUrl` is unused
CATEGORY: VISUAL_FALLBACK
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Enemy editor already labels Default Pixel Visual (`AdminDashboard.tsx` ~731–763). No `spriteUrl` / `drawImage` reader in WorldExploration. New enemies/bosses render from piece/family pixel patterns. Custom art is not mandatory.
SYSTEMS_AFFECTED: Enemies; bosses; visuals
CURRENT_BEHAVIOUR: Default pixel visual always works. Admin URL does not appear in combat.
AUTHORITATIVE_BEHAVIOUR: valid custom visual → custom; otherwise built-in pixel.
RECOMMENDED_ACTION: Keep pixel fallback. Either hook `spriteUrl` as optional overlay or keep the unused-field label. Do not require artwork for new enemies.
AUTONOMY: HUMAN
DEPENDENCIES: AFDA-2026-08-31-006
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Spawn an enemy with empty `spriteUrl`; confirm default pixels draw.
STATUS: NEW

---

ACTION_ID: AFDA-2026-08-31-014
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Spell `minLevel` / discovery is not enforced; every backend spell becomes owned
CATEGORY: PARTIAL
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: `ownedSpells` (`WorldExploration.tsx` 2410–2438) now filters via `shouldIncludeBackendSpellInLibrary` (`usableByPlayer` or already owned via spellLevelKeys / bar). Still no `minLevel` check. `OLD_SPELL_NAMES_SET` still filters by name and id (SDA-006). Admin still edits `minLevel`.
SYSTEMS_AFFECTED: Spells; spell discovery
CURRENT_BEHAVIOUR: Retired `usableByPlayer=false` spells stay out of new libraries. `minLevel` is ignored. Saving a player-usable spell still grants it to anyone who hydrates the catalog.
AUTHORITATIVE_BEHAVIOUR: `minLevel` gates discovery/equip if that field stays in admin. Catalog does not imply ownership (SDA-002).
RECOMMENDED_ACTION: Enforce `minLevel` at hydrate, or hide the field. Do not treat the full catalog as owned.
AUTONOMY: HUMAN
DEPENDENCIES: AFDA-2026-08-31-001
REGRESSION_RISK: MEDIUM — locking existing bars
VALIDATION_REQUIRED: Spell with minLevel 10 hidden from a level-3 character.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-08-31-015
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Shop, Ads, and Boss Rush tabs use gray Tailwind instead of carved-stone admin chrome
CATEGORY: UX-DEGRADED
PRIORITY: P3
CONFIDENCE: HIGH
EVIDENCE: Enemies/Spells/Settings use stone tokens. Shop (`bg-gray-800`), Ads (`#ff4444` / `#aaa`), Boss Rush (`bg-gray-800`) do not.
SYSTEMS_AFFECTED: Admin Shop / Ads / Boss Rush
CURRENT_BEHAVIOUR: Three tabs look like a different product.
AUTHORITATIVE_BEHAVIOUR: Ankama/Dofus carved-stone, dark slate, crimson accents.
RECOMMENDED_ACTION: Restyle those tabs to match `sectionHeadStyle` / `C` tokens.
AUTONOMY: IMPLEMENT
DEPENDENCIES: None
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Visual compare against Enemies tab.
STATUS: NEW

---

ACTION_ID: AFDA-2026-08-31-016
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Admin modifier type list drifted from the live engine registry
CATEGORY: OUTDATED
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: This run builds the dropdown from `listAdminModifierTypeOptions()` (`mapModifiers.ts`). Live registry has 22 ids including `titans_vigor` … `doka_fever`. Legacy `lava_fields` / `ice_fields` / `spike_pit` / `custom` remain selectable so saved rows are not deleted. Motoko `MapModifierConfig` comment (`admin.mo` 167–171) still lists only slime_flood / paper_windstorm.
SYSTEMS_AFFECTED: Map Modifiers tab; portal modifier rolls
CURRENT_BEHAVIOUR: Every registry id is selectable. Legacy hazard ids still save but have no engine hook.
AUTHORITATIVE_BEHAVIOUR: Dropdown equals `MAP_MODIFIERS` ids. Saved unknown ids remain visible.
RECOMMENDED_ACTION: Keep legacy options until no stored row uses them. Do not delete configs.
AUTONOMY: IMPLEMENT
DEPENDENCIES: None
REGRESSION_RISK: MEDIUM if a live modifier id is dropped from the dropdown
VALIDATION_REQUIRED: Every registry id selectable; a `doka_fever` row can be saved.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-08-31-017
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Player sprite configs persist but the world never draws them
CATEGORY: MISLEADING
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: `getPlayerSpriteConfigs` is admin-only. WorldExploration has no `playerSprite` / `frontUrl` usage; player draw uses `chessPiecePatterns` / `drawPixelPattern`. This run labeled the tab catalog-only. Custom art is not mandatory.
SYSTEMS_AFFECTED: Player Sprites tab; character visuals
CURRENT_BEHAVIOUR: Operators can upload URLs that never appear in play. Pixel pieces still work.
AUTHORITATIVE_BEHAVIOUR: Optional custom sprite with pixel fallback.
RECOMMENDED_ACTION: Prove no other renderer reads these configs. Then wire optional overlay or keep catalog-only. Do not delete.
AUTONOMY: HUMAN
DEPENDENCIES: AFDA-2026-08-31-009
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Grep-confirmed no game caller.
STATUS: NEW

---

ACTION_ID: AFDA-2026-08-31-018
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Admin special-mechanic flags are not on the canister SpellConfig
CATEGORY: IGNORED_FIELDS
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Editor writes `isSwap`, `isMirror`, `isTimestep`, `isSacrifice`, `isBarrier`, `isTrap`, `isMark`, buff/debuff/DoT numbers, `targetType`. Motoko `SpellConfig` (`admin.mo` 92–127) now has summon fields + cooldown but still lacks those mechanic flags. Bindgen (`backend.ts` 115–145) has neither summon nor mechanic flags. `toBackendSpellConfig` cannot persist what Candid does not encode.
SYSTEMS_AFFECTED: Spells
CURRENT_BEHAVIOUR: Toggling Barrier on an admin spell does not persist. Reloading loses the flag.
AUTHORITATIVE_BEHAVIOUR: Either extend Motoko SpellConfig / `effectParams` JSON, or remove the toggles.
RECOMMENDED_ACTION: Persist via `effectParams` (already optional Text) without a Motoko schema break, or extend the record and regenerate bindgen.
AUTONOMY: HUMAN
DEPENDENCIES: AFDA-2026-08-31-001; AFDA-2026-09-01-020
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Save Barrier; reload admin; combat still treats the spell as a barrier.
STATUS: NEW

---

ACTION_ID: AFDA-2026-08-31-019
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Settings admin-role transfer calls caffeine `assignCallerUserRole`, not `assignUserRole`
CATEGORY: UNSAFE
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: `useAssignUserRole` (`useAdminQueries.ts` 92–98) now calls `assignUserRole(Principal, role: Text)` and `assertAdminCmdOk`. `main.mo` implements `assignUserRole`. Bindgen still also lists mixin `assignCallerUserRole` / `isCallerAdmin` which are **not** in `src/backend/main.mo`. App.tsx admin gate uses `getUserRole`, not `isCallerAdmin`.
SYSTEMS_AFFECTED: Settings tab; auth
CURRENT_BEHAVIOUR: Transfer uses the rate-limited Text-role method. Mixin methods remain on stale Candid.
AUTHORITATIVE_BEHAVIOUR: Admin transfer uses `assignUserRole` in `main.mo`.
RECOMMENDED_ACTION: Keep current hook. Do not call `isCallerAdmin` against a source-only actor (020).
AUTONOMY: HUMAN — confirm deployed DID
DEPENDENCIES: AFDA-2026-09-01-020
REGRESSION_RISK: HIGH if the mixin is the only live grant path on an un-upgraded canister
VALIDATION_REQUIRED: Transfer admin on a deployed canister; both principals can open admin.
STATUS: FIXED

---

ACTION_ID: AFDA-2026-09-01-020
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Bindgen and `src/backend/main.mo` SpellConfig / admin methods have drifted
CATEGORY: BACKEND_CONTRACT
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: Motoko `SpellConfig` (`admin.mo` 92–127; `defaultSpells` 172–190) requires `isSummon`, `summonAI`, `summonLifespan`, `summonUnitDef`, `cooldown`. Generated `backend.ts` 115–145 and `declarations/backend.did.d.ts` 202–232 omit the summon block. `getAdminAuditLog` exists on `main.mo` 3101 and `usePanelLayout.ts` 48 but not on `backend.ts`. Bindgen lists `isCallerAdmin` / `assignCallerUserRole` which are absent from `main.mo`. README says do not hand-edit bindgen; regenerate with `pnpm bindgen`.
SYSTEMS_AFFECTED: `adminSetSpellConfig`; audit log; admin auth probes; mocks
CURRENT_BEHAVIOUR: Admin spell save encodes the bindgen record (no summon). A canister built from current Motoko would reject or drop summon metadata. Audit log is uncallable through generated client.
AUTHORITATIVE_BEHAVIOUR: Bindgen matches canonical `src/backend/main.mo`. Extra mixin methods are not treated as the live actor.
RECOMMENDED_ACTION: After a source-faithful Candid emit, run `pnpm bindgen`. Update mocks. Do not hand-edit `backend.ts`. Do not deploy `backend_extended`.
AUTONOMY: HUMAN — bindgen + live DID
DEPENDENCIES: None
REGRESSION_RISK: HIGH if frontend + actor ship out of sync (same class as 12- vs 15-field CharacterStats)
VALIDATION_REQUIRED: `pnpm bindgen`; `adminSetSpellConfig` of a summon seed round-trips `isSummon`; `getAdminAuditLog` exists on the generated client; `isCallerAdmin` either exists in `main.mo` or is removed from bindgen.
STATUS: NEW

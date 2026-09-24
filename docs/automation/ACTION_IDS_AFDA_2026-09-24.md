# ACTION_IDs — 2026-09-24 Admin Feature & Drift Auditor

Durable ledger. Reuses AFDA-2026-08-31-* / AFDA-2026-09-01-020 / AFDA-2026-09-02-* / AFDA-2026-09-21-* / AFDA-2026-09-22-* / AFDA-2026-09-23-* for the same underlying problems.

SOURCE_AUTOMATION: Admin Feature & Drift Auditor

Do not delete admin CRUD because a tab looks unused. Prove obsolescence first.

HEAD `0f5363f` (origin/main). Open AdminDashboard siblings (oldest first): #334 Tiers leftover, #341/#413/#470 built-in spell Retire, #415 computeAITier / Ground Doka / live feats / boss schema, #457 Names live + Shop leftover ShopPackage. This run does **not** restack those hunks. Unique honesty: Visuals palette unused-by-renderer.

Did not edit WorldExploration (Death Realm fallback `maxLevel: 5` remains; older open PRs overlap that file). Did not add a summon editor or wire bosses to the canister.

Visual fallback unchanged: empty sprite URL keeps Default Pixel Visual; no `ctx.drawImage` in `src/`.

---

ACTION_ID: AFDA-2026-08-31-001
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Spell admin writes used frontend `hitsMultiple` and omitted Candid `cooldown` / `multiTarget`
CATEGORY: BROKEN
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: Adapter still in `adminContract.ts` `toBackendSpellConfig` / `fromBackendSpellConfig`. Bindgen `SpellConfig` (`backend.ts` 118–152) includes summon fields plus `multiTarget`, `hitsAllies`, `cooldown`. Combat still reads `hitsMultiple`. Frontend-only mechanic flags still drop (018). Spells CatalogNote `AdminDashboard.tsx` 3640–3645.
SYSTEMS_AFFECTED: Admin Spells tab; `adminSetSpellConfig`; player/enemy cast targeting
CURRENT_BEHAVIOUR: Cooldown and multi-target round-trip via adapter. Summon metadata round-trips if present. Mechanic flags still drop.
AUTHORITATIVE_BEHAVIOUR: One wire name (`multiTarget`); hydrate maps to `hitsMultiple`. Persist or hide frontend-only flags.
RECOMMENDED_ACTION: Keep the adapter. Persist `targetType` / mechanic flags or stop editing them (018). Add summon editor (022).
AUTONOMY: HUMAN — remaining work is a schema decision
DEPENDENCIES: AFDA-2026-08-31-018; AFDA-2026-09-02-022
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
EVIDENCE: `useBossQueries.ts` and `useAdminQueries.ts` 508–557 still read/write `localStorage.pbv_boss_configs`. `WorldExploration.tsx` 6486 loads the same key. `main.mo` still has `setBossConfig`, `deleteBossConfig`, `getAllBossConfigs`. Frontend `BossConfig` (`bossTypes.ts`) has `iconEmoji`, `loreText`, `chc`; Motoko (`admin.mo` 317–330) has `defeated`, `adminNotes`, no `chc`. Main Bosses intro still says “until a backend writer exists” (`AdminDashboard.tsx` ~7837–7839); honest schema copy is queued in #415. Canister seed uses retired spell ids (025).
SYSTEMS_AFFECTED: Admin Bosses tab; boss portals; Boss Rush kits
CURRENT_BEHAVIOUR: Admin edits are browser-local. Canister boss maps stay empty unless written elsewhere.
AUTHORITATIVE_BEHAVIOUR: Backend-authoritative configs; localStorage cache only.
RECOMMENDED_ACTION: Unify schemas, then wire hooks to `getAllBossConfigs` / `setBossConfig`. Do not delete the local fallback until a live canister read succeeds.
AUTONOMY: HUMAN — schema merge
DEPENDENCIES: AFDA-2026-09-21-025
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
EVIDENCE: Settings shows all nine inputs and save uses `toBackendLevelUpConfig`. Frontend `LevelUpConfig` (`gameTypes.ts`) still uses `apMpGrowthEveryNLevels` and omits `spellLevelingBaseCost` / multiplier / `spellDmgGrowthPercent`. `WorldExploration.tsx` 2309 still reads only `pbv_levelup_config`, never `getLevelUpConfig()`. `upgradeSpell` uses canister `spellLevelingBaseCost`. Panel copy at `AdminDashboard.tsx` 4453–4457 still states this.
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
CATEGORY: LEGACY
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Live player shop is GameKey (`DokaGameKeyShop.tsx`). Admin Shop CatalogNote on main still omits leftover `ShopPackage` CRUD / `initiatePurchase` (`AdminDashboard.tsx` 6915–6919); that sentence is queued in #457. Canister still has `adminSetShopPackage` / `adminDeleteShopPackage` / `getShopPackages` / `initiatePurchase`. Do not delete until a deployed DID prove-out.
SYSTEMS_AFFECTED: Economy; Doka shop; admin Shop tab
CURRENT_BEHAVIOUR: Players request any euro amount, admin approves a GameKey, player redeems. Package catalog is unused by UI.
AUTHORITATIVE_BEHAVIOUR: Live IAP is GameKey. Leftover ShopPackage methods are legacy until removed after prove-out.
RECOMMENDED_ACTION: Keep GameKey path. Do not build package CRUD. Do not delete canister methods without DID confirmation.
AUTONOMY: HUMAN — payment policy
DEPENDENCIES: None
REGRESSION_RISK: HIGH if live catalog methods are removed while an old client still calls them
VALIDATION_REQUIRED: Player GameKey request appears on Purchases; redeem credits Doka through persist lock.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-08-31-005
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Purchases tab called non-existent `getPurchaseRecords`
CATEGORY: BROKEN
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Admin Purchases tab renders `AdminGameKeyPurchases` using `adminListGameKeyRequests` / approve / reject / reveal / emailed. `useGetPurchaseRecords` still has no dashboard caller.
SYSTEMS_AFFECTED: Admin Purchases tab
CURRENT_BEHAVIOUR: Operators approve/reject GameKey requests.
AUTHORITATIVE_BEHAVIOUR: Admin list uses GameKey request APIs.
RECOMMENDED_ACTION: Keep GameKey Purchases tab. Leave `getPurchases` hook until prove-out; do not delete.
AUTONOMY: IMPLEMENT
DEPENDENCIES: AFDA-2026-08-31-004
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After a GameKey request, Purchases shows email, status, approve/reveal.
STATUS: FIXED

---

ACTION_ID: AFDA-2026-08-31-006
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Admin enemy records are not consumed by encounter spawn
CATEGORY: MISLEADING
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `useGetEnemyConfigs` (`useSpellQueries.ts` 111–137) is admin-only. Spawn uses `pickEnemyLevelFromTiers` + `getEnemyBaseStats`. Admin `EnemyConfig` is hp/ap/mp/initStat/levelMin/levelMax/regions/spriteUrl — not `types/common.mo` combat template. WorldExploration has no `getEnemyConfigs` / `spriteUrl` reader. Enemies tab CatalogNote `AdminDashboard.tsx` 2117–2122. Enemy **names** from `getEnemyNames` ARE used at spawn (WX 2170, 5753–5804) — see 029. Do not delete CRUD.
SYSTEMS_AFFECTED: Enemies tab; encounters; player-relative tiers
CURRENT_BEHAVIOUR: Saving an enemy does not change overworld packs. Tiers tab does affect spawn. Names tab does affect labels.
AUTHORITATIVE_BEHAVIOUR: Either wire spawn to admin enemy templates (optional visual, default pixel) or keep the catalog-only label.
RECOMMENDED_ACTION: Keep CRUD. Prove no other caller before any delete. Optional spawn integration is a separate project (EBA-001).
AUTONOMY: HUMAN
DEPENDENCIES: AFDA-2026-08-31-013; AFDA-2026-09-23-029
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
EVIDENCE: Catalog is `DEFAULT_CHALLENGES` in `utils/challengeCompletion.ts` 44. AdminDashboard has zero challenge editors. Backend has no challenge config map.
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
EVIDENCE: Admin writes `room_N_enabled` / `room_N_reward` to localStorage `bossRushConfig` + `adminSetBossRushConfig`. `useBossRush.ts` 233–248 only applies `parsed.rewardMultiplier` into unused `_rewardMultiplier`. Admin JSON never writes `rewardMultiplier`. WX 948 caches the blob to `pbv_boss_rush_config` which nobody reads. Rooms come from `BOSS_RUSH_ROOMS` (room 9 `weeping_pawn_2`). Main CatalogNote still says “only parsed.rewardMultiplier is read” (`AdminDashboard.tsx` ~7141–7146); unused-state honesty is queued in #334/#415.
SYSTEMS_AFFECTED: Boss Rush; admin Boss Rush tab
CURRENT_BEHAVIOUR: Toggling a room off does not skip it. Reward `x` and parsed multiplier do not change `dokaReward`/`xpReward`.
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
EVIDENCE: Adapter still maps both directions (`adminContract.ts`). Motoko / bindgen use `frontWalkFrames`. Admin type uses `walkFramesFront`. WorldExploration still never reads `getPlayerSpriteConfigs` (017).
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
TITLE: Visuals palette persists but the world never paints from it
CATEGORY: MISLEADING
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Admin save still dual-writes `paperVertexPalette` and `pbv_color_palette` (`AdminDashboard.tsx` VisualsTab handleSave ~4733–4734). WX 936–941 caches `getColorPalette` into `pbv_color_palette` only. Grep of `src/frontend/src` finds **no reader** of either key except the Visuals editor itself. Map walls pick from hardcoded `WALL_PALETTES` (WX 5174–5191). Intro previously claimed landscape control; this run replaced that copy and added a CatalogNote (`AdminDashboard.tsx` 4774–4794).
SYSTEMS_AFFECTED: Visuals tab; paper-vertex / wall colors
CURRENT_BEHAVIOUR: Operators can save colors. The canister and two localStorage keys update. Play still uses hardcoded wall palettes. Custom artwork is not required.
AUTHORITATIVE_BEHAVIOUR: Either wire wall / paper-vertex colors to the stored palette, or keep the catalog-only label. Single cache key if a renderer is added.
RECOMMENDED_ACTION: Keep CRUD. Do not delete `adminSetColorPalette`. Drop `paperVertexPalette` only after a version-gate cycle if a reader is added. Do not require custom art.
AUTONOMY: IMPLEMENT for copy (this run). HUMAN for wiring a renderer.
DEPENDENCIES: None
REGRESSION_RISK: LOW for honesty; MEDIUM if wall colors are swapped without a map playtest
VALIDATION_REQUIRED: Save a crimson palette; generate maps; walls still come from WALL_PALETTES unless a renderer is wired.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-08-31-011
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Finite-level defaults and copy contradict “no player level cap”
CATEGORY: MISLEADING
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: New enemy/region `levelMax` defaults to 9999 (`AdminDashboard.tsx` 138–157). Fail-chance help does not treat 200 as a ceiling. Primary Death Realm is `maxLevel: 9999` (WX 5439). Generation-failure fallbacks still use `maxLevel: 5` (WX 13514, 13646). `pickEnemyLevelFromTiers` caps at `floor(999 / tierSize)` (`combatMath.ts` 58). Motoko comment still says fail reaches 0 at 200 (`types/admin.mo` 148). This run did not edit WorldExploration.
SYSTEMS_AFFECTED: Regions; enemies; spell fail; Death Realm; player-relative spawn
CURRENT_BEHAVIOUR: New admin drafts no longer seed a 1–5 career band. Fallback Death Realm HUD can still show 1–5. Spawn math still stops climbing after level 999.
AUTHORITATIVE_BEHAVIOUR: No player level cap. `levelMax` on templates is a band, not a career ceiling. Death Realm fallbacks must not use maxLevel 5.
RECOMMENDED_ACTION: Align Death Realm fallback zones to 9999 (do not edit mapGen). Lift or document the 999 spawn band (EBA-003). Treat existing region max=5 as content, not a product cap.
AUTONOMY: IMPLEMENT for Death Realm fallback zone only when WorldExploration is not stacked under older PRs.
DEPENDENCIES: None
REGRESSION_RISK: MEDIUM if region matching becomes unbounded without a fallback
VALIDATION_REQUIRED: Level 20 character still gets a region (or an explicit “no region” state). Death Realm HUD does not show 1–5 after a generation failure.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-08-31-012
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Backend/game systems with no admin management
CATEGORY: MISSING
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Present in actor or live game, absent from AdminDashboard tabs: dungeon records; buff catalog (`getBuffCatalog` / `purchaseBuff` / `useBuffItem` — live Items UI uses `BuffShop.BUFF_ITEMS` + `${principal}_inventory`, no `getBuffCatalog` caller); `setAppVersion` / `setChangelog`; `setBossPortalAssignment` (hook is a no-op, `useAdminQueries.ts` 559–575); `getAllCharacters`; enemy AI / `ENEMY_KITS`; variants; telemetry (`longHorizonSim.ts` `telemetry.available: false`); `getAdminAuditLog` (bindgen, no UI); five `adminRollback*` methods (no UI); `getEnemyHPForLevel` (no frontend caller). Ban list lives on Shop (`getBannedPrincipals`). Challenges (007). Spell discovery `minLevel` (014). Settings CatalogNote on main still lists ban list as having no editor on that tab (`AdminDashboard.tsx` 4230–4234); Shop has the list. Ground Doka / leaderBoost live on Map Modifiers (`getGameConfig`).
SYSTEMS_AFFECTED: Dungeons; economy/buffs; ops; portals; AI; telemetry
CURRENT_BEHAVIOUR: Operators cannot tune these from the dashboard. Ban list is on Shop.
AUTHORITATIVE_BEHAVIOUR: Admin covers every persisted config map. Code-owned systems should be labeled as such.
RECOMMENDED_ACTION: Add only configs that already have canister CRUD (version, changelog, portal assignments, audit log, rollback). Do not invent telemetry. Do not delete unused buff canister methods without a DID prove-out.
AUTONOMY: HUMAN — pick which surfaces
DEPENDENCIES: AFDA-2026-08-31-004; AFDA-2026-09-01-020
REGRESSION_RISK: LOW for read-only ops panels
VALIDATION_REQUIRED: Per surface
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-08-31-013
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Custom enemy artwork is optional; admin `spriteUrl` is unused
CATEGORY: VISUAL_FALLBACK
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Enemy editor labels Default Pixel Visual (`adminVisualStatus.ts`). No `spriteUrl` / `drawImage` reader in WorldExploration. New enemies/bosses render from piece/family pixel patterns. Custom art is not mandatory. Enemies CatalogNote `AdminDashboard.tsx` 2117–2122. Visuals CatalogNote this run restates the same fallback.
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
EVIDENCE: `ownedSpells` hydrates via `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–719: `usableByPlayer` or already owned). Still no `minLevel` check. Admin still edits `minLevel`. Spells CatalogNote `AdminDashboard.tsx` 3640–3645.
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
EVIDENCE: Shop, Ads, and Boss Rush still use `C` tokens and carved-stone gradients. No `bg-gray-800` leftover on those tabs.
SYSTEMS_AFFECTED: Admin Shop / Ads / Boss Rush
CURRENT_BEHAVIOUR: Those tabs match Enemies/Spells chrome.
AUTHORITATIVE_BEHAVIOUR: Ankama/Dofus carved-stone, dark slate, crimson accents.
RECOMMENDED_ACTION: None. Keep tokens if those tabs are restyled later.
AUTONOMY: IMPLEMENT
DEPENDENCIES: None
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Visual compare against Enemies tab.
STATUS: FIXED

---

ACTION_ID: AFDA-2026-08-31-016
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Admin modifier type list drifted from the live engine registry
CATEGORY: OUTDATED
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Dropdown is built from `listAdminModifierTypeOptions()` (`mapModifiers.ts`). Live registry still has 22 ids (`MAP_MODIFIERS`). Legacy `lava_fields` / `ice_fields` / `spike_pit` / `custom` remain selectable. Motoko `defaultMapModifiers` (`admin.mo` 136–154) still seeds only slime_flood / paper_windstorm.
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
EVIDENCE: `getPlayerSpriteConfigs` is admin-only. WorldExploration has no `playerSprite` / `frontUrl` usage; player draw uses chess-piece pixels. Tab CatalogNote `AdminDashboard.tsx` 1783–1787. Custom art is not mandatory.
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
EVIDENCE: Editor writes `isSwap`, `isMirror`, `isTimestep`, `isSacrifice`, `isBarrier`, `isTrap`, `isMark`, buff/debuff/DoT numbers, `isDotSpell`, `dotType`. Motoko `SpellConfig` (`admin.mo` 92–127) has summon fields + cooldown but still lacks those mechanic flags. Bindgen matches Motoko. `toBackendSpellConfig` cannot persist what Candid does not encode. Spells CatalogNote `AdminDashboard.tsx` 3640–3645.
SYSTEMS_AFFECTED: Spells
CURRENT_BEHAVIOUR: Toggling Barrier on an admin spell does not persist. Reloading loses the flag.
AUTHORITATIVE_BEHAVIOUR: Either extend Motoko SpellConfig / `effectParams` JSON, or remove the toggles.
RECOMMENDED_ACTION: Persist via `effectParams` (already optional Text) without a Motoko schema break, or extend the record and regenerate bindgen.
AUTONOMY: HUMAN
DEPENDENCIES: AFDA-2026-08-31-001; AFDA-2026-09-02-022
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
EVIDENCE: `useAssignUserRole` (`useAdminQueries.ts` 84–111) calls `assignUserRole(Principal, role: Text)` and `assertAdminCmdOk`. `main.mo` implements `assignUserRole`. Bindgen still also lists mixin `assignCallerUserRole` / `isCallerAdmin` which are **not** in `src/backend/main.mo`. App.tsx admin gate uses `getUserRole`, not `isCallerAdmin`. `useIsCallerAdmin` is defined and never called.
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
EVIDENCE: Motoko `SpellConfig` (`admin.mo` 92–127) requires summon fields + `cooldown`. Generated `backend.ts` includes that block. `getAdminAuditLog` exists on `main.mo` and `backend.ts`. Remaining: bindgen lists `isCallerAdmin` / `assignCallerUserRole` (`backend.ts` 709, 1042) which are absent from `main.mo`. README says do not hand-edit bindgen; regenerate with `pnpm bindgen`.
SYSTEMS_AFFECTED: `adminSetSpellConfig`; audit log; admin auth probes; mocks
CURRENT_BEHAVIOUR: Admin spell save can encode summon metadata. Audit log is callable through generated client but has no dashboard UI. Mixin methods remain on Candid. `useIsCallerAdmin` is dead.
AUTHORITATIVE_BEHAVIOUR: Bindgen matches canonical `src/backend/main.mo`. Extra mixin methods are not treated as the live actor.
RECOMMENDED_ACTION: After a source-faithful Candid emit, run `pnpm bindgen`. Update mocks. Do not hand-edit `backend.ts`. Do not deploy `backend_extended`.
AUTONOMY: HUMAN — bindgen + live DID
DEPENDENCIES: None
REGRESSION_RISK: HIGH if frontend + actor ship out of sync (same class as 12- vs 15-field CharacterStats)
VALIDATION_REQUIRED: `pnpm bindgen`; `adminSetSpellConfig` of a summon seed round-trips `isSummon`; `getAdminAuditLog` exists on the generated client; `isCallerAdmin` either exists in `main.mo` or is removed from bindgen.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-09-02-021
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Map modifier global/second-roll fields are edited in admin but are not on Candid
CATEGORY: IGNORED_FIELDS
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: Frontend `MapModifierConfig` (`gameTypes.ts`) has optional `globalTriggerChance` / `secondModifierChance`. Editor still writes them (`AdminDashboard.tsx` ~5072–5094). Motoko / bindgen `MapModifierConfig` (`admin.mo` 173–180) only has `id/name/description/modifierType/active/triggerChance`. Engine `rollActiveModifiers` reads extras and falls back to defaults 20 / 50. Modifiers CatalogNote `AdminDashboard.tsx` 6194–6198.
SYSTEMS_AFFECTED: Map Modifiers tab; portal modifier rolls
CURRENT_BEHAVIOUR: Operators can type global/second percents. Save persists `triggerChance` + `active` only. Reload resets extras to defaults. Engine uses 20/50 unless a hydrated in-memory object still has extras.
AUTHORITATIVE_BEHAVIOUR: Either extend Motoko MapModifierConfig and regenerate bindgen, or stop showing fields that cannot persist.
RECOMMENDED_ACTION: Do not delete the roll logic. Persist the two extra Nats or hide the inputs.
AUTONOMY: HUMAN — schema vs hide
DEPENDENCIES: AFDA-2026-08-31-016
REGRESSION_RISK: MEDIUM if Motoko is extended without a migration for existing rows
VALIDATION_REQUIRED: Set global trigger 80; save; refetch; confirm the value is gone unless schema is extended.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-02-022
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Spell summon metadata is on Motoko/bindgen but the Spells editor has no summon controls
CATEGORY: MISSING
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `newSpell()` seeds `isSummon`/`summonAI`/`summonLifespan`/`summonUnitDef` (`AdminDashboard.tsx` 131–134). Save validates those fields and `toBackendSpellConfig` encodes them. Combat `spellEngine.ts` / `summonSpawn.ts` read `spell.isSummon` + `summonUnitDef`. Spell editor has no checkbox/inputs for summon. Spell type dropdown is damage/heal/drain only (no `summon`). Operators cannot create a summon spell from the UI.
SYSTEMS_AFFECTED: Spells; summons; enemy kits
CURRENT_BEHAVIOUR: New drafts save as non-summon. Existing summon rows round-trip if already on the canister, but cannot be edited as summons in admin.
AUTHORITATIVE_BEHAVIOUR: If summon fields stay on SpellConfig, admin must expose them. New summons must work with default pixel visual (013).
RECOMMENDED_ACTION: Add a gated summon block (isSummon, AI archetype, lifespan, unit def). Do not infer from spell name.
AUTONOMY: HUMAN — editor + validation
DEPENDENCIES: AFDA-2026-08-31-001; AFDA-2026-08-31-018
REGRESSION_RISK: MEDIUM if a bad unitDef ships
VALIDATION_REQUIRED: Create a hunter summon in admin; cast in combat; default pixel unit appears; lifespan ticks down.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-02-023
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Region battleEffects and backgroundColor persist but the world discards the match
CATEGORY: MISLEADING
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Regions CatalogNote `AdminDashboard.tsx` 2345–2350. WX hydrates region configs and matches level, then discards battleEffects / backgroundColor. Do not delete CRUD.
SYSTEMS_AFFECTED: Regions tab; world presentation
CURRENT_BEHAVIOUR: Operators can add lava/buff “effects” that never apply. Level bands still exclude players above `levelMax` from even the discarded match.
AUTHORITATIVE_BEHAVIOUR: Either apply region effects/background, or keep the catalog-only label. `levelMax` remains an eligibility band, not a career cap.
RECOMMENDED_ACTION: Keep CRUD. Wire effects only with an explicit combat design. Do not treat unused as license to delete.
AUTONOMY: HUMAN
DEPENDENCIES: AFDA-2026-08-31-011
REGRESSION_RISK: HIGH if battleEffects are applied without a combat spec
VALIDATION_REQUIRED: Grep-confirmed region effects unused; optional HUD/background playtest if wired later.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-02-024
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Level-up Settings intro claimed only range/fail were editable
CATEGORY: MISLEADING
PRIORITY: P3
CONFIDENCE: HIGH
EVIDENCE: Panel has all nine inputs. Intro copy already matches (`AdminDashboard.tsx` ~4453).
SYSTEMS_AFFECTED: Settings tab
CURRENT_BEHAVIOUR: Copy matches the nine visible fields.
AUTHORITATIVE_BEHAVIOUR: Admin copy must match the live form and the canister payload.
RECOMMENDED_ACTION: None beyond prior honesty fix. Remaining live-game hydrate is 003.
AUTONOMY: IMPLEMENT
DEPENDENCIES: AFDA-2026-08-31-003
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Settings → Spell System Config intro mentions all nine fields.
STATUS: FIXED

---

ACTION_ID: AFDA-2026-09-21-025
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Canister defaultBossConfigs spell pools reference retired spell ids
CATEGORY: OUTDATED
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: `AdminLib.defaultBossConfigs()` (`admin.mo` 350–568) seeds `fireball`, `cursed_gust`, `entangle`, `mist_form`, `blood_nova`, `obliterate`, `ice_shard`, `frost_nova`, `poison_dart`, `plague_wave`, `inferno`, `meteor_strike`, `drain_life`. `main.mo` 688–698 purges those ids from `spellConfigs` on every start. Remaining default catalog ids include `shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`. Frontend bosses still use `DEFAULT_BOSS_CONFIGS` / localStorage (002), so this is latent until canister bosses are wired.
SYSTEMS_AFFECTED: Boss configs; spell pools; Bosses tab
CURRENT_BEHAVIOUR: Fresh canister boss rows would resolve many phase spells to missing ids.
AUTHORITATIVE_BEHAVIOUR: Seeded `spellPoolIds` must exist in `defaultSpells()` / live catalog. New bosses must function with default pixel visual (013).
RECOMMENDED_ACTION: When 002 is wired, retarget seed pools to current spell ids. Do not delete boss CRUD. Do not infer kits from boss name.
AUTONOMY: HUMAN — depends on 002 schema merge
DEPENDENCIES: AFDA-2026-08-31-002
REGRESSION_RISK: HIGH if canister bosses go live with empty kits
VALIDATION_REQUIRED: After wiring, Pale Archbishop phase 1 casts three catalog spells that exist.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-21-026
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Tiers tab required percents to sum to 100 and hid the live leftover ±3+ rule
CATEGORY: MISLEADING
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Canister default is 60/20/10/5 = 95 (`main.mo` 1710–1718). `validateTierSpawnConfig` does not require sum 100 (`adminGuard.mo` 241–261). `pickEnemyLevelFromTiers` (`combatMath.ts` 72–98) spends same/adj/twoAway and puts leftover into ±3+; `threeOrMorePercent` is unused (`_threeMore`). `levelVarianceChance` is rolled at 15% and is not on Candid. Main Tiers tab still requires total === 100 (`AdminDashboard.tsx` 3834, 3842–3844). Honesty + leftover preview is queued in #334/#415.
SYSTEMS_AFFECTED: Enemy Tiers tab; player-relative spawn
CURRENT_BEHAVIOUR: Operators cannot save the live 95 default. Spawn math already leftover-fills ±3+.
AUTHORITATIVE_BEHAVIOUR: Admin must be able to save the canister default. Copy must not claim a 100% requirement the engine does not enforce.
RECOMMENDED_ACTION: Keep leftover fill. Either persist `levelVarianceChance` or leave it code-owned. Do not treat the 999 tier index as a player cap (011).
AUTONOMY: IMPLEMENT for copy/save-gate only
DEPENDENCIES: AFDA-2026-08-31-011
REGRESSION_RISK: LOW for honesty; HIGH if spawn weights are rewritten
VALIDATION_REQUIRED: Open Tiers on a fresh canister; Save succeeds without editing percents; world still rolls leftover into ±3+.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-22-027
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: computeAITier uses finite level bands that admin cannot edit
CATEGORY: MISLEADING
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: `computeAITier` (`combatMath.ts` 36–51) maps enemy level onto hard bands 10/30/60/100/150/250/400/600/900 then randomly re-rolls 1–10 at 30%. WorldExploration assigns `aiTier` at spawn. `ENEMY_KITS` stay code-owned. Tiers CatalogNote naming the bands is queued in #415. Not a player career cap.
SYSTEMS_AFFECTED: Enemy Tiers tab; AI kits; player-relative spawn
CURRENT_BEHAVIOUR: Operators can change spawn-tier percents. Kit-band thresholds stay in combatMath.
AUTHORITATIVE_BEHAVIOUR: No player level cap. AI kit bands are content thresholds, not a career ceiling. Admin copy must not imply Tiers edits kit selection.
RECOMMENDED_ACTION: Keep code-owned unless product wants kit-band CRUD. Do not treat 900 as a max player level.
AUTONOMY: IMPLEMENT for copy only
DEPENDENCIES: AFDA-2026-08-31-011; AFDA-2026-09-21-026
REGRESSION_RISK: HIGH if kit bands are moved into admin without a spawn playtest
VALIDATION_REQUIRED: Level 1000 enemy still receives a kit; admin Tiers save does not change computeAITier thresholds.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-22-028
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Achievements tab had no live-contract note while canister rows are consumed
CATEGORY: MISLEADING
PRIORITY: P3
CONFIDENCE: HIGH
EVIDENCE: `WorldExploration.tsx` 2166 and `AchievementsPanel.tsx` call `useGetAchievementConfigs`. Conditions are the closed `KNOWN_ACHIEVEMENT_CONDITIONS` list. Wallet/level feats defer until `applyRewards`. Main Achievements tab has no CatalogNote (`AdminDashboard.tsx` ~6615–6678). Copy is queued in #415. Challenges remain code-only (007).
SYSTEMS_AFFECTED: Achievements tab; recap unlocks
CURRENT_BEHAVIOUR: Saving an achievement with a known condition is live. Unknown conditions are rejected. Challenges still have no tab. Main admin copy does not say the rows are live.
AUTHORITATIVE_BEHAVIOUR: Admin copy must say which catalogs the world actually reads.
RECOMMENDED_ACTION: Keep CRUD. Do not treat level_10 as a career cap.
AUTONOMY: IMPLEMENT for copy only
DEPENDENCIES: AFDA-2026-08-31-007
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Save first_blood; world hydrate still lists it. Invented condition is rejected.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-23-029
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Enemy Names tab had no live-contract note while spawn consumes the pool
CATEGORY: MISLEADING
PRIORITY: P3
CONFIDENCE: HIGH
EVIDENCE: `WorldExploration.tsx` 2170 hydrates `useGetEnemyNames`; generateEnemies shuffles that pool and assigns unique names per map (5753–5804), falling back to `DEFAULT_ANCIENT_NAMES` (5667). Enemies tab is labeled catalog-only (006). Names subtitle only said “max 1 per enemy per map” (`AdminDashboard.tsx` 7318–7320). Live CatalogNote is queued in #457.
SYSTEMS_AFFECTED: Enemy Names tab; overworld spawn labels
CURRENT_BEHAVIOUR: Adding/deleting a name changes the next map’s labels. Empty pool uses the hardcoded fallback list. Main admin copy still does not say the pool is live.
AUTHORITATIVE_BEHAVIOUR: Admin copy must distinguish live name pool from unused enemy-config rows. Custom art is not required for named enemies (013).
RECOMMENDED_ACTION: Keep CRUD. Do not delete the name pool because Enemies catalog is unused.
AUTONOMY: IMPLEMENT for copy only
DEPENDENCIES: AFDA-2026-08-31-006
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Add a unique name in admin; generate a map; an enemy wears that label. Empty sprite URL still draws Default Pixel Visual.
STATUS: NEW

# ACTION_IDs — 2026-10-23 Admin Feature & Drift Auditor

Durable ledger. Reuses AFDA-2026-08-31-* / AFDA-2026-09-01-020 / AFDA-2026-09-02-* / AFDA-2026-09-21-* / AFDA-2026-09-22-* / AFDA-2026-09-23-* / AFDA-2026-09-25-* / AFDA-2026-09-27-031 / AFDA-2026-09-28-* / AFDA-2026-09-29-* / AFDA-2026-10-21-037 / AFDA-2026-10-21-038 / AFDA-2026-10-22-039 for the same underlying problems. New ACTION_IDs this run: AFDA-2026-10-23-040 (Motoko spell catalog replaces enemy kit pool) and AFDA-2026-10-23-041 (`getEnemyHPForLevel` unused / formula drift).

SOURCE_AUTOMATION: Admin Feature & Drift Auditor

Do not delete admin CRUD because a tab looks unused. Prove obsolescence first.

HEAD `0f5363f` (origin/main), identical to the 2026-09-21–10-22 AFDA baselines. Open AdminDashboard siblings (oldest first): #334 live 95% tiers, #341 built-in spell delete, #413 retired spells, #415 Tiers leftover / feats / boss schema / computeAITier, #457 Names live + Shop leftover ShopPackage, #470 name-pool / Boss Rush confirm, #531 Visuals unused palette, #539 live-publish confirms, #564 summon editor, #585 Ground Doka + Ads (incorrectly calls `leaderBoostPercent` live). Motoko type comments queued in #620. Last-live / last-seeded map-modifier guards queued in #626 / #650 / #733. GameKey approve busy-lock queued in #664. Last-live achievement catalog guard queued in #733. usePanelLayout bindgen JSDoc queued in #741. combatMath levelVarianceChance comment queued in #780. #818 (useBossQueries kits comment + 037/038) and #887 (`gameTypes.ts` leaderBoost honesty + 039 ledger) are still open. This run does **not** restack those hunks.

Did not edit WorldExploration (Death Realm fallback `maxLevel: 5` remains). Did not add a summon editor or wire bosses to the canister. Did not restack AdminDashboard, `useAdminQueries.ts`, `useSpellQueries.ts`, `useBossQueries.ts`, `types/admin.mo`, `combatMath.ts`, `usePanelLayout.ts`, or `gameTypes.ts`.

Visual fallback unchanged: empty sprite URL keeps Default Pixel Visual; no `ctx.drawImage` in `src/`. Custom art is not required. New enemies/bosses still function with generated chess-piece pixels.

Tiny honesty this run: `progression.ts` documents that Motoko `getEnemyHPForLevel` is unused by live HP (041). Did not restack `useSpellQueries.ts` (#818) for the replace-pool note (040).

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
RECOMMENDED_ACTION: Keep the adapter. Persist `targetType` / mechanic flags or stop editing them (018). Summon editor is queued in #564 (022).
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
EVIDENCE: `useBossQueries.ts` 1–31 and `useAdminQueries.ts` 508–557 still read/write `localStorage.pbv_boss_configs`. `WorldExploration.tsx` 6486 loads the same key. `main.mo` still has `setBossConfig`, `deleteBossConfig`, `getAllBossConfigs`. Frontend `BossConfig` (`bossTypes.ts` 91–110) has `iconEmoji`, `loreText`, `chc`; Motoko (`types/admin.mo` / bindgen) has `defeated`, `adminNotes`, no `chc`. Main Bosses intro still says browser-local drafts (`AdminDashboard.tsx` 7837). Honest schema copy is queued in #415. Canister seed uses retired spell ids (025). Live kits are `data/bossKits.ts` (038). #818 comment on live kits is still unmerged.
SYSTEMS_AFFECTED: Admin Bosses tab; boss portals; Boss Rush kits
CURRENT_BEHAVIOUR: Admin edits are browser-local. Canister boss maps stay empty unless written elsewhere.
AUTHORITATIVE_BEHAVIOUR: Backend-authoritative configs; localStorage cache only.
RECOMMENDED_ACTION: Unify schemas, then wire hooks to `getAllBossConfigs` / `setBossConfig`. Do not delete the local fallback until a live canister read succeeds.
AUTONOMY: HUMAN — schema merge
DEPENDENCIES: AFDA-2026-09-21-025; AFDA-2026-10-21-038
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
EVIDENCE: Settings shows all nine inputs and save uses `toBackendLevelUpConfig`. Frontend `LevelUpConfig` (`gameTypes.ts`) still uses `apMpGrowthEveryNLevels` and omits `spellLevelingBaseCost` / multiplier / `spellDmgGrowthPercent`. `WorldExploration.tsx` 2306–2315 still reads only `pbv_levelup_config`, never `getLevelUpConfig()`. `upgradeSpell` uses canister `spellLevelingBaseCost`. Panel copy at `AdminDashboard.tsx` 4453–4457 still states this. Same-browser admin save dual-writes localStorage so `calcEnemyMaxHp` can pick up `statGrowthPercent` locally (003 hydrate gap remains for other clients).
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
EVIDENCE: Live player shop is GameKey (`DokaGameKeyShop.tsx`; WX ~19203). Admin Shop tab states multi-tier packages are retired (`AdminDashboard.tsx` 6930–6935). Canister still has `adminSetShopPackage` / `adminDeleteShopPackage` / `getShopPackages` / `initiatePurchase` (`main.mo`; bindgen). `useGetShopPackages` / `useInitiatePurchase` / `useGetPurchaseRecords` have no AdminDashboard caller. Leftover-package CatalogNote is queued in #457. Do not delete until a deployed DID prove-out. Buff-item catalog is 037, not this ID.
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
EVIDENCE: Admin Purchases tab now renders `AdminGameKeyPurchases` using `adminListGameKeyRequests`. `useGetPurchaseRecords` still calls `getPurchases` with no dashboard caller. Approve confirm (`dokaGameKey.ts` `gameKeyApproveConfirmBody`) correctly says the wallet is not credited until redeem.
SYSTEMS_AFFECTED: Admin Purchases tab
CURRENT_BEHAVIOUR: Operators approve/reject GameKey requests. Legacy purchase-record hook is unused.
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
EVIDENCE: `useGetEnemyConfigs` is admin-only (`useSpellQueries.ts`; this run’s file comment). Spawn uses `pickEnemyLevelFromTiers` + `getEnemyBaseStats` + `buildEnemyKit` (`enemyAI.ts` 163–200). Admin `EnemyConfig` is hp/ap/mp/initStat/levelMin/levelMax/regions/spriteUrl — not `types/common.mo` combat template. WorldExploration has no `getEnemyConfigs` / `spriteUrl` reader. Enemies tab is labeled catalog-only (`AdminDashboard.tsx` 2117–2121). Enemy **names** from `getEnemyNames` are used at spawn (WX 2170, 5753). Kits ignore admin SpellConfig (038). Do not delete CRUD.
SYSTEMS_AFFECTED: Enemies tab; encounters; player-relative tiers; AI kits
CURRENT_BEHAVIOUR: Saving an enemy does not change overworld packs. Tiers tab does affect spawn. Names tab is live (029/035).
AUTHORITATIVE_BEHAVIOUR: Either wire spawn to admin enemy templates (optional visual, default pixel) or keep the catalog-only label.
RECOMMENDED_ACTION: Keep CRUD. Prove no other caller before any delete. Optional spawn integration is a separate project (EBA-001).
AUTONOMY: HUMAN
DEPENDENCIES: AFDA-2026-08-31-013; AFDA-2026-10-21-038
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
EVIDENCE: Catalog is `DEFAULT_CHALLENGES` in `utils/challengeCompletion.ts`. AdminDashboard has zero challenge editors. Backend has no challenge config map. Tabs (`AdminDashboard.tsx` 5611–5625) skip Challenges.
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
EVIDENCE: Admin writes `room_N_enabled` / `room_N_reward` to localStorage + `adminSetBossRushConfig`. Rooms come from `BOSS_RUSH_ROOMS` (`useBossRush.ts` 24–135; room 9 is `weeping_pawn_2`). `useBossRush.ts` 209–243 parses `rewardMultiplier` into `_rewardMultiplier` which is never returned or applied to `dokaReward`/`xpReward`. `completeBossRushRoom` ignores client reward args. CatalogNote (`AdminDashboard.tsx` 7141–7146) still says “only parsed.rewardMultiplier is read.” Confirm for live publish is queued in #470. Did not restack `useBossRush.ts`.
SYSTEMS_AFFECTED: Boss Rush; admin Boss Rush tab
CURRENT_BEHAVIOUR: Toggling a room off does not skip it. Reward `x` and `rewardMultiplier` do not change live grants. The JSON is loaded into unused state.
AUTHORITATIVE_BEHAVIOUR: Either consume the JSON (enable + multiplier) or replace the tab with a read-only view of `BOSS_RUSH_ROOMS`. Copy must not claim a field is “read” if it is discarded.
RECOMMENDED_ACTION: Do not invent a second room table. Wire or relabel. Prefer #470 for publish confirm; do not restack AdminDashboard here.
AUTONOMY: HUMAN
DEPENDENCIES: AFDA-2026-08-31-002
REGRESSION_RISK: HIGH if rooms are duplicated
VALIDATION_REQUIRED: Disable room 3 in admin; start a rush; confirm skip or confirm the control is labeled display-only. Set rewardMultiplier 2; room 0 grant stays 500/200.
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
EVIDENCE: Admin dual-writes `paperVertexPalette` and `pbv_color_palette` (`AdminDashboard.tsx` VisualsTab handleSave 4725–4734). World hydrates `getColorPalette` into `pbv_color_palette` (WX 936–941) then paints walls from hardcoded `WALL_PALETTES` (WX 5174–5191). Visuals intro still claims landscape control (`AdminDashboard.tsx` 4774–4776). Unused-palette honesty queued in #531.
SYSTEMS_AFFECTED: Visuals tab; paper-vertex landscape
CURRENT_BEHAVIOUR: Admin save updates both caches and the canister. Map walls ignore the stored palette.
AUTHORITATIVE_BEHAVIOUR: Single cache key matching world hydrate, or copy that the palette is unused.
RECOMMENDED_ACTION: Prefer #531 honesty. Drop `paperVertexPalette` after one version-gate cycle. Do not require custom art (013).
AUTONOMY: IMPLEMENT for copy — queued in #531
DEPENDENCIES: None
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Save palette in admin; reload world; vertex colors either match or copy says they will not.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-08-31-011
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Finite-level defaults and copy contradict “no player level cap”
CATEGORY: MISLEADING
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: New enemy/region `levelMax` defaults to 9999 (`AdminDashboard.tsx` 137–148). Fail-chance help does not treat 200 as a ceiling. Primary Death Realm is `maxLevel: 9999` (WX 5439). Generation-failure fallbacks still use `maxLevel: 5` (WX 13514, 13646). Region match still uses `level <= levelMax` then discards (WX 3662–3666). `pickEnemyLevelFromTiers` caps at `floor(999 / tierSize)` (`combatMath.ts` 58). `adminGuard.mo` 411 rejects spell `minLevel > 999`; hydrate ignores `minLevel` (014). Motoko comment still says fail reaches 0 at 200 (`types/admin.mo` 148). Dungeon spawn depth cap 5 is a dungeon band, not a career ceiling.
SYSTEMS_AFFECTED: Regions; enemies; spell fail; Death Realm; player-relative spawn
CURRENT_BEHAVIOUR: New admin drafts no longer seed a 1–5 career band. Fallback Death Realm HUD can still show 1–5. Spawn math still stops climbing after level 999. Spell minLevel 1000 is rejected at write, not at discovery.
AUTHORITATIVE_BEHAVIOUR: No player level cap. `levelMax` on templates is a band, not a career ceiling. Death Realm fallbacks must not use maxLevel 5.
RECOMMENDED_ACTION: Align Death Realm fallback zones to 9999 (do not edit mapGen). Lift or document the 999 spawn band (EBA-003). Treat existing region max=5 as content, not a product cap. Prefer #620 for the Motoko fail-at-200 comment.
AUTONOMY: IMPLEMENT for Death Realm fallback zone only. Do not touch mapGen / combat math in this auditor.
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
EVIDENCE: Present in actor or live game, absent from AdminDashboard tabs: dungeon records; buff catalog (037); `setAppVersion` / `setChangelog`; `getBannedPrincipals` list (ban/unban + read-only list exist on Shop, not Settings); `setBossPortalAssignment` (hook is a no-op, `useAdminQueries.ts` 559–575); `getAllCharacters`; enemy AI / `ENEMY_KITS` (038); variants / `spawnPolicy.ts` (`FAMILY_VARIANT_CHANCE` 0.3); formations; encounters; `worldFeatures.ts` (tests only); spell discovery routes; telemetry (`longHorizonSim.ts` `telemetry.available: false`); `getAdminAuditLog`; five `adminRollback*` methods; `getEnemyHPForLevel` (unused; live HP is WX `calcEnemyMaxHp`); `setShopPaymentLink`. Settings CatalogNote lists some of those gaps (`AdminDashboard.tsx` 4230–4234). Challenges (007). Leader-boost field exists but is ignored (039) — that is not a missing tab.
SYSTEMS_AFFECTED: Dungeons; economy/buffs; ops; portals; AI; telemetry
CURRENT_BEHAVIOUR: Operators cannot tune these from the dashboard.
AUTHORITATIVE_BEHAVIOUR: Admin covers every persisted config map. Code-owned systems should be labeled as such.
RECOMMENDED_ACTION: Add only configs that already have canister CRUD (version, changelog, ban list pointer, portal assignments, audit log, rollback). Do not invent telemetry. Do not add empty Challenges/AI/Formations/Dungeons tabs.
AUTONOMY: HUMAN — pick which surfaces
DEPENDENCIES: AFDA-2026-08-31-004; AFDA-2026-09-01-020; AFDA-2026-10-21-037; AFDA-2026-10-21-038
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
EVIDENCE: Enemy editor labels Default Pixel Visual (`adminVisualStatus.ts` 1–22). No `spriteUrl` / `drawImage` reader in WorldExploration. `src/` has no `ctx.drawImage`. `validateEnemyConfig` treats empty `spriteUrl` as valid. New enemies/bosses render from piece/family pixel patterns. Custom art is not mandatory.
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
EVIDENCE: `ownedSpells` (WX 2412–2440) unions `starterSpells` with `filteredBackendSpells` via `shouldIncludeBackendSpellInLibrary` (`usableByPlayer` or already owned). Still no `minLevel` check. Admin still edits `minLevel` (`AdminDashboard.tsx` 3141). Spells CatalogNote states that (3640–3645). Write gate `minLevel > 999` is 011. Innate ids are spellData, not Motoko defaultSpells (038). Spell editor ID placeholder is still `fireball` (retired id).
SYSTEMS_AFFECTED: Spells; spell discovery
CURRENT_BEHAVIOUR: Retired `usableByPlayer=false` spells stay out of new libraries. `minLevel` is ignored. Saving a player-usable spell still grants it to anyone who hydrates the catalog. Innate bar always includes `starterSpells`.
AUTHORITATIVE_BEHAVIOUR: `minLevel` gates discovery/equip if that field stays in admin. Catalog does not imply ownership (SDA-002). Innate bar stays code-owned until product says otherwise.
RECOMMENDED_ACTION: Enforce `minLevel` at hydrate, or hide the field. Do not treat the full catalog as owned. Prefer #564/#413 over restacking the `fireball` placeholder.
AUTONOMY: HUMAN
DEPENDENCIES: AFDA-2026-08-31-001; AFDA-2026-10-21-038
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
EVIDENCE: Shop, Ads (`AdBoxEditor`), and Boss Rush now use `C` tokens and carved-stone gradients. No `bg-gray-800` / `#ff4444` leftover on those tabs.
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
EVIDENCE: Dropdown is built from `listAdminModifierTypeOptions()` (`mapModifiers.ts`). Live registry has 22 ids. Legacy `lava_fields` / `ice_fields` / `spike_pit` / `custom` remain selectable. Motoko `MapModifierConfig` comment (`types/admin.mo` 167–171) still lists only slime_flood / paper_windstorm. CatalogNote `AdminDashboard.tsx` 6194–6198. Info box below still claims independent per-modifier rolls (6351–6355) while engine is two/three-roll (021).
SYSTEMS_AFFECTED: Map Modifiers tab; portal modifier rolls
CURRENT_BEHAVIOUR: Every registry id is selectable. Legacy hazard ids still save but have no engine hook.
AUTHORITATIVE_BEHAVIOUR: Dropdown equals `MAP_MODIFIERS` ids. Saved unknown ids remain visible.
RECOMMENDED_ACTION: Keep legacy options until no stored row uses them. Do not delete configs. Prefer #620 for the Motoko comment.
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
EVIDENCE: `getPlayerSpriteConfigs` is admin-only. WorldExploration has no `playerSprite` / `frontUrl` usage; player draw uses `chessPiecePatterns` / pixel patterns. Tab is labeled catalog-only (`AdminDashboard.tsx` 1783–1786). `validatePlayerSpriteConfig` allows empty facing URLs. Custom art is not mandatory.
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
EVIDENCE: Editor writes `isSwap`, `isMirror`, `isTimestep`, `isSacrifice`, `isBarrier`, `isTrap`, `isMark`, buff/debuff/DoT numbers, `isDotSpell`, `dotType`. Motoko `SpellConfig` (`types/admin.mo` 92–127) has summon fields + cooldown but still lacks those mechanic flags. Bindgen matches Motoko. `toBackendSpellConfig` cannot persist what Candid does not encode. Spells CatalogNote 3640–3645. Live innate spells in `spellData.ts` carry those flags in code (038).
SYSTEMS_AFFECTED: Spells
CURRENT_BEHAVIOUR: Toggling Barrier on an admin spell does not persist. Reloading loses the flag. Innate `starter-shield` / `spell-barrier` still work because they are code-owned.
AUTHORITATIVE_BEHAVIOUR: Either extend Motoko SpellConfig / `effectParams` JSON, or remove the toggles.
RECOMMENDED_ACTION: Persist via `effectParams` (already optional Text) without a Motoko schema break, or extend the record and regenerate bindgen.
AUTONOMY: HUMAN
DEPENDENCIES: AFDA-2026-08-31-001; AFDA-2026-09-02-022; AFDA-2026-10-21-038
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
EVIDENCE: `useAssignUserRole` (`useAdminQueries.ts` 92–98) calls `assignUserRole(Principal, role: Text)` and `assertAdminCmdOk`. `main.mo` implements `assignUserRole`. Bindgen still also lists mixin `assignCallerUserRole` / `isCallerAdmin` / `getCallerUserRole` which are **not** in `src/backend/main.mo`. App.tsx admin gate uses `getUserRole`, not `isCallerAdmin`. `useIsCallerAdmin` has zero callers outside its definition (031).
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
EVIDENCE: Motoko `SpellConfig` requires `isSummon`, `summonAI`, `summonLifespan`, `summonUnitDef`, `cooldown`. Generated `backend.ts` 118–152 includes that block. `getAdminAuditLog` exists on `main.mo` and `backend.ts`. Remaining: bindgen lists `isCallerAdmin` / `assignCallerUserRole` / `getCallerUserRole` which are absent from `main.mo`. `saveUserUiLayout` / `getUserUiLayout` ARE on bindgen despite `usePanelLayout.ts` JSDoc (033 / #741). README says do not hand-edit bindgen; regenerate with `pnpm bindgen`.
SYSTEMS_AFFECTED: `adminSetSpellConfig`; audit log; admin auth probes; mocks
CURRENT_BEHAVIOUR: Admin spell save can encode summon metadata. Audit log is callable through generated client but has no dashboard UI. Mixin methods remain on Candid.
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
EVIDENCE: Frontend `MapModifierConfig` (`gameTypes.ts`) has optional `globalTriggerChance` / `secondModifierChance`. Editor writes them (`AdminDashboard.tsx` ~5046–5078). Motoko / bindgen `MapModifierConfig` only has `id/name/description/modifierType/active/triggerChance`. Engine `rollActiveModifiers` is two/three-roll and falls back to defaults 20 / 50. CatalogNote 6194–6198 is honest; info box 6351–6355 still claims each modifier “independently rolls.”
SYSTEMS_AFFECTED: Map Modifiers tab; portal modifier rolls
CURRENT_BEHAVIOUR: Operators can type global/second percents. Save persists `triggerChance` + `active` only. Reload resets extras to defaults. Engine uses 20/50 unless a hydrated in-memory object still has extras.
AUTHORITATIVE_BEHAVIOUR: Either extend Motoko MapModifierConfig and regenerate bindgen, or stop showing fields that cannot persist. Copy must match the two/three-roll engine.
RECOMMENDED_ACTION: Do not delete the roll logic. Persist the two extra Nats or hide the inputs. Prefer existing Modifiers CatalogNote; do not restack the contradictory info box here.
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
EVIDENCE: `newSpell()` seeds `isSummon`/`summonAI`/`summonLifespan`/`summonUnitDef` (`AdminDashboard.tsx` 131–134). Save validates those fields (`adminSafety.ts`) and `toBackendSpellConfig` encodes them. Combat `spellEngine.ts` / `summonSpawn.ts` read `spell.isSummon` + `summonUnitDef`. Spell editor has no checkbox/inputs for summon (only seed + validate). Operators cannot create a summon spell from the UI. Editor queued in #564. Live summon ids live in `spellData.ts` (`summon-dire-wolf`…) not Motoko defaultSpells (038).
SYSTEMS_AFFECTED: Spells; summons; enemy kits
CURRENT_BEHAVIOUR: New drafts save as non-summon. Existing summon rows round-trip if already on the canister, but cannot be edited as summons in admin.
AUTHORITATIVE_BEHAVIOUR: If summon fields stay on SpellConfig, admin must expose them. New summons must work with default pixel visual (013).
RECOMMENDED_ACTION: Add a gated summon block (isSummon, AI archetype, lifespan, unit def). Do not infer from spell name. Prefer #564.
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
EVIDENCE: WX hydrates `useGetRegionConfigs` and matches `level >= levelMin && level <= levelMax`, then maps `battleEffects` to descriptions in `_currentRegionEffects` which has no other readers. `backgroundColor` has no WX reader. Regions tab CatalogNote (`AdminDashboard.tsx` 2345–2349). Do not delete CRUD.
SYSTEMS_AFFECTED: Regions tab; world presentation
CURRENT_BEHAVIOUR: Operators can add lava/buff “effects” that never apply. Level bands still exclude players above `levelMax` from even the discarded match.
AUTHORITATIVE_BEHAVIOUR: Either apply region effects/background, or keep the catalog-only label. `levelMax` remains an eligibility band, not a career cap.
RECOMMENDED_ACTION: Keep CRUD. Wire effects only with an explicit combat design. Do not treat unused as license to delete.
AUTONOMY: HUMAN
DEPENDENCIES: AFDA-2026-08-31-011
REGRESSION_RISK: HIGH if battleEffects are applied without a combat spec
VALIDATION_REQUIRED: Grep-confirmed `_currentRegionEffects` unused; optional HUD/background playtest if wired later.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-02-024
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Level-up Settings intro claimed only range/fail were editable
CATEGORY: MISLEADING
PRIORITY: P3
CONFIDENCE: HIGH
EVIDENCE: Panel already had all nine inputs. Intro now matches (`AdminDashboard.tsx` 4453–4457). Remaining live-game hydrate is 003.
SYSTEMS_AFFECTED: Settings tab
CURRENT_BEHAVIOUR: Copy matches the nine visible fields.
AUTHORITATIVE_BEHAVIOUR: Admin copy must match the live form and the canister payload.
RECOMMENDED_ACTION: None beyond this honesty fix. Remaining live-game hydrate is 003.
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
EVIDENCE: `AdminLib.defaultBossConfigs()` (`lib/admin.mo` 350–568) seeds `fireball`, `cursed_gust`, `entangle`, `mist_form`, `blood_nova`, `obliterate`, `ice_shard`, `frost_nova`, `poison_dart`, `plague_wave`, `inferno`, `meteor_strike`, `drain_life`. `defaultSpells()` comments say those ids were removed (`lib/admin.mo` 164–167). Remaining default catalog ids include `shadow_strike`…`void_collapse`. Live frontend bosses use `DEFAULT_BOSS_CONFIGS` + `data/bossKits.ts` (spellData ids). Spell editor ID placeholder is still `fireball`. Frontend bosses still use localStorage (002), so canister seed is latent until wired.
SYSTEMS_AFFECTED: Boss configs; spell pools; Bosses tab
CURRENT_BEHAVIOUR: Fresh canister boss rows would resolve many phase spells to missing ids. Live localStorage bosses use `bossKits.ts`.
AUTHORITATIVE_BEHAVIOUR: Seeded `spellPoolIds` must exist in the catalog the combat resolver actually reads. New bosses must function with default pixel visual (013).
RECOMMENDED_ACTION: When 002 is wired, retarget seed pools to current spell ids (spellData or Motoko — pick one namespace, 038). Do not delete boss CRUD. Do not infer kits from boss name.
AUTONOMY: HUMAN — depends on 002 schema merge
DEPENDENCIES: AFDA-2026-08-31-002; AFDA-2026-10-21-038
REGRESSION_RISK: HIGH if canister bosses go live with empty kits
VALIDATION_REQUIRED: After wiring, Pale Archbishop phase 1 casts three catalog spells that exist.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-09-21-026
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Tiers tab required percents to sum to 100 and hid the live leftover ±3+ rule
CATEGORY: MISLEADING
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: Canister default is 60/20/10/5 = 95 (`main.mo`). Motoko comment says values need not sum to 100 (`types/admin.mo` TierSpawnConfig). `validateTierSpawnConfig` does not require sum 100 (`adminGuard.mo`). `pickEnemyLevelFromTiers` (`combatMath.ts` 73–100) spends same/adj/twoAway and puts leftover into ±3+; `threeOrMorePercent` is unused (`_threeMore`). `levelVarianceChance` is rolled at 15% and is not on Candid (036). Main Tiers tab still requires total === 100 (`AdminDashboard.tsx` 3829–3844, 3928). Honesty + leftover preview is queued in #415.
SYSTEMS_AFFECTED: Enemy Tiers tab; player-relative spawn
CURRENT_BEHAVIOUR: Operators cannot save the live 95 default. Spawn math already leftover-fills ±3+.
AUTHORITATIVE_BEHAVIOUR: Admin must be able to save the canister default. Copy must not claim a 100% requirement the engine does not enforce.
RECOMMENDED_ACTION: Keep leftover fill. Either persist `levelVarianceChance` or leave it code-owned (036). Do not treat the 999 tier index as a player cap (011). Prefer #415.
AUTONOMY: IMPLEMENT for copy/save-gate only — queued in #415
DEPENDENCIES: AFDA-2026-08-31-011; AFDA-2026-09-29-036
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
EVIDENCE: `computeAITier` (`combatMath.ts` 36–51) maps enemy level onto hard bands 10/30/60/100/150/250/400/600/900 then randomly re-rolls 1–10 at 30%. WorldExploration assigns `aiTier` at spawn. `ENEMY_KITS` stay code-owned (038). Tiers CatalogNote naming the bands is queued in #415. Not a player career cap.
SYSTEMS_AFFECTED: Enemy Tiers tab; AI kits; player-relative spawn
CURRENT_BEHAVIOUR: Operators can change spawn-tier percents. Kit-band thresholds stay in combatMath.
AUTHORITATIVE_BEHAVIOUR: No player level cap. AI kit bands are content thresholds, not a career ceiling. Admin copy must not imply Tiers edits kit selection.
RECOMMENDED_ACTION: Keep code-owned unless product wants kit-band CRUD. Do not treat 900 as a max player level.
AUTONOMY: IMPLEMENT for copy only — queued in #415
DEPENDENCIES: AFDA-2026-08-31-011; AFDA-2026-09-21-026; AFDA-2026-10-21-038
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
EVIDENCE: `WorldExploration.tsx` and `AchievementsPanel.tsx` call `useGetAchievementConfigs`. Conditions are the closed `KNOWN_ACHIEVEMENT_CONDITIONS` list. Wallet/level feats defer until `applyRewards`. Main Achievements tab has no CatalogNote (`AdminDashboard.tsx` ~6626–6678) and the tab label is still “Achievements” while player chrome is Feats. Copy is queued in #415. Challenges remain code-only (007). Last-live delete is 034 / #733.
SYSTEMS_AFFECTED: Achievements tab; recap unlocks
CURRENT_BEHAVIOUR: Saving an achievement with a known condition is live. Unknown conditions are rejected. Challenges still have no tab. Main admin copy does not say the rows are live.
AUTHORITATIVE_BEHAVIOUR: Admin copy must say which catalogs the world actually reads.
RECOMMENDED_ACTION: Keep CRUD. Do not treat level_10 as a career cap.
AUTONOMY: IMPLEMENT for copy only — queued in #415
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
EVIDENCE: WorldExploration hydrates `useGetEnemyNames`; generateEnemies assigns unique names per map, falling back to `DEFAULT_ANCIENT_NAMES` only when the query array is empty (WX 5753–5806). Enemies tab is labeled catalog-only (006). Names subtitle only said “max 1 per enemy per map” (`AdminDashboard.tsx` 7319). Live CatalogNote is queued in #457. Empty **stored** pool is not empty on the wire (035).
SYSTEMS_AFFECTED: Enemy Names tab; overworld spawn labels
CURRENT_BEHAVIOUR: Adding/deleting a stored name changes the next map’s labels. Main admin copy still does not say the pool is live.
AUTHORITATIVE_BEHAVIOUR: Admin copy must distinguish live name pool from unused enemy-config rows. Custom art is not required for named enemies (013).
RECOMMENDED_ACTION: Keep CRUD. Do not delete the name pool because Enemies catalog is unused. Prefer #457. See 035 for the query-default replace trap.
AUTONOMY: IMPLEMENT for copy only — queued in #457
DEPENDENCIES: AFDA-2026-08-31-006; AFDA-2026-09-29-035
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Add a unique name in admin; generate a map; an enemy wears that label. Empty sprite URL still draws Default Pixel Visual.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-25-030
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Ads tab had no live-contract note while LandingPage consumes getAdBoxes
CATEGORY: MISLEADING
PRIORITY: P3
CONFIDENCE: HIGH
EVIDENCE: LandingPage hydrates `getAdBoxes` and renders slots when an image URL is set. Admin Ads tab writes `adminSetAdBox` / `adminClearAdBox`. Main help copy mentioned landing-page slots but did not name the live query (`AdminDashboard.tsx` 6884–6894). Live CatalogNote is queued in #585. Custom ad art is optional; play does not require ads.
SYSTEMS_AFFECTED: Admin Ads tab; landing page
CURRENT_BEHAVIOUR: Saving a box with both URLs appears on the landing page. Empty image+link stays hidden. Main copy does not name `getAdBoxes`.
AUTHORITATIVE_BEHAVIOUR: Admin copy must say which catalogs the live client actually reads.
RECOMMENDED_ACTION: Keep CRUD. Do not require ad artwork. Prefer #585 over a second Ads CatalogNote.
AUTONOMY: IMPLEMENT for copy — queued in #585
DEPENDENCIES: None
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Save slot 0 with image+https link; landing page shows it. Clear hides it.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-27-031
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Leftover grant, ban, and modifier-chance aliases are unused by the dashboard
CATEGORY: DUPLICATED
PRIORITY: P3
CONFIDENCE: HIGH
EVIDENCE: Shop grant confirms with `adminAddDokaToUser(principal, amount, null)` (`AdminDashboard.tsx` 5733–5738). Canister also exposes `adminGrantDoka` (alias of `adminAddDoka`) and `adminAddDoka` (`main.mo` 1274). Shop ban/unban use `adminBanAccount` / `adminUnbanAccount`; bindgen still lists leftover ban aliases. `useAdminSetMapModifierChance` and `useIsCallerAdmin` have zero dashboard callers; Modifiers tab uses `useAdminSetMapModifier`. `getCallerUserRole` is bindgen-only (020). No product code should be deleted until a deployed DID prove-out.
SYSTEMS_AFFECTED: Shop tab; Map Modifiers; bindgen leftovers
CURRENT_BEHAVIOUR: Operators have one working grant path and one working ban path. Extra Candid methods and the chance-only hook are unused by AdminDashboard.
AUTHORITATIVE_BEHAVIOUR: Dashboard uses one grant, one ban pair, and one modifier write. Leftover aliases stay until prove-out; do not treat unused as license to delete.
RECOMMENDED_ACTION: Keep current Shop/Modifiers callers. Do not wire a second grant or ban button. Do not delete canister aliases without DID confirmation.
AUTONOMY: HUMAN — DID prove-out before any delete
DEPENDENCIES: AFDA-2026-08-31-004; AFDA-2026-08-31-012
REGRESSION_RISK: HIGH if live aliases are removed while an old client still calls them
VALIDATION_REQUIRED: Grant Doka via Shop; ban/unban via Shop; save a modifier via the full editor. Confirm no dashboard caller for `adminSetMapModifierChance`.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-28-032
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Admin can empty the live portal-modifier pool (delete last row or set last live chance to 0)
CATEGORY: UNSAFE
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `adminDeleteMapModifier` (`main.mo`) removes any id with no last-seeded / last-live check. `validateMapModifier` / `validateMapModifierChance` (`adminGuard.mo`) allow `triggerChance` 0 and only reject `> 100`. Engine `pickWeighted` returns undefined when weight total `<= 0`. Dashboard delete uses `useAdminDeleteMapModifier`. Guards are already queued: #626 refuse delete of seeded modifiers, #650 refuse emptying the live built-in pool, #703 reject last-live chance of 0. Do not restack those hunks here.
SYSTEMS_AFFECTED: Map Modifiers tab; portal modifier rolls
CURRENT_BEHAVIOUR: An operator can delete slime_flood / paper_windstorm or set the last active row’s chance to 0. Portal rolls then silently apply no modifier. CatalogNote on main (`AdminDashboard.tsx` 6194–6198) does not warn.
AUTHORITATIVE_BEHAVIOUR: At least one live registry modifier must remain eligible for the portal roll unless product explicitly wants a no-modifier world. Zero chance on a non-last row can stay valid.
RECOMMENDED_ACTION: Prefer merging #626 / #650 / #703. Do not delete modifier CRUD. Do not treat an empty pool as license to drop `adminDeleteMapModifier`.
AUTONOMY: HUMAN — already queued on older PRs
DEPENDENCIES: AFDA-2026-08-31-016; AFDA-2026-09-02-021; AFDA-2026-09-27-031
REGRESSION_RISK: MEDIUM if a last-live guard blocks a legitimate single custom modifier at chance 0 while a second row is inactive
VALIDATION_REQUIRED: With only slime_flood active, set chance 0 — save must fail after the guard lands. Delete of the last seeded id must fail. A second custom row at chance 0 must still save.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-28-033
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Panel-layout actor typedef claimed bindgen still omitted uiLayout methods
CATEGORY: MISLEADING
PRIORITY: P3
CONFIDENCE: HIGH
EVIDENCE: `usePanelLayout.ts` 19–25 on origin/main still says generated `backendInterface` does not expose `saveUserUiLayout` / `getUserUiLayout`. Bindgen `backend.ts` already declare both, plus `adminRollback*` and `getAdminAuditLog`. Identical JSDoc rewrite is queued in #741. This run does not restack that hunk. Dashboard still has no rollback/audit UI (012).
SYSTEMS_AFFECTED: Panel layout persist; admin rollback/audit typings
CURRENT_BEHAVIOUR: Layout save already uses bindgen methods. Main-branch comment still claims bindgen lag.
AUTHORITATIVE_BEHAVIOUR: Comments must not claim bindgen lag that a current `backend.ts` read disproves.
RECOMMENDED_ACTION: Prefer merging #741. Remaining missing rollback/audit UI is 012. Remaining mixin drift is 020.
AUTONOMY: IMPLEMENT — queued in #741
DEPENDENCIES: AFDA-2026-09-01-020; AFDA-2026-08-31-012
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After #741, comment names `backend.ts` as already exposing uiLayout; mocks typed as `UiLayoutActor` still typecheck.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-28-034
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Admin can delete every achievement row when no player progress exists
CATEGORY: UNSAFE
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: `adminDeleteAchievementConfig` (`main.mo`) retires (`active = false`) only when some `achievementProgress` row cites that id; otherwise it `remove`s. Dashboard Achievements tab exposes delete. World/Feats hydrate `getAchievementConfigs`. No last-live catalog guard on main. Guard is queued in #733. Do not restack that hunk. Live-contract copy is still 028 / #415.
SYSTEMS_AFFECTED: Achievements tab; Feats panel; recap unlocks
CURRENT_BEHAVIOUR: On a fresh canister (or after wiping progress), an operator can delete the whole seeded catalog. Players then hydrate an empty feat list.
AUTHORITATIVE_BEHAVIOUR: Seeded feat rows stay available unless product explicitly wants an empty catalog. Per-row retire (`active=false`) remains valid when progress exists.
RECOMMENDED_ACTION: Prefer merging #733. Keep CRUD. Do not treat unused as license to drop `adminDeleteAchievementConfig`.
AUTONOMY: HUMAN — already queued on #733
DEPENDENCIES: AFDA-2026-09-22-028
REGRESSION_RISK: MEDIUM if a last-live guard blocks retiring a mistaken custom feat that has no progress
VALIDATION_REQUIRED: Delete the last seeded feat with no progress — save must fail after the guard lands. Retire-with-progress still sets active=false.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-29-035
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Adding a name to the query-default pool replaces the live catalog with a size-1 stored list
CATEGORY: UNSAFE
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `getEnemyNames` (`main.mo` 2724–2740) returns a hardcoded default list when `enemyNames.size() == 0`, then only `enemyNames.toArray()` once any row is stored. Names tab “Load Defaults” renders only when `enemyNames.length === 0` (`AdminDashboard.tsx` 7343–7352), which a successful query never is. `addEnemyName` appends to the stored list without seeding defaults first. WorldExploration uses `enemyNamesFromQuery` (5753–5757); `DEFAULT_ANCIENT_NAMES` fallback runs only when `availableNames.length === 0` (5800–5806). After one add, extra enemies on the map get `assignedName: undefined` instead of a fallback label. Live-contract copy is 029 / #457; confirm-on-delete is #470. Do not restack those hunks.
SYSTEMS_AFFECTED: Enemy Names tab; overworld spawn labels
CURRENT_BEHAVIOUR: An empty stored pool looks fully populated. Adding one name hides every query-default. Maps then reuse that single label until the unique-name loop exhausts, after which further enemies spawn unnamed.
AUTHORITATIVE_BEHAVIOUR: Query-default names stay in the live pool until the operator persists them (`initDefaultNames` upsert) or explicitly replaces the catalog. Extra enemies must still receive a fallback label. Custom art is not required (013).
RECOMMENDED_ACTION: Prefer extending #457/#470: always show Load Defaults (upsert is already safe) and CatalogNote that Add on an unpersisted default list replaces it. Optional canister union of defaults + stored is HUMAN. Do not delete name CRUD. Do not treat unused Enemies catalog (006) as license to drop the name pool.
AUTONOMY: HUMAN — AdminDashboard overlap with #457/#470; canister union is a spawn-behavior change
DEPENDENCIES: AFDA-2026-09-23-029; AFDA-2026-08-31-006
REGRESSION_RISK: MEDIUM if defaults are unioned without documenting that stored-only was the previous live contract
VALIDATION_REQUIRED: With empty stored pool, Add “Testname”; next map must not drop the default catalog unless Load Defaults was skipped and copy warned. Extra enemies past the unique-name loop still have a label.
STATUS: NEW

---

ACTION_ID: AFDA-2026-09-29-036
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Engine comment claimed `levelVarianceChance` is admin-configurable
CATEGORY: MISLEADING
PRIORITY: P3
CONFIDENCE: HIGH
EVIDENCE: `pickEnemyLevelFromTiers` reads `cfg.levelVarianceChance ?? 15` (`combatMath.ts` 60–63). Frontend `gameTypes.TierSpawnConfig` and Motoko/bindgen `TierSpawnConfig` omit the field. Tiers tab has no input. Origin/main comment still says “admin-configurable”; rewrite is queued in #780. This run does not restack that hunk.
SYSTEMS_AFFECTED: Enemy Tiers tab; player-relative spawn
CURRENT_BEHAVIOUR: Variance stays 15% unless an in-memory / localStorage object carries the optional engine field. Main-branch comment still claims admin can set it.
AUTHORITATIVE_BEHAVIOUR: Comments must match Candid and the Tiers form. The 15% default is code-owned until a field is added.
RECOMMENDED_ACTION: Prefer merging #780. Surface or persist the field only with 026. Do not treat 15% or the 999 tier index as a player cap (011).
AUTONOMY: IMPLEMENT — queued in #780
DEPENDENCIES: AFDA-2026-09-21-026
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After #780, comment no longer says admin-configurable. Tiers save still does not send `levelVarianceChance`. Spawn still rolls ±1 at 15%.
STATUS: PARTIAL

---

ACTION_ID: AFDA-2026-10-21-037
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Three buff catalogs drift; official shop never calls canister purchaseBuff; admin has no editor
CATEGORY: BACKEND_CONTRACT
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: Official Items shop is `BUFF_ITEMS` in `BuffShop.tsx` 31–79 (`health_potion` 50, `greater_health_potion` 120, `battle_elixir` 80, `swift_boots` 90, `shield_charm` 100, `fury_potion` 150) + `tryPurchaseBuffItem` + `${principal}_inventory`. No component calls `getBuffCatalog` / `purchaseBuff` / `getBuffInventory`. Canister `BUFF_CATALOG` (`main.mo` 2772–2778) is a `transient let` (`health_potion` 50, `greater_potion` 120, elixir 200, boots 80, charm 150, fury 100). Mock `getBuffCatalog` (`mocks/backend.ts` 199–203) is a third catalog (`atk_boost`, `def_shield`). Admin Dashboard has no buff tab. A future admin setter could not persist the Motoko catalog across upgrades without a new stable. Prefer #466 for the id-alias lock. Do not restack BuffShop.
SYSTEMS_AFFECTED: Items shop; economy; admin Shop tab; bindgen mock
CURRENT_BEHAVIOUR: Players buy frontend-priced potions into localStorage. Canister `purchaseBuff("greater_health_potion")` would `#err` Unknown item. Operators cannot edit either catalog from admin.
AUTHORITATIVE_BEHAVIOUR: One catalog. Official client either stays localStorage-only (then canister/mock catalogs are leftover until DID prove-out) or hydrates `getBuffCatalog` and admin can edit it. Do not wire `purchaseBuff` until ids/prices match `BUFF_ITEMS`.
RECOMMENDED_ACTION: Keep live `BUFF_ITEMS` path. Do not delete `getBuffCatalog` / `purchaseBuff` without DID confirmation. Prefer #466 for the id-alias lock. Do not add a buff tab until product picks the live writer. Do not treat unused canister methods as license to delete.
AUTONOMY: HUMAN — catalog unification is a persist/economy change
DEPENDENCIES: AFDA-2026-08-31-004; AFDA-2026-08-31-012
REGRESSION_RISK: HIGH if `purchaseBuff` is wired to `greater_health_potion` without renaming the Motoko id
VALIDATION_REQUIRED: Buy Greater Potion in Items; inventory key is `greater_health_potion`. Grep-confirmed no `purchaseBuff` caller under `src/frontend/src/components`.
STATUS: NEW

---

ACTION_ID: AFDA-2026-10-21-038
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Admin Spells tab edits Motoko defaultSpells ids; live kits and innate bar use spellData ids
CATEGORY: MISLEADING
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: Three namespaces on HEAD `0f5363f`: (1) `data/spellData.ts` `starterSpells` / `physical_attack` — WX innate bar (2396–2440), `ENEMY_KITS` (`enemyAI.ts` 163–185: `starter-frost`, `spell-inferno`, `spell-venom-strike`), `bossKits.ts` `SPELL_ID_CATALOG`, summon kits. (2) Motoko `defaultSpells()` (`lib/admin.mo` 168–191) and `BUILT_IN_SPELL_IDS` (`adminSafety.ts` 9–16): `shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse` — this is what Admin Spells CRUD edits. (3) Canister `defaultBossConfigs` retired ids (`fireball`, `cursed_gust`, …) (025). Spell editor ID placeholder is still `fireball`. WX filters OLD_SPELL_NAMES_SET (2356–2393) so (3) cannot enter the player library. `shouldIncludeBackendSpellInLibrary` can still UNION (2) onto the innate bar if `usableByPlayer` (014). No overlap between (1) starter-* ids and (2) Motoko ids. #818’s `useSpellQueries.ts` comment states the namespaces; this run does not restack it. Custom art is not required for new spells/summons (013).
SYSTEMS_AFFECTED: Admin Spells tab; spell pools; spell discovery; enemy AI; bosses; summons
CURRENT_BEHAVIOUR: Saving `shadow_strike` as player-usable grants it on hydrate (player library is a UNION). Enemy kit resolution is a REPLACE: a non-empty Motoko catalog becomes `normalizedSpellPool`, so `buildEnemyKit` spellData ids miss and enemies spawn with empty bars (040). Pale Archbishop’s live pool stays `bossKits.ts`. Deleting a Motoko built-in is blocked; deleting a spellData innate id is not a canister built-in. Operators cannot edit ENEMY_KITS or the innate bar from admin. Local mock `getSpellConfigs` returns `[]`, so kits still work under VITE_USE_MOCK.
AUTHORITATIVE_BEHAVIOUR: One spell-id namespace, or admin copy that Spells CRUD is an extra catalog on top of code-owned `starterSpells` / kits. New admin spells must function with default pixel visual. Do not infer kits from enemy/boss name.
RECOMMENDED_ACTION: Keep both catalogs until product picks a single writer. Label Spells tab: extra canister catalog, not the innate/kit table. Union (do not replace) starterSpells into the enemy pool — that replace is 040 / prefer #911. When 002 is wired, do not load Motoko retired ids into combat. Summon editor remains #564. Do not delete Spell CRUD. Do not treat unused Motoko rows as license to drop `adminSetSpellConfig`.
AUTONOMY: HUMAN — namespace merge is a combat/discovery project
DEPENDENCIES: AFDA-2026-08-31-006; AFDA-2026-08-31-014; AFDA-2026-08-31-018; AFDA-2026-09-02-022; AFDA-2026-09-21-025
REGRESSION_RISK: HIGH if ENEMY_KITS are rewritten to Motoko ids without a spawn playtest, or if starterSpells are dropped from the innate bar
VALIDATION_REQUIRED: Grep: `starter-frost` is not in `defaultSpells()`. Bishop kit still casts `starter-frost` after an admin-only `shadow_strike` save. Empty sprite URL still draws Default Pixel Visual.
STATUS: NEW

---

ACTION_ID: AFDA-2026-10-22-039
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Admin Ground Doka “Leader Boost per Death (%)” persists but combat ignores the percent
CATEGORY: IGNORED_FIELDS
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `AdminGameConfig.leaderBoostPercent` is on Motoko/bindgen and the Map Modifiers Ground Doka editor (`AdminDashboard.tsx` 6266–6283). WX hydrates it from `getGameConfig` (2293–2294) and passes it into `applyDamageToEnemy` (`castHelpers.ts` 298) which aliases `_leaderBoostPercent` and never reads it. `applyLeaderDeathBoost` (`WorldExploration.tsx` 9036–9050) writes hardcoded `Math.min(prev + 0.25, 2.0)` into `_leaderBoostMultiplier` (1697) which has no other readers. Live leader-death effect is erratic AI when `leaderDiedRef.current` (WX 15507–15518) plus `leader_slayer` feat via `battleLeaderSlainRef`. Ground Doka chance/base ARE live (`dokaSpawnConfigRef`, WX 6746–6751). #585 CatalogNote still calls leaderBoost live — do not restack AdminDashboard. #887’s `gameTypes.ts` JSDoc names the field ignored; this run does not restack it.
SYSTEMS_AFFECTED: Map Modifiers Ground Doka editor; leader death; economy-adjacent combat
CURRENT_BEHAVIOUR: Changing the percent saves to the canister and reloads in admin. Killing the designated leader still applies +0.25 to unread state and flips erratic AI. `dokaSpawnChance` / `dokaSpawnBaseValue` still change ground loot.
AUTHORITATIVE_BEHAVIOUR: Either apply `leaderBoostPercent` to a live damage/stat multiplier, or stop showing a percent that cannot change combat. Copy must not call the field live. Custom art is not involved.
RECOMMENDED_ACTION: Prefer correcting #585 copy when that PR is restacked: Ground Doka spawn is live; leader percent is not. Do not wire the unused multiplier in this auditor (combat). Do not delete `leaderBoostPercent` from Candid without DID prove-out.
AUTONOMY: IMPLEMENT for copy — queued behind #585 AdminDashboard. Combat wiring is HUMAN.
DEPENDENCIES: AFDA-2026-08-31-012
REGRESSION_RISK: HIGH if a later change starts multiplying damage by the stored percent without a combat playtest
VALIDATION_REQUIRED: Set leaderBoostPercent to 0 and to 100; kill the designated leader; erratic AI still triggers; no damage multiplier changes. Set dokaSpawnChance to 0; next non-death map has no ground Doka.
STATUS: NEW

---

ACTION_ID: AFDA-2026-10-23-040
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Non-empty Motoko/admin spell catalog replaces the enemy kit pool, so ENEMY_KITS resolve empty
CATEGORY: BROKEN
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `WorldExploration.tsx` 2688–2694: `spellPool = filteredBackendSpells.length > 0 ? filteredBackendSpells : starterSpells`. Battle start 11915–11924: comment still says “10 random spells from usableByEnemy pool” but `_enemyUsableSpells` is unread; `assignEnemySpells` maps `buildEnemyKit` ids (`enemyAI.ts` 163–185: `physical_attack`, `starter-frost`, `spell-inferno`, …) through `normalizedSpellPool.find`. Motoko `defaultSpells()` (`lib/admin.mo` 168–191) seeds `shadow_strike` / `soul_rend` / `vampire_bite` / `reflect_barrier` / `thunder_clap` / `void_collapse` on first canister init — none of those ids overlap ENEMY_KITS. Mock `getSpellConfigs` (`mocks/backend.ts`) returns `[]`, so local kits still work. A live `getSpellConfigs` success (or any admin save that keeps the map non-empty) flips the pool permanently; built-ins cannot be deleted. Player `ownedSpells` is still a UNION (2410–2439). `normalizedSpellPool` also defaults `usableByEnemy: false` before `...s` (2695–2700); an unset flag stays false and apply `!== false` can drop the mock/empty-catalog kit. Kit zone argument is a LevelZone object (`Math.floor(object)` is NaN — WDEAD-2026-08-31-012 / LHIPS-2026-08-31-007); that is a separate dead `z >= 1` branch, not this ID. Open PR #911 adds `assignPackEnemyKitSpells` but does not yet call it from WX. Custom art is not required (013).
SYSTEMS_AFFECTED: Admin Spells tab; spell pools; enemy AI; encounters
CURRENT_BEHAVIOUR: On a seeded canister, overworld enemies get empty `spells[]` (except the independent summoner-chance path that still reads `starterSpells` for wolf/archer). Admin cannot fix kits from the Spells tab; saving another Motoko row keeps the replace.
AUTHORITATIVE_BEHAVIOUR: Enemy kit resolution must search the live spellData registry (or a union of starterSpells + backend). A non-empty admin catalog must not hide innate kit ids. New admin spells remain optional extras with Default Pixel Visual.
RECOMMENDED_ACTION: Prefer merging #911 (`packEnemyKitAssign.ts` fills missing kit ids from starterSpells; WX is still catalog-only find). Restack `assignEnemySpells` onto `assignPackEnemyKitSpells` after overlapping WX PRs. Do not implement in this auditor (WorldExploration combat). Label Spells: extra catalog. Keep 038 namespace merge as HUMAN. Do not delete Spell CRUD.
AUTONOMY: HUMAN — battle-start pool change; WorldExploration is out of scope for this auditor
DEPENDENCIES: AFDA-2026-10-21-038; AFDA-2026-08-31-014
REGRESSION_RISK: HIGH if the pool is switched to Motoko-only ids without rewriting ENEMY_KITS, or if starterSpells are dropped from the player innate bar
VALIDATION_REQUIRED: Against a seeded canister (non-empty `getSpellConfigs`), start a fight; pawn/bishop still have `physical_attack` / `starter-frost`. Mock `[]` catalog still uses starter kits. Empty sprite URL still draws Default Pixel Visual.
STATUS: NEW

---

ACTION_ID: AFDA-2026-10-23-041
SOURCE_AUTOMATION: Admin Feature & Drift Auditor
TITLE: Canister `getEnemyHPForLevel` uses admin growth percent but live combat never calls it
CATEGORY: BACKEND_CONTRACT
PRIORITY: P2
CONFIDENCE: HIGH
EVIDENCE: `main.mo` 2942–2954: `getEnemyHPForLevel(enemyTier, level)` = `(30 + (tier-1)*20) * (1 + level * statGrowthPercent/100)` from canister `levelUpConfig`. Bindgen exposes it (`backend.ts` 942). Grep: no frontend caller outside bindgen/mocks (`mocks/backend.ts` always returns `60n`). Live HP is `WorldExploration.calcEnemyMaxHp` 3606–3614: `50 * (1 + (enemyLevel-1) * growth)` from `pbv_levelup_config` (003). `getEnemyBaseStats` (`progression.ts`) returns sp/sr/init/res/chc only — no HP. Admin `EnemyConfig.hp` is unused by spawn (006). Settings can persist `statGrowthPercent` to the canister; same-browser dual-write can still move localStorage HP (003) without ever invoking this query. Not a player career cap.
SYSTEMS_AFFECTED: Settings tab; Enemies tab; encounters; progression
CURRENT_BEHAVIOUR: Operators can change growth percent in Settings. Live enemy HP follows the localStorage 50-base formula. The canister query and the admin `hp` field do not feed spawn.
AUTHORITATIVE_BEHAVIOUR: One HP formula. Either the client calls `getEnemyHPForLevel` (cache only) or the query is leftover until DID prove-out. Admin `EnemyConfig.hp` stays catalog-only unless spawn is explicitly wired (006). Pixel fallback remains (013).
RECOMMENDED_ACTION: Keep the query until prove-out; do not delete. Do not wire it in this auditor (combat HP). Prefer fixing 003 hydrate first so any future call would see canister growth. Do not treat unused as license to drop `getEnemyHPForLevel`.
AUTONOMY: HUMAN — live HP formula is combat; DID prove-out before any delete
DEPENDENCIES: AFDA-2026-08-31-003; AFDA-2026-08-31-006
REGRESSION_RISK: HIGH if spawn starts using the Motoko 30+20*tier formula without a playtest (HP would jump vs the live 50-base curve)
VALIDATION_REQUIRED: Grep-confirmed no game caller. Change Settings growth percent; next fight HP still matches `50 * (1+(level-1)*growth)` from localStorage, not `getEnemyHPForLevel`.
STATUS: NEW


# ACTION_IDs — 2026-09-23 Admin UX & Information Architecture Auditor

Stable IDs. Recapture; do not duplicate AUTO_FIXED work.  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
Narrative: [`ADMIN_UX_AUDIT_2026-09-23.md`](./ADMIN_UX_AUDIT_2026-09-23.md)

---

ACTION_ID: AUX-ACHIEVEMENT-DUP-CONDITION  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Second active achievement with the same condition looked saveable  
CATEGORY: validation  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: WorldExploration `.find()`s the first active row per condition. A duplicate live first_battle_win is a double-claim faucet. Helper `achievementConditionTaken` unioned from #460; this run toasts and refuses Save when another active row already holds the condition. Inactive drafts may reuse it.  
SYSTEMS_AFFECTED: Achievement editor; adminSafety  
RECOMMENDED_ACTION: Keep the Save guard. Do not delete the other row automatically.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Duplicate active condition toasts and does not mutate; editing the same id still saves.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-NAMES-INIT-NO-CONFIRM  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Load Defaults wrote 90 live enemy names in one click  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Names tab `initDefaultNames` called `mutate()` with no dialog. Empty pool is a valid default; the button is a bulk live write. Fixed: ConfirmDialog (`adminNamePoolInitConfirmBody`); Cancel does not call the actor; button shows Saving… while pending.  
SYSTEMS_AFFECTED: AdminDashboard Names tab; adminOwnerUx  
RECOMMENDED_ACTION: Keep confirm. Do not auto-init names on tab open.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Cancel leaves the pool empty; confirm writes; button disabled while pending.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-BOSSRUSH-PUBLISH-NO-CONFIRM  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Boss Rush Publish wrote live JSON with no confirm or Saving…  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Publish called `adminSetBossRushConfig` immediately. CatalogNote already says live, not a browser draft. Fixed: ConfirmDialog (`adminBossRushPublishConfirmBody`); Saving… + header `anyPending` while in flight.  
SYSTEMS_AFFECTED: AdminDashboard Boss Rush tab; adminOwnerUx  
RECOMMENDED_ACTION: Keep confirm. Do not describe this write as a draft.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-BOSSRUSH-LIVE-UNLABELED  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Cancel does not call the actor; confirm still asserts `#ok`; button shows Saving….  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-PALETTE-RESET-NO-CONFIRM  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Visuals Reset cleared local palette cache in one click  
CATEGORY: destructive-actions  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reset removed `pbv_color_palette` / `paperVertexPalette` without confirm. Copy already says canister is unchanged until Save Palette. Operators could still think Reset reverted live colors. Fixed: ConfirmDialog (`adminPaletteResetConfirmBody`).  
SYSTEMS_AFFECTED: VisualsTab; adminOwnerUx  
RECOMMENDED_ACTION: Keep confirm. Do not call `adminSetColorPalette` from Reset.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-VISUALS-TAB-SCOPE  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Cancel leaves slots; confirm only clears editor + local keys.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-ADS-SAVE-SILENT-ERROR  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Ad Save/Clear failed with a silent Error chip  
CATEGORY: save-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `catch { setStatus("Error") }` did not toast. Missing genesis slots skipped hydrate (`if (boxes[index])`). Fixed: toast (`adminAdSaveFailedCopy` / `adminAdClearFailedCopy`); Saving…; `adBoxAt` empty default (union #437). Empty URLs remain a valid hidden default.  
SYSTEMS_AFFECTED: AdBoxEditor; adminSafety `adBoxAt`; adminOwnerUx  
RECOMMENDED_ACTION: Keep toast + empty-slot hydrate. Do not treat empty URLs as invalid.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-AD-EMPTY-AS-ERROR  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Actor `#err` toasts; empty `getAdBoxes` still shows hidden default; Save disables while pending.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-LEVELUP-NO-SAVING  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Level-up Save Config had no in-flight label  
CATEGORY: save-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Button flipped Saved ✓ after the round-trip with no Saving… and stayed clickable. Fixed: `saving` state, disabled + Saving….  
SYSTEMS_AFFECTED: LevelUpConfigPanel  
RECOMMENDED_ACTION: Keep Saving…. Do not hide the nine fields.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-LEVELUP-PARTIAL  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Double-click does not fire two writes; Saved ✓ still appears after `#ok`.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-PALETTE-NO-SAVING  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Save Palette had no in-flight label  
CATEGORY: save-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Same as Level-up — Saved ✓ with no Saving…. Fixed: `saving` state on Save Palette; Reset disabled while saving.  
SYSTEMS_AFFECTED: VisualsTab  
RECOMMENDED_ACTION: Keep Saving…. Empty/all-unchecked remains valid random.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-VISUALS-TAB-SCOPE  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Button disabled during `adminSetColorPalette`; random (all off) still saves.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-SPELL-DELETE-BUILTIN  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Built-in spell ids must be retired, not deleted  
CATEGORY: destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `adminDeleteSpellConfig` rejects built-in ids. List × still offered Delete. Union #341/#413: Retire opens editor; mutation guard `adminSpellDeleteBlockedReason`.  
SYSTEMS_AFFECTED: SpellList; useSpellQueries; adminSafety  
RECOMMENDED_ACTION: Keep Retire. Do not delete built-in rows.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: void_collapse × is Retire; custom ids still Delete with confirm.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-SPELL-RETIRED-UNLABELED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Retired spells looked live in the list  
CATEGORY: content-lifecycle  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `usableByPlayer=false` had no chip. Union #413: `adminSpellCatalogStatus` Retired wins over Built-in.  
SYSTEMS_AFFECTED: SpellList; adminSafety  
RECOMMENDED_ACTION: Keep Retired as the live-looking suppressor.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-LIFE-NO-STATES  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Retired built-in shows Retired, not Built-in.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-PRESET-DELETE-NO-CONFIRM  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Enemy preset × deleted without confirm  
CATEGORY: destructive-actions  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Browser-local presets. Union #341/#413 ConfirmDialog. Live catalog unchanged.  
SYSTEMS_AFFECTED: EnemyPresets  
RECOMMENDED_ACTION: Keep confirm. Do not call adminSetEnemyConfig from preset delete.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Cancel keeps the chip.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-PRESET-OVERWRITE-NO-CONFIRM  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Same-name preset Save silently replaced the draft  
CATEGORY: destructive-actions  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Union #413 overwrite ConfirmDialog. Local only.  
SYSTEMS_AFFECTED: EnemyPresets  
RECOMMENDED_ACTION: Keep confirm.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-PRESET-DELETE-NO-CONFIRM  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Cancel leaves the previous preset.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-BOSS-LEAVE-UNWARNED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Leaving an expanded boss kit discarded the draft silently  
CATEGORY: unsaved-changes  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Union #413 `bossEditorOpen` in `hasOpenEditor`.  
SYSTEMS_AFFECTED: BossesTab; leave-editor  
RECOMMENDED_ACTION: Keep leave warning. Field-level `isDirty` still HUMAN.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-DIRTY-UNUSED  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Tab switch with expanded kit opens Leave editor.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-LOADING-INCOMPLETE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Header Saving… omitted several live writers  
CATEGORY: loading  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Union #341 added achievement/name/game-config. This run adds Boss Rush in-flight + per-button Saving… on LevelUp/palette/ads/names init.  
SYSTEMS_AFFECTED: AdminDashboard header; nested editors  
RECOMMENDED_ACTION: Keep writers in `anyPending` when they live on the parent. Nested editors keep local Saving….  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Header pulses during name-pool init and Boss Rush publish.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-BOSS-SPELL-POOL-UNFILTERED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Boss phase spell pool was an unfiltered chip wall  
CATEGORY: edit-forms  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Union #341/#413 `spellQuery` ListSearch.  
SYSTEMS_AFFECTED: PhaseEditor  
RECOMMENDED_ACTION: Keep filter. Category groups remain HUMAN.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-BOSS-ABILITY-WALL  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Filter hides chips; selected ids stay selected.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-VISUALS-TAB-SCOPE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Visuals tab looked like a sprite library  
CATEGORY: visual-asset-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Union #341/#413 CatalogNote: palette only; empty custom is Default Pixel Visual.  
SYSTEMS_AFFECTED: VisualsTab  
RECOMMENDED_ACTION: Keep palette-only copy. Do not add pools here without approval.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-ASSET-NO-POOL  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Copy never calls empty palette an error.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-SIDEBAR-COUNTS-INCOMPLETE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Sidebar omitted names and boss kits  
CATEGORY: navigation  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Union #341/#413 Names + Bosses (19 kits).  
SYSTEMS_AFFECTED: AdminDashboard sidebar  
RECOMMENDED_ACTION: Keep counts. Do not add empty domain rows.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Bosses shows 19.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-GAMEKEY-NO-CONFIRM  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Confirm GameKey approve, reject, and mark emailed  
CATEGORY: destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Purchases Approve/Reject/Mark emailed already confirm (prior AUTO_FIXED).  
SYSTEMS_AFFECTED: AdminGameKeyPurchases; dokaGameKey  
RECOMMENDED_ACTION: Keep confirms. Cancel must not call the actor.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Approve still reveals the code.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-UNBAN-COPY-STALE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Unban dialog claimed achievement progress was cleared  
CATEGORY: terminology  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Still aligned with ban-keeps-claimed-flags.  
SYSTEMS_AFFECTED: AdminDashboard Shop tab  
RECOMMENDED_ACTION: Keep copy aligned. Do not reintroduce wipe-on-ban.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-UNBAN-NO-CONFIRM  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Ban and Unban dialogs agree claimed rewards stay claimed.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-UNBAN-NO-ASSERT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Unban toasted success without asserting #ok  
CATEGORY: save-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Unban still uses `assertAdminCmdOk`.  
SYSTEMS_AFFECTED: AdminDashboard Shop tab  
RECOMMENDED_ACTION: Keep assert.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Unauthorized unban shows an error toast, not Unbanned.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-NO-BANNED-LIST  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Shop could ban without listing who is banned  
CATEGORY: list-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Read-only `getBannedPrincipals` list remains. Empty is valid.  
SYSTEMS_AFFECTED: Shop tab  
RECOMMENDED_ACTION: Keep the list read-only.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Click fills the unban field.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-LEVELUP-PARTIAL  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Level-up UI silently writes hardcoded remaining fields  
CATEGORY: system-config  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: All nine fields remain visible. Save still publishes live.  
SYSTEMS_AFFECTED: LevelUpConfigPanel  
RECOMMENDED_ACTION: Keep all nine fields visible. Staged draft is HUMAN.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (fields); HUMAN for staged draft  
DEPENDENCIES: AUX-LIFE-NO-STATES  
REGRESSION_RISK: LOW for copy  
VALIDATION_REQUIRED: All nine inputs persist via `adminSetLevelUpConfig`.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-ENEMY-STATS-INCOMPLETE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Admin EnemyConfig is a spawn template, not combat identity  
CATEGORY: terminology  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Form is hp/ap/mp/init/level/regions/sprite. Runtime combat also has damage/res/sp/sr/chc. Spawn-template copy remains.  
SYSTEMS_AFFECTED: EnemyEditor  
RECOMMENDED_ACTION: Keep spawn-template copy. Do not add combat fields without a typed persist path.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (copy); HUMAN for persist  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if a third type is invented.  
VALIDATION_REQUIRED: Copy only until persist exists.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-LIST-NO-FILTER-SORT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Lists need sort and structured filters  
CATEGORY: list-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Search on enemies, regions, spells, sprites, modifiers, achievements, names, bosses. No sort by level/name; no region/effect/active facets.  
SYSTEMS_AFFECTED: Entity lists  
RECOMMENDED_ACTION: Sort + facet filters. Do not paginate until counts exceed ~100.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (search shipped); HUMAN for sort/facets  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Filter does not hide Add.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-SHOP-PACKAGES-MISSING  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Shop packages API unused by the Shop tab  
CATEGORY: economy  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player path is GameKey/Mollie (PR #258). Do not add a package editor that would fight GameKey.  
SYSTEMS_AFFECTED: Shop tab  
RECOMMENDED_ACTION: Leave packages unused until a product decision.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if a second store ships  
VALIDATION_REQUIRED: N/A  
STATUS: SUPERSEDED  

---

ACTION_ID: AUX-PII-PURCHASES  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Purchases need query, status filter, and proof confirm  
CATEGORY: pii / list-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: GameKey table still shows email + principal with search/status. Redact still missing.  
SYSTEMS_AFFECTED: Purchases tab  
RECOMMENDED_ACTION: HUMAN — optional column redact for screenshare. Keep confirms.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED (redact)  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Filter narrows rows.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-DIRTY-UNUSED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Field-level dirty + beforeunload still missing  
CATEGORY: unsaved-changes  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `isDirty` is still hardcoded `false`. Leave-editor covers listed editors including bosses. Closing the browser tab has no `beforeunload`.  
SYSTEMS_AFFECTED: `gameTypes.ts` `isDirty`; all editors  
RECOMMENDED_ACTION: Set `isDirty` from form diffs; warn only when dirty; `beforeunload` when dirty.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SPRITE-LEAVE-UNWARNED; AUX-BOSS-LEAVE-UNWARNED  
REGRESSION_RISK: MEDIUM — false positives will train operators to dismiss.  
VALIDATION_REQUIRED: Unchanged form can leave without dialog; dirty form warns; refresh prompts.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-BOSS-LOCALSTORAGE-AS-LIVE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Boss Save is a browser draft; Motoko writer unused  
CATEGORY: content-lifecycle  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `useBossQueries.ts` still reads/writes `pbv_boss_configs`. Types still diverge (`iconEmoji`/`loreText`/`chc` vs `defeated`/`adminNotes`). Header copy now names the schema split (union #415).  
SYSTEMS_AFFECTED: useBossQueries; BossesTab; `src/backend` BossConfig  
RECOMMENDED_ACTION: Align types, then staged draft → preview → activate. Show DRAFT vs ACTIVE badge.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-LIFE-NO-STATES  
REGRESSION_RISK: HIGH — live actor reject if fields diverge.  
VALIDATION_REQUIRED: Save round-trips canister; another browser sees the same kit.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-LIFE-NO-STATES  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No DRAFT / VALIDATION FAILED / READY / ACTIVE / INACTIVE / LEGACY  
CATEGORY: content-lifecycle  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Achievement `active` and modifier `active` are the only lifecycle bits. Every other canister Save publishes live. Boss Save is a local draft next to live entity Saves.  
SYSTEMS_AFFECTED: All admin writers  
RECOMMENDED_ACTION: Introduce explicit states. Never render a saved draft as live. Preview-before-activate.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-BOSS-LOCALSTORAGE-AS-LIVE  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: Draft save does not change player encounter tables.  
STATUS: NEW  

---

ACTION_ID: AUX-NAV-FLAT-15  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Fifteen peer tabs, no groups, no command palette  
CATEGORY: navigation  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Flat `TABS` array. Sidebar scrolls. No Content / World / Economy / Health groups. Default tab is Enemies, not Overview.  
SYSTEMS_AFFECTED: AdminDashboard sidebar  
RECOMMENDED_ACTION: Grouped IA per audit proposal. Do not add empty domain tabs.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-NAV-NO-OVERVIEW; AUX-NO-GLOBAL-SEARCH  
REGRESSION_RISK: MEDIUM — operators lose muscle memory.  
VALIDATION_REQUIRED: Every current tab remains reachable in one click from its group.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NO-HEALTH-AUDIT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Canister audit log has no owner view  
CATEGORY: health-audit  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getAdminAuditLog` in `main.mo`; `_recordAdminAudit` on grant/ban/GameKey/config writes; frontend mock stub; AdminDashboard never calls it. Rollback writers exist.  
SYSTEMS_AFFECTED: Health tab (missing); `main.mo` audit log  
RECOMMENDED_ACTION: Read-only Audit tab: timestamp, actor, action, before/after. Link rollbacks with confirm. Do not invent a second log.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: None  
REGRESSION_RISK: LOW for read-only; MEDIUM if rollback is one-click.  
VALIDATION_REQUIRED: Grant Doka appears in the log; non-admin cannot query.  
STATUS: NEW  

---

ACTION_ID: AUX-SPELL-FORM-MONOLITH  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Spell editor is one ~1k-line live publish form  
CATEGORY: edit-forms  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Identity, stats, type, targeting, AoE, flags, tiny preview. No section tabs, validation summary, or dependency rail. Save is live.  
SYSTEMS_AFFECTED: SpellEditor  
RECOMMENDED_ACTION: Sectioned editor + validation summary. Do not add discovery routes until catalog/ownership split exists.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-LIFE-NO-STATES  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Existing fields still persist.  
STATUS: NEW  

---

ACTION_ID: AUX-SPELL-NO-SUMMON-CONTROLS  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Spell editor has no summon controls  
CATEGORY: edit-forms  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `newSpell` seeds isSummon/summonAI/summonLifespan/summonUnitDef and Save forwards them, but the form has no inputs. CatalogNote already says so.  
SYSTEMS_AFFECTED: SpellEditor  
RECOMMENDED_ACTION: Add summon fields with adminGuard ranges. Do not invent AI ids.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SPELL-FORM-MONOLITH  
REGRESSION_RISK: MEDIUM — Inf-HP if scales unbounded  
VALIDATION_REQUIRED: Empty summon remains valid non-summon.  
STATUS: NEW  

---

ACTION_ID: AUX-NO-DEPENDENCY-VIEWS  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No relationship pane for spell / enemy / asset  
CATEGORY: dependency-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Spell↔boss pools exist only as chips in an expanded boss. Enemy↔regions is a checkbox list. No enemy→encounters/dungeons, asset→usage, spell→achievements/challenges.  
SYSTEMS_AFFECTED: All content editors  
RECOMMENDED_ACTION: Read-only dependency rail + badges.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-DOMAIN-GAPS  
REGRESSION_RISK: LOW for read-only.  
VALIDATION_REQUIRED: Click-through does not mutate.  
STATUS: NEW  

---

ACTION_ID: AUX-NAV-NO-OVERVIEW  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No overview home  
CATEGORY: navigation  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Default tab is Enemies. No last-write strip, unpublished drafts, or validation failures. Audit log already exists server-side.  
SYSTEMS_AFFECTED: AdminDashboard default tab  
RECOMMENDED_ACTION: Overview from `getAdminAuditLog` + live/draft counts.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-NO-HEALTH-AUDIT  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Default landing is Overview; Enemies one click away.  
STATUS: NEW  

---

ACTION_ID: AUX-NO-GLOBAL-SEARCH  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No command palette / entity jump  
CATEGORY: search  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Per-list search covers entity lists. No `⌘K` across 15 tabs.  
SYSTEMS_AFFECTED: AdminDashboard chrome  
RECOMMENDED_ACTION: Quick entity search jumping to the owning tab + editor.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-NAV-FLAT-15  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Jump opens the editor for that id.  
STATUS: NEW  

---

ACTION_ID: AUX-BOSS-ABILITY-WALL  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Boss ability chips were unfiltered  
CATEGORY: edit-forms  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Ability filter exists. Still no grouped categories.  
SYSTEMS_AFFECTED: PhaseEditor  
RECOMMENDED_ACTION: Optional category groups. Keep filter.  
AUTONOMY: HUMAN for regroup  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Filter hides chips; selected abilities remain selected.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-ASSET-NO-POOL  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No visual pool / weights / activate / revert control  
CATEGORY: visual-asset-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Single optional URL. Default vs custom copy exists. No pool, weights, activate/deactivate, or first-class revert. Empty remains a valid default.  
SYSTEMS_AFFECTED: Enemy + sprite editors; Visuals tab (palette only)  
RECOMMENDED_ACTION: Weighted variants + revert-to-default without treating empty as error.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: None  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Empty pool = Default Pixel Visual active fallback.  
STATUS: NEW  

---

ACTION_ID: AUX-DOMAIN-GAPS  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Missing owner domains must not become empty tabs  
CATEGORY: information-architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Challenges hardcoded. AI/formations/encounters/dungeons/discovery/simulation/telemetry have no admin API. Shop packages are retired on the player path. Audit log *does* have an API.  
SYSTEMS_AFFECTED: Future tabs  
RECOMMENDED_ACTION: Do not add empty Challenges/AI/Formations/Dungeons/Telemetry tabs. Prefer Audit.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if empty tabs ship  
VALIDATION_REQUIRED: No new tab without a writer/reader.  
STATUS: NEW  

---

ACTION_ID: AUX-NO-BULK-OPS  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No bulk activate / deactivate / delete  
CATEGORY: bulk-operations  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: One-row Edit/× only. Does not scale.  
SYSTEMS_AFFECTED: Entity lists  
RECOMMENDED_ACTION: Bulk only after confirm + dependency summary.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-NO-DEPENDENCY-VIEWS  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: Partial failure does not leave half-deleted sets.  
STATUS: NEW  

---

ACTION_ID: AUX-NO-SIMULATION  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No dry-run shortcut  
CATEGORY: simulation  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: No read-only runner. Must not write wallets or killCount.  
SYSTEMS_AFFECTED: Future sim panel  
RECOMMENDED_ACTION: Report-only until a runner exists that cannot call `applyRewards` / `adminAddDokaToUser`.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if it can mint  
VALIDATION_REQUIRED: Sim path has no persist lock writes.  
STATUS: NEW  

---

ACTION_ID: AUX-NO-TELEMETRY  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No ops metrics in the owner tool  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Persist ok/fail, grants, bans belong here — not the player HUD.  
SYSTEMS_AFFECTED: Future Health tab  
RECOMMENDED_ACTION: Reuse audit log + persist outcomes. No player-facing telemetry HUD.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: AUX-NO-HEALTH-AUDIT  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Metrics are admin-gated.  
STATUS: NEW  

---

ACTION_ID: AUX-MODIFIER-DOKA-MISPLACED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Ground Doka + leader boost sit on Map Modifiers  
CATEGORY: information-architecture  
PRIORITY: P2  
CONFIDENCE: MEDIUM  
EVIDENCE: Economy fields above modifier list. Settings is leftover + transfer + level-up.  
SYSTEMS_AFFECTED: Modifiers tab; Settings  
RECOMMENDED_ACTION: Move economy fields to Economy / System Config when IA is grouped.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-NAV-FLAT-15  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Save still hits `adminSetGameConfig`.  
STATUS: NEW  

---

ACTION_ID: AUX-SAVE-FEEDBACK-SPLIT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Three save languages  
CATEGORY: save-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `toast`, hex `saveStatus` pill, “Saved!”, “Live save committed”, localStorage-only.  
SYSTEMS_AFFECTED: All writers  
RECOMMENDED_ACTION: One toast vocabulary: Published (live) vs Draft saved (local) vs Failed.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-LIFE-NO-STATES  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No dual toast + hex pill for the same write.  
STATUS: NEW  

---

ACTION_ID: AUX-NO-BREADCRUMBS  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Editor replaces the list with no trail  
CATEGORY: navigation  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Enemy/region/spell editors swap the list. No `Enemies / Shadow Knight`.  
SYSTEMS_AFFECTED: Editors  
RECOMMENDED_ACTION: Breadcrumb + Back that honors dirty warning.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-DIRTY-UNUSED  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Breadcrumb returns to the same list filter.  
STATUS: NEW  

---

ACTION_ID: AUX-NO-MOBILE-ADMIN  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Viewport guard is player-oriented  
CATEGORY: responsive  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `App.tsx` small-screen guard is bypassable but console `×` targets stay <44px. Owner-on-laptop-narrow is not a first-class layout.  
SYSTEMS_AFFECTED: App.tsx; delete buttons  
RECOMMENDED_ACTION: Do not ship a phone-first admin. Keep desktop density; enlarge destructive targets only.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Player small-screen continue still works.  
STATUS: NEW  

---

ACTION_ID: AUX-HEX-VS-OKLCH  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Owner-tool `C` tokens are raw hex  
CATEGORY: visual-identity  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: DESIGN.md says OKLCH custom properties only. Admin `C` is hex. Acceptable if documented as admin tokens; do not force player CSS variables into the console.  
SYSTEMS_AFFECTED: AdminDashboard `C`  
RECOMMENDED_ACTION: Document admin hex tokens as owner-tool-only.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: N/A  
STATUS: NEW  

---

ACTION_ID: AUX-LANDING-EASTER-EGG  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Triple-click v1.0 still opens Access Denied for non-admins  
CATEGORY: discoverability  
PRIORITY: P3  
CONFIDENCE: MEDIUM  
EVIDENCE: In-game Admin button is the real entry. Landing easter egg is a footgun.  
SYSTEMS_AFFECTED: LandingPage; App.tsx  
RECOMMENDED_ACTION: Leave for admins; do not advertise to players.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Non-admin still sees Access Denied, not a player HUD leak.  
STATUS: NEW  

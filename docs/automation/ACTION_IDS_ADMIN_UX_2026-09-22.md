# ACTION_IDs — 2026-09-22 Admin UX & Information Architecture Auditor

Stable IDs. Recapture; do not duplicate AUTO_FIXED work.  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
Narrative: [`ADMIN_UX_AUDIT_2026-09-22.md`](./ADMIN_UX_AUDIT_2026-09-22.md)

---

ACTION_ID: AUX-BOSS-LEAVE-UNWARNED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Leaving Bosses discarded an expanded kit with no warning  
CATEGORY: unsaved-changes  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `hasOpenEditor` covered enemy/region/spell/modifier/achievement/sprite ids only. BossesTab keeps `expandedId` + in-memory `drafts` and unmounts on tab change. Fixed: `onEditorOpenChange` + `bossEditorOpen` in the leave dialog.  
SYSTEMS_AFFECTED: AdminDashboard chrome; BossesTab  
RECOMMENDED_ACTION: Keep leave warning when a kit is expanded. Do not treat saved leftover `drafts` as dirty (they linger after Save).  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-DIRTY-UNUSED  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Expand a boss, switch to Enemies — Leave editor dialog; Cancel stays on Bosses.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-SPELL-RETIRED-UNLABELED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Retired spells looked live in the catalog list  
CATEGORY: content-lifecycle  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: List showed type/AP/DMG only. `usableByPlayer=false` is the live retire bit (`adminDeleteSpellConfig` / editor checkbox). A retired built-in still showed Built-in and a Retire action. Fixed: `adminSpellCatalogStatus` — Retired wins; Retire button hidden when already retired.  
SYSTEMS_AFFECTED: SpellList; adminSafety  
RECOMMENDED_ACTION: Keep Retired as the list truth. Do not invent DRAFT/ACTIVE until AUX-LIFE-NO-STATES is approved.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-SPELL-DELETE-BUILTIN  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Uncheck Player Can Use + Save → list chip is Retired, not live/Built-in.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-PRESET-OVERWRITE-NO-CONFIRM  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Same-name enemy preset silently replaced the previous draft  
CATEGORY: destructive-actions  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `handleSave` filtered by name and wrote immediately. Delete already confirmed (#341). Overwrite is also destructive for browser drafts. Fixed: ConfirmDialog before replace.  
SYSTEMS_AFFECTED: EnemyPresets  
RECOMMENDED_ACTION: Keep confirm. Cancel must not write localStorage.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-PRESET-DELETE-NO-CONFIRM  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Saving an existing preset name opens overwrite dialog; Cancel leaves the old config.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-SPELL-DELETE-BUILTIN  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Built-in spell × called a Motoko-rejected delete  
CATEGORY: destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `adminDeleteSpellConfig` returns `#err` for `BUILT_IN_SPELL_IDS`. List still offered ×. Union #341: hide ×, Retire → editor, `adminSpellDeleteBlockedReason` on confirm + mutation.  
SYSTEMS_AFFECTED: SpellList; useSpellQueries; adminSafety  
RECOMMENDED_ACTION: Keep Retire path (`usableByPlayer=false`). Do not hard-delete built-in ids.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: `adminSpellDeleteBlockedReason("void_collapse")` is the Motoko sentence; custom ids still delete after confirm.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-PRESET-DELETE-NO-CONFIRM  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Enemy preset × deleted without confirm  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Local `pbv_enemy_presets` × called `handleDelete` immediately. Union #341 ConfirmDialog.  
SYSTEMS_AFFECTED: EnemyPresets  
RECOMMENDED_ACTION: Keep confirm. Catalog rows stay untouched.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: × opens dialog; Cancel keeps the chip.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-LOADING-INCOMPLETE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Header Saving… missed achievement/name/game-config (and boss Save)  
CATEGORY: loading  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `anyPending` omitted those mutations. Union #341 added them. This run: Boss Save button also shows Saving… (`setBossConfig.isPending`).  
SYSTEMS_AFFECTED: AdminDashboard header; BossesTab  
RECOMMENDED_ACTION: Keep header pending complete. Boss write stays labeled browser draft.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Achievement save and boss draft save show Saving….  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-BOSS-SPELL-POOL-UNFILTERED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Boss phase spell pool was an unfiltered chip wall  
CATEGORY: edit-forms  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Abilities had `ListSearch`; spell pool mapped every catalog id. Union #341: same substring filter.  
SYSTEMS_AFFECTED: PhaseEditor  
RECOMMENDED_ACTION: Keep filter. Selected ids stay selected when hidden by query.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Filter hides chips; selected pool ids remain on the draft.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-VISUALS-TAB-SCOPE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Visuals tab read as a sprite library  
CATEGORY: visual-asset-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Heading “Visuals” + paper landscape only. Union #341 CatalogNote: palette only; empty custom visual is valid Default Pixel Visual.  
SYSTEMS_AFFECTED: VisualsTab  
RECOMMENDED_ACTION: Keep palette-only copy. Do not add pools here without AUX-ASSET-NO-POOL.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-ASSET-NO-POOL  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Note visible; empty URL is not an error state.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-SIDEBAR-COUNTS-INCOMPLETE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Sidebar counts omitted names and bosses  
CATEGORY: navigation  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Footer listed enemies/regions/sprites/spells/achievements/modifiers. Union #341: Names + Bosses (`BOSS_IDS.length` = 19). Comment “12 bosses” corrected this run.  
SYSTEMS_AFFECTED: AdminDashboard sidebar  
RECOMMENDED_ACTION: Keep 19-kit count. Do not fetch canister bosses for a count (writer unused).  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Sidebar shows Names and Bosses 19.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-ENEMY-STATS-INCOMPLETE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Admin EnemyConfig is a spawn template, not combat identity  
CATEGORY: terminology  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Form is hp/ap/mp/init/level/regions/sprite. Runtime combat templates also have damage/res/sp/sr/chc. Editor heading remains “Spawn template”.  
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
EVIDENCE: Search on enemies, regions, spells, sprites, modifiers, achievements, names, bosses. Purchases have query + status. No sort by level/name; no region/effect/active facets.  
SYSTEMS_AFFECTED: Entity lists  
RECOMMENDED_ACTION: Sort + facet filters. Do not paginate until counts exceed ~100.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
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
EVIDENCE: Player path is GameKey/Mollie (PR #258). Shop copy: packages retired. `getShopPackages` / `adminSetShopPackage` remain on the actor. Do not add a package editor that would fight GameKey.  
SYSTEMS_AFFECTED: Shop tab; useShopQueries  
RECOMMENDED_ACTION: Leave packages unused until a product decision. Prefer GameKey Purchases.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if a second store ships  
VALIDATION_REQUIRED: N/A  
STATUS: SUPERSEDED  

---

ACTION_ID: AUX-PII-PURCHASES  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Purchases table shows email + principal without redact  
CATEGORY: pii / list-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: GameKey table still shows email + principal with search/status. Approve/reject/emailed confirms exist. Redact still missing.  
SYSTEMS_AFFECTED: Purchases tab  
RECOMMENDED_ACTION: HUMAN — optional column redact for screenshare. Keep confirms.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
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
EVIDENCE: `AdminDashboardState.isDirty` is still hardcoded `false`. Leave-editor now covers listed editors including sprites and expanded bosses. Closing the browser tab has no `beforeunload`.  
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
EVIDENCE: `useBossQueries.ts` still reads/writes `pbv_boss_configs`. Canister types still diverge (`iconEmoji`/`loreText`/`chc` vs `defeated`/`adminNotes`). Draft wording and “Save browser draft” remain.  
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
EVIDENCE: Achievement `active`, modifier `active`, and spell `usableByPlayer=false` are the only lifecycle bits. Every other canister Save publishes live. Boss Save is a local draft next to live entity Saves. Retired chip added this run is not a full state machine.  
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
TITLE: Spell editor has no summon fields despite persist + validation  
CATEGORY: edit-forms  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `newSpell()` seeds `isSummon` / `summonAI` / `summonLifespan` / `summonUnitDef`. Save validates them. Special Mechanics checkboxes omit summon. CatalogNote is honest. Motoko rejects unknown `summonAI`.  
SYSTEMS_AFFECTED: SpellEditor  
RECOMMENDED_ACTION: HUMAN — summon section with known AI, lifespan ≤20, unit def caps. Do not invent a third summon type.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SPELL-FORM-MONOLITH  
REGRESSION_RISK: MEDIUM — Inf-HP if scales are unbounded (canister already 0–10).  
VALIDATION_REQUIRED: Known AI + lifespan 1–20 persist; empty AI on isSummon=true is blocked.  
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
TITLE: Boss ability chips are filtered but not grouped  
CATEGORY: edit-forms  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Ability filter exists. Still no grouped categories. Filter can hide already-selected chips.  
SYSTEMS_AFFECTED: PhaseEditor  
RECOMMENDED_ACTION: Optional category groups + pin selected. Keep filter.  
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

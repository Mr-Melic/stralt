# ACTION_IDs — 2026-09-25 Admin UX & Information Architecture Auditor

Stable IDs. Recapture; do not duplicate AUTO_FIXED work.  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
Narrative: [`ADMIN_UX_AUDIT_2026-09-25.md`](./ADMIN_UX_AUDIT_2026-09-25.md)

---

ACTION_ID: AUX-SPELL-NO-SUMMON-CONTROLS  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Spell editor omitted summon fields the canister already persists  
CATEGORY: edit-forms  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `newSpell()` and `useAdminSetSpellConfig` already send `isSummon` / `summonAI` / `summonLifespan` / `summonUnitDef`. `validateSpellConfig` requires a known AI + piece when `isSummon`. Spell Type dropdown was damage/heal/drain only. Spell list copy said “this editor has no summon controls.” Fixed: `SpellSummonFields` after Physical Attack; checking Summon fills hunter/pawn/lifespan 3 so Save can pass validation.  
SYSTEMS_AFFECTED: SpellEditor; adminSetSpellConfig  
RECOMMENDED_ACTION: Keep the Summon section. Do not add discovery routes or a second summon type.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW — persist path unchanged; non-summon rows still clear AI  
VALIDATION_REQUIRED: New summon spell Save succeeds; toggling Summon off clears AI so a later damage Save does not fail “summonAI must be empty”; kiter/kamikaze remain selectable (runtime aliases).  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-CATALOG-SAVE-LOOKS-LIKE-DRAFT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Entity Save looked like a draft next to Boss “Save browser draft”  
CATEGORY: content-lifecycle  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemy/Region/Spell/Sprite/Modifier/Achievement gold Save publishes live with no DRAFT badge. Boss Save is localStorage. This run: live-catalog note on `SpellSummonFields` only (stack-compat). Other entity Save rows still look like drafts.  
SYSTEMS_AFFECTED: Catalog editors  
RECOMMENDED_ACTION: Keep the summon-section note. Add the same copy to other Save rows after #341-stack lands.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (copy); HUMAN for staged draft  
DEPENDENCIES: AUX-LIFE-NO-STATES  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Summon section states Save is live; Boss still says browser draft.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-SHOP-GRANT-DOUBLE-SUBMIT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Grant/Ban/Unban could be clicked again while the first write was in flight  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: After confirm, the dialog closed and the Grant/Ban/Unban buttons were enabled during the actor await. Header Saving… omitted shop writes. Not patched on `AdminDashboard.tsx` this run (#341+ overlap).  
SYSTEMS_AFFECTED: Shop tab  
RECOMMENDED_ACTION: `shopBusy` lock after confirm; disable Grant/Ban/Unban until the actor returns. Do not add bulk grant.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Confirm Grant; buttons stay disabled until toast; Cancel still does not mint.  
STATUS: NEW  

---

ACTION_ID: AUX-LIFE-NO-STATES  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No DRAFT / VALIDATION FAILED / READY / ACTIVE / INACTIVE / LEGACY  
CATEGORY: content-lifecycle  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Achievement `active` and modifier `active` are the only lifecycle bits. Every other canister Save publishes live. Boss Save is a local draft next to live entity Saves. Copy now says live; states still missing.  
SYSTEMS_AFFECTED: All admin writers  
RECOMMENDED_ACTION: Introduce explicit states. Never render a saved draft as live. Preview-before-activate.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-BOSS-LOCALSTORAGE-AS-LIVE  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: Draft save does not change player encounter tables.  
STATUS: NEW  

---

ACTION_ID: AUX-BOSS-LOCALSTORAGE-AS-LIVE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Boss Save is a browser draft; Motoko writer unused  
CATEGORY: content-lifecycle  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `useBossQueries.ts` still reads/writes `pbv_boss_configs`. Canister types still diverge. Draft wording and “Save browser draft” remain.  
SYSTEMS_AFFECTED: useBossQueries; BossesTab; `src/backend` BossConfig  
RECOMMENDED_ACTION: Align types, then staged draft → preview → activate. Show DRAFT vs ACTIVE badge.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-LIFE-NO-STATES  
REGRESSION_RISK: HIGH — live actor reject if fields diverge.  
VALIDATION_REQUIRED: Save round-trips canister; another browser sees the same kit.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NAV-FLAT-15  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Fifteen peer tabs, no groups, no command palette  
CATEGORY: navigation  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Flat `TABS` array. Sidebar scrolls. Default tab is Enemies, not Overview.  
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
EVIDENCE: Identity, stats, type, targeting, AoE, flags, tiny preview, now summon. No section tabs, validation summary, or dependency rail. Save is live.  
SYSTEMS_AFFECTED: SpellEditor  
RECOMMENDED_ACTION: Sectioned editor + validation summary. Do not add discovery routes until catalog/ownership split exists.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-LIFE-NO-STATES  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Existing fields still persist.  
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

ACTION_ID: AUX-ASSET-NO-POOL  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No visual pool / weights / activate / revert control  
CATEGORY: visual-asset-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Single optional URL. Default vs custom copy exists. Empty remains a valid default (not an error). No pool, weights, activate/deactivate, or first-class revert.  
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

ACTION_ID: AUX-DIRTY-UNUSED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Field-level dirty + beforeunload still missing  
CATEGORY: unsaved-changes  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `AdminDashboardState.isDirty` is still hardcoded `false`. Leave-editor covers listed editors. Closing the browser tab has no `beforeunload`.  
SYSTEMS_AFFECTED: `gameTypes.ts` `isDirty`; all editors  
RECOMMENDED_ACTION: Set `isDirty` from form diffs; warn only when dirty; `beforeunload` when dirty.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: None  
REGRESSION_RISK: MEDIUM — false positives will train operators to dismiss.  
VALIDATION_REQUIRED: Unchanged form can leave without dialog; dirty form warns; refresh prompts.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-LIST-NO-FILTER-SORT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Lists need sort and structured filters  
CATEGORY: list-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Search on enemies, regions, spells, sprites, modifiers, achievements, names, bosses. Purchases already had query + status. No sort by level/name; no region/effect/active facets.  
SYSTEMS_AFFECTED: Entity lists  
RECOMMENDED_ACTION: Sort + facet filters. Do not paginate until counts exceed ~100.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (search shipped); HUMAN for sort/facets  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Filter does not hide Add.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-PII-PURCHASES  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Purchases need optional column redact for screenshare  
CATEGORY: pii / list-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: GameKey table still shows email + principal with search/status. Approve/reject/emailed confirms exist. Redact still missing.  
SYSTEMS_AFFECTED: Purchases tab  
RECOMMENDED_ACTION: HUMAN — optional column redact for screenshare. Keep confirms.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED (redact)  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Filter narrows rows.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-ENEMY-STATS-INCOMPLETE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Admin EnemyConfig is a spawn template, not combat identity  
CATEGORY: terminology  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Form is hp/ap/mp/init/level/regions/sprite. Runtime combat templates also have damage/res/sp/sr/chc. Editor heading is “Spawn template.”  
SYSTEMS_AFFECTED: EnemyEditor  
RECOMMENDED_ACTION: Keep spawn-template copy. Do not add combat fields without a typed persist path.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (copy); HUMAN for persist  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if a third type is invented.  
VALIDATION_REQUIRED: Copy only until persist exists.  
STATUS: PARTIAL  

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

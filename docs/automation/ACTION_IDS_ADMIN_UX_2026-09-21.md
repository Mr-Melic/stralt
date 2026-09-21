# ACTION_IDs — 2026-09-21 Admin UX & Information Architecture Auditor

Stable IDs. Recapture; do not duplicate AUTO_FIXED work.  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
Narrative: [`ADMIN_UX_AUDIT_2026-09-21.md`](./ADMIN_UX_AUDIT_2026-09-21.md)

---

ACTION_ID: AUX-SPELL-DELETE-BUILTIN  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Built-in spells offered live delete that the canister always rejects  
CATEGORY: destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `adminDeleteSpellConfig` returns `#err("Cannot delete a built-in spell; set usableByPlayer=false to retire it")` for `shadow_strike` / `soul_rend` / `vampire_bite` / `reflect_barrier` / `thunder_clap` / `void_collapse`. SpellList still showed × + confirm; toast was generic “Failed to delete spell”. Fixed: Retire opens the editor; mutation + confirm + parent `onDelete` call `adminSpellDeleteBlockedReason`; Player Can Use hint on built-ins.  
SYSTEMS_AFFECTED: SpellList; SpellEditor; useAdminDeleteSpellConfig; adminSafety  
RECOMMENDED_ACTION: Keep delete blocked. Retire = `usableByPlayer=false` then Save (still live publish until lifecycle ships).  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-LIFE-NO-STATES  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Built-in row has Retire, no ×; custom spell still confirms delete; mutation throws the Motoko-aligned message.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-PRESET-DELETE-NO-CONFIRM  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Enemy stat presets deleted with one click  
CATEGORY: destructive-actions  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `EnemyPresets` × called `handleDelete` immediately (`enemyPresets` localStorage). Not canister-live, but operators lose named drafts. Fixed: ConfirmDialog; copy states catalog rows are unchanged.  
SYSTEMS_AFFECTED: EnemyPresets  
RECOMMENDED_ACTION: Keep confirm. Cancel must not write localStorage.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Cancel leaves the preset; Confirm removes only that id.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-LOADING-INCOMPLETE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Header Saving… ignored achievement, name, and game-config writes  
CATEGORY: loading  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `anyPending` covered enemy/region/sprite/spell/modifier only. Achievement save, name add/delete, init defaults, and `adminSetGameConfig` had no chrome indicator. Fixed: OR those mutation `isPending` flags. Shop/GameKey/Boss Rush/LevelUp still use local async (out of scope).  
SYSTEMS_AFFECTED: AdminDashboard chrome  
RECOMMENDED_ACTION: Keep the header indicator honest. Do not imply a write finished while those mutations are pending.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Saving an achievement shows ● Saving… until the mutation settles.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-BOSS-SPELL-POOL-UNFILTERED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Boss spell-pool chips were an unfiltered wall  
CATEGORY: edit-forms  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Ability chips had `ListSearch`; spell pool mapped every catalog spell. Same operator error as AUX-BOSS-ABILITY-WALL. Fixed: substring filter on name/id/type + no-match copy. Selected ids stay selected when hidden by the filter.  
SYSTEMS_AFFECTED: PhaseEditor  
RECOMMENDED_ACTION: Keep filter. Do not regroup until HUMAN category groups ship.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-BOSS-ABILITY-WALL  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Filter hides unmatched chips; selected pool ids remain on the draft.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-VISUALS-TAB-SCOPE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Visuals tab looked like a sprite library  
CATEGORY: visual-asset-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Tab label “Visuals”; body was paper-vertex palette only. Operators hunting enemy/player URLs land here. Empty custom visual is valid. Fixed: CatalogNote points to Enemies / Player Sprites and states empty = Default Pixel Visual.  
SYSTEMS_AFFECTED: VisualsTab  
RECOMMENDED_ACTION: Keep copy. Do not rename the tab until grouped IA is approved.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: AUX-ASSET-NO-POOL; AUX-NAV-FLAT-15  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Palette save path unchanged; note visible above color slots.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-SIDEBAR-COUNTS-INCOMPLETE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Sidebar counts omitted names and bosses  
CATEGORY: navigation  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Footer showed enemies/regions/sprites/spells/achievements/modifiers. Names and the 19 boss kits were missing. Fixed: Names from `getEnemyNames`; Bosses = `BOSS_IDS.length` (fixed kit list, not canister).  
SYSTEMS_AFFECTED: AdminDashboard sidebar  
RECOMMENDED_ACTION: Keep counts read-only. Do not invent purchase/ad totals.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Names count matches the names tab; Bosses shows 19.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-SPELL-NO-SUMMON-CONTROLS  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Spell editor cannot set summon AI / lifespan / unit def  
CATEGORY: edit-forms  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: CatalogNote admits “this editor has no summon controls” while `validateSpellConfig` / `adminGuard` persist `isSummon`, `summonAI`, `summonLifespan`, `summonUnitDef`. New drafts seed empty summon fields; operators cannot configure hunter/guardian/etc. from the owner tool.  
SYSTEMS_AFFECTED: SpellEditor  
RECOMMENDED_ACTION: Add a Summon section (AI select, lifespan 0–20, piece, level ≤99, hp/damage scale 0–10) gated on `isSummon`. Do not invent name-based heuristics. Keep client validation aligned with adminGuard.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SPELL-FORM-MONOLITH  
REGRESSION_RISK: MEDIUM — Inf-HP summons if scale unbounded  
VALIDATION_REQUIRED: Saving a summon round-trips AI/lifespan/unitDef; non-summon keeps empty AI.  
STATUS: NEW  

---

ACTION_ID: AUX-BOSS-LEAVE-UNWARNED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Unsaved boss drafts are discarded on tab change with no warning  
CATEGORY: unsaved-changes  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `hasOpenEditor` covers enemy/region/spell/modifier/achievement/sprite ids only. `BossesTab` `drafts` live in local component state. Switching tabs or Back to Game drops in-memory edits; only “Save browser draft” hits `pbv_boss_configs`.  
SYSTEMS_AFFECTED: BossesTab; AdminDashboard leave dialog  
RECOMMENDED_ACTION: Report dirty when `drafts` is non-empty; reuse ConfirmDialog. Do not treat localStorage-saved drafts as canister-live.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-DIRTY-UNUSED; AUX-BOSS-LOCALSTORAGE-AS-LIVE  
REGRESSION_RISK: MEDIUM — false positives if expand ≠ dirty  
VALIDATION_REQUIRED: Unchanged boss list can leave; edited unsaved boss warns; saved draft does not warn.  
STATUS: NEW  

---

ACTION_ID: AUX-BOSS-LOCALSTORAGE-AS-LIVE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Boss Save is a browser draft; Motoko writer unused  
CATEGORY: content-lifecycle  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `useBossQueries.ts` / `useAdminQueries.ts` still read/write `pbv_boss_configs`. Canister types still diverge (`iconEmoji`/`loreText`/`chc` vs `defeated`/`adminNotes`). Draft wording and “Save browser draft” remain. Duplicate loaders in two hook modules.  
SYSTEMS_AFFECTED: useBossQueries; useAdminQueries; BossesTab; `src/backend` BossConfig  
RECOMMENDED_ACTION: Align types, then staged draft → preview → activate. Show DRAFT vs ACTIVE badge. Deduplicate the two localStorage helpers.  
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
EVIDENCE: Achievement `active` and modifier `active` are the only lifecycle bits. Every other canister Save publishes live. Boss Save is a local draft next to live entity Saves. Built-in spell retire still publishes on Save.  
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
TITLE: Canister audit log and rollback have no owner view  
CATEGORY: health-audit  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getAdminAuditLog` in `main.mo`; `_recordAdminAudit` on grant/ban/GameKey/config writes; rollback: LevelUp/Game/Tier/Palette/BossRush. Settings CatalogNote lists them as having no editors. AdminDashboard never calls them.  
SYSTEMS_AFFECTED: Health tab (missing); `main.mo` audit log  
RECOMMENDED_ACTION: Read-only Audit tab: timestamp, actor, action, before/after. Link rollbacks with confirm. Do not invent a second log.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: None  
REGRESSION_RISK: LOW for read-only; MEDIUM if rollback is one-click.  
VALIDATION_REQUIRED: Grant Doka appears in the log; non-admin cannot query; rollback confirms.  
STATUS: NEW  

---

ACTION_ID: AUX-SPELL-FORM-MONOLITH  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Spell editor is one ~1k-line live publish form  
CATEGORY: edit-forms  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Identity, stats, type, targeting, AoE, flags, tiny preview. No section tabs, validation summary, or dependency rail. Save is live. Summon controls still absent (AUX-SPELL-NO-SUMMON-CONTROLS).  
SYSTEMS_AFFECTED: SpellEditor  
RECOMMENDED_ACTION: Sectioned editor + validation summary. Do not add discovery routes until catalog/ownership split exists.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-LIFE-NO-STATES; AUX-SPELL-NO-SUMMON-CONTROLS  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Existing fields still persist.  
STATUS: NEW  

---

ACTION_ID: AUX-DIRTY-UNUSED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Field-level dirty + beforeunload still missing  
CATEGORY: unsaved-changes  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `AdminDashboardState.isDirty` is still hardcoded `false`. Leave-editor covers listed editors including sprites. Closing the browser tab has no `beforeunload`. Boss drafts not included.  
SYSTEMS_AFFECTED: `gameTypes.ts` `isDirty`; all editors  
RECOMMENDED_ACTION: Set `isDirty` from form diffs; warn only when dirty; `beforeunload` when dirty.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SPRITE-LEAVE-UNWARNED; AUX-BOSS-LEAVE-UNWARNED  
REGRESSION_RISK: MEDIUM — false positives will train operators to dismiss.  
VALIDATION_REQUIRED: Unchanged form can leave without dialog; dirty form warns; refresh prompts.  
STATUS: PARTIAL  

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
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (copy shipped); HUMAN for persist  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if a third type is invented.  
VALIDATION_REQUIRED: Copy only until persist exists.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-PII-PURCHASES  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Purchases table shows email + principal with no redact  
CATEGORY: pii / list-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: GameKey table still shows email + principal with search/status. Approve/reject/emailed confirms remain. No screenshare redact.  
SYSTEMS_AFFECTED: Purchases tab  
RECOMMENDED_ACTION: HUMAN — optional column redact for screenshare. Keep confirms.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED (redact)  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Filter still narrows rows after redact.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-LIST-NO-FILTER-SORT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Lists need sort and structured filters  
CATEGORY: list-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Search on enemies, regions, spells, sprites, modifiers, achievements, names, bosses, purchases. No sort by level/name; no region/effect/active facets.  
SYSTEMS_AFFECTED: Entity lists  
RECOMMENDED_ACTION: Sort + facet filters. Do not paginate until counts exceed ~100.  
AUTONOMY: HUMAN for sort/facets  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Filter does not hide Add.  
STATUS: PARTIAL  

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
EVIDENCE: Ability filter exists. Spell pool filter added this run. Still no grouped categories.  
SYSTEMS_AFFECTED: PhaseEditor  
RECOMMENDED_ACTION: Optional category groups. Keep filters.  
AUTONOMY: HUMAN for regroup  
DEPENDENCIES: AUX-BOSS-SPELL-POOL-UNFILTERED  
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
EVIDENCE: Single optional URL. Default vs custom copy exists. Visuals tab is palette-only. No pool, weights, activate/deactivate, or first-class revert. Empty remains a valid default.  
SYSTEMS_AFFECTED: Enemy + sprite editors; Visuals tab (palette only)  
RECOMMENDED_ACTION: Weighted variants + revert-to-default without treating empty as error.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-VISUALS-TAB-SCOPE  
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
EVIDENCE: `toast`, hex `saveStatus` pill, “Saved!”, “Live save committed”, localStorage-only. Level-up still uses button “Saved ✓” without toast.  
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

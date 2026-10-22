# ACTION_IDs — 2026-10-22 Admin UX & Information Architecture Auditor

Stable IDs. Recapture; do not duplicate AUTO_FIXED work.  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
Narrative: [`ADMIN_UX_AUDIT_2026-10-22.md`](./ADMIN_UX_AUDIT_2026-10-22.md)

---

ACTION_ID: AUX-SPRITE-SAVE-CLOSE-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Close the sprite editor only after a successful live write  
CATEGORY: save-feedback  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `SpriteList.handleSave` (~1715) calls `onSave(cfg)` then `setEditingCfg(null)` immediately. Parent `onSave` (~6097) then validates walk-frame URLs and may `toast.error` + return — the form is already gone. Helper: `shouldCloseOwnerEditorAfterSave` / `shouldKeepOwnerEditorOpen` / `spriteEditorClosedBeforeSaveSettled`. Not wired (AdminDashboard overlap).  
SYSTEMS_AFFECTED: adminOwnerUx.spriteSaveClose; SpriteList  
RECOMMENDED_ACTION: After older admin PRs merge, close only when outcome is `ok`. Keep the editor on validation_failed / pending / err.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper); HUMAN for restack wiring  
DEPENDENCIES: AUX-SPRITE-SAVE-CLOSES-BEFORE-OK  
REGRESSION_RISK: LOW for helper; HIGH if invalid Save still discards the draft  
VALIDATION_REQUIRED: invalid walk URL keeps the editor; successful save closes; #err keeps the editor.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-SAVE-FEEDBACK-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: One Published / Draft saved / Failed vocabulary  
CATEGORY: save-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Shop grant toasts success and also sets hex `saveStatus` to `"Saved"`. Boss Rush toasts + hex pill + inline “Live save committed”. Ads use `"Saved"` / `"Error"` / `"Hidden default"`. Helper: `ownerSaveFeedbackCopy` / `shouldShowOwnerHexSavePill` / `ownerSaveFeedbackIsSplit`. Not wired.  
SYSTEMS_AFFECTED: adminOwnerUx.saveFeedback; all writers  
RECOMMENDED_ACTION: After wiring, one toast; no hex pill when the toast already reported. Live writes never say Draft saved.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper); HUMAN for restack wiring  
DEPENDENCIES: AUX-SAVE-FEEDBACK-SPLIT  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Shop grant shows one Published toast; Boss Save browser draft uses Draft saved.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-ENTITY-SAVE-CONFIRM-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Confirm copy for live catalog Save  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemy / spell / region / modifier / achievement / sprite Save publishes live with no confirm. System-config confirm bodies live on #539; list notes on #564. Helper: `ownerLiveCatalogSaveConfirmTitle` / `Body` / `shouldPublishLiveCatalog`. Cancel does not write. Not wired — do not auto-add six dialogs on this restack.  
SYSTEMS_AFFECTED: adminOwnerUx.entitySaveConfirm; catalog editors  
RECOMMENDED_ACTION: After #564, one confirm per live catalog Save using this copy. Cancel must not call the actor.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper); HUMAN for restack wiring  
DEPENDENCIES: AUX-ENTITY-SAVE-NO-CONFIRM  
REGRESSION_RISK: MEDIUM if unconfirmed Saves remain the only path  
VALIDATION_REQUIRED: Cancel does not mutate; body says immediately and never draft.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-CONFIG-WRITER-BUSY-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Sync lock for live system-config writers  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Boss Rush Publish, ads Save, level-up Save, palette Save, and tier Save fire actor writes with no `isPending` disable on `main`. Shop has `shopBusy` (#631); GameKey has `gameKeyBusy` (#664). Helper: `createOwnerConfigWriterLock` / `tryBeginOwnerConfigWriter` / `shouldBlockOwnerConfigWriter`. Not wired.  
SYSTEMS_AFFECTED: adminOwnerUx.configWriterBusy; Settings / Visuals / Tiers / Boss Rush / Ads  
RECOMMENDED_ACTION: After #470/#539 confirms land, wrap those writers in this lock. Distinct from shop/GameKey locks.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper); HUMAN for restack wiring  
DEPENDENCIES: AUX-CONFIG-WRITER-DOUBLE-SUBMIT  
REGRESSION_RISK: LOW for helper; HIGH if a second click republishes  
VALIDATION_REQUIRED: first begin true; second begin false until end.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-SPRITE-SAVE-CLOSES-BEFORE-OK  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Sprite Save closes the editor before validation and #ok  
CATEGORY: save-feedback  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `SpriteList.handleSave` (~1715) still clears `editingCfg` synchronously. Parent (~6097) may toast a walk-URL error and return. Operator loses the form. Close helper this run; dashboard unwired.  
SYSTEMS_AFFECTED: SpriteList; `useAdminSetPlayerSpriteConfig`  
RECOMMENDED_ACTION: HUMAN — close only via `shouldCloseOwnerEditorAfterSave("ok")`.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SPRITE-SAVE-CLOSE-HELPER  
REGRESSION_RISK: HIGH — discarded drafts look like successful Save  
VALIDATION_REQUIRED: invalid URL keeps the two-column editor open.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-ENTITY-SAVE-NO-CONFIRM  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Catalog Save still publishes live in one click  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemy/Spell/Region/Modifier/Achievement Save mutate immediately. Confirm copy this run; six dialogs not inserted (AdminDashboard overlap). System-config confirms remain queued #539.  
SYSTEMS_AFFECTED: Catalog editors  
RECOMMENDED_ACTION: HUMAN — wire `shouldPublishLiveCatalog` after #564. Do not concatenate a second confirm stack.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-ENTITY-SAVE-CONFIRM-HELPER; AUX-LIFE-NO-STATES  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Cancel leaves the live catalog unchanged.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-CONFIG-WRITER-DOUBLE-SUBMIT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Live system-config Saves have no in-flight lock  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Boss Rush Publish (~7249) is an unlocked async click. Ads Save (~8257), level-up (~4688), palette (~4911), and tiers (~4070) likewise. A double-click republishes live JSON. Shop/GameKey locks do not cover these writers. Busy helper this run; unwired.  
SYSTEMS_AFFECTED: Boss Rush / Ads / Settings / Visuals / Tiers  
RECOMMENDED_ACTION: HUMAN — `tryBeginOwnerConfigWriter` around each actor call. Keep confirms from #470/#539.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIG-WRITER-BUSY-HELPER  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: second click while in-flight is a no-op.  
STATUS: NEW  

---

ACTION_ID: AUX-SAVE-FEEDBACK-SPLIT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Three save languages  
CATEGORY: save-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `toast`, hex `saveStatus` pill, “Saved!”, “Live save committed”, localStorage-only. Vocabulary helper this run; writers still mixed. Shop grant is the clearest dual path (toast + hex `"Saved"`).  
SYSTEMS_AFFECTED: All writers  
RECOMMENDED_ACTION: One toast via `ownerSaveFeedbackCopy`; `shouldShowOwnerHexSavePill` false when toast already shown.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SAVE-FEEDBACK-HELPER; AUX-LIFE-NO-STATES  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No dual toast + hex pill for the same write.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NO-HEALTH-AUDIT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Canister audit log has no owner view  
CATEGORY: health-audit  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getAdminAuditLog` in `main.mo`; `_recordAdminAudit` on grant/ban/GameKey/config writes; frontend mock stub returns `notAdmin`; AdminDashboard never calls it. Reader helper queued #838; still no tab.  
SYSTEMS_AFFECTED: Health tab (missing); `main.mo` audit log  
RECOMMENDED_ACTION: Read-only Audit tab from `readOwnerAuditLog`. Link rollbacks with typed ROLLBACK. Do not invent a second log.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-AUDIT-VIEW-HELPER; AUX-ROLLBACK-CONFIRM-HELPER  
REGRESSION_RISK: LOW for read-only; MEDIUM if rollback is one-click.  
VALIDATION_REQUIRED: Grant Doka appears in the log; non-admin cannot query; empty log is valid.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-ROLLBACK-NO-UI  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Five last-good rollbacks have no owner buttons  
CATEGORY: health-audit  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Five rollback writers exist. Settings CatalogNote says none have editors. Typed confirm helper queued #838; still no buttons.  
SYSTEMS_AFFECTED: Settings / Health; rollback writers  
RECOMMENDED_ACTION: Confirm + typed ROLLBACK per writer using `shouldRunOwnerRollback`. Do not one-click.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-ROLLBACK-CONFIRM-HELPER  
REGRESSION_RISK: HIGH if unconfirmed  
VALIDATION_REQUIRED: Rollback restores previous blob; unauthorized shows #err.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NO-VERSION-EDITOR  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: setAppVersion / setChangelog have no owner editors  
CATEGORY: system-config  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Settings CatalogNote lists them. Hooks/mocks exist. No inputs. Confirm helper queued #838. Operators cannot ship a changelog from this console.  
SYSTEMS_AFFECTED: Settings (missing); `main.mo` setAppVersion / setChangelog  
RECOMMENDED_ACTION: HUMAN — small form with `ownerChangelogPublishGate` + confirm.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CHANGELOG-CONFIRM-HELPER  
REGRESSION_RISK: MEDIUM — bad changelog is player-visible  
VALIDATION_REQUIRED: Save hits setChangelog; validateChangelog client-side.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-PII-PURCHASES  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Purchases need optional column redact for screenshare  
CATEGORY: pii / list-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: GameKey table shows email + principal with search/status. Approves confirm. Double-submit lock queued #664. Escape/backdrop queued #492. Redact helper queued #838; UI unwired. Reveal overlay still has no Escape on `main`.  
SYSTEMS_AFFECTED: Purchases tab  
RECOMMENDED_ACTION: HUMAN — optional column redact using `redactOwnerEmail` / `redactOwnerPrincipal`. Keep confirms and the in-flight lock.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED (redact UI)  
DEPENDENCIES: AUX-PII-REDACT-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Filter still matches unredacted rows.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-DIRTY-UNUSED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Field-level dirty + beforeunload still missing on the dashboard  
CATEGORY: unsaved-changes  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `isDirty` still hardcoded `false`. Leave-editor covers listed editors including sprites. `hasOpenEditor` on `main` still omits bosses (#413 queued). Closing the browser tab has no `beforeunload`. Helper queued #838; wiring skipped.  
SYSTEMS_AFFECTED: `gameTypes.ts` `isDirty`; all editors  
RECOMMENDED_ACTION: Set `isDirty` from `ownerFormIsDirty`; warn only when dirty; `beforeunload` when dirty.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-DIRTY-HELPER; AUX-BOSS-LEAVE-UNWARNED  
REGRESSION_RISK: MEDIUM if false positives remain  
VALIDATION_REQUIRED: unchanged bigint form is not dirty; closed editor does not prompt.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NO-GLOBAL-SEARCH  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No command palette / entity jump  
CATEGORY: search  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Per-list search covers remaining entity lists. No `⌘K` across 15 tabs. Index helper queued #838; chrome unwired.  
SYSTEMS_AFFECTED: AdminDashboard chrome  
RECOMMENDED_ACTION: Quick entity search jumping to the owning tab + editor via `queryOwnerJumpIndex`.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-ENTITY-JUMP-HELPER; AUX-NAV-FLAT-15  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Jump opens the editor for that id.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-LIFE-NO-STATES  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No DRAFT / VALIDATION FAILED / READY / ACTIVE / INACTIVE / LEGACY  
CATEGORY: content-lifecycle  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Achievement `active` and modifier `active` are the only lifecycle bits. Every other canister Save publishes live. Boss Save is a local draft next to live entity Saves. Copy helper queued #724; no canister states. Collapsed boss rows still have no DRAFT chip.  
SYSTEMS_AFFECTED: All admin writers  
RECOMMENDED_ACTION: Introduce explicit states. Never render a saved draft as live. Preview-before-activate.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-BOSS-LOCALSTORAGE-AS-LIVE; AUX-LIFE-COPY-HELPER  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: Draft save does not change player encounter tables.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-BOSS-LOCALSTORAGE-AS-LIVE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Boss Save is a browser draft; Motoko writer unused  
CATEGORY: content-lifecycle  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `useAdminQueries.ts` `useSetBossConfig` still writes `pbv_boss_configs`. Canister types still diverge. Draft wording and “Save browser draft” remain. Collapsed row shows name/piece/rewards with no DRAFT chip, so an expanded-looking kit can be mistaken for live.  
SYSTEMS_AFFECTED: useBossQueries; useAdminQueries; BossesTab; `src/backend` BossConfig  
RECOMMENDED_ACTION: Align types, then staged draft → preview → activate. Show DRAFT vs ACTIVE badge on the collapsed row.  
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
EVIDENCE: Flat `TABS` array. Sidebar scrolls. No Content / World / Economy / Health groups. Default tab is Enemies, not Overview. Group map helper queued #775.  
SYSTEMS_AFFECTED: AdminDashboard sidebar  
RECOMMENDED_ACTION: Grouped IA per audit proposal. Do not add empty domain tabs.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-NAV-NO-OVERVIEW; AUX-NO-GLOBAL-SEARCH; AUX-DOMAIN-GAPS  
REGRESSION_RISK: MEDIUM — operators lose muscle memory.  
VALIDATION_REQUIRED: Every current tab remains reachable in one click from its group.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-SPELL-FORM-MONOLITH  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Spell editor is one ~1k-line live publish form  
CATEGORY: edit-forms  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Identity, stats, type, targeting, AoE, flags, tiny preview. No section tabs, validation summary, or dependency rail. Save is live. Summon controls queued #564 only. Dropdown still omits spellType summon on `main`. `SPELL_EFFECT_TYPES` omits summon. `ownerValidationSummary` queued #775; editor unwired.  
SYSTEMS_AFFECTED: SpellEditor  
RECOMMENDED_ACTION: Sectioned editor + validation summary. Do not add a second summon form.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-LIFE-NO-STATES; AUX-SPELL-NO-SUMMON-CONTROLS; AUX-EDITOR-CHROME-HELPER  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Existing fields still persist.  
STATUS: NEW  

---

ACTION_ID: AUX-NAV-NO-OVERVIEW  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No overview home  
CATEGORY: navigation  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Default tab is Enemies. No last-write strip, unpublished drafts, or validation failures. Audit log already exists server-side. Reader helper queued #838.  
SYSTEMS_AFFECTED: AdminDashboard default tab  
RECOMMENDED_ACTION: Overview from `getAdminAuditLog` + live/draft counts.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-NO-HEALTH-AUDIT  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Default landing is Overview; Enemies one click away.  
STATUS: NEW  

---

ACTION_ID: AUX-ASSET-NO-POOL  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No visual pool / weights / activate / revert control  
CATEGORY: visual-asset-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Single optional URL. Default vs custom copy exists on `main`. Empty remains a valid default. No pool, weights, activate/deactivate, or first-class revert. Thumbnail helper queued #631. Pool copy helper queued #724.  
SYSTEMS_AFFECTED: Enemy + sprite editors; Visuals tab (palette only)  
RECOMMENDED_ACTION: Weighted variants + revert-to-default without treating empty as error. Display upload requirements before file selection.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-ENEMY-NO-THUMBNAIL; AUX-ASSET-POOL-COPY  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Empty pool = Default Pixel Visual active fallback.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NO-DEPENDENCY-VIEWS  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No relationship pane for spell / enemy / asset  
CATEGORY: dependency-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Spell↔boss pools exist only as chips in an expanded boss. Enemy↔regions is a checkbox list. Badge helper queued #724; no pane.  
SYSTEMS_AFFECTED: All content editors  
RECOMMENDED_ACTION: Read-only dependency rail + badges using `adminOwnerUx.deps`.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-DOMAIN-GAPS; AUX-DEP-RAIL-HELPER  
REGRESSION_RISK: LOW for read-only.  
VALIDATION_REQUIRED: Click-through does not mutate.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-CATALOG-SAVE-LOOKS-LIKE-DRAFT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Catalog Save buttons still read as drafts  
CATEGORY: content-lifecycle  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemy/Spell/Region/Achievement buttons say “Save …”. Canister writes publish immediately. Boss Save is the only honest “Save browser draft”. Vocabulary helper queued #724; editors unwired. Confirm helper this run is live-not-draft copy.  
SYSTEMS_AFFECTED: All catalog editors  
RECOMMENDED_ACTION: HUMAN — one Publish live vocabulary after #564 lands.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-LIFE-NO-STATES; AUX-LIFE-COPY-HELPER; AUX-SPELL-NO-SUMMON-CONTROLS  
REGRESSION_RISK: LOW for copy  
VALIDATION_REQUIRED: Live writes never say Draft saved.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-DOMAIN-GAPS  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Missing owner domains must not become empty tabs  
CATEGORY: information-architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Challenges hardcoded. AI/formations/encounters/dungeons/discovery/simulation/telemetry have no admin API. Shop packages are retired on the player path. Audit log *does* have an API. Version/changelog/rollbacks have APIs and no UI. Jump index omits those keys on purpose.  
SYSTEMS_AFFECTED: Future tabs  
RECOMMENDED_ACTION: Do not add empty Challenges/AI/Formations/Dungeons/Telemetry tabs. Prefer Audit + version/rollback editors.  
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

ACTION_ID: AUX-NO-BREADCRUMBS  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Editor replaces the list with no trail  
CATEGORY: navigation  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Enemy/region/spell editors swap the list. No `Enemies / Shadow Knight`. Helper queued #775; editors unwired.  
SYSTEMS_AFFECTED: Editors  
RECOMMENDED_ACTION: Breadcrumb + Back that honors dirty warning.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-DIRTY-UNUSED; AUX-EDITOR-CHROME-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Breadcrumb returns to the same list filter.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NO-MOBILE-ADMIN  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Viewport guard is player-oriented  
CATEGORY: responsive  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `App.tsx` small-screen guard is bypassable but console `×` targets stay <44px. Owner-on-laptop-narrow is not a first-class layout. ConfirmDialog Btn is shorter than PurchaseConfirm’s 44px targets.  
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

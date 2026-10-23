# ACTION_IDs — 2026-10-23 Admin UX & Information Architecture Auditor

Stable IDs. Recapture; do not duplicate AUTO_FIXED work.  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
Narrative: [`ADMIN_UX_AUDIT_2026-10-23.md`](./ADMIN_UX_AUDIT_2026-10-23.md)

---

ACTION_ID: AUX-CONFIRM-DISMISS-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Keep owner confirms mounted until the actor write settles  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Shop grant (`AdminDashboard.tsx` ~5729) does `setShopConfirm(null)` then `adminAddDokaToUser`. Ban/unban same. GameKey approve/reject/emailed (`AdminGameKeyPurchases.tsx` ~846–877) close PurchaseConfirm then mutate. Ad Clear (~8195) and catalog deletes (~2281, ~2498, ~3797, ~5702) unmount then write. A `#err` leaves only a toast. Helper: `shouldDismissOwnerConfirm` is true only for `ok`; pending disables confirm. Not wired (stack).  
SYSTEMS_AFFECTED: ConfirmDialog; PurchaseConfirm; Shop; Purchases; Ad Boxes; entity deletes  
RECOMMENDED_ACTION: Keep dialog until `#ok`. Show Failed in-dialog on `#err`. Do not restack AdminDashboard.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-SHOP-GRANT-DOUBLE-SUBMIT; AUX-CONFIRM-DOUBLE-CLICK  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring changes cancel  
VALIDATION_REQUIRED: Cancel still does not write; failed grant keeps the dialog; confirm is disabled while pending.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-CONFIRM-DISMISS-BEFORE-SETTLE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Confirms unmount before the live write returns  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-CONFIRM-DISMISS-HELPER. Distinct from sprite editor close (#883) and the shopBusy lock (#631). On `main` the operator can reopen Grant while the first credit is in flight.  
SYSTEMS_AFFECTED: Shop; Purchases; Ad Boxes; deletes  
RECOMMENDED_ACTION: Wire `shouldDismissOwnerConfirm` + existing shopBusy / gameKeyBusy. HUMAN for dashboard.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED (wiring)  
DEPENDENCIES: AUX-CONFIRM-DISMISS-HELPER; AUX-SHOP-GRANT-DOUBLE-SUBMIT  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Double-click Grant credits once; failed ban still shows the dialog.  
STATUS: NEW  

---

ACTION_ID: AUX-CONFIG-HYDRATE-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Honesty copy for localStorage-only system-config forms  
CATEGORY: content-lifecycle  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Helper `ownerConfigFormIsLive` / `ownerConfigHydrateHonestyCopy` / `ownerPaletteResetIsLiveRevert`. Documents Tiers + Visuals as non-hydrating on `main`. Distinct from #775 `shouldAllowOwnerLivePublish` (Save gate) and #883 configWriterBusy (click lock). Not wired.  
SYSTEMS_AFFECTED: Enemy Tiers; Visuals; Settings LevelUp (contrast: does hydrate)  
RECOMMENDED_ACTION: Keep copy. Do not treat local cache as live.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-TIER-NO-CANISTER-HYDRATE; AUX-VISUALS-NO-CANISTER-HYDRATE  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Unit tests; Tiers/Visuals copy must not say Published until `getTierSpawnConfig` / `getColorPalette` succeed.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-TIER-NO-CANISTER-HYDRATE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Enemy Tiers editor never reads getTierSpawnConfig  
CATEGORY: content-lifecycle  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `TierConfigTab` (`AdminDashboard.tsx` ~3817–3870) seeds from `pbv_tier_spawn_config` and writes `adminSetTierSpawnConfig`. There is no `getTierSpawnConfig` call in AdminDashboard. WorldExploration hydrates the live table from the canister. An operator can publish a stale browser cache as live encounter weights. #775 publishGate listed level-up / palette / Boss Rush, not Tiers.  
SYSTEMS_AFFECTED: Enemy Tiers tab; spawn policy  
RECOMMENDED_ACTION: Hydrate from `getTierSpawnConfig` before the form is editable; block Save until that read succeeds (reuse #775 gate). Label the form DRAFT until hydrated. HUMAN for dashboard.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIG-HYDRATE-HELPER; AUX-CONFIG-CACHE-PREEMPT-PUBLISH; AUX-LIFE-NO-STATES  
REGRESSION_RISK: HIGH — publishing local cache changes live encounter mix  
VALIDATION_REQUIRED: Two browsers: A publishes 70/15/10/5; B opens Tiers and must show 70/15/10/5, not a leftover local 60/20/10/5.  
STATUS: NEW  

---

ACTION_ID: AUX-VISUALS-NO-CANISTER-HYDRATE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Visuals editor never reads getColorPalette  
CATEGORY: content-lifecycle  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `VisualsTab` (~4697–4743) seeds from `pbv_color_palette` / `paperVertexPalette` and writes `adminSetColorPalette`. No `getColorPalette` in AdminDashboard. WorldExploration reads the canister (~936). #775 assumed palette hydrates; it does not.  
SYSTEMS_AFFECTED: Visuals tab; map paper vertices  
RECOMMENDED_ACTION: Hydrate from `getColorPalette` before Save. HUMAN for dashboard.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIG-HYDRATE-HELPER; AUX-PALETTE-RESET-NOT-LIVE  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Second browser sees the published palette without copying localStorage.  
STATUS: NEW  

---

ACTION_ID: AUX-PALETTE-RESET-NOT-LIVE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Visuals Reset discards local keys only  
CATEGORY: content-lifecycle  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `handleReset` (~4745–4749) `removeItem`s `paperVertexPalette` and `pbv_color_palette` and restores `DEFAULT_PALETTE` in React state. It does not call `adminRollbackColorPalette`. Players keep the last published blob. Distinct from AUX-PALETTE-RESET-NO-CONFIRM (#470, missing dialog). Helper: `ownerPaletteResetIsLiveRevert` is false unless rollback is called.  
SYSTEMS_AFFECTED: Visuals tab; color palette rollback  
RECOMMENDED_ACTION: Label Reset as “Discard local draft”. Live revert must call `adminRollbackColorPalette` with typed confirm (#838). HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-PALETTE-RESET-NO-CONFIRM; AUX-ROLLBACK-NO-UI  
REGRESSION_RISK: HIGH if Reset is wired to rollback without confirm  
VALIDATION_REQUIRED: Reset does not change `getColorPalette` until rollback is explicit.  
STATUS: NEW  

---

ACTION_ID: AUX-OVERLAY-KEY-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Escape / backdrop close for non-confirm owner overlays  
CATEGORY: destructive-actions  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Helper `shouldCloseOwnerOverlayOnKey("Escape")`. GameKey reveal (`AdminGameKeyPurchases.tsx` ~716–837) has Close only. Distinct from PurchaseConfirm Escape (#492) and ConfirmDialog Escape (#539). Not wired.  
SYSTEMS_AFFECTED: Purchases reveal overlay  
RECOMMENDED_ACTION: Keep helper. Wire Escape without restacking #492/#664 if possible.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-REVEAL-NO-ESCAPE  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Escape closes reveal without marking emailed.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-REVEAL-NO-ESCAPE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: GameKey reveal overlay ignores Escape  
CATEGORY: destructive-actions  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reveal overlay ~716–837 is a full-screen dimmer with Copy / mailto / Mark emailed / Close. No `keydown` listener. Distinct from AUX-PURCHASE-CONFIRM-NO-ESCAPE (the Approve/Reject/Emailed dialogs).  
SYSTEMS_AFFECTED: AdminGameKeyPurchases reveal  
RECOMMENDED_ACTION: Escape and backdrop click call the existing Close path. Do not mark emailed. HUMAN — file overlaps #492/#664.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-OVERLAY-KEY-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Escape does not wipe the plaintext key.  
STATUS: NEW  

---

ACTION_ID: AUX-VISUAL-REVERT-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Revert-to-default copy for owner visuals  
CATEGORY: visual-asset-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Helper `ownerVisualRevertLabel` = “Revert to Default Pixel Visual”; `shouldOfferOwnerVisualRevert` only when a custom override exists; `ownerVisualRevertIsError()` is always false. Distinct from #724 pool/status copy. Not wired.  
SYSTEMS_AFFECTED: Enemy editor; sprite editor; Ad Boxes (contrast: already has Clear)  
RECOMMENDED_ACTION: Keep copy. Empty after revert must stay a valid default.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-VISUAL-NO-REVERT-CONTROL; AUX-VIS-NO-DEFAULT-DISTINCTION  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Revert does not toast an error; status becomes Default Pixel Visual — Active fallback.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-VISUAL-NO-REVERT-CONTROL  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Enemy and sprite editors have no Revert to Default  
CATEGORY: visual-asset-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Enemy editor (~816–845) is a URL field + status line. Sprite editor (~1470–1585) has a preview and optional facing URLs. Ads (~8260) have “Clear to default”. Empty URL is implicit revert and is valid, but operators have no explicit control, activate/deactivate, or weights. Prompt requires revert-to-default.  
SYSTEMS_AFFECTED: EnemyEditor; SpriteEditorForm  
RECOMMENDED_ACTION: Add Revert using `ownerVisualRevertLabel`. Do not treat empty as error. Do not invent a pool without a persist path (AUX-ASSET-NO-POOL). HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-VISUAL-REVERT-HELPER; AUX-ASSET-NO-POOL  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Revert clears stored URL; list chip returns to Default pixel visual.  
STATUS: NEW  

---

ACTION_ID: AUX-NAMES-ADD-DOUBLE-SUBMIT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Enemy Names Add is not locked while pending  
CATEGORY: bulk-operations  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Names tab (~7362–7403) fires `addEnemyNameMut.mutate` on Enter and on + Add Name with no `disabled={addEnemyNameMut.isPending}`. Double Enter can insert the same name twice before the query invalidates. Distinct from configWriterBusy (#883) and shopBusy (#631). No helper this run (avoid a fifth busy-lock file).  
SYSTEMS_AFFECTED: Enemy Names tab  
RECOMMENDED_ACTION: Disable input + button while pending; ignore Enter when pending. HUMAN — AdminDashboard overlap.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Rapid Enter adds one name.  
STATUS: NEW  

---

ACTION_ID: AUX-NO-HEALTH-AUDIT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Canister audit log has no owner view  
CATEGORY: health-audit  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getAdminAuditLog` in `main.mo`; Settings CatalogNote (~4230–4234) admits no editor. Mock returns `notAdmin`. Reader helper queued #838. Still no Health tab.  
SYSTEMS_AFFECTED: Health tab (missing)  
RECOMMENDED_ACTION: Read-only Audit tab. Do not invent a second log. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-AUDIT-VIEW-HELPER  
REGRESSION_RISK: LOW for read-only  
VALIDATION_REQUIRED: Grant Doka appears in the log; non-admin cannot query.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-ROLLBACK-NO-UI  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Rollback writers have no owner buttons  
CATEGORY: health-audit  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `adminRollbackLevelUpConfig` / `GameConfig` / `TierSpawnConfig` / `ColorPalette` / `BossRushConfig` exist. Typed ROLLBACK helper queued #838. Visuals Reset is not rollback (AUX-PALETTE-RESET-NOT-LIVE).  
SYSTEMS_AFFECTED: Settings / Visuals / Tiers / Boss Rush  
RECOMMENDED_ACTION: Typed confirm per writer. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-ROLLBACK-CONFIRM-HELPER  
REGRESSION_RISK: HIGH if one-click  
VALIDATION_REQUIRED: Rollback restores last-good blob; Cancel does not write.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NO-VERSION-EDITOR  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: setAppVersion / setChangelog have no Settings form  
CATEGORY: system-config  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Settings honesty note lists them. Confirm helper queued #838. No inputs on `main`.  
SYSTEMS_AFFECTED: Settings  
RECOMMENDED_ACTION: Staged version + changelog with confirm. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CHANGELOG-CONFIRM-HELPER  
REGRESSION_RISK: HIGH — version bump forces re-login  
VALIDATION_REQUIRED: Cancel does not call `setAppVersion`.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-PII-PURCHASES  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Purchases table still shows email + principal  
CATEGORY: pii / list-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Table columns Player / Email (~497–506). Redact helper queued #838; UI unwired. Search/status already present.  
SYSTEMS_AFFECTED: Purchases tab  
RECOMMENDED_ACTION: Optional column redact for screenshare. Keep confirms. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-PII-REDACT-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Filter still matches redacted rows by id.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-DIRTY-UNUSED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Field-level dirty + beforeunload still missing  
CATEGORY: unsaved-changes  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `isDirty` hardcoded `false` (~5361). `hasOpenEditor` (~5479–5485) omits bosses, ads, names, shop, tiers, settings, visuals, boss rush. Leave-editor still fires for clean catalog forms. Helper queued #838.  
SYSTEMS_AFFECTED: All editors  
RECOMMENDED_ACTION: `ownerFormIsDirty` + `beforeunload`; include inline config tabs. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-DIRTY-HELPER; AUX-BOSS-LEAVE-UNWARNED  
REGRESSION_RISK: MEDIUM — false positives train dismiss  
VALIDATION_REQUIRED: Unchanged form leaves silently; dirty warns; refresh prompts.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NO-GLOBAL-SEARCH  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No command palette / entity jump  
CATEGORY: search  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Per-list search only. Index helper queued #838. No ⌘K.  
SYSTEMS_AFFECTED: AdminDashboard chrome  
RECOMMENDED_ACTION: Quick entity search to owning tab + editor. HUMAN.  
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
EVIDENCE: Achievement `active` and modifier `active` are the only lifecycle bits. Every other canister Save publishes live. Boss Save is a local draft next to live entity Saves. Copy helper queued #724. Tiers/Visuals local cache can be mistaken for ACTIVE (this run).  
SYSTEMS_AFFECTED: All admin writers  
RECOMMENDED_ACTION: Explicit states. Never render a saved draft as live. Preview-before-activate. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-BOSS-LOCALSTORAGE-AS-LIVE; AUX-TIER-NO-CANISTER-HYDRATE  
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
EVIDENCE: `useBossQueries.ts` still reads/writes `pbv_boss_configs`. Collapsed row (~7904–7919) has no DRAFT chip. Save copy is honest (“browser-local drafts only”). Types still diverge.  
SYSTEMS_AFFECTED: useBossQueries; BossesTab; Motoko BossConfig  
RECOMMENDED_ACTION: Align types, then staged draft → preview → activate. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-LIFE-NO-STATES  
REGRESSION_RISK: HIGH — live actor reject if fields diverge  
VALIDATION_REQUIRED: Save round-trips canister; another browser sees the same kit.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NAV-FLAT-15  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Fifteen peer tabs, no groups, no command palette  
CATEGORY: navigation  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Flat `TABS` (~5606–5626). Sidebar 180px, overflowY auto. No Content / World / Economy / Health groups. Default tab is Enemies. Group helper queued #775.  
SYSTEMS_AFFECTED: AdminDashboard sidebar  
RECOMMENDED_ACTION: Grouped IA per audit proposal. Do not add empty domain tabs. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-NAV-NO-OVERVIEW; AUX-NO-GLOBAL-SEARCH; AUX-DOMAIN-GAPS  
REGRESSION_RISK: MEDIUM — muscle memory  
VALIDATION_REQUIRED: Every current tab remains reachable in one click from its group.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-SPELL-FORM-MONOLITH  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Spell editor is one live publish form without summon controls  
CATEGORY: edit-forms  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Identity, stats, type (damage/heal/drain only ~2684), targeting, AoE, flags, tiny preview. CatalogNote (~3640–3645) admits no summon controls. `SPELL_EFFECT_TYPES` (~2510) omits summon/drain. Summon editor queued #564. Save is live.  
SYSTEMS_AFFECTED: SpellEditor  
RECOMMENDED_ACTION: Sectioned editor + summon fields + validation summary. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SPELL-NO-SUMMON-CONTROLS; AUX-LIFE-NO-STATES  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Existing fields still persist; summon AI validated.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NAV-NO-OVERVIEW  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No overview home  
CATEGORY: navigation  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Default tab is Enemies. No last-write strip. Audit log exists server-side.  
SYSTEMS_AFFECTED: AdminDashboard default tab  
RECOMMENDED_ACTION: Overview from `getAdminAuditLog` + live/draft counts. HUMAN.  
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
EVIDENCE: Single optional URL. Default vs custom copy exists. No pool, weights, activate/deactivate. Revert helper this run (copy only). Empty remains a valid default.  
SYSTEMS_AFFECTED: Enemy + sprite editors; Visuals tab (palette only)  
RECOMMENDED_ACTION: Weighted variants + revert-to-default without treating empty as error. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-VISUAL-NO-REVERT-CONTROL  
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
EVIDENCE: Spell↔boss pools exist only as unfiltered chips. Enemy↔regions is a checkbox list. No enemy→encounters/dungeons, asset→usage, spell→achievements/challenges. Rail helper queued #724.  
SYSTEMS_AFFECTED: All content editors  
RECOMMENDED_ACTION: Read-only dependency rail + badges. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-DEP-RAIL-HELPER; AUX-DOMAIN-GAPS  
REGRESSION_RISK: LOW for read-only  
VALIDATION_REQUIRED: Click-through does not mutate.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-CATALOG-SAVE-LOOKS-LIKE-DRAFT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Live catalog buttons still say Save  
CATEGORY: terminology  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: “Save Enemy” / “Save Spell” / “Save Achievement” publish live. Boss button says “Save browser draft” (honest). Lifecycle copy helper queued #724. Confirm copy queued #883.  
SYSTEMS_AFFECTED: Entity editors  
RECOMMENDED_ACTION: “Publish live …” vs “Save browser draft”. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-LIFE-NO-STATES; AUX-ENTITY-SAVE-NO-CONFIRM  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Copy matches writer (canister vs localStorage).  
STATUS: PARTIAL  

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
RECOMMENDED_ACTION: Bulk only after confirm + dependency summary. HUMAN.  
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
EVIDENCE: Economy fields above modifier list (~6199). Leader boost is also unused on the combat path (drift #887) — do not “fix” combat from this auditor.  
SYSTEMS_AFFECTED: Modifiers tab; Settings  
RECOMMENDED_ACTION: Move economy fields to Economy / System Config when IA is grouped. Label leader boost unused until a reader exists. HUMAN.  
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
EVIDENCE: Helper queued #883. Boss Rush still toast “published (live)” plus hex `Saved` (~7258–7262). Shop grant toast + hex. Level-up inline `saved`.  
SYSTEMS_AFFECTED: All writers  
RECOMMENDED_ACTION: One vocabulary: Published / Draft saved / Failed. Drop hex pill when a toast already reported. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SAVE-FEEDBACK-HELPER; AUX-LIFE-NO-STATES  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No dual toast + hex pill for the same write.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NO-BREADCRUMBS  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Editor replaces the list with no trail  
CATEGORY: navigation  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Enemy/region/spell editors swap the list. Chrome helper queued #775.  
SYSTEMS_AFFECTED: Editors  
RECOMMENDED_ACTION: Breadcrumb + Back that honors dirty warning. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-DIRTY-UNUSED; AUX-EDITOR-CHROME-HELPER  
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

ACTION_ID: AUX-LIST-NO-FILTER-SORT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Lists need sort and structured filters  
CATEGORY: list-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Search on enemies, regions, spells, sprites, modifiers, achievements, names, bosses. Purchases has query + status. Sort/facet helper queued #775; UI unwired.  
SYSTEMS_AFFECTED: Entity lists  
RECOMMENDED_ACTION: Sort + facet filters. Do not paginate until counts exceed ~100. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-LIST-SORT-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Filter does not hide Add.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-ENEMY-STATS-INCOMPLETE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Admin EnemyConfig is a spawn template, not combat identity  
CATEGORY: terminology  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Form is hp/ap/mp/init/level/regions/sprite. Runtime combat templates also have damage/res/sp/sr/chc. Editor heading is “Spawn template”.  
SYSTEMS_AFFECTED: EnemyEditor  
RECOMMENDED_ACTION: Keep spawn-template copy. Do not add combat fields without a typed persist path.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (copy already on `main`); HUMAN for persist  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if a third type is invented  
VALIDATION_REQUIRED: Copy only until persist exists.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-ENTITY-SAVE-NO-CONFIRM  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Live catalog Save is one click  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Confirm copy helper queued #883. Enemy/spell/region/modifier/achievement/sprite Save still publish immediately. Do not auto-add six dialogs this run.  
SYSTEMS_AFFECTED: Catalog editors  
RECOMMENDED_ACTION: Confirm using `ownerLiveCatalogSaveConfirmBody`. Cancel does not write. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-ENTITY-SAVE-CONFIRM-HELPER  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Cancel leaves the form dirty and does not call the actor.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-SPRITE-SAVE-CLOSES-BEFORE-OK  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Sprite editor closes before walk-URL validation / #ok  
CATEGORY: save-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `SpriteList.handleSave` (~1715–1718) calls `onSave` then clears the editor. Parent (~6097–6117) then validates walk URLs. Helper queued #883.  
SYSTEMS_AFFECTED: SpriteList  
RECOMMENDED_ACTION: Close only after `#ok` (`shouldCloseOwnerEditorAfterSave`). HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SPRITE-SAVE-CLOSE-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Invalid walk URL keeps the form; failed mutate keeps the form.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-CONFIG-WRITER-DOUBLE-SUBMIT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Live system-config writers have no busy lock  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Helper queued #883 covers level-up / palette / tiers / game config / Boss Rush / ads. Buttons on `main` still fire a second publish. Names Add is a related gap (AUX-NAMES-ADD-DOUBLE-SUBMIT).  
SYSTEMS_AFFECTED: Settings; Visuals; Tiers; Modifiers; Boss Rush; Ads  
RECOMMENDED_ACTION: Wire `shouldBlockOwnerConfigWriter`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIG-WRITER-BUSY-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Second click while pending is a no-op.  
STATUS: PARTIAL  

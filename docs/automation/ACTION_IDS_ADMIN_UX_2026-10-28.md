# ACTION_IDs — 2026-10-28 Admin UX & Information Architecture Auditor

Stable IDs. Recapture; do not duplicate AUTO_FIXED work.  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
Narrative: [`ADMIN_UX_AUDIT_2026-10-28.md`](./ADMIN_UX_AUDIT_2026-10-28.md)

---

ACTION_ID: AUX-OWNER-STATUS-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Owner Purchases status must not use player Buy Doka copy  
CATEGORY: terminology  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `AdminGameKeyPurchases.tsx` ~601 calls `playerGameKeyStatusCopy(rec.status)`. That helper (`dokaGameKey.ts` ~96–108) returns “Approved — check email for your GameKey” and “Request cancelled — you may submit again”. The owner table has a separate `emailed` flag (~601). Helper: `ownerGameKeyStatusCopy`. Not wired (stack). Distinct from #1190 copyFollowup (clipboard toast) and player `DokaGameKeyShop.tsx`.  
SYSTEMS_AFFECTED: AdminGameKeyPurchases status column  
RECOMMENDED_ACTION: Render `ownerGameKeyStatusCopy(rec.status, rec.emailed)`. Keep player copy on Buy Doka. Do not restack Purchases.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-PURCHASE-PLAYER-STATUS-COPY  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring changes player shop strings  
VALIDATION_REQUIRED: Approved + emailed=false reads “awaiting email”; player shop still says check email.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-PURCHASE-PLAYER-STATUS-COPY  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Purchases status column uses player-facing GameKey copy  
CATEGORY: terminology  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-OWNER-STATUS-HELPER. Operator can Mark emailed after believing the player already has mail. HUMAN — Purchases overlap #492/#664/#838/#1066/#1115/#1190.  
SYSTEMS_AFFECTED: Purchases table  
RECOMMENDED_ACTION: Wire `ownerGameKeyStatusCopy`. Keep the emailed suffix from the current cell.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-OWNER-STATUS-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Filter by status still matches actor `status` values, not the label.  
STATUS: NEW  

---

ACTION_ID: AUX-CONSENT-GATE-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Open mailto must require player emailConsent  
CATEGORY: pii / destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `mapGameKeyRequestFromBackend` stores `emailConsent` (`dokaGameKey.ts` ~185). `AdminGameKeyPurchases.tsx` never reads it. Open mailto (~783–800) always uses `gameKeyMailtoHref(reveal.email, reveal.code)`. Helper: `shouldEnableOwnerMailto` / `ownerConsentStatusCopy`. Not wired. Distinct from #1115 mailtoSecret (URL body) and #838 piiRedact (screenshare mask).  
SYSTEMS_AFFECTED: Purchases reveal overlay; request table  
RECOMMENDED_ACTION: Badge consent on the row; `href="#"` when `shouldEnableOwnerMailto` is `#err`. Do not restack Purchases or `dokaGameKey.ts`.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-PURCHASE-CONSENT-HIDDEN; AUX-MAILTO-NO-CONSENT-GATE  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring hides a consented mailto  
VALIDATION_REQUIRED: Consent-false never produces a mailto href; consent-true + valid email still can.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-PURCHASE-CONSENT-HIDDEN  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Purchases table never shows emailConsent  
CATEGORY: pii  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Columns are Player / Email / Hint € / Doka / Status / When / Actions (`AdminGameKeyPurchases.tsx` ~498–506). `rec.emailConsent` is unused in the component. Empty consent is not a valid “mail anyway” default. HUMAN — Purchases overlap.  
SYSTEMS_AFFECTED: Purchases table  
RECOMMENDED_ACTION: Wire `ownerConsentStatusCopy` as a badge. Do not treat missing consent as an error state on the request itself.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONSENT-GATE-HELPER; AUX-PII-PURCHASES  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: A consented row is visually distinct from an unconsented row; search still works.  
STATUS: NEW  

---

ACTION_ID: AUX-MAILTO-NO-CONSENT-GATE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Open mailto ignores emailConsent  
CATEGORY: pii / destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reveal overlay Open mailto (~783–800) does not receive `emailConsent`. Combined with AUX-MAILTO-EMBEDS-KEY the live GameKey is placed in a URL for a player who may have refused mail. HUMAN — Purchases overlap #361/#1115.  
SYSTEMS_AFFECTED: Purchases reveal  
RECOMMENDED_ACTION: Wire `shouldEnableOwnerMailto` before setting href. Keep Copy on the overlay (after format + mask gates).  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONSENT-GATE-HELPER; AUX-MAILTO-SECRET-HELPER; AUX-REVEAL-FORMAT-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Unconsented reveal shows Copy + Mark emailed; Open mailto is disabled.  
STATUS: NEW  

---

ACTION_ID: AUX-SPELL-DELETE-COPY-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Spell Delete confirm and success copy must distinguish retire vs remove  
CATEGORY: terminology / destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: SpellList confirm body (`AdminDashboard.tsx` ~3792–3794) says the live spell is removed immediately. `onDelete` toasts “Spell deleted” (~6166). `adminDeleteSpellConfig` (`main.mo` ~882–901) `#err`s built-ins, retires player-owned rows (`#ok`), and only then removes. `onError` (~6167) is the generic “Failed to delete spell”. Helper: `ownerSpellDeleteBlockedReason` / `ownerSpellDeleteSuccessCopy` / `ownerActorErrorToast`. Not wired. Distinct from #341 builtin-delete UI and #564 summon fields.  
SYSTEMS_AFFECTED: SpellList; useAdminDeleteSpellConfig  
RECOMMENDED_ACTION: Block confirm with `shouldOpenOwnerSpellDeleteConfirm`; toast `ownerActorErrorToast`; after `#ok` use `ownerSpellDeleteSuccessCopy(stillInCatalog)`. Do not restack AdminDashboard.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-SPELL-RETIRE-TOAST-AS-DELETE; AUX-SPELL-DELETE-SWALLOWS-ERR; AUX-SPELL-DELETE-BUILTIN  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring hides Delete on custom spells  
VALIDATION_REQUIRED: `void_collapse` does not open Delete confirm; a custom unused id still can.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-SPELL-RETIRE-TOAST-AS-DELETE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Player-owned spell retire is toasted as Spell deleted  
CATEGORY: save-feedback / content-lifecycle  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `_spellReferencedByPlayers` path returns `#ok` after `usableByPlayer=false` (`main.mo` ~889–897). UI always toasts “Spell deleted” (~6166). The row remains in `getSpellConfigs`. HUMAN — SpellList overlap #341/#564.  
SYSTEMS_AFFECTED: Spells tab  
RECOMMENDED_ACTION: Wire `ownerSpellDeleteSuccessCopy` from post-invalidate catalog membership. Do not claim ACTIVE after retire.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SPELL-DELETE-COPY-HELPER; AUX-LIFE-NO-STATES; AUX-SPELL-RETIRED-UNLABELED  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Owned custom spell stays in the list and reads retired, not deleted.  
STATUS: NEW  

---

ACTION_ID: AUX-SPELL-DELETE-SWALLOWS-ERR  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Built-in delete `#err` is toasted as Failed to delete spell  
CATEGORY: errors  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Canister message is “Cannot delete a built-in spell; set usableByPlayer=false to retire it” (`main.mo` ~887). Mutation `assertAdminCmdOk` throws that text; SpellList `onError` ignores it (~6167). HUMAN — SpellList overlap #341.  
SYSTEMS_AFFECTED: Spells tab  
RECOMMENDED_ACTION: Wire `ownerActorErrorToast(err, "Failed to delete spell")`. Prefer blocking the confirm via AUX-SPELL-DELETE-COPY-HELPER.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SPELL-DELETE-COPY-HELPER; AUX-SPELL-DELETE-BUILTIN  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Built-in Delete (if still shown) surfaces usableByPlayer, not a generic fail.  
STATUS: NEW  

---

ACTION_ID: AUX-AD-HYDRATE-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Failed ad hydrate must not reuse the hidden-default valid-empty copy  
CATEGORY: visual-asset-ux / errors  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `AdBoxEditor` (~8125–8140) `getAdBoxes().catch(() => {})` leaves `imageUrl`/`linkUrl` "". Status copy (~8220–8222) then renders “No custom ad — box hidden (valid default)”. Empty after a **successful** load is still valid (AUX-AD-EMPTY-AS-ERROR). Helper: `ownerAdHydrateKind` / `shouldDisableOwnerAdWrite`. Not wired. Distinct from #470 AUX-ADS-SAVE-SILENT-ERROR (save/clear catch).  
SYSTEMS_AFFECTED: Ad Boxes tab  
RECOMMENDED_ACTION: Track load ok/fail; disable Save/Clear when `shouldDisableOwnerAdWrite`. Do not restack AdBoxEditor.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-AD-LOAD-SILENT-FAIL; AUX-AD-EMPTY-AS-ERROR  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring treats a slow load as failed forever  
VALIDATION_REQUIRED: Successful empty load still says valid default; failed load disables Clear.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-AD-LOAD-SILENT-FAIL  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Ad editor treats a failed getAdBoxes as the hidden default  
CATEGORY: visual-asset-ux / errors  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-AD-HYDRATE-HELPER. Operator can Confirm Clear and wipe a live slot they never saw. HUMAN — AdBoxEditor overlap #470.  
SYSTEMS_AFFECTED: Ad Boxes  
RECOMMENDED_ACTION: Wire hydrate kind + disable writes until Retry succeeds. Keep empty-after-ok as valid.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-AD-HYDRATE-HELPER; AUX-ADS-SAVE-SILENT-ERROR  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Offline actor shows load-failed, not hidden-default; Retry restores live URLs.  
STATUS: NEW  

---

ACTION_ID: AUX-LIFE-NO-STATES  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No DRAFT / VALIDATION FAILED / READY / ACTIVE / INACTIVE / LEGACY  
CATEGORY: content-lifecycle  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Achievement `active` and modifier `active` are the only lifecycle bits. Every canister Save publishes live. Boss Save is a local draft next to live entity Saves. Spell retire is toasted as deleted.  
SYSTEMS_AFFECTED: All admin writers  
RECOMMENDED_ACTION: Introduce explicit states. Never render a saved draft as live. Preview-before-activate.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-BOSS-LOCALSTORAGE-AS-LIVE  
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
EVIDENCE: `useBossQueries.ts` still reads/writes `pbv_boss_configs`. Canister types still diverge. Draft wording and “Save browser draft” remain (~7837–7839, ~7779–7780).  
SYSTEMS_AFFECTED: useBossQueries; BossesTab  
RECOMMENDED_ACTION: Align types, then staged draft → preview → activate. Show DRAFT vs ACTIVE badge.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-LIFE-NO-STATES  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: Save round-trips canister; another browser sees the same kit.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NAV-FLAT-15  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Fifteen peer tabs, no groups, no command palette  
CATEGORY: navigation  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Flat `TABS` array (~5610–5626). Sidebar scrolls. Default tab is Enemies, not Overview.  
SYSTEMS_AFFECTED: AdminDashboard sidebar  
RECOMMENDED_ACTION: Grouped IA per audit proposal. Do not add empty domain tabs.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-NAV-NO-OVERVIEW; AUX-NO-GLOBAL-SEARCH  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Every current tab remains reachable in one click from its group.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NO-HEALTH-AUDIT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Canister audit log has no owner view  
CATEGORY: health-audit  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getAdminAuditLog` in `main.mo`; AdminDashboard never calls it. Helper queued #838.  
SYSTEMS_AFFECTED: Health tab (missing)  
RECOMMENDED_ACTION: Read-only Audit tab. Do not invent a second log.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-AUDIT-VIEW-HELPER  
REGRESSION_RISK: LOW for read-only  
VALIDATION_REQUIRED: Grant Doka appears in the log; non-admin cannot query.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NO-DEPENDENCY-VIEWS  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No relationship pane for spell / enemy / asset  
CATEGORY: dependency-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Spell↔boss pools exist only as chips in an expanded boss. Enemy↔regions is a checkbox list. Helper queued #724.  
SYSTEMS_AFFECTED: All content editors  
RECOMMENDED_ACTION: Read-only dependency rail + badges.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-DOMAIN-GAPS  
REGRESSION_RISK: LOW for read-only  
VALIDATION_REQUIRED: Click-through does not mutate.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-DOMAIN-GAPS  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Missing owner domains must not become empty tabs  
CATEGORY: information-architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Challenges hardcoded. AI/formations/encounters/dungeons/discovery/simulation/telemetry have no admin API. Audit log *does*.  
SYSTEMS_AFFECTED: Future tabs  
RECOMMENDED_ACTION: Do not add empty Challenges/AI/Formations/Dungeons/Telemetry tabs. Prefer Audit.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if empty tabs ship  
VALIDATION_REQUIRED: No new tab without a writer/reader.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NO-MOBILE-ADMIN  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Owner chrome is not phone-first  
CATEGORY: responsive  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: DESIGN.md requires ≥44px targets. Dashboard Btn/Field/tabs <44px; Purchases overlay is 44; row Approve/Reject/Show code stay minHeight 36. Helper queued #1115.  
SYSTEMS_AFFECTED: AdminDashboard; AdminGameKeyPurchases  
RECOMMENDED_ACTION: Wire OWNER_MIN_HIT_PX. Do not ship a second player-style HUD.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-HIT-TARGET-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Grant vs Ban mis-tap is harder at 390px width.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-MODIFIER-DOKA-MISPLACED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Ground Doka + leader boost sit on Map Modifiers  
CATEGORY: information-architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Economy fields above the modifier list (`AdminDashboard.tsx` ~6199–6323). Settings is leftover + transfer + level-up.  
SYSTEMS_AFFECTED: Modifiers tab; Settings  
RECOMMENDED_ACTION: Move economy fields to Economy / System Config when IA is grouped.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-NAV-FLAT-15  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Save still hits `adminSetGameConfig`.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-ASSET-NO-POOL  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No visual pool / weights / activate / revert control  
CATEGORY: visual-asset-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Single optional URL. Default vs custom copy exists. No pool, weights, activate/deactivate, or first-class revert. Empty remains a valid default.  
SYSTEMS_AFFECTED: Enemy + sprite editors; Visuals tab  
RECOMMENDED_ACTION: Weighted variants + revert-to-default without treating empty as error.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-VISUAL-REVERT-HELPER  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Empty pool = Default Pixel Visual active fallback.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-CONFIRM-AMOUNT-RESAMPLE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Grant/Approve confirm can write a different amount than the title  
CATEGORY: destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Shop Grant title interpolates `shopDokaAmount` then the confirm handler reads live state after dismiss (~5724–5737). GameKey Approve stores `confirm.amount` (~839–849) and `approve(rec)` re-parses `dokaDraft[rec.id]` (~213–219). Helper queued #1115.  
SYSTEMS_AFFECTED: Shop; Purchases  
RECOMMENDED_ACTION: Wire snapshot. Cancel still must not write.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIRM-SNAPSHOT-HELPER; AUX-GRANT-DRAFT-HELPER  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: Changing the amount field while the dialog is open cannot change the write.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-MAILTO-EMBEDS-KEY  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Open mailto puts the live GameKey in a URL  
CATEGORY: pii / destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `gameKeyMailtoHref(email, code)` (`dokaGameKey.ts` ~134–140). Helper queued #1115. Combined this run with AUX-MAILTO-NO-CONSENT-GATE.  
SYSTEMS_AFFECTED: AdminGameKeyPurchases reveal  
RECOMMENDED_ACTION: Wire `ownerGameKeyMailtoHref` and `shouldEnableOwnerMailto`.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-MAILTO-SECRET-HELPER; AUX-CONSENT-GATE-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Open mailto draft has no GameKey; Copy still copies the code.  
STATUS: PARTIAL  

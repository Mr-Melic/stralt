# ACTION_IDs — 2026-10-26 Admin UX & Information Architecture Auditor

Stable IDs. Recapture; do not duplicate AUTO_FIXED work.  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
Narrative: [`ADMIN_UX_AUDIT_2026-10-26.md`](./ADMIN_UX_AUDIT_2026-10-26.md)

---

ACTION_ID: AUX-CONFIRM-SNAPSHOT-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Confirm writes must use the amount/principal shown in the dialog  
CATEGORY: destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Shop Grant title interpolates `shopDokaAmount` (`AdminDashboard.tsx` ~5724–5737) then the confirm handler reads live state after dismiss. GameKey Approve stores `confirm.amount` (`AdminGameKeyPurchases.tsx` ~839–849) and `approve(rec)` re-parses `dokaDraft[rec.id]` (~213–219). Confirm overlays do not trap focus, so Tab can change the field behind the title. Helper: `ownerConfirmWriteAmount` / `shouldBlockOwnerConfirmIfSnapshotDrift`. Not wired (stack). Distinct from #945 confirmDismiss (unmount-then-write), #1066 principalGate (parse before open), #631 shopBusy (in-flight lock).  
SYSTEMS_AFFECTED: Shop Grant; Purchases Approve  
RECOMMENDED_ACTION: Persist a snapshot when the dialog opens; write `ownerConfirmWriteAmount(snapshot)` / `ownerConfirmWritePrincipal(snapshot)`. Do not restack AdminDashboard or AdminGameKeyPurchases.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-CONFIRM-AMOUNT-RESAMPLE  
REGRESSION_RISK: LOW for helper; HIGH if wiring falls back to live draft after a title of 500  
VALIDATION_REQUIRED: Dialog title 500 + live draft 5000 writes 500, or blocks on drift.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-CONFIRM-AMOUNT-RESAMPLE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Grant/Approve confirm can write a different amount than the title  
CATEGORY: destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-CONFIRM-SNAPSHOT-HELPER. Operator confirms “Approve 1,200 Doka?” then `resolveAdminApproveDokaAmount(dokaDraft[rec.id])` runs again. Shop Grant has no snapshot object at all. HUMAN — Shop overlap #492/#631/#664/#1001/#1066; Purchases overlap #492/#664.  
SYSTEMS_AFFECTED: Shop; Purchases  
RECOMMENDED_ACTION: Wire snapshot. Cancel still must not write.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED (wiring)  
DEPENDENCIES: AUX-CONFIRM-SNAPSHOT-HELPER; AUX-CONFIRM-NO-INERT  
REGRESSION_RISK: HIGH if Approve starts ignoring the operator-typed amount entirely  
VALIDATION_REQUIRED: Changing the amount field while the dialog is open cannot change the write.  
STATUS: NEW  

---

ACTION_ID: AUX-MAILTO-SECRET-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: GameKey mailto must not embed the redeemable code  
CATEGORY: pii / destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `gameKeyMailtoHref(email, code)` (`dokaGameKey.ts` ~134–140) puts the 120-char key in the mailto body. Reveal overlay (`AdminGameKeyPurchases.tsx` ~783–785) uses that href. Browser history, mail drafts, and device sync then hold a live single-use secret. Helper: `ownerGameKeyMailtoHref` (copy-from-Purchases instruction, no code). Not wired. Distinct from #1066 revealMask (on-screen) and #838 piiRedact (table). Do not patch `dokaGameKey.ts` (Purchases overlap).  
SYSTEMS_AFFECTED: Purchases reveal overlay  
RECOMMENDED_ACTION: Point Open mailto at `ownerGameKeyMailtoHref(email)`. Operator pastes from the overlay after copy.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-MAILTO-EMBEDS-KEY  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring drops email encoding  
VALIDATION_REQUIRED: mailto href decode does not contain the 120-char code; invalid email still `#`.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-MAILTO-EMBEDS-KEY  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Open mailto puts the live GameKey in a URL  
CATEGORY: pii / destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-MAILTO-SECRET-HELPER. On-screen mask (#1066) would still leak via mailto and Copy. HUMAN — do not restack Purchases.  
SYSTEMS_AFFECTED: AdminGameKeyPurchases reveal  
RECOMMENDED_ACTION: Wire `ownerGameKeyMailtoHref`. Keep Copy on the overlay (after unmask).  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-MAILTO-SECRET-HELPER; AUX-REVEAL-MASK-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Open mailto draft has no GameKey; Copy still copies the code.  
STATUS: NEW  

---

ACTION_ID: AUX-CONFIRM-A11Y-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Confirm overlays need alertdialog, inert background, Cancel focus  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `ConfirmDialog` (`AdminDashboard.tsx` ~336–419) and `PurchaseConfirm` (`AdminGameKeyPurchases.tsx` ~51–155) are `position:fixed` divs. No `role="alertdialog"`, no `aria-modal`, no `inert` on the dashboard, no focus trap. Tab reaches Grant amount / Doka draft behind the overlay (feeds AUX-CONFIRM-AMOUNT-RESAMPLE). Helper: `ownerConfirmA11yProps` / `ownerConfirmInitialFocus` / `ownerConfirmBackgroundShouldBeInert`. Not wired. Distinct from #1066 Enter, #945 Escape, #1001 pending slots, #664 double-click.  
SYSTEMS_AFFECTED: ConfirmDialog; PurchaseConfirm  
RECOMMENDED_ACTION: Spread `ownerConfirmA11yProps`, inert the background, focus Cancel. Do not restack the dialogs.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-CONFIRM-NO-INERT  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring steals focus from a nested reason field  
VALIDATION_REQUIRED: Tab cycles Cancel/Confirm only; screen reader names the title.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-CONFIRM-NO-INERT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Owner confirms leave the dashboard in the tab order  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-CONFIRM-A11Y-HELPER. Pointers are blocked by the overlay; keyboard is not. HUMAN — ConfirmDialog overlap #492/#539/#664/#945/#1001/#1066.  
SYSTEMS_AFFECTED: Shop; Purchases; deletes; ads Clear; unsaved-leave  
RECOMMENDED_ACTION: Wire `ownerConfirmA11yProps` + inert. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIRM-A11Y-HELPER; AUX-CONFIRM-SNAPSHOT-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Tab from Confirm does not land on Grant amount.  
STATUS: NEW  

---

ACTION_ID: AUX-HIT-TARGET-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Owner Btn / Field / ListSearch / tabs must be ≥44px  
CATEGORY: responsive  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: DESIGN.md mobile targets ≥44px. Purchases buttons already use `minHeight: 44` (`AdminGameKeyPurchases.tsx` ~48, ~122, ~140). Dashboard `Btn` is `py-1.5 text-[11px]` (~313–315), `Field` is `py-1.5 text-xs` (~457), `ListSearch` copies `inputStyle` padding 7px/12px (~210–223, ~289), sidebar tabs are `padding: 10px 20px` / 12px (~5897–5912). Helper: `OWNER_MIN_HIT_PX` / `ownerHitTargetMeetsMinimum`. Not wired. Distinct from #775 editorChrome.  
SYSTEMS_AFFECTED: AdminDashboard Btn, Field, ListSearch, sidebar tabs  
RECOMMENDED_ACTION: Set `minHeight: 44` on those controls. Keep desktop density otherwise. Do not restack AdminDashboard.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-HIT-TARGET-UNDER-44  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring blows the 15-tab sidebar  
VALIDATION_REQUIRED: Grant, Ban, tab, and list-search hit areas are ≥44px. Purchases stays 44.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-HIT-TARGET-UNDER-44  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Dashboard owner controls are smaller than Purchases 44px targets  
CATEGORY: responsive  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-HIT-TARGET-HELPER. Recapture of AUX-NO-MOBILE-ADMIN with a measurable contract. HUMAN — do not vendor a phone-first IA.  
SYSTEMS_AFFECTED: AdminDashboard chrome  
RECOMMENDED_ACTION: Wire `minHeight: OWNER_MIN_HIT_PX` on Btn/Field/ListSearch/tab. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-HIT-TARGET-HELPER; AUX-NO-MOBILE-ADMIN  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Mis-tap Grant vs Ban is harder on a 390px-wide viewport.  
STATUS: NEW  

---

ACTION_ID: AUX-PRINCIPAL-GATE-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Parse IC principal before opening a live Grant/Ban/Unban/Transfer confirm  
CATEGORY: validation  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Shop Grant (`AdminDashboard.tsx` ~6978–6988) opens confirm when the principal field is non-empty and the amount validates. Ban/Unban (~7035–7053) open on any non-empty string. `Principal.fromText` runs only inside the dismissed-confirm writer (~5736, ~5767, ~5794). Settings Transfer (~4184) likewise mutates with `useAssignUserRole` → `Principal.fromText` (`useAdminQueries.ts` ~100) after the typed TRANSFER check. Helper: `shouldOpenOwnerPrincipalConfirm` / `ownerPrincipalParseError`. Not wired (stack). Distinct from #1001 grantLink (purchaseId) and roleGrant (TRANSFER token).  
SYSTEMS_AFFECTED: Shop Grant/Ban/Unban; Settings Transfer  
RECOMMENDED_ACTION: Toast the parse error and do not open ConfirmDialog. Do not restack AdminDashboard.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-PRINCIPAL-PARSE-AFTER-CONFIRM  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring rejects a legal principal checksum  
VALIDATION_REQUIRED: `not-a-principal` never opens Grant/Ban confirm; `aaaaa-aa` still can.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-PRINCIPAL-PARSE-AFTER-CONFIRM  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Live wallet/ban confirms open on garbage principal IDs  
CATEGORY: validation  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-PRINCIPAL-GATE-HELPER. Operator confirms “Grant 1000 Doka to not-a-principal?”, dialog unmounts, then `Principal.fromText` throws and a toast reports failure. Looks like a failed live write; the dangerous part is the confirm itself training operators that the ID was accepted. HUMAN for dashboard.  
SYSTEMS_AFFECTED: Shop; Settings  
RECOMMENDED_ACTION: Wire `shouldOpenOwnerPrincipalConfirm` before `setShopConfirm` / `assignRole.mutate`. HUMAN — Shop overlap #492/#631/#664/#1001; Settings overlap #334/#539/#1001.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED (wiring)  
DEPENDENCIES: AUX-PRINCIPAL-GATE-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Invalid principal toasts and does not show ConfirmDialog. Cancel still does not write.  
STATUS: PARTIAL  
  

---

ACTION_ID: AUX-CONFIRM-ENTER-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Enter should submit idle ConfirmDialog / PurchaseConfirm  
CATEGORY: destructive-actions  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `ConfirmDialog` (~336–419) and `PurchaseConfirm` (`AdminGameKeyPurchases.tsx` ~51–155) have click Cancel/Confirm only. No `keydown` listener. Escape is queued separately (#539 / #492 / overlay #945). Pending slots queued #1001. Helper: `shouldSubmitOwnerConfirmOnKey` (Enter + not pending + not disabled). Not wired.  
SYSTEMS_AFFECTED: ConfirmDialog; PurchaseConfirm  
RECOMMENDED_ACTION: Submit on Enter using this helper. Ignore Enter while pending so it cannot double-fire with #945 keep-until-#ok.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-CONFIRM-NO-ENTER; AUX-CONFIRM-CHROME-HELPER  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring submits while a nested field wants Enter  
VALIDATION_REQUIRED: Enter on idle Grant confirm writes once; Enter while pending is a no-op.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-CONFIRM-NO-ENTER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Owner confirms ignore the Enter key  
CATEGORY: destructive-actions  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-CONFIRM-ENTER-HELPER. Keyboard operators must mouse the red button. Distinct from missing Escape. HUMAN — ConfirmDialog overlap #492/#539/#664/#945/#1001.  
SYSTEMS_AFFECTED: Shop; Purchases; deletes; ads Clear  
RECOMMENDED_ACTION: Wire `shouldSubmitOwnerConfirmOnKey`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIRM-ENTER-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Enter does not submit while `ownerConfirmChrome` is pending.  
STATUS: PARTIAL  
  

---

ACTION_ID: AUX-REVEAL-MASK-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Mask GameKey plaintext until click-to-reveal  
CATEGORY: pii / destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reveal overlay (`AdminGameKeyPurchases.tsx` ~716–747) puts `value={reveal.code}` in a read-only textarea. #838 `redactOwnerEmail` / `redactOwnerPrincipal` cover table columns only. Empty code is a valid default (no overlay). Helper: `maskOwnerGameKey` / `ownerGameKeyLooksFullyVisible`. Not wired. Distinct from overlay Escape (#945).  
SYSTEMS_AFFECTED: AdminGameKeyPurchases reveal  
RECOMMENDED_ACTION: Show masked last-four; Copy / mailto still use the full code from state. Do not treat empty as error.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-REVEAL-PLAINTEXT; AUX-PII-REDACT-HELPER  
REGRESSION_RISK: LOW for helper; HIGH if Copy starts copying the bullets  
VALIDATION_REQUIRED: Masked view does not equal the 120-char key; Copy still pastes the real key; empty overlay never renders as an error.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-REVEAL-PLAINTEXT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: GameKey overlay shows the full redeemable key  
CATEGORY: pii  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same site as AUX-REVEAL-MASK-HELPER. Screenshare of Purchases after Approve leaks a live 120-char key. HUMAN — Purchases overlap #492/#664/#838.  
SYSTEMS_AFFECTED: Purchases reveal overlay  
RECOMMENDED_ACTION: Wire `maskOwnerGameKey(code, revealed)`. Default `revealed=false`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-REVEAL-MASK-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Approve still reveals a copyable key after click-to-show; Mark emailed still wipes.  
STATUS: PARTIAL  
  

---

ACTION_ID: AUX-BAN-REASON-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Require an audit reason before Shop Ban  
CATEGORY: health-audit  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Shop Ban confirm (~5754–5777) calls `adminBanAccount` (`main.mo` ~1261) which audits before=`active` after=`banned` with no operator note. `banPlayer(principal, reason)` (~2246) records `truncateSummary(reason)` (max 200, `adminGuard.mo` ~712). Shop has no reason field. Helper: `shouldSubmitOwnerBan` / `ownerBanReasonError` / `ownerBanReasonConfirmBody`. Not wired. Do not auto-switch the writer (audit action name would change).  
SYSTEMS_AFFECTED: Shop Ban; getAdminAuditLog  
RECOMMENDED_ACTION: Collect 1–200 char reason. Keep achievement-kept copy. Do not invent a second log.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-BAN-NO-REASON; AUX-NO-HEALTH-AUDIT  
REGRESSION_RISK: LOW for helper; HIGH if wiring calls `banPlayer` without approval  
VALIDATION_REQUIRED: Empty reason does not open/confirm Ban; 201 chars rejected; Cancel does not write.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-BAN-NO-REASON  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Shop Ban cannot record why the player was banned  
CATEGORY: health-audit  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-BAN-REASON-HELPER. Health/audit proposal cannot reconstruct operator intent. HUMAN — Shop overlap #631/#1001; do not change `adminBanAccount` signature.  
SYSTEMS_AFFECTED: Shop Ban; admin audit log  
RECOMMENDED_ACTION: Wire reason field + `shouldSubmitOwnerBan`. Prefer adding a reason arg later over silently swapping to `banPlayer`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-BAN-REASON-HELPER  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Ban still keeps claimed achievement flags (`shouldWipeAchievementsOnBan` is false).  
STATUS: PARTIAL  
  

---

ACTION_ID: AUX-CONFIRM-DISMISS-BEFORE-SETTLE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Confirms unmount before the live write returns  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Shop grant (`AdminDashboard.tsx` ~5729) does `setShopConfirm(null)` then `adminAddDokaToUser`. Ban/unban same. GameKey approve/reject/emailed (`AdminGameKeyPurchases.tsx` ~846–877) close PurchaseConfirm then mutate. Ad Clear (~8195) and catalog deletes unmount then write. Helper queued #945. Chrome queued #1001. Principal parse this run happens in that dismissed writer. Still unwired.  
SYSTEMS_AFFECTED: Shop; Purchases; Ad Boxes; deletes  
RECOMMENDED_ACTION: Keep dialog until `#ok`. Show Failed in-dialog on `#err`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIRM-DISMISS-HELPER; AUX-CONFIRM-CHROME-HELPER; AUX-PRINCIPAL-GATE-HELPER  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Double-click Grant credits once; failed ban still shows the dialog; invalid principal never reaches the writer.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-TIER-NO-CANISTER-HYDRATE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Enemy Tiers editor never reads getTierSpawnConfig  
CATEGORY: content-lifecycle  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `TierConfigTab` seeds from `pbv_tier_spawn_config` and writes `adminSetTierSpawnConfig`. There is no `getTierSpawnConfig` call in AdminDashboard. Helper queued #945. HUMAN for dashboard.  
SYSTEMS_AFFECTED: Enemy Tiers tab; spawn policy  
RECOMMENDED_ACTION: Hydrate from `getTierSpawnConfig` before the form is editable. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIG-HYDRATE-HELPER; AUX-LIFE-NO-STATES  
REGRESSION_RISK: HIGH — publishing local cache changes live encounter mix  
VALIDATION_REQUIRED: Two browsers: A publishes 70/15/10/5; B opens Tiers and must show 70/15/10/5.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-VISUALS-NO-CANISTER-HYDRATE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Visuals editor never reads getColorPalette  
CATEGORY: content-lifecycle  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `VisualsTab` seeds from `pbv_color_palette` / `paperVertexPalette` and writes `adminSetColorPalette`. No `getColorPalette` in AdminDashboard. Helper queued #945.  
SYSTEMS_AFFECTED: Visuals tab; map paper vertices  
RECOMMENDED_ACTION: Hydrate from `getColorPalette` before Save. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIG-HYDRATE-HELPER; AUX-PALETTE-RESET-NOT-LIVE  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Second browser sees the published palette without copying localStorage.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-PALETTE-RESET-NOT-LIVE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Visuals Reset discards local keys only  
CATEGORY: content-lifecycle  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `handleReset` `removeItem`s `paperVertexPalette` and `pbv_color_palette`. It does not call `adminRollbackColorPalette`. Helper queued #945.  
SYSTEMS_AFFECTED: Visuals tab; color palette rollback  
RECOMMENDED_ACTION: Label Reset as “Discard local draft”. Live revert must call rollback with typed confirm (#838). HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-PALETTE-RESET-NO-CONFIRM; AUX-ROLLBACK-NO-UI  
REGRESSION_RISK: HIGH if Reset is wired to rollback without confirm  
VALIDATION_REQUIRED: Reset does not change `getColorPalette` until rollback is explicit.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-REVEAL-NO-ESCAPE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: GameKey reveal overlay ignores Escape  
CATEGORY: destructive-actions  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reveal overlay ~716–837 is a full-screen dimmer with Copy / mailto / Mark emailed / Close. No `keydown` listener. Helper queued #945. Distinct from PurchaseConfirm Escape (#492) and this run’s mask helper.  
SYSTEMS_AFFECTED: AdminGameKeyPurchases reveal  
RECOMMENDED_ACTION: Escape and backdrop click call Close. Do not mark emailed. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-OVERLAY-KEY-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Escape does not wipe the plaintext key.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-VISUAL-NO-REVERT-CONTROL  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Enemy and sprite editors have no Revert to Default  
CATEGORY: visual-asset-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Enemy editor (~816–845) is a URL field + status line. Sprite editor has a preview and optional facing URLs. Ads (~8260) have “Clear to default”. Empty URL is implicit revert and is valid. Helper queued #945.  
SYSTEMS_AFFECTED: EnemyEditor; SpriteEditorForm  
RECOMMENDED_ACTION: Add Revert using `ownerVisualRevertLabel`. Do not treat empty as error. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-VISUAL-REVERT-HELPER; AUX-ASSET-NO-POOL  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Revert clears stored URL; list chip returns to Default pixel visual.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NO-HEALTH-AUDIT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Canister audit log has no owner view  
CATEGORY: health-audit  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getAdminAuditLog` in `main.mo`; Settings CatalogNote admits no editor. Mock returns `notAdmin`. Reader helper queued #838. Still no Health tab. Ban reasons (this run) would land here.  
SYSTEMS_AFFECTED: Health tab (missing)  
RECOMMENDED_ACTION: Read-only Audit tab. Do not invent a second log. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-AUDIT-VIEW-HELPER; AUX-BAN-REASON-HELPER  
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
EVIDENCE: `adminRollbackLevelUpConfig` / `GameConfig` / `TierSpawnConfig` / `ColorPalette` / `BossRushConfig` exist. Typed ROLLBACK helper queued #838. Visuals Reset is not rollback.  
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
EVIDENCE: Table columns Player / Email. Redact helper queued #838; UI unwired. Search/status already present. Reveal overlay still full plaintext (AUX-REVEAL-PLAINTEXT).  
SYSTEMS_AFFECTED: Purchases tab  
RECOMMENDED_ACTION: Optional column redact for screenshare. Keep confirms. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-PII-REDACT-HELPER; AUX-REVEAL-MASK-HELPER  
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
EVIDENCE: Achievement `active` and modifier `active` are the only lifecycle bits. Every other canister Save publishes live. Boss Save is a local draft next to live entity Saves. Copy helper queued #724. Tiers/Visuals local cache can be mistaken for ACTIVE.  
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
EVIDENCE: Boss queries still read/write `pbv_boss_configs`. Collapsed row has no DRAFT chip. Save copy is honest (“browser-local drafts only”). Types still diverge.  
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
EVIDENCE: Identity, stats, type (damage/heal/drain only ~2684), targeting, AoE, flags, tiny preview. Summon editor queued #564. Save is live.  
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
EVIDENCE: Single optional URL. Default vs custom copy exists. No pool, weights, activate/deactivate. Revert helper queued #945 (copy only). Empty remains a valid default. Ads show upload requirements before paste.  
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
EVIDENCE: Spell↔boss pools exist only as chips. Enemy↔regions is a checkbox list. No enemy→encounters/dungeons, asset→usage, spell→achievements/challenges. Rail helper queued #724.  
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
EVIDENCE: One-row Edit/× only. Does not scale. Names Add is the only bulk-adjacent writer and it has no lock (#1001 helper unwired).  
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
EVIDENCE: Economy fields above modifier list (~6199).  
SYSTEMS_AFFECTED: Modifiers tab; Settings  
RECOMMENDED_ACTION: Move economy fields to Economy / System Config when IA is grouped. HUMAN.  
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
EVIDENCE: Helper queued #883. Boss Rush still toast “published (live)” plus hex `Saved`. Shop grant toast + hex. Level-up inline `saved`.  
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
EVIDENCE: `App.tsx` small-screen guard is bypassable but console `×` targets stay <44px. ConfirmDialog Btn is shorter than PurchaseConfirm’s 44px targets.  
SYSTEMS_AFFECTED: App.tsx; delete buttons  
RECOMMENDED_ACTION: Do not ship a phone-first admin. Keep desktop density; enlarge destructive targets only.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: AUX-HIT-TARGET-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Player small-screen continue still works. Destructive dashboard targets ≥44px after wiring.  
STATUS: PARTIAL  

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
EVIDENCE: `SpriteList.handleSave` (~1715–1718) calls `onSave` then clears the editor. Parent then validates walk URLs. Helper queued #883.  
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
EVIDENCE: Helper queued #883 covers level-up / palette / tiers / game config / Boss Rush / ads. Buttons on `main` still fire a second publish. Names Add is a related gap (#1001).  
SYSTEMS_AFFECTED: Settings; Visuals; Tiers; Modifiers; Boss Rush; Ads  
RECOMMENDED_ACTION: Wire `shouldBlockOwnerConfigWriter`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIG-WRITER-BUSY-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Second click while pending is a no-op.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-NAMES-ADD-DOUBLE-SUBMIT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Enemy Names Add is not locked while pending  
CATEGORY: bulk-operations  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Names tab fires `addEnemyNameMut.mutate` on Enter and on + Add Name with no `disabled={addEnemyNameMut.isPending}`. Helper queued #1001. HUMAN for dashboard.  
SYSTEMS_AFFECTED: Enemy Names tab  
RECOMMENDED_ACTION: Wire `shouldSubmitOwnerNameAdd`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-NAMES-BUSY-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Rapid Enter adds one name. Duplicate toast, not a second chip.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-TRANSFER-NO-DIALOG  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Transfer Admin has no ConfirmDialog  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Typed TRANSFER is a field check, not a modal. Helper queued #1001. Principal parse (this run) is a second missing gate on the same button.  
SYSTEMS_AFFECTED: SettingsTab  
RECOMMENDED_ACTION: Wire `shouldAssignOwnerRole({ dialogConfirmed: true })` and `shouldOpenOwnerPrincipalConfirm`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-ROLE-GRANT-HELPER; AUX-PRINCIPAL-GATE-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Typed TRANSFER without Confirm does not call the actor.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-TRANSFER-BUTTON-UNLOCKED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Transfer Admin button is clickable before TRANSFER is typed  
CATEGORY: destructive-actions  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `Btn` (~4279) is only disabled while `assignRole.isPending`. Helper queued #1001.  
SYSTEMS_AFFECTED: SettingsTab  
RECOMMENDED_ACTION: `disabled={!shouldEnableOwnerRoleGrantButton(...)}`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-ROLE-GRANT-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Button stays disabled until principal + exact TRANSFER.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-CONFIRM-NO-PENDING-SLOT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Owner confirms cannot disable confirm or show Failed  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Helper queued #1001. Shop grant unmounts then writes; a `#err` is toast-only.  
SYSTEMS_AFFECTED: Shop; Purchases; Ad Boxes; entity deletes  
RECOMMENDED_ACTION: Wire chrome + `shouldDismissOwnerConfirm`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIRM-CHROME-HELPER; AUX-CONFIRM-DISMISS-HELPER  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Failed grant keeps the dialog; confirm is disabled while pending.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-GRANT-UNLINKED-FROM-PURCHASE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Shop Grant can double-credit with Purchases Approve  
CATEGORY: economy  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Grant writes the wallet now. Approve mints a 120-char GameKey the player redeems later. Helper queued #1001. Do not invent a purchase picker this run.  
SYSTEMS_AFFECTED: Shop; Purchases  
RECOMMENDED_ACTION: Wire unlinked copy. Optional later: purchase-id picker. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-GRANT-UNLINKED-HELPER  
REGRESSION_RISK: HIGH if Grant is wired to auto-approve a request  
VALIDATION_REQUIRED: Grant does not change a Purchases row; Approve still reveals a key.  
STATUS: PARTIAL  

# ACTION_IDs — 2026-10-27 Admin UX & Information Architecture Auditor

Stable IDs. Recapture; do not duplicate AUTO_FIXED work.  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
Narrative: [`ADMIN_UX_AUDIT_2026-10-27.md`](./ADMIN_UX_AUDIT_2026-10-27.md)

---

ACTION_ID: AUX-REVEAL-FORMAT-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Do not show or copy a GameKey unless it passes format validation  
CATEGORY: destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Approve (`AdminGameKeyPurchases.tsx` ~227–235) and Show code (~278–286) set `reveal.code` from `cmd.ok` with no `validateGameKeyFormat`. Copy (~320–327) writes that string to the clipboard and toasts success. `validateGameKeyFormat` already exists in `dokaGameKey.ts` (~85–94) for player redeem. Helper: `shouldShowOwnerGameKeyReveal` / `shouldCopyOwnerGameKey`. Not wired (stack). Distinct from #1066 revealMask (on-screen bullets) and #1115 mailtoSecret (URL body).  
SYSTEMS_AFFECTED: AdminGameKeyPurchases reveal overlay  
RECOMMENDED_ACTION: Gate overlay open and Copy on `shouldShowOwnerGameKeyReveal`. Toast the format error. Do not restack Purchases.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-REVEAL-NO-FORMAT-CHECK  
REGRESSION_RISK: LOW for helper; HIGH if wiring blocks a legal 120-char alphabet key  
VALIDATION_REQUIRED: 119-char payload never opens the overlay; Copy of an invalid code is a no-op.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-REVEAL-NO-FORMAT-CHECK  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Reveal overlay and Copy accept any actor string as a GameKey  
CATEGORY: destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-REVEAL-FORMAT-HELPER. Operator can email a truncated or alphabet-invalid secret and Mark emailed wipes the canister copy. HUMAN — Purchases overlap #492/#664/#838/#1066/#1115.  
SYSTEMS_AFFECTED: Purchases reveal  
RECOMMENDED_ACTION: Wire `shouldShowOwnerGameKeyReveal` / `shouldCopyOwnerGameKey`. Keep Copy on a valid key.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-REVEAL-FORMAT-HELPER; AUX-REVEAL-MASK-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Valid 120-char key still copies; invalid never toasts “GameKey copied”.  
STATUS: NEW  

---

ACTION_ID: AUX-PURCHASE-GLOBAL-BUSY-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Any in-flight GameKey admin op must disable every purchase row  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Approve / Reject / Show code use `disabled={busyId === rec.id}` (`AdminGameKeyPurchases.tsx` ~628, ~665, ~689). While row A Approve is in flight, row B can open another confirm. #664 `tryBeginGameKeyAdminOp` is a same-request double-click lock, not table-wide. Helper: `shouldDisableOwnerPurchaseRowActions` / `shouldOpenOwnerPurchaseConfirm`. Not wired. Distinct from #664 gameKeyBusy and #631 shopBusy.  
SYSTEMS_AFFECTED: AdminGameKeyPurchases table  
RECOMMENDED_ACTION: `disabled={shouldDisableOwnerPurchaseRowActions(busyId)}` on every row action. Do not restack Purchases.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-PURCHASE-CROSS-ROW-BUSY  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring blocks Show code on a finished row after Mark emailed of another  
VALIDATION_REQUIRED: Approve row A → row B Approve is disabled until finally.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-PURCHASE-CROSS-ROW-BUSY  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Purchases only disables the row whose id matches busyId  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-PURCHASE-GLOBAL-BUSY-HELPER. Two overlapping Approve confirms can race after #664’s per-op lock releases. HUMAN — Purchases overlap #492/#664.  
SYSTEMS_AFFECTED: Purchases table  
RECOMMENDED_ACTION: Wire table-wide busy. Cancel on an idle confirm still must not write.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-PURCHASE-GLOBAL-BUSY-HELPER; AUX-PURCHASE-CONFIRM-DOUBLE-SUBMIT  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Second row cannot open Approve while the first mint is in flight.  
STATUS: NEW  

---

ACTION_ID: AUX-GRANT-DRAFT-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Shop Grant amount must stay a string draft until confirm  
CATEGORY: validation  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `shopDokaAmount` is `useState<number>(0)` (`AdminDashboard.tsx` ~5411). Field onChange is `Number.parseInt(v) || 0` (~6970–6971, no radix). Clearing the input snaps to 0; `0x10` parses as 16. Confirm title interpolates that number (~5724). Purchases already keeps string `dokaDraft`. Helper: `parseOwnerGrantAmountDraft`. Not wired. Distinct from #1115 confirmSnapshot (titled vs live after open).  
SYSTEMS_AFFECTED: Shop Grant amount Field  
RECOMMENDED_ACTION: Keep a string draft; parse with `parseOwnerGrantAmountDraft` before `setShopConfirm("grant")`. Do not restack AdminDashboard.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-GRANT-AMOUNT-COERCE-ZERO  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring rejects a legal whole-number grant  
VALIDATION_REQUIRED: Empty field does not become 0; `0x10` does not open confirm; `1000` still can.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-GRANT-AMOUNT-COERCE-ZERO  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Shop Grant amount Field cannot be empty and accepts parseInt hex  
CATEGORY: validation  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-GRANT-DRAFT-HELPER. Combined with AUX-CONFIRM-AMOUNT-RESAMPLE, a cleared-then-retouched field behind an un-inert overlay can title 0. HUMAN — Shop overlap #492/#631/#1001/#1066/#1115.  
SYSTEMS_AFFECTED: Shop Grant  
RECOMMENDED_ACTION: Wire string draft + `parseOwnerGrantAmountDraft`. Snapshot (#1115) still writes the titled amount.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-GRANT-DRAFT-HELPER; AUX-CONFIRM-SNAPSHOT-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Backspacing 1000 to empty does not display 0; Grant still blocked by validateDokaGrant.  
STATUS: NEW  

---

ACTION_ID: AUX-COPY-FOLLOWUP-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Copy GameKey toast must remind Mark emailed  
CATEGORY: pii / save-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `copyCode` (`AdminGameKeyPurchases.tsx` ~320–327) toasts “GameKey copied” and returns. Overlay copy (~743–744) already tells the operator to mark emailed, but the toast is what remains after they switch windows. Helper: `ownerGameKeyCopiedToast`. Not wired. Distinct from #1066 mask and #1115 mailto.  
SYSTEMS_AFFECTED: Purchases Copy code  
RECOMMENDED_ACTION: Use `OWNER_GAMEKEY_COPIED_TOAST`. Do not auto-call `adminMarkGameKeyEmailed`.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-COPY-TOAST-NO-WIPE-REMINDER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Toast mentions Mark emailed; Copy does not wipe the key.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-COPY-TOAST-NO-WIPE-REMINDER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Successful GameKey copy does not remind the operator to wipe the reveal  
CATEGORY: pii  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same site as AUX-COPY-FOLLOWUP-HELPER. Clipboard + canister plaintext remain until Mark emailed. HUMAN — Purchases overlap #492/#664/#1066.  
SYSTEMS_AFFECTED: Purchases reveal Copy  
RECOMMENDED_ACTION: Wire `ownerGameKeyCopiedToast`. Keep Mark emailed as an explicit confirm (#492).  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-COPY-FOLLOWUP-HELPER; AUX-GAMEKEY-NO-CONFIRM  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Copy still copies the real key; Mark emailed still confirms.  
STATUS: NEW  

---

ACTION_ID: AUX-CONFIRM-AMOUNT-RESAMPLE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Grant/Approve confirm can write a different amount than the title  
CATEGORY: destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Shop Grant title interpolates `shopDokaAmount` then the confirm handler reads live state after dismiss (`AdminDashboard.tsx` ~5724–5737). GameKey Approve stores `confirm.amount` (~839–849) and `approve(rec)` re-parses `dokaDraft[rec.id]` (~213–219). Helper queued #1115. Grant draft coerce (this run) feeds the same live field.  
SYSTEMS_AFFECTED: Shop; Purchases  
RECOMMENDED_ACTION: Wire snapshot. Cancel still must not write.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED (wiring)  
DEPENDENCIES: AUX-CONFIRM-SNAPSHOT-HELPER; AUX-GRANT-DRAFT-HELPER; AUX-CONFIRM-NO-INERT  
REGRESSION_RISK: HIGH if Approve starts ignoring the operator-typed amount entirely  
VALIDATION_REQUIRED: Changing the amount field while the dialog is open cannot change the write.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-MAILTO-EMBEDS-KEY  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Open mailto puts the live GameKey in a URL  
CATEGORY: pii / destructive-actions  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `gameKeyMailtoHref(email, code)` (`dokaGameKey.ts` ~134–140). Reveal overlay (~783–785) uses that href. Helper queued #1115.  
SYSTEMS_AFFECTED: AdminGameKeyPurchases reveal  
RECOMMENDED_ACTION: Wire `ownerGameKeyMailtoHref`. Keep Copy on the overlay (after unmask + format gate).  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-MAILTO-SECRET-HELPER; AUX-REVEAL-MASK-HELPER; AUX-REVEAL-FORMAT-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Open mailto draft has no GameKey; Copy still copies the code.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-CONFIRM-NO-INERT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Owner confirms leave the dashboard in the tab order  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `ConfirmDialog` (~336–419) and `PurchaseConfirm` (~51–155) are `position:fixed` divs. Helper queued #1115.  
SYSTEMS_AFFECTED: Shop; Purchases; deletes; ads Clear; unsaved-leave  
RECOMMENDED_ACTION: Wire `ownerConfirmA11yProps` + inert. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIRM-A11Y-HELPER; AUX-CONFIRM-SNAPSHOT-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Tab from Confirm does not land on Grant amount.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-HIT-TARGET-UNDER-44  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Dashboard owner controls are smaller than Purchases 44px targets  
CATEGORY: responsive  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Dashboard `Btn` is `py-1.5 text-[11px]` (~313–315). Purchases overlay buttons are 44; **row Approve/Reject/Show code are minHeight 36** (~648–670). Helper queued #1115 covers dashboard chrome, not row 36px.  
SYSTEMS_AFFECTED: AdminDashboard chrome; Purchases row actions  
RECOMMENDED_ACTION: Wire `minHeight: OWNER_MIN_HIT_PX` on Btn/Field/ListSearch/tab and Purchases row actions. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-HIT-TARGET-HELPER; AUX-NO-MOBILE-ADMIN  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Mis-tap Grant vs Ban is harder on a 390px-wide viewport. Row Approve ≥44px.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-PRINCIPAL-PARSE-AFTER-CONFIRM  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Live wallet/ban confirms open on garbage principal IDs  
CATEGORY: validation  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Shop Grant/Ban/Unban parse `Principal.fromText` only inside the dismissed-confirm writer (~5736, ~5767, ~5794). Helper queued #1066.  
SYSTEMS_AFFECTED: Shop; Settings  
RECOMMENDED_ACTION: Wire `shouldOpenOwnerPrincipalConfirm` before `setShopConfirm`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED (wiring)  
DEPENDENCIES: AUX-PRINCIPAL-GATE-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Invalid principal toasts and does not show ConfirmDialog.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-CONFIRM-NO-ENTER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Owner confirms ignore the Enter key  
CATEGORY: destructive-actions  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: ConfirmDialog / PurchaseConfirm have click only. Helper queued #1066.  
SYSTEMS_AFFECTED: Shop; Purchases; deletes; ads Clear  
RECOMMENDED_ACTION: Wire `shouldSubmitOwnerConfirmOnKey`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIRM-ENTER-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Enter does not submit while pending.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-REVEAL-PLAINTEXT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: GameKey overlay shows the full redeemable key  
CATEGORY: pii  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reveal overlay ~716–747 `value={reveal.code}`. Helper queued #1066. Format gate (this run) is a second missing check on the same overlay.  
SYSTEMS_AFFECTED: Purchases reveal overlay  
RECOMMENDED_ACTION: Wire `maskOwnerGameKey` then format-gate Copy. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-REVEAL-MASK-HELPER; AUX-REVEAL-FORMAT-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Approve still reveals a copyable key after click-to-show; Mark emailed still wipes.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-BAN-NO-REASON  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Shop Ban cannot record why the player was banned  
CATEGORY: health-audit  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Shop Ban confirm (~5754–5777) calls `adminBanAccount` with no operator note. Helper queued #1066.  
SYSTEMS_AFFECTED: Shop Ban; admin audit log  
RECOMMENDED_ACTION: Wire reason field + `shouldSubmitOwnerBan`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-BAN-REASON-HELPER  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Ban still keeps claimed achievement flags.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-CONFIRM-DISMISS-BEFORE-SETTLE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Confirms unmount before the live write returns  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Shop grant (~5729) `setShopConfirm(null)` then `adminAddDokaToUser`. GameKey approve/reject/emailed (~846–877) same. Helper queued #945.  
SYSTEMS_AFFECTED: Shop; Purchases; Ad Boxes; deletes  
RECOMMENDED_ACTION: Keep dialog until `#ok`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIRM-DISMISS-HELPER; AUX-CONFIRM-CHROME-HELPER  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Double-click Grant credits once; failed ban still shows the dialog.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-TIER-NO-CANISTER-HYDRATE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Enemy Tiers editor never reads getTierSpawnConfig  
CATEGORY: content-lifecycle  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `TierConfigTab` seeds from `pbv_tier_spawn_config` (~3819) and writes `adminSetTierSpawnConfig`. No `getTierSpawnConfig` call in AdminDashboard. Helper queued #945.  
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
EVIDENCE: `handleReset` `removeItem`s `paperVertexPalette` and `pbv_color_palette` (~4745). It does not call `adminRollbackColorPalette`. Helper queued #945.  
SYSTEMS_AFFECTED: Visuals tab; color palette rollback  
RECOMMENDED_ACTION: Label Reset as “Discard local draft”. Live revert must call rollback with typed confirm. HUMAN.  
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
EVIDENCE: Reveal overlay ~716–837 has Close only. Helper queued #945.  
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
EVIDENCE: Enemy editor (~816–845) is a URL field + status line. Empty URL is implicit revert and is valid (never an error). Helper queued #945.  
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
EVIDENCE: `getAdminAuditLog` in `main.mo`; Settings CatalogNote admits no editor (~4231–4234). Mock returns `notAdmin`. Reader helper queued #838. Still no Health tab.  
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
EVIDENCE: Table columns Player / Email (~498–501). Redact helper queued #838; UI unwired.  
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
EVIDENCE: `isDirty` hardcoded `false` (~5361). `hasOpenEditor` (~5479–5485) omits bosses, ads, names, shop, tiers, settings, visuals, boss rush. Helper queued #838.  
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
EVIDENCE: `useBossQueries.ts` still reads/writes `pbv_boss_configs`. Collapsed row has no DRAFT chip. Save copy is honest (“browser-local drafts only”). Types still diverge.  
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
EVIDENCE: Flat `TABS` (~5606–5626). Sidebar 180px, overflowY auto. Default tab is Enemies. Group helper queued #775.  
SYSTEMS_AFFECTED: AdminDashboard sidebar  
RECOMMENDED_ACTION: Grouped IA per audit proposal. Do not add empty domain tabs. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-NAV-NO-OVERVIEW; AUX-NO-GLOBAL-SEARCH; AUX-DOMAIN-GAPS  
REGRESSION_RISK: MEDIUM — muscle memory  
VALIDATION_REQUIRED: Every current tab remains reachable in one click from its group.  
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

ACTION_ID: AUX-ASSET-NO-POOL  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No visual pool / weights / activate / revert control  
CATEGORY: visual-asset-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Single optional URL. Default vs custom copy exists. Empty remains a valid default. Ads show upload requirements before paste.  
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
EVIDENCE: Spell↔boss pools exist only as chips. Enemy↔regions is a checkbox list. Rail helper queued #724.  
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
EVIDENCE: “Save Enemy” / “Save Spell” / “Save Achievement” publish live. Boss button says “Save browser draft” (honest). Lifecycle copy helper queued #724.  
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
EVIDENCE: One-row Edit/× only. Names Add is the only bulk-adjacent writer and it has no lock.  
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
EVIDENCE: `App.tsx` small-screen guard is bypassable. ConfirmDialog Btn is shorter than PurchaseConfirm’s 44px targets. Row Approve is 36px.  
SYSTEMS_AFFECTED: App.tsx; delete buttons; Purchases row  
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
EVIDENCE: Confirm copy helper queued #883. Enemy/spell/region/modifier/achievement/sprite Save still publish immediately.  
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
EVIDENCE: `SpriteList.handleSave` (~1715–1718) calls `onSave` then clears the editor. Helper queued #883.  
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
EVIDENCE: Helper queued #883. Buttons on `main` still fire a second publish.  
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
EVIDENCE: Names tab fires `addEnemyNameMut.mutate` on Enter and on + Add Name with no `disabled={addEnemyNameMut.isPending}` (~7362–7399). Helper queued #1001.  
SYSTEMS_AFFECTED: Enemy Names tab  
RECOMMENDED_ACTION: Wire `shouldSubmitOwnerNameAdd`. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-NAMES-BUSY-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Rapid Enter adds one name.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-TRANSFER-NO-DIALOG  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Transfer Admin has no ConfirmDialog  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Typed TRANSFER is a field check, not a modal (~4183–4204). Helper queued #1001.  
SYSTEMS_AFFECTED: SettingsTab  
RECOMMENDED_ACTION: Wire `shouldAssignOwnerRole({ dialogConfirmed: true })`. HUMAN.  
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
EVIDENCE: Grant writes the wallet now (`adminAddDokaToUser` third arg `null` ~5738). Approve mints a GameKey the player redeems later. Helper queued #1001.  
SYSTEMS_AFFECTED: Shop; Purchases  
RECOMMENDED_ACTION: Wire unlinked copy. Optional later: purchase-id picker. HUMAN.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-GRANT-UNLINKED-HELPER  
REGRESSION_RISK: HIGH if Grant is wired to auto-approve a request  
VALIDATION_REQUIRED: Grant does not change a Purchases row; Approve still reveals a key.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-SHOP-PACKAGES-MISSING  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Shop packages API unused by the Shop tab  
CATEGORY: economy  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player path is GameKey/Mollie (PR #258). Shop copy: packages retired. Do not add a package editor that would fight GameKey.  
SYSTEMS_AFFECTED: Shop tab  
RECOMMENDED_ACTION: Leave packages unused until a product decision. Prefer GameKey Purchases.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if a second store ships  
VALIDATION_REQUIRED: N/A  
STATUS: SUPERSEDED  

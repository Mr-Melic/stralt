# ACTION_IDs — 2026-10-29 Admin UX & Information Architecture Auditor

Stable IDs. Recapture; do not duplicate AUTO_FIXED work.  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
Narrative: [`ADMIN_UX_AUDIT_2026-10-29.md`](./ADMIN_UX_AUDIT_2026-10-29.md)

---

ACTION_ID: AUX-ENEMY-DELETE-COPY-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Enemy Delete confirm must not claim overworld encounters stop  
CATEGORY: terminology / destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: EnemyList confirm body (`AdminDashboard.tsx` ~2278) is “This removes the live enemy template immediately. Players can encounter it until you recreate it.” The Enemies CatalogNote (~2117–2121) already says overworld spawn does not use getEnemyConfigs. Helper: `ownerEnemyDeleteConfirmBody`. Not wired (stack). Distinct from #1223 spell retire/delete copy.  
SYSTEMS_AFFECTED: EnemyList delete confirm  
RECOMMENDED_ACTION: Wire `ownerEnemyDeleteConfirmBody`. Keep empty sprite URL as a valid Default Pixel Visual. Do not restack EnemyList.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-ENEMY-DELETE-CONFIRM-COPY  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring implies catalog rows drive packs  
VALIDATION_REQUIRED: Confirm body mentions catalog / getEnemyConfigs; does not say players encounter until recreate.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-ENEMY-DELETE-CONFIRM-COPY  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Enemy Delete confirm is inverted and overclaims live encounters  
CATEGORY: terminology / destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same site as AUX-ENEMY-DELETE-COPY-HELPER. “Players can encounter it until you recreate it” is the opposite of a remove. CatalogNote says saving a row does not change encounter packs. HUMAN — EnemyList overlap #341/#413.  
SYSTEMS_AFFECTED: Enemies tab  
RECOMMENDED_ACTION: Wire the helper. Do not add combat identity fields.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-ENEMY-DELETE-COPY-HELPER; AUX-ENEMY-STATS-INCOMPLETE  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Delete still calls adminDeleteEnemyConfig; copy is catalog-only.  
STATUS: NEW  

---

ACTION_ID: AUX-REVEAL-DEST-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: GameKey reveal overlay must name destination email and consent  
CATEGORY: pii / destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reveal overlay (`AdminGameKeyPurchases.tsx` ~716–745) has title + textarea + Copy / Open mailto / Mark emailed / Close. `reveal` state is `{ id, email, code }` (~168–172) and never surfaces `emailConsent`. Helper: `ownerRevealDestinationCopy`. Not wired. Distinct from #1223 consentGate (mailto enablement) and #838 piiRedact.  
SYSTEMS_AFFECTED: Purchases reveal overlay  
RECOMMENDED_ACTION: Render destination + consent above the textarea. Missing email is copy-only, not an error on the request. Do not restack Purchases.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-REVEAL-NO-DESTINATION; AUX-CONSENT-GATE-HELPER  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring redacts the address the operator must mail  
VALIDATION_REQUIRED: Consented row shows Destination: email; empty email says no destination.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-REVEAL-NO-DESTINATION  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Reveal overlay hides who the GameKey is for  
CATEGORY: pii  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-REVEAL-DEST-HELPER. Operator can Copy a 120-char key with no on-screen destination. HUMAN — Purchases overlap #492/#664/#838/#1066/#1115/#1190/#1223.  
SYSTEMS_AFFECTED: Purchases reveal  
RECOMMENDED_ACTION: Wire `ownerRevealDestinationCopy`. Keep Copy. Do not auto-open mailto.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-REVEAL-DEST-HELPER; AUX-PII-PURCHASES  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Overlay still shows the code; destination line is visible before Copy.  
STATUS: NEW  

---

ACTION_ID: AUX-MAILTO-DEAD-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: href # must not look like a live Open mailto control  
CATEGORY: destructive-actions / errors  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `gameKeyMailtoHref` returns "#" for invalid email (`dokaGameKey.ts` ~135). Reveal still renders a blue “Open mailto” `<a href={…}>` (~783–800). Helper: `ownerMailtoHrefLooksLive` / `ownerMailtoDeadCopy`. Not wired. Distinct from #1223 consentGate (still stubs "#") and #1115 mailtoSecret (URL body).  
SYSTEMS_AFFECTED: Purchases reveal mailto control  
RECOMMENDED_ACTION: When `ownerMailtoHrefLooksLive` is false, render disabled copy, not a hash link. Do not restack Purchases or dokaGameKey.ts.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-MAILTO-HASH-LOOKS-LIVE; AUX-MAILTO-NO-CONSENT-GATE  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring hides a valid mailto  
VALIDATION_REQUIRED: Invalid email and consent-false never look like Open mailto; valid consented mailto still can.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-MAILTO-HASH-LOOKS-LIVE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Dead mailto hash is still painted as Open mailto  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same sites as AUX-MAILTO-DEAD-HELPER. Clicking `#` looks like compose and no-ops. Combined with AUX-MAILTO-NO-CONSENT-GATE a refused-mail player still sees the live-looking control. HUMAN — Purchases overlap.  
SYSTEMS_AFFECTED: Purchases reveal  
RECOMMENDED_ACTION: Wire `ownerMailtoDeadCopy` when href is not a live mailto. Keep Copy.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-MAILTO-DEAD-HELPER; AUX-CONSENT-GATE-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Dead state label is Mailto unavailable; Copy remains.  
STATUS: NEW  

---

ACTION_ID: AUX-SWALLOWED-HYDRATE-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Swallowed config fetch must not look live or allow Save  
CATEGORY: save-feedback / errors  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `useGetGameConfig` catch returns `{ leaderBoostPercent: 10, dokaSpawnChance: 40, dokaSpawnBaseValue: 5 }` as success (`useAdminQueries.ts` ~239–244). LevelUp `getLevelUpConfig` catch keeps `pbv_levelup_config` (`AdminDashboard.tsx` ~4391). Boss Rush `getBossRushConfig` catch console.errors and keeps LS (~5451). Helper: `ownerSwallowedHydrateKind` / `shouldDisableOwnerSwallowedPublish`. Not wired. Distinct from #945 never-call Tiers/Visuals and #1223 ad empty-valid.  
SYSTEMS_AFFECTED: Modifiers GameConfig; Settings LevelUp; Boss Rush  
RECOMMENDED_ACTION: Track fetchOk; disable Save on load-failed; banner `ownerSwallowedHydrateCopy`. Do not restack those tabs.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-GAMECONFIG-CATCH-AS-LIVE; AUX-LEVELUP-HYDRATE-FAIL-SILENT; AUX-BOSSRUSH-HYDRATE-FAIL-SILENT  
REGRESSION_RISK: LOW for helper; HIGH if wiring blocks Save after a slow but successful fetch  
VALIDATION_REQUIRED: Offline actor shows load-failed and disables Save; successful fetch still enables Save.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-GAMECONFIG-CATCH-AS-LIVE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Failed getGameConfig is published as live 10/40/5  
CATEGORY: economy / errors  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Query catch returns hardcoded defaults (`useAdminQueries.ts` ~239–244). `gameConfigQ.isError` is never set. Modifiers tab has no error banner (unlike modifier list). Save Config (~6297) publishes `gameConfigDraft`. HUMAN — Modifiers overlap #539/#945.  
SYSTEMS_AFFECTED: Map Modifiers Ground Doka panel; useGetGameConfig  
RECOMMENDED_ACTION: Let the query throw; wire swallowed-hydrate banner; disable Save until Retry. Do not treat 10/40/5 as a valid empty default.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SWALLOWED-HYDRATE-HELPER; AUX-MODIFIER-DOKA-MISPLACED  
REGRESSION_RISK: MEDIUM — real live 10/40/5 must still save  
VALIDATION_REQUIRED: Actor throw shows Failed to load live GameConfig; a real 40% spawn still saves.  
STATUS: NEW  

---

ACTION_ID: AUX-LEVELUP-HYDRATE-FAIL-SILENT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Failed getLevelUpConfig keeps localStorage with no banner  
CATEGORY: system-config / errors  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: LevelUpConfigPanel hydrates `getLevelUpConfig` (~4352–4393) then catch keeps `pbv_levelup_config`. Save writes `adminSetLevelUpConfig` (~4421–4426). Operator can publish a stale browser draft as live. Distinct from AUX-LEVELUP-PARTIAL (nine fields already shown). HUMAN — Settings overlap #470/#539/#945.  
SYSTEMS_AFFECTED: Settings Spell System Config  
RECOMMENDED_ACTION: Wire swallowed-hydrate banner; disable Save until fetchOk. Keep localStorage as cache only.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SWALLOWED-HYDRATE-HELPER; AUX-LIFE-NO-STATES  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Offline actor cannot Save Config; successful hydrate still can.  
STATUS: NEW  

---

ACTION_ID: AUX-BOSSRUSH-HYDRATE-FAIL-SILENT  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Failed getBossRushConfig keeps LS and still looks live  
CATEGORY: content-lifecycle / errors  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Boss Rush effect (~5431–5454) seeds LS then catch only `console.error`. CatalogNote (~7141–7146) says canister save publishes immediately. Save (~7246–7262) writes `adminSetBossRushConfig`. Distinct from AUX-BOSSRUSH-LIVE-UNLABELED (copy already says live) and AUX-BOSSRUSH-PUBLISH-NO-CONFIRM (#470). HUMAN — Boss Rush overlap #470/#539.  
SYSTEMS_AFFECTED: Boss Rush tab  
RECOMMENDED_ACTION: Wire swallowed-hydrate banner; disable publish when fetchOk is false.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SWALLOWED-HYDRATE-HELPER; AUX-BOSSRUSH-PUBLISH-NO-CONFIRM  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Offline actor cannot publish; successful hydrate still can.  
STATUS: NEW  

---

ACTION_ID: AUX-BOSS-ROW-NO-DRAFT-CHIP  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Collapsed boss rows have no DRAFT vs live chip  
CATEGORY: content-lifecycle  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: BossesTab header copy is honest (~7837–7839) and Save is “Save browser draft” (~8100). Collapsed row (~7906–7919) shows name, piece, phase, rewards, portal swatch — no DRAFT chip. `hasOpenEditor` omits bosses (~5479). Distinct from AUX-BOSS-LOCALSTORAGE-AS-LIVE (writer) and AUX-BOSS-LEAVE-UNWARNED (#413).  
SYSTEMS_AFFECTED: Bosses tab list  
RECOMMENDED_ACTION: DRAFT chip on every collapsed row until a canister writer exists. Include expanded boss in leave-guard. Do not add a fake ACTIVE state.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-BOSS-LOCALSTORAGE-AS-LIVE; AUX-LIFE-NO-STATES; AUX-BOSS-LEAVE-UNWARNED  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Chip says DRAFT (this browser); Save still writes pbv_boss_configs only.  
STATUS: NEW  

---

ACTION_ID: AUX-SPRITE-LIST-NO-DEFAULT-CHIP  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Sprite list has no Default Pixel Visual chip  
CATEGORY: visual-asset-ux  
PRIORITY: P2  
CONFIDENCE: MEDIUM  
EVIDENCE: Empty `frontUrl` uses the chess-piece glyph (~1889–1904) — good, not an error. The only chip is `characterPieceType` (~1935). Enemy list already shows Default Pixel / stored-URL chips (~2231–2234). CatalogNote is honest (~1783–1786).  
SYSTEMS_AFFECTED: Player Sprites list  
RECOMMENDED_ACTION: Reuse `enemyVisualStatusCopy` (or a sprite equivalent) as a list chip. Empty remains valid. Do not add a pool editor here.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-VIS-NO-DEFAULT-DISTINCTION; AUX-ENEMY-NO-THUMBNAIL  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Empty URLs stay Default Pixel Visual; filled URL is stored-not-rendered.  
STATUS: NEW  

---

ACTION_ID: AUX-LIFE-NO-STATES  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: No DRAFT / VALIDATION FAILED / READY / ACTIVE / INACTIVE / LEGACY  
CATEGORY: content-lifecycle  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Achievement `active` and modifier `active` are the only lifecycle bits. Every canister Save publishes live. Boss Save is a local draft next to live entity Saves. Spell retire is toasted as deleted. GameConfig fallback looks live.  
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

ACTION_ID: AUX-TIER-NO-CANISTER-HYDRATE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Tiers form never calls getTierSpawnConfig  
CATEGORY: system-config  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: TierConfigTab seeds `pbv_tier_spawn_config` (~3819–3826) and Save calls `adminSetTierSpawnConfig` (~3862). No get. Helper queued #945. Distinct from this run’s swallowed-hydrate (call-then-catch).  
SYSTEMS_AFFECTED: Enemy Tiers tab  
RECOMMENDED_ACTION: Hydrate before publish. Do not treat LS as live.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIG-HYDRATE-HELPER  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Opening Tiers shows canister percents, not a stale browser cache.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-VISUALS-NO-CANISTER-HYDRATE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Visuals never calls getColorPalette  
CATEGORY: visual-asset-ux  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: VisualsTab reads localStorage only (~4698–4721). Save calls `adminSetColorPalette`. Reset is LS only (~4745–4749). Helper queued #945.  
SYSTEMS_AFFECTED: Visuals tab  
RECOMMENDED_ACTION: Hydrate from getColorPalette. Reset must not look canister-live until Save.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIG-HYDRATE-HELPER; AUX-PALETTE-RESET-NOT-LIVE  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Another browser sees the same palette after Save, not after Reset.  
STATUS: PARTIAL  

---

ACTION_ID: AUX-MODIFIER-DOKA-MISPLACED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Ground Doka + leader boost sit on Map Modifiers  
CATEGORY: information-architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Economy fields above the modifier list (`AdminDashboard.tsx` ~6199–6323). Combined this run with AUX-GAMECONFIG-CATCH-AS-LIVE.  
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
EVIDENCE: `gameKeyMailtoHref(email, code)` (`dokaGameKey.ts` ~134–140). Helper queued #1115. Combined with AUX-MAILTO-NO-CONSENT-GATE and AUX-MAILTO-HASH-LOOKS-LIVE.  
SYSTEMS_AFFECTED: AdminGameKeyPurchases reveal  
RECOMMENDED_ACTION: Wire `ownerGameKeyMailtoHref` and dead-control copy.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-MAILTO-SECRET-HELPER; AUX-CONSENT-GATE-HELPER; AUX-MAILTO-DEAD-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Open mailto draft has no GameKey; Copy still copies the code.  
STATUS: PARTIAL  

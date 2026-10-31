# ACTION_IDs — 2026-10-31 Admin UX & Information Architecture Auditor

Stable IDs. Recapture; do not duplicate AUTO_FIXED work.  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
Narrative: [`ADMIN_UX_AUDIT_2026-10-31.md`](./ADMIN_UX_AUDIT_2026-10-31.md)

---

ACTION_ID: AUX-BOSS-DRAFT-CHIP-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Collapsed boss rows must chip DRAFT, never live  
CATEGORY: content-lifecycle  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: BossesTab header is honest (`AdminDashboard.tsx` ~7837–7839) and Save is “Save browser draft” (~8100). Collapsed row (~7906–7919) shows name, piece, phase, rewards, portal swatch — no DRAFT chip. Helper: `ownerBossCollapsedRowChip`. Not wired (stack). Distinct from adminOwnerUx.lifecycle.ts (#564).  
SYSTEMS_AFFECTED: Bosses tab list  
RECOMMENDED_ACTION: Wire the chip on every collapsed row until a canister writer exists. Do not add a fake ACTIVE state.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-BOSS-ROW-NO-DRAFT-CHIP; AUX-BOSS-LOCALSTORAGE-AS-LIVE  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring implies Motoko BossConfig  
VALIDATION_REQUIRED: Chip says DRAFT (this browser); Save still writes pbv_boss_configs only.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-BOSS-ROW-NO-DRAFT-CHIP  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Collapsed boss rows have no DRAFT vs live chip  
CATEGORY: content-lifecycle  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Same site as AUX-BOSS-DRAFT-CHIP-HELPER. HUMAN — BossesTab overlap #341/#413/#470.  
SYSTEMS_AFFECTED: Bosses tab list  
RECOMMENDED_ACTION: Wire `ownerBossCollapsedRowChip`. Keep “Save browser draft”.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-BOSS-DRAFT-CHIP-HELPER; AUX-LIFE-NO-STATES  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Chip visible while collapsed; expanding still edits the browser draft.  
STATUS: NEW  

---

ACTION_ID: AUX-SPRITE-LIST-CHIP-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Sprite list must chip Default Pixel Visual vs stored URL  
CATEGORY: visual-asset-ux  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Empty `frontUrl` uses the chess-piece glyph (`AdminDashboard.tsx` ~1889–1904) — valid, not an error. The only chip is `characterPieceType` (~1935). Enemy list already shows Default Pixel / stored-URL chips (~2231–2234). Helper: `ownerSpriteListVisualChip` reuses `enemyVisualStatusCopy`. Not wired. Distinct from visualPreview / visualPool / visualRevert.  
SYSTEMS_AFFECTED: Player Sprites list  
RECOMMENDED_ACTION: Render the chip beside piece type. Empty remains valid. Do not add a pool editor here.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-SPRITE-LIST-NO-DEFAULT-CHIP; AUX-VIS-NO-DEFAULT-DISTINCTION  
REGRESSION_RISK: LOW for helper  
VALIDATION_REQUIRED: Empty URLs stay Default Pixel Visual; filled URL is stored-not-rendered.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-SPRITE-LIST-NO-DEFAULT-CHIP  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Sprite list has no Default Pixel Visual chip  
CATEGORY: visual-asset-ux  
PRIORITY: P2  
CONFIDENCE: MEDIUM  
EVIDENCE: Same site as AUX-SPRITE-LIST-CHIP-HELPER. CatalogNote is honest (~1783–1786). HUMAN — Sprites overlap #341/#413.  
SYSTEMS_AFFECTED: Player Sprites list  
RECOMMENDED_ACTION: Wire `ownerSpriteListVisualChip`. Do not treat empty as missing-asset error.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SPRITE-LIST-CHIP-HELPER; AUX-ASSET-NO-POOL  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Empty URLs stay Default Pixel Visual; filled URL is stored-not-rendered.  
STATUS: NEW  

---

ACTION_ID: AUX-BOSS-LEAVE-GUARD-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Leave-dashboard must include expanded boss drafts  
CATEGORY: unsaved-changes  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `hasOpenEditor` (`AdminDashboard.tsx` ~5479–5485) covers enemy/region/spell/modifier/achievement/sprite. BossesTab `expandedId` + in-memory `drafts` (~7756–7757) are omitted, so Back / tab change discards an open boss form. Helper: `ownerLeaveGuardNeedsBossDraft`. Not wired. Distinct from adminOwnerUx.dirty.ts (#838).  
SYSTEMS_AFFECTED: AdminDashboard leave-guard; BossesTab  
RECOMMENDED_ACTION: OR the helper into `hasOpenEditor`. Do not restack the ConfirmDialog.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-BOSS-LEAVE-UNWARNED; AUX-DIRTY-UNUSED  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring warns when no boss tab is open  
VALIDATION_REQUIRED: Expanded boss → Leave dashboard opens the unsaved dialog; Cancel keeps the draft.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-BOSS-LEAVE-UNWARNED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Expanded boss editor is omitted from unsaved-leave  
CATEGORY: unsaved-changes  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same site as AUX-BOSS-LEAVE-GUARD-HELPER. Sprite leave is already wired; bosses are not. HUMAN — leave-guard overlap #413/#539.  
SYSTEMS_AFFECTED: AdminDashboard; BossesTab  
RECOMMENDED_ACTION: Wire `ownerLeaveGuardNeedsBossDraft`. Keep boss Save as browser draft.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-BOSS-LEAVE-GUARD-HELPER; AUX-BOSS-LOCALSTORAGE-AS-LIVE  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Leave with an expanded boss prompts; empty Bosses tab does not.  
STATUS: NEW  

---

ACTION_ID: AUX-SPELL-LIFECYCLE-CHIP-HELPER  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Spell list must chip ACTIVE vs RETIRED / INACTIVE  
CATEGORY: content-lifecycle  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: SpellList chips are effectType / AP / DMG / RNG (`AdminDashboard.tsx` ~3741–3760). `adminDeleteSpellConfig` retires built-ins (`main.mo` ~882–894) and deletes custom rows. Confirm copy still says “removes the live spell immediately” (~3794). Helper: `ownerSpellListLifecycleChip`. Not wired. Distinct from #1223 spellDeleteCopy (toast/err) and #564 summon fields.  
SYSTEMS_AFFECTED: SpellList  
RECOMMENDED_ACTION: Wire ACTIVE / RETIRED / INACTIVE. Never label a canister row DRAFT. Keep built-in ids undeletable.  
AUTONOMY: SAFE_TO_AUTO_IMPLEMENT (helper this run); HUMAN for wiring  
DEPENDENCIES: AUX-SPELL-LIST-NO-LIFECYCLE-CHIP; AUX-SPELL-DELETE-COPY-HELPER; AUX-LIFE-NO-STATES  
REGRESSION_RISK: LOW for helper; MEDIUM if wiring implies a staged publish  
VALIDATION_REQUIRED: shadow_strike with usableByPlayer=false chips RETIRED, not ACTIVE; custom unused chips INACTIVE.  
STATUS: AUTO_FIXED  

---

ACTION_ID: AUX-SPELL-LIST-NO-LIFECYCLE-CHIP  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Retired built-in spells still look live on the list  
CATEGORY: content-lifecycle  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same site as AUX-SPELL-LIFECYCLE-CHIP-HELPER. CatalogNote already admits no summon controls (~3640–3645). HUMAN — SpellList overlap #341/#564/#1223.  
SYSTEMS_AFFECTED: Spells tab  
RECOMMENDED_ACTION: Wire the helper. Align Delete confirm with retire-vs-delete (#1223).  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SPELL-LIFECYCLE-CHIP-HELPER; AUX-SPELL-RETIRE-TOAST-AS-DELETE  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Retire still sets usableByPlayer=false; list chip matches.  
STATUS: NEW  

---

ACTION_ID: AUX-ENEMY-DELETE-CONFIRM-COPY  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Enemy Delete confirm is inverted and overclaims live encounters  
CATEGORY: terminology / destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: EnemyList confirm body (`AdminDashboard.tsx` ~2278) is “This removes the live enemy template immediately. Players can encounter it until you recreate it.” CatalogNote (~2117–2121) says overworld spawn does not use getEnemyConfigs. Helper queued #1286. HUMAN — EnemyList overlap #341/#413.  
SYSTEMS_AFFECTED: Enemies tab  
RECOMMENDED_ACTION: Wire `ownerEnemyDeleteConfirmBody`. Do not add combat identity fields.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-ENEMY-DELETE-COPY-HELPER; AUX-ENEMY-STATS-INCOMPLETE  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Delete still calls adminDeleteEnemyConfig; copy is catalog-only.  
STATUS: NEW  

---

ACTION_ID: AUX-REVEAL-NO-DESTINATION  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Reveal overlay hides who the GameKey is for  
CATEGORY: pii  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reveal overlay (`AdminGameKeyPurchases.tsx` ~716–745) has title + textarea + Copy / Open mailto / Mark emailed / Close. `reveal` state is `{ id, email, code }` (~168–172) and never surfaces email or `emailConsent`. Helper queued #1286. HUMAN — Purchases overlap #492/#664/#838/#1066/#1115/#1190/#1223.  
SYSTEMS_AFFECTED: Purchases reveal  
RECOMMENDED_ACTION: Wire `ownerRevealDestinationCopy`. Keep Copy. Do not auto-open mailto.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-REVEAL-DEST-HELPER; AUX-PII-PURCHASES  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Overlay still shows the code; destination line is visible before Copy.  
STATUS: NEW  

---

ACTION_ID: AUX-MAILTO-HASH-LOOKS-LIVE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Dead mailto hash is still painted as Open mailto  
CATEGORY: destructive-actions  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `gameKeyMailtoHref` returns "#" for invalid email (`dokaGameKey.ts` ~135). Reveal still renders a blue “Open mailto” `<a href={…}>` (~783–800). Helper queued #1286. Combined with AUX-MAILTO-NO-CONSENT-GATE.  
SYSTEMS_AFFECTED: Purchases reveal  
RECOMMENDED_ACTION: Wire `ownerMailtoDeadCopy` when href is not a live mailto. Keep Copy.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-MAILTO-DEAD-HELPER; AUX-CONSENT-GATE-HELPER  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Dead state label is Mailto unavailable; Copy remains.  
STATUS: NEW  

---

ACTION_ID: AUX-GAMECONFIG-CATCH-AS-LIVE  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Failed getGameConfig is published as live 10/40/5  
CATEGORY: economy / errors  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Query catch returns hardcoded defaults (`useAdminQueries.ts` ~239–244). `gameConfigQ.isError` is never set. Modifiers tab has no error banner (unlike modifier list). Save Config (~6297) publishes `gameConfigDraft`. Helper queued #1286. HUMAN — Modifiers overlap #539/#945.  
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
EVIDENCE: LevelUpConfigPanel hydrates `getLevelUpConfig` (`AdminDashboard.tsx` ~4352–4393) then catch keeps `pbv_levelup_config`. Save writes `adminSetLevelUpConfig` (~4421–4426). Operator can publish a stale browser draft as live. Helper queued #1286. HUMAN — Settings overlap #470/#539/#945.  
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
EVIDENCE: Boss Rush effect (`AdminDashboard.tsx` ~5431–5454) seeds LS then catch only `console.error`. Missing keys render Enabled (`!== false`, ~7161). CatalogNote (~7141–7146) says canister save publishes immediately. Helper queued #1286. HUMAN — Boss Rush overlap #470/#539.  
SYSTEMS_AFFECTED: Boss Rush tab  
RECOMMENDED_ACTION: Wire swallowed-hydrate banner; disable publish when fetchOk is false.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-SWALLOWED-HYDRATE-HELPER; AUX-BOSSRUSH-PUBLISH-NO-CONFIRM  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Offline actor cannot publish; successful hydrate still can.  
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
EVIDENCE: `getAdminAuditLog` in `main.mo` ~3486; AdminDashboard never calls it. Settings CatalogNote (~4230–4234) admits rollback + audit have no editors. Helper queued #838.  
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
EVIDENCE: DESIGN.md requires ≥44px targets. Dashboard Btn/Field/tabs &lt;44px; Purchases overlay is 44; row Approve/Reject/Show code stay minHeight 36. Helper queued #1115.  
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
EVIDENCE: TierConfigTab seeds `pbv_tier_spawn_config` (`AdminDashboard.tsx` ~3819–3826) and Save calls `adminSetTierSpawnConfig` (~3862). No get. Helper queued #945. Distinct from swallowed-hydrate (call-then-catch).  
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
EVIDENCE: VisualsTab reads localStorage only (`AdminDashboard.tsx` ~4698–4721). Save calls `adminSetColorPalette`. Reset is LS only (~4745–4749) with honest copy (~4924–4926). Helper queued #945.  
SYSTEMS_AFFECTED: Visuals tab  
RECOMMENDED_ACTION: Hydrate from getColorPalette. Reset must not look canister-live until Save.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-CONFIG-HYDRATE-HELPER  
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
EVIDENCE: Economy fields above the modifier list (`AdminDashboard.tsx` ~6199–6323). Combined with AUX-GAMECONFIG-CATCH-AS-LIVE.  
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
EVIDENCE: Single optional URL. Default vs custom copy exists on editors. No pool, weights, activate/deactivate, or first-class revert. Empty remains a valid default.  
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
EVIDENCE: Shop Grant title interpolates `shopDokaAmount` then the confirm handler reads live state after dismiss (`AdminDashboard.tsx` ~5724–5737). GameKey Approve stores `confirm.amount` (`AdminGameKeyPurchases.tsx` ~839–849) and `approve(rec)` re-parses `dokaDraft[rec.id]` (~213–219). Helper queued #1115.  
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

---

ACTION_ID: AUX-DIRTY-UNUSED  
SOURCE_AUTOMATION: Admin UX & Information Architecture Auditor  
TITLE: Field-level dirty + beforeunload still missing  
CATEGORY: unsaved-changes  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `AdminDashboardState.isDirty` is still hardcoded `false` (`AdminDashboard.tsx` ~5361). Leave-editor covers listed editors including sprites, not bosses. Closing the browser tab has no `beforeunload`. Helper queued #838.  
SYSTEMS_AFFECTED: `gameTypes.ts` `isDirty`; all editors  
RECOMMENDED_ACTION: Set `isDirty` from form diffs; warn only when dirty; `beforeunload` when dirty.  
AUTONOMY: HUMAN_APPROVAL_REQUIRED  
DEPENDENCIES: AUX-BOSS-LEAVE-UNWARNED  
REGRESSION_RISK: MEDIUM — false positives will train operators to dismiss.  
VALIDATION_REQUIRED: Unchanged form can leave without dialog; dirty form warns; refresh prompts.  
STATUS: PARTIAL  

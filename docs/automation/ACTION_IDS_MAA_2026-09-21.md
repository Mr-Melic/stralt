# ACTION_IDs — 2026-09-21 Mobile / Touch / Accessibility Auditor

Reuse prior IDs when the finding is the same. Implemented chrome from 2026-08-31
through 2026-09-02 still holds (Continue, 400ms ghost-click, portal helper,
canvas `touch-action: none`, mobile 44px utilities, `100dvh`, HUD safe-area
tokens, 16px inputs, changelog/recap `<dialog>` + Escape).

`DESIGN.md` was not edited.

Open PRs #327 and #331 already touch `WorldExploration.tsx`. This run did not
edit that file so stack-compat stays a union, not an overwrite.

---

ACTION_ID: MAA-2026-09-21-001
TITLE: Leaderboard overlay ignored Escape
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/utils/shopDialogDismiss.ts
CURRENT_BEHAVIOUR: Backdrop Enter/Space closed the board; Escape did not.
DESIRED_BEHAVIOUR: Escape dismisses Leaderboard the same way Item Shop and recap do.
EVIDENCE: LeaderboardModal onKeyDown only handled Enter/Space on the backdrop.
RECOMMENDED_ACTION: Keep the window keydown + shouldDismissShopDialogOnKey path shipped this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Open Board, press Escape, overlay closes; backdrop click still closes.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-21-002
TITLE: Character-select Back and Log Out are icon-only on narrow viewports without an accessible name
CATEGORY: keyboard-focus
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx
CURRENT_BEHAVIOUR: Visible label used hidden sm:inline; no aria-label.
DESIRED_BEHAVIOUR: Screen readers announce Back and Log Out when the text is hidden.
EVIDENCE: GameFlow header buttons before this run.
RECOMMENDED_ACTION: Keep the aria-label attributes shipped this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Below 640px width, buttons still expose an accessible name.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-21-003
TITLE: Boost toggle close and mode pills were below 44px on mobile
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BoostToggle.tsx
CURRENT_BEHAVIOUR: Close used padding 0; XP/Rewards pills used 4px vertical padding.
DESIRED_BEHAVIOUR: DESIGN.md mobile targets ≥44px via existing stone-touch-target rule.
EVIDENCE: BoostToggle close and tab buttons lacked the mobile min-size class.
RECOMMENDED_ACTION: Keep stone-touch-target + aria-pressed on the pills.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — mobile-only min size.
VALIDATION_REQUIRED: At 390px width, Boost close and XP/Rewards measure ≥44px.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-21-004
TITLE: Attack Nearest and status badges exposed details only through title=
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx; src/frontend/src/components/StatusEffectBadge.tsx
CURRENT_BEHAVIOUR: Attack Nearest had title only; effect description lived in title= only.
DESIRED_BEHAVIOUR: aria-label carries the same text for keyboard and AT. Full tap-to-inspect remains MAA-2026-08-31-008.
EVIDENCE: BattleUIPanel nearest button; StatusEffectBadge title= before this run.
RECOMMENDED_ACTION: Keep the aria-label copies. Do not treat this as the tap-inspect sheet.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Accessibility tree shows nearest reason and effect description.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-08-31-006
TITLE: Dual HUD crowding — realm tools and Stats overlay the canvas on phones
CATEGORY: hud-overlap
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: GameFlow no longer draws a second opaque top bar, but Items/Board/Feats/Bosses sit at calc(var(--app-top-hud-height) + 2px) over the map. Stats defaults unfolded at 224px. WX HUD still packs name, XP, Doka, region, Center, Enemies on one 44px row.
DESIRED_BEHAVIOUR: One phone chrome row; canvas inset matches live HUD; tools do not cover tiles.
EVIDENCE: GameFlow tools cluster; WX HUD flex row; stats-panel defaultFolded false.
RECOMMENDED_ACTION: Human-approved merge of HUD + tools. Do not auto-redesign.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — layout + shop/doka chrome.
VALIDATION_REQUIRED: Portrait and landscape; Center and Enemies reachable; canvas not under chrome.
STATUS: NEW

---

ACTION_ID: MAA-2026-08-31-007
TITLE: Battle footer is a saved DraggablePanel, not a sticky viewport dock
CATEGORY: sticky-battle-controls
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx; src/frontend/src/components/DraggablePanel.tsx
CURRENT_BEHAVIOUR: Default y is innerHeight-220 and persists in uiLayout. Short landscape can cover the map or sit off-screen. SummonControlPanel is already a bottom-safe dock; the player bar is not.
DESIRED_BEHAVIOUR: On narrow viewports, pin spells/actions to the bottom safe-area and disable drag, or offer a docked mobile layout.
EVIDENCE: DESIGN.md line 74; BattleUIPanel defaultPosition; no mobile dock branch.
RECOMMENDED_ACTION: Design a docked mobile battle chrome.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — persisted uiLayout.
VALIDATION_REQUIRED: Portrait and landscape battle; controls remain visible after rotate.
STATUS: NEW

---

ACTION_ID: MAA-2026-08-31-008
TITLE: Spell and status details are hover-only title tooltips
CATEGORY: hover-only
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx; StatusEffectBadge.tsx; SpellbookModal.tsx; InitiativeStrip.tsx
CURRENT_BEHAVIOUR: Spell slots now have aria-label, but the description still has no tap sheet. Touch has no hover; OS long-press tooltip is unreliable.
DESIRED_BEHAVIOUR: Tap-to-inspect or a persistent detail sheet for spells and effects.
EVIDENCE: BattleUIPanel spellTitle title= + aria-label; StatusEffectBadge title= for description.
RECOMMENDED_ACTION: Reuse StatPopup / inspect for spells and effects on tap.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Touch tap shows spell text; keyboard focus shows the same.
STATUS: NEW

---

ACTION_ID: MAA-2026-08-31-009
TITLE: Forced inspect via long-press / right-click is documented but missing
CATEGORY: combat-ux
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx comments; WorldExploration.tsx
CURRENT_BEHAVIOUR: Comments say forced inspect is right-click / long-press. No contextmenu or long-press handler exists.
DESIRED_BEHAVIOUR: Implement the documented path, or update the comments and provide another inspect path while a spell is selected.
EVIDENCE: Grep found no onContextMenu / long-press in WorldExploration.
RECOMMENDED_ACTION: Add pointer-type-aware long-press (≥500ms) and contextmenu inspect that does not cast.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — must not steal casts.
VALIDATION_REQUIRED: Spell selected + long-press opens inspect; tap still casts.
STATUS: NEW

---

ACTION_ID: MAA-2026-08-31-010
TITLE: Sprite hit padding is 10px mouse vs 14px touch
CATEGORY: combat-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: hitTestSprite uses 10px on click and 14px on touch. After a target is chosen, decideSpriteCastClick is shared, but the chosen entity can differ at the same client point.
DESIRED_BEHAVIOUR: Same padding, or a documented finger-slop policy that still prefers the front-most legal target.
EVIDENCE: handleCanvasClick hitTestSprite(..., 10); handleCanvasTouch hitTestSprite(..., 14).
RECOMMENDED_ACTION: Report-only until a targeting owner picks one padding.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if unified blindly.
VALIDATION_REQUIRED: Overlapping sprites at the same client point resolve to the same combatant.
STATUS: NEW

---

ACTION_ID: MAA-2026-08-31-011
TITLE: useIsMobile is width-only so landscape phones lose MOBILE_ZOOM
CATEGORY: viewport-scaling
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/hooks/use-mobile.tsx; WorldExploration.tsx MOBILE_ZOOM 1.75
CURRENT_BEHAVIOUR: isMobile is innerWidth < 768. A phone in landscape often becomes desktop tiles.
DESIRED_BEHAVIOUR: Treat coarse pointers / hover:none as mobile for zoom, or use a min(width,height) breakpoint.
EVIDENCE: use-mobile.tsx; WX effectiveTileW = TILE_WIDTH * MOBILE_ZOOM when isMobile.
RECOMMENDED_ACTION: Human-approved input-mode heuristic. Do not change tile math in this audit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — camera / tile size.
VALIDATION_REQUIRED: Same phone portrait and landscape keep readable tiles.
STATUS: NEW

---

ACTION_ID: MAA-2026-08-31-012
TITLE: Hover tile / enemy preview has no touch equivalent
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: WorldExploration handleCanvasMouseMove
CURRENT_BEHAVIOUR: hoveredTile and hoveredEnemyId update only on mousemove.
DESIRED_BEHAVIOUR: Touch-and-hold preview, or rely solely on range highlights (already computed).
EVIDENCE: handleCanvasMouseMove; no touchmove hover path.
RECOMMENDED_ACTION: Report-only; range highlights already cover legality.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Touch players can see legal tiles without hover.
STATUS: NEW

---

ACTION_ID: MAA-2026-08-31-013
TITLE: Initiative HP is color-only; muted gold/dim text may miss 4.5:1
CATEGORY: contrast-status
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: BattleUIPanel stone-battle-hp-bar; index.css --dofus-text-dim; GameFlow #8a8090
CURRENT_BEHAVIOUR: Chip HP is a red bar with no numeric text. Dim labels use ~0.45 lightness / #8a8090 on navy.
DESIRED_BEHAVIOUR: HP number or percent on chips; raise dim text to a passing pair.
EVIDENCE: DESIGN.md lines 75–76; chip bar has no text node.
RECOMMENDED_ACTION: Add compact HP text; audit OKLCH pairs. Not a redesign of the bar.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Contrast checker + screen reader name includes HP.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-005
TITLE: Zone Lock dialog is a non-modal open dialog without Escape
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: `<dialog open>` has Close but no keydown. Native Escape only applies to showModal().
DESIRED_BEHAVIOUR: Escape and optional backdrop dismiss, matching changelog/recap.
EVIDENCE: showZoneLockPopup dialog; no Escape listener in WorldExploration.
RECOMMENDED_ACTION: Add a window Escape listener when the popup is open. Avoid editing WorldExploration while #327/#331 are queued unless restacked.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Open Zone Lock, press Escape, dialog closes.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-006
TITLE: Zone Lock FAB ignores the bottom safe area
CATEGORY: safe-areas
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: position fixed bottom 80px right 16px with no env(safe-area-inset-*).
DESIRED_BEHAVIOUR: bottom/right use the same --app-safe-* contract as the HUD.
EVIDENCE: Zone Tier button styles at WorldExploration ~17604.
RECOMMENDED_ACTION: bottom: calc(80px + env(safe-area-inset-bottom)); right: max(16px, env(safe-area-inset-right)).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: iPhone home-indicator overlap; landscape notch.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-007
TITLE: Stats rename pencil is a ~14px target with no accessible name
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: 10px icon, padding 2, title only, no stone-touch-target.
DESIRED_BEHAVIOUR: ≥44px on mobile and aria-label Rename character.
EVIDENCE: stats.rename_button.
RECOMMENDED_ACTION: Add stone-touch-target + aria-label. Do not restyle the pencil.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: At 390px width the rename control measures ≥44px and has an accessible name.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-008
TITLE: Rename modal has no Escape or backdrop dismiss
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Overlay is a plain fixed div; only Cancel/Confirm close it.
DESIRED_BEHAVIOUR: Escape and backdrop click close without spending Doka.
EVIDENCE: stats.rename_modal has no onKeyDown / backdrop handler.
RECOMMENDED_ACTION: Mirror shopDialogDismiss. Confirm remains the only spend path.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Escape closes; Confirm still charges 100 Doka only on success.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-009
TITLE: Touch canvas handler omits activeSpells and hit-test deps the mouse handler lists
CATEGORY: combat-parity
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: handleCanvasClick deps include activeSpells, hitTestSprite, combatantStoreCtx, tileCenter, logBattleEntry. handleCanvasTouch omits them. selectedSummonSpellId is in neither.
DESIRED_BEHAVIOUR: The same curated dep set on both handlers so a loadout or kit change cannot leave touch on a stale closure.
EVIDENCE: Click deps ~10630; touch deps ~11211.
RECOMMENDED_ACTION: Align the touch array with the click array. Restack if WorldExploration is still queued in older PRs.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — callback identity / stale combat legality.
VALIDATION_REQUIRED: Change equipped spells, tap a target; touch uses the new list.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-010
TITLE: World canvas is tab-focusable with onKeyDown undefined
CATEGORY: keyboard-focus
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: canvas tabIndex={0} aria-label set, onKeyDown={undefined}. Attack Nearest S is a window listener. Walk/cast have no keyboard path.
DESIRED_BEHAVIOUR: Either a documented keyboard move/cast map, or tabIndex={-1} so focus is not trapped on a silent canvas.
EVIDENCE: WorldExploration canvas props ~17880.
RECOMMENDED_ACTION: Report-only until a keyboard combat scheme is designed.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if keyboard move is added without the live cast gate.
VALIDATION_REQUIRED: Tab order skips a no-op canvas, or arrow/confirm uses decideTileCastClick.
STATUS: NEW

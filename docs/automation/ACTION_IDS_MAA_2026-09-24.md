# ACTION_IDs — 2026-09-24 Mobile / Touch / Accessibility Auditor

Reuse prior IDs when the finding is the same. Implemented chrome from
2026-08-31 through 2026-09-23 still holds on this HEAD unless noted
(Continue, 400ms ghost-click, portal helper, canvas `touch-action: none`,
mobile 44px utilities, `100dvh` helper class, HUD safe-area tokens, 16px
inputs, changelog/recap `<dialog>` + Escape).

`DESIGN.md` was not edited.

This run did **not** edit WorldExploration (39 older open PRs), GameFlow
(#335/#435/#490), BattleUIPanel (#335/#379/#417/#432), index.css
(#339/#423/#469), ChallengePanel (#364/#372), CharacterSelection
(#421/#425/#464), Settings/Spellbook/Boss/Enemy (#425), or Initiative /
Feats / StatPopup / Boost / StatusEffectBadge (#335/#471).

`subscribeEscapeToDismiss` is copied identically from open PRs **#425** and
**#471** so the helper unions instead of forking.

Combat mouse/touch still share `decideSpriteCastClick` / `decideTileCastClick`
and the 400ms ghost-click window (`preventDefault` first). Sprite hit pad
remains 10px mouse vs 14px touch (report-only).

---

ACTION_ID: MAA-2026-09-22-007
TITLE: Buy Doka overlay ignored Escape unless the overlay node was focused
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/DokaGameKeyShop.tsx; src/frontend/src/utils/shopDialogDismiss.ts
CURRENT_BEHAVIOUR: Overlay onKeyDown only. Focus on email, GameKey, or Redeem meant Escape did nothing.
DESIRED_BEHAVIOUR: Window keydown dismisses without starting a purchase or redeem.
EVIDENCE: DokaGameKeyShop overlay onKeyDown; no window listener on this HEAD before this run.
RECOMMENDED_ACTION: Keep subscribeEscapeToDismiss while the shop is mounted, shipped this run. Copy matches #425/#471.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — dismiss only; redeem still requires the button.
VALIDATION_REQUIRED: Open Buy Doka, focus the GameKey field, press Escape; overlay closes and no redeem runs.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-23-005
TITLE: Item Shop overlay ignored Escape unless the overlay node was focused
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BuffShop.tsx; src/frontend/src/utils/shopDialogDismiss.ts
CURRENT_BEHAVIOUR: Overlay onKeyDown only. Focus on Shop/Inventory/Buy/Use meant Escape did nothing.
DESIRED_BEHAVIOUR: Window Escape closes Items without buying or using a potion.
EVIDENCE: BuffShop onKeyDown; no window listener on this HEAD before this run.
RECOMMENDED_ACTION: Keep subscribeEscapeToDismiss when isBuffShopOpen, shipped this run. Persist/buy/use unchanged.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — dismiss only.
VALIDATION_REQUIRED: Open Items, focus Buy, press Escape; shop closes and inventory is unchanged.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-24-001
TITLE: Item Shop tabs, Buy, and Use were below 44px
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BuffShop.tsx
CURRENT_BEHAVIOUR: Shop/Inventory used padding 4px 0. Buy used padding 3px 0. Use was width 38 with padding 3px 0. stone-btn-crimson is not in the mobile 44px CSS list (MAA-2026-09-22-004).
DESIRED_BEHAVIOUR: Those controls measure ≥44px on viewports ≤768px via stone-touch-target. No visual redesign on desktop.
EVIDENCE: BuffShop tabButtonStyle / buyBtnStyle / getBtnStyle before this run.
RECOMMENDED_ACTION: Keep the stone-touch-target classes shipped this run. Broader stone-btn-* media-query remains MAA-2026-09-22-004.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — mobile min size only; tryPurchaseBuffItem / tryConsumeBuffItem unchanged.
VALIDATION_REQUIRED: At 390px width, Shop, Inventory, Buy, and Use measure ≥44px; double-tap still buys/uses once.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-24-002
TITLE: Forge view, rotate, randomize, color, and save targets were below 44px
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterCreation.tsx
CURRENT_BEHAVIOUR: View tabs used padding 7px 4px. Rotate/Randomize used padding 9px. Color inputs were 28×28 with no accessible name. Cancel/Save used padding 13px (~40px).
DESIRED_BEHAVIOUR: Those controls measure ≥44px on viewports ≤768px via stone-touch-target. Color inputs expose aria-label.
EVIDENCE: CharacterCreation view / rotate / randomize / color / cancel / save styles before this run.
RECOMMENDED_ACTION: Keep stone-touch-target + color aria-label shipped this run. Name-hint copy stays with #372.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — mobile min size only; save payload unchanged.
VALIDATION_REQUIRED: At 390px width those controls measure ≥44px; Create still requires a name.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-24-003
TITLE: Forge screen used minHeight 100% and ignored the notch
CATEGORY: viewport-scaling
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterCreation.tsx
CURRENT_BEHAVIOUR: minHeight 100% clipped under iOS URL bars and sat under the notch. Landing/profile already use min-h-app-viewport + safe-area padding.
DESIRED_BEHAVIOUR: 100dvh helper class and safe-area padding, matching ProfileSetup.
EVIDENCE: CharacterCreation root style before this run; ProfileSetup already has both.
RECOMMENDED_ACTION: Keep min-h-app-viewport + env(safe-area-inset-*) padding shipped this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: iPhone portrait forge fills the visible viewport and is not under the notch.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-24-004
TITLE: Map Effects panel had no accessible name
CATEGORY: keyboard-focus
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/MapModifiersPanel.tsx
CURRENT_BEHAVIOUR: Active modifier names lived in 9px visual text only. The panel is pointer-events none (inspect-only).
DESIRED_BEHAVIOUR: A region name lists active modifiers for assistive tech. Contrast/size stay MAA-2026-08-31-013.
EVIDENCE: MapModifiersPanel inner div had data-ocid only.
RECOMMENDED_ACTION: Keep role=region + aria-label shipped this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — name only; pointer-events still none.
VALIDATION_REQUIRED: Screen reader announces active modifier names.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-24-005
TITLE: Feat toast was a nameless live region
CATEGORY: hover-only
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/AchievementToast.tsx
CURRENT_BEHAVIOUR: Button had aria-live=polite and no aria-label. Visible heading still says Achievement Unlocked on this HEAD (#485 changes that copy).
DESIRED_BEHAVIOUR: Accessible name includes the feat name and that the control dismisses.
EVIDENCE: AchievementToast button props before this run.
RECOMMENDED_ACTION: Keep aria-label shipped this run. Visible Feat copy stays with #485.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — name only.
VALIDATION_REQUIRED: Screen reader names the unlocked feat; tap still dismisses.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-24-006
TITLE: Decorative starfield canvas was in the accessibility tree
CATEGORY: keyboard-focus
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/StarfieldBackground.tsx
CURRENT_BEHAVIOUR: Full-viewport canvas has no accessible name. pointer-events none already. Biome `noAriaHiddenOnFocusable` rejects aria-hidden on the canvas itself.
DESIRED_BEHAVIOUR: Hide the decorative canvas from assistive tech without wrapping it in a new positioned ancestor (RAF/resize reads the canvas box).
EVIDENCE: StarfieldBackground canvas; biome lint on aria-hidden.
RECOMMENDED_ACTION: Leave the canvas as-is until a targeting-safe hide (role=presentation on a non-focusable host) is designed. Do not wrap the fixed canvas.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if a wrapper changes canvas clientWidth used by the RAF loop.
VALIDATION_REQUIRED: Screen reader does not announce an unlabeled canvas on landing; starfield still fills the viewport after rotate.
STATUS: NEW

---

ACTION_ID: MAA-2026-08-31-006
TITLE: Dual top bars hide Center, Enemies, region, and dungeon chain
CATEGORY: hud-overlap
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: GameFlow stone-top-bar is z-index 9000. WorldExploration has its own 44px bar. Unique WX controls sit under the GameFlow bar.
DESIRED_BEHAVIOUR: One top bar that includes camera-center, enemy register, region, and dungeon-chain, with canvas inset matching the live bar height.
EVIDENCE: GameFlow game-mode header; WX top bar. Older PRs own both files.
RECOMMENDED_ACTION: Human-approved merge of the two bars. Do not auto-redesign.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — layout + shop/doka chrome.
VALIDATION_REQUIRED: Portrait and landscape; Center and Enemies reachable; canvas not under the bar.
STATUS: NEW

---

ACTION_ID: MAA-2026-08-31-007
TITLE: Battle footer is a saved DraggablePanel, not a sticky viewport dock
CATEGORY: sticky-battle-controls
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx; src/frontend/src/components/DraggablePanel.tsx
CURRENT_BEHAVIOUR: Battle UI default y is innerHeight-220 and persists. On a short landscape viewport it can cover the map or sit off-screen. DESIGN.md wants the bottom menu stuck to the viewport.
DESIRED_BEHAVIOUR: On narrow viewports, pin battle spells/actions to the bottom safe-area and disable drag, or offer a docked mobile layout.
EVIDENCE: BattleUIPanel defaultPosition; no mobile dock branch. Older PRs own both files.
RECOMMENDED_ACTION: Design a docked mobile battle chrome. Do not auto-implement.
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
CURRENT_BEHAVIOUR: Spell slots have title= / aria-label; description still has no tap sheet. Touch has no hover.
DESIRED_BEHAVIOUR: Tap-to-inspect or a persistent detail sheet for spells and effects.
EVIDENCE: BattleUIPanel spellTitle; no long-press inspect. #335/#471 add names only.
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
RECOMMENDED_ACTION: Add pointer-type-aware long-press (≥500ms) and contextmenu inspect that does not cast. Restack WX after older combat PRs.
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
EVIDENCE: use-mobile.tsx; WX effectiveTileW = TILE_WIDTH * MOBILE_ZOOM when isMobile. #447 owns use-mobile.
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
FILES_OR_SYSTEMS: BattleUIPanel stone-battle-hp-bar; InitiativeStrip 7px names; MapModifiersPanel 8–9px copy; index.css --dofus-text-dim
CURRENT_BEHAVIOUR: Chip HP is a red bar with no numeric text. Initiative names are 7px. Map modifier descriptions are 8px at 50% alpha. Dim labels use ~0.45 lightness / #8a8090 on navy. DESIGN.md wants Body 12px / Label 11px and status as color + text.
DESIRED_BEHAVIOUR: HP number or percent on chips; raise dim text to a passing pair.
EVIDENCE: Chip bar has no text node; InitiativeStrip fontSize 7; MapModifiersPanel description fontSize 8.
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
DESIRED_BEHAVIOUR: Escape and optional backdrop dismiss, matching changelog/recap. Can use subscribeEscapeToDismiss from this run.
EVIDENCE: showZoneLockPopup dialog; no Escape listener in WorldExploration.
RECOMMENDED_ACTION: Add a window Escape listener when the popup is open. Avoid editing WorldExploration while older combat/map PRs are queued.
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
CURRENT_BEHAVIOUR: position fixed bottom 80px right 16px with no env(safe-area-inset-*). minHeight is already 44.
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
CURRENT_BEHAVIOUR: Overlay is a plain fixed div; only Cancel/Confirm close it. Cancel/Confirm already minHeight 44. Input is 16px.
DESIRED_BEHAVIOUR: Escape and backdrop click close without spending Doka. Reuse subscribeEscapeToDismiss.
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
EVIDENCE: Click deps ~10630; touch deps ~11211. Many older PRs own WorldExploration.
RECOMMENDED_ACTION: Align the touch array with the click array after those PRs.
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

---

ACTION_ID: MAA-2026-09-21-001
TITLE: Leaderboard overlay ignored Escape unless the overlay node was focused
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx
CURRENT_BEHAVIOUR: Still true on this HEAD. Open PR #335 already ships the window listener.
DESIRED_BEHAVIOUR: Window Escape closes the leaderboard.
EVIDENCE: GameFlow leaderboard; #335. #435 also owns GameFlow.
RECOMMENDED_ACTION: Leave to #335. Do not restack GameFlow.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After #335, Escape closes the leaderboard.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-001
TITLE: Settings mute control is below 44px
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/SettingsPanel.tsx
CURRENT_BEHAVIOUR: Mute used padding 5px 0 with no min-height and no stone-touch-target. Still true on this HEAD.
DESIRED_BEHAVIOUR: Mute measures ≥44px on viewports ≤768px.
EVIDENCE: SettingsPanel mute button. Open PR #425 already ships this.
RECOMMENDED_ACTION: Leave to #425. Do not restack SettingsPanel.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After #425, Mute / Unmute ≥44px at 390px width.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-002
TITLE: Spellbook, Boss Guide, and Enemy Register ignored Escape unless the overlay node was focused
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/shopDialogDismiss.ts; SpellbookModal.tsx; BossGuideModal.tsx; EnemyRegister.tsx
CURRENT_BEHAVIOUR: Overlay onKeyDown only on this HEAD.
DESIRED_BEHAVIOUR: Window keydown dismisses. Spellbook Escape cancels a pending swap first.
EVIDENCE: Those modals. Open PR #425 already ships subscribeEscapeToDismiss there.
RECOMMENDED_ACTION: Leave the modal wiring to #425.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After #425, Escape closes those three overlays.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-003
TITLE: Character-select Play and Create used stone-btn-crimson without the mobile 44px class
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterSelection.tsx
CURRENT_BEHAVIOUR: Play and Create use py-2.5 on stone-btn-crimson. Still true on this HEAD.
DESIRED_BEHAVIOUR: stone-touch-target on those CTAs.
EVIDENCE: CharacterSelection Play / EmptySlot Create. Open PRs #421 and #425 own this file.
RECOMMENDED_ACTION: Leave to #425. Do not restack CharacterSelection.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After #425, Play and Create ≥44px at 390px width.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-004
TITLE: stone-btn-crimson and stone-btn-slate are omitted from the mobile 44px rule
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/index.css
CURRENT_BEHAVIOUR: @media (max-width: 768px) lists stone-nav-btn, stone-touch-target, stone-battle-action, .stone-top-bar button, stone-modal-close. Primary/secondary stone buttons stay at padding 8px 18px (~34–40px).
DESIRED_BEHAVIOUR: Include stone-btn-crimson and stone-btn-slate in that list, or keep adding stone-touch-target at call sites.
EVIDENCE: index.css 683–697. Open PRs #339/#423/#469 already edit this file.
RECOMMENDED_ACTION: Union with #423 after it lands. Do not restack index.css in this run.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW — min-size only; may enlarge compact admin/chrome buttons.
VALIDATION_REQUIRED: After the CSS union, sample stone-btn-crimson CTAs at 390px are ≥44px.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-005
TITLE: Challenge offer panel is mouse-drag only
CATEGORY: touch-parity
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ChallengePanel.tsx
CURRENT_BEHAVIOUR: onMouseDown starts drag. No onTouchStart. Fold / Accept / Decline already have 44px or stone-touch-target. Touch players cannot reposition the panel.
DESIRED_BEHAVIOUR: Mirror DraggablePanel touch drag, without stealing map taps (PR #364).
EVIDENCE: ChallengePanel mouse-only drag. #364 and #372 own the file.
RECOMMENDED_ACTION: Leave until #364 lands, then add touch drag that ignores the Accept/Skip buttons.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — must not steal map taps.
VALIDATION_REQUIRED: Finger drag moves the offer; tap Accept still accepts.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-006
TITLE: Walk / Attack / Flee / Attack Nearest omit accessible names on this HEAD
CATEGORY: keyboard-focus
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Visible labels exist; Attack Nearest aria-label is still missing on this HEAD. Open PR #335 adds it.
DESIRED_BEHAVIOUR: Accessible names match the visible action, including Attack Nearest.
EVIDENCE: BattleUIPanel action buttons. #335/#379/#417/#432 own the file.
RECOMMENDED_ACTION: Leave to #335. Do not restack BattleUIPanel.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — names only.
VALIDATION_REQUIRED: After #335, Attack Nearest has an accessible name.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-24-007
TITLE: Summon End Turn is below 44px on phones
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/SummonControlPanel.tsx
CURRENT_BEHAVIOUR: End Turn uses py-2 + text-xs without stone-touch-target. Spell slots are already ≥44px (w-20 + 40px icon). The dock already uses safe-area padding.
EVIDENCE: SummonControlPanel End Turn className. #379/#417 own the file.
RECOMMENDED_ACTION: Add stone-touch-target after those combat PRs. Do not restack this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — mobile min size only.
VALIDATION_REQUIRED: At 390px width, End Turn measures ≥44px and still ends the summon turn once.
STATUS: NEW

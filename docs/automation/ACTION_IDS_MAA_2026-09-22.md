# ACTION_IDs — 2026-09-22 Mobile / Touch / Accessibility Auditor

Reuse prior IDs when the finding is the same. Implemented chrome from 2026-08-31
through 2026-09-21 still holds on this HEAD unless noted (Continue, 400ms
ghost-click, portal helper, canvas `touch-action: none`, mobile 44px utilities,
`100dvh` helper class, HUD safe-area tokens, 16px inputs, changelog/recap
`<dialog>` + Escape).

`DESIGN.md` was not edited.

Open PRs **#327** and **#331** still own `WorldExploration.tsx`. This run did
not edit that file. **#335** still owns GameFlow / BoostToggle / BattleUIPanel
Attack Nearest / StatusEffectBadge. **#339** owns leftover `.dungeon-grid` CSS.
**#364** owns ChallengePanel pointer-events. **#372** owns CharacterCreation
copy. This run unioned none of those files.

Combat mouse/touch still share `decideSpriteCastClick` / `decideTileCastClick`
and the 400ms ghost-click window. Sprite hit pad remains 10px mouse vs 14px
touch (report-only).

---

ACTION_ID: MAA-2026-09-22-001
TITLE: Settings mute control is below 44px
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/SettingsPanel.tsx
CURRENT_BEHAVIOUR: Mute used padding 5px 0 with no min-height and no stone-touch-target. Volume has an accessible name; mute did not meet DESIGN.md mobile 44px.
DESIRED_BEHAVIOUR: Mute measures ≥44px on viewports ≤768px via the existing stone-touch-target rule, with minHeight 44 always.
EVIDENCE: SettingsPanel mute button before this run.
RECOMMENDED_ACTION: Keep stone-touch-target + minHeight 44 shipped this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — full-width mute; layout only.
VALIDATION_REQUIRED: At 390px width, Mute / Unmute measures ≥44px and still toggles soundEngine.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-22-002
TITLE: Spellbook, Boss Guide, and Enemy Register ignored Escape unless the overlay node was focused
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/shopDialogDismiss.ts; src/frontend/src/components/SpellbookModal.tsx; src/frontend/src/components/BossGuideModal.tsx; src/frontend/src/components/EnemyRegister.tsx
CURRENT_BEHAVIOUR: Overlay onKeyDown only. These are not showModal() dialogs, so Escape did nothing while focus was on a button or input inside the panel.
DESIRED_BEHAVIOUR: Window keydown dismisses like changelog/recap. Spellbook Escape cancels a pending swap first.
EVIDENCE: Spellbook/BossGuide/EnemyRegister had overlay onKeyDown only; no window listener.
RECOMMENDED_ACTION: Keep subscribeEscapeToDismiss and the Spellbook nested-swap branch shipped this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — dismiss only; Spellbook Confirm All still required to save loadout.
VALIDATION_REQUIRED: Open Spellbook, press Escape (closes). Open swap confirm, Escape cancels swap only. Boss Guide and Enemies: Escape closes.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-22-003
TITLE: Character-select Play and Create used stone-btn-crimson without the mobile 44px class
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterSelection.tsx
CURRENT_BEHAVIOUR: Play and Create used py-2.5 on stone-btn-crimson. The 768px min-size rule does not include stone-btn-crimson, only stone-nav-btn / stone-touch-target / stone-battle-action / stone-top-bar button / stone-modal-close.
DESIRED_BEHAVIOUR: Those two CTAs get stone-touch-target so they measure ≥44px on phones. No visual redesign.
EVIDENCE: CharacterSelection Play and EmptySlot Create classNames before this run.
RECOMMENDED_ACTION: Keep the stone-touch-target classes. Broader stone-btn-* media-query is MAA-2026-09-22-004.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — mobile min size only.
VALIDATION_REQUIRED: At 390px width, Play and Create Character measure ≥44px.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-22-004
TITLE: stone-btn-crimson and stone-btn-slate are omitted from the mobile 44px rule
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/index.css
CURRENT_BEHAVIOUR: @media (max-width: 768px) lists stone-nav-btn, stone-touch-target, stone-battle-action, .stone-top-bar button, stone-modal-close. Primary/secondary stone buttons stay at padding 8px 18px (~34–40px).
DESIRED_BEHAVIOUR: Include stone-btn-crimson and stone-btn-slate in that list, or keep adding stone-touch-target at call sites.
EVIDENCE: index.css 683–697. Open PR #339 already edits this hunk (drops .dungeon-grid / .tool-button).
RECOMMENDED_ACTION: Union with #339 after it lands. Do not restack index.css in this run.
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
EVIDENCE: ChallengePanel onMouseDown; no touch listeners. #364 owns this file.
RECOMMENDED_ACTION: Restack after #364. Do not add touch drag in this audit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — can steal canvas clicks if pointer-events are wrong.
VALIDATION_REQUIRED: Drag on touch repositions; map taps beside the panel still walk/cast.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-006
TITLE: Walk / Attack / Flee / End Turn / Spellbook expose details only through title=
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Buttons have visible text plus title=. Attack still says “click a target”. #335 adds aria-label only on Attack Nearest and changes Attack title to “choose a target”.
DESIRED_BEHAVIOUR: aria-label matches title for Walk, Attack, Flee, End Turn, and Spellbook. Prefer “choose a target” over “click” for touch parity.
EVIDENCE: BattleUIPanel titles ~483–604. Do not edit BattleUIPanel while #335 is queued unless unioned.
RECOMMENDED_ACTION: Union #335’s Attack Nearest aria-label, then add the remaining aria-labels.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Accessibility tree includes flee penalty and end-turn reason.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-007
TITLE: Buy Doka overlay Escape only works if the overlay node is focused
CATEGORY: keyboard-modals
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/DokaGameKeyShop.tsx
CURRENT_BEHAVIOUR: Uses shouldDismissShopDialogOnKey on the overlay onKeyDown. Same focus hole as Spellbook before this run.
DESIRED_BEHAVIOUR: subscribeEscapeToDismiss while open.
EVIDENCE: DokaGameKeyShop onKeyDown. Shop persist PRs still open.
RECOMMENDED_ACTION: After shop PRs land, bind subscribeEscapeToDismiss. Do not restack this file now.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — dismiss only; does not redeem.
VALIDATION_REQUIRED: Open Buy Doka, focus an input, Escape closes without starting a purchase.
STATUS: NEW

---

ACTION_ID: MAA-2026-08-31-006
TITLE: Dual HUD crowding — realm tools and Stats overlay the canvas on phones
CATEGORY: hud-overlap
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: GameFlow no longer draws a second opaque top bar, but Items/Board/Feats/Bosses sit at calc(var(--app-top-hud-height) + 2px) over the map. Stats defaults unfolded. WX HUD still packs name, XP, Doka, region, Center, Enemies on one 44px row.
DESIRED_BEHAVIOUR: One phone chrome row; canvas inset matches live HUD; tools do not cover tiles.
EVIDENCE: GameFlow tools cluster; WX HUD flex row. Requires WorldExploration, owned by #327/#331.
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
DESIRED_BEHAVIOUR: On narrow viewports, pin spells/actions to the bottom safe-area and disable drag, or offer a docked mobile layout. DESIGN.md line 74.
EVIDENCE: BattleUIPanel defaultPosition; no mobile dock branch.
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
CURRENT_BEHAVIOUR: Spell slots have aria-label; description still has no tap sheet. Touch has no hover.
DESIRED_BEHAVIOUR: Tap-to-inspect or a persistent detail sheet for spells and effects.
EVIDENCE: BattleUIPanel spellTitle; StatusEffectBadge title= for description.
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
RECOMMENDED_ACTION: Add pointer-type-aware long-press (≥500ms) and contextmenu inspect that does not cast. Restack WX after #327/#331.
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
DESIRED_BEHAVIOUR: HP number or percent on chips; raise dim text to a passing pair. DESIGN.md lines 75–76.
EVIDENCE: Chip bar has no text node.
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
RECOMMENDED_ACTION: Add a window Escape listener when the popup is open. Avoid editing WorldExploration while #327/#331 are queued.
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

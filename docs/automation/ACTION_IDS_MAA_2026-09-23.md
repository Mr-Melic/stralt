# ACTION_IDs — 2026-09-23 Mobile / Touch / Accessibility Auditor

Reuse prior IDs when the finding is the same. Implemented chrome from 2026-08-31
through 2026-09-22 still holds on this HEAD unless noted (Continue, 400ms
ghost-click, portal helper, canvas `touch-action: none`, mobile 44px utilities,
`100dvh` helper class, HUD safe-area tokens, 16px inputs, changelog/recap
`<dialog>` + Escape).

`DESIGN.md` was not edited.

This run did **not** edit WorldExploration (many older PRs from #363), GameFlow
(#335/#435), BattleUIPanel (#335/#379/#417/#432), index.css (#339/#423),
ChallengePanel (#364/#372), CharacterSelection (#421/#425), Settings/Spellbook/Boss/Enemy
(#425), or DokaGameKeyShop (#372). BoostToggle and StatusEffectBadge match open
PR #335 so those hunks union. `subscribeEscapeToDismiss` is copied identically
from open PR #425 so the helper unions instead of forking.

Combat mouse/touch still share `decideSpriteCastClick` / `decideTileCastClick`
and the 400ms ghost-click window. Sprite hit pad remains 10px mouse vs 14px
touch (report-only). Touch `preventDefault` still runs first.

---

ACTION_ID: MAA-2026-09-23-001
TITLE: Feats overlay ignored Escape unless the overlay node was focused
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/AchievementsPanel.tsx; src/frontend/src/utils/shopDialogDismiss.ts
CURRENT_BEHAVIOUR: Overlay onKeyDown only. This is not a showModal() dialog, so Escape did nothing while focus was on Claim or Close.
DESIRED_BEHAVIOUR: Window keydown dismisses like changelog/recap, without claiming a reward.
EVIDENCE: AchievementsPanel overlay onKeyDown; no window listener on this HEAD.
RECOMMENDED_ACTION: Keep subscribeEscapeToDismiss while isOpen, shipped this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — dismiss only; Claim still requires the button.
VALIDATION_REQUIRED: Open Feats, press Escape with focus on Claim; panel closes and no Doka is granted.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-23-002
TITLE: Combatant StatPopup ignored Escape unless the popup node was focused
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/StatPopup.tsx; src/frontend/src/utils/shopDialogDismiss.ts
CURRENT_BEHAVIOUR: tabIndex=-1 plus overlay onKeyDown. Escape did nothing while focus was on Close or outside the popup.
DESIRED_BEHAVIOUR: Window Escape closes inspect without casting or walking.
EVIDENCE: StatPopup onKeyDown only; no window listener on this HEAD.
RECOMMENDED_ACTION: Keep subscribeEscapeToDismiss shipped this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — inspect dismiss only.
VALIDATION_REQUIRED: Open inspect, press Escape; popup closes; battle still legal.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-21-003
TITLE: Boost toggle controls are below 44px
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BoostToggle.tsx
CURRENT_BEHAVIOUR: Collapsed BOOST used padding 4px 10px. XP / Rewards pills used padding 4px 0. Hide × used padding 0. No stone-touch-target on this HEAD. Open PR #335 already adds the same classes.
DESIRED_BEHAVIOUR: Those controls measure ≥44px on viewports ≤768px via the existing stone-touch-target rule. No visual redesign on desktop.
EVIDENCE: BoostToggle open / close / tab buttons before this run; #335 BoostToggle.
RECOMMENDED_ACTION: Keep stone-touch-target + aria-pressed / aria-label identical to #335.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — mobile min size only; in-battle lock overlay unchanged.
VALIDATION_REQUIRED: At 390px width, BOOST, XP Boost, Rewards, and Hide measure ≥44px and still toggle.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-23-003
TITLE: Feats Claim buttons omitted the mobile 44px class
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/AchievementsPanel.tsx
CURRENT_BEHAVIOUR: Claim used stone-btn-crimson with padding 4px 10px. The 768px min-size rule does not include stone-btn-crimson.
DESIRED_BEHAVIOUR: Claim measures ≥44px on phones via stone-touch-target. No visual redesign.
EVIDENCE: AchievementsPanel claim className before this run.
RECOMMENDED_ACTION: Keep the stone-touch-target class. Broader stone-btn-* media-query remains MAA-2026-09-22-004.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — mobile min size only; persistClaim / in-flight set unchanged.
VALIDATION_REQUIRED: At 390px width, Claim measures ≥44px; double-tap still claims once.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-21-004
TITLE: Status-effect badge description was hover-only
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/StatusEffectBadge.tsx
CURRENT_BEHAVIOUR: Visible chip shows stat + turns; full description lived only in title=. Touch has no hover. Attack Nearest aria-label is still missing on BattleUIPanel on this HEAD (open PR #335 adds it).
DESIRED_BEHAVIOUR: Accessible name matches the title copy plus the visible stat label. A tap sheet for spells remains MAA-2026-08-31-008.
EVIDENCE: StatusEffectBadge title= without aria-label on this HEAD; #335 uses title={detail} and aria-label={`${label}. ${detail}`}.
RECOMMENDED_ACTION: Keep the #335 badge copy. Do not restack BattleUIPanel while #335/#379/#417/#432 are queued.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — name only.
VALIDATION_REQUIRED: Screen reader names the description and remaining turns; chip still shows color + text.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-23-004
TITLE: Initiative leader crown and summon lifespan were title-only
CATEGORY: hover-only
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/InitiativeStrip.tsx
CURRENT_BEHAVIOUR: Leader crown and summon lifespan chips used title= with no aria-label. Cards already have role=button for enemies.
DESIRED_BEHAVIOUR: Accessible names match the title copy. Compact 7px labels stay a contrast/readability report (MAA-2026-08-31-013).
EVIDENCE: InitiativeStrip title= on leader crown and lifespan chip.
RECOMMENDED_ACTION: Keep aria-label shipped this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — names only.
VALIDATION_REQUIRED: Screen reader announces Leader and remaining summon turns.
STATUS: IMPLEMENTED

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
EVIDENCE: Those modals. Open PR #425 already ships subscribeEscapeToDismiss there. This run copies the helper identically for Feats / StatPopup.
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
EVIDENCE: index.css 683–697. Open PR #423 already edits this file.
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
EVIDENCE: ChallengePanel onMouseDown; no touch listeners. #364 and #372 own this file.
RECOMMENDED_ACTION: Restack after #364. Do not add touch drag in this audit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — can steal canvas clicks if pointer-events are wrong.
VALIDATION_REQUIRED: Drag on touch repositions; map taps beside the panel still walk/cast.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-006
TITLE: Walk / Attack / Flee / End Turn / Spellbook / Attack Nearest expose details only through title=
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Visible text plus title=. Attack still says “click a target”. Attack Nearest has title but no aria-label. Spell slots already have aria-label.
DESIRED_BEHAVIOUR: aria-label matches title for Walk, Attack, Flee, End Turn, Spellbook, and Attack Nearest. Prefer “choose a target” over “click” for touch parity.
EVIDENCE: BattleUIPanel walk/attack/flee/end-turn/spellbook/attack-nearest buttons. Older PRs #379/#417/#432 own this file.
RECOMMENDED_ACTION: Union after those PRs. Do not restack BattleUIPanel in this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — names only; combat legality unchanged.
VALIDATION_REQUIRED: Screen reader names match title; Attack copy has no “click”.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-007
TITLE: Buy Doka overlay ignored Escape unless the overlay node was focused
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/DokaGameKeyShop.tsx
CURRENT_BEHAVIOUR: Overlay onKeyDown + backdrop click. Not showModal(), so Escape does nothing while focus is on email / GameKey fields. Close is already 44px.
DESIRED_BEHAVIOUR: Window Escape dismisses without starting a purchase or redeem.
EVIDENCE: DokaGameKeyShop onKeyDown only. Open PR #372 owns this file.
RECOMMENDED_ACTION: subscribeEscapeToDismiss after #372. Confirm / redeem remain the only spend paths.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — dismiss only.
VALIDATION_REQUIRED: Focus the GameKey field, press Escape; overlay closes; no redeem.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-23-005
TITLE: Item Shop overlay ignored Escape unless the overlay node was focused
CATEGORY: keyboard-modals
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BuffShop.tsx
CURRENT_BEHAVIOUR: Overlay onKeyDown Escape. Same focus gap as Feats / Buy Doka.
DESIRED_BEHAVIOUR: Window Escape dismisses. Use / buy remain button-only.
EVIDENCE: BuffShop onKeyDown. Open PRs #372 and #408 own this file.
RECOMMENDED_ACTION: subscribeEscapeToDismiss after those PRs.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Open Items, focus a Buy control, press Escape; shop closes with no spend.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-001
TITLE: Leaderboard overlay has no Escape dismiss
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx
CURRENT_BEHAVIOUR: Backdrop click closes. onKeyDown only handles Enter/Space when the overlay itself is focused. Close has stone-modal-close (44px on mobile).
DESIRED_BEHAVIOUR: Window Escape closes like Feats.
EVIDENCE: LeaderboardModal onKeyDown. Open PR #435 owns GameFlow.tsx.
RECOMMENDED_ACTION: subscribeEscapeToDismiss after #435. Do not restack GameFlow in this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Open Board, press Escape; overlay closes.
STATUS: NEW

---

ACTION_ID: MAA-2026-08-31-006
TITLE: Dual top HUD crowding on phones after Continue
CATEGORY: hud-overlap
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Live HUD is name, level, Map #, leftover XP, Doka, cart, region. GameFlow pins Items / Board / Feats / Bosses under calc(var(--app-top-hud-height) + 2px). Collision on mid-width tablets and 390px after Continue.
DESIRED_BEHAVIOUR: One chrome row on narrow viewports, or wrap the tool cluster below the live strip without covering the canvas spawn.
EVIDENCE: GameFlow tool cluster; WorldExploration 44px header. Both files owned by older open PRs.
RECOMMENDED_ACTION: Design a docked mobile header. Do not auto-implement.
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
EVIDENCE: BattleUIPanel defaultPosition; no mobile dock branch. Older PRs own both files (#379/#417/#432 and #429).
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
CURRENT_BEHAVIOUR: Spell slots have aria-label; description still has no tap sheet. Touch has no hover. This run added aria-label on status badges and initiative chips only.
DESIRED_BEHAVIOUR: Tap-to-inspect or a persistent detail sheet for spells and effects.
EVIDENCE: BattleUIPanel spellTitle; no long-press inspect.
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
FILES_OR_SYSTEMS: BattleUIPanel stone-battle-hp-bar; InitiativeStrip 7px names; index.css --dofus-text-dim
CURRENT_BEHAVIOUR: Chip HP is a red bar with no numeric text. Initiative names are 7px. Dim labels use ~0.45 lightness / #8a8090 on navy. DESIGN.md wants Body 12px / Label 11px and status as color + text.
DESIRED_BEHAVIOUR: HP number or percent on chips; raise dim text to a passing pair.
EVIDENCE: Chip bar has no text node; InitiativeStrip fontSize 7.
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

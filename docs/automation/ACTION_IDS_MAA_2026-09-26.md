# Mobile / touch / accessibility — 2026-09-26

Daily audit. `DESIGN.md` is unchanged. Combat mouse/touch still share
`decideSpriteCastClick` / `decideTileCastClick`, `applyBattleWalkHazards`,
and the 400ms ghost-click window (`preventDefault` first). Sprite hit pad
10 vs 14 is report-only.

This run did **not** edit WorldExploration, BattleUIPanel, GameFlow,
index.css, ChallengePanel, CharacterSelection, BuffShop, or DokaGameKeyShop
(older open PRs own those files). `subscribeEscapeToDismiss` is copied
identically from open PRs **#425 / #471 / #526** so the helper unions.

## This run (small chrome)

- Inspect card is a native `<dialog open>` that centers when sprite-hit
  inspect has no chip rect (was 0,0 under the HUD). Close is a 44px
  `stone-touch-target`. Window Escape matches #471. BattleUIPanel still
  gates the portal on a truthy `popupAnchor` (MAA-2026-09-26-004).
- `shouldIgnoreCanvasTouchEndUnlessSingleFinger` encodes the one-finger
  tap rule. Canvas wiring waits on the WorldExploration queue.

## Implemented

ACTION_ID: MAA-2026-09-26-001
TITLE: Sprite inspect placed the stats card at 0,0 when the chip rect was missing
CATEGORY: hud-overlap
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/inspectPopupPosition.ts; src/frontend/src/components/StatPopup.tsx
CURRENT_BEHAVIOUR: BattleUIPanel comments said a null anchor recenters. A missing chip rect left left=0 top=0, under the live HUD / notch.
DESIRED_BEHAVIOUR: Center in the viewport and clamp to edges, same as an off-screen chip.
EVIDENCE: StatPopup skipped clamping when !anchorRect. Sprite inspect often has no chip.
RECOMMENDED_ACTION: Keep clampInspectPopupPosition shipped this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — placement only; inspect still does not cast.
VALIDATION_REQUIRED: inspectPopupPosition.test.ts; tap a hostile body with no visible chip; card is on-screen.
STATUS: IMPLEMENTED_THIS_RUN

---

ACTION_ID: MAA-2026-09-26-002
TITLE: Inspect close control was a 28px target
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/StatPopup.tsx
CURRENT_BEHAVIOUR: Inline 28×28 overrode DESIGN.md 44px on landscape phones wider than 768px.
DESIRED_BEHAVIOUR: Close measures ≥44px via stone-touch-target / min 44.
EVIDENCE: StatPopup close style width/height 28 before this run.
RECOMMENDED_ACTION: Keep min 44 + stone-touch-target shipped this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: At 390px and 844px-wide landscape, Close ≥44px; tap still dismisses.
STATUS: IMPLEMENTED_THIS_RUN

---

ACTION_ID: MAA-2026-09-23-002
TITLE: Combatant StatPopup ignored Escape unless the popup node was focused
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/StatPopup.tsx; src/frontend/src/utils/shopDialogDismiss.ts
CURRENT_BEHAVIOUR: tabIndex=-1 plus overlay onKeyDown. Escape did nothing while focus was on Close or outside the popup.
DESIRED_BEHAVIOUR: Window Escape closes inspect without casting or walking.
EVIDENCE: StatPopup onKeyDown only on this HEAD; open PR #471 already ships subscribeEscapeToDismiss.
RECOMMENDED_ACTION: Keep the identical helper + StatPopup effect (union with #471).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — inspect dismiss only.
VALIDATION_REQUIRED: Open inspect, press Escape; popup closes; battle still legal.
STATUS: IMPLEMENTED_THIS_RUN

---

ACTION_ID: MAA-2026-09-26-003
TITLE: Two-finger canvas touchend can walk or cast as a tap
CATEGORY: combat-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/pointerParity.ts; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: handleCanvasTouch uses changedTouches[0] with no single-finger gate. A pinch lift or second finger can walk/cast. Mouse has no equivalent.
DESIRED_BEHAVIOUR: Ignore touchend unless it is a one-finger tap (changedTouches.length === 1 and no fingers remain).
EVIDENCE: handleCanvasTouch reads changedTouches[0] only (~10728). Helper shipped; WX call site waits on older combat/map PRs.
RECOMMENDED_ACTION: Wire shouldIgnoreCanvasTouchEndUnlessSingleFinger at the top of handleCanvasTouch after those PRs. Do not restack WorldExploration in this run.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — must not drop legal one-finger taps.
VALIDATION_REQUIRED: One-finger tap still walks/casts once; two fingers down then one lifts does not move.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-26-004
TITLE: BattleUIPanel hides inspect unless a chip rect exists
CATEGORY: hud-overlap
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Sprite inspect sets selectedCombatantId and popupAnchor = chip rect or null. The portal is `selectedCombatant && popupAnchor`. A missing chip ref never mounts StatPopup, so the centering contract in StatPopup cannot run. Comments already say null anchors should center.
DESIRED_BEHAVIOUR: Render StatPopup whenever a combatant is selected; pass a null anchor so clampInspectPopupPosition centers.
EVIDENCE: BattleUIPanel ~164–173 and ~923–924. This run does not edit BattleUIPanel (older combat PRs).
RECOMMENDED_ACTION: Drop the popupAnchor truthiness gate after those PRs. Keep StatPopup centering from this run.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW — inspect display only; does not cast.
VALIDATION_REQUIRED: Inspect a unit with no visible chip; card appears centered; Escape still closes.
STATUS: NEW

## Still HUMAN_APPROVAL / REPORT_ONLY (stable IDs)

ACTION_ID: MAA-2026-08-31-006
TITLE: Dual HUD crowding — realm tools overlay the canvas on phones
CATEGORY: hud-overlap
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: GameFlow no longer draws a second opaque top bar. Items/Board/Feats/Bosses sit at calc(var(--app-top-hud-height) + 2px) over the map. WX HUD still packs name, XP, Doka, region, Center, Enemies on one 44px row that does not wrap.
DESIRED_BEHAVIOUR: One phone chrome row; canvas inset matches live HUD; tools do not cover tiles.
EVIDENCE: GameFlow tools cluster z-9001; WX header flex row at --app-top-hud-height.
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
DESIRED_BEHAVIOUR: On narrow viewports, pin spells/actions to the bottom safe-area and disable drag.
EVIDENCE: DESIGN.md line 74; BattleUIPanel defaultPosition; no mobile dock branch.
RECOMMENDED_ACTION: Design a docked mobile battle chrome. Do not auto-redesign.
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
FILES_OR_SYSTEMS: BattleUIPanel.tsx; SpellbookModal.tsx; StatusEffectBadge.tsx
CURRENT_BEHAVIOUR: Spell slots still rely on title= / native hover. Touch has no hover. Status badges gained aria-label in #471.
DESIRED_BEHAVIOUR: Tap-to-inspect or a persistent detail sheet that works with touch and keyboard.
EVIDENCE: BattleUIPanel spellTitle title=; DESIGN.md does not ask for a restyle.
RECOMMENDED_ACTION: Reuse StatPopup / inspect for spells on tap. Wait for BattleUIPanel PRs.
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
CURRENT_BEHAVIOUR: Comments say chip inspect is suppressed when a spell is selected and forced inspect is right-click / long-press. No contextmenu or long-press handler exists. Sprite tap inspect still works when the live gate rejects a cast.
DESIRED_BEHAVIOUR: Implement the documented path, or update the comments and provide another inspect path while a spell is selected.
EVIDENCE: WorldExploration has no onContextMenu / long-press.
RECOMMENDED_ACTION: Add pointer-type-aware long-press (≥500ms) and contextmenu inspect that does not cast. Wait for WorldExploration queue.
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
CURRENT_BEHAVIOUR: hitTestSprite uses 10px on click and 14px on touch. After a target is chosen, both paths call decideSpriteCastClick / decideTileCastClick. The chosen entity can still differ at the same client point.
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
CURRENT_BEHAVIOUR: isMobile is innerWidth < 768. A phone in landscape often becomes desktop tiles. 44px CSS also keys off max-width 768, so landscape phones miss both zoom and touch-target floors.
DESIRED_BEHAVIOUR: Treat coarse pointers / hover:none as mobile for zoom, or use a min(width,height) breakpoint.
EVIDENCE: use-mobile.tsx; WX effectiveTileW = TILE_WIDTH * MOBILE_ZOOM when isMobile.
RECOMMENDED_ACTION: Human-approved input-mode heuristic. Do not change tile math in this audit. use-mobile.tsx is owned by #447.
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
CURRENT_BEHAVIOUR: Chip HP is a red bar with no numeric text. Dim labels use ~0.45 lightness / #8a8090 on navy. DESIGN.md requires color + text and 4.5:1 gold-on-navy. Spell names in slots are 6px.
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
TITLE: Zone-lock dialog does not dismiss on window Escape
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Native `<dialog open>` without showModal(); Close is a button; no window Escape listener.
DESIRED_BEHAVIOUR: Escape closes zone-lock without toggling the lock.
EVIDENCE: showZoneLockPopup dialog around WX 17626.
RECOMMENDED_ACTION: Wait for the WorldExploration queue.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW once landed; HIGH to restack WorldExploration now.
VALIDATION_REQUIRED: Open zone-lock, press Escape; lock state unchanged.
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
RECOMMENDED_ACTION: Wait for WorldExploration.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: iPhone home-indicator overlap; landscape notch.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-007
TITLE: Champion rename pencil is a 10px target
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Pencil is 10×10 with padding 2. title=Rename (100 Doka) is hover-only.
DESIRED_BEHAVIOUR: ≥44px on phones; accessible name on the control.
EVIDENCE: stats.rename_button around WX 18147.
RECOMMENDED_ACTION: Wait for WorldExploration. Do not enlarge the whole stats card.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: At 390px width the rename control measures ≥44px; tap opens rename, does not drag the panel.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-008
TITLE: Rename modal ignores window Escape
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Focus is in the 16px name field; Escape does not cancel.
DESIRED_BEHAVIOUR: Escape cancels without spending 100 Doka.
EVIDENCE: showRenameModal around WX 19080.
RECOMMENDED_ACTION: Wait for WorldExploration.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW — must not submit on Escape.
VALIDATION_REQUIRED: Open rename, press Escape; name and Doka unchanged.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-009
TITLE: Canvas touch handler omits click-path React deps
CATEGORY: combat-parity
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: handleCanvasTouch biome-ignores exhaustive deps. A stale closure can diverge from handleCanvasClick after a spell-select render.
DESIRED_BEHAVIOUR: Touch and mouse handlers close over the same live values, or both read only refs.
EVIDENCE: handleCanvasTouch useCallback ignore comment ~10704.
RECOMMENDED_ACTION: Report until WorldExploration PRs land; do not widen the RAF/touch surface here.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH if deps are added blindly (extra recreates).
VALIDATION_REQUIRED: Select a spell, tap a legal tile; mouse click of the same tile matches.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-010
TITLE: Battle canvas is focusable with no keydown handler
CATEGORY: keyboard-focus
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Canvas tabIndex={0} and onKeyDown={undefined}. Keyboard users can land focus with no operable keys; Attack Nearest still uses a global S hotkey.
DESIRED_BEHAVIOUR: Either wire keys that match mouse legality, or stop including the canvas in the tab order.
EVIDENCE: canvas onKeyDown={undefined} tabIndex={0} ~17880.
RECOMMENDED_ACTION: Wait for WorldExploration. Do not invent a second combat input map.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Tab from HUD to canvas; no silent focus trap; S still attacks nearest when legal.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-004
TITLE: 44px touch floor is width-only, not coarse-pointer
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/index.css
CURRENT_BEHAVIOUR: @media (max-width: 768px) lists stone-nav-btn, stone-touch-target, stone-battle-action, .stone-top-bar button, stone-modal-close. Landscape phones wider than 768 keep 36px nav and 16px-less inputs. stone-btn-crimson is omitted.
DESIRED_BEHAVIOUR: Also apply the floor under (pointer: coarse) / (hover: none), or keep adding stone-touch-target at call sites. Do not enlarge desktop chrome.
EVIDENCE: index.css 683–711. Open CSS PRs #339/#423/#469/#516/#567.
RECOMMENDED_ACTION: Union with CSS PRs after they land. Do not restack index.css in this run.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW — min-size only.
VALIDATION_REQUIRED: iPhone landscape 844px-wide; Walk/nav ≥44px; desktop 1280px stays compact.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-005
TITLE: Challenge panel drag is mouse-only
CATEGORY: touch-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ChallengePanel.tsx
CURRENT_BEHAVIOUR: onMouseDown starts drag; no touch listeners. Owned by #364/#372.
DESIRED_BEHAVIOUR: Pointer events (or touch + mouse) move the panel without stealing Accept/Decline.
EVIDENCE: ChallengePanel onMouseDown ~111.
RECOMMENDED_ACTION: Wait for #364. Do not restack copy hunks.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — must not double-fire Accept.
VALIDATION_REQUIRED: Finger drag repositions; tap Accept still accepts once.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-25-002
TITLE: Chat channel tabs stay below 44px
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx
CURRENT_BEHAVIOUR: Channel tabs use py-1 px-2 text-[9px]. Send already has stone-touch-target with inline 32×32. ChatPanel is owned by perf PRs.
DESIRED_BEHAVIOUR: Tabs measure ≥44px on phones without changing debug RAF gating.
EVIDENCE: ChatPanel channel tab className ~1185.
RECOMMENDED_ACTION: Wait for #392/#447; add stone-touch-target as a union.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: At 390px width channel tabs ≥44px; switching channels still does not recast.
STATUS: NEW

# ACTION_IDs — 2026-10-24 Mobile / Touch / Accessibility Auditor

Reuse prior IDs when the finding is the same. `DESIGN.md` was not edited.

Combat on `origin/main` still shares live gates (`decideSpriteCastClick` /
`decideTileCastClick`), stamps both ghost-click refs at the start of
`handleCanvasTouch`, calls `preventDefault` first, and uses a **400ms**
synthetic-click window (`pointerParity.ts` `SYNTHETIC_CLICK_GUARD_MS` ===
`pointerGesture.ts` `SYNTHETIC_CLICK_SUPPRESS_MS`). Mouse sprite pad is 10px;
touch sprite pad is 14px (MAA-010 — do not unify). Walk, AP, portal, and
execute helpers are the same on both pointer paths. This run did **not**
change execute math, RAF, or WorldExploration.

Did **not** edit WorldExploration, GameFlow, BattleUIPanel, index.css,
ChallengePanel, CharacterSelection, CharacterCreation, Settings, Spellbook,
ChatPanel, BuffShop, DokaGameKeyShop, App.tsx, PostBattleRecap, LandingPage,
StarfieldBackground, ProfileSetup, GameOverModal, DraggablePanel, dialog,
sheet, alert-dialog, button, carousel, pagination, input, select, tabs,
input-otp, shopDialogDismiss, pointerParity, StatPopup, SummonControlPanel,
or index.html. Those stay with older still-open PRs (WX from #327, #335
GameFlow/BattleUI, #372/#364 ChallengePanel/CharacterCreation/ProfileSetup,
#421 GameOverModal, #425/#471/#526 overlays, #429 DraggablePanel, #511/#740
starfield/landing/dialog max-width, #645 inspect/pointerParity helper, #693
recap, #795 document chrome, #822 Dialog/Sheet Close, #853 AlertDialog
Action/Cancel, #895 Button/carousel/pagination 44px, #935 Input/Select/Tabs/
OTP 44px).

`ui/toggle.tsx`, `ui/accordion.tsx`, `ui/command.tsx`,
`ui/navigation-menu.tsx`, and `ui/menubar.tsx` had no older owner. They are
unused in live player chrome today. Size `sm` Toggle, Checkbox, Switch,
Radio, Slider glyphs, Sidebar, and dense menu/calendar rows stay compact
(MAA-2026-10-22-004 / MAA-2026-10-23-006..008).

---

## Implemented this run (display / a11y / contract tests only)

ACTION_ID: MAA-2026-10-24-001
TITLE: shadcn Toggle default and lg sit below the 44px floor
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/toggle.tsx; src/frontend/src/utils/chromeTouchTarget.contracts.test.ts
CURRENT_BEHAVIOUR: Toggle default was `h-9 min-w-9` (36px). Size `lg` was `h-10` (40px). Size `sm` stays `h-8`. Unused in player chrome today; ToggleGroup inherits `toggleVariants`.
DESIRED_BEHAVIOUR: DESIGN.md mobile targets ≥44px. Default and lg carry `min-h/min-w 44px`. Size `sm` stays compact. `className` merges outside cva the same way #895 Button does.
EVIDENCE: toggle.tsx size default `h-9 px-2 min-w-9` before this run.
RECOMMENDED_ACTION: Keep the additive min-size classes. Do not enlarge Checkbox/Switch glyphs (still MAA-2026-10-22-004).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — unused in live HUD. Dense `sm` still 32px by design.
VALIDATION_REQUIRED: node --test src/frontend/src/utils/chromeTouchTarget.contracts.test.ts; no canvas/RAF change.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-10-24-002
TITLE: shadcn AccordionTrigger has no 44px floor
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/accordion.tsx; src/frontend/src/utils/chromeTouchTarget.contracts.test.ts
CURRENT_BEHAVIOUR: AccordionTrigger used `py-4` with no min size. Unused in player chrome today. Typical text already clears 44px; empty/short labels would not.
DESIRED_BEHAVIOUR: `min-h/min-w 44px` on the trigger. No accordion redesign.
EVIDENCE: accordion.tsx AccordionTrigger className before this run had `py-4` and no min-h.
RECOMMENDED_ACTION: Keep the additive min-size classes.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — unused in live HUD.
VALIDATION_REQUIRED: node --test chromeTouchTarget.contracts.test.ts.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-10-24-003
TITLE: shadcn CommandInput wrapper sits below 44px
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/command.tsx; src/frontend/src/utils/chromeTouchTarget.contracts.test.ts
CURRENT_BEHAVIOUR: Command input wrapper was `h-9` (36px). Unused in player chrome today. CommandItem rows stay `py-1.5` (MAA-2026-10-23-007).
DESIRED_BEHAVIOUR: Wrapper `min-h-[44px]`. Do not enlarge command list rows from this audit.
EVIDENCE: command.tsx CommandInput wrapper `flex h-9` before this run.
RECOMMENDED_ACTION: Keep the additive min-height. Leave CommandItem compact.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — unused in live HUD.
VALIDATION_REQUIRED: node --test chromeTouchTarget.contracts.test.ts.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-10-24-004
TITLE: shadcn NavigationMenu trigger sits below 44px
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/navigation-menu.tsx; src/frontend/src/utils/chromeTouchTarget.contracts.test.ts
CURRENT_BEHAVIOUR: `navigationMenuTriggerStyle` was `h-9`. Unused in player chrome today. Dropdown links stay compact (MAA-2026-10-23-007).
DESIRED_BEHAVIOUR: Trigger `min-h/min-w 44px`. Do not enlarge nav dropdown rows from this audit.
EVIDENCE: navigation-menu.tsx `h-9 w-max` before this run.
RECOMMENDED_ACTION: Keep the additive min-size on the trigger only.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — unused in live HUD.
VALIDATION_REQUIRED: node --test chromeTouchTarget.contracts.test.ts.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-10-24-005
TITLE: shadcn Menubar bar and triggers sit below 44px
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/menubar.tsx; src/frontend/src/utils/chromeTouchTarget.contracts.test.ts
CURRENT_BEHAVIOUR: Menubar was `h-9`; triggers used `py-1` with no min size. Unused in player chrome today. Menu items stay `py-1.5` (MAA-2026-10-23-007).
DESIRED_BEHAVIOUR: Bar `min-h-[44px]`; triggers `min-h/min-w 44px`. Do not enlarge menu rows from this audit.
EVIDENCE: menubar.tsx Menubar `h-9`; MenubarTrigger `px-2 py-1` before this run.
RECOMMENDED_ACTION: Keep the additive min-size on the bar and triggers.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — unused in live HUD. Dense items still compact.
VALIDATION_REQUIRED: node --test chromeTouchTarget.contracts.test.ts.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-10-24-006
TITLE: Lock walk, AP, portal, and execute helper parity on mouse and touch
CATEGORY: touch-mouse-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/canvasWalkCastPointerParity.contracts.test.ts; WorldExploration.tsx (read-only)
CURRENT_BEHAVIOUR: Click and touch already share player-cast entry, live sprite/tile decide, AP reject, walk occupancy/block/reject, hazard debit, portal block, and executeCastAttempt. #795 locks decide tables and the 400ms window; #935 locks summon-control helpers.
DESIRED_BEHAVIOUR: Mouse and touch keep calling the same walk/cast/portal helpers so a later WX edit cannot fork legality.
EVIDENCE: handleCanvasClick ~10009–10700 and handleCanvasTouch ~10705–11230 each call the listed helpers.
RECOMMENDED_ACTION: Keep the source contract. Do not copy `shouldIgnoreCanvasTouchEndUnlessSingleFinger` (#645). Do not unify 10 vs 14 sprite pad (MAA-010).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — test-only; no execute change.
VALIDATION_REQUIRED: node --test canvasWalkCastPointerParity.contracts.test.ts.
STATUS: IMPLEMENTED

---

## Queued in older still-open PRs (do not restack)

Button default/lg/icon + carousel + pagination 44px: **#895** (MAA-2026-10-22-001..003).
Input / Select default / Tabs / OTP 44px: **#935** (MAA-2026-10-23-001..004) plus summon-control contract (MAA-2026-10-23-005).
Dialog/Sheet Close 44px: **#822** (MAA-2026-09-29-003, MAA-2026-10-21-001).
AlertDialog Action/Cancel 44px: **#853**.
Landing 44px Sign In / named logo / dialog safe-area: **#740** (MAA-2026-09-28-001..004).
Document chrome theme-color / pointer contracts: **#795** (MAA-2026-09-29-001..002).
Recap safe-area / Escape-only dismiss: **#693**.
Inspect center + 44px close + single-finger helper: **#645**.
Summon End Turn 44px: **#592**.
Shop Escape / Items+Forge 44px: **#526**.
Feats Escape / 44px boost+claim: **#471** / **#335**.
Mute / Spellbook / Boss / Enemy / Play+Create 44px: **#425**.
Leaderboard Escape: **#335**.
Character-creation view/rotate/color 44px: **#526** (also MAA-2026-10-21-002; wait for #372).
ProfileSetup copy: **#372**.
GameOverModal copy: **#421**.
DraggablePanel layout fetch: **#429**.

---

## Remaining (human-approval / report-only / wait for owners)

ACTION_ID: MAA-006
TITLE: Dual HUD crowding — realm tools and Stats overlay the canvas on phones
CATEGORY: hud-overlap
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx tools; WorldExploration Stats DraggablePanel
CURRENT_BEHAVIOUR: Tools stay at calc(var(--app-top-hud-height) + 2px) ~297. Stats defaults unfolded. Short portrait phones stack both over the board.
DESIRED_BEHAVIOUR: One HUD row or a fold that keeps 44px targets without covering spawn.
EVIDENCE: GameFlow.tsx tools cluster ~288–322; Stats defaultFolded false. DESIGN.md Header / Side Panel.
RECOMMENDED_ACTION: Human-approved responsive layout. Do not auto-reflow from this audit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — layout.
VALIDATION_REQUIRED: 390×844 and 844×390; Play, fight, shop, recap.
STATUS: NEW

---

ACTION_ID: MAA-007
TITLE: Battle footer is a saved DraggablePanel, not a sticky viewport dock
CATEGORY: sticky-battle-controls
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx; DraggablePanel.tsx
CURRENT_BEHAVIOUR: Default y is innerHeight-220 and persists in uiLayout. DESIGN.md says the bottom menu sticks to the viewport. SummonControlPanel is already a bottom-safe dock. Walk/Attack/Flee/End Turn use stone-battle-action (CSS 44px only under max-width 768).
DESIRED_BEHAVIOUR: On coarse pointers, pin Walk/Attack/spells/End Turn above the home indicator.
EVIDENCE: BattleUIPanel.tsx defaultPosition ~197–200. Open PR #429 owns DraggablePanel.
RECOMMENDED_ACTION: Human-approved dock. Do not change AP/MP execute.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: Portrait fight: End Turn tappable; landscape still usable.
STATUS: NEW

---

ACTION_ID: MAA-008
TITLE: Spell and status details are hover-only title tooltips
CATEGORY: hover-only
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel title=; StatusEffectBadge title=
CURRENT_BEHAVIOUR: Native title tooltips. Touch has no hover sheet. Attack title still says “click a target in range” on this HEAD. shadcn Tooltip/HoverCard are also hover-only and unused in player chrome.
DESIRED_BEHAVIOUR: Tap-to-inspect sheet that reuses the same copy; long-press optional (MAA-009). Prefer “choose” over “click”.
EVIDENCE: BattleUIPanel.tsx Attack title ~502–506; spellTitle ~626–638; StatusEffectBadge title= ~44. Spell slots already have matching aria-label.
RECOMMENDED_ACTION: Human-approved tap sheet. Wait for BattleUIPanel owners (#335+).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Touch player reads AP cost and cooldown without a mouse.
STATUS: NEW

---

ACTION_ID: MAA-009
TITLE: Forced inspect via long-press / right-click is documented but missing
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration canvas handlers
CURRENT_BEHAVIOUR: Inspect is tap-with-no-legal-cast or BattleUIPanel chip. No contextmenu / long-press. Canvas has no onContextMenu.
DESIRED_BEHAVIOUR: Explicit inspect gesture that cannot execute a cast.
EVIDENCE: handleCanvasClick / handleCanvasTouch inspect branches; canvas ~17875–17895.
RECOMMENDED_ACTION: Human-approved. Must use decideSpriteCastClick so inspect cannot spend AP.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH if it bypasses live gates.
VALIDATION_REQUIRED: Long-press inspect never casts; mouse right-click same.
STATUS: NEW

---

ACTION_ID: MAA-010
TITLE: Sprite hit padding is 10px mouse vs 14px touch
CATEGORY: touch-mouse-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx
CURRENT_BEHAVIOUR: hitTestSprite(..., 10) on click (~10127); (..., 14) on touch (~10819). After a target is chosen, decideSpriteCastClick is shared, but the chosen entity can differ at the same client point.
DESIRED_BEHAVIOUR: Same padding, or a documented finger-slop policy that still prefers the front-most legal target.
EVIDENCE: handleCanvasClick hitTestSprite(..., 10); handleCanvasTouch hitTestSprite(..., 14).
RECOMMENDED_ACTION: Report-only until a targeting owner picks one padding. Do not unify from this audit.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if unified blindly.
VALIDATION_REQUIRED: Overlapping sprites at the same client point resolve to the same combatant.
STATUS: NEW

---

ACTION_ID: MAA-011
TITLE: useIsMobile is width-only so landscape phones lose MOBILE_ZOOM
CATEGORY: viewport-scaling
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/hooks/use-mobile.tsx; WorldExploration MOBILE_ZOOM 1.75
CURRENT_BEHAVIOUR: isMobile is innerWidth < 768. A phone in landscape often becomes desktop tiles. The 44px CSS floor is the same width-only media query. SmallScreenGuard uses the same 768 width gate.
DESIRED_BEHAVIOUR: Treat coarse pointers / hover:none as mobile for zoom, or use a min(width,height) breakpoint.
EVIDENCE: use-mobile.tsx ~17–25; WX effectiveTileW = TILE_WIDTH * MOBILE_ZOOM when isMobile. #447 owns use-mobile.
RECOMMENDED_ACTION: Human-approved input-mode heuristic. Do not change tile math in this audit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — camera / tile size.
VALIDATION_REQUIRED: Same phone portrait and landscape keep readable tiles.
STATUS: NEW

---

ACTION_ID: MAA-012
TITLE: Hover tile / enemy preview has no touch equivalent
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: WorldExploration handleCanvasMouseMove
CURRENT_BEHAVIOUR: hoveredTile and hoveredEnemyId update only on mousemove. Canvas has onMouseMove / onMouseLeave and no touchmove hover path.
DESIRED_BEHAVIOUR: Touch-and-hold preview, or rely solely on range highlights (already computed).
EVIDENCE: canvas onMouseMove={handleCanvasMouseMove} ~17878; no onTouchMove.
RECOMMENDED_ACTION: Report-only; range highlights already cover legality.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Touch players can see legal tiles without hover.
STATUS: NEW

---

ACTION_ID: MAA-013
TITLE: Initiative HP is color-only; muted gold/dim text may miss 4.5:1
CATEGORY: contrast-status
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: BattleUIPanel stone-battle-hp-bar; InitiativeStrip 7px names; index.css --dofus-text-dim
CURRENT_BEHAVIOUR: Chip HP is a red bar with no numeric text. Initiative names are 7px. Dim labels use ~0.45 lightness. DESIGN.md wants Body 12px / Label 11px and status as color + text. StatusEffectBadge already shows text + turns + color.
DESIRED_BEHAVIOUR: HP number or percent on chips; raise dim text to a passing pair.
EVIDENCE: BattleUIPanel.tsx stone-battle-hp-bar ~343–346; InitiativeStrip fontSize 7. DESIGN.md lines 75–76.
RECOMMENDED_ACTION: Add compact HP text; audit OKLCH pairs. Not a redesign of the bar. Do not edit DESIGN.md.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Contrast checker + screen reader name includes HP.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-001
TITLE: Leaderboard overlay has no Escape dismiss
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx
CURRENT_BEHAVIOUR: Backdrop click closes. onKeyDown only handles Enter/Space when the overlay itself is focused. Close button is 30×30 (stone-modal-close gets 44px only under max-width 768).
DESIRED_BEHAVIOUR: Window Escape closes like Feats. Do not extract Leaderboard (modify/delete conflict with #335).
EVIDENCE: LeaderboardModal onKeyDown ~499–505; close 30×30 ~532–538. Open PR #335.
RECOMMENDED_ACTION: Wait for #335.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Open Board, press Escape; overlay closes.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-005
TITLE: Zone Lock dialog is a non-modal open dialog without Escape
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Zone Lock `<dialog open>` has Close but no keydown. Native Escape only applies to showModal().
DESIRED_BEHAVIOUR: subscribeEscapeToDismiss (copy identically from #425/#471). Avoid editing WorldExploration while older PRs own it.
EVIDENCE: showZoneLockPopup dialog ~17626; no Escape listener.
RECOMMENDED_ACTION: Wait for WX owner.
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
DESIRED_BEHAVIOUR: bottom: calc(80px + env(safe-area-inset-bottom)); right: max(16px, env(safe-area-inset-right)).
EVIDENCE: Zone Tier button styles at WorldExploration ~17604–17620.
RECOMMENDED_ACTION: Wait for WX owner.
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
EVIDENCE: stats.rename_button ~18147–18167.
RECOMMENDED_ACTION: Add stone-touch-target + aria-label after WX owners land.
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
VALIDATION_REQUIRED: Escape and backdrop close; Confirm still charges 100 Doka only on success.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-009
TITLE: Touch canvas handler omits activeSpells and hit-test deps the mouse handler lists
CATEGORY: touch-mouse-parity
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: WorldExploration.tsx handleCanvasTouch
CURRENT_BEHAVIOUR: Click deps include activeSpells, logBattleEntry, combatantStoreCtx, hitTestSprite, tileCenter (~10630–10652). Touch omits those five (~11211–11228) even though the biome-ignore comment lists some of them.
DESIRED_BEHAVIOUR: Same dep list or shared handler so a stale closure cannot fork legality.
EVIDENCE: handleCanvasClick vs handleCanvasTouch dependency arrays.
RECOMMENDED_ACTION: Human-approved after WX stack thins. Do not expand deps blindly (rebind storms).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Change spells mid-battle; mouse and touch still share decide* results.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-010
TITLE: World canvas is tab-focusable with onKeyDown undefined
CATEGORY: keyboard-focus
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx canvas
CURRENT_BEHAVIOUR: tabIndex={0} aria-label set; onKeyDown={undefined}. Focus ring is outline none.
DESIRED_BEHAVIOUR: Either drop tabIndex or wire arrow/hotkey handling that cannot bypass live gates.
EVIDENCE: canvas tabIndex={0} onKeyDown={undefined} ~17875–17895.
RECOMMENDED_ACTION: Report-only while WX is owned. Do not add a no-op keydown just to silence a11y lints.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if keys walk without MP gates.
VALIDATION_REQUIRED: Tab to canvas; keyboard does not move or cast illegally.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-004
TITLE: stone-btn-crimson and stone-btn-slate are omitted from the mobile 44px rule
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/index.css
CURRENT_BEHAVIOUR: ≤768px min 44px applies to stone-nav-btn, stone-touch-target, stone-battle-action, stone-top-bar button, stone-modal-close — not stone-btn-crimson/slate. The same query is width-only, so landscape phones wider than 768 miss the floor.
DESIRED_BEHAVIOUR: Include stone-btn-crimson and stone-btn-slate, and/or also apply under (pointer: coarse). Prefer the class list once CSS owners land.
EVIDENCE: index.css @media (max-width: 768px) block ~683–711. Open leftover-CSS PRs from #339.
RECOMMENDED_ACTION: Human-approved CSS union. Do not restack index.css here.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — many buttons grow on phones.
VALIDATION_REQUIRED: Inventory of stone-btn-* at 390px and iPhone landscape; none below 44px that players tap.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-005
TITLE: Challenge offer panel is mouse-drag only
CATEGORY: touch-mouse-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: ChallengePanel.tsx
CURRENT_BEHAVIOUR: Header uses onMouseDown. No touch listeners. Accept/Decline already minHeight 44. #364/#372 own the file. DraggablePanel itself already has onTouchStart.
DESIRED_BEHAVIOUR: Touch drag mirrors mouse clamp; buttons still win over drag (closest("button")).
EVIDENCE: ChallengePanel onMouseDown ~111; no onTouchStart.
RECOMMENDED_ACTION: Wait for #364/#372. Do not steal map clicks.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — can cover the board.
VALIDATION_REQUIRED: Drag with a finger; Accept still works; canvas taps under the panel do not fire.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-006
TITLE: Attack mode title still says “click a target” on this HEAD
CATEGORY: hover-only
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Walk/Attack/Flee/End Turn expose details through title= only. Attack copy is “click a target in range”. #335 changes that to “choose a target” and adds Attack Nearest aria-label.
DESIRED_BEHAVIOUR: aria-label matches title; prefer “choose” over “click” so touch and mouse share the same instruction.
EVIDENCE: BattleUIPanel.tsx Attack title ~502–506. Older combat PRs own the file from #335.
RECOMMENDED_ACTION: Wait for #335. Same finding as MAA-2026-10-21-003.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After #335, AT names Attack Nearest; Attack title has no “click”.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-25-002
TITLE: Chat channel tabs below 44px
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: ChatPanel.tsx
CURRENT_BEHAVIOUR: Channel tabs use py-1 px-2 text-[9px] with no stone-touch-target. Gear has stone-touch-target but inline 24×24. #350/#392/#447 own ChatPanel.
DESIRED_BEHAVIOUR: Channel switchers ≥44px on mobile; send already has stone-touch-target.
EVIDENCE: ChatPanel.tsx tabs ~1180–1190; gear ~1222–1235.
RECOMMENDED_ACTION: Wait for ChatPanel owners.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: 390px width channel tabs measure ≥44px.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-26-003
TITLE: Two-finger canvas touchend can walk or cast as a tap
CATEGORY: accidental-gestures
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration handleCanvasTouch; pointerParity.ts (#645 helper)
CURRENT_BEHAVIOUR: handleCanvasTouch uses changedTouches[0] even when another finger is still down or two fingers lifted. Canvas has touch-action:none (class touch-none) so the browser does not pinch-zoom, but the game still treats the lift as a tap. #645 adds shouldIgnoreCanvasTouchEndUnlessSingleFinger but does not wire it (WX owned).
DESIRED_BEHAVIOUR: Ignore pinch/two-finger lifts; only a one-finger tap (touches.length === 0 && changedTouches.length === 1) walks or casts. Do not fork the helper: copy #645 exactly when wiring.
EVIDENCE: WX ~10728 const touch = event.changedTouches[0]; canvas className touch-none ~17883.
RECOMMENDED_ACTION: Wait for #645 helper, then one WX early-return. Do not add a second copy in pointerGesture.ts.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — must not drop legal one-finger taps.
VALIDATION_REQUIRED: Pinch-zoom cancel does not walk; single tap still casts legally.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-26-004
TITLE: Inspect popup requires BattleUIPanel popupAnchor
CATEGORY: hud-overlap
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx; StatPopup.tsx
CURRENT_BEHAVIOUR: StatPopup positions from anchorRect. The portal is gated on a truthy popupAnchor. #645 centers when the rect is missing.
DESIRED_BEHAVIOUR: Render inspect whenever a combatant is selected; clampInspectPopupPosition always.
EVIDENCE: BattleUIPanel popupAnchor gate. Open PR #645.
RECOMMENDED_ACTION: Wait for #645. Do not restack StatPopup (#471 first a11y owner).
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Sprite inspect with no chip still places the card on-screen.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-28-005
TITLE: Debug overlay is unreachable during SmallScreenGuard and loading
CATEGORY: keyboard-focus
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: App.tsx SmallScreenGuard early return
CURRENT_BEHAVIOUR: Viewport < 768 without Continue replaces the game tree. AGENTS.md wants the debug overlay always reachable, even during loading/crash. Debug lives in ChatPanel after the world mounts. Continue is focused on mount and is minHeight 44.
DESIRED_BEHAVIOUR: Keep a debug entry on the guard/loading screens (dev-only).
EVIDENCE: App.tsx if (isSmallScreen && !smallScreenBypass) return guard-only tree.
RECOMMENDED_ACTION: Report-only. Do not ship debug to normal players.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Phone first load; debug still openable before Continue.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-29-004
TITLE: Decorative motion ignores prefers-reduced-motion
CATEGORY: accessibility
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: StarfieldBackground; AchievementToast pulse; index.css infinite HUD animations
CURRENT_BEHAVIOUR: No @media (prefers-reduced-motion: reduce) in src. Starfield, trophy pulse, and HUD CSS loops still run. Combat floaters are canvas-drawn, not CSS.
DESIRED_BEHAVIOUR: Pause or freeze decorative loops when the user requests reduced motion. Do not skip combat floaters that convey damage.
EVIDENCE: grep prefers-reduced-motion in src/frontend/src is empty. index.css owned by #339+.
RECOMMENDED_ACTION: Human-approved CSS. Do not restack index.css or Starfield (#511/#740).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM if combat juice is paused.
VALIDATION_REQUIRED: OS reduce-motion on; starfield idle; damage numbers still appear.
STATUS: NEW

---

ACTION_ID: MAA-2026-10-21-002
TITLE: Character-creation view tabs, Rotate, and Randomize sit below 44px
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterCreation.tsx
CURRENT_BEHAVIOUR: View tabs use padding 7px 4px. Rotate / Randomize use padding 9px with no stone-touch-target. Color pickers are 28×28. #372 and #526 own this file.
DESIRED_BEHAVIOUR: Those controls measure ≥44px on phones via stone-touch-target / minHeight 44. Keep the carved-stone layout; do not redesign the preview.
EVIDENCE: CharacterCreation.tsx view tabs ~502–508; Rotate ~538–544; Randomize ~571–575; color input ~687–695.
RECOMMENDED_ACTION: Leave to #526. Do not restack CharacterCreation in this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — mobile min size only.
VALIDATION_REQUIRED: At 390px width, Front/Right/Back/Left, Rotate, Randomize, and color wells measure ≥44px; create still writes uiLayout "".
STATUS: NEW

---

ACTION_ID: MAA-2026-10-22-004
TITLE: shadcn Button size sm, Switch, and Checkbox stay below 44px
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/button.tsx size sm; switch.tsx; checkbox.tsx
CURRENT_BEHAVIOUR: Size sm stays h-8 (32px) after #895. Switch is 1.15rem. Checkbox is size-4. Toggle default/lg now 44px (MAA-2026-10-24-001). Select default trigger is 44px (#935). None of the remaining primitives are wired in player chrome today.
DESIRED_BEHAVIOUR: If those primitives are wired for players, raise to ≥44px or wrap in a 44px label. Do not enlarge checkbox/switch visuals without a layout owner (looks like a redesign).
EVIDENCE: button.tsx sm; switch.tsx h-[1.15rem]; checkbox.tsx size-4.
RECOMMENDED_ACTION: Report-only until a player surface uses them. Toggle default left this finding.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: If admin or a future HUD uses Switch/Checkbox, measure the hit area including the label.
STATUS: NEW

---

ACTION_ID: MAA-2026-10-23-006
TITLE: SidebarTrigger is size-7 (28px) and SidebarInput forces h-8
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/sidebar.tsx
CURRENT_BEHAVIOUR: SidebarTrigger passes `size-7` on Button (28px). SidebarInput passes `h-8` on Input, which fights #935’s Input 44px floor. Menu buttons default to h-8. Sidebar is unused in player chrome.
DESIRED_BEHAVIOUR: Trigger and search field ≥44px if Sidebar is ever wired. Do not restyle the whole icon-collapsed rail without a layout owner.
EVIDENCE: sidebar.tsx SidebarTrigger `size-7` ~269; SidebarInput `h-8` ~329; sidebarMenuButtonVariants default `h-8`.
RECOMMENDED_ACTION: Report-only until Sidebar ships. Input min-h still applies unless a consumer passes a smaller height.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: If Sidebar is adopted, measure Trigger and Input including labels.
STATUS: NEW

---

ACTION_ID: MAA-2026-10-23-007
TITLE: Dropdown/context/command items, Calendar cells, and BreadcrumbEllipsis sit below 44px
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/dropdown-menu.tsx; context-menu.tsx; command.tsx CommandItem; calendar.tsx; breadcrumb.tsx
CURRENT_BEHAVIOUR: Menu items use py-1.5. Calendar `--cell-size: --spacing(8)` (32px). BreadcrumbEllipsis is size-9. NavigationMenu trigger and Menubar bar/triggers are now 44px (MAA-2026-10-24-004/005). Unused in player chrome.
DESIRED_BEHAVIOUR: If those primitives are wired for players, raise interactive rows to ≥44px. 44px menu rows can make long lists tall — needs a layout owner, not this audit.
EVIDENCE: DropdownMenuItem `py-1.5`; calendar `[--cell-size:--spacing(8)]`; BreadcrumbEllipsis `size-9`.
RECOMMENDED_ACTION: Report-only. Do not enlarge every menu row from this audit.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if menu lists grow on phones.
VALIDATION_REQUIRED: If a HUD menu uses these, measure each row at 390px width.
STATUS: NEW

---

ACTION_ID: MAA-2026-10-23-008
TITLE: RadioGroupItem and Slider thumb are 16px visuals
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/radio-group.tsx; slider.tsx
CURRENT_BEHAVIOUR: Radio is size-4. Slider thumb is size-4. Unused in player chrome. Enlarging the glyph looks like a redesign (same reason as Checkbox/Switch).
DESIRED_BEHAVIOUR: Wrap in a 44px hit area / label without growing the 16px glyph, if a player surface uses them.
EVIDENCE: RadioGroupItem `size-4`; Slider Thumb `size-4`.
RECOMMENDED_ACTION: Report-only with MAA-2026-10-22-004.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Measure label+control hit area, not just the glyph.
STATUS: NEW

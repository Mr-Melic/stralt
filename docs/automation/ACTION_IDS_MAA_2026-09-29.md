# ACTION_IDs — 2026-09-29 Mobile / Touch / Accessibility Auditor

Reuse prior IDs when the finding is the same. `DESIGN.md` was not edited.

Combat on `origin/main` already shares live gates (`decideSpriteCastClick` /
`decideTileCastClick`), stamps both ghost-click refs at the start of
`handleCanvasTouch`, calls `preventDefault` first, and uses a **400ms**
synthetic-click window (`pointerParity.ts` `SYNTHETIC_CLICK_GUARD_MS` ===
`pointerGesture.ts` `SYNTHETIC_CLICK_SUPPRESS_MS`). Mouse sprite pad is 10px;
touch sprite pad is 14px (MAA-010 — do not unify). This run **locks** those
contracts with a source test; it does not change execute math.

Did **not** edit WorldExploration, GameFlow, BattleUIPanel, index.css,
ChallengePanel, CharacterSelection, Settings, Spellbook, ChatPanel, BuffShop,
DokaGameKeyShop, App.tsx, PostBattleRecap, LandingPage, StarfieldBackground,
dialog.tsx, alert-dialog, shopDialogDismiss, pointerParity, StatPopup, or
SummonControlPanel. Those files stay with older still-open PRs (WX from #327,
#335 GameFlow/BattleUI, #372/#364 ChallengePanel, #425/#471/#526 overlays,
#511 starfield, #645 inspect/pointerParity, #693 recap, #740 landing/dialog).

`index.html` is unowned. Theme-color `#0d0f1a` matches App / SmallScreenGuard
fill. Do not restyle DESIGN.md tokens.

---

## Implemented this run (display / a11y / contract tests only)

```
ACTION_ID: MAA-2026-09-29-001
TITLE: Document lacked dark theme-color for mobile browser chrome
CATEGORY: viewport-scaling
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/index.html
CURRENT_BEHAVIOUR: viewport-fit=cover was set, but Safari/Chrome UI had no theme-color or color-scheme, so the status bar / form controls could flash light over the navy shell.
DESIRED_BEHAVIOUR: color-scheme dark and theme-color #0d0f1a (same fill as App.tsx / SmallScreenGuard). Viewport meta unchanged (user zoom remains allowed).
EVIDENCE: index.html head; documentChrome.test.ts.
RECOMMENDED_ACTION: Keep the two meta tags. Do not add user-scalable=no or maximum-scale=1.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — browser chrome only.
VALIDATION_REQUIRED: node --test documentChrome.test.ts; iOS Safari address bar sits on navy; pinch-zoom still works.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-29-002
TITLE: Lock mouse/touch combat legality contracts in a source test
CATEGORY: touch-mouse-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/canvasPointerParity.contracts.test.ts; WorldExploration.tsx (read-only); pointerGesture.ts; pointerParity.ts
CURRENT_BEHAVIOUR: Mouse and touch already share decideSpriteCastClick / decideTileCastClick and a 400ms ghost-click window, but nothing failed the build if a future edit forked one path.
DESIRED_BEHAVIOUR: A contract test requires two sprite decide calls, two tile decide calls, 10px mouse pad, 14px touch pad, both ghost-click helpers, and preventDefault-first on touchend.
EVIDENCE: canvasPointerParity.contracts.test.ts. Does not edit WorldExploration.
RECOMMENDED_ACTION: Keep the contract. Do not unify 10 vs 14 from this test (MAA-010).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — test only. Older WX PRs that reformat hitTestSprite calls must keep the same pads and decide calls.
VALIDATION_REQUIRED: node --test canvasPointerParity.contracts.test.ts pointerParity.test.ts pointerGesture.test.ts; tap then click must not double-cast.
STATUS: NEW
```

---

## Still queued in older still-open PRs (do not restack)

Landing 44px Sign In / named logo / dialog safe-area: **#740** (MAA-2026-09-28-001..004, MAA-2026-09-27-005).
Recap safe-area / Escape-only dismiss / alert-dialog insets: **#693**.
Inspect center + 44px close + subscribeEscapeToDismiss + unwired two-finger helper: **#645** (MAA-2026-09-26-001..003).
Summon End Turn 44px: **#592**.
Shop Escape / Items+Forge 44px / named overlays: **#526**.
Feats Escape / 44px boost+claim / status-badge name: **#471** / **#335**.
Mute / Spellbook / Boss / Enemy / Play+Create 44px: **#425**.
Leaderboard Escape: **#335**.

---

## Remaining (human-approval / report-only / wait for owners)

```
ACTION_ID: MAA-006
TITLE: Dual HUD crowding — realm tools and Stats overlay the canvas on phones
CATEGORY: hud-overlap
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx tools; WorldExploration Stats DraggablePanel
CURRENT_BEHAVIOUR: Tools stay at calc(var(--app-top-hud-height) + 2px). Stats is a saved panel. Short portrait phones stack both over the board.
DESIRED_BEHAVIOUR: One HUD row or a fold that keeps 44px targets without covering spawn.
EVIDENCE: GameFlow tools; Stats default folded=false. DESIGN.md Header / Side Panel.
RECOMMENDED_ACTION: Human-approved responsive layout. Do not auto-reflow from this audit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — layout.
VALIDATION_REQUIRED: 390×844 and 844×390; Play, fight, shop, recap.
STATUS: NEW
```

```
ACTION_ID: MAA-007
TITLE: Battle footer is a saved DraggablePanel, not a sticky viewport dock
CATEGORY: sticky-battle-controls
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx; DraggablePanel.tsx
CURRENT_BEHAVIOUR: Battle chrome is a persisted floating window. DESIGN.md says the bottom menu sticks to the viewport.
DESIRED_BEHAVIOUR: On coarse pointers, pin Walk/Attack/spells/End Turn above the home indicator.
EVIDENCE: BattleUIPanel wraps DraggablePanel. SummonControlPanel already uses a sticky bottom dock with safe-area padding.
RECOMMENDED_ACTION: Human-approved dock. Do not change AP/MP execute.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: Portrait fight: End Turn tappable; landscape still usable.
STATUS: NEW
```

```
ACTION_ID: MAA-008
TITLE: Spell and status details are hover-only title tooltips
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel title=; StatusEffectBadge title=
CURRENT_BEHAVIOUR: Native title tooltips. Touch has no hover sheet.
DESIRED_BEHAVIOUR: Tap-to-inspect sheet that reuses the same copy; long-press optional (MAA-009).
EVIDENCE: BattleUIPanel spellTitle / Flee / Attack Nearest title=; StatusEffectBadge title=.
RECOMMENDED_ACTION: Human-approved tap sheet. Wait for BattleUIPanel owners (#335+).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Touch player reads AP cost and cooldown without a mouse.
STATUS: NEW
```

```
ACTION_ID: MAA-009
TITLE: Forced inspect via long-press / right-click is documented but missing
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration canvas handlers
CURRENT_BEHAVIOUR: Inspect is tap-with-no-legal-cast or BattleUIPanel chip. No contextmenu / long-press.
DESIRED_BEHAVIOUR: Explicit inspect gesture that cannot execute a cast.
EVIDENCE: handleCanvasClick / handleCanvasTouch inspect branches; no onContextMenu.
RECOMMENDED_ACTION: Human-approved. Must use decideSpriteCastClick so inspect cannot spend AP.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH if it bypasses live gates.
VALIDATION_REQUIRED: Long-press inspect never casts; mouse right-click same.
STATUS: NEW
```

```
ACTION_ID: MAA-010
TITLE: Sprite hit padding is 10px mouse vs 14px touch
CATEGORY: touch-mouse-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx
CURRENT_BEHAVIOUR: hitTestSprite(..., 10) on click; (..., 14) on touch. After a target is chosen, decideSpriteCastClick is shared, but the chosen entity can differ at the same client point.
DESIRED_BEHAVIOUR: Same padding, or a documented finger-slop policy that still prefers the front-most legal target.
EVIDENCE: handleCanvasClick hitTestSprite(..., 10); handleCanvasTouch hitTestSprite(..., 14). Locked by canvasPointerParity.contracts.test.ts.
RECOMMENDED_ACTION: Report-only until a targeting owner picks one padding. Do not unify from this audit.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if unified blindly.
VALIDATION_REQUIRED: Overlapping sprites at the same client point resolve to the same combatant.
STATUS: NEW
```

```
ACTION_ID: MAA-011
TITLE: useIsMobile is width-only so landscape phones lose MOBILE_ZOOM
CATEGORY: viewport-scaling
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/hooks/use-mobile.tsx; WorldExploration MOBILE_ZOOM 1.75
CURRENT_BEHAVIOUR: isMobile is innerWidth < 768. A phone in landscape often becomes desktop tiles.
DESIRED_BEHAVIOUR: Treat coarse pointers / hover:none as mobile for zoom, or use a min(width,height) breakpoint.
EVIDENCE: use-mobile.tsx; WX effectiveTileW = TILE_WIDTH * MOBILE_ZOOM when isMobile. #447 owns use-mobile.tsx.
RECOMMENDED_ACTION: Human-approved input-mode heuristic. Do not change tile math in this audit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — camera / tile size.
VALIDATION_REQUIRED: Same phone portrait and landscape keep readable tiles.
STATUS: NEW
```

```
ACTION_ID: MAA-012
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
```

```
ACTION_ID: MAA-013
TITLE: Initiative HP is color-only; muted gold/dim text may miss 4.5:1
CATEGORY: contrast-status
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: BattleUIPanel stone-battle-hp-bar; InitiativeStrip 7px names; index.css --dofus-text-dim
CURRENT_BEHAVIOUR: Chip HP is a red bar with no numeric text. Initiative names are 7px. Dim labels use ~0.45 lightness. DESIGN.md wants Body 12px / Label 11px and status as color + text.
DESIRED_BEHAVIOUR: HP number or percent on chips; raise dim text to a passing pair.
EVIDENCE: Chip bar has no text node; InitiativeStrip fontSize 7. DESIGN.md lines 75–76.
RECOMMENDED_ACTION: Add compact HP text; audit OKLCH pairs. Not a redesign of the bar. Do not edit DESIGN.md.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Contrast checker + screen reader name includes HP.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-21-001
TITLE: Leaderboard overlay has no Escape dismiss
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx
CURRENT_BEHAVIOUR: Backdrop click closes. onKeyDown only handles Enter/Space when the overlay itself is focused.
DESIRED_BEHAVIOUR: Window Escape closes like Feats. Do not extract Leaderboard (modify/delete conflict with #335).
EVIDENCE: LeaderboardModal onKeyDown. Open PR #335.
RECOMMENDED_ACTION: Wait for #335.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Open Board, press Escape; overlay closes.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-21-005
TITLE: Zone Lock dialog is a non-modal open dialog without Escape
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: <dialog open> has Close but no keydown. Native Escape only applies to showModal().
DESIRED_BEHAVIOUR: subscribeEscapeToDismiss (copy identically from #425/#471). Avoid editing WorldExploration while older PRs own it.
EVIDENCE: showZoneLockPopup dialog; no Escape listener in WorldExploration.
RECOMMENDED_ACTION: Wait for WX owner.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Open Zone Lock, press Escape, dialog closes.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-21-006
TITLE: Zone Lock FAB ignores the bottom safe area
CATEGORY: safe-areas
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: position fixed bottom 80px right 16px with no env(safe-area-inset-*). minHeight is already 44.
DESIRED_BEHAVIOUR: bottom: calc(80px + env(safe-area-inset-bottom)); right: max(16px, env(safe-area-inset-right)).
EVIDENCE: Zone Tier button styles at WorldExploration ~17604.
RECOMMENDED_ACTION: Wait for WX owner.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: iPhone home-indicator overlap; landscape notch.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-21-007
TITLE: Stats rename pencil is a ~14px target with no accessible name
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: 10px icon, padding 2, title only, no stone-touch-target.
DESIRED_BEHAVIOUR: ≥44px on mobile and aria-label Rename character.
EVIDENCE: stats.rename_button.
RECOMMENDED_ACTION: Add stone-touch-target + aria-label after WX owners land.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: At 390px width the rename control measures ≥44px and has an accessible name.
STATUS: NEW
```

```
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
```

```
ACTION_ID: MAA-2026-09-21-009
TITLE: Touch canvas handler omits activeSpells and hit-test deps the mouse handler lists
CATEGORY: touch-mouse-parity
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: WorldExploration.tsx handleCanvasTouch
CURRENT_BEHAVIOUR: Both callbacks use biome-ignore curated deps. Touch comment lists extra body uses the mouse ignore does not.
DESIRED_BEHAVIOUR: Same dep list or shared handler so a stale closure cannot fork legality.
EVIDENCE: handleCanvasClick vs handleCanvasTouch biome-ignore comments.
RECOMMENDED_ACTION: Human-approved after WX stack thins. Do not expand deps blindly (rebind storms).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Change spells mid-battle; mouse and touch still share decide* results.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-21-010
TITLE: World canvas is tab-focusable with onKeyDown undefined
CATEGORY: keyboard-focus
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx canvas
CURRENT_BEHAVIOUR: tabIndex={0} aria-label set; onKeyDown={undefined}. Focus ring is outline none.
DESIRED_BEHAVIOUR: Either drop tabIndex or wire arrow/hotkey handling that cannot bypass live gates.
EVIDENCE: canvas tabIndex={0} onKeyDown={undefined}.
RECOMMENDED_ACTION: Report-only while WX is owned. Do not add a no-op keydown just to silence a11y lints.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if keys walk without MP gates.
VALIDATION_REQUIRED: Tab to canvas; keyboard does not move or cast illegally.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-22-001
TITLE: Settings mute control is below 44px
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: SettingsPanel.tsx
CURRENT_BEHAVIOUR: Mute control is compact chrome. Open PR #425 adds 44px.
DESIRED_BEHAVIOUR: minHeight 44 / stone-touch-target. Copy unchanged.
EVIDENCE: Open PR #425.
RECOMMENDED_ACTION: Wait for #425.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Settings mute ≥44px at 390px width.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-22-002
TITLE: Spellbook, Boss Guide, and Enemy Register ignored Escape unless the overlay node was focused
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: SpellbookModal.tsx; BossGuideModal.tsx; EnemyRegister.tsx
CURRENT_BEHAVIOUR: Overlay onKeyDown only. #425 adds subscribeEscapeToDismiss on window.
DESIRED_BEHAVIOUR: Window Escape closes; copy shopDialogDismiss identically.
EVIDENCE: Open PR #425.
RECOMMENDED_ACTION: Wait for #425. Do not fork subscribeEscapeToDismiss.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Open each overlay, press Escape with focus in the panel.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-22-003
TITLE: Character-select Play and Create used stone-btn-crimson without the mobile 44px class
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: CharacterSelection.tsx
CURRENT_BEHAVIOUR: stone-btn-crimson is omitted from the ≤768px min-height rule in index.css. #425 adds stone-touch-target.
DESIRED_BEHAVIOUR: Play/Create ≥44px on phones.
EVIDENCE: CharacterSelection stone-btn-crimson; index.css 768px list. Open PR #425.
RECOMMENDED_ACTION: Wait for #425. Do not edit index.css while #339+ own it (MAA-2026-09-22-004).
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: 390px width Play/Create measure ≥44px.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-22-004
TITLE: stone-btn-crimson and stone-btn-slate are omitted from the mobile 44px rule
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/index.css
CURRENT_BEHAVIOUR: ≤768px min 44px applies to stone-nav-btn, stone-touch-target, stone-battle-action, stone-top-bar button, stone-modal-close — not stone-btn-crimson/slate unless those classes are also listed.
DESIRED_BEHAVIOUR: Include stone-btn-crimson and stone-btn-slate, or keep requiring stone-touch-target on every CTA. Prefer the class list once #423/#339 CSS owners land.
EVIDENCE: index.css @media (max-width: 768px) block ~688–697.
RECOMMENDED_ACTION: Human-approved CSS union with #339/#423/#717/#745. Do not restack index.css here.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — many buttons grow on phones.
VALIDATION_REQUIRED: Inventory of stone-btn-* at 390px; none below 44px that players tap.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-22-005
TITLE: Challenge offer panel is mouse-drag only
CATEGORY: touch-mouse-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: ChallengePanel.tsx
CURRENT_BEHAVIOUR: Header uses onMouseDown + mousemove/mouseup. No touch listeners. Accept/Decline already minHeight 44. #364/#372 own the file.
DESIRED_BEHAVIOUR: Touch drag mirrors mouse clamp; buttons still win over drag (closest("button")).
EVIDENCE: ChallengePanel onMouseDown; no onTouchStart.
RECOMMENDED_ACTION: Wait for #364/#372. Do not steal map clicks (pointer-events already handled in #364).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — can cover the board.
VALIDATION_REQUIRED: Drag with a finger; Accept still works; canvas taps under the panel do not fire.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-22-006
TITLE: Walk / Attack / Flee / End Turn / Spellbook / Attack Nearest expose details only through title=
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Accessible names for some controls are title= only. #335 adds Attack Nearest aria-label.
DESIRED_BEHAVIOUR: Visible or aria-label text in addition to title. Same copy as the tooltip.
EVIDENCE: BattleUIPanel title= on actions. Open PRs on BattleUIPanel from #335.
RECOMMENDED_ACTION: Wait for #335. Union aria-label; do not drop title.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: AT names Attack Nearest; mouse tooltip still shows Flee warning.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-22-007
TITLE: Buy Doka overlay ignored Escape unless the overlay node was focused
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: DokaGameKeyShop.tsx
CURRENT_BEHAVIOUR: Overlay onKeyDown. #526 adds window Escape.
DESIRED_BEHAVIOUR: subscribeEscapeToDismiss identical to #425.
EVIDENCE: Open PR #526.
RECOMMENDED_ACTION: Wait for #526. Do not edit DokaGameKeyShop (#372 first owner).
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Open Buy Doka, Escape closes without starting a purchase.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-25-001
TITLE: Board region aria-label
CATEGORY: keyboard-focus
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: GameFlow.tsx
CURRENT_BEHAVIOUR: Leaderboard button title="Leaderboard". Region around the board may lack a name. #335 owns GameFlow.
DESIRED_BEHAVIOUR: Named landmark or aria-label on the board control without renaming the product.
EVIDENCE: GameFlow tools. Wait for #335.
RECOMMENDED_ACTION: Wait for #335.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: AT can find Board.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-25-002
TITLE: Chat channel tabs below 44px
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: ChatPanel.tsx
CURRENT_BEHAVIOUR: Channel tabs are compact. #350/#392/#447 own ChatPanel.
DESIRED_BEHAVIOUR: Channel switchers ≥44px on mobile; send already has stone-touch-target.
EVIDENCE: ChatPanel channel chrome. Skip while older PRs own the file.
RECOMMENDED_ACTION: Wait for ChatPanel owners.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: 390px width channel tabs measure ≥44px.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-26-003
TITLE: Two-finger canvas touchend can walk or cast as a tap
CATEGORY: accidental-gestures
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration handleCanvasTouch; pointerParity.ts (#645 helper)
CURRENT_BEHAVIOUR: handleCanvasTouch uses changedTouches[0] even when another finger is still down or two fingers lifted. #645 adds shouldIgnoreCanvasTouchEndUnlessSingleFinger but does not wire it (WX owned).
DESIRED_BEHAVIOUR: Ignore pinch/two-finger lifts; only a one-finger tap (touches.length === 0 && changedTouches.length === 1) walks or casts. Do not fork the helper: copy #645 exactly when wiring.
EVIDENCE: WX ~10728 const touch = event.changedTouches[0]. Open PR #645.
RECOMMENDED_ACTION: Wait for #645 helper, then one WX early-return. Do not add a second copy in pointerGesture.ts.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — must not drop legal one-finger taps.
VALIDATION_REQUIRED: Pinch-zoom cancel does not walk; single tap still casts legally.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-26-004
TITLE: Inspect popup requires BattleUIPanel popupAnchor
CATEGORY: hud-overlap
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx; StatPopup.tsx
CURRENT_BEHAVIOUR: StatPopup positions from anchorRect. If BattleUIPanel has no chip rect, inspect can sit at 0,0. #645 centers when the rect is missing.
DESIRED_BEHAVIOUR: clampInspectPopupPosition always. #645.
RECOMMENDED_ACTION: Wait for #645. Do not restack StatPopup (#471 first a11y owner).
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Sprite inspect with no chip still places the card on-screen.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-28-005
TITLE: Debug overlay is unreachable during SmallScreenGuard and loading
CATEGORY: keyboard-focus
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: App.tsx SmallScreenGuard early return
CURRENT_BEHAVIOUR: Viewport < 768 without Continue replaces the game tree. AGENTS.md wants the debug overlay always reachable, even during loading/crash.
DESIRED_BEHAVIOUR: Keep a debug entry on the guard/loading screens (dev-only).
EVIDENCE: App.tsx if (isSmallScreen && !smallScreenBypass) return guard-only tree. App.tsx owned by #385+.
RECOMMENDED_ACTION: Report-only. Do not ship debug to normal players.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Phone first load; debug still openable before Continue.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-28-006
TITLE: Recap overlay still uses 16px padding and 94vw without horizontal safe-area
CATEGORY: safe-areas
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: PostBattleRecap.tsx
CURRENT_BEHAVIOUR: Main still has paddingBottom env only. #693 adds overlaySafeAreaPadding + recapCardPaddingStyle.
DESIRED_BEHAVIOUR: Wait for #693. Card width min(480px, 100%) of the padded dialog, not 94vw.
EVIDENCE: Open PR #693. Do not restack PostBattleRecap (#354 first owner).
RECOMMENDED_ACTION: Wait for #693.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Landscape notched phone recap not under the notch; Space does not dismiss.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-29-003
TITLE: shadcn Dialog close control is below the 44px mobile floor
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/dialog.tsx
CURRENT_BEHAVIOUR: DialogPrimitive.Close is absolute top-4 right-4 with a size-4 icon and no min-h/min-w. #740 only changed max-width safe-area; it did not enlarge Close. Game chrome mostly uses custom stone-modal-close, but any shadcn Dialog inherits this.
DESIRED_BEHAVIOUR: min-h-[44px] min-w-[44px] on Close; sr-only Close text stays. Union with #740 max-width string.
EVIDENCE: dialog.tsx DialogPrimitive.Close className. File owned by #740 this queue day.
RECOMMENDED_ACTION: Additive class on Close after #740 or in a follow-up. Do not restack #740.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — hit area only.
VALIDATION_REQUIRED: Any Dialog at 390px; Close measures ≥44px; overlay still dismisses.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-29-004
TITLE: Decorative motion ignores prefers-reduced-motion
CATEGORY: accessibility
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: StarfieldBackground; AchievementToast pulse; index.css infinite HUD animations
CURRENT_BEHAVIOUR: No @media (prefers-reduced-motion: reduce) in src. Starfield, trophy pulse, and HUD CSS loops still run.
DESIRED_BEHAVIOUR: Pause or freeze decorative loops when the user requests reduced motion. Do not skip combat floaters that convey damage (those need a separate owner).
EVIDENCE: grep prefers-reduced-motion in src/frontend/src is empty. index.css owned by #339+.
RECOMMENDED_ACTION: Human-approved CSS. Do not restack index.css or Starfield (#511/#740).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM if combat juice is paused.
VALIDATION_REQUIRED: OS reduce-motion on; starfield idle; damage numbers still appear.
STATUS: NEW
```

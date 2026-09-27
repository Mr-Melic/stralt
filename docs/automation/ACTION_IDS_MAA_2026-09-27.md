# ACTION_ID catalog — 2026-09-27 mobile / touch / a11y audit

Stable IDs for the daily MAA auditor. STATUS: NEW | OPEN | IMPLEMENTED_THIS_RUN | SUPERSEDED.
DESIGN.md was not modified.

Combat on `origin/main` already shares live gates (`decideSpriteCastClick` / `decideTileCastClick`), stamps both ghost-click refs at the start of `handleCanvasTouch`, calls `preventDefault` first, and uses a **400ms** synthetic-click window (`pointerParity.ts` `SYNTHETIC_CLICK_GUARD_MS` === `pointerGesture.ts` `SYNTHETIC_CLICK_SUPPRESS_MS`). No combat legality fork this run. Do not restack WorldExploration / GameFlow / BattleUIPanel / index.css / ChallengePanel / CharacterSelection / Settings / Spellbook / ChatPanel (older still-open PRs).

Union: PR #354 `featsCopy.ts` + recap title `FEATS_UNLOCKED_RECAP_TITLE` (identical helper; canister names unchanged). Starfield `aria-hidden` is disjoint from PR #511 resize/backing helpers.

## Implemented this run (display / a11y only)

```
ACTION_ID: MAA-2026-09-27-001
TITLE: Recap overlay honors notch and home-indicator insets
CATEGORY: safe-area
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/viewportInsets.ts; src/frontend/src/components/PostBattleRecap.tsx
CURRENT_BEHAVIOUR: Recap <dialog> used a fixed 16px padding and width 94vw, so the card plus outer padding could overflow a notched phone and sit under the home indicator.
DESIRED_BEHAVIOUR: Outer padding is max(16px, env(safe-area-inset-*)); inner card is min(480px, 100%) of that padded box.
EVIDENCE: PostBattleRecap.tsx dialog style padding: overlaySafeAreaPadding(); card width min(480px, 100%).
RECOMMENDED_ACTION: Keep overlaySafeAreaPadding() as the changelog / SmallScreenGuard contract.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: viewportInsets.test.ts; open recap on a notched viewport.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: MAA-2026-09-27-002
TITLE: Recap card paddingBottom must outrank padding shorthand
CATEGORY: safe-area
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/viewportInsets.ts; src/frontend/src/components/PostBattleRecap.tsx
CURRENT_BEHAVIOUR: Inner card set paddingBottom then padding: 0. CSS shorthand wiped the home-indicator inset.
DESIRED_BEHAVIOUR: recapCardPaddingStyle() declares padding: 0 then paddingBottom: env(safe-area-inset-bottom).
EVIDENCE: Object key order in recapCardPaddingStyle(); spread into the card style after overflowY.
RECOMMENDED_ACTION: Do not reverse the key order; do not use padding shorthand after paddingBottom.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: viewportInsets.test.ts recapCardPaddingStyle key order.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: MAA-2026-09-27-003
TITLE: Recap Escape-only dismiss so Space/Enter can scroll
CATEGORY: keyboard
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/viewportInsets.ts; src/frontend/src/components/PostBattleRecap.tsx
CURRENT_BEHAVIOUR: Window keydown closed the recap on Escape, Enter, or Space. The focused overflow panel (tabIndex=-1) never received Space/Enter for scrolling a long feats list.
DESIRED_BEHAVIOUR: shouldDismissRecapOnKey is Escape only. Continue and × still close.
EVIDENCE: Removed e.key !== "Enter" && e.key !== " " from PostBattleRecap.tsx.
RECOMMENDED_ACTION: Keep Escape on window; do not restore Space/Enter dismiss.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: viewportInsets.test.ts shouldDismissRecapOnKey; keyboard scroll a long recap.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: MAA-2026-09-27-004
TITLE: Recap overscroll contain and aria-modal
CATEGORY: scrolling
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/PostBattleRecap.tsx
CURRENT_BEHAVIOUR: Recap scroll chained into the page behind the dialog on touch; dialog lacked aria-modal.
DESIRED_BEHAVIOUR: overscroll-behavior contain on dialog and card; aria-modal="true".
EVIDENCE: PostBattleRecap.tsx dialog/card style overscrollBehavior; aria-modal on <dialog open>.
RECOMMENDED_ACTION: Leave overscroll contain; native <dialog open> already in the a11y tree.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: viewportInsets.test.ts overscrollBehavior; swipe recap on iOS.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: MAA-2026-09-27-005
TITLE: Decorative starfield canvas is hidden from AT
CATEGORY: accessibility
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/StarfieldBackground.tsx
CURRENT_BEHAVIOUR: Landing starfield <canvas> is in the accessibility tree with no name. It is pointer-events-none and has no tabIndex.
DESIRED_BEHAVIOUR: Hidden from AT without tripping Biome noAriaHiddenOnFocusable (the rule treats <canvas> as focusable). Do not restack PR #511 resize/backing.
EVIDENCE: Adding aria-hidden="true" on the canvas fails pnpm check. Wrapper-div approach would overlap #511 clientWidth resize.
RECOMMENDED_ACTION: After #511, wrap the canvas in a non-focusable aria-hidden container or get a Biome exception with targeting/perf owners.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: pnpm check must stay green; AT skip decorative canvas.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-27-006
TITLE: AlertDialogContent max-width subtracts horizontal safe-area
CATEGORY: safe-area
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/alert-dialog.tsx
CURRENT_BEHAVIOUR: max-w-[calc(100%-2rem)] could sit under left/right notches on landscape phones.
DESIRED_BEHAVIOUR: max-w includes env(safe-area-inset-left/right).
EVIDENCE: alert-dialog.tsx AlertDialogContent className calc(100%-2rem-env(safe-area-inset-left)-env(safe-area-inset-right)).
RECOMMENDED_ACTION: Keep sm:max-w-lg; do not redesign the dialog.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: viewportInsets.test.ts alert-dialog scan.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-RECAP-FEATS-COPY
TITLE: Recap section title uses Feats, not Achievements
CATEGORY: copy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/featsCopy.ts; src/frontend/src/components/PostBattleRecap.tsx
CURRENT_BEHAVIOUR: Recap section said "Achievements Unlocked" while GameFlow chrome says Feats.
DESIRED_BEHAVIOUR: FEATS_UNLOCKED_RECAP_TITLE from featsCopy.ts (union with open PR #354; identical helper). Canister methods unchanged.
EVIDENCE: PostBattleRecap RecapSection title={FEATS_UNLOCKED_RECAP_TITLE}.
RECOMMENDED_ACTION: Keep one featsCopy.ts; do not concatenate a second export of FEATS_UNLOCKED_RECAP_TITLE.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: featsCopy.test.ts; viewportInsets.test.ts FEATS_UNLOCKED_RECAP_TITLE scan.
STATUS: IMPLEMENTED_THIS_RUN
```

## Human approval / report-only (stable IDs — do not auto-implement)

```
ACTION_ID: MAA-006
TITLE: Dual HUD crowding on short viewports
CATEGORY: hud-overlap
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/BattleUIPanel.tsx; src/frontend/src/index.css
CURRENT_BEHAVIOUR: Top HUD (--app-top-hud-height) plus bottom battle chrome and challenge strip overlap the isometric board on short phones.
DESIRED_BEHAVIOUR: One reserved HUD band; board remains tappable. Requires layout redesign.
EVIDENCE: GameFlow tools sit at calc(var(--app-top-hud-height) + 2px); BattleUIPanel is a second dock. Older PRs own these files.
RECOMMENDED_ACTION: Dedicated layout owner. Do not restack GameFlow/BattleUIPanel/index.css in this audit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: Portrait 390×844 and landscape 844×390 combat + overworld.
STATUS: OPEN
```

```
ACTION_ID: MAA-007
TITLE: Sticky battle control dock
CATEGORY: sticky-controls
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Spell bar / End Turn / Attack Nearest are not a thumb-zone dock; they share the crowded HUD.
DESIRED_BEHAVIOUR: Sticky bottom battle controls with 44px targets that do not cover legal tiles.
EVIDENCE: BattleUIPanel layout; older combat PRs own the file.
RECOMMENDED_ACTION: Layout PR with targeting owner. Do not ship from MAA cron.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: Touch and mouse cast legality identical after dock.
STATUS: OPEN
```

```
ACTION_ID: MAA-008
TITLE: Spell details depend on hover
CATEGORY: hover-only
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Spell range/cost/effects are hover tooltips. Touch has no equivalent sheet.
DESIRED_BEHAVIOUR: Tap-to-pin spell sheet on coarse pointers; hover remains on fine pointers.
EVIDENCE: BattleUIPanel spell slot title/hover; no long-press inspect (MAA-009).
RECOMMENDED_ACTION: Coarse-pointer tap sheet. Targeting owner. Do not name-match spells.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Touch tap shows the same legality copy as mouse hover.
STATUS: OPEN
```

```
ACTION_ID: MAA-009
TITLE: Missing long-press inspect on canvas
CATEGORY: touch-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx; src/frontend/src/components/BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Inspect popup needs popupAnchor from the battle HUD; canvas has no long-press inspect.
DESIRED_BEHAVIOUR: Long-press a unit opens the same inspect card as mouse inspect, without changing cast legality.
EVIDENCE: MAA-2026-09-26-004; BattleUIPanel still requires popupAnchor. Helper shouldIgnoreCanvasTouchEndUnlessSingleFinger is unwired (#645).
RECOMMENDED_ACTION: Wait for BattleUIPanel/WX owners. Do not wire multi-finger helper without that owner.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: Touch long-press inspect; mouse click-to-cast unchanged; 400ms ghost-click still holds.
STATUS: OPEN
```

```
ACTION_ID: MAA-010
TITLE: Sprite hit padding 10 mouse vs 14 touch
CATEGORY: touch-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Touch hit pad is 14px, mouse is 10px. Legal sprite picks differ by pointer type.
DESIRED_BEHAVIOUR: Shared decision helper; any pad delta is an explicit targeting policy, not an accidental fork.
EVIDENCE: WorldExploration sprite hit testing; PR #427 extracts sprite-first hit testing.
RECOMMENDED_ACTION: Targeting owner. Do not unify pads from this audit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: Same tile/sprite is legal or illegal for touch and mouse.
STATUS: OPEN
```

```
ACTION_ID: MAA-011
TITLE: Landscape MOBILE_ZOOM crops the board
CATEGORY: viewport
PRIORITY: P1
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx; src/frontend/src/index.css
CURRENT_BEHAVIOUR: Landscape phones keep a mobile zoom that crops HUD and board edges.
DESIRED_BEHAVIOUR: Board and HUD remain fully usable in landscape without a redesign of isometric projection.
EVIDENCE: Prior MAA notes; WX/index.css owned by older PRs.
RECOMMENDED_ACTION: Viewport owner. Report only from this cron.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: 844×390 landscape walk + cast.
STATUS: OPEN
```

```
ACTION_ID: MAA-012
TITLE: Hover-only walk/cast preview
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Path and range preview follow mousemove. Touch has no equivalent until lift.
DESIRED_BEHAVIOUR: Touch drag/press preview uses the same legality helper as mouse hover.
EVIDENCE: WX hover preview path; shared execute gates already exist for click.
RECOMMENDED_ACTION: Targeting owner. Do not add a second legality path.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: Touch press-preview vs mouse hover; identical illegal rejects.
STATUS: OPEN
```

```
ACTION_ID: MAA-013
TITLE: Color-only chip HP and dim contrast
CATEGORY: contrast
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx; DESIGN.md tokens
CURRENT_BEHAVIOUR: Some HP/status chips rely on color fill with 9–10px dim text below WCAG for body copy.
DESIRED_BEHAVIOUR: Status also in text/icon; dim labels meet readable size without redesigning the stone HUD.
EVIDENCE: Recap uses 9–10px dim labels (left as DESIGN.md density). Battle chips need a targeting/HUD owner.
RECOMMENDED_ACTION: Do not restyle DESIGN.md palette. Pair color with text on chips.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Contrast check on battle chips; DESIGN.md untouched.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-21-001
TITLE: Leaderboard overlay Escape
CATEGORY: keyboard
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx
CURRENT_BEHAVIOUR: Leaderboard is an inline GameFlow modal. PR #335 adds Escape there.
DESIRED_BEHAVIOUR: Escape dismisses Leaderboard. Do not extract the modal (modify/delete conflict with #335).
EVIDENCE: Memory 2026-09-25; #335 still open.
RECOMMENDED_ACTION: Wait for #335. Do not extract Leaderboard.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Escape closes Leaderboard after #335.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-21-005
TITLE: Zone-lock dialog missing Escape
CATEGORY: keyboard
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Zone-lock overlay is not a native dialog and has no window Escape subscriber.
DESIRED_BEHAVIOUR: subscribeEscapeToDismiss (same text as #425/#471/#526/#645).
EVIDENCE: WX owned by older PRs.
RECOMMENDED_ACTION: Wait for WX owner. Copy helper identically; do not fork.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Escape closes zone-lock; combat keys unchanged.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-21-006
TITLE: Zone-lock overlay safe-area
CATEGORY: safe-area
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Zone-lock card can sit under the notch.
DESIRED_BEHAVIOUR: overlaySafeAreaPadding() on the overlay box.
EVIDENCE: WX owned by older PRs.
RECOMMENDED_ACTION: Wait for WX owner.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Notched iPhone zone-lock.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-21-007
TITLE: Character rename pencil below 44px
CATEGORY: touch-target
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/CharacterSelection.tsx
CURRENT_BEHAVIOUR: Rename pencil control is visually ~24–28px.
DESIRED_BEHAVIOUR: 44px stone-touch-target on coarse pointers without changing rename persist.
EVIDENCE: CharacterSelection / GameFlow owned by #425 and later.
RECOMMENDED_ACTION: Wait for those PRs.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: 44px hit box; rename still saves.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-21-008
TITLE: Rename modal missing Escape
CATEGORY: keyboard
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx
CURRENT_BEHAVIOUR: Rename overlay does not subscribe window Escape.
DESIRED_BEHAVIOUR: subscribeEscapeToDismiss identical to #425.
EVIDENCE: GameFlow owned by older PRs.
RECOMMENDED_ACTION: Wait for GameFlow owner.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Escape cancels rename without submitting.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-21-009
TITLE: Canvas touch handler missing click-path deps
CATEGORY: touch-parity
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: handleCanvasTouch may close over a stale click-path snapshot versus handleCanvasClick.
DESIRED_BEHAVIOUR: Shared decide* helpers already exist; touch must call the same live gates as click (do not add a second execute path).
EVIDENCE: WX; older combat PRs share gates. Do not edit WX here.
RECOMMENDED_ACTION: Targeting owner after those PRs land.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: Touch and mouse reject the same illegal casts.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-21-010
TITLE: Canvas tabIndex with no keydown
CATEGORY: keyboard
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Canvas can take tab focus without a keydown map.
DESIRED_BEHAVIOUR: Either a documented skip or arrow-key help that does not change RAF/turn/damage.
EVIDENCE: WX owned.
RECOMMENDED_ACTION: Report only.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Tab order through HUD; canvas is not a keyboard trap.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-22-001
TITLE: Settings mute control 44px
CATEGORY: touch-target
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/SettingsPanel.tsx
CURRENT_BEHAVIOUR: Mute toggle is below 44px on desktop CSS; PR #425 adds stone-touch-target.
DESIRED_BEHAVIOUR: 44px mute at ≤768px.
EVIDENCE: Open PR #425.
RECOMMENDED_ACTION: Wait for #425.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Settings mute hit box after #425.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-22-002
TITLE: Overlay Escape for Spellbook / Boss / Enemy windows
CATEGORY: keyboard
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/SpellbookModal.tsx; src/frontend/src/components/BossGuideModal.tsx; src/frontend/src/components/EnemyRegister.tsx
CURRENT_BEHAVIOUR: Window Escape is queued in #425/#471/#526 via subscribeEscapeToDismiss.
DESIRED_BEHAVIOUR: Identical helper text; no fork.
EVIDENCE: Open PRs #425, #471, #526.
RECOMMENDED_ACTION: Wait; copy helper identically if a later audit needs it.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Escape closes each overlay without submitting.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-22-003
TITLE: Character-select Play/Create 44px
CATEGORY: touch-target
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterSelection.tsx
CURRENT_BEHAVIOUR: Play/Create CTAs queued in #425.
DESIRED_BEHAVIOUR: stone-touch-target on those buttons.
EVIDENCE: Open PR #425.
RECOMMENDED_ACTION: Wait for #425.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: 44px Play/Create.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-22-004
TITLE: Global stone-btn 44px on coarse pointers
CATEGORY: touch-target
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/index.css
CURRENT_BEHAVIOUR: .stone-touch-target is 44px at ≤768px; not every stone-btn uses the class. PR #423 owns leftover CSS.
DESIRED_BEHAVIOUR: Coarse-pointer floor without changing desktop density.
EVIDENCE: index.css ~691; do not restack index.css.
RECOMMENDED_ACTION: Wait for CSS owner.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Desktop buttons stay compact; mobile 44px.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-22-005
TITLE: ChallengePanel mouse-only drag
CATEGORY: touch-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ChallengePanel.tsx
CURRENT_BEHAVIOUR: Panel drag is mouse-event based; PR #372 owns player-journey copy on that file.
DESIRED_BEHAVIOUR: Pointer-events drag with the same clamp, no challenge-rule changes.
EVIDENCE: Open PR #372.
RECOMMENDED_ACTION: Wait for #372.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Touch-drag panel; challenge accept/fail copy unchanged.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-22-006
TITLE: Attack Nearest aria-label
CATEGORY: accessibility
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Control may lack a stable accessible name. Queued with #335 / later BattleUIPanel PRs.
DESIRED_BEHAVIOUR: Explicit aria-label; same execute gates as click.
EVIDENCE: BattleUIPanel owned.
RECOMMENDED_ACTION: Wait.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: AT name; mouse and touch still share execute.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-25-001
TITLE: Board region aria-label
CATEGORY: accessibility
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx
CURRENT_BEHAVIOUR: Board canvas wrapper is unlabeled.
DESIRED_BEHAVIOUR: region name that does not change RAF.
EVIDENCE: GameFlow owned.
RECOMMENDED_ACTION: Wait.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: AT lists a Battle map / World map region.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-25-002
TITLE: Chat channel tabs below 44px
CATEGORY: touch-target
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx
CURRENT_BEHAVIOUR: Channel tabs are compact. PRs #392/#447 own chat polling/layout.
DESIRED_BEHAVIOUR: 44px tabs on coarse pointers; send still works.
EVIDENCE: ChatPanel owned.
RECOMMENDED_ACTION: Wait.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Channel switch on phone; messages still bind caller name.
STATUS: OPEN
```

```
ACTION_ID: MAA-2026-09-26-004
TITLE: Inspect popup requires BattleUIPanel popupAnchor
CATEGORY: touch-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Inspect card mounts only when popupAnchor is set from HUD inspect. Canvas tap cannot open it.
DESIRED_BEHAVIOUR: Same inspect card from canvas long-press / HUD, using clampInspectPopupPosition from #645.
EVIDENCE: Open PR #645. Do not restack BattleUIPanel.
RECOMMENDED_ACTION: Wait for #645 then a BattleUIPanel owner.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Inspect from HUD and (later) canvas; 44px close.
STATUS: OPEN
```

# ACTION_IDs — 2026-10-29 Mobile / Touch / Accessibility Auditor

Reuse prior IDs when the finding is the same. `DESIGN.md` was not edited.

Combat on `origin/main` still shares live gates (`decideSpriteCastClick` /
`decideTileCastClick`), stamps both ghost-click refs at the start of
`handleCanvasTouch`, calls `preventDefault` first, and uses a **400ms**
synthetic-click window (`pointerParity.ts` `SYNTHETIC_CLICK_GUARD_MS` ===
`pointerGesture.ts` `SYNTHETIC_CLICK_SUPPRESS_MS`). Mouse sprite pad is 10px;
touch sprite pad is 14px (MAA-010 — do not unify). Recap ignore, death/HP
guard, summon-control route, live-cast entry, execute, occupancy, walk-block,
hazard debit, portal block, leftover-AP clear, self-heal challenge, AP reject
copy, Occupied copy, fizzle float + sound, `physical_attack` fallback, and
world wall/void walk are the same on both pointer paths. This run did **not**
change execute math, RAF, or WorldExploration.

Did **not** edit WorldExploration, GameFlow, BattleUIPanel, index.css,
ChallengePanel, CharacterSelection, CharacterCreation, Settings, Spellbook,
ChatPanel, BuffShop, DokaGameKeyShop, App.tsx, PostBattleRecap, LandingPage,
StarfieldBackground, ProfileSetup, GameOverModal, DraggablePanel, dialog,
sheet, alert-dialog, button, carousel, pagination, input, select, tabs,
input-otp, toggle, accordion, command, navigation-menu, menubar, toggle-group,
breadcrumb, resizable, drawer, collapsible, scroll-area, popover, table,
sidebar, hover-card, dropdown-menu, context-menu, tooltip, checkbox, switch,
radio-group, slider, calendar, sonner, chart, shopDialogDismiss, pointerParity,
pointerGesture, StatPopup, SummonControlPanel, EnemyRegister, BossGuideModal,
AchievementToast, MapModifiersPanel, AdminGameKeyPurchases, AdminDashboard,
or index.html. Those stay with older still-open PRs (WX from #327, #335
GameFlow/BattleUI, #372/#364 ChallengePanel/CharacterCreation/ProfileSetup,
#421 GameOverModal, #425/#471/#526 overlays, #429 DraggablePanel, #492 GameKey
admin Escape, #511/#740 starfield/landing/dialog max-width, #645
inspect/pointerParity helper, #693 recap, #795 document chrome, #822
Dialog/Sheet Close, #853 AlertDialog Action/Cancel, #895
Button/carousel/pagination 44px, #935 Input/Select/Tabs/OTP 44px, #1010
Toggle/Accordion/Command/Nav/Menubar 44px, #1068 ToggleGroup/Breadcrumb/
Resizable/Drawer 44px, #1125 Collapsible/ScrollBar/Popover/Table/SidebarRail,
#1194 HoverCard/Tooltip/Dropdown/Context overscroll, #1245 Sonner HUD inset /
Chart tooltip dvh).

`ui/textarea.tsx`, `ui/alert.tsx`, `ui/skeleton.tsx`, `ui/progress.tsx`, and
`ui/form.tsx` had no older owner. None of those primitives are wired in player
chrome today (`ui-summary.json` only; Skeleton is imported by unused Sidebar).
Size `sm` buttons, Checkbox, Switch, Radio, Slider glyphs, SidebarTrigger,
SidebarInput, and dense dropdown/calendar/menu rows stay compact
(MAA-2026-10-22-004 / MAA-2026-10-23-006..008).

---

## Implemented this run (display / a11y / contract tests only)

ACTION_ID: MAA-2026-10-29-001
TITLE: shadcn Textarea lacks overscroll contain and touch-manipulation
CATEGORY: accidental-gestures
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/textarea.tsx; src/frontend/src/utils/formChromeA11y.contracts.test.ts
CURRENT_BEHAVIOUR: Textarea was already `min-h-16` (64px) and `text-base` (16px, so iOS does not zoom). It had no `overscroll-contain` or `touch-manipulation`, so a focused field could rubber-band the page or inherit a 300ms tap delay. Unused in player chrome today. Input 44px stays with #935.
DESIRED_BEHAVIOUR: Keep `min-h-16` and `text-base`. Add `overscroll-contain touch-manipulation`. Do not drop below 44px.
EVIDENCE: textarea.tsx class string before this run had min-h-16 + text-base only.
RECOMMENDED_ACTION: Keep the overscroll/touch classes. Do not restack input.tsx (#935).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — unused in live HUD; height unchanged.
VALIDATION_REQUIRED: node --test formChromeA11y.contracts.test.ts; iOS focus does not zoom; field scroll does not chain to the page.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-10-29-002
TITLE: shadcn Alert has no dvh cap or overscroll contain
CATEGORY: scrolling
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/alert.tsx; src/frontend/src/utils/formChromeA11y.contracts.test.ts
CURRENT_BEHAVIOUR: Alert already had `role="alert"`. Long copy had no max-height, overflow, or overscroll contain, so a tall banner could drive the page. Unused in player chrome today. HoverCard/Tooltip/Popover dvh caps stay with #1194/#1125; Chart tooltip stays with #1245.
DESIRED_BEHAVIOUR: Cap at `min(80vh, 100dvh)`, `overflow-y-auto`, `overscroll-contain`. Short alerts do not grow.
EVIDENCE: alertVariants base string had no max-h / overscroll before this run.
RECOMMENDED_ACTION: Keep the dvh cap. Do not restack alert-dialog.tsx (#853/#693).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — unused in live HUD; max-h only clips past 80vh.
VALIDATION_REQUIRED: node --test formChromeA11y.contracts.test.ts; no canvas/RAF change.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-10-29-003
TITLE: Skeleton pulse and Progress fill ignore prefers-reduced-motion
CATEGORY: accessibility
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/skeleton.tsx; src/frontend/src/components/ui/progress.tsx; src/frontend/src/utils/formChromeA11y.contracts.test.ts
CURRENT_BEHAVIOUR: Skeleton used `animate-pulse` with no `motion-reduce` freeze. Progress indicator used `transition-all` with no reduced-motion kill. Player chrome still has Starfield / trophy / HUD loops (MAA-2026-09-29-004) on owned files. These primitives are unused in the live HUD (Skeleton only via unused Sidebar).
DESIRED_BEHAVIOUR: `motion-reduce:animate-none` on Skeleton; `motion-reduce:transition-none` on Progress indicator. Do not restack index.css or Starfield.
EVIDENCE: grep prefers-reduced-motion / motion-reduce in src/frontend/src was empty before this run.
RECOMMENDED_ACTION: Keep the motion-reduce classes. Decorative loops on index.css / Starfield / AchievementToast stay HUMAN_APPROVAL (MAA-2026-09-29-004).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — kit-only; combat floaters are canvas-drawn.
VALIDATION_REQUIRED: node --test formChromeA11y.contracts.test.ts; OS reduce-motion does not hide damage numbers.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-10-29-004
TITLE: FormMessage errors are not announced as alerts
CATEGORY: keyboard-focus
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/form.tsx; src/frontend/src/utils/formChromeA11y.contracts.test.ts
CURRENT_BEHAVIOUR: FormMessage rendered a `<p>` with the error text and was referenced from FormControl `aria-describedby`. It did not set `role="alert"`, so a newly appeared error was easy to miss until the control was re-focused. Unused in player chrome today.
DESIRED_BEHAVIOUR: When `error` is set, FormMessage uses `role="alert"`. Non-error children stay a static hint.
EVIDENCE: form.tsx FormMessage had no role before this run.
RECOMMENDED_ACTION: Keep role=alert on the error path. Do not restack label.tsx.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — unused in live HUD.
VALIDATION_REQUIRED: node --test formChromeA11y.contracts.test.ts.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-10-29-005
TITLE: Lock fizzle, occupancy, leftover-AP copy, and basic-attack on mouse and touch
CATEGORY: touch-mouse-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/canvasFizzleOccupancyPointerParity.contracts.test.ts; WorldExploration.tsx (read-only)
CURRENT_BEHAVIOUR: Click and touch already share `"Not enough AP"`, `"Occupied"`, `"✦ FIZZLED! ✦"`, `playSound("spell_cast", "fizzle")`, `challengeDirectHitRef.current = false`, `markFirstAction()`, `physical_attack` fallback, WORLD_GRID_SIZE bounds, world wall/void walk, and geometry overlay. #795 locks decide tables and the 400ms window; #935 locks summon-control helpers; #1010 locks walk/AP/portal/execute helpers; #1068 locks inspect/live-cast helpers; #1125 locks leftover AP/MP debit; #1194 locks occupancy/hazard/portal/sprite pad; #1245 locks recap/death/execute and dual ghost-click refs.
DESIRED_BEHAVIOUR: Mouse and touch keep calling the same fizzle / occupancy / leftover-AP / basic-attack helpers so a later WX edit cannot let a finger occupy a live tile, skip the fizzle float, or miss the physical_attack fallback the mouse uses. Keep 10 vs 14 sprite pads (MAA-010).
EVIDENCE: handleCanvasClick ~10009–10700 and handleCanvasTouch ~10705–11230 each contain the listed helpers.
RECOMMENDED_ACTION: Keep the source contract. Do not copy `shouldIgnoreCanvasTouchEndUnlessSingleFinger` (#645). Do not unify 10 vs 14 sprite pad (MAA-010).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — test-only; no execute change.
VALIDATION_REQUIRED: node --test canvasFizzleOccupancyPointerParity.contracts.test.ts.
STATUS: IMPLEMENTED

---

## Queued in older still-open PRs (do not restack)

Sonner HUD inset / Chart tooltip dvh: **#1245** (MAA-2026-10-28-001..003).
HoverCard / Tooltip / Dropdown / Context overscroll: **#1194** (MAA-2026-10-27-001..003) plus walk-hazard contract (MAA-2026-10-27-004).
Collapsible / ScrollBar / Popover / Table / SidebarRail 44px: **#1125** (MAA-2026-10-26-001..005) plus AP/MP debit contract (MAA-2026-10-26-006).
ToggleGroup / Breadcrumb / Resizable / Drawer 44px: **#1068** (MAA-2026-10-25-001..004) plus inspect/live-cast contract (MAA-2026-10-25-005).
Toggle / Accordion / Command / Nav / Menubar 44px: **#1010** (MAA-2026-10-24-001..005) plus walk/cast contract (MAA-2026-10-24-006).
Input / Select default / Tabs / OTP 44px: **#935** (MAA-2026-10-23-001..004) plus summon-control contract (MAA-2026-10-23-005).
Button default/lg/icon + carousel + pagination 44px: **#895** (MAA-2026-10-22-001..003).
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
GameKey admin Escape / backdrop: **#492**.
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
EVIDENCE: GameFlow.tsx tools overlay; WorldExploration Stats panel defaultFolded false.
RECOMMENDED_ACTION: Human-approved responsive layout. Do not restack GameFlow / WorldExploration.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — HUD geometry.
VALIDATION_REQUIRED: 390×844 portrait and landscape; spawn tile stays tappable.
STATUS: NEW

---

ACTION_ID: MAA-007
TITLE: Battle spell dock is not a sticky bottom bar on phones
CATEGORY: sticky-controls
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Spell cards sit in the right/bottom HUD flow. DESIGN.md wants the bottom menu stuck to the viewport. #335 owns the file.
DESIRED_BEHAVIOUR: On viewports <768px, spell/End Turn/Attack Nearest dock to the bottom safe-area without covering the selected tile.
EVIDENCE: BattleUIPanel layout; DESIGN.md “bottom menu sticks to viewport”.
RECOMMENDED_ACTION: Wait for #335. Larger than this audit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — battle chrome.
VALIDATION_REQUIRED: 390px width in-battle; End Turn remains ≥44px and unobscured by the home indicator.
STATUS: NEW

---

ACTION_ID: MAA-008
TITLE: Spell details and kit HoverCard/Tooltip depend on hover
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx; src/frontend/src/components/ui/tooltip.tsx; hover-card.tsx; chart.tsx
CURRENT_BEHAVIOUR: Spell cards expose range/cost through title=/hover. shadcn Tooltip, HoverCard, and Chart tooltip open on pointer hover. Touch has no equivalent sheet. #1194/#1245 only capped overlay height.
DESIRED_BEHAVIOUR: Long-press or tap-hold inspect that uses the same spell metadata as mouse hover. Do not infer from names.
EVIDENCE: BattleUIPanel spell title attributes; tooltip.tsx / hover-card.tsx / chart.tsx hover-open primitives.
RECOMMENDED_ACTION: Human-approved tap sheet. Do not restack BattleUIPanel.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — extra inspect UI.
VALIDATION_REQUIRED: Phone: tap a spell slot shows the same range/cost as desktop hover.
STATUS: NEW

---

ACTION_ID: MAA-009
TITLE: No long-press inspect on sprites
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx canvas handlers
CURRENT_BEHAVIOUR: Inspect is tap-without-spell (touch) or click-without-spell (mouse) on a sprite. There is no long-press. #645 centers the card when popupAnchor is missing.
DESIRED_BEHAVIOUR: Optional long-press inspect that does not cast. Must share decideSpriteCastClick so a long-press cannot fire a legal cast the mouse would reject.
EVIDENCE: handleCanvasTouch has no touchstart duration branch.
RECOMMENDED_ACTION: Human-approved. Wait for WX owners.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — can steal taps from casts.
VALIDATION_REQUIRED: Long-press inspects; short tap with a spell still casts only when live-legal.
STATUS: NEW

---

ACTION_ID: MAA-010
TITLE: Sprite hit padding is 10px mouse / 14px touch
CATEGORY: touch-mouse-parity
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx hitTestSprite calls
CURRENT_BEHAVIOUR: Mouse uses 10px pad; touch uses 14px. Locked in #795 / #1194 contracts so they cannot invert. Unifying them would change which sprite a finger vs a cursor selects.
DESIRED_BEHAVIOUR: Keep the split unless a targeting owner signs off on one pad.
EVIDENCE: hitTestSprite(..., 10) in click; hitTestSprite(..., 14) in touch.
RECOMMENDED_ACTION: Do not unify. Targeting owner only.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH if unified without a targeting owner.
VALIDATION_REQUIRED: Adjacent sprites: mouse and touch still pick the intended unit.
STATUS: NEW

---

ACTION_ID: MAA-011
TITLE: Landscape phones keep MOBILE_ZOOM and dual HUD
CATEGORY: viewport-scaling
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx camera / MOBILE_ZOOM; GameFlow.tsx; hooks/use-mobile.tsx
CURRENT_BEHAVIOUR: `useIsMobile` is `innerWidth < 768`. A landscape phone often becomes desktop tiles and still keeps the top tools strip. #447 owns use-mobile.tsx.
DESIRED_BEHAVIOUR: Landscape uses a dedicated inset so the isometric board is playable without covering spawn. Treat coarse pointers / hover:none as mobile for zoom, or use a min(width,height) breakpoint.
EVIDENCE: MOBILE_ZOOM path in WorldExploration; tools overlay in GameFlow; use-mobile.tsx.
RECOMMENDED_ACTION: Human-approved camera/HUD change. Do not restack WX/GameFlow.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — camera.
VALIDATION_REQUIRED: 844×390 landscape; spawn and a portal remain tappable.
STATUS: NEW

---

ACTION_ID: MAA-012
TITLE: Canvas hover preview has no touch analog
CATEGORY: hover-only
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx handleCanvasMouseMove
CURRENT_BEHAVIOUR: Mouse move previews walk/cast tiles. Touch has no equivalent until lift, which then commits.
DESIRED_BEHAVIOUR: Optional finger-drag preview that does not walk until touchend, sharing the same legality helpers.
EVIDENCE: onMouseMove={handleCanvasMouseMove}; no onTouchMove preview.
RECOMMENDED_ACTION: Human-approved. Must not walk on touchmove.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — drag-to-preview can look like a walk.
VALIDATION_REQUIRED: Finger drag highlights; lift on an illegal tile does not spend AP/MP.
STATUS: NEW

---

ACTION_ID: MAA-013
TITLE: Some status chips rely on color plus a short glyph
CATEGORY: contrast
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: StatusEffectBadge.tsx; InitiativeStrip.tsx
CURRENT_BEHAVIOUR: Badges include text labels (buff/dot copy). HP chips in the initiative strip are still color-forward. #335 / #471 own those files on older PRs.
DESIRED_BEHAVIOUR: DESIGN.md: status badges always show color + text. Keep numeric HP.
EVIDENCE: StatusEffectBadge has label + turns; some chips are title=-only.
RECOMMENDED_ACTION: Wait for #335/#471. Do not restack those files.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Color-blind simulation still reads buff vs dot vs HP.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-001
TITLE: Leaderboard overlay missing Escape
CATEGORY: keyboard-focus
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx
CURRENT_BEHAVIOUR: Leaderboard is an inline overlay. #335 adds Escape. Do not extract the modal (modify/delete conflict).
DESIRED_BEHAVIOUR: Escape dismisses; focus returns to the opener.
EVIDENCE: GameFlow leaderboard overlay. Older combat PRs own the file from #335.
RECOMMENDED_ACTION: Wait for #335.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Escape closes leaderboard; canvas is not focused into a walk.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-005
TITLE: Zone-lock dialog missing Escape
CATEGORY: keyboard-focus
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx / WorldExploration zone-lock overlay
CURRENT_BEHAVIOUR: Recap dialog gained Escape (#693). Zone-lock is a separate overlay without subscribeEscapeToDismiss.
DESIRED_BEHAVIOUR: Escape dismisses zone-lock the same way as other stone overlays.
EVIDENCE: Zone-lock overlay in GameFlow/WX. Owners from #335/#327.
RECOMMENDED_ACTION: Wait for owners. Copy subscribeEscapeToDismiss identically from #425.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Escape closes zone-lock; does not end the player turn.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-006
TITLE: Zone-lock overlay ignores safe-area
CATEGORY: safe-areas
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx zone-lock
CURRENT_BEHAVIOUR: Full-screen lock copy can sit under the notch / home indicator.
DESIRED_BEHAVIOUR: Padding uses --app-safe-* / env(safe-area-inset-*).
EVIDENCE: Zone-lock overlay styles without safe-area tokens.
RECOMMENDED_ACTION: Wait for GameFlow owners.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Notched phone; Continue/OK remains tappable.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-007
TITLE: Rename pencil is below 44px
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx / WorldExploration rename control
CURRENT_BEHAVIOUR: Pencil is a compact icon. Recap is pointer-events none so rename stays live.
DESIRED_BEHAVIOUR: minHeight 44 / stone-touch-target on phones.
EVIDENCE: stats.rename_button. #327/#335 own the files.
RECOMMENDED_ACTION: Wait for owners.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: 390px width; pencil measures ≥44px.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-008
TITLE: Rename modal missing Escape
CATEGORY: keyboard-focus
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx rename overlay
CURRENT_BEHAVIOUR: Rename uses a custom overlay. Escape is not subscribed.
DESIRED_BEHAVIOUR: Escape cancels without saving; copy subscribeEscapeToDismiss from #425.
EVIDENCE: stats.rename_modal. WX owned from #327.
RECOMMENDED_ACTION: Wait for WX owners.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Escape cancels; name is unchanged.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-009
TITLE: Canvas touch handler missing click-path deps
CATEGORY: touch-mouse-parity
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: WorldExploration.tsx handleCanvasTouch dependency array
CURRENT_BEHAVIOUR: Click and touch callbacks can drift if a later WX edit adds a helper to one array only. Current HEAD shares the combat helpers this contract locks.
DESIRED_BEHAVIOUR: Keep both arrays in sync when WX is next edited.
EVIDENCE: handleCanvasTouch deps ~11211–11229 vs handleCanvasClick deps above.
RECOMMENDED_ACTION: Wait for a WX owner. Do not restack the file from this audit.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if a dep is dropped.
VALIDATION_REQUIRED: After the next WX edit, both handlers still call the shared helpers.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-010
TITLE: Canvas is tabbable with onKeyDown undefined
CATEGORY: keyboard-focus
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx canvas
CURRENT_BEHAVIOUR: tabIndex={0} with onKeyDown={undefined}. Screen-reader name exists (aria-label). Keyboard cannot walk/cast from the canvas; Attack Nearest is the S hotkey on window.
DESIRED_BEHAVIOUR: Either handle arrow/Enter via the same legality helpers, or remove tabIndex if the canvas is pointer-only. Do not fork mouse vs keyboard legality.
EVIDENCE: WorldExploration.tsx canvas ~17876–17882.
RECOMMENDED_ACTION: Wait for WX owners. HUMAN_APPROVAL — keyboard combat is a new input path.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — new keyboard combat path.
VALIDATION_REQUIRED: Tab to canvas; keys do not spend AP unless the same live gates pass.
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
EVIDENCE: BattleUIPanel.tsx Attack title. Older combat PRs own the file from #335.
RECOMMENDED_ACTION: Wait for #335.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After #335, AT names Attack Nearest; Attack title has no “click”.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-25-001
TITLE: World canvas lacks a named region beyond the aria-label
CATEGORY: keyboard-focus
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: WorldExploration.tsx; GameFlow.tsx
CURRENT_BEHAVIOUR: Canvas has aria-label="World exploration canvas". Surrounding HUD is a pile of fixed overlays without a landmark.
DESIRED_BEHAVIOUR: Keep the canvas label; add landmarks on HUD when those files are free.
EVIDENCE: canvas aria-label ~17882.
RECOMMENDED_ACTION: Wait for GameFlow/WX.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Screen reader lands on a named canvas.
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
CURRENT_BEHAVIOUR: This run froze Skeleton pulse and Progress fill (MAA-2026-10-29-003). Starfield, trophy pulse, and HUD CSS loops still run. Combat floaters are canvas-drawn, not CSS. index.css owned by #339+; Starfield by #511/#740; AchievementToast by #526.
DESIRED_BEHAVIOUR: Pause or freeze decorative loops when the user requests reduced motion. Do not skip combat floaters that convey damage.
EVIDENCE: No @media (prefers-reduced-motion: reduce) in index.css / Starfield / AchievementToast.
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
CURRENT_BEHAVIOUR: Size sm stays h-8 (32px) after #895. Switch is 1.15rem. Checkbox is size-4. Toggle default/lg now 44px (MAA-2026-10-24-001). ToggleGroup default/lg now 44px (MAA-2026-10-25-001). Select default trigger is 44px (#935). None of the remaining primitives are wired in player chrome today.
DESIRED_BEHAVIOUR: If those primitives are wired for players, raise to ≥44px or wrap in a 44px label. Do not enlarge checkbox/switch visuals without a layout owner (looks like a redesign).
EVIDENCE: button.tsx sm; switch.tsx h-[1.15rem]; checkbox.tsx size-4.
RECOMMENDED_ACTION: Report-only until a player surface uses them.
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
CURRENT_BEHAVIOUR: SidebarTrigger passes `size-7` on Button (28px). SidebarInput passes `h-8` on Input, which fights #935’s Input 44px floor. Menu buttons default to h-8. Sidebar is unused in player chrome. SidebarRail hit slop is now 44px (MAA-2026-10-26-005).
DESIRED_BEHAVIOUR: Trigger and search field ≥44px if Sidebar is ever wired. Do not restyle the whole icon-collapsed rail without a layout owner.
EVIDENCE: sidebar.tsx SidebarTrigger `size-7`; SidebarInput `h-8`.
RECOMMENDED_ACTION: Report-only until Sidebar ships.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: If Sidebar is adopted, measure Trigger and Input including labels.
STATUS: NEW

---

ACTION_ID: MAA-2026-10-23-007
TITLE: Dropdown/context/command items and Calendar cells sit below 44px
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/dropdown-menu.tsx; context-menu.tsx; command.tsx CommandItem; calendar.tsx
CURRENT_BEHAVIOUR: Menu items use py-1.5. Calendar `--cell-size: --spacing(8)` (32px). BreadcrumbLink/Ellipsis are now 44px (MAA-2026-10-25-002). NavigationMenu trigger and Menubar bar/triggers are 44px (#1010). #1194 added overscroll-contain on dropdown/context content; rows stay compact. Unused in player chrome.
DESIRED_BEHAVIOUR: If those primitives are wired for players, raise interactive rows to ≥44px. 44px menu rows can make long lists tall — needs a layout owner, not this audit.
EVIDENCE: DropdownMenuItem `py-1.5`; calendar `[--cell-size:--spacing(8)]`.
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
CURRENT_BEHAVIOUR: Radio is size-4. Slider thumb is size-4. Unused in player chrome. Enlarging the glyph looks like a redesign (same reason as Checkbox/Switch). Slider Root already has `touch-none`.
DESIRED_BEHAVIOUR: Wrap in a 44px hit area / label without growing the 16px glyph, if a player surface uses them.
EVIDENCE: RadioGroupItem `size-4`; Slider Thumb `size-4`.
RECOMMENDED_ACTION: Report-only with MAA-2026-10-22-004.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Measure label+control hit area, not just the glyph.
STATUS: NEW

---

ACTION_ID: MAA-2026-10-29-006
TITLE: Label and FormLabel stay compact (no 44px floor)
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/label.tsx; form.tsx FormLabel
CURRENT_BEHAVIOUR: Label is `text-sm leading-none` with no min-height. FormLabel wraps it. Unused in player chrome. Raising every label to 44px would pad every form row.
DESIRED_BEHAVIOUR: If a player form uses Label as the hit target for a 16px checkbox/radio, wrap the control in a 44px label. Do not set min-h-[44px] on Label itself from this audit.
EVIDENCE: label.tsx has no min-h; FormLabel only tints on error.
RECOMMENDED_ACTION: Report-only. Pair with Checkbox/Switch (MAA-2026-10-22-004) when a player form ships.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if every label becomes 44px.
VALIDATION_REQUIRED: Measure label+control together, not the text line alone.
STATUS: NEW

---

ACTION_ID: MAA-2026-10-29-007
TITLE: Touch sprite-hit path skips recordClickOutcome that mouse records
CATEGORY: touch-mouse-parity
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx handleCanvasTouch sprite branch
CURRENT_BEHAVIOUR: Mouse sprite inspect/reject/execute calls `recordClickOutcome` (debug-only trace). Touch sprite inspect/reject/execute returns without it. Gameplay legality (decideSpriteCastClick / executeCastAttempt) is already shared. World-move `recordClickOutcome("move")` is on both paths.
DESIRED_BEHAVIOUR: If the debug trace should cover phones, call the same recorder from the touch sprite branch. Do not change execute.
EVIDENCE: click ~10177/10204/10254 recordClickOutcome; touch sprite branch ~10861–10913 has no recorder.
RECOMMENDED_ACTION: Wait for a WX owner. Debug-only; not a legality fork.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After wiring, a legal touch sprite cast still spends the same AP as mouse.
STATUS: NEW

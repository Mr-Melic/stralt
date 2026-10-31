# ACTION_IDs — 2026-10-31 Mobile / Touch / Accessibility Auditor

Reuse prior IDs when the finding is the same. `DESIGN.md` was not edited.

Combat on `origin/main` still shares live gates (`decideSpriteCastClick` /
`decideTileCastClick`), stamps both ghost-click refs at the start of
`handleCanvasTouch`, calls `preventDefault` first, and uses a **400ms**
synthetic-click window (`pointerParity.ts` `SYNTHETIC_CLICK_GUARD_MS` ===
`pointerGesture.ts` `SYNTHETIC_CLICK_SUPPRESS_MS`). Mouse sprite pad is 10px;
touch sprite pad is 14px (MAA-010 — do not unify). Recap ignore, death/HP
guard, summon-control route, live-cast entry, execute, occupancy, walk-block,
hazard debit, portal block, leftover-AP clear, self-heal challenge, AP reject
copy, Occupied copy, fizzle float + sound, `physical_attack` fallback,
wait-for-turn, select-spell, Can't-reach / Not-enough-MP, and world wall/void
walk are the same on both pointer paths. This run did **not** change execute
math, RAF, or WorldExploration.

Did **not** edit WorldExploration, GameFlow, BattleUIPanel, index.css,
ChallengePanel, CharacterSelection, CharacterCreation, Settings, Spellbook,
ChatPanel, BuffShop, DokaGameKeyShop, App.tsx, PostBattleRecap, LandingPage,
StarfieldBackground, ProfileSetup, GameOverModal, DraggablePanel, dialog,
sheet, alert-dialog, button, carousel, pagination, input, select, tabs,
input-otp, toggle, accordion, command, navigation-menu, menubar, toggle-group,
breadcrumb, resizable, drawer, collapsible, scroll-area, popover, table,
sidebar, hover-card, dropdown-menu, context-menu, tooltip, calendar, label,
sonner, chart, textarea, alert, skeleton, progress, form, shopDialogDismiss,
pointerParity, pointerGesture, StatPopup, SummonControlPanel, EnemyRegister,
BossGuideModal, AchievementToast, MapModifiersPanel, AdminGameKeyPurchases,
AdminDashboard, BoostToggle, InitiativeStrip, StatusEffectBadge, or index.html.
Those stay with older still-open PRs (WX from #327, #335 GameFlow/BattleUI,
#372/#364 ChallengePanel/CharacterCreation/ProfileSetup, #421 GameOverModal,
#425/#471/#526 overlays, #429 DraggablePanel, #492 GameKey admin Escape,
#511/#740 starfield/landing/dialog max-width, #645 inspect/pointerParity
helper, #693 recap, #795 document chrome, #822 Dialog/Sheet Close, #853
AlertDialog Action/Cancel, #895 Button/carousel/pagination 44px, #935
Input/Select/Tabs/OTP 44px, #1010 Toggle/Accordion/Command/Nav/Menubar 44px,
#1068 ToggleGroup/Breadcrumb/Resizable/Drawer 44px, #1125
Collapsible/ScrollBar/Popover/Table/SidebarRail, #1194
HoverCard/Tooltip/Dropdown/Context overscroll, #1245 Sonner HUD inset /
Chart tooltip dvh, #1296 Textarea/Alert/Skeleton/Progress/Form).

`ui/checkbox.tsx`, `ui/switch.tsx`, `ui/radio-group.tsx`, `ui/slider.tsx`, and
`ui/badge.tsx` had no older owner. None of those primitives are wired in player
chrome today. Size `sm` buttons, SidebarTrigger, SidebarInput, Label/FormLabel,
and dense dropdown/calendar/menu rows stay compact (MAA-2026-10-22-004 sm /
MAA-2026-10-23-006..007 / MAA-2026-10-29-006). Glyph visuals stay 16px; only
the hit slop grew.

---

## Implemented this run (display / a11y / contract tests only)

ACTION_ID: MAA-2026-10-22-004
TITLE: shadcn Switch and Checkbox stay below 44px
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/switch.tsx; checkbox.tsx; src/frontend/src/utils/glyphHitSlop.contracts.test.ts
CURRENT_BEHAVIOUR: Checkbox was size-4 (16px). Switch was h-[1.15rem] w-8. Size sm buttons stay h-8 with #895. Unused in player chrome.
DESIRED_BEHAVIOUR: Keep the 16px / 1.15rem glyphs. Expand the clickable area to 44px via a centered after:size-11 slop (same pattern as #1068 ResizableHandle). Add touch-manipulation. Do not set min-h-[44px] on the glyph.
EVIDENCE: checkbox.tsx size-4; switch.tsx h-[1.15rem] w-8 before this run had no after:size-11.
RECOMMENDED_ACTION: Keep the hit slop. Do not restack button.tsx size sm (#895). Do not enlarge the visual.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — unused in live HUD; layout box unchanged.
VALIDATION_REQUIRED: node --test glyphHitSlop.contracts.test.ts; glyph still 16px; hit area 44px.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-10-23-008
TITLE: RadioGroupItem and Slider thumb are 16px visuals
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/radio-group.tsx; slider.tsx; src/frontend/src/utils/glyphHitSlop.contracts.test.ts
CURRENT_BEHAVIOUR: Radio was size-4. Slider thumb was size-4. Slider Root already had touch-none. Unused in player chrome.
DESIRED_BEHAVIOUR: Keep the 16px glyphs. Expand the clickable area to 44px via after:size-11. Radio also gets touch-manipulation.
EVIDENCE: RadioGroupItem size-4; Slider Thumb size-4 before this run had no after:size-11.
RECOMMENDED_ACTION: Keep the hit slop. Do not restack calendar.tsx rows (MAA-2026-10-23-007).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — unused in live HUD; layout box unchanged.
VALIDATION_REQUIRED: node --test glyphHitSlop.contracts.test.ts.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-10-31-001
TITLE: Interactive Badge links and buttons sit below 44px
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/badge.tsx; src/frontend/src/utils/glyphHitSlop.contracts.test.ts
CURRENT_BEHAVIOUR: Badge is a compact pill (px-2 py-0.5 text-xs). Span badges stay compact. When asChild renders an a or button, the hit area was the pill, not 44px. Unused in player chrome (status chips are StatusEffectBadge).
DESIRED_BEHAVIOUR: [a&] and [button&] get min-h-11 min-w-11 and touch-manipulation. Plain span badges stay compact (DESIGN.md 10px pill).
EVIDENCE: badgeVariants base string had no [a&]:min-h-11 before this run.
RECOMMENDED_ACTION: Keep the interactive-only floor. Do not min-h-11 every status pill.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — unused in live HUD; span badges unchanged.
VALIDATION_REQUIRED: node --test glyphHitSlop.contracts.test.ts.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-10-31-002
TITLE: Lock sprite/tile decide tables, wait-for-turn, and summon-control on mouse and touch
CATEGORY: touch-mouse-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/canvasSpriteTileDecisionPointerParity.contracts.test.ts; WorldExploration.tsx (read-only)
CURRENT_BEHAVIOUR: Click and touch already share shouldRouteCanvasToSummonControl, decideSpriteCastClick, decideTileCastClick, WAIT_FOR_TURN_COPY, SELECT_SPELL_COPY, playerFacingRejectReason / CastResult, executeCastAttempt, Can't reach, Not enough MP, shouldRejectCastForMissingAp, shouldClearSpellAfterApSpend, classifyWalkReject, applyBattleWalkHazards, shouldAllowPlayerCastEntry, and probeLiveCast. Mouse pad 10 / touch pad 14 stays split (MAA-010).
DESIRED_BEHAVIOUR: Mouse and touch keep calling the same decide tables so a later WX edit cannot let a finger skip wait-for-turn, select-spell, or summon-control walk/cast the mouse uses. Keep 10 vs 14 sprite pads.
EVIDENCE: handleCanvasClick ~10009–10700 and handleCanvasTouch ~10705–11230 each contain the listed helpers.
RECOMMENDED_ACTION: Keep the source contract. Do not copy shouldIgnoreCanvasTouchEndUnlessSingleFinger (#645). Do not unify 10 vs 14 sprite pad (MAA-010).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — test-only; no execute change.
VALIDATION_REQUIRED: node --test canvasSpriteTileDecisionPointerParity.contracts.test.ts.
STATUS: IMPLEMENTED

---

## Queued in older still-open PRs (do not restack)

Textarea / Alert / Skeleton / Progress / FormMessage: **#1296** (MAA-2026-10-29-001..005).
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

Larger HUD / combat-chrome items (MAA-006 dual HUD, MAA-007 sticky battle dock,
MAA-008 hover-only spell sheet, MAA-009 long-press inspect, MAA-011 landscape
MOBILE_ZOOM, MAA-012 hover preview, MAA-010 sprite pad split, MAA-013 color-only
chips, Escape/safe-area/rename/canvas-tabIndex, Chat tabs, two-finger lift,
inspect popupAnchor, debug-during-guard, reduced-motion loops, Button sm,
SidebarTrigger, calendar/menu rows, Label compact, recordClickOutcome on touch)
stay report-only in the 2026-10-29 ledger. This run does not restack those
owned files. New compact leftovers:

ACTION_ID: MAA-2026-10-22-004-sm
TITLE: shadcn Button size sm stays 32px
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/button.tsx size sm
CURRENT_BEHAVIOUR: Size sm stays h-8 (32px) after #895. Default/lg/icon become 44px in that PR. Unused in player chrome (game chrome uses stone-btn).
DESIRED_BEHAVIOUR: If size sm is wired for players, wrap in a 44px hit area or stop using sm on phones. Do not restack button.tsx.
EVIDENCE: button.tsx sm: h-8. #895 owns the file.
RECOMMENDED_ACTION: Wait for #895. Report-only.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: If a HUD uses size=sm, measure the hit area including padding.
STATUS: NEW

---

ACTION_ID: MAA-2026-10-23-006
TITLE: SidebarTrigger is size-7 (28px) and SidebarInput forces h-8
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/sidebar.tsx
CURRENT_BEHAVIOUR: SidebarTrigger passes size-7 on Button (28px). SidebarInput passes h-8 on Input. Sidebar is unused in player chrome. SidebarRail hit slop is 44px in #1125.
DESIRED_BEHAVIOUR: Trigger and search field ≥44px if Sidebar is ever wired.
EVIDENCE: sidebar.tsx SidebarTrigger size-7; SidebarInput h-8.
RECOMMENDED_ACTION: Report-only until Sidebar ships. Do not restack #1125.
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
CURRENT_BEHAVIOUR: Menu items use py-1.5. Calendar --cell-size: --spacing(8) (32px). #1194 added overscroll-contain on dropdown/context content; rows stay compact. Unused in player chrome.
DESIRED_BEHAVIOUR: If those primitives are wired for players, raise interactive rows to ≥44px. 44px menu rows / 44px calendar cells need a layout owner.
EVIDENCE: DropdownMenuItem py-1.5; calendar [--cell-size:--spacing(8)].
RECOMMENDED_ACTION: Report-only. Do not enlarge every menu row from this audit.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if menu lists grow on phones.
VALIDATION_REQUIRED: If a HUD menu uses these, measure each row at 390px width.
STATUS: NEW

---

ACTION_ID: MAA-2026-10-29-006
TITLE: Label and FormLabel stay compact (no 44px floor)
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/label.tsx; form.tsx FormLabel
CURRENT_BEHAVIOUR: Label is text-sm leading-none with no min-height. FormLabel wraps it. Unused in player chrome. Raising every label to 44px would pad every form row.
DESIRED_BEHAVIOUR: If a player form uses Label as the hit target for a 16px checkbox/radio, wrap the control in a 44px label. Do not set min-h-[44px] on Label itself. Checkbox/Radio now have their own 44px slop (MAA-2026-10-22-004 / 008).
EVIDENCE: label.tsx has no min-h; FormLabel only tints on error. #1296 owns form.tsx.
RECOMMENDED_ACTION: Report-only. Do not restack form.tsx / label.tsx.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if every label becomes 44px.
VALIDATION_REQUIRED: Measure label+control together, not the text line alone.
STATUS: NEW

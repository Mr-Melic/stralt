# ACTION_IDs — 2026-09-28 Mobile / Touch / Accessibility Auditor

Reuse prior IDs when the finding is the same. `DESIGN.md` was not edited.

Combat on `origin/main` already shares live gates (`decideSpriteCastClick` /
`decideTileCastClick`), stamps both ghost-click refs at the start of
`handleCanvasTouch`, calls `preventDefault` first, and uses a **400ms**
synthetic-click window (`pointerParity.ts` `SYNTHETIC_CLICK_GUARD_MS` ===
`pointerGesture.ts` `SYNTHETIC_CLICK_SUPPRESS_MS`). No combat legality fork
this run.

Did **not** edit WorldExploration, GameFlow, BattleUIPanel, index.css,
ChallengePanel, CharacterSelection, Settings, Spellbook, ChatPanel, BuffShop,
DokaGameKeyShop, App.tsx, PostBattleRecap, alert-dialog, or shopDialogDismiss.
Those files stay with older still-open PRs (#327/#331, #335, #368 ads vs this
landing hunk, #425/#471/#526, #511 resize internals vs this starfield return,
#643, #645, #687 chessDrift vs this landing hunk, #693 recap/alert-dialog).

LandingPage hunks this run (SkateStyleTitle return, Sign In minHeight, root
safe-area padding) are disjoint from #368 (https ads) and #687 (chessDrift
layer). Starfield return wrap is disjoint from #511 (backing/resize helpers
inside `useEffect`). `ui/dialog.tsx` is unowned; the max-width string matches
#693's `alert-dialog.tsx` so the pair stays consistent after merge.

---

## Implemented this run (display / a11y only)

```
ACTION_ID: MAA-2026-09-28-001
TITLE: Landing logo canvas had no accessible name
CATEGORY: keyboard-focus
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/LandingPage.tsx
CURRENT_BEHAVIOUR: SkateStyleTitle rendered an unlabeled <canvas> in the page a11y tree. The visible heading on the card is h2 “Enter the Realm”.
DESIRED_BEHAVIOUR: Decorative canvas is aria-hidden on a non-focusable wrapper (Biome noAriaHiddenOnFocusable treats canvas as focusable). An sr-only h1 names ÆSTRALTØ.
EVIDENCE: LandingPage.tsx SkateStyleTitle return — h1.sr-only plus aria-hidden wrapper around the canvas. landingChrome.test.ts.
RECOMMENDED_ACTION: Keep the wrapper; do not put aria-hidden on the canvas node.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — decorative logo only; Sign In still authenticates.
VALIDATION_REQUIRED: pnpm check; AT announces ÆSTRALTØ then Enter the Realm; Sign In still opens Internet Identity.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-28-002
TITLE: Landing Sign In was below the 44px mobile floor
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/LandingPage.tsx
CURRENT_BEHAVIOUR: Sign In used padding 14px 24px and fontSize 15 with no minHeight and no stone-touch-target. DESIGN.md requires interactive targets ≥44px on mobile. The 768px CSS rule does not include stone-btn-crimson.
DESIRED_BEHAVIOUR: minHeight 44 always plus stone-touch-target so ≤768px also gets min-width 44. Gradient / hover lift unchanged.
EVIDENCE: landing.login_button style minHeight: 44 and className stone-touch-target. landingChrome.test.ts.
RECOMMENDED_ACTION: Keep minHeight 44. Do not restyle the crimson gradient.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — full-width CTA.
VALIDATION_REQUIRED: At 390px width Sign In measures ≥44px; login still calls Internet Identity.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-28-003
TITLE: Landing chrome ignored notch and home-indicator insets
CATEGORY: safe-areas
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/LandingPage.tsx
CURRENT_BEHAVIOUR: Root used overflow hidden with no env(safe-area-inset-*). Title, Sign In, and footer could sit under the notch or home indicator. ProfileSetup already uses the 24px+env contract.
DESIRED_BEHAVIOUR: Root padding max(16px, env(safe-area-inset-*)) on all four sides, matching changelog / SmallScreenGuard density.
EVIDENCE: LandingPage root style padding env(safe-area-inset-*). Disjoint from #368 ads and #687 chessDrift.
RECOMMENDED_ACTION: Keep the padding. Do not add a second footer bottom inset (absolute footer is inside the padded box).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — layout inset only.
VALIDATION_REQUIRED: Notched iPhone portrait and landscape; Sign In remains tappable; ads still wrap.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-27-005
TITLE: Decorative starfield canvas is hidden from AT
CATEGORY: accessibility
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/StarfieldBackground.tsx
CURRENT_BEHAVIOUR: Landing starfield <canvas> sat in the accessibility tree with no name. Putting aria-hidden on the canvas fails Biome noAriaHiddenOnFocusable.
DESIRED_BEHAVIOUR: Non-focusable wrapper with aria-hidden="true"; canvas fills the wrapper (h-full w-full) so #511 clientWidth resize still sees the viewport.
EVIDENCE: StarfieldBackground return wrap. #511 only edits useEffect backing helpers, not the return JSX. landingChrome.test.ts.
RECOMMENDED_ACTION: Keep aria-hidden on the wrapper, never on the canvas. Union with #511 internals.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — pointer-events-none preserved; z-index 1 preserved.
VALIDATION_REQUIRED: pnpm check; landing starfield still fills the viewport; enter world, starfield still pauses.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-28-004
TITLE: DialogContent max-width subtracts horizontal safe-area
CATEGORY: safe-areas
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ui/dialog.tsx
CURRENT_BEHAVIOUR: max-w-[calc(100%-2rem)] could sit under left/right notches on landscape phones. #693 already applies the same calc to AlertDialogContent (Game Over).
DESIRED_BEHAVIOUR: max-w includes env(safe-area-inset-left/right). sm:max-w-lg unchanged.
EVIDENCE: dialog.tsx DialogContent className calc(100%-2rem-env(safe-area-inset-left)-env(safe-area-inset-right)). landingChrome.test.ts.
RECOMMENDED_ACTION: Keep the string identical to #693 alert-dialog. Do not restack alert-dialog while #693 is queued.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — width cap only.
VALIDATION_REQUIRED: Landscape notched phone; shadcn Dialog still centers; Game Over still uses alert-dialog (#693).
STATUS: NEW
```

---

## Human approval / report-only (stable IDs)

```
ACTION_ID: MAA-006
TITLE: Dual HUD crowding — realm tools and Stats overlay the canvas on phones
CATEGORY: hud-overlap
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: GameFlow no longer draws a second opaque top bar, but Items/Board/Feats/Bosses sit at calc(var(--app-top-hud-height) + 2px) over the map. Stats defaults unfolded. WX HUD packs name, XP, Doka, region, Center, Enemies on one 44px row.
DESIRED_BEHAVIOUR: One phone chrome row; canvas inset matches live HUD; tools do not cover tiles.
EVIDENCE: GameFlow tools cluster; WX HUD flex row. Both files owned by older open PRs.
RECOMMENDED_ACTION: Human-approved merge of HUD + tools. Do not auto-redesign.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — layout + shop/doka chrome.
VALIDATION_REQUIRED: Portrait and landscape; Center and Enemies reachable; canvas not under chrome.
STATUS: NEW
```

```
ACTION_ID: MAA-007
TITLE: Battle footer is a saved DraggablePanel, not a sticky viewport dock
CATEGORY: sticky-battle-controls
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx; src/frontend/src/components/DraggablePanel.tsx
CURRENT_BEHAVIOUR: Default y is innerHeight-220 and persists in uiLayout. Short landscape can cover the map or sit off-screen. SummonControlPanel is already a bottom-safe dock; the player bar is not. DESIGN.md line 74.
EVIDENCE: BattleUIPanel.tsx defaultPosition ~197–200.
DESIRED_BEHAVIOUR: On narrow viewports, pin spells/actions to the bottom safe-area and disable drag, or offer a docked mobile layout.
RECOMMENDED_ACTION: Design a docked mobile battle chrome. Do not auto-implement.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — persisted uiLayout.
VALIDATION_REQUIRED: Portrait and landscape battle; controls remain visible after rotate.
STATUS: NEW
```

```
ACTION_ID: MAA-008
TITLE: Spell and status details are hover-only title tooltips
CATEGORY: hover-only
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx; StatusEffectBadge.tsx; SpellbookModal.tsx; InitiativeStrip.tsx
CURRENT_BEHAVIOUR: Spell slots have aria-label in later PRs; description still has no tap sheet. Touch has no hover. OS long-press tooltip is unreliable.
DESIRED_BEHAVIOUR: Tap-to-inspect or a persistent detail sheet for spells and effects.
EVIDENCE: BattleUIPanel spellTitle title=; StatusEffectBadge title= for description. #335/#471 add aria-label only.
RECOMMENDED_ACTION: Reuse StatPopup / inspect for spells and effects on tap.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Touch tap shows spell text; keyboard focus shows the same.
STATUS: NEW
```

```
ACTION_ID: MAA-009
TITLE: Forced inspect via long-press / right-click is documented but missing
CATEGORY: combat-ux
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx comments; WorldExploration.tsx
CURRENT_BEHAVIOUR: Comments say forced inspect is right-click / long-press. No contextmenu or long-press handler exists. Inspect still requires popupAnchor (#645 / MAA-2026-09-26-004).
DESIRED_BEHAVIOUR: Pointer-type-aware long-press (≥500ms) and contextmenu inspect that does not cast.
EVIDENCE: BattleUIPanel hasSelectedSpell comment ~31–32; grep found no onContextMenu / long-press in WorldExploration.
RECOMMENDED_ACTION: Wait for WX / BattleUIPanel owners. Do not steal casts. Helper shouldIgnoreCanvasTouchEndUnlessSingleFinger is unwired in #645.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — must not steal casts.
VALIDATION_REQUIRED: Spell selected + long-press opens inspect; tap still casts; 400ms ghost-click holds.
STATUS: NEW
```

```
ACTION_ID: MAA-010
TITLE: Sprite hit padding is 10px mouse vs 14px touch
CATEGORY: combat-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: hitTestSprite uses 10px on click (~10127) and 14px on touch (~10819). After a target is chosen, decideSpriteCastClick is shared, but the chosen entity can differ at the same client point.
DESIRED_BEHAVIOUR: Same padding, or a documented finger-slop policy that still prefers the front-most legal target.
EVIDENCE: handleCanvasClick hitTestSprite(..., 10); handleCanvasTouch hitTestSprite(..., 14).
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
CURRENT_BEHAVIOUR: Chip HP is a red bar with no numeric text. Initiative names are 7px. Dim labels use ~0.45 lightness / #8a8090 on navy. DESIGN.md wants Body 12px / Label 11px and status as color + text.
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
VALIDATION_REQUIRED: Escape closes; Confirm still charges 100 Doka only on success.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-21-009
TITLE: Touch canvas handler omits activeSpells and hit-test deps the mouse handler lists
CATEGORY: combat-parity
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: handleCanvasClick deps include activeSpells, hitTestSprite, combatantStoreCtx, tileCenter, logBattleEntry. handleCanvasTouch omits them. selectedSummonSpellId is in neither.
DESIRED_BEHAVIOUR: The same curated dep set on both handlers so a loadout or kit change cannot leave touch on a stale closure. Live gates stay decideSpriteCastClick / decideTileCastClick.
EVIDENCE: Click deps ~10630; touch deps ~11211. Many older PRs own WorldExploration.
RECOMMENDED_ACTION: Align the touch array with the click array after those PRs.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — callback identity / stale combat legality.
VALIDATION_REQUIRED: Change equipped spells, tap a target; touch uses the new list.
STATUS: NEW
```

```
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
```

```
ACTION_ID: MAA-2026-09-22-001
TITLE: Settings mute control is below 44px
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/SettingsPanel.tsx
CURRENT_BEHAVIOUR: Mute used padding 5px 0 with no min-height and no stone-touch-target. Open PR #425 ships stone-touch-target + minHeight 44.
DESIRED_BEHAVIOUR: Mute measures ≥44px on viewports ≤768px.
EVIDENCE: SettingsPanel mute button. Open PR #425.
RECOMMENDED_ACTION: Wait for #425.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After #425, Mute / Unmute ≥44px at 390px width.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-22-002
TITLE: Spellbook, Boss Guide, and Enemy Register ignored Escape unless the overlay node was focused
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/shopDialogDismiss.ts; SpellbookModal.tsx; BossGuideModal.tsx; EnemyRegister.tsx
CURRENT_BEHAVIOUR: Overlay onKeyDown only on this HEAD. #425 adds subscribeEscapeToDismiss.
DESIRED_BEHAVIOUR: Window keydown dismisses. Spellbook Escape cancels a pending swap first.
EVIDENCE: Open PR #425.
RECOMMENDED_ACTION: Wait; copy helper identically if a later audit needs it. Do not fork.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After #425, Escape closes those three overlays.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-22-003
TITLE: Character-select Play and Create used stone-btn-crimson without the mobile 44px class
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterSelection.tsx
CURRENT_BEHAVIOUR: Play and Create use py-2.5 on stone-btn-crimson. Open PRs #421 and #425 own this file.
DESIRED_BEHAVIOUR: stone-touch-target on those CTAs.
EVIDENCE: CharacterSelection Play / EmptySlot Create. Open PR #425.
RECOMMENDED_ACTION: Wait for #425.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After #425, Play and Create ≥44px at 390px width.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-22-004
TITLE: stone-btn-crimson and stone-btn-slate are omitted from the mobile 44px rule
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/index.css
CURRENT_BEHAVIOUR: @media (max-width: 768px) lists stone-nav-btn, stone-touch-target, stone-battle-action, .stone-top-bar button, stone-modal-close. Primary/secondary stone buttons stay at padding 8px 18px (~34–40px).
DESIRED_BEHAVIOUR: Include stone-btn-crimson and stone-btn-slate in that list, or keep adding stone-touch-target at call sites.
EVIDENCE: index.css 683–697. Open leftover-CSS PRs (#339/#423/#469/#516/#567/#634/#673) own this file.
RECOMMENDED_ACTION: Union after a CSS owner lands. Do not restack index.css in this run.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW — min-size only; may enlarge compact admin/chrome buttons.
VALIDATION_REQUIRED: After the CSS union, sample stone-btn-crimson CTAs at 390px are ≥44px.
STATUS: NEW
```

```
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
```

```
ACTION_ID: MAA-2026-09-22-006
TITLE: Walk / Attack / Flee / End Turn / Spellbook / Attack Nearest expose details only through title=
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Visible text plus title=. Attack still says “click a target” on this HEAD. Attack Nearest has title but no aria-label. Spell slots already have aria-label.
DESIRED_BEHAVIOUR: aria-label matches title. Prefer “choose a target” over “click” for touch parity. #335 adds Attack Nearest aria-label.
EVIDENCE: BattleUIPanel walk/attack/flee/end-turn/spellbook/attack-nearest. Older combat PRs own this file.
RECOMMENDED_ACTION: Union after those PRs. Do not restack BattleUIPanel in this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — names only; combat legality unchanged.
VALIDATION_REQUIRED: Screen reader names match title; Attack copy has no “click”.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-22-007
TITLE: Buy Doka overlay ignored Escape unless the overlay node was focused
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/DokaGameKeyShop.tsx
CURRENT_BEHAVIOUR: Overlay onKeyDown + backdrop click. Not showModal(), so Escape does nothing while focus is on email / GameKey fields. Close is already 44px. #526 adds subscribeEscapeToDismiss.
DESIRED_BEHAVIOUR: Window Escape dismisses without starting a purchase or redeem.
EVIDENCE: DokaGameKeyShop onKeyDown only. Open PRs #372 and #526.
RECOMMENDED_ACTION: Wait for those PRs.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW — dismiss only.
VALIDATION_REQUIRED: Focus the GameKey field, press Escape; overlay closes; no redeem.
STATUS: NEW
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
EVIDENCE: GameFlow owned by older PRs.
RECOMMENDED_ACTION: Wait.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: AT lists a Battle map / World map region.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-25-002
TITLE: Chat channel tabs below 44px
CATEGORY: touch-targets
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
STATUS: NEW
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
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-28-005
TITLE: Debug overlay is unreachable during SmallScreenGuard and loading
CATEGORY: keyboard-focus
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/App.tsx
CURRENT_BEHAVIOUR: SmallScreenGuard and the loading spinner replace the game tree. AGENTS.md requires the debug overlay to stay reachable during loading/crash. App.tsx is owned by #643.
DESIRED_BEHAVIOUR: Mount the debug overlay at app root even when Continue has not been pressed and while profile hydrate runs.
EVIDENCE: App.tsx early return at isSmallScreen && !smallScreenBypass (~396) renders only Starfield + SmallScreenGuard.
RECOMMENDED_ACTION: Wait for App.tsx owner. Do not restack #643.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: On a 390px viewport before Continue, debug overlay still opens.
STATUS: NEW
```

```
ACTION_ID: MAA-2026-09-28-006
TITLE: Recap overlay still uses 16px padding and 94vw without horizontal safe-area
CATEGORY: safe-areas
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/PostBattleRecap.tsx
CURRENT_BEHAVIOUR: On this HEAD the recap dialog still uses a fixed 16px pad and width 94vw. Space/Enter on the dialog also dismiss. #693 ships overlaySafeAreaPadding, Escape-only dismiss, overscroll contain, aria-modal, and paddingBottom-after-padding.
DESIRED_BEHAVIOUR: Keep #693. Do not restack PostBattleRecap here.
EVIDENCE: Open PR #693. Recap on origin/main still has paddingBottom then padding: 0.
RECOMMENDED_ACTION: Wait for #693.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: After #693, notched recap; Space scrolls a long feats list.
STATUS: NEW
```

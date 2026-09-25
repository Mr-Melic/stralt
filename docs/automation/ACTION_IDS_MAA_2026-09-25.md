# Mobile / touch / accessibility — 2026-09-25

Daily audit. `DESIGN.md` is unchanged. Combat mouse/touch still share
`decideSpriteCastClick` / `decideTileCastClick` and the 400ms ghost-click
window (`preventDefault` first). Sprite hit pad 10 vs 14 is report-only.

## This run (small chrome)

- Leaderboard overlay extracted from GameFlow: window Escape, `role="dialog"`,
  44px close (`stone-touch-target` / `stone-modal-close`), safe-area padding,
  Board button `aria-label="Leaderboard"`.
- Summon End Turn and kit spell slots use `stone-touch-target` (≥44px ≤768px).
  Does not restack #379/#417 `canAffordCastAp`.

Did **not** edit WorldExploration, BattleUIPanel, index.css, ChallengePanel,
CharacterSelection, Settings, Spellbook, BuffShop, or DokaGameKeyShop.

## Implemented

ACTION_ID: MAA-2026-09-21-001
TITLE: Leaderboard overlay ignored Escape and was not a named dialog
CATEGORY: keyboard-modals
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/LeaderboardModal.tsx; src/frontend/src/components/GameFlow.tsx; src/frontend/src/utils/leaderboardRank.ts
CURRENT_BEHAVIOUR: Overlay onKeyDown handled only Enter/Space when the nameless presentation node was focused. Close was an inline 30×30 control. Board chrome said "Board".
DESIRED_BEHAVIOUR: Window Escape closes the board without changing rankings. Close measures ≥44px on phones. Assistive tech hears Leaderboard.
EVIDENCE: GameFlow LeaderboardModal on this HEAD before extract; no window listener.
RECOMMENDED_ACTION: Keep the extracted modal and window keydown shipped this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — dismiss and naming only; getLeaderboard query unchanged. GameFlow persist hunks in #435/#490 are untouched. Back/Logout `aria-label` matches open PR **#335** (union, not a fork).
VALIDATION_REQUIRED: Open Board, focus a row, press Escape; overlay closes. At 390px width the × measures ≥44px.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-24-007
TITLE: Summon End Turn and kit spell slots omitted the mobile 44px class
CATEGORY: touch-targets
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/SummonControlPanel.tsx
CURRENT_BEHAVIOUR: End Turn used py-2 text-xs. Kit slots used p-1.5. Open PRs #379/#417 only swap AP afford onto canAffordCastAp.
DESIRED_BEHAVIOUR: Those controls measure ≥44px on viewports ≤768px via stone-touch-target.
EVIDENCE: SummonControlPanel End Turn / SpellSlot className on this HEAD.
RECOMMENDED_ACTION: Keep the stone-touch-target classes shipped this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW — mobile min size only; summon AP gate stays with #379/#417.
VALIDATION_REQUIRED: At 390px width, End Turn and a kit slot measure ≥44px; one tap still ends the turn once.
STATUS: IMPLEMENTED

---

ACTION_ID: MAA-2026-09-25-001
TITLE: Board tool control exposed only the abbreviated visible name
CATEGORY: keyboard-focus
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx
CURRENT_BEHAVIOUR: Visible label is Board; title=Leaderboard is hover-only.
DESIRED_BEHAVIOUR: Accessible name is Leaderboard; expanded state is exposed.
EVIDENCE: game.leaderboard_button span Board.
RECOMMENDED_ACTION: Keep aria-label and aria-expanded shipped this run.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Screen reader names Leaderboard; tap still toggles the overlay.
STATUS: IMPLEMENTED

## Still HUMAN_APPROVAL / REPORT_ONLY (stable IDs)

ACTION_ID: MAA-2026-08-31-006
TITLE: Dual top bars hide Center, Enemies, region, and dungeon chain
CATEGORY: hud-overlap
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: GameFlow spacer + tool cluster sit under/near WorldExploration’s live HUD. Mid-width tablets crowd Center / Enemies / region / dungeon chain.
DESIRED_BEHAVIOUR: One top bar; canvas inset matches live bar height including safe-area.
EVIDENCE: GameFlow z-9000 spacer + z-9001 tools; WX header.
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
CURRENT_BEHAVIOUR: Battle UI default y is innerHeight-220 and persists. Short landscape can cover the map or sit off-screen. DESIGN.md wants the bottom menu stuck to the viewport.
DESIRED_BEHAVIOUR: On narrow viewports, pin battle spells/actions to the bottom safe-area and disable drag.
EVIDENCE: DESIGN.md line 74; BattleUIPanel defaultPosition; no mobile dock branch.
RECOMMENDED_ACTION: Design a docked mobile battle chrome. Do not auto-redesign.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — persisted uiLayout. Wait for BattleUIPanel PRs #379/#417/#432.
VALIDATION_REQUIRED: Portrait and landscape battle; controls remain visible after rotate.
STATUS: NEW

---

ACTION_ID: MAA-2026-08-31-008
TITLE: Spell and status details are hover-only title tooltips
CATEGORY: hover-only
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx; SpellbookModal.tsx
CURRENT_BEHAVIOUR: Spell slots still rely on title= / native hover. Touch has no hover; long-press OS tooltip is unreliable. Status badges gained aria-label in #471.
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
CURRENT_BEHAVIOUR: Comments say chip inspect is suppressed when a spell is selected and forced inspect is right-click / long-press. No contextmenu or long-press handler exists.
DESIRED_BEHAVIOUR: Implement the documented path, or update the comments and provide another inspect path while a spell is selected.
EVIDENCE: WorldExploration has no onContextMenu / long-press; canvas onKeyDown is undefined with tabIndex=0.
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
CURRENT_BEHAVIOUR: isMobile is innerWidth < 768. A phone in landscape often becomes desktop tiles.
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
CURRENT_BEHAVIOUR: Chip HP is a red bar with no numeric text. Dim labels use ~0.45 lightness / #8a8090 on navy. DESIGN.md requires color + text and 4.5:1 gold-on-navy.
DESIRED_BEHAVIOUR: HP number or percent on chips; raise dim text to a passing pair.
EVIDENCE: DESIGN.md lines 75–76; chip bar has no text node.
RECOMMENDED_ACTION: Add compact HP text; audit OKLCH pairs. Not a redesign of the bar. Wait for BattleUIPanel / index.css PRs.
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
RECOMMENDED_ACTION: Wait for the WorldExploration queue (40+ older PRs).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW once landed; HIGH to restack WorldExploration now.
VALIDATION_REQUIRED: Open zone-lock, press Escape; lock state unchanged.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-21-006
TITLE: Zone-lock dialog ignores safe-area insets
CATEGORY: safe-areas
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Centered dialog uses maxWidth calc(100vw - 32px) and no env(safe-area-inset-*).
DESIRED_BEHAVIOUR: Padding includes notch / home-indicator insets.
EVIDENCE: zone-lock dialog style block.
RECOMMENDED_ACTION: Wait for WorldExploration. Not a redesign.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: iPhone landscape; Close remains tappable outside the home indicator.
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
EVIDENCE: showRenameModal around WX 19112.
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
TITLE: Desktop stone-btn chrome stays below 44px without the mobile media query
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: src/frontend/src/index.css
CURRENT_BEHAVIOUR: 44px floor applies only inside max-width 768px for stone-touch-target / stone-nav-btn / stone-modal-close.
DESIRED_BEHAVIOUR: Keep the mobile-only floor (DESIGN.md). Do not enlarge desktop chrome. Open CSS PRs #423/#469/#516/#567 only drop dungeon-editor leftovers.
EVIDENCE: index.css @media (max-width: 768px) min-height 44px rule.
RECOMMENDED_ACTION: REPORT_ONLY — current CSS matches DESIGN.md. Wait for CSS PRs.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: At 390px width nav buttons ≥44px; at 1280px they may stay compact.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-005
TITLE: Challenge panel drag is mouse-only
CATEGORY: touch-parity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ChallengePanel.tsx
CURRENT_BEHAVIOUR: onMouseDown starts drag; no touch listeners. Owned by #372.
DESIRED_BEHAVIOUR: Pointer events (or touch + mouse) move the panel without stealing Accept/Decline.
EVIDENCE: ChallengePanel onMouseDown ~111.
RECOMMENDED_ACTION: Wait for #372. Do not restack copy hunks.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — must not double-fire Accept.
VALIDATION_REQUIRED: Finger drag repositions; tap Accept still accepts once.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-22-006
TITLE: Attack Nearest has no accessible name beyond NEAREST
CATEGORY: hover-only
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Visible text is NEAREST. Full instructions live in title=. Open PR **#335** already adds aria-label; BattleUIPanel is also in #379/#417/#432.
DESIRED_BEHAVIOUR: aria-label matches the title copy, including the S hint on desktop.
EVIDENCE: battle_ui.attack_nearest_button title= ~835; no aria-label.
RECOMMENDED_ACTION: Wait for BattleUIPanel combat PRs.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Screen reader names Attack Nearest; tap still fires one attack.
STATUS: NEW

---

ACTION_ID: MAA-2026-09-25-002
TITLE: Chat channel tabs stay below 44px
CATEGORY: touch-targets
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx
CURRENT_BEHAVIOUR: Channel tabs use py-1 px-2 text-[9px]. ChatPanel is owned by perf PRs #392/#447.
DESIRED_BEHAVIOUR: Tabs measure ≥44px on phones without changing the debug RAF gating those PRs land.
EVIDENCE: ChatPanel channel tab className ~1185.
RECOMMENDED_ACTION: Wait for #392/#447; add stone-touch-target as a union.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: At 390px width channel tabs ≥44px; switching channels still does not recast.
STATUS: NEW

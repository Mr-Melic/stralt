# ACTION_ID catalog — 2026-10-21 UX audit

Stable IDs for the daily player-journey auditor. STATUS values: NEW | OPEN | IMPLEMENTED_THIS_RUN | IMPLEMENTED | SUPERSEDED.

Reuse IDs from [`ACTION_IDS_UX_2026-09-29.md`](./ACTION_IDS_UX_2026-09-29.md) (open PR #776) and older UX PRs when the finding is the same. Do not mint twins.

HEAD: `0f5363f` (unchanged since 2026-09-21). DESIGN.md preserved.

---

## Copy locked this run (not wired — older PRs own the hosts)

```
ACTION_ID: UX-SHRINE-INVISIBLE
TITLE: Dungeon shrine altar has no chrome and silent +300 Doka
CATEGORY: reward-clarity
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/shrineAltarCopy.ts; WorldExploration.tsx (origin/main, untouched)
CURRENT_BEHAVIOUR: ~25% of dungeon-chain rooms set isShrineRoom. Altar is WORLD_GRID_SIZE/2 — the spawn keep-clear tile. No draw, no HUD (`_isShrineRoom` / `_shrineCompleted` unused). Stepping the tile credits 300 Doka with no toast.
DESIRED_BEHAVIOUR: Carved Shrine chip, altar hover from shrineAltarHover, toast shrineCreditToast after persist commit. Keep 300 Doka. Never a SaaS claim banner.
EVIDENCE: WorldExploration.tsx ~5020–5031, ~11286–11327; no shrine draw pass.
RECOMMENDED_ACTION: Wire shrineAltarCopy after WX PRs land. Do not change persistDokaCreditResult or spawn keep-clear.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM when wired (double-credit if toast fires before settle)
VALIDATION_REQUIRED: shrineAltarCopy.test.ts; one step credits 300 once; HUD leftover XP unchanged.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-EMPTY-BAR-EQUIP
TITLE: Empty battle-bar slots never name Book
CATEGORY: spells
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/emptySpellSlotCopy.ts; BattleUIPanel.tsx (origin/main, untouched)
CURRENT_BEHAVIOUR: Empty slots title/aria “Empty slot N”. Spellbook empty slots already say “click a spell below to add”.
DESIRED_BEHAVIOUR: emptyBattleSlotTitle — “Empty slot N — open Book to equip”. Keep dashed empty chrome. Do not auto-open the book.
EVIDENCE: BattleUIPanel.tsx ~626–638 vs SpellbookModal.tsx ~692–696.
RECOMMENDED_ACTION: Wire emptyBattleSlotTitle after #335 / #340. Do not change slot persistence.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: emptySpellSlotCopy.test.ts; Book still writes eight slots; overworld slots stay muted.
STATUS: IMPLEMENTED_THIS_RUN
```

---

## New this run (not implemented)

```
ACTION_ID: UX-COVENANT-DEAD-BUFF
TITLE: Shrine “pure path” covenant is stored and never applied
CATEGORY: reward-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx covenantBuffMapsRef
CURRENT_BEHAVIOUR: A no-hazard path onto the altar writes pbv_covenant_buff_* = 3. The ref is never read. First step off spawn (the altar) already marks the path violated, so the write almost never happens.
DESIRED_BEHAVIOUR: Either apply a named 3-map reward and show a carved chip, or delete the dead write. Do not promise a buff that does nothing.
EVIDENCE: covenantBuffMapsRef written ~11330; no other reads in src/frontend.
RECOMMENDED_ACTION: HUMAN — product call. Do not invent multiplier math in an unattended copy pass.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH if a multiplier is invented without applyRewards review
VALIDATION_REQUIRED: Recap Doka matches persist with and without the path.
STATUS: NEW
```

```
ACTION_ID: UX-ZONE-LOCK-SAAS-CHROME
TITLE: Zone Lock popup is a generic HTML dialog
CATEGORY: visual-hierarchy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx showZoneLockPopup
CURRENT_BEHAVIOUR: Native <dialog>, #aaa body, pill ON/OFF, #666 Close. Copy about difficulty is still UX-ZONE-TIER-LOCK (#738).
DESIRED_BEHAVIOUR: Same carved-stone frame as Game Over / recap. Keep lock persistence (aestralto_zone_locked). Never shadcn gray.
EVIDENCE: WorldExploration.tsx ~17626–17716.
RECOMMENDED_ACTION: HUMAN restyle after WX PRs. Wire #738 copy in the same pass.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for restyle
VALIDATION_REQUIRED: Lock still writes localStorage; next map stays at the tier.
STATUS: NEW
```

```
ACTION_ID: UX-RENAME-SAAS-CHROME
TITLE: Rename modal is a generic dark card
CATEGORY: visual-hierarchy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx showRenameModal
CURRENT_BEHAVIOUR: #141726 panel, generic serif heading. Cost “100 Doka” is already honest.
DESIRED_BEHAVIOUR: stone-frame / stone-well matching Game Over. Keep 100 Doka debit and 20-char cap.
EVIDENCE: WorldExploration.tsx ~19055–19158.
RECOMMENDED_ACTION: HUMAN restyle after WX PRs. Do not change renameCharacter.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for restyle
VALIDATION_REQUIRED: Confirm still spends 100; Cancel spends 0.
STATUS: NEW
```

---

## Implemented on main since 2026-09-02 (do not reopen)

- `UX-SPELL-OVERWORLD-MUTED`
- `UX-CHALLENGE-FAIL-COPY`
- `UX-PROFILE-NAME-HINT`
- `UX-CREATE-NO-STATS`
- `UX-ENEMY-REGISTER-LORE`
- `UX-VITALS-ORB-MAX`
- `UX-BLOOD-DEAD-BAR`
- `UX-GAMEKEY-STEP-ORDER` (refine pay-after-submit is #588)
- `UX-GAMEKEY-STATUS-STALE`
- `UX-CHANGELOG-ACCURACY`
- `UX-HUD-DUPLICATE-TOPBAR`
- `UX-RECAP-XP-CURVE`
- `UX-IAP-KYC-SURPRISE`

---

## Queued in older open PRs (do not duplicate this run)

### #372
- `UX-FORGE-NAME-HINT`
- `UX-PROFILE-ERROR-ALERT`
- `UX-LANDING-ADMIN-ARIA`
- `UX-ITEMS-TITLE`
- `UX-GAMEKEY-PASTE-WHITESPACE`
- `UX-SUMMON-UPGRADE-TAX`
- `UX-CHALLENGE-ACCEPT-WINDOW`

### #421
- `UX-SELECTION-PBV-HEADING`
- `UX-SELECTION-XP-THIS-LEVEL`
- `UX-SELECTION-PLAY-HINT`
- `UX-SELECTION-ERROR-ALERT`
- `UX-GAMEOVER-PENALTY-COPY`

### #464
- `UX-CHANGELOG-CACHE-COPY`
- `UX-EMPTY-SLOT-FORGE`
- `UX-DELETE-CHAMPION-COPY`
- `UX-BOSS-GUIDE-NEXT`

### #485
- Feat toast heading “Feat Unlocked!” (`featToastCopy.ts`). Wire `featToastRewardLabel` after #485 (#690).

### #517
- `UX-MAP-MODIFIERS-EMPTY`

### #588
- `UX-GAMEKEY-PAY-AFTER-SUBMIT`
- `UX-HEAL-TITLE-MISMATCH`

### #642
- `UX-SETTINGS-SOUND-TITLE`
- `UX-NO-LEAVE-REALM` (copy locked, not wired)

### #690
- `UX-FEAT-TOAST-PRECREDIT`
- `UX-RECAP-FEAT-PRECREDIT`
- `UX-INIT-SUMMON-PHASE`
- `UX-FEAT-TOAST-CLUSTER`

### #738
- `UX-ZONE-TIER-LOCK`
- `UX-POTION-VS-HUD-HEAL`
- `UX-DEATH-REALM-WAIT-BEAT`
- `UX-ITEMS-INNER-SHOP-TAB`

### #776
- `UX-PORTAL-LEGEND`
- `UX-FLEE-NATIVE-CONFIRM`

---

## Open (human / blocked by older PRs)

Do not edit `WorldExploration.tsx`, `GameFlow.tsx`, `BattleUIPanel.tsx`, `AchievementsPanel.tsx`, or `PostBattleRecap.tsx` in this auditor PR.

```
ACTION_ID: UX-DEATH-DUAL-MODAL
TITLE: Two overlapping death UIs
CATEGORY: death
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx; GameOverModal.tsx; PostBattleRecap; persistDeathPenalty
CURRENT_BEHAVIOUR: Combat death: Game Over modal. Lava/spikes: root recap then 1.5s auto Death Realm.
DESIRED_BEHAVIOUR: One carved death path: −20% leftover XP / −40% Doka, then Death Realm, walk to a portal.
EVIDENCE: setShowGameOver(true); HP-watch + setTimeout 1500ms.
RECOMMENDED_ACTION: Human-approved unify. Do not rewire deathGuards unattended. Pair with UX-DEATH-REALM-WAIT-BEAT.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: Combat death; lava death; portal exit; penalty amounts.
STATUS: OPEN
```

```
ACTION_ID: UX-ONBOARD-FIRST-MAP
TITLE: First realm visit has no teaching beat
CATEGORY: action-discoverability
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx
CURRENT_BEHAVIOUR: After Play: isometric map, unlabeled whirlpools, no click-to-walk / step-to-fight coach.
DESIRED_BEHAVIOUR: One dismissible carved-stone coach, once per slot.
EVIDENCE: No firstVisit/tutorial strings in WorldExploration.
RECOMMENDED_ACTION: Human-written 3-line coach. Never a SaaS tooltip tour.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: First Play shows coach; second does not.
STATUS: OPEN
```

```
ACTION_ID: UX-CAST-FAIL-FEEDBACK
TITLE: Illegal walks still mostly write the battle log
CATEGORY: invalid-action-explanation
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx; BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Some casts float. Walk “Can't reach” / “Not enough MP” still logBattleEntry.
DESIRED_BEHAVIOUR: Shared 1.5s stone whisper. Do not change targeting math.
EVIDENCE: WorldExploration walk reject path.
RECOMMENDED_ACTION: HUMAN — WX owned.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: MP-starved walk shows a reason once.
STATUS: OPEN
```

```
ACTION_ID: UX-SHOP-TWO-STORES
TITLE: Items and Buy Doka still feel like one shop
CATEGORY: action-discoverability
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx Items; WorldExploration.tsx cart
CURRENT_BEHAVIOUR: Items opens BuffShop. Cart next to Doka is icon-only ShoppingCart “Buy Doka”.
DESIRED_BEHAVIOUR: Visible Items vs Buy Doka. Never both read as Shop.
EVIDENCE: GameFlow shop button; WX cart.
RECOMMENDED_ACTION: HUMAN layout/copy. Do not change purchase APIs.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: Items still buys buffs; cart still opens GameKey.
STATUS: OPEN
```

```
ACTION_ID: UX-NO-LEAVE-REALM
TITLE: Play has no way back to champion slots
CATEGORY: action-discoverability
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx; leaveRealmCopy.ts (#642)
CURRENT_BEHAVIOUR: showBackButton is false for world. Log Out lives only on the pre-world header.
DESIRED_BEHAVIOUR: Carved Champions control using leaveRealmCopy. Do not SaaS “Switch account”.
EVIDENCE: GameFlow.tsx ~239–241 vs ~419–466.
RECOMMENDED_ACTION: HUMAN — copy locked in #642; do not wire unattended.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Champions returns to slots; HUD leftover XP/Doka unchanged.
STATUS: OPEN
```

```
ACTION_ID: UX-BOOST-UNMOUNTED
TITLE: Battle Boost UI is never mounted; Doka +50% is unreachable
CATEGORY: action-discoverability
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BoostToggle.tsx; App.tsx; GameFlow.tsx; WorldExploration.tsx
CURRENT_BEHAVIOUR: BoostToggle never imported. GameFlow discards App boostMode. WX always XP * 1.5.
DESIRED_BEHAVIOUR: One carved Battle Boost control; lock in combat; default XP.
EVIDENCE: No <BoostToggle; GameFlow ~48; WorldExploration ~2098.
RECOMMENDED_ACTION: HUMAN — do not mount unattended (changes reward amounts).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: XP toggle +50% XP; Doka toggle +50% Doka; recap matches persist.
STATUS: OPEN
```

```
ACTION_ID: UX-HAZARD-TILE-LEGEND
TITLE: Lava, ice, and spikes never name themselves before you step
CATEGORY: invalid-action-explanation
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx hazard draw
CURRENT_BEHAVIOUR: Tiles tint and draw pixel icons. Hover in battle-walk shows only “N MP”.
DESIRED_BEHAVIOUR: Hover/float: Lava burns / Ice slows / Spikes cut. Do not change damage math.
EVIDENCE: hoveredTile MP-cost gate is inBattle && walk; hazard overlay has no text.
RECOMMENDED_ACTION: HUMAN — WX owned.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Hover names the hazard; MP cost still shows on safe walk tiles.
STATUS: OPEN
```

```
ACTION_ID: UX-FEAT-TOAST-PRECREDIT
TITLE: World feat toast printed +Doka before Claim
CATEGORY: reward-clarity
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: featToastClaimCopy.ts (#690); AchievementToast.tsx
CURRENT_BEHAVIOUR: Unlock toast shows “+N Doka”. markAchievementUnlocked does not mint. Wallet moves on claimAchievementReward in Feats.
DESIRED_BEHAVIOUR: “Claim in Feats · N Doka”. Hide the chip when N is 0.
EVIDENCE: AchievementToast.tsx ~148–166 vs persistAchievementClaim.
RECOMMENDED_ACTION: Do not duplicate #690. Wire after #485.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: featToastClaimCopy.test.ts; Claim in Feats still credits.
STATUS: OPEN
```

```
ACTION_ID: UX-LEVEL-UP-CHROME
TITLE: Recap never celebrates a level-up
CATEGORY: reward-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: PostBattleRecap.tsx
CURRENT_BEHAVIOUR: Level-up can play a sound. Recap has no LEVEL UP banner.
DESIRED_BEHAVIOUR: One stone LEVEL UP beat when applyRewards raised level.
EVIDENCE: PostBattleRecap has no levelUp string.
RECOMMENDED_ACTION: HUMAN — PostBattleRecap is in #354.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: True level-up shows banner; leftover XP still leftover.
STATUS: OPEN
```

```
ACTION_ID: UX-HUD-TOOL-CLUSTER
TITLE: Realm tools float over the map instead of living in one bar
CATEGORY: hud-crowding
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx z-9001; WorldExploration header
CURRENT_BEHAVIOUR: Live HUD vs Items/Board/Feats/Bosses cluster. Collision on mid-width tablets.
DESIRED_BEHAVIOUR: One carved-stone header. Do not restore dummy 0/100 XP bar.
EVIDENCE: GameFlow ~294; WX header.
RECOMMENDED_ACTION: Human layout. Union #335.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Tools still open; leftover XP visible at 768 and 1280.
STATUS: OPEN
```

```
ACTION_ID: UX-SMALL-SCREEN-HARD-BLOCK
TITLE: Narrow viewports still have no stacked HUD
CATEGORY: responsive-behaviour
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: App.tsx SmallScreenGuard
CURRENT_BEHAVIOUR: Continue anyway. 390px still overlaps desktop HUD.
DESIRED_BEHAVIOUR: Product call: tablet floor, or stacked HUD for 768 landscape first.
EVIDENCE: SmallScreenGuard.
RECOMMENDED_ACTION: Report-only until a human picks a mobile scope.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH if the guard is removed without a HUD reflow.
VALIDATION_REQUIRED: 768 and 390-wide viewports.
STATUS: OPEN
```

```
ACTION_ID: UX-LAUNCH-TAB-TITLE
TITLE: Browser tab and forge header still say Paper Baby Vampires
CATEGORY: launch
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/index.html; GameFlow.tsx header; CharacterSelection.tsx
CURRENT_BEHAVIOUR: Tab/OG Paper Baby Vampires; selection heading “Choose your Paper Baby Vampire!”; landing ÆSTRALTØ.
DESIRED_BEHAVIOUR: One player-facing name. Do not retitle unattended.
EVIDENCE: index.html title; GameFlow “Paper Baby Vampires”; CharacterSelection h1.
RECOMMENDED_ACTION: Human product-name call. Do not duplicate #421.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Favicon and landing still match the chosen name.
STATUS: OPEN
```

```
ACTION_ID: UX-IDENTITY-FONT-DRIFT
TITLE: Live type and color tokens still drift from DESIGN.md
CATEGORY: visual-hierarchy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: DESIGN.md; index.css; LandingPage.tsx
CURRENT_BEHAVIOUR: Brief Space Grotesk / Inter / OKLCH. CSS Baloo 2 / Saira. Launch title measures Arial.
DESIRED_BEHAVIOUR: Next new screen only. Never generic SaaS UI. No repo-wide hex sweep.
EVIDENCE: DESIGN.md Typography; index.css --font-display.
RECOMMENDED_ACTION: REPORT_ONLY.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH for a global color sweep.
VALIDATION_REQUIRED: Gold-on-navy ≥ 4.5:1.
STATUS: OPEN
```

---

## Closed / do not reopen this run

- `UX-HUD-DUPLICATE-TOPBAR` — keep GameFlow spacer; do not restore dummy XP bar.
- `UX-RECAP-XP-CURVE` — leftover XP is correct; do not recolor Dofus purple fill to gold.
- `UX-BLOOD-DEAD-BAR` — inert Blood chip stays gone.
- `UX-IAP-KYC-SURPRISE` — GameKey email + consent.
- `UX-VITALS-ORB-MAX` — side-panel jewels use vitalsOrbCaps.
- `UX-CREATE-NO-STATS` — forge vitals row is on main.
- `UX-ENEMY-REGISTER-LORE` — honesty banner is on main.

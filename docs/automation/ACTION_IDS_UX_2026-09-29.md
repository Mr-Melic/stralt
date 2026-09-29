# ACTION_ID catalog — 2026-09-29 UX audit

Stable IDs for the daily player-journey auditor. STATUS values: NEW | OPEN | IMPLEMENTED_THIS_RUN | IMPLEMENTED | SUPERSEDED.

Reuse IDs from [`ACTION_IDS_UX_2026-09-28.md`](./ACTION_IDS_UX_2026-09-28.md) (open PR #738) and older UX PRs when the finding is the same. Do not mint twins.

HEAD: `0f5363f` (unchanged since 2026-09-21). DESIGN.md preserved.

---

## Copy locked this run (not wired — older PRs own the hosts)

```
ACTION_ID: UX-PORTAL-LEGEND
TITLE: Only dungeon portals explain themselves
CATEGORY: portal-clarity
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/portalLegendCopy.ts; WorldExploration.tsx (origin/main, untouched)
CURRENT_BEHAVIOUR: Nearby dungeon / chain draw labels. Rest, boss, colored, white sanctuary, Death Realm exits do not. dungeonChainActive can stamp the dungeon caption on every nearby whirlpool.
DESIRED_BEHAVIOUR: Within 3 tiles, nearbyPortalLabel per kind: Explore / Rest / Boss / Dungeon / Sanctuary / Death Realm exit. Chain still shows depth/max.
EVIDENCE: WorldExploration.tsx ~7916 gated on p.color === "dungeon" || dungeonChainActiveRef.current.
RECOMMENDED_ACTION: Wire nearbyPortalLabel after WX PRs land. Do not change spawn, keep-clear, or portalRules.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM when wired (caption vs chain-active mislabel)
VALIDATION_REQUIRED: portalLegendCopy.test.ts; each kind distinct; dungeon still shows depth.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-FLEE-NATIVE-CONFIRM
TITLE: Flee uses a native window.confirm
CATEGORY: modal-conflicts
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/fleeConfirmCopy.ts; BattleUIPanel.tsx; WorldExploration.tsx (untouched)
CURRENT_BEHAVIOUR: OS dialog. BattleUIPanel says “20% XP”. WX adds a second confirm for Boss Rush / Dungeon Chain without naming the 20/40 penalty.
DESIRED_BEHAVIOUR: Carved stone confirm matching Game Over. FLEE_CONFIRM_BODY / fleeRunConfirmBody name leftover XP. Keep explicit confirm (no one-click flee).
EVIDENCE: window.confirm in BattleUIPanel ~522; WX ~18930.
RECOMMENDED_ACTION: Wire fleeConfirmCopy after #335 / WX PRs land. Do not change flee → deathGuards.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM when wired
VALIDATION_REQUIRED: fleeConfirmCopy.test.ts; Cancel leaves the fight; confirm still 20/40 Death Realm.
STATUS: IMPLEMENTED_THIS_RUN
```

---

## Copy locked 2026-09-28 (still not wired — #738)

```
ACTION_ID: UX-ZONE-TIER-LOCK
TITLE: Zone Tier chip is always on and never explains difficulty
CATEGORY: action-discoverability
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/zoneLockCopy.ts; WorldExploration.tsx (origin/main, untouched)
CURRENT_BEHAVIOUR: currentZoneTier starts at 1; chip renders when > 0, so every realm visit shows “Zone Tier n” (lock glyph if localStorage aestralto_zone_locked). Dialog: “When locked, the next map stays at Zone Tier n” with ON/OFF. No word that Zone Tier is map difficulty.
DESIRED_BEHAVIOUR: Chip aria names difficulty. Body uses zoneLockBody. Controls read Locked / Unlocked. Keep carved crimson, never SaaS. Do not hide the chip after a human product call — or hide it until the player has seen tier 2.
EVIDENCE: WorldExploration.tsx ~1136–1140, ~17600–17697.
RECOMMENDED_ACTION: Wire zoneLockChipAria / zoneLockBody after WX PRs land. Do not change portal or spawn math.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy; MEDIUM if the chip is hidden (farming players use the lock)
VALIDATION_REQUIRED: zoneLockCopy.test.ts; lock still writes aestralto_zone_locked; next map stays at the tier.
STATUS: OPEN
```

```
ACTION_ID: UX-POTION-VS-HUD-HEAL
TITLE: Potion Use never names the overworld Doka heal
CATEGORY: invalid-action-explanation
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/buffShopUseCopy.ts; BuffShop.tsx (origin/main, untouched); stats.heal_with_doka_button
CURRENT_BEHAVIOUR: Inventory Use is disabled out of battle. Title “Only usable in battle”. Footer 8px “Items can only be used during your battle turn.” HUD Doka-to-HP is the overworld heal and is a different control.
DESIRED_BEHAVIOUR: Title and hint name the HUD Doka button. Keep potions battle-turn only. Do not let overworld Use call tryConsumeBuffItem.
EVIDENCE: BuffShop.tsx ~619–648 vs WorldExploration stats.heal_with_doka_button ~18392.
RECOMMENDED_ACTION: Wire buffShopUseTitle / BUFF_SHOP_OVERWORLD_HINT after #372 / #526. Do not change heal math or challenge healUsed.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: buffShopUseCopy.test.ts; overworld Use still disabled; HUD heal still 3 HP per Doka.
STATUS: OPEN
```

---

## Still open from 2026-09-28 (not implemented)

```
ACTION_ID: UX-DEATH-REALM-WAIT-BEAT
TITLE: Lava death waits 1.5s with HP already restored and no “you died” chrome
CATEGORY: death
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx persistDeathPenalty / HP-watch; PostBattleRecap
CURRENT_BEHAVIOUR: Exploration lava/spikes: persist restores HP immediately, root recap may fire, then a 1.5s timer generates Death Realm. Toast “find a portal” appears after the map exists. During the wait the champion looks alive.
DESIRED_BEHAVIOUR: One carved “You have fallen” beat for the wait (or skip the wait and enter the realm with Game Over). Do not rewire deathGuards unattended. Keep 20% leftover XP / 40% Doka.
EVIDENCE: persistDeathPenalty restores HP; setTimeout 1500ms then Death Realm toast ~13487.
RECOMMENDED_ACTION: HUMAN — fold into UX-DEATH-DUAL-MODAL. Do not ship a second death modal.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH if the timer or deathGuards change
VALIDATION_REQUIRED: Lava death; combat death; portal exit; penalty amounts.
STATUS: OPEN
```

```
ACTION_ID: UX-ITEMS-INNER-SHOP-TAB
TITLE: Items modal’s first tab is still labeled Shop
CATEGORY: action-discoverability
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BuffShop.tsx shop_tab
CURRENT_BEHAVIOUR: GameFlow door is Items. Modal title on main is still Item Shop (#372 retitles Items). Inner tab is Shop vs Inventory.
DESIRED_BEHAVIOUR: Inner tab “Potions” or “Buy”. Never a third “Shop” next to Buy Doka.
EVIDENCE: BuffShop.tsx ~377–387.
RECOMMENDED_ACTION: Copy after #372 / #526. Do not change spend lock.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Shop tab still lists BUFF_ITEMS; Inventory still Uses stacks.
STATUS: OPEN
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

- Feat toast heading “Feat Unlocked!” (`featToastCopy.ts`) — heading / aria only. Wire `featToastRewardLabel` after #485 (#690).

### #517

- `UX-MAP-MODIFIERS-EMPTY`

### #588

- `UX-GAMEKEY-PAY-AFTER-SUBMIT`
- `UX-HEAL-TITLE-MISMATCH` (helper not wired into WX)

### #642

- `UX-SETTINGS-SOUND-TITLE`
- `UX-NO-LEAVE-REALM` (copy locked, not wired)

### #690

- `UX-FEAT-TOAST-PRECREDIT` (copy locked, toast not wired)
- `UX-RECAP-FEAT-PRECREDIT`
- `UX-INIT-SUMMON-PHASE`
- `UX-FEAT-TOAST-CLUSTER`

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
ACTION_ID: UX-LEVEL-UP-CHROME
TITLE: Recap never celebrates a level-up
CATEGORY: reward-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: PostBattleRecap.tsx
CURRENT_BEHAVIOUR: Level-up can play a sound. Recap has no LEVEL UP banner.
DESIRED_BEHAVIOUR: One stone LEVEL UP beat when applyRewards raised level.
EVIDENCE: PostBattleRecap has no levelUp string.
RECOMMENDED_ACTION: HUMAN — PostBattleRecap is in #354 / #693.
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
CURRENT_BEHAVIOUR: Live HUD vs Items/Board/Feats/Bosses cluster. Collision on mid-width tablets. Zone Tier chip adds a third floating cluster (UX-ZONE-TIER-LOCK).
DESIRED_BEHAVIOUR: One carved-stone header. Do not restore dummy 0/100 XP bar.
EVIDENCE: GameFlow ~294; WX header; Zone Tier ~17600.
RECOMMENDED_ACTION: Human layout. Union #335.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Tools still open; leftover XP visible at 768 and 1280.
STATUS: OPEN
```

```
ACTION_ID: UX-CHALLENGE-ZINDEX
TITLE: Challenge offer sits under the realm tool cluster
CATEGORY: modal-conflicts
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: ChallengePanel.tsx; GameFlow.tsx
CURRENT_BEHAVIOUR: Challenge z-index 1200; tools z-9001.
DESIRED_BEHAVIOUR: Offer above tools, below recap z-9999.
EVIDENCE: ChallengePanel zIndex 1200.
RECOMMENDED_ACTION: HUMAN — raising z-index can steal canvas clicks.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Accept clickable at 768 and 1280.
STATUS: OPEN
```

```
ACTION_ID: UX-AP-MP-CURRENT-MAX
TITLE: Battle AP/MP orbs do not print current / max
CATEGORY: ap-mp-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx
CURRENT_BEHAVIOUR: “N AP” / “N MP” plus a mini bar.
DESIRED_BEHAVIOUR: Carved “6 / 10 AP”. Keep DESIGN.md jewels.
EVIDENCE: BattleUIPanel resources row.
RECOMMENDED_ACTION: HUMAN — BattleUIPanel in #335/#340.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Max still matches characterStats.ap/mp.
STATUS: OPEN
```

```
ACTION_ID: UX-BOSS-RUSH-PINK
TITLE: Boss Rush room chip uses arcade pink
CATEGORY: visual-hierarchy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx
CURRENT_BEHAVIOUR: #FF69B4 on magenta. Dungeon chain uses carved crimson.
DESIRED_BEHAVIOUR: Same stone + gold/crimson family. Keep room n/10.
EVIDENCE: bossRushState.active overlay border #FF69B4 ~17586.
RECOMMENDED_ACTION: Restyle only after WX PRs land.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Room counter still currentRoom + 1 / 10.
STATUS: OPEN
```

```
ACTION_ID: UX-HEAL-TITLE-MISMATCH
TITLE: Overworld heal hover quotes a full-heal price
CATEGORY: invalid-action-explanation
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx ~18396; healHudCopy in #588
CURRENT_BEHAVIOUR: Label uses affordable slice; title uses full deficit.
DESIRED_BEHAVIOUR: Title and label share healHp + dokaCost.
EVIDENCE: stats.heal_with_doka_button title vs children.
RECOMMENDED_ACTION: HUMAN — wire #588 helper in WX.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Partial-heal hover matches label; jackpot unchanged.
STATUS: OPEN
```

```
ACTION_ID: UX-VERSION-FORCE-RELOGIN
TITLE: App version bump wipes local cache and forces re-login
CATEGORY: feedback
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: App.tsx APP_VERSION / versionGate
CURRENT_BEHAVIOUR: Mismatch clears localStorage (preserve list), reloads, changelog after II. Still v163.
DESIRED_BEHAVIOUR: Changelog on landing, then sign in. Do not bump APP_VERSION from a copy pass.
EVIDENCE: const APP_VERSION = "v163".
RECOMMENDED_ACTION: Human.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH if bump ships unattended
VALIDATION_REQUIRED: Staging bump; canister characters still load.
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
ACTION_ID: UX-LOGIN-SILENT-BACKEND
TITLE: Sign In with no canister ID fails with no on-screen reason
CATEGORY: feedback
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: LandingPage.tsx
CURRENT_BEHAVIOUR: handleLogin only setLoginError when login() throws.
DESIRED_BEHAVIOUR: Missing backend host/canister shows a stone line.
EVIDENCE: LandingPage handleLogin catch.
RECOMMENDED_ACTION: HUMAN — LandingPage is in #368/#372/#687.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Unset canister shows the banner.
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
ACTION_ID: UX-FEATS-VS-ACHIEVEMENTS
TITLE: Feats button vs Achievements chrome
CATEGORY: action-discoverability
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx; AchievementsPanel.tsx; PostBattleRecap.tsx; LeaderboardModal
CURRENT_BEHAVIOUR: Tool cluster Feats; title Achievements; recap Achievements Unlocked; leaderboard column Achievements. World toast heading still Achievement Unlocked on main (#485).
DESIRED_BEHAVIOUR: One player-facing word. Prefer Feats.
EVIDENCE: GameFlow span Feats. Leaderboard th Achievements. #354 owns recap/dialog.
RECOMMENDED_ACTION: Do not duplicate #354 / #485.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Panel still claims rewards.
STATUS: OPEN
```

```
ACTION_ID: UX-LANDING-VERSION
TITLE: Landing footer still prints v1.0 while APP_VERSION is v163
CATEGORY: launch
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: LandingPage.tsx
CURRENT_BEHAVIOUR: Barely-visible v1.0 is the admin triple-click.
DESIRED_BEHAVIOUR: Keep the hidden trigger; do not print a fake product version.
EVIDENCE: landing.admin_trigger vs APP_VERSION v163.
RECOMMENDED_ACTION: REPORT_ONLY unless a human picks camouflage vs honesty.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if the triple-click target is removed.
VALIDATION_REQUIRED: Triple-click still opens admin prompt.
STATUS: OPEN
```

```
ACTION_ID: UX-IDENTITY-FONT-DRIFT
TITLE: Live type and color tokens still drift from DESIGN.md
CATEGORY: visual-hierarchy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: DESIGN.md; index.css; LandingPage.tsx
CURRENT_BEHAVIOUR: Brief Space Grotesk / Inter / OKLCH. CSS Baloo 2 / Saira.
DESIRED_BEHAVIOUR: Next new screen only. Never generic SaaS UI. No repo-wide hex sweep.
EVIDENCE: DESIGN.md Typography; index.css --font-display.
RECOMMENDED_ACTION: REPORT_ONLY.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH for a global color sweep.
VALIDATION_REQUIRED: Gold-on-navy ≥ 4.5:1.
STATUS: OPEN
```

```
ACTION_ID: UX-SPELLBOOK-EMPTY-ADMIN
TITLE: Empty spellbook blames a missing admin catalog
CATEGORY: spells
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: SpellbookModal.tsx empty_state
CURRENT_BEHAVIOUR: “The admin has not added any spells yet.”
DESIRED_BEHAVIOUR: “No spells in the catalog yet.” Do not mention admin.
EVIDENCE: spellbook.empty_state.
RECOMMENDED_ACTION: Copy after #372 / #425 land.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Empty catalog still opens the book.
STATUS: OPEN
```

```
ACTION_ID: UX-SUMMON-SAAS-ORBS
TITLE: Summon control orbs use Tailwind blue/green instead of DESIGN.md jewels
CATEGORY: visual-hierarchy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: SummonControlPanel.tsx ResourceOrb
CURRENT_BEHAVIOUR: border-blue-500 / from-green-500. DESIGN.md wants OKLCH primary/success jewels.
DESIRED_BEHAVIOUR: Same carved orb language as the player battle bar. Keep n/max numerals.
EVIDENCE: SummonControlPanel.tsx ~105–133.
RECOMMENDED_ACTION: HUMAN — combat PRs own the file. Restyle only.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Summon AP/MP spend unchanged.
STATUS: OPEN
```

```
ACTION_ID: UX-TURN-TIMER-WHY
TITLE: 30s turn numeral never says the turn auto-ends
CATEGORY: ap-mp-clarity
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: BattleUIPanel.tsx battle_ui.timer
CURRENT_BEHAVIOUR: `{turnTimeLeft}s` with color shift. No legend that leftover AP/MP are lost at 0.
DESIRED_BEHAVIOUR: Title/aria: turn ends at 0s — leftover AP and MP are lost.
EVIDENCE: BattleUIPanel timer; End Turn title already says leftover AP/MP are lost.
RECOMMENDED_ACTION: HUMAN — BattleUIPanel in #335.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Timer still ends the player turn at 0.
STATUS: OPEN
```

```
ACTION_ID: UX-BOARD-LABEL
TITLE: Tool cluster says Board for the leaderboard
CATEGORY: action-discoverability
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx
CURRENT_BEHAVIOUR: Visible label “Board”; title “Leaderboard”.
DESIRED_BEHAVIOUR: One word. Prefer Leaderboard, or Board with a hover that names ranks.
EVIDENCE: GameFlow ~320–325.
RECOMMENDED_ACTION: HUMAN — GameFlow in #335.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Modal still lists getLeaderboard rows.
STATUS: OPEN
```

```
ACTION_ID: UX-INIT-SUMMON-PHASE
TITLE: Initiative strip still says YOUR while a controlled summon acts
CATEGORY: ap-mp-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: InitiativeStrip.tsx ~148–190; BattleUIPanel.tsx Summon's Turn
CURRENT_BEHAVIOUR: battlePhase === "player" paints YOUR TURN. Battle bar can show Summon's Turn and YOUR TURN at once.
DESIRED_BEHAVIOUR: When a player-side summon is acting, strip phase reads SUMMON (carved crimson, not SaaS). Keep enemy phase as ENEMY.
EVIDENCE: InitiativeStrip uses battlePhase only; BattleUIPanel isSummonControlled ~571–592.
RECOMMENDED_ACTION: HUMAN — InitiativeStrip is in #471. Pass isSummonControlled; do not change turn routing.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Champion turn still YOUR; summon turn SUMMON; enemy ENEMY; End Turn still ends the active actor.
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
ACTION_ID: UX-RECAP-FEAT-PRECREDIT
TITLE: Victory recap prints +Doka on unlocks that still need Claim
CATEGORY: reward-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: PostBattleRecap.tsx ~587–597; AchievementsPanel Claim
CURRENT_BEHAVIOUR: Recap lists “+N Doka” next to newly unlocked feats. Grant is still claimAchievementReward.
DESIRED_BEHAVIOUR: Same Claim-in-Feats language as the world toast. Do not mint from recap Continue.
EVIDENCE: PostBattleRecap RecapSection Achievements Unlocked.
RECOMMENDED_ACTION: HUMAN — PostBattleRecap is in #354 / #693. Mirror featToastRewardLabel.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Recap Continue does not credit Doka; Feats Claim still does.
STATUS: OPEN
```

```
ACTION_ID: UX-PORTAL-XP-PENDING
TITLE: Portal +10 XP never tells the player it is securing
CATEGORY: reward-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx persistIncrementalRewards PORTAL_TRANSITION_XP
CURRENT_BEHAVIOUR: HUD leftover XP must not move until applyRewards commits. No toast or whisper during the wait. Map # increments immediately.
DESIRED_BEHAVIOUR: A 1.5s stone whisper “Securing +10 XP” after the step, then the HUD tick. Do not optimistic-write leftover XP.
EVIDENCE: Comment at WorldExploration.tsx ~6802; no portal XP toast.
RECOMMENDED_ACTION: HUMAN — WX owned. Do not copy unpaid XP onto the persist lock.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM if the HUD ticks before commit
VALIDATION_REQUIRED: Portal step; failed persist does not mint leftover XP.
STATUS: OPEN
```

```
ACTION_ID: UX-CHAT-PROFILE-NAME
TITLE: Chat posts the account name while the HUD shows the champion
CATEGORY: feedback
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: ChatPanel.tsx; GameFlow playerName={userProfile.name}
CURRENT_BEHAVIOUR: sendMessage binds playerName to the caller’s userProfiles name. HUD uses the champion slot name.
DESIRED_BEHAVIOUR: One visible name, or a carved “posting as {profile}” line. Do not change sendMessage’s Principal bind.
EVIDENCE: GameFlow ChatPanel playerName={userProfile.name}.
RECOMMENDED_ACTION: REPORT_ONLY until a human picks profile vs champion in chat.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW for copy; HIGH if sendMessage playerName is unbound from the profile.
VALIDATION_REQUIRED: Chat still uses the caller profile name on the canister.
STATUS: OPEN
```

```
ACTION_ID: UX-SUMMON-LIFESPAN-WORDS
TITLE: Summon lifespan is pips only
CATEGORY: spell-state
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: SummonControlPanel.tsx LifespanPips
CURRENT_BEHAVIOUR: aria-label “Lifespan n of total”. Visible chrome is dots. No “n turns left”.
DESIRED_BEHAVIOUR: Short carved “n turns left” next to the pips. Keep pip fill. Do not restyle orbs here (UX-SUMMON-SAAS-ORBS).
EVIDENCE: SummonControlPanel.tsx ~48–65.
RECOMMENDED_ACTION: HUMAN — SummonControlPanel is in #592.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Pip count still matches remaining lifespan; End Turn unchanged.
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

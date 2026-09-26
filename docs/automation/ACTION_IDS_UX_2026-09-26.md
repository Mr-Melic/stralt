# ACTION_ID catalog — 2026-09-26 UX audit

Stable IDs for the daily player-journey auditor. STATUS values: NEW | OPEN | IMPLEMENTED_THIS_RUN | IMPLEMENTED | SUPERSEDED.

Reuse IDs from [`ACTION_IDS_UX_2026-09-02.md`](./ACTION_IDS_UX_2026-09-02.md) and open PRs #372 / #421 / #464 / #517 / #588 when the finding is the same. Do not mint twins.

HEAD: `0f5363f`. DESIGN.md preserved.

---

## Implemented this run (display-only)

```
ACTION_ID: UX-SETTINGS-SOUND-TITLE
TITLE: Folded Settings dock is named Sound and is the only mute
CATEGORY: action-discoverability
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/SettingsPanel.tsx; src/frontend/src/utils/settingsPanelCopy.ts
CURRENT_BEHAVIOUR: Folded DraggablePanel title was “Settings” (gear) with a 5px mute strip. GameFlow has no mute. Players hunting HUD sound find nothing.
DESIRED_BEHAVIOUR: Tab/chrome “Sound”; mute ≥44px; one-line hint that this dock is the only mute. Keep carved crimson/slate. Never a SaaS gear menu.
EVIDENCE: SettingsPanel.tsx defaultFolded title; GameFlow.tsx has no mute; WorldExploration.tsx ~19012 mounts the panel.
RECOMMENDED_ACTION: Copy + minHeight only. Do not change soundEngine.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: settingsPanelCopy.test.ts; unfold Sound; mute still silences SFX.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-NO-LEAVE-REALM
TITLE: Play has no way back to champion slots
CATEGORY: action-discoverability
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/utils/leaveRealmCopy.ts
CURRENT_BEHAVIOUR: showBackButton is false for currentStage === "world". World mode unmounts the select/forge header (including Log Out). No Champions control in the z-9001 cluster.
DESIRED_BEHAVIOUR: One carved “Champions” control (leaveRealmCopy) that calls handleBackToSelection. Do not use a SaaS “Switch account”. Progress stays canister-authoritative.
EVIDENCE: GameFlow.tsx ~239–241, ~244–245 vs ~419–466 Log Out on the non-world header.
RECOMMENDED_ACTION: HUMAN — GameFlow is in #335+. Copy constants added this run; do not wire unattended (layout + unmount).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Champions returns to slots without wiping canister characters; world HUD still has leftover XP/Doka.
STATUS: NEW
```

---

## New this run (not implemented — older PRs own the files)

```
ACTION_ID: UX-HAZARD-TILE-LEGEND
TITLE: Lava, ice, and spikes never name themselves before you step
CATEGORY: invalid-action-explanation
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx hazard draw ~7417; hover MP ~8513; step damage ~11424
CURRENT_BEHAVIOUR: Tiles tint and draw pixel icons. Hover in battle-walk shows only “N MP”. After the step, the battle log says lava/ice/spikes. Overworld hover has no hazard word. Lava death still skips Game Over (UX-DEATH-DUAL-MODAL).
DESIRED_BEHAVIOUR: When the hovered floor is a hazard, a 1.5s stone whisper or hover label: Lava burns / Ice slows / Spikes cut. Do not change damage math.
EVIDENCE: hoveredTile MP-cost gate is inBattle && walk; hazard overlay has no text.
RECOMMENDED_ACTION: HUMAN — WX owned. Display only on hover/float. Do not change RAF/hazard damage.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Hover lava/ice/spikes names the hazard; MP cost still shows on safe walk tiles; damage unchanged.
STATUS: NEW
```

```
ACTION_ID: UX-CHAT-PROFILE-NAME
TITLE: World chat posts the profile name, not the champion
CATEGORY: feedback
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx ChatPanel playerName; ChatPanel sendMessage
CURRENT_BEHAVIOUR: HUD name is the champion. Chat/leaderboard use userProfile.name. Two identities, no teaching.
DESIRED_BEHAVIOUR: Chat composer shows which name will send (profile vs champion). Prefer champion in public chat if that is the fantasy name. Do not change sendMessage binding without a backend review (binds to caller profile).
EVIDENCE: GameFlow.tsx ~273 playerName={userProfile.name}; AGENTS.md sendMessage binds userProfiles name.
RECOMMENDED_ACTION: HUMAN — copy in ChatPanel or send champion as display. Do not break sendMessage principal binding.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Messages still persist; displayed name matches the chosen rule.
STATUS: NEW
```

```
ACTION_ID: UX-PORTAL-XP-PENDING
TITLE: Portal +10 XP has no “what you earned” beat until persist returns
CATEGORY: reward-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx portal applyRewards ~6802
CURRENT_BEHAVIOUR: Comment forbids HUD XP until applyRewards commits. No toast/whisper “+10 XP”. Players think the whirlpool did nothing.
DESIRED_BEHAVIOUR: Stone whisper “Securing +10 leftover XP…” that does not mutate the HUD bar until commit. Failed persist must not leave a fake +10.
EVIDENCE: persistIncrementalRewards PORTAL_TRANSITION_XP; setCharacterStats only in .then.
RECOMMENDED_ACTION: HUMAN — WX owned. Toast/float only. Do not optimistic-write leftover XP.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: HUD leftover still matches committed XP; failed persist does not show +10 as kept.
STATUS: NEW
```

```
ACTION_ID: UX-SUMMON-LIFESPAN-WORDS
TITLE: Summon lifespan is pips only
CATEGORY: spell-state
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/SummonControlPanel.tsx LifespanPips
CURRENT_BEHAVIOUR: Hourglass + dots. aria-label has “Lifespan N of M”. Visible chrome does not say the ally fades after N turns.
DESIRED_BEHAVIOUR: Visible “N turns left” (carved, not SaaS). Keep pips. Do not change fade math.
EVIDENCE: SummonControlPanel.tsx ~51–83, ~303.
RECOMMENDED_ACTION: HUMAN — file is in combat PRs. Display only.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Fade still matches turnsRemaining; player bar stays muted while the summon acts.
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

### #517

- `UX-MAP-MODIFIERS-EMPTY`

### #588

- `UX-GAMEKEY-PAY-AFTER-SUBMIT`
- `UX-HEAL-TITLE-MISMATCH` (helper not wired into WX)

### #588 / #517 reported, still blocked

- `UX-BOOST-UNMOUNTED`
- `UX-FLEE-NATIVE-CONFIRM`
- `UX-SUMMON-SAAS-ORBS`
- `UX-TURN-TIMER-WHY`
- `UX-LOGIN-SILENT-BACKEND`
- `UX-BOOST-MODE-TEACHING`
- `UX-BOOST-MAP-EFFECTS-DUP`
- `UX-STAT-ABBREV-GLOSSARY`
- `UX-BOARD-LABEL`

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
RECOMMENDED_ACTION: Human-approved unify. Do not rewire deathGuards unattended.
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
ACTION_ID: UX-PORTAL-LEGEND
TITLE: Only dungeon portals explain themselves
CATEGORY: portal-clarity
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx portal draw
CURRENT_BEHAVIOUR: Nearby dungeon / chain draw labels. Rest, boss, colored, white sanctuary, Death Realm exits do not. dungeonChainActive can label every nearby kind.
DESIRED_BEHAVIOUR: Within 3 tiles, short carved labels per kind.
EVIDENCE: Label gated on dungeon || dungeonChainActive.
RECOMMENDED_ACTION: HUMAN — WX owned. Do not change spawn rules.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Each kind distinct; dungeon still shows depth.
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
ACTION_ID: UX-CHALLENGE-ZINDEX
TITLE: Challenge offer sits under the realm tool cluster
CATEGORY: modal-conflicts
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: ChallengePanel.tsx; GameFlow.tsx
CURRENT_BEHAVIOUR: Challenge z-index 1200; tools z-9001.
DESIRED_BEHAVIOUR: Offer above tools, below recap z-9999.
EVIDENCE: ChallengePanel zIndex 1200.
RECOMMENDED_ACTION: HUMAN — raising z-index can steal canvas clicks (#364).
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
EVIDENCE: bossRushState.active overlay border #FF69B4.
RECOMMENDED_ACTION: Restyle only after WX PRs land.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Room counter still currentRoom + 1 / 10.
STATUS: OPEN
```

```
ACTION_ID: UX-FLEE-NATIVE-CONFIRM
TITLE: Flee uses a native window.confirm
CATEGORY: modal-conflicts
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx ~522; WorldExploration.tsx ~18930
CURRENT_BEHAVIOUR: OS dialog. WX adds a second confirm for Boss Rush / Dungeon Chain.
DESIRED_BEHAVIOUR: Carved stone confirm matching Game Over. Keep explicit confirm (no one-click flee).
EVIDENCE: window.confirm in BattleUIPanel Flee; WX _s2Confirmed.
RECOMMENDED_ACTION: HUMAN — do not change flee → deathGuards.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Cancel leaves the fight; confirm still 20/40 Death Realm.
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
RECOMMENDED_ACTION: HUMAN — LandingPage is in #368/#372.
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
FILES_OR_SYSTEMS: src/frontend/index.html; GameFlow.tsx header
CURRENT_BEHAVIOUR: Tab/OG Paper Baby Vampires; landing ÆSTRALTØ.
DESIRED_BEHAVIOUR: One player-facing name. Do not retitle unattended.
EVIDENCE: index.html title; GameFlow “Paper Baby Vampires”.
RECOMMENDED_ACTION: Human product-name call.
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
FILES_OR_SYSTEMS: GameFlow.tsx; AchievementsPanel.tsx; PostBattleRecap.tsx
CURRENT_BEHAVIOUR: Tool cluster Feats; title Achievements.
DESIRED_BEHAVIOUR: One player-facing word. Prefer Feats.
EVIDENCE: GameFlow span Feats. #354 owns recap/dialog.
RECOMMENDED_ACTION: Do not duplicate #354.
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

---

## Closed / do not reopen this run

- `UX-HUD-DUPLICATE-TOPBAR` — keep GameFlow spacer; do not restore dummy XP bar.
- `UX-RECAP-XP-CURVE` — leftover XP is correct; do not recolor Dofus purple fill to gold.
- `UX-BLOOD-DEAD-BAR` — inert Blood chip stays gone.
- `UX-IAP-KYC-SURPRISE` — GameKey email + consent.
- `UX-VITALS-ORB-MAX` — side-panel jewels use vitalsOrbCaps.
- `UX-CREATE-NO-STATS` — forge vitals row is on main.
- `UX-ENEMY-REGISTER-LORE` — honesty banner is on main.

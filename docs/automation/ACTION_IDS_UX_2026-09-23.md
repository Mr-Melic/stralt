# ACTION_ID catalog — 2026-09-23 UX audit

Stable IDs for the daily player-journey auditor. STATUS values: NEW | OPEN | IMPLEMENTED_THIS_RUN | IMPLEMENTED | SUPERSEDED.

Reuse IDs from [`ACTION_IDS_UX_2026-09-02.md`](./ACTION_IDS_UX_2026-09-02.md), PR #372 (2026-09-21), and PR #421 (2026-09-22) when the finding is the same. Do not mint twins.

HEAD: `0f5363f`. DESIGN.md preserved.

---

## Implemented this run (display-only)

```
ACTION_ID: UX-CHANGELOG-CACHE-COPY
TITLE: Changelog says canister champions survive a version-gate cache refresh
CATEGORY: launch
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/App.tsx ChangelogPopup
CURRENT_BEHAVIOUR: Overlay subtitle was SaaS “Game updated — please review before playing.” Version bump still wipes most localStorage and forces II.
DESIRED_BEHAVIOUR: Carved copy: champions on the canister stay; this device only refreshed its local cache. Do not bump APP_VERSION. Do not change versionGate wipe list.
EVIDENCE: ChangelogPopup vs collectPreservedLocalStorage / APP_VERSION v163.
RECOMMENDED_ACTION: Rewrite the subtitle. Keep Got it — let me play.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: changelogCacheCopy.test.ts; next bump still shows the overlay after II.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-EMPTY-SLOT-FORGE
TITLE: Empty slot CTA matches the forge, not a generic Create Character
CATEGORY: action-discoverability
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterSelection.tsx EmptySlot
CURRENT_BEHAVIOUR: Button said Create Character. Welcome line said create a new one. Forge screen is Forge a Champion.
DESIRED_BEHAVIOUR: Forge a Champion + hover “Name a piece, pick colors, then Play from this slot.” Welcome: select a champion or forge a new one. Keep Empty Slot label. Do not change className (PR #425 adds stone-touch-target).
EVIDENCE: character_selection.create_button vs CharacterCreation h1.
RECOMMENDED_ACTION: Copy + aria only.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: characterSelectionForgeCopy.test.ts; Create still opens CharacterCreation for that slot.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-DELETE-CHAMPION-COPY
TITLE: Delete explains the slot stays, not SaaS cannot-be-undone
CATEGORY: feedback
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterSelection.tsx FilledSlot
CURRENT_BEHAVIOUR: “Delete name? This action cannot be undone.”
DESIRED_BEHAVIOUR: “Remove name from this slot? You can forge another in its place.” Same Delete confirm; still calls deleteCharacter.
EVIDENCE: character_selection.delete_confirm_button dialog.
RECOMMENDED_ACTION: Description copy only.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: characterSelectionForgeCopy.test.ts; Confirm still mutates that slot.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-BOSS-GUIDE-NEXT
TITLE: Boss Guide says where to walk next
CATEGORY: action-discoverability
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BossGuideModal.tsx header
CURRENT_BEHAVIOUR: Title Boss Guide then a dump of kits. No “what should I do / where next.”
DESIRED_BEHAVIOUR: One stone line: purple whirlpool starts a fight; Boss Rush is a separate ten-room chain. Do not change portal spawn or completeBossRushRoom. Union #425 Escape listener.
EVIDENCE: Bosses tool cluster opens this modal; portals unlabeled (UX-PORTAL-LEGEND).
RECOMMENDED_ACTION: Header subtitle only.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: bossGuideCopy.test.ts; Escape still closes after #425 lands.
STATUS: IMPLEMENTED_THIS_RUN
```

---

## Implemented on main since 2026-09-02 (do not reopen)

- `UX-SPELL-OVERWORLD-MUTED` — BattleUIPanel `!inBattle` disable + fight-first hover.
- `UX-CHALLENGE-FAIL-COPY` — `challengeFailCopy()`.
- `UX-PROFILE-NAME-HINT` — Profile 2–50 + maxLength 50.
- `UX-CREATE-NO-STATS` — starting HP/AP/MP/INIT row.
- `UX-ENEMY-REGISTER-LORE` — FLAVOR LORE + honesty banner.
- `UX-VITALS-ORB-MAX` — `vitalsOrbCaps`.
- `UX-BLOOD-DEAD-BAR` — inert Blood chip stays gone.
- `UX-GAMEKEY-STEP-ORDER` — `IAP_SHOP_STEPS` wired; email before Mollie QR.
- `UX-GAMEKEY-STATUS-STALE` — redeem path calls `loadStatus()` after `#ok`.
- `UX-CHANGELOG-ACCURACY` — bullets match GameKey / two shops / Death Realm / leftover XP (still v163).
- `UX-HUD-DUPLICATE-TOPBAR` — keep GameFlow spacer.
- `UX-RECAP-XP-CURVE` — leftover XP; do not recolor Dofus purple fill.
- `UX-IAP-KYC-SURPRISE` — email + consent.

---

## Queued in older open PRs (do not duplicate this run)

### #372 (2026-09-21 UX)

- `UX-FORGE-NAME-HINT`
- `UX-PROFILE-ERROR-ALERT`
- `UX-LANDING-ADMIN-ARIA`
- `UX-ITEMS-TITLE`
- `UX-GAMEKEY-PASTE-WHITESPACE`
- `UX-SUMMON-UPGRADE-TAX`
- `UX-CHALLENGE-ACCEPT-WINDOW`

### #421 (2026-09-22 UX)

- `UX-SELECTION-PBV-HEADING`
- `UX-SELECTION-XP-THIS-LEVEL`
- `UX-SELECTION-PLAY-HINT`
- `UX-SELECTION-ERROR-ALERT`
- `UX-GAMEOVER-PENALTY-COPY`

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
CURRENT_BEHAVIOUR: Combat death: Game Over modal (“Enter the Death Realm”). Lava/spikes: root recap then 1.5s auto Death Realm with no Game Over.
DESIRED_BEHAVIOUR: One carved death path: −20% leftover XP / −40% Doka, then Death Realm, walk to a portal.
EVIDENCE: _handlePlayerDeath setShowGameOver(true); HP-watch onShowBattleSummary + setTimeout 1500ms; toast “You have fallen...” after 1.5s.
RECOMMENDED_ACTION: Human-approved unify. Do not rewire deathGuards in an unattended run.
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
FILES_OR_SYSTEMS: WorldExploration.tsx; LandingPage.tsx; CharacterCreation.tsx
CURRENT_BEHAVIOUR: After Play: isometric map, unlabeled whirlpools, no “click a tile to walk,” no “step onto an enemy to fight.”
DESIRED_BEHAVIOUR: One dismissible carved-stone coach on first world enter. Never a SaaS tooltip tour.
EVIDENCE: No firstVisit/tutorial strings in WorldExploration.
RECOMMENDED_ACTION: Human-written 3-line coach, once per slot (localStorage cache only).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: First Play shows coach; second does not; never blocks portals or combat.
STATUS: OPEN
```

```
ACTION_ID: UX-PORTAL-LEGEND
TITLE: Only dungeon portals explain themselves
CATEGORY: portal-clarity
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx portal draw ~7916
CURRENT_BEHAVIOUR: Nearby dungeon / chain draw “Enter Dungeon Chain” / “Continue Chain (d/max)”. Rest, boss, colored, white sanctuary, Death Realm exits have no label. When dungeonChainActive, the nearby-label branch is true for every portal kind.
DESIRED_BEHAVIOUR: Within 3 tiles, short carved labels: Explore / Rest / Boss / Dungeon / Sanctuary / Death Realm exit. Chain copy only on chain portals.
EVIDENCE: Label gated on p.color === "dungeon" || dungeonChainActive.
RECOMMENDED_ACTION: Extend nearby-label path. Do not change spawn rules. Union with older WX PRs.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Each kind shows a distinct label; dungeon copy still shows depth.
STATUS: OPEN
```

```
ACTION_ID: UX-CAST-FAIL-FEEDBACK
TITLE: Illegal walks still mostly write the battle log
CATEGORY: invalid-action-explanation
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx; BattleUIPanel.tsx; ChatPanel.tsx
CURRENT_BEHAVIOUR: Many illegal player casts spawn canvas float text. Walk “Can't reach” / “Not enough MP” still logBattleEntry. Open PR #363 floats some summon-control / Attack Nearest rejects.
DESIRED_BEHAVIOUR: Same 1.5s stone whisper/float for remaining walk rejects. Do not change targeting math.
EVIDENCE: WorldExploration walk reject path.
RECOMMENDED_ACTION: HUMAN — union with #327/#331/#340/#363. Mirror spawnFloatText only.
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
FILES_OR_SYSTEMS: GameFlow.tsx Items; WorldExploration.tsx cart ~17786
CURRENT_BEHAVIOUR: Items opens BuffShop (still titled Item Shop on main; #372 retitles Items). Cart next to the Doka chip is icon-only ShoppingCart (title/aria “Buy Doka”).
DESIRED_BEHAVIOUR: Visible “Buy Doka” label on the HUD control. Never both read as Shop.
EVIDENCE: WorldExploration shop.open_modal_button; GameFlow Items cluster.
RECOMMENDED_ACTION: HUMAN layout/copy on WX after older PRs land. Do not change purchase APIs.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: Items still buys buffs; cart still opens GameKey.
STATUS: OPEN
```

```
ACTION_ID: UX-LEVEL-UP-CHROME
TITLE: Recap never celebrates a level-up
CATEGORY: reward-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: PostBattleRecap.tsx; WorldExploration applyRewards
CURRENT_BEHAVIOUR: Level-up can play a sound. Recap lists leftover XP / Doka / feats with no LEVEL UP carved banner. Continue says “Continue Exploring.”
DESIRED_BEHAVIOUR: One stone LEVEL UP beat when applyRewards actually raised level. Do not invent a second XP curve.
EVIDENCE: PostBattleRecap has no levelUp/LEVEL string; RecapSection titles only.
RECOMMENDED_ACTION: HUMAN — PostBattleRecap is in #354. Display only after rewards persist.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Recap after a true level-up shows the banner; no-level-up recap stays quiet; leftover XP still leftover.
STATUS: OPEN
```

```
ACTION_ID: UX-HUD-TOOL-CLUSTER
TITLE: Realm tools float over the map instead of living in one bar
CATEGORY: hud-crowding
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx z-9001; WorldExploration header
CURRENT_BEHAVIOUR: Live HUD is name, level, Map #, leftover XP, Doka, cart, region. GameFlow pins Items / Board / Feats / Bosses under a 44px spacer.
DESIRED_BEHAVIOUR: One carved-stone header. Overflow (⋯) or a second row that does not cover XP/Doka.
EVIDENCE: GameFlow tool cluster ~294; WorldExploration header.
RECOMMENDED_ACTION: Human layout. Do not restore the dummy 0/100 overlay bar. Union #335.
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
CURRENT_BEHAVIOUR: Challenge panel z-index 1200; GameFlow tools z-9001. Default challenge pos is lower-right, but a dragged or short viewport can cover Accept.
DESIRED_BEHAVIOUR: Offer paints above realm tools, below recap (z-9999) and Game Over.
EVIDENCE: ChallengePanel zIndex 1200; GameFlow z-[9001].
RECOMMENDED_ACTION: HUMAN — raising z-index can steal canvas clicks (#364). Do not ship unattended.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Accept still clickable at 768 and 1280 with the tool cluster open.
STATUS: OPEN
```

```
ACTION_ID: UX-AP-MP-CURRENT-MAX
TITLE: Battle AP/MP orbs do not print current / max
CATEGORY: ap-mp-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Header shows “N AP” / “N MP” plus a 30px mini bar using maxBattleAp/Mp.
DESIRED_BEHAVIOUR: Carved “6 / 10 AP” (and MP) so the bar is not the only max cue. Keep DESIGN.md orb jewels.
EVIDENCE: BattleUIPanel resources row ~412 currentBattleAp without max in the numeral.
RECOMMENDED_ACTION: HUMAN — BattleUIPanel is in #335/#340. Display only; do not change spend math.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Max still matches characterStats.ap/mp; overworld mute unchanged.
STATUS: OPEN
```

```
ACTION_ID: UX-BOSS-RUSH-PINK
TITLE: Boss Rush room chip uses arcade pink
CATEGORY: visual-hierarchy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx ~17586
CURRENT_BEHAVIOUR: “Boss Rush — Room n / 10” is #FF69B4 on magenta. Dungeon chain uses carved crimson.
DESIRED_BEHAVIOUR: Same stone + gold/crimson family as the dungeon depth pill. Keep room n/10.
EVIDENCE: bossRushState.active overlay border #FF69B4.
RECOMMENDED_ACTION: Restyle only after WX PRs land. Do not change room indexing or completeBossRushRoom.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Room counter still matches currentRoom + 1 / 10.
STATUS: OPEN
```

```
ACTION_ID: UX-VERSION-FORCE-RELOGIN
TITLE: App version bump wipes local cache and forces re-login
CATEGORY: feedback
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: App.tsx APP_VERSION / versionGate
CURRENT_BEHAVIOUR: Mismatch clears localStorage (preserve list), reloads, changelog after II. APP_VERSION still v163. Overlay copy now says canister champions stay (UX-CHANGELOG-CACHE-COPY).
DESIRED_BEHAVIOUR: Show changelog on landing, then ask to sign in. Do not imply a wipe of canister progress. Do not bump APP_VERSION from a copy pass.
EVIDENCE: App.tsx const APP_VERSION = "v163".
RECOMMENDED_ACTION: Human: stop forcing II re-auth or add landing copy.
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
FILES_OR_SYSTEMS: App.tsx SmallScreenGuard; DESIGN.md
CURRENT_BEHAVIOUR: Guard offers Continue anyway. DESIGN.md wants ≥44px targets and a sticky bottom menu. 390px still overlaps the desktop HUD.
DESIRED_BEHAVIOUR: Product call: tablet floor, or stacked HUD for 768 landscape first.
EVIDENCE: SmallScreenGuard; no mobile HUD reflow in WorldExploration.
RECOMMENDED_ACTION: Report-only until a human picks a mobile scope.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH if the guard is removed without a HUD reflow.
VALIDATION_REQUIRED: 768 and 390-wide viewports after any policy change.
STATUS: OPEN
```

```
ACTION_ID: UX-FEATS-VS-ACHIEVEMENTS
TITLE: Feats button vs Achievements chrome
CATEGORY: action-discoverability
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx; AchievementsPanel.tsx; PostBattleRecap.tsx
CURRENT_BEHAVIOUR: Tool cluster label is Feats; title/aria Achievements; recap says Achievements Unlocked.
DESIRED_BEHAVIOUR: One player-facing word. Prefer Feats in chrome if that is the fantasy name.
EVIDENCE: GameFlow span Feats + title Achievements. Older open PR #354 retitles recap/dialog chrome.
RECOMMENDED_ACTION: Do not duplicate — #354 already owns those files.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Panel still claims rewards; recap still lists unlocks.
STATUS: OPEN
```

```
ACTION_ID: UX-LANDING-VERSION
TITLE: Landing footer still prints v1.0 while APP_VERSION is v163
CATEGORY: launch
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: LandingPage.tsx; App.tsx APP_VERSION
CURRENT_BEHAVIOUR: Barely-visible v1.0 is the admin triple-click easter egg. Players who notice it think the build is 1.0.
DESIRED_BEHAVIOUR: Keep the hidden admin trigger; do not print a fake product version. Optional: show APP_VERSION elsewhere after login.
EVIDENCE: Visible v1.0 vs const APP_VERSION = "v163". Aria still says v1.0 on main (#372 changes aria only).
RECOMMENDED_ACTION: Human: keep easter egg, change visible string or leave as camouflage.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if the triple-click target is removed.
VALIDATION_REQUIRED: Triple-click still opens admin prompt.
STATUS: OPEN
```

```
ACTION_ID: UX-LAUNCH-TAB-TITLE
TITLE: Browser tab and forge header still say Paper Baby Vampires
CATEGORY: launch
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/index.html; GameFlow.tsx header
CURRENT_BEHAVIOUR: <title> and OG tags are Paper Baby Vampires; GameFlow select/forge h1 is Paper Baby Vampires; landing chrome is ÆSTRALTØ. Selection h1 still uses the leftover nickname on main (UX-SELECTION-PBV-HEADING in #421).
DESIRED_BEHAVIOUR: One player-facing name on the tab and the logged-in wordmark. Do not turn the landing into generic SaaS.
EVIDENCE: index.html title; GameFlow.tsx “Paper Baby Vampires”; LandingPage ÆSTRALTØ heading.
RECOMMENDED_ACTION: Human product-name call. Do not retitle unattended. Do not edit GameFlow while #335 owns it.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Favicon and landing heading still match the chosen name.
STATUS: OPEN
```

```
ACTION_ID: UX-IDENTITY-FONT-DRIFT
TITLE: Live type and color tokens still drift from DESIGN.md
CATEGORY: visual-hierarchy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: DESIGN.md; index.css; LandingPage.tsx; index.html
CURRENT_BEHAVIOUR: Brief specifies Space Grotesk / Inter / OKLCH-only. CSS uses Baloo 2 / Saira; many headings use serif.
DESIRED_BEHAVIOUR: New chrome uses DESIGN.md tokens. Do not run a repo-wide hex rewrite. Never generic SaaS UI.
EVIDENCE: DESIGN.md Typography; index.css --font-display; index.html Google fonts.
RECOMMENDED_ACTION: Next new screen only. Forbid shadcn gray/purple on player-facing dialogs.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH for a global color sweep.
VALIDATION_REQUIRED: Side-by-side with DESIGN.md; gold-on-navy ≥ 4.5:1.
STATUS: OPEN
```

```
ACTION_ID: UX-SPELLBOOK-EMPTY-ADMIN
TITLE: Empty spellbook blames a missing admin catalog
CATEGORY: spells
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: SpellbookModal.tsx empty_state
CURRENT_BEHAVIOUR: “The admin has not added any spells yet.” Live builds seed a catalog; this line is a leak if it ever shows.
DESIRED_BEHAVIOUR: Player copy: “No spells in the catalog yet.” Do not mention admin. #372 / #425 already own this file — do not restack this run.
EVIDENCE: spellbook.empty_state.
RECOMMENDED_ACTION: Copy after those PRs land.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Empty catalog still opens the book; Confirm All unchanged.
STATUS: OPEN
```

---

## Closed / do not reopen this run

- `UX-HUD-DUPLICATE-TOPBAR` — keep GameFlow spacer; do not restore dummy XP bar.
- `UX-RECAP-XP-CURVE` — leftover XP is correct; do not recolor Dofus purple fill to gold.
- `UX-BLOOD-DEAD-BAR` — inert Blood chip stays gone.
- `UX-IAP-KYC-SURPRISE` — GameKey email + consent.
- `UX-VITALS-ORB-MAX` — side-panel jewels use vitalsOrbCaps.

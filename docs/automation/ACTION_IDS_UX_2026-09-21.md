# ACTION_ID catalog — 2026-09-21 UX audit

Stable IDs for the daily player-journey auditor. STATUS values: NEW | OPEN | IMPLEMENTED_THIS_RUN | IMPLEMENTED | SUPERSEDED.

Reuse IDs from [`ACTION_IDS_UX_2026-09-02.md`](./ACTION_IDS_UX_2026-09-02.md) when the finding is the same. Do not mint twins.

HEAD: `0f5363f`. DESIGN.md preserved.

---

## Implemented this run (display-only)

```
ACTION_ID: UX-FORGE-NAME-HINT
TITLE: Champion name length on the forge form
CATEGORY: character-creation
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterCreation.tsx
CURRENT_BEHAVIOUR: maxLength 20 with no helper; profile name already explains 2–50.
DESIRED_BEHAVIOUR: Visible “Up to 20 characters” under the field (backend champion name cap).
EVIDENCE: CharacterCreation.tsx name input; main.mo character name <= 20.
RECOMMENDED_ACTION: Helper + aria-describedby. Do not change save payload.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Type 20 chars; 21 blocked; helper visible.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-PROFILE-ERROR-ALERT
TITLE: Profile save errors announced to assistive tech
CATEGORY: feedback
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ProfileSetup.tsx
CURRENT_BEHAVIOUR: Error box had no role; landing login already uses role="alert".
DESIRED_BEHAVIOUR: role="alert" on profile_setup.error_state.
EVIDENCE: ProfileSetup.tsx error div vs LandingPage login error.
RECOMMENDED_ACTION: Add role="alert".
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Failed save still shows the same copy.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-LANDING-ADMIN-ARIA
TITLE: Admin camouflage must not announce a fake product version
CATEGORY: launch
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/LandingPage.tsx
CURRENT_BEHAVIOUR: Visible v1.0 (intentional camouflage) with aria-label="v1.0" while APP_VERSION is v163.
DESIRED_BEHAVIOUR: Keep visible v1.0 + triple-click; aria-label is not a product version.
EVIDENCE: LandingPage.tsx admin trigger vs App.tsx APP_VERSION.
RECOMMENDED_ACTION: aria-label="Hidden admin trigger". Do not remove the easter egg.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Triple-click still opens admin prompt.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-ITEMS-TITLE
TITLE: Potion modal title matches the Items door
CATEGORY: action-discoverability
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BuffShop.tsx
CURRENT_BEHAVIOUR: GameFlow button said Items; modal said Item Shop.
DESIRED_BEHAVIOUR: Title and aria-label Items.
EVIDENCE: GameFlow.tsx Items cluster; BuffShop header.
RECOMMENDED_ACTION: Rename chrome only. Do not change spend lock or inventory keys.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Items still buys buffs; inventory tab still consumes stacks.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-GAMEKEY-PASTE-WHITESPACE
TITLE: Trim GameKey on paste and validate
CATEGORY: shop
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/dokaGameKey.ts; DokaGameKeyShop.tsx
CURRENT_BEHAVIOUR: Trailing newline / spaces made a 120-char key look wrong until submit; redeem only trim()ed ends.
DESIRED_BEHAVIOUR: Strip all whitespace on input and redeem, then validate 120-char alphabet.
EVIDENCE: validateGameKeyFormat vs paste; GAME_KEY_LENGTH 120.
RECOMMENDED_ACTION: normalizeGameKeyInput; older GameKey PRs from 2026-09-02 have landed.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Paste with newline; dokaGameKey.normalize.test.ts.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-SUMMON-UPGRADE-TAX
TITLE: Spellbook names the 10× summon Doka tax
CATEGORY: upgrades
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/SpellbookModal.tsx
CURRENT_BEHAVIOUR: Summon rank-up already charged 10×; expanded Cost row was a bare number.
DESIRED_BEHAVIOUR: One carved line: “Summon rank-up costs 10× the usual Doka.”
EVIDENCE: SpellbookModal upgradeCost + SUMMON_UPGRADE_COST_MULTIPLIER.
RECOMMENDED_ACTION: Display-only line when isSummon && summonUnitDef. Do not change spellUpgradeUiSpend.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Non-summon cards stay silent; summon expanded card shows 10×.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-CHALLENGE-ACCEPT-WINDOW
TITLE: Challenge offer explains Accept vs Skip bonus
CATEGORY: encounter
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/ChallengePanel.tsx
CURRENT_BEHAVIOUR: Accept / Decline with no “first action kills the offer” copy. Decline hid the bonus with a generic word.
DESIRED_BEHAVIOUR: Hint: accept before move/cast. Decline labeled Skip bonus.
EVIDENCE: WorldExploration visible={inBattle && !firstActionTaken}; markFirstAction drops unaccepted offer.
RECOMMENDED_ACTION: Copy only. Do not change shouldShowChallengeHud or persist.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Accept still locks bonus; Skip bonus still fights without extra Doka/XP.
STATUS: IMPLEMENTED_THIS_RUN
```

---

## Implemented on main since 2026-09-02 (do not reopen)

- `UX-SPELL-OVERWORLD-MUTED` — BattleUIPanel `!inBattle` disable + fight-first hover.
- `UX-CHALLENGE-FAIL-COPY` — `challengeFailCopy()`.
- `UX-PROFILE-NAME-HINT` — Profile 2–50 + maxLength 50.
- `UX-CREATE-NO-STATS` — starting HP/AP/MP/INIT row.
- `UX-ENEMY-REGISTER-LORE` — FLAVOR LORE + honesty banner (register still not live spawn).
- `UX-VITALS-ORB-MAX` — `vitalsOrbCaps`.
- `UX-BLOOD-DEAD-BAR` — inert Blood chip stays gone.
- `UX-GAMEKEY-STEP-ORDER` — `IAP_SHOP_STEPS` wired; email before Mollie QR.
- `UX-GAMEKEY-STATUS-STALE` — redeem path calls `loadStatus()` after `#ok`.
- `UX-CHANGELOG-ACCURACY` — bullets match GameKey / two shops / Death Realm / leftover XP (still v163).
- `UX-HUD-DUPLICATE-TOPBAR` — keep GameFlow spacer.
- `UX-RECAP-XP-CURVE` — leftover XP; do not recolor Dofus purple fill.
- `UX-IAP-KYC-SURPRISE` — email + consent.

---

## Open (human / blocked by older PRs)

Do not edit `WorldExploration.tsx`, `GameFlow.tsx`, `BattleUIPanel.tsx`, `AchievementsPanel.tsx`, or `PostBattleRecap.tsx` in this auditor PR. Older still-open PRs already own those files (#327, #331, #335, #340, #354).

```
ACTION_ID: UX-DEATH-DUAL-MODAL
TITLE: Two overlapping death UIs
CATEGORY: death
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx; GameOverModal.tsx; PostBattleRecap; persistDeathPenalty
CURRENT_BEHAVIOUR: Combat death: Game Over modal (“Enter the Death Realm”). Lava/spikes: root recap then 1.5s auto Death Realm.
DESIRED_BEHAVIOUR: One carved death path: −20% leftover XP / −40% Doka, then Death Realm, walk to a portal.
EVIDENCE: _handlePlayerDeath setShowGameOver(true); HP-watch onShowBattleSummary + setTimeout 1500ms.
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
FILES_OR_SYSTEMS: WorldExploration.tsx portal draw
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
TITLE: Illegal walks and summon-control casts still mostly write the battle log
CATEGORY: invalid-action-explanation
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx; BattleUIPanel.tsx; ChatPanel.tsx
CURRENT_BEHAVIOUR: Many illegal player casts spawn canvas float text. Walk “Can't reach” / “Not enough MP” and summonControlCastFailMessage still logBattleEntry only.
DESIRED_BEHAVIOUR: Same 1.5s stone whisper/float for walk and summon-control rejects. Do not change targeting math.
EVIDENCE: WorldExploration walk path ~10086–10099; summon control ~9844. Open PR #363 (newer) floats summon-control / Attack Nearest rejects — union, do not duplicate.
RECOMMENDED_ACTION: HUMAN — WorldExploration already in #327/#331/#340. Mirror spawnFloatText only.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: AP-starved, out-of-range, MP-starved, and summon-control clicks each show a reason once.
STATUS: OPEN
```

```
ACTION_ID: UX-SHOP-TWO-STORES
TITLE: Items and Buy Doka still feel like one shop
CATEGORY: action-discoverability
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx Items; WorldExploration.tsx cart
CURRENT_BEHAVIOUR: Items opens BuffShop (now titled Items). Cart next to the Doka chip is icon-only ShoppingCart (title/aria “Buy Doka”) and opens GameKey IAP. Two cart icons.
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
ACTION_ID: UX-HUD-TOOL-CLUSTER
TITLE: Realm tools float over the map instead of living in one bar
CATEGORY: hud-crowding
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: GameFlow.tsx z-9001; WorldExploration header
CURRENT_BEHAVIOUR: Live HUD is name, level, Map #, leftover XP, Doka, cart, region. GameFlow pins Items / Board / Feats / Bosses under a 44px spacer.
DESIRED_BEHAVIOUR: One carved-stone header. Overflow (⋯) or a second row that does not cover XP/Doka.
EVIDENCE: GameFlow tool cluster; WorldExploration header.
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
RECOMMENDED_ACTION: HUMAN — raising z-index can steal canvas clicks. Do not ship unattended.
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
EVIDENCE: BattleUIPanel resources row currentBattleAp without max in the numeral.
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
FILES_OR_SYSTEMS: WorldExploration.tsx boss rush overlay
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
CURRENT_BEHAVIOUR: Mismatch clears localStorage (preserve list), reloads, changelog after II. APP_VERSION still v163 after many player-facing merges.
DESIRED_BEHAVIOUR: Show changelog on landing, then ask to sign in. Do not imply a wipe of canister progress. Do not bump APP_VERSION from a copy pass.
EVIDENCE: App.tsx APP_VERSION path.
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
EVIDENCE: GameFlow span Feats + title Achievements; RecapSection title Achievements Unlocked.
RECOMMENDED_ACTION: Do not duplicate — older open PR #354 already retitles recap/dialog chrome.
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
CURRENT_BEHAVIOUR: Barely-visible v1.0 is the admin triple-click easter egg. Players who notice it think the build is 1.0. Aria no longer says v1.0 (UX-LANDING-ADMIN-ARIA).
DESIRED_BEHAVIOUR: Keep the hidden admin trigger; do not print a fake product version. Optional: show APP_VERSION elsewhere after login.
EVIDENCE: Visible v1.0 vs const APP_VERSION = "v163".
RECOMMENDED_ACTION: Human: keep easter egg, change visible string or leave as camouflage.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if the triple-click target is removed.
VALIDATION_REQUIRED: Triple-click still opens admin prompt.
STATUS: OPEN
```

```
ACTION_ID: UX-LAUNCH-TAB-TITLE
TITLE: Browser tab still says Paper Baby Vampires
CATEGORY: launch
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/index.html
CURRENT_BEHAVIOUR: <title> and OG tags are Paper Baby Vampires; landing chrome is ÆSTRALTØ.
DESIRED_BEHAVIOUR: One player-facing name on the tab. Do not turn the landing into generic SaaS.
EVIDENCE: index.html title vs LandingPage ÆSTRALTØ heading.
RECOMMENDED_ACTION: Human product-name call. Do not retitle unattended.
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

---

## Closed / do not reopen this run

- `UX-HUD-DUPLICATE-TOPBAR` — keep GameFlow spacer; do not restore dummy XP bar.
- `UX-RECAP-XP-CURVE` — leftover XP is correct; do not recolor Dofus purple fill to gold.
- `UX-BLOOD-DEAD-BAR` — inert Blood chip stays gone.
- `UX-IAP-KYC-SURPRISE` — GameKey email + consent.
- `UX-VITALS-ORB-MAX` — side-panel jewels use vitalsOrbCaps.

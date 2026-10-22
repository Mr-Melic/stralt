# ACTION_ID catalog — 2026-10-22 UX audit

Stable IDs for the daily player-journey auditor. STATUS values: NEW | OPEN | IMPLEMENTED_THIS_RUN | IMPLEMENTED | SUPERSEDED.

Reuse IDs from [`ACTION_IDS_UX_2026-10-21.md`](./ACTION_IDS_UX_2026-10-21.md) (open PR #830) and older UX PRs when the finding is the same. Do not mint twins.

HEAD: `0f5363f` (unchanged since 2026-09-21). DESIGN.md preserved.

---

## Copy locked this run (not wired — older PRs own the hosts)

```
ACTION_ID: UX-INSPECT-STAT-WORDS
TITLE: Inspect and Statistics acronyms have no titles
CATEGORY: enemy-information
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/inspectStatCopy.ts; StatPopup.tsx; WorldExploration.tsx Statistics (origin/main, untouched)
CURRENT_BEHAVIOUR: SP / SR / RES / CHC / INIT / FAIL print as three-letter chips. No hover names Spell Power, Spell Resist, Resistance, Crit Chance, Initiative, or Fail.
DESIRED_BEHAVIOUR: title/aria from inspectStatTitle. Keep the short labels. Never a SaaS glossary modal.
EVIDENCE: StatPopup.tsx ~36–42, ~189–198; WorldExploration.tsx ~18527–18563.
RECOMMENDED_ACTION: Wire inspectStatTitle after StatPopup / WX PRs land. Do not change combat math.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: inspectStatCopy.test.ts; inspect still opens from initiative chips; FAIL numeral unchanged until UX-FAIL-INSPECT-ZERO.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-HUD-XP-LEFTOVER-LABEL
TITLE: Live HUD XP strip never says leftover / this level
CATEGORY: reward-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/hudXpCopy.ts; WorldExploration.tsx (origin/main, untouched)
CURRENT_BEHAVIOUR: Center strip prints “XP” plus leftover/threshold numerals. Changelog and recap already describe leftover. The HUD does not.
DESIRED_BEHAVIOUR: Keep the numerals. Title/aria HUD_XP_TITLE (“Leftover XP in this level — not a lifetime total”). Do not restore the dummy GameFlow 0/100 bar. Do not recolor Dofus purple.
EVIDENCE: WorldExploration.tsx ~17741–17778.
RECOMMENDED_ACTION: Wire hudXpCopy after WX PRs land. Do not change xpHudProgress / applyRewards.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: hudXpCopy.test.ts; leftover after applyRewards still leftover; GameFlow spacer only.
STATUS: IMPLEMENTED_THIS_RUN
```

---

## New this run (not implemented)

```
ACTION_ID: UX-FAIL-INSPECT-ZERO
TITLE: Inspect FAIL is hardcoded 0 while Statistics uses live fail chance
CATEGORY: enemy-information
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx CharacterStats.fail; BattleUIPanel unitStats.fail; StatPopup FAIL chip
CURRENT_BEHAVIOUR: characterStats.fail is always 0. Initiative inspect shows FAIL 0. Side-panel Statistics prints spellFailChance from levelUpConfig (base minus per-level reduction).
DESIRED_BEHAVIOUR: One FAIL number. Prefer live spellFailChance on the player inspect chip. Enemy FAIL stays the unit’s fail. Pair with inspectStatTitle.
EVIDENCE: WorldExploration.tsx ~3244 fail: 0 vs ~3646–3650 spellFailChance vs StatPopup ~197 stats.fail ?? 0.
RECOMMENDED_ACTION: HUMAN — pass spellFailChance into player inspect. Do not invent a persisted fail field.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM if a new CharacterStats field is added
VALIDATION_REQUIRED: Player inspect FAIL matches Statistics; enemy inspect unchanged; fizzle still spends AP.
STATUS: NEW
```

```
ACTION_ID: UX-CHAT-DEFAULT-OPEN
TITLE: Chat starts unfolded over the first map
CATEGORY: hud-crowding
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: ChatPanel.tsx defaultFolded; MapModifiersPanel defaultFolded
CURRENT_BEHAVIOUR: Chat defaultFolded={false} at z-9000, bottom-right. Map Effects also starts open. First Play already has no coach (UX-ONBOARD-FIRST-MAP).
DESIRED_BEHAVIOUR: Fold Chat (and Map Effects) on first visit; keep the title bar reachable. Never a SaaS “minimize widget”. Debug stays reachable from the Chat gear (AGENTS.md debug overlay).
EVIDENCE: ChatPanel.tsx ~1114–1123; MapModifiersPanel.tsx ~43–48.
RECOMMENDED_ACTION: HUMAN — ChatPanel is in older a11y PRs. Do not hide Debug behind a password.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for defaultFolded; MEDIUM if Debug is removed
VALIDATION_REQUIRED: First Play shows the map; Chat title bar still opens; Debug gear still lists the tab.
STATUS: NEW
```

```
ACTION_ID: UX-MAP-NUMBER-WHY
TITLE: Map # never explains visit count vs Zone Tier difficulty
CATEGORY: action-discoverability
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx Map # chip; Zone Tier chip
CURRENT_BEHAVIOUR: “Map #n” increments on portal. Zone Tier n is always on and is the difficulty lock. No title on Map #.
DESIRED_BEHAVIOUR: Map # title “Maps visited this session”. Zone Tier keeps UX-ZONE-TIER-LOCK copy. Do not merge the two chips.
EVIDENCE: WorldExploration.tsx ~17550–17560 vs ~17600–17624.
RECOMMENDED_ACTION: HUMAN — WX owned. Copy-only title.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Portal still increments mapCount; zone lock still writes aestralto_zone_locked.
STATUS: NEW
```

```
ACTION_ID: UX-SMALL-SCREEN-SAAS-CHROME
TITLE: Small-screen Continue is a generic dark card
CATEGORY: visual-hierarchy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: App.tsx SmallScreenGuard
CURRENT_BEHAVIOUR: #0d0d1a panel, serif heading, #aaaaaa body, “Continue anyway”. Policy is still UX-SMALL-SCREEN-HARD-BLOCK (no stacked HUD).
DESIRED_BEHAVIOUR: Same carved-stone frame as Game Over / recap. Keep Continue. Never shadcn gray.
EVIDENCE: App.tsx ~50–138.
RECOMMENDED_ACTION: HUMAN restyle after App.tsx PRs. Do not remove Continue without a HUD reflow.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for restyle
VALIDATION_REQUIRED: Continue still sets pbv_small_screen_continue; 768 warning still appears.
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

### #830
- `UX-SHRINE-INVISIBLE` (copy locked, not wired)
- `UX-EMPTY-BAR-EQUIP` (copy locked, not wired)
- `UX-COVENANT-DEAD-BUFF`
- `UX-ZONE-LOCK-SAAS-CHROME`
- `UX-RENAME-SAAS-CHROME`

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
RECOMMENDED_ACTION: Human-written 3-line coach. Never a SaaS tooltip tour. Pair with UX-CHAT-DEFAULT-OPEN.
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
ACTION_ID: UX-SPELLBOOK-EMPTY-ADMIN
TITLE: Empty spellbook blames a missing admin catalog
CATEGORY: spells
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: SpellbookModal.tsx empty_state
CURRENT_BEHAVIOUR: “The admin has not added any spells yet.”
DESIRED_BEHAVIOUR: “No spells in the catalog yet.” Do not mention admin.
EVIDENCE: spellbook.empty_state.
RECOMMENDED_ACTION: Copy after #372 / #425 land. Not locked this run (inspect + HUD XP took the copy slots).
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Empty catalog still opens the book.
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
RECOMMENDED_ACTION: Human layout. Union #335. Pair with UX-CHAT-DEFAULT-OPEN.
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
RECOMMENDED_ACTION: Report-only until a human picks a mobile scope. Pair with UX-SMALL-SCREEN-SAAS-CHROME.
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

Also still OPEN (full blocks in #776 / #830 catalogs; do not mint twins): `UX-PORTAL-XP-PENDING`, `UX-CHAT-PROFILE-NAME`, `UX-SUMMON-LIFESPAN-WORDS`, `UX-SUMMON-SAAS-ORBS`, `UX-TURN-TIMER-WHY`, `UX-BOARD-LABEL`, `UX-AP-MP-CURRENT-MAX`, `UX-LOGIN-SILENT-BACKEND`, `UX-CHALLENGE-ZINDEX`, `UX-BOSS-RUSH-PINK`, `UX-VERSION-FORCE-RELOGIN`, `UX-FEATS-VS-ACHIEVEMENTS`, `UX-LANDING-VERSION`.

---

## Closed / do not reopen this run

- `UX-HUD-DUPLICATE-TOPBAR` — keep GameFlow spacer; do not restore dummy XP bar.
- `UX-RECAP-XP-CURVE` — leftover XP is correct; do not recolor Dofus purple fill to gold.
- `UX-BLOOD-DEAD-BAR` — inert Blood chip stays gone.
- `UX-IAP-KYC-SURPRISE` — GameKey email + consent.
- `UX-VITALS-ORB-MAX` — side-panel jewels use vitalsOrbCaps.
- `UX-CREATE-NO-STATS` — forge vitals row is on main.
- `UX-ENEMY-REGISTER-LORE` — honesty banner is on main.

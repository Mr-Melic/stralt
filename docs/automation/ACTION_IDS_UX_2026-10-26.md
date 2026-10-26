# ACTION_ID catalog — 2026-10-26 UX audit

Stable IDs for the daily player-journey auditor. STATUS values: NEW | OPEN | IMPLEMENTED_THIS_RUN | IMPLEMENTED | SUPERSEDED.

Reuse IDs from [`ACTION_IDS_UX_2026-10-25.md`](./ACTION_IDS_UX_2026-10-25.md) (open PR #1060) and older UX PRs when the finding is the same. Do not mint twins.

HEAD: `0f5363f` (unchanged since 2026-09-21). DESIGN.md preserved.

---

## Copy locked this run (not wired — older PRs own the hosts)

```
ACTION_ID: UX-CHALLENGE-CHEBYSHEV
TITLE: Striker offer prints Chebyshev distance
CATEGORY: invalid-action-explanation
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/challengeOfferCopy.ts; challengeCompletion.ts (origin/main, untouched); ChallengePanel.tsx (untouched)
CURRENT_BEHAVIOUR: legendary_3 description is “Win using only spells cast on targets within 2 tiles (Chebyshev distance ≤ 2)”. Fail copy already says “beyond 2 tiles”.
DESIRED_BEHAVIOUR: challengePlayerDescription — “within 2 tiles (including diagonals)”. Same rule, no engineer metric name.
EVIDENCE: challengeCompletion.ts ~104–105; ChallengePanel.tsx ~273 prints currentChallenge.description.
RECOMMENDED_ACTION: Wire challengeOfferCopy after ChallengePanel / catalog PRs. Do not change Striker Chebyshev math.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: challengeOfferCopy.test.ts; offer has no Chebyshev; fail copy still “beyond 2 tiles”.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-SPELL-CD-TURNS
TITLE: Spell hover uses CD: Nt and overlay is a bare integer
CATEGORY: spell-state
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/spellCooldownCopy.ts; BattleUIPanel.tsx (origin/main, untouched)
CURRENT_BEHAVIOUR: Title suffix is ` | CD: ${cdTurns}t`. Overlay is `{cdTurns}` with no unit.
DESIRED_BEHAVIOUR: spellCooldownTitleSuffix — “ | 2 turns remaining”. Overlay may stay compact for 2+; 1-turn names the unit.
EVIDENCE: BattleUIPanel.tsx ~637, ~730.
RECOMMENDED_ACTION: Wire after BattleUIPanel is free. Do not change cooldown math or the 30s turn clock.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: spellCooldownCopy.test.ts; hover says turns; no CD: Nt.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-DUNGEON-CHAIN-MULTIPLIER
TITLE: Dungeon HUD never names the live Doka ×N
CATEGORY: reward-clarity
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/dungeonChainCopy.ts; WorldExploration.tsx HUD + nearby dungeon labels; portalRules dungeonDokaMultiplierFor
CURRENT_BEHAVIOUR: Chip is `⚔️ Dungeon d/max`. Nearby continue is `⚔️ Continue Chain (d/max)`. Recap is the first “multiplier” sentence.
DESIRED_BEHAVIOUR: dungeonChainHudLabel / dungeonChainContinueLabel include Doka ×N from dungeonDokaMultiplierFor. Enter line says Doka grows with depth (no fake number).
EVIDENCE: WorldExploration.tsx ~17574, ~7920–7922; portalRules.ts ~148–161 (1 / 1.5 / 2 / 2.5 / 3 / 4).
RECOMMENDED_ACTION: Wire after WX is free. Do not invent a second multiplier table.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: dungeonChainCopy.test.ts; depth 1 HUD is Doka ×1.5; persist table unchanged.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-GROUND-DOKA-LOG-ONLY
TITLE: Ground Doka collect prefixes [COLLECT]
CATEGORY: reward-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/groundDokaCopy.ts; WorldExploration.tsx logBattleEntry
CURRENT_BEHAVIOUR: Spawn and pickup only write the battle log. Collect is `[COLLECT] You found N Doka on the ground!`.
DESIRED_BEHAVIOUR: groundDokaCollectedLog — no debug tag. Pair with a 1.5s stone whisper when wiring (same family as UX-CAST-FAIL-FEEDBACK).
EVIDENCE: WorldExploration.tsx ~6793–6795, ~11411–11413.
RECOMMENDED_ACTION: Wire after WX is free. Do not change one-shot claim / applyRewards.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: groundDokaCopy.test.ts; host still greps [COLLECT] until wired.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-STATUS-TURNS-SUFFIX
TITLE: Status pills print {n}t
CATEGORY: ap-mp-clarity
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/statusTurnsCopy.ts; StatusEffectBadge.tsx
CURRENT_BEHAVIOUR: Visible suffix is `{turns}t`. Title already says “N turn(s) remaining”.
DESIRED_BEHAVIOUR: statusTurnsLabel — “1 turn” / “4 turns”.
EVIDENCE: StatusEffectBadge.tsx ~63.
RECOMMENDED_ACTION: Wire statusTurnsCopy. Do not change duration math.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: statusTurnsCopy.test.ts; pill has no trailing t.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-CHALLENGE-BADGE-VOID
TITLE: Legendary challenges advertise a Badge that is not an item
CATEGORY: reward-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/challengeBadgeCopy.ts; ChallengePanel.tsx; challengeRewards.ts
CURRENT_BEHAVIOUR: Offer prints `Badge: Untouchable` / Blitz / Striker. Persist is Doka/XP only. No recap chip, inventory, or Board column.
DESIRED_BEHAVIOUR: challengeBadgeRewardLine — “Title: Untouchable — a name only, not an item”. Or drop the Badge line until a real title track exists.
EVIDENCE: ChallengePanel.tsx ~287–289; challengeCompletion.ts ~92 / ~99 / ~107; challengeRewards.ts credits doka/xp only.
RECOMMENDED_ACTION: Wire after ChallengePanel is free. Do not invent an inventory badge.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: challengeBadgeCopy.test.ts; offer no longer implies an item.
STATUS: IMPLEMENTED_THIS_RUN
```

---

## New this run (not implemented)

```
ACTION_ID: UX-RECAP-CONTINUE-VOID
TITLE: Victory recap Continue never names the next map
CATEGORY: action-discoverability
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: PostBattleRecap.tsx
CURRENT_BEHAVIOUR: Defeat CTA is “Continue — next you enter the Death Realm →”. Victory is always “Continue Exploring →” in dungeon chain, Boss Rush, and overworld.
DESIRED_BEHAVIOUR: recapContinueLabel({ isDefeat, dungeonActive, bossRushActive }) — Death Realm / next dungeon floor / next rush room / overworld.
EVIDENCE: PostBattleRecap.tsx ~642–644.
RECOMMENDED_ACTION: HUMAN copy on PostBattleRecap (owned by older PRs). Distinct from UX-BOSS-GUIDE-NEXT and UX-DEATH-DUAL-MODAL.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: Dungeon victory names the next floor; rush names the next room; overworld stays Explore.
STATUS: NEW
```

```
ACTION_ID: UX-REST-AREA-NO-HEAL
TITLE: Rest Area never says it does not heal
CATEGORY: death
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx generateRestMap / region chip
CURRENT_BEHAVIOUR: Zone name is “Rest Area”. No heal on enter. HUD Doka heal and potions still work. Distinct from UX-REST-AREA-NEXT-CHIP (pick an exit) and UX-POTION-VS-HUD-HEAL.
DESIRED_BEHAVIOUR: Chip or one-line whisper: Rest is a pause with exits — it does not restore HP.
EVIDENCE: WorldExploration.tsx ~5517; no rest-map heal grant.
RECOMMENDED_ACTION: HUMAN — union with #1060 safeMapHudCopy when wiring. Do not add a free heal.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: Rest enter does not change HP; chip does not promise recovery.
STATUS: NEW
```

```
ACTION_ID: UX-BOSS-BANNER-FLASH
TITLE: Boss encounter banner fades in 1.5s on purple SaaS chrome
CATEGORY: visual-hierarchy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx bossEncounterBanner
CURRENT_BEHAVIOUR: `☠️ BOSS ENCOUNTER: {name}` for 1500ms, purple gradient `#9333ea`, 1.5s CSS fade. Distinct from UX-BOSS-RUSH-PINK (room chip) and UX-ENCOUNTER-NO-BANNER (pack fights).
DESIRED_BEHAVIOUR: Carved crimson/gold stay of ~3s, or a persistent boss name chip until the fight ends. Never arcade purple.
EVIDENCE: WorldExploration.tsx ~6497–6504, ~18024–18038.
RECOMMENDED_ACTION: HUMAN layout. Do not change boss spawn or kit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM for timing
VALIDATION_REQUIRED: Banner readable; DESIGN.md gold/crimson; Boss Rush pink not “fixed” here.
STATUS: NEW
```

```
ACTION_ID: UX-LANDING-ADS-UNLABELED
TITLE: Landing ad images have no player-visible Sponsored mark
CATEGORY: launch
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: LandingPage.tsx ad boxes
CURRENT_BEHAVIOUR: When admin images exist, the strip is image-only. alt is `Advertisement ${index + 1}` (screen readers only). Distinct from UX-LANDING-ADMIN-ARIA and UX-LANDING-VERSION.
DESIRED_BEHAVIOUR: Visible “Sponsored” caption in muted gold, still carved-stone. Do not restyle into a SaaS ad unit.
EVIDENCE: LandingPage.tsx ~705–751.
RECOMMENDED_ACTION: HUMAN — LandingPage is in #368 / older a11y queues. Copy helper only if a later run can add a file without touching the host.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for a caption
VALIDATION_REQUIRED: Caption visible when an image is set; https-only hrefs stay.
STATUS: NEW
```

```
ACTION_ID: UX-SPELL-PHY-LABEL
TITLE: Physical spell slots stamp PHY with no word
CATEGORY: spell-state
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx
CURRENT_BEHAVIOUR: `isPhysical` slots show `PHY` at 6px. Hover already includes damage/AP/range but never says Physical / Melee.
DESIRED_BEHAVIOUR: “Melee” or “Physical” at a readable size, or drop the stamp and keep it in the hover.
EVIDENCE: BattleUIPanel.tsx ~747–760.
RECOMMENDED_ACTION: HUMAN word choice. Do not change isPhysical targeting.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Strike still stamps; heal/magic do not.
STATUS: NEW
```

```
ACTION_ID: UX-MAP-EFFECTS-DUAL-LABEL
TITLE: Map Effects chrome title disagrees with Map Modifiers header
CATEGORY: hud-crowding
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: MapModifiersPanel.tsx
CURRENT_BEHAVIOUR: DraggablePanel title is “Map Effects”; inner header is “Map Modifiers”. Distinct from UX-MAP-MODIFIERS-EMPTY (hide when none active).
DESIRED_BEHAVIOUR: One player word. Prefer “Map Effects” (player) over “Modifiers” (admin).
EVIDENCE: MapModifiersPanel.tsx ~45 vs ~82.
RECOMMENDED_ACTION: HUMAN — #517 owns empty-state unmount. Union the title, do not overwrite empty-state.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Empty overlay still hidden after #517; remaining title is one phrase.
STATUS: NEW
```

---

## Twins not minted this run

| Tempted ID | Already queued as |
| :--- | :--- |
| UX-SELECT-PAPER-BABY-HEADLINE | #421 `UX-SELECTION-PBV-HEADING` |
| UX-MAP-EFFECTS-EMPTY-OPEN | #517 `UX-MAP-MODIFIERS-EMPTY` |
| UX-BOSS-RUSH-HUD-CHROME | `UX-BOSS-RUSH-PINK` |
| UX-SUMMON-PHASE-YOUR-TURN | #690 `UX-INIT-SUMMON-PHASE` |
| UX-FLEE-DOUBLE-CONFIRM | `UX-FLEE-NATIVE-CONFIRM` |
| UX-BUY-DOKA-ICON-ONLY | `UX-SHOP-TWO-STORES` |
| UX-BOARD-ACHIEVEMENTS-COL | `UX-FEATS-VS-ACHIEVEMENTS` |
| UX-SIDE-PANEL-XP-LABEL | #873 `UX-HUD-XP-LEFTOVER-LABEL` |
| UX-JACKPOT-BANNER-CASINO | `UX-HEAL-JACKPOT-UNNAMED` |
| UX-SLOT-GLYPH-ESCAPE | #1018 `UX-SELECT-SLOT-LITERAL-ESCAPE` |
| UX-INIT-CROWN-ESCAPE | #1060 `UX-INIT-STRIP-LITERAL-ESCAPE` |
| UX-WHITE-SANCTUARY-LOG-ONLY | #776 `UX-PORTAL-LEGEND` |
| UX-REST-PICK-EXIT | #1060 `UX-REST-AREA-NEXT-CHIP` |
| UX-TURN-T-PREFIX | #1060 `UX-TURN-INDEX-T-PREFIX` |
| UX-TILE-PIN-DEBUG | #1060 `UX-TILE-COORD-HUD` |

---

## Implemented on main since 2026-09-02 (do not reopen)

- `UX-SPELL-OVERWORLD-MUTED`
- `UX-CHALLENGE-FAIL-COPY`
- `UX-PROFILE-NAME-HINT`
- `UX-CREATE-NO-STATS`
- `UX-ENEMY-REGISTER-LORE`
- `UX-VITALS-ORB-MAX`
- `UX-BLOOD-DEAD-BAR`
- `UX-GAMEKEY-STEP-ORDER` (IAP_SHOP_STEPS is wired on main; pay-after-submit refine is #588)
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
- Feat toast heading “Feat Unlocked!” (`featToastCopy.ts`).

### #517
- `UX-MAP-MODIFIERS-EMPTY`

### #588
- `UX-GAMEKEY-PAY-AFTER-SUBMIT`
- `UX-HEAL-TITLE-MISMATCH`

### #642
- `UX-SETTINGS-SOUND-TITLE`
- `UX-NO-LEAVE-REALM`

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
- `UX-SHRINE-INVISIBLE`
- `UX-EMPTY-BAR-EQUIP`
- `UX-COVENANT-DEAD-BUFF`
- `UX-ZONE-LOCK-SAAS-CHROME`
- `UX-RENAME-SAAS-CHROME`

### #873
- `UX-INSPECT-STAT-WORDS`
- `UX-HUD-XP-LEFTOVER-LABEL`
- `UX-FAIL-INSPECT-ZERO`
- `UX-CHAT-DEFAULT-OPEN`
- `UX-MAP-NUMBER-WHY`
- `UX-SMALL-SCREEN-SAAS-CHROME`

### #943
- `UX-SPELLBOOK-EMPTY-ADMIN`
- `UX-SPELLBOOK-CANCEL-KEEPS-UPGRADES`
- `UX-SUMMON-BAR-OVERLAP`
- `UX-FORGE-PIECE-COSMETIC`
- `UX-PROFILE-REALM-CTA`
- `UX-BOSS-GUIDE-ASSUMED-LEVEL`
- `UX-POTION-CARD-BATTLE-ONLY`
- `UX-CANVAS-ERROR-DUMP`
- `UX-SEALED-PORTAL-LOG-ONLY`
- `UX-AUTH-LOADING-VOID`

### #1018
- `UX-SELECT-SLOT-LITERAL-ESCAPE`
- `UX-PROFILE-BOARD-NAME-MISLEAD`
- `UX-ACCOUNT-VS-CHAMPION-NAME`
- `UX-CHANGELOG-PLAY-PREMATURE`
- `UX-HEAL-RATIO-CRYPTIC`
- `UX-OVERWORLD-AP-MP-IDLE`
- `UX-ENCOUNTER-NO-BANNER`
- `UX-PORTAL-TRANSITION-OPAQUE`
- `UX-DEATH-XP-LEFTOVER-COPY`
- `UX-SPELL-AP-DISABLED-REASON`
- `UX-ATTACK-NEAREST-WHY`
- `UX-BOSS-RUSH-ADVANCE-LABEL`
- `UX-SUMMON-UPGRADE-COST-COPY`
- `UX-SUMMON-NAME-PIECETYPE`
- `UX-HEAL-JACKPOT-UNNAMED`
- `UX-SUMMON-UPGRADE-COST-GATE`
- `UX-INSPECT-SUMMON-AS-ENEMY`
- `UX-RECAP-DEFEAT-XP-BASIS`

### #1060
- `UX-INIT-STRIP-LITERAL-ESCAPE`
- `UX-TURN-INDEX-T-PREFIX`
- `UX-TILE-COORD-HUD`
- `UX-DEATH-REALM-NEXT-CHIP`
- `UX-REST-AREA-NEXT-CHIP`
- `UX-SIDE-PANEL-XP-REDUNDANT` (HUMAN)
- `UX-HUD-DEAD-ATK-EVA` (HUMAN)

---

## Open (human / blocked by older PRs)

Do not edit `WorldExploration.tsx`, `GameFlow.tsx`, `BattleUIPanel.tsx`, `AchievementsPanel.tsx`, `PostBattleRecap.tsx`, `SpellbookModal.tsx`, `App.tsx`, `CharacterSelection.tsx`, `ProfileSetup.tsx`, `CharacterCreation.tsx`, `ChatPanel.tsx`, `BuffShop.tsx`, `StatPopup.tsx`, `BossGuideModal.tsx`, `SummonControlPanel.tsx`, `InitiativeStrip.tsx`, `ChallengePanel.tsx`, `StatusEffectBadge.tsx`, `LandingPage.tsx`, `MapModifiersPanel.tsx`, or `DESIGN.md` in this auditor PR.

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
RECOMMENDED_ACTION: Human-approved unify. Do not rewire deathGuards unattended. Pair with UX-DEATH-REALM-WAIT-BEAT and UX-DEATH-REALM-NEXT-CHIP.
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
DESIRED_BEHAVIOUR: One dismissible carved-stone coach, once per slot. Pair with UX-ENCOUNTER-NO-BANNER.
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

Also still OPEN (full blocks in #776 / #830 / #873 / #943 / #1018 / #1060 catalogs; do not mint twins): `UX-NO-LEAVE-REALM`, `UX-BOOST-UNMOUNTED`, `UX-HAZARD-TILE-LEGEND`, `UX-FEAT-TOAST-PRECREDIT`, `UX-LEVEL-UP-CHROME`, `UX-HUD-TOOL-CLUSTER`, `UX-SMALL-SCREEN-HARD-BLOCK`, `UX-LAUNCH-TAB-TITLE`, `UX-IDENTITY-FONT-DRIFT`, `UX-PORTAL-XP-PENDING`, `UX-CHAT-PROFILE-NAME`, `UX-SUMMON-LIFESPAN-WORDS`, `UX-SUMMON-SAAS-ORBS`, `UX-TURN-TIMER-WHY`, `UX-BOARD-LABEL`, `UX-AP-MP-CURRENT-MAX`, `UX-LOGIN-SILENT-BACKEND`, `UX-CHALLENGE-ZINDEX`, `UX-BOSS-RUSH-PINK`, `UX-VERSION-FORCE-RELOGIN`, `UX-FEATS-VS-ACHIEVEMENTS`, `UX-LANDING-VERSION`, `UX-SUMMON-BAR-OVERLAP`, `UX-SPELLBOOK-CANCEL-KEEPS-UPGRADES`, `UX-SUMMON-UPGRADE-COST-GATE`, `UX-SIDE-PANEL-XP-REDUNDANT`, `UX-HUD-DEAD-ATK-EVA`.

---

## Closed / do not reopen this run

- `UX-HUD-DUPLICATE-TOPBAR` — keep GameFlow spacer; do not restore dummy XP bar.
- `UX-RECAP-XP-CURVE` — leftover XP is correct; do not recolor Dofus purple fill to gold.
- `UX-BLOOD-DEAD-BAR` — inert Blood chip stays gone.
- `UX-IAP-KYC-SURPRISE` — GameKey email + consent.
- `UX-VITALS-ORB-MAX` — side-panel jewels use vitalsOrbCaps.
- `UX-CREATE-NO-STATS` — forge vitals row is on main.
- `UX-ENEMY-REGISTER-LORE` — honesty banner is on main.
- `UX-FLEE-DOUBLE-CONFIRM` — do not mint; second confirm is already `UX-FLEE-NATIVE-CONFIRM`.
- `UX-BUY-DOKA-ICON-ONLY` — do not mint; icon-only cart is already `UX-SHOP-TWO-STORES`.
- `UX-BOARD-ACHIEVEMENTS-COL` — do not mint; column header is `UX-FEATS-VS-ACHIEVEMENTS`.
- `UX-WHITE-SANCTUARY-LOG-ONLY` — do not mint; unlabeled white gate is `UX-PORTAL-LEGEND`.

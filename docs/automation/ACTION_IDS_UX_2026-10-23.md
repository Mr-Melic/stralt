# ACTION_ID catalog — 2026-10-23 UX audit

Stable IDs for the daily player-journey auditor. STATUS values: NEW | OPEN | IMPLEMENTED_THIS_RUN | IMPLEMENTED | SUPERSEDED.

Reuse IDs from [`ACTION_IDS_UX_2026-10-22.md`](./ACTION_IDS_UX_2026-10-22.md) (open PR #873) and older UX PRs when the finding is the same. Do not mint twins.

HEAD: `0f5363f` (unchanged since 2026-09-21). DESIGN.md preserved.

---

## Copy locked this run (not wired — older PRs own the hosts)

```
ACTION_ID: UX-SPELLBOOK-EMPTY-ADMIN
TITLE: Empty spellbook blames a missing admin catalog
CATEGORY: spells
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/spellbookEmptyCopy.ts; SpellbookModal.tsx empty_state (origin/main, untouched)
CURRENT_BEHAVIOUR: “The admin has not added any spells yet.”
DESIRED_BEHAVIOUR: SPELLBOOK_EMPTY_BODY — “No spells in the catalog yet.” Do not mention admin.
EVIDENCE: SpellbookModal.tsx ~797–811.
RECOMMENDED_ACTION: Wire spellbookEmptyCopy after #372 / #425. Do not change catalog fetch.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: spellbookEmptyCopy.test.ts; empty catalog still opens the book.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-SPELLBOOK-CANCEL-KEEPS-UPGRADES
TITLE: Spellbook Cancel does not undo Upgrade spend
CATEGORY: upgrades
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/spellbookCancelCopy.ts; SpellbookModal.tsx; WorldExploration handleUpgradeSpell (origin/main, untouched)
CURRENT_BEHAVIOUR: Upgrade calls persistSpellUpgrade immediately. Save Spells only writes eight slots. Cancel is onClose — Doka stay spent, ranks stay.
DESIRED_BEHAVIOUR: Cancel/Close title from SPELLBOOK_CANCEL_TITLE. Keep explicit confirm before flee-class spends; do not silently refund. Optional human product: defer upgradeSpell until Save.
EVIDENCE: SpellbookModal.tsx ~1157–1161, ~1213–1251; WorldExploration.tsx ~3140–3201.
RECOMMENDED_ACTION: Wire spellbookCancelCopy after #372 / #425. Do not change upgradeSpell math in an unattended run.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for title; HIGH if Upgrade is deferred to Save without persist review
VALIDATION_REQUIRED: spellbookCancelCopy.test.ts; Upgrade still charges once; Cancel still leaves slots unchanged; HUD leftover XP unchanged.
STATUS: IMPLEMENTED_THIS_RUN
```

---

## New this run (not implemented)

```
ACTION_ID: UX-SUMMON-BAR-OVERLAP
TITLE: Champion spell bar stays live under summon control
CATEGORY: hud-crowding
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx; BattleUIPanel.tsx; SummonControlPanel.tsx
CURRENT_BEHAVIOUR: Controlled summon stacks an amber “Summon's Turn” banner, BattleUIPanel “Summon's Turn” chip, and a full-bleed SummonControlPanel. Spell slots disable only on !inBattle — they stay clickable. onSelectSpell still writes selectedSpellIdRef.
DESIRED_BEHAVIOUR: One summon control surface. Champion Walk / Attack / spells gated with a carved “Control your summon” next step. Pair with UX-INIT-SUMMON-PHASE (strip still says YOUR). Do not change turn routing.
EVIDENCE: WorldExploration.tsx ~18822–18848, ~18956–19007; BattleUIPanel.tsx ~645–649, ~571–578; SummonControlPanel.tsx ~276–278.
RECOMMENDED_ACTION: HUMAN — WX / BattleUIPanel / SummonControlPanel are in older PRs (#340 / #335 / #728). Do not duplicate #728 End Turn gate.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH if player-cast entry is gated wrong
VALIDATION_REQUIRED: Champion turn still casts; summon turn only kit spells; End Turn still ends the active actor.
STATUS: NEW
```

```
ACTION_ID: UX-FORGE-PIECE-COSMETIC
TITLE: Champion piece picker never says look-only
CATEGORY: character-creation
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: CharacterCreation.tsx; startingChampionStats.ts
CURRENT_BEHAVIOUR: “Choose Your Piece” plus Type / Pixel Art / 4 Views. Create always writes startingChampionStats() — same 100 HP / 10 AP / 5 MP / 10 INIT for King and Pawn. Vitals row exists (UX-CREATE-NO-STATS resolved) but does not say the piece is cosmetic.
DESIRED_BEHAVIOUR: One carved line: “Piece is look only — every champion starts with the same vitals.” Never class-select SaaS cards. Do not let the player edit persisted stats here.
EVIDENCE: CharacterCreation.tsx ~747–893; startingChampionStats.ts ~7–21; create path ~272.
RECOMMENDED_ACTION: HUMAN copy after #372 / #526. Do not change 12-field CharacterStats including killCount.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Create still writes startingChampionStats(); edit still shows persisted vitals.
STATUS: NEW
```

```
ACTION_ID: UX-PROFILE-REALM-CTA
TITLE: Profile save says Enter the Realm but next is slots
CATEGORY: launch
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: ProfileSetup.tsx; LandingPage.tsx
CURRENT_BEHAVIOUR: Submit label is “♔ Enter the Realm”. Landing already says name → forge → Play. After save, GameFlow is character selection, not the map.
DESIRED_BEHAVIOUR: “Save name — next, forge a champion.” Keep logout. Never SaaS “Continue to dashboard”.
EVIDENCE: ProfileSetup.tsx ~332; LandingPage.tsx ~569–570.
RECOMMENDED_ACTION: HUMAN copy after #372. Do not change saveCallerUserProfile payload (uiLayout: "").
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Save still writes the profile; next screen is still slots.
STATUS: NEW
```

```
ACTION_ID: UX-BOSS-GUIDE-ASSUMED-LEVEL
TITLE: Boss Guide scaling table always uses level 10
CATEGORY: enemy-information
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BossGuideModal.tsx; GameFlow.tsx
CURRENT_BEHAVIOUR: playerLevel defaults to 10. GameFlow mounts <BossGuideModal open /> with no level. Caption is “Effective stats vs. player level {playerLevel}” so a level-1 opener reads a level-10 table as truth. Distinct from UX-BOSS-GUIDE-NEXT (#464).
DESIRED_BEHAVIOUR: Pass the live champion level, or label “Example at level 10.” Keep carved chrome. Do not change boss combat math.
EVIDENCE: BossGuideModal.tsx ~220–234, ~684; GameFlow.tsx ~363.
RECOMMENDED_ACTION: HUMAN — BossGuideModal is in #425 / #464. Do not duplicate #464 next-step copy.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for caption; MEDIUM if a wrong live level is passed
VALIDATION_REQUIRED: Guide still opens; table numbers match the caption’s level; completeBossRushRoom unchanged.
STATUS: NEW
```

```
ACTION_ID: UX-POTION-CARD-BATTLE-ONLY
TITLE: Health potion buy cards never say battle-turn
CATEGORY: shop
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BuffShop.tsx BUFF_ITEMS
CURRENT_BEHAVIOUR: Health Potion / Greater Potion / Shield Charm / Fury Potion descriptions omit “battle”. Battle Elixir and Swift Boots already say “(battle)”. Inventory Use is battle-turn only (UX-POTION-VS-HUD-HEAL names the HUD Doka heal). Buy tab looks like overworld drinks.
DESIRED_BEHAVIOUR: Every potion card includes “your battle turn”. Keep HUD Doka-to-HP as the overworld heal. Do not let overworld Use call tryConsumeBuffItem.
EVIDENCE: BuffShop.tsx ~31–79 vs Use gate ~555, ~619–648.
RECOMMENDED_ACTION: HUMAN copy after #372 / #526 / #738. Do not restack buffShopUseCopy.ts.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Buy still spends Doka; Use still disabled out of battle; HUD heal still 3 HP per Doka.
STATUS: NEW
```

```
ACTION_ID: UX-CANVAS-ERROR-DUMP
TITLE: Canvas crash recovery is an engineer console
CATEGORY: death
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx CanvasErrorBoundary
CURRENT_BEHAVIOUR: Full-screen monospace dump: message, time, component stack, stack, “Copy Debug Report”, “Reload Game”. Players cannot answer what to do next. Debug overlay must stay reachable (AGENTS.md) — do not hide the report.
DESIRED_BEHAVIOUR: Carved-stone “The realm staggered” plus one Reload CTA. Keep Copy report behind a second control. Never a SaaS empty-state illustration.
EVIDENCE: WorldExploration.tsx ~704–829.
RECOMMENDED_ACTION: HUMAN restyle after WX PRs. Do not remove Copy Debug Report.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM if the report path is dropped
VALIDATION_REQUIRED: Reload still recovers; Copy still writes the stack; debug overlay still reachable during the crash.
STATUS: NEW
```

```
ACTION_ID: UX-SEALED-PORTAL-LOG-ONLY
TITLE: Sealed dungeon exit only writes the battle log
CATEGORY: portal-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx progression lock
CURRENT_BEHAVIOUR: Stepping a run portal while hostiles remain logs “The way forward is sealed until every foe falls.” Chat starts unfolded (UX-CHAT-DEFAULT-OPEN) but folding it hides the reason. No float/toast. Distinct from UX-PORTAL-LEGEND (kind labels).
DESIRED_BEHAVIOUR: 1.5s stone whisper/toast with the same sentence. Do not change isProgressionLocked / portalRules.
EVIDENCE: WorldExploration.tsx ~6048–6072.
RECOMMENDED_ACTION: HUMAN — WX owned. Pair with UX-CAST-FAIL-FEEDBACK whisper helper.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Sealed step still refuses; clear-all still opens the portal; whisper fires once per dwell.
STATUS: NEW
```

```
ACTION_ID: UX-AUTH-LOADING-VOID
TITLE: Post-auth spinner never says what is next
CATEGORY: launch
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: App.tsx isStillLoading
CURRENT_BEHAVIOUR: Authenticated + !profileResolved shows a crimson spinner and “Loading...”. Distinct from UX-LOGIN-SILENT-BACKEND (login() throw path).
DESIRED_BEHAVIOUR: “Opening your account — next you will name it, then forge.” Keep the spinner. Never a SaaS skeleton dashboard.
EVIDENCE: App.tsx ~392, ~454–486.
RECOMMENDED_ACTION: HUMAN copy after App.tsx PRs (#464). Do not bump APP_VERSION.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Profile setup still appears when the query resolves; missing profile still hits ProfileSetup.
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

### #873
- `UX-INSPECT-STAT-WORDS` (copy locked, not wired)
- `UX-HUD-XP-LEFTOVER-LABEL` (copy locked, not wired)
- `UX-FAIL-INSPECT-ZERO`
- `UX-CHAT-DEFAULT-OPEN`
- `UX-MAP-NUMBER-WHY`
- `UX-SMALL-SCREEN-SAAS-CHROME`

---

## Open (human / blocked by older PRs)

Do not edit `WorldExploration.tsx`, `GameFlow.tsx`, `BattleUIPanel.tsx`, `AchievementsPanel.tsx`, `PostBattleRecap.tsx`, `SpellbookModal.tsx`, or `DESIGN.md` in this auditor PR.

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
DESIRED_BEHAVIOUR: Shared 1.5s stone whisper. Do not change targeting math. Pair with UX-SEALED-PORTAL-LOG-ONLY.
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

Also still OPEN (full blocks in #776 / #830 / #873 catalogs; do not mint twins): `UX-NO-LEAVE-REALM`, `UX-BOOST-UNMOUNTED`, `UX-HAZARD-TILE-LEGEND`, `UX-FEAT-TOAST-PRECREDIT`, `UX-LEVEL-UP-CHROME`, `UX-HUD-TOOL-CLUSTER`, `UX-SMALL-SCREEN-HARD-BLOCK`, `UX-LAUNCH-TAB-TITLE`, `UX-IDENTITY-FONT-DRIFT`, `UX-PORTAL-XP-PENDING`, `UX-CHAT-PROFILE-NAME`, `UX-SUMMON-LIFESPAN-WORDS`, `UX-SUMMON-SAAS-ORBS`, `UX-TURN-TIMER-WHY`, `UX-BOARD-LABEL`, `UX-AP-MP-CURRENT-MAX`, `UX-LOGIN-SILENT-BACKEND`, `UX-CHALLENGE-ZINDEX`, `UX-BOSS-RUSH-PINK`, `UX-VERSION-FORCE-RELOGIN`, `UX-FEATS-VS-ACHIEVEMENTS`, `UX-LANDING-VERSION`.

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

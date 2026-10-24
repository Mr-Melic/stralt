# ACTION_ID catalog — 2026-10-24 UX audit

Stable IDs for the daily player-journey auditor. STATUS values: NEW | OPEN | IMPLEMENTED_THIS_RUN | IMPLEMENTED | SUPERSEDED.

Reuse IDs from [`ACTION_IDS_UX_2026-10-23.md`](./ACTION_IDS_UX_2026-10-23.md) (open PR #943) and older UX PRs when the finding is the same. Do not mint twins.

HEAD: `0f5363f` (unchanged since 2026-09-21). DESIGN.md preserved.

---

## Copy locked this run (not wired — older PRs own the hosts)

```
ACTION_ID: UX-SELECT-SLOT-LITERAL-ESCAPE
TITLE: Slot header and loading show raw \u escapes
CATEGORY: character-selection
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/selectionSlotCopy.ts; CharacterSelection.tsx (origin/main, untouched)
CURRENT_BEHAVIOUR: JSXText keeps source escapes, so cards render the characters "\u2694 Slot N" and loading "Loading character slots\u2026". Piece icons at 613–618 correctly use JS strings.
DESIRED_BEHAVIOUR: SLOT_HEADER / LOADING_SLOTS — real ⚔ / … glyphs.
EVIDENCE: CharacterSelection.tsx ~486, ~889.
RECOMMENDED_ACTION: Wire selectionSlotCopy after #421. Do not restack #421 leftover-XP / Play hint / heading hunks.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: selectionSlotCopy.test.ts; Slot 1 shows ⚔; loading shows an ellipsis.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-PROFILE-BOARD-NAME-MISLEAD
TITLE: Profile claims account name is shown on the Board
CATEGORY: profile
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/profileNameCopy.ts; ProfileSetup.tsx; main.mo getLeaderboard
CURRENT_BEHAVIOUR: Helper “This is your account name, shown on the board.” Leaderboard playerName is the highest-level champion c.name. Chat uses userProfile.name.
DESIRED_BEHAVIOUR: PROFILE_NAME_HINT — account name = chat / lobby welcome; champion name = Board + realm HUD.
EVIDENCE: ProfileSetup.tsx ~251–252 vs main.mo ~3390–3421 bestName := c.name; GameFlow ChatPanel playerName={userProfile.name}.
RECOMMENDED_ACTION: Wire profileNameCopy after #372. Pair with UX-ACCOUNT-VS-CHAMPION-NAME. Distinct from UX-BOARD-LABEL (Feats tool vs Leaderboard word) and UX-CHAT-PROFILE-NAME (chat posts as profile).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: profileNameCopy.test.ts; hint no longer says the account is on the Board.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-ACCOUNT-VS-CHAMPION-NAME
TITLE: Journey never maps account name vs champion name
CATEGORY: onboarding
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/profileNameCopy.ts; ProfileSetup.tsx; CharacterCreation.tsx
CURRENT_BEHAVIOUR: Profile asks “Your Name”; forge asks “Champion Name” with no sentence tying each to chat vs HUD/Board.
DESIRED_BEHAVIOUR: PROFILE_NAME_HINT + CHAMPION_NAME_HINT on each screen.
EVIDENCE: ProfileSetup ~207; CharacterCreation ~710.
RECOMMENDED_ACTION: Wire after #372. Do not change saveCallerUserProfile / create payloads.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: New player can answer which name is on the Board.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-CHANGELOG-PLAY-PREMATURE
TITLE: What's New dismiss says let me play before forge
CATEGORY: launch
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/changelogDismissCopy.ts; App.tsx ChangelogPopup
CURRENT_BEHAVIOUR: CTA “Got it — let me play!” Changelog can stack over ProfileSetup / selection (auth + pbv_show_changelog).
DESIRED_BEHAVIOUR: CHANGELOG_DISMISS_LABEL “Got it — continue”.
EVIDENCE: App.tsx ~275; showChangelog gated only on isAuthenticated ~322–329.
RECOMMENDED_ACTION: Wire after App.tsx PRs (#464). Do not bump APP_VERSION.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: changelogDismissCopy.test.ts; dismiss does not say play.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-HEAL-RATIO-CRYPTIC
TITLE: Overworld heal button ends with opaque (1:3)
CATEGORY: feedback
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/overworldVitalsCopy.ts; WorldExploration.tsx stats heal; open PR #588 healHudCopy.ts
CURRENT_BEHAVIOUR: Visible `♥ Heal N HP → C Doka (1:3)`. Engine is 3 HP per 1 Doka. #588 already aligns hover with the partial heal but keeps (1:3) on the label.
DESIRED_BEHAVIOUR: HEAL_WITH_DOKA_LABEL — “3 HP per 1 Doka”. Same numbers as the hover (UX-HEAL-TITLE-MISMATCH).
EVIDENCE: WorldExploration.tsx ~18504–18506; itemShop.ts dokaHealAmounts.
RECOMMENDED_ACTION: Union with #588 healHudCopy when wiring WX. Do not change 1 Doka : 3 HP math.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: overworldVitalsCopy.test.ts; button names HP-per-Doka.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-OVERWORLD-AP-MP-IDLE
TITLE: Overworld AP/MP orbs look spendable while exploring
CATEGORY: ap-mp-clarity
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: src/frontend/src/utils/overworldVitalsCopy.ts; WorldExploration.tsx side-panel orbs
CURRENT_BEHAVIOUR: Side-panel AP/MP show full max outside battle. Walking does not spend them. Distinct from UX-AP-MP-CURRENT-MAX (battle bar numerals).
DESIRED_BEHAVIOUR: OVERWORLD_ORB_TITLE — “battle budget (not spent while exploring)”.
EVIDENCE: WorldExploration.tsx ~18264–18276 inBattle ? currentBattleAp : characterStats.ap.
RECOMMENDED_ACTION: Wire orb title when !inBattle after WX PRs.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Hover AP/MP out of battle mentions battle budget.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-ENCOUNTER-NO-BANNER
TITLE: Pack fights have no on-canvas what-just-happened
CATEGORY: encounter-start
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/encounterStartCopy.ts; WorldExploration.tsx battle start
CURRENT_BEHAVIOUR: Tile-overlap starts combat. Bosses get a purple banner; packs only log “Battle started!…” under Chat (UX-CHAT-DEFAULT-OPEN).
DESIRED_BEHAVIOUR: Short ENCOUNTER_BANNER. Narrower than UX-ONBOARD-FIRST-MAP (no first-visit coach).
EVIDENCE: WorldExploration.tsx ~12231–12237 vs boss banner ~18014.
RECOMMENDED_ACTION: Wire a 1.5s stone banner on pack start. Do not change shouldTriggerOverworldEncounter.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: encounterStartCopy.test.ts; pack fight shows a brief banner.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-PORTAL-TRANSITION-OPAQUE
TITLE: Portal chip says only Portal...
CATEGORY: portal-clarity
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: src/frontend/src/utils/portalTransitionCopy.ts; WorldExploration.tsx HUD chip
CURRENT_BEHAVIOUR: During transitionInProgress the HUD chip is `Portal...` with no destination.
DESIRED_BEHAVIOUR: PORTAL_TRANSITION_CHIP “Crossing portal…”. Distinct from UX-PORTAL-LEGEND (nearby kind labels).
EVIDENCE: WorldExploration.tsx ~17718–17727.
RECOMMENDED_ACTION: Wire after WX PRs.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Chip wording during fade.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-DEATH-XP-LEFTOVER-COPY
TITLE: Flee XP penalty says leftover, not lifetime
CATEGORY: death
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/deathPenaltyCopy.ts; BattleUIPanel.tsx Flee
CURRENT_BEHAVIOUR: Flee title/confirm say “lose 20% XP”. App changelog correctly says leftover. Game Over leftover rule is already #421 UX-GAMEOVER-PENALTY-COPY — do not restack GameOverModal.
DESIRED_BEHAVIOUR: FLEE_TITLE / FLEE_CONFIRM name 20% leftover XP / 40% Doka.
EVIDENCE: BattleUIPanel.tsx ~519–523.
RECOMMENDED_ACTION: Wire deathPenaltyCopy into Flee after BattleUIPanel PRs. Pair with UX-FLEE-NATIVE-CONFIRM (#776) — keep one carved confirm, not a second native.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: deathPenaltyCopy.test.ts; Flee copy says leftover.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-SPELL-AP-DISABLED-REASON
TITLE: Champion spell hover names insufficient AP
CATEGORY: spells
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/spellSlotDisabledCopy.ts; BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Slots disable only for empty / cooldown / overworld. AP-short spells stay selectable. SummonControlPanel already greys on AP.
DESIRED_BEHAVIOUR: Title “Need N AP (have M)”. Empty-slot Book hint stays #830 UX-EMPTY-BAR-EQUIP (emptySpellSlotLabel matches emptyBattleSlotTitle).
EVIDENCE: BattleUIPanel.tsx ~626–649 disabled={isEmpty || isOnCooldown || !inBattle}.
RECOMMENDED_ACTION: Wire spellSlotDisabledCopy after #335 / #340. Do not change spend math.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: spellSlotDisabledCopy.test.ts; AP-short slot names the gap.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-ATTACK-NEAREST-WHY
TITLE: Attack Nearest disabled title names the blocking reason
CATEGORY: invalid-action-explanation
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/attackNearestDisabledCopy.ts; BattleUIPanel.tsx
CURRENT_BEHAVIOUR: One generic mid-battle string for mode, spell, AP, CD, range/LoS.
DESIRED_BEHAVIOUR: Distinct hover per resolveAttackNearestGate.
EVIDENCE: BattleUIPanel.tsx ~835–843; canAttackNearest WorldExploration.tsx ~18852–18896.
RECOMMENDED_ACTION: Wire after BattleUIPanel is free. Do not change Attack Nearest origin (player tile).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: attackNearestDisabledCopy.test.ts.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-BOSS-RUSH-ADVANCE-LABEL
TITLE: Boss Rush progression portal nearby label
CATEGORY: boss-progression
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/bossRushPortalCopy.ts; WorldExploration.tsx portal draw
CURRENT_BEHAVIOUR: Dungeon portals get canvas nearby labels. Boss Rush unlock is battle-log only (“portal hums to life”) + pink Room N/10 chip (UX-BOSS-RUSH-PINK). Distinct from UX-PORTAL-LEGEND (all kinds).
DESIRED_BEHAVIOUR: Nearby carved label: sealed “Clear Room N”; open “Next — Room N/10”.
EVIDENCE: WorldExploration.tsx ~7915–7941 (dungeon-only); ~13907–13911 log-only.
RECOMMENDED_ACTION: Wire bossRushPortalCopy into the nearby-label pass when WX is free. Pink chip restyle stays UX-BOSS-RUSH-PINK — do not mint a twin.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: bossRushPortalCopy.test.ts.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-SUMMON-UPGRADE-COST-COPY
TITLE: Summon upgrade lists 10× but wallet pays the usual price
CATEGORY: upgrades
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/summonUpgradeCostCopy.ts; SpellbookModal.tsx; spellUpgrade.ts
CURRENT_BEHAVIOUR: UI lists SUMMON_UPGRADE_COST_MULTIPLIER × 10 × 2^level. upgradeSpell charges 10 × 2^level. #372 UX-SUMMON-UPGRADE-TAX names the 10× as if it were the real charge — that line would teach the wrong number.
DESIRED_BEHAVIOUR: SUMMON_UPGRADE_COST_NOTE — listed 10×, wallet pays the usual rank-up. Gate is UX-SUMMON-UPGRADE-COST-GATE.
EVIDENCE: SpellbookModal.tsx ~439–448, ~830; spellUpgradeCanisterSpend.
RECOMMENDED_ACTION: Wire copy under summon Upgrade. Do not restack #372 as “charged 10×”. Do not change economics in this auditor PR.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: summonUpgradeCostCopy.test.ts.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-SUMMON-NAME-PIECETYPE
TITLE: Summon control bar shows raw pieceType
CATEGORY: combat
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/summonDisplayName.ts; WorldExploration.tsx SummonControlPanel
CURRENT_BEHAVIOUR: summonName={summon.pieceType} prints “knight”.
DESIRED_BEHAVIOUR: formatSummonDisplayName → “Knight”.
EVIDENCE: WorldExploration.tsx ~18964.
RECOMMENDED_ACTION: Wire when SummonControlPanel is free (older a11y PRs). Do not change kit resolution.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: summonDisplayName.test.ts.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-HEAL-JACKPOT-UNNAMED
TITLE: Rare full-heal Doka blessing is never named on the control
CATEGORY: reward-clarity
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/overworldVitalsCopy.ts HEAL_JACKPOT_HINT; WorldExploration.tsx overworld heal
CURRENT_BEHAVIOUR: Math.random() < 0.005 restores all HP for 1 Doka. Button never says so. Hit uses 🎰 JACKPOT HEAL serif gold chrome (off DESIGN.md carved-stone).
DESIRED_BEHAVIOUR: HEAL_JACKPOT_HINT on the heal title. Hit banner in stone/gold, not casino. Do not change 0.5% odds or 1 Doka debit.
EVIDENCE: WorldExploration.tsx ~18416, ~18436–18450, ~17956–17988.
RECOMMENDED_ACTION: Wire hint after WX. Do not advertise a second spend path.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: overworldVitalsCopy.test.ts; jackpot still 1 Doka full HP.
STATUS: IMPLEMENTED_THIS_RUN
```

---

## New this run (not implemented)

```
ACTION_ID: UX-SUMMON-UPGRADE-COST-GATE
TITLE: Spellbook blocks summon upgrades the wallet would accept
CATEGORY: upgrades
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: SpellbookModal.tsx canAfford; spellUpgrade.ts spellUpgradeCanisterSpend
CURRENT_BEHAVIOUR: canAfford = dokaBalance >= advertised 10×. A player with 50 Doka sees “Not enough Doka” for a level-0 summon the canister would charge 10 for. Distinct from #372 UX-SUMMON-UPGRADE-TAX (copy-only 10× line).
DESIRED_BEHAVIOUR: Gate on spellUpgradeCanisterSpend / canAffordSummonUpgradeUi — or actually charge 10×. Listed cost and wallet debit must agree.
EVIDENCE: SpellbookModal.tsx ~830, ~1157; upgradeSpell base 10 × 2^level.
RECOMMENDED_ACTION: HUMAN — SpellbookModal is in #372 / #425. Do not change upgradeSpell math unattended.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Summon upgrade with mid-wallet; HUD Doka delta matches the button.
STATUS: NEW
```

```
ACTION_ID: UX-INSPECT-SUMMON-AS-ENEMY
TITLE: Inspect labels player summons as Enemy
CATEGORY: enemy-information
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: StatPopup.tsx
CURRENT_BEHAVIOUR: Any non-id==="player" unit gets “· Enemy”, including player-side summons.
DESIRED_BEHAVIOUR: Player summons “· Ally” / “· Summon”; hostiles stay Enemy. Keep carved pills. Pair with UX-INSPECT-STAT-WORDS (#873).
EVIDENCE: StatPopup.tsx ~126–127.
RECOMMENDED_ACTION: HUMAN — StatPopup is in older PRs. Pass side / isSummon. Do not change inspect math.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Inspect ally summon ≠ Enemy; enemy inspect unchanged.
STATUS: NEW
```

```
ACTION_ID: UX-RECAP-DEFEAT-XP-BASIS
TITLE: Defeat recap XP loss omits leftover / 20% basis
CATEGORY: death
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: PostBattleRecap.tsx; deathPenaltyCopy.ts DEFEAT_XP_BASIS
CURRENT_BEHAVIOUR: Lava defeat recap shows “-N XP” with level only. Combat Game Over leftover rule is #421.
DESIRED_BEHAVIOUR: Subline DEFEAT_XP_BASIS. Do not rewire deathGuards (UX-DEATH-DUAL-MODAL).
EVIDENCE: PostBattleRecap.tsx ~259.
RECOMMENDED_ACTION: Wire after #354 owns PostBattleRecap.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Lava defeat recap shows leftover basis.
STATUS: NEW
```

---

## Twins not minted this run

| Tempted ID | Already queued as |
| :--- | :--- |
| UX-SELECT-PAPER-BABY-HEADLINE | #421 `UX-SELECTION-PBV-HEADING` (SELECTION_HEADLINE locked here for wiring) |
| UX-MAP-EFFECTS-EMPTY-OPEN | #517 `UX-MAP-MODIFIERS-EMPTY` |
| UX-BOSS-RUSH-HUD-CHROME | `UX-BOSS-RUSH-PINK` |
| UX-SUMMON-PHASE-YOUR-TURN | #690 `UX-INIT-SUMMON-PHASE` (strip + BattleUIPanel YOUR while summon acts) |
| UX-FLEE-DOUBLE-CONFIRM | `UX-FLEE-NATIVE-CONFIRM` |
| UX-BUY-DOKA-ICON-ONLY | `UX-SHOP-TWO-STORES` |

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
- `UX-SUMMON-UPGRADE-TAX` (copy assumes 10× is charged — pair with UX-SUMMON-UPGRADE-COST-COPY / GATE)
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
- `UX-HEAL-TITLE-MISMATCH` (`healHudCopy.ts` — union UX-HEAL-RATIO-CRYPTIC)

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

### #943
- `UX-SPELLBOOK-EMPTY-ADMIN` (copy locked, not wired)
- `UX-SPELLBOOK-CANCEL-KEEPS-UPGRADES` (copy locked, not wired)
- `UX-SUMMON-BAR-OVERLAP`
- `UX-FORGE-PIECE-COSMETIC`
- `UX-PROFILE-REALM-CTA` (PROFILE_SUBMIT_LABEL locked here; do not restack ProfileSetup)
- `UX-BOSS-GUIDE-ASSUMED-LEVEL`
- `UX-POTION-CARD-BATTLE-ONLY`
- `UX-CANVAS-ERROR-DUMP`
- `UX-SEALED-PORTAL-LOG-ONLY`
- `UX-AUTH-LOADING-VOID`

---

## Open (human / blocked by older PRs)

Do not edit `WorldExploration.tsx`, `GameFlow.tsx`, `BattleUIPanel.tsx`, `AchievementsPanel.tsx`, `PostBattleRecap.tsx`, `SpellbookModal.tsx`, `App.tsx`, `CharacterSelection.tsx`, `ProfileSetup.tsx`, `CharacterCreation.tsx`, `ChatPanel.tsx`, `BuffShop.tsx`, `StatPopup.tsx`, `BossGuideModal.tsx`, `SummonControlPanel.tsx`, or `DESIGN.md` in this auditor PR.

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

Also still OPEN (full blocks in #776 / #830 / #873 / #943 catalogs; do not mint twins): `UX-NO-LEAVE-REALM`, `UX-BOOST-UNMOUNTED`, `UX-HAZARD-TILE-LEGEND`, `UX-FEAT-TOAST-PRECREDIT`, `UX-LEVEL-UP-CHROME`, `UX-HUD-TOOL-CLUSTER`, `UX-SMALL-SCREEN-HARD-BLOCK`, `UX-LAUNCH-TAB-TITLE`, `UX-IDENTITY-FONT-DRIFT`, `UX-PORTAL-XP-PENDING`, `UX-CHAT-PROFILE-NAME`, `UX-SUMMON-LIFESPAN-WORDS`, `UX-SUMMON-SAAS-ORBS`, `UX-TURN-TIMER-WHY`, `UX-BOARD-LABEL`, `UX-AP-MP-CURRENT-MAX`, `UX-LOGIN-SILENT-BACKEND`, `UX-CHALLENGE-ZINDEX`, `UX-BOSS-RUSH-PINK`, `UX-VERSION-FORCE-RELOGIN`, `UX-FEATS-VS-ACHIEVEMENTS`, `UX-LANDING-VERSION`, `UX-SUMMON-BAR-OVERLAP`, `UX-SPELLBOOK-CANCEL-KEEPS-UPGRADES`.

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

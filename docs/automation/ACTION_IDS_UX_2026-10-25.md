# ACTION_ID catalog — 2026-10-25 UX audit

Stable IDs for the daily player-journey auditor. STATUS values: NEW | OPEN | IMPLEMENTED_THIS_RUN | IMPLEMENTED | SUPERSEDED.

Reuse IDs from [`ACTION_IDS_UX_2026-10-24.md`](./ACTION_IDS_UX_2026-10-24.md) (open PR #1018) and older UX PRs when the finding is the same. Do not mint twins.

HEAD: `0f5363f` (unchanged since 2026-09-21). DESIGN.md preserved.

---

## Copy locked this run (not wired — older PRs own the hosts)

```
ACTION_ID: UX-INIT-STRIP-LITERAL-ESCAPE
TITLE: Initiative strip prints raw \u escapes for leader / enraged / INIT
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/initiativeStripCopy.ts; InitiativeStrip.tsx (origin/main, untouched)
CURRENT_BEHAVIOUR: JSXText keeps source escapes, so portraits render "\uD83D\uDC51" / "\uD83D\uDD25" / "\u26A1{initiative}" and the hover card prints "\uD83D\uDC51 LEADER". JS-string piece symbols at PIECE_SYMBOLS already decode.
DESIRED_BEHAVIOUR: LEADER_CROWN / ENRAGED_FLAME / INITIATIVE_BOLT / LEADER_HOVER_NOTE — real 👑 / 🔥 / ⚡ glyphs.
EVIDENCE: InitiativeStrip.tsx ~368, ~387, ~454, ~562, ~644, ~660.
RECOMMENDED_ACTION: Wire initiativeStripCopy after #335 / #425 / #645. Do not restack inspect-click or compact-layout hunks.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: initiativeStripCopy.test.ts; leader crown is 👑; hover names the pack bonus.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-TURN-INDEX-T-PREFIX
TITLE: Battle phase column prints T{n} instead of Turn N
CATEGORY: ap-mp-clarity
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/turnIndexCopy.ts; BattleUIPanel.tsx (origin/main, untouched)
CURRENT_BEHAVIOUR: Under YOUR / ENEMY the index is `T{battleTurn}` with no word Turn. Distinct from UX-TURN-TIMER-WHY (`{n}s` countdown).
DESIRED_BEHAVIOUR: turnIndexLabel — “Turn 3”.
EVIDENCE: BattleUIPanel.tsx ~396–398.
RECOMMENDED_ACTION: Wire after BattleUIPanel is free. Do not change the 30s / Time Warp 15s timer.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: turnIndexCopy.test.ts; phase column says Turn.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-TILE-COORD-HUD
TITLE: Side panel prints a bare (x, y) pair
CATEGORY: hud-crowding
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/tileCoordCopy.ts; WorldExploration.tsx stats panel
CURRENT_BEHAVIOUR: `📍 (x, y)` with no word Tile. Reads as engineer debug.
DESIRED_BEHAVIOUR: tileCoordLabel — “Tile (8, 8)”.
EVIDENCE: WorldExploration.tsx ~18226–18229.
RECOMMENDED_ACTION: Wire after WX PRs. Do not change camera or pathfinding.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: tileCoordCopy.test.ts; line names Tile.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-DEATH-REALM-NEXT-CHIP
TITLE: Death Realm HUD chip never names the next step
CATEGORY: death
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/safeMapHudCopy.ts; WorldExploration.tsx region chip
CURRENT_BEHAVIOUR: Region chip can read “Death Realm”. Game Over already says walk to a portal; lava path auto-enters with no chip coach. Distinct from UX-PORTAL-LEGEND (canvas labels) and UX-DEATH-REALM-WAIT-BEAT (1.5s wait).
DESIRED_BEHAVIOUR: DEATH_REALM_HUD_CHIP — “Death Realm — walk to a portal”.
EVIDENCE: WorldExploration.tsx ~17827 and ~18231 `levelZone?.name ?? "Unknown"`; generateDeathRealmMap sets name “Death Realm”.
RECOMMENDED_ACTION: Wire safeMapHudChip when isDeathRealm after WX is free. Do not rewire deathGuards.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: safeMapHudCopy.test.ts; chip mentions portal.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-REST-AREA-NEXT-CHIP
TITLE: Rest Area HUD chip never says pick an exit
CATEGORY: portal-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/safeMapHudCopy.ts; WorldExploration.tsx region chip
CURRENT_BEHAVIOUR: Rest map zone name is “Rest Area”. Three exits (explore / dungeon / boss) have no nearby labels (UX-PORTAL-LEGEND). The chip does not say what to do next.
DESIRED_BEHAVIOUR: REST_AREA_HUD_CHIP — “Rest Area — pick an exit”.
EVIDENCE: WorldExploration.tsx generateRestMap ~5517; HUD chip ~17827.
RECOMMENDED_ACTION: Wire safeMapHudChip when isRestMap. Pair with UX-PORTAL-LEGEND; do not change rest-exit arming.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: safeMapHudCopy.test.ts; chip mentions exit.
STATUS: IMPLEMENTED_THIS_RUN
```

---

## New this run (not implemented)

```
ACTION_ID: UX-SIDE-PANEL-XP-REDUNDANT
TITLE: Side panel repeats the leftover XP bar already on the live HUD
CATEGORY: hud-crowding
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx top strip XP; stats-panel XP bar
CURRENT_BEHAVIOUR: Live HUD already draws leftover XP (`characterStats.exp` / `expToNext`) labelled only “XP”. The draggable Stats panel draws a second leftover XP bar under the name. Distinct from UX-HUD-DUPLICATE-TOPBAR (GameFlow dummy 0/100 — do not restore) and UX-HUD-XP-LEFTOVER-LABEL (copy on the live strip).
DESIRED_BEHAVIOUR: One leftover XP chrome. Prefer the live HUD strip. Side panel can keep level + name without a second bar.
EVIDENCE: WorldExploration.tsx ~17730–17779 and ~18190–18214.
RECOMMENDED_ACTION: HUMAN layout. Do not restore the GameFlow dummy bar. Union leftover label with #873 when wiring.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: 768 and 1280; leftover fill still matches xpHudProgress; no second 0/100 overlay.
STATUS: NEW
```

```
ACTION_ID: UX-HUD-DEAD-ATK-EVA
TITLE: Persisted ATK / resilience / evasion never appear on the player HUD
CATEGORY: enemy-information
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: WorldExploration.tsx Statistics; StatPopup.tsx; startingChampionStats.ts
CURRENT_BEHAVIOUR: CharacterStats stores atk 15, resilience 8, evasion 5, killCount. Statistics shows SP / SR / INIT / RES / CHC / FAIL. Inspect omits ATK. Kill count exists only on the Board. Frontend combat never reads player atk / resilience / evasion (enemy ATK is a separate extraStats path). Distinct from UX-INSPECT-STAT-WORDS (abbreviation titles) and UX-FAIL-INSPECT-ZERO.
DESIRED_BEHAVIOUR: Either show live combat stats the engine actually uses, or do not imply a 12-field sheet the HUD hides. Do not display unused numbers as if they affect damage.
EVIDENCE: WorldExploration.tsx Statistics ~18527–18563; StatPopup statEntries ~36–42; startingChampionStats.ts; no characterStats.atk reads in components.
RECOMMENDED_ACTION: HUMAN — decide whether ATK/EVA/resilience are live combat or leftover schema. Do not invent damage-math wiring in this auditor.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM if unused stats are shown as live
VALIDATION_REQUIRED: Inspect and Statistics never contradict combat; Board still shows kills.
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
| UX-BOARD-ACHIEVEMENTS-COL | `UX-FEATS-VS-ACHIEVEMENTS` (GameFlow LeaderboardModal still headers “Achievements”) |
| UX-SIDE-PANEL-XP-LABEL | #873 `UX-HUD-XP-LEFTOVER-LABEL` |
| UX-JACKPOT-BANNER-CASINO | `UX-HEAL-JACKPOT-UNNAMED` |
| UX-SLOT-GLYPH-ESCAPE | #1018 `UX-SELECT-SLOT-LITERAL-ESCAPE` |

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
- `UX-SUMMON-UPGRADE-COST-GATE` (HUMAN)
- `UX-INSPECT-SUMMON-AS-ENEMY` (HUMAN)
- `UX-RECAP-DEFEAT-XP-BASIS` (REPORT_ONLY)

---

## Open (human / blocked by older PRs)

Do not edit `WorldExploration.tsx`, `GameFlow.tsx`, `BattleUIPanel.tsx`, `AchievementsPanel.tsx`, `PostBattleRecap.tsx`, `SpellbookModal.tsx`, `App.tsx`, `CharacterSelection.tsx`, `ProfileSetup.tsx`, `CharacterCreation.tsx`, `ChatPanel.tsx`, `BuffShop.tsx`, `StatPopup.tsx`, `BossGuideModal.tsx`, `SummonControlPanel.tsx`, `InitiativeStrip.tsx`, or `DESIGN.md` in this auditor PR.

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

Also still OPEN (full blocks in #776 / #830 / #873 / #943 / #1018 catalogs; do not mint twins): `UX-NO-LEAVE-REALM`, `UX-BOOST-UNMOUNTED`, `UX-HAZARD-TILE-LEGEND`, `UX-FEAT-TOAST-PRECREDIT`, `UX-LEVEL-UP-CHROME`, `UX-HUD-TOOL-CLUSTER`, `UX-SMALL-SCREEN-HARD-BLOCK`, `UX-LAUNCH-TAB-TITLE`, `UX-IDENTITY-FONT-DRIFT`, `UX-PORTAL-XP-PENDING`, `UX-CHAT-PROFILE-NAME`, `UX-SUMMON-LIFESPAN-WORDS`, `UX-SUMMON-SAAS-ORBS`, `UX-TURN-TIMER-WHY`, `UX-BOARD-LABEL`, `UX-AP-MP-CURRENT-MAX`, `UX-LOGIN-SILENT-BACKEND`, `UX-CHALLENGE-ZINDEX`, `UX-BOSS-RUSH-PINK`, `UX-VERSION-FORCE-RELOGIN`, `UX-FEATS-VS-ACHIEVEMENTS`, `UX-LANDING-VERSION`, `UX-SUMMON-BAR-OVERLAP`, `UX-SPELLBOOK-CANCEL-KEEPS-UPGRADES`, `UX-SUMMON-UPGRADE-COST-GATE`.

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

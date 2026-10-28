# ACTION_ID catalog — 2026-10-28 UX audit

Stable IDs for the daily player-journey auditor. STATUS values: NEW | OPEN | IMPLEMENTED_THIS_RUN | IMPLEMENTED | SUPERSEDED.

Reuse IDs from [`ACTION_IDS_UX_2026-10-27.md`](./ACTION_IDS_UX_2026-10-27.md) (open PR #1178) and older UX PRs when the finding is the same. Do not mint twins.

HEAD: `0f5363f` (unchanged since 2026-09-21). DESIGN.md preserved.

---

## Copy locked this run (not wired — older PRs own the hosts)

```
ACTION_ID: UX-SUMMON-AI-LOG-DUMP
TITLE: Summon AI dumps [decide]/[cast]/[move] tags into the battle log
CATEGORY: invalid-action-explanation
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/summonAiLogCopy.ts; engine/summonExecutor.ts (untouched)
CURRENT_BEHAVIOUR: executeSummonAction emits `[decide] archer: skirmisher → cast Poison Arrow e-3 (no intent)`, `[move] wolf → (4,7) spent 2MP`, `[cast] … → targetId for N`, `[end] … turn complete` through SpellContext.log into the player battle log. Label is summonAI ?? pieceType ?? id.
DESIRED_BEHAVIOUR: summonMoveLog / summonCastLog / summonMeleeLog / summonTurnDoneLog — “Dire Wolf casts Poison Arrow.” Drop decide dumps, coordinates, intern ids, and bracket tags.
EVIDENCE: summonExecutor.ts ~107, ~120–131, ~148, ~156–179, ~233–235, ~316–321; WorldExploration.tsx SpellContext.log → logBattleEntry ~9166–9168.
RECOMMENDED_ACTION: Wire summonAiLogCopy after summonExecutor is free. Do not change AP/MP spend or destack.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: summonAiLogCopy.test.ts; a Wolf turn has no [decide] or (x,y); kit damage unchanged.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-EFFECT-APPLY-TARGETID
TITLE: Buff and DoT apply lines print intern targetId
CATEGORY: enemy-information
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/applyEffectCopy.ts; WorldExploration.tsx applyActiveEffect (origin/main, untouched)
CURRENT_BEHAVIOUR: Non-player apply logs `{name}: {mag} {STAT} on ${effect.targetId}` so the log reads `Fury: +2 AP on e-3 (3 turns)` / `Poison: 3 dmg/turn on summon-12`.
DESIRED_BEHAVIOUR: applyEffectLog — “Fury: +2 AP on you (3 turns).” / “Poison: 3 damage per turn on Wraith Bishop (2 turns).” Never e-3.
EVIDENCE: WorldExploration.tsx ~1905–1918.
RECOMMENDED_ACTION: Wire applyEffectCopy after WX is free. Pass the unit’s assigned name. Do not change effect merge.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: applyEffectCopy.test.ts; Frozen on an enemy names the enemy; duration math unchanged.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-DEFEAT-RETURNING-MAP
TITLE: Defeat log says Returning to map while death goes to the Death Realm
CATEGORY: death-explanation
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/defeatLogCopy.ts; WorldExploration.tsx handleBattleEnd (origin/main, untouched)
CURRENT_BEHAVIOUR: Loss logs `Defeated! Returning to map.` Combat death then opens Game Over → Death Realm; lava/spikes fire the root recap and auto-enter the realm in 1.5s. The line answers “where next?” with the wrong place.
DESIRED_BEHAVIOUR: DEFEAT_LOG — “Defeated — next you enter the Death Realm.” Keep VICTORY_LOG.
EVIDENCE: WorldExploration.tsx ~12334–12338; GameOverModal.tsx “Enter the Death Realm”.
RECOMMENDED_ACTION: Wire defeatLogCopy after WX is free. Do not rewire deathGuards.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: defeatLogCopy.test.ts; combat death still opens Game Over; lava still recaps.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-VOID-RIFT-COORD
TITLE: Void Rift warp prints the x,y tile
CATEGORY: feedback
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/voidRiftCopy.ts; WorldExploration.tsx player-turn Void Rift pick (origin/main, untouched)
CURRENT_BEHAVIOUR: `Void Rift warps tile (${pick.x},${pick.y})! Avoid it!` Distinct from UX-BARRIER-COORD-LOG and UX-TILE-COORD-HUD.
DESIRED_BEHAVIOUR: VOID_RIFT_WARP_LOG — “Void Rift shifts — a new tile is unsafe. Stay off the dark square.” Keep the random walkable pick.
EVIDENCE: WorldExploration.tsx ~14385–14391.
RECOMMENDED_ACTION: Wire voidRiftCopy after WX is free. Do not change VOID_RIFT_TICK damage.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: voidRiftCopy.test.ts; warp line has no comma-pair; rift still relocates.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-LEADER-DIED-BRACKET
TITLE: Pack-leader death logs [Leader died] plus chess pieceType
CATEGORY: enemy-information
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/leaderDiedCopy.ts; WorldExploration.tsx AI-tier ≥ 5 erratic branch (origin/main, untouched)
CURRENT_BEHAVIOUR: `[Leader died] Enemies acting erratically!` then `[Leader died] ${enemy.pieceType} acts erratically!` and `${enemy.pieceType} wildly casts ${spell}!`. Distinct from UX-HIT-LOG-PIECETYPE and UX-ENEMY-TURN-PIECETYPE.
DESIRED_BEHAVIOUR: PACK_ERRATIC_LOG / unitErraticLog / wildCastLog — “The pack scatters — their leader fell.” / “Wraith Bishop acts wildly.”
EVIDENCE: WorldExploration.tsx ~15508–15524, ~15561–15563.
RECOMMENDED_ACTION: Wire leaderDiedCopy after WX is free. Do not change erratic walk or spell pick.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: leaderDiedCopy.test.ts; log has no [Leader died]; erratic still fires at aiTier ≥ 5.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-CHAT-STATUS-ENEMY-ID
TITLE: Chat Status groups effects as ENEMY plus a sliced intern id
CATEGORY: enemy-information
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/chatStatusCopy.ts; ChatPanel.tsx Status tab (origin/main, untouched)
CURRENT_BEHAVIOUR: Non-player effects render `ENEMY ${enemyId.slice(-4).toUpperCase()}` so `e-3` reads `ENEMY E-3`. Duration still suffixes `t` (UX-STATUS-TURNS-SUFFIX). Distinct from UX-EFFECT-APPLY-TARGETID and UX-INSPECT-EFFECTS-EMPTY.
DESIRED_BEHAVIOUR: chatStatusGroupHeading — “WRAITH BISHOP” / “AN ENEMY”. Do not hide Chat Debug.
EVIDENCE: ChatPanel.tsx ~1042–1046, ~1093–1104.
RECOMMENDED_ACTION: Wire chatStatusCopy after ChatPanel is free. Pass the unit name keyed by targetId. Do not fold the Debug channel.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: chatStatusCopy.test.ts; Status heading has no E-3; Debug tab still reachable.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-CREATE-SAVE-RAW-ERR
TITLE: Forge save toast dumps raw Error.message
CATEGORY: character-creation
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/createSaveErrorCopy.ts; CharacterCreation.tsx save catch (origin/main, untouched)
CURRENT_BEHAVIOUR: After retries, toast is `Failed to save character: ${errMsg}` from Error.message (Candid / agent / network). Reported NEW on 2026-10-27; helper locked this run.
DESIRED_BEHAVIOUR: FORGE_SAVE_FAIL_TOAST — “Could not save this champion. Try again.” Never surface agent/Candid text.
EVIDENCE: CharacterCreation.tsx ~334–337.
RECOMMENDED_ACTION: Wire createSaveErrorCopy after CharacterCreation is free.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: createSaveErrorCopy.test.ts; offline save shows the generic line; successful forge still toasts the carved success.
STATUS: IMPLEMENTED_THIS_RUN
```

---

## New this run (not implemented)

```
ACTION_ID: UX-SUMMON-EXPIRED-PIECETYPE
TITLE: Controlled-summon fade logs pieceType expired
CATEGORY: spell-state
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx player-summon lifespan branch
CURRENT_BEHAVIOUR: When turnsRemaining ≤ 0 the log is `${nextCombatant.pieceType ?? "Summon"} expired`. “Expired” is the same lie as buff ticks (UX-EFFECT-EXPIRED-FALSE); the name is chess pieceType (UX-SUMMON-NAME-PIECETYPE is the control bar). Distinct from both.
DESIRED_BEHAVIOUR: “Dire Wolf fades from the field.” Prefer assigned name. Do not change lifespan math.
EVIDENCE: WorldExploration.tsx ~14426–14434.
RECOMMENDED_ACTION: HUMAN copy when WX is free. Pair with UX-SUMMON-NAME-PIECETYPE for the bar.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: A 3-turn Wolf fade names the Wolf; store still despawns.
STATUS: NEW
```

```
ACTION_ID: UX-ENEMY-TURN-PIECETYPE
TITLE: Enemy heal, skip, and intent lines still name chess pieceType
CATEGORY: enemy-information
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx enemy AI turn
CURRENT_BEHAVIOUR: `${enemy.pieceType} heals N HP`, `${enemy.pieceType} ends turn`, `${enemy.pieceType} uses ${spell}!`, `${enemy.pieceType} ${intent}`. UX-HIT-LOG-PIECETYPE covers damage and cast-on-you only; UX-LEADER-DIED-BRACKET covers the erratic branch.
DESIRED_BEHAVIOUR: Assigned name on heal / skip / intent / uses. Do not change AI picks.
EVIDENCE: WorldExploration.tsx ~16662, ~16690, ~16850, ~16871.
RECOMMENDED_ACTION: HUMAN — WX owned. Reuse combatantLogName from #1178 when that helper lands; do not restack hitLogCopy.ts here.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: A named Wraith Bishop heal does not log as bishop.
STATUS: NEW
```

```
ACTION_ID: UX-HAZARD-COUNT-DETECTED
TITLE: Map entry says N hazard tiles detected without naming them
CATEGORY: action-discoverability
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx post-generate hazard announce
CURRENT_BEHAVIOUR: `⚠️ N hazard tile(s) detected on this map!` then a separate modifier-name line. “Detected” is engineer. Tiles stay unnamed until the player steps (UX-HAZARD-TILE-LEGEND). Distinct from that ID.
DESIRED_BEHAVIOUR: “This map has lava, ice, and spikes.” or drop the count line and keep the modifier names. Do not change hazard placement.
EVIDENCE: WorldExploration.tsx ~6726–6739.
RECOMMENDED_ACTION: HUMAN copy when WX is free.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: A lava map names lava before the first step; placement unchanged.
STATUS: NEW
```

```
ACTION_ID: UX-SPELLBAR-DEFER-TOAST
TITLE: Mid-fight spell-bar queue uses two different toast sentences
CATEGORY: feedback
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx handleSetActiveSpells + cleanupBattle
CURRENT_BEHAVIOUR: Queue toast is `⚔️ Changes will apply after battle` (no noun). Flush toast is `Spell bar changes applied after battle`. The first does not say what changed.
DESIRED_BEHAVIOUR: Both name the spell bar: “Spell bar changes apply after this fight.” / “Spell bar changes applied.” Do not apply mid-fight (that desyncs the bar).
EVIDENCE: WorldExploration.tsx ~2862–2871, ~11602–11614.
RECOMMENDED_ACTION: HUMAN — WX owned. Copy only.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Queue during a fight; after victory the bar matches the queued list.
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
| UX-COLLECT-TAG | #1137 `UX-GROUND-DOKA-LOG-ONLY` |
| UX-STRIKER-CHEBYSHEV | #1137 `UX-CHALLENGE-CHEBYSHEV` |
| UX-RECAP-EXPLORE-ALWAYS | #1137 `UX-RECAP-CONTINUE-VOID` |
| UX-REST-NO-HEAL-CHIP | #1137 `UX-REST-AREA-NO-HEAL` |
| UX-BOSS-PURPLE-FLASH | #1137 `UX-BOSS-BANNER-FLASH` |
| UX-DOT-KEY-VALUE | #1178 `UX-DOT-LOG-ENGINEER` |
| UX-BUFF-EXPIRED-LIE | #1178 `UX-EFFECT-EXPIRED-FALSE` |
| UX-HIT-CHESS-NAME | #1178 `UX-HIT-LOG-PIECETYPE` |
| UX-ICE-SLOWED | #1178 `UX-ICE-SLOW-MISLABEL` |
| UX-BARRIER-XY | #1178 `UX-BARRIER-COORD-LOG` |
| UX-SP-SR-PIPELINE | #1178 `UX-DMG-BREAKDOWN-JARGON` |
| UX-INSPECT-NO-PILLS | #1178 `UX-INSPECT-EFFECTS-EMPTY` |
| UX-PLAYER-TOOK-DUP | #1178 `UX-PLAYER-DMG-DOUBLE-LOG` |
| UX-GAMEKEY-STAFF-WORD | #1178 `UX-GAMEKEY-ADMIN-HINT` |
| UX-REGISTER-RES-GEAR | #1178 `UX-ENEMY-REGISTER-GEAR` |
| UX-HPSCALE-HOVER | #1178 `UX-SUMMON-SCALE-TOOLTIP` |
| UX-SEPARATED-OPEN | #1178 `UX-BATTLE-START-SEPARATED` |
| UX-768-BREAKPOINT | #1178 `UX-SMALL-SCREEN-PX` |
| UX-DELTA-LVL | #1178 `UX-BOSS-GUIDE-DELTA` |
| UX-REGION-UNKNOWN | #1178 `UX-ZONE-UNKNOWN-LABEL` |
| UX-CHAT-STATUS-T | #1137 `UX-STATUS-TURNS-SUFFIX` |
| UX-ICE-DESC-SLOWED | #1178 `UX-ICE-SLOW-MISLABEL` (ActiveEffect.description still says Slowed) |
| UX-BOSS-LOG-SHOUT | `UX-BOSS-BANNER-FLASH` (banner) + `UX-ENCOUNTER-NO-BANNER` (pack) |
| UX-GAMEFLOW-PBV-H1 | #421 `UX-SELECTION-PBV-HEADING` |

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

### #696
- Inferno gifted-card “3-turn cooldown” (`spellCooldownCopy.ts`). Slot hover `CD: Nt` is #1137 `UX-SPELL-CD-TURNS`.

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

### #1137
- `UX-CHALLENGE-CHEBYSHEV`
- `UX-SPELL-CD-TURNS`
- `UX-DUNGEON-CHAIN-MULTIPLIER`
- `UX-GROUND-DOKA-LOG-ONLY`
- `UX-STATUS-TURNS-SUFFIX`
- `UX-CHALLENGE-BADGE-VOID`
- `UX-RECAP-CONTINUE-VOID` (HUMAN)
- `UX-REST-AREA-NO-HEAL` (HUMAN)
- `UX-BOSS-BANNER-FLASH` (HUMAN)
- `UX-LANDING-ADS-UNLABELED` (HUMAN)
- `UX-SPELL-PHY-LABEL` (HUMAN)
- `UX-MAP-EFFECTS-DUAL-LABEL` (HUMAN)

### #1178
- `UX-DOT-LOG-ENGINEER`
- `UX-EFFECT-EXPIRED-FALSE`
- `UX-HIT-LOG-PIECETYPE`
- `UX-ICE-SLOW-MISLABEL`
- `UX-BARRIER-COORD-LOG`
- `UX-DMG-BREAKDOWN-JARGON`
- `UX-INSPECT-EFFECTS-EMPTY` (HUMAN)
- `UX-PLAYER-DMG-DOUBLE-LOG` (HUMAN)
- `UX-GAMEKEY-ADMIN-HINT` (HUMAN)
- `UX-ENEMY-REGISTER-GEAR` (HUMAN)
- `UX-SUMMON-SCALE-TOOLTIP` (HUMAN)
- `UX-BATTLE-START-SEPARATED` (HUMAN)
- `UX-SMALL-SCREEN-PX` (HUMAN)
- `UX-BOSS-GUIDE-DELTA` (HUMAN)
- `UX-ZONE-UNKNOWN-LABEL` (HUMAN)
- `UX-CREATE-SAVE-RAW-ERR` helper is this run; do not restack the 10-27 report.

---

## Open (human / blocked by older PRs)

Do not edit `WorldExploration.tsx`, `GameFlow.tsx`, `BattleUIPanel.tsx`, `AchievementsPanel.tsx`, `PostBattleRecap.tsx`, `SpellbookModal.tsx`, `App.tsx`, `CharacterSelection.tsx`, `ProfileSetup.tsx`, `CharacterCreation.tsx`, `ChatPanel.tsx`, `BuffShop.tsx`, `StatPopup.tsx`, `BossGuideModal.tsx`, `SummonControlPanel.tsx`, `InitiativeStrip.tsx`, `ChallengePanel.tsx`, `StatusEffectBadge.tsx`, `LandingPage.tsx`, `MapModifiersPanel.tsx`, `EnemyRegister.tsx`, `DokaGameKeyShop.tsx`, `castHelpers.ts`, `spellEngine.ts`, `summonExecutor.ts`, or `DESIGN.md` in this auditor PR.

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
RECOMMENDED_ACTION: Human-approved unify. Do not rewire deathGuards unattended. Pair with UX-DEATH-REALM-WAIT-BEAT, UX-DEATH-REALM-NEXT-CHIP, and UX-DEFEAT-RETURNING-MAP.
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

Also still OPEN (full blocks in #776 / #830 / #873 / #943 / #1018 / #1060 / #1137 / #1178 catalogs; do not mint twins): `UX-NO-LEAVE-REALM`, `UX-BOOST-UNMOUNTED`, `UX-HAZARD-TILE-LEGEND`, `UX-FEAT-TOAST-PRECREDIT`, `UX-LEVEL-UP-CHROME`, `UX-HUD-TOOL-CLUSTER`, `UX-SMALL-SCREEN-HARD-BLOCK`, `UX-LAUNCH-TAB-TITLE`, `UX-IDENTITY-FONT-DRIFT`, `UX-PORTAL-XP-PENDING`, `UX-CHAT-PROFILE-NAME`, `UX-SUMMON-LIFESPAN-WORDS`, `UX-SUMMON-SAAS-ORBS`, `UX-TURN-TIMER-WHY`, `UX-BOARD-LABEL`, `UX-AP-MP-CURRENT-MAX`, `UX-LOGIN-SILENT-BACKEND`, `UX-CHALLENGE-ZINDEX`, `UX-BOSS-RUSH-PINK`, `UX-VERSION-FORCE-RELOGIN`, `UX-FEATS-VS-ACHIEVEMENTS`, `UX-LANDING-VERSION`, `UX-SUMMON-BAR-OVERLAP`, `UX-SPELLBOOK-CANCEL-KEEPS-UPGRADES`, `UX-SUMMON-UPGRADE-COST-GATE`, `UX-SIDE-PANEL-XP-REDUNDANT`, `UX-HUD-DEAD-ATK-EVA`, `UX-RECAP-CONTINUE-VOID`, `UX-REST-AREA-NO-HEAL`, `UX-BOSS-BANNER-FLASH`, `UX-LANDING-ADS-UNLABELED`, `UX-SPELL-PHY-LABEL`, `UX-MAP-EFFECTS-DUAL-LABEL`, `UX-INSPECT-EFFECTS-EMPTY`, `UX-PLAYER-DMG-DOUBLE-LOG`, `UX-GAMEKEY-ADMIN-HINT`, `UX-ENEMY-REGISTER-GEAR`, `UX-SUMMON-SCALE-TOOLTIP`, `UX-BATTLE-START-SEPARATED`, `UX-SMALL-SCREEN-PX`, `UX-BOSS-GUIDE-DELTA`, `UX-ZONE-UNKNOWN-LABEL`.

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
- `UX-CREATE-SAVE-RAW-ERR` — helper locked this run; do not mint a twin toast ID.

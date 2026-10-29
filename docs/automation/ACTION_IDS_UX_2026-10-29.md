# ACTION_ID catalog — 2026-10-29 UX audit

Stable IDs for the daily player-journey auditor. STATUS values: NEW | OPEN | IMPLEMENTED_THIS_RUN | IMPLEMENTED | SUPERSEDED.

Reuse IDs from [`ACTION_IDS_UX_2026-10-28.md`](./ACTION_IDS_UX_2026-10-28.md) (open PR #1242) and older UX PRs when the finding is the same. Do not mint twins.

HEAD: `0f5363f` (unchanged since 2026-09-21). DESIGN.md preserved.

---

## Copy locked this run (not wired — older PRs own the hosts)

```
ACTION_ID: UX-SUMMON-EXPIRED-PIECETYPE
TITLE: Controlled-summon fade logs pieceType expired
CATEGORY: spell-state
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/summonExpiredCopy.ts; WorldExploration.tsx player-summon lifespan branch (origin/main, untouched)
CURRENT_BEHAVIOUR: When turnsRemaining ≤ 0 the log is `${nextCombatant.pieceType ?? "Summon"} expired`. “Expired” is the same lie as buff ticks (UX-EFFECT-EXPIRED-FALSE); the name is chess pieceType (UX-SUMMON-NAME-PIECETYPE is the control bar). Distinct from both.
DESIRED_BEHAVIOUR: summonExpiredLog — “Dire Wolf fades from the field.” Prefer assigned name. Do not change lifespan math.
EVIDENCE: WorldExploration.tsx ~14426–14434.
RECOMMENDED_ACTION: Wire summonExpiredCopy after WX is free. Pair with UX-SUMMON-NAME-PIECETYPE for the bar.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: summonExpiredCopy.test.ts; a 3-turn Wolf fade names the Wolf; store still despawns.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-ENEMY-TURN-PIECETYPE
TITLE: Enemy heal, skip, and intent lines still name chess pieceType
CATEGORY: enemy-information
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/enemyTurnCopy.ts; WorldExploration.tsx enemy AI turn (origin/main, untouched)
CURRENT_BEHAVIOUR: `${enemy.pieceType} heals N HP`, `${enemy.pieceType} ends turn`, `${enemy.pieceType} uses ${spell}!`, `${enemy.pieceType} skipped (out of range) (${intent})` leaking `cooldown` / `no-spell` / `cap`. UX-HIT-LOG-PIECETYPE covers damage and cast-on-you only; UX-LEADER-DIED-BRACKET covers the erratic branch.
DESIRED_BEHAVIOUR: enemyHealsLog / enemyUsesLog / enemySkipLog / enemyEndsTurnLog — “Wraith Bishop heals 12 HP.” / “Wraith Bishop holds.” Never pieceType or intern intents. Do not change AI picks.
EVIDENCE: WorldExploration.tsx ~16662, ~16690, ~16841–16850, ~16871.
RECOMMENDED_ACTION: Wire enemyTurnCopy after WX is free. Reuse combatantLogName from #1178 when that helper lands; do not restack hitLogCopy.ts here.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: enemyTurnCopy.test.ts; a named Wraith Bishop heal does not log as bishop; skip does not print cooldown.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-HAZARD-COUNT-DETECTED
TITLE: Map entry says N hazard tiles detected without naming them
CATEGORY: action-discoverability
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/hazardCountCopy.ts; WorldExploration.tsx post-generate hazard announce (origin/main, untouched)
CURRENT_BEHAVIOUR: `⚠️ N hazard tile(s) detected on this map!` then a separate modifier-name line. “Detected” is engineer. Tiles stay unnamed until the player steps (UX-HAZARD-TILE-LEGEND). Distinct from that ID.
DESIRED_BEHAVIOUR: hazardCountLog — “This map has lava, ice, and spikes.” Do not change hazard placement.
EVIDENCE: WorldExploration.tsx ~6726–6739.
RECOMMENDED_ACTION: Wire hazardCountCopy after WX is free.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: hazardCountCopy.test.ts; a lava map names lava before the first step; placement unchanged.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-SPELLBAR-DEFER-TOAST
TITLE: Mid-fight spell-bar queue uses two different toast sentences
CATEGORY: feedback
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/spellbarDeferCopy.ts; WorldExploration.tsx handleSetActiveSpells + cleanupBattle (origin/main, untouched)
CURRENT_BEHAVIOUR: Queue toast is `⚔️ Changes will apply after battle` (no noun). Flush toast is `Spell bar changes applied after battle`. The first does not say what changed.
DESIRED_BEHAVIOUR: SPELLBAR_QUEUE_TOAST / SPELLBAR_APPLIED_TOAST — “Spell bar changes apply after this fight.” / “Spell bar changes applied.” Do not apply mid-fight (that desyncs the bar).
EVIDENCE: WorldExploration.tsx ~2862–2871, ~11602–11614.
RECOMMENDED_ACTION: Wire spellbarDeferCopy after WX is free. Copy only.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: spellbarDeferCopy.test.ts; queue during a fight; after victory the bar matches the queued list.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-CHAIN-BOUNCE-ID
TITLE: Chain Lightning bounce logs intern combatant id
CATEGORY: enemy-information
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/chainBounceCopy.ts; engine/castHelpers.ts applyDamageToEnemy (origin/main, untouched)
CURRENT_BEHAVIOUR: `${spell.name} bounced to ${bounceEnemy.id} for ${bounceDmg} damage!` so the log reads `Chain Lightning bounced to e-3 for 8 damage!`. Distinct from UX-HIT-LOG-PIECETYPE (primary hit) and UX-EFFECT-APPLY-TARGETID (buff apply).
DESIRED_BEHAVIOUR: chainBounceLog — “Chain Lightning bounced to Wraith Bishop for 8 damage!” Never e-3. Do not change bounce count or 50% falloff.
EVIDENCE: castHelpers.ts ~447–459.
RECOMMENDED_ACTION: Wire chainBounceCopy after castHelpers is free. Pass assigned name, not id.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: chainBounceCopy.test.ts; a bounce names the unit; bounce damage math unchanged.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-BETRAYAL-PIECETYPE
TITLE: Pack betrayal logs chess pieceType and DOUBLE BETRAYAL shout
CATEGORY: enemy-information
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/betrayalCopy.ts; WorldExploration.tsx AI-tier ≥ 10 betrayal branch (origin/main, untouched)
CURRENT_BEHAVIOUR: `${enemy.pieceType} turns on ${allyT.pieceType}! Betrayal!`, `The leader ${allyT.pieceType} fell via betrayal!`, `DOUBLE BETRAYAL! ${sb.pieceType} also turns!`. Distinct from UX-ENEMY-TURN-PIECETYPE and UX-LEADER-DIED-BRACKET.
DESIRED_BEHAVIOUR: betrayalLog / leaderBetrayalLog / doubleBetrayalLog — “Fetid Rook turns on Wraith Bishop! Betrayal!” Never pieceType or a DOUBLE BETRAYAL shout. Do not change 5% / 15% rolls or 6× enrage.
EVIDENCE: WorldExploration.tsx ~15608–15623, ~15675–15688.
RECOMMENDED_ACTION: Wire betrayalCopy after WX is free.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: betrayalCopy.test.ts; a named Rook betrayal does not log as rook; HP/enrage math unchanged.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-SUMMON-KIT-CAST-PIECETYPE
TITLE: Controlled-summon kit cast logs chess pieceType
CATEGORY: spell-state
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/summonKitCastCopy.ts; WorldExploration.tsx castControlledSummonSpell (origin/main, untouched)
CURRENT_BEHAVIOUR: `${summon.pieceType} casts ${plan.spell.name ?? plan.spell.id}` so a Wolf kit press logs `pawn casts Poison Arrow` (or a raw spell id). Distinct from UX-SUMMON-NAME-PIECETYPE (bar), UX-SUMMON-EXPIRED-PIECETYPE (fade), and UX-SUMMON-AI-LOG-DUMP (AI tags).
DESIRED_BEHAVIOUR: summonKitCastLog — “Dire Wolf casts Poison Arrow.” Prefer assigned name and spell.name. Do not change AP debit or live gate.
EVIDENCE: WorldExploration.tsx ~9888–9891.
RECOMMENDED_ACTION: Wire summonKitCastCopy after WX is free. Do not restack summonControlCast.ts (#1267 / #1274).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: summonKitCastCopy.test.ts; a Wolf kit press names the Wolf; AP still debits.
STATUS: IMPLEMENTED_THIS_RUN
```

---

## Wired this run (live canvas path; rejectCopy is not owned by older PRs)

```
ACTION_ID: UX-CAST-ABORT-COPY
TITLE: Canvas abort float said Aborted
CATEGORY: invalid-action-explanation
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/engine/rejectCopy.ts (wired); WorldExploration.tsx already calls playerFacingCastResult (untouched)
CURRENT_BEHAVIOUR: Sprite and tile cast results mapped `abort` → `Aborted`. Unknown snake_case tokens interpolated as `Cast no_los!`.
DESIRED_BEHAVIOUR: `abort` → “Cast cancelled”. Unknown underscore tokens → “Cast failed”. Keep “Not enough AP”, “On cooldown”, and “Cast fizzled!”.
EVIDENCE: rejectCopy.ts playerFacingCastResult; WorldExploration.tsx ~10247, ~10493, ~10907, ~11081.
RECOMMENDED_ACTION: Implemented this run. Do not change targeting math.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: rejectCopy.test.ts; abort float is Cast cancelled; no_ap / cooldown unchanged.
STATUS: IMPLEMENTED_THIS_RUN
```

---

## New this run (not implemented)

```
ACTION_ID: UX-NO-MODIFIER-LOG
TITLE: Empty maps log No map modifier this area
CATEGORY: feedback
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx post-generate modifier announce
CURRENT_BEHAVIOUR: Every map with `triggered.size === 0` logs `No map modifier this area.` Distinct from UX-MAP-MODIFIERS-EMPTY (overlay panel that opens empty) and UX-HAZARD-COUNT-DETECTED (count of hazard tiles).
DESIRED_BEHAVIOUR: Stay silent when nothing rolled, or one carved line: “This area is clear of map effects.” Do not change modifier rolls.
EVIDENCE: WorldExploration.tsx ~6732–6741.
RECOMMENDED_ACTION: HUMAN copy when WX is free. Default silent.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: A map with no modifier does not spam the battle log; a Thorned Ground map still names it.
STATUS: NEW
```

```
ACTION_ID: UX-PHASE2-STATS-X
TITLE: Boss phase 2 shouts Stats boosted times N
CATEGORY: enemy-information
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx boss phase transition
CURRENT_BEHAVIOUR: Non-Weeping-Pawn phase 2 logs `⚡ ${name} PHASE 2! Stats boosted ×${mult}!`. “Stats” never names HP / AP / damage. Distinct from UX-BOSS-BANNER-FLASH (1.5s purple SaaS) and UX-ENCOUNTER-NO-BANNER (pack).
DESIRED_BEHAVIOUR: “{Boss} enters phase 2 — stronger now.” Keep the Weeping Pawn PROMOTES line. Do not change phase HP math.
EVIDENCE: WorldExploration.tsx ~15790–15799.
RECOMMENDED_ACTION: HUMAN copy when WX is free.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: Phase 2 still restores HP; log has no ×N intern multiplier.
STATUS: NEW
```

```
ACTION_ID: UX-ENEMY-HAZARD-PIECETYPE
TITLE: Enemy lava ice and spikes logs still name chess pieceType
CATEGORY: enemy-information
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx enemy hazard landing
CURRENT_BEHAVIOUR: `${enemy.pieceType} walked on lava!`, `stepped on ice! Slowed!`, `hit spikes!`. Ice still says Slowed (UX-ICE-SLOW-MISLABEL). Distinct from UX-ENEMY-TURN-PIECETYPE (heal / skip / uses) which this run locked without the hazard lines.
DESIRED_BEHAVIOUR: Assigned name. Ice should say Frozen, not Slowed. Do not change hazard damage.
EVIDENCE: WorldExploration.tsx ~16899–16950.
RECOMMENDED_ACTION: HUMAN — WX owned. Pair with enemyTurnCopy when that helper is wired; do not restack iceHazardCopy.ts (#1178).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: A named Wraith Bishop lava step does not log as bishop; ice still applies Frozen −2 MP.
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
| UX-SUMMON-AI-TAGS | #1242 `UX-SUMMON-AI-LOG-DUMP` |
| UX-APPLY-E-3 | #1242 `UX-EFFECT-APPLY-TARGETID` |
| UX-DEFEAT-MAP | #1242 `UX-DEFEAT-RETURNING-MAP` |
| UX-RIFT-XY | #1242 `UX-VOID-RIFT-COORD` |
| UX-LEADER-BRACKET | #1242 `UX-LEADER-DIED-BRACKET` |
| UX-STATUS-E-3 | #1242 `UX-CHAT-STATUS-ENEMY-ID` |
| UX-FORGE-ERRMSG | #1242 `UX-CREATE-SAVE-RAW-ERR` |
| UX-SKIP-COOLDOWN-TOKEN | this run `UX-ENEMY-TURN-PIECETYPE` (skip parentheticals) |
| UX-BOSS-LOG-SHOUT | `UX-BOSS-BANNER-FLASH` (banner) + `UX-ENCOUNTER-NO-BANNER` (pack) |
| UX-GAMEFLOW-PBV-H1 | #421 `UX-SELECTION-PBV-HEADING` |
| UX-UNKNOWN-SPELL-KIT | `summonControlCastFailMessage("no_spell")` is “Unknown spell”; do not restack #1267 / #1274 |

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

### #1242
- `UX-SUMMON-AI-LOG-DUMP`
- `UX-EFFECT-APPLY-TARGETID`
- `UX-DEFEAT-RETURNING-MAP`
- `UX-VOID-RIFT-COORD`
- `UX-LEADER-DIED-BRACKET`
- `UX-CHAT-STATUS-ENEMY-ID`
- `UX-CREATE-SAVE-RAW-ERR`
- The four IDs this run locked (`UX-SUMMON-EXPIRED-PIECETYPE`, `UX-ENEMY-TURN-PIECETYPE`, `UX-HAZARD-COUNT-DETECTED`, `UX-SPELLBAR-DEFER-TOAST`) were NEW on #1242 — do not restack those hunks; this PR adds the helpers only.

### #1267 / #1274
- Champion-bar select skip / kit Escape cancel. Do not restack `summonControlCast.ts`, BattleUIPanel, WorldExploration, or SummonControlPanel.

---

## Open (human / blocked by older PRs)

Do not edit `WorldExploration.tsx`, `GameFlow.tsx`, `BattleUIPanel.tsx`, `AchievementsPanel.tsx`, `PostBattleRecap.tsx`, `SpellbookModal.tsx`, `App.tsx`, `CharacterSelection.tsx`, `ProfileSetup.tsx`, `CharacterCreation.tsx`, `ChatPanel.tsx`, `BuffShop.tsx`, `StatPopup.tsx`, `BossGuideModal.tsx`, `SummonControlPanel.tsx`, `InitiativeStrip.tsx`, `ChallengePanel.tsx`, `StatusEffectBadge.tsx`, `LandingPage.tsx`, `MapModifiersPanel.tsx`, `EnemyRegister.tsx`, `DokaGameKeyShop.tsx`, `castHelpers.ts`, `spellEngine.ts`, `summonExecutor.ts`, `summonControlCast.ts`, or `DESIGN.md` in this auditor PR.

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

Also still OPEN (full blocks in #776 / #830 / #873 / #943 / #1018 / #1060 / #1137 / #1178 / #1242 catalogs; do not mint twins): `UX-NO-LEAVE-REALM`, `UX-BOOST-UNMOUNTED`, `UX-HAZARD-TILE-LEGEND`, `UX-FEAT-TOAST-PRECREDIT`, `UX-LEVEL-UP-CHROME`, `UX-HUD-TOOL-CLUSTER`, `UX-SMALL-SCREEN-HARD-BLOCK`, `UX-LAUNCH-TAB-TITLE`, `UX-IDENTITY-FONT-DRIFT`, `UX-PORTAL-XP-PENDING`, `UX-CHAT-PROFILE-NAME`, `UX-SUMMON-LIFESPAN-WORDS`, `UX-SUMMON-SAAS-ORBS`, `UX-TURN-TIMER-WHY`, `UX-BOARD-LABEL`, `UX-AP-MP-CURRENT-MAX`, `UX-LOGIN-SILENT-BACKEND`, `UX-CHALLENGE-ZINDEX`, `UX-BOSS-RUSH-PINK`, `UX-VERSION-FORCE-RELOGIN`, `UX-FEATS-VS-ACHIEVEMENTS`, `UX-LANDING-VERSION`, `UX-SUMMON-BAR-OVERLAP`, `UX-SPELLBOOK-CANCEL-KEEPS-UPGRADES`, `UX-SUMMON-UPGRADE-COST-GATE`, `UX-SIDE-PANEL-XP-REDUNDANT`, `UX-HUD-DEAD-ATK-EVA`, `UX-RECAP-CONTINUE-VOID`, `UX-REST-AREA-NO-HEAL`, `UX-BOSS-BANNER-FLASH`, `UX-LANDING-ADS-UNLABELED`, `UX-SPELL-PHY-LABEL`, `UX-MAP-EFFECTS-DUAL-LABEL`, `UX-INSPECT-EFFECTS-EMPTY`, `UX-PLAYER-DMG-DOUBLE-LOG`, `UX-GAMEKEY-ADMIN-HINT`, `UX-ENEMY-REGISTER-GEAR`, `UX-SUMMON-SCALE-TOOLTIP`, `UX-BATTLE-START-SEPARATED`, `UX-SMALL-SCREEN-PX`, `UX-BOSS-GUIDE-DELTA`, `UX-ZONE-UNKNOWN-LABEL`.

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
- `UX-CREATE-SAVE-RAW-ERR` — helper locked on #1242; do not mint a twin toast ID.
- `UX-SUMMON-EXPIRED-PIECETYPE` / `UX-ENEMY-TURN-PIECETYPE` / `UX-HAZARD-COUNT-DETECTED` / `UX-SPELLBAR-DEFER-TOAST` — helpers locked this run; do not mint twins.

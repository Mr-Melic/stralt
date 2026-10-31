# ACTION_ID catalog — 2026-10-31 UX audit

Stable IDs for the daily player-journey auditor. STATUS values: NEW | OPEN | IMPLEMENTED_THIS_RUN | IMPLEMENTED | SUPERSEDED.

Reuse IDs from [`ACTION_IDS_UX_2026-10-29.md`](./ACTION_IDS_UX_2026-10-29.md) (open PR #1298), [`ACTION_IDS_UX_2026-10-28.md`](./ACTION_IDS_UX_2026-10-28.md) (open PR #1242), and older UX PRs when the finding is the same. Do not mint twins.

HEAD: `0f5363f` (unchanged since 2026-09-21). DESIGN.md preserved.

---

## Copy locked this run (not wired — older PRs own the hosts)

```
ACTION_ID: UX-NO-MODIFIER-LOG
TITLE: Empty maps log No map modifier this area
CATEGORY: feedback
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/noModifierCopy.ts; WorldExploration.tsx post-generate modifier announce (origin/main, untouched)
CURRENT_BEHAVIOUR: Every map with `triggered.size === 0` logs `No map modifier this area.` Distinct from UX-MAP-MODIFIERS-EMPTY (overlay panel that opens empty) and UX-HAZARD-COUNT-DETECTED (named hazard kinds).
DESIRED_BEHAVIOUR: noModifierLog — silent by default. Optional CLEAR_AREA_LOG — “This area is clear of map effects.” Do not change modifier rolls.
EVIDENCE: WorldExploration.tsx ~6732–6741.
RECOMMENDED_ACTION: Wire noModifierCopy after WX is free. Default silent.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: noModifierCopy.test.ts; a map with no modifier does not spam the battle log; a Thorned Ground map still names it.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-PHASE2-STATS-X
TITLE: Boss phase 2 shouts Stats boosted times N
CATEGORY: enemy-information
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/phase2Copy.ts; WorldExploration.tsx boss phase transition (origin/main, untouched)
CURRENT_BEHAVIOUR: Non-Weeping-Pawn phase 2 logs `⚡ ${name} PHASE 2! Stats boosted ×${mult}!`. “Stats” never names HP / AP / damage. Distinct from UX-BOSS-BANNER-FLASH (1.5s purple SaaS) and UX-WEEPING-PROMOTE-SHOUT (Weeping Pawn ALL-CAPS line).
DESIRED_BEHAVIOUR: phase2Log — “{Boss} enters phase 2 — stronger now.” Never print ×N. Keep the Weeping Pawn PROMOTES line until UX-WEEPING-PROMOTE-SHOUT. Do not change phase HP math.
EVIDENCE: WorldExploration.tsx ~15790–15799.
RECOMMENDED_ACTION: Wire phase2Copy after WX is free.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: phase2Copy.test.ts; Phase 2 still restores HP; log has no ×N intern multiplier.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-ENEMY-HAZARD-PIECETYPE
TITLE: Enemy lava ice and spikes logs still name chess pieceType
CATEGORY: enemy-information
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/enemyHazardCopy.ts; WorldExploration.tsx enemy hazard landing (origin/main, untouched)
CURRENT_BEHAVIOUR: `${enemy.pieceType} walked on lava!`, `stepped on ice! Slowed!`, `hit spikes!`. Ice still says Slowed (UX-ICE-SLOW-MISLABEL). Distinct from UX-ENEMY-TURN-PIECETYPE (heal / skip / uses) which #1298 locked without the hazard lines.
DESIRED_BEHAVIOUR: enemyHazardLog — “Wraith Bishop walked on lava! -12 HP.” Ice says Frozen, not Slowed. Do not change hazard damage.
EVIDENCE: WorldExploration.tsx ~16899–16950.
RECOMMENDED_ACTION: Wire enemyHazardCopy after WX is free. Pair with enemyTurnCopy when that helper is wired; do not restack iceHazardCopy.ts (#1178).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: enemyHazardCopy.test.ts; a named Wraith Bishop lava step does not log as bishop; ice still applies Frozen −2 MP.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-SUMMON-SPAWN-PIECETYPE
TITLE: Summon cast log names chess pieceType
CATEGORY: spell-state
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/summonSpawnCopy.ts; engine/spellEngine.ts applySummon (origin/main, untouched)
CURRENT_BEHAVIOUR: `${spell.name} summoned a ${def.pieceType}!` so Dire Wolf reads `Summon Dire Wolf summoned a wolf!`. Distinct from UX-SUMMON-KIT-CAST-PIECETYPE (kit press), UX-SUMMON-EXPIRED-PIECETYPE (fade), UX-SUMMON-NAME-PIECETYPE (control bar), and UX-SUMMON-AI-LOG-DUMP (AI tags).
DESIRED_BEHAVIOUR: summonSpawnLog — “Summon Dire Wolf summoned Dire Wolf!” Never a raw pieceType. Do not change spawn HP / lifespan.
EVIDENCE: spellEngine.ts ~599.
RECOMMENDED_ACTION: Wire summonSpawnCopy after spellEngine is free. Pass assigned name, not pieceType.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: summonSpawnCopy.test.ts; a Dire Wolf spawn does not log as wolf; lifespan unchanged.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-CRIT-FORMULA-LOG
TITLE: Enemy crit logs intern x2 equals damage formula
CATEGORY: enemy-information
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/critFormulaCopy.ts; WorldExploration.tsx enemy spell crit (origin/main, untouched)
CURRENT_BEHAVIOUR: `CRITICAL HIT! ${enemy.pieceType} casts ${spell}: ${rawDmg}x2=${dmgAC} dmg` so the log reads `CRITICAL HIT! bishop casts Strike: 6x2=12 dmg`. Distinct from UX-HIT-LOG-PIECETYPE (non-crit cast-on-you) and UX-DMG-BREAKDOWN-JARGON (SP / SR / RES pipeline).
DESIRED_BEHAVIOUR: critCastLog — “Critical hit! Wraith Bishop casts Strike for 24 damage.” Never print x2= or pieceType. Do not change crit math.
EVIDENCE: WorldExploration.tsx ~16559–16574.
RECOMMENDED_ACTION: Wire critFormulaCopy after WX is free.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: critFormulaCopy.test.ts; a named Bishop crit does not log as bishop or 6x2=12; double still applies.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-WINDSTORM-MISS-PIECETYPE
TITLE: Paper Windstorm enemy miss still names chess pieceType
CATEGORY: enemy-information
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/windstormMissCopy.ts; WorldExploration.tsx enemy ranged miss (origin/main, untouched)
CURRENT_BEHAVIOUR: `Paper Windstorm! ${enemy.pieceType}'s ${spell} missed!`. The player's own miss already says “Paper Windstorm blows your spell off course!”. Distinct from UX-HIT-LOG-PIECETYPE (hits) and UX-MIRROR-PIECETYPE (reflect).
DESIRED_BEHAVIOUR: windstormMissLog — “Paper Windstorm blows Wraith Bishop's Strike off course!” Never pieceType. Do not change the 50% miss roll.
EVIDENCE: WorldExploration.tsx ~16491–16495, ~16730–16732.
RECOMMENDED_ACTION: Wire windstormMissCopy after WX is free.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: windstormMissCopy.test.ts; a named Bishop miss does not log as bishop; 50% roll unchanged.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-TITAN-ROLL-XN
TITLE: Titan's Vigor logs intern rolls xN damage
CATEGORY: feedback
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/titanVigorCopy.ts; engine/mapModifiers.ts onDamageDealt (origin/main, untouched)
CURRENT_BEHAVIOUR: `Titan's Vigor rolls x${roll} damage.` so the log reads `Titan's Vigor rolls x3 damage.` Distinct from UX-NO-MODIFIER-LOG (empty maps) and UX-HAZARD-COUNT-DETECTED (tile kinds).
DESIRED_BEHAVIOUR: titanVigorLog — “Titan's Vigor triples the blow.” Never “rolls xN”. Do not change the 1–5 roll or +1000 HP bonus.
EVIDENCE: mapModifiers.ts ~311–314.
RECOMMENDED_ACTION: Wire titanVigorCopy after mapModifiers is free.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: titanVigorCopy.test.ts; a ×3 roll reads “triples”; damage still multiplies by 3.
STATUS: IMPLEMENTED_THIS_RUN
```

---

## New this run (not implemented)

```
ACTION_ID: UX-MIRROR-PIECETYPE
TITLE: Mirror reflect logs chess pieceType
CATEGORY: enemy-information
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx enemy spell reflect
CURRENT_BEHAVIOUR: `Mirror! ${enemy.pieceType}'s ${spell} was reflected back for ${mirrorDmg} dmg!` Distinct from UX-WINDSTORM-MISS-PIECETYPE (miss, helper locked this run) and UX-HIT-LOG-PIECETYPE (primary hit).
DESIRED_BEHAVIOUR: “Mirror! Wraith Bishop's Strike reflects back for 8 damage.” Never pieceType. Do not change consumePlayerMirror or reflect math.
EVIDENCE: WorldExploration.tsx ~16526–16528.
RECOMMENDED_ACTION: HUMAN copy when WX is free. Pair with windstormMissCopy.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: A named Bishop reflect does not log as bishop; last-enemy reflect still awards the fight.
STATUS: NEW
```

```
ACTION_ID: UX-WEEPING-PROMOTE-SHOUT
TITLE: Weeping Pawn phase 2 shouts ALL-CAPS PROMOTES
CATEGORY: enemy-information
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx Weeping Pawn phase transition
CURRENT_BEHAVIOUR: `👑 The Weeping Pawn PROMOTES to the Weeping Queen — FULL HP RESTORED!` Distinct from UX-PHASE2-STATS-X (generic ×N line, helper locked this run).
DESIRED_BEHAVIOUR: “The Weeping Pawn promotes to the Weeping Queen — HP restored.” Do not change the full-HP restore.
EVIDENCE: WorldExploration.tsx ~15790–15794.
RECOMMENDED_ACTION: HUMAN copy when WX is free.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: Weeping Pawn still restores full HP; log has no ALL-CAPS shout.
STATUS: NEW
```

```
ACTION_ID: UX-FAMILY-PROC-PIECETYPE
TITLE: Ember ignite and Tide slow logs still name chess pieceType
CATEGORY: enemy-information
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx ember_knight / tide_shade melee procs
CURRENT_BEHAVIOUR: `${enemy.pieceType ?? "Enemy"} ignites you!` and `${enemy.pieceType ?? "Enemy"} slows you!` Distinct from UX-ENEMY-HAZARD-PIECETYPE (tile landing, helper locked this run) and UX-HIT-LOG-PIECETYPE (strike damage).
DESIRED_BEHAVIOUR: Assigned name. “Ash Knight ignites you!” / “Tide Shade slows you!” Do not change the burn 3/3 or −1 MP / 2-turn procs.
EVIDENCE: WorldExploration.tsx ~16788–16820.
RECOMMENDED_ACTION: HUMAN — WX owned. Pair with enemyHazardCopy when that helper is wired.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: A named Ember Knight ignite does not log as knight; burn 3 dmg/turn still applies.
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
| UX-BOSS-DEFEATED-SHOUT | `UX-BOSS-BANNER-FLASH` (banner) + `UX-ENCOUNTER-NO-BANNER` (pack) |
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
| UX-SUMMON-FADE-EXPIRED | #1298 `UX-SUMMON-EXPIRED-PIECETYPE` |
| UX-ENEMY-HEAL-SKIP | #1298 `UX-ENEMY-TURN-PIECETYPE` |
| UX-HAZARD-DETECTED | #1298 `UX-HAZARD-COUNT-DETECTED` |
| UX-SPELLBAR-TWO-TOASTS | #1298 `UX-SPELLBAR-DEFER-TOAST` |
| UX-CHAIN-E-3 | #1298 `UX-CHAIN-BOUNCE-ID` |
| UX-DOUBLE-BETRAYAL-SHOUT | #1298 `UX-BETRAYAL-PIECETYPE` |
| UX-KIT-PAWN-CASTS | #1298 `UX-SUMMON-KIT-CAST-PIECETYPE` |
| UX-ABORT-ABORTED | #1298 `UX-CAST-ABORT-COPY` |
| UX-NULL-FIELD-VERB | leave for a later run; Titan roll is the modifier intern this run locked |
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

### #1298
- `UX-SUMMON-EXPIRED-PIECETYPE`
- `UX-ENEMY-TURN-PIECETYPE`
- `UX-HAZARD-COUNT-DETECTED`
- `UX-SPELLBAR-DEFER-TOAST`
- `UX-CHAIN-BOUNCE-ID`
- `UX-BETRAYAL-PIECETYPE`
- `UX-SUMMON-KIT-CAST-PIECETYPE`
- `UX-CAST-ABORT-COPY` (wired on that PR; still `Aborted` on main — do not restack)
- The three IDs this run locked (`UX-NO-MODIFIER-LOG`, `UX-PHASE2-STATS-X`, `UX-ENEMY-HAZARD-PIECETYPE`) were NEW on #1298 — do not restack those hunks; this PR adds the helpers only.

### #1267 / #1274
- Champion-bar select skip / kit Escape cancel. Do not restack `summonControlCast.ts`, BattleUIPanel, WorldExploration, or SummonControlPanel.

---

## Open (human / blocked by older PRs)

Do not edit `WorldExploration.tsx`, `GameFlow.tsx`, `BattleUIPanel.tsx`, `AchievementsPanel.tsx`, `PostBattleRecap.tsx`, `SpellbookModal.tsx`, `App.tsx`, `CharacterSelection.tsx`, `ProfileSetup.tsx`, `CharacterCreation.tsx`, `ChatPanel.tsx`, `BuffShop.tsx`, `StatPopup.tsx`, `BossGuideModal.tsx`, `SummonControlPanel.tsx`, `InitiativeStrip.tsx`, `ChallengePanel.tsx`, `StatusEffectBadge.tsx`, `LandingPage.tsx`, `MapModifiersPanel.tsx`, `EnemyRegister.tsx`, `DokaGameKeyShop.tsx`, `castHelpers.ts`, `spellEngine.ts`, `summonExecutor.ts`, `summonControlCast.ts`, `mapModifiers.ts`, `rejectCopy.ts`, or `DESIGN.md` in this auditor PR.

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

Also still OPEN (full blocks in #776 / #830 / #873 / #943 / #1018 / #1060 / #1137 / #1178 / #1242 / #1298 catalogs; do not mint twins): `UX-NO-LEAVE-REALM`, `UX-BOOST-UNMOUNTED`, `UX-HAZARD-TILE-LEGEND`, `UX-FEAT-TOAST-PRECREDIT`, `UX-LEVEL-UP-CHROME`, `UX-HUD-TOOL-CLUSTER`, `UX-SMALL-SCREEN-HARD-BLOCK`, `UX-LAUNCH-TAB-TITLE`, `UX-IDENTITY-FONT-DRIFT`, `UX-PORTAL-XP-PENDING`, `UX-CHAT-PROFILE-NAME`, `UX-SUMMON-LIFESPAN-WORDS`, `UX-SUMMON-SAAS-ORBS`, `UX-TURN-TIMER-WHY`, `UX-BOARD-LABEL`, `UX-AP-MP-CURRENT-MAX`, `UX-LOGIN-SILENT-BACKEND`, `UX-CHALLENGE-ZINDEX`, `UX-BOSS-RUSH-PINK`, `UX-VERSION-FORCE-RELOGIN`, `UX-FEATS-VS-ACHIEVEMENTS`, `UX-LANDING-VERSION`, `UX-SUMMON-BAR-OVERLAP`, `UX-SPELLBOOK-CANCEL-KEEPS-UPGRADES`, `UX-SUMMON-UPGRADE-COST-GATE`, `UX-SIDE-PANEL-XP-REDUNDANT`, `UX-HUD-DEAD-ATK-EVA`, `UX-RECAP-CONTINUE-VOID`, `UX-REST-AREA-NO-HEAL`, `UX-BOSS-BANNER-FLASH`, `UX-LANDING-ADS-UNLABELED`, `UX-SPELL-PHY-LABEL`, `UX-MAP-EFFECTS-DUAL-LABEL`, `UX-INSPECT-EFFECTS-EMPTY`, `UX-PLAYER-DMG-DOUBLE-LOG`, `UX-GAMEKEY-ADMIN-HINT`, `UX-ENEMY-REGISTER-GEAR`, `UX-SUMMON-SCALE-TOOLTIP`, `UX-BATTLE-START-SEPARATED`, `UX-SMALL-SCREEN-PX`, `UX-BOSS-GUIDE-DELTA`, `UX-ZONE-UNKNOWN-LABEL`.

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
- `UX-CAST-ABORT-COPY` — wired on #1298; still `Aborted` on main. Do not restack rejectCopy.ts.
- `UX-NO-MODIFIER-LOG` / `UX-PHASE2-STATS-X` / `UX-ENEMY-HAZARD-PIECETYPE` / `UX-SUMMON-SPAWN-PIECETYPE` / `UX-CRIT-FORMULA-LOG` / `UX-WINDSTORM-MISS-PIECETYPE` / `UX-TITAN-ROLL-XN` — helpers locked this run; do not mint twins.

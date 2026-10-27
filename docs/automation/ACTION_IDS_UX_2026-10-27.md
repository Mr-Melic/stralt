# ACTION_ID catalog — 2026-10-27 UX audit

Stable IDs for the daily player-journey auditor. STATUS values: NEW | OPEN | IMPLEMENTED_THIS_RUN | IMPLEMENTED | SUPERSEDED.

Reuse IDs from [`ACTION_IDS_UX_2026-10-26.md`](./ACTION_IDS_UX_2026-10-26.md) (open PR #1137) and older UX PRs when the finding is the same. Do not mint twins.

HEAD: `0f5363f` (unchanged since 2026-09-21). DESIGN.md preserved.

---

## Copy locked this run (not wired — older PRs own the hosts)

```
ACTION_ID: UX-DOT-LOG-ENGINEER
TITLE: DoT ticks dump engineer key=value into the battle log
CATEGORY: invalid-action-explanation
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/dotTickCopy.ts; WorldExploration.tsx processActiveEffects (origin/main, untouched)
CURRENT_BEHAVIOUR: Each DoT tick logs `[DOT] target=${id} type=… tick=… stacks=[…] resReduc=…`. Player ticks also already log `Player took N damage from {type} DoT`.
DESIRED_BEHAVIOUR: dotTickLog — “You take 4 from Poison (2 stacks left).” Drop the dump; do not double with playerTakesDamage.
EVIDENCE: WorldExploration.tsx ~1991; playerTakesDamage ~3452.
RECOMMENDED_ACTION: Wire dotTickCopy after WorldExploration is free. Do not change DoT math or RES-only mitigation.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: dotTickCopy.test.ts; log has no [DOT] or resReduc=; tick damage unchanged.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-EFFECT-EXPIRED-FALSE
TITLE: Status tick logs expired while the effect still has turns
CATEGORY: feedback
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/statusTickCopy.ts; WorldExploration.tsx processActiveEffects; engine/statusEffects.ts tickNonDotEffects
CURRENT_BEHAVIOUR: Every decremented non-DoT logs `{name} expired (… ended)`, including rows still in remaining at duration-1. statusEffects.ts already characterizes this as a wording lie.
DESIRED_BEHAVIOUR: statusDurationLog(name, duration-1, mag, stat) — “Fury: 2 turns left (+2 AP).” / “Fury ended (+2 AP).”
EVIDENCE: WorldExploration.tsx ~2004–2012; statusEffects.ts ~125–133 and ~166.
RECOMMENDED_ACTION: Wire statusTickCopy after WX is free. Do not change tickNonDotEffects math.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: statusTickCopy.test.ts; a 3-turn buff does not say expired on turn 1.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-HIT-LOG-PIECETYPE
TITLE: Damage and enemy-cast lines name chess pieceType
CATEGORY: enemy-information
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/hitLogCopy.ts; engine/castHelpers.ts; WorldExploration.tsx enemy AI cast log
CURRENT_BEHAVIOUR: `${hitTarget.pieceType} takes N damage` and `${enemy.pieceType} casts Strike on you`. Distinct from UX-SUMMON-NAME-PIECETYPE (control bar).
DESIRED_BEHAVIOUR: combatantLogName prefers name / assignedName; takesDamageLog / enemyCastsOnYouLog use that.
EVIDENCE: castHelpers.ts ~410–412; WorldExploration.tsx ~16559–16573.
RECOMMENDED_ACTION: Wire hitLogCopy after those hosts are free. Do not change damage math.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: hitLogCopy.test.ts; a named Wraith Bishop does not log as bishop.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-ICE-SLOW-MISLABEL
TITLE: Ice step says Slowed with a reject glyph, then applies Frozen −2 MP
CATEGORY: invalid-action-explanation
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/iceHazardCopy.ts; WorldExploration.tsx hazard step
CURRENT_BEHAVIOUR: Log is `❌❄️ You stepped on ice! Slowed!` then Frozen duration 2, modifier -2 MP. Distinct from UX-HAZARD-TILE-LEGEND (unnamed before the step).
DESIRED_BEHAVIOUR: ICE_STEP_LOG — “You stepped on ice — Frozen: -2 MP for 2 turns.”
EVIDENCE: WorldExploration.tsx ~11454–11466.
RECOMMENDED_ACTION: Wire iceHazardCopy after WX is free. Do not change Frozen math.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: iceHazardCopy.test.ts; ice log has Frozen and -2 MP; no ❌.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-BARRIER-COORD-LOG
TITLE: Barrier fade prints the x,y map key
CATEGORY: feedback
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/barrierFadeCopy.ts; WorldExploration.tsx barrier tick
CURRENT_BEHAVIOUR: `Barrier at ${bKey} has faded.` bKey is `"x,y"`. Distinct from UX-TILE-COORD-HUD (side-panel pin).
DESIRED_BEHAVIOUR: BARRIER_FADED_LOG — “A barrier faded from the field.”
EVIDENCE: WorldExploration.tsx ~14300–14304; set path uses `${cell.x},${cell.y}` ~9212.
RECOMMENDED_ACTION: Wire barrierFadeCopy after WX is free. Do not change barrier duration.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: barrierFadeCopy.test.ts; fade line has no comma-pair key.
STATUS: IMPLEMENTED_THIS_RUN
```

```
ACTION_ID: UX-DMG-BREAKDOWN-JARGON
TITLE: Spell hits append an SP/SR/RES pipeline in the battle log
CATEGORY: spell-state
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/dmgBreakdownCopy.ts; engine/spellEngine.ts computeSpellDamageBreakdown
CURRENT_BEHAVIOUR: `Strike dealt 11 damage. base 12 → scaled 14 → sp +8% → sr 10% × res 20% → final 11`. Chat can highlight `|[...]|` tokens; this path is a raw pipeline. Distinct from UX-INSPECT-STAT-WORDS.
DESIRED_BEHAVIOUR: spellDealtDamageLog — “Strike dealt 11 damage.” Optional resistanceAbsorbedNote when something was actually eaten.
EVIDENCE: spellEngine.ts ~368–410, ~500–502.
RECOMMENDED_ACTION: Wire dmgBreakdownCopy after spellEngine is free. Do not change mitigation math.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: dmgBreakdownCopy.test.ts; log has no `sp +` / `base `.
STATUS: IMPLEMENTED_THIS_RUN
```

---

## New this run (not implemented)

```
ACTION_ID: UX-INSPECT-EFFECTS-EMPTY
TITLE: Inspect ACTIVE EFFECTS is empty while HUD pills are live
CATEGORY: enemy-information
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: StatPopup.tsx; BattleUIPanel.tsx unitEffects; WorldExploration activeEffects state
CURRENT_BEHAVIOUR: Status pills read GameFlow/WX `activeEffects` (`duration`). Inspect reads `turnOrder[].activeEffects`, which CombatantEntry does not populate, then renders `effect.stat` + raw `modifier` and `effect.turnsRemaining`T (ActiveEffect has `duration`, so that field is undefined). Distinct from UX-INSPECT-STAT-WORDS and UX-STATUS-TURNS-SUFFIX.
DESIRED_BEHAVIOUR: Inspect the same ActiveEffect list the HUD uses; format with formatBattleEffectMagnitude / statusTurnsLabel; never print undefinedT.
EVIDENCE: BattleUIPanel.tsx ~146–148; StatPopup.tsx ~213–235; gameTypes.ts ActiveEffect.duration ~252; CombatantEntry has no activeEffects field.
RECOMMENDED_ACTION: HUMAN — StatPopup / BattleUIPanel owned. Pass live activeEffects keyed by targetId. Do not invent a second effect store.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Apply Frozen; HUD pill shows it; inspect the player chip shows Frozen with turns left.
STATUS: NEW
```

```
ACTION_ID: UX-PLAYER-DMG-DOUBLE-LOG
TITLE: playerTakesDamage always logs, then the caller logs the same hit
CATEGORY: feedback
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx playerTakesDamage; enemy AI / boss spell callers
CURRENT_BEHAVIOUR: playerTakesDamage writes `Player took N damage from {source}` for every debit. Enemy/boss casts then write a second line (`pawn casts Strike on you for N dmg`). Player DoT ticks can triple with the [DOT] dump. Distinct from UX-DOT-LOG-ENGINEER.
DESIRED_BEHAVIOUR: One carved line per hit. Either silence playerTakesDamage when the caller logs, or drop the caller line.
EVIDENCE: WorldExploration.tsx ~3452; ~16566–16573; ~15864–15870; DoT path ~1957–1991.
RECOMMENDED_ACTION: HUMAN — WX owned. Pair with UX-HIT-LOG-PIECETYPE so the surviving line uses the unit name.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: One enemy Strike on the player produces one log line; shield absorb still visible.
STATUS: NEW
```

```
ACTION_ID: UX-CREATE-SAVE-RAW-ERR
TITLE: Forge save toast dumps raw Error.message
CATEGORY: character-creation
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: CharacterCreation.tsx save catch
CURRENT_BEHAVIOUR: After retries, toast is `Failed to save character: ${errMsg}` from Error.message (Candid / agent / network). Distinct from UX-PROFILE-ERROR-ALERT / UX-SELECTION-ERROR-ALERT.
DESIRED_BEHAVIOUR: Map known canister errors; otherwise “Could not save this champion. Try again.” Never surface agent/Candid text.
EVIDENCE: CharacterCreation.tsx ~334–337.
RECOMMENDED_ACTION: HUMAN — CharacterCreation owned by older UX PRs. Copy helper only if a later run can add a file without touching the host.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: Offline save shows the generic line; successful forge still toasts the carved success.
STATUS: NEW
```

```
ACTION_ID: UX-GAMEKEY-ADMIN-HINT
TITLE: Buy Doka status says hinted and Admin credits
CATEGORY: shop
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: DokaGameKeyShop.tsx status + euro hint helper
CURRENT_BEHAVIOUR: Status line includes `· hinted €X ≈ N Doka`. Helper says “Admin credits the amount actually received.” / “Admin still enters Doka…”. Distinct from UX-GAMEKEY-STEP-ORDER / UX-IAP-KYC-SURPRISE / UX-GAMEKEY-PAY-AFTER-SUBMIT.
DESIRED_BEHAVIOUR: “You marked €X” / “We credit what was paid.” No staff-role word on a player panel.
EVIDENCE: DokaGameKeyShop.tsx ~342, ~407–410.
RECOMMENDED_ACTION: HUMAN — DokaGameKeyShop owned by #588 / older IAP PRs. Do not change Mollie / redeem.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: Status chip still shows email and Doka on the key; no “Admin”.
STATUS: NEW
```

```
ACTION_ID: UX-ENEMY-REGISTER-GEAR
TITLE: Fetid Rook lore recommends RES gear that does not exist
CATEGORY: enemy-information
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: EnemyRegister.tsx BOSSES tip
CURRENT_BEHAVIOUR: “Keep maximum distance. High RES gear strongly recommended.” There is no gear/equipment. Distinct from UX-ENEMY-REGISTER-LORE (flavor vs live roster honesty chrome — already on main).
DESIRED_BEHAVIOUR: “Keep maximum distance. High Resistance helps.” Or drop the gear claim. Do not invent an item shop gear track.
EVIDENCE: EnemyRegister.tsx ~128–132.
RECOMMENDED_ACTION: HUMAN copy on the Fetid Rook tip. Do not rewrite the register as a live bestiary.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Tip has no “gear”; honesty banner still says flavor only.
STATUS: NEW
```

```
ACTION_ID: UX-SUMMON-SCALE-TOOLTIP
TITLE: Spellbook summon chips title the hpScale formula
CATEGORY: spell-state
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: SpellbookModal.tsx summon stat chips
CURRENT_BEHAVIOUR: HP title is `Base N × hpScale M × (1 + level×10%)`. AP/MP/lifespan titles name intern constants. Visible chips already show the computed HP/AP/MP/turns. Distinct from UX-SUMMON-LIFESPAN-WORDS / UX-SUMMON-UPGRADE-COST-COPY.
DESIRED_BEHAVIOUR: “Grows with spell rank” / “+1 AP every 4 ranks”. Never hpScale.
EVIDENCE: SpellbookModal.tsx ~317, ~331, ~345, ~359.
RECOMMENDED_ACTION: HUMAN — SpellbookModal owned. Do not change getSummonBaseStats math.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Hover has no hpScale; displayed HP still matches the formula.
STATUS: NEW
```

```
ACTION_ID: UX-BATTLE-START-SEPARATED
TITLE: Opening log says Enemies separated with no destack explanation
CATEGORY: encounter
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx battle start
CURRENT_BEHAVIOUR: `Battle started! Enemies separated. N enemies on the field.` Destack is occupancy, not a player verb. Distinct from UX-ENCOUNTER-NO-BANNER (missing pack banner).
DESIRED_BEHAVIOUR: “Battle started — N enemies on the field.”
EVIDENCE: WorldExploration.tsx ~12231–12233.
RECOMMENDED_ACTION: HUMAN copy when WX is free. Do not skip destack.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: Stacked hosts still destack; log has no “separated”.
STATUS: NEW
```

```
ACTION_ID: UX-SMALL-SCREEN-PX
TITLE: Small-screen warning cites a raw 768px breakpoint
CATEGORY: responsive-behaviour
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: App.tsx SmallScreenGuard
CURRENT_BEHAVIOUR: Body is “larger screen (768px or wider).” Footer “Tablets (768px+)…”. Distinct from UX-SMALL-SCREEN-SAAS-CHROME (generic card) and UX-SMALL-SCREEN-HARD-BLOCK (Continue anyway).
DESIRED_BEHAVIOUR: “tablet or desktop”. Keep Continue. Do not restyle into SaaS.
EVIDENCE: App.tsx ~109–110, ~135.
RECOMMENDED_ACTION: HUMAN — App.tsx owned. Copy only.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Warning has no 768px; Continue still writes sessionStorage.
STATUS: NEW
```

```
ACTION_ID: UX-BOSS-GUIDE-DELTA
TITLE: Boss Guide scaling table header is ΔLvl
CATEGORY: boss-progression
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BossGuideModal.tsx scaling table
CURRENT_BEHAVIOUR: Column header `ΔLvl`. Subtitle already says “Effective stats vs. player level {playerLevel}” but default playerLevel is 10. Distinct from UX-BOSS-GUIDE-ASSUMED-LEVEL / UX-BOSS-GUIDE-NEXT.
DESIRED_BEHAVIOUR: “Level gap” or “vs you”.
EVIDENCE: BossGuideModal.tsx ~228, ~684, ~706.
RECOMMENDED_ACTION: HUMAN — BossGuideModal owned. Do not change getBossScalingRows.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Header has no Δ; numbers unchanged.
STATUS: NEW
```

```
ACTION_ID: UX-ZONE-UNKNOWN-LABEL
TITLE: Region chip falls back to literal Unknown
CATEGORY: hud-crowding
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx HUD region + side panel
CURRENT_BEHAVIOUR: `{currentMap.levelZone?.name ?? "Unknown"}` on the top strip and the side panel. Distinct from UX-MAP-NUMBER-WHY / UX-ZONE-TIER-LOCK.
DESIRED_BEHAVIOUR: “Wilds” or “Uncharted”. Never the engineer sentinel Unknown.
EVIDENCE: WorldExploration.tsx ~17827, ~18231.
RECOMMENDED_ACTION: HUMAN copy when WX is free.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: A map without levelZone.name does not print Unknown.
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
| UX-INSPECT-T-SUFFIX | #1137 `UX-STATUS-TURNS-SUFFIX` (inspect T is bundled into UX-INSPECT-EFFECTS-EMPTY) |

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

---

## Open (human / blocked by older PRs)

Do not edit `WorldExploration.tsx`, `GameFlow.tsx`, `BattleUIPanel.tsx`, `AchievementsPanel.tsx`, `PostBattleRecap.tsx`, `SpellbookModal.tsx`, `App.tsx`, `CharacterSelection.tsx`, `ProfileSetup.tsx`, `CharacterCreation.tsx`, `ChatPanel.tsx`, `BuffShop.tsx`, `StatPopup.tsx`, `BossGuideModal.tsx`, `SummonControlPanel.tsx`, `InitiativeStrip.tsx`, `ChallengePanel.tsx`, `StatusEffectBadge.tsx`, `LandingPage.tsx`, `MapModifiersPanel.tsx`, `EnemyRegister.tsx`, `DokaGameKeyShop.tsx`, `castHelpers.ts`, `spellEngine.ts`, or `DESIGN.md` in this auditor PR.

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

Also still OPEN (full blocks in #776 / #830 / #873 / #943 / #1018 / #1060 / #1137 catalogs; do not mint twins): `UX-NO-LEAVE-REALM`, `UX-BOOST-UNMOUNTED`, `UX-HAZARD-TILE-LEGEND`, `UX-FEAT-TOAST-PRECREDIT`, `UX-LEVEL-UP-CHROME`, `UX-HUD-TOOL-CLUSTER`, `UX-SMALL-SCREEN-HARD-BLOCK`, `UX-LAUNCH-TAB-TITLE`, `UX-IDENTITY-FONT-DRIFT`, `UX-PORTAL-XP-PENDING`, `UX-CHAT-PROFILE-NAME`, `UX-SUMMON-LIFESPAN-WORDS`, `UX-SUMMON-SAAS-ORBS`, `UX-TURN-TIMER-WHY`, `UX-BOARD-LABEL`, `UX-AP-MP-CURRENT-MAX`, `UX-LOGIN-SILENT-BACKEND`, `UX-CHALLENGE-ZINDEX`, `UX-BOSS-RUSH-PINK`, `UX-VERSION-FORCE-RELOGIN`, `UX-FEATS-VS-ACHIEVEMENTS`, `UX-LANDING-VERSION`, `UX-SUMMON-BAR-OVERLAP`, `UX-SPELLBOOK-CANCEL-KEEPS-UPGRADES`, `UX-SUMMON-UPGRADE-COST-GATE`, `UX-SIDE-PANEL-XP-REDUNDANT`, `UX-HUD-DEAD-ATK-EVA`, `UX-RECAP-CONTINUE-VOID`, `UX-REST-AREA-NO-HEAL`, `UX-BOSS-BANNER-FLASH`, `UX-LANDING-ADS-UNLABELED`, `UX-SPELL-PHY-LABEL`, `UX-MAP-EFFECTS-DUAL-LABEL`.

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

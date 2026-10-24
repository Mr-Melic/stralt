# ACTION_ID catalog — 2026-10-24 UX audit (launch → encounter)

Player-journey auditor. DESIGN.md = carved-stone / dark slate / crimson-gold.
HEAD inspected: `0f5363f` (#332). Do **not** re-report known IDs listed in the prompt.
Do **not** edit forbidden host files; copy modules below are **not wired**.

## Confirmed still present (do not re-mint)

| ID | Evidence on HEAD |
| :--- | :--- |
| UX-LAUNCH-TAB-TITLE | `src/frontend/index.html` 6–9; GameFlow wordmark 438 |
| UX-PROFILE-REALM-CTA | `ProfileSetup.tsx` 332 `♔ Enter the Realm` |
| UX-FORGE-PIECE-COSMETIC | Forge piece picker never says look-only |
| UX-AUTH-LOADING-VOID | `App.tsx` 485 `Loading...` |
| UX-CHAT-DEFAULT-OPEN | `ChatPanel.tsx` `defaultFolded={false}` |
| UX-MAP-NUMBER-WHY | `WorldExploration.tsx` 17559 `Map #{mapCount}` |
| UX-SMALL-SCREEN-SAAS-CHROME | `App.tsx` SmallScreenGuard Continue |
| UX-ZONE-TIER-LOCK / UX-ZONE-LOCK-SAAS-CHROME | WX 17600–17716 |
| UX-ITEMS-INNER-SHOP-TAB | BuffShop inner tab |
| UX-BUY-DOKA-ICON-ONLY | WX 17786–17813 cart icon-only (do not mint) |
| UX-SEALED-PORTAL-LOG-ONLY | sealed portal log-only path |
| UX-CANVAS-ERROR-DUMP | canvas error monospace dump |

## New findings

```
ACTION_ID: UX-SELECT-SLOT-LITERAL-ESCAPE
TITLE: Slot header and loading show raw \u escapes
CATEGORY: character-selection
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterSelection.tsx:486,889; src/frontend/src/utils/selectionSlotCopy.ts
CURRENT_BEHAVIOUR: JSX text nodes keep source escapes, so the card title renders as the characters "\u2694 Slot N" and loading as "Loading character slots\u2026".
DESIRED_BEHAVIOUR: Real ⚔ / … glyphs via JS strings or unicode characters.
EVIDENCE: CharacterSelection.tsx 486 `\u2694 Slot {slotNumber}` and 889 `Loading character slots\u2026` are JSXText, not `"\u…"` string literals (piece icons at 613–618 correctly use JS strings).
RECOMMENDED_ACTION: Wire selectionSlotCopy SLOT_HEADER / LOADING_SLOTS (HUMAN — CharacterSelection.tsx forbidden this run). Module named to avoid colliding with open PR #421's characterSelectionCopy.test.ts.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (copy module + tests landed; not wired)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Slot cards show ⚔ Slot 1; loading shows ellipsis.
STATUS: NEW
```

```
ACTION_ID: UX-PROFILE-BOARD-NAME-MISLEAD
TITLE: Profile claims account name is shown on the Board
CATEGORY: profile
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: ProfileSetup.tsx:251–252; main.mo getLeaderboard ~3402; ChatPanel playerName; src/frontend/src/utils/profileNameCopy.ts
CURRENT_BEHAVIOUR: Helper: "This is your account name, shown on the board." Leaderboard `playerName` is the highest-level *champion* `c.name`. Chat uses `userProfile.name`.
DESIRED_BEHAVIOUR: Account name = chat / lobby welcome; champion name = Board + realm HUD.
EVIDENCE: ProfileSetup 251–252 vs main.mo 3400–3421 `bestName := c.name`; GameFlow 273 passes profile name into ChatPanel.
RECOMMENDED_ACTION: Wire profileNameCopy PROFILE_NAME_HINT (HUMAN — ProfileSetup forbidden).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (copy module + tests landed; not wired)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Hint no longer says account name is on the Board.
STATUS: NEW
```

```
ACTION_ID: UX-ACCOUNT-VS-CHAMPION-NAME
TITLE: Journey never maps account name vs champion name
CATEGORY: onboarding
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: ProfileSetup.tsx; CharacterCreation.tsx:710–718; src/frontend/src/utils/profileNameCopy.ts
CURRENT_BEHAVIOUR: Profile asks "Your Name"; forge asks "Champion Name" with no sentence tying each to chat vs HUD/Board.
DESIRED_BEHAVIOUR: One line on each screen stating where that name appears.
EVIDENCE: ProfileSetup 207 "Your Name"; CharacterCreation 710 `◆ Champion Name`; no cross-reference.
RECOMMENDED_ACTION: Wire PROFILE_NAME_HINT + CHAMPION_NAME_HINT (HUMAN).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (copy module; not wired)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: New player can answer "which name is on the Board?"
STATUS: NEW
```

```
ACTION_ID: UX-CHANGELOG-PLAY-PREMATURE
TITLE: What's New dismiss says "let me play" before forge
CATEGORY: launch
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: App.tsx:275; ChangelogPopup; src/frontend/src/utils/changelogDismissCopy.ts
CURRENT_BEHAVIOUR: CTA "Got it — let me play!" while changelog can stack over ProfileSetup / selection (auth + pbv_show_changelog).
DESIRED_BEHAVIOUR: "Got it — continue" (or stage-aware copy). Does not promise the realm yet.
EVIDENCE: App.tsx 275; showChangelog gated only on isAuthenticated (322–329), independent of profileResolved.
RECOMMENDED_ACTION: Wire CHANGELOG_DISMISS_LABEL (HUMAN — App.tsx forbidden).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (copy module; not wired)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Dismiss does not say "play".
STATUS: NEW
```

```
ACTION_ID: UX-SELECT-PAPER-BABY-HEADLINE
TITLE: Selection headline still says Paper Baby Vampire
CATEGORY: character-selection
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: CharacterSelection.tsx:945; LandingPage ÆSTRALTØ; src/frontend/src/utils/selectionSlotCopy.ts
CURRENT_BEHAVIOUR: "Choose your Paper Baby Vampire!" after landing branded ÆSTRALTØ. Distinct from tab-title ID (index.html / GameFlow wordmark). Open PR #421 also wires "Choose your champion" into CharacterSelection — same desired copy; this module locks it without touching the forbidden host.
DESIRED_BEHAVIOUR: "Choose your champion" (or ÆSTRALTØ-aligned headline).
EVIDENCE: CharacterSelection.tsx 945; LandingPage title canvas "ÆSTRALTØ".
RECOMMENDED_ACTION: Wire SELECTION_HEADLINE after #421, or subsume if #421 already landed the string (HUMAN).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (copy module; not wired)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Headline has no "Paper Baby Vampire".
STATUS: NEW
```

```
ACTION_ID: UX-HEAL-RATIO-CRYPTIC
TITLE: Overworld heal button ends with opaque (1:3)
CATEGORY: feedback
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx:18504–18506; src/frontend/src/utils/overworldVitalsCopy.ts
CURRENT_BEHAVIOUR: `♥ Heal N HP → C Doka (1:3)` — unclear which side is HP vs Doka. Engine is 3 HP per 1 Doka.
DESIRED_BEHAVIOUR: Explicit "3 HP per 1 Doka".
EVIDENCE: WX 18383–18506 `Math.floor(liveDoka * 3)` / `Math.ceil(healHp / 3)` vs label `(1:3)`.
RECOMMENDED_ACTION: Wire HEAL_WITH_DOKA_LABEL (HUMAN — WX forbidden).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (copy module; not wired)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Button text names HP-per-Doka.
STATUS: NEW
```

```
ACTION_ID: UX-OVERWORLD-AP-MP-IDLE
TITLE: Overworld AP/MP orbs look spendable while exploring
CATEGORY: ap-mp-clarity
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: WorldExploration.tsx:18254–18276; src/frontend/src/utils/overworldVitalsCopy.ts
CURRENT_BEHAVIOUR: Side-panel AP/MP show full max outside battle with title `AP v / max` only. Walking does not spend them; fights do.
DESIRED_BEHAVIOUR: Out-of-battle orb title notes "battle budget (not spent while exploring)".
EVIDENCE: WX 18264–18270 `inBattle ? currentBattleAp : characterStats.ap`; title at 18276.
RECOMMENDED_ACTION: Wire OVERWORLD_ORB_TITLE when !inBattle (HUMAN).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (copy module; not wired)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Hover AP/MP out of battle mentions battle budget.
STATUS: NEW
```

```
ACTION_ID: UX-ENCOUNTER-NO-BANNER
TITLE: Normal encounters have no on-canvas "what just happened"
CATEGORY: encounter-start
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx:11808–12238, 18013–18042; src/frontend/src/utils/encounterStartCopy.ts
CURRENT_BEHAVIOUR: Tile-overlap starts combat. Bosses get a purple banner; pack fights only log "Battle started!…" into the battle log under Chat.
DESIRED_BEHAVIOUR: Short encounter banner (and/or first-map hint: walk onto a foe).
EVIDENCE: Boss banner 6497 / 18014; pack path logBattleEntry 12231–12237 only; shouldTriggerOverworldEncounter 11813.
RECOMMENDED_ACTION: Wire ENCOUNTER_BANNER on battle start (HUMAN — WX forbidden). Related to but narrower than UX-ONBOARD-FIRST-MAP.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (copy module; not wired)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Pack fight shows a brief banner.
STATUS: NEW
```

```
ACTION_ID: UX-PORTAL-TRANSITION-OPAQUE
TITLE: Portal chip says only "Portal..."
CATEGORY: portal-clarity
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: WorldExploration.tsx:17718–17727; src/frontend/src/utils/portalTransitionCopy.ts
CURRENT_BEHAVIOUR: During transitionInProgress, HUD chip is `Portal...` with no destination.
DESIRED_BEHAVIOUR: `Crossing portal…` or `Crossing to {zone}…`.
EVIDENCE: WX 17718–17727.
RECOMMENDED_ACTION: Wire portalTransitionCopy (HUMAN). Distinct from UX-PORTAL-LEGEND (nearby labels).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (copy module; not wired)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Chip wording during fade.
STATUS: NEW
```

```
ACTION_ID: UX-MAP-EFFECTS-EMPTY-OPEN
TITLE: Map Effects panel opens empty on first map
CATEGORY: hud-crowding
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: MapModifiersPanel.tsx:48,104–113; WorldExploration.tsx:17874
CURRENT_BEHAVIOUR: `defaultFolded={false}` always mounts; empty state "No active modifiers" occupies the right edge with Stats + Chat already open.
DESIRED_BEHAVIOUR: Fold by default when zero active modifiers, or hide until a modifier arms.
EVIDENCE: MapModifiersPanel 48 `defaultFolded={false}`; empty copy 104–113.
RECOMMENDED_ACTION: HUMAN — fold-when-empty or mount only when activeModifiers.length > 0. Not a copy-only fix.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM (layout persistence)
VALIDATION_REQUIRED: First map without modifiers stays clear on the right.
STATUS: NEW
```

## Auto-landed this run (display-only, unwired)

| Module | IDs |
| :--- | :--- |
| `src/frontend/src/utils/selectionSlotCopy.ts` | UX-SELECT-SLOT-LITERAL-ESCAPE, UX-SELECT-PAPER-BABY-HEADLINE |
| `src/frontend/src/utils/profileNameCopy.ts` | UX-PROFILE-BOARD-NAME-MISLEAD, UX-ACCOUNT-VS-CHAMPION-NAME |
| `src/frontend/src/utils/changelogDismissCopy.ts` | UX-CHANGELOG-PLAY-PREMATURE |
| `src/frontend/src/utils/overworldVitalsCopy.ts` | UX-HEAL-RATIO-CRYPTIC, UX-OVERWORLD-AP-MP-IDLE |
| `src/frontend/src/utils/encounterStartCopy.ts` | UX-ENCOUNTER-NO-BANNER |
| `src/frontend/src/utils/portalTransitionCopy.ts` | UX-PORTAL-TRANSITION-OPAQUE |

Do not bump `APP_VERSION` from this copy pass. Do not wire into forbidden hosts while older open PRs own them.

---

## Combat → rewards / death / boss pass (same day, second auditor)

Focus: BattleUIPanel, SummonControlPanel, spells, PostBattleRecap, death, shops, upgrades, Boss Rush / dungeon portals.
Do **not** re-report known list from the Game UX prompt (summon bar overlap, spellbook empty/cancel, boss guide level, potion battle-only, dual death modal, Death Realm wait, FAIL=0, potion vs HUD heal, covenant, recap feat precredit, level-up chrome, flee double confirm, Items inner Shop, zone tier lock).

### Implemented this pass (display-only)

```
ACTION_ID: UX-SUMMON-NAME-PIECETYPE
TITLE: Summon control bar shows title-cased piece name
CATEGORY: combat
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/summonDisplayName.ts (NEW, unwired); SummonControlPanel.tsx (stack-locked — older a11y PRs)
CURRENT_BEHAVIOUR: WorldExploration passes summon.pieceType raw ("knight"); panel prints lowercase.
DESIRED_BEHAVIOUR: Panel displays "Knight" via formatSummonDisplayName(summonName || summonPieceType).
EVIDENCE: WorldExploration.tsx ~18964; SummonControlPanel name span.
RECOMMENDED_ACTION: Wire summonDisplayName into SummonControlPanel when free (reverted this pass for stack-compat).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (unwired util + tests)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: summonDisplayName.test.ts
STATUS: IMPLEMENTED_THIS_RUN (module only — not wired)
```

```
ACTION_ID: UX-DEATH-XP-LEFTOVER-COPY
TITLE: Death / flee XP penalty says leftover, not lifetime
CATEGORY: death
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/deathPenaltyCopy.ts (NEW, unwired); BattleUIPanel.tsx ~519–523; GameOverModal.tsx ~67; PostBattleRecap.tsx ~259
CURRENT_BEHAVIOUR: Flee title/confirm and Game Over say "20% XP"; App tip correctly says leftover.
DESIRED_BEHAVIOUR: All death surfaces say 20% leftover XP / 40% Doka (level kept).
EVIDENCE: App.tsx tip vs BattleUIPanel flee string vs GameOverModal "20% penalty".
RECOMMENDED_ACTION: Wire deathPenaltyCopy.ts when host files are free.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (unwired copy module)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: deathPenaltyCopy.test.ts
STATUS: IMPLEMENTED_THIS_RUN (module only — not wired)
```

```
ACTION_ID: UX-SPELL-AP-DISABLED-REASON
TITLE: Champion spell hover names insufficient AP
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/spellSlotDisabledCopy.ts (NEW, unwired); BattleUIPanel.tsx ~623–649
CURRENT_BEHAVIOUR: Slots disable only for empty / cooldown / overworld. AP-short spells stay selectable; SummonControlPanel already greys on AP.
DESIRED_BEHAVIOUR: Title/aria names "Need N AP (have M)" when cost > current AP.
EVIDENCE: BattleUIPanel disabled={isEmpty || isOnCooldown || !inBattle}; SummonControlPanel SpellSlot disabled={currentAp < spell.apCost}.
RECOMMENDED_ACTION: Wire spellSlotDisabledCopy into BattleUIPanel when free.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (unwired copy module)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: spellSlotDisabledCopy.test.ts
STATUS: IMPLEMENTED_THIS_RUN (module only — not wired)
```

```
ACTION_ID: UX-ATTACK-NEAREST-WHY
TITLE: Attack Nearest disabled title names the blocking reason
CATEGORY: combat
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/attackNearestDisabledCopy.ts (NEW, unwired); BattleUIPanel.tsx ~835–843
CURRENT_BEHAVIOUR: One generic string for all mid-battle fails (mode, spell, AP, CD, range/LoS).
DESIRED_BEHAVIOUR: Distinct hover per gate.
EVIDENCE: canAttackNearest composed in WorldExploration ~18852–18896; BattleUIPanel title collapses to one line.
RECOMMENDED_ACTION: Wire attackNearestDisabledCopy when BattleUIPanel is free.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (unwired copy module)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: attackNearestDisabledCopy.test.ts
STATUS: IMPLEMENTED_THIS_RUN (module only — not wired)
```

```
ACTION_ID: UX-BOSS-RUSH-ADVANCE-LABEL
TITLE: Boss Rush progression portal nearby label + unlock beat
CATEGORY: boss-progression
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/bossRushPortalCopy.ts (NEW, unwired); WorldExploration.tsx ~7915–7941, ~13907–13911, ~17577–17598
CURRENT_BEHAVIOUR: Dungeon portals get canvas nearby labels; Boss Rush unlock is battle-log only + pink Room N/10 chip. No "step here for Room N" near the progression portal.
DESIRED_BEHAVIOUR: Nearby carved-stone label when unlocked ("Next — Room N/10").
EVIDENCE: labelText only for dungeon color / dungeonChainActive; boss rush clear logs "portal hums to life" with no canvas label.
RECOMMENDED_ACTION: Wire bossRushPortalCopy into the portal draw pass when WorldExploration is free.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (unwired copy module)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: bossRushPortalCopy.test.ts
STATUS: IMPLEMENTED_THIS_RUN (module only — not wired)
```

```
ACTION_ID: UX-SUMMON-UPGRADE-COST-COPY
TITLE: Summon upgrade UI copy names the 10× advertise vs canister debit
CATEGORY: upgrades
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/summonUpgradeCostCopy.ts (NEW, unwired); SpellbookModal.tsx ~439–448, ~1157–1189; spellUpgrade.ts ~112–141
CURRENT_BEHAVIOUR: UI shows 10× and gates canAfford on that; canister charges 1× (spellUpgradeUiSpend).
DESIRED_BEHAVIOUR: Expanded upgrade row says summon upgrades advertise 10×; debit follows canister. Gate fix is separate (HUMAN).
EVIDENCE: upgradeCost uses SUMMON_UPGRADE_COST_MULTIPLIER; spellUpgradeCanisterSpend divides by 10.
RECOMMENDED_ACTION: Wire copy under summon Upgrade expand; do not change economics in this pass.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT (unwired copy module)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: summonUpgradeCostCopy.test.ts
STATUS: IMPLEMENTED_THIS_RUN (module only — not wired)
```

### Open — HUMAN / REPORT_ONLY (combat pass)

```
ACTION_ID: UX-SUMMON-UPGRADE-COST-GATE
TITLE: Spellbook blocks summon upgrades the canister would accept
CATEGORY: upgrades
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: SpellbookModal.tsx ~1157; spellUpgrade.ts spellUpgradeCanisterSpend; gameConstants.ts SUMMON_UPGRADE_COST_MULTIPLIER
CURRENT_BEHAVIOUR: canAfford = dokaBalance >= advertised 10× cost. Player with 50 Doka sees "Not enough Doka" for a level-0 summon upgrade the canister would charge 10 for.
DESIRED_BEHAVIOUR: Gate affordability on canister spend (or charge 10× for real). Shown cost and wallet debit must agree.
EVIDENCE: upgradeCost → 100 at level 0; persistSpellUpgrade / upgradeSpell charges spellLevelingBaseCost * 2^level (10).
RECOMMENDED_ACTION: HUMAN — align SpellbookModal canAfford with spellUpgradeCanisterSpend (or raise canister price). SpellbookModal currently stack-locked.
AUTONOMY:
- HUMAN
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Summon upgrade with mid-wallet; wallet delta matches button.
STATUS: NEW
```

```
ACTION_ID: UX-SUMMON-PHASE-YOUR-TURN
TITLE: Summon turn still labels phase YOUR / YOUR TURN
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BattleUIPanel.tsx ~371–381, ~571–592
CURRENT_BEHAVIOUR: isSummonControlled shows "Summon's Turn" while phase chip still says YOUR and trailing label YOUR TURN. Distinct from bar overlap (UX-SUMMON-BAR-OVERLAP).
DESIRED_BEHAVIOUR: Phase + trailing label say SUMMON (or summon name) while controlled.
EVIDENCE: battlePhase stays "player" during control mode; Summon's Turn is additive only.
RECOMMENDED_ACTION: HUMAN — BattleUIPanel phase strings branch on isSummonControlled.
AUTONOMY:
- HUMAN
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Summon turn: no "YOUR TURN" on champion chrome.
STATUS: NEW
```

```
ACTION_ID: UX-INSPECT-SUMMON-AS-ENEMY
TITLE: Inspect labels player summons as Enemy
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: StatPopup.tsx ~126–127
CURRENT_BEHAVIOUR: Any non-id==="player" unit gets "· Enemy", including player-side summons.
DESIRED_BEHAVIOUR: Player summons show "· Ally" / "· Summon"; hostiles stay Enemy.
EVIDENCE: StatPopup subtitle ternary; CombatantEntry has side / isSummon.
RECOMMENDED_ACTION: HUMAN — StatPopup stack-locked; pass side/isSummon into subtitle.
AUTONOMY:
- HUMAN
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Inspect ally summon ≠ Enemy.
STATUS: NEW
```

```
ACTION_ID: UX-BOSS-RUSH-HUD-CHROME
TITLE: Boss Rush Room chip is pink SaaS pill, not carved stone
CATEGORY: boss-progression
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx ~17577–17598
CURRENT_BEHAVIOUR: Hot-pink rounded-full monospace chip under the top HUD.
DESIRED_BEHAVIOUR: DESIGN.md stone/gold/crimson chip (match Dungeon depth badge).
EVIDENCE: background rgba(180,0,120,0.85); border #FF69B4; fontFamily monospace.
RECOMMENDED_ACTION: HUMAN — WorldExploration stack-locked; restyle when free.
AUTONOMY:
- HUMAN
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Visual match to dungeon chain chip language.
STATUS: NEW
```

```
ACTION_ID: UX-RECAP-DEFEAT-XP-BASIS
TITLE: Defeat recap XP loss omits leftover / 20% basis
CATEGORY: death
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: PostBattleRecap.tsx ~259; deathPenaltyCopy.ts
CURRENT_BEHAVIOUR: Shows "-N XP" with level only; no "20% leftover" line (Game Over has percent but still not leftover).
DESIRED_BEHAVIOUR: Subline "20% of leftover XP this level" next to the loss amount.
EVIDENCE: PostBattleRecap defeat XP block vs App tip / deathPenaltyCopy.
RECOMMENDED_ACTION: Wire deathPenaltyCopy.defeatXpBasis when PostBattleRecap is free.
AUTONOMY:
- REPORT_ONLY (same copy module as UX-DEATH-XP-LEFTOVER-COPY; PostBattleRecap locked)
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Lava defeat recap shows leftover basis.
STATUS: NEW
```

### Auto-landed this combat pass (unwired except summon name)

| Module | IDs |
| :--- | :--- |
| `src/frontend/src/utils/summonDisplayName.ts` | UX-SUMMON-NAME-PIECETYPE |
| `src/frontend/src/utils/deathPenaltyCopy.ts` | UX-DEATH-XP-LEFTOVER-COPY, UX-RECAP-DEFEAT-XP-BASIS |
| `src/frontend/src/utils/spellSlotDisabledCopy.ts` | UX-SPELL-AP-DISABLED-REASON |
| `src/frontend/src/utils/attackNearestDisabledCopy.ts` | UX-ATTACK-NEAREST-WHY |
| `src/frontend/src/utils/bossRushPortalCopy.ts` | UX-BOSS-RUSH-ADVANCE-LABEL |
| `src/frontend/src/utils/summonUpgradeCostCopy.ts` | UX-SUMMON-UPGRADE-COST-COPY (gate is HUMAN) |

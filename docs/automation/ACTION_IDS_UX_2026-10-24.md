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
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterSelection.tsx:486,889; src/frontend/src/utils/characterSelectionCopy.ts
CURRENT_BEHAVIOUR: JSX text nodes keep source escapes, so the card title renders as the characters "\u2694 Slot N" and loading as "Loading character slots\u2026".
DESIRED_BEHAVIOUR: Real ⚔ / … glyphs via JS strings or unicode characters.
EVIDENCE: CharacterSelection.tsx 486 `\u2694 Slot {slotNumber}` and 889 `Loading character slots\u2026` are JSXText, not `"\u…"` string literals (piece icons at 613–618 correctly use JS strings).
RECOMMENDED_ACTION: Wire characterSelectionCopy SLOT_HEADER / LOADING_SLOTS (HUMAN — CharacterSelection.tsx forbidden this run).
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
FILES_OR_SYSTEMS: CharacterSelection.tsx:945; LandingPage ÆSTRALTØ; src/frontend/src/utils/characterSelectionCopy.ts
CURRENT_BEHAVIOUR: "Choose your Paper Baby Vampire!" after landing branded ÆSTRALTØ. Distinct from tab-title ID (index.html / GameFlow wordmark).
DESIRED_BEHAVIOUR: "Choose your champion" (or ÆSTRALTØ-aligned headline).
EVIDENCE: CharacterSelection.tsx 945; LandingPage title canvas "ÆSTRALTØ".
RECOMMENDED_ACTION: Wire SELECTION_HEADLINE (HUMAN).
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
| `src/frontend/src/utils/characterSelectionCopy.ts` | UX-SELECT-SLOT-LITERAL-ESCAPE, UX-SELECT-PAPER-BABY-HEADLINE |
| `src/frontend/src/utils/profileNameCopy.ts` | UX-PROFILE-BOARD-NAME-MISLEAD, UX-ACCOUNT-VS-CHAMPION-NAME |
| `src/frontend/src/utils/changelogDismissCopy.ts` | UX-CHANGELOG-PLAY-PREMATURE |
| `src/frontend/src/utils/overworldVitalsCopy.ts` | UX-HEAL-RATIO-CRYPTIC, UX-OVERWORLD-AP-MP-IDLE |
| `src/frontend/src/utils/encounterStartCopy.ts` | UX-ENCOUNTER-NO-BANNER |
| `src/frontend/src/utils/portalTransitionCopy.ts` | UX-PORTAL-TRANSITION-OPAQUE |

Do not bump `APP_VERSION` from this copy pass. Do not wire into forbidden hosts while older open PRs own them.

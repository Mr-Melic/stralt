# ACTION_IDs — 2026-09-02 Player Journey & UX Auditor

Durable ledger for implementers and the Report Action Orchestrator.  
Source: Player Journey & UX Auditor (`96624677-a486-11f1-a7d1-d6b4613131ce`).  
Narrative: [`UX_AUDIT_2026-09-02.md`](./UX_AUDIT_2026-09-02.md).  
`DESIGN.md` is the visual source of truth. Do not restyle into generic SaaS UI.

Reuse the stable `UX-*` IDs from 2026-08-31 / 2026-09-01. New IDs only where the GameKey shop or a regression created a distinct player question.

---

## Prior ID status at HEAD `58302bc` + this run

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| UX-HUD-DUPLICATE-TOPBAR | IMPLEMENTED | Spacer only. Do not restore the dummy 0/100 bar. |
| UX-RECAP-XP-CURVE | RESOLVED | `xpHudProgress` / `recapXpAfterGrant` / `xpForNextLevel`. |
| UX-VITALS-ORB-MAX | RESOLVED | `vitalsOrbCaps`. |
| UX-BLOOD-DEAD-BAR | IMPLEMENTED | Do not invent a Blood spend path. |
| UX-SELECT-ROTATE-LEFT | IMPLEMENTED | — |
| UX-BOOST-DEAD-CONTROL | IMPLEMENTED | Hidden. |
| UX-RECAP-MAP-ID | IMPLEMENTED | Region name. |
| UX-RECAP-DEBUG-LOGS | IMPLEMENTED | — |
| UX-SELECT-DEAD-BREADCRUMB | IMPLEMENTED | — |
| UX-IAP-KYC-SURPRISE | RESOLVED | #258 removed proof-of-address; email + consent only. |
| UX-SHOP-TWO-STORES | OPEN | Items vs Buy Doka copy is better; two doors remain. |
| UX-SPELL-OVERWORLD-MUTED | IMPLEMENTED_THIS_RUN | Regression after SpellFooter → BattleUIPanel. |
| UX-DEATH-DUAL-MODAL | OPEN | P0. Do not rewire deathGuards unattended. |
| UX-ONBOARD-FIRST-MAP | OPEN | — |
| UX-PORTAL-LEGEND | OPEN | — |
| UX-CAST-FAIL-FEEDBACK | OPEN | Button titles exist; canvas still log-only. |
| UX-HUD-TOOL-CLUSTER | OPEN | — |
| UX-CREATE-NO-STATS | OPEN | — |
| UX-VERSION-FORCE-RELOGIN | OPEN | Changelog bullets refreshed; version not bumped. |
| UX-SMALL-SCREEN-HARD-BLOCK | OPEN | Continue anyway; no stacked HUD. |
| UX-IDENTITY-FONT-DRIFT | OPEN | REPORT_ONLY. |
| UX-BOSS-RUSH-PINK | OPEN | — |

---

ACTION_ID: UX-SPELL-OVERWORLD-MUTED
TITLE: Overworld spell slots look broken
CATEGORY: spell-state
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx
CURRENT_BEHAVIOUR: After SpellFooter was folded into BattleUIPanel, slots stayed enabled on the map. Hover listed damage/AP. Clicking armed selectedSpellIdRef even though no fight had started. Attack Nearest sat in the same dock.
DESIRED_BEHAVIOUR: Hover says the spell is usable once a fight starts. Slots and Attack Nearest are disabled out of battle. Book still opens for loadout.
EVIDENCE: BattleUIPanel spell row is not gated on inBattle; WorldExploration onSelectSpell used `if (!inBattle || currentBattleAp > 0)` which is true on the map.
RECOMMENDED_ACTION: Disable slots / Attack Nearest when `!inBattle`. Title-only + click no-op. Do not change targeting math.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: In battle, hover still shows AP/range; on the map, hover says fight-first and clicks do not arm a spell.
STATUS: IMPLEMENTED_THIS_RUN

ACTION_ID: UX-GAMEKEY-PASTE-WHITESPACE
TITLE: Emailed 120-character GameKeys fail if wrapped
CATEGORY: invalid-action-explanation
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/dokaGameKey.ts; src/frontend/src/components/DokaGameKeyShop.tsx
CURRENT_BEHAVIOUR: validateGameKeyFormat rejected spaces/newlines. Email clients wrap 120-character codes. Player saw “invalid characters” or “too long” with no length counter.
DESIRED_BEHAVIOUR: Strip whitespace on paste. Show n/120. Keep the 120-character alphabet unchanged.
EVIDENCE: GAME_KEY_LENGTH 120; GAME_KEY_ALPHABET has no space; iapShopCopy.test wrap fixture.
RECOMMENDED_ACTION: normalizeGameKeyInput before validate and redeem.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: A 120-char key split with a newline redeems; a 119-char key still errors too short.
STATUS: IMPLEMENTED_THIS_RUN

ACTION_ID: UX-GAMEKEY-STEP-ORDER
TITLE: Buy Doka does not answer “what should I do first?”
CATEGORY: action-discoverability
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/DokaGameKeyShop.tsx; src/frontend/src/utils/iapShopCopy.ts
CURRENT_BEHAVIOUR: QR + Mollie link sit above the email form. Success toast says submit then pay. Disabled submit while pending did not say to still pay. No numbered how-to.
DESIRED_BEHAVIOUR: One carved list: email → pay → wait for Approved → paste GameKey. Later: move QR below Submit so visual order matches the list. Do not change requestGameKeyPurchase / redeemGameKey.
EVIDENCE: DokaGameKeyShop layout; IAP_SHOP_STEPS added this run; QR block still precedes the form.
RECOMMENDED_ACTION: How-to list shipped. Human: reorder QR under the submit button.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy; MEDIUM if payment/QR is moved without a playtest.
VALIDATION_REQUIRED: First-time buyer can state the four beats without reading source.
STATUS: PARTIAL

ACTION_ID: UX-GAMEKEY-STATUS-STALE
TITLE: Buy Doka status did not update while the player waited
CATEGORY: feedback
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/DokaGameKeyShop.tsx
CURRENT_BEHAVIOUR: getMyGameKeyPurchaseStatus ran on mount, submit, and redeem only. A player who paid with the modal open kept seeing “Waiting for approval” until they closed and reopened.
DESIRED_BEHAVIOUR: Poll while open. Toast once when pending becomes approved.
EVIDENCE: loadStatus callers before this run; 8s interval + seenStatusRef toast this run.
RECOMMENDED_ACTION: Keep the poll. Do not add a second request while one is in flight.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW (query-only)
VALIDATION_REQUIRED: Pending chip flips to Approved without closing the modal (staging).
STATUS: IMPLEMENTED_THIS_RUN

ACTION_ID: UX-CHALLENGE-FAIL-WHY
TITLE: Challenge banner said Failed without the broken rule
CATEGORY: invalid-action-explanation
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/challengeCompletion.ts; src/frontend/src/components/ChallengePanel.tsx
CURRENT_BEHAVIOUR: Mid-fight chip was “Failed!” plus Turns / Damage taken. Striker labeled “Direct hit: No” even though the rule is Chebyshev ≤ 2 on every spent cast.
DESIRED_BEHAVIOUR: Name the broken rule. Striker line matches the description.
EVIDENCE: isChallengeFailed only used for this banner; challengeFailCopy this run.
RECOMMENDED_ACTION: Display-only. Do not change isChallengeCompleted.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Untouchable after a hit reads “Failed — damage was taken”; Striker after a range-3 cast reads “beyond 2 tiles”.
STATUS: IMPLEMENTED_THIS_RUN

ACTION_ID: UX-DEATH-DUAL-MODAL
TITLE: Combat Game Over and lava recap still disagree on the next step
CATEGORY: modal-conflicts
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx; src/frontend/src/components/GameOverModal.tsx; src/frontend/src/components/PostBattleRecap.tsx; src/frontend/src/App.tsx
CURRENT_BEHAVIOUR: _handlePlayerDeath unmounts the world and shows Game Over (“Enter the Death Realm”). Lava/out-of-battle HP-watch fires the root defeat recap and auto-enters the realm in 1.5s while the recap can still be open. Combat no longer stacks both overlays.
DESIRED_BEHAVIOUR: One death beat: what you lost (−20% XP / −40% Doka), where you go (Death Realm), what to do (walk to a portal). Do not unmount the world under a second dialog.
EVIDENCE: _handlePlayerDeath → setShowGameOver(true); showGameOver early return; lava path onShowBattleSummary + 1500ms timer; recap wrapper z-9999.
RECOMMENDED_ACTION: Human-approved: keep root recap as the only death UI, then fade into Death Realm. Do not rewire deathGuards in an unattended run.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: Battle death and lava death each show one explanation; penalties match persistDeathPenalty; portal exit still works.
STATUS: OPEN

ACTION_ID: UX-ONBOARD-FIRST-MAP
TITLE: First realm visit has no teaching beat
CATEGORY: action-discoverability
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx; src/frontend/src/components/LandingPage.tsx; src/frontend/src/components/CharacterCreation.tsx
CURRENT_BEHAVIOUR: After Play the player is on an isometric map with unlabeled whirlpools, no “click a tile to walk,” and no mention that stepping onto an enemy starts a fight. Launch/create still have a next-step line.
DESIRED_BEHAVIOUR: One dismissible carved-stone coach on first world enter. Never a SaaS tooltip tour.
EVIDENCE: No tutorial/onboarding/firstVisit strings in WorldExploration.
RECOMMENDED_ACTION: Human-written 3-line coach, once per slot (localStorage cache only).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW if overlay copy only
VALIDATION_REQUIRED: First Play shows the coach; second Play does not; it never blocks portals or combat.
STATUS: OPEN

ACTION_ID: UX-PORTAL-LEGEND
TITLE: Only dungeon portals explain themselves
CATEGORY: portal-clarity
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Nearby dungeon / chain portals draw “Enter Dungeon Chain” / “Continue Chain (d/max)”. Rest, boss, colored exits, white sanctuary, and Death Realm exits have no label.
DESIRED_BEHAVIOUR: Within 3 tiles, each kind shows a short carved label: Explore / Rest / Boss / Dungeon / Sanctuary / Death Realm exit.
EVIDENCE: Label block gated on `p.color === "dungeon" || dungeonChainActive`.
RECOMMENDED_ACTION: Extend the existing nearby-label path. Do not change spawn rules.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW if labels are canvas text only
VALIDATION_REQUIRED: Each kind in a playtest seed shows a distinct label; dungeon copy still shows depth.
STATUS: OPEN

ACTION_ID: UX-CAST-FAIL-FEEDBACK
TITLE: Illegal casts still mostly write the battle log
CATEGORY: invalid-action-explanation
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx; src/frontend/src/components/BattleUIPanel.tsx; src/frontend/src/components/ChatPanel.tsx
CURRENT_BEHAVIOUR: Button titles cover some “Not enough AP” cases. Tile clicks still logBattleEntry. Players who never open chat get no reason.
DESIRED_BEHAVIOUR: A 1.5s stone whisper on the clicked tile or a toast: Not enough AP, out of range, not your turn, summon is acting.
EVIDENCE: logBattleEntry reject sites in WorldExploration cast paths.
RECOMMENDED_ACTION: One shared explainRejectedCast(reason) for click and touch. Do not change targeting math.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW if overlay-only
VALIDATION_REQUIRED: AP-starved, out-of-range, and enemy-turn clicks each show a reason once.
STATUS: OPEN

ACTION_ID: UX-SHOP-TWO-STORES
TITLE: Items and Buy Doka still feel like two unlabeled shops
CATEGORY: action-discoverability
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/WorldExploration.tsx; src/frontend/src/components/BuffShop.tsx; src/frontend/src/components/DokaGameKeyShop.tsx
CURRENT_BEHAVIOUR: Under-HUD Items opens BuffShop titled “Item Shop”. HUD cart is icon-only (title “Buy Doka”) and opens the GameKey modal. Two shopping-cart glyphs.
DESIRED_BEHAVIOUR: Never both labeled Shop. Cart shows the word Doka, not only an icon. IAP already says real-money + GameKey.
EVIDENCE: GameFlow Items; WorldExploration cart button; BuffShop “Item Shop”; IAP_SHOP_TITLE “Buy Doka”.
RECOMMENDED_ACTION: Add visible “Doka” on the cart. Do not merge the two APIs.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy
VALIDATION_REQUIRED: Items still buys buffs; cart still opens GameKey.
STATUS: OPEN

ACTION_ID: UX-CART-ICON-ONLY
TITLE: Buy Doka control is a 10px cart with no word
CATEGORY: hud-crowding
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Next to the Doka chip, a crimson cart icon (ShoppingCart 10×10 inside a 44px hit target) has title/aria “Buy Doka” but no visible label. Easy to miss vs labeled Items.
DESIRED_BEHAVIOUR: Same stone language as Items: icon + “Doka”.
EVIDENCE: WorldExploration shop.open_modal_button.
RECOMMENDED_ACTION: Add the word Doka. Do not change applyPendingPurchaseCredit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW — HUD width on 768
VALIDATION_REQUIRED: 768 and 1280 still show leftover XP + Doka amount.
STATUS: NEW

ACTION_ID: UX-HUD-TOOL-CLUSTER
TITLE: Realm tools float over the map instead of living in one bar
CATEGORY: hud-crowding
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: World HUD is name, level, Map #, leftover XP, Doka, cart, region, Center, Enemies. GameFlow pins Items / Board / Feats / Bosses at top-right under a 44px spacer.
DESIRED_BEHAVIOUR: One carved-stone header. Tools as overflow (⋯) or a second row that does not cover XP/Doka.
EVIDENCE: GameFlow z-9001 cluster; WorldExploration header z-100.
RECOMMENDED_ACTION: Human layout. Do not restore the dummy 0/100 overlay bar.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — panel snap still uses the spacer
VALIDATION_REQUIRED: Items / Board / Feats / Bosses still open; leftover XP stays visible at 768 and 1280.
STATUS: OPEN

ACTION_ID: UX-CREATE-NO-STATS
TITLE: Champion forge never shows starting combat stats
CATEGORY: action-discoverability
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterCreation.tsx
CURRENT_BEHAVIOUR: Piece Details lists Type / Pixel Art / 4 Views. Starting 100 HP, 10 AP, 5 MP apply only on save.
DESIRED_BEHAVIOUR: A compact stone row of starting HP/AP/MP/INIT.
EVIDENCE: generateDefaultStats; Piece Details block.
RECOMMENDED_ACTION: Display-only row. Do not let the player edit persisted stats here.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Create still writes the 12-field CharacterStats payload including killCount.
STATUS: OPEN

ACTION_ID: UX-VERSION-FORCE-RELOGIN
TITLE: App version bump wipes local cache and forces re-login
CATEGORY: feedback
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/App.tsx
CURRENT_BEHAVIOUR: APP_VERSION mismatch clears localStorage (preserve list), reloads, then changelog after II login. Landing footer still says v1.0 (admin easter egg). Changelog bullets were stale (15 milestones / AI rebuilt); this run rewrote them without bumping the version.
DESIRED_BEHAVIOUR: Show changelog on landing, then ask to sign in. Do not imply a wipe of canister progress.
EVIDENCE: App.tsx APP_VERSION v163; CHANGELOG_ITEMS; localStorage.clear path; LandingPage v1.0 button.
RECOMMENDED_ACTION: Human: stop forcing II re-auth or add landing copy “Game updated to vN — sign in to continue.”
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — version gate also protects stale clients
VALIDATION_REQUIRED: Bump APP_VERSION in staging; canister characters still load.
STATUS: OPEN

ACTION_ID: UX-LANDING-VERSION-LIE
TITLE: Launch footer says v1.0 while the app is v163
CATEGORY: feedback
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/LandingPage.tsx; src/frontend/src/App.tsx
CURRENT_BEHAVIOUR: Barely-visible v1.0 is the admin triple-click. After a forced re-login the changelog says v163. Players who notice the footer think they are on a different build.
DESIRED_BEHAVIOUR: Footer shows APP_VERSION (or “build”) and keeps the triple-click. Do not advertise v1.0.
EVIDENCE: LandingPage admin_trigger aria-label v1.0; APP_VERSION v163.
RECOMMENDED_ACTION: Display-only. Keep the easter egg.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Triple-click still opens admin prompt; footer matches changelog version.
STATUS: NEW

ACTION_ID: UX-SMALL-SCREEN-HARD-BLOCK
TITLE: Narrow viewports still have no stacked HUD
CATEGORY: responsive-behaviour
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/App.tsx; DESIGN.md
CURRENT_BEHAVIOUR: Guard offers Continue anyway. DESIGN.md still wants ≥44px targets and a sticky bottom menu. Continuing on 390px leaves the desktop HUD overlapping.
DESIRED_BEHAVIOUR: Product call: tablet floor, or a stacked HUD (orbs + spell dock) for 768 landscape first.
EVIDENCE: SmallScreenGuard Continue anyway; no mobile HUD reflow in WorldExploration.
RECOMMENDED_ACTION: Report-only until a human picks a mobile scope.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH if the guard is removed without a HUD reflow
VALIDATION_REQUIRED: 768 and 390-wide viewports after any policy change.
STATUS: OPEN

ACTION_ID: UX-IDENTITY-FONT-DRIFT
TITLE: Live type and color tokens still drift from DESIGN.md
CATEGORY: visual-hierarchy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: DESIGN.md; src/frontend/src/index.css; src/frontend/src/components/LandingPage.tsx
CURRENT_BEHAVIOUR: Brief specifies Space Grotesk / Inter / OKLCH-only. CSS uses Baloo 2 / Saira; launch title measures Arial; boss rush chip is hot pink.
DESIRED_BEHAVIOUR: New chrome uses DESIGN.md tokens. Do not run a repo-wide hex rewrite. Do not recolor leftover-XP purple (Dofus XP).
EVIDENCE: DESIGN.md Typography; index.css --font-display; LandingPage Arial; Boss Rush #FF69B4.
RECOMMENDED_ACTION: Next new screen only. Forbid shadcn gray/purple on player-facing dialogs.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH for a global color sweep
VALIDATION_REQUIRED: Side-by-side with DESIGN.md; gold-on-navy ≥ 4.5:1.
STATUS: OPEN

ACTION_ID: UX-BOSS-RUSH-PINK
TITLE: Boss Rush room chip uses arcade pink
CATEGORY: visual-hierarchy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: “Boss Rush — Room n / 10” is #FF69B4 on magenta, monospace, floating under the header. Dungeon chain uses carved crimson.
DESIRED_BEHAVIOUR: Same stone + gold/crimson family as the dungeon depth pill. Keep room n/10.
EVIDENCE: WorldExploration bossRushState.active overlay ~17586.
RECOMMENDED_ACTION: Restyle only. Do not change room indexing or completeBossRushRoom.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for CSS; MEDIUM if WX merge conflicts
VALIDATION_REQUIRED: Room counter still matches currentRoom + 1 / 10.
STATUS: OPEN

ACTION_ID: UX-ENEMY-REGISTER-LORE
TITLE: Enemies button teaches rules combat does not run
CATEGORY: enemy-information
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/EnemyRegister.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: HUD Enemies opens a bestiary of elemental weaknesses, wall-phase, magic immunity, Archbishop “invulnerable while pawns live.” Combat uses chess-piece kits plus a few family melee hooks. Players plan the wrong fight.
DESIRED_BEHAVIOUR: Register cards match engine metadata, or the button is labeled Guide / Lore until that is true. Do not wire admin flavor as rules.
EVIDENCE: EnemyRegister MONSTERS; PXA-2026-09-01-001.
RECOMMENDED_ACTION: Owned by PX coherence. This run does not implement. Do not treat Register as a combat tutorial.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH if lore is “fixed” by changing combat math to match the poster
VALIDATION_REQUIRED: Ember Knight card matches the 3-turn burn hook or is marked lore.
STATUS: NEW

ACTION_ID: UX-FEATS-VS-ACHIEVEMENTS
TITLE: Feats and Achievements are the same door
CATEGORY: action-discoverability
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/AchievementsPanel.tsx; src/frontend/src/components/PostBattleRecap.tsx
CURRENT_BEHAVIOUR: Cluster button label Feats, title Achievements. Panel header Feats, aria-label Achievements. Recap section Achievements Unlocked.
DESIRED_BEHAVIOUR: One word. Prefer Feats on player chrome if that is the Dofus-like voice, and keep Achievements only in admin/API.
EVIDENCE: GameFlow Feats span; AchievementsPanel aria-label; PostBattleRecap title.
RECOMMENDED_ACTION: Copy pass. Do not rename canister methods.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Button, panel, recap, and claim toast use the same noun.
STATUS: NEW

ACTION_ID: UX-HUD-DUPLICATE-TOPBAR
TITLE: Do not restore the dummy GameFlow XP bar
CATEGORY: visual-hierarchy
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx
CURRENT_BEHAVIOUR: Live HUD is WorldExploration. GameFlow keeps a pointer-events-none spacer.
DESIRED_BEHAVIOUR: Keep it that way.
EVIDENCE: GameFlow comment + 44px spacer.
RECOMMENDED_ACTION: Do not unmask a second opaque bar.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH if the dummy bar returns
VALIDATION_REQUIRED: Leftover XP visible on world enter.
STATUS: IMPLEMENTED

ACTION_ID: UX-RECAP-XP-CURVE
TITLE: Recap and selection XP bars use leftover / 100×2^(N-1)
CATEGORY: reward-clarity
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/xpCurve.ts; src/frontend/src/components/CharacterSelection.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: This branch uses xpHudProgress, recapXpAfterGrant, and xpForNextLevel().
DESIRED_BEHAVIOUR: Keep it. Do not open a second leftover-XP PR.
EVIDENCE: CharacterSelection XpBar; WorldExploration recap builders.
RECOMMENDED_ACTION: None. Leave closed.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if rewritten again
VALIDATION_REQUIRED: Level 3 with 50 leftover shows 50/400.
STATUS: RESOLVED

ACTION_ID: UX-VITALS-ORB-MAX
TITLE: Side-panel jewels use live HP/AP/MP caps
CATEGORY: ap-mp-clarity
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/vitalsOrbCaps.ts; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Jewels bind sidePanelVitalsCaps and show current/max.
DESIRED_BEHAVIOUR: Keep it.
EVIDENCE: Vitals orb map in WorldExploration.
RECOMMENDED_ACTION: None.
AUTONOMY:
- REPORT_ONLY
VALIDATION_REQUIRED: Fill ≤ 100% after AP growth.
STATUS: RESOLVED

ACTION_ID: UX-BLOOD-DEAD-BAR
TITLE: Remove inert Blood chip from the live HUD
CATEGORY: hud-crowding
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Blood chip is gone.
DESIRED_BEHAVIOUR: Stay gone until a live Blood system exists.
EVIDENCE: No bloodBalance HUD chip in WorldExploration header.
RECOMMENDED_ACTION: Do not restore.
AUTONOMY:
- REPORT_ONLY
STATUS: IMPLEMENTED

# Game UX Designer — 2026-09-01

DESIGN.md is unchanged. Visual identity stays Dofus / Ankama carved stone, gold/crimson, orbs — not SaaS.

## Journey snapshot

| Beat | Should do | Can do | Why blocked | Just happened | Earned/lost | Next |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Launch | Sign in | II popup | Popup blocked (now has error) | Title + realm copy | — | Login |
| Login | Name account | ProfileSetup | Candid/name errors shown | Session starts | — | Forge / Play |
| Create | Name + piece + colors | Cancel / save | Empty name disables save | Toast: Play from slots | Appearance only | Selection |
| Selection | Play a slot | Edit / delete / create | Slots load fail → Retry | Leftover XP bar (curve OK) | — | World |
| Explore | Click tiles to walk | Portals, Doka, Items, heal | First map has no coach | Map # + region | Ground Doka | Step on enemy / portal |
| Encounter | Step onto an enemy | Walk around | Death-realm timer / transition | Fight starts with no coach | — | Combat |
| Combat | Spend AP/MP, end turn | Walk / cast / Attack Nearest | Failures often only in chat | Initiative + orbs | — | Victory or death |
| Spells | Pick slot, click tile | Book / upgrade | Slots dead on overworld | Cooldown number | — | Cast or Book |
| Victory | Read recap | Continue | — | Recap at app root | XP + Doka (curve OK) | Explore |
| Rewards | Confirm totals | Close recap | Map title was raw id (fixed) | applyRewards persist | Leftover XP / Doka | Portal or shop |
| Progress | Level + spell ranks | Book upgrades | Cost surprise on summons | HUD leftover XP | Stats grow | Harder maps |
| Death | Enter Death Realm | Walk to portal | Combat vs lava use different UIs | −20% XP / −40% Doka | Half HP | Portal out |
| Recovery | Leave Death Realm | Portals | Unlabeled exits | Toast after lava | Level kept | Explore |
| Shop | Buy potions (Doka) or credit (EUR) | Two doors | IAP asks KYC docs | Items vs cart | Doka in/out | Heal / upgrade |
| Upgrades | Expand spell, pay Doka | 8 loadout slots | Overworld slots look broken | +3% dmg / level | Doka | Combat |
| Dungeon | Enter labeled whirlpool | Chain depth HUD | Rest/boss/sanctuary unlabeled | Depth × Doka | Chain bonus | Next floor / rest |
| Boss | Purple portal / rush | Bosses guide | Pink rush chip; purple banner | Room n/10 | Boss recap | Sanctuary |

## Status of 2026-08-31 UX IDs

| ID | Status this run |
| :--- | :--- |
| UX-HUD-DUPLICATE-TOPBAR | Still shipped. Spacer + under-HUD cluster remain. |
| UX-DEATH-DUAL-MODAL | Still open. Combat uses Game Over only; lava uses recap + auto-realm. |
| UX-RECAP-XP-CURVE | Resolved on this branch (`xpHudProgress` / `recapXpAfterGrant` / `xpForNextLevel`). |
| UX-ONBOARD-FIRST-MAP | Still open. |
| UX-PORTAL-LEGEND | Still open. |
| UX-CAST-FAIL-FEEDBACK | Still open (button titles exist; tile clicks still log-only). |
| UX-VITALS-ORB-MAX | Resolved (`vitalsOrbCaps` + current/max on jewels). |
| UX-SHOP-TWO-STORES | Still open. |
| UX-BLOOD-DEAD-BAR | Implemented this run (bar + unused state removed). |
| UX-CREATE-NO-STATS | Still open. |
| UX-VERSION-FORCE-RELOGIN | Still open. |
| UX-SMALL-SCREEN-HARD-BLOCK | Softened: Continue anyway exists; no stacked HUD yet. |
| UX-IDENTITY-FONT-DRIFT | Still open (Baloo 2 / Saira / Arial vs Space Grotesk / Inter). |
| UX-BOOST-DEAD-CONTROL | Still hidden. |
| UX-SELECT-ROTATE-LEFT | Still shipped. |

---

ACTION_ID: UX-BLOOD-DEAD-BAR
TITLE: Remove inert Blood chip from the live HUD
CATEGORY: hud-crowding
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Blood bar stayed at localStorage 100; setter unused.
DESIRED_BEHAVIOUR: No Blood chip until a live Blood system exists.
EVIDENCE: Prior unused `_setBloodBalance`; HUD chip sat between leftover XP and Doka.
RECOMMENDED_ACTION: Hide the chip and drop the unused state.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: World HUD still shows leftover XP, Map #, region, Doka.
STATUS: IMPLEMENTED_THIS_RUN

---

ACTION_ID: UX-RECAP-MAP-ID
TITLE: Recap headline used the internal map id
CATEGORY: reward-clarity
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx; src/frontend/src/components/PostBattleRecap.tsx
CURRENT_BEHAVIOUR: Victory, persist-fail, and lava-defeat recaps passed `currentMap.id` (e.g. map-…).
DESIRED_BEHAVIOUR: Recap subtitle is the region name (`levelZone.name`), with id as fallback.
EVIDENCE: WorldExploration recap builders; PostBattleRecap renders `data.mapTitle` under Battle Complete.
RECOMMENDED_ACTION: Prefer `levelZone.name`.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Recap shows the same region string as the HUD chip, not a raw map id.
STATUS: IMPLEMENTED_THIS_RUN

---

ACTION_ID: UX-SPELL-OVERWORLD-MUTED
TITLE: Overworld spell slots look broken
CATEGORY: spell-state
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/SpellFooter.tsx
CURRENT_BEHAVIOUR: Slots are disabled out of battle. Hover still described damage/AP as if they were live.
DESIRED_BEHAVIOUR: Hover says the spell is usable once a fight starts. Later: dim copy on the dock itself.
EVIDENCE: SpellFooter `disabled={isEmpty \|\| !inBattle \|\| isOnCooldown}`.
RECOMMENDED_ACTION: Title-only this run. Do not change cast gating.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: In battle, hover still shows AP/range; on the map, hover says fight-first.
STATUS: PARTIAL

---

ACTION_ID: UX-SELECT-DEAD-BREADCRUMB
TITLE: Selection header showed a dead Character pill
CATEGORY: visual-hierarchy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx
CURRENT_BEHAVIOUR: Non-world header mapped a one-item `["character"]` list. On selection the pill never highlighted and did nothing.
DESIRED_BEHAVIOUR: No fake stage breadcrumb.
EVIDENCE: GameFlow non-game header next to Log Out.
RECOMMENDED_ACTION: Remove the leftover chip. Keep Log Out / Admin.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Selection and create still show name + Log Out.
STATUS: IMPLEMENTED_THIS_RUN

---

ACTION_ID: UX-RECAP-DEBUG-LOGS
TITLE: Recap printed BattleSummary debug lines
CATEGORY: feedback
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/PostBattleRecap.tsx; src/frontend/src/App.tsx
CURRENT_BEHAVIOUR: Render and every dismiss path `console.log`’d BattleSummary.
DESIRED_BEHAVIOUR: No player-facing console noise on recap.
EVIDENCE: PostBattleRecap mount/escape/backdrop/close/continue; App onClose.
RECOMMENDED_ACTION: Delete the logs. Keep dismiss behaviour.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Escape, backdrop, ×, and Continue still close the root recap.
STATUS: IMPLEMENTED_THIS_RUN

---

ACTION_ID: UX-DEATH-DUAL-MODAL
TITLE: Combat Game Over and lava recap still disagree on the next step
CATEGORY: modal-conflicts
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx; src/frontend/src/components/GameOverModal.tsx; src/frontend/src/components/PostBattleRecap.tsx; src/frontend/src/App.tsx
CURRENT_BEHAVIOUR: `_handlePlayerDeath` unmounts the world and shows Game Over (“Enter the Death Realm”). Lava/out-of-battle HP-watch fires the root defeat recap and auto-enters the realm in 1.5s while the recap can still be open. Combat no longer stacks both overlays.
DESIRED_BEHAVIOUR: One death beat: what you lost (−20% XP / −40% Doka), where you go (Death Realm), what to do (walk to a portal). Do not unmount the world under a second dialog.
EVIDENCE: `_handlePlayerDeath` → `setShowGameOver(true)`; showGameOver early return; lava path `onShowBattleSummary` + 1500ms timer; GameOverModal; recap z-9999.
RECOMMENDED_ACTION: Human-approved: keep root recap as the only death UI, then fade into Death Realm. Do not rewire deathGuards in an unattended run.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: Battle death and lava death each show one explanation; penalties match persistDeathPenalty; portal exit still works.
STATUS: OPEN

---

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
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: First Play shows the coach; second Play does not; it never blocks portals or combat.
STATUS: OPEN

---

ACTION_ID: UX-PORTAL-LEGEND
TITLE: Only dungeon portals explain themselves
CATEGORY: portal-clarity
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx; src/frontend/src/engine/portalRules.ts
CURRENT_BEHAVIOUR: Nearby dungeon / chain portals draw “Enter Dungeon Chain” / “Continue Chain (d/max)”. Rest, boss, colored exits, white sanctuary, and Death Realm exits have no label.
DESIRED_BEHAVIOUR: Within 3 tiles, each kind shows a short carved label: Explore / Rest / Boss / Dungeon / Sanctuary / Death Realm exit.
EVIDENCE: Label block gated on `p.color === "dungeon" || dungeonChainActive`.
RECOMMENDED_ACTION: Extend the existing nearby-label path. Do not change spawn rules.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Each kind in a playtest seed shows a distinct label; dungeon copy still shows depth.
STATUS: OPEN

---

ACTION_ID: UX-CAST-FAIL-FEEDBACK
TITLE: Illegal casts still mostly write the battle log
CATEGORY: invalid-action-explanation
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx; src/frontend/src/components/BattleUIPanel.tsx; src/frontend/src/components/ChatPanel.tsx
CURRENT_BEHAVIOUR: Button titles cover some “Not enough AP” cases. Tile clicks still `logBattleEntry`. Players who never open chat get no reason.
DESIRED_BEHAVIOUR: A 1.5s stone whisper on the clicked tile or a toast: Not enough AP, out of range, not your turn, summon is acting.
EVIDENCE: logBattleEntry reject sites in WorldExploration cast paths.
RECOMMENDED_ACTION: One shared `explainRejectedCast(reason)` for click and touch. Do not change targeting math.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: AP-starved, out-of-range, and enemy-turn clicks each show a reason once.
STATUS: OPEN

---

ACTION_ID: UX-SHOP-TWO-STORES
TITLE: Items and Buy Doka still feel like one shop
CATEGORY: action-discoverability
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/WorldExploration.tsx; src/frontend/src/components/BuffShop.tsx
CURRENT_BEHAVIOUR: Under-HUD **Items** opens BuffShop (Doka potions). CARVED cart next to the Doka chip is icon-only (`title="Buy Doka"`) and opens a modal still titled **Doka Shop** with EUR packages, then a proof-of-address form.
DESIRED_BEHAVIOUR: “Items” vs “Buy Doka”, never both labeled Shop. IAP must say it is real-money credit before KYC.
EVIDENCE: GameFlow Items; WorldExploration shop modal heading “Doka Shop”; form fields include Proof of Address — Required.
RECOMMENDED_ACTION: Rename modal to Buy Doka and add one real-money line. Do not change purchase APIs.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW for copy; HIGH if IAP/KYC is redesigned.
VALIDATION_REQUIRED: Items still buys buffs; cart still opens packages.
STATUS: OPEN

---

ACTION_ID: UX-IAP-KYC-SURPRISE
TITLE: Buy Doka jumps into identity documents
CATEGORY: action-discoverability
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: After picking a EUR package the player is asked for name, address, and a required utility-bill upload with no “why” or “what happens next.”
DESIRED_BEHAVIOUR: One stone line before the form: real-money purchase, documents for the operator, Doka credits after review. Keep the form if legally required.
EVIDENCE: shopStep `"form"`; Proof of Address — Required; no preamble.
RECOMMENDED_ACTION: Copy-only preamble. Do not drop required fields without a human/legal call.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM if fields are removed.
VALIDATION_REQUIRED: Package → form still submits the same payload.
STATUS: NEW

---

ACTION_ID: UX-HUD-TOOL-CLUSTER
TITLE: Realm tools float over the map instead of living in one bar
CATEGORY: hud-crowding
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: World HUD is name, level, Map #, leftover XP, Doka, cart, region, Center, Enemies. GameFlow pins Items / Board / Feats / Bosses at top-right under a 44px spacer. They collide with the live strip on mid-width tablets.
DESIRED_BEHAVIOUR: One carved-stone header. Tools as overflow (⋯) or a second row that does not cover XP/Doka.
EVIDENCE: GameFlow z-9001 cluster; WorldExploration 44px header z-100.
RECOMMENDED_ACTION: Human layout. Do not restore the dummy 0/100 overlay bar.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — panel snap still uses the spacer.
VALIDATION_REQUIRED: Items / Board / Feats / Bosses still open; leftover XP stays visible at 768 and 1280.
STATUS: NEW

---

ACTION_ID: UX-CREATE-NO-STATS
TITLE: Champion forge never shows starting combat stats
CATEGORY: action-discoverability
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterCreation.tsx
CURRENT_BEHAVIOUR: Piece Details lists Type / Pixel Art / 4 Views. Starting 100 HP, 10 AP, 5 MP apply only on save.
DESIRED_BEHAVIOUR: A compact stone row of starting HP/AP/MP/INIT.
EVIDENCE: `generateDefaultStats`; Piece Details block.
RECOMMENDED_ACTION: Display-only row. Do not let the player edit persisted stats here.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Create still writes the 12-field CharacterStats payload including killCount.
STATUS: OPEN

---

ACTION_ID: UX-VERSION-FORCE-RELOGIN
TITLE: App version bump wipes local cache and forces re-login
CATEGORY: feedback
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/App.tsx
CURRENT_BEHAVIOUR: APP_VERSION mismatch clears localStorage (preserve list), reloads, then changelog after II login. Changelog still mentions “15 milestones” / “AI fully rebuilt.”
DESIRED_BEHAVIOUR: Show changelog on landing, then ask to sign in. Do not imply a wipe of canister progress.
EVIDENCE: App.tsx APP_VERSION / CHANGELOG_ITEMS / localStorage.clear path.
RECOMMENDED_ACTION: Human: stop forcing II re-auth or add landing copy “Game updated to vN — sign in to continue.” Refresh changelog.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Bump APP_VERSION in staging; canister characters still load.
STATUS: OPEN

---

ACTION_ID: UX-SMALL-SCREEN-HARD-BLOCK
TITLE: Narrow viewports still have no stacked HUD
CATEGORY: responsive-behaviour
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/App.tsx; DESIGN.md
CURRENT_BEHAVIOUR: Guard now offers Continue anyway. DESIGN.md still wants ≥44px targets and a sticky bottom menu. Continuing on 390px leaves the desktop HUD overlapping.
DESIRED_BEHAVIOUR: Product call: tablet floor, or a stacked HUD (orbs + spell dock) for 768 landscape first.
EVIDENCE: SmallScreenGuard Continue anyway; no mobile HUD reflow in WorldExploration.
RECOMMENDED_ACTION: Report-only until a human picks a mobile scope.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH if the guard is removed without a HUD reflow.
VALIDATION_REQUIRED: 768 and 390-wide viewports after any policy change.
STATUS: OPEN

---

ACTION_ID: UX-IDENTITY-FONT-DRIFT
TITLE: Live type and color tokens still drift from DESIGN.md
CATEGORY: visual-hierarchy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: DESIGN.md; src/frontend/src/index.css; src/frontend/src/components/LandingPage.tsx
CURRENT_BEHAVIOUR: Brief specifies Space Grotesk / Inter / OKLCH-only. CSS uses Baloo 2 / Saira; launch title measures Arial; boss rush chip is hot pink; boss banner is purple gradient.
DESIRED_BEHAVIOUR: New chrome uses DESIGN.md tokens. Do not run a repo-wide hex rewrite.
EVIDENCE: DESIGN.md Typography; index.css --font-display; LandingPage Arial; Boss Rush `#FF69B4`.
RECOMMENDED_ACTION: Next new screen only. Forbid shadcn gray/purple on player-facing dialogs.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH for a global color sweep.
VALIDATION_REQUIRED: Side-by-side with DESIGN.md; gold-on-navy ≥ 4.5:1.
STATUS: OPEN

---

ACTION_ID: UX-BOSS-RUSH-PINK
TITLE: Boss Rush room chip uses arcade pink
CATEGORY: visual-hierarchy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: “Boss Rush — Room n / 10” is `#FF69B4` on magenta, monospace, floating under the header. Dungeon chain uses carved crimson; this chip looks like a different game.
DESIRED_BEHAVIOUR: Same stone + gold/crimson family as the dungeon depth pill. Keep room n/10.
EVIDENCE: WorldExploration bossRushState.active overlay.
RECOMMENDED_ACTION: Restyle only. Do not change room indexing or completeBossRushRoom.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Room counter still matches currentRoom + 1 / 10.
STATUS: NEW

---

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
REGRESSION_RISK: HIGH if the dummy bar returns.
VALIDATION_REQUIRED: Leftover XP visible on world enter.
STATUS: IMPLEMENTED

---

ACTION_ID: UX-RECAP-XP-CURVE
TITLE: Recap and selection XP bars use leftover / 100×2^(N-1)
CATEGORY: reward-clarity
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/xpCurve.ts; src/frontend/src/components/CharacterSelection.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: This branch uses `xpHudProgress`, `recapXpAfterGrant`, and `xpForNextLevel()`.
DESIRED_BEHAVIOUR: Keep it. Do not open a second leftover-XP PR.
EVIDENCE: CharacterSelection XpBar; WorldExploration recap builders.
RECOMMENDED_ACTION: None. Leave closed.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: MEDIUM if rewritten again.
VALIDATION_REQUIRED: Level 3 with 50 leftover shows 50/400.
STATUS: RESOLVED

---

ACTION_ID: UX-VITALS-ORB-MAX
TITLE: Side-panel jewels use live HP/AP/MP caps
CATEGORY: ap-mp-clarity
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/vitalsOrbCaps.ts; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Jewels bind `sidePanelVitalsCaps` and show current/max.
DESIRED_BEHAVIOUR: Keep it.
EVIDENCE: Vitals orb map in WorldExploration.
RECOMMENDED_ACTION: None.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Fill ≤ 100% after AP growth.
STATUS: RESOLVED

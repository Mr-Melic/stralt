# Stralt weekly changelog and engineering health review

**ISO week:** 2026-W39  
**Window:** 2026-09-20 19:00 UTC → 2026-09-27 19:02 UTC  
**Live HEAD inspected:** `0f5363f` on `origin/main` — `Merge pull request #332` (2026-09-03 00:28 UTC)  
**This agent:** weekly changelog cron (`0 19 * * 0`)  
**Gameplay / production code:** not modified.

This is a synthesized week review, not a concatenation of daily automation reports. Player-facing claims below are **only what is on `main`**. Unmerged drafts are called out separately so they are not mistaken for a live patch.

| Source | Status |
| :--- | :--- |
| `origin/main` `git log` in-window | **0 commits, 0 merges** |
| All-ref commits in-window | **460** (452 unique subjects) |
| Open PRs at close | **380** (378 created this week; 2 leftovers from 2026-09-02: #327, #331) |
| Merged PRs in-window | **0** |
| Closed unmerged in-window | **1** (#655, duplicate of still-open #658) |
| Prior weekly ledger | 2026-W35 memories only. W36–W38 reviews were not stored. `main` last moved in W36 (2026-09-03). |

---

## PLAYER-FACING CHANGELOG

### Shipped this week (live game)

**No player-visible changes shipped.** The live canister/client is still the 2026-09-03 build. Combat math, maps, progression, HUD, and shop behaviour are unchanged from last month’s last merge.

There is nothing to list under gameplay, bug fixes, progression, interface, stability, or newly functioning features **for players on the current build**.

### What last shipped (context, not this week)

The freeze started after a dense 2026-09-01–09-03 merge window (GameKey shop, persist clamps, map solvability passes, combat preview sharing, mobile chrome). That work is already in the live game. This week did not add to it.

### Queued work that is **not** in the live game

Automation opened **173 fix** drafts and **178 docs** drafts this week. Many of the fixes are **sidecar helpers that are not wired** into `WorldExploration.tsx`, so even a bulk merge would not immediately change fights. Treat the following as a **backlog of intended player outcomes**, not a patch notes list:

| Player outcome (intended) | Why it is not live |
| :--- | :--- |
| Highlighted walk/cast tiles match what actually spends MP/AP | Preview vs execute still split on `main`; share-gate PRs avoid editing the live file |
| Swap / knockback / corpse destack stop sealing the last exit | Occupancy helpers exist on branches; several PRs say they are **not called** from the live walk/swap path |
| Ground/shrine pickups stop vanishing after a later heal | Persist “keep then absolute write” patches are unmerged and mostly sidecar |
| Soul Rend, drain heals, Shield, Enrage, Trap/Mark placement match their cards | Combat-rule PRs unmerged |
| Recap / shop / inspect easier on a phone (44px, Escape, safe-area) | a11y PRs unmerged |
| Inferno’s gifted card names its 3-turn cooldown | Copy-only PR unmerged |
| Flee no longer usable after the last enemy dies | Unmerged |

Do not advertise these as live until they land on `main` **and** are called from the live battle path.

---

## ENGINEERING HEALTH REVIEW

### Volume vs delivery

| Metric | W35 (last stored weekly) | W39 (this week) |
| :--- | :--- | :--- |
| Commits on `main` | 129 | **0** |
| Merged PRs | ~89 | **0** |
| Open drafts at close | 11 | **380** |
| All-ref commits | n/a | 460 |
| Unique `fix:` subjects | n/a | 194 |
| Unique `docs:` subjects | n/a | 198 |
| Unique `test:` subjects | n/a | 18 |
| Days since last `main` commit | — | **24** (~595 hours) |

The flock did not idle. It produced roughly **50–90 branch commits per day**, almost all as new drafts against frozen `0f5363f`. Oldest-first stack-compat then encourages **sidecar files** so agents do not touch the same hunk as an older sibling. Delivery to players is therefore **zero**, while the merge queue becomes less mergeable as a *game*.

### Critical defects found this week

Count **themes**, not PR titles. The same hole was rediscovered daily with a new interleaving.

| Severity | Count (themes) | Type | Live on `main`? |
| :--- | :--- | :--- | :--- |
| Critical | **3** | Wallet wipe after a kept credit + later absolute `saveBattleStats`; occupancy that can seal the last exit; victory while live HP is 0 | **Yes** (unfixed). Fixes are drafts, often unwired. |
| High | **4** | Preview≠execute (walk occupancy, hover MP, AP/cooldown, ground placement); catalog combat effects missing on execute (Shield RES, Enrage on summons, Soul Rend 0-tick, drain as lifesteal); client-asserted combat feat unlock; first-caller admin / uncapped repeat reward grants (architecture leftovers, not new this week) | **Yes** |
| Medium | **3** | Admin last-live map-modifier / JSON blob guards; GameKey approve double-submit; landing/changelog write hardening (#368) | Partially mitigated on `main` from W36; remaining drafts unmerged |
| Low | many | Copy, 44px chrome, leftover CSS, design-catalog waves | N/A |

**Regression frequency:** the persist-wipe cluster alone has **14** distinct `skip saveBattleStats wipe after …` titles this week. Map destack/unseal has **~20** occupancy-specific PRs (alcove, choke pocket, 2+2 joint, knockback, player↔enemy swap, dump floor 2, …). Combat `share … with execute` has **~16**. This is not a long tail of unique bugs; it is **one invariant per system, patched as scenarios**.

### Recurring bug categories

1. **Persist / economy** (~49 unique fix subjects if keyword-bucketed; ~14 are the wipe family). Pattern: `applyRewards` / GameKey / feat credit **keeps** an unconfirmed or lock-lagging wallet, then recap heal / idle hydrate / unpaid-death flush writes an **absolute** snapshot and the canister applies “incoming below stored.” Pickup gone. Agents add another `shouldSkip…` helper per interleaving (`unseeded portal keep`, `death-cut keep stale fetch`, `keep then feat/GameKey`, …). `progressPersist.ts` on `main` is still 421 lines of lock flags. This needs **one write scheduler**, not a 15th skip predicate.

2. **Procedural softlocks** (~35 map-tagged fixes; ~20 occupancy/destack). Pattern: fight-graph vs portal-past cells, destack punches, corpses on chokes, swap onto the unique bridge. #697 is explicit: unique-bridge unseal **exists and is never called**. New helpers (`occupancySwapUnseal.ts`, dump-floor variants) repeat the same flood/snap. Needs **one post-mutation “occupants stay on the player’s fight graph” pass** called from every displace (swap, knockback, destack, wander, corpse).

3. **Combat-rule inconsistencies** (~47 combat + ~24 preview/execute). Pattern: highlight paints a tile execute rejects (occupied dest, Trap/Mark, CHC-on-heal, hover MP Manhattan vs BFS). #701 centralizes a flood in a new file and **does not touch** `WorldExploration.tsx` so older combat PRs stay green. Live preview/execute drift remains.

4. **Summon / turn lifecycle.** 0-AP auto-end after last hostile, deferred `advanceTurn` after enemy-summon, kit Shield/Slow/Poison metadata dropped on auto-summon, Enrage not on summon outgoing damage. Same W35 `WH-SUMMON-LIFECYCLE` hotspot.

5. **Victory / death races.** Refuse victory at 0 HP (#652); ignore Flee after last hostile (#629). Related to leftover W35 victory-path fragility.

6. **Admin / catalog contract.** Refuse emptying the live map-modifier pool, last-live chance 0, seeded modifier delete, malformed JSON, GameKey approve double-submit. Real, but secondary to persist/map/combat.

7. **Backend-contract.** `dfx.json` still points at missing `src/backend_extended/main.mo`. CharacterStats 12-field path is correct on the canonical actor. Bindgen 15-field drift from W35 looks **gone** in `src/frontend/src/backend.ts`. EOP chain on `main` is the frozen 20260831 + 20260901 GameKey file; no new stables this week on `main`.

8. **Security findings (high-level only).** No new confirmed critical exploit shipped. Leftovers: combat feats still client-marked; first caller can become admin (mixin); per-call reward caps without a per-battle nonce. Queued #368 hardens changelog writes and landing URL schemes. Do not treat those drafts as live.

### Test additions

| Surface | On `main` | This week on branches |
| :--- | :--- | :--- |
| `*.test.ts(x)` files | **94** | **100+ new files** touched on drafts (persist skip suites, occupancy unseal, parity, copy) |
| `pnpm test` / frontend test script | **absent** | still absent |
| CI | `caffeine-import-gate.yml` (typecheck, Biome, vite build, mops, stack-compat) | **does not run** `node --test` |
| Unique `test:` commits | — | 18 |

Tests exist and agents run `node --experimental-strip-types --test` locally. They are **not a merge gate**. A green Caffeine import proves compile/lint/build, not combat/persist invariants.

### Architectural hotspots (repeated fixes ⇒ structural work)

| Hotspot | Size on `main` | Branch touches this week | Verdict |
| :--- | :--- | :--- | :--- |
| `WorldExploration.tsx` | **19,213** lines | **84** | God file. Flock **avoids editing it**, so player-visible bugs stay. Extract is blocked until the 380-PR queue is halted. |
| Persist lock vs absolute stats | `progressPersist.ts` 421; WX hydrate/heal | 10+ persist files | Scenario skip-helpers. Structural: credits vs absolute writes as two APIs with one clock. |
| Map occupancy / destack | `mapGen.ts` 1,937 | 13 | Per-scenario unseal files. Structural: one fight-graph invariant after every mutate. |
| Preview vs execute | `spellEngine.ts` 1,044; `targeting.ts` | 15+ | Dual gates. Structural: highlight must call the execute predicate. |
| `AdminDashboard.tsx` | **8,280** | 12 | Owner console + copy + GameKey. Split or freeze while combat/persist drain. |
| Open-PR process | 380 drafts, all `draft: true` | 378 this week | Oldest-first merge of this queue **cannot** land a coherent game. Process is the blocker. |
| Design-catalog flock | 178 open `docs:` PRs | waves 4–11 bosses, spells, encounters, telemetry-waiting | Expansion docs without telemetry or a freeze. Close or archive; do not merge as gameplay. |

`setCharacterStats` still writes HP beside `updateCombatant` (e.g. thorn/rift walk around WX 9916–9926). Combatant-store split remains open.

### W35 ACTION_IDs — disposition (do not mint twins)

| ACTION_ID | W39 status | Evidence |
| :--- | :--- | :--- |
| WH-WX-MONOLITH | **OPEN** | 19,213 lines; 84 week touches; sidecars unwired |
| WH-COMBATANT-STORE-SPLIT-WRITE | **OPEN** | Store exists; WX still `setCharacterStats` for hazard HP |
| WH-PERSIST-LOCK-RACES | **OPEN** | 14 wipe-titled drafts; none merged |
| WH-CLIENT-ECONOMY-AUTHORITY | **PARTIAL** | Starter caps + ignore-raise clamps on `main`; combat feats still client-marked |
| WH-CREATE-CHAR-CAPS | **DONE** | `_starterStatsRejected` in `main.mo` 183–197 |
| WH-CHAT-IDENTITY | **DONE** | `sendMessage` binds `userProfiles` name (`main.mo` 2610–2645) |
| WH-ACHIEVEMENT-CLIENT-UNLOCK | **OPEN** | `markAchievementUnlocked` still a player update |
| WH-MAP-SOLVABILITY | **OPEN** | 20+ occupancy drafts; helpers often not called |
| WH-CAST-PREVIEW-PARITY | **OPEN** | 16 `share … execute` drafts; live file avoided |
| WH-TOUCH-HAZARD-PARITY | **DONE** | Shared `battleWalkHazardDamages` + `applyBattleWalkHazards` on `main` |
| WH-XP-HUD-CURVE | **DONE** on persist path | Leftover XP is the stored contract; remaining HUD copy is unmerged polish |
| WH-BOOST-TOGGLE-DEAD | **OPEN** | App/GameFlow `_boostMode` unused; WX local `boostMode` stuck on `"xp"` → always ×1.5 (`WorldExploration.tsx` 2098, 12374–12376) |
| WH-DFX-STALE-BACKEND | **OPEN** | `dfx.json` still `src/backend_extended/main.mo` |
| WH-CANDID-DECLARATIONS-DRIFT | **DONE** | 12-field CharacterStats in bindgen; no wp/wr/scp |
| WH-OPEN-PR-COLLISION | **OPEN (escalated)** | 11 → **380** |
| WH-TEST-CI-ABSENCE | **PARTIAL** | Import-gate CI exists; **no test job / no `pnpm test`** |
| WH-VICTORY-PATH-FRAGILITY | **OPEN** | 0-HP victory, Flee-after-clear still drafted |
| WH-SUMMON-LIFECYCLE | **OPEN** | Kit metadata, Enrage, 0-AP auto-end, deferred turn |

### Highest-value priorities for next week (ranked)

1. **Halt the implementer flock and stop opening sibling drafts** until a human names a merge slice. 380 drafts is the defect. (WH-MAIN-MERGE-FREEZE, WH-OPEN-PR-COLLISION, WH-FLOCK-DOCS-WAVE)
2. **Triage the queue into three piles:** close stale docs-only waves; keep one persist PR and one map-occupancy PR as the *structural* branch; close duplicate skip/unseal sidecars.
3. **Persist:** replace per-interleaving skip helpers with one rule: never absolute-write Doka/XP below (committed lock ∪ pending keep ∪ unpaid death). Wire it in WX hydrate/heal. (WH-PERSIST-LOCK-RACES)
4. **Maps:** one `unsealProgressionOccupants` after swap, knockback, destack, wander, corpse. Call it from the live paths. (WH-MAP-SOLVABILITY, WH-SIDECAR-UNWIRED)
5. **Combat:** highlight reachability / MP / AP / cooldown **is** the execute predicate. One module, used by paint and click. (WH-CAST-PREVIEW-PARITY)
6. **Add `pnpm test` (node test runner) to the import-gate CI** so the 94 existing files actually protect `main`. (WH-TEST-CI-ABSENCE)
7. **Do not extract WorldExploration this week** unless (1) is done. Extract during a 380-PR storm will only add restack conflicts. After halt, a thin “call sidecar” restack is higher value than a large split. (WH-WX-MONOLITH)
8. **Product decision on combat feat unlock** (server-verify or accept client trust). Do not silently change rewards. (WH-ACHIEVEMENT-CLIENT-UNLOCK)
9. **Wire or delete the boost toggle** so the HUD control matches XP math. (WH-BOOST-TOGGLE-DEAD)
10. **Do not merge design-catalog waves 4–11** as if they were content. Telemetry is still absent (`WAITING_FOR_TELEMETRY`). Expansion remains design-only.

---

## Actionable findings

ACTION_ID: WH-MAIN-MERGE-FREEZE
TITLE: Main has had zero merges for 24 days while 380 drafts accumulated
CATEGORY: process
PRIORITY: P0
CONFIDENCE: 1.0
FILES_OR_SYSTEMS: origin/main; GitHub PR queue #327–#711
CURRENT_BEHAVIOUR: Last main commit is 2026-09-03 `0f5363f` (#332). This week: 0 merges, 460 branch commits, 378 new open drafts.
DESIRED_BEHAVIOUR: A named human merge slice (or an explicit freeze of implementer automations) so player-facing fixes can land on one branch.
EVIDENCE: `git log origin/main --since=2026-09-20` empty; `gh pr list --state open` length 380; search `is:pr is:merged merged:>=2026-09-20` total_count 0.
RECOMMENDED_ACTION: Disable or pause combat/persist/map implementer crons. Close or mark stale the 178 docs-only PRs. Pick at most one persist and one occupancy structural PR to restack onto main.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: low (process only)
VALIDATION_REQUIRED: Open PR count trending down; at least one player-facing fix merged and wired.
STATUS: NEW

ACTION_ID: WH-SIDECAR-UNWIRED
TITLE: Flock ships occupancy/persist/combat helpers that are not called from the live battle file
CATEGORY: architecture
PRIORITY: P0
CONFIDENCE: 0.92
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx; occupancy*.ts; unconfirmedKeep*WriteSkip.ts; battleWalkReachable.ts
CURRENT_BEHAVIOUR: Oldest-first stack-compat makes agents add new files and skip WorldExploration. Example: #697 occupancy swap unseal “Not wired from WorldExploration”; #698 skip helpers with WX restack deferred; #701 walk flood in a new file leaving WX untouched.
DESIRED_BEHAVIOUR: A merged helper is dead unless the live walk/swap/hydrate/heal path imports it. Gate PRs that only add unused modules, or require a one-line call site.
EVIDENCE: PR bodies #697, #698, #701; WorldExploration 84 touches vs unique new test/helper files on branches.
RECOMMENDED_ACTION: After halt, restack one occupancy helper and one persist skip into WX call sites. Close unused sidecars.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: medium
VALIDATION_REQUIRED: Call-graph or test that live swap/hydrate invokes the helper; play a unique-bridge swap and a keep-then-heal.
STATUS: NEW

ACTION_ID: WH-PERSIST-LOCK-RACES
TITLE: Absolute saveBattleStats still wipes kept credits across new interleavings
CATEGORY: persist-economy
PRIORITY: P0
CONFIDENCE: 0.88
FILES_OR_SYSTEMS: src/frontend/src/utils/progressPersist.ts; WorldExploration hydrate/heal; deathPenalty.ts; dokaPersist.ts
CURRENT_BEHAVIOUR: Credit paths keep an unconfirmed or lagging lock; a later absolute write uses a stale or cut snapshot. 14 titled wipe drafts this week (portal/victory/GameKey/feat/death-cut variants). None merged.
DESIRED_BEHAVIOUR: One scheduler: credits commit or keep; absolute writes cannot go below max(lock, pending keep, unpaid-death floor). No new skip predicate per race.
EVIDENCE: Unique subjects matching `skip saveBattleStats wipe`; #698 body (death-cut keep + stale fetch); 10 branch touches on progressPersist.ts.
RECOMMENDED_ACTION: Design the single rule on a frozen branch; port tests from the skip suites; wire WX; close the other 13 wipe PRs as subsumed.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: high
VALIDATION_REQUIRED: Node tests for keep+heal, death-cut+keep, GameKey+hydrate; plus a live recap-heal after a shrine credit.
STATUS: OPEN

ACTION_ID: WH-MAP-SOLVABILITY
TITLE: Generated-fight occupancy still seals exits; patches are per-scenario and often unwired
CATEGORY: procedural-softlock
PRIORITY: P0
CONFIDENCE: 0.86
FILES_OR_SYSTEMS: src/frontend/src/engine/mapGen.ts; occupancy.ts; WorldExploration swap/destack/wander
CURRENT_BEHAVIOUR: Destack, wander, corpses, knockback, and player↔enemy swap can park a unit on the last player→exit route. New helpers this week (dump floor 2, choke snap, 2+2 joint, knockback, swap) duplicate flood/snap instead of one post-mutate pass.
DESIRED_BEHAVIOUR: After every occupancy mutation, non-player units are on the fight-graph flood from the player; leftover islands are refused.
EVIDENCE: ~20 occupancy/destack unique fixes; #697 unique-bridge unseal not called; mapGen.ts 13 branch touches.
RECOMMENDED_ACTION: One `unsealProgressionOccupants` used by swap, knockback, destack, wander, corpse relocate. Merge tests; delete scenario-only duplicates.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: high
VALIDATION_REQUIRED: Existing 256-seed corridor suites plus a live unique-bridge swap and rest-exit destack.
STATUS: OPEN

ACTION_ID: WH-CAST-PREVIEW-PARITY
TITLE: Walk/cast highlight still disagrees with execute
CATEGORY: combat-rules
PRIORITY: P1
CONFIDENCE: 0.85
FILES_OR_SYSTEMS: WorldExploration.tsx; spellEngine.ts; targeting.ts; battleWalkReachable.ts (draft)
CURRENT_BEHAVIOUR: Highlight can show occupied dests, wrong hover MP (Manhattan vs BFS), Trap/Mark/heal CHC that execute rejects or ignores. Share-gate PRs avoid the live file.
DESIRED_BEHAVIOUR: Paint and click use the same predicate and cost function.
EVIDENCE: ~16 `fix(combat): share … execute` subjects; #701 body; targeting.ts / spellEngine.ts branch touches.
RECOMMENDED_ACTION: After persist/map slice, land one reachability module and replace both highlight and execute call sites.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: high
VALIDATION_REQUIRED: Parity tests already on branches; live Frozen walk hover MP equals debit; occupied dest not highlighted.
STATUS: OPEN

ACTION_ID: WH-WX-MONOLITH
TITLE: WorldExploration remains a 19k-line god file and the reason sidecars stay dead
CATEGORY: architecture
PRIORITY: P1
CONFIDENCE: 1.0
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: 19,213 lines on main. 84 all-ref touches this week. Agents patch around it.
DESIRED_BEHAVIOUR: Combat, persist, and occupancy live behind imported modules that WX only calls. Extract only after the PR storm is halted.
EVIDENCE: `wc -l` 19213; git name-only frequency 84 this week.
RECOMMENDED_ACTION: This week: halt + wire. Next extract: persist enqueue, occupancy unseal, walk flood — not a big-bang split during 380 open PRs.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: high
VALIDATION_REQUIRED: Line count down with call sites; import gate + play smoke.
STATUS: OPEN

ACTION_ID: WH-FLOCK-DOCS-WAVE
TITLE: 178 open docs PRs restating design waves without telemetry or implementation
CATEGORY: process
PRIORITY: P1
CONFIDENCE: 1.0
FILES_OR_SYSTEMS: docs/automation/*; docs/design/*; docs/encounters/*
CURRENT_BEHAVIOUR: Unique docs subjects this week: 198. Open docs PRs: 178. Daily wave-N boss/spell/encounter/telemetry-waiting catalogs from 2026-09-21 through 2026-09-27.
DESIRED_BEHAVIOUR: One living design doc per topic, updated in place. Daily wave PRs closed as superseded. No gameplay from catalogs until freeze + telemetry.
EVIDENCE: `gh pr list` prefix docs=178; titles “Wave 4” … “Wave 11”, WAITING_FOR_TELEMETRY.
RECOMMENDED_ACTION: Bulk-close or mark superseded docs drafts older than the latest date per topic. Pause expansion/design crons or make them issue comments, not PRs.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: low
VALIDATION_REQUIRED: Docs open-PR count drops; MASTER_ROADMAP remains the single director file.
STATUS: NEW

ACTION_ID: WH-OPEN-PR-COLLISION
TITLE: Oldest-first queue of 380 overlapping drafts cannot merge into a coherent game
CATEGORY: process
PRIORITY: P0
CONFIDENCE: 1.0
FILES_OR_SYSTEMS: scripts/open-pr-stack-compat.sh; .github/workflows/caffeine-import-gate.yml
CURRENT_BEHAVIOUR: Stack-compat is working as designed and producing sidecars. Queue length 380 makes “next item” simulation the product.
DESIRED_BEHAVIOUR: Queue short enough that a player-facing PR can edit WorldExploration and still merge.
EVIDENCE: W35 had 11 open PRs; W39 has 380; 2 leftovers from 2026-09-02 never merged.
RECOMMENDED_ACTION: Human close-by-automation or close-by-age. Keep stack-compat, but stop feeding it 40 agents/day.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: low
VALIDATION_REQUIRED: Open PRs targeting main under ~20; a WX-touching persist PR merges.
STATUS: OPEN

ACTION_ID: WH-TEST-CI-ABSENCE
TITLE: 94 unit tests on main never run in GitHub Actions
CATEGORY: quality-gates
PRIORITY: P1
CONFIDENCE: 1.0
FILES_OR_SYSTEMS: src/frontend/package.json; package.json; .github/workflows/caffeine-import-gate.yml
CURRENT_BEHAVIOUR: Tests use `node:test`. No `pnpm test` script. Import-gate CI runs typecheck, Biome, vite build, mops, stack-compat — not the test runner. Branch tests therefore cannot protect main.
DESIRED_BEHAVIOUR: `pnpm test` (or frontend equivalent) runs `node --experimental-strip-types --test` on `src/frontend/src/**/*.test.ts` in CI on PRs and main.
EVIDENCE: frontend package.json scripts have no test key; caffeine-import-gate.yml jobs; 94 test files on main; 18 test commits this week only on branches.
RECOMMENDED_ACTION: Add a test script and a CI job. Do not require PocketIC.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: low
VALIDATION_REQUIRED: CI job green on main; a failing fixture fails the job.
STATUS: OPEN

ACTION_ID: WH-COMBATANT-STORE-SPLIT-WRITE
TITLE: Hazard and other HP paths still write React character stats beside the combatant store
CATEGORY: combat-rules
PRIORITY: P1
CONFIDENCE: 0.78
FILES_OR_SYSTEMS: WorldExploration.tsx; engine/combatantStore.ts; engine/battleSetup.ts
CURRENT_BEHAVIOUR: `updateCombatant` exists, but thorn/rift walk still `setCharacterStats` HP (WX ~9916–9926). Dual writes were the W35 victory-skip class.
DESIRED_BEHAVIOUR: All combatant HP commits through `updateCombatant`; React roster is a projection.
EVIDENCE: Grep `setCharacterStats` in WorldExploration (many hits); applyBattleWalkHazards still local HP.
RECOMMENDED_ACTION: After halt, route hazard HP through the store (same as lava/spikes policy in AGENTS.md).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: high
VALIDATION_REQUIRED: Thorn walk updates store HP; victory does not fire after lethal tick.
STATUS: OPEN

ACTION_ID: WH-ACHIEVEMENT-CLIENT-UNLOCK
TITLE: Combat feat unlock remains a client assertion
CATEGORY: backend-contract
PRIORITY: P1
CONFIDENCE: 0.9
FILES_OR_SYSTEMS: src/backend/main.mo (markAchievementUnlocked ~2462)
CURRENT_BEHAVIOUR: Official client marks feats when it believes the condition held. Wallet/level checks exist for some ids; combat feats are still asserted.
DESIRED_BEHAVIOUR: Product choice: server-side evidence, or documented client trust with claim caps already in place.
EVIDENCE: `main.mo` 2460–2462; W35 ledger; security draft #368 lists it as HIGH leftover (not auto-fixed).
RECOMMENDED_ACTION: Human product decision. Do not silently change claim economics in an automation.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: high
VALIDATION_REQUIRED: If server-side: unauthorized client cannot unlock a combat feat. If accepted: written ADR.
STATUS: OPEN

ACTION_ID: WH-BOOST-TOGGLE-DEAD
TITLE: Boost control does not change live XP math
CATEGORY: progression
PRIORITY: P2
CONFIDENCE: 0.84
FILES_OR_SYSTEMS: App.tsx; GameFlow.tsx; WorldExploration.tsx ~2098, 12374–12376
CURRENT_BEHAVIOUR: App holds boostMode and passes it to GameFlow as `_boostMode` (unused). WX has its own `boostMode` default `"xp"` and `_setBoostMode` unused, so victory XP always uses ×1.5.
DESIRED_BEHAVIOUR: The visible control changes the multiplier, or the control is removed and copy says XP is always boosted.
EVIDENCE: Grep boostMode; WX 12375 `boostMode === "xp" ? … * 1.5`.
RECOMMENDED_ACTION: Wire one state from App into WX, or delete the dead toggle and the 1.5 branch.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: medium
VALIDATION_REQUIRED: Toggle rewards vs xp changes recap XP, or toggle is gone and math is documented.
STATUS: OPEN

ACTION_ID: WH-DFX-STALE-BACKEND
TITLE: dfx.json still points at the missing extended actor
CATEGORY: backend-contract
PRIORITY: P2
CONFIDENCE: 1.0
FILES_OR_SYSTEMS: dfx.json
CURRENT_BEHAVIOUR: `"main": "src/backend_extended/main.mo"` while the canonical actor is `src/backend/main.mo`. Local dfx deploy is the wrong game.
DESIRED_BEHAVIOUR: dfx.json matches the Caffeine/mops actor, or dfx is documented as unsupported.
EVIDENCE: dfx.json lines 3–6; AGENTS.md.
RECOMMENDED_ACTION: Point dfx at src/backend/main.mo or remove the misleading canister entry.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: medium (local dfx users only)
VALIDATION_REQUIRED: `dfx.json` path exists; docs match.
STATUS: OPEN

ACTION_ID: WH-VICTORY-PATH-FRAGILITY
TITLE: Victory and Flee still race the last hostile / last HP
CATEGORY: combat-rules
PRIORITY: P1
CONFIDENCE: 0.8
FILES_OR_SYSTEMS: WorldExploration.tsx; battleSetup.victory.test.ts (draft #652); fleeAfterLastHostile.test.ts (draft #629)
CURRENT_BEHAVIOUR: Drafts claim victory can fire at 0 live HP on the killing blow and Flee remains after the last hostile.
DESIRED_BEHAVIOUR: No recap credit if the player is dead on the blow; Flee disabled once no hostiles remain.
EVIDENCE: Open #652, #629; W35 victory cluster.
RECOMMENDED_ACTION: Merge one victory-lock PR that is wired in WX, with tests on CI.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: high
VALIDATION_REQUIRED: Lethal last hit → death realm, not recap; Flee hidden after last kill.
STATUS: OPEN

ACTION_ID: WH-SUMMON-LIFECYCLE
TITLE: Summon kit, buffs, and turn-advance still patched as one-off combat bugs
CATEGORY: combat-rules
PRIORITY: P1
CONFIDENCE: 0.82
FILES_OR_SYSTEMS: summonExecutor.ts; WorldExploration summon paths; kit metadata
CURRENT_BEHAVIOUR: This week: copy Shield/Slow/Poison on auto-summon casts (#700); ally Enrage on summon damage (#699); gate 0-AP auto-end / deferred advanceTurn after last hostile (#685). Same hotspot as W35 summon PRs.
DESIRED_BEHAVIOUR: One summon cast pipeline (kit status, outgoing modifiers, turn ownership) used by player, AI, and auto-summon.
EVIDENCE: Open #699 #700 #685; summonExecutor.ts 5 branch touches.
RECOMMENDED_ACTION: After preview/execute unification, fold kit apply + outgoing dmg + turn gate into summonExecutor and call it from one WX site.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: high
VALIDATION_REQUIRED: Auto-summon applies advertised status; Enrage affects summon hits; last-hostile does not skip the player with 0 AP incorrectly.
STATUS: OPEN

ACTION_ID: WH-CLIENT-ECONOMY-AUTHORITY
TITLE: Official clamps landed; remaining economy authority is feats + repeat grants
CATEGORY: persist-economy
PRIORITY: P1
CONFIDENCE: 0.8
FILES_OR_SYSTEMS: src/backend/main.mo applyRewards / saveBattleStats / markAchievementUnlocked
CURRENT_BEHAVIOUR: createCharacter starter caps and saveBattleStats ignore-raise are on main (W36). Combat feat unlock and per-battle nonce are not.
DESIRED_BEHAVIOUR: Documented trust boundary. No silent re-open of clamped writes.
EVIDENCE: `_starterStatsRejected`; AGENTS.md clamps; #368 HIGH leftovers.
RECOMMENDED_ACTION: Keep clamps. Pair with WH-ACHIEVEMENT-CLIENT-UNLOCK product decision. Do not add more client spend gates without tests in CI.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: n/a
VALIDATION_REQUIRED: none this week
STATUS: OPEN

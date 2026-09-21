# Stralt Master Roadmap

**Director:** Stralt Master Technical Director (`0b92479e-a49e-11f1-a7d1-d6b4613131ce`)  
**Run:** 2026-09-21 00:01 UTC (daily cron; first director run since 2026-09-02)  
**This agent:** `bc-0f5c19f1-d985-4d12-a388-d14eb6fe8935`  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (accepted-challenge HUD)  
**Prior director HEAD:** `58302bc` (#258 GameKey) at 2026-09-02 00:03 UTC  
**Gameplay / production code:** not modified.

This file is the living prioritized roadmap. ACTION_ID records for this run live in [`ACTION_IDS_2026-09-21.md`](./ACTION_IDS_2026-09-21.md). Prior director ledger: [`ACTION_IDS_2026-09-02.md`](./ACTION_IDS_2026-09-02.md). Do **not** append to `ACTION_IDS_2026-08-31.md` or `ACTION_IDS_2026-09-01.md`. Process audit: [`QUALITY_AUDIT_2026-08-30.md`](./QUALITY_AUDIT_2026-08-30.md).

## Evidence available this run

| Source | Status |
| :--- | :--- |
| `AGENTS.md`, `README.md`, `DESIGN.md`, `docs/ARCHITECTURE.md` | Read |
| Prior director roadmap (2026-09-02 00:03) | Read. P0 leftover #259 **merged**. Flock-halt **failed in the first 30 hours**, then `main` went silent for **18 days**. |
| Specialist reports dated 2026-09-02 | Expansion, PX, long-horizon, telemetry balance/architecture/dashboard, spell admin, discovery, enemy/boss admin, world-encounter, visual assets, mechanic matrix, game feel, UX, admin UX/drift, dead-code, data-evolution, performance, enemy AI/elites/formations. **No 09-03…09-21 specialist reports in-repo** except orchestrator [`ACTION_IDS_2026-09-03-0000.md`](./ACTION_IDS_2026-09-03-0000.md). |
| Open ACTION_IDs | Hundreds still `NEW` across dated producer files. Reuse; do not mint twins. |
| Recent commits | `git log` `58302bc` → `0f5363f` (**158** commits / ~70 merge PRs on 2026-09-02…03). **Zero** commits 2026-09-03 00:28 UTC → 2026-09-21. |
| Open drafts | **#327** Striker AoE/bounce (P1). **#331** mapGen portal-punch (HOLD). During this run the 00:00 flock already opened **#333** (TBC WAITING docs — OK), **#334** (AdminDashboard — HOLD), **#335** (a11y — HOLD). |
| Player telemetry | **Still none.** `longHorizonSim.telemetry.available === false`. TBC stays `WAITING_FOR_TELEMETRY`. Zero collectors in `src/backend`. |
| Same-hour flock (this minute) | **26** automations already RUNNING at 00:01 UTC 2026-09-21 (combat parity, persist, adversarial QA, security, critical defects `1aa41c6c` still enabled, admin ×2, AI, formations, spell mechanics, expansion-adjacent, telemetry **dashboard** with nothing to display). More still launching. |

**Evidence classes used below**

| Class | Meaning |
| :--- | :--- |
| MEASURED PLAYER BEHAVIOUR | Live play counters. **None exist.** |
| DESIGN INTERPRETATION | Product rules in this prompt + `AGENTS.md` / `DESIGN.md` / specialist design docs |
| ENGINEERING EVIDENCE | Code on `0f5363f`, tests, PR history, automation volume, Caffeine `.old` still the 2026-08-31 no-GameKey signature |

Telemetry is not allowed to set priority. Correlation is not causation. No CLEAR_POSITIVE_SIGNAL is claimed.

---

## What changed since the 09-02 director run (do not rediscover)

The 09-02 run asked: halt the flock; merge #259; write the reward-trust ADR; re-freeze WX / mapGen / targeting.

**Integrity that landed (accept `main`; do not re-open):**

| Theme | Landed as |
| :--- | :--- |
| EOP GameKey later file | **#259** then **#311** (wrong `.old`) then **#324** (`.old` = Caffeine’s real Aug-31 signature; GameKey on frozen `20260901_000000`, `OldActor = {}`). Chain files: `20260801` genesis, `20260803_185500` no-op, `20260827`, **frozen** `20260831` (no GameKey), **frozen** `20260901` (GameKey). `check-limit = 5`. |
| Frozen/Slime player execute MP | **#313** — `battleWalkMpCost` (`engine/battleWalkMp.ts`) on execute, not preview-only |
| Frozen AI / summon-AI walk MP | **#318** — `engine/enemyWalkMp.ts` |
| Barrier-aware battle A* | `findPath` now calls `isBattleWalkTileBlocked` with `barrierTilesRef` (`WX` 4526–4536; `walkRejectCopy.ts` 21–34) |
| Overworld spawn policy extract | **#287** — `engine/spawnPolicy.ts` (controlled extraction; leave it) |
| Attack Nearest caster tile + 0-AP | **#326** |
| Life Drain fails no-heal | **#315** |
| Combat preview === execute gates | **#314** / **#304** |
| One-shot Doka keep vs unseeded lock | **#312 / #317 / #323 / #330** |
| Boss Rush room-clear victory feats | **#319** |
| Accepted-challenge HUD after first action | **#332** (closes PXA-2026-09-02-002) |
| Enemy Register flavor lore | **#328** |
| AP/MP cap on `saveBattleStats` | **#322** |
| Buy Doka how-to / email-before-QR | **#316** |
| Caffeine import + stack-compat + EOP snapshot gate | Already on `main`; #324 is the populated-signature half |

**09-02 leftovers that are DONE:** MTD-2026-09-02-002 (source chain), MIMA-2026-09-01-001 (player Frozen execute), MIMA-2026-09-02-001 (Frozen AI reach), PXA-2026-09-02-002 (challenge HUD), spawnPolicy extract.

**09-02 leftovers that are NOT done:**

| ID | Why still open |
| :--- | :--- |
| MTD-2026-08-31-001 / AQA-001 / AQA-002 | Flock repeated. **26+** agents this hour. `996df6df` still not GetAutomation-visible. `1aa41c6c` **still enabled**. |
| MTD-2026-09-02-002 deploy half | Source chain is correct. Repo `.old` is still `caffeine-aug31-import-tail-20260831-no-gamekey.most`. No in-repo proof Caffeine imported/deployed after #324. |
| AQA-008 | Clamps **and** ignore-client level exist. **No written ADR** (`docs/**/*ADR*` = 0). |
| AQA-006 | mapGen 1,544 → **1,937**. Three more punches (#321 / #329 / leftover islands). Draft **#331** wants a fourth. |
| AQA-007 | **29** WX commits since `58302bc`; 227 since 2026-08-24. File 19,253 → **19,213**. Freeze still broken. |
| MIMA-001 | Swap (`WX` 9389–9401) still copies coordinates; no `applyHazardLanding` (helper **does not exist**). |
| MIMA-002 remainder | Occupancy dest yes; **no** lava/spike landing on summon walk / destack / unseal. `isCellFree` has no hazard axis (`occupancy.ts` 1–16). |
| MIMA-2026-09-01-002 remainder | Barriers **yes**. Occupants **no**. `isBattleWalkTileBlocked` does not take combatants. |
| MIMA-2026-09-02-003 | `redeemGameKeyThroughPersist` (`shopPurchase.ts` 294–331) still commits raw canister Doka; no `applyUnpaidDeathPenaltyToWrite`. |
| MTD-2026-08-31-003 | HP/death still dual-written. Do not start a large extract this hour. |
| EXPANSION-PREREQ-A | `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` still passes a LevelZone **object** (`WX` 11920). `setCurrentZoneTier(playerTier + 1)` already computes a number (`WX` 4678–4680) and is unused at kit assignment. |
| SDA-002 / 004 | `shouldIncludeBackendSpellInLibrary` still returns true whenever `usableByPlayer !== false` (`adminSafety.ts` 717). Catalog still hydrates into every book. |
| AQA-012 / TBC-* | Still no counters. Dashboard specialist running with nothing to display. |
| MTD-005…008 | `useSaveKillCount` has no UI caller; admin DVA not a canister workflow; 30% random AI tier unchanged (`combatMath.ts` 34–50). |

**Calendar fact this run (not in 09-02 ledger):**

`main` received a 30-hour merge burst (09-02 00:00 → 09-03 00:28), then **eighteen days of zero merges**. That silence is the only flock-halt that worked — and it was human inactivity, not a dashboard change. Today’s midnight cron restarts the same 40-automation pile-on against a two-draft queue.

---

## Seven-dimension evaluation

### 1. Correctness — official client much safer; landing + kits still lie

ENGINEERING: Death replay, live Doka refs, ignore-client level, Frozen execute/AI MP, barrier A*, GameKey replacing 60s auto-complete, and the later-file EOP chain closed the 09-01/09-02 persist+MP cluster for the official client. Do not open a fourth persist rewrite.

Recurring defect class: **teleport landing.** Swap still skips occupancy and hazards (MIMA-001). Destack / unseal / controlled-summon walk still treat lava as ordinary floor. Local Attack-Nearest / LoS patches are no longer the bottleneck — **landing authority** still is. Recommend one `applyHazardLanding` helper (not a WX rewrite). Do **not** start it in this hour’s flock.

Recurring defect class: **kit zone NaN.** Piece kits exist and grow at zone 1/2. Battle start still passes a LevelZone **object**. `Math.floor(object)` is `NaN` → zone-0 kits forever. A number is already sitting in `currentZoneTier`. This is the cheapest unlock of “dynamic enemy spell pools” and it has survived **three** director cycles.

Recurring defect class: **mapGen portal punch vs battle graph.** #110 → leftover islands → destack → relocate hostiles → punch adjacent floor → now #331 wants to skip punches that join the far room. Local patches are no longer sufficient. Controlled intervention = one battle-graph/portal-punch policy helper + fixtures. Do **not** auto-refactor. Hold #331 and further punches until a human playtests the #321/#329 sequence.

Recurring defect class: **EOP stables.** Stuffing maps into a frozen `NewActor` was closed in source (#324). The remaining hole is **deploy confirmation**: `.old` has not been refreshed, so either Caffeine never imported HEAD or the process step “refresh `.old` after a successful deploy” was skipped.

### 2. Player experience — honesty up, identity still incomplete

ENGINEERING: Challenge HUD after accept (#332), Enemy Register lore (#328), Buy Doka how-to (#316), leftover XP HUD, recap feats, Pacifist preview. Those were unique; do not re-implement.

DESIGN (PXA + Expansion + Spell Admin, no player data): the player is still handed the live catalog on minute one. Enemy-observed discovery is **not implemented**. Achievement/challenge/boss rewards remain Doka/XP, not spells. Four map modifiers are announce-only stubs. Family HP multipliers still die at battle start (`calcEnemyMaxHp` is level-linear only, `WX` 3607–3614). Paper Windstorm still has two live rates (announce “reach halved”; player 30%; enemy 50% when `range > 1`) — RAO-2026-09-03-0000-003, HUMAN.

GameKey is a real PX/ops change. Source and Caffeine previous-version check now agree. Live canister deploy is **unconfirmed**.

MEASURED: none. Do not claim spells are over/underused.

### 3. Technical health — hotspot + ledger + unconfirmed deploy

| Surface | Lines now | 09-02 director | Verdict |
| :--- | ---: | ---: | :--- |
| `WorldExploration.tsx` | 19,213 | 19,253 | 29 commits; freeze still broken |
| `AdminDashboard.tsx` | 8,280 | 8,035 | Grew (GameKey tab). No publish pipeline |
| `enemyAI.ts` | 2,580 | 2,583 | Frozen size; do not grow tonight |
| `main.mo` | 3,903 | 3,838 | GameKey + clamps; chain correct in source |
| `mapGen.ts` | 1,937 | 1,544 | Freeze badly broken; +393 lines |
| `progressPersist.ts` | 421 | 323 | Grew with one-shot/unseeded keep. Leave it |
| `targeting.ts` | 1,199 | 1,031 | Leave it |
| `deathPenalty.ts` | 597 | 597 | Leave it |
| `spawnPolicy.ts` | extracted | — | Leave it |

Caffeine import gates plus stack-compat plus populated EOP snapshots are process wins that should stay. `ARCHITECTURE.md` still says `check-limit = 4` (live `mops.toml` is 5) — docs drift, not a live bug.

Stale paths remain documented, not live bugs: `dfx.json` → missing `src/backend_extended`; root `declarations/` 15-field snapshot; unused `src/backend/mixins/*`.

### 4. Content depth — over-specified, under-wired

Present on `main`: player-relative tier spawn, AI tiers 1–10, named boss kits, dungeon chain, Boss Rush (10 rooms), 9 challenges, feats, frontend catalog + GameKey shop.

Dead or contradictory vs core rules (DESIGN + ENGINEERING):

- `buildEnemyKit(..., currentMap.levelZone)` still passes an **object** → zone-0 kits forever.
- Summoner chance `0.12 + playerLevel * 0.02` saturates by the mid-40s.
- `pickEnemyLevelFromTiers` `maxTier = floor(999 / tierSize)` stops climbing.
- `computeAITier` still has a **30% fully random 1–10** roll (`combatMath.ts` 48–50).
- Dual spell catalogs (frontend starters vs canister). Admin adding a catalog spell still grants it to every player on hydrate (SDA-002).
- `worldFeatures.ts` still tests-only; no WX import.
- `ENEMY_AI_TIER_GATES` names still unused in `enemyAI.ts` (comment at 1422).
- `combinedMechanic` (Boss Rush pairs) still unused.

Design specialists produced overlapping catalogs on 08-31 / 09-01 / 09-02 (SDA, SDE, SPELL_DISCOVERY, EBA, ENEMY_AI, FORMATIONS, ELITE, WORLD_DYNAMICS, ENCOUNTER, VISUAL, SPELL_PROPOSALS). That is **expansion overlap**, not a license to implement. Tonight’s wave includes spell mechanics, AI, formations, world content, discovery admin — default **hold**.

### 5. Long-term scalability — rules vs implementation

| Core rule | Implementation on `0f5363f` |
| :--- | :--- |
| No character level cap | Yes (`applyRewards` Nat loop). HUD saturates at 48 (`LHIPS-2026-09-01-001`). |
| Increasing XP | Yes `100 * 2^(N-1)`. Practical wall ~level 15–22 on kill XP (DESIGN, not a bug to “fix” tonight). |
| Player-relative enemies | Yes until the 999-tier ceiling (PREREQ-B). |
| Progressively sophisticated enemies | Partial; 30% random tier + zone-0 kits undermine it. |
| Dynamic enemy spell pools | Boss phases yes; overworld = static piece kits stuck at zone 0. |
| Enemy-observed spell discovery | **Absent** |
| Achievement / challenge / boss spell unlocks | Rewards are Doka/XP |
| Backend-authoritative persistence | Wallet/XP/death yes (clamped; level pinned). Combat client-side. Achievement unlock still client-asserted. BuffShop potions still `${principal}_inventory`. GameKey redeem is canister-authoritative **in source**; live deploy unconfirmed. |
| Optional owner-uploaded visuals + pixel fallback | Still true. Do not make URLs required. |
| Admin Draft → Validate → Activate | **Not a canister workflow.** Local React drafts + retire-via-`usableByPlayer` remain. |

Expansion that adds spells, AI behaviors, or admin chrome **before** Caffeine deploy confirmation, landing-authority extraction, and a reward-trust ADR will not scale.

### 6. Data / persistence safety — official client safer; deploy is the remaining P0

`saveBattleStats` may still **lower** Doka/XP (required for heals/spends/death). It must not raise them — that write is on `main`. Finding 3 is still stale if phrased as “must not write Doka.” Client level can no longer demote. AP/MP now capped (#322).

`applyRewards` is still client-trusted **within** 100k/500k. Custom clients can still drip-mint. `calculateAndAwardDoka` remains an unused public mint. `markAchievementUnlocked` is still unproven.

Wallet seeding / idle-hydrate / unpaid death replay / one-shot keep remain load-bearing. Do not invent a second persist path for telemetry or discovery grants. `redeemGameKeyThroughPersist` already uses the lock — leave that shape; add unpaid-death honour as a helper, not a new lock.

New stables still require a **new later** file after `20260901`. Never amend `20260831` / `20260901` `NewActor`.

### 7. Automation coherence — P0, fourth midnight; 18-day freeze then restart

AQA-001…012 were written 08-30 19:00. The 08-31, 09-01, and 09-02 00:00 waves ignored them. Humans then merged almost every draft through 09-03 00:28. Orchestrators correctly said “hold dirty persist/targeting/mapGen” and were overridden.

Then `main` froze for 18 days. No director PR, no specialist report dated after 09-03, two leftover drafts. That is the closest the ecosystem has come to “P0/P1 first.”

This 00:00 UTC window already launched **26** automations — including Combat Rules Consistency, Adversarial QA, Security, Persist auditor, critical defects, admin implementers, expansion, AI, formations, spell mechanics, and a telemetry **dashboard**.

That is exactly “P2/P3 expansion displacing unresolved P0/P1,” restarted after a lucky freeze.

| AQA / MTD ID | Director status 2026-09-21 |
| :--- | :--- |
| AQA-001 hunter throttle | **OPEN** — `996df6df` still not GetAutomation-visible. |
| AQA-002 one critical hunter | **OPEN** — `1aa41c6c` enabled (confirmed this run). |
| AQA-003 in-repo ACTION_ID ledger | **PARTIAL** — 09-02 director file stayed clean; 09-01 remains concatenated. Keep dated producer files. |
| AQA-004 don’t merge the 08-30 stack | **SUPERSEDED** — accept `main`. |
| AQA-005 test clone mill | **PARTIAL** — #173 / #312 / #325 stacked; test mill in tonight’s flock. |
| AQA-006 no mapGen implementation | **BROKEN** — 1,544 → 1,937; #331 open. |
| AQA-007 freeze drive-by WX | **BROKEN** — 29 commits since last director; 227 since 08-24. |
| AQA-008 security → ADR | **PARTIAL** — clamps + ignore-client level + AP/MP cap on `main`; no ADR. Security running again tonight. |
| AQA-009 orchestrator must not implement gameplay | **PARTIAL** — 09-03 orchestrator shipped unique HUD (#332). Acceptable. |
| AQA-010 persist/economy dedup | **PARTIAL** — cluster landed; do not open a fourth persist PR. Persist + economy hunters running tonight. |
| AQA-011 prompts vs live architecture | **OPEN** |
| AQA-012 outcome telemetry | **OPEN** — dashboard specialist running with nothing to display. |
| MTD-001 flock halt | **OPEN** — failed 08-31, 09-01, 09-02; 18-day silence then failing 09-21. |
| MTD-2026-09-21-002 | **NEW** — confirm Caffeine deploy + refresh `.old`. |

Cursor Cloud has **no write API** for dashboard prompts (`get-automation` is read-only). Halt is a human config action. In-repo gates are the enforceable half.

---

## Recurring hotspots — local patches no longer sufficient

Do **not** automatically perform a large refactor.

1. **EOP / frozen NewActor** — source chain is correct. Remaining work is **ops**: confirm Caffeine import of HEAD, then refresh `.old` + add `snapshots/deployed/` from that build. Stop stuffing fields into `20260831` / `20260901`.
2. **Landing / occupancy / hazard authority** — Swap + summon-walk hazards + destack/unseal need **`applyHazardLanding`**, not more WX branches. Occupancy dest for summons already exists. One helper PR; one-line WX wiring. After flock halt.
3. **Kit-zone number** (PREREQ-A) — not a refactor. Pass `currentZoneTier` (already a number at `WX` 4678–4680) into `buildEnemyKit`. Unblocks dynamic pools. Wait until this hour’s flock is held.
4. **mapGen portal-punch vs battle graph** — #94/#97/#110/#168/#246/#302/#321/#329/#331. Recommend a single policy helper (`shouldPunchPortalNeighbor` / stay-on battle component) + seed fixtures. Hold further punches. Do not rewrite `mapGen.ts` tonight.
5. **Canister trust** — write the ADR (AQA-008). Clamps, ignore-client level, and AP/MP cap already match de-facto (a). Until the ADR exists, no new credit APIs and no discovery grant writer.
6. **Automation flock** — one critical hunter, report-only specialists on cron restart, no same-hour implementer pile-on after a merge burst **or** after an 18-day freeze. **This is still the binding constraint.**

HP/death extraction (MTD-003) is still valid. Do not start it in the same hour as the flock.

---

## Human merge queue (do not autonmerge)

| Order | PR | Action |
| :--- | :--- | :--- |
| 1 | **#327** | Unique P1: Striker legendary_3 pays on AoE/bounce Chebyshev > 2. Oldest open. **Restack onto current `main`** (unioned #315–#326; those have merged; 18 days stale). Then review/merge. |
| 2 | **#333** | TBC WAITING_FOR_TELEMETRY docs. Unique, aligned with AQA-012. OK after #327 if files do not rewrite BAL-*. |
| 3 | **#331** | **Hold.** mapGen portal-punch. AQA-006. Recurring hotspot. Needs human playtest of #321/#329 first. |
| — | **#334** | **Hold.** AdminDashboard (`save live 95% tier default`). AQA freeze + MTD-004. |
| — | **#335** | **Hold this hour.** Unique a11y (Escape / 44px / named buttons). P3. Do not merge ahead of #327. |
| — | Any later PR from the 09-21 00:00 wave | Default **hold**. Especially hold mapGen, targeting, persist, `enemyAI`, AdminDashboard, `main.mo` stables, telemetry UI, WX drive-bys. |
| — | Motoko PRs that add persistent `let`/`var` | **Hold until Caffeine deploy of the 20260901 tail is confirmed** and `.old` refreshed. Then: new later file; never amend frozen NewActors. |
| — | Docs-only from this hour | OK if they do not rewrite SDA/SDE/EBA schemas, retune BAL-*, or concatenate into 08-31 / 09-01 / 09-02 director files. |

Do not restack death-replay, `writeLiveDoka`, `writeLevel`, leftover-XP HUD, Frozen MP helpers, spawnPolicy, GameKey product code, or the EOP chain.

---

## Prioritized roadmap (what to work next)

**P0 — do these before any expansion PR merges**

1. Halt the 09-21 same-hour implementer flock (MTD-2026-08-31-001, MTD-2026-09-21-001).
2. Confirm Caffeine GitHub→import of current HEAD and refresh `.old` + `snapshots/deployed/` from that build (MTD-2026-09-21-002). Freeze new Motoko stables until that lands.
3. Write the reward-trust ADR (AQA-008). Finding 3 = unbounded/absolute misuse, not “Doka write is a bug.”
4. Restack and merge leftover **#327** (Striker AoE) — unique P1 that sat 18 days (MTD-2026-09-21-003).

**P1 — infrastructure / gameplay integrity**

5. Re-freeze `mapGen.ts`, `targeting.ts`, `enemyAI.ts`, and WX drive-bys (AQA-006, AQA-007). Hold #331. Solvability Guardian = fixtures + ACTION_IDs only.
6. Extract `applyHazardLanding` for Swap + controlled-summon walk + destack (MIMA-001 + MIMA-002 remainder + MIMA-2026-09-02-002). Occupancy helper already exists — do not rewrite it.
7. Honour unpaid death 20/40 on GameKey redeem (MIMA-2026-09-02-003). Helper on the existing lock; do not new persist path.
8. Battle `findPath` occupants (MIMA-2026-09-01-002 remainder). Barriers already share `isBattleWalkTileBlocked`.
9. Controlled HP/death extraction (MTD-2026-08-31-003) **after** landing helpers — not tonight.

**P2 — high-value expansion (after P0/P1, not this hour)**

10. Outcome counters, then maybe a dashboard (AQA-012 before TADD UI).
11. Fix kit-zone call site (Expansion PREREQ-A) — pass `currentZoneTier` **number**. This unblocks dynamic pools without a new AI rewrite.
12. Enemy-observed spell discovery + ownership maps (SDA-002/003/004). Requires persist lock + metadata; never `spell.name`. Requires a **new later** migration after deploy confirmation, not a stuffed NewActor.
13. Admin Draft → Validate → Activate on the canister (SDA-005 / MTD-006). Do not grow the 8.3k dashboard first.
14. Seed frontend starter ids; stop treating `usableByPlayer` as ownership (SDA-007).
15. Revisit `computeAITier` 30% random vs progressive sophistication (MTD-008). Report/design, not an `enemyAI.ts` rewrite.
16. Wire `saveKillCount` or drop it from the leaderboard (MTD-005).
17. BuffShop `buffInventories` vs `${principal}_inventory` (SDEG-005) — after persist quiet.
18. Unify Paper Windstorm to one rate (RAO-2026-09-03-0000-003) — HUMAN; changes fight outcomes.

**P3 — polish**

19. Recap / HUD leftovers already shipped — do not restack. Feats-vs-Achievements copy (RAO-2026-09-03-0000-002) is display-only when WX is quiet.
20. Visual / game-feel / mobile — DESIGN.md already specifies the look. Do not edit combat math or WX for feel this hour.
21. Dead-code / maintainability — report only while hunters are hot.

---

## Contradictions and duplicates (do not re-litigate)

| Conflict | Resolution |
| :--- | :--- |
| Security “don’t write Doka from `saveBattleStats`” vs ARCHITECTURE | Write stays; **clamp / no-mint**. ADR still required. |
| Solvability vs `AGENTS.md` mapGen | #110 plus later punches already merged; **freeze**; hold #331. |
| AQA-004 vs human merge of 08-30…09-03 stacks | Accept `main`; clean leftovers; do not re-open merged themes. |
| Frozen preview vs execute | Execute now uses `battleWalkMpCost`. Do not re-file 09-01-001. |
| Progressive AI vs 30% random tier | Design decision later; no first-hour AI PR. |
| SDA vs SDE vs SPELL_DISCOVERY vs EBA vs BOSS docs | One discovery persist shape (SDA-002/004). Others are content cards, not parallel schemas. |
| Expansion specialists vs “P0/P1 first” | Tonight’s wave is the violation. Hold their PRs. |
| Telemetry dashboard vs no counters | AQA-012 first. TBC stays WAITING_FOR_TELEMETRY. |
| Empty `.old` vs live Caffeine | `.old` is now the **real** Aug-31 signature (no GameKey). Import of HEAD should pass. Deploy still unconfirmed because `.old` was not refreshed after a later successful build. |
| GameKey on `main` vs canister | Source is ahead of confirmed deploy. Do not revert GameKey product. Do not add more stables. |
| `usableByPlayer=false` as retire vs enemy-only gate | SDA-2026-09-01-001; do not extend the flag. |
| Family HP paper vs `calcEnemyMaxHp` | PREREQ-H; honesty bug; not an AI rewrite. |
| 18-day freeze vs “halt failed” | Halt failed as **config**. It succeeded as **human merge stop**. Cron restart without dashboard change undoes it. |

---

## TOP 5 CURRENT PRIORITIES

1. **Halt the 09-21 00:00 implementer flock** (26+ automations, still launching). First-run and expansion specialists: ACTION_IDs only. Especially hold mapGen, persist, targeting, `enemyAI`, AdminDashboard, `main.mo` stables, telemetry UI, WX.
2. **Confirm Caffeine deploy of the 20260901 GameKey tail** and refresh `.old` from that build (MTD-2026-09-21-002). Source is ready; ops is not proven.
3. **Reward-trust ADR (AQA-008)** — clamps, ignore-client level, and AP/MP cap landed; the written decision did not. Security is running again tonight with the stale Finding 3 phrasing.
4. **Restack + merge leftover #327** (Striker AoE/bounce). Unique P1. Then **re-freeze WX / mapGen** so landing/kit-zone helpers can be one extraction each.
5. **Kit-zone number (PREREQ-A) after flock halt** — one call site, unblocks dynamic enemy spell pools. Do not ship it in this hour’s AI/expansion PRs.

## BLOCKED WORK

- Spell discovery / observed enemy kits / new unlock loops — no ownership persist, combat landing still racing, ADR unwritten, Caffeine deploy of GameKey unconfirmed.
- Enemy AI capability expansion — `enemyAI.ts` already 2,580 lines; kits never leave zone 0; HP/death still dual-written.
- Telemetry admin dashboard — no counters to display (AQA-012). Balance analyst correctly idle if it stays WAITING_FOR_TELEMETRY.
- Any Motoko PR that adds stables until deploy is confirmed and `.old` refreshed.
- Further `mapGen.ts` punches (#331 and tonight’s Guardian) without an explicit human playtest of the #321→#329 sequence.
- Custom-client mint proofs / new credit APIs until the ADR exists.
- `calculateAndAwardDoka` productization (unused official path; still a sink).
- Formula-level `BAL-*` / `LHIPS-*` retunes (no telemetry; jackpot 100k clamp is architecture).
- Admin Draft→Validate→Activate chrome on the 8.3k dashboard before canister lifecycle exists.

## SAFE EXPANSION WORK

- Restack/merge #327 (scoped Striker helper + tests). Do not duplicate it in a second economy PR.
- Adopt per-producer ledgers + this director index (AQA-003) — process, not gameplay.
- Design-only (no PR): keep SDA/SDE/EBA catalogs; do not author a fifth discovery schema.
- Query-only / persist-lock-enqueued counters (AQA-012) — **design + tiny isolated PR after flock halt**, not a dashboard.
- Kit-zone number fix (PREREQ-A) **after** the flock is held — one call site + `enemyAI` test, no WX growth.
- Display-only unique copy if orchestrator finds one hole not already on `main` (Feats vs Achievements recap copy).

## AREAS TO STOP TOUCHING TEMPORARILY

- `src/frontend/src/components/WorldExploration.tsx` except one-line helper wiring
- `src/frontend/src/engine/mapGen.ts` (including #331)
- RAF loop, turn-order math, damage formulas (`AGENTS.md`)
- `src/frontend/src/utils/progressPersist.ts` (leave the lock)
- `src/frontend/src/utils/deathPenalty.ts` (cluster closed)
- `src/frontend/src/engine/targeting.ts`
- `src/frontend/src/engine/enemyAI.ts`
- `src/frontend/src/engine/spawnPolicy.ts` (just extracted)
- `src/frontend/src/engine/battleWalkMp.ts` / `enemyWalkMp.ts` (just landed)
- `src/frontend/src/components/AdminDashboard.tsx`
- `src/backend/main.mo` persistent fields until deploy confirmation
- Frozen chain files `20260831_000000.mo` / `20260901_000000.mo`
- `docs/automation/ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md` (do not append)
- GameKey product methods except unpaid-death honour on the existing redeem helper

## ARCHITECTURAL HOTSPOTS

1. Unconfirmed Caffeine deploy vs correct-in-source EOP chain (`20260901` GameKey; `.old` still Aug-31)
2. Dual HP / death / landing authority (React snapshot vs `combatantsRef` vs Swap/summon/destack teleport)
3. Client-trusted `applyRewards` without a written ADR (clamps exist; decision does not)
4. 19k-line world orchestrator absorbing every hunter (shrank slightly, still the magnet)
5. Automation pile-on (26+ same-hour agents after an 18-day freeze)
6. mapGen portal-punch / battle-graph (nine punches; #331 wants a tenth)
7. Dual spell catalogs + implicit ownership (blocks discovery)
8. Kit-zone object call site (dynamic pools implemented and dead; number already in `currentZoneTier`)

## TELEMETRY SIGNALS WORTH INVESTIGATING

**None can be investigated in production — the series do not exist.**

When AQA-012 lands, investigate in this order (engineering + design, not telemetry-alone priority):

1. persist-ok vs persist-fail and death-penalty-applied vs victory-paid vs **single-axis-credit-then-death** (integrity; #183/#256/#330 class — measure whether the hole is closed, do not assume)
2. GameKey request vs approve vs redeem vs redeem-fail (ops; new funnel; do not treat 0 rows as “players don’t buy”)
3. recap opened vs dismissed vs lava-death-during-recap (PX; input gate may have closed — measure)
4. spell-cast counts **by acquisition path** (starter vs unlocked vs observed) — a “weak” spell may be undiscovered, not weak. Today every catalog id is treated as owned, so this series would be **meaningless** until SDA-002.
5. Attack Nearest vs aimed-cast ratio (gate confusion vs power)
6. challenge accept vs complete vs advertised-reward-missing vs **Striker splash/bounce beyond 2** (#327 — if complete rate is high on Nova/Chain, DESIGN INTERPRETATION is the aim-tile hole, not player skill)
7. Swap / summon-walk / destack onto hazards vs walk onto the same tile (MIMA-001 remainder — if “Untouchable complete rate” is high, DESIGN INTERPRETATION is skip-landing, not player skill)
8. Frozen/Slime maps: tiles walked vs preview budget (09-01-001 is closed in source — measure whether leftover-1-MP walks remain)

Until those exist: automations must not claim CLEAR_POSITIVE_SIGNAL or “players don’t use X.” Distinguish MEASURED PLAYER BEHAVIOUR (none) from DESIGN INTERPRETATION and ENGINEERING EVIDENCE.

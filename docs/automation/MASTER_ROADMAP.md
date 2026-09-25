# Stralt Master Roadmap

**Director:** Stralt Master Technical Director (`0b92479e-a49e-11f1-a7d1-d6b4613131ce`)  
**Run:** 2026-09-25 00:09 UTC (daily cron)  
**This agent:** `bc-d12f7f6b-ca67-4cc8-b1b6-1f312225e612`  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (accepted-challenge HUD)  
**Prior director:** 2026-09-24 00:03 (`bc-2c6667d4-fa6d-4333-85bd-54bed9eb2bca`, unmerged [#509](https://github.com/Mr-Melic/stralt/pull/509)). On `main` this file is still the 2026-09-02 text. Unmerged [#338](https://github.com/Mr-Melic/stralt/pull/338) / [#402](https://github.com/Mr-Melic/stralt/pull/402) / [#448](https://github.com/Mr-Melic/stralt/pull/448) / [#509](https://github.com/Mr-Melic/stralt/pull/509) are stale snapshots of the same living files.  
**Gameplay / production code:** not modified.

This file is the living prioritized roadmap. ACTION_ID records for this run live in [`ACTION_IDS_2026-09-25.md`](./ACTION_IDS_2026-09-25.md). Do **not** append to `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, `ACTION_IDS_2026-09-21.md`, `ACTION_IDS_2026-09-22.md`, `ACTION_IDS_2026-09-23.md`, or `ACTION_IDS_2026-09-24.md`. Process audit: [`QUALITY_AUDIT_2026-08-30.md`](./QUALITY_AUDIT_2026-08-30.md). Close **#338**, **#402**, **#448**, and **#509** when this PR lands (MTD-2026-09-25-002).

## Evidence available this run

| Source | Status |
| :--- | :--- |
| `AGENTS.md`, `README.md`, `DESIGN.md`, `docs/ARCHITECTURE.md` | Read |
| Prior director (2026-09-24) | Memories + #509 body. P0 leftovers **not** landed. Halt-as-config **failed**; halt-as-merge-stop **held**. Validation “≤3 new gameplay PRs from the 09-24 wave” **failed**. |
| Specialist reports on `main` | Still dated 2026-09-02 (plus orchestrator [`ACTION_IDS_2026-09-03-0000.md`](./ACTION_IDS_2026-09-03-0000.md)). 09-21…09-25 reports exist only on unmerged drafts. |
| Open ACTION_IDs | Hundreds still `NEW` across dated producer files. Reuse; do not mint twins. |
| Recent commits | `main` last moved 2026-09-03 00:28 UTC. **Zero** commits for **22 days**. HEAD still `0f5363f`. |
| Open drafts | **230**, all draft (`Link: page=230` at `per_page=1`). Leftover **#327** (Striker, `mergeable_state: dirty`) + **#331** (mapGen HOLD) + **#333–#501** + **#502–#555** (09-24 flock, which became gameplay) + **#556–#560** (09-25 first-hour docs) + this run. |
| Player telemetry | **Still none.** `longHorizonSim.telemetry.available === false`. TBC stays `WAITING_FOR_TELEMETRY` (opened [#556](https://github.com/Mr-Melic/stralt/pull/556); dashboard specialist opened [#559](https://github.com/Mr-Melic/stralt/pull/559) “skip fifth Health matrix”). Zero `recordTelemetry` in `src/backend`. |
| Same-hour flock (this minute) | **30** automations already launched ~00:00 UTC 2026-09-25, including combat parity `f37b7505` (**enabled, RUNNING**), map guardian `9dcfd122` (**enabled, RUNNING**), expansion `3f31b18f` (**enabled, RUNNING**), AI `67b03c2f` (**enabled, RUNNING**), economy `1e548d83` (**enabled, RUNNING**), security `c97e5c0c`, admin safety, spell mechanics, dungeon encounters, world mechanics, enemy formations, game feel, defect recurrence, AdminDashboard. `fe5b679a` (Approved Game Design Implementer) is **not** GetAutomation-visible this run and did **not** appear in the 00:00 flock list (it **was** RUNNING on 09-24). `996df6df` still not GetAutomation-visible. Critical hunter `1aa41c6c` remains **enabled**. |

**Evidence classes used below**

| Class | Meaning |
| :--- | :--- |
| MEASURED PLAYER BEHAVIOUR | Live play counters. **None exist.** |
| DESIGN INTERPRETATION | Product rules in this prompt + `AGENTS.md` / `DESIGN.md` / specialist design docs |
| ENGINEERING EVIDENCE | Code on `0f5363f`, tests, **230**-draft queue, Caffeine `.old` still the 2026-08-31 no-GameKey signature |

Telemetry is not allowed to set priority. Correlation is not causation. No CLEAR_POSITIVE_SIGNAL is claimed.

---

## What changed since the 09-24 director run (24 hours)

The 09-24 run asked: halt the flock; do not merge-burst 171 leftover drafts; confirm Caffeine deploy; write the ADR; restack #327; close #338, #402, and #448.

**What actually happened**

| Ask | Outcome |
| :--- | :--- |
| Halt 09-24 implementers | **Config failed.** Wave opened **#502–#555** (**~54** new drafts) across 00:00 plus 06/08/12/15/16/18 crons. Gameplay includes persist skip-wipe twins, mapGen punches, leftover-walk mill, Swap local patch, admin range caps. |
| ≤3 new gameplay PRs from 09-24 | **Failed.** ~28 gameplay/fix/test/refactor PRs (examples: **#508 #512 #514 #517 #526 #528 #531 #532 #536 #538–#555**). |
| Humans merge the flock | **Did not.** `main` still `0f5363f`. Merge-stop held a **fourth** full day (**22 days** total). |
| Merge director #338 / #402 / #448 / #509 | **Did not.** `main` still serves the 09-02 roadmap. **Five** living director files now exist. |
| Caffeine deploy + `.old` refresh | **Unconfirmed.** `snapshots/deployed/` still four files; newest GameKey shape is `pr259-tail-20260901.most`. |
| ADR (AQA-008) | **Still missing** (`docs/**/*ADR*` = 0). Security `c97e5c0c` is RUNNING this hour. |
| Restack #327 | **Still open**, now **23 days** stale, `mergeable_state: dirty` vs current `main` (base is `441266a`, before #332). Twin **#370** still open. Economy hunter RUNNING tonight. |
| Hold twelve mapGen punches | **Held on `main`**, but 09-24 cloned **#538 / #542 / #548 / #553**. **Sixteen** open mapGen punches. Guardian RUNNING tonight. |
| `fe5b679a` stay idle | **Partial.** Not in this hour’s 30-agent list and not GetAutomation-visible. Expansion / AI / spell-mechanics / dungeon-encounters **are** RUNNING. |

**Integrity already on `main` (accept; do not re-open):** EOP later-file GameKey (#259/#311/#324), Frozen execute/AI MP (#313/#318), barrier A*, spawnPolicy (#287), Attack Nearest caster (#326), Life Drain no-heal (#315), one-shot/unseeded keep (#312/#330), Boss Rush victory feats (#319), accepted-challenge HUD (#332), Enemy Register lore (#328), AP/MP persist cap (#322), Caffeine import + stack-compat gates.

**09-24 leftovers that are NOT done:** flock halt, deploy confirmation, ADR, #327, landing helper, kit-zone number, ownership persist, occupants on `findPath`, GameKey × unpaid death **wiring**, mapGen freeze, director-index merge.

**Unique leftovers (keep; do not clone):**

| PR | Why unique | Director stance |
| :--- | :--- | :--- |
| **#327** | Striker aim-tile hole (400/800). Oldest. Dirty vs `main`. | Restack/merge (MTD-2026-09-21-003). |
| **#370** | Same hole **plus** AI kit-cast / summon. | HOLD until after #327; union unique delta only (MTD-2026-09-22-004). |
| **#391** | `gameKeyUnpaidDeath.ts` helper for MIMA-2026-09-02-003. Not wired. | After halt; then one import in redeem. |
| **#362** | Unbounded GameKey serial + `saveActiveSpells` keep-store. **No new stables.** | After halt. Unique persist P1. |
| **#380** | Wisp `ctx.heal` fails no-heal (sibling of #315 Life Drain). | After halt. Isolated challenge honesty. **#550** is a later Wisp Blood Mend twin — HOLD/union. |
| **#385** | Unpaid death-pending scoped to II principal. | After halt. Isolated persist honesty. Do not sequential-merge with later principal-keying twins. |
| **#333** | TBC WAITING_FOR_TELEMETRY docs. | OK after P0 docs/index. Later dated TBC drafts (#395/#462/#502/#556) are dated twins — keep one. |
| **#354** | Feats vs Achievements recap copy. | P3 display-only when WX is quiet. |
| **#517** | Hide empty Map Effects overlay. | Unique display-only P3 after halt. Do not grow WX for it during the flock. |
| **#536** | Boss Rush jackpot `complete(9)` abort. | Possible unique P1 **after halt**. Do not restack during 230-draft freeze. |
| **#338 / #402 / #448 / #509** | Prior director roadmaps. | **Close** — this file subsumes all four. |

**Overlap / HOLD (09-21 leftovers plus 09-22/09-23/09-24 clones):**

- mapGen: **#331 #373 #378 #383 #428 #430 #436 #444 #484 #486 #494 #500 #538 #542 #548 #553** (sixteen)
- persist cluster: prior 09-22/09-23 skip-wipe mill plus **#508 #532 #540 #545 #552**
- combat-parity / leftover-walk WX: prior mill plus **#528 #541 #543 #544 #546 #547 #550 #551 #554 #555**; **#501 RAF** still HOLD
- Swap local patch **#541** — HOLD; landing authority is `applyHazardLanding`, not another WX Swap branch
- AdminDashboard: prior mill plus **#512 #531 #539 #549**
- catalog docs: keep one discovery persist shape (SDA-002/004); do not author a fifth schema. 09-24/09-25 added another overlapping SDA/SDE/EBA/AI/formations/world/boss/visual/telemetry wave (#557/#558/#560 already this hour).

---

## Seven-dimension evaluation

### 1. Correctness — official client safer; landing + kits + Striker still lie

ENGINEERING: Death replay, live Doka refs, ignore-client level, Frozen MP, barrier A*, GameKey replacing 60s auto-complete, later-file EOP. Do not open an eighth persist rewrite.

Recurring defect class: **teleport landing.** Swap (`WX` 9389–9402) still copies coordinates. Destack / unseal / controlled-summon walk still treat lava as ordinary floor. `applyHazardLanding` does not exist (glob = 0). **#541** is another local Swap patch. Local Attack-Nearest / LoS / Swap patches are no longer the bottleneck.

Recurring defect class: **kit zone NaN.** `buildEnemyKit` takes a number (`enemyAI.ts` 194–199). Battle start still passes `currentMap.levelZone` (`WX` 11920). `currentZoneTier` is already a number (`WX` 1136 / `setCurrentZoneTier` 4680). **Seventh** director cycle.

Recurring defect class: **mapGen portal punch vs battle graph.** #110 → leftover islands → destack → relocate hostiles → punch adjacent floor → **sixteen** open drafts. Controlled intervention = one battle-graph policy helper + fixtures. Do **not** auto-refactor. Hold all sixteen punches.

Recurring defect class: **Striker victim tiles.** Aim-tile-only is the leftover unique P1 (#327). 09-21 then opened a twin-plus-AI (#370). Economy hunter is RUNNING again tonight. Union once; stop cloning.

Recurring defect class: **EOP stables.** Source chain is correct. Remaining hole is **deploy confirmation**.

Recurring defect class: **unseeded wallet HUD.** 09-22/09-23 persist hunters opened skip-wipe twins; 09-24 cloned **#532 / #540 / #545 / #552**. That is “repeated patches on one subsystem.” Hold the cluster; do not sequential-merge.

Recurring defect class: **leftover-walk abort.** #501 RAF plus 09-24 **#544 / #546 / #547 / #554**. `AGENTS.md` forbids RAF. One walk-cancel helper later; not four WX branches tonight.

### 2. Player experience — honesty up on `main`; identity still incomplete

ENGINEERING: Challenge HUD (#332), Enemy Register lore (#328), Buy Doka how-to (#316), leftover XP HUD, Pacifist preview. Do not re-implement.

DESIGN (no player data): live catalog on minute one; enemy-observed discovery **absent**; achievement/challenge/boss rewards are Doka/XP; four map modifiers announce-only; family HP multipliers die at `calcEnemyMaxHp`; Paper Windstorm still two live rates (RAO-2026-09-03-0000-003, HUMAN).

GameKey is a real PX/ops change in source. Live canister deploy is **unconfirmed**.

MEASURED: none. Do not claim spells are over/underused. A mathematically powerful catalog spell showing “no use” cannot be interpreted until SDA-002 exists.

### 3. Technical health — hotspot + 230-draft queue + unconfirmed deploy

| Surface | Lines now | 09-24 director | Verdict |
| :--- | ---: | ---: | :--- |
| `WorldExploration.tsx` | 19,213 | 19,213 | Unchanged on `main`; leftover drafts want more branches |
| `AdminDashboard.tsx` | 8,280 | 8,280 | No publish pipeline. Admin drafts HOLD |
| `enemyAI.ts` | 2,580 | 2,580 | Frozen size; do not grow tonight |
| `main.mo` | 3,903 | 3,903 | Chain correct in source. #362 is behavior-only |
| `mapGen.ts` | 1,937 | 1,937 | Sixteen open punches; freeze badly broken |
| `progressPersist.ts` | 421 | 421 | Leave it |
| `targeting.ts` | 1,199 | 1,199 | Leave it |
| `deathPenalty.ts` | 597 | 597 | Leave it |
| `spawnPolicy.ts` | 297 | extracted | Leave it |
| `worldFeatures.ts` | tests-only | tests-only | Do not wire tonight (README confirms) |

Caffeine import gates plus stack-compat plus populated EOP snapshots stay. `ARCHITECTURE.md` still says `check-limit = 4` (live `mops.toml` is 5) — docs drift, not a live bug.

Stale paths remain documented, not live bugs: `dfx.json` → missing `src/backend_extended`; root `declarations/` 15-field snapshot; unused `src/backend/mixins/*`.

Five unmerged director PRs on the same living files (#338/#402/#448/#509/this) is itself a stack-compat defect. Close the four older snapshots. Do not merge all five.

**New process contradiction (ENGINEERING, not a gameplay bug):** oldest-first merge (`scripts/open-pr-stack-compat.sh`) makes the living director index unreachable. Queue head is **#327**, dirty, 23 days stale, 20 files / +1371. Until a human restacks it or closes the mill, every later docs PR — including this one — sits behind ~200 drafts. That is why `main` still serves the 09-02 roadmap after seven director runs (MTD-2026-09-25-005).

### 4. Content depth — over-specified, under-wired, catalog mill on an eighth consecutive midnight

Present on `main`: player-relative tier spawn, AI tiers 1–10, named boss kits, dungeon chain, Boss Rush, 9 challenges, feats, frontend catalog + GameKey shop.

Dead or contradictory vs core rules:

- `buildEnemyKit(..., currentMap.levelZone)` still passes an **object** → zone-0 kits forever.
- Summoner chance `0.12 + playerLevel * 0.02` saturates by the mid-40s.
- `pickEnemyLevelFromTiers` `maxTier = floor(999 / tierSize)` stops climbing.
- `computeAITier` still has a **30% fully random 1–10** roll (`combatMath.ts` 48–50).
- Dual spell catalogs. Admin adding a catalog spell still grants it to every player on hydrate (`adminSafety.ts` 712–718).
- `worldFeatures.ts` still tests-only; no WX import.
- `ENEMY_AI_TIER_GATES` names still unused in `enemyAI.ts`.

09-21 through 09-25 specialists produced overlapping catalog waves (SDA, SDE, EBA, AI, formations, elite, world, encounter, visual, boss, expansion, telemetry). That is **expansion overlap**. Default **hold** implementation. 09-25 designers/implementers already RUNNING (expansion, AI, spell mechanics, dungeon encounters, world, enemy formations).

### 5. Long-term scalability — rules vs implementation

| Core rule | Implementation on `0f5363f` |
| :--- | :--- |
| No character level cap | Yes (`applyRewards` Nat loop). HUD saturates at 48 (`LHIPS-2026-09-01-001`). Persist AP/MP hard-cap 20 is a silent growth freeze (SDEG-2026-09-21-003, HUMAN — do not raise in this flock). |
| Increasing XP | Yes `100 * 2^(N-1)`. Practical wall ~level 15–22 on kill XP (DESIGN, not a tonight bug). |
| Player-relative enemies | Yes until the 999-tier ceiling (PREREQ-B). |
| Progressively sophisticated enemies | Partial; 30% random tier + zone-0 kits undermine it. |
| Dynamic enemy spell pools | Boss phases yes; overworld = static piece kits stuck at zone 0. |
| Enemy-observed spell discovery | **Absent** |
| Achievement / challenge / boss spell unlocks | Rewards are Doka/XP |
| Backend-authoritative persistence | Wallet/XP/death yes (clamped; level pinned). Combat client-side. Achievement unlock still client-asserted. BuffShop potions still `${principal}_inventory`. GameKey redeem authoritative **in source**; live deploy unconfirmed. |
| Optional owner-uploaded visuals + pixel fallback | Still true. Do not make URLs required. |
| Admin Draft → Validate → Activate | **Not a canister workflow.** Local React drafts + retire-via-`usableByPlayer` remain. |

Expansion that adds spells, AI behaviors, or admin chrome **before** Caffeine deploy confirmation, landing-authority extraction, and a reward-trust ADR will not scale. Expansion `3f31b18f` + AI `67b03c2f` running tonight is the opposite of that gate.

### 6. Data / persistence safety — official client safer; deploy is the remaining P0

`saveBattleStats` may still **lower** Doka/XP (required for heals/spends/death). It must not raise them. Finding 3 is stale if phrased as “must not write Doka.” Client level cannot demote. AP/MP capped (#322).

`applyRewards` is still client-trusted **within** 100k/500k. Custom clients can still drip-mint. `calculateAndAwardDoka` remains an unused public mint. `markAchievementUnlocked` is still unproven. `useSaveKillCount` still has no TSX caller (`useLeaderboardQueries.ts` only).

Wallet seeding / idle-hydrate / unpaid death replay / one-shot keep remain load-bearing. Do not invent a second persist path for telemetry or discovery grants. `redeemGameKeyThroughPersist` already uses the lock — leave that shape; add unpaid-death honour as the #391 helper, not a new lock.

New stables still require a **new later** file after `20260901`. Never amend `20260831` / `20260901` `NewActor`. #362 does not add stables — still HOLD until triage.

### 7. Automation coherence — P0; merge-stop held 22 days, config failed an eighth midnight

AQA-001…012 were written 08-30 19:00. The 08-31 / 09-01 / 09-02 waves ignored them and humans merged. Then `main` froze — the only halt that worked.

09-21 cron opened **59** PRs. 09-22 ~**55**. 09-23 **55**. 09-24 ~**54**. Humans did **not** merge them. That is a **partial** win: the queue is now the risk. 09-02 showed what happens when that queue is merged in 30 hours.

09-25 00:00 relaunched combat parity, map guardian, expansion, AI, economy, security, admin, spell mechanics, dungeon/world/formations, game feel against a **230-draft** queue. Cursor Cloud has **no write API** for dashboard prompts. Halt is a human config action. In-repo gates are the enforceable half.

| AQA / MTD ID | Director status 2026-09-25 |
| :--- | :--- |
| AQA-001 hunter throttle | **OPEN** — `996df6df` still not GetAutomation-visible. |
| AQA-002 one critical hunter | **OPEN** — volume problem remains combat/persist/admin/economy/map/expansion/AI implementers. `1aa41c6c` enabled. |
| AQA-003 in-repo ACTION_ID ledger | **PARTIAL** — 09-02 file clean; 09-21…09-24 ledgers never reached `main`. This run writes 09-25 only. |
| AQA-004 don’t merge the 08-30 stack | **SUPERSEDED** — accept `main`. |
| AQA-005 test clone mill | **PARTIAL** — mill still firing (`#542` map tests). |
| AQA-006 no mapGen implementation | **BROKEN** — **sixteen** open punches. Guardian `9dcfd122` enabled and RUNNING. |
| AQA-007 freeze drive-by WX | **BROKEN** — combat parity RUNNING again; leftover-walk mill plus #501 RAF. |
| AQA-008 security → ADR | **PARTIAL** — clamps on `main`; no ADR. Security RUNNING tonight. |
| AQA-009 orchestrator must not implement gameplay | **PARTIAL** — leftover isolated helpers. **#501 RAF** is not helper-shaped — hold. |
| AQA-010 persist/economy dedup | **PARTIAL** — cluster landed on `main`; 09-21…09-24 opened another persist pile. Economy RUNNING tonight. |
| AQA-011 prompts vs live architecture | **OPEN** |
| AQA-012 outcome telemetry | **OPEN** — dashboard/architecture drafts with nothing to display. TBC correctly WAITING (#556). Dashboard skipped a fifth matrix (#559). |
| MTD-001 flock halt | **OPEN** — merge-stop held **22 days**; config failed 08-31, 09-01, 09-02, 09-21, 09-22, 09-23, 09-24, **09-25**. |
| MTD-2026-09-21-002 | **OPEN** — confirm Caffeine deploy + refresh `.old`. |
| MTD-2026-09-24-001 | **SUPERSEDED** — 09-24 wave already happened; validation failed. |
| MTD-2026-09-24-002 | **OPEN** — subsumed by MTD-2026-09-25-002 (also close #509). |
| MTD-2026-09-24-003 | **OPEN** — leftover queue grew 171 → **230**. See MTD-2026-09-25-003. |
| MTD-2026-09-24-004 | **OPEN** — 09-24 cloned the mill again. See MTD-2026-09-25-004. |
| MTD-2026-09-25-001 | **NEW** — hold the 09-25 00:00 wave. |
| MTD-2026-09-25-002 | **NEW** — close #338, #402, #448, and #509; this file is the index. |
| MTD-2026-09-25-003 | **NEW** — do not merge-burst 230 drafts. |
| MTD-2026-09-25-004 | **NEW** — hold the 09-24 mapGen/persist/combat/leftover-walk/Swap clone mill. |
| MTD-2026-09-25-005 | **NEW** — oldest-first queue makes the living director index unreachable until #327 is restacked or the mill is closed. |

---

## Recurring hotspots — local patches no longer sufficient

Do **not** automatically perform a large refactor.

1. **EOP / frozen NewActor** — source chain is correct. Remaining work is **ops**: confirm Caffeine import of HEAD, then refresh `.old` + add `snapshots/deployed/` from that build.
2. **Landing / occupancy / hazard authority** — Swap + summon-walk hazards + destack/unseal need **`applyHazardLanding`**, not more WX branches (#541). After flock halt.
3. **Kit-zone number** (PREREQ-A) — pass `currentZoneTier` into `buildEnemyKit`. One call site. Wait until the flock is held.
4. **mapGen portal-punch vs battle graph** — punches on `main` plus **sixteen** open drafts. One policy helper + seed fixtures. Hold further punches.
5. **Striker victim-tile authority** — #327 then #370. One helper, two PRs. Union once. Economy hunter RUNNING tonight must not open a third.
6. **Unseeded / in-flight wallet HUD** — #330 closed the keep; 09-22/09-23/09-24 opened twins. Stop patching `progressPersist` callers in parallel.
7. **Leftover-walk abort** — #501 RAF + #544/#546/#547/#554. One helper; RAF stays frozen.
8. **Canister trust** — write the ADR (AQA-008). Until it exists, no new credit APIs and no discovery grant writer.
9. **Automation flock + leftover queue + unreachable director index** — one critical hunter; report-only on cron restart; **do not merge 200+ leftover gameplay drafts to clear the button.** Disable expansion/AI/combat-parity/map-guardian until P0/P1 close. Restack #327 or close the mill so the living roadmap can land (MTD-2026-09-25-005). This is still the binding constraint.

HP/death extraction (MTD-003) is still valid. Do not start it in the same hour as the flock.

---

## Human merge queue (do not autonmerge)

| Order | PR | Action |
| :--- | :--- | :--- |
| 1 | **This docs PR** | Living roadmap + `ACTION_IDS_2026-09-25.md`. Close **#338**, **#402**, **#448**, and **#509** (same living files, stale snapshots). Oldest-first will conflict with those four — **close them**, do not merge them. |
| 2 | **#327** | Unique P1 Striker splash/bounce. Oldest gameplay PR. **Restack** onto `origin/main` (currently dirty). |
| 3 | **#333** | TBC WAITING docs. Unique, aligned with AQA-012. Later dated TBC PRs are twins. |
| 4 | **#391** | GameKey unpaid-death **helper** (new file). After halt. Then wire redeem when `shopPurchase.ts` is free. |
| 5 | **#362** | Unbounded GameKey serial + `saveActiveSpells` keep-store. No new stables. After halt. |
| 6 | **#380** | Wisp heal fails no-heal. Isolated. After halt. Hold **#550**. |
| — | **#536** | Possible unique Boss Rush jackpot abort. After halt; do not land during freeze. |
| — | **#370** | HOLD until #327. Union unique AI/summon delta only. |
| — | **#385** | After halt. Do not sequential-merge with later principal-keying twins. |
| — | **#517** | Display-only Map Effects empty overlay. After halt. |
| — | **sixteen mapGen punches** | **Hold.** AQA-006 / MTD-2026-09-25-004. |
| — | Persist / combat-parity / leftover-walk / Swap #541 / AdminDashboard / feel / UX / a11y / perf / extract / **#501 RAF** | Default **hold** this cycle. |
| — | Docs catalogs from 09-21…09-25 | OK **after** P0/P1 if they do not rewrite SDA/SDE/EBA schemas or retune BAL-*. |
| — | Any later PR from the 09-25 00:00 wave | Default **hold** if gameplay. Especially mapGen, targeting, persist, `enemyAI`, AdminDashboard, `main.mo` stables, telemetry UI, WX, RAF. |
| — | Motoko PRs that add persistent `let`/`var` | **Hold** until Caffeine deploy of the 20260901 tail is confirmed and `.old` refreshed. |

Do not restack death-replay, `writeLiveDoka`, `writeLevel`, leftover-XP HUD, Frozen MP helpers, spawnPolicy, GameKey product methods, or the EOP chain.

---

## Prioritized roadmap (what to work next)

**P0 — do these before any expansion PR merges**

1. Halt the 09-25 same-hour implementer flock (MTD-2026-08-31-001, MTD-2026-09-25-001). Disable or pause `f37b7505`, `9dcfd122`, `3f31b18f`, `67b03c2f`, and `1e548d83`.
2. Triage the 230-draft leftover queue — do not merge-burst (MTD-2026-09-25-003 / 004). Close #338, #402, #448, and #509 (MTD-2026-09-25-002). Restack #327 so the living index is not stuck behind a dirty 23-day-old gameplay PR (MTD-2026-09-25-005).
3. Confirm Caffeine GitHub→import of current HEAD and refresh `.old` + `snapshots/deployed/` (MTD-2026-09-21-002). Freeze new Motoko stables until that lands.
4. Write the reward-trust ADR (AQA-008). Finding 3 = unbounded/absolute misuse, not “Doka write is a bug.”

**P1 — infrastructure / gameplay integrity**

5. Restack and merge leftover **#327** (Striker AoE). Then union **#370**’s unique AI/summon delta (MTD-2026-09-21-003 / MTD-2026-09-22-004).
6. Re-freeze `mapGen.ts`, `targeting.ts`, `enemyAI.ts`, and WX drive-bys (AQA-006, AQA-007). Hold all sixteen mapGen punches.
7. Extract `applyHazardLanding` for Swap + controlled-summon walk + destack (MIMA-001 + MIMA-002 remainder). Do not land #541 as a standalone WX Swap patch.
8. Honour unpaid death 20/40 on GameKey redeem — merge #391 helper, then one redeem import (MIMA-2026-09-02-003).
9. Battle `findPath` occupants (MIMA-2026-09-01-002 remainder). Barriers already share `isBattleWalkTileBlocked`.
10. One leftover-walk cancel helper **after** halt — not RAF (#501) and not four WX clones.
11. Controlled HP/death extraction (MTD-2026-08-31-003) **after** landing helpers — not tonight.

**P2 — high-value expansion (after P0/P1, not this hour)**

12. Outcome counters, then maybe a dashboard (AQA-012 before TADD UI).
13. Fix kit-zone call site (Expansion PREREQ-A) — pass `currentZoneTier` **number**.
14. Enemy-observed spell discovery + ownership maps (SDA-002/003/004). New later migration after deploy confirmation.
15. Admin Draft → Validate → Activate on the canister (SDA-005 / MTD-006). Do not grow the 8.3k dashboard first.
16. Seed frontend starter ids; stop treating `usableByPlayer` as ownership (SDA-007).
17. Revisit `computeAITier` 30% random vs progressive sophistication (MTD-008). Report/design, not an `enemyAI.ts` rewrite.
18. Wire `saveKillCount` or drop it from the leaderboard (MTD-005).
19. BuffShop `buffInventories` vs `${principal}_inventory` (SDEG-005) — after persist quiet.
20. Unify Paper Windstorm to one rate (RAO-2026-09-03-0000-003) — HUMAN; changes fight outcomes.
21. Persist AP/MP cap 20 vs unbounded formula (SDEG-2026-09-21-003) — HUMAN; do not raise in this flock.

**P3 — polish**

22. Recap / HUD leftovers already shipped — do not restack. #354 Feats copy and #517 empty Map Effects are display-only when WX is quiet.
23. Visual / game-feel / mobile — DESIGN.md already specifies the look. Do not edit combat math or WX for feel this hour.
24. Dead-code / maintainability — report only while hunters are hot.

---

## Contradictions and duplicates (do not re-litigate)

| Conflict | Resolution |
| :--- | :--- |
| Security “don’t write Doka from `saveBattleStats`” vs ARCHITECTURE | Write stays; **clamp / no-mint**. ADR still required. |
| Solvability vs `AGENTS.md` mapGen | #110 plus later punches already merged; **freeze**; hold all sixteen open punches. |
| AQA-004 vs human merge of 08-30…09-03 stacks | Accept `main`; clean leftovers; do not re-open merged themes. |
| Frozen preview vs execute | Execute now uses `battleWalkMpCost`. Do not re-file 09-01-001. |
| #327 vs #370 Striker | One helper. Oldest #327 first; #370 unique AI/summon only. |
| #380 vs #550 Wisp heal | One no-heal path. #380 first; hold #550. |
| Progressive AI vs 30% random tier | Design decision later; no first-hour AI PR. |
| SDA vs SDE vs SPELL_DISCOVERY vs EBA vs BOSS docs | One discovery persist shape (SDA-002/004). Others are content cards. |
| Expansion specialists vs “P0/P1 first” | Leftover catalogs + 09-25 `3f31b18f` / `67b03c2f` are the violation. Hold implementation. |
| Telemetry dashboard vs no counters | AQA-012 first. TBC stays WAITING_FOR_TELEMETRY. #559 skip is correct. |
| Empty/Aug-31 `.old` vs live Caffeine | `.old` is the **real** Aug-31 signature (no GameKey). Import of HEAD should pass. Deploy still unconfirmed. |
| GameKey on `main` vs canister | Source is ahead of confirmed deploy. Do not revert GameKey product. |
| `usableByPlayer=false` as retire vs enemy-only gate | SDA-2026-09-01-001; do not extend the flag. |
| Family HP paper vs `calcEnemyMaxHp` | PREREQ-H; honesty bug; not an AI rewrite. |
| 22-day freeze vs “halt failed” | Halt failed as **config**. It succeeded as **human merge stop**. Cron restart without dashboard change undoes the config half; merging the leftover queue undoes the merge-stop half. |
| #338 / #402 / #448 / #509 vs this PR | This file subsumes all four. Close them without merge. |
| 09-22/09-23/09-24 persist HUD twins vs #330 keep | #330 is on `main`. Hold the twins; do not open a sixth keep path. |
| #501 leftover walk rAF vs `AGENTS.md` | RAF is frozen. Hold #501 even if the race is real. |
| Oldest-first stack vs living director index | Close superseded director snapshots; restack #327; do not merge-burst 200 drafts so the roadmap can land (MTD-2026-09-25-005). |
| #541 Swap live-tile vs MIMA-001 | HOLD #541. Extract `applyHazardLanding`. |

---

## TOP 5 CURRENT PRIORITIES

1. **Halt the 09-25 00:00 implementer flock** (30 agents already; especially combat parity, map guardian, expansion, AI, economy) and **do not merge-burst the 230 leftover drafts**. First-run and expansion specialists: ACTION_IDs only. Especially hold mapGen, persist, targeting, `enemyAI`, AdminDashboard, `main.mo` stables, telemetry UI, WX, RAF.
2. **Unblock the living director index** — close #338/#402/#448/#509 without merge; **restack #327** so oldest-first is not a 23-day dirty gameplay PR sitting in front of every later change (MTD-2026-09-25-005).
3. **Confirm Caffeine deploy of the 20260901 GameKey tail** and refresh `.old` from that build (MTD-2026-09-21-002). Source is ready; ops is not proven.
4. **Reward-trust ADR (AQA-008)** — clamps, ignore-client level, and AP/MP cap landed; the written decision did not. Security is running again tonight.
5. **After halt: merge restacked #327** (Striker AoE/bounce), then union #370’s AI/summon delta only, then **re-freeze WX / mapGen**.

## BLOCKED WORK

- Spell discovery / observed enemy kits / new unlock loops — no ownership persist, combat landing still racing, ADR unwritten, Caffeine deploy of GameKey unconfirmed.
- Enemy AI capability expansion — `enemyAI.ts` already 2,580 lines; kits never leave zone 0; HP/death still dual-written. `3f31b18f` / `67b03c2f` must not implement tonight.
- Telemetry admin dashboard — no counters to display (AQA-012). Balance analyst correctly idle (#556 WAITING). #559 skip is correct.
- Any Motoko PR that adds stables until deploy is confirmed and `.old` refreshed.
- Further `mapGen.ts` punches (sixteen open drafts and tonight’s Guardian) without an explicit human playtest of the #321→#329 sequence.
- Custom-client mint proofs / new credit APIs until the ADR exists.
- `calculateAndAwardDoka` productization (unused official path; still a sink).
- Formula-level `BAL-*` / `LHIPS-*` retunes (no telemetry; jackpot 100k clamp is architecture).
- Admin Draft→Validate→Activate chrome on the 8.3k dashboard before canister lifecycle exists.
- Sequential merge of the 200+ leftover gameplay drafts “to clear the queue.”
- RAF / walk-stepper edits (#501) and leftover-walk WX mill (#544/#546/#547/#554).
- Standalone Swap WX patch (#541).

## SAFE EXPANSION WORK

- Land this docs PR; close #338, #402, #448, and #509.
- Restack/merge #327 (scoped Striker helper + tests). Do not duplicate it in #370 until unioned.
- Adopt per-producer ledgers + this director index (AQA-003) — process, not gameplay.
- Design-only (no PR): keep SDA/SDE/EBA catalogs; do not author a fifth discovery schema. Tonight’s #557/#558/#560 are dated twins of existing catalogs — do not treat them as a license to implement.
- Query-only / persist-lock-enqueued counters (AQA-012) — **design + tiny isolated PR after flock halt**, not a dashboard.
- Kit-zone number fix (PREREQ-A) **after** the flock is held — one call site + `enemyAI` test, no WX growth.
- Display-only unique copy if orchestrator finds one hole not already on `main` or drafted (#354 Feats copy, #517 empty Map Effects).
- Merge #391 helper (new file) after halt — does not touch WX / mapGen / persist lock.

## AREAS TO STOP TOUCHING TEMPORARILY

- `src/frontend/src/components/WorldExploration.tsx` except one-line helper wiring
- `src/frontend/src/engine/mapGen.ts` (including all sixteen open punches)
- RAF loop, turn-order math, damage formulas (`AGENTS.md`) — including leftover walk rAF (#501)
- `src/frontend/src/utils/progressPersist.ts` (leave the lock)
- `src/frontend/src/utils/deathPenalty.ts` (cluster closed)
- `src/frontend/src/engine/targeting.ts`
- `src/frontend/src/engine/enemyAI.ts`
- `src/frontend/src/engine/spawnPolicy.ts` (just extracted)
- `src/frontend/src/engine/battleWalkMp.ts` / `enemyWalkMp.ts` (just landed)
- `src/frontend/src/components/AdminDashboard.tsx`
- `src/backend/main.mo` persistent fields until deploy confirmation
- Frozen chain files `20260831_000000.mo` / `20260901_000000.mo`
- `docs/automation/ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, `ACTION_IDS_2026-09-21.md`, `ACTION_IDS_2026-09-22.md`, `ACTION_IDS_2026-09-23.md`, `ACTION_IDS_2026-09-24.md` (do not append)
- GameKey product methods except unpaid-death honour on the existing redeem helper

## ARCHITECTURAL HOTSPOTS

1. Unconfirmed Caffeine deploy vs correct-in-source EOP chain (`20260901` GameKey; `.old` still Aug-31)
2. Dual HP / death / landing authority (React snapshot vs `combatantsRef` vs Swap/summon/destack teleport)
3. Client-trusted `applyRewards` without a written ADR (clamps exist; decision does not)
4. 19k-line world orchestrator absorbing every hunter (still the magnet; leftover drafts wait to grow it)
5. Automation pile-on (**230** leftover drafts + 09-25 restart) — merge-stop held 22 days, config failed an eighth midnight
6. Oldest-first queue vs living director index (#327 dirty head blocks the roadmap)
7. mapGen portal-punch / battle-graph (**sixteen** open drafts)
8. Dual spell catalogs + implicit ownership (blocks discovery)
9. Kit-zone object call site (dynamic pools implemented and dead; number already in `currentZoneTier`)
10. Striker victim-tile authority split across #327 and #370
11. Unseeded-wallet HUD twins stacked on the #330 keep
12. Leftover-walk abort mill (#501 RAF + four 09-24 WX clones)
13. Five unmerged director snapshots on the same living files

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
9. unseeded-lock HUD vs committed Doka after one-shot / GameKey / feat (09-22/09-23/09-24 persist twins — if wallet “resets,” ENGINEERING is hydrate, not player spend)
10. leftover-walk after last hostile / into Death Realm / into battle start (#501/#544/#546/#547/#554 — if players “slide” after victory, ENGINEERING is walk-cancel, not feel)

Until those exist: automations must not claim CLEAR_POSITIVE_SIGNAL or “players don’t use X.” Distinguish MEASURED PLAYER BEHAVIOUR (none) from DESIGN INTERPRETATION and ENGINEERING EVIDENCE.

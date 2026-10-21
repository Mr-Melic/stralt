# Stralt Master Roadmap

**Director:** Stralt Master Technical Director (`0b92479e-a49e-11f1-a7d1-d6b4613131ce`)  
**Run:** 2026-10-21 00:00 UTC (daily cron)  
**This agent:** `bc-a344d1c1-af31-438f-8062-b115d87ef46b`  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (accepted-challenge HUD)  
**Prior director:** 2026-09-29 00:04 (`bc-4f25ed5f-2a56-4b2d-beee-85df1318fa6d`, unmerged [#783](https://github.com/Mr-Melic/stralt/pull/783)). On `main` this file is still the 2026-09-02 text. Unmerged [#338](https://github.com/Mr-Melic/stralt/pull/338) / [#402](https://github.com/Mr-Melic/stralt/pull/402) / [#448](https://github.com/Mr-Melic/stralt/pull/448) / [#509](https://github.com/Mr-Melic/stralt/pull/509) / [#569](https://github.com/Mr-Melic/stralt/pull/569) / [#618](https://github.com/Mr-Melic/stralt/pull/618) / [#666](https://github.com/Mr-Melic/stralt/pull/666) / [#718](https://github.com/Mr-Melic/stralt/pull/718) / [#783](https://github.com/Mr-Melic/stralt/pull/783) are stale snapshots of the same living files.  
**Gameplay / production code:** not modified.

This file is the living prioritized roadmap. ACTION_ID records for this run live in [`ACTION_IDS_2026-10-21.md`](./ACTION_IDS_2026-10-21.md). Do **not** append to `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, or `ACTION_IDS_2026-09-21.md` through `ACTION_IDS_2026-09-29.md`. Process audit: [`QUALITY_AUDIT_2026-08-30.md`](./QUALITY_AUDIT_2026-08-30.md). Close **#338**, **#402**, **#448**, **#509**, **#569**, **#618**, **#666**, **#718**, and **#783** when this PR lands (MTD-2026-10-21-002).

## Evidence available this run

| Source | Status |
| :--- | :--- |
| `AGENTS.md`, `README.md`, `DESIGN.md`, `docs/ARCHITECTURE.md` | Read |
| Prior director (2026-09-29) | Memories + #783 body. P0 leftovers **not** landed. Halt-as-config **failed**. Halt-as-merge-stop **held**. Validation “≤3 new gameplay PRs from the 09-29 wave” **failed** (09-29 opened through **#813**; last PR `2026-09-29T21:24Z`). |
| Specialist reports on `main` | Still dated 2026-09-02 (plus orchestrator [`ACTION_IDS_2026-09-03-0000.md`](./ACTION_IDS_2026-09-03-0000.md)). 09-21…09-29 reports exist only on unmerged drafts. **No 09-30…10-20 specialist reports** — the flock did not land docs for 22 days. |
| Open ACTION_IDs | Hundreds still `NEW` across dated producer files. Reuse; do not mint twins. |
| Recent commits | `main` last moved 2026-09-03 00:28 UTC. **Zero** commits for **48 days**. HEAD still `0f5363f`. `git fetch origin main` confirms remote is the same SHA. |
| Open drafts | **482**. All **draft**. Newest is **#813** (`2026-09-29T21:24Z`). Leftover **#327** (Striker, `CONFLICTING`, **49 days**) + **#331** (mapGen HOLD, also `CONFLICTING`) + **#333–#813** leftover mill. Prefix mix: **196** `docs` + **51** `fix(combat)` + **31** `fix(map)` + **27** `fix(admin)` + **11** `fix(persist)`. |
| Player telemetry | **Still none.** TBC stays `WAITING_FOR_TELEMETRY`. Zero `recordTelemetry` in `src/`. `longHorizonSim.telemetry.available === false`. |
| Same-hour flock (this minute) | **22** automations already `RUNNING` ~00:00 UTC 2026-10-21, including **Advanced enemy AI** `67b03c2f-a492`, **complexity reduction** `386a157d-a4a5`, **boss system** `39040ad2-a493`, **dungeon encounters** `73740435-a493`, **spell-discovery admin** `4efa22ec-a498`, **world content** `1592c6c0-a499`, **security** `c97e5c0c-a485`, **adversarial QA** `08e7de28-a486`. Map guardian `9dcfd122-a484`, Approved Design Implementer `fe5b679a-a489`, combat-parity `f37b7505-a484`, persist `607e0304-a484`, TBC `2786666f-a4a0`, and admin implementer `3089f18d-a49a` remain **enabled** (not yet in the first-three-minute RUNNING set). Critical hunter `1aa41c6c-a483` **ERROR** ~15h earlier (`bc-cedc9a70`). `996df6df` still not GetAutomation-visible. |
| 22-day gap | 2026-09-30…2026-10-20: **0 PRs**, **0 `main` commits**, sparse automation launches that died `ERROR` in ~20–30s (events empty; `setupStatus` null). That is **not** a successful halt. It is a platform/boot outage. Tonight’s flock is the first successful restart. |

**Evidence classes used below**

| Class | Meaning |
| :--- | :--- |
| MEASURED PLAYER BEHAVIOUR | Live play counters. **None exist.** |
| DESIGN INTERPRETATION | Product rules in this prompt + `AGENTS.md` / `DESIGN.md` / specialist design docs |
| ENGINEERING EVIDENCE | Code on `0f5363f`, tests, **482**-draft queue, Caffeine `.old` still the 2026-08-31 no-GameKey signature, 22-day ERROR mill then 10-21 flock restart |

Telemetry is not allowed to set priority. Correlation is not causation. No CLEAR_POSITIVE_SIGNAL is claimed.

---

## What changed since the 09-29 director run (22 days)

The 09-29 run asked: halt the flock; do not merge-burst 444 leftover drafts; close #338/#402/#448/#509/#569/#618/#666/#718; confirm Caffeine deploy; write the ADR; restack #327.

**What actually happened**

| Ask | Outcome |
| :--- | :--- |
| Halt 09-29 implementers | **Config failed.** Wave continued through **#813** the same calendar day. Then the **platform** stopped completing agents for 22 days. Tonight the flock is `RUNNING` again. |
| ≤3 new gameplay PRs from 09-29 | **Failed** that calendar day (skip-wipe mill through #813; map #770; admin #775; combat #799; security #810). **Then 0 PRs for 22 days** — by outage, not by dashboard pause. |
| Humans merge the flock | **Did not.** `main` still `0f5363f`. Merge-stop held an **eighteenth** extra day (**48 days** total since 2026-09-03). |
| Merge director #338…#783 | **Did not.** `main` still serves the 09-02 roadmap. **Ten** living director files now exist (nine unmerged + this run). |
| Caffeine deploy + `.old` refresh | **Unconfirmed.** `snapshots/deployed/` still four files; newest GameKey shape is `pr259-tail-20260901.most`. |
| ADR (AQA-008) | **Still missing** (`docs/**/*ADR*` = 0). |
| Restack #327 | **Still open**, now **49 days** stale, `mergeable: CONFLICTING` vs `0f5363f`. Twin **#370** still `MERGEABLE`. **#331** also CONFLICTING. |
| Pause `9dcfd122` / `f37b7505` / `386a157d` / `67b03c2f` / `fe5b679a` | **Failed.** Complexity reduction and AI designer are RUNNING this hour. Map guardian / Approved Design / combat-parity remain enabled. |

**Integrity already on `main` (accept; do not re-open):** EOP later-file GameKey (#259/#311/#324), Frozen execute/AI MP (#313/#318), barrier A*, spawnPolicy (#287), Attack Nearest caster (#326), Life Drain no-heal (#315), one-shot/unseeded keep (#312/#330), Boss Rush victory feats (#319), accepted-challenge HUD (#332), Enemy Register lore (#328), AP/MP persist cap (#322), Caffeine import + stack-compat gates.

**Independently re-confirmed on `0f5363f` this run (do not rediscover as new bugs):**

| Claim | Line evidence |
| :--- | :--- |
| Swap skip-landing | `WorldExploration.tsx` 9389–9402 copies coordinates; no `applyHazardLanding` anywhere in `src/` |
| Kit-zone object | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)`. Number already exists: `currentZoneTier` at 1136 / set at 4680. `buildEnemyKit` types `levelZone: number` (`enemyAI.ts` 194–199). Twelfth cycle. |
| Catalog = ownership | `adminSafety.ts` 712–718 `usableByPlayer !== false` → include |
| 30% random AI tier | `combatMath.ts` 48–50 |
| Walk barriers, no occupants | `isBattleWalkTileBlocked` (`walkRejectCopy.ts` 21–34) checks wall/void/barrier/portal. Occupants still missing. |
| No telemetry | `longHorizonSim.telemetry.available === false`; no `recordTelemetry` |
| EOP source ready | GameKey on frozen `20260901_000000.mo` `OldActor = {}`; `check-limit = 5`. `ARCHITECTURE.md` on `main` still says `check-limit = 4` (stale living docs). |
| `useSaveKillCount` unwired | Hook exists (`useLeaderboardQueries.ts` 43–50); zero TSX callers. |
| GameKey redeem still raw lock+grant | `redeemGameKeyThroughPersist` (`shopPurchase.ts` 294–330) does not honour unpaid death. **#391** helper still unmerged. |

**09-29 leftovers that are NOT done:** flock halt, deploy confirmation, ADR, #327, landing helper, kit-zone number, ownership persist, occupants on `findPath`, GameKey × unpaid death **wiring**, mapGen freeze, director-index merge.

**Unique leftovers (keep; do not clone):**

| PR | Why unique | Director stance |
| :--- | :--- | :--- |
| **#327** | Striker aim-tile hole. Oldest. **CONFLICTING** vs `main`. 49 days. | Restack/merge (MTD-2026-09-21-003). |
| **#370** | Same hole **plus** AI kit-cast / summon. `MERGEABLE`. | HOLD until after #327; union unique delta only (MTD-2026-09-22-004). |
| **#391** | `gameKeyUnpaidDeath.ts` helper for MIMA-2026-09-02-003. Not wired. `MERGEABLE`. | After halt; then one import in redeem. |
| **#362** | Unbounded GameKey serial + `saveActiveSpells` keep-store. **No new stables.** `MERGEABLE`. | After halt. Unique persist P1. |
| **#380** | Wisp `ctx.heal` fails no-heal (sibling of #315 Life Drain). `MERGEABLE`. | After halt. **#550** is a later twin — HOLD/union. |
| **#385** | Unpaid death-pending scoped to II principal. `MERGEABLE`. | After halt. Isolated persist honesty. |
| **#333** | TBC WAITING_FOR_TELEMETRY docs. | OK after P0 docs/index. Later dated TBC drafts (#395…#768) are twins — keep one. |
| **#354** | Feats vs Achievements recap copy. `MERGEABLE`. | P3 display-only when WX is quiet. |
| **#517** | Hide empty Map Effects overlay. `MERGEABLE`. | Unique display-only P3 after halt. |
| **#536** | Boss Rush jackpot `complete(9)` abort. `MERGEABLE`. | Possible unique P1 **after halt**. |
| **#667** | Drop unpaid-death marker on character delete. `MERGEABLE`. | After halt. Do not sequential-merge with skip-wipe mill. |
| **#664** | GameKey approve double-submit lock. `UNSTABLE`. | After halt. Admin-only. Do not grow the 8.3k dashboard around it. |
| **#338 / #402 / #448 / #509 / #569 / #618 / #666 / #718 / #783** | Prior director roadmaps. | **Close** — this file subsumes all nine. |

**Overlap / HOLD (09-21 leftovers plus 09-22…09-29 clones; none merged in 22 days):**

- mapGen: **31** open `fix(map)` drafts including **#331** (CONFLICTING) and **#770**. Guardian remains enabled.
- persist skip-wipe / remount keep: mill now includes **#742 / #756 / #759 / #764 / #767 / #774 / #800 / #807 / #811 / #812 / #813**. #330 is already on `main`.
- leftover-walk: #501 RAF + clones **plus #761**.
- Swap: HOLD **#541 and #754**. Extract `applyHazardLanding`; do not land another WX Swap branch.
- combat-effect / live-gate: **51** open `fix(combat)` drafts. One execute-path helper after halt.
- WX extract: **#683** + **#730** (ambient occlusion) + tonight’s complexity-reduction agent. Hold while hunters own WX.
- Death Realm skip mill: still HOLD.
- dump-alcove mill: still HOLD.

---

## Seven-dimension evaluation

### 1. Correctness — official client on `main` is safer than 09-01; the leftover queue is not

ENGINEERING on `0f5363f`: death replay, live Doka refs, ignore-client level, GameKey replacing 60s auto-complete, Frozen/Slime execute MP, barrier-aware walk tiles, Attack Nearest caster-tile, one-shot transport-keep. Do not open a fourth persist rewrite.

Recurring defect class: **teleport landing.** Swap still skips occupancy and hazards (`WX` 9389–9402). #754 tries to tax Swap landings **in the leftover queue** — that is the mill, not the helper. Local Attack-Nearest / LoS patches are no longer the bottleneck.

Recurring defect class: **preview vs execute.** Frozen execute MP is closed (#313/#318). Occupants still missing from battle `findPath`. Combat-parity keeps cloning share-gate PRs (**51** open `fix(combat)`).

Recurring defect class: **kit zone NaN.** Piece kits exist. Battle start still passes a LevelZone **object** (`WX` 11920). Every overworld enemy is zone-0. Cheapest unlock of “dynamic enemy spell pools.” Survived **twelve** director cycles. `currentZoneTier` is already a number.

Recurring defect class: **queue vs product.** Correctness work is trapped in 482 drafts in front of a CONFLICTING 49-day Striker PR. Merging that queue would re-create the 09-02 failure. The 22-day outage did not triage it.

### 2. Player experience — honesty on `main`; identity still incomplete

ENGINEERING: HUD leftover XP, recap feats path, recap-under-credit input gate, Enemy Register lore (#328), accepted-challenge HUD (#332), GameKey shop. Those were unique; do not re-implement.

DESIGN (PXA + Expansion + Spell Admin, no player data): the player is still handed the live catalog on minute one (`adminSafety.ts` 717). Enemy-observed discovery is **not implemented**. Achievement/challenge/boss rewards remain Doka/XP, not spells. Four map modifiers are announce-only stubs. `worldFeatures.ts` is still tests-only (`README.md`).

GameKey is a real PX/ops change in **source**. Live Caffeine deploy of the 20260901 tail is **unconfirmed** after 48 days.

MEASURED: none. Do not claim spells are over/underused. TBC drafts that retune BAL-* without counters are DESIGN INTERPRETATION only. Nine WAITING_FOR_TELEMETRY twins (#333…#768) already exist; tonight’s telemetry-architecture agent should not open a tenth.

### 3. Technical health — freeze held; flock restarting after an outage

| Surface | Lines now | 09-02 director | Verdict |
| :--- | ---: | ---: | :--- |
| `WorldExploration.tsx` | 19,213 | 19,253 | Frozen size; 482 drafts wait to grow it |
| `AdminDashboard.tsx` | 8,280 | 8,035 | Grew on `main` through 09-03. No publish pipeline |
| `enemyAI.ts` | 2,580 | 2,583 | Frozen size; AI designer RUNNING tonight |
| `main.mo` | 3,903 | 3,838 | GameKey + clamps; deploy of 20260901 unconfirmed |
| `mapGen.ts` | 1,937 | 1,544 | Freeze broken on `main`; **31** open punches |
| `progressPersist.ts` | 421 | 323 | Grew on `main` through 09-03. Leave it |
| `targeting.ts` | 1,199 | 1,031 | Leave it |
| `deathPenalty.ts` | 597 | 597 | Leave it |
| `spawnPolicy.ts` | 297 | — | Leave it |

Caffeine import gates plus stack-compat are process wins that should stay. Oldest-first now **blocks the living director index**: #327 CONFLICTING sits at the head; nine superseded director PRs all rewrite `MASTER_ROADMAP.md`.

Stale paths remain documented, not live bugs: `dfx.json` → missing `src/backend_extended`; root `declarations/` 15-field snapshot. `ARCHITECTURE.md` on `main` still lists `check-limit = 4` while `mops.toml` is `5` — another cost of the living index never landing.

### 4. Content depth — over-specified, under-wired, over-cloned, then frozen by outage

Present on `main`: player-relative tier spawn, AI tiers 1–10, named boss kits, dungeon chain, Boss Rush, challenges, feats, frontend catalog + GameKey shop.

Dead or contradictory vs core rules:

- `buildEnemyKit(..., currentMap.levelZone)` still passes an **object** → zone-0 kits forever.
- `computeAITier` still has a **30% fully random 1–10** roll.
- Dual spell catalogs; admin add still grants everyone on hydrate.
- `worldFeatures.ts` still tests-only.
- Wave 4…12 spell / formation / encounter / boss catalogs exist as **unmerged docs twins** (09-21 through 09-29). That is expansion overlap, not a license to implement. Tonight **AI, boss, dungeon-encounter, and formations agents are running**.

The 22-day outage did **not** reduce overlap. It only stopped new twins. Tonight’s restart will reprint Wave-13 catalogs unless those agents stay ACTION_IDs-only.

### 5. Long-term scalability — rules vs implementation

| Core rule | Implementation on `0f5363f` |
| :--- | :--- |
| No character level cap | Yes (`applyRewards` Nat loop). HUD saturates at 48 (HOLD; do not retune). |
| Increasing XP | Yes `100 * 2^(N-1)`. Practical wall is design, not a tonight bug. |
| Player-relative enemies | Yes until the 999-tier ceiling. |
| Progressively sophisticated enemies | Partial; 30% random tier + zone-0 kits undermine it. |
| Dynamic enemy spell pools | Boss phases yes; overworld = static piece kits stuck at zone 0. |
| Enemy-observed spell discovery | **Absent** |
| Achievement / challenge / boss spell unlocks | Rewards are Doka/XP |
| Backend-authoritative persistence | Wallet/XP/death yes (clamped; level pinned). Combat client-side. Achievement unlock still client-asserted. BuffShop potions still `${principal}_inventory`. GameKey redeem is canister-authoritative **in source**; live deploy unconfirmed. |
| Optional owner-uploaded visuals + pixel fallback | Still true. Do not make URLs required. |
| Admin Draft → Validate → Activate | **Not a canister workflow.** |

Expansion that adds spells, AI behaviors, or admin chrome **before** halt, #327 restack, landing-authority extraction, ADR, and deploy confirmation will not scale. Tonight’s AI / boss / dungeon / complexity agents are the violation class.

### 6. Data / persistence safety — official client safer; ops unconfirmed for 48 days

`saveBattleStats` may still **lower** Doka/XP (required for heals/spends/death). It must not raise them — that write is on `main`. Finding 3 is still stale if phrased as “must not write Doka.” Client level can no longer demote. AP/MP capped (#322).

`applyRewards` is still client-trusted **within** 100k/500k. `calculateAndAwardDoka` remains an unused public mint. `markAchievementUnlocked` is still unproven.

#330 keep is on `main`. The skip-wipe mill (#742…#813) is **not** a second keep path to merge. Unpaid-death × GameKey honour lives on **#391** (helper, unwired).

New stables still need a **later** file after `20260901`. Do not stuff `20260831` or `20260901`.

### 7. Automation coherence — P0: outage was not a halt; the flock is restarting

Halt-as-config has failed every midnight that actually ran since 08-31. Halt-as-merge-stop has held **48 days**. The new split:

| Control surface | 09-21…09-29 | 09-30…10-20 | 10-21 00:00 |
| :--- | :--- | :--- | :--- |
| Dashboard pause | Failed | Failed (automations still enabled) | Failed (22 RUNNING) |
| Human merge-stop | Held | Held | Held so far |
| Agent completion | ~50 drafts/day | **ERROR in ~30s, 0 PRs** | **RUNNING again** |

Do **not** treat the 22-day PR silence as proof that MTD-2026-08-31-001 is done. The enabled implementers (`67b03c2f`, `386a157d`, `39040ad2`, `73740435`, plus still-enabled `9dcfd122` / `fe5b679a` / `f37b7505` / `3089f18d`) will reprint the mill the moment they finish.

Cursor Cloud has **no write API** for dashboard prompts (`get-automation` is read-only). Halt is a human config action. In-repo gates are the enforceable half.

| AQA / MTD ID | Director status 2026-10-21 |
| :--- | :--- |
| AQA-001 hunter throttle | **OPEN** — `996df6df` still not GetAutomation-visible. `1aa41c6c` enabled (ERROR ~15h ago, not paused). |
| AQA-002 one critical hunter | **OPEN** |
| AQA-003 in-repo ACTION_ID ledger | **PARTIAL** — dated producer files exist; living director index never lands on `main`. |
| AQA-006 no mapGen implementation | **BROKEN** — 1,937 lines; **31** open punches; guardian enabled. |
| AQA-007 freeze drive-by WX | **BROKEN** — complexity-reduction RUNNING; leftover queue full of WX PRs. |
| AQA-008 security → ADR | **PARTIAL** — clamps on `main`; no ADR. Security RUNNING tonight. |
| AQA-012 outcome telemetry | **OPEN** — TBC correctly WAITING; telemetry-architecture agent RUNNING with nothing to display. |
| MTD-001 flock halt | **OPEN** — failed as config through 09-29; **outage** 09-30…10-20; failing again 10-21. Merge-stop held 48 days. |
| MTD-2026-09-25-005 | **OPEN** — oldest-first vs living index. #327 now 49 days CONFLICTING. |
| MTD-2026-10-21-001 | **NEW** — hold tonight’s restart. Do not confuse 22 silent days with a halt. |
| MTD-2026-10-21-003 | **NEW** — classify the 22-day ERROR mill. |

---

## Recurring hotspots — local patches no longer sufficient

Do **not** automatically perform a large refactor.

1. **Automation queue + restart** — 482 drafts, then a 22-day ERROR gap, then a 22-agent restart. Local “one more fix PR” is how the mill works. The intervention is **disable implementers** + **close superseded director PRs** + **restack #327** + **do not merge-burst**.
2. **Landing / occupancy / MP-cost authority** — Swap + summon-walk hazards + occupants on `findPath` need **helpers**, not more WX branches. Occupancy dest for summons already exists. Next is `applyHazardLanding`. Hold #541 and #754.
3. **Kit-zone number** (PREREQ-A) — not a refactor. One call site. Unblocks dynamic pools. Wait until the flock is held. Twelfth cycle.
4. **Canister trust** — write the ADR (AQA-008). Until it exists, no new credit APIs and no discovery grant writer.
5. **mapGen portal-punch / battle-graph** — 31 open punches. Guardian still enabled. Fixtures + ACTION_IDs only.
6. **EOP** — source chain is correct. Ops (deploy + `.old` refresh) is the remaining half and is now **48 days** stale. Do not add stables.
7. **Combat-gate mill** — 51 open `fix(combat)` drafts. One execute-path helper after halt, not sequential merges.

HP/death extraction (MTD-003) is still valid. Do not start it in the same hour as this flock.

---

## Human merge queue (do not autonmerge)

| Order | PR | Action |
| :--- | :--- | :--- |
| 1 | **This docs PR** | Merge after closing superseded director snapshots, **or** close those first so oldest-first can accept the living index. |
| 2 | **#327** | Restack onto `0f5363f`, then merge. Unique Striker P1. Currently CONFLICTING. |
| 3 | **#370** | Union unique AI/summon delta only. |
| — | **#391** | GameKey unpaid-death helper. After halt. Then one redeem wire. |
| — | **#362** | GameKey serial / saveActiveSpells keep-store. After halt. No new stables. |
| — | **#380** | Wisp no-heal. After halt. Hold #550. |
| — | **#331** | **Hold.** CONFLICTING mapGen. |
| — | **#333** | One TBC WAITING_FOR_TELEMETRY docs file. Close later dated TBC twins. |
| — | **#354 / #517** | Unique display P3 after halt. |
| — | **#536** | Boss Rush jackpot. After halt. |
| — | **#338 #402 #448 #509 #569 #618 #666 #718 #783** | **Close without merge.** |
| — | **#541 #754** | HOLD Swap. |
| — | map / persist skip-wipe / leftover-walk / combat-effect / live-gate / WX-extract / RAF mills | **Hold.** |
| — | Any PR from the 2026-10-21 00:00 wave | Default **hold**. Especially hold mapGen, persist, targeting, `enemyAI`, AdminDashboard, `main.mo` stables, telemetry UI, WX, RAF, AI, boss, dungeon encounters, and Approved Design implementation. |

Do not restack death-replay, `writeLiveDoka`, `writeLevel`, leftover-XP HUD, recap click-through, GameKey product, Frozen execute MP, spawnPolicy, Attack Nearest caster, or accepted-challenge HUD.

---

## Prioritized roadmap (what to work next)

**P0 — do these before any leftover gameplay PR merges**

1. Halt the 10-21 same-hour implementer flock (MTD-2026-08-31-001, MTD-2026-10-21-001). Pause map guardian, complexity reduction, Approved Design Implementer, combat-parity, AI designer, boss/dungeon implementers, admin implementer, critical hunter. Do **not** call the 22-day ERROR gap a halt (MTD-2026-10-21-003).
2. Do not merge-burst the 482 leftover drafts (MTD-2026-10-21-004).
3. Close superseded director PRs #338/#402/#448/#509/#569/#618/#666/#718/#783; land this living index (MTD-2026-10-21-002). Restack #327 so oldest-first is not a 49-day CONFLICTING gameplay PR (MTD-2026-09-25-005).
4. Confirm Caffeine deploy of the 20260901 GameKey tail and refresh `.old` (MTD-2026-09-21-002). Freeze new stables until that is proven (MTD-2026-09-02-003).
5. Write the reward-trust ADR (AQA-008).

**P1 — infrastructure / gameplay integrity (after halt)**

6. Restack/merge #327 then union #370 unique delta (MTD-2026-09-21-003 / MTD-2026-09-22-004).
7. Re-freeze `mapGen.ts`, `targeting.ts`, `enemyAI.ts`, and WX drive-bys (AQA-006, AQA-007). Solvability Guardian = fixtures + ACTION_IDs only.
8. Extract `applyHazardLanding` for Swap + controlled-summon walk (MIMA-001). Hold #541/#754.
9. Shared occupants on battle path (MIMA-2026-09-01-002 remainder).
10. Wire #391 unpaid-death honour into GameKey redeem (MIMA-2026-09-02-003). Merge #362 serial cap.
11. Controlled HP/death extraction (MTD-2026-08-31-003) **after** landing helpers — not tonight.

**P2 — high-value expansion (after P0/P1, not this hour)**

12. Outcome counters, then maybe a dashboard (AQA-012 before TADD UI).
13. Fix kit-zone call site (Expansion PREREQ-A) — pass `currentZoneTier` (number), not `levelZone` object.
14. Enemy-observed spell discovery + ownership maps (SDA-002/003/004). Requires persist lock + metadata; never `spell.name`. Requires a **new later** migration after deploy confirmation.
15. Admin Draft → Validate → Activate on the canister (SDA-005 / MTD-006). Do not grow the 8.3k dashboard first.
16. Seed frontend starter ids; stop treating `usableByPlayer` as ownership (SDA-007).
17. Revisit `computeAITier` 30% random vs progressive sophistication (MTD-008). Report/design, not an `enemyAI.ts` rewrite.
18. Wire `saveKillCount` or drop it from the leaderboard (MTD-005).

**P3 — polish**

19. Recap / HUD leftovers already shipped — do not restack.
20. #354 Feats copy and #517 empty Map Effects — unique display after halt.
21. Visual / game-feel / mobile — DESIGN.md already specifies the look. Do not edit combat math or WX for feel during this flock.
22. Dead-code / maintainability — report only while hunters are hot.

---

## Contradictions and duplicates (do not re-litigate)

| Conflict | Resolution |
| :--- | :--- |
| Security “don’t write Doka from `saveBattleStats`” vs ARCHITECTURE | Write stays; **clamp / no-mint**. ADR still required. |
| Solvability vs `AGENTS.md` mapGen | #110 plus later punches already merged; **freeze**; hold all **31** open punches. |
| AQA-004 vs human merge of 08-30…09-03 stacks | Accept `main`; clean leftovers; do not re-open merged themes. |
| Frozen preview vs execute | Execute now uses `battleWalkMpCost`. Do not re-file 09-01-001. |
| #327 vs #370 Striker | One helper. Oldest #327 first; #370 unique AI/summon only. |
| #380 vs #550 Wisp heal | One no-heal path. #380 first; hold #550. |
| #541 vs #754 Swap | HOLD both. Extract `applyHazardLanding`. |
| Progressive AI vs 30% random tier | Design decision later; no first-hour AI PR. Tonight’s AI agent is the violation. |
| SDA vs SDE vs SPELL_DISCOVERY vs EBA vs BOSS docs | One discovery persist shape (SDA-002/004). Others are content cards. Wave 4…12 catalogs are twins. |
| Expansion specialists vs “P0/P1 first” | Tonight’s AI / boss / dungeon / complexity agents are the violation. Hold implementation. |
| Telemetry dashboard vs no counters | AQA-012 first. TBC stays WAITING_FOR_TELEMETRY. |
| Empty/Aug-31 `.old` vs live Caffeine | `.old` is the **real** Aug-31 signature (no GameKey). Import of HEAD should pass. Deploy still unconfirmed. Do not hand-write `.old`. |
| GameKey on `main` vs canister | Source is ahead of confirmed deploy. Do not revert GameKey product. |
| `usableByPlayer=false` as retire vs enemy-only gate | SDA-2026-09-01-001; do not extend the flag. |
| Family HP paper vs `calcEnemyMaxHp` | PREREQ-H; honesty bug; not an AI rewrite. |
| 48-day freeze vs “halt failed” vs 22-day PR silence | Halt failed as **config**. It succeeded as **human merge stop**. The 22-day gap was **ERROR/boot**, not dashboard pause. Cron restart without dashboard change undoes the config half; merging the leftover queue undoes the merge-stop half. |
| #338…#783 vs this PR | This file subsumes all nine. Close them without merge. |
| 09-22…09-29 persist HUD twins vs #330 keep | #330 is on `main`. Hold the twins including #742…#813. |
| #501 leftover walk rAF vs `AGENTS.md` | RAF is frozen. Hold #501 and #761 even if the race is real. |
| Oldest-first stack vs living director index | Close superseded director snapshots; restack #327; do not merge-burst 482 drafts (MTD-2026-09-25-005). |
| Combat-parity UUID `-a486` vs `-a484` | Live automation is `f37b7505-a484`. |
| `ARCHITECTURE.md` `check-limit = 4` vs `mops.toml` `5` | Stale `main` docs. Living index never landed. Do not “fix” by a Motoko PR. |

---

## TOP 5 CURRENT PRIORITIES

1. **Halt the 2026-10-21 00:00 implementer flock** (22 agents already RUNNING, including AI `67b03c2f`, complexity reduction `386a157d`, boss `39040ad2`, dungeon encounters `73740435`) and **do not merge-burst the 482 leftover drafts**. The 22-day PR silence was an ERROR outage, not a halt. First-run and expansion specialists: ACTION_IDs only. Especially hold mapGen, persist, targeting, `enemyAI`, AdminDashboard, `main.mo` stables, telemetry UI, WX, RAF.
2. **Unblock the living director index** — close #338/#402/#448/#509/#569/#618/#666/#718/#783 without merge; **restack #327** so oldest-first is not a 49-day CONFLICTING gameplay PR sitting in front of every later change (MTD-2026-09-25-005).
3. **Confirm Caffeine deploy of the 20260901 GameKey tail** and refresh `.old` from that build (MTD-2026-09-21-002). Source has been ready for 48 days; ops is not proven.
4. **Reward-trust ADR (AQA-008)** — clamps, ignore-client level, and AP/MP cap landed; the written decision did not. Security is running again tonight.
5. **After halt: merge restacked #327** (Striker AoE/bounce), then union #370’s AI/summon delta only, then **re-freeze WX / mapGen**.

## BLOCKED WORK

- Spell discovery / observed enemy kits / new unlock loops — no ownership persist, combat landing still racing, ADR unwritten, Caffeine deploy of GameKey unconfirmed.
- Enemy AI capability expansion — `enemyAI.ts` already 2,580 lines; kits never leave zone 0; HP/death still dual-written. Tonight’s AI agent must not grow it.
- Telemetry admin dashboard — no counters to display (AQA-012). Balance analyst correctly WAITING. Dashboard UI this hour is skip. Telemetry-architecture agent is already RUNNING.
- Any Motoko PR that adds stables until deploy is confirmed and `.old` refreshed.
- Further `mapGen.ts` punches (**31** open drafts, including **#770**) without an explicit human playtest of the #321→#329 sequence.
- Custom-client mint proofs / new credit APIs until the ADR exists.
- `calculateAndAwardDoka` productization (unused official path; still a sink).
- Formula-level `BAL-*` / `LHIPS-*` retunes (no telemetry; jackpot 100k clamp is architecture).
- Admin Draft→Validate→Activate chrome on the 8.3k dashboard before canister lifecycle exists.
- Sequential merge of the 482 leftover gameplay drafts “to clear the queue.”
- RAF / walk-stepper edits (#501/#761), leftover-walk mill, Death Realm skip mill, dump-alcove mill, live-gate mill, combat-effect mill (**51** `fix(combat)`), Swap mill (#541/#754).
- Approved Design / AI / boss / dungeon implementation from tonight’s flock.

## SAFE EXPANSION WORK

- Land this docs PR; close #338, #402, #448, #509, #569, #618, #666, #718, and #783.
- Restack/merge #327 (scoped Striker helper + tests). Do not duplicate it in #370 until unioned.
- Adopt per-producer ledgers + this director index (AQA-003) — process, not gameplay.
- Design-only (no PR): keep SDA/SDE/EBA catalogs; do not author a fifth discovery schema; do not implement Wave 13 boss sheets or AI behaviors.
- Query-only / persist-lock-enqueued counters (AQA-012) — **design + tiny isolated PR after flock halt**, not a dashboard.
- Kit-zone number fix (PREREQ-A) **after** the flock is held — one call site + `enemyAI` test, no WX growth.
- Display-only unique copy if orchestrator finds one hole not already on `main` or drafted (#354 Feats copy, #517 empty Map Effects).
- Merge #391 helper (new file) after halt — does not touch WX / mapGen / persist lock.

## AREAS TO STOP TOUCHING TEMPORARILY

- `src/frontend/src/components/WorldExploration.tsx` except one-line helper wiring
- `src/frontend/src/engine/mapGen.ts` (including all 31 open punches and dump-alcove)
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
- `docs/automation/ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, and `ACTION_IDS_2026-09-21.md` through `ACTION_IDS_2026-09-29.md` (do not append)
- GameKey product methods except unpaid-death honour on the existing redeem helper

## ARCHITECTURAL HOTSPOTS

1. Unconfirmed Caffeine deploy vs correct-in-source EOP chain (`20260901` GameKey; `.old` still Aug-31) — now **48 days**
2. Dual HP / death / landing authority (React snapshot vs `combatantsRef` vs Swap/summon/destack teleport)
3. Client-trusted `applyRewards` without a written ADR (clamps exist; decision does not)
4. 19k-line world orchestrator absorbing every hunter (still the magnet; leftover drafts wait to grow it)
5. Automation pile-on (**482** leftover drafts + 10-21 restart already RUNNING) after a 22-day ERROR outage that was **not** a halt
6. Oldest-first queue vs living director index (#327 CONFLICTING head blocks the roadmap; #331 also CONFLICTING; ten director snapshots)
7. mapGen portal-punch / battle-graph (**31** open drafts)
8. Dual spell catalogs + implicit ownership (blocks discovery)
9. Kit-zone object call site (dynamic pools implemented and dead; number already in `currentZoneTier`; twelfth cycle)
10. Striker victim-tile authority split across #327 and #370
11. Unseeded-wallet HUD twins stacked on the #330 keep (now including #742…#813)
12. Leftover-walk abort mill (#501 RAF + clones + #761)
13. Death Realm pending vs wallet writes
14. Combat live-gate / catalog-effect mill (**51** open `fix(combat)`)
15. Swap mill (#541 + #754) instead of `applyHazardLanding`
16. AI / boss / dungeon / complexity implementers running against an over-specified, under-wired catalog

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
9. unseeded-lock HUD vs committed Doka after one-shot / GameKey / feat (09-22…09-29 persist twins — if wallet “resets,” ENGINEERING is hydrate, not player spend)
10. leftover-walk after last hostile / into Death Realm / into battle start (#501/#761 mill — if players “slide” after victory, ENGINEERING is walk-cancel, not feel)
11. Death Realm pending vs shop/heal/GameKey (if wallets move during 1.5s death, ENGINEERING is missing a shared guard, not player intent)
12. Shield / shred / Trap / Soul Rend / drain / Pacifist-kit / Chain Lightning bounce casts vs advertised numbers (combat-effect mill — if players call those spells “broken,” ENGINEERING may be execute-path skip, not balance)

Until those exist: automations must not claim CLEAR_POSITIVE_SIGNAL or “players don’t use X.” Distinguish MEASURED PLAYER BEHAVIOUR (none) from DESIGN INTERPRETATION and ENGINEERING EVIDENCE.

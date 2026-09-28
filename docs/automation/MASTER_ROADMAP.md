# Stralt Master Roadmap

**Director:** Stralt Master Technical Director (`0b92479e-a49e-11f1-a7d1-d6b4613131ce`)  
**Run:** 2026-09-28 00:04 UTC (daily cron)  
**This agent:** `bc-8512c98f-610f-4d2a-8ec1-1e24abffc8e0`  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (accepted-challenge HUD)  
**Prior director:** 2026-09-27 00:04 (`bc-73ca358b-c9e0-47d9-98c2-aeddcf014344`, unmerged [#666](https://github.com/Mr-Melic/stralt/pull/666)). On `main` this file is still the 2026-09-02 text. Unmerged [#338](https://github.com/Mr-Melic/stralt/pull/338) / [#402](https://github.com/Mr-Melic/stralt/pull/402) / [#448](https://github.com/Mr-Melic/stralt/pull/448) / [#509](https://github.com/Mr-Melic/stralt/pull/509) / [#569](https://github.com/Mr-Melic/stralt/pull/569) / [#618](https://github.com/Mr-Melic/stralt/pull/618) / [#666](https://github.com/Mr-Melic/stralt/pull/666) are stale snapshots of the same living files.  
**Gameplay / production code:** not modified.

This file is the living prioritized roadmap. ACTION_ID records for this run live in [`ACTION_IDS_2026-09-28.md`](./ACTION_IDS_2026-09-28.md). Do **not** append to `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, or `ACTION_IDS_2026-09-21.md` through `ACTION_IDS_2026-09-27.md`. Process audit: [`QUALITY_AUDIT_2026-08-30.md`](./QUALITY_AUDIT_2026-08-30.md). Close **#338**, **#402**, **#448**, **#509**, **#569**, **#618**, and **#666** when this PR lands (MTD-2026-09-28-002).

## Evidence available this run

| Source | Status |
| :--- | :--- |
| `AGENTS.md`, `README.md`, `DESIGN.md`, `docs/ARCHITECTURE.md` | Read |
| Prior director (2026-09-27) | Memories + #666 body. P0 leftovers **not** landed. Halt-as-config **failed**; halt-as-merge-stop **held**. Validation “≤3 new gameplay PRs from the 09-27 wave” **failed** (24 non-docs that calendar day; 55 drafts total #660–#714). |
| Specialist reports on `main` | Still dated 2026-09-02 (plus orchestrator [`ACTION_IDS_2026-09-03-0000.md`](./ACTION_IDS_2026-09-03-0000.md)). 09-21…09-28 reports exist only on unmerged drafts. |
| Open ACTION_IDs | Hundreds still `NEW` across dated producer files. Reuse; do not mint twins. |
| Recent commits | `main` last moved 2026-09-03 00:28 UTC. **Zero** commits for **25 days**. HEAD still `0f5363f`. `git fetch origin main` confirms remote is the same SHA. |
| Open drafts | **383** at 00:04 (`gh pr list --state open`), then **#715** opened at 00:07 during this run (`docs(val)` — hold if it grows into gameplay). Leftover **#327** (Striker, `CONFLICTING`, **26 days**) + **#331** (mapGen HOLD, also `CONFLICTING`) + **#333–#659** leftover mill + **#660–#714** (09-27 wave). |
| Player telemetry | **Still none.** TBC stays `WAITING_FOR_TELEMETRY`. Zero `recordTelemetry` in `src/`. `longHorizonSim.telemetry.available === false`. |
| Same-hour flock (this minute) | **40** automations already launched ~00:00 UTC 2026-09-28. Includes **Admin Dashboard Implementation Engineer** `3089f18d-a49a`, **map guardian** `9dcfd122-a484` (enabled, RUNNING), **Combat Rules Consistency Auditor** `f37b7505-a484` (**now GetAutomation-visible** as `-a484`, enabled, RUNNING — prior runs looked up `-a486`), **complexity reduction** `386a157d-a4a5`, **AI designer** `67b03c2f-a492` (enabled, RUNNING), **critical hunter** `1aa41c6c-a483`, economy, adversarial QA, security `c97e5c0c-a485`, spell mechanics, player-data evolution, admin trio, world/encounters/formations/visuals, game feel, TBC `2786666f-a4a0`. **Not** in this hour’s 40: persist auditor `607e0304-a484`, expansion `3f31b18f`, Approved Design Implementer `fe5b679a`. `996df6df` still not GetAutomation-visible. |

**Evidence classes used below**

| Class | Meaning |
| :--- | :--- |
| MEASURED PLAYER BEHAVIOUR | Live play counters. **None exist.** |
| DESIGN INTERPRETATION | Product rules in this prompt + `AGENTS.md` / `DESIGN.md` / specialist design docs |
| ENGINEERING EVIDENCE | Code on `0f5363f`, tests, **383**-draft queue, Caffeine `.old` still the 2026-08-31 no-GameKey signature |

Telemetry is not allowed to set priority. Correlation is not causation. No CLEAR_POSITIVE_SIGNAL is claimed.

---

## What changed since the 09-27 director run (24 hours)

The 09-27 run asked: halt the flock; do not merge-burst 328 leftover drafts; close #338/#402/#448/#509/#569/#618; confirm Caffeine deploy; write the ADR; restack #327.

**What actually happened**

| Ask | Outcome |
| :--- | :--- |
| Halt 09-27 implementers | **Config failed.** Wave opened **#660–#714** (**55** new drafts that calendar day). **24** were non-docs (22 `fix` + 1 `refactor` + 1 `perf`). |
| ≤3 new gameplay PRs from 09-27 | **Failed.** 24 non-docs. Same count as 09-26. |
| 0 new mapGen / persist-HUD / leftover-walk / combat-effect PRs | **Failed.** Map **#688 / #697 / #704 / #711**. Persist skip-wipe **#698 / #705 / #710**. Leftover-walk **#702 / #706**. Combat-effect mill **#692 / #699 / #700 / #709 / #714**. Live-gate **#701 / #708**. WX extract **#683**. |
| Humans merge the flock | **Did not.** `main` still `0f5363f`. Merge-stop held a **seventh** full day (**25 days** total). |
| Merge director #338 / #402 / #448 / #509 / #569 / #618 / #666 | **Did not.** `main` still serves the 09-02 roadmap. **Eight** living director files now exist (seven unmerged + this run). |
| Caffeine deploy + `.old` refresh | **Unconfirmed.** `snapshots/deployed/` still four files; newest GameKey shape is `pr259-tail-20260901.most`. |
| ADR (AQA-008) | **Still missing** (`docs/**/*ADR*` = 0). |
| Restack #327 | **Still open**, now **26 days** stale, `mergeable: CONFLICTING` vs `0f5363f`. Twin **#370** still open. **#331** also CONFLICTING. |
| Pause `9dcfd122` / `f37b7505` / `386a157d` / `67b03c2f` | **Failed.** All four are **enabled and RUNNING** this hour. Combat-parity UUID correction: live id is `f37b7505-a484` (not `-a486`). |
| `fe5b679a` / `3f31b18f` / persist `607e0304` stay idle | **Partial.** Those three are **not** in this hour’s 40. Admin implementer `3089f18d-a49a` **is**. |

**Integrity already on `main` (accept; do not re-open):** EOP later-file GameKey (#259/#311/#324), Frozen execute/AI MP (#313/#318), barrier A*, spawnPolicy (#287), Attack Nearest caster (#326), Life Drain no-heal (#315), one-shot/unseeded keep (#312/#330), Boss Rush victory feats (#319), accepted-challenge HUD (#332), Enemy Register lore (#328), AP/MP persist cap (#322), Caffeine import + stack-compat gates.

**09-27 leftovers that are NOT done:** flock halt, deploy confirmation, ADR, #327, landing helper, kit-zone number, ownership persist, occupants on `findPath`, GameKey × unpaid death **wiring**, mapGen freeze, director-index merge.

**Unique leftovers (keep; do not clone):**

| PR | Why unique | Director stance |
| :--- | :--- | :--- |
| **#327** | Striker aim-tile hole (400/800). Oldest. **CONFLICTING** vs `main`. 20 files. | Restack/merge (MTD-2026-09-21-003). |
| **#370** | Same hole **plus** AI kit-cast / summon. | HOLD until after #327; union unique delta only (MTD-2026-09-22-004). |
| **#391** | `gameKeyUnpaidDeath.ts` helper for MIMA-2026-09-02-003. Not on `main`. Not wired. | After halt; then one import in redeem. |
| **#362** | Unbounded GameKey serial + `saveActiveSpells` keep-store. **No new stables.** | After halt. Unique persist P1. |
| **#380** | Wisp `ctx.heal` fails no-heal (sibling of #315 Life Drain). | After halt. Isolated challenge honesty. **#550** is a later Wisp Blood Mend twin — HOLD/union. |
| **#385** | Unpaid death-pending scoped to II principal. | After halt. Isolated persist honesty. |
| **#333** | TBC WAITING_FOR_TELEMETRY docs. | OK after P0 docs/index. Later dated TBC drafts are twins — keep one. |
| **#354** | Feats vs Achievements recap copy. | P3 display-only when WX is quiet. |
| **#517** | Hide empty Map Effects overlay. | Unique display-only P3 after halt. |
| **#536** | Boss Rush jackpot `complete(9)` abort. | Possible unique P1 **after halt**. |
| **#667** | Drop unpaid-death marker on character delete. | After halt. Isolated persist honesty. Do not sequential-merge with skip-wipe mill. |
| **#664** | GameKey approve double-submit lock. | After halt. Admin-only. Do not grow the 8.3k dashboard around it. |
| **#338 / #402 / #448 / #509 / #569 / #618 / #666** | Prior director roadmaps. | **Close** — this file subsumes all seven. |

**Overlap / HOLD (09-21 leftovers plus 09-22…09-27 clones):**

- mapGen: prior twenty-four **plus #688 #697 #704 #711** (now **twenty-eight** punches). Guardian remains enabled and is RUNNING this hour.
- Persist skip-wipe / unseeded-HUD: prior mill **plus #698 #705 #710**.
- Combat-effect / live-gate: prior mill **plus #692 #699 #700 #701 #708 #709 #714**.
- Leftover-walk: prior mill **plus #702 #706**. Hold **#501 RAF**.
- Swap **#541**. Death Realm skip mill. WX extracts **#639 / #683**. Dungeon-editor CSS mill (**#673** and dated twins after #286).
- Eight director snapshots on the same living files.

---

## Seven-dimension evaluation

### 1. Correctness — official client on `main` is still the 09-03 snapshot

ENGINEERING: Death replay, live Doka refs, ignore-client level, GameKey, Frozen execute MP, barrier A*, Attack Nearest caster, accepted-challenge HUD remain on `main`. Do not open a fourth persist rewrite or a second Frozen-MP PR.

Recurring defect class: **teleport landing.** Swap still skips occupancy and hazards (`WorldExploration.tsx` 9389–9402). Glob `applyHazardLanding` = 0. Local Attack-Nearest / LoS patches are no longer the bottleneck — **landing authority** still is. Hold #541.

Recurring defect class: **preview vs execute / live-gate mill.** Frozen/Slime execute MP is closed (#313/#318). Combat-parity and leftover-walk hunters keep opening twin PRs against a frozen HEAD. That is clone-mill, not a new formula bug.

Recurring defect class: **kit zone NaN.** `buildEnemyKit` takes `levelZone: number` (`enemyAI.ts` 194–199). Battle start still passes `currentMap.levelZone` **object** (`WX` 11920). `currentZoneTier` already exists (`WX` 1136 / 4680). Tenth director cycle. Cheapest unlock of “dynamic enemy spell pools.”

Recurring defect class: **EOP stables.** Source chain is correct (`20260831` frozen without GameKey; `20260901` adds GameKey with `OldActor = {}`). Live Caffeine deploy of that tail is **still unconfirmed**. `.old` is still the Aug-31 no-GameKey signature. Do not add more persistent `let`/`var`.

### 2. Player experience — honesty on `main`; identity still incomplete

ENGINEERING: HUD leftover XP, recap feats path, Buy Doka vs Items, BuffShop `inventoryRef`, Pacifist preview, Enemy Register lore, challenge HUD after accept. Those were unique; do not re-implement.

DESIGN (PXA + Expansion + Spell Admin, no player data): the player is still handed the live catalog on minute one (`shouldIncludeBackendSpellInLibrary` returns true whenever `usableByPlayer !== false`, `adminSafety.ts` 712–718). Enemy-observed discovery is **not implemented**. Achievement/challenge/boss rewards remain Doka/XP, not spells.

MEASURED: none. Do not claim spells are over/underused.

### 3. Technical health — freeze held; hotspot files unchanged; queue is the health metric

| Surface | Lines now | 09-02 director | Verdict |
| :--- | ---: | ---: | :--- |
| `WorldExploration.tsx` | 19,213 | 19,253 | Frozen size; **383** drafts wait to grow it |
| `AdminDashboard.tsx` | 8,280 | 8,035 | Frozen size; admin implementer RUNNING tonight |
| `enemyAI.ts` | 2,580 | 2,583 | Frozen size; AI designer RUNNING tonight |
| `main.mo` | 3,903 | 3,838 | Frozen; no new stables |
| `mapGen.ts` | 1,937 | 1,544 | Frozen size; **twenty-eight** open punches |
| `progressPersist.ts` | 421 | 323 | Leave it |
| `targeting.ts` | 1,199 | 1,031 | Leave it |
| `deathPenalty.ts` | 597 | 597 | Leave it |

Caffeine import gates plus stack-compat remain the enforceable process. Oldest-first now has a **CONFLICTING** 26-day gameplay PR (#327) and a CONFLICTING mapGen PR (#331) at the head of a 383-draft queue. That is a **release-process P0**, not a code defect on HEAD.

Stale paths remain documented, not live bugs: `dfx.json` → missing `src/backend_extended`; root `declarations/` 15-field snapshot; unused `src/backend/mixins/*`.

### 4. Content depth — over-specified, under-wired, catalogs still cloning

Present on `main`: player-relative tier spawn, AI tiers 1–10, named boss kits, dungeon chain, Boss Rush (10 rooms), 9 challenges, feats, frontend catalog + GameKey shop.

Dead or contradictory vs core rules:

- `buildEnemyKit(..., currentMap.levelZone)` still passes an **object** → zone-0 kits forever.
- Summoner chance saturates by the mid-40s.
- `pickEnemyLevelFromTiers` `maxTier = floor(999 / tierSize)` stops climbing.
- `computeAITier` still has a **30% fully random 1–10** roll (`combatMath.ts` 48–50).
- Dual spell catalogs; admin adding a catalog spell still grants it to every player on hydrate.
- `ENEMY_AI_TIER_GATES` names still unused in `enemyAI.ts`.

09-21…09-27 design specialists produced overlapping Wave-N catalogs (SDA, SDE, SPELL_DISCOVERY, EBA, ENEMY_AI, FORMATIONS, ELITE, WORLD_DYNAMICS, ENCOUNTER, VISUAL, SPELL_PROPOSALS). That is **expansion overlap**, not a license to implement. AI designer and spell-mechanics automations are RUNNING again tonight — default **hold**.

### 5. Long-term scalability — rules vs implementation

| Core rule | Implementation on `0f5363f` |
| :--- | :--- |
| No character level cap | Yes (`applyRewards` Nat loop). HUD saturates at 48 (LHIPS-001 HOLD). |
| Increasing XP | Yes `100 * 2^(N-1)`. Practical wall ~level 15–22 on kill XP (DESIGN, not a bug to “fix” tonight). |
| Player-relative enemies | Yes until the 999-tier ceiling (PREREQ-B). |
| Progressively sophisticated enemies | Partial; 30% random tier + zone-0 kits undermine it. |
| Dynamic enemy spell pools | Boss phases yes; overworld = static piece kits stuck at zone 0. |
| Enemy-observed spell discovery | **Absent** |
| Achievement / challenge / boss spell unlocks | Rewards are Doka/XP |
| Backend-authoritative persistence | Wallet/XP/death yes (clamped; level pinned). Combat client-side. Achievement unlock still client-asserted. BuffShop potions still `${principal}_inventory`. GameKey redeem is canister-authoritative **in source**; live deploy of the 20260901 tail is unconfirmed. |
| Optional owner-uploaded visuals + pixel fallback | Still true. Do not make URLs required. |
| Admin Draft → Validate → Activate | **Not a canister workflow.** |

Expansion that adds spells, AI behaviors, or admin chrome **before** deploy confirmation, landing-authority extraction, and a reward-trust ADR will not scale.

### 6. Data / persistence safety — official client safer; live upgrade still the ops P0

`saveBattleStats` may still **lower** Doka/XP (required for heals/spends/death). It must not raise them — that write is on `main`. Finding 3 is still stale if phrased as “must not write Doka.” Client level can no longer demote. AP/MP persist capped (#322).

`applyRewards` is still client-trusted **within** 100k/500k. Custom clients can still drip-mint. `calculateAndAwardDoka` remains an unused public mint. `markAchievementUnlocked` is still unproven. Shop 60s auto-complete is **gone** in source (GameKey).

#259/#311/#324 closed the stuffed-NewActor hole **in source**. Empty-canister M0263 is the wrong test for live upgrade. Confirm Caffeine import of HEAD and refresh `.old`.

Wallet seeding / idle-hydrate / unpaid death replay remain load-bearing. Do not invent a second persist path for telemetry or discovery grants. `redeemGameKeyThroughPersist` still does not honour unpaid death 20/40 (#391 helper drafted, unwired).

### 7. Automation coherence — P0, eleventh midnight of config failure; seventh day of merge-stop success

AQA-001…012 were written 08-30. Humans merged the 09-02 burst, then **stopped merging** on 09-03. Cron kept launching. Queue: 59 (09-21) → 116 → 171 → 230 → 279 → 328 → **383**.

This 00:00 UTC window launched **40 automations**. That is exactly “P2/P3 expansion displacing unresolved P0/P1,” even though persist-auditor / expansion-director / Approved Design Implementer sat this hour out.

Cursor Cloud has **no write API** for dashboard prompts (`get-automation` is read-only). Halt is a human config action. In-repo gates are the enforceable half. **Close superseded director PRs** or oldest-first will keep serving the 09-02 index.

| AQA / MTD ID | Director status 2026-09-28 |
| :--- | :--- |
| AQA-001 hunter throttle | **OPEN** — `996df6df` still not GetAutomation-visible. `1aa41c6c-a483` enabled and RUNNING. |
| AQA-002 one critical hunter | **OPEN** — volume problem is the rest of the flock (40 this hour). |
| AQA-003 in-repo ACTION_ID ledger | **PARTIAL** — 09-02 file stayed clean; 09-21…09-27 director files never landed. |
| AQA-006 no mapGen implementation | **BROKEN** — twenty-eight open punches; guardian RUNNING. |
| AQA-007 freeze drive-by WX | **BROKEN** — 09-27 opened leftover-walk, live-gate, combat-effect, extract PRs against a frozen HEAD. Complexity-reduction RUNNING tonight. |
| AQA-008 security → ADR | **PARTIAL** — clamps + ignore-client level + AP/MP cap; no ADR. Security RUNNING. |
| AQA-012 outcome telemetry | **OPEN** — 0 collectors. TBC correctly WAITING. |
| MTD-001 flock halt | **OPEN** — config failed 08-31, 09-01, 09-02, 09-21…**09-28**. Merge-stop held **25 days**. |
| MTD-2026-09-21-002 | **OPEN** — Caffeine deploy unconfirmed. |
| MTD-2026-09-25-005 | **OPEN** — #327 CONFLICTING 26 days; queue 383. |

---

## Recurring hotspots — local patches no longer sufficient

Do **not** automatically perform a large refactor.

1. **Automation queue vs living index** — 383 drafts + eight director snapshots + CONFLICTING #327/#331. Intervention is **human triage** (close snapshots, restack #327, pause implementers), not another hunter PR.
2. **EOP / frozen NewActor** — source is correct. Next Motoko change = new later file after `20260901` + populated `check-stable` **after** deploy confirmation. Stop stuffing fields into `20260831` / `20260901`.
3. **Landing / occupancy / MP-cost authority** — Swap + summon-walk hazards need `applyHazardLanding`. Occupancy dest for summons already exists. Barriers already share `isBattleWalkTileBlocked`. Occupants still missing from `findPath`. One helper PR each; one-line WX wiring. Hold #541 and the live-gate mill.
4. **mapGen battle-graph** — twenty-eight punches. Extract `shouldPunchPortalNeighbor` / stay-on battle component **after** human playtest. Guardian = fixtures + ACTION_IDs only.
5. **Canister trust** — write the ADR (AQA-008). Until it exists, no new credit APIs and no discovery grant writer.
6. **Kit-zone number** (PREREQ-A) — not a refactor. One call site. Wait until the flock is held.
7. **Catalog execute-path honesty** — Shield / shred / Trap / Soul Rend / drain / Pacifist kit-cast mill. One helper per lie after halt, not sequential merge.

HP/death extraction (MTD-003) is still valid. Do not start it in the same hour as the flock.

---

## Human merge queue (do not autonmerge)

| Order | PR | Action |
| :--- | :--- | :--- |
| 1 | **This docs PR** | Living roadmap + `ACTION_IDS_2026-09-28.md`. Close **#338**, **#402**, **#448**, **#509**, **#569**, **#618**, and **#666** (same living files, stale snapshots). Oldest-first will conflict with those seven — **close them**, do not merge them. |
| 2 | **#327** | Unique P1 Striker splash/bounce. Oldest gameplay PR. **Restack** onto `origin/main` (currently CONFLICTING). |
| 3 | **#333** | TBC WAITING docs. Unique, aligned with AQA-012. Later dated TBC PRs are twins. |
| 4 | **#391** | GameKey unpaid-death **helper** (new file). After halt. Then wire redeem when `shopPurchase.ts` is free. |
| 5 | **#362** | Unbounded GameKey serial + `saveActiveSpells` keep-store. No new stables. After halt. |
| 6 | **#380** | Wisp heal fails no-heal. Isolated. After halt. Hold **#550**. |
| — | **#536** | Possible unique Boss Rush jackpot abort. After halt; do not land during freeze. |
| — | **#370** | HOLD until #327. Union unique AI/summon delta only. |
| — | **#385 / #667** | After halt. Do not sequential-merge with skip-wipe mill. |
| — | **#664** | GameKey double-submit. After halt. Admin-only. |
| — | **#517 / #354** | Display-only after halt. |
| — | **twenty-eight mapGen punches** including dump-alcove and 09-27 #688/#697/#704/#711 | **Hold.** AQA-006 / MTD-2026-09-28-004. |
| — | Persist / combat-parity / leftover-walk / Death Realm skip / Swap #541 / AdminDashboard / feel / UX / a11y / perf / extract / **#501 RAF** / combat-effect mill | Default **hold** this cycle. |
| — | Docs catalogs from 09-21…09-28 | OK **after** P0/P1 if they do not rewrite SDA/SDE/EBA schemas or retune BAL-*. |
| — | Any later PR from the 09-28 00:00 wave | Default **hold** if gameplay. Especially mapGen, targeting, persist, `enemyAI`, AdminDashboard, `main.mo` stables, telemetry UI, WX, RAF. |
| — | Motoko PRs that add persistent `let`/`var` | **Hold** until Caffeine deploy of the 20260901 tail is confirmed and `.old` refreshed. |

Do not restack death-replay, `writeLiveDoka`, `writeLevel`, leftover-XP HUD, Frozen MP helpers, spawnPolicy, GameKey product methods, or the EOP chain.

---

## Prioritized roadmap (what to work next)

**P0 — do these before any expansion PR merges**

1. Halt the 09-28 same-hour implementer flock (MTD-2026-08-31-001, MTD-2026-09-28-001). Disable or pause `9dcfd122-a484`, `f37b7505-a484`, `386a157d-a4a5`, `67b03c2f-a492`, `3089f18d-a49a`, and `1aa41c6c-a483`.
2. Triage the 383-draft leftover queue — do not merge-burst (MTD-2026-09-28-003 / 004). Close #338/#402/#448/#509/#569/#618/#666 (MTD-2026-09-28-002). Restack #327 so the living index is not stuck behind a dirty 26-day-old gameplay PR (MTD-2026-09-25-005).
3. Confirm Caffeine GitHub→import of current HEAD and refresh `.old` + `snapshots/deployed/` (MTD-2026-09-21-002). Freeze new Motoko stables until that lands.
4. Write the reward-trust ADR (AQA-008). Finding 3 = unbounded/absolute misuse, not “Doka write is a bug.”

**P1 — infrastructure / gameplay integrity**

5. Restack and merge leftover **#327** (Striker AoE). Then union **#370**’s unique AI/summon delta (MTD-2026-09-21-003 / MTD-2026-09-22-004).
6. Re-freeze `mapGen.ts`, `targeting.ts`, `enemyAI.ts`, and WX drive-bys (AQA-006, AQA-007). Hold all twenty-eight mapGen punches.
7. Extract `applyHazardLanding` for Swap + controlled-summon walk + destack (MIMA-001 + MIMA-002 remainder). Do not land #541 as a standalone WX Swap patch.
8. Honour unpaid death 20/40 on GameKey redeem — merge #391 helper, then one redeem import (MIMA-2026-09-02-003).
9. One `shouldBlockWhileDeathPending` helper covering heal / Items / rename / upgrade / feat / GameKey — **after halt**.
10. Battle `findPath` occupants (MIMA-2026-09-01-002 remainder). Barriers already share `isBattleWalkTileBlocked`.
11. One leftover-walk cancel helper **after** halt — not RAF (#501) and not the leftover-walk mill.
12. Catalog combat-effect honesty — **after halt**, one helper per lie, not the 09-26/09-27 mill.
13. Controlled HP/death extraction (MTD-2026-08-31-003) **after** landing helpers — not tonight.

**P2 — high-value expansion (after P0/P1, not this hour)**

14. Outcome counters, then maybe a dashboard (AQA-012 before TADD UI). TBC stays WAITING.
15. Fix kit-zone call site (Expansion PREREQ-A) — pass `currentZoneTier` **number**.
16. Enemy-observed spell discovery + ownership maps (SDA-002/003/004). New later migration after deploy confirmation.
17. Admin Draft → Validate → Activate on the canister (SDA-005 / MTD-006). Do not grow the 8.3k dashboard first.
18. Seed frontend starter ids; stop treating `usableByPlayer` as ownership (SDA-007).
19. Revisit `computeAITier` 30% random vs progressive sophistication (MTD-008). Report/design, not an `enemyAI.ts` rewrite.
20. Wire `saveKillCount` or drop it from the leaderboard (MTD-005). Hook exists; no TSX caller.
21. BuffShop `buffInventories` vs `${principal}_inventory` (SDEG-005) — after persist quiet.
22. Unify Paper Windstorm to one rate (RAO-2026-09-03-0000-003) — HUMAN; changes fight outcomes.
23. Persist AP/MP cap 20 vs unbounded formula (SDEG-2026-09-21-003) — HUMAN; do not raise in this flock.

**P3 — polish**

24. Recap / HUD leftovers already shipped — do not restack. #354 Feats copy and #517 empty Map Effects are display-only when WX is quiet.
25. Visual / game-feel / mobile — DESIGN.md already specifies the look. Do not edit combat math or WX for feel this hour.
26. Dead-code / maintainability — report only while hunters are hot.

---

## Contradictions and duplicates (do not re-litigate)

| Conflict | Resolution |
| :--- | :--- |
| Security “don’t write Doka from `saveBattleStats`” vs ARCHITECTURE | Write stays; **clamp / no-mint**. ADR still required. |
| Solvability vs `AGENTS.md` mapGen | #110 plus later punches already merged; **freeze**; hold all twenty-eight open punches. |
| AQA-004 vs human merge of 08-30…09-03 stacks | Accept `main`; clean leftovers; do not re-open merged themes. |
| Frozen preview vs execute | Execute now uses `battleWalkMpCost`. Do not re-file 09-01-001. |
| #327 vs #370 Striker | One helper. Oldest #327 first; #370 unique AI/summon only. |
| #380 vs #550 Wisp heal | One no-heal path. #380 first; hold #550. |
| Progressive AI vs 30% random tier | Design decision later; no first-hour AI PR. |
| SDA vs SDE vs SPELL_DISCOVERY vs EBA vs BOSS docs | One discovery persist shape (SDA-002/004). Others are content cards. |
| Expansion specialists vs “P0/P1 first” | Leftover catalogs + tonight’s AI / spell-mechanics / admin-implementer are the violation. Hold implementation. |
| Telemetry dashboard vs no counters | AQA-012 first. TBC stays WAITING_FOR_TELEMETRY. |
| Empty/Aug-31 `.old` vs live Caffeine | `.old` is the **real** Aug-31 signature (no GameKey). Import of HEAD should pass. Deploy still unconfirmed. Raw md5 of `.old` vs the aug31 snapshot file differs because `check-eop-stables.py` ignores `//` headers — do not “fix” by hand-writing `.old`. |
| GameKey on `main` vs canister | Source is ahead of confirmed deploy. Do not revert GameKey product. |
| `usableByPlayer=false` as retire vs enemy-only gate | SDA-2026-09-01-001; do not extend the flag. |
| Family HP paper vs `calcEnemyMaxHp` | PREREQ-H; honesty bug; not an AI rewrite. |
| 25-day freeze vs “halt failed” | Halt failed as **config**. It succeeded as **human merge stop**. Cron restart without dashboard change undoes the config half; merging the leftover queue undoes the merge-stop half. |
| #338 / #402 / #448 / #509 / #569 / #618 / #666 vs this PR | This file subsumes all seven. Close them without merge. |
| 09-22…09-27 persist HUD twins vs #330 keep | #330 is on `main`. Hold the twins including #698/#705/#710; do not open another keep path. |
| #501 leftover walk rAF vs `AGENTS.md` | RAF is frozen. Hold #501 even if the race is real. |
| Oldest-first stack vs living director index | Close superseded director snapshots; restack #327; do not merge-burst 380 drafts so the roadmap can land (MTD-2026-09-25-005). |
| #541 Swap live-tile vs MIMA-001 | HOLD #541. Extract `applyHazardLanding`. |
| Combat-parity UUID `-a486` vs `-a484` | Live automation is `f37b7505-a484`. Prior “not visible” lookups used the wrong suffix. |
| Seven 09-26 + five 09-27 combat-effect PRs vs catalog honesty | HOLD the mill. One execute-path helper after halt. |

---

## TOP 5 CURRENT PRIORITIES

1. **Halt the 09-28 00:00 implementer flock** (40 agents already, including map guardian, combat-parity, complexity reduction, AI designer, admin implementer, and the critical hunter) and **do not merge-burst the 383 leftover drafts**. First-run and expansion specialists: ACTION_IDs only. Especially hold mapGen, persist, targeting, `enemyAI`, AdminDashboard, `main.mo` stables, telemetry UI, WX, RAF.
2. **Unblock the living director index** — close #338/#402/#448/#509/#569/#618/#666 without merge; **restack #327** so oldest-first is not a 26-day CONFLICTING gameplay PR sitting in front of every later change (MTD-2026-09-25-005).
3. **Confirm Caffeine deploy of the 20260901 GameKey tail** and refresh `.old` from that build (MTD-2026-09-21-002). Source is ready; ops is not proven.
4. **Reward-trust ADR (AQA-008)** — clamps, ignore-client level, and AP/MP cap landed; the written decision did not. Security is running again tonight.
5. **After halt: merge restacked #327** (Striker AoE/bounce), then union #370’s AI/summon delta only, then **re-freeze WX / mapGen**.

## BLOCKED WORK

- Spell discovery / observed enemy kits / new unlock loops — no ownership persist, combat landing still racing, ADR unwritten, Caffeine deploy of GameKey unconfirmed.
- Enemy AI capability expansion — `enemyAI.ts` already 2,580 lines; kits never leave zone 0; HP/death still dual-written. `67b03c2f-a492` must not implement tonight.
- Telemetry admin dashboard — no counters to display (AQA-012). Balance analyst correctly idle. Dashboard UI this hour is skip.
- Any Motoko PR that adds stables until deploy is confirmed and `.old` refreshed.
- Further `mapGen.ts` punches (twenty-eight open drafts) without an explicit human playtest of the #321→#329 sequence.
- Custom-client mint proofs / new credit APIs until the ADR exists.
- `calculateAndAwardDoka` productization (unused official path; still a sink).
- Formula-level `BAL-*` / `LHIPS-*` retunes (no telemetry; jackpot 100k clamp is architecture).
- Admin Draft→Validate→Activate chrome on the 8.3k dashboard before canister lifecycle exists. Admin implementer `3089f18d-a49a` is RUNNING — hold its PR.
- Sequential merge of the 380+ leftover gameplay drafts “to clear the queue.”
- RAF / walk-stepper edits (#501), leftover-walk mill, Death Realm skip mill, dump-alcove mill, live-gate mill, combat-effect mill.
- Standalone Swap WX patch (#541).

## SAFE EXPANSION WORK

- Land this docs PR; close #338, #402, #448, #509, #569, #618, and #666.
- Restack/merge #327 (scoped Striker helper + tests). Do not duplicate it in #370 until unioned.
- Adopt per-producer ledgers + this director index (AQA-003) — process, not gameplay.
- Design-only (no PR): keep SDA/SDE/EBA catalogs; do not author a fifth discovery schema.
- Query-only / persist-lock-enqueued counters (AQA-012) — **design + tiny isolated PR after flock halt**, not a dashboard.
- Kit-zone number fix (PREREQ-A) **after** the flock is held — one call site + `enemyAI` test, no WX growth.
- Display-only unique copy if orchestrator finds one hole not already on `main` or drafted (#354 Feats copy, #517 empty Map Effects).
- Merge #391 helper (new file) after halt — does not touch WX / mapGen / persist lock.

## AREAS TO STOP TOUCHING TEMPORARILY

- `src/frontend/src/components/WorldExploration.tsx` except one-line helper wiring
- `src/frontend/src/engine/mapGen.ts` (including all twenty-eight open punches and dump-alcove)
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
- `docs/automation/ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, and `ACTION_IDS_2026-09-21.md` through `ACTION_IDS_2026-09-27.md` (do not append)
- GameKey product methods except unpaid-death honour on the existing redeem helper

## ARCHITECTURAL HOTSPOTS

1. Unconfirmed Caffeine deploy vs correct-in-source EOP chain (`20260901` GameKey; `.old` still Aug-31)
2. Dual HP / death / landing authority (React snapshot vs `combatantsRef` vs Swap/summon/destack teleport)
3. Client-trusted `applyRewards` without a written ADR (clamps exist; decision does not)
4. 19k-line world orchestrator absorbing every hunter (still the magnet; leftover drafts wait to grow it)
5. Automation pile-on (**383** leftover drafts + 09-28 restart) — merge-stop held 25 days, config failed an eleventh midnight
6. Oldest-first queue vs living director index (#327 CONFLICTING head blocks the roadmap; #331 also CONFLICTING)
7. mapGen portal-punch / battle-graph (**twenty-eight** open drafts, dump-alcove still cloning)
8. Dual spell catalogs + implicit ownership (blocks discovery)
9. Kit-zone object call site (dynamic pools implemented and dead; number already in `currentZoneTier`)
10. Striker victim-tile authority split across #327 and #370
11. Unseeded-wallet HUD twins stacked on the #330 keep (#698/#705/#710 newest)
12. Leftover-walk abort mill (#501 RAF + clones + #702/#706)
13. Death Realm pending vs wallet writes
14. Combat live-gate / catalog-effect mill (09-26 plus 09-27 #692/#699/#700/#709/#714)
15. Eight unmerged director snapshots on the same living files

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
9. unseeded-lock HUD vs committed Doka after one-shot / GameKey / feat (09-22…09-27 persist twins — if wallet “resets,” ENGINEERING is hydrate, not player spend)
10. leftover-walk after last hostile / into Death Realm / into battle start (#501/#606/#702/#706 mill — if players “slide” after victory, ENGINEERING is walk-cancel, not feel)
11. Death Realm pending vs shop/heal/GameKey (if wallets move during 1.5s death, ENGINEERING is missing a shared guard, not player intent)
12. Shield / shred / Trap / Soul Rend / drain / Pacifist-kit casts vs advertised numbers (09-26/09-27 combat-effect mill — if players call those spells “broken,” ENGINEERING may be execute-path skip, not balance)

Until those exist: automations must not claim CLEAR_POSITIVE_SIGNAL or “players don’t use X.” Distinguish MEASURED PLAYER BEHAVIOUR (none) from DESIGN INTERPRETATION and ENGINEERING EVIDENCE.

# Stralt Master Roadmap

**Director:** Stralt Master Technical Director (`0b92479e-a49e-11f1-a7d1-d6b4613131ce`)  
**Run:** 2026-10-24 00:02 UTC (daily cron)  
**This agent:** `bc-8354b7b8-9e24-4e2e-b681-e35aba498095`  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (accepted-challenge HUD) — **unchanged since 2026-09-03 00:28 UTC**  
**Prior director:** unmerged [`#946`](https://github.com/Mr-Melic/stralt/pull/946) (`bc-979c9352-9439-4db5-92a8-34e54f310a9e`, 2026-10-23). On `main`, this file is still the 2026-09-02 text.  
**Gameplay / production code:** not modified.

This file is the living prioritized roadmap. ACTION_ID records for this run live in [`ACTION_IDS_2026-10-24.md`](./ACTION_IDS_2026-10-24.md). Close superseded director PRs **#338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, and #946** when this lands — do not merge all thirteen. Process audit: [`QUALITY_AUDIT_2026-08-30.md`](./QUALITY_AUDIT_2026-08-30.md). Dump yards: `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, and the unmerged 09-21…10-23 ledgers. Do not append to those files.

## Evidence available this run

| Source | Status |
| :--- | :--- |
| `AGENTS.md`, `README.md`, `DESIGN.md`, `docs/ARCHITECTURE.md` | Read. `ARCHITECTURE.md` line 28 still says `check-limit = 4`; `mops.toml` is `5`. Stale docs, not a Motoko bug. |
| Prior director roadmap (2026-10-23, unmerged #946) + memories | Read. Halt-as-config asked again; humans still have not merged `main`. |
| Specialist reports on `main` | Still the 08-30…09-02 set. Later catalogs live only on unmerged drafts. |
| Unmerged 2026-10-23 specialist PRs | Sampled `#928` TBC WAITING (twelfth inspection of `0f5363f`; 0 collectors). Wave 15/16 catalogs `#941/#944/#951/#953/#956/#958/#962`. MIMA `#952`. Persist `#950`. Design overlap continues. |
| Open ACTION_IDs | Reuse. Director index = this file + `ACTION_IDS_2026-10-24.md`. |
| Recent commits | `git log` since 2026-09-03: **none** on `origin/main`. Last merge `#332`. |
| Open drafts | **648** at first search; GraphQL **649**; this hour already `#980`–`#993` and climbing (docs plus skip-wipe `#986/#987/#992` and pack-enemy `#985/#989`). 10-23 flock opened **52** (`#928`–`#979`). |
| Player telemetry | **Still none.** `longHorizonSim.telemetry.available === false`. No `recordTelemetry` / sidecar in `src/`. TBC stays `WAITING_FOR_TELEMETRY`. |
| Same-hour flock | **47 RUNNING** in the first minutes, then expansion `3f31b18f`, admin UX `48eb1df6`, and mobile a11y `c8f71c67` joined. **0 ERROR.** Persist auditor `607e0304` **is** in this wave. |

**Evidence classes used below**

| Class | Meaning |
| :--- | :--- |
| MEASURED PLAYER BEHAVIOUR | Live play counters. **None exist.** |
| DESIGN INTERPRETATION | Product rules in this prompt + `AGENTS.md` / `DESIGN.md` / specialist design docs |
| ENGINEERING EVIDENCE | Code on `0f5363f`, tests, open-PR mill, automation volume, hotspot call sites |

Telemetry is not allowed to set priority. Correlation is not causation. No CLEAR_POSITIVE_SIGNAL is claimed.

---

## What changed since the 10-23 director run (do not rediscover)

`main` **did not move.** The 10-23 halt was ignored as dashboard config and **obeyed as human merge-stop**.

| Fact | 10-23 director | This run |
| :--- | :--- | :--- |
| HEAD | `0f5363f` (50 days) | `0f5363f` (**51 days**) |
| Open drafts | 596 at 00:00, 599 by stack-compat | **648** at first search; this hour already `#980`–`#993` (gameplay mill restarted before this PR) |
| 10-21 mill | 56 PRs | Still unmerged |
| 10-22 mill | 58 PRs | Still unmerged |
| 10-23 implementer flock | 48 RUNNING; hold | **Did not hold.** Opened **52** PRs (`#928`–`#979`) **across the whole day** (00/06/08/12/16/18/21 UTC), not only midnight |
| Director snapshots on the living files | 12 unmerged (#338…#870 + #946 in flight) | **13** unmerged once #946 is counted. `main` still serves 09-02 |
| #327 Striker | CONFLICTING, 51 days | CONFLICTING, **52 days**. Still the oldest open PR (`mergeable_state: dirty`) |
| #331 destack | CONFLICTING | Still CONFLICTING (`dirty`). Only two CONFLICTING drafts in ~650 |
| Caffeine 20260901 deploy | Unconfirmed; `.old` Aug-31 no-GameKey | Unchanged. Grep GameKey in `.old` = 0. Newest deployed snapshot still `pr259-tail-20260901.most` |
| Reward-trust ADR | Missing | Still 0 `docs/**/*ADR*` |
| Telemetry collectors | 0 | 0. TBC `#928` correctly WAITING |
| 10-24 flock | n/a | **47 RUNNING** + later joiners (expansion, admin UX, mobile a11y). **0 ERROR.** Same implementer set still **enabled** |
| Skip-wipe mill | 22 | **30** (`skip remount` in title). 10-23 added `#938/#964/#969/#971/#977/#979` |
| Advertised share-kit mill | counted inside 38 broader combat-share | **23** (`advertised` in title) plus pack-enemy `#967/#972/#978`. 10-23 added `#947/#974` |
| Map punches | 39 crumb titles | **52** open `fix(map)` (includes admin map-modifier). 10-23 added four snaps `#933/#965/#970/#976` |
| WX extracts | `#831/#842/#901` | Plus **`#961` pixel-pattern paint** |

**Integrity that remains landed on `main` (do not re-open):** death replay `#183/#255/#256`, live Doka helpers `#180`, ignore-client `writeLevel`, AP/MP cap `#322`, bindgen summon fields, Pacifist preview, recap-under-credit gate, GameKey product `#258` + EOP source `#259/#311/#324`, Frozen/Slime execute MP `#313/#318`, barrier-aware `isBattleWalkTileBlocked`, spawnPolicy extract `#287`, challenge HUD `#332`, Enemy Register lore `#328`, Caffeine import gates + stack-compat.

**10-23 leftovers that are NOT done:** halt; living director index on `main`; Caffeine deploy confirmation; ADR; `#327` restack; mapGen/WX freeze; Swap landing; kit-zone number; discovery persist; admin DVA; `saveKillCount`; 30% random AI tier; share-kit helper; skip-wipe helper.

**New this run (not a rediscovery of 10-23):**

1. **Three recovered days in a row rebuilt the mill.** 10-21 opened 56; 10-22 opened 58; 10-23 opened **52**. Combined: **166 drafts in three days**. Queue 482 → 538 → 596 → **648+**.
2. **Halt-as-midnight is the wrong unit.** 10-23 gameplay kept shipping at 06:11, 08:15, 12:10, 16:11, 18:13, and 21:20 UTC (skip-wipe, map snaps, pack-enemy, WX-adjacent combat). Disabling only the 00:00 implementer wave would not have stopped that mill (MTD-2026-10-24-005).
3. Skip-wipe remount mill grew **22 → 30**. Local patches are no longer sufficient (MTD-2026-10-23-005 still OPEN; evidence grew).
4. Advertised-vs-execute mill is still standing: **23** `advertised` titles plus a new **pack-enemy decide/cooldown** cluster (`#967/#972/#974/#978`). One `resolveKitExecute` helper after halt, not a 24th flag (MTD-2026-10-22-005).
5. 10-23 touched the freeze file again: `#961` pixel-pattern extract from WX. Hold it with `#831/#842/#901`.
6. Admin implementer shipped code: `#945` confirm-dismiss / hydrate / overlay-escape helpers. HOLD. Do not grow `AdminDashboard.tsx` (8,280) during the mill.
7. This 00:00 wave again includes map guardian, AI, Approved Design, combat-parity, boss, dungeon, complexity reduction, spell mechanics, spell discovery, critical hunter, expansion, admin implementer, persist auditor. All checked **enabled**. Before this PR finished, the wave already opened skip-wipe `#986/#987/#992` and pack-enemy `#985/#989`.

---

## Seven-dimension evaluation

### 1. Correctness — official client still safer than the leftover queue

ENGINEERING: Persist clamps, ignore-client level, death replay, and GameKey-in-source remain the last good official-client snapshot. Do not open a fourth persist rewrite. Do not merge-burst skip-wipe or share-kit twins.

Recurring defect class: **teleport landing.** Swap still copies coordinates (`WorldExploration.tsx` 9389–9402 `swapPositions`) with no occupancy and no `applyHazardLanding` (zero hits in `src/`). `#541` and `#754` remain HOLD. `#850` is a share-kit `isSwap` twin, not a landing fix.

Recurring defect class: **preview vs execute / advertised vs live.** Frozen/Slime execute MP is closed (`battleWalkMpCost` / `enemyWalkMp`). The standing mill is **kit metadata honesty**: 23 one-flag `advertised` patches plus pack-enemy decide instead of one `resolveKitExecute(spell)` helper.

Recurring defect class: **kit zone NaN.** `buildEnemyKit(pieceType, number)` (`enemyAI.ts` 194–200) is still called with `currentMap.levelZone` (`WX` 11920), a `LevelZone` object (`WX` 4683–4687). `Math.floor(object)` → `NaN` → zone-0 kits. `currentZoneTier` already exists (`WX` 1136 / 4680). **Fifteenth** director cycle.

Recurring defect class: **path occupants.** `findPath` (`WX` 4466–4574) uses `isBattleWalkTileBlocked` (barriers/portals/void). Occupants are still not an argument. MIMA-2026-09-01-002 remains PARTIAL.

Recurring defect class: **Striker aim-tile.** Oldest open PR `#327` is still CONFLICTING (52 days). Twin `#370` is still MERGEABLE and a superset. Union ≠ concatenate.

Recurring defect class: **EOP deploy lag.** Source chain is correct (`20260901` GameKey, `OldActor = {}`, `check-limit = 5`). Tracked `.old` still has **no GameKey**. Live canister upgrade remains unproven after **51 days**.

### 2. Player experience — honesty on `main`; identity still incomplete

ENGINEERING: HUD leftover XP, recap feats, challenge HUD after accept, Enemy Register lore, Buy Doka vs Items copy are on `main`. Do not restack.

DESIGN (Expansion `#944`, PX `#955`, MIMA `#952`, TBC `#928`, no player data): the player is still handed the live catalog on minute one (`shouldIncludeBackendSpellInLibrary` returns true whenever `usableByPlayer !== false`, `adminSafety.ts` 712–718). Enemy-observed discovery is absent. Achievement/challenge/boss rewards remain Doka/XP. Four map modifiers remain announce-only. Family HP multipliers still die at battle start.

GameKey is a real PX/ops funnel in source; ops deploy is unconfirmed. Do not treat 0 redeem rows as “players don’t buy.”

MEASURED: none. TBC `#928` correctly refused to label spells over/underused.

### 3. Technical health — hotspot sizes frozen on `main`; mill not frozen

| Surface | Lines now (`0f5363f`) | 09-02 director | Verdict |
| :--- | ---: | ---: | :--- |
| `WorldExploration.tsx` | 19,213 | 19,253 | Freeze still broken as **intent**; file frozen only because humans stopped merging. `#831/#842/#901/#961` wait to grow it. |
| `AdminDashboard.tsx` | 8,280 | 8,035 | Grew before 09-03. No publish pipeline. `#945` already opened. Admin implementer RUNNING tonight. |
| `enemyAI.ts` | 2,580 | 2,583 | Frozen size. Tonight’s AI agent must not grow it. |
| `main.mo` | 3,903 | 3,838 | GameKey + clamps in source. Deploy unconfirmed. |
| `mapGen.ts` | 1,937 | 1,544 | Grew on `main` before freeze. **52** open `fix(map)` drafts. Guardian RUNNING. |
| `targeting.ts` | 1,199 | 1,031 | Leave it. |
| `progressPersist.ts` | 421 | 323 | Leave the lock. Skip-wipe mill is the magnet now. |
| `spellEngine.ts` | 1,044 | — | Share-kit mill magnet. |
| `deathPenalty.ts` | 597 | 597 | Leave it. |

`996df6df` is still not GetAutomation-visible. Critical hunter `1aa41c6c`, complexity `386a157d`, combat-parity `f37b7505`, Approved Design `fe5b679a`, map guardian `9dcfd122`, AI `67b03c2f`, admin implementer `3089f18d`, expansion `3f31b18f` are **enabled and RUNNING**.

Caffeine import gates and stack-compat stay. Oldest-first still makes this living index unreachable behind `#327` CONFLICTING and thirteen director snapshots of `MASTER_ROADMAP.md`.

### 4. Content depth — over-specified, under-wired, Wave 15/16 already drafted

Present on `main`: player-relative tier spawn, AI tiers 1–10, named boss kits, dungeon chain, Boss Rush, 9 challenges, feats, frontend catalog + GameKey shop.

Dead or contradictory vs core rules:

- Dynamic enemy spell pools: implemented and dead (zone-0 kits).
- Progressively sophisticated enemies: undermined by 30% fully random `computeAITier` (`combatMath.ts` 34–50).
- Enemy-observed spell discovery: absent.
- Achievement/challenge/boss spell unlocks: Doka/XP only.
- Admin Draft → Validate → Activate: not a canister workflow.
- `worldFeatures.ts` still tests-only.
- `ENEMY_AI_TIER_GATES` names still unused as live gates.
- 10-23 expansion `#944`, elites `#941`, boss sheets `#951`, spell proposals `#953`, formations `#956`, AI `#958`, discovery `#962` are overlapping catalogs. That is expansion overlap, not a license to implement. Tonight already opened `#980` (another enemy/boss admin re-audit).

### 5. Long-term scalability — rules vs implementation

| Core rule | Implementation on `0f5363f` |
| :--- | :--- |
| No character level cap | Yes (`applyRewards` Nat loop). HUD saturates at 48. Do not retune. |
| Increasing XP | Yes `100 * 2^(N-1)`. Practical wall is design, not a bugfix tonight. |
| Player-relative enemies | Yes until the 999-tier ceiling. |
| Progressively sophisticated enemies | Partial; 30% random tier + zone-0 kits. |
| Dynamic enemy spell pools | Boss phases yes; overworld stuck at zone 0. |
| Enemy-observed spell discovery | **Absent** |
| Achievement / challenge / boss spell unlocks | Rewards are Doka/XP |
| Backend-authoritative persistence | Wallet/XP/death clamped; combat client-side; achievements client-asserted; BuffShop potions `${principal}_inventory`. GameKey redeem authoritative **in source**. |
| Optional owner-uploaded visuals + pixel fallback | Still true. Do not make URLs required. |
| Admin Draft → Validate → Activate | **Not a canister workflow.** |

Expansion that adds spells, AI behaviors, or admin chrome before halt + `#327` restack + landing helper + ADR + confirmed GameKey deploy will not scale. Wave 15/16 catalogs must wait.

### 6. Data / persistence safety — official client safer; mill is the risk

`saveBattleStats` may still **lower** Doka/XP (required). It must not raise them. Finding 3 is still stale if phrased as “must not write Doka.”

`applyRewards` is still client-trusted within 100k/500k. `calculateAndAwardDoka` remains an unused public mint. `markAchievementUnlocked` is still unproven.

`redeemGameKeyThroughPersist` (`shopPurchase.ts` 294–330) still does **not** honour unpaid death. `#391` drafts the helper and does not wire redeem. Hold skip-wipe clones; they are not that wire.

`.old` is still Caffeine’s Aug-31 no-GameKey signature. Do not hand-write it. Freeze new stables.

Wallet seeding / idle-hydrate / unpaid death replay remain load-bearing. Do not invent a second persist path for telemetry or discovery grants. TBC/GTAD: sidecar **off** the persist lock.

### 7. Automation coherence — P0, recovered platform, mill is now the steady state including daytime cadences

Halt-as-config has failed every midnight it was asked (08-31…09-29, then 10-21, 10-22, 10-23, now 10-24). Halt-as-merge-stop has held **51 days**. The 22-day gap was ERROR/boot (MTD-2026-10-21-003), recovered on 10-21.

10-21, 10-22, and 10-23 together are the proof that **recovery without dashboard disable = mill restart**. 166 new drafts in three days, including frozen-file hits **after noon UTC**. 10-24 already has 47+ agents RUNNING, including the same implementer UUIDs the last three directors named.

Cursor Cloud has **no write API** for dashboard prompts. Halt is a human config action. In-repo gates cannot pause cron.

| AQA / MTD ID | Director status 2026-10-24 |
| :--- | :--- |
| AQA-001 hunter throttle | **OPEN** — `996df6df` still not GetAutomation-visible. |
| AQA-002 one critical hunter | **OPEN** — `1aa41c6c` enabled **and RUNNING**. |
| AQA-003 in-repo ACTION_ID ledger | **PARTIAL** — this run writes `ACTION_IDS_2026-10-24.md`. Living index still off `main`. |
| AQA-004 don’t merge the 08-30 stack | **SUPERSEDED** — accept `main`. |
| AQA-005 test clone mill | **PARTIAL** — 10-23 opened `#948/#959/#968/#975`. Defect-recurrence RUNNING tonight. |
| AQA-006 no mapGen implementation | **BROKEN** — 52 open `fix(map)`; guardian RUNNING. |
| AQA-007 freeze drive-by WX | **BROKEN** — `#831/#842/#901/#961` already opened; complexity reduction RUNNING. |
| AQA-008 security → ADR | **PARTIAL** — clamps on `main`; no ADR. Security RUNNING. |
| AQA-009 orchestrator must not implement gameplay | **PARTIAL** — tonight’s orchestrator is running. |
| AQA-010 persist/economy dedup | **PARTIAL** — cluster landed; skip-wipe mill is the leftover. Persist auditor RUNNING. |
| AQA-011 prompts vs live architecture | **OPEN** |
| AQA-012 outcome telemetry | **OPEN** — TBC `#928` correctly WAITING. This hour `#981` is architecture docs only. Dashboard specialist RUNNING with nothing to display. |
| MTD-001 flock halt | **OPEN** — failing again tonight. |
| MTD-2026-10-23-001 | **SUPERSEDED** — that wave already ran and opened 52 PRs. |
| MTD-2026-10-24-001 | **NEW** — hold tonight’s wave. |
| MTD-2026-10-24-005 | **NEW** — halt must cover 06/12/18 cadences, not only 00:00. |
| MTD-2026-09-25-005 | **OPEN** — oldest-first still blocked. |

---

## Recurring hotspots — local patches no longer sufficient

Do **not** automatically perform a large refactor.

1. **Automation flock + leftover queue** — the binding constraint. Disable implementers **and** daytime hunter-implementers in the dashboard. Do not merge-burst 648+ drafts.
2. **Catalog advertised vs execute** — **23** open `advertised` flag patches plus pack-enemy decide. After halt, one `resolveKitExecute` helper + tests. Close the twins. Do not grow `spellEngine.ts` / `enemyAI.ts` by one effect per PR.
3. **Skip-wipe / remount hydrate** — **30** open twins on the `#330` keep. One shared remount-wipe guard after halt (MTD-2026-10-23-005), not a 31st clone. Distinct from `#391` unpaid-death honour on GameKey redeem.
4. **Landing / occupancy** — Swap + summon-walk hazards still need `applyHazardLanding`. Occupancy dest for summons already exists. One helper PR; one-line WX wiring. HOLD `#541/#754`.
5. **Kit-zone number (PREREQ-A)** — not a refactor. One call site. Unblocks dynamic pools. Wait until the flock is held.
6. **Canister trust** — write the ADR (AQA-008). No new credit APIs and no discovery grant writer until then.
7. **EOP deploy** — confirm Caffeine 20260901, then refresh `.old` from that build. Never hand-write `.old`. No new stables until then.
8. **mapGen portal-punch / leftover-crumb** — 52 open `fix(map)` drafts. Freeze. Guardian = fixtures + ACTION_IDs only.
9. **HP/death extraction (MTD-003)** — still valid. Do not start it in the same hour as the flock.

---

## Human merge queue (do not autonmerge)

| Order | PR | Action |
| :--- | :--- | :--- |
| — | **This docs PR** | Review. Close #338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, **and #946** without merge. |
| 1 | **#327** | Restack onto `0f5363f` (currently CONFLICTING). Only leftover gameplay that should merge first after halt. |
| 2 | **#370** | Union unique AI/summon Striker delta only. Do not concatenate. |
| 3 | **#391** | GameKey unpaid-death helper (new file). After halt. Then a **separate** one-line redeem wire — `#391` itself does not wire `redeemGameKeyThroughPersist`. |
| — | **#362** | GameKey serial + saveActiveSpells keep-store (no new stables). After halt; Motoko behavior only. |
| — | **#380** then hold **#550** | Wisp no-heal. One path. |
| — | **#385 / #667 / #664** | Persist/admin unique leftovers. After halt. Not skip-wipe clones. |
| — | **#536** | Boss Rush jackpot. After halt. |
| — | **#517 / #354** | Unique display. Optional P3. |
| — | **#331 and all mapGen punches** | **HOLD** (CONFLICTING head + crumb clones). |
| — | **#541 / #754** | **HOLD** Swap mill. |
| — | **#814–#979 gameplay** | **HOLD** (10-21 / 10-22 / 10-23 mills: skip-wipe, share-kit, crumbs, dust-mote extract, hostile summons, whirlpool extract, pixel-pattern extract, pack-enemy, admin helpers). |
| — | Any 10-24 00:00 PR including `#980`–`#993` | Default **HOLD**. Especially WX, mapGen, targeting, persist, `enemyAI`, AdminDashboard, `main.mo` stables, telemetry UI, RAF, skip-wipe `#986/#987/#992`, pack-enemy `#985/#989`. Docs-only catalogs may remain unmerged. |

Do not restack death-replay, `writeLiveDoka`, `writeLevel`, leftover-XP HUD, recap click-through, challenge HUD, Enemy Register lore, or GameKey product code.

---

## Prioritized roadmap (what to work next)

**P0 — do these before any expansion PR merges**

1. Halt the 10-24 same-hour implementer flock **and** the 06/12/18 hunter-implementer cadences (MTD-2026-08-31-001, MTD-2026-10-24-001, MTD-2026-10-24-005). Do not merge-burst 648+ drafts (MTD-2026-10-24-004).
2. Unblock the living director index: close superseded director PRs including #946; restack or replace #327 (MTD-2026-10-24-002, MTD-2026-09-25-005).
3. Confirm Caffeine deploy of the 20260901 GameKey tail and refresh `.old` (MTD-2026-09-21-002). Freeze new stables until then (MTD-2026-09-02-003).
4. Write the reward-trust ADR (AQA-008).
5. Ledger hygiene: this file + `ACTION_IDS_2026-10-24.md` only (MTD-2026-09-02-004).

**P1 — infrastructure / gameplay integrity (after halt)**

6. Restack/merge #327, then union #370 (MTD-2026-09-21-003 / MTD-2026-09-22-004).
7. Re-freeze `mapGen.ts`, `targeting.ts`, `enemyAI.ts`, and WX drive-bys (AQA-006, AQA-007). Hold all map punches and `#331`.
8. Extract `applyHazardLanding` for Swap + controlled-summon walk (MIMA-001). HOLD `#541/#754`.
9. One advertised-vs-execute kit helper; close the share-kit mill (MTD-2026-10-22-005).
10. One remount-wipe guard; close the skip-wipe mill (MTD-2026-10-23-005). Distinct from `#391`.
11. `#391` unpaid-death helper, then redeem wire (MIMA-2026-09-02-003).
12. `#362` GameKey serial / saveActiveSpells keep-store.
13. Controlled HP/death extraction (MTD-2026-08-31-003) **after** landing helpers — not tonight.
14. Expansion freeze until the above exist (MTD-2026-08-31-004).

**P2 — high-value expansion (after P0/P1, not this hour)**

15. Outcome counters, then maybe a dashboard (AQA-012 before TADD UI). TBC stays WAITING.
16. Kit-zone call site (PREREQ-A) — pass `currentZoneTier`, not `levelZone`.
17. Enemy-observed spell discovery + ownership maps (SDA-002/004). New later migration after deploy confirmation.
18. Admin Draft → Validate → Activate on the canister (MTD-006). Do not grow the 8.3k dashboard first.
19. Seed frontend starter ids; stop treating `usableByPlayer` as ownership (SDA-007).
20. Revisit `computeAITier` 30% random (MTD-008). Report/design, not an `enemyAI.ts` rewrite.
21. Wire `saveKillCount` or drop it from the leaderboard (MTD-005). `useSaveKillCount` still has no TSX caller.
22. BuffShop `buffInventories` vs `${principal}_inventory` (SDEG-005) — after persist quiet.

**P3 — polish**

23. Recap / HUD leftovers already shipped — do not restack.
24. `#354` Feats copy and `#517` empty Map Effects — leftover unique display.
25. Visual / game-feel / mobile — DESIGN.md already specifies the look. a11y 44px twins (`#935`) are optional after halt; do not edit combat math or WX for feel.
26. Dead-code / maintainability — report only while hunters are hot.
27. GameKey operator UX polish — only after deploy confirmation.

---

## Contradictions and duplicates (do not re-litigate)

| Conflict | Resolution |
| :--- | :--- |
| Security “don’t write Doka from `saveBattleStats`” vs ARCHITECTURE | Write stays; **clamp / no-mint**. ADR still required. |
| Solvability vs `AGENTS.md` mapGen | #110 plus later punches already merged; **freeze**; hold all open crumb punches. |
| AQA-004 vs human merge of 08-30…09-03 stacks | Accept `main`; clean leftovers; do not re-open merged themes. |
| Frozen preview vs execute MP | Execute uses `battleWalkMpCost`. Do not re-file 09-01-001. |
| #327 vs #370 Striker | One helper. Oldest #327 first; #370 unique AI/summon only. |
| #380 vs #550 Wisp heal | One no-heal path. #380 first; hold #550. |
| #541 vs #754 Swap | HOLD both. Extract `applyHazardLanding`. |
| 23 advertised + pack-enemy PRs vs one honesty helper | MTD-2026-10-22-005. Close twins; one helper after halt. |
| 30 skip-wipe PRs vs `#391` GameKey unpaid-death | Distinct holes. Skip-wipe = remount `saveBattleStats` vs committed keep. `#391` = honour 20/40 before redeem credit. |
| Progressive AI vs 30% random tier | Design decision later; no first-hour AI PR. Tonight’s AI agent is the violation. |
| SDA vs SDE vs SPELL_DISCOVERY vs EBA vs BOSS vs Wave 15/16 | One discovery persist shape (SDA-002/004). Others are content cards. |
| Expansion specialists vs “P0/P1 first” | 10-21, 10-22, 10-23, and tonight’s AI / boss / dungeon / complexity / Approved Design / expansion agents are the violation. Hold implementation. |
| Telemetry dashboard vs no counters | AQA-012 first. TBC stays WAITING_FOR_TELEMETRY. Keep `#333`; close later TBC twins including `#871/#928`. |
| Empty/Aug-31 `.old` vs live Caffeine | `.old` is the **real** Aug-31 signature (no GameKey). Import of HEAD should pass. Deploy still unconfirmed. Do not hand-write `.old`. |
| GameKey on `main` vs canister | Source is ahead of confirmed deploy. Do not revert GameKey product. |
| `usableByPlayer=false` as retire vs enemy-only gate | SDA-2026-09-01-001; do not extend the flag. |
| Family HP paper vs `calcEnemyMaxHp` | PREREQ-H; honesty bug; not an AI rewrite. |
| 51-day freeze vs “halt failed” vs 22-day PR silence vs 10-21…10-23 restart | Halt failed as **config**. It succeeded as **human merge stop**. The 22-day gap was **ERROR/boot**. Recovery **reopened the mill** (+56 then +58 then +52 drafts). Merging that mill undoes the merge-stop half. |
| Midnight halt vs 06/12/18 mill | 10-23 proved daytime cadences ship skip-wipe/map/share-kit. Halt must be **all implementer schedules** (MTD-2026-10-24-005). |
| #338…#946 vs this PR | This file subsumes all twelve. Close them without merge. |
| 09-22…10-23 persist HUD twins vs #330 keep | #330 is on `main`. Hold the twins including `#742`…`#979`. |
| #501 leftover walk rAF vs `AGENTS.md` | RAF is frozen. Hold #501 and #761 even if the race is real. |
| Oldest-first stack vs living director index | Close superseded director snapshots; restack #327; do not merge-burst 648 drafts (MTD-2026-09-25-005). |
| Combat-parity UUID `-a486` vs `-a484` | Live automation is `f37b7505-a484`. |
| Expansion UUID `-a49e` vs `-a492` | Live automation is `3f31b18f-a492`. |
| `ARCHITECTURE.md` `check-limit = 4` vs `mops.toml` `5` | Stale `main` docs (line 28 vs line 452). Living index never landed. Do not “fix” by a Motoko PR. |
| TBC `2786666f` vs “Stralt game balance” `3c083a4a` | Different automations. TBC must stay WAITING. The other balance agent must not retune `BAL-*` either. Both RUNNING tonight. |
| GTAD sidecar vs persist lock | Counters fire **after** persist returns, or query-only. Never enqueue telemetry on `progressPersistRef`. |

---

## TOP 5 CURRENT PRIORITIES

1. **Halt the 2026-10-24 implementer flock and the 06/12/18 hunter-implementer cadences** (47+ agents already RUNNING, including map guardian `9dcfd122`, AI `67b03c2f`, Approved Design `fe5b679a`, combat-parity `f37b7505`, boss `39040ad2`, dungeon `73740435`, complexity reduction `386a157d`, spell mechanics `1330956a`, spell discovery `c26e5a83`, critical hunter `1aa41c6c`, expansion `3f31b18f`, admin implementer `3089f18d`, persist auditor `607e0304`) and **do not merge-burst the 648 leftover drafts**. 10-21 through 10-23 recovery opened **166** PRs in three days, including daytime skip-wipe/map/share-kit — that is the failure mode, not a backlog to clear.
2. **Unblock the living director index** — close #338/#402/#448/#509/#569/#618/#666/#718/#783/#814/#870/#946 without merge; **restack #327** so oldest-first is not a 52-day CONFLICTING gameplay PR sitting in front of every later change (MTD-2026-09-25-005).
3. **Confirm Caffeine deploy of the 20260901 GameKey tail** and refresh `.old` from that build (MTD-2026-09-21-002). Source has been ready for 51 days; ops is not proven.
4. **Reward-trust ADR (AQA-008)** — clamps, ignore-client level, and AP/MP cap landed; the written decision did not. Security is running again tonight.
5. **After halt: merge restacked #327** (Striker AoE/bounce), then union #370’s AI/summon delta only, then **re-freeze WX / mapGen** and replace the advertised mill (**23**) and skip-wipe mill (**30**) with one helper each.

## BLOCKED WORK

- Spell discovery / observed enemy kits / new unlock loops — no ownership persist, combat landing still racing, ADR unwritten, Caffeine deploy of GameKey unconfirmed.
- Enemy AI capability expansion — `enemyAI.ts` already 2,580 lines; kits never leave zone 0; HP/death still dual-written. Tonight’s AI agent must not grow it.
- Telemetry admin dashboard — no counters to display (AQA-012). Balance analyst correctly WAITING. `#981` tonight is skip.
- Any Motoko PR that adds stables until deploy is confirmed and `.old` refreshed.
- Further `mapGen.ts` punches (**52** open `fix(map)`, including **#331**) without an explicit human playtest of the #321→#329 sequence.
- Custom-client mint proofs / new credit APIs until the ADR exists.
- `calculateAndAwardDoka` productization (unused official path; still a sink).
- Formula-level `BAL-*` / `LHIPS-*` retunes (no telemetry; jackpot 100k clamp is architecture).
- Admin Draft→Validate→Activate chrome on the 8.3k dashboard before canister lifecycle exists. HOLD `#945`.
- Sequential merge of the 648 leftover gameplay drafts “to clear the queue.”
- RAF / walk-stepper edits (#501/#761), leftover-walk mill, Death Realm skip mill, dump-alcove mill, live-gate mill, combat-effect mill, share-kit mill, skip-wipe mill, Swap mill (#541/#754).
- Approved Design / AI / boss / dungeon / complexity / spell-mechanics / combat-parity / admin-implementer / critical-hunter implementation from tonight’s flock.
- Wave 15/16 expansion cards and pack-enemy / healer-interpose gates on `enemyAI.ts`.

## SAFE EXPANSION WORK

- Land this docs PR; close #338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, and #946.
- Restack/merge #327 (scoped Striker helper + tests). Do not duplicate it in #370 until unioned.
- Adopt per-producer ledgers + this director index (AQA-003) — process, not gameplay.
- Design-only (no PR, or docs-only if already launched): keep SDA/SDE/EBA catalogs; do not author a fifth discovery schema; do not implement Wave 15/16 boss sheets or AI behaviors.
- Query-only / persist-lock-enqueued counters (AQA-012) — **design + tiny isolated PR after flock halt**, not a dashboard. Sidecar off the persist lock.
- Kit-zone number fix (PREREQ-A) **after** the flock is held — one call site + `enemyAI` test, no WX growth.
- Display-only unique copy if orchestrator finds one hole not already on `main` or drafted (#354 Feats copy, #517 empty Map Effects).
- Merge #391 helper (new file) after halt — does not touch WX / mapGen / persist lock.

## AREAS TO STOP TOUCHING TEMPORARILY

- `src/frontend/src/components/WorldExploration.tsx` except one-line helper wiring
- `src/frontend/src/engine/mapGen.ts` (including all open punches and dump-alcove)
- RAF loop, turn-order math, damage formulas (`AGENTS.md`) — including leftover walk rAF (#501)
- `src/frontend/src/utils/progressPersist.ts` (leave the lock)
- `src/frontend/src/utils/deathPenalty.ts` (cluster closed)
- `src/frontend/src/engine/targeting.ts`
- `src/frontend/src/engine/enemyAI.ts`
- `src/frontend/src/engine/spellEngine.ts` (share-kit mill magnet)
- `src/frontend/src/engine/spawnPolicy.ts` (just extracted)
- `src/frontend/src/engine/battleWalkMp.ts` / `enemyWalkMp.ts` (just landed)
- `src/frontend/src/components/AdminDashboard.tsx` (HOLD `#945`)
- `src/backend/main.mo` persistent fields until deploy confirmation
- Frozen chain files `20260831_000000.mo` / `20260901_000000.mo`
- `docs/automation/ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, and `ACTION_IDS_2026-09-21.md` through `ACTION_IDS_2026-10-23.md` (do not append)
- GameKey product methods except unpaid-death honour on the existing redeem helper

## ARCHITECTURAL HOTSPOTS

1. Unconfirmed Caffeine deploy vs correct-in-source EOP chain (`20260901` GameKey; `.old` still Aug-31) — now **51 days**
2. Dual HP / death / landing authority (React snapshot vs `combatantsRef` vs Swap/summon/destack teleport)
3. Client-trusted `applyRewards` without a written ADR (clamps exist; decision does not)
4. 19k-line world orchestrator absorbing every hunter (`#831/#842/#901/#961` already in the leftover queue)
5. Automation pile-on (**648+** leftover drafts + 10-24 restart already RUNNING) after a recovered 22-day ERROR outage that was **not** a halt — now including **daytime cadences**
6. Oldest-first queue vs living director index (#327 CONFLICTING head; #331 also CONFLICTING; thirteen director snapshots)
7. mapGen portal-punch / battle-graph / leftover-crumb (**52** open `fix(map)` drafts)
8. Dual spell catalogs + implicit ownership (blocks discovery)
9. Kit-zone object call site (dynamic pools implemented and dead; number already in `currentZoneTier`; fifteenth cycle)
10. Striker victim-tile authority split across #327 and #370
11. Unseeded-wallet / remount-wipe HUD twins stacked on the #330 keep (**30** skip-wipe drafts)
12. Leftover-walk abort mill (#501 RAF + clones + #761)
13. Death Realm pending vs wallet writes
14. Combat live-gate / catalog-effect mill plus **23** advertised-vs-execute twins and a pack-enemy decide cluster
15. Swap mill (#541 + #754) instead of `applyHazardLanding`
16. AI / boss / dungeon / complexity / spell-mechanics / Approved Design / combat-parity / admin-implementer / critical-hunter running against an over-specified, under-wired catalog

## TELEMETRY SIGNALS WORTH INVESTIGATING

**None can be investigated in production — the series do not exist.** TBC `#928` (2026-10-23) is the twelfth WAITING inspection of `0f5363f`. Tonight’s TBC will be the thirteenth. Do not treat `#981` architecture docs as rows.

When AQA-012 lands, investigate in this order (engineering + design, not telemetry-alone priority):

1. persist-ok vs persist-fail and death-penalty-applied vs victory-paid vs **single-axis-credit-then-death** (integrity; #183/#256/#330 class — measure whether the hole is closed, do not assume)
2. GameKey request vs approve vs redeem vs redeem-fail (ops; new funnel; do not treat 0 rows as “players don’t buy”)
3. recap opened vs dismissed vs lava-death-during-recap (PX; input gate may have closed — measure)
4. spell-cast counts **by acquisition path** (starter vs unlocked vs observed) — a “weak” spell may be undiscovered, not weak. Today every catalog id is treated as owned, so this series would be **meaningless** until SDA-002.
5. Attack Nearest vs aimed-cast ratio (gate confusion vs power)
6. challenge accept vs complete vs advertised-reward-missing vs **Striker splash/bounce beyond 2** (#327 — if complete rate is high on Nova/Chain, DESIGN INTERPRETATION is the aim-tile hole, not player skill)
7. Swap / summon-walk / destack onto hazards vs walk onto the same tile (MIMA-001 remainder — if “Untouchable complete rate” is high, DESIGN INTERPRETATION is skip-landing, not player skill)
8. Frozen/Slime maps: tiles walked vs preview budget (09-01-001 is closed in source — measure whether leftover-1-MP walks remain)
9. unseeded-lock HUD vs committed Doka after one-shot / GameKey / feat / shop / heal (09-22…10-23 persist twins — if wallet “resets,” ENGINEERING is hydrate, not player spend)
10. leftover-walk after last hostile / into Death Realm / into battle start (#501/#761 mill — if players “slide” after victory, ENGINEERING is walk-cancel, not feel)
11. Death Realm pending vs shop/heal/GameKey (if wallets move during 1.5s death, ENGINEERING is missing a shared guard, not player intent)
12. Shield / shred / Trap / Soul Rend / drain / Pacifist-kit / Chain Lightning bounce / Mark / Mirror / Swap / DoT ticks / buffStat / pack-enemy Inferno casts vs advertised numbers (combat-effect mill — if players call those spells “broken,” ENGINEERING may be execute-path skip, not balance)
13. Hostile summon kit casts vs empty `spells` at spawn (#842/#861 — if summons “do nothing,” ENGINEERING is catalog wiring, not AI tier)

Until those exist: automations must not claim CLEAR_POSITIVE_SIGNAL or “players don’t use X.” Distinguish MEASURED PLAYER BEHAVIOUR (none) from DESIGN INTERPRETATION and ENGINEERING EVIDENCE.

# Stralt Master Roadmap

**Director:** Stralt Master Technical Director (`0b92479e-a49e-11f1-a7d1-d6b4613131ce`)  
**Run:** 2026-10-25 00:04 UTC (daily cron)  
**This agent:** `bc-a0d7fd84-a8ac-480c-acf9-a5a12235e0cc`  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (accepted-challenge HUD) — **unchanged since 2026-09-03 00:28 UTC**  
**Prior director:** unmerged [`#998`](https://github.com/Mr-Melic/stralt/pull/998) (`bc-8354b7b8-9e24-4e2e-b681-e35aba498095`, 2026-10-24). On `main`, this file is still the 2026-09-02 text.  
**Gameplay / production code:** not modified.

This file is the living prioritized roadmap. ACTION_ID records for this run live in [`ACTION_IDS_2026-10-25.md`](./ACTION_IDS_2026-10-25.md). Close superseded director PRs **#338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, #946, and #998** when this lands — do not merge all fourteen. Process audit: [`QUALITY_AUDIT_2026-08-30.md`](./QUALITY_AUDIT_2026-08-30.md). Dump yards: `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, and the unmerged 09-21…10-24 ledgers. Do not append to those files.

## Evidence available this run

| Source | Status |
| :--- | :--- |
| `AGENTS.md`, `README.md`, `DESIGN.md`, `docs/ARCHITECTURE.md` | Read. `ARCHITECTURE.md` line 28 still says `check-limit = 4`; `mops.toml` is `5`. Stale docs, not a Motoko bug. |
| Prior director roadmap (2026-10-24, unmerged #998) + memories | Read. Halt-as-config asked again, including daytime cadences (MTD-2026-10-24-005). Humans still have not merged `main`. |
| Specialist reports on `main` | Still the 08-30…09-02 set. Later catalogs live only on unmerged drafts. |
| Unmerged 2026-10-24 specialist PRs | Sampled `#994` TBC WAITING (thirteenth inspection of `0f5363f`; 0 collectors). Wave 16 catalogs `#991/#997/#1004/#1011/#1017`. Admin implementer `#1001`. WX extract `#995`. MIMA `#1012`. Persist tests `#1014`. Design overlap continues. |
| Open ACTION_IDs | Reuse. Director index = this file + `ACTION_IDS_2026-10-25.md`. |
| Recent commits | `git log` since 2026-09-03: **none** on `origin/main`. Last merge `#332`. |
| Open drafts | GraphQL **711** at first search; this hour already `#1043`–`#1060` and climbing (skip-wipe `#1043/#1045/#1046`, pack-enemy `#1054`, advertised `#1058`, expansion `#1052`, TBC `#1053`, perf `#1059`). 10-24 flock opened **63** (`#980`–`#1042`). |
| Player telemetry | **Still none.** `longHorizonSim.telemetry.available === false` (`longHorizonSim.ts` 532–536). No `recordTelemetry` / sidecar in `src/`. TBC stays `WAITING_FOR_TELEMETRY`. |
| Same-hour flock | **52** automations this hour: **47 RUNNING**, **5 IDLE**, **0 ERROR**. Map guardian, AI, combat-parity, complexity, spell mechanics, spell discovery, boss, dungeon, expansion, critical hunter `1aa41c6c`, world-content are RUNNING. Approved Design, persist auditor, and admin implementer are **enabled** but IDLE in the first snapshot. Specialists already opened `#1043`–`#1060` before this ledger committed. |

**Evidence classes used below**

| Class | Meaning |
| :--- | :--- |
| MEASURED PLAYER BEHAVIOUR | Live play counters. **None exist.** |
| DESIGN INTERPRETATION | Product rules in this prompt + `AGENTS.md` / `DESIGN.md` / specialist design docs |
| ENGINEERING EVIDENCE | Code on `0f5363f`, tests, open-PR mill, automation volume, hotspot call sites |

Telemetry is not allowed to set priority. Correlation is not causation. No CLEAR_POSITIVE_SIGNAL is claimed.

---

## What changed since the 10-24 director run (do not rediscover)

`main` **did not move.** The 10-24 halt was ignored as dashboard config and **obeyed as human merge-stop**.

| Fact | 10-24 director | This run |
| :--- | :--- | :--- |
| HEAD | `0f5363f` (51 days) | `0f5363f` (**52 days**) |
| Open drafts | 648 at first search; GraphQL 649; `#980`–`#993` already open | GraphQL **711** at 00:04; this hour already `#1043`–`#1060` (~729+) |
| 10-21 / 10-22 / 10-23 mill | 56 + 58 + 52 = 166 | Still unmerged |
| 10-24 implementer flock | 47 RUNNING; hold; MTD-2026-10-24-005 (daytime) | **Did not hold.** Opened **63** PRs (`#980`–`#1042`) **across the whole day** (00/03/04/06/08/09/12/16/18/20/21 UTC). 00:00 = 39; after 01:00 = **24** |
| Director snapshots on the living files | 13 unmerged (#338…#946 + #998 in flight) | **14** unmerged once #998 is counted. `main` still serves 09-02 |
| #327 Striker | CONFLICTING, 52 days | CONFLICTING, **53 days**. Still the oldest open PR (`mergeable_state: dirty`) |
| #331 destack | CONFLICTING | Still CONFLICTING (`dirty`) |
| Caffeine 20260901 deploy | Unconfirmed; `.old` Aug-31 no-GameKey | Unchanged. Grep GameKey in `.old` = 0. Newest deployed snapshot still `pr259-tail-20260901.most` |
| Reward-trust ADR | Missing | Still 0 `docs/**/*ADR*` |
| Telemetry collectors | 0 | 0. TBC `#994` correctly WAITING |
| 10-25 flock | n/a | **47 RUNNING** + 5 IDLE. **0 ERROR.** Same implementer UUIDs still **enabled**. `#1043` already opened |
| Skip-wipe mill | 30 | **~46** titled `skip remount` plus this-hour `#1043`. 10-24 added 16 |
| Advertised share-kit mill | 23 `advertised` + pack-enemy cluster | **23** `advertised` (unchanged title count). Pack-enemy **combat** titles now **11** (`#967/#972/#974/#978/#985/#989/#1026/#1033/#1034/#1039` + `#911`) |
| Map punches | 52 open `fix(map)` | 10-24 added four snaps `#1013/#1023/#1030/#1038`. Guardian RUNNING tonight |
| WX extracts | `#831/#842/#901/#961` | Plus **`#995` isometric tile paint** |

**Integrity that remains landed on `main` (do not re-open):** death replay `#183/#255/#256`, live Doka helpers `#180`, ignore-client `writeLevel`, AP/MP cap `#322`, bindgen summon fields, Pacifist preview, recap-under-credit gate, GameKey product `#258` + EOP source `#259/#311/#324`, Frozen/Slime execute MP `#313/#318`, barrier-aware `isBattleWalkTileBlocked`, spawnPolicy extract `#287`, challenge HUD `#332`, Enemy Register lore `#328`, Caffeine import gates + stack-compat.

**10-24 leftovers that are NOT done:** halt (including 06/12/18); living director index on `main`; Caffeine deploy confirmation; ADR; `#327` restack; mapGen/WX freeze; Swap landing; kit-zone number; discovery persist; admin DVA; `saveKillCount`; 30% random AI tier; share-kit helper; skip-wipe helper.

**New this run (not a rediscovery of 10-24):**

1. **Four recovered days in a row rebuilt the mill.** 10-21 opened 56; 10-22 opened 58; 10-23 opened 52; **10-24 opened 63**. Combined: **229 drafts in four days**. Queue 482 → 538 → 596 → 648 → **711+**.
2. **MTD-2026-10-24-005 is empirically failed.** 10-24 gameplay kept shipping at 03:09, 04:10, 06:12–06:15, 08:08–08:15, 09:18, 12:07–12:24, 16:13–16:24, 18:10–18:16, 20:10, and 21:18 UTC (skip-wipe, map snaps, pack-enemy). A pause that only covers midnight would not have stopped that mill.
3. Skip-wipe remount mill grew **30 → ~46**, and **#1043** opened at 00:07 today before this ledger finished. Local patches are no longer sufficient (MTD-2026-10-23-005 still OPEN; evidence grew).
4. Advertised-vs-execute mill is still standing: **23** one-flag `advertised` patches plus **11** pack-enemy combat PRs. One `resolveKitExecute` helper after halt, not a 12th fallback (MTD-2026-10-22-005).
5. 10-24 touched the freeze file again: `#995` isometric extract from WX. Hold it with `#831/#842/#901/#961`.
6. Admin implementer shipped more chrome: `#1001` owner names-busy / role-grant / confirm-chrome helpers (plus leftover `#945`). HOLD. Do not grow `AdminDashboard.tsx` (8,280) during the mill.
7. This 00:00 wave again includes map guardian, AI, combat-parity, boss, dungeon, complexity reduction, spell mechanics, spell discovery, critical hunter, expansion, world-content. GetAutomation confirms those UUIDs still **enabled**. Approved Design / persist auditor / admin implementer are enabled but IDLE in the first snapshot — that is not a halt.
8. GitHub search `created:2026-10-25` already has `#1043`–`#1060` before this ledger committed: skip-wipe twins `#1043/#1045/#1046`, pack-enemy `#1054`, advertised MAGIC_REFLECT `#1058`, expansion catalog `#1052`, TBC WAITING `#1053` (fourteenth inspection), canvas perf `#1059`. Combined recovered mill without dashboard disable is now the **steady state**, including the first minutes of day five.

---

## Seven-dimension evaluation

### 1. Correctness — official client still safer than the leftover queue

ENGINEERING: Persist clamps, ignore-client level, death replay, and GameKey-in-source remain the last good official-client snapshot. Do not open a fourth persist rewrite. Do not merge-burst skip-wipe or share-kit twins.

Recurring defect class: **teleport landing.** Swap still copies coordinates (`WorldExploration.tsx` 9389–9402 `swapPositions`) with no occupancy and no `applyHazardLanding` (zero hits in `src/`). `#541` and `#754` remain HOLD. `#850` is a share-kit `isSwap` twin, not a landing fix.

Recurring defect class: **preview vs execute / advertised vs live.** Frozen/Slime execute MP is closed (`battleWalkMpCost` / `enemyWalkMp`). The standing mill is **kit metadata honesty**: 23 one-flag `advertised` patches plus pack-enemy decide/approach/backline instead of one `resolveKitExecute(spell)` helper.

Recurring defect class: **kit zone NaN.** `buildEnemyKit(pieceType, number)` (`enemyAI.ts` 194–200) is still called with `currentMap.levelZone` (`WX` 11920), a `LevelZone` object (`WX` 4683–4687). `Math.floor(object)` → `NaN` → zone-0 kits. `currentZoneTier` already exists (`WX` 1136 / 4680). **Sixteenth** director cycle.

Recurring defect class: **path occupants.** `findPath` (`WX` 4466–4536) uses `isBattleWalkTileBlocked` with barriers/portals/void. Occupants are still not an argument. MIMA-2026-09-01-002 remains PARTIAL.

Recurring defect class: **Striker aim-tile.** Oldest open PR `#327` is still CONFLICTING (53 days). Twin `#370` is still MERGEABLE and a superset. Union ≠ concatenate.

Recurring defect class: **EOP deploy lag.** Source chain is correct (`20260901` GameKey, `OldActor = {}`, `check-limit = 5`). Tracked `.old` still has **no GameKey**. Live canister upgrade remains unproven after **52 days**.

### 2. Player experience — honesty on `main`; identity still incomplete

ENGINEERING: HUD leftover XP, recap feats, challenge HUD after accept, Enemy Register lore, Buy Doka vs Items copy are on `main`. Do not restack.

DESIGN (Expansion `#991`, PX `#1008`, MIMA `#1012`, TBC `#994`, no player data): the player is still handed the live catalog on minute one (`shouldIncludeBackendSpellInLibrary` returns true whenever `usableByPlayer !== false`, `adminSafety.ts` 712–718). Enemy-observed discovery is absent. Achievement/challenge/boss rewards remain Doka/XP. Four map modifiers remain announce-only. Family HP multipliers still die at battle start. `worldFeatures.ts` is still tests-only (`README.md`).

GameKey is a real PX/ops funnel in source; ops deploy is unconfirmed. Do not treat 0 redeem rows as “players don’t buy.”

MEASURED: none. TBC `#994` correctly refused to label spells over/underused. A mathematically powerful spell with no casts would be **undiscovered**, not weak, until SDA-002 exists.

### 3. Technical health — hotspot sizes frozen on `main`; mill not frozen

| Surface | Lines now (`0f5363f`) | 09-02 director | Verdict |
| :--- | ---: | ---: | :--- |
| `WorldExploration.tsx` | 19,213 | 19,253 | Freeze still broken as **intent**; file frozen only because humans stopped merging. `#831/#842/#901/#961/#995` wait to grow it. |
| `AdminDashboard.tsx` | 8,280 | 8,035 | Grew before 09-03. No publish pipeline. `#945` and `#1001` already opened. Admin implementer enabled. |
| `enemyAI.ts` | 2,580 | 2,583 | Frozen size. Tonight’s AI agent must not grow it. |
| `main.mo` | 3,903 | 3,838 | GameKey + clamps in source. Deploy unconfirmed. |
| `mapGen.ts` | 1,937 | 1,544 | Grew on `main` before freeze. Guardian RUNNING. |
| `targeting.ts` | 1,199 | 1,031 | Leave it. |
| `progressPersist.ts` | 421 | 323 | Leave the lock. Skip-wipe mill (~46) is the magnet now. |
| `spellEngine.ts` | — | — | Share-kit mill magnet. |
| `deathPenalty.ts` | — | 597 | Leave it. |

`996df6df` is still not GetAutomation-visible. Critical hunter `1aa41c6c` is **RUNNING** this hour (GetAutomation UUID not visible to this principal; agent list confirms the short id). Complexity `386a157d`, combat-parity `f37b7505`, map guardian `9dcfd122`, AI `67b03c2f`, expansion `3f31b18f` are **enabled and RUNNING**. Approved Design `fe5b679a`, persist auditor `607e0304`, and admin implementer `3089f18d` are **enabled** and IDLE in the first snapshot.

Caffeine import gates and stack-compat stay. Oldest-first still makes this living index unreachable behind `#327` CONFLICTING and fourteen director snapshots of `MASTER_ROADMAP.md`.

### 4. Content depth — over-specified, under-wired, Wave 16 already drafted

Present on `main`: player-relative tier spawn, AI tiers 1–10, named boss kits, dungeon chain, Boss Rush, 9 challenges, feats, frontend catalog + GameKey shop.

Dead or contradictory vs core rules:

- Dynamic enemy spell pools: implemented and dead (zone-0 kits).
- Progressively sophisticated enemies: undermined by 30% fully random `computeAITier` (`combatMath.ts` 34–50).
- Enemy-observed spell discovery: absent.
- Achievement/challenge/boss spell unlocks: Doka/XP only.
- Admin Draft → Validate → Activate: not a canister workflow.
- `worldFeatures.ts` still tests-only.
- `ENEMY_AI_TIER_GATES` names still unused as live gates.
- 10-24 expansion `#991`, elites `#997`, boss sheets `#1004`, spell proposals `#1011`, discovery `#1017`, AI `#999` are overlapping catalogs. That is expansion overlap, not a license to implement.

Over-developed: automation report catalogs, share-kit one-flag patches, skip-wipe clones, map crumb snaps, WX paint extracts.  
Neglected: landing authority, kit-zone wiring, ownership persist, reward-trust ADR, GameKey deploy confirmation, `saveKillCount`.

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

Expansion that adds spells, AI behaviors, or admin chrome before halt + `#327` restack + landing helper + ADR + confirmed GameKey deploy will not scale. Wave 16 catalogs must wait.

### 6. Data / persistence safety — official client safer; mill is the risk

`saveBattleStats` may still **lower** Doka/XP (required). It must not raise them. Finding 3 is still stale if phrased as “must not write Doka.”

`applyRewards` is still client-trusted within 100k/500k. `calculateAndAwardDoka` remains an unused public mint. `markAchievementUnlocked` is still unproven.

`redeemGameKeyThroughPersist` (`shopPurchase.ts` 294–330) still does **not** honour unpaid death. `#391` drafts the helper and does not wire redeem. Hold skip-wipe clones; they are not that wire.

`.old` is still Caffeine’s Aug-31 no-GameKey signature. Do not hand-write it. Freeze new stables.

Wallet seeding / idle-hydrate / unpaid death replay remain load-bearing. Do not invent a second persist path for telemetry or discovery grants. TBC/GTAD: sidecar **off** the persist lock.

### 7. Automation coherence — P0, recovered platform, mill is now the four-day steady state including daytime cadences

Halt-as-config has failed every midnight it was asked (08-31…09-29, then 10-21, 10-22, 10-23, 10-24, now 10-25). Halt-as-merge-stop has held **52 days**. The 22-day gap was ERROR/boot (MTD-2026-10-21-003), recovered on 10-21.

10-21 through 10-24 together are the proof that **recovery without dashboard disable = mill restart**. 229 new drafts in four days, including frozen-file hits **after noon UTC**. 10-25 already has 47 agents RUNNING and skip-wipe `#1043` open.

Cursor Cloud has **no write API** for dashboard prompts. Halt is a human config action. In-repo gates cannot pause cron.

| AQA / MTD ID | Director status 2026-10-25 |
| :--- | :--- |
| AQA-001 hunter throttle | **OPEN** — `996df6df` still not GetAutomation-visible. |
| AQA-002 one critical hunter | **OPEN** — `1aa41c6c` **RUNNING** this hour. |
| AQA-003 in-repo ACTION_ID ledger | **PARTIAL** — this run writes `ACTION_IDS_2026-10-25.md`. Living index still off `main`. |
| AQA-004 don’t merge the 08-30 stack | **SUPERSEDED** — accept `main`. |
| AQA-005 test clone mill | **PARTIAL** — 10-24 opened `#1022/#1027/#1035`. Defect-recurrence RUNNING tonight. |
| AQA-006 no mapGen implementation | **BROKEN** — guardian RUNNING; 10-24 added four snaps. |
| AQA-007 freeze drive-by WX | **BROKEN** — `#831/#842/#901/#961/#995` already opened; complexity reduction RUNNING. |
| AQA-008 security → ADR | **PARTIAL** — clamps on `main`; no ADR. Security RUNNING. |
| AQA-009 orchestrator must not implement gameplay | **PARTIAL** — tonight’s orchestrator is running. |
| AQA-010 persist/economy dedup | **PARTIAL** — cluster landed; skip-wipe mill is the leftover. Persist auditor enabled (IDLE first snapshot). |
| AQA-011 prompts vs live architecture | **OPEN** |
| AQA-012 outcome telemetry | **OPEN** — TBC `#994` correctly WAITING. Dashboard specialist RUNNING with nothing to display. |
| MTD-001 flock halt | **OPEN** — failing again tonight. |
| MTD-2026-10-24-001 | **OPEN** — that wave ran and opened 63 PRs. |
| MTD-2026-10-24-005 | **OPEN** — empirically failed (24 of 63 PRs after 01:00 UTC). |
| MTD-2026-10-25-001 | **NEW** — hold tonight’s wave. Already `#1043`–`#1060`. |
| MTD-2026-09-25-005 | **OPEN** — oldest-first still blocked. |

---

## Recurring hotspots — local patches no longer sufficient

Do **not** automatically perform a large refactor.

1. **Automation flock + leftover queue** — the binding constraint. Disable implementers **and** daytime hunter-implementers in the dashboard. Do not merge-burst 711+ drafts.
2. **Catalog advertised vs execute** — **23** open `advertised` flag patches plus **11** pack-enemy combat PRs. After halt, one `resolveKitExecute` helper + tests. Close the twins. Do not grow `spellEngine.ts` / `enemyAI.ts` by one effect per PR.
3. **Skip-wipe / remount hydrate** — **~46** open twins on the `#330` keep, plus `#1043` tonight. One shared remount-wipe guard after halt (MTD-2026-10-23-005), not a 47th clone. Distinct from `#391` unpaid-death honour on GameKey redeem.
4. **Landing / occupancy** — Swap + summon-walk hazards still need `applyHazardLanding`. Occupancy dest for summons already exists. One helper PR; one-line WX wiring. HOLD `#541/#754`.
5. **Kit-zone number (PREREQ-A)** — not a refactor. One call site. Unblocks dynamic pools. Wait until the flock is held.
6. **Canister trust** — write the ADR (AQA-008). No new credit APIs and no discovery grant writer until then.
7. **EOP deploy** — confirm Caffeine 20260901, then refresh `.old` from that build. Never hand-write `.old`. No new stables until then.
8. **mapGen portal-punch / leftover-crumb** — freeze. Guardian = fixtures + ACTION_IDs only.
9. **HP/death extraction (MTD-003)** — still valid. Do not start it in the same hour as the flock.

---

## Human merge queue (do not autonmerge)

| Order | PR | Action |
| :--- | :--- | :--- |
| — | **This docs PR** | Review. Close #338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, #946, **and #998** without merge. |
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
| — | **#814–#1042 gameplay** | **HOLD** (10-21 / 10-22 / 10-23 / 10-24 mills: skip-wipe, share-kit, crumbs, dust-mote / whirlpool / pixel-pattern / isometric extracts, hostile summons, pack-enemy, admin helpers). |
| — | Any 10-25 00:00 PR including `#1043`–`#1060` | Default **HOLD**. Especially WX, mapGen, targeting, persist, `enemyAI`, AdminDashboard, `main.mo` stables, telemetry UI, RAF, skip-wipe `#1043/#1045/#1046`, pack-enemy `#1054`, advertised `#1058`, canvas perf `#1059`. Docs-only catalogs may remain unmerged. Keep `#1053` as the TBC leftover for this SHA (fourteenth WAITING); close later twins. |

Do not restack death-replay, `writeLiveDoka`, `writeLevel`, leftover-XP HUD, recap click-through, challenge HUD, Enemy Register lore, or GameKey product code.

---

## Prioritized roadmap (what to work next)

**P0 — do these before any expansion PR merges**

1. Halt the 10-25 same-hour implementer flock **and** the 06/12/18 hunter-implementer cadences (MTD-2026-08-31-001, MTD-2026-10-25-001, MTD-2026-10-24-005). Do not merge-burst 711+ drafts (MTD-2026-10-25-004).
2. Unblock the living director index: close superseded director PRs including #998; restack or replace #327 (MTD-2026-10-25-002, MTD-2026-09-25-005).
3. Confirm Caffeine deploy of the 20260901 GameKey tail and refresh `.old` (MTD-2026-09-21-002). Freeze new stables until then (MTD-2026-09-02-003).
4. Write the reward-trust ADR (AQA-008).
5. Ledger hygiene: this file + `ACTION_IDS_2026-10-25.md` only (MTD-2026-09-02-004).

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
25. Visual / game-feel / mobile — DESIGN.md already specifies the look. a11y 44px twins are optional after halt; do not edit combat math or WX for feel.
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
| 23 advertised + 11 pack-enemy PRs vs one honesty helper | MTD-2026-10-22-005. Close twins; one helper after halt. |
| ~46 skip-wipe PRs vs `#391` GameKey unpaid-death | Distinct holes. Skip-wipe = remount `saveBattleStats` vs committed keep. `#391` = honour 20/40 before redeem credit. |
| Progressive AI vs 30% random tier | Design decision later; no first-hour AI PR. Tonight’s AI agent is the violation. |
| SDA vs SDE vs SPELL_DISCOVERY vs EBA vs BOSS vs Wave 16 | One discovery persist shape (SDA-002/004). Others are content cards. |
| Expansion specialists vs “P0/P1 first” | 10-21…10-25 AI / boss / dungeon / complexity / expansion agents are the violation. Hold implementation. |
| Telemetry dashboard vs no counters | AQA-012 first. TBC stays WAITING_FOR_TELEMETRY. Keep `#333`; close later TBC twins including `#871/#928/#994`. |
| Empty/Aug-31 `.old` vs live Caffeine | `.old` is the **real** Aug-31 signature (no GameKey). Import of HEAD should pass. Deploy still unconfirmed. Do not hand-write `.old`. |
| GameKey on `main` vs canister | Source is ahead of confirmed deploy. Do not revert GameKey product. |
| `usableByPlayer=false` as retire vs enemy-only gate | SDA-2026-09-01-001; do not extend the flag. |
| Family HP paper vs `calcEnemyMaxHp` | PREREQ-H; honesty bug; not an AI rewrite. |
| 52-day freeze vs “halt failed” vs 22-day PR silence vs 10-21…10-24 restart | Halt failed as **config**. It succeeded as **human merge stop**. The 22-day gap was **ERROR/boot**. Recovery **reopened the mill** (+56 then +58 then +52 then +63 drafts). Merging that mill undoes the merge-stop half. |
| Midnight halt vs 06/12/18 mill | 10-23 and **10-24** proved daytime cadences ship skip-wipe/map/share-kit. Halt must be **all implementer schedules** (MTD-2026-10-24-005). |
| #338…#998 vs this PR | This file subsumes all thirteen. Close them without merge. |
| 09-22…10-25 persist HUD twins vs #330 keep | #330 is on `main`. Hold the twins including `#742`…`#1043`. |
| #501 leftover walk rAF vs `AGENTS.md` | RAF is frozen. Hold #501 and #761 even if the race is real. |
| Oldest-first stack vs living director index | Close superseded director snapshots; restack #327; do not merge-burst 711 drafts (MTD-2026-09-25-005). |
| Combat-parity UUID `-a486` vs `-a484` | Live automation is `f37b7505-a484`. |
| Expansion UUID `-a49e` vs `-a492` | Live automation is `3f31b18f-a492`. |
| `ARCHITECTURE.md` `check-limit = 4` vs `mops.toml` `5` | Stale `main` docs (line 28). Living index never landed. Do not “fix” by a Motoko PR. |
| TBC `2786666f` vs “Stralt game balance” `3c083a4a` | Different automations. TBC must stay WAITING. The other balance agent must not retune `BAL-*` either. Both RUNNING tonight. |
| GTAD sidecar vs persist lock | Counters fire **after** persist returns, or query-only. Never enqueue telemetry on `progressPersistRef`. |
| gh `pack-enemy` search = 71 vs 11 combat PRs | Tokenization matched design docs. ENGINEERING count for the mill is **11** combat titles, not 71. |

---

## TOP 5 CURRENT PRIORITIES

1. **Halt the 2026-10-25 implementer flock and the 06/12/18 hunter-implementer cadences** (47 RUNNING this hour, including map guardian `9dcfd122`, AI `67b03c2f`, combat-parity `f37b7505`, boss `39040ad2`, dungeon `73740435`, complexity reduction `386a157d`, spell mechanics `1330956a`, spell discovery `c26e5a83`, critical hunter `1aa41c6c`, expansion `3f31b18f`) and **do not merge-burst the 711 leftover drafts**. 10-21 through 10-24 recovery opened **229** PRs in four days, including daytime skip-wipe/map/pack-enemy — that is the failure mode, not a backlog to clear. Tonight already opened `#1043`–`#1060` (skip-wipe, pack-enemy, advertised, expansion, TBC, canvas perf).
2. **Unblock the living director index** — close #338/#402/#448/#509/#569/#618/#666/#718/#783/#814/#870/#946/#998 without merge; **restack #327** so oldest-first is not a 53-day CONFLICTING gameplay PR sitting in front of every later change (MTD-2026-09-25-005).
3. **Confirm Caffeine deploy of the 20260901 GameKey tail** and refresh `.old` from that build (MTD-2026-09-21-002). Source has been ready for 52 days; ops is not proven.
4. **Reward-trust ADR (AQA-008)** — clamps, ignore-client level, and AP/MP cap landed; the written decision did not. Security is running again tonight.
5. **After halt: merge restacked #327** (Striker AoE/bounce), then union #370’s AI/summon delta only, then **re-freeze WX / mapGen** and replace the advertised mill (**23**) and skip-wipe mill (**~46**) with one helper each.

## BLOCKED WORK

- Spell discovery / observed enemy kits / new unlock loops — no ownership persist, combat landing still racing, ADR unwritten, Caffeine deploy of GameKey unconfirmed.
- Enemy AI capability expansion — `enemyAI.ts` already 2,580 lines; kits never leave zone 0; HP/death still dual-written. Tonight’s AI agent must not grow it.
- Telemetry admin dashboard — no counters to display (AQA-012). Balance analyst correctly WAITING.
- Any Motoko PR that adds stables until deploy is confirmed and `.old` refreshed.
- Further `mapGen.ts` punches (including **#331**) without an explicit human playtest of the #321→#329 sequence.
- Custom-client mint proofs / new credit APIs until the ADR exists.
- `calculateAndAwardDoka` productization (unused official path; still a sink).
- Formula-level `BAL-*` / `LHIPS-*` retunes (no telemetry; jackpot 100k clamp is architecture).
- Admin Draft→Validate→Activate chrome on the 8.3k dashboard before canister lifecycle exists. HOLD `#945` and `#1001`.
- Sequential merge of the 711 leftover gameplay drafts “to clear the queue.”
- RAF / walk-stepper edits (#501/#761), leftover-walk mill, Death Realm skip mill, dump-alcove mill, live-gate mill, combat-effect mill, share-kit mill, skip-wipe mill, Swap mill (#541/#754).
- Approved Design / AI / boss / dungeon / complexity / spell-mechanics / combat-parity / admin-implementer / critical-hunter implementation from tonight’s flock.
- Wave 16 expansion cards and pack-enemy / healer-interpose gates on `enemyAI.ts`.

## SAFE EXPANSION WORK

- Land this docs PR; close #338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, #946, and #998.
- Restack/merge #327 (scoped Striker helper + tests). Do not duplicate it in #370 until unioned.
- Adopt per-producer ledgers + this director index (AQA-003) — process, not gameplay.
- Design-only (no PR, or docs-only if already launched): keep SDA/SDE/EBA catalogs; do not author a fifth discovery schema; do not implement Wave 16 boss sheets or AI behaviors.
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
- `src/frontend/src/components/AdminDashboard.tsx` (HOLD `#945` / `#1001`)
- `src/backend/main.mo` persistent fields until deploy confirmation
- Frozen chain files `20260831_000000.mo` / `20260901_000000.mo`
- `docs/automation/ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, and `ACTION_IDS_2026-09-21.md` through `ACTION_IDS_2026-10-24.md` (do not append)
- GameKey product methods except unpaid-death honour on the existing redeem helper

## ARCHITECTURAL HOTSPOTS

1. Unconfirmed Caffeine deploy vs correct-in-source EOP chain (`20260901` GameKey; `.old` still Aug-31) — now **52 days**
2. Dual HP / death / landing authority (React snapshot vs `combatantsRef` vs Swap/summon/destack teleport)
3. Client-trusted `applyRewards` without a written ADR (clamps exist; decision does not)
4. 19k-line world orchestrator absorbing every hunter (`#831/#842/#901/#961/#995` already in the leftover queue)
5. Automation pile-on (**711+** leftover drafts + 10-25 restart already RUNNING) after a recovered 22-day ERROR outage that was **not** a halt — now including **daytime cadences** and a **four-day** recovered mill
6. Oldest-first queue vs living director index (#327 CONFLICTING head; #331 also CONFLICTING; fourteen director snapshots)
7. mapGen portal-punch / battle-graph / leftover-crumb (guardian RUNNING; four more snaps on 10-24)
8. Dual spell catalogs + implicit ownership (blocks discovery)
9. Kit-zone object call site (dynamic pools implemented and dead; number already in `currentZoneTier`; sixteenth cycle)
10. Striker victim-tile authority split across #327 and #370
11. Unseeded-wallet / remount-wipe HUD twins stacked on the #330 keep (**~46** skip-wipe drafts + `#1043`)
12. Leftover-walk abort mill (#501 RAF + clones + #761)
13. Death Realm pending vs wallet writes
14. Combat live-gate / catalog-effect mill plus **23** advertised-vs-execute twins and **11** pack-enemy combat PRs
15. Swap mill (#541 + #754) instead of `applyHazardLanding`
16. AI / boss / dungeon / complexity / spell-mechanics / combat-parity / critical-hunter running against an over-specified, under-wired catalog

## TELEMETRY SIGNALS WORTH INVESTIGATING

**None can be investigated in production — the series do not exist.** TBC `#994` (2026-10-24) is the thirteenth WAITING inspection of `0f5363f`. Tonight’s TBC will be the fourteenth. Do not treat architecture docs as rows.

When AQA-012 lands, investigate in this order (engineering + design, not telemetry-alone priority):

1. persist-ok vs persist-fail and death-penalty-applied vs victory-paid vs **single-axis-credit-then-death** (integrity; #183/#256/#330 class — measure whether the hole is closed, do not assume)
2. GameKey request vs approve vs redeem vs redeem-fail (ops; new funnel; do not treat 0 rows as “players don’t buy”)
3. recap opened vs dismissed vs lava-death-during-recap (PX; input gate may have closed — measure)
4. spell-cast counts **by acquisition path** (starter vs unlocked vs observed) — a “weak” spell may be undiscovered, not weak. Today every catalog id is treated as owned, so this series would be **meaningless** until SDA-002.
5. Attack Nearest vs aimed-cast ratio (gate confusion vs power)
6. challenge accept vs complete vs advertised-reward-missing vs **Striker splash/bounce beyond 2** (#327 — if complete rate is high on Nova/Chain, DESIGN INTERPRETATION is the aim-tile hole, not player skill)
7. Swap / summon-walk / destack onto hazards vs walk onto the same tile (MIMA-001 remainder — if “Untouchable complete rate” is high, DESIGN INTERPRETATION is skip-landing, not player skill)
8. Frozen/Slime maps: tiles walked vs preview budget (09-01-001 is closed in source — measure whether leftover-1-MP walks remain)
9. unseeded-lock HUD vs committed Doka after one-shot / GameKey / feat / shop / heal (09-22…10-25 persist twins — if wallet “resets,” ENGINEERING is hydrate, not player spend)
10. leftover-walk after last hostile / into Death Realm / into battle start (#501/#761 mill — if players “slide” after victory, ENGINEERING is walk-cancel, not feel)
11. Death Realm pending vs shop/heal/GameKey (if wallets move during 1.5s death, ENGINEERING is missing a shared guard, not player intent)
12. Shield / shred / Trap / Soul Rend / drain / Pacifist-kit / Chain Lightning bounce / Mark / Mirror / Swap / DoT ticks / buffStat / pack-enemy Inferno casts vs advertised numbers (combat-effect mill — if players call those spells “broken,” ENGINEERING may be execute-path skip, not balance)
13. Hostile summon kit casts vs empty `spells` at spawn (#842/#861 — if summons “do nothing,” ENGINEERING is catalog wiring, not AI tier)

Until those exist: automations must not claim CLEAR_POSITIVE_SIGNAL or “players don’t use X.” Distinguish MEASURED PLAYER BEHAVIOUR (none) from DESIGN INTERPRETATION and ENGINEERING EVIDENCE.

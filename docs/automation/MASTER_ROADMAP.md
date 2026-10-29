# Stralt Master Roadmap

**Director:** Stralt Master Technical Director (`0b92479e-a49e-11f1-a7d1-d6b4613131ce`)  
**Run:** 2026-10-29 00:01 UTC (daily cron)  
**This agent:** `bc-2723053f-7923-4204-ba34-dd06d550d432`  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (accepted-challenge HUD) — **unchanged since 2026-09-03 00:28 UTC**  
**Prior director:** unmerged [`#1254`](https://github.com/Mr-Melic/stralt/pull/1254) (`bc-a10d07cd-1edb-4ea7-a500-ff3c617d7329`, 2026-10-28). On `main`, this file is still the 2026-09-02 text.  
**Gameplay / production code:** not modified.

This file is the living prioritized roadmap. ACTION_ID records for this run live in [`ACTION_IDS_2026-10-29.md`](./ACTION_IDS_2026-10-29.md). Close superseded director PRs **#338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, #946, #998, #1074, #1124, #1186, and #1254** when this lands — do not merge all eighteen. Process audit on `main`: [`QUALITY_AUDIT_2026-08-30.md`](./QUALITY_AUDIT_2026-08-30.md). Unmerged weekly audit: [`#1106`](https://github.com/Mr-Melic/stralt/pull/1106) (2026-10-18→10-25). Dump yards: `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, and the unmerged 09-21…10-28 ledgers. Do not append to those files.

## Evidence available this run

| Source | Status |
| :--- | :--- |
| `AGENTS.md`, `README.md`, `DESIGN.md`, `docs/ARCHITECTURE.md` | Read. `ARCHITECTURE.md` line 28 still says `check-limit = 4`; `mops.toml` is `5`. Stale docs, not a Motoko bug. |
| Prior director roadmap (2026-10-28, unmerged #1254) + memories | Read. Halt-as-config asked again, including daytime cadences (MTD-2026-10-24-005). Humans still have not merged `main`. |
| Specialist reports on `main` | Still the 08-30…09-02 set. Later catalogs live only on unmerged drafts. |
| Unmerged 2026-10-28 specialist PRs | Full day `#1218`–`#1276` (**59** drafts). TBC `#1232` WAITING (seventeenth inspection of `0f5363f`; 0 collectors). Wave 20/21 catalogs `#1235/#1237/#1244/#1248/#1251/#1255`. WX extract `#1241`. Advertised / share-kit / soak combat mill. Map snaps `#1229/#1258/#1265/#1275`. Skip-wipe `#1239/#1268/#1276`. Admin `#1223`. |
| Open ACTION_IDs | Reuse. Director index = this file + `ACTION_IDS_2026-10-29.md`. |
| Recent commits | `git log` since 2026-09-03: **none** on `origin/main`. Last merge `#332`. |
| Open drafts | GitHub search **945** at first count; **947** after `#1277`–`#1279` opened during this run. 10-28 flock opened **59** (`#1218`–`#1276`). |
| Player telemetry | **Still none.** `longHorizonSim.telemetry.available === false`. No `recordTelemetry` / sidecar in `src/`. TBC stays `WAITING_FOR_TELEMETRY`. |
| Same-hour flock | **~51** automations this hour: **~49 RUNNING**, **1 IDLE** (Approved Design `fe5b679a` after a start), **1 ERROR** (critical hunter `1aa41c6c-a483`). Map guardian, AI, combat-parity, persist auditor, boss, dungeon, complexity reduction, spell mechanics, spell discovery, expansion, invariants, security, TBC, telemetry dashboard, admin implementer `3089f18d`, and docs/contract specialists are RUNNING. |
| Weekly quality audit `#1106` | ENGINEERING corroboration through 10-25: 436 automation runs, 292 drafts, 0 merges, 0 closes. Classifies map/persist/combat/#62 paint as NEGATIVE_ROI. Agrees halt + do-not-merge-burst. No newer weekly covering 10-26…10-28. |

**Evidence classes used below**

| Class | Meaning |
| :--- | :--- |
| MEASURED PLAYER BEHAVIOUR | Live play counters. **None exist.** |
| DESIGN INTERPRETATION | Product rules in this prompt + `AGENTS.md` / `DESIGN.md` / specialist design docs |
| ENGINEERING EVIDENCE | Code on `0f5363f`, tests, open-PR mill, automation volume, hotspot call sites, `#1106` process audit |

Telemetry is not allowed to set priority. Correlation is not causation. No CLEAR_POSITIVE_SIGNAL is claimed.

---

## What changed since the 10-28 director run (do not rediscover)

`main` **did not move.** The 10-28 halt was ignored as dashboard config and **obeyed as human merge-stop**.

| Fact | 10-28 director | This run |
| :--- | :--- | :--- |
| HEAD | `0f5363f` (55 days) | `0f5363f` (**56 days**) |
| Open drafts | 886 at first count; **921** by stack-compat after `#1218`–`#1252` | GitHub search **945**. 10-28 finished at `#1276`. No 10-29 PRs yet except this index. |
| 10-21 … 10-27 mill | 56 + 58 + 52 + 63 + 65 + 55 + 55 = 404 | Still unmerged |
| 10-28 implementer flock | 48 RUNNING; hold; first hour already 35 | **Did not hold.** Opened **59** PRs (`#1218`–`#1276`) **across the whole day** (00/04/06/08/12/16/18 UTC). 00:00 = 39; after 01:00 = **20** |
| Director snapshots on the living files | 17 unmerged (#338…#1186 + #1254 in flight) | **18** unmerged once #1254 is counted. `main` still serves 09-02 |
| #327 Striker | CONFLICTING, 56 days | CONFLICTING, **57 days**. Still the oldest open PR (`mergeable_state: dirty`) |
| #331 destack | CONFLICTING | Still CONFLICTING (`dirty`) |
| Caffeine 20260901 deploy | Unconfirmed; `.old` Aug-31 no-GameKey | Unchanged. Grep GameKey in `.old` = 0. Newest deployed snapshot still `pr259-tail-20260901.most` |
| Reward-trust ADR | Missing | Still 0 `docs/**/*ADR*` |
| Telemetry collectors | 0 | 0. TBC `#1232` correctly WAITING (seventeenth inspection). Tonight’s TBC run will be the **eighteenth** WAITING clone of this SHA |
| 10-29 flock | n/a | **~49 RUNNING** + 1 IDLE + 1 ERROR. Same implementer UUIDs still **enabled**. Admin implementer `3089f18d` is **RUNNING** this hour (IDLE on 10-28). Critical hunter `1aa41c6c-a483` **ERROR** this hour — still enabled, not a halt. Approved Design `fe5b679a` started then IDLE. **Already opened during this ledger:** TBC `#1277` (eighteenth WAITING clone), advertised `#1278` Pale Archbishop skeleton-minion, docs `#1279`. Queue **945 → 947**. |
| Skip-wipe mill | GitHub `"skip remount"` ~115 claimed; `#1239` already in first hour | Exact-phrase `"skip remount"` = **77**. 10-28 added `#1239` leftover spell-level, `#1268` leftover bar keep, `#1276` throw-after-accept inventory. Mill standing |
| Advertised / pack-enemy mill | 109 open; four already in first hour | **Dominant mill still.** GitHub `advertised` = **129**. 10-28 added `#1220/#1231/#1252/#1259/#1264/#1273` plus share-kit `#1238/#1260/#1263/#1270`. `summon-control` search = **53** |
| Soak mill | Did not grow on 10-27; HOLD six + Swap | **Grew on 10-28:** `#1257` pack SR, `#1262` boss-kit SR. Still no `applyHazardLanding` in `src/`. HOLD the six plus the two new plus Swap `#541/#754` |
| Map punches | `#1229` already tonight | 10-28 added `#1229/#1258/#1265/#1275`. Guardian RUNNING again |
| WX extracts | `#1241` already tonight | `#1241` floor AO gradient joined `#1196` battle-floor. Complexity reduction RUNNING |
| Pale Archivist / kit-HP tests | Continues | `#1247` Final Pawn Strike; `#1261/#1271` Fetid Rook; `#1273` Pale Archivist atk 8. Test mill, not 13 P0s |
| TBC WAITING clones | 17 dated reports (`#333`…`#1232`) | **17** still; tonight’s TBC is the eighteenth clone in flight |

**Integrity that remains landed on `main` (do not re-open):** death replay `#183/#255/#256`, live Doka helpers `#180`, ignore-client `writeLevel`, AP/MP cap `#322`, bindgen summon fields, Pacifist preview, recap-under-credit gate, GameKey product `#258` + EOP source `#259/#311/#324`, Frozen/Slime execute MP `#313/#318`, barrier-aware `isBattleWalkTileBlocked`, spawnPolicy extract `#287`, challenge HUD `#332`, Enemy Register lore `#328`, Caffeine import gates + stack-compat.

**10-28 leftovers that are NOT done:** halt (including 06/12/18); living director index on `main`; Caffeine deploy confirmation; ADR; `#327` restack; mapGen/WX freeze; Swap landing; kit-zone number; discovery persist; admin DVA; `saveKillCount`; 30% random AI tier; share-kit helper; skip-wipe helper; soak helper.

**New this run (not a rediscovery of 10-28):**

1. **Eight recovered days in a row rebuilt the mill.** 10-21 opened 56; 10-22 opened 58; 10-23 opened 52; 10-24 opened 63; 10-25 opened 65; 10-26 opened 55; 10-27 opened 55; **10-28 opened 59**. Combined: **463 drafts in eight days**. Queue 482 → 538 → 596 → 648 → 711 → 776 → 831 → 844 → 886 → 921 → **945**.
2. **MTD-2026-10-24-005 failed a fifth recovered day.** 10-28 gameplay kept shipping at 04:24 (`#1257`), 06:13–06:16 (`#1258`–`#1260`), 08:10–08:13 (`#1261`–`#1263`), 12:12–12:19 (`#1264`–`#1269`), 16:08–16:15 (`#1270`–`#1272`), 18:10–18:22 (`#1273`–`#1276`). After 01:00 = **20 of 59**.
3. **The active patch stream stayed on advertised-vs-execute combat and grew a soak sibling.** Advertised search 109 → **129**. Soak mill, silent on 10-27, added `#1257/#1262`. Summon-control share-kit search = **53**. Local one-flag patches are still not sufficient (MTD-2026-10-22-005 / MTD-2026-10-26-005).
4. 10-28 touched the freeze file again: `#1241` floor AO gradient extract from WX. Hold it with `#831/#842/#901/#961/#995/#1076/#1109/#1196`. Quality audit `#1106` still scores the paint-extract strategy as NEGATIVE_ROI / FAKE MODULARITY.
5. `#1254` did not land. Oldest-first still blocks the living index (MTD-2026-09-25-005). Close list now includes `#1254`.
6. Admin implementer `3089f18d` is **RUNNING** this hour (IDLE on 10-28). Still **enabled**. Do not read yesterday’s IDLE as a halt. Critical hunter ERROR this hour is infrastructure noise, not a disable.

---

## Seven-dimension evaluation

### 1. Correctness — official client safer than the mill; landing + kits still lie

ENGINEERING: Death replay, live Doka refs, ignore-client level, GameKey, Frozen/Slime execute MP, and barrier-aware walk remain on `main`. Do not open a fourth persist rewrite.

Recurring defect class: **teleport landing.** Swap still copies coordinates (`WX` 9389–9402). No `applyHazardLanding` anywhere in `src/`. Soak mill grew again (`#1257/#1262`) instead of extracting one helper.

Recurring defect class: **advertised vs execute.** 129 open `advertised` titles. Combat-parity is RUNNING again tonight. One `resolveKitExecute` helper after halt — not another flag PR.

Recurring defect class: **kit zone NaN.** `buildEnemyKit` expects `number` (`enemyAI.ts` 194–197). Battle start still passes `currentMap.levelZone` object (`WX` 11920). `currentZoneTier` already exists at line 1136. **Twentieth cycle.**

Recurring defect class: **EOP stables.** Source chain is frozen and correct. Live Caffeine previous-version signature is still Aug-31 no-GameKey. Do not stuff fields into `20260831` / `20260901`.

### 2. Player experience — honesty up, identity still incomplete

ENGINEERING: HUD leftover XP, recap feats, recap-under-credit input gate, Enemy Register lore, accepted-challenge HUD. Those were unique; do not re-implement.

DESIGN (PXA + Expansion + Spell Admin, no player data): the player is still handed the live catalog on minute one. Enemy-observed discovery is **not implemented**. Achievement/challenge/boss rewards remain Doka/XP, not spells. Four map modifiers are announce-only stubs. Family HP multipliers still die at battle start.

MEASURED: none. Do not claim spells are over/underused. An unused kit spell in the mill is ENGINEERING (execute lying), not MEASURED PLAYER BEHAVIOUR.

### 3. Technical health — hotspot + ledger + mill

| Surface | Lines now | Verdict |
| :--- | ---: | :--- |
| `WorldExploration.tsx` | 19,213 | Freeze broken; paint extracts are FAKE MODULARITY |
| `AdminDashboard.tsx` | 8,280 | No publish pipeline. Admin mill `#945/#1001/#1066/#1115/#1190/#1223` HOLD |
| `enemyAI.ts` | 2,580 | Frozen size; do not grow tonight |
| `main.mo` | 3,903 | GameKey + clamps in source; `.old` still Aug-31 |
| `mapGen.ts` | 1,937 | Freeze broken; four more snaps on 10-28 |
| `progressPersist.ts` | 421 | Leave it |
| `targeting.ts` | 1,199 | Leave it |
| `deathPenalty.ts` | — | Leave it after `#256` |

Living director index is still off `main` (eighteenth snapshot). Caffeine import gates + stack-compat remain the enforceable half. Cursor Cloud has **no write API** for dashboard prompts.

Stale paths remain documented, not live bugs: `dfx.json` → missing `src/backend_extended`; root `declarations/` 15-field snapshot; unused `src/backend/mixins/*`.

### 4. Content depth — over-specified, under-wired

Present on `main`: player-relative tier spawn, AI tiers 1–10, named boss kits, dungeon chain, Boss Rush (10 rooms), 9 challenges, feats, frontend catalog + GameKey shop.

Dead or contradictory vs core rules:

- `buildEnemyKit(..., currentMap.levelZone)` still passes an **object** → zone-0 kits forever.
- `computeAITier` still has a **30% fully random 1–10** roll (`combatMath.ts` 34–50).
- Dual spell catalogs; admin adding a catalog spell still grants it to every player (`adminSafety.ts` 712–718).
- `worldFeatures.ts` still tests-only; no WX import.
- Wave 19/20/21 catalogs are twins of earlier waves. Expansion overlap, not a license to implement.

### 5. Long-term scalability — rules vs implementation

| Core rule | Implementation on `0f5363f` |
| :--- | :--- |
| No character level cap | Yes (`applyRewards` Nat loop). HUD saturates at 48. |
| Increasing XP | Yes `100 * 2^(N-1)`. Practical wall ~level 15–22 on kill XP (DESIGN, not a bug to “fix” tonight). |
| Player-relative enemies | Yes until the 999-tier ceiling. |
| Progressively sophisticated enemies | Partial; 30% random tier + zone-0 kits undermine it. |
| Dynamic enemy spell pools | Boss phases yes; overworld = static piece kits stuck at zone 0. |
| Enemy-observed spell discovery | **Absent** |
| Achievement / challenge / boss spell unlocks | Rewards are Doka/XP |
| Backend-authoritative persistence | Wallet/XP/death yes (clamped; level pinned). Combat client-side. BuffShop potions still `${principal}_inventory`. GameKey redeem is canister-authoritative **in source**. |
| Optional owner-uploaded visuals + pixel fallback | Still true. Do not make URLs required. |
| Admin Draft → Validate → Activate | **Not a canister workflow.** |

Expansion that adds spells, AI behaviors, or admin chrome **before** halt, landing-authority extraction, Caffeine `.old` refresh, and a reward-trust ADR will not scale.

### 6. Data / persistence safety — official client safer; live upgrade unconfirmed

`saveBattleStats` may still **lower** Doka/XP (required for heals/spends/death). It must not raise them — that write is on `main`. Finding 3 is still stale if phrased as “must not write Doka.” Client level can no longer demote.

`applyRewards` is still client-trusted **within** 100k/500k. Custom clients can still drip-mint. `calculateAndAwardDoka` remains an unused public mint. `markAchievementUnlocked` is still unproven.

`redeemGameKeyThroughPersist` (`shopPurchase.ts` 294–330) still does not call the unpaid-death helper. **#391** adds the helper and does not wire redeem.

Wallet seeding / idle-hydrate / unpaid death replay remain load-bearing. Do not invent a second persist path for telemetry or discovery grants.

### 7. Automation coherence — P0, eighth recovered mill day

Halt-as-merge-stop held **56 days**. Halt-as-config failed **eight** recovered days in a row (10-21…10-28) and is failing again at 10-29 00:00.

Daytime cadences (MTD-2026-10-24-005) are part of the mill. Five recovered days proved 04/06/08/12/16/18 UTC keep shipping gameplay PRs after the midnight director asks to hold.

This 00:00 UTC window launched ~51 automations including Dungeon Solvability Guardian, Combat Rules Consistency, Adversarial QA, Security, Economy, Persist auditor, Approved Game Design Implementer, complexity reduction, admin implementer, expansion, AI, feel, and telemetry dashboard.

That is exactly “P2/P3 expansion displacing unresolved P0/P1.”

Cursor Cloud has **no write API** for dashboard prompts (`get-automation` is read-only). Halt is a human config action.

---

## Recurring hotspots — local patches no longer sufficient

Do **not** automatically perform a large refactor.

1. **Automation flock** — disable implementers. Eight recovered mill days is the binding constraint.
2. **Advertised / share-kit execute** — one `resolveKitExecute` helper after halt. 129 open titles. Do not merge `#1220/#1231/#1252/#1259/#1264/#1273` or the summon-control twins.
3. **Landing / occupancy / soak** — Swap + summon-walk hazards + reflect/plague soak need **`applyHazardLanding`**, not more WX branches. Mill grew on 10-28 (`#1257/#1262`).
4. **Remount wipe vs committed keeps** — one remount-wipe guard after halt. Hold `#1239/#1268/#1276` and the 77 `"skip remount"` titles.
5. **Kit-zone number** (PREREQ-A) — not a refactor. One call site. Unblocks dynamic pools. Wait until the flock is held.
6. **Canister trust** — write the ADR (AQA-008). Clamps and ignore-client level already match de-facto (a).
7. **EOP `.old`** — confirm Caffeine 20260901 deploy; refresh `.old` from that build. Never hand-write it.
8. **WX paint extracts** — FAKE MODULARITY (`#1106`). Hold `#831/#842/#901/#961/#995/#1076/#1109/#1196/#1241`.

HP/death extraction (MTD-003) is still valid. Do not start it in the same hour as the flock.

---

## Human merge queue (do not autonmerge)

| Order | PR | Action |
| :--- | :--- | :--- |
| 1 | **This living index** | Review as docs-only. Close superseded director snapshots listed above. |
| 2 | **#327** | Restack/merge Striker after halt. Oldest leftover, 57 days CONFLICTING. |
| — | **#370** | Union unique AI/summon delta **after** #327. Do not twin. |
| — | **#362** | GameKey serial + `saveActiveSpells` keep-store. Behavior only; no new stables. After halt. |
| — | **#391** | Unpaid-death helper, then **wire** redeem. Helper-only is not done. |
| — | **#385 / #667 / #664 / #536 / #380** | Unique leftovers. After halt. Hold Wisp `#550` with `#380`. |
| — | **#354 / #517** | P3 display. After halt. |
| — | **#331 and all map punches** | **Hold.** #331 CONFLICTING. 10-28 added four snaps. |
| — | **#541 / #754 / soak mill / #850** | **Hold.** Swap landing + soak. One helper later. |
| — | **#501 / leftover-walk mill** | **Hold.** |
| — | Advertised / share-kit / skip-wipe / WX extract / Wave catalogs / TBC clones | **Hold.** |
| — | Admin mill `#945/#1001/#1066/#1115/#1190/#1223` | **Hold.** |
| — | Motoko PRs that add persistent `let`/`var` | **Hold until Caffeine deploy refreshes `.old`.** Never amend `20260831` / `20260901` NewActor. |

Do not restack death-replay, `writeLiveDoka`, `writeLevel`, leftover-XP HUD, recap click-through, Frozen execute MP, challenge HUD, or GameKey product code.

---

## Prioritized roadmap (what to work next)

**P0 — do these before any expansion PR merges**

1. Halt the 10-29 same-hour implementer flock **and** the 04/06/08/12/16/18 cadences (MTD-2026-08-31-001, MTD-2026-10-29-001, MTD-2026-10-24-005).
2. Do not merge-burst the 945 leftover drafts (MTD-2026-10-29-004). Close superseded director snapshots (MTD-2026-10-29-002).
3. Confirm Caffeine 20260901 GameKey deploy and refresh `.old` (MTD-2026-09-21-002). Freeze new stables until that lands (MTD-2026-09-02-003).
4. Write the reward-trust ADR (AQA-008). Finding 3 = unbounded/absolute misuse, not “Doka write is a bug.”
5. Stop concatenating specialist catalogs into director ledgers (MTD-2026-09-02-004 / AQA-003). Restack #327 or otherwise unblock the living index (MTD-2026-09-25-005).

**P1 — infrastructure / gameplay integrity**

6. Re-freeze `mapGen.ts`, `targeting.ts`, `enemyAI.ts`, `spellEngine.ts`, and WX drive-bys (AQA-006, AQA-007). Solvability Guardian = fixtures + ACTION_IDs only.
7. One `resolveKitExecute` helper; hold advertised mill (MTD-2026-10-22-005).
8. One remount-wipe guard; hold skip-wipe mill (MTD-2026-10-23-005).
9. Extract `applyHazardLanding` for Swap + soak + controlled-summon walk (MIMA-001 + MTD-2026-10-26-005). Occupancy helper already exists — do not rewrite it.
10. Restack/merge #327 Striker then union #370 unique AI/summon delta (MTD-2026-09-21-003 / MTD-2026-09-22-004).
11. #391 GameKey unpaid-death helper then redeem wire; #362 serial / keep-store; leftover-walk helper after halt.
12. Controlled HP/death extraction (MTD-2026-08-31-003) **after** landing helpers — not tonight.

**P2 — high-value expansion (after P0/P1, not this hour)**

13. Outcome counters, then maybe a dashboard (AQA-012 before TADD UI).
14. Fix kit-zone call site (Expansion PREREQ-A) — pass a **number**, not `levelZone` object.
15. Enemy-observed spell discovery + ownership maps (SDA-002/003/004). Requires persist lock + metadata; never `spell.name`. Requires a **new later** migration after deploy confirmation.
16. Admin Draft → Validate → Activate on the canister (SDA-005 / MTD-006). Do not grow the 8.3k dashboard first.
17. Seed frontend starter ids; stop treating `usableByPlayer` as ownership (SDA-007).
18. Revisit `computeAITier` 30% random vs progressive sophistication (MTD-008). Report/design, not an `enemyAI.ts` rewrite.
19. Wire `saveKillCount` or drop it from the leaderboard (MTD-005).
20. BuffShop `buffInventories` vs `${principal}_inventory` (SDEG-005) — after persist quiet.

**P3 — polish**

21. Recap / HUD leftovers already shipped — do not restack.
22. #354 Feats copy and #517 empty Map Effects are leftover unique display.
23. Visual / game-feel / mobile — DESIGN.md already specifies the look. Do not edit combat math or WX for feel.
24. Dead-code / maintainability — report only while hunters are hot.

Do not let P2/P3 expansion PRs from the leftover queue, the 10-21…10-28 mill, or the 10-29 00:00 wave displace the P0/P1 list.

---

## Contradictions and duplicates (do not re-litigate)

| Conflict | Resolution |
| :--- | :--- |
| Security “don’t write Doka from `saveBattleStats`” vs ARCHITECTURE | Write stays; **clamp / no-mint**. ADR still required. |
| Solvability vs `AGENTS.md` mapGen | Landed punches already on `main`; **freeze**. Hold #331 and clones. |
| Progressive AI vs 30% random tier | Design decision later; no first-hour AI PR. |
| SDA vs SDE vs SPELL_DISCOVERY vs EBA vs BOSS docs | One discovery persist shape (SDA-002/004). Others are content cards, not parallel schemas. |
| Expansion specialists vs “P0/P1 first” | Tonight’s wave is the violation. Hold their PRs. |
| Telemetry dashboard vs no counters | AQA-012 first. TBC stays WAITING_FOR_TELEMETRY. |
| Empty / Aug-31 `.old` check-stable vs live Caffeine | Repo `.old` must match Caffeine’s last deploy. Source GameKey is ahead of that signature. |
| `usableByPlayer=false` as retire vs enemy-only gate | Do not extend the flag. |
| Paint extracts vs “reduce WX complexity” | `#1106` NEGATIVE_ROI / FAKE MODULARITY. Hold. |
| Approved Design IDLE vs halt | IDLE after a start is not a disable. UUID still **enabled**. |

---

## TOP 5 CURRENT PRIORITIES

1. **Halt the 10-29 00:00 implementer flock and the 04/06/08/12/16/18 cadences.** ~51 automations (~49 RUNNING). First-hour drafts already exist: TBC `#1277`, advertised `#1278`, docs `#1279`. Especially hold mapGen, persist, targeting, `enemyAI`, `spellEngine`, AdminDashboard, `main.mo` stables, telemetry UI, soak, skip-wipe, advertised combat, WX extracts.
2. **Do not merge-burst the 945 leftover drafts.** Eight recovered days opened 463 PRs. Close superseded director snapshots; restack #327 only.
3. **Confirm Caffeine 20260901 GameKey deploy and refresh `.old`.** Source is correct; live previous-version signature is still Aug-31 no-GameKey. **56 days.**
4. **Write the reward-trust ADR (AQA-008).** Clamps landed; the written decision did not. Security is running again tonight.
5. **After halt: one helper each** for advertised-kit execute (the mill that grew), skip-wipe, and hazard landing — then restack #327. Not tonight.

## BLOCKED WORK

- Spell discovery / observed enemy kits / new unlock loops — no ownership persist, combat landing still racing, ADR unwritten, Caffeine `.old` still Aug-31.
- Enemy AI capability expansion — `enemyAI.ts` already 2,580 lines; kits never leave zone 0; HP/death still dual-written.
- Telemetry admin dashboard — no counters to display (AQA-012). TBC correctly WAITING.
- Any Motoko PR that adds stables until deploy is confirmed and `.old` is refreshed from that build.
- Further `mapGen.ts` punches without an explicit human playtest of the landed solvability sequence.
- Custom-client mint proofs / new credit APIs until the ADR exists.
- Formula-level `BAL-*` / `LHIPS-*` retunes (no telemetry; jackpot 100k clamp is architecture).
- Admin Draft→Validate→Activate chrome on the 8.3k dashboard before canister lifecycle exists.
- Oldest-first merge of the leftover queue (MTD-2026-09-25-005).
- Wave 20/21 catalogs, advertised-flag combat, soak twins, and WX paint extracts until the three helper extractions exist.

## SAFE EXPANSION WORK

- Close superseded director PRs and land this index (process, not gameplay).
- Design-only (no PR merge): keep SDA/SDE/EBA catalogs; do not author a fifth discovery schema; do not merge Wave 20/21.
- Query-only / persist-lock-enqueued counters (AQA-012) — **design + tiny isolated PR after flock halt**, not a dashboard.
- Kit-zone number fix (PREREQ-A) **after** the flock is held — one call site + `enemyAI` test, no WX growth.
- Display-only unique copy if a hole not already on `main` is found — after halt.

## AREAS TO STOP TOUCHING TEMPORARILY

- `src/frontend/src/components/WorldExploration.tsx` except one-line helper wiring
- `src/frontend/src/engine/mapGen.ts`
- `src/frontend/src/engine/spellEngine.ts` (advertised mill)
- RAF loop, turn-order math, damage formulas (`AGENTS.md`)
- `src/frontend/src/utils/progressPersist.ts` (leave the lock)
- `src/frontend/src/utils/deathPenalty.ts` (cluster closed)
- `src/frontend/src/engine/targeting.ts`
- `src/frontend/src/engine/enemyAI.ts`
- `src/frontend/src/components/AdminDashboard.tsx`
- `src/backend/main.mo` persistent fields until Caffeine deploy refreshes `.old`
- `src/backend/migrations/20260831_000000.mo` and `20260901_000000.mo` (frozen)
- `docs/automation/ACTION_IDS_2026-08-31.md` through `ACTION_IDS_2026-10-28.md` (do not append)
- GameKey product methods except via a confirmed deploy

## ARCHITECTURAL HOTSPOTS

1. Automation pile-on (~51 same-hour agents; 463 drafts in eight recovered days; 945 leftovers)
2. Advertised kit metadata vs execute (129 open titles; mill continued all day 10-28) — local patches no longer sufficient
3. Dual HP / death / landing authority (React snapshot vs `combatantsRef` vs Swap/summon/reflect teleport). Soak mill grew on 10-28.
4. Remount `saveBattleStats` wipe vs committed keeps (77 `"skip remount"` titles; three new on 10-28)
5. Client-trusted `applyRewards` without a written ADR
6. 19k-line world orchestrator absorbing every hunter (paint extracts are FAKE MODULARITY; `#1241` joined `#1196`)
7. Dual spell catalogs + implicit ownership (blocks discovery)
8. Kit-zone object call site (dynamic pools implemented and dead; twentieth cycle)
9. EOP `.old` still Aug-31 while source carries GameKey

## TELEMETRY SIGNALS WORTH INVESTIGATING

**None can be investigated in production — the series do not exist.**

When AQA-012 lands, investigate in this order (engineering + design, not telemetry-alone priority):

1. persist-ok vs persist-fail and death-penalty-applied vs victory-paid vs **single-axis-credit-then-death** (integrity — measure whether `#183/#256` stayed closed)
2. GameKey request vs approve vs redeem vs redeem-fail (ops; do not treat 0 rows as “players don’t buy”)
3. remount-after-keep wipe vs unpaid-death apply (skip-wipe mill — if Doka drops after a keep, ENGINEERING is remount policy)
4. advertised-kit execute vs preview (if “players ignore kit spells,” DESIGN INTERPRETATION may be execute lying, not power — 129 open advertised PRs are ENGINEERING, not MEASURED)
5. recap opened vs dismissed vs lava-death-during-recap (PX)
6. spell-cast counts **by acquisition path** (starter vs unlocked vs observed) — a “weak” spell may be undiscovered, not weak. Today every catalog id is treated as owned, so this series would be **meaningless** until SDA-002.
7. Attack Nearest vs aimed-cast ratio (gate confusion vs power)
8. challenge accept vs complete vs advertised-reward-missing
9. Swap / summon-walk onto hazards vs walk onto the same tile (MIMA-001 remainder — if “Untouchable complete rate” is high, DESIGN INTERPRETATION is skip-landing, not player skill)
10. Frozen/Slime maps: tiles walked vs preview budget (execute MP already fixed on `main` — measure, do not re-patch)
11. soak/reflect/plague vs `playerTakesDamage` (if Untouchable or challenge HP counters look “too clean,” ENGINEERING is skip-soak, not player skill)

Until those exist: automations must not claim CLEAR_POSITIVE_SIGNAL or “players don’t use X.” Distinguish MEASURED PLAYER BEHAVIOUR (none) from DESIGN INTERPRETATION and ENGINEERING EVIDENCE.

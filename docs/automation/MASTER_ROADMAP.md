# Stralt Master Roadmap

**Director:** Stralt Master Technical Director (`0b92479e-a49e-11f1-a7d1-d6b4613131ce`)  
**Run:** 2026-10-26 00:03 UTC (daily cron)  
**This agent:** `bc-07a3a496-74a2-483d-bcb9-6d92b9fa5510`  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (accepted-challenge HUD) — **unchanged since 2026-09-03 00:28 UTC**  
**Prior director:** unmerged [`#1074`](https://github.com/Mr-Melic/stralt/pull/1074) (`bc-a0d7fd84-a8ac-480c-acf9-a5a12235e0cc`, 2026-10-25). On `main`, this file is still the 2026-09-02 text.  
**Gameplay / production code:** not modified.

This file is the living prioritized roadmap. ACTION_ID records for this run live in [`ACTION_IDS_2026-10-26.md`](./ACTION_IDS_2026-10-26.md). Close superseded director PRs **#338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, #946, #998, and #1074** when this lands — do not merge all fifteen. Process audit on `main`: [`QUALITY_AUDIT_2026-08-30.md`](./QUALITY_AUDIT_2026-08-30.md). Unmerged weekly audit: [`#1106`](https://github.com/Mr-Melic/stralt/pull/1106) (2026-10-18→10-25). Dump yards: `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, and the unmerged 09-21…10-25 ledgers. Do not append to those files.

## Evidence available this run

| Source | Status |
| :--- | :--- |
| `AGENTS.md`, `README.md`, `DESIGN.md`, `docs/ARCHITECTURE.md` | Read. `ARCHITECTURE.md` line 28 still says `check-limit = 4`; `mops.toml` is `5`. Stale docs, not a Motoko bug. |
| Prior director roadmap (2026-10-25, unmerged #1074) + memories | Read. Halt-as-config asked again, including daytime cadences (MTD-2026-10-24-005). Humans still have not merged `main`. |
| Specialist reports on `main` | Still the 08-30…09-02 set. Later catalogs live only on unmerged drafts. |
| Unmerged 2026-10-25 specialist PRs | Full day `#1043`–`#1107` (**65** drafts). TBC `#1053` WAITING (fourteenth inspection of `0f5363f`; 0 collectors). Wave 17 catalogs `#1052/#1063/#1064/#1072/#1073/#1075/#1080/#1082`. Quality audit `#1106`. WX extract `#1076`. Soak mill `#1079/#1084/#1097/#1100`. Admin `#1066`. |
| Open ACTION_IDs | Reuse. Director index = this file + `ACTION_IDS_2026-10-26.md`. |
| Recent commits | `git log` since 2026-09-03: **none** on `origin/main`. Last merge `#332`. |
| Open drafts | GraphQL **776** at first search (`is:open`). 10-25 flock opened **65** (`#1043`–`#1107`). This hour already `#1108`–`#1120` (TBC WAITING, WX portal-cube extract, expansion, Pale Archivist test, admin helpers, telemetry clones). |
| Player telemetry | **Still none.** `longHorizonSim.telemetry.available === false` (`longHorizonSim.ts` 532–536). No `recordTelemetry` / sidecar in `src/`. TBC stays `WAITING_FOR_TELEMETRY`. |
| Same-hour flock | **52** automations this hour: **48 RUNNING**, **4 IDLE**, **0 ERROR**. Map guardian, AI, combat-parity, complexity, spell mechanics, spell discovery, boss, dungeon, expansion, critical hunter `1aa41c6c`, persist auditor, world-content, invariants, security, TBC, telemetry dashboard are RUNNING. Approved Design, admin implementer, docs sync, and contract guardian are **enabled** but IDLE in the first snapshot. |
| Weekly quality audit `#1106` | ENGINEERING corroboration: 436 automation runs in the week, 292 drafts, 0 merges, 0 closes, `main` frozen 52 days at audit time. Classifies map/persist/combat/#62 paint as NEGATIVE_ROI. Agrees halt + do-not-merge-burst. |

**Evidence classes used below**

| Class | Meaning |
| :--- | :--- |
| MEASURED PLAYER BEHAVIOUR | Live play counters. **None exist.** |
| DESIGN INTERPRETATION | Product rules in this prompt + `AGENTS.md` / `DESIGN.md` / specialist design docs |
| ENGINEERING EVIDENCE | Code on `0f5363f`, tests, open-PR mill, automation volume, hotspot call sites, `#1106` process audit |

Telemetry is not allowed to set priority. Correlation is not causation. No CLEAR_POSITIVE_SIGNAL is claimed.

---

## What changed since the 10-25 director run (do not rediscover)

`main` **did not move.** The 10-25 halt was ignored as dashboard config and **obeyed as human merge-stop**.

| Fact | 10-25 director | This run |
| :--- | :--- | :--- |
| HEAD | `0f5363f` (52 days) | `0f5363f` (**53 days**) |
| Open drafts | 711 at first search; `#1043`–`#1060` already open | GraphQL **776** at first search. 10-25 finished at `#1107`. This hour already `#1108`–`#1120` |
| 10-21 / 10-22 / 10-23 / 10-24 mill | 56 + 58 + 52 + 63 = 229 | Still unmerged |
| 10-25 implementer flock | 47 RUNNING; hold | **Did not hold.** Opened **65** PRs (`#1043`–`#1107`) **across the whole day** (00/03/04/06/08/12/16/18/19/21 UTC). 00:00 = 41; after 01:00 = **24** |
| Director snapshots on the living files | 14 unmerged (#338…#998 + #1074 in flight) | **15** unmerged once #1074 is counted. `main` still serves 09-02 |
| #327 Striker | CONFLICTING, 53 days | CONFLICTING, **54 days**. Still the oldest open PR (`mergeable_state: dirty`) |
| #331 destack | CONFLICTING | Still CONFLICTING (`dirty`) |
| Caffeine 20260901 deploy | Unconfirmed; `.old` Aug-31 no-GameKey | Unchanged. Grep GameKey in `.old` = 0. Newest deployed snapshot still `pr259-tail-20260901.most` |
| Reward-trust ADR | Missing | Still 0 `docs/**/*ADR*` |
| Telemetry collectors | 0 | 0. TBC `#1053` correctly WAITING (fourteenth inspection). Tonight’s TBC is RUNNING (fifteenth incoming) |
| 10-26 flock | n/a | **48 RUNNING** + 4 IDLE. **0 ERROR.** Persist auditor `607e0304` flipped IDLE→**RUNNING**. Same implementer UUIDs still **enabled** |
| Skip-wipe mill | ~46 + `#1043/#1045/#1046` | **93** titled `skip remount`. 10-25 added leftover-XP wipe twins `#1043/#1045/#1046/#1070/#1088/#1092/#1099` |
| Advertised / pack-enemy mill | 23 `advertised` + 11 pack-enemy combat | `advertised` search **79** (noisy). Pack-enemy combat titles **25**. 10-25 added `#1054/#1081/#1085/#1087/#1090/#1091/#1107` plus LoS-share `#1095/#1096/#1098` |
| Soak mill | not named as a class | **NEW standing mill:** `#1079/#1084/#1097/#1100` soak-like-`playerTakesDamage`. Invariants `#1100` lost its 0-PR discipline (`#1106`) |
| Map punches | 10-24 added four snaps | 10-25 added `#1071/#1086/#1093/#1103`. Guardian RUNNING tonight. `snap` search **47** |
| WX extracts | `#831/#842/#901/#961/#995` | Plus **`#1076` hazard overlay paint**. Complexity reduction RUNNING tonight |
| Pale Archivist tests | starting | **13** open titles. Test mill, not 13 P0s |
| TBC WAITING clones | 13 dated reports | **14** dated reports (`#333`…`#1053`) |

**Integrity that remains landed on `main` (do not re-open):** death replay `#183/#255/#256`, live Doka helpers `#180`, ignore-client `writeLevel`, AP/MP cap `#322`, bindgen summon fields, Pacifist preview, recap-under-credit gate, GameKey product `#258` + EOP source `#259/#311/#324`, Frozen/Slime execute MP `#313/#318`, barrier-aware `isBattleWalkTileBlocked`, spawnPolicy extract `#287`, challenge HUD `#332`, Enemy Register lore `#328`, Caffeine import gates + stack-compat.

**10-25 leftovers that are NOT done:** halt (including 06/12/18); living director index on `main`; Caffeine deploy confirmation; ADR; `#327` restack; mapGen/WX freeze; Swap landing; kit-zone number; discovery persist; admin DVA; `saveKillCount`; 30% random AI tier; share-kit helper; skip-wipe helper; soak helper.

**New this run (not a rediscovery of 10-25):**

1. **Five recovered days in a row rebuilt the mill.** 10-21 opened 56; 10-22 opened 58; 10-23 opened 52; 10-24 opened 63; **10-25 opened 65**. Combined: **294 drafts in five days**. Queue 482 → 538 → 596 → 648 → 711 → **776**.
2. **MTD-2026-10-24-005 failed a second recovered day.** 10-25 gameplay kept shipping at 03:12 (`#1084`), 04:23 (`#1085`), 06:24–06:30 (`#1086/#1087/#1088`), 08:11–08:21 (`#1089/#1090/#1091`), 12:11–12:20 (`#1092`–`#1097`), 16:11–16:16 (`#1098`–`#1102`), 18:13–18:20 (`#1103`–`#1105`), 19:12 (`#1106`), 21:16 (`#1107`). After 01:00 = **24 of 65**, same split as 10-24.
3. Skip-wipe remount mill grew **~46 → 93**. Local patches are no longer sufficient (MTD-2026-10-23-005 still OPEN; evidence doubled).
4. **Soak-like-`playerTakesDamage` is a new mill class** (`#1079/#1084/#1097/#1100`). Adversarial QA, invariants, and leftover-walk hunters filed the same helper four times. After halt: one soak/landing helper, not a fifth effect. Related to MIMA-001 `applyHazardLanding`, not a third persist rewrite.
5. Pack-enemy combat mill grew **11 → 25**. Advertised-vs-execute is still standing. One `resolveKitExecute` helper after halt (MTD-2026-10-22-005).
6. 10-25 touched the freeze file again: `#1076` hazard overlay extract from WX. Hold it with `#831/#842/#901/#961/#995`. Quality audit `#1106` scores the paint-extract strategy as NEGATIVE_ROI / FAKE MODULARITY.
7. Persist auditor `607e0304` is **RUNNING** this hour (IDLE in the 10-25 first snapshot). Expect more skip-wipe clones unless dashboard-disabled.
8. Weekly quality audit `#1106` independently asks the same P0: halt implementers, do not merge-burst 774+, pause mapGen implementation, pause #62 WX paint, pause telemetry trio, revert invariants to report-only. Do not treat `#1106` as a license to merge its ledger ahead of this index.
9. GitHub search `created:2026-10-26` was **0** at 00:05 UTC and **13** by 00:14 (`#1108`–`#1120`) before this ledger committed: TBC WAITING `#1108` (fifteenth inspection), WX paint extract `#1109`, expansion `#1112`, Pale Archivist test `#1113`, admin helpers `#1115` (implementer was IDLE in the first snapshot), telemetry clones `#1116/#1118`. Combined recovered mill without dashboard disable is now the **steady state**, including the first minutes of day six.

---

## Seven-dimension evaluation

### 1. Correctness — official client still safer than the leftover queue

ENGINEERING: Persist clamps, ignore-client level, death replay, and GameKey-in-source remain the last good official-client snapshot. Do not open a fourth persist rewrite. Do not merge-burst skip-wipe, share-kit, soak, or pack-enemy twins.

Recurring defect class: **teleport landing.** Swap still copies coordinates (`WorldExploration.tsx` 9389–9402 `swapPositions`) with no occupancy and no `applyHazardLanding` (zero hits in `src/`). `#541` and `#754` remain HOLD. `#850` is a share-kit `isSwap` twin, not a landing fix. The 10-25 soak mill is the same class with a new title.

Recurring defect class: **preview vs execute / advertised vs live.** Frozen/Slime execute MP is closed (`battleWalkMpCost` / `enemyWalkMp`). The standing mill is **kit metadata honesty**: pack-enemy combat **25** plus noisy `advertised` search 79, instead of one `resolveKitExecute(spell)` helper.

Recurring defect class: **kit zone NaN.** `buildEnemyKit(pieceType, number)` (`enemyAI.ts` 194–200) is still called with `currentMap.levelZone` (`WX` 11920), a `LevelZone` object. `Math.floor(object)` → `NaN` → zone-0 kits. `currentZoneTier` already exists (`WX` 1136). **Seventeenth** director cycle.

Recurring defect class: **path occupants.** `findPath` (`WX` 4466–4536) uses `isBattleWalkTileBlocked` with barriers/portals/void. Occupants are still not an argument (`walkRejectCopy.ts` 21–34). MIMA-2026-09-01-002 remains PARTIAL.

Recurring defect class: **Striker aim-tile.** Oldest open PR `#327` is still CONFLICTING (54 days). Twin `#370` is still MERGEABLE and a superset. Union ≠ concatenate.

Recurring defect class: **EOP deploy lag.** Source chain is correct (`20260901` GameKey, `OldActor = {}`, `check-limit = 5`). Tracked `.old` still has **no GameKey**. Live canister upgrade remains unproven after **53 days**.

### 2. Player experience — honesty on `main`; identity still incomplete

ENGINEERING: HUD leftover XP, recap feats, challenge HUD after accept, Enemy Register lore, Buy Doka vs Items copy are on `main`. Do not restack.

DESIGN (Expansion `#1052`, PX `#1067`, MIMA `#1062`, TBC `#1053`, no player data): the player is still handed the live catalog on minute one (`shouldIncludeBackendSpellInLibrary` returns true whenever `usableByPlayer !== false`, `adminSafety.ts` 712–718). Enemy-observed discovery is absent. Achievement/challenge/boss rewards remain Doka/XP. Four map modifiers remain announce-only. Family HP multipliers still die at battle start. `worldFeatures.ts` is still tests-only (`README.md`).

GameKey is a real PX/ops funnel in source; ops deploy is unconfirmed. Do not treat 0 redeem rows as “players don’t buy.”

MEASURED: none. TBC `#1053` correctly refused to label spells over/underused. A mathematically powerful spell with no casts would be **undiscovered**, not weak, until SDA-002 exists.

### 3. Technical health — hotspot sizes frozen on `main`; mill not frozen

| Surface | Lines now (`0f5363f`) | 09-02 director | Verdict |
| :--- | ---: | ---: | :--- |
| `WorldExploration.tsx` | 19,213 | 19,253 | Freeze still broken as **intent**; file frozen only because humans stopped merging. `#831/#842/#901/#961/#995/#1076` wait to grow it. |
| `AdminDashboard.tsx` | 8,280 | 8,035 | Grew before 09-03. No publish pipeline. `#945/#1001/#1066` already opened. Admin implementer enabled (IDLE this hour). |
| `enemyAI.ts` | 2,580 | 2,583 | Frozen size. Tonight’s AI agent must not grow it. |
| `main.mo` | 3,903 | 3,838 | GameKey + clamps in source. Deploy unconfirmed. |
| `mapGen.ts` | 1,937 | 1,544 | Grew on `main` before freeze. Guardian RUNNING. |
| `targeting.ts` | 1,199 | 1,031 | Leave it. |
| `progressPersist.ts` | 421 | 323 | Leave the lock. Skip-wipe mill (**93**) is the magnet now. |
| `spellEngine.ts` | — | — | Share-kit / pack-enemy mill magnet. |
| `deathPenalty.ts` | 597 | 597 | Leave it. |

`996df6df` is still not GetAutomation-visible. Critical hunter `1aa41c6c` is **RUNNING** this hour (GetAutomation UUID not visible to this principal; agent list confirms the short id). Complexity `386a157d`, combat-parity `f37b7505`, map guardian `9dcfd122`, AI `67b03c2f`, expansion `3f31b18f`, persist auditor `607e0304` are **enabled and RUNNING**. Approved Design `fe5b679a`, admin implementer `3089f18d`, docs `013ac98d`, and contract `4fba3a56` are **enabled** and IDLE in the first snapshot.

Caffeine import gates and stack-compat stay. Oldest-first still makes this living index unreachable behind `#327` CONFLICTING and fifteen director snapshots of `MASTER_ROADMAP.md`.

Weekly quality audit `#1106`: #62 paint extracts (`dustMotes` / `portalWhirlpool` / `pixelPattern` / `tilePaint` / `mapHazardPaint`) are FILE EXPLOSION + FAKE MODULARITY. Domain extracts `#369/#514/#683` were abandoned. Do not merge paint ahead of domain, and do not start another extract tonight.

### 4. Content depth — over-specified, under-wired, Wave 17 already drafted

Present on `main`: player-relative tier spawn, AI tiers 1–10, named boss kits, dungeon chain, Boss Rush, 9 challenges, feats, frontend catalog + GameKey shop.

Dead or contradictory vs core rules:

- Dynamic enemy spell pools: implemented and dead (zone-0 kits).
- Progressively sophisticated enemies: undermined by 30% fully random `computeAITier` (`combatMath.ts` 34–50).
- Enemy-observed spell discovery: absent.
- Achievement/challenge/boss spell unlocks: Doka/XP only.
- Admin Draft → Validate → Activate: not a canister workflow.
- `worldFeatures.ts` still tests-only.
- `ENEMY_AI_TIER_GATES` names still unused as live gates.
- 10-25 expansion `#1052`, elites `#1073`, boss sheets `#1080`, spell proposals `#1063`, discovery `#1082`, AI `#1072`, world dynamics `#1064`, formations `#1075` are overlapping catalogs. That is expansion overlap, not a license to implement.

Over-developed: automation report catalogs, share-kit one-flag patches, skip-wipe clones, map crumb snaps, WX paint extracts, Pale Archivist test twins, soak-per-effect clones.  
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

Expansion that adds spells, AI behaviors, or admin chrome before halt + `#327` restack + landing helper + ADR + confirmed GameKey deploy will not scale. Wave 16/17 catalogs must wait.

### 6. Data / persistence safety — official client safer; mill is the risk

`saveBattleStats` may still **lower** Doka/XP (required). It must not raise them. Finding 3 is still stale if phrased as “must not write Doka.” `#1106` repeats that correction.

`applyRewards` is still client-trusted within 100k/500k. `calculateAndAwardDoka` remains an unused public mint. `markAchievementUnlocked` is still unproven.

`redeemGameKeyThroughPersist` (`shopPurchase.ts` 294–330) still does **not** honour unpaid death. `#391` drafts the helper and does not wire redeem. Hold skip-wipe clones; they are not that wire.

`.old` is still Caffeine’s Aug-31 no-GameKey signature. Do not hand-write it. Freeze new stables.

Wallet seeding / idle-hydrate / unpaid death replay remain load-bearing. Do not invent a second persist path for telemetry or discovery grants. TBC/GTAD: sidecar **off** the persist lock.

### 7. Automation coherence — P0, recovered platform, mill is now the five-day steady state including daytime cadences

Halt-as-config has failed every midnight it was asked (08-31…09-29, then 10-21, 10-22, 10-23, 10-24, 10-25, now 10-26). Halt-as-merge-stop has held **53 days**. The 22-day gap was ERROR/boot (MTD-2026-10-21-003), recovered on 10-21.

10-21 through 10-25 together are the proof that **recovery without dashboard disable = mill restart**. 294 new drafts in five days, including frozen-file hits **after noon UTC**. 10-26 already has 48 agents RUNNING.

Cursor Cloud has **no write API** for dashboard prompts. Halt is a human config action. In-repo gates cannot pause cron.

Weekly quality auditor (`976261d8`, `#1106`) independently classified the same failure. AQA asked director KEEP **weekly** not daily — fifteen unmerged director snapshots already prove oldest-first blocks the living index. Do not disable this director; **close superseded snapshots** so one index can land. Daily director PRs are a process mill only because humans will not close #338…#1074.

| AQA / MTD ID | Director status 2026-10-26 |
| :--- | :--- |
| AQA-001 hunter throttle | **OPEN** — `996df6df` still not GetAutomation-visible. `#1106`: 38 hunter runs in four days. |
| AQA-002 one critical hunter | **OPEN** — `1aa41c6c` **RUNNING** this hour. |
| AQA-003 in-repo ACTION_ID ledger | **PARTIAL** — this run writes `ACTION_IDS_2026-10-26.md`. Living index still off `main`. |
| AQA-004 don’t merge the 08-30 stack | **SUPERSEDED** — accept `main`. |
| AQA-005 test clone mill | **PARTIAL** — Pale Archivist **13** open titles. Defect-recurrence RUNNING tonight. |
| AQA-006 no mapGen implementation | **BROKEN** — guardian RUNNING; 10-25 added four snaps. `#1106`: 90 `fix(map)` hits in the week. |
| AQA-007 freeze drive-by WX | **BROKEN** — `#831/#842/#901/#961/#995/#1076` already opened; complexity reduction RUNNING. |
| AQA-008 security → ADR | **PARTIAL** — clamps on `main`; no ADR. Security RUNNING. Sampled `#1106` security run opened no PR (correct). |
| AQA-009 orchestrator must not implement gameplay | **BROKEN** — `#1105/#1096` implemented. Orchestrator RUNNING tonight. |
| AQA-010 persist/economy dedup | **BROKEN** — skip-wipe mill **93**. Persist auditor **RUNNING** this hour. |
| AQA-011 prompts vs live architecture | **OPEN** |
| AQA-012 outcome telemetry | **OPEN** — TBC `#1053` correctly WAITING. Dashboard specialist RUNNING with nothing to display. |
| AQA-2026-09-27-001 queue lifecycle | **BROKEN** — 380 → 774 → **776**. 0 closes in the audited week. |
| AQA-2026-09-27-003 #62 2–3×/week domain | **BROKEN** — five daily paint extracts; `#995` +935. |
| MTD-001 flock halt | **OPEN** — failing again tonight. |
| MTD-2026-10-24-001 / 25-001 | **SUPERSEDED** as “hold that midnight” — those waves already ran. Halt itself remains OPEN. |
| MTD-2026-10-24-005 | **OPEN** — empirically failed on **two** recovered days (10-24 and 10-25). |
| MTD-2026-10-26-001 | **NEW** — hold tonight’s wave. Already `#1108`–`#1120`; 48 RUNNING. |
| MTD-2026-09-25-005 | **OPEN** — oldest-first still blocked. |

---

## Recurring hotspots — local patches no longer sufficient

Do **not** automatically perform a large refactor.

1. **Automation flock + leftover queue** — the binding constraint. Disable implementers **and** daytime hunter-implementers in the dashboard. Do not merge-burst 776 drafts.
2. **Skip-wipe / remount hydrate** — **93** open twins on the `#330` keep. One shared remount-wipe guard after halt (MTD-2026-10-23-005), not a 94th clone. Distinct from `#391` unpaid-death honour on GameKey redeem.
3. **Catalog advertised vs execute** — pack-enemy combat **25** plus advertised-flag twins. After halt, one `resolveKitExecute` helper + tests. Close the twins. Do not grow `spellEngine.ts` / `enemyAI.ts` by one effect per PR.
4. **Soak / landing authority** — Swap teleport + four soak-like-`playerTakesDamage` PRs. After halt, one `applyHazardLanding` / soak helper. HOLD `#541/#754` and `#1079/#1084/#1097/#1100`.
5. **Kit-zone number (PREREQ-A)** — not a refactor. One call site. Unblocks dynamic pools. Wait until the flock is held.
6. **Canister trust** — write the ADR (AQA-008). No new credit APIs and no discovery grant writer until then.
7. **EOP deploy** — confirm Caffeine 20260901, then refresh `.old` from that build. Never hand-write `.old`. No new stables until then.
8. **mapGen portal-punch / leftover-crumb** — freeze. Guardian = fixtures + ACTION_IDs only.
9. **WX paint extracts** — pause `#62` (`#1106`). Domain extracts `#369/#514/#683` first, or close them. Do not add `mapHazardPaint.ts` tonight.
10. **HP/death extraction (MTD-003)** — still valid. Do not start it in the same hour as the flock.

---

## Human merge queue (do not autonmerge)

| Order | PR | Action |
| :--- | :--- | :--- |
| — | **This docs PR** | Review. Close #338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, #946, #998, **and #1074** without merge. |
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
| — | **#814–#1120 gameplay** | **HOLD** (10-21…10-25 mills plus tonight’s `#1109` WX extract, `#1113` Pale Archivist, `#1115` admin). |
| — | **#1106** | Docs-only weekly quality audit. May remain unmerged until this living index lands; do not merge it ahead of closing superseded director snapshots. |
| — | Any 10-26 00:00 PR including `#1108`–`#1120` | Default **HOLD**. Especially WX (`#1109`), mapGen, targeting, persist, `enemyAI`, AdminDashboard (`#1115`), `main.mo` stables, telemetry UI, RAF, skip-wipe, pack-enemy, advertised, soak, canvas perf. Docs-only catalogs may remain unmerged. Keep `#333` as the first TBC leftover; close later twins including `#1053/#1108`. |

Do not restack death-replay, `writeLiveDoka`, `writeLevel`, leftover-XP HUD, recap click-through, challenge HUD, Enemy Register lore, or GameKey product code.

---

## Prioritized roadmap (what to work next)

**P0 — do these before any expansion PR merges**

1. Halt the 10-26 same-hour implementer flock **and** the 06/12/18 hunter-implementer cadences (MTD-2026-08-31-001, MTD-2026-10-26-001, MTD-2026-10-24-005). Do not merge-burst 776 drafts (MTD-2026-10-26-004).
2. Unblock the living director index: close superseded director PRs including #1074; restack or replace #327 (MTD-2026-10-26-002, MTD-2026-09-25-005).
3. Confirm Caffeine deploy of the 20260901 GameKey tail and refresh `.old` (MTD-2026-09-21-002). Freeze new stables until then (MTD-2026-09-02-003).
4. Write the reward-trust ADR (AQA-008).
5. Ledger hygiene: this file + `ACTION_IDS_2026-10-26.md` only (MTD-2026-09-02-004).

**P1 — infrastructure / gameplay integrity (after halt)**

6. Restack/merge #327, then union #370 (MTD-2026-09-21-003 / MTD-2026-09-22-004).
7. Re-freeze `mapGen.ts`, `targeting.ts`, `enemyAI.ts`, and WX drive-bys (AQA-006, AQA-007). Hold all map punches and `#331`. Pause #62 paint extracts.
8. Extract `applyHazardLanding` / one soak helper for Swap + walk + leftover-walk (MIMA-001, MTD-2026-10-26-005). HOLD `#541/#754` and soak twins.
9. One advertised-vs-execute kit helper; close the share-kit / pack-enemy mill (MTD-2026-10-22-005).
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
| Security “don’t write Doka from `saveBattleStats`” vs ARCHITECTURE | Write stays; **clamp / no-mint**. ADR still required. `#1106` agrees. |
| Solvability vs `AGENTS.md` mapGen | #110 plus later punches already merged; **freeze**; hold all open crumb punches. |
| AQA-004 vs human merge of 08-30…09-03 stacks | Accept `main`; clean leftovers; do not re-open merged themes. |
| Frozen preview vs execute MP | Execute uses `battleWalkMpCost`. Do not re-file 09-01-001. |
| #327 vs #370 Striker | One helper. Oldest #327 first; #370 unique AI/summon only. |
| #380 vs #550 Wisp heal | One no-heal path. #380 first; hold #550. |
| #541 vs #754 Swap vs soak `#1079/#1084/#1097/#1100` | HOLD all. Extract `applyHazardLanding` / one soak helper (MTD-2026-10-26-005). |
| 25 pack-enemy + advertised PRs vs one honesty helper | MTD-2026-10-22-005. Close twins; one helper after halt. |
| 93 skip-wipe PRs vs `#391` GameKey unpaid-death | Distinct holes. Skip-wipe = remount `saveBattleStats` vs committed keep. `#391` = honour 20/40 before redeem credit. |
| Progressive AI vs 30% random tier | Design decision later; no first-hour AI PR. Tonight’s AI agent is the violation. |
| SDA vs SDE vs SPELL_DISCOVERY vs EBA vs BOSS vs Wave 16/17 | One discovery persist shape (SDA-002/004). Others are content cards. |
| Expansion specialists vs “P0/P1 first” | 10-21…10-26 AI / boss / dungeon / complexity / expansion agents are the violation. Hold implementation. |
| Telemetry dashboard vs no counters | AQA-012 first. TBC stays WAITING_FOR_TELEMETRY. Keep `#333`; close later TBC twins including `#1053`. |
| Empty/Aug-31 `.old` vs live Caffeine | `.old` is the **real** Aug-31 signature (no GameKey). Import of HEAD should pass. Deploy still unconfirmed. Do not hand-write `.old`. |
| GameKey on `main` vs canister | Source is ahead of confirmed deploy. Do not revert GameKey product. |
| `usableByPlayer=false` as retire vs enemy-only gate | SDA-2026-09-01-001; do not extend the flag. |
| Family HP paper vs `calcEnemyMaxHp` | PREREQ-H; honesty bug; not an AI rewrite. |
| 53-day freeze vs “halt failed” vs 22-day PR silence vs 10-21…10-25 restart | Halt failed as **config**. It succeeded as **human merge stop**. The 22-day gap was **ERROR/boot**. Recovery **reopened the mill** (294 drafts in five days). Merging that mill undoes the merge-stop half. |
| Midnight halt vs 06/12/18 mill | 10-23, 10-24, and **10-25** proved daytime cadences ship skip-wipe/map/pack-enemy/soak. Halt must be **all implementer schedules** (MTD-2026-10-24-005). |
| #338…#1074 vs this PR | This file subsumes all fourteen. Close them without merge. |
| 09-22…10-25 persist HUD twins vs #330 keep | #330 is on `main`. Hold the twins including `#742`…`#1099`. |
| #501 leftover walk rAF vs `AGENTS.md` | RAF is frozen. Hold #501 and #761 even if the race is real. |
| Oldest-first stack vs living director index | Close superseded director snapshots; restack #327; do not merge-burst 776 drafts (MTD-2026-09-25-005). |
| Combat-parity UUID `-a486` vs `-a484` | Live automation is `f37b7505-a484`. |
| Expansion UUID `-a49e` vs `-a492` | Live automation is `3f31b18f-a492`. |
| `ARCHITECTURE.md` `check-limit = 4` vs `mops.toml` `5` | Stale `main` docs (line 28). Living index never landed. Do not “fix” by a Motoko PR. |
| TBC `2786666f` vs “Stralt game balance” `3c083a4a` | Different automations. TBC must stay WAITING. The other balance agent must not retune `BAL-*` either. Both RUNNING tonight. |
| GTAD sidecar vs persist lock | Counters fire **after** persist returns, or query-only. Never enqueue telemetry on `progressPersistRef`. |
| #62 paint extracts vs domain extracts | `#1106`: paint is FAKE MODULARITY. Prefer `#369/#514/#683` or close them. HOLD `#831/#901/#961/#995/#1076`. |
| Invariants 0-PR (Sep 27) vs soak `#1100` | `#1106` revoked KEEP. Invariants must stay report-only while SHA is unchanged. |
| AQA “director weekly” vs this daily cron | Fifteen unmerged snapshots are a process mill because humans will not close them. Keep the director; close supersessions. Do not dashboard-disable this UUID. |
| Quality audit `#1106` vs this living index | Same P0. Land **one** director index; `#1106` may follow. Do not merge two overlapping process ledgers first. |
| gh `advertised` search = 79 vs pack-enemy combat 25 | Tokenization matched design docs. ENGINEERING count for the mill is **25** pack-enemy combat titles plus the soak/share-kit clusters, not 79. |

---

## TOP 5 CURRENT PRIORITIES

1. **Halt the 2026-10-26 implementer flock and the 06/12/18 hunter-implementer cadences** (48 RUNNING this hour, including map guardian `9dcfd122`, AI `67b03c2f`, combat-parity `f37b7505`, persist auditor `607e0304`, boss `39040ad2`, dungeon `73740435`, complexity reduction `386a157d`, spell mechanics `1330956a`, spell discovery `c26e5a83`, critical hunter `1aa41c6c`, expansion `3f31b18f`, invariants `72eb90fe`) and **do not merge-burst the 776 leftover drafts**. 10-21 through 10-25 recovery opened **294** PRs in five days, including daytime skip-wipe/map/pack-enemy/soak — that is the failure mode, not a backlog to clear. Tonight already opened `#1108`–`#1120` (TBC WAITING, WX paint extract, expansion, Pale Archivist test, admin helpers); HOLD the rest of the wave.
2. **Unblock the living director index** — close #338/#402/#448/#509/#569/#618/#666/#718/#783/#814/#870/#946/#998/#1074 without merge; **restack #327** so oldest-first is not a 54-day CONFLICTING gameplay PR sitting in front of every later change (MTD-2026-09-25-005).
3. **Confirm Caffeine deploy of the 20260901 GameKey tail** and refresh `.old` from that build (MTD-2026-09-21-002). Source has been ready for 53 days; ops is not proven.
4. **Reward-trust ADR (AQA-008)** — clamps, ignore-client level, and AP/MP cap landed; the written decision did not. Security is running again tonight.
5. **After halt: merge restacked #327** (Striker AoE/bounce), then union #370’s AI/summon delta only, then **re-freeze WX / mapGen** and replace the skip-wipe mill (**93**), pack-enemy mill (**25**), and soak mill (**4**) with one helper each.

## BLOCKED WORK

- Spell discovery / observed enemy kits / new unlock loops — no ownership persist, combat landing still racing, ADR unwritten, Caffeine deploy of GameKey unconfirmed.
- Enemy AI capability expansion — `enemyAI.ts` already 2,580 lines; kits never leave zone 0; HP/death still dual-written. Tonight’s AI agent must not grow it.
- Telemetry admin dashboard — no counters to display (AQA-012). Balance analyst correctly WAITING.
- Any Motoko PR that adds stables until deploy is confirmed and `.old` refreshed.
- Further `mapGen.ts` punches (including **#331**) without an explicit human playtest of the #321→#329 sequence.
- Custom-client mint proofs / new credit APIs until the ADR exists.
- `calculateAndAwardDoka` productization (unused official path; still a sink).
- Formula-level `BAL-*` / `LHIPS-*` retunes (no telemetry; jackpot 100k clamp is architecture).
- Admin Draft→Validate→Activate chrome on the 8.3k dashboard before canister lifecycle exists. HOLD `#945`, `#1001`, `#1066`.
- Sequential merge of the 776 leftover gameplay drafts “to clear the queue.”
- RAF / walk-stepper edits (#501/#761), leftover-walk mill, Death Realm skip mill, dump-alcove mill, live-gate mill, combat-effect mill, share-kit mill, skip-wipe mill, soak mill, Swap mill (#541/#754), WX paint extracts (#831/#901/#961/#995/#1076).
- Approved Design / AI / boss / dungeon / complexity / spell-mechanics / combat-parity / persist-auditor / admin-implementer / critical-hunter / invariants implementation from tonight’s flock.
- Wave 16/17 expansion cards and pack-enemy / healer-interpose gates on `enemyAI.ts`.

## SAFE EXPANSION WORK

- Land this docs PR; close #338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, #946, #998, and #1074.
- Restack/merge #327 (scoped Striker helper + tests). Do not duplicate it in #370 until unioned.
- Adopt per-producer ledgers + this director index (AQA-003) — process, not gameplay.
- Design-only (no PR, or docs-only if already launched): keep SDA/SDE/EBA catalogs; do not author a fifth discovery schema; do not implement Wave 16/17 boss sheets or AI behaviors.
- Query-only / persist-lock-enqueued counters (AQA-012) — **design + tiny isolated PR after flock halt**, not a dashboard. Sidecar off the persist lock.
- Kit-zone number fix (PREREQ-A) **after** the flock is held — one call site + `enemyAI` test, no WX growth.
- Display-only unique copy if orchestrator finds one hole not already on `main` or drafted (#354 Feats copy, #517 empty Map Effects).
- Merge #391 helper (new file) after halt — does not touch WX / mapGen / persist lock.

## AREAS TO STOP TOUCHING TEMPORARILY

- `src/frontend/src/components/WorldExploration.tsx` except one-line helper wiring
- `src/frontend/src/engine/mapGen.ts` (including all open punches and dump-alcove)
- RAF loop, turn-order math, damage formulas (`AGENTS.md`) — including leftover walk rAF (#501) and paint extracts
- `src/frontend/src/utils/progressPersist.ts` (leave the lock)
- `src/frontend/src/utils/deathPenalty.ts` (cluster closed)
- `src/frontend/src/engine/targeting.ts`
- `src/frontend/src/engine/enemyAI.ts`
- `src/frontend/src/engine/spellEngine.ts` (share-kit mill magnet)
- `src/frontend/src/engine/spawnPolicy.ts` (just extracted)
- `src/frontend/src/engine/battleWalkMp.ts` / `enemyWalkMp.ts` (just landed)
- `src/frontend/src/components/AdminDashboard.tsx` (HOLD `#945` / `#1001` / `#1066`)
- `src/backend/main.mo` persistent fields until deploy confirmation
- Frozen chain files `20260831_000000.mo` / `20260901_000000.mo`
- `docs/automation/ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, and `ACTION_IDS_2026-09-21.md` through `ACTION_IDS_2026-10-25.md` (do not append)
- GameKey product methods except unpaid-death honour on the existing redeem helper

## ARCHITECTURAL HOTSPOTS

1. Unconfirmed Caffeine deploy vs correct-in-source EOP chain (`20260901` GameKey; `.old` still Aug-31) — now **53 days**
2. Dual HP / death / landing authority (React snapshot vs `combatantsRef` vs Swap/summon/destack teleport + soak mill)
3. Client-trusted `applyRewards` without a written ADR (clamps exist; decision does not)
4. 19k-line world orchestrator absorbing every hunter (`#831/#842/#901/#961/#995/#1076` already in the leftover queue)
5. Automation pile-on (**776** leftover drafts + 10-26 restart already RUNNING) after a recovered 22-day ERROR outage that was **not** a halt — now including **daytime cadences** and a **five-day** recovered mill
6. Oldest-first queue vs living director index (#327 CONFLICTING head; #331 also CONFLICTING; fifteen director snapshots)
7. mapGen portal-punch / battle-graph / leftover-crumb (guardian RUNNING; four more snaps on 10-25)
8. Dual spell catalogs + implicit ownership (blocks discovery)
9. Kit-zone object call site (dynamic pools implemented and dead; number already in `currentZoneTier`; seventeenth cycle)
10. Striker victim-tile authority split across #327 and #370
11. Unseeded-wallet / remount-wipe HUD twins stacked on the #330 keep (**93** skip-wipe drafts)
12. Leftover-walk abort mill (#501 RAF + clones + #761) plus soak leftover-walk `#1100`
13. Death Realm pending vs wallet writes
14. Combat live-gate / catalog-effect mill plus pack-enemy **25** and soak **4**
15. Swap mill (#541 + #754) instead of `applyHazardLanding`
16. AI / boss / dungeon / complexity / spell-mechanics / combat-parity / persist-auditor / critical-hunter / invariants running against an over-specified, under-wired catalog
17. #62 paint-file explosion (`dustMotes` / `tilePaint` / `mapHazardPaint`) vs abandoned domain extracts

## TELEMETRY SIGNALS WORTH INVESTIGATING

**None can be investigated in production — the series do not exist.** TBC `#1108` (2026-10-26) is the fifteenth WAITING inspection of `0f5363f`. Do not treat architecture docs as rows.

When AQA-012 lands, investigate in this order (engineering + design, not telemetry-alone priority):

1. persist-ok vs persist-fail and death-penalty-applied vs victory-paid vs **single-axis-credit-then-death** (integrity; #183/#256/#330 class — measure whether the hole is closed, do not assume)
2. GameKey request vs approve vs redeem vs redeem-fail (ops; new funnel; do not treat 0 rows as “players don’t buy”)
3. recap opened vs dismissed vs lava-death-during-recap (PX; input gate may have closed — measure)
4. spell-cast counts **by acquisition path** (starter vs unlocked vs observed) — a “weak” spell may be undiscovered, not weak. Today every catalog id is treated as owned, so this series would be **meaningless** until SDA-002.
5. Attack Nearest vs aimed-cast ratio (gate confusion vs power)
6. challenge accept vs complete vs advertised-reward-missing vs **Striker splash/bounce beyond 2** (#327 — if complete rate is high on Nova/Chain, DESIGN INTERPRETATION is the aim-tile hole, not player skill)
7. Swap / summon-walk / destack / leftover-walk onto hazards vs walk onto the same tile (MIMA-001 + soak mill — if “Untouchable complete rate” is high, DESIGN INTERPRETATION is skip-landing, not player skill)
8. Frozen/Slime maps: tiles walked vs preview budget (09-01-001 is closed in source — measure whether leftover-1-MP walks remain)
9. unseeded-lock HUD vs committed Doka after one-shot / GameKey / feat / shop / heal (09-22…10-25 persist twins — if wallet “resets,” ENGINEERING is hydrate, not player spend)
10. leftover-walk after last hostile / into Death Realm / into battle start (#501/#761/#1100 mill — if players “slide” after victory, ENGINEERING is walk-cancel, not feel)
11. Death Realm pending vs shop/heal/GameKey (if wallets move during 1.5s death, ENGINEERING is missing a shared guard, not player intent)
12. Shield / shred / Trap / Soul Rend / drain / Pacifist-kit / Chain Lightning bounce / Mark / Mirror / Swap / DoT ticks / buffStat / pack-enemy Inferno casts vs advertised numbers (combat-effect mill — if players call those spells “broken,” ENGINEERING may be execute-path skip, not balance)
13. Hostile summon kit casts vs empty `spells` at spawn (#842/#861 — if summons “do nothing,” ENGINEERING is catalog wiring, not AI tier)
14. Pale Archivist Mark / Pages of Doom / Cursed Wound / Ink Veil shadowing (test mill `#1089/#1102/#1105` — if those spells “do the wrong thing,” ENGINEERING is kit-first shadowing, not player confusion)

Until those exist: automations must not claim CLEAR_POSITIVE_SIGNAL or “players don’t use X.” Distinguish MEASURED PLAYER BEHAVIOUR (none) from DESIGN INTERPRETATION and ENGINEERING EVIDENCE.

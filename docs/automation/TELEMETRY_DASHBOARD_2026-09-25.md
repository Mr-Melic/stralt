# Owner telemetry dashboard — cron skip (no new collectors)

**Author:** Telemetry Admin Dashboard Designer  
**Date:** 2026-09-25 (cron `0 */72 * * *`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Implementer spec (H1–H14):** unmerged [PR #345](https://github.com/Mr-Melic/stralt/pull/345) (`TELEMETRY_DASHBOARD_2026-09-21.md`)  
**Prior process fences:** unmerged [PR #424](https://github.com/Mr-Melic/stralt/pull/424) (09-22), [PR #455](https://github.com/Mr-Melic/stralt/pull/455) (09-23), [PR #504](https://github.com/Mr-Melic/stralt/pull/504) (09-24)  
**On `main`:** [`TELEMETRY_DASHBOARD_2026-09-02.md`](TELEMETRY_DASHBOARD_2026-09-02.md)  
**Gameplay / production code:** not modified this run. README not touched (stack union).

This is **not** a fifth copy of H1–H14. `TADD-2026-09-24-001` / `TADD-2026-09-23-002` told this cron to skip a restatement unless APIs changed. They did not. Requested battle / enemy / spell-cast / earn-spend series are still **not invented**.

---

## 0. Verdict

There is still **no analytics store, no increment API, no sidecar, and no
Admin Health / Intelligence tab** on `origin/main` SHA `0f5363f` — the
same tree as #345 / #424 / #455 / #504.

`longHorizonSim.telemetry.available === false` (`longHorizonSim.ts`
**532–536**; asserted in `longHorizonSim.test.ts` **67**). Empty maps
must not paint as “zero battles.”

**No level cap.** HUD leftover-XP saturates at 48
(`longHorizonSim.test.ts` **68**); characters still level. Do not design
endgame chrome.

Owner Health remains the **one** card set in #345 §9. This file only
records that the 72-hour re-inventory found no new `LIVE_SNAPSHOT` or
`APPROVED_EVENT` sources, and extends the process fence to 09-24
afternoon/evening drafts that #504 could not yet list, plus same-hour
09-25 copies.

---

## 1. Re-inventory (APIs unchanged)

Product greps this run: `incrementTelemetry` / `recordTelemetry` /
`telemetrySidecar` / `adminGetTelemetry` / `persist_ok` /
`persist_fail` / `shop_credit_committed` / `victory_paid` /
`death_penalty_applied` = **0** hits in `src/`. No `tab: "health"`.

| Topic | 09-24 (#504, same SHA) | 09-25 (this run) |
| :--- | :--- | :--- |
| Collectors | 0 product hits | **Still 0** |
| Health tab | No `tab: "health"` (`gameTypes.ts` **482–498**; `AdminDashboard.tsx` **5605–5626**) | Unchanged. 15 config tabs. |
| Shop-credit increment site | `shouldCommitGameKeyRedeem(seeded, granted)` (`shopPurchase.ts` **275–328**) | Unchanged |
| `processPendingPurchases` | Always 0 (`main.mo` **1338–1348**) | Unchanged |
| `calculateAndAwardDoka` | Always 0 (`main.mo` **3073–3076**) | Unchanged. Dead mint. |
| `getAdminAuditLog` | Bound; AdminDashboard **comment** only (**4232–4234**); no caller | Unchanged. H14 still unbuilt. |
| `getAllCharacters` | Admin query (`main.mo` **532–536**); unused by dashboard | Unchanged. OQL `characterSlots` still has no spell keys / bar / `bossRushMasterComplete`. |
| OQL `execute` | Bindgen wrapper only | Unchanged. **0** AdminDashboard / Health callers. |
| `saveKillCount` | Hook only (`useLeaderboardQueries.ts` **43–48**); **0** TSX callers | Unchanged. Not battle count. |
| World custom visuals | 0 `spriteUrl` / `drawImage` in `WorldExploration.tsx` | Unchanged. No `CUSTOM_FALLBACK` metric. |
| `APP_VERSION` | `v163` (`App.tsx` **14**) | Unchanged |
| Starter catalog | 32 (`longHorizonSim.test.ts` **66**) | Unchanged |
| H9 `totalBossRushRuns` | Master finish occupying room 9 (`main.mo` **3347–3350**; `shouldCountBossRushRun`) | Unchanged |
| H2 gates | Four wallet/level/spell-level keys + unknown-condition reject (`adminGuard.mo` **677–694**). Combat feats client-trusted; also fire on Boss Rush room-clear. `boss_defeated_*` not persistable. | Unchanged (same SHA; line numbers vs 09-02 docs drifted). |
| Unmerged TADD matrices | #345, #424, #455, then #504 | **All four still open.** This file is captions only. |

`origin/main` has **not moved** since 2026-09-21. Newest open PR at
inspect: [#556](https://github.com/Mr-Melic/stralt/pull/556)
(2026-09-25T00:06Z, TBC WAITING_FOR_TELEMETRY). Same-hour 09-25 design
copies are expected after this cron.

---

## 2. Data classes (unchanged)

| Class | Owner-aggregatable? |
| :--- | :--- |
| `LIVE_SNAPSHOT` | Yes, admin/controller, **aggregated before paint**. |
| `APPROVED_EVENT` | AQA-012 seven counters. **Not implemented.** After ship only. |
| `LOCAL_ONLY` | **No.** Debug ring (`debugLogger.ts` cap **2000**) / admin `<img onError>`. |
| `UNSUPPORTED` | **No chart.** Queued design docs are not live data. |

`getLeaderboard` returns principal + name. Do not use it on Health.
Settings `getBannedPrincipals` and OQL `bannedPrincipals` stay off Health.

---

## 3. Requested metrics — still the #345 matrix

Do not draw a panel unless the class is `LIVE_SNAPSHOT` or
`APPROVED_EVENT`. Show “not measured,” never a vanity zero.
Correlation is not causation. Show **n**. No composite health score.

### Game health

| Asked | Support | Honest substitute |
| :--- | :--- | :--- |
| Battle count | `UNSUPPORTED` | After AQA-012: **victory paid** ≠ all battles. Not `killCount`. |
| Victory / defeat / flee | `UNSUPPORTED` | Victory paid only. Defeat/flee uncounted. |
| Average battle turns | `UNSUPPORTED` | Challenge `under_*_turns` is local. |
| Deaths | `UNSUPPORTED` | After AQA-012: **death-penalty applied** = persist succeeded. |
| Persistence failures | `LOCAL_ONLY` | After AQA-012: persist-ok vs persist-fail. |
| Abnormal termination | `UNSUPPORTED` | No crash / tab-close / mid-battle abandon event. |

### Enemy health

Encounter frequency, relative level, win/loss, duration, elite
frequency, advanced AI, enemy spell usage: all `UNSUPPORTED`. No Enemy
Health outcome section. Optional H10 catalog counts only.

### Spell health

Casts, discovery, acquisition source, combat combinations, underused /
overused, observed-but-rarely-obtained: `UNSUPPORTED`. Weak proxy:
equipped-together from `spellBarOrder` / `activeSpells` via
`getAllCharacters` — label **loadout**, never “usage.” WX `ownedIds` is
local retirement gating, not SDE persist.

### Progression

| Asked | Support |
| :--- | :--- |
| Level distribution | `LIVE_SNAPSHOT` — occupied slots. **No cap.** Open-ended histogram. Raise the last band when `max(level) > 80`. Never “endgame / max level.” |
| XP leftover | `LIVE_SNAPSHOT` vs `100 * 2^(N-1)`. HUD saturates at 48; not a cap. |
| Spell discovery | `UNSUPPORTED`. H3 = upgrade coverage. |
| Achievement progression | `LIVE_SNAPSHOT`. Four keys server-gated; unknown conditions refused; combat feats client-trusted (also fire on Boss Rush room-clear). `boss_defeated_*` not persistable. |

### Economy

No earn/spend ledger. Code map of writers only. After AQA-012: **counts**
of victory paid and shop credit committed (not amounts). GameKey
`status=redeemed` `dokaAmount` sum is **paid mint**. `hintedEuroCents`
is not settlement. Dead writers (`calculateAndAwardDoka`,
`processPendingPurchases`) return 0 — do not chart.

### Bosses / dungeons

Attempts, average attempts, flee, relative difficulty: `UNSUPPORTED`.
Snapshot only: Rush `highestRoomCompleted`, `totalBossRushRuns` =
**master finishes occupying room 9**, `bossRushMasterComplete`; dungeon
`totalMapsCompleted` = cumulative maps. `BossConfig.defeated` is a
global admin flag.

### Admin content / visual fallback

Invalid-config events are not audited (`#err` before `_recordAdminAudit`).
Failed asset loads and pattern-lookup-failed are `LOCAL_ONLY`.

| Kind | Today |
| :--- | :--- |
| `NORMAL_DEFAULT` | Empty URL. Live world path. Admin copy still says “Active fallback.” |
| `STORED_NOT_RENDERED` | URL saved; World does not fetch. Config hygiene, not an error. |
| `CUSTOM_FALLBACK` | **No metric.** Do not chart empty URL, stored URL, preview `onError`, or audit `pixel-fallback`. |

---

## 4. Owner views (one card set — do not concatenate)

Implementer detail: **PR #345 §9**. Layout: **PR #345 §10**. Caption
deltas in #424 / #455 / #504 still apply (shop credit =
`shouldCommitGameKeyRedeem`; H9 master-finish; H2 room-clear feats;
H14 bindgen present).

| View | Decision | Class |
| :--- | :--- | :--- |
| H1 | Occupied-slot level histogram. No cap. | `LIVE_SNAPSHOT` |
| H2 | Achievement funnel. Four keys server-gated. Combat feats client-trusted. | `LIVE_SNAPSHOT` |
| H3 | Spell **upgrade** coverage, not casts / discovery. | `LIVE_SNAPSHOT` |
| H4 | Loadout co-occurrence. `n ≥ 20`. | `LIVE_SNAPSHOT` |
| H5 | Wallet Nat. Not earned/spent. | `LIVE_SNAPSHOT` |
| H6 | GameKey status funnel. Strip email / principal / code before setState. | `LIVE_SNAPSHOT` |
| H7 | Source/sink **code map**. Dead mint/credit = 0. | code map |
| H8 | Dungeon snapshot. Not attempts. Survivorship. | `LIVE_SNAPSHOT` |
| H9 | Rush rooms 0–10. `totalBossRushRuns` = master finishes at room 9. | `LIVE_SNAPSHOT` |
| H10 | `NORMAL_DEFAULT` vs `STORED_NOT_RENDERED`. Not `CUSTOM_FALLBACK`. | catalog |
| H11 | `v163` vs `getAppVersion`. Not “played during vX.” | `LIVE_SNAPSHOT` |
| H12 | “Not shipped (AQA-012).” Seven counters only. | `APPROVED_EVENT` unbuilt |
| H13 | Not-measured list (battle starts, enemy series, casts, ledger, …). | — |
| H14 | Audit **action** counts. Drop principals. Last 100 successful writes. | `LIVE_SNAPSHOT` unbuilt card |

Until the Health tab exists: do not mock a chart in another tab.

Filters (enable only where the row has a timestamp or a joinable level):
period → H2 / H6 / H12 / H14; level band → H1 / H3 / H4 / H8–H9;
spell → H3 / H4; version → H11. Hide enemy-family / boss-id filters.

Privacy: aggregates only. No principals, names, emails, GameKey codes,
KYC, Settings `getBannedPrincipals`, OQL `bannedPrincipals`. `n < 5`
hide rates; `n < 20` hide percentages. No composite health score.
Correlation ≠ causation. Snapshot ≠ rate.

Approved event set remains **seven** counters. Shop credit ticks only
when `shouldCommitGameKeyRedeem` is true. Do not pre-build GTAD Phase 1
extras (battle start/defeat/flee, Q-015, Q-016). New Motoko maps need a
**later** EOP file after frozen `20260901` (`TADD-2026-09-21-004`).

---

## 5. Sibling drafts that are still not collectors

#504 fenced 09-23 afternoon #456–#501 and same-hour 09-24 copies
(#502 TBC, #503 WDD). After that PR opened, `main` still did not move.
Additional **open** drafts that are **not** Health sources:

| Open PRs | Kind | Health rule |
| :--- | :--- | :--- |
| #345 / #424 / #455 / **#504** | Prior TADD matrices, same SHA | **One** H1–H14 spec. Union docs; do not concatenate UI. |
| #333 / #395 / #462 / **#502** / **#556** TBC | WAITING_FOR_TELEMETRY, 0 rows | Do not paint as zero battles. |
| #352 / #422 / #450 / **#527** GTAD | Architecture + Phase 1 extras | AQA-012 seven counters only. |
| #355 / #418 / #461 / **#520** VAL | Visual library design | No custom-URL loader. No `CUSTOM_FALLBACK` series. |
| #371 / #480 / **#533** SDE | Observe→win design | No `observedSpellIds` / `ownedSpellIds` persist. |
| Formations / elites / AI docs through #537 | Design copies | No encounter / elite / archetype usage charts. |
| #357 / #407 / #475 / **#530** LHIPS | Synthetic progression | `telemetry.available` stays false. |
| #398 / #473 / **#515** SDA | Spell/discovery admin re-audit | Catalog UX, not a discovery store. |
| **#505–#555** (09-24 after #504) | Combat / map / persist / UX / more design copies | Not increment maps. Do not scrape tests as telemetry. |
| Same-hour 09-25 design copies after #556 | Dated copies of the above | Same fence. |

---

## 6. Implementation order (unchanged; no production code this run)

1. **TADD-2026-08-31-001 / AQA-012** — seven counters. Shop credit =
   `shouldCommitGameKeyRedeem`. Later EOP file after `20260901`.  
2. **TADD-2026-08-31-002** — **one** Health tab (H1–H11, H13) from #345.  
3. **TADD-2026-08-31-003** — aggregate query / OQL without PII.  
4. **TADD-2026-09-02-001** — H14 (bindgen already present).  
5. H12 widgets only after counters are queryable.

Next TADD cron: skip another matrix unless `origin/main` moves, AQA-012
ships, a Health tab lands, a custom-URL loader lands, SDE persist maps
land, or a new owner aggregate ships.

---

## 7. ACTION_IDs

Prior OPEN (unless noted): `TADD-2026-08-31-001` … `007`;
`TADD-2026-09-01-001` (bindgen **done**, H14 card open);
`TADD-2026-09-01-002` … `005`; `TADD-2026-09-02-001` … `006`
(`TADD-2026-09-02-002` superseded by `TADD-2026-09-21-001`);
`TADD-2026-09-21-001` … `006`; `TADD-2026-09-22-001` … `002`;
`TADD-2026-09-23-001` … `002`; `TADD-2026-09-24-001` … `002`.  
This run: [`ACTION_IDS_TADD_2026-09-25.md`](ACTION_IDS_TADD_2026-09-25.md).

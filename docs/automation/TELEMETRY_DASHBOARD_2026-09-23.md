# Owner telemetry dashboard — inventory refresh

**Author:** Telemetry Admin Dashboard Designer  
**Date:** 2026-09-23 (cron `0 */72 * * *`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior designs:** unmerged [PR #424](https://github.com/Mr-Melic/stralt/pull/424) (`TELEMETRY_DASHBOARD_2026-09-22.md`), unmerged [PR #345](https://github.com/Mr-Melic/stralt/pull/345) (`TELEMETRY_DASHBOARD_2026-09-21.md`, implementer spec for H1–H14), [`TELEMETRY_DASHBOARD_2026-09-02.md`](TELEMETRY_DASHBOARD_2026-09-02.md) (on `main`)  
**Architecture (still design-only on `main`):** [`TELEMETRY_ARCHITECTURE_2026-09-02.md`](TELEMETRY_ARCHITECTURE_2026-09-02.md). Queued drafts: [PR #352](https://github.com/Mr-Melic/stralt/pull/352) (09-21) and [PR #422](https://github.com/Mr-Melic/stralt/pull/422) (09-22 copy).  
**Gameplay / production code:** not modified this run.

This is a **support-matrix refresh**, not a new collector set and not a
third copy of H1–H14 widgets. `origin/main` has **not moved** since the
2026-09-21 designer pass. Re-verified product APIs still match PR #345
line citations. The class-relevant finding this run is **process**: a
**second day** of sibling design PRs (2026-09-22, #392–#430+) is also
not a Health source, and unmerged TADD matrices must not concatenate
into duplicate dashboard cards.

Requested battle / enemy / spell-cast / earn-spend series are still
**not invented**.

---

## 0. Verdict

There is still **no analytics store, no increment API, no sidecar, and no
Admin Health / Intelligence tab.** `longHorizonSim.telemetry.available ===
false` (`longHorizonSim.ts` **532–536**; asserted in
`longHorizonSim.test.ts` **67**).

Empty increment maps must not paint as “zero battles.” Until AQA-012
ships, Game Health event panels stay the H12 “not shipped” strip plus H13.

`origin/main` SHA is still `0f5363f` — the same tree as #345 and #424.
Do not treat a third dated file as “new measurements arrived.”

**No level cap.** HUD leftover-XP saturates at 48 (`longHorizonSim.test.ts`
**68**); characters still level. Do not design endgame chrome.

---

## 1. What changed since 2026-09-22 (and what did not)

Inspected against PR #424 (draft, same base `0f5363f`) and `origin/main`.
**No gameplay event store landed.** No later commit exists on `main`.

| Topic | 2026-09-22 (`0f5363f` / #424) | 2026-09-23 (same HEAD) | Dashboard impact |
| :--- | :--- | :--- | :--- |
| Product APIs | Seven AQA-012 counters absent; no Health tab | **Unchanged.** `recordTelemetry` / `telemetrySidecar` / `adminGetTelemetry` / `telemetryLifetime` / `incrementTelemetry` / `persist_ok`: **0** product hits | H12 stays “not shipped.” Do not draw zeros. |
| Health tab | No `tab: "health"` | Still config CRUD only (`gameTypes.ts` **482–498**; `AdminDashboard.tsx` **5606–5626**) | TADD-002 still open. |
| Shop-credit increment site | `shouldCommitGameKeyRedeem(seeded, granted)` (`shopPurchase.ts` **275–328**) | Still the only live commit predicate | H12 shop credit unchanged. |
| `processPendingPurchases` | Always 0 (`main.mo` **1338–1348**); World remount still calls it (`WorldExploration.tsx` **1494–1497**) | Unchanged | Do not chart remounts. |
| Boss Rush `totalBossRushRuns` | Master finishes occupying room 9 (`adminGuard.mo` **696–700**; `main.mo` **3347–3351**) | Unchanged | H9 caption stands. |
| Victory feats | Client-trusted list on `handleBattleEnd` **and** room-clear (`WorldExploration.tsx` **12483–12497**, **12902–12916**). `boss_defeated_*` not in `knownAchievementCondition` (**515–530**) | Unchanged | H2 caption stands. |
| Spell discovery persist | No `ownedSpellIds` / `observedSpellIds` on `Character` (`main.mo` **122–145**). WX `ownedIds` is a **local Set** for retirement gating (`WorldExploration.tsx` **2421–2433**; `adminSafety.ts` **711–718**) | Unchanged | Keep H3 as upgrade coverage. |
| GameKey EOP | Frozen tail `20260901_000000`; `check-limit = 5` (`mops.toml` **33**) | Unchanged | New telemetry maps = **later** file after `20260901`. |
| Identifiable dumps | Settings `getBannedPrincipals` (`AdminDashboard.tsx` **5426 / 5466 / 7080**); OQL `bannedPrincipals` (`main.mo` **3798–3806**) | Unchanged | Health must not mount either. |
| `getAdminAuditLog` | Bound (`backend.ts` **839–845**, **2435–2453**; `main.mo` **3486–3491`). AdminDashboard mention is a **comment** only (**4232**). `usePanelLayout.ts` **48** is a type, not a caller. | Unchanged | H14 still unbuilt. |
| Custom world visuals | 0 `spriteUrl` / `drawImage` hits in `WorldExploration.tsx`. VAL resolver absent | Unchanged. `src/` has no `ctx.drawImage` except the `adminVisualStatus.ts` **5** comment. | Empty URL and stored URL are **not** `CUSTOM_FALLBACK`. |
| Formations / elite / world features | WX does **not** import `engine/worldFeatures.ts`. Only the test file imports it. | Unchanged | No elite-frequency chart. |
| `saveKillCount` | Hook only (`useLeaderboardQueries.ts` **43–50**); **0** TSX callers | Unchanged | Still not battle count. |
| `APP_VERSION` | `v163` (`App.tsx` **14**) | Unchanged | H11 unchanged. |
| Starter catalog | 32 (`longHorizonSim.test.ts` **66**) | Unchanged | H3 caption. |
| Queued sibling design PRs | #333–#380+ (09-21 swarm) | **Plus 09-22 copies** #392–#430+: TBC #395, GTAD #422, VAL #418, SDA #398, TADD #424, formations/AI/LHIPS/WDD duplicates. None are on `main`. | **Extend the process fence.** TADD-2026-09-23-001. |
| Unmerged TADD matrices | #345 only | **#345 and #424** both still open (drafts). This file is the third dated matrix on the same SHA. | Do not concatenate three Health card sets. TADD-2026-09-23-002. |

`longHorizonSim` is **not** a Health data source.

### 1.1 Sibling PRs that are not collectors

These drafts exist. They do **not** change `origin/main` APIs. Health must
not read them as `LIVE_SNAPSHOT` or `APPROVED_EVENT`.

| Open PR | Kind | Health rule |
| :--- | :--- | :--- |
| #333 / **#395** TBC | `WAITING_FOR_TELEMETRY`, 0 rows | Do not paint those zeros as “zero battles.” |
| #345 / **#424** TADD | Prior matrices, same HEAD | Same H1–H14. This file is the 48-hour reconfirm + 09-22 swarm fence. |
| #352 / **#422** GTAD | Architecture + Phase 1 extras | Implement AQA-012 seven counters only until a human expands 012. Do not pre-build battle start/defeat/flee, Q-015, Q-016. |
| #355 / **#418** VAL | Visual library design | No custom-URL loader. No `CUSTOM_FALLBACK` series. |
| #371 SDE | Observe→win design (no 09-22 SDE PR at inspect) | No `observedSpellIds` / `ownedSpellIds` persist. |
| #348–#351 / #401 / #405 / #416 | Formations / elites / AI docs | No encounter, elite, or archetype usage charts. |
| #357 / **#407** LHIPS | Synthetic progression | `telemetry.available` stays false. |
| #398 SDA | Spell/discovery admin re-audit | Catalog UX, not a discovery event store. |
| #327 / #331 / #334–#430+ code drafts | Combat / map / persist / admin copy | Not increment maps. Do not scrape their tests as telemetry. |

---

## 2. Why this is still not a vanity dashboard

The 2026-08-30 Quality Auditor found no player telemetry. That is still
true on `0f5363f`. Persist-fail strings remain local logs only
(`WorldExploration.tsx` **12611–12616**, **12863–12868**). Debug ring is
local (`debug/debugLogger.ts` **44**, **110–111**, cap 2000).

**Rule:** if the class is not `LIVE_SNAPSHOT` or `APPROVED_EVENT`, do not
draw the panel. Show “not measured,” never a zero that looks like “zero
battles.”

Correlation is not causation. Show **n**. No composite “health score.”

---

## 3. Data classes (do not mix)

| Class | Meaning | Owner-aggregatable? |
| :--- | :--- | :--- |
| `LIVE_SNAPSHOT` | Current canister maps / configs. No history unless the row has a timestamp. | Yes, admin/controller, **aggregated before paint**. |
| `APPROVED_EVENT` | AQA-012 seven counters. Not implemented. | Yes, **after** that ID ships. |
| `LOCAL_ONLY` | Debug ring / admin `<img onError>`. | **No.** |
| `UNSUPPORTED` | Requested, no persist, not approved as a live collector. | **No.** Do not design a chart. Queued design docs are **not** live data. |

`CANISTER_UNBOUND` is **empty** this run for Health sources.

`getLeaderboard` is public and returns `principalId` + `playerName`. Do
not use it on Health.

---

## 4. Inventory — what actually exists now

Unchanged vs PR #345 §4. Re-read on this SHA:

### 4.1 Admin / player canister APIs (Health-relevant)

| Source | Gate | Class / Health use |
| :--- | :--- | :--- |
| `getAllCharacters()` (`main.mo` **532–536**) | `#admin` | `LIVE_SNAPSHOT` — level, leftover XP, spell keys/bar, `bossRushMasterComplete`. Strip name/principal before paint. |
| `getLeaderboard()` | public | **Do not use on Health** (principal + name). |
| `saveKillCount` (`main.mo` **3078+**) | caller | Hook exists; **no UI caller**. Not battle count. |
| `dokaBalances` / `adminGetDoka` / OQL | `#admin` | Current wallet Nat. No earn/spend journal. |
| `adminListGameKeyRequests` (`main.mo` **1539–1543**) | `#admin` | Status / `dokaAmount` / `timestamp` only. **Drop email, principal, redeemedBy.** |
| `adminGetPurchaseRecords` | `#admin` | Legacy KYC. Writer disabled. |
| OQL `dungeonRecords` / `bossRushStates` | controller | Snapshot progress. Not attempts. `totalBossRushRuns` = master finishes occupying room 9. |
| `getAppVersion` / `APP_VERSION` | public | `v163`. Catalog, not event-tagged. |
| `getAdminAuditLog()` (`main.mo` **3486–3491**) | `#admin` | Last-100 successful writes. Bound. **No AdminDashboard caller.** |
| `getBannedPrincipals()` (`main.mo` **1312–1320**) | `#admin` | Settings ops. **Not Health.** |
| `calculateAndAwardDoka` (`main.mo` **3073–3076**) | public | **Always 0.** Not a source. |
| `processPendingPurchases` (`main.mo` **1338–1348**) | caller | **Always 0.** Not a source. |
| `redeemGameKey` | caller | Live paid mint. Owner aggregate = GameKey request `status=redeemed` only. |

`AdminDashboardState.tab` is still enemies, regions, sprites, visuals,
spells, settings, tiers, modifiers, purchases, achievements, names,
bosses, ads, shop, bossRush. Purchases tab is `AdminGameKeyPurchases`.
No Health. Frontend `execute` exists only as the bindgen wrapper
(`backend.ts` **2396 / 2403**).

### 4.2 OQL — still missing vs Health / still PII

Unchanged: `characterSlots` has no spell keys / bar / `bossRushMasterComplete`.
`gameKeyRequests` includes **email** + **userPrincipal** (`main.mo` **3780–3796**).
`bannedPrincipals` is `principalText`. `purchaseRecords` is legacy KYC.
`adminAuditLog` / `gameKeyLedger` / `gameKeyReveals` are **not** OQL (keep it
that way).

### 4.3 Approved but not shipped (`AQA-2026-08-30-012` / `TADD-2026-08-31-001`)

Same **seven** counters only:

1. persist-ok  
2. persist-fail  
3. death-penalty applied  
4. victory paid  
5. recap opened  
6. recap dismissed  
7. shop credit committed  

**Increment (shop credit):** only when `shouldCommitGameKeyRedeem` is true
(seeded lock **and** `#ok` granted > 0). Never `processPendingPurchases`,
World remount, request/approve/reject/email, unseeded `noteUnseededCredit`,
or a second `getCallerDokaBalance`.

Do not enqueue telemetry as a **second wallet write** on `progressPersistRef`.
Fire-and-forget after the persist function returns. Swallow sidecar errors.

GTAD Phase 1 extras (battle start / defeat / flee, Q-015 one-shot settle,
Q-016 absolute-write skip) remain **not** AQA-012. Persist helpers on `main`
are wallet safety, not increment maps (`TADD-2026-09-22-002`).

---

## 5. Requested metrics — support matrix

### 5.1 Game health

| Asked | Support | Honest substitute |
| :--- | :--- | :--- |
| Battle count | `UNSUPPORTED` | After AQA-012: **victory paid** = paid victories, not all battles. Do not use `killCount`. |
| Victory / defeat / flee | `UNSUPPORTED` | Victory paid only. Defeat/flee uncounted. |
| Average battle turns | `UNSUPPORTED` | Challenge `under_*_turns` is local. |
| Deaths | `UNSUPPORTED` | After AQA-012: **death-penalty applied** = penalty persist succeeded, not death cause. |
| Persistence failures | `LOCAL_ONLY` | After AQA-012: persist-ok vs persist-fail. |
| Abnormal termination | `UNSUPPORTED` | No crash / tab-close / mid-battle abandon event. |

### 5.2 Enemy health

| Asked | Support |
| :--- | :--- |
| Encounter frequency | `UNSUPPORTED` |
| Relative level | `UNSUPPORTED` — region `levelMin`/`levelMax` is catalog |
| Player win/loss vs enemy | `UNSUPPORTED` |
| Battle duration | `UNSUPPORTED` |
| Elite frequency | `UNSUPPORTED` — `elite_patrol` / formations are catalog-only; WX does not import `worldFeatures.ts` |
| Advanced AI usage | `UNSUPPORTED` — intents are `LOCAL_ONLY` |
| Enemy spell usage | `UNSUPPORTED` — `usableByEnemy` is catalog |

**No Enemy Health outcome charts.** Optional H10 catalog counts only.

### 5.3 Spell health

| Asked | Support | Honest substitute |
| :--- | :--- | :--- |
| Usage (casts) | `UNSUPPORTED` | None |
| Discovery | `UNSUPPORTED` | SDE observe→win is design-only. WX `ownedIds` is retirement gating, not persist. |
| Acquisition source | `UNSUPPORTED` | `spellLevelKeys` is `upgradeSpell` history, not first obtain. |
| Combinations | `UNSUPPORTED` | Weak proxy: equipped-together from `spellBarOrder` / `activeSpells` (`getAllCharacters` only). Label **loadout**. |
| Underused / overused | `UNSUPPORTED` for casts | Do not use those words. Upgrade-presence ≠ combat use. |
| Observed but rarely obtained | `UNSUPPORTED` | Nothing observes a spell without putting it in the library. |

Starter catalog remains 32.

### 5.4 Progression

| Asked | Support |
| :--- | :--- |
| Level distribution | `LIVE_SNAPSHOT` — occupied slots, `Character.level`. **No cap.** Open-ended histogram. Raise the last edge when `max(level)` exceeds it. |
| XP progression | `LIVE_SNAPSHOT` — leftover XP vs `100 * 2^(N-1)` (`xpCurve.ts`). HUD saturates at 48; that is a display limit, not a character cap. |
| Spell discovery | `UNSUPPORTED`. Upgrade coverage only (H3). |
| Achievement progression | `LIVE_SNAPSHOT` — OQL `achievementProgress` + configs. `unlockedAt` is a real timestamp. Four keys server-gated; combat feats client-reported (also fire on Boss Rush room-clear). `boss_defeated_*` is **not** persistable. |

### 5.5 Economy

| Asked | Support |
| :--- | :--- |
| Doka earned (aggregate) | `UNSUPPORTED` as a battle/loot ledger |
| Doka spent (aggregate) | `UNSUPPORTED` as a ledger |
| Major sources | **Code map** only. After AQA-012: **counts** of victory paid and shop credit committed — not amounts. GameKey **redeemed** `dokaAmount` sum is **paid mint**, not battle earn. |
| Major sinks | Architecture list. Death-penalty **count** after 012, not Doka removed. |

Writers (do not turn into a share pie): `applyRewards` (+, clamped); `claimAchievementReward` (+); `redeemGameKey` (+ paid mint); `adminGrantDoka` / `adminAddDoka*` (operator); `upgradeSpell` / `renameCharacter` (100) / `purchaseBuff` (−); `saveBattleStats` (absolute: heals, items, death 20/40). Dead: `calculateAndAwardDoka`, `processPendingPurchases` (both return 0).

`hintedEuroCents` is a **player-typed hint**, not processor settlement.

### 5.6 Bosses / dungeons

| Asked | Support |
| :--- | :--- |
| Attempts | `UNSUPPORTED` — reset does not increment attempts |
| Completion | Partial snapshot: Rush `highestRoomCompleted` (0–10), `totalBossRushRuns` (**master finishes occupying room 9**), `bossRushMasterComplete`. Dungeon `totalMapsCompleted` is cumulative maps, not “dungeon finished.” |
| Average attempts | `UNSUPPORTED` |
| Flee / abandonment | `UNSUPPORTED` |
| Relative difficulty | `UNSUPPORTED` — do not infer from `bestRewardMultiplier` or room reached (survivorship) |
| `BossConfig.defeated` | **Global admin flag.** Not “players who beat this boss.” |
| `boss_defeated_${bossId}` | **Not a funnel.** `knownAchievementCondition` cannot persist that string. |

### 5.7 Admin content health

| Asked | Support |
| :--- | :--- |
| Extremely low usage | Snapshot proxies only: spell never in any `spellLevelKeys` / bar **and** not a starter; achievement never unlocked; Rush all `highestRoomCompleted` 0. Enemies / modifiers / regions / ads: **no usage signal.** |
| Invalid configuration events | `UNSUPPORTED` — `AdminGuard` `#err` returns **before** `_recordAdminAudit` |
| Failed asset loads | `LOCAL_ONLY` (admin preview `onError`) |
| Pixel-fallback events | `LOCAL_ONLY` pattern-lookup-failed. **Not** custom-URL fallback. |
| Unused custom visual assets | Config: non-empty URL stored, **not rendered**. Empty URL = `NORMAL_DEFAULT`. |
| Stale dependencies | Repo inventory (`package.json`), not a Health series. |
| Recent admin mutations | **H14**: last-100 successful writes. Ops context, not player usage. |

### 5.8 Visual fallback (required distinction)

| Kind | Definition | Exists today? |
| :--- | :--- | :--- |
| `NORMAL_DEFAULT` | Entity is **meant** to use built-in pixels. `spriteUrl` / `frontUrl` empty. | Yes. Live world path. Admin copy still says “Active fallback.” |
| `STORED_NOT_RENDERED` | A custom URL is saved; World does not fetch it. | Yes, config hygiene. Not an error. Not a load event. |
| `CUSTOM_FALLBACK` | A custom visual **was configured** and **failed**, so default pixels were used. | **No metric.** World does not fetch custom URLs. |

**Do not treat as `CUSTOM_FALLBACK`:** empty URL; pattern-lookup-failed (`pieceArt.ts`); admin preview `onError`; “Active fallback” copy; “Stored URL — not rendered”; audit `deletePlayerSpriteConfig` `newSummary = "pixel-fallback"` (`main.mo` **859** — admin delete). VAL design approval of a resolver is **not** a Health series.

---

## 6. Filters

| Filter | Enable on | Disable / hide |
| :--- | :--- | :--- |
| Date / time period | H2 `unlockedAt`; H6 GameKey `timestamp`; H14 `timestampNs` (ring only); H12 after day-buckets exist | All other snapshots (“as-of-now”) |
| Relative player-level band | H1, H3, H4, H8/H9 if joined | Catalog-only; H14; H6 (no level on the request) |
| Enemy family | — | Hidden |
| Spell | H3, H4 | Cast-usage (none) |
| Boss | — | Hidden. Rush uses **room index** |
| Dungeon | H8 | Attempt/flee (none) |
| Content version | H11 | Gameplay events (not version-tagged) |

Level bands (not a cap): 1–4, 5–9, 10–19, 20–39, 40–79, 80+  
Raise the last edge when `max(level) > 80`. Never add “endgame / max level.”

---

## 7. Privacy

Owner Health is **aggregates only**.

Must not appear: principal text (`getAllCharacters`, OQL `owner`, leaderboard, audit `adminPrincipal`, GameKey `objectId`, **Settings `getBannedPrincipals`**, OQL `bannedPrincipals`); character/profile name; customer KYC; GameKey **email**, **redeemedBy**, plaintext **code**; chat `playerName`.

Do **not** mount `AdminGameKeyPurchases` or the Settings ban list inside Health.

`n < 5`: hide rates. Default is no row-level export.

H14 default columns: `action`, count. Config `objectId` allowed; principal-shaped `objectId` is not.  
H6 default columns: `status`, count, optional sum of `dokaAmount` for `redeemed` and `approved`. No email. No request id list.

---

## 8. Analytical honesty

1. Snapshot ≠ rate over time. Caption: **“As of query time.”**  
2. Correlation ≠ causation. Room 8 reached ≠ “room 8 is fair.” Redeemed GameKey Doka ≠ “shop is healthy because players like the game.”  
3. Always show **n**. Hide % when `n < 20` (rates) or `n < 5` (privacy).  
4. Survivorship: `bestRewardMultiplier` / `highestRoomCompleted` describe people who still have a record.  
5. Victory paid ≠ battles started. `killCount` unused → do not plot.  
6. H14 `n ≤ 100` is a ring, not lifetime volume. No composite health score.  
7. `hintedEuroCents` ≠ settled euros. `approved` GameKey Doka is issued-not-redeemed.  
8. Four achievement keys are server-gated; all other unlocks remain “client said unlocked.”  
9. `totalBossRushRuns` ≠ attempts.  
10. A design doc (SDE / VAL / GTAD Phase 1 extras / TBC 0-row reports) is not a collector.  
11. HUD XP saturation at 48 ≠ a level cap.  
12. Three unmerged TADD files on one SHA are **one** dashboard spec, not three widgets.

---

## 9. Views (decision-backed)

Placement: new **Health** tab on owner-only `AdminDashboard` (same
`isAdmin && onOpenAdmin` gate, carved-stone tokens). Dev-only. Do not
ship to normal players.

Implementer detail for H1–H14 cards: PR #345 §9. Caption deltas that
landed after 09-02 and still apply:

| View | Decision | Class |
| :--- | :--- | :--- |
| H1 Population / level | Occupied-slot histogram. **No cap.** Footnote: HUD leftover-XP bar saturates at 48. | `LIVE_SNAPSHOT` |
| H2 Achievement funnel | Unlock = client report except `level_10` / `doka_1000` / `doka_10000` / `spell_level_5`. Combat feats also fire on Boss Rush room-clear. `boss_defeated_*` is not persistable. | `LIVE_SNAPSHOT` |
| H3 Spell upgrade coverage | Upgrade persist + retirement gating. Not casts. Not SDE discovery. | `LIVE_SNAPSHOT` |
| H4 Loadout co-occurrence | Equipped-together from bar/active. `n ≥ 20`. Label **loadout**. | `LIVE_SNAPSHOT` |
| H5 Wallet distribution | Current Nat. Not earned/spent. Read next to H14 grants and H6 redeemed mint. | `LIVE_SNAPSHOT` |
| H6 GameKey funnel | Counts by status; optional redeemed / approved `dokaAmount` sums. Strip PII before setState. | `LIVE_SNAPSHOT` |
| H7 Source/sink map | Architecture list. Dead mint / dead credit return 0. | code map |
| H8 Dungeon snapshot | `chainDepth` / `totalMapsCompleted` / `bestRewardMultiplier`. Not attempts. Survivorship. | `LIVE_SNAPSHOT` |
| H9 Boss Rush snapshot | Histogram `highestRoomCompleted` 0–10. Scalar `totalBossRushRuns` = **master finishes occupying room 9**. Not attempts. Not `BossConfig.defeated`. | `LIVE_SNAPSHOT` |
| H10 Config hygiene | Empty URL = `NORMAL_DEFAULT`. Filled URL = `STORED_NOT_RENDERED`. Neither is `CUSTOM_FALLBACK`. | catalog |
| H11 Client version seen | `v163` vs `getAppVersion`. Not “played during vX.” | `LIVE_SNAPSHOT` |
| H12 Event strip | “Not shipped (AQA-012 / TADD-001).” Shop credit = `shouldCommitGameKeyRedeem`. No Q-015/Q-016 / battle-start zeros. | `APPROVED_EVENT` unbuilt |
| H13 Not measured | Battle starts, defeat, flee, turns, enemy series, casts, discovery, Doka ledger, boss attempts, abnormal termination, custom-fallback, SDE observe/owned, elite_patrol. | — |
| H14 Admin mutation ring | Counts by `action`. Drop principals. Caption: last 100 **successful** writes. Not “bindings missing.” | `LIVE_SNAPSHOT` unbuilt card |

Until the Health tab exists: do not mock a chart in another tab.

---

## 10. Layout (owner Health tab)

```
[ Health ]
  Period: [ 7d | 30d | all ]     <- H2, H6, H12 (when shipped), H14 (ring only)
  Level band: [ all | 1-4 | ... ]  <- H1, H3, H4, H8/H9 if joined
  Spell: [ all | id ]            <- H3, H4
  Version: [ all | v... ]          <- H11 only

  [ Game ]         H12 (or "not shipped") | H13
  [ Progression ]  H1 | H2
  [ Economy ]      H5 | H6 (GameKey status) | H7 | H14 (grant/approve context)
  [ Dungeon/Rush ] H8 | H9
  [ Spells ]       H3 | H4 (n>=20)
  [ Catalog ]      H10 | H11 | NORMAL_DEFAULT vs STORED_NOT_RENDERED counts
```

No Enemy Health outcome section. Hidden filters stay hidden.

---

## 11. Still refused

- Wiring `saveKillCount` as a battle chart.  
- Debug overlay / Battle Log `intent` as production telemetry.  
- `BossConfig.defeated`, `boss_defeated_*`, or empty `spriteUrl` as player outcomes.  
- Treating admin “pixel-fallback” / “Active fallback” / “Stored URL — not rendered” as `CUSTOM_FALLBACK`.  
- Charting SDE observe/owned, VAL resolver fails, `elite_patrol`, formations, TBC 0-row reports, or LHIPS as if live.  
- Pre-building GTAD Phase 1 extras (battle start/defeat/flee, Q-015, Q-016) as Health widgets.  
- Date-filtered earn/spend **share** charts before a ledger exists.  
- Charting `hintedEuroCents` as revenue or `processPendingPurchases` as shop volume.  
- Putting GameKey emails, codes, or banned principals on Health.  
- A composite health score.  
- Any Health cell with a principal, email, or proof URL.  
- Expanding AQA-012 without a new human-approved ID.  
- Hitchhiking telemetry maps onto a frozen EOP file (`20260831` / `20260901`).  
- Concatenating H1–H14 from #345 + #424 + this file into three UI copies.

---

## 12. Implementation order (no production code this run)

1. **TADD-2026-08-31-001 / AQA-012** — seven counters. Highest leverage. Shop credit = `shouldCommitGameKeyRedeem`. New maps need a later EOP file (TADD-2026-09-21-004).  
2. **TADD-2026-08-31-002** — Health tab H1–H11, H13 (read-only), with H6 GameKey aggregates and H9 master-finish caption. **One** card set.  
3. **TADD-2026-08-31-003** — aggregate query or OQL extension without PII.  
4. **TADD-2026-09-02-001** — H14 (bindgen already in `backend.ts`).  
5. H12 widgets only after counters are queryable.

Snapshot UI regression risk is low if read-only and aggregated before
setState. TADD-001 remains **medium** if it writes off the persist lock
or increments shop credit on the dead `processPendingPurchases` path.

---

## 13. Sample-size and confidence

| n | Rates | Histograms |
| :--- | :--- | :--- |
| 0 | “No rows” | Empty |
| 1–4 | Hide % ; privacy | Counts ok |
| 5–19 | Counts; hide % | Counts ok |
| ≥ 20 | % + optional Wilson 95% (H2 claim/unlock, H6 redeem/request, H12 fail rate) | Counts ok |

H14: never present ring counts as a weekly rate. Do not interpolate empty
level bins as historical zeros. Do not call H6 `redeemed/n` a conversion
rate when `n < 20`.

---

## 14. ACTION_IDs

Prior (still OPEN unless noted): `TADD-2026-08-31-001` … `007`;
`TADD-2026-09-01-001` (bindgen **done**, H14 card still open);
`TADD-2026-09-01-002` … `005`; `TADD-2026-09-02-001` … `006`
(`TADD-2026-09-02-002` shop-credit dual-path is **superseded** by
TADD-2026-09-21-001); `TADD-2026-09-21-001` … `006`;
`TADD-2026-09-22-001` … `002`.  
This run: [`ACTION_IDS_TADD_2026-09-23.md`](ACTION_IDS_TADD_2026-09-23.md).

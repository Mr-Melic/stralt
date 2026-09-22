# Owner telemetry dashboard — inventory refresh

**Author:** Telemetry Admin Dashboard Designer  
**Date:** 2026-09-22 (cron `0 */72 * * *`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior designs:** unmerged [PR #345](https://github.com/Mr-Melic/stralt/pull/345) (`TELEMETRY_DASHBOARD_2026-09-21.md`, same HEAD), [`TELEMETRY_DASHBOARD_2026-09-02.md`](TELEMETRY_DASHBOARD_2026-09-02.md) (HEAD `58302bc`), [`TELEMETRY_DASHBOARD_2026-09-01.md`](TELEMETRY_DASHBOARD_2026-09-01.md), [`TELEMETRY_DASHBOARD_2026-08-31.md`](TELEMETRY_DASHBOARD_2026-08-31.md)  
**Architecture (still design-only on `main`):** [`TELEMETRY_ARCHITECTURE_2026-09-02.md`](TELEMETRY_ARCHITECTURE_2026-09-02.md). Queued draft: [PR #352](https://github.com/Mr-Melic/stralt/pull/352) (`TELEMETRY_ARCHITECTURE_2026-09-21.md`).  
**Gameplay / production code:** not modified this run.

This is a **support-matrix refresh**, not a new collector set. `origin/main`
has **not moved** since the 2026-09-21 designer pass. Views H1–H14 stay.
The class-relevant finding this run is **process**: a same-hour swarm of
sibling design PRs must not be treated as live Health sources, and GTAD
Phase 1 extras in #352 must not pre-build widgets beyond AQA-012.

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

`origin/main` SHA is still `0f5363f`. Re-verified line citations from PR
#345 still match this tree. Do not treat that as “new measurements
arrived.”

---

## 1. What changed since 2026-09-21 (and what did not)

Inspected against PR #345 (draft, same base `0f5363f`) and against
`origin/main`. **No gameplay event store landed.** No later commit exists
on `main`.

| Topic | 2026-09-21 (`0f5363f` / #345) | 2026-09-22 (same HEAD) | Dashboard impact |
| :--- | :--- | :--- | :--- |
| Product APIs | Seven AQA-012 counters absent; no Health tab | **Unchanged.** `recordTelemetry` / `telemetrySidecar` / `adminGetTelemetry` / `telemetryLifetime`: **0** product hits | H12 stays “not shipped.” Do not draw zeros. |
| Health tab | No `tab: "health"` | Still config CRUD only (`gameTypes.ts` **482–498**; `AdminDashboard.tsx` **5606–5626**) | TADD-002 still open. |
| Shop-credit increment site | `shouldCommitGameKeyRedeem(seeded, granted)` (`shopPurchase.ts` **275–328**) | Still the only live commit predicate | H12 shop credit unchanged. |
| `processPendingPurchases` | Always 0 (`main.mo` **1338–1348**); World remount still calls it (`WorldExploration.tsx` **1494–1497**) | Unchanged | Do not chart remounts. |
| Boss Rush `totalBossRushRuns` | Master finishes occupying room 9 (`adminGuard.mo` **696–700**; `main.mo` **3347–3351**) | Unchanged | H9 caption stands. |
| Victory feats | Client-trusted list on `handleBattleEnd` **and** room-clear (`WorldExploration.tsx` **12483–12497**, **12902–12916**). `boss_defeated_*` not in `knownAchievementCondition` (**515–530**) | Unchanged (both call sites re-read) | H2 caption stands. |
| Spell discovery persist | No `ownedSpellIds` / `observedSpellIds` on `Character` (`main.mo` **122–145**). WX `ownedIds` is a **local Set** for retirement gating (`WorldExploration.tsx` **2421–2433**; `adminSafety.ts` **711–718**) | Unchanged. Local `ownedSpellIds` is **not** a persist map. | Keep H3 as upgrade coverage. |
| GameKey EOP | Frozen tail `20260901_000000`; `check-limit = 5` (`mops.toml` **33**) | Unchanged | New telemetry maps = **later** file after `20260901`. |
| Identifiable dumps | Settings `getBannedPrincipals` (`AdminDashboard.tsx` **5426 / 5466 / 7080–7100**); OQL `bannedPrincipals` (`main.mo` **3798–3806**) | Unchanged | Health must not mount either. |
| `getAdminAuditLog` | Bound (`backend.ts` **839–845**, **2435–2453**; `main.mo` **3486–3491**). AdminDashboard mention is a **comment** only (**4232**) | Unchanged | H14 still unbuilt. |
| Custom world visuals | 0 `spriteUrl` / `drawImage` hits in `WorldExploration.tsx`. VAL resolver absent | Unchanged | Empty URL and stored URL are **not** `CUSTOM_FALLBACK`. |
| Formations / elite / world features | WX does **not** import `engine/worldFeatures.ts`. `elite_patrol` is not live | Unchanged | No elite-frequency chart. |
| `saveKillCount` | Hook only (`useLeaderboardQueries.ts` **43–50**); **0** TSX callers | Unchanged | Still not battle count. |
| `APP_VERSION` | `v163` (`App.tsx` **14**) | Unchanged | H11 unchanged. |
| Starter catalog | 32 (`longHorizonSim.test.ts` **66**) | Unchanged | H3 caption. |
| Queued sibling design PRs | #345 listed only older drafts **#327** / **#331** | **#333–#380+** opened the same hour (TBC, GTAD, SDE, VAL, formations, AI, LHIPS, …). None are on `main`. | **New process trap.** TADD-2026-09-22-001. |
| GTAD Phase 1 extras | #345 treated Phase 0/1 as design-only | Unmerged #352 Phase 1 also names battles started / defeat / flee, one-shot settle (Q-015), absolute-write skip (Q-016) | **Do not pre-build those widgets.** Not AQA-012. TADD-2026-09-22-002. |

`longHorizonSim` is **not** a Health data source.

### 1.1 Sibling PRs that are not collectors

These drafts exist. They do **not** change `origin/main` APIs. Health must
not read them as `LIVE_SNAPSHOT` or `APPROVED_EVENT`.

| Open PR | Kind | Health rule |
| :--- | :--- | :--- |
| #333 TBC 2026-09-21 | `WAITING_FOR_TELEMETRY`, 0 rows | Do not paint those zeros. |
| #345 TADD 2026-09-21 | Prior matrix, same HEAD | Same H1–H14. This file is the 24-hour reconfirm. |
| #352 GTAD 2026-09-21 | Architecture + Phase 1 extras | Implement AQA-012 seven counters only until a human expands 012. |
| #355 VAL 2026-09-21 | Visual library design | No custom-URL loader. No `CUSTOM_FALLBACK` series. |
| #371 SDE 2026-09-21 | Observe→win design | No `observedSpellIds` / `ownedSpellIds` persist. |
| #348 / #349 / #351 | Formations / elites / AI docs | No encounter, elite, or archetype usage charts. |
| #357 LHIPS 2026-09-21 | Synthetic progression | `telemetry.available` stays false. |

---

## 2. Why this is still not a vanity dashboard

The 2026-08-30 Quality Auditor found no player telemetry. That is still
true on `0f5363f`. Persist-fail strings remain local logs only
(`WorldExploration.tsx` **12614**, **12866**). Debug ring is local
(`debug/debugLogger.ts` **44**, **110–111**, cap 2000).

**Rule:** if the class is not `LIVE_SNAPSHOT` or `APPROVED_EVENT`, do not
draw the panel. Show “not measured,” never a zero that looks like “zero
battles.”

Correlation is not causation. Show **n**. No composite “health score.”
There is **no level cap** — do not design endgame chrome. HUD leftover-XP
saturation at level 48 (`longHorizonSim.test.ts` **68**) is a **display**
limit, not a character cap.

---

## 3. Data classes (do not mix)

| Class | Meaning | Owner-aggregatable? |
| :--- | :--- | :--- |
| `LIVE_SNAPSHOT` | Current canister maps / configs. No history unless the row has a timestamp. | Yes, admin/controller, **aggregated before paint**. |
| `APPROVED_EVENT` | AQA-012 **seven** counters. Not implemented. | Yes, **after** that ID ships. |
| `QUEUED_DESIGN` | Unmerged sibling docs (GTAD Phase 0/1 extras, SDE maps, VAL loader). | **No.** Not a Health source until the writer exists **and** a human ID approves the series. |
| `LOCAL_ONLY` | Debug ring / admin `<img onError>`. | **No.** |
| `UNSUPPORTED` | Requested, no persist, not approved as a live collector. | **No.** Do not design a chart. |

`CANISTER_UNBOUND` is **empty** this run for Health sources.

`getLeaderboard` is public and returns `principalId` + `playerName`. Do
not use it on Health. AdminDashboard does not call it today.

---

## 4. Inventory — what actually exists now

### 4.1 Admin / player canister APIs

| Source | Gate | Fields that matter | Class |
| :--- | :--- | :--- | :--- |
| `getAllCharacters()` (`main.mo` **532–536**) | `#admin` | Full `Character`: `level`, `experience`, `stats.killCount`, `spellLevelKeys` / `spellLevelValues`, `spellBarOrder`, `activeSpells`, `bossRushMasterComplete`, `name`, `pieceType` | `LIVE_SNAPSHOT` |
| `getLeaderboard()` (`main.mo` **3390**) | public | Best-slot level, killCount, claimed-achievement count, **principal + name** | Do not use on Health |
| `saveKillCount` (`main.mo` **3078+**) | caller | Additive `killCount`, max +64 | Hook exists; **no UI caller** |
| `dokaBalances` via `adminGetDoka` / OQL | `#admin` / OQL | Current wallet Nat | `LIVE_SNAPSHOT` (no earn/spend journal) |
| `getPlayerAchievements` | caller == player | One player’s rows | Not an owner dump |
| `adminListGameKeyRequests` (`main.mo` **1539–1543**) | `#admin` | `status`, `dokaAmount`, `timestamp`, `hintedEuroCents`, **plus email, userPrincipal, redeemedBy** | Snapshot + **PII**. Health may use **status / dokaAmount / timestamp only**, aggregated before `setState`. |
| `adminGetPurchaseRecords` | `#admin` | Legacy KYC rows. `initiatePurchase` still errors. | **Stale path.** Do not chart as live shop mint. |
| `getDungeonRecord` | caller == principal | `chainDepth`, `totalMapsCompleted`, `bestRewardMultiplier` | Per-player; owner dump via OQL |
| `getBossRushState` | caller == userId else `(0,0,0)` | `currentRoom`, `highestRoomCompleted`, `totalBossRushRuns` | Per-player; owner dump via OQL. `totalBossRushRuns` = **master finishes occupying room 9**, not attempts. |
| `getAppVersion` (`main.mo` **2306**) / `APP_VERSION` | public / client | Content version string (`v163`) | Catalog, not event-tagged |
| Config CRUD | mostly public read | Templates, URLs, `minLevel`, `usableByEnemy` / `usableByPlayer` | Catalog inventory |
| `getAdminAuditLog()` (`main.mo` **3486–3491**) | `#admin` | Last 100 `{adminPrincipal, timestampNs, action, objectId, previousSummary, newSummary}` | `LIVE_SNAPSHOT` ring. Official bindgen present. Still unused by AdminDashboard. |
| `getBannedPrincipals()` (`main.mo` **1312–1320**) | `#admin` | Principal list | Settings ops UI. **Not Health.** |
| `calculateAndAwardDoka` (`main.mo` **3073–3076**) | public | **Always 0** | Not a source. Do not chart. |
| `processPendingPurchases` (`main.mo` **1338–1348**) | caller | **Always 0** | Not a source. |
| `redeemGameKey` (`main.mo` **1469+**) | caller | Credits `dokaAmount` from ledger; returns Nat | Live paid-Doka writer. Owner aggregate of redemptions = GameKey request `status=redeemed` only. |
| `adminGetProgressionSnapshot` / increment maps | — | Named only in queued GTAD docs | `QUEUED_DESIGN`. Not on this actor. |

`AdminDashboardState.tab` is still enemies, regions, sprites, visuals,
spells, settings, tiers, modifiers, purchases, achievements, names,
bosses, ads, shop, bossRush. Purchases tab is `AdminGameKeyPurchases`
(fulfillment: email, reveal code). Settings now lists banned principals.
No Health. Frontend `execute` exists only as the bindgen wrapper
(`backend.ts` **2393–2403**) — AdminDashboard does not call OQL.

`gameKeyLedger` / `gameKeyReveals` are **not** queryable for Health.
Plaintext GameKeys must never appear on Health.

### 4.2 OQL (`main.mo` **3493+**)

| Entity | Useful payloads | Missing vs Health / PII |
| :--- | :--- | :--- |
| `characterSlots` | name, pieceType, level, experience, hp, killCount | **No** spell keys, bar, `bossRushMasterComplete` |
| `dokaBalances` | owner, balance | No ledger |
| `userProfiles` | owner, **name** | PII |
| `changelogShownVersions` | owner, version | Not “played during vX” |
| `dungeonRecords` | chainDepth, totalMapsCompleted, bestRewardMultiplier | No attempts / flee / time |
| `achievementProgress` | achievementId, unlocked, unlockedAt, claimed, **principalId** | Drop principal before paint |
| `purchaseRecords` | dokaAmount, packageId, timestamp, status + customer columns | **Legacy.** Also customer name/email/city/country |
| `gameKeyRequests` | status, dokaAmount, timestamp, hintedEuroCents | Also **email**, **userPrincipal** (`main.mo` **3788–3793**). Drop those. Not a GameKey. |
| `bossRushStates` | currentRoom, highestRoomCompleted, totalBossRushRuns | Key is `principal#slot` |
| `bannedPrincipals` | principalText | Ops only. Never Health. |
| catalog entities | templates + URL strings | Config, not load outcomes |
| `buffInventories` | itemCount, totalQuantity | Omit unless a later human asks |
| `adminAuditLog` | **Not an OQL entity** | Use `getAdminAuditLog` only |
| `gameKeyLedger` / `gameKeyReveals` | **Not OQL** | Keep it that way |

### 4.3 Client-only (not owner telemetry)

| Signal | Where | Why not Health |
| :--- | :--- | :--- |
| Debug ring | `debug/debugLogger.ts` **44**, **110–111** | Local, 2000 lines |
| “Reward persistence failed (non-blocking)” | `WorldExploration.tsx` **12614** | `logDebugInfo` only |
| “BossRush reward persist failed” | same file **12866** | `logDebugError` only |
| Pattern lookup failed → `king.front` | `pieceArt.ts` **27–44**, **645**, **822**, **876–1010** | Local; **pieceType/palette miss**, not custom-URL fail |
| Admin sprite `<img onError>` | `AdminDashboard.tsx` **1508–1510** | Hides preview; no counter |
| Empty-URL sprite preview copy | `DEFAULT_PIXEL_VISUAL_STATUS` in `adminVisualStatus.ts` **10–11** | **NORMAL_DEFAULT**. The word “fallback” is a label trap. |
| Filled-URL chip | `STORED_URL_NOT_RENDERED_*` (`adminVisualStatus.ts` **13–15**) | Catalog storage. World ignores the URL. **Not** `CUSTOM_FALLBACK`. |
| `useSaveKillCount` | `useLeaderboardQueries.ts` **43–50** | Zero TSX callers |
| Recap open/close | `PostBattleRecap` | Local UI |
| `longHorizonSim.telemetry` | `available: false` | Synthetic; not live play |
| World remount `creditPendingPurchasesThroughPersist` | `WorldExploration.tsx` **1494–1497** | Hits a writer that returns 0 |
| Enemy `action.intent` | WX **16442–16446** empty block | No emit. Do not scrape Battle Log text. |
| Settings banned-principal list | `AdminDashboard.tsx` **7080+** | Identifiable ops. Not Health. |
| WX local `ownedIds` | **2421–2433** | Retirement gating. Not discovery persist. |
| `settleOneShotAfterCredit` / `shouldSkipAbsoluteDokaWrite` | persist helpers | Live **wallet** safety. No increment maps. Not Q-015/Q-016 Health series until those counters exist. |

### 4.4 Approved but not shipped (`AQA-2026-08-30-012` / `TADD-2026-08-31-001`)

Same **seven** counters only:

1. persist-ok  
2. persist-fail  
3. death-penalty applied  
4. victory paid  
5. recap opened  
6. recap dismissed  
7. shop credit committed  

Until these exist, Game Health event panels stay empty. Do not fill them
from `killCount`, debug logs, recap state, `calculateAndAwardDoka`,
`processPendingPurchases`, one-shot settle enums, or absolute-write skips.

**Increment placement (still valid on this HEAD):**

| Counter | Increment when | Do not increment |
| :--- | :--- | :--- |
| `persist_ok` / `persist_fail` | Official persist fn returns `#ok` / `#err` or transport throw **after** enqueue | Optimistic UI; user cancel |
| `death_penalty_applied` | `persistDeathPenalty` **write succeeds** (20% XP / 40% Doka + `respawnHpAfterDeath`) | Death Realm timer; HP restore alone; a refused leftover persist |
| `victory_paid` | `resolveBattleRewards` → `applyRewards` `#ok` for a battle recap, **once** | Portal +10 XP; Boss Rush room (unless a human expands 012); `shouldAwardVictory` refuse; double-credit leftover |
| `recap_opened` / `recap_dismissed` | Root recap mount / `onClose` | Crash unmount |
| `shop_credit_committed` | `redeemGameKeyThroughPersist` **commits**: seeded lock **and** `#ok` granted > 0 (`shouldCommitGameKeyRedeem`) | `requestGameKeyPurchase`; `adminApproveGameKeyPurchase`; `processPendingPurchases` (always 0); World remount credit; failed / already-used key; unseeded lock (`noteUnseededCredit` path); a second `getCallerDokaBalance` |

Do not enqueue telemetry on `progressPersistRef` as a **second wallet
write**. Fire-and-forget after the persist function returns. Swallow
sidecar errors. Missing bindgen method = no-op.

GTAD Phase 0 snapshot queries (`adminGetProgressionSnapshot`) and Phase 1
maps remain **design-only** (09-02 on `main`; 09-21 in #352). They are
**not** live data. Phase 1 extras in #352 (battle start / defeat / flee,
Q-015 one-shot settle, Q-016 absolute-write skip) are **not** AQA-012.
Do not add H15/H16 for them.

---

## 5. Requested metrics — support matrix

### 5.1 Game health

| Asked | Support | Honest substitute |
| :--- | :--- | :--- |
| Battle count | `UNSUPPORTED` | After AQA-012: **victory paid** = paid victories, not all battles. Do not use `killCount`. Do not use #352’s proposed “battles started” until that ID is human-approved **and** shipped. |
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
| Elite frequency | `UNSUPPORTED` — `elite_patrol` / formations are catalog-only; no `isElite` on live units |
| Advanced AI usage | `UNSUPPORTED` — `EnemyArchetype` (`enemyAI.ts` **86–93**) and `intent` strings are `LOCAL_ONLY` |
| Enemy spell usage | `UNSUPPORTED` — `usableByEnemy` is catalog |

**No Enemy Health outcome charts.** Optional H10 catalog counts only.

### 5.3 Spell health

| Asked | Support | Honest substitute |
| :--- | :--- | :--- |
| Usage (casts) | `UNSUPPORTED` | None. `playSound("spell_cast")` is audio, not a collector. |
| Discovery | `UNSUPPORTED` | SDE observe→win is **design-only** (PR #300 on `main`; Wave-4 docs in #371). No persist `ownedSpellIds` / `observedSpellIds`. WX `ownedSpells` = starters ∪ **player-usable** catalog ∪ persisted keys/bar. That is retirement gating, not discovery. |
| Acquisition source | `UNSUPPORTED` | `spellLevelKeys` is `upgradeSpell` history, not first obtain. Do not invent `starter\|catalog\|drop` series. |
| Combinations | `UNSUPPORTED` | Weak proxy: equipped-together from `spellBarOrder` / `activeSpells` (`getAllCharacters` only). Label **loadout**. |
| Underused / overused | `UNSUPPORTED` for casts | Do not use those words. Upgrade-presence ≠ combat use. |
| Observed but rarely obtained | `UNSUPPORTED` | Nothing observes a spell without putting it in the library. |

Starter catalog remains 32.

### 5.4 Progression

| Asked | Support |
| :--- | :--- |
| Level distribution | `LIVE_SNAPSHOT` — occupied slots, `Character.level`. **No cap.** Open-ended histogram. Raise the last edge when `max(level)` exceeds it. |
| XP progression | `LIVE_SNAPSHOT` — leftover XP vs `100 * 2^(N-1)` (`xpCurve.ts`). HUD saturates at level 48 (`MAX_SAFE_INTEGER`); that is a display limit, not a character cap. Not “to cap.” |
| Spell discovery | `UNSUPPORTED`. Upgrade coverage only (H3). |
| Achievement progression | `LIVE_SNAPSHOT` — OQL `achievementProgress` + configs. `unlockedAt` is a real timestamp. Retired configs cannot newly unlock. Four wallet/level/spell-level keys are **server-gated**; unknown conditions are also rejected (`achievementUnlockRejected`, `adminGuard.mo` **677–694**). Combat feats remain client-reported and also fire on Boss Rush room-clear. `boss_defeated_*` is **not** a persistable condition. |

### 5.5 Economy

| Asked | Support |
| :--- | :--- |
| Doka earned (aggregate) | `UNSUPPORTED` as a battle/loot ledger |
| Doka spent (aggregate) | `UNSUPPORTED` as a ledger |
| Major sources | **Code map** only. After AQA-012: **counts** of victory paid and shop credit committed — not amounts. GameKey **redeemed** `dokaAmount` sum is a snapshot of **paid mint**, not battle earn. |
| Major sinks | Architecture list. Death-penalty **count** after 012, not Doka removed. |

Writers (do not turn into a share pie):

| Direction | Writer | Note |
| :--- | :--- | :--- |
| + | `applyRewards` | Official credits; client clamps to 100_000 Doka / 500_000 XP per call |
| + | `claimAchievementReward` | Feat claim |
| + | `redeemGameKey` | Paid mint after admin approve. Live path. |
| + | `adminGrantDoka` / `adminAddDoka*` | Operator — H14 action counts can flag grant bursts |
| − / absolute | `upgradeSpell`, `renameCharacter` (100), `purchaseBuff` | Sinks |
| absolute | `saveBattleStats` | Heals, item-shop, death 20% XP / 40% Doka |
| none | `calculateAndAwardDoka` | **Dead mint** (returns 0). Not a source. |
| none | `processPendingPurchases` | **Dead credit** (returns 0). Not a source. |

`hintedEuroCents` is a **player-typed hint**, not processor settlement.
Do not chart it as revenue.

One-shot ground / shrine / dungeon-complete credits are **wallet
safety**, not an earn ledger. Do not chart `settleOneShotAfterCredit`
outcomes until a human-approved counter exists.

### 5.6 Bosses / dungeons

| Asked | Support |
| :--- | :--- |
| Attempts | `UNSUPPORTED` — `resetBossRush` / `resetDungeonChain` do not increment attempts |
| Completion | Partial snapshot: Rush `highestRoomCompleted` (0–10), `totalBossRushRuns` (**master finishes occupying room 9**), `bossRushMasterComplete`. Dungeon `totalMapsCompleted` is cumulative maps, not “dungeon finished.” |
| Average attempts | `UNSUPPORTED` |
| Flee / abandonment | `UNSUPPORTED` |
| Relative difficulty | `UNSUPPORTED` — do not infer from `bestRewardMultiplier` or room reached (survivorship) |
| `BossConfig.defeated` | **Global admin flag.** Not “players who beat this boss.” |
| `boss_defeated_${bossId}` client condition | **Not a funnel.** `knownAchievementCondition` cannot persist that string. |

### 5.7 Admin content health

| Asked | Support |
| :--- | :--- |
| Extremely low usage | Snapshot proxies only: spell never in any `spellLevelKeys` / bar **and** not a starter; achievement never unlocked; Rush all `highestRoomCompleted` 0; GameKey **package catalog unused** (Purchases UI is GameKey, not `ShopPackage` rows). Enemies / modifiers / regions / ads: **no usage signal.** |
| Invalid configuration events | `UNSUPPORTED` — `AdminGuard` `#err` returns **before** `_recordAdminAudit` |
| Failed asset loads | `LOCAL_ONLY` (admin preview `onError`) |
| Pixel-fallback events | `LOCAL_ONLY` pattern-lookup-failed. **Not** custom-URL fallback. |
| Unused custom visual assets | Config: non-empty `spriteUrl` / `*Url` stored, **not rendered**. Empty URL = `NORMAL_DEFAULT`. |
| Stale dependencies | Repo inventory (`package.json`), not a Health series. |
| Recent admin mutations | **H14**: last-100 successful writes, including GameKey approve/reject/emailed. Ops context for H2/H3/H5/H6, not player usage. |

### 5.8 Visual fallback (required distinction)

| Kind | Definition | Exists today? |
| :--- | :--- | :--- |
| `NORMAL_DEFAULT` | Entity is **meant** to use built-in pixels. `spriteUrl` / `frontUrl` empty. | Yes. This is the live world path. Admin empty-state copy still says “Active fallback.” |
| `STORED_NOT_RENDERED` | A custom URL is saved on the catalog row; World does not fetch it. | Yes, as **config hygiene** (`spriteUrlIsStored`). Not an error. Not a load event. |
| `CUSTOM_FALLBACK` | A custom visual **was configured** and **failed**, so default pixels were used. | **No metric.** World does not fetch custom URLs. VAL-001/011 resolver is unbuilt (#355 is design-only). |

**Do not treat as `CUSTOM_FALLBACK`:**

1. Empty URL / empty tuple (`adminVisualStatus.test.ts`; `adminContract.test.ts`).  
2. Pattern-lookup-failed (`pieceArt.ts` **27–44**, **645**, **822**, **876–1010**) — missing `pieceType`/palette.  
3. Admin preview `onError` (`AdminDashboard.tsx` **1508–1510**).  
4. Sprite preview copy “Default Pixel Visual — **Active fallback**” when URL is empty. That is `NORMAL_DEFAULT`.  
5. Chip “Stored URL — not rendered” when URL is set. That is unused catalog storage.  
6. Audit `deletePlayerSpriteConfig` with `newSummary = "pixel-fallback"` (`main.mo` **859**). That is an **admin delete** of a sprite config, not a runtime load fail.

A future custom-URL loader may emit `CUSTOM_FALLBACK` only when `url != ""`
and load/decode fails. That event is **not** approved (TADD-006 / 09-01-002 /
09-02-005). VAL design approval of a resolver is **not** a Health series.

---

## 6. Filters

| Filter | Enable on | Disable / hide |
| :--- | :--- | :--- |
| Date / time period | H2 `unlockedAt`; **H6 GameKey `timestamp`**; **H14 `timestampNs`** (ring only); H12 after day-buckets exist | All other snapshots (“as-of-now”) |
| Relative player-level band | H1, H3, H4, H8/H9 if joined | Catalog-only; H14; H6 (no level on the request) |
| Enemy family | — | Hidden |
| Spell | H3, H4 | Cast-usage (none) |
| Boss | — | Hidden. Rush uses **room index** |
| Dungeon | H8 | Attempt/flee (none) |
| Content version | H11 | Gameplay events (not version-tagged) |

Level bands (not a cap): 1–4, 5–9, 10–19, 20–39, 40–79, 80+  
Raise the last edge when `max(level) > 80`. Never add “endgame / max level.”
HUD XP bar saturating at level 48 is **not** a progression cap.

---

## 7. Privacy

Owner Health is **aggregates only**.

| Must not appear on Health | Why it exists elsewhere |
| :--- | :--- |
| Principal text | `getAllCharacters`, OQL `owner`, `getLeaderboard`, **audit `adminPrincipal`**, audit `objectId` on grant/ban/role/**GameKey** actions (`approveGameKey` / `rejectGameKey` / `markGameKeyEmailed` store `userPrincipal.toText()` at `main.mo` **1596 / 1618 / 1649**), **Settings `getBannedPrincipals`**, OQL `bannedPrincipals` |
| Character / profile name | Character, `userProfiles`, leaderboard |
| Customer name, email, address, city, country, postal, proof URL | Legacy Purchases records |
| GameKey **email**, **redeemedBy**, plaintext **code** | `AdminGameKeyPurchases` fulfillment; `gameKeyReveals` |
| Chat `playerName` / Battle Log `intent` | Irrelevant here |

Do **not** mount `AdminGameKeyPurchases` or the Settings ban list inside
Health.

`n < 5`: hide rates. HMAC principal only if a human later requires a debug
export; default is no row-level export.

H14 default columns: `action`, count. Config `objectId` (spell/enemy/boss
ids) is allowed. Principal-shaped `objectId` is not.

H6 default columns: `status`, count, optional sum of `dokaAmount` for
`redeemed` and for `approved` (outstanding). No email column. No request id
list.

---

## 8. Analytical honesty

1. Snapshot ≠ rate over time. Caption: **“As of query time.”**  
2. Correlation ≠ causation. Room 8 reached ≠ “room 8 is fair.” Redeemed
   GameKey Doka ≠ “shop is healthy because players like the game.”  
3. Always show **n**.  
4. Hide % when `n < 20` (rates) or `n < 5` (privacy).  
5. Survivorship: `bestRewardMultiplier` / `highestRoomCompleted` describe people who still have a record.  
6. Victory paid ≠ battles started.  
7. `killCount` unused → do not plot.  
8. H14 `n ≤ 100` is a ring, not lifetime volume.  
9. No composite health score.  
10. Admin grant burst (H14) **beside** a fat wallet (H5) does not prove the wallet is only grants.  
11. `hintedEuroCents` ≠ settled euros.  
12. `approved` GameKey Doka is **issued not yet redeemed**, not revenue and not wallet credit.  
13. Four achievement condition keys are server-gated; all other unlocks remain “client said unlocked.”  
14. `totalBossRushRuns` ≠ attempts. Repeat `complete(9)` no longer inflates it.  
15. A design doc or **open sibling PR** (SDE / VAL / GTAD Phase 2 / formations) is not a collector.  
16. HUD XP saturation at 48 ≠ a level cap.  
17. `settleOneShotAfterCredit` keep/commit/release is wallet safety, not an earn series.  
18. Local WX `ownedSpellIds` ≠ SDE owned persist.

---

## 9. Views (decision-backed)

Placement: new **Health** tab on owner-only `AdminDashboard` (same
`isAdmin && onOpenAdmin` gate, carved-stone tokens). Dev-only. Do not
ship to normal players.

Each card: **title**, **decision**, **data class**, **query**, **viz**,
**empty / not-measured state**, **n**.

### H1 — Population and level (Progression)

- **Decision:** Is anyone actually playing, and is the population stuck in a
  band? Should starter regions / XP curve get attention?  
- **Class:** `LIVE_SNAPSHOT`  
- **Query:** `getAllCharacters` (preferred) or OQL `characterSlots`.
  Aggregate **before** `setState`. Drop principals and names.  
- **Viz:** Occupied slots / principals with ≥1 slot (two numbers).
  Open-ended level histogram. Leftover XP as fraction of
  `xpForNextLevel(level)`.  
- **Not:** a max-level trophy wall; “endgame” band.  
- **Caption:** As of now. Empty slots omitted. `n` = occupied slots.
  Footnote: HUD leftover-XP bar saturates at 48; characters still level.

### H2 — Achievement funnel (Progression)

- **Decision:** Which feats never unlock or never get claimed (reward too
  obscure vs condition never reachable)?  
- **Class:** `LIVE_SNAPSHOT`  
- **Query:** OQL `achievementProgress` + `getAchievementConfigs`. Drop
  `principalId`.  
- **Viz:** Table: achievement id, active flag, unlocks, claims, claim/unlock
  ratio. Date filter on `unlockedAt` only. Hide % when n < 20.  
- **Honesty:** Unlock is client `markAchievementUnlocked` **except**
  `level_10` / `doka_1000` / `doka_10000` / `spell_level_5` (and unknown
  strings), which `achievementUnlockRejected` can refuse. Combat feats
  also fire on Boss Rush room-clear. `boss_defeated_${id}` is not
  persistable. Retired configs cannot newly unlock.  
- **n** = distinct principals who have **any** progress row (count only),
  plus per-row unlock n.

### H3 — Spell upgrade coverage (Spell health — proxy only)

- **Decision:** Which catalog spells have **never been upgraded** (dead
  upgrade UX / dead catalog row)? Which have high levels (Doka sink
  concentration)?  
- **Class:** `LIVE_SNAPSHOT`  
- **Query:** `getAllCharacters` (`spellLevelKeys` / values) + `getSpellConfigs`
  + client starter ids. OQL alone is insufficient today.  
- **Viz:** Table: spell id, `minLevel`, `usableByPlayer`, characters with
  key present, median / max upgrade level. Filter by spell id and player
  level band.  
- **Caption:** “Upgrade persist only. Not casts. Not SDE discovery. Starter
  + **usable** catalog may appear with no key. Retired
  (`usableByPlayer === false`) appears only if a key/bar already exists.”  
- **Do not** label “underused” / “overused” / “observed but not obtained.”

### H4 — Equipped loadout co-occurrence (optional, Spell)

- **Decision:** Are players parking one 8-spell bar (e.g. all starters)?  
- **Class:** `LIVE_SNAPSHOT`  
- **Query:** `spellBarOrder` / `activeSpells` from `getAllCharacters`.  
- **Viz:** Pair counts for ids appearing on the same bar. Require `n ≥ 20`
  bars before showing pairs.  
- **Caption:** Equipped snapshot, not combat combinations.

### H5 — Wallet distribution (Economy)

- **Decision:** Is the live economy a handful of huge wallets (admin grants /
  GameKey mint) vs empty official-client wallets?  
- **Class:** `LIVE_SNAPSHOT`  
- **Query:** OQL `dokaBalances`. Drop `owner`.  
- **Viz:** Histogram of **current** balance (log bins). `n` = principals
  with a map entry (count only). Missing key ≠ proven zero.  
- **Do not** title this “Doka earned” or “Doka spent.” Read next to H14
  grant actions and H6 redeemed mint.

### H6 — GameKey funnel (Economy)

- **Decision:** How many paid-Doka requests are waiting, approved-unredeemed
  (ops backlog / outstanding keys), redeemed (actual mint), or rejected?  
- **Class:** `LIVE_SNAPSHOT`  
- **Query:** `adminListGameKeyRequests` **or** OQL `gameKeyRequests`.
  Strip `email`, `userPrincipal`, `redeemedBy` **before** React state.
  Never call `adminReveal` / ledger APIs from Health.  
- **Viz:** Counts by `status`. Optional sums: `dokaAmount` where
  `status=redeemed` (minted); `dokaAmount` where `status=approved`
  (issued, not yet in a wallet). Period filter on `timestamp`.  
- **n** = request rows after filter. Caption: “GameKey requests as of
  query time. `dokaAmount` is 0 until approve. Hinted euros are not
  settlement. Not battle earn. Not conversion unless n ≥ 20.”  
- **Forbidden:** email; principal; GameKey code; `hintedEuroCents` as
  revenue; mixing leftover `purchaseRecords` into the same bars without
  a “legacy KYC, writer disabled” caption.  
- **Not:** IAP package mix; `shop_credit_committed` (that is H12 after
  AQA-012).

### H7 — Architecture source/sink map (Economy, static)

- **Decision:** When reading H5/H6, which writers exist so the owner does
  not invent a fourth wallet path?  
- **Class:** Documentation (section 5.5).  
- **Viz:** Static table. No numeric shares. Mark dead mint / dead credit
  as returning 0.

### H8 — Dungeon chain snapshot (Bosses / dungeons)

- **Decision:** Is anyone in a chain, and how deep are live chains?  
- **Class:** `LIVE_SNAPSHOT`  
- **Query:** OQL `dungeonRecords`. Drop `owner`.  
- **Viz:** Histogram of `chainDepth` (0 = not in chain); histogram of
  `totalMapsCompleted`; `bestRewardMultiplier` as a distribution with
  survivorship caption.  
- **Not:** attempts, flee rate, difficulty.

### H9 — Boss Rush snapshot (Bosses / dungeons)

- **Decision:** Do records stop in early rooms? Has anyone finished 10 rooms?  
- **Class:** `LIVE_SNAPSHOT`  
- **Query:** OQL `bossRushStates` + `bossRushMasterComplete` from
  `getAllCharacters`.  
- **Viz:** Histogram of `highestRoomCompleted` (0–10); scalar
  `sum(totalBossRushRuns)` labeled **master finishes occupying room 9**;
  count of master-complete flags. Hide rates when n < 20.  
- **Caption:** Best room ever, not attempts. `currentRoom` is mid-run
  state, not a completion rate. Repeat `complete(9)` after leaving room 9
  does not increment.  
- **Not:** per-boss named fights; `BossConfig.defeated`; average attempts.

### H10 — Config hygiene (Admin content)

- **Decision:** What catalog rows have **no snapshot evidence** of player
  interaction (so the owner can delete or ship them)?  
- **Class:** `LIVE_SNAPSHOT` + catalog  
- **Viz:**  
  - Spells in `getSpellConfigs` with zero `spellLevelKeys` hits **and**
    not in the starter id set.  
  - Achievements with zero unlocks.  
  - GameKey: no unused-`ShopPackage` signal (Purchases UI is GameKey).  
  - Enemy / modifier / region / ad rows: **list with “usage not measured.”**  
  - Custom URL inventory: count empty vs stored `spriteUrl` / `*Url`.
    Empty = `NORMAL_DEFAULT`. Stored = `STORED_NOT_RENDERED`.  
- **Not:** invalid-config event feed; failed-load feed; pixel-error feed;
  `CUSTOM_FALLBACK` rate.

### H11 — Client version seen (Content version)

- **Decision:** Are players still on an old changelog-seen version after a
  wipe (`APP_VERSION`)?  
- **Class:** `LIVE_SNAPSHOT`  
- **Query:** OQL `changelogShownVersions`; display canister `getAppVersion`
  and client `APP_VERSION` (`v163`) as labels. Drop `owner`.  
- **Viz:** Counts by version string.  
- **Caption:** Last changelog ack, not “played during vX.”

### H12 — Game Health events (APPROVED_EVENT — do not ship UI until counters exist)

- **Decision:** Is persist healthy? Are victories paying? Are players
  dismissing recap? Is death penalty landing? Is shop credit committing?  
- **Counters:** the AQA-012 seven only (section 4.4).  
- **Viz:** Single-period counts + persist_fail / (ok+fail) with Wilson
  interval when `n ≥ 20`. Date filter **only if** day buckets exist.  
- **Empty state until shipped:** “Event counters not deployed (AQA-012 /
  TADD-001). Do not infer from killCount.”  
- **Do not** add one-shot settle / absolute-write skip / battle-start /
  defeat / flee tiles because #352 named them.

### H13 — Game Health not measured (static)

Visible list so the owner does not ask the tab for:

- Battle starts, defeat, flee, turns, duration  
- Abnormal termination  
- Enemy family / elite / AI / enemy spells  
- Spell casts / discovery / obtain source / observed-not-obtained  
- Doka earned vs spent totals  
- Boss attempts / flee / per-boss difficulty  
- Custom-fallback events  
- One-shot settle outcomes / absolute-write skips (until a human ID)

### H14 — Admin mutation ring (Admin content / economy context)

- **Decision:** Did an operator grant, retire, approve a GameKey, or
  delete content that would explain an empty H3 row, a never-unlocked
  feat, a handful of huge wallets, or a burst of H6 approved rows?  
- **Class:** `LIVE_SNAPSHOT` (bindgen is present). Card must not say
  “bindings missing.”  
- **Query:** `getAdminAuditLog` only. Do not add an OQL entity that
  repeats `adminPrincipal`.  
- **Viz:** Counts by `action`. Optional period filter on `timestampNs`
  **inside the ring**.  
- **n** = ring length (max 100). Caption: “Last 100 **successful** admin
  writes. Validation `#err` is not recorded. Not player telemetry. GameKey
  audit `objectId` is a player principal — drop it.”  
- **Forbidden:** `adminPrincipal`; player principals in `objectId`;
  treating `newSummary = "pixel-fallback"` as `CUSTOM_FALLBACK`.  
- **Not:** invalid-config event feed; lifetime volume.

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

No Enemy Health outcome section. No “endgame” rail.

---

## 11. Still refused

- Wiring `saveKillCount` as a battle chart.  
- Debug overlay as production telemetry.  
- `BossConfig.defeated` or empty `spriteUrl` as player outcomes.  
- Treating admin “pixel-fallback” / “Active fallback” / “Stored URL —
  not rendered” as `CUSTOM_FALLBACK`.  
- Date-filtered earn/spend **share** charts before a ledger exists.  
- Charting `hintedEuroCents` as revenue or `processPendingPurchases` as
  shop volume.  
- Putting GameKey emails, codes, or the Settings ban list on Health.  
- A composite health score.  
- Any Health cell with a principal, email, or proof URL.  
- Expanding AQA-012 without a new human-approved ID (including #352
  Phase 1 extras).  
- Charting sibling design PRs, SDE observe/owned, VAL load failures, or
  `longHorizonSim` as live play.  
- Treating WX local `ownedIds` as discovery persist.

---

## 12. Implementation order (no production code this run)

1. **TADD-2026-08-31-001 / AQA-012** — seven counters. Highest leverage.
   Follow §4.4 (**shop credit = `shouldCommitGameKeyRedeem`**). New maps
   need a **later** EOP file after `20260901` (TADD-2026-09-21-004).  
2. **TADD-2026-08-31-002** — Health tab H1–H11, H13 (read-only), with
   **H6 GameKey aggregates** (TADD-2026-09-02-003) and H9 master-finish
   caption (TADD-2026-09-21-002).  
3. **TADD-2026-08-31-003** — aggregate query or OQL extension without PII
   (spell keys; GameKey without email).  
4. **TADD-2026-09-02-001** — H14 now (bindgen already in `backend.ts`).  
5. H12 widgets only after counters are queryable.  
6. Do **not** schedule H15+ from #352 until a human expands 012.

Snapshot UI regression risk is low if read-only and aggregated before
setState. TADD-001 remains **medium** if it writes off the persist lock
or increments shop credit on the dead `processPendingPurchases` path.
EOP risk is **high** if someone amends a frozen `NewActor`.

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
(`002` shop dual-path **superseded** by `TADD-2026-09-21-001`);
`TADD-2026-09-21-001` … `006` (in unmerged #345; still the correct
product deltas vs 09-02).

This run: [`ACTION_IDS_TADD_2026-09-22.md`](ACTION_IDS_TADD_2026-09-22.md)
(`TADD-2026-09-22-001`, `002` only — no second counter set).

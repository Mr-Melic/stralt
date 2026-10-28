# Telemetry-Driven Balance & Content Analyst — 2026-10-28

**Analyst:** Telemetry-Driven Balance & Content Analyst (`2786666f-a4a0-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-b5ad3bc7-896b-430d-87b1-8448df16afc8` (cron `0 */24 * * *`, triggered 2026-10-28 00:04 UTC)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332 from Mr-Melic/cursor/report-findings-orchestration-8493`)  
**Prior TBC on `main`:** [`TELEMETRY_BALANCE_2026-09-02.md`](./TELEMETRY_BALANCE_2026-09-02.md) (merged as [#260](https://github.com/Mr-Melic/stralt/pull/260); inspected `58302bc`)  
**Unmerged prior TBC PRs (not copied, not treated as live data):** [#333](https://github.com/Mr-Melic/stralt/pull/333) (09-21), [#395](https://github.com/Mr-Melic/stralt/pull/395) (09-22), [#462](https://github.com/Mr-Melic/stralt/pull/462) (09-23), [#502](https://github.com/Mr-Melic/stralt/pull/502) (09-24), [#556](https://github.com/Mr-Melic/stralt/pull/556) (09-25), [#609](https://github.com/Mr-Melic/stralt/pull/609) (09-26), [#661](https://github.com/Mr-Melic/stralt/pull/661) (09-27), [#725](https://github.com/Mr-Melic/stralt/pull/725) (09-28), [#768](https://github.com/Mr-Melic/stralt/pull/768) (09-29), [#833](https://github.com/Mr-Melic/stralt/pull/833) (10-21), [#871](https://github.com/Mr-Melic/stralt/pull/871) (10-22), [#928](https://github.com/Mr-Melic/stralt/pull/928) (10-23), [#994](https://github.com/Mr-Melic/stralt/pull/994) (10-24), [#1053](https://github.com/Mr-Melic/stralt/pull/1053) (10-25), [#1108](https://github.com/Mr-Melic/stralt/pull/1108) (10-26), [#1165](https://github.com/Mr-Melic/stralt/pull/1165) (10-27)  
**Gameplay / balance code:** not modified.

## STATUS: WAITING_FOR_TELEMETRY

Activation guard fired. Real gameplay telemetry is **absent**. This run does **not** invent measurements, does **not** infer win rates or spell strength from source, `longHorizonSim`, design docs, wallet snapshots, unmerged drafts, BAL reports, open-PR counts, or calendar gaps, and does **not** produce OVERPERFORMING / UNDERPERFORMING / DIFFICULTY_* / exploit classifications.

The 2026-08-31 adequacy gate is **not met**. `origin/main` is still `0f5363f` — the same SHA this analyst inspected on 2026-09-21 through 2026-09-29, 2026-10-21, 2026-10-22, 2026-10-23, 2026-10-24, 2026-10-25, 2026-10-26, and 2026-10-27. This is the **seventeenth** TBC inspection of that SHA. One UTC day after the 2026-10-27 TBC PR ([#1165](https://github.com/Mr-Melic/stralt/pull/1165), still unmerged), frozen `main` plus **886** still-open PRs vs `main` (was 831 on the 2026-10-27 TBC GraphQL list; GitHub search and GraphQL both counted **886** at this run with newest `#1217`; **829** draft + **57** ready) did **not** ship collectors or event rows. Open-PR growth, the jump from 3 to 57 ready (non-draft) opens, and yesterday’s unmerged ledger are **not** samples of play.

No Master Technical Director **balance** packet is emitted. Durable outputs: this report and [`ACTION_IDS_TBC_2026-10-28.md`](./ACTION_IDS_TBC_2026-10-28.md). Existing IDs `AQA-2026-08-30-012`, `TBC-2026-08-31-001`, `TBC-2026-08-31-002`, `TBC-2026-09-01-001`, `TBC-2026-09-02-001`, `TBC-2026-09-02-002`, `TBC-2026-09-21-001`, `TBC-2026-09-21-002`, `TBC-2026-09-22-001`, `TBC-2026-09-22-002`, `TBC-2026-09-23-001`, `TBC-2026-09-23-002`, `TBC-2026-09-24-001`, `TBC-2026-09-24-002`, `TBC-2026-09-25-001`, `TBC-2026-09-25-002`, `TBC-2026-09-26-001`, `TBC-2026-09-26-002`, `TBC-2026-09-27-001`, `TBC-2026-09-27-002`, `TBC-2026-09-28-001`, `TBC-2026-09-28-002`, `TBC-2026-09-29-001`, `TBC-2026-09-29-002`, `TBC-2026-10-21-001`, `TBC-2026-10-21-002`, `TBC-2026-10-22-001`, `TBC-2026-10-22-002`, `TBC-2026-10-23-001`, `TBC-2026-10-23-002`, `TBC-2026-10-24-001`, `TBC-2026-10-24-002`, `TBC-2026-10-25-001`, `TBC-2026-10-25-002`, `TBC-2026-10-26-001`, `TBC-2026-10-26-002`, `TBC-2026-10-27-001`, and `TBC-2026-10-27-002` are **not re-filed**.

This PR adds **only** these two dated files. It does **not** copy `#333` / `#395` / `#462` / `#502` / `#556` / `#609` / `#661` / `#725` / `#768` / `#833` / `#871` / `#928` / `#994` / `#1053` / `#1108` / `#1165` files or README rows (those overlaps fail oldest-first stack-compat).

---

## Classification of statements

| Kind | This run |
| :--- | :--- |
| **OBSERVED FACT** | Fresh infrastructure search at HEAD `0f5363f`. Collectors still missing. Event dumps still 0 rows. `longHorizonSim.telemetry.available === false`. SoundEvent names `spell_cast` / `battle_end` are audio only. Open collector-implementation PRs: 0. Open PRs targeting `main`: **886** (**829** draft + **57** ready). Telemetry-named open PRs are docs-only. Last TBC PR is `#1165` (2026-10-27). Concurrent 10-27 specialist PRs `#1180` (GTAD architecture), `#1191` (TADD skip-matrix), and `#1197` (LHIPS synthetic) are not collectors. Ready PRs are combat/map/admin/persist/a11y/test/docs, not instrumentation. No BAL PR dated 2026-10-21 through 2026-10-27. |
| **HYPOTHESIS** | None about player behavior, enemy difficulty, spell strength, economy, or content discovery. |
| **RECOMMENDATION** | Stay in `WAITING_FOR_TELEMETRY`. Do not schedule `BAL-*` from this packet. Do not treat architecture/dashboard docs, the synthetic sim, debug click-trace, the sound engine, unmerged TBC/GTAD/TADD/LHIPS PRs (including yesterday `#1165` / `#1180` / `#1191` / `#1197`), BAL GAME_BALANCE docs, open-PR counts, ready-vs-draft mix, or calendar gaps as measurements. Implement the already-filed event set before any later run claims a balance finding. |

---

## Adequacy gate (re-evaluated)

From [`TELEMETRY_BALANCE_2026-08-31.md`](./TELEMETRY_BALANCE_2026-08-31.md). All four must be true to leave this status.

| Criterion | This run |
| :--- | :--- |
| Collectors 1–9 exist in the live actor (or an export fed by that actor), not only in a design doc | **Fail.** No `recordTelemetryIncrements`, no increment maps, no event schema in `src/backend`. Bindgen `backend.ts` has 0 telemetry methods (0 substring hits in 4817 lines). |
| At least one complete UTC day of events is queryable | **Fail.** No export path, no dashboard data, no canister query, no `csv`/`jsonl`/`parquet` dumps. |
| Per-entity sample sizes are stated; small N stays `NEEDS_MORE_DATA` | **N/A.** Sample size is 0 in every domain. |
| Low spell usage is cross-checked against discovery, rarity, and exposure before UNDERPERFORMING | **N/A.** No `spell_cast` telemetry rows (the identifier exists only as a WebAudio event name). |

---

## Evidence sources (what was actually checked)

| Source | Result |
| :--- | :--- |
| Repo glob `**/*telemetry*` | Design/report docs only (architecture, dashboard, TBC WAITING reports through 09-02 on `main`). No collector module. |
| Repo glob `**/*.{csv,jsonl,parquet}` | **0 files** |
| Repo glob `**/telemetrySidecar*` | **0 files** |
| `src/backend` grep `telemetry` / `recordTelemetry` / `telemetryLifetime` / `adminGetTelemetry` / `incrementTelemetry` | **0 hits** |
| `src/frontend/src/backend.ts` grep same | **0 hits** (4817 lines). |
| `src/` grep `telemetry` | Three product hits: WX empty comment; `longHorizonSim.ts` `available: false`; test asserting that. Rest are docs. |
| `src/` grep `doka_delta` / `spell_discovered` / `content_seen` | **0 hits** |
| `src/` grep `battle_end` / `spell_cast` | **Sound engine only** (`useSoundHooks.ts` 7–16, `soundEngine.ts` 272 / 306). Not an event log. |
| `src/` grep PostHog, Mixpanel, Sentry, Amplitude, Segment, Plausible, Umami, GA4, `trackEvent`, `eventLog`, `metricsStore` | **No collector.** `pulseAmplitude` in `StarfieldBackground.tsx` is a render parameter. `intelligence?: number` on `types/gameTypes.ts` 307 is a stat field, not a dashboard. |
| `src/frontend/package.json` dependencies | IC agent / UI / R3F / recharts. **No analytics SDK.** |
| `WorldExploration.tsx` 16442–16446 | Comment only: “caller-side telemetry” around `action.intent`. Empty `if (action.intent)` block. No emit. File is 19213 lines. |
| `src/frontend/src/debug/clickTrace.ts` 1–8, 39, 58 | DEV-only local ring buffer (`CLICK_TRACE_CAP = 20`). File header: never shipped to normal players. **Not production telemetry.** |
| `src/frontend/src/utils/longHorizonSim.ts` 532–536 | Explicit `telemetry.available: false`. `longHorizonSim.test.ts` 67 asserts the same. Synthetic model only. Unmerged LHIPS PRs edit the sim; that is still not live play. |
| `docs/ARCHITECTURE.md` Persistence table 37–50 | characters, Doka, profiles, buffs, achievements, Boss Rush, dungeon records, GameKey maps, config. **No event / analytics store.** |
| Admin dashboard tabs 5611–5625 | Enemies, Regions, Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. **No Intelligence / telemetry / Health tab.** `types/gameTypes.ts` 483–498 has the same tab union. |
| OQL `Expose` `main.mo` 3498 | Player progress + admin catalogs + GameKey (`characterSlots`, `dokaBalances`, `userProfiles`, dungeon records, configs, `gameKeyRequests`, …). **No telemetry entity.** |
| GitHub code search `repo:Mr-Melic/stralt` `recordTelemetry` / `telemetrySidecar` / `adminGetTelemetry` | **0 files** (`total_count: 0`; `incomplete_results: true` on each). PR search for collector implementation titles: **0**. |
| GitHub PRs | Open vs `main`: **886** (**829** draft + **57** ready). Oldest `#327`, `#331`, then `#333` TBC 09-21. Newest `#1217`. Was **831** on the 2026-10-27 TBC GraphQL list (newest then `#1162`); **+55** (`#1163`–`#1217`). Search API and GraphQL both counted **886** at this run. Those 55 titles: 27 `docs*` (including TBC `#1165`, GTAD `#1180`, TADD `#1191`, LHIPS `#1197`), 23 `fix*` (including ready combat/map/admin/a11y/persist and draft `#1217`), 4 `test*`, 1 `refactor(engine)` `#1196`. 54 of 55 opened ready; 1 draft. Telemetry-named opens remain docs (`#333` `#345` `#352` `#357` `#395` `#407` `#422` `#424` `#450` `#455` `#462` `#475` `#502` `#504` `#527` `#530` `#556` `#559` `#560` `#583` `#609` `#616` `#637` `#641` `#661` `#668` `#670` `#682` `#722` `#725` `#748` `#750` `#768` `#777` `#801` `#806` `#816` `#819` `#827` `#833` `#871` `#879` `#884` `#898` `#928` `#931` `#936` `#960` `#981` `#988` `#994` `#1016` `#1047` `#1048` `#1053` `#1077` `#1108` `#1116` `#1118` `#1141` `#1165` `#1180` `#1191` `#1197`). BAL `#472` / `#505` / `#582` / `#640` / `#675` / `#736` / `#779` are GAME_BALANCE write-ups; **0** BAL PR dated 2026-10-21 through 2026-10-27. **0 collector-implementation PRs**. Merges after `#332`: **0**. |
| `git log` / `origin/main` | Still `0f5363f` (`#332`, author date 2026-09-03 02:28 +0200 / 00:28 UTC). **55** calendar days before this run. No collector commits on `main`. |

`getLeaderboard`, `killCount`, current Doka (including GameKey purchase flow), spell-bar snapshots, achievement flags, Boss Rush best room, dungeon depth, and OQL progress snapshots remain **progress snapshots**, not telemetry. This run does not treat them as win/loss, duration, death-cause, or usage series. Unmerged PRs (`#1163`–`#1217` class, including `fix:` combat/map/admin/persist PRs, the 57 ready opens, and 10-27 specialist docs) are also not live measurements. Open-PR counts and calendar gaps are not samples.

---

## Domain coverage (required measurements — all missing)

| Analysis domain | Collector present? | Rows observed | Verdict |
| :--- | :--- | :--- | :--- |
| Enemy win / loss | No | 0 | Missing |
| Relative enemy difficulty | No | 0 | Missing |
| Battle duration | No | 0 | Missing |
| Death causes | No | 0 | Missing |
| Spell usage | No | 0 | Missing |
| Spell discovery | No | 0 | Missing |
| Discovery sources | No | 0 | Missing |
| Spell combinations | No | 0 | Missing |
| Boss completion | No | 0 | Missing |
| Challenge completion | No | 0 | Missing |
| Doka earned / spent | No series (wallet is an absolute Nat; GameKey is ops, not a ledger) | 0 events | Missing |
| Dungeon performance | No | 0 | Missing |
| Content usage | No | 0 | Missing |

There is no sample size, so confidence for any balance label is **N/A**.

---

## Finding (infrastructure only)

ANALYSIS_ID: TBC-F-2026-10-28-001  
OBSERVATION: Gameplay telemetry infrastructure is still absent at HEAD `0f5363f`. This is the seventeenth TBC inspection of the same SHA (09-21 through 09-29, 10-21, 10-22, 10-23, 10-24, 10-25, 10-26, 10-27, then 10-28). Since the 10-27 TBC GraphQL count of 831 open PRs (828 draft + 3 ready), the queue grew to **886** (+55; 829 draft + 57 ready). None of those PRs add a collector module. Design docs, `longHorizonSim`, debug click-trace, SFX identifiers, BAL write-ups, open-PR counts, unmerged `#1165`, and 10-27 `#1180` / `#1191` / `#1197` remain non-data. Prior AQA/TBC IDs through `TBC-2026-10-27-002` are still `NEW`.  
DATA: Search table above. Comment at `WorldExploration.tsx` 16442–16446. `longHorizonSim.ts` 532–536 (`available: false`). Persistence table in `docs/ARCHITECTURE.md` 37–50. Admin tabs 5611–5625. GitHub collector search `total_count: 0`. Open collector PRs: 0. Open PRs vs `main`: 886. Last TBC PR `#1165` (10-27). Last `main` merge `#332` (2026-09-03).  
SAMPLE_SIZE: 0 player sessions; 0 battles; 0 spell casts; 0 deaths; 0 Doka ledger rows.  
CONFIDENCE: HIGH (absence of collectors and datasets is directly observed).  
POSSIBLE_EXPLANATIONS: Instrumentation was never implemented; TBC/GTAD/TADD/BAL automations produce docs-only PRs while `main` stays frozen; persist-lock / Caffeine-import / oldest-first stack risk kept humans from shipping counters; AQA-012 remains unpicked.  
RECOMMENDED_ACTION: Do not change enemy stats, spells, XP, Doka, GameKey pricing, or content weights. Do not infer balance from source, from `longHorizonSim`, from architecture/dashboard docs, from BAL `#472`/`#505`/`#582`/`#640`/`#675`/`#736`/`#779`, from the 886-PR queue, or from unmerged `#1165` / `#1180` / `#1191` / `#1197`. Keep this analyst gated. Implement the already-filed measurement set (`AQA-2026-08-30-012` then `TBC-2026-08-31-002`), following GTAD’s **off-lock** sidecar rule (do not enqueue on `progressPersistRef`).  
NEEDS_MORE_DATA: YES — every analysis domain.

ANALYSIS_ID: TBC-F-2026-10-28-002  
OBSERVATION: Unmerged telemetry-named PRs (now including yesterday’s TBC `#1165`, GTAD `#1180`, TADD `#1191`, LHIPS `#1197`, and earlier TBC `#1108`) and BAL write-ups through `#779` are still not live telemetry. No BAL PR exists for 2026-10-21 through 2026-10-27. Identifiers `spell_cast` and `battle_end` remain WebAudio `SoundEvent` names. Treating those PRs, BAL docs, SFX grep hits, open-PR growth, or the 57 ready PRs as instrumentation would be a false positive.  
DATA: Open TBC PRs `#333`/`#395`/`#462`/`#502`/`#556`/`#609`/`#661`/`#725`/`#768`/`#833`/`#871`/`#928`/`#994`/`#1053`/`#1108`/`#1165` are dated WAITING reports only. Architecture `#352`/`#422`/`#450`/`#527`/`#583`/`#641`/`#682`/`#722`/`#806`/`#816`/`#884`/`#931`/`#981`/`#1047`/`#1116`/`#1180` and dashboard `#345`/`#424`/`#455`/`#504`/`#559`/`#616`/`#668`/`#750`/`#801`/`#827`/`#879`/`#936`/`#988`/`#1048`/`#1118`/`#1191` are design docs. `#472`/`#505`/`#582`/`#640`/`#675`/`#736`/`#779` are `GAME_BALANCE_*.md`. LHIPS `#357`/`#407`/`#475`/`#530`/`#560`/`#637`/`#670`/`#748`/`#777`/`#819`/`#898`/`#960`/`#1016`/`#1077`/`#1141`/`#1197` remain synthetic. `useSoundHooks.ts` 7–16; `soundEngine.ts` 272–275 / 306–310. Repo glob on `main` has no `TELEMETRY_BALANCE_*` after 2026-09-02; last unmerged TBC PR is 2026-10-27. No matching backend method or append-only store.  
SAMPLE_SIZE: 0 telemetry rows. Open-PR counts and audio dispatch are not samples.  
CONFIDENCE: HIGH (file lists, GitHub search, and SFX switch are directly observed).  
POSSIBLE_EXPLANATIONS: Daily specialist automations emit unique dated docs to stay stack-compat-clean; none implement collectors; SFX names were chosen for audio; the 57 ready PRs are product fixes and specialist docs, not event pipelines.  
RECOMMENDED_ACTION: Classify unmerged telemetry-named PRs (including `#1165` / `#1180` / `#1191` / `#1197`) and BAL docs as non-data. Classify `playSound("spell_cast"|"battle_end")` as audio. Do not flip the adequacy gate or `telemetry.available` from those strings, from open-PR counts, from ready-vs-draft mix, or from GAME_BALANCE write-ups.  
NEEDS_MORE_DATA: YES — still no usage/outcome series.

No OVERPERFORMING, UNDERPERFORMING, UNDERUSED, OVERUSED, DIFFICULTY_SPIKE, DIFFICULTY_COLLAPSE, CONTENT_NOT_DISCOVERED, POSSIBLE_EXPLOIT, or HEALTHY_VARIATION labels are assigned.

---

## Required measurements (still missing)

Backend-authoritative, append-only (or query-aggregable) events. Do not derive these from `updateCharacter` snapshots, combat source, `longHorizonSim`, SFX names, unmerged docs, BAL reports, or calendar gaps.

**Persist-lock correction (from [`TELEMETRY_ARCHITECTURE_2026-09-02.md`](./TELEMETRY_ARCHITECTURE_2026-09-02.md) / `GTAD-2026-09-01-002`):** do **not** enqueue telemetry on `createProgressPersist` / `progressPersistRef`. Increments are fire-and-forget **after** persist helpers return, or query-only snapshot aggregates. Swallow sidecar errors. Missing bindgen method = no-op. Telemetry must never write HP / XP / Doka / spell levels.

Stralt has **no player level cap**. All events must carry `playerLevel` and content id so later analysis is **relative** (vs peers at similar level / vs that enemy’s own history), not vs a fictional endgame band.

1. **Battle outcome** — `battle_end`: encounter id, enemy/boss/challenge ids, result (`win` / `loss` / `flee` / `abort`), duration ms, player level, map/region/dungeon depth, death cause enum if loss (combat / reflect / lava / spikes / modifier / other — explicit metadata, not name heuristics). Not the SFX of the same name.
2. **Enemy / boss identity** — stable config id on every `battle_end` and kill credit.
3. **Spell cast** — `spell_cast`: spell id, level, encounter id, outcome tag if known (hit / miss / resist / no-target). Usage ≠ power. Not the SFX of the same name.
4. **Spell discovery** — `spell_discovered`: spell id, source enum (achievement / drop / shop / admin / other).
5. **Spell bar snapshot (optional, low rate)** — `spell_bar_set`: ordered ids.
6. **Challenge completion** — `challenge_end`: challenge id, success/fail, damage/AP credited flags.
7. **Doka ledger** — `doka_delta`: signed amount, reason (`applyRewards` / `upgradeSpell` / shop / heal / death_penalty / achievement / purchase / admin / GameKey if that path ever mints or spends Doka). Wallet Nat and GameKey request rows alone are not earned/spent telemetry.
8. **Dungeon / Boss Rush step** — `dungeon_step` / `boss_rush_room`: depth or room, result, duration.
9. **Content exposure** — `content_seen`: portal type / region / shop SKU / recap shown.
10. **Quality counters** — persist-ok / persist-fail, death-penalty applied, victory paid, recap open/dismiss, shop credit committed (`AQA-2026-08-30-012`). Complementary, not a substitute for items 1–9.

Suggested (not current) floors once data exists: ≥30 `battle_end` rows per enemy id before a relative-difficulty claim; ≥50 `spell_cast` rows per spell id before OVERUSED/UNDERUSED; discovery + exposure counts before CONTENT_NOT_DISCOVERED. These floors are methodology, not observations.

---

## Explicit non-actions

- No enemy HP / damage / AP / MP / init edits.
- No spell cost, damage, or rarity edits.
- No XP / Doka curve edits.
- No GameKey shop price or grant edits from this analyst.
- No content weight or spawn-table edits.
- No “balance conclusion from code review.”
- No treating `longHorizonSim`, TELEMETRY_* design docs, debug click-trace, sound-engine event names, unmerged TBC/GTAD/TADD/LHIPS/BAL PRs, or the 886-PR queue as player data.

## Feed to Master Technical Director

**STATUS WAITING_FOR_TELEMETRY.**

Still-open IDs (do not re-file): `AQA-2026-08-30-012`, `TBC-2026-08-31-001`, `TBC-2026-08-31-002`, `TBC-2026-09-01-001`, `TBC-2026-09-02-001`, `TBC-2026-09-02-002`, `TBC-2026-09-21-001`, `TBC-2026-09-21-002`, `TBC-2026-09-22-001`, `TBC-2026-09-22-002`, `TBC-2026-09-23-001`, `TBC-2026-09-23-002`, `TBC-2026-09-24-001`, `TBC-2026-09-24-002`, `TBC-2026-09-25-001`, `TBC-2026-09-25-002`, `TBC-2026-09-26-001`, `TBC-2026-09-26-002`, `TBC-2026-09-27-001`, `TBC-2026-09-27-002`, `TBC-2026-09-28-001`, `TBC-2026-09-28-002`, `TBC-2026-09-29-001`, `TBC-2026-09-29-002`, `TBC-2026-10-21-001`, `TBC-2026-10-21-002`, `TBC-2026-10-22-001`, `TBC-2026-10-22-002`, `TBC-2026-10-23-001`, `TBC-2026-10-23-002`, `TBC-2026-10-24-001`, `TBC-2026-10-24-002`, `TBC-2026-10-25-001`, `TBC-2026-10-25-002`, `TBC-2026-10-26-001`, `TBC-2026-10-26-002`, `TBC-2026-10-27-001`, `TBC-2026-10-27-002`.

New REPORT_ONLY IDs this run:

- `TBC-2026-10-28-001` — seventeenth inspection of frozen `main` `0f5363f`; queue 886 (829 draft + 57 ready); 0 collectors / 0 rows.
- `TBC-2026-10-28-002` — unmerged telemetry-named PRs (now including `#1165` / `#1180` / `#1191` / `#1197`) and BAL `#472` / `#505` / `#582` / `#640` / `#675` / `#736` / `#779` are not live data. No 2026-10-21 through 2026-10-27 BAL PR.

Do not schedule balance implementation from this run. Keep `longHorizonSim.telemetry.available = false` until APIs exist **and** are populated.

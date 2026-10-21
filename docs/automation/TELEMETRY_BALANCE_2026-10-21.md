# Telemetry-Driven Balance & Content Analyst — 2026-10-21

**Analyst:** Telemetry-Driven Balance & Content Analyst (`2786666f-a4a0-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-7b8d86a9-cbba-4a61-b877-c5920d050a00` (cron `0 */24 * * *`, triggered 2026-10-21 00:04 UTC)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332 from Mr-Melic/cursor/report-findings-orchestration-8493`)  
**Prior TBC on `main`:** [`TELEMETRY_BALANCE_2026-09-02.md`](./TELEMETRY_BALANCE_2026-09-02.md) (merged as [#260](https://github.com/Mr-Melic/stralt/pull/260); inspected `58302bc`)  
**Unmerged prior TBC drafts (not copied, not treated as live data):** [#333](https://github.com/Mr-Melic/stralt/pull/333) (09-21), [#395](https://github.com/Mr-Melic/stralt/pull/395) (09-22), [#462](https://github.com/Mr-Melic/stralt/pull/462) (09-23), [#502](https://github.com/Mr-Melic/stralt/pull/502) (09-24), [#556](https://github.com/Mr-Melic/stralt/pull/556) (09-25), [#609](https://github.com/Mr-Melic/stralt/pull/609) (09-26), [#661](https://github.com/Mr-Melic/stralt/pull/661) (09-27), [#725](https://github.com/Mr-Melic/stralt/pull/725) (09-28), [#768](https://github.com/Mr-Melic/stralt/pull/768) (09-29)  
**Gameplay / balance code:** not modified.

## STATUS: WAITING_FOR_TELEMETRY

Activation guard fired. Real gameplay telemetry is **absent**. This run does **not** invent measurements, does **not** infer win rates or spell strength from source, `longHorizonSim`, design docs, wallet snapshots, unmerged drafts, BAL reports, open-PR counts, or calendar gaps, and does **not** produce OVERPERFORMING / UNDERPERFORMING / DIFFICULTY_* / exploit classifications.

The 2026-08-31 adequacy gate is **not met**. `origin/main` is still `0f5363f` — the same SHA this analyst inspected on 2026-09-21 through 2026-09-29. This is the **tenth** TBC inspection of that SHA, after a **21 UTC-day** silence with no TBC ledger (2026-09-30 through 2026-10-20). Frozen `main` plus **491** still-open drafts vs `main` (was 436 on the 2026-09-29 TBC run) did **not** ship collectors or event rows. The calendar gap is **not** a sample of play.

No Master Technical Director **balance** packet is emitted. Durable outputs: this report and [`ACTION_IDS_TBC_2026-10-21.md`](./ACTION_IDS_TBC_2026-10-21.md). Existing IDs `AQA-2026-08-30-012`, `TBC-2026-08-31-001`, `TBC-2026-08-31-002`, `TBC-2026-09-01-001`, `TBC-2026-09-02-001`, `TBC-2026-09-02-002`, `TBC-2026-09-21-001`, `TBC-2026-09-21-002`, `TBC-2026-09-22-001`, `TBC-2026-09-22-002`, `TBC-2026-09-23-001`, `TBC-2026-09-23-002`, `TBC-2026-09-24-001`, `TBC-2026-09-24-002`, `TBC-2026-09-25-001`, `TBC-2026-09-25-002`, `TBC-2026-09-26-001`, `TBC-2026-09-26-002`, `TBC-2026-09-27-001`, `TBC-2026-09-27-002`, `TBC-2026-09-28-001`, `TBC-2026-09-28-002`, `TBC-2026-09-29-001`, and `TBC-2026-09-29-002` are **not re-filed**.

This PR adds **only** these two dated files. It does **not** copy `#333` / `#395` / `#462` / `#502` / `#556` / `#609` / `#661` / `#725` / `#768` files or README rows (those overlaps fail oldest-first stack-compat).

---

## Classification of statements

| Kind | This run |
| :--- | :--- |
| **OBSERVED FACT** | Fresh infrastructure search at HEAD `0f5363f`. Collectors still missing. Event dumps still 0 rows. `longHorizonSim.telemetry.available === false`. SoundEvent names `spell_cast` / `battle_end` are audio only. Open collector-implementation PRs: 0. Open PRs targeting `main`: **491** (oldest `#327`, newest `#822` at search time; all drafts). Telemetry-named open PRs are docs-only. No TBC ledger exists for 2026-09-30 through 2026-10-20. |
| **HYPOTHESIS** | None about player behavior, enemy difficulty, spell strength, economy, or content discovery. |
| **RECOMMENDATION** | Stay in `WAITING_FOR_TELEMETRY`. Do not schedule `BAL-*` from this packet. Do not treat architecture/dashboard docs, the synthetic sim, debug click-trace, the sound engine, unmerged TBC/GTAD/TADD/LHIPS drafts, BAL GAME_BALANCE docs, open-PR counts, or the 21-day TBC silence as measurements. Implement the already-filed event set before any later run claims a balance finding. |

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
| `WorldExploration.tsx` 16442–16446 | Comment only: “caller-side telemetry” around `action.intent`. Empty `if (action.intent)` block. No emit. |
| `src/frontend/src/debug/clickTrace.ts` 1–8, 39 | DEV-only local ring buffer (capacity 20). File header: never shipped to normal players. **Not production telemetry.** |
| `src/frontend/src/utils/longHorizonSim.ts` 532–536 | Explicit `telemetry.available: false`. `longHorizonSim.test.ts` 67 asserts the same. Synthetic model only. Unmerged LHIPS drafts edit the sim; that is still not live play. |
| `docs/ARCHITECTURE.md` Persistence table 37–50 | characters, Doka, profiles, buffs, achievements, Boss Rush, dungeon records, GameKey maps, config. **No event / analytics store.** |
| Admin dashboard tabs 5611–5625 | Enemies, Regions, Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. **No Intelligence / telemetry / Health tab.** `types/gameTypes.ts` 483–498 has the same tab union. |
| GitHub code search `repo:Mr-Melic/stralt` `recordTelemetry` / `telemetrySidecar` / `adminGetTelemetry` | **0 files** (`total_count: 0`). |
| GitHub PRs | Open vs `main`: **491** drafts (was 436 on 2026-09-29 TBC). Oldest `#327`, `#331`, then `#333` TBC 09-21. Newest at search time `#822`. **55** PRs opened since 2026-09-29 00:00 UTC (46 later on 09-29 + 9 on 10-21). Of the 46 from 09-29 after that TBC started: 29 `docs:`, 13 `fix:`, 4 other (`perf` `#797`, `refactor` `#798`, `test` `#805` / `#809`). Same-UTC-day 10-21 opens at search: `#814` MTD, `#815` spell/discovery admin, `#816` GTAD architecture, `#817` enemy/boss admin, `#818` admin drift, `#819` LHIPS, `#820` leftover-walk test, `#821` enemy AI design, `#822` a11y Dialog/Sheet. Telemetry-named opens remain docs (`#333` `#345` `#352` `#357` `#395` `#407` `#422` `#424` `#450` `#455` `#462` `#475` `#502` `#504` `#527` `#530` `#556` `#559` `#560` `#583` `#609` `#616` `#637` `#641` `#661` `#668` `#670` `#682` `#722` `#725` `#748` `#750` `#768` `#777` `#801` `#806` `#816` `#819`). BAL `#472` / `#505` / `#582` / `#640` / `#675` / `#736` / `#779` are GAME_BALANCE write-ups. **0 collector-implementation PRs** (`gh search prs` for `telemetrySidecar` / `recordTelemetry` / `adminGetTelemetry` / `recordTelemetryIncrements` returned no implementation titles). Merges after `#332`: **0**. |
| `git log` / `origin/main` | Still `0f5363f` (`#332`, 2026-09-03 00:28 UTC). No new merge since the 09-21 TBC inspection. Last `main` commit is **48** calendar days before this run. |
| TBC ledger glob on `main` | `TELEMETRY_BALANCE_2026-08-31.md`, `…-09-01.md`, `…-09-02.md` only. No in-repo TBC file for 2026-09-30 through 2026-10-20. Unmerged `#768` is the last TBC draft (09-29). |
| Live canister query / exported dumps | **Not present** in this environment. |

`getLeaderboard`, `killCount`, current Doka (including GameKey purchase flow), spell-bar snapshots, achievement flags, Boss Rush best room, and dungeon depth remain **progress snapshots**, not telemetry. This run does not treat them as win/loss, duration, death-cause, or usage series. Unmerged drafts (`#768`–`#822` class, including `fix:` combat/map/admin PRs and same-UTC-day `#814`–`#822`) are also not live measurements. Open-PR counts and a 21-day TBC silence are not samples.

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

ANALYSIS_ID: TBC-F-2026-10-21-001  
OBSERVATION: Gameplay telemetry infrastructure is still absent at HEAD `0f5363f`. This is the tenth TBC inspection of the same SHA (09-21 through 09-29, then 10-21). No TBC ledger exists for 2026-09-30 through 2026-10-20 (21 UTC days). Since the 09-29 TBC count of 436 open drafts, the queue grew to **491** (+55). None of those drafts add a collector module. Design docs, `longHorizonSim`, debug click-trace, SFX identifiers, BAL write-ups, open-PR counts, and the calendar gap remain non-data. Prior AQA/TBC IDs through `TBC-2026-09-29-002` are still `NEW`.  
DATA: Search table above. Comment at `WorldExploration.tsx` 16442–16446. `longHorizonSim.ts` 532–536 (`available: false`). Persistence table in `docs/ARCHITECTURE.md` 37–50. Admin tabs 5611–5625. GitHub collector search `total_count: 0`. Open collector PRs: 0. Open PRs vs `main`: 491. Last TBC draft `#768` (09-29). Last `main` merge `#332` (2026-09-03).  
SAMPLE_SIZE: 0 player sessions; 0 battles; 0 spell casts; 0 deaths; 0 Doka ledger rows.  
CONFIDENCE: HIGH (absence of collectors and datasets is directly observed).  
POSSIBLE_EXPLANATIONS: Instrumentation was never implemented; TBC/GTAD/TADD/BAL automations produce docs-only drafts while `main` stays frozen; the 21-day TBC silence is a process gap (paused cron, failed runs, or unlanded PRs — this run does not distinguish); persist-lock / Caffeine-import risk kept humans from shipping counters; AQA-012 remains unpicked.  
RECOMMENDED_ACTION: Do not change enemy stats, spells, XP, Doka, GameKey pricing, or content weights. Do not infer balance from source, from `longHorizonSim`, from architecture/dashboard docs, from BAL `#472`/`#505`/`#582`/`#640`/`#675`/`#736`/`#779`, from the 491-draft queue, or from the 21-day TBC silence. Keep this analyst gated. Implement the already-filed measurement set (`AQA-2026-08-30-012` then `TBC-2026-08-31-002`), following GTAD’s **off-lock** sidecar rule (do not enqueue on `progressPersistRef`).  
NEEDS_MORE_DATA: YES — every analysis domain.

ANALYSIS_ID: TBC-F-2026-10-21-002  
OBSERVATION: Unmerged telemetry-named drafts, BAL write-ups, and a 21-day TBC ledger gap are still not live telemetry. New since the 09-29 TBC packet: TBC `#768`, LHIPS `#777`, BAL `#779`, TADD `#801`, GTAD `#806`, plus same-UTC-day `#814`–`#822` (including GTAD `#816` and LHIPS `#819`). Identifiers `spell_cast` and `battle_end` remain WebAudio `SoundEvent` names. Treating those PRs, BAL docs, SFX grep hits, or calendar silence as instrumentation would be a false positive.  
DATA: Open TBC drafts `#333`/`#395`/`#462`/`#502`/`#556`/`#609`/`#661`/`#725`/`#768` are dated WAITING reports only. Architecture `#352`/`#422`/`#450`/`#527`/`#583`/`#641`/`#682`/`#722`/`#806`/`#816` and dashboard `#345`/`#424`/`#455`/`#504`/`#559`/`#616`/`#668`/`#750`/`#801` are design docs. `#472`/`#505`/`#582`/`#640`/`#675`/`#736`/`#779` are `GAME_BALANCE_*.md`. LHIPS `#357`/`#407`/`#475`/`#530`/`#560`/`#637`/`#670`/`#748`/`#777`/`#819` remain synthetic. `useSoundHooks.ts` 7–16; `soundEngine.ts` 272–275 / 306–310. Repo glob on `main` has no `TELEMETRY_BALANCE_*` after 2026-09-02; last unmerged TBC draft is 2026-09-29. No matching backend method or append-only store.  
SAMPLE_SIZE: 0 telemetry rows. Open-PR counts, audio dispatch, and cron-gap days are not samples.  
CONFIDENCE: HIGH (file lists, GitHub search, and SFX switch are directly observed).  
POSSIBLE_EXPLANATIONS: Daily specialist automations emit unique dated docs to stay stack-compat-clean; none implement collectors; SFX names were chosen for audio; TBC cron produced no in-repo ledger for 21 UTC days.  
RECOMMENDED_ACTION: Classify unmerged telemetry-named PRs, BAL docs, and the 2026-09-30..10-20 TBC silence as non-data. Classify `playSound("spell_cast"|"battle_end")` as audio. Do not flip the adequacy gate or `telemetry.available` from those strings, from open-PR counts, from GAME_BALANCE write-ups, or from missing daily reports.  
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
- No treating `longHorizonSim`, TELEMETRY_* design docs, debug click-trace, sound-engine event names, unmerged TBC/GTAD/TADD/LHIPS/BAL drafts, the 491-PR queue, or the 21-day TBC silence as player data.

## Feed to Master Technical Director

**STATUS WAITING_FOR_TELEMETRY.**

Still-open IDs (do not re-file): `AQA-2026-08-30-012`, `TBC-2026-08-31-001`, `TBC-2026-08-31-002`, `TBC-2026-09-01-001`, `TBC-2026-09-02-001`, `TBC-2026-09-02-002`, `TBC-2026-09-21-001`, `TBC-2026-09-21-002`, `TBC-2026-09-22-001`, `TBC-2026-09-22-002`, `TBC-2026-09-23-001`, `TBC-2026-09-23-002`, `TBC-2026-09-24-001`, `TBC-2026-09-24-002`, `TBC-2026-09-25-001`, `TBC-2026-09-25-002`, `TBC-2026-09-26-001`, `TBC-2026-09-26-002`, `TBC-2026-09-27-001`, `TBC-2026-09-27-002`, `TBC-2026-09-28-001`, `TBC-2026-09-28-002`, `TBC-2026-09-29-001`, `TBC-2026-09-29-002`.

New REPORT_ONLY IDs this run:

- `TBC-2026-10-21-001` — tenth inspection of frozen `main` `0f5363f` after 21 UTC days with no TBC ledger; queue 491; 0 collectors / 0 rows.
- `TBC-2026-10-21-002` — unmerged telemetry-named PRs (now including `#768` / `#777` / `#801` / `#806` / `#816` / `#819`) and BAL `#472` / `#505` / `#582` / `#640` / `#675` / `#736` / `#779`, plus the 2026-09-30..10-20 TBC silence, are not live data.

Do not schedule balance implementation from this run. Keep `longHorizonSim.telemetry.available = false` until APIs exist **and** are populated.

# Telemetry-Driven Balance & Content Analyst — 2026-09-24

**Analyst:** Telemetry-Driven Balance & Content Analyst (`2786666f-a4a0-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-da0b4e29-aac2-4f29-8d02-80f4b0e2c22a` (cron `0 */24 * * *`, triggered 2026-09-24 00:04 UTC)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332 from Mr-Melic/cursor/report-findings-orchestration-8493`)  
**Prior TBC on `main`:** [`TELEMETRY_BALANCE_2026-09-02.md`](./TELEMETRY_BALANCE_2026-09-02.md) (merged as [#260](https://github.com/Mr-Melic/stralt/pull/260); inspected `58302bc`)  
**Unmerged prior TBC drafts (not copied, not treated as live data):** [#333](https://github.com/Mr-Melic/stralt/pull/333) (09-21), [#395](https://github.com/Mr-Melic/stralt/pull/395) (09-22), [#462](https://github.com/Mr-Melic/stralt/pull/462) (09-23)  
**Gameplay / balance code:** not modified.

## STATUS: WAITING_FOR_TELEMETRY

Activation guard fired. Real gameplay telemetry is **absent**. This run does **not** invent measurements, does **not** infer win rates or spell strength from source, `longHorizonSim`, design docs, wallet snapshots, unmerged drafts, or BAL reports, and does **not** produce OVERPERFORMING / UNDERPERFORMING / DIFFICULTY_* / exploit classifications.

The 2026-08-31 adequacy gate is **not met**. `origin/main` is still `0f5363f` — the same SHA this analyst inspected on 2026-09-21, 2026-09-22, and 2026-09-23. A fourth UTC day of frozen `main` plus **171** still-open drafts vs `main` did **not** ship collectors or event rows.

No Master Technical Director **balance** packet is emitted. Durable outputs: this report and [`ACTION_IDS_TBC_2026-09-24.md`](./ACTION_IDS_TBC_2026-09-24.md). Existing IDs `AQA-2026-08-30-012`, `TBC-2026-08-31-001`, `TBC-2026-08-31-002`, `TBC-2026-09-01-001`, `TBC-2026-09-02-001`, `TBC-2026-09-02-002`, `TBC-2026-09-21-001`, `TBC-2026-09-21-002`, `TBC-2026-09-22-001`, `TBC-2026-09-22-002`, `TBC-2026-09-23-001`, and `TBC-2026-09-23-002` are **not re-filed**.

This PR adds **only** these two dated files. It does **not** copy `#333` / `#395` / `#462` files or README rows (those overlaps fail oldest-first stack-compat).

---

## Classification of statements

| Kind | This run |
| :--- | :--- |
| **OBSERVED FACT** | Fresh infrastructure search at HEAD `0f5363f`. Collectors still missing. Event dumps still 0 rows. `longHorizonSim.telemetry.available === false`. SoundEvent names `spell_cast` / `battle_end` are audio only. Open collector-implementation PRs: 0. Open PRs targeting `main`: **171** (oldest `#327`, newest `#501`). Telemetry-named open PRs are docs-only. |
| **HYPOTHESIS** | None about player behavior, enemy difficulty, spell strength, economy, or content discovery. |
| **RECOMMENDATION** | Stay in `WAITING_FOR_TELEMETRY`. Do not schedule `BAL-*` from this packet. Do not treat architecture/dashboard docs, the synthetic sim, debug click-trace, the sound engine, unmerged TBC/GTAD/TADD drafts, or `#472` GAME_BALANCE docs as measurements. Implement the already-filed event set before any later run claims a balance finding. |

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
| `src/frontend/src/backend.ts` grep same | **0 hits** (4817 lines) |
| `src/` grep `telemetry` | Three product hits: WX empty comment; `longHorizonSim.ts` `available: false`; test asserting that. Rest are docs. |
| `src/` grep `doka_delta` / `spell_discovered` / `content_seen` | **0 hits** |
| `src/` grep `battle_end` / `spell_cast` | **Sound engine only** (`useSoundHooks.ts` 7–16, `soundEngine.ts` 272 / 306). Not an event log. |
| `src/` grep PostHog, Mixpanel, Sentry, Amplitude, Segment, Plausible, Umami, GA4, `trackEvent`, `eventLog`, `metricsStore` | **No collector.** `pulseAmplitude` in `StarfieldBackground.tsx` is a render parameter. `intelligence?: number` on `gameTypes.ts` 307 is a combatant stat field, not a dashboard. |
| `src/frontend/package.json` dependencies | IC agent / UI / R3F / recharts. **No analytics SDK.** |
| `WorldExploration.tsx` 16442–16446 | Comment only: “caller-side telemetry” around `action.intent`. Empty `if (action.intent)` block. No emit. File is 19,213 lines. |
| `src/frontend/src/debug/clickTrace.ts` 1–8 | DEV-only local ring buffer (capacity 20). File header: never shipped to normal players. **Not production telemetry.** |
| `src/frontend/src/debug/debugLogger.ts` 1–8, 44, 110–111 | Session-local overlay buffer (`DEBUG_BUFFER_CAP` 2000). Production no-op. **Not aggregated telemetry.** |
| `src/frontend/src/utils/longHorizonSim.ts` 532–536 | Explicit `telemetry.available: false`. `longHorizonSim.test.ts` 67 asserts the same. Synthetic model only. |
| `docs/ARCHITECTURE.md` Persistence table 37–50 | characters, Doka, profiles, buffs, achievements, Boss Rush, dungeon records, GameKey, config. **No event / analytics store.** |
| Admin dashboard tabs `AdminDashboard.tsx` 5611–5625 / `gameTypes.ts` 482–498 | Enemies, Regions, Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. **No Intelligence / telemetry / Health tab.** |
| GitHub code search `repo:Mr-Melic/stralt` `recordTelemetry` / `telemetrySidecar` / `adminGetTelemetry` | **0 files** (`total_count: 0`). |
| GitHub PR search `telemetrySidecar OR recordTelemetry OR incrementTelemetry OR adminGetTelemetry` open | **0 PRs.** |
| Open PRs targeting `main` | **171**, all drafts. Oldest `#327` (2026-09-02), then `#331`, then TBC `#333`. Newest `#501` (2026-09-23 21:39 UTC). Count was 126 on the 2026-09-23 TBC run. |
| Telemetry-named open PRs | `#333`/`#395`/`#462` TBC reports; `#352`/`#422`/`#450` architecture; `#345`/`#424`/`#455` dashboard. **Docs only.** None add a sidecar or increment API. |
| `#472` GAME_BALANCE | Docs (`GAME_BALANCE_2026-09-23.md`). **Not telemetry.** This analyst does not consume BAL reports as event rows. |
| `git log` `origin/main` | Last commit `0f5363f` dated 2026-09-03 00:28 UTC. **Zero** merges onto `main` since the 2026-09-21 TBC inspection of the same SHA. |
| Live canister query / exported dumps | **Not present** in this environment. |

`getLeaderboard`, `killCount`, current Doka (including GameKey purchase flow), spell-bar snapshots, achievement flags, Boss Rush best room, and dungeon depth remain **progress snapshots**, not telemetry. This run does not treat them as win/loss, duration, death-cause, or usage series.

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

ANALYSIS_ID: TBC-F-2026-09-24-001  
OBSERVATION: Gameplay telemetry infrastructure is still absent at HEAD `0f5363f`. `origin/main` has not moved since 2026-09-03 (`#332`). This is the fourth consecutive TBC UTC day on that SHA (09-21, 09-22, 09-23, 09-24). Open drafts vs `main` grew from 126 (09-23 report) to **171**. None of those drafts implement collectors. Design docs, `longHorizonSim`, debug overlay/click-trace, and sound-engine identifiers remain non-data. Prior AQA/TBC ACTION_IDs are still `NEW`.  
DATA: Search table above. Comment at `WorldExploration.tsx` 16442–16446. `longHorizonSim.ts` 532–536 (`available: false`). Persistence table in `docs/ARCHITECTURE.md` 37–50. Admin tabs `AdminDashboard.tsx` 5611–5625. GitHub collector search `total_count: 0`. Open collector PRs: 0. Open PRs targeting `main`: 171.  
SAMPLE_SIZE: 0 player sessions; 0 battles; 0 spell casts; 0 deaths; 0 Doka ledger rows.  
CONFIDENCE: HIGH (absence of collectors and datasets is directly observed).  
POSSIBLE_EXPLANATIONS: Instrumentation was never implemented; 2026-08-31 through 09-23 work produced design-only artifacts and WAITING reports; persist-lock / Caffeine-import / EOP-stable risk kept humans from shipping counters; AQA-012 remains unpicked; `main` is frozen while 171 drafts queue.  
RECOMMENDED_ACTION: Do not change enemy stats, spells, XP, Doka, GameKey pricing, or content weights. Do not infer balance from source, from `longHorizonSim`, from architecture/dashboard docs, from unmerged drafts, or from `#472` BAL docs. Keep this analyst gated. Implement the already-filed measurement set (`AQA-2026-08-30-012` then `TBC-2026-08-31-002`), following GTAD’s **off-lock** sidecar rule (do not enqueue on `progressPersistRef`).  
NEEDS_MORE_DATA: YES — every analysis domain.

ANALYSIS_ID: TBC-F-2026-09-24-002  
OBSERVATION: Unmerged telemetry-named PRs and a quantitative BAL draft exist, but they are **not** live instrumentation and they are **not** queryable event rows. Treating open-PR volume, TBC/GTAD/TADD docs, or GAME_BALANCE write-ups as telemetry would be a false positive. Identifiers `spell_cast` and `battle_end` in product TypeScript remain WebAudio `SoundEvent` names.  
DATA: Open TBC `#333`/`#395`/`#462` (dated WAITING reports). Architecture `#352`/`#422`/`#450`. Dashboard `#345`/`#424`/`#455`. BAL `#472` files `GAME_BALANCE_2026-09-23.md` / `ACTION_IDS_BAL_2026-09-23.md`. `gh search prs` for `telemetrySidecar OR recordTelemetry OR incrementTelemetry OR adminGetTelemetry` returned **[]**. `useSoundHooks.ts` 7–16; `soundEngine.ts` 272–275 / 306–310; `WorldExploration.tsx` `playSound` at 9315, 10462, 11050, 12331, 17347.  
SAMPLE_SIZE: 0 telemetry rows. Open-PR count and audio dispatch are not samples.  
CONFIDENCE: HIGH (file lists and search results are directly observed).  
POSSIBLE_EXPLANATIONS: Daily automations keep writing design/WAITING docs while collectors stay unimplemented; BAL specialist analyzes source, not player events.  
RECOMMENDED_ACTION: Future TBC / auditor greps must classify unmerged telemetry-named PRs as **not** live data. Classify `playSound("spell_cast"|"battle_end")` as audio. Do not flip `longHorizonSim.telemetry.available` from those strings, from open-PR counts, or from BAL docs.  
NEEDS_MORE_DATA: YES — still no usage/outcome series.

No OVERPERFORMING, UNDERPERFORMING, UNDERUSED, OVERUSED, DIFFICULTY_SPIKE, DIFFICULTY_COLLAPSE, CONTENT_NOT_DISCOVERED, POSSIBLE_EXPLOIT, or HEALTHY_VARIATION labels are assigned.

---

## Required measurements (still missing)

Backend-authoritative, append-only (or query-aggregable) events. Do not derive these from `updateCharacter` snapshots, combat source, `longHorizonSim`, SFX names, unmerged drafts, or BAL reports.

**Persist-lock correction (from [`TELEMETRY_ARCHITECTURE_2026-09-02.md`](./TELEMETRY_ARCHITECTURE_2026-09-02.md) / `GTAD-2026-09-01-002`):** do **not** enqueue telemetry on `createProgressPersist` / `progressPersistRef`. That clause in older AQA-012 text is superseded. Increments are fire-and-forget **after** persist helpers return, or query-only snapshot aggregates. Swallow sidecar errors. Missing bindgen method = no-op. Telemetry must never write HP / XP / Doka / spell levels.

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
- No treating `longHorizonSim`, TELEMETRY_* design docs, debug click-trace, sound-engine event names, unmerged TBC/GTAD/TADD PRs, or `#472` BAL docs as player data.

## Feed to Master Technical Director

**STATUS WAITING_FOR_TELEMETRY.**

Still-open IDs (do not re-file): `AQA-2026-08-30-012`, `TBC-2026-08-31-001`, `TBC-2026-08-31-002`, `TBC-2026-09-01-001`, `TBC-2026-09-02-001`, `TBC-2026-09-02-002`, `TBC-2026-09-21-001`, `TBC-2026-09-21-002`, `TBC-2026-09-22-001`, `TBC-2026-09-22-002`, `TBC-2026-09-23-001`, `TBC-2026-09-23-002`.

New REPORT_ONLY IDs this run:

- `TBC-2026-09-24-001` — fourth UTC day on frozen `0f5363f`; 171 open drafts; still 0 collectors / 0 rows.
- `TBC-2026-09-24-002` — unmerged telemetry-named PRs and BAL `#472` are not live telemetry.

Do not schedule balance implementation from this run. Keep `longHorizonSim.telemetry.available = false` until APIs exist **and** are populated.

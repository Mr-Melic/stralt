# Telemetry-Driven Balance & Content Analyst — 2026-09-22

**Analyst:** Telemetry-Driven Balance & Content Analyst (`2786666f-a4a0-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-3e0747db-45cc-4b97-814a-b77e9d916ff2` (cron `0 */24 * * *`, triggered 2026-09-22 00:01 UTC)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332 from Mr-Melic/cursor/report-findings-orchestration-8493`, author date 2026-09-03)  
**Prior TBC on `main`:** [`TELEMETRY_BALANCE_2026-09-02.md`](./TELEMETRY_BALANCE_2026-09-02.md) (merged as [#260](https://github.com/Mr-Melic/stralt/pull/260); inspected `58302bc`)  
**Prior TBC run (not on `main`):** [`TELEMETRY_BALANCE_2026-09-21.md`](./TELEMETRY_BALANCE_2026-09-21.md) in open draft [#333](https://github.com/Mr-Melic/stralt/pull/333) (`bc-5c7f1478-6bb8-439f-aba4-43fa8c255665`; same HEAD `0f5363f`)  
**Gameplay / balance code:** not modified.

## STATUS: WAITING_FOR_TELEMETRY

Activation guard fired. Real gameplay telemetry is **absent**. This run does **not** invent measurements, does **not** infer win rates or spell strength from source, `longHorizonSim`, design docs, wallet snapshots, open-PR titles, or the unmerged 2026-09-21 TBC ledger, and does **not** produce OVERPERFORMING / UNDERPERFORMING / DIFFICULTY_* / exploit classifications.

The 2026-08-31 adequacy gate is **not met**. `origin/main` is still `0f5363f`. No new commits landed in the UTC day since the 2026-09-21 TBC search. Sixty-one open draft PRs exist; **none** implement collectors. Telemetry-named open PRs are docs or design only. This environment has **no** queryable event dump.

Calendar note (not player data): last landed TBC ledger on `main` is 2026-09-02; `origin/main` author-date stops at 2026-09-03 (`#332`); this cron is 2026-09-22. The unmerged [#333](https://github.com/Mr-Melic/stralt/pull/333) ledger is **not** a sample of play and is **not** evidence that instrumentation shipped.

No Master Technical Director **balance** packet is emitted. Durable outputs: this report and [`ACTION_IDS_TBC_2026-09-22.md`](./ACTION_IDS_TBC_2026-09-22.md). README index rows are omitted so this PR stays merge-clean vs `#333` and the other README-touching drafts. Existing IDs `AQA-2026-08-30-012`, `TBC-2026-08-31-001`, `TBC-2026-08-31-002`, `TBC-2026-09-01-001`, `TBC-2026-09-02-001`, `TBC-2026-09-02-002`, `TBC-2026-09-21-001`, and `TBC-2026-09-21-002` are **not re-filed**.

---

## Classification of statements

| Kind | This run |
| :--- | :--- |
| **OBSERVED FACT** | Fresh infrastructure search at HEAD `0f5363f` (unchanged since 2026-09-21). Collectors still missing. Event dumps still 0 rows. `longHorizonSim.telemetry.available === false`. SoundEvent names `spell_cast` / `battle_end` remain audio only. GitHub collector symbol search `total_count: 0`. Open PRs targeting `main`: **61**, all draft. Collector-implementation PRs: **0**. Telemetry-titled open PRs: `#333` (this analyst, docs), `#345` (Health matrix, design), `#352` (architecture, design). `#357` is a synthetic long-horizon sim, not a collector. Prior ACTION_IDs still `NEW`. |
| **HYPOTHESIS** | None about player behavior, enemy difficulty, spell strength, economy, or content discovery. |
| **RECOMMENDATION** | Stay in `WAITING_FOR_TELEMETRY`. Do not schedule `BAL-*` from this packet. Do not treat architecture/dashboard docs, the synthetic sim, debug click-trace, the sound engine, OQL progress entities, or unmerged specialist PRs as measurements. Implement the already-filed event set before any later run claims a balance finding. |

---

## Adequacy gate (re-evaluated)

From [`TELEMETRY_BALANCE_2026-08-31.md`](./TELEMETRY_BALANCE_2026-08-31.md). All four must be true to leave this status.

| Criterion | This run |
| :--- | :--- |
| Collectors 1–9 exist in the live actor (or an export fed by that actor), not only in a design doc | **Fail.** No `recordTelemetryIncrements`, no increment maps, no event schema in `src/backend`. Bindgen `backend.ts` has 0 telemetry methods. OQL `Expose` lists progress/config entities only (no telemetry store). Open PRs `#345` / `#352` remain design docs. |
| At least one complete UTC day of events is queryable | **Fail.** No export path, no dashboard data, no canister query, no `csv`/`jsonl`/`parquet` dumps. Another UTC day on a frozen `main` added 0 rows. |
| Per-entity sample sizes are stated; small N stays `NEEDS_MORE_DATA` | **N/A.** Sample size is 0 in every domain. |
| Low spell usage is cross-checked against discovery, rarity, and exposure before UNDERPERFORMING | **N/A.** No `spell_cast` telemetry rows (the identifier exists only as a WebAudio event name). |

---

## Evidence sources (what was actually checked)

| Source | Result |
| :--- | :--- |
| Repo glob `**/*telemetry*` | Design/report docs only (architecture, dashboard, prior TBC WAITING reports). No collector module. Landed TBC ledger on `main` remains 2026-09-02. 2026-09-21 files live only on unmerged `#333`; this branch does **not** copy them (README/09-21 overlap would fail oldest-first stack-compat). |
| Repo glob `**/*.{csv,jsonl,parquet}` | **0 files** |
| Repo glob `**/telemetrySidecar*` | **0 files** |
| `src/backend` grep `recordTelemetry` / `telemetryLifetime` / `adminGetTelemetry` / `incrementTelemetry` / `telemetryEvents` | **0 hits** |
| `src/frontend/src/backend.ts` grep same | **0 hits** |
| `src/` grep `telemetry` | Three product hits: WX empty comment; `longHorizonSim.ts` `available: false`; test asserting that. Rest are docs. |
| `src/` grep `doka_delta` / `spell_discovered` / `content_seen` / `logEvent` / `trackEvent` | **0 hits** |
| `src/` grep `battle_end` / `spell_cast` | **Sound engine only** (`useSoundHooks.ts` 7–16, `soundEngine.ts` 272 / 306). Not an event log. Call sites: `WorldExploration.tsx` 9315, 10462, 11050, 12331, 17347 (`playSound`). |
| `src/` grep PostHog, Mixpanel, Sentry, Amplitude, Segment, Plausible, Umami, GA4, `eventLog`, `metricsStore` | **No collector.** `pulseAmplitude` in `StarfieldBackground.tsx` is a render parameter. `intelligence?: number` on `gameTypes.ts` 307 is a stat field, not a dashboard. |
| `src/frontend/package.json` dependencies | IC agent / UI / R3F / recharts. **No analytics SDK.** |
| `WorldExploration.tsx` 16442–16446 | Comment only: “caller-side telemetry” around `action.intent`. Empty `if (action.intent)` block. No emit. |
| `src/frontend/src/debug/clickTrace.ts` 1–8 | DEV-only local ring buffer. File header: never shipped to normal players. **Not production telemetry.** |
| `src/frontend/src/utils/longHorizonSim.ts` 532–536 | Explicit `telemetry.available: false`. `longHorizonSim.test.ts` 67 asserts the same. Synthetic model only. |
| `docs/ARCHITECTURE.md` Persistence table 37–50 | characters, Doka, profiles, buffs, achievements, Boss Rush, dungeon records, GameKey, config. **No event / analytics store.** |
| Admin dashboard tabs `AdminDashboard.tsx` 5611–5626 | Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. **No Intelligence / telemetry / Health tab.** |
| OQL `Expose` `main.mo` 3498–3882 | Player progress + admin catalogs + GameKey request/ledger (`characterSlots`, `dokaBalances`, `userProfiles`, `dungeonRecords`, configs, `bossRushStates`, …). **No telemetry entity.** |
| GitHub code search `repo:Mr-Melic/stralt` `recordTelemetry` / `telemetrySidecar` / `adminGetTelemetry` | **0 files** (`total_count: 0`). |
| GitHub PRs | [#122](https://github.com/Mr-Melic/stralt/pull/122), [#184](https://github.com/Mr-Melic/stralt/pull/184), [#260](https://github.com/Mr-Melic/stralt/pull/260) merged **TBC docs only**. [#283](https://github.com/Mr-Melic/stralt/pull/283) / [#295](https://github.com/Mr-Melic/stralt/pull/295) design (closed). Open telemetry-titled: [#333](https://github.com/Mr-Melic/stralt/pull/333) (docs, this analyst), [#345](https://github.com/Mr-Melic/stralt/pull/345) (dashboard design), [#352](https://github.com/Mr-Melic/stralt/pull/352) (architecture design). **0 open PRs** implementing collectors. |
| Open PR queue vs `main` | **61** drafts, oldest-first `#327` (Striker AoE), `#331` (portal destack), then the 2026-09-21 flock. Titles were scanned; none add `recordTelemetry` / sidecar / increment maps. |
| `git fetch origin/main` | Tip still `0f5363f`. Ahead/behind vs this branch at inspect: `0 0` before this docs commit. `58302bc..HEAD`: **158** commits, **70** first-parent merges (72 all-parent). Unchanged since the 2026-09-21 search. |
| Live canister query / exported dumps | **Not present** in this environment. |

`getLeaderboard`, `killCount`, current Doka (including GameKey purchase flow), spell-bar snapshots, achievement flags, Boss Rush best room, dungeon depth, and OQL `characterSlots` / `dokaBalances` remain **progress snapshots**, not telemetry. This run does not treat them as win/loss, duration, death-cause, or usage series.

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

ANALYSIS_ID: TBC-F-2026-09-22-001  
OBSERVATION: Gameplay telemetry infrastructure is still absent at HEAD `0f5363f`. `origin/main` did not move in the UTC day after the 2026-09-21 TBC search. The 158-commit / 70 first-parent-merge window since `58302bc` is unchanged. Sixty-one open draft PRs appeared around that flock; none emit or store player events. Design docs, `longHorizonSim`, debug click-trace, and sound-engine identifiers remain non-data. `AQA-2026-08-30-012` and prior TBC IDs are still `NEW`.  
DATA: Search table above. Comment at `WorldExploration.tsx` 16442–16446. `longHorizonSim.ts` 532–536 (`available: false`). Persistence table in `docs/ARCHITECTURE.md` 37–50. Admin tabs 5611–5626. GitHub collector search `total_count: 0`. Open collector PRs: 0. Open PR count: 61 (all draft).  
SAMPLE_SIZE: 0 player sessions; 0 battles; 0 spell casts; 0 deaths; 0 Doka ledger rows.  
CONFIDENCE: HIGH (absence of collectors and datasets is directly observed).  
POSSIBLE_EXPLANATIONS: Instrumentation was never implemented; 2026-08-31 through 2026-09-02 work produced design-only artifacts; persist-lock / Caffeine-import / EOP risk kept humans from shipping counters; AQA-012 remains unpicked; `main` is frozen while drafts accumulate.  
RECOMMENDED_ACTION: Do not change enemy stats, spells, XP, Doka, GameKey pricing, or content weights. Do not infer balance from source, from `longHorizonSim`, from architecture/dashboard docs, or from the open-PR flock. Keep this analyst gated. Implement the already-filed measurement set (`AQA-2026-08-30-012` then `TBC-2026-08-31-002`), following GTAD’s **off-lock** sidecar rule (do not enqueue on `progressPersistRef`).  
NEEDS_MORE_DATA: YES — every analysis domain.

ANALYSIS_ID: TBC-F-2026-09-22-002  
OBSERVATION: The 2026-09-21 TBC ledger is still an **unmerged draft** ([#333](https://github.com/Mr-Melic/stralt/pull/333)). Same-day open PRs [#345](https://github.com/Mr-Melic/stralt/pull/345) (Health matrix) and [#352](https://github.com/Mr-Melic/stralt/pull/352) (architecture) are design docs. [#357](https://github.com/Mr-Melic/stralt/pull/357) is a synthetic long-horizon sim. None of those are collectors, event rows, or a landed specialist packet on `main`. Treating an open docs PR as production telemetry would be a false positive.  
DATA: `gh pr list` 61 open drafts vs `main`. Telemetry-titled opens: `#333`, `#345`, `#352`. `#333` created 2026-09-21T00:07:58Z, still `draft=true`, not merged. `origin/main` tip still `0f5363f`.  
SAMPLE_SIZE: 0 telemetry rows. Open-PR count is not a session count.  
CONFIDENCE: HIGH (PR state and titles observed; no collector files on those PRs’ unique deltas from titles + `#333` file list).  
POSSIBLE_EXPLANATIONS: Oldest-first draft queue has not merged; humans have not picked AQA-012; dashboard/architecture automations keep writing design refreshes.  
RECOMMENDED_ACTION: Cite `#333` as an unmerged sibling, not as `main`. Do not flip `longHorizonSim.telemetry.available` from `#345`/`#352`/`#357`. Next TBC must still re-search collectors from scratch. Cursor Cloud Automations have no prompt write API from this agent.  
NEEDS_MORE_DATA: YES — still no usage/outcome series.

No OVERPERFORMING, UNDERPERFORMING, UNDERUSED, OVERUSED, DIFFICULTY_SPIKE, DIFFICULTY_COLLAPSE, CONTENT_NOT_DISCOVERED, POSSIBLE_EXPLOIT, or HEALTHY_VARIATION labels are assigned.

---

## Required measurements (still missing)

Backend-authoritative, append-only (or query-aggregable) events. Do not derive these from `updateCharacter` snapshots, combat source, `longHorizonSim`, OQL progress entities, open design PRs, or SFX names.

**Persist-lock correction (from [`TELEMETRY_ARCHITECTURE_2026-09-02.md`](./TELEMETRY_ARCHITECTURE_2026-09-02.md) / `GTAD-2026-09-01-002`):** do **not** enqueue telemetry on `createProgressPersist` / `progressPersistRef`. That clause in older AQA-012 text is superseded. Increments are fire-and-forget **after** persist helpers return, or query-only snapshot aggregates. Swallow sidecar errors. Missing bindgen method = no-op. Telemetry must never write HP / XP / Doka / spell levels.

Stralt has **no player level cap**. All events must carry `playerLevel` and content id so later analysis is **relative** (vs peers at similar level / vs that enemy’s own history), not vs a fictional endgame band.

1. **Battle outcome** — `battle_end`: encounter id, enemy/boss/challenge ids, result (`win` / `loss` / `flee` / `abort`), duration ms, player level, map/region/dungeon depth, death cause enum if loss (combat / reflect / lava / spikes / modifier / other — explicit metadata, not name heuristics). Not the SFX of the same name.
2. **Enemy / boss identity** — stable config id on every `battle_end` and kill credit.
3. **Spell cast** — `spell_cast`: spell id, level, encounter id, outcome tag if known (hit / miss / resist / no-target). Usage ≠ power. Not the SFX of the same name.
4. **Spell discovery** — `spell_discovered`: spell id, source enum (achievement / drop / shop / admin / other).
5. **Spell bar snapshot (optional, low rate)** — `spell_bar_set`: ordered ids.
6. **Challenge completion** — `challenge_end`: challenge id, success/fail, damage/AP credited flags.
7. **Doka ledger** — `doka_delta`: signed amount, reason (`applyRewards` / `upgradeSpell` / shop / heal / death_penalty / achievement / purchase / admin / GameKey). Wallet Nat and GameKey request rows alone are not earned/spent telemetry.
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
- No treating `longHorizonSim`, TELEMETRY_* design docs, debug click-trace, OQL snapshots, sound-engine event names, or unmerged `#333`/`#345`/`#352`/`#357` as player data.

## Feed to Master Technical Director

**STATUS WAITING_FOR_TELEMETRY.**

Still-open IDs (do not re-file): `AQA-2026-08-30-012`, `TBC-2026-08-31-001`, `TBC-2026-08-31-002`, `TBC-2026-09-01-001`, `TBC-2026-09-02-001`, `TBC-2026-09-02-002`, `TBC-2026-09-21-001`, `TBC-2026-09-21-002`.

New REPORT_ONLY IDs this run:

- `TBC-2026-09-22-001` — another UTC day; `main` still `0f5363f`; 61 open drafts; still 0 collectors / 0 rows.
- `TBC-2026-09-22-002` — unmerged telemetry-named PRs (`#333`, `#345`, `#352`) and sim `#357` are not live telemetry.

Do not schedule balance implementation from this run. Keep `longHorizonSim.telemetry.available = false` until APIs exist **and** are populated.

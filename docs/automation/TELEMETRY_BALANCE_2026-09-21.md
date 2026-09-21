# Telemetry-Driven Balance & Content Analyst — 2026-09-21

**Analyst:** Telemetry-Driven Balance & Content Analyst (`2786666f-a4a0-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-5c7f1478-6bb8-439f-aba4-43fa8c255665` (cron `0 */24 * * *`, triggered 2026-09-21 00:02 UTC)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332 from Mr-Melic/cursor/report-findings-orchestration-8493`, author date 2026-09-03)  
**Prior TBC report:** [`TELEMETRY_BALANCE_2026-09-02.md`](./TELEMETRY_BALANCE_2026-09-02.md) (merged as [#260](https://github.com/Mr-Melic/stralt/pull/260); inspected `58302bc`)  
**Gameplay / balance code:** not modified.

## STATUS: WAITING_FOR_TELEMETRY

Activation guard fired. Real gameplay telemetry is **absent**. This run does **not** invent measurements, does **not** infer win rates or spell strength from source, `longHorizonSim`, design docs, wallet snapshots, or the 158 commits since the last TBC inspection, and does **not** produce OVERPERFORMING / UNDERPERFORMING / DIFFICULTY_* / exploit classifications.

The 2026-08-31 adequacy gate is **not met**. Between last TBC (`58302bc`) and this HEAD, **70** merge PRs landed (combat, persist, EOP/GameKey chain, map integrity, economy, security, spell-discovery docs, telemetry **design** refreshes). None of those emit or store player events. This environment has **no** queryable event dump.

Calendar note (not player data): last landed TBC ledger is 2026-09-02; this cron is 2026-09-21; `origin/main` author-date stops at 2026-09-03 (`#332`). The 18-day calendar gap is **not** a sample of play.

No Master Technical Director **balance** packet is emitted. Durable outputs: this report and [`ACTION_IDS_TBC_2026-09-21.md`](./ACTION_IDS_TBC_2026-09-21.md). Existing IDs `AQA-2026-08-30-012`, `TBC-2026-08-31-001`, `TBC-2026-08-31-002`, `TBC-2026-09-01-001`, `TBC-2026-09-02-001`, and `TBC-2026-09-02-002` are **not re-filed**.

---

## Classification of statements

| Kind | This run |
| :--- | :--- |
| **OBSERVED FACT** | Fresh infrastructure search at HEAD `0f5363f`. Collectors still missing. Event dumps still 0 rows. `longHorizonSim.telemetry.available === false`. SoundEvent names `spell_cast` / `battle_end` remain audio only. GitHub collector symbol search `total_count: 0`. Open collector PRs: 0 (`#327` Striker range, `#331` portal destack). Prior ACTION_IDs still `NEW`. |
| **HYPOTHESIS** | None about player behavior, enemy difficulty, spell strength, economy, or content discovery. |
| **RECOMMENDATION** | Stay in `WAITING_FOR_TELEMETRY`. Do not schedule `BAL-*` from this packet. Do not treat architecture/dashboard docs (`#283`, `#295`), the synthetic sim, debug click-trace, or the sound engine as measurements. Implement the already-filed event set before any later run claims a balance finding. |

---

## Adequacy gate (re-evaluated)

From [`TELEMETRY_BALANCE_2026-08-31.md`](./TELEMETRY_BALANCE_2026-08-31.md). All four must be true to leave this status.

| Criterion | This run |
| :--- | :--- |
| Collectors 1–9 exist in the live actor (or an export fed by that actor), not only in a design doc | **Fail.** No `recordTelemetryIncrements`, no increment maps, no event schema in `src/backend`. Bindgen `backend.ts` has 0 telemetry methods. OQL `Expose` lists progress/config entities only (no telemetry store). |
| At least one complete UTC day of events is queryable | **Fail.** No export path, no dashboard data, no canister query, no `csv`/`jsonl`/`parquet` dumps. |
| Per-entity sample sizes are stated; small N stays `NEEDS_MORE_DATA` | **N/A.** Sample size is 0 in every domain. |
| Low spell usage is cross-checked against discovery, rarity, and exposure before UNDERPERFORMING | **N/A.** No `spell_cast` telemetry rows (the identifier exists only as a WebAudio event name). |

---

## Evidence sources (what was actually checked)

| Source | Result |
| :--- | :--- |
| Repo glob `**/*telemetry*` | Design/report docs only (architecture, dashboard, prior TBC WAITING reports). No collector module. Newest TBC ledger remains 2026-09-02. |
| Repo glob `**/*.{csv,jsonl,parquet}` | **0 files** |
| Repo glob `**/telemetrySidecar*` | **0 files** |
| `src/backend` grep `recordTelemetry` / `telemetryLifetime` / `adminGetTelemetry` / `incrementTelemetry` / `telemetryEvents` | **0 hits** |
| `src/frontend/src/backend.ts` grep same | **0 hits** |
| `src/` grep `telemetry` | Three product hits: WX empty comment; `longHorizonSim.ts` `available: false`; test asserting that. Rest are docs. |
| `src/` grep `doka_delta` / `spell_discovered` / `content_seen` / `logEvent` / `trackEvent` | **0 hits** |
| `src/` grep `battle_end` / `spell_cast` | **Sound engine only** (`useSoundHooks.ts` 7–16, `soundEngine.ts` 272 / 306). Not an event log. |
| `src/` grep PostHog, Mixpanel, Sentry, Amplitude, Segment, Plausible, Umami, GA4, `eventLog`, `metricsStore` | **No collector.** `pulseAmplitude` in `StarfieldBackground.tsx` is a render parameter. `intelligence?: number` on `gameTypes.ts` 307 is a stat field, not a dashboard. |
| `src/frontend/package.json` dependencies | IC agent / UI / R3F / recharts. **No analytics SDK.** |
| `WorldExploration.tsx` 16442–16446 | Comment only: “caller-side telemetry” around `action.intent`. Empty `if (action.intent)` block. No emit. |
| `src/frontend/src/debug/clickTrace.ts` 1–8 | DEV-only local ring buffer. File header: never shipped to normal players. **Not production telemetry.** |
| `src/frontend/src/utils/longHorizonSim.ts` 532–536 | Explicit `telemetry.available: false`. `longHorizonSim.test.ts` 67 asserts the same. Synthetic model only. |
| `docs/ARCHITECTURE.md` Persistence table 37–50 | characters, Doka, profiles, buffs, achievements, Boss Rush, dungeon records, GameKey, config. **No event / analytics store.** |
| Admin dashboard tabs `AdminDashboard.tsx` 5611–5626 | Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. **No Intelligence / telemetry / Health tab.** |
| OQL `Expose` `main.mo` 3498–3882 | Player progress + admin catalogs + GameKey request/ledger. **No telemetry entity.** |
| GitHub code search `repo:Mr-Melic/stralt` `recordTelemetry` / `telemetrySidecar` / `adminGetTelemetry` | **0 files** (`total_count: 0`). Commit search for those symbols: **0**. |
| GitHub PRs | [#122](https://github.com/Mr-Melic/stralt/pull/122), [#184](https://github.com/Mr-Melic/stralt/pull/184), [#260](https://github.com/Mr-Melic/stralt/pull/260) merged **TBC docs only**. [#283](https://github.com/Mr-Melic/stralt/pull/283) dashboard design. [#295](https://github.com/Mr-Melic/stralt/pull/295) architecture design. **0 open PRs** implementing collectors. Open vs `main`: [#327](https://github.com/Mr-Melic/stralt/pull/327) (Striker AoE), [#331](https://github.com/Mr-Melic/stralt/pull/331) (portal destack). Neither touches telemetry docs or collectors. |
| `git log` `58302bc..0f5363f` | **158** commits, **70** merge PRs. Telemetry-named merges are **docs** (`#260` TBC, `#283` dashboard, `#295` architecture). **No increment API.** |
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

ANALYSIS_ID: TBC-F-2026-09-21-001  
OBSERVATION: Gameplay telemetry infrastructure is still absent at HEAD `0f5363f`. Since the 2026-09-02 TBC run (`58302bc`), 158 commits / 70 merge PRs landed through `#332`. Combat, persist, EOP/GameKey, map, economy, and security work shipped. Telemetry-named merges `#283` and `#295` are design docs only. None emit or store player events. Design docs, `longHorizonSim`, and debug click-trace remain non-data. `AQA-2026-08-30-012` and prior TBC IDs are still `NEW`.  
DATA: Search table above. Comment at `WorldExploration.tsx` 16442–16446. `longHorizonSim.ts` 532–536 (`available: false`). Persistence table in `docs/ARCHITECTURE.md` 37–50. Admin tabs 5611–5626. GitHub collector search `total_count: 0`. Open collector PRs: 0.  
SAMPLE_SIZE: 0 player sessions; 0 battles; 0 spell casts; 0 deaths; 0 Doka ledger rows.  
CONFIDENCE: HIGH (absence of collectors and datasets is directly observed).  
POSSIBLE_EXPLANATIONS: Instrumentation was never implemented; 2026-08-31 through 2026-09-02 work produced design-only artifacts; persist-lock / Caffeine-import / EOP risk kept humans from shipping counters; AQA-012 remains unpicked.  
RECOMMENDED_ACTION: Do not change enemy stats, spells, XP, Doka, GameKey pricing, or content weights. Do not infer balance from source, from `longHorizonSim`, or from architecture/dashboard docs. Keep this analyst gated. Implement the already-filed measurement set (`AQA-2026-08-30-012` then `TBC-2026-08-31-002`), following GTAD’s **off-lock** sidecar rule (do not enqueue on `progressPersistRef`).  
NEEDS_MORE_DATA: YES — every analysis domain.

ANALYSIS_ID: TBC-F-2026-09-21-002  
OBSERVATION: No `TELEMETRY_BALANCE_*.md` ledger exists for 2026-09-03 through 2026-09-20. GitHub commit search for `TELEMETRY_BALANCE` returns only the 2026-08-31 / 09-01 / 09-02 reports. This 2026-09-21 cron is the first in-repo TBC re-check after `#260`. That calendar silence is **not** a player-behavior sample and is **not** evidence that collectors appeared off-branch.  
DATA: Repo glob `docs/automation/TELEMETRY_BALANCE_*` = 2026-08-31, 2026-09-01, 2026-09-02 only. GitHub commit search `repo:Mr-Melic/stralt TELEMETRY_BALANCE` = 6 hits, none after 2026-09-02. `origin/main` tip author-date 2026-09-03 (`0f5363f`).  
SAMPLE_SIZE: 0 telemetry rows. Cron-gap days are not sessions.  
CONFIDENCE: HIGH (absence of later ledgers in the repo and on default-branch commit search).  
POSSIBLE_EXPLANATIONS: Daily TBC runs did not land PRs; runs failed; dashboard cron was paused; this is the first successful landing after `#332`. This run does not distinguish among those.  
RECOMMENDED_ACTION: Treat the 18-day calendar gap as process hygiene, not play data. Next TBC must still re-search collectors from scratch. Cursor Cloud Automations have no prompt write API from this agent — do not claim the cron was patched.  
NEEDS_MORE_DATA: YES — still no usage/outcome series. Dashboard cron health is out of band.

No OVERPERFORMING, UNDERPERFORMING, UNDERUSED, OVERUSED, DIFFICULTY_SPIKE, DIFFICULTY_COLLAPSE, CONTENT_NOT_DISCOVERED, POSSIBLE_EXPLOIT, or HEALTHY_VARIATION labels are assigned.

---

## Required measurements (still missing)

Backend-authoritative, append-only (or query-aggregable) events. Do not derive these from `updateCharacter` snapshots, combat source, `longHorizonSim`, OQL progress entities, or SFX names.

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
- No treating `longHorizonSim`, TELEMETRY_* design docs, debug click-trace, OQL snapshots, or sound-engine event names as player data.

## Feed to Master Technical Director

**STATUS WAITING_FOR_TELEMETRY.**

Still-open IDs (do not re-file): `AQA-2026-08-30-012`, `TBC-2026-08-31-001`, `TBC-2026-08-31-002`, `TBC-2026-09-01-001`, `TBC-2026-09-02-001`, `TBC-2026-09-02-002`.

New REPORT_ONLY IDs this run:

- `TBC-2026-09-21-001` — 158 commits / 70 merge PRs through `#332` still produced 0 collectors / 0 rows.
- `TBC-2026-09-21-002` — no in-repo TBC ledger 2026-09-03..2026-09-20; calendar gap is not play data.

Do not schedule balance implementation from this run. Keep `longHorizonSim.telemetry.available = false` until APIs exist **and** are populated.

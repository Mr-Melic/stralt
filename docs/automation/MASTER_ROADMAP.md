# Stralt Master Roadmap

**Director:** Stralt Master Technical Director (`0b92479e-a49e-11f1-a7d1-d6b4613131ce`)  
**Run:** 2026-10-27 00:01 UTC (daily cron)  
**This agent:** `bc-149fb345-16c4-4e64-b793-853da4693811`  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (accepted-challenge HUD) — **unchanged since 2026-09-03 00:28 UTC**  
**Prior director:** unmerged [`#1124`](https://github.com/Mr-Melic/stralt/pull/1124) (`bc-07a3a496-74a2-483d-bcb9-6d92b9fa5510`, 2026-10-26). On `main`, this file is still the 2026-09-02 text.  
**Gameplay / production code:** not modified.

This file is the living prioritized roadmap. ACTION_ID records for this run live in [`ACTION_IDS_2026-10-27.md`](./ACTION_IDS_2026-10-27.md). Close superseded director PRs **#338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, #946, #998, #1074, and #1124** when this lands — do not merge all sixteen. Process audit on `main`: [`QUALITY_AUDIT_2026-08-30.md`](./QUALITY_AUDIT_2026-08-30.md). Unmerged weekly audit: [`#1106`](https://github.com/Mr-Melic/stralt/pull/1106) (2026-10-18→10-25). Dump yards: `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, and the unmerged 09-21…10-26 ledgers. Do not append to those files.

## Evidence available this run

| Source | Status |
| :--- | :--- |
| `AGENTS.md`, `README.md`, `DESIGN.md`, `docs/ARCHITECTURE.md` | Read. `ARCHITECTURE.md` line 28 still says `check-limit = 4`; `mops.toml` is `5`. Stale docs, not a Motoko bug. |
| Prior director roadmap (2026-10-26, unmerged #1124) + memories | Read. Halt-as-config asked again, including daytime cadences (MTD-2026-10-24-005). Humans still have not merged `main`. |
| Specialist reports on `main` | Still the 08-30…09-02 set. Later catalogs live only on unmerged drafts. |
| Unmerged 2026-10-26 specialist PRs | Full day `#1108`–`#1162` (**55** drafts). TBC `#1108` WAITING (fifteenth inspection of `0f5363f`; 0 collectors). Wave 18 catalogs `#1112/#1114/#1132/#1134/#1135/#1138/#1139/#1143`. WX extract `#1109`. Soak/tax `#1136/#1142`. Admin `#1115`. |
| Open ACTION_IDs | Reuse. Director index = this file + `ACTION_IDS_2026-10-27.md`. |
| Recent commits | `git log` since 2026-09-03: **none** on `origin/main`. Last merge `#332`. |
| Open drafts | GraphQL **831** at first search (`is:open`). 10-26 flock opened **55** (`#1108`–`#1162`). This hour already `#1163`–`#1164` (enemy/boss admin re-audit; Enthroned Void kit-first Swap test mill). |
| Player telemetry | **Still none.** `longHorizonSim.telemetry.available === false`. No `recordTelemetry` / sidecar in `src/`. TBC stays `WAITING_FOR_TELEMETRY`. |
| Same-hour flock | **52** automations this hour: **47 RUNNING**, **5 IDLE**, **0 ERROR**. Map guardian, AI, combat-parity, complexity, spell mechanics, spell discovery, boss, dungeon, expansion, critical hunter `1aa41c6c`, persist auditor, world-content, invariants, security, TBC, telemetry dashboard, admin implementer are RUNNING. Approved Design, docs sync, contract guardian, and two admin-audit UUIDs are **enabled** but IDLE in the first complete snapshot. |
| Weekly quality audit `#1106` | ENGINEERING corroboration from the prior week: 436 automation runs, 292 drafts, 0 merges, 0 closes. Classifies map/persist/combat/#62 paint as NEGATIVE_ROI. Agrees halt + do-not-merge-burst. No newer weekly audit on 10-26. |

**Evidence classes used below**

| Class | Meaning |
| :--- | :--- |
| MEASURED PLAYER BEHAVIOUR | Live play counters. **None exist.** |
| DESIGN INTERPRETATION | Product rules in this prompt + `AGENTS.md` / `DESIGN.md` / specialist design docs |
| ENGINEERING EVIDENCE | Code on `0f5363f`, tests, open-PR mill, automation volume, hotspot call sites, `#1106` process audit |

Telemetry is not allowed to set priority. Correlation is not causation. No CLEAR_POSITIVE_SIGNAL is claimed.

---

## What changed since the 10-26 director run (do not rediscover)

`main` **did not move.** The 10-26 halt was ignored as dashboard config and **obeyed as human merge-stop**.

| Fact | 10-26 director | This run |
| :--- | :--- | :--- |
| HEAD | `0f5363f` (53 days) | `0f5363f` (**54 days**) |
| Open drafts | 776 at first search; `#1108`–`#1120` already open | GraphQL **831** at first search. 10-26 finished at `#1162`. This hour already `#1163`–`#1164` |
| 10-21 … 10-25 mill | 56 + 58 + 52 + 63 + 65 = 294 | Still unmerged |
| 10-26 implementer flock | 48 RUNNING; hold | **Did not hold.** Opened **55** PRs (`#1108`–`#1162`) **across the whole day** (00/04/06/08/12/16/18 UTC). 00:00 = 37; after 01:00 = **18** |
| Director snapshots on the living files | 15 unmerged (#338…#1074 + #1124 in flight) | **16** unmerged once #1124 is counted. `main` still serves 09-02 |
| #327 Striker | CONFLICTING, 54 days | CONFLICTING, **55 days**. Still the oldest open PR (`mergeable_state: dirty`) |
| #331 destack | CONFLICTING | Still CONFLICTING (`dirty`) |
| Caffeine 20260901 deploy | Unconfirmed; `.old` Aug-31 no-GameKey | Unchanged. Grep GameKey in `.old` = 0. Newest deployed snapshot still `pr259-tail-20260901.most` |
| Reward-trust ADR | Missing | Still 0 `docs/**/*ADR*` |
| Telemetry collectors | 0 | 0. TBC `#1108` correctly WAITING (fifteenth inspection). Tonight’s TBC is RUNNING (sixteenth incoming) |
| 10-27 flock | n/a | **47 RUNNING** + 5 IDLE. **0 ERROR.** Same implementer UUIDs still **enabled**. First drafts `#1163`/`#1164` already open |
| Skip-wipe mill | 93 titled skip remount | **~100**. 10-26 added leftover-Doka wipe twins `#1129/#1145/#1147/#1149/#1151/#1153/#1157` |
| Advertised / pack-enemy mill | 25 pack-enemy combat | Grew. 10-26 added `#1123/#1148/#1150/#1155/#1158/#1160` |
| Soak mill | `#1079/#1084/#1097/#1100` | Plus **`#1136`** (controlled-summon walk tax) and **`#1142`** (Plague Zone tick) |
| Map punches | 10-25 added four snaps | 10-26 added `#1127/#1146/#1154/#1161`. Guardian RUNNING tonight |
| WX extracts | `#831/#842/#901/#961/#995/#1076` | Plus **`#1109`** in-battle portal-cube paint. Complexity reduction RUNNING tonight |
| Pale Archivist / kit-HP tests | 13 Pale Archivist titles | Continues: `#1113` plus Enthroned Void `#1152/#1159/#1164`. Test mill, not 13 P0s |
| TBC WAITING clones | 14 dated reports | **15** dated reports (`#333`…`#1108`) |

**Integrity that remains landed on `main` (do not re-open):** death replay `#183/#255/#256`, live Doka helpers `#180`, ignore-client `writeLevel`, AP/MP cap `#322`, bindgen summon fields, Pacifist preview, recap-under-credit gate, GameKey product `#258` + EOP source `#259/#311/#324`, Frozen/Slime execute MP `#313/#318`, barrier-aware `isBattleWalkTileBlocked`, spawnPolicy extract `#287`, challenge HUD `#332`, Enemy Register lore `#328`, Caffeine import gates + stack-compat.

**10-26 leftovers that are NOT done:** halt (including 06/12/18); living director index on `main`; Caffeine deploy confirmation; ADR; `#327` restack; mapGen/WX freeze; Swap landing; kit-zone number; discovery persist; admin DVA; `saveKillCount`; 30% random AI tier; share-kit helper; skip-wipe helper; soak helper.

**New this run (not a rediscovery of 10-26):**

1. **Six recovered days in a row rebuilt the mill.** 10-21 opened 56; 10-22 opened 58; 10-23 opened 52; 10-24 opened 63; 10-25 opened 65; **10-26 opened 55**. Combined: **349 drafts in six days**. Queue 482 → 538 → 596 → 648 → 711 → 776 → **831**.
2. **MTD-2026-10-24-005 failed a third recovered day.** 10-26 gameplay kept shipping at 04:18 (`#1145`), 06:10–06:27 (`#1146/#1147/#1148`), 08:08–08:19 (`#1149`–`#1152`), 12:10–12:25 (`#1153`–`#1156`), 16:08–16:16 (`#1157`–`#1159`), 18:14–18:27 (`#1160`–`#1162`). After 01:00 = **18 of 55**.
3. Skip-wipe remount mill grew **93 → ~100**. Local patches are no longer sufficient (MTD-2026-10-23-005 still OPEN).
4. Soak-like-`playerTakesDamage` mill grew (`#1136/#1142`). After halt: one soak/landing helper, not a seventh effect. Related to MIMA-001 `applyHazardLanding`, not a third persist rewrite.
5. Pack-enemy / advertised-execute mill grew again (`#1123/#1148/#1150/#1155/#1158/#1160`). One `resolveKitExecute` helper after halt (MTD-2026-10-22-005).
6. 10-26 touched the freeze file again: `#1109` portal-cube extract from WX. Hold it with `#831/#842/#901/#961/#995/#1076`. Quality audit `#1106` still scores the paint-extract strategy as NEGATIVE_ROI / FAKE MODULARITY.
7. 10-27 first minutes already opened `#1163` (admin re-audit) and `#1164` (Enthroned Void test mill). Combined recovered mill without dashboard disable is now the **steady state**, including the first minutes of day seven.
8. `#1124` did not land. Oldest-first still blocks the living index (MTD-2026-09-25-005). Close list now includes `#1124`.

---

## Seven-dimension evaluation

### 1. Correctness — official client still safer than the leftover queue

ENGINEERING: Death replay, live Doka refs, ignore-client level, GameKey, Frozen/Slime execute MP, and barrier-aware walk rejects remain on `main`. Do not open a fourth persist rewrite.

Recurring defect class: **teleport / soak landing.** Swap still copies coordinates (`WX` 9389–9402) with no occupancy or hazard tax. Soak mill (`#1079/#1084/#1097/#1100/#1136/#1142`) is the same missing helper filed six times. Local per-effect patches are **no longer sufficient**. Controlled intervention: one `applyHazardLanding` (or equivalent) after halt. Do not concatenate the six PRs.

Recurring defect class: **advertised vs execute.** Pack-enemy / share-kit / one-flag combat PRs keep growing `spellEngine.ts` and WX. One `resolveKitExecute` helper after halt (MTD-2026-10-22-005). Do not merge the mill.

Recurring defect class: **kit zone NaN.** `buildEnemyKit` expects a number (`enemyAI.ts` 194–197). Battle start still passes a LevelZone **object** (`WX` 11920). `currentZoneTier` already exists at line 1136. Eighteenth director cycle. Cheapest unlock of dynamic enemy spell pools — **P2 after halt**, not tonight.

Recurring defect class: **Striker AoE honesty.** #327 is still the oldest open PR and still CONFLICTING (55 days). #370 is the later union (AI/summon casts) and is `clean`. Restack #327, then union #370. Do not twin a third Striker PR.

Recurring defect class: **EOP stables.** Source chain is correct. Live Caffeine `.old` is still Aug-31 no-GameKey. Do not stuff fields into `20260831` or `20260901`.

### 2. Player experience — honesty on `main`; identity still incomplete

ENGINEERING: HUD leftover XP, recap feats, recap-under-credit input gate, Buy Doka vs Items, BuffShop `inventoryRef` consume, Pacifist preview, challenge HUD `#332`, Enemy Register lore `#328`. Those were unique; do not re-implement.

DESIGN (PXA + Expansion + Spell Admin, no player data): the player is still handed the live catalog on minute one (`shouldIncludeBackendSpellInLibrary` returns true whenever `usableByPlayer !== false`). Enemy-observed discovery is **not implemented**. Achievement/challenge/boss rewards remain Doka/XP, not spells. Four map modifiers are announce-only stubs.

MEASURED: none. Do not claim spells are over/underused. A Wave 18 catalog that “players will love” is DESIGN INTERPRETATION.

### 3. Technical health — freeze file + leftover queue

| Surface | Lines now | Verdict |
| :--- | ---: | :--- |
| `WorldExploration.tsx` | 19,213 | Freeze broken. `#1109` is the latest paint extract |
| `AdminDashboard.tsx` | 8,280 | No canister DVA. Hold `#1115` |
| `enemyAI.ts` | 2,580 | Frozen size; do not grow tonight |
| `main.mo` | 3,903 | GameKey + clamps in source; live `.old` still Aug-31 |
| `mapGen.ts` | 1,937 | Freeze broken; four more snaps on 10-26 |
| `progressPersist.ts` | 421 | Leave it. Skip-wipe mill is remount policy, not a lock rewrite |
| `targeting.ts` | 1,199 | Leave it |
| `deathPenalty.ts` | 597 | Leave it after `#256` |

`#1106` independently called #62-style WX paint extracts FAKE MODULARITY. Complexity-reduction `386a157d` is RUNNING again tonight.

Stale paths remain documented, not live bugs: `dfx.json` → missing `src/backend_extended`; root `declarations/` 15-field snapshot; unused `src/backend/mixins/*`.

### 4. Content depth — over-specified, under-wired

Present on `main`: player-relative tier spawn, AI tiers 1–10, named boss kits, dungeon chain, Boss Rush (10 rooms), 9 challenges, feats, frontend catalog + GameKey shop.

Dead or contradictory vs core rules (DESIGN + ENGINEERING):

- `buildEnemyKit(..., currentMap.levelZone)` still passes an **object** → zone-0 kits forever.
- `computeAITier` still has a **30% fully random 1–10** roll (`combatMath.ts` 34–50).
- Dual spell catalogs (frontend starters vs canister). Admin adding a catalog spell still grants it to every player on hydrate.
- `worldFeatures.ts` still tests-only; no WX import.
- Wave 17/18 expansion catalogs (`#1112/#1114/#1132/#1134/#1135/#1138/#1139/#1143`) overlap SDA/SDE/EBA/FORMATIONS/ELITE. That is **expansion overlap**, not a license to implement.

### 5. Long-term scalability — rules vs implementation

| Core rule | Implementation on `0f5363f` |
| :--- | :--- |
| No character level cap | Yes (`applyRewards` Nat loop). HUD saturates at 48 (HOLD; do not retune). |
| Increasing XP | Yes `100 * 2^(N-1)`. Practical wall ~level 15–22 on kill XP is DESIGN, not a tonight bug. |
| Player-relative enemies | Yes until the 999-tier ceiling. |
| Progressively sophisticated enemies | Partial; 30% random tier + zone-0 kits undermine it. |
| Dynamic enemy spell pools | Boss phases yes; overworld = static piece kits stuck at zone 0. |
| Enemy-observed spell discovery | **Absent** |
| Achievement / challenge / boss spell unlocks | Rewards are Doka/XP |
| Backend-authoritative persistence | Wallet/XP/death yes (clamped; level pinned). Combat client-side. GameKey redeem is canister-authoritative **in source**; live Caffeine previous-version signature is still Aug-31. |
| Optional owner-uploaded visuals + pixel fallback | Still true. Do not make URLs required. |
| Admin Draft → Validate → Activate | **Not a canister workflow.** |

Expansion that adds spells, AI behaviors, or admin chrome **before** halt, landing-authority extraction, and a reward-trust ADR will not scale.

### 6. Data / persistence safety — official client safer; deploy + skip-wipe mill

`saveBattleStats` may still **lower** Doka/XP (required for heals/spends/death). It must not raise them — that write is on `main`. Finding 3 is still stale if phrased as “must not write Doka.” Client level can no longer demote.

`applyRewards` is still client-trusted **within** 100k/500k. Custom clients can still drip-mint. `calculateAndAwardDoka` remains an unused public mint.

Skip-wipe mill (~100 twins) is a remount-policy hole, not a new persist lock. After halt: one hydrate-wipe guard (MTD-2026-10-23-005). `#391` unpaid-death honour on GameKey redeem is a **different** helper and is still unwired (`shopPurchase.ts` 294–330).

Caffeine `.old` is still the Aug-31 no-GameKey signature. Do not hand-write it. Confirm deploy (MTD-2026-09-21-002).

### 7. Automation coherence — P0, sixth recovered mill day, seventh midnight launching

AQA-001…012 were written 08-30. Humans then froze `main` (merge-stop) while leaving implementers **enabled** (config miss). Recovery after the 09-30…10-20 ERROR outage rebuilt the mill for **six consecutive days**.

This 00:00 UTC window launched **52** automations — 47 RUNNING — including map guardian, combat parity, persist auditor, Approved Design (IDLE first snapshot), complexity reduction, admin implementer, expansion, AI, boss, dungeon, spell mechanics, spell discovery, critical hunter, and invariants.

That is exactly “P2/P3 expansion displacing unresolved P0/P1.”

| AQA / MTD ID | Director status 2026-10-27 |
| :--- | :--- |
| AQA-001 hunter throttle | **OPEN** — `996df6df` still not GetAutomation-visible. |
| AQA-002 one critical hunter | **OPEN** — `1aa41c6c` enabled and RUNNING tonight. |
| AQA-003 in-repo ACTION_ID ledger | **PARTIAL** — this file + dated director ledger. Living index still off `main`. |
| AQA-006 no mapGen implementation | **BROKEN** — four more snaps on 10-26; guardian RUNNING. |
| AQA-007 freeze drive-by WX | **BROKEN** — `#1109` plus complexity reduction RUNNING. |
| AQA-008 security → ADR | **PARTIAL** — clamps on `main`; no ADR. Security RUNNING tonight. |
| AQA-012 outcome telemetry | **OPEN** — TBC correctly WAITING. Dashboard specialist RUNNING with nothing to display. |
| MTD-001 flock halt | **OPEN** — failed as config for six recovered days. Held as merge-stop for 54 days. |
| MTD-2026-10-24-005 daytime halt | **OPEN** — failed a **third** recovered day (18 of 55 after 01:00). |

Cursor Cloud has **no write API** for dashboard prompts. Halt is a human config action. In-repo gates are the enforceable half. Do not merge-burst to “fix” stack-compat.

---

## Recurring hotspots — local patches no longer sufficient

Do **not** automatically perform a large refactor.

1. **Automation flock** — six recovered mill days, 349 drafts, 831+ leftovers. This is still the binding constraint. Disable implementers at **every** cadence, not only 00:00.
2. **Landing / soak authority** — Swap + summon-walk + reflect + leftover-walk + Plague Zone. One `applyHazardLanding` after halt. Hold the six soak/tax PRs and `#541/#754`.
3. **Remount wipe** — ~100 skip-wipe twins. One hydrate-wipe guard after halt. Do not fold `#391` into it.
4. **Advertised vs execute** — one `resolveKitExecute` after halt. Hold pack-enemy / share-kit / one-flag combat.
5. **EOP / frozen NewActor** — source is correct. Confirm Caffeine deploy; never hand-write `.old`; never amend `20260831` / `20260901`.
6. **Kit-zone number** (PREREQ-A) — not a refactor. One call site. Wait until the flock is held.
7. **Canister trust** — write the ADR (AQA-008). Until it exists, no new credit APIs and no discovery grant writer.

HP/death extraction (MTD-003) is still valid. Do not start it in the same hour as the flock.

---

## Human merge queue (do not autonmerge)

| Order | PR | Action |
| :--- | :--- | :--- |
| 1 | **This living index** | After closing superseded director snapshots (MTD-2026-10-27-002). Docs only. |
| 2 | **#327** | Restack onto `0f5363f` (CONFLICTING, 55 days). Unique leftover gameplay. |
| 3 | **#370** | Union unique AI/summon Striker delta **after** #327. Do not twin. |
| — | **#362** | Unique GameKey serial + keep-store. After halt; no new stables. |
| — | **#391** | Unique unpaid-death helper. Still does not wire redeem. After halt; do not fold into skip-wipe. |
| — | **#380 / #385 / #667 / #664 / #536 / #517 / #354** | Unique leftovers. After halt. |
| — | **#331** | **HOLD.** CONFLICTING map destack. |
| — | **#541 / #754 / #850** | **HOLD** Swap mill. |
| — | Skip-wipe / pack-enemy / soak / map snap / WX extract / Pale Archivist / Enthroned Void test mills | **HOLD.** Close twins after one helper each. |
| — | `#1108` and later TBC WAITING clones | Keep `#333`; close twins. |
| — | `#1106` | Quality audit agrees halt. Do not merge its ledger ahead of this index. |
| — | Tonight’s `#1163`/`#1164` and the rest of the 10-27 wave | Default **HOLD**. |

Do not restack death-replay, `writeLiveDoka`, `writeLevel`, leftover-XP HUD, recap click-through, GameKey product code, Frozen execute MP, challenge HUD, or Enemy Register lore.

---

## Prioritized roadmap (what to work next)

**P0 — do these before any expansion PR merges**

1. Halt the 10-27 same-hour implementer flock **and** the 06/12/18 cadences (MTD-2026-08-31-001, MTD-2026-10-27-001, MTD-2026-10-24-005).
2. Do not merge-burst the 831+ leftover drafts (MTD-2026-10-27-004).
3. Close superseded director PRs #338…#1124; land this living index (MTD-2026-10-27-002 / MTD-2026-09-25-005).
4. Confirm Caffeine 20260901 GameKey deploy + refresh `.old` (MTD-2026-09-21-002). Freeze new stables until that lands (MTD-2026-09-02-003).
5. Write the reward-trust ADR (AQA-008).

**P1 — infrastructure / gameplay integrity (after halt)**

6. Restack/merge #327 Striker, then union #370 (MTD-2026-09-21-003 / MTD-2026-09-22-004).
7. Re-freeze `mapGen.ts`, `targeting.ts`, `enemyAI.ts`, and WX drive-bys (AQA-006, AQA-007).
8. One remount-wipe guard; close ~100 skip-wipe twins (MTD-2026-10-23-005).
9. One `resolveKitExecute` helper; close pack-enemy twins (MTD-2026-10-22-005).
10. One `applyHazardLanding` / soak helper; hold Swap `#541/#754` (MIMA-001, MTD-2026-10-26-005).
11. #391 GameKey unpaid-death helper, then redeem wire (MIMA-2026-09-02-003).
12. #362 GameKey serial / saveActiveSpells keep-store.
13. Controlled HP/death extraction (MTD-003) **after** landing helpers — not tonight.

**P2 — high-value expansion (after P0/P1, not this hour)**

14. Outcome counters, then maybe a dashboard (AQA-012 before TADD UI).
15. Fix kit-zone call site (EXPANSION-PREREQ-A) — pass a **number**. Eighteenth cycle.
16. Enemy-observed spell discovery + ownership maps (SDA-002/004). New later migration after deploy, not a stuffed NewActor.
17. Admin Draft → Validate → Activate on the canister (MTD-006). Do not grow the 8.3k dashboard first.
18. Seed frontend starter ids; stop treating `usableByPlayer` as ownership (SDA-007).
19. Revisit `computeAITier` 30% random vs progressive sophistication (MTD-008). Report/design, not an `enemyAI.ts` rewrite.
20. Wire `saveKillCount` or drop it from the leaderboard (MTD-005).

**P3 — polish**

21. Recap / HUD leftovers already shipped — do not restack.
22. #354 Feats copy and #517 empty Map Effects are leftover unique display.
23. Visual / game-feel / mobile — DESIGN.md already specifies the look. Do not edit combat math or WX for feel.

Do not let P2/P3 expansion PRs from the leftover queue, the 10-21…10-26 mills, or the 10-27 00:00 wave displace the P0/P1 list.

---

## Contradictions and duplicates (do not re-litigate)

| Conflict | Resolution |
| :--- | :--- |
| Security “don’t write Doka from `saveBattleStats`” vs ARCHITECTURE | Write stays; **clamp / no-mint**. ADR still required. |
| Solvability vs `AGENTS.md` mapGen | Freeze. Hold snaps. |
| Progressive AI vs 30% random tier | Design decision later; no first-hour AI PR. |
| SDA vs SDE vs SPELL_DISCOVERY vs EBA vs BOSS docs | One discovery persist shape (SDA-002/004). Others are content cards, not parallel schemas. |
| Expansion specialists vs “P0/P1 first” | Tonight’s wave is the violation. Hold their PRs. |
| Telemetry dashboard vs no counters | AQA-012 first. TBC stays WAITING_FOR_TELEMETRY. |
| Empty / Aug-31 `.old` vs GameKey source | Source is ahead of deploy. Confirm deploy; do not revert GameKey product. |
| `#1106` weekly audit vs this index | Same halt. Do not merge `#1106` ahead of this file. |
| Skip-wipe mill vs `#391` unpaid-death | Different helpers. Do not concatenate. |
| Soak mill vs Swap `#541/#754` | Same landing authority. One helper; hold all. |

---

## TOP 5 CURRENT PRIORITIES

1. **Halt the 10-27 00:00 implementer flock and the 06/12/18 cadences.** 52 automations (47 RUNNING). First drafts `#1163`/`#1164` already exist. Especially hold mapGen, persist, targeting, `enemyAI`, AdminDashboard, `main.mo` stables, telemetry UI, soak, skip-wipe, pack-enemy, WX extracts.
2. **Do not merge-burst the 831+ leftover drafts.** Six recovered days opened 349 PRs. Close superseded director snapshots; restack #327 only.
3. **Confirm Caffeine 20260901 GameKey deploy and refresh `.old`.** Source is correct; live previous-version signature is still Aug-31 no-GameKey.
4. **Write the reward-trust ADR (AQA-008).** Clamps landed; the written decision did not. Security is running again tonight.
5. **After halt: one helper each** for skip-wipe, kit-execute, and hazard landing — then restack #327. Not tonight.

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

## SAFE EXPANSION WORK

- Close superseded director PRs and land this index (process, not gameplay).
- Design-only (no PR merge): keep SDA/SDE/EBA catalogs; do not author a fifth discovery schema.
- Query-only / persist-lock-enqueued counters (AQA-012) — **design + tiny isolated PR after flock halt**, not a dashboard.
- Kit-zone number fix (PREREQ-A) **after** the flock is held — one call site + `enemyAI` test, no WX growth.
- Display-only unique copy if a hole not already on `main` is found — after halt.

## AREAS TO STOP TOUCHING TEMPORARILY

- `src/frontend/src/components/WorldExploration.tsx` except one-line helper wiring
- `src/frontend/src/engine/mapGen.ts`
- RAF loop, turn-order math, damage formulas (`AGENTS.md`)
- `src/frontend/src/utils/progressPersist.ts` (leave the lock)
- `src/frontend/src/utils/deathPenalty.ts` (cluster closed)
- `src/frontend/src/engine/targeting.ts`
- `src/frontend/src/engine/enemyAI.ts`
- `src/frontend/src/components/AdminDashboard.tsx`
- `src/backend/main.mo` persistent fields until Caffeine deploy refreshes `.old`
- `src/backend/migrations/20260831_000000.mo` and `20260901_000000.mo` (frozen)
- `docs/automation/ACTION_IDS_2026-08-31.md` through `ACTION_IDS_2026-10-26.md` (do not append)
- GameKey product methods except via a confirmed deploy

## ARCHITECTURAL HOTSPOTS

1. Automation pile-on (52 same-hour agents; 349 drafts in six recovered days; 831+ leftovers)
2. Dual HP / death / landing authority (React snapshot vs `combatantsRef` vs Swap/summon/reflect teleport)
3. Remount `saveBattleStats` wipe vs committed keeps (~100 twins)
4. Advertised kit metadata vs execute (pack-enemy mill)
5. Client-trusted `applyRewards` without a written ADR
6. 19k-line world orchestrator absorbing every hunter (paint extracts are FAKE MODULARITY)
7. Dual spell catalogs + implicit ownership (blocks discovery)
8. Kit-zone object call site (dynamic pools implemented and dead)
9. EOP `.old` still Aug-31 while source carries GameKey

## TELEMETRY SIGNALS WORTH INVESTIGATING

**None can be investigated in production — the series do not exist.**

When AQA-012 lands, investigate in this order (engineering + design, not telemetry-alone priority):

1. persist-ok vs persist-fail and death-penalty-applied vs victory-paid vs **single-axis-credit-then-death** (integrity — measure whether `#183/#256` stayed closed)
2. GameKey request vs approve vs redeem vs redeem-fail (ops; do not treat 0 rows as “players don’t buy”)
3. remount-after-keep wipe vs unpaid-death apply (skip-wipe mill — if Doka drops after a keep, ENGINEERING is remount policy)
4. recap opened vs dismissed vs lava-death-during-recap (PX)
5. spell-cast counts **by acquisition path** (starter vs unlocked vs observed) — a “weak” spell may be undiscovered, not weak. Today every catalog id is treated as owned, so this series would be **meaningless** until SDA-002.
6. Attack Nearest vs aimed-cast ratio (gate confusion vs power)
7. challenge accept vs complete vs advertised-reward-missing
8. Swap / summon-walk onto hazards vs walk onto the same tile (MIMA-001 remainder — if “Untouchable complete rate” is high, DESIGN INTERPRETATION is skip-landing, not player skill)
9. Frozen/Slime maps: tiles walked vs preview budget (execute MP already fixed on `main` — measure, do not re-patch)

Until those exist: automations must not claim CLEAR_POSITIVE_SIGNAL or “players don’t use X.” Distinguish MEASURED PLAYER BEHAVIOUR (none) from DESIGN INTERPRETATION and ENGINEERING EVIDENCE.

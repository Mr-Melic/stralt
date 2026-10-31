# Game Feel & Combat Feedback Audit — 2026-10-31

**Director:** Game Feel & Combat Feedback Director (`078e61d4-a49f-11f1-a7d1-d6b4613131ce`)  
**Run:** `bc-9360df7a-3ab5-59c5-b0a5-e10277001038`  
**Schedule:** cron hunt of mute IMPACT/INFORMATION holes on main HEAD (twenty-second ledger; prior ledgers through 2026-10-29 / **#1306**)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`) — same combat tree as the 09-21 → 10-29 ledgers. No combat-feel code landed on `main` since those runs. This is the next unique-NEW pass, not a rewrite of #1306.  
**Telemetry:** still none in production. DEV-only `recordClickOutcome`. TBC / `AQA-2026-08-30-012` remain `WAITING_FOR_TELEMETRY`. Treat telemetry as **absent**, not a clean bill of health.

This is distinct from general UX. The question is whether important actions communicate **what happened, why, what changed, and whether another action is possible**, through ANTICIPATION → ACTION → IMPACT → RECOVERY → INFORMATION.

Do not implement gameplay to chase engagement metrics. This run **does not auto-implement** WX / castHelpers / recap wiring: remaining unique holes live in `WorldExploration.tsx` (`handleBattleEnd` boss snapshot order, phase-2 HP juice, shrine persist catch) and `castHelpers.ts` (dead `_resistNote`). Oldest WX owner is still **#327**; **#363** / **#419** already queue feel floats. **#845** / **#354** own Recap chrome. **#1341** owns overworld-boss *reward* pre-cleanup snapshot (economy) — this ledger files the *naming / BOSS DEFEATED* feel gap only. Unioning WX across the queue is not an extremely small, low-risk correction. Prior GFCF PRs already own their surfaces — do not re-implement them here.

## Hunt result (22 targets)

| # | Target | Verdict |
|---|--------|---------|
| 1 | Overworld boss recap never naming the boss | **NEW** `10-31-001` |
| 2 | Standing lava/spikes TURN-START damage, no number | **Reject** — no turn-start standing HP debit on main (walk-on only; RAF 011 / enemy landing 09-27-003). Plague/void turn-start numbers stay #523 / 09-24-002 |
| 3 | Glyph trap / larva explode / contact venom mute | **MIMA** — `useBossSystem` has explode/glyph helpers; WX never references `larvae` / `glyphedTiles` hit-test (already noted 10-24) |
| 4 | Phase 2 HP bump with no +HP float | **NEW** `10-31-002` |
| 5 | SR soak / resist with no resist float | **NEW** `10-31-003` |
| 6 | Iron Curse halved heal with no reduced-heal cue | **MIMA** — RES×1.3 applies on battle start; `MAP_MODIFIER_IRON_CURSE_HEALING_MULTIPLIER` never read by heal sites; `onEffectApplication("heal")` never called from the heal path |
| 7 | Shrine altar Doka persist-fail after juice | **NEW** `10-31-004` (juice stays #419; this is the silent `release` catch) |
| 8 | Summon lifespan expiry / dismiss mute | **Skip** — already `GFCF-2026-09-22-007` (#419); log `"fades away..."` is wired |
| 9 | Control-transfer to/from summon mute | **Reject** — `SummonControlPanel` mount/unmount is the information; Your-turn stays #419 / 009 |
| 10 | Overworld boss death persist-fail after cleanup | **Skip** — victory persist-fail after recap stays #1133 / 10-26-003; reward under-grant is **#1341** economy, not a new feel ID |
| 11 | Flee success/fail mute | **Reject** — dungeon/BR confirm + `_handlePlayerDeath` → Game Over 20/40 (cited non-hole) |
| 12 | Spell discovery pickup mute | **Reject** — no discovery pickup layer on main (SDA/PXA) |
| 13 | GameKey redeem mute | **Reject** — `DokaGameKeyShop` success/err toasts |
| 14 | Push/pull/knockback puff for PLAYER spells | **MIMA** — `pushback`/`attract` are typed; `spellEngine` / cast path never call `applyPushback`/`applyAttract`; no catalog spells ship those types |
| 15 | DoT/poison/plague/burn tick numbers mute | **Reject** — `processActiveEffects` routes through `playerTakesDamage` / `enemyTakesDamage`, which `spawnDamageAtTile` |
| 16 | Critical hit extra juice missing | **Skip** — primary hit IMPACT is still GFCF-003 (`applyDamageToEnemy` never spawns a number); crit already plays `critical_hit`. Do not twin 003 |
| 17 | Portal color (black/blue/red) entry mute | **Reject** — cosmetic draw only; same `generateRandomMap` path + `map_transition`. Dungeon-enter log / rest+white toasts stay the cited non-holes; nearby labeling stays forbidden |
| 18 | Character rename / create success-fail feel | **Reject** — create/update + rename already toast ok/err |
| 19 | Jackpot heal feel | **Reject** — banner + toast + battle log already fire |
| 20 | Occupied PLAYER walk dest | **Reject** — mouse/touch walk already float `"Occupied"` (`WX` 10513–10517 / 11098–11101); summon dest stays 09-25-005 |
| 21 | Persist-fail AFTER optimistic toast/log (unfiled) | Covered by `10-31-004` shrine; other sites already filed through 10-28 |
| 22 | Recap surfaces that lie/omit (sanctuary/rest/overworld boss) | Overworld boss naming = `10-31-001`; emptied `dokaBreakdown` stays 10-29-002; BR boss names stay 10-29-003; sanctuary/rest have no battle recap path |

## Unique NEW (4)

### GFCF-2026-10-31-001 — Overworld boss victory never names the boss on recap

`handleBattleEnd` calls `cleanupBattle()` first (`WX` 12328). `cleanupBattle` nulls `currentBossConfigRef` (`WX` 11662). Recap then reads `bossDefeated: currentBossConfigRef.current?.name` (`WX` 12471) → always `undefined`. The `☠️ BOSS DEFEATED: …` log (`WX` 12498–12502) and `bossId` for client-trusted feats also see the wiped ref. `PostBattleRecap` already renders a BOSS DEFEATED block when `bossDefeated` is set (`PostBattleRecap.tsx` 148–175).

**Distinct from** 10-29-003: BR room-clear never sets `currentBossConfigRef` at spawn. Overworld *does* set it on boss-portal entry (`WX` 6494) and still loses the name at cleanup. **#1341** snapshots rewards for persist; this ID is the missing *name* / BOSS DEFEATED chrome.

**Applies on main:** yes — overworld boss portals set the ref and victory uses `handleBattleEnd`.

**ACTION:** Snapshot `currentBossConfigRef.current` (name + id) **before** `cleanupBattle`, pass into `bossDefeated` / feat `bossId` / defeat log. Do not amend BR 10-29-003 here.

**Confidence:** HIGH

### GFCF-2026-10-31-002 — Phase 2 HP bump has no +HP float

Phase transition commits `hpAfterBossPhase2` into the store (`WX` 15768–15785) — max HP × `statMultiplier`, Weeping Pawn full restore. Only a battle-log PHASE 2 / PROMOTE line fires (`WX` 15790–15799). No `spawnDamageAtTile(..., "heal")`, no canvas float for the HP gained.

**Distinct from** 09-22-009 / filed PHASE 2 banner (log-only climax) and from 09-23-001 enemy self-heal number (ability heal path). This is the phase-gate HP rewrite itself.

**Applies on main:** yes — `bossPhaseTransitioned` path runs in the boss AI flush.

**ACTION:** After the store write, float `+ΔHP` (heal kind) at the boss tile. Keep the existing log. Do not re-banner PHASE 2 here (009 owns the banner).

**Confidence:** HIGH

### GFCF-2026-10-31-003 — SR/RES soak never surfaces (dead `_resistNote`)

`calculatePlayerDamage` applies SR×RES into `finalDamage` (`WX` 3342–3363). `applyDamageToEnemy` computes `resistedAmt` and builds `_resistNote` (`castHelpers.ts` 379–393) then **never appends it** to `logBattleEntry` (410–412) and never floats soak. Player sees only the post-mitigation line (and, until GFCF-003, often no canvas number at all).

**Distinct from** 09-28-002 Shell Armor “why” log (boss larvae path) and from shield-absorb logs. Do not invent a float when `resistedAmt === 0`.

**Applies on main:** yes — every non-trivial enemy SR/RES hit.

**ACTION:** When `resistedAmt > 0`, append the resist note to the battle log and/or float a short `"Resisted"` / `−N` soak cue. Prefer landing with GFCF-003 primary-hit juice so soak is not the only canvas number. Do not change the damage formula.

**Confidence:** MEDIUM (post-mitigation number can be enough once 003 ships; the dead note proves intended INFORMATION that never shipped)

### GFCF-2026-10-31-004 — Shrine altar Doka persist-fail is silent after claim

Altar step `tryClaimFlag` then enqueues `persistDokaCreditResult(300)` (`WX` 11303–11327). On `settle.kind === "release"` it only `releaseFlag` — no toast, no log, no float. `#419` / 09-22-003 owns success *juice* on claim (not on main yet). Once that juice plays on claim (before commit), a failed credit leaves the player with juice and no Doka — same class as dungeon-complete persist-fail (#1227) and shop Buy fail (#1061), shrine-specific.

**Distinct from** shrine *juice* (#419), shrine *altar anticipation* (10-23-002), and dungeon-complete fail (10-28-001). Covenant unread stays PXA/MIMA.

**Applies on main:** yes — claim + enqueue + release path is live; juice may arrive via #419.

**ACTION:** On `settle.kind === "release"` (and transport miss if kept claimed), toast/log that the 300 Doka credit failed. Do not mint on fail. Keep one-shot claim semantics.

**Confidence:** HIGH

## Explicit rejects (closest almost-holes)

- **Standing lava/spikes turn-start** — mechanic absent; walk-on has RAF juice (011) / enemy landing (09-27-003); plague/void numbers (09-24-002).
- **Glyph / larva explode** — unread in WX → MIMA, not GFCF.
- **Iron Curse heal half** — multiplier unread → MIMA; RES bump already announced via modifier registry.
- **Summon fade float** — already 09-22-007.
- **Control transfer** — panel is enough INFORMATION.
- **Flee** — Game Over path is the cited non-hole.
- **Spell discovery / push-pull catalog** — not on main.
- **GameKey / rename / create / jackpot** — toasts already present.
- **Occupied player walk** — `"Occupied"` float already on main.
- **Portal black/blue/red entry** — no mode change; sound only is enough vs dungeon-enter’s mode log.
- **DoT tick numbers** — already spawn via damage helpers.
- **Crit spectacle beyond 003** — do not twin.
- **Overworld boss persist-fail** — fold under 10-26-003; economy under-grant is #1341.
- **BR / dungeon recap lies** — stay 10-29-001…003.

## Ownership / stack

Docs-only. Do not wire WX on this branch. Oldest WX sibling remains **#327**. Feel float queues: **#363**, **#419**, **#478**, **#523**, **#571**, **#610**, **#678**, **#735**, **#772**, **#845**, **#894**, **#954**, **#1003**, **#1061**, **#1133**, **#1184**, **#1227**, **#1306**. Recap chrome: **#845** / **#354**. Overworld boss reward snapshot: **#1341** (union; do not overwrite).

# Game Feel & Combat Feedback Audit — 2026-09-23

**Director:** Game Feel & Combat Feedback Director (`078e61d4-a49f-11f1-a7d1-d6b4613131ce`)  
**Run:** `bc-a30003fe-91d2-4d87-9e92-5364e41f7163`  
**Schedule:** cron `0 */48 * * *` (sixth ledger; 2026-08-31 / #149, 2026-09-01 walk-reject + `level_up` sound, 2026-09-02 attack-mode / off-turn / world-unreachable, 2026-09-21 queued in **#363**, 2026-09-22 queued in **#419**)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`) — same tree as the 09-21 and 09-22 ledgers. No combat-feel code landed on `main` in the last 48h.  
**Telemetry:** still none in production. DEV-only `recordClickOutcome`. TBC-2026-09-23 (`#462`) remains `WAITING_FOR_TELEMETRY` (`AQA-2026-08-30-012` unshipped). Treat telemetry as **absent**, not a clean bill of health.

This is distinct from general UX. The question is whether important actions communicate **what happened, why, what changed, and whether another action is possible**, through ANTICIPATION → ACTION → IMPACT → RECOVERY → INFORMATION.

Do not implement gameplay to chase engagement metrics. This run **does not auto-implement** canvas wiring: every remaining unique hole lives in `WorldExploration.tsx`, which older still-open PRs already own (#327 Striker is the oldest WX sibling; #363 / #419 already queue feel floats). Unioning that file across the queue is not an extremely small, low-risk correction. **#363 and #419 already own** their surfaces — do not re-implement them here.

---

## Prior ledger status

| ID | Title | Status this run |
| :--- | :--- | :--- |
| GFCF-2026-08-31-001 | Screen-space juice anchors | **Shipped** (#149) |
| GFCF-2026-08-31-002 | Player-facing reject copy | **Shipped** (#149 / 09-01) |
| GFCF-2026-08-31-003 | `applyDamageToEnemy` IMPACT juice | **Still open.** Highest remaining unique P0. Not auto-implemented (MEDIUM double-spawn vs bounce / `enemyTakesDamage`) |
| GFCF-2026-08-31-004 | Draw armed hit-flash | **Still open.** `getHitFlashAlpha` still has zero render call sites (`effects.ts` 331) |
| GFCF-2026-08-31-005 | Hit-stop `timeScaleRef` | **Still deferred.** RAF freeze |
| GFCF-2026-08-31-006 | Walk reject floats | **Shipped** (09-01) |
| GFCF-2026-08-31-007 | In-battle feats on recap | **Shipped** (#159 / `recapUnlocks.ts`) |
| GFCF-2026-08-31-008 | `level_up` sound + banner | **Partial.** Sound shipped (`rewardFeel.ts`). Recap header still `Level {currentLevel}` (`PostBattleRecap.tsx` 267 / 295) |
| GFCF-2026-08-31-009 | Phase-2 banner | **Still open.** Log-only at `WX` 15790–15799; encounter banner still 1.5s on *entry* (`WX` 6496–6504) |
| GFCF-2026-08-31-010 | Walk-path overlay | **Still open.** Hover MP is still Manhattan (`WX` 8521–8529) while execute uses `findPath` + Frozen 2× |
| GFCF-2026-08-31-011 | Label non-weapon damage | **Still open.** Lava/spikes still write HP inside the movement RAF (`WX` 11428–11482). Do **not** add juice on that RAF path here |
| GFCF-2026-08-31-012 | Status-pill duration digits | **Still open.** Canvas pills emoji-only (`WX` 8240 / 8356). Panel `StatusEffectBadge` already shows `{turns}t` |
| GFCF-2026-08-31-013 | Visible Death Realm wait | **Still open.** 1.5s `armDeathGuards` (`WX` 13378) still invisible; HP restored immediately |
| GFCF-2026-08-31-014 | `triggerVfx` heal no-op | **Still open.** `WX` 9344 `triggerVfx: () => { /* no-op */ }`. Drain heal remains log-only (`castHelpers.ts` 473–487) |
| GFCF-2026-08-31-015 | Feel-telemetry | **Still deferred** to AQA-2026-08-30-012 |
| GFCF-2026-09-01-001 | Barrier tokens + leftover invalid-target | **Shipped** (09-01) |
| GFCF-2026-09-01-002 | Attack-mode silent clicks | **Shipped** (09-02) |
| GFCF-2026-09-01-003 | World-mode unreachable float | **Shipped** (09-02) |
| GFCF-2026-09-02-001 | Off-turn canvas after playerCastGate | **Shipped** (09-02) |
| GFCF-2026-09-02-002 | Summon-control walk floats | **Queued in #363** (not on `main`) |
| GFCF-2026-09-02-003 | Paper Windstorm miss float | **Queued in #363** |
| GFCF-2026-09-02-004 | Potion / item IMPACT | **Queued in #363** (`handleUseItem` still log-only at `WX` 3545–3563) |
| GFCF-2026-09-02-005 | Attack Nearest no-AP hotkey | **Queued in #363** (`main` still only floats cooldown at `WX` 17251–17262) |
| GFCF-2026-09-21-001 | Attack Nearest off-turn float | **Queued in #363** |
| GFCF-2026-09-21-002 | Summon-control kit fail float | **Queued in #363** |
| GFCF-2026-09-21-003 | Summon-control kit no-target | **Queued in #363** |
| GFCF-2026-09-21-004 | Sacrifice damage number | **Queued in #363** |
| GFCF-2026-09-21-005 | Attack Nearest no-legal-target canvas float | **Queued in #419** (footer flash only on `main` at `WX` 17300 / 17317) |
| GFCF-2026-09-22-001 | Enemy melee IMPACT juice | **Queued in #419** as NEW / RECOMMEND |
| GFCF-2026-09-22-002 | Boss-ability damage / AP canvas | **Queued in #419** as NEW / RECOMMEND |
| GFCF-2026-09-22-003 | Shrine altar pickup juice | **Queued in #419** as NEW / RECOMMEND |
| GFCF-2026-09-22-004 | Attack Nearest mode / no-spell float | **Queued in #419** as IMPLEMENTED_THIS_PR (not on `main`) |
| GFCF-2026-09-22-005 | Boss Rush room-advance banner | **Queued in #419** as NEW / RECOMMEND |
| GFCF-2026-09-22-006 | Victory-persist portal float | **Queued in #419** as NEW / RECOMMEND |
| GFCF-2026-09-22-007 | Summon lifespan fade float | **Queued in #419** as NEW / RECOMMEND |
| GFCF-2026-09-22-008 | 0 AP Attack / spell-slot click float | **Queued in #419** as NEW / RECOMMEND |
| GFCF-2026-09-22-009 | Optional “Your turn” banner | **Queued in #419** as NEW / RECOMMEND (do not lengthen turns) |

Do not reopen recap XP `level * 100`. Do not wire hit-stop. Do not invent feel-telemetry. Do not clone MIMA-2026-09-21-001/002/004. Do not re-file #363 / #419 items as NEW. Do not re-implement those WX call sites on this branch.

---

## Telemetry

| Signal asked for | Status | Alternative explanation |
| :--- | :--- | :--- |
| Spells selected then cancelled | **No series.** DEV click traces only | Cancel may be the intended “deselect to walk” mode switch (`shouldClearSpellAfterApSpend`) |
| High flee in particular encounters | **No series** | Flee already has a confirm on dungeon / Boss Rush (`WX` 18918–18935) |
| Abandonment around boss phases | **No series** | Phase change is still log-only (`WX` 15790–15799) |
| Discovered spells rarely used | **No discovery layer** | Spellbook still shows all `allSpells` (SDA owns persist) |
| Repeated illegal-action attempts | DEV `recordClickOutcome` only | Attack Nearest mode / no-target / AP still silent on `main` (#363 / #419). Timer expiry and enemy-heal IMPACT also silent (this ledger) |
| Long turns around certain mechanics | **No series** | 30s turn timer exists (`WX` 14765–14806); expiry itself has no canvas copy |
| Sharp behaviour after a mechanic release | Cannot attribute | Same HEAD as 09-21 / 09-22; 100+ open sibling PRs; no player population |

**Rule:** do not change balance or rarity from these gaps. TBC-2026-09-23 remains `WAITING_FOR_TELEMETRY`.

---

## What changed since 2026-09-22 (feel-relevant)

`main` is still `0f5363f`. **#363** and **#419** are still open/draft. This run searched for silent IMPACT / INFORMATION paths that those ledgers listed as explicit non-holes or never filed.

Unique holes that are **not** in #363, **not** in #419, and **not** in 003–015:

1. **Enemy / boss self-heal** (`WX` 16648–16662 and boss kit `WX` 15889–15904) writes HP via `updateCombatant` + log. Player `heal()` already spawns a green number (`WX` 9185–9205 / 15005–15025). A wolf drinking a heal is quieter than the player drinking one. Distinct from 014 (`triggerVfx` no-op on the *player spell* path) and from 003 (player→enemy damage).
2. **Hostile summon spawn** (`commitHostileSummon` at `WX` 14922–14975) adds the unit with no `spawnPixelPuff` / `playSound`. Player-side spawn still has puff + `spell_cast` (`WX` 9305–9315). The 09-22 “summon spawn is a non-hole” note was **player-only**.
3. **Player turn-timer expiry** (`WX` 14793–14794) sets `turnEndReasonRef = "timer-expiry"` and calls `advanceTurn` with no float. The footer already pulses `{turnTimeLeft}s` at ≤7s (`BattleUIPanel.tsx` 384–394) — anticipation exists; IMPACT / “why the turn ended” does not. Distinct from 09-22-009 (“Your turn” start banner). **Do not** float the enemy 5s AI watchdog (`WX` 16993–16999) — that is recovery, not a player action.
4. **Ice tile Frozen** (`WX` 11454–11467) logs `"You stepped on ice! Slowed!"` and applies the debuff inside the **movement RAF**. Distinct from 011 (HP numbers for lava/spikes on the same path). Do **not** add juice on that RAF path here.
5. **Portal +10 XP** (`WX` 6802–6838) correctly withholds HUD until `applyRewards` commits, then writes `exp` / `level` with no canvas `"+10 XP"`. Distinct from shrine 09-22-003 (300 Doka, zero log). Weak reward IMPACT after a legal persist.

09-22-001…009 stay queued. Primary-hit juice (003) remains the highest unique P0.

---

## Interaction matrix (re-read on `0f5363f`)

| Interaction | Anticipation | Action | Impact | Recovery | Information | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Movement | Hover MP is Manhattan (`WX` 8521) | Click → `findPath` same frame | 600ms path | Camera follows | Gold tile; **no path polyline**. Battle + world rejects float. Summon-control still log-only until #363 | Weak anticipation |
| Tile selection | Hover pulse (walk green / spell blue) | Click gold tint | Immediate | — | Hazard tiles suppress clicked gold | Mostly clear |
| Spell selection | Footer/panel highlight; blue range | Ref + version bump | Range tiles | Auto-clear on 0 AP | 0 AP slot click still silent (09-22-008) | Clear enough |
| Target highlight | Hover `-dmg` on enemy (non-crit `computeDamage`) | Live entity-first gate | Cast or float | — | Hover ignores crit; no AoE ring | Anticipation incomplete |
| Valid / invalid | Blue/green tiles | Float text | — | — | Spell / walk / attack-mode / off-turn / world-unreachable float. AN AP / mode / no-target wait on #363 / #419 | Better; queued PRs still needed |
| Damage | Hover `-dmg` | Sounds on spell path | Juice only on `enemyTakesDamage` / `playerTakesDamage` | 900ms fade | Primary `applyDamageToEnemy` mute. **Enemy melee mute** (09-22-001). Boss ability mute (09-22-002) | **Primary + melee IMPACT still broken** |
| Healing | — | HP bar | Player `heal()` has green numbers; `triggerVfx` no-op (014); potions wait on #363; **enemy/boss self-heal log-only** | — | Spell heal path still 014 | Player OK; enemy heal mute |
| AP/MP spend | Hover MP; AP bars 0.3s | Immediate decrement | Elixir/boots wait on #363 | Mode switch to walk at 0 AP | No `-N AP` on spell debit | HUD only |
| Crits | Hover uses non-crit `computeDamage` | `critical_hit` sound | Hitstop/shake only if `enemyTakesDamage` | — | Crit `!` unused on main spell path | Sound without punch |
| Enemy death | — | Shatter + log | Leader 36 gold particles + banner | 350ms fragments | Screen-space shatter from #149 | Leader > regular |
| Player death | HP bar | Recap + 1.5s timer | Toast after teleport | Death Realm | Timer invisible; body looks alive | Modal, not a moment |
| Summons | Lifespan `⏳N`; control dock | **Player** puff + SFX + log | Death pipeline; control rejects wait on #363; fade wait on 09-22-007 | — | **Hostile spawn is mute.** Expiry is log-only | Asymmetric spawn |
| Statuses | Inspect chips | Canvas emoji (4 + overflow); panel has `{turns}t` | Log on tick/expiry. Ice Frozen is log-only in RAF | — | No remaining-turns on canvas | Readable but thin |
| Spell observation | Hover dmg + inspect | — | Windstorm still log-only until #363 | — | No “you were hit by X” toast | Log / inspect only |
| Spell discovery | Full spellbook | — | — | — | No unknown-spell fog | Product gap (SDA/PXA) |
| Level-up | Recap XP bar (curve correct) | — | **`level_up` plays** when recap level > pre-grant | — | Recap still says “Level N” | Sound yes; banner no |
| Achievement | Toast in world | In-battle queued | Recap section wired (#159) | 4s toast | Payload `newlyUnlockedAchievements` | Fixed |
| Boss phases | Encounter banner on *entry* | Log `PHASE 2!` / Weeping Queen | Stat/HP change | — | Easy to miss in log scroll | Weak climax |
| Victory | Recap immediate (persist async) | `battle_end` SFX | Overlay; canvas ignored while open | 1s XP bar | Feats wired; leftover XP correct; persist portal silent (09-22-006) | Solid shell |
| Rewards | Recap Doka/XP | Persist lock | Ground Doka float; shrine mute (09-22-003); **portal +10 XP silent after commit**; dungeon-complete has gold log, no pickup juice | — | Recap heal allowed | Shrine + portal XP are the holes |

---

## Highest-impact disconnected systems (unchanged)

1. **`applyDamageToEnemy` never calls EffectsManager.** Player spells play hit/crit *sound* and write the log. Bounce / DoT / helper damage uses `enemyTakesDamage`, which *does* spawn juice. Same hit, two feels.

2. **`getHitFlashAlpha` has zero render call sites.** Flash is armed and expires unused.

3. **`triggerHitStop` is inert.** RAF uses `tick(16)` and never reads `timeScaleRef`. Do **not** implement here.

4. **Lava / spikes** still move HP inside the movement RAF without `playerTakesDamage`. Reflect / shield stay log-first on those paths.

5. **Phase 2** still has no reuse of the 1.5s encounter banner.

6. **Enemy melee / boss abilities** (09-22) skip the juice helper that spell hits already have.

7. **Enemy / boss self-heal** (this ledger) skips the green number that player `heal()` already has.

---

## Implemented this run

None. Presentation wiring for the unique NEW items requires `WorldExploration.tsx`. Oldest WX owner is **#327**; **#363** and **#419** already queue feel floats on that file. Auto-implementing here would either conflict in the oldest-first queue or force a restack union that is not extremely small / low-risk.

Not touched: RAF loop, map generation, turn logic, damage math, hover MP formula, hit-flash draw, `applyDamageToEnemy` juice, #363 / #419 surfaces.

---

## Open drafts that already own a feel or WX surface

| PR | Theme | Director action |
| :--- | :--- | :--- |
| #327 | Striker AoE / bounce range | Oldest WX owner. Union, do not overwrite. |
| #340 | Attack Nearest execute gates | Union `attackNearestEnemy`; do not overwrite gates. |
| #363 | 09-21 feel floats | **Owns** 09-02-002…005 and 09-21-001…004. Do not duplicate. |
| #376 | Dawn blessing AP/MP log | Mechanic-truth copy. Do not fork. |
| #419 | 09-22 AN floats + NEW melee/boss/shrine | **Owns** 09-21-005, 09-22-001…009. Do not duplicate. `NO_TARGET_COPY` === `#363 SUMMON_NO_TARGET_COPY` string. |
| #462 | TBC WAITING_FOR_TELEMETRY | Docs. Do not invent feel-telemetry. |

#108 / #138 leftover-XP HUD: **merged**. #149 juice + reject copy: **merged**. #159 feat recap: **merged**. #326 Attack Nearest origin: **merged**.

---

## ACTION_ID ledger

See `docs/automation/ACTION_IDS_GFCF_2026-09-23.md`. Prior IDs remain in `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_GFCF_2026-09-02.md`, #363’s `ACTION_IDS_GFCF_2026-09-21.md`, and #419’s `ACTION_IDS_GFCF_2026-09-22.md` (the last two are not on `main`).

# Game Feel & Combat Feedback Audit — 2026-09-22

**Director:** Game Feel & Combat Feedback Director (`078e61d4-a49f-11f1-a7d1-d6b4613131ce`)  
**Run:** `bc-7b4d71e0-cefe-4a24-80ab-0feaaeffd93f`  
**Schedule:** cron `0 */48 * * *` (fifth ledger; 2026-08-31 / #149, 2026-09-01 walk-reject + `level_up` sound, 2026-09-02 attack-mode / off-turn / world-unreachable, 2026-09-21 queued in **#363**)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`) — same tree as the 09-21 ledger. No combat-feel code landed on `main` in the last 48h.  
**Telemetry:** still none in production. DEV-only `recordClickOutcome`. TBC-2026-09-21 / TBC-2026-09-22 remain `WAITING_FOR_TELEMETRY` (`AQA-2026-08-30-012` unshipped). Treat telemetry as **absent**, not a clean bill of health.

This is distinct from general UX. The question is whether important actions communicate **what happened, why, what changed, and whether another action is possible**, through ANTICIPATION → ACTION → IMPACT → RECOVERY → INFORMATION.

Do not implement gameplay to chase engagement metrics. This run implemented only presentation-only Attack Nearest copy (mode / no-spell / no-target). Everything else is ACTION_IDs. **#363 already owns** summon-control / Windstorm / potion / Sacrifice / AN AP+off-turn — do not re-implement those on this branch.

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
| GFCF-2026-08-31-011 | Label non-weapon damage | **Still open.** Lava/spikes still write HP inside the movement RAF. Do **not** add juice on that RAF path here |
| GFCF-2026-08-31-012 | Status-pill duration digits | **Still open.** Canvas pills emoji-only (`WX` 8240 / 8356). Panel `StatusEffectBadge` already shows `{turns}t` |
| GFCF-2026-08-31-013 | Visible Death Realm wait | **Still open.** 1.5s `armDeathGuards` (`WX` 13378) still invisible; HP restored immediately |
| GFCF-2026-08-31-014 | `triggerVfx` heal no-op | **Still open.** `WX` 9344 `triggerVfx: () => { /* no-op */ }`. Drain heal remains log-only (`castHelpers.ts` 473–487) — still 014, not a new ID |
| GFCF-2026-08-31-015 | Feel-telemetry | **Still deferred** to AQA-2026-08-30-012 |
| GFCF-2026-09-01-001 | Barrier tokens + leftover invalid-target | **Shipped** (09-01) |
| GFCF-2026-09-01-002 | Attack-mode silent clicks | **Shipped** (09-02) |
| GFCF-2026-09-01-003 | World-mode unreachable float | **Shipped** (09-02) |
| GFCF-2026-09-02-001 | Off-turn canvas after playerCastGate | **Shipped** (09-02) |
| GFCF-2026-09-02-002 | Summon-control walk floats | **Queued in #363** (not on `main`) |
| GFCF-2026-09-02-003 | Paper Windstorm miss float | **Queued in #363** |
| GFCF-2026-09-02-004 | Potion / item IMPACT | **Queued in #363** |
| GFCF-2026-09-02-005 | Attack Nearest no-AP hotkey | **Queued in #363** (`main` still only floats cooldown) |
| GFCF-2026-09-21-001 | Attack Nearest off-turn float | **Queued in #363** |
| GFCF-2026-09-21-002 | Summon-control kit fail float | **Queued in #363** |
| GFCF-2026-09-21-003 | Summon-control kit no-target | **Queued in #363** |
| GFCF-2026-09-21-004 | Sacrifice damage number | **Queued in #363** |
| GFCF-2026-09-21-005 | Attack Nearest no-legal-target canvas float | **Implemented this PR** (footer flash kept) |

Do not reopen recap XP `level * 100`. Do not wire hit-stop. Do not invent feel-telemetry. Do not clone MIMA-2026-09-21-001/002/004 (modifier HP commit, Dawn MP/AP lie, summon-control preview origin). Do not re-file #363’s queued copy as NEW.

---

## Telemetry

| Signal asked for | Status | Alternative explanation |
| :--- | :--- | :--- |
| Spells selected then cancelled | **No series.** DEV click traces only | Cancel may be the intended “deselect to walk” mode switch (`shouldClearSpellAfterApSpend`) |
| High flee in particular encounters | **No series** | Flee already has a confirm on dungeon / Boss Rush (`WX` 18918–18935) |
| Abandonment around boss phases | **No series** | Phase change is still log-only (`WX` 15790–15799) |
| Discovered spells rarely used | **No discovery layer** | Spellbook still shows all `allSpells` (SDA owns persist) |
| Repeated illegal-action attempts | DEV `recordClickOutcome` only | Attack Nearest mode / no-target were silent on `main` (floats this PR). #363 still owns the rest |
| Long turns around certain mechanics | **No series** | 30s turn timer exists; no per-mechanic duration |
| Sharp behaviour after a mechanic release | Cannot attribute | Same HEAD as 09-21; 70+ open sibling PRs; no player population |

**Rule:** do not change balance or rarity from these gaps. TBC remains `WAITING_FOR_TELEMETRY`.

---

## What changed since 2026-09-21 (feel-relevant)

`main` is still `0f5363f`. The 09-21 presentation PR (**#363**) is still open/draft. This run searched for silent paths that 09-21 listed as NEW leftover or never filed.

Unique holes that are **not** in #363 and **not** in 003–015:

1. **Enemy melee** (`WX` 16749–16788) mutates HP and logs; it never calls `playerTakesDamage` (which has juice). Spell hits on the player already float + flash + shake. Do **not** route melee through `playerTakesDamage` — that helper also applies RES, which melee currently skips (combat-parity, not this director).
2. **Boss ability `damageToPlayer` / `playerApModifier`** (`WX` 16025–16045) is fully mute — no log, float, or sound.
3. **Shrine altar** (`WX` 11298–11354) credits 300 Doka and may set a 3-map covenant, then `setShrineCompleted(true)` into an unused `_shrineCompleted` state. Ground Doka on the same tick already has sound + float + log.
4. **Attack Nearest `[S]`** outside Attack mode / with no spell (`WX` 17219–17224) — **fixed this PR**.
5. **Attack Nearest no-legal-target** was footer flash only — **fixed this PR** (09-21-005).
6. **Boss Rush room-advance portal** (`WX` 6095–6110) swaps the map with no banner (boss-colored *entry* already uses `bossEncounterBanner`).
7. **Victory-persist portal block** (`WX` 5986–5990) is silent. Distinct from Death Realm 013.
8. **Summon lifespan expiry** logs `"fades away..."` only (`summonLifespan.ts` 36).
9. **Attack toggle / spell-slot at 0 AP** ignore the click with title/opacity only (`WX` 18911 / 18842).

In-battle `shouldBlockWorldMoveOntoPortal` (`WX` 10580) sits in the **world-mode** branch after `if (inBattle) { … return }`. It only fires on `inBattle` state vs `inBattleRef` desync. Not filed as a unique NEW hole.

---

## Interaction matrix (re-read on `0f5363f` + this PR’s AN floats)

| Interaction | Anticipation | Action | Impact | Recovery | Information | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Movement | Hover MP is Manhattan (`WX` 8521) | Click → `findPath` same frame | 600ms path | Camera follows | Gold tile; **no path polyline**. Battle + world rejects float. Summon-control still log-only until #363 | Weak anticipation |
| Tile selection | Hover pulse (walk green / spell blue) | Click gold tint | Immediate | — | Hazard tiles suppress clicked gold | Mostly clear |
| Spell selection | Footer/panel highlight; blue range | Ref + version bump | Range tiles | Auto-clear on 0 AP | 0 AP slot click still silent (008) | Clear enough |
| Target highlight | Hover `-dmg` on enemy (non-crit `computeDamage`) | Live entity-first gate | Cast or float | — | Hover ignores crit; no AoE ring | Anticipation incomplete |
| Valid / invalid | Blue/green tiles | Float text | — | — | Spell / walk / attack-mode / off-turn / world-unreachable float. AN mode / no-target float this PR. AN AP + summon-control still #363 | Better; #363 still needed |
| Damage | Hover `-dmg` | Sounds on spell path | Juice only on `enemyTakesDamage` / `playerTakesDamage` | 900ms fade | Primary `applyDamageToEnemy` mute. **Enemy melee mute.** Boss ability mute | **Primary + melee IMPACT still broken** |
| Healing | — | HP bar | `triggerVfx` no-op; `heal()` has green numbers; potions wait on #363; drain log-only (014) | — | Spell heal path still 014 | Weak |
| AP/MP spend | Hover MP; AP bars 0.3s | Immediate decrement | Elixir/boots wait on #363 | Mode switch to walk at 0 AP | No `-N AP` on spell debit | HUD only |
| Crits | Hover uses non-crit `computeDamage` | `critical_hit` sound | Hitstop/shake only if `enemyTakesDamage` | — | Crit `!` unused on main spell path | Sound without punch |
| Enemy death | — | Shatter + log | Leader 36 gold particles + banner | 350ms fragments | Screen-space shatter from #149 | Leader > regular |
| Player death | HP bar | Recap + 1.5s timer | Toast after teleport | Death Realm | Timer invisible; body looks alive | Modal, not a moment |
| Summons | Lifespan `⏳N`; control dock | Puff + cast SFX + log | Death pipeline; control rejects wait on #363 | — | Expiry is log-only | Spawn OK; fade thin |
| Statuses | Inspect chips | Canvas emoji (4 + overflow); panel has `{turns}t` | Log on tick/expiry | — | No remaining-turns on canvas | Readable but thin |
| Spell observation | Hover dmg + inspect | — | Windstorm still log-only until #363 | — | No “you were hit by X” toast | Log / inspect only |
| Spell discovery | Full spellbook | — | — | — | No unknown-spell fog | Product gap (SDA/PXA) |
| Level-up | Recap XP bar (curve correct) | — | **`level_up` plays** when recap level > pre-grant | — | Recap still says “Level N” | Sound yes; banner no |
| Achievement | Toast in world | In-battle queued | Recap section wired (#159) | 4s toast | Payload `newlyUnlockedAchievements` | Fixed |
| Boss phases | Encounter banner on *entry* | Log `PHASE 2!` | Stat/HP change | — | Easy to miss in log scroll | Weak climax |
| Victory | Recap immediate (persist async) | `battle_end` SFX | Overlay; canvas ignored while open | 1s XP bar | Feats wired; leftover XP correct | Solid shell; persist portal silent |
| Rewards | Recap Doka/XP | Persist lock | Ground Doka float; shrine mute; potions wait on #363 | — | Recap heal allowed | Shrine is the hole |

---

## Highest-impact disconnected systems (unchanged)

1. **`applyDamageToEnemy` never calls EffectsManager.** Player spells play hit/crit *sound* and write the log. Bounce / DoT / helper damage uses `enemyTakesDamage`, which *does* spawn juice. Same hit, two feels.

2. **`getHitFlashAlpha` has zero render call sites.** Flash is armed and expires unused.

3. **`triggerHitStop` is inert.** RAF uses `tick(16)` and never reads `timeScaleRef`. Do **not** implement here.

4. **Lava / spikes** still move HP inside the movement RAF without `playerTakesDamage`. Reflect / shield stay log-first on those paths.

5. **Phase 2** still has no reuse of the 1.5s encounter banner.

6. **Enemy melee / boss abilities** (new this ledger) skip the juice helper that spell hits already have.

---

## Implemented this run (presentation only)

- `engine/attackNearestFeel.ts` — `SWITCH_TO_ATTACK_COPY`, `NO_TARGET_COPY`, `attackNearestModeRejectCopy`, `shouldFloatAttackNearestNoTarget`.
- `attackNearestEnemy` early return floats `"Switch to Attack"` / `"Select a spell"` in battle; overworld `[S]` stays quiet.
- Heal-probe fail and `pickNearestAttackableHostile` null still `setNoTargetFlash` for 1.2s and now also float `"No target"` at the player tile.
- Tests: `attackNearestFeel.test.ts`.

Not touched: RAF loop, map generation, turn logic, damage math, hover MP formula, hit-flash draw, `applyDamageToEnemy` juice, #363 surfaces.

---

## Open drafts that already own a feel or WX surface

| PR | Theme | Director action |
| :--- | :--- | :--- |
| #327 | Striker AoE / bounce range | Oldest WX owner. Union, do not overwrite. |
| #331 | Portal destack corridor | Map. No feel helper overlap. |
| #340 | Attack Nearest execute gates | Union `attackNearestEnemy`; do not overwrite gates. |
| #363 | 09-21 feel floats | **Owns** 09-02-002…005 and 09-21-001…004. Do not duplicate. `NO_TARGET_COPY` matches their `SUMMON_NO_TARGET_COPY` string. |
| #376 | Dawn blessing AP/MP log | Mechanic-truth copy. Do not fork. |

#108 / #138 leftover-XP HUD: **merged**. #149 juice + reject copy: **merged**. #159 feat recap: **merged**. #326 Attack Nearest origin: **merged**.

---

## ACTION_ID ledger

See `docs/automation/ACTION_IDS_GFCF_2026-09-22.md`. Prior IDs remain in `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_GFCF_2026-09-02.md`, and #363’s `ACTION_IDS_GFCF_2026-09-21.md` (not on `main`).

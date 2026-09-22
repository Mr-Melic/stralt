# Game Feel & Combat Feedback Audit — 2026-09-22

**Director:** Game Feel & Combat Feedback Director (`078e61d4-a49f-11f1-a7d1-d6b4613131ce`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`)  
**Focus:** silent player-action paths (click / hotkey / item / portal) with no canvas float, sound, or visible chrome.

Telemetry remains absent in production. DEV-only `recordClickOutcome` only.

This run is **audit-only** (no presentation code). Do not re-file the owned list below as NEW.

---

## Owned list (do not reopen as NEW)

| Surface | Status |
| :--- | :--- |
| Walk reject float (`playerFacingWalkReject`) | Shipped |
| Spell reject copy (`playerFacingRejectReason`) | Shipped |
| `SELECT_SPELL_COPY` / `WAIT_FOR_TURN_COPY` on tile/sprite | Shipped |
| World unreachable float | Shipped |
| Attack Nearest `on_cooldown` float | Present (`WX` 17252–17261) |
| Attack Nearest `no_ap` still silent on main | Owned — still open (`WX` 17251–17263 returns without float) |
| Attack Nearest no-target = footer flash only | Owned (`setNoTargetFlash` / `WX` 19015–19038) |
| `applyDamageToEnemy` no juice | Owned GFCF-003 |
| `getHitFlashAlpha` unused | Owned GFCF-004 |
| `triggerVfx` heal no-op | Owned GFCF-014 |
| Lava/spikes in RAF no juice | Owned GFCF-011 |
| Phase 2 log-only | Owned GFCF-009 |
| Recap no LEVEL UP chrome | Owned GFCF-008 remaining |
| Death realm 1.5s invisible | Owned GFCF-013 |
| Status pills no duration digits | Owned GFCF-012 |
| Hover MP Manhattan | Owned GFCF-010 |
| Paper Windstorm miss log-only | Owned GFCF-2026-09-02-003 |
| Potion `handleUseItem` log-only | Owned GFCF-2026-09-02-004 |
| Summon-control walk / kit fail / no-target / Sacrifice number / AN off-turn | Owned 09-02 + 09-21 memory |

Reflect / shield absorb source labels stay under **GFCF-2026-08-31-011** (do not duplicate).

---

## Searched paths — verdict table

| Path | File:line | What happens | Feedback | Unique vs owned? |
| :--- | :--- | :--- | :--- | :--- |
| Flee | `BattleUIPanel.tsx` 516–528; `WX` 18918–18935 | Confirm → `_handlePlayerDeath` | Confirm dialog + title; run confirm | **No hole** |
| End Turn disabled | `BattleUIPanel.tsx` 539–554 | Button disabled off-turn / summon | `title=` explains reason | **No hole** (hover chrome) |
| End Turn handler bail | `WX` 18937–18947 | Returns if not player entry | Button already disabled | Not player-facing |
| Rest portal | `WX` 6158–6212 | Safe-zone map | Toast `"Safe Zone…"` | **No hole** |
| Shrine altar claim | `WX` 11298–11354 | Credits 300 Doka async; covenant if pure path | **None** (no log / toast / float / sound) | **NEW** |
| Portal death-guard | `WX` 5978–5984 | Blocks portal while Death Realm timer armed | Silent return | Owned (013) |
| Victory-persist portal block | `WX` 5986–5990 | Blocks portal during victory persist | Silent return | **NEW** (distinct from 013) |
| In-battle portal tile click | `WX` 10580–10586 / 11161–11167 | `shouldBlockWorldMoveOntoPortal` | Silent return | **NEW** |
| Ground Doka | `WX` 11366–11420 | Claim + credit | Sound + `spawnDoka` + log | **No hole** |
| Dungeon complete | `WX` 6337–6390 | Bonus + white portal pending | Log only | Weak log; not a reject hole |
| Attack Nearest: not attack / no spell | `WX` 17219–17224 | Early `return` | **None** (hotkey bypasses disabled button) | **NEW** |
| Attack Nearest: `no_ap` | `WX` 17251–17263 | Returns; only `on_cooldown` floats | none for `no_ap` | Owned (still silent) |
| Attack Nearest: no target | `WX` 17299–17319 | Footer flash | HUD flash only | Owned |
| Attack Nearest: off-turn | `WX` 17226–17234 | Gate return | none | Owned |
| Your-turn announce | `WX` 12235–12237, 14399 | `logBattleEntry("Your turn")` | Log only; strip name in panel | **NEW** (no banner; contrast `bossEncounterBanner`) |
| Drain heal (player) | `castHelpers.ts` 473–487 | HP restore | Log only | **NEW** (011 lists reflect/shield/lava/DoT, not drain heal float) |
| Mirror Field / Void Mirror / Reflect Shield | `WX` 9538–9558; `castHelpers.ts` 335–375 | HP debit | Log only | Owned 011 |
| Shield absorb (playerTakesDamage) | `WX` 3433–3438 | Reduces dmg | Log; juice only if leftover dmg > 0 | Owned 011 |
| Boss ability dmg / AP drain | `WX` 16025–16045 | Direct HP/AP mutate | **None** (no log, float, sound) | **NEW** |
| Enemy melee on player | `WX` 16749–16788 | Direct HP mutate (bypasses `playerTakesDamage`) | Log only — no float / sound / flash | **NEW** |
| Summon spawn | `WX` 9299–9315; `summonSpawn.ts` 209 | Unit added | Puff + cast SFX + log `"appears!"` | **No hole** |
| Summon lifespan expiry | `summonLifespan.ts` 36; `WX` 14074–14080 | Remove from store | Log `"fades away..."` only | **NEW** |
| Boss rush room step | `WX` 6095–6110; `spawnBossRushRoom` 5288–5378 | Next room map | **None** (no banner/log/toast) | **NEW** |
| Enemy “hit by” toast | enemy spell `WX` 16566–16575 | Damage via `playerTakesDamage` | Log + juice; no dedicated toast | Soft — juice present on spell path |
| Challenge HUD | `ChallengePanel.tsx` + `challengeHudVisibility.ts` | Accept / fail / track | Panel chrome + fail copy | **No hole** (PXA owns visibility) |
| Map modifier announce | `WX` 6732–6741 | Roll on portal | Log + `MapModifiersPanel` | Log+HUD — not silent |
| ATTACK toggle at 0 AP | `WX` 18911–18913 | `onSetAttack` no-op | Opacity + title only; click silent | **NEW** |
| Spell-slot select at 0 AP (in battle) | `WX` 18842–18848 | Selection ignored | Silent | **NEW** |

---

## Highest-impact NEW unique holes (this HEAD)

1. **Enemy melee has no IMPACT juice** — spell hits use `playerTakesDamage` (float + flash + shake + sound); melee mutates HP and logs only.
2. **Boss ability damage / AP drain is fully mute** — not even a battle-log line.
3. **Shrine altar is mute** — 300 Doka + covenant with zero player-facing signal (worse than ground Doka).
4. **Attack Nearest `[S]` when not in Attack mode / no spell** — button disabled, hotkey still silent-returns.
5. **Boss rush room portal advance** — map swaps with no room banner (boss portals get `bossEncounterBanner`).

See `docs/automation/ACTION_IDS_GFCF_2026-09-22.md`.

---

## Still open from prior ledgers (do not duplicate)

- GFCF-003 `applyDamageToEnemy` juice (highest remaining P0; MEDIUM risk — do not auto-implement)
- GFCF-004 hit-flash draw, GFCF-005 hit-stop (RAF freeze), GFCF-008 LEVEL UP chrome, GFCF-009 phase banner, GFCF-010 path overlay, GFCF-011 hazard/reflect/shield labels, GFCF-012 status digits, GFCF-013 Death Realm wait, GFCF-014 heal VFX
- GFCF-2026-09-02-003…005 and memory 09-21 AN no-AP / summon-control / Sacrifice items

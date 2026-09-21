# Game Feel & Combat Feedback Audit — 2026-09-21

**Director:** Game Feel & Combat Feedback Director (`078e61d4-a49f-11f1-a7d1-d6b4613131ce`)  
**Run:** `bc-d8f7025e-2a9d-4098-85b3-a33768c98d2c`  
**Schedule:** cron `0 */48 * * *` (fourth ledger; 2026-08-31 / #149, 2026-09-01 walk-reject + level_up sound, 2026-09-02 attack-mode / off-turn / world-unreachable)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`)  
**Telemetry:** still none in production. DEV-only `recordClickOutcome`. TBC 2026-09-21 is `WAITING_FOR_TELEMETRY` (`AQA-2026-08-30-012` unshipped). Treat telemetry as **absent**, not a clean bill of health.

This is distinct from general UX. The question is whether important actions communicate **what happened, why, what changed, and whether another action is possible**, through ANTICIPATION → ACTION → IMPACT → RECOVERY → INFORMATION.

Do not implement gameplay to chase engagement metrics. This run implemented only presentation-only corrections (summon-control floats, Windstorm miss, potion IMPACT, Attack Nearest reject copy, Sacrifice number). Everything else is ACTION_IDs.

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
| GFCF-2026-08-31-008 | `level_up` sound + banner | **Partial.** Sound shipped. Recap header still `Level {currentLevel}` (`PostBattleRecap.tsx` 267 / 295) with no LEVEL UP chrome |
| GFCF-2026-08-31-009 | Phase-2 banner | **Still open.** Log-only at WX ~15790; encounter banner still 1.5s on *entry* |
| GFCF-2026-08-31-010 | Walk-path overlay | **Still open.** Hover MP is still Manhattan (`WX` 8521–8529) while execute uses `findPath` + Frozen 2× |
| GFCF-2026-08-31-011 | Label non-weapon damage | **Still open.** Lava/spikes still write HP inside the movement RAF and skip `playerTakesDamage` (which now has juice). Do **not** add juice on that RAF path here |
| GFCF-2026-08-31-012 | Status-pill duration digits | **Still open.** Emoji-only pills (`WX` 8240 / 8356) |
| GFCF-2026-08-31-013 | Visible Death Realm wait | **Still open.** 1.5s `armDeathGuards` (`WX` ~13378) still invisible; HP restored immediately |
| GFCF-2026-08-31-014 | `triggerVfx` heal no-op | **Still open.** `WX` ~9344 `triggerVfx: () => { /* no-op */ }` |
| GFCF-2026-08-31-015 | Feel-telemetry | **Still deferred** to AQA-2026-08-30-012 |
| GFCF-2026-09-01-001 | Barrier tokens + leftover invalid-target | **Shipped** (09-01) |
| GFCF-2026-09-01-002 | Attack-mode silent clicks | **Shipped** (09-02) |
| GFCF-2026-09-01-003 | World-mode unreachable float | **Shipped** (09-02) |
| GFCF-2026-09-02-001 | Off-turn canvas after playerCastGate | **Shipped** (09-02) |
| GFCF-2026-09-02-002 | Summon-control walk floats | **Implemented this PR** |
| GFCF-2026-09-02-003 | Paper Windstorm miss float | **Implemented this PR** |
| GFCF-2026-09-02-004 | Potion / item IMPACT | **Implemented this PR** |
| GFCF-2026-09-02-005 | Attack Nearest no-AP hotkey | **Implemented this PR** |

Do not reopen recap XP `level * 100`. Do not wire hit-stop. Do not invent feel-telemetry. Do not clone MIMA-2026-09-21-001/002/004 (modifier HP commit, Dawn MP/AP lie, summon-control preview origin) — those are mechanic-truth, not this director’s canvas copy.

---

## Telemetry

| Signal asked for | Status | Alternative explanation |
| :--- | :--- | :--- |
| Spells selected then cancelled | **No series.** DEV click traces only | Cancel may be the intended “deselect to walk” mode switch (`shouldClearSpellAfterApSpend`) |
| High flee in particular encounters | **No series** | Flee UI may simply be unused |
| Abandonment around boss phases | **No series** | Phase change is still log-only (`WX` ~15790) |
| Discovered spells rarely used | **No discovery layer** | Spellbook still shows all `allSpells` (SDA owns persist) |
| Repeated illegal-action attempts | DEV `recordClickOutcome` only | Summon-control / Attack Nearest / Windstorm were silent before this PR |
| Long turns around certain mechanics | **No series** | 30s turn timer exists; no per-mechanic duration |
| Sharp behaviour after a mechanic release | Cannot attribute | 158 commits / 70 merges since 09-02 TBC; no player population |

**Rule:** do not change balance or rarity from these gaps. TBC-2026-09-21 remains `WAITING_FOR_TELEMETRY`.

---

## What changed since 2026-09-02 (feel-relevant)

Integrity, persist, Attack Nearest origin (`attackNearestLiveCasterPos` always player), Frozen/Slime MP, and challenge healUsed work merged through `#332`. None of it wired primary-hit juice, hit-flash draw, phase banners, heal VFX, or recap LEVEL UP chrome.

Feel holes that landed or stayed silent after 09-02 (unique this run):

1. **Attack Nearest [S]** still returned with no float off the player turn (`shouldAllowPlayerCastEntry`). Tile/sprite already floated `WAIT_FOR_TURN_COPY`.
2. **Summon-control kit fail** (`planSummonControlCast` not ok) logged `summonControlCastFailMessage` and returned with no canvas reason.
3. **Summon-control selected-spell click** with no `targetEnemy` was silent (empty tile / illegal kit tile).
4. **Sacrifice `loseSelfHp`** still bypassed `playerTakesDamage`, so the recorded HP loss had no number.

MIMA already owns the summon-control **preview** lying about Strike origin and the modifier/Dawn resource lies. This director does not re-file those.

---

## Interaction matrix (re-read on `0f5363f`)

| Interaction | Anticipation | Action | Impact | Recovery | Information | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Movement | Hover MP is Manhattan, not path (`WX` 8521) | Click → `findPath` same frame | 600ms path | Camera follows | Gold tile; **no path polyline**. Battle + world + summon-control rejects now float | Weak anticipation; ACTION clearer |
| Tile selection | Hover pulse (walk green / spell blue) | Click gold tint | Immediate | — | Hazard tiles suppress clicked gold | Mostly clear |
| Spell selection | Footer/panel highlight; blue range | Ref + version bump | Range tiles | Auto-clear on 0 AP | Preview during summon-control can paint from the wolf (MIMA-004) | Clear enough except control leftover ring |
| Target highlight | Hover `-dmg` on enemy (non-crit `computeDamage`) | Live entity-first gate | Cast or float | — | Hover ignores crit; no AoE ring | Anticipation incomplete |
| Valid / invalid | Blue/green tiles | Float text | — | — | Spell / walk / attack-mode / off-turn / world-unreachable / summon-control / Attack Nearest resource now float | Much better; AN no-target is still footer-only |
| Damage | Hover `-dmg` | Sounds on spell path | Juice only on `enemyTakesDamage` / `playerTakesDamage` | 900ms fade | Primary `applyDamageToEnemy` still skips numbers/flash/shake | **Primary hits still mute** |
| Healing | — | HP bar | Potion now green number; `triggerVfx` still no-op; drain still log-only | — | Spell heal path still 014 | Better potions; spell heal still weak |
| AP/MP spend | Hover MP; AP bars 0.3s | Immediate decrement | Elixir/boots float this PR | Mode switch to walk at 0 AP | No `-N AP` on spell debit | HUD + item floats |
| Crits | Hover uses non-crit `computeDamage` | `critical_hit` sound | Hitstop/shake only if `enemyTakesDamage` | — | Crit `!` unused on main spell path | Sound without punch |
| Enemy death | — | Shatter + log | Leader 36 gold particles + banner | 350ms fragments | Screen-space shatter from #149 | Leader > regular |
| Player death | HP bar | Recap + 1.5s timer | Toast after teleport | Death Realm | Timer invisible; body looks alive | Modal, not a moment |
| Summons | Lifespan `⏳N`; control dock | One-frame puff + cast SFX | Death pipeline; control rejects now float | — | No spawn float | Spawn still weak; control matches player walk |
| Statuses | Inspect chips | Emoji pills (4 + overflow) | Log on tick/expiry | — | No remaining-turns on canvas | Readable but thin |
| Spell observation | Hover dmg + inspect | — | Windstorm now `"Missed!"` | — | No “you were hit by X” toast | Miss IMPACT added |
| Spell discovery | Full spellbook | — | — | — | No unknown-spell fog | Product gap (SDA/PXA) |
| Level-up | Recap XP bar (curve correct) | — | **`level_up` plays** when recap level > pre-grant | — | Recap still says “Level N” with no LEVEL UP state | Sound yes; banner no |
| Achievement | Toast in world | In-battle queued | Recap section wired (#159) | 4s toast | Payload `newlyUnlockedAchievements` | Fixed |
| Boss phases | Encounter banner on *entry* | Log `PHASE 2!` | Stat/HP change | — | Easy to miss in log scroll | Weak climax |
| Victory | Recap immediate (persist async) | `battle_end` SFX | Overlay; canvas ignored while open | 1s XP bar | Feats wired; leftover XP correct | Solid shell |
| Rewards | Recap Doka/XP | Persist lock | Doka float on pickup; potion IMPACT this PR | — | Recap heal allowed (`pointerEvents`) | Shell good |

---

## Highest-impact disconnected systems (unchanged)

1. **`applyDamageToEnemy` never calls EffectsManager.** Player spells play hit/crit *sound* and write the log. Bounce / DoT / helper damage uses `enemyTakesDamage`, which *does* spawn juice. Same hit, two feels.

2. **`getHitFlashAlpha` has zero render call sites.** Flash is armed and expires unused.

3. **`triggerHitStop` is inert.** RAF uses `tick(16)` and never reads `timeScaleRef`. Do **not** implement here.

4. **Lava / spikes** still move HP inside the movement RAF without `playerTakesDamage` (so the juice that function already has never runs). Reflect / shield / drain stay log-first.

5. **Phase 2** still has no reuse of the 1.5s encounter banner.

---

## Implemented this run (presentation only)

- `classifySummonControlWalkReject` in `engine/walkRejectCopy.ts` — empty path and leftover-MP floats; self-tile quiet.
- `PAPER_WINDSTORM_MISS_COPY` / `SUMMON_NO_TARGET_COPY` in `engine/rejectCopy.ts`.
- `buffItemHealAmount` / `buffItemResourceFloat` in `engine/itemUseFeel.ts`.
- Summon-control mouse/touch walk floats the same copy as player walk; kit miss-click floats `"No target"`; `planSummonControlCast` fail floats the existing fail message.
- Player + enemy Paper Windstorm miss branches float `"Missed!"` at the target tile. Rolls unchanged (30% / 50%).
- `handleUseItem` spawns the existing green heal number or `+3 AP` / `+2 MP` / shield / fury floats.
- Attack Nearest [S] floats `WAIT_FOR_TURN_COPY` off-turn and `playerFacingCastResult` for `no_ap` / `on_cooldown`.
- Sacrifice `loseSelfHp` spawns a damage number for `recorded.lost`.

Tests: `walkRejectCopy.test.ts`, `rejectCopy.test.ts`, `itemUseFeel.test.ts`.

Not touched: RAF loop, map generation, turn logic, damage math, hover MP formula, hit-flash draw, `applyDamageToEnemy` juice.

---

## Open drafts that already own a feel or WX surface

| PR | Theme | Director action |
| :--- | :--- | :--- |
| #327 | Striker AoE / bounce range | Oldest WX owner. Union, do not overwrite. |
| #331 | Portal destack corridor | Map / EnemyRegister. No feel helper overlap. |
| #333 | TBC WAITING_FOR_TELEMETRY docs | README table. Do not overwrite TBC lines. |
| #334 | Admin honesty | `AdminDashboard` only. |
| #335 | Mobile / a11y | Avoided WX on purpose. |
| #336 | MIMA matrix | Docs; owns modifier/Dawn/preview-origin. |
| #337 | World/dungeon admin design | Docs. |

#108 / #138 leftover-XP HUD: **merged**. #149 juice + reject copy: **merged**. #159 feat recap: **merged**. #326 Attack Nearest origin: **merged**.

---

## ACTION_ID ledger

See `docs/automation/ACTION_IDS_GFCF_2026-09-21.md`. Prior IDs remain in `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, and `ACTION_IDS_GFCF_2026-09-02.md`.

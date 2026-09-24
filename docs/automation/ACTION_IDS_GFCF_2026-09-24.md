# Game Feel ACTION_IDs — 2026-09-24

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-09-24.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-adc62e53-57d0-4ba7-9a84-79c4d1a2a81e`

Prior IDs `GFCF-2026-08-31-001` … `015` live in `ACTION_IDS_2026-08-31.md`.  
`GFCF-2026-09-01-001` … `003` live in `ACTION_IDS_2026-09-01.md`.  
`GFCF-2026-09-02-001` … `005` live in `ACTION_IDS_GFCF_2026-09-02.md`.  
`GFCF-2026-09-21-001` … `004` are **queued in #363** (not on `main`).  
`GFCF-2026-09-21-005` and `GFCF-2026-09-22-001` … `009` are **queued in #419** (not on `main`).  
`GFCF-2026-09-23-001` … `005` are **queued in #478** (not on `main`). Drain self-heal (`WX` 16626 / 15873) is **001**, not a twin.  
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx`, already owned by older still-open PRs (#327, #363, #419, #478).

---

ACTION_ID: GFCF-2026-09-24-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Draw the live Void Rift cell (log coords are not a telegraph)  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `voidRiftTile` (`WX` 2348) is written on player-turn warp (`WX` 14375–14391) and read by `applyBattleWalkHazards` / standing ticks. Grep of `src/frontend` shows **zero** render readers — only state, hazard math, and the deps array. Warp copy is `"Void Rift warps tile (${pick.x},${pick.y})! Avoid it!"`. Canvas has no grid numbers. `addModHazards("lava")` when `void_rift` is triggered (`WX` 6705–6709) paints **lava** (real 011 damage), not the rift cell. Distinct from 011 (lava overlay exists) and from 09-23-004 (ice).  
SYSTEMS_AFFECTED: WorldExploration floor overlay pass; `voidRiftTile` only  
RECOMMENDED_ACTION: Reuse the existing isometric floor clip (`WX` 7417+) with a purple/void tint on `voidRiftTile`. Keep the log. Optionally drop the raw `(x,y)` from the string once the tint exists. Do not add a 1.5s banner. Do not change the 3 HP tick or the random pick.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing hazard overlay; do not invent a second rift mechanic  
REGRESSION_RISK: LOW for a tint on an already-damaging cell. Do not paint lava as the rift — that would keep the lie.  
VALIDATION_REQUIRED: Force a Void Rift map; the damaging cell matches the tint each warp; stepping elsewhere does not take rift damage; lava tiles on the same map still behave as lava.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-24-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float map-modifier HP the same way spell hits already can (off the movement RAF)  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyBattleWalkHazards` (`WX` 9915–9928) subtracts Thorned / Void Rift walk HP and logs. Plague Zone player tick (`WX` 14313–14324) uses `hpAfterIncomingDamage` + log, not `playerTakesDamage`. Enemy/summon plague and rift standing ticks (~14449 / ~14545 / ~14646) `updateCombatant` + log. None spawn a damage number. Distinct from 011 (lava/spikes **inside** the 600ms walk RAF — still frozen). These writes already run after the path / at turn start.  
SYSTEMS_AFFECTED: WorldExploration `applyBattleWalkHazards`; plague / void-rift turn-start ticks; existing `spawnDamageAtTile`  
RECOMMENDED_ACTION: After the existing HP write, `spawnDamageAtTile(..., dmg, "damage")` at the victim tile. Reuse `"Thorned!"` / `"Plague!"` / `"Rift!"` as optional float text only if a second number would stack; one red number matching the log is enough. Do **not** route through `playerTakesDamage` (that applies RES). Do not touch the movement RAF.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-08-31-001  
REGRESSION_RISK: LOW — presentation on already-committed HP. MEDIUM only if routed through `playerTakesDamage` (RES + shield + challenge double-count).  
VALIDATION_REQUIRED: Long thorned walk; one number matching the log. Plague turn start; one number; lethal plague still deaths. Void Rift step on the live cell; one number. Lava/spikes still wait on 011.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-24-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Swap needs a one-frame puff (camera already jumps)  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `swapPositions` (`WX` 9389–9401) assigns player coords from the target and `updateCombatant` the old player cell in the same frame. No `spawnPixelPuff`, no float, no `playSound`. Walk IMPACT is a 600ms path; Swap is a silent teleport. Distinct from 09-22-007 (lifespan expiry) and from 09-23-002 (hostile spawn). Occupancy/hazard landing on Swap is MIMA-001 — do not change dest rules here.  
SYSTEMS_AFFECTED: WorldExploration `swapPositions` only  
RECOMMENDED_ACTION: One existing puff (or short `"Swapped"` float) at **both** cells after the writes. Do not add a 1.5s banner. Do not change who occupies which tile.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing `spawnPixelPuff`  
REGRESSION_RISK: LOW — presentation after a successful swap. Occupied-fail still returns before this callback.  
VALIDATION_REQUIRED: Cast Swap onto an enemy; both bodies move one frame; one puff or float each; hazards still not applied (MIMA).  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-24-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Tint marked tiles until the ×2 hit consumes them  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `placeMark` (`WX` 9404) adds `"x,y"` to `markedTilesRef`. `computeDamage` doubles when the key matches (`WX` 3331–3334) then deletes (`WX` 3391–3392). Frontend grep: those three sites only — **no draw**. Hover can list `×2 mark` in the floating breakdown (`WX` 8209–8215) with no floor tint, so the bonus looks like a random crit. Distinct from 001 (Void Rift is a modifier cell, not a player mark). Distinct from 012 (status pills).  
SYSTEMS_AFFECTED: WorldExploration floor overlay pass; `markedTilesRef`  
RECOMMENDED_ACTION: In the existing floor overlay (`WX` 7417+), tint keys in `markedTilesRef` (gold/crimson, one overlay, no particles). Keep consume-on-hit. Do not change the ×2 math.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing hazard overlay clip  
REGRESSION_RISK: LOW — presentation of an already-stored set. Do not leave the tint after consume.  
VALIDATION_REQUIRED: Cast a Mark spell; the cell tints; next damaging hit on that cell consumes the tint and still ×2s once; a different cell is unchanged.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 / 09-22 / 09-23 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`).  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009.  
- **#478 queue** — GFCF-2026-09-23-001…005 (001 includes enemy/boss **drain** self-heal).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs (`_isFogOfWar` / `_isGravityWell` unused) are PXA/MIMA honesty, not a twin GFCF ID.

## Explicit non-holes from this search

- Flee: confirm dialogs present.  
- End Turn disabled: `title=` explains summon / wait.  
- Rest / sanctuary portal: toasts present (`WX` 6142 / 6205).  
- Ground Doka: sound + float + log.  
- Map modifiers: log + `MapModifiersPanel`.  
- Challenge HUD: panel fail/on-track chrome.  
- **Player** summon spawn: puff + SFX + log (hostile spawn is 09-23-002).  
- Dungeon-chain complete: gold log already names the bonus (`WX` 6374–6376).  
- Player DoT ticks: already go through `playerTakesDamage` (juice + log).  
- Leader death: `"LEADER DEFEATED!"` overlay (`WX` 8556–8603).  
- Spell fizzle: canvas `"✦ FIZZLED! ✦"` + SFX (`WX` 17337–17347).  
- Attack Nearest cooldown: already floats `"On cooldown"` (`WX` 17251–17261).  
- hitsAllies self-hit: log + `spell_hit` already exist; canvas number waits on **003**.  
- `applyDamageToPlayer` is unused (spellEngine never calls it) — dead-code, not a feel ID.  
- Enemy AI 5s watchdog: not a player-facing “time’s up” moment (see 09-23-003).  
- Fury Potion expiry: log-only (`WX` 14293) — HUD ATK is enough; not filed.  
- Barrier fade: tower disappears; log `"Barrier at ${bKey}"` is ugly but the visual IMPACT exists — not filed.

# Game Feel ACTION_IDs — 2026-09-25

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-09-25.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-ec8c6aeb-4f97-4609-9567-6e4e559b11fe`

Prior IDs `GFCF-2026-08-31-001` … `015` live in `ACTION_IDS_2026-08-31.md`.  
`GFCF-2026-09-01-001` … `003` live in `ACTION_IDS_2026-09-01.md`.  
`GFCF-2026-09-02-001` … `005` live in `ACTION_IDS_GFCF_2026-09-02.md`.  
`GFCF-2026-09-21-001` … `004` are **queued in #363** (not on `main`).  
`GFCF-2026-09-21-005` and `GFCF-2026-09-22-001` … `009` are **queued in #419** (not on `main`).  
`GFCF-2026-09-23-001` … `005` are **queued in #478** (not on `main`).  
`GFCF-2026-09-24-001` … `004` are **queued in #523** (not on `main`).  
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 / #523 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx`, already owned by older still-open PRs (#327, #363, #419).

---

ACTION_ID: GFCF-2026-09-25-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Timestep restore needs +AP/+MP IMPACT; a second cast should not say Aborted  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Success (`spellEngine.ts` 721–733) calls `restoreApMp` (`WX` 9355–9373) and logs `"Timestep! AP and MP restored to full"`. HUD AP/MP bars jump; no canvas `"+N AP"` / `"+N MP"`. Potion elixir/boots IMPACT is #363 / 09-02-004 (item use). A second Timestep returns `"abort"` because `consumeTimestep` is already true (`WX` 9350–9353). Tile/sprite handlers float `playerFacingCastResult("abort")` → `"Aborted"` (`rejectCopy.ts` 59–63; `WX` 10488–10494) while the log already says `"Timestep can only be used once per battle!"`. Distinct from 09-22-008 (ignored Attack / slot click at 0 AP).  
SYSTEMS_AFFECTED: WorldExploration `restoreApMp` + Timestep abort return; `engine/rejectCopy.ts` copy token  
RECOMMENDED_ACTION: After a successful restore, one short `"+AP +MP"` (or the restored amounts) at the player tile. Map this abort to `"Already used"` (or `"Once per battle"`), not generic `"Aborted"`. Do not change the once-per-battle gate or the AP-restore formula. Do not add a 1.5s banner.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-08-31-001 for the float; do not reuse potion item helpers as the spend path  
REGRESSION_RISK: LOW — presentation on an already-committed restore / already-failing second cast. MEDIUM only if other `"abort"` reasons (drain no-target) are retitled without a dedicated token.  
VALIDATION_REQUIRED: First Timestep: bars refill, one float, AP is not deducted (`return "no_ap"` preserved). Second Timestep: one `"Already used"` (not `"Aborted"`), no second restore. Drain-no-target abort copy stays its own string.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-25-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Mirror activate needs a canvas IMPACT (log already exists)  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `spell.isMirror` (`spellEngine.ts` 917–925) calls `activateMirror` (`WX` 9574–9578 / `activatePlayerMirror`) and logs `"Mirror active! Next single-target damage spell cast at you reflects back!"`. No float, no shield flash, no pill beyond whatever `applyEffect` does not run on this branch. Distinct from 011 (Mirror *Field* 20% reflect writes player HP + log at `WX` 9538–9561 — source label / number, not the buff-up). Distinct from potion `+20 Shield` (#363).  
SYSTEMS_AFFECTED: WorldExploration `activateMirror` only  
RECOMMENDED_ACTION: One short `"Mirror!"` float at the player tile after a successful activate. Keep the log. Do not add particles or a 1.5s banner. Do not change consume-on-hit.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: none  
REGRESSION_RISK: LOW — presentation after a successful 4-AP Mirror. Failed / non-Mirror casts unchanged.  
VALIDATION_REQUIRED: Cast Mirror; one float + existing log; next single-target enemy hit still consumes the mirror; a second Mirror before consume still behaves as live combat.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-25-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Betrayal hits need the same IMPACT juice as enemyTakesDamage  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Ally betrayal (`WX` 15594–15647) rolls 5% at AI tier ≥ 10, logs `"turns on {ally}! Betrayal!"`, writes `enemyHpMap`, and on a kill may 6× the betrayer HP. No `enemyTakesDamage`, no `spawnDamageAtTile`. Player-side `ctx.dealDamage` (`WX` 9171–9183) already juices. Distinct from 003 (`applyDamageToEnemy` on the player spell path) and 09-22-001 (enemy melee vs the *player*). Double-betrayal 0.15 follow-up (`WX` 15658+) is the same IMPACT class — one ID.  
SYSTEMS_AFFECTED: WorldExploration betrayal / double-betrayal HP writes; existing `spawnDamageAtTile`  
RECOMMENDED_ACTION: After the existing HP write, `spawnDamageAtTile(..., btDmg, "damage")` at the victim tile. Optional `"Betrayal!"` float only if a second number would stack — one red number matching the log is enough. Do **not** route through `playerTakesDamage`. Do not change the 5% / 15% rolls or the 6× enrage math.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-08-31-001  
REGRESSION_RISK: LOW — presentation on already-committed HP. MEDIUM if routed through `playerTakesDamage` (RES + shield + challenge). Leader betrayal should still use the existing leader shatter.  
VALIDATION_REQUIRED: Force the betrayal branch; one red number matching the log; lethal betrayal still removes the ally and 6×s the betrayer; double-betrayal second hit also numbers.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-25-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Preview hitsMultiple blast victims on hover (blue ring is clickable range)  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Blue overlay (`WX` 7686–7706) paints `getSpellRangeTiles` → `computeTargetableTiles` (`targeting.ts` 392–417): live-ok *click* tiles. `targetType === "area"` already expands by `areaRadius` (`targeting.ts` 619–697). `hitsMultiple` victims are Chebyshev from the clicked tile (`hitsMultipleIncludesOccupant`, `targeting.ts` 220–224) and are not a hover overlay. Hover `-dmg` (`WX` 8185–8199) is non-crit `computeDamage` on the one hovered enemy. Distinct from 010 (walk path polyline / Manhattan hover MP). Distinct from #327 Striker *execute* range (combat truth).  
SYSTEMS_AFFECTED: WorldExploration hover pass; optional reuse of `getAoETargetsHelper` / `hitsMultipleIncludesOccupant`  
RECOMMENDED_ACTION: While a `hitsMultiple` spell is selected and the pointer is on a legal click tile, tint (or ring) other occupants that `hitsMultipleIncludesOccupant` would include. One overlay, no particles. Do not change blast math or Striker fail rules. Skip `targetType === "area"` (already expanded). Do not pause the RAF to compute a second full-grid scan every frame — reuse the live combatant list already in the sprite pass.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing `hitsMultipleIncludesOccupant`; do not invent a second radius  
REGRESSION_RISK: LOW if presentation-only. MEDIUM if the overlay uses `areaRadius` instead of the live hitsMultiple radius (preview/execute drift — the targeting comment already warns).  
VALIDATION_REQUIRED: Select Inferno-style hitsMultiple; hover a clustered enemy; other in-radius hostiles tint; a unit outside the click-radius does not; execute still hits the same set. Area-target spells unchanged.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-25-005  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float Occupied when a controlled summon path lands on a taken cell  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Player battle-walk floats `"Occupied"` when a living combatant is on the dest (`WX` 10511–10517). Controlled-summon walk after `findPath` still only logs `"Cannot move there"` when `resolveControlledSummonMoveDest` returns null (`WX` 9990–9992). #363 owns empty-path / leftover-MP canvas copy, not this occupancy miss. Player-facing walk already has `playerFacingRejectReason("ground_occupied")` === `"Occupied"` (`rejectCopy.ts` 20).  
SYSTEMS_AFFECTED: WorldExploration summon-control dest fail (mouse + touch callers of this helper)  
RECOMMENDED_ACTION: Reuse `"Occupied"` at `tileCenter` on `!landed`. Keep the log or drop the ugly string. Do not change occupancy / dest-stack rules (#467 owns sharing occupancy with player Occupied as combat truth — this ID is the canvas float only).  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-09-02-002 (#363) for the walk-reject helper; copy may be the existing `"Occupied"` string  
REGRESSION_RISK: LOW — copy on an already-failing return. Occupied dest must still not walk.  
VALIDATION_REQUIRED: Control a wolf; click a tile whose path end is occupied; one `"Occupied"` float; legal free dest still walks; leftover-MP empty path still uses #363 copy, not this string.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 / 09-22 / 09-23 / 09-24 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF. Mirror Field reflect (`WX` 9538–9561) stays here.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`).  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait. #554 is the walk block.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009.  
- **#478 queue** — GFCF-2026-09-23-001…005 (001 includes enemy/boss **drain** self-heal).  
- **#523 queue** — GFCF-2026-09-24-001…004 (Void Rift tint, modifier HP numbers, Swap puff, Mark tint).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs (`_isFogOfWar` / `_isGravityWell` unused) are PXA/MIMA honesty, not a twin GFCF ID. Blood Moon painting **spikes** while the announce says “crimson tide” is the same honesty class as Void Rift painting lava — leave under PXA; rift *cell* draw is #523 / 09-24-001.

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
- Barrier *place*: tower appears the same frame as the log — not filed.  
- `targetType === "area"` blue ring already expands by `areaRadius` — 004 is hitsMultiple victims only.  
- Bomber / summon `dealDamage`: `WX` 14997–15003 → `enemyTakesDamage` (juice). Detonate death uses `processCombatantDeathCb`.  
- Sacrifice *enemy* half: `ctx.dealDamage` → `enemyTakesDamage`. Self-HP is #363 / 09-21-004.  
- Hover crit omission stays a matrix note (ANTICIPATION) — do not twin 004; the fix is a damage-preview flag, not a blast overlay.

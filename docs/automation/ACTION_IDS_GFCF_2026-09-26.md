# Game Feel ACTION_IDs — 2026-09-26

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-09-26.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-b62aac23-21f4-4a1f-80b8-b5033521c5b5`

Prior IDs `GFCF-2026-08-31-001` … `015` live in `ACTION_IDS_2026-08-31.md`.  
`GFCF-2026-09-01-001` … `003` live in `ACTION_IDS_2026-09-01.md`.  
`GFCF-2026-09-02-001` … `005` live in `ACTION_IDS_GFCF_2026-09-02.md`.  
`GFCF-2026-09-21-001` … `004` are **queued in #363** (not on `main`).  
`GFCF-2026-09-21-005` and `GFCF-2026-09-22-001` … `009` are **queued in #419** (not on `main`).  
`GFCF-2026-09-23-001` … `005` are **queued in #478** (not on `main`).  
`GFCF-2026-09-24-001` … `004` are **queued in #523** (not on `main`).  
`GFCF-2026-09-25-001` … `005` are **queued in #571** (not on `main`).  
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 / #523 / #571 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx`, already owned by older still-open PRs (#327, #363, #419).

---

ACTION_ID: GFCF-2026-09-26-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float when a sealed progression portal refuses to fire  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `checkPortalInteraction` (`WX` 6048–6072) returns after an edge-triggered log `"🔒 The way forward is sealed until every foe falls."` when `isProgressionLocked` is true. The gold portal tint still appears; no canvas float. Rest / sanctuary already toast (`WX` 6142 / 6205). Distinct from 09-22-006 (victory-persist early return at `WX` 5986–5990 — no log, different lock). Distinct from 013 (Death Realm 1.5s wait chrome and the pending-realm portal return at `WX` 5978–5984). Typical path: flee or leave hostiles on a dungeon / Boss Rush map, then step the progression portal.  
SYSTEMS_AFFECTED: WorldExploration `checkPortalInteraction` sealed-progression branch only  
RECOMMENDED_ACTION: One short `"Sealed"` (or `"Clear the map"`) float at the portal tile on the same edge-trigger as the log. Keep the log. Do not change `isProgressionLocked`. Do not add a 1.5s banner.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: none  
REGRESSION_RISK: LOW — copy on an already-failing return. Self-tile / off-portal stays quiet (ref cleared at `WX` 6019–6021).  
VALIDATION_REQUIRED: Leave one hostile alive (or flee); step the progression portal; one float + existing log; portal does not fire; stepping off and on again floats once more; rest / sanctuary still toast; victory-persist block still has no sealed copy.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-26-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Boss ability minion/ghost spawn needs the same puff as player summons  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Ability result `res.spawns` (`WX` 16104–16184) builds Minion/Ghost `Enemy` records and `addCombatant`s them. No `spawnPixelPuff`, no `playSound("spell_cast")`. Player `spawnUnit` already puffs (`WX` 9308–9315). 09-23-002 owns `commitHostileSummon` / `spawnEnemySummonUnit` (kit summons, including boss kit at `WX` 15829). `SPAWN_MINIONS` / larvae / ghost-boss lists do not go through that helper. Log may already exist via `res.logMessages` (`WX` 16018–16019).  
SYSTEMS_AFFECTED: WorldExploration boss `res.spawns` loop only  
RECOMMENDED_ACTION: On each successful `addCombatant`, reuse the existing one-frame puff at that cell. If `spawns.length > 4` (Final Pawn ghost wave), one puff at the boss tile is enough — do not spray 11 particle bursts. Do not add a 1.5s banner. Do not change occupancy / `insertAfterId` / HP math.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing `spawnPixelPuff`; do not route through `commitHostileSummon` (different occupancy / kit)  
REGRESSION_RISK: LOW — presentation after a successful add. Occupied / `MAX_ENEMIES` slice already drops extras (`WX` 16164–16179) — no puff for unadded rows. MEDIUM only if puff is drawn for sliced-off spawns.  
VALIDATION_REQUIRED: Force `SPAWN_MINIONS`; each committed minion (or the boss tile when >4) puffs once; turn insert still `insertAfterId: "player"`; kit `commitHostileSummon` still waits on #478 / 09-23-002.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-26-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Boss teleport / knight-jump needs a one-frame puff (camera already jumps)  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Ability apply reads `res.newBossPosition` (`WX` 16022–16023) and `updateCombatant`s that cell (`WX` 16199–16202 / 16206–16208). No `spawnPixelPuff`, no float, no `playSound`. Walk IMPACT is a 600ms path; this is a silent snap. Distinct from 09-24-003 (player `swapPositions` at `WX` 9389–9401). `TELEPORT_ADJACENT` / `KNIGHT_JUMP_IGNORE_WALLS` / other `newBossPosition` writers are the same IMPACT class — one ID. Skip when `newBossX/Y` equal the old cell.  
SYSTEMS_AFFECTED: WorldExploration boss ability position write only  
RECOMMENDED_ACTION: One existing puff (or short `"Blink"`) at the **old** cell and the **new** cell after the write, only when the cell actually changed. Do not add a 1.5s banner. Do not change landing occupancy or trail hazards (`newHazardTiles` already paint).  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing `spawnPixelPuff`; Swap puff stays #523 / 09-24-003  
REGRESSION_RISK: LOW — presentation after a successful move. Ends-turn abilities (`PROMOTE_QUEEN`, `SPLIT_ROOKS`, `MERGE_BISHOPS`) still advance immediately.  
VALIDATION_REQUIRED: Force a teleport-adjacent result; both cells puff (or one `"Blink"`); body is on the new tile next frame; same-cell ability results stay quiet; player Swap still waits on #523.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-26-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Preview Chain Lightning bounce victims on hover (hitsMultiple overlay is a different set)  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Bounce set is nearest-N other living hostiles from the primary (`castHelpers.ts` 430–458, Manhattan sort, `spell.bounces`). Bounce *IMPACT* already juices via `enemyTakesDamage` (003 must skip this path to avoid double-count). Hover `-dmg` (`WX` 8185–8199) is non-crit `computeDamage` on the one hovered enemy. 09-25-004 is `hitsMultipleIncludesOccupant` Chebyshev from the *clicked* tile (`targeting.ts` 220–224) — not this sort. Distinct from 010 (walk path). Distinct from #327 Striker *execute* range. Bounce log still prints `bounceEnemy.id` rather than the piece name — optional copy fix under this ID, not a twin.  
SYSTEMS_AFFECTED: WorldExploration hover pass; reuse the live hostile list already in the sprite pass  
RECOMMENDED_ACTION: While a `bounces > 0` spell is selected and the pointer is on a legal primary target, tint (or ring) the nearest-N other hostiles the execute sort would pick. One overlay, no particles, no extra numbers on hover. Do not change bounce math or Striker fail rules. Do not scan the full grid every RAF frame. Skip `hitsMultiple` (owned by #571 / 09-25-004) and `targetType === "area"` (already expanded).  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing bounce sort in `applyDamageToEnemy`; do not invent a second radius  
REGRESSION_RISK: LOW if presentation-only. MEDIUM if the overlay uses Chebyshev / `areaRadius` instead of the live Manhattan nearest-N (preview/execute drift).  
VALIDATION_REQUIRED: Select a `bounces > 0` spell; hover clustered hostiles; the N nearest others tint; a farther unit does not; execute still hits the same N; hitsMultiple / area spells unchanged; bounce numbers still come from `enemyTakesDamage` once.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 / 09-22 / 09-23 / 09-24 / 09-25 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`. Bounce already juices — 004 is preview only.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF. Mirror Field reflect (`WX` 9538–9561) stays here.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`).  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait. #554 is the walk block. Silent Death Realm portal return stays here.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009.  
- **#478 queue** — GFCF-2026-09-23-001…005 (001 includes enemy/boss **drain** self-heal; 002 is kit `commitHostileSummon` only).  
- **#523 queue** — GFCF-2026-09-24-001…004 (Void Rift tint, modifier HP numbers, Swap puff, Mark tint).  
- **#571 queue** — GFCF-2026-09-25-001…005 (Timestep, Mirror activate, Betrayal, hitsMultiple hover, Occupied summon dest).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs (`_isFogOfWar` / `_isGravityWell` unused) are PXA/MIMA honesty, not a twin GFCF ID. Blood Moon painting **spikes** while the announce says “crimson tide” is the same honesty class as Void Rift painting lava — leave under PXA; rift *cell* draw is #523 / 09-24-001. **Invincible / shell armor / `damageImmune`:** `useBossSystem` / `useBossAI` write logs and state, but WorldExploration never reads `invincibleTurnsLeft`, `shellArmorActive`, or `damageImmune` on player hits — a canvas banner would lie until that gate exists. Leave under MIMA, not a GFCF twin of 009. **Illusion split / `newVoidTiles`:** `newBossState` merges, `illusionsRef` is only cleared (`WX` 11663), `newVoidTiles` has zero WX readers — MIMA (copies/voids never become combatants or floor), not a puff ID.

## Explicit non-holes from this search

- Flee: confirm dialogs present.  
- End Turn disabled: `title=` explains summon / wait.  
- Rest / sanctuary portal: toasts present (`WX` 6142 / 6205).  
- Ground Doka: sound + float + log.  
- Map modifiers: log + `MapModifiersPanel` (Time Warp footer timer is enough).  
- Challenge HUD: panel fail/on-track chrome.  
- **Player** summon spawn: puff + SFX + log (kit hostile spawn is 09-23-002; ability minions are 002 this ledger).  
- Dungeon-chain complete: gold log already names the bonus (`WX` 6374–6376).  
- Player DoT ticks: already go through `playerTakesDamage` (juice + log).  
- Leader death: `"LEADER DEFEATED!"` overlay (`WX` 8556–8603).  
- Spell fizzle: canvas `"✦ FIZZLED! ✦"` + SFX (`WX` 17337–17347). Tile/AN paths do **not** also float `playerFacingCastResult("fizzled")` — no overlap.  
- Attack Nearest cooldown: already floats `"On cooldown"` (`WX` 17251–17261). Spell-slot CD overlay already shows remaining turns (`BattleUIPanel.tsx` 705–732) — do not float on the disabled button.  
- hitsAllies self-hit: log + `spell_hit` already exist; canvas number waits on **003**.  
- `applyDamageToPlayer` is unused (spellEngine never calls it) — dead-code, not a feel ID.  
- Enemy AI 5s watchdog: not a player-facing “time’s up” moment (see 09-23-003).  
- Fury Potion expiry: log-only (`WX` 14293) — HUD ATK is enough; not filed.  
- Barrier fade: tower disappears; log `"Barrier at ${bKey}"` is ugly but the visual IMPACT exists — not filed.  
- Barrier *place*: tower appears the same frame as the log — not filed.  
- `targetType === "area"` blue ring already expands by `areaRadius` — 09-25-004 is hitsMultiple victims only; 004 this ledger is bounce only.  
- Bomber / summon `dealDamage`: `WX` 14997–15003 → `enemyTakesDamage` (juice).  
- Sacrifice *enemy* half: `ctx.dealDamage` → `enemyTakesDamage`. Self-HP is #363 / 09-21-004.  
- Hover crit omission stays a matrix note (ANTICIPATION) — do not twin 004.  
- Boss `newHazardTiles`: already written into `currentMap.hazardTiles` (`WX` 16088–16101) so lava/spike overlays exist — placement puff would be spectacle.  
- Recap Doka Fever ×2: map announce + `MapModifiersPanel` already fired; recap total is enough — not filed.

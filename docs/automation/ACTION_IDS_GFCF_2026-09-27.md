# Game Feel ACTION_IDs — 2026-09-27

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-09-27.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-7b1ff0ec-4118-478c-978f-e8034fc32dfa`

Prior IDs `GFCF-2026-08-31-001` … `015` live in `ACTION_IDS_2026-08-31.md`.  
`GFCF-2026-09-01-001` … `003` live in `ACTION_IDS_2026-09-01.md`.  
`GFCF-2026-09-02-001` … `005` live in `ACTION_IDS_GFCF_2026-09-02.md`.  
`GFCF-2026-09-21-001` … `004` are **queued in #363** (not on `main`).  
`GFCF-2026-09-21-005` and `GFCF-2026-09-22-001` … `009` are **queued in #419** (not on `main`).  
`GFCF-2026-09-23-001` … `005` are **queued in #478** (not on `main`).  
`GFCF-2026-09-24-001` … `004` are **queued in #523** (not on `main`).  
`GFCF-2026-09-25-001` … `005` are **queued in #571** (not on `main`).  
`GFCF-2026-09-26-001` … `004` are **queued in #610** (not on `main`).  
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 / #523 / #571 / #610 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx`, already owned by older still-open PRs (#327, #363, #419).

---

ACTION_ID: GFCF-2026-09-27-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Player Mirror consume/reflect needs the same IMPACT number as a normal hit  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Enemy single-target, non-AoE spells that hit an armed player Mirror (`WX` 16496–16529) call `consumePlayerMirror` (`utils/playerMirror.ts` 18–21), apply already-RES-reduced `mirrorDmg` via `updateCombatant`, optionally `processCombatantDeathCb`, and log `"Mirror! {piece}'s {spell} was reflected back for {n} dmg!"`. No `enemyTakesDamage`, no `spawnDamageAtTile` (`combatJuice.ts` 39–50). The else-branch already juices the *player* through `playerTakesDamage` (`WX` 16566–16569). Distinct from 011 (Mirror *Field* 20% reflect writes *player* HP + log at `WX` 9538–9561). Distinct from 09-25-002 (activate `"Mirror!"` float — #571 says do not change consume-on-hit). Distinct from 003 (`applyDamageToEnemy` on the player-cast path). Distinct from 09-22-001 (enemy melee vs the player).  
SYSTEMS_AFFECTED: WorldExploration enemy-cast Mirror consume branch only  
RECOMMENDED_ACTION: After the existing HP write, `spawnDamageAtTile(..., mirrorDmg, "damage")` at the attacker tile. Optional short `"Mirror!"` at the player tile so consume is visible when the enemy is off-screen. Keep the log. Do **not** route through `enemyTakesDamage` (RES is already in `mirrorDmg`; a second pass would double-reduce). Do not change `consumePlayerMirror`, AoE/hitsMultiple skip, or the death callback.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-08-31-001; activate float stays #571 / 09-25-002  
REGRESSION_RISK: LOW — presentation on an already-committed reflect. MEDIUM if routed through `enemyTakesDamage` (RES + map-modifier + challenge). Lethal reflect must still shatter via the existing death pipeline.  
VALIDATION_REQUIRED: Arm Mirror; enemy single-target spell; one red number matching the log; mirror does not consume on AoE/hitsMultiple; second enemy spell after consume hits the player through `playerTakesDamage`; lethal reflect still removes the attacker.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-27-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Enemy in-battle walk needs a one-frame puff (do not add a 600ms path)  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Regular AI dest is committed with `enemyDestToCommit` + `updateCombatant` (`WX` 16416–16423; helper `battleSetup.ts` 394–406 returns null on same-cell). Erratic post-leader walk writes `{ x: erX, y: erY }` (`WX` 15590) with no puff. Move log is later (`WX` 16824–16828). Overworld wander still tweens `movementPath` (`WX` 6893–6922). Distinct from 09-26-003 (boss ability `res.newBossPosition` at `WX` 16199–16208). Distinct from 09-24-003 (player `swapPositions`). Distinct from 09-22-001 (melee *damage* juice — dest may also move on the same turn).  
SYSTEMS_AFFECTED: WorldExploration `enemyDestToCommit` write + erratic dest write only  
RECOMMENDED_ACTION: One existing puff at the **old** cell and the **new** cell after a successful dest write, only when the cell actually changed (`enemyDestToCommit` already returns null on same-cell; skip erratic when `erX/erY` equal origin). Do **not** add a 600ms `movementPath` tween (preserves turn speed; RAF freeze). Do not add a 1.5s banner. Do not change occupancy, kite math, or `advanceTurn` delay.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing `spawnPixelPuff`; boss teleport puff stays #610 / 09-26-003  
REGRESSION_RISK: LOW — presentation after a successful move. Same-cell casts stay quiet. Hazard landing (003 this ledger) still runs on the committed dest.  
VALIDATION_REQUIRED: Force an AI `move` that changes cell; both cells puff once; body is on the new tile next frame; same-cell skip/hold stays quiet; overworld wander still tweens; boss ability teleport still waits on #610.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-27-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Enemy lava / spikes / ice landing needs a canvas number or Frozen float  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: After dest commit, `WX` 16874–16951 reads `currentMap.hazardTiles` at the new cell. Lava: 8–15 HP via `enemyHpAfterHazardDamage` + Burn DoT + log `"walked on lava! -N HP"`. Spikes: 5–10 HP + log `"hit spikes! -N HP"`. Ice: Frozen (−2 MP, 2 turns) + log `"stepped on ice! Slowed!"`. None call `enemyTakesDamage` / `spawnDamageAtTile`. Distinct from 011 (player lava/spikes *inside the movement RAF* — do not add juice there). Distinct from 09-24-002 (player thorned / plague / rift-walk off-RAF). Distinct from 09-23-004 (player ice Frozen in the RAF). Distinct from 09-22-001 (melee).  
SYSTEMS_AFFECTED: WorldExploration enemy hazard-landing block only  
RECOMMENDED_ACTION: After the existing HP write, `spawnDamageAtTile(..., hDmg|hsDmg, "damage")` at the landing cell. Ice: one short `"Frozen"` (or `"Slowed"`) float — no fake damage number. Keep the logs. Do **not** route through `enemyTakesDamage` (would re-apply RES). Do not change hazard rolls, Burn DoT, or lethal `processCombatantDeathCb`. Do not touch the player RAF lava path.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-08-31-001; player lava/ice stay 011 / 09-23-004  
REGRESSION_RISK: LOW — presentation on already-committed hazard. MEDIUM if routed through `enemyTakesDamage`. Same-cell dest (`enemyDestToCommit` null) already skips this block.  
VALIDATION_REQUIRED: Force an enemy onto lava; one red number matching the log + existing Burn; spikes number; ice float without a number; lethal lava still removes the unit; player stepping lava is unchanged (still 011).  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-27-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Betrayal enrage 6× inflate needs a canvas IMPACT (victim number is a different ID)  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: MEDIUM  
EVIDENCE: Lethal betrayal (`WX` 15613–15647) `removeCombatant`s the ally, `setEnragedEnemies`, and `updateCombatant`s 6× `maxHp`/`hp`. InitiativeStrip / BattleUIPanel show a fire badge (`InitiativeStrip.tsx` 351–368) — INFORMATION, not IMPACT. 09-25-003 (#571) owns the *victim* `spawnDamageAtTile` and explicitly does not change the 6× math. Distinct from 09-23-001 (heal number). Distinct from 009 (boss phase banner).  
SYSTEMS_AFFECTED: WorldExploration betrayal enrage write only  
RECOMMENDED_ACTION: After the 6× write, one short `"ENRAGED!"` float (or one puff) at the betrayer tile. Keep the strip badge. Do not change the 5% / 15% rolls or the 6× formula. Do not add a 1.5s banner. Double-betrayal follow-up damage stays under #571 / 09-25-003.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: #571 / 09-25-003 for the victim number — this ID is the survivor only  
REGRESSION_RISK: LOW — presentation after an already-committed inflate. Non-lethal betrayal (no 6×) stays quiet.  
VALIDATION_REQUIRED: Force a lethal betrayal; victim still waits on #571 for a number; betrayer shows one `"ENRAGED!"` / puff and the existing fire badge; HP is 6×; non-kill betrayal has no enrage float.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 / 09-22 / 09-23 / 09-24 / 09-25 / 09-26 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`. Bounce already juices — #610 / 09-26-004 is preview only.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF. Mirror Field reflect (`WX` 9538–9561) and shield absorb log (`WX` 3433–3438) stay here.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`).  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait. #554 is the walk block. Silent Death Realm portal return stays here.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009.  
- **#478 queue** — GFCF-2026-09-23-001…005 (001 includes enemy/boss **drain** self-heal; 002 is kit `commitHostileSummon` only; 004 is *player* ice RAF).  
- **#523 queue** — GFCF-2026-09-24-001…004 (Void Rift tint, player modifier HP numbers, Swap puff, Mark tint).  
- **#571 queue** — GFCF-2026-09-25-001…005 (Timestep, Mirror activate, Betrayal *victim*, hitsMultiple hover, Occupied summon dest).  
- **#610 queue** — GFCF-2026-09-26-001…004 (sealed portal, ability minion puff, boss teleport puff, bounce hover).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs (`_isFogOfWar` / `_isGravityWell` unused) are PXA/MIMA honesty, not a twin GFCF ID. Blood Moon painting **spikes** while the announce says “crimson tide” is the same honesty class as Void Rift painting lava — leave under PXA; rift *cell* draw is #523 / 09-24-001. **Invincible / shell armor / `damageImmune`:** `useBossSystem` / `useBossAI` write logs and state, but WorldExploration never reads `invincibleTurnsLeft`, `shellArmorActive`, or `damageImmune` on player hits — a canvas banner would lie until that gate exists. Leave under MIMA, not a GFCF twin of 009. **Illusion split / `newVoidTiles`:** `newBossState` merges, `illusionsRef` is only cleared (`WX` 11663), `newVoidTiles` has zero WX readers — MIMA. **Boss kit `updateCombatant` onto the player tile** (`WX` 16005–16008) and **`newPositions` (MAP_ROTATE / MIRROR_INVERT)** with zero WX readers stay MIMA, not a puff ID.

## Explicit non-holes from this search

- Flee: confirm dialogs present.  
- End Turn disabled: `title=` explains summon / wait.  
- Rest / sanctuary portal: toasts present (`WX` 6142 / 6205).  
- Ground Doka: sound + float + log.  
- Map modifiers: log + `MapModifiersPanel` (Time Warp footer timer is enough).  
- Challenge HUD: panel fail/on-track chrome.  
- **Player** summon spawn: puff + SFX + log (kit hostile spawn is 09-23-002; ability minions are #610 / 09-26-002).  
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
- Trap `isTrap` place uses `placeBarrier`; no separate trigger path — same visual as barrier place.  
- Pushback / attract / non-Swap teleport: `applyPushback` / `applyAttract` exist in occupancy tests only — unimplemented mechanic, not mute feel.  
- LoS reject: already floats `"No line of sight"` via `playerFacingRejectReason`.  
- Evasion: `evasion` is never read in WX — MIMA stub.  
- `targetType === "area"` blue ring already expands by `areaRadius` — 09-25-004 is hitsMultiple victims only; #610 / 09-26-004 is bounce only.  
- Bomber / summon `dealDamage`: `WX` 14997–15003 → `enemyTakesDamage` (juice).  
- Sacrifice *enemy* half: `ctx.dealDamage` → `enemyTakesDamage`. Self-HP is #363 / 09-21-004.  
- Hover crit omission stays a matrix note (ANTICIPATION) — do not twin 004.  
- Boss `newHazardTiles`: already written into `currentMap.hazardTiles` (`WX` 16088–16101) so lava/spike overlays exist — placement puff would be spectacle.  
- Recap Doka Fever ×2: map announce + `MapModifiersPanel` already fired; recap total is enough — not filed.  
- Jackpot heal: 3s `jackpotHealVisible` banner already exists (`WX` 17957–17967).  
- Tide Shade slow: log + status pill; canvas duration stays 012.  
- Overworld enemy wander: already tweens `movementPath` — 002 is *battle* dest only.  
- Shield absorb numbers: stay under 011 (log inside `playerTakesDamage`).  
- World-feature urn / chest catalog in `worldFeatures.ts`: no WX claim path besides shrine (#419) + ground Doka.

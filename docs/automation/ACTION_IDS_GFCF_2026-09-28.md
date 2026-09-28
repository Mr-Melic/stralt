# Game Feel ACTION_IDs — 2026-09-28

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-09-28.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-e2719604-245e-424a-8e72-e49140568f3b`

Prior IDs `GFCF-2026-08-31-001` … `015` live in `ACTION_IDS_2026-08-31.md`.  
`GFCF-2026-09-01-001` … `003` live in `ACTION_IDS_2026-09-01.md`.  
`GFCF-2026-09-02-001` … `005` live in `ACTION_IDS_GFCF_2026-09-02.md`.  
`GFCF-2026-09-21-001` … `004` are **queued in #363** (not on `main`).  
`GFCF-2026-09-21-005` and `GFCF-2026-09-22-001` … `009` are **queued in #419** (not on `main`).  
`GFCF-2026-09-23-001` … `005` are **queued in #478** (not on `main`).  
`GFCF-2026-09-24-001` … `004` are **queued in #523** (not on `main`).  
`GFCF-2026-09-25-001` … `005` are **queued in #571** (not on `main`).  
`GFCF-2026-09-26-001` … `004` are **queued in #610** (not on `main`).  
`GFCF-2026-09-27-001` … `004` are **queued in #678** (not on `main`).  
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 / #523 / #571 / #610 / #678 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx` (or the WX `onPlayerReflectedDamage` callback), already owned by older still-open PRs (#327, #363, #419).

---

ACTION_ID: GFCF-2026-09-28-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Void Mirror / Reflect Shield player HP needs the same IMPACT number as playerTakesDamage  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `applyDamageToEnemy` (`castHelpers.ts` 335–376) writes player HP via `setCharacterStats` for `family === "void_mirror"` (25% of `preCritDmgBM`) and boss `reflectShieldActive` (30% of `finalDmg`). Both call `onPlayerReflectedDamage` (`castHelpers.ts` 240–245, 343, 370). The WX callback (`WX` 9496–9501) only `recordChallengeDamageTaken`s — no `playerTakesDamage`, no `spawnDamageAtTile`, no flash/shake. Logs exist (`"Void Mirror reflects N"` / `"Reflect Shield deflects N"`). Distinct from 011 (Mirror *Field* 20% is the inline `mirrorFieldReflect` at `WX` 9538–9561 — different callback, no `onPlayerReflectedDamage`). Distinct from 09-27-001 (player Mirror consume writes *enemy* HP). Distinct from 09-22-001 (melee). Distinct from playerTakesDamage juice (`WX` 3452–3466). Tests already lock the challenge side (`castHelpers.reflect.test.ts` 95–121).  
SYSTEMS_AFFECTED: WorldExploration `onPlayerReflectedDamage` only; existing `spawnDamageAtTile`  
RECOMMENDED_ACTION: After the existing challenge record, `spawnDamageAtTile(..., amount, "damage")` at the player tile (optional `triggerHitFlash("player")` / small shake). Keep the logs. Do **not** route through `playerTakesDamage` (HP is already written; a second pass would double-debit RES / shield / HP). Do not change 25%/30% math. Do not fold Mirror Field into this callback — leave 011.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-08-31-001; Mirror Field stays 011; player Mirror consume stays #678 / 09-27-001  
REGRESSION_RISK: LOW — presentation on already-committed reflect. MEDIUM if routed through `playerTakesDamage` (double HP + double challenge). Lethal reflect must still hit the existing death path.  
VALIDATION_REQUIRED: Hit a Void Mirror; one red number matching the log; Untouchable still fails (existing test); Reflect Shield on a phase-2 boss likewise; Mirror Field 20% still waits on 011; player Mirror consume still waits on #678.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-28-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Shell Armor (already applied on the player-spell path) needs a canvas why  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Broodmother Rook `shellArmorActive` **is** read in `applyDamageToEnemy` (`castHelpers.ts` 347–361): `finalDmg = max(1, floor(finalDmg / 2))` while larvae live, plus the log `"🐛 Shell Armor absorbs half the damage (larvae are alive)!"`. 09-26 / 09-27 classified shell with unread `invincibleTurnsLeft` / `damageImmune` as MIMA. That grouping is too wide: WX itself has zero `shellArmorActive` readers, but the spell path goes through `castHelpers` and **does** halve. A canvas `"Halved"` / `"Shell Armor"` is not a lie on that path. Distinct from 003 (the number). Distinct from 009 (phase banner). Distinct from 011 (player-side source labels). Distinct from invincible / `damageImmune` (still unread in WX — stay MIMA).  
SYSTEMS_AFFECTED: WorldExploration / `applyDamageToEnemy` shell branch only  
RECOMMENDED_ACTION: When the shell log fires, one short `"Shell Armor"` (or `"Halved"`) at the boss tile. Keep the log. Do not add a 1.5s banner. Do not change the half formula or the larvae gate. Do **not** banner invincible / `damageImmune` until those flags actually gate player hits.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-08-31-003 for the (already halved) number; invincible / `damageImmune` stay MIMA  
REGRESSION_RISK: LOW — presentation on an already-committed half. MEDIUM only if a banner fires when `shellArmorActive` is true but larvae are gone (the live gate already requires both).  
VALIDATION_REQUIRED: Hit Broodmother with larvae alive; damage is halved; one float + existing log; larvae dead → full damage, no float; Enthroned Void invincible log still has no GFCF banner.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-28-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Consuming a Mark needs a canvas x2 cue (tile tint is a different ID)  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `computeDamage` doubles when `markedTilesRef` has the dest (`WX` 3331–3335). `calculatePlayerDamage` then **deletes** that key (`WX` 3390–3393) so the next hit is unbuffed. No float, no `"Marked!"`, no crit-style `!` on consume. 09-24-004 (#523) owns drawing the armed tile (ANTICIPATION). This ID is IMPACT/INFORMATION at consume. Distinct from 003 (the number). Distinct from crit (`critical_hit` sound + `kind: "crit"`). Distinct from 09-25-002 (Mirror *activate*). Hover `-dmg` also uses `computeDamage`, so a marked hover already previews the doubled value — consume still has no “why the mark disappeared.”  
SYSTEMS_AFFECTED: WorldExploration `calculatePlayerDamage` mark-delete only  
RECOMMENDED_ACTION: When the delete branch runs (key was present), one short `"Marked!"` (or `"x2"`) at the dest tile. Keep the double. Do not re-add the key. Do not add particles. Do not change Mark place (`spell.isMark` / `placeMark`). Tint stays #523 / 09-24-004.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: #523 / 09-24-004 for the armed-tile draw; 003 for the number  
REGRESSION_RISK: LOW — presentation on an already-committed consume. Hover must not spawn the float (preview only). A second hit on the same tile after consume must not float.  
VALIDATION_REQUIRED: Place Mark; hover shows doubled `-dmg`; first spell on that tile: one `"Marked!"` + doubled damage; mark gone; second spell is unbuffed with no second float; unmarked tiles never float this copy.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-28-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Post-leader erratic needs one canvas cue (not a per-enemy float)  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: When `aiTier >= 5` and the leader just died, WX sets `allEnemiesErraticRef` and logs `"[Leader died] Enemies acting erratically!"` (`WX` 15507–15518). Each subsequent erratic actor also logs (`WX` 15521–15524) then snap-walks. `LEADER DEFEATED!` overlay already runs 1.5s (`WX` 8556–8603). No canvas reason that the *rest of the pack* is now wild. Distinct from 009 (PHASE 2 / Weeping Pawn). Distinct from 09-27-002 (the walk puff). Distinct from 09-25-003 / 09-27-004 (betrayal). Distinct from `_leaderBoostMultiplier` (`WX` 9050) which is written and never read — that unused multiplier is MIMA/dead state, not this ID.  
SYSTEMS_AFFECTED: WorldExploration `allEnemiesErraticRef` edge (first flip only)  
RECOMMENDED_ACTION: One short `"Erratic!"` (or `"Pack panics"`) at the leader’s last tile, only when the ref flips true. Keep the logs. Do **not** float on every erratic actor. Do **not** add a 1.5s banner (would overlap `LEADER DEFEATED!`). Do not change the tier ≥ 5 gate or the snap-walk. Walk puff stays #678 / 09-27-002.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: #678 / 09-27-002 for the dest puff; 009 stays phase chrome  
REGRESSION_RISK: LOW — presentation on an already-committed flag. Non-erratic packs (`aiTier < 5`) stay quiet. A second leader in the same fight must not double-banner if the ref is already true.  
VALIDATION_REQUIRED: Kill a qualifying leader; `LEADER DEFEATED!` still plays; one `"Erratic!"` when the pack flips; later erratic actors do not each float; `aiTier < 5` pack has overlay only; betrayal still waits on #571 / #678.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 / 09-22 / 09-23 / 09-24 / 09-25 / 09-26 / 09-27 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`. Bounce already juices — #610 / 09-26-004 is preview only.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF. Mirror Field reflect (`WX` 9538–9561) and shield absorb log (`WX` 3433–3438) stay here. Void Mirror / Reflect Shield *numbers* are 001 this ledger, not 011.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`).  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait. #554 is the walk block. Silent Death Realm portal return stays here.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009.  
- **#478 queue** — GFCF-2026-09-23-001…005 (001 includes enemy/boss **drain** self-heal; 002 is kit `commitHostileSummon` only; 004 is *player* ice RAF).  
- **#523 queue** — GFCF-2026-09-24-001…004 (Void Rift tint, player modifier HP numbers, Swap puff, Mark *tint*). Mark *consume* is 003 this ledger.  
- **#571 queue** — GFCF-2026-09-25-001…005 (Timestep, Mirror activate, Betrayal *victim*, hitsMultiple hover, Occupied summon dest).  
- **#610 queue** — GFCF-2026-09-26-001…004 (sealed portal, ability minion puff, boss teleport puff, bounce hover).  
- **#678 queue** — GFCF-2026-09-27-001…004 (player Mirror consume, enemy battle-walk puff, enemy hazard landing, betrayal enrage 6×).

TBC remains WAITING (#725). Do not invent feel-telemetry (015 / AQA-012).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs (`_isFogOfWar` / `_isGravityWell` unused) are PXA/MIMA honesty, not a twin GFCF ID. Blood Moon painting **spikes** while the announce says “crimson tide” is the same honesty class as Void Rift painting lava — leave under PXA; rift *cell* draw is #523 / 09-24-001. **Invincible / `damageImmune`:** `useBossSystem` / `useBossAI` write logs and state, but WorldExploration never reads `invincibleTurnsLeft` or `damageImmune` on player hits — a canvas banner would lie until that gate exists. Leave under MIMA. **Shell Armor** on the player-spell path *is* applied (`castHelpers.ts` 347–361) — that is 002 this ledger, not a MIMA twin. **Illusion split / `newVoidTiles`:** `newBossState` merges, `illusionsRef` is only cleared (`WX` 11663), `newVoidTiles` has zero WX readers — MIMA. **Boss kit `updateCombatant` onto the player tile** (`WX` 16005–16008) and **`newPositions` (MAP_ROTATE / MIRROR_INVERT)** with zero WX readers stay MIMA, not a puff ID. **`mirrorRedirect`** (`WX` 9524–9536) checks a tile key; `activatePlayerMirror` only writes `"player"` (`playerMirror.ts`) — the branch never fires. Dead-code, not a feel ID (same class as unused `applyDamageToPlayer`). **`_leaderBoostMultiplier`** is written on leader death (`WX` 9050) and never read — MIMA/dead state, not 004.

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
- Leader death: `"LEADER DEFEATED!"` overlay (`WX` 8556–8603). Erratic *why* is 004 this ledger.  
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
- Jackpot heal: 3s `jackpotHealVisible` banner already exists (`WX` 17957–17967). HUD Doka-to-HP uses toast (`WX` 18436–18454) — not filed.  
- Tide Shade slow / Ember Knight ignite: log + status pill; canvas duration stays 012; melee number stays #419 / 09-22-001.  
- Overworld enemy wander: already tweens `movementPath` — 09-27-002 is *battle* dest only.  
- Shield absorb numbers: stay under 011 (log inside `playerTakesDamage`).  
- World-feature urn / chest catalog in `worldFeatures.ts`: no WX claim path besides shrine (#419) + ground Doka.  
- Passive overworld +1 HP / 10s (`WX` 3617–3627): HUD bar only. Do not float every tick (noise).  
- World-mode wall / void clicks skip the floor branch (`WX` 10575–10578): the wall graphic is enough ANTICIPATION; do not float `"Blocked"` on obvious walls.  
- `ctx.heal` green number already exists for player ids (`WX` 9185–9205). Non-player ids are a no-op (`isPlayerHealTargetId`) — MIMA if a heal-ally spell is supposed to land, not a twin GFCF ID.  
- `comboTextRef` is drawn (`WX` 8610–8629) but never written — dead overlay, not a mute mechanic.

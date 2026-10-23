# Game Feel ACTION_IDs — 2026-10-23

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-10-23.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-20d26ff6-8be4-4778-bf34-2ab6b483e6fb`

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
`GFCF-2026-09-28-001` … `004` are **queued in #735** (not on `main`).  
`GFCF-2026-09-29-001` … `004` are **queued in #772** (not on `main`).  
`GFCF-2026-10-21-001` … `004` are **queued in #845** (not on `main`).  
`GFCF-2026-10-22-001` … `004` are **queued in #894** (not on `main`).  
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx`, already owned by older still-open PRs (#327, #363, #419).

Hover-crit omission stays a matrix note. Cooldown-slot pulse stays unfiled (overlay + reject already exist).

---

ACTION_ID: GFCF-2026-10-23-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Draw live Lord of Static shock tiles (log coords are not a telegraph)  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyShockTiles` (`useBossSystem.ts` 710–735) returns `newShockTiles` + `newBossState.activeShockTiles` and logs `"leaves a shock tile at (${movedFromX},${movedFromY})!"`. `decideLordOfStaticAction` (`useBossAI.ts` 889–902) attaches that result on every legal move. Phase-2 `CHAIN_LIGHTNING` (`useBossAI.ts` 875–886) only fires when `bossState.activeShockTiles.length > 0` and deals 8 HP to adjacent combatants (`useBossSystem.ts` 745–766). WX merges `res.newBossState` (`WX` 16079–16086) and applies `res.damageToPlayer` (`WX` 16025–16039) but has **zero** render readers for `activeShockTiles` / `res.newShockTiles` (frontend grep: types + `useBossAI` + `useBossSystem` only). Boss lava / spikes / void *do* go through `res.newHazardTiles` → `currentMap.hazardTiles` (`WX` 16088–16101) and the existing floor overlay (`WX` 7417+). Canvas has no grid numbers, so the log coordinates are not a telegraph. Distinct from 09-24-001 (Void Rift *modifier* cell, #523). Distinct from 09-22-002 (ability *number* juice, #419). Distinct from 09-26-003 (teleport/jump puff, #610). Unread `damageToTargets` (other units never take chain damage) is MIMA — do not fold it into this ID.  
SYSTEMS_AFFECTED: WorldExploration floor overlay pass; `bossState.activeShockTiles` only  
RECOMMENDED_ACTION: Reuse the existing isometric floor clip (`WX` 7417+) with a brief electric/cyan tint on `activeShockTiles` (one overlay, no extra particles). Keep the log. Optionally drop raw `(x,y)` from the string once the tint exists. Do not add a 1.5s banner. Do not change the 8 HP chain or the 50-tile cap. Do not paint these as lava/spikes — that would keep the lie.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing hazard overlay; 09-22-002 for the chain *number*; #327 owns WX  
REGRESSION_RISK: LOW for a tint on an already-damaging overlay. Do not route shock tiles through `hazardTiles` as `"spikes"` — landing only handles lava/ice/spikes (`WX` 11428–11483) and would either no-op or steal spike math.  
VALIDATION_REQUIRED: Force Lord of Static to move; the previous cell tints; phase-2 chain still hits adjacent player for 8; stepping a shock tile does not newly apply spike/lava landing; lava/spikes on the same map still behave as lava/spikes.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-23-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Telegraph the shrine altar (spawn/center is not a shrine)  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Dungeon-chain maps roll a 25% shrine (`WX` 5020–5030), set `isShrineRoomRef` / `setIsShrineRoom(true)`, and store `shrineAltarPosRef = { x: floor(N/2), y: floor(N/2) }` — the same cell as spawn. `_isShrineRoom` is unused in JSX. Frontend grep of `shrineAltarPosRef`: write, step-claim (`WX` 11286–11354), cleanup null (`WX` 11702) — **no draw**. Nearby dungeon portals already label (`WX` 7916–7941). Rest *entry* already toasts (`WX` 6142 / 6205). Ground Doka is a visible loot sprite. The altar is an unmarked floor tile; the room has no shrine chrome. Claim IMPACT (300 Doka juice) stays #419 / 09-22-003. Distinct from that ID (ANTICIPATION vs IMPACT). Distinct from 09-24-001 (Void Rift). Distinct from 09-26-001 (sealed progression). `covenantBuffMapsRef` is written and unread — PXA/MIMA, not a remaining-maps chip.  
SYSTEMS_AFFECTED: WorldExploration shrine-room floor overlay / optional nearby label only  
RECOMMENDED_ACTION: Tint or glyph the stored altar cell (carved-stone / gold, one overlay). Optional nearby label `"Shrine"` matching the dungeon-portal pattern. Do **not** add a 1.5s banner. Do not change the 300 grant, persist lock, or 25% roll. Do not toast rest-*entry* a second time. Claim juice stays #419.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing floor overlay / dungeon nearby-label helper; 09-22-003 for claim IMPACT; #327 owns WX  
REGRESSION_RISK: LOW — presentation of an already-stored cell. Spawn-on-altar must not auto-claim twice (`tryClaimFlag` already gates). Non-shrine maps must not grow an altar.  
VALIDATION_REQUIRED: Force a shrine room; center cell is marked before the first step; stepping it still claims 300 once; walking a non-altar floor does not claim; a normal dungeon floor has no shrine glyph.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-23-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Draw Alabaster Fortress’s crushing rim before the 5 HP tax  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `applyBoardShrink` (`useBossSystem.ts` 876–899) deals 5 HP when `player.x < 2 || player.x > 13 || player.y < 2 || player.y > 13` (2-tile inset on a 16×16 map). `decideAlabasterFortressAction` (`useBossAI.ts` 1062–1071) only returns the ability when `damageToPlayer > 0`, so the `"you stay in the safe zone"` log never fires as a warning. WX applies the 5 HP (`WX` 16025–16039) with no juice until #419 / 09-22-002. No floor overlay marks the lethal ring. Distinct from 009 (PHASE 2 / Weeping Pawn banner). Distinct from 09-26-001 (sealed *portal*). Distinct from 09-24-001 (one rift cell). Distinct from 001 this ledger (shock *overlay* on Lord of Static). Distinct from 09-22-002 (the *number* when crush already landed).  
SYSTEMS_AFFECTED: WorldExploration floor overlay during Alabaster Fortress phase 2  
RECOMMENDED_ACTION: While that boss is in phase 2, tint the outer 2-tile ring (one dusty/stone overlay, no particles). Keep the log on a successful crush. Do not add a 1.5s banner. Do not change the 5 HP or the inset. Do not tint the ring on other bosses.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing hazard overlay clip; 09-22-002 for crush *number*; 009 for PHASE 2 banner; #327 owns WX  
REGRESSION_RISK: LOW — presentation of an already-computed zone. Inner 12×12 must stay walkable without the 5 HP. Phase 1 must not show the rim.  
VALIDATION_REQUIRED: Alabaster phase 2; rim tints; standing inside 12×12 does not take 5; standing on the rim takes 5 once per ability fire and still waits on #419 for the number; other boss maps have no rim.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-23-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float boss-ability AP grants the same way 09-22-002 already asked for drains  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: 09-22-002 (`#419`) recommended `"-N AP"` when `playerApModifier < 0`. Dawn (`useBossSystem.ts` 1283–1288) returns `playerApModifier: 2` with log `"Dawn briefly blesses you with +2 AP!"`. `decideTwinMonarchsAction` (`useBossAI.ts` 1425–1434) fires that ability every 3rd turn when the log is non-empty. WX (`WX` 16042–16046) applies **any** non-zero modifier to the HUD bar and never floats. Distinct from 09-22-002 (drain polarity). Distinct from 09-02-004 (potion drink, #363). Distinct from 09-25-001 (Timestep, #571). Distinct from #376 / MIMA-2026-09-21-002 (the *other* Dawn roll logs `+1 MP` while writing AP — do not “fix” that lie here). Do **not** treat Dawn’s `damageToPlayer: -10` heal branch as this ID: WX only applies `damageToPlayer > 0`, so that log is a lie (MIMA).  
SYSTEMS_AFFECTED: WorldExploration boss-ability `playerApModifier` apply (`WX` 16042–16046)  
RECOMMENDED_ACTION: When wiring 09-22-002, make the float sign-aware: `"+N AP"` when `playerApModifier > 0`, `"-N AP"` when `< 0`. One short float at the player tile. Do not add a confirm or 1.5s banner. Do not change Dawn’s 3-turn cadence or the +2 value. Union with #419 — do not implement a second float helper.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-09-22-002; #376 owns the MP/AP log lie; #327 owns WX  
REGRESSION_RISK: LOW — presentation on an already-committed HUD write. Drain fights must still show minus, not plus. Zero modifier stays quiet.  
VALIDATION_REQUIRED: Dawn +2 AP branch → one `"+2 AP"` float and HUD +2. AP drain ability → `"-N AP"` (09-22-002). The +1 MP log roll still writes AP until #376; do not add a second MP float that would lie.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 … 10-22 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF). Still zero render call sites (`effects.ts` 331).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote. Distinct from #845 Boss Rush *Complete* and from 003 this ledger (Alabaster *rim*).  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan. Distinct from 09-29-002 (spell-slot AP) and from #894 hover *damage*.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF. Mirror Field reflect (`WX` 9538–9561) stays here.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`). Item-buff chips are 09-29-001. Apply *float* is #845 / 10-21-003. True *expiry* is #845 / 10-21-004.  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait. Toast after teleport (`WX` 13486) is not the wait. #554 is the walk block.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only. Distinct from #894 heal *hover*.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004. Potion *drink* stays 09-02-004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009 (003 is shrine *juice*; 002 is ability *numbers* / AP *drain*). Altar *tile* is 002 this ledger; AP *grant* is 004 this ledger.  
- **#478 queue** — GFCF-2026-09-23-001…005.  
- **#523 queue** — GFCF-2026-09-24-001…004. Void Rift *cell* stays 001 there.  
- **#571 queue** — GFCF-2026-09-25-001…005.  
- **#610 queue** — GFCF-2026-09-26-001…004.  
- **#678 queue** — GFCF-2026-09-27-001…004.  
- **#735 queue** — GFCF-2026-09-28-001…004.  
- **#772 queue** — GFCF-2026-09-29-001…004.  
- **#845 queue** — GFCF-2026-10-21-001…004.  
- **#894 queue** — GFCF-2026-10-22-001…004. Rest-*exit* stays 001 there. Fury/Blood Moon hover stays 002. Heal hover stays 003. Summon End Turn title stays 004.

TBC remains WAITING (#928). Do not invent feel-telemetry (015 / AQA-012).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs stay PXA/MIMA. **Invincible / `damageImmune`:** unread on player hits — stay MIMA. **Shell Armor** on the player-spell path is applied — #735 / 09-28-002. **Vampiric Ground** `onDamageDealt` mutates a throwaway `attacker` object in `enemyTakesDamage` — MIMA, not a heal float. **`mirrorRedirect`** never fires — dead-code, not a feel ID. **`_leaderBoostMultiplier`** unread — MIMA. **`applyRangeModification` / `tickModifiableRangeBonuses`** are `void`ed unused — dead-code, not a mute range chip. **Summon-control walk thorns / Void Rift:** `applyControlledSummonWalk` never calls `applyBattleWalkHazards` — no damage applied (MIMA parity), not a mute float. **#803** persist `complete(9)` is not #845’s banner. **#754** Swap landing tax is not the Swap puff (#523). **#799** bomber/Inferno share is combat truth; detonate already `processCombatantDeath`s. **#850–#927** kit execute-share / remount-wipe / portal snaps are combat/persist/map truth, not on `main`. **#728** End Turn lock is combat; leftover *title* is #894. **`res.newPositions`** (MAP_ROTATE / MIRROR_INVERT) is unread in WX — MIMA, not a mute rotate puff. **`res.damageToTargets`** unread — MIMA (other units skip chain/queen-ray damage). **`boardClaimZone`** stored and never taxed on later turns — MIMA; do not tint a zone that does not persist. **Ink Veil `glyphedTiles`:** designed invisible in `BossGuideModal`; WX never calls `GLYPH_TRAP` on player attack — MIMA, not a missing tint. **Boss `void` hazard type** paints as spikes (`WX` 7442 else-branch) and landing ignores it (`WX` 11428–11483 only lava/ice/spikes) — MIMA (no void tick), not a new overlay ID. **Dawn `damageToPlayer: -10`:** WX requires `> 0` — lying heal log, MIMA, not 004. **`covenantBuffMapsRef`:** written, unread — PXA/MIMA, not a remaining-maps chip. **Resonance counter** only increments inside the ability that requires it already `>= 5` — MIMA deadlock, not a countdown HUD.

## Explicit non-holes from this search

- Flee: confirm dialogs present.  
- Player End Turn: `title=` already says leftover AP/MP are lost (`BattleUIPanel.tsx` 553). Do not add a confirm. Summon End Turn *title* is #894 / 10-22-004.  
- Rest / sanctuary *entry*: toasts present (`WX` 6142 / 6205). Rest-*exit* is #894 / 10-22-001.  
- Ground Doka: sound + float + log.  
- Map modifiers: log + `MapModifiersPanel`. Time Warp footer timer is enough. Blood Moon *number* is #894; do not add a crimson wash for spectacle.  
- Challenge HUD: `shouldShowChallengeHud` keeps the panel after accept (`challengeHudVisibility.ts`). Recap rows stay #845 / 10-21-002.  
- **Player** summon spawn: puff + SFX + log.  
- Dungeon-chain complete: gold trophy log already names the bonus (`WX` 6374–6376). Chain *progress* log already names depth (`WX` 6398–6401). Rest-exit *re-arm* without that line is #894.  
- Nearby dungeon portal label (`WX` 7916–7941). Rest whirlpool color is enough ANTICIPATION; do not add a second rest label for spectacle.  
- Player DoT ticks: already go through `playerTakesDamage`. Enemy DoT ticks already go through `enemyTakesDamage` → `spawnDamageAtTile`.  
- Leader death: `"LEADER DEFEATED!"` overlay. Erratic *why* is #735 / 09-28-004.  
- Spell fizzle: canvas `"✦ FIZZLED! ✦"` + SFX. Do not reuse that string for Null Field (#772).  
- Attack Nearest cooldown: already floats `"On cooldown"`. Spell-slot CD overlay already shows remaining turns — **do not pulse the slot**.  
- Hover crit omission: matrix note only (09-28). Do not twin #894 / 10-22-002 (Fury/Blood Moon are committed flags, not a roll).  
- Barrier fade: tower disappears; leftover `Barrier at ${bKey}` log is ugly but IMPACT exists — still not filed.  
- Barrier place: tower + `Barrier placed at (x,y)` log.  
- Passive overworld +1 HP / 10s: do not float every tick.  
- World-mode wall / void clicks: wall graphic is enough.  
- `comboTextRef` is drawn but never written — dead overlay, not a mute mechanic.  
- `applyDamageToPlayer` unused by `spellEngine` — dead-code.  
- Enemy AI 5s watchdog: not a player “time’s up” (09-23-003).  
- Jackpot heal: 3s banner already exists.  
- Recap Doka Fever ×2: announce + recap total are enough.  
- Game Over 20/40: `GameOverModal.tsx` 56–74 already shows penalty lines on `main`.  
- Death Realm *arrival* toast (`WX` 13486) after the 1.5s wait — the *wait* stays 013.  
- Stun / root / silence / blind / confuse / charm / taunt / fear turn-skip: **no live CC skip path** — unimplemented, not mute feel.  
- Pushback / attract / non-Swap teleport: occupancy resolvers exist; still unimplemented in live cast.  
- Rest heal IMPACT: no rest-heal commit to float.  
- Haste is `buffStat: "mp"` (+2), not extra AP — Timestep stays #571; Haste *apply* float is #845.  
- Trap / glyph trigger: `isTrap` → `placeBarrier`; Ink Veil / `GLYPH_TRAP` stay MIMA.  
- Dispel / cleanse / AP steal: no dispel; boss AP *drain* stays #419; AP *grant* is 004 this ledger.  
- Life steal / drain heal stays 014. hitsAllies number stays 003 (08-31).  
- Wanderer overworld pulse (green ring `WX` 8220) is enough ANTICIPATION for an encounter.  
- Bomber detonate: executor sets `hp=0` and WX `processCombatantDeathCb` (`WX` 15306–15308) already shatters.  
- Overworld Doka-heal: toast already names HP gained and Doka spent. Do not add a canvas number out of battle.  
- Boss kit-spell *damage* already calls `playerTakesDamage` (`WX` 15864–15871) — juice exists. Ability path stays #419.  
- Kit-spell *heal* on the boss stays 09-23-001.  

# Game Feel ACTION_IDs — 2026-10-22

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-10-22.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-31a013fb-3e7b-44c6-9cfc-d7f3191892c6`

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
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx` or `SummonControlPanel.tsx`, already owned by older still-open PRs (#327, #363, #419, #379 / #417 / #592 / #728).

Hover-crit omission stays a matrix note. Cooldown-slot pulse stays unfiled (overlay + reject already exist).

---

ACTION_ID: GFCF-2026-10-22-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Rest-exit needs the same arrival cue rest-entry and dungeon-enter already have  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Rest *entry* toasts (`WX` 6142 `"✨ Sanctuary — your run is complete. Rest, hero."` / `WX` 6205 `"🛡️ Safe Zone — no enemies here. Use a portal to return."`). Dungeon *portal enter* logs `⚔️ Dungeon Chain entered! Prepare for ${newMaxDepth} escalating maps.` (`WX` 6333–6336) and nearby dungeon portals already draw a label (`WX` 7916–7941). Rest-*exit* (`WX` 6220–6280) calls `cleanupMap`, optionally `shouldArmDungeonChainOnRestExit(restExitType)` (`portalRules.ts` 307 — dungeon rest-exit arms depth 1 with a new random max 3–5), then `setTimeout(..., 400)` to `generateRandomMap` + `generateEnemies`. The branch `return`s at `WX` 6280 **before** `playSound("map_transition")` (`WX` 6282). No toast, no log, no dungeon-enter line. Chain *progress* (not rest-exit) already logs `⚔️ Dungeon depth N/M` (`WX` 6398–6401). Distinct from 09-22-005 (Boss Rush *room* advance, #419). Distinct from 10-21-001 (Boss Rush *Complete*, #845). Distinct from 09-26-001 (sealed progression, #610). Distinct from 09-23-005 (portal +10 XP after commit, #478). 09-22 / 10-21 listed rest/sanctuary toasts as a non-hole while citing only 6142 / 6205 (entry).  
SYSTEMS_AFFECTED: WorldExploration rest-exit branch only (`WX` 6220–6280)  
RECOMMENDED_ACTION: After the 400ms generate (or immediately on click, matching entry), one toast or gold log. Overworld rest-exit: reuse Safe Zone’s “return” tone (`"Back in the world"` / map-transition SFX). Dungeon rest-exit that armed a chain: reuse the enter line (`⚔️ Dungeon Chain entered! Prepare for N escalating maps.`) so HUD `Dungeon 1/N` is not the only cue. Play the existing `map_transition` sound — rest-exit currently skips it. Do **not** add a 1.5s banner. Do not change `shouldArmDungeonChainOnRestExit` / spawn depth. Do not toast on rest *entry* a second time.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing rest-entry toasts; dungeon-enter log copy; #327 owns WX  
REGRESSION_RISK: LOW — presentation on an already-committed portal step. Boss rest-exit must not claim a dungeon chain. Death Realm / sanctuary entry stay on their own toasts.  
VALIDATION_REQUIRED: Rest on overworld, step rest-exit → one return cue + map-transition SFX + enemies can spawn. Rest on a dungeon floor, step rest-exit → dungeon-enter line + HUD `Dungeon 1/N` + progression portal present. Rest *entry* still only the Safe Zone / Sanctuary toast. Flee/death still do not arm a chain.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-22-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Enemy hover `-dmg` must include Blood Moon and Fury 1.25× (not crit)  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Hover (`WX` 8176–8216) paints `-${scaledDmg}` from `computeDamage(baseDmg, spell.id, enemy, pos, isPhysical, false, …)` (`WX` 3295–3366). That helper includes SP, `dmg` buffs, Mark ×2, RES/SR — and **not** Blood Moon or Fury. Execute (`spellEngine.ts` 894–899) does `preCritDmg * (isBloodMoon && !heal ? 1.25 : 1) * (isFuryActive && !heal ? 1.25 : 1)` then `calculatePlayerDamage(preCritDmgBM, …)`. `isFuryActive` is `furyRef.current.turnsLeft > 0` (`WX` 9159). `isBloodMoon` is `activeMapModifierTypes.has("blood_moon")` (`WX` 2325). Hover already *does* include Mark (consume stays in `calculatePlayerDamage`). Distinct from hover crit (random — 09-28 matrix note, do not twin). Distinct from 09-29-001 (Fury *remaining-turns* chip). Distinct from 09-29-002 (slot AP digit vs `resolveCastApCost`). Distinct from 09-25-004 / 09-26-004 (hitsMultiple / bounce *rings*).  
SYSTEMS_AFFECTED: WorldExploration enemy-hover `-dmg` only — not `computeDamage` / `calculatePlayerDamage`  
RECOMMENDED_ACTION: On the hover path only, multiply the preview by the same 1.25× flags execute uses (skip heals). Keep `isCrit: false`. Do **not** add Blood Moon/Fury inside `computeDamage` — execute already pre-multiplies `preCritDmgBM`, so a shared helper would double the hit. Optional breakdown suffix (`Fury ×1.25`) is enough; no particles.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: 09-29-001 for the Fury chip; MapModifiersPanel already lists Blood Moon; #327 owns WX  
REGRESSION_RISK: LOW if hover-only. MEDIUM if folded into `computeDamage` (double 1.25× on live hits). Unmodified maps / no Fury must still match catalog. Heals must not gain 1.25×.  
VALIDATION_REQUIRED: No modifier, no Fury → hover equals today’s non-crit number. Blood Moon only → hover ×1.25. Fury only → hover ×1.25. Both → ×1.5625. Heal hover (if 003 wires one) stays unmultiplied. Live hit numbers still wait on 003 (08-31) for primary juice.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-22-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Show a self/ally heal (and buff) hover preview on the body, not only the slot title  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Enemy hover under Attack mode paints `-N` (`WX` 8176–8216). The player sprite pass (`WX` 8356–8398) draws status pills only — no `+HP` / buff name when `selectedSpellId` is a self heal or ally buff. `BattleUIPanel` slot `title` already includes `Heals: ${spell.healAmount ?? 0} HP` (`BattleUIPanel.tsx` 633) — ANTICIPATION on the footer, not on the target. `spellEngine.ts` 654–672 heals the player tile; 680–718 can buff an allied summon on `targetType==='ally'`. Distinct from 014 (`triggerVfx` IMPACT after commit). Distinct from 09-02-004 (potion *drink* IMPACT, #363). Distinct from 10-21-003 (buff *apply* float after merge, #845). Distinct from 002 (enemy `-dmg` Fury/Blood Moon). 08-31 matrix noted “no player-target preview”; it never received an ACTION_ID.  
SYSTEMS_AFFECTED: WorldExploration player / allied-summon hover in Attack mode  
RECOMMENDED_ACTION: When the selected spell is a self/ally heal, paint `+N` (green, existing heal color) on the hovered player or allied summon — same screen-space as enemy `-dmg`. A one-word buff name (`Shield` / `Haste`) is enough for non-heal self-buffs. Do not preview crit heals (keep non-crit, matching 002). Do not add a 1.5s banner or extra particles. Do not change heal math.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing enemy-hover painter; 014 for post-cast VFX; 10-21-003 for apply IMPACT; #327 owns WX  
REGRESSION_RISK: LOW — presentation on hover only. Damage spells must keep red `-N` on enemies and must not paint a heal on the player. Out-of-range self-cast still rejects with existing copy.  
VALIDATION_REQUIRED: Select a self-heal, hover the player → one green `+N` matching the slot title; hover an enemy → no green heal. Select Strike → enemy `-N` unchanged, no player `+HP`. Ally-buff hover on a wolf shows the buff name; empty tile does not.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-22-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Summon-control End Turn should reuse the leftover AP/MP title the player button already has  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Player End Turn `title=` is `"End your turn — leftover AP and MP are lost"` (`BattleUIPanel.tsx` 548–553). 09-22 / 10-21 listed that as a non-hole and forbade a confirm. SummonControlPanel End Turn (`SummonControlPanel.tsx` 352–361 on `main`) is `aria-label="End the summon's turn"` with no leftover copy. AP/MP orbs still show leftover values. #728 (`cursor/stralt-adversarial-qa-3f69`) adds a same-tick lock + `disabled={endTurnCommitted}` — still no leftover title. Distinct from 09-22-008 (ignored Attack / spell-slot click at 0 AP, #419). Distinct from 09-02-002 (summon-control *walk* rejects, #363). Distinct from 09-22-009 (optional “Your turn” banner).  
SYSTEMS_AFFECTED: `SummonControlPanel.tsx` End Turn button only  
RECOMMENDED_ACTION: Set `title` and extend `aria-label` to `"End the summon's turn — leftover AP and MP are lost"` (same sentence as the player button). Do **not** add a confirm dialog. Do not change `advanceTurn` / leftover discard. Union with #728’s lock when wiring — keep `beginSummonControlEndTurn`.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: #728 owns the double-fire lock; #379 / #417 / #592 also touch this file — union, do not overwrite  
REGRESSION_RISK: LOW — `title` / `aria-label` only. Leftover AP/MP must still discard. Double-click must still no-op after #728.  
VALIDATION_REQUIRED: Control a wolf with leftover AP; hover End Turn → leftover copy; click once → turn advances and leftover is gone; player End Turn title unchanged.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 … 10-21 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF). Still zero render call sites (`effects.ts` 331).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote. Distinct from #845 Boss Rush *Complete*.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan. Distinct from 09-29-002 (spell-slot AP) and from 002 this ledger (hover *damage*).  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF. Mirror Field reflect (`WX` 9538–9561) stays here.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`). Item-buff chips are 09-29-001. Apply *float* is #845 / 10-21-003. True *expiry* is #845 / 10-21-004.  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait. Toast after teleport (`WX` 13486) is not the wait. #554 is the walk block.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only. Distinct from 003 this ledger (hover *preview*).  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004. Potion *drink* stays 09-02-004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009 (005 is BR *room-advance*).  
- **#478 queue** — GFCF-2026-09-23-001…005.  
- **#523 queue** — GFCF-2026-09-24-001…004.  
- **#571 queue** — GFCF-2026-09-25-001…005.  
- **#610 queue** — GFCF-2026-09-26-001…004.  
- **#678 queue** — GFCF-2026-09-27-001…004.  
- **#735 queue** — GFCF-2026-09-28-001…004.  
- **#772 queue** — GFCF-2026-09-29-001…004. Fury *chip* stays 09-29-001; hover *damage* 1.25× is 002 this ledger.  
- **#845 queue** — GFCF-2026-10-21-001…004.

TBC remains WAITING (#871). Do not invent feel-telemetry (015 / AQA-012).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs stay PXA/MIMA. **Invincible / `damageImmune`:** unread on player hits — stay MIMA. **Shell Armor** on the player-spell path is applied — #735 / 09-28-002. **Vampiric Ground** `onDamageDealt` mutates a throwaway `attacker` object in `enemyTakesDamage` — MIMA, not a heal float. **`mirrorRedirect`** never fires — dead-code, not a feel ID. **`_leaderBoostMultiplier`** unread — MIMA. **`applyRangeModification` / `tickModifiableRangeBonuses`** are `void`ed unused — dead-code, not a mute range chip. **Summon-control walk thorns / Void Rift:** `applyControlledSummonWalk` never calls `applyBattleWalkHazards` — no damage applied (MIMA parity), not a mute float. **#803** persist `complete(9)` is not #845’s banner. **#754** Swap landing tax is not the Swap puff (#523). **#799** bomber/Inferno share is combat truth; detonate already `processCombatantDeath`s. **#850–#868** kit execute-share is combat truth, not on `main`. **#728** End Turn lock is combat; leftover *title* is 004 this ledger.

## Explicit non-holes from this search

- Flee: confirm dialogs present.  
- Player End Turn: `title=` already says leftover AP/MP are lost (`BattleUIPanel.tsx` 553). Do not add a confirm. Summon End Turn *title* is 004.  
- Rest / sanctuary *entry*: toasts present (`WX` 6142 / 6205). Rest-*exit* is 001.  
- Ground Doka: sound + float + log.  
- Map modifiers: log + `MapModifiersPanel`. Time Warp footer timer is enough.  
- Challenge HUD: `shouldShowChallengeHud` keeps the panel after accept (`challengeHudVisibility.ts`). Recap rows stay #845 / 10-21-002.  
- **Player** summon spawn: puff + SFX + log.  
- Dungeon-chain complete: gold trophy log already names the bonus (`WX` 6374–6376). Chain *progress* log already names depth (`WX` 6398–6401). Rest-exit *re-arm* without that line is 001.  
- Nearby dungeon portal label (`WX` 7916–7941).  
- Player DoT ticks: already go through `playerTakesDamage`. Enemy DoT ticks already go through `enemyTakesDamage` → `spawnDamageAtTile`.  
- Leader death: `"LEADER DEFEATED!"` overlay. Erratic *why* is #735 / 09-28-004.  
- Spell fizzle: canvas `"✦ FIZZLED! ✦"` + SFX. Do not reuse that string for Null Field (#772).  
- Attack Nearest cooldown: already floats `"On cooldown"`. Spell-slot CD overlay already shows remaining turns — **do not pulse the slot**.  
- Hover crit omission: matrix note only (09-28). Do not twin 002 (Fury/Blood Moon are committed flags, not a roll).  
- Barrier fade: tower disappears; leftover `Barrier at ${bKey}` log is ugly but IMPACT exists — still not filed.  
- Barrier place: tower + `Barrier placed at (x,y)` log.  
- Passive overworld +1 HP / 10s: do not float every tick.  
- World-mode wall / void clicks: wall graphic is enough.  
- `comboTextRef` is drawn but never written — dead overlay, not a mute mechanic.  
- `applyDamageToPlayer` unused — dead-code.  
- Enemy AI 5s watchdog: not a player “time’s up” (09-23-003).  
- Jackpot heal: 3s banner already exists.  
- Recap Doka Fever ×2: announce + recap total are enough.  
- Game Over 20/40: `GameOverModal.tsx` 56–74 already shows penalty lines on `main`.  
- Death Realm *arrival* toast (`WX` 13486) after the 1.5s wait — the *wait* stays 013.  
- Stun / root / silence / blind / confuse / charm / taunt / fear turn-skip: **no live CC skip path** — unimplemented, not mute feel.  
- Pushback / attract / non-Swap teleport: occupancy resolvers exist; still unimplemented in live cast.  
- Rest heal IMPACT: no rest-heal commit to float.  
- Haste is `buffStat: "mp"` (+2), not extra AP — Timestep stays #571; Haste *apply* float is #845.  
- Trap / glyph trigger: `isTrap` → `placeBarrier`; no separate WX trigger.  
- Dispel / cleanse / AP steal: no dispel; boss AP drain stays #419.  
- Life steal / drain heal stays 014. hitsAllies number stays 003 (08-31).  
- Wanderer overworld pulse (green ring `WX` 8220) is enough ANTICIPATION for an encounter.  
- Bomber detonate: executor sets `hp=0` and WX `processCombatantDeathCb` (`WX` 15306–15308) already shatters.  

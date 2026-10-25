# Game Feel ACTION_IDs — 2026-10-25

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-10-25.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-fcae6604-011c-4642-b0f4-afc9f255d2b6`

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
`GFCF-2026-10-23-001` … `004` are **queued in #954** (not on `main`).  
`GFCF-2026-10-24-001` … `004` are **queued in #1003** (not on `main`).  
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 / #954 / #1003 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx` or `BuffShop.tsx`, already owned by older still-open PRs (#327, #363, #419, #408, #434).

Hover-crit omission stays a matrix note. Cooldown-slot pulse stays unfiled (overlay + reject already exist). Challenge HUD ongoing chrome stays a non-hole. Rest nearby-label stays unfiled (10-23 / 10-24). White / BR nearby stay #1003. Challenge-fail rising-edge stays #1003.

---

ACTION_ID: GFCF-2026-10-25-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Telegraph Death Realm exits the way dungeon portals already do  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `generateDeathRealmMap` (`WX` 5388–5463) places 2–3 edge portals with `color: "black" | "blue" | "red"` (`WX` 5407–5421) and no `isDungeonEntry` / `isWhitePortal` / `isBossRushPortal`. `drawPortalWhirlpool` maps those colors to generic overworld palettes (`WX` 3901–3903) and the generic spiral (`WX` 4023–4052) — rest rings, boss star-burst, and dungeon diamonds never run. Nearby-label requires `p.color === "dungeon" || dungeonChainActiveRef.current` (`WX` 7916); both are false (`dungeonChainActiveRef` is cleared on death). Arrival toast (`WX` 13486–13496) already says `"💀 You have fallen... find a portal to escape the Death Realm."` for 5s; after it fades the floor is unlabeled travel swirls. Dungeon nearby (`WX` 7915–7941: `"⚔️ Enter Dungeon Chain"`) is the cited non-hole. White *sanctuary* nearby is #1003 / 10-24-001. Boss Rush nearby is #1003 / 10-24-002. 013 is the *invisible 1.5s wait* before teleport, not this overlay. `map_transition` already plays if the player does step (`WX` 6283). Distinct from rest rings (do **not** label rest). Distinct from `boss` star-burst (do not steal it).  
SYSTEMS_AFFECTED: WorldExploration portal overlay pass (`WX` 7915–7941) when `currentMap.isDeathRealm` (or portal colors on a Death Realm map) only  
RECOMMENDED_ACTION: Reuse the dungeon nearby-label helper with `"Escape"` (or `"Leave Death Realm"`) when Chebyshev ≤ 3 on a Death Realm map. Keep the arrival toast. Do **not** add a 1.5s banner. Do not copy rest’s ring pass onto black/blue/red — that would make Death Realm *more* like rest. Do not label overworld black/blue/red travel portals. Do not change `armDeathGuards`, the 1.5s wait (013), or `generateDeathRealmMap` portal count. Optional later: a small `Death Realm` chip matching `Dungeon N/M` (`WX` 17575) — not required for this ID.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing dungeon nearby-label clip; 013 owns the wait; #327 owns WX; #554 owns the walk *block*  
REGRESSION_RISK: LOW — presentation of already-spawned portals. Overworld / rest / dungeon / boss / white / BR labels must not change. Non-Death-Realm black/blue/red swirls must not grow an Escape glyph.  
VALIDATION_REQUIRED: Die; after the 1.5s wait and arrival toast, stand within 3 of a Death Realm swirl → `"Escape"`; stepping it still leaves the realm once; an overworld blue portal has no Escape label; dungeon `"Enter Dungeon Chain"` unchanged; rest whirlpool still unlabeled.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-25-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Log the offered battle challenge next to “Battle started!”  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Battle init always samples `DEFAULT_CHALLENGES` (`WX` 12210–12218) and sets `currentChallenge` / `challengeAcceptedRef = false` / `firstActionTakenRef = false`. The battle log then writes `"Battle started! …"` and whose turn (`WX` 12231–12238`). Boss fights add `☠️ BOSS ENCOUNTER: {name}` (`WX` 12240–12245). The challenge description (`challengeCompletion.ts` 44–88, e.g. `"Win without using healing spells"`) is rendered only on `ChallengePanel` (`ChallengePanel.tsx` 266–274). `visible={inBattle && !!currentChallenge && !firstActionTakenRef.current}` (`WX` 19178) is the *accept window*; `shouldShowChallengeHud` keeps the panel after accept, which 09-22 / 10-21 / 10-24 listed as a non-hole. Recap *rows* stay #845 / 10-21-002. Rising-edge *fail* stays #1003 / 10-24-004. If the 240px panel is folded or the saved layout is off-screen, the offer has no second channel. Distinct from HUD chrome (non-hole). Distinct from recap. Distinct from fail. Distinct from 003 this ledger (expire).  
SYSTEMS_AFFECTED: WorldExploration battle-init log block (`WX` 12231–12238) only  
RECOMMENDED_ACTION: One `logBattleEntry` using the existing description (and optional Doka reward), e.g. `"Battle Challenge: Win without using healing spells (50 Doka)"`. Do **not** add a 1.5s banner. Do not auto-accept. Do not toast every fight (the panel is already the offer UI). Keep `firstActionTaken` / accept window.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: `DEFAULT_CHALLENGES` / `currentChallenge`; 10-21-002 recap; 10-24-004 fail; 003 this ledger for expire; #327 owns WX  
REGRESSION_RISK: LOW — one extra log line on an already-committed offer. Accept / decline / first-action rules must not change. Under-N-turns must still not fail mid-fight.  
VALIDATION_REQUIRED: Start a fight; battle log contains the sampled challenge description once; ChallengePanel still shows Accept/Decline; accepting still keeps the HUD (`shouldShowChallengeHud`); declining still clears; recap still needs #845 to list the row.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-25-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float once when the first AP/MP spend expires an unaccepted challenge offer  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `markFirstAction` (`WX` 17086–17094) is the documented accept-window close: `firstActionTakenRef = true`, and if `!challengeAcceptedRef` it nulls `currentChallenge` / `setCurrentChallenge(null)`. Comment at `WX` 17086–17087: `"If a challenge was offered but not yet accepted, dismiss the offer (accept window has elapsed)."` `shouldShowChallengeHud` then returns false because `hasChallenge` is false (`challengeHudVisibility.ts` 15–22). Decline *button* (`WX` 19186–19190) is an intentional click. This path is a walk or cast with no copy. 10-24-004 floats when `isChallengeFailed` flips *after* accept (`challengeCompletion.ts` 437–463). Distinct from that ID (fail vs never-accepted). Distinct from 002 this ledger (offer ANTICIPATION vs expire INFORMATION). Distinct from 09-23-003 (timer). Distinct from HUD chrome (non-hole while accepted). Under-N-turns correctly stay unfailed mid-fight — do not toast those.  
SYSTEMS_AFFECTED: WorldExploration `markFirstAction` unaccepted branch only  
RECOMMENDED_ACTION: On the accepted=false nulling branch, one short canvas float or log (`"Challenge offer expired"` / `"Challenge declined"`). Do **not** add a 1.5s banner. Do not toast after an accepted contract. Do not toast Decline-button (the click is the why). Do not change `firstActionTaken` or persist. Recap rows stay #845. Fail rising-edge stays #1003.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: `markFirstAction`; 002 this ledger for the offer line; 10-24-004 for post-accept fail; #327 owns WX  
REGRESSION_RISK: LOW if one-shot on the nulling branch. MEDIUM if logged on every later `markFirstAction` (it already no-ops the challenge after the first spend — gate on `currentChallengeRef` still set). HUD must not appear after expire. Overworld Doka-heal must still not set `healUsed`.  
VALIDATION_REQUIRED: Start a fight; walk one tile without Accept → one expire float/log; panel gone; second walk does not toast again. Accept then walk → no expire cue; HUD stays. Decline button → no extra float. Accept easy_1 then drink a potion → still only #1003’s fail cue, not this expire string.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-25-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Shop Buy persist-fail needs the same fail toast as feat claim  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `handleBuy` (`BuffShop.tsx` 209–247) calls `tryPurchaseBuffItem`, writes `inventoryRef` + `liveWalletRef`, then `onDeductDoka` (`WX` 17911–17937`: `canSpendLiveDoka` else persist via `persistAbsoluteProgress`). `ok === false` restores wallet (BuffShop 230–237 and WX 17922–17935) and inventory (BuffShop 238–241) and `return`s with no toast. Unaffordable / Max already `disabled` (`BuffShop.tsx` 509) — 10-24 listed that as a non-hole. Feat claim already `toast.error("Failed to claim reward: …")` (`AchievementsPanel.tsx` 124 / 166 / 181). Spell-*book* upgrade fail is #1003 / 10-24-003 (`console.warn` at `WX` 3216). Potion *drink* IMPACT is #363 / 09-02-004. Do **not** toast every successful Buy — the owned count + wallet HUD are enough IMPACT; this ID is the *silent undo*. Distinct from GameKey redeem toast (`DokaGameKeyShop.tsx` 196). Distinct from in-battle Use `title="Wait for your turn"` (`BuffShop.tsx` 619–624).  
SYSTEMS_AFFECTED: `BuffShop.handleBuy` `ok === false` branch; optional mirror in WX `onDeductDoka`  
RECOMMENDED_ACTION: `toast.error` once with a short why (`"Purchase didn't save"` / existing persist err). Keep the rollback. Do **not** toast success. Do not change `tryPurchaseBuffItem`, max stacks, or Doka debit math. Do not enable unaffordable Buy. Union BuffShop with #408 / #434 — do not overwrite consume / Use-turn gates.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing sonner toast (feat claim); 10-24-003 for spell-upgrade fail; #408 / #434 own BuffShop  
REGRESSION_RISK: LOW — presentation on an already-failing rollback. Success must stay quiet. Double-click during in-flight persist must not toast twice or double-debit. Unaffordable stays disabled.  
VALIDATION_REQUIRED: Afford a potion; force `onDeductDoka` false → one error toast, stack unchanged, wallet restored once. Affordable success → no toast, stack +1, wallet down once. Max / unaffordable still disabled. Feat-claim fail toast unchanged. Spell-upgrade fail still #1003.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 … 10-24 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF). Still zero render call sites (`effects.ts` 331).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference). Distinct from #1003 spell-*book* upgrade.  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote. Distinct from #845 Boss Rush *Complete* and from #1003 BR *nearby*.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan. Distinct from 09-29-002 (spell-slot AP) and from #894 hover *damage*.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF. Mirror Field reflect (`WX` 9538–9561) stays here.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`). Item-buff chips are 09-29-001. Apply *float* is #845 / 10-21-003. True *expiry* is #845 / 10-21-004.  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait. Toast after teleport (`WX` 13486) is not the wait. #554 is the walk block. Nearby *Escape* is 001 this ledger.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only. Distinct from #894 heal *hover*.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004. Potion *drink* stays 09-02-004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009 (003 is shrine *juice*; 002 is ability *numbers* / AP *drain*; 005 is BR *room-advance*). Altar *tile* is #954; AP *grant* is #954; BR *nearby* is #1003.  
- **#478 queue** — GFCF-2026-09-23-001…005.  
- **#523 queue** — GFCF-2026-09-24-001…004. Void Rift *cell* stays 001 there.  
- **#571 queue** — GFCF-2026-09-25-001…005.  
- **#610 queue** — GFCF-2026-09-26-001…004. Sealed *log* stays 001 there.  
- **#678 queue** — GFCF-2026-09-27-001…004.  
- **#735 queue** — GFCF-2026-09-28-001…004.  
- **#772 queue** — GFCF-2026-09-29-001…004.  
- **#845 queue** — GFCF-2026-10-21-001…004. Recap *rows* stay 002 there; fail *rising-edge* is #1003.  
- **#894 queue** — GFCF-2026-10-22-001…004. Rest-*exit* stays 001 there.  
- **#954 queue** — GFCF-2026-10-23-001…004. Shock *cell* / shrine *tile* / rim / Dawn +AP stay there.  
- **#1003 queue** — GFCF-2026-10-24-001…004. White / BR nearby, spell-upgrade toast, challenge-*fail* rising-edge. Offer *log* / *expire* are this ledger.

TBC remains WAITING (#994). Do not invent feel-telemetry (015 / AQA-012).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs stay PXA/MIMA. **Invincible / `damageImmune`:** unread on player hits — stay MIMA. **Shell Armor** on the player-spell path is applied — #735 / 09-28-002. **Vampiric Ground** `onDamageDealt` mutates a throwaway `attacker` object in `enemyTakesDamage` — MIMA, not a heal float. **`mirrorRedirect`** never fires — dead-code, not a feel ID. **`_leaderBoostMultiplier`** unread — MIMA. **`applyRangeModification` / `tickModifiableRangeBonuses`** are `void`ed unused — dead-code, not a mute range chip. **Summon-control walk thorns / Void Rift:** `applyControlledSummonWalk` never calls `applyBattleWalkHazards` — no damage applied (MIMA parity), not a mute float. **#803** persist `complete(9)` is not #845’s banner. **#754** Swap landing tax is not the Swap puff (#523). **#799** bomber/Inferno share is combat truth; detonate already `processCombatantDeath`s. **#850–#1043** kit execute-share / remount-wipe / portal snaps / pack-enemy buffs / leftover-XP wipe are combat/persist/map truth, not on `main`. **#728** End Turn lock is combat; leftover *title* is #894. **`res.newPositions`** (MAP_ROTATE / MIRROR_INVERT / TWIN_FLANK) is unread in WX — MIMA, not a mute rotate / twin puff. **`res.damageToTargets`** unread — MIMA (other units skip chain/queen-ray damage). **`boardClaimZone`** stored and never taxed on later turns — MIMA; do not tint a zone that does not persist. **Ink Veil `glyphedTiles`:** designed invisible in `BossGuideModal`; WX never calls `GLYPH_TRAP` on player attack — MIMA, not a missing tint. **Boss `void` hazard type** paints as spikes (`WX` 7442 else-branch) and landing ignores it (`WX` 11428–11483 only lava/ice/spikes) — MIMA (no void tick), not a new overlay ID. **Dawn `damageToPlayer: -10`:** WX requires `> 0` — lying heal log, MIMA, not #954-004. **`covenantBuffMapsRef`:** written, unread — PXA/MIMA, not a remaining-maps chip. **Resonance counter** only increments inside the ability that requires it already `>= 5` — MIMA deadlock, not a countdown HUD. **Illusions:** `applyIllusionSplit` writes `newBossState.illusions`; `illusionsRef` is only cleared (`WX` 11663) never populated; `isReal` has zero hit-test readers — MIMA (guide lie), not a missing clone tint. **Larvae:** stored in `bossState.larvae` and counted for Shell Armor; `LARVAE_EXPLODE` is never called from WX step; larvae are not combatants — MIMA (cannot kill what is not on the board), not a missing larva sprite. **`reflectShieldTurnsLeft`:** set to 3 and never decremented — MIMA duration lie, not a remaining-turns chip (09-29-001 is the *player* Shield Charm). **`magicReflectActive`:** MERGE_BISHOPS writes it (`useBossSystem.ts` 607); zero WX readers — MIMA (log claims reflect; hits do not), not a mute reflect number (09-28-001 is Void Mirror / Reflect Shield on the *player* path).

## Explicit non-holes from this search

- Flee: confirm dialogs present on dungeon / Boss Rush (`WX` 18918–18935). Overworld flee is intentionally unconfirmed.  
- Player End Turn: `title=` already says leftover AP/MP are lost (`BattleUIPanel.tsx` 553). Do not add a confirm. Summon End Turn *title* is #894 / 10-22-004.  
- Rest / sanctuary *entry*: toasts present (`WX` 6142 / 6205). Rest-*exit* is #894 / 10-22-001. Rest whirlpool rings are enough ANTICIPATION — **do not add a rest nearby label**. White *sanctuary* nearby is #1003. Death Realm *exit* nearby is 001 this ledger.  
- Ground Doka: sound + float + log.  
- Map modifiers: log + `MapModifiersPanel` (name + `description`). Time Warp footer timer is enough (pulses ≤7s / gold ≤15s, `BattleUIPanel.tsx` 387–394). Blood Moon *number* is #894; do not add a crimson wash for spectacle. Unused `announceText` is admin-dropdown copy (`listAdminModifierTypeOptions`), not a mute battle line.  
- Challenge HUD: `shouldShowChallengeHud` keeps the panel after accept (`challengeHudVisibility.ts`). Recap rows stay #845 / 10-21-002. Rising-edge fail cue is #1003 / 10-24-004. Offer *log* is 002 this ledger; unaccepted *expire* is 003. Do not restyle the HUD. Do not toast Accept (the panel restyle is the why).  
- **Player** summon spawn: puff + SFX + log.  
- Dungeon-chain complete: gold trophy log already names the bonus (`WX` 6374–6376). Chain *progress* log already names depth (`WX` 6398–6401). Rest-exit *re-arm* without that line is #894. Nearby dungeon portal label (`WX` 7916–7941) stays a non-hole.  
- Player DoT ticks: already go through `playerTakesDamage`. Enemy DoT ticks already go through `enemyTakesDamage` → `spawnDamageAtTile`.  
- Leader death: `"LEADER DEFEATED!"` overlay. Erratic *why* is #735 / 09-28-004. Unused `leader_boost` SFX is a dead hook (like `comboTextRef`), not a mute mechanic — do not add spectacle on an already-loud shatter.  
- Spell fizzle: canvas `"✦ FIZZLED! ✦"` + SFX. Do not reuse that string for Null Field (#772).  
- Attack Nearest cooldown: already floats `"On cooldown"`. Spell-slot CD overlay already shows remaining turns — **do not pulse the slot**.  
- Hover crit omission: matrix note only (09-28). Do not twin #894 / 10-22-002 (Fury/Blood Moon are committed flags, not a roll).  
- Barrier fade: tower disappears; leftover `Barrier at ${bKey}` log is ugly but IMPACT exists — still not filed.  
- Barrier place: tower + `Barrier placed at (x,y)` log.  
- Passive overworld +1 HP / 10s: do not float every tick.  
- World-mode wall / void clicks: wall graphic is enough. Occupied *player* walk already floats `"Occupied"` (`WX` 10516 / 11101). Summon dest Occupied is #571.  
- `comboTextRef` is drawn but never written — dead overlay, not a mute mechanic.  
- `applyDamageToPlayer` unused by `spellEngine` — dead-code.  
- Enemy AI 5s watchdog: not a player “time’s up” (09-23-003). Footer 30s timer already pulses.  
- Jackpot heal: 3s banner already exists.  
- Recap Doka Fever ×2: announce + recap total are enough.  
- Game Over 20/40: `GameOverModal.tsx` 56–74 already shows penalty lines on `main`.  
- Death Realm *arrival* toast (`WX` 13486) after the 1.5s wait — the *wait* stays 013; nearby *Escape* is 001 this ledger. Do not add a second persistent Death Realm HUD chip this ledger (dungeon / BR chips exist; Escape label is the missing ANTICIPATION).  
- Stun / root / silence / blind / confuse / charm / taunt / fear turn-skip: **no live CC skip path** — unimplemented, not mute feel.  
- Pushback / attract / non-Swap teleport: occupancy resolvers exist; still unimplemented in live cast.  
- Rest heal IMPACT: no rest-heal commit to float.  
- Haste is `buffStat: "mp"` (+2), not extra AP — Timestep stays #571; Haste *apply* float is #845.  
- Trap / glyph trigger: `isTrap` → `placeBarrier`; Ink Veil / `GLYPH_TRAP` stay MIMA.  
- Dispel / cleanse / AP steal: no dispel; boss AP *drain* stays #419; AP *grant* is #954.  
- Life steal / drain heal stays 014. hitsAllies number stays 003 (08-31).  
- Wanderer overworld pulse (green ring `WX` 8220) is enough ANTICIPATION for an encounter.  
- Bomber detonate: executor sets `hp=0` and WX `processCombatantDeathCb` (`WX` 15306–15308) already shatters. Do not preview Inferno radius for spectacle.  
- Overworld Doka-heal: toast already names HP gained and Doka spent. Do not add a canvas number out of battle.  
- Boss kit-spell *damage* already calls `playerTakesDamage` (`WX` 15864–15871) — juice exists. Ability path stays #419.  
- Kit-spell *heal* on the boss stays 09-23-001.  
- BuffShop Use: disabled off-turn with `title="Wait for your turn"` (`BuffShop.tsx` 619–624). Buy disables at unaffordable / Max. Success is stack + wallet HUD — **do not toast every potion**. Persist-*fail* is 004 this ledger.  
- Feat *claim*: toast already exists. Spell-*upgrade* toast is #1003.  
- InitiativeStrip already draws combatant HP bars — do not add per-sprite HP bars for spectacle.  
- `level_up` sound on character recap: 008 remaining is the *banner*, not a missing sound.  
- Regular (non-boss) fight start: `battle_start` SFX (`WX` 12008) is enough — do not add a 1.5s banner (preserve speed).  
- Boss overworld portal: star-burst (`WX` 3961–3994) + 1.5s name banner on step (`WX` 6496–6504) is enough ANTICIPATION. Do not add a nearby Boss label this ledger.  
- Ice floor tiles already tint (`WX` 7440). Frozen *numbers* stay 09-23-004 / 09-27-003.  

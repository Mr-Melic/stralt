# Game Feel ACTION_IDs — 2026-10-24

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-10-24.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-fbafa07d-b2dd-408e-81dc-92467c85ec54`

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
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 / #954 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx` or `handleUpgradeSpell` / `SpellbookModal.tsx`, already owned by older still-open PRs (#327, #363, #419).

Hover-crit omission stays a matrix note. Cooldown-slot pulse stays unfiled (overlay + reject already exist). Challenge HUD ongoing chrome stays a non-hole. Rest nearby-label stays unfiled (10-23).

---

ACTION_ID: GFCF-2026-10-24-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Telegraph the white sanctuary portal the way dungeon portals already do  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Dungeon portals draw a nearby tooltip when Chebyshev ≤ 3 (`WX` 7915–7941: `"⚔️ Enter Dungeon Chain"` / `"⚔️ Continue Chain (N/M)"`). Rest whirlpools have a dedicated silver-ring pass (`WX` 3922–3959); 10-23 explicitly forbade a *second rest label*. White portals (`color: "white"`, `isWhitePortal: true`) are pushed on run/dungeon/Boss Rush complete (`WX` 1329 / 6380–6390 / 12718–12727) and already log `"A white gateway to sanctuary opens…"`. `drawPortalWhirlpool` maps white to `["#f5f5f5", "#ffffff", "#e8e8e8"]` (`WX` 3912) and then falls through the generic spiral (`WX` 4023–4052) — rest’s special case never runs. The nearby-label branch requires `p.color === "dungeon" || dungeonChainActiveRef.current` (`WX` 7916), so white never labels. `placeWhitePortalAtSpawn` colocates with spawn; walking off spawn leaves an unlabeled pale swirl next to rest-like greys. Distinct from 09-26-001 (sealed *progression* log, #610). Distinct from 10-22-001 (rest-*exit* cue, #894). Distinct from 10-21-001 (Boss Rush *Complete*, #845). Distinct from dungeon nearby (the cited non-hole).  
SYSTEMS_AFFECTED: WorldExploration portal overlay pass (`WX` 7915–7941) for `isWhitePortal` / `color === "white"` only  
RECOMMENDED_ACTION: Reuse the dungeon nearby-label helper with `"Sanctuary"` (or `"Rest, hero"`) when Chebyshev ≤ 3. Keep the spawn log. Do **not** add a 1.5s banner. Do not copy rest’s ring pass onto white — that would make sanctuary *more* like rest. Do not label rest portals. Do not change `placeWhitePortalAtSpawn` or the 300-Doka shrine grant.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing dungeon nearby-label clip; #327 owns WX  
REGRESSION_RISK: LOW — presentation of an already-spawned portal. Rest / dungeon / boss / progression labels must not change. Non-white maps must not grow a Sanctuary glyph.  
VALIDATION_REQUIRED: Complete a dungeon chain; white portal at spawn labels when standing within 3; stepping it still opens the rest map once; a rest whirlpool still has no Sanctuary label; dungeon nearby copy unchanged.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-24-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Reuse the dungeon nearby-label pattern on Boss Rush entry and progression portals  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Overworld BR entry is `color: "bossRush"` / `isBossRushPortal: true` (`WX` 4952–4958). In-run exits are `color: PROGRESSION_PORTAL_KIND` (`"progression"`, `WX` 4980–4985). Nearby label requires `p.color === "dungeon" || dungeonChainActiveRef.current` (`WX` 7916) — false for both. `drawPortalWhirlpool` special-cases `boss` (star burst, `WX` 3961–3994) and `dungeon` (diamond spikes) but not `bossRush` (generic magenta spiral, colors at `WX` 3909). HUD `Boss Rush — Room N / 10` (`WX` 17577–17598) exists only after `bossRushState.active`, so overworld entry has no HUD and no label. Dungeon-chain progression *does* inherit the nearby label via `dungeonChainActiveRef`. Distinct from 09-22-005 (room-*advance* banner after the step, #419). Distinct from 10-21-001 (final *Complete*, #845). Distinct from 09-26-001 (sealed lock *log* already fires, #610). Distinct from 001 this ledger (white *sanctuary*).  
SYSTEMS_AFFECTED: WorldExploration portal overlay pass only  
RECOMMENDED_ACTION: Extend the nearby-label branch to `color === "bossRush" || isBossRushPortal` (`"Boss Rush"`) and, while `bossRushActiveRef.current`, to progression portals (`"Room N/10"` matching the HUD). Keep the sealed log. Do **not** add a 1.5s banner on hover. Do not steal the `boss` star-burst for `bossRush` — that would collide with true boss portals. Do not change lock rules or `advanceBossRushRoom`. Room-advance IMPACT stays #419; Complete stays #845.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing dungeon nearby-label helper; 09-22-005 for post-step banner; 10-21-001 for Complete; #327 owns WX  
REGRESSION_RISK: LOW — presentation of already-visible portals. Dungeon nearby copy must stay dungeon-specific. Sealed step must still refuse and log once. Overworld non-BR portals must not grow a Room chip.  
VALIDATION_REQUIRED: Overworld BR swirl, stand within 3 → `"Boss Rush"` label; step still starts room 1; HUD then shows Room 1/10. During a BR room, progression portal labels `"Room N/10"`; sealed step still logs and does not advance. Dungeon `"Enter Dungeon Chain"` unchanged.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-24-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Spellbook upgrade needs the same IMPACT as feat claim (toast + fail copy)  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `handleUpgradeSpell` (`WX` 3140–3216) persists via `upgradeSpell`, writes `spellLevelsRef` / `setSpellLevels`, and debits live Doka on `#ok`. Failure is `console.warn("[PBV] Spell upgrade failed:", err)` (`WX` 3216) with no toast. `SpellbookModal` (`SpellbookModal.tsx` 1154–1189) calls `onUpgradeSpell(spell.id, cost)` fire-and-forget; the expanded row’s Current Lv / next DMG re-render and the wallet HUD ticks. Feat claim already toasts `🏆 Claimed N Doka!` (`AchievementsPanel.tsx` 113). GameKey redeem toasts credited Doka (`DokaGameKeyShop.tsx` 196). Character recap `level_up` sound is 008 (`shouldAnnounceLevelUp` in `rewardFeel.ts`) — not this surface. Shop Buy already disables at unaffordable / Max (`BuffShop.tsx` 509). In-flight second click is swallowed by `spellUpgradeInFlightRef` with no pending chrome. Distinct from 008 (recap character LEVEL UP chrome). Distinct from 09-02-004 (potion *drink* IMPACT, #363). Distinct from 10-22-001 (map *transition*). Do not reuse `level_up` if that would collide with a same-session recap — a short toast is enough.  
SYSTEMS_AFFECTED: WorldExploration `handleUpgradeSpell`; optional `SpellbookModal` pending/disabled while in-flight  
RECOMMENDED_ACTION: On `#ok`, one toast (`"Strike → Lv N"` / `"Upgraded to Lv N"`) matching feat-claim tone. On `#err` / transport fail, `toast.error` with the existing err string instead of `console.warn` only. Optional: disable the Upgrade button while `spellUpgradeInFlightRef` has the id. Do **not** play a 1.5s banner. Do not change `spellLevelingBaseCost * 2^level` or summon 10× UI spend. Do not call `level_up` if a recap is open.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing sonner toast (feat claim); 008 owns recap character chrome; #327 owns WX; union SpellbookModal if an older SDA PR also touches it  
REGRESSION_RISK: LOW — presentation after an already-committed canister write / already-failing catch. Unaffordable stays disabled. Double-click must still no-op. Wallet must not toast a refund.  
VALIDATION_REQUIRED: Afford Strike Lv 0→1 → one success toast, HUD Doka down once, slot shows Lv 1. Force `#err` → error toast, level unchanged. Second click during in-flight → no second debit. Recap LEVEL UP sound still only on character level-up (008).  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-24-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float once when a battle challenge flips from on-track to failed  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `isChallengeFailed` (`challengeCompletion.ts` 437–463) is a committed flip: `healUsed`, `totalDamage` thresholds, `maxApUsedInTurn > 8`, Striker `!directHit`. `ChallengePanel` (`ChallengePanel.tsx` 185–345) already paints ✗ + `challengeFailCopy` after accept — 09-22 / 10-21 listed that *ongoing* HUD as a non-hole. Recap *rows* stay #845 / 10-21-002 (`PostBattleRecap` still ignores `completedChallenges`). Potion / drain / melee that trip the flag only log the *heal* or *hit* (`WX` 3594–3600 for item heal; challenge `recordChallenge*` writers). No toast, no canvas float, no `"Challenge failed"` log. `shouldShowChallengeHud` keeps the 240px panel; if it is folded or off-screen the player keeps spending as if easy_1 / Untouchable still pays. Distinct from HUD chrome (non-hole). Distinct from recap rows (#845). Distinct from 09-23-003 (timer `"Time's up!"`). Distinct from 10-21-004 (status *expiry*). Distinct from 09-02-004 (potion *drink* number). Under-N-turns challenges correctly stay unfailed mid-fight (`isChallengeFailed` returns false) — do not toast those.  
SYSTEMS_AFFECTED: WorldExploration challenge record writers (healUsed / totalDamage / AP-cap / Striker) + one rising-edge helper; ChallengePanel stays the ongoing chrome  
RECOMMENDED_ACTION: On the false→true edge of `isChallengeFailed`, one short canvas float or toast using existing `challengeFailCopy` (already tested). Log once. Do **not** add a 1.5s banner. Do not toast every subsequent heal. Do not change completion predicates or persist. Recap rows stay #845. HUD ✗ stays. Skip under-N-turns (still only judged at victory).  
AUTONOMY: RECOMMEND  
DEPENDENCIES: `challengeFailCopy` / `isChallengeFailed`; 10-21-002 for recap; #327 owns WX  
REGRESSION_RISK: LOW if edge-triggered. MEDIUM if logged every `recordChallengeDamageTaken` tick (spam). HUD must not double-speak every frame. Overworld Doka-heal must still not set `healUsed`.  
VALIDATION_REQUIRED: Accept easy_1; drink a health potion in battle → one `"Failed — a heal was used"` float/toast; HUD ✗ appears; second potion does not toast again; recap still needs #845 to list the row. Accept Untouchable; take 1 HP → one fail cue. Accept easy_2; play past 15 turns mid-fight → no fail toast (victory still judges).  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 … 10-23 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF). Still zero render call sites (`effects.ts` 331).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference). Distinct from 003 this ledger (spell-*book* upgrade).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote. Distinct from #845 Boss Rush *Complete* and from 002 this ledger (BR *nearby*).  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan. Distinct from 09-29-002 (spell-slot AP) and from #894 hover *damage*.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF. Mirror Field reflect (`WX` 9538–9561) stays here.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`). Item-buff chips are 09-29-001. Apply *float* is #845 / 10-21-003. True *expiry* is #845 / 10-21-004.  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait. Toast after teleport (`WX` 13486) is not the wait. #554 is the walk block.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only. Distinct from #894 heal *hover*.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004. Potion *drink* stays 09-02-004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009 (003 is shrine *juice*; 002 is ability *numbers* / AP *drain*; 005 is BR *room-advance*). Altar *tile* is #954; AP *grant* is #954; BR *nearby* is 002 this ledger.  
- **#478 queue** — GFCF-2026-09-23-001…005.  
- **#523 queue** — GFCF-2026-09-24-001…004. Void Rift *cell* stays 001 there.  
- **#571 queue** — GFCF-2026-09-25-001…005.  
- **#610 queue** — GFCF-2026-09-26-001…004. Sealed *log* stays 001 there.  
- **#678 queue** — GFCF-2026-09-27-001…004.  
- **#735 queue** — GFCF-2026-09-28-001…004.  
- **#772 queue** — GFCF-2026-09-29-001…004.  
- **#845 queue** — GFCF-2026-10-21-001…004. Recap *rows* stay 002 there; fail *rising-edge* is 004 this ledger.  
- **#894 queue** — GFCF-2026-10-22-001…004. Rest-*exit* stays 001 there.  
- **#954 queue** — GFCF-2026-10-23-001…004. Shock *cell* / shrine *tile* / rim / Dawn +AP stay there.

TBC remains WAITING (#994). Do not invent feel-telemetry (015 / AQA-012).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs stay PXA/MIMA. **Invincible / `damageImmune`:** unread on player hits — stay MIMA. **Shell Armor** on the player-spell path is applied — #735 / 09-28-002. **Vampiric Ground** `onDamageDealt` mutates a throwaway `attacker` object in `enemyTakesDamage` — MIMA, not a heal float. **`mirrorRedirect`** never fires — dead-code, not a feel ID. **`_leaderBoostMultiplier`** unread — MIMA. **`applyRangeModification` / `tickModifiableRangeBonuses`** are `void`ed unused — dead-code, not a mute range chip. **Summon-control walk thorns / Void Rift:** `applyControlledSummonWalk` never calls `applyBattleWalkHazards` — no damage applied (MIMA parity), not a mute float. **#803** persist `complete(9)` is not #845’s banner. **#754** Swap landing tax is not the Swap puff (#523). **#799** bomber/Inferno share is combat truth; detonate already `processCombatantDeath`s. **#850–#979** kit execute-share / remount-wipe / portal snaps / pack-enemy buffs are combat/persist/map truth, not on `main`. **#728** End Turn lock is combat; leftover *title* is #894. **`res.newPositions`** (MAP_ROTATE / MIRROR_INVERT) is unread in WX — MIMA, not a mute rotate puff. **`res.damageToTargets`** unread — MIMA (other units skip chain/queen-ray damage). **`boardClaimZone`** stored and never taxed on later turns — MIMA; do not tint a zone that does not persist. **Ink Veil `glyphedTiles`:** designed invisible in `BossGuideModal`; WX never calls `GLYPH_TRAP` on player attack — MIMA, not a missing tint. **Boss `void` hazard type** paints as spikes (`WX` 7442 else-branch) and landing ignores it (`WX` 11428–11483 only lava/ice/spikes) — MIMA (no void tick), not a new overlay ID. **Dawn `damageToPlayer: -10`:** WX requires `> 0` — lying heal log, MIMA, not #954-004. **`covenantBuffMapsRef`:** written, unread — PXA/MIMA, not a remaining-maps chip. **Resonance counter** only increments inside the ability that requires it already `>= 5` — MIMA deadlock, not a countdown HUD. **Illusions:** `applyIllusionSplit` writes `newBossState.illusions`; `illusionsRef` is only cleared (`WX` 11663) never populated; `isReal` has zero hit-test readers — MIMA (guide lie), not a missing clone tint. **Larvae:** stored in `bossState.larvae` and counted for Shell Armor; `LARVAE_EXPLODE` is never called from WX step; larvae are not combatants — MIMA (cannot kill what is not on the board), not a missing larva sprite. **`reflectShieldTurnsLeft`:** set to 3 and never decremented — MIMA duration lie, not a remaining-turns chip (09-29-001 is the *player* Shield Charm).

## Explicit non-holes from this search

- Flee: confirm dialogs present on dungeon / Boss Rush (`WX` 18918–18935). Overworld flee is intentionally unconfirmed.  
- Player End Turn: `title=` already says leftover AP/MP are lost (`BattleUIPanel.tsx` 553). Do not add a confirm. Summon End Turn *title* is #894 / 10-22-004.  
- Rest / sanctuary *entry*: toasts present (`WX` 6142 / 6205). Rest-*exit* is #894 / 10-22-001. Rest whirlpool rings are enough ANTICIPATION — **do not add a rest nearby label**. White *sanctuary* nearby is 001 this ledger.  
- Ground Doka: sound + float + log.  
- Map modifiers: log + `MapModifiersPanel`. Time Warp footer timer is enough (pulses ≤7s / gold ≤15s, `BattleUIPanel.tsx` 387–394). Blood Moon *number* is #894; do not add a crimson wash for spectacle.  
- Challenge HUD: `shouldShowChallengeHud` keeps the panel after accept (`challengeHudVisibility.ts`). Recap rows stay #845 / 10-21-002. Rising-edge fail cue is 004 this ledger — do not restyle the HUD.  
- **Player** summon spawn: puff + SFX + log.  
- Dungeon-chain complete: gold trophy log already names the bonus (`WX` 6374–6376). Chain *progress* log already names depth (`WX` 6398–6401). Rest-exit *re-arm* without that line is #894. Nearby dungeon portal label (`WX` 7916–7941) stays a non-hole.  
- Player DoT ticks: already go through `playerTakesDamage`. Enemy DoT ticks already go through `enemyTakesDamage` → `spawnDamageAtTile`.  
- Leader death: `"LEADER DEFEATED!"` overlay. Erratic *why* is #735 / 09-28-004.  
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
- Death Realm *arrival* toast (`WX` 13486) after the 1.5s wait — the *wait* stays 013.  
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
- BuffShop Use: disabled off-turn with `title="Wait for your turn"` (`BuffShop.tsx` 619–624). Buy disables at unaffordable / Max.  
- Feat *claim*: toast already exists. Spell-*upgrade* toast is 003 this ledger.  
- InitiativeStrip already draws combatant HP bars — do not add per-sprite HP bars for spectacle.  
- `level_up` sound on character recap: 008 remaining is the *banner*, not a missing sound.  

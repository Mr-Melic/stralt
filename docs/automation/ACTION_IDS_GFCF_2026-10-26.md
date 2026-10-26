# Game Feel ACTION_IDs — 2026-10-26

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-10-26.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-99c67606-c5e8-4d6b-922e-53912da39d40`

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
`GFCF-2026-10-25-001` … `004` are **queued in #1061** (not on `main`).  
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 / #954 / #1003 / #1061 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx`, already owned by older still-open PRs (#327, #363, #419).

Hover-crit omission stays a matrix note. Cooldown-slot pulse stays unfiled (overlay + reject already exist). Challenge HUD ongoing chrome stays a non-hole. Rest nearby-label stays unfiled. White / BR nearby stay #1003. Death Realm *Escape* nearby stays #1061. Challenge-fail rising-edge stays #1003. Shop Buy persist-fail stays #1061. Overworld Doka-heal *success* toast stays a non-hole.

---

ACTION_ID: GFCF-2026-10-26-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: In-battle lava/spike death must show the same 20/40 Game Over as melee/flee  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `_handlePlayerDeath` (flee / enemy-spell / melee / DoT) sets `showGameOver` (`WX` 13310). `GameOverModal` then renders `−{xpLost} XP (20% penalty)` / `−{dokaLost} Doka (40% penalty)` (`GameOverModal.tsx` 56–74) — 10-24 / 10-25 listed that modal as the cited non-hole. Lava/spikes write HP inside the movement RAF (`WX` 11428–11483) and never call `_handlePlayerDeath` (011 owns the missing *number*). The in-battle HP-watch (`WX` 13386–13440) comments “updates local state + the Game Over recap” then calls `persistDeathPenalty` + `cleanupMap` + a 1.5s Death Realm timer — it never `setShowGameOver(true)` and never `onShowBattleSummary`. Out-of-battle lava *does* attach a defeat recap (`WX` 13339–13358). Player death is a listed critical moment; melee and lava currently disagree on whether 20/40 is visible. Distinct from 013 (the *invisible wait* on this same timer). Distinct from #1061 / 10-25-001 (Death Realm *Escape* nearby). Distinct from the arrival toast (`WX` 13486, non-hole). Distinct from Game Over 20/40 on the *modal* path (non-hole).  
SYSTEMS_AFFECTED: WorldExploration in-battle HP-watch lethal branch (`WX` 13386–13440) only  
RECOMMENDED_ACTION: On this branch, either `setShowGameOver(true)` with the existing `deathPenalty` snapshot (same modal melee already uses) or `onShowBattleSummary` with the same defeat recap the out-of-battle branch already builds. Do **not** add a 1.5s banner. Do not change 20/40 math, `persistDeathPenalty`, or `armDeathGuards`. Keep the 1.5s timer (013 owns wait chrome). Do not route lava HP through `playerTakesDamage` here (011 / RAF freeze).  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing `GameOverModal` / defeat recap; 013 owns the wait; #554 owns the walk *block*; #327 owns WX  
REGRESSION_RISK: LOW if one modal/recap on an already-committed penalty. MEDIUM if both modal and recap fire (double 20/40). Melee/flee Game Over must not double. Out-of-battle lava recap must not grow a second overlay.  
VALIDATION_REQUIRED: Die to adjacent melee → Game Over 20/40 unchanged. Die to in-battle lava/spikes → same 20/40 lines once; 1.5s wait still elapses; arrival toast still fires; Death Realm still generates once. Flee confirm still opens the modal path. Out-of-battle lava still uses the defeat recap, not a second Game Over.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-26-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Overworld Doka-heal persist-fail needs an error toast after the success toast  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: The heal button (`WX` 18401–18484) applies HP/Doka locally, then `toast.success(\`Healed +${resolved.hpGained} HP (-${resolved.dokaCost} Doka)\`)` or the 3s jackpot banner (`WX` 18436–18454) — 10-25 listed that *success* copy as a non-hole. `persistAbsoluteProgress` runs after the toast (`WX` 18456–18462). `ok === false` + `shouldRollbackFailedHeal` restores `hpBefore` / `dokaBefore` (`WX` 18463–18484) with no `toast.error`, no log. Shop Buy persist-fail is #1061 / 10-25-004 (that path never toasted success). Spell-upgrade fail is #1003 (`console.warn` at `WX` 3216, never toasted success). Feat claim already `toast.error("Failed to claim reward: …")` (`AchievementsPanel.tsx` 124). Distinct from potion *drink* IMPACT (#363 / 09-02-004). Distinct from jackpot *banner* (non-hole for success). Distinct from 003 this ledger (victory recap). Do **not** toast every successful heal — success already speaks.  
SYSTEMS_AFFECTED: WorldExploration Doka-heal `persist.then` `ok === false` branch (`WX` 18463–18484)  
RECOMMENDED_ACTION: `toast.error` once with a short why (`"Heal didn't save"` / existing persist err) on the rollback branch. Keep `shouldRollbackFailedHeal` (do not revert a later heal). Do **not** toast success again. Do not change 1:3 math, jackpot 0.5%, or `persistAbsoluteProgress`. Recap overlay `pointerEvents: none` must still allow this button.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing sonner toast; `shouldRollbackFailedHeal`; 10-25-004 shop fail; #327 owns WX  
REGRESSION_RISK: LOW — presentation on an already-failing rollback. Success must stay a single toast. Double-click during in-flight persist must not toast twice or double-debit. Unaffordable stays disabled. Jackpot banner must not pair with a false error.  
VALIDATION_REQUIRED: Afford a heal; force persist false → one error toast, HP and Doka restored once, success toast may have fired (acceptable) but the error must follow. Affordable success → success toast only, HP up, wallet down once. Jackpot success → banner, no error. Feat-claim fail toast unchanged. Shop fail still #1061.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-26-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Victory persist-fail needs a player-facing cue after recap already showed the grant  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `onShowBattleSummary(recapWithUnlocks)` runs *before* the persist try (`WX` 12517–12525) so the overlay already shows `+XP` / Doka / leftover bar. Catch is `logDebugInfo("BATTLE", "Reward persistence failed (non-blocking)", …)` (`WX` 12611–12616). `PostBattleRecap.tsx` has no persist / pending / failed field (zero matches). Boss Rush room-clear uses the same pattern: recap first, `logDebugError("BossRush reward persist failed")` (`WX` 12863–12868) — fold into this ID, do not twin. 09-22-006 / #419 is the *portal block while persist is in flight* (`"Rewards settling…"`), not a failed write. Shop fail is #1061 (no recap). Heal fail is 002 this ledger (success toast). Portal +10 XP *success* float after commit is #478 / 09-23-005. Distinct from leftover-XP HUD (#108/#138 merged). Distinct from recap LEVEL UP chrome (008 remaining).  
SYSTEMS_AFFECTED: WorldExploration `handleBattleEnd` persist `catch` (`WX` 12611–12616) and `handleBossRushRoomClear` persist `catch` (`WX` 12863–12868); optional one-line on `PostBattleRecap`  
RECOMMENDED_ACTION: `toast.error` once (`"Rewards didn't save — retry from recap"` / existing err). Optional recap footnote. Do **not** hide the recap (comment at `WX` 12522 is correct). Do not change `applyRewards` math, persist lock, or `clampApplyRewardsDeltas`. Do not add a 1.5s banner. Portal-block copy stays #419.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing sonner toast; 09-22-006 portal block; #327 owns WX; union Recap if #845-002 is wired later  
REGRESSION_RISK: LOW — presentation on an already-non-blocking catch. Recap must still open on persist fail. Success must stay quiet. Death during persist must still skip live hydrate (`shouldApplyVictoryLiveHydrate`).  
VALIDATION_REQUIRED: Win a fight; recap opens; force persist throw → one error toast, recap still visible, wallet/XP not double-credited. Normal win → recap, no error toast, lock commits. Step a portal during in-flight persist → still #419’s settling float, not this error. Boss Rush room-clear persist throw → one error, not two stacked copies.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-26-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Give Death Realm the same persistent HUD chip Dungeon and Boss Rush already have  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Dungeon chain paints `⚔️ Dungeon {depth}/{max}` (`WX` 17562–17576). Boss Rush paints `Boss Rush — Room N / 10` (`WX` 17577–17598). `currentMap.isDeathRealm` is never read in that HUD block (all `isDeathRealm` hits are map gen / portal / spawn, none between 17560–17600). Arrival toast (`WX` 13486–13496) says `"find a portal to escape the Death Realm"` for 5s then fades. 10-25-001 filed nearby *Escape* and explicitly deferred “a small `Death Realm` chip matching `Dungeon N/M` (`WX` 17575) — not required for this ID.” Wait chrome stays 013. Nearby Escape stays #1061. Distinct from dungeon / BR chips (the cited non-holes). Distinct from rest (do **not** add a rest chip). Distinct from overworld black/blue/red (do not label those).  
SYSTEMS_AFFECTED: WorldExploration HUD chip row (`WX` 17561–17598) when `currentMap.isDeathRealm` (or `currentMapRef.current?.isDeathRealm`) only  
RECOMMENDED_ACTION: One small chip (`"Death Realm"` / `"Escape the Death Realm"`) matching `Dungeon N/M` weight. Keep the arrival toast. Do **not** add a 1.5s banner. Do not pulse every frame. Do not copy rest rings. Do not change `generateDeathRealmMap` portal count or `armDeathGuards`. Nearby Escape stays #1061.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing dungeon / BR chips; 013 owns the wait; 10-25-001 owns Escape nearby; #327 owns WX; #554 owns the walk *block*  
REGRESSION_RISK: LOW — presentation while `isDeathRealm` is true. Dungeon / BR chips must not change. Overworld / rest / sanctuary must not grow a Death Realm chip. Chip must clear on Escape.  
VALIDATION_REQUIRED: Die; after the 1.5s wait and arrival toast, HUD shows a Death Realm chip; dungeon `Dungeon N/M` unchanged on a chain map; BR `Room N/10` unchanged during a run; rest / overworld have no chip; stepping a Death Realm portal clears it.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 … 10-25 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF). Still zero render call sites (`effects.ts` 331).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference). Distinct from #1003 spell-*book* upgrade.  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote. Distinct from #845 Boss Rush *Complete* and from #1003 BR *nearby*.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan. Distinct from 09-29-002 (spell-slot AP) and from #894 hover *damage*.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF. Mirror Field reflect (`WX` 9538–9561) stays here. Lethal lava skipping Game Over is 001 this ledger.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`). Item-buff chips are 09-29-001. Apply *float* is #845 / 10-21-003. True *expiry* is #845 / 10-21-004.  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait. Toast after teleport (`WX` 13486) is not the wait. #554 is the walk block. Nearby *Escape* is #1061. HUD *chip* is 004 this ledger.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only. Distinct from #894 heal *hover*. Distinct from 002 this ledger (overworld Doka-heal persist-fail).  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004. Potion *drink* stays 09-02-004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009 (003 is shrine *juice*; 002 is ability *numbers* / AP *drain*; 005 is BR *room-advance*; 006 is victory-persist *portal block*). Altar *tile* is #954; AP *grant* is #954; BR *nearby* is #1003. Persist *fail* after recap is 003 this ledger.  
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
- **#1003 queue** — GFCF-2026-10-24-001…004. White / BR nearby, spell-upgrade toast, challenge-*fail* rising-edge.  
- **#1061 queue** — GFCF-2026-10-25-001…004. Death Realm *Escape* nearby, challenge offer/expire, shop Buy persist-fail. HUD *chip* is 004 this ledger. Heal persist-fail after success toast is 002 this ledger.

TBC remains WAITING (#1108). Do not invent feel-telemetry (015 / AQA-012).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs stay PXA/MIMA. **Invincible / `damageImmune`:** unread on player hits — stay MIMA. **Shell Armor** on the player-spell path is applied — #735 / 09-28-002. **Vampiric Ground** `onDamageDealt` mutates a throwaway `attacker` object in `enemyTakesDamage` — MIMA, not a heal float. **`mirrorRedirect`** never fires — dead-code, not a feel ID. **`_leaderBoostMultiplier`** unread — MIMA. **`applyRangeModification` / `tickModifiableRangeBonuses`** are `void`ed unused — dead-code, not a mute range chip. **Summon-control walk thorns / Void Rift:** `applyControlledSummonWalk` never calls `applyBattleWalkHazards` — no damage applied (MIMA parity), not a mute float. **#803** persist `complete(9)` is not #845’s banner. **#754** Swap landing tax is not the Swap puff (#523). **#799** bomber/Inferno share is combat truth; detonate already `processCombatantDeath`s. **#850–#1107** kit execute-share / remount-wipe / portal snaps / pack-enemy buffs / leftover-XP wipe are combat/persist/map truth, not on `main`. **#728** End Turn lock is combat; leftover *title* is #894. **`res.newPositions`** (MAP_ROTATE / MIRROR_INVERT / TWIN_FLANK) is unread in WX — MIMA, not a mute rotate / twin puff. **`res.damageToTargets`** unread — MIMA (other units skip chain/queen-ray damage). **`boardClaimZone`** stored and never taxed on later turns — MIMA; do not tint a zone that does not persist. **Ink Veil `glyphedTiles`:** designed invisible in `BossGuideModal`; WX never calls `GLYPH_TRAP` on player attack — MIMA, not a missing tint. **Boss `void` hazard type** paints as spikes (`WX` 7442 else-branch) and landing ignores it (`WX` 11428–11483 only lava/ice/spikes) — MIMA (no void tick), not a new overlay ID. **Dawn `damageToPlayer: -10`:** WX requires `> 0` — lying heal log, MIMA, not #954-004. **`covenantBuffMapsRef`:** written, unread — PXA/MIMA, not a remaining-maps chip. **Resonance counter** only increments inside the ability that requires it already `>= 5` — MIMA deadlock, not a countdown HUD. **Illusions:** `applyIllusionSplit` writes `newBossState.illusions`; `illusionsRef` is only cleared (`WX` 11663) never populated; `isReal` has zero hit-test readers — MIMA (guide lie), not a missing clone tint. **Larvae:** stored in `bossState.larvae` and counted for Shell Armor; `LARVAE_EXPLODE` is never called from WX step; larvae are not combatants — MIMA (cannot kill what is not on the board), not a missing larva sprite. **`reflectShieldTurnsLeft`:** set to 3 and never decremented — MIMA duration lie, not a remaining-turns chip (09-29-001 is the *player* Shield Charm). **`magicReflectActive`:** MERGE_BISHOPS writes it (`useBossSystem.ts` 607); zero WX readers — MIMA (log claims reflect; hits do not), not a mute reflect number (09-28-001 is Void Mirror / Reflect Shield on the *player* path). **Swift Winds / Mending Mist on the player:** `playerTurnStartModifierTarget` returns undefined unless `id === "player"` is in `combatantsRef` (`battleSetup.ts` 364–368); player is not in that list — MIMA (hooks do not land), not a mute +MP float. **Glass Realm 2×:** `applyDamageToEnemy` never calls `applyDamageDealt` — unread on the primary spell path, MIMA, not a hover-lie ID (#894 is Fury/Blood Moon on the path that *does* multiply).

## Explicit non-holes from this search

- Flee: confirm dialogs present on dungeon / Boss Rush (`WX` 18918–18935). Overworld flee is intentionally unconfirmed.  
- Player End Turn: `title=` already says leftover AP/MP are lost (`BattleUIPanel.tsx` 553). Do not add a confirm. Summon End Turn *title* is #894 / 10-22-004. Controlled-summon 0/0 auto-end (`WX` 14745–14763) dismisses the dock and the next combatant logs `"Your turn"` / `"{name}'s turn"` — re-entrancy delay, not a mute skip.  
- Rest / sanctuary *entry*: toasts present (`WX` 6142 / 6205). Rest-*exit* is #894 / 10-22-001. Rest whirlpool rings are enough ANTICIPATION — **do not add a rest nearby label**. White *sanctuary* nearby is #1003. Death Realm *exit* nearby is #1061. Death Realm *HUD chip* is 004 this ledger.  
- Ground Doka: sound + float + log. Wallet credits on persist commit; `#err` releases the claim so the coin can retry — not a lying success toast.  
- Map modifiers: log + `MapModifiersPanel` (name + `description`). Time Warp footer timer is enough (pulses ≤7s / gold ≤15s, `BattleUIPanel.tsx` 387–394). Blood Moon *number* is #894; do not add a crimson wash for spectacle. Unused `announceText` is admin-dropdown copy (`listAdminModifierTypeOptions`), not a mute battle line.  
- Challenge HUD: `shouldShowChallengeHud` keeps the panel after accept (`challengeHudVisibility.ts`). Recap rows stay #845 / 10-21-002. Rising-edge fail cue is #1003 / 10-24-004. Offer *log* is #1061 / 10-25-002; unaccepted *expire* is #1061 / 10-25-003. Do not restyle the HUD. Do not toast Accept (the panel restyle is the why).  
- **Player** summon spawn: puff + SFX + log. Fade canvas stays #419 / 09-22-007.  
- Dungeon-chain complete: gold trophy log already names the bonus (`WX` 6374–6376). Chain *progress* log already names depth (`WX` 6398–6401). Rest-exit *re-arm* without that line is #894. Nearby dungeon portal label (`WX` 7916–7941) stays a non-hole.  
- Player DoT ticks: already go through `playerTakesDamage`. Enemy DoT ticks already go through `enemyTakesDamage` → `spawnDamageAtTile`.  
- Leader death: `"LEADER DEFEATED!"` overlay. Erratic *why* is #735 / 09-28-004. Unused `leader_boost` SFX is a dead hook (like `comboTextRef`), not a mute mechanic — do not add spectacle on an already-loud shatter.  
- Spell fizzle: canvas `"✦ FIZZLED! ✦"` + SFX. Do not reuse that string for Null Field (#772).  
- Attack Nearest cooldown: already floats `"On cooldown"`. Spell-slot CD overlay already shows remaining turns — **do not pulse the slot**. Attack button at 0 AP already `title=`s `"No Action Points left this turn"` and drops opacity; 09-22-008 owns the ignored-click float.  
- Hover crit omission: matrix note only (09-28). Do not twin #894 / 10-22-002 (Fury/Blood Moon are committed flags, not a roll).  
- Barrier fade: tower disappears; leftover `Barrier at ${bKey}` log is ugly but IMPACT exists — still not filed.  
- Barrier place: tower + `Barrier placed at (x,y)` log.  
- Passive overworld +1 HP / 10s: do not float every tick.  
- World-mode wall / void clicks: wall graphic is enough. Occupied *player* walk already floats `"Occupied"` (`WX` 10516 / 11101). Summon dest Occupied is #571.  
- `comboTextRef` is drawn but never written — dead overlay, not a mute mechanic.  
- `applyDamageToPlayer` unused by `spellEngine` — dead-code.  
- Enemy AI 5s watchdog: not a player “time’s up” (09-23-003). Footer 30s timer already pulses.  
- Jackpot heal: 3s banner already exists. Persist-*fail* of that same button is 002 this ledger.  
- Recap Doka Fever ×2: announce + recap total are enough.  
- Game Over 20/40: `GameOverModal.tsx` 56–74 already shows penalty lines on the *modal* path. In-battle lava skip is 001 this ledger.  
- Death Realm *arrival* toast (`WX` 13486) after the 1.5s wait — the *wait* stays 013; nearby *Escape* is #1061; HUD *chip* is 004 this ledger.  
- Stun / root / silence / blind / confuse / charm / taunt / fear turn-skip: **no live CC skip path** — unimplemented, not mute feel.  
- Pushback / attract / non-Swap teleport: occupancy resolvers exist; still unimplemented in live cast.  
- Rest heal IMPACT: no rest-heal commit to float.  
- Haste is `buffStat: "mp"` (+2), not extra AP — Timestep stays #571; Haste *apply* float is #845.  
- Trap / glyph trigger: `isTrap` → `placeBarrier`; Ink Veil / `GLYPH_TRAP` stay MIMA.  
- Dispel / cleanse / AP steal: no dispel; boss AP *drain* stays #419; AP *grant* is #954.  
- Life steal / drain heal stays 014. hitsAllies number stays 003 (08-31).  
- Wanderer overworld pulse (green ring `WX` 8220) is enough ANTICIPATION for an encounter.  
- Bomber detonate: executor sets `hp=0` and WX `processCombatantDeathCb` (`WX` 15306–15308) already shatters. Do not preview Inferno radius for spectacle.  
- Overworld Doka-heal *success*: toast already names HP gained and Doka spent. Do not add a canvas number out of battle. Persist-*fail* is 002 this ledger.  
- Boss kit-spell *damage* already calls `playerTakesDamage` (`WX` 15864–15871) — juice exists. Ability path stays #419.  
- Kit-spell *heal* on the boss stays 09-23-001.  
- BuffShop Use: disabled off-turn with `title="Wait for your turn"` (`BuffShop.tsx` 619–624). Buy disables at unaffordable / Max. Success is stack + wallet HUD — **do not toast every potion**. Persist-*fail* is #1061 / 10-25-004.  
- Feat *claim*: toast already exists. Spell-*upgrade* toast is #1003.  
- InitiativeStrip already draws combatant HP bars — do not add per-sprite HP bars for spectacle.  
- `level_up` sound on character recap: 008 remaining is the *banner*, not a missing sound.  
- Regular (non-boss) fight start: `battle_start` SFX (`WX` 12008) is enough — do not add a 1.5s banner (preserve speed).  
- Boss overworld portal: star-burst (`WX` 3961–3994) + 1.5s name banner on step (`WX` 6496–6504) is enough ANTICIPATION. Do not add a nearby Boss label this ledger.  
- Ice floor tiles already tint (`WX` 7440). Frozen *numbers* stay 09-23-004 / 09-27-003. Do not add a Slime Flood wash for spectacle (global MP 2× already has the MapModifiersPanel chip).  
- Chat send `catch { /* ignore */ }` (`ChatPanel.tsx` 1009–1010) is general UX, not combat feedback — leave to the UX audit.  
- Fury wore-off already logs (`WX` 14293). Shield remaining logs on melee absorb (`WX` 16759).  

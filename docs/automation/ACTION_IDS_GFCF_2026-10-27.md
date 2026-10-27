# Game Feel ACTION_IDs — 2026-10-27

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-10-27.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-c69b9c94-e001-4d7e-a47f-20ef53b1a4c5`

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
`GFCF-2026-10-26-001` … `004` are **queued in #1133** (not on `main`).  
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 / #954 / #1003 / #1061 / #1133 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx` (death-save catch, portal XP hydrate / persist catch, Game Over run-ended copy). Oldest WX owner is **#327**; **#363** / **#419** already queue feel floats. `#421` owns Game Over 20/40 copy. `#803` owns `useBossRush.ts` abort persist order — do not toast-wire abort here.

Hover-crit omission stays a matrix note. Cooldown-slot pulse stays unfiled. Challenge HUD ongoing chrome stays a non-hole. Rest nearby-label stays unfiled. White / BR nearby stay #1003. Death Realm *Escape* nearby stays #1061. Death Realm *HUD chip* stays #1133. Ground Doka float-before-commit stays a listed 10-26 non-hole. Overworld Doka-heal *success* toast stays a non-hole; persist-*fail* after that toast stays #1133.

---

ACTION_ID: GFCF-2026-10-27-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Death-penalty persist-fail needs a player cue after Game Over already showed 20/40  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `persistDeathPenalty` applies the cut locally (`setDeathPenalty` / HUD XP+Doka at `WX` 13095–13102) and `_handlePlayerDeath` opens `GameOverModal` with `−XP (20%)` / `−Doka (40%)` (`GameOverModal.tsx` 56–74) — 10-24 / 10-26 listed that modal as the cited non-hole. The canister write is async: `persistWithRetry` catch rethrows after cutting the lock (`WX` 13040–13049) and the enqueue `.catch` is `console.error("[death-save] failed:", err)` only (`WX` 13093). Reload replay (`WX` 13187–13252) can recut a still-uncut canister; success is silent and fail is `console.error("[death-save] replay failed:", err)` (`WX` 13251). Heal persist-fail after a *success toast* is #1133 / 10-26-002. Victory persist-fail after recap *showed the grant* is #1133 / 10-26-003. Lava skipping the modal is #1133 / 10-26-001. Distinct from 013 (the *wait*). Distinct from Game Over 20/40 on the *modal* path (non-hole for showing the amounts). Distinct from unpaid-death *math* (#667 / `applyUnpaidDeathPenaltyToWrite`).  
SYSTEMS_AFFECTED: WorldExploration `persistDeathPenalty` enqueue `.catch` (`WX` 13093) and pending-death replay `.catch` (`WX` 13251); optional one-line on `GameOverModal`  
RECOMMENDED_ACTION: `toast.error` once on the death-save catch and on replay fail (`"Death penalty didn't save — will retry"` / existing err). Keep `persistWithRetry` (3 attempts) and the pending localStorage marker. Do **not** change 20/40 math, `respawnHpAfterDeath`, or `armDeathGuards`. Do not add a 1.5s banner. Do not toast every successful death save (Game Over already speaks). Replay *success* after reload may toast once so a silent wallet drop has a why — do not toast per retry.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing sonner toast; `writePendingDeathPenalty`; 10-26-002 heal fail; 10-26-003 victory fail; #327 owns WX; union Game Over if #421 is wired later  
REGRESSION_RISK: LOW — presentation on an already-failing catch. Success must stay a single Game Over. Double-death guard (`deathPenaltyAppliedRef`) must not toast twice. Heal/shop after a missed replica write must still honour `applyUnpaidDeathPenaltyToWrite`.  
VALIDATION_REQUIRED: Die to melee → Game Over 20/40 unchanged, no error toast on a successful save. Force death-save throw → one error toast, pending marker remains, HUD stays cut, 1.5s wait still elapses. Reload with pending + uncut canister → replay write lands or one fail toast, not a second 20/40 modal. Lava in-battle skip stays #1133. Heal persist-fail stays #1133-002.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-27-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Portal +10 XP level-up must play the same `level_up` IMPACT recap already has  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `shouldAnnounceLevelUp` + `playSound("level_up")` run only on victory recap (`WX` 12514–12515) and Boss Rush room-clear recap (`WX` 12922–12923). Portal +10 XP hydrates `exp` / `level` / `expToNext` after `persistIncrementalRewards` commits (`WX` 6836–6841) with **no** `shouldAnnounceLevelUp` and **no** sound. `rewardFeel.ts` already gates the recap path. Leftover HUD is `100 * 2^(N-1)` (`xpCurve.ts`); leftover 90+ plus `PORTAL_TRANSITION_XP` (10) is a real overworld level-up with only digit changes. 008 remaining is recap *LEVEL UP chrome* (sound already shipped there). #1003 is spell-*book* upgrade toast. 09-23-005 / #478 is the +10 *float after commit*, not a level-up. Distinct from leftover-XP HUD (#108/#138 merged). Distinct from 004 this ledger (persist *fail*).  
SYSTEMS_AFFECTED: WorldExploration portal XP `.then` hydrate (`WX` 6821–6841); existing `shouldAnnounceLevelUp` / `playSound("level_up")`  
RECOMMENDED_ACTION: Snapshot `characterStats.level` (or the pre-persist HUD level) and, after a successful hydrate, `playSound("level_up")` when `shouldAnnounceLevelUp(prev, persisted.newLevel)`. Optional short toast. Do **not** add a 1.5s banner (preserve speed). Do not play during an open recap. Do not change `PORTAL_TRANSITION_XP`, `xpCurve`, or `applyRewards`. Recap banner stays 008. +10 float stays #478. Spell-book upgrade stays #1003.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: `rewardFeel.ts` (already shipped); 008 remaining recap chrome; 09-23-005 portal float; #327 owns WX  
REGRESSION_RISK: LOW — presentation after an already-committed persist. Same-level portal must stay quiet. Death during in-flight persist must still skip live hydrate (`shouldApplyVictoryLiveHydrate`). Recap `level_up` must not double-fire.  
VALIDATION_REQUIRED: Portal with leftover XP below threshold → HUD leftover +10 (or #478 float), no `level_up`. Portal that crosses the curve → one `level_up` sound, HUD level +1, leftover correct. Victory recap level-up still plays once. Boss Rush room-clear level-up still plays once. Spell-book upgrade still #1003.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-27-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Dying in a dungeon or Boss Rush must say the run ended, not only 20/40 + Death Realm  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `_handlePlayerDeath` calls `resetRunState` *before* `setShowGameOver(true)` (`WX` 13286–13310) so dungeon refs and `abortBossRush` clear while Game Over still only explains Death Realm + 20/40 (`GameOverModal.tsx` 52–81). The lava HP-watch also `resetRunState`s (`WX` 13323–13333) then attaches a defeat recap whose Continue copy is `"Continue — next you enter the Death Realm →"` (`PostBattleRecap.tsx` 642–644) — no dungeon/BR line. HUD chips (`Dungeon N/M` `WX` 17562–17576, `Boss Rush — Room N / 10` `WX` 17577–17598`) simply vanish. Player death is a listed critical moment; “what changed” includes the run, not only the wallet. Distinct from #845 / 10-21-001 (BR *Complete* on *victory*). Distinct from #419 room-advance. Distinct from #1003 BR *nearby*. Distinct from 10-26-001 lava skipping Game Over. Distinct from 10-26-004 Death Realm *chip*. Distinct from 013 wait. Distinct from #803 `complete(9)` persist order. Do **not** toast every overworld death (no run to end).  
SYSTEMS_AFFECTED: `GameOverModal` / defeat `PostBattleRecap` copy when `resetRunState` actually cleared dungeon or Boss Rush; optional one battle-log line at `_handlePlayerDeath`  
RECOMMENDED_ACTION: One short line (`"Dungeon chain ended"` / `"Boss Rush ended"`) on the Game Over / defeat recap that already opens. Pass a `runEnded` flag from the death path that just called `resetRunState`. Do **not** add a 1.5s banner. Do not change `resetRunState`, 20/40 math, or `abortBossRush` order. Overworld / rest / Death Realm deaths must stay quiet on this line. BR *Complete* stays #845.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing Game Over 20/40 (#421); Recap Continue copy; #327 owns WX; union Recap if #845-002 is wired later  
REGRESSION_RISK: LOW — copy on an already-committed run reset. Overworld death must not claim a run ended. Victory BR Complete must not become “ended.” Flee confirm copy (`BattleUIPanel.tsx` 519–523) already names Death Realm — do not duplicate a second modal.  
VALIDATION_REQUIRED: Die in overworld → Game Over 20/40, no run-ended line. Die during dungeon chain → one “Dungeon chain ended” (or equivalent) plus 20/40; after Death Realm escape, no `Dungeon N/M` chip. Die during Boss Rush → one “Boss Rush ended” plus 20/40; HUD room chip gone; Complete banner still only on *clearing* room 10 (#845). Lava in-battle skip stays #1133.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-27-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Portal +10 XP persist-fail needs a player cue after the map already swapped  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Portal transition runs `cleanupMap` / `generateRandomMap` *then* enqueues `persistIncrementalRewards(..., PORTAL_TRANSITION_XP)` (`WX` 6805–6845). HUD XP is correctly withheld until commit (AGENTS.md). Fail is `console.warn("[PBV] Portal XP save failed:", err)` (`WX` 6843–6845) with no toast, no float, no log. The map swap already happened — ACTION succeeded, the reward INFORMATION did not. 09-22-006 / #419 is the *portal block while persist is in flight* (`"Rewards settling…"`), not a failed write. 09-23-005 / #478 is the +10 *float after commit*. 10-26-003 / #1133 is victory persist-fail *after recap already showed the grant*. 002 this ledger is *successful* persist that levels up with no sound. Distinct from shop fail (#1061). Distinct from heal fail (#1133-002). Distinct from dungeon-complete trophy log (non-hole; wallet credits on commit). Do **not** optimistic-HUD the +10 (that is the unpaid-XP bug the comment at `WX` 6802–6804 exists to prevent).  
SYSTEMS_AFFECTED: WorldExploration portal XP `.catch` (`WX` 6843–6845)  
RECOMMENDED_ACTION: `toast.error` once (`"Portal XP didn't save"` / existing err) on the catch. Keep HUD frozen until commit. Do **not** show a lying +10 float on fail. Do not change `PORTAL_TRANSITION_XP` or the persist lock. In-flight *block* copy stays #419. Success float stays #478. Recap persist-fail stays #1133-003.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing sonner toast; 09-22-006 portal block; 09-23-005 success float; #327 owns WX  
REGRESSION_RISK: LOW — presentation on an already-failing catch. Success must stay quiet (or #478’s one float). Death during in-flight persist must still skip live hydrate. Adjacent portal step must not toast twice for one fail.  
VALIDATION_REQUIRED: Step a portal; persist ok → map swaps, leftover +10 (and #478 float if wired), no error toast. Force persist throw → map still swapped, HUD leftover unchanged, one error toast, no +10 float. Step a portal while a *different* persist is in flight → still #419’s settling float, not this error. Victory persist throw still #1133-003.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 … 10-26 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF). Still zero render call sites (`effects.ts` 331).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference). Distinct from #1003 spell-*book* upgrade. Distinct from 002 this ledger (portal *sound*).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote (`WX` 15790–15799). Distinct from #845 Boss Rush *Complete* and from #1003 BR *nearby*.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan (`WX` 8514–8529). Distinct from 09-29-002 (spell-slot AP) and from #894 hover *damage*.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT / Sacrifice source labels. Lava/spikes still sit in the movement RAF. Mirror Field reflect stays here. Lethal lava skipping Game Over is #1133-001.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`). Item-buff chips are 09-29-001. Apply *float* is #845 / 10-21-003. True *expiry* is #845 / 10-21-004.  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait. Toast after teleport (`WX` 13486) is not the wait. #554 is the walk block. Nearby *Escape* is #1061. HUD *chip* is #1133-004.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number (`WX` 9344). Drain heal is still log-only. Distinct from #894 heal *hover*. Distinct from #1133-002 (overworld Doka-heal persist-fail).  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004. Potion *drink* stays 09-02-004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009 (003 is shrine *juice*; 002 is ability *numbers* / AP *drain*; 005 is BR *room-advance*; 006 is victory-persist *portal block*). Altar *tile* is #954; AP *grant* is #954; BR *nearby* is #1003. Recap persist-*fail* is #1133-003. Portal XP persist-*fail* is 004 this ledger.  
- **#478 queue** — GFCF-2026-09-23-001…005. Portal +10 *success* float stays 005 there. Portal *level-up sound* is 002 this ledger.  
- **#523 queue** — GFCF-2026-09-24-001…004. Void Rift *cell* stays 001 there.  
- **#571 queue** — GFCF-2026-09-25-001…005.  
- **#610 queue** — GFCF-2026-09-26-001…004. Sealed *log* stays 001 there.  
- **#678 queue** — GFCF-2026-09-27-001…004.  
- **#735 queue** — GFCF-2026-09-28-001…004.  
- **#772 queue** — GFCF-2026-09-29-001…004.  
- **#845 queue** — GFCF-2026-10-21-001…004. Recap *rows* stay 002 there; fail *rising-edge* is #1003. BR *Complete* stays 001 there; run-*ended on death* is 003 this ledger.  
- **#894 queue** — GFCF-2026-10-22-001…004. Rest-*exit* stays 001 there.  
- **#954 queue** — GFCF-2026-10-23-001…004. Shock *cell* / shrine *tile* / rim / Dawn +AP stay there.  
- **#1003 queue** — GFCF-2026-10-24-001…004. White / BR nearby, spell-upgrade toast, challenge-*fail* rising-edge.  
- **#1061 queue** — GFCF-2026-10-25-001…004. Death Realm *Escape* nearby, challenge offer/expire, shop Buy persist-fail.  
- **#1133 queue** — GFCF-2026-10-26-001…004. In-battle lava skip Game Over, heal persist-fail after success toast, victory persist-fail after recap, Death Realm HUD chip.

TBC remains WAITING (**#1165**; #1108 was 10-26). Do not invent feel-telemetry (015 / AQA-012).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs stay PXA/MIMA. **Invincible / `damageImmune`:** unread on player hits — stay MIMA. **Shell Armor** on the player-spell path is applied — #735 / 09-28-002. **Vampiric Ground** `onDamageDealt` mutates a throwaway `attacker` object in `enemyTakesDamage` — MIMA, not a heal float (#1148 commits it *off* `main`). **`mirrorRedirect`** never fires — dead-code, not a feel ID. **`_leaderBoostMultiplier`** unread — MIMA. **`applyRangeModification` / `tickModifiableRangeBonuses`** are `void`ed unused — dead-code, not a mute range chip. **Summon-control walk thorns / Void Rift:** `applyControlledSummonWalk` never calls `applyBattleWalkHazards` — no damage applied (MIMA parity), not a mute float. **#803** persist `complete(9)` / `abortBossRush` order is not 003’s death copy and not 004’s portal XP fail. **#754** Swap landing tax is not the Swap puff (#523). **#799** bomber/Inferno share is combat truth; detonate already `processCombatantDeath`s. **#850–#1162** kit execute-share / remount-wipe / portal snaps / pack-enemy buffs / leftover-XP wipe / Glass Realm ×2 / Iron Curse / Vampiric Ground commit are combat/persist/map truth, not on `main`. **#728** End Turn lock is combat; leftover *title* is #894. **`res.newPositions`** unread in WX — MIMA. **`res.damageToTargets`** unread — MIMA. **`boardClaimZone`** stored and never taxed — MIMA; do not tint. **Ink Veil `glyphedTiles`:** designed invisible — MIMA, not a missing tint. **Boss `void` hazard** paints as spikes and landing ignores it — MIMA. **Dawn `damageToPlayer: -10`:** WX requires `> 0` — MIMA, not #954-004. **`covenantBuffMapsRef`:** written, unread — PXA/MIMA. **Resonance counter** deadlock — MIMA, not a countdown HUD. **Illusions / larvae / `reflectShieldTurnsLeft` / `magicReflectActive`:** unread or never ticked — MIMA. **Swift Winds / Mending Mist on the player:** hooks do not land — MIMA. **Glass Realm 2×:** `applyDamageToEnemy` never calls `applyDamageDealt` on `main` — MIMA, not a hover-lie ID (#894 is Fury/Blood Moon; #1160 commits Glass Realm *off* `main`).

## Explicit non-holes from this search

- Flee: confirm dialogs present on dungeon / Boss Rush (`WX` 18918–18935). Overworld flee is intentionally unconfirmed.  
- Player End Turn: `title=` already says leftover AP/MP are lost (`BattleUIPanel.tsx` 553). Summon End Turn *title* is #894. Controlled-summon 0/0 auto-end is next-turn log + dock dismiss — not filed.  
- Rest / sanctuary *entry*: toasts present (`WX` 6142 / 6205). Rest-*exit* is #894. Rest whirlpool rings are enough — **do not add a rest nearby label**. White *sanctuary* nearby is #1003. Death Realm *exit* nearby is #1061. Death Realm *HUD chip* is #1133-004. Do **not** add a sanctuary HUD chip (`generateRestMap` sets `isRestMap`).  
- Ground Doka: sound + float + log. Wallet credits on persist commit; `#err` releases the claim so the coin can retry — 10-26 listed this as a non-hole (not a lying *toast*). Do not twin as a persist-fail ID.  
- Map modifiers: log + `MapModifiersPanel`. Time Warp footer timer is enough. Blood Moon *number* is #894.  
- Challenge HUD: `shouldShowChallengeHud` keeps the panel after accept. Recap rows stay #845. Rising-edge fail is #1003. Offer *log* / unaccepted *expire* stay #1061.  
- **Player** summon spawn: puff + SFX + log. Fade log already says `"{name} fades away..."` (`summonLifespan.ts` 36). Fade *canvas* stays #419.  
- Dungeon-chain complete: gold trophy log already names the bonus (`WX` 6374–6376). Nearby dungeon portal label stays a non-hole.  
- Player DoT ticks: already go through `playerTakesDamage`. Enemy DoT ticks already go through `enemyTakesDamage`.  
- Leader death: `"LEADER DEFEATED!"` overlay. Erratic *why* is #735. Unused `leader_boost` SFX is a dead hook — do not add spectacle.  
- Spell fizzle: canvas `"✦ FIZZLED! ✦"` + SFX.  
- Attack Nearest cooldown: already floats `"On cooldown"`. Do **not** pulse the slot.  
- Hover crit omission: matrix note only.  
- Barrier fade: tower disappears; leftover `Barrier at ${bKey}` log is ugly but IMPACT exists — still not filed.  
- `comboTextRef` is drawn but never written — dead overlay, not a mute mechanic.  
- Enemy AI 5s watchdog: not a player “time’s up” (09-23-003). A `decide/apply` throw is `console.error` then a silent advance (`WX` 16956–16959) — exception path, not a listed player moment; leave it.  
- Jackpot heal: 3s banner already exists. Persist-*fail* of that button is #1133-002.  
- Recap Doka Fever ×2: announce + recap total are enough.  
- Game Over 20/40: already shows penalty lines on the *modal* path. In-battle lava skip is #1133-001. Persist-*fail* of that same penalty is 001 this ledger. Run-*ended* copy is 003 this ledger.  
- Death Realm *arrival* toast (`WX` 13486) after the 1.5s wait — the *wait* stays 013; nearby *Escape* is #1061; HUD *chip* is #1133-004. Fallback gen on throw still toasts (`WX` 13565).  
- White / rest *gen-fail* after `cleanupMap` is `console.error` (`WX` 6150 / 6214) — rare map-integrity, not a listed feel moment (AQA / GMI). Death Realm gen-fail already has a fallback map + toast.  
- Stun / root / silence / blind / confuse / charm / taunt / fear turn-skip: **no live CC skip path**.  
- Pushback / attract / non-Swap teleport: occupancy resolvers exist; still unimplemented in live cast.  
- Rest heal IMPACT: no rest-heal commit to float.  
- Chat send `catch { /* ignore */ }` is general UX, not GFCF.  
- Fury wore-off already logs (`WX` 14293). Shield remaining logs on melee absorb.  
- Zone Lock button + dialog already exist (`WX` 17600–17666).  
- `abortBossRush` `resetBossRush` fail is `console.error` (`useBossRush.ts` 348) — persist order owned by **#803**; do not re-file as GFCF. Run-*ended copy* is 003 this ledger.  
- Portal +10 *success* HUD-after-commit is the unpaid-XP fix; the missing *level-up sound* is 002; the missing *fail toast* is 004; the missing *float* stays #478.  

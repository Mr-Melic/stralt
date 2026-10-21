# Game Feel ACTION_IDs — 2026-10-21

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-10-21.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-96277ea1-40a8-41b9-9503-1d352d1843c5`

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
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx` or `PostBattleRecap.tsx`, already owned by older still-open PRs (#327, #363, #419, UX recap siblings).

A cooldown-slot arm flash was considered and **not filed**: remaining overlay (`BattleUIPanel.tsx` 623–624 / 705–731) + `"On cooldown"` reject already exist. Do not add spectacle.

---

ACTION_ID: GFCF-2026-10-21-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Banner Boss Rush final clear (complete / last room) like dungeon-chain COMPLETE  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Final Boss Rush room clear (`WX` 12697–12727) calls `completeRun`, swaps in a white sanctuary map via `applySanctuaryLayout`, and only `logBattleEntry("A white gateway to sanctuary opens…", "white")`. The same one-line log is the only cue on `subscribeRunComplete` (`WX` 1308–1338). Recap of that fight still titles `Boss Rush - Room ${currentRoomIndex + 1}` (`WX` 12877) — it does not say the run is over. The player then closes recap onto a new map with a white portal and no Complete chrome. Sanctuary *portal step* already toasts (`WX` 6142) *after* they walk it. Dungeon-chain complete already logs `🏆 Dungeon Chain COMPLETE! Bonus: ${chainBonus} Doka!` (`WX` 6374–6377) *then* the same gateway line — 09-23 left the gateway as a non-hole **next to that trophy line**. Boss Rush has no trophy line. Mid-run room-advance mute is already #419 / 09-22-005 (`WX` 6095–6110). Boss-colored *entry* already uses `☠️ BOSS ENCOUNTER: …` for 1.5s (`WX` 6496–6504). Distinct from 009 (PHASE 2 / Weeping Pawn). Distinct from sealed progression (#610 / 09-26-001). Distinct from #803 persist `complete(9)` (mechanic order, not IMPACT).  
SYSTEMS_AFFECTED: WorldExploration Boss Rush final-clear + `subscribeRunComplete` only  
RECOMMENDED_ACTION: One Complete cue on the final-clear path: reuse `setBossEncounterBanner("Boss Rush Complete")` for ≤1.5s **or** a gold log matching dungeon-chain (`🏆 Boss Rush COMPLETE!`). Do **not** stack banner + trophy + sanctuary toast. Keep the white-gateway log. Do not change `completeRun` / reward keep rules. Do not show Complete on mid-run room clears (those stay #419).  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing `bossEncounterBanner` UI; #419 owns mid-run room advance; #803 owns persist `complete(9)`  
REGRESSION_RISK: LOW — presentation on an already-committed clear. Mid-run room clears must not show Complete. Flee/death must not show Complete.  
VALIDATION_REQUIRED: Clear the last Boss Rush room; one Complete cue + existing white-gateway log; recap still opens; white portal present; rewards still kept; room 1→2 advance still waits on #419 (no Complete); flee/death stay quiet.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-21-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Surface challenge success (and fail) on the app-root PostBattleRecap  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `BattleRecapData` already declares `dokaFromVictory` / `dokaFromChallenges` / `completedChallenges` (`PostBattleRecap.tsx` 16–18). Grep of that file: those three names appear **only** on the type — JSX never reads them. Dungeon-chain bonus *is* rendered (`PostBattleRecap.tsx` 448–493). Regular victory (`WX` 12456–12472) passes `completedChallenges: challengeCompleted ? ["Battle Challenge"] : []` and discards `_completedChallengeName` (`WX` 12321–12323); it does **not** pass `dokaFromChallenges` (challenge XP/Doka are baked into `xpEarned` / `dokaEarned` via `recapGrant`). Boss-rush recap (`WX` 12875–12894) passes live persist names + `dokaFromChallenges` + `dokaFromVictory` and Recap still ignores them. Empty `completedChallenges` is both “no offer” and “accepted but failed” — a fail line needs an explicit accepted/attempted flag that is not on the payload today. In-battle ChallengePanel chrome is an explicit non-hole. Distinct from dungeon-chain badge (already rendered). Distinct from feat recap (#159 / GFCF-007). Distinct from Recap Doka Fever (non-hole). Distinct from leftover-XP HUD (#108/#138 merged; #421 copy).  
SYSTEMS_AFFECTED: `PostBattleRecap.tsx` JSX; optional WX recap payload (live name, `dokaFromChallenges` on the regular path, optional `challengeAttempted`)  
RECOMMENDED_ACTION: When `completedChallenges?.length`, render a short Challenge section (live name, not the `"Battle Challenge"` stub; `+N Doka` from `dokaFromChallenges` when present). Pass `_completedChallengeName` / persist names on **both** recap builders. A fail line only if the payload records that a challenge was accepted and the list is empty — do not invent fail copy for fights that never offered one. Do not change `isChallengeCompleted` math or persist entries. Do not add a 1.5s banner.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing recap data fields; ChallengePanel stays the live HUD; union Recap with #354 / #421 / #485  
REGRESSION_RISK: LOW — presentation of already-computed fields. Unaccepted offers must stay silent. Do not double-count challenge Doka in the total.  
VALIDATION_REQUIRED: Accept Untouchable and win without damage → recap lists the real challenge name and challenge Doka (regular *and* Boss Rush paths); fail it → fail line only if attempted flag is set, no bonus Doka row; no-offer fight unchanged. Escape still closes Recap.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-21-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Buff/debuff APPLY needs a short canvas float off the movement RAF  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `applyActiveEffect` (`WX` 1871–1920) merges the effect and `logBattleEntry`s magnitude/duration for buff/debuff/DoT. Canvas emoji pills appear above the sprite (`WX` 8240–8269 enemy / 8356–8384 player); inspect `StatusEffectBadge` lists them (`WX` 18342–18354). There is no `spawnFloatText` / `spawnDamageAtTile` on apply. Spell-context `applyEffect` (`WX` 9209) and summon-control copy (`WX` 15029), boss kit/ability (`WX` 15908 / 15936 / 15958 / 16050 / 16066), enemy AI (`WX` 16595 / 16615 / 16676), Ember Knight ignite (`WX` 16790 / 16806), and enemy lava/ice (`WX` 16903 / 16918) all go through this helper. Haste is `buffStat: "mp"` (+2), not extra AP. Distinct from Mark *consume* `"Marked!"` (#735 / 09-28-003) and Mark *tint* (#523). Distinct from Shell Armor why (#735 / 09-28-002). Distinct from Mirror activate (#571 / 09-25-002). Distinct from 012 (duration digits on existing pills). Distinct from Null Field veto (#772 / 09-29-003) — that path returns before merge. **Player lava Burning (`WX` 11444) and player ice Frozen (`WX` 11457) call this helper from the movement RAF** — those floats stay 011 / 09-23-004; do not hitch the walk tween.  
SYSTEMS_AFFECTED: WorldExploration `applyActiveEffect` success path, excluding movement-RAF callers  
RECOMMENDED_ACTION: One short float at the target tile (`effectName` / `"+2 MP"` / `"Weakened"`) after a successful merge on spell / AI / boss / enemy-hazard callers. Keep the log and pills. Skip when Null Field / Overflow vetoes (#772). Do **not** spawn from the player movement-RAF lava/ice calls — pass a skip flag or float only at the non-RAF call sites. Do not change buff math or durations. No particles, no 1.5s banner.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: #772 owns veto presentation; 012 owns pill digits; 011 / 09-23-004 own player RAF hazards; enemy ice may share this helper (off-RAF)  
REGRESSION_RISK: LOW — presentation after a successful merge. MEDIUM if wired inside `applyActiveEffect` without skipping the RAF callers (frame hitch on lava/ice steps). Suppressed applies must stay quiet.  
VALIDATION_REQUIRED: Cast Haste on self → one float + existing log + pill; walk tween still 600ms with no extra hitch; Null Field + buff → no apply float (veto stays #772); player ice still waits on #478; enemy ice Frozen may float once this ID is wired.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-21-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: True status / DoT expiry needs a wore-off cue (stop logging expired every tick)  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `tickNonDotEffects` (`statusEffects.ts` 125–133, 146–169) pushes every decremented non-DoT into `decremented`, including rows with `newDur > 0`. `processActiveEffects` (`WX` 2001–2013) then logs `"${effectName} expired (… ended)"` for each — a 3-turn Weaken therefore claims it expired on the first two ticks. That wording is characterized in `statusEffects.ts` 129–132 (“do not fix in the same change as this extraction”). DoT stacks that hit 0 are dropped inside `tickDotStacks` (`dotStacks.ts` 113–122) with **no** wore-off log and no float; only the `[DOT]` damage line fires while stacks remain (`WX` 1984–1994). Fury *remaining chip* is #772 / 09-29-001; Fury’s own wore-off log (`WX` 14290–14293) is a different ref, not an `ActiveEffect`. Canvas pill duration digits are 012. Distinct from summon lifespan `"Fades"` (#419 / 09-22-007). Distinct from barrier fade tower+log (explicit non-hole). Turn-start path — not the movement RAF.  
SYSTEMS_AFFECTED: WorldExploration `processActiveEffects` true-drop path only  
RECOMMENDED_ACTION: Gate the existing expired log (and one short `"Wore off"` / `effectName` float) to rows that actually drop (`newDur <= 0`) and to DoT stacks whose `perStackDurations` entry is `<= 0` this tick. Do **not** change decrement math, RES, or who is ticked. Do **not** rewrite `tickNonDotEffects` in a way that drops mid-duration rows. Do not float on every mid-duration tick. No banner.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: 012 for pill digits; 09-29-001 for Fury/Shield chips; DoT *damage* numbers already exist via `playerTakesDamage` / `enemyTakesDamage`  
REGRESSION_RISK: LOW — presentation on already-dropped rows. Mid-duration ticks must not float or keep lying `"expired"`. DoT last tick must not double the damage number.  
VALIDATION_REQUIRED: Apply a 2-turn Weaken; log/float only when it drops (not on the first decrement); DoT last tick → one wore-off cue after the existing damage number; Fury still logs its own line and waits on 09-29-001 for the chip.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 … 09-29 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF). Still zero render call sites (`effects.ts` 331).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote. Distinct from this ledger’s Boss Rush *Complete*.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan. Distinct from 09-29-002 (spell-slot AP).  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF. Mirror Field reflect (`WX` 9538–9561) stays here. Player RAF Burning/Frozen *apply floats* stay here / 09-23-004 — do not hang 003 on those callers.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`). Item-buff chips are 09-29-001. Apply *float* is 003 this ledger. True *expiry* is 004 this ledger.  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait. #554 is the walk block.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004. Potion *drink* stays 09-02-004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009 (005 is BR *room-advance*, not this ledger’s Complete).  
- **#478 queue** — GFCF-2026-09-23-001…005 (001 includes enemy/boss **drain** self-heal; 004 is *player* ice RAF).  
- **#523 queue** — GFCF-2026-09-24-001…004 (Void Rift tint, player modifier HP numbers, Swap puff, Mark *tint*).  
- **#571 queue** — GFCF-2026-09-25-001…005 (Timestep, Mirror activate, Betrayal *victim*, hitsMultiple hover, Occupied summon dest).  
- **#610 queue** — GFCF-2026-09-26-001…004 (sealed portal, ability minion puff, boss teleport puff, bounce hover).  
- **#678 queue** — GFCF-2026-09-27-001…004 (player Mirror consume, enemy battle-walk puff, enemy hazard landing numbers, betrayal enrage 6×).  
- **#735 queue** — GFCF-2026-09-28-001…004.  
- **#772 queue** — GFCF-2026-09-29-001…004. Shield/Fury *chips* stay 09-29-001; apply float of real `ActiveEffect`s is 003 this ledger.

TBC remains WAITING (#833). Do not invent feel-telemetry (015 / AQA-012).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs stay PXA/MIMA. **Invincible / `damageImmune`:** unread on player hits — stay MIMA. **Shell Armor** on the player-spell path is applied — #735 / 09-28-002. **Vampiric Ground** `onDamageDealt` mutates a throwaway `attacker` object in `enemyTakesDamage` — MIMA, not a heal float. **`mirrorRedirect`** never fires — dead-code, not a feel ID. **`_leaderBoostMultiplier`** unread — MIMA. **`applyRangeModification` / `tickModifiableRangeBonuses`** are `void`ed unused (`WX` 1756–1757) — dead-code, not a mute range chip. **Summon-control walk thorns / Void Rift:** `applyControlledSummonWalk` never calls `applyBattleWalkHazards` — no damage applied (MIMA parity), not a mute float. **#803** persist `complete(9)` is not this ledger’s banner. **#754** Swap landing tax is not the Swap puff (#523). **#799** bomber/Inferno share is combat truth.

## Explicit non-holes from this search

- Flee: confirm dialogs present.  
- End Turn: `title=` already says leftover AP/MP are lost (`BattleUIPanel.tsx` 553). Do not add a confirm that slows turns.  
- Rest / sanctuary portal: toasts present (`WX` 6142 / 6205).  
- Ground Doka: sound + float + log.  
- Map modifiers: log + `MapModifiersPanel`. Time Warp footer timer is enough.  
- Challenge HUD: panel fail/on-track chrome. Recap is 002.  
- **Player** summon spawn: puff + SFX + log.  
- Dungeon-chain complete: gold trophy log already names the bonus (`WX` 6374–6376). White gateway next to that line stays a non-hole. Boss Rush *without* a trophy line is 001.  
- Player DoT ticks: already go through `playerTakesDamage`. Enemy DoT ticks already go through `enemyTakesDamage` → `spawnDamageAtTile`.  
- Leader death: `"LEADER DEFEATED!"` overlay. Erratic *why* is #735 / 09-28-004.  
- Spell fizzle: canvas `"✦ FIZZLED! ✦"` + SFX. Do not reuse that string for Null Field (#772).  
- Attack Nearest cooldown: already floats `"On cooldown"`. Spell-slot CD overlay already shows remaining turns (`BattleUIPanel.tsx` 705–732) — **do not pulse the slot** (spectacle; not filed).  
- Hover crit omission: matrix note only (09-28). Do not twin 002 or 003.  
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
- Stun / root / silence / blind / confuse / charm / taunt / fear turn-skip: **no live CC skip path** — unimplemented, not mute feel.  
- Pushback / attract / non-Swap teleport: occupancy resolvers exist; still unimplemented in live cast.  
- Rest heal IMPACT: no rest-heal commit to float.  
- Haste is `buffStat: "mp"` (+2), not extra AP — Timestep stays #571; Haste *apply* float is 003.  
- Trap / glyph trigger: `isTrap` → `placeBarrier`; no separate WX trigger.  
- Dispel / cleanse / AP steal: no dispel; boss AP drain stays #419.  
- Life steal / drain heal stays 014. hitsAllies number stays 003 (08-31).  
- Fury *expiry log* alone is not enough INFORMATION — remaining turns are 09-29-001; do not twin the wore-off line as a fifth ID. ActiveEffect expiry is 004 this ledger.  

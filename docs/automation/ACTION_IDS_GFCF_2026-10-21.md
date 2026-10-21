# Game Feel ACTION_IDs — 2026-10-21

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-10-21.md`  
**HEAD:** `0f5363f`  
**Run:** this automation

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

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx` or `PostBattleRecap.tsx`, already owned by older still-open PRs (#327, #363, #419, UX siblings).

---

ACTION_ID: GFCF-2026-10-21-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Banner Boss Rush final clear (complete / room 9) like room-advance and boss entry  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Final Boss Rush room clear (`WX` 12697–12727) calls `completeRun`, swaps in a white sanctuary map via `applySanctuaryLayout`, and only `logBattleEntry("A white gateway to sanctuary opens…", "white")`. The same one-line log is the only cue on the `subscribeRunComplete` path (`WX` 1308–1338). No `setBossEncounterBanner`, toast, or recap chrome names the run complete. Room-to-room portal advance mute is already #419 / 09-22-005 (`WX` 6095–6110). Boss-colored *entry* already uses `☠️ BOSS ENCOUNTER: …` for 1.5s (`WX` 6496–6504). Sanctuary *portal step* already toasts (`WX` 6142). Distinct from dungeon-chain gold log (explicit non-hole). Distinct from phase-2 (009).  
SYSTEMS_AFFECTED: WorldExploration Boss Rush final-clear + `subscribeRunComplete` only  
RECOMMENDED_ACTION: Reuse `setBossEncounterBanner` with `"Boss Rush Complete"` (or `"Run Complete"`) for ≤1.5s on the final-clear path. Keep the white-gateway log. Do not change `completeRun` / reward keep rules. Do not stack a second long banner on every room (room-advance stays #419).  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing `bossEncounterBanner` UI; #419 owns mid-run room advance  
REGRESSION_RISK: LOW — presentation on an already-committed clear. Mid-run room clears must not show Complete. Flee/death must not show Complete.  
VALIDATION_REQUIRED: Clear the last Boss Rush room; one Complete banner + existing white-gateway log; white portal present; rewards still kept; room 1→2 advance still waits on #419 (no Complete).  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-21-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Surface challenge success (and fail) on the app-root PostBattleRecap  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Victory paths already compute and pass `completedChallenges` / `dokaFromChallenges` / `dokaFromVictory` into recap data (`WX` 12302–12323, 12469, 12764–12792, 12890–12892). `PostBattleRecap.tsx` declares those fields on `BattleRecapData` (lines 16–18) but **never reads them in JSX** — only total XP/Doka, enemy rows, dungeon multiplier, and feats render. `_completedChallengeName` is assigned and discarded (`WX` 12321–12323). In-battle ChallengePanel chrome is an explicit non-hole. Distinct from dungeon-chain badge (already rendered). Distinct from feat recap (#159 / GFCF-007). Distinct from Recap Doka Fever (non-hole).  
SYSTEMS_AFFECTED: `PostBattleRecap.tsx` only (optional one battle-log line in WX)  
RECOMMENDED_ACTION: When `completedChallenges?.length`, render a short Challenge section (name + `+N Doka` from `dokaFromChallenges`). When the fight accepted a challenge and the list is empty, one dim `"Challenge failed"` line is enough. Do not change `isChallengeCompleted` math or persist entries. Do not add a 1.5s banner.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing recap data fields; ChallengePanel stays the live HUD  
REGRESSION_RISK: LOW — presentation of already-computed fields. Unaccepted offers must stay silent.  
VALIDATION_REQUIRED: Accept Untouchable and win without damage → recap lists the challenge and challenge Doka; fail it → fail line, no bonus Doka row; no-offer fight unchanged. `PostBattleRecap` still closes on Escape.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-21-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Buff/debuff APPLY needs a short canvas float (pills + log are not IMPACT)  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `applyActiveEffect` (`WX` 1871–1920) merges the effect and `logBattleEntry`s magnitude/duration for buff/debuff/DoT. Canvas emoji pills appear above the sprite (`WX` 8240–8269 enemy / 8356–8384 player); inspect `StatusEffectBadge` lists them (`WX` 18342–18354). There is no `spawnFloatText` / `spawnDamageAtTile` on apply. Haste (`spellData.ts` 314–331, `buffStat: "mp"`), Slow, Weaken, Shield, and enemy/boss `debuffStat` paths all share this mute IMPACT. Distinct from Mark *consume* `"Marked!"` (#735 / 09-28-003) and Mark *tint* (#523). Distinct from Shell Armor why (#735 / 09-28-002). Distinct from ice Frozen apply inside the RAF (#478 / 09-23-004). Distinct from 012 (duration digits on existing pills). Distinct from Null Field veto (#772 / 09-29-003).  
SYSTEMS_AFFECTED: WorldExploration `applyActiveEffect` success path only  
RECOMMENDED_ACTION: One short float at the target tile (`"Haste"` / `"+2 MP"` / `"Weakened"` / reuse `effectName`). Keep the log and pills. Do not float when Null Field / Overflow vetoes (that line is #772). Do not change buff math or durations.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: #772 owns veto presentation; 012 owns pill digits  
REGRESSION_RISK: LOW — presentation after a successful merge. Suppressed applies must stay quiet.  
VALIDATION_REQUIRED: Cast Haste on self → one float + existing log + pill; cast Weaken on an enemy → float at enemy tile; Null Field + buff → no apply float (veto stays #772).  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-21-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: True status / DoT expiry needs a canvas wore-off cue  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Non-DoT tick (`statusEffects.ts` `tickNonDotEffects` 146–169; `WX` `processActiveEffects` 2001–2013) logs `"… expired (… ended)"` for **every decremented** non-DoT with stat+modifier — including rows that still have `newDur > 0` — and never floats. DoT stacks that hit 0 are dropped inside `tickDotStacks` (`dotStacks.ts` 113–120) with **no** wore-off log and no float; only the damage `[DOT]` line fires while stacks remain (`WX` 1984–1994). Fury *remaining chip* is #772 / 09-29-001; Fury wore-off log alone was left as a non-hole there. Canvas pill duration digits are 012. Distinct from summon lifespan `"Fades"` (#419 / 09-22-006). Distinct from barrier fade tower+log (explicit non-hole).  
SYSTEMS_AFFECTED: WorldExploration `processActiveEffects` true-drop path only  
RECOMMENDED_ACTION: When a non-DoT row is actually dropped (`newDur <= 0`) or a DoT stack expires this tick, one short `"Wore off"` / `effectName` float at the target tile (or one log line for DoT expiry). Do **not** “fix” the per-tick `"expired"` wording in the same change (`statusEffects.ts` 129–132 characterizes it). Do not add a banner.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: 012 for pill digits; 09-29-001 for Fury/Shield chips  
REGRESSION_RISK: LOW — presentation on already-dropped rows. Mid-duration ticks must not float every turn.  
VALIDATION_REQUIRED: Apply a 2-turn Weaken; float only when it drops; DoT last tick → one wore-off cue after the damage number; Fury still logs its own line and waits on 09-29-001 for the chip.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-21-005  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Spell cooldown APPLY should flash the slot when the lock is first written  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: MEDIUM  
EVIDENCE: `executeCastAttempt` writes `spellCooldownsRef` + bumps `spellCooldownVersion` only after a successful cast (`WX` 17200–17203). `BattleUIPanel` then shows a red digit overlay and 0.5 opacity (`BattleUIPanel.tsx` 623–624 / 705–731). Reject path already floats `"On cooldown"` (`rejectCopy.ts` 61; Attack Nearest non-hole). There is no cast-time IMPACT that the lock just armed — easy to miss if the bar is folded. Distinct from 09-29-002 (AP *digit* vs `resolveCastApCost`). Distinct from 09-22-008 (ignored click at 0 AP).  
SYSTEMS_AFFECTED: BattleUIPanel cooldown overlay arm; optional one-frame pulse  
RECOMMENDED_ACTION: Brief pulse/flash on the slot the frame `cdTurns` goes from 0→N, or a tiny `"CD N"` float at the caster. Do not change `nextSpellCooldownTurns` math. Do not float on every turn decrement.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing cooldown overlay; AN `"On cooldown"` reject stays  
REGRESSION_RISK: LOW — presentation. Spells with `cooldown === 0` must stay quiet.  
VALIDATION_REQUIRED: Cast a CD>0 spell → overlay appears with a one-shot pulse; next player turns only decrement the digit; 0-CD spells never pulse.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 … 09-29 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`). Item-buff chips are 09-29-001. True *expiry float* is 004 this ledger.  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 … #772 queues** — do not re-file.

TBC remains WAITING. Do not invent feel-telemetry (015 / AQA-012).

## Explicit non-holes / not GFCF from this search

- Stun / root / silence / blind / confuse / charm / taunt / fear turn-skip: **no live CC skip path** in WX / `statusEffects` / `spellEngine` — unimplemented, not mute feel.  
- Pushback / attract / non-Swap teleport: occupancy resolvers exist; still unimplemented in live cast (same as #678 note).  
- Summon-control walk thorns / Void Rift: `applyControlledSummonWalk` (`WX` 9945–10003) never calls `applyBattleWalkHazards` — **no damage applied** (MIMA parity), not a mute float of an applied hit. Player thorn/rift walk numbers stay #523.  
- Rest portal: toast only; no rest-heal commit to float. Sanctuary entry toast present.  
- Game Over 20/40: `GameOverModal.tsx` 56–74 already shows penalty lines on `main`.  
- Enemy DoT ticks: already go through `enemyTakesDamage` → `spawnDamageAtTile` (`WX` 1973–1979 / 3524–3531).  
- Spell cooldown *remaining* overlay: present (`BattleUIPanel` 705–731). AN `"On cooldown"` reject present.  
- Challenge *HUD* chrome: ChallengePanel non-hole. This ledger’s 002 is recap-only.  
- Haste is `buffStat: "mp"` (+2), not extra AP — Timestep AP/MP IMPACT stays #571; Haste *apply* float is 003.  
- Life steal / drain heal stays 014. hitsAllies number stays 003.  
- Flee confirms, End Turn title, ground Doka juice, Map Effects panel, player summon spawn puff, dungeon-chain gold log, LEADER DEFEATED, FIZZLED, barrier place/fade, area-target ring, Jackpot banner, Recap Doka Fever, Time Warp footer, Fog/Gravity stubs, invincible/`damageImmune` unread (MIMA), Vampiric Ground throwaway (MIMA), `mirrorRedirect` dead branch, `_leaderBoostMultiplier` unread (MIMA), passive overworld +1HP/10s.  

# Game Feel & Combat Feedback Audit — 2026-10-21

**HEAD:** `0f5363f`  
**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion IDs:** `docs/automation/ACTION_IDS_GFCF_2026-10-21.md`

`main` is still `0f5363f`. **#363**, **#419**, **#478**, **#523**, **#571**, **#610**, **#678**, **#735**, and **#772** are still open. This run searched WX + `castHelpers` / `spellEngine` / `statusEffects` / `mapModifiers` / `enemyAI` / `effects` / `summonLifespan` / `rejectCopy` + `BattleUIPanel` / `PostBattleRecap` for mute IMPACT / INFORMATION that those ledgers listed as explicit non-holes, unimplemented mechanics, or never filed.

## Unique NEW (5)

1. **Boss Rush final clear has no Complete banner.** Only `logBattleEntry("A white gateway to sanctuary opens…")` (`WX` 12697–12727 / 1308–1338). Mid-run room-advance mute stays #419. Sanctuary *step* toast already exists. → **GFCF-2026-10-21-001**

2. **Challenge outcome never renders on PostBattleRecap.** Data fields `completedChallenges` / `dokaFromChallenges` / `dokaFromVictory` are passed (`WX` 12890–12892) and typed (`PostBattleRecap.tsx` 16–18) but unread in JSX. `_completedChallengeName` is discarded (`WX` 12321–12323). Challenge HUD chrome stays a non-hole. → **GFCF-2026-10-21-002**

3. **Buff/debuff APPLY has log + pills, no canvas IMPACT float.** `applyActiveEffect` (`WX` 1871–1920) covers Haste / Slow / Weaken / Shield / enemy debuffs. Distinct from Mark consume (#735), Shell Armor why (#735), ice Frozen RAF (#478), pill digits (012), Null Field veto (#772). → **GFCF-2026-10-21-003**

4. **True status / DoT expiry has no canvas wore-off cue.** Non-DoT path logs `"expired"` for every decrement (`WX` 2004–2013; characterized in `statusEffects.ts`). DoT stacks drop silently in `tickDotStacks`. Distinct from 012 digits and 09-29-001 Fury/Shield chips. → **GFCF-2026-10-21-004**

5. **Spell cooldown APPLY has no arm flash** (remaining overlay exists). `executeCastAttempt` writes the map (`WX` 17200–17203); panel paints the digit (`BattleUIPanel` 705–731). Reject `"On cooldown"` already floats. P3. → **GFCF-2026-10-21-005**

## Searched and rejected (not unique / not GFCF)

| Candidate | Verdict |
| --- | --- |
| Stun / root / silence / blind / charm / taunt / fear skip-turn | No live CC skip path — unimplemented |
| Pushback / attract / non-Swap teleport | Occupancy-only; same as #678 non-hole |
| Summon-control thorns / rift | `applyControlledSummonWalk` never debits — MIMA, not mute juice |
| Player thorn / plague / rift HP numbers | Queued #523 |
| Enemy lava / spikes / ice landing | Queued #678 |
| Enemy DoT tick numbers | Already `enemyTakesDamage` → `spawnDamageAtTile` |
| Rest heal IMPACT | No rest-heal commit; toast non-hole |
| Game Over 20/40 | Already in `GameOverModal` on `main` |
| Controlled summon cast fail | Queued #363 |
| Haste “extra AP” | Spell is `buffStat: "mp"`; Timestep stays #571; apply float is 003 |
| Trap / glyph trigger | `isTrap` → `placeBarrier` in enemy resolver only; no WX trigger |
| Dispel / cleanse / AP steal float | No dispel; boss AP drain stays #419 |
| Drain heal / hitsAllies number | Stay 014 / 003 |
| Challenge HUD chrome | Explicit non-hole; recap is 002 |

## Matrix notes (unchanged ownership)

| Surface | State |
| --- | --- |
| Boss phases | Encounter banner on *entry*; PHASE 2 log-only (009); BR room-advance (#419); **BR complete mute (this ledger)** |
| Statuses | Pills emoji-only (012); Shield/Fury chips (#772); **apply float + true expiry (this ledger)** |
| Recap | Feats wired; LEVEL UP chrome remaining (008); **challenge rows unread (this ledger)** |
| Cooldowns | Remaining overlay present; **arm flash missing (this ledger, P3)** |

Docs-only — did not wire WX / PostBattleRecap (owned by older still-open PRs).

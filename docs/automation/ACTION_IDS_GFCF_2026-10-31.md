# Game Feel ACTION_IDs — 2026-10-31

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-10-31.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-9360df7a-3ab5-59c5-b0a5-e10277001038`

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
`GFCF-2026-10-27-001` … `004` are **queued in #1184** (not on `main`).  
`GFCF-2026-10-28-001` … `004` are **queued in #1227** (not on `main`).  
`GFCF-2026-10-29-001` … `004` are **queued in #1306** (not on `main`).  
This file records **new unique** recommendations only. Do not re-open prior IDs as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx` (`handleBattleEnd` pre-cleanup boss snapshot, phase-2 heal float, shrine persist-fail toast) and `castHelpers.ts` (surface `_resistNote`). Oldest WX owner is **#327**; **#363** / **#419** already queue feel floats. **#845** / **#354** own Recap chrome. **#1341** owns overworld-boss reward snapshot — union, do not overwrite; this ledger’s 001 is *naming* only.

Hover-crit omission stays a matrix note. Cooldown-slot pulse stays unfiled. Challenge HUD stays a non-hole. Occupied player walk float already ships on main. Summon fade float stays #419 / 09-22-007. Standing lava turn-start is not a mechanic. Glyph/larva/Iron Curse heal-half/push-pull stay MIMA.

---

ACTION_ID: GFCF-2026-10-31-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Overworld boss victory recap never names the boss (cleanup wipes the ref first)  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `handleBattleEnd` calls `cleanupBattle()` at `WorldExploration.tsx` 12328. `cleanupBattle` sets `currentBossConfigRef.current = null` at 11662. Recap builds `bossDefeated: currentBossConfigRef.current?.name || undefined` at 12471 — always undefined after cleanup. The `☠️ BOSS DEFEATED: ${activeBossConf.name}` log at 12498–12502 and `bossId: activeBossConf?.id` for client-trusted feats see the same wiped ref. `PostBattleRecap.tsx` 148–175 already renders BOSS DEFEATED when `bossDefeated` is set. Overworld boss portals *do* set the ref at 6494. Distinct from 10-29-003 (BR never sets `currentBossConfigRef` at spawn). Distinct from #1341 (reward multiplier snapshot / persist) — this ID is the missing name chrome only.  
SYSTEMS_AFFECTED: `WorldExploration.tsx` `handleBattleEnd`; optionally `PostBattleRecap.tsx` (already wired)  
RECOMMENDED_ACTION: Snapshot `{ name, id }` from `currentBossConfigRef.current` **before** `cleanupBattle`. Pass `name` into `bossDefeated` and the defeat log; pass `id` into victory feat conditions. Do not change BR room-clear here (10-29-003).  
AUTONOMY: RECOMMEND  
DEPENDENCIES: none for naming; union carefully with #1341 if both touch the pre-cleanup snapshot  
REGRESSION_RISK: LOW — presentation fields from an already-known boss config  
VALIDATION_REQUIRED: Kill an overworld boss; recap shows BOSS DEFEATED + boss name; battle log has one defeat line; non-boss victories still omit the block.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-31-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Phase 2 HP bump commits silently (no +HP float)  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Boss phase transition at `WorldExploration.tsx` 15768–15785 calls `hpAfterBossPhase2` and `updateCombatant` with the new `hp`/`maxHp`. Weeping Pawn restores full HP; others scale current HP by `phase2.statMultiplier` (`battleSetup.ts` 268–281). Only `logBattleEntry` PHASE 2 / PROMOTE lines fire at 15790–15799. No `spawnDamageAtTile(..., "heal")`. Distinct from filed PHASE 2 *banner* (009 / log-only climax) and from 09-23-001 enemy/boss *ability* self-heal numbers.  
SYSTEMS_AFFECTED: `WorldExploration.tsx` boss AI phase-transition block  
RECOMMENDED_ACTION: After the store write, float `+ΔHP` with heal kind at the boss tile (Δ = newHp − liveHpBefore). Keep existing log lines. Do not add a second PHASE 2 banner (009).  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-08-31-001 juice helpers  
REGRESSION_RISK: LOW — presentation after an already-committed HP write  
VALIDATION_REQUIRED: Force phase 2 on a non-Weeping boss; one green +HP float matching store delta; Weeping Pawn full restore also floats; HP bar matches float.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-31-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: SR/RES soak is computed then discarded (no resist float or log note)  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: MEDIUM  
EVIDENCE: `calculatePlayerDamage` applies SR×RES (`WorldExploration.tsx` 3342–3363). `applyDamageToEnemy` computes `resistedAmt` and builds `_resistNote` (`castHelpers.ts` 379–393) but the note is unused; `logBattleEntry` at 410–412 only prints final damage. No canvas resist float. Distinct from Shell Armor why-log (09-28-002) and shield absorb. Primary-hit IMPACT absence remains GFCF-003 — prefer shipping soak cue with that juice so resist is not the only canvas number.  
SYSTEMS_AFFECTED: `castHelpers.ts` `applyDamageToEnemy`; optional canvas float via existing EffectsManager  
RECOMMENDED_ACTION: When `resistedAmt > 0`, append `_resistNote` to the battle log and/or float a short soak cue. Do not change the formula. Skip when soak is 0.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: ideally GFCF-2026-08-31-003 (primary-hit juice) so soak accompanies a damage number  
REGRESSION_RISK: LOW — dead string already computed  
VALIDATION_REQUIRED: Hit a high-SR enemy; log or float shows soak; zero-SR enemy unchanged; damage math identical.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-10-31-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Shrine altar Doka persist-fail is silent after claim (and after #419 juice)  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Altar step `tryClaimFlag` + `persistDokaCreditResult(300)` at `WorldExploration.tsx` 11303–11327. `settle.kind === "release"` only `releaseFlag` — no toast/log/float. Success juice is #419 / 09-22-003 (plays on claim, before commit, when that PR lands). Fail after juice/claim is the same class as dungeon-complete fail (10-28-001) and shop Buy fail (10-25-004), shrine-specific. Distinct from shrine *juice* and from 10-23-002 altar *anticipation*. Covenant unread stays PXA/MIMA.  
SYSTEMS_AFFECTED: `WorldExploration.tsx` shrine altar settle branch  
RECOMMENDED_ACTION: On `release` (and any kept-claim transport miss the player needs to know about), toast/log that the 300 Doka credit failed. Do not credit the wallet. Keep one-shot semantics.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: none for fail toast; #419 for success juice ordering  
REGRESSION_RISK: LOW — presentation on an already-failing settle  
VALIDATION_REQUIRED: Force shrine credit `#err`; one fail toast; flag released for retry; successful credit still juiced once #419 lands; no double-mint.  
STATUS: NEW

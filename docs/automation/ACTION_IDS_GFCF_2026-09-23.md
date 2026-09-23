# Game Feel ACTION_IDs — 2026-09-23

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-09-23.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-a30003fe-91d2-4d87-9e92-5364e41f7163`

Prior IDs `GFCF-2026-08-31-001` … `015` live in `ACTION_IDS_2026-08-31.md`.  
`GFCF-2026-09-01-001` … `003` live in `ACTION_IDS_2026-09-01.md`.  
`GFCF-2026-09-02-001` … `005` live in `ACTION_IDS_GFCF_2026-09-02.md`.  
`GFCF-2026-09-21-001` … `004` are **queued in #363** (not on `main`).  
`GFCF-2026-09-21-005` and `GFCF-2026-09-22-001` … `009` are **queued in #419** (not on `main`).  
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx`, already owned by older still-open PRs (#327, #363, #419).

---

ACTION_ID: GFCF-2026-09-23-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Give enemy and boss self-heals the same green number as player heals  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player `heal()` already `spawnDamageAtTile(..., "heal")` (`WX` 9185–9205; summon-control copy at 15005–15025). Enemy AI self-heal (`WX` 16648–16662) and boss kit heal (`WX` 15889–15904) `updateCombatant` HP and `logBattleEntry` only. HP bar ticks; no canvas number. Distinct from GFCF-014 (`triggerVfx` no-op on the player spell-heal path) and from GFCF-003 (player→enemy damage). Distinct from potion IMPACT (#363 / 09-02-004).  
SYSTEMS_AFFECTED: WorldExploration enemy AI heal branch; boss kit heal branch; existing `spawnDamageAtTile`  
RECOMMENDED_ACTION: After the existing HP write, `spawnDamageAtTile(..., ha, "heal")` at the healer tile. Do not change `hpAfterHeal` math or cooldowns. No extra particles.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-08-31-001  
REGRESSION_RISK: LOW — presentation on an already-committed heal. Do not route through player `heal()` (wrong target / challenge `healUsed`).  
VALIDATION_REQUIRED: Force an in-range enemy self-heal; one green number matching the log; player HP unchanged; no-heal challenges still fail only on player restores. Boss kit heal same.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-23-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Hostile summon spawn needs the same puff + SFX as player summons  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Player `spawnUnit` draws `spawnPixelPuff` and `playSound("spell_cast")` (`WX` 9305–9315). `commitHostileSummon` (`WX` 14922–14975) inserts the combatant and HP map only. A summoner / boss summon spell can add a body with no IMPACT. The 09-22 “summon spawn is a non-hole” note covered the player path only. Distinct from 09-22-007 (lifespan *expiry* float) and from #363 control-walk copy.  
SYSTEMS_AFFECTED: WorldExploration `commitHostileSummon`  
RECOMMENDED_ACTION: On successful `spawnEnemySummonUnit`, reuse the existing one-frame puff + `spell_cast` at the spawn cell. Do not change occupancy / kit / lifespan. Do not add a 1.5s banner.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing `spawnPixelPuff`  
REGRESSION_RISK: LOW — presentation after a successful spawn. Occupied fail still returns with no puff.  
VALIDATION_REQUIRED: Summoner enemy spawns a minion; one puff + SFX; turn insert still `insertAfterId`; failed free-cell still spawns nothing.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-23-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float when the player 30s turn timer expires  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Footer timer already pulses at ≤7s (`BattleUIPanel.tsx` 384–394). Expiry (`WX` 14786–14794) sets `turnEndReasonRef = "timer-expiry"` and `advanceTurnRef.current()` with no canvas copy. The player can read the skip as a mis-tap on End Turn. Distinct from 09-22-009 (optional *start-of-turn* “Your turn” banner) and from 09-02-001 (`WAIT_FOR_TURN_COPY` on off-turn clicks). The enemy AI 5s watchdog (`WX` 16993–16999) also writes `timer-expiry` — **do not** float that path.  
SYSTEMS_AFFECTED: WorldExploration player turn-timer interval only  
RECOMMENDED_ACTION: One short `"Time's up!"` float at the player tile when the 30s (or Time Warp 15s) interval hits 0. Do not pause the next turn. Do not add a 1.5s banner.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: none  
REGRESSION_RISK: LOW if scoped to the player interval. MEDIUM if the enemy watchdog also floats (noise + false “your turn ended” during AI).  
VALIDATION_REQUIRED: Let the player timer hit 0; one float; turn advances once; enemy watchdog expiry stays quiet; End Turn still has no extra float.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-23-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Ice-tile Frozen apply is log-only (same movement RAF as lava)  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Ice branch (`WX` 11454–11467) logs `"You stepped on ice! Slowed!"` and `applyActiveEffect` Frozen (−2 MP, 2 turns) inside the movement-step handler that also writes lava/spikes HP. No canvas float. Distinct from 011 (HP source labels for lava/spikes on that same path) and from 012 (duration digits on existing pills). Ember Knight ignite after melee (`WX` 16789–16803) is log-only too but rides the melee path — leave that under 09-22-001 rather than duplicating.  
SYSTEMS_AFFECTED: WorldExploration movement-step ice branch  
RECOMMENDED_ACTION: One short `"Frozen!"` float at the player tile. **Do not** implement inside the movement RAF without an RAF exemption (same freeze as 011). Prefer extracting the ice apply off the RAF tick first.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-2026-08-31-011 RAF exemption if wired on the current path  
REGRESSION_RISK: MEDIUM if juice is added inside the movement RAF (frame hitch). LOW if the apply is moved off-RAF first.  
VALIDATION_REQUIRED: Step on ice; Frozen pill appears; one float; MP penalty still 2 turns; lava/spikes numbers still wait on 011.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-23-005  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float +10 XP after portal `applyRewards` commits  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Portal transition correctly withholds HUD XP until persist commits (`WX` 6802–6838, `PORTAL_TRANSITION_XP`). After `shouldApplyVictoryLiveHydrate`, it writes `exp` / `level` with no canvas `"+10 XP"` and no sound. Ground Doka on the same exploration loop already has sound + float + log. Distinct from shrine 09-22-003 (300 Doka, no log) and from recap leftover-XP HUD (#108/#138 merged). Do not optimistic-float before commit.  
SYSTEMS_AFFECTED: WorldExploration portal persist `.then` hydrate  
RECOMMENDED_ACTION: After a successful commit + hydrate, one `"+10 XP"` float at the player tile (or reuse `spawnDoka`-style). Skip when death epoch refuses hydrate. Do not change the 10 XP grant or the persist lock.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing persist funnel  
REGRESSION_RISK: LOW if gated on the same `shouldApplyVictoryLiveHydrate` check. Do not float on a failed persist.  
VALIDATION_REQUIRED: Step a legal portal; after commit, one float; HUD leftover matches `applyRewards`; lava-during-flight still does not restore unpenalized XP.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 / 09-22 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan.  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`).  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009.

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf).

## Explicit non-holes from this search

- Flee: confirm dialogs present.  
- End Turn disabled: `title=` explains summon / wait.  
- Rest portal: toast present.  
- Ground Doka: sound + float + log.  
- Map modifiers: log + `MapModifiersPanel`.  
- Challenge HUD: panel fail/on-track chrome.  
- **Player** summon spawn: puff + SFX + log (hostile spawn is 002).  
- Dungeon-chain complete: gold log already names the bonus (`WX` 6374–6376); pickup juice is weaker than shrine (shrine has *no* log) — not a unique NEW ID this run. White gateway line is log-only and acceptable next to that trophy line.  
- Player DoT ticks: already go through `playerTakesDamage` (juice + log).  
- In-battle world-mode portal click: only reachable on `inBattle` / ref desync.  
- Enemy AI 5s watchdog: not a player-facing “time’s up” moment (see 003).

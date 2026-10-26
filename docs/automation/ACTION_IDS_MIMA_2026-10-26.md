# ACTION_IDs — 2026-10-26 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file OPEN 08-31 / 09-01 / 09-02 / 09-21…09-29 / 10-21 / 10-22 / 10-23 / 10-24 / 10-25 items or this file's 001–004. Do not clone **#1062** (Mirror activate / healRecv / Mark×summon / INVINCIBLE_PHASE / INK_VEIL glyphs), **#1012**, **#1035**, **#1040**, **#1042**, **#852** (boss kit Mirror writer), **#858** (MAP_ROTATE `newPositions` landing — 09-22-004), **#965** (BOARD_CLAIM occupancy snap, not AP tax), **#1058** (Midnight Bishop `magicReflectActive` consume), **#1094** (Enthroned Void DAMAGE_IMMUNE + ANCHOR step), **09-22-001**, **09-22-004**, or **09-02-004**. Do not invent Gravity Well / Fog of War, push/pull unwired, or a watch-enemy-cast unlock path.

---

ACTION_ID: MIMA-2026-10-26-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Generic HP phase-2 reads `phase2.hpThreshold` (always 0.0 in defaults) while the guide encodes the boundary on `phase1.hpThreshold`  
CATEGORY: boss phases + damage + death + player feedback  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `checkPhaseTransition` (`useBossSystem.ts` 170–181) fires only when `hpFraction <= config.phase2.hpThreshold`. Every default in `bossDefaults.ts` sets **phase2** `hpThreshold: 0.0` (Pale Archbishop 41–43, Chessboard Lich 558–560, Alabaster 515–517, and the rest of the 19-boss catalogue). The **advertised** boundary lives on **phase1** (Pale Archbishop 0.5 at 33–35; Midnight Bishop 0.4 at 428; Alabaster 0.3 at 508–509; Chessboard Lich 0.5 at 550–552). `BossGuideModal.tsx` 517 / 595 labels Phase 2 as `HP ≤ phase1.hpThreshold`. Admin list chrome prints `Phase 2 @ phase2.hpThreshold` (`AdminDashboard.tsx` 7915) — 0% on a fresh catalog — so admin matches the dead runtime and the guide contradicts both. WX is the only caller (`WorldExploration.tsx` 15397–15404). Exceptions that still phase: Weeping Pawn AI `hp/maxHp <= 0.3` (`useBossAI.ts` 482) and Final Pawn AI `<= 0.1` (`useBossAI.ts` 948) write `phase2Triggered` themselves. Starved Vampire / Twin Monarchs / Enthroned Void intentionally use phase1 `0.01` (mechanic phase-2) — do not “fix” those by blindly switching the reader to phase1. No `checkPhaseTransition` test exists. Distinct from **09-22-001** (kit starves specials *inside* a phase), **10-25-004** (Final Pawn invincible *flag* after its bespoke 10% trigger), **#1058** (Bishop MAGIC_REFLECT consume once phase 2 exists), and **#1094** (Void immunity/anchors, a mechanic phase-2).  
EXPECTED_INTERACTION: When boss HP crosses the documented phase-1 threshold (50% Archbishop, 30% Alabaster, …), `currentPhase` becomes 2, the phase-2 kit/ability set is live, and the guide matches combat. Mechanic-phase bosses (0.01) stay on their puzzle trigger, not a 1% HP race.  
ACTUAL_INTERACTION: Generic HP phase-2 never starts until the boss is already at 0 HP (dead). Phase-2 kits, MERGE_BISHOPS, BOARD_CLAIM, COMBO_REPLAY, BOARD_SHRINK, PAGES_OF_DOOM, and AP_DRAIN_PASSIVE are unreachable on the default catalog. The guide promises a mid-fight phase the runtime cannot deliver.  
SYSTEMS_AFFECTED: boss phases, incoming/outgoing kits, death/victory, Boss Guide, Admin HP% chrome  
RECOMMENDED_ACTION: Point `checkPhaseTransition` at `config.phase1.hpThreshold` (the field the guide and the phase-1 editor already mean), **or** copy those values onto phase2 in defaults and keep the reader. Special-case 0.01 bosses so they do not HP-phase; those stay on #1094 / 004. Tests: Pale Archbishop at 49% HP ⇒ `transitioned: true`; Enthroned Void at 50% ⇒ false; Weeping Pawn AI 30% still promotes. Do not change RAF or damage math.  
AUTONOMY: IMPLEMENT_THRESHOLD_READER_OR_DEFAULTS  
DEPENDENCIES: Coordinate with **#1094** (Void must not start using 1% HP as the immunity break) and **#1058** (Bishop MERGE needs a real phase 2). Distinct from 09-22-001.  
REGRESSION_RISK: HIGH — first time most bosses actually enter phase 2; fights lengthen and phase-2 kits appear. Do not also flip Twin/Void/Vampire to HP-phase.  
VALIDATION_REQUIRED: Unit test on `checkPhaseTransition` per catalog id; playtest Pale Archbishop through 50% and confirm Reflect Shield / minion spawn become eligible after 09-22-001.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-26-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Mirror Sovereign SPELL_MIRROR / COMBO_REPLAY never see the player’s last spell (`mirrorSpellPower` defaults to 0; WX never writes `mirroredSpellBuffer`)  
CATEGORY: boss phases + spells + damage + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applySpellMirror` (`useBossSystem.ts` 975–1002) needs `spellId` / `power` / `range`, stores `mirroredSpellBuffer` + `lastThreeTurnsMirror`, and returns `damageToPlayer = floor(power * 0.9)`. The dispatcher defaults extras to `"unknown"` / `0` / `1` (1643–1648). Mirror Sovereign AI calls `applyBossAbility(BossAbility.SPELL_MIRROR, p)` with **no extras** (`useBossAI.ts` 1213–1221) and then **skips** the ability when `damageToPlayer` is 0. `applyComboReplay` (1005–1031) sums history that only SPELL_MIRROR writes. WX `recordPlayerSpellType` (17015–17034) appends effectType to `playerSpellTypeHistoryRef` for Pacifist only — **zero** `mirroredSpellBuffer` / `lastThreeTurnsMirror` writes. Kit always wins first (`starter-blast`, `bossKits.ts` 551; 09-22-001). Guide (`BossGuideModal.tsx` 183–186) tells the player to “use physical / vary the combo.” Distinct from **10-25-001** / **#852** (player/boss-kit Mirror *token* never activates) and **09-22-004** (dropped same-turn `newPositions`). No SPELL_MIRROR fixture.  
EXPECTED_INTERACTION: Each player spell this fight is recorded; on the Sovereign’s turn, SPELL_MIRROR fires ~90% of that spell’s power back; after three stored turns in phase 2, COMBO_REPLAY dumps the buffer.  
ACTUAL_INTERACTION: The buffer stays empty, SPELL_MIRROR is never selected (0 damage), COMBO_REPLAY logs “no spell memory,” and the player can spam Inferno with no mirrored return.  
SYSTEMS_AFFECTED: Mirror Sovereign, player casts, Pacifist history (parallel, unused here), boss ability damage (10-22-004 shield-yes/RES-no still applies *if* damageToPlayer were > 0)  
RECOMMENDED_ACTION: On successful `resolvePlayerCast`, if the live boss is Mirror Sovereign, append `{ spellId, power: finalDmg or catalog damage, range }` to `bossState.mirroredSpellBuffer` / turn history. AI SPELL_MIRROR should read the last entry instead of extra defaults. Tests: Inferno 24 then AI SPELL_MIRROR ⇒ ~21 to player and history length 1; three turns ⇒ COMBO_REPLAY > 0. Do not change Pacifist `recordPlayerSpellType`.  
AUTONOMY: IMPLEMENT_PLAYER_CAST_BUFFER_THEN_AI_READ  
DEPENDENCIES: **09-22-001** so SPELL_MIRROR can be chosen at all; **001** for phase-2 COMBO_REPLAY. Distinct from 10-25-001 / #852.  
REGRESSION_RISK: MEDIUM — Sovereign becomes actually dangerous to spell-only kits (intended).  
VALIDATION_REQUIRED: Buffer helper unit test; playtest Inferno ×3 then phase-2 replay after 001.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-26-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Chessboard Lich BOARD_CLAIM persists `boardClaimZone` but later player turns never tax AP for standing in the 2×2  
CATEGORY: boss phases + AP + terrain + teleport  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyBoardClaim` (`useBossSystem.ts` 949–972) stores `boardClaimZone` and sets `playerApModifier: -2` **only if the player already occupies the newly rolled 2×2 on the Lich’s turn**. WX applies `playerApModifier` once on the abilityResult path (16042–16045) and merges `newBossState` (16078–16086). Player turn restore (`WorldExploration.tsx` 14346–14365) rebuilds AP from `getPlayerBaseStats` + `getStatModifier(..., "ap")` — **zero** `boardClaimZone` reads in WX. Walking into the zone, destacking onto it (09-02-002), or Swap (08-31-001 / 10-23-003) onto a claimed cell never re-taxes. Guide copy (`BossGuideModal.tsx` 181–182) says “break the claim by dealing damage”; the ability comment says “loses 2 AP if inside it on their turn” — contradictory feedback even if the tax were live. Lich AI only claims in `currentPhase === 2` (`useBossAI.ts` 1141–1148), currently unreachable (001) and kit-starved (09-22-001). This ID is the **missing player-turn consume** of a persisted zone. Distinct from **09-22-004** / **#858** (MAP_ROTATE / MIRROR_INVERT `newPositions` landing tax) and **#965** (claim 2×2 occupancy snap off portal crumbs). No board-claim AP fixture.  
EXPECTED_INTERACTION: While a claim zone is set, player turn start (and landing) inside the 2×2 spends 2 AP or restores to max−2, with a log that matches the guide. Leaving the zone drops the tax. Breaking the claim (product choice: damage the Lich vs waiting for the next shift) is explicit.  
ACTUAL_INTERACTION: Same-turn tax only if the player was already in a freshly rolled 2×2; every later turn is full AP on claimed tiles. MAP_ROTATE’s dropped `newPositions` can even move the player into the zone with no tax.  
SYSTEMS_AFFECTED: Chessboard Lich, AP restore, walk/teleport landing, player feedback  
RECOMMENDED_ACTION: On player turn start, if `boardClaimZone` contains the player cell, subtract 2 AP after restore (floor 0) and log. Optionally re-check after Swap / destack. Align guide text with the tax. Tests: zone (4,4) + player (4,4) at turn start ⇒ AP max−2; player (0,0) ⇒ full AP. Do not change MAP_ROTATE math (#858 / 09-22-004).  
AUTONOMY: IMPLEMENT_CLAIM_ZONE_ON_PLAYER_TURN  
DEPENDENCIES: **001** + **09-22-001** for the Lich to claim. Distinct from 09-22-003 (`playerApModifier` wipe on *ability* drain), 09-22-004, #858, #965.  
REGRESSION_RISK: LOW–MEDIUM — Lich maps tax AP in a 2×2; do not stack with Drain Courage −1 without a playtest.  
VALIDATION_REQUIRED: Restore helper test; playtest after phase-2 actually starts.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-26-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Twin Monarchs death never calls MONARCH_ABSORB; AI absorb is gated on `currentPhase === 2` which HP phase-2 never sets  
CATEGORY: death + boss phases + DoT + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Guide (`BossGuideModal.tsx` 205–206) and `applyMonarchAbsorb` (`useBossSystem.ts` 1325–1365) describe killing one twin: set `monarchAbsorbed` / `monarchKilledFirst`, force phase 2, and (if Dusk died) apply a 5×2 DoT. The **only** call site is Twin AI when `currentPhase === 2 && !monarchAbsorbed` (`useBossAI.ts` 1402–1409), passing `killedMonarch ?? "dawn"` — not the id that actually died. `processCombatantDeath` / `deathPipeline.ts` have **zero** twin / `monarchAbsorbed` hooks; WX grep of those keys is empty outside types. Twin catalog phase1 `hpThreshold` is 0.01 (`bossDefaults.ts` 722–724) so even a 001 reader-swap would not absorb on a mid-HP twin kill. Distinct from **001** (generic HP reader) because the **intended trigger is a twin death**, not 1% HP. Distinct from closed “boss phase × summon death” leftover-HP. **#948** locks Dawn *heal* when `damageToPlayer` is negative — not absorb-on-death. No monarch-death fixture.  
EXPECTED_INTERACTION: When the first Twin combatant dies, the survivor absorbs (phase 2, Dawn-buff or Dusk-DoT as specified) even if HP was still high. Killing them together still works. A leftover player-summon death does not absorb.  
ACTUAL_INTERACTION: Killing Dawn or Dusk is a normal combatant death. The survivor never gains the absorb kit; the fight can end on the first twin if victory treats one boss-id as the encounter. The absorb log never prints.  
SYSTEMS_AFFECTED: Twin Monarchs, death pipeline, phase 2, Dusk DoT, Dawn buff, recap/victory  
RECOMMENDED_ACTION: In `processCombatantDeath` (or the WX death callback) when the dead id is a Twin and the other Twin is still live, call `applyMonarchAbsorb` with the dead side and apply `newBossState` + `dotApplied`. Do not wait for `currentPhase === 2`. Tests: Dawn dies, Dusk live ⇒ `monarchAbsorbed` true, phase 2, no immediate victory; Dusk dies ⇒ Absorbed Shadow DoT on the player. Do not absorb on wolf/summon death.  
AUTONOMY: IMPLEMENT_TWIN_DEATH_ABSORB_HOOK  
DEPENDENCIES: Distinct from 001 (do not use 1% HP as the absorb). Victory must require both twins or the absorb survivor — pick one and test leftover. Do not clone #948.  
REGRESSION_RISK: MEDIUM — Twin fights last longer (intended). A leftover-summon false absorb would be a serious miss — gate on boss id.  
VALIDATION_REQUIRED: Death-pipeline fixture with two twin ids; playtest kill-one-then-the-other vs simultaneous.  
STATUS: NEW  

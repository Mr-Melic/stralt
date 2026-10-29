# ACTION_IDs — 2026-10-29 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file OPEN 08-31 / 09-01 / 09-02 / 09-21…09-29 / 10-21…10-28 items or this file's 001–003. Do not clone **#1280** (kit caster dest = player cell), **#1224** / **#1173** / **#1131** / **#1062** / **#1012** / **#1035** / **#1040** / **#1042** / **#852** / **#858** / **#965** / **#1058** / **#1094** / **#1152** / **#948** / **09-22-001** / **09-22-004** / **09-02-004** / **09-02-006**. Do not invent Gravity Well / Fog of War, push/pull unwired, a watch-enemy-cast unlock path, or shock-tile *walk* ticks (10-27-003 class; consume field is 09-22-004).

This hunt scored leftover **live kit-spell geometry** (every `decide*Action` returns a kit spell first via `pickBossKitSpell(..., new Map())`) plus two ability pairs 10-28 did not score: Dawn's double turn-gate, and Midnight Bishop never instantiating a twin. Kit dest stacking was independently filed as **#1280** during this same 00:00 cron — do not re-file it.

---

ACTION_ID: MIMA-2026-10-29-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Boss kit Chain Lightning / Frost Nova / Lifesteal Nova collapse to a single `playerTakesDamage` and never bounce or splash onto summons or minions  
CATEGORY: boss phases + damage + range + summons + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Kit lore for Void Grandmaster / Starborn / Alabaster is “chain lightning … bouncing twice” (`bossKits.ts` 157–158, 177, 252). Catalog `starter-blast` is `hitsMultiple: true`, `bounces: 2` (`spellData.ts` 69–82). `spell-frost-nova` is `targetType: "area"`, `areaShape: "circle"`, `areaRadius: 2`, `hitsMultiple: true` (525–544). `spell-lifesteal-nova` is AoE drain, `hitsMultiple: true`, `areaRadius: 2` (253–271). WX kit consume for `spellType === "damage" || "drain"` is one `playerTakesDamage(Number(bossSpell.damage))` (`WorldExploration.tsx` 15859–15887) with no `getAoETargets`, no bounce loop, no minion/summon ids. Frost Nova's `debuffStat` still lands on `bossTargetId` (the player, 15907–15928) so the slow is single-target too. Player CL bounce / `hitsMultiple` pack is **10-23-002** / **10-22-002**; those are `resolvePlayerCast`. Boss kit **modifier** skip (Windstorm / Void Mirror / scale / crit) is **10-24-002** — not bounce. Enemy AI kit *does* bounce. Kit dest stacking after this hit is **#1280** — do not fold. No boss-kit bounce fixture.  
EXPECTED_INTERACTION: Kit spells keep their catalog geometry: CL bounces to 2 nearest other hostiles (or player-side summons), Frost Nova / Lifesteal Nova tax the radius. Lore “arcs from star to star” is real.  
ACTUAL_INTERACTION: Opening kit turn is always a single player HP hit (plus a player-only Frost slow). A wolf on the bounce path is untouched. Spreading out does not reduce Nova.  
SYSTEMS_AFFECTED: Void Grandmaster / Starborn / Alabaster / Fetid / Broodmother kits, bounce, AoE, player-summon HP, challenges (Untouchable only sees the player hit)  
RECOMMENDED_ACTION: Route boss kit damage/drain through the same `getAoETargets` + bounce helper as the enemy kit path (or `resolveSpellCast`), still targeting the player as primary. Tests: CL with a wolf 1 tile from the player includes the wolf id; Frost Nova radius 2 includes a minion and does not require 09-22-004 `damageToTargets` if the kit path writes store HP itself. Do not change player CL (10-23-002). Do not restack **#1280** dest into this PR.  
AUTONOMY: IMPLEMENT_SHARED_AOE_HELPER_THEN_KIT_CALL  
DEPENDENCIES: Complements **10-28-001** (ability-path roster); this is the *kit* path and is live today. Distinct from 10-24-002 / 10-23-002 / **#1280**.  
REGRESSION_RISK: MEDIUM — kit CL becomes a pack threat (advertised). Do not bounce onto the boss itself.  
VALIDATION_REQUIRED: Kit CL fixture with player + wolf; playtest Starborn opening blast.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-29-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Twin Monarchs DAWN_BUFF is selected on `currentTurn % 3 === 0` then discarded because `applyDawnBuff` re-gates on unpassed extra default 1  
CATEGORY: boss phases + AP + healing + MP + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `decideTwinMonarchsAction` comment is “buff the player every 3rd turn (canon mechanic)” and already gates `if (currentTurn % 3 === 0)` (`useBossAI.ts` 1425–1434). It then calls `applyBossAbility(DAWN_BUFF, p)` with **no** extra. Dispatcher uses `extra.bossPhase1TurnCount ?? 1` (`useBossSystem.ts` 1680). `applyDawnBuff` returns `{ logMessages: [] }` when `bossPhase1TurnCount % 3 !== 0` (1275–1280). Default 1 always misses, so `buffResult.logMessages.length > 0` is false and the ability is dropped. Guide copy is “One twin buffs the other” (`BossGuideModal.tsx` 201–202) while the implementer buffs the *player* (AP / `damageToPlayer: -10` / mislabelled MP). Live Twin opening is kit `spell-rallying-cry` first (`bossKits.ts` 648) — 09-22-001 starves the Dawn block until that prefer is fixed; the double-gate remains afterwards. **09-02-006** is WX ignoring `damageToPlayer < 0` *if* the heal branch returns — that branch is unreachable until this extra is passed. **#376** is the AP-vs-MP log. **10-27-002** is Resonance *internal* counter with no player-cast writer; Dawn's value is already in `currentTurn` and simply not forwarded. No Dawn extra fixture.  
EXPECTED_INTERACTION: On a 3rd boss turn, Dawn's roll applies (player *or* surviving twin — pick one and match the log/guide). Passing `bossPhase1TurnCount: currentTurn` is enough to reach the existing roll.  
ACTUAL_INTERACTION: The decide fn takes the 3rd-turn branch and then no-ops. No AP, no heal, no MP, no log.  
SYSTEMS_AFFECTED: Twin Monarchs Dawn, AP restore, healing, no_healing challenges (if heal is wired), player feedback  
RECOMMENDED_ACTION: Pass `{ bossPhase1TurnCount: currentTurn }` from the decide fn (or drop the inner `% 3` and trust the AI gate). Then honour 09-02-006 for the −10 HP roll and #376 for the MP line. Tests: `currentTurn === 3` ⇒ non-empty `logMessages` and one of AP/HP/MP payload; `currentTurn === 1` without the AI gate still no-ops if the inner gate is kept. Do not change Dusk DoT. Do not clone Twin death × MONARCH_ABSORB (**10-26-004**).  
AUTONOMY: IMPLEMENT_ONE_EXTRA_PASS  
DEPENDENCIES: **09-22-001** for the ability to be chosen over kit. Distinct from 09-02-006 / #376 / 10-27-002 / **#1280**.  
REGRESSION_RISK: LOW — Dawn starts doing what the 3rd-turn branch already attempted. Heal roll must flip `healUsed` (09-02-006) if product wants no-heal to fail.  
VALIDATION_REQUIRED: `applyBossAbility(DAWN_BUFF, p, { bossPhase1TurnCount: 3 })` has a payload; playtest Twin after kit-prefer is fixed.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-29-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Midnight Bishop TWIN_FLANK / MERGE_BISHOPS never instantiate a second bishop, so opposite-diagonal flank and “burst them before they merge” cannot happen  
CATEGORY: boss phases + occupancy + teleport + summons + player feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Guide (`BossGuideModal.tsx` 153–156): “Two bosses flank from opposite diagonals” / “Burst them before they merge.” Catalogue is a **single** `midnight_bishop` row (`bossDefaults.ts` 340–361) with no twin spawn. `applyTwinFlank` writes `newPositions[`twin_${bossEntry.id}`]` (`useBossSystem.ts` 586–600) — that id is never created. WX does not read `newPositions` (**09-22-004** / **#858**); even after that consume, no combatant has the fabricated key (MAP_ROTATE uses live ids — do not clone that field-drop). Phase-2 `MERGE_BISHOPS` only sets `bishopsMerged` / `magicReflectActive` flags (603–615); `magicReflectActive` has no reader (**#1058** — do not clone). AI still spends even turns on TWIN_FLANK (741–748) for a log line. Distinct from **10-28-001** (empty `allEnemies` roster) — there is no second unit to put in the roster. Distinct from **#1280** (kit dest). No twin-spawn fixture.  
EXPECTED_INTERACTION: Phase 1 has two bishop bodies on opposite diagonals of the player, **or** the guide/log drop “two bosses”. Merge removes or combines those two bodies.  
ACTUAL_INTERACTION: One bishop. Flank is a log. Merge is a flag. Positioning between “them” is impossible.  
SYSTEMS_AFFECTED: Midnight Bishop, occupancy, teleport, merge/phase 2, player feedback  
RECOMMENDED_ACTION: Spawn a real twin (`spawns` + matching id) on the first TWIN_FLANK, then `newPositions[twinId]` can be consumed with MAP_ROTATE. Merge `removeCombatant`s the twin and keeps flags. Or delete flank/merge from the live kit and rewrite the guide. Tests: after flank, two bishop ids exist and the twin cell is the mirror; merge leaves one. Do not fold #1058 reflect into this PR.  
AUTONOMY: IMPLEMENT_TWIN_SPAWN_THEN_POSITION  
DEPENDENCIES: **09-22-001** + **10-26-001** for phase 2 merge. Complements **09-22-004** (consume still required once the id exists). Distinct from 10-28-001 / #1058 / MAP_ROTATE / **#1280**.  
REGRESSION_RISK: MEDIUM — two bodies raise the 19-cap and occupancy (intended if the guide stays). Do not spawn a twin on every even turn (once, then move).  
VALIDATION_REQUIRED: Flank fixture: `spawns.length === 1` or live twin id; playtest Midnight Bishop after kit-prefer is fixed.  
STATUS: NEW  

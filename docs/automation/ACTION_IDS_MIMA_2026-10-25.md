# ACTION_IDs — 2026-10-25 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file OPEN 08-31 / 09-01 / 09-02 / 09-21…09-29 / 10-21 / 10-22 / 10-23 / 10-24 items or this file's 001–005. Do not clone **EBMA-2026-09-01-004** (player `resolvePlayerCast` never writes outbound `debuffStat` — Cursed Wound from the **player bar** is that writer), **#1035** (Exsanguinated `stat: "healing"` vs `healRecv`), **#1040** (`CURSE_ON_HIT` `stat: "all"`), **#1042** (Paper Windstorm miss on melee range 1), **09-22-001** (kit `new Map()` always picks a pool spell), **09-22-004** (same-turn drop of `newPositions` / `damageToTargets` / illusions / larvae / shock tiles), or **09-29-001** (Mark ×2 skip on Poison Arrow / Sacrifice / Swap). Do not invent Gravity Well / Fog of War, push/pull unwired, or a watch-enemy-cast unlock path.

---

ACTION_ID: MIMA-2026-10-25-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Mirror spell never activates a reflect token (player self-cast, Attack Nearest, boss kit)  
CATEGORY: defense + range + targeting + boss kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Catalog Mirror is `targetType: "self"`, `range: 0`, `effectType: "defense"`, `spellType: "damage"`, `apCost: 4` (`spellData.ts` 198–214). `resolvePlayerCast` only calls `ctx.activateMirror()` inside the damage loop after `if (targetEnemy || spell.hitsMultiple)` (`spellEngine.ts` 882, 917–926). A self-tile click has no `targetEnemy` and `hitsMultiple` is false, so the function falls through to `return "cast"` (1027–1028) without activating. `executeCastAttempt` then spends AP because `castResultSpendsAp("cast")` is true (`WorldExploration.tsx` 17149–17162; `challengeCompletion.ts` 330–331). The `playerMirror.ts` helper (10–15) **does** write `"player"` — the consume path on enemy kit (`WX` 16497–16500) is live — but nothing in the player branch calls it. Attack Nearest only forces the caster tile for `self` **heal** (`WX` 17265–17304); Mirror is defense, so it searches a hostile and `isTileCastableLive` rejects range 0 (`targeting.ts` 503–508). Boss kits that advertise Mirror (Midnight Bishop / Void Grandmaster / Chessboard Lich — `bossKits.ts` 359, 177, 551) go through the kit branch (`WX` 15859–16009): `spellType === "damage"` with `damage: 0` skips the HP block; the self-buff block requires `bossSpellType !== "damage"` (15949–15957). `playerMirror.test.ts` only locks the token key, not the self-tile branch. Distinct from 10-24-002 (boss **damage** kit skip of `consumePlayerMirror`) and 09-29-003 (Shield Charm vs Void Mirror **amount**).  
EXPECTED_INTERACTION: Casting Mirror on the player tile (or a boss kit Mirror) writes the `"player"` token that enemy-kit `consumePlayerMirror` already honours; Attack Nearest on a self spell uses the caster tile.  
ACTUAL_INTERACTION: 4 AP is spent, the log never says Mirror is active, and the next enemy single-target spell is never reflected. Boss kit Mirror is a wasted turn.  
SYSTEMS_AFFECTED: Mirror spell, Void Mirror consume, Attack Nearest, boss kits, AP, player feedback  
RECOMMENDED_ACTION: Hoist `isMirror` next to Timestep / Shield (self, no `targetEnemy` required) and call `activateMirror` there. Treat `self` + `effectType === "defense"` like heal in Attack Nearest. For boss/enemy kits, if `spell.isMirror` then `activatePlayerMirror` on that unit (or a boss-side token `consume` on player outbound). Tests: self-tile Mirror ⇒ token set, AP spent; Attack Nearest Mirror ⇒ caster tile; Midnight Bishop kit Mirror ⇒ token, not a no-op turn. Do not change consume rates.  
AUTONOMY: IMPLEMENT_MIRROR_BRANCH_AND_KIT  
DEPENDENCIES: Distinct from 10-24-002 consume skip on boss **damage** kits; that fix still needs an activate writer. Do not clone #1042.  
REGRESSION_RISK: MEDIUM — first time player Mirror actually reflects; do not also reflect AoE (`hitsMultiple` already excluded on consume).  
VALIDATION_REQUIRED: Unit test on resolvePlayerCast self-tile; playtest Mirror then a bishop single-target kit.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-25-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: `healRecv` only scales Blood Mend; potions, Life Drain, and Wisp ignore a live Cursed Wound  
CATEGORY: healing + statuses + potions + summons  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Midnight Bishop / Pale Archivist / others kit `spell-cursed-wound` first (`bossKits.ts` 359, 613–614). Boss/enemy kit apply `debuffStat: "healRecv"` / `0.5` after a damaging kit hit (`WX` 15907–15918, 16594–16605; catalog `spellData.ts` 459–478). `getStatModifier` matches that key (`statusEffects.ts` 53). The **only** `healRecv` reader is the player self-heal branch (`spellEngine.ts` 654–663). Health / Greater potions add raw `maxHp * 0.3/0.7` (`WX` 3557–3574). Life Drain restores `round(finalDmg * drainPercent)` with no `getEffectiveStat("player", "healRecv")` (`castHelpers.ts` 473–487). Wisp / summon-AI heal is `summonCtx.heal(targetId, healAmount)` (`summonExecutor.ts` 183–188) and the player `heal` callback writes HP without the modifier (`WX` 9186–9206). No `healRecv` test exists. Distinct from **EBMA-004** (player outbound Cursed Wound never applied — kits **do** apply it inbound), **#1035** (Exsanguinated writes `stat: "healing"`, so it never reaches this consumer even for Blood Mend), and **09-23-004** (Iron Curse map-modifier ×0.5 never applied).  
EXPECTED_INTERACTION: Any player HP restore (Blood Mend, potion, Life Drain, Wisp) multiplies by `getStatModifier("player", "healRecv")` while Cursed Wound is active.  
ACTUAL_INTERACTION: Blood Mend is halved; a potion / Drain / Wisp still restores full HP and the Cursed Wound log (`-50% HEALRECV`) is a lie for those paths.  
SYSTEMS_AFFECTED: Cursed Wound, Blood Mend, BuffShop potions, Life Drain, summon healer, challenges (`healUsed` still flips on potions/Drain)  
RECOMMENDED_ACTION: Extract `applyPlayerHeal(amount)` that multiplies by `healRecv` (and, separately, Iron Curse 09-23-004 if that lands in the same helper). Call it from the self-heal branch, potion cases, drain restore, and player-target summon `heal`. Tests: `healRecv` 0.5 × potion 30% and Drain 9 ⇒ half; Blood Mend regression. Do not change `healUsed` recording.  
AUTONOMY: IMPLEMENT_SHARED_PLAYER_HEAL  
DEPENDENCIES: Do not fold #1035 key remap into this; after #1035, Exsanguinated would start hitting Blood Mend only unless this helper exists. Distinct from 10-21-008 (SP on Blood Mend).  
REGRESSION_RISK: MEDIUM — in-battle potion/Drain/Wisp become weaker under Cursed Wound (intended).  
VALIDATION_REQUIRED: Fixture table Blood Mend / potion / Drain / Wisp with `healRecv` 0.5; playtest Midnight Bishop then a Health Potion.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-25-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Mark ×2 is only in `calculatePlayerDamage`; summon kit / `enemyTakesDamage` never read or consume the tile  
CATEGORY: mark + summons + damage  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player Mark writes `markedTilesRef` (`WX` 9403–9404; `spellEngine.ts` 928–935). Outbound player damage ×2 **and** deletes the key only inside `computeDamage` / `calculatePlayerDamage` (`WX` 3331–3335, 3390–3393), which `resolvePlayerCast` uses (991–998). Controlled kit goes through `resolveSpellCast` then `dealDamage` → `enemyTakesDamage` (`WX` 9849–9182, 3472–3517) with no `markedTilesRef` read. Summon AI `applyCast` / `applyMelee` is the same `dealDamage` (`summonExecutor.ts` 164–166, 226). DoT ticks also use `enemyTakesDamage` (1973–1976) — those should **not** consume Mark (description is “next spell on that tile”). No Mark test exists (`markedTilesRef` has zero test hits). Distinct from **09-29-001** (Poison Arrow / Sacrifice / Swap skip ×2 on the **player** resolver) and **10-21-007** (Mark consumed before `applyDamageToEnemy` recalc on the player path).  
EXPECTED_INTERACTION: A marked tile doubles the next **player-side spell or kit hit** on that cell (control or AI) and then clears; DoT ticks do not consume it.  
ACTUAL_INTERACTION: Only a later `resolvePlayerCast` damage-loop spell pays ×2. A wolf Strike on the marked cell deals 1× and leaves the mark for the player.  
SYSTEMS_AFFECTED: Mark, controlled summons, summon AI, `enemyTakesDamage`  
RECOMMENDED_ACTION: Extract `consumeMarkMultiplier(cell)` used by `calculatePlayerDamage` **and** by `enemyTakesDamage` when `casterId` is the player or a player-side summon (not `"dot"`). Tests: mark tile + wolf kit ⇒ 2× and key gone; DoT tick ⇒ 1× and key stays; player Inferno still 2×. Do not change Mark’s Windstorm miss (inside the damage loop — not this ID).  
AUTONOMY: IMPLEMENT_SHARED_MARK_CONSUME  
DEPENDENCIES: Distinct from 09-29-001 / 10-21-007. Pairs cleanly with 10-24-001 if kit damage is routed through one outbound helper.  
REGRESSION_RISK: LOW–MEDIUM — summon DPS on marked tiles increases (intended).  
VALIDATION_REQUIRED: Helper unit test; playtest Mark then controlled Strike.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-25-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Final Pawn `INVINCIBLE_PHASE` logs “impervious to all damage” but incoming HP never reads `invincibleTurnsLeft`  
CATEGORY: boss phases + damage + death + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyInvinciblePhase` writes `invincibleTurnsLeft: 5` and logs “INVINCIBLE for 5 turns” (`useBossSystem.ts` 786–798). Final Pawn AI, after the kit pick, can skip with `logMessage: "The Final Pawn waits, impervious to all damage."` and decrement the flag (`useBossAI.ts` 976–989). `castHelpers.ts` **does** honour sibling flags `shellArmorActive` / `reflectShieldActive` (353–375). Grep of `WorldExploration.tsx` + `enemyTakesDamage` + `applyDamageToEnemy` finds **zero** `invincibleTurnsLeft` reads — Strike / Inferno / DoT / summon kit still cut HP. Kit `new Map()` always returns `physical_attack` first (`useBossAI.ts` 38–54, 932–945; `bossKits.ts` 446) so the phase-2 trigger (947–973) is currently unreachable — that unreachability is **09-22-001**. This ID is the missing **damage gate** once the flag can be set (empty pool, or 09-22-001 fixed). Distinct from 09-29-003 (Reflect Shield amount vs Shield Charm) and 10-24-002 (boss kit damage modifiers). No invincible fixture.  
EXPECTED_INTERACTION: While `invincibleTurnsLeft > 0`, player-side HP commits against that boss are 0 (or blocked before death), matching the log and guide. Ghosts remain hitable.  
ACTUAL_INTERACTION: The flag is flavour; the pawn can be killed during the announced window.  
SYSTEMS_AFFECTED: Final Pawn phase 2, incoming damage, death, recap, player feedback  
RECOMMENDED_ACTION: In `applyDamageToEnemy` / `enemyTakesDamage` when `hitTarget` is the Final Pawn and `bossState.invincibleTurnsLeft > 0`, skip HP (log a blocked line). Do not skip ghost minions. Tests: flag 5 + Strike ⇒ HP unchanged; flag 0 ⇒ damage lands. Coordinate with 09-22-001 so the trigger can fire.  
AUTONOMY: IMPLEMENT_INVINCIBLE_DAMAGE_GATE  
DEPENDENCIES: **09-22-001** to make the trigger reachable on this HEAD (kit always wins). Distinct from Reflect Shield / Shell Armor consumers already in `castHelpers`.  
REGRESSION_RISK: MEDIUM — Final Pawn fights last 5 extra turns once both this and 09-22-001 land; do not also zero ghost HP.  
VALIDATION_REQUIRED: Fixture on `applyDamageToEnemy` with `invincibleTurnsLeft`; playtest after kit-cooldown fix.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-25-005  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Pale Archivist `INK_VEIL` glyphs never trigger `GLYPH_TRAP` on player attack, walk, or summon  
CATEGORY: boss phases + targeting + hazards + summons  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyInkVeil` stores `glyphedTiles` on `newBossState` (`useBossSystem.ts` 1131–1166). WX **does** merge `res.newBossState` (16078–16086), so the tiles can persist. `applyGlyphTrap` deals 15 to the player when the attacked cell matches (`1221–1242`). `useBossAI.ts` never calls `BossAbility.GLYPH_TRAP` (Pale Archivist 1313–1363 only INK_VEIL / SCROLL / PAGES / kit). `WorldExploration.tsx` has **zero** `glyphedTiles` / `GLYPH_TRAP` reads — `resolvePlayerCast`, walk hazards (11423–11478), and summon `dealDamage` never consult the set. Boss guide copy says “Trigger them with summons or by luring enemies into them” (`BossGuideModal.tsx` 197–198); the ability comment says “when player attacks an invisible boss tile.” Kit `new Map()` currently starves INK_VEIL (**09-22-001**); this ID is the **missing subsequent-turn consume**, not a same-turn dropped field (**09-22-004** is `newPositions` / `damageToTargets` / larvae / shock). No glyph fixture.  
EXPECTED_INTERACTION: After INK_VEIL, a player (or player-summon) attack or step on a glyphed tile deals the documented 15, removes that glyph, and is understandable in the log.  
ACTUAL_INTERACTION: Glyphs are state-only; attacks and walks treat those cells as ordinary floor.  
SYSTEMS_AFFECTED: Pale Archivist, targeting, walk hazards, summons, challenges (Untouchable / under-N if 15 is skipped)  
RECOMMENDED_ACTION: On player/summon damage to a cell in `glyphedTiles` (or on landing), call `applyGlyphTrap` / inline the 15 through `playerTakesDamage` + `recordChallengeDamageTaken`, then drop that glyph. Tests: seeded glyph at (4,4) + Strike there ⇒ player HP −15 (after RES/shield policy you choose) and glyph gone; adjacent floor Strike does not. Do not change INK_VEIL placement counts.  
AUTONOMY: IMPLEMENT_GLYPH_CONSUME_ON_HIT_OR_LAND  
DEPENDENCIES: **09-22-001** to place glyphs in a live kit fight. Distinct from 09-22-004 same-turn drops and 09-02-004 VOID_TILES cosmetic hazards.  
REGRESSION_RISK: MEDIUM — Pale Archivist becomes actually dangerous on glyph cells; do not also block LoS unless product asks.  
VALIDATION_REQUIRED: Ability+WX helper test; playtest after kit-cooldown fix.  
STATUS: NEW  

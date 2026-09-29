# ACTION_IDs — 2026-09-29 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file still-OPEN prior items (`MIMA-2026-08-31-001/002/005/008`, `MIMA-2026-09-01-002/006`, `MIMA-2026-09-02-002/003/004/005/006`, `MIMA-2026-09-21-001/002/003/004`, `MIMA-2026-09-22-001/002/003/004`, `MIMA-2026-09-23-001/002/003/004`, `MIMA-2026-09-24-001/002/003/004`, `MIMA-2026-09-25-001/002/003/004`, `MIMA-2026-09-26-001/002/003/004`, `MIMA-2026-09-27-001/002/003/004`, `MIMA-2026-09-28-001/002/003/004`). Frozen AI / execute, Wisp / Drain `healUsed`, Challenge HUD, Boss Rush feats, and Attack Nearest **origin** stay closed. Do not clone **#327** / **#331** / **#336** / **#370** / **#376** / **#379** / **#380** / **#382** / **#386** / **#389** / **#391** / **#410** / **#443** / **#467** / **#476** / **#487** / **#489** / **#491** / **#495** / **#496** / **#498** / **#508** / **#524** / **#541** / **#543** / **#546** / **#547** / **#550** / **#551** / **#553** / **#554** / **#555** / **#566** / **#576** / **#595** / **#596** / **#597** / **#598** / **#599** / **#601** / **#602** / **#604** / **#606** / **#607** / **#608** / **#617** / **#671** / **#706** / **#709** / **#714** / **#728** / **#734**.

HEAD is unchanged since the 09-21…09-28 matrices. These IDs are consume joins that were never filed: Mark × DoT/Sacrifice, Fury Potion × early-return damage, Shield Charm × unit/boss reflect, and map modifiers carrying into Boss Rush.

---

ACTION_ID: MIMA-2026-09-29-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Mark ×2 only applies and consumes inside calculatePlayerDamage — Poison Arrow, Sacrifice, and Swap neither double nor spend the mark  
CATEGORY: spell discovery + damage + statuses + summons  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Mark copy is “Mark target tile — next spell on that tile deals x2 damage” (`spellData.ts` 161–163). `placeMark` writes `markedTilesRef` (`WorldExploration.tsx` 9403–9404). `computeDamage` doubles when the **clicked** `gridPos` key is marked (3331–3335); `calculatePlayerDamage` then **deletes** that key (3371–3393). `resolvePlayerCast` only reaches that helper from the main damage loop (`spellEngine.ts` 990–1015). Live early-returns never call it: Poison Arrow (`isDotSpell`, `spellData.ts` 50–63) applies catalog `dotDamagePerTurn: 4` and returns (`spellEngine.ts` 777–814); Sacrifice deals `hpLoss * 3` via `ctx.dealDamage` → `enemyTakesDamage` (749–763, WX 9171–9183); Swap copies coords (767–774). A Mark then Poison Arrow leaves the tile marked and the DoT at 4; a later Strike still gets ×2. No test asserts DoT/Sacrifice/Swap vs `markedTilesRef`. Distinct from 09-23-001 (Glass/Titans `onDamageDealt` funnel). Distinct from Pacifist × summon (09-02-005).  
EXPECTED_INTERACTION: The next **spell** that resolves on the marked tile either applies ×2 (and consumes the mark) or the copy is narrowed to “next damaging Strike-like hit.” Poison Arrow and Sacrifice are player spells targeting that tile.  
ACTUAL_INTERACTION: Only `calculatePlayerDamage` consumers (Strike, Attack Nearest through `executeCastAttempt`, Chain Lightning primary) apply and consume. DoT/Sacrifice/Swap ignore the mark.  
SYSTEMS_AFFECTED: Mark, Poison Arrow / Inferno DoT, Sacrifice, Swap, damage funnel, player feedback  
RECOMMENDED_ACTION: One consume helper `applyAndConsumeMark(gridPos, dmg)` used by `calculatePlayerDamage`, Sacrifice `dealDamage`, and the DoT apply (×2 `dotDamagePerTurn` or a doubled first tick). Swap should consume if product treats it as “a spell on that tile,” otherwise leave the mark. Do not change the ×2 formula. Tests: Mark + Poison Arrow ⇒ 8/turn **or** mark gone; Mark + Sacrifice ⇒ ×2 of `hpLoss*3` and mark gone; Mark + Strike still ×2 once.  
AUTONOMY: IMPLEMENT_HELPER_THEN_EARLY_RETURN_SITES  
DEPENDENCIES: None. Do not fold Glass/Titans (09-23-001) or Fury (002) into the same PR unless the shared funnel is extracted first.  
REGRESSION_RISK: LOW — Strike / Attack Nearest must still consume once; bounce already uses `finalDmg` from the marked primary (`castHelpers.ts` 448).  
VALIDATION_REQUIRED: Helper unit around `markedTilesRef`; playtest Mark → Poison Arrow → Strike.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-29-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Fury Potion +25% only multiplies the resolvePlayerCast damage loop — Sacrifice, summon kit/melee, and player DoT ticks stay 1×  
CATEGORY: damage + summons + statuses + healing  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Shop copy is “+25% damage for 3 turns” (`BuffShop.tsx` 76–77). WX comments “all player damage is multiplied by 1.25” (`WorldExploration.tsx` 1590–1591, apply at 3587–3589). The only multiply is `furyMultiplier` on `preCritDmgBM` inside the damage loop (`spellEngine.ts` 894–898). Attack Nearest goes through `executeCastAttempt` so it **does** get Fury. Sacrifice returns before that loop (`dealDamage` 756). Player-side summon kit (`summonExecutor.ts` 164–166) and melee (221–226) call the same `dealDamage` → `enemyTakesDamage` with catalog/atk numbers. Poison Arrow DoT ticks go through `processActiveEffects` → `enemyTakesDamage` with stored `dotDamagePerTurn` (WX 1973–1978). No test references `isFuryActive`. Distinct from Blood Moon (same multiply site; memories: do not re-file Blood Moon as “all damage” flavour). Distinct from 09-23-001 (registry `onDamageDealt` on `enemyTakesDamage` — Sacrifice/summon **do** get Glass if that hook is later wired; they still miss Fury).  
EXPECTED_INTERACTION: A paid “+25% damage for 3 turns” multiplies player-attributed HP loss: Strike, Attack Nearest, Sacrifice, summon kit/melee, and player-applied DoT ticks. Or the copy says “your spells’ initial hits.”  
ACTUAL_INTERACTION: Only the spellEngine damage-loop initial hit. Summon kills and Sacrifice under Fury deal the unbuffed number.  
SYSTEMS_AFFECTED: Fury Potion, Sacrifice, summons, DoT, damage funnel, player feedback  
RECOMMENDED_ACTION: Apply `furyMultiplier` (and keep it next to Blood Moon if product wants both) in a single `scalePlayerOutgoingDamage(amount)` used by the damage loop, `dealDamage` when `casterId === "player"`, and DoT apply-time **or** tick-time. Do not change the 1.25 or the 3-turn decrement. Tests: Fury on + Sacrifice 20 HP loss ⇒ 75 not 60; wolf melee with Fury ⇒ ×1.25; Poison Arrow tick with Fury ⇒ 5 (floor 4×1.25). Do not fold Mark (001) unless sharing the outgoing helper.  
AUTONOMY: IMPLEMENT_ONE_SCALE_HELPER_THEN_DEALDAMAGE  
DEPENDENCIES: None. Distinct from 09-21-003 (Striker × summon AI). Distinct from 09-02-005 (Pacifist).  
REGRESSION_RISK: MEDIUM — DoT ×1.25 every tick is stronger than apply-once; pick one and match the log. Enemy `dealDamage` must stay 1×.  
VALIDATION_REQUIRED: Helper tests; playtest Fury + wolf and Fury + Sacrifice.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-29-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Shield Charm absorbs playerTakesDamage hits, but Void Mirror family reflect and boss Reflect Shield write HP raw  
CATEGORY: damage + statuses + boss phases + challenges + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Charm copy is “Absorbs next 20 damage” (`WorldExploration.tsx` 3583–3585). Absorb lives only in `playerTakesDamage` (3433–3438). Void Mirror (`family === "void_mirror"`, live spawn `spawnPolicy.ts`) reflects `floor(preCritDmgBM * 0.25)` with `setCharacterStats` HP subtract (`castHelpers.ts` 335–345). Boss Reflect Shield is **not** kit-blocked: `useBossAI` phase 2 calls `applyBossAbility(REFLECT_SHIELD)` (185–191); `applyReflectShield` returns `newBossState.reflectShieldActive: true` (`useBossSystem.ts` 208–217); WX merges `res.newBossState` (16080–16085). Execute then reflects `floor(finalDmg * 0.3)` the same raw way (`castHelpers.ts` 362–375). `onPlayerReflectedDamage` **does** record challenge totals (tests in `castHelpers.reflect.test.ts` 96+) so Untouchable fails — Shield Charm is the remaining hole. Distinct from 09-27-002 (lava/spikes/Thorned/Void Rift **walk** / map-modifier Mirror Field 20% in WX `mirrorFieldReflect` 9538–9561). Distinct from 09-28-003 (enemy drain **heal** after absorb). Distinct from 09-22-001 (kit `new Map()` — this ability path is `useBossAI`, not `pickBossKitSpell`).  
EXPECTED_INTERACTION: “Absorbs next 20 damage” covers reflected HP the same way it covers Strike and DoT. Challenge totals already follow residual; shield HP should too.  
ACTUAL_INTERACTION: Spell/DoT/melee soak; Void Mirror 25% and Reflect Shield 30% punch through to live HP.  
SYSTEMS_AFFECTED: Shield Charm, Void Mirror family, boss Reflect Shield, challenges (totals already recorded), player feedback  
RECOMMENDED_ACTION: Route both reflects through `playerTakesDamage` (or the shared `absorbShieldThenHp` from 09-27-002) and keep `onPlayerReflectedDamage` on the **residual**. Tests: shield 20 + Void Mirror reflect 10 ⇒ player HP 0 change, shield 10 leftover; shield 5 + Reflect Shield 12 ⇒ player −7, shield 0. Do not change 0.25 / 0.3.  
AUTONOMY: IMPLEMENT_ONE_REFLECT_THROUGH_PLAYERTAKESDAMAGE  
DEPENDENCIES: Share soak helper with 09-27-002 if that lands first — union, do not concatenate two `playerTakesDamage` wrappers. Do not clone **#382** Shell Armor.  
REGRESSION_RISK: LOW if residual still feeds `onPlayerReflectedDamage`; MEDIUM if double-counting challenge damage.  
VALIDATION_REQUIRED: Extend `castHelpers.reflect.test.ts` with a `shieldHp` sink; playtest charm vs Void Mirror.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-29-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Map modifiers persist into Boss Rush (never re-rolled or cleared) while room-clear Doka skips applyRewardMultiplier  
CATEGORY: boss phases + dungeons + portals + rewards + statuses + hazards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `setActiveMapModifierTypes` has **one** writer: portal-transition `rollActiveModifiers` (`WorldExploration.tsx` 6646–6654). Boss Rush **entry** (`portal.isBossRushPortal`, 6074–6089) and **room-advance** (6095–6110) `cleanupMap` + `spawnBossRushRoom` then `return` — they never roll or `setActiveMapModifierTypes(new Set())`. `spawnBossRushRoom` (5288–5316) only `generateRandomMap` + `placeBossRushSpawns`. `cleanupBattle` / `cleanupMap` do not touch the modifier set. Combat hooks still read it (Plague 14313, Frozen MP 7016, Void Rift walk, Arcane Surge AP). Independently, `handleBossRushRoomClear` builds `totalDoka = defeatedList.length * max(5, floor(level*1.5))` (12748–12753) and never calls `mapModifierRegistry.applyRewardMultiplier`. Overworld `handleBattleEnd` does (12420–12427). 09-24-004 listed shrine / ground / dungeon-complete / challenge as the 1× Fever leftovers; it did not list this kill-Doka funnel (victory gate never enters `handleBattleEnd` during a run). White sanctuary / rest portals (6115+) also skip the roll — rest has no fight, so the live combat join is Boss Rush. No test asserts modifiers empty on `spawnBossRushRoom` or Fever 2× on room-clear Doka.  
EXPECTED_INTERACTION: Entering Boss Rush either rolls a fresh modifier set for that room **or** clears overworld modifiers and documents “Rush is unmodified.” If Fever (or any reward multiplier) is live in the fight, room-clear kill Doka uses the same `applyRewardMultiplier` as `handleBattleEnd`.  
ACTUAL_INTERACTION: The last overworld portal’s modifiers (Plague, Frozen, Fever announce, Time Warp 15s, …) ride every Rush room. Fever 2× still would not apply to room-clear Doka even when the chip is showing.  
SYSTEMS_AFFECTED: map modifiers, Boss Rush spawn/advance, portals, rewards (Fever / chain), hazards seeded only on the overworld roll path, player feedback (MapModifiersPanel)  
RECOMMENDED_ACTION: In `spawnBossRushRoom` (and white/rest if product wants a clean sanctuary), `setActiveMapModifierTypes(new Set())` **or** `rollActiveModifiers` once per room. If modifiers stay, call `applyRewardMultiplier` on `totalDoka` before `buildBossRushPersistInput`. Do not change room `dokaPerEnemy` or `completeBossRushRoom(0,0)`. Tests: after boss-rush portal, active ids empty **or** equal a fresh roll (not the previous overworld set); Fever + 2 kills ⇒ room-clear Doka 2× the unfevered formula.  
AUTONOMY: IMPLEMENT_ONE_CLEAR_OR_ROLL_THEN_OPTIONAL_FEVER  
DEPENDENCIES: Distinct from 09-24-004 (those credits are not kill Doka). Distinct from closed Boss Rush **feats**. Do not clone **#331** portal destack.  
REGRESSION_RISK: MEDIUM — clearing modifiers mid-Rush after room 0 already fought under Plague must not tick twice; rolling per room changes Rush difficulty. Prefer clear-on-entry unless design wants Rush modifiers.  
VALIDATION_REQUIRED: Unit around spawnBossRushRoom modifier set; playtest enter Rush from a Frozen/Fever map.  
STATUS: NEW  

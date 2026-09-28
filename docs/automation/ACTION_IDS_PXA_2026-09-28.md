# ACTION_IDs — 2026-09-28 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-09-28.md`](./PX_COHERENCE_AUDIT_2026-09-28.md)

Prior PX records remain **open** unless noted. Do not re-file:

- `PXA-2026-08-31-001` … `015` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (006 HUD hide is done)
- `PXA-2026-09-01-001` … `003` in [`ACTION_IDS_2026-09-01.md`](./ACTION_IDS_2026-09-01.md)
- `PXA-2026-09-02-001` and `PXA-2026-09-02-003` in [`ACTION_IDS_PXA_2026-09-02.md`](./ACTION_IDS_PXA_2026-09-02.md) (002 HUD is done)
- `PXA-2026-09-21-001` … `003` (PR **#343**)
- `PXA-2026-09-22-001` … `003` (PR **#393** — FAIL×Windstorm, summon 10× tag, challenge HUD clicks)
- `PXA-2026-09-23-001` … `003` (PR **#481** — silent Boost ×1.5, HP pots vs 1:3, idle regen)
- `PXA-2026-09-24-001` … `003` (PR **#529** — Board kills, betrayal 6×, portal-verb overload)
- `PXA-2026-09-25-001` … `003` (PR **#579** — hidden Doka lottery, recap challenge name, `maxSpellRange` 5)
- `PXA-2026-09-26-001` … `003` (PR **#632** — flat challenge predicates, one-sided map events **including Vampiric throwaway**, player sheet SR)
- `PXA-2026-09-27-001` … `003` (PR **#691** — unread AP/MP/HP cadence, Inferno silent CD, hit-log SP vs math SR). Inferno copy is also queued in **#696** — do not twin.

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21…09-27 audits. New IDs are new *reads* of the same bytes (inverted leader-crown rule + dead boost knobs; default-bar / default-win feat stamps; post-mod HP vs pre-mod float).

---

ACTION_ID: PXA-2026-09-28-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Leader crown must teach erratic-on-leader-death, not ally-death stacking  
CATEGORY: enemies  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: The crown **mark** is live: battle start sorts enemies by level and sets `leaderEnemyIdRef` (`WorldExploration.tsx` 12010–12015), paints 👑 on the canvas name (`8107–8110`), and flags the initiative chip (`InitiativeStrip.tsx` 372–388). The chip `title` is “Leader — gains strength from ally deaths” (385). That sentence is false. `shouldApplyLeaderDeathBoost` returns true only when `deadId === leaderId` (`deathPipeline.ts` 68–76) — grunt / minion / player-summon deaths must not flip the flag (comment 61–66). On leader death the pack logs “[Leader died] Enemies acting erratically!” and takes random adjacent steps (`WX` 15507–15530). `setLeaderBoostMultiplier((prev) => Math.min(prev + 0.25, 2.0))` runs at `WX` 9050; the state is `_leaderBoostMultiplier` (`1697`) with **zero readers**. Admin GameConfig “Leader Boost per Death (%)” (`AdminDashboard.tsx` 6267–6285, validated 0–100 in `adminSafety.ts` 541–542, default 10) is loaded as `leaderBoostPercent` (`WX` 2293–2294) and passed into `castHelpers`, which binds it `_leaderBoostPercent` and never uses it (`castHelpers.ts` 297–298). Comment at `WX` 1695 still says the system arms “when 3+ enemies present”; designation has no pack-size gate. Prior PX audits KEEP’d the crown tell and never read the tooltip. Betrayal 6× stays 09-24-002. `leader_slayer` as a default-win stamp stays 09-28-002.  
SYSTEMS_AFFECTED: enemies, AI, visual feedback, admin-enabled content, achievements (crown meaning), terminology  
RECOMMENDED_ACTION: REWORK copy; DEPRECATE the dead knobs until a reader exists. Set the strip / inspect title to the live rule: the highest-level unit is the leader; when **that** unit dies, remaining hostiles act erratically for a short window. Keep the crown mark. Do not implement ally-death stacking. Delete or hide `leaderBoostPercent` and `_leaderBoostMultiplier` (or wire one of them to a named, announced multiplier — HUMAN). Do not invent a second “boost” language next to betrayal 6×.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT the tooltip / inspect sentence + a unit test that grunt death does not claim “leader boost.” HUMAN_DESIGN_REQUIRED to turn the unused % into a real stat or to drop the admin field from GameConfig.  
DEPENDENCIES: PXA-2026-09-28-002 (feat predicate). PXA-2026-08-31-007 (one enemy poster). PXA-2026-09-24-002 (do not fold erratic into betrayal). Does not close 007.  
REGRESSION_RISK: LOW for tooltip-only. HIGH if ally-death stacking is bolted on (new damage table, fight with unread multiplier). MEDIUM if `leaderBoostPercent` is deleted while a live canister still returns the field — keep Candid, stop teaching it. Do not restack the enemy-turn erratic block while open WX combat PRs own that path.  
VALIDATION_REQUIRED: Hover the crown: sentence matches erratic-on-leader-death. Kill a grunt: no “gains strength” float, no multiplier change that combat reads. Kill the crowned unit: remaining hostiles take the erratic walk; `leader_slayer` still only if that id died (predicate rewrite is 002). Admin Leader Boost slider either matches a live hook or is labeled unused. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-28-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Spell Master and Leader Slayer must not stamp the default first bar / first clear  
CATEGORY: achievements  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `spell_master` / `spell_master_8` is “Have 8 spells equipped at once.” (`admin.mo` 322). Hydrate with no saved bar does `ownedSpells.slice(0, 8)` (`WorldExploration.tsx` 2615–2617). The book is the full innate `starterSpells` set (`WX` 2395–2406). An idle effect then `checkAndFireAchievement("spell_master_8")` when `activeSpells.length >= 8` (`3635–3636`). Victory also pushes the condition when `spellBarCount >= 8` (`victoryAchievements.ts` 34). That is a stamp for the default loadout, not a mastery of the 8-slot commitment. `leader_slayer` is “Kill a leader enemy.” (`admin.mo` 317). Every battle designates a leader (`WX` 12010–12015). A win clears all hostiles, so `battleLeaderSlainRef` is true on a normal clear (`9046–9047`, `victoryAchievements.ts` 40). `first_battle_win` is already unconditionally queued on every victory (`victoryAchievements.ts` 30). Two feats therefore pay for showing up. PXA-001 owns shrinking the gifted book. PXA-009 owns offer/overlap of Pacifist / crit / jackpot / betrayal RNG — it did not name these two default-complete rows. `deathPipeline` already stopped crediting the feat on the first grunt kill (comment 61–66); the remaining hole is “every pack has a crown.”  
SYSTEMS_AFFECTED: achievements, spells, enemies, rewards, visual feedback, spell discovery  
RECOMMENDED_ACTION: REWORK the predicates (not only the copy). Spell Master: require a **player-chosen** 8-slot bar that is not the hydrate `slice(0, 8)` (e.g. persist a `barEdited` flag, or require 8 owned **non-innate** ids once PXA-001 exists). Leader Slayer: require killing the crowned unit **before** the rest of the pack, or while 2+ hostiles still live, or drop the feat until the crown teaches a real focus-fire ask (09-28-001). Do not add a third Doka faucet. Do not hide the 8-slot bar. Spectator jackpot/betrayal stay PXA-009.  
AUTONOMY: HUMAN_DESIGN_REQUIRED for the replacement asks. ORCHESTRATOR_MAY_DRAFT to stop offering / unlocking `spell_master_8` until `setSpellBarOrder` has been called by the player, and to stop `leader_slayer` when the leader is the last living hostile.  
DEPENDENCIES: PXA-2026-08-31-001 (gifted book). PXA-2026-08-31-009 (feat vs challenge). PXA-2026-09-28-001 (crown meaning). Does not close 001 or 009.  
REGRESSION_RISK: MEDIUM — veterans who already claimed the 100/150 Doka must not be stripped; gate **new** unlocks only. LOW if only the idle `spell_master_8` fire is removed and victory still requires an edited bar. HIGH if `setSpellBarOrder` of the default first-8 is treated as “player chose.”  
VALIDATION_REQUIRED: New profile, never opens the spellbook: Spell Master locked. Player rearranges the bar to 8 ids: unlocks once. 1v1 pawn: Leader Slayer locked (or not offered). 4-pack, crown dies first, two live: unlocks. First Blood still unlocks on the first win. `pnpm typecheck`. Recap feat list uses the same predicates.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-28-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Damage floats and dealDamage must report the chip that actually left the HP bar  
CATEGORY: visual-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `enemyTakesDamage` computes RES, then `_dmgAfterMods = mapModifierRegistry.applyDamageDealt(...)` (`WorldExploration.tsx` 3499–3516). HP uses `_dmgAfterMods` (`3517–3522`). `spawnDamageAtTile` and `return` use the **pre-mod** `dmg` (`3524–3538`). Titan’s Vigor `onDamageDealt` returns `damage * (1..5)` (`mapModifiers.ts` 311–315). Glass Realm returns `damage * 2` (345–346) and announces “all damage doubled, dealt and taken” (339). On those maps the bar and the float disagree. Player `dealDamage` calls `enemyTakesDamage` then `return amount` (`WX` 9176–9183), so spellEngine / bounce logs also keep the pre-hook number (`castHelpers.ts` 448–458 bounce uses its own pre-mod `bounceDmg` then the helper’s lying return). DoT logging treats the return as `postResDamage` (`WX` 1973–1991). This is not “juice missing”: `enemyTakesDamage` already shakes and floats (GFCF-003 owns the **other** path, `applyDamageToEnemy`, which never calls EffectsManager). This is not Vampiric’s throwaway attacker (09-26-002 already cites `WX` 3499–3506 for lifesteal garbage). This ID is **the taught number after a named event that did apply**. One-sided player ticks stay 09-26-002.  
SYSTEMS_AFFECTED: visual feedback, world events, spells (bounce / DoT log), challenges (damage-dealt reads that use the return)  
RECOMMENDED_ACTION: SIMPLIFY to one chip. `spawnDamageAtTile` and `enemyTakesDamage`’s return must use `_dmgAfterMods`. `dealDamage` must return that value, not `amount`. Bounce log should print the helper’s return if a further hook can still change it. Do not change Titan/Glass formulas in this ID. Do not add a second float. Do not implement player inbound Glass here (09-26-002).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT (thread `_dmgAfterMods` through spawn + return + `dealDamage`, plus a unit test: Glass ×2, pre-mod 10 → float and return 20, HP −20). HUMAN_DESIGN_REQUIRED to drop Titan’s 1–5× lottery (that remains PXA-008).  
DEPENDENCIES: PXA-2026-09-26-002 (player still not in `combatantsRef`; do not close 002 by fixing the float). PXA-2026-08-31-008 (slim events). GFCF-2026-08-31-003 (do not treat this as wiring juice onto `applyDamageToEnemy`). Does not close 002 or GFCF-003.  
REGRESSION_RISK: MEDIUM — challenge / recap / bounce that already assumed the pre-mod return will change on Titan/Glass maps. LOW if only the float token is switched and callers already ignore the return. HIGH if `_dmgAfterMods` is applied twice. Do not restack the whole `enemyTakesDamage` body while open combat PRs own WX overlap; extract the return+spawn pair if needed.  
VALIDATION_REQUIRED: Glass map, Strike 10 after RES: float, battle log, and HP delta are the same doubled chip. Titan roll x3: float says the rolled total, not the pre-roll. A map with no damage hook: float still equals today’s RES chip. `applyDamageToEnemy` silence stays GFCF-003 (not “fixed” here). `pnpm typecheck`.  
STATUS: NEW

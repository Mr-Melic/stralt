# ACTION_IDs — 2026-10-22 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-10-22.md`](./PX_COHERENCE_AUDIT_2026-10-22.md)

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
- `PXA-2026-09-28-001` … `003` (PR **#744** — leader crown inverse, default-bar / default-win feats, post-mod float)
- `PXA-2026-09-29-001` … `003` (PR **#784** — hardcoded 1.03 vs admin spell-dmg %; Rest/Sanctuary hub with no rest; named-event lava/ice/spike painter)
- `PXA-2026-10-21-001` … `003` (PR **#844** — three fire DoT names; Windstorm miss starts Inferno CD; forge AP 10 / MP 5 vs battle 8 / 4)

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21…10-21 audits. New IDs are new *reads* of the same bytes (player damage loop drops printed riders; Barrier card 2 vs engine 3; three stacking MP-slow names).

---

ACTION_ID: PXA-2026-10-22-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Gifted damage and drain cards must apply the rider they print — or leave the book  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `resolvePlayerCast`’s damage loop (`spellEngine.ts` 876–1028) computes crit, Blood Moon ×1.25, Fury ×1.25, Mirror Field, and Windstorm, then `applyDamageToEnemy` and returns `"cast"`. It never writes `debuffStat` / `debuffModifier` / `debuffDuration`. `applyDamageToEnemy` (`castHelpers.ts` 274–488) also never writes a rider; drain heals with `(spell.drainPercent || 0.5)` of the **first** target’s damage (473–488). No starter sets `drainPercent`. `calcScaledDamageInline` is `Math.max(1, floor(base * 1.03^upgrade))` (`1038–1044`), so Slow (`spellData.ts` 353–372, `damage: 0`, “Reduce target MP by -2 for 2 turns”) and Weaken (333–351, `damage: 0`, “Reduce target DMG by -30%”) become **1-damage pokes**. Frost Bolt (124–140, 20 + MP −1 / 1), Frost Nova (524–545, 15 AoE + slow), Expose (373–393, 15 + `res_sp` ×0.8 / 2), Shadow Veil (480–500, 18 + `res_sp` ×0.85 / 2), Cursed Wound (459–478, 22 + `healRecv` ×0.5 / 2), Life Drain (103–122, “gain 5 HP, reduce target SP by 20%”), Drain Courage (437–458, “heal self 9 + AP −1”), and Lifesteal Nova (252–272, “heals caster 10 per hit”) print unique questions the player path does not ask. The **enemy** path *does* apply `debuffStat` (`WorldExploration.tsx` 16594–16607) and drain `healAmount` (16626–16637). Summon Slow/Weaken fall through `summonExecutor.ts` 191–203: `applyEffect` with `effectName: spell.name` and **no** `stat` / `modifier`, so the badge is a nametag `getStatModifier` ignores (`statusEffects.ts` 45–62, exact `stat` match). `debuffStat: "res_sp"` would not change RES or SP even if written: combat reads `"res"` and `"sp"` separately (`WX` 3347–3358); the admin dropdown still offers `res_sp` (`AdminDashboard.tsx` 3280). Blood Mend / Rally CHC unused on crit is **EBMA** — do not fold heals into this ID. PXA-002 MERGE assumed Cursed Wound / Weaken / Frost Nova were distinct live tools.  
SYSTEMS_AFFECTED: spells, summons, enemies (asymmetric rider), visual feedback, challenges (Striker / Pacifist / no-heal on a book whose “CC” is 1 damage), admin-enabled content (`res_sp`)  
RECOMMENDED_ACTION: REWORK the player (and summon) apply path so a printed rider fights, then MERGE clones (PXA-002). Recommend: after each successful player hit, apply `debuffStat` the same way the enemy block at `WX` 16594 does; split `res_sp` into two effects or map it in `getStatModifier`; drain uses card `healAmount` (Nova: per hit) **or** reprint the 50%-of-damage rule; Slow/Weaken must not go through `Math.max(1, …)` — a 0-damage CC is not a poke. Do not delete the enemy rider to “make paths match.” Do not start character-level spell scaling (`_casterLevel`) here (09-29-001). Do not implement Blood Mend CHC here (EBMA).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT applying `debuffStat` after the player damage loop + a unit test that Slow writes `stat: "mp"` modifier −2 and Weaken does not deal 1 damage; HUMAN_DESIGN_REQUIRED to keep the 50% drain rule (then reprint every drain card) or to keep `res_sp` as a compound key.  
DEPENDENCIES: PXA-2026-08-31-002 (clone merge is blocked until unique KEEP tools actually differ). PXA-2026-09-27-003 (SP-as-inbound log — Life Drain’s **outbound** SP shred is this ID). EBMA (heal CHC rider). Does not close 002 or 003.  
REGRESSION_RISK: HIGH if Slow −2 MP suddenly stacks with Tide `"slow"` and ice `"Frozen"` on the same target (that stack language is 10-22-003 — land 003’s one name, or apply Slow as refresh of that name). MEDIUM if drain `healAmount` 5 replaces 50% of a crit Inferno-scale hit (Life Drain base 10). LOW if only Slow/Weaken skip the `max(1,)` floor. Do not restack WX `executeCastAttempt` while open combat PRs own that block — change `resolvePlayerCast` + `summonExecutor.applyCast` and tests.  
VALIDATION_REQUIRED: Player Slow on a 4-MP pawn: 0 damage, −2 MP for 2, badge “Slow”. Player Weaken: 0 damage, ×0.7 dmg. Player Frost Bolt: 20-ish chip **and** −1 MP. Player Expose: RES (and SP if design keeps both) actually drop; `getStatModifier(id, "res")` ≠ 1. Player Life Drain: heal equals card 5 (or reprinted %) **and** target SP shreds. Enemy Frost Bolt still shreds player MP. Archer kit Slow writes `stat: "mp"`. `pnpm typecheck`. No mapGen / RAF.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-22-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Barrier must be one duration — card 2 turns vs engine 3  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Barrier is a protected signature (`PXA-2026-08-31-002` KEEP list; Swap/Mark/Mirror/Timestep/Sacrifice family). The gifted card says “Places a temporary solid block on a free tile for **2 turns**” (`spellData.ts` 179–196, `isBarrier: true`, `targetType: "ground"`). `resolvePlayerCast` always calls `ctx.placeBarrierTile(gridPos, 3)` and logs “Barrier placed at (…) for **3 turns**!” (`spellEngine.ts` 838–856). The WX adapter writes that argument into `barrierTilesRef` (`WorldExploration.tsx` 9579–9580). Duration decrements only at **player** turn start (`WX` 14297–14308: `bTurns - 1`, log “Barrier at … has faded.”). A 3 on a player-turn clock is not the card’s 2, and it is not “3 of every combatant’s turns.” Timestep (once/battle) and Inferno CD (09-27-002) are other turn clocks; this ID is the wall that lies about how long it stands. Do not fold into 10-22-001 (Barrier never enters the damage loop). Do not fold into PXA-002 (not a clone).  
SYSTEMS_AFFECTED: spells, visual feedback (card vs log vs fade line), challenges (Striker / pathing around a wall), AI (enemy pathing around `barrierTilesRef`)  
RECOMMENDED_ACTION: SIMPLIFY to one number and one tick clock. Recommend: keep the live engine (3 player-turn ticks — the wall is already the stronger tool) and reprint the card + any Boss Guide line as “3 of **your** turns.” Alternative: pass `2` into `placeBarrierTile` to match the card. Name the clock (“fades at the start of your turn”) in one clause. Do not tick barriers on every combatant turn in a drive-by (that triples the fade on a 3-body fight). Do not change Swap/Mark/Mirror/Timestep/Sacrifice here.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT either reprinting “3 of your turns” on `spellData.ts` 181 **or** passing `2` into `placeBarrierTile`, plus a unit test that the integer in the description equals the integer passed to `placeBarrierTile`. HUMAN_DESIGN_REQUIRED to invent a round-clock (all combatants) or a duration that scales with no cap.  
DEPENDENCIES: PXA-2026-08-31-002 (KEEP Barrier as the unique wall — this ID makes that KEEP honest). PXA-2026-09-27-002 (another gifted card whose number is silent; Inferno is CD, not duration). Does not close 002.  
REGRESSION_RISK: MEDIUM if duration drops 3→2 (pathing windows and bomber/guardian kits that walk around walls). LOW if only the card/log reprint 3. HIGH if barrier ticks move onto every summon/enemy turn without a pass on fade timing. Do not restack WX `barrierTilesRef` while occupancy PRs own walk — change the constant next to `placeBarrierTile` and the card together.  
VALIDATION_REQUIRED: Cast Barrier, read the card, the log, and the fade line: one integer. After 2 player End Turns a 2-turn wall is gone; a 3-turn wall still occupies. Enemies cannot walk the cell while it stands. `pnpm typecheck`. No mapGen / RAF.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-22-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Movement tax must be one stacking language — Tide slow, spell Slow, and ice Frozen are the same verb  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Non-DoT effects replace-or-refresh by `targetId + effectName` (`statusEffects.ts` 65–83). MP is **additive** (`isAdditiveResourceStat`, 31–62): different names **sum**. Tide Shade melee writes `effectName: "slow"`, `stat: "mp"`, `modifier: -1`, duration 2 (`WorldExploration.tsx` 16805–16816, log “slows you!”). Ice tiles write `effectName: "Frozen"`, `stat: "mp"`, `modifier: -2`, duration 2, log “Slowed!” under a stale “−50% MP” comment (`WX` 11454–11467). Enemy Slow writes `effectName: chosenSpell.name` = `"Slow"` with `stat: "mp"` −2 (`WX` 16594–16607; `spellData.ts` 353–372). `"slow" !== "Slow" !== "Frozen"` → a Tide pack on a Frozen-Terrain map that also planted ice (09-29-003) plus one enemy Slow is −1−2−2 MP under three badges, while the ice line says Slowed and the Register says Tide “Slows your movement when adjacent” (`EnemyRegister.tsx` 57). Frozen Terrain’s **honest** MP ×2 (`mapModifiers.ts` 164–172) is a fourth walk tax with a twin (Slime Flood) — that merge stays PXA-008 / 09-29-003. Player Slow currently never applies (10-22-001); landing 001 without this ID makes the gifted Slow a **fifth** stack on the same verb. 10-21-001 owns fire DoT **names**; do not fold ice into burn.  
SYSTEMS_AFFECTED: spells, enemies (Tide), world events (ice tiles / Frozen Terrain), visual feedback (badges + “Slowed!” log), challenges (walk / Striker on ice+Tide maps)  
RECOMMENDED_ACTION: MERGE to one walk-tax verb. Pick (a) every MP debuff uses one `effectName` (recommend `"Slow"`) and one badge language the Tide hook, ice tile, and Slow card share (“Slow stacks; Tide is −1, ice/Slow are −2”), or (b) they do **not** stack — replace-or-refresh by that shared name so a Slow recast refreshes ice rather than adding −2. Print the chosen rule on Slow (once 10-22-001 makes the card live) and on the ice log (drop “−50% MP”). Rewrite Tide Register copy to Slow, not a second noun, as part of 09-01-001 — do not close 001 here. Do not merge Slime/Frozen **terrain** MP ×2 into this ID (PXA-008 / 09-29-003). Do not add Haste / Swift Boots / Swift Winds into this ID (those are haste, not tax).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT (a) rename Tide + ice `effectName` to `"Slow"` plus a unit test that two MP applies share one name and `getStatModifier` sums only when design wants stacks; HUMAN_DESIGN_REQUIRED to pick (b) no-stack or to keep Tide vs ice as an intentional family-vs-floor distinction.  
DEPENDENCIES: PXA-2026-10-22-001 (player Slow must use the same name once it applies). PXA-2026-10-21-001 (fire names — parallel, not a twin). PXA-2026-09-01-001 (Register Tide line). PXA-2026-09-29-003 (which maps even have ice). PXA-2026-08-31-008 (Slime ≡ Frozen **terrain**). Does not close 001, 008, or 003.  
REGRESSION_RISK: MEDIUM if (a) two Slow casts start collapsing because they share a **DoT** append path (keep `type: "debuff"` + replace-or-refresh). HIGH if (b) ice Frozen replace-refreshes a −2 Slow down to Tide −1. LOW if only Tide/ice names unify and the Slow card stays −2. Do not restack WX Tide/ice blocks while open combat PRs own them — extract a `SLOW_EFFECT_NAME` constant.  
VALIDATION_REQUIRED: Ice only: one “Slow” / “Frozen” badge at −2 MP. Ice then Tide melee: either −3 under one name (a) or −2 refreshed (b), never “slow” + “Slow” + “Frozen”. Enemy Slow on a no-ice target: −2, same name as ice. Ice log does not say −50%. `pnpm typecheck`. No mapGen / RAF.  
STATUS: NEW

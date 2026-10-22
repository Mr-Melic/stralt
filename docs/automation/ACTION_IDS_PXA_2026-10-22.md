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

`origin/main` has not moved since the 09-21…10-21 audits. New IDs are new *reads* of the same bytes (`res_sp` unread after the queued rider wire; Barrier card 2 vs engine 3; three stacking MP-slow names).

**Do not twin** player `debuffStat` apply: `EBMA-2026-09-02-004`, open PRs **#528** (Weaken/Slow on highlighted hostiles), **#555** (advertised `debuffStat` after player hits), **#878** (summon kit Slow `stat`). Summon nametag Slow is also `EBMA-2026-09-02-006`. Drain `healUsed` is `EBMA-2026-09-02-005`. Blood Mend / Rally CHC is EBMA.

---

ACTION_ID: PXA-2026-10-22-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Expose/Shadow Veil `res_sp` and drain healAmount still would not fight even after player Slow is wired  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `getStatModifier` matches `eff.stat === stat` only (`statusEffects.ts` 45–62). Player→enemy math reads `"res"` and `"sr"` (`WorldExploration.tsx` 3347–3358), never `"res_sp"` and never `"sp"` on the target. Enemy→player math reads `"res"` and `"sp"` (`WX` 16475–16540); `"res_sp"` still matches neither (the SP-as-inbound **log word** is 09-27-003 — do not fold). Expose (`spellData.ts` 373–393) and Shadow Veil (480–500) both set `debuffStat: "res_sp"` (×0.8 / ×0.85, 2 turns) and print “RES and SP” / “RES+SP”. The admin **debuff** dropdown still offers `res_sp` (`AdminDashboard.tsx` 3280); the buff dropdown does not (3213). Enemy casts already write `stat: chosenSpell.debuffStat` (`WX` 16594–16607), so **enemy Expose is a dead key on live HEAD** — #528 / #555 / EBMA-004 would copy that same unread key onto the player path. Drain cards print `healAmount` 5 / 9 / “10 per hit” (Life Drain 103–122, Drain Courage 437–458, Lifesteal Nova 252–272). None set `drainPercent`. The bar tooltip treats drain as a heal and shows `Heals: ${spell.healAmount ?? 0} HP` (`BattleUIPanel.tsx` 631–633). Player drain ignores that number: `(spell as any).drainPercent || 0.5` of the **first** target’s damage, once (`castHelpers.ts` 473–488; `resolveSpellCast` `spellEngine.ts` 471–474). A clean non-crit Life Drain accidentally equals 5; crit / Fury / Blood Moon / Nova multi-hit do not. Enemy drain **does** use `healAmount` (`WX` 16626–16637) — same card, two heals. Do not twin Slow/Weaken 1-damage pokes (EBMA-004 / #528 / #555) or summon Slow without `stat` (#878 / EBMA-006). Do not twin drain `healUsed` (EBMA-005).  
SYSTEMS_AFFECTED: spells, visual feedback (card vs tooltip vs log), enemies (enemy Expose already writes the dead key), admin-enabled content (`res_sp` dropdown), challenges (Pacifist / no-heal vs a drain whose heal is 50% of a crit)  
RECOMMENDED_ACTION: REWORK the keys and the printed drain number so the gifted KEEP identities fight **after** the queued apply-path PRs land. Split `res_sp` into two `applyEffect` rows (`stat: "res"` plus the chosen second key) **or** map the compound key inside `getStatModifier`. Drop `res_sp` from the admin dropdown until a mapper exists. Drain: honor card `healAmount` (Nova: per connected hit) **or** reprint the live 50%-of-first-hit rule on every drain card **and** stop the tooltip from saying `Heals: N`. Then MERGE Expose ≡ Veil and the three drains under PXA-002 — clone merge is blocked while the unique question is unread. Do not apply Slow/Weaken here. Do not implement Blood Mend CHC (EBMA). Do not start character-level spell scaling (`_casterLevel`, 09-29-001). Do not “fix” SP-as-inbound copy here (09-27-003).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT mapping `res_sp` → two effects (or deleting the dropdown value) plus drain preferring `healAmount` when `> 0`, with a unit test that `getStatModifier(id, "res")` changes after Expose and that Life Drain’s heal equals the card or the reprinted %. HUMAN_DESIGN_REQUIRED to pick the second shred key (`"sr"` inbound vs `"sp"` outbound — enemy outgoing in this block does not read caster SP) and to keep the 50% drain rule (then reprint).  
DEPENDENCIES: EBMA-2026-09-02-004 / **#528** / **#555** (player rider **write** — this ID is what remains unread **after** that write). **#878** / EBMA-006 (summon Slow `stat` — not this ID). PXA-2026-08-31-002 (clone merge). PXA-2026-09-27-003 (SP vs SR vocabulary). EBMA-005 (drain `healUsed` flag). Does not close 002, 003, 09-27-003, or EBMA-004.  
REGRESSION_RISK: HIGH if `res_sp` splits onto player `"sp"` while inbound already treats player SP as SR (09-27-003) — Expose would double-dip. MEDIUM if drain switches to printed 5/9/10 and a crit Life Drain heals less than today’s 50%. LOW if only the admin dropdown drops `res_sp` and drain cards reprint “50% of damage, once.” Do not restack WX `executeCastAttempt` while #528/#555/#878 own that block — change `getStatModifier` / card keys / `castHelpers` drain arm and tests.  
VALIDATION_REQUIRED: Expose on a 20 RES pawn: `getStatModifier(id, "res")` is 0.8 (or the chosen map); combat chip drops; `stat: "res_sp"` is not the key combat reads. Shadow Veil same family, distinct only if design keeps both percents. Enemy-cast Expose on the player also changes `"res"` (and the chosen second key). Life Drain: tooltip, log, and HP gain are one number on a **crit** and on a 1-HP leftover. Lifesteal Nova: 10 per connected hit **or** the card says once. Enemy Life Drain still heals `healAmount`. Admin cannot save `res_sp` unless a mapper exists. `pnpm typecheck`. No mapGen / RAF. Slow −2 MP is **not** this ID’s test.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-22-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Barrier must be one duration — card 2 turns vs engine 3  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Barrier is a protected signature (`PXA-2026-08-31-002` KEEP list; Swap/Mark/Mirror/Timestep/Sacrifice family). The gifted card says “Places a temporary solid block on a free tile for **2 turns**” (`spellData.ts` 179–196, `isBarrier: true`, `targetType: "ground"`). `resolvePlayerCast` always calls `ctx.placeBarrierTile(gridPos, 3)` and logs “Barrier placed at (…) for **3 turns**!” (`spellEngine.ts` 838–856). The WX adapter writes that argument into `barrierTilesRef` (`WorldExploration.tsx` 9579–9580). Duration decrements only at **player** turn start (`WX` 14297–14308: `bTurns - 1`, log “Barrier at … has faded.”). A 3 on a player-turn clock is not the card’s 2, and it is not “3 of every combatant’s turns.” Timestep (once/battle) and Inferno CD (09-27-002) are other turn clocks; this ID is the wall that lies about how long it stands. Do not fold into 10-22-001 (`res_sp` / drain numbers — Barrier never enters the damage loop). Do not fold into PXA-002 (not a clone).  
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
EVIDENCE: Non-DoT effects replace-or-refresh by `targetId + effectName` (`statusEffects.ts` 65–83). MP is **additive** (`isAdditiveResourceStat`, 31–62): different names **sum**. Tide Shade melee writes `effectName: "slow"`, `stat: "mp"`, `modifier: -1`, duration 2 (`WorldExploration.tsx` 16805–16816, log “slows you!”). Ice tiles write `effectName: "Frozen"`, `stat: "mp"`, `modifier: -2`, duration 2, log “Slowed!” under a stale “−50% MP” comment (`WX` 11454–11467). Enemy Slow writes `effectName: chosenSpell.name` = `"Slow"` with `stat: "mp"` −2 (`WX` 16594–16607; `spellData.ts` 353–372). `"slow" !== "Slow" !== "Frozen"` → a Tide pack on a Frozen-Terrain map that also planted ice (09-29-003) plus one enemy Slow is −1−2−2 MP under three badges, while the ice line says Slowed and the Register says Tide “Slows your movement when adjacent” (`EnemyRegister.tsx` 57). Frozen Terrain’s **honest** MP ×2 (`mapModifiers.ts` 164–172) is a fourth walk tax with a twin (Slime Flood) — that merge stays PXA-008 / 09-29-003. Player Slow apply is **EBMA-2026-09-02-004 / #528 / #555** (summon Slow `stat` is **#878**); landing those without this ID makes the gifted Slow a **fifth** stack on the same verb. Do not twin those apply-path PRs. 10-21-001 owns fire DoT **names**; do not fold ice into burn. 10-22-001 is `res_sp` / drain numbers, not Slow apply.  
SYSTEMS_AFFECTED: spells, enemies (Tide), world events (ice tiles / Frozen Terrain), visual feedback (badges + “Slowed!” log), challenges (walk / Striker on ice+Tide maps)  
RECOMMENDED_ACTION: MERGE to one walk-tax verb. Pick (a) every MP debuff uses one `effectName` (recommend `"Slow"`) and one badge language the Tide hook, ice tile, and Slow card share (“Slow stacks; Tide is −1, ice/Slow are −2”), or (b) they do **not** stack — replace-or-refresh by that shared name so a Slow recast refreshes ice rather than adding −2. Print the chosen rule on Slow (once EBMA-004 / #528 makes the card live) and on the ice log (drop “−50% MP”). Rewrite Tide Register copy to Slow, not a second noun, as part of 09-01-001 — do not close 001 here. Do not merge Slime/Frozen **terrain** MP ×2 into this ID (PXA-008 / 09-29-003). Do not add Haste / Swift Boots / Swift Winds into this ID (those are haste, not tax).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT (a) rename Tide + ice `effectName` to `"Slow"` plus a unit test that two MP applies share one name and `getStatModifier` sums only when design wants stacks; HUMAN_DESIGN_REQUIRED to pick (b) no-stack or to keep Tide vs ice as an intentional family-vs-floor distinction.  
DEPENDENCIES: EBMA-2026-09-02-004 / **#528** / **#555** (player Slow must use the same name once it applies). **#878** (summon Slow). PXA-2026-10-21-001 (fire names — parallel, not a twin). PXA-2026-09-01-001 (Register Tide line). PXA-2026-09-29-003 (which maps even have ice). PXA-2026-08-31-008 (Slime ≡ Frozen **terrain**). PXA-2026-10-22-001 is orthogonal (`res_sp` / drain). Does not close 001, 008, or 09-01-001.  
REGRESSION_RISK: MEDIUM if (a) two Slow casts start collapsing because they share a **DoT** append path (keep `type: "debuff"` + replace-or-refresh). HIGH if (b) ice Frozen replace-refreshes a −2 Slow down to Tide −1. LOW if only Tide/ice names unify and the Slow card stays −2. Do not restack WX Tide/ice blocks while open combat PRs own them — extract a `SLOW_EFFECT_NAME` constant.  
VALIDATION_REQUIRED: Ice only: one “Slow” / “Frozen” badge at −2 MP. Ice then Tide melee: either −3 under one name (a) or −2 refreshed (b), never “slow” + “Slow” + “Frozen”. Enemy Slow on a no-ice target: −2, same name as ice. Ice log does not say −50%. `pnpm typecheck`. No mapGen / RAF.  
STATUS: NEW

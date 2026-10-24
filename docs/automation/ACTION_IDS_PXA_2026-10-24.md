# ACTION_IDs — 2026-10-24 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-10-24.md`](./PX_COHERENCE_AUDIT_2026-10-24.md)

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
- `PXA-2026-10-22-001` … `003` (PR **#907** — `res_sp` unread + drain healAmount vs 50%-once; Barrier 2 vs 3; three MP-slow names). Do not twin EBMA-004 / #528 / #555 / #878.
- `PXA-2026-10-23-001` … `003` (PR **#955** — Weaken `dmg` / Cursed Wound `healRecv` unread on the pack; Shield RES skips Crush while Charm fights it; four reflect rates). Do not twin EBMA-004 / #528 / #555 / #878.

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21…10-23 audits. New IDs are new *reads* of the same bytes (player SP already inbound on enemy spells + RES applied twice; no-heal copy says “spells” while potions/drain/Wisp/Doka-to-HP fail it; Iron Skin / Haste / Enrage cards say “own” while `targetType` is ally).

**Do not twin** player `debuffStat` apply: `EBMA-2026-09-02-004`, open PRs **#528** / **#555** / **#878**. Drain `healUsed` is `EBMA-2026-09-02-005`. Blood Mend / Rally CHC is EBMA. Sheet SR unused inbound is 09-26-003. Hit-log `-SP` on **player→enemy** hits is 09-27-003 — that ID said “do not invent inbound SP”; this run found inbound SP **already live on enemy→player spells**. Crush skipping RES is 10-23-002. `res_sp` / drain numbers are 10-22-001. Weaken `dmg` / Cursed Wound `healRecv` are 10-23-001. Pacifist feat vs `easy_1` overlap stays PXA-009. Haste vs Swift Boots as two MP-haste **commitments** stays KEEP — 10-24-003 is the “own” sentence, not the Boots pair. Blood Moon flavor announce vs live ×1.25 stays 09-01-002 (engine **is** `spellEngine.ts` 894–898; do not re-file 002). Betrayal 6× / 🔥 badge stays 09-24-002. Timestep vs Time Warp name-rhyme stays PXA-012 evidence, not a fourth ID.

---

ACTION_ID: PXA-2026-10-24-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Player SP is already inbound resist on enemy spells; RES is then applied a second time; sheet SR still does nothing inbound  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Three pipes, three SP jobs, one sheet. (1) **Outbound power (taught):** non-physical player hits multiply `1 + characterStats.sp/100` (`WorldExploration.tsx` 3318–3322; forge stamps `sp: 8n`, `startingChampionStats.ts` 16). Comment there also claims SP boosts **healing**. Player Blood Mend / Rally go through `resolvePlayerCast` self-heal (`spellEngine.ts` 654–673) which uses `healAmount * healRecv * crit` and **never** `characterStats.sp`. The other heal helper **does** apply SP (`spellEngine.ts` 551–555). (2) **Secret inbound resist (not taught as SR):** enemy `cast` on the player builds `plSpEff = characterStats.sp * getStatModifier("player","sp")` and `plResEff = characterStats.res * getStatModifier("player","res")`, then `dmgAC * (1 - plSpEff/100) * (1 - plResEff/100)` (`WX` 16474–16536). The log prints that cut as `-${spR} SP` (16538–16548). `playerTakesDamage` is then called with that already-mitigated value (16566–16569) and applies **RES again** (3427–3432). Default forge RES 10 + SP 8 → enemy Frost is `0.92 × 0.90` then another `× 0.90` ≈ 25.5% off, not the sheet’s “RES 10%” and unused “SR 5%.” DoT ticks and lava use `playerTakesDamage` only (RES once, no SP). Crush / boss `damageToPlayer` skip both (10-23-002). (3) **Life Drain shred is the wrong face:** card is “reduce target SP by 20%” (`spellData.ts` 106–117, `debuffStat: "sp"` ×0.8). Enemy outgoing **does not** read caster SP (`WX` 16464–16468 is `calcScaledDamage * enrageMultiplier`). After EBMA-004 / #528 / #555 write the rider, a player Life Drain still would not drop Crush or enemy Frost. An **enemy** Life Drain on the player **would** shrink `plSpEff` (inbound shield) and would **not** shrink player outbound `characterStats.sp`. `getStatModifier(..., "sp")` has no other reader. Statistics still prints SP as a bare number next to SR% as if they were outbound vs inbound peers (`WX` 18528–18538). 09-26-003 is the SR sheet lie (`playerTakesDamage` RES-only). 09-27-003 is the **player→enemy** log teaching enemy SP as inbound while math uses enemy SR, and it said “do not invent inbound SP.” Inbound SP is **already invented** on this enemy-cast pipe. Do not twin Crush skipping RES (10-23-002), `res_sp` (10-22-001), or Weaken `dmg` (10-23-001).  
SYSTEMS_AFFECTED: spells (SP / Life Drain / heals), visual feedback (Statistics + enemy-cast log `-SP`), enemies (Frost inbound), challenges (Untouchable / under-50 vs a double-RES spell pipe Crush skips), admin-enabled content (`debuffStat: "sp"`), progression (forge SP 8 is a silent magic shield)  
RECOMMENDED_ACTION: REWORK to one SP job and one inbound pipe. Recommend: (a) enemy spells (and only spells) use **player SR**, not SP, for the inbound spell cut; (b) call `playerTakesDamage` with **raw** incoming so RES applies once; (c) player self-heal either gains the advertised SP bonus or the computeDamage comment drops “AND healing”; (d) Life Drain’s SP shred must multiply the **target’s outbound magic** (enemy spell + player `computeDamage`) — or reprint as “reduces the target’s inbound SP shield” if (a) keeps inbound SP, which it should not. Hide or implement sheet SR as 09-26-003. Fix player→enemy `-SP` log as 09-27-003. Do not add inbound SP to Crush. Do not map `res_sp` here.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT routing enemy-cast inbound through one helper (`applyPlayerIncomingSpell(raw)`) that uses SR × RES once, plus a unit test that forge SP 8 / RES 10 / SR 5: Frost is reduced by printed SR and RES once, not by SP, and Blood Mend ignores SP **or** gains it as the comment says. HUMAN_DESIGN_REQUIRED to keep SP as a dual outbound+inbound stat (then the sheet must print “SP also reduces enemy spells by SP%” and drop SR).  
DEPENDENCIES: PXA-2026-09-26-003 (sheet SR — this ID is the **live SP inbound** that 003 did not see because it stopped at `playerTakesDamage`). PXA-2026-09-27-003 (player→enemy log; do not close it by changing enemy→player math). PXA-2026-10-23-002 (Crush still skips this pipe; do not invent SR on Crush here). PXA-2026-10-22-001 (`res_sp` / drain numbers — orthogonal). PXA-2026-10-23-001 (`dmg` / `healRecv` — orthogonal). EBMA-004 / #528 / #555 (Life Drain write; this ID is the unread/mis-aimed **face** after that write). PXA-012 (one resist word). Does not close 003, 10-23-002, or 10-22-001.  
REGRESSION_RISK: HIGH if enemy Frost stops using SP while SR stays 5 — fights get slightly harder (lose the secret 8%) then slightly easier if SR is wired. HIGH if RES is de-doubled (enemy spells jump ~11% at RES 10). MEDIUM if Life Drain suddenly shreds enemy Frost. LOW if only the sheet/log/cards reprint the live Möbius. Do not restack WX melee while 10-23-002 / occupancy PRs own Crush — change the **cast** inbound helper.  
VALIDATION_REQUIRED: Forge L1, SP 8, RES 10, SR 5. Enemy Frost 20: HP loss matches `20 × (1-SR/100) × (1-RES/100)` once, log says `-SR`/`-RES`, not `-SP`. Same Frost after Shield ×1.3 RES: one RES multiply. Blood Mend 12: heals 12, or 12×1.08 if SP-on-heal is chosen. Life Drain an enemy caster: its next Frost is 80% **or** the card is reprinted. Crush unchanged by this ID (10-23-002). Statistics does not imply SR inbound until (a) lands. `pnpm typecheck`. No mapGen / RAF.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-24-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: No-heal challenges say “healing spells” but fail on potions, drain, Wisp, and in-battle Doka-to-HP  
CATEGORY: challenges  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `easy_1` copy is “Win without using healing spells” (`challengeCompletion.ts` 44–50; `ChallengePanel` prints `currentChallenge.description` at 273). `hard_1` is the broader “Win without healing and take under 30 damage” (67–71). The live `healUsed` flag is a **any HP restore** bit: self-heal spells (`WX` 17190–17196), BuffShop Health / Greater potions (`3597–3600` via `recordChallengeItemHealUsed`; comments 221–226), Life Drain / Wisp `ctx.heal` (`9192–9196`, `15012–15016` via `recordChallengeHealFromHpRestore`; comments 243–248), and the leftover-XP **Doka-to-HP** button (`18431–18435` via `recordInBattleChallengeHealUsed`). Overworld Doka-to-HP correctly does **not** stick (comments 207–211). So a player who reads `easy_1`, skips Blood Mend / Rally, drinks a 50-Doka potion or lets the Wisp tick, fails a contract that named spells. Pacifist (`src/backend/lib/admin.mo` 324: “Win a battle using only heal or buff spells”) is the **inverse** stamp — that feat-vs-challenge overlap stays PXA-009. Idle +1/10s is out of battle (09-23-003) and does not flip the flag. Cursed Wound `healRecv` still does not tax potions (10-23-001). This ID is the **sentence vs the flag**, not the offer table (009) or the unbounded predicates (09-26-001).  
SYSTEMS_AFFECTED: challenges, spells (drain / Wisp / Blood Mend), shops (HP pots), visual feedback (ChallengePanel copy), achievements (Pacifist inverse — do not merge here), rewards (`easy_1` 50 Doka / `hard_1` 200 Doka + 500 XP)  
RECOMMENDED_ACTION: SIMPLIFY to one recover verb on the card that matches `healUsed`. Recommend reprint `easy_1` as “Win without restoring HP (spells, potions, drain, Wisp, Doka-to-HP)” — or narrow the flag to `effectType === "heal"` **and** stop flipping it on potions/drain/Wisp/Doka-to-HP (then `hard_1` “without healing” must be the broad row, and potions become a legal no-heal line). Do not offer `easy_1` on a Wisp-bar loadout if the flag stays broad. Do not change persist wiring. Do not hide the challenge HUD. Pacifist stays 009.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT reprinting `easy_1` (and `hard_1` if it should list the same sources) plus a unit test that a potion in battle fails `easy_1` **or** a potion does not flip `healUsed` if the card stays “spells.” HUMAN_DESIGN_REQUIRED to pick broad-flag vs spell-only flag.  
DEPENDENCIES: PXA-2026-08-31-009 (Pacifist vs no-heal — this ID is `easy_1` copy vs the flag; does not close 009). PXA-2026-09-26-001 (predicates; do not scale 50 Doka here). PXA-2026-09-23-002 (pots vs 1:3 — pots must not stay a stealth fail). PXA-2026-10-23-001 (potion vs Cursed Wound — orthogonal). EBMA-005 (drain `healUsed` wiring — keep the flip if the card is broad). Does not close 009.  
REGRESSION_RISK: MEDIUM if the flag is narrowed (potion no-heal becomes a free 50 Doka). LOW if only `easy_1` copy lists every restore. HIGH if `healUsed` is cleared mid-fight. Do not restack `handleBattleEnd` persist.  
VALIDATION_REQUIRED: Accept `easy_1`. Cast Strike only, drink Health Potion: panel fails **or** the card said spells-only and still pays. Accept `easy_1`, Life Drain a pawn: same rule. Wisp heal on the player: same rule. In-battle Doka-to-HP: same rule. Overworld Doka-to-HP then fight: `easy_1` still offerable. Recap pays only when the flag matches the sentence. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-24-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Iron Skin, Haste, and Enrage cards say “own”; the engine is an ally buff  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Three gifted cards print “Buff **own** …” (`spellData.ts` Iron Skin 293–311, Haste 313–331, Enrage 273–291) while `targetType: "ally"`. The shield/self-buff branch was widened to allied summons (`spellEngine.ts` 675–718, comment “#297 Section 2”): click the wolf tile, `buffTargetId` is the summon, log says “on ${pieceType}.” Shield (`starter-shield` 30–47) is the honest sibling: same `targetType: "ally"` / same branch, description does **not** say “own.” Last audit KEEP’d **Haste vs Swift Boots** as “spell slot + **ally** vs consumed this-turn.” That KEEP is the engine. The card still teaches self-only. Hidden mastery: Enrage on a Dire Wolf **does** fight (`enemyTakesDamage` multiplies caster `"dmg"`, `WX` 3492–3494). Haste on a summon **does** add MP on its restore. Iron Skin on a summon **does** multiply that unit’s RES. A player who reads “own” never spends the AP on the wolf. Attack Nearest on these ids still prefers the caster tile, so the ally read is click-only. Do not fold into PXA-002 (clone merge of Shield ≡ Iron Skin / Enrage vs Fury). Do not fold into 10-23-002 (RES vs Crush on the **player**). Swift Boots stays KEEP as the self this-turn consumable.  
SYSTEMS_AFFECTED: spells, summons (control-panel + tile click), visual feedback (card vs log “on wolf”), shops (Swift Boots as the self MP tool)  
RECOMMENDED_ACTION: SIMPLIFY copy to the KEEP identity, or restrict the branch to the card. Recommend reprint Iron Skin / Haste / Enrage as “Buff an ally (including yourself) …” matching Shield’s honesty and the Haste-vs-Boots KEEP. Alternative: set `targetType: "self"` and drop the summon branch for those three if design wants self-only. Do not leave “own” on an ally tool. Do not merge Shield ≡ Iron Skin in this ID. Do not change Swift Boots.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT reprinting the three descriptions (and bar tooltip) **or** flipping `targetType` to `"self"` plus a unit test that Haste on a Dire Wolf tile either applies +2 MP to the wolf **and** the card says ally, or aborts / self-only as the card says. HUMAN_DESIGN_REQUIRED to drop ally targeting.  
DEPENDENCIES: PXA-2026-08-31-002 (clone merge waits; this ID makes the surviving Haste/Enrage/Iron Skin sentence true). PXA-2026-10-23-002 (player Shield vs Crush — orthogonal). Haste vs Swift Boots KEEP (do not delete Boots). Does not close 002.  
REGRESSION_RISK: LOW for reprint. MEDIUM if `targetType` becomes `"self"` (summon-buff loadouts lose a tool). HIGH if the ally branch is removed while kits / tutorials tell the player to Haste the wolf. Do not restack `executeCastAttempt` while #528/#555 own debuff write — this is description + the existing shield branch.  
VALIDATION_REQUIRED: Spellbook Haste at level 0 says ally (or self-only). Click Dire Wolf with Haste: wolf MP +2 **and** the card allowed it, or the click is not a legal target. Enrage on the wolf: next wolf Strike is ×1.4. Shield card still does not say “own.” Swift Boots still self this-turn. `pnpm typecheck`.  
STATUS: NEW

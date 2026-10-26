# ACTION_IDs — 2026-10-26 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`bc-16765ec2-025d-5940-b252-a6a1974ff3f0`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-10-26.md`](./PX_COHERENCE_AUDIT_2026-10-26.md)

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
- `PXA-2026-10-23-001` … `003` (PR **#955** — Weaken `dmg` / Cursed Wound `healRecv` unread on the pack; Shield RES skips Crush while Charm fights it; four reflect rates)
- `PXA-2026-10-24-001` … `003` (PR **#1008** — player SP inbound on enemy spells + RES twice; `easy_1` “healing spells” vs any restore; Iron Skin/Haste/Enrage “own” vs ally)
- `PXA-2026-10-25-001` … `003` (PR **#1067** — gifted `hitsMultiple` vs cards; Haste +2 unread on restore / summon budget; turn-limit HUD never Failed)

Sibling same-day signature hunt (unmerged workspace docs `*_SIGNATURE.md`) claims `PXA-2026-10-26-004` … `006` (Mirror arming / Mark empty-floor / Strike FAIL unnamed). This file owns **001–003** only. Do not renumber across hunts.

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21…10-25 audits. New IDs are new *reads* of the same bytes (Bomber card/kit/AP vs control panel; dungeon recap Depth defaults; hard_3 HUD omits peak AP).

**Do not twin** EBMA Bomber AI DoT/kamikaze (`EBMA-2026-09-01-006` — AI `summonExecutor` path). This run is the **player-facing** Bomber: card + spellbook kit + 1 AP chip vs a control panel that greys Inferno forever and never offers explode. Do not twin flat `hard_3` ≤ 8 auto-stamp (09-26-001). Do not twin turn-limit Failed chip (10-25-003). Do not twin recap dummy `"Battle Challenge"` (09-25-002). Do not twin Rest/Sanctuary hub (09-29-002). Do not twin leader crown tooltip (09-28-001 — InitiativeStrip panel line 660 is the same lie). Do not twin summon upgrade 10× (09-22-002). Do not twin Haste unread on summon budget (10-25-002). Do not twin HP pots vs 1:3 (09-23-002). Do not twin sheet SR / FAIL / AP-MP cadence / SP inbound (09-26-003 / 09-27-001 / 09-27-003 / 10-24-001). Do not twin `easy_1` healing-spells copy (10-24-002) or Pacifist feat overlap (PXA-009). Do not twin unused rush `combinedMechanic` (PXA-003). Do not twin sibling 004–006 Mirror/Mark/Strike.

**Challenge HUD answers (not new IDs):** Untouchable **does** fail the chip when `totalDamage > 0` (`isChallengeFailed` `challengeCompletion.ts` 454–455; fail copy 476–477). Striker **does** fail when a spent attempt lands beyond Chebyshev 2 (`recordChallengeDirectHit` 387–397; `isChallengeFailed` `direct_hit` 458–459; fail copy 478–479). `hard_3` **does** fail when `maxApUsedInTurn > 8` (452–453). Turn-limit never-Failed stays 10-25-003. Flat ≤ 8 auto-complete stays 09-26-001.

**KEEP this run:** Death Realm copy (quiet map, 20/40, half of linear orb HP, portal escape — `GameOverModal.tsx` 52–80; `respawnHpAfterDeath` `deathPenalty.ts` 138–140; `generateDeathRealmMap` WX 5388–5457). BuffShop elixir +3 AP / boots +2 MP / charm 20 absorb / fury ×1.25 for 3 turns (`BuffShop.tsx` 49–76; `handleUseItem` WX 3575–3589; fury multiply `spellEngine.ts` 895–898). Attack Nearest on the selected spell (`BattleUIPanel.tsx` 830–843; `attackNearestEnemy` WX 17218+). Dungeon live HUD depth chip (`WX` 17574) and portal “Continue Chain (d/max)” (`WX` 7920–7922) match refs. White-portal Sanctuary “Rest” stays 09-29-002.

---

ACTION_ID: PXA-2026-10-26-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Summon Bomber card says rush-and-explode; spellbook kit is Inferno at 5 AP on a 1 AP unit; player control greys the only kit forever and never offers explode  
CATEGORY: summons  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Card: “Summons a Bomber that rushes and explodes.” (`spellData.ts` 634–660: `summonAI: "bomber"`, `summonKit: ["spell-inferno"]`, `summonUnitDef.ap: 1`, `mp: 4`, `summonLifespan: 3`). Inferno is 5 AP (`spellData.ts` 502–519). Spellbook Summon abilities block prints leveled HP/AP/MP/lifespan from the same formulas as spawn (`SpellbookModal.tsx` 246–259, 319–361) — so the book shows **1 AP** beside a kit row whose only spell costs **5 AP** (379–429 lists kit names/descriptions, not a cost gate). Player-side summons **always** enter control mode (`WX` 14418–14422: “Do NOT call setBattlePhase("enemy")”); `SummonControlPanel` disables a slot when `currentAp < spell.apCost` (`SummonControlPanel.tsx` 343). At spawn `currentAp = maxAp = 1` (`summonSpawn.ts` 147–184; `getSummonBaseStats` `progression.ts` 229–232). The only kit button is permanently grey. There is no explode control. The explode path lives in `runBomber` (`summonAI.ts` 351–387: adjacent / last-turn AoE then `summon.hp = 0`) and is only reached after `tryKitCast(..., "spell-inferno")` fails (`summonAI.ts` 575–580) — a path player Bombers never take. EBMA-006 owns AI `summonExecutor` Inferno/kamikaze not ticking; this ID is the **player-facing** identity: card + book + panel teach a kamikaze / Inferno fantasy the control surface cannot pay. Lifespan chips and Wolf/Archer/Wisp/Sentinel AP vs their kits are not this ID. Summon upgrade 10× tag stays 09-22-002. Haste on summon `maxMp` stays 10-25-002.  
SYSTEMS_AFFECTED: summons (Bomber card / kit / control panel), spells (Inferno as kit id), visual feedback (spellbook 1 AP + Inferno row; grey kit slot), challenges (Striker range on a kit the Bomber cannot cast — orthogonal)  
RECOMMENDED_ACTION: REWORK to one Bomber identity. Recommend: (a) kit a real 1-AP detonate (or rush-melee) and print that on the card, **or** (b) raise Bomber `ap` to ≥ Inferno’s cost and change the card to “casts Inferno,” **or** (c) drop Inferno from `summonKit` and surface explode on the control panel when adjacent / last turn. Spellbook AP chip and kit list must agree with what the panel can spend. Do not “fix” by routing player Bombers through AI explode without a visible control. Do not change Wolf/Archer/Wisp/Sentinel here. Do not retouch Inferno’s silent CD (09-27-002 / #696).  
AUTONOMY: HUMAN_DESIGN_REQUIRED to pick kamikaze vs Inferno caster. ORCHESTRATOR_MAY_DRAFT (c) panel explode affordance + unit test that a controlled Bomber with 1 AP can spend its kit **or** the card/book no longer list Inferno.  
DEPENDENCIES: EBMA-2026-09-01-006 (AI Bomber neither tick nor explode — orthogonal; do not close it here). PXA-2026-08-31 summon KEEP (five archetypes — Bomber must stay a real archetype after this ID). PXA-2026-09-22-002 (10× upgrade tag — orthogonal). PXA-2026-10-25-002 (Haste / summon budget — orthogonal). PXA-2026-09-27-002 / #696 (Inferno CD on the gifted card — orthogonal). Does not close EBMA-006.  
REGRESSION_RISK: HIGH if Bomber gains 5 AP and live Inferno (burst + Striker range-3). MEDIUM if explode becomes a 1-AP panel button (suicide timing). LOW if only the card/book drop Inferno and describe walk-until-fade. Do not restack RAF / mapGen. Do not change `summonLifespan` math.  
VALIDATION_REQUIRED: Spellbook Bomber: AP chip and kit row describe a spend the panel can make. Control a Bomber at L1: either cast the kit once, or explode when adjacent / last lifespan turn, matching the card — never a permanent grey Inferno with no other action. Enemy-side AI Bomber path unchanged except as EBMA-006. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-26-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Victory recap Dungeon Chain badge always prints Depth 1/? while the × multiplier is the live depth  
CATEGORY: dungeons  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live chain HUD is honest: `⚔️ Dungeon {depth}/{maxDepth}` (`WX` 17561–17575) and portal label `Continue Chain (${depth}/${max})` (`WX` 7920–7922). Multiplier table is `[1, 1.5, 2.0, 2.5, 3.0, 4.0]` by depth (`portalRules.ts` 148–161); victory applies it to **Doka only** (`WX` 12428–12441; `finalExp` at 12374–12377 has no `chainMult`). Recap UI: “Depth {dungeonDepth ?? 1}/{dungeonMaxDepth ?? "?"} — {dungeonMultiplier}× Doka multiplier applied” (`PostBattleRecap.tsx` 448–479). Victory payload sets `dungeonMultiplier: chainMult || 1` and **never** sets `dungeonDepth` / `dungeonMaxDepth` (`WX` 12456–12472). So a depth-3 fight that paid 2.5× Doka shows **“Depth 1/? — 2.5×”**. The “× Doka” noun matches the persist path (XP is not chain-multiplied when `PREAPPLIED_REWARD_MULTIPLIER` is 1 — `rewardResolver.ts` 46, 147–152, `WX` 12532–12538). The Depth line is the lie. White-portal / Sanctuary “Rest” stays 09-29-002. Unused rush `combinedMechanic` stays PXA-003. Hidden Doka lottery / empty `dokaBreakdown` stays 09-25-001. Dummy `"Battle Challenge"` stays 09-25-002.  
SYSTEMS_AFFECTED: dungeons (recap badge), visual feedback (PostBattleRecap), rewards (Doka chainMult already correct)  
RECOMMENDED_ACTION: SIMPLIFY the badge to the live refs. Recommend `finalRecapData.dungeonDepth = dungeonChainDepthRef.current` and `dungeonMaxDepth = dungeonChainMaxDepthRef.current` (or drop the Depth clause and print only `×{chainMult} Doka`). Do not multiply XP by the chain here unless design wants that and the copy says so. Do not change `dungeonDokaMultiplierFor`. Do not rewrite Sanctuary rest fantasy (09-29-002).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT wiring the two depth fields on `finalRecapData` plus a unit/assert that depth 3 → badge “Depth 3/N — 2.5×”. HUMAN_DESIGN_REQUIRED only if XP should also scale.  
DEPENDENCIES: PXA-2026-09-25-001 (lottery / empty breakdown — do not fill `dokaBreakdown` here). PXA-2026-09-25-002 (recap challenge name — orthogonal). PXA-2026-09-29-002 (Sanctuary Rest — orthogonal). PXA-003 (`combinedMechanic` — orthogonal). Does not close those.  
REGRESSION_RISK: LOW if only depth fields are filled. MEDIUM if XP suddenly gets `chainMult` without copy. Do not restack `resolveBattleRewards` double-multiply (PREAPPLIED path).  
VALIDATION_REQUIRED: Enter dungeon, reach depth ≥ 2, win a fight: world HUD depth matches recap Depth line; × matches `dungeonDokaMultiplierFor(true, depth)`; XP earned equals pre-chain `finalExp` (+ challenges), not ×depth. Depth-1 fight: “Depth 1/N — 1.5×”. Overworld: badge hidden (`multiplier` ≤ 1). `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-26-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: hard_3 AP-cap HUD never shows peak AP spent — only Turns/Damage — so “Never spend more than 8 AP” cannot be tracked mid-fight  
CATEGORY: challenges  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Card: “Never spend more than 8 AP in any single turn” (`challengeCompletion.ts` 81–86). Persist + fail predicates read `maxApUsedInTurn` (`isChallengeCompleted` 126–127; `isChallengeFailed` 452–453; fail copy 474–475). Spend is recorded (`recordChallengeApSpend` 311–321; Attack Nearest / cast / summon debit paths). `ChallengePanel` progress block always prints `Turns` and `Damage taken` (`ChallengePanel.tsx` 304–307), adds a Striker line only for `direct_hit` (308–312), and never prints `maxApUsedInTurn` / this-turn AP. Chip state is `onTrack = !failed && isChallengeCompleted` (185–192): at peak 0…8 the banner says **“On track!”** with no AP number; past 8 it says Failed. Untouchable/under-50 can use the Damage line; Striker has its own line; hard_3 has **no** AP line. 09-26-001 is that ≤ 8 auto-stamps while battle AP ≤ 8. 10-25-003 is turn-limit chips that never Failed. This ID is the missing AP tracker for the AP-cap contract. Do not hide the HUD (09-22-003 / #364). Do not change the ≤ 8 formula here.  
SYSTEMS_AFFECTED: challenges (hard_3), visual feedback (ChallengePanel progress), rewards (150 Doka / 450 XP still persist-gated on peak ≤ 8)  
RECOMMENDED_ACTION: SIMPLIFY the progress block. Recommend printing `Peak AP in a turn: {maxApUsedInTurn}/8` (and optionally this-turn spend) when `condition === "under_8_ap_per_turn"`, same pattern as the Striker line. After 09-26-001 lands a fractional cap, print against that cap. Do not use `isChallengeFailed` as a persist gate. Do not hide the panel.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT the progress line + a component/test that hard_3 shows the peak. HUMAN_DESIGN_REQUIRED only if the peak should be hidden until first spend.  
DEPENDENCIES: PXA-2026-09-26-001 (flat ≤ 8 — this ID is HUD visibility of the peak; does not close 001). PXA-2026-10-25-003 (turn-limit Failed — orthogonal). PXA-2026-09-22-003 / #364 (click-steal — do not hide HUD). PXA-2026-10-24-002 (`easy_1` heal copy — orthogonal; healUsed is also unprinted but not this ID). Does not close 09-26-001 / 10-25-003.  
REGRESSION_RISK: LOW if only a progress line is added. Do not change `recordChallengeApSpend` or persist.  
VALIDATION_REQUIRED: Accept hard_3, dump 6 AP: panel shows Peak AP 6/8 (or design equivalent) and On track. Dump 9 AP: Failed copy + peak ≥ 9. Turn-limit challenges still show Turns (10-25-003). Striker line unchanged. HUD still visible after first action. `pnpm typecheck`.  
STATUS: NEW

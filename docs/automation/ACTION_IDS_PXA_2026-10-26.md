# ACTION_IDs — 2026-10-26 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
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

This file is the **union** of the same-day hunts on `0f5363f`: **001–003** (Bomber / dungeon Depth / hard_3 HUD), **004–006** (Mirror arming / Mark empty-floor / Strike FAIL unnamed), **007** (Wisp healer). Signature-slice files are pointers only — do not duplicate these IDs.

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21…10-25 audits. New IDs are new *reads* of the same bytes.

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

---

ACTION_ID: PXA-2026-10-26-004  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Mirror self-cast never reaches activateMirror — the gifted one-shot reflect is a 4-AP no-op on its only legal tile  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Card: “Reflects the next incoming spell back at the attacker” (`src/frontend/src/data/spellData.ts` 198–214: `isMirror: true`, `targetType: "self"`, `range: 0n`, `effectType: "defense"`, `apCost: 4n`). Targeting only allows the caster tile (`targeting.ts` 503–508 `targetType === "self"`). `resolvePlayerCast` arms Mirror **only inside** the damage-loop guard `if (targetEnemy || spell.hitsMultiple)` (`spellEngine.ts` 882–926): `activateMirror()` sits at 918–925. On the legal self tile there is no hostile `targetEnemy` (`spellEngine.ts` 737–747 uses `isActiveHostile`) and Mirror is not `hitsMultiple`, so the branch is skipped and the function falls through to bare `return "cast"` (`spellEngine.ts` 1027–1028) — AP is deducted (`WorldExploration.tsx` 17158–17165) with no `activateMirror` call. `effectType: "defense"` also misses the self-buff hoist (`isShieldSpell` requires `effectType === "buff"`, `spellEngine.ts` 634–636). `playerMirror.ts` 1–7 documents an older tile-key bug that made Mirror a 4-AP no-op; `activatePlayerMirror` now writes `"player"` (`playerMirror.ts` 12–14) and enemy cast correctly consumes that key (`WorldExploration.tsx` 16496–16500) — but the player path never writes it. FAIL still rolls on Mirror (`spellEngine.ts` 641–651: `!isPhysical`). 10-23-003’s “Mirror = 100% next-hit” leg assumes this arming works; without it the gifted signature is dead while Field/Void/Reflect Shield still roll. Barrier/Summon were hoisted out of the same guard (`spellEngine.ts` 817–856); Mirror was not.  
SYSTEMS_AFFECTED: spells (Mirror), visual feedback (no “Mirror active!” log on self-cast), enemies (boss kits that list `spell-mirror` still use other paths), admin (`isMirror` flag), challenges (no direct), terminology (Mirror vs Mirror Field)  
RECOMMENDED_ACTION: REWORK — hoist `isMirror` beside Timestep / Barrier / Summon so self-cast calls `activateMirror` before any hostile gate. Keep Mirror as the one-shot commitment once armed (10-23-003 still merges the other three rates). Do not change Field 20% / Void 25% / Reflect Shield 30% here.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT hoist + unit test: `resolvePlayerCast(spell-mirror, playerTile)` calls `activateMirror` once and returns `"cast"`; enemy single-target then `consumePlayerMirror` reflects. HUMAN_DESIGN_REQUIRED only if Mirror should require an enemy click (then reprint `targetType` / card).  
DEPENDENCIES: PXA-2026-10-23-003 (four rates — this ID is dead arming; do not close 003 until Mirror actually arms). PXA-2026-08-31 signature KEEP (Mirror must stay unique). Does not twin Field flavor announce (09-01-002). PXA-2026-10-26-005 (Mark empty-floor fallthrough — same `"cast"` hole, different verb).  
REGRESSION_RISK: LOW if only hoisting activation (fights get a real 4-AP defense). MEDIUM if FAIL exemption is added without card copy. Do not restack enemy consume or RAF / mapGen.  
VALIDATION_REQUIRED: Select Mirror, click self: battle log “Mirror active!…”, `mirrorUnitsRef` has `"player"`. Next enemy single-target spell reflects and clears the token. Empty / enemy tiles are not required. Field/Void/Reflect Shield rates unchanged. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-26-005  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Mark card says “target tile” but targetType is enemy, placeMark only runs with a hostile on the click, and empty highlighted floors spend AP with no mark  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Deferred from 2026-10-25 (“Mark still writes a tile … while `targetType` is enemy”) — verified on `0f5363f`. Card: “Mark target tile — next spell on that tile deals x2 damage” (`spellData.ts` 161–177: `isMark: true`, `targetType: "enemy"`, `range: 4n`). `placeMark` writes a **tile key** (`WorldExploration.tsx` 9403–9405). ×2 + consume use the **cast click** `gridPos` (`WX` 3331–3334, 3390–3393). Resolve only enters the Mark branch when `targetEnemy || hitsMultiple` (`spellEngine.ts` 882, 928–936) — empty floor never calls `placeMark` and still `return "cast"` (1027–1028) after AP spend. Preview for `targetType: "enemy"` accepts any in-range non-barrier floor (`targeting.ts` 669–687). A placed mark is **invisible** (no `drawBarrierTower`; `markedTilesRef` is write + damage-read only). ×2 keys off the follow-up **click cell**, so a walking pawn leaves the bomb; Sacrifice uses `dealDamage` (`spellEngine.ts` 749–761) and never consults the mark; `hitsMultiple` passes the same click into every hit (list shape stays 10-25-001). Sacrifice on empty still `loseSelfHp` (`spellEngine.ts` 749–763) — same empty-enemy-type family. 10-25 deferred this as weaker than `hitsMultiple`; it is now a full signature identity fracture. Not a twin of 10-26-004 (Mirror self-cast behind the same guard).  
SYSTEMS_AFFECTED: spells (Mark, empty-floor Swap / Sacrifice), targeting, visual feedback (no mark paint vs Barrier towers), challenges (Sacrifice self-HP on empty still records via `loseSelfHp` at `WX` 9374–9387)  
RECOMMENDED_ACTION: REWORK to one Mark rule. Recommend: (a) `targetType: "ground"` + hoist `isMark` like Barrier so empty tiles place marks **and paint the cell**; **or** (b) reprint as “Mark an enemy’s cell” and `abort` empty execute. Strand rule must be on the card if marks stay tile-keyed after the unit moves. Fix Sacrifice to `abort` without `targetEnemy`. Do not change ×2 math once a mark is live. Do not change Chain Lightning’s list here (10-25-001).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT hoist Mark + empty-tile place **or** empty-tile abort, plus unit tests: Mark on empty either places or aborts (never silent AP); Mark on enemy then Strike on that tile ×2 and consumes; Sacrifice without hostile does not call `loseSelfHp`. HUMAN_DESIGN_REQUIRED to pick tile-trap vs enemy-tag identity.  
DEPENDENCIES: PXA-2026-10-25-001 (AoE/click geometry — orthogonal). PXA-2026-10-22-002 (Barrier ground hoist / paint). PXA-2026-10-26-004 (Mirror behind the same hostile gate — hoist sibling, do not merge verbs). Does not twin Barrier duration.  
REGRESSION_RISK: MEDIUM if Mark becomes true ground (players pre-place traps). LOW if only empty execute aborts. HIGH if ×2 applies to every bounce from a marked click without card copy. No mapGen / RAF.  
VALIDATION_REQUIRED: Mark selected: empty in-range floor either gains a **visible** mark **or** rejects with no AP loss. Mark on pawn, Strike same tile: ×2 once, mark gone. Mark on pawn, pawn walks away, Strike new tile: no ×2; Strike old empty tile: matches chosen rule. Sacrifice empty adjacent: no HP loss. Barrier still paints. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-26-006  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Strike silently skips FAIL while the card only teaches RES vs SP  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Prior KEEP: “Physical Strike skipping FAIL is KEEP **if** FAIL remains the only miss **and** the card says so.” Card today: “A direct physical attack. Only RES applies (not SP).” (`spellData.ts` 9–25: `isPhysical: true`). No FAIL / fizzle / accuracy sentence. Engine: FAIL roll is `if (!isPhysical)` (`spellEngine.ts` 641–651) — Strike never fizzles. Sheet still shows FAIL% (`WX` ~3646 / 18560). 09-27-003 is the Strike/log **SP-as-inbound** lie; this ID is the **unnamed miss exemption**. Windstorm 30% still rolls on Strike after the FAIL skip (`spellEngine.ts` 909–914; CD side-effect stays 10-21-002) — Strike is not “never misses,” only “never FAIL.”  
SYSTEMS_AFFECTED: spells (Strike), visual feedback (FAIL% sheet vs Strike reliability), terminology (FAIL vs Windstorm), challenges (Striker path uses Strike)  
RECOMMENDED_ACTION: SIMPLIFY — reprint Strike as “Cannot FAIL (Windstorm can still blow it off course)” **or** remove the `!isPhysical` exemption so FAIL is universal. Do not change RES/SP mitigation copy here (09-27-003). Do not change Windstorm rates (09-22-001 / 10-21-002).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT card string + spellbook subtitle. HUMAN_DESIGN_REQUIRED to delete the exemption instead of naming it.  
DEPENDENCIES: PXA-2026-09-22-001 (FAIL×Windstorm stack). PXA-2026-09-27-003 (SP/SR card/log — orthogonal). PXA-2026-10-21-002 (Windstorm miss → Inferno CD). Does not close those.  
REGRESSION_RISK: LOW for copy-only. HIGH if FAIL suddenly applies to Strike (melee reliability drops ~20%).  
VALIDATION_REQUIRED: Spellbook Strike names FAIL skip **or** a FAIL roll can fizzle Strike at L1. Windstorm can still miss Strike. RES-only / no-SP line unchanged in meaning. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-26-007  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Wisp does not heal allies — kit heals cost 3–4 AP on a 2 AP body, control cannot target the champion, resolveSpellCast spends Blood Mend on a CHC buff that never heals  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 10-26-001 carved Wisp out (“Wolf / Archer / Sentinel / Wisp kits are spendable”). Re-read: they are not, and the card is still a healer lie. Gifted card: “Summons a Wisp that heals allies.” (`spellData.ts` 663–689: `summonAI: "healer"`, `summonUnitDef.ap: 2`, kit `["starter-heal", "spell-rallying-cry"]`). Blood Mend is 3 AP (`spellData.ts` 84–101); Rallying Cry is 4 AP (416–435). Control panel greys a slot when `currentAp < Number(apCost)` (`WX` 18993–18996; `SummonControlPanel.tsx` 343). At spawn `currentAp = maxAp = 2` (`getSummonBaseStats` / `summonSpawn.ts` 147–184). **Both kit buttons are permanently grey** — same affordance hole as Bomber 001, different verb (heal vs explode) and 001 explicitly excluded this unit. If AP were raised, the kit still could not restore the champion: both spells are `targetType: "self"`; `resolveSummonControlClickTarget` self = caster tile only (`summonControlCast.ts` 146–148); a locked test refuses any other Blood Mend cell (`summonControlCast.test.ts` 353–386). Ally targeting matches only `e.isSummon === true` (`targeting.ts` 527–544); the player is not in `combatantsRef` (`WX` 14259–14261). Kit resolve uses `resolveSpellCast` (`WX` 9849–9872), which applies `buffStat` **before** `healAmount` (`spellEngine.ts` 507–558), so Blood Mend would stamp `modifier: 0.15` CHC (×0.15, `statusEffects.ts` 26–62) on the Wisp and never grant 12 HP. Summon `computeDamage` hard-codes `isCrit: false`. `ctx.heal` no-ops unless `isPlayerHealTargetId` (`WX` 9186; `challengeCompletion.ts` 239–241; test `"wisp-1"` is false). Unused `runHealer` / `decideSummonHealer` would heal an owner and is unreachable from control mode (`summonIntegration.ts` 4; `WX` 14236–14238). 10-24-002 is `easy_1` copy vs `healUsed`. Player Blood Mend CHC on the **champion** path is EBMA. 10-26-001 is Bomber Inferno/explode. This ID is the healer summon answering none of the four questions.  
SYSTEMS_AFFECTED: spells (Wisp, Blood Mend, Rallying Cry), summons (control panel + kit resolve), visual feedback (spellbook kit lists two heals on a 2 AP body), challenges (`easy_1` / Untouchable — a Wisp that cannot restore the champion cannot fail or save those contracts), admin-enabled content (`summonAI: "healer"` vs live control)  
RECOMMENDED_ACTION: REWORK so the card, the kit, and a restore agree. Recommend: (a) one owner-heal kit spell whose AP the Wisp can pay and whose execute calls `ctx.heal("player", …)` without the `buffStat` early-return; (b) drop Rallying Cry / Blood Mend from the Wisp kit **or** split heal and CHC; (c) spellbook subtitle must match (a). Do not teach `runSummonAI` as a second healer language. Do not reprint `easy_1` here (10-24-002). Do not change Bomber here (10-26-001).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT a unit test that a player-controlled Wisp restore increases **champion** HP (or the card/kit no longer say “heals allies” and the 2 AP body can spend its kit), plus moving heal before buff **or** dropping `buffStat` on the kit heal. HUMAN_DESIGN_REQUIRED to pick owner-heal vs self-heal vs ally-summon-heal.  
DEPENDENCIES: PXA-2026-10-26-001 (Bomber AP/kit — same control-panel family, different identity; do not close 001 by greying Wisp too). PXA-2026-10-24-002 (`easy_1` heal copy — orthogonal). EBMA Blood Mend / Rally CHC on the **player** path. PXA-2026-08-31 KEEP of the five-pack (healer is blocked until this ID). Does not close 001 / 10-24-002.  
REGRESSION_RISK: HIGH if Wisp suddenly heals the champion for 12 every Wisp turn (`easy_1` / Untouchable become Wisp-gated). MEDIUM if only the card reprints “cannot act.” LOW if kit is replaced with a 2-AP owner-heal the panel already aims. Do not restack RAF / mapGen.  
VALIDATION_REQUIRED: Spellbook Wisp: AP chip and kit row describe a spend the panel can make. Summon Wisp, open the control panel: either a kit button is live **and** using it restores champion HP (or clearly the Wisp), or the card no longer says “heals allies.” Blood Mend on the champion tile is legal **or** not advertised. `easy_1` still uses `healUsed` (10-24-002). Bomber still 10-26-001. `pnpm typecheck`.  
STATUS: NEW

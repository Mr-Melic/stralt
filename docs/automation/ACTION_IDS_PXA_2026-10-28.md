# ACTION_IDs — 2026-10-28 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-10-28.md`](./PX_COHERENCE_AUDIT_2026-10-28.md)

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
- `PXA-2026-10-22-001` … `003` (PR **#907** — `res_sp` unread + drain healAmount vs 50%-once; Barrier 2 vs 3; three MP-slow names)
- `PXA-2026-10-23-001` … `003` (PR **#955** — Weaken `dmg` / Cursed Wound `healRecv` unread on the pack; Shield RES skips Crush while Charm fights it; four reflect rates)
- `PXA-2026-10-24-001` … `003` (PR **#1008** — player SP inbound on enemy spells + RES twice; `easy_1` “healing spells” vs any restore; Iron Skin/Haste/Enrage “own” vs ally)
- `PXA-2026-10-25-001` … `003` (PR **#1067** — gifted `hitsMultiple` vs cards; Haste +2 unread on restore / summon budget; turn-limit HUD never Failed)
- `PXA-2026-10-26-001` … `007` (PR **#1144** — Bomber card/kit/1 AP; dungeon recap Depth 1/?; hard_3 HUD omits peak AP; Mirror dead self-arm; Mark empty no-op; Strike FAIL unnamed; Wisp healer 2 AP vs 3–4 AP kit)
- `PXA-2026-10-27-001` … `005` (PR **#1175** — Timestep shield early-return; Sacrifice empty HP tax; overworld recap omits challenge Doka; easy_1/hard_1 HUD omits healUsed; Striker Yes at 0 attempts)

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21…10-27 audits. New IDs are new *reads* of the same bytes. The 10-26 KEEP of Mark’s ×2 verb (after empty-floor 005) is withdrawn by **001**.

**Do not twin** 10-26-005 (Mark empty = no `placeMark`; this run is ×2 on a placed mark). Do not twin 10-27-002 (Sacrifice empty HP tax). Do not twin 10-21-002 (Windstorm miss → Inferno CD; this run is empty Inferno → CD). Do not twin 09-27-002 (Inferno silent CD on the card). Do not twin 10-21-001 (three fire names). Do not twin 09-25-002 (dummy `"Battle Challenge"` recap name). Do not twin PXA-009 (offer shaping / pacifist vs no-heal). Do not twin PXA-012 (Feats vs Achievements names). Do not twin EBMA-004 (player `debuffStat` never applying — empty Frost Bolt/Weaken still burn AP here even if the debuff later lands). Do not twin Swap empty KEEP.

**KEEP this run:** Death Realm copy; BuffShop elixir/boots/charm/fury; Attack Nearest on the selected spell (player tile); dungeon **live** HUD depth; Untouchable/Striker fail chips; Enrage +40% / duration 2 write **and** player `computeDamage` `"dmg"` read; Poison≡Venom numbers (MERGE under PXA-002 only); Swap hostile-only / no LoS / empty AP-burn; Drain empty abort; Wolf/Archer/Sentinel kits spendable; accepted challenge HUD visibility (`shouldShowChallengeHud`).

---

ACTION_ID: PXA-2026-10-28-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Gifted Mark ×2 only fights computeDamage — Inferno/Poison/Venom/Sacrifice neither double nor consume the mark  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Card: “Mark target tile — next spell on that tile deals x2 damage” (`src/frontend/src/data/spellData.ts` 161–177: `id: "spell-mark"`, `isMark: true`, `targetType: "enemy"`). Engine log: “Next hit deals x2 damage!” (`spellEngine.ts` 928–937). Live double is only `computeDamage` `markedTilesRef.has(markKey); dmg *= 2` (`WorldExploration.tsx` 3331–3335) plus consume in `calculatePlayerDamage` (3390–3393). That helper is the player damage-loop path. Inferno / Poison Arrow / Venom Strike are `isDotSpell` and return at `spellEngine.ts` 778–814 (`applyEffect` DoT, no `calculatePlayerDamage`). Inferno also has `damage: BigInt(0)` (`spellData.ts` 502–523) so there is no blast to double. Sacrifice uses `ctx.dealDamage` (`spellEngine.ts` 754–760) and never reads `markedTilesRef`. Swap / empty Inferno also skip consume. 10-26-005 is Mark **empty**: `placeMark` is inside `if (targetEnemy \|\| hitsMultiple)`, so empty never places. This ID assumes a mark **was** placed (occupied click, 005 still open). Strike on a marked tile does double — the verb exists for the Strike-shaped loop only. Silent Inferno CD is 09-27-002. Three fire names are 10-21-001. Windstorm miss → Inferno CD is 10-21-002.  
SYSTEMS_AFFECTED: spells (Mark, Inferno, Poison Arrow, Venom Strike, Sacrifice), visual feedback (×2 log vs no double), targeting (tile trap identity)  
RECOMMENDED_ACTION: REWORK to one verb. Recommend: any player spell that resolves on the marked tile (DoT apply, Sacrifice `dealDamage`, damage-loop) consumes the mark and doubles the damage that spell actually deals (DoT per-turn or Sacrifice 3× HP, not a phantom blast). **Or** reprint the card as “next Strike-shaped hit on that tile deals x2” and stop logging “next hit / next spell.” Do not change empty Mark here (10-26-005). Do not change Inferno CD copy here (09-27-002). Do not make Mark a duration buff.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT a shared `consumeMarkMultiplier(gridPos)` used by `calculatePlayerDamage`, the DoT branch, and Sacrifice `dealDamage`, plus tests: Mark then Strike ×2 and consume; Mark then Inferno doubles `dotDamagePerTurn` (or the first tick) and consume; Mark then Sacrifice doubles the 3× hit and consume; second Strike after consume is ×1. HUMAN_DESIGN_REQUIRED only if Mark should be “next *any* occupancy” including enemy Crush (it is not, today).  
DEPENDENCIES: PXA-2026-10-26-005 (empty placeMark — orthogonal; do not close 005 by fixing ×2 only). PXA-2026-08-31 signature KEEP (Mark must stay a unique tile trap once ×2 is real). PXA-2026-09-27-002 / PXA-2026-10-21-001 (Inferno card/CD/fire names — do not reprint Inferno here except as Mark evidence). Does not close 005 / 09-27-002 / 10-21-001.  
REGRESSION_RISK: MEDIUM — Mark+Inferno and Mark+Sacrifice become real combos (the card’s promise). LOW if only the card/log are reprinted to Strike-shaped hits. Do not restack RAF / mapGen. Do not double crit a second time (computeDamage already ×2 then crit ×2).  
VALIDATION_REQUIRED: Place Mark on a pawn, Strike: log ×2 mark, mark gone, damage doubled before RES. Place Mark, Inferno: burn is doubled **or** card no longer says “next spell”; mark gone after Inferno. Place Mark, Sacrifice: 3× HP is doubled **or** card excludes Sacrifice. Second Strike after consume is ×1. Empty Mark still 10-26-005. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-28-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Legendary challenges advertise Badge Untouchable/Blitz/Striker — persist and Feats never grant a badge  
CATEGORY: challenges  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `DEFAULT_CHALLENGES` legendary_1/2/3 set `rewards.badge` to `"Untouchable"` / `"Blitz"` / `"Striker"` (`src/frontend/src/utils/challengeCompletion.ts` 88–107). `ChallengePanel` prints `Badge: {currentChallenge.rewards.badge}` (`ChallengePanel.tsx` 287–290) next to Doka/XP. `CompletedChallengeReward` is `{ name, dokaReward, xpReward? }` with **no badge field** (`challengeRewards.ts` 1–5). `battleChallengePersistEntries` copies only doka/xp and hardcodes `name: "Battle Challenge"` (12–25). Grep: `rewards.badge` is written in DEFAULT_CHALLENGES and rendered in ChallengePanel; no persist, recap, or feat writer reads it. Recap dummy `"Battle Challenge"` / unused `_completedChallengeName` (`WX` 12321–12323, 12469) is 09-25-002. Feats still seed `pacifist_run` (no-heal overlap, PXA-009), not Untouchable/Blitz/Striker. Recap `Achievements Unlocked` uses feat configs (`PostBattleRecap.tsx` 539–541), never `rewards.badge`. The panel sells a third reward type that answers none of the four questions.  
SYSTEMS_AFFECTED: challenges (legendary_1/2/3), rewards (persist entries), visual feedback (ChallengePanel Badge line), achievements (no matching feat)  
RECOMMENDED_ACTION: SIMPLIFY to two reward types. Recommend: **delete** `rewards.badge` and the Badge line (Doka/XP already advertise the contract) **or** EXPAND into a real feat id granted through `attachRecapUnlocks` / `markAchievementUnlocked` on persist-complete (not a third currency). Do not persist a cosmetic string the Feats panel cannot show. Do not rename `"Battle Challenge"` here (09-25-002). Do not change offer randomness here (PXA-009).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT removing the Badge render + the `badge` field from `DEFAULT_CHALLENGES` (dead data). HUMAN_DESIGN_REQUIRED to invent Untouchable/Blitz/Striker feats with Doka rewards and recap chips.  
DEPENDENCIES: PXA-2026-09-25-002 (dummy recap name — orthogonal; do not close 002 by deleting the Badge). PXA-2026-08-31-009 (offer shaping / pacifist vs no-heal — orthogonal). PXA-2026-08-31-012 (Feats vs Achievements word — do not retitle the Feats button here). Does not close those.  
REGRESSION_RISK: LOW if only the Badge line/field is removed (wallet already ignores it). HIGH if a new feat is granted without going through `applyRewards` / recap unlock attach. Do not hide the challenge HUD (09-22-003 / #364).  
VALIDATION_REQUIRED: Accept Untouchable: panel shows Doka/XP, no Badge line **or** recap/Feats show an Untouchable feat after persist-complete. Decline: no feat. Dummy `"Battle Challenge"` recap array unchanged until 09-25-002. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-28-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Empty highlighted enemy-type floors still return "cast" for Strike/DoT/debuff — Inferno also starts its cooldown  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player preview for `targetType: "enemy"` accepts any in-range non-barrier floor with **no occupant check** (`targeting.ts` 669–687). `resolvePlayerCast` end `return "cast"` (`spellEngine.ts` 1027–1028) when none of the earlier branches fired. Drain empty already `abort`s (867–873). Mark empty never `placeMark` (10-26-005). Sacrifice empty always `loseSelfHp` (10-27-002). Swap empty is KEEP (hostile-only; AP burn, no HP). Leftover gifted book on empty: Strike (`isPhysical`, 2 AP), Poison Arrow / Venom Strike / Inferno (DoT branch requires `targetEnemy`, 778), Frost Bolt / Slow / Weaken / Expose / Shadow Veil / Cursed Wound (no DoT, no damage loop). `castResultSpendsAp("cast")` is true (`challengeCompletion.ts` 330–331). `castResultAppliesCooldown("cast")` is true (349–350), so empty Inferno (`cooldown: 3`, `spellData.ts` 519) **locks the spell for 3 turns** without a burn. 10-21-002 is Windstorm miss returning `"cast"` inside the damage loop (909–914) — a hostile was on the tile. This ID is **no hostile**. EBMA-004 is player `debuffStat` unread on a **hit**; empty never applies the effect. Do not fold Swap into this ID.  
SYSTEMS_AFFECTED: spells (Strike, Poison Arrow, Venom Strike, Inferno, Frost Bolt, Slow, Weaken, Expose, Shadow Veil, Cursed Wound), targeting (empty `enemy` highlight), challenges (hard_3 AP spend on a miss; Striker attempts increment in `executeCastAttempt` on `"cast"`), visual feedback (silent AP burn; Inferno CD pip)  
RECOMMENDED_ACTION: REWORK empty execute to one miss language. Recommend: `abort` (no AP, no CD) when `targetType === "enemy"` and `!targetEnemy` and the spell is not Swap/Mark/Sacrifice (those have their own IDs) — **or** refuse empty floors in targeting so they never highlight. Strand rule must be on the card if empty AP burn is intended (it is not, per Strike “direct physical attack” / Inferno “burns target”). Do not change Drain abort. Do not change Swap empty KEEP. Do not change Mark empty (10-26-005) or Sacrifice empty (10-27-002) in this ID except to share a helper.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT empty-tile `abort` (or targeting reject) + tests: Strike/Poison/Inferno on empty do not debit AP and Inferno does not write cooldown; Strike on a pawn still deals; Drain empty still aborts; Swap empty still `"cast"` until a human says otherwise. HUMAN_DESIGN_REQUIRED only if empty AP burn is a real identity for the whole book (then reprint every card).  
DEPENDENCIES: PXA-2026-10-26-005 (Mark empty — same targeting family, different verb; do not close 005 by aborting Strike only). PXA-2026-10-27-002 (Sacrifice empty HP tax — do not close 002 here). PXA-2026-10-21-002 (Windstorm miss CD — hostile present; do not close). PXA-2026-10-27-005 (Striker attempts — `"cast"` on empty currently counts; abort should not). Does not close those.  
REGRESSION_RISK: LOW if only empty execute aborts (missed clicks stop taxing AP / Inferno CD / Striker / hard_3). MEDIUM if targeting suddenly requires occupancy for **Swap/Mark** in this ID (do not). No mapGen / RAF.  
VALIDATION_REQUIRED: Strike selected: empty adjacent floor either does not highlight **or** rejects with no AP loss. Strike on a pawn: 2 AP, damage. Inferno on empty: no CD pip. Inferno on a pawn: burn + CD. Drain empty still aborts. Swap empty still KEEP. Mark empty still 10-26-005. Sacrifice empty still 10-27-002 until that ID lands. `pnpm typecheck`.  
STATUS: NEW

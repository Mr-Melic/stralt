# ACTION_IDs — 2026-10-27 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-10-27.md`](./PX_COHERENCE_AUDIT_2026-10-27.md)

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

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21…10-26 audits. New IDs are new *reads* of the same bytes. The 10-26 KEEP of Timestep mechanics is withdrawn by **001**.

**Do not twin** PXA-012 (Timestep vs Time Warp **names**). This run is the dead restore. Do not twin 10-26-004 (Mirror behind the hostile damage loop — different gate, different `effectType`). Do not twin 10-26-005 (Mark empty = no `placeMark`; Sacrifice empty = HP tax). Do not twin 09-25-001 (lottery / empty breakdown) or 09-25-002 (dummy `"Battle Challenge"`). Do not twin 10-26-002 (recap Depth). Do not twin 10-24-002 (`easy_1` copy). Do not twin 10-26-003 (hard_3 peak AP). Do not twin 10-25-003 (turn-limit Failed). Do not twin 10-26-001 / 007 (Bomber / Wisp).

**KEEP this run:** Death Realm copy; BuffShop elixir/boots/charm/fury; Attack Nearest; dungeon **live** HUD depth; Untouchable/Striker fail chips; Enrage +40% / duration 2 write; Poison≡Venom numbers (MERGE under PXA-002 only); Swap hostile-only / no LoS; Wolf/Archer/Sentinel kits spendable; accepted challenge HUD visibility (`shouldShowChallengeHud`).

---

ACTION_ID: PXA-2026-10-27-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Gifted Timestep never restores AP/MP — self+buff is classified as a shield spell and returns before isTimestep  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Card: “Resets your AP and MP to full. Once per battle.” (`src/frontend/src/data/spellData.ts` 215–231: `id: "spell-timestep"`, `apCost: 0n`, `effectType: "buff"`, `targetType: "self"`, `isTimestep: true`, no `buffStat`). Targeting only allows the caster tile (`targeting.ts` 503–508). `resolvePlayerCast` sets `isShieldSpell` for any `(self|ally)+buff` (`spellEngine.ts` 634–636). On `isPlayerTile` the shield branch optionally applies `buffStat`, then **always** `recordSpellType` + `return "cast"` (680–717) — Timestep has no `buffStat`, so this is a silent no-op. `if (spell.isTimestep)` at 722–734 (`consumeTimestep`, `restoreApMp`, log “Timestep! AP and MP restored”, return `"no_ap"` so the caller does not deduct) is dead code on the only legal tile. Callbacks exist (`WorldExploration.tsx` 9350–9373) and `timestepUsedRef` still resets each fight (1847, 12177) for a consume that cannot fire. FAIL still rolls (`!isPhysical`, `spellEngine.ts` 641–651): ~20% of clicks fizzle a 0-AP spell that would have done nothing; the rest are infinite silent casts. `playerCastPlan.test.ts` 115–137 only asserts the 0-AP tile is *plannable*, not that resolve restores. 10-26 KEEP of “Timestep mechanics” assumed 722 ran. Barrier/Summon were hoisted out of a later guard (817–856); Timestep sits *before* that guard and dies in the earlier shield return. Mirror dead-arm is 10-26-004 (`effectType: "defense"`, hostile-loop). Time Warp 15s name rhyme is PXA-012. Haste/Enrage/Iron Skin *want* the shield branch (they have `buffStat`; unread Haste restore is 10-25-002).  
SYSTEMS_AFFECTED: spells (Timestep), visual feedback (no restore log; FAIL can still fizzle), progression (once-per-battle AP/MP reset is the signature), admin (`isTimestep` flag advertises a restore the player path cannot reach)  
RECOMMENDED_ACTION: REWORK — hoist `isTimestep` **above** the `isShieldSpell` early-return (same family as Barrier/Summon hoist, earlier in the function) so self-cast calls `consumeTimestep` / `restoreApMp` once. Keep once-per-battle. Do not change Time Warp 15s. Do not make Timestep a `buffStat` shield. Do not exempt FAIL unless the card says so.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT hoist + unit test: `resolvePlayerCast(spell-timestep, playerTile)` calls `restoreApMp` once, returns `"no_ap"`, second cast in the same fight aborts with the once-per-battle log. HUMAN_DESIGN_REQUIRED only if Timestep should become a duration buff instead of an instant reset.  
DEPENDENCIES: PXA-012 (name vs Time Warp — orthogonal; do not close it here). PXA-2026-10-26-004 (Mirror arming — sibling hoist, different gate). PXA-2026-10-25-002 (Haste restore — do not retouch Haste here). PXA-2026-08-31 signature KEEP (Timestep must stay unique once it actually resets). Does not close 004 / PXA-012.  
REGRESSION_RISK: MEDIUM — fights gain a real once-per-battle full AP/MP (the card’s promise). LOW if only tests assert the current no-op. Do not restack RAF / mapGen. Do not change `restoreApMp`’s 8/4 + additive-mod formula (forge 10/5 stays 10-21-003).  
VALIDATION_REQUIRED: Select Timestep, click self at spent AP/MP: log “Timestep! AP and MP restored to full”, bars refill to battle floor (+ live additive mods), AP not deducted below that. Second Timestep same fight: abort, bars unchanged. FAIL can still fizzle the first click. Time Warp announce still 15s. Mirror/Haste/Enrage paths unchanged. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-27-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Sacrifice on empty/no-hostile still loseSelfHp — the card is a 20% HP trade, the empty floor is a bleed  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Card: “Lose 20% of own HP **to deal** 3x that amount as damage **to target**” (`spellData.ts` 233–250: `isSacrifice: true`, `targetType: "enemy"`, `range: 1n`, `apCost: 3n`). Preview for `targetType: "enemy"` accepts any in-range non-barrier floor with **no occupant check** (`targeting.ts` 669–687). `resolvePlayerCast` Sacrifice branch (`spellEngine.ts` 749–763) **always** computes `hpLoss = floor(hp * 0.2)`, `loseSelfHp`, logs the loss, and only then `if (targetEnemy) dealDamage(id, hpLoss * 3)`. Empty / ally-summon / corpse tiles still `return "cast"` (3 AP spent). `loseSelfHp` records challenge self-HP (`WorldExploration.tsx` 9374–9387) so Untouchable / under-N-damage can fail from a missed click. 10-26-005 is Mark empty: hostile-gate skip, no `placeMark`, no HP tax, `"cast"`. 10-26-005 *recommended* Sacrifice abort and did not file it. Swap empty is KEEP (hostile-only; AP burn, no HP). Drain empty already `abort`s (`spellEngine.ts` 867–873) — Sacrifice does not.  
SYSTEMS_AFFECTED: spells (Sacrifice), targeting (empty `enemy` floors), challenges (Untouchable / under-50 / hard_1 self-HP from a miss), visual feedback (Sacrifice! Lost N HP with no damage line)  
RECOMMENDED_ACTION: REWORK to one trade. Recommend: `abort` (no HP, no AP) when `!targetEnemy`, matching drain’s empty guard — **or** refuse empty floors in targeting so they never highlight. Strand rule must be on the card if empty bleed is intended (it is not, per “to deal … to target”). Do not change the 20% / ×3 math once a hostile is on the tile. Do not change Mark here (10-26-005). Do not change Swap here.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT empty-tile abort (or targeting reject) + unit tests: Sacrifice on empty does not call `loseSelfHp` and does not deduct AP; Sacrifice on a living hostile loses 20% and deals 3×. HUMAN_DESIGN_REQUIRED only if empty bleed is a real identity (then reprint the card).  
DEPENDENCIES: PXA-2026-10-26-005 (Mark empty no-op — same targeting family, different verb; do not close 005 by aborting Sacrifice only). PXA-2026-08-31 signature KEEP (Sacrifice must stay a real HP trade). Challenge self-HP recording stays; it must not fire on a rejected miss. Does not close 005.  
REGRESSION_RISK: LOW if only empty execute aborts (missed clicks stop taxing Untouchable). MEDIUM if targeting suddenly requires occupancy for **all** `enemy` spells (Mark/Swap/Strike highlight set changes — do not do that in this ID). No mapGen / RAF.  
VALIDATION_REQUIRED: Sacrifice selected: empty adjacent floor either does not highlight **or** rejects with no HP/AP loss. Sacrifice on a pawn: 20% HP gone, 3× damage, 3 AP spent. Untouchable does not fail from an empty miss. Mark empty still 10-26-005. Drain empty still aborts. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-27-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Overworld victory recap omits challenge Doka while persist credits it — Rush recap already adds both  
CATEGORY: rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Challenge panel advertises Doka **and** XP (`ChallengePanel.tsx` 275–286; e.g. Untouchable 500 Doka / 1000 XP, `challengeCompletion.ts` 88–92). Overworld `handleBattleEnd` builds `challengeXpReward` from persist entries (`WorldExploration.tsx` 12313–12320) and feeds `clampApplyRewardsDeltas(totalDoka, finalExp + challengeXpReward)` (`12447–12449`) → recap `xpEarned` includes the challenge XP, `dokaEarned` is fight Doka **only** (`12462`). `finalRecapData` never sets `dokaFromChallenges` (`12456–12472`). Persist then passes `completedChallenges: challengePersistEntries` (`12528–12538`); `computeRewardDeltas` adds those Doka (`rewardResolver.ts` 155–162; `addChallengeRewardDeltas` in `challengeRewards.ts` 53–68). Boss Rush already does the honest sum: `dokaEarned: totalDoka + challengeDokaReward` and sets `dokaFromChallenges` (`WX` 12785–12891). `PostBattleRecap` never renders `dokaFromChallenges` (field is type-only at `PostBattleRecap.tsx` 17) — Rush is saved because the total sits in `dokaEarned`. Overlay is not refreshed from `resolveBattleRewards` except a threshold-feat path that still reuses original `finalRecapData` (`WX` 12563–12575). Recap is the mastery receipt; it currently under-reports the Doka the lock will pay. 09-25-001 is the hidden lottery + empty `dokaBreakdown: []` (`WX` 12468). 09-25-002 is dummy `completedChallenges: ["Battle Challenge"]` (`WX` 12469`) — Recap does not print that array. 10-26-002 is dungeon Depth 1/?.  
SYSTEMS_AFFECTED: rewards (overworld recap vs persist), challenges (advertised Doka), visual feedback (PostBattleRecap Doka line), dungeons (orthogonal — Depth is 10-26-002)  
RECOMMENDED_ACTION: SIMPLIFY overworld recap to the persist function. Recommend `dokaEarned = clamp(totalDoka + challengeDoka)` (same shape as Rush `12884`) and optionally set `dokaFromChallenges` **and render it**. Do not fill `dokaBreakdown` here (09-25-001). Do not rename `"Battle Challenge"` here (09-25-002). Do not multiply XP by dungeon chain here (10-26-002). Do not change `liveBattleChallengePersistEntries`.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT wiring challenge Doka into overworld `dokaEarned` (and a Recap line if `dokaFromChallenges` is set) plus a unit/assert: completed easy_1 → recap Doka = fight Doka + 50, matching `computeRewardDeltas`. HUMAN_DESIGN_REQUIRED only if challenge Doka should stay persist-only (then the panel must stop advertising it as a recap line).  
DEPENDENCIES: PXA-2026-09-25-001 (lottery / empty breakdown — do not fill rows here). PXA-2026-09-25-002 (dummy name — orthogonal). PXA-2026-10-26-002 (recap Depth — orthogonal). PXA-009 (offer shaping — orthogonal). Does not close those.  
REGRESSION_RISK: LOW if only the recap number matches persist (wallet already gained the Doka). MEDIUM if clamp order double-counts challenge Doka on persist. Do not restack `PREAPPLIED_REWARD_MULTIPLIER`.  
VALIDATION_REQUIRED: Accept easy_1, win without healing: recap `+Doka` equals persist `dokaDelta` (fight + 50), XP already includes 0 extra. Accept Untouchable, win at 0 damage: recap includes +500 Doka and +1000 XP. Decline / fail: recap Doka = fight only. Boss Rush recap still sums. Empty `dokaBreakdown` unchanged. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-27-004  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: easy_1 / hard_1 HUD never shows healUsed — only Turns/Damage — so “Win without healing” cannot be tracked until the fail chip  
CATEGORY: challenges  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Cards: easy_1 “Win without using healing spells” (`challengeCompletion.ts` 46–50); hard_1 “Win without healing and take under 30 damage” (67–72). Persist + fail read `healUsed` (`isChallengeCompleted` 116–123; `isChallengeFailed` 442–449; fail copy 468–473). WX passes `healUsed: challengeHealUsedRef.current` into the panel (`WorldExploration.tsx` 19195). `ChallengePanel` progress always prints Turns and Damage taken (304–307), adds a Striker line only for `direct_hit` (308–312), and never prints `healUsed`. After a restore the fail chip is honest (“Failed — a heal was used”). Before that the player cannot see the contract bit. 10-24-002 is the **copy** “healing spells” vs potions/drain/Wisp/Doka-to-HP. 10-26-003 is hard_3 **peak AP** missing. 10-25-003 is turn-limit never-Failed. 10-26-007 is Wisp unable to restore the champion (a Wisp that cannot heal cannot trip `healUsed` via kit — orthogonal). Do not hide the HUD (09-22-003 / #364).  
SYSTEMS_AFFECTED: challenges (easy_1 / hard_1), visual feedback (ChallengePanel progress), rewards (50 / 200 Doka still persist-gated on `!healUsed`)  
RECOMMENDED_ACTION: SIMPLIFY the progress block. Recommend printing `Heal used: Yes/No` (or “Restores: 0”) when `condition` is `no_healing` or `no_healing_under_30_damage`, same pattern as the Striker line. After 10-24-002 reprints the card, the line must use the same word as the card (heal vs any restore). Do not use `isChallengeFailed` as a persist gate. Do not hide the panel. Do not change `recordChallenge*` here.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT the progress line + a component/test that easy_1 shows healUsed. HUMAN_DESIGN_REQUIRED only to pick wording after 10-24-002.  
DEPENDENCIES: PXA-2026-10-24-002 (`easy_1` copy vs `healUsed` — this ID is HUD visibility of the flag; does not close 002). PXA-2026-10-26-003 (hard_3 peak AP — sibling meter). PXA-2026-10-25-003 (turn-limit Failed — orthogonal). PXA-2026-09-22-003 / #364 (click-steal — do not hide HUD). PXA-2026-10-26-007 (Wisp — orthogonal). Does not close those.  
REGRESSION_RISK: LOW if only a progress line is added. Do not change healUsed recording.  
VALIDATION_REQUIRED: Accept easy_1, no restore: panel shows Heal used No (or equivalent) and stays non-Failed. Use an in-battle potion / Blood Mend: chip Failed + Heal used Yes. hard_1 still shows Damage taken. hard_3 still 10-26-003. HUD still visible after first action. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-27-005  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Striker HUD prints “All casts within 2 tiles: Yes” at zero attempts — persist requires a spent attempt  
CATEGORY: challenges  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Card: “Win using only spells cast on targets within 2 tiles” (`challengeCompletion.ts` 102–107). Persist complete is `directHit === true && attempts > 0` (`isStrikerChallengeComplete` 420–428) because a lava / wait win with zero casts used to pay 400 Doka / 800 XP. `challengeDirectHitRef` **starts true** (`WorldExploration.tsx` 1260); attempts start 0. `ChallengePanel` prints only `All casts within 2 tiles: {directHit ? "Yes" : "No"}` (308–311) and never `directHitAttempts` (passed at WX 19197). `onTrack = !failed && isChallengeCompleted` (`ChallengePanel.tsx` 185–192): at attempts 0, `failed` is false (`isChallengeFailed` `direct_hit` is `!directHit` only, 458–459) and complete is false → chip **“Not met yet”** beside **Yes**. The Yes contradicts the chip and the persist rule. Fail chip on a long-range hit is KEEP (`challengeFailCopy` 478–479). 10-26-003 is missing hard_3 peak. 10-25-003 is turn-limit never-Failed. 09-26-001 is flat predicates. Do not hide the HUD.  
SYSTEMS_AFFECTED: challenges (legendary_3 Striker), visual feedback (ChallengePanel Striker line), rewards (400 Doka / 800 XP still persist-gated on attempts > 0)  
RECOMMENDED_ACTION: SIMPLIFY the Striker line to the persist predicate. Recommend `Casts in range: {attempts} (all ≤ 2 tiles: Yes/No)` or hide Yes until `attempts > 0`. Do not persist on attempts === 0. Do not change `applyChallengeDirectHit`. Do not hide the panel.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT the progress line + a component/test: 0 attempts → not Yes-as-complete; 1 in-range attempt → Yes + On track; 1 out-of-range → Failed. HUMAN_DESIGN_REQUIRED only if wait-wins should count as Striker again (that would undo the attempts gate — do not).  
DEPENDENCIES: PXA-2026-10-26-003 (hard_3 peak — sibling meter). PXA-2026-10-27-004 (healUsed meter — sibling). PXA-2026-10-25-003 (turn-limit Failed — orthogonal). PXA-2026-09-22-003 / #364 (do not hide HUD). Does not close those.  
REGRESSION_RISK: LOW if only the line includes attempts. HIGH if attempts gate is removed (wait-win farm returns).  
VALIDATION_REQUIRED: Accept Striker, accept window then wait: panel does not read as a completed Yes; persist does not pay. Cast Strike adjacent: attempts 1, Yes, On track. Cast Poison Arrow at range 4: Failed copy. hard_3 / easy_1 lines unchanged. HUD still visible after first action. `pnpm typecheck`.  
STATUS: NEW

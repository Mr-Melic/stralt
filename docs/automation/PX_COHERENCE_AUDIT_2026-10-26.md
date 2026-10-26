# Player Experience Coherence Audit — 2026-10-26

**Auditor:** Player Experience Coherence Auditor  
**Automation:** `30118f7c-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */48 * * *`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior audit:** [`PX_COHERENCE_AUDIT_2026-10-25.md`](https://github.com/Mr-Melic/stralt/blob/pr-1067-tmp/docs/automation/PX_COHERENCE_AUDIT_2026-10-25.md) in open draft [PR #1067](https://github.com/Mr-Melic/stralt/pull/1067) (same production SHA)  
**Gameplay / production code:** not modified.

Stralt is judged as **one tactical game**. There is **no level cap**. Flat numbers are judged by whether they still create a decision at high level, not by whether an “endgame” exists.

Protected:

- tactical clarity
- meaningful choice
- spell-discovery excitement
- progressive enemy sophistication
- comprehensible encounter rules

Every system was asked at least one of:

1. What tactical decision does this add?
2. What mastery does this reward?
3. What progression fantasy does this support?
4. What new counterplay does this create?

If the honest answer is “none,” the system is noise.

**Do not re-file** still-open PXA IDs from 08-31 … 10-25. They remain open in-repo or in drafts **#343 / #393 / #481 / #529 / #579 / #632 / #691 / #744 / #784 / #844 / #907 / #955 / #1008 / #1067**.  
Closed (do not re-open): `PXA-2026-08-31-006` (Blood HUD), `PXA-2026-09-02-002` (accepted challenge HUD via `shouldShowChallengeHud`).  
Queued sibling, not a close: [PR #696](https://github.com/Mr-Melic/stralt/pull/696) names Inferno’s cooldown — that is 09-27-002, still unmerged.  
New records: [`ACTION_IDS_PXA_2026-10-26.md`](./ACTION_IDS_PXA_2026-10-26.md) (`PXA-2026-10-26-001` … `007`).  
Same-day signature slice (`*_SIGNATURE.md`) is a **pointer** into that union — do not duplicate 004–006.

Sibling IDs already own: kit-zone NaN (EBA-013), `computeAITier` 30% noise, LHIPS XP-wall / 1e9 Doka clamp, FAIL×Windstorm (09-22-001), Windstorm dual rate (09-02-003), one-sided modifier store **including Vampiric throwaway** (09-26-002), player-sheet SR inbound (09-26-003), `maxSpellRange` 5 (09-25-003), unread AP/MP/HP cadence (09-27-001), Inferno silent CD (09-27-002), hit-log SP vs math SR on **player→enemy** hits (09-27-003), leader crown inverse (09-28-001), default-bar / default-win feats (09-28-002), post-mod float (09-28-003), hardcoded 1.03 vs admin spell-dmg % (09-29-001), Rest/Sanctuary hub with no rest (09-29-002), named-event lava/ice/spike painter (09-29-003), three fire DoT names (10-21-001), Windstorm miss starts Inferno CD (10-21-002), forge AP 10 / MP 5 vs battle 8 / 4 (10-21-003), `res_sp` unread + drain healAmount vs 50%-once (10-22-001), Barrier 2 vs 3 (10-22-002), three MP-slow names (10-22-003), Weaken `dmg` / Cursed Wound `healRecv` (10-23-001), Shield RES skips Crush (10-23-002), four reflect **rates** (10-23-003 — this run is dead **arming**), player SP inbound + double RES (10-24-001), `easy_1` “healing spells” vs any restore (10-24-002), Iron Skin/Haste/Enrage “own” vs ally (10-24-003), gifted `hitsMultiple` vs cards (10-25-001), Haste +2 unread on restore / summon budget (10-25-002), turn-limit HUD never Failed (10-25-003), missing juice on `applyDamageToEnemy` (GFCF-003), family HP wipe (PREREQ-H), Blood Mend / Rally **CHC** rider on the **champion** path (EBMA), player `debuffStat` never applying (EBMA-004 / **#528** / **#555**), summon Slow without `stat` (**#878** / EBMA-006), drain `healUsed` (EBMA-005), victory HP floor vs persist (SDEG), betrayal 6× (09-24-002), **AI Bomber DoT/kamikaze (`EBMA-2026-09-01-006`)**. This run does not twin those. PX still agrees: **scale combat grants; do not add a level cap.**

---

## Delta since 2026-10-25

`origin/main` has **not moved** since the 09-21…10-25 PX runs. All production claims below were re-read on `0f5363f` with current line numbers. No integrity merge landed in between. The **pipe** is the 09-02+ persist/recap work. The **loop** is still not one game.

| Claim from last audits | Still true? | Updated evidence |
| :--- | :--- | :--- |
| Full `starterSpells` gifted as innate | **Yes** | `WorldExploration.tsx` 2395–2406; 32 ids in `spellData.ts` 9–690 |
| `shouldIncludeBackendSpellInLibrary` is not discovery | **Yes** | `adminSafety.ts` 712–718: `usableByPlayer !== false` → include |
| `combinedMechanic` unused | **Yes** | Only `useBossRush.ts` 19–130; WX never renders the sentence |
| Blood HUD gone; field leftover | **Yes** | GameFlow 282–290 spacer. `bloodBalance` still on the record (`main.mo` 137). Character select still rains `BloodParticles` |
| Covenant buff write-only | **Yes** | `covenantBuffMapsRef` write WX 11330; no combat reader |
| Slime Flood ≡ Frozen Terrain | **Yes** | Both `onMpCost * 2` (`mapModifiers.ts` 155–172) |
| Gravity Well / Fog of War empty | **Yes** | Registry 280–296; WX `_isGravityWell` / `_isFogOfWar` unused |
| Titan’s Vigor +1000 HP, 1–5× | **Yes** | `mapModifiers.ts` 300–316; store-only (09-26-002) |
| Admin bosses still name `fireball` / `blood_nova` | **Yes** | `admin.mo` 358–541 |
| Random legendary challenge every fight | **Yes** | WX 12210–12218; `DEFAULT_CHALLENGES` still 9 (`challengeCompletion.ts` 44–109) |
| Buff shop vs canister catalog drift | **Yes** | `BuffShop.tsx` 31–79 vs `main.mo` 2772–2779 |
| Kits stop at zone 0 (NaN adapter) | **Yes** | `buildEnemyKit(..., currentMap.levelZone)` at WX 11920 |
| Paper Windstorm dual rate | **Yes** | Announce “reach halved.” Player 30% any-hit (WX 9563–9572). Enemy 50% if `range > 1` |
| 15 IAP SKUs unused by player UI | **Yes** | `defaultShopPackages()` `admin.mo` 265–282 |
| Accepted challenge HUD visible | **Yes (KEEP)** | `shouldShowChallengeHud`. Untouchable / Striker **fail chips work**. Do not hide again for click-steal (09-22-003 / #364) |
| Silent Boost ×1.5 | **Yes** | WX 2098 `_setBoostMode` unused; victory `boostMode === "xp"` at 12375 |
| Idle +1 HP / 10s | **Yes** | WX 3617–3624 |
| Betrayal 6× | **Yes** | WX 15594–15653 |
| Recap `dokaBreakdown: []` | **Yes** overworld (`WX` 12468) |
| `hard_3` AP ≤ 8 | **Yes** | Fail wiring works (`challengeCompletion.ts` 452–453). Peak is **unprinted** on the panel → **10-26-003**. Flat auto-stamp stays 09-26-001 |
| Career AP/MP unread on the sheet | **Yes** | Statistics omits cadence (09-27-001). Forge still stamps 10/5 (10-21-003) |
| Inferno `cooldown: 3` silent | **Yes** | `spellData.ts` 504–519; #696 unmerged |
| Hit log `-SP` vs math SR (player→enemy) | **Yes** | `castHelpers.ts` 377–389 |
| Leader crown tooltip vs erratic | **Yes** | `InitiativeStrip.tsx` 385 **and** panel 660 — 09-28-001 |
| Default-bar / default-win feats | **Yes** | 09-28-002 |
| Float vs `_dmgAfterMods` | **Yes** | WX 3517–3538 |
| Hardcoded `1.03^upgrade` | **Yes** | `combatMath.ts` 130–136 |
| Rest/Sanctuary hub with no rest | **Yes** | `generateRestMap` 5483–5522; toast 6142 / 6205 |
| Named-event lava/ice/spike painter | **Yes** | WX 6696–6729 |
| Three fire DoT names | **Yes** | Inferno / lava Burning / Ember `burn` (10-21-001) |
| Windstorm miss starts Inferno CD | **Yes** | `resolvePlayerCast` returns `"cast"` at 909–914 (10-21-002) |
| Forge AP 10 / MP 5 vs battle 8 / 4 | **Yes** | `startingChampionStats.ts` 8–12 vs `PLAYER_BASE_AP/MP` (10-21-003) |
| Expose / Veil `res_sp` unread | **Yes** | `getStatModifier` exact-match (`statusEffects.ts` 45–62); 10-22-001 |
| Drain printed heal vs 50%-once | **Yes** | `castHelpers.ts` 473–488; 10-22-001 |
| Barrier card 2 vs engine 3 | **Yes** | `spellData.ts` 181 vs `spellEngine.ts` 849; 10-22-002 |
| Tide `slow` / Slow / Frozen stack | **Yes** | 10-22-003 |
| Weaken `dmg` unread on Crush | **Yes** | 10-23-001 |
| Cursed Wound `healRecv` self-heal only | **Yes** | 10-23-001 |
| Shield RES skips Crush; Charm fights it | **Yes** | 10-23-002 |
| Four reflect rates | **Yes** | 10-23-003. **Player Mirror never arms** → **10-26-004** |
| Player SP inbound + double RES | **Yes** | 10-24-001 |
| `easy_1` “healing spells” vs any restore | **Yes** | 10-24-002. Wisp cannot actually restore the champion → **10-26-007** |
| Iron Skin / Haste / Enrage “own” vs ally | **Yes** | 10-24-003 |
| Gifted `hitsMultiple` vs cards | **Yes** | 10-25-001 |
| Haste +2 unread on restore / summon budget | **Yes** | 10-25-002 |
| Turn-limit HUD never Failed | **Yes** | 10-25-003 |
| Death Realm copy | **Yes (KEEP)** | Quiet map (`WX` 5388–5457); 20/40 + half linear-orb HP (`GameOverModal.tsx` 52–80; `deathPenalty.ts` 138–140) |
| BuffShop elixir / boots / charm / fury | **Yes (KEEP)** | Cards match `handleUseItem` (`BuffShop.tsx` 49–76; WX 3575–3589; fury ×1.25 `spellEngine.ts` 895–898) |
| Attack Nearest on selected spell | **Yes (KEEP)** | `BattleUIPanel.tsx` 830–843; `attackNearestEnemy` WX 17218+ |
| Dungeon live HUD depth | **Yes (KEEP)** | `⚔️ Dungeon {depth}/{max}` WX 17561–17575; portal `Continue Chain (d/max)` 7920–7922. Recap Depth is the lie → **10-26-002** |
| Physical Strike skipping FAIL | **Yes, unnamed** | Engine `!isPhysical` (`spellEngine.ts` 641–651). Card names RES/SP only → **10-26-006** |
| Mark writes a tile while `targetType` is enemy | **Yes — now filed** | 10-25 deferred; empty floor spends AP with no `placeMark` → **10-26-005** |
| Timestep mechanics | **Yes (KEEP)** | Once-per-battle AP/MP reset. Name vs Time Warp stays PXA-012 |
| Enrage +40% / duration 2 | **Yes (KEEP write)** | Survives first tick. “Own” stays 10-24-003 |
| Poison Arrow ≡ Venom Strike numbers | **Yes** | Both 4/turn × 3. Catalog MERGE stays PXA-002 |
| Swap hostile-only / no LoS | **Yes (KEEP)** | Card does not claim ally-swap or LoS |
| Wolf / Archer / Sentinel kits spendable | **Yes** | Printed AP ≥ kit cost. **Bomber and Wisp are not** → **10-26-001 / 007** |

What **did not** change for identity: discovery is still a gifted 32-id book; encounter copy still disagrees with the engine; secondary rewards are still flat on `100 * 2^(N-1)`.

**New this run** (same bytes, unread or deferred last cycle). Do not re-file 10-23-003 rates, 10-25-001 AoE geometry, 10-25-002 Haste restore, 10-25-003 turn-limit Failed, 09-26-001 flat ≤ 8, 09-25-002 recap dummy name, 09-29-002 Sanctuary Rest, EBMA-006 AI Bomber, EBMA champion Blood Mend CHC, 10-24-002 `easy_1` copy.

1. **Player Bomber is not a Bomber.** Card “rushes and explodes” + kit Inferno (5 AP) + unit `ap: 1` + control-only path → permanent grey kit, no explode (**10-26-001**). EBMA-006 owns the unused AI explode/Inferno path.
2. **Dungeon recap Depth is a default, not the live floor.** Live HUD and Doka ×depth are honest; `PostBattleRecap` prints `Depth 1/?` because WX never sets `dungeonDepth` / `dungeonMaxDepth` (**10-26-002**).
3. **hard_3’s contract is AP; the HUD never shows AP.** Fail chip works; `ChallengePanel` only prints Turns/Damage (+ Striker line). Peak is invisible (**10-26-003**). Distinct from flat ≤ 8 (09-26-001) and turn-limit never-Failed (10-25-003).
4. **Gifted Mirror never arms.** Self-only tile; `activateMirror` sits behind `targetEnemy || hitsMultiple`. AP spent, no token (**10-26-004**). 10-23-003’s “Mirror = 100% next-hit” leg is dead until this ID.
5. **Mark is a tile card gated as an enemy spell.** Empty highlighted floors spend AP with no `placeMark`. Marks are invisible. Walking pawns strand the ×2 (**10-26-005** — 10-25 deferred).
6. **Strike silently skips FAIL.** Prior KEEP required the card to say so; it still names only RES vs SP (**10-26-006**). Windstorm can still miss Strike (10-21-002).
7. **Wisp does not heal allies.** Kit Blood Mend 3 AP + Rally 4 AP on a 2 AP body → grey forever. Even with AP, `targetType: "self"` cannot target the champion; ally targeting excludes the player; `resolveSpellCast` spends Blood Mend on a CHC `buffStat` before heal; `ctx.heal` no-ops unless the target is the player. Unused `runHealer` is not the control panel (**10-26-007**). 001 explicitly excluded Wisp; that carve-out was wrong.

---

## Verdict

The **core identity is still sound**: AP spends actions, MP spends movement, explicit `SpellConfig` targeting, one Doka wallet, persist-locked `applyRewards` + root recap **mount**, percentage death + honest Death Realm, honest solo boss kits, CHC ×2, INIT-sorted turn order, 30s shot clock with honest Time Warp 15s, Attack Nearest on the selected spell, BuffShop timing pots, dungeon **live** depth HUD, Untouchable/Striker fail chips.

The game still does **not** play as one loop. The same three fractures dominate, and this run proved two of the 08-31 KEEP signatures are dead on the player path:

1. **Discovery is not a system.** The book is gifted. Two of the five summon “archetypes” cannot spend their kits (**001 / 007**). Mirror and Mark — the signature KEEP list — do not execute the cards (**004 / 005**).
2. **Rules on the box are not rules in the engine.** Register, rush pairs, several map events, Windstorm rates, resist words, Inferno’s hidden CD, leader crown copy, post-mod floats, secret floor hazards, three fire DoT names, a miss that starts cooldown, Barrier 2 vs 3, `res_sp`, drain tooltip vs 50%-once, three MP-slow names, two Shields with inverted coverage, four reflect rates **plus a Mirror that never arms**, SP as inbound + double RES, no-heal copy vs potions/drain/Wisp, “own” buffs that click the wolf, Chain Lightning as a range-4 room hit, Haste +2 unread, Blitz “Not met yet” at turn 40, **Bomber Inferno on 1 AP, Wisp heals that cannot fire, recap Depth 1/?, hard_3 with no AP tracker, Strike FAIL skip unnamed, Mark empty-floor no-op.**
3. **Most secondary rewards are flat** on an unbounded `2^(N-1)` curve. Live enemy kits never leave band 0. The forge still teaches a 10/5 action budget the fight overwrites.

Until PXA-001 / 003 / 007 / 008 / 013 and the still-open dated IDs are designed, adding World Dynamics tiles, Wave-N catalogs, or more admin SKUs will make the identity *less* readable. **Do not add another summon kit whose AP exceeds the unit’s budget (001 / 007). Do not ship another recap field that defaults past the live refs (002). Do not add another AP-cap challenge without printing the peak (003). Do not KEEP Mirror / Mark / Strike-FAIL until 004 / 005 / 006 land. Do not teach `runSummonAI` as a second Wisp language (007).**

---

## Classification (all reviewed systems)

| System | Class | One-line why |
| :--- | :--- | :--- |
| **Combat AP/MP split** | KEEP | AP = actions, MP = movement; book `mpCost` is ~0. The Dofus-like decision. The **L1 stamp must match the floor** (10-21-003). |
| **Explicit spell targeting metadata** | KEEP | `targetType` / range / LoS — not name heuristics. Protect this. **`hitsMultiple` must mean one sentence** (10-25-001). Player `debuffStat` **write** is EBMA-004 / #528 / #555. Pack readers for `dmg` / `healRecv` are 10-23-001. `res_sp` stays 10-22-001. **SP’s job** is 10-24-001. **Ally vs “own”** is 10-24-003. **Haste +2 on a restore** is 10-25-002. **Mark’s type vs card** is 10-26-005. |
| **8-slot bar as loadout** | KEEP (noisy until clones merge **and unique keys fight**) | Picking 8 of 32 is a decision only if the eight tools differ (PXA-002, 09-28-002, 10-22-001, 10-23-001, 10-24-001/003, 10-25-001/002, **10-26-004/005/006**). |
| **Atomic reward funnel + root recap mount** | KEEP | `applyRewards` / `saveBattleStats` + `PostBattleRecap` at app root. Contents still lie (09-25-001/002). **Dungeon Depth fields** are 10-26-002. |
| **Death 20% XP / 40% Doka + Death Realm** | KEEP | Percentage cost stays meaningful with no cap. 1.5s guards are a real rule. Realm is a quiet map. Copy matches Flee. |
| **Solo boss kits + `BossAbility` tags** | KEEP | Unique phase kits; real specials. Boss Guide is closer to truth than EnemyRegister. Reflect Shield 30% shares a verb under 10-23-003. |
| **Enemy / summon AI engine** | KEEP | Archetypes, lethal lookahead, LoS step, backline guard. Do not add toggles. Do not route player Bomber/Wisp through unused `runSummonAI` to “fix” 001/007. |
| **Summon five-pack + player control panel** | KEEP **after 001 and 007** | Hunter / guardian / archer stay distinct and spendable. **Bomber and Wisp currently answer none of the four questions.** Ally Haste must add MP on that budget (10-25-002). Kit Slow `stat` is **#878** / EBMA-006. |
| **Signature spells** | KEEP **after 004 / 005 / 006** | Swap, Timestep, Sacrifice (numbers) still ask unique questions. **Mirror is dead on self-cast (004).** **Mark is a tile card gated as enemy (005).** **Barrier duration** is 10-22-002. Timestep stays the once-per-battle reset; Time Warp stays the 15s clock (PXA-012 names). **Chain Lightning / Frost Nova / Lifesteal Nova stay KEEP only after 10-25-001.** Strike FAIL skip KEEP **only if named (006)**. |
| **CHC ×2 / INIT turn order** | KEEP | Live. Print them; they fight. |
| **SP outbound multiplier** | KEEP the outbound job | WX 3318–3322. Do not also use it as inbound SR (10-24-001). Do not teach it as inbound on player→enemy hits (09-27-003). |
| **30s shot clock + Time Warp 15s** | KEEP | Panel shows `{turnTimeLeft}s`; announce matches the **player** timer. Rename vs Timestep is PXA-012. |
| **Attack Nearest on the selected spell** | KEEP | Same metadata as a click. Do not make it a second verb. |
| **Physical Strike skipping FAIL** | KEEP **if named** | The exemption is the only spendable answer to 20% fizzle (09-22-001). Card still does not name it → **10-26-006**. |
| **Leader crown mark** | KEEP the tell | Highest-level unit, canvas + strip. Copy and unused % boost are 09-28-001. |
| **Erratic AI after the leader dies** | KEEP if taught | Real counterplay (focus the crown). Today the tooltip teaches the inverse. |
| **Chaos Initiative shuffle** | KEEP | Announce + `applyTurnOrderSort` include the player. |
| **Null Field suppress buff/debuff** | KEEP | Hook is live on `applyActiveEffect`; DoTs correctly pass. |
| **`upgradeSpell` as the book-power sink** | KEEP the sink; REWORK the knob | Exponential Doka cost is the no-cap mastery spend. Hardcoded 3% + dead slider are 09-29-001. |
| **Spell Scholar (`spell_level_5`)** | KEEP | Real upgrade mastery. Distinct from default-bar Spell Master (09-28-002). |
| **JUICE** | KEEP | Shake / hitstop / numbers. The **value** on Titan/Glass must match the bar (09-28-003). |
| **Admin UI gated + backend `#admin`** | KEEP | Must stay off the player HUD. |
| **GameKey / Mollie IAP** | KEEP off-loop; SIMPLIFY chrome | Real-money faucet. Not a tactic (09-02-001). |
| **Accepted-challenge HUD visibility** | KEEP | `shouldShowChallengeHud`. Do not hide again to fix click-steal (09-22-003 / #364). **Turn-limit Failed chip is 10-25-003. hard_3 peak AP line is 10-26-003.** Untouchable/Striker fail chips honest. |
| **In-battle elixir / boots / charm / fury** | KEEP as timing tools | Overworld HP pots cannot (09-23-002). Fury ×1.25 **is** live. Charm is the Shield that fights Crush (10-23-002). **Pots fail `easy_1` despite “spells”** (10-24-002). **Swift Boots is the Haste that actually moves** until 10-25-002. |
| **Haste vs Swift Boots** | KEEP both **after 10-25-002** | Spell slot + ally vs consumed this-turn. Card “own” is 10-24-003. |
| **Dungeon live depth HUD + portal Continue Chain** | KEEP | Honest refs. Recap Depth is 10-26-002. |
| **Fire DoTs (Inferno / lava Burning / Ember burn)** | MERGE to one fire verb | 10-21-001. Inferno CD on that ID / 09-27-002, not a 10-26 twin. |
| **MP slows (Tide `slow` / spell `Slow` / ice `Frozen`)** | MERGE to one walk-tax language | 10-22-003. Frozen Terrain MP ×2 stays 09-29-003. Frost Nova’s **area** is 10-25-001. |
| **Reflect (Mirror / Mirror Field / Void 25% / Reflect Shield 30%)** | MERGE to one live verb **after 004 arms Mirror** | 10-23-003. Keep Mirror as the commitment **once it writes**. |
| **`hitsMultiple` gifted trio (Chain Lightning / Frost Nova / Lifesteal Nova)** | REWORK to one rule per card | 10-25-001. |
| **Haste +2 / 1-turn vs restore clock** | REWORK duration and the log | 10-25-002. |
| **Turn-limit challenge HUD** | SIMPLIFY the Failed chip | 10-25-003. |
| **Bomber player identity (card / Inferno kit / 1 AP / control)** | REWORK to one spend | **New: 10-26-001.** |
| **Wisp healer identity (card / 3–4 AP kit / 2 AP body / no champion heal)** | REWORK to one restore | **New: 10-26-007.** |
| **Mirror self-cast arming** | REWORK hoist | **New: 10-26-004.** |
| **Mark tile vs enemy / empty no-op** | REWORK to one rule | **New: 10-26-005.** |
| **Strike FAIL exemption unnamed** | SIMPLIFY copy or the exemption | **New: 10-26-006.** |
| **Dungeon recap Depth 1/?** | SIMPLIFY to live refs | **New: 10-26-002.** |
| **hard_3 peak AP HUD** | SIMPLIFY the progress line | **New: 10-26-003.** |
| **Spell catalog (full `starterSpells`)** | MERGE **after unique keys fight** | Shield ≡ Iron Skin **after** 10-23-002 makes RES fight Crush **and** 10-24-003 reprints “own”; Poison ≡ Venom; two heals+CHC; Expose ≡ Shadow Veil; three drains. Unique KEEP tools are fake until 10-22-001 / 10-23-001 / 10-24-001 / 10-25-001/002 / **10-26-004/005** map keys. Slow/Weaken apply is EBMA-004. |
| **Player SP inbound + double RES + Life Drain `"sp"`** | REWORK one job, one pipe | 10-24-001. |
| **No-heal card vs any-restore flag** | SIMPLIFY the sentence or the flag | 10-24-002. Wisp cannot currently trip it on the champion (10-26-007). |
| **“Own” buff cards vs ally `targetType`** | SIMPLIFY copy to the KEEP | 10-24-003. |
| **Expose / Veil `res_sp` + drain printed heals** | REWORK keys and numbers | 10-22-001. |
| **Weaken `dmg` + Cursed Wound `healRecv` on the pack** | REWORK keys and heal sites | 10-23-001. |
| **Shield spell vs Shield Charm vs Crush** | SIMPLIFY coverage + noun | 10-23-002. |
| **Crush / Fire Bolt fallback** | MERGE | Uncatalogued `e-crush` / `e-firebolt` (WX 16711–16712; 09-21-003). |
| **Slime Flood + Frozen Terrain** | MERGE | Same `onMpCost * 2`. Frozen also plants ice tiles (09-29-003). |
| **Arcane Surge + Overflow AP −1** | MERGE | Both `onApCost` −1. Overflow’s extra fizzle is effects-only (09-01-002). |
| **World Dynamics + Wave-3/4/5+ catalogs** | MERGE or hold | Unwired. Do not stack (09-21-002, 09-01-003). `worldFeatures.ts` is still design-only. |
| **HP potions vs 1:3 Doka-to-HP** | MERGE | Pots are strictly worse overworld recover (09-23-002). Hidden 0.5% jackpot heal stays PXA-009. In-battle both fail `easy_1` (10-24-002). |
| **Rest / dungeon / rush / solo-boss doors** | MERGE into a learnable set | Overworld mix is 09-24-003. The rest **hub** is 09-29-002. |
| **Named events + floor hazards** | MERGE to one language per event | 09-29-003. Blood Moon ×1.25 stays 09-01-002. |
| **Enemy identity (piece + family + aiTier + Register lore)** | SIMPLIFY | Four posters for one unit. Live kit is always zone 0. |
| **Achievements / Feats** | SIMPLIFY | Mastery mixed with chores, RNG, and **default stamps** (09-28-002). Keep Spell Scholar. Button **Feats**; `title` Achievements (`GameFlow.tsx` 328–335). Pacifist vs `easy_1` stays 009. Challenge **Badge:** Untouchable/Blitz/Striker is panel chrome, not a feat (09-25-002 owns the dummy recap name). |
| **Buff shop + GameKey + leftover packages** | SIMPLIFY | Two carts. Catalog still disagrees. 15 SKUs still seeded. |
| **HUD chrome** | SIMPLIFY | Items + Buy Doka + Enemies-as-lore + Bosses + Board + Feats + chat. Character-select Blood rain is leftover 006. **Challenge “Not met yet” past the cap is 10-25-003. hard_3 missing AP line is 10-26-003. Recap Depth 1/? is 10-26-002.** |
| **Terminology** | SIMPLIFY | Feats vs Achievements; GameKey vs Doka; Rest vs Sanctuary vs Safe Zone vs Death Realm; Blood Moon vs Blood Mend vs BloodParticles; **SP outbound vs SP inbound vs SR**; FAIL vs Windstorm; Leader “boost” vs erratic; ice tiles vs Frozen Terrain vs slow / Slow / Frozen; burn vs Burning vs Inferno DoT; Jackpot heal vs jackpot Doka band; Barrier 2 vs 3; Shield spell vs Shield Charm vs “Shield absorbed”; Mirror vs Mirror Field vs Void Mirror vs Reflect Shield; **Timestep vs Time Warp**; **“own” vs ally**; **“healing spells” vs any HP restore**; **“bounce” vs hits-everyone-in-range**; **“adjacent” / “around caster” vs range-from-click**; **“turn” vs player turn**; **Haste “+2 MP” vs log “+100% MP”**; **“rushes and explodes” vs grey Inferno**; **“heals allies” vs grey Blood Mend**; **Depth 1/? vs live d/max**; **Strike “RES not SP” vs silent FAIL skip**. |
| **FAIL vs Windstorm** | SIMPLIFY to one miss | 09-22-001. Dual Windstorm rates stay 09-02-003. Cooldown-on-miss is 10-21-002. **Strike unnamed skip is 10-26-006.** |
| **Career AP/MP/HP growth** | EXPAND onto the sheet | Live AP/MP unread (09-27-001). **L1 stamp vs floor is 10-21-003.** Range cap stays 09-25-003. |
| **Spell-upgrade %** | SIMPLIFY to one source of truth | 09-29-001. |
| **Spell cooldown** | SIMPLIFY or teach | One gifted spell, silent card (09-27-002 / #696). Miss vs lock is 10-21-002. |
| **Resist words** | SIMPLIFY | Player→enemy log SP vs math SR: 09-27-003. Sheet SR inbound: 09-26-003. **Enemy→player SP inbound + double RES: 10-24-001.** |
| **Post-mod damage floats** | SIMPLIFY to the live chip | 09-28-003. |
| **HUD Blood bar leftover field** | DEPRECATE leftover field | Chrome is gone. Keep canister inert. Do not invent a spend. |
| **`resilience` / `evasion` as player-facing** | DEPRECATE until a reader exists | Required persist fields. Register still claims evasion. |
| **`covenantBuff` / shrine 3-map write** | DEPRECATE or EXPAND | Shrine pays 300 Doka. The buff is still write-only. |
| **Canister `defaultShopPackages` 15 SKUs** | DEPRECATE from player truth | GameKey replaced the picker. |
| **Gravity / Fog until implemented** | DEPRECATE announce or implement | 09-01-002. |
| **Silent idle +1 HP/10s** | DEPRECATE | 09-23-003. |
| **Board Kills column** | DEPRECATE until official `saveKillCount` | 09-24-001. |
| **Betrayal 6×** | DEPRECATE or telegraph | 09-24-002. Do not name the 🔥 badge “Enrage” if 09-24-002 keeps a telegraph (that noun is the +40% spell). |
| **Dummy `"Battle Challenge"` recap string** | DEPRECATE | 09-25-002. Challenge **Badge:** chrome is the same family, not a fourth ID. |
| **`leaderBoostPercent` / unread multiplier** | DEPRECATE until a reader exists | 09-28-001. |
| **`spell_master_8` / auto `leader_slayer`** | DEPRECATE or rewrite the ask | 09-28-002. |
| **Admin `spellDmgGrowthPercent` until wired** | DEPRECATE or wire | 09-29-001. |
| **“Rest, hero” copy until the map rests** | DEPRECATE or EXPAND a real rest | 09-29-002. |
| **40% random extra hazard stamp** | DEPRECATE | 09-29-003. |
| **Forge AP 10 / MP 5 until they match battle 8 / 4** | DEPRECATE the extra two points | 10-21-003. |
| **`debuffStat: "res_sp"` until split or mapped** | DEPRECATE the compound key | 10-22-001. |
| **Inbound SP on enemy spells until it is SR or taught** | DEPRECATE the secret job | 10-24-001. |
| **`easy_1` “healing spells” sentence until it matches `healUsed`** | DEPRECATE or reprint | 10-24-002. |
| **“Buff own” on ally tools** | DEPRECATE the word own | 10-24-003. |
| **Chain Lightning `bounces` extra on a full-range hit** | DEPRECATE the extra proc or the room-hit | 10-25-001. |
| **Frost Nova / Lifesteal Nova `areaRadius` until execute reads it** | DEPRECATE the preview field or wire it | 10-25-001. |
| **Haste duration 1 until a restore can see it** | DEPRECATE the 1 or add leftover now | 10-25-002. |
| **“Not met yet” on a turn cap that already passed** | DEPRECATE that chip state | 10-25-003. |
| **Bomber Inferno kit on 1 AP until 001** | DEPRECATE the unpayable kit or the 1 AP | 10-26-001. |
| **Wisp 3–4 AP heals on a 2 AP body until 007** | DEPRECATE the unpayable kit or the 2 AP | 10-26-007. |
| **Recap Depth default 1/? until 002** | DEPRECATE the default | 10-26-002. |
| **Spell discovery** | REWORK | Innate 32-id book. No observe → win → unlock. |
| **Battle challenges** | REWORK offer + predicates + **heal copy** + **turn HUD** + **AP tracker** | Random 9 including legendary; `hard_3` free until L25 (09-26-001). Pacifist feat vs `easy_1` stays PXA-009. **Copy vs flag is 10-24-002.** **Failed chip vs turn cap is 10-25-003.** **Peak AP line is 10-26-003.** |
| **Boss-rush combined mechanics** | REWORK | Copy-only. PXA-003 / 004 still own pair rules and scaling. |
| **Admin-enabled catalogs** | REWORK | Live book, `bossKits.ts`, `admin.mo` seeds are three truths. `healRecv` / `"sp"` / `"res_sp"` in the editor are unread or mis-aimed keys. `areaRadius` vs `hitsMultiple` is a fourth editor lie (10-25-001). `summonAI: "healer"` / `"bomber"` vs control-panel spend is 001/007. |
| **Map modifiers / world events** | SIMPLIFY + MERGE | 22 entries. Twins, placeholders, Titan lottery, one-sided store, Windstorm two rates, secret floor hazards, three fire names, three slow names, four reflect rates. Blood Moon ×1.25 unstated (09-01-002). |
| **EnemyRegister / family lore** | REWORK copy; SIMPLIFY HUD | FLAVOR LORE chip is honest; world-HUD **Enemies** button is not (09-21-001, 09-01-001). Storm Caller “chain lightning bounces between all nearby” is 10-25-001 evidence, not a new 001 twin. |
| **Dungeon chain** | EXPAND unique rule; SIMPLIFY recap Depth | Reward skin on the overworld. Needs a rule free roam does not have. **Badge Depth 1/? is 10-26-002.** |
| **Progression / rewards (flat + linear-vs-exp + lottery)** | EXPAND grants | Curve unbounded; grants are not. Hidden Doka bands 09-25-001. Silent XP 1.5 09-23-001. Do not add a cap. |
| **Reach +1 / 10 levels** | EXPAND or announce the cap | Silent `maxSpellRange` 5 is 09-25-003. |
| **Inbound SR** | EXPAND only after SP stops stealing the job | Sheet lie is 09-26-003. **Enemy spells currently use SP, not SR** (10-24-001). Melee also skips RES buffs (10-23-002) — do not invent SR on Crush first. |
| **Rest hub** | EXPAND a unique rest rule or SIMPLIFY to a named door chooser | 09-29-002. |
| **Flee** | KEEP | BattleUI copy matches death 20/40 (`BattleUIPanel.tsx` 519–523). Not a second exit. |

---

## System notes (evidence)

### Enemies — SIMPLIFY poster; REWORK the register

Overworld packs are still **chess pieces**. `buildEnemyKit` floors `levelZone`. Battle start still passes `currentMap.levelZone` as `{ name, minLevel, maxLevel }` (`WX` 11920). **Zone-0 kits forever.** Owned by EBA-013; PXA-013 is blocked until that adapter exists.

The **30% family overlay** still paints HP/dmg/RES and pixels, then battle start overwrites HP (`calcEnemyMaxHp`, PREREQ-H). Three families still apply **name-heuristic** melee extras (Ember burn, Tide −1 MP, Void 25% reflect). Void’s live hook is 25% of pre-mitigation (`castHelpers.ts` 335–345). Register still says copy-spell / magic-immune (`EnemyRegister.tsx` 67–70). That **word** is 10-23-003.

**Leader mark is live and worth keeping.** Copy remains 09-28-001 (`InitiativeStrip.tsx` 385 and panel 660).

Crush / Fire Bolt fallback remains 09-21-003. It is also the pipeline that **ignores Weaken `dmg` and Shield RES** (10-23-001 / 002) **and player SP/SR** (10-24-001).

Betrayal 6× + 🔥 badge remains 09-24-002. If that ID telegraphs, do not label the badge “Enrage” — that noun is the +40% ally buff (10-24-003).

Storm Caller Register copy “Chain lightning bounces between all nearby targets” (`EnemyRegister.tsx` 154) is flavor for a boss kit **and** a rhyme with the player card that is already a room-hit (10-25-001). Do not twin 09-01-001.

### AI — KEEP (kits: EXPAND after adapter)

`decideEnemyAction` is still the best expression of identity. `computeAITier` still has a 30% full-random 1–10. Do not rewrite `enemyAI.ts` to add verbs. Betrayal 6× is 09-24-002. Erratic-after-leader is a real verb — teach it. Enemy turns use an 800ms executor + 5s watchdog; do not invent a player-facing enemy clock.

Enemy casts **do** apply `debuffStat` (EBMA-004’s honest half). That write still uses `res_sp` as a dead key (10-22-001) and `"sp"` as a mis-aimed inbound shield (10-24-001). Enemy outgoing still ignores `"dmg"` (10-23-001) and caster SP. Do not “fix” Slow by deleting the enemy rider.

`runBomber` / `runHealer` remain unreachable from player control (`WX` 14418–14422: player summons always enter control mode). That is **001 / 007**, not a reason to delete the AI files.

### Spells — MERGE clones after unique keys fight; KEEP signatures after 004 / 005 / 006; REWORK Haste’s +2 and gifted AoE

`starterSpells` is still the 32-id book including Strike. Almost every spell has `mpCost: 0`. **Keep that.** Inferno is still the only starter with `cooldown: 3` (09-27-002) and `damage: 0` (DoT-only); “Intense fire blast” is flavor on a burn — do not twin 10-21-001 / 09-27-002.

Player `debuffStat` **write** is already queued (EBMA-004 / #528 / #555; summon Slow `stat` #878). **10-22-001** is `res_sp` + drain numbers. **10-23-001** is Weaken `"dmg"` / Cursed Wound `"healRecv"` on the pack. **10-24-001** is SP inbound + double RES. Drain Courage `"ap"` **does** fight. Slow `"mp"` **does** fight (10-22-003 is the **name**, not the read).

Buff path (Shield, Iron Skin, Haste, Enrage) **does** write `buffStat` via the shield branch (`spellEngine.ts` 675–718), including onto allied summons. Fury Potion ×1.25 is live on the same damage loop. Those writes are KEEP. **Coverage** of Shield RES vs Crush is 10-23-002. **Cards that say “own”** are 10-24-003. **Haste’s +2 never reaching a restore / summon budget** is 10-25-002. Blood Mend / Rally CHC on the **champion** path still unused (EBMA). On the **Wisp kit** path the same `buffStat` early-return blocks heal (**10-26-007**).

**Mirror is not KEEP until 004.** `activateMirror` sits inside `if (targetEnemy || spell.hitsMultiple)` (`spellEngine.ts` 882–926). Self tile never enters. Field/Void/Reflect Shield still roll (10-23-003).

**Mark is not KEEP until 005 picks tile-trap vs enemy-tag.** Card says tile; `targetType` is enemy; empty floors `"cast"` with no `placeMark`. Sacrifice empty still `loseSelfHp` — same family, folded into 005.

**Strike FAIL skip is KEEP only after 006 names it.** Engine `!isPhysical` (`spellEngine.ts` 641–651). Card: “Only RES applies (not SP).”

Swap / Timestep / Enrage duration 2 / Poison≡Venom **numbers** still match. Chain Lightning / Frost Nova / Lifesteal Nova stay 10-25-001. Barrier duration stays 10-22-002.

Book power from upgrades is live and **good** as a no-cap sink. The number is not the admin field (09-29-001). Spell Scholar stays KEEP.

### Spell discovery — REWORK (unchanged class)

Innate 32. Admin extras with `usableByPlayer = true` still union into the book (`adminSafety.ts` 712–718), including `reflect_barrier` / `vampire_bite` (`admin.mo` 168–191) that answer none of the four questions until targeting metadata exists (PXA-015). Recap still cannot grant a spell. Do not ship Rune Bearer attune as a substitute. Do not add more catalog rows until 10-22-001 / 10-23-001 / 10-24-001 / 10-25-001 / **10-26-004/005** make unique keys fight, and until Bomber/Wisp kits are spendable (**001 / 007**).

### Achievements (Feats) — SIMPLIFY + keep Spell Scholar

Same 15 seeds (`admin.mo` 309–326). Spectator feats stay PXA-009. Default-bar / default-win stay 09-28-002. Spell Scholar is the upgrade-mastery row the book actually has. Pacifist vs `easy_1` stays 009; **`easy_1` copy vs the restore flag** is 10-24-002. Challenge panel **Badge: Untouchable / Blitz / Striker** is not a feat row — persist still names `"Battle Challenge"` (09-25-002).

### Challenges — REWORK offer, predicates, heal copy, turn Failed, AP tracker; KEEP HUD visibility and honest Untouchable/Striker fails

Same 9 contracts, random every fight. `hard_3` cannot fail until AP grows at 25 (09-26-001) **and** create-stamped AP 10 is overwritten to 8 (10-21-003) **and** the panel never prints peak AP (**10-26-003**). Recap still writes `"Battle Challenge"` (`WX` 12469; 09-25-002). Click-steal stays 09-22-003 / #364. Visibility KEEP.

Untouchable **does** fail when `totalDamage > 0`. Striker **does** fail when a spent attempt lands beyond Chebyshev 2. Do not re-file those as new IDs.

**`easy_1` “healing spells” vs potions / drain / Wisp / Doka-to-HP** is 10-24-002. Wisp currently cannot restore the champion (007) — do not treat that as a close of 002. **Blitz / under-10 / under-15 never flip Failed** (10-25-003). `legendary_3` Striker on a Chain Lightning room-hit is 10-25-001 evidence, not a new Striker ID.

### Bosses — KEEP kits; REWORK rush pairs; MERGE reflect noun with 10-23-003

19 frontend ids + `bossKits.ts` still honest. `combinedMechanic` still only in `useBossRush.ts`. Live room-clear Doka is `level * 1.5` — PXA-003 / 004, not re-filed. Boss `damageToPlayer` skips RES buffs (10-23-002) and the SP inbound pipe (10-24-001). Reflect Shield 30% is a real special — share the verb (10-23-003), do not delete the tell. Boss kits that list `spell-mirror` still use other paths — 004 is the **player** self-cast.

### Dungeons — EXPAND unique rule; SIMPLIFY recap Depth

Chain is still depth + Doka multiplier + white portal. Same generator, AI, modifiers as free roam. White portal dumps into the rest hub (09-29-002). Portal-verb overload on the overworld is 09-24-003.

Live HUD depth + portal “Continue Chain (d/max)” match refs. Multiplier table `[1, 1.5, 2.0, 2.5, 3.0, 4.0]` applies to **Doka only**. Recap prints **“Depth 1/? — {live ×}”** because WX sets `dungeonMultiplier` and never the depth fields (**10-26-002**).

### World events — SIMPLIFY + MERGE

22 registry entries. Two-roll trigger. Admin dropdown echoes `announceText`. Honesty still broken (Windstorm, Blood Moon flavor vs live ×1.25, Gravity/Fog empty, Titan lottery, one-sided store, Surge≡Overflow AP). Vampiric throwaway stays 09-26-002. Titan/Glass floats stay 09-28-003. Time Warp KEEP (name vs Timestep is PXA-012). Chaos Initiative KEEP. Null Field KEEP. Doka Fever doubling is the lottery’s named hat (09-25-001). Secret floor painter stays 09-29-003. Three fire names stay 10-21-001. Three slow names stay 10-22-003. Four reflect rates stay 10-23-003.

Plague Zone registry `onTurnStart` still −1 (`mapModifiers.ts` 240–244) while WX logs “deals 2”. That number split is 09-01-002 / 09-26-002 — do not twin.

Shrine still pays 300 Doka silently; pure path writes `covenantBuffMapsRef = 3` with no combat reader (WX 11303–11330). Ground Doka credits the pickup value with no false card.

### World Dynamics catalog — MERGE or hold

`worldFeatures.ts` 1–20: design-only. `pickWeightedFeatures` callers: tests only. Do not stack on the live 22.

### Progression — EXPAND grants; KEEP no-cap; one L1 action budget; one SP job

`xpForNextLevel` = `100 * 2^(N-1)`. Victory XP = `sum(enemy.level * 20)` then silent ×1.5. HP **orb** is linear. Battle AP/MP use 8/4 +1/25. Forge stamps 10/5 (10-21-003) and **SP 8 / SR 5 / RES 10** (`startingChampionStats.ts` 13–17). Statistics never prints AP/MP cadences (09-27-001) and prints SR as inbound while enemy spells use SP (10-24-001). Spell damage does **not** compound with character level (`_casterLevel` unused). Do not add a level cap. Do not flatten death. Do not grow create AP to 10 to “match the sheet.” Do not grow SP as a second SR.

### Shops — SIMPLIFY

Items (BuffShop, localStorage) vs Buy Doka (GameKey, leftover-XP bar) vs leftover 15 SKUs vs rename 100 Doka vs `upgradeSpell` (the real mastery sink). Summon book 10× vs canister 1× is 09-22-002. HP pots vs 1:3 is 09-23-002. Fury is the one shop damage buff that **does** fight on the player loop. Charm is the shop **Shield** that fights Crush (10-23-002). In-battle pots fail `easy_1` (10-24-002). Swift Boots stays the self this-turn MP tool vs Haste-the-ally (**Haste must pay +2 first** — 10-25-002; “own” is 10-24-003). Elixir +3 AP / boots +2 MP / charm 20 / fury ×1.25 for 3 turns **match** `handleUseItem` this run — KEEP.

Canister `BUFF_CATALOG` still disagrees (`main.mo` 2772–2779: elixir 200 vs shop 80; fury 100 vs shop 150; `greater_potion` vs `greater_health_potion`). PXA-011.

### Death — KEEP the 20/40; DEPRECATE silent regen; do not call the rest hub a rest

`DEATH_XP_PENALTY_RATE = 0.2`, `DEATH_DOKA_PENALTY_RATE = 0.4`. Realm + guards. Idle +1/10s is 09-23-003. Rest hub copy is 09-29-002. Flee copy matches. `respawnHpAfterDeath` is 50% of the **linear** orb that WX `maxHp` also uses. Do not flatten the percentage.

### Rewards — REWORK the menu, KEEP the pipe

Victory Doka is seven hidden bands then Fever then chain then 100k clamp; recap zeros `dokaBreakdown` (`WX` 12468; 09-25-001). Ground Doka / shrine 300 / dungeon bonus / portal +10 remain one-shot `applyRewards` faucets with no recap language. Recap should remain one threat-scaled combat grant plus optional named challenge/feat lines. `easy_1` / `hard_1` payouts stay PXA-004 to scale; the **sentence** is 10-24-002. Blitz/under-15 payouts stay 09-26-001 to scale; the **Failed chip** is 10-25-003. Chain Doka × is honest; **Depth line** is 10-26-002. XP is **not** chain-multiplied — recap copy already says Doka; do not silently × XP.

### Visual feedback — KEEP juice; SIMPLIFY chrome; SIMPLIFY AoE preview / Haste % / turn chip / Depth / AP peak / grey kits

JUICE stays. Blood bar gone; Blood **rain** still sits under the select stats grid. Remaining simultaneous languages: leftover-XP bar (XP, Doka, zone, Center, Enemies, Buy Doka), GameFlow realm row (Items, Board, Feats, Bosses), challenge panel, Map Effects, initiative, spell bar, SummonControlPanel, orbs, chat/debug, Statistics (SP next to SR% as fake peers), unnamed lava/ice/spike tints, three fire badges, three slow badges, Barrier log “3 turns” vs card “2”, “Shield absorbed” vs Shield +30% RES, Mirror Field / Void Mirror / Reflect Shield / Mirror, enemy-cast `-${n} SP` vs sheet SR, `easy_1` “spells” vs potion fail, Haste “own” vs log “on wolf”, spellbook “Area — radius 2” vs a 3×3 execute, Chain Lightning bounce lines on a room-hit, Haste log “+100% MP”, challenge “Not met yet” at turn 40 of Blitz, **hard_3 with no Peak AP line**, **recap Depth 1/? next to a live ×**, **Bomber/Wisp grey kit forever**, **no mark paint vs Barrier towers**, **no “Mirror active!” on self-cast**.

DoT tick log names the **first** stack and ticks the **sum** (`WX` 1943–1991). Evidence for 10-21-001, not a fourth ID.

### Admin-enabled content — REWORK

CRUD still public-read. Default bosses still retired ids. Admin spells without targeting metadata still save (PXA-015). **LevelUpConfig** rewrites FAIL/range/AP-MP/HP from `pbv_levelup_config` with no in-session rules card (09-27-001) and an “all stats grow %” sentence that does not fight (10-21-003). **Leader Boost per Death (%)** has no combat reader (09-28-001). **Spell Damage Growth %** has no combat reader (09-29-001). The spell editor still offers `debuffStat: "healRecv"`, `"sp"`, and `"res_sp"` (`AdminDashboard.tsx` 3280) — pack-unread or mis-aimed keys — and `hitsMultiple` + `areaRadius` + `bounces` as if they were three independent truths (10-25-001). `summonAI` `"bomber"` / `"healer"` plus kit ids that the control panel cannot pay are **001 / 007**. Legacy `lava_fields` / `ice_fields` / `spike_pit` are labeled unused **and** still paint floors (09-29-003). Do not treat a silent slider as live ops content.

---

## Hunt answers (requested surfaces this run)

### Remaining DEFAULT_CHALLENGES — HUD vs fail vs complete

| Challenge | Fail chip when… | Complete when… | Verdict |
| :--- | :--- | :--- | :--- |
| Untouchable (`no_damage_taken`) | `totalDamage > 0` (`challengeCompletion.ts` 454–455) | `totalDamage === 0` (128–129) | **Honest fail.** KEEP chip wiring. |
| Striker (`direct_hit`) | `!directHit` after a spent attempt beyond Chebyshev 2 (387–397, 458–459) | `directHit && attempts > 0` (421–428) | **Honest fail** on a range-3 land. KEEP. |
| hard_3 (`under_8_ap_per_turn`) | `maxApUsedInTurn > 8` (452–453) | `maxApUsedInTurn <= 8` (126–127) | Fail wiring **works**; peak is **invisible** on the panel → **10-26-003**. Flat ≤ 8 auto-stamp stays **09-26-001**. |
| under_N_turns | never mid-fight (444–457) | `turnCount <= N` | **10-25-003** (do not twin). |
| easy_1 / hard_1 heal | `healUsed` | `!healUsed` (+ damage for hard_1) | Copy vs any-restore stays **10-24-002**. Pacifist feat overlap stays **PXA-009**. Wisp cannot currently restore the champion (**10-26-007**). |

`ChallengePanel` progress always shows Turns + Damage (`ChallengePanel.tsx` 304–307); Striker gets an extra line (308–312); **hard_3 never gets an AP line**.

### Summon cards vs spawn / lifespan / AI / control

Lifespan and HP/AP/MP chips in the spellbook mirror `getSummonBaseStats` + per-spell `summonLifespan` (`SpellbookModal.tsx` 246–259; `summonSpawn.ts` 147–161; `progression.ts` 218–244). Wolf / Archer / Sentinel kits are spendable at printed AP.

**Bomber is not** → **10-26-001**. **Wisp is not** → **10-26-007**. Not twins of EBMA-006 (AI executor).

### BuffShop vs live effects

Elixir +3 AP / Swift Boots +2 MP / Shield Charm 20 absorb / Fury ×1.25 for 3 turns **match** `handleUseItem`. HP pots vs overworld 1:3 stays **09-23-002**.

### Statistics / sheet

No new unread/lying peer beyond SR (09-26-003), FAIL-as-inbound stack (09-22-001 / 09-27-003), AP/MP cadence (09-27-001), SP inbound (10-24-001), **Strike FAIL unnamed (10-26-006)**. Resilience/evasion still unprinted (DEPRECATE under 09-26-003). Forge 10/5 vs battle 8/4 stays 10-21-003.

### Death Realm / Attack Nearest / BuffShop timing pots

KEEP (re-verified). Quiet map, no enemies/hazards. Copy: 20% XP / 40% Doka, half health, portal escape.

---

## What already fits (do not “fix”)

- AP for spells / MP for walk (**once create stamps 8 / 4**).
- Eight-slot bar as a **commitment** (once the book is earned — or once clones merge **and unique keys fight** — and once the default is not an auto-stamp). Slow/Weaken apply is EBMA-004. **AoE identity is 10-25-001. Mirror arming is 10-26-004. Mark identity is 10-26-005. Strike FAIL name is 10-26-006.**
- Summon archetypes, lifespan-on-own-turn, and the control panel (**plus ally buffs if the card says so and the budget reads them — and if Bomber/Wisp can spend their kits**).
- Persist lock + recap **mount** at root (**Depth fields must be filled — 10-26-002**).
- Death Realm as a place. Flee as death, not a second exit.
- Boss phase 2 as kit + ability escalation.
- No level cap + percentage death + compounding boss level-diff `1.08^diff`.
- Ember burn / Tide slow / Void 25% reflect — *if* they become explicit kit lines the Register repeats **under one fire name, one slow name, and one reflect verb**.
- Blood gone from the HUD.
- Accepted challenge HUD after first action. Untouchable/Striker fail chips.
- Physical Strike skipping FAIL **if** FAIL remains the only miss **and** the card says so (**006**).
- CHC, INIT, outbound SP, 30s clock, Attack Nearest on the selected spell.
- Leader **crown mark** on the highest-level unit (not the tooltip).
- Chaos Initiative + Null Field as written.
- Time Warp 15s matching the player clock (rename vs Timestep is copy).
- Timestep once-per-battle AP/MP reset (KEEP; not a second Time Warp).
- `upgradeSpell` exponential Doka cost as the book-power sink (wire or hide the % slider; do not add a second XP-like spell curve from character level).
- Spell Scholar (upgrade to level 5).
- Shield / Iron Skin / Haste / Enrage **write** path (those four **do** write `buffStat`, including onto summons). Coverage of Shield vs Crush is 10-23-002. “Own” vs ally is 10-24-003. **Haste’s restore is 10-25-002, not a reason to delete the write.**
- Mirror as the **one-shot** next-hit commitment **after 004 arms it** (10-23-003 keeps the rate MERGE).
- In-battle Fury / elixir / boots / charm as timing tools (Charm must not share the Shield noun; potions must not stealth-fail `easy_1`).
- Haste (ally, next restore) vs Swift Boots (self, this turn) as two MP-haste **commitments** — print “ally” on Haste **and** let +2 survive the tick (10-24-003 + 10-25-002).
- Dungeon **live** depth HUD (recap Depth is 002).

---

## Recommended sequence (human, not this automation)

1. **Honesty of rules the player can read today** — Register, modifier announce, Windstorm single rate, rush pair copy, resist words, Inferno CD, career cadence, leader crown sentence, post-mod floats, spell-dmg % = live math, floor hazards = the named event, **one fire name**, **one miss/lock rule**, **forge AP/MP = battle floor**, **`res_sp` maps or splits**, **drain number on the card is the drain number in the engine**, **Barrier one duration**, **one slow name**, **`dmg` / `healRecv` fight the pack**, **one Shield coverage**, **one reflect verb and a Mirror that arms**, **one SP job + RES once**, **no-heal sentence = `healUsed`**, **“own” buffs say ally**, **one `hitsMultiple` sentence**, **Haste +2 on a restore**, **turn-limit Failed when the cap has passed**, **Bomber kit the panel can spend**, **Wisp restore the panel can spend**, **recap Depth = live refs**, **hard_3 peak AP printed**, **Mark empty-floor places or aborts**, **Strike names FAIL skip**. Player Slow/Weaken **write** stays EBMA-004 / #528 / #555. (09-01-001/002, 09-02-003, 09-22-001, 09-27-001/002/003, 09-28-001/003, 09-29-001/003, 10-21-001/002/003, 10-22-001/002/003, 10-23-001/002/003, 10-24-001/002/003, 10-25-001/002/003, **10-26-001…007**, PXA-003)
2. **Keep accepted challenge HUD; land click-through (#364).** Then reshape the offer and predicates. (09-22-003, 09-26-001, PXA-009, 10-24-002, 10-25-003, **10-26-003**)
3. **Discovery contract** — innate 2–4, find the rest. Then rewrite default-bar / default-win feats. Do not ship Rune Bearer first. Merge clones **after** 10-22-001 / 10-23-001 / 10-24-001 / 10-25-001 / **10-26-004/005** make unique keys honest **and** 10-23-002 makes Shield fight Crush **and** 10-24-003 reprints ally buffs **and** 10-25-002 pays Haste **and** 001/007 make Bomber/Wisp real. (PXA-001, PXA-002, 09-01-003, 09-21-002, 09-28-002)
4. **NaN kit adapter, then one enemy poster + kits past zone 2.** (EBA-013, PXA-007, PXA-013)
5. **Unbounded grants** including victory XP and a non-lottery Doka function. (PXA-004, 09-23-001, 09-25-001, LHIPS-001)
6. **HUD / shop / words.** GameKey off the tactical bar; one resist word; Feats everywhere; Enemies off the leftover-XP row; Rest/Sanctuary/Safe Zone as one noun that matches the map; Shield ≠ Charm; Mirror ≠ Field ≠ Void ≠ Reflect Shield; SP ≠ SR; Timestep ≠ Time Warp; healing spells ≠ potions; bounce ≠ room-hit; adjacent ≠ radius 2 preview; turn ≠ “Not met yet”; explode ≠ grey Inferno; heals allies ≠ grey Blood Mend; Depth ≠ 1/?. (09-02-001, 09-21-001, 09-29-002, 10-23-002, 10-23-003, 10-24-001, 10-24-002, 10-24-003, 10-25-001, 10-25-003, **10-26-001/002/007**, PXA-011, PXA-012)

Do not implement these from this file unless a human or the Report Action Orchestrator picks an ID and it is still unique versus open PRs.

# Player Experience Coherence Audit — 2026-10-22

**Auditor:** Player Experience Coherence Auditor  
**Automation:** `30118f7c-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */48 * * *`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior audit:** [`PX_COHERENCE_AUDIT_2026-10-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-tactical-identity-audit-0404/docs/automation/PX_COHERENCE_AUDIT_2026-10-21.md) in open draft [PR #844](https://github.com/Mr-Melic/stralt/pull/844) (same production SHA)  
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

**Do not re-file** still-open PXA IDs from 08-31 … 10-21. They remain open in-repo or in drafts **#343 / #393 / #481 / #529 / #579 / #632 / #691 / #744 / #784 / #844**.  
Closed (do not re-open): `PXA-2026-08-31-006` (Blood HUD), `PXA-2026-09-02-002` (accepted challenge HUD via `shouldShowChallengeHud`).  
Queued sibling, not a close: [PR #696](https://github.com/Mr-Melic/stralt/pull/696) names Inferno’s cooldown — that is 09-27-002, still unmerged.  
New records: [`ACTION_IDS_PXA_2026-10-22.md`](./ACTION_IDS_PXA_2026-10-22.md) (`PXA-2026-10-22-001` … `003`).

Sibling IDs already own: kit-zone NaN (EBA-013), `computeAITier` 30% noise, LHIPS XP-wall / 1e9 Doka clamp, FAIL×Windstorm (09-22-001), Windstorm dual rate (09-02-003), one-sided modifier store **including Vampiric throwaway** (09-26-002), player-sheet SR inbound (09-26-003), `maxSpellRange` 5 (09-25-003), unread AP/MP/HP cadence (09-27-001), Inferno silent CD (09-27-002), hit-log SP vs math SR (09-27-003), leader crown inverse (09-28-001), default-bar / default-win feats (09-28-002), post-mod float (09-28-003), hardcoded 1.03 vs admin spell-dmg % (09-29-001), Rest/Sanctuary hub with no rest (09-29-002), named-event lava/ice/spike painter (09-29-003), three fire DoT names (10-21-001), Windstorm miss starts Inferno CD (10-21-002), forge AP 10 / MP 5 vs battle 8 / 4 (10-21-003), missing juice on `applyDamageToEnemy` (GFCF-003), family HP wipe (PREREQ-H), Blood Mend / Rally **CHC** rider (EBMA), victory HP floor vs persist (SDEG). This run does not twin those. PX still agrees: **scale combat grants; do not add a level cap.**

---

## Delta since 2026-10-21

`origin/main` has **not moved** since the 09-21…10-21 PX runs. All production claims below were re-read on `0f5363f` with current line numbers. No integrity merge landed in between. The **pipe** is the 09-02+ persist/recap work. The **loop** is still not one game.

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
| Accepted challenge HUD visible | **Yes (KEEP)** | `shouldShowChallengeHud`; do not hide again for click-steal (09-22-003 / #364) |
| Silent Boost ×1.5 | **Yes** | WX 2098 `_setBoostMode` unused; victory `boostMode === "xp"` at 12375 |
| Idle +1 HP / 10s | **Yes** | WX 3617–3624 |
| Betrayal 6× | **Yes** | WX 15594–15653 |
| Recap `dokaBreakdown: []` | **Yes** overworld (`WX` 12468) |
| `hard_3` AP ≤ 8 | **Yes** | `challengeCompletion.ts` 81–86 |
| Career AP/MP unread on the sheet | **Yes** | Statistics omits cadence (09-27-001). Forge still stamps 10/5 (10-21-003) |
| Inferno `cooldown: 3` silent | **Yes** | `spellData.ts` 504–519; #696 unmerged |
| Hit log `-SP` vs math SR | **Yes** | `castHelpers.ts` 377–389 |
| Leader crown tooltip vs erratic | **Yes** | `InitiativeStrip.tsx` 385 |
| Default-bar / default-win feats | **Yes** | 09-28-002 |
| Float vs `_dmgAfterMods` | **Yes** | WX 3517–3538 |
| Hardcoded `1.03^upgrade` | **Yes** | `combatMath.ts` 130–136 |
| Rest/Sanctuary hub with no rest | **Yes** | `generateRestMap` 5483–5522; toast 6142 / 6205 |
| Named-event lava/ice/spike painter | **Yes** | WX 6696–6729 |
| Three fire DoT names | **Yes** | Inferno / lava Burning / Ember `burn` (10-21-001) |
| Windstorm miss starts Inferno CD | **Yes** | `resolvePlayerCast` returns `"cast"` at 909–914 (10-21-002) |
| Forge AP 10 / MP 5 vs battle 8 / 4 | **Yes** | `startingChampionStats.ts` 8–12 vs `PLAYER_BASE_AP/MP` (10-21-003) |

What **did not** change for identity: discovery is still a gifted 32-id book; encounter copy still disagrees with the engine; secondary rewards are still flat on `100 * 2^(N-1)`.

**New this run** (same bytes, unread last cycle):

1. **The gifted book’s unique riders do not fire on the player path.** `resolvePlayerCast`’s damage loop (`spellEngine.ts` 876–1028) deals damage, crit, Blood Moon, Fury, Mirror Field, and Windstorm — then returns `"cast"`. It never writes `debuffStat`. `calcScaledDamageInline` floors at 1 (`1038–1044`), so Slow and Weaken (`damage: 0`) become **1-damage pokes**. Drain heals through `drainPercent || 0.5` of the first target’s damage (`castHelpers.ts` 473–488), not the card’s `healAmount`, and not “10 per hit” on Lifesteal Nova. The **enemy** path *does* apply `debuffStat` (`WX` 16594–16607). Summon Slow/Weaken apply a nametag with **no** `stat` (`summonExecutor.ts` 191–203). `res_sp` would not match `getStatModifier(..., "res")` / `"sp"` even if it were written (WX 3347–3358). Blood Mend / Rally CHC stays EBMA. PXA-002’s KEEP list (Cursed Wound, Weaken, Frost Nova) assumed those riders exist.
2. **Barrier, a protected signature, disagrees with itself about duration.** Card: “for 2 turns” (`spellData.ts` 179–196). Engine: `placeBarrierTile(gridPos, 3)` and log “for 3 turns” (`spellEngine.ts` 848–852). Ticks decrement on **player** turn start only (`WX` 14297–14308). That is a first-hour wall-clock lie on a KEEP spell.
3. **Movement tax is three stacking names.** Tide melee writes `effectName: "slow"`, −1 MP / 2 (`WX` 16805–16816). Ice tiles write `"Frozen"`, −2 MP / 2, log “Slowed!” with a stale “−50% MP” comment (`WX` 11454–11467). Enemy Slow writes `"Slow"` with `stat: "mp"` (`WX` 16594–16607). `getStatModifier` **sums** MP modifiers (`statusEffects.ts` 31–62); replace-or-refresh keys `effectName` (`76`). `"slow" !== "Slow" !== "Frozen"` → they stack. Frozen Terrain’s honest MP ×2 stays 09-29-003 / PXA-008. This is the fire-DoT finding (10-21-001) for **walk**, not burn.

---

## Verdict

The **core identity is still sound**: AP spends actions, MP spends movement, explicit `SpellConfig` targeting, one Doka wallet, persist-locked `applyRewards` + root recap **mount**, percentage death, honest solo boss kits, five distinct summons **plus player control**, signature spells (Swap, Mark, Barrier, Mirror, Timestep, Sacrifice), CHC ×2, INIT-sorted turn order, 30s shot clock with honest Time Warp 15s, Attack Nearest on the selected spell.

The game still does **not** play as one loop. The same three fractures dominate:

1. **Discovery is not a system.** The book is gifted. A helper named like a gate does not gate. **Worse:** half the gifted cards print a unique question the player path never asks.
2. **Rules on the box are not rules in the engine.** Register, rush pairs, several map events, Windstorm rates, resist words, Inferno’s hidden CD, leader crown copy, post-mod floats, secret floor hazards, three fire DoT names, a miss that starts cooldown, **Barrier 2 vs 3, rider cards that only work when the enemy casts them, and three MP-slow names that stack.**
3. **Most secondary rewards are flat** on an unbounded `2^(N-1)` curve. Live enemy kits never leave band 0. The forge still teaches a 10/5 action budget the fight overwrites.

Until PXA-001 / 003 / 007 / 008 / 013 and the still-open dated IDs are designed, adding World Dynamics tiles, Wave-N catalogs, or more admin SKUs will make the identity *less* readable. **Do not add more rider clones until 10-22-001 makes the existing riders fight.**

---

## Classification (all reviewed systems)

| System | Class | One-line why |
| :--- | :--- | :--- |
| **Combat AP/MP split** | KEEP | AP = actions, MP = movement; book `mpCost` is ~0. The Dofus-like decision. The **L1 stamp must match the floor** (10-21-003). |
| **Explicit spell targeting metadata** | KEEP | `targetType` / range / LoS — not name heuristics. Protect this. **Wire the same metadata on the player damage loop** (10-22-001). |
| **8-slot bar as loadout** | KEEP (noisy until clones merge **and riders live**) | Picking 8 of 32 is a decision only if the eight tools differ (PXA-002, 09-28-002, 10-22-001). |
| **Atomic reward funnel + root recap mount** | KEEP | `applyRewards` / `saveBattleStats` + `PostBattleRecap` at app root. Contents still lie (09-25-001/002). |
| **Death 20% XP / 40% Doka + Death Realm** | KEEP | Percentage cost stays meaningful with no cap. 1.5s guards are a real rule. Realm is a quiet map. |
| **Solo boss kits + `BossAbility` tags** | KEEP | Unique phase kits; real specials. Boss Guide is closer to truth than EnemyRegister. |
| **Enemy / summon AI engine** | KEEP | Archetypes, lethal lookahead, LoS step, backline guard. Do not add toggles. |
| **Summon five-pack + player control panel** | KEEP | Hunter / guardian / archer / bomber / healer are distinct; the panel is the mastery surface. Lifespan is taught. Kit Slow must carry `stat` (10-22-001). |
| **Signature spells** | KEEP | Swap, Mark, Barrier, Mirror, Timestep, Sacrifice each ask a question the clones do not. **Barrier’s duration must be one number** (10-22-002). |
| **CHC ×2 / INIT turn order** | KEEP | Live. Print them; they fight. |
| **SP outbound multiplier** | KEEP | WX 3318–3322. Do not teach it as inbound (09-27-003). Life Drain’s SP shred is 10-22-001, not 09-27-003. |
| **30s shot clock + Time Warp 15s** | KEEP | Panel shows `{turnTimeLeft}s`; announce matches the **player** timer. Do not rename Timestep in this ID (PXA-012 owns the Time- word). |
| **Attack Nearest on the selected spell** | KEEP | Same metadata as a click. Do not make it a second verb. |
| **Physical Strike skipping FAIL** | KEEP **if named** | The exemption is the only spendable answer to 20% fizzle (09-22-001). |
| **Leader crown mark** | KEEP the tell | Highest-level unit, canvas + strip. Copy and unused % boost are 09-28-001. |
| **Erratic AI after the leader dies** | KEEP if taught | Real counterplay (focus the crown). Today the tooltip teaches the inverse. |
| **Chaos Initiative shuffle** | KEEP | Announce + `applyTurnOrderSort` include the player. |
| **Null Field suppress buff/debuff** | KEEP | Hook is live on `applyActiveEffect`; DoTs correctly pass. |
| **`upgradeSpell` as the book-power sink** | KEEP the sink; REWORK the knob | Exponential Doka cost is the no-cap mastery spend. Hardcoded 3% + dead slider are 09-29-001. |
| **Spell Scholar (`spell_level_5`)** | KEEP | Real upgrade mastery. Distinct from default-bar Spell Master (09-28-002). |
| **JUICE** | KEEP | Shake / hitstop / numbers. The **value** on Titan/Glass must match the bar (09-28-003). |
| **Admin UI gated + backend `#admin`** | KEEP | Must stay off the player HUD. |
| **GameKey / Mollie IAP** | KEEP off-loop; SIMPLIFY chrome | Real-money faucet. Not a tactic (09-02-001). |
| **Accepted-challenge HUD visibility** | KEEP | `shouldShowChallengeHud`. Do not hide again to fix click-steal (09-22-003 / #364). |
| **In-battle elixir / boots / charm / fury** | KEEP as timing tools | Overworld HP pots cannot (09-23-002). Fury ×1.25 **is** live on the player damage loop (`spellEngine.ts` 894–899). |
| **Ember / Tide / Void family melee hooks** | MERGE into kits | Real but name-heuristic. Ember’s DoT name is 10-21-001. Tide’s `"slow"` name is 10-22-003. |
| **Fire DoTs (Inferno / lava Burning / Ember burn)** | MERGE to one burn language | 10-21-001. |
| **MP slows (Tide `slow` / spell `Slow` / ice `Frozen`)** | MERGE to one walk-tax language | New: 10-22-003. Frozen Terrain MP ×2 stays 09-29-003. |
| **Spell catalog (full `starterSpells`)** | MERGE **after riders live** | Shield ≡ Iron Skin; Poison ≡ Venom; two heals+CHC; Expose ≡ Shadow Veil; three drains. Unique KEEP tools are fake until 10-22-001. |
| **Gifted damage/drain riders** | REWORK the player path | New: 10-22-001. |
| **Crush / Fire Bolt fallback** | MERGE | Uncatalogued `e-crush` / `e-firebolt` (WX 16711–16712; 09-21-003). |
| **Slime Flood + Frozen Terrain** | MERGE | Same `onMpCost * 2`. Frozen also plants ice tiles (09-29-003). |
| **Arcane Surge + Overflow AP −1** | MERGE | Both `onApCost` −1. Overflow’s extra fizzle is effects-only (09-01-002). |
| **World Dynamics + Wave-3/4/5+ catalogs** | MERGE or hold | Unwired. Do not stack (09-21-002, 09-01-003). `worldFeatures.ts` is still design-only. |
| **HP potions vs 1:3 Doka-to-HP** | MERGE | Pots are strictly worse overworld recover (09-23-002). Hidden 0.5% jackpot heal stays PXA-009. |
| **Rest / dungeon / rush / solo-boss doors** | MERGE into a learnable set | Overworld mix is 09-24-003. The rest **hub** is 09-29-002. |
| **Named events + floor hazards** | MERGE to one language per event | 09-29-003. |
| **Enemy identity (piece + family + aiTier + Register lore)** | SIMPLIFY | Four posters for one unit. Live kit is always zone 0. |
| **Achievements / Feats** | SIMPLIFY | Mastery mixed with chores, RNG, and **default stamps** (09-28-002). Keep Spell Scholar. Button **Feats**; `title` Achievements (`GameFlow.tsx` 328–335). |
| **Buff shop + GameKey + leftover packages** | SIMPLIFY | Two carts. Catalog still disagrees. 15 SKUs still seeded. |
| **HUD chrome** | SIMPLIFY | Items + Buy Doka + Enemies-as-lore + Bosses + Board + Feats + chat. Character-select Blood rain is leftover 006. |
| **Terminology** | SIMPLIFY | Feats vs Achievements; GameKey vs Doka; Rest vs Sanctuary vs Safe Zone vs Death Realm; Blood Moon vs Blood Mend vs BloodParticles; SR vs RES vs SP vs resilience; FAIL vs Windstorm; Leader “boost” vs erratic; ice tiles vs Frozen Terrain vs **slow / Slow / Frozen / Slowed**; burn vs Burning vs Inferno DoT; Jackpot heal vs jackpot Doka band; Barrier 2 vs 3. |
| **FAIL vs Windstorm** | SIMPLIFY to one miss | 09-22-001. Dual Windstorm rates stay 09-02-003. Cooldown-on-miss is 10-21-002. |
| **Career AP/MP/HP growth** | EXPAND onto the sheet | Live AP/MP unread (09-27-001). **L1 stamp vs floor is 10-21-003.** Range cap stays 09-25-003. |
| **Spell-upgrade %** | SIMPLIFY to one source of truth | 09-29-001. |
| **Spell cooldown** | SIMPLIFY or teach | One gifted spell, silent card (09-27-002 / #696). Miss vs lock is 10-21-002. |
| **Resist words (log SP vs math SR)** | SIMPLIFY | 09-27-003. Player-sheet SR inbound stays 09-26-003. |
| **Post-mod damage floats** | SIMPLIFY to the live chip | 09-28-003. |
| **HUD Blood bar leftover field** | DEPRECATE leftover field | Chrome is gone. Keep canister inert. Do not invent a spend. |
| **`resilience` / `evasion` as player-facing** | DEPRECATE until a reader exists | Required persist fields. Register still claims evasion. |
| **`covenantBuff` / shrine 3-map write** | DEPRECATE or EXPAND | Shrine pays 300 Doka. The buff is still write-only. |
| **Canister `defaultShopPackages` 15 SKUs** | DEPRECATE from player truth | GameKey replaced the picker. |
| **Gravity / Fog until implemented** | DEPRECATE announce or implement | 09-01-002. |
| **Silent idle +1 HP/10s** | DEPRECATE | 09-23-003. |
| **Board Kills column** | DEPRECATE until official `saveKillCount` | 09-24-001. |
| **Betrayal 6×** | DEPRECATE or telegraph | 09-24-002. |
| **Dummy `"Battle Challenge"` recap string** | DEPRECATE | 09-25-002. |
| **`leaderBoostPercent` / unread multiplier** | DEPRECATE until a reader exists | 09-28-001. |
| **`spell_master_8` / auto `leader_slayer`** | DEPRECATE or rewrite the ask | 09-28-002. |
| **Admin `spellDmgGrowthPercent` until wired** | DEPRECATE or wire | 09-29-001. |
| **“Rest, hero” copy until the map rests** | DEPRECATE or EXPAND a real rest | 09-29-002. |
| **40% random extra hazard stamp** | DEPRECATE | 09-29-003. |
| **Forge AP 10 / MP 5 until they match battle 8 / 4** | DEPRECATE the extra two points | 10-21-003. |
| **`debuffStat: "res_sp"` until split or mapped** | DEPRECATE the compound key | New: 10-22-001. Admin dropdown still offers it (`AdminDashboard.tsx` 3280). |
| **Spell discovery** | REWORK | Innate 32-id book. No observe → win → unlock. |
| **Battle challenges** | REWORK offer + predicates | Random 9 including legendary; `hard_3` free until L25 (09-26-001). Pacifist feat vs `easy_1` no-heal stays PXA-009. |
| **Boss-rush combined mechanics** | REWORK | Copy-only. PXA-003 / 004 still own pair rules and scaling. |
| **Admin-enabled catalogs** | REWORK | Live book, `bossKits.ts`, `admin.mo` seeds are three truths. `res_sp` in the editor is a fourth (10-22-001). |
| **Map modifiers / world events** | SIMPLIFY + MERGE | 22 entries. Twins, placeholders, Titan lottery, one-sided store, Windstorm two rates, secret floor hazards, **three fire names, three slow names**. Plague registry −1 vs WX log “2” stays 09-01-002 / 09-26-002 — do not twin. |
| **EnemyRegister / family lore** | REWORK copy; SIMPLIFY HUD | FLAVOR LORE chip is honest; world-HUD **Enemies** button is not (09-21-001, 09-01-001). Tide “adjacent slow” is closer to truth than Ember tiles; the **name** is 10-22-003. |
| **Dungeon chain** | EXPAND | Reward skin on the overworld. Needs a rule free roam does not have. |
| **Progression / rewards (flat + linear-vs-exp + lottery)** | EXPAND grants | Curve unbounded; grants are not. Hidden Doka bands 09-25-001. Silent XP 1.5 09-23-001. Do not add a cap. |
| **Reach +1 / 10 levels** | EXPAND or announce the cap | Silent `maxSpellRange` 5 is 09-25-003. |
| **Inbound SR** | EXPAND only if melee path included | Sheet lie is 09-26-003. |
| **Rest hub** | EXPAND a unique rest rule or SIMPLIFY to a named door chooser | 09-29-002. |
| **Flee** | KEEP | BattleUI copy matches death 20/40 (`BattleUIPanel.tsx` 519–523). Not a second exit. |

---

## System notes (evidence)

### Enemies — SIMPLIFY poster; REWORK the register; MERGE Tide’s slow name

Overworld packs are still **chess pieces**. `buildEnemyKit` floors `levelZone`. Battle start still passes `currentMap.levelZone` as `{ name, minLevel, maxLevel }`. **Zone-0 kits forever.** Owned by EBA-013; PXA-013 is blocked until that adapter exists.

The **30% family overlay** still paints HP/dmg/RES and pixels, then battle start overwrites HP (`calcEnemyMaxHp`, PREREQ-H). Three families still apply **name-heuristic** melee extras (Ember burn, Tide −1 MP, Void 25% reflect). Ember’s live hook writes `effectName: "burn"` (`WX` 16789–16799). Tide writes `"slow"` (`WX` 16805–16816). Register still says Ember tiles and Tide “adjacent slow / HP regen.”

**Leader mark is live and worth keeping.** Copy remains 09-28-001.

### AI — KEEP (kits: EXPAND after adapter)

`decideEnemyAction` is still the best expression of identity. `computeAITier` still has a 30% full-random 1–10. Do not rewrite `enemyAI.ts` to add verbs. Betrayal 6× is 09-24-002. Erratic-after-leader is a real verb — teach it. Enemy turns use an 800ms executor + 5s watchdog; do not invent a player-facing enemy clock.

Enemy casts **do** apply `debuffStat`. That is the honest half of 10-22-001. Do not “fix” it by deleting the enemy rider.

### Spells — MERGE clones after riders live; KEEP signatures; SIMPLIFY Barrier duration; MERGE slow names

`starterSpells` is still the 32-id book including Strike. Almost every spell has `mpCost: 0`. **Keep that.** Inferno is still the only starter with `cooldown: 3` (09-27-002). Strike still skips FAIL and talks RES vs SP (09-27-003).

**New:** the player damage loop is a damage-only funnel. Unique questions printed on Frost Bolt, Frost Nova, Slow, Weaken, Expose, Shadow Veil, Cursed Wound, Life Drain, Drain Courage, and Lifesteal Nova do not execute for the caster who owns the gifted book. Enemy kits using the same ids do. Summon kits using Slow apply a badge without `stat`. That is 10-22-001.

**New:** Barrier card 2 vs engine 3 (10-22-002). Do not “fix” by hiding the card; pick one duration and one tick clock (player-turn decrement is the live clock).

Buff path (Shield, Iron Skin, Haste, Enrage) **does** write `buffStat` via the shield branch (`spellEngine.ts` 675–718). Fury Potion ×1.25 is live on the same damage loop. Those are KEEP. Blood Mend / Rally CHC still unused (EBMA).

Book power from upgrades is live and **good** as a no-cap sink. The number is not the admin field (09-29-001). Spell Scholar stays KEEP.

### Spell discovery — REWORK (unchanged class)

Innate 32. Admin extras with `usableByPlayer = true` still union into the book. Recap still cannot grant a spell. Do not ship Rune Bearer attune as a substitute. Do not add more catalog rows until 10-22-001 / PXA-002 settle what a “row” even does.

### Achievements (Feats) — SIMPLIFY + keep Spell Scholar

Same 15 seeds (`admin.mo` 309–326). Spectator feats stay PXA-009. Default-bar / default-win stay 09-28-002. Spell Scholar is the upgrade-mastery row the book actually has. Pacifist vs `easy_1` no-heal stays 009.

### Challenges — REWORK offer and predicates; KEEP HUD visibility

Same 9 contracts, random every fight. `hard_3` cannot fail until AP grows at 25 (09-26-001) **and** create-stamped AP 10 is overwritten to 8 (10-21-003). Recap still writes `"Battle Challenge"` (09-25-002). Click-steal stays 09-22-003 / #364. Visibility KEEP.

### Bosses — KEEP kits; REWORK rush pairs

19 frontend ids + `bossKits.ts` still honest. `combinedMechanic` still only in `useBossRush.ts`. Live room-clear Doka is `level * 1.5` — PXA-003 / 004, not re-filed.

### Dungeons — EXPAND

Chain is still depth + Doka multiplier + white portal. Same generator, AI, modifiers as free roam. White portal dumps into the rest hub (09-29-002). Portal-verb overload on the overworld is 09-24-003.

### World events — SIMPLIFY + MERGE; slow names must be one language

22 registry entries. Two-roll trigger. Admin dropdown echoes `announceText`. Honesty still broken (Windstorm, Blood Moon flavor, Gravity/Fog empty, Titan lottery, one-sided store, Surge≡Overflow AP). Vampiric throwaway stays 09-26-002. Titan/Glass floats stay 09-28-003. Time Warp KEEP. Chaos Initiative KEEP. Null Field KEEP. Doka Fever doubling is the lottery’s named hat (09-25-001). Secret floor painter stays 09-29-003. Three fire names stay 10-21-001.

Plague Zone registry `onTurnStart` still −1 (`mapModifiers.ts` 240–244) while WX logs “deals 2” (`PLAGUE_ZONE_TICK`, `WX` 14309–14324) after `applyTurnStart` on a turn-order entry the player is not in. That number split is 09-01-002 / 09-26-002 — do not twin.

**New:** ice `"Frozen"` stacks with Tide `"slow"` and enemy `"Slow"` (10-22-003). Void Rift announce still says “displacement”; live rule is a moving avoid-tile plus a 3 HP tick (`WX` 14374–14390, `voidRiftWalkDamage`). Hold under 09-01-002.

### World Dynamics catalog — MERGE or hold

`worldFeatures.ts` 1–20: design-only. `pickWeightedFeatures` callers: tests only. Do not stack on the live 22.

### Progression — EXPAND grants; KEEP no-cap; one L1 action budget; print the career that actually fights

`xpForNextLevel` = `100 * 2^(N-1)`. Victory XP = `sum(enemy.level * 20)` then silent ×1.5. HP **orb** is linear. Battle AP/MP use 8/4 +1/25. Forge stamps 10/5 (10-21-003). Statistics never prints those cadences (09-27-001). Spell damage does **not** compound with character level (`_casterLevel` unused). Do not add a level cap. Do not flatten death. Do not grow create AP to 10 to “match the sheet.”

### Shops — SIMPLIFY

Items (BuffShop, localStorage) vs Buy Doka (GameKey, leftover-XP bar) vs leftover 15 SKUs vs rename 100 Doka vs `upgradeSpell` (the real mastery sink). Summon book 10× vs canister 1× is 09-22-002. HP pots vs 1:3 is 09-23-002. Fury is the one shop damage buff that **does** fight on the player loop — KEEP as a timing tool, distinct from Enrage (PXA-002).

### Death — KEEP the 20/40; DEPRECATE silent regen; do not call the rest hub a rest

`DEATH_XP_PENALTY_RATE = 0.2`, `DEATH_DOKA_PENALTY_RATE = 0.4`. Realm + guards. Idle +1/10s is 09-23-003. Rest hub copy is 09-29-002. Flee copy matches. Do not flatten the percentage.

### Rewards — REWORK the menu, KEEP the pipe

Victory Doka is seven hidden bands then Fever then chain then 100k clamp; recap zeros `dokaBreakdown` (09-25-001). Ground Doka / shrine 300 / dungeon bonus / portal +10 remain one-shot `applyRewards` faucets with no recap language. Recap should remain one threat-scaled combat grant plus optional named challenge/feat lines.

### Visual feedback — KEEP juice; SIMPLIFY chrome; SIMPLIFY fire names, slow names, miss words, rest words, hazard tells, Barrier duration

JUICE stays. Blood bar gone; Blood **rain** still sits under the select stats grid. Remaining simultaneous languages: leftover-XP bar (XP, Doka, zone, Center, Enemies, Buy Doka), GameFlow realm row (Items, Board, Feats, Bosses), challenge panel, Map Effects, initiative, spell bar, SummonControlPanel, orbs, chat/debug, Statistics, unnamed lava/ice/spike tints, **three fire badges, three slow badges**, Barrier log “3 turns” vs card “2”.

DoT tick log names the **first** stack and ticks the **sum** (`WX` 1943–1991). Evidence for 10-21-001, not a fourth ID.

### Admin-enabled content — REWORK

CRUD still public-read. Default bosses still retired ids. Admin spells without targeting metadata still save (PXA-015). **LevelUpConfig** rewrites FAIL/range/AP-MP/HP from `pbv_levelup_config` with no in-session rules card (09-27-001) and an “all stats grow %” sentence that does not fight (10-21-003). **Leader Boost per Death (%)** has no combat reader (09-28-001). **Spell Damage Growth %** has no combat reader (09-29-001). The spell editor still offers `debuffStat: "res_sp"` (`AdminDashboard.tsx` 3280) — a compound key combat never reads (10-22-001). Legacy `lava_fields` / `ice_fields` / `spike_pit` are labeled unused **and** still paint floors (09-29-003). Do not treat a silent slider as live ops content.

---

## What already fits (do not “fix”)

- AP for spells / MP for walk (**once create stamps 8 / 4**).
- Eight-slot bar as a **commitment** (once the book is earned — or once clones merge **and riders live** — and once the default is not an auto-stamp).
- Summon archetypes, lifespan-on-own-turn, and the control panel.
- Persist lock + recap **mount** at root.
- Death Realm as a place. Flee as death, not a second exit.
- Boss phase 2 as kit + ability escalation.
- No level cap + percentage death + compounding boss level-diff `1.08^diff`.
- Ember burn / Tide slow / Void 25% reflect — *if* they become explicit kit lines the Register repeats **under one fire name and one slow name**.
- Blood gone from the HUD.
- Accepted challenge HUD after first action.
- Physical Strike skipping FAIL **if** FAIL remains the only miss **and** the card says so.
- CHC, INIT, outbound SP, 30s clock, Attack Nearest on the selected spell.
- Leader **crown mark** on the highest-level unit (not the tooltip).
- Chaos Initiative + Null Field as written.
- Time Warp 15s matching the player clock.
- `upgradeSpell` exponential Doka cost as the book-power sink (wire or hide the % slider; do not add a second XP-like spell curve from character level).
- Spell Scholar (upgrade to level 5).
- Shield / Iron Skin / Haste / Enrage buff path (those four **do** write `buffStat`).
- In-battle Fury / elixir / boots / charm as timing tools.

---

## Recommended sequence (human, not this automation)

1. **Honesty of rules the player can read today** — Register, modifier announce, Windstorm single rate, rush pair copy, resist words, Inferno CD, career cadence, leader crown sentence, post-mod floats, spell-dmg % = live math, floor hazards = the named event, **one fire name**, **one miss/lock rule**, **forge AP/MP = battle floor**, **player riders = enemy riders**, **Barrier one duration**, **one slow name**. (09-01-001/002, 09-02-003, 09-22-001, 09-27-001/002/003, 09-28-001/003, 09-29-001/003, 10-21-001/002/003, 10-22-001/002/003, PXA-003)
2. **Keep accepted challenge HUD; land click-through (#364).** Then reshape the offer and predicates. (09-22-003, 09-26-001, PXA-009)
3. **Discovery contract** — innate 2–4, find the rest. Then rewrite default-bar / default-win feats. Do not ship Rune Bearer first. Merge clones **after** 10-22-001. (PXA-001, PXA-002, 09-01-003, 09-21-002, 09-28-002)
4. **NaN kit adapter, then one enemy poster + kits past zone 2.** (EBA-013, PXA-007, PXA-013)
5. **Unbounded grants** including victory XP and a non-lottery Doka function. (PXA-004, 09-23-001, 09-25-001, LHIPS-001)
6. **HUD / shop / words.** GameKey off the tactical bar; one resist word; Feats everywhere; Enemies off the leftover-XP row; Rest/Sanctuary/Safe Zone as one noun that matches the map. (09-02-001, 09-21-001, 09-29-002, PXA-011, PXA-012)

Do not implement these from this file unless a human or the Report Action Orchestrator picks an ID and it is still unique versus open PRs.

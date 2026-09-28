# Player Experience Coherence Audit — 2026-09-28

**Auditor:** Player Experience Coherence Auditor  
**Automation:** `30118f7c-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */48 * * *`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior audit:** [`PX_COHERENCE_AUDIT_2026-09-27.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-tactical-identity-audit-7fcc/docs/automation/PX_COHERENCE_AUDIT_2026-09-27.md) in open draft [PR #691](https://github.com/Mr-Melic/stralt/pull/691) (same production SHA)  
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

**Do not re-file** still-open PXA IDs from 08-31 … 09-27. They remain open in-repo or in drafts **#343 / #393 / #481 / #529 / #579 / #632 / #691**.  
Closed (do not re-open): `PXA-2026-08-31-006` (Blood HUD), `PXA-2026-09-02-002` (accepted challenge HUD via `shouldShowChallengeHud`).  
Queued sibling, not a close: [PR #696](https://github.com/Mr-Melic/stralt/pull/696) names Inferno’s cooldown — that is 09-27-002, still unmerged.  
New records: [`ACTION_IDS_PXA_2026-09-28.md`](./ACTION_IDS_PXA_2026-09-28.md) (`PXA-2026-09-28-001` … `003`).

Sibling IDs already own: kit-zone NaN (EBA-013), `computeAITier` 30% noise, LHIPS XP-wall / 1e9 Doka clamp, FAIL×Windstorm (09-22-001), Windstorm dual rate (09-02-003), one-sided modifier store **including Vampiric throwaway** (09-26-002 — do not twin), player-sheet SR inbound (09-26-003), `maxSpellRange` 5 (09-25-003), unread AP/MP/HP cadence (09-27-001), Inferno silent CD (09-27-002), hit-log SP vs math SR (09-27-003), missing primary-hit juice on `applyDamageToEnemy` (GFCF-003). This run does not twin those. PX still agrees: **scale combat grants; do not add a level cap.**

---

## Delta since 2026-09-27

`origin/main` has **not moved** since the 09-21…09-27 PX runs. All production claims below were re-read on `0f5363f` with current line numbers. No integrity merge landed in between. The **pipe** is the 09-02+ persist/recap work. The **loop** is still not one game.

| Claim from last audits | Still true? | Updated evidence |
| :--- | :--- | :--- |
| Full `starterSpells` gifted as innate | **Yes** | `WorldExploration.tsx` 2395–2406; 32 ids in `spellData.ts` 9–663 |
| `shouldIncludeBackendSpellInLibrary` is not discovery | **Yes** | `adminSafety.ts` 712–718: `usableByPlayer !== false` → include |
| `combinedMechanic` unused | **Yes** | Only `useBossRush.ts` 19–130; zero readers in `WorldExploration.tsx` |
| Blood HUD gone; field leftover | **Yes** | GameFlow 282–290 spacer. `bloodBalance` still on the record (`main.mo` 137) |
| Covenant buff write-only | **Yes** | `covenantBuffMapsRef` write WX 11330; no combat reader |
| Slime Flood ≡ Frozen Terrain | **Yes** | Both `onMpCost * 2` (`mapModifiers.ts` 155–172) |
| Gravity Well / Fog of War empty | **Yes** | Registry 280–296; WX `_isGravityWell` / `_isFogOfWar` 2324–2326 unused |
| Titan’s Vigor +1000 HP, 1–5× | **Yes** | `mapModifiers.ts` 300–316; store-only (09-26-002) |
| Vampiric Ground throwaway attacker | **Yes — already 09-26-002** | Announce honest (`mapModifiers.ts` 401–414); WX 3499–3506 builds a fresh `{ hp, id: "player" }` and never writes HP back |
| Admin bosses still name `fireball` / `blood_nova` | **Yes** | `admin.mo` 358–541 |
| Random legendary challenge every fight | **Yes** | WX 12210–12218 |
| Buff shop vs canister catalog drift | **Yes** | `BuffShop.tsx` 31–79 vs `main.mo` 2772–2779 |
| Kits stop at zone 0 (NaN adapter) | **Yes** | `buildEnemyKit(..., currentMap.levelZone)` at WX 11920 |
| Paper Windstorm dual rate | **Yes** | Announce “reach halved” (`mapModifiers.ts` 249–257). Player 30% any-hit (WX 9563–9572). Enemy 50% if `range > 1` |
| 15 IAP SKUs unused by player UI | **Yes** | `defaultShopPackages()` `admin.mo` 265–282; player cart is GameKey |
| Accepted challenge HUD visible | **Yes (KEEP)** | `shouldShowChallengeHud`; do not hide again for click-steal (09-22-003 / #364) |
| Silent Boost ×1.5 | **Yes** | WX 2098 `_setBoostMode` unused; victory `boostMode === "xp"` at 12375 |
| Idle +1 HP / 10s | **Yes** | WX 3617–3626 |
| Betrayal 6× | **Yes** | WX 15594–15653 |
| Recap `dokaBreakdown: []` | **Yes** | WX 12468, 12646 |
| `hard_3` AP ≤ 8 | **Yes** | `challengeCompletion.ts` 81–86 |
| Career AP/MP/HP unread | **Yes** | `progression.ts` 59–82; Statistics omits cadence (09-27-001) |
| Inferno `cooldown: 3` silent | **Yes** | `spellData.ts` 504–519; #696 unmerged |
| Hit log `-SP` vs math SR | **Yes** | `castHelpers.ts` 377–389 (09-27-003) |

What **did not** change for identity: discovery is still a gifted 32-id book; encounter copy still disagrees with the engine; secondary rewards are still flat on `100 * 2^(N-1)`.

**New this run** (same bytes, unread last cycle):

1. **The leader crown teaches the opposite of the live rule.** Initiative tooltip: “Leader — gains strength from ally deaths” (`InitiativeStrip.tsx` 385). Designation is highest-level enemy (`WX` 12010–12015). `shouldApplyLeaderDeathBoost` fires only when **the leader** dies (`deathPipeline.ts` 68–76). The pack then goes **erratic** (`WX` 15507–15518). `_leaderBoostMultiplier` is written `+0.25` on that death (`WX` 9050) and **never read**. Admin “Leader Boost per Death (%)” (`AdminDashboard.tsx` 6267–6285; `leaderBoostPercent` default 10) is passed into `castHelpers` and discarded (`castHelpers.ts` 297–298). The crown **mark** is a real tell. The **sentence** is a lie.
2. **Spell Master and Leader Slayer stamp the default first session.** Default bar is `ownedSpells.slice(0, 8)` (`WX` 2615–2617). Idle + victory both fire `spell_master_8` when the bar has 8 (`WX` 3635–3636; `victoryAchievements.ts` 34). Every fight crowns someone; a win kills them, so `leader_slayer` (`admin.mo` 317; `victoryAchievements.ts` 40) is a second First Blood. Neither answers mastery.
3. **Named damage events change the bar, not the number in the air.** `enemyTakesDamage` applies `_dmgAfterMods` to HP (`WX` 3517–3522) then `spawnDamageAtTile(..., dmg)` and `return dmg` (`3524–3538`) — pre-mod. Player `dealDamage` ignores the helper’s return and returns `amount` (`WX` 9176–9183). Titan 1–5× and Glass ×2 (`mapModifiers.ts` 311–346) therefore teach the wrong chip. Distinct from Vampiric throwaway (09-26-002) and from missing juice on `applyDamageToEnemy` (GFCF-003).

---

## Verdict

The **core identity is still sound**: AP spends actions, MP spends movement, explicit `SpellConfig` targeting, one Doka wallet, persist-locked `applyRewards` + root recap, percentage death, honest solo boss kits, five distinct summons **plus player control**, signature spells (Swap, Mark, Barrier, Mirror, Timestep, Sacrifice), CHC ×2, INIT-sorted turn order, 30s shot clock with honest Time Warp 15s, Attack Nearest on the selected spell.

The game still does **not** play as one loop. The same three fractures dominate:

1. **Discovery is not a system.** The book is gifted. A helper named like a gate does not gate.
2. **Rules on the box are not rules in the engine.** Register, rush pairs, several map events, Windstorm rates, resist words, Inferno’s hidden CD, **leader crown copy**, **post-mod damage floats**.
3. **Most secondary rewards are flat** on an unbounded `2^(N-1)` curve. Live enemy kits never leave band 0. **Default feats stamp the first bar and the first clear.**

**New this run:** the only pack-hierarchy tell teaches stacking that does not exist; two feats pay for showing up; Titan/Glass numbers in the air disagree with the HP they just wrote.

Until PXA-001 / 003 / 007 / 008 / 013 and the still-open dated IDs are designed, adding World Dynamics tiles, Wave-N catalogs, or more admin SKUs will make the identity *less* readable.

---

## Classification (all reviewed systems)

| System | Class | One-line why |
| :--- | :--- | :--- |
| **Combat AP/MP split** | KEEP | AP = actions, MP = movement; book `mpCost` is ~0. The Dofus-like decision. |
| **Explicit spell targeting metadata** | KEEP | `targetType` / range / LoS — not name heuristics. Protect this. |
| **8-slot bar as loadout** | KEEP (noisy until clones merge) | Picking 8 of 32 is a decision; 32 clones + auto-first-8 make it a stamp (PXA-002, 09-28-002). |
| **Atomic reward funnel + root recap mount** | KEEP | `applyRewards` / `saveBattleStats` + `PostBattleRecap` at app root. Contents still lie (09-25-001/002). |
| **Death 20% XP / 40% Doka + Death Realm** | KEEP | Percentage cost stays meaningful with no cap. 1.5s guards are a real rule. Realm is a quiet map. |
| **Solo boss kits + `BossAbility` tags** | KEEP | Unique phase kits; real specials. Boss Guide is closer to truth than EnemyRegister. |
| **Enemy / summon AI engine** | KEEP | Archetypes, lethal lookahead, LoS step, backline guard. Do not add toggles. |
| **Summon five-pack + player control panel** | KEEP | Hunter / guardian / archer / bomber / healer are distinct; the panel is the mastery surface. Lifespan is taught. |
| **Signature spells** | KEEP | Swap, Mark, Barrier, Mirror, Timestep, Sacrifice each ask a question the clones do not. |
| **CHC ×2 / INIT turn order** | KEEP | Live. Print them; they fight. |
| **SP outbound multiplier** | KEEP | WX 3318–3322. Do not teach it as inbound (09-27-003). |
| **30s shot clock + Time Warp 15s** | KEEP | Panel shows `{turnTimeLeft}s`; announce matches the timer. |
| **Attack Nearest on the selected spell** | KEEP | Same metadata as a click. Do not make it a second verb. |
| **Physical Strike skipping FAIL** | KEEP **if named** | The exemption is the only spendable answer to 20% fizzle (09-22-001). Card still talks RES vs SP (09-27-003). |
| **Leader crown mark** | KEEP the tell | Highest-level unit, canvas + strip. Copy and unused % boost are 09-28-001. |
| **Erratic AI after the leader dies** | KEEP if taught | Real counterplay (focus the crown). Today the tooltip teaches the inverse. |
| **Chaos Initiative shuffle** | KEEP | Announce + `applyTurnOrderSort` include the player. |
| **Null Field suppress buff/debuff** | KEEP | Hook is live on `applyActiveEffect` (WX 1873–1886); DoTs correctly pass. |
| **JUICE** | KEEP | Shake / hitstop / numbers. The **value** on Titan/Glass must match the bar (09-28-003). |
| **Admin UI gated + backend `#admin`** | KEEP | Must stay off the player HUD. |
| **GameKey / Mollie IAP** | KEEP off-loop; SIMPLIFY chrome | Real-money faucet. Not a tactic (09-02-001). |
| **Accepted-challenge HUD visibility** | KEEP | `shouldShowChallengeHud`. Do not hide again to fix click-steal (09-22-003 / #364). |
| **In-battle elixir / boots / charm / fury** | KEEP as timing tools | Overworld HP pots cannot (09-23-002). |
| **Ember / Tide / Void family melee hooks** | MERGE into kits | Real but name-heuristic. Fold into explicit kit metadata. |
| **Spell catalog (full `starterSpells`)** | MERGE | Shield ≡ Iron Skin; Poison ≡ Venom; two heals+CHC; Expose ≡ Shadow Veil; three drains. |
| **Crush / Fire Bolt fallback** | MERGE | Uncatalogued `e-crush` / `e-firebolt` (09-21-003). |
| **Slime Flood + Frozen Terrain** | MERGE | Same `onMpCost * 2`. |
| **Arcane Surge + Overflow AP −1** | MERGE | Both `onApCost` −1. Overflow’s extra fizzle is effects-only (09-01-002). |
| **World Dynamics + Wave-3/4/5+ catalogs** | MERGE or hold | Unwired. Do not stack (09-21-002, 09-01-003). |
| **HP potions vs 1:3 Doka-to-HP** | MERGE | Pots are strictly worse overworld recover (09-23-002). |
| **Rest / dungeon / rush / solo-boss doors** | MERGE into a learnable set | One map can teach five portal verbs (09-24-003). |
| **Enemy identity (piece + family + aiTier + Register lore)** | SIMPLIFY | Four posters for one unit. Live kit is always zone 0. |
| **Achievements / Feats** | SIMPLIFY | Mastery mixed with chores, RNG, and **default stamps** (09-28-002). Button **Feats**; `title` Achievements. |
| **Buff shop + GameKey + leftover packages** | SIMPLIFY | Two carts. Catalog still disagrees. 15 SKUs still seeded. |
| **HUD chrome** | SIMPLIFY | Items + Buy Doka + Enemies-as-lore + Bosses + Board + Feats + chat. |
| **Terminology** | SIMPLIFY | Feats vs Achievements; GameKey vs Doka; Blood Moon vs Blood Mend; SR vs RES vs SP vs resilience; FAIL vs Windstorm; Leader “boost” vs erratic. |
| **FAIL vs Windstorm** | SIMPLIFY to one miss | 09-22-001. Dual Windstorm rates stay 09-02-003. |
| **Career AP/MP/HP growth** | EXPAND onto the sheet | Live, unread (09-27-001). Range cap stays 09-25-003. |
| **Spell cooldown** | SIMPLIFY or teach | One gifted spell, silent card (09-27-002 / #696). |
| **Resist words (log SP vs math SR)** | SIMPLIFY | 09-27-003. Player-sheet SR inbound stays 09-26-003. |
| **Post-mod damage floats** | SIMPLIFY to the live chip | New: 09-28-003. |
| **HUD Blood bar leftover field** | DEPRECATE leftover field | Chrome is gone. Keep canister inert. |
| **`resilience` / `evasion` as player-facing** | DEPRECATE until a reader exists | Required persist fields. Register still claims evasion. |
| **`covenantBuff` / shrine 3-map write** | DEPRECATE or EXPAND | Shrine pays 300 Doka. The buff is still write-only. |
| **Canister `defaultShopPackages` 15 SKUs** | DEPRECATE from player truth | GameKey replaced the picker. |
| **Gravity / Fog until implemented** | DEPRECATE announce or implement | 09-01-002. |
| **Silent idle +1 HP/10s** | DEPRECATE | 09-23-003. |
| **Board Kills column** | DEPRECATE until official `saveKillCount` | 09-24-001. |
| **Betrayal 6×** | DEPRECATE or telegraph | 09-24-002. |
| **Dummy `"Battle Challenge"` recap string** | DEPRECATE | 09-25-002. |
| **`leaderBoostPercent` / unread multiplier** | DEPRECATE until a reader exists | New: 09-28-001. |
| **`spell_master_8` / auto `leader_slayer`** | DEPRECATE or rewrite the ask | New: 09-28-002. |
| **Spell discovery** | REWORK | Innate 32-id book. No observe → win → unlock. |
| **Battle challenges** | REWORK offer + predicates | Random 9 including legendary; `hard_3` free until L25 (09-26-001). |
| **Boss-rush combined mechanics** | REWORK | Copy-only. Not shown in WX, not executed. |
| **Admin-enabled catalogs** | REWORK | Live book, `bossKits.ts`, `admin.mo` seeds are three truths. LevelUpConfig unread (09-27-001). Leader % is a dead knob (09-28-001). |
| **Map modifiers / world events** | SIMPLIFY + MERGE | 22 entries. Twins, placeholders, Titan lottery, one-sided store, Windstorm two rates, floats that ignore the hook. |
| **EnemyRegister / family lore** | REWORK copy; SIMPLIFY HUD | FLAVOR LORE chip is honest; world-HUD **Enemies** button is not (09-21-001, 09-01-001). |
| **Dungeon chain** | EXPAND | Reward skin on the overworld. Needs a rule free roam does not have. |
| **Progression / rewards (flat + linear-vs-exp + lottery)** | EXPAND grants | Curve unbounded; grants are not. Hidden Doka bands 09-25-001. Silent XP 1.5 09-23-001. Do not add a cap. |
| **Reach +1 / 10 levels** | EXPAND or announce the cap | Silent `maxSpellRange` 5 is 09-25-003. |
| **Inbound SR** | EXPAND only if melee path included | Sheet lie is 09-26-003. Do not invent a reader in a drive-by. |

---

## System notes (evidence)

### Enemies — SIMPLIFY poster; REWORK the register; REWORK leader copy

Overworld packs are still **chess pieces**. `buildEnemyKit` would grow at zone 1 / 2 **if** it received a number. Battle start still passes `currentMap.levelZone` as an object (`WX` 11920). **Zone-0 kits forever.** Owned by EBA-013; PXA-013 is blocked until that adapter exists.

The **30% family overlay** still paints HP/dmg/RES and pixels. Three families still apply **name-heuristic** melee extras (Ember burn, Tide −1 MP, Void 25% reflect) while `EnemyRegister` `MONSTERS` teach elemental types, evasion, wall-phase, Archbishop pawn-invuln under a **FLAVOR LORE** chip. World leftover-XP bar still opens it with **Enemies**. GameFlow **Bosses** is the closer-to-true bestiary.

**Leader mark is live and worth keeping.** Highest-level unit gets the crown on the canvas (`WX` 8107–8110) and the strip. What the strip **says** is false (09-28-001). `leader_slayer` then pays for the inevitable kill (09-28-002).

### AI — KEEP (kits: EXPAND after adapter)

`decideEnemyAction` is still the best expression of identity. `computeAITier` still has a 30% full-random 1–10. Do not rewrite `enemyAI.ts` to add verbs. Betrayal 6× is 09-24-002. Erratic-after-leader is a real verb — teach it, do not invent ally-death stacking on top.

### Spells — MERGE clones, KEEP signatures, SIMPLIFY cooldown

`starterSpells` is still the 32-id book including Strike. Almost every spell has `mpCost: 0`. **Keep that.** Inferno is still the only starter with `cooldown: 3` and a burn-only description (09-27-002). Strike still skips FAIL (`spellEngine.ts` 642–651) and talks RES vs SP (09-27-003).

### Spell discovery — REWORK (unchanged class)

Innate 32. Admin extras with `usableByPlayer = true` still union into the book. Recap still cannot grant a spell. Do not ship Rune Bearer attune as a substitute.

### Achievements (Feats) — SIMPLIFY + new default stamps

Same 15 seeds (`admin.mo` 309–326). Spectator feats (betrayal, jackpot) still fire from world RNG (PXA-009). `spell_master_8` is a stamp on the gifted first-8 bar. `leader_slayer` is a stamp on “win, because every pack has a crown.” Button Feats / title Achievements. New ID: PXA-2026-09-28-002.

### Challenges — REWORK offer and predicates; KEEP HUD visibility

Same 9 contracts, random every fight. `hard_3` cannot fail until AP grows at 25 (09-26-001). Recap still writes `"Battle Challenge"` (09-25-002). Click-steal stays 09-22-003 / #364. Visibility KEEP.

### Bosses — KEEP kits; REWORK rush pairs

19 frontend ids + `bossKits.ts` still honest. `combinedMechanic` still only in `useBossRush.ts`. Room rewards still flat.

### Dungeons — EXPAND

Chain is still depth + Doka multiplier + white portal. Same generator, AI, modifiers as free roam. Portal-verb overload is 09-24-003.

### World events — SIMPLIFY + MERGE; floats must match the hook

22 registry entries. Two-roll trigger. Admin dropdown echoes `announceText`. Honesty still broken (Windstorm, Blood Moon flavor, Gravity/Fog empty, Titan lottery, one-sided store, Surge≡Overflow AP). Vampiric throwaway stays 09-26-002. **New:** Titan/Glass change HP via `applyDamageDealt` then the float prints the pre-hook chip (09-28-003). Time Warp KEEP. Chaos Initiative KEEP. Null Field KEEP (buff/debuff veto is live; DoTs pass). Doka Fever doubling is the lottery’s named hat (09-25-001).

### World Dynamics catalog — MERGE or hold

`worldFeatures.ts` 1–18: design-only. `pickWeightedFeatures` callers: tests only.

### Progression — EXPAND grants; KEEP no-cap; print the career rules

`xpForNextLevel` = `100 * 2^(N-1)`. Victory XP = `sum(enemy.level * 20)` then silent ×1.5. HP compounds; AP/MP step every 25. Statistics never prints those cadences (09-27-001). Do not add a level cap. Do not flatten death.

### Shops — SIMPLIFY

Items (BuffShop, localStorage) vs Buy Doka (GameKey, leftover-XP bar) vs leftover 15 SKUs vs rename 100 Doka vs `upgradeSpell` (the real mastery sink). Summon book 10× vs canister 1× is 09-22-002. HP pots vs 1:3 is 09-23-002.

### Death — KEEP the 20/40; DEPRECATE silent regen

`DEATH_XP_PENALTY_RATE = 0.2`, `DEATH_DOKA_PENALTY_RATE = 0.4`. Realm + guards. Idle +1/10s is 09-23-003. Do not flatten the percentage.

### Rewards — REWORK the menu, KEEP the pipe

Victory Doka is seven hidden bands then Fever then chain then 100k clamp; recap zeros `dokaBreakdown` (09-25-001). Ground Doka / shrine 300 / dungeon bonus / portal +10 remain one-shot `applyRewards` faucets with no recap language (owned by flat grants + 09-25-001 — not re-filed). Recap should remain one threat-scaled combat grant plus optional named challenge/feat lines.

### Visual feedback — KEEP juice; SIMPLIFY chrome; SIMPLIFY resist words and leader copy

JUICE stays. Blood bar gone. Remaining simultaneous languages: leftover-XP bar (XP, Doka, zone, Center, Enemies, Buy Doka), GameFlow realm row (Items, Board, Feats, Bosses), challenge panel, Map Effects, initiative, spell bar, SummonControlPanel, orbs, chat/debug, Statistics.

New: crown tooltip vs erratic (09-28-001); float vs `_dmgAfterMods` (09-28-003). Sheet SR% inbound (09-26-003). FAIL as a sixth stat peer of RES (09-22-001). Hit log `-SP` (09-27-003).

### Admin-enabled content — REWORK

CRUD still public-read. Default bosses still retired ids. Admin spells without targeting metadata still save (PXA-015). **LevelUpConfig** rewrites identity from `pbv_levelup_config` with no in-session rules card (09-27-001). **Leader Boost per Death (%)** is a validated 0–100 GameConfig field with no combat reader (09-28-001). Do not treat a silent slider as live ops content.

---

## What already fits (do not “fix”)

- AP for spells / MP for walk.
- Eight-slot bar as a **commitment** (once the book is earned — or once clones merge — and once the default is not an auto-stamp).
- Summon archetypes, lifespan-on-own-turn, and the control panel.
- Persist lock + recap **mount** at root.
- Death Realm as a place.
- Boss phase 2 as kit + ability escalation.
- No level cap + percentage death + compounding boss level-diff `1.08^diff`.
- Ember burn / Tide slow / Void 25% reflect — *if* they become explicit kit lines the Register repeats.
- Blood gone from the HUD.
- Accepted challenge HUD after first action.
- Physical Strike skipping FAIL **if** FAIL remains the only miss **and** the card says so.
- CHC, INIT, outbound SP, 30s clock, Attack Nearest on the selected spell.
- Leader **crown mark** on the highest-level unit (not the tooltip).
- Chaos Initiative + Null Field as written.
- Time Warp 15s matching the clock.

---

## Recommended sequence (human, not this automation)

1. **Honesty of rules the player can read today** — Register, modifier announce, Windstorm single rate, rush pair copy, resist words, Inferno CD, career cadence, **leader crown sentence**, **post-mod floats**. (09-01-001/002, 09-02-003, 09-27-001/002/003, 09-28-001/003, PXA-003)
2. **Keep accepted challenge HUD; land click-through (#364).** Then reshape the offer and predicates. (09-22-003, 09-26-001, PXA-009)
3. **Discovery contract** — innate 2–4, find the rest. Then rewrite default-bar / default-win feats. Do not ship Rune Bearer first. (PXA-001, 09-01-003, 09-21-002, 09-28-002)
4. **NaN kit adapter, then one enemy poster + kits past zone 2.** (EBA-013, PXA-007, PXA-013)
5. **Unbounded grants** including victory XP and a non-lottery Doka function. (PXA-004, 09-23-001, 09-25-001, LHIPS-001)
6. **HUD / shop / words.** GameKey off the tactical bar; one resist word; Feats everywhere; Enemies off the leftover-XP row. (09-02-001, 09-21-001, PXA-011, PXA-012)

Do not implement these from this file unless a human or the Report Action Orchestrator picks an ID and it is still unique versus open PRs.

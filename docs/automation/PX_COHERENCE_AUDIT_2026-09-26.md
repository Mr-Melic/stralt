# Player Experience Coherence Audit — 2026-09-26

**Auditor:** Player Experience Coherence Auditor  
**Automation:** `30118f7c-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */48 * * *`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior in-repo audit:** [`PX_COHERENCE_AUDIT_2026-09-02.md`](./PX_COHERENCE_AUDIT_2026-09-02.md) at `58302bc`  
**Prior unmerged PX pass:** `PX_COHERENCE_AUDIT_2026-09-25.md` in PR **#579** (same HEAD `0f5363f`; also #343 / #393 / #481 / #529)  
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

**Do not re-file** `PXA-2026-08-31-001` … `015`, `PXA-2026-09-01-001` … `003`, `PXA-2026-09-02-001` / `003`, or `PXA-2026-09-21-001` … `PXA-2026-09-25-003`. Those records are still open in unmerged docs PRs **#343 / #393 / #481 / #529 / #579**.  
`PXA-2026-09-02-002` remains **done** (accepted challenge HUD). `PXA-2026-08-31-006` display half remains **done** (Blood bar gone). Do not hide the challenge HUD again to fix click-steal (`PXA-2026-09-22-003` / **#364**).

New records: [`ACTION_IDS_PXA_2026-09-26.md`](./ACTION_IDS_PXA_2026-09-26.md) (`PXA-2026-09-26-001` … `003`).

Sibling IDs already own: kit-zone NaN (`EBA-013`), `computeAITier` 30% noise, LHIPS XP-wall / victory-grant shape / 1e9 Doka clamp, unbounded summoner chance, spawn `floor(999 / tierSize)`, FAIL×Windstorm (`PXA-2026-09-22-001`), summon 10× tag (`PXA-2026-09-22-002`), challenge HUD hit-testing (`PXA-2026-09-22-003`), silent Boost ×1.5 (`PXA-2026-09-23-001`), HP-pot vs 1:3 (`PXA-2026-09-23-002`), idle +1 HP/10s (`PXA-2026-09-23-003`), Board unused kills (`PXA-2026-09-24-001`), betrayal 6× (`PXA-2026-09-24-002`), portal-verb overload (`PXA-2026-09-24-003`), hidden victory-Doka lottery (`PXA-2026-09-25-001`), recap dummy “Battle Challenge” (`PXA-2026-09-25-002`), silent `maxSpellRange` 5 (`PXA-2026-09-25-003`). This run does not twin those. PX still agrees: **scale combat grants; do not add a level cap.**

Open PRs older than this docs branch (createdAt ascending): **#327** (Striker AoE), **#331** (portal destack), then the 09-21 flock including prior PX docs **#343**. Unique files on this branch do not overlap those.

---

## Delta since 2026-09-25

**Production HEAD did not move.** `0f5363f` is still the merge of **#332**. The 09-21…09-25 PX audits inspected the same bytes. Integrity pipe and live loop are unchanged. This pass went after fractures those dated files did not name.

| Claim from last merged PX audit (09-02) / 09-25 memory | Still true? | Updated evidence |
| :--- | :--- | :--- |
| Full `starterSpells` gifted as innate | **Yes** | `WorldExploration.tsx` 2395–2406; `spellData.ts` 9–28 (Strike + 31 starters, five summons) |
| `shouldIncludeBackendSpellInLibrary` is not discovery | **Yes** | `adminSafety.ts` 711–718: `usableByPlayer !== false` → include |
| `combinedMechanic` unused | **Yes** | `useBossRush.ts` 19 / 31–130; no WX reader |
| Blood HUD gone | **Yes** | `GameFlow.tsx` 282–290 spacer. `bloodBalance` still on `main.mo` 137 |
| Covenant buff write-only | **Yes** | `covenantBuffMapsRef` write `WorldExploration.tsx` 11330; no combat reader |
| Kits NaN-stuck at zone 0 | **Yes** | `buildEnemyKit(..., currentMap.levelZone)` at 11920; `levelZone` is `{ name, minLevel, maxLevel }` 4683–4687 |
| Paper Windstorm two live rates | **Yes** | Announce “reach halved” (`mapModifiers.ts` 249–257). Player 30% any-hit (9563–9572). Enemy 50% if `range > 1` (16491, 16729) |
| Accepted challenge HUD | **Still visible** | `shouldShowChallengeHud` (`challengeHudVisibility.ts`). WX `visible` is still the accept window (19177–19178). Click-steal remains **#364** / 09-22-003 |
| Random legendary every fight | **Yes** | 12210–12218 |
| Crush / Fire Bolt fallback | **Yes** | 16710–16715 |
| Hidden victory Doka bands + empty recap breakdown | **Yes** | 12379–12420; recap `dokaBreakdown: []` at 12468 — owned by 09-25-001 |
| Recap dummy challenge name | **Yes** | `completedChallenges: ["Battle Challenge"]` at 12469 — owned by 09-25-002 |
| `maxSpellRange` 5 | **Yes** | `getEffectiveSpellRange` 3653–3664 — owned by 09-25-003 |
| Registry hooks are called | **Yes, but one-sided** | `applyBattleStart` / `applyTurnStart` / `applyDamageDealt` are live. The **player is not in `combatantsRef`**. New ID: PXA-2026-09-26-002 |
| Challenge `under_8_ap_per_turn` | **Auto-complete on default AP** | Peak AP is 8 until level 25 (`DEFAULT_LEVELUP_CONFIG.apMpGrowthEveryNLevels` 25). New ID: PXA-2026-09-26-001 |
| Player sheet SR | **Display-only vs incoming** | `playerTakesDamage` 3424–3432 applies RES only. New ID: PXA-2026-09-26-003 |

What this run adds (not a production delta):

1. **Challenge *predicates* do not track the unbounded curve.** PXA-004 scales *payouts*. PXA-009 shapes *which* contract is offered (lava vs Untouchable, feat overlap). Neither said: `hard_3` cannot fail while AP is 8; `under_50_damage` gets easier as HP compounds; `under_5_turns` is a different game on 1 pawn vs dungeon extras.
2. **Named map events are not a shared field.** Titan / Iron Curse / Mending Mist / Swift Winds / Vampiric mutate `combatantsRef` or a throwaway attacker object. The player lives outside that store (`battleSetup.ts` 360–368). Announce text is symmetric. The engine is not.
3. **The Statistics sheet teaches a second resist the incoming path does not run.** Player SR is printed next to RES. Incoming uses RES only. `evasion` / `resilience` are required persist fields with no combat reader.

---

## Verdict

The **core identity is still sound**: AP spends actions, MP spends movement, explicit `SpellConfig` targeting, one Doka wallet, persist-locked `applyRewards` + root recap **mount**, percentage death, honest solo boss kits + `BossAbility`, five distinct summons **plus player control**, signature spells (Swap, Mark, Barrier, Mirror, Timestep, Sacrifice).

The game still does **not** play as one loop. The same three fractures dominate:

1. **Discovery is not a system.** The book is gifted. Catalog membership is still ownership.
2. **Rules on the box are not rules in the engine.** Register (lore chip), rush pairs, Windstorm’s two rates, Crush/Fire Bolt, and now **one-sided map events** plus a **sheet SR that does not protect the player**.
3. **Secondary rewards and secondary *contracts* are flat** on an unbounded `2^(N-1)` curve. Live enemy kits never leave band 0.

Until PXA-001 / 003 / 007 / 008 / 013 and the still-open 09-01…09-25 IDs are designed, **do not implement** formations, SDE Wave-3 ids, boss Wave-4/5 sheets, or World Dynamics overlays. This run adds three honesty/no-cap records; it does not reopen those catalogs.

---

## Classification (all reviewed systems)

| System | Class | One-line why |
| :--- | :--- | :--- |
| **Combat AP/MP split** | KEEP | AP = actions, MP = movement; book `mpCost` is ~0. The Dofus-like decision. |
| **Explicit spell targeting metadata** | KEEP | `targetType` / range / LoS — not name heuristics. Protect this. |
| **Atomic reward funnel + root recap mount** | KEEP | `applyRewards` / `saveBattleStats` + `PostBattleRecap` at app root. Recap *contents* still lie (09-25-001/002). |
| **Death 20% XP / 40% Doka + Death Realm** | KEEP | Percentage cost stays meaningful with no cap. 1.5s guards are a real rule. |
| **Solo boss kits + `BossAbility` tags** | KEEP | Unique phase kits; real specials. Boss Guide is closer to truth than EnemyRegister. |
| **Enemy / summon AI engine** | KEEP | Archetypes, lethal lookahead, LoS step, backline guard. Do not add toggles. |
| **Summon five-pack + player control panel** | KEEP | Hunter / guardian / archer / bomber / healer are distinct; the panel is the mastery surface. |
| **Signature spells** | KEEP | Swap, Mark, Barrier, Mirror, Timestep, Sacrifice each ask a question the clones do not. |
| **JUICE** | KEEP | Shake / hitstop / numbers. Presentation only. |
| **Admin UI gated + backend `#admin`** | KEEP | Must stay off the player HUD. |
| **Accepted-challenge HUD visibility** | KEEP | `shouldShowChallengeHud`. Do not revert. Hit-testing is 09-22-003. |
| **GameKey / Mollie IAP** | KEEP off-loop; SIMPLIFY chrome | Real-money faucet. Not a tactic. Still on the leftover-XP cart (09-02-001). |
| **Strike skipping FAIL** | KEEP | If FAIL remains the only miss language (it does not — 09-22-001). |
| **In-battle elixir / boots / charm / fury** | KEEP | Timing tools. Overworld HP pots are 09-23-002. |
| **Time Warp 15s** | KEEP | Announce matches the timer. |
| **SP as outbound spell multiplier** | KEEP | Live at `WorldExploration.tsx` 3318–3322. |
| **Ember / Tide / Void family melee hooks** | MERGE into kits | Real but name-heuristic. Fold into explicit kit metadata. |
| **Spell catalog (full `starterSpells`)** | MERGE | Shield ≡ Iron Skin; Poison ≡ Venom; two heals+CHC; Expose ≡ Shadow Veil; three drains. |
| **Enemy Crush / Fire Bolt fallback** | MERGE | Uncatalogued melee verbs (09-21-003). |
| **Slime Flood + Frozen Terrain** | MERGE | Same `onMpCost * 2`. |
| **Arcane Surge + Arcane Overflow AP −1** | MERGE | Overflow’s extra fizzle is `onEffectApplication`, not the FAIL roll. |
| **World Dynamics + Wave-3/4/5 catalogs** | MERGE or hold | Docs only. 09-21-002. |
| **Enemy identity (piece + family + aiTier + Register lore)** | SIMPLIFY | Four posters. Live kit is always zone 0. |
| **Achievements / Feats** | SIMPLIFY | Mastery mixed with chores and RNG. Button **Feats**; `title` Achievements (`GameFlow.tsx` 330–335). Recap “Achievements Unlocked”. |
| **Buff shop + GameKey + leftover packages** | SIMPLIFY | Items vs Buy Doka. Catalog still disagrees. 15 SKUs still seeded. |
| **World-HUD Enemy Register** | SIMPLIFY placement | Admitted flavor on the leftover-XP bar (09-21-001). |
| **FAIL as a Statistics-sheet peer of RES** | SIMPLIFY | A diminishing tax, not a character stat. Stacks with Windstorm (09-22-001). |
| **HUD Blood bar** | DEPRECATE leftover field | Chrome is gone. Keep canister inert. |
| **`resilience` / `evasion` / player incoming SR** | DEPRECATE or EXPAND | Persist-required or sheet-printed; incoming path is RES-only. |
| **`covenantBuff` / shrine 3-map write** | DEPRECATE or EXPAND | Shrine pays 300 Doka. Buff is write-only. |
| **Canister `defaultShopPackages` 15 SKUs** | DEPRECATE from player truth | GameKey replaced the picker. |
| **Gravity Well / Fog of War** | DEPRECATE until implemented | Empty hooks; unused `_isGravityWell` / `_isFogOfWar`. |
| **Spell discovery** | REWORK | Innate 32-id book. No observe → win → unlock. |
| **Battle challenges** | REWORK offer; KEEP HUD | Random 9 including legendary. **Predicates are not no-cap-safe.** |
| **Boss-rush combined mechanics** | REWORK | Copy-only. |
| **Admin-enabled catalogs** | REWORK | Live book, `bossKits.ts`, `admin.mo` seeds are three truths. |
| **Map modifiers / world events** | SIMPLIFY + MERGE + **one-sided player** | 22 entries. Twins, placeholders, Titan lottery. Registry runs; **player is not a combatant**. |
| **EnemyRegister / family lore** | REWORK copy | Sentences for a game that is not running, plus a lore chip. |
| **Dungeon chain** | EXPAND | Extra rats + Doka multiplier. Needs a rule free roam does not have. |
| **Progression / rewards (flat + linear-vs-exp)** | EXPAND | Curve unbounded; grants and **challenge predicates** are not. Do not add a cap. |
| **Terminology** | SIMPLIFY | Feats vs Achievements; GameKey vs Doka; SR vs RES vs resilience; Enemies vs Flavor Lore vs Bosses. |

---

## System notes (evidence)

### Enemies — SIMPLIFY poster; REWORK the register

Overworld packs are still **chess pieces**. `buildEnemyKit` (`enemyAI.ts` 163–199) would grow at zone 1 / 2 **if** it received a number. Battle start still calls `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) where `levelZone` is `{ name: "Tier N Zone", minLevel, maxLevel }` (4683–4687). Comment at 11915 still says “10 random spells.” Live kits are zone 0. **Do not re-file EBA-013.** Do not expand the kit table (PXA-013) until the call site passes a number.

The leftover-XP chip prints that `Tier N Zone` name (17827). It is the **player’s** spawn-tier label, not a kit band. Owned as chrome noise under PXA-007 / EBA-013; not a new ID.

Family overlay, Ember/Tide/Void hooks, and Register copy are unchanged. Placement remains 09-21-001. Copy rewrite remains 09-01-001.

### AI — KEEP (kits: EXPAND after adapter)

`decideEnemyAction` is still the best expression of identity. Random `computeAITier` 30% (`combatMath.ts` 34–51) and Crush/Fire Bolt fallback (16710–16715) stay with their owners.

### Spells — MERGE clones, KEEP signatures

`starterSpells` is still the 32-id book (`spellData.ts` 9–28, 547–663). `spellType: "damage"` on Shield (40) still leaks into admin. Almost every spell has `mpCost: 0`. **Keep that.**

Summon book still advertises `10 × 10 × 2^level` (`SpellbookModal.tsx` 439–447; `SUMMON_UPGRADE_COST_MULTIPLIER` in `gameConstants.ts` 94–102) while `upgradeSpell` charges `10 * 2^level`. Owned by 09-22-002.

### Spell discovery — REWORK

Innate union at `WorldExploration.tsx` 2395–2439. No persist `ownedSpellIds` / `observedSpellIds`. Recap still cannot grant a spell. Do not ship Rune Bearer (`worldFeatures.ts` 512–524) as a substitute.

### Achievements (Feats) — SIMPLIFY

Same 15 seeds (`admin.mo` 309–326). `spell_master_8` fires when `activeSpells.length >= 8` (`WorldExploration.tsx` 3635–3636) on a gifted 32-id book — a stamp, not a commitment. Covered by PXA-001 / 009; not re-filed.

### Challenges — REWORK offer; KEEP HUD; **predicates are not no-cap-safe** (new)

Same 9 contracts (`challengeCompletion.ts` 44–109). Same random offer (12210–12218). HUD visibility remains KEEP.

Default battle AP is `PLAYER_BASE_AP + floor(level / 25)` (`progression.ts` 59–72; `DEFAULT_LEVELUP_CONFIG.apMpGrowthEveryNLevels` 25 at `gameTypes.ts` 417–419). `hard_3` succeeds when `maxApUsedInTurn <= 8` (`challengeCompletion.ts` 84–86, 126–127). **Until level 25 the player cannot spend 9 AP.** The contract is an auto-complete. After AP grows it becomes “leave points on the bar.” That is two different games wearing one legendary-adjacent hard row.

`under_50_damage` / `no_healing_under_30_damage` are absolute HP. Player HP compounds at `statGrowthPercent` 5 (`getPlayerBaseStats` 74–80). At level 1, 50 damage is half the pool. At level 40 it is a scratch. **The same sentence gets easier as the unbounded curve does its job.** Untouchable (0 damage) stays a real mastery ask. The flat-N rows do not.

Turn caps (`under_5_turns` / `under_10` / `under_15`) do not see pack size. Overworld rolls 1–8 (`spawnPolicy.ts` `OVERWORLD_ENEMY_COUNT_SPAN`) plus dungeon extras (`DUNGEON_EXTRA_ENEMIES`). Blitz on a solo pawn is not Blitz on depth 5.

PXA-004 is payouts. PXA-009 is lava vs Untouchable and feat overlap. New ID: **PXA-2026-09-26-001**.

### Bosses — KEEP kits; REWORK rush pairs

Unchanged. `combinedMechanic` still copy-only.

### Dungeons — EXPAND

Unchanged. Extra rats, not a new rule. PXA-010.

### World events — SIMPLIFY + MERGE; **player is not in the registry** (new)

22 registry entries. Two-roll trigger. `mapModifierRegistry.apply*` **is** called (`applyBattleStart` 12076–12079, `applyTurnStart` 14266–14273, `applyDamageDealt` 3499–3517, `applyTurnOrderSort` 14718–14720, `applyRewardMultiplier` 12420). That is progress vs empty Gravity/Fog hooks.

The player is **not** a row in `combatantsRef`. `playerTurnStartModifierTarget` returns `undefined` when `id === "player"` is absent (`battleSetup.ts` 360–368, test 136–144). Battle start `syncCombatants(..., enemiesWithSpells)` then `applyBattleStart(combatantsRef.current)` (12075–12079). Consequences:

| Named event | Announce | What actually happens to the player |
| :--- | :--- | :--- |
| Titan’s Vigor | +1000 HP, 1–5× (`mapModifiers.ts` 300–316) | Enemies in the store get +1000. Player HP is unchanged |
| Iron Curse | +30% RES, healing halved (379–397) | Enemy `res` is multiplied. Player RES is not. Heal-half is still a placeholder return-true |
| Mending Mist | 5% max HP regen each turn (350–365) | Enemy `onTurnStart` heals the store row. Player turn-start target is missing |
| Swift Winds | +2 MP each turn (368–376) | Enemies walk farther. Player MP is not ticked |
| Vampiric Ground | attackers heal 15% (400–416) | `enemyTakesDamage` passes a **throwaway** `{ hp: characterStats.hp, id: "player" }` (3499–3506). Lifesteal mutates that object and is discarded |
| Glass Realm | damage doubled, dealt **and taken** (337–347) | Outbound `applyDamageDealt` can ×2 hits on enemies. `playerTakesDamage` (3424–3432) never calls the registry. Enemy melee also skips `playerTakesDamage` (16774–16776) |

Gravity Well / Fog remain empty (`_isGravityWell` / `_isFogOfWar` 2324–2326). Windstorm dual-rate remains 09-02-003. Announce-vs-engine class remains 09-01-002. **One-sided registry application is new.** New ID: **PXA-2026-09-26-002**.

### World Dynamics catalog — MERGE or hold

`worldFeatures.ts` still test-only (`pickWeightedFeatures` callers). Still 09-01-003 / 09-21-002.

### Progression — EXPAND grants; KEEP no-cap; do not flatten death

`xpForNextLevel` = `100 * 2^(N-1)`. Victory XP = `sum(enemy.level * 20)` plus silent ×1.5 (09-23-001). Do not add a cap. Do not twin LHIPS.

### Shops — SIMPLIFY

Unchanged vs 09-02-001 / PXA-011. BuffShop `greater_health_potion` cost 120 (`BuffShop.tsx` 41–46) vs canister `greater_potion` 120 name-mismatch; elixir 80 vs 200; fury 150 vs 100 (`main.mo` 2772–2778).

### Death — KEEP

`DEATH_XP_PENALTY_RATE = 0.2`, `DEATH_DOKA_PENALTY_RATE = 0.4`. Do not flatten.

### Rewards — REWORK the menu, KEEP the pipe

Victory Doka lottery and empty `dokaBreakdown` stay 09-25-001. Recap challenge name stays 09-25-002.

### Visual feedback — KEEP juice; SIMPLIFY chrome

JUICE stays. Simultaneous languages: sticky challenge panel (z 1200, grab, default right — 09-22-003), Map Effects (`MapModifiersPanel` default `{ x: innerWidth-230, y: 360 }`), initiative, spell bar, SummonControlPanel, orbs, Feats, Items, Buy Doka, Bosses, Enemies (flavor), Board, chat, debug, Statistics (SP / SR / FAIL).

Statistics prints **SR** next to **RES** (`WorldExploration.tsx` 18528–18550). Incoming player damage uses **RES only** (`playerTakesDamage` 3427–3432: “DoT ticks do NOT apply SR — only RES” on the path that handles all sources this function sees). `startingChampionStats` still seeds `sr: 5`, `evasion: 5`, `resilience: 8` (`startingChampionStats.ts` 14–18). Combat math does not read player evasion/resilience. Register still claims “evasion passive” (`EnemyRegister.tsx` 81). New ID: **PXA-2026-09-26-003**.

### Admin-enabled content — REWORK

CRUD still public-read. Default bosses still retired ids. Admin modifier dropdown still copies `announceText` (`mapModifiers.ts` 505–513), so a truthful dropdown can still schedule a one-sided or empty rule. Admin spells without targeting metadata still save (PXA-015).

---

## What already fits (do not “fix”)

- AP for spells / MP for walk.
- Eight-slot bar as a **commitment** (once the book is earned).
- Summon archetypes, lifespan-on-own-turn, and the control panel.
- Persist lock + recap **mount** at root.
- Death Realm as a place.
- Boss phase 2 as kit + ability escalation.
- No level cap + percentage death + compounding boss level-diff.
- Ember burn / Tide slow / Void 25% reflect — *if* they become explicit kit lines the Register repeats.
- Blood gone from the HUD.
- Accepted challenge tracker visible after the first action.
- Time Warp 15s matching the shot clock.
- SP as outbound spell power.
- Strike skipping FAIL **if** FAIL is the only miss language.

---

## Recommended sequence (human, not this automation)

1. **Honesty of rules the player can read today** — Register copy, modifier announce, Windstorm single rate, rush pair copy, Crush/Fire Bolt → Strike, **one-sided registry vs player**, **sheet SR**. (PXA-2026-09-01-001, PXA-2026-09-01-002, PXA-2026-09-02-003, PXA-003, PXA-2026-09-21-003, **PXA-2026-09-26-002**, **PXA-2026-09-26-003**)
2. **Take flavor lore off the leftover-XP bar.** (PXA-2026-09-21-001)
3. **Challenge contracts that still mean something at any AP/HP/pack size.** (**PXA-2026-09-26-001**) then offer shaping (PXA-009).
4. **Discovery contract** — innate 2–4, find the rest. Do not ship Rune Bearer, formations, or Wave-3 SDE first. (PXA-001, PXA-2026-09-01-003, PXA-2026-09-21-002)
5. **NaN kit adapter, then one enemy poster + kits past zone 2.** (EBA-013, PXA-007, PXA-013)
6. **Unbounded grants** including victory XP (and a non-lottery Doka function). (PXA-004, LHIPS-001, PXA-2026-09-25-001)
7. **HUD / shop / words.** GameKey off the tactical bar; retire unused packages; Feats vs Achievements. (PXA-2026-09-02-001, PXA-011, PXA-012)

Do not implement these from this file unless a human or the Report Action Orchestrator picks an ID and it is still unique versus open PRs.

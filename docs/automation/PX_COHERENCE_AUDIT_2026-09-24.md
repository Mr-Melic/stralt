# Player Experience Coherence Audit — 2026-09-24

**Auditor:** Player Experience Coherence Auditor  
**Automation:** `30118f7c-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */48 * * *`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior audits on this SHA:** [`PX_COHERENCE_AUDIT_2026-09-23.md`](./PX_COHERENCE_AUDIT_2026-09-23.md) in open PR [#481](https://github.com/Mr-Melic/stralt/pull/481); [`PX_COHERENCE_AUDIT_2026-09-22.md`](./PX_COHERENCE_AUDIT_2026-09-22.md) in [#393](https://github.com/Mr-Melic/stralt/pull/393); [`PX_COHERENCE_AUDIT_2026-09-21.md`](./PX_COHERENCE_AUDIT_2026-09-21.md) in [#343](https://github.com/Mr-Melic/stralt/pull/343). Merged priors: [`PX_COHERENCE_AUDIT_2026-09-02.md`](./PX_COHERENCE_AUDIT_2026-09-02.md) at `58302bc`.  
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

**Do not re-file** `PXA-2026-08-31-001` … `015` (006 HUD hide done), `PXA-2026-09-01-001` … `003`, `PXA-2026-09-02-001` / `003` (002 HUD done), `PXA-2026-09-21-001` … `003`, `PXA-2026-09-22-001` … `003`, or `PXA-2026-09-23-001` … `003`.  
New records: [`ACTION_IDS_PXA_2026-09-24.md`](./ACTION_IDS_PXA_2026-09-24.md) (`PXA-2026-09-24-001` … `003`).

Sibling IDs already own: kit-zone NaN (`EBA-013` / SDE / PREREQ-A), family HP wipe at battle start (`PREREQ-H` / Content Diversity), `computeAITier` 30% noise, unbounded summoner chance, spawn `floor(999 / tierSize)`, LHIPS XP-wall / victory-grant shape, FAIL × Windstorm (09-22-001), summon 10× tag (09-22-002), challenge HUD click-steal (09-22-003 / [#364](https://github.com/Mr-Melic/stralt/pull/364)), silent Boost ×1.5 (09-23-001), HP pots vs 1:3 (09-23-002), idle +1 HP/10s (09-23-003). This run does not twin those. PX still agrees: **scale combat grants; do not add a level cap.**

Wave-3 through Wave-6 design catalogs remain a **hold** under `PXA-2026-09-21-002`. Do not treat those PRs as live systems.

---

## Delta since 2026-09-23

`origin/main` has **not moved** since the 09-21 / 09-22 / 09-23 audits (`0f5363f`). Integrity / parity / map PRs remain open; they are not this SHA. The **pipe** on main is unchanged. The **loop** is unchanged. This run is a new read of the same bytes: three player-facing languages earlier PX ledgers never named.

| Claim from 09-23 | Still true? | Updated evidence |
| :--- | :--- | :--- |
| Full `starterSpells` gifted as innate | **Yes** | `WorldExploration.tsx` 2395–2400; `spellData.ts` 27–28 |
| `shouldIncludeBackendSpellInLibrary` is not discovery | **Yes** | `adminSafety.ts` 711–718: `usableByPlayer !== false` → include |
| `combinedMechanic` unused | **Yes** | `useBossRush.ts` 17–19 / 23–134; no WX/engine reader |
| Blood HUD gone | **Yes** | No `bloodBalance` / `BLOOD` in WX or `GameFlow.tsx`. Canister field remains (`main.mo` 137) |
| Covenant buff write-only | **Yes** | `covenantBuffMapsRef` write WX 11330; no combat reader |
| Slime Flood ≡ Frozen Terrain | **Yes** | `mapModifiers.ts` 155–172, both `onMpCost * 2` |
| Gravity Well / Fog of War empty | **Yes** | Registry 280–296; WX `_isGravityWell` / `_isFogOfWar` 2324–2326 unused |
| Titan’s Vigor +1000 HP, 1–5× dmg | **Yes** | `mapModifiers.ts` 300–316 |
| Admin bosses still name `fireball` / `blood_nova` | **Yes** | `admin.mo` 358–379 |
| Random legendary challenge every fight | **Yes** | WX 12210–12213; `challengeCompletion.ts` 88–93 |
| Buff shop vs canister catalog drift | **Yes** | `BuffShop.tsx` 31–79 vs `main.mo` 2772–2779 |
| Kits NaN-stuck at zone 0 | **Yes** | `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` WX 11920; `Math.floor(object)` is `NaN` → zone 0 |
| Paper Windstorm two live rates | **Yes** | Player 30% any-hit WX 9563–9572; enemy 50% if `range > 1` WX 16491, 16729 |
| FAIL 20% then Windstorm | **Yes** | `spellEngine.ts` 641–651 then 909–914 |
| Summon book 10× vs canister 1× | **Yes** | `SpellbookModal.tsx` 439–447; `SUMMON_UPGRADE_COST_MULTIPLIER` 10 |
| Challenge HUD visible after accept | **Yes** | `shouldShowChallengeHud` (`challengeHudVisibility.ts` 15–23). Wrapper still `zIndex: 1200` + `onMouseDown` (`ChallengePanel.tsx` 195–210). **#364 still open** |
| Crush / Fire Bolt fallback | **Yes** | WX 16710–16715 |
| Silent victory ×1.5 | **Yes** | WX `boostMode` stuck `"xp"` (2098, 12374–12377) |
| HP pots lose to 1:3 Doka-heal | **Yes** | `itemShop.ts` 216–222; `BuffShop.tsx` 31–47 |
| Idle +1 HP / 10s | **Yes** | WX 3617–3626 |
| GameKey on world HUD | **Yes** | WX 17786–17813 → `DokaGameKeyShop` 19161–19169 |
| EnemyRegister on world HUD | **Yes** | WX 17845–17857; `FLAVOR LORE` chip |
| `worldFeatures.ts` unwired | **Yes** | `pickWeightedFeatures` callers: tests only |
| Family HP wiped at battle start | **Yes** | `calcEnemyMaxHp(e.level)` WX 11969–11997. Owned by **PREREQ-H** — not re-filed |

What **this run names** (live on this SHA, missing from prior PXA ledgers):

1. **Board ranks a ladder the official client does not play.** Realm-tool **Board** (`GameFlow.tsx` 317–326) opens a table of Level / Kills / Achievements (`596`). Sort is highest **level** (`main.mo` 3428–3432). Empty copy says “defeat some enemies” (`576`). Official combat never calls `saveKillCount` (`useSaveKillCount` has no component importer). Achievements counted are **claimed** feats (`3414–3417`), including chore and RNG rows.
2. **Betrayal is a 5% fight rewrite.** `aiTier >= 10` and `Math.random() < 0.05` (`WX` 15594–15598) can kill an ally and grant the betrayer **6× HP and 6× damage** (15625–15653). `computeAITier` still has a 30% full-random 1–10 (`combatMath.ts` 48–50), so the gate is not a late-game read. No Register / Map Effects sentence. Feats `betrayal_witness` / `double_betrayal` stay spectator (PXA-009).
3. **One overworld map teaches too many doors.** Same generate pass: 15% solo boss (`WX` 4884–4911), 10% Rest (`4916–4934`), 8% Boss Rush (`4939–4959`), plus region / dungeon colors. Rest Area then offers **three** exits — roam / dungeon / boss (`5483–5510`) — with no unique recover rule except silent idle regen (09-23-003).

Also noted, not re-filed: family HP paper vs `calcEnemyMaxHp` stays **PREREQ-H**; Iron Curse / Overflow copy stays `PXA-2026-09-01-002`; hidden 0.5% jackpot heal stays `PXA-2026-08-31-009`. GameFlow character-select title “Paper Baby Vampires” (`438`) vs repo **Stralt** stays under `PXA-2026-08-31-012`.

---

## Verdict

The **core identity is still sound**: AP spends actions, MP spends movement, explicit `SpellConfig` targeting, one Doka wallet, persist-locked `applyRewards` + root recap, percentage death, honest solo boss kits, five distinct summons **plus player control**, signature spells (Swap, Mark, Barrier, Mirror, Timestep, Sacrifice).

The game still does **not** play as one loop. The same three fractures dominate:

1. **Discovery is not a system.** The book is gifted. A helper named like a gate does not gate.
2. **Rules on the box are not rules in the engine.** Register, rush pairs, several map events, Windstorm’s two rates, FAIL stacking, Iron Curse / Overflow copy — and now an untaught 6× betrayal.
3. **Most secondary rewards are flat** on an unbounded `2^(N-1)` curve — and the social ladder ranks level + dead kills + claimed feats.

**New this run:** (a) Board is a third progression poster that does not measure a fight; (b) betrayal can silently replace the encounter; (c) portal verbs on one map exceed a learnable set.

Until PXA-001 / 003 / 007 / 008 / 013, 09-01-001/002, 09-02-001/003, 09-21-001/002, 09-22-001, 09-23-001, and the three new IDs are designed, adding Wave-6 tiles, more families, or more portal colors will make the identity *less* readable.

---

## Classification (all reviewed systems)

| System | Class | One-line why |
| :--- | :--- | :--- |
| **Combat AP/MP split** | KEEP | AP = actions, MP = movement; book `mpCost` is ~0. The Dofus-like decision. |
| **Explicit spell targeting metadata** | KEEP | `targetType` / range / LoS — not name heuristics. Protect this. |
| **Atomic reward funnel + root recap** | KEEP | `applyRewards` / `saveBattleStats` + `PostBattleRecap` at app root. |
| **Death 20% XP / 40% Doka + Death Realm** | KEEP | Percentage cost stays meaningful with no cap. 1.5s guards are a real rule. |
| **Solo boss kits + `BossAbility` tags** | KEEP | Unique phase kits; real specials. Boss Guide is closer to truth than EnemyRegister. |
| **Enemy / summon AI engine** | KEEP | Archetypes, lethal lookahead, LoS step, backline guard. Do not add toggles. |
| **Summon five-pack + player control panel** | KEEP | Hunter / guardian / archer / bomber / healer are distinct; the panel is the mastery surface. |
| **Signature spells** | KEEP | Swap, Mark, Barrier, Mirror, Timestep, Sacrifice each ask a question the clones do not. |
| **JUICE** | KEEP | Shake / hitstop / numbers. Presentation only. |
| **Admin UI gated + backend `#admin`** | KEEP | Must stay off the player HUD. |
| **Accepted-challenge HUD visibility** | KEEP | `shouldShowChallengeHud`. Do not hide again to fix click-steal (#364 / 09-22-003). |
| **Physical Strike skipping FAIL** | KEEP | If FAIL remains the **only** miss language. |
| **30s turn timer (Dofus shot clock)** | KEEP | Time pressure on AP/MP. Time Warp is a variant of this rule, not a new genre. |
| **Attack Nearest** | KEEP | Same selected spell + live targeting metadata. Not a second damage table. |
| **GameKey / Mollie IAP** | KEEP off-loop; SIMPLIFY chrome | Real-money faucet. Not a tactic. Must not read as a third currency. |
| **In-battle buff items (elixir / boots / charm / fury)** | KEEP if distinct | Timing consumables. Do not clone Enrage / Haste / Shield for the rest of the fight. |
| **Ember / Tide / Void family melee hooks** | MERGE into kits | Real but name-heuristic (`family === "ember_knight"`). Fold into explicit kit metadata. |
| **Spell catalog (full `starterSpells`)** | MERGE | Shield ≡ Iron Skin; Poison ≡ Venom; two heals+CHC; Expose ≡ Shadow Veil; three drains. |
| **Health potions vs Doka-to-HP** | MERGE | Sidebar 1:3 strictly dominates 50/120 Doka pots. 09-23-002. |
| **Crush / Fire Bolt fallback** | MERGE into Strike | Fake ids. Owned by 09-21-003. |
| **World Dynamics + Wave-3/4/5/6 catalogs** | MERGE or hold | Unwired. Designed to stack on the 22. 09-21-002. Do not ship Rune Bearer first. |
| **Rest Area + dungeon + rush + solo boss doors** | MERGE / SIMPLIFY | Too many portal verbs. New: PXA-2026-09-24-003. |
| **Enemy identity (piece + family + aiTier + Register lore)** | SIMPLIFY | Four posters for one unit. Live kit is always zone 0. PXA-007 still owns the pick. |
| **Achievements / Feats** | SIMPLIFY | Mastery mixed with chores and RNG. Button **Feats**; `title` / `aria-label` Achievements. |
| **Leaderboard (Board)** | SIMPLIFY or DEPRECATE from combat chrome | Ranks level + unused kills + claimed feats. New: PXA-2026-09-24-001. |
| **Buff shop + GameKey + leftover packages** | SIMPLIFY | GameFlow **Items** vs WX **Buy Doka**. Catalog still disagrees. 15 SKUs still seeded. |
| **HUD chrome** | SIMPLIFY | Two carts, Enemies-as-lore + Bosses + Board, FAIL row, leftover-XP bar. |
| **Terminology** | SIMPLIFY | Feats vs Achievements; GameKey vs Doka; Blood Moon vs Blood Mend; SR vs RES vs resilience; Stralt vs “Paper Baby Vampires.” |
| **FAIL vs Windstorm** | SIMPLIFY to one miss | 09-22-001. Dual Windstorm rates remain 09-02-003. |
| **HUD Blood bar** | DEPRECATE leftover field | Chrome is gone. Keep canister inert. Do not invent a spend. |
| **`resilience` / `evasion` on persist** | DEPRECATE or EXPAND | Required on `CharacterStats`; unused in combat math. |
| **`covenantBuff` / shrine 3-map write** | DEPRECATE or EXPAND | Shrine pays 300 Doka. The buff is still write-only. |
| **Canister `defaultShopPackages` 15 SKUs** | DEPRECATE from player truth | GameKey replaced the picker. |
| **Battle Boost UI** | DEPRECATE control; bake or expose the 1.5 | Dead `BoostToggle`; live ×1.5 XP. 09-23-001. |
| **Idle +1 HP / 10s regen** | DEPRECATE or Rest-only | Silent wait. 09-23-003. |
| **Gravity / Fog until implemented** | DEPRECATE from the roll | Announce without a hook. |
| **Betrayal 6× enrage** | REWORK or DEPRECATE | Untaught 5% rewrite. New: PXA-2026-09-24-002. |
| **Spell discovery** | REWORK | Innate 32-id book. No observe → win → unlock. |
| **Battle challenges** | REWORK offer | Random pick among 9, including legendary 1000 XP, every fight. HUD visibility KEEP. |
| **Boss-rush combined mechanics** | REWORK | Copy-only. Not shown in WX, not executed. |
| **Admin-enabled catalogs** | REWORK | Live book, `bossKits.ts`, `admin.mo` seeds are three truths. |
| **Map modifiers / world events** | SIMPLIFY + MERGE | 22 entries. Twins, placeholders, Titan lottery. Windstorm two numbers. |
| **EnemyRegister / family lore** | REWORK copy; SIMPLIFY placement | World-HUD **Enemies** still opens flavor (09-21-001). |
| **Dungeon chain** | EXPAND | Reward skin on the overworld. Needs a rule free roam does not have. |
| **Progression / rewards (flat + linear-vs-exp + silent 1.5)** | EXPAND grants | Curve unbounded; grants are not. Do not add a cap. |
| **Kits after zone 2** | EXPAND after adapter | Blocked on EBA-013. |

---

## System notes (evidence)

### Enemies — SIMPLIFY poster; REWORK the register

Overworld packs are still **chess pieces**. `buildEnemyKit` (`enemyAI.ts` 163–199) would grow at zone 1 / 2 **if** it received a number. Battle start still calls `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) where `levelZone` is `{ name, minLevel, maxLevel }`. Live kits are zone 0. Comment at 11915 still says “10 random spells.” **Progressive sophistication is designed and dead.** Do not re-file the NaN adapter (EBA-013). Do not expand the kit table (PXA-013) until the call site passes a number.

Family overlay still paints paper HP that battle start throws away (`calcEnemyMaxHp`). That honesty bug stays **PREREQ-H**. Ember / Tide / Void melee hooks vs Register lore stay `PXA-2026-09-01-001`. Placement of the world-HUD **Enemies** button stays `PXA-2026-09-21-001`.

Highest-level unit still gets a crown label (`WX` 8107–8110). Killing it still flips erratic (`15509–15522`). That is a real rule with almost no card. Betrayal can also crown-kill and then **6×** the killer — new ID 002.

### AI — KEEP (kits: EXPAND after adapter; random tier: already filed; betrayal 6×: new)

`decideEnemyAction` is still the best expression of identity. `computeAITier` 30% noise remains owned. Melee fallback Crush / Fire Bolt remains 09-21-003. Do not rewrite `enemyAI.ts` to add verbs. Do not treat 6× betrayal as “more sophistication.”

### Spells — MERGE clones, KEEP signatures

`starterSpells` is still the 32-id book including Strike. Clone pairs from 08-31 still stand. Almost every spell has `mpCost: 0`. **Keep that.** Attack Nearest uses the selected spell and live range/LoS (`WX` 17218–17284). **Keep that.**

### Spell discovery — REWORK (unchanged class)

```2395:2400:src/frontend/src/components/WorldExploration.tsx
  // Base spells = the always-owned innate spells (ALL starter spells + physical attack)
  // Every spell in starterSpells is a base/innate spell — always shown, never removable.
  const baseSpells = useMemo(() => {
    const base = starterSpells.map((s) => ({
      ...s,
      isBaseSpell: true as const,
```

`shouldIncludeBackendSpellInLibrary` only hides `usableByPlayer === false`. Recap still cannot grant a spell. Do not ship Rune Bearer attune as a substitute.

### Achievements (Feats) — SIMPLIFY

Same 15 seeds. Button **Feats**; `title` Achievements. Flat Doka 50–1000. Spectator feats still fire from world RNG. The **Board** now treats claimed feats as a ladder column — that is a new identity leak (001), not a reason to re-file the feat list.

### Challenges — REWORK offer; KEEP HUD visibility

Same 9 contracts. Same random offer. `shouldShowChallengeHud` keeps an accepted contract. Prefer landing **#364**. Do not hide the HUD. Offer-shaping remains PXA-009.

### Bosses — KEEP kits; REWORK rush pairs; SIMPLIFY doors

19 frontend ids + `bossKits.ts` still honest. `combinedMechanic` still only in `useBossRush.ts`. Room rewards still flat. Solo boss, Rest-hub boss exit, and Rush portal are **three doors** into “boss” (003).

### Dungeons — EXPAND identity; SIMPLIFY doors

Chain is still depth + Doka multiplier + white portal. Same generator, AI, modifiers as free roam (PXA-010). Rest Area’s dungeon exit is a second “enter dungeon” verb beside overworld dungeon portals (003).

### World events — SIMPLIFY + MERGE; announce must match

22 registry entries. Honesty table unchanged from 09-23 (Windstorm two rates, Blood Moon flavor, Gravity/Fog empty, Frozen ≡ Slime, Titan lottery, Overflow/Iron Curse copy drift). PXA-2026-09-01-002 still owns announce-vs-engine. Dual Windstorm rates remain 09-02-003. FAIL × Windstorm remains 09-22-001.

Time Warp (15s vs 30s) is a **variant of the existing shot clock**, not a real-time genre break. KEEP the clock; do not add a second timer language.

### World Dynamics catalog — MERGE or hold

`worldFeatures.ts` still test-only on this SHA. 09-21-002 already forbids overlay.

### Progression — EXPAND grants; KEEP no-cap; do not flatten death

`xpForNextLevel` = `100 * 2^(N-1)`. Victory XP = `sum(enemy.level * 20)` then **×1.5** (09-23-001). Boss `1.08^diff` still scales. Spell upgrade `10 * 2^level` still grows. Board sort-by-level does **not** create a cap; it just ranks a number the mid-teens wall already flattens (LHIPS-001). Do not add a cap to “fix” the Board.

### Shops — SIMPLIFY

Unchanged from 09-23: Items vs Buy Doka, HP pots lose to 1:3, catalog drift, 15 unused SKUs, GameKey ritual, rename 100, spell upgrade as the real sink (book still lies 10× on summons).

### Death — KEEP

20/40 + Realm + guards. Do not flatten. Idle regen after Realm stays 09-23-003.

### Rewards — REWORK the menu, KEEP the pipe

Same faucets. Recap should remain one threat-scaled combat grant plus optional named challenge/feat lines. Board must not invent a second “what this fight was for.”

### Visual feedback — KEEP juice; SIMPLIFY chrome

JUICE stays. Blood bar is gone. Simultaneous languages: challenge panel, Map Effects, initiative, spell bar, SummonControlPanel, orbs, Feats, Items, Buy Doka, Bosses, Enemies, **Board**, FAIL row, chat, debug. Two carts, two bestiaries, and a ladder that does not measure the fight are leftover overload.

### Admin-enabled content — REWORK

CRUD still public-read. Default bosses still retired ids. Announce can still schedule a rule the engine does not run. Wave-6 catalogs must not land in spawn/`starterSpells` (09-21-002).

---

## What already fits (do not “fix”)

- AP for spells / MP for walk.
- Eight-slot bar as a **commitment** (once the book is earned).
- Summon archetypes, lifespan-on-own-turn, and the control panel.
- Persist lock + recap at root.
- Death Realm as a place.
- Boss phase 2 as kit + ability escalation.
- No level cap + percentage death + compounding boss level-diff.
- Ember burn / Tide slow / Void 25% reflect — *if* they become explicit kit lines the Register repeats.
- Blood gone from the HUD.
- Accepted challenge HUD **visibility**.
- Strike skipping FAIL **if** FAIL is the only miss.
- 30s shot clock + Attack Nearest as QoL on the **same** spell rules.

---

## Recommended sequence (human, not this automation)

1. **Honesty of rules the player can read today** — Register, modifier announce, Windstorm single rate, FAIL one miss, rush pair copy, Iron Curse / Overflow sentences, betrayal telegraph or removal. (09-01-001, 09-01-002, 09-02-003, 09-22-001, PXA-003, PXA-2026-09-24-002)
2. **Name the live grant.** Bake or expose the ×1.5; delete the dead Boost control. (09-23-001) then threat-scale victory XP (PXA-004, LHIPS-001).
3. **One overworld HP language.** Drop idle regen or confine it to Rest. Stop selling HP pots that lose to 1:3. (09-23-003, 09-23-002, PXA-011)
4. **Learnable doors.** Slim portal verbs; Rest is a hub or a recover room, not both unnamed. (PXA-2026-09-24-003, PXA-010)
5. **Keep accepted challenge HUD; land #364 for click-through.** Then reshape the offer (PXA-009).
6. **Discovery contract** — innate 2–4, find the rest. Do not ship Rune Bearer or Wave-6 first. (PXA-001, 09-01-003, 09-21-002)
7. **NaN kit adapter, then one enemy poster + kits past zone 2.** (EBA-013, PXA-007, PXA-013)
8. **HUD / shop / words.** GameKey off the tactical bar; Enemies off the leftover-XP row; Board off the realm row or honest about what it ranks. (09-02-001, 09-21-001, PXA-2026-09-24-001, PXA-011, PXA-012)

Do not implement these from this file unless a human or the Report Action Orchestrator picks an ID and it is still unique versus open PRs.

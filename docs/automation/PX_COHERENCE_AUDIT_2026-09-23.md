# Player Experience Coherence Audit — 2026-09-23

**Auditor:** Player Experience Coherence Auditor  
**Automation:** `30118f7c-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */48 * * *`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior audits on this SHA:** [`PX_COHERENCE_AUDIT_2026-09-22.md`](./PX_COHERENCE_AUDIT_2026-09-22.md) in open PR [#393](https://github.com/Mr-Melic/stralt/pull/393); [`PX_COHERENCE_AUDIT_2026-09-21.md`](./PX_COHERENCE_AUDIT_2026-09-21.md) in open PR [#343](https://github.com/Mr-Melic/stralt/pull/343). Merged priors: [`PX_COHERENCE_AUDIT_2026-09-02.md`](./PX_COHERENCE_AUDIT_2026-09-02.md) at `58302bc`.  
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

**Do not re-file** `PXA-2026-08-31-001` … `015` (006 HUD hide done), `PXA-2026-09-01-001` … `003`, `PXA-2026-09-02-001` / `003` (002 HUD done), `PXA-2026-09-21-001` … `003`, or `PXA-2026-09-22-001` … `003`.  
New records: [`ACTION_IDS_PXA_2026-09-23.md`](./ACTION_IDS_PXA_2026-09-23.md) (`PXA-2026-09-23-001` … `003`).

Sibling IDs already own: kit-zone NaN (`EBA-013` / SDE / PREREQ-A), `computeAITier` 30% noise, unbounded summoner chance, spawn `floor(999 / tierSize)`, LHIPS XP-wall / victory-grant shape, FAIL × Windstorm (09-22-001), summon 10× tag (09-22-002), challenge HUD click-steal (09-22-003 / [#364](https://github.com/Mr-Melic/stralt/pull/364)). This run does not twin those. PX still agrees: **scale combat grants; do not add a level cap.**

Wave-3 through Wave-6 design catalogs (formations, spell proposals, boss sheets, SDE, Expansion, Tide-File-Clock, world-dynamics overlays including unmerged [#454](https://github.com/Mr-Melic/stralt/pull/454) Wave-6) remain a **hold** under `PXA-2026-09-21-002`. Do not treat those PRs as live systems.

---

## Delta since 2026-09-22

`origin/main` has **not moved** since the 09-21 and 09-22 audits (`0f5363f`). Integrity / parity / map PRs `#374` … `#472` are still open; they are not this SHA. The **pipe** on main is unchanged. The **loop** is unchanged. This run is a new read of the same bytes: three player-facing languages that earlier PX ledgers never named.

| Claim from 09-22 | Still true? | Updated evidence |
| :--- | :--- | :--- |
| Full `starterSpells` gifted as innate | **Yes** | `WorldExploration.tsx` 2395–2400; `spellData.ts` 27–28 |
| `shouldIncludeBackendSpellInLibrary` is not discovery | **Yes** | `adminSafety.ts` 711–718: `usableByPlayer !== false` → include |
| `combinedMechanic` unused | **Yes** | `useBossRush.ts` 17–19 / 23–134; no WX/engine reader |
| Blood HUD gone | **Yes** | No `bloodBalance` / `BLOOD` in `WorldExploration.tsx` or `GameFlow.tsx`. Canister `bloodBalance` remains (`main.mo` 137) |
| Covenant buff write-only | **Yes** | `covenantBuffMapsRef` write WX 11330; no combat reader |
| Slime Flood ≡ Frozen Terrain | **Yes** | `mapModifiers.ts` 155–172, both `onMpCost * 2` |
| Gravity Well / Fog of War empty | **Yes** | Registry 280–296; WX `_isGravityWell` / `_isFogOfWar` 2324–2326 unused |
| Titan’s Vigor +1000 HP, 1–5× dmg | **Yes** | `mapModifiers.ts` 300–316 |
| Admin bosses still name `fireball` / `blood_nova` | **Yes** | `admin.mo` 358–379 |
| Random legendary challenge every fight | **Yes** | WX 12210–12213; `challengeCompletion.ts` 88–93 |
| Buff shop vs canister catalog drift | **Yes** | `BuffShop.tsx` 31–79 vs `main.mo` 2772–2779 |
| Kits NaN-stuck at zone 0 | **Yes** | `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` WX 11920; `Math.floor(object)` is `NaN` → zone 0 |
| Paper Windstorm two live rates | **Yes** | Player 30% any-hit WX 9563–9572; enemy 50% if `range > 1` WX 16491, 16729 |
| FAIL 20% then Windstorm | **Yes** | `spellEngine.ts` 641–651 then 909–914; HUD FAIL row WX 18559–18563 |
| Summon book 10× vs canister 1× | **Yes** | `SpellbookModal.tsx` 439–447; `SUMMON_UPGRADE_COST_MULTIPLIER` 10 |
| Challenge HUD visible after accept | **Yes** | `shouldShowChallengeHud` (`challengeHudVisibility.ts` 15–23). Wrapper still `zIndex: 1200` + `onMouseDown` (`ChallengePanel.tsx` 195–210). **#364 still open** |
| Crush / Fire Bolt fallback | **Yes** | WX 16710–16715 |
| GameKey on world HUD | **Yes** | WX 17786–17813 → `DokaGameKeyShop` 19161–19169; 15 `defaultShopPackages` still seeded (`admin.mo` 265–282) |
| EnemyRegister on world HUD | **Yes** | WX 17845–17857; `FLAVOR LORE` chip (`enemyRegisterCopy.ts` 6–12) |
| `worldFeatures.ts` unwired | **Yes** | `pickWeightedFeatures` callers: tests only |

What **this run names** (live on this SHA, missing from prior PXA ledgers):

1. **Victory XP is always ×1.5.** `BoostToggle` is never mounted. App’s `boostMode` dies in GameFlow (`_boostMode`). WX `_setBoostMode` is unused, so `boostMode === "xp"` forever (`WorldExploration.tsx` 2098, 12374–12377). Recap does not say “boost.”
2. **Health potions are a worse Doka-to-HP.** Sidebar heal is 1 Doka → 3 HP (`itemShop.ts` 216–222; WX 18371–18505). `health_potion` is 50 Doka for 30% max HP; `greater_health_potion` is 120 for 70% (`BuffShop.tsx` 31–47). At 100 max HP that is 10 vs 50 and ~24 vs 120.
3. **Out-of-combat HP ticks for free.** `setInterval` +1 HP / 10s while `!inBattleRef` (`WorldExploration.tsx` 3617–3626). No chrome. Waiting is not a tactic.

Also noted, not re-filed: Iron Curse announces “healing halved” (`mapModifiers.ts` 381) while `MAP_MODIFIER_IRON_CURSE_HEALING_MULTIPLIER` is unused outside `gameConstants.ts`; Arcane Overflow’s “spells fizzle 10% more” only vetoes `applyActiveEffect` (WX 1874–1886), not damage casts. Both stay under `PXA-2026-09-01-002`. Hidden 0.5% jackpot heal (`WX` 18416; feat `jackpot_heal`) stays under `PXA-2026-08-31-009`.

---

## Verdict

The **core identity is still sound**: AP spends actions, MP spends movement, explicit `SpellConfig` targeting, one Doka wallet, persist-locked `applyRewards` + root recap, percentage death, honest solo boss kits, five distinct summons **plus player control**, signature spells (Swap, Mark, Barrier, Mirror, Timestep, Sacrifice).

The game still does **not** play as one loop. The same three fractures dominate:

1. **Discovery is not a system.** The book is gifted. A helper named like a gate does not gate.
2. **Rules on the box are not rules in the engine.** Register, rush pairs, several map events, Windstorm’s two rates, FAIL stacking, Iron Curse / Overflow copy.
3. **Most secondary rewards are flat** on an unbounded `2^(N-1)` curve — and the **primary** victory XP is a silent ×1.5 with no Boost UI.

**New this run:** (a) Battle Boost is a live multiplier with a dead control; (b) Items HP pots lose to the sidebar 1:3 button; (c) idle +1 HP/10s makes “recover between fights” a wait, not a spend.

Until PXA-001 / 003 / 007 / 008 / 013, 09-01-001/002, 09-02-001/003, 09-21-001/002, 09-22-001, and the three new IDs are designed, adding Wave-6 tiles, more families, or more admin SKUs will make the identity *less* readable.

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
| **GameKey / Mollie IAP** | KEEP off-loop; SIMPLIFY chrome | Real-money faucet. Not a tactic. Must not read as a third currency. |
| **In-battle buff items (elixir / boots / charm / fury)** | KEEP if distinct | Timing consumables. Do not clone Enrage / Haste / Shield for the rest of the fight. |
| **Ember / Tide / Void family melee hooks** | MERGE into kits | Real but name-heuristic (`family === "ember_knight"`). Fold into explicit kit metadata. |
| **Spell catalog (full `starterSpells`)** | MERGE | Shield ≡ Iron Skin; Poison ≡ Venom; two heals+CHC; Expose ≡ Shadow Veil; three drains. |
| **Health potions vs Doka-to-HP** | MERGE | Sidebar 1:3 strictly dominates 50/120 Doka pots. New: PXA-2026-09-23-002. |
| **Crush / Fire Bolt fallback** | MERGE into Strike | Fake ids. Owned by 09-21-003. |
| **World Dynamics + Wave-3/4/5/6 catalogs** | MERGE or hold | Unwired. Designed to stack on the 22. 09-21-002. Do not ship Rune Bearer first. |
| **Enemy identity (piece + family + aiTier + Register lore)** | SIMPLIFY | Four posters for one unit. Live kit is always zone 0. PXA-007 still owns the pick. |
| **Achievements / Feats** | SIMPLIFY | Mastery mixed with chores and RNG. Button **Feats**; `title` / `aria-label` Achievements (`GameFlow.tsx` 330–335; `AchievementsPanel.tsx` 216–233). |
| **Buff shop + GameKey + leftover packages** | SIMPLIFY | GameFlow **Items** vs WX **Buy Doka**. Catalog still disagrees. 15 SKUs still seeded. |
| **HUD chrome** | SIMPLIFY | Two carts, Enemies-as-lore + Bosses, FAIL row, leftover-XP bar. |
| **Terminology** | SIMPLIFY | Feats vs Achievements; GameKey vs Doka; Blood Moon vs Blood Mend; SR vs RES vs resilience. |
| **FAIL vs Windstorm** | SIMPLIFY to one miss | 09-22-001. Dual Windstorm rates remain 09-02-003. |
| **HUD Blood bar** | DEPRECATE leftover field | Chrome is gone. Keep canister inert. Do not invent a spend. |
| **`resilience` / `evasion` on persist** | DEPRECATE or EXPAND | Required on `CharacterStats`; unused in combat math. Register claims “evasion passive.” |
| **`covenantBuff` / shrine 3-map write** | DEPRECATE or EXPAND | Shrine pays 300 Doka. The buff is still write-only. |
| **Canister `defaultShopPackages` 15 SKUs** | DEPRECATE from player truth | GameKey replaced the picker. |
| **Battle Boost UI** | DEPRECATE control; bake or expose the 1.5 | Dead `BoostToggle`; live ×1.5 XP. New: PXA-2026-09-23-001. |
| **Idle +1 HP / 10s regen** | DEPRECATE or Rest-only | Silent wait. New: PXA-2026-09-23-003. |
| **Gravity / Fog until implemented** | DEPRECATE from the roll | Announce without a hook. |
| **Spell discovery** | REWORK | Innate 32-id book. No observe → win → unlock. |
| **Battle challenges** | REWORK offer | Random pick among 9, including legendary 1000 XP, every fight. HUD visibility KEEP. |
| **Boss-rush combined mechanics** | REWORK | Copy-only. Not shown in WX, not executed. |
| **Admin-enabled catalogs** | REWORK | Live book, `bossKits.ts`, `admin.mo` seeds are three truths. |
| **Map modifiers / world events** | SIMPLIFY + MERGE | 22 entries. Twins, placeholders, Titan lottery. Windstorm two numbers. Overflow/Iron Curse copy drift. |
| **EnemyRegister / family lore** | REWORK copy; SIMPLIFY placement | World-HUD **Enemies** still opens flavor (09-21-001). |
| **Dungeon chain** | EXPAND | Reward skin on the overworld. Needs a rule free roam does not have. |
| **Progression / rewards (flat + linear-vs-exp + silent 1.5)** | EXPAND grants | Curve unbounded; grants are not. Do not add a cap. |
| **Kits after zone 2** | EXPAND after adapter | Blocked on EBA-013. |

---

## System notes (evidence)

### Enemies — SIMPLIFY poster; REWORK the register

Overworld packs are still **chess pieces**. `buildEnemyKit` (`enemyAI.ts` 163–199) would grow at zone 1 / 2 **if** it received a number. Battle start still calls `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) where `levelZone` is `{ name, minLevel, maxLevel }` (4683+). Live kits are zone 0. Comment at 11915 still says “10 random spells.” **Progressive sophistication is designed and dead.** Do not re-file the NaN adapter (EBA-013). Do not expand the kit table (PXA-013) until the call site passes a number.

The **30% family overlay** (`applyFamilyVariantsToRoster`, `spawnPolicy.ts` 34–57, WX 5862–5866) still paints HP/dmg/RES and pixels. Seven families roll; three apply **name-heuristic** melee extras:

| Family | Engine actually does | EnemyRegister teaches (`EnemyRegister.tsx`) |
| :--- | :--- | :--- |
| Ember Knight | 3 DoT / 3 turns on melee (WX 16789–16803) | Burning **tiles**, AoE fire, weak to ice |
| Tide Shade | −1 MP / 2 turns on melee (16805–16820) | Adjacent slow, **HP regen**, weak to lightning |
| Void Mirror | 25% of pre-mitigation dmg reflected (`castHelpers.ts` 336–344) | Copies spells; **immune to magic until physical** |
| Wraith / Golem / Rat / Scribe | Stat mults + pixels only | Wall-phase, poison stacks, stagger, Weakened |
| Crimson Spawn / Shadow Lurker / Storm Caller | **Not in `FAMILY_TYPES`** | Lifesteal, **evasion**, earth-weak, storm clouds |

`EnemyRegister` is still a world-HUD button (`WorldExploration.tsx` 17845–17857) behind a **FLAVOR LORE** chip (`enemyRegisterCopy.ts` 6–12). Archbishop tip (96): “invulnerable while any pawn lives” is unused rush-pair copy. GameFlow **Bosses** (`GameFlow.tsx` 337–346) opens a second bestiary that is closer to `BossAbility`. Two guides, one of them false. Placement remains `PXA-2026-09-21-001`. Copy remains `PXA-2026-09-01-001`.

**Keep** piece kits + the three real family hooks (as metadata, not `family ===` strings).  
**Do not** teach elemental types the combat math does not have.  
**Do not** implement EBA-024 until the card matches the engine.

### AI — KEEP (kits: EXPAND after adapter; random tier: already filed)

`decideEnemyAction` is still the best expression of identity. `computeAITier` still has a 30% full-random 1–10 (`combatMath.ts` 34–51). Melee fallback still invents Crush / Fire Bolt (WX 16710–16715) — 09-21-003. PX: do not rewrite `enemyAI.ts` to add verbs; teach the existing ones through kits **after** the NaN call site is fixed.

### Spells — MERGE clones, KEEP signatures

`starterSpells` is still the 32-id book including Strike (`spellData.ts` 9–28). Clone pairs from 08-31 still stand. `spellType: "damage"` on Shield (40) still leaks into admin. Almost every spell has `mpCost: 0`. **Keep that.**

### Spell discovery — REWORK (unchanged class)

```2395:2400:src/frontend/src/components/WorldExploration.tsx
  // Base spells = the always-owned innate spells (ALL starter spells + physical attack)
  // Every spell in starterSpells is a base/innate spell — always shown, never removable.
  const baseSpells = useMemo(() => {
    const base = starterSpells.map((s) => ({
      ...s,
      isBaseSpell: true as const,
```

`shouldIncludeBackendSpellInLibrary` only hides `usableByPlayer === false` unless already owned. No `ownedSpellIds` / `observedSpellIds`. Recap still cannot grant a spell. Design docs describe observe→win→unlock. They are not live. Do not ship Rune Bearer attune as a substitute.

### Achievements (Feats) — SIMPLIFY

Same 15 seeds (`admin.mo` 309–325). GameFlow button label is **Feats**; `title` is Achievements (330–335). Panel header Feats, `aria-label` Achievements (216, 233). Flat Doka 50–1000. Spectator feats (betrayal, jackpot) still fire from world RNG.

### Challenges — REWORK offer; KEEP HUD visibility

Same 9 contracts (`challengeCompletion.ts` 44–103). Same random offer (WX 12210–12213). `shouldShowChallengeHud` keeps an accepted contract. Wrapper still steals clicks (`ChallengePanel.tsx` 195–210, `zIndex: 1200`). Prefer landing **#364**. Do not hide the HUD. Offer-shaping remains PXA-009.

### Bosses — KEEP kits; REWORK rush pairs

19 frontend ids + `bossKits.ts` still honest. `combinedMechanic` still only in `useBossRush.ts`. Room rewards still flat.

### Dungeons — EXPAND

Chain is still depth + Doka multiplier + white portal. Same generator, AI, modifiers as free roam. Needs a rule free roam does not have (PXA-010).

### World events — SIMPLIFY + MERGE; announce must match

22 registry entries (`mapModifiers.ts` 155–471). Two-roll trigger. Admin dropdown echoes `announceText` (`listAdminModifierTypeOptions` 506–513). Honesty table (unchanged class, extra rows this run):

| Id | Player / admin is told | Engine does |
| :--- | :--- | :--- |
| Paper Windstorm | “ranged spell reach halved” (251) | Player 30% any-hit (WX 9563). Enemy 50% if `range > 1` (16491). Targeting has **no** half-range |
| Blood Moon | flavor only | +25% non-heal damage (`spellEngine.ts` 895). **No** heal cut |
| Mirror Field | flavor | 20% single-target reflect (`spellEngine.ts` 901–907) |
| Gravity Well / Fog of War | “heavy pull” / “vision is shrouded” | Empty; unused `_isGravityWell` / `_isFogOfWar` |
| Frozen Terrain | MP doubled (honest vs Slime) | MP ×2 only — same as Slime Flood |
| Titan’s Vigor | +1000 HP, 1–5× | Exactly that. Arbitrary at every level |
| Arcane Overflow | “spells fizzle 10% more” (321) | AP −1 (real, duplicates Surge). Fizzle only on `applyActiveEffect` (WX 1874–1886) — Inferno never rolls it |
| Iron Curse | “+30% RES, healing halved” (381) | RES ×1.3 on battle start. Heal ×0.5 constant is **unused** |

PXA-2026-09-01-002 still owns announce-vs-engine. Dual Windstorm rates remain 09-02-003. FAIL × Windstorm remains 09-22-001.

### World Dynamics catalog — MERGE or hold

`worldFeatures.ts` 1–18: design-only through Wave 3 on this SHA. `pickWeightedFeatures` callers: tests only. Wave-4/5/6 live in unmerged sibling PRs; 09-21-002 already forbids overlay. Rune Bearer is still a second discovery language. Do not stack.

### Progression — EXPAND grants; KEEP no-cap; do not flatten death

`xpForNextLevel` = `100 * 2^(N-1)` (`xpCurve.ts` 3–12). Victory XP = `sum(enemy.level * 20)` then **×1.5 if `boostMode === "xp"`** (`rewardResolver.ts` 89–98; WX 12374–12377). Boss `1.08^diff` still scales. Spell upgrade `10 * 2^level` still grows. LHIPS-001 already measured the practical wall. PX: the **combat** grant must stay a noticeable leftover-XP slice at any level — and the player must be able to **read** the 1.5. Express threat-scaled victory XP (PXA-004), not a level cap, not a third currency. New: PXA-2026-09-23-001.

### Shops — SIMPLIFY (potion vs sidebar is new)

| Sink | Where | Role |
| :--- | :--- | :--- |
| Buff items | `BuffShop.tsx`; GameFlow **Items** | Combat shortcuts; `localStorage` inventory |
| HP potions | `health_potion` 50 / `greater_health_potion` 120 | Strictly worse than sidebar 1:3 |
| Canister `BUFF_CATALOG` | `main.mo` 2772–2779 | Different ids/costs; no `purchaseBuff` callers under `components/` |
| Doka-to-HP | WX sidebar 18371–18505 | 1 Doka → 3 HP, overworld only; 0.5% jackpot (`jackpot: Math.random() < 0.005`) |
| Idle regen | WX 3617–3626 | +1 HP / 10s, no chrome |
| GameKey / Mollie | WX cart **Buy Doka** | Email + consent + QR + admin + 120-char redeem |
| Canister `defaultShopPackages` | `admin.mo` 265–282 | 15 SKUs to 1.6M Doka. Player UI does not list them |
| Rename | 100 Doka | Cosmetic |
| Spell upgrade | `upgradeSpell` | The real mastery sink (book still lies 10× on summons — 09-22-002) |

GameKey answers **no** tactical question (09-02-001). Elixir / boots / charm / fury can still be timing decisions. Health potions cannot.

### Death — KEEP

`DEATH_XP_PENALTY_RATE = 0.2`, `DEATH_DOKA_PENALTY_RATE = 0.4`. Realm + guards. Do not flatten. Idle regen after Death Realm is a **recovery wait**, not a death-rule change — owned by 09-23-003, not a death rework.

### Rewards — REWORK the menu, KEEP the pipe

Same faucets. Recap should remain one threat-scaled combat grant plus optional named challenge/feat lines. Silent ×1.5 is a lie on that recap.

### Visual feedback — KEEP juice; SIMPLIFY chrome

JUICE stays. Blood bar is gone. Remaining simultaneous languages: challenge panel, Map Effects, initiative, spell bar, SummonControlPanel, orbs, Feats, Items, Buy Doka, Bosses, Enemies, FAIL row, chat, debug. GameFlow realm-tool row (289–346) plus WX 44px bar. Two carts and two bestiaries are leftover overload. Boost chrome is dead; the multiplier is not.

### Admin-enabled content — REWORK

CRUD still public-read. Default bosses still retired ids. Admin modifier **type** list matches registry ids. Announce text can still schedule a rule the engine does not run. Admin spells without targeting metadata still save (PXA-015). Wave-6 catalogs must not land in spawn/`starterSpells` (09-21-002).

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

---

## Recommended sequence (human, not this automation)

1. **Honesty of rules the player can read today** — Register, modifier announce, Windstorm single rate, FAIL one miss, rush pair copy, Iron Curse / Overflow sentences. (09-01-001, 09-01-002, 09-02-003, 09-22-001, PXA-003)
2. **Name the live grant.** Bake or expose the ×1.5; delete the dead Boost control. (PXA-2026-09-23-001) then threat-scale victory XP (PXA-004, LHIPS-001).
3. **One overworld HP language.** Drop idle regen or confine it to Rest. Stop selling HP pots that lose to 1:3. (PXA-2026-09-23-003, PXA-2026-09-23-002, PXA-011)
4. **Keep accepted challenge HUD; land #364 for click-through.** Then reshape the offer (PXA-009).
5. **Discovery contract** — innate 2–4, find the rest. Do not ship Rune Bearer or Wave-6 first. (PXA-001, 09-01-003, 09-21-002)
6. **NaN kit adapter, then one enemy poster + kits past zone 2.** (EBA-013, PXA-007, PXA-013)
7. **HUD / shop / words.** GameKey off the tactical bar; Enemies off the leftover-XP row; retire unused packages. (09-02-001, 09-21-001, PXA-011, PXA-012)

Do not implement these from this file unless a human or the Report Action Orchestrator picks an ID and it is still unique versus open PRs.

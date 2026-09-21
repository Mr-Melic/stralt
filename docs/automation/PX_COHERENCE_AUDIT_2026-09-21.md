# Player Experience Coherence Audit — 2026-09-21

**Auditor:** Player Experience Coherence Auditor  
**Automation:** `30118f7c-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */48 * * *`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior audit:** [`PX_COHERENCE_AUDIT_2026-09-02.md`](./PX_COHERENCE_AUDIT_2026-09-02.md) at `58302bc`  
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

**Do not re-file** `PXA-2026-08-31-001` … `015`, `PXA-2026-09-01-001` … `003`, or `PXA-2026-09-02-001` … `003`.  
`PXA-2026-09-02-002` is **done** (accepted challenge HUD). `PXA-2026-08-31-006` display half remains **done** (Blood bar gone).  
New records: [`ACTION_IDS_PXA_2026-09-21.md`](./ACTION_IDS_PXA_2026-09-21.md) (`PXA-2026-09-21-001` … `003`).

Sibling IDs already own: kit-zone NaN (`EBA-013` / `SDE` / `PREREQ-A`), `computeAITier` 30% noise, LHIPS XP-wall / victory-grant shape, unbounded summoner chance (`EBMA` / `WDEAD` / `AI-FUT-23`), spawn `floor(999 / tierSize)` (`WDEAD-2026-09-02-001`). This run does not twin those. PX still agrees: **scale combat grants; do not add a level cap.**

Open PRs older than this docs branch (createdAt ascending): **#327** (Striker AoE/bounce), **#331** (portal destack). No overlapping files.

---

## Delta since 2026-09-02

Integrity work continued (Frozen/Slime walk MP on execute and AI, Life Drain vs no-heal, Striker spent-attempt, GameKey how-to + Escape dismiss, one-shot transport-keep, portal destack). The **pipe** is more trustworthy. The **loop** is not.

~158 commits landed after `58302bc`. Most of the identity-named merges (`#276` formations, `#280` AI evolution, `#282` spell proposals, `#293` boss Wave 4, `#300` discovery Wave 3) are **docs-only catalogs**. Live combat still gifts the 32-id book.

| Claim from last audit | Still true? | Updated evidence |
| :--- | :--- | :--- |
| Full `starterSpells` gifted as innate | **Yes** | `WorldExploration.tsx` 2395–2400; `spellData.ts` 27–28 (Strike + 31 starters, five summons) |
| `shouldIncludeBackendSpellInLibrary` is not discovery | **Yes** | `adminSafety.ts` 711–718: `usableByPlayer !== false` → include. Union at WX 2412–2439 |
| `combinedMechanic` unused | **Yes** | Declared in `useBossRush.ts` 19 / populated 31–130; no WX/engine reader |
| Blood HUD never spent | **Bar still gone** | GameFlow 282–290 is a snap spacer. `bloodBalance` still on the character record (`main.mo` 137). Do not re-hide |
| Covenant buff write-only | **Yes** | `covenantBuffMapsRef` init WX 1373–1388; write 11330; no combat reader |
| Slime Flood ≡ Frozen Terrain | **Yes** (honesty improved) | `mapModifiers.ts` 155–172, both `onMpCost * 2`. Enemy/summon walks now pay Frozen (`09acff2`). Same rule, two names |
| Gravity Well / Fog of War empty | **Yes** | Registry 280–296; WX `_isGravityWell` / `_isFogOfWar` 2324–2326 unused |
| Titan’s Vigor +1000 HP, 1–5× dmg | **Yes** | `mapModifiers.ts` 300–316 |
| Admin bosses still name `fireball` / `blood_nova` | **Yes** | `admin.mo` 358–541 |
| Random legendary challenge every fight | **Yes** | WX 12210–12218 |
| Buff shop vs canister catalog drift | **Yes** | `BuffShop.tsx` 31–79 vs `main.mo` 2772–2778 (`greater_health_potion` vs `greater_potion`; elixir 80 vs 200; fury 150 vs 100) |
| Kits stop at `levelZone` 2 | **Still dead at zone 0** | Intended table 0/1/2 (`enemyAI.ts` 163–185). Live call still passes the **object** (`WX` 11920). `Math.floor(object)` is `NaN`. Owned by EBA-013 |
| Paper Windstorm = two live rates | **Yes** | Announce “reach halved” (`mapModifiers.ts` 249–257). Player 30% any hit (WX 9563–9572). Enemy 50% if `range > 1` (16491, 16729). Still PXA-2026-09-02-003 |
| 15 IAP SKUs on the player shop | **Still unused by player UI** | GameKey ritual (`DokaGameKeyShop.tsx`, `iapShopCopy.ts` 6–32). `defaultShopPackages()` 15 SKUs (`admin.mo` 265–282). `useGetShopPackages` has **no** component caller |
| Accepted challenge HUD hides after first action | **Fixed** | `shouldShowChallengeHud` (`challengeHudVisibility.ts` 15–23). WX still passes the accept-window `visible` (19177–19178); the panel keeps an accepted contract. **Do not re-file PXA-2026-09-02-002** |
| EnemyRegister teaches a different game | **Partial** | `#328` labeled it **FLAVOR LORE** (`enemyRegisterCopy.ts` 6–15; panel 322–370). `MONSTERS` 28–88 and Archbishop tip 91–96 still teach wall-phase, elemental types, magic immunity, pawn-invuln. World HUD button still says **Enemies** (WX 17845–17857) |

What **did** change (and why it matters):

1. **Accepted challenges can be seen while they are played.** PXA-2026-09-02-002 is closed. Offer shaping (random legendary every fight, feat overlap) remains PXA-009.
2. **Enemy Register admitted it is not combat.** That is not honesty of rules. It is a disclaimer on a still-false card, still opened from the leftover-XP bar. New ID: PXA-2026-09-21-001.
3. **Buy Doka how-to** (email before QR, four steps, Escape/backdrop) makes the GameKey ritual readable. It does not answer a tactical question. Placement remains PXA-2026-09-02-001.
4. **Design catalogs multiplied** (formations drop 3, AI evolution increment, spell Wave 3, boss Wave 4, discovery Wave 3) without a live discovery path, a live kit band, or a slim event list. New ID: PXA-2026-09-21-002.
5. **Enemy melee fallback still speaks Crush / Fire Bolt** — ids that are not in `starterSpells`, not in `SPELL_ID_CATALOG`, and not a kit. On Windstorm maps, fake Fire Bolt is treated as ranged (`fb.range > 1`) even when the unit is adjacent. New ID: PXA-2026-09-21-003.

---

## Verdict

The **core identity is still sound**: AP spends actions, MP spends movement, explicit `SpellConfig` targeting, one Doka wallet, persist-locked `applyRewards` + root recap, percentage death, honest solo boss kits + `BossAbility`, five distinct summons **plus player control**, signature spells (Swap, Mark, Barrier, Mirror, Timestep, Sacrifice).

The game still does **not** play as one loop. The same three fractures dominate:

1. **Discovery is not a system.** The book is gifted. A helper named like a gate does not gate. Wave-3 discovery docs did not change that.
2. **Rules on the box are not rules in the engine.** Register (now with a lore chip), rush pairs, several map events, Windstorm’s two rates, Crush/Fire Bolt fallback.
3. **Most secondary rewards are flat** on an unbounded `2^(N-1)` curve. Live enemy kits never leave band 0, so “progressive sophistication” is a data table the player cannot meet.

**New this run:** (a) flavor-lore Register still occupies combat chrome; (b) five more design catalogs invite a stack the live loop cannot teach; (c) melee fallback invents a second, uncatalogued spell language.

Until PXA-001 / 003 / 007 / 008 / 013, PXA-2026-09-01-001 / 002 / 003, PXA-2026-09-02-001 / 003, and the three new IDs are designed, **do not implement** formations, SDE Wave 3 ids, boss Wave 4, or World Dynamics overlays.

---

## Classification (all reviewed systems)

| System | Class | One-line why |
| :--- | :--- | :--- |
| **Combat AP/MP split** | KEEP | AP = actions, MP = movement; book `mpCost` is ~0. The Dofus-like decision. |
| **Explicit spell targeting metadata** | KEEP | `targetType` / range / LoS — not name heuristics. Protect this. |
| **Atomic reward funnel + root recap** | KEEP | `applyRewards` / `saveBattleStats` + `PostBattleRecap` at app root. |
| **Death 20% XP / 40% Doka + Death Realm** | KEEP | Percentage cost stays meaningful with no cap. 1.5s guards are a real rule. |
| **Solo boss kits + `BossAbility` tags** | KEEP | Unique phase kits; real specials (shell armor, reflect shield). Boss Guide is closer to truth than EnemyRegister. |
| **Enemy / summon AI engine** | KEEP | Archetypes, lethal lookahead, LoS step, backline guard. Do not add toggles. |
| **Summon five-pack + player control panel** | KEEP | Hunter / guardian / archer / bomber / healer are distinct; the panel is the mastery surface. |
| **Signature spells** | KEEP | Swap, Mark, Barrier, Mirror, Timestep, Sacrifice each ask a question the clones do not. |
| **JUICE** | KEEP | Shake / hitstop / numbers. Presentation only. |
| **Admin UI gated + backend `#admin`** | KEEP | Must stay off the player HUD. |
| **Accepted-challenge HUD** | KEEP | `shouldShowChallengeHud` matches the accept-window comment. |
| **GameKey / Mollie IAP** | KEEP off-loop; SIMPLIFY chrome | Real-money faucet. Not a tactic. Still on the leftover-XP cart. |
| **Ember / Tide / Void family melee hooks** | MERGE into kits | Real but name-heuristic (`family === "ember_knight"`). Fold into explicit kit metadata. |
| **Spell catalog (full `starterSpells`)** | MERGE | Shield ≡ Iron Skin; Poison ≡ Venom; two heals+CHC; Expose ≡ Shadow Veil; three drains. |
| **Enemy Crush / Fire Bolt fallback** | MERGE | Uncatalogued melee verbs. Fire Bolt is ranged-named adjacent damage. |
| **Enemy identity (piece + family + aiTier + Register lore)** | SIMPLIFY | Four posters for one unit. Live kit is always zone 0. PXA-007 still owns the pick. |
| **Achievements / Feats** | SIMPLIFY | Mastery mixed with chores and RNG. Button **Feats**; `title` Achievements (`GameFlow.tsx` 330–335). Recap still “Achievements Unlocked” (`PostBattleRecap.tsx` 541). |
| **Buff shop + GameKey + leftover packages** | SIMPLIFY | GameFlow **Items** vs WX cart **Buy Doka**. Catalog still disagrees. 15 SKUs still seeded. |
| **World-HUD Enemy Register** | SIMPLIFY placement | After #328 it is labeled not-the-game. Combat chrome should not host an admitted lie. |
| **HUD Blood bar** | DEPRECATE leftover field | Chrome is gone. Keep canister inert. Do not invent a spend. |
| **`resilience` / `evasion` on persist** | DEPRECATE or EXPAND | Required on `CharacterStats`; unused in `combatMath.ts`. Register still claims “evasion passive.” |
| **`covenantBuff` / shrine 3-map write** | DEPRECATE or EXPAND | Shrine pays 300 Doka. The buff is still write-only. |
| **Canister `defaultShopPackages` 15 SKUs** | DEPRECATE from player truth | GameKey replaced the picker. Public `getShopPackages` is a second shop language. |
| **Wave-3/4 design catalogs (formations, SDE, boss sheets, spell proposals)** | MERGE or hold | Docs only. Stacking them on the gifted book + 22 modifiers answers none of the four questions. |
| **Spell discovery** | REWORK | Innate 32-id book. No observe → win → unlock. |
| **Battle challenges** | REWORK offer | Random pick among 9, including legendary, every fight. HUD is now KEEP. |
| **Boss-rush combined mechanics** | REWORK | Copy-only. Not shown in WX, not executed. |
| **Admin-enabled catalogs** | REWORK | Live book, `bossKits.ts`, `admin.mo` seeds are three truths. |
| **Map modifiers / world events** | SIMPLIFY + MERGE | 22 entries. Twins, placeholders, Titan lottery. Windstorm still has two live numbers. |
| **World Dynamics catalog (`worldFeatures.ts`)** | MERGE or hold | Unwired. Designed to stack on the 22. Rune Bearer is a second discovery language. |
| **EnemyRegister / family lore** | REWORK copy | Player-facing sentences for a game that is not running, plus a lore chip. |
| **Dungeon chain** | EXPAND | Extra rats + Doka multiplier (`spawnPolicy.ts` `DUNGEON_EXTRA_ENEMIES`). Needs a rule free roam does not have. |
| **Progression / rewards (flat + linear-vs-exp)** | EXPAND | Curve unbounded; grants are not. Do not add a cap. |
| **Terminology** | SIMPLIFY | Feats vs Achievements; GameKey vs Doka; Enemies vs Flavor Lore vs Bosses; SR vs RES vs resilience. |

---

## System notes (evidence)

### Enemies — SIMPLIFY poster; REWORK the register; SIMPLIFY HUD after the lore chip

Overworld packs are still **chess pieces**. `buildEnemyKit` (`enemyAI.ts` 163–199) would grow at zone 1 / 2 **if** it received a number. Battle start still calls `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) where `levelZone` is `{ name, minLevel, maxLevel }` (4683–4687). Comment at 11915 still says “10 random spells.” Live kits are zone 0: pawn Strike only, knight Strike only, bishop Frost only, queen/king Frost only. **Progressive sophistication is designed and dead.** Do not re-file the NaN adapter (EBA-013). Do not expand the kit table (PXA-013) until the call site passes a number.

The **30% family overlay** (`WorldExploration.tsx` 5862–5866 → `applyFamilyVariantsToRoster`) still paints HP/dmg/RES and pixels. Three families still apply **name-heuristic** melee extras:

| Family | Engine actually does | EnemyRegister teaches (`EnemyRegister.tsx`) |
| :--- | :--- | :--- |
| Ember Knight | 3 DoT / 3 turns on melee (16789–16804) | Burning **tiles**, AoE fire, weak to ice (48–52) |
| Tide Shade | −1 MP / 2 turns on melee (16805–16820) | Adjacent slow, **HP regen**, weak to lightning (54–58) |
| Void Mirror | 25% of pre-mitigation dmg reflected (`castHelpers.ts` 336–345) | Copies spells; **immune to magic until physical** (66–70) |
| Wraith / Golem / Rat / Scribe | Stat mults + pixels only (`spawnPolicy.ts` 49–57) | Wall-phase, poison stacks, stagger, Weakened |
| Crimson Spawn / Shadow Lurker / Storm Caller | **Not in the 30% roll** | Lifesteal, **evasion**, earth-weak, storm clouds (71–88) |

`EnemyRegister` is still a world-HUD **Enemies** button (`WorldExploration.tsx` 17845–17857). After `#328` the panel title chip is `FLAVOR LORE` and the banner says “not the live spawn roster” (`enemyRegisterCopy.ts` 6–12; `EnemyRegister.tsx` 322–370). Archbishop tip (91–96): “invulnerable while any pawn lives” is unused rush-pair copy. GameFlow **Bosses** (`GameFlow.tsx` 337–346) opens a second bestiary that is closer to `BossAbility`.

**Keep** piece kits + the three real family hooks (as metadata, not `family ===` strings).  
**Do not** teach elemental types the combat math does not have.  
**Do not** implement EBA-024 until the card matches the engine.  
**Do not** leave an admitted-non-combat book on the leftover-XP bar. New ID: PXA-2026-09-21-001. Copy rewrite remains PXA-2026-09-01-001.

### AI — KEEP (kits: EXPAND after adapter; random tier: already filed)

`decideEnemyAction` is still the best expression of identity. `computeAITier` still has a 30% full-random 1–10 (`combatMath.ts` 34–51). Unbounded summoner chance `0.12 + level * 0.02` (WX 11932–11942) still saturates near level 44 — already owned. PX: do not rewrite `enemyAI.ts` to add verbs; teach the existing ones through kits **after** the NaN call site is fixed.

When a kit action does not land, melee fallback invents **Crush** / **Fire Bolt** (`WorldExploration.tsx` 16703–16715). Those ids are not in `spellData.ts`. Windstorm then treats Fire Bolt as ranged (`16729`, `fb.range > 1`) on an adjacent strike. That is a second spell language with no book entry and no targeting metadata. New ID: PXA-2026-09-21-003.

### Spells — MERGE clones, KEEP signatures

`starterSpells` is still the 32-id book including Strike (`spellData.ts` 9–28, 547–691). Clone pairs from 08-31 still stand. `spellType: "damage"` on Shield (40) still leaks into admin.

Almost every spell has `mpCost: 0`. **Keep that.**

### Spell discovery — REWORK (unchanged class)

```2395:2400:src/frontend/src/components/WorldExploration.tsx
  // Base spells = the always-owned innate spells (ALL starter spells + physical attack)
  // Every spell in starterSpells is a base/innate spell — always shown, never removable.
  const baseSpells = useMemo(() => {
    const base = starterSpells.map((s) => ({
      ...s,
      isBaseSpell: true as const,
```

`shouldIncludeBackendSpellInLibrary` only hides `usableByPlayer === false` unless already owned. Catalog membership is still ownership for every player-usable admin row. No persist `ownedSpellIds` / `observedSpellIds`. Recap still cannot grant a spell.

`#300` added `SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md` only. Design docs describe observe→win→unlock. They are not live. Do not ship Rune Bearer attune, Grimoire Stalker, or Wave-3 SDE ids as a substitute.

### Achievements (Feats) — SIMPLIFY

Same 15 seeds (`admin.mo` 309–325). GameFlow button label is **Feats**; `title` is Achievements (330–335). Recap section is still “Achievements Unlocked” (`PostBattleRecap.tsx` 541) — already UX-FEATS-VS-ACHIEVEMENTS / PXA-012. Flat Doka 50–1000. Spectator feats (betrayal, jackpot) still fire from world RNG.

### Challenges — REWORK offer; KEEP HUD

Same 9 contracts (`challengeCompletion.ts` 44–). Same random offer (`WorldExploration.tsx` 12210–12218). Integrity of predicates improved (Life Drain, Striker AoE/bounce still open as **#327**). The **offer** is still unshaped and flat. PXA-009 owns that.

The panel now stays up after accept (`challengeHudVisibility.ts`). WX `visible` is still the accept window (19177–19178). Do not revert that split.

### Bosses — KEEP kits; REWORK rush pairs

19 frontend ids + `bossKits.ts` still honest. `combinedMechanic` still only in `useBossRush.ts`. WX never renders the sentence. Room rewards still flat. Wave-4 sheets (`docs/design/BOSS_AND_SPELL_DISCOVERY.md`) are spec only — do not ship `statMultiplier: 999` replacements as extra chrome before pair rules exist.

### Dungeons — EXPAND

Chain is still depth + Doka multiplier + white portal. `spawnPolicy.ts` adds `DUNGEON_EXTRA_ENEMIES` / `DUNGEON_TIER_BOOST` (more rats, not a new rule). Same generator, AI, modifiers as free roam. Admin editor is still a second “dungeon” word.

### World events — SIMPLIFY + MERGE; announce must match; Windstorm still disagrees with itself

22 registry entries. Two-roll trigger. Admin dropdown still echoes `announceText` (`mapModifiers.ts` 505–513). Honesty table:

| Id | Player / admin is told | Engine does |
| :--- | :--- | :--- |
| Paper Windstorm | Announce + admin: “ranged spell reach halved” (`mapModifiers.ts` 251) | Player `spellEngine`: 30% miss, no range gate (WX 9563–9572). Enemy: 50% miss when `range > 1` (16491, 16729). Targeting has **no** half-range |
| Blood Moon | Announce: flavor only | +25% non-heal damage (`spellEngine.ts` 895). **No** heal cut. Registry hook still says “placeholder” (265–267) |
| Mirror Field | Announce: flavor | 20% single-target reflect (`spellEngine.ts` 901–907). Registry comment still “placeholder” (276–277) |
| Gravity Well | Announce: “heavy pull” | Empty hook; unused `_isGravityWell` |
| Fog of War | Announce: “vision is shrouded” | Empty hook; unused `_isFogOfWar` |
| Frozen Terrain | Announce: MP doubled (honest vs Slime) | MP ×2 only — same as Slime Flood. AI walks now pay it |
| Titan’s Vigor | Announce: +1000 HP, 1–5× | Exactly that. Arbitrary at every level |

PXA-2026-09-01-002 still owns announce-vs-engine as a class. **Two live Windstorm rates** remains PXA-2026-09-02-003.

### World Dynamics catalog — MERGE or hold

`worldFeatures.ts` 1–18: design-only, does not generate maps. `pickWeightedFeatures` callers: tests only. Rune Bearer is still a second discovery language. Blood Altar is still a fourth “Blood.” Do not stack. Still PXA-2026-09-01-003.

### Design catalogs since 09-02 — MERGE or hold (new)

Live combat did not grow. The repo did:

| Catalog | Merge | Status |
| :--- | :--- | :--- |
| Enemy formations drop 3 | `#276` `docs/design/ENEMY_FORMATIONS_2026-09-02.md` | PROPOSED; “who stands together” on live families |
| Enemy AI evolution increment | `#280` `docs/ENEMY_AI_EVOLUTION_2026-09-02.md` | Spec; modules on relative difficulty |
| Spell proposals Wave 3 | `#282` `docs/automation/SPELL_PROPOSALS_2026-09-02.md` | New ids on a gifted book |
| Boss Wave 4 sheets | `#293` `docs/design/BOSS_AND_SPELL_DISCOVERY.md` | Spec only |
| Discovery Wave 3 | `#300` `SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md` | Observe→win still unwired |

A fifth poster (formation) on piece + family + aiTier + lore Register, plus Wave-3 spell ids into an innate 32-book, is feature bloat. New ID: PXA-2026-09-21-002.

### Progression — EXPAND grants; KEEP no-cap; do not flatten death

`xpForNextLevel` = `100 * 2^(N-1)` (`xpCurve.ts`). Victory XP = `sum(enemy.level * 20)` (`rewardResolver.ts` 89–98). Boss `1.08^diff` still scales. Spell upgrade `10 * 2^level` still grows.

LHIPS-001 already measured the practical wall. PX: the **combat** grant must stay a noticeable leftover-XP slice at any level. Express that as threat-scaled victory XP (PXA-004), not a level cap, not a third currency. Do not twin WDEAD’s 999 spawn ceiling.

### Shops — SIMPLIFY (GameKey how-to is new chrome, not a new loop)

| Sink | Where | Role |
| :--- | :--- | :--- |
| Buff items | `BuffShop.tsx`; GameFlow **Items** (`GameFlow.tsx` 307–316) | Combat shortcuts; `localStorage` inventory |
| Canister `BUFF_CATALOG` | `main.mo` 2772–2778 | Different ids/costs; no `purchaseBuff` callers under `components/` |
| GameKey / Mollie | WX cart (17786–17813) → `DokaGameKeyShop` (19162+) | Email + consent + QR + admin approve + 120-char redeem. How-to steps now exist (`iapShopCopy.ts` 25–32) |
| Canister `defaultShopPackages` | `admin.mo` 265–282 | 15 SKUs to 1.6M Doka. Player UI does not list them |
| Rename | 100 Doka | Cosmetic |
| Spell upgrade | `upgradeSpell` | The real mastery sink |

GameKey still answers **no** tactical question. Still PXA-2026-09-02-001.

### Death — KEEP

`DEATH_XP_PENALTY_RATE = 0.2`, `DEATH_DOKA_PENALTY_RATE = 0.4`. Realm + guards. Do not flatten.

### Rewards — REWORK the menu, KEEP the pipe

Same faucets. Recap should remain one threat-scaled combat grant plus optional named challenge/feat lines.

### Visual feedback — KEEP juice; SIMPLIFY chrome

JUICE stays. Blood bar is gone (good). Remaining simultaneous languages: challenge panel (now correctly sticky), Map Effects, initiative, spell bar, SummonControlPanel, orbs, Feats, Items, Buy Doka cart, Bosses, Enemies (flavor), chat, debug. GameFlow realm-tool row (289–346) plus WX leftover-XP bar. Two carts and two bestiaries are the leftover overload; the Enemies button is now the louder lie because it *says* it is not the game.

### Admin-enabled content — REWORK

CRUD still public-read. Default bosses still retired ids. Admin modifier **type** list matches registry ids. Announce text can still schedule a rule the engine does not run, and Windstorm’s engine does not even agree with itself. Admin spells without targeting metadata still save (PXA-015).

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
- Accepted challenge tracker visible after the first action.

---

## Recommended sequence (human, not this automation)

1. **Honesty of rules the player can read today** — Register copy, modifier announce, Windstorm single rate, rush pair copy, Crush/Fire Bolt → Strike. (PXA-2026-09-01-001, PXA-2026-09-01-002, PXA-2026-09-02-003, PXA-003, PXA-2026-09-21-003)
2. **Take flavor lore off the leftover-XP bar.** (PXA-2026-09-21-001)
3. **Discovery contract** — innate 2–4, find the rest. Do not ship Rune Bearer, formations, or Wave-3 SDE first. (PXA-001, PXA-2026-09-01-003, PXA-2026-09-21-002)
4. **NaN kit adapter, then one enemy poster + kits past zone 2.** (EBA-013, PXA-007, PXA-013)
5. **Unbounded grants** including victory XP. (PXA-004, LHIPS-001)
6. **HUD / shop / words.** GameKey off the tactical bar; retire unused packages. (PXA-2026-09-02-001, PXA-011, PXA-012)

Do not implement these from this file unless a human or the Report Action Orchestrator picks an ID and it is still unique versus open PRs.

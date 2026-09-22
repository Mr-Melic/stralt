# Player Experience Coherence Audit — 2026-09-22

**Auditor:** Player Experience Coherence Auditor  
**Automation:** `30118f7c-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */48 * * *`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior audits:** [`PX_COHERENCE_AUDIT_2026-09-02.md`](./PX_COHERENCE_AUDIT_2026-09-02.md) (on main); 2026-09-21 narrative and IDs live in open draft [PR #343](https://github.com/Mr-Melic/stralt/pull/343) (not merged; same HEAD).  
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

**Do not re-file** `PXA-2026-08-31-001` … `015`, `PXA-2026-09-01-001` … `003`, `PXA-2026-09-02-001` … `003`, or `PXA-2026-09-21-001` … `003`.  
`PXA-2026-09-02-002` is **done** (accepted challenge HUD). `PXA-2026-08-31-006` display half remains **done** (Blood bar gone).  
New records: [`ACTION_IDS_PXA_2026-09-22.md`](./ACTION_IDS_PXA_2026-09-22.md) (`PXA-2026-09-22-001` … `003`).

Sibling IDs / PRs already own: kit-zone NaN (`EBA-013` / `SDE` / `PREREQ-A`), `computeAITier` 30% noise, LHIPS XP-wall / victory-grant shape, unbounded summoner chance (`EBMA` / `WDEAD` / `AI-FUT-23`), spawn `floor(999 / tierSize)` (`WDEAD-2026-09-02-001`), Wave-3/4 overlay hold (`PXA-2026-09-21-002`), Crush/Fire Bolt (`PXA-2026-09-21-003`), Windstorm dual rate (`PXA-2026-09-02-003`), challenge HUD click-through draft ([PR #364](https://github.com/Mr-Melic/stralt/pull/364) — this run’s 003 is the PX ledger for that fracture; do not open a third implementation). This run does not twin those. PX still agrees: **scale combat grants; do not add a level cap.**

Open PRs older than this docs branch (createdAt ascending): **#327** (Striker AoE/bounce) through the 09-21 swarm and later persist/map drafts. This PR adds new files only.

---

## Delta since 2026-09-21

**`origin/main` has not moved.** Live combat, catalogs, and HUD are the same bytes the 09-21 auditor read at `0f5363f`. Integrity PRs since then are still **drafts**. The **pipe** on main is unchanged. The **loop** is unchanged.

What **did** change around the game (and why it matters):

1. **A second identity-catalog generation entered the merge queue after `PXA-2026-09-21-002` was written.** That ID named 09-02 docs (`#276` formations, `#280` AI evolution, `#282` spell Wave 3, `#293` boss Wave 4, `#300` discovery Wave 3). After #343 opened, the same day’s automations added Wave-4 spells (`#342`), Wave-4 world dynamics (`#344`), Tide/File/Clock encounters (`#347`), formations drop 4 (`#348`), Wave-4 enemy/elite evolution (`#349`), AI evolution increment (`#351`), visual-asset library (`#355`), Expansion Director (`#366`), Wave-5 boss sheets (`#367`), Wave-4 discovery (`#371`), plus content-diversity / meta / telemetry docs. **Do not re-file 002.** The hold now also names those PRs. Shipping any of them before PXA-001 / 007 / 008 still makes encounter rules less readable.
2. **#364 (open)** describes a side-effect of the accepted-challenge KEEP: the sticky `z-index: 1200` panel eats map clicks. That is a **new PX fracture** this run files as 003. Prefer landing #364; do not stack a second pointer-events PR.
3. **Two live miss languages were never classified together.** Prior PX owned Windstorm’s two *rates* (`PXA-2026-09-02-003`). It did not own the **global 20% FAIL** that runs first on every non-physical player cast, then stacks independently with Windstorm’s 30% any-hit. That is new ID 001.
4. **Summon upgrade still advertises 10× the canister charge.** Persist already compensates (`spellUpgradeUiSpend`) so the wallet is not wiped. The *book* still teaches a fake mastery sink. That is new ID 002.

| Claim from 09-21 / 09-02 | Still true? | Updated evidence |
| :--- | :--- | :--- |
| Full `starterSpells` gifted as innate | **Yes** | `WorldExploration.tsx` 2395–2400; `spellData.ts` 27–28 |
| `shouldIncludeBackendSpellInLibrary` is not discovery | **Yes** | `adminSafety.ts` 711–718: `usableByPlayer !== false` → include |
| `combinedMechanic` unused | **Yes** | `useBossRush.ts` 19 / 31–130; no WX/engine reader |
| Blood HUD never spent | **Bar still gone** | GameFlow 282–290 snap spacer. `bloodBalance` still on the record (`main.mo` 137) |
| Covenant buff write-only | **Yes** | `covenantBuffMapsRef` init WX 1373–1388; write 11330; no combat reader |
| Slime Flood ≡ Frozen Terrain | **Yes** | `mapModifiers.ts` 155–172, both `onMpCost * 2` |
| Gravity Well / Fog of War empty | **Yes** | Registry 280–296; WX `_isGravityWell` / `_isFogOfWar` unused |
| Titan’s Vigor +1000 HP, 1–5× dmg | **Yes** | `mapModifiers.ts` 300–316 |
| Admin bosses still name `fireball` / `blood_nova` | **Yes** | `admin.mo` default boss seeds |
| Random legendary challenge every fight | **Yes** | WX 12210–12218 |
| Buff shop vs canister catalog drift | **Yes** | `BuffShop.tsx` 31–79 vs `main.mo` 2772–2778 |
| Kits stop at `levelZone` 2 | **Still dead at zone 0** | `enemyAI.ts` 163–199; call passes the **object** (`WX` 11920). EBA-013 |
| Paper Windstorm = two live rates | **Yes** | Announce “reach halved” (`mapModifiers.ts` 249–257). Player 30% any hit (WX 9563–9572). Enemy 50% if `range > 1` (16491, 16729) |
| 15 IAP SKUs unused by player UI | **Yes** | GameKey ritual on leftover-XP cart; `defaultShopPackages()` still seeded |
| Accepted challenge HUD hides after first action | **Still fixed** | `shouldShowChallengeHud` (`challengeHudVisibility.ts` 15–23) |
| EnemyRegister teaches a different game | **Partial** | `#328` lore chip (`enemyRegisterCopy.ts` 6–15). `MONSTERS` 28–88 still false. HUD button still **Enemies** (WX 17845–17857) |
| Crush / Fire Bolt fallback | **Yes** | WX 16711–16715. Still PXA-2026-09-21-003 |
| `worldFeatures.ts` unwired | **Yes** | `pickWeightedFeatures` callers: tests only |

---

## Verdict

The **core identity is still sound**: AP spends actions, MP spends movement, explicit `SpellConfig` targeting, one Doka wallet, persist-locked `applyRewards` + root recap, percentage death, honest solo boss kits + `BossAbility`, five distinct summons **plus player control**, signature spells (Swap, Mark, Barrier, Mirror, Timestep, Sacrifice).

The game still does **not** play as one loop. The same three fractures dominate:

1. **Discovery is not a system.** The book is gifted. A helper named like a gate does not gate.
2. **Rules on the box are not rules in the engine.** Register, rush pairs, several map events, Windstorm’s two rates, Crush/Fire Bolt, and now a **third miss language** (FAIL) that the Windstorm announce never mentions.
3. **Most secondary rewards are flat** on an unbounded `2^(N-1)` curve. Live enemy kits never leave band 0.

**New this run (same HEAD, new reads):** (a) FAIL 20% and Windstorm 30% are independent, so magic on a Windstorm map lands ~56% before RES; (b) summon upgrades teach a 10× sink the canister does not charge; (c) the sticky challenge tracker (a correct KEEP) blocks targeting until pointer-events are fixed.

Until PXA-001 / 003 / 007 / 008 / 013, PXA-2026-09-01-001 / 002 / 003, PXA-2026-09-02-001 / 003, PXA-2026-09-21-001 / 002 / 003, and the three new IDs are designed, **do not implement** formations, SDE Wave-3/4 ids, boss Wave-4/5 sheets, Expansion Director tiles, or World Dynamics overlays.

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
| **Accepted-challenge HUD visibility** | KEEP | `shouldShowChallengeHud` matches the accept-window comment. Click-through is 003, not a revert. |
| **GameKey / Mollie IAP** | KEEP off-loop; SIMPLIFY chrome | Real-money faucet. Not a tactic. Still on the leftover-XP cart. |
| **Global spell FAIL (20% − 0.1%/level)** | SIMPLIFY / MERGE | A fizzle tax, not a choice. Stacks with Windstorm. Physical Strike is exempt — that *is* a decision if FAIL stays the only miss. |
| **Ember / Tide / Void family melee hooks** | MERGE into kits | Real but name-heuristic (`family === "ember_knight"`). Fold into explicit kit metadata. |
| **Spell catalog (full `starterSpells`)** | MERGE | Shield ≡ Iron Skin; Poison ≡ Venom; two heals+CHC; Expose ≡ Shadow Veil; three drains. |
| **Enemy Crush / Fire Bolt fallback** | MERGE | Uncatalogued melee verbs. Still 09-21-003. |
| **Enemy identity (piece + family + aiTier + Register lore)** | SIMPLIFY | Four posters for one unit. Live kit is always zone 0. PXA-007 still owns the pick. |
| **Achievements / Feats** | SIMPLIFY | Mastery mixed with chores and RNG. Button **Feats**; `title` Achievements (`GameFlow.tsx` 330–335). |
| **Buff shop + GameKey + leftover packages** | SIMPLIFY | GameFlow **Items** vs WX cart **Buy Doka**. Catalog still disagrees. 15 SKUs still seeded. |
| **World-HUD Enemy Register** | SIMPLIFY placement | After #328 it is labeled not-the-game. Combat chrome should not host an admitted lie. |
| **HUD Blood bar** | DEPRECATE leftover field | Chrome is gone. Keep canister inert. Do not invent a spend. |
| **`resilience` / `evasion` on persist** | DEPRECATE or EXPAND | Required on `CharacterStats`; unused in `combatMath.ts`. Register still claims “evasion passive.” |
| **`covenantBuff` / shrine 3-map write** | DEPRECATE or EXPAND | Shrine pays 300 Doka. The buff is still write-only. |
| **Canister `defaultShopPackages` 15 SKUs** | DEPRECATE from player truth | GameKey replaced the picker. Public `getShopPackages` is a second shop language. |
| **Wave-3/4/5 design catalogs + Expansion / Tide-File-Clock** | MERGE or hold | Docs (and open PRs) only. Stacking them on the gifted book + 22 modifiers answers none of the four questions. Still 09-21-002. |
| **Spell discovery** | REWORK | Innate 32-id book. No observe → win → unlock. |
| **Battle challenges** | REWORK offer | Random pick among 9, including legendary, every fight. HUD visibility is KEEP; click-through is SIMPLIFY. |
| **Summon upgrade 10× advertisement** | REWORK | Book shows `100 * 2^level`; `upgradeSpell` charges `10 * 2^level`. Fake progression fantasy. |
| **Boss-rush combined mechanics** | REWORK | Copy-only. Not shown in WX, not executed. |
| **Admin-enabled catalogs** | REWORK | Live book, `bossKits.ts`, `admin.mo` seeds are three truths. `spellFailBaseChance` can rewrite every cast. |
| **Map modifiers / world events** | SIMPLIFY + MERGE | 22 entries. Twins, placeholders, Titan lottery. Windstorm still has two live numbers **plus** FAIL. |
| **World Dynamics catalog (`worldFeatures.ts`)** | MERGE or hold | Unwired. Designed to stack on the 22. Rune Bearer is a second discovery language. |
| **EnemyRegister / family lore** | REWORK copy | Player-facing sentences for a game that is not running, plus a lore chip. |
| **Dungeon chain** | EXPAND | Extra rats + Doka multiplier (`spawnPolicy.ts` `DUNGEON_EXTRA_ENEMIES`). Needs a rule free roam does not have. |
| **Progression / rewards (flat + linear-vs-exp)** | EXPAND | Curve unbounded; grants are not. Do not add a cap. FAIL shrinking to 0 at ~201 is not a substitute for threat-scaled XP. |
| **Terminology** | SIMPLIFY | Feats vs Achievements; GameKey vs Doka; Enemies vs Flavor Lore vs Bosses; FAIL vs miss vs reach halved; SR vs RES vs resilience. |

---

## System notes (evidence)

### Enemies — SIMPLIFY poster; REWORK the register

Overworld packs are still **chess pieces**. `buildEnemyKit` (`enemyAI.ts` 163–199) would grow at zone 1 / 2 **if** it received a number. Battle start still calls `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) where `levelZone` is `{ name, minLevel, maxLevel }` (4683–4687). Comment at 11915 still says “10 random spells.” Live kits are zone 0. **Progressive sophistication is designed and dead.** Do not re-file EBA-013. Do not expand the kit table (PXA-013) until the call site passes a number.

The **30% family overlay** still paints HP/dmg/RES and pixels. Three families still apply **name-heuristic** melee extras (Ember 3/3 DoT, Tide −1 MP / 2 turns, Void 25% reflect). The Register still teaches burning tiles, HP regen, magic immunity, wall-phase, evasion (`EnemyRegister.tsx` 28–88) under a **FLAVOR LORE** chip (`enemyRegisterCopy.ts` 6–15). World HUD button is still **Enemies** (WX 17845–17857). Copy rewrite remains PXA-2026-09-01-001. Placement remains PXA-2026-09-21-001.

**Keep** piece kits + the three real family hooks (as metadata).  
**Do not** teach elemental types the combat math does not have.

### AI — KEEP (kits: EXPAND after adapter)

`decideEnemyAction` is still the best expression of identity. `computeAITier` still has a 30% full-random 1–10. Unbounded summoner chance still saturates near 44. Already owned.

Melee fallback still invents Crush / Fire Bolt (`WorldExploration.tsx` 16711–16715). Still PXA-2026-09-21-003.

### Spells — MERGE clones, KEEP signatures, SIMPLIFY FAIL

`starterSpells` is still the 32-id book including Strike (`spellData.ts` 9–28). Clone pairs from 08-31 still stand. Guardian kit still lists both Shield and Iron Skin (`spellData.ts` 593). Almost every spell has `mpCost: 0`. **Keep that.**

**New classification:** player magic has a global FAIL roll **before** any effect (`spellEngine.ts` `resolvePlayerCast` 641–651). Chance is `spellFailBaseChance - (level-1) * spellFailReductionPerLevel` (`WorldExploration.tsx` 3646–3650), default **20% − 0.1% per level** (`main.mo` 630–631; `gameTypes.ts` 413–423). Physical Strike is skipped (`if (!isPhysical)`). The sidebar prints it as a character stat **FAIL** next to CHC/RES (WX 18559–18563). Admin can set the base 0–100 (`AdminDashboard.tsx` 4524+).

That answers “what progression fantasy?” only as “wait until level ~201 for 0%.” It does not add a decision on any given turn (you cannot spend AP to become accurate). It is **arbitrary difficulty** until it is the *only* miss language. It currently is not: Paper Windstorm then rolls again (`spellEngine.ts` 909–914) at 30% any hit (WX 9563–9572), including physical. Independent stack at level 1: `0.80 × 0.70 = 56%` land rate for magic on a Windstorm map, before RES/SP. Announce still says “reach halved” (`mapModifiers.ts` 251). Enemy path is a third number (50% if `range > 1`). Windstorm dual-rate remains PXA-2026-09-02-003. **FAIL as a second (player) / unused (enemy `caster.stats.fail` in `resolveSpellCast` 427–431) miss language is new.** New ID: PXA-2026-09-22-001.

### Spell discovery — REWORK (unchanged class)

```2395:2400:src/frontend/src/components/WorldExploration.tsx
  // Base spells = the always-owned innate spells (ALL starter spells + physical attack)
  // Every spell in starterSpells is a base/innate spell — always shown, never removable.
  const baseSpells = useMemo(() => {
    const base = starterSpells.map((s) => ({
      ...s,
      isBaseSpell: true as const,
```

`shouldIncludeBackendSpellInLibrary` only hides `usableByPlayer === false` unless already owned. Recap still cannot grant a spell. Do not ship Rune Bearer, Grimoire Stalker, or Wave-3/4 SDE ids as a substitute.

### Achievements (Feats) — SIMPLIFY

Same 15 seeds (`admin.mo` 309–325). GameFlow button **Feats**; `title` Achievements (330–335). Flat Doka 50–1000. Spectator feats still fire from world RNG.

### Challenges — REWORK offer; KEEP HUD visibility; SIMPLIFY hit-testing

Same 9 contracts. Same random offer (`WorldExploration.tsx` 12210–12218). PXA-009 owns offer shaping.

The panel stays up after accept (`challengeHudVisibility.ts`). WX `visible` is still the accept window (19177–19178). **Do not revert that split.**

**New:** default placement is `x = innerWidth - 260`, `y = 300`, width 240, `position: fixed`, `zIndex: 1200`, and the **whole wrapper** listens `onMouseDown` for drag (`ChallengePanel.tsx` 64–70, 195–210). Canvas is `zIndex: 30` (WX 17861–17870). After accept the tracker covers targeting for the rest of the fight; on a ~390px viewport it covers almost the field. That is the opposite of “tactical clarity.” Open [PR #364](https://github.com/Mr-Melic/stralt/pull/364) drafts click-through after accept. New ID: PXA-2026-09-22-003.

### Bosses — KEEP kits; REWORK rush pairs

19 frontend ids + `bossKits.ts` still honest. `combinedMechanic` still only in `useBossRush.ts`. Wave-4/5 sheets in open PRs are spec only — do not ship before pair rules exist (PXA-003, 09-21-002).

### Dungeons — EXPAND

Chain is still depth + Doka multiplier + white portal + `DUNGEON_EXTRA_ENEMIES` (`spawnPolicy.ts` 27, 146). Same generator, AI, modifiers as free roam. Rest maps are a pacing beat; rest-exit still re-arms encounters. Admin editor is still a second “dungeon” word.

### World events — SIMPLIFY + MERGE

22 registry entries. Honesty table unchanged from 09-21 (Windstorm two rates, Blood Moon flavor vs +25% damage, Gravity/Fog empty, Frozen ≡ Slime, Titan lottery). PXA-2026-09-01-002 and PXA-2026-09-02-003 still own announce-vs-engine and Windstorm unification. FAIL stacking is 09-22-001, not a re-file of 003.

### World Dynamics / design catalogs — MERGE or hold

`worldFeatures.ts` still test-only. PXA-2026-09-01-003 owns the overlay. PXA-2026-09-21-002 owns the 09-02 Wave-3/4 docs. **This run extends 002’s hold** to open `#342`, `#344`, `#347`, `#348`, `#349`, `#351`, `#355`, `#366`, `#367`, `#371` (and sibling 09-21 design PRs). Do not add a new ID for the same class.

### Progression — EXPAND grants; KEEP no-cap; do not flatten death

`xpForNextLevel` = `100 * 2^(N-1)` (`xpCurve.ts`). Victory XP = `sum(enemy.level * 20)` (`rewardResolver.ts` 89–98). Boss `1.08^diff` still scales. Spell upgrade `10 * 2^level` still grows **for non-summons**. FAIL hitting 0% at level ~201 is not a combat-grant substitute and is not a level cap — do not treat it as one (data-evolution already said this). PX: scale victory XP (PXA-004).

### Shops — SIMPLIFY; REWORK summon price tag

Buff items vs canister ids/costs unchanged (`greater_health_potion` / elixir 80 vs 200 / fury 150 vs 100). GameKey still on the leftover-XP cart (WX 17786–17813). Still PXA-2026-09-02-001 / PXA-011.

**New:** Spellbook summon upgrade cost is `SUMMON_UPGRADE_COST_MULTIPLIER * 10 * 2^level` (`SpellbookModal.tsx` 439–447; `gameConstants.ts` 94–102). `upgradeSpell` charges `spellLevelingBaseCost * 2^level` (base 10). `spellUpgradeUiSpend` already maps the lie so persist does not wipe the 90-Doka gap (`spellUpgrade.ts` 103–125). The player-facing fantasy is “summons are a 10× commitment.” The wallet fantasy is “same curve as Fireball.” That is overlapping identities and a disconnected reward. New ID: PXA-2026-09-22-002.

### Death — KEEP

`DEATH_XP_PENALTY_RATE = 0.2`, `DEATH_DOKA_PENALTY_RATE = 0.4`. Realm + guards. Do not flatten. Unpaid-cut principal scoping is an open persist PR, not a PX identity change.

### Rewards — REWORK the menu, KEEP the pipe

Same faucets. Recap should remain one threat-scaled combat grant plus optional named challenge/feat lines.

### Visual feedback — KEEP juice; SIMPLIFY chrome

JUICE stays. Blood bar is gone. Simultaneous languages: sticky challenge panel (now also a click shield), Map Effects, initiative, spell bar, SummonControlPanel, FAIL/SP/SR/CHC sheet, orbs, Feats, Items, Buy Doka, Bosses, Enemies (flavor), chat, debug. Two carts and two bestiaries remain. FAIL printed as a sixth combat stat is extra explanation load unless 001 makes it the single miss rule.

### Admin-enabled content — REWORK

CRUD still public-read. Default bosses still retired ids. Admin modifier type list matches registry ids. Announce can still schedule a rule the engine does not run. Admin `spellFailBaseChance` rewrites every non-physical cast without a map announce. Admin spells without targeting metadata still save (PXA-015).

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
- Accepted challenge tracker **visible** after the first action (click-through is a separate ID).
- Physical Strike skipping FAIL — keep that distinction if FAIL remains the only miss.

---

## Recommended sequence (human, not this automation)

1. **Honesty of rules the player can read today** — one miss language (FAIL vs Windstorm), Register copy, rush pair copy, Crush/Fire Bolt → Strike. (PXA-2026-09-22-001, PXA-2026-09-01-001 / 002, PXA-2026-09-02-003, PXA-003, PXA-2026-09-21-003)
2. **Challenge HUD click-through** — land #364 or equivalent. (PXA-2026-09-22-003) then reshape the offer (PXA-009).
3. **Summon upgrade: one number.** (PXA-2026-09-22-002)
4. **Take flavor lore off the leftover-XP bar.** (PXA-2026-09-21-001)
5. **Discovery contract** — innate 2–4, find the rest. Do not ship Rune Bearer, formations, Wave-4/5 sheets, or Expansion tiles first. (PXA-001, PXA-2026-09-01-003, PXA-2026-09-21-002)
6. **NaN kit adapter, then one enemy poster + kits past zone 2.** (EBA-013, PXA-007, PXA-013)
7. **Unbounded grants** including victory XP. (PXA-004, LHIPS-001)
8. **HUD / shop / words.** GameKey off the tactical bar; retire unused packages. (PXA-2026-09-02-001, PXA-011, PXA-012)

Do not implement these from this file unless a human or the Report Action Orchestrator picks an ID and it is still unique versus open PRs.

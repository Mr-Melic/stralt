# Player Experience Coherence Audit — 2026-09-25

**Auditor:** Player Experience Coherence Auditor  
**Automation:** `30118f7c-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */48 * * *`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior audit:** [`PX_COHERENCE_AUDIT_2026-09-24.md`](https://github.com/Mr-Melic/stralt/blob/refs/pull/529/head/docs/automation/PX_COHERENCE_AUDIT_2026-09-24.md) in open draft [PR #529](https://github.com/Mr-Melic/stralt/pull/529) (same HEAD)  
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

**Do not re-file** any of:

- `PXA-2026-08-31-001` … `015` (006 HUD hide **done**)
- `PXA-2026-09-01-001` … `003`
- `PXA-2026-09-02-001` / `003` (002 HUD **done**)
- `PXA-2026-09-21-001` … `003` — [PR #343](https://github.com/Mr-Melic/stralt/pull/343)
- `PXA-2026-09-22-001` … `003` — [PR #393](https://github.com/Mr-Melic/stralt/pull/393)
- `PXA-2026-09-23-001` … `003` — [PR #481](https://github.com/Mr-Melic/stralt/pull/481)
- `PXA-2026-09-24-001` … `003` — [PR #529](https://github.com/Mr-Melic/stralt/pull/529)

New records: [`ACTION_IDS_PXA_2026-09-25.md`](./ACTION_IDS_PXA_2026-09-25.md) (`PXA-2026-09-25-001` … `003`).

Sibling IDs already own: kit-zone NaN (`EBA-013`), `computeAITier` 30% noise, LHIPS XP-wall / 1e9 **clamp**, unbounded summoner chance, spawn `floor(999 / tierSize)`, AFDA palette cache keys. This run does not twin those. PX still agrees: **scale combat grants; do not add a level cap.**

Open PRs older than this docs branch include **#327** and **#331** (gameplay drafts) plus the four prior PX docs PRs. No overlapping filenames.

---

## Delta since 2026-09-24

`origin/main` has **not moved** since the 09-21 / 09-22 / 09-23 / 09-24 audits. The pipe and the loop are the same bytes. This run is a new *read* of the same HEAD: the **recap as the mastery surface**, and **reach as a no-cap fantasy**.

| Claim from last audits | Still true? | Updated evidence |
| :--- | :--- | :--- |
| Full `starterSpells` gifted as innate | **Yes** | `WorldExploration.tsx` 2395–2406; `spellData.ts` 27–28 |
| `shouldIncludeBackendSpellInLibrary` is not discovery | **Yes** | Catalog membership is still ownership |
| `combinedMechanic` unused | **Yes** | `useBossRush.ts` 19 / 31–130; no WX reader |
| Blood HUD gone | **Yes** | GameFlow 282–290 snap spacer. `bloodBalance` still on the record |
| Covenant buff write-only | **Yes** | `covenantBuffMapsRef` write ~11330; no combat reader |
| Slime Flood ≡ Frozen Terrain | **Yes** | `mapModifiers.ts` 155–172 |
| Gravity Well / Fog of War empty | **Yes** | Registry 280–296; WX `_isGravityWell` / `_isFogOfWar` 2324–2326 unused |
| Titan’s Vigor +1000 HP, 1–5× | **Yes** | `mapModifiers.ts` 300–316 |
| Admin bosses still name `fireball` / `blood_nova` | **Yes** | `admin.mo` default bosses |
| Random legendary challenge every fight | **Yes** | WX 12210–12218 |
| Kits NaN-stuck at zone 0 | **Yes** | `buildEnemyKit(..., currentMap.levelZone)` at WX 11920 — `levelZone` is `{ name, minLevel, maxLevel }` |
| Windstorm two live rates | **Yes** | Player 30% any hit (WX 9563–9572). Enemy 50% if `range > 1` (16729). Announce “reach halved” (`mapModifiers.ts` 251) |
| Accepted challenge HUD visible | **Yes** | `shouldShowChallengeHud`. WX `visible` is still the accept window (19177–19178) |
| Crush / Fire Bolt fallback | **Yes** | WX 16710–16715 |
| Silent Boost ×1.5 | **Yes** | `boostMode` stuck `"xp"` (WX 2098, 12374–12377) |
| Idle +1 HP / 10s | **Yes** | WX 3617–3626 |
| Board unused kills | **Yes** | No `useSaveKillCount` under `components/` |
| Betrayal 6× | **Yes** | WX 15594–15653 |
| Portal-verb overload | **Yes** | Solo boss 15% / Rest 10% / Rush 8% (WX 4884–4959) |
| Victory Doka is a hidden lottery | **Yes — previously LHIPS/BAL only** | WX 12379–12414; recap forces `dokaBreakdown: []` (12468) |
| Recap names the challenge | **No — never did** | Victory fills `["Battle Challenge"]` (12469). `PostBattleRecap` never reads `completedChallenges` |
| Spell reach keeps teaching | **No — silent ceiling** | `getEffectiveSpellRange` caps at `maxSpellRange` default **5** (WX 3653–3664; `main.mo` 628; `gameTypes.ts` 411–420) |

What **this read** adds (and why it is not a twin):

1. **LHIPS / WDEAD / BAL already measured the 1e9 band as a clamp / EV problem.** They did not ask the four PX questions. The player-facing grant is a slot machine, the recap **deletes** the per-enemy line the UI already knows how to draw, and 90% of packs pay `level * 1..3` while a hidden 0.01% band is the real wallet fantasy. New ID: PXA-2026-09-25-001.
2. **Challenge mastery dies at the recap.** `_completedChallengeName` is computed and discarded. The type has `completedChallenges` / `dokaFromChallenges`. The panel never renders them. Completing Untouchable and completing “win in 15 turns” look identical. New ID: PXA-2026-09-25-002.
3. **Reach growth is the one no-cap tool that actually works — until a silent 5.** `+1` range every 10 levels is a real progression fantasy. `maxSpellRange = 5` (admin 1–20, no player sentence) freezes positioning mastery in the mid-game. That is not a level cap; it is a **reach cap** on a game that forbids judging high level as an endgame. New ID: PXA-2026-09-25-003.

Until PXA-001 / 003 / 007 / 008 / 013 and the open 09-01…09-24 IDs are designed, do not implement Wave catalogs, Rune Bearer, or more admin SKUs.

---

## Verdict

The **core identity is still sound**: AP spends actions, MP spends movement, explicit `SpellConfig` targeting, one Doka wallet, persist-locked `applyRewards` + root recap, percentage death, honest solo boss kits + `BossAbility`, five distinct summons **plus player control**, signature spells (Swap, Mark, Barrier, Mirror, Timestep, Sacrifice), Time Warp’s 15s clock (announce matches), Death Realm as a quiet place, SP as a real damage multiplier.

The game still does **not** play as one loop. The same three fractures dominate:

1. **Discovery is not a system.** The book is gifted.
2. **Rules on the box are not rules in the engine.** Register, rush pairs, Windstorm, Crush/Fire Bolt, several modifiers.
3. **Most grants are flat or hidden RNG** on an unbounded `2^(N-1)` curve. Live kits never leave band 0.

**New this run:** the recap — the one screen that should teach “what was this fight *for*” — hides the wallet roll and the named contract; and the only unbounded *tactical* growth on the book (reach) hits an unpublished ceiling of 5.

---

## Classification (all reviewed systems)

| System | Class | One-line why |
| :--- | :--- | :--- |
| **Combat AP/MP split** | KEEP | AP = actions, MP = movement; book `mpCost` is ~0. |
| **Explicit spell targeting metadata** | KEEP | `targetType` / range / LoS — not name heuristics. |
| **Atomic reward funnel + root recap (pipe)** | KEEP | `applyRewards` / `saveBattleStats` + `PostBattleRecap` at app root. |
| **Recap as a mastery surface (contents)** | REWORK | Pipe is honest; the card is not. Empty Doka lines, dummy challenge, “Achievements Unlocked.” |
| **Death 20% XP / 40% Doka + Death Realm** | KEEP | Percentage cost stays meaningful. Realm is a quiet map (no enemies). 1.5s guards are a real rule. |
| **Solo boss kits + `BossAbility`** | KEEP | Unique phase kits; real specials. Boss Guide beats EnemyRegister. |
| **Enemy / summon AI engine** | KEEP | Archetypes, lookahead, LoS step. Do not add toggles. |
| **Summon five-pack + control panel** | KEEP | Distinct kits; panel is the mastery surface. Control drop on `advanceTurn` is a real rule. |
| **Signature spells** | KEEP | Swap, Mark, Barrier, Mirror, Timestep, Sacrifice. |
| **SP on the sheet** | KEEP | Live magic damage `* (1 + sp/100)` (WX 3320–3322). |
| **30s shot clock + Time Warp 15s** | KEEP | Visible on `BattleUIPanel`. Time Warp announce matches. |
| **Spell range +1 / 10 levels** | KEEP growth; REWORK the ceiling | The growth answers the no-cap fantasy. The silent 5 does not. |
| **JUICE** | KEEP | Presentation only. |
| **Admin UI gated + backend `#admin`** | KEEP off the player HUD | Must stay gated. Live knobs need a player sentence (003). |
| **Accepted-challenge HUD visibility** | KEEP | Do not re-hide. Click-steal remains 09-22-003 / #364. |
| **GameKey / Mollie IAP** | KEEP off-loop; SIMPLIFY chrome | Not a tactic. Still on the leftover-XP cart (09-02-001). |
| **In-battle elixir / boots / charm / fury** | KEEP | Timing tools. HP pots stay 09-23-002. |
| **Attack Nearest on the selected spell** | KEEP | Player-tile origin. Not a second targeting language. |
| **Physical Strike skipping FAIL** | KEEP | If FAIL remains the only miss language (09-22-001). |
| **Ember / Tide / Void family hooks** | MERGE into kits | Real; name-heuristic. |
| **Spell catalog clones** | MERGE | Shield ≡ Iron Skin; Poison ≡ Venom; … |
| **Crush / Fire Bolt fallback** | MERGE | Uncatalogued verbs (09-21-003). |
| **Arcane Surge + Overflow AP −1** | MERGE AP half | Same `onApCost`. Overflow also fizzles statuses. Slim under PXA-008. |
| **World Dynamics + Wave-3/4/5/6 catalogs** | MERGE or hold | Docs only. Do not stack (09-21-002 / 09-01-003). |
| **Enemy identity (piece + family + aiTier + lore)** | SIMPLIFY | Four posters. Kits stuck at zone 0. |
| **Achievements / Feats** | SIMPLIFY | Mastery mixed with chores/RNG. Recap still says Achievements. |
| **Buff shop + GameKey + leftover SKUs** | SIMPLIFY | Two carts. Catalog drift. |
| **HUD chrome** | SIMPLIFY | Items, Board, Feats, Bosses, Enemies-as-lore, Buy Doka, chat, FAIL row. |
| **Terminology** | SIMPLIFY | Feats vs Achievements; GameKey vs Doka; SR vs RES vs resilience. |
| **FAIL vs Windstorm vs Overflow** | SIMPLIFY to one miss | Cast FAIL + Windstorm (09-22-001 / 09-02-003). Overflow is a third, status-only fizzle (stays under 09-01-002 + 09-22-001). |
| **HUD Blood bar** | DEPRECATE leftover field | Chrome gone. |
| **`resilience` / `evasion`** | DEPRECATE or EXPAND | Persist-only. |
| **`covenantBuff`** | DEPRECATE or EXPAND | Write-only. |
| **`defaultShopPackages` 15 SKUs** | DEPRECATE from player truth | GameKey replaced the picker. |
| **Silent idle regen** | DEPRECATE | 09-23-003. |
| **Spell discovery** | REWORK | Innate 32-id book. |
| **Battle challenges (offer)** | REWORK | Random among 9. HUD KEEP. Recap name is 09-25-002. |
| **Boss-rush `combinedMechanic`** | REWORK | Copy-only. |
| **Admin-enabled catalogs** | REWORK | Three truths. Live LevelUp knobs have no player card (003). |
| **Map modifiers** | SIMPLIFY + MERGE | 22 entries. Twins, placeholders, Titan lottery. |
| **EnemyRegister** | REWORK copy; SIMPLIFY HUD | Flavor chip + false rules + world-HUD **Enemies**. |
| **Dungeon chain** | EXPAND | Reward skin. Needs a unique rule. |
| **Progression / rewards** | EXPAND grants | Curve unbounded; most faucets are not. Victory *Doka* is a lottery (001), not a scale. |
| **Victory Doka roll** | REWORK | Hidden bands, not a decision. |
| **`maxSpellRange` ceiling** | EXPAND or announce | Silent 5 on a no-cap game. |

---

## System notes (evidence)

### Enemies — SIMPLIFY poster; REWORK the register

Unchanged class. `buildEnemyKit` would grow at zone 1 / 2 **if** it received a number. Live call still passes the `levelZone` object (WX 11920). Comment at 11915 still says “10 random spells.” Do not twin EBA-013. Do not expand the kit table (PXA-013) until the adapter exists.

30% family overlay + Ember / Tide / Void name hooks vs Register copy: still PXA-2026-09-01-001. World HUD **Enemies** (17845–17857): still 09-21-001. Betrayal 6×: still 09-24-002.

### AI — KEEP (kits: EXPAND after adapter)

`decideEnemyAction` is still the identity. `computeAITier` 30% noise already owned. Crush / Fire Bolt fallback still 09-21-003.

### Spells — MERGE clones, KEEP signatures, REWORK the reach ceiling

`starterSpells` is still the 32-id book including Strike. Clone pairs from 08-31 stand. `mpCost: 0` **stays**.

`getEffectiveSpellRange` (WX 3653–3664) adds `floor(level / spellRangeGrowthLevels)` and then `Math.min(..., maxSpellRange)`. Defaults: every 10 levels, cap **5** (`gameTypes.ts` 411–420; canister seed `main.mo` 628). Admin may set 1–20 (`adminGuard.mo` 201–202) with no Map Effects line and no sheet row. A range-3 starter is done growing at level 20. That is a finite endgame on **positioning**, which this audit is forbidden to assume. New ID: PXA-2026-09-25-003.

FAIL 20% − 0.1%/level then Windstorm 30%: still 09-22-001 / 09-02-003.

### Spell discovery — REWORK

```2395:2406:src/frontend/src/components/WorldExploration.tsx
  // Base spells = the always-owned innate spells (ALL starter spells + physical attack)
  // Every spell in starterSpells is a base/innate spell — always shown, never removable.
  const baseSpells = useMemo(() => {
    const base = starterSpells.map((s) => ({
      ...s,
      isBaseSpell: true as const,
    }));
```

No observe → win → unlock. Do not ship Rune Bearer.

### Achievements (Feats) — SIMPLIFY

15 seeds. GameFlow **Feats** / `title` Achievements. Recap **Achievements Unlocked** (`PostBattleRecap.tsx` 541). Flat Doka. PXA-009 / 012.

### Challenges — REWORK offer; KEEP HUD; REWORK recap name (new)

Same 9 contracts (`challengeCompletion.ts` 44–107). Same random offer (WX 12210–12218). HUD KEEP via `shouldShowChallengeHud`. Click-steal 09-22-003.

Victory recap:

```12468:12469:src/frontend/src/components/WorldExploration.tsx
            dokaBreakdown: [],
            completedChallenges: challengeCompleted ? ["Battle Challenge"] : [],
```

`_completedChallengeName` is computed above that block and unused. `PostBattleRecap` declares `completedChallenges` / `dokaFromChallenges` and **never renders them**. Boss Rush persist builds real names (WX 12787) onto a payload the panel also ignores. Mastery that cannot be named after the fight is not mastery. New ID: PXA-2026-09-25-002. Offer shaping remains PXA-009.

### Bosses — KEEP kits; REWORK rush pairs

Unchanged. `combinedMechanic` still copy-only.

### Dungeons — EXPAND

Chain is still depth + Doka multiplier + white portal + extra rats. Portal-verb overload remains 09-24-003.

### World events — SIMPLIFY + MERGE

22 registry entries. Honesty table unchanged (Windstorm two rates, Blood Moon flavor vs +25%, Gravity/Fog empty, Frozen ≡ Slime, Titan lottery, Iron Curse heal-half unused — `MAP_MODIFIER_IRON_CURSE_HEALING_MULTIPLIER` has no WX reader). Time Warp 15s is **honest** and KEEP. Overflow fizzle is `applyActiveEffect` only (WX 1871–1886) while announce says “spells fizzle 10% more” — stays 09-01-002 / 09-22-001, not a new ID.

### Progression — EXPAND grants; KEEP no-cap; REWORK victory Doka

XP: `100 * 2^(N-1)` vs `sum(level * 20)` * silent 1.5 (09-23-001). Boss `1.08^diff` still scales. Spell upgrade `10 * 2^level` still grows (summon tag 09-22-002).

Victory **Doka** is not `level * k`. It is seven RNG bands (WX 12379–12414): 90% `1..3`, 5% `1..10`, …, `roll < 0.0001` → `1..1_000_000_000` (comment says 0.0001%; the comparison is a **0.01%** band). Then Doka Fever ×2, dungeon 1.5–4×, clamp 100_000. Recap shows one number and **empties** `dokaBreakdown` even though `PostBattleRecap.tsx` 494–532 already draws per-enemy lines when the array is non-empty. That answers none of the four questions. LHIPS owns the clamp/EV math; this ID owns the identity. New ID: PXA-2026-09-25-001.

### Shops — SIMPLIFY

Unchanged class. GameKey off-loop (09-02-001). Buff drift / HP pots (PXA-011 / 09-23-002).

### Death — KEEP

20/40 + realm + guards. GameOver copy (“quiet map with no enemies”) matches generate (`rawRoster = []` when `isDeathRealm`, WX 6245–6246). Do not flatten. Idle regen is a different recover language (09-23-003).

### Rewards — REWORK the menu, KEEP the pipe

Same faucets. Recap should be **one** threat-scaled combat grant plus **named** challenge/feat lines — not a lottery total and a discarded `"Battle Challenge"`.

### Visual feedback — KEEP juice; SIMPLIFY chrome

JUICE stays. Blood gone. Simultaneous languages: leftover-XP bar (Center, Enemies, Buy Doka), GameFlow realm row (Items, Board, Feats, Bosses), challenge HUD, Map Effects, initiative + 30s clock, spell bar, SummonControlPanel, FAIL/SP/SR/INIT/RES/CHC sheet, chat, debug. Two carts, two bestiaries, Board-with-dead-kills.

### Admin-enabled content — REWORK

CRUD still public-read. Default bosses still retired ids. Announce can still schedule a rule the engine does not run. `levelUpConfig` is hydrated from `pbv_levelup_config` once at mount (WX 2307–2315) and drives FAIL, HP%, AP/MP cadence, **and** the reach ceiling. Admin can rewrite those without a changelog (changelog is `APP_VERSION` only). Color palette is fetched into `pbv_color_palette` (WX 936–941); AFDA already owns cache-key drift — do not twin. PXA-015 still owns targeting metadata on save. 09-25-003 owns the player-facing reach sentence (or the removal of the silent 5).

---

## What already fits (do not “fix”)

- AP for spells / MP for walk.
- Eight-slot bar as a **commitment** (once the book is earned).
- Summon archetypes, lifespan-on-own-turn, control panel, control drop on turn advance.
- Persist lock + recap **mount** at root (contents are the new break).
- Death Realm as a quiet place + percentage death.
- Boss phase 2 as kit + ability escalation.
- No level cap + compounding boss level-diff.
- Time Warp 15s when the banner says 15s.
- SP as a live magic multiplier; Strike skipping FAIL if FAIL is the only miss.
- Ember burn / Tide slow / Void 25% reflect — *if* Register matches them.
- Blood gone. Accepted challenge tracker visible after the first action.
- `+1` range per 10 levels **until someone names or lifts the 5**.

---

## Recommended sequence (human, not this automation)

1. **Honesty of rules the player can read today** — Register, modifier announce, Windstorm one rate, rush pairs, Crush → Strike. (09-01-001 / 002, 09-02-003, PXA-003, 09-21-003)
2. **Recap as the mastery surface** — named challenge, visible Doka composition, no silent lottery. (09-25-002, 09-25-001, then PXA-004)
3. **Keep accepted HUD click-through.** (#364 / 09-22-003) Do not hide it.
4. **Discovery contract** — innate 2–4. Do not ship Wave catalogs first. (PXA-001, 09-01-003, 09-21-002)
5. **NaN kit adapter, one enemy poster, kits past zone 2.** (EBA-013, PXA-007, PXA-013)
6. **Reach ceiling** — announce or lift `maxSpellRange`. (09-25-003)
7. **HUD / shop / words.** (09-02-001, 09-21-001, 09-24-001, PXA-011, PXA-012)

Do not implement these from this file unless a human or the Report Action Orchestrator picks an ID and it is still unique versus open PRs.

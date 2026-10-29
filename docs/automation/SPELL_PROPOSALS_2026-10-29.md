# Spell and Tactical Mechanics — Design Pass 2026-10-29

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1 law [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) through still-open Wave 20 [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-28.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-c0dd/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-28.md) (**#1255**). Same-day Wave 21 SDE is **running** (`cursor/spell-discovery-and-evolution-b517`) and **had not opened a PR at finish**. If it later claims a unique leftover, **SDE wins**. Prior-day SDE Wave 20 **did** open as **#1255** after #1251 and **won** Deep Gift / Cadence Sext / Deep Plate / Skew Mark / Pair Gait / Pair Plate.
- Spell, Discovery & Achievement Admin — still-open ACTION_ID-only PRs (no unique spell ids). **#1226** owns SDA-2026-10-28. Same-day SDA **opened as #1291** (`cursor/spell-discovery-achievement-admin-6edf`). Same-day unique-file PRs **#1277–#1302** do not overlap this dated proposal.
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) … still-open Wave 20 [`SPELL_PROPOSALS_2026-10-28.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-1812/docs/automation/SPELL_PROPOSALS_2026-10-28.md) (**#1251**)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); extra doors through #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / **#951** / **#1004** / **#1080** / **#1139** / **#1170** (Wave 20 bosses: `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`) / **#1244** (Wave 21 bosses: `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`) / **#1302** (Wave 22 bosses: `shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate`); tactical extras #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / #1011 / **#1063** / **#1132** / **#1177** / **#1251**. Same-day Wave 22 boss sheets **opened as #1302** during this run (`cursor/stralt-boss-system-7523`) and **did not** stamp `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` or this catalog’s extras. Extra doors below wait for **Wave 23** sheets. Do **not** restamp Wave 21 or Wave 22 doors.

This is **Wave 21** of the tactical catalog. Live HEAD is unchanged since Waves 4–20. Wave 20 (#1251) filled both-body leftover AP + leftover MP **=== 8 AND unequal** heal (Octave Mend), remaining `n===5` → `0` (Cadence Quinte), stretched-plus occupy (Pentadeca Span, counts as fifteen), caster+ally leftover invert (Kin Turn), and an Octave family plus Court Quinte.

**Wave 20 explicitly deferred twelve holes.** Discovery Wave 20 (#1255) already claimed leftover **AP === 1 AND MP ≥ 2** heal (Deep Gift), remaining `n>6` → `6` (Cadence Sext), leftover **AP === 1 AND MP ≥ 2** negate (Deep Plate), turn-end leftover **AP − MP === 2** detonate (Skew Mark), leftover **exactly 2/0** damage (Pair Gait), leftover **exactly 2/0** negate (Pair Plate), Giraffe Stride / Undeca Oath / Trip Reel / Giraffe Bite / Trip Skip / Summon Giraffe / Trip Toll / Brick Split / Watch Clip / Trip Cut / Giraffe Gate / Pack Giraffe / Giraffe Fold. **SDE keeps those.** This pass fills the remaining leftovers Wave 20 left for Wave 21, plus a three-body leftover invert that does **not** clone Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, Psalm Turn, Feud Turn, or Kin Turn:

| Wave-20 leftover | Owner after #1255 / #1251 | This pass |
| :--- | :--- | :--- |
| Leftover AP + leftover MP === **9** | Still open. Tally owns **sum === 3**. Score owns **sum === 4 AND unequal**. Stave owns **sum === 5**. Sestet owns **sum === 6 AND unequal**. Septet owns **sum === 7**. Octave owns **sum === 8 AND unequal**. Poise / Equal Gift own **equality ≥ 1** — **(4,4) is Poise**, not this family. Gaunt / Hollow Gift own **0+0**. Prime Gift (#1017) owns **exactly 1/1**. Gait Gift (#1082) owns **one-body AP ≥ 2 AND MP = 0** (overlaps (9,0)). Wide Gift (#1143) owns **one-body AP ≥ 2 AND MP ≥ 1** (overlaps (8,1) (7,2) (6,3) (5,4) — one-body vs both-body). Thin Gift (#1198) owns **one-body 1/0** (no Nonet pair). Deep Gift (#1255) owns **one-body AP === 1 AND MP ≥ 2** (overlaps (1,8) — one-body vs both-body). Lean Gift (#962) owns **AP = 0 and MP ≥ 1** (overlaps (0,9)). Dual Keep max surviving leftover is **2/2** (sum 4) — it **cannot** manufacture sum 9. Wave 16’s directed-diff `AP − MP === 2` **still collides** with Score at (3,1), Sestet at (4,2), and Octave at (5,3); **no Nonet pair has that diff** ((9,0) is 9, (8,1) is 7, (7,2) is 5, (6,3) is 3, (5,4) is 1). The discrete next leftover-sum is **9** (odd, **never a tie**). | **This pass:** Nonet Mend — **caster and target** leftover AP + leftover MP **=== 9**. Legal pairs **(9,0) (0,9) (8,1) (1,8) (7,2) (2,7) (6,3) (3,6) (5,4) (4,5)**. |
| Remaining `6` → `0` | Still open. Sext (#1255) caps `n>6` → `6` (**sixes stay 6**). Quinte (#1251) writes `n===5` → `0`. Quint (#1198) caps `n>5` → `5` (**sixes become 5**). Quarte (#1177) writes `n===4` → `0`. Tierce (#1132) writes `n===3` → `0`. Dock (#1063) writes `n===2` → `0`. Snuff (#1011) writes `n===1` → `0`. Quad (#1143) caps `n>4` → `4` (**sixes become 4**). Tern (#1082) caps `n>3` → `3` (**sixes become 3**). Cap (#1017) compresses `n>2` → `2` (**sixes become 2**). Floor (#906) compresses `n>1` → `1`. Rise (#962) pads `n===1` → `2`. Prime (#953) locks `n===0` → `1`. | **This pass:** Cadence Sixte (remaining `n===6` → `0`; zeros stay 0; `n===1`…`n===5` and `n>6` unchanged). **Do not mint** `spell-cadence-sext` (SDE) / `spell-cadence-six` / `spell-cadence-hexa` / `spell-cadence-sice` / `spell-cadence-sixth`. |
| Sixteen-cell occupy | Still open. Pentadeca Span is fifteen (stretched plus longArm 4 / shortArm 3). Tetradeca Span is fourteen (2×7). Trideca Span is thirteen (plus arm 3). Dodeca Span is twelve (3×4). Hendeca Span is eleven (stretched plus). | **This pass:** Hexadeca Span (axis-aligned **4×4**, counts as **sixteen**; click = **nearest cell to caster**, Dec / Dodeca / Tetradeca rule, not Hendeca / Trideca / Pentadeca center) |
| Invert leftover on **three** bodies | Still open. Two-body leftover-invert space is complete: Tempo Invert (one-body ally/self); Purse Turn (one hostile); Bar Cross (two-body **cross**); Duel Turn (two hostiles, caster stays); Hymn Turn (two allies, caster stays); Psalm Turn (mixed-side pair, caster stays); Feud Turn (caster + one hostile); Kin Turn (caster + one ally). | **This pass:** Triad Turn — invert leftover AP↔MP independently on **the caster, one same-side non-caster ally, and one opposite-side hostile**; caster **participates**. **Do not mint** `spell-choir-turn` / `spell-pew-turn` / `spell-trio-turn` / `spell-trine-turn` / `spell-duet-turn`. |
| Target-only sum===8 heal | **Held for SDE.** #1255 explicitly left this as a Wave-21 unique hole. Deep Gift is **1/≥2**, **not** this hole. | **Not this pass.** Do not mint `spell-octave-gift` / `spell-eight-gift` / `spell-nonet-gift` |
| Target-only sum===9 / sum===7 / sum===6 / sum===5 / sum===4 / sum===3 heal | **Still SDE leftover.** Nonet / Octave / Septet / Sestet / Stave / Score / Tally Mend are both-body. | **Not this pass.** Do not mint `spell-nonet-gift` / `spell-septet-gift` / `spell-sestet-gift` / `spell-stave-gift` / `spell-score-gift` / `spell-tally-gift` |
| Leftover AP − leftover MP === 2 (diff window as a **heal**) | Skew Mark (#1255) owns the **detonate**. A heal on that directed-diff still collides with Score / Sestet / Octave. | **Not this pass** (Wave 22). Do not mint a `spell-skew-*` family |
| Mid-RAF splice | Held (AGENTS.md) | Still held |
| Fourth `mpCost > 0` walk snipe | Held (Ley Toll / Undertow / Sanguine Toll) | Still held |
| Sixth echo id | Held | Still held |
| Player-owned Hex of Silence | Held (`BOSS_ONLY`) | Still held |
| Player-owned About Hinge | Held (`BOSS_ONLY` on #590) | Still held. Hostile 180° around a pair midpoint is still Pawn Trade. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after the reserved set **and** after #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 / #1177 / #1198 / #1251 / #1255. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

Same-day Discovery Wave 21 **is running** (`cursor/spell-discovery-and-evolution-b517`) and **has not opened a PR at finish**. **If that catalog later claims a unique leftover below, SDE wins** the unique §11 id; this catalog must not clone it. Do **not** clone #747 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 / #1177 / #1198 / #1251 / #1255 unique ids. Do **not** ship `spell-parched-mend` / `spell-cadence-floor` (second copy) / `spell-cadence-rise` / `spell-cadence-prime` / `spell-cadence-snuff` (second copy) / `spell-cadence-cap` (second copy) / `spell-cadence-dock` (second copy) / `spell-cadence-tern` (second copy) / `spell-cadence-tierce` (second copy) / `spell-cadence-quad` (second copy) / `spell-cadence-quarte` (second copy) / `spell-cadence-quint` (SDE) / `spell-cadence-quinte` (second copy) / `spell-cadence-sext` (SDE) / `spell-tally-gift` / `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-septet-gift` / `spell-octave-gift` / `spell-nonet-gift` / `spell-prime-gift` (second copy) / `spell-gait-gift` (second copy) / `spell-wide-gift` (second copy) / `spell-thin-gift` (second copy) / `spell-deep-gift` (second copy). Stamp family / observe metadata onto Wave-21 **tactical** ids only. #1255 §0.2 already stamps #1251 as Wave **21** family CORE. **This catalog stamps as Wave 22 family CORE.**

Do **not** mint `spell-nine-mend` / `spell-nona-mend` / `spell-novena-mend` / `spell-nonary-mend` / `spell-nonet-gift` / `spell-both-nonet` (Nonet Mend owns both-body sum===9 heal; (4,4) stays Poise; (4,5) is Nonet; (4,3) stays Septet; (4,2) stays Sestet; (5,3) stays Octave), `spell-cadence-sext` / `spell-cadence-six` / `spell-cadence-hexa` / `spell-cadence-sice` / `spell-cadence-sixth` / `spell-cd-sixte` (Cadence Sixte owns remaining `6` → `0`; Sext owns `n>6` → `6`; Quinte owns `5` → `0`; Quint owns `n>5` → `5`; Quarte owns `4` → `0`; Tierce owns `3` → `0`; Dock owns `2` → `0`; Snuff owns `1` → `0`; Quad owns `n>4` → `4`; Tern owns `n>3` → `3`; Cap owns `n>2` → `2`; Floor owns `n>1` → `1`), `spell-sixteen-span` / `spell-hexakaideca-span` / `spell-4x4-span` / `spell-plus-span` (Hexadeca Span owns sixteen; Pentadeca Span owns fifteen), `spell-choir-turn` / `spell-pew-turn` / `spell-aisle-turn` / `spell-mixed-turn` / `spell-trio-turn` / `spell-trine-turn` / `spell-trial-turn` / `spell-mass-turn` / `spell-self-ally-foe-turn` / `spell-duet-turn` / `spell-pair-turn` (Triad Turn owns caster + one ally + one hostile independent invert; Choir Hymn is a Wave-1 Discovery heal, **not** this invert), `spell-court-six` / `spell-court-sext` / `spell-court-sixth` (Court Sixte is the mass signature), or `spell-nonet-plate` / `spell-sum-nine-hood` (Nonet Hood owns sum===9 any-range miss; do **not** retag `even_gallery` / Dual Plate / Spent Plate / Gait Plate / Prime Plate / Thin Plate / Wide Plate / Deep Plate / Pair Plate / Octave Hood / Septet Hood / Sestet Hood / Stave Hood / Score Hood / Tally Hood / Poise Hood). Nine Span (`spell-nine-span`, occupy-weight 9) and Nona Oath (`spell-nona-oath`, Chebyshev = 9) are **not** this leftover-sum family. Undeca Oath (`spell-undeca-oath`, Chebyshev = 11) is **not** Hexadeca Span.

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is unchanged since 2026-08-31. Discovery is still inert. WX is **19,213** lines (`wc -l`). Same HEAD as Waves 4–20. `WorldExploration.tsx` lives at `src/frontend/src/components/WorldExploration.tsx` (not `engine/`).

### 1.1 Frontend runtime catalog — `src/frontend/src/data/spellData.ts`

`SPELL_ID_CATALOG` (`src/frontend/src/data/bossKits.ts` 29–62) still lists **32** ids. `WorldExploration.tsx` 2395–2408 still maps **every** `starterSpells` row to `isBaseSpell: true` (“always shown, never removable”).

`ownedSpells` (2410–2440) still unions those 32 with backend rows that pass `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718). That helper only drops `usableByPlayer === false` unless the id is already owned. It does **not** create a discovery path.

| ID | Name | Family (actual) | AP | Payload | Range | Notes |
| :--- | :--- | :--- | ---: | :--- | ---: | :--- |
| `physical_attack` | Strike | direct physical | 2 | 10 | 1 | Only true melee baseline; only `isBaseSpell` in data |
| `starter-shield` | Shield | RES% buff | 2 | +30% RES / 3 | 3 | Ally/self |
| `starter-poison` | Poison Arrow | DoT poison | 2 | 4×3 | 4 | No upfront |
| `starter-blast` | Chain Lightning | chain | 4 | 20 + 2 bounces | 4 | Only bounce spell |
| `starter-heal` | Blood Mend | self heal + CHC | 3 | 12 + +15% CHC / 2 | 0 | Self only |
| `starter-drain` | Life Drain | drain + SP | 3 | 10 / heal 5 + SP×0.8 / 2 | 2 | |
| `starter-frost` | Frost Bolt | damage + MP | 3 | 20 + MP−1 / 1 | 4 | Debuff, not steal |
| `spell-swap` | Swap | caster ↔ enemy | 3 | 0 | 3 | Only live position spell; `isSwap` |
| `spell-mark` | Mark | tile amp | 2 | next hit ×2 | 4 | Tile, not unit |
| `spell-barrier` | Barrier | obstacle | 3 | wall 2 turns | 2 | Blocks walk **and** LoS |
| `spell-mirror` | Mirror | reflect 1 spell | 4 | 0 | 0 | Player-only in data |
| `spell-timestep` | Timestep | full AP/MP once | 0 | once/battle | 0 | Player-only |
| `spell-sacrifice` | Sacrifice | HP-cost burst | 3 | 20% HP ×3 | 1 | HP, not MP |
| `spell-lifesteal-nova` | Lifesteal Nova | AoE drain | 5 | 20 + heal 10/hit r=2 | 1 | Circle only |
| `spell-enrage` | Enrage | DMG buff | 3 | +40% / 2 | 3 | Duration, not next-cast |
| `spell-iron-skin` | Iron Skin | RES% buff | 3 | +30% RES / 3 | 3 | Duplicate of Shield |
| `spell-haste` | Haste | MP **grant** | 2 | +2 MP / 1 | 3 | Only MP grant |
| `spell-weaken` | Weaken | DMG debuff | 3 | ×0.7 / 2 | 3 | |
| `spell-slow` | Slow | MP debuff | 2 | −2 MP / 2 | 3 | Not a root; not a steal |
| `spell-expose` | Expose | dmg + RES/SP | 3 | 15 + ×0.8 / 2 | 3 | |
| `spell-venom-strike` | Venom Strike | DoT venom | 3 | 4×3 | 2 | Near-duplicate of Poison |
| `spell-rallying-cry` | Rallying Cry | self heal + CHC | 4 | 20 + +15% CHC / 2 | 0 | Near-duplicate of Mend |
| `spell-drain-courage` | Drain Courage | drain + AP | 4 | 18 / heal 9 + AP−1 | 2 | Only AP debit |
| `spell-cursed-wound` | Cursed Wound | dmg + anti-heal | 3 | 22 + healRecv ×0.5 / 2 | 3 | |
| `spell-shadow-veil` | Shadow Veil | dmg + RES/SP | 3 | 18 + ×0.85 / 2 | 3 | Near-duplicate of Expose |
| `spell-inferno` | Inferno | DoT burn | 5 | 8×3, CD 3 | 3 | Only frontend cooldown |
| `spell-frost-nova` | Frost Nova | AoE + slow | 4 | 15 + MP−1 r=2 | 1 | Circle only |
| `summon-dire-wolf` | Dire Wolf | hunter | 3 | Strike + Venom | 2 | Lifespan 4 |
| `summon-sentinel` | Sentinel | guardian | 3 | Shield + Iron Skin | 2 | Player-only |
| `summon-archer` | Archer | kiter | 3 | Poison + Slow | 2 | |
| `summon-bomber` | Bomber | kamikaze | 2 | Inferno | 2 | Player-only |
| `summon-wisp` | Wisp | mobile healer | 2 | Mend + Rally | 2 | Walks; not a totem |

**None** of these rows set `lineOfSight`, `linear`, `diagonal`, `modifiableRange`, `minRange`, or `maxRange`. **No row sets `mpCost` ≠ 0.** No row uses `targetType: "line"` even though `targeting.ts` 576–617 implements that branch. `areaShape` is typed (`gameTypes.ts` 224) but **targeting never reads `areaShape`** — area expansion is Chebyshev around `areaRadius` (`targeting.ts` 690–727). Confirmed: `rg areaShape src/frontend/src/engine/targeting.ts` is empty.

`CharacterStats.evasion` exists (`gameTypes.ts` 64) and is persisted. Combat never reads it. Do not ship a percent-evasion card.

Live `ENEMY_SUMMON_CAP` is still **2** (`gameConstants.ts` 300). Quad Span (#636) counts as four … Pentadeca Span (#1251) as fifteen on paper; all twelve are implementation-blocked until that cap (or a dedicated occupy-weight) exists. Hexadeca Span is the same class: **propose the hole, do not pretend it can ship against cap 2**.

### 1.2 Backend admin seed — `src/backend/lib/admin.mo` `defaultSpells()`

Six ids, still **not** in `SPELL_ID_CATALOG`. They carry targeting flags. All six still have `mpCost = 0`.

| ID | Name | AP | CD | Flags | Notes |
| :--- | :--- | ---: | ---: | :--- | :--- |
| `shadow_strike` | Shadow Strike | 3 | 2 | diagonal, no LoS, range 1–4 | Only diagonal poke |
| `soul_rend` | Soul Rend | 3 | 4 | LoS, DoT 25 | |
| `vampire_bite` | Vampire Bite | 3 | 2 | drain 20/20, adjacent | |
| `reflect_barrier` | Reflect Barrier | 3 | 3 | self, defense | Mirror clone |
| `thunder_clap` | Thunder Clap | 4 | 3 | 8-dir AoE 25 via `hitTiles` | Closest thing to a cross |
| `void_collapse` | Void Collapse | 12 | 5 | attract-all + 80 AoE, `minLevel` 30 | Do not copy |

`OLD_SPELL_NAMES_SET` (`WorldExploration.tsx` 2356–2389) still filters by **name and id**. That heuristic is forbidden going forward.

### 1.3 Engine support vs catalog use (still true, line numbers at this HEAD)

| Mechanic | Engine @ `0f5363f` | Live catalog | Already proposed (reserved) |
| :--- | :--- | :--- | :--- |
| Spell `mpCost` debit | `executeCastAttempt` (`WorldExploration.tsx` 17096–17207) gates **AP only** (`17162–17165`). | Always 0 | Ley Toll / Undertow / Sanguine Toll. **No fourth snipe this pass.** |
| `areaShape` cone / cross / line | Typed, **unread**. Area = Chebyshev (`targeting.ts` 690–727) | Unused | Fan Bolt / Cross Cut reserved |
| `targetType: "line"` | Implemented 8-dir ray (`targeting.ts` 576–617) | **No spell** | File Lance |
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** (tests only; `rg` empty in WX) | Unused | Shoulder Bash, Hook Line. Nonet Step / Triad Turn relocate leftover **pools**, not tiles. Triad Turn is **not** `isSwap`. |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768 → WX `swapPositions` 9389) | Swap | Pawn Trade / Ward Interpose / Cadence Sixte is **not** `isSwap` (cooldown remaining, not tiles) |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, never this set |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire |
| Walk / leftover / force flags | Paper `walkMpSpentThisTurn` (Waves 6–10). Paper `forcedMovedThisTurn` (Wave 9). Leftover AP/MP die at turn end unless Dual Keep / Purse Keep / Stride Keep | Haste grants **now**; Timestep is full **now** | **This pass: Nonet Mend / Nonet Hold / Nonet\* / Must Nonet / Verse Nonet / Triad Turn / Court Sixte** |
| Sixteen-cell occupy | Twin=2 … Pentadeca=15 (stretched plus) | Absent | **This pass: Hexadeca Span** (axis-aligned 4×4 = 16) |
| Remaining CD rewrite | Theft **steals**; Imprint **copies**; Swap (#837) **exchanges full maps**; Rest skips **own** tick; Halve **÷2**; Grace skips **starting** the next own CD; Stall **+1**; Lag **+2**; Floor (#906) `n>1` → `1`; Prime (#953) `n===0` → `1`; Rise (#962) `n===1` → `2`; Snuff (#1011) `n===1` → `0`; Cap (#1017) `n>2` → `2`; Dock (#1063) `n===2` → `0`; Tern (#1082) `n>3` → `3`; Tierce (#1132) `n===3` → `0`; Quad (#1143) `n>4` → `4`; Quarte (#1177) `n===4` → `0`; Quint (#1198) `n>5` → `5`; Quinte (#1251) `n===5` → `0`; Sext (#1255) `n>6` → `6` | Inferno CD 3 is the only live lock | **This pass: Cadence Sixte (remaining n===6 → 0; n===1…n===5 and n>6 unchanged)** |
| Leftover sum (AP + MP === N) | Tally family is **sum === 3**. Score family is **sum === 4 AND unequal**. Stave family is **sum === 5**. Sestet family is **sum === 6 AND unequal**. Septet family is **sum === 7**. Octave family is **sum === 8 AND unequal**. Poise family is **equality ≥ 1**. Gaunt family is **both leftover 0**. Equal Gift is **target equality ≥ 1**. Prime Gift is **exactly 1/1**. Gait Gift is **one-body AP ≥ 2 AND MP = 0**. Wide Gift is **one-body AP ≥ 2 AND MP ≥ 1**. Thin Gift is **one-body AP === 1 AND MP === 0**. Deep Gift is **one-body AP === 1 AND MP ≥ 2**. Tied Gait is both leftover **exactly 2**. Dual Plate is leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**. Pair Gait / Pair Plate are leftover **exactly 2/0**. | Unused live | **This pass: Nonet\* (sum === 9; odd, never a tie)** |
| One-body leftover AP↔MP | Tempo Invert (`invertApMp`, ally/self). Purse Turn (hostile one-body). Bar Cross (two-body **cross**). Duel Turn (two hostiles, independent invert, caster stays). Hymn Turn (two allies, independent invert, caster stays). Psalm Turn (one same-side non-caster + one opposite-side, independent invert, caster stays). Feud Turn (caster + one hostile, independent invert, caster participates). Kin Turn (caster + one ally, independent invert, caster participates). | Absent live | **This pass: Triad Turn (caster + one ally + one hostile, independent invert, caster participates).** Do not reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp` / `invertTwoAlliesLeftoverApMp` / `invertMixedSidesLeftoverApMp` / `invertCasterAndHostileLeftoverApMp` / `invertCasterAndAllyLeftoverApMp`. |

### 1.4 Reserved id tombstone (do not collide)

**Wave 1 tactical:**  
`spell-shoulder-bash`, `spell-hook-line`, `spell-mist-step`, `spell-grave-bell`, `spell-root-snare`, `spell-lens-shift`, `spell-ward-plate`, `spell-pain-link`, `spell-cleanse-rite`, `spell-cinder-tile`, `spell-tripwire`, `spell-glyph-tax`, `spell-stone-turret`, `spell-turret-shard`, `spell-blood-familiar`, `spell-ricochet-mark`, `spell-void-anchor`.

**Discovery Wave 1:**  
`spell-quiet-hex`, `spell-chain-ward`, `spell-crosswind`, `spell-glass-shot`, `spell-ember-wake`, `spell-split-mark`, `spell-phase-slip`, `spell-sever-tether`, `spell-overcast`, `spell-second-wind`, `spell-choir-hymn`, `spell-oath-bind`, `spell-leech-tempo`, `spell-null-brand`, `spell-false-retreat`, `spell-blood-benediction`, `spell-ward-interpose`, `spell-martyr-fuse`, `spell-hex-of-silence`. Formal blink id remains `spell-phase-slip` (never add `spell-phase-step`).

**Boss adaptations (`BOSS_AND_SPELL_DISCOVERY.md` §5.2):**  
`spell-ember-step`, `spell-caltrop`, `spell-shock-glyph`, `spell-exsanguinate`, `spell-glyph-snare`, `spell-vault`, `spell-brood-ward`, `spell-aftershock`, `spell-rot-brand`, `spell-echo-cast`.

**Wave 2 tactical / Discovery Wave 2 / Wave 3 tactical / Discovery Wave 3 / Wave 4 tactical / Discovery Wave 4 / Memory Wave 5 SDE / Wave 5–19 tactical / Discovery Waves 6–19:** reserved in Waves 2–20 documents and in #1255 §0.1. Do not collide. Memory Wave-5 SDE ids stay tombstoned (`spell-gaze-sill` … `spell-void-span`).

**Wave 20 tactical (#1251 — still open; never re-propose / never clone).** Unique remaining ids stamp as Wave-21 family CORE:  
`spell-octave-mend`, `spell-cadence-quinte`, `spell-pentadeca-span`, `spell-kin-turn`, `spell-octave-hood`, `spell-octave-sting`, `spell-octave-step`, `spell-octave-sill`, `spell-octave-hold`, `spell-octave-lend`, `spell-octave-sip`, `spell-octave-post`, `spell-octave-bounce`, `spell-must-octave`, `spell-verse-octave`, `spell-court-quinte`.

**Discovery Wave 20 (#1255 — still open; never re-propose / never clone; SDE wins Deep Gift / Cadence Sext / Deep Plate / Skew Mark / Pair Gait / Pair Plate):**  
`spell-giraffe-stride`, `spell-undeca-oath`, `spell-trip-reel`, `spell-giraffe-bite`, `spell-skew-mark`, `spell-deep-plate`, `spell-trip-skip`, `spell-pair-gait`, `spell-summon-giraffe`, `spell-deep-gift`, `spell-cadence-sext`, `spell-trip-toll`, `spell-brick-split`, `spell-watch-clip`, `spell-pair-plate`, `spell-trip-cut`, `spell-giraffe-gate`, `spell-pack-giraffe`, `spell-giraffe-fold`.

**Wave 19 tactical (#1177) / Discovery Wave 19 (#1198):** reserved in those PRs. #1198 SDE won Thin Gift / Cadence Quint / Wide Plate.

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` and `spell-blood-tithe` (tactical W2 vs Discovery W2). `spell-cadence-floor` (tactical #890 vs Discovery #906 — **SDE wins**; this pass does not add a third).

**Fantasy overlaps to not clone:** Short Sight ≈ Paper Wind; Tempo Gift ≈ Loan Tempo; Goad ≈ Taunt Oath; Rime Tile ≈ Rime Sheet; Lens Shift / Overcast; Poise Mend ≈ Equal Gift (both-body vs target equality); Tally Mend ≈ Lean Gift; Score Mend ≈ Prime Gift; Stave Mend ≈ Gait Gift; Sestet Mend ≈ Wide Gift; Septet Mend ≈ Thin Gift; Octave Mend ≈ Deep Gift (both-body sum 8 unequal vs one-body 1/≥2 — **filled, not a clone**); Cadence Floor / Prime / Rise / Snuff / Cap / Dock / Tern / Tierce / Quad / Quarte / Quint / Quinte / Sext are **filled** (Sixte is `6→0`, not Sext’s `n>6→6`); Tempo Invert ≈ Purse Turn; Purse Turn ≈ Duel Turn; Duel Turn ≈ Hymn Turn; Hymn Turn ≈ Psalm Turn; Psalm Turn ≈ Feud Turn; Feud Turn ≈ Kin Turn; Kin Turn ≈ Triad Turn (caster+ally vs caster+ally+hostile — **this pass fills the three-body card, does not clone the two-body cards**). Triad Turn is **not** Choir Hymn. Triad Turn is **not** Duel Turn. Nonet Mend is **not** Nine Span. Nonet Mend is **not** Nona Oath. Hexadeca Span is **not** Undeca Oath.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier; Dry Mend / Dry Gait / Parched Mend; Hollow Gift / Gaunt Mend; Cadence Swap / Cadence Floor / Cadence Prime / Cadence Rise / Cadence Snuff / Cadence Cap / Cadence Dock / Cadence Tern / Cadence Tierce / Cadence Quad / Cadence Quarte / Cadence Quint / Cadence Quinte / Cadence Sext.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved or live) |
| :--- | :--- | :--- |
| SUPPORT leftover-sum heal | Both-body leftover AP + leftover MP **=== 9** | Tally Mend (sum 3); Score Mend (sum 4 unequal); Stave Mend (sum 5); Sestet Mend (sum 6 unequal); Septet Mend (sum 7); Octave Mend (sum 8 unequal); Poise Mend / Equal Gift (equality, including (4,4)); Gaunt / Hollow Gift (0+0); Dry Mend / Dry Gait; Lean Gift; Prime Gift (exactly 1/1); Gait Gift (AP≥2/MP=0); Wide Gift (AP≥2/MP≥1); Thin Gift (1/0); Deep Gift (1/≥2) |
| CONTROL remaining 6→0 | Ready-six ids (`n===6`) write `0` | Snuff `1→0`; Dock `2→0`; Tierce `3→0`; Quarte `4→0`; Quinte `5→0`; Rise `1→2`; Prime `0→1`; Floor `n>1→1`; Cap `n>2→2`; Tern `n>3→3`; Quad `n>4→4`; Quint `n>5→5`; Sext `n>6→6`; Stall/Lag pad; Flush/Crack →0 |
| SUMMONS sixteen-cell occupy | Axis-aligned 4×4, counts as sixteen | Twin…Pentadeca Span |
| CONTROL caster+ally+hostile invert | Leftover AP↔MP on **three bodies**; caster participates | Tempo Invert (ally/self); Purse Turn (one hostile); Bar Cross (two-body cross); Duel Turn (two hostiles); Hymn Turn (two allies, caster stays); Psalm Turn (mixed, caster stays); Feud Turn (caster + one hostile); Kin Turn (caster + one ally) |
| DEFENSE / DAMAGE / TERRAIN nonet family | Hood / Sting / Step / Sill / Hold / Lend / Sip / Post / Bounce / Must / Verse | Octave\* / Septet\* / Sestet\* / Stave\* / Score\* / Tally\* / Poise\* / Gaunt\* / Lean\* / Dry\* |
| SIGNATURE mass Sixte | Court Sixte | Court Quinte / Court Quarte / Court Tierce / Court Dock / Court Snuff / Court Prime / Court Floor / Court Lag / Court Imprint |

**Still open after this wave (do not fill today):** mid-RAF splice; fourth walk-MP snipe; sixth echo id; player-owned Hex of Silence; player-owned About Hinge; leftover AP − leftover MP === **2** as a heal (diff window; (3,1) is Score; (4,2) is Sestet; (5,3) is Octave; Skew Mark owns the detonate); remaining `n===7` → `0`; seventeen-cell occupy; **target-only** sum===9 heal (leave for SDE); **target-only** sum===8 / sum===7 / sum===6 / sum===5 / sum===4 / sum===3 heal (still SDE leftovers; #1255 left sum===8 as a Wave-21 unique hole); leftover AP + leftover MP === **10**; invert leftover on **caster and two same-side allies** (caster + two allies; Triad Turn already spends the mixed three-body). Those stay Wave 22 so this pass stays discrete.

---

## 3. Contract with Dynamic Spell Discovery

Coordinate with Discovery (`c26e5a83-…`) and Admin (`4efa22ec-…`). This pass only stamps acquisition so those layers can filter **by field**.

### 3.1 Discovery is still inert (reconfirmed @ `0f5363f`)

1. All 32 frontend spells are forced `isBaseSpell` (`WorldExploration.tsx` 2395–2408).
2. Recap grants XP/Doka/feats only.
3. Achievements (`defaultAchievements`, `admin.mo` 309–326) grant Doka only.
4. Challenges (`DEFAULT_CHALLENGES` 44–103) grant Doka/XP/badge only.
5. `upgradeSpell` levels a known id; it does not unlock ids.
6. `ENEMY_KITS` (`enemyAI.ts` 163–185) still reuse always-owned ids. Seeing a bishop cast Frost teaches nothing.
7. `buildEnemyKit` still takes `levelZone`. Discovery already recorded that a non-number → `NaN` → every kit stays zone 0.
8. `executeCastAttempt` still does not debit `spell.mpCost`. Combined paper `mpCost > 0` remains Ley Toll / Undertow / Sanguine Toll — **no fourth**.
9. `inferArchetype` still treats any `healAmount > 0` as healer (`enemyAI.ts` 447–452). Nonet Mend **must not** land in non-healer CORE; keep `healAmount: 0` on the row.

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 21 ids to `starterSpells` as base. Do **not** land Wave-21 data before Wave-1 ownership split (`SDE-2026-08-31-001`). CDA-030 (#982) still freezes **shipping** Wave-15/16 live rows until those gates exist; this document is sequential Wave 21 **design only**.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "hexadecaspan"` / `"nonetpost"` are **string enums on the config**, not a parse of `"Hexadeca Span"` / `"Nonet Post"`.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Hexadeca Span / Nonet Post **arming** (body placed, AP spent) **is** observation. A later occupy / detonate is **not** a second observe.
- Cadence Sixte **resolve** (even if every remaining was already ≠ 6) **is** observation if AP was spent.
- Do not require “see it N times”. Wave 21 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.
- Do not stamp `survivor` (Last Ember / Last Ward). #646 / #679 / #747 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 / #1177 / #1198 / #1251 / #1255 left that feat leftover on purpose.

### 3.3 Acquisition model meanings (unchanged)

| Model | Grant when | Typical `usableByEnemy` |
| :--- | :--- | :--- |
| `ENEMY_DISCOVERY` | Witness + same-encounter win | true |
| `ELITE` | Same, elite/champion tag | true |
| `BOSS` | First victory vs listed `bossIds` | true on that boss |
| `ACHIEVEMENT` | Claim of listed achievement (plus existing Doka) | usually false |
| `CHALLENGE` | Complete listed challenge id | usually false |
| `MULTI_SOURCE` | First completed child wins; no double copy | mixed |
| `NOT_PLAYER_LEARNABLE` | Never written to owned ids | true (kit-only) |

### 3.4 Doors this pass actually stamps (avoid taken keys)

Already claimed — do not reuse as the **only** door. Live 19 first-wins, #367, #406, #463 extras, #474, #518, #525 extras, #563 extras, #590 extras, #636 extras, #646 / #679 leftovers, #695 extras, #726 extras, #747 leftovers, #753, #787 extras, #802 leftovers, #808, #836, #837 leftovers, #849 extras, #890 extras, #903, #906 leftovers, #951, #953 extras, #962 leftovers, #1004, #1011 extras, #1017 leftovers, #1063 extras, #1080, #1082 leftovers, #1132 extras, #1139, #1143 leftovers, #1170 (`trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`), #1177 extras (`septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent`), #1198 leftovers (`camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave` / `camel_precentor` / `camel_fold_regent`), #1244 (`sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`), #1251 extras (`octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` — still wait; #1302 did not take them), #1255 leftovers (`giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave` / `giraffe_precentor` / `giraffe_fold_regent`), #1302 (`shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate`).

**New proposed extra doors for the boss designer (Wave 23 sheets; not live `BOSS_IDS`; #1244 already owns Wave 21; #1302 already owns Wave 22 leftover #695/#726/#787 doors):**

| Door | Spell |
| :--- | :--- |
| `nonet_cantor` first-win | Nonet Mend MULTI child (observe+win still grants). `octave_cantor` stays Octave Mend. `septet_cantor` stays Septet Mend. Equal Gift / Lean Gift / Prime Gift / Gait Gift / Wide Gift / Thin Gift / Deep Gift have **no** extra door — do not invent `equal_cantor` / `nine_cantor` / `nona_cantor`. |
| `sixte_precentor` first-win | Cadence Sixte MULTI child. `quinte_precentor` stays Quinte. `quarte_precentor` stays Quarte. Do **not** mint `sext_precentor` / `six_precentor` / `hexa_precentor` / `sixth_precentor`. |
| `span_hexadeca` first-win | Hexadeca Span MULTI child. `span_pentadeca` stays Pentadeca Span. `span_tetradeca` stays Tetradeca Span. Do **not** mint `span_sixteen` / `span_4x4`. |
| `court_sixte_regent` kit only | Court Sixte (`NOT_PLAYER_LEARNABLE`). `court_quinte_regent` stays Court Quinte. Do **not** mint `court_six_regent` / `court_sext_regent`. |

No feat/challenge restamp. Do not stamp leftover `survivor`.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables.

Reuse from earlier waves where the meaning is identical: `requireCasterLeftoverSumEq`, `requireTargetLeftoverSumEq`.

**New keys (Wave 21 only):**

```text
nonetSumN,                              // 9; odd — never a tie; no nonetForbidEqual
nonetMendAmount,                        // Nonet Mend
sixteRemainingCdsEq6To0,                // Cadence Sixte / Court Sixte
hexadecaSpanCells, hexadecaSide,        // Hexadeca Span 4×4
invertCasterAllyAndHostileLeftoverApMp, // Triad Turn — NOT invertCasterAndAlly / invertCasterAndHostile
nonetHoodNextHit,                       // Nonet Hood
nonetLeftoverSumEq, nonetStingBonus,    // Nonet Sting
nonetStepNeedSumEq, nonetStepAdj,       // Nonet Step
nonetSillNeedSumEq, nonetSillDamage, nonetSillDuration,
nonetHoldWhileSumEq, nonetHoldDuration,
nonetLendAp, nonetLendMp, requireTargetSumEqLend,
nonetSipAp, requireTargetSumEqSip,
nonetPostDetonateDamage, nonetPostNeedSumEq,
nonetBounceNeedSumEq, nonetBounceSearchRadius, nonetBounceCount,
mustNonStrikeUnlessSumEqAndSpendsLastAp,  // Must Nonet (shared shape; nonetSumN distinguishes)
verseNonetUntilSumEq,
courtSixteExcludeCaster
```

If a key is missing, the rider does not fire. **Must Nonet reads leftover AP + leftover MP before this (their) spell’s AP is paid** — same pre-spend contract as Must Octave / Must Septet / Must Sestet / Must Stave / Must Score / Must Tally / Must Poise / Must Gaunt. Odd sum — **no `nonetForbidEqual`**.

Nested kit-only id: none. Hexadeca Span / Nonet Post are empty-kit bodies, not casters.

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Cadence Sixte’s ready-unlock of remaining-6 is paid in **currently remaining 6**, not in extra AP. Nonet Mend’s 8 is paid in **two sum===9 bars on two bodies** after a 3-AP debit (Octave Mend is the two-body sum-8-unequal cousin; Septet Mend is the two-body sum-7 cousin). Dual Keep cannot fake this window — the player (or Haste / Tempo Gift / Septet Lend / a 9 AP / 3 MP bar after a 3-AP spend) has to actually sit on nine.

Do **not** put Must Nonet in the same CORE as a Strike-only nonet lock (this pass does not ship that lock). Do **not** CORE Nonet Hood with Spent Plate, Gait Plate, Dual Plate, Prime Plate, Thin Plate, Wide Plate, Deep Plate, Pair Plate, Poise Hood, Tally Hood, Score Hood, Stave Hood, Sestet Hood, Septet Hood, or Octave Hood. Do **not** CORE Nonet Mend with Hollow Gift, Gaunt Mend, Poise Mend, Equal Gift, Tally Mend, Score Mend, Stave Mend, Sestet Mend, Septet Mend, Octave Mend, Lean Gift, Prime Gift, Gait Gift, Wide Gift, Thin Gift, or Deep Gift. Do **not** CORE Triad Turn with Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, Psalm Turn, Feud Turn, or Kin Turn. Do **not** CORE Cadence Sixte with Cadence Sext, Quinte, Quint, Quarte, Tierce, Dock, Snuff, Tern, Quad, Rise, Prime, Floor, Cap, Halve, Trim, Crack, or Flush.

---

## 5. Proposed spells (Wave 21)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-nonet-mend`

NAME: Nonet Mend  
ROLE: SUPPORT — heal if caster **and** target leftover AP + leftover MP **=== 9**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"requireCasterLeftoverSumEq":true,"requireTargetLeftoverSumEq":true,"nonetSumN":9,"nonetMendAmount":8}`. If **both** caster and target have leftover AP + leftover walk MP **=== 9** at resolve (after this spell’s 3 AP is paid), heal the target 8 through the existing heal helper. If either sum ≠ 9, fizzle rider (AP spent, no HP). Walk / force-move flags do **not** substitute. Distinct from Octave Mend (#1251, **both bodies leftover AP + leftover MP === 8 AND leftover AP ≠ leftover MP**), Septet Mend (#1177, **both bodies leftover AP + leftover MP === 7**), Sestet Mend (#1132, **both bodies leftover AP + leftover MP === 6 AND leftover AP ≠ leftover MP**), Stave Mend (#1063, **both bodies leftover AP + leftover MP === 5**), Score Mend (#1011, **both bodies leftover AP + leftover MP === 4 AND leftover AP ≠ leftover MP**), Tally Mend (#953, **both bodies leftover AP + leftover MP === 3**), Poise Mend (#890, **both bodies leftover AP === leftover MP ≥ 1** — **(4,4) is Poise**, not Nonet), Equal Gift (#906, **target only** leftover AP == leftover MP ≥ 1; caster leftover unread), Prime Gift (#1017, **target leftover AP exactly 1 AND leftover MP exactly 1**), Gait Gift (#1082, **one body leftover AP ≥ 2 AND leftover MP = 0** — (9,0) is Gait Gift **and** a Nonet pair; Nonet Mend still requires **both** bodies), Wide Gift (#1143, **one body leftover AP ≥ 2 AND leftover MP ≥ 1** — (8,1) (7,2) (6,3) (5,4) are Wide Gift **and** Nonet pairs; Nonet Mend still requires **both** bodies), Thin Gift (#1198, **one body leftover AP === 1 AND leftover MP === 0** — no Nonet pair), Deep Gift (#1255, **one body leftover AP === 1 AND leftover MP ≥ 2** — (1,8) is Deep Gift **and** a Nonet pair; Nonet Mend still requires **both** bodies), Hollow Gift (#837, **target only** leftover AP=0 **and** leftover MP=0), Gaunt Mend (#849, **both bodies leftover AP=0 and leftover MP=0**), Lean Gift (#962, leftover **AP = 0 and leftover MP ≥ 1** — (0,9) is Lean Gift **and** a Nonet pair), Dry Mend (#747, both leftover **AP = 0**, MP unconstrained), Dry Gait (#802, both leftover **MP = 0**, AP unconstrained), Ready Sting (leftover AP≥1 **and** MP≥1 with **no sum**), Tied Gait (#906, leftover AP **and** leftover MP **exactly 2**), Dual Plate (#1017, leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** — (4,4) is Dual Plate **and** Poise, **not** Nonet). Legal pairs: (9,0) (0,9) (8,1) (1,8) (7,2) (2,7) (6,3) (3,6) (5,4) (4,5). The decision: two bodies **sum to 9** — Dual Keep 2/2 is Poise **and** Score-blocked, **not** Nonet (sum 4); Dual Keep **cannot** open Nonet; a 6 AP / 3 MP bar that pays this 3 AP lands at **(3,3)** and **fails** (that is Poise Mend’s window); a 7 AP / 3 MP bar that pays 3 AP lands at **(4,3)** and **fails** (that is Septet Mend’s window); a 8 AP / 3 MP bar that pays 3 AP lands at **(5,3)** and **fails** (that is Octave Mend’s window); a 9 AP / 3 MP bar that pays 3 AP lands at **(6,3)** and **fires**; sit on 9 leftover AP and 3 leftover MP after paying the heal, or Septet Lend a (4,3) into (5,4). `healAmount` stays 0 on the row so `inferArchetype` (`enemyAI.ts` 447–452) does not treat a kit that only *carries* this id as healer; **healer CORE only** when the row is in a live pool. Odd sum — **never a tie. No `nonetForbidEqual`.**  
DURATION: instant  
SCALING: 8 follows heal% if any; amount otherwise fixed.  
SYNERGIES: Haste / Tempo Gift / Timestep to bank nine after the 3-AP spend; Septet Lend **manufactures** Nonet ((4,3)→(5,4)); Nonet Lend **exits** to 11; Triad Turn **keeps** sum 9 on a body that was already in-window.  
COUNTERPLAY: Spend a pool so either body leaves 9; Dual Keep (caps at 2, **blocks** Nonet); sit on 4/4 (Poise) or 5/3 (Octave) or 4/3 (Septet) or 4/2 (Sestet) or 3/3 (Poise) or 3/2 (Stave) or 3/1 (Score) or 2/1 (Tally) or 2/2 (Poise) or 1/1 (Prime Gift).  
POWER_BUDGET: Standard heal, gated on **two** leftover sums of 9 (four leftover reads). Blood Mend is 12 ungated self. Octave Mend is 8 on **two sum-8 unequal** bodies. Septet Mend is 8 on **two sum-7** bodies. Dual Keep cannot fake this.  
AI_USAGE: `aiHint: "heal_if_both_bodies_leftover_ap_plus_mp_eq_9"`. Cantors / bishops. Skip if either leftover sum ≠ 9. **Healer CORE only.** Do not dump leftover **only** to enable this if a Strike would kill.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop","queen"], levelZoneMin: 1 }`. MULTI child `nonet_cantor`.  
EDGE_CASES: Targeting ally already allows self (`targeting.ts` 184–189). Self-cast requires the caster’s leftover sum === 9 (two keys, two reads of one body). Self-cast at leftover 4/4 **does not** collide with Poise Mend / Equal Gift — sum 8 fails `nonetSumN`. Self-cast at leftover 5/3 **does not** collide with Octave Mend — sum 8 fails `nonetSumN`. Self-cast at leftover 4/3 **does not** collide with Septet Mend — sum 7 fails `nonetSumN`. Self-cast at leftover 4/2 **does not** collide with Sestet Mend — sum 6 fails `nonetSumN`. Self-cast at leftover 0/0 **does not** collide with Hollow Gift / Gaunt Mend — sum 0 fails `nonetSumN`. Self-cast at leftover 9/0 **does** fire, and is **not** a Gait Gift clone (Gait Gift is one-body AP≥2/MP=0 with no second-body read). Self-cast at leftover 5/4 **does** fire, and is **not** a Wide Gift clone. Self-cast at leftover 1/8 **does** fire, and is **not** a Deep Gift clone (Deep Gift is one-body AP===1/MP≥2 with no second-body read). Player-side HP actually increased → `challengeHealUsedRef`. Missing keys → no heal. Missing `nonetSumN` → fail closed. Do not clone Octave Mend / Septet Mend / Sestet Mend / Stave Mend / Score Mend / Tally Mend / Poise Mend / Equal Gift / Gaunt Mend / Lean Gift / Prime Gift / Gait Gift / Wide Gift / Thin Gift / Deep Gift / Dry Mend / Dry Gait. Target-only sum===9 heal stays Wave 22 / SDE. Target-only sum===8 stays SDE (#1255 leftover). If same-day SDE Wave 21 claims this leftover, **SDE wins** — keep both-body vs their target-only the way Octave vs Deep Gift / Septet vs Thin Gift already split. Do not mint `spell-nine-mend` (Nine Span is occupy-weight 9). Do not mint `spell-nona-mend` (Nona Oath is Chebyshev = 9).  
IMPLEMENTATION_COMPLEXITY: LOW — four leftover reads + existing heal helper.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-nonet-mend
effectType: heal
effectCategory: heal
targetType: ally
areaShape: single
apCost: 3
mpCost: 0
damage: 0
healAmount: 0
range: 3
cooldown: 2
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
acquisitionModel: MULTI_SOURCE
discoveryEligible: true
effectParams: {"requireCasterLeftoverSumEq":true,"requireTargetLeftoverSumEq":true,"nonetSumN":9,"nonetMendAmount":8}
```

---

### SPELL_ID: `spell-cadence-sixte`

NAME: Cadence Sixte  
ROLE: CONTROL — remaining CDs `n===6` become `0`  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"sixteRemainingCdsEq6To0":true}`. For each spell id in the **target’s** remaining-CD map with `n === 6`, write `0`. Zeros stay 0. Remaining `n===1` **unchanged** (Snuff’s window). Remaining `n===2` **unchanged** (Dock’s window). Remaining `n===3` **unchanged** (Tierce’s window). Remaining `n===4` **unchanged** (Quarte’s window). Remaining `n===5` **unchanged** (Quinte’s window). Remaining `n>6` **unchanged** (Sext / Quint / Quad / Tern / Cap / Floor territory). Target **keeps every spell**. Once/battle flags and spell levels are **not** CDs. Distinct from Cadence Sext (#1255, remaining `n>6` → `6` — **sixes stay 6**), Cadence Quinte (#1251, remaining `n===5` → `0` — fives, not sixes), Cadence Quint (#1198, remaining `n>5` → `5` — **sixes become 5**, not 0), Cadence Quarte (#1177, remaining `n===4` → `0` — fours, not sixes), Cadence Tierce (#1132, remaining `n===3` → `0`), Cadence Dock (#1063, remaining `n===2` → `0`), Cadence Snuff (#1011, remaining `n===1` → `0`), Cadence Quad (#1143, remaining `n>4` → `4` — **sixes become 4**, not 0), Cadence Tern (#1082, remaining `n>3` → `3` — **sixes become 3**, not 0), Cadence Cap (#1017, remaining `n>2` → `2` — **sixes become 2**, not 0), Cadence Rise (#962, remaining `n===1` → `2`), Cadence Prime (#953, remaining `n===0` → `1`), Cadence Floor (#906, remaining `n>1` → `1`; **zeros stay 0**; would peel a 6 to 1, **not** to 0), Cadence Swap (#837, **exchange full remaining maps**), Cadence Lag (#849, remaining `n>0` → `n+2`), Cadence Stall (#590, remaining `n>0` → `n+1`; zeros stay 0), Cadence Stretch (#636, remaining ×2), Cadence Theft (#411, **steals** remaining), Cadence Imprint (#787, **copies** onto the caster; target keeps), Cadence Rest (#747, **own** remaining do not tick), Cadence Grace (#802, **next own spell does not start** its cooldown), Cadence Halve (#726, **÷2** on the hostile), Cadence Trim / Shave / Pin / Crack / Flush. The decision: their Inferno is sitting on remaining 6 — Sixte makes it legal **this turn**; Quinte would have needed remaining 5; Sext would have **left** a 6; Quint would have written 5; Quad would have written 4; Tern would have written 3; Cap would have written 2; Floor would have written 1.  
DURATION: instant rewrite of remaining `n===6`  
SCALING: none.  
SYNERGIES: Sext a 8 to 6, **then** Sixte the 6 to 0 on a **later** turn (do **not** CORE Sext with Sixte). Verse Nonet so the unlocked id is also their last verse.  
COUNTERPLAY: Sit remaining at 1 (Snuff’s problem) or at 2 (Dock’s problem) or at 3 (Tierce’s problem) or at 4 (Quarte’s problem) or at 5 (Quinte’s problem) or at 7+ (Sext / Quint / Quad / Tern / Cap / Floor’s problem); recast before Sixte; Cadence Break your own remaining.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **unlock remaining-6**, not a silence and not a mass zero.  
AI_USAGE: `aiHint: "sixte_remaining_cds_eq_6_to_0"`. Scribes / tempo. Skip if the target has no remaining `n===6`. Do **not** CORE with Sext / Quinte / Quint / Quarte / Tierce / Dock / Snuff / Quad / Tern / Cap / Floor / Rise / Prime.  
DISCOVERY_ELIGIBILITY: true. MULTI child `sixte_precentor`. `pieceTypes: ["bishop","queen"], levelZoneMin: 1`  
EDGE_CASES: Missing key → no rewrite. Do not write `spellLevelValues`. Do not reset Dual Keep’s once/battle. Preview must show which remaining drop from 6 to 0. All-non-6 remaining → fizzle rider (AP spent, observe). Do **not** reuse `quinteRemainingCdsEq5To0` / `quarteRemainingCdsEq4To0` / `tierceRemainingCdsEq3To0` / `dockRemainingCdsEq2To0` / `snuffRemainingCdsEq1To0` / `capRemainingCdsAbove2To2` / `capRemainingCdsAbove3To3` / `floorRemainingCdsTo1` / `primeRemainingCdsFrom0`. Do **not** mint `spell-cadence-sext` (SDE #1255 owns that as `n>6→6`). Do **not** mint `spell-cadence-six` / `spell-cadence-hexa` / `spell-cadence-sice` / `spell-cadence-sixth` (#1255 tombstone). If same-day SDE Wave 21 claims this leftover, **SDE wins** — do not keep a second Sixte id. Sext already owns `n>6→6`; this card is `6→0` even if SDE later stamps a second Sext alias.  
IMPLEMENTATION_COMPLEXITY: LOW — walk remaining map, write 0 when n===6.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-cadence-sixte
effectType: debuff
effectCategory: cc
targetType: enemy
areaShape: single
apCost: 3
mpCost: 0
damage: 0
range: 3
cooldown: 2
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
acquisitionModel: MULTI_SOURCE
discoveryEligible: true
effectParams: {"sixteRemainingCdsEq6To0":true}
```

---

### SPELL_ID: `spell-hexadeca-span`

NAME: Hexadeca Span  
ROLE: SUMMONS — axis-aligned 4×4 occupy; counts as **sixteen**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 4  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "hexadecaspan"`, `summonLifespan: 4`, empty kit (`summonUnitDef` with `pieceType: ""` / zero scales — a body, not a caster). `effectParams: {"hexadecaSpanCells":16,"hexadecaSide":4}`. Click a free ground tile. That click is the cell of the 4×4 **nearest to the caster** (Dec Span / Dodeca Span / Tetradeca Span’s placement rule, **not** Hendeca / Trideca / Pentadeca’s center rule). Occupy an axis-aligned **4×4** square of which the clicked cell is the cell closest to the caster; the square extends away from the caster along both axes. A 4×4 has **no unique center cell** (even side) — that is why this card uses nearest-cell, not center. Footprint is 16 cells. All 16 cells must be free and in-bounds (`isCellFree`); else fizzle (AP spent). One combatant id, sixteen-cell footprint. Every cell of the 16 is occupied (not a cage hole — Oct Span’s hollow 3×3 stays Oct Span). Counts as **sixteen** toward the summon cap. Distinct from Pentadeca Span (#1251, stretched plus **longArm 4 / shortArm 3** = 15, click = **center**), Tetradeca Span (#1177, axis-aligned **2×7** = 14, click = **nearest cell to caster**), Trideca Span (#1132, orthogonal plus **arm 3** = 13, click = **center**), Dodeca Span (#1063, axis-aligned **3×4** = 12, click = **nearest cell to caster**), Hendeca Span (#1011, stretched plus longArm 3 / shortArm 2 = **11**, click = **center**), Dec Span (#953, axis-aligned **2×5** = 10, click = nearest cell), Nine Span (#890, solid 3×3 = 9, click = center), Oct Span (#849, hollow 3×3 = 8), Sept Span (#726, stretched plus longArm 2 / shortArm 1 = 7), Penta Span (plus arm 1 = 5), Six Span (2×3 = 6), Quad Span (2×2 = 4), Triple / Twin Span. Empty kit.  
DURATION: lifespan 4 or until the body dies (frees all sixteen)  
SCALING: none (occupy, not damage).  
SYNERGIES: Nonet Hold so they cannot walk around the square; Score / Tally / Stave / Sestet / Septet / Octave / Nonet Sill on a cell **beside** the block, not on it (occupied).  
COUNTERPLAY: Coup the body; blink past; File Lance along an edge; occupy-weight still 2 live so this card **does not ship** until a dedicated occupy-weight exists.  
POWER_BUDGET: Heavy 4 / CD 3 / 0 damage. Power is **sixteen occupied cells**. Implementation-blocked while `ENEMY_SUMMON_CAP === 2`.  
AI_USAGE: `aiHint: "hexadeca_span_if_4x4_free_and_cuts_a_file"`. Masons / rooks ELITE. Skip if any of the 16 is occupied / off-map / a portal. Missing hint → drop id.  
DISCOVERY_ELIGIBILITY: true. MULTI child `span_hexadeca`. `pieceTypes: ["rook"], levelZoneMin: 2`  
EDGE_CASES: **Do not ship while `ENEMY_SUMMON_CAP === 2` without occupy-weight.** Never parse `"Hexadeca Span"` / `"Sixteen"` / `"4x4"`. One id, sixteen cells — destroying the body frees all sixteen. Player-side Hexadeca Span counts toward the **player** summon economy, not `ENEMY_SUMMON_CAP`. Missing `hexadecaSpanCells` → do not spawn a 1-cell body and call it Hexadeca Span. Missing `hexadecaSide` → do not guess 2×8 (that is a different sixteen), 2×7 (that is Tetradeca Span), 3×4 (that is Dodeca Span), or stretched plus longArm 4 / shortArm 3 (that is Pentadeca Span). Off-map cell → fizzle. Do not mint `spell-sixteen-span` / `spell-hexakaideca-span` / `spell-4x4-span` / `spell-plus-span`. Cardinal click with `dx===0 && dy===0` is illegal (`freeCells` / caster tile) — the nearest cell cannot be the caster’s cell. Click is **nearest cell to caster**, not center (Pentadeca’s center stays Pentadeca; a 4×4 **has no unique center**). Do not alias Nine Span (`spell-nine-span`, occupy-weight 9) or Quad Span (`spell-quad-span`, occupy-weight 4). Do not alias Undeca Oath (`spell-undeca-oath`, Chebyshev = 11 spell gate).  
IMPLEMENTATION_COMPLEXITY: HIGH — occupy-weight + 4×4 placer. Same class as Dodeca / Tetradeca / Pentadeca.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-hexadeca-span
effectType: summon
effectCategory: defense
spellType: summon
targetType: ground
areaShape: single
apCost: 4
mpCost: 0
damage: 0
range: 3
cooldown: 3
freeCells: true
isSummon: true
summonAI: hexadecaspan
summonLifespan: 4
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
acquisitionModel: MULTI_SOURCE
discoveryEligible: true
effectParams: {"hexadecaSpanCells":16,"hexadecaSide":4}
```

---

### SPELL_ID: `spell-triad-turn`

NAME: Triad Turn  
ROLE: CONTROL — invert leftover AP↔MP on **the caster, one same-side non-caster ally, and one opposite-side hostile**; caster participates  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. **Not** `isSwap`. `effectParams: {"invertCasterAllyAndHostileLeftoverApMp":true,"triadAllySearchRadius":3}`. Target one living **opposite-side** hostile. Auto-pick the nearest living **same-side non-caster** ally within Chebyshev `triadAllySearchRadius` of **the caster** (not of the hostile). Snapshot leftover AP and leftover MP on **the caster, that ally, and that hostile**, then write leftover AP ← leftover MP and leftover MP ← leftover AP on **each** of the three bodies independently, each **capped at that pool’s max**. Caster leftover **does change**. Caster does not move. If no living same-side non-caster ally is in the search radius, fizzle rider (AP spent, no invert). Distinct from Kin Turn (#1251, **caster + one same-side ally only**, via `invertCasterAndAllyLeftoverApMp` — **do not reuse that key**; this card’s third body is a **hostile**), Feud Turn (#1177, **caster + one opposite-side hostile only**, via `invertCasterAndHostileLeftoverApMp` — **do not reuse that key**; this card’s third body is an **ally**), Psalm Turn (#1132, **one same-side non-caster + one opposite-side**, caster **unchanged**, via `invertMixedSidesLeftoverApMp` — **do not reuse that key**; this card’s caster **does** invert and a third body is included), Hymn Turn (#1063, **two same-side non-caster allies** independent invert, caster **unchanged**, via `invertTwoAlliesLeftoverApMp` — **do not reuse that key**), Duel Turn (#1011, **two hostiles** independent invert via `invertTwoHostilesLeftoverApMp` — **do not reuse that key**), Purse Turn (#953, **one** hostile invert via `invertHostileLeftoverApMp` — **do not reuse that key**; caster unchanged), Tempo Invert (#282, **one-body ally/self** leftover AP↔MP via `invertApMp` — **do not reuse that key**), Bar Cross (#890, **two-body leftover cross**: caster AP ↔ target MP **and** caster MP ↔ target AP via `crossLeftoverApMpTwoBody` — **do not reuse that key**; that **exchanges across bodies**, this **inverts each body independently**), Dual Keep (banks leftover AP **and** MP on **one** body, no invert), Swap / Pawn Trade (tiles, not pools), Choir Hymn (Wave-1 Discovery heal — **do not alias**). Player-side summons **are** legal ally bodies (same-side).  
DURATION: instant leftover rewrite; no snap-back at turn end  
SCALING: none.  
SYNERGIES: Nonet Mend / Nonet Sting after the invert **keeps** sum 9 on a body that was already in-window; Octave Mend after you invert a (5,4) caster with a (5,3) hostile (caster stays Nonet, hostile stays Octave). Must Nonet after you dump their AP into MP.  
COUNTERPLAY: Keep leftover AP === leftover MP on all three so all inverts are no-ops; isolate (no ally in r3); Quiet Hex after they invert into a 3-AP spell; sit the caster on a window they did not want to leave.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **three independent leftover flips including the caster**, not a swap, not Kin Turn (no hostile), not Feud Turn (no ally), not Psalm Turn (caster stays, only two bodies), and not Bar Cross (cross-body exchange).  
AI_USAGE: `aiHint: "triad_turn_if_ally_in_r3_and_hostile_in_r3_and_at_least_one_of_three_is_unequal"`. Hex / queens. Skip if both the ally search and the hostile would make every invert a no-op (all three already AP===MP) or if no non-self ally is in range.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"], levelZoneMin: 1`  
EDGE_CASES: Missing `invertCasterAllyAndHostileLeftoverApMp` → fail closed (do **not** invert only the hostile and become Feud Turn; do **not** invert only the ally and become Kin Turn; do **not** skip the caster and become Psalm Turn). Missing `triadAllySearchRadius` → fail closed. No ally in radius → fizzle rider (AP spent, observe). Three-body ties for nearest ally: nearest Chebyshev, then lowest id. Invert (5,4)→(4,5) **stays Nonet**. Invert (9,0)→(0,9) **stays Nonet**. Invert (8,1)→(1,8) **stays Nonet**. Invert (6,3)→(3,6) **stays Nonet**. Invert (5,3)→(3,5) **stays Octave**. Invert (4,4) is a no-op (Poise stays Poise). Invert (4,3)→(3,4) **stays Septet**. Invert (4,2)→(2,4) **stays Sestet**. Do **not** reuse `invertCasterAndAllyLeftoverApMp` / `invertCasterAndHostileLeftoverApMp` / `invertMixedSidesLeftoverApMp` / `invertTwoAlliesLeftoverApMp` / `invertTwoHostilesLeftoverApMp` / `crossLeftoverApMpTwoBody`. If same-day SDE Wave 21 claims this leftover, **SDE wins**. Do not mint `spell-choir-turn` / `spell-pew-turn` / `spell-trio-turn` / `spell-trine-turn` / `spell-trial-turn` / `spell-mass-turn` / `spell-duet-turn` / `spell-aisle-turn` / `spell-mixed-turn` / `spell-self-ally-foe-turn`. Solo caster with no living same-side non-caster in range **does not** fire (unlike Feud Turn, which needs only a hostile).  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — three leftover snapshots + three writes + nearest-ally search. Same class as Feud Turn / Kin Turn with a third-body filter.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-triad-turn
effectType: buff
effectCategory: cc
targetType: enemy
areaShape: single
apCost: 3
mpCost: 0
damage: 0
range: 3
cooldown: 2
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
isSwap: false
acquisitionModel: ENEMY_DISCOVERY
discoveryEligible: true
effectParams: {"invertCasterAllyAndHostileLeftoverApMp":true,"triadAllySearchRadius":3}
```

---

### SPELL_ID: `spell-nonet-hood`

NAME: Nonet Hood  
ROLE: DEFENSE — next applied hit is 0 iff leftover AP + leftover MP **=== 9**  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"nonetHoodNextHit":true,"nonetSumN":9}`. Arm a one-hit consume: the next applied hit on the caster is 0 **if at impact** leftover AP + leftover MP **=== 9**. Any Chebyshev. The charge remains if the hit arrives while the sum ≠ 9 (hit lands fully; charge stays). Distinct from Octave Hood (#1251, leftover AP + leftover MP === 8 **and unequal**), Septet Hood (#1177, leftover AP + leftover MP === 7), Sestet Hood (#1132, leftover AP + leftover MP === 6 **and unequal**), Stave Hood (#1063, leftover AP + leftover MP === 5), Score Hood (#1011, leftover AP + leftover MP === 4 **and unequal**), Tally Hood (#953, leftover AP + leftover MP === 3), Poise Hood (#890, leftover AP === leftover MP ≥ 1 — **(4,4) is Poise Hood**), Dual Plate (#1017, leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**), Prime Plate (#1082, leftover **1/1**), Thin Plate (#1143, leftover **1/0**), Wide Plate (#1198, leftover **AP ≥ 2 AND MP ≥ 1** — (8,1) (7,2) (6,3) (5,4) are Wide Plate **and** Nonet pairs; Nonet Hood still requires **the sum === 9**, not the inequality-free AP≥2/MP≥1 window), Deep Plate (#1255, leftover **AP === 1 AND MP ≥ 2** — (1,8) is Deep Plate **and** a Nonet pair; Nonet Hood still requires the **sum === 9**), Pair Plate (#1255, leftover **exactly 2/0** — no Nonet pair), Spent Plate (#837, leftover **AP ≥ 1**, MP unconstrained), Gait Plate (#802, leftover **MP ≥ 1**, AP unconstrained), Dry Plate (#962, leftover **MP = 0**), Even Hood (#849, **even Chebyshev**), Odd Hood (odd Chebyshev), Near / Mid / Far Hood (range bands), Odd Plate (#906, leftover **AP odd**), Fresh Plate (#1198, leftover AP **equals max**). The decision: hold (5,4) through the hit — Dual Keep 2/2 is Poise Hood / Dual Plate, **not** this — or spend into 5/3 and Octave Hood still works, this does not. Do **not** CORE with Spent Plate, Gait Plate, Dual Plate, Prime Plate, Thin Plate, Wide Plate, Deep Plate, Pair Plate, Poise Hood, Tally Hood, Score Hood, Stave Hood, Sestet Hood, Septet Hood, or Octave Hood.  
DURATION: until consumed at a sum===9 impact, or battle end  
SCALING: none (negate, not a RES%).  
SYNERGIES: Haste to bank nine; Triad Turn a (9,0) caster into (0,9) still Nonet Hood; Nonet Hold so they cannot walk you off 9.  
COUNTERPLAY: Wait until they spend a pool; Coup; hit them on 5/3 (Octave Hood) or 4/4 (Poise Hood / Dual Plate) or 4/3 (Septet Hood) or 4/2 (Sestet Hood).  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **one hit while sitting on nine**. Dual Keep cannot fake it.  
AI_USAGE: `aiHint: "nonet_hood_if_self_leftover_sum_eq_9"`. Lurkers / knights ELITE. Skip if leftover sum ≠ 9.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"], levelZoneMin: 2`  
EDGE_CASES: Missing `nonetSumN` → fail closed. Leftover 5/3 at impact → hit lands (Octave Hood). Leftover 4/4 at impact → hit lands (Poise Hood / Dual Plate). Leftover 4/3 at impact → hit lands (Septet Hood). Leftover 4/2 at impact → hit lands (Sestet Hood). Leftover 1/8 at impact → miss **does** consume (sum 9), and is **not** a Deep Plate clone (Deep Plate is the 1/≥2 window with no sum key). Do **not** retag `even_gallery`.  
IMPLEMENTATION_COMPLEXITY: LOW — one leftover-sum gate on the next applied hit.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-nonet-sting`

NAME: Nonet Sting  
ROLE: DAMAGE — 10, plus 8 if target leftover AP + leftover MP **=== 9**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. Then if the target’s leftover AP + leftover MP **=== 9**, deal `nonetStingBonus` (8) as a second existing `dealDamage` call. `effectParams: {"nonetLeftoverSumEq":true,"nonetSumN":9,"nonetStingBonus":8}`. Distinct from Octave Sting (#1251, leftover AP + leftover MP === 8 **and unequal**), Septet Sting (#1177, leftover AP + leftover MP === 7), Sestet Sting (#1132, leftover AP + leftover MP === 6 **and unequal**), Stave Sting (#1063, leftover AP + leftover MP === 5), Score Sting (#1011, leftover AP + leftover MP === 4 **and unequal**), Tally Sting (#953, leftover AP + leftover MP === 3), Poise Sting (#890, leftover AP === leftover MP ≥ 1), Gaunt Sting (#849, leftover **both 0**), Lean / Dry / Ready / Full / Even Sting (#962, leftover AP **even and ≥ 2**), Fresh Sting (#1017), Capped Sting (#1082, leftover MP **equals max MP**), Wide Sting (#1143), Hollow Sting (#1198, leftover **both 0** damage), Pair Gait (#1255, leftover **exactly 2/0**), Lean Gait (#1198, leftover AP === 0 AND MP ≥ 1), Odd Sting (#906, leftover **AP odd**), Tied Gait (#906, both leftover **exactly 2**). The decision: poke the (5,4) bishop for 18, or poke anyone for 10. Dual Keep 2/2 is the **wrong** window (Poise Sting). Dual Keep cannot open this. (5,3) is Octave Sting, not this. (4,4) is Poise Sting, not this. (4,3) is Septet Sting, not this. (4,2) is Sestet Sting, not this.  
DURATION: instant  
SCALING: 10 / 8 follow damage%.  
SYNERGIES: Triad Turn a (9,0) into (0,9) still Nonet; Nonet Hold so they cannot walk the MP off.  
COUNTERPLAY: Sit on 5/3 (Octave Sting) or 4/4 (Poise Sting) or 4/3 (Septet Sting) or 4/2 (Sestet Sting) or 3/2 (Stave Sting) or 3/1 (Score Sting) or 2/1 (Tally Sting) or 0/0 (Gaunt Sting / Hollow Sting).  
POWER_BUDGET: Cheap 2 / CD 1. 10 ungated + 8 on a sum of 9.  
AI_USAGE: `aiHint: "nonet_sting_if_target_leftover_sum_eq_9"`. Lurkers / pawns. Skip the bonus path if leftover sum ≠ 9; 10 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"], levelZoneMin: 1`  
EDGE_CASES: Missing bonus keys → 10 only. Target leftover 5/3 → no bonus (Octave Sting). Target leftover 4/4 → no bonus (Poise Sting). Target leftover 4/3 → no bonus (Septet Sting). Target leftover 4/2 → no bonus (Sestet Sting). Target leftover 3/2 → no bonus (Stave Sting). Target leftover 3/1 → no bonus (Score Sting). Target leftover 3/0 → no bonus (Tally Sting). Do not name-wire the bonus.  
IMPLEMENTATION_COMPLEXITY: LOW — one leftover-sum gate + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-nonet-step`

NAME: Nonet Step  
ROLE: POSITION — relocate to Chebyshev 1 of an ally whose leftover AP + leftover MP **=== 9**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `freeCells` on the dest. `effectParams: {"nonetStepNeedSumEq":true,"nonetSumN":9,"nonetStepAdj":1}`. Target an ally (not self) whose leftover AP + leftover MP **=== 9**. The caster **relocates** to a free cell at Chebyshev 1 of that ally (player picks the dest among legal neighbors; AI picks the safest). If the ally is not in the window or no neighbor is free, fizzle (AP spent, no move). Distinct from Octave Step (#1251, ally leftover sum === 8 **and unequal**), Septet Step (#1177, ally leftover sum === 7), Sestet Step (#1132, ally leftover sum === 6 **and unequal**), Stave Step (#1063, ally leftover sum === 5), Score Step (#1011, ally leftover sum === 4 **and unequal**), Tally Step (#953, ally leftover sum === 3), Poise Step (#890, ally leftover AP === leftover MP ≥ 1), Gaunt Step (#849, ally leftover **both 0**), Home / Heave / Parched / Ally Step, Hinge Step, Relay Dash. The decision: blink next to the (0,9) wisp — they have walk, you have position — or wait for a 5/3 and Octave Step, or a 4/4 and Poise Step, or a 4/3 and Septet Step. Dual Keep cannot open this.  
DURATION: instant relocate  
SCALING: none.  
SYNERGIES: Nonet Sill on a neighbor so they eat 8 at dawn if they stay on 9; Triad Turn keeps an ally in-window; Septet Lend manufactures the ally’s Nonet.  
COUNTERPLAY: Spend the wisp’s pool; occupy every neighbor; Coup; sit the wisp on 5/3 or 4/4.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **blink to a nine-bar ally**.  
AI_USAGE: `aiHint: "nonet_step_if_ally_leftover_sum_eq_9_and_a_neighbor_is_free"`. Porters / queens. Skip if no in-window ally or no free neighbor.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen"], levelZoneMin: 1`  
EDGE_CASES: Self-target forbidden (`nonetStep` is not a self blink — that is Mist Step / Phase Slip). Missing keys → no move. Ally leftover 5/3 → fizzle (Octave Step). Ally leftover 4/4 → fizzle (Poise Step). Ally leftover 4/3 → fizzle (Septet Step). Ally leftover 4/2 → fizzle (Sestet Step). Ally leftover 3/2 → fizzle (Stave Step). Ally leftover 3/1 → fizzle (Score Step). Portal dest illegal (`isCellFree`).  
IMPLEMENTATION_COMPLEXITY: LOW — leftover-sum gate + existing relocate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-nonet-sill`

NAME: Nonet Sill  
ROLE: TERRAIN — start-of-their-turn occupy tax iff leftover AP + leftover MP **=== 9**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell for 2 turns. `effectParams: {"nonetSillNeedSumEq":true,"nonetSumN":9,"nonetSillDamage":8,"nonetSillDuration":2}`. At the **start of a combatant’s turn**, if they occupy this cell and leftover AP + leftover MP **=== 9**, deal 8 through `updateCombatant`. Walk-enter does **not** tax (Ingress / Shove Sting). End-turn occupy does **not** tax (Nonet Post / Dwell). Relocate landing does **not** tax (Drift Post). Distinct from Octave Sill (#1251, leftover sum === 8 **and unequal** at start), Septet Sill (#1177, leftover sum === 7 at start), Sestet Sill (#1132, leftover sum === 6 **and unequal** at start), Stave Sill (#1063, leftover sum === 5 at start), Score Sill (#1011, leftover sum === 4 **and unequal** at start), Tally Sill (#953, leftover sum === 3 at start), Poise Sill (#890, leftover AP === leftover MP ≥ 1 at start), Gaunt Sill (#849, leftover **both 0** at start), Wake Mark (start-turn any leftover), Quiet / Cast / Drift / Parched Sill. The decision: stand on the sill at (5,4) and eat 8 at dawn, or spend a pool overnight, or sit on 5/3 and eat Octave Sill instead, or sit on 4/4 and eat Poise Sill, or sit on 4/3 and eat Septet Sill. Dual Keep overnight **cannot** leave them on 9.  
DURATION: 2 turns of paint  
SCALING: 8 follows damage% if any; otherwise fixed.  
SYNERGIES: Nonet Hold so they cannot walk off overnight; Triad Turn keeps sum 9 through dawn.  
COUNTERPLAY: Walk off (start-turn only); spend a pool; blink; dump to 5/3 or 4/4.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 upfront. Power is **dawn tax on a sum of 9**.  
AI_USAGE: `aiHint: "nonet_sill_if_foe_will_start_turn_sum_eq_9_on_tile"`. Masons / rooks. Skip if they will not start on 9.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"], levelZoneMin: 1`  
EDGE_CASES: Paint on a portal → fizzle (`isCellFree`). Occupant leftover 5/3 at dawn → no tax (Octave Sill). Occupant leftover 4/4 at dawn → no tax (Poise Sill). Occupant leftover 4/3 at dawn → no tax (Septet Sill). Occupant leftover 4/2 at dawn → no tax (Sestet Sill). Occupant leftover 3/2 at dawn → no tax (Stave Sill). Occupant leftover 3/1 at dawn → no tax (Score Sill). Occupant leftover 3/0 at dawn → no tax (Tally Sill). Occupant leftover 0/0 at dawn → no tax (Gaunt Sill).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — painted cell + start-turn leftover-sum gate. Same class as Octave Sill / Septet Sill / Sestet Sill / Stave Sill / Score Sill / Tally Sill / Poise Sill.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-nonet-hold`

NAME: Nonet Hold  
ROLE: CONTROL — cannot spend leftover MP to walk while leftover AP + leftover MP **=== 9**  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"nonetHoldWhileSumEq":true,"nonetSumN":9,"nonetHoldDuration":2}`. For 2 of the **target’s** turns, any walk that would spend ≥ 1 leftover MP is illegal **while leftover AP + leftover MP === 9**. Teleport / Swap / Phase Slip / Twin-gate step / Nonet Step (caster relocate) do **not** pay walk MP and are legal. Distinct from Octave Hold (#1251, cannot walk while leftover sum === 8 **and unequal**), Septet Hold (#1177, cannot walk while leftover sum === 7), Sestet Hold (#1132, cannot walk while leftover sum === 6 **and unequal**), Stave Hold (#1063, cannot walk while leftover sum === 5), Score Hold (#1011, cannot walk while leftover sum === 4 **and unequal**), Tally Hold (#953, cannot walk while leftover sum === 3), Poise Hold (#890, cannot walk while leftover AP === leftover MP ≥ 1), Odd Hold (#849, cannot walk while leftover AP is **odd**), Dry Hold (until leftover **AP = 0**), Drift Hold (until **force-moved**), Cast Hold / Strike Hold / Boot Hold / Tool Hold / Gaunt Hold / Brick Hold (#1017). The decision: they have (0,9) and wanted to walk nine tiles — they must **leave sum 9** (cast leftover AP from a (5,4) / (6,3) / (7,2) / (8,1) / (9,0), get siphoned, get turned, **or dump to 5/3 or 4/4**) before walking, or wait 2 turns. At leftover (0,9) they **have** MP but cannot spend it while this lock is up **and** they still sum to 9. Dual Keep 2/2 is Poise Hold, **not** this. Dual Keep cannot open this. (5,3) is Octave Hold, not this. (4,4) is Poise Hold, not this. (4,3) is Septet Hold, not this. (4,2) is Sestet Hold, not this.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Must Nonet on (0,9) so they can neither walk nor non-Strike; Triad Turn (0,9)→(9,0) so they lose the walk MP into leftover AP.  
COUNTERPLAY: Cast leftover AP to leave 9; dump to 5/3 or 4/4; blink; wait 2 turns.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **cannot walk while sitting on nine**.  
AI_USAGE: `aiHint: "nonet_hold_if_target_leftover_sum_eq_9_and_wants_to_walk"`. Hex / knights ELITE. Skip if leftover sum ≠ 9.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"], levelZoneMin: 2`  
EDGE_CASES: Missing keys → no lock. Leftover (5,3) → this lock does **not** block walks (Octave Hold’s window). Leftover (4,4) → this lock does **not** block walks (Poise Hold’s window). Leftover (4,3) → this lock does **not** block walks (Septet Hold’s window). Leftover (4,2) → this lock does **not** block walks (Sestet Hold’s window). Leftover (3,2) → this lock does **not** block walks (Stave Hold). Leftover (3,1) → this lock does **not** block walks (Score Hold’s window). Leftover (2,2) → this lock does **not** block walks (Poise Hold). Leftover (3,0) → this lock does **not** block walks (Tally Hold; leftover MP is 0 anyway).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — leftover-sum gate in the walk spender.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-nonet-lend`

NAME: Nonet Lend  
ROLE: SUPPORT — +1 leftover AP and +1 leftover MP iff target leftover AP + leftover MP **=== 9** (exits to 11)  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"nonetLendAp":1,"nonetLendMp":1,"requireTargetSumEqLend":true,"nonetSumN":9}`. If the **target** has leftover AP + leftover MP **=== 9**, grant +1 current AP and +1 current MP (capped at max). The sum becomes **11** (the nonet window **closes**). This **cannot** manufacture Octave (sum 11 ≠ 8) or Septet (sum 11 ≠ 7) or Sestet (sum 11 ≠ 6) or Stave (sum 11 ≠ 5) or Score (sum 11 ≠ 4) or Tally (sum 11 ≠ 3) or Poise (sum 11 is not a required equality). If the gate fails, fizzle rider (AP spent, no grant). Distinct from Octave Lend (#1251, +1/+1 if leftover sum === 8 **and unequal** — **exits** to 10), Septet Lend (#1177, +1/+1 if leftover sum === 7 — **exits** to 9, **which is this family’s window**), Sestet Lend (#1132, +1/+1 if leftover sum === 6 **and unequal** — **exits** to 8, which is Octave), Stave Lend (#1063, +1/+1 if leftover sum === 5 — **exits** to 7, which is Septet), Score Lend (#1011, +1/+1 if leftover sum === 4 **and unequal** — **exits** to 6, which is Sestet), Tally Lend (#953, +1/+1 if leftover sum === 3 — **exits** to 5, which is Stave), Poise Lend (#890, +1/+1 if leftover AP === leftover MP ≥ 1 — the **tie survives**), Gaunt Lend (#849, +1/+1 if leftover **both 0**), Lean / Drift / Spent Lend, Watch Alms, Tempo Gift / Loan Tempo / Haste, Dual Keep. The decision: cash the (5,4) wisp for a 2-resource bump, then they are out of Nonet **and** out of Octave **and** out of Septet **and** out of Sestet **and** out of Stave **and** out of Score **and** out of Tally **and** out of Poise (sum 11 is 6/5 or 7/4 or 8/3 or 9/2 or 10/1). **Septet Lend is the intended manufacture of Nonet** ((4,3)→(5,4)). Do not name-wire that hop.  
DURATION: instant (current-turn leftover only)  
SCALING: amount fixed.  
SYNERGIES: Septet Lend **into** Nonet, then Nonet Mend; or Nonet Lend **out** of Nonet into an 11-bar that Dual Keep cannot cap this turn.  
COUNTERPLAY: Sit off sum 9; sit on 5/3 (Octave Lend); sit on 4/4 (Poise Lend); sit on 4/3 (Septet Lend); sit on 4/2 (Sestet Lend); sit on 3/2 (Stave Lend); sit on 3/1 (Score Lend).  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **cash nine for eleven**, not a Haste.  
AI_USAGE: `aiHint: "nonet_lend_if_ally_leftover_sum_eq_9"`. Buffers / bishops. Skip if leftover sum ≠ 9.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"], levelZoneMin: 1`  
EDGE_CASES: Missing keys → no grant. Target leftover 5/3 → fizzle (Octave Lend). Target leftover 4/4 → fizzle (Poise Lend). Target leftover 4/3 → fizzle (Septet Lend). Target leftover 4/2 → fizzle (Sestet Lend). Target leftover 3/2 → fizzle (Stave Lend). Target leftover 3/1 → fizzle (Score Lend). Target leftover 2/1 → fizzle (Tally Lend). Cap at max: if leftover AP is already max, grant MP only — **then the sum may not be 11** and the window-exit is incomplete; fail closed if either grant cannot apply in full (both must land).  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-nonet-sip`

NAME: Nonet Sip  
ROLE: CONTROL — steal 1 leftover AP iff target leftover AP + leftover MP === 9  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: No HP damage. `effectParams: {"nonetSipAp":1,"requireTargetSumEqSip":true,"nonetSumN":9}`. If the target leftover AP + leftover MP **=== 9** **and** leftover AP ≥ 1, subtract 1 leftover AP from the target (not below 0) and add 1 leftover AP to the caster this turn, capped at max. If leftover AP is 0 (the (0,9) pair) or the sum ≠ 9, fizzle rider (AP spent). Distinct from Octave Sip (#1251, steal 1 leftover AP iff leftover sum === 8 **and unequal** — **every successful steal manufactures Septet**; no Poise exception because (4,4) is banned), Septet Sip (#1177, steal 1 leftover AP iff leftover sum === 7 — **manufactures Sestet** from most steals, **Poise** from (4,3)→(3,3)), Sestet Sip (#1132, steal 1 leftover AP iff leftover sum === 6 **and unequal** — **manufactures Stave** from every successful steal), Stave Sip (#1063, steal 1 leftover AP iff leftover sum === 5 — **manufactures Score or Poise**), Score Sip (#1011, steal 1 leftover AP iff leftover sum === 4 **and unequal** — **manufactures Tally**), Tally Sip (#953, steal 1 leftover AP iff leftover sum === 3 — **manufactures Poise** from (2,1)→(1,1)), Poise Sip (#890, steal 1 leftover AP iff leftover AP === leftover MP ≥ 1), Bare Sip (#849, steal 1 leftover AP iff leftover **MP = 0**), Soul Sip (ungated current MP), Ap Sip (#342). The decision: sip (5,4) → they become (4,4) **Poise**; sip (4,5) → they become (3,5) **Octave**; sip (6,3) → they become (5,3) **Octave**; sip (7,2) → they become (6,2) **Octave**; sip (8,1) → they become (7,1) **Octave**; sip (9,0) → they become (8,0) **Octave**; sip (3,6) → they become (2,6) **Octave**; sip (2,7) → they become (1,7) **Octave**; sip (1,8) → they become (0,8) **Octave**. **Most successful Nonet Sips manufacture Octave.** **(5,4)→(4,4) is the odd-sum Poise exception** (the cousin of Septet Sip’s (4,3)→(3,3)). Dual Keep 2/2 is the **wrong** window (Poise Sip). (5,3) is Octave Sip, not this. (4,4) is Poise Sip, not this. (4,3) is Septet Sip, not this. (4,2) is Sestet Sip, not this.  
DURATION: instant (current-turn leftover only)  
SCALING: amount fixed.  
SYNERGIES: Octave Sting / Octave Mend **after** manufacturing 5/3 or 6/2 or 7/1 or 8/0; Nonet Hold so they cannot walk the remaining MP; Poise Sting **after** (5,4)→(4,4).  
COUNTERPLAY: Sit on (0,9) (no AP to steal); sit off sum 9; sit on 5/3 (Octave Sip); sit on 4/4 (Poise Sip); sit on 4/3 (Septet Sip); sit on 4/2 (Sestet Sip); sit on 3/2 (Stave Sip); sit on 3/1 (Score Sip); Second Wind after.  
POWER_BUDGET: Cheap control, 0 damage, CD 1.  
AI_USAGE: `aiHint: "nonet_sip_if_target_sum_eq_9_and_leftover_ap_ge_1"`. Hex / pawns. Skip if not in the window or leftover AP is 0.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"], levelZoneMin: 1`  
EDGE_CASES: Do not write `debuffStat: "ap"`. Missing keys → no steal. Target leftover 5/3 → fizzle (Octave Sip’s window). Target leftover 4/4 → fizzle (Poise Sip’s window). Target leftover 4/3 → fizzle (Septet Sip’s window). Target leftover 4/2 → fizzle (Sestet Sip’s window). Target leftover 3/2 → fizzle (Stave Sip’s window). Target leftover 3/1 → fizzle (Score Sip’s window). Target leftover 2/1 → fizzle (Tally Sip’s window). Challenge: not a heal, not MP. Do not name-wire the Octave / Poise hops.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-nonet-post`

NAME: Nonet Post  
ROLE: SUMMONS — empty-kit mine; end-turn occupy detonates iff leftover AP + leftover MP === 9  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "nonetpost"`, `summonLifespan: 3`, empty kit. `effectParams: {"nonetPostDetonateDamage":10,"nonetPostNeedSumEq":true,"nonetSumN":9}`. Place on a free ground tile. At **end of a combatant’s turn**, if they **occupy** this body and leftover AP + leftover MP **=== 9**, deal 10 to that occupant through `updateCombatant` and this summon dies. Walk-enter does **not** detonate (Ingress). Relocate landing does **not** detonate (Drift Post). Start-of-turn does **not** detonate (Wake / Gaunt Sill / Poise Sill / Tally Sill / Score Sill / Stave Sill / Sestet Sill / Septet Sill / Octave Sill / Nonet Sill). Distinct from Octave Post (#1251, leftover sum === 8 **and unequal**), Septet Post (#1177, leftover sum === 7), Sestet Post (#1132, leftover sum === 6 **and unequal**), Stave Post (#1063, leftover sum === 5), Score Post (#1011, leftover sum === 4 **and unequal**), Tally Post (#953, leftover sum === 3), Poise Post (#890, leftover AP === leftover MP ≥ 1), Gaunt Post (#849, leftover **both 0**), Lean Post (leftover **AP = 0** only), Dummy Post (taunt), Drift Post (**relocate landing**), Dwell Mark (**end-turn occupy, any leftover**), Hollow Mark (#1198, leftover **both 0** paint), Skew Mark (#1255, leftover **AP − MP === 2** paint). The decision: end the turn on (5,4) and eat 10, or spend a pool, or dump to 5/3 and eat Octave Post, or dump to 4/4 and eat Poise Post, or dump to 4/3 and eat Septet Post. Dual Keep 2/2 **hurts Poise Post, not this**. Dual Keep **cannot** hurt this. Walk-safe. Relocate-safe. Start-turn-safe.  
DURATION: lifespan 3 or until detonate  
SCALING: 10 follows damage% if any; otherwise fixed.  
SYNERGIES: Nonet Hold so they cannot walk off; Triad Turn **keeps** sum 9 through the end-turn check.  
COUNTERPLAY: Spend a pool before turn end; dump to 5/3 or 4/4; walk off (walk-safe); Coup the post; blink.  
POWER_BUDGET: Standard 3 / CD 3 / 0 upfront. Power is **end-turn occupy on a sum of 9**. Counts as **one** toward the summon cap.  
AI_USAGE: `aiHint: "nonet_post_if_foe_will_end_turn_sum_eq_9_on_tile"`. Masons / pawns. Skip if cap is full.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","rook"], levelZoneMin: 1`  
EDGE_CASES: **Summon is observation.** Later detonate / death is not a second observe. Missing keys → do not spawn a Dummy Post. Occupant leftover 5/3 at turn end → no detonate (Octave Post’s window). Occupant leftover 4/4 at turn end → no detonate (Poise Post’s window). Occupant leftover 4/3 at turn end → no detonate (Septet Post’s window). Occupant leftover 4/2 at turn end → no detonate (Sestet Post’s window). Occupant leftover 3/2 at turn end → no detonate (Stave Post’s window). Occupant leftover 3/1 at turn end → no detonate (Score Post’s window). Occupant leftover 3/0 at turn end → no detonate (Tally Post’s window). Occupant leftover 0/0 at turn end → no detonate (Gaunt Post’s window). Empty tile → no detonate, lifespan ticks. Never parse `"Nonet Post"`. Do not mint `spell-nonet-burst`. Prefer fizzle-and-detonate if the body is displaced by Swap (body gone → no tile tax).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — empty-kit summon + end-turn leftover-sum gate. Same class as Octave Post / Septet Post / Sestet Post / Stave Post / Score Post / Tally Post / Poise Post / Gaunt Post / Lean Post.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-nonet-bounce`

NAME: Nonet Bounce  
ROLE: DAMAGE — 12 to primary; bounce 1 to nearest other leftover-AP+MP===9 hostile  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 12 to primary (ungated). `effectParams: {"nonetBounceNeedSumEq":true,"nonetSumN":9,"nonetBounceSearchRadius":4,"nonetBounceCount":1}` — search Chebyshev ≤ 4 for the nearest **other** living hostile whose leftover AP + leftover MP **=== 9**; deal 12 to that body too. Primary leftover unconstrained. Distinct from Octave Bounce (#1251, second body leftover sum === 8 **and unequal**), Septet Bounce (#1177, second body leftover sum === 7), Sestet Bounce (#1132, second body leftover sum === 6 **and unequal**), Stave Bounce (#1063, second body leftover sum === 5), Score Bounce (#1011, second body leftover sum === 4 **and unequal**), Tally Bounce (#953, second body leftover sum === 3), Poise Bounce (#890, second body leftover AP === leftover MP ≥ 1), Gaunt Bounce (#849, second body leftover **both 0**), Parched Bounce (leftover **MP = 0**), Heave Bounce (**force-moved**), Chain Lightning (nearest **any**, 2 bounces). The decision: open on whoever, splash the (5,4) bishop — or wait for two 5/3 bodies and Octave Bounce. Dual Keep 2/2 is the **wrong** second body. Dual Keep cannot open this. (5,3) is Octave Bounce, not this. (4,4) is Poise Bounce, not this. (4,3) is Septet Bounce, not this. (4,2) is Sestet Bounce, not this.  
DURATION: instant  
SCALING: 12 follows damage%.  
SYNERGIES: Triad Turn a second body into Nonet before the bounce search; Nonet Hold to keep them in-window.  
COUNTERPLAY: Isolate (one Nonet body); sit the second body on 5/3 or 4/4 or 4/3 or 4/2 or 3/2 or 3/1 or 3/0 or 0/0.  
POWER_BUDGET: Standard. 12 if no second Nonet body; 24 if a second sits on sum 9.  
AI_USAGE: `aiHint: "nonet_bounce_if_second_sum_eq_9_hostile_in_r4"`. Queens / bishops. Skip if no second in-window body **and** a Strike would kill the primary; 12 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"], levelZoneMin: 1`  
EDGE_CASES: Missing bounce keys → 12 only. Primary leftover 5/3 does **not** block the primary hit. Ties: nearest Chebyshev, then lowest id. Do not hit allies. Second body leftover 5/3 is **not** a bounce target (Octave Bounce). Second body leftover 4/4 is **not** a bounce target (Poise Bounce). Second body leftover 4/3 is **not** a bounce target (Septet Bounce). Second body leftover 4/2 is **not** a bounce target (Sestet Bounce). Second body leftover 3/2 is **not** a bounce target (Stave Bounce). Second body leftover 3/1 is **not** a bounce target (Score Bounce).  
IMPLEMENTATION_COMPLEXITY: LOW — one search + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-must-nonet`

NAME: Must Nonet  
ROLE: CONTROL — non-Strike illegal unless leftover AP + leftover MP === 9 **and** the spell spends last AP  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"mustNonStrikeUnlessSumEqAndSpendsLastAp":true,"nonetSumN":9,"nonetHoldDuration":2}`. For 2 of the **target’s** turns, any non-Strike spell is illegal unless, **before** this (their) spell’s AP is paid, leftover AP + leftover MP **=== 9** **and** `apCost === leftover AP` (the spell spends last leftover AP). Strike / `physical_attack` stays legal. Walk stays legal unless a Nonet Hold is also up. Distinct from Must Octave (#1251, leftover sum === 8 **and unequal** **and** last AP — **pre-spend even unequal sum 8**), Must Septet (#1177, leftover sum === 7 **and** last AP — **pre-spend odd sum 7**), Must Sestet (#1132, leftover sum === 6 **and unequal** **and** last AP — **pre-spend even unequal sum 6**), Must Stave (#1063, leftover sum === 5 **and** last AP — **pre-spend odd sum 5**), Must Score (#1011, leftover sum === 4 **and unequal** **and** last AP — **pre-spend even unequal sum 4**), Must Tally (#953, leftover sum === 3 **and** last AP — **pre-spend odd sum 3**), Must Poise (#890, leftover AP === leftover MP ≥ 1 **and** last AP — **pre-spend equality**), Must Gaunt / Must Lean / Must Drift / Must Pace / Must Span / Must Step, Rite First (cannot Strike until a spell), Tool Hold (cannot tool until Strike). The decision: they sit on (5,4) with a 5-cost tool as their last packet, or they sit on (4,5) with this 3-cost as their last packet? (4,5) leftover AP is 4, so a 4-cost last packet **is** legal; they sit on (0,9) with walk MP and **no** leftover AP — Must Nonet **blocks** every non-Strike from (0,9) because leftover AP is 0 (cannot spend last AP). (9,0) spending a 9-cost last packet **is** legal and dumps them to (0,0) Gaunt. Dual Keep 2/2 is Must Poise’s window, **not** this. Dual Keep cannot open this. (5,3) is Must Octave, not this. (4,4) is Must Poise, not this. (4,3) is Must Septet, not this. (4,2) is Must Sestet, not this.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Nonet Hold on (0,9) so they can neither walk nor non-Strike; Triad Turn (0,9)→(9,0) so a 9-cost last packet becomes legal. Do **not** CORE with a Strike-only nonet lock (none shipped).  
COUNTERPLAY: Strike; blink; wait 2 turns; dump to 5/3 or 4/4; Triad Turn / Tempo Invert yourself if you own it.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **last-packet from a sum of 9**, not a silence.  
AI_USAGE: `aiHint: "must_nonet_if_target_leftover_sum_eq_9_and_has_a_last_packet_spell"`. Knights / pawns ELITE. Skip if leftover sum ≠ 9. Do not arm if the only remaining legal verb is Strike and a walk would kill.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","pawn"], levelZoneMin: 2`  
EDGE_CASES: **Pre-spend leftover** (see §3.5). Missing keys → no lock. Leftover (5,3) → non-Strike still illegal under **this** lock (sum 8, Must Octave’s window). Leftover (4,4) → non-Strike still illegal under **this** lock (tied, Must Poise’s window). Leftover (4,3) → non-Strike still illegal under **this** lock (sum 7, Must Septet’s window). Leftover (4,2) → non-Strike still illegal under **this** lock (sum 6, Must Sestet’s window). Leftover (3,2) → non-Strike still illegal under **this** lock (sum 5, Must Stave’s window). Leftover (3,1) → non-Strike still illegal under **this** lock (sum 4, Must Score’s window). Leftover (3,0) → non-Strike still illegal under **this** lock (sum 3, Must Tally’s window). Leftover (0,0) → non-Strike illegal (Must Gaunt’s window, but this lock does not lift there). 0-AP tools (Timestep) are not “spending last AP”. The shared key `mustNonStrikeUnlessSumEqAndSpendsLastAp` is **not** a name table: `nonetSumN` distinguishes this row from Must Octave / Must Septet / Must Sestet / Must Stave / Must Score.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — pre-spend leftover sum + last-AP compare in the cast gate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-verse-nonet`

NAME: Verse Nonet  
ROLE: CONTROL — last resolved id illegal until leftover AP + leftover MP === 9  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"verseNonetUntilSumEq":true,"nonetSumN":9}`. The target’s **last resolved spell id** (the id they most recently spent AP on) cannot be recast until leftover AP + leftover MP **=== 9**. Strike is not a spell id for this key. If they have no last resolved id, fizzle rider (AP spent). Distinct from Verse Octave (#1251, lifts at leftover sum === 8 **and unequal**), Verse Septet (#1177, lifts at leftover sum === 7), Verse Sestet (#1132, lifts at leftover sum === 6 **and unequal**), Verse Stave (#1063, lifts at leftover sum === 5), Verse Score (#1011, lifts at leftover sum === 4 **and unequal**), Verse Tally (#953, lifts at leftover sum === 3), Verse Poise (#890, lifts at leftover AP === leftover MP ≥ 1), Verse Gaunt (#849, lifts at leftover **both 0**), Verse Lean / Verse Pace / Verse Tax, Once Verse / Stolen Verse / Summon Verse (#906, pets pay +1 AP to **recast** last id; the id stays legal), Last Mute / Hex of Silence. The decision: lock their Inferno until they sit on (5,4) — sitting on 5/3 **does not** lift (Verse Octave’s window); sitting on 4/4 **does not** lift (Verse Poise’s window); sitting on 4/3 **does not** lift (Verse Septet’s window); sitting on 4/2 **does not** lift (Verse Sestet’s window); sitting on 3/2 **does not** lift (Verse Stave’s window); sitting on 3/1 **does not** lift (Verse Score’s window); sitting on 3/0 **does not** lift (Verse Tally’s window); sitting on 0/0 **does not** lift (Verse Gaunt’s window); sitting on 1/1 **does not** lift (Prime Gift); sitting on 6/0 **does not** lift (Verse Sestet / Gait Gift); sitting on 8/0 **does not** lift (Verse Octave / Gait Gift); sitting on 9/0 **does** lift (Gait Gift **and** a Nonet pair — both-body vs one-body is not this lock). Instant lift if they already sit on sum 9 at resolve (fizzle rider — do not arm a lock that is already lifted). Dual Keep 2/2 does **not** lift this. Dual Keep **cannot** lift this.  
DURATION: until leftover sum === 9, or battle end  
SCALING: none.  
SYNERGIES: Cadence Sixte so the locked id is also remaining 0 (they can recast it **this** turn if they also sit in-window); Nonet Hold so they cannot walk into a new leftover split.  
COUNTERPLAY: Sit on (9,0) / (0,9) / (8,1) / (1,8) / (7,2) / (2,7) / (6,3) / (3,6) / (5,4) / (4,5); recast a different id; wait. Dual Keep 2/2 does **not** lift this. Haste into (5,4) **does**. Dumping to 5/3 **does not**. Dumping to 4/4 **does not**.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **which leftover window lifts the last verse**, not a silence.  
AI_USAGE: `aiHint: "verse_nonet_if_target_last_id_is_their_win_condition"`. Hex / bishops. Skip if they have no last resolved id, or if they already sit on sum 9 (instant lift — fizzle rider).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"], levelZoneMin: 1`  
EDGE_CASES: Missing keys → no lock. Verse Nonet does **not** lift at leftover 0/0 (Verse Gaunt), leftover 2/2 (Verse Poise), leftover 3/3 (Verse Poise), leftover 4/4 (Verse Poise), leftover 3/0 (Verse Tally), leftover 3/1 (Verse Score), leftover 3/2 (Verse Stave), leftover 4/2 (Verse Sestet), leftover 4/3 (Verse Septet), leftover 5/3 (Verse Octave), leftover 6/0 (Verse Sestet / Gait Gift), leftover 7/0 (Verse Septet / Gait Gift), leftover 8/0 (Verse Octave / Gait Gift), or leftover 1/1 (Prime Gift). Summon Verse (#906) is a recast tax, not a legality lock — do not merge the keys.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — last-id lock + leftover-sum lift.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-sixte`

NAME: Court Sixte  
ROLE: SUPPORT — Cadence Sixte on **every other** body (init order)  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `effectParams: {"sixteRemainingCdsEq6To0":true,"courtSixteExcludeCaster":true}`. In initiative order, every living combatant **except the caster** has remaining `n===6` rewritten to `0` (zeros stay 0; `n===1`…`n===5` and `n>6` unchanged), same rewrite as Cadence Sixte. Distinct from Court Quinte (#1251, mass Quinte `n===5` → `0`), Court Quarte (#1177, mass Quarte `n===4` → `0`), Court Tierce (#1132, mass Tierce `n===3` → `0`), Court Dock (#1063, mass Dock `n===2` → `0`), Court Snuff (#1011, mass Snuff `n===1` → `0`), Court Prime (#953, mass Prime `n===0` → `1`), Court Floor (#890, mass Floor `n>1` → `1`, zeros stay 0), Court Lag (#849, mass Lag `n>0` → `n+2`), Court Imprint (mass Imprint), Court Dual / Court Keep / Court Stretch / Court Hinge / Court Shove / Court Fold, Cadence Sixte (one body), Cadence Sext (one body `n>6→6`), Cadence Flush (all → 0, ally), Cadence Swap (two-body map exchange), Cadence Quint (one body `n>5→5`), Cadence Quad (one body `n>4→4`), Cadence Tern (one body `n>3→3`), Cadence Cap (one body `n>2→2`). Player never owns this. Witness without grant.  
DURATION: instant rewrite  
SCALING: none.  
SYNERGIES: Kit with Cadence Sixte on the caster’s own target after, or Quinte a remaining `n===5` after the board’s remaining-6 tools are already sitting at 0. Do **not** CORE with Court Quinte / Court Quarte / Court Tierce / Court Dock / Court Snuff / Court Prime / Court Floor / Cadence Sext / Cadence Quint / Cadence Quad / Cadence Tern / Cadence Cap.  
COUNTERPLAY: Recast before Court Sixte; Cadence Break your own remaining after; Floor your remaining 6 to 1 before the mass sixte; Sext does **not** save you (sixes stay 6, then this writes 0); Quint peels 6 to 5 (then this does **not** write 0 — Quinte’s problem); Quad peels 6 to 4 (then this does **not** write 0 — Quarte’s problem); Tern peels 6 to 3 (then this does **not** write 0 — Tierce’s problem); kill the regent.  
POWER_BUDGET: Signature 6 / CD 4 / 0 damage. Power is **board-wide remaining-6 unlock**. Kit-only.  
AI_USAGE: `aiHint: "court_sixte_if_two_plus_foes_have_a_remaining_6_nuke"`. Kit-only regent. Skip if every other remaining is already ≠ 6.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. `NOT_PLAYER_LEARNABLE`. `court_sixte_regent` kit-only. Arm is observation for witness-only kits. Never written to owned ids.  
EDGE_CASES: Missing `courtSixteExcludeCaster` → do not sixte the caster (fail closed, still observe). Do not write `spellLevelValues`. Do not mint `spell-court-six` / `spell-court-sext`. Preview must list who sixte. Do not reuse `courtQuinteExcludeCaster` / `courtQuarteExcludeCaster` / `courtTierceExcludeCaster` / `courtDockExcludeCaster` / `courtSnuffExcludeCaster` / `courtPrimeExcludeCaster` / `courtFloorExcludeCaster`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — init-order walk + Cadence Sixte rewrite. Same class as Court Quinte / Court Quarte / Court Tierce / Court Dock / Court Snuff / Court Prime / Court Floor / Court Lag.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-court-sixte
effectType: debuff
effectCategory: cc
targetType: self
areaShape: single
apCost: 6
mpCost: 0
damage: 0
range: 0
cooldown: 4
usableByPlayer: false
usableByEnemy: true
minLevel: 1
isBaseSpell: false
acquisitionModel: NOT_PLAYER_LEARNABLE
discoveryEligible: false
effectParams: {"sixteRemainingCdsEq6To0":true,"courtSixteExcludeCaster":true}
```

---

## 6. Combination matrix (intended, not name-wired)

Resolve only via flags / leftover reads / remaining-CD maps / occupy-weight. Never `spell.name`.

| Setup (metadata) | Payoff (metadata) | Decision |
| :--- | :--- | :--- |
| Both leftover sums === 9 | `nonetMendAmount` | Two nine-bars, or sit on 5/3 and Octave Mend |
| Remaining `n===6` | `sixteRemainingCdsEq6To0` | Unlock the six this turn, or wait for Quinte’s five |
| `hexadecaSide: 4` occupy | `nonetHoldWhileSumEq` | Sixteen-cell wall + cannot walk off 9 |
| `invertCasterAllyAndHostileLeftoverApMp` | `nonetSumN` / `octaveSumN` | Flip three bars; sums survive, windows can hop families |
| `nonetHoodNextHit` | leftover sum === 9 at impact | Hold (5,4) through the swing |
| `nonetStingBonus` | target leftover sum === 9 | Poke the nine-bar, or poke anyone for 10 |
| `nonetStepAdj` | ally leftover sum === 9 | Blink to the (0,9) wisp |
| `nonetSillNeedSumEq` | start-turn occupy | Dawn tax, or spend overnight |
| `nonetHoldWhileSumEq` | leftover (0,9) | Cannot spend the nine walk MP |
| `nonetLendAp` + `nonetLendMp` | leftover sum 9 → 11 | Cash nine; **Septet Lend manufactures Nonet** |
| `nonetSipAp` | leftover AP ≥ 1 and sum 9 | (5,4)→(4,4) Poise; other pairs → Octave |
| `nonetPostNeedSumEq` | end-turn occupy | Walk-safe, relocate-safe, start-turn-safe |
| `nonetBounceCount` | second leftover sum === 9 | Splash the other nine-bar |
| `mustNonStrikeUnlessSumEqAndSpendsLastAp` + `nonetSumN` | pre-spend leftover | Last packet from nine, or Strike |
| `verseNonetUntilSumEq` | leftover sum === 9 | Recast the locked id only from nine |
| `courtSixteExcludeCaster` | mass `n===6` → `0` | Witness-only board unlock |

Map modifiers stay metadata-only. Frozen/Slime × **walk** MP does not inflate any Wave-21 `mpCost` (all 0). Arcane Surge × Cadence Sixte is remaining rewrite, not AP.

Mechanic Interaction Matrix still OPEN (do not “fix” in this spec):

- Swap × hazards (MIMA-2026-08-31-001) — Nonet Step dest **must** tick dest hazards.
- Push/pull × hazards (MIMA-2026-08-31-005) — this pass does not add a new push; Triad Turn does not move tiles.
- Controlled-summon walk × occupancy (MIMA-2026-08-31-002) — Hexadeca Span occupancy must apply to summon-control walks.

---

## 7. Recommended unlock order (pacing)

Discovery designer should treat these as **bands**, not a shop list. **Still required for any of this to matter:** Discovery’s innate-four split. This pass does not edit `spellData.ts`.

| Band | Spells | Why |
| :--- | :--- | :--- |
| Observe+win (zone 1) | Nonet Sting, Nonet Sip, Nonet Step, Nonet Sill, Nonet Lend, Nonet Bounce, Verse Nonet, Triad Turn | Leftover-sum 9 tools |
| MULTI (observe **or** extra door) | Nonet Mend (`nonet_cantor`), Cadence Sixte (`sixte_precentor`), Hexadeca Span (`span_hexadeca`) | Heal / remaining-6 unlock / sixteen occupy |
| ELITE | Nonet Hood, Nonet Hold, Must Nonet | Negate / walk lock / last-packet |
| Kit-only | Court Sixte (`court_sixte_regent`) | Mass remaining-6 unlock |

**Wave 22 leftovers left on purpose:** mid-RAF splice; fourth walk-MP snipe; sixth echo id; player-owned Hex of Silence; player-owned About Hinge; leftover AP − leftover MP === 2 as a heal (still colliding; Skew Mark owns the detonate); remaining `n===7` → `0`; seventeen-cell occupy; target-only sum===9 / sum===8 / sum===7 / sum===6 / sum===5 / sum===4 / sum===3 heal (SDE leftovers); leftover sum === 10; invert leftover on caster and two same-side allies.

#1255 stamps #1251 as Wave **21** family CORE. This catalog stamps as Wave **22** family CORE.

---

## 8. Implementation notes (for a later, explicit implementation PR)

1. **No production code in this change.** Data PR later, after Wave-1 ownership split.  
2. **MP debit:** still AP-only at WX 17162–17165. Wave-21 rows stay `mpCost: 0`.  
3. **`nonetSumN: 9`** is odd — never a tie. Do **not** add `nonetForbidEqual`.  
4. **Cadence Sixte** walks remaining `n===6` → `0`. Do not reuse `quinteRemainingCdsEq5To0` / Sext’s `n>6→6`.  
5. **Hexadeca Span ≠ Pentadeca Span.** 4×4, click = nearest cell to caster. `summonAI: "hexadecaspan"`. Blocked while `ENEMY_SUMMON_CAP === 2`.  
6. **Triad Turn ≠ Kin Turn ≠ Feud Turn ≠ Psalm Turn.** Three-body independent invert. New key. Nearest-ally search. Not `isSwap`.  
7. **Nonet Post** end-turn occupy detonate **iff leftover AP + leftover MP === 9**; walk-safe; relocate-safe; start-turn-safe. `summonAI: "nonetpost"`.  
8. **Must Nonet** reads leftover **before** debit.  
9. **Septet Lend (4,3)→(5,4) manufactures Nonet.** Octave Lend (5,3)→(6,4) **exits** Octave into sum 10, **not** Nonet. Do not name-wire either hop.  
10. Recap grant uses the reward funnel + `commitSpellDiscoveries` / `unlockOwnedSpell`, not `updateCharacter`.  
11. Do not touch RAF, map generation, turn order, or damage math.  
12. Add ids to `SPELL_ID_CATALOG` **only when implemented**, together with `spellData.ts` and kits.  
13. Do **not** append these ids to `starterSpells` as `isBaseSpell`.  
14. Extra doors wait for **Wave 23** sheets. Do not restamp #1244 or **#1302** (`shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate`). #1302 did **not** take `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent`.

---

## 9. Explicit non-goals this pass

- No production TypeScript / Motoko / Candid edits.  
- No new damage formula, crit, or RES/SR identity.  
- No shop-bought spells.  
- No fourth RES% buff.  
- No second Chain Lightning, second absorb, second self-cleanse, second **self** range-buff.  
- No player-owned silence (Hex of Silence stays BOSS_ONLY).  
- No 12-AP Void Collapse clone.  
- No third File Lance / Blood Tithe (ids already collide across siblings).  
- No fourth `mpCost > 0` walk snipe.  
- No wiring of `CharacterStats.evasion` as a percent.  
- No second Cadence Floor / Prime / Rise / Snuff / Cap / Dock / Tern / Tierce / Quad / Quarte / Quint / Quinte / Sext.  
- No `spell-nonet-gift` / `spell-octave-gift` / `spell-septet-gift` / `spell-sestet-gift` / `spell-stave-gift` / `spell-score-gift` / `spell-tally-gift`.  
- No `spell-choir-turn` / `spell-pew-turn` / `spell-trio-turn` / `spell-trine-turn` / `spell-duet-turn`.  
- No `spell-skew-*` family (Skew Mark owns the AP−MP===2 detonate).  
- No cloning Shield/Iron Skin, Blood Mend/Rally, Poison/Venom, Expose/Shadow Veil, Mirror/Reflect, Lens/Overcast, Short Sight/Paper Wind, Tempo Gift/Loan Tempo, Goad/Taunt Oath, Rime Tile/Rime Sheet, File Lance, Blood Tithe, Hex of Silence.

---

## 10. Proposal index

| SPELL_ID | NAME | ROLE | ACQUISITION | AP | CD | Door |
| :--- | :--- | :--- | :--- | ---: | ---: | :--- |
| `spell-nonet-mend` | Nonet Mend | SUPPORT | MULTI_SOURCE | 3 | 2 | `nonet_cantor` |
| `spell-cadence-sixte` | Cadence Sixte | CONTROL | MULTI_SOURCE | 3 | 2 | `sixte_precentor` |
| `spell-hexadeca-span` | Hexadeca Span | SUMMONS | MULTI_SOURCE | 4 | 3 | `span_hexadeca` |
| `spell-triad-turn` | Triad Turn | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-nonet-hood` | Nonet Hood | DEFENSE | ELITE | 2 | 2 | (piece observe) |
| `spell-nonet-sting` | Nonet Sting | DAMAGE | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-nonet-step` | Nonet Step | POSITION | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-nonet-sill` | Nonet Sill | TERRAIN | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-nonet-hold` | Nonet Hold | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-nonet-lend` | Nonet Lend | SUPPORT | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-nonet-sip` | Nonet Sip | CONTROL | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-nonet-post` | Nonet Post | SUMMONS | ENEMY_DISCOVERY | 3 | 3 | (piece observe) |
| `spell-nonet-bounce` | Nonet Bounce | DAMAGE | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-must-nonet` | Must Nonet | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-verse-nonet` | Verse Nonet | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-court-sixte` | Court Sixte | SUPPORT | NOT_PLAYER_LEARNABLE | 6 | 4 | `court_sixte_regent` (kit) |

All STATUS: **PROPOSED**.

### 10.1 QA (design contract)

| # | Check | Pass |
| :--- | :--- | :--- |
| W21-1 | Live catalog unchanged @ `0f5363f` | 32 frontend ids; discovery inert |
| W21-2 | `spell-parched-mend` is **not** shipped; Dry Gait owns leftover-MP=0 heal |
| W21-3 | `spell-nonet-mend` requires leftover AP + leftover MP **=== 9** on **both** bodies. (5,3) fails. (4,4) fails. (4,3) fails. (4,2) fails. (3,3) fails. Octave Mend owns **sum === 8 AND unequal**. Septet Mend owns **sum === 7**. Sestet Mend owns **sum === 6 AND unequal**. Stave Mend owns **sum === 5**. Score Mend owns **sum === 4 AND unequal**. Tally Mend owns **sum === 3**. Poise Mend / Equal Gift own **equality ≥ 1**. Prime Gift owns **exactly 1/1**. Gait Gift owns **one-body AP ≥ 2 AND MP = 0**. Wide Gift owns **one-body AP ≥ 2 AND MP ≥ 1**. Thin Gift owns **one-body 1/0**. Deep Gift owns **one-body 1/≥2**. Hollow Gift / Gaunt Mend own **0 + 0**. Lean Gift owns AP=0 and MP≥1 |
| W21-4 | Cadence Sixte is remaining `n===6` → `0`; `n===1`…`n===5` and `n>6` unchanged; zeros stay 0. Does **not** clone Cadence Sext (`n>6→6`) / Quinte (`5→0`) / Quint (`n>5→5`) / Quarte (`4→0`) / Tierce (`3→0`) / Dock (`2→0`) / Snuff (`1→0`) / Quad (`n>4→4`) / Tern (`n>3→3`) / Cap (`n>2→2`) / Rise (`1→2`) / Prime (`0→1`) / Floor / Swap / Lag / Halve / Crack / Flush |
| W21-5 | Hexadeca Span is axis-aligned 4×4, counts as **sixteen**, every cell occupied, click is **nearest cell to caster**. Pentadeca Span stays stretched plus fifteen, click = center. Tetradeca Span stays 2×7 fourteen, click = nearest cell to caster. Trideca Span stays plus arm 3 thirteen, click = center. Dodeca Span stays 3×4 twelve, click = nearest cell to caster. Nine Span stays solid nine. Quad Span stays 2×2 four |
| W21-6 | Triad Turn is caster + one ally + one hostile independent leftover AP↔MP (caster participates). Does **not** clone Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, Psalm Turn, Feud Turn, or Kin Turn. Does **not** reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp` / `invertTwoAlliesLeftoverApMp` / `invertMixedSidesLeftoverApMp` / `invertCasterAndHostileLeftoverApMp` / `invertCasterAndAllyLeftoverApMp`. Does **not** alias Choir Hymn. Does **not** mint `spell-choir-turn` / `spell-trio-turn` / `spell-duet-turn` |
| W21-7 | Nonet Hood does **not** retag `even_gallery` / Dual Plate / Prime Plate / Thin Plate / Wide Plate / Deep Plate / Pair Plate / Spent Plate / Gait Plate / Poise Hood / Tally Hood / Score Hood / Stave Hood / Sestet Hood / Septet Hood / Octave Hood |
| W21-8 | Nonet Sting bonus is leftover AP + leftover MP === 9, not Octave Sting’s sum 8 unequal, not Septet Sting’s sum 7, not Sestet Sting’s sum 6 unequal, not Stave Sting’s sum 5, not Score Sting’s sum 4 unequal, not Tally Sting’s sum 3, not Poise Sting’s equality, not Gaunt Sting’s both-0, not Pair Gait’s 2/0, not Wide Sting, not Hollow Sting, not Lean Gait, not Tied Gait’s (2,2) |
| W21-9 | Nonet Sip on (5,4) writes (4,4) **Poise**. Other successful Nonet Sips manufacture Octave. Octave Sip on (5,3) writes (4,3) **Septet**. Septet Sip on (5,2) writes (4,2) **Sestet**. Septet Sip on (4,3) writes (3,3) **Poise**. Sestet Sip on (4,2) writes (3,2) **Stave**. Stave Sip on (3,2) writes (2,2) **Poise**. Stave Sip on (4,1) writes (3,1) **Score**. Score Sip on (3,1) writes (2,1) **Tally**. Tally Sip on (2,1) writes (1,1) **Poise**. Bare Sip stays leftover MP = 0. Poise Sip stays equality ≥ 1 |
| W21-10 | Must Nonet is **not** in the same CORE as a Strike-only nonet lock (none shipped). Reads leftover **before** debit. Dual Keep 2/2 is Must Poise, not Must Nonet. Dual Keep cannot open Must Nonet. (5,3) is Must Octave. (4,4) is Must Poise. (4,3) is Must Septet. (4,2) is Must Sestet. (3,3) is Must Poise |
| W21-11 | Court Sixte is `NOT_PLAYER_LEARNABLE`; `court_sixte_regent` is kit-only |
| W21-12 | Extra doors `nonet_cantor` / `sixte_precentor` / `span_hexadeca` / `court_sixte_regent` do not restamp #808 / #836 / #849 / #837 / #890 / #903 / #906 / #951 / #953 / #962 / #1004 / #1011 / #1017 / #1063 / #1080 / #1082 / #1132 / #1139 / #1143 / #1170 / #1177 / #1198 / **#1244** (`sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`) / **#1251** (`octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent`) / **#1255** (`giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave` / `giraffe_precentor` / `giraffe_fold_regent`) / **#1302** (`shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate`) |
| W21-13 | `mpCost` is 0 on every Wave-21 row |
| W21-14 | `summonAI` values are `"hexadecaspan"` / `"nonetpost"` enums, never parsed names |
| W21-15 | Hexadeca Span does not ship against `ENEMY_SUMMON_CAP === 2` without occupy-weight |
| W21-16 | Verse Nonet does **not** lift at leftover 0/0 (Verse Gaunt), leftover 2/2 (Verse Poise), leftover 3/3 (Verse Poise), leftover 4/4 (Verse Poise), leftover 3/0 (Verse Tally), leftover 3/1 (Verse Score), leftover 3/2 (Verse Stave), leftover 4/2 (Verse Sestet), leftover 4/3 (Verse Septet), leftover 5/3 (Verse Octave), leftover 6/0 (Verse Sestet / Gait Gift), leftover 7/0 (Verse Septet / Gait Gift), leftover 8/0 (Verse Octave / Gait Gift), or leftover 1/1 (Prime Gift) |
| W21-17 | No second `spell-cadence-floor` / `spell-cadence-prime` / `spell-cadence-rise` / `spell-cadence-snuff` / `spell-cadence-cap` / `spell-cadence-dock` / `spell-cadence-tern` / `spell-cadence-tierce` / `spell-cadence-quad` / `spell-cadence-quarte` / `spell-cadence-quint` / `spell-cadence-quinte` / `spell-cadence-sext`. SDE #906 owns Floor. #953 owns Prime. #962 owns Rise. #1011 owns Snuff. #1017 owns Cap. #1063 owns Dock. #1082 owns Tern. #1132 owns Tierce. #1143 owns Quad. #1177 owns Quarte. #1198 owns Quint. #1251 owns Quinte. #1255 owns Sext |
| W21-18 | Legal Nonet pairs are only (9,0) (0,9) (8,1) (1,8) (7,2) (2,7) (6,3) (3,6) (5,4) (4,5). (5,3) is Octave. (4,4) is Poise. (4,3) is Septet. (4,2) is Sestet. (3,3) is Poise. (3,2) is Stave. (3,1) is Score. (3,0) is Tally. (2,2) is Poise. (1,1) is Prime Gift. Dual Keep cannot manufacture any Nonet pair. A 6 AP / 3 MP bar that pays 3 AP lands at (3,3) and **fails** Nonet. A 7 AP / 3 MP bar that pays 3 AP lands at (4,3) and **fails** Nonet. A 8 AP / 3 MP bar that pays 3 AP lands at (5,3) and **fails** Nonet. A 9 AP / 3 MP bar that pays 3 AP lands at (6,3) and **fires** |
| W21-19 | Septet Lend (4,3)→(5,4) **manufactures Nonet**. Nonet Lend (5,4)→(6,5) **exits** Nonet. Octave Lend (5,3)→(6,4) **exits** Octave into sum 10, **not** Nonet. Sestet Lend (4,2)→(5,3) **manufactures Octave**, not Nonet. Stave Lend (3,2)→(4,3) **manufactures Septet**, not Nonet. Score Lend (3,1)→(4,2) **manufactures Sestet**, not Nonet. Do not name-wire any hop |
| W21-20 | `spell-nine-span` (occupy-weight 9) is **not** aliased to Nonet Mend. `spell-nona-oath` (Chebyshev = 9) is **not** aliased to Nonet Hood. `spell-penta-span` (occupy-weight 5) is **not** aliased to Hexadeca Span. `spell-undeca-oath` (Chebyshev = 11) is **not** aliased to Hexadeca Span. `spell-kin-turn` is **not** aliased to Triad Turn. `spell-duel-turn` is **not** aliased to Triad Turn |

---

## 11. Source map (read-back)

| Topic | File | Lines |
| :--- | :--- | :--- |
| Live 32-id catalog | `src/frontend/src/data/spellData.ts` | 9–691 |
| Forced `isBaseSpell` | `src/frontend/src/components/WorldExploration.tsx` | 2395–2408 |
| Backend library filter | `src/frontend/src/utils/adminSafety.ts` | 712–718 |
| `OLD_SPELL_NAMES_SET` | `src/frontend/src/components/WorldExploration.tsx` | 2356–2389 |
| `SPELL_ID_CATALOG` | `src/frontend/src/data/bossKits.ts` | 29–62 |
| `SpellConfig` / `areaShape` / `evasion` | `src/frontend/src/types/gameTypes.ts` | 64, 160–241 |
| Caster-tile rule | `src/frontend/src/engine/targeting.ts` | 184–189 |
| Line targeting (unused by data; no `linear`) | `src/frontend/src/engine/targeting.ts` | 576–617 |
| Area = Chebyshev, no `areaShape` | `src/frontend/src/engine/targeting.ts` | 690–727 |
| Trap stub = barrier | `src/frontend/src/engine/spellEngine.ts` | 442–445 |
| `isSwap` → `swapPositions` | `src/frontend/src/engine/spellEngine.ts` | 637, 767–768; WX 9389 |
| Push / attract unused by casts | `src/frontend/src/engine/occupancy.ts` | 482–541 |
| Portals impassable | `src/frontend/src/engine/occupancy.ts` | 13–14, 40 |
| AP-only cast debit | `src/frontend/src/components/WorldExploration.tsx` | 17096–17207 (`17162–17165`) |
| Enemy kits (owned ids) | `src/frontend/src/engine/enemyAI.ts` | 163–185 |
| Healer inference | `src/frontend/src/engine/enemyAI.ts` | 447–452 |
| Summon name fallback | `src/frontend/src/engine/enemyAI.ts` | 217–224 |
| `ENEMY_SUMMON_CAP` | `src/frontend/src/data/gameConstants.ts` | 300 |
| Backend six | `src/backend/lib/admin.mo` | 168–191 |
| Feats | `src/backend/lib/admin.mo` | 309–326 |
| Challenges | `src/frontend/src/utils/challengeCompletion.ts` | 44–103 |
| Boss ids | `src/frontend/src/types/bossTypes.ts` | 390–410 |

**Document status:** PROPOSED. Safe to review and implement in a later, explicit data PR. Not a license to land combat code in the same change as this spec. Coordinate with **#1255** so Deep Gift / Cadence Sext / Deep Plate / Skew Mark / Pair Gait / Pair Plate / Giraffe Stride land once. Coordinate with **#1251** so Octave Mend / Cadence Quinte / Pentadeca Span / Kin Turn land once as Wave-21 family CORE. This catalog stamps as Wave **22** family CORE.

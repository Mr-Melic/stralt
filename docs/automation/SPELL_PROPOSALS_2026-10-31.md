# Spell and Tactical Mechanics — Design Pass 2026-10-31

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1 law [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) through still-open Wave 21 [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-29.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-b517/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-29.md) (**#1313**). Same-day Wave 22 SDE is **running** (`cursor/spell-discovery-evolution-81c1`) and **had not opened a PR at authoring**. If it later claims a unique leftover, **SDE wins**. Prior-day SDE Wave 21 **did** open as **#1313** after #1309 and **won** Octet Gift / Cadence Sept / Octet Plate / Split Mark / Trio Gait / Trio Plate.
- Spell, Discovery & Achievement Admin — still-open ACTION_ID-only PRs (no unique spell ids). **#1291** owns SDA-2026-10-29. Same-day SDA is **running** (`cursor/spell-discovery-achievement-admin-657a`). Oct 29 unique-file PRs **#1277–#1313** (including SDA **#1291**) do not overlap this dated proposal. Oct 30 combat PRs (**#1336–#1353**) do not touch this file.
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) … still-open Wave 21 [`SPELL_PROPOSALS_2026-10-29.md`](https://github.com/Mr-Melic/stralt/blob/cursor/bc-cb413864-f558-48ab-9d6c-74493c0c0c35-3860/docs/automation/SPELL_PROPOSALS_2026-10-29.md) (**#1309**). No Oct 30 tactical PR opened (cron gap); this pass is the next sequential wave.
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); extra doors through #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / **#951** / **#1004** / **#1080** / **#1139** / **#1170** / **#1244** (Wave 21 bosses: `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`) / **#1302** (Wave 22 bosses: `shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate`); tactical extras #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / #1011 / **#1063** / **#1132** / **#1177** / **#1251** / **#1309**. Same-day Wave 23 boss sheets are **running** (`cursor/boss-and-spell-design-d12c`) and **had not opened a PR at authoring**. Extra doors below wait for **Wave 24** sheets. Do **not** restamp Wave 21, Wave 22, or Wave 23 doors.

This is **Wave 22** of the tactical catalog. Live HEAD is unchanged since Waves 4–21. Wave 21 (#1309) filled both-body leftover AP + leftover MP **=== 9** heal (Nonet Mend), remaining `n===6` → `0` (Cadence Sixte), axis-aligned 4×4 occupy (Hexadeca Span, counts as sixteen), caster+ally+hostile leftover invert (Triad Turn), and a Nonet family plus Court Sixte.

**Wave 21 explicitly deferred twelve holes.** Discovery Wave 21 (#1313) already claimed leftover **AP + MP === 8** heal (Octet Gift, one body), remaining `n>7` → `7` (Cadence Sept), leftover **AP + MP === 8** negate (Octet Plate), turn-end leftover **AP − MP === 3** detonate (Split Mark), leftover **exactly 3/0** damage (Trio Gait), leftover **exactly 3/0** negate (Trio Plate), Antelope Stride / Duodeca Oath / Fuse Reel / Wick Skip / Summon Antelope / Reach Toll / Brick Trim / Watch Halt / Fuse Cut / Antelope Gate / Pack Antelope / Antelope Fold. **SDE keeps those.** This pass fills the remaining leftovers Wave 21 left for Wave 22, plus a three-same-side leftover invert that does **not** clone Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, Psalm Turn, Feud Turn, Kin Turn, or Triad Turn:

| Wave-21 leftover | Owner after #1313 / #1309 | This pass |
| :--- | :--- | :--- |
| Leftover AP + leftover MP === **10 AND unequal** | Still open. Tally owns **sum === 3**. Score owns **sum === 4 AND unequal**. Stave owns **sum === 5**. Sestet owns **sum === 6 AND unequal**. Septet owns **sum === 7**. Octave owns **sum === 8 AND unequal**. Nonet owns **sum === 9**. Poise / Equal Gift own **equality ≥ 1** — **(5,5) is Poise**, not this family. Gaunt / Hollow Gift own **0+0**. Prime Gift (#1017) owns **exactly 1/1**. Gait Gift (#1082) owns **one-body AP ≥ 2 AND MP = 0** (overlaps (10,0)). Wide Gift (#1143) owns **one-body AP ≥ 2 AND MP ≥ 1** (overlaps (9,1) (8,2) (7,3) (6,4) — one-body vs both-body). Thin Gift (#1198) owns **one-body 1/0** (no Dectet pair). Deep Gift (#1255) owns **one-body AP === 1 AND MP ≥ 2** (overlaps (1,9) — one-body vs both-body). Octet Gift (#1313) owns **one-body leftover AP + MP === 8** (sum 8, not 10). Lean Gift (#962) owns **AP = 0 and MP ≥ 1** (overlaps (0,10)). Dual Keep max surviving leftover is **2/2** (sum 4) — it **cannot** manufacture sum 10. Wave 16’s directed-diff `AP − MP === 2` **still collides** with Score at (3,1), Sestet at (4,2), Octave at (5,3), **and now Dectet at (6,4)**; **no other Dectet pair has that diff** ((10,0) is 10, (9,1) is 8, (8,2) is 6, (7,3) is 4, (6,4) is 2). The discrete next leftover-sum is **10** (even, **equality banned**). | **This pass:** Dectet Mend — **caster and target** leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**. Legal pairs **(10,0) (0,10) (9,1) (1,9) (8,2) (2,8) (7,3) (3,7) (6,4) (4,6)**. |
| Remaining `7` → `0` | Still open. Sept (#1313) caps `n>7` → `7` (**sevens stay 7**). Sixte (#1309) writes `n===6` → `0`. Sext (#1255) caps `n>6` → `6` (**sevens become 6**). Quinte (#1251) writes `n===5` → `0`. Quint (#1198) caps `n>5` → `5` (**sevens become 5**). Quarte (#1177) writes `n===4` → `0`. Tierce (#1132) writes `n===3` → `0`. Dock (#1063) writes `n===2` → `0`. Snuff (#1011) writes `n===1` → `0`. Quad (#1143) caps `n>4` → `4` (**sevens become 4**). Tern (#1082) caps `n>3` → `3` (**sevens become 3**). Cap (#1017) compresses `n>2` → `2` (**sevens become 2**). Floor (#906) compresses `n>1` → `1`. Rise (#962) pads `n===1` → `2`. Prime (#953) locks `n===0` → `1`. | **This pass:** Cadence Septime (remaining `n===7` → `0`; zeros stay 0; `n===1`…`n===6` and `n>7` unchanged). **Do not mint** `spell-cadence-sept` (SDE) / `spell-cadence-seven` / `spell-cadence-hepta` / `spell-cadence-seventh`. |
| Seventeen-cell occupy | Still open. Hexadeca Span is sixteen (axis-aligned 4×4). Pentadeca Span is fifteen (stretched plus longArm 4 / shortArm 3). Tetradeca Span is fourteen (2×7). Trideca Span is thirteen (plus arm 3). | **This pass:** Heptadeca Span (orthogonal plus **arm 4**, counts as **seventeen**; click = **center**, Hendeca / Trideca / Pentadeca rule, not Hexadeca / Tetradeca / Dodeca / Dec nearest-cell) |
| Invert leftover on **caster and two same-side allies** | Still open. Two-body leftover-invert space is complete. Mixed three-body is Triad Turn (caster + one ally + one hostile). Hymn Turn is **two allies, caster stays**. Kin Turn is **caster + one ally**. | **This pass:** Cloister Turn — invert leftover AP↔MP independently on **the caster and two same-side non-caster allies**; caster **participates**. **Do not mint** `spell-choir-turn` / `spell-pew-turn` / `spell-trio-turn` / `spell-trine-turn` / `spell-duet-turn` / `spell-schola-turn` / `spell-nave-turn` / `spell-anthem-turn`. |
| Target-only sum===9 heal | **Held for SDE.** #1313 took target-only **sum === 8** as Octet Gift. Nonet Mend is both-body sum 9. | **Not this pass.** Do not mint `spell-nonet-gift` / `spell-nine-gift` / `spell-dectet-gift` |
| Target-only sum===10 / sum===8 / sum===7 / sum===6 / sum===5 / sum===4 / sum===3 heal | **Still SDE leftover** (sum===8 is now Octet Gift). Dectet / Octave / Septet / Sestet / Stave / Score / Tally Mend are both-body. | **Not this pass.** Do not mint `spell-dectet-gift` / `spell-octave-gift` / `spell-septet-gift` / `spell-sestet-gift` / `spell-stave-gift` / `spell-score-gift` / `spell-tally-gift` |
| Leftover AP − leftover MP === 2 (diff window as a **heal**) | Skew Mark (#1255) owns the **detonate**. A heal on that directed-diff still collides with Score / Sestet / Octave / **Dectet (6,4)**. | **Not this pass** (Wave 23). Do not mint a `spell-skew-*` family |
| Mid-RAF splice | Held (AGENTS.md) | Still held |
| Fourth `mpCost > 0` walk snipe | Held (Ley Toll / Undertow / Sanguine Toll) | Still held |
| Sixth echo id | Held | Still held |
| Player-owned Hex of Silence | Held (`BOSS_ONLY`) | Still held |
| Player-owned About Hinge | Held (`BOSS_ONLY` on #590) | Still held. Hostile 180° around a pair midpoint is still Pawn Trade. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after the reserved set **and** after #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 / #1177 / #1198 / #1251 / #1255 / #1309 / #1313. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

Same-day Discovery Wave 22 **is running** (`cursor/spell-discovery-evolution-81c1`) and **has not opened a PR at authoring**. **If that catalog later claims a unique leftover below, SDE wins** the unique §11 id; this catalog must not clone it. Do **not** clone #747 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 / #1177 / #1198 / #1251 / #1255 / #1309 / #1313 unique ids. Do **not** ship `spell-parched-mend` / `spell-cadence-floor` (second copy) / `spell-cadence-rise` / `spell-cadence-prime` / `spell-cadence-snuff` (second copy) / `spell-cadence-cap` (second copy) / `spell-cadence-dock` (second copy) / `spell-cadence-tern` (second copy) / `spell-cadence-tierce` (second copy) / `spell-cadence-quad` (second copy) / `spell-cadence-quarte` (second copy) / `spell-cadence-quint` (SDE) / `spell-cadence-quinte` (second copy) / `spell-cadence-sext` (SDE) / `spell-cadence-sixte` (second copy) / `spell-cadence-sept` (SDE) / `spell-tally-gift` / `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-septet-gift` / `spell-octave-gift` / `spell-nonet-gift` / `spell-dectet-gift` / `spell-octet-gift` (second copy) / `spell-prime-gift` (second copy) / `spell-gait-gift` (second copy) / `spell-wide-gift` (second copy) / `spell-thin-gift` (second copy) / `spell-deep-gift` (second copy). Stamp family / observe metadata onto Wave-22 **tactical** ids only. #1313 §0.2 already stamps #1309 as Wave **22** family CORE. **This catalog stamps as Wave 23 family CORE.**

Do **not** mint `spell-ten-mend` / `spell-deca-mend` / `spell-decade-mend` / `spell-denary-mend` / `spell-decem-mend` / `spell-tithe-mend` / `spell-dectet-gift` / `spell-both-dectet` (Dectet Mend owns both-body sum===10 unequal heal; (5,5) stays Poise; (5,4) stays Nonet; (5,3) stays Octave; (4,4) stays Poise; (4,3) stays Septet; (4,2) stays Sestet), `spell-cadence-sept` / `spell-cadence-seven` / `spell-cadence-hepta` / `spell-cadence-seventh` / `spell-cadence-septieme` / `spell-cd-septime` (Cadence Septime owns remaining `7` → `0`; Sept owns `n>7` → `7`; Sixte owns `6` → `0`; Sext owns `n>6` → `6`; Quinte owns `5` → `0`; Quint owns `n>5` → `5`; Quarte owns `4` → `0`; Tierce owns `3` → `0`; Dock owns `2` → `0`; Snuff owns `1` → `0`; Quad owns `n>4` → `4`; Tern owns `n>3` → `3`; Cap owns `n>2` → `2`; Floor owns `n>1` → `1`), `spell-seventeen-span` / `spell-heptakaideca-span` / `spell-plus-span` / `spell-cross-span` (Heptadeca Span owns seventeen; Hexadeca Span owns sixteen), `spell-choir-turn` / `spell-pew-turn` / `spell-aisle-turn` / `spell-mixed-turn` / `spell-trio-turn` / `spell-trine-turn` / `spell-trial-turn` / `spell-mass-turn` / `spell-self-two-ally-turn` / `spell-duet-turn` / `spell-pair-turn` / `spell-schola-turn` / `spell-nave-turn` / `spell-anthem-turn` (Cloister Turn owns caster + two same-side allies independent invert; Choir Hymn is a Wave-1 Discovery heal, **not** this invert; Hymn Turn is two allies with caster **unchanged**), `spell-court-seven` / `spell-court-sept` / `spell-court-seventh` (Court Septime is the mass signature), or `spell-dectet-plate` / `spell-sum-ten-hood` (Dectet Hood owns sum===10 unequal any-range miss; do **not** retag `even_gallery` / Dual Plate / Spent Plate / Gait Plate / Prime Plate / Thin Plate / Wide Plate / Deep Plate / Pair Plate / Octet Plate / Nonet Hood / Octave Hood / Septet Hood / Sestet Hood / Stave Hood / Score Hood / Tally Hood / Poise Hood). Dec Span (`spell-dec-span`, occupy-weight 10) and Deca Oath (`spell-deca-oath`, Chebyshev = 10) are **not** this leftover-sum family. Duodeca Oath (`spell-duodeca-oath`, exact-12 spell gate) is **not** Heptadeca Span.

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is unchanged since 2026-08-31. Discovery is still inert. WX is **19,213** lines (`wc -l`). Same HEAD as Waves 4–21. `WorldExploration.tsx` lives at `src/frontend/src/components/WorldExploration.tsx` (not `engine/`).

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

Live `ENEMY_SUMMON_CAP` is still **2** (`gameConstants.ts` 300). Quad Span (#636) counts as four … Hexadeca Span (#1309) as sixteen on paper; all thirteen are implementation-blocked until that cap (or a dedicated occupy-weight) exists. Heptadeca Span is the same class: **propose the hole, do not pretend it can ship against cap 2**.

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
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** (tests only; `rg` empty in WX) | Unused | Shoulder Bash, Hook Line. Dectet Step / Cloister Turn relocate leftover **pools**, not tiles. Cloister Turn is **not** `isSwap`. |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768 → WX `swapPositions` 9389) | Swap | Pawn Trade / Ward Interpose / Cadence Septime is **not** `isSwap` (cooldown remaining, not tiles) |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, never this set |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire |
| Walk / leftover / force flags | Paper `walkMpSpentThisTurn` (Waves 6–10). Paper `forcedMovedThisTurn` (Wave 9). Leftover AP/MP die at turn end unless Dual Keep / Purse Keep / Stride Keep | Haste grants **now**; Timestep is full **now** | **This pass: Dectet Mend / Dectet Hold / Dectet\* / Must Dectet / Verse Dectet / Cloister Turn / Court Septime** |
| Seventeen-cell occupy | Twin=2 … Hexadeca=16 (4×4) | Absent | **This pass: Heptadeca Span** (orthogonal plus arm 4 = 17) |
| Remaining CD rewrite | Theft **steals**; Imprint **copies**; Swap (#837) **exchanges full maps**; Rest skips **own** tick; Halve **÷2**; Grace skips **starting** the next own CD; Stall **+1**; Lag **+2**; Floor (#906) `n>1` → `1`; Prime (#953) `n===0` → `1`; Rise (#962) `n===1` → `2`; Snuff (#1011) `n===1` → `0`; Cap (#1017) `n>2` → `2`; Dock (#1063) `n===2` → `0`; Tern (#1082) `n>3` → `3`; Tierce (#1132) `n===3` → `0`; Quad (#1143) `n>4` → `4`; Quarte (#1177) `n===4` → `0`; Quint (#1198) `n>5` → `5`; Quinte (#1251) `n===5` → `0`; Sext (#1255) `n>6` → `6`; Sixte (#1309) `n===6` → `0`; Sept (#1313) `n>7` → `7` | Inferno CD 3 is the only live lock | **This pass: Cadence Septime (remaining n===7 → 0; n===1…n===6 and n>7 unchanged)** |
| Leftover sum (AP + MP === N) | Tally family is **sum === 3**. Score family is **sum === 4 AND unequal**. Stave family is **sum === 5**. Sestet family is **sum === 6 AND unequal**. Septet family is **sum === 7**. Octave family is **sum === 8 AND unequal**. Nonet family is **sum === 9**. Poise family is **equality ≥ 1**. Gaunt family is **both leftover 0**. Equal Gift is **target equality ≥ 1**. Prime Gift is **exactly 1/1**. Gait Gift is **one-body AP ≥ 2 AND MP = 0**. Wide Gift is **one-body AP ≥ 2 AND MP ≥ 1**. Thin Gift is **one-body AP === 1 AND MP === 0**. Deep Gift is **one-body AP === 1 AND MP ≥ 2**. Octet Gift is **one-body leftover AP + MP === 8**. Tied Gait is both leftover **exactly 2**. Dual Plate is leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**. Pair Gait / Pair Plate are leftover **exactly 2/0**. Trio Gait / Trio Plate are leftover **exactly 3/0**. | Unused live | **This pass: Dectet\* (sum === 10 AND unequal; even, equality banned)** |
| One-body leftover AP↔MP | Tempo Invert (`invertApMp`, ally/self). Purse Turn (hostile one-body). Bar Cross (two-body **cross**). Duel Turn (two hostiles, independent invert, caster stays). Hymn Turn (two allies, independent invert, caster stays). Psalm Turn (one same-side non-caster + one opposite-side, independent invert, caster stays). Feud Turn (caster + one hostile, independent invert, caster participates). Kin Turn (caster + one ally, independent invert, caster participates). Triad Turn (caster + one ally + one hostile, independent invert, caster participates). | Absent live | **This pass: Cloister Turn (caster + two same-side allies, independent invert, caster participates).** Do not reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp` / `invertTwoAlliesLeftoverApMp` / `invertMixedSidesLeftoverApMp` / `invertCasterAndHostileLeftoverApMp` / `invertCasterAndAllyLeftoverApMp` / `invertCasterAllyAndHostileLeftoverApMp`. |

### 1.4 Reserved id tombstone (do not collide)

**Wave 1 tactical:**  
`spell-shoulder-bash`, `spell-hook-line`, `spell-mist-step`, `spell-grave-bell`, `spell-root-snare`, `spell-lens-shift`, `spell-ward-plate`, `spell-pain-link`, `spell-cleanse-rite`, `spell-cinder-tile`, `spell-tripwire`, `spell-glyph-tax`, `spell-stone-turret`, `spell-turret-shard`, `spell-blood-familiar`, `spell-ricochet-mark`, `spell-void-anchor`.

**Discovery Wave 1:**  
`spell-quiet-hex`, `spell-chain-ward`, `spell-crosswind`, `spell-glass-shot`, `spell-ember-wake`, `spell-split-mark`, `spell-phase-slip`, `spell-sever-tether`, `spell-overcast`, `spell-second-wind`, `spell-choir-hymn`, `spell-oath-bind`, `spell-leech-tempo`, `spell-null-brand`, `spell-false-retreat`, `spell-blood-benediction`, `spell-ward-interpose`, `spell-martyr-fuse`, `spell-hex-of-silence`. Formal blink id remains `spell-phase-slip` (never add `spell-phase-step`). Discovery Wave 1 `spell-split-mark` is **not** #1313’s turn-end leftover AP−MP===3 detonate (that unique leftover kept the same string on a later generation — do not mint a third).

**Boss adaptations (`BOSS_AND_SPELL_DISCOVERY.md` §5.2):**  
`spell-ember-step`, `spell-caltrop`, `spell-shock-glyph`, `spell-exsanguinate`, `spell-glyph-snare`, `spell-vault`, `spell-brood-ward`, `spell-aftershock`, `spell-rot-brand`, `spell-echo-cast`.

**Wave 2 tactical / Discovery Wave 2 / Wave 3 tactical / Discovery Wave 3 / Wave 4 tactical / Discovery Wave 4 / Memory Wave 5 SDE / Wave 5–20 tactical / Discovery Waves 6–20:** reserved in Waves 2–21 documents and in #1255 / #1313 §0.1. Do not collide. Memory Wave-5 SDE ids stay tombstoned (`spell-gaze-sill` … `spell-void-span`).

**Wave 21 tactical (#1309 — still open; never re-propose / never clone).** Unique remaining ids stamp as Wave-22 family CORE:  
`spell-nonet-mend`, `spell-cadence-sixte`, `spell-hexadeca-span`, `spell-triad-turn`, `spell-nonet-hood`, `spell-nonet-sting`, `spell-nonet-step`, `spell-nonet-sill`, `spell-nonet-hold`, `spell-nonet-lend`, `spell-nonet-sip`, `spell-nonet-post`, `spell-nonet-bounce`, `spell-must-nonet`, `spell-verse-nonet`, `spell-court-sixte`.

**Discovery Wave 21 (#1313 — still open; never re-propose / never clone; SDE wins Octet Gift / Cadence Sept / Octet Plate / Split Mark / Trio Gait / Trio Plate):**  
`spell-antelope-stride`, `spell-duodeca-oath`, `spell-fuse-reel`, `spell-antelope-bite`, `spell-split-mark`, `spell-octet-plate`, `spell-wick-skip`, `spell-trio-gait`, `spell-summon-antelope`, `spell-octet-gift`, `spell-cadence-sept`, `spell-reach-toll`, `spell-brick-trim`, `spell-watch-halt`, `spell-trio-plate`, `spell-fuse-cut`, `spell-antelope-gate`, `spell-pack-antelope`, `spell-antelope-fold`.

**Wave 20 tactical (#1251) / Discovery Wave 20 (#1255):** reserved in those PRs. #1255 SDE won Deep Gift / Cadence Sext / Deep Plate / Skew Mark / Pair Gait / Pair Plate.

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` and `spell-blood-tithe` (tactical W2 vs Discovery W2). `spell-cadence-floor` (tactical #890 vs Discovery #906 — **SDE wins**; this pass does not add a third). `spell-split-mark` (Discovery Wave 1 vs #1313 leftover AP−MP===3).

**Fantasy overlaps to not clone:** Short Sight ≈ Paper Wind; Tempo Gift ≈ Loan Tempo; Goad ≈ Taunt Oath; Rime Tile ≈ Rime Sheet; Lens Shift / Overcast; Poise Mend ≈ Equal Gift (both-body vs target equality); Tally Mend ≈ Lean Gift; Score Mend ≈ Prime Gift; Stave Mend ≈ Gait Gift; Sestet Mend ≈ Wide Gift; Septet Mend ≈ Thin Gift; Octave Mend ≈ Deep Gift / Octet Gift (both-body sum 8 unequal vs one-body 1/≥2 vs one-body sum 8 — **filled, not a clone**); Nonet Mend ≈ Octet Gift (both-body sum 9 vs one-body sum 8); Cadence Floor / Prime / Rise / Snuff / Cap / Dock / Tern / Tierce / Quad / Quarte / Quint / Quinte / Sext / Sixte / Sept are **filled** (Septime is `7→0`, not Sept’s `n>7→7`); Tempo Invert ≈ Purse Turn; Purse Turn ≈ Duel Turn; Duel Turn ≈ Hymn Turn; Hymn Turn ≈ Psalm Turn; Psalm Turn ≈ Feud Turn; Feud Turn ≈ Kin Turn; Kin Turn ≈ Triad Turn; Triad Turn ≈ Cloister Turn (caster+ally+hostile vs caster+two allies — **this pass fills the three-same-side card, does not clone the mixed three-body card**). Cloister Turn is **not** Choir Hymn. Cloister Turn is **not** Hymn Turn. Dectet Mend is **not** Dec Span. Dectet Mend is **not** Deca Oath. Heptadeca Span is **not** Duodeca Oath.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier; Dry Mend / Dry Gait / Parched Mend; Hollow Gift / Gaunt Mend; Cadence Swap / Cadence Floor / Cadence Prime / Cadence Rise / Cadence Snuff / Cadence Cap / Cadence Dock / Cadence Tern / Cadence Tierce / Cadence Quad / Cadence Quarte / Cadence Quint / Cadence Quinte / Cadence Sext / Cadence Sixte / Cadence Sept.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved or live) |
| :--- | :--- | :--- |
| SUPPORT leftover-sum heal | Both-body leftover AP + leftover MP **=== 10 AND unequal** | Tally Mend (sum 3); Score Mend (sum 4 unequal); Stave Mend (sum 5); Sestet Mend (sum 6 unequal); Septet Mend (sum 7); Octave Mend (sum 8 unequal); Nonet Mend (sum 9); Poise Mend / Equal Gift (equality, including (5,5)); Gaunt / Hollow Gift (0+0); Dry Mend / Dry Gait; Lean Gift; Prime Gift (exactly 1/1); Gait Gift (AP≥2/MP=0); Wide Gift (AP≥2/MP≥1); Thin Gift (1/0); Deep Gift (1/≥2); Octet Gift (one-body sum 8) |
| CONTROL remaining 7→0 | Ready-seven ids (`n===7`) write `0` | Snuff `1→0`; Dock `2→0`; Tierce `3→0`; Quarte `4→0`; Quinte `5→0`; Sixte `6→0`; Rise `1→2`; Prime `0→1`; Floor `n>1→1`; Cap `n>2→2`; Tern `n>3→3`; Quad `n>4→4`; Quint `n>5→5`; Sext `n>6→6`; Sept `n>7→7`; Stall/Lag pad; Flush/Crack →0 |
| SUMMONS seventeen-cell occupy | Orthogonal plus arm 4, counts as seventeen | Twin…Hexadeca Span |
| CONTROL caster+two-allies invert | Leftover AP↔MP on **three same-side bodies**; caster participates | Tempo Invert (ally/self); Purse Turn (one hostile); Bar Cross (two-body cross); Duel Turn (two hostiles); Hymn Turn (two allies, caster stays); Psalm Turn (mixed, caster stays); Feud Turn (caster + one hostile); Kin Turn (caster + one ally); Triad Turn (caster + one ally + one hostile) |
| DEFENSE / DAMAGE / TERRAIN dectet family | Hood / Sting / Step / Sill / Hold / Lend / Sip / Post / Bounce / Must / Verse | Nonet\* / Octave\* / Septet\* / Sestet\* / Stave\* / Score\* / Tally\* / Poise\* / Gaunt\* / Lean\* / Dry\* / Octet Plate / Trio Gait |
| SIGNATURE mass Septime | Court Septime | Court Sixte / Court Quinte / Court Quarte / Court Tierce / Court Dock / Court Snuff / Court Prime / Court Floor / Court Lag / Court Imprint |

**Still open after this wave (do not fill today):** mid-RAF splice; fourth walk-MP snipe; sixth echo id; player-owned Hex of Silence; player-owned About Hinge; leftover AP − leftover MP === **2** as a heal (diff window; (3,1) is Score; (4,2) is Sestet; (5,3) is Octave; (6,4) is Dectet; Skew Mark owns the detonate); remaining `n===8` → `0` (do **not** name this Cadence Octave — Octave family owns leftover-sum 8); eighteen-cell occupy; **target-only** sum===10 heal (leave for SDE); **target-only** sum===9 / sum===8 (Octet Gift) / sum===7 / sum===6 / sum===5 / sum===4 / sum===3 heal (still SDE leftovers); leftover AP + leftover MP === **11**; invert leftover on **caster and two hostiles** (Cloister Turn already spends the three-same-side card; Triad Turn already spends the mixed three-body). Those stay Wave 23 so this pass stays discrete.

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
9. `inferArchetype` still treats any `healAmount > 0` as healer (`enemyAI.ts` 447–452). Dectet Mend **must not** land in non-healer CORE; keep `healAmount: 0` on the row.

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 22 ids to `starterSpells` as base. Do **not** land Wave-22 data before Wave-1 ownership split (`SDE-2026-08-31-001`). CDA-030 (#982) still freezes **shipping** Wave-15/16 live rows until those gates exist; this document is sequential Wave 22 **design only**.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "heptadecaspan"` / `"dectetpost"` are **string enums on the config**, not a parse of `"Heptadeca Span"` / `"Dectet Post"`.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Heptadeca Span / Dectet Post **arming** (body placed, AP spent) **is** observation. A later occupy / detonate is **not** a second observe.
- Cadence Septime **resolve** (even if every remaining was already ≠ 7) **is** observation if AP was spent.
- Do not require “see it N times”. Wave 22 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.
- Do not stamp `survivor` (Last Ember / Last Ward). #646 / #679 / #747 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 / #1177 / #1198 / #1251 / #1255 / #1309 / #1313 left that feat leftover on purpose.

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

Already claimed — do not reuse as the **only** door. Live 19 first-wins, #367, #406, #463 extras, #474, #518, #525 extras, #563 extras, #590 extras, #636 extras, #646 / #679 leftovers, #695 extras, #726 extras, #747 leftovers, #753, #787 extras, #802 leftovers, #808, #836, #837 leftovers, #849 extras, #890 extras, #903, #906 leftovers, #951, #953 extras, #962 leftovers, #1004, #1011 extras, #1017 leftovers, #1063 extras, #1080, #1082 leftovers, #1132 extras, #1139, #1143 leftovers, #1170 (`trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`), #1177 extras (`septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent`), #1198 leftovers (`camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave` / `camel_precentor` / `camel_fold_regent`), #1244 (`sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`), #1251 extras (`octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` — still wait; #1302 did not take them), #1255 leftovers (`giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave` / `giraffe_precentor` / `giraffe_fold_regent`), #1302 (`shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate`), #1309 extras (`nonet_cantor` / `sixte_precentor` / `span_hexadeca` / `court_sixte_regent` — wait for Wave 23 sheets), #1313 leftovers (`antelope_gallery` / `duodeca_nave` / `fuse_aisle` / `split_pulpit` / `wick_nave` / `antelope_precentor` / `antelope_fold_regent`).

**New proposed extra doors for the boss designer (Wave 24 sheets; not live `BOSS_IDS`; #1244 already owns Wave 21; #1302 already owns Wave 22 leftover #695/#726/#787 doors; same-day Wave 23 sheets are running and must not take these):**

| Door | Spell |
| :--- | :--- |
| `dectet_cantor` first-win | Dectet Mend MULTI child (observe+win still grants). `nonet_cantor` stays Nonet Mend. `octave_cantor` stays Octave Mend. Equal Gift / Lean Gift / Prime Gift / Gait Gift / Wide Gift / Thin Gift / Deep Gift / Octet Gift have **no** extra door — do not invent `equal_cantor` / `ten_cantor` / `deca_cantor` / `octet_cantor`. |
| `septime_precentor` first-win | Cadence Septime MULTI child. `sixte_precentor` stays Sixte. `sept_precentor` is **not** minted (SDE Cadence Sept has no extra door here). Do **not** mint `sept_precentor` / `seven_precentor` / `hepta_precentor` / `seventh_precentor`. |
| `span_heptadeca` first-win | Heptadeca Span MULTI child. `span_hexadeca` stays Hexadeca Span. `span_pentadeca` stays Pentadeca Span. Do **not** mint `span_seventeen` / `span_plus4`. |
| `court_septime_regent` kit only | Court Septime (`NOT_PLAYER_LEARNABLE`). `court_sixte_regent` stays Court Sixte. Do **not** mint `court_seven_regent` / `court_sept_regent`. |

No feat/challenge restamp. Do not stamp leftover `survivor`.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables.

Reuse from earlier waves where the meaning is identical: `requireCasterLeftoverSumEq`, `requireTargetLeftoverSumEq`.

**New keys (Wave 22 only):**

```text
dectetSumN,                              // 10
dectetForbidEqual,                       // required — (5,5) is Poise
dectetMendAmount,                        // Dectet Mend
septimeRemainingCdsEq7To0,               // Cadence Septime / Court Septime
heptadecaSpanCells, heptadecaArm,        // Heptadeca Span plus arm 4
invertCasterAndTwoAlliesLeftoverApMp,    // Cloister Turn — NOT invertTwoAllies / invertCasterAndAlly
cloisterAllySearchRadius, cloisterAllyCount, // 3 / 2
dectetHoodNextHit,                       // Dectet Hood
dectetLeftoverSumEq, dectetStingBonus,   // Dectet Sting
dectetStepNeedSumEq, dectetStepAdj,      // Dectet Step
dectetSillNeedSumEq, dectetSillDamage, dectetSillDuration,
dectetHoldWhileSumEq, dectetHoldDuration,
dectetLendAp, dectetLendMp, requireTargetSumEqLend,
dectetSipAp, requireTargetSumEqSip,
dectetPostDetonateDamage, dectetPostNeedSumEq,
dectetBounceNeedSumEq, dectetBounceSearchRadius, dectetBounceCount,
mustNonStrikeUnlessSumEqAndSpendsLastAp,  // Must Dectet (shared shape; dectetSumN + dectetForbidEqual distinguish)
verseDectetUntilSumEq,
courtSeptimeExcludeCaster
```

If a key is missing, the rider does not fire. **Must Dectet reads leftover AP + leftover MP before this (their) spell’s AP is paid** — same pre-spend contract as Must Nonet / Must Octave / Must Septet / Must Sestet / Must Stave / Must Score / Must Tally / Must Poise / Must Gaunt. Even sum — **`dectetForbidEqual` is required**.

Nested kit-only id: none. Heptadeca Span / Dectet Post are empty-kit bodies, not casters.

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Cadence Septime’s ready-unlock of remaining-7 is paid in **currently remaining 7**, not in extra AP. Dectet Mend’s 8 is paid in **two sum===10 unequal bars on two bodies** after a 3-AP debit (Nonet Mend is the two-body sum-9 cousin; Octave Mend is the two-body sum-8-unequal cousin). Dual Keep cannot fake this window — the player (or Haste / Tempo Gift / Octave Lend / a 10 AP / 3 MP bar after a 3-AP spend) has to actually sit on ten.

Do **not** put Must Dectet in the same CORE as a Strike-only dectet lock (this pass does not ship that lock). Do **not** CORE Dectet Hood with Spent Plate, Gait Plate, Dual Plate, Prime Plate, Thin Plate, Wide Plate, Deep Plate, Pair Plate, Trio Plate, Octet Plate, Poise Hood, Tally Hood, Score Hood, Stave Hood, Sestet Hood, Septet Hood, Octave Hood, or Nonet Hood. Do **not** CORE Dectet Mend with Hollow Gift, Gaunt Mend, Poise Mend, Equal Gift, Tally Mend, Score Mend, Stave Mend, Sestet Mend, Septet Mend, Octave Mend, Nonet Mend, Lean Gift, Prime Gift, Gait Gift, Wide Gift, Thin Gift, Deep Gift, or Octet Gift. Do **not** CORE Cloister Turn with Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, Psalm Turn, Feud Turn, Kin Turn, or Triad Turn. Do **not** CORE Cadence Septime with Cadence Sept, Sixte, Sext, Quinte, Quint, Quarte, Tierce, Dock, Snuff, Tern, Quad, Rise, Prime, Floor, Cap, Halve, Trim, Crack, or Flush.

---

## 5. Proposed spells (Wave 22)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-dectet-mend`

NAME: Dectet Mend  
ROLE: SUPPORT — heal if caster **and** target leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"requireCasterLeftoverSumEq":true,"requireTargetLeftoverSumEq":true,"dectetSumN":10,"dectetForbidEqual":true,"dectetMendAmount":8}`. If **both** caster and target have leftover AP + leftover walk MP **=== 10 AND leftover AP ≠ leftover MP** at resolve (after this spell’s 3 AP is paid), heal the target 8 through the existing heal helper. If either sum ≠ 10 or either body is tied, fizzle rider (AP spent, no HP). Walk / force-move flags do **not** substitute. Distinct from Nonet Mend (#1309, **both bodies leftover AP + leftover MP === 9**), Octave Mend (#1251, **both bodies leftover AP + leftover MP === 8 AND leftover AP ≠ leftover MP**), Septet Mend (#1177, **both bodies leftover AP + leftover MP === 7**), Sestet Mend (#1132, **both bodies leftover AP + leftover MP === 6 AND leftover AP ≠ leftover MP**), Stave Mend (#1063, **both bodies leftover AP + leftover MP === 5**), Score Mend (#1011, **both bodies leftover AP + leftover MP === 4 AND leftover AP ≠ leftover MP**), Tally Mend (#953, **both bodies leftover AP + leftover MP === 3**), Poise Mend (#890, **both bodies leftover AP === leftover MP ≥ 1** — **(5,5) is Poise**, not Dectet), Equal Gift (#906, **target only** leftover AP == leftover MP ≥ 1; caster leftover unread), Prime Gift (#1017, **target leftover AP exactly 1 AND leftover MP exactly 1**), Gait Gift (#1082, **one body leftover AP ≥ 2 AND leftover MP = 0** — (10,0) is Gait Gift **and** a Dectet pair; Dectet Mend still requires **both** bodies), Wide Gift (#1143, **one body leftover AP ≥ 2 AND leftover MP ≥ 1** — (9,1) (8,2) (7,3) (6,4) are Wide Gift **and** Dectet pairs; Dectet Mend still requires **both** bodies), Thin Gift (#1198, **one body leftover AP === 1 AND leftover MP === 0** — no Dectet pair), Deep Gift (#1255, **one body leftover AP === 1 AND leftover MP ≥ 2** — (1,9) is Deep Gift **and** a Dectet pair; Dectet Mend still requires **both** bodies), Octet Gift (#1313, **one body leftover AP + leftover MP === 8** — sum 8, not 10), Hollow Gift (#837, **target only** leftover AP=0 **and** leftover MP=0), Gaunt Mend (#849, **both bodies leftover AP=0 and leftover MP=0**), Lean Gift (#962, leftover **AP = 0 and leftover MP ≥ 1** — (0,10) is Lean Gift **and** a Dectet pair), Dry Mend (#747, both leftover **AP = 0**, MP unconstrained), Dry Gait (#802, both leftover **MP = 0**, AP unconstrained), Ready Sting (leftover AP≥1 **and** MP≥1 with **no sum**), Tied Gait (#906, leftover AP **and** leftover MP **exactly 2**), Dual Plate (#1017, leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** — (4,4) is Dual Plate **and** Poise, **not** Dectet; (6,4) is Dual Plate **and** a Dectet pair — Dectet Mend still requires **both** bodies **and** the sum). Legal pairs: (10,0) (0,10) (9,1) (1,9) (8,2) (2,8) (7,3) (3,7) (6,4) (4,6). The decision: two bodies **sum to 10 and are unequal** — Dual Keep 2/2 is Poise **and** Score-blocked, **not** Dectet (sum 4); Dual Keep **cannot** open Dectet; a 6 AP / 3 MP bar that pays this 3 AP lands at **(3,3)** and **fails** (that is Poise Mend’s window); a 7 AP / 3 MP bar that pays 3 AP lands at **(4,3)** and **fails** (that is Septet Mend’s window); a 8 AP / 3 MP bar that pays 3 AP lands at **(5,3)** and **fails** (that is Octave Mend’s window); a 9 AP / 3 MP bar that pays 3 AP lands at **(6,3)** and **fails** (that is Nonet Mend’s window); a 10 AP / 3 MP bar that pays 3 AP lands at **(7,3)** and **fires**; sit on 10 leftover AP and 3 leftover MP after paying the heal, or Octave Lend a (5,3) into (6,4). `healAmount` stays 0 on the row so `inferArchetype` (`enemyAI.ts` 447–452) does not treat a kit that only *carries* this id as healer; **healer CORE only** when the row is in a live pool. Even sum — **`dectetForbidEqual` is required.**  
DURATION: instant  
SCALING: 8 follows heal% if any; amount otherwise fixed.  
SYNERGIES: Haste / Tempo Gift / Timestep to bank ten after the 3-AP spend; Octave Lend **manufactures** Dectet ((5,3)→(6,4)); Dectet Lend **exits** to 12; Cloister Turn **keeps** sum 10 on a body that was already in-window.  
COUNTERPLAY: Spend a pool so either body leaves 10; Dual Keep (caps at 2, **blocks** Dectet); sit on 5/5 (Poise) or 5/4 (Nonet) or 5/3 (Octave) or 4/4 (Poise) or 4/3 (Septet) or 4/2 (Sestet) or 3/3 (Poise) or 3/2 (Stave) or 3/1 (Score) or 2/1 (Tally) or 2/2 (Poise) or 1/1 (Prime Gift).  
POWER_BUDGET: Standard heal, gated on **two** leftover sums of 10 unequal (four leftover reads + two inequality checks). Blood Mend is 12 ungated self. Nonet Mend is 8 on **two sum-9** bodies. Octave Mend is 8 on **two sum-8 unequal** bodies. Dual Keep cannot fake this.  
AI_USAGE: `aiHint: "heal_if_both_bodies_leftover_ap_plus_mp_eq_10_unequal"`. Cantors / bishops. Skip if either leftover sum ≠ 10 or either body is tied. **Healer CORE only.** Do not dump leftover **only** to enable this if a Strike would kill.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop","queen"], levelZoneMin: 1 }`. MULTI child `dectet_cantor`.  
EDGE_CASES: Targeting ally already allows self (`targeting.ts` 184–189). Self-cast requires the caster’s leftover sum === 10 **and** leftover AP ≠ leftover MP (two keys, two reads of one body). Self-cast at leftover 5/5 **does not** collide with Poise Mend / Equal Gift — equality fails `dectetForbidEqual`. Self-cast at leftover 5/4 **does not** collide with Nonet Mend — sum 9 fails `dectetSumN`. Self-cast at leftover 5/3 **does not** collide with Octave Mend — sum 8 fails `dectetSumN`. Self-cast at leftover 4/3 **does not** collide with Septet Mend — sum 7 fails `dectetSumN`. Self-cast at leftover 0/0 **does not** collide with Hollow Gift / Gaunt Mend — sum 0 fails `dectetSumN`. Self-cast at leftover 10/0 **does** fire, and is **not** a Gait Gift clone (Gait Gift is one-body AP≥2/MP=0 with no second-body read). Self-cast at leftover 6/4 **does** fire, and is **not** a Wide Gift clone **and not** a Skew Mark clone (Skew Mark is turn-end AP−MP===2 detonate, not a heal). Self-cast at leftover 1/9 **does** fire, and is **not** a Deep Gift clone. Player-side HP actually increased → `challengeHealUsedRef`. Missing keys → no heal. Missing `dectetSumN` or `dectetForbidEqual` → fail closed. Do not clone Nonet Mend / Octave Mend / Septet Mend / Sestet Mend / Stave Mend / Score Mend / Tally Mend / Poise Mend / Equal Gift / Gaunt Mend / Lean Gift / Prime Gift / Gait Gift / Wide Gift / Thin Gift / Deep Gift / Octet Gift / Dry Mend / Dry Gait. Target-only sum===10 heal stays Wave 23 / SDE. Target-only sum===8 is Octet Gift (#1313). If same-day SDE Wave 22 claims this leftover, **SDE wins** — keep both-body vs their target-only the way Nonet vs Octet Gift / Octave vs Deep Gift already split. Do not mint `spell-ten-mend` (Dec Span is occupy-weight 10). Do not mint `spell-deca-mend` (Deca Oath is Chebyshev = 10).  
IMPLEMENTATION_COMPLEXITY: LOW — four leftover reads + two inequality checks + existing heal helper.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-dectet-mend
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
effectParams: {"requireCasterLeftoverSumEq":true,"requireTargetLeftoverSumEq":true,"dectetSumN":10,"dectetForbidEqual":true,"dectetMendAmount":8}
```

---

### SPELL_ID: `spell-cadence-septime`

NAME: Cadence Septime  
ROLE: CONTROL — remaining CDs `n===7` become `0`  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"septimeRemainingCdsEq7To0":true}`. For each spell id in the **target’s** remaining-CD map with `n === 7`, write `0`. Zeros stay 0. Remaining `n===1` **unchanged** (Snuff’s window). Remaining `n===2` **unchanged** (Dock’s window). Remaining `n===3` **unchanged** (Tierce’s window). Remaining `n===4` **unchanged** (Quarte’s window). Remaining `n===5` **unchanged** (Quinte’s window). Remaining `n===6` **unchanged** (Sixte’s window). Remaining `n>7` **unchanged** (Sept / Sext / Quint / Quad / Tern / Cap / Floor territory). Target **keeps every spell**. Once/battle flags and spell levels are **not** CDs. Distinct from Cadence Sept (#1313, remaining `n>7` → `7` — **sevens stay 7**), Cadence Sixte (#1309, remaining `n===6` → `0` — sixes, not sevens), Cadence Sext (#1255, remaining `n>6` → `6` — **sevens become 6**, not 0), Cadence Quinte (#1251, remaining `n===5` → `0` — fives, not sevens), Cadence Quint (#1198, remaining `n>5` → `5` — **sevens become 5**, not 0), Cadence Quarte (#1177, remaining `n===4` → `0` — fours, not sevens), Cadence Tierce (#1132, remaining `n===3` → `0`), Cadence Dock (#1063, remaining `n===2` → `0`), Cadence Snuff (#1011, remaining `n===1` → `0`), Cadence Quad (#1143, remaining `n>4` → `4` — **sevens become 4**, not 0), Cadence Tern (#1082, remaining `n>3` → `3` — **sevens become 3**, not 0), Cadence Cap (#1017, remaining `n>2` → `2` — **sevens become 2**, not 0), Cadence Rise (#962, remaining `n===1` → `2`), Cadence Prime (#953, remaining `n===0` → `1`), Cadence Floor (#906, remaining `n>1` → `1`; **zeros stay 0**; would peel a 7 to 1, **not** to 0), Cadence Swap (#837, **exchange full remaining maps**), Cadence Lag (#849, remaining `n>0` → `n+2`), Cadence Stall (#590, remaining `n>0` → `n+1`; zeros stay 0), Cadence Stretch (#636, remaining ×2), Cadence Theft (#411, **steals** remaining), Cadence Imprint (#787, **copies** onto the caster; target keeps), Cadence Rest (#747, **own** remaining do not tick), Cadence Grace (#802, **next own spell does not start** its cooldown), Cadence Halve (#726, **÷2** on the hostile), Cadence Trim / Shave / Pin / Crack / Flush. The decision: their Inferno is sitting on remaining 7 — Septime makes it legal **this turn**; Sixte would have needed remaining 6; Sept would have **left** a 7; Sext would have written 6; Quint would have written 5; Quad would have written 4; Tern would have written 3; Cap would have written 2; Floor would have written 1.  
DURATION: instant rewrite of remaining `n===7`  
SCALING: none.  
SYNERGIES: Sept a 9 to 7, **then** Septime the 7 to 0 on a **later** turn (do **not** CORE Sept with Septime). Verse Dectet so the unlocked id is also their last verse.  
COUNTERPLAY: Sit remaining at 1 (Snuff’s problem) or at 2 (Dock’s problem) or at 3 (Tierce’s problem) or at 4 (Quarte’s problem) or at 5 (Quinte’s problem) or at 6 (Sixte’s problem) or at 8+ (Sept / Sext / Quint / Quad / Tern / Cap / Floor’s problem); recast before Septime; Cadence Break your own remaining.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **unlock remaining-7**, not a silence and not a mass zero.  
AI_USAGE: `aiHint: "septime_remaining_cds_eq_7_to_0"`. Scribes / tempo. Skip if the target has no remaining `n===7`. Do **not** CORE with Sept / Sixte / Sext / Quinte / Quint / Quarte / Tierce / Dock / Snuff / Quad / Tern / Cap / Floor / Rise / Prime.  
DISCOVERY_ELIGIBILITY: true. MULTI child `septime_precentor`. `pieceTypes: ["bishop","queen"], levelZoneMin: 1`  
EDGE_CASES: Missing key → no rewrite. Do not write `spellLevelValues`. Do not reset Dual Keep’s once/battle. Preview must show which remaining drop from 7 to 0. All-non-7 remaining → fizzle rider (AP spent, observe). Do **not** reuse `sixteRemainingCdsEq6To0` / `quinteRemainingCdsEq5To0` / `quarteRemainingCdsEq4To0` / `tierceRemainingCdsEq3To0` / `dockRemainingCdsEq2To0` / `snuffRemainingCdsEq1To0` / `capRemainingCdsAbove2To2` / `capRemainingCdsAbove3To3` / `capRemainingCdsAbove7To7` / `floorRemainingCdsTo1` / `primeRemainingCdsFrom0`. Do **not** mint `spell-cadence-sept` (SDE #1313 owns that as `n>7→7`). Do **not** mint `spell-cadence-seven` / `spell-cadence-hepta` / `spell-cadence-seventh` (#1313 tombstone). If same-day SDE Wave 22 claims this leftover, **SDE wins** — do not keep a second Septime id. Sept already owns `n>7→7`; this card is `7→0` even if SDE later stamps a second Sept alias.  
IMPLEMENTATION_COMPLEXITY: LOW — walk remaining map, write 0 when n===7.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-cadence-septime
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
effectParams: {"septimeRemainingCdsEq7To0":true}
```

---

### SPELL_ID: `spell-heptadeca-span`

NAME: Heptadeca Span  
ROLE: SUMMONS — orthogonal plus arm 4 occupy; counts as **seventeen**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 4  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "heptadecaspan"`, `summonLifespan: 4`, empty kit (`summonUnitDef` with `pieceType: ""` / zero scales — a body, not a caster). `effectParams: {"heptadecaSpanCells":17,"heptadecaArm":4}`. Click a free ground tile. That click is the **center** of an orthogonal plus (Hendeca / Trideca / Pentadeca’s placement rule, **not** Hexadeca / Tetradeca / Dodeca / Dec’s nearest-cell rule). Occupy the center plus four cardinal arms of length **4** (1 + 4×4 = **17** cells). A plus with arm 4 **has** a unique center cell — that is why this card uses center, not nearest-cell. Footprint is 17 cells. All 17 cells must be free and in-bounds (`isCellFree`); else fizzle (AP spent). One combatant id, seventeen-cell footprint. Every cell of the 17 is occupied (not a cage hole — Oct Span’s hollow 3×3 stays Oct Span). Counts as **seventeen** toward the summon cap. Distinct from Hexadeca Span (#1309, axis-aligned **4×4** = 16, click = **nearest cell to caster**), Pentadeca Span (#1251, stretched plus **longArm 4 / shortArm 3** = 15, click = **center**), Tetradeca Span (#1177, axis-aligned **2×7** = 14, click = **nearest cell to caster**), Trideca Span (#1132, orthogonal plus **arm 3** = 13, click = **center**), Dodeca Span (#1063, axis-aligned **3×4** = 12, click = **nearest cell to caster**), Hendeca Span (#1011, stretched plus longArm 3 / shortArm 2 = **11**, click = **center**), Dec Span (#953, axis-aligned **2×5** = 10, click = nearest cell), Nine Span (#890, solid 3×3 = 9, click = center), Oct Span (#849, hollow 3×3 = 8), Sept Span (#726, stretched plus longArm 2 / shortArm 1 = 7), Penta Span (plus arm 1 = 5), Six Span (2×3 = 6), Quad Span (2×2 = 4), Triple / Twin Span. Empty kit.  
DURATION: lifespan 4 or until the body dies (frees all seventeen)  
SCALING: none (occupy, not damage).  
SYNERGIES: Dectet Hold so they cannot walk around the plus; Score / Tally / Stave / Sestet / Septet / Octave / Nonet / Dectet Sill on a cell **beside** the block, not on it (occupied).  
COUNTERPLAY: Coup the body; blink past; File Lance along an arm; occupy-weight still 2 live so this card **does not ship** until a dedicated occupy-weight exists.  
POWER_BUDGET: Heavy 4 / CD 3 / 0 damage. Power is **seventeen occupied cells**. Implementation-blocked while `ENEMY_SUMMON_CAP === 2`.  
AI_USAGE: `aiHint: "heptadeca_span_if_plus_arm_4_free_and_cuts_a_file"`. Masons / rooks ELITE. Skip if any of the 17 is occupied / off-map / a portal. Missing hint → drop id.  
DISCOVERY_ELIGIBILITY: true. MULTI child `span_heptadeca`. `pieceTypes: ["rook"], levelZoneMin: 2`  
EDGE_CASES: **Do not ship while `ENEMY_SUMMON_CAP === 2` without occupy-weight.** Never parse `"Heptadeca Span"` / `"Seventeen"` / `"Plus4"`. One id, seventeen cells — destroying the body frees all seventeen. Player-side Heptadeca Span counts toward the **player** summon economy, not `ENEMY_SUMMON_CAP`. Missing `heptadecaSpanCells` → do not spawn a 1-cell body and call it Heptadeca Span. Missing `heptadecaArm` → do not guess arm 3 (that is Trideca Span), stretched plus longArm 4 / shortArm 3 (that is Pentadeca Span), or 4×4 (that is Hexadeca Span). Off-map cell → fizzle. Do not mint `spell-seventeen-span` / `spell-heptakaideca-span` / `spell-plus-span` / `spell-cross-span`. Cardinal click with `dx===0 && dy===0` is illegal (`freeCells` / caster tile) — the center cannot be the caster’s cell. Click is **center**, not nearest cell (Hexadeca’s nearest-cell stays Hexadeca; a plus **has** a unique center). Do not alias Dec Span (`spell-dec-span`, occupy-weight 10) or Quad Span (`spell-quad-span`, occupy-weight 4). Do not alias Duodeca Oath (`spell-duodeca-oath`, exact-12 spell gate) or Undeca Oath (`spell-undeca-oath`, Chebyshev = 11 spell gate).  
IMPLEMENTATION_COMPLEXITY: HIGH — occupy-weight + plus-arm-4 placer. Same class as Trideca / Pentadeca / Hexadeca.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-heptadeca-span
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
summonAI: heptadecaspan
summonLifespan: 4
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
acquisitionModel: MULTI_SOURCE
discoveryEligible: true
effectParams: {"heptadecaSpanCells":17,"heptadecaArm":4}
```

---

### SPELL_ID: `spell-cloister-turn`

NAME: Cloister Turn  
ROLE: CONTROL — invert leftover AP↔MP on **the caster and two same-side non-caster allies**; caster participates  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: No damage. **Not** `isSwap`. `effectParams: {"invertCasterAndTwoAlliesLeftoverApMp":true,"cloisterAllySearchRadius":3,"cloisterAllyCount":2}`. Target one living **same-side non-caster** ally. Auto-pick the nearest **other** living same-side non-caster ally within Chebyshev `cloisterAllySearchRadius` of **the caster** (not of the targeted ally). Snapshot leftover AP and leftover MP on **the caster, the targeted ally, and that second ally**, then write leftover AP ← leftover MP and leftover MP ← leftover AP on **each** of the three bodies independently, each **capped at that pool’s max**. Caster leftover **does change**. Caster does not move. If no living second same-side non-caster ally is in the search radius, fizzle rider (AP spent, no invert). Distinct from Hymn Turn (#1063, **two same-side non-caster allies** independent invert, caster **unchanged**, via `invertTwoAlliesLeftoverApMp` — **do not reuse that key**; this card’s caster **does** invert), Kin Turn (#1251, **caster + one same-side ally only**, via `invertCasterAndAllyLeftoverApMp` — **do not reuse that key**; this card’s third body is a **second ally**), Triad Turn (#1309, **caster + one ally + one hostile**, via `invertCasterAllyAndHostileLeftoverApMp` — **do not reuse that key**; this card has **no hostile**), Feud Turn (#1177, **caster + one opposite-side hostile only**, via `invertCasterAndHostileLeftoverApMp` — **do not reuse that key**), Psalm Turn (#1132, **one same-side non-caster + one opposite-side**, caster **unchanged**, via `invertMixedSidesLeftoverApMp` — **do not reuse that key**), Duel Turn (#1011, **two hostiles** independent invert via `invertTwoHostilesLeftoverApMp` — **do not reuse that key**), Purse Turn (#953, **one** hostile invert via `invertHostileLeftoverApMp` — **do not reuse that key**; caster unchanged), Tempo Invert (#282, **one-body ally/self** leftover AP↔MP via `invertApMp` — **do not reuse that key**), Bar Cross (#890, **two-body leftover cross**: caster AP ↔ target MP **and** caster MP ↔ target AP via `crossLeftoverApMpTwoBody` — **do not reuse that key**; that **exchanges across bodies**, this **inverts each body independently**), Dual Keep (banks leftover AP **and** MP on **one** body, no invert), Swap / Pawn Trade (tiles, not pools), Choir Hymn (Wave-1 Discovery heal — **do not alias**). Player-side summons **are** legal ally bodies (same-side). Self-target is **not** a substitute for a missing second ally.  
DURATION: instant leftover rewrite; no snap-back at turn end  
SCALING: none.  
SYNERGIES: Dectet Mend / Dectet Sting after the invert **keeps** sum 10 on a body that was already in-window; Nonet Mend after you invert a (6,4) caster with a (5,4) ally (caster stays Dectet, ally stays Nonet). Must Dectet after you dump their AP into MP.  
COUNTERPLAY: Keep leftover AP === leftover MP on all three so all inverts are no-ops; isolate (fewer than two allies in r3); Quiet Hex after they invert into a 3-AP spell; sit the caster on a window they did not want to leave.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **three independent leftover flips including the caster on the same side**, not a swap, not Hymn Turn (caster stays), not Kin Turn (only one ally), and not Triad Turn (third body is a hostile).  
AI_USAGE: `aiHint: "cloister_turn_if_two_allies_in_r3_and_at_least_one_of_three_is_unequal"`. Hex / queens. Skip if the second-ally search would fail or if every invert would be a no-op (all three already AP===MP).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"], levelZoneMin: 1`  
EDGE_CASES: Missing `invertCasterAndTwoAlliesLeftoverApMp` → fail closed (do **not** invert only the targeted ally and become Kin Turn; do **not** skip the caster and become Hymn Turn; do **not** invert a hostile and become Triad Turn). Missing `cloisterAllySearchRadius` or `cloisterAllyCount` → fail closed. No second ally in radius → fizzle rider (AP spent, observe). Three-body ties for nearest second ally: nearest Chebyshev, then lowest id. Invert (6,4)→(4,6) **stays Dectet**. Invert (10,0)→(0,10) **stays Dectet**. Invert (9,1)→(1,9) **stays Dectet**. Invert (7,3)→(3,7) **stays Dectet**. Invert (5,4)→(4,5) **stays Nonet**. Invert (5,5) is a no-op (Poise stays Poise). Invert (5,3)→(3,5) **stays Octave**. Invert (4,3)→(3,4) **stays Septet**. Invert (4,2)→(2,4) **stays Sestet**. Do **not** reuse `invertTwoAlliesLeftoverApMp` / `invertCasterAndAllyLeftoverApMp` / `invertCasterAllyAndHostileLeftoverApMp` / `invertCasterAndHostileLeftoverApMp` / `invertMixedSidesLeftoverApMp` / `invertTwoHostilesLeftoverApMp` / `crossLeftoverApMpTwoBody`. If same-day SDE Wave 22 claims this leftover, **SDE wins**. Do not mint `spell-choir-turn` / `spell-pew-turn` / `spell-trio-turn` / `spell-trine-turn` / `spell-trial-turn` / `spell-mass-turn` / `spell-duet-turn` / `spell-aisle-turn` / `spell-schola-turn` / `spell-nave-turn` / `spell-anthem-turn` / `spell-self-two-ally-turn`. Solo caster with fewer than two living same-side non-casters in range **does not** fire (unlike Kin Turn, which needs only one ally; unlike Hymn Turn, which leaves the caster unchanged).  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — three leftover snapshots + three writes + nearest-second-ally search. Same class as Hymn Turn / Kin Turn / Triad Turn with a two-ally + caster filter.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-cloister-turn
effectType: buff
effectCategory: cc
targetType: ally
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
effectParams: {"invertCasterAndTwoAlliesLeftoverApMp":true,"cloisterAllySearchRadius":3,"cloisterAllyCount":2}
```

---

### SPELL_ID: `spell-dectet-hood`

NAME: Dectet Hood  
ROLE: DEFENSE — next applied hit is 0 iff leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"dectetHoodNextHit":true,"dectetSumN":10,"dectetForbidEqual":true}`. Arm a one-hit consume: the next applied hit on the caster is 0 **if at impact** leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**. Any Chebyshev. The charge remains if the hit arrives while the sum ≠ 10 or the body is tied (hit lands fully; charge stays). Distinct from Nonet Hood (#1309, leftover AP + leftover MP === 9), Octave Hood (#1251, leftover AP + leftover MP === 8 **and unequal**), Septet Hood (#1177, leftover AP + leftover MP === 7), Sestet Hood (#1132, leftover AP + leftover MP === 6 **and unequal**), Stave Hood (#1063, leftover AP + leftover MP === 5), Score Hood (#1011, leftover AP + leftover MP === 4 **and unequal**), Tally Hood (#953, leftover AP + leftover MP === 3), Poise Hood (#890, leftover AP === leftover MP ≥ 1 — **(5,5) is Poise Hood**), Dual Plate (#1017, leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**), Prime Plate (#1082, leftover **1/1**), Thin Plate (#1143, leftover **1/0**), Wide Plate (#1198, leftover **AP ≥ 2 AND MP ≥ 1** — (9,1) (8,2) (7,3) (6,4) are Wide Plate **and** Dectet pairs; Dectet Hood still requires **the sum === 10 AND unequal**, not the inequality-free AP≥2/MP≥1 window), Deep Plate (#1255, leftover **AP === 1 AND MP ≥ 2** — (1,9) is Deep Plate **and** a Dectet pair; Dectet Hood still requires the **sum === 10 AND unequal**), Pair Plate (#1255, leftover **exactly 2/0** — no Dectet pair), Trio Plate (#1313, leftover **exactly 3/0** — no Dectet pair), Octet Plate (#1313, leftover **AP + MP === 8** — sum 8, not 10), Spent Plate (#837, leftover **AP ≥ 1**, MP unconstrained), Gait Plate (#802, leftover **MP ≥ 1**, AP unconstrained), Dry Plate (#962, leftover **MP = 0**), Even Hood (#849, **even Chebyshev**), Odd Hood (odd Chebyshev), Near / Mid / Far Hood (range bands), Odd Plate (#906, leftover **AP odd**), Fresh Plate (#1198, leftover AP **equals max**). The decision: hold (6,4) through the hit — Dual Keep 2/2 is Poise Hood / Dual Plate, **not** this — or spend into 5/4 and Nonet Hood still works, this does not. Do **not** CORE with Spent Plate, Gait Plate, Dual Plate, Prime Plate, Thin Plate, Wide Plate, Deep Plate, Pair Plate, Trio Plate, Octet Plate, Poise Hood, Tally Hood, Score Hood, Stave Hood, Sestet Hood, Septet Hood, Octave Hood, or Nonet Hood.  
DURATION: until consumed at a sum===10 unequal impact, or battle end  
SCALING: none (negate, not a RES%).  
SYNERGIES: Haste to bank ten; Cloister Turn a (10,0) caster into (0,10) still Dectet Hood; Dectet Hold so they cannot walk you off 10.  
COUNTERPLAY: Wait until they spend a pool; Coup; hit them on 5/5 (Poise Hood) or 5/4 (Nonet Hood) or 5/3 (Octave Hood) or 4/3 (Septet Hood).  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **one hit while sitting on ten unequal**. Dual Keep cannot fake it.  
AI_USAGE: `aiHint: "dectet_hood_if_self_leftover_sum_eq_10_unequal"`. Lurkers / knights ELITE. Skip if leftover sum ≠ 10 or the body is tied.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"], levelZoneMin: 2`  
EDGE_CASES: Missing `dectetSumN` or `dectetForbidEqual` → fail closed. Leftover 5/5 at impact → hit lands (Poise Hood). Leftover 5/4 at impact → hit lands (Nonet Hood). Leftover 5/3 at impact → hit lands (Octave Hood). Leftover 4/4 at impact → hit lands (Poise Hood / Dual Plate). Leftover 4/3 at impact → hit lands (Septet Hood). Leftover 1/9 at impact → miss **does** consume (sum 10 unequal), and is **not** a Deep Plate clone. Leftover 6/4 at impact → miss **does** consume, and is **not** a Skew Mark clone. Do **not** retag `even_gallery`.  
IMPLEMENTATION_COMPLEXITY: LOW — one leftover-sum + inequality gate on the next applied hit.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dectet-sting`

NAME: Dectet Sting  
ROLE: DAMAGE — 10, plus 8 if target leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. Then if the target’s leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**, deal `dectetStingBonus` (8) as a second existing `dealDamage` call. `effectParams: {"dectetLeftoverSumEq":true,"dectetSumN":10,"dectetForbidEqual":true,"dectetStingBonus":8}`. Distinct from Nonet Sting (#1309, leftover AP + leftover MP === 9), Octave Sting (#1251, leftover AP + leftover MP === 8 **and unequal**), Septet Sting (#1177, leftover AP + leftover MP === 7), Sestet Sting (#1132, leftover AP + leftover MP === 6 **and unequal**), Stave Sting (#1063, leftover AP + leftover MP === 5), Score Sting (#1011, leftover AP + leftover MP === 4 **and unequal**), Tally Sting (#953, leftover AP + leftover MP === 3), Poise Sting (#890, leftover AP === leftover MP ≥ 1), Gaunt Sting (#849, leftover **both 0**), Lean / Dry / Ready / Full / Even Sting (#962, leftover AP **even and ≥ 2**), Fresh Sting (#1017), Capped Sting (#1082, leftover MP **equals max MP**), Wide Sting (#1143), Hollow Sting (#1198, leftover **both 0** damage), Pair Gait (#1255, leftover **exactly 2/0**), Trio Gait (#1313, leftover **exactly 3/0**), Lean Gait (#1198, leftover AP === 0 AND MP ≥ 1), Odd Sting (#906, leftover **AP odd**), Tied Gait (#906, both leftover **exactly 2**). The decision: poke the (6,4) bishop for 18, or poke anyone for 10. Dual Keep 2/2 is the **wrong** window (Poise Sting). Dual Keep cannot open this. (5,5) is Poise Sting, not this. (5,4) is Nonet Sting, not this. (5,3) is Octave Sting, not this. (4,3) is Septet Sting, not this. (4,2) is Sestet Sting, not this.  
DURATION: instant  
SCALING: 10 / 8 follow damage%.  
SYNERGIES: Cloister Turn a (10,0) into (0,10) still Dectet; Dectet Hold so they cannot walk the MP off.  
COUNTERPLAY: Sit on 5/5 (Poise Sting) or 5/4 (Nonet Sting) or 5/3 (Octave Sting) or 4/3 (Septet Sting) or 4/2 (Sestet Sting) or 3/2 (Stave Sting) or 3/1 (Score Sting) or 2/1 (Tally Sting) or 0/0 (Gaunt Sting / Hollow Sting).  
POWER_BUDGET: Cheap 2 / CD 1. 10 ungated + 8 on a sum of 10 unequal.  
AI_USAGE: `aiHint: "dectet_sting_if_target_leftover_sum_eq_10_unequal"`. Lurkers / pawns. Skip the bonus path if leftover sum ≠ 10 or the body is tied; 10 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"], levelZoneMin: 1`  
EDGE_CASES: Missing bonus keys → 10 only. Target leftover 5/5 → no bonus (Poise Sting). Target leftover 5/4 → no bonus (Nonet Sting). Target leftover 5/3 → no bonus (Octave Sting). Target leftover 4/3 → no bonus (Septet Sting). Target leftover 4/2 → no bonus (Sestet Sting). Target leftover 3/2 → no bonus (Stave Sting). Target leftover 3/1 → no bonus (Score Sting). Target leftover 3/0 → no bonus (Tally Sting / Trio Gait). Do not name-wire the bonus.  
IMPLEMENTATION_COMPLEXITY: LOW — one leftover-sum + inequality gate + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dectet-step`

NAME: Dectet Step  
ROLE: POSITION — relocate to Chebyshev 1 of an ally whose leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `freeCells` on the dest. `effectParams: {"dectetStepNeedSumEq":true,"dectetSumN":10,"dectetForbidEqual":true,"dectetStepAdj":1}`. Target an ally (not self) whose leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**. The caster **relocates** to a free cell at Chebyshev 1 of that ally (player picks the dest among legal neighbors; AI picks the safest). If the ally is not in the window or no neighbor is free, fizzle (AP spent, no move). Distinct from Nonet Step (#1309, ally leftover sum === 9), Octave Step (#1251, ally leftover sum === 8 **and unequal**), Septet Step (#1177, ally leftover sum === 7), Sestet Step (#1132, ally leftover sum === 6 **and unequal**), Stave Step (#1063, ally leftover sum === 5), Score Step (#1011, ally leftover sum === 4 **and unequal**), Tally Step (#953, ally leftover sum === 3), Poise Step (#890, ally leftover AP === leftover MP ≥ 1), Gaunt Step (#849, ally leftover **both 0**), Home / Heave / Parched / Ally Step, Hinge Step, Relay Dash. The decision: blink next to the (0,10) wisp — they have walk, you have position — or wait for a 5/4 and Nonet Step, or a 5/5 and Poise Step, or a 5/3 and Octave Step. Dual Keep cannot open this.  
DURATION: instant relocate  
SCALING: none.  
SYNERGIES: Dectet Sill on a neighbor so they eat 8 at dawn if they stay on 10; Cloister Turn keeps an ally in-window; Octave Lend manufactures the ally’s Dectet.  
COUNTERPLAY: Spend the wisp’s pool; occupy every neighbor; Coup; sit the wisp on 5/5 or 5/4.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **blink to a ten-bar unequal ally**.  
AI_USAGE: `aiHint: "dectet_step_if_ally_leftover_sum_eq_10_unequal_and_a_neighbor_is_free"`. Porters / queens. Skip if no in-window ally or no free neighbor.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen"], levelZoneMin: 1`  
EDGE_CASES: Self-target forbidden (`dectetStep` is not a self blink — that is Mist Step / Phase Slip). Missing keys → no move. Ally leftover 5/5 → fizzle (Poise Step). Ally leftover 5/4 → fizzle (Nonet Step). Ally leftover 5/3 → fizzle (Octave Step). Ally leftover 4/3 → fizzle (Septet Step). Ally leftover 4/2 → fizzle (Sestet Step). Ally leftover 3/2 → fizzle (Stave Step). Ally leftover 3/1 → fizzle (Score Step). Portal dest illegal (`isCellFree`).  
IMPLEMENTATION_COMPLEXITY: LOW — leftover-sum + inequality gate + existing relocate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dectet-sill`

NAME: Dectet Sill  
ROLE: TERRAIN — start-of-their-turn occupy tax iff leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell for 2 turns. `effectParams: {"dectetSillNeedSumEq":true,"dectetSumN":10,"dectetForbidEqual":true,"dectetSillDamage":8,"dectetSillDuration":2}`. At the **start of a combatant’s turn**, if they occupy this cell and leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**, deal 8 through `updateCombatant`. Walk-enter does **not** tax (Ingress / Shove Sting). End-turn occupy does **not** tax (Dectet Post / Dwell). Relocate landing does **not** tax (Drift Post). Distinct from Nonet Sill (#1309, leftover sum === 9 at start), Octave Sill (#1251, leftover sum === 8 **and unequal** at start), Septet Sill (#1177, leftover sum === 7 at start), Sestet Sill (#1132, leftover sum === 6 **and unequal** at start), Stave Sill (#1063, leftover sum === 5 at start), Score Sill (#1011, leftover sum === 4 **and unequal** at start), Tally Sill (#953, leftover sum === 3 at start), Poise Sill (#890, leftover AP === leftover MP ≥ 1 at start), Gaunt Sill (#849, leftover **both 0** at start), Wake Mark (start-turn any leftover), Quiet / Cast / Drift / Parched Sill. The decision: stand on the sill at (6,4) and eat 8 at dawn, or spend a pool overnight, or sit on 5/4 and eat Nonet Sill instead, or sit on 5/5 and eat Poise Sill, or sit on 5/3 and eat Octave Sill. Dual Keep overnight **cannot** leave them on 10.  
DURATION: 2 turns of paint  
SCALING: 8 follows damage% if any; otherwise fixed.  
SYNERGIES: Dectet Hold so they cannot walk off overnight; Cloister Turn keeps sum 10 through dawn.  
COUNTERPLAY: Walk off (start-turn only); spend a pool; blink; dump to 5/5 or 5/4.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 upfront. Power is **dawn tax on a sum of 10 unequal**.  
AI_USAGE: `aiHint: "dectet_sill_if_foe_will_start_turn_sum_eq_10_unequal_on_tile"`. Masons / rooks. Skip if they will not start on 10 unequal.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"], levelZoneMin: 1`  
EDGE_CASES: Paint on a portal → fizzle (`isCellFree`). Occupant leftover 5/5 at dawn → no tax (Poise Sill). Occupant leftover 5/4 at dawn → no tax (Nonet Sill). Occupant leftover 5/3 at dawn → no tax (Octave Sill). Occupant leftover 4/4 at dawn → no tax (Poise Sill). Occupant leftover 4/3 at dawn → no tax (Septet Sill). Occupant leftover 4/2 at dawn → no tax (Sestet Sill). Occupant leftover 3/2 at dawn → no tax (Stave Sill). Occupant leftover 3/1 at dawn → no tax (Score Sill). Occupant leftover 3/0 at dawn → no tax (Tally Sill). Occupant leftover 0/0 at dawn → no tax (Gaunt Sill).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — painted cell + start-turn leftover-sum + inequality gate. Same class as Nonet Sill / Octave Sill / Septet Sill / Sestet Sill / Stave Sill / Score Sill / Tally Sill / Poise Sill.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dectet-hold`

NAME: Dectet Hold  
ROLE: CONTROL — cannot spend leftover MP to walk while leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"dectetHoldWhileSumEq":true,"dectetSumN":10,"dectetForbidEqual":true,"dectetHoldDuration":2}`. For 2 of the **target’s** turns, any walk that would spend ≥ 1 leftover MP is illegal **while leftover AP + leftover MP === 10 AND leftover AP ≠ leftover MP**. Teleport / Swap / Phase Slip / Twin-gate step / Dectet Step (caster relocate) do **not** pay walk MP and are legal. Distinct from Nonet Hold (#1309, cannot walk while leftover sum === 9), Octave Hold (#1251, cannot walk while leftover sum === 8 **and unequal**), Septet Hold (#1177, cannot walk while leftover sum === 7), Sestet Hold (#1132, cannot walk while leftover sum === 6 **and unequal**), Stave Hold (#1063, cannot walk while leftover sum === 5), Score Hold (#1011, cannot walk while leftover sum === 4 **and unequal**), Tally Hold (#953, cannot walk while leftover sum === 3), Poise Hold (#890, cannot walk while leftover AP === leftover MP ≥ 1), Odd Hold (#849, cannot walk while leftover AP is **odd**), Dry Hold (until leftover **AP = 0**), Drift Hold (until **force-moved**), Cast Hold / Strike Hold / Boot Hold / Tool Hold / Gaunt Hold / Brick Hold (#1017). The decision: they have (0,10) and wanted to walk ten tiles — they must **leave sum 10** (cast leftover AP from a (6,4) / (7,3) / (8,2) / (9,1) / (10,0), get siphoned, get turned, **or dump to 5/5 or 5/4**) before walking, or wait 2 turns. At leftover (0,10) they **have** MP but cannot spend it while this lock is up **and** they still sum to 10 unequal. Dual Keep 2/2 is Poise Hold, **not** this. Dual Keep cannot open this. (5,5) is Poise Hold, not this. (5,4) is Nonet Hold, not this. (5,3) is Octave Hold, not this. (4,3) is Septet Hold, not this. (4,2) is Sestet Hold, not this.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Must Dectet on (0,10) so they can neither walk nor non-Strike; Cloister Turn (0,10)→(10,0) so they lose the walk MP into leftover AP.  
COUNTERPLAY: Cast leftover AP to leave 10; dump to 5/5 or 5/4; blink; wait 2 turns.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **cannot walk while sitting on ten unequal**.  
AI_USAGE: `aiHint: "dectet_hold_if_target_leftover_sum_eq_10_unequal_and_wants_to_walk"`. Hex / knights ELITE. Skip if leftover sum ≠ 10 or the body is tied.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"], levelZoneMin: 2`  
EDGE_CASES: Missing keys → no lock. Leftover (5,5) → this lock does **not** block walks (Poise Hold’s window). Leftover (5,4) → this lock does **not** block walks (Nonet Hold’s window). Leftover (5,3) → this lock does **not** block walks (Octave Hold’s window). Leftover (4,4) → this lock does **not** block walks (Poise Hold’s window). Leftover (4,3) → this lock does **not** block walks (Septet Hold’s window). Leftover (4,2) → this lock does **not** block walks (Sestet Hold’s window). Leftover (3,2) → this lock does **not** block walks (Stave Hold). Leftover (3,1) → this lock does **not** block walks (Score Hold’s window). Leftover (2,2) → this lock does **not** block walks (Poise Hold). Leftover (3,0) → this lock does **not** block walks (Tally Hold; leftover MP is 0 anyway).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — leftover-sum + inequality gate in the walk spender.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dectet-lend`

NAME: Dectet Lend  
ROLE: SUPPORT — +1 leftover AP and +1 leftover MP iff target leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP** (exits to 12)  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"dectetLendAp":1,"dectetLendMp":1,"requireTargetSumEqLend":true,"dectetSumN":10,"dectetForbidEqual":true}`. If the **target** has leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**, grant +1 current AP and +1 current MP (capped at max). The sum becomes **12** (the dectet window **closes**). This **cannot** manufacture Nonet (sum 12 ≠ 9) or Octave (sum 12 ≠ 8) or Septet (sum 12 ≠ 7) or Sestet (sum 12 ≠ 6) or Stave (sum 12 ≠ 5) or Score (sum 12 ≠ 4) or Tally (sum 12 ≠ 3) or Poise (sum 12 is not a required equality). If the gate fails, fizzle rider (AP spent, no grant). Distinct from Nonet Lend (#1309, +1/+1 if leftover sum === 9 — **exits** to 11), Octave Lend (#1251, +1/+1 if leftover sum === 8 **and unequal** — **exits** to 10, **which is this family’s window**; **every successful Octave Lend manufactures Dectet**), Septet Lend (#1177, +1/+1 if leftover sum === 7 — **exits** to 9, which is Nonet), Sestet Lend (#1132, +1/+1 if leftover sum === 6 **and unequal** — **exits** to 8, which is Octave), Stave Lend (#1063, +1/+1 if leftover sum === 5 — **exits** to 7, which is Septet), Score Lend (#1011, +1/+1 if leftover sum === 4 **and unequal** — **exits** to 6, which is Sestet), Tally Lend (#953, +1/+1 if leftover sum === 3 — **exits** to 5, which is Stave), Poise Lend (#890, +1/+1 if leftover AP === leftover MP ≥ 1 — the **tie survives**), Gaunt Lend (#849, +1/+1 if leftover **both 0**), Lean / Drift / Spent Lend, Watch Alms, Tempo Gift / Loan Tempo / Haste, Dual Keep. The decision: cash the (6,4) wisp for a 2-resource bump, then they are out of Dectet **and** out of Nonet **and** out of Octave **and** out of Septet **and** out of Sestet **and** out of Stave **and** out of Score **and** out of Tally **and** out of Poise (sum 12 is 7/5 or 8/4 or 9/3 or 10/2 or 11/1). **Octave Lend is the intended manufacture of Dectet** ((5,3)→(6,4)). Do not name-wire that hop.  
DURATION: instant (current-turn leftover only)  
SCALING: amount fixed.  
SYNERGIES: Octave Lend **into** Dectet, then Dectet Mend; or Dectet Lend **out** of Dectet into a 12-bar that Dual Keep cannot cap this turn.  
COUNTERPLAY: Sit off sum 10; sit on 5/5 (Poise Lend); sit on 5/4 (Nonet Lend); sit on 5/3 (Octave Lend); sit on 4/3 (Septet Lend); sit on 4/2 (Sestet Lend); sit on 3/2 (Stave Lend); sit on 3/1 (Score Lend).  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **cash ten for twelve**, not a Haste.  
AI_USAGE: `aiHint: "dectet_lend_if_ally_leftover_sum_eq_10_unequal"`. Buffers / bishops. Skip if leftover sum ≠ 10 or the body is tied.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"], levelZoneMin: 1`  
EDGE_CASES: Missing keys → no grant. Target leftover 5/5 → fizzle (Poise Lend). Target leftover 5/4 → fizzle (Nonet Lend). Target leftover 5/3 → fizzle (Octave Lend). Target leftover 4/3 → fizzle (Septet Lend). Target leftover 4/2 → fizzle (Sestet Lend). Target leftover 3/2 → fizzle (Stave Lend). Target leftover 3/1 → fizzle (Score Lend). Target leftover 2/1 → fizzle (Tally Lend). Cap at max: if leftover AP is already max, grant MP only — **then the sum may not be 12** and the window-exit is incomplete; fail closed if either grant cannot apply in full (both must land).  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dectet-sip`

NAME: Dectet Sip  
ROLE: CONTROL — steal 1 leftover AP iff target leftover AP + leftover MP === 10 AND leftover AP ≠ leftover MP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: No HP damage. `effectParams: {"dectetSipAp":1,"requireTargetSumEqSip":true,"dectetSumN":10,"dectetForbidEqual":true}`. If the target leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP** **and** leftover AP ≥ 1, subtract 1 leftover AP from the target (not below 0) and add 1 leftover AP to the caster this turn, capped at max. If leftover AP is 0 (the (0,10) pair) or the sum ≠ 10 or the body is tied, fizzle rider (AP spent). Distinct from Nonet Sip (#1309, steal 1 leftover AP iff leftover sum === 9 — **most successful steals manufacture Octave**; **(5,4)→(4,4) is the odd-sum Poise exception**), Octave Sip (#1251, steal 1 leftover AP iff leftover sum === 8 **and unequal** — **every successful steal manufactures Septet**; no Poise exception because (4,4) is banned), Septet Sip (#1177, steal 1 leftover AP iff leftover sum === 7 — **manufactures Sestet** from most steals, **Poise** from (4,3)→(3,3)), Sestet Sip (#1132, steal 1 leftover AP iff leftover sum === 6 **and unequal** — **manufactures Stave** from every successful steal), Stave Sip (#1063, steal 1 leftover AP iff leftover sum === 5 — **manufactures Score or Poise**), Score Sip (#1011, steal 1 leftover AP iff leftover sum === 4 **and unequal** — **manufactures Tally**), Tally Sip (#953, steal 1 leftover AP iff leftover sum === 3 — **manufactures Poise** from (2,1)→(1,1)), Poise Sip (#890, steal 1 leftover AP iff leftover AP === leftover MP ≥ 1), Bare Sip (#849, steal 1 leftover AP iff leftover **MP = 0**), Soul Sip (ungated current MP), Ap Sip (#342). The decision: sip (6,4) → they become (5,4) **Nonet**; sip (7,3) → they become (6,3) **Nonet**; sip (8,2) → they become (7,2) **Nonet**; sip (9,1) → they become (8,1) **Nonet**; sip (10,0) → they become (9,0) **Nonet**; sip (4,6) → they become (3,6) **Nonet**; sip (3,7) → they become (2,7) **Nonet**; sip (2,8) → they become (1,8) **Nonet**; sip (1,9) → they become (0,9) **Nonet**. **Every successful Dectet Sip manufactures Nonet.** There is **no Poise exception** because (5,5) is banned by `dectetForbidEqual`. Dual Keep 2/2 is the **wrong** window (Poise Sip). (5,5) is Poise Sip, not this. (5,4) is Nonet Sip, not this. (5,3) is Octave Sip, not this. (4,3) is Septet Sip, not this. (4,2) is Sestet Sip, not this.  
DURATION: instant (current-turn leftover only)  
SCALING: amount fixed.  
SYNERGIES: Nonet Sting / Nonet Mend **after** manufacturing 5/4 or 6/3 or 7/2 or 8/1 or 9/0. Dectet Hold so they cannot walk the remaining MP.  
COUNTERPLAY: Sit on (0,10) (no AP to steal); sit off sum 10; sit on 5/5 (Poise Sip); sit on 5/4 (Nonet Sip); sit on 5/3 (Octave Sip); sit on 4/3 (Septet Sip); sit on 4/2 (Sestet Sip); sit on 3/2 (Stave Sip); sit on 3/1 (Score Sip); Second Wind after.  
POWER_BUDGET: Cheap control, 0 damage, CD 1.  
AI_USAGE: `aiHint: "dectet_sip_if_target_sum_eq_10_unequal_and_leftover_ap_ge_1"`. Hex / pawns. Skip if not in the window or leftover AP is 0.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"], levelZoneMin: 1`  
EDGE_CASES: Do not write `debuffStat: "ap"`. Missing keys → no steal. Target leftover 5/5 → fizzle (Poise Sip’s window). Target leftover 5/4 → fizzle (Nonet Sip’s window). Target leftover 5/3 → fizzle (Octave Sip’s window). Target leftover 4/3 → fizzle (Septet Sip’s window). Target leftover 4/2 → fizzle (Sestet Sip’s window). Target leftover 3/2 → fizzle (Stave Sip’s window). Target leftover 3/1 → fizzle (Score Sip’s window). Target leftover 2/1 → fizzle (Tally Sip’s window). Challenge: not a heal, not MP. Do not name-wire the Nonet hop.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dectet-post`

NAME: Dectet Post  
ROLE: SUMMONS — empty-kit mine; end-turn occupy detonates iff leftover AP + leftover MP === 10 AND leftover AP ≠ leftover MP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "dectetpost"`, `summonLifespan: 3`, empty kit. `effectParams: {"dectetPostDetonateDamage":10,"dectetPostNeedSumEq":true,"dectetSumN":10,"dectetForbidEqual":true}`. Place on a free ground tile. At **end of a combatant’s turn**, if they **occupy** this body and leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**, deal 10 to that occupant through `updateCombatant` and this summon dies. Walk-enter does **not** detonate (Ingress). Relocate landing does **not** detonate (Drift Post). Start-of-turn does **not** detonate (Wake / Gaunt Sill / Poise Sill / Tally Sill / Score Sill / Stave Sill / Sestet Sill / Septet Sill / Octave Sill / Nonet Sill / Dectet Sill). Distinct from Nonet Post (#1309, leftover sum === 9), Octave Post (#1251, leftover sum === 8 **and unequal**), Septet Post (#1177, leftover sum === 7), Sestet Post (#1132, leftover sum === 6 **and unequal**), Stave Post (#1063, leftover sum === 5), Score Post (#1011, leftover sum === 4 **and unequal**), Tally Post (#953, leftover sum === 3), Poise Post (#890, leftover AP === leftover MP ≥ 1), Gaunt Post (#849, leftover **both 0**), Lean Post (leftover **AP = 0** only), Dummy Post (taunt), Drift Post (**relocate landing**), Dwell Mark (**end-turn occupy, any leftover**), Hollow Mark (#1198, leftover **both 0** paint), Skew Mark (#1255, leftover **AP − MP === 2** paint — (6,4) is Skew Mark **and** a Dectet pair; Dectet Post still requires the **sum === 10 AND unequal**, not the directed-diff), Split Mark (#1313, leftover **AP − MP === 3** paint). The decision: end the turn on (6,4) and eat 10, or spend a pool, or dump to 5/4 and eat Nonet Post, or dump to 5/5 and eat Poise Post, or dump to 5/3 and eat Octave Post. Dual Keep 2/2 **hurts Poise Post, not this**. Dual Keep **cannot** hurt this. Walk-safe. Relocate-safe. Start-turn-safe.  
DURATION: lifespan 3 or until detonate  
SCALING: 10 follows damage% if any; otherwise fixed.  
SYNERGIES: Dectet Hold so they cannot walk off; Cloister Turn **keeps** sum 10 through the end-turn check.  
COUNTERPLAY: Spend a pool before turn end; dump to 5/5 or 5/4; walk off (walk-safe); Coup the post; blink.  
POWER_BUDGET: Standard 3 / CD 3 / 0 upfront. Power is **end-turn occupy on a sum of 10 unequal**. Counts as **one** toward the summon cap.  
AI_USAGE: `aiHint: "dectet_post_if_foe_will_end_turn_sum_eq_10_unequal_on_tile"`. Masons / pawns. Skip if cap is full.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","rook"], levelZoneMin: 1`  
EDGE_CASES: **Summon is observation.** Later detonate / death is not a second observe. Missing keys → do not spawn a Dummy Post. Occupant leftover 5/5 at turn end → no detonate (Poise Post’s window). Occupant leftover 5/4 at turn end → no detonate (Nonet Post’s window). Occupant leftover 5/3 at turn end → no detonate (Octave Post’s window). Occupant leftover 4/3 at turn end → no detonate (Septet Post’s window). Occupant leftover 4/2 at turn end → no detonate (Sestet Post’s window). Occupant leftover 3/2 at turn end → no detonate (Stave Post’s window). Occupant leftover 3/1 at turn end → no detonate (Score Post’s window). Occupant leftover 3/0 at turn end → no detonate (Tally Post’s window). Occupant leftover 0/0 at turn end → no detonate (Gaunt Post’s window). Empty tile → no detonate, lifespan ticks. Never parse `"Dectet Post"`. Do not mint `spell-dectet-burst`. Prefer fizzle-and-detonate if the body is displaced by Swap (body gone → no tile tax).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — empty-kit summon + end-turn leftover-sum + inequality gate. Same class as Nonet Post / Octave Post / Septet Post / Sestet Post / Stave Post / Score Post / Tally Post / Poise Post / Gaunt Post / Lean Post.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dectet-bounce`

NAME: Dectet Bounce  
ROLE: DAMAGE — 12 to primary; bounce 1 to nearest other leftover-AP+MP===10-unequal hostile  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 12 to primary (ungated). `effectParams: {"dectetBounceNeedSumEq":true,"dectetSumN":10,"dectetForbidEqual":true,"dectetBounceSearchRadius":4,"dectetBounceCount":1}` — search Chebyshev ≤ 4 for the nearest **other** living hostile whose leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**; deal 12 to that body too. Primary leftover unconstrained. Distinct from Nonet Bounce (#1309, second body leftover sum === 9), Octave Bounce (#1251, second body leftover sum === 8 **and unequal**), Septet Bounce (#1177, second body leftover sum === 7), Sestet Bounce (#1132, second body leftover sum === 6 **and unequal**), Stave Bounce (#1063, second body leftover sum === 5), Score Bounce (#1011, second body leftover sum === 4 **and unequal**), Tally Bounce (#953, second body leftover sum === 3), Poise Bounce (#890, second body leftover AP === leftover MP ≥ 1), Gaunt Bounce (#849, second body leftover **both 0**), Parched Bounce (leftover **MP = 0**), Heave Bounce (**force-moved**), Chain Lightning (nearest **any**, 2 bounces). The decision: open on whoever, splash the (6,4) bishop — or wait for two 5/4 bodies and Nonet Bounce. Dual Keep 2/2 is the **wrong** second body. Dual Keep cannot open this. (5,5) is Poise Bounce, not this. (5,4) is Nonet Bounce, not this. (5,3) is Octave Bounce, not this. (4,3) is Septet Bounce, not this. (4,2) is Sestet Bounce, not this.  
DURATION: instant  
SCALING: 12 follows damage%.  
SYNERGIES: Cloister Turn a second body into Dectet before the bounce search; Dectet Hold to keep them in-window.  
COUNTERPLAY: Isolate (one Dectet body); sit the second body on 5/5 or 5/4 or 5/3 or 4/3 or 4/2 or 3/2 or 3/1 or 3/0 or 0/0.  
POWER_BUDGET: Standard. 12 if no second Dectet body; 24 if a second sits on sum 10 unequal.  
AI_USAGE: `aiHint: "dectet_bounce_if_second_sum_eq_10_unequal_hostile_in_r4"`. Queens / bishops. Skip if no second in-window body **and** a Strike would kill the primary; 12 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"], levelZoneMin: 1`  
EDGE_CASES: Missing bounce keys → 12 only. Primary leftover 5/4 does **not** block the primary hit. Ties: nearest Chebyshev, then lowest id. Do not hit allies. Second body leftover 5/5 is **not** a bounce target (Poise Bounce). Second body leftover 5/4 is **not** a bounce target (Nonet Bounce). Second body leftover 5/3 is **not** a bounce target (Octave Bounce). Second body leftover 4/3 is **not** a bounce target (Septet Bounce). Second body leftover 4/2 is **not** a bounce target (Sestet Bounce). Second body leftover 3/2 is **not** a bounce target (Stave Bounce). Second body leftover 3/1 is **not** a bounce target (Score Bounce).  
IMPLEMENTATION_COMPLEXITY: LOW — one search + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-must-dectet`

NAME: Must Dectet  
ROLE: CONTROL — non-Strike illegal unless leftover AP + leftover MP === 10 AND leftover AP ≠ leftover MP **and** the spell spends last AP  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"mustNonStrikeUnlessSumEqAndSpendsLastAp":true,"dectetSumN":10,"dectetForbidEqual":true,"dectetHoldDuration":2}`. For 2 of the **target’s** turns, any non-Strike spell is illegal unless, **before** this (their) spell’s AP is paid, leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP** **and** `apCost === leftover AP` (the spell spends last leftover AP). Strike / `physical_attack` stays legal. Walk stays legal unless a Dectet Hold is also up. Distinct from Must Nonet (#1309, leftover sum === 9 **and** last AP — **pre-spend odd sum 9**), Must Octave (#1251, leftover sum === 8 **and unequal** **and** last AP — **pre-spend even unequal sum 8**), Must Septet (#1177, leftover sum === 7 **and** last AP — **pre-spend odd sum 7**), Must Sestet (#1132, leftover sum === 6 **and unequal** **and** last AP — **pre-spend even unequal sum 6**), Must Stave (#1063, leftover sum === 5 **and** last AP — **pre-spend odd sum 5**), Must Score (#1011, leftover sum === 4 **and unequal** **and** last AP — **pre-spend even unequal sum 4**), Must Tally (#953, leftover sum === 3 **and** last AP — **pre-spend odd sum 3**), Must Poise (#890, leftover AP === leftover MP ≥ 1 **and** last AP — **pre-spend equality**), Must Gaunt / Must Lean / Must Drift / Must Pace / Must Span / Must Step, Rite First (cannot Strike until a spell), Tool Hold (cannot tool until Strike). The decision: they sit on (6,4) with a 6-cost tool as their last packet, or they sit on (4,6) with this 3-cost as their last packet? (4,6) leftover AP is 4, so a 4-cost last packet **is** legal; they sit on (0,10) with walk MP and **no** leftover AP — Must Dectet **blocks** every non-Strike from (0,10) because leftover AP is 0 (cannot spend last AP). (10,0) spending a 10-cost last packet **is** legal and dumps them to (0,0) Gaunt. Dual Keep 2/2 is Must Poise’s window, **not** this. Dual Keep cannot open this. (5,5) is Must Poise, not this. (5,4) is Must Nonet, not this. (5,3) is Must Octave, not this. (4,3) is Must Septet, not this. (4,2) is Must Sestet, not this.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Dectet Hold on (0,10) so they can neither walk nor non-Strike; Cloister Turn (0,10)→(10,0) so a 10-cost last packet becomes legal. Do **not** CORE with a Strike-only dectet lock (none shipped).  
COUNTERPLAY: Strike; blink; wait 2 turns; dump to 5/5 or 5/4; Cloister Turn / Tempo Invert yourself if you own it.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **last-packet from a sum of 10 unequal**, not a silence.  
AI_USAGE: `aiHint: "must_dectet_if_target_leftover_sum_eq_10_unequal_and_has_a_last_packet_spell"`. Knights / pawns ELITE. Skip if leftover sum ≠ 10 or the body is tied. Do not arm if the only remaining legal verb is Strike and a walk would kill.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","pawn"], levelZoneMin: 2`  
EDGE_CASES: **Pre-spend leftover** (see §3.5). Missing keys → no lock. Leftover (5,5) → non-Strike still illegal under **this** lock (tied, Must Poise’s window). Leftover (5,4) → non-Strike still illegal under **this** lock (sum 9, Must Nonet’s window). Leftover (5,3) → non-Strike still illegal under **this** lock (sum 8, Must Octave’s window). Leftover (4,3) → non-Strike still illegal under **this** lock (sum 7, Must Septet’s window). Leftover (4,2) → non-Strike still illegal under **this** lock (sum 6, Must Sestet’s window). Leftover (3,2) → non-Strike still illegal under **this** lock (sum 5, Must Stave’s window). Leftover (3,1) → non-Strike still illegal under **this** lock (sum 4, Must Score’s window). Leftover (3,0) → non-Strike still illegal under **this** lock (sum 3, Must Tally’s window). Leftover (0,0) → non-Strike illegal (Must Gaunt’s window, but this lock does not lift there). 0-AP tools (Timestep) are not “spending last AP”. The shared key `mustNonStrikeUnlessSumEqAndSpendsLastAp` is **not** a name table: `dectetSumN` + `dectetForbidEqual` distinguish this row from Must Nonet / Must Octave / Must Septet / Must Sestet / Must Stave / Must Score.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — pre-spend leftover sum + inequality + last-AP compare in the cast gate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-verse-dectet`

NAME: Verse Dectet  
ROLE: CONTROL — last resolved id illegal until leftover AP + leftover MP === 10 AND leftover AP ≠ leftover MP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"verseDectetUntilSumEq":true,"dectetSumN":10,"dectetForbidEqual":true}`. The target’s **last resolved spell id** (the id they most recently spent AP on) cannot be recast until leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP**. Strike is not a spell id for this key. If they have no last resolved id, fizzle rider (AP spent). Distinct from Verse Nonet (#1309, lifts at leftover sum === 9), Verse Octave (#1251, lifts at leftover sum === 8 **and unequal**), Verse Septet (#1177, lifts at leftover sum === 7), Verse Sestet (#1132, lifts at leftover sum === 6 **and unequal**), Verse Stave (#1063, lifts at leftover sum === 5), Verse Score (#1011, lifts at leftover sum === 4 **and unequal**), Verse Tally (#953, lifts at leftover sum === 3), Verse Poise (#890, lifts at leftover AP === leftover MP ≥ 1), Verse Gaunt (#849, lifts at leftover **both 0**), Verse Lean / Verse Pace / Verse Tax, Once Verse / Stolen Verse / Summon Verse (#906, pets pay +1 AP to **recast** last id; the id stays legal), Last Mute / Hex of Silence. The decision: lock their Inferno until they sit on (6,4) — sitting on 5/5 **does not** lift (Verse Poise’s window); sitting on 5/4 **does not** lift (Verse Nonet’s window); sitting on 5/3 **does not** lift (Verse Octave’s window); sitting on 4/3 **does not** lift (Verse Septet’s window); sitting on 4/2 **does not** lift (Verse Sestet’s window); sitting on 3/2 **does not** lift (Verse Stave’s window); sitting on 3/1 **does not** lift (Verse Score’s window); sitting on 3/0 **does not** lift (Verse Tally’s window); sitting on 0/0 **does not** lift (Verse Gaunt’s window); sitting on 1/1 **does not** lift (Prime Gift); sitting on 6/0 **does not** lift (Verse Sestet / Gait Gift); sitting on 8/0 **does not** lift (Verse Octave / Gait Gift); sitting on 9/0 **does not** lift (Verse Nonet / Gait Gift); sitting on 10/0 **does** lift (Gait Gift **and** a Dectet pair — both-body vs one-body is not this lock). Instant lift if they already sit on sum 10 unequal at resolve (fizzle rider — do not arm a lock that is already lifted). Dual Keep 2/2 does **not** lift this. Dual Keep **cannot** lift this.  
DURATION: until leftover sum === 10 unequal, or battle end  
SCALING: none.  
SYNERGIES: Cadence Septime so the locked id is also remaining 0 (they can recast it **this** turn if they also sit in-window); Dectet Hold so they cannot walk into a new leftover split.  
COUNTERPLAY: Sit on (10,0) / (0,10) / (9,1) / (1,9) / (8,2) / (2,8) / (7,3) / (3,7) / (6,4) / (4,6); recast a different id; wait. Dual Keep 2/2 does **not** lift this. Haste into (6,4) **does**. Dumping to 5/5 **does not**. Dumping to 5/4 **does not**.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **which leftover window lifts the last verse**, not a silence.  
AI_USAGE: `aiHint: "verse_dectet_if_target_last_id_is_their_win_condition"`. Hex / bishops. Skip if they have no last resolved id, or if they already sit on sum 10 unequal (instant lift — fizzle rider).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"], levelZoneMin: 1`  
EDGE_CASES: Missing keys → no lock. Verse Dectet does **not** lift at leftover 0/0 (Verse Gaunt), leftover 2/2 (Verse Poise), leftover 3/3 (Verse Poise), leftover 4/4 (Verse Poise), leftover 5/5 (Verse Poise), leftover 3/0 (Verse Tally), leftover 3/1 (Verse Score), leftover 3/2 (Verse Stave), leftover 4/2 (Verse Sestet), leftover 4/3 (Verse Septet), leftover 5/3 (Verse Octave), leftover 5/4 (Verse Nonet), leftover 6/0 (Verse Sestet / Gait Gift), leftover 7/0 (Verse Septet / Gait Gift), leftover 8/0 (Verse Octave / Gait Gift), leftover 9/0 (Verse Nonet / Gait Gift), or leftover 1/1 (Prime Gift). Summon Verse (#906) is a recast tax, not a legality lock — do not merge the keys.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — last-id lock + leftover-sum + inequality lift.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-septime`

NAME: Court Septime  
ROLE: SUPPORT — Cadence Septime on **every other** body (init order)  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `effectParams: {"septimeRemainingCdsEq7To0":true,"courtSeptimeExcludeCaster":true}`. In initiative order, every living combatant **except the caster** has remaining `n===7` rewritten to `0` (zeros stay 0; `n===1`…`n===6` and `n>7` unchanged), same rewrite as Cadence Septime. Distinct from Court Sixte (#1309, mass Sixte `n===6` → `0`), Court Quinte (#1251, mass Quinte `n===5` → `0`), Court Quarte (#1177, mass Quarte `n===4` → `0`), Court Tierce (#1132, mass Tierce `n===3` → `0`), Court Dock (#1063, mass Dock `n===2` → `0`), Court Snuff (#1011, mass Snuff `n===1` → `0`), Court Prime (#953, mass Prime `n===0` → `1`), Court Floor (#890, mass Floor `n>1` → `1`, zeros stay 0), Court Lag (#849, mass Lag `n>0` → `n+2`), Court Imprint (mass Imprint), Court Dual / Court Keep / Court Stretch / Court Hinge / Court Shove / Court Fold, Cadence Septime (one body), Cadence Sept (one body `n>7→7`), Cadence Flush (all → 0, ally), Cadence Swap (two-body map exchange), Cadence Sext (one body `n>6→6`), Cadence Quint (one body `n>5→5`), Cadence Quad (one body `n>4→4`), Cadence Tern (one body `n>3→3`), Cadence Cap (one body `n>2→2`). Player never owns this. Witness without grant.  
DURATION: instant rewrite  
SCALING: none.  
SYNERGIES: Kit with Cadence Septime on the caster’s own target after, or Sixte a remaining `n===6` after the board’s remaining-7 tools are already sitting at 0. Do **not** CORE with Court Sixte / Court Quinte / Court Quarte / Court Tierce / Court Dock / Court Snuff / Court Prime / Court Floor / Cadence Sept / Cadence Sext / Cadence Quint / Cadence Quad / Cadence Tern / Cadence Cap.  
COUNTERPLAY: Recast before Court Septime; Cadence Break your own remaining after; Floor your remaining 7 to 1 before the mass septime; Sept does **not** save you (sevens stay 7, then this writes 0); Sext peels 7 to 6 (then this does **not** write 0 — Sixte’s problem); Quint peels 7 to 5 (then this does **not** write 0 — Quinte’s problem); Quad peels 7 to 4 (then this does **not** write 0 — Quarte’s problem); Tern peels 7 to 3 (then this does **not** write 0 — Tierce’s problem); kill the regent.  
POWER_BUDGET: Signature 6 / CD 4 / 0 damage. Power is **board-wide remaining-7 unlock**. Kit-only.  
AI_USAGE: `aiHint: "court_septime_if_two_plus_foes_have_a_remaining_7_nuke"`. Kit-only regent. Skip if every other remaining is already ≠ 7.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. `NOT_PLAYER_LEARNABLE`. `court_septime_regent` kit-only. Arm is observation for witness-only kits. Never written to owned ids.  
EDGE_CASES: Missing `courtSeptimeExcludeCaster` → do not septime the caster (fail closed, still observe). Do not write `spellLevelValues`. Do not mint `spell-court-seven` / `spell-court-sept`. Preview must list who septime. Do not reuse `courtSixteExcludeCaster` / `courtQuinteExcludeCaster` / `courtQuarteExcludeCaster` / `courtTierceExcludeCaster` / `courtDockExcludeCaster` / `courtSnuffExcludeCaster` / `courtPrimeExcludeCaster` / `courtFloorExcludeCaster`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — init-order walk + Cadence Septime rewrite. Same class as Court Sixte / Court Quinte / Court Quarte / Court Tierce / Court Dock / Court Snuff / Court Prime / Court Floor / Court Lag.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-court-septime
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
effectParams: {"septimeRemainingCdsEq7To0":true,"courtSeptimeExcludeCaster":true}
```

---

## 6. Combination matrix (intended, not name-wired)

Resolve only via flags / leftover reads / remaining-CD maps / occupy-weight. Never `spell.name`.

| Setup (metadata) | Payoff (metadata) | Decision |
| :--- | :--- | :--- |
| Both leftover sums === 10 unequal | `dectetMendAmount` | Two ten-bars, or sit on 5/4 and Nonet Mend |
| Remaining `n===7` | `septimeRemainingCdsEq7To0` | Unlock the seven this turn, or wait for Sixte’s six |
| `heptadecaArm: 4` occupy | `dectetHoldWhileSumEq` | Seventeen-cell plus + cannot walk off 10 |
| `invertCasterAndTwoAlliesLeftoverApMp` | `dectetSumN` / `nonetSumN` | Flip three same-side bars; sums survive, windows can hop families |
| `dectetHoodNextHit` | leftover sum === 10 unequal at impact | Hold (6,4) through the swing |
| `dectetStingBonus` | target leftover sum === 10 unequal | Poke the ten-bar, or poke anyone for 10 |
| `dectetStepAdj` | ally leftover sum === 10 unequal | Blink to the (0,10) wisp |
| `dectetSillNeedSumEq` | start-turn occupy | Dawn tax, or spend overnight |
| `dectetHoldWhileSumEq` | leftover (0,10) | Cannot spend the ten walk MP |
| `dectetLendAp` + `dectetLendMp` | leftover sum 10 → 12 | Cash ten; **Octave Lend manufactures Dectet** |
| `dectetSipAp` | leftover AP ≥ 1 and sum 10 unequal | Every successful steal → Nonet |
| `dectetPostNeedSumEq` | end-turn occupy | Walk-safe, relocate-safe, start-turn-safe |
| `dectetBounceCount` | second leftover sum === 10 unequal | Splash the other ten-bar |
| `mustNonStrikeUnlessSumEqAndSpendsLastAp` + `dectetSumN` | pre-spend leftover | Last packet from ten, or Strike |
| `verseDectetUntilSumEq` | leftover sum === 10 unequal | Recast the locked id only from ten |
| `courtSeptimeExcludeCaster` | mass `n===7` → `0` | Witness-only board unlock |

Map modifiers stay metadata-only. Frozen/Slime × **walk** MP does not inflate any Wave-22 `mpCost` (all 0). Arcane Surge × Cadence Septime is remaining rewrite, not AP.

Mechanic Interaction Matrix still OPEN (do not “fix” in this spec):

- Swap × hazards (MIMA-2026-08-31-001) — Dectet Step dest **must** tick dest hazards.
- Push/pull × hazards (MIMA-2026-08-31-005) — this pass does not add a new push; Cloister Turn does not move tiles.
- Controlled-summon walk × occupancy (MIMA-2026-08-31-002) — Heptadeca Span occupancy must apply to summon-control walks.

---

## 7. Recommended unlock order (pacing)

Discovery designer should treat these as **bands**, not a shop list. **Still required for any of this to matter:** Discovery’s innate-four split. This pass does not edit `spellData.ts`.

| Band | Spells | Why |
| :--- | :--- | :--- |
| Observe+win (zone 1) | Dectet Sting, Dectet Sip, Dectet Step, Dectet Sill, Dectet Lend, Dectet Bounce, Verse Dectet, Cloister Turn | Leftover-sum 10 unequal tools |
| MULTI (observe **or** extra door) | Dectet Mend (`dectet_cantor`), Cadence Septime (`septime_precentor`), Heptadeca Span (`span_heptadeca`) | Heal / remaining-7 unlock / seventeen occupy |
| ELITE | Dectet Hood, Dectet Hold, Must Dectet | Negate / walk lock / last-packet |
| Kit-only | Court Septime (`court_septime_regent`) | Mass remaining-7 unlock |

**Wave 23 leftovers left on purpose:** mid-RAF splice; fourth walk-MP snipe; sixth echo id; player-owned Hex of Silence; player-owned About Hinge; leftover AP − leftover MP === 2 as a heal (still colliding; Skew Mark owns the detonate; (6,4) is now also Dectet); remaining `n===8` → `0` (do **not** name Cadence Octave); eighteen-cell occupy; target-only sum===10 / sum===9 / sum===8 (Octet Gift) / sum===7 / sum===6 / sum===5 / sum===4 / sum===3 heal (SDE leftovers); leftover sum === 11; invert leftover on caster and two hostiles.

#1313 stamps #1309 as Wave **22** family CORE. This catalog stamps as Wave **23** family CORE.

---

## 8. Implementation notes (for a later, explicit implementation PR)

1. **No production code in this change.** Data PR later, after Wave-1 ownership split.  
2. **MP debit:** still AP-only at WX 17162–17165. Wave-22 rows stay `mpCost: 0`.  
3. **`dectetSumN: 10`** is even — **`dectetForbidEqual` is required**. (5,5) stays Poise.  
4. **Cadence Septime** walks remaining `n===7` → `0`. Do not reuse `sixteRemainingCdsEq6To0` / Sept’s `n>7→7`.  
5. **Heptadeca Span ≠ Hexadeca Span.** Orthogonal plus arm 4, click = center. `summonAI: "heptadecaspan"`. Blocked while `ENEMY_SUMMON_CAP === 2`.  
6. **Cloister Turn ≠ Hymn Turn ≠ Kin Turn ≠ Triad Turn.** Three-same-side independent invert including the caster. New key. Nearest-second-ally search. Not `isSwap`.  
7. **Dectet Post** end-turn occupy detonate **iff leftover AP + leftover MP === 10 AND leftover AP ≠ leftover MP**; walk-safe; relocate-safe; start-turn-safe. `summonAI: "dectetpost"`.  
8. **Must Dectet** reads leftover **before** debit.  
9. **Octave Lend (5,3)→(6,4) manufactures Dectet.** Nonet Lend (5,4)→(6,5) **exits** Nonet into sum 11, **not** Dectet. Dectet Lend (6,4)→(7,5) **exits** Dectet into sum 12. **Every successful Dectet Sip manufactures Nonet.** Do not name-wire any hop.  
10. Recap grant uses the reward funnel + `commitSpellDiscoveries` / `unlockOwnedSpell`, not `updateCharacter`.  
11. Do not touch RAF, map generation, turn order, or damage math.  
12. Add ids to `SPELL_ID_CATALOG` **only when implemented**, together with `spellData.ts` and kits.  
13. Do **not** append these ids to `starterSpells` as `isBaseSpell`.  
14. Extra doors wait for **Wave 24** sheets. Do not restamp #1244 or **#1302** (`shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate`). #1302 did **not** take `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent`. #1309 extras (`nonet_cantor` / `sixte_precentor` / `span_hexadeca` / `court_sixte_regent`) wait for Wave 23 sheets.

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
- No second Cadence Floor / Prime / Rise / Snuff / Cap / Dock / Tern / Tierce / Quad / Quarte / Quint / Quinte / Sext / Sixte / Sept.  
- No `spell-dectet-gift` / `spell-nonet-gift` / `spell-octave-gift` / `spell-octet-gift` / `spell-septet-gift` / `spell-sestet-gift` / `spell-stave-gift` / `spell-score-gift` / `spell-tally-gift`.  
- No `spell-choir-turn` / `spell-pew-turn` / `spell-trio-turn` / `spell-trine-turn` / `spell-duet-turn` / `spell-schola-turn` / `spell-nave-turn`.  
- No `spell-skew-*` family (Skew Mark owns the AP−MP===2 detonate).  
- No cloning Shield/Iron Skin, Blood Mend/Rally, Poison/Venom, Expose/Shadow Veil, Mirror/Reflect, Lens/Overcast, Short Sight/Paper Wind, Tempo Gift/Loan Tempo, Goad/Taunt Oath, Rime Tile/Rime Sheet, File Lance, Blood Tithe, Hex of Silence.

---

## 10. Proposal index

| SPELL_ID | NAME | ROLE | ACQUISITION | AP | CD | Door |
| :--- | :--- | :--- | :--- | ---: | ---: | :--- |
| `spell-dectet-mend` | Dectet Mend | SUPPORT | MULTI_SOURCE | 3 | 2 | `dectet_cantor` |
| `spell-cadence-septime` | Cadence Septime | CONTROL | MULTI_SOURCE | 3 | 2 | `septime_precentor` |
| `spell-heptadeca-span` | Heptadeca Span | SUMMONS | MULTI_SOURCE | 4 | 3 | `span_heptadeca` |
| `spell-cloister-turn` | Cloister Turn | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-dectet-hood` | Dectet Hood | DEFENSE | ELITE | 2 | 2 | (piece observe) |
| `spell-dectet-sting` | Dectet Sting | DAMAGE | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-dectet-step` | Dectet Step | POSITION | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-dectet-sill` | Dectet Sill | TERRAIN | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-dectet-hold` | Dectet Hold | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-dectet-lend` | Dectet Lend | SUPPORT | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-dectet-sip` | Dectet Sip | CONTROL | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-dectet-post` | Dectet Post | SUMMONS | ENEMY_DISCOVERY | 3 | 3 | (piece observe) |
| `spell-dectet-bounce` | Dectet Bounce | DAMAGE | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-must-dectet` | Must Dectet | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-verse-dectet` | Verse Dectet | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-court-septime` | Court Septime | SUPPORT | NOT_PLAYER_LEARNABLE | 6 | 4 | `court_septime_regent` (kit) |

All STATUS: **PROPOSED**.

### 10.1 QA (design contract)

| # | Check | Pass |
| :--- | :--- | :--- |
| W22-1 | Live catalog unchanged @ `0f5363f` | 32 frontend ids; discovery inert |
| W22-2 | `spell-parched-mend` is **not** shipped; Dry Gait owns leftover-MP=0 heal |
| W22-3 | `spell-dectet-mend` requires leftover AP + leftover MP **=== 10 AND leftover AP ≠ leftover MP** on **both** bodies. (5,5) fails. (5,4) fails. (5,3) fails. (4,4) fails. (4,3) fails. (4,2) fails. (3,3) fails. Nonet Mend owns **sum === 9**. Octave Mend owns **sum === 8 AND unequal**. Septet Mend owns **sum === 7**. Sestet Mend owns **sum === 6 AND unequal**. Stave Mend owns **sum === 5**. Score Mend owns **sum === 4 AND unequal**. Tally Mend owns **sum === 3**. Poise Mend / Equal Gift own **equality ≥ 1**. Prime Gift owns **exactly 1/1**. Gait Gift owns **one-body AP ≥ 2 AND MP = 0**. Wide Gift owns **one-body AP ≥ 2 AND MP ≥ 1**. Thin Gift owns **one-body 1/0**. Deep Gift owns **one-body 1/≥2**. Octet Gift owns **one-body sum === 8**. Hollow Gift / Gaunt Mend own **0 + 0**. Lean Gift owns AP=0 and MP≥1 |
| W22-4 | Cadence Septime is remaining `n===7` → `0`; `n===1`…`n===6` and `n>7` unchanged; zeros stay 0. Does **not** clone Cadence Sept (`n>7→7`) / Sixte (`6→0`) / Sext (`n>6→6`) / Quinte (`5→0`) / Quint (`n>5→5`) / Quarte (`4→0`) / Tierce (`3→0`) / Dock (`2→0`) / Snuff (`1→0`) / Quad (`n>4→4`) / Tern (`n>3→3`) / Cap (`n>2→2`) / Rise (`1→2`) / Prime (`0→1`) / Floor / Swap / Lag / Halve / Crack / Flush |
| W22-5 | Heptadeca Span is orthogonal plus arm 4, counts as **seventeen**, every cell occupied, click is **center**. Hexadeca Span stays 4×4 sixteen, click = nearest cell to caster. Pentadeca Span stays stretched plus fifteen, click = center. Tetradeca Span stays 2×7 fourteen, click = nearest cell to caster. Trideca Span stays plus arm 3 thirteen, click = center. Dodeca Span stays 3×4 twelve, click = nearest cell to caster. Nine Span stays solid nine. Quad Span stays 2×2 four |
| W22-6 | Cloister Turn is caster + two same-side allies independent leftover AP↔MP (caster participates). Does **not** clone Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, Psalm Turn, Feud Turn, Kin Turn, or Triad Turn. Does **not** reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp` / `invertTwoAlliesLeftoverApMp` / `invertMixedSidesLeftoverApMp` / `invertCasterAndHostileLeftoverApMp` / `invertCasterAndAllyLeftoverApMp` / `invertCasterAllyAndHostileLeftoverApMp`. Does **not** alias Choir Hymn. Does **not** mint `spell-choir-turn` / `spell-trio-turn` / `spell-duet-turn` / `spell-schola-turn` |
| W22-7 | Dectet Hood does **not** retag `even_gallery` / Dual Plate / Prime Plate / Thin Plate / Wide Plate / Deep Plate / Pair Plate / Trio Plate / Octet Plate / Spent Plate / Gait Plate / Poise Hood / Tally Hood / Score Hood / Stave Hood / Sestet Hood / Septet Hood / Octave Hood / Nonet Hood |
| W22-8 | Dectet Sting bonus is leftover AP + leftover MP === 10 unequal, not Nonet Sting’s sum 9, not Octave Sting’s sum 8 unequal, not Septet Sting’s sum 7, not Sestet Sting’s sum 6 unequal, not Stave Sting’s sum 5, not Score Sting’s sum 4 unequal, not Tally Sting’s sum 3, not Poise Sting’s equality, not Gaunt Sting’s both-0, not Pair Gait’s 2/0, not Trio Gait’s 3/0, not Wide Sting, not Hollow Sting, not Lean Gait, not Tied Gait’s (2,2) |
| W22-9 | Dectet Sip on any legal pair with leftover AP ≥ 1 writes a Nonet pair. There is **no Poise exception** ((5,5) is banned). Nonet Sip on (5,4) writes (4,4) **Poise**. Nonet Sip on other pairs manufactures Octave. Octave Sip on (5,3) writes (4,3) **Septet**. Septet Sip on (5,2) writes (4,2) **Sestet**. Septet Sip on (4,3) writes (3,3) **Poise**. Sestet Sip on (4,2) writes (3,2) **Stave**. Stave Sip on (3,2) writes (2,2) **Poise**. Stave Sip on (4,1) writes (3,1) **Score**. Score Sip on (3,1) writes (2,1) **Tally**. Tally Sip on (2,1) writes (1,1) **Poise**. Bare Sip stays leftover MP = 0. Poise Sip stays equality ≥ 1 |
| W22-10 | Must Dectet is **not** in the same CORE as a Strike-only dectet lock (none shipped). Reads leftover **before** debit. Dual Keep 2/2 is Must Poise, not Must Dectet. Dual Keep cannot open Must Dectet. (5,5) is Must Poise. (5,4) is Must Nonet. (5,3) is Must Octave. (4,4) is Must Poise. (4,3) is Must Septet. (4,2) is Must Sestet. (3,3) is Must Poise |
| W22-11 | Court Septime is `NOT_PLAYER_LEARNABLE`; `court_septime_regent` is kit-only |
| W22-12 | Extra doors `dectet_cantor` / `septime_precentor` / `span_heptadeca` / `court_septime_regent` do not restamp #808 / #836 / #849 / #837 / #890 / #903 / #906 / #951 / #953 / #962 / #1004 / #1011 / #1017 / #1063 / #1080 / #1082 / #1132 / #1139 / #1143 / #1170 / #1177 / #1198 / **#1244** (`sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`) / **#1251** (`octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent`) / **#1255** (`giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave` / `giraffe_precentor` / `giraffe_fold_regent`) / **#1302** (`shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate`) / **#1309** (`nonet_cantor` / `sixte_precentor` / `span_hexadeca` / `court_sixte_regent`) / **#1313** leftovers |
| W22-13 | `mpCost` is 0 on every Wave-22 row |
| W22-14 | `summonAI` values are `"heptadecaspan"` / `"dectetpost"` enums, never parsed names |
| W22-15 | Heptadeca Span does not ship against `ENEMY_SUMMON_CAP === 2` without occupy-weight |
| W22-16 | Verse Dectet does **not** lift at leftover 0/0 (Verse Gaunt), leftover 2/2 (Verse Poise), leftover 3/3 (Verse Poise), leftover 4/4 (Verse Poise), leftover 5/5 (Verse Poise), leftover 3/0 (Verse Tally), leftover 3/1 (Verse Score), leftover 3/2 (Verse Stave), leftover 4/2 (Verse Sestet), leftover 4/3 (Verse Septet), leftover 5/3 (Verse Octave), leftover 5/4 (Verse Nonet), leftover 6/0 (Verse Sestet / Gait Gift), leftover 7/0 (Verse Septet / Gait Gift), leftover 8/0 (Verse Octave / Gait Gift), leftover 9/0 (Verse Nonet / Gait Gift), or leftover 1/1 (Prime Gift) |
| W22-17 | No second `spell-cadence-floor` / `spell-cadence-prime` / `spell-cadence-rise` / `spell-cadence-snuff` / `spell-cadence-cap` / `spell-cadence-dock` / `spell-cadence-tern` / `spell-cadence-tierce` / `spell-cadence-quad` / `spell-cadence-quarte` / `spell-cadence-quint` / `spell-cadence-quinte` / `spell-cadence-sext` / `spell-cadence-sixte` / `spell-cadence-sept`. SDE #906 owns Floor. #953 owns Prime. #962 owns Rise. #1011 owns Snuff. #1017 owns Cap. #1063 owns Dock. #1082 owns Tern. #1132 owns Tierce. #1143 owns Quad. #1177 owns Quarte. #1198 owns Quint. #1251 owns Quinte. #1255 owns Sext. #1309 owns Sixte. #1313 owns Sept |
| W22-18 | Legal Dectet pairs are only (10,0) (0,10) (9,1) (1,9) (8,2) (2,8) (7,3) (3,7) (6,4) (4,6). (5,5) is Poise. (5,4) is Nonet. (5,3) is Octave. (4,4) is Poise. (4,3) is Septet. (4,2) is Sestet. (3,3) is Poise. (3,2) is Stave. (3,1) is Score. (3,0) is Tally. (2,2) is Poise. (1,1) is Prime Gift. Dual Keep cannot manufacture any Dectet pair. A 6 AP / 3 MP bar that pays 3 AP lands at (3,3) and **fails** Dectet. A 7 AP / 3 MP bar that pays 3 AP lands at (4,3) and **fails** Dectet. A 8 AP / 3 MP bar that pays 3 AP lands at (5,3) and **fails** Dectet. A 9 AP / 3 MP bar that pays 3 AP lands at (6,3) and **fails** Dectet. A 10 AP / 3 MP bar that pays 3 AP lands at (7,3) and **fires** |
| W22-19 | Octave Lend (5,3)→(6,4) **manufactures Dectet**. Dectet Lend (6,4)→(7,5) **exits** Dectet. Nonet Lend (5,4)→(6,5) **exits** Nonet into sum 11, **not** Dectet. Septet Lend (4,3)→(5,4) **manufactures Nonet**, not Dectet. Sestet Lend (4,2)→(5,3) **manufactures Octave**, not Dectet. Stave Lend (3,2)→(4,3) **manufactures Septet**, not Dectet. Score Lend (3,1)→(4,2) **manufactures Sestet**, not Dectet. Every successful Dectet Sip manufactures Nonet. Do not name-wire any hop |
| W22-20 | `spell-dec-span` (occupy-weight 10) is **not** aliased to Dectet Mend. `spell-deca-oath` (Chebyshev = 10) is **not** aliased to Dectet Hood. `spell-hexadeca-span` (occupy-weight 16) is **not** aliased to Heptadeca Span. `spell-duodeca-oath` (exact-12 spell gate) is **not** aliased to Heptadeca Span. `spell-hymn-turn` is **not** aliased to Cloister Turn. `spell-triad-turn` is **not** aliased to Cloister Turn. `spell-kin-turn` is **not** aliased to Cloister Turn |

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

**Document status:** PROPOSED. Safe to review and implement in a later, explicit data PR. Not a license to land combat code in the same change as this spec. Coordinate with **#1313** so Octet Gift / Cadence Sept / Octet Plate / Split Mark / Trio Gait / Trio Plate / Antelope Stride land once. Coordinate with **#1309** so Nonet Mend / Cadence Sixte / Hexadeca Span / Triad Turn land once as Wave-22 family CORE. This catalog stamps as Wave **23** family CORE.

# Spell and Tactical Mechanics — Design Pass 2026-10-28

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1 law [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) through still-open Wave 19 [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-27.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-5d97/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-27.md) (**#1198**). Same-day Wave 20 SDE is **running** (`cursor/spell-discovery-and-evolution-c0dd`, `bc-3bf0cffe`) and **has not opened a PR at authoring**. Same-day unique-file PRs **#1218–#1239** (admin / telemetry / world / formations / combat-fix docs) do **not** overlap this dated proposal.
- Spell, Discovery & Achievement Admin — still-open ACTION_ID-only PRs (no unique spell ids). **#1187** owns SDA-2026-10-27-205…219. **#1226** owns SDA-2026-10-28 (ACTION_IDS ledger only).
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) … still-open Wave 19 [`SPELL_PROPOSALS_2026-10-27.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-7698/docs/automation/SPELL_PROPOSALS_2026-10-27.md) (**#1177**)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); extra doors through #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / **#951** / **#1004** / **#1080** / **#1139** (Wave 19 bosses: `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`) / **#1170** (Wave 20 bosses: `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`); tactical extras #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / #1011 / **#1063** / **#1132** / **#1177**. Same-day Wave 21 boss agent is **running** (`cursor/stralt-boss-system-9ec5`, `bc-32ca1d6c`) and **has not opened a PR at authoring**.

This is **Wave 20** of the tactical catalog. Live HEAD is unchanged since Waves 4–19. Wave 19 (#1177) filled both-body leftover AP + leftover MP **=== 7** heal (Septet Mend), remaining `n===4` → `0` (Cadence Quarte), axis-aligned 2×7 occupy (Tetradeca Span, counts as fourteen), caster+hostile leftover invert (Feud Turn), and a Septet family plus Court Quarte.

**Wave 19 explicitly deferred twelve holes.** Discovery Wave 19 (#1198) already claimed leftover **AP === 1 AND MP === 0** heal (Thin Gift), remaining `n>5` → `5` (Cadence Quint), leftover **AP ≥ 2 AND MP ≥ 1** negate (Wide Plate), Camel Stride / Deca Oath / Glyph Reel / Camel Bite / Hollow Mark / Fuse Skip / Hollow Sting / Summon Camel / Prime Toll / Brick Levy / Watch Shave / Lean Gait / Glyph Cut / Fresh Plate / Pack Camel / Camel Fold. **SDE keeps those.** This pass fills the remaining leftovers Wave 19 left for Wave 20, plus a caster-participating same-side invert that does **not** clone Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, Psalm Turn, or Feud Turn:

| Wave-19 leftover | Owner after #1198 / #1177 | This pass |
| :--- | :--- | :--- |
| Leftover AP + leftover MP === **8 AND unequal** | Still open. Tally owns **sum === 3**. Score owns **sum === 4 AND unequal**. Stave owns **sum === 5**. Sestet owns **sum === 6 AND unequal**. Septet owns **sum === 7**. Poise / Equal Gift own **equality ≥ 1** — **(4,4) is Poise**, not this family. Gaunt / Hollow Gift own **0+0**. Prime Gift (#1017) owns **exactly 1/1**. Gait Gift (#1082) owns **one-body AP ≥ 2 AND MP = 0** (overlaps (8,0)). Wide Gift (#1143) owns **one-body AP ≥ 2 AND MP ≥ 1** (overlaps (7,1) (6,2) (5,3) — one-body vs both-body). Thin Gift (#1198) owns **one-body 1/0** (no Octave pair). Dual Keep max surviving leftover is **2/2** (sum 4) — it **cannot** manufacture sum 8. Wave 16’s directed-diff `AP − MP === 2` **collides with Score at (3,1), Sestet at (4,2), and this family at (5,3)**; no other Octave pair has that diff ((8,0) is 8, (7,1) is 6, (6,2) is 4). The discrete next leftover-sum is **8** (even, **equality banned**). | **This pass:** Octave Mend — **caster and target** leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**. Legal pairs **(8,0) (0,8) (7,1) (1,7) (6,2) (2,6) (5,3) (3,5)**. |
| Remaining `5` → `0` | Still open. Quint (#1198) caps `n>5` → `5` (**fives stay 5**). Quarte (#1177) writes `n===4` → `0`. Tierce (#1132) writes `n===3` → `0`. Dock (#1063) writes `n===2` → `0`. Snuff (#1011) writes `n===1` → `0`. Quad (#1143) caps `n>4` → `4` (**fives become 4**). Tern (#1082) caps `n>3` → `3` (**fives become 3**). Cap (#1017) compresses `n>2` → `2` (**fives become 2**). Floor (#906) compresses `n>1` → `1`. Rise (#962) pads `n===1` → `2`. Prime (#953) locks `n===0` → `1`. | **This pass:** Cadence Quinte (remaining `n===5` → `0`; zeros stay 0; `n===1`, `n===2`, `n===3`, `n===4`, and `n>5` unchanged). **Do not mint** `spell-cadence-quint` (SDE) / `spell-cadence-cinque` / `spell-cadence-fifth`. |
| Fifteen-cell occupy | Still open. Tetradeca Span is fourteen (2×7). Trideca Span is thirteen (plus arm 3). Dodeca Span is twelve (3×4). Hendeca Span is eleven (stretched plus). | **This pass:** Pentadeca Span (stretched plus **longArm 4 / shortArm 3**, counts as **fifteen**; click = **center**, Hendeca / Trideca rule) |
| Invert leftover on **caster and one ally** (caster participates) | Still open. Feud Turn is **caster + one hostile**. Psalm Turn is **one same-side non-caster + one opposite-side**; caster stays. Hymn Turn is **two allies**; caster stays; self forbidden. Duel Turn is **two hostiles**. Purse Turn is **one** hostile. Tempo Invert is **one-body ally/self**. Bar Cross is two-body **cross**. | **This pass:** Kin Turn — invert leftover AP↔MP independently on **the caster and one same-side non-caster ally**; caster **participates**. Self-only is illegal (that is Tempo Invert). **Do not mint** `spell-duet-turn` (typo-collision with Duel Turn). |
| Target-only sum===8 heal | **Held for SDE.** Thin Gift is **1/0**, **not** this hole. Wide Gift is **AP≥2/MP≥1**. | **Not this pass.** Do not mint `spell-octave-gift` / `spell-eight-gift` |
| Target-only sum===7 / sum===6 / sum===5 / sum===4 / sum===3 heal | **Still SDE leftover.** Septet / Sestet / Stave / Score / Tally Mend are both-body. | **Not this pass.** Do not mint `spell-septet-gift` / `spell-sestet-gift` / `spell-stave-gift` / `spell-score-gift` / `spell-tally-gift` |
| Leftover AP − leftover MP === 2 (diff window) | Still open **and more colliding**. (3,1) is Score. (4,2) is Sestet. **(5,3) is Octave.** | **Not this pass** (Wave 21). Do not mint a `spell-skew-*` family |
| Mid-RAF splice | Held (AGENTS.md) | Still held |
| Fourth `mpCost > 0` walk snipe | Held (Ley Toll / Undertow / Sanguine Toll) | Still held |
| Sixth echo id | Held | Still held |
| Player-owned Hex of Silence | Held (`BOSS_ONLY`) | Still held |
| Player-owned About Hinge | Held (`BOSS_ONLY` on #590) | Still held. Hostile 180° around a pair midpoint is still Pawn Trade. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after the reserved set **and** after #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 / #1177 / #1198. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

Same-day Discovery Wave 20 **has not opened a PR at authoring**. **If that catalog later claims a unique leftover below, SDE wins** the unique §11 id; this catalog must not clone it. Do **not** clone #747 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 / #1177 / #1198 unique ids. Do **not** ship `spell-parched-mend` / `spell-cadence-floor` (second copy) / `spell-cadence-rise` / `spell-cadence-prime` / `spell-cadence-snuff` (second copy) / `spell-cadence-cap` (second copy) / `spell-cadence-dock` (second copy) / `spell-cadence-tern` (second copy) / `spell-cadence-tierce` (second copy) / `spell-cadence-quad` (second copy) / `spell-cadence-quarte` (second copy) / `spell-cadence-quint` (SDE) / `spell-tally-gift` / `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-septet-gift` / `spell-octave-gift` / `spell-prime-gift` (second copy) / `spell-gait-gift` (second copy) / `spell-wide-gift` (second copy) / `spell-thin-gift` (second copy). Stamp family / observe metadata onto Wave-20 **tactical** ids only. #1198 §0.2 already stamps #1177 as Wave **20** family CORE. **This catalog stamps as Wave 21 family CORE.**

Do **not** mint `spell-eight-mend` / `spell-octa-mend` / `spell-octet-mend` / `spell-octave-gift` / `spell-both-octave` (Octave Mend owns both-body sum===8 unequal heal; (4,4) stays Poise; (4,3) stays Septet; (4,2) stays Sestet), `spell-cadence-quint` / `spell-cadence-cinque` / `spell-cadence-fifth` / `spell-cadence-five` / `spell-cadence-penter` / `spell-cd-quinte` (Cadence Quinte owns remaining `5` → `0`; Quint owns `n>5` → `5`; Quarte owns `4` → `0`; Tierce owns `3` → `0`; Dock owns `2` → `0`; Snuff owns `1` → `0`; Quad owns `n>4` → `4`; Tern owns `n>3` → `3`; Cap owns `n>2` → `2`; Floor owns `n>1` → `1`), `spell-fifteen-span` / `spell-pentakaideca-span` / `spell-3x5-span` / `spell-plus-span` (Pentadeca Span owns fifteen; Tetradeca Span owns fourteen), `spell-duet-turn` / `spell-choir-turn` / `spell-pew-turn` / `spell-aisle-turn` / `spell-mixed-turn` / `spell-self-ally-turn` / `spell-pair-turn` / `spell-caster-ally-turn` (Kin Turn owns caster + one ally independent invert; Choir Hymn is a Wave-1 Discovery heal, **not** this invert; Duel Turn owns two hostiles), `spell-court-five` / `spell-court-quint` / `spell-court-cinque` (Court Quinte is the mass signature), or `spell-octave-plate` / `spell-sum-eight-hood` (Octave Hood owns sum===8 unequal any-range miss; do **not** retag `even_gallery` / Dual Plate / Spent Plate / Gait Plate / Prime Plate / Thin Plate / Wide Plate / Septet Hood / Sestet Hood / Stave Hood / Score Hood / Tally Hood / Poise Hood). Oct Span (`spell-oct-span`, occupy-weight 8) and Octa Oath (`spell-octa-oath`, Chebyshev = 8) are **not** this leftover-sum family.

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is unchanged since 2026-08-31. Discovery is still inert. WX is **19,213** lines (`wc -l`). Same HEAD as Waves 4–19. `WorldExploration.tsx` lives at `src/frontend/src/components/WorldExploration.tsx` (not `engine/`).

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

Live `ENEMY_SUMMON_CAP` is still **2** (`gameConstants.ts` 300). Quad Span (#636) counts as four … Tetradeca Span (#1177) as fourteen on paper; all eleven are implementation-blocked until that cap (or a dedicated occupy-weight) exists. Pentadeca Span is the same class: **propose the hole, do not pretend it can ship against cap 2**.

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
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** (tests only; `rg` empty in WX) | Unused | Shoulder Bash, Hook Line. Octave Step / Kin Turn relocate leftover **pools**, not tiles. Kin Turn is **not** `isSwap`. |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768 → WX `swapPositions` 9389) | Swap | Pawn Trade / Ward Interpose / Cadence Quinte is **not** `isSwap` (cooldown remaining, not tiles) |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, never this set |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire |
| Walk / leftover / force flags | Paper `walkMpSpentThisTurn` (Waves 6–10). Paper `forcedMovedThisTurn` (Wave 9). Leftover AP/MP die at turn end unless Dual Keep / Purse Keep / Stride Keep | Haste grants **now**; Timestep is full **now** | **This pass: Octave Mend / Octave Hold / Octave\* / Must Octave / Verse Octave / Kin Turn / Court Quinte** |
| Fifteen-cell occupy | Twin=2 … Tetradeca=14 (2×7) | Absent | **This pass: Pentadeca Span** (stretched plus longArm 4 / shortArm 3 = 15) |
| Remaining CD rewrite | Theft **steals**; Imprint **copies**; Swap (#837) **exchanges full maps**; Rest skips **own** tick; Halve **÷2**; Grace skips **starting** the next own CD; Stall **+1**; Lag **+2**; Floor (#906) `n>1` → `1`; Prime (#953) `n===0` → `1`; Rise (#962) `n===1` → `2`; Snuff (#1011) `n===1` → `0`; Cap (#1017) `n>2` → `2`; Dock (#1063) `n===2` → `0`; Tern (#1082) `n>3` → `3`; Tierce (#1132) `n===3` → `0`; Quad (#1143) `n>4` → `4`; Quarte (#1177) `n===4` → `0`; Quint (#1198) `n>5` → `5` | Inferno CD 3 is the only live lock | **This pass: Cadence Quinte (remaining n===5 → 0; n===1, n===2, n===3, n===4, and n>5 unchanged)** |
| Leftover sum (AP + MP === N) | Tally family is **sum === 3**. Score family is **sum === 4 AND unequal**. Stave family is **sum === 5**. Sestet family is **sum === 6 AND unequal**. Septet family is **sum === 7**. Poise family is **equality ≥ 1**. Gaunt family is **both leftover 0**. Equal Gift is **target equality ≥ 1**. Prime Gift is **exactly 1/1**. Gait Gift is **one-body AP ≥ 2 AND MP = 0**. Wide Gift is **one-body AP ≥ 2 AND MP ≥ 1**. Thin Gift is **one-body AP === 1 AND MP === 0**. Tied Gait is both leftover **exactly 2**. Dual Plate is leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**. | Unused live | **This pass: Octave\* (sum === 8 AND unequal; even, equality banned)** |
| One-body leftover AP↔MP | Tempo Invert (`invertApMp`, ally/self). Purse Turn (hostile one-body). Bar Cross (two-body **cross**). Duel Turn (two hostiles, independent invert, caster stays). Hymn Turn (two allies, independent invert, caster stays). Psalm Turn (one same-side non-caster + one opposite-side, independent invert, caster stays). Feud Turn (caster + one hostile, independent invert, caster participates). | Absent live | **This pass: Kin Turn (caster + one ally, independent invert, caster participates).** Do not reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp` / `invertTwoAlliesLeftoverApMp` / `invertMixedSidesLeftoverApMp` / `invertCasterAndHostileLeftoverApMp`. |

### 1.4 Reserved id tombstone (do not collide)

**Wave 1 tactical:**  
`spell-shoulder-bash`, `spell-hook-line`, `spell-mist-step`, `spell-grave-bell`, `spell-root-snare`, `spell-lens-shift`, `spell-ward-plate`, `spell-pain-link`, `spell-cleanse-rite`, `spell-cinder-tile`, `spell-tripwire`, `spell-glyph-tax`, `spell-stone-turret`, `spell-turret-shard`, `spell-blood-familiar`, `spell-ricochet-mark`, `spell-void-anchor`.

**Discovery Wave 1:**  
`spell-quiet-hex`, `spell-chain-ward`, `spell-crosswind`, `spell-glass-shot`, `spell-ember-wake`, `spell-split-mark`, `spell-phase-slip`, `spell-sever-tether`, `spell-overcast`, `spell-second-wind`, `spell-choir-hymn`, `spell-oath-bind`, `spell-leech-tempo`, `spell-null-brand`, `spell-false-retreat`, `spell-blood-benediction`, `spell-ward-interpose`, `spell-martyr-fuse`, `spell-hex-of-silence`. Formal blink id remains `spell-phase-slip` (never add `spell-phase-step`).

**Boss adaptations (`BOSS_AND_SPELL_DISCOVERY.md` §5.2):**  
`spell-ember-step`, `spell-caltrop`, `spell-shock-glyph`, `spell-exsanguinate`, `spell-glyph-snare`, `spell-vault`, `spell-brood-ward`, `spell-aftershock`, `spell-rot-brand`, `spell-echo-cast`.

**Wave 2 tactical / Discovery Wave 2 / Wave 3 tactical / Discovery Wave 3 / Wave 4 tactical / Discovery Wave 4 / Memory Wave 5 SDE / Wave 5–18 tactical / Discovery Waves 6–18:** reserved in Waves 2–19 documents and in #1198 §0.1. Do not collide. Memory Wave-5 SDE ids stay tombstoned (`spell-gaze-sill` … `spell-void-span`).

**Wave 19 tactical (#1177 — still open; never re-propose / never clone).** Unique remaining ids stamp as Wave-20 family CORE:  
`spell-septet-mend`, `spell-cadence-quarte`, `spell-tetradeca-span`, `spell-feud-turn`, `spell-septet-hood`, `spell-septet-sting`, `spell-septet-step`, `spell-septet-sill`, `spell-septet-hold`, `spell-septet-lend`, `spell-septet-sip`, `spell-septet-post`, `spell-septet-bounce`, `spell-must-septet`, `spell-verse-septet`, `spell-court-quarte`.

**Discovery Wave 19 (#1198 — still open; never re-propose / never clone; SDE wins Thin Gift / Cadence Quint / Wide Plate):**  
`spell-camel-stride`, `spell-deca-oath`, `spell-glyph-reel`, `spell-camel-bite`, `spell-hollow-mark`, `spell-wide-plate`, `spell-fuse-skip`, `spell-hollow-sting`, `spell-summon-camel`, `spell-thin-gift`, `spell-cadence-quint`, `spell-prime-toll`, `spell-brick-levy`, `spell-watch-shave`, `spell-lean-gait`, `spell-glyph-cut`, `spell-fresh-plate`, `spell-pack-camel`, `spell-camel-fold`.

**Wave 18 tactical (#1132) / Discovery Wave 18 (#1143):** reserved in those PRs. #1143 SDE won Wide Gift / Cadence Quad / Thin Plate.

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` and `spell-blood-tithe` (tactical W2 vs Discovery W2). `spell-cadence-floor` (tactical #890 vs Discovery #906 — **SDE wins**; this pass does not add a third).

**Fantasy overlaps to not clone:** Short Sight ≈ Paper Wind; Tempo Gift ≈ Loan Tempo; Goad ≈ Taunt Oath; Rime Tile ≈ Rime Sheet; Lens Shift / Overcast; Poise Mend ≈ Equal Gift (both-body vs target equality); Tally Mend ≈ Lean Gift; Score Mend ≈ Prime Gift; Stave Mend ≈ Gait Gift; Sestet Mend ≈ Wide Gift; Septet Mend ≈ Thin Gift (both-body sum 7 vs one-body 1/0 — **filled, not a clone**); Cadence Floor / Prime / Rise / Snuff / Cap / Dock / Tern / Tierce / Quad / Quarte / Quint are **filled** (Quinte is `5→0`, not Quint’s `n>5→5`); Tempo Invert ≈ Purse Turn; Purse Turn ≈ Duel Turn; Duel Turn ≈ Hymn Turn; Hymn Turn ≈ Psalm Turn; Psalm Turn ≈ Feud Turn; Feud Turn ≈ Kin Turn (caster+hostile vs caster+ally — **this pass fills the same-side caster-participating card, does not clone the hostile card**). Kin Turn is **not** Choir Hymn. Kin Turn is **not** Duel Turn. Octave Mend is **not** Oct Span. Octave Mend is **not** Octa Oath.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier; Dry Mend / Dry Gait / Parched Mend; Hollow Gift / Gaunt Mend; Cadence Swap / Cadence Floor / Cadence Prime / Cadence Rise / Cadence Snuff / Cadence Cap / Cadence Dock / Cadence Tern / Cadence Tierce / Cadence Quad / Cadence Quarte / Cadence Quint.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved or live) |
| :--- | :--- | :--- |
| SUPPORT leftover-sum heal | Both-body leftover AP + leftover MP **=== 8 AND unequal** | Tally Mend (sum 3); Score Mend (sum 4 unequal); Stave Mend (sum 5); Sestet Mend (sum 6 unequal); Septet Mend (sum 7); Poise Mend / Equal Gift (equality, including (4,4)); Gaunt / Hollow Gift (0+0); Dry Mend / Dry Gait; Lean Gift; Prime Gift (exactly 1/1); Gait Gift (AP≥2/MP=0); Wide Gift (AP≥2/MP≥1); Thin Gift (1/0) |
| CONTROL remaining 5→0 | Ready-five ids (`n===5`) write `0` | Snuff `1→0`; Dock `2→0`; Tierce `3→0`; Quarte `4→0`; Rise `1→2`; Prime `0→1`; Floor `n>1→1`; Cap `n>2→2`; Tern `n>3→3`; Quad `n>4→4`; Quint `n>5→5`; Stall/Lag pad; Flush/Crack →0 |
| SUMMONS fifteen-cell occupy | Stretched plus longArm 4 / shortArm 3, counts as fifteen | Twin…Tetradeca Span |
| CONTROL caster+ally invert | Leftover AP↔MP on **caster and one ally**; caster participates | Tempo Invert (ally/self); Purse Turn (one hostile); Bar Cross (two-body cross); Duel Turn (two hostiles); Hymn Turn (two allies, caster stays); Psalm Turn (mixed, caster stays); Feud Turn (caster + one hostile) |
| DEFENSE / DAMAGE / TERRAIN octave family | Hood / Sting / Step / Sill / Hold / Lend / Sip / Post / Bounce / Must / Verse | Septet\* / Sestet\* / Stave\* / Score\* / Tally\* / Poise\* / Gaunt\* / Lean\* / Dry\* |
| SIGNATURE mass Quinte | Court Quinte | Court Quarte / Court Tierce / Court Dock / Court Snuff / Court Prime / Court Floor / Court Lag / Court Imprint |

**Still open after this wave (do not fill today):** mid-RAF splice; fourth walk-MP snipe; sixth echo id; player-owned Hex of Silence; player-owned About Hinge; leftover AP − leftover MP === **2** (diff window; (3,1) is Score; (4,2) is Sestet; **(5,3) is Octave**); remaining `n===6` → `0`; sixteen-cell occupy; **target-only** sum===8 heal (leave for SDE); **target-only** sum===7 / sum===6 / sum===5 / sum===4 / sum===3 heal (still SDE leftovers); leftover AP + leftover MP === **9**; invert leftover on **three** bodies (two-body leftover-invert space is now complete). Those stay Wave 21 so this pass stays discrete.

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
9. `inferArchetype` still treats any `healAmount > 0` as healer (`enemyAI.ts` 447–452). Octave Mend **must not** land in non-healer CORE; keep `healAmount: 0` on the row.

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 20 ids to `starterSpells` as base. Do **not** land Wave-20 data before Wave-1 ownership split (`SDE-2026-08-31-001`). CDA-030 (#982) still freezes **shipping** Wave-15/16 live rows until those gates exist; this document is sequential Wave 20 **design only**.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "pentadecaspan"` / `"octavepost"` are **string enums on the config**, not a parse of `"Pentadeca Span"` / `"Octave Post"`.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Pentadeca Span / Octave Post **arming** (body placed, AP spent) **is** observation. A later occupy / detonate is **not** a second observe.
- Cadence Quinte **resolve** (even if every remaining was already ≠ 5) **is** observation if AP was spent.
- Do not require “see it N times”. Wave 20 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.
- Do not stamp `survivor` (Last Ember / Last Ward). #646 / #679 / #747 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 / #1177 / #1198 left that feat leftover on purpose.

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

**Every live feat and every live challenge id is already a sole spell door or a MULTI child.** Wave 20 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 20 does **not** invent a 16th feat.

**Live 19 first-wins are all taken (do not restamp as the only door):**  
`starborn_queen` (Cut In), `pale_archivist` (After Verse), `starved_vampire_pawn` (Sanguine Toll), `lord_of_static` (Draw Together), `final_pawn` (Eclipse Fold), `mirror_sovereign` (Echo Cast), `crimson_countess` (Crimson Pact), `void_grandmaster` (Twin Gate), `midnight_bishop` (Life Tether), `chessboard_lich` (Claim Ward), `twin_monarchs` (Choir Hymn), `alabaster_fortress` (Pain Link / Aftershock), `bone_cavalier` (Vault / Caltrop), `pale_archbishop` (Reliquary / Glyph Snare extras), `fetid_rook` (Rot Brand), `broodmother_rook` (Brood Ward), `weeping_pawn` (Mute Thread, #411), `eternal_pawn_king` (Queue Cut, #411), `enthroned_void` (File Vault MULTI child, #411). `second_lament` remains kit-only False Cut.

**Wave-5…20 boss extra doors — do not restamp:** `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`, `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`, `mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`, `gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`, `toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`, `crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`, `sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`, `infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`, `flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`, `effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`, `jostle_subdeacon`, `peel_friar`, `dilate_organist`, `hood_recluse`, `wick_exorcist`, `dry_nuncio`, `hearth_legate`, `must_preceptor`, `boot_subprior`, `purse_steward`, `tick_infirmarer`, `mute_notary`, `slide_porter`, `both_capitular`, `heave_kitchener`, `parched_preacher`, `stride_chancellor`, `dual_treasurer`, `imprint_archdeacon`, `damp_provost`, `trim_abbot`, `ready_commissary`, `lean_procurator`, `near_scholastic`.

**Wave-6…19 tactical extra doors — do not restamp:** `oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`, `pace_prelate`, `span_triune`, `wick_mason`, `slip_castellan`, `court_usher`, `gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `gaunt_cantor`, `lag_precentor`, `span_oct`, `court_lag_regent`, `poise_cantor`, `floor_precentor`, `span_nine`, `court_floor_regent`, `tally_cantor`, `prime_precentor`, `span_dec`, `court_prime_regent`, `score_cantor`, `snuff_precentor`, `span_hendeca`, `court_snuff_regent`, `stave_cantor`, `dock_precentor`, `span_dodeca`, `court_dock_regent`, `sestet_cantor`, `tierce_precentor`, `span_trideca`, `court_tierce_regent`, `septet_cantor`, `quarte_precentor`, `span_tetradeca`, `court_quarte_regent`. `parched_cantor` is **not** Dry Gait’s door and **not** Octave Mend’s door. `septet_cantor` stays Septet Mend. `sestet_cantor` stays Sestet Mend. `stave_cantor` stays Stave Mend. `score_cantor` stays Score Mend. `tally_cantor` stays Tally Mend. `poise_cantor` stays Poise Mend. `gaunt_cantor` stays Gaunt Mend. `quarte_precentor` stays Quarte. `tierce_precentor` stays Tierce. `dock_precentor` stays Dock. `snuff_precentor` stays Snuff. `prime_precentor` stays Prime. `floor_precentor` stays Floor (#890 door). SDE teaches Quint via Wave-19 unique pools (`camel_gallery` / `deca_nave`) — do not restamp `quint_precentor` if #1198 later mints one as a tactical door. Do **not** mint `quint_precentor` as Quinte’s door.

**Wave-8…19 SDE extras — do not restamp:** `about_hinge_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `pair_gallery`, `knight_fold_regent`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `cap_precentor`, `reach_fold_regent`, `knight_gallery`, `quad_nave`, `pit_aisle`, `shunt_pulpit`, `nudge_nave`, `file_precentor`, `diag_fold_regent`, `rank_fold_regent`, `file_gallery`, `hexa_nave`, `lava_aisle`, `strike_pulpit`, `shock_nave`, `ring_gallery`, `hepta_nave`, `frost_aisle`, `last_pulpit`, `rift_court`, `leap_fold_regent`, `tern_gallery`, `octa_nave`, `bog_aisle`, `spawn_pulpit`, `belt_nave`, `hoop_precentor`, `lane_fold_regent`, `hook_gallery`, `nona_nave`, `mill_aisle`, `idle_pulpit`, `brier_nave`, `hook_precentor`, `hook_fold_regent`, `camel_gallery`, `deca_nave`, `cipher_aisle`, `hollow_pulpit`, `fuse_nave`, `camel_precentor`, `camel_fold_regent`. Do **not** retag `even_gallery` as Octave Hood. Do **not** consume encounter-catalog `ENC-*` rooms. Do not name unique families `octave_mender` / `cadence_quinter` / `pentadeca_prelate` / `septet_mender` / `cadence_quarter` / `tetradeca_prelate` / `sestet_mender` / `cadence_tiercer` / `trideca_prelate` / `stave_mender` / `cadence_docker` / `dodeca_prelate` / `score_mender` / `file_warder`.

**New proposed extra doors for the boss designer (Wave 21 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `octave_cantor` first-win | Octave Mend MULTI child (observe+win still grants). `septet_cantor` stays Septet Mend. `sestet_cantor` stays Sestet Mend. `stave_cantor` stays Stave Mend. `score_cantor` stays Score Mend. `tally_cantor` stays Tally Mend. `poise_cantor` stays Poise Mend. `gaunt_cantor` stays Gaunt Mend. `parched_cantor` stays the dropped Parched Mend slot — **do not reuse**. Equal Gift / Lean Gift / Prime Gift / Gait Gift / Wide Gift / Thin Gift have **no** extra door — do not invent `equal_cantor` / `lean_cantor` / `prime_cantor` / `gait_cantor_gift` / `wide_cantor` / `thin_cantor` / `sum_cantor` / `eight_cantor` / `octa_cantor`. |
| `quinte_precentor` first-win | Cadence Quinte MULTI child. `quarte_precentor` stays Quarte. `tierce_precentor` stays Tierce. `dock_precentor` stays Dock. `snuff_precentor` stays Snuff. `prime_precentor` stays Prime. `floor_precentor` stays Floor. `lag_precentor` stays Lag. `imprint_precentor` stays Imprint. `halve_precentor` stays Halve. `cap_precentor` stays Pack Cap. `file_precentor` stays Pack File (`ENEMY_ONLY`). Do **not** mint `rise_precentor` / `tern_precentor` / `quad_precentor` / `quint_precentor` / `five_precentor` / `cinque_precentor` / `fifth_precentor`. |
| `span_pentadeca` first-win | Pentadeca Span MULTI child. `span_tetradeca` stays Tetradeca Span. `span_trideca` stays Trideca Span. `span_dodeca` stays Dodeca Span. `span_hendeca` stays Hendeca Span. `span_dec` stays Dec Span. `span_nine` stays Nine Span. `span_oct` stays Oct Span. `span_six` stays Six Span. `span_sept` stays Sept Span. `span_penta` stays Penta Span. `span_quad` stays Quad Span. `span_triune` stays Triple Span. Do **not** mint `span_fifteen` / `span_3x5` / `span_plus`. |
| `court_quinte_regent` kit only | Court Quinte (`NOT_PLAYER_LEARNABLE`). `court_quarte_regent` stays Court Quarte. `court_tierce_regent` stays Court Tierce. `court_dock_regent` stays Court Dock. `court_snuff_regent` stays Court Snuff. `court_prime_regent` stays Court Prime. `court_floor_regent` stays Court Floor. `court_lag_regent` stays Court Lag. `court_imprint_regent` stays Court Imprint. `reach_fold_regent` stays Reach Fold. `diag_fold_regent` stays Diag Fold. `rank_fold_regent` stays Rank Fold. `leap_fold_regent` stays Leap Fold. `lane_fold_regent` stays Lane Fold. `hook_fold_regent` stays Hook Fold. `camel_fold_regent` stays Camel Fold. Do **not** mint `court_five_regent` / `court_quint_regent`. |

Piece-type observe paths (not feat doors): cantors / bishops for Octave Mend; scribes / tempo for Cadence Quinte; masons / rooks ELITE for Pentadeca Span; hex / queens for Kin Turn; lurkers / knights for Octave Hood; lurkers / pawns for Octave Sting; porters / queens for Octave Step; masons / rooks for Octave Sill; hex / knights for Octave Hold; buffers / bishops for Octave Lend; hex / pawns for Octave Sip; masons / pawns for Octave Post; queens / bishops for Octave Bounce; knights / pawns for Must Octave; hex / bishops for Verse Octave.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 / #1177 / #1198 key names for a different meaning. Do **not** reuse `invertApMp` (Tempo Invert). Do **not** reuse `invertHostileLeftoverApMp` (Purse Turn). Do **not** reuse `crossLeftoverApMpTwoBody` (Bar Cross). Do **not** reuse `invertTwoHostilesLeftoverApMp` (Duel Turn). Do **not** reuse `invertTwoAlliesLeftoverApMp` (Hymn Turn). Do **not** reuse `invertMixedSidesLeftoverApMp` (Psalm Turn). Do **not** reuse `invertCasterAndHostileLeftoverApMp` (Feud Turn). Do **not** reuse `floorRemainingCdsTo1` (Cadence Floor). Do **not** reuse `primeRemainingCdsFrom0` (Cadence Prime). Do **not** reuse `snuffRemainingCdsEq1To0` (Cadence Snuff). Do **not** reuse `capRemainingCdsAbove2To2` (Cadence Cap). Do **not** reuse `dockRemainingCdsEq2To0` (Cadence Dock). Do **not** reuse `capRemainingCdsAbove3To3` (Cadence Tern). Do **not** reuse `tierceRemainingCdsEq3To0` (Cadence Tierce). Do **not** reuse `quarteRemainingCdsEq4To0` (Cadence Quarte). Do **not** reuse Quint’s remaining `n>5→5` key — Quint’s key stays #1198’s. Do **not** reuse `tallySumN` / `scoreSumN` / `staveSumN` / `sestetSumN` / `septetSumN` / `scoreForbidEqual` / `sestetForbidEqual`. Do **not** reuse `hendecaSpanCells` / `decSpanCells` / `nineSpanCells` / `nineSpanSolid` / `dodecaSpanCells` / `dodecaLong` / `dodecaShort` / `tridecaSpanCells` / `tridecaArm` / `tetradecaSpanCells` / `tetradecaLong` / `tetradecaShort`. Do **not** reuse `requireLeftoverApEq1AndMpEq1` (Prime Gift). Do **not** reuse `requireLeftoverApGe2AndMpEq0` (Gait Gift). Do **not** reuse Wide Gift’s leftover AP≥2-and-MP≥1 key. Do **not** reuse Thin Gift’s leftover 1/0 key.

`mpCost` stays 0 on every Wave-20 row.

**New keys (Wave 20 only):**

```text
requireCasterLeftoverSumEq, requireTargetLeftoverSumEq, octaveSumN, octaveMendAmount, octaveForbidEqual,  // Octave Mend — AP+MP === 8 AND unequal on both bodies
quinteRemainingCdsEq5To0,                                                                               // Cadence Quinte — remaining n===5 → 0; n===1, n===2, n===3, n===4, n>5 unchanged
pentadecaSpanCells, pentadecaLongArm, pentadecaShortArm,                                                // Pentadeca Span — 15; stretched plus 4 / 3
invertCasterAndAllyLeftoverApMp,                                                                        // Kin Turn — caster + one same-side non-caster; caster participates
octaveHoodNextHit,                                                                                      // Octave Hood — next hit while sum===8 unequal, any range → 0
octaveLeftoverSumEq, octaveStingBonus,                                                                  // Octave Sting
octaveStepNeedSumEq, octaveStepAdj,                                                                     // Octave Step — dest Chebyshev 1 of target
octaveSillNeedSumEq, octaveSillDamage, octaveSillDuration,                                              // Octave Sill — start-of-their-turn tax
octaveHoldWhileSumEq, octaveHoldDuration,                                                               // Octave Hold — 2 of their turns
octaveLendAp, octaveLendMp, requireTargetSumEqLend,                                                     // Octave Lend — +1 AP and +1 MP iff sum===8 unequal (exits window)
octaveSipAp, requireTargetSumEqSip,                                                                     // Octave Sip — steal 1 leftover AP iff sum===8 unequal
octavePostDetonateDamage, octavePostNeedSumEq,                                                          // Octave Post — 10 on end-turn occupy if sum===8 unequal
octaveBounceNeedSumEq, octaveBounceSearchRadius, octaveBounceCount,                                     // Octave Bounce
mustNonStrikeUnlessSumEqAndSpendsLastAp,                                                                // Must Octave — pre-spend leftover (same key name as Must Septet/Sestet/Stave/Score; octaveSumN distinguishes)
verseOctaveUntilSumEq,                                                                                  // Verse Octave
courtQuinteExcludeCaster                                                                                // Court Quinte
```

If a key is missing, the rider does not fire. `octaveSumN` is **8** on every Octave\* row that names a sum. Missing `octaveSumN` → gate fails closed (do not guess 8 from the name; do not treat (4,3) as Octave; do not treat (4,4) as Octave; do not treat (5,3) as Septet). **`octaveForbidEqual` is required:** leftover sum 8 is even and **can** tie at (4,4). Missing `octaveForbidEqual` → fail closed (do not silently treat (4,4) as Octave; that is Poise). Do not copy `sestetForbidEqual` / `scoreForbidEqual` onto this family under a reused name.

Nested kit-only id (not a player card): none new besides Court Quinte itself. Octave Post’s detonate is **not** a second spell id (the summon row carries `octavePostDetonateDamage`). Do not mint `spell-octave-burst`.

Leftover AP / leftover MP are **current remaining after this spell’s AP is paid**, read from the same pools the HUD uses — **except Must Octave**, which reads leftover **before** debit (a “spends last AP” gate is otherwise impossible once leftover AP is already 0). Walk spends must write leftover MP. Spell spends must write leftover AP. Missing leftover → the gate fails closed (fizzle rider, AP spent, observe). Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count as leftover for these gates. **Dual Keep caps surviving leftover AP and leftover MP at 2**, so Dual Keep leftover sums to **at most 4**. Dual Keep **cannot** open Octave (sum 8). Sum is integer `leftoverAp + leftoverMp`. Leftover `0 + 0` is **not** an Octave window (sum 0). Leftover `3 + 0` is **not** an Octave window (sum 3, Tally). Leftover `3 + 1` is **not** an Octave window (sum 4, Score). Leftover `3 + 2` is **not** an Octave window (sum 5, Stave). Leftover `2 + 2` is **not** an Octave window (sum 4 **and** a tie, Poise). Leftover `3 + 3` is **not** an Octave window (sum 6 **and** a tie, Poise). Leftover `4 + 2` is **not** an Octave window (sum 6 unequal, Sestet). Leftover `4 + 3` is **not** an Octave window (sum 7, Septet). Leftover `4 + 4` is **not** an Octave window (sum 8 **and** a tie, Poise — `octaveForbidEqual`). Leftover `1 + 1` is **not** an Octave window (Prime Gift / Poise). Legal pairs after a successful Octave gate: **(8,0) (0,8) (7,1) (1,7) (6,2) (2,6) (5,3) (3,5)** only.

A 6 AP / 3 MP bar that pays this heal’s 3 AP lands at leftover **(3,3)** — that is Poise, **not** Octave. A 7 AP / 3 MP bar that pays 3 AP lands at leftover **(4,3)** — that is Septet, **not** Octave. A 7 AP / 2 MP bar that pays 3 AP lands at leftover **(4,2)** — that is Sestet, **not** Octave. A 8 AP / 2 MP bar that pays 3 AP lands at leftover **(5,2)** — that is Septet, **not** Octave. The intended bank is a **8 AP / 3 MP** bar (or Haste / Tempo Gift / Sestet Lend) so the post-debit pair is (5,3).

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Cadence Quinte’s ready-unlock of remaining-5 is paid in **currently remaining 5**, not in extra AP. Octave Mend’s 8 is paid in **two sum===8 unequal bars on two bodies** after a 3-AP debit (Septet Mend is the two-body sum-7 cousin; Sestet Mend is the two-body sum-6-unequal cousin). Dual Keep cannot fake this window — the player (or Haste / Tempo Gift / Sestet Lend / a 8 AP / 3 MP bar after a 3-AP spend) has to actually sit on eight.

Do **not** put Must Octave in the same CORE as a Strike-only octave lock (this pass does not ship that lock). Do **not** CORE Octave Hood with Spent Plate, Gait Plate, Dual Plate, Prime Plate, Thin Plate, Wide Plate, Poise Hood, Tally Hood, Score Hood, Stave Hood, Sestet Hood, or Septet Hood. Do **not** CORE Octave Mend with Hollow Gift, Gaunt Mend, Poise Mend, Equal Gift, Tally Mend, Score Mend, Stave Mend, Sestet Mend, Septet Mend, Lean Gift, Prime Gift, Gait Gift, Wide Gift, or Thin Gift. Do **not** CORE Kin Turn with Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, Psalm Turn, or Feud Turn. Do **not** CORE Cadence Quinte with Cadence Quint, Quarte, Tierce, Dock, Snuff, Tern, Quad, Rise, Prime, Floor, Cap, Halve, Trim, Crack, or Flush.

---

## 5. Proposed spells (Wave 20)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-octave-mend`

NAME: Octave Mend  
ROLE: SUPPORT — heal if caster **and** target leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"requireCasterLeftoverSumEq":true,"requireTargetLeftoverSumEq":true,"octaveSumN":8,"octaveMendAmount":8,"octaveForbidEqual":true}`. If **both** caster and target have leftover AP + leftover walk MP **=== 8 AND leftover AP ≠ leftover MP** at resolve (after this spell’s 3 AP is paid), heal the target 8 through the existing heal helper. If either sum ≠ 8 **or** either body is tied, fizzle rider (AP spent, no HP). Walk / force-move flags do **not** substitute. Distinct from Septet Mend (#1177, **both bodies leftover AP + leftover MP === 7** — odd sum, never an equality), Sestet Mend (#1132, **both bodies leftover AP + leftover MP === 6 AND leftover AP ≠ leftover MP**), Stave Mend (#1063, **both bodies leftover AP + leftover MP === 5**), Score Mend (#1011, **both bodies leftover AP + leftover MP === 4 AND leftover AP ≠ leftover MP**), Tally Mend (#953, **both bodies leftover AP + leftover MP === 3**), Poise Mend (#890, **both bodies leftover AP === leftover MP ≥ 1** — **(4,4) is Poise**, not Octave), Equal Gift (#906, **target only** leftover AP == leftover MP ≥ 1; caster leftover unread), Prime Gift (#1017, **target leftover AP exactly 1 AND leftover MP exactly 1**), Gait Gift (#1082, **one body leftover AP ≥ 2 AND leftover MP = 0** — (8,0) is Gait Gift **and** an Octave pair; Octave Mend still requires **both** bodies), Wide Gift (#1143, **one body leftover AP ≥ 2 AND leftover MP ≥ 1** — (7,1) (6,2) (5,3) are Wide Gift **and** Octave pairs; Octave Mend still requires **both** bodies), Thin Gift (#1198, **one body leftover AP === 1 AND leftover MP === 0** — no Octave pair), Hollow Gift (#837, **target only** leftover AP=0 **and** leftover MP=0), Gaunt Mend (#849, **both bodies leftover AP=0 and leftover MP=0**), Lean Gift (#962, leftover **AP = 0 and leftover MP ≥ 1** — (0,8) is Lean Gift **and** an Octave pair), Dry Mend (#747, both leftover **AP = 0**, MP unconstrained), Dry Gait (#802, both leftover **MP = 0**, AP unconstrained), Ready Sting (leftover AP≥1 **and** MP≥1 with **no sum**), Tied Gait (#906, leftover AP **and** leftover MP **exactly 2**), Dual Plate (#1017, leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** — (4,4) is Dual Plate **and** Poise, **not** Octave). Legal pairs: (8,0) (0,8) (7,1) (1,7) (6,2) (2,6) (5,3) (3,5). The decision: two bodies **sum to 8 without tying** — Dual Keep 2/2 is Poise **and** Score-blocked, **not** Octave (sum 4); Dual Keep **cannot** open Octave; a 6 AP / 3 MP bar that pays this 3 AP lands at **(3,3)** and **fails** (that is Poise Mend’s window); a 7 AP / 3 MP bar that pays 3 AP lands at **(4,3)** and **fails** (that is Septet Mend’s window); a 7 AP / 2 MP bar that pays 3 AP lands at **(4,2)** and **fails** (that is Sestet Mend’s window); sit on 8 leftover AP and 3 leftover MP after paying the heal, or Sestet Lend a (4,2) into (5,3). `healAmount` stays 0 on the row so `inferArchetype` (`enemyAI.ts` 447–452) does not treat a kit that only *carries* this id as healer; **healer CORE only** when the row is in a live pool. Even sum — **`octaveForbidEqual` is required** (unlike Septet / Stave / Tally).  
DURATION: instant  
SCALING: 8 follows heal% if any; amount otherwise fixed.  
SYNERGIES: Haste / Tempo Gift / Timestep to bank eight after the 3-AP spend; Sestet Lend **manufactures** Octave ((4,2)→(5,3)); Octave Lend **exits** to 10; Kin Turn **keeps** sum 8 on both bodies when both were already in-window.  
COUNTERPLAY: Spend a pool so either body leaves 8; Dual Keep (caps at 2, **blocks** Octave); sit on 4/4 (Poise) or 4/3 (Septet) or 4/2 (Sestet) or 3/3 (Poise) or 3/2 (Stave) or 3/1 (Score) or 2/1 (Tally) or 2/2 (Poise) or 1/1 (Prime Gift).  
POWER_BUDGET: Standard heal, gated on **two** leftover sums of 8 unequal (four leftover reads + two inequality checks). Blood Mend is 12 ungated self. Septet Mend is 8 on **two sum-7** bodies. Sestet Mend is 8 on **two sum-6 unequal** bodies. Dual Keep cannot fake this.  
AI_USAGE: `aiHint: "heal_if_both_bodies_leftover_ap_plus_mp_eq_8_unequal"`. Cantors / bishops. Skip if either leftover sum ≠ 8 or either body is tied. **Healer CORE only.** Do not dump leftover **only** to enable this if a Strike would kill.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop","queen"], levelZoneMin: 1 }`. MULTI child `octave_cantor`.  
EDGE_CASES: Targeting ally already allows self (`targeting.ts` 184–189). Self-cast requires the caster’s leftover sum === 8 **and** unequal (two keys, two reads of one body). Self-cast at leftover 4/4 **does not** collide with Poise Mend / Equal Gift — `octaveForbidEqual` fails. Self-cast at leftover 4/3 **does not** collide with Septet Mend — sum 7 fails `octaveSumN`. Self-cast at leftover 4/2 **does not** collide with Sestet Mend — sum 6 fails `octaveSumN`. Self-cast at leftover 3/3 **does not** collide with Poise Mend — sum 6 fails `octaveSumN`. Self-cast at leftover 0/0 **does not** collide with Hollow Gift / Gaunt Mend — sum 0 fails `octaveSumN`. Self-cast at leftover 2/2 **does not** collide with Poise Mend / Equal Gift / Tied Gait / Dual Plate — sum 4 fails `octaveSumN`. Self-cast at leftover 3/2 **does not** collide with Stave Mend — sum 5 fails `octaveSumN`. Self-cast at leftover 3/1 **does not** collide with Score Mend — sum 4 fails `octaveSumN`. Self-cast at leftover 3/0 **does not** collide with Tally Mend — sum 3 fails `octaveSumN`. Self-cast at leftover 1/1 **does not** collide with Prime Gift — sum 2 fails `octaveSumN`. Self-cast at leftover 8/0 **does** fire, and is **not** a Gait Gift clone (Gait Gift is one-body AP≥2/MP=0 with no second-body read). Self-cast at leftover 5/3 **does** fire, and is **not** a Wide Gift clone (Wide Gift is one-body AP≥2/MP≥1 with no second-body read). Player-side HP actually increased → `challengeHealUsedRef`. Missing keys → no heal. Missing `octaveSumN` → fail closed. Missing `octaveForbidEqual` → fail closed. Do not clone Septet Mend / Sestet Mend / Stave Mend / Score Mend / Tally Mend / Poise Mend / Equal Gift / Gaunt Mend / Lean Gift / Prime Gift / Gait Gift / Wide Gift / Thin Gift / Dry Mend / Dry Gait. Target-only sum===8 heal stays Wave 21 / SDE. If same-day SDE Wave 20 claims this leftover, **SDE wins** — keep both-body vs their target-only the way Septet vs Thin Gift / Sestet vs Wide Gift already split. Do not mint `spell-oct-mend` (Oct Span is occupy-weight 8). Do not mint `spell-octa-mend` (Octa Oath is Chebyshev = 8).  
IMPLEMENTATION_COMPLEXITY: LOW — four leftover reads + two inequality checks + existing heal helper.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-octave-mend
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
effectParams: {"requireCasterLeftoverSumEq":true,"requireTargetLeftoverSumEq":true,"octaveSumN":8,"octaveMendAmount":8,"octaveForbidEqual":true}
```

---

### SPELL_ID: `spell-cadence-quinte`

NAME: Cadence Quinte  
ROLE: CONTROL — remaining CDs `n===5` become `0`  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"quinteRemainingCdsEq5To0":true}`. For each spell id in the **target’s** remaining-CD map with `n === 5`, write `0`. Zeros stay 0. Remaining `n===1` **unchanged** (Snuff’s window). Remaining `n===2` **unchanged** (Dock’s window). Remaining `n===3` **unchanged** (Tierce’s window). Remaining `n===4` **unchanged** (Quarte’s window). Remaining `n>5` **unchanged** (Quint / Quad / Tern / Cap / Floor territory). Target **keeps every spell**. Once/battle flags and spell levels are **not** CDs. Distinct from Cadence Quint (#1198, remaining `n>5` → `5` — **fives stay 5**), Cadence Quarte (#1177, remaining `n===4` → `0` — fours, not fives), Cadence Tierce (#1132, remaining `n===3` → `0` — threes, not fives), Cadence Dock (#1063, remaining `n===2` → `0` — twos, not fives), Cadence Snuff (#1011, remaining `n===1` → `0` — ones, not fives), Cadence Quad (#1143, remaining `n>4` → `4` — **fives become 4**, not 0), Cadence Tern (#1082, remaining `n>3` → `3` — **fives become 3**, not 0), Cadence Cap (#1017, remaining `n>2` → `2` — **fives become 2**, not 0), Cadence Rise (#962, remaining `n===1` → `2`), Cadence Prime (#953, remaining `n===0` → `1`), Cadence Floor (#906, remaining `n>1` → `1`; **zeros stay 0**; would peel a 5 to 1, **not** to 0), Cadence Swap (#837, **exchange full remaining maps**), Cadence Lag (#849, remaining `n>0` → `n+2`), Cadence Stall (#590, remaining `n>0` → `n+1`; zeros stay 0), Cadence Stretch (#636, remaining ×2), Cadence Theft (#411, **steals** remaining), Cadence Imprint (#787, **copies** onto the caster; target keeps), Cadence Rest (#747, **own** remaining do not tick), Cadence Grace (#802, **next own spell does not start** its cooldown), Cadence Halve (#726, **÷2** on the hostile), Cadence Trim / Shave / Pin / Crack / Flush. The decision: their Inferno is sitting on remaining 5 — Quinte makes it legal **this turn**; Quarte would have needed remaining 4; Tierce would have needed remaining 3; Dock would have needed remaining 2; Snuff would have needed remaining 1; Quint would have **left** a 5; Quad would have written 4; Tern would have written 3; Cap would have written 2; Floor would have written 1.  
DURATION: instant rewrite of remaining `n===5`  
SCALING: none.  
SYNERGIES: Quint a 7 to 5, **then** Quinte the 5 to 0 on a **later** turn (do **not** CORE Quint with Quinte). Verse Octave so the unlocked id is also their last verse.  
COUNTERPLAY: Sit remaining at 1 (Snuff’s problem) or at 2 (Dock’s problem) or at 3 (Tierce’s problem) or at 4 (Quarte’s problem) or at 6+ (Quint / Quad / Tern / Cap / Floor’s problem); recast before Quinte; Cadence Break your own remaining.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **unlock remaining-5**, not a silence and not a mass zero.  
AI_USAGE: `aiHint: "quinte_remaining_cds_eq_5_to_0"`. Scribes / tempo. Skip if the target has no remaining `n===5`. Do **not** CORE with Quint / Quarte / Tierce / Dock / Snuff / Quad / Tern / Cap / Floor / Rise / Prime.  
DISCOVERY_ELIGIBILITY: true. MULTI child `quinte_precentor`. `pieceTypes: ["bishop","queen"], levelZoneMin: 1`  
EDGE_CASES: Missing key → no rewrite. Do not write `spellLevelValues`. Do not reset Dual Keep’s once/battle. Preview must show which remaining drop from 5 to 0. All-non-5 remaining → fizzle rider (AP spent, observe). Do **not** reuse `quarteRemainingCdsEq4To0` / `tierceRemainingCdsEq3To0` / `dockRemainingCdsEq2To0` / `snuffRemainingCdsEq1To0` / `capRemainingCdsAbove2To2` / `capRemainingCdsAbove3To3` / `floorRemainingCdsTo1` / `primeRemainingCdsFrom0`. Do **not** mint `spell-cadence-quint` (SDE #1198 owns that as `n>5→5`). Do **not** mint `spell-cadence-cinque` / `spell-cadence-fifth` (#1198 tombstone). If same-day SDE Wave 20 claims this leftover, **SDE wins** — do not keep a second Quinte id. Quint already owns `n>5→5`; this card is `5→0` even if SDE later stamps a second Quint alias.  
IMPLEMENTATION_COMPLEXITY: LOW — walk remaining map, write 0 when n===5.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-cadence-quinte
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
effectParams: {"quinteRemainingCdsEq5To0":true}
```

---

### SPELL_ID: `spell-pentadeca-span`

NAME: Pentadeca Span  
ROLE: SUMMONS — stretched plus longArm 4 / shortArm 3 occupy; counts as **fifteen**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 4  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "pentadecaspan"`, `summonLifespan: 4`, empty kit (`summonUnitDef` with `pieceType: ""` / zero scales — a body, not a caster). `effectParams: {"pentadecaSpanCells":15,"pentadecaLongArm":4,"pentadecaShortArm":3}`. Click a free ground tile. That click is the **center** of the stretched plus (Hendeca Span / Trideca Span’s placement rule, **not** Dec / Dodeca / Tetradeca’s nearest-cell rule). Occupy a stretched orthogonal plus whose long axis is the dominant caster→click axis (`|dx| >= |dy|` → long arm 4 along x and short arm 3 along y; else long arm 4 along y and short arm 3 along x). Footprint is 9-spine × 7-crossbar with the center shared (1 + 2×4 + 2×3 = **15**). All 15 cells must be free and in-bounds (`isCellFree`); else fizzle (AP spent). One combatant id, fifteen-cell footprint. Every cell of the 15 is occupied (not a cage hole — Oct Span’s hollow 3×3 stays Oct Span). Counts as **fifteen** toward the summon cap. Distinct from Tetradeca Span (#1177, axis-aligned **2×7** = 14, click = **nearest cell to caster**), Trideca Span (#1132, orthogonal plus **arm 3** = 13, click = **center**, **symmetric**), Dodeca Span (#1063, axis-aligned **3×4** = 12, click = **nearest cell to caster**), Hendeca Span (#1011, stretched plus longArm 3 / shortArm 2 = **11**, click = **center**), Dec Span (#953, axis-aligned **2×5** = 10, click = nearest cell), Nine Span (#890, solid 3×3 = 9, click = center), Oct Span (#849, hollow 3×3 = 8), Sept Span (#726, stretched plus longArm 2 / shortArm 1 = 7), Penta Span (plus arm 1 = 5), Six Span (2×3 = 6), Quad Span (2×2 = 4), Triple / Twin Span. Empty kit.  
DURATION: lifespan 4 or until the body dies (frees all fifteen)  
SCALING: none (occupy, not damage).  
SYNERGIES: Octave Hold so they cannot walk around the plus; Score / Tally / Stave / Sestet / Septet / Octave Sill on a cell **beside** the block, not on it (occupied).  
COUNTERPLAY: Coup the body; blink past; File Lance along the long spine; occupy-weight still 2 live so this card **does not ship** until a dedicated occupy-weight exists.  
POWER_BUDGET: Heavy 4 / CD 3 / 0 damage. Power is **fifteen occupied cells**. Implementation-blocked while `ENEMY_SUMMON_CAP === 2`.  
AI_USAGE: `aiHint: "pentadeca_span_if_stretched_plus_free_and_cuts_a_file"`. Masons / rooks ELITE. Skip if any of the 15 is occupied / off-map / a portal. Missing hint → drop id.  
DISCOVERY_ELIGIBILITY: true. MULTI child `span_pentadeca`. `pieceTypes: ["rook"]`, `levelZoneMin: 2`  
EDGE_CASES: **Do not ship while `ENEMY_SUMMON_CAP === 2` without occupy-weight.** Never parse `"Pentadeca Span"` / `"Fifteen"` / `"3x5"`. One id, fifteen cells — destroying the body frees all fifteen. Player-side Pentadeca Span counts toward the **player** summon economy, not `ENEMY_SUMMON_CAP`. Missing `pentadecaSpanCells` → do not spawn a 1-cell body and call it Pentadeca Span. Missing `pentadecaLongArm` / `pentadecaShortArm` → do not guess 2×7 (that is Tetradeca Span), plus arm 3 (that is Trideca Span), or longArm 3 / shortArm 2 (that is Hendeca Span). Off-map cell → fizzle. Do not mint `spell-fifteen-span` / `spell-pentakaideca-span` / `spell-plus-span`. Cardinal click with `dx===0 && dy===0` is illegal (`freeCells` / caster tile) — the center cannot be the caster’s cell. Click is **center**, not nearest cell (Tetradeca’s nearest-cell stays Tetradeca; a stretched plus **has** a unique center). Diagonals of the bounding box that are outside the plus are **not** occupied. Do not alias Penta Span (`spell-penta-span`, occupy-weight 5).  
IMPLEMENTATION_COMPLEXITY: HIGH — occupy-weight + stretched-plus placer. Same class as Hendeca / Trideca / Tetradeca.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-pentadeca-span
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
summonAI: pentadecaspan
summonLifespan: 4
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
acquisitionModel: MULTI_SOURCE
discoveryEligible: true
effectParams: {"pentadecaSpanCells":15,"pentadecaLongArm":4,"pentadecaShortArm":3}
```

---

### SPELL_ID: `spell-kin-turn`

NAME: Kin Turn  
ROLE: CONTROL — invert leftover AP↔MP on **the caster and one same-side non-caster ally**; caster participates  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: No damage. **Not** `isSwap`. `effectParams: {"invertCasterAndAllyLeftoverApMp":true}`. Target one living **same-side non-caster** body (ally targeting already allows self at `targeting.ts` 184–189 — **self-target is illegal** and fizzles the rider; that is Tempo Invert). Snapshot **the caster’s** leftover AP and leftover MP **and** the target’s leftover AP and leftover MP, then write leftover AP ← leftover MP and leftover MP ← leftover AP on **each** body independently, each **capped at that pool’s max**. Caster leftover **does change**. Caster does not move. Distinct from Feud Turn (#1177, **caster + one opposite-side hostile**, caster participates, via `invertCasterAndHostileLeftoverApMp` — **do not reuse that key**), Psalm Turn (#1132, **one same-side non-caster + one opposite-side**, caster **unchanged**, via `invertMixedSidesLeftoverApMp` — **do not reuse that key**), Hymn Turn (#1063, **two same-side non-caster allies** independent invert, caster **unchanged**, via `invertTwoAlliesLeftoverApMp` — **do not reuse that key**; this card’s second body is **one** ally and the caster **does** invert), Duel Turn (#1011, **two hostiles** independent invert via `invertTwoHostilesLeftoverApMp` — **do not reuse that key**), Purse Turn (#953, **one** hostile invert via `invertHostileLeftoverApMp` — **do not reuse that key**; caster unchanged), Tempo Invert (#282, **one-body ally/self** leftover AP↔MP via `invertApMp` — **do not reuse that key**; a self-only invert is **not** this two-body card), Bar Cross (#890, **two-body leftover cross**: caster AP ↔ target MP **and** caster MP ↔ target AP via `crossLeftoverApMpTwoBody` — **do not reuse that key**; that **exchanges across bodies**, this **inverts each body independently**), Dual Keep (banks leftover AP **and** MP on **one** body, no invert), Swap / Pawn Trade (tiles, not pools), Choir Hymn (Wave-1 Discovery heal — **do not alias**), Duel Turn (two hostiles — **do not alias**; do **not** mint `spell-duet-turn`). Player-side summons **are** legal second bodies (same-side).  
DURATION: instant leftover rewrite; no snap-back at turn end  
SCALING: none.  
SYNERGIES: Octave Mend / Octave Sting after the invert **keeps** sum 8 on a body that was already in-window; Septet Mend after you invert a (5,3) caster with a (4,3) ally (caster stays Octave, ally stays Septet). Must Octave after you dump their AP into MP.  
COUNTERPLAY: Keep leftover AP === leftover MP on both so both inverts are no-ops; Quiet Hex after they invert into a 3-AP spell; sit the caster on a window they did not want to leave.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **the caster’s leftover flip plus one ally leftover flip**, not a swap, not Hymn Turn (caster stays), not Feud Turn (hostile), and not Bar Cross (cross-body exchange).  
AI_USAGE: `aiHint: "kin_turn_if_ally_in_r3_and_at_least_one_of_caster_or_ally_is_unequal"`. Hex / queens. Skip if both inverts would be no-ops (both already AP===MP) or if no non-self ally is in range.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing `invertCasterAndAllyLeftoverApMp` → fail closed (do **not** invert only the ally and become a one-body Tempo Invert on them; do **not** invert only the caster and become Tempo Invert; do **not** invert a hostile and become Feud Turn). Self-target → fizzle rider (AP spent, observe) — do **not** fall through to Tempo Invert. Invert (5,3)→(3,5) **stays Octave**. Invert (8,0)→(0,8) **stays Octave**. Invert (7,1)→(1,7) **stays Octave**. Invert (6,2)→(2,6) **stays Octave**. Invert (4,4) is a no-op (Poise stays Poise). Invert (4,3)→(3,4) **stays Septet**. Invert (4,2)→(2,4) **stays Sestet**. Invert (3,3) is a no-op (Poise stays Poise). Invert (3,2)→(2,3) **stays Stave**. Invert (3,1)→(1,3) **stays Score**. Do **not** reuse `invertCasterAndHostileLeftoverApMp` / `invertMixedSidesLeftoverApMp` / `invertTwoAlliesLeftoverApMp` / `invertTwoHostilesLeftoverApMp` / `crossLeftoverApMpTwoBody`. If same-day SDE Wave 20 claims this leftover, **SDE wins**. Do not mint `spell-duet-turn` / `spell-choir-turn` / `spell-pew-turn` / `spell-aisle-turn` / `spell-mixed-turn` / `spell-self-ally-turn` / `spell-pair-turn`. Solo caster with no living same-side non-caster in range **does not** fire (unlike Feud Turn, which needs only a hostile).  
IMPLEMENTATION_COMPLEXITY: LOW — two leftover snapshots + two writes + self-target reject. Same class as Feud Turn / Hymn Turn with a caster-include + same-side filter.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-kin-turn
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
effectParams: {"invertCasterAndAllyLeftoverApMp":true}
```

---

### SPELL_ID: `spell-octave-hood`

NAME: Octave Hood  
ROLE: DEFENSE — next applied hit is 0 iff leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"octaveHoodNextHit":true,"octaveSumN":8,"octaveForbidEqual":true}`. Arm a one-hit consume: the next applied hit on the caster is 0 **if at impact** leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**. Any Chebyshev. The charge remains if the hit arrives while the sum ≠ 8 or the body is tied (hit lands fully; charge stays). Distinct from Septet Hood (#1177, leftover AP + leftover MP === 7), Sestet Hood (#1132, leftover AP + leftover MP === 6 **and unequal**), Stave Hood (#1063, leftover AP + leftover MP === 5), Score Hood (#1011, leftover AP + leftover MP === 4 **and unequal**), Tally Hood (#953, leftover AP + leftover MP === 3), Poise Hood (#890, leftover AP === leftover MP ≥ 1 — **(4,4) is Poise Hood**), Dual Plate (#1017, leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** — (4,4) is Dual Plate / Poise, **not** Octave), Prime Plate (#1082, leftover **1/1**), Thin Plate (#1143, leftover **1/0**), Wide Plate (#1198, leftover **AP ≥ 2 AND MP ≥ 1** — (7,1) (6,2) (5,3) are Wide Plate **and** Octave pairs; Octave Hood still requires **the sum === 8 AND unequal**, not the inequality-free AP≥2/MP≥1 window), Spent Plate (#837, leftover **AP ≥ 1**, MP unconstrained), Gait Plate (#802, leftover **MP ≥ 1**, AP unconstrained), Dry Plate (#962, leftover **MP = 0**), Even Hood (#849, **even Chebyshev**), Odd Hood (odd Chebyshev), Near / Mid / Far Hood (range bands), Odd Plate (#906, leftover **AP odd**), Fresh Plate (#1198, leftover AP **equals max**). The decision: hold (5,3) through the hit — Dual Keep 2/2 is Poise Hood / Dual Plate, **not** this — or spend into 4/3 and Septet Hood still works, this does not. Do **not** CORE with Spent Plate, Gait Plate, Dual Plate, Prime Plate, Thin Plate, Wide Plate, Poise Hood, Tally Hood, Score Hood, Stave Hood, Sestet Hood, or Septet Hood.  
DURATION: until consumed at a sum===8 unequal impact, or battle end  
SCALING: none (negate, not a RES%).  
SYNERGIES: Haste to bank eight; Kin Turn a (8,0) caster into (0,8) still Octave Hood; Octave Hold so they cannot walk you off 8.  
COUNTERPLAY: Wait until they spend a pool; Coup; hit them on 4/4 (Poise Hood / Dual Plate) or 4/3 (Septet Hood) or 4/2 (Sestet Hood) or 3/3 (Poise Hood) or 3/2 (Stave Hood) or 3/1 (Score Hood).  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **one hit while sitting on eight unequal**. Dual Keep cannot fake it.  
AI_USAGE: `aiHint: "octave_hood_if_self_leftover_sum_eq_8_unequal"`. Lurkers / knights ELITE. Skip if leftover sum ≠ 8 or the body is tied.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Missing `octaveSumN` or `octaveForbidEqual` → fail closed. Leftover 4/4 at impact → hit lands (Poise Hood / Dual Plate). Leftover 4/3 at impact → hit lands (Septet Hood). Leftover 4/2 at impact → hit lands (Sestet Hood). Leftover 3/3 at impact → hit lands (Poise Hood). Leftover 3/2 at impact → hit lands (Stave Hood). Leftover 3/1 at impact → hit lands (Score Hood). Leftover 2/2 at impact → hit lands (Poise Hood / Dual Plate). Leftover 1/1 at impact → hit lands (Prime Plate / Poise). Leftover 1/0 at impact → hit lands (Thin Plate). Do **not** retag `even_gallery`.  
IMPLEMENTATION_COMPLEXITY: LOW — one leftover-sum-and-unequal gate on the next applied hit.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-octave-sting`

NAME: Octave Sting  
ROLE: DAMAGE — 10, plus 8 if target leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. Then if the target’s leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**, deal `octaveStingBonus` (8) as a second existing `dealDamage` call. `effectParams: {"octaveLeftoverSumEq":true,"octaveSumN":8,"octaveStingBonus":8,"octaveForbidEqual":true}`. Distinct from Septet Sting (#1177, leftover AP + leftover MP === 7), Sestet Sting (#1132, leftover AP + leftover MP === 6 **and unequal**), Stave Sting (#1063, leftover AP + leftover MP === 5), Score Sting (#1011, leftover AP + leftover MP === 4 **and unequal**), Tally Sting (#953, leftover AP + leftover MP === 3), Poise Sting (#890, leftover AP === leftover MP ≥ 1), Gaunt Sting (#849, leftover **both 0**), Lean / Dry / Ready / Full / Even Sting (#962, leftover AP **even and ≥ 2** — (4,4) is even AP, which is Poise, not Octave), Fresh Sting (#1017), Capped Sting (#1082, leftover MP **equals max MP**), Wide Sting (#1143), Hollow Sting (#1198, leftover **both 0** damage), Lean Gait (#1198, leftover AP === 0 AND MP ≥ 1), Odd Sting (#906, leftover **AP odd**), Tied Gait (#906, both leftover **exactly 2**). The decision: poke the (5,3) bishop for 18, or poke anyone for 10. Dual Keep 2/2 is the **wrong** window (Poise Sting). Dual Keep cannot open this. (4,4) is Poise Sting, not this. (4,3) is Septet Sting, not this. (4,2) is Sestet Sting, not this. (3,3) is Poise Sting, not this.  
DURATION: instant  
SCALING: 10 / 8 follow damage%.  
SYNERGIES: Kin Turn a (8,0) into (0,8) still Octave; Octave Hold so they cannot walk the MP off.  
COUNTERPLAY: Sit on 4/4 (Poise Sting) or 4/3 (Septet Sting) or 4/2 (Sestet Sting) or 3/3 (Poise Sting) or 3/2 (Stave Sting) or 3/1 (Score Sting) or 2/1 (Tally Sting) or 0/0 (Gaunt Sting / Hollow Sting).  
POWER_BUDGET: Cheap 2 / CD 1. 10 ungated + 8 on a sum of 8 unequal.  
AI_USAGE: `aiHint: "octave_sting_if_target_leftover_sum_eq_8_unequal"`. Lurkers / pawns. Skip the bonus path if leftover sum ≠ 8 or the body is tied; 10 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing bonus keys → 10 only. Target leftover 4/4 → no bonus (Poise Sting). Target leftover 4/3 → no bonus (Septet Sting). Target leftover 4/2 → no bonus (Sestet Sting). Target leftover 3/3 → no bonus (Poise Sting). Target leftover 3/2 → no bonus (Stave Sting). Target leftover 3/1 → no bonus (Score Sting). Target leftover 3/0 → no bonus (Tally Sting). Do not name-wire the bonus.  
IMPLEMENTATION_COMPLEXITY: LOW — one leftover-sum-and-unequal gate + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-octave-step`

NAME: Octave Step  
ROLE: POSITION — relocate to Chebyshev 1 of an ally whose leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `freeCells` on the dest. `effectParams: {"octaveStepNeedSumEq":true,"octaveSumN":8,"octaveStepAdj":1,"octaveForbidEqual":true}`. Target an ally (not self) whose leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**. The caster **relocates** to a free cell at Chebyshev 1 of that ally (player picks the dest among legal neighbors; AI picks the safest). If the ally is not in the window or no neighbor is free, fizzle (AP spent, no move). Distinct from Septet Step (#1177, ally leftover sum === 7), Sestet Step (#1132, ally leftover sum === 6 **and unequal**), Stave Step (#1063, ally leftover sum === 5), Score Step (#1011, ally leftover sum === 4 **and unequal**), Tally Step (#953, ally leftover sum === 3), Poise Step (#890, ally leftover AP === leftover MP ≥ 1), Gaunt Step (#849, ally leftover **both 0**), Home / Heave / Parched / Ally Step, Hinge Step, Relay Dash. The decision: blink next to the (0,8) wisp — they have walk, you have position — or wait for a 4/3 and Septet Step, or a 4/4 and Poise Step, or a 4/2 and Sestet Step, or a 3/2 and Stave Step. Dual Keep cannot open this.  
DURATION: instant relocate  
SCALING: none.  
SYNERGIES: Octave Sill on a neighbor so they eat 8 at dawn if they stay on 8 unequal; Kin Turn keeps an ally in-window; Sestet Lend manufactures the ally’s Octave.  
COUNTERPLAY: Spend the wisp’s pool; occupy every neighbor; Coup; sit the wisp on 4/4 or 4/3.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **blink to an eight-bar unequal ally**.  
AI_USAGE: `aiHint: "octave_step_if_ally_leftover_sum_eq_8_unequal_and_a_neighbor_is_free"`. Porters / queens. Skip if no in-window ally or no free neighbor.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Self-target forbidden (`octaveStep` is not a self blink — that is Mist Step / Phase Slip). Missing keys → no move. Ally leftover 4/4 → fizzle (Poise Step). Ally leftover 4/3 → fizzle (Septet Step). Ally leftover 4/2 → fizzle (Sestet Step). Ally leftover 3/3 → fizzle (Poise Step). Ally leftover 3/2 → fizzle (Stave Step). Ally leftover 3/1 → fizzle (Score Step). Portal dest illegal (`isCellFree`).  
IMPLEMENTATION_COMPLEXITY: LOW — leftover-sum-and-unequal gate + existing relocate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-octave-sill`

NAME: Octave Sill  
ROLE: TERRAIN — start-of-their-turn occupy tax iff leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell for 2 turns. `effectParams: {"octaveSillNeedSumEq":true,"octaveSumN":8,"octaveSillDamage":8,"octaveSillDuration":2,"octaveForbidEqual":true}`. At the **start of a combatant’s turn**, if they occupy this cell and leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**, deal 8 through `updateCombatant`. Walk-enter does **not** tax (Ingress / Shove Sting). End-turn occupy does **not** tax (Octave Post / Dwell). Relocate landing does **not** tax (Drift Post). Distinct from Septet Sill (#1177, leftover sum === 7 at start), Sestet Sill (#1132, leftover sum === 6 **and unequal** at start), Stave Sill (#1063, leftover sum === 5 at start), Score Sill (#1011, leftover sum === 4 **and unequal** at start), Tally Sill (#953, leftover sum === 3 at start), Poise Sill (#890, leftover AP === leftover MP ≥ 1 at start), Gaunt Sill (#849, leftover **both 0** at start), Wake Mark (start-turn any leftover), Quiet / Cast / Drift / Parched Sill. The decision: stand on the sill at (5,3) and eat 8 at dawn, or spend a pool overnight, or sit on 4/4 and eat Poise Sill instead, or sit on 4/3 and eat Septet Sill, or sit on 4/2 and eat Sestet Sill. Dual Keep overnight **cannot** leave them on 8.  
DURATION: 2 turns of paint  
SCALING: 8 follows damage% if any; otherwise fixed.  
SYNERGIES: Octave Hold so they cannot walk off overnight; Kin Turn keeps sum 8 through dawn.  
COUNTERPLAY: Walk off (start-turn only); spend a pool; blink; dump to 4/4 or 4/3.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 upfront. Power is **dawn tax on a sum of 8 unequal**.  
AI_USAGE: `aiHint: "octave_sill_if_foe_will_start_turn_sum_eq_8_unequal_on_tile"`. Masons / rooks. Skip if they will not start on 8 unequal.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Paint on a portal → fizzle (`isCellFree`). Occupant leftover 4/4 at dawn → no tax (Poise Sill). Occupant leftover 4/3 at dawn → no tax (Septet Sill). Occupant leftover 4/2 at dawn → no tax (Sestet Sill). Occupant leftover 3/3 at dawn → no tax (Poise Sill). Occupant leftover 3/2 at dawn → no tax (Stave Sill). Occupant leftover 3/1 at dawn → no tax (Score Sill). Occupant leftover 3/0 at dawn → no tax (Tally Sill). Occupant leftover 0/0 at dawn → no tax (Gaunt Sill).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — painted cell + start-turn leftover-sum-and-unequal gate. Same class as Septet Sill / Sestet Sill / Stave Sill / Score Sill / Tally Sill / Poise Sill.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-octave-hold`

NAME: Octave Hold  
ROLE: CONTROL — cannot spend leftover MP to walk while leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"octaveHoldWhileSumEq":true,"octaveSumN":8,"octaveHoldDuration":2,"octaveForbidEqual":true}`. For 2 of the **target’s** turns, any walk that would spend ≥ 1 leftover MP is illegal **while leftover AP + leftover MP === 8 AND leftover AP ≠ leftover MP**. Teleport / Swap / Phase Slip / Twin-gate step / Octave Step (caster relocate) do **not** pay walk MP and are legal. Distinct from Septet Hold (#1177, cannot walk while leftover sum === 7), Sestet Hold (#1132, cannot walk while leftover sum === 6 **and unequal**), Stave Hold (#1063, cannot walk while leftover sum === 5), Score Hold (#1011, cannot walk while leftover sum === 4 **and unequal**), Tally Hold (#953, cannot walk while leftover sum === 3), Poise Hold (#890, cannot walk while leftover AP === leftover MP ≥ 1), Odd Hold (#849, cannot walk while leftover AP is **odd**), Dry Hold (until leftover **AP = 0**), Drift Hold (until **force-moved**), Cast Hold / Strike Hold / Boot Hold / Tool Hold / Gaunt Hold / Brick Hold (#1017). The decision: they have (0,8) and wanted to walk eight tiles — they must **leave sum 8** (cast leftover AP from a (5,3) / (6,2) / (7,1) / (8,0), get siphoned, get turned, **or dump to 4/4 or 4/3**) before walking, or wait 2 turns. At leftover (0,8) they **have** MP but cannot spend it while this lock is up **and** they still sum to 8 unequal. Dual Keep 2/2 is Poise Hold, **not** this. Dual Keep cannot open this. (4,4) is Poise Hold, not this. (4,3) is Septet Hold, not this. (4,2) is Sestet Hold, not this. (3,3) is Poise Hold, not this.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Must Octave on (0,8) so they can neither walk nor non-Strike; Kin Turn (0,8)→(8,0) so they lose the walk MP into leftover AP.  
COUNTERPLAY: Cast leftover AP to leave 8; dump to 4/4 or 4/3; blink; wait 2 turns.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **cannot walk while sitting on eight unequal**.  
AI_USAGE: `aiHint: "octave_hold_if_target_leftover_sum_eq_8_unequal_and_wants_to_walk"`. Hex / knights ELITE. Skip if leftover sum ≠ 8 or the body is tied.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Missing keys → no lock. Leftover (4,4) → this lock does **not** block walks (Poise Hold’s window). Leftover (4,3) → this lock does **not** block walks (Septet Hold’s window). Leftover (4,2) → this lock does **not** block walks (Sestet Hold’s window). Leftover (3,3) → this lock does **not** block walks (Poise Hold’s window). Leftover (3,2) → this lock does **not** block walks (Stave Hold). Leftover (3,1) → this lock does **not** block walks (Score Hold’s window). Leftover (2,2) → this lock does **not** block walks (Poise Hold). Leftover (3,0) → this lock does **not** block walks (Tally Hold; leftover MP is 0 anyway).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — leftover-sum-and-unequal gate in the walk spender.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-octave-lend`

NAME: Octave Lend  
ROLE: SUPPORT — +1 leftover AP and +1 leftover MP iff target leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP** (exits to 10)  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"octaveLendAp":1,"octaveLendMp":1,"requireTargetSumEqLend":true,"octaveSumN":8,"octaveForbidEqual":true}`. If the **target** has leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**, grant +1 current AP and +1 current MP (capped at max). The sum becomes **10** (the octave window **closes**). Inequality of the pre-lend pair is required (`octaveForbidEqual`) and is not preserved as a named family: (5,3)→(6,4), (6,2)→(7,3), (7,1)→(8,2), (8,0)→(9,1). This **cannot** manufacture Septet (sum 10 ≠ 7) or Sestet (sum 10 ≠ 6) or Stave (sum 10 ≠ 5) or Score (sum 10 ≠ 4) or Tally (sum 10 ≠ 3) or Poise (sum 10 is not a required equality). If the gate fails, fizzle rider (AP spent, no grant). Distinct from Septet Lend (#1177, +1/+1 if leftover sum === 7 — **exits** to 9), Sestet Lend (#1132, +1/+1 if leftover sum === 6 **and unequal** — **exits** to 8, **which is this family’s window**), Stave Lend (#1063, +1/+1 if leftover sum === 5 — **exits** to 7, which is Septet), Score Lend (#1011, +1/+1 if leftover sum === 4 **and unequal** — **exits** to 6, which is Sestet), Tally Lend (#953, +1/+1 if leftover sum === 3 — **exits** to 5, which is Stave), Poise Lend (#890, +1/+1 if leftover AP === leftover MP ≥ 1 — the **tie survives**), Gaunt Lend (#849, +1/+1 if leftover **both 0**), Lean / Drift / Spent Lend, Watch Alms, Tempo Gift / Loan Tempo / Haste, Dual Keep. The decision: cash the (5,3) wisp for a 2-resource bump, then they are out of Octave **and** out of Septet **and** out of Sestet **and** out of Stave **and** out of Score **and** out of Tally **and** out of Poise (sum 10 is 6/4 or 7/3 or 8/2 or 9/1). **Sestet Lend is the intended manufacture of Octave** ((4,2)→(5,3)). Do not name-wire that hop.  
DURATION: instant (current-turn leftover only)  
SCALING: amount fixed.  
SYNERGIES: Sestet Lend **into** Octave, then Octave Mend; or Octave Lend **out** of Octave into a 10-bar that Dual Keep cannot cap this turn.  
COUNTERPLAY: Sit off sum 8; sit on 4/4 (Poise Lend); sit on 4/3 (Septet Lend); sit on 4/2 (Sestet Lend); sit on 3/3 (Poise Lend); sit on 3/2 (Stave Lend); sit on 3/1 (Score Lend).  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **cash eight unequal for ten**, not a Haste.  
AI_USAGE: `aiHint: "octave_lend_if_ally_leftover_sum_eq_8_unequal"`. Buffers / bishops. Skip if leftover sum ≠ 8 or the body is tied.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing keys → no grant. Target leftover 4/4 → fizzle (Poise Lend). Target leftover 4/3 → fizzle (Septet Lend). Target leftover 4/2 → fizzle (Sestet Lend). Target leftover 3/3 → fizzle (Poise Lend). Target leftover 3/2 → fizzle (Stave Lend). Target leftover 3/1 → fizzle (Score Lend). Target leftover 2/1 → fizzle (Tally Lend). Cap at max: if leftover AP is already max, grant MP only — **then the sum may not be 10** and the window-exit is incomplete; fail closed if either grant cannot apply in full (both must land).  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-octave-sip`

NAME: Octave Sip  
ROLE: CONTROL — steal 1 leftover AP iff target leftover AP + leftover MP === 8 AND leftover AP ≠ leftover MP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: No HP damage. `effectParams: {"octaveSipAp":1,"requireTargetSumEqSip":true,"octaveSumN":8,"octaveForbidEqual":true}`. If the target leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP** **and** leftover AP ≥ 1, subtract 1 leftover AP from the target (not below 0) and add 1 leftover AP to the caster this turn, capped at max. If leftover AP is 0 (the (0,8) pair) or the sum ≠ 8 or the body is tied, fizzle rider (AP spent). Distinct from Septet Sip (#1177, steal 1 leftover AP iff leftover sum === 7 — **manufactures Sestet** from most steals, **Poise** from (4,3)→(3,3)), Sestet Sip (#1132, steal 1 leftover AP iff leftover sum === 6 **and unequal** — **manufactures Stave** from every successful steal), Stave Sip (#1063, steal 1 leftover AP iff leftover sum === 5 — **manufactures Score or Poise**), Score Sip (#1011, steal 1 leftover AP iff leftover sum === 4 **and unequal** — **manufactures Tally**), Tally Sip (#953, steal 1 leftover AP iff leftover sum === 3 — **manufactures Poise** from (2,1)→(1,1)), Poise Sip (#890, steal 1 leftover AP iff leftover AP === leftover MP ≥ 1), Bare Sip (#849, steal 1 leftover AP iff leftover **MP = 0**), Soul Sip (ungated current MP), Ap Sip (#342). The decision: sip (5,3) → they become (4,3) **Septet**; sip (6,2) → they become (5,2) **Septet**; sip (7,1) → they become (6,1) **Septet**; sip (8,0) → they become (7,0) **Septet**; sip (3,5) → they become (2,5) **Septet**; sip (2,6) → they become (1,6) **Septet**; sip (1,7) → they become (0,7) **Septet**. **Every successful Octave Sip manufactures Septet** — there is no Poise exception because (4,4) is banned from this window. That is the decision Septet Sip did have ((4,3)→(3,3) Poise) and this family does not. Dual Keep 2/2 is the **wrong** window (Poise Sip). (4,4) is Poise Sip, not this. (4,3) is Septet Sip, not this. (4,2) is Sestet Sip, not this. (3,3) is Poise Sip, not this.  
DURATION: instant (current-turn leftover only)  
SCALING: amount fixed.  
SYNERGIES: Septet Sting / Septet Mend **after** manufacturing 4/3 or 5/2 or 6/1 or 7/0; Octave Hold so they cannot walk the remaining MP.  
COUNTERPLAY: Sit on (0,8) (no AP to steal); sit off sum 8; sit on 4/4 (Poise Sip); sit on 4/3 (Septet Sip); sit on 4/2 (Sestet Sip); sit on 3/3 (Poise Sip); sit on 3/2 (Stave Sip); sit on 3/1 (Score Sip); Second Wind after.  
POWER_BUDGET: Cheap control, 0 damage, CD 1.  
AI_USAGE: `aiHint: "octave_sip_if_target_sum_eq_8_unequal_and_leftover_ap_ge_1"`. Hex / pawns. Skip if not in the window or leftover AP is 0.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Do not write `debuffStat: "ap"`. Missing keys → no steal. Target leftover 4/4 → fizzle (Poise Sip’s window). Target leftover 4/3 → fizzle (Septet Sip’s window). Target leftover 4/2 → fizzle (Sestet Sip’s window). Target leftover 3/3 → fizzle (Poise Sip’s window). Target leftover 3/2 → fizzle (Stave Sip’s window). Target leftover 3/1 → fizzle (Score Sip’s window). Target leftover 2/1 → fizzle (Tally Sip’s window). Challenge: not a heal, not MP. Septet Sip on (5,2) → (4,2) **Sestet** is the cousin manufacture; Septet Sip on (4,3) → (3,3) **Poise** is the odd-sum exception; do not name-wire either hop.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-octave-post`

NAME: Octave Post  
ROLE: SUMMONS — empty-kit mine; end-turn occupy detonates iff leftover AP + leftover MP === 8 AND leftover AP ≠ leftover MP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "octavepost"`, `summonLifespan: 3`, empty kit. `effectParams: {"octavePostDetonateDamage":10,"octavePostNeedSumEq":true,"octaveSumN":8,"octaveForbidEqual":true}`. Place on a free ground tile. At **end of a combatant’s turn**, if they **occupy** this body and leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**, deal 10 to that occupant through `updateCombatant` and this summon dies. Walk-enter does **not** detonate (Ingress). Relocate landing does **not** detonate (Drift Post). Start-of-turn does **not** detonate (Wake / Gaunt Sill / Poise Sill / Tally Sill / Score Sill / Stave Sill / Sestet Sill / Septet Sill / Octave Sill). Distinct from Septet Post (#1177, leftover sum === 7), Sestet Post (#1132, leftover sum === 6 **and unequal**), Stave Post (#1063, leftover sum === 5), Score Post (#1011, leftover sum === 4 **and unequal**), Tally Post (#953, leftover sum === 3), Poise Post (#890, leftover AP === leftover MP ≥ 1), Gaunt Post (#849, leftover **both 0**), Lean Post (leftover **AP = 0** only), Dummy Post (taunt), Drift Post (**relocate landing**), Dwell Mark (**end-turn occupy, any leftover**), Hollow Mark (#1198, leftover **both 0** paint). The decision: end the turn on (5,3) and eat 10, or spend a pool, or dump to 4/4 and eat Poise Post, or dump to 4/3 and eat Septet Post, or dump to 4/2 and eat Sestet Post, or dump to 3/3 and eat Poise Post, or dump to 3/2 and eat Stave Post, or dump to 3/1 and eat Score Post, or dump to 3/0 and eat Tally Post, or dump to 0/0 and eat Gaunt Post. Dual Keep 2/2 **hurts Poise Post, not this**. Dual Keep **cannot** hurt this. Walk-safe. Relocate-safe. Start-turn-safe.  
DURATION: lifespan 3 or until detonate  
SCALING: 10 follows damage% if any; otherwise fixed.  
SYNERGIES: Octave Hold so they cannot walk off; Kin Turn **keeps** sum 8 through the end-turn check.  
COUNTERPLAY: Spend a pool before turn end; dump to 4/4 or 4/3; walk off (walk-safe); Coup the post; blink.  
POWER_BUDGET: Standard 3 / CD 3 / 0 upfront. Power is **end-turn occupy on a sum of 8 unequal**. Counts as **one** toward the summon cap.  
AI_USAGE: `aiHint: "octave_post_if_foe_will_end_turn_sum_eq_8_unequal_on_tile"`. Masons / pawns. Skip if cap is full.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","rook"]`, `levelZoneMin: 1`  
EDGE_CASES: **Summon is observation.** Later detonate / death is not a second observe. Missing keys → do not spawn a Dummy Post. Occupant leftover 4/4 at turn end → no detonate (Poise Post’s window). Occupant leftover 4/3 at turn end → no detonate (Septet Post’s window). Occupant leftover 4/2 at turn end → no detonate (Sestet Post’s window). Occupant leftover 3/3 at turn end → no detonate (Poise Post’s window). Occupant leftover 3/2 at turn end → no detonate (Stave Post’s window). Occupant leftover 3/1 at turn end → no detonate (Score Post’s window). Occupant leftover 3/0 at turn end → no detonate (Tally Post’s window). Occupant leftover 0/0 at turn end → no detonate (Gaunt Post’s window). Empty tile → no detonate, lifespan ticks. Never parse `"Octave Post"`. Do not mint `spell-octave-burst`. Prefer fizzle-and-detonate if the body is displaced by Swap (body gone → no tile tax).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — empty-kit summon + end-turn leftover-sum-and-unequal gate. Same class as Septet Post / Sestet Post / Stave Post / Score Post / Tally Post / Poise Post / Gaunt Post / Lean Post.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-octave-bounce`

NAME: Octave Bounce  
ROLE: DAMAGE — 12 to primary; bounce 1 to nearest other leftover-AP+MP===8-unequal hostile  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 12 to primary (ungated). `effectParams: {"octaveBounceNeedSumEq":true,"octaveSumN":8,"octaveBounceSearchRadius":4,"octaveBounceCount":1,"octaveForbidEqual":true}` — search Chebyshev ≤ 4 for the nearest **other** living hostile whose leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**; deal 12 to that body too. Primary leftover unconstrained. Distinct from Septet Bounce (#1177, second body leftover sum === 7), Sestet Bounce (#1132, second body leftover sum === 6 **and unequal**), Stave Bounce (#1063, second body leftover sum === 5), Score Bounce (#1011, second body leftover sum === 4 **and unequal**), Tally Bounce (#953, second body leftover sum === 3), Poise Bounce (#890, second body leftover AP === leftover MP ≥ 1), Gaunt Bounce (#849, second body leftover **both 0**), Parched Bounce (leftover **MP = 0**), Heave Bounce (**force-moved**), Chain Lightning (nearest **any**, 2 bounces). The decision: open on whoever, splash the (5,3) bishop — or wait for two 4/3 bodies and Septet Bounce. Dual Keep 2/2 is the **wrong** second body. Dual Keep cannot open this. (4,4) is Poise Bounce, not this. (4,3) is Septet Bounce, not this. (4,2) is Sestet Bounce, not this. (3,3) is Poise Bounce, not this.  
DURATION: instant  
SCALING: 12 follows damage%.  
SYNERGIES: Kin Turn a second body into Octave before the bounce search; Octave Hold to keep them in-window.  
COUNTERPLAY: Isolate (one Octave body); sit the second body on 4/4 or 4/3 or 4/2 or 3/3 or 3/2 or 3/1 or 3/0 or 0/0.  
POWER_BUDGET: Standard. 12 if no second Octave body; 24 if a second sits on sum 8 unequal.  
AI_USAGE: `aiHint: "octave_bounce_if_second_sum_eq_8_unequal_hostile_in_r4"`. Queens / bishops. Skip if no second in-window body **and** a Strike would kill the primary; 12 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing bounce keys → 12 only. Primary leftover 4/4 does **not** block the primary hit. Ties: nearest Chebyshev, then lowest id. Do not hit allies. Second body leftover 4/4 is **not** a bounce target (Poise Bounce). Second body leftover 4/3 is **not** a bounce target (Septet Bounce). Second body leftover 4/2 is **not** a bounce target (Sestet Bounce). Second body leftover 3/3 is **not** a bounce target (Poise Bounce). Second body leftover 3/2 is **not** a bounce target (Stave Bounce). Second body leftover 3/1 is **not** a bounce target (Score Bounce).  
IMPLEMENTATION_COMPLEXITY: LOW — one search + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-must-octave`

NAME: Must Octave  
ROLE: CONTROL — non-Strike illegal unless leftover AP + leftover MP === 8 AND leftover AP ≠ leftover MP **and** the spell spends last AP  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"mustNonStrikeUnlessSumEqAndSpendsLastAp":true,"octaveSumN":8,"octaveHoldDuration":2,"octaveForbidEqual":true}`. For 2 of the **target’s** turns, any non-Strike spell is illegal unless, **before** this (their) spell’s AP is paid, leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP** **and** `apCost === leftover AP` (the spell spends last leftover AP). Strike / `physical_attack` stays legal. Walk stays legal unless an Octave Hold is also up. Distinct from Must Septet (#1177, leftover sum === 7 **and** last AP — **pre-spend odd sum 7**), Must Sestet (#1132, leftover sum === 6 **and unequal** **and** last AP — **pre-spend even unequal sum 6**), Must Stave (#1063, leftover sum === 5 **and** last AP — **pre-spend odd sum 5**), Must Score (#1011, leftover sum === 4 **and unequal** **and** last AP — **pre-spend even unequal sum 4**), Must Tally (#953, leftover sum === 3 **and** last AP — **pre-spend odd sum 3**), Must Poise (#890, leftover AP === leftover MP ≥ 1 **and** last AP — **pre-spend equality**), Must Gaunt / Must Lean / Must Drift / Must Pace / Must Span / Must Step, Rite First (cannot Strike until a spell), Tool Hold (cannot tool until Strike). The decision: they sit on (5,3) with a 5-cost tool as their last packet, or they sit on (3,5) with this 3-cost as their last packet, or they sit on (0,8) with walk MP and **no** leftover AP — Must Octave **blocks** every non-Strike from (0,8) because leftover AP is 0 (cannot spend last AP). (8,0) spending an 8-cost last packet **is** legal and dumps them to (0,0) Gaunt. Dual Keep 2/2 is Must Poise’s window, **not** this. Dual Keep cannot open this. (4,4) is Must Poise, not this. (4,3) is Must Septet, not this. (4,2) is Must Sestet, not this. (3,3) is Must Poise, not this.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Octave Hold on (0,8) so they can neither walk nor non-Strike; Kin Turn (0,8)→(8,0) so an 8-cost last packet becomes legal. Do **not** CORE with a Strike-only octave lock (none shipped).  
COUNTERPLAY: Strike; blink; wait 2 turns; dump to 4/4 or 4/3; Kin Turn / Tempo Invert yourself if you own it.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **last-packet from a sum of 8 unequal**, not a silence.  
AI_USAGE: `aiHint: "must_octave_if_target_leftover_sum_eq_8_unequal_and_has_a_last_packet_spell"`. Knights / pawns ELITE. Skip if leftover sum ≠ 8 or the body is tied. Do not arm if the only remaining legal verb is Strike and a walk would kill.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 2`  
EDGE_CASES: **Pre-spend leftover** (see §3.5). Missing keys → no lock. Leftover (4,4) → non-Strike still illegal under **this** lock (tied, Must Poise’s window). Leftover (4,3) → non-Strike still illegal under **this** lock (sum 7, Must Septet’s window). Leftover (4,2) → non-Strike still illegal under **this** lock (sum 6, Must Sestet’s window). Leftover (3,3) → non-Strike still illegal under **this** lock (tied, Must Poise’s window). Leftover (3,2) → non-Strike still illegal under **this** lock (sum 5, Must Stave’s window). Leftover (3,1) → non-Strike still illegal under **this** lock (sum 4, Must Score’s window). Leftover (3,0) → non-Strike still illegal under **this** lock (sum 3, Must Tally’s window). Leftover (0,0) → non-Strike illegal (Must Gaunt’s window, but this lock does not lift there). 0-AP tools (Timestep) are not “spending last AP”. The shared key `mustNonStrikeUnlessSumEqAndSpendsLastAp` is **not** a name table: `octaveSumN` + `octaveForbidEqual` distinguish this row from Must Septet / Must Sestet / Must Stave / Must Score.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — pre-spend leftover sum + inequality + last-AP compare in the cast gate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-verse-octave`

NAME: Verse Octave  
ROLE: CONTROL — last resolved id illegal until leftover AP + leftover MP === 8 AND leftover AP ≠ leftover MP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"verseOctaveUntilSumEq":true,"octaveSumN":8,"octaveForbidEqual":true}`. The target’s **last resolved spell id** (the id they most recently spent AP on) cannot be recast until leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**. Strike is not a spell id for this key. If they have no last resolved id, fizzle rider (AP spent). Distinct from Verse Septet (#1177, lifts at leftover sum === 7), Verse Sestet (#1132, lifts at leftover sum === 6 **and unequal**), Verse Stave (#1063, lifts at leftover sum === 5), Verse Score (#1011, lifts at leftover sum === 4 **and unequal**), Verse Tally (#953, lifts at leftover sum === 3), Verse Poise (#890, lifts at leftover AP === leftover MP ≥ 1), Verse Gaunt (#849, lifts at leftover **both 0**), Verse Lean / Verse Pace / Verse Tax, Once Verse / Stolen Verse / Summon Verse (#906, pets pay +1 AP to **recast** last id; the id stays legal), Last Mute / Hex of Silence. The decision: lock their Inferno until they sit on (5,3) — sitting on 4/4 **does not** lift (Verse Poise’s window); sitting on 4/3 **does not** lift (Verse Septet’s window); sitting on 4/2 **does not** lift (Verse Sestet’s window); sitting on 3/3 **does not** lift (Verse Poise’s window); sitting on 3/2 **does not** lift (Verse Stave’s window); sitting on 3/1 **does not** lift (Verse Score’s window); sitting on 3/0 **does not** lift (Verse Tally’s window); sitting on 0/0 **does not** lift (Verse Gaunt’s window); sitting on 1/1 **does not** lift (Prime Gift); sitting on 6/0 **does not** lift (Verse Sestet / Gait Gift); sitting on 8/0 **does** lift (Gait Gift **and** an Octave pair — both-body vs one-body is not this lock). Instant lift if they already sit on sum 8 unequal at resolve (fizzle rider — do not arm a lock that is already lifted). Dual Keep 2/2 does **not** lift this. Dual Keep **cannot** lift this.  
DURATION: until leftover sum === 8 unequal, or battle end  
SCALING: none.  
SYNERGIES: Cadence Quinte so the locked id is also remaining 0 (they can recast it **this** turn if they also sit in-window); Octave Hold so they cannot walk into a new leftover split.  
COUNTERPLAY: Sit on (8,0) / (0,8) / (7,1) / (1,7) / (6,2) / (2,6) / (5,3) / (3,5); recast a different id; wait. Dual Keep 2/2 does **not** lift this. Haste into (5,3) **does**. Dumping to 4/4 **does not**. Dumping to 4/3 **does not**.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **which leftover window lifts the last verse**, not a silence.  
AI_USAGE: `aiHint: "verse_octave_if_target_last_id_is_their_win_condition"`. Hex / bishops. Skip if they have no last resolved id, or if they already sit on sum 8 unequal (instant lift — fizzle rider).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing keys → no lock. Verse Octave does **not** lift at leftover 0/0 (Verse Gaunt), leftover 2/2 (Verse Poise), leftover 3/3 (Verse Poise), leftover 4/4 (Verse Poise), leftover 3/0 (Verse Tally), leftover 3/1 (Verse Score), leftover 3/2 (Verse Stave), leftover 4/2 (Verse Sestet), leftover 4/3 (Verse Septet), leftover 6/0 (Verse Sestet / Gait Gift), leftover 7/0 (Verse Septet / Gait Gift), or leftover 1/1 (Prime Gift). Summon Verse (#906) is a recast tax, not a legality lock — do not merge the keys.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — last-id lock + leftover-sum-and-unequal lift.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-quinte`

NAME: Court Quinte  
ROLE: SUPPORT — Cadence Quinte on **every other** body (init order)  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `effectParams: {"quinteRemainingCdsEq5To0":true,"courtQuinteExcludeCaster":true}`. In initiative order, every living combatant **except the caster** has remaining `n===5` rewritten to `0` (zeros stay 0; `n===1`, `n===2`, `n===3`, `n===4`, and `n>5` unchanged), same rewrite as Cadence Quinte. Distinct from Court Quarte (#1177, mass Quarte `n===4` → `0`), Court Tierce (#1132, mass Tierce `n===3` → `0`), Court Dock (#1063, mass Dock `n===2` → `0`), Court Snuff (#1011, mass Snuff `n===1` → `0`), Court Prime (#953, mass Prime `n===0` → `1`), Court Floor (#890, mass Floor `n>1` → `1`, zeros stay 0), Court Lag (#849, mass Lag `n>0` → `n+2`), Court Imprint (mass Imprint), Court Dual / Court Keep / Court Stretch / Court Hinge / Court Shove / Court Fold, Cadence Quinte (one body), Cadence Quint (one body `n>5→5`), Cadence Flush (all → 0, ally), Cadence Swap (two-body map exchange), Cadence Quad (one body `n>4→4`), Cadence Tern (one body `n>3→3`), Cadence Cap (one body `n>2→2`). Player never owns this. Witness without grant.  
DURATION: instant rewrite  
SCALING: none.  
SYNERGIES: Kit with Cadence Quinte on the caster’s own target after, or Quarte a remaining `n===4` after the board’s remaining-5 tools are already sitting at 0. Do **not** CORE with Court Quarte / Court Tierce / Court Dock / Court Snuff / Court Prime / Court Floor / Cadence Quint / Cadence Quad / Cadence Tern / Cadence Cap.  
COUNTERPLAY: Recast before Court Quinte; Cadence Break your own remaining after; Floor your remaining 5 to 1 before the mass quinte; Quint does **not** save you (fives stay 5, then this writes 0); Quad peels 5 to 4 (then this does **not** write 0 — Quarte’s problem); Tern peels 5 to 3 (then this does **not** write 0 — Tierce’s problem); kill the regent.  
POWER_BUDGET: Signature 6 / CD 4 / 0 damage. Power is **board-wide remaining-5 unlock**. Kit-only.  
AI_USAGE: `aiHint: "court_quinte_if_two_plus_foes_have_a_remaining_5_nuke"`. Kit-only regent. Skip if every other remaining is already ≠ 5.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. `NOT_PLAYER_LEARNABLE`. `court_quinte_regent` kit-only. Arm is observation for witness-only kits. Never written to owned ids.  
EDGE_CASES: Missing `courtQuinteExcludeCaster` → do not quinte the caster (fail closed, still observe). Do not write `spellLevelValues`. Do not mint `spell-court-five` / `spell-court-quint`. Preview must list who quinte. Do not reuse `courtQuarteExcludeCaster` / `courtTierceExcludeCaster` / `courtDockExcludeCaster` / `courtSnuffExcludeCaster` / `courtPrimeExcludeCaster` / `courtFloorExcludeCaster`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — init-order walk + Cadence Quinte rewrite. Same class as Court Quarte / Court Tierce / Court Dock / Court Snuff / Court Prime / Court Floor / Court Lag.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-court-quinte
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
effectParams: {"quinteRemainingCdsEq5To0":true,"courtQuinteExcludeCaster":true}
```

---

## 6. Combination matrix (statuses × leftover × terrain)

| Window | Tools |
| :--- | :--- |
| Leftover AP + leftover MP **=== 8 AND unequal** on an **ally** | Octave Mend (both bodies), Octave Step, Octave Lend (**exits** to 10), Kin Turn (**keeps** the sum on the caster when it was already in-window; ally independently inverted) |
| Same window on a **hostile** | Octave Sting, Octave Sill (their turn start), Octave Hold (cannot walk), Octave Sip (**always manufactures Septet** from every successful steal), Octave Post (their turn end), Octave Bounce (second body), Must Octave (self, pre-spend), Verse Octave (lifts here) |
| Same window on **self** | Octave Hood, Must Octave, Kin Turn (caster invert) |
| Leftover AP + leftover MP **=== 7** | **Not this pass.** Septet\*. Octave keys fail `octaveSumN === 8`. Septet Lend **exits** to 9, **not** Octave. |
| Leftover AP + leftover MP **=== 6 AND unequal** | **Not this pass.** Sestet\*. Octave keys fail `octaveSumN === 8`. Sestet Lend **manufactures Octave**. |
| Leftover AP + leftover MP **=== 5** | **Not this pass.** Stave\*. Octave keys fail `octaveSumN === 8`. Stave Lend **manufactures Septet**, not Octave. |
| Leftover AP + leftover MP **=== 4 AND unequal** | **Not this pass.** Score\*. Octave keys fail `octaveSumN === 8`. Score Lend **manufactures Sestet**, not Octave. |
| Leftover AP + leftover MP **=== 3** | **Not this pass.** Tally\*. Octave keys fail `octaveSumN === 8`. |
| Leftover AP === leftover MP **and leftover AP ≥ 1** | **Not this pass.** Poise\* / Equal Gift / Prime Gift (1/1). **(4,4) is Poise**, not Octave (`octaveForbidEqual`). |
| Leftover AP = 0 **and** leftover MP = 0 | **Not this pass.** Gaunt / Hollow Gift / Bare Sip / Verse Gaunt / Hollow Sting / Hollow Mark. Octave keys fail (sum 0). |
| Leftover AP ≥ 2 **and** leftover MP = 0 (one body) | **Not this pass.** Gait Gift (#1082). (8,0) is Gait Gift **and** an Octave pair; Octave Mend still needs **both** bodies. |
| Leftover AP ≥ 2 **and** leftover MP ≥ 1 (one body) | **Not this pass.** Wide Gift (#1143) / Wide Plate (#1198). (7,1) (6,2) (5,3) are Wide Gift **and** Octave pairs; Octave Mend still needs **both** bodies. |
| Leftover AP === 1 **and** leftover MP === 0 (one body) | **Not this pass.** Thin Gift (#1198). No Octave pair. |
| Dual Keep / Purse Keep / Stride Keep surviving **2/2** | **Opens** every Poise gate. **Blocks** every Octave gate (sum 4 ≠ 8) **and** every Septet gate (sum 4 ≠ 7) **and** every Sestet gate (sum 4 ≠ 6) **and** every Stave gate (sum 4 ≠ 5) **and** every Score gate (`scoreForbidEqual`) **and** every Tally gate (sum 4 ≠ 3) **and** every Gaunt gate. Dual Keep **cannot** manufacture Octave. |
| Dual Keep surviving **2/1** or **1/2** | **Opens** Tally. **Blocks** Octave (sum 3). |
| Dual Keep surviving **2/0** or **0/2** | Sum 2. **Blocks** Octave / Septet / Sestet / Stave / Score / Tally / Poise / Gaunt. Spend nothing; Dual Keep cannot reach 8. |
| Haste / Tempo Gift / Timestep into (5,3) after a 3-AP spend from a 8-AP / 3-MP bar | **Opens** Octave. The intended bank. A 6 AP / 3 MP bar that pays 3 AP lands at **(3,3)** and **fails** Octave (Poise). A 7 AP / 3 MP bar that pays 3 AP lands at **(4,3)** and **fails** Octave (Septet). A 7 AP / 2 MP bar that pays 3 AP lands at **(4,2)** and **fails** Octave (Sestet). A 8 AP / 2 MP bar that pays 3 AP lands at **(5,2)** and **fails** Octave (Septet). |
| Sestet Lend on a sum-6 unequal body | **Manufactures Octave** ((4,2)→(5,3)). Intended hop. |
| Remaining CD `n===5` on a hostile | Cadence Quinte / Court Quinte (ready-unlock of fives). Quarte does **not** write 0 on fives. Tierce does **not** write 0 on fives. Dock does **not** write 0 on fives. Snuff does **not** write 0 on fives. Quint does **not** write 0 on fives (leaves 5). Quad peels 5 to **4**, not 0. Tern peels 5 to **3**, not 0. Cap peels 5 to **2**, not 0. Floor peels 5 to **1**, not 0. |
| Stretched plus longArm 4 / shortArm 3 free | Pentadeca Span occupies all fifteen. Tetradeca Span would have painted a 2×7 (14). Trideca Span would have painted plus arm 3 (13). Hendeca Span would have painted longArm 3 / shortArm 2 (11). |
| Caster leftover pair + one ally leftover pair (caster participates) | Kin Turn inverts AP↔MP on **each**. Hymn Turn stays two allies with caster unchanged. Feud Turn stays caster + one hostile. Psalm Turn stays mixed-side with caster unchanged. Tempo Invert stays one-body ally/self. Bar Cross moves leftover **across caster and one target**. Purse Turn stays one hostile, caster unchanged. Duel Turn stays two hostiles. |

Dual Keep leftover that survives turn start **never** opens Octave. Spend Haste / Tempo Gift / a natural 8-AP / 3-MP bar, or Sestet Lend into (5,3), to enter the window.

Octave Sip on (5,3) → (4,3) is the **intended** Septet manufacture. **Every** successful Octave Sip manufactures Septet (no Poise exception; (4,4) is banned). Septet Sip on (5,2) → (4,2) is the **intended** Sestet manufacture. Septet Sip on (4,3) → (3,3) is the **intended** Poise manufacture (the odd-sum exception Sestet Sip did not have). Sestet Sip on (4,2) → (3,2) is the **intended** Stave manufacture. Stave Sip on (3,2) → (2,2) is the **intended** Poise manufacture. Stave Sip on (4,1) → (3,1) is the **intended** Score manufacture. Score Sip on (3,1) → (2,1) is the **intended** Tally manufacture. Tally Sip on (2,1) → (1,1) is the **intended** Poise manufacture. Do not name-wire any hop; they fall out of the leftover writes.

Sestet Lend on (4,2) → (5,3) is the **intended** Octave manufacture. Octave Lend on (5,3) → (6,4) **exits** Octave into sum 10. Septet Lend on (4,3) → (5,4) **exits** Septet into sum 9, **not** Octave. Stave Lend on (3,2) → (4,3) **manufactures Septet**, not Octave. Score Lend on (3,1) → (4,2) **manufactures Sestet**, not Octave.

---

## 7. Implementation order (not this pass)

1. Discovery ownership split (`SDE-2026-08-31-001`) — without it every Wave-20 id forced into `starterSpells` becomes always-owned.
2. Leftover AP / leftover MP writers (HUD pools after each spend). Dual Keep / Purse Keep / Stride Keep must write surviving leftover at turn start **and keep the cap-2 rule** (Octave depends on Dual Keep **not** reaching 8).
3. Cadence remaining-CD maps (already required by Waves 5–19). Cadence Floor (#906) is remaining `n>1` → `1`. Cadence Prime (#953) is remaining `n===0` → `1`. Cadence Rise (#962) is remaining `n===1` → `2`. Cadence Snuff (#1011) is remaining `n===1` → `0`. Cadence Cap (#1017) is remaining `n>2` → `2`. Cadence Dock (#1063) is remaining `n===2` → `0`. Cadence Tern (#1082) is remaining `n>3` → `3`. Cadence Tierce (#1132) is remaining `n===3` → `0`. Cadence Quad (#1143) is remaining `n>4` → `4`. Cadence Quarte (#1177) is remaining `n===4` → `0`. Cadence Quint (#1198) is remaining `n>5` → `5`. Cadence Quinte is remaining `n===5` → `0`.
4. Occupy-weight **before** Pentadeca Span (cap 2 cannot host weight 15). Tetradeca Span (weight 14) / Trideca Span (weight 13) / Dodeca Span (weight 12) / Hendeca Span (weight 11) / Dec Span (weight 10) / Nine Span (weight 9) / Oct Span (weight 8) have the same prerequisite.
5. Confirm gates for Must Octave (pre-spend) / Octave Hold / Verse Octave / Kin Turn (self-target reject).
6. Stretched-plus longArm 4 / shortArm 3 multi-cell occupy (`pentadecaspan`) and empty-kit mine (`octavepost`).
7. Do **not** land `spell-parched-mend`. Do **not** land a second `spell-cadence-floor` / `spell-cadence-prime` / `spell-cadence-rise` / `spell-cadence-snuff` / `spell-cadence-cap` / `spell-cadence-dock` / `spell-cadence-tern` / `spell-cadence-tierce` / `spell-cadence-quad` / `spell-cadence-quarte` / `spell-cadence-quint`. Do **not** reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp` / `invertTwoAlliesLeftoverApMp` / `invertMixedSidesLeftoverApMp` / `invertCasterAndHostileLeftoverApMp` / `floorRemainingCdsTo1` / `primeRemainingCdsFrom0` / `snuffRemainingCdsEq1To0` / `capRemainingCdsAbove2To2` / `dockRemainingCdsEq2To0` / `capRemainingCdsAbove3To3` / `tierceRemainingCdsEq3To0` / `quarteRemainingCdsEq4To0` / `tallySumN` / `scoreSumN` / `staveSumN` / `sestetSumN` / `septetSumN` / `scoreForbidEqual` / `sestetForbidEqual`.

Do not implement production code in this pass.

---

## 8. QA (design-level)

| ID | Check |
| :--- | :--- |
| W20-1 | No Wave-20 id appears in `spellData.ts` / `SPELL_ID_CATALOG` / §1.4 tombstone |
| W20-2 | `spell-parched-mend` is **not** shipped; Dry Gait owns leftover-MP=0 heal |
| W20-3 | `spell-octave-mend` requires leftover AP + leftover MP **=== 8 AND unequal** on **both** bodies. (4,4) fails. (4,3) fails. (4,2) fails. (3,3) fails. Septet Mend owns **sum === 7**. Sestet Mend owns **sum === 6 AND unequal**. Stave Mend owns **sum === 5**. Score Mend owns **sum === 4 AND unequal**. Tally Mend owns **sum === 3**. Poise Mend / Equal Gift own **equality ≥ 1**. Prime Gift owns **exactly 1/1**. Gait Gift owns **one-body AP ≥ 2 AND MP = 0**. Wide Gift owns **one-body AP ≥ 2 AND MP ≥ 1**. Thin Gift owns **one-body 1/0**. Hollow Gift / Gaunt Mend own **0 + 0**. Lean Gift owns AP=0 and MP≥1 |
| W20-4 | Cadence Quinte is remaining `n===5` → `0`; `n===1`, `n===2`, `n===3`, `n===4`, and `n>5` unchanged; zeros stay 0. Does **not** clone Cadence Quint (`n>5→5`) / Quarte (`4→0`) / Tierce (`3→0`) / Dock (`2→0`) / Snuff (`1→0`) / Quad (`n>4→4`) / Tern (`n>3→3`) / Cap (`n>2→2`) / Rise (`1→2`) / Prime (`0→1`) / Floor / Swap / Lag / Halve / Crack / Flush |
| W20-5 | Pentadeca Span is stretched plus longArm 4 / shortArm 3, counts as **fifteen**, every cell occupied, click is **center**. Tetradeca Span stays 2×7 fourteen, click = nearest cell to caster. Trideca Span stays plus arm 3 thirteen, click = center. Dodeca Span stays 3×4 twelve, click = nearest cell to caster. Hendeca Span stays stretched plus eleven, click = center. Dec Span stays 2×5 ten. Nine Span stays solid nine. Oct Span stays hollow eight. Sept Span stays stretched plus seven. Penta Span stays plus arm 1 five |
| W20-6 | Kin Turn is caster + one ally independent leftover AP↔MP (caster participates). Does **not** clone Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, Psalm Turn, or Feud Turn. Does **not** reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp` / `invertTwoAlliesLeftoverApMp` / `invertMixedSidesLeftoverApMp` / `invertCasterAndHostileLeftoverApMp`. Does **not** alias Choir Hymn. Does **not** mint `spell-duet-turn` |
| W20-7 | Octave Hood does **not** retag `even_gallery` / Dual Plate / Prime Plate / Thin Plate / Wide Plate / Spent Plate / Gait Plate / Dry Plate / Poise Hood / Tally Hood / Score Hood / Stave Hood / Sestet Hood / Septet Hood |
| W20-8 | Octave Sting bonus is leftover AP + leftover MP === 8 unequal, not Septet Sting’s sum 7, not Sestet Sting’s sum 6 unequal, not Stave Sting’s sum 5, not Score Sting’s sum 4 unequal, not Tally Sting’s sum 3, not Poise Sting’s equality, not Gaunt Sting’s both-0, not Even Sting’s even AP, not Capped Sting’s leftover MP = max, not Wide Sting, not Hollow Sting, not Lean Gait, not Tied Gait’s (2,2) |
| W20-9 | Octave Sip on (5,3) writes (4,3) **Septet**. Every successful Octave Sip manufactures Septet (no Poise exception). Septet Sip on (5,2) writes (4,2) **Sestet**. Septet Sip on (4,3) writes (3,3) **Poise**. Sestet Sip on (4,2) writes (3,2) **Stave**. Stave Sip on (3,2) writes (2,2) **Poise**. Stave Sip on (4,1) writes (3,1) **Score**. Score Sip on (3,1) writes (2,1) **Tally**. Tally Sip on (2,1) writes (1,1) **Poise**. Bare Sip stays leftover MP = 0. Poise Sip stays equality ≥ 1 |
| W20-10 | Must Octave is **not** in the same CORE as a Strike-only octave lock (none shipped). Reads leftover **before** debit. Dual Keep 2/2 is Must Poise, not Must Octave. Dual Keep cannot open Must Octave. (4,4) is Must Poise. (4,3) is Must Septet. (4,2) is Must Sestet. (3,3) is Must Poise |
| W20-11 | Court Quinte is `NOT_PLAYER_LEARNABLE`; `court_quinte_regent` is kit-only |
| W20-12 | Extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` do not restamp #808 / #836 / #849 / #837 / #890 / #903 / #906 / #951 / #953 / #962 / #1004 / #1011 / #1017 / #1063 / #1080 / #1082 / #1132 / #1139 / #1143 / #1170 / #1177 / #1198 |
| W20-13 | `mpCost` is 0 on every Wave-20 row |
| W20-14 | `summonAI` values are `"pentadecaspan"` / `"octavepost"` enums, never parsed names |
| W20-15 | Pentadeca Span does not ship against `ENEMY_SUMMON_CAP === 2` without occupy-weight |
| W20-16 | Verse Octave does **not** lift at leftover 0/0 (Verse Gaunt), leftover 2/2 (Verse Poise), leftover 3/3 (Verse Poise), leftover 4/4 (Verse Poise), leftover 3/0 (Verse Tally), leftover 3/1 (Verse Score), leftover 3/2 (Verse Stave), leftover 4/2 (Verse Sestet), leftover 4/3 (Verse Septet), leftover 6/0 (Verse Sestet / Gait Gift), leftover 7/0 (Verse Septet / Gait Gift), or leftover 1/1 (Prime Gift) |
| W20-17 | No second `spell-cadence-floor` / `spell-cadence-prime` / `spell-cadence-rise` / `spell-cadence-snuff` / `spell-cadence-cap` / `spell-cadence-dock` / `spell-cadence-tern` / `spell-cadence-tierce` / `spell-cadence-quad` / `spell-cadence-quarte` / `spell-cadence-quint`. SDE #906 owns Floor. #953 owns Prime. #962 owns Rise. #1011 owns Snuff. #1017 owns Cap. #1063 owns Dock. #1082 owns Tern. #1132 owns Tierce. #1143 owns Quad. #1177 owns Quarte. #1198 owns Quint |
| W20-18 | Legal Octave pairs are only (8,0) (0,8) (7,1) (1,7) (6,2) (2,6) (5,3) (3,5). (4,4) is Poise. (4,3) is Septet. (4,2) is Sestet. (3,3) is Poise. (3,2) is Stave. (3,1) is Score. (3,0) is Tally. (2,2) is Poise. (1,1) is Prime Gift. Dual Keep cannot manufacture any Octave pair. A 6 AP / 3 MP bar that pays 3 AP lands at (3,3) and **fails** Octave. A 7 AP / 3 MP bar that pays 3 AP lands at (4,3) and **fails** Octave. A 7 AP / 2 MP bar that pays 3 AP lands at (4,2) and **fails** Octave. A 8 AP / 2 MP bar that pays 3 AP lands at (5,2) and **fails** Octave |
| W20-19 | Sestet Lend (4,2)→(5,3) **manufactures Octave**. Octave Lend (5,3)→(6,4) **exits** Octave. Septet Lend (4,3)→(5,4) **exits** Septet into sum 9, **not** Octave. Stave Lend (3,2)→(4,3) **manufactures Septet**, not Octave. Score Lend (3,1)→(4,2) **manufactures Sestet**, not Octave. Do not name-wire any hop |
| W20-20 | `spell-oct-span` (occupy-weight 8) is **not** aliased to Octave Mend. `spell-octa-oath` (Chebyshev = 8) is **not** aliased to Octave Hood. `spell-penta-span` (occupy-weight 5) is **not** aliased to Pentadeca Span. `spell-duel-turn` is **not** aliased to Kin Turn |

---

## 9. Out of scope

- Production TypeScript / Motoko / bindgen / PocketIC.
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / **#903** / **#951** / **#1004** / **#1080** / **#1139** / **#1170** own extra doors).
- Restamping any door in §3.4.
- A fourth `mpCost > 0` walk snipe; Hex of Silence; About Hinge; mid-RAF splice; sixth echo; leftover-sum **=== 3** (Tally); leftover-sum **=== 4 including 2/2** (that is Poise); leftover-sum **=== 4 AND unequal** (Score); leftover-sum **=== 5** (Stave); leftover-sum **=== 6 AND unequal** (Sestet); leftover-sum **=== 7** (Septet); leftover-sum **=== 8 including 4/4** (that is Poise); remaining `n===0` → `1` (Prime); remaining `n===1` → `2` (Rise); remaining `n===1` → `0` (Snuff); remaining `n===2` → `0` (Dock); remaining `n===3` → `0` (Tierce); remaining `n===4` → `0` (Quarte); remaining `n>1` → `1` (Floor); remaining `n>2` → `2` (Cap); remaining `n>3` → `3` (Tern); remaining `n>4` → `4` (Quad); remaining `n>5` → `5` (Quint); fifteen-cell occupy aliases; target-only sum===3 / sum===4 / sum===5 / sum===6 / sum===7 / sum===8 heal; leftover **diff** window; two-hostile invert (Duel Turn); two-ally invert excluding caster (Hymn Turn); mixed-side invert excluding caster (Psalm Turn); caster+hostile invert (Feud Turn); one-body invert (Tempo Invert / Purse Turn).
- Cloning Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Shadow Veil, Mirror / Reflect, Lens / Overcast, Short Sight / Paper Wind, Tempo Gift / Loan Tempo, Goad / Taunt Oath, Rime Tile / Rime Sheet, File Lance, Blood Tithe, Hex of Silence, Dry Mend, Dry Gait, Parched Mend, Hollow Gift, Cadence Swap, Cadence Floor, Cadence Prime, Cadence Rise, Cadence Snuff, Cadence Cap, Cadence Dock, Cadence Tern, Cadence Tierce, Cadence Quad, Cadence Quarte, Cadence Quint, Gaunt Mend, Poise Mend, Equal Gift, Tally Mend, Score Mend, Stave Mend, Sestet Mend, Septet Mend, Lean Gift, Prime Gift, Gait Gift, Wide Gift, Thin Gift, Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, Psalm Turn, Feud Turn, Choir Hymn, Oct Span, Octa Oath, Penta Span.
- Putting unique #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 / #1177 / #1198 ids in this catalog.

---

## 10. Catalog index

| SPELL_ID | NAME | ROLE | ACQUISITION | AP | CD | Door |
| :--- | :--- | :--- | :--- | ---: | ---: | :--- |
| `spell-octave-mend` | Octave Mend | SUPPORT | MULTI_SOURCE | 3 | 2 | `octave_cantor` |
| `spell-cadence-quinte` | Cadence Quinte | CONTROL | MULTI_SOURCE | 3 | 2 | `quinte_precentor` |
| `spell-pentadeca-span` | Pentadeca Span | SUMMONS | MULTI_SOURCE | 4 | 3 | `span_pentadeca` |
| `spell-kin-turn` | Kin Turn | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-octave-hood` | Octave Hood | DEFENSE | ELITE | 2 | 2 | (piece observe) |
| `spell-octave-sting` | Octave Sting | DAMAGE | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-octave-step` | Octave Step | POSITION | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-octave-sill` | Octave Sill | TERRAIN | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-octave-hold` | Octave Hold | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-octave-lend` | Octave Lend | SUPPORT | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-octave-sip` | Octave Sip | CONTROL | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-octave-post` | Octave Post | SUMMONS | ENEMY_DISCOVERY | 3 | 3 | (piece observe) |
| `spell-octave-bounce` | Octave Bounce | DAMAGE | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-must-octave` | Must Octave | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-verse-octave` | Verse Octave | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-court-quinte` | Court Quinte | SUPPORT | NOT_PLAYER_LEARNABLE | 6 | 4 | `court_quinte_regent` (kit) |

STATUS: PROPOSED — no production code.

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

**Document status:** PROPOSED. Safe to review and implement in a later, explicit data PR. Not a license to land combat code in the same change as this spec. Coordinate with **#1198** so Thin Gift / Cadence Quint / Wide Plate / Camel Stride land once. Coordinate with **#1177** so Septet Mend / Cadence Quarte / Tetradeca Span / Feud Turn land once as Wave-20 family CORE. This catalog stamps as Wave **21** family CORE.

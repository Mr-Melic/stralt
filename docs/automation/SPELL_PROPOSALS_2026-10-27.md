# Spell and Tactical Mechanics — Design Pass 2026-10-27

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1 law [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) through still-open Wave 18 [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-26.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-4a9e/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-26.md) (**#1143**). Same-day Wave 19 SDE is **running** (`cursor/spell-discovery-and-evolution-5d97`) and **has not opened a PR at authoring**. Same-day unique-file PRs **#1163–#1169** do not touch this path.
- Spell, Discovery & Achievement Admin — still-open ACTION_ID-only PRs (no unique spell ids). **#1140** owns SDA-2026-10-26-190…204.
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) … still-open Wave 18 [`SPELL_PROPOSALS_2026-10-26.md`](https://github.com/Mr-Melic/stralt/blob/cursor/bc-4f4de998-b23e-4e2b-b6eb-13d47b36a7d4-9e2f/docs/automation/SPELL_PROPOSALS_2026-10-26.md) (**#1132**)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); extra doors through #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / **#951** (Wave 16 bosses) / **#1004** (Wave 17 bosses) / **#1080** (Wave 18 bosses: `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`) / **#1139** (Wave 19 bosses: `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`); tactical extras #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / #1011 / **#1063** / **#1132**

This is **Wave 19** of the tactical catalog. Live HEAD is unchanged since Waves 4–18. Wave 18 (#1132) filled both-body leftover AP + leftover MP **=== 6 AND unequal** heal (Sestet Mend), remaining `n===3` → `0` (Cadence Tierce), orthogonal plus arm-3 occupy (Trideca Span, counts as thirteen), mixed-side leftover invert (Psalm Turn), and a Sestet family plus Court Tierce.

**Wave 18 explicitly deferred twelve holes.** Discovery Wave 18 (#1143) already claimed leftover AP **≥ 2 AND** leftover MP **≥ 1** heal (Wide Gift), remaining `n>4` → `4` (Cadence Quad), leftover **1/0** negate (Thin Plate), Hook Stride / Nona Oath / Slide Reel / Hook Bite / Idle Mark / Brier Skip / Wide Sting / Summon Hook / Even Toll / Brick Fee / Watch Bind / Prime Gait / Slide Cut / Idle Plate / Pack Hook / Hook Fold. **SDE keeps those.** This pass fills the remaining leftovers Wave 18 left for Wave 19, plus a caster-participating invert that does **not** clone Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, or Psalm Turn:

| Wave-18 leftover | Owner after #1143 / #1132 | This pass |
| :--- | :--- | :--- |
| Leftover AP + leftover MP === **7** | Still open. Tally owns **sum === 3**. Score owns **sum === 4 AND unequal**. Stave owns **sum === 5**. Sestet owns **sum === 6 AND unequal**. Poise / Equal Gift own **equality ≥ 1**. Gaunt / Hollow Gift own **0+0**. Prime Gift (#1017) owns **exactly 1/1**. Gait Gift (#1082) owns **one-body AP ≥ 2 AND MP = 0** (overlaps (7,0) the way it already overlaps Sestet (6,0)). Wide Gift (#1143) owns **one-body AP ≥ 2 AND MP ≥ 1** (overlaps (6,1) (5,2) (4,3) — one-body vs both-body). Dual Keep max surviving leftover is **2/2** (sum 4) — it **cannot** manufacture sum 7. Wave 16’s directed-diff `AP − MP === 2` **collides with Score at (3,1) and Sestet at (4,2)**; no Septet pair has that diff ((4,3) is 1, (5,2) is 3). The discrete next leftover-sum is **7** (odd, **never a tie**). | **This pass:** Septet Mend — **caster and target** leftover AP + leftover MP **=== 7**. Legal pairs **(7,0) (0,7) (6,1) (1,6) (5,2) (2,5) (4,3) (3,4)**. |
| Remaining `4` → `0` | Still open. Tierce (#1132) writes `n===3` → `0`. Dock (#1063) writes `n===2` → `0`. Snuff (#1011) writes `n===1` → `0`. Quad (#1143) caps `n>4` → `4` (**fours stay 4**). Tern (#1082) caps `n>3` → `3` (**fours become 3**). Cap (#1017) compresses `n>2` → `2` (**fours become 2**). Floor (#906) compresses `n>1` → `1`. Rise (#962) pads `n===1` → `2`. Prime (#953) locks `n===0` → `1`. | **This pass:** Cadence Quarte (remaining `n===4` → `0`; zeros stay 0; `n===1`, `n===2`, `n===3`, and `n>4` unchanged) |
| Fourteen-cell occupy | Still open. Trideca Span is thirteen (plus arm 3). Dodeca Span is twelve (3×4). Hendeca Span is eleven (stretched plus). Dec Span is ten (2×5). | **This pass:** Tetradeca Span (axis-aligned **2×7**, counts as **fourteen**; click = **nearest cell to caster**, Dec / Dodeca rule) |
| Invert leftover on **caster and one hostile** (caster participates) | Still open. Psalm Turn is **one same-side non-caster + one opposite-side**; caster stays. Hymn Turn is **two allies**. Duel Turn is **two hostiles**. Purse Turn is **one** hostile. Tempo Invert is **one-body ally/self**. Bar Cross is two-body **cross** (caster AP ↔ target MP **and** caster MP ↔ target AP). | **This pass:** Feud Turn — invert leftover AP↔MP independently on **the caster and one opposite-side body**; caster **participates** |
| Target-only sum===7 heal | **Held for SDE.** Wide Gift is **AP≥2/MP≥1**, **not** this hole. | **Not this pass.** Do not mint `spell-septet-gift` / `spell-seven-gift` |
| Target-only sum===6 heal | **Still SDE leftover.** Sestet Mend is both-body. Wide Gift is AP≥2/MP≥1. | **Not this pass.** Do not mint `spell-sestet-gift` |
| Target-only sum===5 / sum===4 / sum===3 heal | **Still SDE leftover.** Stave / Score / Tally Mend are both-body. Lean Gift is AP=0 and MP≥1. | **Not this pass.** Do not mint `spell-stave-gift` / `spell-score-gift` / `spell-tally-gift` |
| Leftover AP − leftover MP === 2 (diff window) | Still open **and more colliding**. (3,1) is Score. (4,2) is Sestet. (5,3) would be a later sum-8 family. No Septet pair has this diff. | **Not this pass** (Wave 20). Do not mint a `spell-skew-*` family |
| Mid-RAF splice | Held (AGENTS.md) | Still held |
| Fourth `mpCost > 0` walk snipe | Held (Ley Toll / Undertow / Sanguine Toll) | Still held |
| Sixth echo id | Held | Still held |
| Player-owned Hex of Silence | Held (`BOSS_ONLY`) | Still held |
| Player-owned About Hinge | Held (`BOSS_ONLY` on #590) | Still held. Hostile 180° around a pair midpoint is still Pawn Trade. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after the reserved set **and** after #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

Same-day Discovery Wave 19 **has not opened a PR at authoring**. **If that catalog later claims a unique leftover below, SDE wins** the unique §11 id; this catalog must not clone it. Do **not** clone #747 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 unique ids. Do **not** ship `spell-parched-mend` / `spell-cadence-floor` (second copy) / `spell-cadence-rise` / `spell-cadence-prime` / `spell-cadence-snuff` (second copy) / `spell-cadence-cap` (second copy) / `spell-cadence-dock` (second copy) / `spell-cadence-tern` (second copy) / `spell-cadence-tierce` (second copy) / `spell-cadence-quad` (second copy) / `spell-tally-gift` / `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-septet-gift` / `spell-prime-gift` (second copy) / `spell-gait-gift` (second copy) / `spell-wide-gift` (second copy). Stamp family / observe metadata onto Wave-19 **tactical** ids only. #1143 §0.2 already stamps #1132 as Wave **19** family CORE. **This catalog stamps as Wave 20 family CORE.**

Do **not** mint `spell-seven-mend` / `spell-hepta-mend` / `spell-heptad-mend` / `spell-sept-mend` / `spell-septenary-mend` / `spell-sice-mend` / `spell-septet-gift` / `spell-both-septet` (Septet Mend owns both-body sum===7 heal; (3,3) stays Poise; (4,2) stays Sestet), `spell-cadence-quad` / `spell-cadence-four` / `spell-cadence-tetrad` / `spell-cadence-cater` / `spell-cadence-fourth` / `spell-cadence-nix` / `spell-cd-quarte` (Cadence Quarte owns remaining `4` → `0`; Tierce owns `3` → `0`; Dock owns `2` → `0`; Snuff owns `1` → `0`; Quad owns `n>4` → `4`; Tern owns `n>3` → `3`; Cap owns `n>2` → `2`; Floor owns `n>1` → `1`), `spell-fourteen-span` / `spell-tetrakaideca-span` / `spell-2x7-span` / `spell-plus-span` (Tetradeca Span owns fourteen; Trideca Span owns thirteen), `spell-choir-turn` / `spell-war-turn` / `spell-foe-turn` / `spell-self-foe-turn` / `spell-caster-hostile-turn` / `spell-pew-turn` / `spell-mixed-turn` / `spell-aisle-turn` (Feud Turn owns caster + one hostile independent invert; Choir Hymn is a Wave-1 Discovery heal, **not** this invert), `spell-court-four` / `spell-court-quad` / `spell-court-tetrad` / `spell-court-cater` (Court Quarte is the mass signature), or `spell-septet-plate` / `spell-sum-seven-hood` (Septet Hood owns sum===7 any-range miss; do **not** retag `even_gallery` / Dual Plate / Spent Plate / Gait Plate / Prime Plate / Thin Plate / Sestet Hood / Stave Hood / Score Hood / Tally Hood / Poise Hood). Sept Span (`spell-sept-span`, occupy-weight 7) is **not** this leftover-sum family.

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is unchanged since 2026-08-31. Discovery is still inert. WX is **19,213** lines (`wc -l`). Same HEAD as Waves 4–18. `WorldExploration.tsx` lives at `src/frontend/src/components/WorldExploration.tsx` (not `engine/`).

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

Live `ENEMY_SUMMON_CAP` is still **2** (`gameConstants.ts` 300). Quad Span (#636) counts as four, Penta Span (#695) as five, Six Span (#787) as six, Sept Span (#726) as seven, Oct Span (#849) as eight, Nine Span (#890) as nine, Dec Span (#953) as ten, Hendeca Span (#1011) as eleven, Dodeca Span (#1063) as twelve, Trideca Span (#1132) as thirteen on paper; all ten are implementation-blocked until that cap (or a dedicated occupy-weight) exists. Tetradeca Span is the same class: **propose the hole, do not pretend it can ship against cap 2**.

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
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** (tests only; `rg` empty in WX) | Unused | Shoulder Bash, Hook Line. Septet Step / Feud Turn relocate leftover **pools**, not tiles. Feud Turn is **not** `isSwap`. |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768 → WX `swapPositions` 9389) | Swap | Pawn Trade / Ward Interpose / Cadence Quarte is **not** `isSwap` (cooldown remaining, not tiles) |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, never this set |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire |
| Walk / leftover / force flags | Paper `walkMpSpentThisTurn` (Waves 6–10). Paper `forcedMovedThisTurn` (Wave 9). Leftover AP/MP die at turn end unless Dual Keep / Purse Keep / Stride Keep | Haste grants **now**; Timestep is full **now** | **This pass: Septet Mend / Septet Hold / Septet\* / Must Septet / Verse Septet / Feud Turn / Court Quarte** |
| Fourteen-cell occupy | Twin=2 … Trideca=13 (plus arm 3) | Absent | **This pass: Tetradeca Span** (2×7 = 14) |
| Remaining CD rewrite | Theft **steals**; Imprint **copies**; Swap (#837) **exchanges full maps**; Rest skips **own** tick; Halve **÷2**; Grace skips **starting** the next own CD; Stall **+1**; Lag **+2**; Floor (#906) `n>1` → `1`; Prime (#953) `n===0` → `1`; Rise (#962) `n===1` → `2`; Snuff (#1011) `n===1` → `0`; Cap (#1017) `n>2` → `2`; Dock (#1063) `n===2` → `0`; Tern (#1082) `n>3` → `3`; Tierce (#1132) `n===3` → `0`; Quad (#1143) `n>4` → `4` | Inferno CD 3 is the only live lock | **This pass: Cadence Quarte (remaining n===4 → 0; n===1, n===2, n===3, and n>4 unchanged)** |
| Leftover sum (AP + MP === N) | Tally family is **sum === 3**. Score family is **sum === 4 AND unequal**. Stave family is **sum === 5**. Sestet family is **sum === 6 AND unequal**. Poise family is **equality ≥ 1**. Gaunt family is **both leftover 0**. Equal Gift is **target equality ≥ 1**. Prime Gift is **exactly 1/1**. Gait Gift is **one-body AP ≥ 2 AND MP = 0**. Wide Gift is **one-body AP ≥ 2 AND MP ≥ 1**. Tied Gait is both leftover **exactly 2**. Dual Plate is leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**. | Unused live | **This pass: Septet\* (sum === 7; odd, never a tie)** |
| One-body leftover AP↔MP | Tempo Invert (`invertApMp`, ally/self). Purse Turn (hostile one-body). Bar Cross (two-body **cross**). Duel Turn (two hostiles, independent invert, caster stays). Hymn Turn (two allies, independent invert, caster stays). Psalm Turn (one same-side non-caster + one opposite-side, independent invert, caster stays). | Absent live | **This pass: Feud Turn (caster + one hostile, independent invert, caster participates).** Do not reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp` / `invertTwoAlliesLeftoverApMp` / `invertMixedSidesLeftoverApMp`. |

### 1.4 Reserved id tombstone (do not collide)

**Wave 1 tactical:**  
`spell-shoulder-bash`, `spell-hook-line`, `spell-mist-step`, `spell-grave-bell`, `spell-root-snare`, `spell-lens-shift`, `spell-ward-plate`, `spell-pain-link`, `spell-cleanse-rite`, `spell-cinder-tile`, `spell-tripwire`, `spell-glyph-tax`, `spell-stone-turret`, `spell-turret-shard`, `spell-blood-familiar`, `spell-ricochet-mark`, `spell-void-anchor`.

**Discovery Wave 1:**  
`spell-quiet-hex`, `spell-chain-ward`, `spell-crosswind`, `spell-glass-shot`, `spell-ember-wake`, `spell-split-mark`, `spell-phase-slip`, `spell-sever-tether`, `spell-overcast`, `spell-second-wind`, `spell-choir-hymn`, `spell-oath-bind`, `spell-leech-tempo`, `spell-null-brand`, `spell-false-retreat`, `spell-blood-benediction`, `spell-ward-interpose`, `spell-martyr-fuse`, `spell-hex-of-silence`. Formal blink id remains `spell-phase-slip` (never add `spell-phase-step`).

**Boss adaptations (`BOSS_AND_SPELL_DISCOVERY.md` §5.2):**  
`spell-ember-step`, `spell-caltrop`, `spell-shock-glyph`, `spell-exsanguinate`, `spell-glyph-snare`, `spell-vault`, `spell-brood-ward`, `spell-aftershock`, `spell-rot-brand`, `spell-echo-cast`.

**Wave 2 tactical / Discovery Wave 2 / Wave 3 tactical / Discovery Wave 3 / Wave 4 tactical / Discovery Wave 4 / Memory Wave 5 SDE / Wave 5–17 tactical / Discovery Waves 6–17:** reserved in Waves 2–18 documents and in #1143 §0.1. Do not collide. Memory Wave-5 SDE ids stay tombstoned (`spell-gaze-sill` … `spell-void-span`).

**Wave 18 tactical (#1132 — still open; never re-propose / never clone).** Unique remaining ids stamp as Wave-19 family CORE:  
`spell-sestet-mend`, `spell-cadence-tierce`, `spell-trideca-span`, `spell-psalm-turn`, `spell-sestet-hood`, `spell-sestet-sting`, `spell-sestet-step`, `spell-sestet-sill`, `spell-sestet-hold`, `spell-sestet-lend`, `spell-sestet-sip`, `spell-sestet-post`, `spell-sestet-bounce`, `spell-must-sestet`, `spell-verse-sestet`, `spell-court-tierce`.

**Discovery Wave 18 (#1143 — still open; never re-propose / never clone; SDE wins Wide Gift / Cadence Quad / Thin Plate):**  
`spell-hook-stride`, `spell-nona-oath`, `spell-slide-reel`, `spell-hook-bite`, `spell-idle-mark`, `spell-thin-plate`, `spell-brier-skip`, `spell-wide-sting`, `spell-summon-hook`, `spell-wide-gift`, `spell-cadence-quad`, `spell-even-toll`, `spell-brick-fee`, `spell-watch-bind`, `spell-prime-gait`, `spell-slide-cut`, `spell-idle-plate`, `spell-pack-hook`, `spell-hook-fold`.

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` and `spell-blood-tithe` (tactical W2 vs Discovery W2). `spell-cadence-floor` (tactical #890 vs Discovery #906 — **SDE wins**; this pass does not add a third).

**Fantasy overlaps to not clone:** Short Sight ≈ Paper Wind; Tempo Gift ≈ Loan Tempo; Goad ≈ Taunt Oath; Rime Tile ≈ Rime Sheet; Lens Shift / Overcast; Poise Mend ≈ Equal Gift (both-body vs target equality); Tally Mend ≈ Lean Gift (sum===3 vs AP=0-and-MP≥1); Score Mend ≈ Prime Gift (both-body sum 4 unequal vs exactly 1/1); Stave Mend ≈ Gait Gift (both-body sum 5 vs one-body AP≥2/MP=0); Sestet Mend ≈ Wide Gift (both-body sum 6 unequal vs one-body AP≥2/MP≥1); Cadence Floor / Prime / Rise / Snuff / Cap / Dock / Tern / Tierce / Quad are **filled**; Tempo Invert ≈ Purse Turn (ally vs hostile invert — **filled**); Purse Turn ≈ Duel Turn (one hostile vs two hostiles — **filled**); Duel Turn ≈ Hymn Turn (two hostiles vs two allies — **filled**); Hymn Turn ≈ Psalm Turn (two allies vs mixed sides, caster stays — **filled**); Psalm Turn ≈ Feud Turn (mixed sides excluding caster vs caster + one hostile — **this pass fills the caster-participating card, does not clone the mixed-side card**). Feud Turn is **not** Choir Hymn. Septet Mend is **not** Sept Span.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier; Dry Mend / Dry Gait / Parched Mend; Hollow Gift / Gaunt Mend; Cadence Swap / Cadence Floor / Cadence Prime / Cadence Rise / Cadence Snuff / Cadence Cap / Cadence Dock / Cadence Tern / Cadence Tierce / Cadence Quad.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved or live) |
| :--- | :--- | :--- |
| SUPPORT leftover-sum heal | Both-body leftover AP + leftover MP **=== 7** | Tally Mend (sum 3); Score Mend (sum 4 unequal); Stave Mend (sum 5); Sestet Mend (sum 6 unequal); Poise Mend / Equal Gift (equality); Gaunt / Hollow Gift (0+0); Dry Mend / Dry Gait; Lean Gift; Prime Gift (exactly 1/1); Gait Gift (AP≥2/MP=0); Wide Gift (AP≥2/MP≥1) |
| CONTROL remaining 4→0 | Ready-quad ids (`n===4`) write `0` | Snuff `1→0`; Dock `2→0`; Tierce `3→0`; Rise `1→2`; Prime `0→1`; Floor `n>1→1`; Cap `n>2→2`; Tern `n>3→3`; Quad `n>4→4`; Stall/Lag pad; Flush/Crack →0 |
| SUMMONS fourteen-cell occupy | Axis-aligned 2×7, counts as fourteen | Twin…Trideca Span |
| CONTROL caster+hostile invert | Leftover AP↔MP on **caster and one hostile**; caster participates | Tempo Invert (ally/self); Purse Turn (one hostile); Bar Cross (two-body cross); Duel Turn (two hostiles); Hymn Turn (two allies); Psalm Turn (mixed, caster stays) |
| DEFENSE / DAMAGE / TERRAIN septet family | Hood / Sting / Step / Sill / Hold / Lend / Sip / Post / Bounce / Must / Verse | Sestet\* / Stave\* / Score\* / Tally\* / Poise\* / Gaunt\* / Lean\* / Dry\* |
| SIGNATURE mass Quarte | Court Quarte | Court Tierce / Court Dock / Court Snuff / Court Prime / Court Floor / Court Lag / Court Imprint |

**Still open after this wave (do not fill today):** mid-RAF splice; fourth walk-MP snipe; sixth echo id; player-owned Hex of Silence; player-owned About Hinge; leftover AP − leftover MP === **2** (diff window; (3,1) is Score; (4,2) is Sestet; (5,3) is a later sum-8 family); remaining `n===5` → `0`; fifteen-cell occupy; **target-only** sum===7 heal (leave for SDE); **target-only** sum===6 / sum===5 / sum===4 / sum===3 heal (still SDE leftovers); leftover AP + leftover MP === **8**; invert leftover on **caster and one ally** (caster participates). Those stay Wave 20 so this pass stays discrete.

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
9. `inferArchetype` still treats any `healAmount > 0` as healer (`enemyAI.ts` 447–452). Septet Mend **must not** land in non-healer CORE; keep `healAmount: 0` on the row.

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 19 ids to `starterSpells` as base. Do **not** land Wave-19 data before Wave-1 ownership split (`SDE-2026-08-31-001`). CDA-030 (#982) still freezes **shipping** Wave-15/16 live rows until those gates exist; this document is sequential Wave 19 **design only**.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "tetradecaspan"` / `"septetpost"` are **string enums on the config**, not a parse of `"Tetradeca Span"` / `"Septet Post"`.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Tetradeca Span / Septet Post **arming** (body placed, AP spent) **is** observation. A later occupy / detonate is **not** a second observe.
- Cadence Quarte **resolve** (even if every remaining was already ≠ 4) **is** observation if AP was spent.
- Do not require “see it N times”. Wave 19 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.
- Do not stamp `survivor` (Last Ember / Last Ward). #646 / #679 / #747 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 left that feat leftover on purpose.

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

**Every live feat and every live challenge id is already a sole spell door or a MULTI child.** Wave 19 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 19 does **not** invent a 16th feat.

**Live 19 first-wins are all taken (do not restamp as the only door):**  
`starborn_queen` (Cut In), `pale_archivist` (After Verse), `starved_vampire_pawn` (Sanguine Toll), `lord_of_static` (Draw Together), `final_pawn` (Eclipse Fold), `mirror_sovereign` (Echo Cast), `crimson_countess` (Crimson Pact), `void_grandmaster` (Twin Gate), `midnight_bishop` (Life Tether), `chessboard_lich` (Claim Ward), `twin_monarchs` (Choir Hymn), `alabaster_fortress` (Pain Link / Aftershock), `bone_cavalier` (Vault / Caltrop), `pale_archbishop` (Reliquary / Glyph Snare extras), `fetid_rook` (Rot Brand), `broodmother_rook` (Brood Ward), `weeping_pawn` (Mute Thread, #411), `eternal_pawn_king` (Queue Cut, #411), `enthroned_void` (File Vault MULTI child, #411). `second_lament` remains kit-only False Cut.

**Wave-5…19 boss extra doors — do not restamp:** `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`, `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`, `mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`, `gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`, `toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`, `crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`, `sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`, `infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`, `flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`, `effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`, `jostle_subdeacon`, `peel_friar`, `dilate_organist`, `hood_recluse`, `wick_exorcist`, `dry_nuncio`, `hearth_legate`, `must_preceptor`, `boot_subprior`, `purse_steward`, `tick_infirmarer`, `mute_notary`, `slide_porter`, `both_capitular`, `heave_kitchener`, `parched_preacher`, `stride_chancellor`, `dual_treasurer`, `imprint_archdeacon`, `damp_provost`.

**Wave-6…18 tactical extra doors — do not restamp:** `oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`, `pace_prelate`, `span_triune`, `wick_mason`, `slip_castellan`, `court_usher`, `gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `gaunt_cantor`, `lag_precentor`, `span_oct`, `court_lag_regent`, `poise_cantor`, `floor_precentor`, `span_nine`, `court_floor_regent`, `tally_cantor`, `prime_precentor`, `span_dec`, `court_prime_regent`, `score_cantor`, `snuff_precentor`, `span_hendeca`, `court_snuff_regent`, `stave_cantor`, `dock_precentor`, `span_dodeca`, `court_dock_regent`, `sestet_cantor`, `tierce_precentor`, `span_trideca`, `court_tierce_regent`. `parched_cantor` is **not** Dry Gait’s door and **not** Septet Mend’s door. `sestet_cantor` stays Sestet Mend. `stave_cantor` stays Stave Mend. `score_cantor` stays Score Mend. `tally_cantor` stays Tally Mend. `poise_cantor` stays Poise Mend. `gaunt_cantor` stays Gaunt Mend. `tierce_precentor` stays Tierce. `dock_precentor` stays Dock. `snuff_precentor` stays Snuff. `prime_precentor` stays Prime. `floor_precentor` stays Floor (#890 door). SDE teaches Quad via Wave-18 unique pools (`cadence_thief` / `hex_chorister`) — do not restamp `quad_precentor` if #1143 later mints one as a tactical door.

**Wave-8…18 SDE extras — do not restamp:** `about_hinge_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `pair_gallery`, `knight_fold_regent`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `cap_precentor`, `reach_fold_regent`, `knight_gallery`, `quad_nave`, `pit_aisle`, `shunt_pulpit`, `nudge_nave`, `file_precentor`, `diag_fold_regent`, `rank_fold_regent`, `file_gallery`, `hexa_nave`, `lava_aisle`, `strike_pulpit`, `shock_nave`, `ring_gallery`, `hepta_nave`, `frost_aisle`, `last_pulpit`, `rift_court`, `leap_fold_regent`, `tern_gallery`, `octa_nave`, `bog_aisle`, `spawn_pulpit`, `belt_nave`, `hoop_precentor`, `lane_fold_regent`, `hook_gallery`, `nona_nave`, `mill_aisle`, `idle_pulpit`, `brier_nave`, `hook_precentor`, `hook_fold_regent`. Do **not** retag `even_gallery` as Septet Hood. Do **not** consume encounter-catalog `ENC-*` rooms. Do not name unique families `septet_mender` / `cadence_quarter` / `tetradeca_prelate` / `sestet_mender` / `cadence_tiercer` / `trideca_prelate` / `stave_mender` / `cadence_docker` / `dodeca_prelate` / `score_mender` / `file_warder`.

**New proposed extra doors for the boss designer (Wave 20 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `septet_cantor` first-win | Septet Mend MULTI child (observe+win still grants). `sestet_cantor` stays Sestet Mend. `stave_cantor` stays Stave Mend. `score_cantor` stays Score Mend. `tally_cantor` stays Tally Mend. `poise_cantor` stays Poise Mend. `gaunt_cantor` stays Gaunt Mend. `parched_cantor` stays the dropped Parched Mend slot — **do not reuse**. Equal Gift / Lean Gift / Prime Gift / Gait Gift / Wide Gift have **no** extra door — do not invent `equal_cantor` / `lean_cantor` / `prime_cantor` / `gait_cantor_gift` / `wide_cantor` / `sum_cantor` / `seven_cantor` / `hepta_cantor`. |
| `quarte_precentor` first-win | Cadence Quarte MULTI child. `tierce_precentor` stays Tierce. `dock_precentor` stays Dock. `snuff_precentor` stays Snuff. `prime_precentor` stays Prime. `floor_precentor` stays Floor. `lag_precentor` stays Lag. `imprint_precentor` stays Imprint. `halve_precentor` stays Halve. `cap_precentor` stays Pack Cap. `file_precentor` stays Pack File (`ENEMY_ONLY`). Do **not** mint `rise_precentor` / `tern_precentor` / `quad_precentor` / `four_precentor` / `tetrad_precentor` / `cater_precentor`. |
| `span_tetradeca` first-win | Tetradeca Span MULTI child. `span_trideca` stays Trideca Span. `span_dodeca` stays Dodeca Span. `span_hendeca` stays Hendeca Span. `span_dec` stays Dec Span. `span_nine` stays Nine Span. `span_oct` stays Oct Span. `span_six` stays Six Span. `span_sept` stays Sept Span. `span_penta` stays Penta Span. `span_quad` stays Quad Span. `span_triune` stays Triple Span. Do **not** mint `span_fourteen` / `span_2x7` / `span_plus`. |
| `court_quarte_regent` kit only | Court Quarte (`NOT_PLAYER_LEARNABLE`). `court_tierce_regent` stays Court Tierce. `court_dock_regent` stays Court Dock. `court_snuff_regent` stays Court Snuff. `court_prime_regent` stays Court Prime. `court_floor_regent` stays Court Floor. `court_lag_regent` stays Court Lag. `court_imprint_regent` stays Court Imprint. `reach_fold_regent` stays Reach Fold. `diag_fold_regent` stays Diag Fold. `rank_fold_regent` stays Rank Fold. `leap_fold_regent` stays Leap Fold. `lane_fold_regent` stays Lane Fold. `hook_fold_regent` stays Hook Fold. Do **not** mint `court_four_regent` / `court_quad_regent`. |

Piece-type observe paths (not feat doors): cantors / bishops for Septet Mend; scribes / tempo for Cadence Quarte; masons / rooks ELITE for Tetradeca Span; hex / queens for Feud Turn; lurkers / knights for Septet Hood; lurkers / pawns for Septet Sting; porters / queens for Septet Step; masons / rooks for Septet Sill; hex / knights for Septet Hold; buffers / bishops for Septet Lend; hex / pawns for Septet Sip; masons / pawns for Septet Post; queens / bishops for Septet Bounce; knights / pawns for Must Septet; hex / bishops for Verse Septet.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 key names for a different meaning. Do **not** reuse `invertApMp` (Tempo Invert). Do **not** reuse `invertHostileLeftoverApMp` (Purse Turn). Do **not** reuse `crossLeftoverApMpTwoBody` (Bar Cross). Do **not** reuse `invertTwoHostilesLeftoverApMp` (Duel Turn). Do **not** reuse `invertTwoAlliesLeftoverApMp` (Hymn Turn). Do **not** reuse `invertMixedSidesLeftoverApMp` (Psalm Turn). Do **not** reuse `floorRemainingCdsTo1` (Cadence Floor). Do **not** reuse `primeRemainingCdsFrom0` (Cadence Prime). Do **not** reuse `snuffRemainingCdsEq1To0` (Cadence Snuff). Do **not** reuse `capRemainingCdsAbove2To2` (Cadence Cap). Do **not** reuse `dockRemainingCdsEq2To0` (Cadence Dock). Do **not** reuse `capRemainingCdsAbove3To3` (Cadence Tern). Do **not** reuse `tierceRemainingCdsEq3To0` (Cadence Tierce). Do **not** reuse `capRemainingCdsAbove4To4` if #1143 named Quad that way — Quad’s key stays #1143’s. Do **not** reuse `tallySumN` / `scoreSumN` / `staveSumN` / `sestetSumN` / `scoreForbidEqual` / `sestetForbidEqual`. Do **not** reuse `hendecaSpanCells` / `decSpanCells` / `nineSpanCells` / `nineSpanSolid` / `dodecaSpanCells` / `dodecaLong` / `dodecaShort` / `tridecaSpanCells` / `tridecaArm`. Do **not** reuse `requireLeftoverApEq1AndMpEq1` (Prime Gift). Do **not** reuse `requireLeftoverApGe2AndMpEq0` (Gait Gift). Do **not** reuse Wide Gift’s leftover AP≥2-and-MP≥1 key.

`mpCost` stays 0 on every Wave-19 row.

**New keys (Wave 19 only):**

```text
requireCasterLeftoverSumEq, requireTargetLeftoverSumEq, septetSumN, septetMendAmount,  // Septet Mend — AP+MP === 7 on both bodies (odd; no equality flag)
quarteRemainingCdsEq4To0,                                                             // Cadence Quarte — remaining n===4 → 0; n===1, n===2, n===3, n>4 unchanged
tetradecaSpanCells, tetradecaLong, tetradecaShort,                                    // Tetradeca Span — 14; axis-aligned 2×7
invertCasterAndHostileLeftoverApMp,                                                   // Feud Turn — caster + one opposite-side; caster participates
septetHoodNextHit,                                                                    // Septet Hood — next hit while sum===7, any range → 0
septetLeftoverSumEq, septetStingBonus,                                                // Septet Sting
septetStepNeedSumEq, septetStepAdj,                                                   // Septet Step — dest Chebyshev 1 of target
septetSillNeedSumEq, septetSillDamage, septetSillDuration,                            // Septet Sill — start-of-their-turn tax
septetHoldWhileSumEq, septetHoldDuration,                                             // Septet Hold — 2 of their turns
septetLendAp, septetLendMp, requireTargetSumEqLend,                                   // Septet Lend — +1 AP and +1 MP iff sum===7 (exits window)
septetSipAp, requireTargetSumEqSip,                                                   // Septet Sip — steal 1 leftover AP iff sum===7
septetPostDetonateDamage, septetPostNeedSumEq,                                        // Septet Post — 10 on end-turn occupy if sum===7
septetBounceNeedSumEq, septetBounceSearchRadius, septetBounceCount,                   // Septet Bounce
mustNonStrikeUnlessSumEqAndSpendsLastAp,                                              // Must Septet — pre-spend leftover (same key name as Must Sestet/Stave/Score; septetSumN distinguishes)
verseSeptetUntilSumEq,                                                                // Verse Septet
courtQuarteExcludeCaster                                                              // Court Quarte
```

If a key is missing, the rider does not fire. `septetSumN` is **7** on every Septet\* row that names a sum. Missing `septetSumN` → gate fails closed (do not guess 7 from the name; do not treat (4,2) as Septet; do not treat (3,3) as Septet; do not treat (3,4) as Stave). **No `septetForbidEqual`:** leftover sum 7 is odd and **cannot** tie. Do not add an equality flag that would silently fail (3,4). Do not copy `sestetForbidEqual` onto this family.

Nested kit-only id (not a player card): none new besides Court Quarte itself. Septet Post’s detonate is **not** a second spell id (the summon row carries `septetPostDetonateDamage`). Do not mint `spell-septet-burst`.

Leftover AP / leftover MP are **current remaining after this spell’s AP is paid**, read from the same pools the HUD uses — **except Must Septet**, which reads leftover **before** debit (a “spends last AP” gate is otherwise impossible once leftover AP is already 0). Walk spends must write leftover MP. Spell spends must write leftover AP. Missing leftover → the gate fails closed (fizzle rider, AP spent, observe). Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count as leftover for these gates. **Dual Keep caps surviving leftover AP and leftover MP at 2**, so Dual Keep leftover sums to **at most 4**. Dual Keep **cannot** open Septet (sum 7). Sum is integer `leftoverAp + leftoverMp`. Leftover `0 + 0` is **not** a Septet window (sum 0). Leftover `3 + 0` is **not** a Septet window (sum 3, Tally). Leftover `3 + 1` is **not** a Septet window (sum 4, Score). Leftover `3 + 2` is **not** a Septet window (sum 5, Stave). Leftover `2 + 2` is **not** a Septet window (sum 4 **and** a tie, Poise). Leftover `3 + 3` is **not** a Septet window (sum 6 **and** a tie, Poise). Leftover `4 + 2` is **not** a Septet window (sum 6 unequal, Sestet). Leftover `1 + 1` is **not** a Septet window (Prime Gift / Poise). Legal pairs after a successful Septet gate: **(7,0) (0,7) (6,1) (1,6) (5,2) (2,5) (4,3) (3,4)** only.

A 6 AP / 3 MP bar that pays this heal’s 3 AP lands at leftover **(3,3)** — that is Poise, **not** Septet. A 7 AP / 2 MP bar that pays 3 AP lands at leftover **(4,2)** — that is Sestet, **not** Septet. The intended bank is a **7 AP / 3 MP** bar (or Haste / Tempo Gift / Stave Lend) so the post-debit pair is (4,3).

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Cadence Quarte’s ready-unlock of remaining-4 is paid in **currently remaining 4**, not in extra AP. Septet Mend’s 8 is paid in **two sum===7 bars on two bodies** after a 3-AP debit (Sestet Mend is the two-body sum-6-unequal cousin; Stave Mend is the two-body sum-5 cousin). Dual Keep cannot fake this window — the player (or Haste / Tempo Gift / Stave Lend / a 7 AP / 3 MP bar after a 3-AP spend) has to actually sit on seven.

Do **not** put Must Septet in the same CORE as a Strike-only septet lock (this pass does not ship that lock). Do **not** CORE Septet Hood with Spent Plate, Gait Plate, Dual Plate, Prime Plate, Thin Plate, Poise Hood, Tally Hood, Score Hood, Stave Hood, or Sestet Hood. Do **not** CORE Septet Mend with Hollow Gift, Gaunt Mend, Poise Mend, Equal Gift, Tally Mend, Score Mend, Stave Mend, Sestet Mend, Lean Gift, Prime Gift, Gait Gift, or Wide Gift. Do **not** CORE Feud Turn with Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, or Psalm Turn. Do **not** CORE Cadence Quarte with Cadence Tierce, Dock, Snuff, Tern, Quad, Rise, Prime, Floor, Cap, Halve, Trim, Crack, or Flush.

---

## 5. Proposed spells (Wave 19)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-septet-mend`

NAME: Septet Mend  
ROLE: SUPPORT — heal if caster **and** target leftover AP + leftover MP **=== 7**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"requireCasterLeftoverSumEq":true,"requireTargetLeftoverSumEq":true,"septetSumN":7,"septetMendAmount":8}`. If **both** caster and target have leftover AP + leftover walk MP **=== 7** at resolve (after this spell’s 3 AP is paid), heal the target 8 through the existing heal helper. If either sum ≠ 7, fizzle rider (AP spent, no HP). Walk / force-move flags do **not** substitute. Distinct from Sestet Mend (#1132, **both bodies leftover AP + leftover MP === 6 AND leftover AP ≠ leftover MP** — even sum, equality banned), Stave Mend (#1063, **both bodies leftover AP + leftover MP === 5** — odd sum, never an equality), Score Mend (#1011, **both bodies leftover AP + leftover MP === 4 AND leftover AP ≠ leftover MP**), Tally Mend (#953, **both bodies leftover AP + leftover MP === 3**), Poise Mend (#890, **both bodies leftover AP === leftover MP ≥ 1**), Equal Gift (#906, **target only** leftover AP == leftover MP ≥ 1; caster leftover unread), Prime Gift (#1017, **target leftover AP exactly 1 AND leftover MP exactly 1**), Gait Gift (#1082, **one body leftover AP ≥ 2 AND leftover MP = 0** — (7,0) is Gait Gift **and** a Septet pair; Septet Mend still requires **both** bodies), Wide Gift (#1143, **one body leftover AP ≥ 2 AND leftover MP ≥ 1** — (6,1) (5,2) (4,3) are Wide Gift **and** Septet pairs; Septet Mend still requires **both** bodies), Hollow Gift (#837, **target only** leftover AP=0 **and** leftover MP=0), Gaunt Mend (#849, **both bodies leftover AP=0 and leftover MP=0**), Lean Gift (#962, leftover **AP = 0 and leftover MP ≥ 1** — (0,7) is Lean Gift **and** a Septet pair), Dry Mend (#747, both leftover **AP = 0**, MP unconstrained), Dry Gait (#802, both leftover **MP = 0**, AP unconstrained), Ready Sting (leftover AP≥1 **and** MP≥1 with **no sum**), Tied Gait (#906, leftover AP **and** leftover MP **exactly 2**), Dual Plate (#1017, leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**). Legal pairs: (7,0) (0,7) (6,1) (1,6) (5,2) (2,5) (4,3) (3,4). The decision: two bodies **sum to 7** — Dual Keep 2/2 is Poise **and** Score-blocked, **not** Septet (sum 4); Dual Keep **cannot** open Septet; a 6 AP / 3 MP bar that pays this 3 AP lands at **(3,3)** and **fails** (that is Poise Mend’s window); a 7 AP / 2 MP bar that pays 3 AP lands at **(4,2)** and **fails** (that is Sestet Mend’s window); sit on 7 leftover AP and 3 leftover MP after paying the heal, or Stave Lend a (3,2) into (4,3). `healAmount` stays 0 on the row so `inferArchetype` (`enemyAI.ts` 447–452) does not treat a kit that only *carries* this id as healer; **healer CORE only** when the row is in a live pool. Odd sum — **no** equality flag (unlike Sestet / Score).  
DURATION: instant  
SCALING: 8 follows heal% if any; amount otherwise fixed.  
SYNERGIES: Haste / Tempo Gift / Timestep to bank seven after the 3-AP spend; Stave Lend **manufactures** Septet ((3,2)→(4,3)); Septet Lend **exits** to 9; Feud Turn **keeps** sum 7 on both bodies when both were already in-window.  
COUNTERPLAY: Spend a pool so either body leaves 7; Dual Keep (caps at 2, **blocks** Septet); sit on 4/2 (Sestet) or 3/3 (Poise) or 3/2 (Stave) or 3/1 (Score) or 2/1 (Tally) or 2/2 (Poise) or 1/1 (Prime Gift).  
POWER_BUDGET: Standard heal, gated on **two** leftover sums of 7 (four leftover reads). Blood Mend is 12 ungated self. Sestet Mend is 8 on **two sum-6 unequal** bodies. Stave Mend is 8 on **two sum-5** bodies. Dual Keep cannot fake this.  
AI_USAGE: `aiHint: "heal_if_both_bodies_leftover_ap_plus_mp_eq_7"`. Cantors / bishops. Skip if either leftover sum ≠ 7. **Healer CORE only.** Do not dump leftover **only** to enable this if a Strike would kill.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop","queen"], levelZoneMin: 1 }`. MULTI child `septet_cantor`.  
EDGE_CASES: Targeting ally already allows self (`targeting.ts` 184–189). Self-cast requires the caster’s leftover sum === 7 (two keys, two reads of one body). Self-cast at leftover 4/2 **does not** collide with Sestet Mend — sum 6 fails `septetSumN`. Self-cast at leftover 3/3 **does not** collide with Poise Mend / Equal Gift — sum 6 fails `septetSumN`. Self-cast at leftover 0/0 **does not** collide with Hollow Gift / Gaunt Mend — sum 0 fails `septetSumN`. Self-cast at leftover 2/2 **does not** collide with Poise Mend / Equal Gift / Tied Gait / Dual Plate — sum 4 fails `septetSumN`. Self-cast at leftover 3/2 **does not** collide with Stave Mend — sum 5 fails `septetSumN`. Self-cast at leftover 3/1 **does not** collide with Score Mend — sum 4 fails `septetSumN`. Self-cast at leftover 3/0 **does not** collide with Tally Mend — sum 3 fails `septetSumN`. Self-cast at leftover 1/1 **does not** collide with Prime Gift — sum 2 fails `septetSumN`. Self-cast at leftover 7/0 **does** fire, and is **not** a Gait Gift clone (Gait Gift is one-body AP≥2/MP=0 with no second-body read). Self-cast at leftover 4/3 **does** fire, and is **not** a Wide Gift clone (Wide Gift is one-body AP≥2/MP≥1 with no second-body read). Player-side HP actually increased → `challengeHealUsedRef`. Missing keys → no heal. Missing `septetSumN` → fail closed. Do not clone Sestet Mend / Stave Mend / Score Mend / Tally Mend / Poise Mend / Equal Gift / Gaunt Mend / Lean Gift / Prime Gift / Gait Gift / Wide Gift / Dry Mend / Dry Gait. Target-only sum===7 heal stays Wave 20 / SDE. If same-day SDE Wave 19 claims this leftover, **SDE wins** — keep both-body vs their target-only the way Sestet vs Wide Gift / Stave vs Gait Gift already split. Do not mint `spell-sept-mend` (Sept Span is occupy-weight 7).  
IMPLEMENTATION_COMPLEXITY: LOW — four leftover reads + existing heal helper.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-septet-mend
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
effectParams: {"requireCasterLeftoverSumEq":true,"requireTargetLeftoverSumEq":true,"septetSumN":7,"septetMendAmount":8}
```

---

### SPELL_ID: `spell-cadence-quarte`

NAME: Cadence Quarte  
ROLE: CONTROL — remaining CDs `n===4` become `0`  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"quarteRemainingCdsEq4To0":true}`. For each spell id in the **target’s** remaining-CD map with `n === 4`, write `0`. Zeros stay 0. Remaining `n===1` **unchanged** (Snuff’s window). Remaining `n===2` **unchanged** (Dock’s window). Remaining `n===3` **unchanged** (Tierce’s window). Remaining `n>4` **unchanged** (Quad / Tern / Cap / Floor territory). Target **keeps every spell**. Once/battle flags and spell levels are **not** CDs. Distinct from Cadence Tierce (#1132, remaining `n===3` → `0` — threes, not fours), Cadence Dock (#1063, remaining `n===2` → `0` — twos, not fours), Cadence Snuff (#1011, remaining `n===1` → `0` — ones, not fours), Cadence Quad (#1143, remaining `n>4` → `4` — **fours stay 4**), Cadence Tern (#1082, remaining `n>3` → `3` — **fours become 3**, not 0), Cadence Cap (#1017, remaining `n>2` → `2` — **fours become 2**, not 0), Cadence Rise (#962, remaining `n===1` → `2`), Cadence Prime (#953, remaining `n===0` → `1`), Cadence Floor (#906, remaining `n>1` → `1`; **zeros stay 0**; would peel a 4 to 1, **not** to 0), Cadence Swap (#837, **exchange full remaining maps**), Cadence Lag (#849, remaining `n>0` → `n+2`), Cadence Stall (#590, remaining `n>0` → `n+1`; zeros stay 0), Cadence Stretch (#636, remaining ×2), Cadence Theft (#411, **steals** remaining), Cadence Imprint (#787, **copies** onto the caster; target keeps), Cadence Rest (#747, **own** remaining do not tick), Cadence Grace (#802, **next own spell does not start** its cooldown), Cadence Halve (#726, **÷2** on the hostile), Cadence Trim / Shave / Pin / Crack / Flush. The decision: their Inferno is sitting on remaining 4 — Quarte makes it legal **this turn**; Tierce would have needed remaining 3; Dock would have needed remaining 2; Snuff would have needed remaining 1; Quad would have **left** a 4; Tern would have written 3; Cap would have written 2; Floor would have written 1.  
DURATION: instant rewrite of remaining `n===4`  
SCALING: none.  
SYNERGIES: Quad a 7 to 4, **then** Quarte the 4 to 0 on a **later** turn (do **not** CORE Quad with Quarte). Verse Septet so the unlocked id is also their last verse.  
COUNTERPLAY: Sit remaining at 1 (Snuff’s problem) or at 2 (Dock’s problem) or at 3 (Tierce’s problem) or at 5+ (Quad / Tern / Cap / Floor’s problem); recast before Quarte; Cadence Break your own remaining.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **unlock remaining-4**, not a silence and not a mass zero.  
AI_USAGE: `aiHint: "quarte_remaining_cds_eq_4_to_0"`. Scribes / tempo. Skip if the target has no remaining `n===4`. Do **not** CORE with Tierce / Dock / Snuff / Quad / Tern / Cap / Floor / Rise / Prime.  
DISCOVERY_ELIGIBILITY: true. MULTI child `quarte_precentor`. `pieceTypes: ["bishop","queen"], levelZoneMin: 1`  
EDGE_CASES: Missing key → no rewrite. Do not write `spellLevelValues`. Do not reset Dual Keep’s once/battle. Preview must show which remaining drop from 4 to 0. All-non-4 remaining → fizzle rider (AP spent, observe). Do **not** reuse `tierceRemainingCdsEq3To0` / `dockRemainingCdsEq2To0` / `snuffRemainingCdsEq1To0` / `capRemainingCdsAbove2To2` / `capRemainingCdsAbove3To3` / `floorRemainingCdsTo1` / `primeRemainingCdsFrom0`. Do **not** mint `spell-cadence-quad` (SDE #1143 owns that as `n>4→4`). If same-day SDE Wave 19 claims this leftover, **SDE wins** — do not keep a second Quarte id. Quad already owns `n>4→4`; this card is `4→0` even if SDE later stamps a second Quad alias.  
IMPLEMENTATION_COMPLEXITY: LOW — walk remaining map, write 0 when n===4.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-cadence-quarte
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
effectParams: {"quarteRemainingCdsEq4To0":true}
```

---

### SPELL_ID: `spell-tetradeca-span`

NAME: Tetradeca Span  
ROLE: SUMMONS — axis-aligned 2×7 occupy; counts as **fourteen**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 4  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "tetradecaspan"`, `summonLifespan: 4`, empty kit (`summonUnitDef` with `pieceType: ""` / zero scales — a body, not a caster). `effectParams: {"tetradecaSpanCells":14,"tetradecaLong":7,"tetradecaShort":2}`. Click a free ground tile. That click is the **nearest cell of the 2×7 to the caster** (Dec Span / Dodeca Span’s placement rule, **not** Trideca / Hendeca’s center rule). Occupy an axis-aligned 2×7 rectangle whose long axis is the dominant caster→click axis (`|dx| >= |dy|` → 7 along x, 2 along y; else 7 along y, 2 along x). All 14 cells must be free and in-bounds (`isCellFree`); else fizzle (AP spent). One combatant id, fourteen-cell footprint. Every cell of the 14 is occupied (not a cage hole — Oct Span’s hollow 3×3 stays Oct Span). Counts as **fourteen** toward the summon cap. Distinct from Trideca Span (#1132, orthogonal plus **arm 3** = 13, click = **center**), Dodeca Span (#1063, axis-aligned **3×4** = 12, click = **nearest cell to caster**), Hendeca Span (#1011, stretched plus longArm 3 / shortArm 2 = **11**, click = **center**, **asymmetric**), Dec Span (#953, axis-aligned **2×5** = 10, click = nearest cell), Nine Span (#890, solid 3×3 = 9, click = center), Oct Span (#849, hollow 3×3 = 8), Sept Span (#726, stretched plus longArm 2 / shortArm 1 = 7), Penta Span (plus arm 1 = 5), Six Span (2×3 = 6), Quad Span (2×2 = 4), Triple / Twin Span. Empty kit.  
DURATION: lifespan 4 or until the body dies (frees all fourteen)  
SCALING: none (occupy, not damage).  
SYNERGIES: Septet Hold so they cannot walk around the slab; Score / Tally / Stave / Sestet / Septet Sill on a cell **beside** the block, not on it (occupied).  
COUNTERPLAY: Coup the body; blink past; File Lance along the long axis; occupy-weight still 2 live so this card **does not ship** until a dedicated occupy-weight exists.  
POWER_BUDGET: Heavy 4 / CD 3 / 0 damage. Power is **fourteen occupied cells**. Implementation-blocked while `ENEMY_SUMMON_CAP === 2`.  
AI_USAGE: `aiHint: "tetradeca_span_if_2x7_free_and_cuts_a_file"`. Masons / rooks ELITE. Skip if any of the 14 is occupied / off-map / a portal. Missing hint → drop id.  
DISCOVERY_ELIGIBILITY: true. MULTI child `span_tetradeca`. `pieceTypes: ["rook"]`, `levelZoneMin: 2`  
EDGE_CASES: **Do not ship while `ENEMY_SUMMON_CAP === 2` without occupy-weight.** Never parse `"Tetradeca Span"` / `"Fourteen"` / `"2x7"`. One id, fourteen cells — destroying the body frees all fourteen. Player-side Tetradeca Span counts toward the **player** summon economy, not `ENEMY_SUMMON_CAP`. Missing `tetradecaSpanCells` → do not spawn a 1-cell body and call it Tetradeca Span. Missing `tetradecaLong` / `tetradecaShort` → do not guess 2×5 (that is Dec Span), 3×4 (that is Dodeca Span), or plus arm 3 (that is Trideca Span). Off-map cell → fizzle. Do not mint `spell-fourteen-span` / `spell-tetrakaideca-span` / `spell-plus-span`. Cardinal click with `dx===0 && dy===0` is illegal (`freeCells` / caster tile) — the nearest cell cannot be the caster’s cell. Click is **nearest cell to caster**, not center (Trideca’s center stays Trideca; a 2×7 **has** no unique center). Diagonals of the bounding box that are outside the 2×7 are **not** occupied.  
IMPLEMENTATION_COMPLEXITY: HIGH — occupy-weight + 2×7 placer. Same class as Dec / Dodeca / Trideca.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-tetradeca-span
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
summonAI: tetradecaspan
summonLifespan: 4
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
acquisitionModel: MULTI_SOURCE
discoveryEligible: true
effectParams: {"tetradecaSpanCells":14,"tetradecaLong":7,"tetradecaShort":2}
```

---

### SPELL_ID: `spell-feud-turn`

NAME: Feud Turn  
ROLE: CONTROL — invert leftover AP↔MP on **the caster and one opposite-side hostile**; caster participates  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 2  
EFFECT: No damage. **Not** `isSwap`. `effectParams: {"invertCasterAndHostileLeftoverApMp":true}`. Target one living **opposite-side** body. Snapshot **the caster’s** leftover AP and leftover MP **and** the target’s leftover AP and leftover MP, then write leftover AP ← leftover MP and leftover MP ← leftover AP on **each** body independently, each **capped at that pool’s max**. Caster leftover **does change**. Caster does not move. Distinct from Psalm Turn (#1132, **one same-side non-caster + one opposite-side**, caster **unchanged**, via `invertMixedSidesLeftoverApMp` — **do not reuse that key**), Hymn Turn (#1063, **two same-side non-caster allies** independent invert via `invertTwoAlliesLeftoverApMp` — **do not reuse that key**), Duel Turn (#1011, **two hostiles** independent invert via `invertTwoHostilesLeftoverApMp` — **do not reuse that key**), Purse Turn (#953, **one** hostile invert via `invertHostileLeftoverApMp` — **do not reuse that key**; caster unchanged), Tempo Invert (#282, **one-body ally/self** leftover AP↔MP via `invertApMp` — **do not reuse that key**; a self-only invert is **not** this two-body card), Bar Cross (#890, **two-body leftover cross**: caster AP ↔ target MP **and** caster MP ↔ target AP via `crossLeftoverApMpTwoBody` — **do not reuse that key**; that **exchanges across bodies**, this **inverts each body independently**), Dual Keep (banks leftover AP **and** MP on **one** body, no invert), Swap / Pawn Trade (tiles, not pools), Choir Hymn (Wave-1 Discovery heal — **do not alias**). Player-side summons are **not** the second body (the second body is the targeted hostile).  
DURATION: instant leftover rewrite; no snap-back at turn end  
SCALING: none.  
SYNERGIES: Septet Mend / Septet Sting after the invert **keeps** sum 7 on a body that was already in-window; Sestet Mend after you invert a (4,3) caster with a (5,2) hostile (both stay Septet) **or** a (4,3) caster with a (4,2) hostile (caster stays Septet, hostile stays Sestet). Must Septet after you dump their AP into MP.  
COUNTERPLAY: Keep leftover AP === leftover MP on both so both inverts are no-ops; Quiet Hex after they invert into a 3-AP spell; sit the caster on a window they did not want to leave.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **the caster’s leftover flip plus one hostile leftover flip**, not a swap, not Psalm Turn (caster stays), and not Bar Cross (cross-body exchange).  
AI_USAGE: `aiHint: "feud_turn_if_hostile_in_r3_and_at_least_one_of_caster_or_hostile_is_unequal"`. Hex / queens. Skip if both inverts would be no-ops (both already AP===MP).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing `invertCasterAndHostileLeftoverApMp` → fail closed (do **not** invert only the hostile and become Purse Turn; do **not** invert only the caster and become Tempo Invert). Invert (4,3)→(3,4) **stays Septet**. Invert (7,0)→(0,7) **stays Septet**. Invert (6,1)→(1,6) **stays Septet**. Invert (5,2)→(2,5) **stays Septet**. Invert (4,2)→(2,4) **stays Sestet**. Invert (3,3) is a no-op (Poise stays Poise). Invert (3,2)→(2,3) **stays Stave**. Invert (3,1)→(1,3) **stays Score**. Do **not** reuse `invertMixedSidesLeftoverApMp` / `invertTwoAlliesLeftoverApMp` / `invertTwoHostilesLeftoverApMp` / `crossLeftoverApMpTwoBody`. If same-day SDE Wave 19 claims this leftover, **SDE wins**. Do not mint `spell-choir-turn` / `spell-war-turn` / `spell-foe-turn` / `spell-self-foe-turn`. Solo caster with a living hostile in range **does** fire (unlike Psalm Turn, which needs a same-side non-caster body).  
IMPLEMENTATION_COMPLEXITY: LOW — two leftover snapshots + two writes. Same class as Psalm Turn / Duel Turn with a caster-include filter.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-feud-turn
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
isSwap: false
acquisitionModel: ENEMY_DISCOVERY
discoveryEligible: true
effectParams: {"invertCasterAndHostileLeftoverApMp":true}
```

---

### SPELL_ID: `spell-septet-hood`

NAME: Septet Hood  
ROLE: DEFENSE — next applied hit is 0 iff leftover AP + leftover MP **=== 7**  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"septetHoodNextHit":true,"septetSumN":7}`. Arm a one-hit consume: the next applied hit on the caster is 0 **if at impact** leftover AP + leftover MP **=== 7**. Any Chebyshev. The charge remains if the hit arrives while the sum ≠ 7 (hit lands fully; charge stays). Distinct from Sestet Hood (#1132, leftover AP + leftover MP === 6 **and unequal**), Stave Hood (#1063, leftover AP + leftover MP === 5), Score Hood (#1011, leftover AP + leftover MP === 4 **and unequal**), Tally Hood (#953, leftover AP + leftover MP === 3), Poise Hood (#890, leftover AP === leftover MP ≥ 1), Dual Plate (#1017, leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** — (2,2) is Dual Plate / Poise, **not** Septet), Prime Plate (#1082, leftover **1/1**), Thin Plate (#1143, leftover **1/0**), Spent Plate (#837, leftover **AP ≥ 1**, MP unconstrained), Gait Plate (#802, leftover **MP ≥ 1**, AP unconstrained), Dry Plate (#962, leftover **MP = 0**), Even Hood (#849, **even Chebyshev**), Odd Hood (odd Chebyshev), Near / Mid / Far Hood (range bands), Odd Plate (#906, leftover **AP odd**). The decision: hold (4,3) through the hit — Dual Keep 2/2 is Poise Hood / Dual Plate, **not** this — or spend into 4/2 and Sestet Hood still works, this does not. Do **not** CORE with Spent Plate, Gait Plate, Dual Plate, Prime Plate, Thin Plate, Poise Hood, Tally Hood, Score Hood, Stave Hood, or Sestet Hood.  
DURATION: until consumed at a sum===7 impact, or battle end  
SCALING: none (negate, not a RES%).  
SYNERGIES: Haste to bank seven; Feud Turn a (7,0) caster into (0,7) still Septet Hood; Septet Hold so they cannot walk you off 7.  
COUNTERPLAY: Wait until they spend a pool; Coup; hit them on 4/2 (Sestet Hood) or 3/3 (Poise Hood) or 3/2 (Stave Hood) or 3/1 (Score Hood).  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **one hit while sitting on seven**. Dual Keep cannot fake it.  
AI_USAGE: `aiHint: "septet_hood_if_self_leftover_sum_eq_7"`. Lurkers / knights ELITE. Skip if leftover sum ≠ 7.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Missing `septetSumN` → fail closed. Leftover 4/2 at impact → hit lands (Sestet Hood). Leftover 3/3 at impact → hit lands (Poise Hood). Leftover 3/2 at impact → hit lands (Stave Hood). Leftover 3/1 at impact → hit lands (Score Hood). Leftover 2/2 at impact → hit lands (Poise Hood / Dual Plate). Leftover 1/1 at impact → hit lands (Prime Plate / Poise). Leftover 1/0 at impact → hit lands (Thin Plate). Do **not** retag `even_gallery`.  
IMPLEMENTATION_COMPLEXITY: LOW — one leftover-sum gate on the next applied hit.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-septet-sting`

NAME: Septet Sting  
ROLE: DAMAGE — 10, plus 8 if target leftover AP + leftover MP **=== 7**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. Then if the target’s leftover AP + leftover MP **=== 7**, deal `septetStingBonus` (8) as a second existing `dealDamage` call. `effectParams: {"septetLeftoverSumEq":true,"septetSumN":7,"septetStingBonus":8}`. Distinct from Sestet Sting (#1132, leftover AP + leftover MP === 6 **and unequal**), Stave Sting (#1063, leftover AP + leftover MP === 5), Score Sting (#1011, leftover AP + leftover MP === 4 **and unequal**), Tally Sting (#953, leftover AP + leftover MP === 3), Poise Sting (#890, leftover AP === leftover MP ≥ 1), Gaunt Sting (#849, leftover **both 0**), Lean / Dry / Ready / Full / Even Sting (#962, leftover AP **even and ≥ 2** — (2,2) is even AP, which is Poise, not Septet), Fresh Sting (#1017), Capped Sting (#1082, leftover MP **equals max MP**), Wide Sting (#1143), Odd Sting (#906, leftover **AP odd**), Tied Gait (#906, both leftover **exactly 2**). The decision: poke the (4,3) bishop for 18, or poke anyone for 10. Dual Keep 2/2 is the **wrong** window (Poise Sting). Dual Keep cannot open this. (4,2) is Sestet Sting, not this. (3,3) is Poise Sting, not this.  
DURATION: instant  
SCALING: 10 / 8 follow damage%.  
SYNERGIES: Feud Turn a (7,0) into (0,7) still Septet; Septet Hold so they cannot walk the MP off.  
COUNTERPLAY: Sit on 4/2 (Sestet Sting) or 3/3 (Poise Sting) or 3/2 (Stave Sting) or 3/1 (Score Sting) or 2/1 (Tally Sting) or 0/0 (Gaunt Sting).  
POWER_BUDGET: Cheap 2 / CD 1. 10 ungated + 8 on a sum of 7.  
AI_USAGE: `aiHint: "septet_sting_if_target_leftover_sum_eq_7"`. Lurkers / pawns. Skip the bonus path if leftover sum ≠ 7; 10 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing bonus keys → 10 only. Target leftover 4/2 → no bonus (Sestet Sting). Target leftover 3/3 → no bonus (Poise Sting). Target leftover 3/2 → no bonus (Stave Sting). Target leftover 3/1 → no bonus (Score Sting). Target leftover 3/0 → no bonus (Tally Sting). Do not name-wire the bonus.  
IMPLEMENTATION_COMPLEXITY: LOW — one leftover-sum gate + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-septet-step`

NAME: Septet Step  
ROLE: POSITION — relocate to Chebyshev 1 of an ally whose leftover AP + leftover MP **=== 7**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `freeCells` on the dest. `effectParams: {"septetStepNeedSumEq":true,"septetSumN":7,"septetStepAdj":1}`. Target an ally (not self) whose leftover AP + leftover MP **=== 7**. The caster **relocates** to a free cell at Chebyshev 1 of that ally (player picks the dest among legal neighbors; AI picks the safest). If the ally is not in the window or no neighbor is free, fizzle (AP spent, no move). Distinct from Sestet Step (#1132, ally leftover sum === 6 **and unequal**), Stave Step (#1063, ally leftover sum === 5), Score Step (#1011, ally leftover sum === 4 **and unequal**), Tally Step (#953, ally leftover sum === 3), Poise Step (#890, ally leftover AP === leftover MP ≥ 1), Gaunt Step (#849, ally leftover **both 0**), Home / Heave / Parched / Ally Step, Hinge Step, Relay Dash. The decision: blink next to the (0,7) wisp — they have walk, you have position — or wait for a 4/2 and Sestet Step, or a 3/3 and Poise Step, or a 3/2 and Stave Step. Dual Keep cannot open this.  
DURATION: instant relocate  
SCALING: none.  
SYNERGIES: Septet Sill on a neighbor so they eat 8 at dawn if they stay on 7; Feud Turn keeps a hostile in-window; Stave Lend manufactures the ally’s Septet.  
COUNTERPLAY: Spend the wisp’s pool; occupy every neighbor; Coup; sit the wisp on 4/2.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **blink to a seven-bar ally**.  
AI_USAGE: `aiHint: "septet_step_if_ally_leftover_sum_eq_7_and_a_neighbor_is_free"`. Porters / queens. Skip if no in-window ally or no free neighbor.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Self-target forbidden (`septetStep` is not a self blink — that is Mist Step / Phase Slip). Missing keys → no move. Ally leftover 4/2 → fizzle (Sestet Step). Ally leftover 3/3 → fizzle (Poise Step). Ally leftover 3/2 → fizzle (Stave Step). Ally leftover 3/1 → fizzle (Score Step). Portal dest illegal (`isCellFree`).  
IMPLEMENTATION_COMPLEXITY: LOW — leftover-sum gate + existing relocate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-septet-sill`

NAME: Septet Sill  
ROLE: TERRAIN — start-of-their-turn occupy tax iff leftover AP + leftover MP **=== 7**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell for 2 turns. `effectParams: {"septetSillNeedSumEq":true,"septetSumN":7,"septetSillDamage":8,"septetSillDuration":2}`. At the **start of a combatant’s turn**, if they occupy this cell and leftover AP + leftover MP **=== 7**, deal 8 through `updateCombatant`. Walk-enter does **not** tax (Ingress / Shove Sting). End-turn occupy does **not** tax (Septet Post / Dwell). Relocate landing does **not** tax (Drift Post). Distinct from Sestet Sill (#1132, leftover sum === 6 **and unequal** at start), Stave Sill (#1063, leftover sum === 5 at start), Score Sill (#1011, leftover sum === 4 **and unequal** at start), Tally Sill (#953, leftover sum === 3 at start), Poise Sill (#890, leftover AP === leftover MP ≥ 1 at start), Gaunt Sill (#849, leftover **both 0** at start), Wake Mark (start-turn any leftover), Quiet / Cast / Drift / Parched Sill. The decision: stand on the sill at (4,3) and eat 8 at dawn, or spend a pool overnight, or sit on 4/2 and eat Sestet Sill instead, or sit on 3/3 and eat Poise Sill. Dual Keep overnight **cannot** leave them on 7.  
DURATION: 2 turns of paint  
SCALING: 8 follows damage% if any; otherwise fixed.  
SYNERGIES: Septet Hold so they cannot walk off overnight; Feud Turn keeps sum 7 through dawn.  
COUNTERPLAY: Walk off (start-turn only); spend a pool; blink; dump to 4/2.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 upfront. Power is **dawn tax on a sum of 7**.  
AI_USAGE: `aiHint: "septet_sill_if_foe_will_start_turn_sum_eq_7_on_tile"`. Masons / rooks. Skip if they will not start on 7.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Paint on a portal → fizzle (`isCellFree`). Occupant leftover 4/2 at dawn → no tax (Sestet Sill). Occupant leftover 3/3 at dawn → no tax (Poise Sill). Occupant leftover 3/2 at dawn → no tax (Stave Sill). Occupant leftover 3/1 at dawn → no tax (Score Sill). Occupant leftover 3/0 at dawn → no tax (Tally Sill). Occupant leftover 0/0 at dawn → no tax (Gaunt Sill).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — painted cell + start-turn leftover-sum gate. Same class as Sestet Sill / Stave Sill / Score Sill / Tally Sill / Poise Sill.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-septet-hold`

NAME: Septet Hold  
ROLE: CONTROL — cannot spend leftover MP to walk while leftover AP + leftover MP **=== 7**  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"septetHoldWhileSumEq":true,"septetSumN":7,"septetHoldDuration":2}`. For 2 of the **target’s** turns, any walk that would spend ≥ 1 leftover MP is illegal **while leftover AP + leftover MP === 7**. Teleport / Swap / Phase Slip / Twin-gate step / Septet Step (caster relocate) do **not** pay walk MP and are legal. Distinct from Sestet Hold (#1132, cannot walk while leftover sum === 6 **and unequal**), Stave Hold (#1063, cannot walk while leftover sum === 5), Score Hold (#1011, cannot walk while leftover sum === 4 **and unequal**), Tally Hold (#953, cannot walk while leftover sum === 3), Poise Hold (#890, cannot walk while leftover AP === leftover MP ≥ 1), Odd Hold (#849, cannot walk while leftover AP is **odd**), Dry Hold (until leftover **AP = 0**), Drift Hold (until **force-moved**), Cast Hold / Strike Hold / Boot Hold / Tool Hold / Gaunt Hold / Brick Hold (#1017). The decision: they have (0,7) and wanted to walk seven tiles — they must **leave sum 7** (cast leftover AP from a (4,3) / (5,2) / (6,1) / (7,0), get siphoned, get turned, **or dump to 4/2**) before walking, or wait 2 turns. At leftover (0,7) they **have** MP but cannot spend it while this lock is up **and** they still sum to 7. Dual Keep 2/2 is Poise Hold, **not** this. Dual Keep cannot open this. (4,2) is Sestet Hold, not this. (3,3) is Poise Hold, not this.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Must Septet on (0,7) so they can neither walk nor non-Strike; Feud Turn (0,7)→(7,0) so they lose the walk MP into leftover AP.  
COUNTERPLAY: Cast leftover AP to leave 7; dump to 4/2; blink; wait 2 turns.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **cannot walk while sitting on seven**.  
AI_USAGE: `aiHint: "septet_hold_if_target_leftover_sum_eq_7_and_wants_to_walk"`. Hex / knights ELITE. Skip if leftover sum ≠ 7.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Missing keys → no lock. Leftover (4,2) → this lock does **not** block walks (Sestet Hold’s window). Leftover (3,3) → this lock does **not** block walks (Poise Hold’s window). Leftover (3,2) → this lock does **not** block walks (Stave Hold). Leftover (3,1) → this lock does **not** block walks (Score Hold’s window). Leftover (2,2) → this lock does **not** block walks (Poise Hold). Leftover (3,0) → this lock does **not** block walks (Tally Hold; leftover MP is 0 anyway).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — leftover-sum gate in the walk spender.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-septet-lend`

NAME: Septet Lend  
ROLE: SUPPORT — +1 leftover AP and +1 leftover MP iff target leftover AP + leftover MP **=== 7** (exits to 9)  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"septetLendAp":1,"septetLendMp":1,"requireTargetSumEqLend":true,"septetSumN":7}`. If the **target** has leftover AP + leftover MP **=== 7**, grant +1 current AP and +1 current MP (capped at max). The sum becomes **9** (the septet window **closes**). Inequality of the pre-lend pair is not required (odd sum never ties) and is not preserved as a named family: (4,3)→(5,4), (5,2)→(6,3), (6,1)→(7,2), (7,0)→(8,1). This **cannot** manufacture Sestet (sum 9 ≠ 6) or Stave (sum 9 ≠ 5) or Score (sum 9 ≠ 4) or Tally (sum 9 ≠ 3) or Poise (sum 9 is not a required equality). If the gate fails, fizzle rider (AP spent, no grant). Distinct from Sestet Lend (#1132, +1/+1 if leftover sum === 6 **and unequal** — **exits** to 8), Stave Lend (#1063, +1/+1 if leftover sum === 5 — **exits** to 7, **which is this family’s window**), Score Lend (#1011, +1/+1 if leftover sum === 4 **and unequal** — **exits** to 6, which is Sestet), Tally Lend (#953, +1/+1 if leftover sum === 3 — **exits** to 5, which is Stave), Poise Lend (#890, +1/+1 if leftover AP === leftover MP ≥ 1 — the **tie survives**), Gaunt Lend (#849, +1/+1 if leftover **both 0**), Lean / Drift / Spent Lend, Watch Alms, Tempo Gift / Loan Tempo / Haste, Dual Keep. The decision: cash the (4,3) wisp for a 2-resource bump, then they are out of Septet **and** out of Sestet **and** out of Stave **and** out of Score **and** out of Tally **and** out of Poise (sum 9 is 5/4 or 6/3 or 7/2 or 8/1). **Stave Lend is the intended manufacture of Septet** ((3,2)→(4,3)). Do not name-wire that hop.  
DURATION: instant (current-turn leftover only)  
SCALING: amount fixed.  
SYNERGIES: Stave Lend **into** Septet, then Septet Mend; or Septet Lend **out** of Septet into a 9-bar that Dual Keep cannot cap this turn.  
COUNTERPLAY: Sit off sum 7; sit on 4/2 (Sestet Lend); sit on 3/3 (Poise Lend); sit on 3/2 (Stave Lend); sit on 3/1 (Score Lend).  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **cash seven for nine**, not a Haste.  
AI_USAGE: `aiHint: "septet_lend_if_ally_leftover_sum_eq_7"`. Buffers / bishops. Skip if leftover sum ≠ 7.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing keys → no grant. Target leftover 4/2 → fizzle (Sestet Lend). Target leftover 3/3 → fizzle (Poise Lend). Target leftover 3/2 → fizzle (Stave Lend). Target leftover 3/1 → fizzle (Score Lend). Target leftover 2/1 → fizzle (Tally Lend). Cap at max: if leftover AP is already max, grant MP only — **then the sum may not be 9** and the window-exit is incomplete; fail closed if either grant cannot apply in full (both must land).  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-septet-sip`

NAME: Septet Sip  
ROLE: CONTROL — steal 1 leftover AP iff target leftover AP + leftover MP === 7  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: No HP damage. `effectParams: {"septetSipAp":1,"requireTargetSumEqSip":true,"septetSumN":7}`. If the target leftover AP + leftover MP **=== 7** **and** leftover AP ≥ 1, subtract 1 leftover AP from the target (not below 0) and add 1 leftover AP to the caster this turn, capped at max. If leftover AP is 0 (the (0,7) pair) or the sum ≠ 7, fizzle rider (AP spent). Distinct from Sestet Sip (#1132, steal 1 leftover AP iff leftover sum === 6 **and unequal** — **manufactures Stave** from every successful steal), Stave Sip (#1063, steal 1 leftover AP iff leftover sum === 5 — **manufactures Score or Poise**), Score Sip (#1011, steal 1 leftover AP iff leftover sum === 4 **and unequal** — **manufactures Tally**), Tally Sip (#953, steal 1 leftover AP iff leftover sum === 3 — **manufactures Poise** from (2,1)→(1,1)), Poise Sip (#890, steal 1 leftover AP iff leftover AP === leftover MP ≥ 1), Bare Sip (#849, steal 1 leftover AP iff leftover **MP = 0**), Soul Sip (ungated current MP), Ap Sip (#342). The decision: sip (5,2) → they become (4,2) **Sestet**; sip (6,1) → they become (5,1) **Sestet**; sip (7,0) → they become (6,0) **Sestet**; sip (3,4) → they become (2,4) **Sestet**; sip (2,5) → they become (1,5) **Sestet**; sip (1,6) → they become (0,6) **Sestet**; sip (4,3) → they become (3,3) **Poise**. **Sip does not always manufacture Sestet** — (4,3) manufactures Poise. That split is the decision Sestet Sip did not have (every Sestet pair minus 1 AP is Stave). Dual Keep 2/2 is the **wrong** window (Poise Sip). (4,2) is Sestet Sip, not this. (3,3) is Poise Sip, not this.  
DURATION: instant (current-turn leftover only)  
SCALING: amount fixed.  
SYNERGIES: Sestet Sting / Sestet Mend **after** manufacturing 4/2 or 5/1 or 6/0; Poise Sting **after** manufacturing 3/3 from (4,3); Septet Hold so they cannot walk the remaining MP.  
COUNTERPLAY: Sit on (0,7) (no AP to steal); sit off sum 7; sit on 4/2 (Sestet Sip); sit on 3/3 (Poise Sip); sit on 3/2 (Stave Sip); sit on 3/1 (Score Sip); Second Wind after.  
POWER_BUDGET: Cheap control, 0 damage, CD 1.  
AI_USAGE: `aiHint: "septet_sip_if_target_sum_eq_7_and_leftover_ap_ge_1"`. Hex / pawns. Skip if not in the window or leftover AP is 0.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Do not write `debuffStat: "ap"`. Missing keys → no steal. Target leftover 4/2 → fizzle (Sestet Sip’s window). Target leftover 3/3 → fizzle (Poise Sip’s window). Target leftover 3/2 → fizzle (Stave Sip’s window). Target leftover 3/1 → fizzle (Score Sip’s window). Target leftover 2/1 → fizzle (Tally Sip’s window). Challenge: not a heal, not MP. Sestet Sip on (4,2) → (3,2) **Stave** is the cousin manufacture; Stave Sip on (3,2) → (2,2) **Poise** is the next hop down; do not name-wire either hop.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-septet-post`

NAME: Septet Post  
ROLE: SUMMONS — empty-kit mine; end-turn occupy detonates iff leftover AP + leftover MP === 7  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "septetpost"`, `summonLifespan: 3`, empty kit. `effectParams: {"septetPostDetonateDamage":10,"septetPostNeedSumEq":true,"septetSumN":7}`. Place on a free ground tile. At **end of a combatant’s turn**, if they **occupy** this body and leftover AP + leftover MP **=== 7**, deal 10 to that occupant through `updateCombatant` and this summon dies. Walk-enter does **not** detonate (Ingress). Relocate landing does **not** detonate (Drift Post). Start-of-turn does **not** detonate (Wake / Gaunt Sill / Poise Sill / Tally Sill / Score Sill / Stave Sill / Sestet Sill / Septet Sill). Distinct from Sestet Post (#1132, leftover sum === 6 **and unequal**), Stave Post (#1063, leftover sum === 5), Score Post (#1011, leftover sum === 4 **and unequal**), Tally Post (#953, leftover sum === 3), Poise Post (#890, leftover AP === leftover MP ≥ 1), Gaunt Post (#849, leftover **both 0**), Lean Post (leftover **AP = 0** only), Dummy Post (taunt), Drift Post (**relocate landing**), Dwell Mark (**end-turn occupy, any leftover**). The decision: end the turn on (4,3) and eat 10, or spend a pool, or dump to 4/2 and eat Sestet Post, or dump to 3/3 and eat Poise Post, or dump to 3/2 and eat Stave Post, or dump to 3/1 and eat Score Post, or dump to 3/0 and eat Tally Post, or dump to 0/0 and eat Gaunt Post. Dual Keep 2/2 **hurts Poise Post, not this**. Dual Keep **cannot** hurt this. Walk-safe. Relocate-safe. Start-turn-safe.  
DURATION: lifespan 3 or until detonate  
SCALING: 10 follows damage% if any; otherwise fixed.  
SYNERGIES: Septet Hold so they cannot walk off; Feud Turn **keeps** sum 7 through the end-turn check.  
COUNTERPLAY: Spend a pool before turn end; dump to 4/2; walk off (walk-safe); Coup the post; blink.  
POWER_BUDGET: Standard 3 / CD 3 / 0 upfront. Power is **end-turn occupy on a sum of 7**. Counts as **one** toward the summon cap.  
AI_USAGE: `aiHint: "septet_post_if_foe_will_end_turn_sum_eq_7_on_tile"`. Masons / pawns. Skip if cap is full.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","rook"]`, `levelZoneMin: 1`  
EDGE_CASES: **Summon is observation.** Later detonate / death is not a second observe. Missing keys → do not spawn a Dummy Post. Occupant leftover 4/2 at turn end → no detonate (Sestet Post’s window). Occupant leftover 3/3 at turn end → no detonate (Poise Post’s window). Occupant leftover 3/2 at turn end → no detonate (Stave Post’s window). Occupant leftover 3/1 at turn end → no detonate (Score Post’s window). Occupant leftover 3/0 at turn end → no detonate (Tally Post’s window). Occupant leftover 0/0 at turn end → no detonate (Gaunt Post’s window). Empty tile → no detonate, lifespan ticks. Never parse `"Septet Post"`. Do not mint `spell-septet-burst`. Prefer fizzle-and-detonate if the body is displaced by Swap (body gone → no tile tax).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — empty-kit summon + end-turn leftover-sum gate. Same class as Sestet Post / Stave Post / Score Post / Tally Post / Poise Post / Gaunt Post / Lean Post.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-septet-bounce`

NAME: Septet Bounce  
ROLE: DAMAGE — 12 to primary; bounce 1 to nearest other leftover-AP+MP===7 hostile  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 12 to primary (ungated). `effectParams: {"septetBounceNeedSumEq":true,"septetSumN":7,"septetBounceSearchRadius":4,"septetBounceCount":1}` — search Chebyshev ≤ 4 for the nearest **other** living hostile whose leftover AP + leftover MP **=== 7**; deal 12 to that body too. Primary leftover unconstrained. Distinct from Sestet Bounce (#1132, second body leftover sum === 6 **and unequal**), Stave Bounce (#1063, second body leftover sum === 5), Score Bounce (#1011, second body leftover sum === 4 **and unequal**), Tally Bounce (#953, second body leftover sum === 3), Poise Bounce (#890, second body leftover AP === leftover MP ≥ 1), Gaunt Bounce (#849, second body leftover **both 0**), Parched Bounce (leftover **MP = 0**), Heave Bounce (**force-moved**), Chain Lightning (nearest **any**, 2 bounces). The decision: open on whoever, splash the (4,3) bishop — or wait for two 4/2 bodies and Sestet Bounce. Dual Keep 2/2 is the **wrong** second body. Dual Keep cannot open this. (4,2) is Sestet Bounce, not this. (3,3) is Poise Bounce, not this.  
DURATION: instant  
SCALING: 12 follows damage%.  
SYNERGIES: Feud Turn a second body into Septet before the bounce search; Septet Hold to keep them in-window.  
COUNTERPLAY: Isolate (one Septet body); sit the second body on 4/2 or 3/3 or 3/2 or 3/1 or 3/0 or 0/0.  
POWER_BUDGET: Standard. 12 if no second Septet body; 24 if a second sits on sum 7.  
AI_USAGE: `aiHint: "septet_bounce_if_second_sum_eq_7_hostile_in_r4"`. Queens / bishops. Skip if no second in-window body **and** a Strike would kill the primary; 12 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing bounce keys → 12 only. Primary leftover 4/2 does **not** block the primary hit. Ties: nearest Chebyshev, then lowest id. Do not hit allies. Second body leftover 4/2 is **not** a bounce target (Sestet Bounce). Second body leftover 3/3 is **not** a bounce target (Poise Bounce). Second body leftover 3/2 is **not** a bounce target (Stave Bounce). Second body leftover 3/1 is **not** a bounce target (Score Bounce).  
IMPLEMENTATION_COMPLEXITY: LOW — one search + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-must-septet`

NAME: Must Septet  
ROLE: CONTROL — non-Strike illegal unless leftover AP + leftover MP === 7 **and** the spell spends last AP  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"mustNonStrikeUnlessSumEqAndSpendsLastAp":true,"septetSumN":7,"septetHoldDuration":2}`. For 2 of the **target’s** turns, any non-Strike spell is illegal unless, **before** this (their) spell’s AP is paid, leftover AP + leftover MP **=== 7** **and** `apCost === leftover AP` (the spell spends last leftover AP). Strike / `physical_attack` stays legal. Walk stays legal unless a Septet Hold is also up. Distinct from Must Sestet (#1132, leftover sum === 6 **and unequal** **and** last AP — **pre-spend even unequal sum 6**), Must Stave (#1063, leftover sum === 5 **and** last AP — **pre-spend odd sum 5**), Must Score (#1011, leftover sum === 4 **and unequal** **and** last AP — **pre-spend even unequal sum 4**), Must Tally (#953, leftover sum === 3 **and** last AP — **pre-spend odd sum 3**), Must Poise (#890, leftover AP === leftover MP ≥ 1 **and** last AP — **pre-spend equality**), Must Gaunt / Must Lean / Must Drift / Must Pace / Must Span / Must Step, Rite First (cannot Strike until a spell), Tool Hold (cannot tool until Strike). The decision: they sit on (4,3) with a 4-cost tool as their last packet, or they sit on (3,4) with this 3-cost as their last packet, or they sit on (0,7) with walk MP and **no** leftover AP — Must Septet **blocks** every non-Strike from (0,7) because leftover AP is 0 (cannot spend last AP). (7,0) spending a 7-cost last packet **is** legal and dumps them to (0,0) Gaunt. Dual Keep 2/2 is Must Poise’s window, **not** this. Dual Keep cannot open this. (4,2) is Must Sestet, not this. (3,3) is Must Poise, not this.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Septet Hold on (0,7) so they can neither walk nor non-Strike; Feud Turn (0,7)→(7,0) so a 7-cost last packet becomes legal. Do **not** CORE with a Strike-only septet lock (none shipped).  
COUNTERPLAY: Strike; blink; wait 2 turns; dump to 4/2; Feud Turn / Tempo Invert yourself if you own it.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **last-packet from a sum of 7**, not a silence.  
AI_USAGE: `aiHint: "must_septet_if_target_leftover_sum_eq_7_and_has_a_last_packet_spell"`. Knights / pawns ELITE. Skip if leftover sum ≠ 7. Do not arm if the only remaining legal verb is Strike and a walk would kill.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 2`  
EDGE_CASES: **Pre-spend leftover** (see §3.5). Missing keys → no lock. Leftover (4,2) → non-Strike still illegal under **this** lock (sum 6, Must Sestet’s window). Leftover (3,3) → non-Strike still illegal under **this** lock (tied, Must Poise’s window). Leftover (3,2) → non-Strike still illegal under **this** lock (sum 5, Must Stave’s window). Leftover (3,1) → non-Strike still illegal under **this** lock (sum 4, Must Score’s window). Leftover (3,0) → non-Strike still illegal under **this** lock (sum 3, Must Tally’s window). Leftover (0,0) → non-Strike illegal (Must Gaunt’s window, but this lock does not lift there). 0-AP tools (Timestep) are not “spending last AP”. The shared key `mustNonStrikeUnlessSumEqAndSpendsLastAp` is **not** a name table: `septetSumN` distinguishes this row from Must Sestet / Must Stave / Must Score.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — pre-spend leftover sum + last-AP compare in the cast gate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-verse-septet`

NAME: Verse Septet  
ROLE: CONTROL — last resolved id illegal until leftover AP + leftover MP === 7  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"verseSeptetUntilSumEq":true,"septetSumN":7}`. The target’s **last resolved spell id** (the id they most recently spent AP on) cannot be recast until leftover AP + leftover MP **=== 7**. Strike is not a spell id for this key. If they have no last resolved id, fizzle rider (AP spent). Distinct from Verse Sestet (#1132, lifts at leftover sum === 6 **and unequal**), Verse Stave (#1063, lifts at leftover sum === 5), Verse Score (#1011, lifts at leftover sum === 4 **and unequal**), Verse Tally (#953, lifts at leftover sum === 3), Verse Poise (#890, lifts at leftover AP === leftover MP ≥ 1), Verse Gaunt (#849, lifts at leftover **both 0**), Verse Lean / Verse Pace / Verse Tax, Once Verse / Stolen Verse / Summon Verse (#906, pets pay +1 AP to **recast** last id; the id stays legal), Last Mute / Hex of Silence. The decision: lock their Inferno until they sit on (4,3) — sitting on 4/2 **does not** lift (Verse Sestet’s window); sitting on 3/3 **does not** lift (Verse Poise’s window); sitting on 3/2 **does not** lift (Verse Stave’s window); sitting on 3/1 **does not** lift (Verse Score’s window); sitting on 3/0 **does not** lift (Verse Tally’s window); sitting on 0/0 **does not** lift (Verse Gaunt’s window); sitting on 1/1 **does not** lift (Prime Gift); sitting on 6/0 **does not** lift (Verse Sestet / Gait Gift). Instant lift if they already sit on sum 7 at resolve (fizzle rider — do not arm a lock that is already lifted). Dual Keep 2/2 does **not** lift this. Dual Keep **cannot** lift this.  
DURATION: until leftover sum === 7, or battle end  
SCALING: none.  
SYNERGIES: Cadence Quarte so the locked id is also remaining 0 (they can recast it **this** turn if they also sit in-window); Septet Hold so they cannot walk into a new leftover split.  
COUNTERPLAY: Sit on (7,0) / (0,7) / (6,1) / (1,6) / (5,2) / (2,5) / (4,3) / (3,4); recast a different id; wait. Dual Keep 2/2 does **not** lift this. Haste into (4,3) **does**. Dumping to 4/2 **does not**.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **which leftover window lifts the last verse**, not a silence.  
AI_USAGE: `aiHint: "verse_septet_if_target_last_id_is_their_win_condition"`. Hex / bishops. Skip if they have no last resolved id, or if they already sit on sum 7 (instant lift — fizzle rider).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing keys → no lock. Verse Septet does **not** lift at leftover 0/0 (Verse Gaunt), leftover 2/2 (Verse Poise), leftover 3/3 (Verse Poise), leftover 3/0 (Verse Tally), leftover 3/1 (Verse Score), leftover 3/2 (Verse Stave), leftover 4/2 (Verse Sestet), leftover 6/0 (Verse Sestet / Gait Gift), or leftover 1/1 (Prime Gift). Summon Verse (#906) is a recast tax, not a legality lock — do not merge the keys.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — last-id lock + leftover-sum lift.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-quarte`

NAME: Court Quarte  
ROLE: SUPPORT — Cadence Quarte on **every other** body (init order)  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `effectParams: {"quarteRemainingCdsEq4To0":true,"courtQuarteExcludeCaster":true}`. In initiative order, every living combatant **except the caster** has remaining `n===4` rewritten to `0` (zeros stay 0; `n===1`, `n===2`, `n===3`, and `n>4` unchanged), same rewrite as Cadence Quarte. Distinct from Court Tierce (#1132, mass Tierce `n===3` → `0`), Court Dock (#1063, mass Dock `n===2` → `0`), Court Snuff (#1011, mass Snuff `n===1` → `0`), Court Prime (#953, mass Prime `n===0` → `1`), Court Floor (#890, mass Floor `n>1` → `1`, zeros stay 0), Court Lag (#849, mass Lag `n>0` → `n+2`), Court Imprint (mass Imprint), Court Dual / Court Keep / Court Stretch / Court Hinge / Court Shove / Court Fold, Cadence Quarte (one body), Cadence Flush (all → 0, ally), Cadence Swap (two-body map exchange), Cadence Quad (one body `n>4→4`), Cadence Tern (one body `n>3→3`), Cadence Cap (one body `n>2→2`). Player never owns this. Witness without grant.  
DURATION: instant rewrite  
SCALING: none.  
SYNERGIES: Kit with Cadence Quarte on the caster’s own target after, or Tierce a remaining `n===3` after the board’s remaining-4 tools are already sitting at 0. Do **not** CORE with Court Tierce / Court Dock / Court Snuff / Court Prime / Court Floor / Cadence Quad / Cadence Tern / Cadence Cap.  
COUNTERPLAY: Recast before Court Quarte; Cadence Break your own remaining after; Floor your remaining 4 to 1 before the mass quarte; Quad does **not** save you (fours stay 4, then this writes 0); Tern peels 4 to 3 (then this does **not** write 0 — Tierce’s problem); kill the regent.  
POWER_BUDGET: Signature 6 / CD 4 / 0 damage. Power is **board-wide remaining-4 unlock**. Kit-only.  
AI_USAGE: `aiHint: "court_quarte_if_two_plus_foes_have_a_remaining_4_nuke"`. Kit-only regent. Skip if every other remaining is already ≠ 4.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. `NOT_PLAYER_LEARNABLE`. `court_quarte_regent` kit-only. Arm is observation for witness-only kits. Never written to owned ids.  
EDGE_CASES: Missing `courtQuarteExcludeCaster` → do not quarte the caster (fail closed, still observe). Do not write `spellLevelValues`. Do not mint `spell-court-four` / `spell-court-quad`. Preview must list who quarte. Do not reuse `courtTierceExcludeCaster` / `courtDockExcludeCaster` / `courtSnuffExcludeCaster` / `courtPrimeExcludeCaster` / `courtFloorExcludeCaster`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — init-order walk + Cadence Quarte rewrite. Same class as Court Tierce / Court Dock / Court Snuff / Court Prime / Court Floor / Court Lag.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-court-quarte
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
effectParams: {"quarteRemainingCdsEq4To0":true,"courtQuarteExcludeCaster":true}
```

---

## 6. Combination matrix (statuses × leftover × terrain)

| Window | Tools |
| :--- | :--- |
| Leftover AP + leftover MP **=== 7** on an **ally** | Septet Mend (both bodies), Septet Step, Septet Lend (**exits** to 9), Feud Turn (**keeps** the sum on the caster when it was already in-window; hostile independently inverted) |
| Same window on a **hostile** | Septet Sting, Septet Sill (their turn start), Septet Hold (cannot walk), Septet Sip (**manufactures Sestet** from most steals, **Poise** from (4,3)→(3,3)), Septet Post (their turn end), Septet Bounce (second body), Must Septet (self, pre-spend), Verse Septet (lifts here), Feud Turn (hostile invert) |
| Same window on **self** | Septet Hood, Must Septet, Feud Turn (caster invert) |
| Leftover AP + leftover MP **=== 6 AND unequal** | **Not this pass.** Sestet\*. Septet keys fail `septetSumN === 7`. |
| Leftover AP + leftover MP **=== 5** | **Not this pass.** Stave\*. Septet keys fail `septetSumN === 7`. Stave Lend **manufactures Septet**. |
| Leftover AP + leftover MP **=== 4 AND unequal** | **Not this pass.** Score\*. Septet keys fail `septetSumN === 7`. Score Lend **manufactures Sestet**, not Septet. |
| Leftover AP + leftover MP **=== 3** | **Not this pass.** Tally\*. Septet keys fail `septetSumN === 7`. |
| Leftover AP === leftover MP **and leftover AP ≥ 1** | **Not this pass.** Poise\* / Equal Gift / Prime Gift (1/1). Septet keys fail `septetSumN` at every tie (max even sum in this family of ties is 6 at (3,3)). |
| Leftover AP = 0 **and** leftover MP = 0 | **Not this pass.** Gaunt / Hollow Gift / Bare Sip / Verse Gaunt. Septet keys fail (sum 0). |
| Leftover AP ≥ 2 **and** leftover MP = 0 (one body) | **Not this pass.** Gait Gift (#1082). (7,0) is Gait Gift **and** a Septet pair; Septet Mend still needs **both** bodies. |
| Leftover AP ≥ 2 **and** leftover MP ≥ 1 (one body) | **Not this pass.** Wide Gift (#1143). (6,1) (5,2) (4,3) are Wide Gift **and** Septet pairs; Septet Mend still needs **both** bodies. |
| Dual Keep / Purse Keep / Stride Keep surviving **2/2** | **Opens** every Poise gate. **Blocks** every Septet gate (sum 4 ≠ 7) **and** every Sestet gate (sum 4 ≠ 6) **and** every Stave gate (sum 4 ≠ 5) **and** every Score gate (`scoreForbidEqual`) **and** every Tally gate (sum 4 ≠ 3) **and** every Gaunt gate. Dual Keep **cannot** manufacture Septet. |
| Dual Keep surviving **2/1** or **1/2** | **Opens** Tally. **Blocks** Septet (sum 3). |
| Dual Keep surviving **2/0** or **0/2** | Sum 2. **Blocks** Septet / Sestet / Stave / Score / Tally / Poise / Gaunt. Spend nothing; Dual Keep cannot reach 7. |
| Haste / Tempo Gift / Timestep into (4,3) after a 3-AP spend from a 7-AP / 3-MP bar | **Opens** Septet. The intended bank. A 6 AP / 3 MP bar that pays 3 AP lands at **(3,3)** and **fails** Septet (Poise). A 7 AP / 2 MP bar that pays 3 AP lands at **(4,2)** and **fails** Septet (Sestet). |
| Stave Lend on a sum-5 body | **Manufactures Septet** ((3,2)→(4,3)). Intended hop. |
| Remaining CD `n===4` on a hostile | Cadence Quarte / Court Quarte (ready-unlock of fours). Tierce does **not** write 0 on fours. Dock does **not** write 0 on fours. Snuff does **not** write 0 on fours. Quad does **not** write 0 on fours (leaves 4). Tern peels 4 to **3**, not 0. Cap peels 4 to **2**, not 0. Floor peels 4 to **1**, not 0. |
| Axis-aligned 2×7 free | Tetradeca Span occupies all fourteen. Dec Span would have painted a 2×5 (10). Dodeca Span would have painted a 3×4 (12). Trideca Span would have painted plus arm 3 (13). |
| Caster leftover pair + one hostile leftover pair (caster participates) | Feud Turn inverts AP↔MP on **each**. Psalm Turn stays mixed-side with caster unchanged. Hymn Turn stays two allies. Duel Turn stays two hostiles. Tempo Invert stays one-body ally/self. Bar Cross moves leftover **across caster and one target**. Purse Turn stays one hostile, caster unchanged. |

Dual Keep leftover that survives turn start **never** opens Septet. Spend Haste / Tempo Gift / a natural 7-AP / 3-MP bar, or Stave Lend into (4,3), to enter the window.

Septet Sip on (5,2) → (4,2) is the **intended** Sestet manufacture. Septet Sip on (4,3) → (3,3) is the **intended** Poise manufacture (the odd-sum exception Sestet Sip did not have). Sestet Sip on (4,2) → (3,2) is the **intended** Stave manufacture. Stave Sip on (3,2) → (2,2) is the **intended** Poise manufacture. Stave Sip on (4,1) → (3,1) is the **intended** Score manufacture. Score Sip on (3,1) → (2,1) is the **intended** Tally manufacture. Tally Sip on (2,1) → (1,1) is the **intended** Poise manufacture. Do not name-wire any hop; they fall out of the leftover writes.

Stave Lend on (3,2) → (4,3) is the **intended** Septet manufacture. Septet Lend on (4,3) → (5,4) **exits** Septet into sum 9. Sestet Lend on (4,2) → (5,3) **exits** Sestet into sum 8, **not** Septet. Score Lend on (3,1) → (4,2) **manufactures Sestet**, not Septet.

---

## 7. Implementation order (not this pass)

1. Discovery ownership split (`SDE-2026-08-31-001`) — without it every Wave-19 id forced into `starterSpells` becomes always-owned.
2. Leftover AP / leftover MP writers (HUD pools after each spend). Dual Keep / Purse Keep / Stride Keep must write surviving leftover at turn start **and keep the cap-2 rule** (Septet depends on Dual Keep **not** reaching 7).
3. Cadence remaining-CD maps (already required by Waves 5–18). Cadence Floor (#906) is remaining `n>1` → `1`. Cadence Prime (#953) is remaining `n===0` → `1`. Cadence Rise (#962) is remaining `n===1` → `2`. Cadence Snuff (#1011) is remaining `n===1` → `0`. Cadence Cap (#1017) is remaining `n>2` → `2`. Cadence Dock (#1063) is remaining `n===2` → `0`. Cadence Tern (#1082) is remaining `n>3` → `3`. Cadence Tierce (#1132) is remaining `n===3` → `0`. Cadence Quad (#1143) is remaining `n>4` → `4`. Cadence Quarte is remaining `n===4` → `0`.
4. Occupy-weight **before** Tetradeca Span (cap 2 cannot host weight 14). Trideca Span (weight 13) / Dodeca Span (weight 12) / Hendeca Span (weight 11) / Dec Span (weight 10) / Nine Span (weight 9) / Oct Span (weight 8) have the same prerequisite.
5. Confirm gates for Must Septet (pre-spend) / Septet Hold / Verse Septet / Feud Turn.
6. Axis-aligned 2×7 multi-cell occupy (`tetradecaspan`) and empty-kit mine (`septetpost`).
7. Do **not** land `spell-parched-mend`. Do **not** land a second `spell-cadence-floor` / `spell-cadence-prime` / `spell-cadence-rise` / `spell-cadence-snuff` / `spell-cadence-cap` / `spell-cadence-dock` / `spell-cadence-tern` / `spell-cadence-tierce` / `spell-cadence-quad`. Do **not** reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp` / `invertTwoAlliesLeftoverApMp` / `invertMixedSidesLeftoverApMp` / `floorRemainingCdsTo1` / `primeRemainingCdsFrom0` / `snuffRemainingCdsEq1To0` / `capRemainingCdsAbove2To2` / `dockRemainingCdsEq2To0` / `capRemainingCdsAbove3To3` / `tierceRemainingCdsEq3To0` / `tallySumN` / `scoreSumN` / `staveSumN` / `sestetSumN` / `scoreForbidEqual` / `sestetForbidEqual`.

Do not implement production code in this pass.

---

## 8. QA (design-level)

| ID | Check |
| :--- | :--- |
| W19-1 | No Wave-19 id appears in `spellData.ts` / `SPELL_ID_CATALOG` / §1.4 tombstone |
| W19-2 | `spell-parched-mend` is **not** shipped; Dry Gait owns leftover-MP=0 heal |
| W19-3 | `spell-septet-mend` requires leftover AP + leftover MP **=== 7** on **both** bodies. (4,2) fails. (3,3) fails. (3,2) fails. (3,1) fails. Sestet Mend owns **sum === 6 AND unequal**. Stave Mend owns **sum === 5**. Score Mend owns **sum === 4 AND unequal**. Tally Mend owns **sum === 3**. Poise Mend / Equal Gift own **equality ≥ 1**. Prime Gift owns **exactly 1/1**. Gait Gift owns **one-body AP ≥ 2 AND MP = 0**. Wide Gift owns **one-body AP ≥ 2 AND MP ≥ 1**. Hollow Gift / Gaunt Mend own **0 + 0**. Lean Gift owns AP=0 and MP≥1 |
| W19-4 | Cadence Quarte is remaining `n===4` → `0`; `n===1`, `n===2`, `n===3`, and `n>4` unchanged; zeros stay 0. Does **not** clone Cadence Tierce (`3→0`) / Dock (`2→0`) / Snuff (`1→0`) / Quad (`n>4→4`) / Tern (`n>3→3`) / Cap (`n>2→2`) / Rise (`1→2`) / Prime (`0→1`) / Floor / Swap / Lag / Halve / Crack / Flush |
| W19-5 | Tetradeca Span is axis-aligned 2×7, counts as **fourteen**, every cell occupied, click is **nearest cell to caster**. Trideca Span stays plus arm 3 thirteen, click = center. Dodeca Span stays 3×4 twelve, click = nearest cell to caster. Hendeca Span stays stretched plus eleven, click = center. Dec Span stays 2×5 ten. Nine Span stays solid nine. Oct Span stays hollow eight. Sept Span stays stretched plus seven. Penta Span stays plus arm 1 five |
| W19-6 | Feud Turn is caster + one hostile independent leftover AP↔MP (caster participates). Does **not** clone Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, or Psalm Turn. Does **not** reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp` / `invertTwoAlliesLeftoverApMp` / `invertMixedSidesLeftoverApMp`. Does **not** alias Choir Hymn |
| W19-7 | Septet Hood does **not** retag `even_gallery` / Dual Plate / Prime Plate / Thin Plate / Spent Plate / Gait Plate / Dry Plate / Poise Hood / Tally Hood / Score Hood / Stave Hood / Sestet Hood |
| W19-8 | Septet Sting bonus is leftover AP + leftover MP === 7, not Sestet Sting’s sum 6 unequal, not Stave Sting’s sum 5, not Score Sting’s sum 4 unequal, not Tally Sting’s sum 3, not Poise Sting’s equality, not Gaunt Sting’s both-0, not Even Sting’s even AP, not Capped Sting’s leftover MP = max, not Wide Sting, not Tied Gait’s (2,2) |
| W19-9 | Septet Sip on (5,2) writes (4,2) **Sestet**. Septet Sip on (4,3) writes (3,3) **Poise**. Sestet Sip on (4,2) writes (3,2) **Stave**. Stave Sip on (3,2) writes (2,2) **Poise**. Stave Sip on (4,1) writes (3,1) **Score**. Score Sip on (3,1) writes (2,1) **Tally**. Tally Sip on (2,1) writes (1,1) **Poise**. Bare Sip stays leftover MP = 0. Poise Sip stays equality ≥ 1 |
| W19-10 | Must Septet is **not** in the same CORE as a Strike-only septet lock (none shipped). Reads leftover **before** debit. Dual Keep 2/2 is Must Poise, not Must Septet. Dual Keep cannot open Must Septet. (4,2) is Must Sestet. (3,3) is Must Poise |
| W19-11 | Court Quarte is `NOT_PLAYER_LEARNABLE`; `court_quarte_regent` is kit-only |
| W19-12 | Extra doors `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent` do not restamp #808 / #836 / #849 / #837 / #890 / #903 / #906 / #951 / #953 / #962 / #1004 / #1011 / #1017 / #1063 / #1080 / #1082 / #1132 / #1139 / #1143 |
| W19-13 | `mpCost` is 0 on every Wave-19 row |
| W19-14 | `summonAI` values are `"tetradecaspan"` / `"septetpost"` enums, never parsed names |
| W19-15 | Tetradeca Span does not ship against `ENEMY_SUMMON_CAP === 2` without occupy-weight |
| W19-16 | Verse Septet does **not** lift at leftover 0/0 (Verse Gaunt), leftover 2/2 (Verse Poise), leftover 3/3 (Verse Poise), leftover 3/0 (Verse Tally), leftover 3/1 (Verse Score), leftover 3/2 (Verse Stave), leftover 4/2 (Verse Sestet), leftover 6/0 (Verse Sestet / Gait Gift), or leftover 1/1 (Prime Gift) |
| W19-17 | No second `spell-cadence-floor` / `spell-cadence-prime` / `spell-cadence-rise` / `spell-cadence-snuff` / `spell-cadence-cap` / `spell-cadence-dock` / `spell-cadence-tern` / `spell-cadence-tierce` / `spell-cadence-quad`. SDE #906 owns Floor. #953 owns Prime. #962 owns Rise. #1011 owns Snuff. #1017 owns Cap. #1063 owns Dock. #1082 owns Tern. #1132 owns Tierce. #1143 owns Quad |
| W19-18 | Legal Septet pairs are only (7,0) (0,7) (6,1) (1,6) (5,2) (2,5) (4,3) (3,4). (4,2) is Sestet. (3,3) is Poise. (3,2) is Stave. (3,1) is Score. (3,0) is Tally. (2,2) is Poise. (1,1) is Prime Gift. Dual Keep cannot manufacture any Septet pair. A 6 AP / 3 MP bar that pays 3 AP lands at (3,3) and **fails** Septet. A 7 AP / 2 MP bar that pays 3 AP lands at (4,2) and **fails** Septet |
| W19-19 | Stave Lend (3,2)→(4,3) **manufactures Septet**. Septet Lend (4,3)→(5,4) **exits** Septet. Sestet Lend (4,2)→(5,3) **exits** Sestet into sum 8, **not** Septet. Score Lend (3,1)→(4,2) **manufactures Sestet**, not Septet. Do not name-wire any hop |
| W19-20 | `spell-sept-span` (occupy-weight 7) is **not** aliased to Septet Mend. `spell-hepta-oath` (Chebyshev = 7) is **not** aliased to Septet Hood. `spell-nona-oath` (Chebyshev = 9) is **not** aliased to Tetradeca Span |

---

## 9. Out of scope

- Production TypeScript / Motoko / bindgen / PocketIC.
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / **#903** / **#951** / **#1004** / **#1080** / **#1139** own extra doors).
- Restamping any door in §3.4.
- A fourth `mpCost > 0` walk snipe; Hex of Silence; About Hinge; mid-RAF splice; sixth echo; leftover-sum **=== 3** (Tally); leftover-sum **=== 4 including 2/2** (that is Poise); leftover-sum **=== 4 AND unequal** (Score); leftover-sum **=== 5** (Stave); leftover-sum **=== 6 AND unequal** (Sestet); remaining `n===0` → `1` (Prime); remaining `n===1` → `2` (Rise); remaining `n===1` → `0` (Snuff); remaining `n===2` → `0` (Dock); remaining `n===3` → `0` (Tierce); remaining `n>1` → `1` (Floor); remaining `n>2` → `2` (Cap); remaining `n>3` → `3` (Tern); remaining `n>4` → `4` (Quad); fourteen-cell occupy aliases; target-only sum===3 / sum===4 / sum===5 / sum===6 / sum===7 heal; leftover **diff** window; two-hostile invert (Duel Turn); two-ally invert (Hymn Turn); mixed-side invert excluding caster (Psalm Turn); one-body invert (Tempo Invert / Purse Turn).
- Cloning Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Shadow Veil, Mirror / Reflect, Lens / Overcast, Short Sight / Paper Wind, Tempo Gift / Loan Tempo, Goad / Taunt Oath, Rime Tile / Rime Sheet, File Lance, Blood Tithe, Hex of Silence, Dry Mend, Dry Gait, Parched Mend, Hollow Gift, Cadence Swap, Cadence Floor, Cadence Prime, Cadence Rise, Cadence Snuff, Cadence Cap, Cadence Dock, Cadence Tern, Cadence Tierce, Cadence Quad, Gaunt Mend, Poise Mend, Equal Gift, Tally Mend, Score Mend, Stave Mend, Sestet Mend, Lean Gift, Prime Gift, Gait Gift, Wide Gift, Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, Psalm Turn, Choir Hymn, Sept Span.
- Putting unique #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 ids in this catalog.

---

## 10. Catalog index

| SPELL_ID | NAME | ROLE | ACQUISITION | AP | CD | Door |
| :--- | :--- | :--- | :--- | ---: | ---: | :--- |
| `spell-septet-mend` | Septet Mend | SUPPORT | MULTI_SOURCE | 3 | 2 | `septet_cantor` |
| `spell-cadence-quarte` | Cadence Quarte | CONTROL | MULTI_SOURCE | 3 | 2 | `quarte_precentor` |
| `spell-tetradeca-span` | Tetradeca Span | SUMMONS | MULTI_SOURCE | 4 | 3 | `span_tetradeca` |
| `spell-feud-turn` | Feud Turn | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-septet-hood` | Septet Hood | DEFENSE | ELITE | 2 | 2 | (piece observe) |
| `spell-septet-sting` | Septet Sting | DAMAGE | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-septet-step` | Septet Step | POSITION | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-septet-sill` | Septet Sill | TERRAIN | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-septet-hold` | Septet Hold | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-septet-lend` | Septet Lend | SUPPORT | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-septet-sip` | Septet Sip | CONTROL | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-septet-post` | Septet Post | SUMMONS | ENEMY_DISCOVERY | 3 | 3 | (piece observe) |
| `spell-septet-bounce` | Septet Bounce | DAMAGE | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-must-septet` | Must Septet | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-verse-septet` | Verse Septet | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-court-quarte` | Court Quarte | SUPPORT | NOT_PLAYER_LEARNABLE | 6 | 4 | `court_quarte_regent` (kit) |

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
| AP-only cast debit | `src/frontend/src/components/WorldExploration.tsx` | 17096–17207 |
| Enemy kits (owned ids) | `src/frontend/src/engine/enemyAI.ts` | 163–185 |
| Healer inference | `src/frontend/src/engine/enemyAI.ts` | 447–452 |
| `ENEMY_SUMMON_CAP` | `src/frontend/src/data/gameConstants.ts` | 300 |
| Backend six | `src/backend/lib/admin.mo` | 168–191 |
| Feats | `src/backend/lib/admin.mo` | 309–326 |
| Challenges | `src/frontend/src/utils/challengeCompletion.ts` | 44–103 |
| Boss ids | `src/frontend/src/types/bossTypes.ts` | 390–410 |

**Document status:** PROPOSED. Safe to review and implement in a later, explicit data PR. Not a license to land combat code in the same change as this spec. Coordinate with **#1143** so Wide Gift / Cadence Quad / Thin Plate / Hook Stride land once. Coordinate with **#1132** so Sestet Mend / Cadence Tierce / Trideca Span / Psalm Turn land once as Wave-19 family CORE. This catalog stamps as Wave **20** family CORE.

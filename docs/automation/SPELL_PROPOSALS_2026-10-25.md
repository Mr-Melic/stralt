# Spell and Tactical Mechanics — Design Pass 2026-10-25

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1 law [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) through still-open Wave 16 [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-6033/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-24.md) (**#1017**). Same-day Wave 17 SDE **has not opened a PR at authoring**.
- Spell, Discovery & Achievement Admin — still-open ACTION_ID-only PRs (no unique spell ids).
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) … still-open Wave 16 [`SPELL_PROPOSALS_2026-10-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-64cc/docs/automation/SPELL_PROPOSALS_2026-10-24.md) (**#1011**)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); extra doors through #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / **#951** (Wave 16 bosses) / **#1004** (Wave 17 bosses: `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`); tactical extras #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / **#1011**

This is **Wave 17** of the tactical catalog. Live HEAD is unchanged since Waves 4–16. Wave 16 (#1011) filled both-body leftover AP + leftover MP **=== 4 AND unequal** heal (Score Mend), remaining `n===1` → `0` (Cadence Snuff), stretched-plus occupy (Hendeca Span, counts as eleven), two-hostile leftover invert (Duel Turn), and a Score family plus Court Snuff.

**Wave 16 explicitly deferred eleven holes.** Discovery Wave 16 (#1017) already claimed leftover **exactly 1/1** heal (Prime Gift), remaining `n>2` → `2` (Cadence Cap), and leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** plate (Dual Plate). **SDE keeps those.** This pass fills the remaining leftovers Wave 16 left for Wave 17, plus a two-ally invert that does **not** clone Tempo Invert, Purse Turn, Bar Cross, or Duel Turn:

| Wave-16 leftover | Owner after #1017 / #1011 | This pass |
| :--- | :--- | :--- |
| Leftover AP + leftover MP === **5** | Still open. Tally owns **sum === 3**. Score owns **sum === 4 AND unequal**. Poise / Equal Gift own **equality ≥ 1**. Gaunt / Hollow Gift own **0+0**. Prime Gift (#1017) owns **exactly 1/1**. Dual Keep max surviving leftover is **2/2** (sum 4) — it **cannot** manufacture sum 5. Wave 16’s directed-diff `AP − MP === 2` **collides with Score at (3,1)**; excluding sum 4 from that diff is a sum-family in disguise. The discrete next leftover-sum is **5** (odd, always unequal). | **This pass:** Stave Mend — **caster and target** leftover AP + leftover MP **=== 5**. Legal pairs **(5,0) (0,5) (4,1) (1,4) (3,2) (2,3)**. |
| Remaining `2` → `0` | Still open. Snuff (#1011) writes `n===1` → `0`. Rise (#962) pads `n===1` → `2`. Prime (#953) locks `n===0` → `1`. Floor (#906) compresses `n>1` → `1`. Cap (#1017) compresses `n>2` → `2` (**twos stay 2**). | **This pass:** Cadence Dock (remaining `n===2` → `0`; zeros stay 0; `n===1` and `n>2` unchanged) |
| Twelve-cell occupy | Still open. Hendeca Span is eleven (stretched plus). Dec Span is ten (2×5). Nine Span is solid nine. | **This pass:** Dodeca Span (axis-aligned **3×4**, counts as **twelve**; click = cell of the 3×4 closest to the caster, Dec rule) |
| Invert leftover on **two allies** (caster stays) | Still open. Duel Turn is **two hostiles**. Purse Turn is **one** hostile. Tempo Invert is **one-body ally/self**. Bar Cross is two-body **cross** (caster AP ↔ target MP **and** caster MP ↔ target AP). | **This pass:** Hymn Turn — invert leftover AP↔MP on **two** player-side bodies that are **not** the caster; caster pools unchanged |
| Target-only sum===5 heal | **Held for SDE.** Prime Gift is **exactly 1/1**, **not** this hole. | **Not this pass.** Do not mint `spell-stave-gift` / `spell-quint-gift` |
| Target-only sum===4 heal | **Still SDE leftover.** Score Mend is both-body. Lean Gift is AP=0 and MP≥1. | **Not this pass.** Do not mint `spell-score-gift` |
| Target-only sum===3 heal | **Still SDE leftover.** Tally Mend is both-body. Lean Gift did not take it. | **Not this pass.** Do not mint `spell-tally-gift` |
| Leftover AP − leftover MP === 2 (diff window) | Still open **and colliding**. (3,1) is Score. (4,2) is Stave (sum 5). | **Not this pass** (Wave 18). Do not mint a `spell-skew-*` family |
| Mid-RAF splice | Held (AGENTS.md) | Still held |
| Fourth `mpCost > 0` walk snipe | Held (Ley Toll / Undertow / Sanguine Toll) | Still held |
| Sixth echo id | Held | Still held |
| Player-owned Hex of Silence | Held (`BOSS_ONLY`) | Still held |
| Player-owned About Hinge | Held (`BOSS_ONLY` on #590) | Still held. Hostile 180° around a pair midpoint is still Pawn Trade. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after the reserved set **and** after #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

Same-day Discovery Wave 17 **has not opened a PR at authoring**. **If that catalog later claims a unique leftover below, SDE wins** the unique §11 id; this catalog must not clone it. Do **not** clone #747 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 unique ids. Do **not** ship `spell-parched-mend` / `spell-cadence-floor` (second copy) / `spell-cadence-rise` / `spell-cadence-prime` / `spell-cadence-snuff` (second copy) / `spell-cadence-cap` (second copy) / `spell-tally-gift` / `spell-score-gift` / `spell-stave-gift` / `spell-prime-gift` (second copy). Stamp family / observe metadata onto Wave-17 **tactical** ids only. #1017 §0.2 already stamps #1011 as Wave **17** family CORE. **This catalog stamps as Wave 18 family CORE.**

Do **not** mint `spell-quint-mend` / `spell-five-mend` / `spell-sum-five` / `spell-stave-gift` / `spell-both-stave` / `spell-hand-mend` (Stave Mend owns both-body sum===5 heal; odd sum never ties), `spell-cadence-deuce` / `spell-cadence-two` / `spell-cadence-pair` / `spell-cadence-dual` / `spell-cadence-clip` / `spell-cd-dock` / `spell-cadence-nix` (Cadence Dock owns remaining `2` → `0`; Snuff owns `1` → `0`; Cap owns `n>2` → `2`; Floor owns `n>1` → `1`), `spell-twelve-span` / `spell-dodec-span` / `spell-box-span` / `spell-grid-span` / `spell-dozen-span` (Dodeca Span owns twelve; Wave 7 tombstoned `spell-once-verse` as an echo, not this occupy), `spell-choir-turn` / `spell-pew-turn` / `spell-nave-turn` / `spell-ally-turn` / `spell-twin-ally` / `spell-pair-ally` (Hymn Turn owns two-ally independent invert, caster stays; Choir Hymn is a Wave-1 Discovery heal, **not** this invert), `spell-court-two` / `spell-court-deuce` / `spell-court-pair` / `spell-court-nix` (Court Dock is the mass signature), or `spell-stave-plate` / `spell-sum-five-hood` (Stave Hood owns sum===5 any-range miss; do **not** retag `even_gallery` / Dual Plate / Spent Plate / Gait Plate / Score Hood / Tally Hood / Poise Hood).

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is unchanged since 2026-08-31. Discovery is still inert. WX is **19,213** lines (`wc -l`). Same HEAD as Waves 4–16. `WorldExploration.tsx` lives at `src/frontend/src/components/WorldExploration.tsx` (not `engine/`).

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

Live `ENEMY_SUMMON_CAP` is still **2** (`gameConstants.ts` 300). Quad Span (#636) counts as four, Penta Span (#695) as five, Six Span (#787) as six, Sept Span (#726) as seven, Oct Span (#849) as eight, Nine Span (#890) as nine, Dec Span (#953) as ten, Hendeca Span (#1011) as eleven on paper; all eight are implementation-blocked until that cap (or a dedicated occupy-weight) exists. Dodeca Span is the same class: **propose the hole, do not pretend it can ship against cap 2**.

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
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** (tests only) | Unused | Shoulder Bash, Hook Line. Stave Step / Hymn Turn relocate leftover **pools**, not tiles. Hymn Turn is **not** `isSwap`. |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768 → WX `swapPositions` 9389) | Swap | Pawn Trade / Ward Interpose / Cadence Dock is **not** `isSwap` (cooldown remaining, not tiles) |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, never this set |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire |
| Walk / leftover / force flags | Paper `walkMpSpentThisTurn` (Waves 6–10). Paper `forcedMovedThisTurn` (Wave 9). Leftover AP/MP die at turn end unless Dual Keep / Purse Keep / Stride Keep | Haste grants **now**; Timestep is full **now** | **This pass: Stave Mend / Stave Hold / Stave\* / Must Stave / Verse Stave / Hymn Turn / Court Dock** |
| Twelve-cell occupy | Twin=2 … Hendeca=11 stretched plus | Absent | **This pass: Dodeca Span** (axis-aligned 3×4 = 12) |
| Remaining CD rewrite | Theft **steals**; Imprint **copies**; Swap (#837) **exchanges full maps**; Rest skips **own** tick; Halve **÷2**; Grace skips **starting** the next own CD; Stall **+1**; Lag **+2**; Floor (#906) `n>1` → `1`; Prime (#953) `n===0` → `1`; Rise (#962) `n===1` → `2`; Snuff (#1011) `n===1` → `0`; Cap (#1017) `n>2` → `2` | Inferno CD 3 is the only live lock | **This pass: Cadence Dock (remaining n===2 → 0; n===1 and n>2 unchanged)** |
| Leftover sum (AP + MP === N) | Tally family is **sum === 3**. Score family is **sum === 4 AND unequal**. Poise family is **equality ≥ 1**. Gaunt family is **both leftover 0**. Equal Gift is **target equality ≥ 1**. Prime Gift is **exactly 1/1**. Tied Gait is both leftover **exactly 2**. Dual Plate is leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**. | Unused live | **This pass: Stave\* (sum === 5; odd, always unequal)** |
| One-body leftover AP↔MP | Tempo Invert (`invertApMp`, ally/self). Purse Turn (hostile one-body). Bar Cross (two-body **cross**). Duel Turn (two hostiles, independent invert, caster stays). | Absent live | **This pass: Hymn Turn (two allies, independent invert, caster stays).** Do not reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp`. |

### 1.4 Reserved id tombstone (do not collide)

**Wave 1 tactical:**  
`spell-shoulder-bash`, `spell-hook-line`, `spell-mist-step`, `spell-grave-bell`, `spell-root-snare`, `spell-lens-shift`, `spell-ward-plate`, `spell-pain-link`, `spell-cleanse-rite`, `spell-cinder-tile`, `spell-tripwire`, `spell-glyph-tax`, `spell-stone-turret`, `spell-turret-shard`, `spell-blood-familiar`, `spell-ricochet-mark`, `spell-void-anchor`.

**Discovery Wave 1:**  
`spell-quiet-hex`, `spell-chain-ward`, `spell-crosswind`, `spell-glass-shot`, `spell-ember-wake`, `spell-split-mark`, `spell-phase-slip`, `spell-sever-tether`, `spell-overcast`, `spell-second-wind`, `spell-choir-hymn`, `spell-oath-bind`, `spell-leech-tempo`, `spell-null-brand`, `spell-false-retreat`, `spell-blood-benediction`, `spell-ward-interpose`, `spell-martyr-fuse`, `spell-hex-of-silence`. Formal blink id remains `spell-phase-slip` (never add `spell-phase-step`).

**Boss adaptations (`BOSS_AND_SPELL_DISCOVERY.md` §5.2):**  
`spell-ember-step`, `spell-caltrop`, `spell-shock-glyph`, `spell-exsanguinate`, `spell-glyph-snare`, `spell-vault`, `spell-brood-ward`, `spell-aftershock`, `spell-rot-brand`, `spell-echo-cast`.

**Wave 2 tactical:**  
`spell-file-lance`, `spell-fuse-tile`, `spell-coup-de-grace`, `spell-ignite-stacks`, `spell-short-sight`, `spell-tempo-gift`, `spell-absolve`, `spell-cross-cut`, `spell-rime-tile`, `spell-smoke-veil`, `spell-sinkhole`, `spell-leash-hook`, `spell-bastion-pylon`, `spell-blood-tithe`, `spell-goad`, `spell-life-tether`.

**Discovery Wave 2:**  
`spell-load-bearing`, `spell-void-glyph`, `spell-paper-wind`, `spell-rear-cut`, `spell-hold-ground`, `spell-rime-sheet`, `spell-hex-theft`, `spell-still-brand`, `spell-grounded-lock`, `spell-loan-tempo`, `spell-dispel-thread`, `spell-taunt-oath`, `spell-convert-whelp`, `spell-last-ember`, `spell-search-dust`, `spell-fog-hood`, `spell-claim-ward`, `spell-self-anchor`, `spell-pack-howl`, `spell-reliquary-lock`.

**Wave 3 tactical:**  
`spell-ley-toll`, `spell-fan-bolt`, `spell-pawn-trade`, `spell-back-step`, `spell-twin-gate`, `spell-sidestep-ward`, `spell-far-sting`, `spell-soul-sip`, `spell-open-pit`, `spell-mercy-font`, `spell-font-pulse`, `spell-lens-share`, `spell-stride-brand`, `spell-hex-toll`, `spell-slide-tile`, `spell-rank-lock`, `spell-board-tilt`.

**Discovery Wave 3:**  
`spell-undertow`, `spell-mire-sheet`, `spell-borrowed-eye`, `spell-summon-bane`, `spell-planted-stance`, `spell-file-slide`, `spell-tempo-invert`, `spell-debt-mark`, `spell-knight-pierce`, `spell-split-pace`, `spell-last-ward`, `spell-kennel-lock`, `spell-far-watch`, `spell-mercy-hex`, `spell-bloodless-plate`, `spell-crimson-pact`, `spell-gate-sight`, `spell-pack-tempo`, `spell-sovereign-fold`.

**Wave 4 tactical (#342 — still open; never re-propose):**  
`spell-gale-fan`, `spell-twin-guard`, `spell-cut-in`, `spell-after-verse`, `spell-sanguine-toll`, `spell-cross-flank`, `spell-bias-ray`, `spell-draw-together`, `spell-ap-sip`, `spell-body-check`, `spell-cast-snare`, `spell-bait-pylon`, `spell-bait-eat`, `spell-morrow-step`, `spell-surplus-ward`, `spell-sated-fang`, `spell-eclipse-fold`.

**Discovery Wave 4 (#371 — still open; never re-propose):**  
`spell-triune-gate`, `spell-stolen-verse`, `spell-relay-dash`, `spell-camp-tax`, `spell-rooted-sight`, `spell-haze-pane`, `spell-waste-pace`, `spell-bitter-cup`, `spell-keep-kennel`, `spell-momentum-cut`, `spell-misstep`, `spell-ward-cell`, `spell-nail-down`, `spell-spent-stride`, `spell-wounded-lens`, `spell-pit-sight`, `spell-second-shadow`, `spell-false-echo`, `spell-repel-ring`.

**Wave 5 tactical (#411 — still open; never re-propose):**  
`spell-oncoming`, `spell-facing-pin`, `spell-glance-cut`, `spell-mute-thread`, `spell-stride-mute`, `spell-queue-cut`, `spell-false-cut`, `spell-file-vault`, `spell-span-guard`, `spell-span-pylon`, `spell-cadence-theft`, `spell-cadence-brand`, `spell-cover-step`, `spell-low-lintel`, `spell-act-tax`, `spell-act-bell`.

**Memory-reserved Discovery Wave 5 (no PR; never re-propose):**  
`spell-gaze-sill`, `spell-close-debt`, `spell-near-veil`, `spell-soft-step`, `spell-twice-mark`, `spell-rebound-ward`, `spell-cull-kennel`, `spell-whelp-sill`, `spell-ash-sill`, `spell-spent-lens`, `spell-wait-fang`, `spell-share-gaze`, `spell-body-glass`, `spell-last-stride`, `spell-post-hex`, `spell-turn-sill`, `spell-pack-cover`, `spell-false-gaze`, `spell-void-span`.

**Wave 6 tactical (#463 — still open; never re-propose):**  
`spell-post-sting`, `spell-purse-cut`, `spell-blind-corner`, `spell-hinge-step`, `spell-file-reel`, `spell-twin-span`, `spell-oath-blade`, `spell-aim-veil`, `spell-cadence-break`, `spell-cadence-lend`, `spell-split-purse`, `spell-exit-tithe`, `spell-hinge-tile`, `spell-spark-whelp`, `spell-turn-cap`, `spell-about-face`.

**Discovery Wave 6 (#480 — still open; never re-propose):**  
`spell-choir-verse`, `spell-bias-step`, `spell-wick-bite`, `spell-empty-purse`, `spell-crowd-tax`, `spell-pet-swap`, `spell-corner-lens`, `spell-face-away`, `spell-dull-edge`, `spell-pet-sill`, `spell-late-purse`, `spell-pet-share`, `spell-short-leash`, `spell-axis-veil`, `spell-safe-fall`, `spell-bare-lens`, `spell-gap-ward`, `spell-pack-ledger`, `spell-court-fold`.

**Wave 7 tactical (#525 — still open; never re-propose):**  
`spell-wall-sting`, `spell-file-brand`, `spell-boot-sting`, `spell-shove-face`, `spell-knight-slip`, `spell-pivot-foe`, `spell-triple-span`, `spell-cadence-crack`, `spell-must-pace`, `spell-once-verse`, `spell-tick-hood`, `spell-flank-share`, `spell-spare-pace`, `spell-pit-wick`, `spell-exit-boon`, `spell-court-shove`.

**Discovery Wave 7 (#533 — still open; never re-propose):**  
`spell-even-stride`, `spell-strike-hold`, `spell-ground-oath`, `spell-walk-toll`, `spell-purse-lock`, `spell-ally-reel`, `spell-echo-paint`, `spell-blink-seal`, `spell-gift-sill`, `spell-split-fang`, `spell-wall-bite`, `spell-cast-mark`, `spell-still-leash`, `spell-pet-verse`, `spell-ghost-step`, `spell-thin-ward`, `spell-clean-blood`, `spell-pack-still`, `spell-file-fold`.

**Wave 8 tactical (#563 — still open; never re-propose):**  
`spell-gait-mend`, `spell-pair-hinge`, `spell-cadence-flush`, `spell-lone-sting`, `spell-morrow-plate`, `spell-gait-seal`, `spell-diag-lock`, `spell-brick-shift`, `spell-mend-wick`, `spell-return-sting`, `spell-leftover-lend`, `spell-dummy-post`, `spell-enter-mend`, `spell-body-mark`, `spell-split-mend`, `spell-court-hinge`.

**Discovery Wave 8 (#590 — still open; never re-propose):**  
`spell-odd-stride`, `spell-cast-hold`, `spell-unit-oath`, `spell-step-rebate`, `spell-foe-reel`, `spell-echo-wipe`, `spell-field-bite`, `spell-wound-mark`, `spell-split-plate`, `spell-verse-first`, `spell-pit-skip`, `spell-empty-plate`, `spell-kennel-sill`, `spell-chase-mend`, `spell-cadence-stall`, `spell-crown-cut`, `spell-full-bar`, `spell-pack-tithe`, `spell-about-hinge`.

**Wave 9 tactical (#636 — still open; never re-propose):**  
`spell-shove-mend`, `spell-cadence-stretch`, `spell-quad-span`, `spell-gait-wick`, `spell-dry-sting`, `spell-home-step`, `spell-must-span`, `spell-far-hood`, `spell-boot-lend`, `spell-quiet-sill`, `spell-exit-sting`, `spell-purse-keep`, `spell-tick-plate`, `spell-last-mute`, `spell-pair-slide`, `spell-court-stretch`.

**Discovery Wave 9 (#646 — still open; never re-propose):**  
`spell-pair-stride`, `spell-boot-hold`, `spell-near-oath`, `spell-paint-reel`, `spell-nook-bite`, `spell-stride-mark`, `spell-foe-plate`, `spell-lava-skip`, `spell-still-plate`, `spell-body-sill`, `spell-clash-mend`, `spell-cadence-shave`, `spell-gait-tax`, `spell-brick-wipe`, `spell-watch-mute`, `spell-full-purse`, `spell-pet-cut`, `spell-pack-stride`, `spell-knight-fold`.

**Discovery Wave 10 (#679 — still open; never re-propose / never clone):**  
`spell-inch-stride`, `spell-rite-first`, `spell-long-oath`, `spell-cinder-reel`, `spell-side-bite`, `spell-ingress-mark`, `spell-off-plate`, `spell-spike-skip`, `spell-tapped-plate`, `spell-summon-brace`, `spell-bar-mend`, `spell-cadence-pin`, `spell-still-tax`, `spell-brick-sprout`, `spell-watch-fee`, `spell-lone-purse`, `spell-banner-cut`, `spell-pack-close`, `spell-mid-fold`.

**Wave 10 tactical (#695 — still open; never re-propose):**  
`spell-both-mend`, `spell-stride-keep`, `spell-penta-span`, `spell-cadence-trim`, `spell-near-hood`, `spell-gait-sip`, `spell-cast-sill`, `spell-shove-sting`, `spell-must-step`, `spell-ally-step`, `spell-damp-sting`, `spell-pair-pace`, `spell-verse-tax`, `spell-tool-hold`, `spell-spent-lend`, `spell-court-keep`.

**Wave 11 tactical (#726 — still open; never re-propose):**  
`spell-heave-mend`, `spell-dual-keep`, `spell-sept-span`, `spell-cadence-halve`, `spell-mid-hood`, `spell-ready-sting`, `spell-heave-step`, `spell-drift-sill`, `spell-drift-hold`, `spell-drift-lend`, `spell-drift-sip`, `spell-drift-post`, `spell-heave-bounce`, `spell-must-drift`, `spell-verse-pace`, `spell-court-dual`.

**Discovery Wave 11 (#747 — still open; never re-propose / never clone):**  
`spell-diag-stride`, `spell-mid-oath`, `spell-void-reel`, `spell-foe-bite`, `spell-dwell-mark`, `spell-own-plate`, `spell-cinder-skip`, `spell-full-plate`, `spell-summon-toll`, `spell-still-mend`, `spell-cadence-rest`, `spell-spent-tax`, `spell-brick-crack`, `spell-watch-lend`, `spell-pair-purse`, `spell-escort-cut`, `spell-dry-mend`, `spell-pack-long`, `spell-adj-fold`.

**Wave 12 tactical (#787 — still open; never re-propose / never clone).** Unique remaining ids stamp as Wave-13 family CORE. **Do not ship** `spell-parched-mend` (Dry Gait owns that hole):  
`spell-parched-mend` (**dropped**), `spell-cadence-imprint`, `spell-six-span`, `spell-odd-hood`, `spell-lean-sting`, `spell-parched-step`, `spell-parched-sill`, `spell-dry-hold`, `spell-lean-lend`, `spell-parched-sip`, `spell-lean-post`, `spell-parched-bounce`, `spell-must-lean`, `spell-verse-lean`, `spell-lean-hold`, `spell-court-imprint`.

**Discovery Wave 12 (#802 — still open; never re-propose / never clone; Wave-14 family CORE):**  
`spell-orth-stride`, `spell-tri-oath`, `spell-brick-reel`, `spell-lone-bite`, `spell-wake-mark`, `spell-gait-plate`, `spell-glyph-skip`, `spell-full-gait`, `spell-summon-gait`, `spell-still-gift`, `spell-cadence-grace`, `spell-cast-debt`, `spell-brick-orbit`, `spell-watch-alms`, `spell-pair-gait`, `spell-leash-cut`, `spell-dry-gait`, `spell-pack-cap`, `spell-reach-fold`.

**Discovery Wave 13 (#837 — still open; never re-propose / never clone):**  
`spell-knight-stride`, `spell-quad-oath`, `spell-pit-reel`, `spell-axis-bite`, `spell-shove-mark`, `spell-spent-plate`, `spell-rime-skip`, `spell-full-sting`, `spell-summon-cast`, `spell-hollow-gift`, `spell-cadence-swap`, `spell-strike-debt`, `spell-brick-nudge`, `spell-watch-sip`, `spell-lone-gait`, `spell-hazard-cut`, `spell-drift-gift`, `spell-pack-file`, `spell-diag-fold`.

**Wave 13 tactical (#849 — still open; never re-propose / never clone):**  
`spell-gaunt-mend`, `spell-cadence-lag`, `spell-oct-span`, `spell-even-hood`, `spell-gaunt-sting`, `spell-gaunt-step`, `spell-gaunt-sill`, `spell-odd-hold`, `spell-gaunt-lend`, `spell-bare-sip`, `spell-gaunt-post`, `spell-gaunt-bounce`, `spell-must-gaunt`, `spell-verse-gaunt`, `spell-gaunt-hold`, `spell-court-lag`.

**Wave 14 tactical (#890 — still open; never re-propose / never clone).** Unique remaining ids stamp as Wave-15 family CORE. **Do not ship a second** `spell-cadence-floor` (**#906 SDE wins** that id and hole):  
`spell-poise-mend`, `spell-cadence-floor` (**SDE unique §11 owns this id**), `spell-nine-span`, `spell-bar-cross`, `spell-poise-hood`, `spell-poise-sting`, `spell-poise-step`, `spell-poise-sill`, `spell-poise-hold`, `spell-poise-lend`, `spell-poise-sip`, `spell-poise-post`, `spell-poise-bounce`, `spell-must-poise`, `spell-verse-poise`, `spell-court-floor`.

**Discovery Wave 14 (#906 — still open; never re-propose / never clone; SDE wins Cadence Floor):**  
`spell-rank-stride`, `spell-penta-oath`, `spell-spike-reel`, `spell-screen-bite`, `spell-swap-mark`, `spell-odd-plate`, `spell-mire-skip`, `spell-odd-sting`, `spell-summon-verse`, `spell-equal-gift`, `spell-cadence-floor`, `spell-cast-toll`, `spell-brick-step`, `spell-watch-bank`, `spell-tied-gait`, `spell-portal-cut`, `spell-shove-gift`, `spell-pack-rank`, `spell-rank-fold`.

**Wave 15 tactical (#953 — still open; never re-propose / never clone).** Unique remaining ids stamp as Wave-16 family CORE:  
`spell-tally-mend`, `spell-cadence-prime`, `spell-dec-span`, `spell-purse-turn`, `spell-tally-hood`, `spell-tally-sting`, `spell-tally-step`, `spell-tally-sill`, `spell-tally-hold`, `spell-tally-lend`, `spell-tally-sip`, `spell-tally-post`, `spell-tally-bounce`, `spell-must-tally`, `spell-verse-tally`, `spell-court-prime`.

**Discovery Wave 15 (#962 — still open; never re-propose / never clone; Cadence Rise owns remaining `1` → `2`):**  
`spell-file-stride`, `spell-hexa-oath`, `spell-lava-reel`, `spell-file-bite`, `spell-strike-mark`, `spell-dry-plate`, `spell-shock-skip`, `spell-even-sting`, `spell-summon-rank`, `spell-lean-gift`, `spell-cadence-rise`, `spell-still-toll`, `spell-brick-brace`, `spell-watch-root`, `spell-odd-gait`, `spell-spike-cut`, `spell-summon-plate`, `spell-pack-diag`, `spell-far-fold`.

**Wave 16 tactical (#1011 — still open; never re-propose / never clone).** Unique remaining ids stamp as Wave-17 family CORE:  
`spell-score-mend`, `spell-cadence-snuff`, `spell-hendeca-span`, `spell-duel-turn`, `spell-score-hood`, `spell-score-sting`, `spell-score-step`, `spell-score-sill`, `spell-score-hold`, `spell-score-lend`, `spell-score-sip`, `spell-score-post`, `spell-score-bounce`, `spell-must-score`, `spell-verse-score`, `spell-court-snuff`.

**Discovery Wave 16 (#1017 — still open; never re-propose / never clone; SDE wins Prime Gift / Cadence Cap / Dual Plate):**  
`spell-ring-stride`, `spell-hepta-oath`, `spell-rime-reel`, `spell-rank-bite`, `spell-last-mark`, `spell-dual-plate`, `spell-rift-skip`, `spell-fresh-sting`, `spell-summon-file`, `spell-prime-gift`, `spell-cadence-cap`, `spell-gait-toll`, `spell-brick-hold`, `spell-watch-drain`, `spell-even-gait`, `spell-rime-cut`, `spell-cast-plate`, `spell-pack-orth`, `spell-leap-fold`.

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` and `spell-blood-tithe` (tactical W2 vs Discovery W2). `spell-cadence-floor` (tactical #890 vs Discovery #906 — **SDE wins**; this pass does not add a third).

**Fantasy overlaps to not clone:** Short Sight ≈ Paper Wind; Tempo Gift ≈ Loan Tempo; Goad ≈ Taunt Oath; Rime Tile ≈ Rime Sheet; Lens Shift / Overcast; Poise Mend ≈ Equal Gift (both-body vs target equality); Tally Mend ≈ Lean Gift (sum===3 vs AP=0-and-MP≥1); Score Mend ≈ Prime Gift (both-body sum 4 unequal vs exactly 1/1); Cadence Floor / Prime / Rise / Snuff / Cap are **filled**; Tempo Invert ≈ Purse Turn (ally vs hostile invert — **filled**); Purse Turn ≈ Duel Turn (one hostile vs two hostiles — **filled**); Duel Turn ≈ Hymn Turn (two hostiles vs two allies — **this pass fills the two-ally side, does not clone the two-hostile card**). Hymn Turn is **not** Choir Hymn.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier; Dry Mend / Dry Gait / Parched Mend; Hollow Gift / Gaunt Mend; Cadence Swap / Cadence Floor / Cadence Prime / Cadence Rise / Cadence Snuff / Cadence Cap.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved or live) |
| :--- | :--- | :--- |
| SUPPORT leftover-sum heal | Both-body leftover AP + leftover MP **=== 5** | Tally Mend (sum 3); Score Mend (sum 4 unequal); Poise Mend / Equal Gift (equality); Gaunt / Hollow Gift (0+0); Dry Mend / Dry Gait; Lean Gift; Prime Gift (exactly 1/1) |
| CONTROL remaining 2→0 | Ready-pair ids (`n===2`) write `0` | Snuff `1→0`; Rise `1→2`; Prime `0→1`; Floor `n>1→1`; Cap `n>2→2`; Stall/Lag pad; Flush/Crack →0 |
| SUMMONS twelve-cell occupy | Axis-aligned 3×4, counts as twelve | Twin…Hendeca Span |
| CONTROL two-ally invert | Leftover AP↔MP on **two** allies; caster stays | Tempo Invert (ally/self); Purse Turn (one hostile); Bar Cross (two-body cross); Duel Turn (two hostiles) |
| DEFENSE / DAMAGE / TERRAIN stave family | Hood / Sting / Step / Sill / Hold / Lend / Sip / Post / Bounce / Must / Verse | Score\* / Tally\* / Poise\* / Gaunt\* / Lean\* / Dry\* |
| SIGNATURE mass Dock | Court Dock | Court Snuff / Court Prime / Court Floor / Court Lag / Court Imprint |

**Still open after this wave (do not fill today):** mid-RAF splice; fourth walk-MP snipe; sixth echo id; player-owned Hex of Silence; player-owned About Hinge; leftover AP − leftover MP === **2** (diff window; (3,1) is Score; (4,2) is Stave); remaining `n===3` → `0`; thirteen-cell occupy; **target-only** sum===5 heal (leave for SDE); **target-only** sum===4 / sum===3 heal (still SDE leftovers); leftover AP + leftover MP === **6**; invert leftover on **one ally and one hostile** (caster stays). Those stay Wave 18 so this pass stays discrete.

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
9. `inferArchetype` still treats any `healAmount > 0` as healer (`enemyAI.ts` 447–452). Stave Mend **must not** land in non-healer CORE; keep `healAmount: 0` on the row.

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 17 ids to `starterSpells` as base. Do **not** land Wave-17 data before Wave-1 ownership split (`SDE-2026-08-31-001`). CDA-030 (#982) still freezes **shipping** Wave-15/16 live rows until those gates exist; this document is sequential Wave 17 **design only**.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "dodecaspan"` / `"stavepost"` are **string enums on the config**, not a parse of `"Dodeca Span"` / `"Stave Post"`.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Dodeca Span / Stave Post **arming** (body placed, AP spent) **is** observation. A later occupy / detonate is **not** a second observe.
- Cadence Dock **resolve** (even if every remaining was already ≠ 2) **is** observation if AP was spent.
- Do not require “see it N times”. Wave 17 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.
- Do not stamp `survivor` (Last Ember / Last Ward). #646 / #679 / #747 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 left that feat leftover on purpose.

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

**Every live feat and every live challenge id is already a sole spell door or a MULTI child.** Wave 17 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 17 does **not** invent a 16th feat.

**Live 19 first-wins are all taken (do not restamp as the only door):**  
`starborn_queen` (Cut In), `pale_archivist` (After Verse), `starved_vampire_pawn` (Sanguine Toll), `lord_of_static` (Draw Together), `final_pawn` (Eclipse Fold), `mirror_sovereign` (Echo Cast), `crimson_countess` (Crimson Pact), `void_grandmaster` (Twin Gate), `midnight_bishop` (Life Tether), `chessboard_lich` (Claim Ward), `twin_monarchs` (Choir Hymn), `alabaster_fortress` (Pain Link / Aftershock), `bone_cavalier` (Vault / Caltrop), `pale_archbishop` (Reliquary / Glyph Snare extras), `fetid_rook` (Rot Brand), `broodmother_rook` (Brood Ward), `weeping_pawn` (Mute Thread, #411), `eternal_pawn_king` (Queue Cut, #411), `enthroned_void` (File Vault MULTI child, #411). `second_lament` remains kit-only False Cut.

**Wave-5…17 boss extra doors — do not restamp:** `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`, `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`, `mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`, `gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`, `toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`, `crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`, `sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`, `infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`, `flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`, `effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`, `jostle_subdeacon`, `peel_friar`, `dilate_organist`, `hood_recluse`, `wick_exorcist`, `dry_nuncio`, `hearth_legate`, `must_preceptor`, `boot_subprior`, `purse_steward`, `tick_infirmarer`, `mute_notary`.

**Wave-6…16 tactical extra doors — do not restamp:** `oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`, `pace_prelate`, `span_triune`, `wick_mason`, `slip_castellan`, `court_usher`, `gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `gaunt_cantor`, `lag_precentor`, `span_oct`, `court_lag_regent`, `poise_cantor`, `floor_precentor`, `span_nine`, `court_floor_regent`, `tally_cantor`, `prime_precentor`, `span_dec`, `court_prime_regent`, `score_cantor`, `snuff_precentor`, `span_hendeca`, `court_snuff_regent`. `parched_cantor` is **not** Dry Gait’s door and **not** Stave Mend’s door. `score_cantor` stays Score Mend. `tally_cantor` stays Tally Mend. `poise_cantor` stays Poise Mend. `gaunt_cantor` stays Gaunt Mend. `snuff_precentor` stays Snuff. `prime_precentor` stays Prime. `floor_precentor` stays Floor (#890 door). SDE teaches Cap via Wave-16 unique pools (`cadence_thief` / `hex_chorister`) — do not restamp `cap_precentor` if #1017 later mints one as a tactical door (Pack Cap already owns `cap_precentor` as `ENEMY_ONLY`).

**Wave-8…16 SDE extras — do not restamp:** `about_hinge_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `pair_gallery`, `knight_fold_regent`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `cap_precentor`, `reach_fold_regent`, `knight_gallery`, `quad_nave`, `pit_aisle`, `shunt_pulpit`, `nudge_nave`, `file_precentor`, `diag_fold_regent`, `rank_fold_regent`, `file_gallery`, `hexa_nave`, `lava_aisle`, `strike_pulpit`, `shock_nave`, `ring_gallery`, `hepta_nave`, `frost_aisle`, `last_pulpit`, `rift_court`, `leap_fold_regent`. Do **not** retag `even_gallery` as Stave Hood. Do **not** consume encounter-catalog `ENC-*` rooms. Do not name unique families `score_mender` / `cadence_snuffer` / `hendeca_prelate` / `tally_mender` / `cadence_primer` / `file_warder` / `axis_cutter`.

**New proposed extra doors for the boss designer (Wave 18 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `stave_cantor` first-win | Stave Mend MULTI child (observe+win still grants). `score_cantor` stays Score Mend. `tally_cantor` stays Tally Mend. `poise_cantor` stays Poise Mend. `gaunt_cantor` stays Gaunt Mend. `parched_cantor` stays the dropped Parched Mend slot — **do not reuse**. Equal Gift / Lean Gift / Prime Gift have **no** extra door — do not invent `equal_cantor` / `lean_cantor` / `prime_cantor` / `sum_cantor` / `quint_cantor`. |
| `dock_precentor` first-win | Cadence Dock MULTI child. `snuff_precentor` stays Snuff. `prime_precentor` stays Prime. `floor_precentor` stays Floor. `lag_precentor` stays Lag. `imprint_precentor` stays Imprint. `halve_precentor` stays Halve. `cap_precentor` stays Pack Cap. `file_precentor` stays Pack File (`ENEMY_ONLY`). Do **not** mint `rise_precentor` / `deuce_precentor` / `two_precentor` / `nix_precentor`. |
| `span_dodeca` first-win | Dodeca Span MULTI child. `span_hendeca` stays Hendeca Span. `span_dec` stays Dec Span. `span_nine` stays Nine Span. `span_oct` stays Oct Span. `span_six` stays Six Span. `span_sept` stays Sept Span. `span_penta` stays Penta Span. `span_quad` stays Quad Span. `span_triune` stays Triple Span. Do **not** mint `span_twelve` / `span_box` / `span_grid`. |
| `court_dock_regent` kit only | Court Dock (`NOT_PLAYER_LEARNABLE`). `court_snuff_regent` stays Court Snuff. `court_prime_regent` stays Court Prime. `court_floor_regent` stays Court Floor. `court_lag_regent` stays Court Lag. `court_imprint_regent` stays Court Imprint. `reach_fold_regent` stays Reach Fold. `diag_fold_regent` stays Diag Fold. `rank_fold_regent` stays Rank Fold. `leap_fold_regent` stays Leap Fold. Do **not** mint `court_deuce_regent` / `court_two_regent`. |

Piece-type observe paths (not feat doors): cantors / bishops for Stave Mend; scribes / tempo for Cadence Dock; masons / rooks ELITE for Dodeca Span; hex / queens for Hymn Turn; lurkers / knights for Stave Hood; lurkers / pawns for Stave Sting; porters / queens for Stave Step; masons / rooks for Stave Sill; hex / knights for Stave Hold; buffers / bishops for Stave Lend; hex / pawns for Stave Sip; masons / pawns for Stave Post; queens / bishops for Stave Bounce; knights / pawns for Must Stave; hex / bishops for Verse Stave.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 key names for a different meaning. Do **not** reuse `invertApMp` (Tempo Invert). Do **not** reuse `invertHostileLeftoverApMp` (Purse Turn). Do **not** reuse `crossLeftoverApMpTwoBody` (Bar Cross). Do **not** reuse `invertTwoHostilesLeftoverApMp` (Duel Turn). Do **not** reuse `floorRemainingCdsTo1` (Cadence Floor). Do **not** reuse `primeRemainingCdsFrom0` (Cadence Prime). Do **not** reuse `snuffRemainingCdsEq1To0` (Cadence Snuff). Do **not** reuse `capRemainingCdsAbove2To2` (Cadence Cap). Do **not** reuse `tallySumN` / `scoreSumN` / `scoreForbidEqual`. Do **not** reuse `hendecaSpanCells` / `decSpanCells` / `nineSpanCells` / `nineSpanSolid`. Do **not** reuse `requireLeftoverApEq1AndMpEq1` (Prime Gift).

`mpCost` stays 0 on every Wave-17 row.

**New keys (Wave 17 only):**

```text
requireCasterLeftoverSumEq, requireTargetLeftoverSumEq, staveSumN, staveMendAmount,                 // Stave Mend — AP+MP === 5 on both bodies
dockRemainingCdsEq2To0,                                                                            // Cadence Dock — remaining n===2 → 0; n===1 and n>2 unchanged
dodecaSpanCells, dodecaLong, dodecaShort,                                                          // Dodeca Span — 12; axis-aligned 4×3
invertTwoAlliesLeftoverApMp, invertTwoAlliesSearchRadius, invertTwoAlliesExcludeCaster, invertTwoAlliesForbidSelf,  // Hymn Turn — two allies, independent invert; caster unchanged
staveHoodNextHit,                                                                                  // Stave Hood — next hit while sum===5, any range → 0
staveLeftoverSumEq, staveStingBonus,                                                               // Stave Sting
staveStepNeedSumEq, staveStepAdj,                                                                  // Stave Step — dest Chebyshev 1 of target
staveSillNeedSumEq, staveSillDamage, staveSillDuration,                                            // Stave Sill — start-of-their-turn tax
staveHoldWhileSumEq, staveHoldDuration,                                                            // Stave Hold — 2 of their turns
staveLendAp, staveLendMp, requireTargetSumEqLend,                                                  // Stave Lend — +1 AP and +1 MP iff sum===5 (exits window)
staveSipAp, requireTargetSumEqSip,                                                                 // Stave Sip — steal 1 leftover AP iff sum===5
stavePostDetonateDamage, stavePostNeedSumEq,                                                       // Stave Post — 10 on end-turn occupy if sum===5
staveBounceNeedSumEq, staveBounceSearchRadius, staveBounceCount,                                   // Stave Bounce
mustNonStrikeUnlessSumEqAndSpendsLastAp,                                                           // Must Stave — pre-spend leftover
verseStaveUntilSumEq,                                                                              // Verse Stave
courtDockExcludeCaster                                                                             // Court Dock
```

If a key is missing, the rider does not fire. `staveSumN` is **5** on every Stave\* row that names a sum. Missing `staveSumN` → gate fails closed (do not guess 5 from the name; do not treat (3,1) as Stave; do not treat (2,2) as Stave). There is **no** `staveForbidEqual`: leftover sum 5 is odd, so leftover AP **cannot** equal leftover MP. Do not add a no-op equality flag and then forget it.

Nested kit-only id (not a player card): none new besides Court Dock itself. Stave Post’s detonate is **not** a second spell id (the summon row carries `stavePostDetonateDamage`). Do not mint `spell-stave-burst`.

Leftover AP / leftover MP are **current remaining after this spell’s AP is paid**, read from the same pools the HUD uses — **except Must Stave**, which reads leftover **before** debit (a “spends last AP” gate is otherwise impossible once leftover AP is already 0). Walk spends must write leftover MP. Spell spends must write leftover AP. Missing leftover → the gate fails closed (fizzle rider, AP spent, observe). Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count as leftover for these gates. **Dual Keep caps surviving leftover AP and leftover MP at 2**, so Dual Keep leftover sums to **at most 4**. Dual Keep **cannot** open Stave (sum 5). Sum is integer `leftoverAp + leftoverMp`. Leftover `0 + 0` is **not** a Stave window (sum 0). Leftover `3 + 0` is **not** a Stave window (sum 3, Tally). Leftover `3 + 1` is **not** a Stave window (sum 4, Score). Leftover `2 + 2` is **not** a Stave window (sum 4 **and** a tie, Poise). Leftover `1 + 1` is **not** a Stave window (Prime Gift / Poise). Legal pairs after a successful Stave gate: **(5,0) (0,5) (4,1) (1,4) (3,2) (2,3)** only.

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Cadence Dock’s ready-unlock of remaining-2 is paid in **currently remaining 2**, not in extra AP. Stave Mend’s 8 is paid in **two sum===5 bars on two bodies** (Score Mend is the two-body sum-4-unequal cousin; Tally Mend is the two-body sum-3 cousin; Poise Mend is the two-body equality cousin). Dual Keep cannot fake this window — the player (or Haste / Tempo Gift / a 6+ leftover bar after a 3-AP spend) has to actually sit on five.

Do **not** put Must Stave in the same CORE as a Strike-only stave lock (this pass does not ship that lock). Do **not** CORE Stave Hood with Spent Plate, Gait Plate, Dual Plate, Poise Hood, Tally Hood, or Score Hood. Do **not** CORE Stave Mend with Hollow Gift, Gaunt Mend, Poise Mend, Equal Gift, Tally Mend, Score Mend, Lean Gift, or Prime Gift. Do **not** CORE Hymn Turn with Tempo Invert, Purse Turn, Bar Cross, or Duel Turn. Do **not** CORE Cadence Dock with Cadence Snuff, Rise, Prime, Floor, Cap, Halve, Trim, Crack, or Flush.

---

## 5. Proposed spells (Wave 17)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-stave-mend`

NAME: Stave Mend  
ROLE: SUPPORT — heal if caster **and** target leftover AP + leftover MP **=== 5**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"requireCasterLeftoverSumEq":true,"requireTargetLeftoverSumEq":true,"staveSumN":5,"staveMendAmount":8}`. If **both** caster and target have leftover AP + leftover walk MP **=== 5** at resolve (after this spell’s 3 AP is paid), heal the target 8 through the existing heal helper. If either sum ≠ 5, fizzle rider (AP spent, no HP). Walk / force-move flags do **not** substitute. Distinct from Score Mend (#1011, **both bodies leftover AP + leftover MP === 4 AND leftover AP ≠ leftover MP** — even sum, equality banned), Tally Mend (#953, **both bodies leftover AP + leftover MP === 3** — odd sum, never an equality), Poise Mend (#890, **both bodies leftover AP === leftover MP ≥ 1**), Equal Gift (#906, **target only** leftover AP == leftover MP ≥ 1; caster leftover unread), Prime Gift (#1017, **target leftover AP exactly 1 AND leftover MP exactly 1**), Hollow Gift (#837, **target only** leftover AP=0 **and** leftover MP=0), Gaunt Mend (#849, **both bodies leftover AP=0 and leftover MP=0**), Lean Gift (#962, leftover **AP = 0 and leftover MP ≥ 1**), Dry Mend (#747, both leftover **AP = 0**, MP unconstrained), Dry Gait (#802, both leftover **MP = 0**, AP unconstrained), Ready Sting (leftover AP≥1 **and** MP≥1 with **no sum**), Tied Gait (#906, leftover AP **and** leftover MP **exactly 2**), Dual Plate (#1017, leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**). Legal pairs: (5,0) (0,5) (4,1) (1,4) (3,2) (2,3). The decision: two bodies **sum to 5** — Dual Keep 2/2 is Poise **and** Score-blocked, **not** Stave (sum 4); Dual Keep **cannot** open Stave; spend 1 from 3/3 (Poise, sum 6) to enter Stave (3,2) / (2,3), or sit on 4 leftover AP and 1 leftover MP after paying the heal. `healAmount` stays 0 on the row so `inferArchetype` (`enemyAI.ts` 447–452) does not treat a kit that only *carries* this id as healer; **healer CORE only** when the row is in a live pool.  
DURATION: instant  
SCALING: 8 follows heal% if any; amount otherwise fixed.  
SYNERGIES: Haste / Tempo Gift / Timestep to bank five after the 3-AP spend; Stave Lend **exits** to 7; Hymn Turn **keeps** sum 5 on both allies.  
COUNTERPLAY: Spend a pool so either body leaves 5; Dual Keep (caps at 2, **blocks** Stave); sit on 3/1 (Score) or 2/1 (Tally) or 2/2 (Poise) or 1/1 (Prime Gift).  
POWER_BUDGET: Standard heal, gated on **two** leftover sums of 5 (four leftover reads). Blood Mend is 12 ungated self. Score Mend is 8 on **two sum-4 unequal** bodies. Tally Mend is 8 on **two sum-3** bodies. Dual Keep cannot fake this.  
AI_USAGE: `aiHint: "heal_if_both_bodies_leftover_ap_plus_mp_eq_5"`. Cantors / bishops. Skip if either leftover sum ≠ 5. **Healer CORE only.** Do not dump leftover **only** to enable this if a Strike would kill.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop","queen"], levelZoneMin: 1 }`. MULTI child `stave_cantor`.  
EDGE_CASES: Targeting ally already allows self (`targeting.ts` 184–189). Self-cast requires the caster’s leftover sum === 5 (two keys, two reads of one body). Self-cast at leftover 0/0 **does not** collide with Hollow Gift / Gaunt Mend — sum 0 fails `staveSumN`. Self-cast at leftover 2/2 **does not** collide with Poise Mend / Equal Gift / Tied Gait / Dual Plate — sum 4 fails `staveSumN`. Self-cast at leftover 3/1 **does not** collide with Score Mend — sum 4 fails `staveSumN`. Self-cast at leftover 3/0 **does not** collide with Tally Mend — sum 3 fails `staveSumN`. Self-cast at leftover 1/1 **does not** collide with Prime Gift — sum 2 fails `staveSumN`. Player-side HP actually increased → `challengeHealUsedRef`. Missing keys → no heal. Missing `staveSumN` → fail closed. Do not clone Score Mend / Tally Mend / Poise Mend / Equal Gift / Gaunt Mend / Lean Gift / Prime Gift / Dry Mend / Dry Gait. Target-only sum===5 heal stays Wave 18 / SDE. If same-day SDE Wave 17 claims this leftover, **SDE wins** — keep both-body vs their target-only the way Score vs a future Score Gift / Poise vs Equal Gift already split.  
IMPLEMENTATION_COMPLEXITY: LOW — four leftover reads + existing heal helper.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-stave-mend
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
effectParams: {"requireCasterLeftoverSumEq":true,"requireTargetLeftoverSumEq":true,"staveSumN":5,"staveMendAmount":8}
```

---

### SPELL_ID: `spell-cadence-dock`

NAME: Cadence Dock  
ROLE: CONTROL — remaining CDs `n===2` become `0`  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"dockRemainingCdsEq2To0":true}`. For each spell id in the **target’s** remaining-CD map with `n === 2`, write `0`. Zeros stay 0. Remaining `n===1` **unchanged** (Snuff’s window). Remaining `n>2` **unchanged** (Cap / Floor territory). Target **keeps every spell**. Once/battle flags and spell levels are **not** CDs. Distinct from Cadence Snuff (#1011, remaining `n===1` → `0` — ones, not twos), Cadence Cap (#1017, remaining `n>2` → `2` — **twos stay 2**), Cadence Rise (#962, remaining `n===1` → `2`), Cadence Prime (#953, remaining `n===0` → `1`), Cadence Floor (#906, remaining `n>1` → `1`; **zeros stay 0**; would peel a 2 to 1, **not** to 0), Cadence Swap (#837, **exchange full remaining maps**), Cadence Lag (#849, remaining `n>0` → `n+2`), Cadence Stall (#590, remaining `n>0` → `n+1`; zeros stay 0), Cadence Stretch (#636, remaining ×2), Cadence Theft (#411, **steals** remaining), Cadence Imprint (#787, **copies** onto the caster; target keeps), Cadence Rest (#747, **own** remaining do not tick), Cadence Grace (#802, **next own spell does not start** its cooldown), Cadence Halve (#726, **÷2** on the hostile), Cadence Trim / Shave / Pin / Crack / Flush. The decision: their Inferno is sitting on remaining 2 — Dock makes it legal **this turn**; Snuff would have needed remaining 1; Cap would have **left** a 2; Floor would have written 1.  
DURATION: instant rewrite of remaining `n===2`  
SCALING: none.  
SYNERGIES: Cap a 5 to 2, **then** Dock the 2 to 0 on a **later** turn (do **not** CORE Cap with Dock). Verse Stave so the unlocked id is also their last verse.  
COUNTERPLAY: Sit remaining at 1 (Snuff’s problem) or at 3+ (Cap / Floor’s problem); recast before Dock; Cadence Break your own remaining.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **unlock remaining-2**, not a silence and not a mass zero.  
AI_USAGE: `aiHint: "dock_remaining_cds_eq_2_to_0"`. Scribes / tempo. Skip if the target has no remaining `n===2`. Do **not** CORE with Snuff / Cap / Floor / Rise / Prime.  
DISCOVERY_ELIGIBILITY: true. MULTI child `dock_precentor`. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing key → no rewrite. Do not write `spellLevelValues`. Do not reset Dual Keep’s once/battle. Preview must show which remaining drop from 2 to 0. All-non-2 remaining → fizzle rider (AP spent, observe). Do **not** reuse `snuffRemainingCdsEq1To0` / `capRemainingCdsAbove2To2` / `floorRemainingCdsTo1` / `primeRemainingCdsFrom0`. If same-day SDE Wave 17 claims this leftover, **SDE wins** — do not keep a second Dock id. Cap already owns `n>2→2`; this card is `2→0` even if SDE later stamps a second Cap alias.  
IMPLEMENTATION_COMPLEXITY: LOW — walk remaining map, write 0 when n===2.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-cadence-dock
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
effectParams: {"dockRemainingCdsEq2To0":true}
```

---

### SPELL_ID: `spell-dodeca-span`

NAME: Dodeca Span  
ROLE: SUMMONS — axis-aligned 3×4 occupy; counts as **twelve**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 4  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "dodecaspan"`, `summonLifespan: 4`, empty kit (`summonUnitDef` with `pieceType: ""` / zero scales — a body, not a caster). `effectParams: {"dodecaSpanCells":12,"dodecaLong":4,"dodecaShort":3}`. Click a free ground tile. That click is the **cell of the 3×4 closest to the caster** (Dec Span’s placement rule, **not** Hendeca’s center click). Facing = 8-dir from **caster to click**. If `|dx| >= |dy|` the **long** axis is x (file): occupy a 4-by-3 axis-aligned rectangle whose nearest cell to the caster is the click, extending **away** from the caster. Else the long axis is y (rank): 4 along y, 3 along x. All 12 cells must be free and in-bounds (`isCellFree`); else fizzle (AP spent). One combatant id, twelve-cell footprint. Every cell of the 12 is occupied (not a cage hole). Counts as **twelve** toward the summon cap. Distinct from Hendeca Span (#1011, stretched plus longArm 3 / shortArm 2 = **11**, click = **center**), Dec Span (#953, axis-aligned **2×5** = 10, same click rule), Nine Span (#890, solid 3×3 = 9, click = center), Oct Span (#849, hollow 3×3 = 8), Sept Span (#726, stretched plus longArm 2 / shortArm 1 = 7), Six Span (2×3 = 6), Penta Span (plus = 5), Quad Span (2×2 = 4), Triple / Twin Span. Empty kit.  
DURATION: lifespan 4 or until the body dies (frees all twelve)  
SCALING: none (occupy, not damage).  
SYNERGIES: Stave Hold so they cannot walk around the wall; Score / Tally / Stave Sill on a cell **beside** the block, not on it (occupied).  
COUNTERPLAY: Coup the body; blink past; File Lance along the long edge; occupy-weight still 2 live so this card **does not ship** until a dedicated occupy-weight exists.  
POWER_BUDGET: Heavy 4 / CD 3 / 0 damage. Power is **twelve occupied cells**. Implementation-blocked while `ENEMY_SUMMON_CAP === 2`.  
AI_USAGE: `aiHint: "dodeca_span_if_3x4_free_and_cuts_a_file"`. Masons / rooks ELITE. Skip if any of the 12 is occupied / off-map / a portal. Missing hint → drop id.  
DISCOVERY_ELIGIBILITY: true. MULTI child `span_dodeca`. `pieceTypes: ["rook"]`, `levelZoneMin: 2`  
EDGE_CASES: **Do not ship while `ENEMY_SUMMON_CAP === 2` without occupy-weight.** Never parse `"Dodeca Span"` / `"Twelve"` / `"Box"`. One id, twelve cells — destroying the body frees all twelve. Player-side Dodeca Span counts toward the **player** summon economy, not `ENEMY_SUMMON_CAP`. Missing `dodecaSpanCells` → do not spawn a 1-cell body and call it Dodeca Span. Missing `dodecaLong` / `dodecaShort` → do not guess 2×5 (that is Dec Span), 3×3 (that is Nine Span), or longArm 3 / shortArm 2 (that is Hendeca Span). Off-map cell → fizzle. Do not mint `spell-twelve-span` / `spell-dodec-span` / `spell-box-span`. Cardinal click with `dx===0 && dy===0` is illegal (`freeCells` / caster tile). Diagonal click uses the `|dx| >= |dy|` tie-break (file-long). Click is **nearest cell**, not center (Hendeca’s center stays Hendeca; 3×4 has no unique center cell).  
IMPLEMENTATION_COMPLEXITY: HIGH — occupy-weight + 3×4 placer. Same class as Dec / Hendeca.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-dodeca-span
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
summonAI: dodecaspan
summonLifespan: 4
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
acquisitionModel: MULTI_SOURCE
discoveryEligible: true
effectParams: {"dodecaSpanCells":12,"dodecaLong":4,"dodecaShort":3}
```

---

### SPELL_ID: `spell-hymn-turn`

NAME: Hymn Turn  
ROLE: CONTROL — invert leftover AP↔MP on **two** allies; caster stays  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: No damage. **Not** `isSwap`. `effectParams: {"invertTwoAlliesLeftoverApMp":true,"invertTwoAlliesSearchRadius":3,"invertTwoAlliesExcludeCaster":true,"invertTwoAlliesForbidSelf":true}`. Target one living **player-side** body that is **not** the caster (ally targeting allows self — this key **rejects** self). Find the nearest **other** living player-side body within Chebyshev `invertTwoAlliesSearchRadius` of **that target** that is also **not** the caster. Snapshot each body’s leftover AP and leftover MP, then write leftover AP ← leftover MP and leftover MP ← leftover AP on **each** body independently, each **capped at that pool’s max**. Caster leftover **unchanged**. Caster does not move. If no second non-caster ally, fizzle (AP spent). Distinct from Duel Turn (#1011, **two hostiles** independent invert via `invertTwoHostilesLeftoverApMp` — **do not reuse that key**), Purse Turn (#953, **one** hostile invert via `invertHostileLeftoverApMp` — **do not reuse that key**), Tempo Invert (#282, **one-body ally/self** leftover AP↔MP via `invertApMp` — **do not reuse that key**), Bar Cross (#890, **two-body leftover cross**: caster AP ↔ target MP **and** caster MP ↔ target AP via `crossLeftoverApMpTwoBody` — **do not reuse that key**), Dual Keep (banks leftover AP **and** MP on **one** body, no invert), Swap / Pawn Trade (tiles, not pools), Choir Hymn (Wave-1 Discovery heal — **do not alias**). Player-side summons **count** as allies.  
DURATION: instant leftover rewrite; no snap-back at turn end  
SCALING: none.  
SYNERGIES: Stave Mend / Stave Sting after the invert **keeps** sum 5; Score Mend after you invert a (4,1) wisp with a (1,4) sentinel (both stay Score **or** both stay Stave depending on the pair); Must Stave after you dump their AP into MP.  
COUNTERPLAY: Isolate (one ally); keep leftover AP === leftover MP on both so both inverts are no-ops; Quiet Hex after they invert into a 3-AP spell; Strike the wisp before they recast.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **two ally leftover flips with the caster’s own bar untouched**, not a swap and not Duel Turn.  
AI_USAGE: `aiHint: "hymn_turn_if_two_non_caster_allies_in_r3_and_at_least_one_unequal"`. Hex / queens. Skip if fewer than two non-caster allies, or if both inverts would be no-ops (both already AP===MP).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing `invertTwoAlliesExcludeCaster` → fail closed (do **not** invert the caster). Missing `invertTwoAlliesForbidSelf` → fail closed (do **not** accept a self-click). Ties: nearest Chebyshev, then lowest id. Invert (3,2)→(2,3) **stays Stave**. Invert (4,1)→(1,4) **stays Stave**. Invert (5,0)→(0,5) **stays Stave**. Invert (3,1)→(1,3) **stays Score**. Invert (2,2) is a no-op (Poise stays Poise). Do **not** reuse `invertTwoHostilesLeftoverApMp`. If same-day SDE Wave 17 claims this leftover, **SDE wins**. Do not mint `spell-choir-turn` / `spell-pew-turn` / `spell-ally-turn`.  
IMPLEMENTATION_COMPLEXITY: LOW — two leftover snapshots + two writes. Same class as Duel Turn with a side filter.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-hymn-turn
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
effectParams: {"invertTwoAlliesLeftoverApMp":true,"invertTwoAlliesSearchRadius":3,"invertTwoAlliesExcludeCaster":true,"invertTwoAlliesForbidSelf":true}
```

---

### SPELL_ID: `spell-stave-hood`

NAME: Stave Hood  
ROLE: DEFENSE — next applied hit is 0 iff leftover AP + leftover MP **=== 5**  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"staveHoodNextHit":true,"staveSumN":5}`. Arm a one-hit consume: the next applied hit on the caster is 0 **if at impact** leftover AP + leftover MP **=== 5**. Any Chebyshev. The charge remains if the hit arrives while the sum ≠ 5 (hit lands fully; charge stays). Distinct from Score Hood (#1011, leftover AP + leftover MP === 4 **and unequal**), Tally Hood (#953, leftover AP + leftover MP === 3), Poise Hood (#890, leftover AP === leftover MP ≥ 1), Dual Plate (#1017, leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** — (2,2) is Dual Plate / Poise, **not** Stave), Spent Plate (#837, leftover **AP ≥ 1**, MP unconstrained), Gait Plate (#802, leftover **MP ≥ 1**, AP unconstrained), Dry Plate (#962, leftover **MP = 0**), Even Hood (#849, **even Chebyshev**), Odd Hood (odd Chebyshev), Near / Mid / Far Hood (range bands), Odd Plate (#906, leftover **AP odd**). The decision: hold (3,2) through the hit — Dual Keep 2/2 is Poise Hood / Dual Plate, **not** this — or spend into 3/1 and Score Hood still works, this does not. Do **not** CORE with Spent Plate, Gait Plate, Dual Plate, Poise Hood, Tally Hood, or Score Hood.  
DURATION: until consumed at a sum===5 impact, or battle end  
SCALING: none (negate, not a RES%).  
SYNERGIES: Haste to bank five; Hymn Turn a (5,0) ally into (0,5) still Stave Hood; Stave Hold so they cannot walk you off 5.  
COUNTERPLAY: Wait until they spend a pool; Coup; hit them on 3/1 (Score Hood’s window, not this).  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **one hit while sitting on five**. Dual Keep cannot fake it.  
AI_USAGE: `aiHint: "stave_hood_if_self_leftover_sum_eq_5"`. Lurkers / knights ELITE. Skip if leftover sum ≠ 5.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Missing `staveSumN` → fail closed. Leftover 2/2 at impact → hit lands (Poise Hood / Dual Plate). Leftover 3/1 at impact → hit lands (Score Hood). Leftover 3/0 at impact → hit lands (Tally Hood). Leftover 1/1 at impact → hit lands (Prime Gift / Poise). Do **not** retag `even_gallery`.  
IMPLEMENTATION_COMPLEXITY: LOW — one leftover-sum gate on the next applied hit.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-stave-sting`

NAME: Stave Sting  
ROLE: DAMAGE — 10, plus 8 if target leftover AP + leftover MP **=== 5**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. Then if the target’s leftover AP + leftover MP **=== 5**, deal `staveStingBonus` (8) as a second existing `dealDamage` call. `effectParams: {"staveLeftoverSumEq":true,"staveSumN":5,"staveStingBonus":8}`. Distinct from Score Sting (#1011, leftover AP + leftover MP === 4 **and unequal**), Tally Sting (#953, leftover AP + leftover MP === 3), Poise Sting (#890, leftover AP === leftover MP ≥ 1), Gaunt Sting (#849, leftover **both 0**), Lean / Dry / Ready / Full / Even Sting (#962, leftover AP **even and ≥ 2** — (2,2) is even AP, which is Poise, not Stave), Fresh Sting (#1017), Odd Sting (#906, leftover **AP odd**), Tied Gait (#906, both leftover **exactly 2**). The decision: poke the (3,2) bishop for 18, or poke anyone for 10. Dual Keep 2/2 is the **wrong** window (Poise Sting). Dual Keep cannot open this.  
DURATION: instant  
SCALING: 10 / 8 follow damage%.  
SYNERGIES: Hymn Turn a (5,0) into (0,5) still Stave; Stave Hold so they cannot walk the MP off.  
COUNTERPLAY: Sit on 3/1 (Score Sting) or 2/2 (Poise Sting) or 2/1 (Tally Sting) or 0/0 (Gaunt Sting).  
POWER_BUDGET: Cheap 2 / CD 1. 10 ungated + 8 on a sum of 5.  
AI_USAGE: `aiHint: "stave_sting_if_target_leftover_sum_eq_5"`. Lurkers / pawns. Skip the bonus path if leftover sum ≠ 5; 10 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing bonus keys → 10 only. Target leftover 3/1 → no bonus (Score Sting). Target leftover 2/2 → no bonus (Poise Sting). Target leftover 3/0 → no bonus (Tally Sting). Do not name-wire the bonus.  
IMPLEMENTATION_COMPLEXITY: LOW — one leftover-sum gate + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-stave-step`

NAME: Stave Step  
ROLE: POSITION — relocate to Chebyshev 1 of an ally whose leftover AP + leftover MP **=== 5**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `freeCells` on the dest. `effectParams: {"staveStepNeedSumEq":true,"staveSumN":5,"staveStepAdj":1}`. Target an ally (not self) whose leftover AP + leftover MP **=== 5**. The caster **relocates** to a free cell at Chebyshev 1 of that ally (player picks the dest among legal neighbors; AI picks the safest). If the ally is not in the window or no neighbor is free, fizzle (AP spent, no move). Distinct from Score Step (#1011, ally leftover sum === 4 **and unequal**), Tally Step (#953, ally leftover sum === 3), Poise Step (#890, ally leftover AP === leftover MP ≥ 1), Gaunt Step (#849, ally leftover **both 0**), Home / Heave / Parched / Ally Step, Hinge Step, Relay Dash. The decision: blink next to the (0,5) wisp — they have walk, you have position — or wait for a 3/1 and Score Step, or a 2/2 and Poise Step. Dual Keep cannot open this.  
DURATION: instant relocate  
SCALING: none.  
SYNERGIES: Stave Sill on a neighbor so they eat 8 at dawn if they stay on 5; Hymn Turn keeps the wisp in-window.  
COUNTERPLAY: Spend the wisp’s pool; occupy every neighbor; Coup.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **blink to a five-bar ally**.  
AI_USAGE: `aiHint: "stave_step_if_ally_leftover_sum_eq_5_and_a_neighbor_is_free"`. Porters / queens. Skip if no in-window ally or no free neighbor.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Self-target forbidden (`staveStep` is not a self blink — that is Mist Step / Phase Slip). Missing keys → no move. Ally leftover 3/1 → fizzle (Score Step). Ally leftover 2/2 → fizzle (Poise Step). Portal dest illegal (`isCellFree`).  
IMPLEMENTATION_COMPLEXITY: LOW — leftover-sum gate + existing relocate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-stave-sill`

NAME: Stave Sill  
ROLE: TERRAIN — start-of-their-turn occupy tax iff leftover AP + leftover MP **=== 5**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell for 2 turns. `effectParams: {"staveSillNeedSumEq":true,"staveSumN":5,"staveSillDamage":8,"staveSillDuration":2}`. At the **start of a combatant’s turn**, if they occupy this cell and leftover AP + leftover MP **=== 5**, deal 8 through `updateCombatant`. Walk-enter does **not** tax (Ingress / Shove Sting). End-turn occupy does **not** tax (Stave Post / Dwell). Relocate landing does **not** tax (Drift Post). Distinct from Score Sill (#1011, leftover sum === 4 **and unequal** at start), Tally Sill (#953, leftover sum === 3 at start), Poise Sill (#890, leftover AP === leftover MP ≥ 1 at start), Gaunt Sill (#849, leftover **both 0** at start), Wake Mark (start-turn any leftover), Quiet / Cast / Drift / Parched Sill. The decision: stand on the sill at (3,2) and eat 8 at dawn, or spend a pool overnight, or sit on 3/1 and eat Score Sill instead, or sit on 2/2 and eat Poise Sill. Dual Keep overnight **cannot** leave them on 5.  
DURATION: 2 turns of paint  
SCALING: 8 follows damage% if any; otherwise fixed.  
SYNERGIES: Stave Hold so they cannot walk off overnight; Hymn Turn keeps sum 5 through dawn.  
COUNTERPLAY: Walk off (start-turn only); spend a pool; blink.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 upfront. Power is **dawn tax on a sum of 5**.  
AI_USAGE: `aiHint: "stave_sill_if_foe_will_start_turn_sum_eq_5_on_tile"`. Masons / rooks. Skip if they will not start on 5.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Paint on a portal → fizzle (`isCellFree`). Occupant leftover 3/1 at dawn → no tax (Score Sill). Occupant leftover 2/2 at dawn → no tax (Poise Sill). Occupant leftover 3/0 at dawn → no tax (Tally Sill). Occupant leftover 0/0 at dawn → no tax (Gaunt Sill).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — painted cell + start-turn leftover-sum gate. Same class as Score Sill / Tally Sill / Poise Sill.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-stave-hold`

NAME: Stave Hold  
ROLE: CONTROL — cannot spend leftover MP to walk while leftover AP + leftover MP **=== 5**  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"staveHoldWhileSumEq":true,"staveSumN":5,"staveHoldDuration":2}`. For 2 of the **target’s** turns, any walk that would spend ≥ 1 leftover MP is illegal **while leftover AP + leftover MP === 5**. Teleport / Swap / Phase Slip / Twin-gate step / Stave Step (caster relocate) do **not** pay walk MP and are legal. Distinct from Score Hold (#1011, cannot walk while leftover sum === 4 **and unequal**), Tally Hold (#953, cannot walk while leftover sum === 3), Poise Hold (#890, cannot walk while leftover AP === leftover MP ≥ 1), Odd Hold (#849, cannot walk while leftover AP is **odd**), Dry Hold (until leftover **AP = 0**), Drift Hold (until **force-moved**), Cast Hold / Strike Hold / Boot Hold / Tool Hold / Gaunt Hold / Brick Hold (#1017). The decision: they have (0,5) and wanted to walk five tiles — they must **leave sum 5** (cast leftover AP from a (4,1) / (3,2) / (5,0), get siphoned, get turned) before walking, or wait 2 turns. At leftover (0,5) they **have** MP but cannot spend it while this lock is up **and** they still sum to 5. Dual Keep 2/2 is Poise Hold, **not** this. Dual Keep cannot open this.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Must Stave on (0,5) so they can neither walk nor non-Strike; Hymn Turn (0,5)→(5,0) so they lose the walk MP into leftover AP.  
COUNTERPLAY: Cast leftover AP to leave 5; blink; wait 2 turns.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **cannot walk while sitting on five**.  
AI_USAGE: `aiHint: "stave_hold_if_target_leftover_sum_eq_5_and_wants_to_walk"`. Hex / knights ELITE. Skip if leftover sum ≠ 5.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Missing keys → no lock. Leftover (3,1) → this lock does **not** block walks (Score Hold’s window). Leftover (2,2) → this lock does **not** block walks (Poise Hold). Leftover (3,0) → this lock does **not** block walks (Tally Hold; leftover MP is 0 anyway).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — leftover-sum gate in the walk spender.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-stave-lend`

NAME: Stave Lend  
ROLE: SUPPORT — +1 leftover AP and +1 leftover MP iff target leftover AP + leftover MP **=== 5** (exits to 7)  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"staveLendAp":1,"staveLendMp":1,"requireTargetSumEqLend":true,"staveSumN":5}`. If the **target** has leftover AP + leftover MP **=== 5**, grant +1 current AP and +1 current MP (capped at max). The sum becomes **7** (the stave window **closes**). Inequality is preserved: (3,2)→(4,3), (4,1)→(5,2), (5,0)→(6,1). This **cannot** manufacture Poise (odd+2 stays odd). This **cannot** manufacture Score (sum 7 ≠ 4) or Tally (sum 7 ≠ 3). If the gate fails, fizzle rider (AP spent, no grant). Distinct from Score Lend (#1011, +1/+1 if leftover sum === 4 **and unequal** — **exits** to 6, stays unequal), Tally Lend (#953, +1/+1 if leftover sum === 3 — **exits** to 5, **which is this family’s window**), Poise Lend (#890, +1/+1 if leftover AP === leftover MP ≥ 1 — the **tie survives**), Gaunt Lend (#849, +1/+1 if leftover **both 0**), Lean / Drift / Spent Lend, Watch Alms, Tempo Gift / Loan Tempo / Haste, Dual Keep. The decision: cash the (3,2) wisp for a 2-resource bump, then they are out of Stave **and** out of Score **and** out of Tally **and** out of Poise (sum 7 is 4/3 or 5/2 or 6/1). **Tally Lend is the intended manufacture of Stave** ((2,1)→(3,2)). Do not name-wire that hop.  
DURATION: instant (current-turn leftover only)  
SCALING: amount fixed.  
SYNERGIES: Tally Lend **into** Stave, then Stave Mend; or Stave Lend **out** of Stave into a 7-bar that Dual Keep cannot cap this turn.  
COUNTERPLAY: Sit off sum 5; sit on 3/1 (Score Lend); sit on 2/2 (Poise Lend).  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **cash five for seven**, not a Haste.  
AI_USAGE: `aiHint: "stave_lend_if_ally_leftover_sum_eq_5"`. Buffers / bishops. Skip if leftover sum ≠ 5.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing keys → no grant. Target leftover 3/1 → fizzle (Score Lend). Target leftover 2/1 → fizzle (Tally Lend). Target leftover 2/2 → fizzle (Poise Lend). Cap at max: if leftover AP is already max, grant MP only — **then the sum may not be 7** and the window-exit is incomplete; fail closed if either grant cannot apply in full (both must land).  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-stave-sip`

NAME: Stave Sip  
ROLE: CONTROL — steal 1 leftover AP iff target leftover AP + leftover MP === 5  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: No HP damage. `effectParams: {"staveSipAp":1,"requireTargetSumEqSip":true,"staveSumN":5}`. If the target leftover AP + leftover MP **=== 5** **and** leftover AP ≥ 1, subtract 1 leftover AP from the target (not below 0) and add 1 leftover AP to the caster this turn, capped at max. If leftover AP is 0 (the (0,5) pair) or the sum ≠ 5, fizzle rider (AP spent). Distinct from Score Sip (#1011, steal 1 leftover AP iff leftover sum === 4 **and unequal** — **manufactures Tally**), Tally Sip (#953, steal 1 leftover AP iff leftover sum === 3 — **manufactures Poise** from (2,1)→(1,1)), Poise Sip (#890, steal 1 leftover AP iff leftover AP === leftover MP ≥ 1), Bare Sip (#849, steal 1 leftover AP iff leftover **MP = 0**), Soul Sip (ungated current MP), Ap Sip (#342). The decision: sip (3,2) → they become (2,2) **Poise**; sip (4,1) → they become (3,1) **Score**; sip (2,3) → they become (1,3) **Score**; sip (5,0) → they become (4,0) **Score**; sip (1,4) → they become (0,4) **Score**. **Sip manufactures Score or Poise.** Dual Keep 2/2 is the **wrong** window (Poise Sip).  
DURATION: instant (current-turn leftover only)  
SCALING: amount fixed.  
SYNERGIES: Score Sting / Score Mend **after** manufacturing 3/1 or 4/0; Poise Sting **after** manufacturing 2/2 from (3,2); Stave Hold so they cannot walk the remaining MP.  
COUNTERPLAY: Sit on (0,5) (no AP to steal); sit off sum 5; sit on 3/1 (Score Sip); sit on 2/2 (Poise Sip); Second Wind after.  
POWER_BUDGET: Cheap control, 0 damage, CD 1.  
AI_USAGE: `aiHint: "stave_sip_if_target_sum_eq_5_and_leftover_ap_ge_1"`. Hex / pawns. Skip if not in the window or leftover AP is 0.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Do not write `debuffStat: "ap"`. Missing keys → no steal. Target leftover 3/1 → fizzle (Score Sip’s window). Target leftover 2/1 → fizzle (Tally Sip’s window). Target leftover 2/2 → fizzle (Poise Sip’s window). Challenge: not a heal, not MP. Score Sip on (3,1) → (2,1) **Tally** is the cousin manufacture; Tally Sip on (2,1) → (1,1) **Poise** is the next hop; do not name-wire either hop.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-stave-post`

NAME: Stave Post  
ROLE: SUMMONS — empty-kit mine; end-turn occupy detonates iff leftover AP + leftover MP === 5  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "stavepost"`, `summonLifespan: 3`, empty kit. `effectParams: {"stavePostDetonateDamage":10,"stavePostNeedSumEq":true,"staveSumN":5}`. Place on a free ground tile. At **end of a combatant’s turn**, if they **occupy** this body and leftover AP + leftover MP **=== 5**, deal 10 to that occupant through `updateCombatant` and this summon dies. Walk-enter does **not** detonate (Ingress). Relocate landing does **not** detonate (Drift Post). Start-of-turn does **not** detonate (Wake / Gaunt Sill / Poise Sill / Tally Sill / Score Sill / Stave Sill). Distinct from Score Post (#1011, leftover sum === 4 **and unequal**), Tally Post (#953, leftover sum === 3), Poise Post (#890, leftover AP === leftover MP ≥ 1), Gaunt Post (#849, leftover **both 0**), Lean Post (leftover **AP = 0** only), Dummy Post (taunt), Drift Post (**relocate landing**), Dwell Mark (**end-turn occupy, any leftover**). The decision: end the turn on (3,2) and eat 10, or spend a pool, or dump to 3/1 and eat Score Post, or dump to 2/2 and eat Poise Post, or dump to 3/0 and eat Tally Post, or dump to 0/0 and eat Gaunt Post. Dual Keep 2/2 **hurts Poise Post, not this**. Dual Keep **cannot** hurt this. Walk-safe. Relocate-safe. Start-turn-safe.  
DURATION: lifespan 3 or until detonate  
SCALING: 10 follows damage% if any; otherwise fixed.  
SYNERGIES: Stave Hold so they cannot walk off; Hymn Turn **keeps** sum 5 through the end-turn check.  
COUNTERPLAY: Spend a pool before turn end; walk off (walk-safe); Coup the post; blink.  
POWER_BUDGET: Standard 3 / CD 3 / 0 upfront. Power is **end-turn occupy on a sum of 5**. Counts as **one** toward the summon cap.  
AI_USAGE: `aiHint: "stave_post_if_foe_will_end_turn_sum_eq_5_on_tile"`. Masons / pawns. Skip if cap is full.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","rook"]`, `levelZoneMin: 1`  
EDGE_CASES: **Summon is observation.** Later detonate / death is not a second observe. Missing keys → do not spawn a Dummy Post. Occupant leftover 3/1 at turn end → no detonate (Score Post’s window). Occupant leftover 2/2 at turn end → no detonate (Poise Post’s window). Occupant leftover 3/0 at turn end → no detonate (Tally Post’s window). Occupant leftover 0/0 at turn end → no detonate (Gaunt Post’s window). Empty tile → no detonate, lifespan ticks. Never parse `"Stave Post"`. Do not mint `spell-stave-burst`. Prefer fizzle-and-detonate if the body is displaced by Swap (body gone → no tile tax).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — empty-kit summon + end-turn leftover-sum gate. Same class as Score Post / Tally Post / Poise Post / Gaunt Post / Lean Post.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-stave-bounce`

NAME: Stave Bounce  
ROLE: DAMAGE — 12 to primary; bounce 1 to nearest other leftover-AP+MP===5 hostile  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 12 to primary (ungated). `effectParams: {"staveBounceNeedSumEq":true,"staveSumN":5,"staveBounceSearchRadius":4,"staveBounceCount":1}` — search Chebyshev ≤ 4 for the nearest **other** living hostile whose leftover AP + leftover MP **=== 5**; deal 12 to that body too. Primary leftover unconstrained. Distinct from Score Bounce (#1011, second body leftover sum === 4 **and unequal**), Tally Bounce (#953, second body leftover sum === 3), Poise Bounce (#890, second body leftover AP === leftover MP ≥ 1), Gaunt Bounce (#849, second body leftover **both 0**), Parched Bounce (leftover **MP = 0**), Heave Bounce (**force-moved**), Chain Lightning (nearest **any**, 2 bounces). The decision: open on whoever, splash the (3,2) bishop — or wait for two 3/1 bodies and Score Bounce. Dual Keep 2/2 is the **wrong** second body. Dual Keep cannot open this.  
DURATION: instant  
SCALING: 12 follows damage%.  
SYNERGIES: Hymn Turn a second body into Stave before the bounce search; Stave Hold to keep them in-window.  
COUNTERPLAY: Isolate (one Stave body); sit the second body on 3/1 or 2/2 or 3/0 or 0/0.  
POWER_BUDGET: Standard. 12 if no second Stave body; 24 if a second sits on sum 5.  
AI_USAGE: `aiHint: "stave_bounce_if_second_sum_eq_5_hostile_in_r4"`. Queens / bishops. Skip if no second in-window body **and** a Strike would kill the primary; 12 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing bounce keys → 12 only. Primary leftover 3/1 does **not** block the primary hit. Ties: nearest Chebyshev, then lowest id. Do not hit allies. Second body leftover 3/1 is **not** a bounce target (Score Bounce). Second body leftover 2/2 is **not** a bounce target (Poise Bounce).  
IMPLEMENTATION_COMPLEXITY: LOW — one search + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-must-stave`

NAME: Must Stave  
ROLE: CONTROL — non-Strike illegal unless leftover AP + leftover MP === 5 **and** the spell spends last AP  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"mustNonStrikeUnlessSumEqAndSpendsLastAp":true,"staveSumN":5,"staveHoldDuration":2}`. For 2 of the **target’s** turns, any non-Strike spell is illegal unless, **before** this (their) spell’s AP is paid, leftover AP + leftover MP **=== 5** **and** `apCost === leftover AP` (the spell spends last leftover AP). Strike / `physical_attack` stays legal. Walk stays legal unless a Stave Hold is also up. Distinct from Must Score (#1011, leftover sum === 4 **and unequal** **and** last AP — **pre-spend even unequal sum**), Must Tally (#953, leftover sum === 3 **and** last AP — **pre-spend odd sum 3**), Must Poise (#890, leftover AP === leftover MP ≥ 1 **and** last AP — **pre-spend equality**), Must Gaunt / Must Lean / Must Drift / Must Pace / Must Span / Must Step, Rite First (cannot Strike until a spell), Tool Hold (cannot tool until Strike). The decision: they sit on (3,2) with a 3-cost tool as their last packet, or they sit on (0,5) with walk MP and **no** leftover AP — Must Stave **blocks** every non-Strike from (0,5) because leftover AP is 0 (cannot spend last AP). (5,0) spending a 5-cost last packet **is** legal and dumps them to (0,0) Gaunt. Dual Keep 2/2 is Must Poise’s window, **not** this. Dual Keep cannot open this.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Stave Hold on (0,5) so they can neither walk nor non-Strike; Hymn Turn (0,5)→(5,0) so a 5-cost last packet becomes legal. Do **not** CORE with a Strike-only stave lock (none shipped).  
COUNTERPLAY: Strike; blink; wait 2 turns; Hymn Turn / Tempo Invert yourself if you own it.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **last-packet from a sum of 5**, not a silence.  
AI_USAGE: `aiHint: "must_stave_if_target_leftover_sum_eq_5_and_has_a_last_packet_spell"`. Knights / pawns ELITE. Skip if leftover sum ≠ 5. Do not arm if the only remaining legal verb is Strike and a walk would kill.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 2`  
EDGE_CASES: **Pre-spend leftover** (see §3.5). Missing keys → no lock. Leftover (3,1) → non-Strike still illegal under **this** lock (sum 4, Must Score’s window). Leftover (2,2) → non-Strike still illegal under **this** lock (tied, Must Poise’s window). Leftover (3,0) → non-Strike still illegal under **this** lock (sum 3, Must Tally’s window). Leftover (0,0) → non-Strike illegal (Must Gaunt’s window, but this lock does not lift there). 0-AP tools (Timestep) are not “spending last AP”.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — pre-spend leftover sum + last-AP compare in the cast gate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-verse-stave`

NAME: Verse Stave  
ROLE: CONTROL — last resolved id illegal until leftover AP + leftover MP === 5  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"verseStaveUntilSumEq":true,"staveSumN":5}`. The target’s **last resolved spell id** (the id they most recently spent AP on) cannot be recast until leftover AP + leftover MP **=== 5**. Strike is not a spell id for this key. If they have no last resolved id, fizzle rider (AP spent). Distinct from Verse Score (#1011, lifts at leftover sum === 4 **and unequal**), Verse Tally (#953, lifts at leftover sum === 3), Verse Poise (#890, lifts at leftover AP === leftover MP ≥ 1), Verse Gaunt (#849, lifts at leftover **both 0**), Verse Lean / Verse Pace / Verse Tax, Once Verse / Stolen Verse / Summon Verse (#906, pets pay +1 AP to **recast** last id; the id stays legal), Last Mute / Hex of Silence. The decision: lock their Inferno until they sit on (3,2) — sitting on 3/1 **does not** lift (Verse Score’s window); sitting on 2/2 **does not** lift (Verse Poise’s window); sitting on 3/0 **does not** lift (Verse Tally’s window); sitting on 0/0 **does not** lift (Verse Gaunt’s window); sitting on 1/1 **does not** lift (Prime Gift). Instant lift if they already sit on sum 5 at resolve (fizzle rider — do not arm a lock that is already lifted). Dual Keep 2/2 does **not** lift this. Dual Keep **cannot** lift this.  
DURATION: until leftover sum === 5, or battle end  
SCALING: none.  
SYNERGIES: Cadence Dock so the locked id is also remaining 0 (they can recast it **this** turn if they also sit in-window); Stave Hold so they cannot walk into a new leftover split.  
COUNTERPLAY: Sit on (5,0) / (0,5) / (4,1) / (1,4) / (3,2) / (2,3); recast a different id; wait. Dual Keep 2/2 does **not** lift this. Haste into (3,2) **does**.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **which leftover window lifts the last verse**, not a silence.  
AI_USAGE: `aiHint: "verse_stave_if_target_last_id_is_their_win_condition"`. Hex / bishops. Skip if they have no last resolved id, or if they already sit on sum 5 (instant lift — fizzle rider).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing keys → no lock. Verse Stave does **not** lift at leftover 0/0 (Verse Gaunt), leftover 2/2 (Verse Poise), leftover 3/0 (Verse Tally), leftover 3/1 (Verse Score), or leftover 1/1 (Prime Gift). Summon Verse (#906) is a recast tax, not a legality lock — do not merge the keys.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — last-id lock + leftover-sum lift.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-dock`

NAME: Court Dock  
ROLE: SUPPORT — Cadence Dock on **every other** body (init order)  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `effectParams: {"dockRemainingCdsEq2To0":true,"courtDockExcludeCaster":true}`. In initiative order, every living combatant **except the caster** has remaining `n===2` rewritten to `0` (zeros stay 0; `n===1` and `n>2` unchanged), same rewrite as Cadence Dock. Distinct from Court Snuff (#1011, mass Snuff `n===1` → `0`), Court Prime (#953, mass Prime `n===0` → `1`), Court Floor (#890, mass Floor `n>1` → `1`, zeros stay 0), Court Lag (#849, mass Lag `n>0` → `n+2`), Court Imprint (mass Imprint), Court Dual / Court Keep / Court Stretch / Court Hinge / Court Shove / Court Fold, Cadence Dock (one body), Cadence Flush (all → 0, ally), Cadence Swap (two-body map exchange), Cadence Cap (one body `n>2→2`). Player never owns this. Witness without grant.  
DURATION: instant rewrite  
SCALING: none.  
SYNERGIES: Kit with Cadence Dock on the caster’s own target after, or Snuff a remaining `n===1` after the board’s remaining-2 tools are already sitting at 0. Do **not** CORE with Court Snuff / Court Prime / Court Floor / Cadence Cap.  
COUNTERPLAY: Recast before Court Dock; Cadence Break your own remaining after; Floor your remaining 2 to 1 before the mass dock; kill the regent.  
POWER_BUDGET: Signature 6 / CD 4 / 0 damage. Power is **board-wide remaining-2 unlock**. Kit-only.  
AI_USAGE: `aiHint: "court_dock_if_two_plus_foes_have_a_remaining_2_nuke"`. Kit-only regent. Skip if every other remaining is already ≠ 2.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. `NOT_PLAYER_LEARNABLE`. `court_dock_regent` kit-only. Arm is observation for witness-only kits. Never written to owned ids.  
EDGE_CASES: Missing `courtDockExcludeCaster` → do not dock the caster (fail closed, still observe). Do not write `spellLevelValues`. Do not mint `spell-court-deuce`. Preview must list who docks. Do not reuse `courtSnuffExcludeCaster` / `courtPrimeExcludeCaster` / `courtFloorExcludeCaster`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — init-order walk + Cadence Dock rewrite. Same class as Court Snuff / Court Prime / Court Floor / Court Lag.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-court-dock
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
effectParams: {"dockRemainingCdsEq2To0":true,"courtDockExcludeCaster":true}
```

---

## 6. Combination matrix (statuses × leftover × terrain)

| Window | Tools |
| :--- | :--- |
| Leftover AP + leftover MP **=== 5** on an **ally** | Stave Mend (both bodies), Stave Step, Stave Lend (**exits** to 7, stays unequal), Hymn Turn (**keeps** the sum on both allies; caster stays) |
| Same window on a **hostile** | Stave Sting, Stave Sill (their turn start), Stave Hold (cannot walk), Stave Sip (**manufactures Score** from (4,1)→(3,1) / (5,0)→(4,0) / (2,3)→(1,3) / (1,4)→(0,4), **or Poise** from (3,2)→(2,2)), Stave Post (their turn end), Stave Bounce (second body), Must Stave (self, pre-spend), Verse Stave (lifts here) |
| Same window on **self** | Stave Hood, Must Stave |
| Leftover AP + leftover MP **=== 4 AND unequal** | **Not this pass.** Score\*. Stave keys fail `staveSumN === 5`. |
| Leftover AP + leftover MP **=== 3** | **Not this pass.** Tally\*. Stave keys fail `staveSumN === 5`. |
| Leftover AP === leftover MP **and leftover AP ≥ 1** | **Not this pass.** Poise\* / Equal Gift / Prime Gift (1/1). Stave keys fail (odd sum never ties). |
| Leftover AP = 0 **and** leftover MP = 0 | **Not this pass.** Gaunt / Hollow Gift / Bare Sip / Verse Gaunt. Stave keys fail (sum 0). |
| Dual Keep / Purse Keep / Stride Keep surviving **2/2** | **Opens** every Poise gate. **Blocks** every Stave gate (sum 4 ≠ 5) **and** every Score gate (`scoreForbidEqual`) **and** every Tally gate (sum 4 ≠ 3) **and** every Gaunt gate. Dual Keep **cannot** manufacture Stave. |
| Dual Keep surviving **2/1** or **1/2** | **Opens** Tally. **Blocks** Stave (sum 3). |
| Dual Keep surviving **2/0** or **0/2** | Sum 2. **Blocks** Stave / Score / Tally / Poise / Gaunt. Spend nothing; Dual Keep cannot reach 5. |
| Haste / Tempo Gift / Timestep into (3,2) after a 3-AP spend | **Opens** Stave. The intended bank. |
| Tally Lend on a sum-3 body | **Manufactures Stave** ((2,1)→(3,2)). Intended hop. |
| Remaining CD `n===2` on a hostile | Cadence Dock / Court Dock (ready-unlock of twos). Snuff does **not** write 0 on twos. Cap does **not** write 0 on twos (leaves 2). Floor peels 2 to **1**, not 0. |
| Axis-aligned 3×4 free | Dodeca Span occupies all twelve. Dec Span would have painted a 2×5. Hendeca Span would have painted a 7-spine × 5-crossbar plus. |
| Two ally leftover pairs (caster stays) | Hymn Turn inverts AP↔MP on **each** non-caster ally. Duel Turn stays two hostiles. Tempo Invert stays one-body ally/self. Bar Cross moves leftover **across caster and one target**. |

Dual Keep leftover that survives turn start **never** opens Stave. Spend Haste / Tempo Gift / a natural 6+ bar, or Tally Lend into (3,2), to enter the window.

Stave Sip on (3,2) → (2,2) is the **intended** Poise manufacture. Stave Sip on (4,1) → (3,1) is the **intended** Score manufacture. Score Sip on (3,1) → (2,1) is the **intended** Tally manufacture. Tally Sip on (2,1) → (1,1) is the **intended** Poise manufacture. Do not name-wire any hop; they fall out of the leftover writes.

Tally Lend on (2,1) → (3,2) is the **intended** Stave manufacture. Stave Lend on (3,2) → (4,3) **exits** Stave into sum 7.

---

## 7. Implementation order (not this pass)

1. Discovery ownership split (`SDE-2026-08-31-001`) — without it every Wave-17 id forced into `starterSpells` becomes always-owned.
2. Leftover AP / leftover MP writers (HUD pools after each spend). Dual Keep / Purse Keep / Stride Keep must write surviving leftover at turn start **and keep the cap-2 rule** (Stave depends on Dual Keep **not** reaching 5).
3. Cadence remaining-CD maps (already required by Waves 5–16). Cadence Floor (#906) is remaining `n>1` → `1`. Cadence Prime (#953) is remaining `n===0` → `1`. Cadence Rise (#962) is remaining `n===1` → `2`. Cadence Snuff (#1011) is remaining `n===1` → `0`. Cadence Cap (#1017) is remaining `n>2` → `2`. Cadence Dock is remaining `n===2` → `0`.
4. Occupy-weight **before** Dodeca Span (cap 2 cannot host weight 12). Hendeca Span (weight 11) / Dec Span (weight 10) / Nine Span (weight 9) / Oct Span (weight 8) have the same prerequisite.
5. Confirm gates for Must Stave (pre-spend) / Stave Hold / Verse Stave / Hymn Turn.
6. Axis-aligned 3×4 multi-cell occupy (`dodecaspan`) and empty-kit mine (`stavepost`).
7. Do **not** land `spell-parched-mend`. Do **not** land a second `spell-cadence-floor` / `spell-cadence-prime` / `spell-cadence-rise` / `spell-cadence-snuff` / `spell-cadence-cap`. Do **not** reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp` / `floorRemainingCdsTo1` / `primeRemainingCdsFrom0` / `snuffRemainingCdsEq1To0` / `capRemainingCdsAbove2To2` / `tallySumN` / `scoreSumN`.

Do not implement production code in this pass.

---

## 8. QA (design-level)

| ID | Check |
| :--- | :--- |
| W17-1 | No Wave-17 id appears in `spellData.ts` / `SPELL_ID_CATALOG` / §1.4 tombstone |
| W17-2 | `spell-parched-mend` is **not** shipped; Dry Gait owns leftover-MP=0 heal |
| W17-3 | `spell-stave-mend` requires leftover AP + leftover MP **=== 5** on **both** bodies. (2,2) fails. (3,1) fails. Tally Mend owns **sum === 3**. Score Mend owns **sum === 4 AND unequal**. Poise Mend / Equal Gift own **equality ≥ 1**. Prime Gift owns **exactly 1/1**. Hollow Gift / Gaunt Mend own **0 + 0**. Lean Gift owns AP=0 and MP≥1 |
| W17-4 | Cadence Dock is remaining `n===2` → `0`; `n===1` and `n>2` unchanged; zeros stay 0. Does **not** clone Cadence Snuff (`1→0`) / Cap (`n>2→2`) / Rise (`1→2`) / Prime (`0→1`) / Floor / Swap / Lag / Halve / Crack / Flush |
| W17-5 | Dodeca Span is axis-aligned 3×4, counts as **twelve**, every cell occupied, click is **nearest cell to caster**. Hendeca Span stays stretched plus eleven, click = center. Dec Span stays 2×5 ten. Nine Span stays solid nine. Oct Span stays hollow eight |
| W17-6 | Hymn Turn is two-ally independent leftover AP↔MP, caster stays, self forbidden. Does **not** clone Tempo Invert, Purse Turn, Bar Cross, or Duel Turn. Does **not** reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp`. Does **not** alias Choir Hymn |
| W17-7 | Stave Hood does **not** retag `even_gallery` / Dual Plate / Spent Plate / Gait Plate / Dry Plate / Poise Hood / Tally Hood / Score Hood |
| W17-8 | Stave Sting bonus is leftover AP + leftover MP === 5, not Score Sting’s sum 4 unequal, not Tally Sting’s sum 3, not Poise Sting’s equality, not Gaunt Sting’s both-0, not Even Sting’s even AP, not Tied Gait’s (2,2) |
| W17-9 | Stave Sip on (3,2) writes (2,2) **Poise**. Stave Sip on (4,1) writes (3,1) **Score**. Score Sip on (3,1) writes (2,1) **Tally**. Tally Sip on (2,1) writes (1,1) **Poise**. Bare Sip stays leftover MP = 0. Poise Sip stays equality ≥ 1 |
| W17-10 | Must Stave is **not** in the same CORE as a Strike-only stave lock (none shipped). Reads leftover **before** debit. Dual Keep 2/2 is Must Poise, not Must Stave. Dual Keep cannot open Must Stave |
| W17-11 | Court Dock is `NOT_PLAYER_LEARNABLE`; `court_dock_regent` is kit-only |
| W17-12 | Extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent` do not restamp #808 / #836 / #849 / #837 / #890 / #903 / #906 / #951 / #953 / #962 / #1004 / #1011 / #1017 |
| W17-13 | `mpCost` is 0 on every Wave-17 row |
| W17-14 | `summonAI` values are `"dodecaspan"` / `"stavepost"` enums, never parsed names |
| W17-15 | Dodeca Span does not ship against `ENEMY_SUMMON_CAP === 2` without occupy-weight |
| W17-16 | Verse Stave does **not** lift at leftover 0/0 (Verse Gaunt), leftover 2/2 (Verse Poise), leftover 3/0 (Verse Tally), leftover 3/1 (Verse Score), or leftover 1/1 (Prime Gift) |
| W17-17 | No second `spell-cadence-floor` / `spell-cadence-prime` / `spell-cadence-rise` / `spell-cadence-snuff` / `spell-cadence-cap`. SDE #906 owns Floor. #953 owns Prime. #962 owns Rise. #1011 owns Snuff. #1017 owns Cap |
| W17-18 | Legal Stave pairs are only (5,0) (0,5) (4,1) (1,4) (3,2) (2,3). (3,1) is Score. (2,2) is Poise. (3,0) is Tally. (1,1) is Prime Gift. Dual Keep cannot manufacture any Stave pair |
| W17-19 | Tally Lend (2,1)→(3,2) **manufactures Stave**. Stave Lend (3,2)→(4,3) **exits** Stave. Do not name-wire either hop |

---

## 9. Out of scope

- Production TypeScript / Motoko / bindgen / PocketIC.
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / **#903** / **#951** / **#1004** own extra doors).
- Restamping any door in §3.4.
- A fourth `mpCost > 0` walk snipe; Hex of Silence; About Hinge; mid-RAF splice; sixth echo; leftover-sum **=== 3** (Tally); leftover-sum **=== 4 including 2/2** (that is Poise); leftover-sum **=== 4 AND unequal** (Score); remaining `n===0` → `1` (Prime); remaining `n===1` → `2` (Rise); remaining `n===1` → `0` (Snuff); remaining `n>1` → `1` (Floor); remaining `n>2` → `2` (Cap); twelve-cell occupy aliases; target-only sum===3 / sum===4 / sum===5 heal; leftover **diff** window; two-hostile invert (Duel Turn); one-body invert (Tempo Invert / Purse Turn).
- Cloning Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Shadow Veil, Mirror / Reflect, Lens / Overcast, Short Sight / Paper Wind, Tempo Gift / Loan Tempo, Goad / Taunt Oath, Rime Tile / Rime Sheet, File Lance, Blood Tithe, Hex of Silence, Dry Mend, Dry Gait, Parched Mend, Hollow Gift, Cadence Swap, Cadence Floor, Cadence Prime, Cadence Rise, Cadence Snuff, Cadence Cap, Gaunt Mend, Poise Mend, Equal Gift, Tally Mend, Score Mend, Lean Gift, Prime Gift, Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Choir Hymn.
- Putting unique #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 ids in this catalog.

---

## 10. Catalog index

| SPELL_ID | NAME | ROLE | ACQUISITION | AP | CD | Door |
| :--- | :--- | :--- | :--- | ---: | ---: | :--- |
| `spell-stave-mend` | Stave Mend | SUPPORT | MULTI_SOURCE | 3 | 2 | `stave_cantor` |
| `spell-cadence-dock` | Cadence Dock | CONTROL | MULTI_SOURCE | 3 | 2 | `dock_precentor` |
| `spell-dodeca-span` | Dodeca Span | SUMMONS | MULTI_SOURCE | 4 | 3 | `span_dodeca` |
| `spell-hymn-turn` | Hymn Turn | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-stave-hood` | Stave Hood | DEFENSE | ELITE | 2 | 2 | (piece observe) |
| `spell-stave-sting` | Stave Sting | DAMAGE | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-stave-step` | Stave Step | POSITION | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-stave-sill` | Stave Sill | TERRAIN | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-stave-hold` | Stave Hold | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-stave-lend` | Stave Lend | SUPPORT | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-stave-sip` | Stave Sip | CONTROL | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-stave-post` | Stave Post | SUMMONS | ENEMY_DISCOVERY | 3 | 3 | (piece observe) |
| `spell-stave-bounce` | Stave Bounce | DAMAGE | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-must-stave` | Must Stave | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-verse-stave` | Verse Stave | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-court-dock` | Court Dock | SUPPORT | NOT_PLAYER_LEARNABLE | 6 | 4 | `court_dock_regent` (kit) |

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

**Document status:** PROPOSED. Safe to review and implement in a later, explicit data PR. Not a license to land combat code in the same change as this spec. Coordinate with **#1017** so Prime Gift / Cadence Cap / Dual Plate / Ring Stride land once. Coordinate with **#1011** so Score Mend / Cadence Snuff / Hendeca Span / Duel Turn land once as Wave-17 family CORE. This catalog stamps as Wave **18** family CORE.

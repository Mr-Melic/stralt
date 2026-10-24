# Spell and Tactical Mechanics — Design Pass 2026-10-24

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1 law [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) through still-open Wave 15 [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-evolution-bc73/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-23.md) (**#962**). Same-day Wave 16 SDE (`cursor/spell-discovery-and-evolution-6033`) **has not opened a PR at authoring**.
- Spell, Discovery & Achievement Admin — still-open ACTION_ID-only PRs (no unique spell ids); same-day #980 is an admin re-audit, not a spell catalog.
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) … still-open Wave 15 [`SPELL_PROPOSALS_2026-10-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-design-11b3/docs/automation/SPELL_PROPOSALS_2026-10-23.md) (**#953**)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); extra doors through #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / **#903** (Wave 15 bosses) / **#951** (Wave 16 bosses: `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`); tactical extras #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / **#953**

This is **Wave 16** of the tactical catalog. Live HEAD is unchanged since Waves 4–15. Wave 15 (#953) filled both-body leftover AP + leftover MP **=== 3** heal (Tally Mend), remaining `n===0` → `1` (Cadence Prime), axis-aligned 2×5 occupy (Dec Span, counts as ten), hostile one-body leftover invert (Purse Turn), and a Tally family plus Court Prime.

**Wave 15 explicitly deferred eleven holes.** Discovery Wave 15 (#962) already claimed remaining `n===1` → `2` (Cadence Rise) and leftover AP = 0 **and** leftover MP ≥ 1 heal (Lean Gift). **SDE keeps those.** This pass fills the remaining leftovers Wave 15 left for Wave 16, plus a two-hostile invert that does **not** clone Purse Turn, Tempo Invert, or Bar Cross:

| Wave-15 leftover | Owner after #962 / #953 | This pass |
| :--- | :--- | :--- |
| Leftover AP + leftover MP === **4** | Still open. Tally owns **sum === 3** (never an equality). Poise / Equal Gift own **equality ≥ 1** — Dual Keep **2/2** is Poise (sum 4 **and** a tie). Gaunt / Hollow Gift own **0+0**. Tied Gait owns **exactly 2 and exactly 2**. | **This pass:** Score Mend — **caster and target** leftover AP + leftover MP **=== 4** **and leftover AP ≠ leftover MP**. Legal pairs **(4,0) (0,4) (3,1) (1,3)**. **(2,2) does not fire.** |
| Remaining `1` → `0` | Still open. Rise (#962) pads `n===1` → `2`. Prime (#953) locks `n===0` → `1`. Floor (#906) compresses `n>1` → `1` (zeros stay 0). Flush / Crack write 0 on other policies. | **This pass:** Cadence Snuff (remaining `n===1` → `0`; zeros stay 0; `n>1` unchanged) |
| Eleven-cell occupy | Still open. Dec Span is ten (2×5). Nine Span is solid nine. Oct Span is hollow eight. Sept Span is stretched-plus seven. | **This pass:** Hendeca Span (stretched plus, 7-spine × 5-crossbar sharing center = **11**) |
| Invert leftover on **two hostiles** (caster stays) | Still open. Purse Turn is **one** hostile. Tempo Invert is ally/self. Bar Cross is two-body **cross** (caster AP ↔ target MP **and** caster MP ↔ target AP). | **This pass:** Duel Turn — invert leftover AP↔MP on **two** hostiles independently; caster pools unchanged |
| Target-only sum===3 heal | **Held for SDE.** Lean Gift (#962) is leftover AP = 0 **and** leftover MP ≥ 1, **not** this hole. | **Not this pass.** Do not mint `spell-tally-gift` / `spell-score-gift` |
| Leftover AP − leftover MP === 1 (diff window) | Still open. Collides with Tally at **(2,1)**. | **Not this pass** (Wave 17). Diff===2 would collide with Score at **(3,1)** |
| Mid-RAF splice | Held (AGENTS.md) | Still held |
| Fourth `mpCost > 0` walk snipe | Held (Ley Toll / Undertow / Sanguine Toll) | Still held |
| Sixth echo id | Held | Still held |
| Player-owned Hex of Silence | Held (`BOSS_ONLY`) | Still held |
| Player-owned About Hinge | Held (`BOSS_ONLY` on #590) | Still held. Hostile 180° around a pair midpoint is still Pawn Trade. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after the reserved set **and** after #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906 / #953 / #962. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

Same-day Discovery Wave 16 **has not opened a PR at authoring**. **If that catalog later claims a unique leftover below, SDE wins** the unique §11 id; this catalog must not clone it. Do **not** clone #747 / #802 / #837 / #849 / #890 / #906 / #953 / #962 unique ids. Do **not** ship `spell-parched-mend` / `spell-cadence-floor` (second copy) / `spell-cadence-rise` (second copy) / `spell-cadence-prime` (second copy) / `spell-tally-gift` / `spell-score-gift`. Stamp family / observe metadata onto Wave-16 **tactical** ids only. #962 §12 already stamps #953 as Wave **16** family CORE. **This catalog stamps as Wave 17 family CORE.**

Do **not** mint `spell-quad-mend` / `spell-even-mend` / `spell-four-mend` / `spell-tetrad-mend` / `spell-sum-four` / `spell-score-gift` / `spell-both-score` (Score Mend owns both-body sum===4 **unequal** heal; Wave 14 tombstoned `spell-even-mend` as a Poise alias), `spell-cadence-kill` / `spell-cadence-drop` / `spell-cadence-open` / `spell-cadence-slip` / `spell-cadence-zero` / `spell-cd-snuff` (Cadence Snuff owns remaining `1` → `0`; Rise owns `1` → `2`; Prime owns `0` → `1`), `spell-eleven-span` / `spell-undec-span` / `spell-elven-span` / `spell-once-span` / `spell-hendec-span` (Hendeca Span owns eleven; Wave 7 tombstoned `spell-once-verse` as an echo, not this occupy), `spell-twin-turn` / `spell-pair-flip` / `spell-purse-pair` / `spell-double-purse` / `spell-foe-pair` / `spell-two-foe-invert` (Duel Turn owns two-hostile independent invert; Purse Turn owns one hostile; Bar Cross owns two-body cross), `spell-court-drop` / `spell-court-open` / `spell-court-zero` (Court Snuff is the mass signature), or `spell-score-plate` / `spell-sum-four-hood` (Score Hood owns sum===4 unequal any-range miss; do **not** retag `even_gallery` / Spent Plate / Gait Plate / Poise Hood / Tally Hood).

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is unchanged since 2026-08-31. Discovery is still inert. WX is **19,213** lines (`wc -l`). Same HEAD as Waves 4–15. `WorldExploration.tsx` lives at `src/frontend/src/components/WorldExploration.tsx` (not `engine/`).

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

Live `ENEMY_SUMMON_CAP` is still **2** (`gameConstants.ts` 300). Quad Span (#636) counts as four, Penta Span (#695) as five, Six Span (#787) as six, Sept Span (#726) as seven, Oct Span (#849) as eight, Nine Span (#890) as nine, Dec Span (#953) as ten on paper; all seven are implementation-blocked until that cap (or a dedicated occupy-weight) exists. Hendeca Span is the same class: **propose the hole, do not pretend it can ship against cap 2**.

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
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** (tests only) | Unused | Shoulder Bash, Hook Line. Score Step / Duel Turn relocate leftover **pools**, not tiles. Duel Turn is **not** `isSwap`. |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768 → WX `swapPositions` 9389) | Swap | Pawn Trade / Ward Interpose / Cadence Snuff is **not** `isSwap` (cooldown remaining, not tiles) |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, never this set |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire |
| Walk / leftover / force flags | Paper `walkMpSpentThisTurn` (Waves 6–10). Paper `forcedMovedThisTurn` (Wave 9). Leftover AP/MP die at turn end unless Dual Keep / Purse Keep / Stride Keep | Haste grants **now**; Timestep is full **now** | **This pass: Score Mend / Score Hold / Score\* / Must Score / Verse Score / Duel Turn / Court Snuff** |
| Eleven-cell occupy | Twin=2 … Dec=10 rectangle | Absent | **This pass: Hendeca Span** (stretched plus = 11) |
| Remaining CD rewrite | Theft **steals**; Imprint **copies**; Swap (#837) **exchanges full maps**; Rest skips **own** tick; Halve **÷2**; Grace skips **starting** the next own CD; Stall **+1**; Lag **+2**; Floor (#906) `n>1` → `1`; Prime (#953) `n===0` → `1`; Rise (#962) `n===1` → `2` | Inferno CD 3 is the only live lock | **This pass: Cadence Snuff (remaining n===1 → 0; n>1 unchanged)** |
| Leftover sum (AP + MP === N) | Tally family is **sum === 3**. Poise family is **equality ≥ 1**. Gaunt family is **both leftover 0**. Equal Gift is **target equality ≥ 1**. Tied Gait is both leftover **exactly 2**. Ready Sting is leftover **AP ≥ 1 and MP ≥ 1** (no sum). Odd Plate is leftover **AP odd**. | Unused live | **This pass: Score\* (sum === 4 AND unequal)** |
| One-body leftover AP↔MP | Tempo Invert (`invertApMp`, ally/self). Purse Turn (hostile one-body). Bar Cross (two-body **cross**). | Absent live | **This pass: Duel Turn (two hostiles, independent invert, caster stays).** Do not reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody`. |

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

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` and `spell-blood-tithe` (tactical W2 vs Discovery W2). `spell-cadence-floor` (tactical #890 vs Discovery #906 — **SDE wins**; this pass does not add a third).

**Fantasy overlaps to not clone:** Short Sight ≈ Paper Wind; Tempo Gift ≈ Loan Tempo; Goad ≈ Taunt Oath; Rime Tile ≈ Rime Sheet; Lens Shift / Overcast; Poise Mend ≈ Equal Gift (both-body vs target equality); Tally Mend ≈ Lean Gift (sum===3 vs AP=0-and-MP≥1); Cadence Floor is **filled**; Cadence Prime is **filled**; Cadence Rise is **filled**; Tempo Invert ≈ Purse Turn (ally vs hostile invert — **filled**); Purse Turn ≈ Duel Turn (one hostile vs two hostiles — **this pass fills the two-hostile side, does not clone the one-body card**).

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier; Dry Mend / Dry Gait / Parched Mend; Hollow Gift / Gaunt Mend; Cadence Swap / Cadence Floor / Cadence Prime / Cadence Rise.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved or live) |
| :--- | :--- | :--- |
| SUPPORT leftover-sum heal | Both-body leftover AP + leftover MP **=== 4** **and unequal** | Tally Mend (sum 3); Poise Mend / Equal Gift (equality); Gaunt / Hollow Gift (0+0); Dry Mend / Dry Gait; Lean Gift |
| CONTROL remaining 1→0 | Ready-lock ids (`n===1`) write `0` | Rise `1→2`; Prime `0→1`; Floor `n>1→1`; Stall/Lag pad; Flush/Crack →0 |
| SUMMONS eleven-cell occupy | Stretched plus, counts as eleven | Twin…Dec Span |
| CONTROL two-hostile invert | Leftover AP↔MP on **two** hostiles; caster stays | Tempo Invert (ally/self); Purse Turn (one hostile); Bar Cross (two-body cross) |
| DEFENSE / DAMAGE / TERRAIN score family | Hood / Sting / Step / Sill / Hold / Lend / Sip / Post / Bounce / Must / Verse | Tally\* / Poise\* / Gaunt\* / Lean\* / Dry\* |
| SIGNATURE mass Snuff | Court Snuff | Court Prime / Court Floor / Court Lag / Court Imprint |

**Still open after this wave (do not fill today):** mid-RAF splice; fourth walk-MP snipe; sixth echo id; player-owned Hex of Silence; player-owned About Hinge; leftover AP − leftover MP === **2** (diff window; (3,1) is Score); remaining `n===2` → `0`; twelve-cell occupy (2×6 / 3×4); **target-only** sum===4 heal (leave for SDE); **target-only** sum===3 heal (still SDE’s leftover; Lean Gift did not take it); invert leftover on **two allies** (caster stays). Those stay Wave 17 so this pass stays discrete.

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
9. `inferArchetype` still treats any `healAmount > 0` as healer (`enemyAI.ts` 447–452). Score Mend **must not** land in non-healer CORE; keep `healAmount: 0` on the row.

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 16 ids to `starterSpells` as base. Do **not** land Wave-16 data before Wave-1 ownership split (`SDE-2026-08-31-001`).

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "hendecaspan"` / `"scorepost"` are **string enums on the config**, not a parse of `"Hendeca Span"` / `"Score Post"`.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Hendeca Span / Score Post **arming** (body placed, AP spent) **is** observation. A later occupy / detonate is **not** a second observe.
- Cadence Snuff **resolve** (even if every remaining was already ≠ 1) **is** observation if AP was spent.
- Do not require “see it N times”. Wave 16 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.
- Do not stamp `survivor` (Last Ember / Last Ward). #646 / #679 / #747 / #802 / #837 / #849 / #890 / #906 / #953 / #962 left that feat leftover on purpose.

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

**Every live feat and every live challenge id is already a sole spell door or a MULTI child.** Wave 16 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 16 does **not** invent a 16th feat.

**Live 19 first-wins are all taken (do not restamp as the only door):**  
`starborn_queen` (Cut In), `pale_archivist` (After Verse), `starved_vampire_pawn` (Sanguine Toll), `lord_of_static` (Draw Together), `final_pawn` (Eclipse Fold), `mirror_sovereign` (Echo Cast), `crimson_countess` (Crimson Pact), `void_grandmaster` (Twin Gate), `midnight_bishop` (Life Tether), `chessboard_lich` (Claim Ward), `twin_monarchs` (Choir Hymn), `alabaster_fortress` (Pain Link / Aftershock), `bone_cavalier` (Vault / Caltrop), `pale_archbishop` (Reliquary / Glyph Snare extras), `fetid_rook` (Rot Brand), `broodmother_rook` (Brood Ward), `weeping_pawn` (Mute Thread, #411), `eternal_pawn_king` (Queue Cut, #411), `enthroned_void` (File Vault MULTI child, #411). `second_lament` remains kit-only False Cut.

**Wave-5…16 boss extra doors — do not restamp:** `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`, `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`, `mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`, `gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`, `toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`, `crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`, `sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`, `infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`, `flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`, `effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`, `jostle_subdeacon`, `peel_friar`, `dilate_organist`, `hood_recluse`, `wick_exorcist`, `dry_nuncio`, `hearth_legate`, `must_preceptor`.

**Wave-6…15 tactical extra doors — do not restamp:** `oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`, `pace_prelate`, `span_triune`, `wick_mason`, `slip_castellan`, `court_usher`, `gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `gaunt_cantor`, `lag_precentor`, `span_oct`, `court_lag_regent`, `poise_cantor`, `floor_precentor`, `span_nine`, `court_floor_regent`, `tally_cantor`, `prime_precentor`, `span_dec`, `court_prime_regent`. `parched_cantor` is **not** Dry Gait’s door and **not** Score Mend’s door. `tally_cantor` stays Tally Mend. `poise_cantor` stays Poise Mend. `gaunt_cantor` stays Gaunt Mend. `prime_precentor` stays Prime. `floor_precentor` stays Floor (#890 door). SDE teaches Rise via Wave-15 unique pools — do not restamp `rise_precentor` if #962 later mints one.

**Wave-8…15 SDE extras — do not restamp:** `about_hinge_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `pair_gallery`, `knight_fold_regent`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `cap_precentor`, `reach_fold_regent`, `knight_gallery`, `quad_nave`, `pit_aisle`, `shunt_pulpit`, `nudge_nave`, `file_precentor`, `diag_fold_regent`, `rank_fold_regent`, `file_gallery`, `hexa_nave`, `lava_aisle`, `strike_pulpit`, `shock_nave`. Do **not** retag `even_gallery` as Score Hood. Do **not** consume encounter-catalog `ENC-*` rooms. Do not name unique families `tally_mender` / `cadence_primer` / `dec_prelate` / `file_warder` / `axis_cutter`.

**New proposed extra doors for the boss designer (Wave 17 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `score_cantor` first-win | Score Mend MULTI child (observe+win still grants). `tally_cantor` stays Tally Mend. `poise_cantor` stays Poise Mend. `gaunt_cantor` stays Gaunt Mend. `parched_cantor` stays the dropped Parched Mend slot — **do not reuse**. Equal Gift / Lean Gift have **no** extra door — do not invent `equal_cantor` / `lean_cantor` / `sum_cantor`. |
| `snuff_precentor` first-win | Cadence Snuff MULTI child. `prime_precentor` stays Prime. `floor_precentor` stays Floor. `lag_precentor` stays Lag. `imprint_precentor` stays Imprint. `halve_precentor` stays Halve. `cap_precentor` stays Pack Cap. `file_precentor` stays Pack File (`ENEMY_ONLY`). Do **not** mint `rise_precentor` / `kill_precentor` / `drop_precentor`. |
| `span_hendeca` first-win | Hendeca Span MULTI child. `span_dec` stays Dec Span. `span_nine` stays Nine Span. `span_oct` stays Oct Span. `span_six` stays Six Span. `span_sept` stays Sept Span. `span_penta` stays Penta Span. `span_quad` stays Quad Span. `span_triune` stays Triple Span. Do **not** mint `span_eleven` / `span_undec`. |
| `court_snuff_regent` kit only | Court Snuff (`NOT_PLAYER_LEARNABLE`). `court_prime_regent` stays Court Prime. `court_floor_regent` stays Court Floor. `court_lag_regent` stays Court Lag. `court_imprint_regent` stays Court Imprint. `reach_fold_regent` stays Reach Fold. `diag_fold_regent` stays Diag Fold. `rank_fold_regent` stays Rank Fold. Do **not** mint `court_drop_regent`. |

Piece-type observe paths (not feat doors): cantors / bishops for Score Mend; scribes / tempo for Cadence Snuff; masons / rooks ELITE for Hendeca Span; hex / queens for Duel Turn; lurkers / knights for Score Hood; lurkers / pawns for Score Sting; porters / queens for Score Step; masons / rooks for Score Sill; hex / knights for Score Hold; buffers / bishops for Score Lend; hex / pawns for Score Sip; masons / pawns for Score Post; queens / bishops for Score Bounce; knights / pawns for Must Score; hex / bishops for Verse Score.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906 / #953 / #962 key names for a different meaning. Do **not** reuse `invertApMp` (Tempo Invert). Do **not** reuse `invertHostileLeftoverApMp` (Purse Turn). Do **not** reuse `crossLeftoverApMpTwoBody` (Bar Cross). Do **not** reuse `floorRemainingCdsTo1` (Cadence Floor). Do **not** reuse `primeRemainingCdsFrom0` (Cadence Prime). Do **not** reuse `tallySumN` / `tallyForbidEqual` (Tally is 3, no equality flag). Do **not** reuse `decSpanCells` / `nineSpanCells` / `nineSpanSolid`.

`mpCost` stays 0 on every Wave-16 row.

**New keys (Wave 16 only):**

```text
requireCasterLeftoverSumEqUnequal, requireTargetLeftoverSumEqUnequal, scoreSumN, scoreForbidEqual, scoreMendAmount,  // Score Mend — AP+MP === 4 AND AP ≠ MP on both bodies
snuffRemainingCdsEq1To0,                                                                                            // Cadence Snuff — remaining n===1 → 0; n>1 unchanged
hendecaSpanCells, hendecaLongArm, hendecaShortArm,                                                                  // Hendeca Span — 11; stretched plus 3/2 arms
invertTwoHostilesLeftoverApMp, invertTwoHostilesSearchRadius,                                                       // Duel Turn — two hostiles, independent invert; caster unchanged
scoreHoodNextHit,                                                                                                   // Score Hood — next hit while sum===4 AND unequal, any range → 0
scoreLeftoverSumEqUnequal, scoreStingBonus,                                                                         // Score Sting
scoreStepNeedSumEqUnequal, scoreStepAdj,                                                                            // Score Step — dest Chebyshev 1 of target
scoreSillNeedSumEqUnequal, scoreSillDamage, scoreSillDuration,                                                      // Score Sill — start-of-their-turn tax
scoreHoldWhileSumEqUnequal, scoreHoldDuration,                                                                      // Score Hold — 2 of their turns
scoreLendAp, scoreLendMp, requireTargetSumEqUnequalLend,                                                            // Score Lend — +1 AP and +1 MP iff sum===4 unequal (exits window)
scoreSipAp, requireTargetSumEqUnequalSip,                                                                           // Score Sip — steal 1 leftover AP iff sum===4 unequal
scorePostDetonateDamage, scorePostNeedSumEqUnequal,                                                                 // Score Post — 10 on end-turn occupy if sum===4 unequal
scoreBounceNeedSumEqUnequal, scoreBounceSearchRadius, scoreBounceCount,                                             // Score Bounce
mustNonStrikeUnlessSumEqUnequalAndSpendsLastAp,                                                                     // Must Score — pre-spend leftover
verseScoreUntilSumEqUnequal,                                                                                        // Verse Score
courtSnuffExcludeCaster                                                                                             // Court Snuff
```

If a key is missing, the rider does not fire. `scoreSumN` is **4** on every Score\* row that names a sum. `scoreForbidEqual` is **true** on every Score\* row. Missing `scoreSumN` **or** missing `scoreForbidEqual` → gate fails closed (do not guess 4 from the name; do not treat (2,2) as Score).

Nested kit-only id (not a player card): none new besides Court Snuff itself. Score Post’s detonate is **not** a second spell id (the summon row carries `scorePostDetonateDamage`). Do not mint `spell-score-burst`.

Leftover AP / leftover MP are **current remaining after this spell’s AP is paid**, read from the same pools the HUD uses — **except Must Score**, which reads leftover **before** debit (a “spends last AP” gate is otherwise impossible once leftover AP is already 0). Walk spends must write leftover MP. Spell spends must write leftover AP. Missing leftover → the gate fails closed (fizzle rider, AP spent, observe). Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count as leftover for these gates. Sum is integer `leftoverAp + leftoverMp`. Equality is **not** this family: leftover 2/2 fails `scoreForbidEqual` even though the sum is 4 (Poise / Tied Gait / Equal Gift own that pair). Leftover `0 + 0` is **not** a Score window (sum 0). Leftover `3 + 0` is **not** a Score window (sum 3, Tally). Legal pairs after a successful Score gate: **(4,0) (0,4) (3,1) (1,3)** only.

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Cadence Snuff’s ready-unlock is paid in **currently remaining 1**, not in extra AP. Score Mend’s 8 is paid in **two sum===4 unequal bars on two bodies** (Tally Mend is the two-body sum-3 cousin; Poise Mend is the two-body equality cousin; Equal Gift is the one-body equality cousin; Gaunt Mend is the two-body empty cousin).

Do **not** put Must Score in the same CORE as a Strike-only score lock (this pass does not ship that lock). Do **not** CORE Score Hood with Spent Plate, Gait Plate, Poise Hood, or Tally Hood. Do **not** CORE Score Mend with Hollow Gift, Gaunt Mend, Poise Mend, Equal Gift, Tally Mend, or Lean Gift. Do **not** CORE Duel Turn with Tempo Invert, Purse Turn, or Bar Cross. Do **not** CORE Cadence Snuff with Cadence Rise, Prime, Floor, Halve, Trim, Crack, or Flush.

---

## 5. Proposed spells (Wave 16)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-score-mend`

NAME: Score Mend  
ROLE: SUPPORT — heal if caster **and** target leftover AP + leftover MP **=== 4** **and leftover AP ≠ leftover MP**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"requireCasterLeftoverSumEqUnequal":true,"requireTargetLeftoverSumEqUnequal":true,"scoreSumN":4,"scoreForbidEqual":true,"scoreMendAmount":8}`. If **both** caster and target have leftover AP + leftover walk MP **=== 4** **and leftover AP ≠ leftover MP** at resolve (after this spell’s 3 AP is paid), heal the target 8 through the existing heal helper. If either sum ≠ 4 **or** either body is tied, fizzle rider (AP spent, no HP). Walk / force-move flags do **not** substitute. Distinct from Tally Mend (#953, **both bodies leftover AP + leftover MP === 3** — odd sum, never an equality), Poise Mend (#890, **both bodies leftover AP === leftover MP ≥ 1** — even sums 2/4/6… **including 2/2**), Equal Gift (#906, **target only** leftover AP == leftover MP ≥ 1; caster leftover unread), Hollow Gift (#837, **target only** leftover AP=0 **and** leftover MP=0), Gaunt Mend (#849, **both bodies leftover AP=0 and leftover MP=0**), Lean Gift (#962, leftover **AP = 0 and leftover MP ≥ 1**), Dry Mend (#747, both leftover **AP = 0**, MP unconstrained), Dry Gait (#802, both leftover **MP = 0**, AP unconstrained), Ready Sting (leftover AP≥1 **and** MP≥1 with **no sum**), Tied Gait (#906, leftover AP **and** leftover MP **exactly 2**). Legal pairs: (4,0) (0,4) (3,1) (1,3). The decision: two bodies **sum to 4 without tying** — Dual Keep 2/2 is Poise, **not** Score; Dual Keep 3/1 **is** Score; spend 1 from 2/2 to enter Tally (2,1) / (1,2), or sit on 3 leftover AP and 1 leftover MP. `healAmount` stays 0 on the row so `inferArchetype` (`enemyAI.ts` 447–452) does not treat a kit that only *carries* this id as healer; **healer CORE only** when the row is in a live pool.  
DURATION: instant  
SCALING: 8 follows heal% if any; amount otherwise fixed.  
SYNERGIES: Dual Keep 3/1 then Score Mend; Dual Keep 2/2 is the **wrong** window (Poise Mend); Score Sip **manufactures Tally** (3,1)→(2,1); Duel Turn keeps sum 4 while swapping the pair (4,0)↔(0,4) and (3,1)↔(1,3); Score Lend **cashes out** to sum 6; Tally Mend wants the opposite spend (sum 3).  
COUNTERPLAY: Spend so the sum leaves 4 (cast 1 AP from (3,1) → (2,1) **Tally**); dump to 2/2 (Poise); dump both pools to 0 (Gaunt); Cursed Wound; kill the cantor first.  
POWER_BUDGET: Standard heal, gated on **two** leftover sums **and** two inequality reads (six leftover reads). Blood Mend is 12 ungated self. Tally Mend is 8 on **two sum-3** bodies. Poise Mend is 8 on **two equal ≥ 1** bodies. Do not stack Score Mend with Tally Mend / Poise Mend / Equal Gift / Hollow Gift / Gaunt Mend / Lean Gift in the same CORE.  
AI_USAGE: `aiHint: "heal_if_both_bodies_leftover_ap_plus_mp_eq_4_and_unequal"`. Cantors / bishops. Skip if either leftover sum ≠ 4 **or** either body is tied. **Healer CORE only.** Do not dump leftover **only** to enable this if a Strike would kill.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop","queen"], levelZoneMin: 1 }`. MULTI child `score_cantor`.  
EDGE_CASES: Targeting ally already allows self (`targeting.ts` 184–189). Self-cast requires the caster’s leftover sum === 4 **and** unequal (two keys, two reads). Self-cast at leftover 0/0 **does not** collide with Hollow Gift / Gaunt Mend — sum 0 fails `scoreSumN`. Self-cast at leftover 2/2 **does not** collide with Poise Mend / Equal Gift / Tied Gait — `scoreForbidEqual` fails. Self-cast at leftover 3/0 **does not** collide with Tally Mend — sum 3 fails `scoreSumN`. Player-side HP actually increased → `challengeHealUsedRef`. Missing keys → no heal. Missing `scoreSumN` **or** missing `scoreForbidEqual` → fail closed. Do not clone Tally Mend / Poise Mend / Equal Gift / Gaunt Mend / Lean Gift / Dry Mend / Dry Gait. Target-only sum===4 heal stays Wave 17 / SDE. If same-day SDE Wave 16 claims this leftover, **SDE wins** — keep both-body vs their target-only the way Poise vs Equal Gift already split.  
IMPLEMENTATION_COMPLEXITY: LOW — six leftover reads + existing heal helper.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-score-mend
effectType: heal
effectCategory: heal
spellType: heal
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
effectParams: {"requireCasterLeftoverSumEqUnequal":true,"requireTargetLeftoverSumEqUnequal":true,"scoreSumN":4,"scoreForbidEqual":true,"scoreMendAmount":8}
```

---

### SPELL_ID: `spell-cadence-snuff`

NAME: Cadence Snuff  
ROLE: CONTROL — remaining CDs `n===1` become `0`  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"snuffRemainingCdsEq1To0":true}`. For each spell id in the **target’s** remaining-CD map with `n === 1`, write `0`. Zeros stay 0. Remaining `n>1` **unchanged**. Target **keeps every spell**. Once/battle flags and spell levels are **not** CDs. Distinct from Cadence Rise (#962, remaining `n===1` → `2` — the **opposite pad** on the same remaining), Cadence Prime (#953, remaining `n===0` → `1`; ones stay 1; `n>1` unchanged), Cadence Floor (#906, remaining `n>1` → `1`; **zeros stay 0**), Cadence Swap (#837, **exchange full remaining maps**), Cadence Lag (#849, remaining `n>0` → `n+2`), Cadence Stall (#590, remaining `n>0` → `n+1`; zeros stay 0), Cadence Stretch (#636, remaining ×2), Cadence Theft (#411, **steals** remaining), Cadence Imprint (#787, **copies** onto the caster; target keeps), Cadence Rest (#747, **own** remaining do not tick), Cadence Grace (#802, **next own spell does not start** its cooldown), Cadence Halve (#726, **÷2** on the hostile), Cadence Trim (−1 on the hostile), Cadence Crack (highest → 0), Cadence Flush (all → 0). The decision: **one-tick locked** Inferno / Strike-adjacent tools become remaining 0 — they recast **now**, not next turn — without Floor-compressing an already-locked Inferno 3 and without Rise-padding the lock to 2. Remaining 1 is “ready next turn”; Snuff is a **one-tick ready-unlock**, the inverse of Prime and the inverse of Rise. Not Hex of Silence (fizzle the bar) and not Quiet Hex (next spell +1 AP). Do **not** mint `spell-cadence-kill`.  
DURATION: instant rewrite of remaining `n===1`  
SCALING: none.  
SYNERGIES: Verse Score after you unlocked their last remaining-1 id to 0; Prime then Snuff is a two-step no-op on zeros that Prime just wrote to 1 (Prime 0→1, Snuff 1→0); Rise then Snuff is a two-step no-op the other way if they CORE (they must **not**). Floor / Lag / Stall are the **compress / pad** cousins — do not CORE both; Crack / Flush are the **zero-everything** cousins — do not CORE both.  
COUNTERPLAY: Recast the remaining-1 id **before** Snuff (then remaining is already 0 or the id is spent); Cadence Break your own remaining after; Cadence Swap (#837) to dump the snuffed map onto someone else; Rise your own remaining 1 to 2 before they Snuff.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **handing the ready bar back for this tick**, not a steal, copy, pad, compress, or map swap. Do not CORE with Rise / Prime / Floor.  
AI_USAGE: `aiHint: "snuff_if_target_has_remaining_cd_eq_1_on_a_nuke"`. Scribes / tempo. Skip if every remaining is already ≠ 1, or if the only remaining-1 id is Strike and a Strike from **you** would kill.  
DISCOVERY_ELIGIBILITY: true. MULTI child `snuff_precentor`. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing key → no rewrite. Do not write `spellLevelValues`. Do not reset Dual Keep’s once/battle. Preview must show which remaining drop from 1 to 0. All-non-1 remaining → fizzle rider (AP spent, observe). Do **not** reuse `floorRemainingCdsTo1` / `primeRemainingCdsFrom0`. If same-day SDE Wave 16 claims this leftover, **SDE wins** — do not keep a second Snuff id. Rise already owns `1→2`; this card is `1→0` even if SDE later stamps a second Rise alias.  
IMPLEMENTATION_COMPLEXITY: LOW — walk remaining map, write 0 when n===1.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-cadence-snuff
effectType: debuff
effectCategory: control
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
effectParams: {"snuffRemainingCdsEq1To0":true}
```

---

### SPELL_ID: `spell-hendeca-span`

NAME: Hendeca Span  
ROLE: SUMMONS — eleven-cell occupy (stretched plus)  
ACQUISITION: MULTI_SOURCE  
AP_COST: 4  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "hendecaspan"`, `summonLifespan: 4`, empty kit (`summonUnitDef` with `pieceType: ""` / zero scales — a body, not a caster). `effectParams: {"hendecaSpanCells":11,"hendecaLongArm":3,"hendecaShortArm":2}`. Click a free ground tile. That click is the **center** of a plus (unlike Dec Span, whose click is the cell of a 2×5 closest to the caster). Facing = 8-dir from **caster to click**. If `|dx| >= |dy|` the **long** axis is x (file): occupy the center plus 3 cells each way along x (7-cell spine) and 2 cells each way along y (5-cell crossbar). Else the long axis is y (rank): 7 along y, 5 along x. Shared center counted once: 7 + 4 = **11**. All 11 cells must be free and in-bounds (`isCellFree`); else fizzle (AP spent). One combatant id, eleven-cell footprint. Every cell of the 11 is occupied (not a cage hole). Counts as **eleven** toward the summon cap. Distinct from Twin Span (2 walking), Triple Span (3), Quad Span (2×2 = 4), Penta Span (ortho plus radius 1 = 5), Six Span (2×3 = 6), Sept Span (#726, stretched plus **longArm 2 / shortArm 1** = 5-spine × 3-crossbar = **7**), Oct Span (#849, hollow 3×3 = 8, **center hole unoccupied**), Nine Span (#890, solid 3×3 = 9, **square**), Dec Span (#953, axis-aligned 2×5 = 10, **rectangle**, click is nearest cell). The decision: seal a 7-file with 5-rank wings for eleven cap — a corridor plug with shoulders, not a 2×5 slab and not a 3×3 block — or you cannot afford the weight.  
DURATION: lifespan 4  
SCALING: footprint fixed.  
SYNERGIES: File Lance / Cast Sill / Score Sill on a neighbor; Quiet Sill on an arm tip so Strike cannot peel through; Swap / Reach Fold to extract an ally trapped against the plus.  
COUNTERPLAY: Occupy any of the 11 before paint; Coup the body (one HP pool); blink / swap around the plus; walk the diagonal gaps (the plus has no diagonal cells — that is the counterplay vs Nine Span’s solid square).  
POWER_BUDGET: Heavy 4 / CD 3 / 0 damage. Power is **eleven** cells of deny along a stretched plus. Heavier than Dec Span’s ten-rectangle because the extra cell is a crossbar shoulder, and lighter on diagonals than Nine Span’s nine-square.  
AI_USAGE: `aiHint: "hendeca_span_if_eleven_free_plus_and_cap_allows"`. Masons / rooks ELITE. Skip if any of the 11 cells is occupied **or** remaining summon weight + 11 would exceed cap. Prefer a plus whose spine splits the player from an exit along a rank or file.  
DISCOVERY_ELIGIBILITY: true. MULTI child `span_hendeca`. `pieceTypes: ["rook"]`, `levelZoneMin: 2`  
EDGE_CASES: **Do not ship while `ENEMY_SUMMON_CAP === 2` without occupy-weight.** Never parse `"Hendeca Span"` / `"Eleven"` / `"Undec"`. One id, eleven cells — destroying the body frees all eleven. Player-side Hendeca Span counts toward the **player** summon economy, not `ENEMY_SUMMON_CAP`. Missing `hendecaSpanCells` → do not spawn a 1-cell body and call it Hendeca Span. Missing `hendecaLongArm` / `hendecaShortArm` → do not guess 3×3 (that is Nine Span), 2×5 (that is Dec Span), or longArm 2 / shortArm 1 (that is Sept Span). Off-map cell → fizzle. Do not mint `spell-eleven-span` / `spell-undec-span`. Cardinal click with `dx===0 && dy===0` is illegal (`freeCells` / caster tile). Diagonal click uses the `|dx| >= |dy|` tie-break (file-long). Center is occupied (Oct Span’s hole stays Oct).  
IMPLEMENTATION_COMPLEXITY: HIGH — multi-cell occupy + cap weight. Same class as Quad / Penta / Six / Sept / Oct / Nine / Dec.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-hendeca-span
effectType: summon
spellType: summon
targetType: ground
areaShape: single
apCost: 4
mpCost: 0
damage: 0
range: 2
cooldown: 3
freeCells: true
usableByPlayer: true
usableByEnemy: true
minLevel: 2
isSummon: true
summonAI: hendecaspan
summonLifespan: 4
isBaseSpell: false
effectParams: {"hendecaSpanCells":11,"hendecaLongArm":3,"hendecaShortArm":2}
```

---

### SPELL_ID: `spell-duel-turn`

NAME: Duel Turn  
ROLE: CONTROL — invert leftover AP↔MP on **two** hostiles; caster stays  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. **Not** `isSwap`. `effectParams: {"invertTwoHostilesLeftoverApMp":true,"invertTwoHostilesSearchRadius":3}`. Target one living hostile. Find the nearest **other** living hostile within Chebyshev `invertTwoHostilesSearchRadius` of **that target** (not of the caster). Snapshot each body’s leftover AP and leftover MP, then write leftover AP ← leftover MP and leftover MP ← leftover AP on **each** body independently, each **capped at that pool’s max**. Caster leftover **unchanged**. Caster does not move. If no second body, fizzle (AP spent). Distinct from Purse Turn (#953, **one** hostile invert via `invertHostileLeftoverApMp` — **do not reuse that key**), Tempo Invert (#282, **one-body ally/self** leftover AP↔MP via `invertApMp` — **do not reuse that key**), Bar Cross (#890, **two-body leftover cross**: caster AP ↔ target MP **and** caster MP ↔ target AP via `crossLeftoverApMpTwoBody` — **do not reuse that key**), Dual Keep (banks leftover AP **and** MP on **one** body, no swap), Swap / Pawn Trade (**tiles**), Loan Tempo / Tempo Gift (**grants**), Drain Courage (AP debit), Soul Sip (ungated MP steal). The decision: two bishops sit on (4,0) and (0,4) ready to Strike / walk — turn both purses and they swap roles without moving. Sum is invariant on each body: a Score pair stays Score; a Tally pair stays Tally; a Poise pair stays Poise (equal invert is a no-op on that body). Do **not** mint `spell-twin-turn` / `spell-foe-pair`.  
DURATION: instant leftover rewrite; no snap-back at turn end  
SCALING: none. Caps at each pool’s max.  
SYNERGIES: Score Mend / Score Sting after the invert **keeps** sum 4; Must Score after you dump their AP into MP; Tally Sip is **not** this card; Dual Keep leftover that survives is legal input.  
COUNTERPLAY: Isolate (one body); keep leftover AP === leftover MP on both so both inverts are no-ops; Quiet Hex after they invert into a 3-AP spell; Strike before they recast.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **turning two hostile purses**, not a grant, not a tile swap, not a one-body invert, and not a two-body cross through the caster. Do not CORE with Tempo Invert, Purse Turn, or Bar Cross.  
AI_USAGE: `aiHint: "duel_turn_if_two_hostiles_leftover_ap_ge_2_and_leftover_mp_eq_0_or_inverse"`. Hex / queens. Skip if pack size < 2. Skip if both leftover pairs are already equal (double no-op). Skip if both leftover pairs are 0/0. Skip if a Strike would kill. Enemy caster: the two hostiles are **player-side**.  
DISCOVERY_ELIGIBILITY: true. Piece observe. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing keys → no rewrite. Do not write max AP/MP. Do not write Dual Keep’s once/battle. Preview must show both leftover pairs after the invert. Self-target is illegal (`targetType: enemy`). One body → fizzle rider (AP spent, observe). Three-body ties: nearest Chebyshev, then lowest id. Do not call `swapPositions`. Do not reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody`. Two 0/0 bodies → fizzle rider so AI skip matches. If same-day SDE Wave 16 claims this leftover, **SDE wins**.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — nearest-other search + two independent leftover inverts.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-duel-turn
effectType: debuff
effectCategory: control
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
effectParams: {"invertTwoHostilesLeftoverApMp":true,"invertTwoHostilesSearchRadius":3}
```

---

### SPELL_ID: `spell-score-hood`

NAME: Score Hood  
ROLE: DEFENSE — next applied hit is 0 while leftover AP + leftover MP === 4 **and leftover AP ≠ leftover MP**, any range  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"scoreHoodNextHit":true,"scoreSumN":4,"scoreForbidEqual":true}`. Arm a one-hit consume: the next applied hit on the caster is 0 **if at impact** leftover AP + leftover MP **=== 4** **and leftover AP ≠ leftover MP**. Any Chebyshev. The charge remains if the hit arrives while the sum ≠ 4 **or** the body is tied (hit lands fully; charge stays). Distinct from Tally Hood (#953, leftover AP + leftover MP === 3), Poise Hood (#890, leftover AP === leftover MP ≥ 1), Spent Plate (#837, leftover **AP ≥ 1**, MP unconstrained), Gait Plate (#802, leftover **MP ≥ 1**, AP unconstrained), Dry Plate (#962, leftover **MP = 0**), Even Hood (#849, **even Chebyshev**), Odd Hood (odd Chebyshev), Near / Mid / Far Hood (range bands), Odd Plate (#906, leftover **AP odd**). The decision: hold (3,1) through the hit — Dual Keep 2/2 is Poise Hood, **not** this — or spend into 2/2 and Poise Hood still works, this does not. Do **not** CORE with Spent Plate, Gait Plate, Poise Hood, or Tally Hood. Do **not** retag `even_gallery`.  
DURATION: until consumed or battle end (one hit)  
SCALING: none.  
SYNERGIES: Duel Turn to **keep** sum 4 while changing which pool is fat; Score Lend **exits** (do not lend into a hit you wanted blanked); Cadence Snuff on the attacker so they recast into the hood this turn.  
COUNTERPLAY: Wait until they spend a pool off 4; Drain Courage / Slow to break the sum or force a tie; Coup / execute that does not count as “applied hit” stays out of scope.  
POWER_BUDGET: Cheap 2 / CD 2. Power is **holding a sum of 4 without tying**, not a range band and not a tie.  
AI_USAGE: `aiHint: "score_hood_if_leftover_ap_plus_mp_eq_4_and_unequal"`. Lurkers / knights ELITE. Skip if leftover sum ≠ 4 **or** leftover AP === leftover MP.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Missing key → no arm. Hit while leftover 0/0 lands and **does not** consume (Gaunt window). Hit while leftover 2/2 lands and **does not** consume (Poise Hood would). Hit while leftover 3/0 lands and **does not** consume (Tally Hood would). Do not clone Poise Hood / Tally Hood / Spent Plate / Gait Plate / Dry Plate / Even Hood.  
IMPLEMENTATION_COMPLEXITY: LOW — one consume flag + leftover sum + inequality at impact.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-score-sting`

NAME: Score Sting  
ROLE: DAMAGE — 10; +8 iff target leftover AP + leftover MP === 4 **and leftover AP ≠ leftover MP**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. Then if the target’s leftover AP + leftover MP **=== 4** **and leftover AP ≠ leftover MP**, deal `scoreStingBonus` (8) as a second existing `dealDamage` call. `effectParams: {"scoreLeftoverSumEqUnequal":true,"scoreSumN":4,"scoreForbidEqual":true,"scoreStingBonus":8}`. Distinct from Tally Sting (#953, leftover AP + leftover MP === 3), Poise Sting (#890, leftover AP === leftover MP ≥ 1), Gaunt Sting (#849, leftover **both 0**), Lean / Dry / Ready / Full / Even Sting (#962, leftover AP **even and ≥ 2** — (2,2) is even AP, which is Poise, not Score), Odd Sting (#906, leftover **AP odd**), Tied Gait (#906, both leftover **exactly 2**). The decision: poke the (3,1) bishop for 18, or poke anyone for 10. Dual Keep 2/2 is the **wrong** window (Poise Sting).  
DURATION: instant  
SCALING: 10 and 8 follow dmg%.  
SYNERGIES: Duel Turn to **keep** them in Score while swapping the pair; Score Hold so they cannot walk off leftover MP; Dual Keep 3/1 is the **right** window.  
COUNTERPLAY: Spend off sum 4; sit on 2/2 (Poise) or 3/0 (Tally) or 0/0 (Gaunt).  
POWER_BUDGET: Cheap. 10 if they are off-window (Strike-equal). 18 if they sit on a Score pair (Frost-adjacent, two hits).  
AI_USAGE: `aiHint: "score_sting_if_target_leftover_ap_plus_mp_eq_4_and_unequal"`. Lurkers / pawns. Skip the id if the target is not in the window **and** a Strike would kill; 10 still lands if you cast it anyway.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing bonus key → 10 only. Missing `scoreSumN` **or** missing `scoreForbidEqual` → no bonus. Target leftover 2/2 → 10 only (Poise Sting’s window). Target leftover 3/0 → 10 only (Tally Sting’s window). Two hits, two Mark chances if the dest tile is marked.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-score-step`

NAME: Score Step  
ROLE: POSITION — caster lands adjacent to an ally whose leftover AP + leftover MP === 4 **and leftover AP ≠ leftover MP**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `freeCells` on the dest. `effectParams: {"scoreStepNeedSumEqUnequal":true,"scoreSumN":4,"scoreForbidEqual":true,"scoreStepAdj":1}`. Target an ally (not self) whose leftover AP + leftover MP **=== 4** **and leftover AP ≠ leftover MP**. The caster **relocates** to a free cell at Chebyshev 1 of that ally (player picks the dest among legal neighbors; AI picks the safest). If the ally is not in the window or no neighbor is free, fizzle (AP spent, no move). Distinct from Tally Step (#953, ally leftover sum === 3), Poise Step (#890, ally leftover AP === leftover MP ≥ 1), Gaunt Step (#849, ally leftover **both 0**), Home / Heave / Parched / Ally Step, Hinge Step, Relay Dash. The decision: blink next to the (0,4) wisp — they have walk, you have position — or wait for a 2/2 and Poise Step.  
DURATION: instant  
SCALING: none.  
SYNERGIES: Score Lend **after** you arrive (cashes them out); Score Mend from the new cell if **you** also sit on sum 4 unequal.  
COUNTERPLAY: Occupy every neighbor; break the ally’s sum or force a tie before the step.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **gated relocate**, not a blink-anywhere (Mist Step / Phase Slip).  
AI_USAGE: `aiHint: "score_step_if_ally_sum_eq_4_unequal_and_free_adj"`. Porters / queens. Skip if the ally is not in the window or every neighbor is occupied.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Self-target illegal. Dest hazard **must tick**. `movedThisTurn` = true on a successful relocate. Missing keys → no move. Do not call `isSwap`.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — leftover sum + inequality gate + occupy dest.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-score-sill`

NAME: Score Sill  
ROLE: TERRAIN — occupant with leftover AP + leftover MP === 4 **and leftover AP ≠ leftover MP** at **start of their turn** takes 8  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell for 2 turns. `effectParams: {"scoreSillNeedSumEqUnequal":true,"scoreSumN":4,"scoreForbidEqual":true,"scoreSillDamage":8,"scoreSillDuration":2}`. At the **start of a combatant’s turn**, if they occupy this cell and leftover AP + leftover MP **=== 4** **and leftover AP ≠ leftover MP**, deal 8 through `updateCombatant`. Walk-enter does **not** tax (Ingress / Shove Sting). End-turn occupy does **not** tax (Score Post / Dwell). Relocate landing does **not** tax (Drift Post). Distinct from Tally Sill (#953, leftover sum === 3 at start), Poise Sill (#890, leftover AP === leftover MP ≥ 1 at start), Gaunt Sill (#849, leftover **both 0** at start), Wake Mark (start-turn any leftover), Quiet / Cast / Drift / Parched Sill. The decision: stand on the sill at (3,1) and eat 8 at dawn, or spend a pool overnight, or sit on 2/2 and eat Poise Sill instead.  
DURATION: 2 turns  
SCALING: 8 follows dmg% if any; otherwise fixed.  
SYNERGIES: Score Hold so they cannot walk off before their start; Dual Keep 2/2 is the **wrong** dawn (Poise Sill). Dual Keep 3/1 is the **right** dawn.  
COUNTERPLAY: Spend off 4 before turn start; walk off (start-only); Barrier last-writer fills the paint.  
POWER_BUDGET: Cheap 2 / CD 2. Power is **start-of-their-turn occupy on a sum of 4 without tying**.  
AI_USAGE: `aiHint: "score_sill_if_tile_will_be_occupied_by_sum_eq_4_unequal_foe"`. Masons / rooks. Skip if the tile is empty and no foe can occupy it this round.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Paint is observation. Later tick is not a second observe. Occupant leftover 2/2 at start → no tax (Poise Sill’s window). Occupant leftover 3/0 at start → no tax (Tally Sill’s window). Empty tile → no tax. Last writer vs other paints: Barrier > sill.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — start-of-turn leftover sum + inequality gate. Same class as Tally Sill / Poise Sill / Gaunt Sill / Wake Mark.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-score-hold`

NAME: Score Hold  
ROLE: CONTROL — cannot spend walk MP while leftover AP + leftover MP === 4 **and leftover AP ≠ leftover MP**  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"scoreHoldWhileSumEqUnequal":true,"scoreSumN":4,"scoreForbidEqual":true,"scoreHoldDuration":2}`. For 2 of the **target’s** turns, any walk that would spend ≥ 1 leftover MP is illegal **while leftover AP + leftover MP === 4 and leftover AP ≠ leftover MP**. Teleport / Swap / Phase Slip / Twin-gate step / Score Step (caster relocate) do **not** pay walk MP and are legal. Distinct from Tally Hold (#953, cannot walk while leftover sum === 3), Poise Hold (#890, cannot walk while leftover AP === leftover MP ≥ 1), Odd Hold (#849, cannot walk while leftover AP is **odd**), Dry Hold (until leftover **AP = 0**), Drift Hold (until **force-moved**), Cast Hold / Strike Hold / Boot Hold / Tool Hold / Gaunt Hold. The decision: they have (0,4) and wanted to walk four tiles — they must **leave sum 4 or tie** (cast leftover AP from a (3,1) / (1,3) / (4,0), get siphoned, get turned) before walking, or wait 2 turns. At leftover (0,4) they **have** MP but cannot spend it while this hold is up. At leftover 2/2 walk is Poise Hold’s window, **not** this. At leftover 0/0 they have 0 MP anyway (Gaunt window).  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Duel Turn to **keep** them in Score while changing which pool is fat; Score Lend **exits** the hold’s walk-lock (sum 6). Do **not** CORE with Must Score as a Strike lock (this pass ships no Strike-only score lock).  
COUNTERPLAY: Spend leftover AP (cast) to leave sum 4; blink; wait. From (0,4) they have no leftover AP to cast with — Duel Turn / Purse Turn into (4,0) then Strike, or wait.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **walk denial while sum is 4 without tying**, not a root.  
AI_USAGE: `aiHint: "score_hold_if_target_leftover_ap_plus_mp_eq_4_unequal_and_wants_to_walk"`. Hex / knights ELITE. Skip if leftover sum ≠ 4 **or** leftover AP === leftover MP.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Missing keys → no arm. Leftover 2/2 → walk legal under **this** lock (sum 4 but tied; Poise Hold’s window). Leftover 3/0 → walk legal under **this** lock (sum 3; Tally Hold’s window). Leftover 0/0 → walk illegal for lack of MP, not because of this hold. Do not clone Tally Hold / Poise Hold / Odd Hold / Dry Hold.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — walk-spend gate + leftover sum + inequality.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-score-lend`

NAME: Score Lend  
ROLE: SUPPORT — +1 current AP **and** +1 current MP to an ally whose leftover AP + leftover MP === 4 **and leftover AP ≠ leftover MP** (**exits** the window)  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"scoreLendAp":1,"scoreLendMp":1,"requireTargetSumEqUnequalLend":true,"scoreSumN":4,"scoreForbidEqual":true}`. If the **target** has leftover AP + leftover MP **=== 4** **and leftover AP ≠ leftover MP**, grant +1 current AP and +1 current MP (capped at max). The sum becomes **6** (the score window **closes**). Inequality is preserved: (3,1)→(4,2), (4,0)→(5,1). This **cannot** manufacture Poise, because +1/+1 on an unequal pair stays unequal. If the gate fails, fizzle rider (AP spent, no grant). Distinct from Tally Lend (#953, +1/+1 if leftover sum === 3 — **exits** to 5), Poise Lend (#890, +1/+1 if leftover AP === leftover MP ≥ 1 — the **tie survives**), Gaunt Lend (#849, +1/+1 if leftover **both 0**), Lean / Drift / Spent Lend, Watch Alms, Tempo Gift / Loan Tempo / Haste, Dual Keep. The decision: cash the (3,1) wisp for a 2-resource bump, then they are out of Score **and** out of Tally **and** out of Poise (sum 6 is 4/2 or 5/1 or 3/3 would require a tie that this gate never starts from). Poise Lend **keeps** a window; this **spends** one.  
DURATION: instant grant  
SCALING: none. Caps at max.  
SYNERGIES: Dual Keep to **bank** the new leftover (now a 4/2 or similar — not Score, not Tally, not Poise); Must Score **before** the lend while they still sit on 4 unequal.  
COUNTERPLAY: Drain Courage / Slow after the grant; kill the buffer; refuse the window so the lend fizzles.  
POWER_BUDGET: Cheap 2 / CD 2. Power is **cashing a sum of 4 without tying**, not keeping a tie. Do not CORE with Haste / Loan Tempo / Tally Lend / Poise Lend / Gaunt Lend.  
AI_USAGE: `aiHint: "score_lend_if_ally_sum_eq_4_and_unequal"`. Buffers / bishops. Skip if the ally is not in the window **or** both pools are already at max.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Self-cast legal if caster leftover sum === 4 **and** unequal after paying 2 AP. Missing keys → no grant. Target leftover 2/2 → fizzle (Poise Lend’s window). Target leftover 3/0 → fizzle (Tally Lend’s window). Target leftover 0/0 → fizzle (Gaunt Lend’s window). Do not clone Tally Lend / Poise Lend / Gaunt Lend / Haste / Dual Keep.  
IMPLEMENTATION_COMPLEXITY: LOW — leftover sum + inequality gate + two capped grants.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-score-sip`

NAME: Score Sip  
ROLE: CONTROL — steal 1 leftover AP iff target leftover AP + leftover MP === 4 **and leftover AP ≠ leftover MP**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: No HP damage. `effectParams: {"scoreSipAp":1,"requireTargetSumEqUnequalSip":true,"scoreSumN":4,"scoreForbidEqual":true}`. If the target leftover AP + leftover MP **=== 4** **and leftover AP ≠ leftover MP** **and** leftover AP ≥ 1, subtract 1 leftover AP from the target (not below 0) and add 1 leftover AP to the caster this turn, capped at max. If leftover AP is 0 (the (0,4) pair) or the sum ≠ 4 or the body is tied, fizzle rider (AP spent). Distinct from Tally Sip (#953, steal 1 leftover AP iff leftover sum === 3), Poise Sip (#890, steal 1 leftover AP iff leftover AP === leftover MP ≥ 1), Bare Sip (#849, steal 1 leftover AP iff leftover **MP = 0**), Soul Sip (ungated current MP), Ap Sip (#342). The decision: sip (3,1) → they become (2,1) **Tally**; sip (4,0) → they become (3,0) **Tally**; sip (1,3) → they become (0,3) **Tally**. **Sip manufactures Tally.** Dual Keep 2/2 is the **wrong** window (Poise Sip).  
DURATION: instant (current-turn leftover only)  
SCALING: amount fixed.  
SYNERGIES: Tally Sting / Tally Mend **after** manufacturing 2/1 or 3/0; Score Hold so they cannot walk the remaining MP.  
COUNTERPLAY: Sit on (0,4) (no AP to steal); sit off sum 4; sit on 2/2 (Poise); Second Wind after.  
POWER_BUDGET: Cheap control, 0 damage, CD 1.  
AI_USAGE: `aiHint: "score_sip_if_target_sum_eq_4_unequal_and_leftover_ap_ge_1"`. Hex / pawns. Skip if not in the window or leftover AP is 0.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Do not write `debuffStat: "ap"`. Missing keys → no steal. Target leftover 2/2 → fizzle (Poise Sip’s window). Target leftover 3/0 → fizzle (Tally Sip’s window). Challenge: not a heal, not MP. Tally Sip on (2,1) → (1,1) **Poise** is the cousin manufacture; do not name-wire either hop.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-score-post`

NAME: Score Post  
ROLE: SUMMONS — empty-kit mine; end-turn occupy detonates iff leftover AP + leftover MP === 4 **and leftover AP ≠ leftover MP**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "scorepost"`, `summonLifespan: 3`, empty kit. `effectParams: {"scorePostDetonateDamage":10,"scorePostNeedSumEqUnequal":true,"scoreSumN":4,"scoreForbidEqual":true}`. Place on a free ground tile. At **end of a combatant’s turn**, if they **occupy** this body and leftover AP + leftover MP **=== 4** **and leftover AP ≠ leftover MP**, deal 10 to that occupant through `updateCombatant` and this summon dies. Walk-enter does **not** detonate (Ingress). Relocate landing does **not** detonate (Drift Post). Start-of-turn does **not** detonate (Wake / Gaunt Sill / Poise Sill / Tally Sill / Score Sill). Distinct from Tally Post (#953, leftover sum === 3), Poise Post (#890, leftover AP === leftover MP ≥ 1), Gaunt Post (#849, leftover **both 0**), Lean Post (leftover **AP = 0** only), Dummy Post (taunt), Drift Post (**relocate landing**), Dwell Mark (**end-turn occupy, any leftover**). The decision: end the turn on (3,1) and eat 10, or spend a pool, or dump to 2/2 and eat Poise Post instead, or dump to 3/0 and eat Tally Post, or dump to 0/0 and eat Gaunt Post. Dual Keep 2/2 **hurts Poise Post, not this**. Dual Keep 3/1 **hurts this**. Walk-safe. Relocate-safe. Start-turn-safe.  
DURATION: lifespan 3 or until detonate  
SCALING: 10 follows damage% if any; otherwise fixed.  
SYNERGIES: Score Hold so they cannot walk off; Duel Turn **keeps** sum 4 through the end-turn check.  
COUNTERPLAY: Spend a pool before turn end; walk off (walk-safe); Coup the post; blink.  
POWER_BUDGET: Standard 3 / CD 3 / 0 upfront. Power is **end-turn occupy on a sum of 4 without tying**. Counts as **one** toward the summon cap.  
AI_USAGE: `aiHint: "score_post_if_foe_will_end_turn_sum_eq_4_unequal_on_tile"`. Masons / pawns. Skip if cap is full.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","rook"]`, `levelZoneMin: 1`  
EDGE_CASES: **Summon is observation.** Later detonate / death is not a second observe. Missing keys → do not spawn a Dummy Post. Occupant leftover 2/2 at turn end → no detonate (Poise Post’s window). Occupant leftover 3/0 → no detonate (Tally Post’s window). Occupant leftover 0/0 → no detonate (Gaunt Post’s window). Empty tile → no detonate, lifespan ticks. Never parse `"Score Post"`. Do not mint `spell-score-burst`. Prefer fizzle-and-detonate if the body is displaced by Swap (body gone → no tile tax).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — empty-kit summon + end-turn leftover sum + inequality gate. Same class as Tally Post / Poise Post / Gaunt Post / Lean Post.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-score-bounce`

NAME: Score Bounce  
ROLE: DAMAGE — 12 to primary; bounce 1 to nearest other leftover-AP+MP===4 **unequal** hostile  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 12 to primary (ungated). `effectParams: {"scoreBounceNeedSumEqUnequal":true,"scoreSumN":4,"scoreForbidEqual":true,"scoreBounceSearchRadius":4,"scoreBounceCount":1}` — search Chebyshev ≤ 4 for the nearest **other** living hostile whose leftover AP + leftover MP **=== 4** **and leftover AP ≠ leftover MP**; deal 12 to that body too. Primary leftover unconstrained. Distinct from Tally Bounce (#953, second body leftover sum === 3), Poise Bounce (#890, second body leftover AP === leftover MP ≥ 1), Gaunt Bounce (#849, second body leftover **both 0**), Parched Bounce (leftover **MP = 0**), Heave Bounce (**force-moved**), Chain Lightning (nearest **any**, 2 bounces). The decision: open on whoever, splash the (3,1) bishop — or wait for two 2/2 bodies and Poise Bounce. Dual Keep 2/2 is the **wrong** second body.  
DURATION: instant  
SCALING: 12 follows damage%.  
SYNERGIES: Duel Turn a second body into Score before the bounce search; Score Hold to keep them in-window.  
COUNTERPLAY: Isolate (one Score body); sit the second body on 2/2 or 3/0 or 0/0.  
POWER_BUDGET: Standard. 12 if no second Score body; 24 if a second sits on sum 4 unequal.  
AI_USAGE: `aiHint: "score_bounce_if_second_sum_eq_4_unequal_hostile_in_r4"`. Queens / bishops. Skip if no second in-window body **and** a Strike would kill the primary; 12 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing bounce keys → 12 only. Primary leftover 2/2 does **not** block the primary hit. Ties: nearest Chebyshev, then lowest id. Do not hit allies. Second body leftover 2/2 is **not** a bounce target.  
IMPLEMENTATION_COMPLEXITY: LOW — one search + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-must-score`

NAME: Must Score  
ROLE: CONTROL — non-Strike illegal unless leftover AP + leftover MP === 4 **and leftover AP ≠ leftover MP** **and** the spell spends last AP  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"mustNonStrikeUnlessSumEqUnequalAndSpendsLastAp":true,"scoreSumN":4,"scoreForbidEqual":true,"scoreHoldDuration":2}`. For 2 of the **target’s** turns, any non-Strike spell is illegal unless, **before** this (their) spell’s AP is paid, leftover AP + leftover MP **=== 4** **and leftover AP ≠ leftover MP** **and** `apCost === leftover AP` (the spell spends last leftover AP). Strike / `physical_attack` stays legal. Walk stays legal unless a Score Hold is also up. Distinct from Must Tally (#953, leftover sum === 3 **and** last AP — **pre-spend odd sum**), Must Poise (#890, leftover AP === leftover MP ≥ 1 **and** last AP — **pre-spend equality**), Must Gaunt / Must Lean / Must Drift / Must Pace / Must Span / Must Step, Rite First (cannot Strike until a spell), Tool Hold (cannot tool until Strike). The decision: they sit on (3,1) with a 3-cost tool as their last packet, or they sit on (0,4) with walk MP and **no** leftover AP — Must Score **blocks** every non-Strike from (0,4) because leftover AP is 0 (cannot spend last AP). (4,0) spending a 4-cost last packet **is** legal and dumps them to (0,0) Gaunt. Dual Keep 2/2 is Must Poise’s window, **not** this.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Score Hold on (0,4) so they can neither walk nor non-Strike; Duel Turn (0,4)→(4,0) so a 4-cost last packet becomes legal. Do **not** CORE with a Strike-only score lock (none shipped).  
COUNTERPLAY: Strike; blink; wait 2 turns; Duel Turn / Purse Turn yourself if you own it.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **last-packet from a sum of 4 without tying**, not a silence.  
AI_USAGE: `aiHint: "must_score_if_target_leftover_sum_eq_4_unequal_and_has_a_last_packet_spell"`. Knights / pawns ELITE. Skip if leftover sum ≠ 4 **or** leftover AP === leftover MP. Do not arm if the only remaining legal verb is Strike and a walk would kill.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 2`  
EDGE_CASES: **Pre-spend leftover** (see §3.5). Missing keys → no lock. Leftover (2,2) → non-Strike still illegal under **this** lock (tied, Must Poise’s window). Leftover (3,0) → non-Strike still illegal under **this** lock (sum 3, Must Tally’s window). Leftover (0,0) → non-Strike illegal (Must Gaunt’s window, but this lock does not lift there). 0-AP tools (Timestep) are not “spending last AP”.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — pre-spend leftover sum + inequality + last-AP compare in the cast gate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-verse-score`

NAME: Verse Score  
ROLE: CONTROL — last resolved id illegal until leftover AP + leftover MP === 4 **and leftover AP ≠ leftover MP**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"verseScoreUntilSumEqUnequal":true,"scoreSumN":4,"scoreForbidEqual":true}`. The target’s **last resolved spell id** (the id they most recently spent AP on) cannot be recast until leftover AP + leftover MP **=== 4** **and leftover AP ≠ leftover MP**. Strike is not a spell id for this key. If they have no last resolved id, fizzle rider (AP spent). Distinct from Verse Tally (#953, lifts at leftover sum === 3), Verse Poise (#890, lifts at leftover AP === leftover MP ≥ 1), Verse Gaunt (#849, lifts at leftover **both 0**), Verse Lean / Verse Pace / Verse Tax, Once Verse / Stolen Verse / Summon Verse (#906, pets pay +1 AP to **recast** last id; the id stays legal), Last Mute / Hex of Silence. The decision: lock their Inferno until they sit on (3,1) — sitting on 2/2 **does not** lift (Verse Poise’s window); sitting on 3/0 **does not** lift (Verse Tally’s window); sitting on 0/0 **does not** lift (Verse Gaunt’s window). Instant lift if they already sit on sum 4 unequal at resolve (fizzle rider — do not arm a lock that is already lifted). Dual Keep 2/2 does **not** lift this.  
DURATION: until leftover sum === 4 **and** unequal, or battle end  
SCALING: none.  
SYNERGIES: Cadence Snuff so the locked id is also remaining 0 (they can recast it **this** turn if they also sit in-window); Score Hold so they cannot walk into a new leftover split.  
COUNTERPLAY: Sit on (4,0) / (0,4) / (3,1) / (1,3); recast a different id; wait. Dual Keep 2/2 does **not** lift this. Dual Keep 3/1 **does**.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **which leftover window lifts the last verse**, not a silence.  
AI_USAGE: `aiHint: "verse_score_if_target_last_id_is_their_win_condition"`. Hex / bishops. Skip if they have no last resolved id, or if they already sit on sum 4 unequal (instant lift — fizzle rider).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing keys → no lock. Verse Score does **not** lift at leftover 0/0 (Verse Gaunt), leftover 2/2 (Verse Poise), or leftover 3/0 (Verse Tally). Summon Verse (#906) is a recast tax, not a legality lock — do not merge the keys.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — last-id lock + leftover sum + inequality lift.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-snuff`

NAME: Court Snuff  
ROLE: SUPPORT — Cadence Snuff on **every other** body (init order)  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `effectParams: {"snuffRemainingCdsEq1To0":true,"courtSnuffExcludeCaster":true}`. In initiative order, every living combatant **except the caster** has remaining `n===1` rewritten to `0` (zeros stay 0; `n>1` unchanged), same rewrite as Cadence Snuff. Distinct from Court Prime (#953, mass Prime `n===0` → `1`), Court Floor (#890, mass Floor `n>1` → `1`, zeros stay 0), Court Lag (#849, mass Lag `n>0` → `n+2`), Court Imprint (mass Imprint), Court Dual / Court Keep / Court Stretch / Court Hinge / Court Shove / Court Fold, Cadence Snuff (one body), Cadence Flush (all → 0, ally), Cadence Swap (two-body map exchange), Cadence Rise (one body `1→2`). Player never owns this. Witness without grant.  
DURATION: instant rewrite  
SCALING: none.  
SYNERGIES: Kit with Cadence Snuff on the caster’s own target after, or Prime a remaining `n===0` after the board’s remaining-1 tools are already sitting at 0. Do **not** CORE with Court Prime / Court Floor.  
COUNTERPLAY: Recast before Court Snuff; Cadence Break your own remaining after; Rise your remaining 1 to 2 before the mass snuff; kill the regent.  
POWER_BUDGET: Signature 6 / CD 4 / 0 damage. Power is **board-wide ready-unlock**. Kit-only.  
AI_USAGE: `aiHint: "court_snuff_if_two_plus_foes_have_a_remaining_1_nuke"`. Kit-only regent. Skip if every other remaining is already ≠ 1.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. `NOT_PLAYER_LEARNABLE`. `court_snuff_regent` kit-only. Arm is observation for witness-only kits. Never written to owned ids.  
EDGE_CASES: Missing `courtSnuffExcludeCaster` → do not snuff the caster (fail closed, still observe). Do not write `spellLevelValues`. Do not mint `spell-court-drop`. Preview must list who snuffs. Do not reuse `courtPrimeExcludeCaster` / `courtFloorExcludeCaster`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — init-order walk + Cadence Snuff rewrite. Same class as Court Prime / Court Floor / Court Lag.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-court-snuff
effectType: debuff
effectCategory: control
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
effectParams: {"snuffRemainingCdsEq1To0":true,"courtSnuffExcludeCaster":true}
```

---

## 6. Combination matrix (statuses × leftover × terrain)

| Window | Tools |
| :--- | :--- |
| Leftover AP + leftover MP **=== 4 AND unequal** on an **ally** | Score Mend (both bodies), Score Step, Score Lend (**exits** to 6, stays unequal) |
| Same window on a **hostile** | Score Sting, Score Sill (their turn start), Score Hold (cannot walk), Score Sip (**manufactures Tally** from (3,1)→(2,1) / (4,0)→(3,0) / (1,3)→(0,3)), Score Post (their turn end), Score Bounce (second body), Must Score (self, pre-spend), Verse Score (lifts here), Duel Turn (**keeps** the sum on both bodies) |
| Same window on **self** | Score Hood, Must Score |
| Leftover AP + leftover MP **=== 3** | **Not this pass.** Tally\*. Score keys fail `scoreSumN === 4`. |
| Leftover AP === leftover MP **and leftover AP ≥ 1** | **Not this pass.** Poise\* / Equal Gift. Score keys fail `scoreForbidEqual` (2/2 is sum 4 **and** a tie). |
| Leftover AP = 0 **and** leftover MP = 0 | **Not this pass.** Gaunt / Hollow Gift / Bare Sip / Verse Gaunt. Score keys fail (sum 0). |
| Dual Keep / Purse Keep / Stride Keep surviving **2/2** | **Opens** every Poise gate. **Blocks** every Score gate (`scoreForbidEqual`) **and** every Tally gate (sum 4 ≠ 3) **and** every Gaunt gate. Spend 1 pool to enter Tally (2,1) / (1,2). |
| Dual Keep surviving **3/1** or **1/3** | **Opens** Score. **Blocks** Tally (sum 4 ≠ 3), Poise (unequal), and Gaunt. |
| Dual Keep surviving **4/0** or **0/4** | **Opens** Score. **Blocks** Tally / Poise / Gaunt. |
| Dual Keep surviving **3/0** or **0/3** | **Opens** Tally. **Blocks** Score (sum 3). |
| Remaining CD `n===1` on a hostile | Cadence Snuff / Court Snuff (ready-unlock). Rise does **not** write 0. Prime does **not** touch ones. |
| Stretched-plus 7×5 free | Hendeca Span occupies all eleven. Dec Span would have painted a 2×5 rectangle. Sept Span would have painted longArm 2 / shortArm 1 = 7. |
| Two hostile leftover pairs | Duel Turn inverts AP↔MP on **each** body. Purse Turn stays one hostile. Tempo Invert stays ally. Bar Cross moves leftover **across caster and one target**. |

Dual Keep leftover that survives turn start with **unequal** banks that do **not** sum to 4 (3/0, 5/0) **blocks** Score **and** Poise **and** Gaunt. 3/0 **opens Tally**. Spend or Duel Turn / Purse Turn to enter a window.

Score Sip on (3,1) → (2,1) is the **intended** Tally manufacture. Tally Sip on (2,1) → (1,1) is the **intended** Poise manufacture. Do not name-wire either hop; they fall out of the leftover writes.

---

## 7. Implementation order (not this pass)

1. Discovery ownership split (`SDE-2026-08-31-001`) — without it every Wave-16 id forced into `starterSpells` becomes always-owned.
2. Leftover AP / leftover MP writers (HUD pools after each spend). Dual Keep / Purse Keep / Stride Keep must write surviving leftover at turn start.
3. Cadence remaining-CD maps (already required by Waves 5–15). Cadence Floor (#906) is remaining `n>1` → `1`. Cadence Prime (#953) is remaining `n===0` → `1`. Cadence Rise (#962) is remaining `n===1` → `2`. Cadence Snuff is remaining `n===1` → `0`.
4. Occupy-weight **before** Hendeca Span (cap 2 cannot host weight 11). Dec Span (weight 10) / Nine Span (weight 9) / Oct Span (weight 8) have the same prerequisite.
5. Confirm gates for Must Score (pre-spend) / Score Hold / Verse Score / Duel Turn.
6. Stretched-plus multi-cell occupy (`hendecaspan`) and empty-kit mine (`scorepost`).
7. Do **not** land `spell-parched-mend`. Do **not** land a second `spell-cadence-floor` / `spell-cadence-prime` / `spell-cadence-rise`. Do **not** reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `floorRemainingCdsTo1` / `primeRemainingCdsFrom0` / `tallySumN`.

Do not implement production code in this pass.

---

## 8. QA (design-level)

| ID | Check |
| :--- | :--- |
| W16-1 | No Wave-16 id appears in `spellData.ts` / `SPELL_ID_CATALOG` / §1.4 tombstone |
| W16-2 | `spell-parched-mend` is **not** shipped; Dry Gait owns leftover-MP=0 heal |
| W16-3 | `spell-score-mend` requires leftover AP + leftover MP **=== 4** **and unequal** on **both** bodies. (2,2) fails. Tally Mend owns **sum === 3**. Poise Mend / Equal Gift own **equality ≥ 1**. Hollow Gift / Gaunt Mend own **0 + 0**. Lean Gift owns AP=0 and MP≥1 |
| W16-4 | Cadence Snuff is remaining `n===1` → `0`; `n>1` unchanged; zeros stay 0. Does **not** clone Cadence Rise (`1→2`) / Prime (`0→1`) / Floor / Swap / Lag / Halve / Crack / Flush |
| W16-5 | Hendeca Span is stretched plus longArm 3 / shortArm 2, counts as **eleven**, every cell occupied, click is **center**. Dec Span stays 2×5 ten. Nine Span stays solid nine. Oct Span stays hollow eight. Sept Span stays longArm 2 / shortArm 1 = seven |
| W16-6 | Duel Turn is two-hostile independent leftover AP↔MP. Does **not** clone Tempo Invert, Purse Turn, or Bar Cross. Does **not** reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` |
| W16-7 | Score Hood does **not** retag `even_gallery` / Spent Plate / Gait Plate / Dry Plate / Poise Hood / Tally Hood |
| W16-8 | Score Sting bonus is leftover AP + leftover MP === 4 **and unequal**, not Tally Sting’s sum 3, not Poise Sting’s equality, not Gaunt Sting’s both-0, not Even Sting’s even AP, not Tied Gait’s (2,2) |
| W16-9 | Score Sip on (3,1) writes (2,1) **Tally**. Tally Sip on (2,1) writes (1,1) **Poise**. Bare Sip stays leftover MP = 0. Poise Sip stays equality ≥ 1 |
| W16-10 | Must Score is **not** in the same CORE as a Strike-only score lock (none shipped). Reads leftover **before** debit. Dual Keep 2/2 is Must Poise, not Must Score |
| W16-11 | Court Snuff is `NOT_PLAYER_LEARNABLE`; `court_snuff_regent` is kit-only |
| W16-12 | Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` do not restamp #808 / #836 / #849 / #837 / #890 / #903 / #906 / #951 / #953 / #962 |
| W16-13 | `mpCost` is 0 on every Wave-16 row |
| W16-14 | `summonAI` values are `"hendecaspan"` / `"scorepost"` enums, never parsed names |
| W16-15 | Hendeca Span does not ship against `ENEMY_SUMMON_CAP === 2` without occupy-weight |
| W16-16 | Verse Score does **not** lift at leftover 0/0 (Verse Gaunt), leftover 2/2 (Verse Poise), or leftover 3/0 (Verse Tally) |
| W16-17 | No second `spell-cadence-floor` / `spell-cadence-prime` / `spell-cadence-rise`. SDE #906 owns Floor. #953 owns Prime. #962 owns Rise |
| W16-18 | Legal Score pairs are only (4,0) (0,4) (3,1) (1,3). (2,2) is Poise. (3,0) is Tally |

---

## 9. Out of scope

- Production TypeScript / Motoko / bindgen / PocketIC.
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / **#903** / **#951** own extra doors).
- Restamping any door in §3.4.
- A fourth `mpCost > 0` walk snipe; Hex of Silence; About Hinge; mid-RAF splice; sixth echo; leftover-sum **=== 3** (Tally); leftover-sum **=== 4 including 2/2** (that is Poise); remaining `n===0` → `1` (Prime); remaining `n===1` → `2` (Rise); remaining `n>1` → `1` (Floor); eleven-cell occupy aliases; target-only sum===3 / sum===4 heal; leftover **diff** window; two-ally invert.
- Cloning Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Shadow Veil, Mirror / Reflect, Lens / Overcast, Short Sight / Paper Wind, Tempo Gift / Loan Tempo, Goad / Taunt Oath, Rime Tile / Rime Sheet, File Lance, Blood Tithe, Hex of Silence, Dry Mend, Dry Gait, Parched Mend, Hollow Gift, Cadence Swap, Cadence Floor, Cadence Prime, Cadence Rise, Gaunt Mend, Poise Mend, Equal Gift, Tally Mend, Lean Gift, Tempo Invert, Purse Turn, Bar Cross.
- Putting unique #802 / #837 / #849 / #890 / #906 / #953 / #962 ids in this catalog.

---

## 10. Catalog index

| SPELL_ID | NAME | ROLE | ACQUISITION | AP | CD | Door |
| :--- | :--- | :--- | :--- | ---: | ---: | :--- |
| `spell-score-mend` | Score Mend | SUPPORT | MULTI_SOURCE | 3 | 2 | `score_cantor` |
| `spell-cadence-snuff` | Cadence Snuff | CONTROL | MULTI_SOURCE | 3 | 2 | `snuff_precentor` |
| `spell-hendeca-span` | Hendeca Span | SUMMONS | MULTI_SOURCE | 4 | 3 | `span_hendeca` |
| `spell-duel-turn` | Duel Turn | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-score-hood` | Score Hood | DEFENSE | ELITE | 2 | 2 | (piece observe) |
| `spell-score-sting` | Score Sting | DAMAGE | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-score-step` | Score Step | POSITION | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-score-sill` | Score Sill | TERRAIN | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-score-hold` | Score Hold | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-score-lend` | Score Lend | SUPPORT | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-score-sip` | Score Sip | CONTROL | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-score-post` | Score Post | SUMMONS | ENEMY_DISCOVERY | 3 | 3 | (piece observe) |
| `spell-score-bounce` | Score Bounce | DAMAGE | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-must-score` | Must Score | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-verse-score` | Verse Score | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-court-snuff` | Court Snuff | SUPPORT | NOT_PLAYER_LEARNABLE | 6 | 4 | `court_snuff_regent` (kit) |

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

**Document status:** PROPOSED. Safe to review and implement in a later, explicit data PR. Not a license to land combat code in the same change as this spec. Coordinate with **#962** so Cadence Rise / Lean Gift / File Stride land once. Coordinate with **#953** so Tally Mend / Cadence Prime / Dec Span / Purse Turn land once as Wave-16 family CORE. This catalog stamps as Wave **17** family CORE.

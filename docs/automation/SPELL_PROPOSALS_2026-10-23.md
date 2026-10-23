# Spell and Tactical Mechanics — Design Pass 2026-10-23

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1 law [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) through still-open Wave 14 [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-22.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-evolution-2458/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-22.md) (**#906**). Same-day Wave 15 SDE **has not opened a PR at authoring**.
- Spell, Discovery & Achievement Admin — still-open ACTION_ID-only PRs (no unique spell ids)
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) … still-open Wave 14 [`SPELL_PROPOSALS_2026-10-22.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-81df/docs/automation/SPELL_PROPOSALS_2026-10-22.md) (**#890**)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); extra doors through #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / **#836** (Wave 14 bosses) / **#903** (Wave 15 bosses); tactical extras #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / **#890**

This is **Wave 15** of the tactical catalog. Live HEAD is unchanged since Waves 4–14. Wave 14 (#890) filled both-body leftover AP === leftover MP ≥ 1 heal (Poise Mend), remaining `n>1` → `1` (Cadence Floor — **#906 SDE wins that id**), solid 3×3 occupy (Nine Span, counts as nine), two-body leftover AP↔MP cross (Bar Cross), and a Poise family plus Court Floor.

**Wave 14 explicitly deferred ten holes.** Discovery Wave 14 (#906) already claimed target-only leftover AP == leftover MP ≥ 1 heal (Equal Gift) and remaining-CD floor `n>1` → `1` (`spell-cadence-floor`). **SDE keeps those.** This pass fills the remaining leftovers Wave 14 left for Wave 15, plus a hostile invert that does **not** clone Tempo Invert or Bar Cross:

| Wave-14 leftover | Owner after #906 / #890 | This pass |
| :--- | :--- | :--- |
| One-body leftover AP === leftover MP ≥ 1 heal | **Filled.** Equal Gift (#906) is **target** leftover AP == leftover MP ≥ 1. Poise Mend (#890) is **both bodies**. | **Not this pass.** Do not mint `spell-tied-mend` / `spell-equal-mend` / `spell-tally-gift`. |
| Remaining CDs floor to 1 | **Filled.** Cadence Floor (`spell-cadence-floor`) — **SDE wins** vs #890’s duplicate. | **Not this pass.** Do not ship a second Floor. |
| Remaining `0` → `1` | Still open. Stall / Lag pad `n>0`. Floor compresses `n>1` → `1` (zeros stay 0). Flush / Crack write 0. | **This pass:** Cadence Prime (remaining `n===0` → `1`; ones stay 1; `n>1` unchanged) |
| Nine-cell occupy | **Filled.** Nine Span is solid 3×3 = 9. Oct Span is hollow 8. | **Not this pass.** |
| Ten-cell occupy | Still open. | **This pass:** Dec Span (axis-aligned 2×5, counts as **ten**) |
| Leftover AP + leftover MP === N (sum window) | Still open. Poise / Equal Gift own **equality**. Gaunt / Hollow Gift own **0+0**. Tied Gait owns **exactly 2 and exactly 2**. Ready Sting owns both ≥ 1 with **no sum**. | **This pass:** Tally Mend — **caster and target** leftover AP + leftover MP **=== 3** (odd sum; never an equality). **0+0 does not fire.** |
| Invert leftover AP with leftover MP on one **hostile** | **#282 Tempo Invert** owns **one-body ally/self**. **#890 Bar Cross** owns **two-body leftover cross**. Ungated ally invert is **not** a hole. | **This pass:** Purse Turn — invert leftover AP↔MP on a **hostile** body; caster pools unchanged. Do **not** mint `spell-foe-invert` / `spell-tempo-cross` / `spell-bar-invert`. |
| Mid-RAF splice | Held (AGENTS.md) | Still held |
| Fourth `mpCost > 0` walk snipe | Held (Ley Toll / Undertow / Sanguine Toll) | Still held |
| Sixth echo id | Held | Still held |
| Player-owned Hex of Silence | Held (`BOSS_ONLY`) | Still held |
| Player-owned About Hinge | Held (`BOSS_ONLY` on #590) | Still held. Hostile 180° around a pair midpoint is still Pawn Trade. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after the reserved set **and** after #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

Same-day Discovery Wave 15 **has not opened a PR at authoring**. **If that catalog later claims a unique leftover below, SDE wins** the unique §11 id; this catalog must not clone it. Do **not** clone #747 / #802 / #837 / #849 / #890 / #906 unique ids. Do **not** ship `spell-parched-mend` / `spell-cadence-floor` (second copy) / `spell-cadence-trade` / `spell-court-trade` / `spell-hollow-mend` / `spell-tied-mend` / `spell-equal-mend`. Stamp family / observe metadata onto Wave-15 **tactical** ids only. #906 §12 already stamps #890 as Wave **15** family CORE (except Cadence Floor). **This catalog stamps as Wave 16 family CORE.**

Do **not** mint `spell-sum-mend` / `spell-triad-mend` / `spell-tierce-mend` / `spell-tern-mend` / `spell-tally-gift` / `spell-both-tally` (Tally Mend owns both-body sum===3 heal), `spell-cadence-arm` / `spell-cadence-wake` / `spell-cadence-lift` / `spell-cd-prime` (Cadence Prime owns remaining `0` → `1`; Wave 14 tombstoned `spell-cadence-arm` as a Floor alias), `spell-ten-span` / `spell-decade-span` / `spell-decem-span` / `spell-nona-span` (Dec Span owns ten; Wave 14 tombstoned `spell-ten-span` as a Nine Span alias), `spell-foe-invert` / `spell-tempo-cross` / `spell-pool-cross` / `spell-bar-invert` / `spell-ledger-flip` (Purse Turn owns hostile one-body invert; Tempo Invert owns ally invert; Bar Cross owns two-body cross), `spell-court-arm` / `spell-court-ceil` (Court Prime is the mass signature; Wave 14 tombstoned `spell-court-arm`), or `spell-tally-plate` / `spell-sum-hood` (Tally Hood owns sum===3 any-range miss; do **not** retag `even_gallery` / Spent Plate / Gait Plate / Poise Hood).

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is unchanged since 2026-08-31. Discovery is still inert. WX is **19,213** lines (`wc -l`). Same HEAD as Waves 4–14. `WorldExploration.tsx` lives at `src/frontend/src/components/WorldExploration.tsx` (not `engine/`).

### 1.1 Frontend runtime catalog — `src/frontend/src/data/spellData.ts`

`SPELL_ID_CATALOG` (`src/frontend/src/data/bossKits.ts` 29–62) still lists **32** ids. `WorldExploration.tsx` 2396–2408 still maps **every** `starterSpells` row to `isBaseSpell: true` (“always shown, never removable”).

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

Live `ENEMY_SUMMON_CAP` is still **2** (`gameConstants.ts` 300). Quad Span (#636) counts as four, Penta Span (#695) as five, Six Span (#787) as six, Sept Span (#726) as seven, Oct Span (#849) as eight, Nine Span (#890) as nine on paper; all six are implementation-blocked until that cap (or a dedicated occupy-weight) exists. Dec Span is the same class: **propose the hole, do not pretend it can ship against cap 2**.

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
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** (tests only) | Unused | Shoulder Bash, Hook Line. Tally Step / Purse Turn relocate leftover **pools**, not tiles. Purse Turn is **not** `isSwap`. |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768 → WX `swapPositions` 9389) | Swap | Pawn Trade / Ward Interpose / Cadence Prime is **not** `isSwap` (cooldown remaining, not tiles) |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, never this set |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire |
| Walk / leftover / force flags | Paper `walkMpSpentThisTurn` (Waves 6–10). Paper `forcedMovedThisTurn` (Wave 9). Leftover AP/MP die at turn end unless Dual Keep / Purse Keep / Stride Keep | Haste grants **now**; Timestep is full **now** | **This pass: Tally Mend / Tally Hold / Tally\* / Must Tally / Verse Tally / Purse Turn / Court Prime** |
| Ten-cell occupy | Twin=2 … Nine=9 solid | Absent | **This pass: Dec Span** (2×5 = 10) |
| Remaining CD rewrite | Theft **steals**; Imprint **copies**; Swap (#837) **exchanges full maps**; Rest skips **own** tick; Halve **÷2**; Grace skips **starting** the next own CD; Stall **+1**; Lag **+2**; Floor (#906) `n>1` → `1` | Inferno CD 3 is the only live lock | **This pass: Cadence Prime (remaining n===0 → 1; n>1 unchanged)** |
| Leftover sum (AP + MP === N) | Poise family is **equality ≥ 1**. Gaunt family is **both leftover 0**. Equal Gift is **target equality ≥ 1**. Tied Gait is both leftover **exactly 2**. Ready Sting is leftover **AP ≥ 1 and MP ≥ 1** (no sum). Odd Plate is leftover **AP odd**. | Unused live | **This pass: Tally\* (sum === 3)** |
| One-body leftover AP↔MP | Tempo Invert (`invertApMp`, ally/self). Bar Cross (two-body cross). | Absent live | **This pass: Purse Turn (hostile one-body).** Do not reuse `invertApMp`. |

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

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` and `spell-blood-tithe` (tactical W2 vs Discovery W2). `spell-cadence-floor` (tactical #890 vs Discovery #906 — **SDE wins**; this pass does not add a third).

**Fantasy overlaps to not clone:** Short Sight ≈ Paper Wind; Tempo Gift ≈ Loan Tempo; Goad ≈ Taunt Oath; Rime Tile ≈ Rime Sheet; Lens Shift / Overcast; Poise Mend ≈ Equal Gift (both-body vs target equality); Cadence Floor is **filled**; Tempo Invert ≈ Purse Turn (ally vs hostile invert — **this pass fills the hostile side, does not clone the ally card**).

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier; Dry Mend / Dry Gait / Parched Mend; Hollow Gift / Gaunt Mend; Cadence Swap / Cadence Floor.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved or live) |
| :--- | :--- | :--- |
| SUPPORT leftover-sum heal | Both-body leftover AP + leftover MP **=== 3** | Poise Mend / Equal Gift (equality); Gaunt / Hollow Gift (0+0); Dry Mend / Dry Gait |
| CONTROL remaining 0→1 | Ready ids (`n===0`) write `1` | Floor `n>1`→1; Stall/Lag pad; Flush/Crack →0 |
| SUMMONS ten-cell occupy | Axis-aligned 2×5, counts as ten | Twin…Nine Span |
| CONTROL hostile invert | Leftover AP↔MP on a **hostile** | Tempo Invert (ally/self); Bar Cross (two-body cross) |
| DEFENSE / DAMAGE / TERRAIN tally family | Hood / Sting / Step / Sill / Hold / Lend / Sip / Post / Bounce / Must / Verse | Poise\* / Gaunt\* / Lean\* / Dry\* |
| SIGNATURE mass Prime | Court Prime | Court Floor / Court Lag / Court Imprint |

**Still open after this wave (do not fill today):** mid-RAF splice; fourth walk-MP snipe; sixth echo id; player-owned Hex of Silence; player-owned About Hinge; leftover AP + leftover MP === **4** (even sum overlaps Poise at 2/2); remaining `1` → `0`; eleven-cell occupy; **target-only** sum===3 heal (leave for SDE); leftover AP − leftover MP === 1 (diff window); invert leftover on **two hostiles** (caster stays). Those stay Wave 16 so this pass stays discrete.

---

## 3. Contract with Dynamic Spell Discovery

Coordinate with Discovery (`c26e5a83-…`) and Admin (`4efa22ec-…`). This pass only stamps acquisition so those layers can filter **by field**.

### 3.1 Discovery is still inert (reconfirmed @ `0f5363f`)

1. All 32 frontend spells are forced `isBaseSpell` (`WorldExploration.tsx` 2396–2408).
2. Recap grants XP/Doka/feats only.
3. Achievements (`defaultAchievements`, `admin.mo` 309–326) grant Doka only.
4. Challenges (`DEFAULT_CHALLENGES` 44–103) grant Doka/XP/badge only.
5. `upgradeSpell` levels a known id; it does not unlock ids.
6. `ENEMY_KITS` (`enemyAI.ts` 163–185) still reuse always-owned ids. Seeing a bishop cast Frost teaches nothing.
7. `buildEnemyKit` still takes `levelZone`. Discovery already recorded that a non-number → `NaN` → every kit stays zone 0.
8. `executeCastAttempt` still does not debit `spell.mpCost`. Combined paper `mpCost > 0` remains Ley Toll / Undertow / Sanguine Toll — **no fourth**.
9. `inferArchetype` still treats any `healAmount > 0` as healer (`enemyAI.ts` 447–452). Tally Mend **must not** land in non-healer CORE; keep `healAmount: 0` on the row.

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 15 ids to `starterSpells` as base. Do **not** land Wave-15 data before Wave-1 ownership split (`SDE-2026-08-31-001`).

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "decspan"` / `"tallypost"` are **string enums on the config**, not a parse of `"Dec Span"` / `"Tally Post"`.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Dec Span / Tally Post **arming** (body placed, AP spent) **is** observation. A later occupy / detonate is **not** a second observe.
- Cadence Prime **resolve** (even if every remaining was already > 0) **is** observation if AP was spent.
- Do not require “see it N times”. Wave 15 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.
- Do not stamp `survivor` (Last Ember / Last Ward). #646 / #679 / #747 / #802 / #837 / #849 / #890 / #906 left that feat leftover on purpose.

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

**Every live feat and every live challenge id is already a sole spell door or a MULTI child.** Wave 15 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 15 does **not** invent a 16th feat.

**Live 19 first-wins are all taken (do not restamp as the only door):**  
`starborn_queen` (Cut In), `pale_archivist` (After Verse), `starved_vampire_pawn` (Sanguine Toll), `lord_of_static` (Draw Together), `final_pawn` (Eclipse Fold), `mirror_sovereign` (Echo Cast), `crimson_countess` (Crimson Pact), `void_grandmaster` (Twin Gate), `midnight_bishop` (Life Tether), `chessboard_lich` (Claim Ward), `twin_monarchs` (Choir Hymn), `alabaster_fortress` (Pain Link / Aftershock), `bone_cavalier` (Vault / Caltrop), `pale_archbishop` (Reliquary / Glyph Snare extras), `fetid_rook` (Rot Brand), `broodmother_rook` (Brood Ward), `weeping_pawn` (Mute Thread, #411), `eternal_pawn_king` (Queue Cut, #411), `enthroned_void` (File Vault MULTI child, #411). `second_lament` remains kit-only False Cut.

**Wave-5…15 boss extra doors — do not restamp:** `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`, `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`, `mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`, `gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`, `toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`, `crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`, `sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`, `infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`, `flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`, `effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`, `jostle_subdeacon`, `peel_friar`, `dilate_organist`, `hood_recluse`.

**Wave-6…14 tactical extra doors — do not restamp:** `oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`, `pace_prelate`, `span_triune`, `wick_mason`, `slip_castellan`, `court_usher`, `gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `gaunt_cantor`, `lag_precentor`, `span_oct`, `court_lag_regent`, `poise_cantor`, `floor_precentor`, `span_nine`, `court_floor_regent`. `parched_cantor` is **not** Dry Gait’s door and **not** Tally Mend’s door. `poise_cantor` stays Poise Mend. `gaunt_cantor` stays Gaunt Mend. `floor_precentor` stays #890’s Cadence Floor door (SDE teaches Floor via `cadence_thief` / `hex_chorister` — do not restamp).

**Wave-8…14 SDE extras — do not restamp:** `about_hinge_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `pair_gallery`, `knight_fold_regent`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `cap_precentor`, `reach_fold_regent`, `knight_gallery`, `quad_nave`, `pit_aisle`, `shunt_pulpit`, `nudge_nave`, `file_precentor`, `diag_fold_regent`, `rank_fold_regent`. Do **not** retag `even_gallery` as Tally Hood. Do **not** consume encounter-catalog `ENC-*` rooms. Do not name unique families `gaunt_mender` / `cadence_lagger` / `oct_prelate` / `orth_warder` / `axis_cutter` (#899 owns those).

**New proposed extra doors for the boss designer (Wave 16 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `tally_cantor` first-win | Tally Mend MULTI child (observe+win still grants). `poise_cantor` stays Poise Mend. `gaunt_cantor` stays Gaunt Mend. `parched_cantor` stays the dropped Parched Mend slot — **do not reuse**. Equal Gift (#906) has **no** extra door — do not invent `equal_cantor` / `sum_cantor`. |
| `prime_precentor` first-win | Cadence Prime MULTI child. `floor_precentor` stays Floor (#890 door). `lag_precentor` stays Lag. `imprint_precentor` stays Imprint. `halve_precentor` stays Halve. `cap_precentor` stays Pack Cap. `file_precentor` stays Pack File (`ENEMY_ONLY`). Do **not** mint `arm_precentor` / `ceil_precentor` / `wake_precentor`. |
| `span_dec` first-win | Dec Span MULTI child. `span_nine` stays Nine Span. `span_oct` stays Oct Span. `span_six` stays Six Span. `span_sept` stays Sept Span. `span_penta` stays Penta Span. `span_quad` stays Quad Span. `span_triune` stays Triple Span. Do **not** mint `span_ten`. |
| `court_prime_regent` kit only | Court Prime (`NOT_PLAYER_LEARNABLE`). `court_floor_regent` stays Court Floor. `court_lag_regent` stays Court Lag. `court_imprint_regent` stays Court Imprint. `reach_fold_regent` stays Reach Fold. `diag_fold_regent` stays Diag Fold. `rank_fold_regent` stays Rank Fold. Do **not** mint `court_arm_regent`. |

Piece-type observe paths (not feat doors): cantors / bishops for Tally Mend; scribes / tempo for Cadence Prime; masons / rooks ELITE for Dec Span; hex / queens for Purse Turn; lurkers / knights for Tally Hood; lurkers / pawns for Tally Sting; porters / queens for Tally Step; masons / rooks for Tally Sill; hex / knights for Tally Hold; buffers / bishops for Tally Lend; hex / pawns for Tally Sip; masons / pawns for Tally Post; queens / bishops for Tally Bounce; knights / pawns for Must Tally; hex / bishops for Verse Tally.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906 key names for a different meaning. Do **not** reuse `invertApMp` (Tempo Invert). Do **not** reuse `floorRemainingCdsTo1` (Cadence Floor). Do **not** reuse `crossLeftoverApMpTwoBody` (Bar Cross). Do **not** reuse `nineSpanCells` / `nineSpanSolid`.

`mpCost` stays 0 on every Wave-15 row.

**New keys (Wave 15 only):**

```text
requireCasterLeftoverSumEq, requireTargetLeftoverSumEq, tallySumN, tallyMendAmount,  // Tally Mend — AP+MP === 3 on both bodies
primeRemainingCdsFrom0,                                                             // Cadence Prime — remaining n===0 → 1; n>1 unchanged
decSpanCells, decSpanW, decSpanH,                                                   // Dec Span — 10; axis-aligned 2×5
invertHostileLeftoverApMp,                                                          // Purse Turn — target leftover AP ↔ leftover MP; caster unchanged
tallyHoodNextHit,                                                                   // Tally Hood — next hit while sum===3, any range → 0
tallyLeftoverSumEq, tallyStingBonus,                                                // Tally Sting
tallyStepNeedSumEq, tallyStepAdj,                                                   // Tally Step — dest Chebyshev 1 of target
tallySillNeedSumEq, tallySillDamage, tallySillDuration,                             // Tally Sill — start-of-their-turn tax
tallyHoldWhileSumEq, tallyHoldDuration,                                             // Tally Hold — 2 of their turns
tallyLendAp, tallyLendMp, requireTargetSumEqLend,                                   // Tally Lend — +1 AP and +1 MP iff sum===3 (exits window)
tallySipAp, requireTargetSumEqSip,                                                  // Tally Sip — steal 1 leftover AP iff sum===3
tallyPostDetonateDamage, tallyPostNeedSumEq,                                        // Tally Post — 10 on end-turn occupy if sum===3
tallyBounceNeedSumEq, tallyBounceSearchRadius, tallyBounceCount,                    // Tally Bounce
mustNonStrikeUnlessSumEqAndSpendsLastAp,                                            // Must Tally — pre-spend leftover
verseTallyUntilSumEq,                                                               // Verse Tally
courtPrimeExcludeCaster                                                             // Court Prime
```

If a key is missing, the rider does not fire. `tallySumN` is **3** on every Tally\* row that names a sum. Missing `tallySumN` → gate fails closed (do not guess 3 from the name).

Nested kit-only id (not a player card): none new besides Court Prime itself. Tally Post’s detonate is **not** a second spell id (the summon row carries `tallyPostDetonateDamage`). Do not mint `spell-tally-burst`.

Leftover AP / leftover MP are **current remaining after this spell’s AP is paid**, read from the same pools the HUD uses — **except Must Tally**, which reads leftover **before** debit (a “spends last AP” gate is otherwise impossible once leftover AP is already 0). Walk spends must write leftover MP. Spell spends must write leftover AP. Missing leftover → the gate fails closed (fizzle rider, AP spent, observe). Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count as leftover for these gates. Sum is integer `leftoverAp + leftoverMp`. Equality is **not** this family: leftover 1/1, 2/2, 3/3 fail `tallySumN === 3` (those sums are 2 / 4 / 6). Leftover `0 + 0` is **not** a Tally window (sum 0). Legal pairs after a successful Tally gate: **(3,0) (0,3) (2,1) (1,2)** only.

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Cadence Prime’s ready-lock is paid in **currently available remaining 0**, not in extra AP. Tally Mend’s 8 is paid in **two sum===3 bars on two bodies** (Poise Mend is the two-body equality cousin; Equal Gift is the one-body equality cousin; Gaunt Mend is the two-body empty cousin).

Do **not** put Must Tally in the same CORE as a Strike-only tally lock (this pass does not ship that lock). Do **not** CORE Tally Hood with Spent Plate, Gait Plate, or Poise Hood. Do **not** CORE Tally Mend with Hollow Gift, Gaunt Mend, Poise Mend, or Equal Gift. Do **not** CORE Purse Turn with Tempo Invert or Bar Cross. Do **not** CORE Cadence Prime with Cadence Floor, Halve, Trim, Crack, or Flush.

---

## 5. Proposed spells (Wave 15)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-tally-mend`

NAME: Tally Mend  
ROLE: SUPPORT — heal if caster **and** target leftover AP + leftover MP **=== 3**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"requireCasterLeftoverSumEq":true,"requireTargetLeftoverSumEq":true,"tallySumN":3,"tallyMendAmount":8}`. If **both** caster and target have leftover AP + leftover walk MP **=== 3** at resolve (after this spell’s 3 AP is paid), heal the target 8 through the existing heal helper. If either sum ≠ 3, fizzle rider (AP spent, no HP). Walk / force-move / equality flags do **not** substitute. Distinct from Poise Mend (#890, **both bodies leftover AP === leftover MP ≥ 1** — even sums 2/4/6…), Equal Gift (#906, **target only** leftover AP == leftover MP ≥ 1; caster leftover unread), Hollow Gift (#837, **target only** leftover AP=0 **and** leftover MP=0), Gaunt Mend (#849, **both bodies leftover AP=0 and leftover MP=0**), Dry Mend (#747, both leftover **AP = 0**, MP unconstrained), Dry Gait (#802, both leftover **MP = 0**, AP unconstrained), Ready Sting (leftover AP≥1 **and** MP≥1 with **no sum**), Tied Gait (#906, leftover AP **and** leftover MP **exactly 2**). Legal pairs: (3,0) (0,3) (2,1) (1,2). The decision: two bodies **sum to 3**, then 8 — Dual Keep 2/2 is Poise, **not** Tally; spend 1 from 2/2 to enter (2,1) / (1,2), or sit on 3 leftover AP and 0 leftover MP. `healAmount` stays 0 on the row so `inferArchetype` (`enemyAI.ts` 447–452) does not treat a kit that only *carries* this id as healer; **healer CORE only** when the row is in a live pool.  
DURATION: instant  
SCALING: 8 follows heal% if any; amount otherwise fixed.  
SYNERGIES: Dual Keep 2/2 then spend 1 pool to **enter** Tally; Purse Turn keeps sum 3 while swapping the pair (3,0)↔(0,3) and (2,1)↔(1,2); Tally Lend **cashes out** to sum 5; Poise Mend wants the opposite spend (match the pools).  
COUNTERPLAY: Spend so the sum leaves 3 (cast 1 AP from (2,1) → (1,1) **Poise**); dump both pools to 0 (Gaunt); Cursed Wound; kill the cantor first.  
POWER_BUDGET: Standard heal, gated on **two** leftover sums (four leftover reads). Blood Mend is 12 ungated self. Poise Mend is 8 on **two equal ≥ 1** bodies. Do not stack Tally Mend with Poise Mend / Equal Gift / Hollow Gift / Gaunt Mend in the same CORE.  
AI_USAGE: `aiHint: "heal_if_both_bodies_leftover_ap_plus_mp_eq_3"`. Cantors / bishops. Skip if either leftover sum ≠ 3. **Healer CORE only.** Do not dump leftover **only** to enable this if a Strike would kill.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop","queen"], levelZoneMin: 1 }`. MULTI child `tally_cantor`.  
EDGE_CASES: Targeting ally already allows self (`targeting.ts` 184–189). Self-cast requires the caster’s leftover sum === 3 (two keys, two reads). Self-cast at leftover 0/0 **does not** collide with Hollow Gift / Gaunt Mend — sum 0 fails `tallySumN`. Self-cast at leftover 1/1 **does not** collide with Poise Mend / Equal Gift — sum 2 fails. Player-side HP actually increased → `challengeHealUsedRef`. Missing keys → no heal. Missing `tallySumN` → fail closed. Do not clone Poise Mend / Equal Gift / Gaunt Mend / Dry Mend / Dry Gait. Target-only sum===3 heal stays Wave 16 / SDE. If same-day SDE Wave 15 claims this leftover, **SDE wins** — keep both-body vs their target-only the way Poise vs Equal Gift already split.  
IMPLEMENTATION_COMPLEXITY: LOW — four leftover reads + existing heal helper.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-tally-mend
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
effectParams: {"requireCasterLeftoverSumEq":true,"requireTargetLeftoverSumEq":true,"tallySumN":3,"tallyMendAmount":8}
```

---

### SPELL_ID: `spell-cadence-prime`

NAME: Cadence Prime  
ROLE: CONTROL — remaining CDs `n===0` become `1`  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"primeRemainingCdsFrom0":true}`. For each spell id in the **target’s** remaining-CD map with `n === 0`, write `1`. Ones stay 1. Remaining `n>1` **unchanged**. Target **keeps every spell**. Once/battle flags and spell levels are **not** CDs. Distinct from Cadence Floor (#906, remaining `n>1` → `1`; **zeros stay 0** — the opposite ready-policy), Cadence Swap (#837, **exchange full remaining maps**), Cadence Lag (#849, remaining `n>0` → `n+2`), Cadence Stall (#590, remaining `n>0` → `n+1`; zeros stay 0), Cadence Stretch (#636, remaining ×2), Cadence Theft (#411, **steals** remaining), Cadence Imprint (#787, **copies** onto the caster; target keeps), Cadence Rest (#747, **own** remaining do not tick), Cadence Grace (#802, **next own spell does not start** its cooldown), Cadence Halve (#726, **÷2** on the hostile), Cadence Trim (−1 on the hostile), Cadence Crack (highest → 0), Cadence Flush (all → 0). The decision: **ready** Inferno / Strike-adjacent tools become remaining 1 — they recast **next** turn, not now — without Floor-compressing an already-locked Inferno 3. Remaining 0 is “ready”; Prime is a **one-tick ready-lock**, not Hex of Silence (fizzle the bar) and not Quiet Hex (next spell +1 AP). Do **not** mint `spell-cadence-arm`.  
DURATION: instant rewrite of remaining `n===0`  
SCALING: none.  
SYNERGIES: Verse Tally after you locked their last ready id to 1; Floor / Lag / Stall are the **compress / pad** cousins — do not CORE both; Crack / Flush are the **zero** cousins — do not CORE both. Prime then Floor is a two-step: ready tools go 0→1, long tools go n>1→1, everything sits at 1.  
COUNTERPLAY: Recast the ready id **before** Prime (then remaining is already >0 or the id is spent); Cadence Break your own remaining to 0 after; Cadence Swap (#837) to dump the primed map onto someone else; wait the remaining 1.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **denying the ready bar for one tick**, not a steal, copy, pad, compress, or map swap.  
AI_USAGE: `aiHint: "prime_if_target_has_remaining_cd_eq_0_on_a_nuke"`. Scribes / tempo. Skip if every remaining is already > 0, or if the only ready id is Strike and a Strike from **you** would kill.  
DISCOVERY_ELIGIBILITY: true. MULTI child `prime_precentor`. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing key → no rewrite. Do not write `spellLevelValues`. Do not reset Dual Keep’s once/battle. Preview must show which remaining rise from 0 to 1. All-nonzero remaining → fizzle rider (AP spent, observe). Do **not** reuse `floorRemainingCdsTo1`. If same-day SDE Wave 15 claims this leftover, **SDE wins** — do not keep a second Prime id.  
IMPLEMENTATION_COMPLEXITY: LOW — walk remaining map, write 1 when n===0.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-cadence-prime
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
effectParams: {"primeRemainingCdsFrom0":true}
```

---

### SPELL_ID: `spell-dec-span`

NAME: Dec Span  
ROLE: SUMMONS — ten-cell occupy (axis-aligned 2×5)  
ACQUISITION: MULTI_SOURCE  
AP_COST: 4  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "decspan"`, `summonLifespan: 4`, empty kit (`summonUnitDef` with `pieceType: ""` / zero scales — a body, not a caster). `effectParams: {"decSpanCells":10,"decSpanW":2,"decSpanH":5}`. Click a free ground tile. Facing = 8-dir from **caster to click**. If `|dx| >= |dy|` the footprint is **5 along x** (sign of `dx`) by **2 along y**; else **2 along x** by **5 along y** (sign of `dy`). The click is the cell of the 10 that is **closest to the caster**. Extend 4 more along the long axis in the facing sign and 1 perpendicular: prefer the perpendicular whose extra row/column stays in-bounds; if both in-bounds, prefer the one whose centroid is farther from the caster. All 10 cells must be free and in-bounds (`isCellFree`); else fizzle (AP spent). One combatant id, ten-cell footprint. Every cell of the 10 is occupied (not a cage hole). Counts as **ten** toward the summon cap. Distinct from Twin Span (2 walking), Triple Span (3), Quad Span (2×2 = 4), Penta Span (ortho plus = 5), Six Span (2×3 = 6), Sept Span (stretched plus = 7), Oct Span (#849, hollow 3×3 = 8, **center hole unoccupied**), Nine Span (#890, solid 3×3 = 9, **square**). The decision: seal a 2×5 file/rank for ten cap — a corridor plug, not a square block — or you cannot afford the weight.  
DURATION: lifespan 4  
SCALING: footprint fixed.  
SYNERGIES: File Lance / Cast Sill / Tally Sill on a neighbor; Quiet Sill on an end so Strike cannot peel through; Swap / Reach Fold to extract an ally trapped against the block.  
COUNTERPLAY: Occupy any of the 10 before paint; Coup the body (one HP pool); blink / swap around the rectangle; walk around the long axis.  
POWER_BUDGET: Heavy 4 / CD 3 / 0 damage. Power is **ten** cells of deny along one corridor. Heavier than Nine Span’s nine-square because the extra cell is a file plug, and the shape is not a 3×3 you can stand beside on all sides equally.  
AI_USAGE: `aiHint: "dec_span_if_ten_free_rect_and_cap_allows"`. Masons / rooks ELITE. Skip if any of the 10 cells is occupied **or** remaining summon weight + 10 would exceed cap. Prefer a rectangle that splits the player from an exit along a rank or file.  
DISCOVERY_ELIGIBILITY: true. MULTI child `span_dec`. `pieceTypes: ["rook"]`, `levelZoneMin: 2`  
EDGE_CASES: **Do not ship while `ENEMY_SUMMON_CAP === 2` without occupy-weight.** Never parse `"Dec Span"` / `"Ten"` / `"Decade"`. One id, ten cells — destroying the body frees all ten. Player-side Dec Span counts toward the **player** summon economy, not `ENEMY_SUMMON_CAP`. Missing `decSpanCells` → do not spawn a 1-cell body and call it Dec Span. Missing `decSpanW` / `decSpanH` → do not guess 3×3 (that is Nine Span) or 2×3 (that is Six Span). Off-map cell → fizzle. Do not mint `spell-ten-span` / `spell-decade-span`. Cardinal click with `dx===0 && dy===0` is illegal (`freeCells` / caster tile). Diagonal click uses the `|dx| >= |dy|` tie-break (file-long).  
IMPLEMENTATION_COMPLEXITY: HIGH — multi-cell occupy + cap weight. Same class as Quad / Penta / Six / Sept / Oct / Nine.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-dec-span
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
summonAI: decspan
summonLifespan: 4
isBaseSpell: false
effectParams: {"decSpanCells":10,"decSpanW":2,"decSpanH":5}
```

---

### SPELL_ID: `spell-purse-turn`

NAME: Purse Turn  
ROLE: CONTROL — invert leftover AP↔MP on a **hostile** body  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"invertHostileLeftoverApMp":true}`. Snapshot the **target’s** leftover AP and leftover MP, then write leftover AP ← leftover MP and leftover MP ← leftover AP, each **capped at that pool’s max**. Caster leftover **unchanged**. Distinct from Tempo Invert (#282, **one-body ally/self** leftover AP↔MP via `invertApMp` — **do not reuse that key**), Bar Cross (#890, **two-body leftover cross**: caster AP ↔ target MP **and** caster MP ↔ target AP), Dual Keep (banks leftover AP **and** MP on **one** body, no swap), Swap / Pawn Trade (**tiles**), Loan Tempo / Tempo Gift (**grants**), Drain Courage (AP debit), Soul Sip (ungated MP steal). The decision: they sit on (3,0) ready to Strike three times and cannot walk — turn the purse and they have (0,3) walk and no leftover AP. Sum is invariant: a Tally pair stays Tally; a Poise pair stays Poise; (2,0) becomes (0,2) (still not Tally). Do **not** mint `spell-foe-invert` / `spell-tempo-cross` / `spell-bar-invert`.  
DURATION: instant leftover rewrite; no snap-back at turn end  
SCALING: none. Caps at each pool’s max.  
SYNERGIES: Tally Mend / Tally Sting after the invert **keeps** sum 3; Must Tally after you dump their AP into MP; Undertow / Ley Toll want MP on **them to be gone**; Dual Keep leftover that survives is legal input.  
COUNTERPLAY: Keep leftover AP === leftover MP so the invert is a no-op on that body; Quiet Hex after they invert into a 3-AP spell; Strike before they recast.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **turning one hostile purse**, not a grant, not a tile swap, and not a two-body cross. Do not CORE with Tempo Invert or Bar Cross.  
AI_USAGE: `aiHint: "turn_if_target_leftover_ap_ge_2_and_leftover_mp_eq_0_or_inverse"`. Hex / queens. Skip if both leftover pools are already equal (no-op). Skip if both leftover pools are 0/0 (no-op writes still spend AP — do not). Skip if a Strike would kill.  
DISCOVERY_ELIGIBILITY: true. Piece observe. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing key → no rewrite. Do not write max AP/MP. Do not write Dual Keep’s once/battle. Preview must show the target leftover pair after the invert. Self-target is illegal (`targetType: enemy`). Two 0/0 → fizzle rider (AP spent, observe) so AI skip matches. Do not reuse `invertApMp`. Do not reuse `crossLeftoverApMpTwoBody`. If same-day SDE Wave 15 claims this leftover, **SDE wins**.  
IMPLEMENTATION_COMPLEXITY: LOW — snapshot one leftover pair, two capped writes.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-purse-turn
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
effectParams: {"invertHostileLeftoverApMp":true}
```

---

### SPELL_ID: `spell-tally-hood`

NAME: Tally Hood  
ROLE: DEFENSE — next applied hit is 0 while leftover AP + leftover MP === 3, any range  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"tallyHoodNextHit":true,"tallySumN":3}`. Arm a one-hit consume: the next applied hit on the caster is 0 **if at impact** leftover AP + leftover MP **=== 3**. Any Chebyshev. The charge remains if the hit arrives while the sum ≠ 3 (hit lands fully; charge stays). Distinct from Poise Hood (#890, leftover AP === leftover MP ≥ 1), Spent Plate (#837, leftover **AP ≥ 1**, MP unconstrained), Gait Plate (#802, leftover **MP ≥ 1**, AP unconstrained), Even Hood (#849, **even Chebyshev**), Odd Hood (odd Chebyshev), Near / Mid / Far Hood (range bands), Odd Plate (#906, leftover **AP odd**). The decision: hold (2,1) through the hit — Dual Keep 2/2 is Poise Hood, **not** this — or spend into 1/1 and Poise Hood still works, this does not. Do **not** CORE with Spent Plate, Gait Plate, or Poise Hood. Do **not** retag `even_gallery`.  
DURATION: until consumed or battle end (one hit)  
SCALING: none.  
SYNERGIES: Purse Turn to **keep** sum 3 while changing which pool is fat; Tally Lend **exits** (do not lend into a hit you wanted blanked); Cadence Prime on the attacker so they recast into the hood next turn.  
COUNTERPLAY: Wait until they spend a pool off 3; Drain Courage / Slow to break the sum; Coup / execute that does not count as “applied hit” stays out of scope.  
POWER_BUDGET: Cheap 2 / CD 2. Power is **holding a sum of 3**, not a range band and not a tie.  
AI_USAGE: `aiHint: "tally_hood_if_leftover_ap_plus_mp_eq_3"`. Lurkers / knights ELITE. Skip if leftover sum ≠ 3.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Missing key → no arm. Hit while leftover 0/0 lands and **does not** consume (Gaunt window). Hit while leftover 1/1 lands and **does not** consume (Poise Hood would). Hit while leftover 2/2 lands and **does not** consume (Tied Gait / Poise). Do not clone Poise Hood / Spent Plate / Gait Plate / Even Hood.  
IMPLEMENTATION_COMPLEXITY: LOW — one consume flag + leftover sum at impact.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-tally-sting`

NAME: Tally Sting  
ROLE: DAMAGE — 10; +8 iff target leftover AP + leftover MP === 3  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. Then if the target’s leftover AP + leftover MP **=== 3**, deal `tallyStingBonus` (8) as a second existing `dealDamage` call. `effectParams: {"tallyLeftoverSumEq":true,"tallySumN":3,"tallyStingBonus":8}`. Distinct from Poise Sting (#890, leftover AP === leftover MP ≥ 1), Gaunt Sting (#849, leftover **both 0**), Lean / Dry / Ready / Full Sting, Odd Sting (#906, leftover **AP odd**), Tied Gait (#906, both leftover **exactly 2** — a **bonus on (2,2)**, which is Poise, not Tally). The decision: poke the (2,1) bishop for 18, or poke anyone for 10.  
DURATION: instant  
SCALING: 10 and 8 follow dmg%.  
SYNERGIES: Purse Turn to **keep** them in Tally while swapping the pair; Tally Hold so they cannot walk off leftover MP; Dual Keep 2/2 is the **wrong** window (Poise Sting).  
COUNTERPLAY: Spend off sum 3; sit on 1/1 (Poise) or 0/0 (Gaunt).  
POWER_BUDGET: Cheap. 10 if they are off-window (Strike-equal). 18 if they sit on a Tally pair (Frost-adjacent, two hits).  
AI_USAGE: `aiHint: "tally_sting_if_target_leftover_ap_plus_mp_eq_3"`. Lurkers / pawns. Skip the id if the target is not in the window **and** a Strike would kill; 10 still lands if you cast it anyway.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing bonus key → 10 only. Missing `tallySumN` → no bonus. Target leftover 2/2 → 10 only (Poise Sting’s window). Two hits, two Mark chances if the dest tile is marked.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-tally-step`

NAME: Tally Step  
ROLE: POSITION — caster lands adjacent to an ally whose leftover AP + leftover MP === 3  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `freeCells` on the dest. `effectParams: {"tallyStepNeedSumEq":true,"tallySumN":3,"tallyStepAdj":1}`. Target an ally (not self) whose leftover AP + leftover MP **=== 3**. The caster **relocates** to a free cell at Chebyshev 1 of that ally (player picks the dest among legal neighbors; AI picks the safest). If the ally is not in the window or no neighbor is free, fizzle (AP spent, no move). Distinct from Poise Step (#890, ally leftover AP === leftover MP ≥ 1), Gaunt Step (#849, ally leftover **both 0**), Home / Heave / Parched / Ally Step, Hinge Step, Relay Dash. The decision: blink next to the (0,3) wisp — they have walk, you have position — or wait for a 1/1 and Poise Step.  
DURATION: instant  
SCALING: none.  
SYNERGIES: Tally Lend **after** you arrive (cashes them out); Tally Mend from the new cell if **you** also sit on sum 3.  
COUNTERPLAY: Occupy every neighbor; break the ally’s sum before the step.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **gated relocate**, not a blink-anywhere (Mist Step / Phase Slip).  
AI_USAGE: `aiHint: "tally_step_if_ally_sum_eq_3_and_free_adj"`. Porters / queens. Skip if the ally is not in the window or every neighbor is occupied.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Self-target illegal. Dest hazard **must tick**. `movedThisTurn` = true on a successful relocate. Missing keys → no move. Do not call `isSwap`.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — leftover sum gate + occupy dest.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-tally-sill`

NAME: Tally Sill  
ROLE: TERRAIN — occupant with leftover AP + leftover MP === 3 at **start of their turn** takes 8  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell for 2 turns. `effectParams: {"tallySillNeedSumEq":true,"tallySumN":3,"tallySillDamage":8,"tallySillDuration":2}`. At the **start of a combatant’s turn**, if they occupy this cell and leftover AP + leftover MP **=== 3**, deal 8 through `updateCombatant`. Walk-enter does **not** tax (Ingress / Shove Sting). End-turn occupy does **not** tax (Tally Post / Dwell). Relocate landing does **not** tax (Drift Post). Distinct from Poise Sill (#890, leftover AP === leftover MP ≥ 1 at start), Gaunt Sill (#849, leftover **both 0** at start), Wake Mark (start-turn any leftover), Quiet / Cast / Drift / Parched Sill. The decision: stand on the sill at (2,1) and eat 8 at dawn, or spend a pool overnight.  
DURATION: 2 turns  
SCALING: 8 follows dmg% if any; otherwise fixed.  
SYNERGIES: Tally Hold so they cannot walk off before their start; Dual Keep 2/2 is the **wrong** dawn (Poise Sill).  
COUNTERPLAY: Spend off 3 before turn start; walk off (start-only); Barrier last-writer fills the paint.  
POWER_BUDGET: Cheap 2 / CD 2. Power is **start-of-their-turn occupy on a sum of 3**.  
AI_USAGE: `aiHint: "tally_sill_if_tile_will_be_occupied_by_sum_eq_3_foe"`. Masons / rooks. Skip if the tile is empty and no foe can occupy it this round.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Paint is observation. Later tick is not a second observe. Occupant leftover 1/1 at start → no tax (Poise Sill’s window). Empty tile → no tax. Last writer vs other paints: Barrier > sill.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — start-of-turn leftover sum gate. Same class as Poise Sill / Gaunt Sill / Wake Mark.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-tally-hold`

NAME: Tally Hold  
ROLE: CONTROL — cannot spend walk MP while leftover AP + leftover MP === 3  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"tallyHoldWhileSumEq":true,"tallySumN":3,"tallyHoldDuration":2}`. For 2 of the **target’s** turns, any walk that would spend ≥ 1 leftover MP is illegal **while leftover AP + leftover MP === 3**. Teleport / Swap / Phase Slip / Twin-gate step / Tally Step (caster relocate) do **not** pay walk MP and are legal. Distinct from Poise Hold (#890, cannot walk while leftover AP === leftover MP ≥ 1), Odd Hold (#849, cannot walk while leftover AP is **odd**), Dry Hold (until leftover **AP = 0**), Drift Hold (until **force-moved**), Cast Hold / Strike Hold / Boot Hold / Tool Hold / Gaunt Hold. The decision: they have (0,3) and wanted to walk three tiles — they must **leave sum 3** (cast leftover AP from a (2,1) / (1,2) / (3,0), get siphoned, get turned) before walking, or wait 2 turns. At leftover (0,3) they **have** MP but cannot spend it while this hold is up. At leftover 0/0 they have 0 MP anyway (Gaunt window).  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Purse Turn to **keep** them in Tally while changing which pool is fat; Tally Lend **exits** the hold’s walk-lock (sum 5). Do **not** CORE with Must Tally as a Strike lock (this pass ships no Strike-only tally lock).  
COUNTERPLAY: Spend leftover AP (cast) to leave sum 3; blink; wait. From (0,3) they have no leftover AP to cast with — Purse Turn into (3,0) then Strike, or wait.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **walk denial while sum is 3**, not a root.  
AI_USAGE: `aiHint: "tally_hold_if_target_leftover_ap_plus_mp_eq_3_and_wants_to_walk"`. Hex / knights ELITE. Skip if leftover sum ≠ 3.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Missing keys → no arm. Leftover 2/2 → walk legal (sum 4, Poise Hold’s window). Leftover 0/0 → walk illegal for lack of MP, not because of this hold. Do not clone Poise Hold / Odd Hold / Dry Hold.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — walk-spend gate + leftover sum.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-tally-lend`

NAME: Tally Lend  
ROLE: SUPPORT — +1 current AP **and** +1 current MP to an ally whose leftover AP + leftover MP === 3 (**exits** the window)  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"tallyLendAp":1,"tallyLendMp":1,"requireTargetSumEqLend":true,"tallySumN":3}`. If the **target** has leftover AP + leftover MP **=== 3**, grant +1 current AP and +1 current MP (capped at max). The sum becomes **5** (the tally window **closes**). If the gate fails, fizzle rider (AP spent, no grant). Distinct from Poise Lend (#890, +1/+1 if leftover AP === leftover MP ≥ 1 — the **tie survives**), Gaunt Lend (#849, +1/+1 if leftover **both 0**), Lean / Drift / Spent Lend, Watch Alms, Tempo Gift / Loan Tempo / Haste, Dual Keep. The decision: cash the (2,1) wisp for a 2-resource bump, then they are out of Tally **and** out of Poise (sum 5 is 3/2 or 4/1 or 5/0). Poise Lend **keeps** a window; this **spends** one.  
DURATION: instant grant  
SCALING: none. Caps at max.  
SYNERGIES: Dual Keep to **bank** the new leftover (now a 3/2 or similar — not Tally, not Poise); Must Tally **before** the lend while they still sit on 3.  
COUNTERPLAY: Drain Courage / Slow after the grant; kill the buffer; refuse the window so the lend fizzles.  
POWER_BUDGET: Cheap 2 / CD 2. Power is **cashing a sum of 3**, not keeping a tie. Do not CORE with Haste / Loan Tempo / Poise Lend / Gaunt Lend.  
AI_USAGE: `aiHint: "tally_lend_if_ally_sum_eq_3"`. Buffers / bishops. Skip if the ally is not in the window **or** both pools are already at max.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Self-cast legal if caster leftover sum === 3 after paying 2 AP. Missing keys → no grant. Target leftover 1/1 → fizzle (Poise Lend’s window). Target leftover 0/0 → fizzle (Gaunt Lend’s window). Do not clone Poise Lend / Gaunt Lend / Haste / Dual Keep.  
IMPLEMENTATION_COMPLEXITY: LOW — leftover sum gate + two capped grants.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-tally-sip`

NAME: Tally Sip  
ROLE: CONTROL — steal 1 leftover AP iff target leftover AP + leftover MP === 3  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: No HP damage. `effectParams: {"tallySipAp":1,"requireTargetSumEqSip":true,"tallySumN":3}`. If the target leftover AP + leftover MP **=== 3** **and** leftover AP ≥ 1, subtract 1 leftover AP from the target (not below 0) and add 1 leftover AP to the caster this turn, capped at max. If leftover AP is 0 (the (0,3) pair) or the sum ≠ 3, fizzle rider (AP spent). Distinct from Poise Sip (#890, steal 1 leftover AP iff leftover AP === leftover MP ≥ 1), Bare Sip (#849, steal 1 leftover AP iff leftover **MP = 0**), Soul Sip (ungated current MP), Ap Sip (#342). The decision: sip (2,1) → they become (1,1) **Poise**; sip (3,0) → they become (2,0) off every named window; sip (1,2) → they become (0,2) Dry-Mend-adjacent. **Sip can manufacture Poise.**  
DURATION: instant (current-turn leftover only)  
SCALING: amount fixed.  
SYNERGIES: Poise Sting / Poise Mend **after** manufacturing 1/1; Tally Hold so they cannot walk the remaining MP.  
COUNTERPLAY: Sit on (0,3) (no AP to steal); sit off sum 3; Second Wind after.  
POWER_BUDGET: Cheap control, 0 damage, CD 1.  
AI_USAGE: `aiHint: "tally_sip_if_target_sum_eq_3_and_leftover_ap_ge_1"`. Hex / pawns. Skip if not in the window or leftover AP is 0.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Do not write `debuffStat: "ap"`. Missing keys → no steal. Target leftover 1/1 → fizzle (Poise Sip’s window). Challenge: not a heal, not MP.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-tally-post`

NAME: Tally Post  
ROLE: SUMMONS — empty-kit mine; end-turn occupy detonates iff leftover AP + leftover MP === 3  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "tallypost"`, `summonLifespan: 3`, empty kit. `effectParams: {"tallyPostDetonateDamage":10,"tallyPostNeedSumEq":true,"tallySumN":3}`. Place on a free ground tile. At **end of a combatant’s turn**, if they **occupy** this body and leftover AP + leftover MP **=== 3**, deal 10 to that occupant through `updateCombatant` and this summon dies. Walk-enter does **not** detonate (Ingress). Relocate landing does **not** detonate (Drift Post). Start-of-turn does **not** detonate (Wake / Gaunt Sill / Poise Sill / Tally Sill). Distinct from Poise Post (#890, leftover AP === leftover MP ≥ 1), Gaunt Post (#849, leftover **both 0**), Lean Post (leftover **AP = 0** only), Dummy Post (taunt), Drift Post (**relocate landing**), Dwell Mark (**end-turn occupy, any leftover**). The decision: end the turn on (2,1) and eat 10, or spend a pool, or dump to 0/0 and eat Gaunt Post instead, or sit on 2/2 and eat Poise Post. Dual Keep 2/2 **hurts Poise Post, not this**. Walk-safe. Relocate-safe. Start-turn-safe.  
DURATION: lifespan 3 or until detonate  
SCALING: 10 follows damage% if any; otherwise fixed.  
SYNERGIES: Tally Hold so they cannot walk off; Purse Turn **keeps** sum 3 through the end-turn check.  
COUNTERPLAY: Spend a pool before turn end; walk off (walk-safe); Coup the post; blink.  
POWER_BUDGET: Standard 3 / CD 3 / 0 upfront. Power is **end-turn occupy on a sum of 3**. Counts as **one** toward the summon cap.  
AI_USAGE: `aiHint: "tally_post_if_foe_will_end_turn_sum_eq_3_on_tile"`. Masons / pawns. Skip if cap is full.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","rook"]`, `levelZoneMin: 1`  
EDGE_CASES: **Summon is observation.** Later detonate / death is not a second observe. Missing keys → do not spawn a Dummy Post. Occupant leftover 1/1 at turn end → no detonate (Poise Post’s window). Occupant leftover 0/0 → no detonate (Gaunt Post’s window). Empty tile → no detonate, lifespan ticks. Never parse `"Tally Post"`. Do not mint `spell-tally-burst`. Prefer fizzle-and-detonate if the body is displaced by Swap (body gone → no tile tax).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — empty-kit summon + end-turn leftover sum gate. Same class as Poise Post / Gaunt Post / Lean Post.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-tally-bounce`

NAME: Tally Bounce  
ROLE: DAMAGE — 12 to primary; bounce 1 to nearest other leftover-AP+MP===3 hostile  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 12 to primary (ungated). `effectParams: {"tallyBounceNeedSumEq":true,"tallySumN":3,"tallyBounceSearchRadius":4,"tallyBounceCount":1}` — search Chebyshev ≤ 4 for the nearest **other** living hostile whose leftover AP + leftover MP **=== 3**; deal 12 to that body too. Primary leftover unconstrained. Distinct from Poise Bounce (#890, second body leftover AP === leftover MP ≥ 1), Gaunt Bounce (#849, second body leftover **both 0**), Parched Bounce (leftover **MP = 0**), Heave Bounce (**force-moved**), Chain Lightning (nearest **any**, 2 bounces). The decision: open on whoever, splash the (2,1) bishop — or wait for two 1/1 bodies and Poise Bounce.  
DURATION: instant  
SCALING: 12 follows damage%.  
SYNERGIES: Purse Turn a second body into Tally before the bounce search; Tally Hold to keep them in-window.  
COUNTERPLAY: Isolate (one Tally body); sit the second body on 1/1 or 0/0.  
POWER_BUDGET: Standard. 12 if no second Tally body; 24 if a second sits on sum 3.  
AI_USAGE: `aiHint: "tally_bounce_if_second_sum_eq_3_hostile_in_r4"`. Queens / bishops. Skip if no second in-window body **and** a Strike would kill the primary; 12 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing bounce keys → 12 only. Primary leftover 1/1 does **not** block the primary hit. Ties: nearest Chebyshev, then lowest id. Do not hit allies.  
IMPLEMENTATION_COMPLEXITY: LOW — one search + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-must-tally`

NAME: Must Tally  
ROLE: CONTROL — non-Strike illegal unless leftover AP + leftover MP === 3 **and** the spell spends last AP  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"mustNonStrikeUnlessSumEqAndSpendsLastAp":true,"tallySumN":3,"tallyHoldDuration":2}`. For 2 of the **target’s** turns, any non-Strike spell is illegal unless, **before** this (their) spell’s AP is paid, leftover AP + leftover MP **=== 3** **and** `apCost === leftover AP` (the spell spends last leftover AP). Strike / `physical_attack` stays legal. Walk stays legal unless a Tally Hold is also up. Distinct from Must Poise (#890, leftover AP === leftover MP ≥ 1 **and** last AP — **pre-spend equality**), Must Gaunt / Must Lean / Must Drift / Must Pace / Must Span / Must Step, Rite First (cannot Strike until a spell), Tool Hold (cannot tool until Strike). The decision: they sit on (2,1) with a 2-cost tool as their last packet, or they sit on (0,3) with walk MP and **no** leftover AP — Must Tally **blocks** every non-Strike from (0,3) because leftover AP is 0 (cannot spend last AP). (3,0) spending a 3-cost last packet **is** legal and dumps them to (0,0) Gaunt.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Tally Hold on (0,3) so they can neither walk nor non-Strike; Purse Turn (0,3)→(3,0) so a 3-cost last packet becomes legal. Do **not** CORE with a Strike-only tally lock (none shipped).  
COUNTERPLAY: Strike; blink; wait 2 turns; Purse Turn yourself if you own it.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **last-packet from a sum of 3**, not a silence.  
AI_USAGE: `aiHint: "must_tally_if_target_leftover_sum_eq_3_and_has_a_last_packet_spell"`. Knights / pawns ELITE. Skip if leftover sum ≠ 3. Do not arm if the only remaining legal verb is Strike and a walk would kill.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 2`  
EDGE_CASES: **Pre-spend leftover** (see §3.5). Missing keys → no lock. Leftover (1,1) → non-Strike still illegal (sum 2, Must Poise’s window). Leftover (0,0) → non-Strike illegal (Must Gaunt’s window, but this lock does not lift there). 0-AP tools (Timestep) are not “spending last AP”.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — pre-spend leftover sum + last-AP compare in the cast gate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-verse-tally`

NAME: Verse Tally  
ROLE: CONTROL — last resolved id illegal until leftover AP + leftover MP === 3  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"verseTallyUntilSumEq":true,"tallySumN":3}`. The target’s **last resolved spell id** (the id they most recently spent AP on) cannot be recast until leftover AP + leftover MP **=== 3**. Strike is not a spell id for this key. If they have no last resolved id, fizzle rider (AP spent). Distinct from Verse Poise (#890, lifts at leftover AP === leftover MP ≥ 1), Verse Gaunt (#849, lifts at leftover **both 0**), Verse Lean / Verse Pace / Verse Tax, Once Verse / Stolen Verse / Summon Verse (#906, pets pay +1 AP to **recast** last id; the id stays legal), Last Mute / Hex of Silence. The decision: lock their Inferno until they sit on (2,1) — sitting on 1/1 **does not** lift (Verse Poise’s window); sitting on 0/0 **does not** lift (Verse Gaunt’s window). Instant lift if they already sit on sum 3 at resolve (fizzle rider — do not arm a lock that is already lifted).  
DURATION: until leftover sum === 3 or battle end  
SCALING: none.  
SYNERGIES: Cadence Prime so the locked id is also remaining 1; Tally Hold so they cannot walk into a new leftover split.  
COUNTERPLAY: Sit on (2,1) / (1,2) / (3,0) / (0,3); recast a different id; wait. Dual Keep 2/2 does **not** lift this.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **which leftover window lifts the last verse**, not a silence.  
AI_USAGE: `aiHint: "verse_tally_if_target_last_id_is_their_win_condition"`. Hex / bishops. Skip if they have no last resolved id, or if they already sit on sum 3 (instant lift — fizzle rider).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing keys → no lock. Verse Tally does **not** lift at leftover 0/0 (Verse Gaunt) or leftover 1/1 (Verse Poise). Summon Verse (#906) is a recast tax, not a legality lock — do not merge the keys.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — last-id lock + leftover sum lift.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-prime`

NAME: Court Prime  
ROLE: SUPPORT — Cadence Prime on **every other** body (init order)  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `effectParams: {"primeRemainingCdsFrom0":true,"courtPrimeExcludeCaster":true}`. In initiative order, every living combatant **except the caster** has remaining `n===0` rewritten to `1` (ones stay 1; `n>1` unchanged), same rewrite as Cadence Prime. Distinct from Court Floor (#890, mass Floor `n>1` → `1`, zeros stay 0), Court Lag (#849, mass Lag `n>0` → `n+2`), Court Imprint (mass Imprint), Court Dual / Court Keep / Court Stretch / Court Hinge / Court Shove / Court Fold, Cadence Prime (one body), Cadence Flush (all → 0, ally), Cadence Swap (two-body map exchange). Player never owns this. Witness without grant.  
DURATION: instant rewrite  
SCALING: none.  
SYNERGIES: Kit with Cadence Prime on the caster’s own target after, or Floor a remaining `n>1` after the board’s ready tools are already sitting at 1. Do **not** CORE with Court Floor.  
COUNTERPLAY: Recast before Court Prime; Cadence Break your own remaining after; kill the regent.  
POWER_BUDGET: Signature 6 / CD 4 / 0 damage. Power is **board-wide ready-lock**. Kit-only.  
AI_USAGE: `aiHint: "court_prime_if_two_plus_foes_have_a_ready_nuke"`. Kit-only regent. Skip if every other remaining is already > 0.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. `NOT_PLAYER_LEARNABLE`. `court_prime_regent` kit-only. Arm is observation for witness-only kits. Never written to owned ids.  
EDGE_CASES: Missing `courtPrimeExcludeCaster` → do not prime the caster (fail closed, still observe). Do not write `spellLevelValues`. Do not mint `spell-court-arm`. Preview must list who primes. Do not reuse `courtFloorExcludeCaster`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — init-order walk + Cadence Prime rewrite. Same class as Court Floor / Court Lag.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-court-prime
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
effectParams: {"primeRemainingCdsFrom0":true,"courtPrimeExcludeCaster":true}
```

---

## 6. Combination matrix (statuses × leftover × terrain)

| Window | Tools |
| :--- | :--- |
| Leftover AP + leftover MP **=== 3** on an **ally** | Tally Mend (both bodies), Tally Step, Tally Lend (**exits** to 5) |
| Same window on a **hostile** | Tally Sting, Tally Sill (their turn start), Tally Hold (cannot walk), Tally Sip (can manufacture 1/1 Poise from (2,1)), Tally Post (their turn end), Tally Bounce (second body), Must Tally (self, pre-spend), Verse Tally (lifts here), Purse Turn (**keeps** the sum) |
| Same window on **self** | Tally Hood, Must Tally |
| Leftover AP === leftover MP **and leftover AP ≥ 1** | **Not this pass.** Poise\* / Equal Gift. Tally keys fail `tallySumN === 3` (even sums). |
| Leftover AP = 0 **and** leftover MP = 0 | **Not this pass.** Gaunt / Hollow Gift / Bare Sip / Verse Gaunt. Tally keys fail (sum 0). |
| Dual Keep / Purse Keep / Stride Keep surviving **2/2** | **Opens** every Poise gate. **Blocks** every Tally gate (sum 4) **and** every Gaunt gate. Spend 1 pool to enter Tally (2,1) / (1,2). |
| Dual Keep surviving **3/0** or **0/3** | **Opens** Tally. **Blocks** Poise (unequal) **and** Gaunt. |
| Remaining CD `n===0` on a hostile | Cadence Prime / Court Prime (ready-lock). Floor does **not** touch zeros. |
| Axis-aligned 2×5 free | Dec Span occupies all ten. Nine Span would have painted a 3×3 square. |
| One hostile leftover pair | Purse Turn inverts AP↔MP on that body. Tempo Invert stays ally. Bar Cross moves leftover **across two bodies**. |

Dual Keep leftover that survives turn start with **unequal** banks that do **not** sum to 3 (3/1, 4/0) **blocks** Tally **and** Poise **and** Gaunt. Spend or Purse Turn to enter a window.

Tally Sip on (2,1) → (1,1) is the **intended** Poise manufacture. Do not name-wire it; it falls out of the leftover writes.

---

## 7. Implementation order (not this pass)

1. Discovery ownership split (`SDE-2026-08-31-001`) — without it every Wave-15 id forced into `starterSpells` becomes always-owned.
2. Leftover AP / leftover MP writers (HUD pools after each spend). Dual Keep / Purse Keep / Stride Keep must write surviving leftover at turn start.
3. Cadence remaining-CD maps (already required by Waves 5–14). Cadence Floor (#906) is remaining `n>1` → `1`. Cadence Prime is remaining `n===0` → `1`.
4. Occupy-weight **before** Dec Span (cap 2 cannot host weight 10). Nine Span (weight 9) / Oct Span (weight 8) have the same prerequisite.
5. Confirm gates for Must Tally (pre-spend) / Tally Hold / Verse Tally / Purse Turn.
6. Rectangle multi-cell occupy (`decspan`) and empty-kit mine (`tallypost`).
7. Do **not** land `spell-parched-mend`. Do **not** land a second `spell-cadence-floor`. Do **not** reuse `invertApMp` / `floorRemainingCdsTo1` / `crossLeftoverApMpTwoBody`.

Do not implement production code in this pass.

---

## 8. QA (design-level)

| ID | Check |
| :--- | :--- |
| W15-1 | No Wave-15 id appears in `spellData.ts` / `SPELL_ID_CATALOG` / §1.4 tombstone |
| W15-2 | `spell-parched-mend` is **not** shipped; Dry Gait owns leftover-MP=0 heal |
| W15-3 | `spell-tally-mend` requires leftover AP + leftover MP **=== 3** on **both** bodies. Poise Mend / Equal Gift own **equality ≥ 1**. Hollow Gift / Gaunt Mend own **0 + 0**. |
| W15-4 | Cadence Prime is remaining `n===0` → `1`; `n>1` unchanged; ones stay 1. Does **not** clone Cadence Floor / Swap / Lag / Halve / Crack / Flush |
| W15-5 | Dec Span is axis-aligned 2×5, counts as **ten**, every cell occupied. Nine Span stays solid nine. Oct Span stays hollow eight |
| W15-6 | Purse Turn is hostile one-body leftover AP↔MP. Does **not** clone Tempo Invert or Bar Cross. Does **not** reuse `invertApMp` |
| W15-7 | Tally Hood does **not** retag `even_gallery` / Spent Plate / Gait Plate / Poise Hood |
| W15-8 | Tally Sting bonus is leftover AP + leftover MP === 3, not Poise Sting’s equality, not Gaunt Sting’s both-0, not Tied Gait’s (2,2) |
| W15-9 | Tally Sip on (2,1) writes (1,1). Bare Sip stays leftover MP = 0. Poise Sip stays equality ≥ 1 |
| W15-10 | Must Tally is **not** in the same CORE as a Strike-only tally lock (none shipped). Reads leftover **before** debit |
| W15-11 | Court Prime is `NOT_PLAYER_LEARNABLE`; `court_prime_regent` is kit-only |
| W15-12 | Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` do not restamp #808 / #836 / #849 / #837 / #890 / #903 / #906 |
| W15-13 | `mpCost` is 0 on every Wave-15 row |
| W15-14 | `summonAI` values are `"decspan"` / `"tallypost"` enums, never parsed names |
| W15-15 | Dec Span does not ship against `ENEMY_SUMMON_CAP === 2` without occupy-weight |
| W15-16 | Verse Tally does **not** lift at leftover 0/0 (Verse Gaunt) or leftover 1/1 (Verse Poise) |
| W15-17 | No second `spell-cadence-floor`. SDE #906 owns Floor |
| W15-18 | Legal Tally pairs are only (3,0) (0,3) (2,1) (1,2) |

---

## 9. Out of scope

- Production TypeScript / Motoko / bindgen / PocketIC.
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / **#836** / **#903** own extra doors).
- Restamping any door in §3.4.
- A fourth `mpCost > 0` walk snipe; Hex of Silence; About Hinge; mid-RAF splice; sixth echo; one-body AP===MP≥1 heal (Equal Gift / Poise Mend already split it); remaining `n>1` → `1` (Cadence Floor, SDE wins); leftover-sum **=== 4**; eleven-cell occupy; target-only sum===3 heal; leftover **diff** window; two-hostile invert.
- Cloning Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Shadow Veil, Mirror / Reflect, Lens / Overcast, Short Sight / Paper Wind, Tempo Gift / Loan Tempo, Goad / Taunt Oath, Rime Tile / Rime Sheet, File Lance, Blood Tithe, Hex of Silence, Dry Mend, Dry Gait, Parched Mend, Hollow Gift, Cadence Swap, Cadence Floor, Gaunt Mend, Poise Mend, Equal Gift, Tempo Invert, Bar Cross.
- Putting unique #802 / #837 / #849 / #890 / #906 ids in this catalog.

---

## 10. Catalog index

| SPELL_ID | NAME | ROLE | ACQUISITION | AP | CD | Door |
| :--- | :--- | :--- | :--- | ---: | ---: | :--- |
| `spell-tally-mend` | Tally Mend | SUPPORT | MULTI_SOURCE | 3 | 2 | `tally_cantor` |
| `spell-cadence-prime` | Cadence Prime | CONTROL | MULTI_SOURCE | 3 | 2 | `prime_precentor` |
| `spell-dec-span` | Dec Span | SUMMONS | MULTI_SOURCE | 4 | 3 | `span_dec` |
| `spell-purse-turn` | Purse Turn | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-tally-hood` | Tally Hood | DEFENSE | ELITE | 2 | 2 | (piece observe) |
| `spell-tally-sting` | Tally Sting | DAMAGE | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-tally-step` | Tally Step | POSITION | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-tally-sill` | Tally Sill | TERRAIN | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-tally-hold` | Tally Hold | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-tally-lend` | Tally Lend | SUPPORT | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-tally-sip` | Tally Sip | CONTROL | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-tally-post` | Tally Post | SUMMONS | ENEMY_DISCOVERY | 3 | 3 | (piece observe) |
| `spell-tally-bounce` | Tally Bounce | DAMAGE | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-must-tally` | Must Tally | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-verse-tally` | Verse Tally | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-court-prime` | Court Prime | SUPPORT | NOT_PLAYER_LEARNABLE | 6 | 4 | `court_prime_regent` (kit) |

STATUS: PROPOSED — no production code.

---

## 11. Source map (read-back)

| Topic | File | Lines |
| :--- | :--- | :--- |
| Live 32-id catalog | `src/frontend/src/data/spellData.ts` | 9–691 |
| Forced `isBaseSpell` | `src/frontend/src/components/WorldExploration.tsx` | 2396–2408 |
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

**Document status:** PROPOSED. Safe to review and implement in a later, explicit data PR. Not a license to land combat code in the same change as this spec. Coordinate with **#906** so Cadence Floor / Equal Gift land once. Coordinate with **#890** so Poise Mend / Nine Span / Bar Cross land once as Wave-15 family CORE. This catalog stamps as Wave **16** family CORE.

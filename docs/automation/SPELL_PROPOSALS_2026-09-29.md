# Spell and Tactical Mechanics — Design Pass 2026-09-29

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1 law [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) through still-open Wave 11 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-28.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-bd29/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-28.md) (#747)
- Spell, Discovery & Achievement Admin — still-open #677 / #729
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) … still-open Wave 11 [`SPELL_PROPOSALS_2026-09-28.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-baa8/docs/automation/SPELL_PROPOSALS_2026-09-28.md) (#726)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); extra doors through #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753; tactical extras #463 / #525 / #563 / #636 / #695 / #726

This is **Wave 12**. Wave 11 (#726) filled both-force heal, leftover AP+MP bank, seven-cell occupy, remaining-CD ÷2, exact-2 miss, leftover-AP-and-MP poke, caster-to-forced-ally step, relocate-dest lock, cannot-walk-until-forced, +AP to a forced ally, steal leftover AP iff forced, relocate-landing post, bounce among forced hostiles, walk-dir lock, last-id illegal until walk, and a mass Dual Keep signature.

**Wave 11 explicitly deferred eight holes.** Same-day Discovery Wave 11 (#747, opened after #726) claimed **one** of those eight as a unique SDE id. This pass fills three leftovers and leaves the rest held:

| Wave-11 leftover | Owner after #747 | This pass |
| :--- | :--- | :--- |
| Heal if **both leftover AP = 0** | **#747 Dry Mend** (`spell-dry-mend`) | Stamp, do not clone. Do **not** mint `spell-both-dry` |
| Six-cell occupy | Still open | **This pass:** Six Span (2×3 rectangle, counts as **six**) |
| Copy remaining CDs from target onto the caster | Still open | **This pass:** Cadence Imprint (copy matching ids; target **keeps**) |
| Mid-RAF splice | Held (AGENTS.md) | Still held |
| Fourth `mpCost > 0` walk snipe | Held (Ley Toll / Undertow / Sanguine Toll) | Still held |
| Sixth echo id | Held | Still held |
| Player-owned Hex of Silence | Held (`BOSS_ONLY`) | Still held |
| Player-owned About Hinge | Held (`BOSS_ONLY` on #590) | Still held. Hostile 180° around a pair midpoint is still Pawn Trade. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after the reserved set **and** after #726 / #747. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

Same-day Discovery Wave 12 had **not** opened at authoring (`created:>=2026-09-29` tactical/SDE search returned 0 PRs). If a later SDE Wave-12 catalog claims a unique §11 id that matches one below, **SDE wins**; rename is not this pass’s job. Do **not** clone #747 unique ids (including Dry Mend). Stamp family / observe metadata onto Wave-12 **tactical** ids only.

Do **not** mint `spell-both-dry` (Dry Mend owns both-leftover-AP heal), `spell-hex-span` / `spell-six-occupy` (Six Span owns six-cell), `spell-cadence-copy` / `spell-cd-copy` (Cadence Imprint owns the copy), or `spell-long-hood` (Odd Hood owns the odd-Chebyshev miss; Far Hood already covers ≥3).

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is unchanged since 2026-08-31. Discovery is still inert. WX is **19,213** lines (`wc -l`). Same HEAD as Waves 4–11. `WorldExploration.tsx` lives at `src/frontend/src/components/WorldExploration.tsx` (not `engine/`).

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

Live `ENEMY_SUMMON_CAP` is still **2** (`gameConstants.ts` 300). Quad Span (#636) counts as four, Penta Span (#695) as five, Sept Span (#726) as seven on paper; all three are implementation-blocked until that cap (or a dedicated occupy-weight) exists. Six Span is the same class: **propose the hole, do not pretend it can ship against cap 2**.

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
| Spell `mpCost` debit | `executeCastAttempt` (`WorldExploration.tsx` 17096–17207) gates **AP only**. | Always 0 | Ley Toll / Undertow / Sanguine Toll. **No fourth snipe this pass.** |
| `areaShape` cone / cross / line | Typed, **unread**. Area = Chebyshev (`targeting.ts` 690–727) | Unused | Fan Bolt / Cross Cut reserved |
| `targetType: "line"` | Implemented 8-dir ray (`targeting.ts` 576–617) | **No spell** | File Lance |
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** | Unused | Shoulder Bash, Hook Line, Parched Step (this pass **relocates the caster** onto a free Chebyshev-1 of a leftover-MP=0 ally — occupancy dest, not `isSwap`) |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768 → WX `swapPositions` 9389–9401) | Swap | Pawn Trade / Ward Interpose / Parched Bounce is **not** `isSwap` |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, never this set |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire |
| Walk / leftover / force flags | Paper `walkMpSpentThisTurn` (Waves 6–10). Paper `forcedMovedThisTurn` (Wave 9). Leftover AP/MP die at turn end | Haste grants **now**; Timestep is full **now** | **This pass: Parched Mend / Dry Hold / Lean* / Must Lean / Verse Lean / Court Imprint** |
| Six-cell occupy | Twin = 2; Triple = 3; Quad = 4; Penta = 5; Sept = 7 | Absent | **This pass: Six Span** (2×3 = 6) |
| Copy remaining CDs onto caster | Theft **steals**; Rest skips **own** tick; Halve **÷2** on a hostile | Inferno CD 3 is the only live lock | **This pass: Cadence Imprint (copy matching ids; target keeps)** |
| Odd-Chebyshev miss | Near ≤ 1; Mid **exactly 2**; Far **≥ 3** | Unused live | **This pass: Odd Hood (odd Chebyshev)** |

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

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` (tactical W2 **and** Discovery W2); `spell-blood-tithe` (tactical W2 pet sacrifice **versus** Discovery W2 HP→AP). Wave 12 does not add a third.

**Do not alias** Parched Mend ↔ Dry Mend / Still Mend / Both Mend / Heave Mend / Shove Mend / Gait Mend / Chase Mend / Clash Mend / Bar Mend / Blood Mend; Cadence Imprint ↔ Cadence Theft / Rest / Halve / Trim / Shave / Stall / Flush / Stretch / Crack / Break / Lend / Brand / Pin; Six Span ↔ Twin Span / Triple Span / Quad Span / Penta Span / Sept Span / Span Guard / Span Pylon / Void Span; Odd Hood ↔ Near Hood / Mid Hood / Far Hood / Fog Hood / Tick Hood / Own Plate / Off Plate / Sidestep Ward; Lean Sting ↔ Dry Sting / Damp Sting / Ready Sting / Full Purse / Lone Purse / Pair Purse / Post Sting / Boot Sting / Shove Sting; Parched Step ↔ Home Step / Ally Step / Heave Step / Hinge Step / Cover Step / Ghost Step / Soft Step / Bias Step; Parched Sill ↔ Quiet Sill / Cast Sill / Drift Sill / Gift Sill / Pet Sill / Kennel Sill / Body Sill / Claim Ward / Nail Down; Dry Hold ↔ Drift Hold / Tool Hold / Boot Hold / Cast Hold / Strike Hold / Hold Ground; Lean Lend ↔ Spent Lend / Boot Lend / Drift Lend / Leftover Lend / Cadence Lend / Tempo Gift / Watch Lend; Parched Sip ↔ Gait Sip / Soul Sip / Ap Sip / Drift Sip / Drain Courage; Lean Post ↔ Dummy Post / Drift Post / Bait Pylon / Spark Whelp / Ingress Mark / Dwell Mark; Parched Bounce ↔ Chain Lightning / Ricochet Mark / Split Fang / Heave Bounce; Must Lean ↔ Must Step / Must Span / Must Pace / Must Drift / Rank Lock / Inch Stride / Cast Hold / Tool Hold; Verse Lean ↔ Verse Tax / Verse Pace / Verse First / Last Mute / Once Verse / Stolen Verse / After Verse / Cast Hold; Lean Hold ↔ Strike Hold / Rite First / Tool Hold / Oath Blade / Boot Hold; Court Imprint ↔ Court Dual / Court Keep / Court Stretch / Court Hinge / Court Shove / Court Fold / Adj Fold.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved, live, or still held) |
| :--- | :--- | :--- |
| SUPPORT parched heal | Heal iff **caster and target** both have leftover **MP = 0** | Dry Mend is leftover **AP = 0**. Still Mend is caster **walk MP spent = 0**. Both Mend is **both walked**. Heave Mend is **both force-moved**. |
| CONTROL CD imprint | Copy remaining CDs from target onto caster for **ids both know**; target **keeps** | Cadence Theft **steals**. Cadence Rest skips **own** tick. Halve **÷2** on a hostile. Trim **−1**. Pin **freezes one**. |
| SUMMONS six-cell | 2×3 rectangle, counts as **six** | Twin = 2. Triple = 3. Quad = 2×2 = 4. Penta = plus = 5. Sept = stretched plus = 7. |
| DEFENSE odd hood | Next applied hit from **odd** Chebyshev → 0 | Near is **≤ 1**. Mid is **exactly 2**. Far is **≥ 3** (already includes 3). Do not mint exact-3. |
| DAMAGE lean sting | Bonus iff leftover **AP = 0 and leftover MP ≥ 1** | Dry Sting is leftover **AP = 0** (no MP gate). Ready is leftover **AP ≥ 1 and MP ≥ 1**. Damp is leftover **MP ≥ 2**. Pair Purse is leftover AP **exactly 2**. |
| POSITION parched step | Caster lands on a free Chebyshev-1 of an ally with leftover **MP = 0** | Home Step is ungated. Heave Step is **force-moved** ally. Ally Step is **they** land next to the caster. |
| TERRAIN parched sill | Occupant cannot spend walk MP; force-move still legal | Drift Sill forbids **relocate dest**. Gait Seal is **unit**. Root is 0 walk. Quiet/Cast Sill are confirm-gates. |
| CONTROL dry hold | Cannot spend walk MP until leftover **AP = 0** | Drift Hold: until **force-moved**. Boot Hold: until **Strike**. Cast Hold: cannot **spell** until walk. |
| SUPPORT lean lend | +1 current MP to an ally whose leftover **AP = 0** | Spent Lend is +1 **MP** if they **walked**. Drift Lend is +1 **AP** if **forced**. Boot Lend requires **unmoved**. |
| CONTROL parched sip | Steal 1 leftover MP **iff leftover AP = 0** | Gait Sip is **MP** iff they **walked**. Drift Sip is leftover **AP** iff **forced**. Soul Sip is ungated MP. |
| SUMMONS lean post | Empty-kit body; **end-turn occupy with leftover AP = 0** deals 10 and it dies; leftover AP ≥ 1 is safe | Drift Post is **relocate landing**. Ingress Mark is **walk enter**. Dwell Mark is **end-turn occupy, any leftover**. Dummy Post is taunt. |
| DAMAGE parched bounce | 12 to primary; bounce 1 to nearest **other** leftover-MP=0 hostile | Heave Bounce is **force-moved**. Chain Lightning bounces to nearest **any**. |
| CONTROL must-lean | Remaining **non-Strike** spells illegal unless leftover **MP = 0** | Cast Hold bans **all** spells until they **walk**. Tool Hold bans tools until **Strike**. Must Drift is walk **dir**. |
| CONTROL verse lean | Last resolved id is **illegal until leftover MP = 0** | Verse Pace is until they **walk**. Last Mute is duration. Verse Tax is legal but **+1 AP**. |
| CONTROL lean hold | Cannot resolve **Strike** until leftover **MP = 0** | Strike Hold is until they **walk**. Rite First is until a **spell**. Tool Hold is cannot-tool-until-Strike. |
| SUPPORT mass imprint | Signature: Cadence Imprint on **every other** body | Court Dual is mass Dual Keep. Player never owns this. |
| RESOURCE fourth MP snipe | — | **Held forever** with Ley Toll / Undertow / Sanguine Toll |
| Sixth echo | — | Held for Discovery |
| Full-bar silence | — | Hex of Silence stays `BOSS_ONLY` |
| Mid-RAF splice | — | Held (AGENTS.md) |
| Eight-cell occupy | — | **Skipped**. Wave 13. |

**Still open after this wave (do not fill today):** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; a sixth echo id; player-owned Hex of Silence; player-owned About Hinge (stays `BOSS_ONLY`); eight-cell occupy; heal-if-**both leftover AP and leftover MP = 0**; swap remaining CDs caster ↔ target. Those stay Wave 13 / Discovery so this pass stays discrete.

---

## 3. Contract with Dynamic Spell Discovery

Coordinate with Discovery (`c26e5a83-…`) and Admin (`4efa22ec-…`). This pass only stamps acquisition so those layers can filter **by field**. Same-day Discovery Wave 12 had not opened at authoring — **do not mint or clone #747 unique §11 ids**. If SDE Wave 12 later claims one of this catalog’s ids, **SDE wins**.

### 3.1 Discovery is still inert (reconfirmed @ `0f5363f`)

1. All 32 frontend spells are forced `isBaseSpell` (`WorldExploration.tsx` 2395–2408).
2. Recap grants XP/Doka/feats only.
3. Achievements (`defaultAchievements`, `admin.mo` 309–326) grant Doka only.
4. Challenges (`DEFAULT_CHALLENGES` 44–109) grant Doka/XP/badge only.
5. `upgradeSpell` levels a known id; it does not unlock ids.
6. `ENEMY_KITS` (`enemyAI.ts` 163–185) still reuse always-owned ids. Seeing a bishop cast Frost teaches nothing.
7. `buildEnemyKit` still takes `currentMap.levelZone` (`WorldExploration.tsx` 11920). The zone object is `{ name, minLevel, maxLevel }` (4683–4687). `Math.floor(levelZone)` is `NaN` (`enemyAI.ts` 194–199) → every kit stays zone 0.
8. `executeCastAttempt` still does not debit `spell.mpCost`. This pass adds **zero** `mpCost > 0` rows, so it does not widen that bug.
9. No `ownedSpellIds` / `observedSpellIds` persist maps. Character still has `spellLevelKeys` / `spellBarOrder` (`main.mo` 132–142).

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 12 ids to `starterSpells` as base. Do **not** land Wave-12 data before Wave-1 ownership split (`SDE-2026-08-31-001`) through Wave-11 (#726 / #747) data.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "sixspan"` and `"leanpost"` are **string enums on the config**.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Parched Mend / Cadence Imprint / Odd Hood / Lean Sting / Dry Hold / Lean Lend / Parched Sip / Must Lean / Verse Lean / Lean Hold **arming** (AP spent) **is** observation, including a blocked / unmoved / no-last-id / leftover-gate fizzle after AP. Later consume / convert / peel is **not** a second observe.
- Parched Sill **paint** is observation. Later blocked walk is not a second observe.
- Parched Step / Parched Bounce **cast** (AP spent) **is** observation, including a bounce that finds no second body.
- Six Span / Lean Post **summon** is observation. Later occupy / detonate / death is not a second observe.
- Court Imprint **arm** is observation for witness-only kits. Never written to owned ids.
- Do not require “see it N times” except where a boss adaptation already does. Wave 12 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.
- Do not stamp `survivor` (Last Ember / Last Ward). #646 / #679 / #747 left that feat leftover on purpose.

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

**Every live feat and every live challenge id is already a sole spell door or a MULTI child.** Wave 12 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 12 does **not** invent a 16th feat. #590 already stamped leftover `leader_slayer` / `spell_master` MULTI children (Crown Cut / Full Bar). SDE Wave 7 already claimed leftover `hard_1` / `legendary_1` MULTI children (Thin Ward / Clean Blood).

**Live 19 first-wins are all taken (do not restamp as the only door):**  
`starborn_queen` (Cut In), `pale_archivist` (After Verse), `starved_vampire_pawn` (Sanguine Toll), `lord_of_static` (Draw Together), `final_pawn` (Eclipse Fold), `mirror_sovereign` (Echo Cast), `crimson_countess` (Crimson Pact), `void_grandmaster` (Twin Gate), `midnight_bishop` (Life Tether), `chessboard_lich` (Claim Ward), `twin_monarchs` (Choir Hymn), `alabaster_fortress` (Pain Link / Aftershock), `bone_cavalier` (Vault / Caltrop), `pale_archbishop` (Reliquary / Glyph Snare extras), `fetid_rook` (Rot Brand), `broodmother_rook` (Brood Ward), `weeping_pawn` (Mute Thread, #411), `eternal_pawn_king` (Queue Cut, #411), `enthroned_void` (File Vault MULTI child, #411). `second_lament` remains kit-only False Cut.

**Wave-5…11 boss extra doors — do not restamp:** `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`, `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`, `mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`, `gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`, `toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`, `crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`, `sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`.

**Wave-6…11 tactical extra doors — do not restamp:** `oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`, `pace_prelate`, `span_triune`, `wick_mason`, `slip_castellan`, `court_usher`, `gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`.

**Wave-8 / Wave-9 / Wave-10 / Wave-11 SDE extras — do not restamp:** `about_hinge_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `pair_gallery`, `knight_fold_regent`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`.

**New proposed extra doors for the boss designer (Wave 13 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `parched_cantor` first-win | Parched Mend MULTI child (observe+win still grants). `heave_cantor` stays Heave Mend. `both_cantor` stays Both Mend. Dry Mend (#747) has **no** extra door — do not invent `dry_cantor`. |
| `imprint_precentor` first-win | Cadence Imprint MULTI child. `halve_precentor` stays Halve. `trim_precentor` stays Trim. `long_precentor` stays Pack Long (#747 `ENEMY_ONLY`). |
| `span_six` first-win | Six Span MULTI child. `span_sept` stays Sept Span. `span_penta` stays Penta Span. `span_quad` stays Quad Span. `span_triune` stays Triple Span. |
| `court_imprint_regent` kit only | Court Imprint (`NOT_PLAYER_LEARNABLE`). `court_dual_regent` stays Court Dual. `adj_fold_regent` stays Adj Fold. |

Piece-type observe paths (not feat doors): cantors / bishops for Parched Mend; scribes / tempo for Cadence Imprint; masons / rooks ELITE for Six Span; lurkers / knights for Odd Hood; lurkers / pawns for Lean Sting; porters / queens for Parched Step; masons / rooks for Parched Sill; hex / knights for Dry Hold; buffers / bishops for Lean Lend; hex / pawns for Parched Sip; masons / pawns for Lean Post; queens / bishops for Parched Bounce; knights / pawns for Must Lean; hex / bishops for Verse Lean; knights / pawns for Lean Hold.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 key names for a different meaning.

`mpCost` stays 0 on every Wave-12 row.

**New keys (Wave 12 only):**

```text
requireCasterLeftoverMpEq0, requireTargetLeftoverMpEq0, parchedMendAmount,  // Parched Mend
imprintMatchingCds,                                                         // Cadence Imprint — copy matching ids; target keeps
sixSpanCells,                                                               // Six Span — 6; 2×3 from origin
oddHoodNextHit,                                                             // Odd Hood — next hit odd Chebyshev → 0
leanLeftoverApEq0, leanLeftoverMpMin, leanStingBonus,                       // Lean Sting
parchedStepNeedLeftoverMpEq0, parchedStepAdj,                               // Parched Step — dest Chebyshev 1 of target
parchedSillForbidWalkMp, parchedSillDuration,                               // Parched Sill — 2 turns
dryHoldUntilLeftoverApEq0, dryHoldDuration,                                 // Dry Hold — 2 of their turns
leanLendMp, requireTargetLeftoverApEq0Lend,                                 // Lean Lend — +1 MP iff leftover AP = 0
parchedSipMp, requireTargetLeftoverApEq0Sip,                                // Parched Sip — steal 1 leftover MP iff leftover AP = 0
leanPostDetonateDamage, leanPostNeedLeftoverApEq0,                          // Lean Post — 10 on end-turn occupy if leftover AP = 0
parchedBounceNeedLeftoverMpEq0, parchedBounceSearchRadius, parchedBounceCount, // Parched Bounce
mustNonStrikeUntilLeftoverMpEq0,                                            // Must Lean — remaining non-Strike illegal unless leftover MP = 0
verseLeanUntilLeftoverMpEq0,                                                // Verse Lean — last id illegal until leftover MP = 0
leanHoldStrikeUntilLeftoverMpEq0,                                           // Lean Hold — Strike illegal until leftover MP = 0
courtImprintExcludeCaster                                                   // Court Imprint
```

If a key is missing, the rider does not fire.

Nested kit-only id (not a player card): none new besides Court Imprint itself. Lean Post’s detonate is **not** a second spell id (the summon row carries `leanPostDetonateDamage`). Do not mint `spell-lean-burst`.

Leftover AP / leftover MP are **current remaining after this spell’s AP is paid**, read from the same pools the HUD uses. Walk spends must write leftover MP. Spell spends must write leftover AP. Missing leftover → the gate fails closed (fizzle rider, AP spent, observe).

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Cadence Imprint’s copy is paid in **matching remaining locks**, not in extra AP.

---

## 5. Proposed spells (Wave 12)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-parched-mend`

NAME: Parched Mend  
ROLE: SUPPORT — heal if caster **and** target both have leftover MP = 0  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"requireCasterLeftoverMpEq0":true,"requireTargetLeftoverMpEq0":true,"parchedMendAmount":8}`. If **both** caster and target have leftover walk MP **= 0** at resolve (after this spell’s 3 AP is paid), heal the target 8 through the existing heal helper. If either leftover MP ≥ 1, fizzle rider (AP spent, no HP). Walk / force-move / leftover-AP flags do **not** substitute. Distinct from Dry Mend (#747, both leftover **AP = 0**), Still Mend (#747, caster **spent 0 walk MP** this turn — they may still have leftover MP from Dual Keep / Stride Keep), Both Mend (#695, both **walked**), Heave Mend (#726, both **force-moved**). The decision: two bodies dump or camp their walk pool, then 8 — or skip. `healAmount` stays 0 on the row so `inferArchetype` (`enemyAI.ts` 447–452) does not treat a kit that only *carries* this id as healer unless the resolver actually wrote HP; **healer CORE only** when the row is in a live pool.  
DURATION: instant  
SCALING: 8 follows heal% if any; amount otherwise fixed.  
SYNERGIES: Walk Toll / Must Step to dump their MP; Dual Keep / Stride Keep **blocks** this until they spend the bank; Parched Sip to land them on 0.  
COUNTERPLAY: Keep 1 leftover MP; Cursed Wound; kill the cantor first.  
POWER_BUDGET: Standard heal, gated on **two** leftover-MP=0 flags. Blood Mend is 12 ungated self. Dry Mend is the AP twin — do not stack both in the same CORE.  
AI_USAGE: `aiHint: "heal_if_both_leftover_mp_eq_0"`. Cantors / bishops. Skip if either leftover MP ≥ 1. **Healer CORE only.** Do not dump leftover MP **only** to enable this if a Strike would kill.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop","queen"], levelZoneMin: 1 }`. MULTI child `parched_cantor`.  
EDGE_CASES: Targeting ally already allows self (`targeting.ts` 184–189). Self-cast requires the caster’s leftover MP is 0 (one body, both flags). Player-side HP actually increased → `challengeHealUsedRef`. Missing keys → no heal. Do not clone Dry Mend.  
IMPLEMENTATION_COMPLEXITY: LOW — two leftover-MP reads + existing heal helper.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-parched-mend
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
effectParams: {"requireCasterLeftoverMpEq0":true,"requireTargetLeftoverMpEq0":true,"parchedMendAmount":8}
```

---

### SPELL_ID: `spell-cadence-imprint`

NAME: Cadence Imprint  
ROLE: CONTROL — copy remaining CDs from target onto the caster  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"imprintMatchingCds":true}`. For each spell id in the **target’s** remaining-CD map with `n > 0`, if the **caster** also owns that id (bar or known kit — id match only, never name), write caster remaining = `max(caster remaining, n)`. Target **keeps** every lock. Ids the caster does not own are ignored (no stolen kit). Once/battle flags and spell levels are **not** CDs. Distinct from Cadence Theft (#411, **steals** remaining — target loses the lock), Cadence Rest (#747, **own** remaining do not tick), Cadence Halve (#726, **÷2** on the hostile), Cadence Trim (−1 on the hostile), Cadence Lend (give remaining to an ally). The decision: copy their Inferno 3 onto your Inferno so you cannot recast either — or skip because you wanted that id this turn.  
DURATION: instant rewrite of the caster’s matching remaining locks  
SCALING: none.  
SYNERGIES: Verse Tax / Must Lean after you copied a 3-lock onto yourself; Halve them first if you do **not** want the copy.  
COUNTERPLAY: Do not hold a 3-lock against a tempo bishop; recast the locked id **before** Imprint; Cadence Crack their highest to 0 before they copy.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **shared downtime**, not a steal.  
AI_USAGE: `aiHint: "imprint_if_target_has_matching_remaining_cd_ge_2"`. Scribes / tempo. Skip if no shared id with remaining ≥ 2, or if the caster’s next intended id would lock.  
DISCOVERY_ELIGIBILITY: true. MULTI child `imprint_precentor`. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing key → no rewrite. Do not write `spellLevelValues`. Do not reset Dual Keep’s once/battle. Preview must show which of the **caster’s** locks change. Empty intersection → fizzle rider (AP spent, observe).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — intersect two cooldown maps by id.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-cadence-imprint
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
effectParams: {"imprintMatchingCds":true}
```

---

### SPELL_ID: `spell-six-span`

NAME: Six Span  
ROLE: SUMMONS — six-cell occupy (2×3 rectangle)  
ACQUISITION: MULTI_SOURCE  
AP_COST: 4  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "sixspan"`, `summonLifespan: 4`, empty kit (`summonUnitDef` with `pieceType: ""` / zero scales — a body, not a caster). `effectParams: {"sixSpanCells":6}`. Click a free ground tile as **southwest-most** origin. Caster chooses one rotation via `linear` **or** `diagonal` **false** plus an explicit `effectParams` facing: **cardinal** file = 2 wide × 3 tall, or **rank** = 3 wide × 2 tall (store `sixSpanAxis: "file"|"rank"` on the cast payload, not the name). All 6 cells must be free (`isCellFree`); else fizzle (AP spent). One combatant id, six-cell footprint. Counts as **six** toward the summon cap. Distinct from Twin Span (2 walking), Triple Span (3), Quad Span (2×2 = 4), Penta Span (ortho plus = 5), Sept Span (stretched plus = 7). The decision: seal a 2×3 closet for six cap, or you cannot afford the weight.  
DURATION: lifespan 4  
SCALING: footprint fixed.  
SYNERGIES: File Lance / Cast Sill / Parched Sill around the rectangle; Quiet Sill on a corner so Strike cannot peel through.  
COUNTERPLAY: Occupy any of the 6 before paint; Coup the body (one HP pool); walk around the long axis.  
POWER_BUDGET: Heavy 4 / CD 3 / 0 damage. Power is **six** cells of deny.  
AI_USAGE: `aiHint: "six_span_if_six_free_on_2x3_and_cap_allows"`. Masons / rooks ELITE. Skip if any footprint cell is occupied **or** remaining summon weight + 6 would exceed cap.  
DISCOVERY_ELIGIBILITY: true. MULTI child `span_six`. `pieceTypes: ["rook"]`, `levelZoneMin: 2`  
EDGE_CASES: **Do not ship while `ENEMY_SUMMON_CAP === 2` without occupy-weight.** Never parse `"Six Span"` or `"Hex"`. One id, six cells — destroying the body frees all six. Player-side Six Span counts toward the **player** summon economy, not `ENEMY_SUMMON_CAP`. Missing `sixSpanCells` → do not spawn a 1-cell body and call it Six Span. Do not mint `spell-hex-span`.  
IMPLEMENTATION_COMPLEXITY: HIGH — multi-cell occupy + cap weight. Same class as Quad / Penta / Sept.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-six-span
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
isSummon: true
summonAI: "sixspan"
summonLifespan: 4
usableByPlayer: true
usableByEnemy: true
minLevel: 2
isBaseSpell: false
effectParams: {"sixSpanCells":6}
```

---

### SPELL_ID: `spell-odd-hood`

NAME: Odd Hood  
ROLE: DEFENSE — next hit from odd Chebyshev is 0  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"oddHoodNextHit":true}`. The next **applied** damaging hit whose Chebyshev distance from the attacker’s tile to this unit is **odd** (1, 3, 5, …) deals 0 and consumes the charge. Even-Chebyshev hits (0, 2, 4, …) land and **do not** consume. Distinct from Near Hood (≤ 1 — consumes on 1, which is odd, but also would have consumed 0 if 0 were in range), Mid Hood (**exactly 2**, even), Far Hood (**≥ 3**, mixed odd and even), Own Plate (next hit on **your turn**, any range), Sidestep Ward (next hit any range). The decision: stand at even range against a melee pawn, or bait the bishop’s range-3 Frost into a 0.  
DURATION: until consumed or this unit’s next turn start (whichever first)  
SCALING: none.  
SYNERGIES: Must Step forces Chebyshev-1 walks (odd — they whiff); Mid Hood stacks poorly (2 is even).  
COUNTERPLAY: Hit from even Chebyshev (Strike adjacent is 1 — **odd**, so melee whiffs; step to 2 then Strike). Far Hood already covers ≥ 3 mixed; do not treat Odd Hood as a Far clone.  
POWER_BUDGET: Cheap 2 / CD 2. Next-hit only. Elite because it blanks the common 1-and-3 bands.  
AI_USAGE: `aiHint: "odd_hood_if_likely_next_hit_odd_chebyshev"`. Lurkers / knights. Skip if the only threat sits at 2.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 2`  
EDGE_CASES: Consume **before** `dealDamage`. Do not read `CharacterStats.evasion`. Self-damage / same-cell is Chebyshev 0 (even) — lands. Missing key → no negate. Do not mint `spell-long-hood`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — next-hit consume gated on Chebyshev parity.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-lean-sting`

NAME: Lean Sting  
ROLE: DAMAGE — bonus if leftover AP = 0 **and** leftover MP ≥ 1  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target’s leftover AP **= 0** **and** leftover walk MP **≥ 1** at resolve, deal an extra 8 as a second existing `dealDamage` call (`effectParams: {"leanLeftoverApEq0":true,"leanLeftoverMpMin":1,"leanStingBonus":8}`). Otherwise 10 only. Distinct from Dry Sting (leftover **AP = 0**, no MP gate), Ready Sting (leftover **AP ≥ 1 and MP ≥ 1**), Damp Sting (leftover **MP ≥ 2**), Pair Purse (leftover AP **exactly 2**), Lone Purse (leftover AP **exactly 1**). The decision: dump AP but keep a walk chip — you are the Lean Sting window.  
DURATION: instant  
SCALING: both numbers follow dmg%.  
SYNERGIES: Drain Courage / Quiet Hex to land leftover AP on 0; Dual Keep / Stride Keep keeps leftover MP ≥ 1.  
COUNTERPLAY: Spend the last MP; keep 1 leftover AP; bank with Purse Keep.  
POWER_BUDGET: Cheap 2 / CD 1. 18 only on the two-flag window. Frost-adjacent **if** they sit dry-AP / wet-MP.  
AI_USAGE: `aiHint: "bonus_if_leftover_ap_eq_0_and_leftover_mp_ge_1"`. Lurkers / pawns. Skip if either gate fails and Strike is better.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["pawn"]`, `levelZoneMin: 1`  
EDGE_CASES: After this spell’s cost is **their** leftover, not the caster’s. Missing keys → 10 only.  
IMPLEMENTATION_COMPLEXITY: LOW — two leftover reads + optional second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-parched-step`

NAME: Parched Step  
ROLE: POSITION — caster lands adjacent to an ally with leftover MP = 0  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"parchedStepNeedLeftoverMpEq0":true,"parchedStepAdj":1}`. If the target’s leftover walk MP **= 0**, relocate the **caster** onto a free Chebyshev-1 of the target (`isCellFree`). If no free dest, or leftover MP ≥ 1, fizzle (AP spent, caster stays). Not `isSwap`. Distinct from Home Step (ungated caster → ally), Heave Step (#726, ally must be **force-moved**), Ally Step (they land next to the caster), Cover Step. The decision: park an ally at leftover MP 0, then step to them — or they keep 1 MP and you cannot arrive.  
DURATION: instant relocate  
SCALING: none.  
SYNERGIES: Walk Toll / Must Step dump their MP; Parched Mend after both sit at 0; Lean Lend is leftover-AP, not this gate.  
COUNTERPLAY: Keep 1 leftover MP on the ally; occupy every Chebyshev-1; Root the caster.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is a gated blink-to-ally.  
AI_USAGE: `aiHint: "parched_step_if_ally_leftover_mp_eq_0_and_free_adj"`. Porters / queens. Skip if leftover MP ≥ 1 or no free dest.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Dest hazards must tick (MIMA push/pull × hazards). Do not write `currentView` (facing cards still fail closed). Missing keys → no relocate. Self-target is illegal (need a second body).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy dest pick, not `swapPositions`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-parched-sill`

NAME: Parched Sill  
ROLE: TERRAIN — occupant cannot spend walk MP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: Paint one free cell 2 turns. `effectParams: {"parchedSillForbidWalkMp":true,"parchedSillDuration":2}`. A body that **occupies** the cell cannot spend walk MP (confirm fails, MP not spent). Force-move / swap / blink **onto or off** is still legal. Distinct from Drift Sill (occupant cannot be a **relocate dest**; walk onto is legal), Gait Seal (unit), Root (0 walk on the unit wherever they stand), Quiet Sill / Cast Sill (confirm-gates). The decision: nail the tile they wanted to leave on foot — they can still be shoved.  
DURATION: 2 turns  
SCALING: none.  
SYNERGIES: Shoulder Bash / Court Shove to move them without walk MP; Lean Sting while they sit dry-AP / wet-MP **before** they dump the last MP on a different tile.  
COUNTERPLAY: Do not stand on it; swap off; wait the 2.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Tile-scoped walk lock.  
AI_USAGE: `aiHint: "parched_sill_on_likely_walk_origin"`. Masons / rooks. Skip if the player can walk around for 1 extra MP.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Paint is observation. Later blocked walk is not a second observe. Missing keys → no paint. Controlled-summon walks honor the tile (MIMA occupancy).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — tile flag on walk confirm.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dry-hold`

NAME: Dry Hold  
ROLE: CONTROL — cannot walk until leftover AP = 0  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"dryHoldUntilLeftoverApEq0":true,"dryHoldDuration":2}`. For 2 of the target’s turns, they cannot spend walk MP **until** leftover AP **= 0** on that turn. Dumping AP (cast / Strike / Timestep leftover) unlocks walking that turn. Distinct from Drift Hold (cannot walk until **force-moved**), Boot Hold (cannot walk until **Strike**), Cast Hold (cannot **spell** until walk), Must Lean (cannot **tool** unless leftover MP = 0). The decision: dump AP first, then walk — or camp the leftover AP and stay glued.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Quiet Hex / Hex Toll so dumping AP is expensive; Lean Sting while they sit dry-AP with leftover MP.  
COUNTERPLAY: Dump AP on a cheap Strike, then walk; Cadence Halve is unrelated; wait 2.  
POWER_BUDGET: Standard 3 / CD 2 / 0 damage. Elite because it inverts “walk then tool.”  
AI_USAGE: `aiHint: "dry_hold_if_target_has_leftover_ap_ge_2_and_wants_to_walk"`. Hex / knights. Skip if they already sit at leftover AP 0.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","bishop"]`, `levelZoneMin: 2`  
EDGE_CASES: Force-move still legal. Missing keys → no lock. Duration is **their** turns, not round wrap.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — walk confirm gated on leftover AP.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-lean-lend`

NAME: Lean Lend  
ROLE: SUPPORT — +1 MP to an ally whose leftover AP = 0  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 1  
EFFECT: `effectParams: {"leanLendMp":1,"requireTargetLeftoverApEq0Lend":true}`. If the target’s leftover AP **= 0**, add 1 current walk MP (capped at max). Else fizzle (AP spent, no MP). Distinct from Spent Lend (+1 MP if they **walked**), Drift Lend (+1 **AP** if **force-moved**), Boot Lend (requires **unmoved**), Tempo Gift (ungated AP), Watch Lend (overwatch snap grants the **watcher** +1 AP). The decision: empty your AP purse, then take a gifted step.  
DURATION: instant  
SCALING: +1 fixed.  
SYNERGIES: Dry Hold / Drain Courage land leftover AP on 0; Parched Step after they dump AP but still had leftover MP — Lean Lend is the **AP** gate, not MP.  
COUNTERPLAY: Keep 1 leftover AP; Slow after the gift.  
POWER_BUDGET: Cheap 2 / CD 1 / 0 damage. Conditional +1 MP.  
AI_USAGE: `aiHint: "lean_lend_if_ally_leftover_ap_eq_0"`. Buffers / bishops. Skip if leftover AP ≥ 1.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Self-target legal if the caster’s leftover AP is 0 after this 2-AP spend. Missing keys → no grant. Do not write spell levels.  
IMPLEMENTATION_COMPLEXITY: LOW — leftover-AP read + MP add.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-parched-sip`

NAME: Parched Sip  
ROLE: CONTROL — steal 1 leftover MP iff leftover AP = 0  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: No damage. `effectParams: {"parchedSipMp":1,"requireTargetLeftoverApEq0Sip":true}`. If the target’s leftover AP **= 0** and leftover walk MP **≥ 1**, move 1 leftover MP from them to the caster (this turn, capped at max). Else fizzle (AP spent). Distinct from Gait Sip (steal 1 MP iff they **walked**), Drift Sip (steal leftover **AP** iff **force-moved**), Soul Sip (ungated MP steal), Ap Sip (ungated AP). The decision: dump AP, keep a walk chip — you donate that chip.  
DURATION: this turn  
SCALING: 1 fixed.  
SYNERGIES: Lean Sting on the same window; Dry Hold forces the dump that opens the sip.  
COUNTERPLAY: Keep 1 leftover AP; spend the last MP before the sip.  
POWER_BUDGET: Cheap 2 / CD 1 / 0 damage. Zero-sum 1 MP.  
AI_USAGE: `aiHint: "parched_sip_if_target_leftover_ap_eq_0_and_leftover_mp_ge_1"`. Hex / pawns. Skip if either gate fails.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["pawn","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing keys → no steal. Do not debit `spell.mpCost`. Caster leftover MP this turn only.  
IMPLEMENTATION_COMPLEXITY: LOW — two leftover reads + 1 MP move.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-lean-post`

NAME: Lean Post  
ROLE: SUMMONS — detonates if occupant **ends turn** with leftover AP = 0  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "leanpost"`, `summonLifespan: 3`, empty kit. `effectParams: {"leanPostDetonateDamage":10,"leanPostNeedLeftoverApEq0":true}`. Place on a free cell. If a hostile **ends their turn** occupying this cell **and** leftover AP **= 0**, deal 10 through existing `dealDamage` and the post dies. Walk onto is **safe**. Relocate landing is **safe** (Drift Post owns that hole). End-turn occupy with leftover AP **≥ 1** is **safe** (Dwell Mark owns ungated end-turn occupy). Distinct from Dummy Post (taunt), Ingress Mark (walk **enter**), Drift Post (relocate landing), Dwell Mark (end-turn occupy, **any** leftover). The decision: camp leftover AP on the post and live, or dump AP and eat 10.  
DURATION: lifespan 3 or until detonate  
SCALING: 10 follows dmg%.  
SYNERGIES: Dry Hold / Drain Courage to land leftover AP on 0 **on** the cell; Quiet Sill so they cannot Strike the post off.  
COUNTERPLAY: End turn with 1 leftover AP; walk off before end; Coup the post.  
POWER_BUDGET: Standard 3 / CD 3. Empty kit. Detonate is opt-in by dumping AP.  
AI_USAGE: `aiHint: "lean_post_on_likely_end_tile_if_they_dump_ap"`. Masons / pawns. Skip if they can end with leftover AP ≥ 1 for free.  
DISCOVERY_ELIGIBILITY: true. MULTI (observe+win; no extra feat door). `pieceTypes: ["pawn","rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Summon is observation; later detonate is not a second observe. Counts as **one** toward the summon cap. Never parse `"Lean Post"`. Prefer fizzle-and-detonate if occupancy is illegal at place. Missing keys → do not spawn a Dummy Post.  
IMPLEMENTATION_COMPLEXITY: HIGH — end-of-turn occupy + leftover-AP gate + death. Not a mid-RAF splice.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-parched-bounce`

NAME: Parched Bounce  
ROLE: DAMAGE — bounce 1 to another leftover-MP=0 hostile  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Deal 12 to primary. Bounce 1 to the nearest **other** living hostile with leftover walk MP **= 0** in Chebyshev ≤ 4 (`effectParams: {"parchedBounceNeedLeftoverMpEq0":true,"parchedBounceSearchRadius":4,"parchedBounceCount":1}`). If none, 12 only (still a cast). Distinct from Heave Bounce (#726, **force-moved** hostiles), Chain Lightning (nearest **any**, 2 bounces), Ricochet Mark (tile amp), Split Fang. The decision: two dry-MP bodies, or you paid 3 for a Frost-minus single.  
DURATION: instant  
SCALING: 12 / bounce 8 follow dmg% (bounce payload = 8, not 12).  
SYNERGIES: Walk Toll / Must Step to dry two MP pools; Parched Mend is the heal twin of this window.  
COUNTERPLAY: Keep 1 leftover MP on the second body; spread past 4.  
POWER_BUDGET: Standard 3 / CD 2. Bounce is gated.  
AI_USAGE: `aiHint: "parched_bounce_if_second_leftover_mp_eq_0_in_4"`. Queens / bishops. Skip if no second dry-MP body and Strike/Frost is better.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Bounce that finds no second body **is** observation. Not `isSwap`. Missing keys → 12 only, no bounce.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — search + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-must-lean`

NAME: Must Lean  
ROLE: CONTROL — remaining non-Strike spells illegal unless leftover MP = 0  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"mustNonStrikeUntilLeftoverMpEq0":true}`. For the rest of **this** turn (the target’s current turn if it is theirs; otherwise their **next** turn — not a queue splice), they cannot confirm a **non-Strike** spell unless leftover walk MP **= 0**. Strike stays legal. Distinct from Cast Hold (#590, **all** spells illegal until they **walk**), Tool Hold (#695, non-physical illegal until **Strike**), Quiet Sill (tile confirm-gate), Must Drift (remaining **walks** follow a dir). The decision: camp or dump the walk pool before the next tool, or live on Strike.  
DURATION: remainder of that one turn  
SCALING: none.  
SYNERGIES: Lean Hold on the same body (Strike also locked until leftover MP = 0 → full lock unless they dump/camp); Lean Sting while they sit dry-AP / wet-MP.  
COUNTERPLAY: Dump leftover MP; Strike; wait the turn.  
POWER_BUDGET: Standard 3 / CD 2 / 0 damage. Elite because it inverts Cast Hold.  
AI_USAGE: `aiHint: "must_lean_if_target_has_leftover_mp_ge_1_and_a_tool"`. Knights / pawns. Skip if leftover MP is already 0.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 2`  
EDGE_CASES: Applies to the **target’s** remaining actions, not a mid-RAF splice of a different actor. Missing key → no lock. `physical_attack` is the only Strike id (`isPhysical: true` on that row — never name).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — confirm gate on leftover MP + `isPhysical`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-verse-lean`

NAME: Verse Lean  
ROLE: CONTROL — last id illegal until leftover MP = 0  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"verseLeanUntilLeftoverMpEq0":true}`. The target’s **last resolved spell id** becomes illegal until leftover walk MP **= 0**. Dumping or camping the walk pool clears the pin. Distinct from Verse Pace (#726, last id illegal until they **walk**), Last Mute (illegal for **duration**), Verse Tax (legal, **+1 AP**), Verse First (must cast that id first), Cast Hold (all spells until walk). The decision: recast Frost only after you empty the walk pool — or take a different id.  
DURATION: until leftover MP hits 0 or battle end  
SCALING: none.  
SYNERGIES: Must Lean already bans tools unless leftover MP = 0 — Verse Lean then pins the **last** id even after they dump if they dump **after** recasting; order matters.  
COUNTERPLAY: Walk leftover to 0; recast a different id; wait.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. One-id pin with an MP key.  
AI_USAGE: `aiHint: "verse_lean_if_target_last_id_is_their_best_tool"`. Hex / bishops. Skip if no last id.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: No last id → fizzle (AP spent, observe). Missing key → no pin. Do not name-check `"Frost"`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — last-id pin + leftover-MP clear.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-lean-hold`

NAME: Lean Hold  
ROLE: CONTROL — cannot Strike until leftover MP = 0  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"leanHoldStrikeUntilLeftoverMpEq0":true}`. For 2 of the target’s turns, they cannot confirm `physical_attack` / `isPhysical: true` until leftover walk MP **= 0**. Tools stay legal. Distinct from Strike Hold (#533, cannot Strike until they **walk**), Rite First (#679, cannot Strike until a **spell**), Tool Hold (#695, cannot tool until Strike), Oath Blade (mute Strike until a different oath). The decision: empty the walk pool to punch, or live on tools.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Must Lean (tools also need leftover MP = 0 → they must camp/dump to do **anything** but wait); Odd Hood blanks Chebyshev-1 if they dump then Strike from 1.  
COUNTERPLAY: Dump leftover MP; tool-cast; wait 2.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Inverse of Strike Hold.  
AI_USAGE: `aiHint: "lean_hold_if_target_wants_strike_with_leftover_mp_ge_1"`. Knights / pawns. Skip if leftover MP is already 0.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 1`  
EDGE_CASES: Gate on `isPhysical === true`, never `spell.name === "Strike"`. Missing key → no lock.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — Strike confirm gated on leftover MP.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-imprint`

NAME: Court Imprint  
ROLE: SUPPORT — mass Cadence Imprint (signature)  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: all  
LOS: false  
COOLDOWN: 5  
EFFECT: `effectParams: {"imprintMatchingCds":true,"courtImprintExcludeCaster":true}`. For **every other** living body, copy remaining CDs onto the caster for matching ids (same rule as Cadence Imprint). Targets keep their locks. Caster is excluded as a source (do not copy from self). Distinct from Court Dual (mass Dual Keep), Court Keep (mass leftover-MP bank), Adj Fold (#747, swap two adjacent player-side bodies), Sovereign Fold. Player never owns this. Witness-only kits so the board can *see* a mass shared-downtime.  
DURATION: instant  
SCALING: none.  
SYNERGIES: Kit with Cadence Imprint so the player already knows the copy rule before the signature.  
COUNTERPLAY: Do not share ids with the court caster; recast locks before the 6-AP.  
POWER_BUDGET: Signature 6 / CD 5. Never player-learnable.  
AI_USAGE: `aiHint: "court_imprint_if_two_plus_bodies_share_a_remaining_cd_ge_2"`. Boss / CHAMPION kit only. Skip if no shared remaining ≥ 2.  
DISCOVERY_ELIGIBILITY: false for persist. Kit-only door `court_imprint_regent`. Optional dim `UNKNOWN TECHNIQUE` log.  
EDGE_CASES: Never written to `ownedSpellIds`. Missing keys → no rewrite. Not a mid-RAF splice.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — Cadence Imprint mapped across living bodies.  
STATUS: PROPOSED

---

## 6. Combination matrix (intended, not name-wired)

Resolve only via flags / leftover integers / tile maps / effect keys.

| Setup (metadata) | Payoff (metadata) | Decision |
| :--- | :--- | :--- |
| leftover MP = 0 on two bodies | `parchedMendAmount` | Camp/dump together, then 8 |
| leftover AP = 0 + leftover MP ≥ 1 | `leanStingBonus` | Empty the purse, keep a step — take 18 |
| leftover AP = 0 on target | `parchedSipMp` / `leanLendMp` | Same window: steal or gift the last chip |
| leftover MP = 0 on ally | `parchedStepAdj` | Arrive only after they empty the walk pool |
| `parchedSillForbidWalkMp` | force-move still legal | Nail the tile; shove is the answer |
| leftover AP ≥ 1 | `dryHoldUntilLeftoverApEq0` | Dump AP before the walk |
| leftover MP ≥ 1 | `mustNonStrikeUntilLeftoverMpEq0` | Camp/dump before the tool — inverse of Cast Hold |
| leftover MP ≥ 1 | `leanHoldStrikeUntilLeftoverMpEq0` | Camp/dump before Strike — inverse of Strike Hold |
| last id pin | `verseLeanUntilLeftoverMpEq0` | Recast only after the walk pool is empty |
| matching remaining CDs | `imprintMatchingCds` | Share downtime, or recast first |
| 2×3 free cells | `sixSpanCells: 6` | Seal a closet for six cap |
| end-turn occupy + leftover AP = 0 | `leanPostDetonateDamage` | Camp 1 AP on the post, or dump and eat 10 |
| two leftover-MP=0 hostiles | `parchedBounceCount` | Splatter, or keep 1 MP on the second body |
| odd Chebyshev next hit | `oddHoodNextHit` | Stand at 2; do not poke from 1 or 3 |
| mass matching CDs | `courtImprintExcludeCaster` | Witness-only scramble |

Map modifiers stay metadata-only. Frozen/Slime × **walk** MP does not invent `spell.mpCost`. Arcane Surge × Lean Sting is `applyApCost` then the leftover-AP read.

Mechanic Interaction Matrix still OPEN (do not “fix” in this spec, but do not ship new movement that repeats the gap):

- Swap × hazards (MIMA-2026-08-31-001) — Parched Step dest **must** tick dest hazards.
- Push/pull × hazards (MIMA-2026-08-31-005) — unused by this pass’s relocate except dest tick on Parched Step.
- Controlled-summon walk × occupancy (MIMA-2026-08-31-002) — Parched Sill / Dry Hold / Six Span must apply to summon-control walks.

---

## 7. Recommended unlock order (pacing)

Discovery designer should treat these as **bands**, not a shop list. Wave-12 unique ids stamp `generationMin: 12` when SDE Wave 12 consumes this catalog as CORE.

| Band | Spells | Why |
| :--- | :--- | :--- |
| Mid (zone 1, G≥12 extra) | Lean Sting, Parched Sip, Lean Lend, Lean Hold, Verse Lean | Leftover-AP=0 / leftover-MP=0 as a **pair** of currencies |
| Late (elites / zone 2) | Odd Hood, Dry Hold, Must Lean, Parched Step, Parched Sill | Inverse holds vs Cast/Strike Hold; odd-range hood |
| Feat / multi | Parched Mend, Cadence Imprint, Six Span, Lean Post | Heal twin of Dry Mend; CD copy; 6-cell; end-turn dry-AP post |
| Witness only | Court Imprint | Mass shared downtime stays identity |

**Still required for any of this to matter:** Discovery’s innate-four split. This pass does not edit `spellData.ts`.

---

## 8. Implementation notes (for a later, explicit implementation PR)

1. **MP debit:** `executeCastAttempt` (`WorldExploration.tsx` 17096–17207) still gates AP only. This pass adds **zero** `mpCost > 0` rows. Leftover **walk** MP is not `spell.mpCost`.  
2. **Leftover integers:** persist leftover AP / leftover MP on the combatant for the rest of **that** turn. Dual Keep / Stride Keep / Purse Keep pay at **next turn start** — after that pay, leftover is the new current.  
3. **Cadence Imprint:** intersect cooldown maps **by spell id**. Never copy an id the caster does not own. Target keeps remaining.  
4. **Six Span ≠ `portals`.** Multi-cell occupy with `summonAI: "sixspan"`. Do not ship against `ENEMY_SUMMON_CAP === 2` without occupy-weight.  
5. **Parched Step ≠ `isSwap`.** Occupancy dest pick. Dest hazards tick.  
6. **Odd Hood** consumes in the incoming-hit pipeline **before** `dealDamage`. Do not add a percent miss inside combat math. Do not read `CharacterStats.evasion`.  
7. **Lean Post** end-of-turn occupy is **not** a mid-RAF splice. Same clock as Dwell Mark / Dual Keep snapshot.  
8. **Must Lean / Lean Hold** gate on `isPhysical`, never `spell.name`.  
9. **`summonAI: "sixspan"` / `"leanpost"`** — no name parse.  
10. Recap grant uses the reward funnel + `commitSpellDiscoveries` / `unlockOwnedSpell`, not `updateCharacter`.  
11. Do not touch RAF, map generation, turn order, or damage math.  
12. Add ids to `SPELL_ID_CATALOG` **only when implemented**, together with `spellData.ts` and kits.  
13. Do **not** append these ids to `starterSpells` as `isBaseSpell`.  
14. Parched Mend / Lean Post player-side HP actually increased → `challengeHealUsedRef` only then.  
15. Hex Toll remains a Quiet Hex near-clone. **Do not** attach it in SDE pools.

---

## 9. Explicit non-goals this pass

- No production TypeScript / Motoko / Candid edits.  
- No new damage formula, crit, or RES/SR identity.  
- No shop-bought spells.  
- No fourth RES% buff.  
- No second Chain Lightning, second absorb, second self-cleanse, second **self** range-buff.  
- No fourth `mpCost > 0` walk snipe (Ley Toll / Undertow / Sanguine Toll remain the only paper spenders).  
- No player-owned silence (Hex of Silence stays BOSS_ONLY).  
- No mid-RAF splice of the current actor.  
- No new facing card.  
- No player-owned About Hinge (stays `BOSS_ONLY` on #590). Hostile 180° pair-hinge is Pawn Trade — not re-proposed.  
- No restamp of any feat or `easy_*` / `hard_*` / `legendary_*` challenge door (including SDE Wave 7’s `hard_1` / `legendary_1` and #590’s `leader_slayer` / `spell_master` MULTI children). Do not stamp leftover `survivor`.  
- No restamp of Wave-5…12 boss extra doors (`ram_castellan` … `rebound_almoner`).  
- No restamp of Wave-6…11 tactical extra doors (`oath_censor` … `court_dual_regent`).  
- No restamp of Wave-8 / Wave-9 / Wave-10 / Wave-11 SDE extras (`about_hinge_regent`, `odd_gallery`, `pair_gallery`, `knight_fold_regent`, `inch_gallery`, `close_precentor`, `mid_fold_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, …).  
- No restamp of any live 19 first-win.  
- No wiring of `CharacterStats.evasion` as a percent.  
- No clone of Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Veil, Mirror / Reflect.  
- No 12-AP Void Collapse clone.  
- No third File Lance / Blood Tithe.  
- No SDE Wave-9 ids (`spell-pair-stride`, `spell-clash-mend`, `spell-cadence-shave`, `spell-pack-stride`, `spell-knight-fold`, …).  
- No SDE Wave-10 ids (`spell-inch-stride`, `spell-rite-first`, `spell-ingress-mark`, `spell-bar-mend`, `spell-cadence-pin`, `spell-off-plate`, `spell-mid-fold`, …).  
- No SDE Wave-11 ids (`spell-diag-stride`, `spell-dry-mend`, `spell-still-mend`, `spell-cadence-rest`, `spell-dwell-mark`, `spell-adj-fold`, …). Do **not** mint `spell-both-dry` (Dry Mend), `spell-hex-span` (Six Span), `spell-cadence-copy` (Cadence Imprint), or `spell-long-hood` (Odd Hood). If a later SDE Wave-12 catalog claims one of this catalog’s tactical ids, **SDE wins**.  
- No eight-cell occupy (skipped; Wave 13).  
- No clone of #726 (`spell-heave-mend` … `spell-court-dual`).

---

## 10. Proposal index

| ID | Acquisition | Complexity | Primary hole filled |
| :--- | :--- | :--- | :--- |
| `spell-parched-mend` | MULTI_SOURCE | LOW | Heal if caster **and** target have leftover MP = 0 |
| `spell-cadence-imprint` | MULTI_SOURCE | MEDIUM | Copy matching remaining CDs onto the caster; target keeps |
| `spell-six-span` | MULTI_SOURCE | HIGH | Six-cell 2×3 occupy (cap-blocked while summon cap is 2) |
| `spell-odd-hood` | ELITE | MEDIUM | Next hit from **odd** Chebyshev is 0 |
| `spell-lean-sting` | ENEMY_DISCOVERY | LOW | Bonus if leftover AP = 0 **and** leftover MP ≥ 1 |
| `spell-parched-step` | ENEMY_DISCOVERY | MEDIUM | Caster lands adjacent to a leftover-MP=0 ally |
| `spell-parched-sill` | ENEMY_DISCOVERY | MEDIUM | Occupant cannot spend walk MP |
| `spell-dry-hold` | ELITE | MEDIUM | Cannot walk until leftover AP = 0 |
| `spell-lean-lend` | ENEMY_DISCOVERY | LOW | +1 MP to an ally whose leftover AP = 0 |
| `spell-parched-sip` | ENEMY_DISCOVERY | LOW | Steal 1 leftover MP iff leftover AP = 0 |
| `spell-lean-post` | MULTI_SOURCE | HIGH | Summon detonates on end-turn occupy if leftover AP = 0 |
| `spell-parched-bounce` | ENEMY_DISCOVERY | MEDIUM | Bounce 1 to another leftover-MP=0 hostile |
| `spell-must-lean` | ELITE | MEDIUM | Non-Strike spells illegal unless leftover MP = 0 |
| `spell-verse-lean` | ENEMY_DISCOVERY | MEDIUM | Last id illegal until leftover MP = 0 |
| `spell-lean-hold` | ENEMY_DISCOVERY | MEDIUM | Strike illegal until leftover MP = 0 |
| `spell-court-imprint` | NOT_PLAYER_LEARNABLE | MEDIUM | Mass Cadence Imprint |

All STATUS: **PROPOSED**.

**Held, not filled:** mid-RAF splice; fourth `mpCost > 0` walk snipe; sixth echo id; player-owned Hex of Silence; player-owned About Hinge; eight-cell occupy; heal-if-**both leftover AP and leftover MP = 0**; swap remaining CDs caster ↔ target.

**Stamp, do not clone:** #747 Dry Mend owns both-leftover-AP heal.

---

## 11. Source map (read-back)

| Topic | File | Lines |
| :--- | :--- | :--- |
| Live 32-id catalog | `src/frontend/src/data/spellData.ts` | 9–691 |
| Forced `isBaseSpell` | `src/frontend/src/components/WorldExploration.tsx` | 2395–2408 |
| Owned union | `src/frontend/src/components/WorldExploration.tsx` | 2410–2440 |
| Name/id heuristic filter | `src/frontend/src/components/WorldExploration.tsx` | 2356–2389 |
| Backend library filter | `src/frontend/src/utils/adminSafety.ts` | 712–718 |
| `SPELL_ID_CATALOG` | `src/frontend/src/data/bossKits.ts` | 29–62 |
| `SpellConfig` / `areaShape` / `evasion` | `src/frontend/src/types/gameTypes.ts` | 64, 160–241 |
| `Enemy.currentView` | `src/frontend/src/types/gameTypes.ts` | 297 |
| Line targeting (unused by data) | `src/frontend/src/engine/targeting.ts` | 576–617 |
| Area = Chebyshev, no `areaShape` | `src/frontend/src/engine/targeting.ts` | 690–727 |
| Caster-tile rule | `src/frontend/src/engine/targeting.ts` | 184–189 |
| `hitTiles` AoE | `src/frontend/src/engine/castHelpers.ts` | 105–117 |
| Trap stub = barrier | `src/frontend/src/engine/spellEngine.ts` | 442–445 |
| `isSwap` flag | `src/frontend/src/engine/spellEngine.ts` | 637 |
| `isSwap` → `swapPositions` | `src/frontend/src/engine/spellEngine.ts` | 767–768 |
| `swapPositions` copies coords | `src/frontend/src/components/WorldExploration.tsx` | 9389–9401 |
| Push / attract unused by casts | `src/frontend/src/engine/occupancy.ts` | 482–537 |
| Portals impassable | `src/frontend/src/engine/occupancy.ts` | 13–14, 40 |
| AP-only cast debit | `src/frontend/src/components/WorldExploration.tsx` | 17096–17207 |
| MP display only | `src/frontend/src/components/SpellbookModal.tsx` | 966–977 |
| Enemy kits (owned ids) | `src/frontend/src/engine/enemyAI.ts` | 163–185 |
| `buildEnemyKit` zone NaN | `src/frontend/src/components/WorldExploration.tsx` | 11920; zone object 4683–4687; floor at `enemyAI.ts` 194–199 |
| `inferArchetype` healAmount | `src/frontend/src/engine/enemyAI.ts` | 447–452 |
| Summon name fallback | `src/frontend/src/engine/enemyAI.ts` | 217–224 |
| `ENEMY_SUMMON_CAP` | `src/frontend/src/data/gameConstants.ts` | 300 |
| Cooldown helper | `src/frontend/src/utils/challengeCompletion.ts` | 365–368 |
| Backend six | `src/backend/lib/admin.mo` | 168–191 |
| Feats | `src/backend/lib/admin.mo` | 309–326 |
| Challenges | `src/frontend/src/utils/challengeCompletion.ts` | 44–109 |
| Character spell-level arrays | `src/backend/main.mo` | 132–142 |
| Boss ids | `src/frontend/src/types/bossTypes.ts` | 390–410 |
| Overworld wander `currentView` writer | `src/frontend/src/components/WorldExploration.tsx` | 6924–6938 |
| WX line count | `src/frontend/src/components/WorldExploration.tsx` | 19213 |

**Document status:** PROPOSED. Safe to review and implement in a later, explicit data PR. Not a license to land combat code in the same change as this spec.

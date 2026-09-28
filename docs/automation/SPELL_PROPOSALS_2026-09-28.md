# Spell and Tactical Mechanics — Design Pass 2026-09-28

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1 law [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) through still-open Wave 10 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-27.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-a53c/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-27.md) (#679)
- Spell, Discovery & Achievement Admin — still-open #630 / #677
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) … still-open Wave 10 [`SPELL_PROPOSALS_2026-09-27.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-6c84/docs/automation/SPELL_PROPOSALS_2026-09-27.md) (#695)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); extra doors through #367 / #406 / #474 / #518 / #572 / #638 / #663; tactical extras #463 / #525 / #563 / #636 / #695

This is **Wave 11**. Wave 10 (#695) filled both-walk heal, leftover-MP bank, five-cell occupy, remaining-CD −1, near-range miss, walk-gated MP steal, non-physical tile lock, force-landing sting, Chebyshev-1 walk lock, ally-to-caster step, leftover-MP poke, pair translate, last-id AP tax, cannot-tool-until-Strike, walked-ally MP lend, and a mass leftover-MP bank signature.

**Wave 10 explicitly deferred eight holes.** Same-day Discovery Wave 10 (#679) claimed **none** of those eight as unique SDE ids (it authored a parallel G≥10 catalog). This pass fills three leftovers and leaves the rest held:

| Wave-10 leftover | Owner after #679 | This pass |
| :--- | :--- | :--- |
| Heal if **both force-moved** | Still open | **This pass:** Heave Mend (`forcedMovedThisTurn` on **caster and target**) |
| Bank leftover **AP and MP** on one id | Still open | **This pass:** Dual Keep (AP cap 2 **and** MP cap 2, once/battle, next-turn start — **not** a queue splice) |
| Seven-cell occupy | Still open | **This pass:** Sept Span (stretched plus: 5-file + 2 ortho at center, counts as **seven**) |
| Mid-RAF splice | Held (AGENTS.md) | Still held |
| Fourth `mpCost > 0` walk snipe | Held (Ley Toll / Undertow / Sanguine Toll) | Still held |
| Sixth echo id | Held | Still held |
| Player-owned Hex of Silence | Held (`BOSS_ONLY`) | Still held |
| Player-owned About Hinge | Held (`BOSS_ONLY` on #590) | Still held. Hostile 180° around a pair midpoint is still Pawn Trade. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after the reserved set **and** after #679 / #695. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

Same-day Discovery Wave 11 had **not** opened at authoring (`created:>=2026-09-28` search returned 0 PRs). If a later SDE Wave-11 catalog claims a unique §11 id that matches one below, **SDE wins**; rename is not this pass’s job. Do **not** clone #679 unique ids. Stamp family / observe metadata onto Wave-11 **tactical** ids only.

Do **not** mint `spell-both-heave` (Heave Mend owns both-force heal), `spell-hept-span` (Sept Span owns seven-cell), or `spell-vault-keep` (Dual Keep owns the combined bank).

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is unchanged since 2026-08-31. Discovery is still inert. WX is **19,213** lines (`wc -l`). Same HEAD as Waves 4–10.

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

Live `ENEMY_SUMMON_CAP` is still **2** (`gameConstants.ts` 300). Quad Span (#636) counts as four and Penta Span (#695) counts as five on paper; both are implementation-blocked until that cap (or a dedicated occupy-weight) exists. Sept Span is the same class: **propose the hole, do not pretend it can ship against cap 2**.

### 1.2 Backend admin seed — `src/backend/lib/admin.mo` `defaultSpells()`

Six ids, still **not** in `SPELL_ID_CATALOG`. They carry targeting flags. All six still have `mpCost = 0`.

| ID | Name | AP | CD | Flags | Notes |
| :--- | :--- | ---: | :--- | :--- | :--- |
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
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** | Unused | Shoulder Bash, Hook Line, Heave Step (this pass **relocates the caster** onto a free Chebyshev-1 of a force-moved ally — occupancy dest, not `isSwap`) |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768 → WX `swapPositions` 9389–9401) | Swap | Pawn Trade / Ward Interpose / Heave Bounce is **not** `isSwap` |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, never this set |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire |
| Walk / leftover / force flags | Paper `walkMpSpentThisTurn` (Waves 6–10). Paper `forcedMovedThisTurn` (Wave 9). Leftover AP/MP die at turn end | Haste grants **now**; Timestep is full **now** | **This pass: Heave Mend / Dual Keep / Ready Sting / Drift* / Must Drift / Court Dual** |
| Seven-cell occupy | Twin = 2; Triple = 3; Quad = 4; Penta = 5 | Absent | **This pass: Sept Span** (stretched plus = 7) |
| Remaining-CD ÷2 | Stretch is **×2** remaining; Trim is **−1**; Crack zeroes the **highest one**; Pin **freezes one** | Inferno CD 3 is the only live lock | **This pass: Cadence Halve (`floor(remaining/2)`, zeros stay 0)** |
| Exact-2 miss | Near Hood is next hit from Chebyshev **≤ 1** → 0; Far Hood is **≥ 3** | Unused live | **This pass: Mid Hood (exactly 2)** |

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

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` (tactical W2 **and** Discovery W2); `spell-blood-tithe` (tactical W2 pet sacrifice **versus** Discovery W2 HP→AP). Wave 11 does not add a third.

**Do not alias** Heave Mend ↔ Both Mend / Shove Mend / Gait Mend / Chase Mend / Clash Mend / Bar Mend / Enter Mend / Split Mend / Blood Mend; Dual Keep ↔ Purse Keep / Stride Keep / Court Keep / Keep Kennel / Spent Stride / Pack Stride / Second Wind / Haste / Timestep; Sept Span ↔ Twin Span / Triple Span / Quad Span / Penta Span / Span Guard / Span Pylon / Void Span; Cadence Halve ↔ Cadence Trim / Shave / Stall / Flush / Stretch / Crack / Break / Theft / Lend / Brand / Pin; Mid Hood ↔ Near Hood / Far Hood / Fog Hood / Tick Hood / Mid Fold / Off Plate / Sidestep Ward; Ready Sting ↔ Dry Sting / Damp Sting / Full Purse / Lone Purse / Post Sting / Boot Sting / Shove Sting; Heave Step ↔ Home Step / Ally Step / Hinge Step / Cover Step / Ghost Step / Soft Step / Bias Step; Drift Sill ↔ Quiet Sill / Cast Sill / Gift Sill / Pet Sill / Kennel Sill / Body Sill / Claim Ward / Nail Down; Drift Hold ↔ Tool Hold / Boot Hold / Cast Hold / Strike Hold / Hold Ground; Drift Lend ↔ Spent Lend / Boot Lend / Leftover Lend / Cadence Lend / Tempo Gift; Drift Sip ↔ Gait Sip / Soul Sip / Ap Sip / Drain Courage; Drift Post ↔ Dummy Post / Bait Pylon / Spark Whelp / Ingress Mark; Heave Bounce ↔ Chain Lightning / Ricochet Mark / Split Fang; Must Drift ↔ Must Step / Must Span / Must Pace / Rank Lock / Inch Stride; Verse Pace ↔ Verse Tax / Verse First / Last Mute / Once Verse / Stolen Verse / After Verse / Cast Hold; Court Dual ↔ Court Keep / Court Stretch / Court Hinge / Court Shove / Court Fold.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved, live, or still held) |
| :--- | :--- | :--- |
| SUPPORT both-force heal | Heal iff **caster and target** both have `forcedMovedThisTurn` | Both Mend is **both walked**. Shove Mend is **target** force-moved only. Gait / Chase are walk. Clash is **Struck**. Bar Mend is target resolved a **spell**. |
| SUPPORT dual bank | Carry leftover **AP (cap 2) and MP (cap 2)** to **next turn start**, once/battle | Purse Keep is **AP only**. Stride Keep is **MP only**. Haste / Second Wind **grant now**. Timestep is full **now**. Pack Stride **siphons** leftover walk MP (`ENEMY_ONLY`). Pack Tithe siphons leftover **AP**. |
| SUMMONS seven-cell | Stretched plus (5-file + 2 ortho at center), counts as **seven** | Twin = 2. Triple = 3. Quad = 2×2 = 4. Penta = plus = 5. Span Guard / Pylon are rigid 2-cell. |
| CONTROL CD halve | **floor(remaining/2)** each remaining CD on one **hostile**; zeros stay 0 | Stretch is **×2**. Trim is **−1**. Shave is **ally** −1. Stall is **+1** all. Crack zeroes the **highest one**. Pin **freezes one**. |
| DEFENSE mid hood | Next applied hit from Chebyshev **exactly 2** → 0 | Near Hood is **≤ 1**. Far Hood is **≥ 3**. Sidestep is the **next** hit at any range. |
| DAMAGE ready sting | Bonus iff leftover **AP ≥ 1 and leftover MP ≥ 1** | Dry is leftover **AP = 0**. Damp is leftover **MP ≥ 2**. Full Purse is leftover **AP ≥ 3**. Lone Purse is leftover AP **exactly 1**. |
| POSITION heave step | Caster lands on a free Chebyshev-1 of a **force-moved** ally | Home Step is caster → ally with **no** force gate. Ally Step is **they** land next to the caster. |
| TERRAIN drift sill | Occupant cannot be a **relocate dest**; walk onto is legal | Claim Ward cannot be swapped **onto**. Grounded Lock is **unit** no-swap. Nail Down. Quiet/Cast Sill are confirm-gates. |
| CONTROL drift hold | Cannot spend walk MP until they are **force-moved** | Boot Hold: cannot **walk** until Strike. Strike Hold: cannot Strike until **walk**. Cast Hold: cannot **spell** until walk. |
| SUPPORT drift lend | +1 current AP to an ally who **was force-moved** | Spent Lend is +1 **MP** if they **walked**. Boot Lend requires **unmoved**. Tempo Gift is ungated AP. |
| CONTROL drift sip | Steal 1 leftover AP **iff they were force-moved** | Ap Sip is ungated. Gait Sip is **MP** iff they **walked**. Drain Courage is immediate −1 AP + drain. |
| SUMMONS drift post | Empty-kit body; **relocate landing** on its cell deals 10 and it dies; **walk onto is safe** | Dummy Post is taunt. Bait Pylon is eat. Ingress Mark detonates on **walk enter**. Shove Sting is paint. |
| DAMAGE heave bounce | 12 to primary; bounce 1 to nearest **other** force-moved hostile | Chain Lightning bounces to nearest **any**. Ricochet Mark is tile amp. Split Fang is a different split. |
| CONTROL must-drift | Remaining walks must follow `lastForcedMoveDir` | Must Step is Chebyshev **exactly 1** any dir. Rank Lock is rank XOR file of caster→target. Inch Stride is **one** next walk ≤ 1. |
| CONTROL verse pace | Last resolved id is **illegal until they walk** | Last Mute makes that id illegal for **duration**. Verse Tax is legal but **+1 AP**. Verse First **requires** that id first. Cast Hold bans **all** spells until walk. |
| SUPPORT mass dual bank | Signature: Dual Keep on **every other** body | Court Keep is mass leftover-**MP** only. Player never owns this. |
| RESOURCE fourth MP snipe | — | **Held forever** with Ley Toll / Undertow / Sanguine Toll |
| Sixth echo | — | Held for Discovery |
| Full-bar silence | — | Hex of Silence stays `BOSS_ONLY` |
| Mid-RAF splice | — | Held (AGENTS.md) |
| Six-cell occupy | — | **Skipped** (2/3/4/5/7 exist on paper). Wave 12. |

**Still open after this wave (do not fill today):** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; a sixth echo id; player-owned Hex of Silence; player-owned About Hinge (stays `BOSS_ONLY`); six-cell occupy; heal-if-**both leftover AP = 0**; copy remaining CDs from target onto the caster. Those stay Wave 12 / Discovery so this pass stays discrete.

---

## 3. Contract with Dynamic Spell Discovery

Coordinate with Discovery (`c26e5a83-…`) and Admin (`4efa22ec-…`). This pass only stamps acquisition so those layers can filter **by field**. Same-day Discovery Wave 11 had not opened at authoring — **do not mint or clone #679 unique §11 ids**. If SDE Wave 11 later claims one of this catalog’s ids, **SDE wins**.

### 3.1 Discovery is still inert (reconfirmed @ `0f5363f`)

1. All 32 frontend spells are forced `isBaseSpell` (`WorldExploration.tsx` 2395–2408).
2. Recap grants XP/Doka/feats only.
3. Achievements (`defaultAchievements`, `admin.mo` 309–326) grant Doka only.
4. Challenges (`DEFAULT_CHALLENGES` 44–109) grant Doka/XP/badge only.
5. `upgradeSpell` levels a known id; it does not unlock ids.
6. `ENEMY_KITS` (`enemyAI.ts` 163–185) still reuse always-owned ids. Seeing a bishop cast Frost teaches nothing.
7. `buildEnemyKit` still takes `currentMap.levelZone` (`WorldExploration.tsx` 11920). Non-number → `NaN` → every kit stays zone 0.
8. `executeCastAttempt` still does not debit `spell.mpCost`. This pass adds **zero** `mpCost > 0` rows, so it does not widen that bug.
9. No `ownedSpellIds` / `observedSpellIds` persist maps. Character still has `spellLevelKeys` / `spellBarOrder` (`main.mo` 132–142).

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 11 ids to `starterSpells` as base. Do **not** land Wave-11 data before Wave-1 ownership split (`SDE-2026-08-31-001`) through Wave-10 (#695 / #679) data.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "septspan"` and `"driftpost"` are **string enums on the config**.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Heave Mend / Dual Keep / Mid Hood / Ready Sting / Drift Hold / Drift Lend / Drift Sip / Must Drift / Verse Pace **arming** (AP spent) **is** observation, including a blocked / unmoved / no-last-id fizzle after AP. Later consume / convert / peel is **not** a second observe.
- Drift Sill **paint** is observation. Later blocked relocate is not a second observe.
- Heave Step / Cadence Halve / Heave Bounce **cast** (AP spent) **is** observation, including a bounce that finds no second body.
- Sept Span / Drift Post **summon** is observation. Later occupy / detonate / death is not a second observe.
- Court Dual **arm** is observation for witness-only kits. Never written to owned ids.
- Do not require “see it N times” except where a boss adaptation already does. Wave 11 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.
- Do not stamp `survivor` (Last Ember / Last Ward). #646 / #679 left that feat leftover on purpose.

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

**Every live feat and every live challenge id is already a sole spell door or a MULTI child.** Wave 11 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 11 does **not** invent a 16th feat. #590 already stamped leftover `leader_slayer` / `spell_master` MULTI children (Crown Cut / Full Bar). SDE Wave 7 already claimed leftover `hard_1` / `legendary_1` MULTI children (Thin Ward / Clean Blood).

**Live 19 first-wins are all taken (do not restamp as the only door):**  
`starborn_queen` (Cut In), `pale_archivist` (After Verse), `starved_vampire_pawn` (Sanguine Toll), `lord_of_static` (Draw Together), `final_pawn` (Eclipse Fold), `mirror_sovereign` (Echo Cast), `crimson_countess` (Crimson Pact), `void_grandmaster` (Twin Gate), `midnight_bishop` (Life Tether), `chessboard_lich` (Claim Ward), `twin_monarchs` (Choir Hymn), `alabaster_fortress` (Pain Link / Aftershock), `bone_cavalier` (Vault / Caltrop), `pale_archbishop` (Reliquary / Glyph Snare extras), `fetid_rook` (Rot Brand), `broodmother_rook` (Brood Ward), `weeping_pawn` (Mute Thread, #411), `eternal_pawn_king` (Queue Cut, #411), `enthroned_void` (File Vault MULTI child, #411). `second_lament` remains kit-only False Cut.

**Wave-5 boss extra doors (#367) — do not restamp:** `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`.

**Wave-6 boss extra doors (#406) — do not restamp:** `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`.

**Wave-6 tactical extra doors (#463) — do not restamp:** `oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`.

**Wave-7 boss extra doors (#474) — do not restamp:** `mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`.

**Wave-8 boss extra doors (#518) — do not restamp:** `gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`.

**Wave-7 tactical extra doors (#525) — do not restamp:** `pace_prelate`, `span_triune`, `wick_mason`, `slip_castellan`, `court_usher`.

**Wave-8 tactical extra doors (#563) — do not restamp:** `gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`.

**Wave-8 SDE extra / specials (#590) — do not restamp:** `about_hinge_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`.

**Wave-9 boss extra doors (#572) — do not restamp:** `toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`.

**Wave-9 tactical extra doors (#636) — do not restamp:** `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`.

**Wave-9 SDE extras (#646) — do not restamp:** `pair_gallery`, `knight_fold_regent`. `pair_gallery` is **not** `pair_usher`.

**Wave-10 boss extra doors (#638) — do not restamp:** `crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`.

**Wave-11 boss extra doors (#663) — do not restamp:** `sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`. Those sheets extra-door **#563** ids only. Do **not** extra-door Wave-11 tactical ids from those sheets.

**Wave-10 SDE extras (#679) — do not restamp:** `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`.

**Wave-10 tactical extra doors (#695) — do not restamp:** `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`.

**New proposed extra doors for the boss designer (Wave 12 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `heave_cantor` first-win | Heave Mend MULTI child (observe+win still grants). `both_cantor` stays Both Mend. `shove_cantor` stays Shove Mend. |
| `dual_bursar` first-win | Dual Keep MULTI child. `keep_bursar` stays Purse Keep. `stride_bursar` stays Stride Keep. |
| `span_sept` first-win | Sept Span MULTI child. `span_penta` stays Penta Span. `span_quad` stays Quad Span. `span_triune` stays Triple Span. |
| `halve_precentor` first-win | Cadence Halve MULTI child. `trim_precentor` stays Trim. `stretch_precentor` stays Stretch. |
| `court_dual_regent` kit only | Court Dual (`NOT_PLAYER_LEARNABLE`) |

Piece-type observe paths (not feat doors): porters / cantors for Heave Mend; scribes / tempo for Dual Keep; masons / rooks ELITE for Sept Span; scribes / tempo for Cadence Halve; lurkers / knights for Mid Hood; lurkers / pawns for Ready Sting; porters / queens for Heave Step; masons / rooks for Drift Sill; hex / knights for Drift Hold; buffers / bishops for Drift Lend; hex / pawns for Drift Sip; masons / pawns for Drift Post; queens / bishops for Heave Bounce; knights / pawns for Must Drift; hex / bishops for Verse Pace.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 key names for a different meaning.

`mpCost` stays 0 on every Wave-11 row.

**New keys (Wave 11 only):**

```text
requireCasterForcedHeal, requireTargetForcedHeal, heaveMendAmount,  // Heave Mend
dualKeepApCap, dualKeepMpCap, dualKeepOnceBattle,                   // Dual Keep — next-turn start
septSpanCells,                                                      // Sept Span — 7; stretched plus from origin
halveRemainingCds,                                                  // Cadence Halve — floor(n/2); 0 stays 0
midHoodExactChebyshev,                                              // Mid Hood — next hit == 2 → 0
readyLeftoverApMin, readyLeftoverMpMin, readyStingBonus,            // Ready Sting
heaveStepNeedForced, heaveStepAdj,                                  // Heave Step — dest Chebyshev 1 of target
driftSillForbidRelocateDest, driftSillDuration,                     // Drift Sill — 2 turns
driftHoldUntilForced, driftHoldDuration,                            // Drift Hold — 2 of their turns
driftLendAp, requireTargetForcedLend,                               // Drift Lend — +1 AP iff forced
driftSipAp, requireTargetForcedSip,                                 // Drift Sip — steal 1 leftover AP iff forced
driftPostDetonateDamage,                                            // Drift Post — 10 on relocate landing
heaveBounceNeedForced, heaveBounceSearchRadius, heaveBounceCount,   // Heave Bounce
mustWalkForcedDir,                                                  // Must Drift — remaining walks == lastForcedMoveDir
versePaceUntilWalked,                                               // Verse Pace — last id illegal until walk MP
courtDualExcludeCaster                                              // Court Dual
```

If a key is missing, the rider does not fire.

Nested kit-only id (not a player card): none new besides Court Dual itself. Drift Post’s detonate is **not** a second spell id (the summon row carries `driftPostDetonateDamage`). Do not mint `spell-drift-burst`.

Force-move resolvers (Wave 9 `forcedMovedThisTurn`) must also write `lastForcedMoveDir` as an 8-dir unit `{dx,dy}` with `|dx|,|dy| ∈ {0,1}` and not both 0. Walk spends must **not** write that vector. Missing vector → Must Drift fizzles.

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Dual Keep’s bank is paid in **unused leftover**, not in extra AP.

---

## 5. Proposed spells (Wave 11)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-heave-mend`

NAME: Heave Mend  
ROLE: SUPPORT — heal if caster **and** target were both force-moved  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"requireCasterForcedHeal":true,"requireTargetForcedHeal":true,"heaveMendAmount":8}`. If **both** caster and target have `forcedMovedThisTurn`, heal the target 8 through the existing heal helper (not a second HP write). If either only walked, or neither moved, fizzle rider (AP spent, no HP). Distinct from Both Mend (#695, **both walked**), Shove Mend (#636, **target** force-moved only), Gait Mend (caster walked), Chase Mend (target walked), Clash Mend (Struck), Bar Mend (target resolved a spell). The decision: two bodies accept a shove this round, then 8 — or skip.  
DURATION: instant  
SCALING: 8 follows heal% if any; amount otherwise fixed.  
SYNERGIES: Pair Pace / Court Shove / Shoulder Bash / Ally Step set `forcedMovedThisTurn`; Drift Lend funds a follow-up after the shove; Shove Sting on the landing they just took.  
COUNTERPLAY: Do not shove; Root before the relocate; isolate so there is no legal dest.  
POWER_BUDGET: Standard heal, gated on **two** force flags. Blood Mend is 12 ungated self.  
AI_USAGE: `aiHint: "heal_if_caster_and_target_both_forced_moved"`. Cantors / porters. Skip if either flag is false.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop","queen"], levelZoneMin: 1 }`. MULTI child `heave_cantor`.  
EDGE_CASES: Targeting ally already allows self (`targeting.ts` 184–189). Self-cast requires the caster was force-moved (one body, both flags). Walk does **not** set `forcedMovedThisTurn`. Player-side HP actually increased → `challengeHealUsedRef`. Missing keys → no heal.  
IMPLEMENTATION_COMPLEXITY: LOW — two flag reads + existing heal helper.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-heave-mend
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
effectParams: {"requireCasterForcedHeal":true,"requireTargetForcedHeal":true,"heaveMendAmount":8}
```

---

### SPELL_ID: `spell-dual-keep`

NAME: Dual Keep  
ROLE: SUPPORT — bank leftover AP **and** leftover MP to next turn start  
ACQUISITION: MULTI_SOURCE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `effectParams: {"dualKeepApCap":2,"dualKeepMpCap":2,"dualKeepOnceBattle":true}`. At **end of this turn**, snapshot leftover current AP (cap 2) **and** leftover current walk MP (cap 2). At **this unit’s next turn start**, add those snapshots to current AP / MP (each still capped at the unit’s max). Once/battle: a second Dual Keep this fight fizzles (AP spent). Distinct from Purse Keep (#636, **AP only**), Stride Keep (#695, **MP only**), Haste / Second Wind (grant **now**), Timestep (full **now**), Leftover Lend (dump **your** leftover AP onto an ally **now**). The decision: leave 1–2 of **both** resources on the table this turn, or spend them and bank 0.  
DURATION: pays at next own turn start  
SCALING: caps fixed.  
SYNERGIES: Ready Sting punishes the banked pair next round; Dual Keep then Dual Keep is illegal (once/battle); Court Dual is the mass signature.  
COUNTERPLAY: Force a spend before end of turn (Quiet Hex / Hex Toll / Must Step); Ready Sting / Dry Sting / Damp Sting while they are holding; kill before next start.  
POWER_BUDGET: Cheap AP, once/battle, CD 4. Power is **two** leftover currencies, not a grant.  
AI_USAGE: `aiHint: "dual_keep_if_leftover_ap_ge_1_and_leftover_mp_ge_1_and_once_free"`. Scribes / tempo. Skip if either leftover is 0 **or** the once/battle flag is spent. Never Dual Keep as the last action if they still need a 2-AP tool **this** turn.  
DISCOVERY_ELIGIBILITY: true. MULTI child `dual_bursar`. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Snapshot is **end of this turn**, not at cast (they can still spend after arming). Pay is **next own turn start**, not a queue splice, not mid-RAF. Once/battle is a battle flag, not a remaining CD. Missing keys → no bank. Do not write spell levels.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — end-of-turn snapshot + next-start pay, two currencies, once/battle. Not a turn-order rewrite.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-sept-span`

NAME: Sept Span  
ROLE: SUMMONS — seven-cell occupy (stretched plus)  
ACQUISITION: MULTI_SOURCE  
AP_COST: 4  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "septspan"`, `summonLifespan: 4`, empty kit (`summonUnitDef` with `pieceType: ""` / zero scales — a body, not a caster). `effectParams: {"septSpanCells":7}`. Click a free ground tile as origin. Facing = caster→click **cardinal** (not diagonal). Footprint = origin + 2 cells each way along that file (5-long file) + the 2 ortho neighbors of the origin. All 7 cells must be free (`isCellFree`); else fizzle (AP spent). One combatant id, seven-cell footprint. Counts as **seven** toward the summon cap. Distinct from Twin Span (2 walking), Triple Span (3), Quad Span (2×2 = 4), Penta Span (ortho plus = 5), Span Guard / Pylon (rigid 2-cell). The decision: seal a corridor **and** its two side pockets for seven cap, or you cannot afford the weight.  
DURATION: lifespan 4  
SCALING: footprint fixed.  
SYNERGIES: File Lance / Cast Sill / Drift Sill around the stretched plus; Quiet Sill on a wing so Strike cannot peel through.  
COUNTERPLAY: Occupy any of the 7 before paint; Coup the body (one HP pool); walk around the long axis.  
POWER_BUDGET: Heavy 4 / CD 3 / 0 damage. Power is **seven** cells of deny.  
AI_USAGE: `aiHint: "sept_span_if_seven_free_on_cardinal_file_and_cap_allows"`. Masons / rooks ELITE. Skip if any footprint cell is occupied **or** remaining summon weight + 7 would exceed cap.  
DISCOVERY_ELIGIBILITY: true. MULTI child `span_sept`. `pieceTypes: ["rook"]`, `levelZoneMin: 2`  
EDGE_CASES: **Do not ship while `ENEMY_SUMMON_CAP === 2` without occupy-weight.** Diagonal click is illegal (fizzle). Never parse `"Sept Span"`. One id, seven cells — destroying the body frees all seven. Player-side Sept Span counts toward the **player** summon economy, not `ENEMY_SUMMON_CAP`. Missing `septSpanCells` → do not spawn a 1-cell body and call it Sept Span.  
IMPLEMENTATION_COMPLEXITY: HIGH — multi-cell occupy + cap weight. Same class as Quad / Penta.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-halve`

NAME: Cadence Halve  
ROLE: CONTROL — floor-divide remaining CDs on one hostile  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"halveRemainingCds":true}`. For each remaining CD `n > 0` on the target, write `floor(n / 2)` (Inferno remaining 3 → 1; remaining 1 → 0). Zeros stay 0. Once/battle flags and spell levels are **not** CDs. Distinct from Cadence Stretch (`×2` remaining), Trim (`−1`), Shave (ally −1 **all**), Stall (`+1` all), Flush (ally all → 0), Crack (hostile **highest** → 0), Pin (freeze **one** remaining). The decision: they wanted to wait a 3-lock; you cut it to 1 — or you just handed them Inferno next turn.  
DURATION: instant rewrite of remaining locks  
SCALING: none.  
SYNERGIES: Verse Tax / Verse Pace on the id you just made recastable; Trim after Halve (3→1→0).  
COUNTERPLAY: Cast the locked id **before** Halve; do not hold a 3-lock if a tempo bishop is on the board.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Inverse of Stretch.  
AI_USAGE: `aiHint: "halve_if_target_has_remaining_cd_ge_3"`. Scribes / tempo. Skip if no remaining CD ≥ 2 (floor(1/2)=0 is a Crack-adjacent trap — skip unless Crack is not in kit **and** remaining is ≥ 3).  
DISCOVERY_ELIGIBILITY: true. MULTI child `halve_precentor`. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing key → no rewrite. Do not write `spellLevelValues`. Do not reset Dual Keep’s once/battle. Preview must show which locks change.  
IMPLEMENTATION_COMPLEXITY: LOW — map remaining CD integers.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-mid-hood`

NAME: Mid Hood  
ROLE: DEFENSE — next hit from Chebyshev **exactly 2** is 0  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"midHoodExactChebyshev":2}`. The next damaging hit whose origin Chebyshev to this unit is **exactly 2** is 0 (consume the charge **before** HP write). Hits from 1 (Strike / adjacent) and from ≥ 3 (Frost / Far Sting) still land and **do not** consume the charge. Distinct from Near Hood (≤ 1), Far Hood (≥ 3), Sidestep Ward (next hit **any** range), Fog Hood (cuts LoS range), Off Plate (next **off-turn** hit). The decision: stand on the 2-ring, or step in / snipe past.  
DURATION: until 1 exact-2 consume or battle end  
SCALING: none.  
SYNERGIES: Must Step boxes remaining walks to Chebyshev 1 (they cannot sit on 2); Root them on 2; Quiet Sill so the Strike peel is also illegal.  
COUNTERPLAY: Step to 1 and Strike; snipe from 3+; wait the charge; do not consume with a 1-range poke.  
POWER_BUDGET: Cheap. Exact-2 pocket only.  
AI_USAGE: `aiHint: "mid_hood_if_threat_is_on_chebyshev_2"`. Lurkers / knights ELITE. Skip if all threats are already at 1 or ≥ 3.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 1`  
EDGE_CASES: Consume in the incoming-hit pipeline **before** HP write, **only** if origin Chebyshev === 2. Do not add a percent miss inside `combatMath.ts`. AoE: origin is the **caster cell**, not each painted tile. Missing key → no hood. Charge does not stack; last writer wins vs Near/Far Hood (one next-hit gate).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — same consume gate as Near/Far Hood with an equality test.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-ready-sting`

NAME: Ready Sting  
ROLE: DAMAGE — bonus if leftover AP **and** leftover MP are both ≥ 1  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 8. If the **target’s** leftover current AP ≥ 1 **and** leftover current walk MP ≥ 1 at resolve, deal an extra 8 as a second existing `dealDamage` call (`effectParams: {"readyLeftoverApMin":1,"readyLeftoverMpMin":1,"readyStingBonus":8}`). Distinct from Dry Sting (leftover **AP = 0**), Damp Sting (leftover **MP ≥ 2** only), Full Purse (leftover **AP ≥ 3**), Lone Purse (leftover AP **exactly 1**). Dual Keep’s bank is a **next-turn** pay — Ready Sting reads **this turn’s** leftover, so a Dual Keep that has not yet paid does not itself create leftover. The decision: they saved both currencies for Dual Keep / a second step — you tax 8+8 — or they spent one down and you only land 8.  
DURATION: instant  
SCALING: 8 / 8 follow dmg%.  
SYNERGIES: Dual Keep (they wanted leftover on both); Must Step (they may still hold MP); Quiet Hex (they hold AP).  
COUNTERPLAY: Spend AP **or** MP to 0 before the poke; Sidestep the hit.  
POWER_BUDGET: Cheap 8, 16 if they hoarded both. Frost-equal only when the dual gate is live.  
AI_USAGE: `aiHint: "ready_sting_if_target_leftover_ap_ge_1_and_mp_ge_1"`. Lurkers / pawns. Skip the bonus path (still may cast for 8) if either leftover is 0 **and** Dry / Damp is in kit instead.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","knight"]`, `levelZoneMin: 1`  
EDGE_CASES: One leftover reader per cast: this card’s dual-min keys. Do not also apply Dry / Damp / Lone Purse on the same hit. Missing keys → 8 only. Challenge: bonus 8 is a spell-hit (`recordChallengeDamageTaken`).  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-heave-step`

NAME: Heave Step  
ROLE: POSITION — caster lands adjacent to a force-moved ally  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: **Not** `isSwap`. `effectParams: {"heaveStepNeedForced":true,"heaveStepAdj":1}`. Target a living ally with `forcedMovedThisTurn`. Click a **free** Chebyshev-1 of **that ally**. Relocate the **caster** there through occupancy. If the ally was not force-moved, or the dest is not free Chebyshev-1 of them, fizzle (AP spent). Distinct from Home Step (#636, caster → ally with **no** force gate), Ally Step (#695, **ally** lands next to the caster), Hinge Step (90° around the ally), Cover Step (into LoS cover). The decision: they got shoved; you join the new cell — or they walked and you wasted 3 AP.  
DURATION: instant  
SCALING: none.  
SYNERGIES: Court Shove / Pair Pace / Shoulder Bash set the flag; Heave Mend after you arrive (caster now also needs a force flag — Heave Step itself is a relocate, so the **caster** gains `forcedMovedThisTurn` on a successful land, which can arm a follow-up Heave Mend **on a third ally**, not on the one you just joined unless that one was already forced).  
COUNTERPLAY: Do not shove the ally; occupy the 1-ring; Drift Sill the dest.  
POWER_BUDGET: Standard utility, 0 damage, CD 2.  
AI_USAGE: `aiHint: "heave_step_if_ally_forced_and_free_adj_improves_range"`. Porters / queens. Skip if `forcedMovedThisTurn` is false or no free adj.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Do not call `swapPositions`. Hazard on landing **must tick** (same Swap-landing contract). Self-target is illegal unless a second body exists — `targetType: "ally"` may include self; **reject self** (`heaveStepNeedForced` on self with dest adj-to-self is a no-op blink — require `targetId !== casterId`). Missing keys → no move.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy dest, not `isSwap`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-drift-sill`

NAME: Drift Sill  
ROLE: TERRAIN — occupant cannot be a relocate destination  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: Paint 1 free cell for 2 turns (`effectParams: {"driftSillForbidRelocateDest":true,"driftSillDuration":2}`). Walk onto / off is legal. A relocate whose **destination** is this cell fizzles that relocate (the mover stays). Distinct from Claim Ward (cannot be swapped **onto** — swap is one relocate class; this covers push/pull/swap/step), Grounded Lock (unit cannot swap/blink), Nail Down, Quiet Sill / Cast Sill (confirm-gates). The decision: park a body on the sill so a shove cannot drop them onto lava / Shove Sting, **or** paint the sill on the lava so the shove cannot complete.  
DURATION: 2 turns  
SCALING: duration fixed.  
SYNERGIES: Shove Sting becomes a dead paint if dest is Drift Sill; Open Pit + Drift Sill on the pit cell (they cannot be shoved in; they can still walk in).  
COUNTERPLAY: Walk them off; wait 2; Dispel the paint (`cleanseTypes` include `"driftSill"` on the **tile**).  
POWER_BUDGET: Cheap tile lock, 0 damage.  
AI_USAGE: `aiHint: "drift_sill_if_ally_would_be_shoved_onto_hazard_or_to_block_a_shove"`. Masons / rooks. Skip if no relocate threat this round.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Paint is observation; later blocked relocate is not a second observe. Twin Gate pad transit is **not** this relocate class (pads are walk). `isSwap` dest onto Drift Sill fizzles the **whole** swap (same as Claim Ward). Missing keys → no paint.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — relocate dest filter shared by push/pull/swap/step.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-drift-hold`

NAME: Drift Hold  
ROLE: CONTROL — cannot walk until they are force-moved  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: No damage. `effectParams: {"driftHoldUntilForced":true,"driftHoldDuration":2}`. For 2 of the target’s turns or until they gain `forcedMovedThisTurn`, whichever first, they cannot spend walk MP (`no_drift_hold`). Strike does **not** peel. Distinct from Boot Hold (#646, cannot **walk** until they **Strike**), Strike Hold (cannot Strike until **walk**), Cast Hold (cannot **spell** until walk), Tool Hold (cannot non-physical until Strike). The decision: they need a partner to shove them free, or they sit 2 turns.  
DURATION: 2 of their turns or 1 force-move  
SCALING: duration fixed.  
SYNERGIES: Drift Sill so the shove dest is also illegal (they cannot peel); Must Drift after they peel (their first walks must follow the shove dir); Heave Mend if **you** shoved both.  
COUNTERPLAY: Get shoved; wait 2; Cleanse (`cleanseTypes` include `"driftHold"`).  
POWER_BUDGET: Standard control, 0 damage, CD 3.  
AI_USAGE: `aiHint: "drift_hold_if_target_needs_walk_and_no_ally_shove_in_kit"`. Hex / knights ELITE. Skip if their leftover MP is already 0 **and** they are in range (the hold is a no-op) **or** a partner in the pack will immediately Shoulder Bash them (you just paid 3 to set up **their** peel).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["knight","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Forced movement **does** peel and **is** legal while the hold is up (the lock is walk MP, not relocate). Walk fizzle is illegal (they cannot peel with a failed step). Missing key → no hold.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — walk-spend confirm gate. Forced-move path stays open.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-drift-lend`

NAME: Drift Lend  
ROLE: SUPPORT — +1 AP to an ally who was force-moved  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"driftLendAp":1,"requireTargetForcedLend":true}`. If the target has `forcedMovedThisTurn`, add 1 to **current** AP this turn, capped at the unit’s max. If they have not been force-moved, fizzle rider (AP spent). Distinct from Spent Lend (#695, +1 **MP** if they **walked**), Boot Lend (+1 MP if **unmoved**), Tempo Gift / Loan Tempo (ungated AP), Leftover Lend (dump **your** leftover AP). The decision: fund a spell **after** they accepted a shove, or they camped and you wasted 2 AP.  
DURATION: instant  
SCALING: amount fixed.  
SYNERGIES: Heave Mend (they were forced); Court Shove into range then Drift Lend a nuke; Dual Keep does **not** satisfy this (bank is next turn).  
COUNTERPLAY: Do not shove; Drain Courage the extra 1; isolate.  
POWER_BUDGET: Cheap, CD 2, 0 damage.  
AI_USAGE: `aiHint: "lend_ap_if_ally_forced_moved_and_needs_one_more_ap"`. Buffers / bishops. Skip if `forcedMovedThisTurn` is false or they are already at max AP.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Self-cast after a self-knockback (Back Step) is legal. Do not grant if they only walked. Missing keys → no AP. Challenge: the +1 is **not** `recordChallengeApSpend` (they did not spend).  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-drift-sip`

NAME: Drift Sip  
ROLE: CONTROL — steal 1 leftover AP iff they were force-moved  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"driftSipAp":1,"requireTargetForcedSip":true}`. If the target has `forcedMovedThisTurn` **and** leftover current AP ≥ 1, they lose 1 current AP and the caster gains 1 current AP this turn (caster capped at max). Else fizzle rider (AP spent). Distinct from Ap Sip (#342, ungated), Gait Sip (#695, **MP** iff they **walked**), Soul Sip (MP steal ungated vs walk), Drain Courage (immediate −1 AP **plus** drain damage). The decision: shove them, then tax the AP they saved for a nuke — or they spent to 0 on landing and you wasted 2.  
DURATION: instant  
SCALING: amount fixed.  
SYNERGIES: Shoulder Bash / Pair Slide then sip; Ready Sting after they still have MP; Dual Keep they wanted to arm — you took the AP.  
COUNTERPLAY: Spend AP to 0 after the shove; do not get shoved; Self Anchor.  
POWER_BUDGET: Cheap zero-sum, CD 2.  
AI_USAGE: `aiHint: "sip_ap_if_target_forced_and_leftover_ap_ge_1"`. Hex / pawns. Skip if either gate fails.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Victim’s lost AP is **not** `recordChallengeApSpend` (they did not choose to spend). Caster gain is not a spend. Missing keys → no steal. Do not steal below 0.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-drift-post`

NAME: Drift Post  
ROLE: SUMMONS — detonates when a relocate **lands** on its cell; walk is safe  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "driftpost"`, `summonLifespan: 3`, empty kit, counts as **one**. `effectParams: {"driftPostDetonateDamage":10}`. Place on a free cell. If a relocate destination equals this cell, deal 10 to the **landing** body through existing `dealDamage`, then the post dies. **Walk onto does not detonate.** Distinct from Dummy Post (taunt, no detonate), Bait Pylon (eat), Spark Whelp (kamikaze kit), Ingress Mark (walk-enter **paint**), Shove Sting (paint, no body). The decision: bait a shove onto the post, or they walk through for free.  
DURATION: lifespan 3 or until detonate  
SCALING: 10 follows dmg%.  
SYNERGIES: Drift Hold so they cannot walk around; Court Shove / Pair Slide onto the post; Drift Sill on a **different** cell to funnel the dest.  
COUNTERPLAY: Walk onto it (safe); kill the post; shove **past** it; Drift Sill the post’s cell (relocate dest illegal → no detonate).  
POWER_BUDGET: Standard 3 / CD 3. 10 is Strike-equal, gated on a relocate.  
AI_USAGE: `aiHint: "drift_post_if_shove_dest_is_predictable"`. Masons / pawns. Skip if the pack has no relocate id. Never parse `"Drift Post"`.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Summon **place** is observation; later detonate is not a second observe. Player walking onto their own post is safe. Enemy walking onto a player post is safe. Forced-move landing of **either** side detonates. Challenge: 10 is a spell-hit if treated as the post’s strike — **this card picks environmental-on-landing** (`recordInBattleChallengeDamage` while `inBattleRef` if the landing is the player; otherwise existing environmental helper). Occupancy: the post **is** a body, so the relocate dest is occupied — **detonate resolves in the relocate dest check as: dest occupied by a `summonAI === "driftpost"` body → deal 10, despawn post, then dest becomes free and the landing completes.** If that two-step is too heavy, **alternate (preferred for ship):** dest occupied fizzles the relocate **and** detonates (mover stays, post dies, 10 still applies). Implementers must pick **one** in the data PR and test both walk-safe and shove-hits. Missing key → place a Dummy Post clone (forbidden) — require the param or fizzle the summon.  
IMPLEMENTATION_COMPLEXITY: HIGH — occupy + relocate dest hook. Prefer the fizzle-and-detonate alternate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-heave-bounce`

NAME: Heave Bounce  
ROLE: DAMAGE chain — bounce only to another force-moved hostile  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Deal 12 to the primary. Do **not** set `bounces` (that path is nearest-any Chain Lightning). `effectParams: {"heaveBounceNeedForced":true,"heaveBounceSearchRadius":4,"heaveBounceCount":1}`. Find the nearest **other** living hostile within Chebyshev 4 of the **primary** that has `forcedMovedThisTurn`. If found, deal 12 to them as a second existing `dealDamage` (LoS not required for the bounce). If none, only the 12 lands (not a fizzle). Distinct from Chain Lightning (nearest any, 2 bounces, 20), Ricochet Mark (tile amp), Split Fang. The decision: shove two bodies, then 12+12 — or poke a camper for 12.  
DURATION: instant  
SCALING: 12 follows dmg%.  
SYNERGIES: Pair Slide / Court Shove / Pawn Trade into range of each other; Heave Mend is the heal mirror of this tax.  
COUNTERPLAY: Isolate (one body); do not both get shoved; Barrier the primary.  
POWER_BUDGET: Standard 12, 24 if two force flags. Chain is 20+bounces at 4 AP.  
AI_USAGE: `aiHint: "heave_bounce_if_two_hostiles_forced_within_4"`. Queens / bishops. Skip the bounce path if pack force flags < 2 **and** Frost is in kit.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Primary does **not** need to be force-moved (the bounce target does). Ties: nearest Chebyshev, then lowest id. Do not hit allies. Missing keys → 12 only, never a nearest-any bounce. Challenge: both 12s are spell-hits.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — search + second `dealDamage`. Do not call the live `bounces` walker.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-must-drift`

NAME: Must Drift  
ROLE: CONTROL — remaining walks must follow last forced-move direction  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: No damage. `effectParams: {"mustWalkForcedDir":true}`. If the target has no `lastForcedMoveDir` this turn, fizzle (AP spent). Else, for the rest of **this** turn, every walk dest must be exactly 1 step along that 8-dir (same `{dx,dy}`). Distinct from Must Step (Chebyshev **exactly 1**, any dir), Must Span (Manhattan 2), Rank Lock (rank XOR file of **caster→target**), Inch Stride (**one** next walk ≤ 1). The decision: they got shoved east, so their leftover MP can only continue east — into your File Lance / pit — or they stop.  
DURATION: rest of their current turn  
SCALING: none.  
SYNERGIES: Open Pit / Shove Sting / File Lance on that file; Drift Hold first (they cannot walk until shoved, then Must Drift boxes the peel).  
COUNTERPLAY: Do not get shoved; spend MP to 0 before Must Drift; wait the turn.  
POWER_BUDGET: Standard control, 0 damage, CD 3.  
AI_USAGE: `aiHint: "must_drift_if_target_has_last_forced_dir_and_leftover_mp_ge_1"`. Knights / pawns ELITE. Skip if `lastForcedMoveDir` is missing.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 1`  
EDGE_CASES: Forced movement **after** the lock is still legal and **rewrites** `lastForcedMoveDir` (the remaining-walk filter uses the **latest** vector). Walk spends do not write the vector. Missing key → no lock. Diagonal shove ⇒ diagonal-only remaining walks.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — walk-dest filter + vector on occupancy commits.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-verse-pace`

NAME: Verse Pace  
ROLE: CONTROL — last resolved id is illegal until they walk  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: No damage. `effectParams: {"versePaceUntilWalked":true}`. Read the target’s last **successfully resolved** spell id this battle (same last-id slot as Verse Tax / Last Mute). Until they spend walk MP ≥ 1, confirming that id rejects `no_verse_pace`. Other ids are legal. Forced-move does **not** peel. Distinct from Last Mute (id illegal for **duration**, walk does not peel), Verse Tax (legal, +1 AP), Verse First (must cast **this** id first), Cast Hold (all spells until walk), Once Verse (echo). The decision: recast Inferno only after a step, or switch tools.  
DURATION: until 1 walk MP spend or battle end  
SCALING: none.  
SYNERGIES: Quiet Sill so the walk they need is onto a Strike-forbid cell; Must Drift so the peel walk is one file; Cadence Halve so the lock they wanted to recast is also shorter — still illegal until they walk.  
COUNTERPLAY: Walk 1; cast a different id; wait; Cleanse (`cleanseTypes` include `"versePace"`).  
POWER_BUDGET: Standard control, 0 damage, CD 3.  
AI_USAGE: `aiHint: "verse_pace_if_target_last_id_is_their_best_nuke"`. Hex / bishops. Skip if they have no last-id (opening turn) **or** leftover MP is 0 and they are already in range (they can sit and recast — the lock is then a Last Mute clone; **skip unless leftover MP ≥ 1** so the walk peel is a real tax).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Fizzle of the locked id is still illegal (they cannot peel with a failed Inferno). Attack Nearest / sprite-click of that id is also illegal. Strike (`physical_attack`) is a different id — legal. Missing last-id → fizzle (AP spent). Missing key → no lock.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — confirm gate keyed off existing last-id slot + walk peel.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-dual`

NAME: Court Dual  
ROLE: SUPPORT — mass Dual Keep  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `effectParams: {"dualKeepApCap":2,"dualKeepMpCap":2,"courtDualExcludeCaster":true}`. For every **other** living combatant, apply the Dual Keep rewrite (snapshot leftover AP cap 2 **and** leftover MP cap 2 at **end of this turn**, pay at **that unit’s** next turn start). Caster does not bank. Distinct from Court Keep (mass leftover-**MP** only), Court Stretch (mass remaining-CD `×2`), Pack Tithe (leftover **AP** siphon, never owned), Pack Stride (leftover **MP** siphon). Player never owns this. Court Dual itself is **not** once/battle (CD 4 is the lid); per-unit Dual Keep once/battle flags are **not** written (this signature may re-arm).  
DURATION: pays at each other unit’s next start  
SCALING: caps 2 / 2 fixed.  
SYNERGIES (as a witness puzzle): Ready Sting next round against banked kites; Drift Sip the AP banks.  
COUNTERPLAY: Spend AP **and** MP to 0 before the snapshot; die before next start.  
POWER_BUDGET: Signature 6 / CD 4.  
AI_USAGE: `aiHint: "court_dual_if_two_plus_others_have_leftover_ap_ge_1_and_mp_ge_1"`. Kit-only on `court_dual_regent`. Skip if fewer than two others have **both** leftovers ≥ 1.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. Observation may still record for telemetry; **grant never fires**. `usableByPlayer: false`, `usableByEnemy: true`.  
EDGE_CASES: Same end-of-turn snapshot and next-start pay as Dual Keep. Not a queue splice. Do not write owned ids. Missing `courtDualExcludeCaster` → do not also bank the caster (fail closed: no-op).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — map-wide loop of the Dual Keep helper.  
STATUS: PROPOSED

---

## 6. Combination matrix (intended, not name-wired)

Interactions resolve from **fields and flags**, never from `spell.name`.

| Field / flag | Combines with | Intended decision |
| :--- | :--- | :--- |
| `forcedMovedThisTurn` on **both** | Heave Mend | Both accept a shove, then 8 — or skip |
| `dualKeepApCap` + `dualKeepMpCap` | Ready Sting next turn | Bank both, or spend one down |
| `septSpanCells` | File Lance / Drift Sill on a wing | Seal a corridor for seven cap |
| `halveRemainingCds` | Verse Pace / Inferno remaining 3 | 3→1 still illegal until they walk |
| `midHoodExactChebyshev` | Must Step / Root | They cannot sit on 2, or they must |
| `readyLeftoverApMin` + `readyLeftoverMpMin` | Dual Keep / Haste | Punish the dual bank |
| `heaveStepNeedForced` | Court Shove then join | They moved; you follow |
| `driftSillForbidRelocateDest` | Shove Sting / Open Pit | Shove cannot complete onto the paint |
| `driftHoldUntilForced` | Must Drift after peel | Cannot walk until shoved; then only along the shove |
| `requireTargetForcedLend` | Heave Mend | Fund a spell after the shove |
| `requireTargetForcedSip` | Pair Slide | Tax the AP they saved |
| `driftPostDetonateDamage` | Drift Hold | Walk is safe; shove is not |
| `heaveBounceNeedForced` | Pair Slide two bodies | 12+12 or 12 |
| `mustWalkForcedDir` | File Lance on that file | Leftover MP continues into the ray |
| `versePaceUntilWalked` | Quiet Sill | Recast only after a taxed step |
| `courtDualExcludeCaster` | Two kite queens | Signature window |

Do **not** implement a name table that says “if Heave Mend and Pair Slide then…”. If the flag is missing, the rider does not fire.

---

## 7. Recommended unlock order (pacing)

Discovery still inert. This is the **intended** observe curve once the ownership split lands, not a live drop table.

| Band | Ids | Why this order |
| :--- | :--- | :--- |
| Early observe (zone 1) | Ready Sting, Drift Lend, Drift Sip, Drift Sill, Heave Bounce | Cheap decisions on leftover pair, force-move, and paint |
| Mid observe | Heave Mend, Heave Step, Verse Pace, Drift Post, Cadence Halve | Need two force flags / last-id / remaining CD already in the kit |
| Elite / MULTI | Mid Hood, Drift Hold, Must Drift, Dual Keep, Sept Span | Geometry and economy lids |
| Witness only | Court Dual | Never owned |

Do not append these to `starterSpells`.

---

## 8. Implementation notes (for a later, explicit implementation PR)

1. **No new `mpCost > 0`.** Ley Toll / Undertow / Sanguine Toll remain the only paper spenders.  
2. **No new facing card.** Wave 5 still owns `currentView` after a battle-walk writer exists. Overworld wander still writes `currentView` (WX 6924–6938); battle walks still do not.  
3. **No new queue / wrap / mid-RAF card.** Dual Keep / Court Dual pay at **next own turn start**. Do not splice the current actor.  
4. **Heave Step** is an occupancy dest, not `isSwap`. Do not call `swapPositions`. Reject self.  
5. **Cadence Halve** rewrites remaining locks only (`floor(n/2)`, 0 stays 0). Do not write spell levels or once/battle flags.  
6. **Heave Mend** flips `challengeHealUsedRef` only when player-side HP actually increased.  
7. **Mid Hood** consumes in the incoming-hit pipeline **before** HP write, and **only** if origin Chebyshev === 2. Do not add a percent miss inside `combatMath.ts`.  
8. **Must Drift / Drift Hold / Verse Pace / Drift Sill** are walk-dest / walk-spend / confirm-gate / relocate-dest filters. Forced movement stays legal except where Drift Sill filters dests.  
9. **Sept Span** uses `summonAI: "septspan"`. Empty kit. Counts as **seven**. Never parse `"Sept Span"`. One combatant id, stretched-plus footprint. **Do not ship while `ENEMY_SUMMON_CAP === 2` without occupy-weight.**  
10. **Drift Post** uses `summonAI: "driftpost"`. Empty kit. Counts as one. Prefer fizzle-and-detonate on relocate dest. Walk onto is safe. Place is observation; detonate is not a second observe.  
11. **Heave Bounce** must **not** set `bounces` (that is nearest-any). Missing `heaveBounceNeedForced` → 12 only.  
12. **Dual Keep** snapshots leftover AP **and** MP at **end of this turn**, pays at **next turn start**. Not a queue splice. Once/battle on the player card. Court Dual does not write that once flag.  
13. Recap grant uses the reward funnel + `commitSpellDiscoveries` / `unlockOwnedSpell`, not `updateCharacter`.  
14. Do not append these ids to `starterSpells` as `isBaseSpell`. Add to `SPELL_ID_CATALOG` **only when implemented**, together with `spellData.ts` and kits.  
15. Extract helpers. Do not grow `WorldExploration.tsx` (19,213 lines).  
16. Do not touch RAF, map generation, turn order, or damage math.  
17. Write `forcedMovedThisTurn` + `lastForcedMoveDir` from successful relocate commits only. Walk MP spends must **not** increment the force flag or the vector.

---

## 9. Explicit non-goals this pass

- No production TypeScript / Motoko / Candid edits.  
- No new damage formula, crit, or RES/SR identity.  
- No fourth `mpCost > 0` walk-positioning snipe.  
- No sixth echo id (Choir Verse / Stolen Verse / After Verse / Echo Cast / False Echo already cover the axis).  
- No player-owned Hex of Silence (full bar lock).  
- No mid-RAF splice of the current actor.  
- No new facing card.  
- No player-owned About Hinge (stays `BOSS_ONLY` on #590). Hostile 180° pair-hinge is Pawn Trade — not re-proposed.  
- No restamp of any feat or `easy_*` / `hard_*` / `legendary_*` challenge door (including SDE Wave 7’s `hard_1` / `legendary_1` and #590’s `leader_slayer` / `spell_master` MULTI children). Do not stamp leftover `survivor`.  
- No restamp of Wave-5…11 boss extra doors (`ram_castellan` … `rebound_almoner`).  
- No restamp of Wave-6…10 tactical extra doors (`oath_censor` … `court_keep_regent`).  
- No restamp of Wave-8 / Wave-9 / Wave-10 SDE extras (`about_hinge_regent`, `odd_gallery`, `pair_gallery`, `knight_fold_regent`, `inch_gallery`, `close_precentor`, `mid_fold_regent`, …).  
- No restamp of any live 19 first-win.  
- No wiring of `CharacterStats.evasion` as a percent.  
- No clone of Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Veil, Mirror / Reflect.  
- No 12-AP Void Collapse clone.  
- No third File Lance / Blood Tithe.  
- No SDE Wave-9 ids (`spell-pair-stride`, `spell-clash-mend`, `spell-cadence-shave`, `spell-pack-stride`, `spell-knight-fold`, …).  
- No SDE Wave-10 ids (`spell-inch-stride`, `spell-rite-first`, `spell-ingress-mark`, `spell-bar-mend`, `spell-cadence-pin`, `spell-off-plate`, `spell-mid-fold`, …). Do **not** mint `spell-both-heave` (Heave Mend), `spell-hept-span` (Sept Span), or `spell-vault-keep` (Dual Keep). If a later SDE Wave-11 catalog claims one of this catalog’s tactical ids, **SDE wins**.  
- No six-cell occupy (skipped; Wave 12).

---

## 10. Proposal index

| ID | Acquisition | Complexity | Primary hole filled |
| :--- | :--- | :--- | :--- |
| `spell-heave-mend` | MULTI_SOURCE | LOW | Heal if caster **and** target were force-moved |
| `spell-dual-keep` | MULTI_SOURCE | MEDIUM | Bank leftover AP **and** MP to next turn start |
| `spell-sept-span` | MULTI_SOURCE | HIGH | Seven-cell stretched-plus occupy (cap-blocked while summon cap is 2) |
| `spell-cadence-halve` | MULTI_SOURCE | LOW | floor-divide remaining CDs on one hostile |
| `spell-mid-hood` | ELITE | MEDIUM | Next hit from Chebyshev **exactly 2** is 0 |
| `spell-ready-sting` | ENEMY_DISCOVERY | LOW | Bonus if leftover AP **and** MP both ≥ 1 |
| `spell-heave-step` | ENEMY_DISCOVERY | MEDIUM | Caster lands adjacent to a force-moved ally |
| `spell-drift-sill` | ENEMY_DISCOVERY | MEDIUM | Occupant cannot be a relocate dest |
| `spell-drift-hold` | ELITE | MEDIUM | Cannot walk until force-moved |
| `spell-drift-lend` | ENEMY_DISCOVERY | LOW | +1 AP to an ally who was force-moved |
| `spell-drift-sip` | ENEMY_DISCOVERY | LOW | Steal 1 leftover AP iff they were force-moved |
| `spell-drift-post` | MULTI_SOURCE | HIGH | Summon detonates on relocate landing; walk is safe |
| `spell-heave-bounce` | ENEMY_DISCOVERY | MEDIUM | Bounce 1 to another force-moved hostile |
| `spell-must-drift` | ELITE | MEDIUM | Remaining walks follow last forced-move dir |
| `spell-verse-pace` | ENEMY_DISCOVERY | MEDIUM | Last id illegal until they walk |
| `spell-court-dual` | NOT_PLAYER_LEARNABLE | MEDIUM | Mass Dual Keep |

All STATUS: **PROPOSED**.

**Held, not filled:** mid-RAF splice; fourth `mpCost > 0` walk snipe; sixth echo id; player-owned Hex of Silence; player-owned About Hinge; six-cell occupy; heal-if-**both leftover AP = 0**; copy remaining CDs from target onto the caster.

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
| `buildEnemyKit` zone NaN | `src/frontend/src/components/WorldExploration.tsx` | 11920 |
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

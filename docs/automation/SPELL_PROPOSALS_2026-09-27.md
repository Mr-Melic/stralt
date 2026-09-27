# Spell and Tactical Mechanics — Design Pass 2026-09-27

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1 law [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) through still-open Wave 10 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-27.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-a53c/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-27.md) (#679)
- Spell, Discovery & Achievement Admin — still-open #630 / same-day #677
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) … still-open Wave 9 [`SPELL_PROPOSALS_2026-09-26.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-d6e9/docs/automation/SPELL_PROPOSALS_2026-09-26.md) (#636)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); extra doors through #367 / #406 / #474 / #518 / #572 / #638 / same-day #663; tactical extras #463 / #525 / #563 / #636

This is **Wave 10**. Wave 9 (#636) filled force-move heal, remaining-CD `×2`, four-cell occupy, next-walk wick, leftover-AP=0 poke, caster-to-ally step, Manhattan-2 remaining walks, far-range miss, +MP to an unmoved ally, Strike-forbid tile, leave-sting, leftover-AP bank, next-DoT-tick negate, last-id mute, adjacent-pair translate, and a mass remaining-CD `×2` signature.

**Wave 9 explicitly deferred eight holes.** Same-day Discovery Wave 9 (#646) then claimed **none** of those eight as unique SDE ids (it authored a parallel G≥9 catalog instead). This pass fills three leftovers and leaves the rest held:

| Wave-9 leftover | Owner after #646 | This pass |
| :--- | :--- | :--- |
| Heal if **both** walked | Still open | **This pass:** Both Mend (`walkMpSpentThisTurn ≥ 1` on **caster and target**) |
| Carry leftover **MP** across turns | Still open | **This pass:** Stride Keep (cap 2, once/battle, next-turn start — **not** a queue splice) |
| Five-cell occupy | Still open | **This pass:** Penta Span (plus footprint, counts as **five**) |
| Mid-RAF splice | Held (AGENTS.md) | Still held |
| Fourth `mpCost > 0` walk snipe | Held (Ley Toll / Undertow / Sanguine Toll) | Still held |
| Sixth echo id | Held | Still held |
| Player-owned Hex of Silence | Held (`BOSS_ONLY`) | Still held |
| Player-owned About Hinge | Held (`BOSS_ONLY` on #590) | Still held. Hostile 180° around a pair midpoint is still Pawn Trade. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after the reserved set **and** after #646. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

Same-day Discovery Wave 10 already opened as **#679**. **SDE wins** those unique §11 ids. This pass does **not** clone them. Stamp family / observe metadata onto Wave-10 **tactical** ids only. If a later edit of #679 claims one of these tactical ids, **SDE wins**; rename is not this pass’s job.

Two leftover sketches collided with #679 and were **retargeted** (not renamed in place as clones): walk-enter detonate is Ingress Mark → this catalog’s **Shove Sting** (`spell-shove-sting`, first **forced-move landing** deals 8); cannot-Strike-until-spell is Rite First → this catalog’s **Tool Hold** (`spell-tool-hold`, cannot resolve **non-physical** until Strike). Do **not** mint `spell-enter-sting` or `spell-verse-hold`.

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is unchanged since 2026-08-31. Discovery is still inert. WX is **19,213** lines (`wc -l`).

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

**None** of these rows set `lineOfSight`, `linear`, `diagonal`, `modifiableRange`, `minRange`, or `maxRange`. **No row sets `mpCost` ≠ 0.** No row uses `targetType: "line"` even though `targeting.ts` 576–617 implements that branch. `areaShape` is typed (`gameTypes.ts` 224) but **targeting never reads `areaShape`** — area expansion is Chebyshev around `areaRadius` (`targeting.ts` 690–727).

`CharacterStats.evasion` exists (`gameTypes.ts` 64) and is persisted. Combat never reads it. Do not ship a percent-evasion card.

Live `ENEMY_SUMMON_CAP` is still **2** (`gameConstants.ts` 300). Quad Span (#636) already counts as four on paper and is implementation-blocked until that cap (or a dedicated occupy-weight) exists. Penta Span is the same class of card: **propose the hole, do not pretend it can ship against cap 2**.

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

`OLD_SPELL_NAMES_SET` (`WorldExploration.tsx` 2329–2354) still filters by **name and id**. That heuristic is forbidden going forward.

### 1.3 Engine support vs catalog use (still true, line numbers at this HEAD)

| Mechanic | Engine @ `0f5363f` | Live catalog | Already proposed (reserved) |
| :--- | :--- | :--- | :--- |
| Spell `mpCost` debit | `executeCastAttempt` (`WorldExploration.tsx` 17096–17207) gates **AP only**. | Always 0 | Ley Toll / Undertow / Sanguine Toll. **No fourth snipe this pass.** |
| `areaShape` cone / cross / line | Typed, **unread**. Area = Chebyshev (`targeting.ts` 690–727) | Unused | Fan Bolt / Cross Cut reserved |
| `targetType: "line"` | Implemented 8-dir ray (`targeting.ts` 576–617) | **No spell** | File Lance |
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** | Unused | Shoulder Bash, Hook Line, Ally Step (this pass **relocates** an ally onto a free Chebyshev-1 of the caster — occupancy dest, not `isSwap`) |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768 → WX `swapPositions` 9389–9401) | Swap | Pawn Trade / Ward Interpose / Pair Pace is **not** `isSwap` |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, never this set |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire |
| Walk / leftover-MP flags | Paper `walkMpSpentThisTurn` (Waves 6–9). Leftover **MP** dies at turn end | Haste grants **now**; Timestep is full **now** | **This pass: Stride Keep / Spent Lend / Gait Sip / Damp Sting / Both Mend / Must Step / Court Keep** |
| Five-cell occupy | Twin Span = 2; Triple Span = 3; Quad Span = 4 (2×2) | Absent | **This pass: Penta Span** (plus = 5) |
| CD −1 hostile remaining | Shave is **ally** −1 all; Stall is **+1** all; Stretch is **×2** remaining | Inferno CD 3 is the only live lock | **This pass: Cadence Trim (`−1` remaining, zeros stay 0)** |
| Near-range miss | Far Hood is next hit from Chebyshev **≥ 3** → 0; Sidestep is **any** next hit | Unused live | **This pass: Near Hood (≤ 1)** |

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

**Discovery Wave 10 (#679 — same-day; never re-propose / never clone):**  
`spell-inch-stride`, `spell-rite-first`, `spell-long-oath`, `spell-cinder-reel`, `spell-side-bite`, `spell-ingress-mark`, `spell-off-plate`, `spell-spike-skip`, `spell-tapped-plate`, `spell-summon-brace`, `spell-bar-mend`, `spell-cadence-pin`, `spell-still-tax`, `spell-brick-sprout`, `spell-watch-fee`, `spell-lone-purse`, `spell-banner-cut`, `spell-pack-close`, `spell-mid-fold`.

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` (tactical W2 **and** Discovery W2); `spell-blood-tithe` (tactical W2 pet sacrifice **versus** Discovery W2 HP→AP). Wave 10 does not add a third.

**Do not alias** Both Mend ↔ Gait Mend / Chase Mend / Shove Mend / Enter Mend / Split Mend / Clash Mend / Bar Mend / Mend Wick / Blood Mend; Stride Keep ↔ Purse Keep / Keep Kennel / Spent Stride / Pack Stride / Second Wind / Haste / Timestep; Penta Span ↔ Twin Span / Triple Span / Quad Span / Span Guard / Span Pylon / Void Span; Cadence Trim ↔ Cadence Shave / Stall / Flush / Stretch / Crack / Break / Theft / Lend / Brand / Pin; Near Hood ↔ Far Hood / Fog Hood / Tick Hood / Near Oath / Near Veil / Sidestep Ward / Off Plate; Gait Sip ↔ Soul Sip / Ap Sip / Gait Wick / Gait Mend / Gait Seal / Gait Tax / Still Tax; Cast Sill ↔ Quiet Sill / Gift Sill / Pet Sill / Kennel Sill / Body Sill / Ward Cell; Shove Sting ↔ Exit Sting / Enter Mend / Ingress Mark / Post Sting / Dry Sting / Lone Sting / Wall Sting / Tripwire / Caltrop / Shove Mend / Shove Face; Must Step ↔ Must Span / Must Pace / Pair Stride / Inch Stride / Soft Step / Hinge Step / Home Step / Ghost Step / Diag Lock; Ally Step ↔ Home Step / Ally Reel / Leash Hook / Hinge Step / Foe Reel / Paint Reel; Damp Sting ↔ Dry Sting / Full Purse / Lone Purse / Still Plate / Tapped Plate / Empty Plate / Lone Sting; Pair Pace ↔ Pair Slide / Pair Hinge / Pair Stride / Must Pace / Spare Pace / Twin Span / Mid Fold; Verse Tax ↔ Gait Tax / Camp Tax / Act Tax / Hex Toll / Last Mute / Quiet Hex / Still Tax; Tool Hold ↔ Rite First / Strike Hold / Boot Hold / Cast Hold / Verse First / Oath Blade / Ground Oath / Unit Oath; Spent Lend ↔ Boot Lend / Leftover Lend / Cadence Lend / Spent Stride / Spent Lens / Spare Pace; Court Keep ↔ Court Stretch / Court Hinge / Court Shove / Court Fold / Purse Keep / Stride Keep / Pack Tithe / Pack Close.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved, live, or still held) |
| :--- | :--- | :--- |
| SUPPORT both-walk heal | Heal iff **caster and target** both spent walk MP this turn | Gait Mend is **caster** walk. Chase Mend is **target** walk. Clash Mend is **Struck**. Shove Mend is **force-moved**. Bar Mend (#679) is target resolved a **spell**. |
| SUPPORT leftover-MP bank | Carry leftover **walk MP** (cap 2) to **next turn start**, once/battle | Purse Keep banks **AP**. Haste / Second Wind **grant now**. Pack Stride **siphons** leftover walk MP (`ENEMY_ONLY`). Timestep is full **now**. |
| SUMMONS five-cell | Plus occupy (center + 4 ortho), counts as **five** | Twin = 2 walking. Triple = 3. Quad = 2×2 = 4. Span Guard / Pylon are rigid 2-cell. |
| CONTROL CD trim | **−1** each remaining CD on one **hostile**; zeros stay 0 | Shave is **ally** −1 all. Stall is **+1** all. Stretch is **×2** remaining. Crack zeroes the **highest one**. Cadence Pin (#679) **freezes one** remaining CD (does not tick). |
| DEFENSE near hood | Next applied hit from Chebyshev **≤ 1** → 0 | Far Hood is **≥ 3**. Sidestep is the **next** hit at any range. Fog Hood **cuts LoS range**. Off Plate (#679) is next **off-turn** hit. |
| CONTROL gait sip | Steal 1 current MP **iff they walked** this turn | Soul Sip has **no** walk gate. Frost / Slow **debuff**. Gait Tax is next **spell** +1 AP if they walked. Still Tax (#679) taxes if they **camped**. |
| TERRAIN cast sill | Occupant cannot resolve **non-physical** spells | Quiet Sill forbids **Strike / physical**. Cast Hold bans **spells until walk**. |
| TERRAIN shove sting | First **forced-move landing** deals 8, then consume | Ingress Mark (#679) detonates on **walk enter**. Exit Sting is **leave**. Enter Mend is **heal**. |
| CONTROL must-step | **All remaining** walks this turn must be Chebyshev **exactly 1** | Inch Stride (#679) is **one** next walk Chebyshev ≤ 1. Must Span is Manhattan **2**. Pair Stride is **one** next walk Manhattan 2. |
| POSITION ally step | Ally lands on a free Chebyshev-1 of the **caster** | Home Step is **caster** → ally. Leash Hook / Ally Reel **pull**. Hinge Step is 90° around the ally. |
| DAMAGE damp sting | Bonus iff leftover **walk MP ≥ 2** | Dry Sting is leftover **AP = 0**. Full Purse is leftover **AP ≥ 3**. Lone Purse (#679) is leftover AP **exactly 1**. Still Plate is leftover **MP = 0 → +RES**. Tapped Plate (#679) is leftover AP 0 → +RES. |
| POSITION pair pace | Caster **and** adjacent ally both translate 1 along caster→ally | Pair Slide translates two **hostiles**. Pair Hinge **rotates**. Twin Span is a **summon**. Mid Fold (#679) is axis **swap**, never owned. |
| CONTROL verse tax | Recasting their **last resolved id** costs +1 AP | Last Mute makes that id **illegal**. Hex Toll / Quiet Hex tax the **next any** spell. Gait Tax keys off **walk**. |
| CONTROL tool hold | Cannot resolve **non-physical** until they Strike | Rite First (#679) is the inverse (cannot Strike until a **spell**). Boot Hold: cannot **walk** until Strike. Strike Hold: cannot Strike until **walk**. Cast Hold: cannot **spell** until walk. Oath Blade: **only** Strike. |
| SUPPORT spent lend | +1 current MP to an ally who **has** walked | Boot Lend requires **unmoved**. Spare Pace is +1 **now**, no gate. Gift Sill is **enter** +MP. |
| SUPPORT mass MP bank | Signature: leftover-MP keep on **every other** body | Court Stretch is mass remaining-CD `×2`. Player never owns this. |
| RESOURCE fourth MP snipe | — | **Held forever** with Ley Toll / Undertow / Sanguine Toll |
| Sixth echo | — | Held for Discovery |
| Full-bar silence | — | Hex of Silence stays `BOSS_ONLY` |
| Mid-RAF splice | — | Held (AGENTS.md) |

**Still open after this wave (do not fill today):** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; a sixth echo id; player-owned Hex of Silence; player-owned About Hinge (stays `BOSS_ONLY`); seven-cell occupy; heal-if-**both force-moved**; bank leftover AP **and** MP on one id. Those stay Wave 11 / Discovery so this pass stays discrete.

---

## 3. Contract with Dynamic Spell Discovery

Coordinate with Discovery (`c26e5a83-…`) and Admin (`4efa22ec-…`). This pass only stamps acquisition so those layers can filter **by field**. Same-day Discovery Wave 10 is **#679** — **do not mint or clone those unique §11 ids**.

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

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 10 ids to `starterSpells` as base. Do **not** land Wave-10 data before Wave-1 ownership split (`SDE-2026-08-31-001`) through Wave-9 (#636 / #646) data.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "pentaspan"` is a **string enum on the config**.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Ally Step / Pair Pace / Spent Lend / Tool Hold / Verse Tax / Cadence Trim **cast** (AP spent) **is** observation, including a blocked landing / no-last-id / unmoved fizzle after AP.
- Both Mend / Near Hood / Must Step / Stride Keep / Gait Sip / Damp Sting **arming** (AP spent) **is** observation. Later consume / convert is **not** a second observe.
- Cast Sill / Shove Sting **paint** is observation. Later walk / force-landing / convert ticks are not a second observe.
- Penta Span **summon** is observation. Later occupy / death is not a second observe.
- Court Keep **arm** is observation for witness-only kits. Never written to owned ids.
- Do not require “see it N times” except where a boss adaptation already does. Wave 10 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.
- Do not stamp `survivor` (Last Ember / Last Ward). #646 left that feat leftover on purpose.

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

**Every live feat and every live challenge id is already a sole spell door or a MULTI child.** Wave 10 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 10 does **not** invent a 16th feat. #590 already stamped leftover `leader_slayer` / `spell_master` MULTI children (Crown Cut / Full Bar). SDE Wave 7 already claimed leftover `hard_1` / `legendary_1` MULTI children (Thin Ward / Clean Blood).

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

**Wave-11 boss extra doors (same-day #663) — do not restamp:** `sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`. Those sheets extra-door **#563** ids only. Do **not** extra-door Wave-10 tactical ids from those sheets.

**Wave-10 SDE extras (#679) — do not restamp:** `inch_gallery` (Inch Stride MULTI; **not** Must Step), `rite_nave` / `reach_nave` / `ash_aisle` / `pin_nave` (observe rooms), `close_precentor` (Pack Close kit), `mid_fold_regent` (Mid Fold kit). `pair_gallery` stays Pair Stride. `march_prefect` stays Must Pace.

**New proposed extra doors for the boss designer (Wave 12 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `both_cantor` first-win | Both Mend MULTI child (observe+win still grants) |
| `stride_bursar` first-win | Stride Keep MULTI child (`keep_bursar` stays Purse Keep) |
| `span_penta` first-win | Penta Span MULTI child (`span_quad` stays Quad Span) |
| `trim_precentor` first-win | Cadence Trim MULTI child (`stretch_precentor` stays Stretch) |
| `court_keep_regent` kit only | Court Keep (`NOT_PLAYER_LEARNABLE`) |

Piece-type observe paths (not feat doors): wisps / cantors for Both Mend; scribes / tempo for Stride Keep; masons / rooks ELITE for Penta Span; scribes / tempo for Cadence Trim; lurkers / pawns for Near Hood; bishops / pawns for Gait Sip; masons / rooks for Cast Sill; masons / pawns for Shove Sting; knights / pawns for Must Step; porters / queens for Ally Step; lurkers / knights for Damp Sting; porters / queens for Pair Pace; hex / bishops for Verse Tax; hex / knights for Tool Hold; buffers / bishops for Spent Lend.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 key names for a different meaning.

`mpCost` stays 0 on every Wave-10 row.

**New keys (Wave 10 only):**

```text
requireCasterWalkedHeal, requireTargetWalkedHeal, bothMendAmount,  // Both Mend
strideKeepCap, strideKeepOnceBattle,                               // Stride Keep — 2, next-turn start
pentaSpanCells,                                                    // Penta Span — 5; plus from origin
trimRemainingCdDelta,                                              // Cadence Trim — −1; 0 stays 0
nearHoodMaxChebyshev,                                              // Near Hood — next hit ≤ 1 → 0
gaitSipAmount, requireTargetWalkedSip,                             // Gait Sip — 1 iff walked
castSillForbidNonPhysical, castSillDuration,                       // Cast Sill — 2 turns
shoveStingDamage, shoveStingDuration,                              // Shove Sting — 8, 2 turns; force-move landing only
mustWalkChebyshev,                                                 // Must Step — next walks == 1
allyStepNeedFreeAdj,                                               // Ally Step — land Chebyshev-1 of caster
requireTargetLeftoverMpMin, dampStingBonus,                        // Damp Sting — leftover MP ≥ 2 → +10
pairPaceNeedAdj, pairPaceDistance,                                 // Pair Pace — 1, shared dir
verseTaxLastIdAp, verseTaxDurationTurns,                           // Verse Tax — +1 on recast of last id
toolHoldForbidNonPhysicalUntilPhysical, toolHoldDuration,          // Tool Hold — cannot tool until Strike
spentLendMp, requireTargetWalkedLend,                              // Spent Lend — +1 MP if walked
courtKeepExcludeCaster                                             // Court Keep
```

If a key is missing, the rider does not fire.

Nested kit-only id (not a player card): none. Penta Span’s kit is **empty**. Do not invent `spell-penta-shard`.

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Both-walk heals are paid in **two bodies that already stepped**, not in extra AP. Stride Keep is paid in **walk tiles you already chose not to spend**.

---

## 5. Proposed spells (Wave 10)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

**Wave-10 tactical ids:** `spell-both-mend`, `spell-stride-keep`, `spell-penta-span`, `spell-cadence-trim`, `spell-near-hood`, `spell-gait-sip`, `spell-cast-sill`, `spell-shove-sting`, `spell-must-step`, `spell-ally-step`, `spell-damp-sting`, `spell-pair-pace`, `spell-verse-tax`, `spell-tool-hold`, `spell-spent-lend`, `spell-court-keep`.

---

### SPELL_ID: `spell-both-mend`

NAME: Both Mend  
ROLE: SUPPORT — heal if caster **and** target both walked  
ACQUISITION: MULTI_SOURCE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: true  
COOLDOWN: 1  
EFFECT: `spellType: "heal"`, `healAmount: 8`, `effectParams: {"requireCasterWalkedHeal":true,"requireTargetWalkedHeal":true,"bothMendAmount":8}`. If **both** caster and target have `walkMpSpentThisTurn ≥ 1`, heal 8 through the existing `heal` helper (honor `healRecv`, no new math). If either has not walked, the heal is 0 — AP is still spent (observation fires). Distinct from Gait Mend (caster **only**), Chase Mend (#590, target **only**), Clash Mend (#646, target **Struck**), Shove Mend (#636, target **force-moved**), Bar Mend (#679, target resolved a **spell**; Strike does not count), Enter Mend (tile enter), Blood Mend (unconditional self). The decision is **both of you step, then take the 8**, or keep one body still and skip the heal.  
DURATION: instant  
SCALING: 8 follows healRecv only. Gate is boolean.  
SYNERGIES: Spare Pace / Spent Lend / Boot Lend (fund **their** walk, not yours); Must Pace (they had to walk to cast anyway). Force-move does **not** arm this flag. `no_healing` / `hard_1`: a **successful** heal (HP actually increased) fails those challenges; a 0-heal fizzle does not.  
COUNTERPLAY: Root / Gait Seal / Must Step so one of you cannot (or will not) walk; Cursed Wound halves the 8.  
POWER_BUDGET: Cheap. 8 is below Mend’s 12 because two walks are the rest of the cost.  
AI_USAGE: `aiHint: "heal_if_caster_and_target_walked"`. Wisps / cantors. Skip if either `walkMpSpentThisTurn` is 0 **or** missing HP < 8. Never walk **only** to enable this if a Strike would kill.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop"], levelZoneMin: 1 }` plus family observe (wisps / cantors) **or** `bossIds: ["both_cantor"]`. First child wins.  
EDGE_CASES: Summon-control walks **do** set `walkMpSpentThisTurn` on that summon. Forced movement must not set it (Shove Mend owns that flag). Challenge: `challengeHealUsedRef` flips only when HP increased. Do not name-check `"Both"`.  
IMPLEMENTATION_COMPLEXITY: LOW — two booleans on the existing heal path.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-both-mend
effectType: heal
effectCategory: heal
spellType: heal
targetType: ally
areaShape: single
apCost: 2
mpCost: 0
healAmount: 8
range: 3
cooldown: 1
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
effectParams: {"requireCasterWalkedHeal":true,"requireTargetWalkedHeal":true,"bothMendAmount":8}
```

---

### SPELL_ID: `spell-stride-keep`

NAME: Stride Keep  
ROLE: SUPPORT — bank leftover walk MP to next turn start  
ACQUISITION: MULTI_SOURCE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 0  
EFFECT: `effectParams: {"strideKeepCap":2,"strideKeepOnceBattle":true}`. Once per battle: at **end of this turn**, snapshot `min(current leftover MP, 2)` and add that amount to current MP at the **start of the caster’s next turn** (still capped at max 20). Does **not** splice the current actor. Distinct from Purse Keep (#636, leftover **AP** cap 3), Haste (+2 **now**), Second Wind (conditional **grant**), Pack Stride (#646, `ENEMY_ONLY` pack **siphon**), Timestep (full bar **now**). The decision is **leave 1–2 walk tiles unspent** so next turn opens with a kite, or spend them now.  
DURATION: pays at next own turn start; once/battle  
SCALING: cap fixed.  
SYNERGIES: Cadence Trim / Stretch on **them** so your recast window is later; Both Mend next turn if you walk the banked 2; Far Sting after the extra close.  
COUNTERPLAY: Soul Sip / Gait Sip the banked MP at their next start; ice / Debt Mark so they cannot spend what they kept.  
POWER_BUDGET: Cheap AP, once/battle, cap 2 — not a second Timestep.  
AI_USAGE: `aiHint: "bank_leftover_mp_if_ge_1_and_next_turn_needs_kite"`. Scribes / tempo. Skip if leftover MP is 0 or they still need to leave a hazard this turn.  
DISCOVERY_ELIGIBILITY: true. Family observe (scribes / tempo) **or** `bossIds: ["stride_bursar"]`. First child wins. Do not restamp `keep_bursar`.  
EDGE_CASES: Snapshot is **end of this turn**, not on confirm. If they die before next start, the bank expires (no transfer). Once/battle is a flag on the **unit**, not a spell-level. Do not write `spellLevelKeys`. Not a queue / wrap / mid-RAF card.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — end-of-turn snapshot + next-turn-start pay. Do not splice the current actor.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-penta-span`

NAME: Penta Span  
ROLE: SUMMONS — five-cell plus occupy  
ACQUISITION: MULTI_SOURCE  
AP_COST: 4  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "pentaspan"`, `summonLifespan: 4`, `freeCells: true`. `effectParams: {"pentaSpanCells":5}`. One combatant id. Footprint is a **plus**: origin cell + four orthogonal Chebyshev-1 cells. All five cells must be `isCellFree` at plant (after vacating nothing). Counts as **five** toward the summon cap. Empty kit (0 damage, `mp: 0`, does not path). Distinct from Twin Span (2 walking posts), Triple Span (3-cell 4-adj chain), Quad Span (2×2, counts as four), Span Guard / Pylon (rigid 2). Live `ENEMY_SUMMON_CAP` is still 2 (`gameConstants.ts` 300) — **this card is illegal to ship until occupy-weight exists or the cap is raised**. The paper hole is still five-cell occupy.  
DURATION: lifespan 4  
SCALING: hpScale with summon rules; footprint fixed.  
SYNERGIES: File Lance / Quiet Sill / Cast Sill around the plus; Open Pit on a spoke so melee cannot step through.  
COUNTERPLAY: Kill the post (one HP pool); occupy one spoke so plant fizzles; Null Brand lockout.  
POWER_BUDGET: Heavy, CD 3, 0 direct damage. Cap-weight is the lid.  
AI_USAGE: `aiHint: "plant_plus_if_five_cells_free_and_seals_file"`. Masons / rooks ELITE. Skip if any of the five cells is blocked. `inferSummonArchetype` must key `summonAI === "pentaspan"`, **never** `name.includes("penta")`.  
DISCOVERY_ELIGIBILITY: true. Elite mason / rook observe+win **or** `bossIds: ["span_penta"]`. First child wins. Do not restamp `span_quad` / `span_triune` / `span_chamberlain`.  
EDGE_CASES: One combatant id, five-cell `isCellFree`. Death frees all five. Do not count as five separate summons for `isSummon` bonus (Pet Cut / Summon Bane still see **one** summon). Player copy counts as five against the **player** summon cap too.  
IMPLEMENTATION_COMPLEXITY: HIGH — footprint occupancy + cap accounting. Blocked on live cap 2.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-trim`

NAME: Cadence Trim  
ROLE: CONTROL — −1 remaining CDs on one hostile  
ACQUISITION: MULTI_SOURCE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"trimRemainingCdDelta":-1}`. For each of the target’s owned ids, if remaining CD ≥ 1, set remaining = remaining − 1 (floor 0). Zeros stay 0. Once/battle flags and spell levels are **untouched**. Distinct from Cadence Shave (#646, **ally** −1 all remaining), Cadence Stall (#590, **+1** all remaining), Cadence Stretch (#636, hostile remaining **×2**), Cadence Flush (ally all → 0), Cadence Crack (hostile **highest** → 0), Cadence Pin (#679, **freezes one** remaining CD — it does **not** tick, not a −1). The decision is **shave a 3-turn Inferno into a 2** so they recast sooner — usually **worse for you**, so the card is a tempo **gift** you use on a **summon** you want to recast, or a hostile whose lock you **want** to expire so they waste AP now. Primary player use: trim **your own summon** if `targetType` later allows ally — **this row is enemy-only target**. Player uses it to force a queen to recast Inferno into Quiet Hex / Verse Tax.  
DURATION: instant  
SCALING: delta fixed.  
SYNERGIES: Verse Tax / Last Mute on the same id after they recast; Hex Toll the recast; Goad so the recast is the swing you wanted.  
COUNTERPLAY: Sit on CD-0 tools; Cadence Stall yourself after; do not show a 1-turn lock into a Trim turn.  
POWER_BUDGET: Cheap control, 0 damage, CD 2. Power is tempo, not a number.  
AI_USAGE: `aiHint: "trim_hostile_if_remaining_ge_2_and_recast_hurts"`. Scribes / tempo. Skip if no remaining ≥ 2. Enemy caster: the hostile is **player-side**.  
DISCOVERY_ELIGIBILITY: true. Family observe (scribes / tempo) **or** `bossIds: ["trim_precentor"]`. First child wins. Do not restamp `stretch_precentor` / `flush_precentor` / `stall_nave`.  
EDGE_CASES: Missing key → no rewrite. Do not write `spellLevelKeys`. Inferno remaining 1 → 0 (legal next turn).  
IMPLEMENTATION_COMPLEXITY: LOW — map remaining locks on one unit.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-near-hood`

NAME: Near Hood  
ROLE: DEFENSE — next melee-band hit misses  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: `effectCategory: "defense"`. `effectParams: {"nearHoodMaxChebyshev":1}`. The next **damaging** instance that would call `dealDamage` against this unit from Chebyshev ≤ 1 **misses**: no HP loss, no absorb chew, no DoT apply from that hit. Then the charge is consumed. Hits from Chebyshev ≥ 2 do **not** consume and **do** land. Distinct from Far Hood (#636, ≥ 3 → 0), Sidestep Ward (any range, one miss), Fog Hood (cuts **their** LoS range), Watch Mute (#646, next **overwatch snap** is 0), Off Plate (#679, next **off-turn** hit). Timeout: `buffDuration: 2`.  
DURATION: until 1 qualifying miss or 2 turns, whichever first  
SCALING: band fixed.  
SYNERGIES: Root / Gait Seal / Must Step so they cannot leave 1; Goad so the swing they must throw is melee.  
COUNTERPLAY: Step to Chebyshev 2+ and poke (Far Sting / Frost); throw a 0-damage control first (that does **not** consume); wait 2 turns.  
POWER_BUDGET: Cheap, long CD, 0 damage. One melee swing.  
AI_USAGE: `aiHint: "near_hood_if_hostile_adjacent_and_can_strike"`. Lurkers / pawns ELITE. Skip if already Far Hood / Sidestep armed.  
DISCOVERY_ELIGIBILITY: true. `eliteOnly: true`, `pieceTypes: ["pawn","knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Consume in the incoming-hit pipeline **before** `dealDamage`, same family as Far Hood / Sidestep. Do not add a percent miss inside `combatMath.ts`. Lava/spikes do **not** consume (keep for spell-hits). AoE: only the instance whose origin is ≤ 1 can consume.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — Chebyshev gate on the existing miss-charge pipeline.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gait-sip`

NAME: Gait Sip  
ROLE: CONTROL — steal 1 MP if they walked  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No HP damage. `effectCategory: "cc"`. `effectParams: {"gaitSipAmount":1,"requireTargetWalkedSip":true}`. If target `walkMpSpentThisTurn ≥ 1` **and** `currentMp ≥ 1`, subtract 1 from **current** MP (not max) and add 1 to caster **current** MP this turn, capped at max 20. If they have not walked, or MP is 0, fizzle rider (AP still spent). Distinct from Soul Sip (no walk gate), Frost / Slow (debuff duration), Haste (grant), Gait Tax (#646, next **spell** +1 AP if they walked), Still Tax (#679, next spell +1 AP if they **camped**), Pack Stride (pack siphon, never owned).  
DURATION: instant (current-turn MP only)  
SCALING: amount fixed.  
SYNERGIES: Must Pace / Must Span so they had to walk; Ley Toll on you (stolen MP pays the 2-cost **once MP debit exists** — this card itself stays `mpCost: 0`).  
COUNTERPLAY: Stand still; sit at 0 MP; walk **after** the sip window (their next turn).  
POWER_BUDGET: Cheap control, 0 damage, CD 2.  
AI_USAGE: `aiHint: "steal_mp_if_target_walked_and_mp_ge_1"`. Bishops / pawns. Skip if `walkMpSpentThisTurn` is 0.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","pawn"]`, `levelZoneMin: 1`  
EDGE_CASES: Do not write `debuffStat: "mp"`. Summons with 0 max MP: fizzle. Challenge: not a heal, not AP.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cast-sill`

NAME: Cast Sill  
ROLE: TERRAIN — occupant cannot resolve non-physical spells  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell for 2 turns. `effectParams: {"castSillForbidNonPhysical":true,"castSillDuration":2}`. A unit occupying the cell cannot confirm a spell with `isPhysical !== true` (Frost, Inferno, heals, summons — reject `no_cast_sill`). Strike / `physical_attack` / `isPhysical: true` stays legal. Distinct from Quiet Sill (#636, occupant cannot resolve Strike / physical), Cast Hold (#590, **unit** cannot spell until they walk), Oath Blade (unit may **only** Strike), Ward Cell. Combined with Quiet Sill on the **same** cell: occupant cannot Strike **and** cannot spell — that is an intended last-writer **stack**, not a name table. Last writer on the cell vs Barrier / Quiet Sill: **both paint keys may coexist**; execute checks each flag.  
DURATION: 2 turns  
SCALING: duration fixed.  
SYNERGIES: Goad / Dummy Post so they must act from the cell; Quiet Sill on a neighbor so peeling is also brick; Near Hood so the Strike they have left misses; Tool Hold so they cannot peel with a tool until they Strike — Quiet Sill on the same cell then bricks the peel.  
COUNTERPLAY: Step off; Barrier the cell; Strike from it.  
POWER_BUDGET: Standard utility.  
AI_USAGE: `aiHint: "paint_cast_sill_if_target_holds_non_physical_and_must_occupy"`. Masons / rooks. Skip if the player’s bar is all Strike.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Preview, live gate, and execute share one occupy-flag reader. Walk onto the cell is legal. Forced movement onto it is legal. Missing key → no forbid.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupy-flag on the confirm gate, not a name table.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-shove-sting`

NAME: Shove Sting  
ROLE: TERRAIN — first forced-move landing deals 8  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell for 2 turns. `effectParams: {"shoveStingDamage":8,"shoveStingDuration":2}`. The first unit that **lands** on the cell via **forced movement** (`forcedMovedThisTurn` written: push / pull / swap / hinge / pair-slide / pair-pace / ally-step / home-step dest / gate / teleport landing) takes 8 through existing `dealDamage` (RES+SR), then the paint consumes. **Walk dest does not sting** — that hole is Ingress Mark (#679). Standing on it at paint time does **not** sting (landing-only). Distinct from Ingress Mark (any **walk enter** detonates), Exit Sting (#636, first **leave**), Enter Mend (#563, first enter **heals** 6), Tripwire (hidden + root), Caltrop (spike hazard), Glyph Snare (enter-slow), Fuse (delayed tile, occupancy-at-tick), Shove Mend (heal-if-force-moved, no paint), Shove Face (push + `currentView`). The decision is **set a relocate dest, then shove them onto it**, or they walk the cell for free.  
DURATION: 2 turns or 1 consume  
SCALING: 8 follows dmg%.  
SYNERGIES: Pair Pace / Ally Step / Pair Slide / Home Step / Court Shove onto the cell; Must Step does **not** shove them — it only boxes **walks**, so Shove Sting still needs a relocate.  
COUNTERPLAY: Walk the cell (Ingress Mark’s hole); Barrier the cell; do not get force-moved onto it.  
POWER_BUDGET: Standard. 8 is below Frost; consume + CD 2. Relocate is the rest of the cost.  
AI_USAGE: `aiHint: "paint_shove_sting_on_forced_landing"`. Masons / pawns. Skip if no legal relocate dest exists this turn. Never paint a cell they will **walk** onto unless a relocate is also queued.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Twin-gate / teleport landing **does** sting (relocate). Walk enter **does not**. Paint is observation; the later 8 is **not** a second observe. Challenge: HP loss through `recordChallengeDamageTaken` if treated as a spell-hit (it is). Dest hazard **also** ticks (MIMA enter gap — this card is not license to leave that broken). Missing key → no sting.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — landing hook gated on `forcedMovedThisTurn` / relocate resolvers, **not** the walk stepper. Do not share Ingress Mark’s walk-enter reader.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-must-step`

NAME: Must Step  
ROLE: CONTROL — remaining walks must be Chebyshev 1  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: No damage. `effectParams: {"mustWalkChebyshev":1}`. For the rest of **this turn**, the target may only walk to cells at Chebyshev **exactly 1** from their current cell (adjacent 8-dir). Walk preview and execute both reject other dests. Forced movement (push/pull/swap/slide/gate/ally-step/pair-pace) **is allowed**. Distinct from Must Span (#636, remaining walks Manhattan **exactly 2**), Pair Stride (#646, **one** next walk Manhattan 2, may persist 2 turns), Inch Stride (#679, **one** next walk Chebyshev **≤ 1**), Must Pace (#525, must walk **to cast**), Diag Lock (diagonal shape), Rank Lock (axis).  
DURATION: rest of current turn  
SCALING: distance fixed.  
SYNERGIES: Shove Sting / Open Pit / Quiet Sill on every Chebyshev-1 (walk onto Shove Sting is **free** — Ingress Mark owns walk-enter; Shove Sting still needs a relocate); Near Hood after they are stuck adjacent; Gait Sip after they take the 1-step.  
COUNTERPLAY: Teleport / Swap / wait until their next turn; the lock does not spend their MP for them.  
POWER_BUDGET: Standard control, 0 damage, CD 3.  
AI_USAGE: `aiHint: "must_step_if_adjacent_paints_exist"`. Elite knights / pawns. Skip if the player is already boxed with 0 free Chebyshev-1.  
DISCOVERY_ELIGIBILITY: true. `eliteOnly: true`, `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 2`  
EDGE_CASES: Summon-control walks honor the lock. A 2-step path preview must not highlight illegal dests (preview parity). Missing param → no lock. Cleanse strips it (`cleanseTypes` include `"mustWalkChebyshev"`).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — walk stepper + preview. Do not touch turn order.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-ally-step`

NAME: Ally Step  
ROLE: POSITION — ally lands adjacent to the caster  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: **Not** `isSwap`. `effectParams: {"allyStepNeedFreeAdj":true}`. Relocate the targeted living ally onto the nearest **free** Chebyshev-1 of the **caster** (4-adj first, then diagonals, then lowest `(x,y)`). Caster does not move. If no free adjacent cell, fizzle (AP spent). Distinct from Home Step (#636, **caster** steps to a free Chebyshev-1 of the ally), Leash Hook / Ally Reel (pull along a line toward caster), Hinge Step (90° around the ally), Morrow Step (delayed blink), Relay Dash (self walk 2). The decision is **bring them to you**, not go to them.  
DURATION: instant  
SCALING: none.  
SYNERGIES: Split Mend / Both Mend after they land (if they **walked** this turn the walk flag is already set — this relocate is **force-move**, so Shove Mend arms, Both Mend does **not** unless they also walked). Quiet Sill / Cast Sill / Shove Sting on a caster-adj cell you choose by occupying the others.  
COUNTERPLAY: Occupy all eight caster-adj cells; Self Anchor / Body Sill on the ally; Grounded Lock / Blink Seal if those filter `effectCategory: "relocate"`.  
POWER_BUDGET: Standard utility, 0 damage, CD 2.  
AI_USAGE: `aiHint: "step_ally_adj_caster_if_unsafe_or_to_heal_range"`. Porters / queens. Skip if already Chebyshev ≤ 1 or no free adj. Enemy caster: the ally is **enemy-side**.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","king"]`, `levelZoneMin: 1`  
EDGE_CASES: Do not call `swapPositions`. Dest hazard **must tick**. `forcedMovedThisTurn` = true on a successful relocate; `walkMpSpentThisTurn` must **not** increment. Death-realm portal guards do **not** fire.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy dest, not `isSwap`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-damp-sting`

NAME: Damp Sting  
ROLE: DAMAGE conditional — bonus if leftover walk MP ≥ 2  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Deal 8. Then if the target’s **current leftover MP ≥ 2**, deal `dampStingBonus` (10) as a second existing `dealDamage` call (two hits, two Mark chances if the tile is marked). `effectParams: {"requireTargetLeftoverMpMin":2,"dampStingBonus":10}`. Distinct from Dry Sting (#636, leftover **AP = 0**), Full Purse (#646, leftover **AP ≥ 3**), Lone Purse (#679, leftover AP **exactly 1**), Still Plate (#646, leftover **MP = 0 → +RES**), Tapped Plate (#679, leftover AP 0 → +RES), Empty Plate (0 leftover → +RES). The decision: poke the kiter who **banked** walk, or they spend down to 1 MP and eat only 8.  
DURATION: instant  
SCALING: 8 and 10 follow dmg%.  
SYNERGIES: Stride Keep (they just banked); Haste (they have MP to tax); Gait Sip first drops them — **order matters**: sip then sting can **deny** the bonus (that is the play).  
COUNTERPLAY: Spend down to 0–1 MP before the sting; sit at 0; Slow so leftover is already 0.  
POWER_BUDGET: Standard. 8 if they spent (worse than Frost). 18 if they banked (Frost-adjacent, two hits).  
AI_USAGE: `aiHint: "damp_if_target_leftover_mp_ge_2"`. Lurkers / knights. If leftover MP < 2 and Strike is in kit at range 1, skip.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 1`  
EDGE_CASES: Leftover is **current MP at resolve**, not “max − spent”. Missing param → 8 only. Both hits are spell-hits (`recordChallengeDamageTaken`).  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pair-pace`

NAME: Pair Pace  
ROLE: POSITION — caster and adjacent ally translate 1 together  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 1  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: **Not** `isSwap`. `effectParams: {"pairPaceNeedAdj":true,"pairPaceDistance":1}`. Target a living ally at Chebyshev **exactly 1**. Translate **both** caster and ally 1 cell in the caster→ally direction (sign of `(tx-cx, ty-cy)` stepped to a unit axis; if the vector is diagonal, step diagonally). Both destination cells must be `isCellFree` after vacating the pair. If dests blocked, fizzle (AP spent). Distinct from Pair Slide (#636, two **hostiles** translate, caster stays), Pair Hinge (90° rotate two hostiles), Pair Stride (#646, **one** next walk Manhattan 2), Mid Fold (#679, axis **swap**, never owned), Twin Span (summon occupy), Home Step / Ally Step (one body). The decision is **march as a pair onto paint**, or stay.  
DURATION: instant  
SCALING: none.  
SYNERGIES: Shove Sting / Fuse / Cinder / Open Pit on the dests; Both Mend after if they **also** walked this turn (this translate is force-move — Both Mend still needs walk flags from **earlier** walks). Shove Mend **does** arm.  
COUNTERPLAY: Occupy a dest; Self Anchor on either body; stay Chebyshev ≥ 2.  
POWER_BUDGET: Standard utility, 0 damage, CD 2.  
AI_USAGE: `aiHint: "pace_with_adj_ally_onto_paint_or_off_file"`. Porters / queens. Skip if no Chebyshev-1 ally or a dest is blocked.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","king"]`, `levelZoneMin: 1`  
EDGE_CASES: Same dest-hazard law as Pair Slide (must tick). Do not call `swapPositions`. `forcedMovedThisTurn` on **both**. Diagonal caster→ally with a blocked dest fizzles the whole card (no partial). Range 1 Chebyshev.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy pair translate including the caster.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-verse-tax`

NAME: Verse Tax  
ROLE: CONTROL — recasting their last id costs +1 AP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"verseTaxLastIdAp":1,"verseTaxDurationTurns":2}`. Read the target’s **last successfully resolved spell id** (the id that last applied `castResultAppliesCooldown` / spent AP as `kind: "cast"`). For 2 of **their** turns or until they successfully spend on **that same id**, whichever first, that id costs `apCost + 1`. Other ids are untaxed. If they have no last id (have not cast this battle), fizzle rider (AP spent). Distinct from Last Mute (#636, that id is **illegal** 1 turn), Hex Toll / Quiet Hex (next **any** spell +1), Gait Tax (next spell +1 **if they walked**), Cadence family (remaining CD rewrite).  
DURATION: 2 of their turns or 1 taxed recast  
SCALING: tax fixed.  
SYNERGIES: Cadence Trim so the recast is **sooner** and still taxed; Last Mute is the other fork (ban vs tax); `hard_3` (≤8 AP/turn) — their 4-cost Inferno becomes 5.  
COUNTERPLAY: Cast a different id; wait 2 turns; Cleanse if strip lists include `"verseTaxLastId"` via `cleanseTypes`, not via name.  
POWER_BUDGET: Cheap control, 0 damage.  
AI_USAGE: `aiHint: "tax_last_id_if_cost_ge_3"`. Hex / bishops. Skip if no last id or last id is Strike (2+1=3 is still cheap — skip unless that is their only tool).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Tax applies inside `executeCastAttempt` **after** `applyApCost` map modifiers, **only** if `spell.id === lastResolvedId`. If they cannot pay, the cast rejects (`no_ap`) and the tax **remains**. Fizzle that spent AP consumes the tax. Walk / potions do not consume it. Strike / `physical_attack` **is** a last id if that is what they resolved.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — last-id stamp already needed by Last Mute; this reuses it as a tax instead of a ban.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-tool-hold`

NAME: Tool Hold  
ROLE: CONTROL — cannot resolve non-physical until they Strike  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: No damage. `effectParams: {"toolHoldForbidNonPhysicalUntilPhysical":true,"toolHoldDuration":2}`. For 2 of the target’s turns or until they successfully spend AP on Strike / `physical_attack` / `isPhysical: true`, whichever first, they cannot confirm a spell with `isPhysical !== true` (Frost, Inferno, heals, summons — reject `no_tool_hold`). Distinct from Rite First (#679, **inverse**: cannot Strike until a **spell**), Boot Hold (#646, cannot **walk** until they Strike), Strike Hold (#533, cannot Strike until they **walk**), Cast Hold (#590, cannot **spell** until they **walk**), Verse First (#590, this **id** before other spells), Oath Blade (#463, may **only** Strike), Quiet Sill (tile forbids physical), Cast Sill (tile forbids non-physical). The decision: they spend 2 AP on Strike to unlock tools, or sit.  
DURATION: 2 of their turns or 1 physical spend  
SCALING: duration fixed.  
SYNERGIES: Quiet Sill so the Strike they need is also illegal on that cell; Cast Sill stacks with the unit lock while they occupy it (redundant on the cell, still bricks peel-off); Near Hood after they peel with Strike.  
COUNTERPLAY: Strike / Attack Nearest; wait 2 turns; Cleanse (`cleanseTypes` include `"toolHold"`).  
POWER_BUDGET: Standard control, 0 damage, CD 3.  
AI_USAGE: `aiHint: "tool_hold_if_target_bar_needs_non_physical_first"`. Hex / knights. Skip if their bar is already all physical (the hold is a no-op) or they have no Strike / `isPhysical` to peel with except waiting.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["knight","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Attack Nearest / sprite-click Strike **does** peel (they paid AP on physical). A non-physical **fizzle is still illegal** while the hold is up (they cannot peel with a failed Frost). Walk does not peel. Missing key → no hold.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — confirm gate + Attack Nearest parity. Do not name-check `"Tool"` / `"Verse"`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-spent-lend`

NAME: Spent Lend  
ROLE: SUPPORT — +1 MP to an ally who already walked  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"spentLendMp":1,"requireTargetWalkedLend":true}`. If the target has `walkMpSpentThisTurn ≥ 1`, add 1 to **current** MP this turn, capped at max 20. If they have not walked, fizzle rider (AP spent). Distinct from Boot Lend (#636, +1 MP if **unmoved**), Spare Pace (#525, +1 **now**, no gate), Gift Sill (#533, **enter** +MP), Leftover Lend (dump **your AP**), Haste (+2 no gate). The decision: fund a **second** step after they already committed one, or they camped and you wasted 2 AP.  
DURATION: instant  
SCALING: amount fixed.  
SYNERGIES: Both Mend (they walked; you may still need to walk); Must Span (Manhattan 2 is expensive — the +1 finishes it); Gait Mend on **them** if they are the caster of that card.  
COUNTERPLAY: Root them before they walk; Gait Sip the extra 1; do not walk.  
POWER_BUDGET: Cheap, CD 2, 0 damage.  
AI_USAGE: `aiHint: "lend_mp_if_ally_already_walked_and_needs_one_more"`. Buffers / bishops. Skip if `walkMpSpentThisTurn` is 0 or they are already at max MP.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Targeting ally already allows self (`targeting.ts` 184–189). Self-cast after a walk is legal. Do not grant if they only force-moved.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-keep`

NAME: Court Keep  
ROLE: SUPPORT — mass leftover-MP bank  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `effectParams: {"strideKeepCap":2,"courtKeepExcludeCaster":true}`. For every **other** living combatant, apply the Stride Keep rewrite (snapshot leftover MP at **end of this turn**, cap 2, pay at **that unit’s** next turn start). Caster does not bank. Distinct from Court Stretch (mass remaining-CD `×2`), Court Hinge / Shove / Fold, Pack Stride (siphon leftover walk MP, never owned), Pack Tithe (leftover **AP** siphon). Player never owns this.  
DURATION: pays at each other unit’s next start  
SCALING: cap 2 fixed.  
SYNERGIES (as a witness puzzle): Damp Sting next round against banked kites; Gait Sip the banks.  
COUNTERPLAY: Spend MP to 0 before the snapshot; die before next start.  
POWER_BUDGET: Signature 6 / CD 4.  
AI_USAGE: `aiHint: "court_keep_if_two_plus_others_have_leftover_mp_ge_1"`. Kit-only on `court_keep_regent`. Skip if fewer than two others have leftover MP ≥ 1.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. Observation may still record for telemetry; **grant never fires**. `usableByPlayer: false`, `usableByEnemy: true`.  
EDGE_CASES: Same once/battle-untouched and cap-2 laws as Stride Keep, but Court Keep itself is **not** once/battle (CD 4 is the lid). Do not write owned ids. Not a queue splice.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — map-wide loop of the Stride Keep helper.  
STATUS: PROPOSED

---

## 6. Combination matrix (intended, not name-wired)

Interactions resolve from **fields and flags**, never from `spell.name`.

| Field / flag | Combines with | Intended decision |
| :--- | :--- | :--- |
| `walkMpSpentThisTurn` on **both** | Both Mend | Both step, then 8 — or skip |
| `strideKeepCap` | Damp Sting / Gait Sip next turn | Bank 2, or spend them |
| `pentaSpanCells` | File Lance / Cast Sill around the plus | Seal a corridor for five cap |
| `trimRemainingCdDelta` | Verse Tax / Inferno remaining 3 | Force a taxed recast |
| `nearHoodMaxChebyshev` | Must Step / Root | They cannot leave 1, swing misses |
| `requireTargetWalkedSip` | Must Pace / Must Span | They had to walk; you take the MP |
| `castSillForbidNonPhysical` | Quiet Sill / Tool Hold | Tile forbids tools; unit cannot tool until Strike — peel off the cell, or sit |
| `shoveStingDamage` | Pair Pace / Ally Step / Court Shove | The landing of a **relocate** is the 8; **walk** is free (Ingress Mark) |
| `mustWalkChebyshev` | Shove Sting on adj | Walks are boxed to 1; Shove Sting still needs a relocate onto the paint |
| `allyStepNeedFreeAdj` | Shove Mend (force-move) vs Both Mend (walk) | Bring them, or go to them (Home Step) |
| `requireTargetLeftoverMpMin` | Stride Keep / Haste | Punish the bank |
| `pairPaceNeedAdj` | Shove Sting dests | March as a pair onto force-landing paint |
| `verseTaxLastIdAp` | Cadence Trim | Sooner recast, still +1 AP |
| `toolHoldForbidNonPhysicalUntilPhysical` | Quiet Sill / Cast Sill | Cannot tool until Strike; tile may also forbid that Strike |
| `spentLendMp` | Both Mend / Must Span | Fund the second step |
| `courtKeepExcludeCaster` | Two kite queens | Signature window |

Do **not** implement a name table that says “if Both Mend and Pair Pace then…”. If the flag is missing, the rider does not fire.

---

## 7. Recommended unlock order (pacing)

Discovery still inert. This is the **intended** observe curve once the ownership split lands, not a live drop table.

| Band | Ids | Why this order |
| :--- | :--- | :--- |
| Early observe (zone 1) | Gait Sip, Spent Lend, Shove Sting, Damp Sting, Cast Sill | Cheap decisions on walk MP, leftover MP, and paint |
| Mid observe | Both Mend, Ally Step, Pair Pace, Verse Tax, Tool Hold | Need two walk flags / last-id / physical already in the kit |
| Elite / MULTI | Must Step, Near Hood, Penta Span, Cadence Trim, Stride Keep | Geometry and economy lids |
| Witness only | Court Keep | Never owned |

Do not append these to `starterSpells`.

---

## 8. Implementation notes (for a later, explicit implementation PR)

1. **No new `mpCost > 0`.** Ley Toll / Undertow / Sanguine Toll remain the only paper spenders.  
2. **No new facing card.** Wave 5 still owns `currentView` after a battle-walk writer exists. Overworld wander still writes `currentView` (WX 6924–6938); battle walks still do not.  
3. **No new queue / wrap / mid-RAF card.** Stride Keep / Court Keep pay at **next own turn start**. Do not splice the current actor.  
4. **Ally Step / Pair Pace** are occupancy dests, not `isSwap`. Do not call `swapPositions`.  
5. **Cadence Trim** rewrites remaining locks only (−1, floor 0). Do not write spell levels or once/battle flags.  
6. **Both Mend** flips `challengeHealUsedRef` only when player-side HP actually increased.  
7. **Near Hood** consumes in the incoming-hit pipeline **before** HP write, and **only** if origin Chebyshev ≤ 1. Do not add a percent miss inside `combatMath.ts`.  
8. **Must Step / Cast Sill / Tool Hold** are walk-dest / occupy-flag / confirm-gate filters. Forced movement stays legal except where a relocate lock already filters `effectCategory: "relocate"`.  
9. **Penta Span** uses `summonAI: "pentaspan"`. Empty kit. Counts as **five**. Never parse `"Penta Span"`. One combatant id, plus footprint. **Do not ship while `ENEMY_SUMMON_CAP === 2` without occupy-weight.**  
10. **Shove Sting / Cast Sill** are paint. Later ticks are not a second observe. Shove Sting’s 8 fires on **relocate landing only**, never on walk dest (Ingress Mark).  
11. **Stride Keep** snapshots leftover MP at **end of this turn**, pays at **next turn start**. Not a queue splice.  
12. Recap grant uses the reward funnel + `commitSpellDiscoveries` / `unlockOwnedSpell`, not `updateCharacter`.  
13. Do not append these ids to `starterSpells` as `isBaseSpell`. Add to `SPELL_ID_CATALOG` **only when implemented**, together with `spellData.ts` and kits.  
14. Extract helpers. Do not grow `WorldExploration.tsx` (19,213 lines).  
15. Do not touch RAF, map generation, turn order, or damage math.  
16. Write `walkMpSpentThisTurn` from successful walk MP spends only. Force-move resolvers write `forcedMovedThisTurn` (Wave 9) and must **not** increment walk MP.

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
- No restamp of Wave-6…9 tactical extra doors (`oath_censor` … `court_stretch_regent`).  
- No restamp of Wave-8 / Wave-9 / Wave-10 SDE extras (`about_hinge_regent`, `odd_gallery`, `pair_gallery`, `knight_fold_regent`, `inch_gallery`, `close_precentor`, `mid_fold_regent`, …).  
- No restamp of any live 19 first-win.  
- No wiring of `CharacterStats.evasion` as a percent.  
- No clone of Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Veil, Mirror / Reflect.  
- No 12-AP Void Collapse clone.  
- No third File Lance / Blood Tithe.  
- No SDE Wave-9 ids (`spell-pair-stride`, `spell-clash-mend`, `spell-cadence-shave`, `spell-pack-stride`, `spell-knight-fold`, …). That catalog already landed as #646.  
- No SDE Wave-10 ids (`spell-inch-stride`, `spell-rite-first`, `spell-ingress-mark`, `spell-bar-mend`, `spell-cadence-pin`, `spell-off-plate`, `spell-mid-fold`, …). That catalog is #679. Do **not** mint `spell-enter-sting` (Ingress Mark) or `spell-verse-hold` (Rite First). If a later edit of #679 claims one of this catalog’s tactical ids, **SDE wins**.  
- No restamp of Wave-10 SDE extras (`inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`).

---

## 10. Proposal index

| ID | Acquisition | Complexity | Primary hole filled |
| :--- | :--- | :--- | :--- |
| `spell-both-mend` | MULTI_SOURCE | LOW | Heal if caster **and** target walked |
| `spell-stride-keep` | MULTI_SOURCE | MEDIUM | Carry leftover walk MP to next turn start |
| `spell-penta-span` | MULTI_SOURCE | HIGH | Five-cell plus occupy (cap-blocked while summon cap is 2) |
| `spell-cadence-trim` | MULTI_SOURCE | LOW | −1 remaining CDs on one hostile |
| `spell-near-hood` | ELITE | MEDIUM | Next hit from Chebyshev ≤ 1 is 0 |
| `spell-gait-sip` | ENEMY_DISCOVERY | LOW | Steal 1 MP iff they walked |
| `spell-cast-sill` | ENEMY_DISCOVERY | MEDIUM | Occupant cannot resolve non-physical |
| `spell-shove-sting` | ENEMY_DISCOVERY | MEDIUM | First **forced-move landing** deals 8 |
| `spell-must-step` | ELITE | MEDIUM | Next walks must be Chebyshev 1 |
| `spell-ally-step` | ENEMY_DISCOVERY | MEDIUM | Ally lands adjacent to the caster |
| `spell-damp-sting` | ENEMY_DISCOVERY | LOW | Bonus if leftover walk MP ≥ 2 |
| `spell-pair-pace` | ENEMY_DISCOVERY | MEDIUM | Caster + adj ally translate 1 together |
| `spell-verse-tax` | ENEMY_DISCOVERY | MEDIUM | Recast of last id costs +1 AP |
| `spell-tool-hold` | ENEMY_DISCOVERY | MEDIUM | Cannot resolve non-physical until Strike |
| `spell-spent-lend` | ENEMY_DISCOVERY | LOW | +1 MP to an ally who already walked |
| `spell-court-keep` | NOT_PLAYER_LEARNABLE | MEDIUM | Mass leftover-MP bank |

All STATUS: **PROPOSED**.

**Held, not filled:** mid-RAF splice; fourth `mpCost > 0` walk snipe; sixth echo id; player-owned Hex of Silence; player-owned About Hinge; seven-cell occupy; heal-if-**both force-moved**; bank leftover AP **and** MP on one id.

---

## 11. Source map (read-back)

| Topic | File | Lines |
| :--- | :--- | :--- |
| Live 32-id catalog | `src/frontend/src/data/spellData.ts` | 9–691 |
| Forced `isBaseSpell` | `src/frontend/src/components/WorldExploration.tsx` | 2395–2408 |
| Owned union | `src/frontend/src/components/WorldExploration.tsx` | 2410–2440 |
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

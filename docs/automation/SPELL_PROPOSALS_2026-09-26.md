# Spell and Tactical Mechanics — Design Pass 2026-09-26

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1 law [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) through still-open Wave 8 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-0978/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-25.md) (#590)
- Spell, Discovery & Achievement Admin — still-open #570
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) … still-open Wave 8 [`SPELL_PROPOSALS_2026-09-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-0b8e/docs/automation/SPELL_PROPOSALS_2026-09-25.md) (#563)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); extra doors through #367 / #406 / #474 / #518; tactical extras #463 / #525 / #563

This is **Wave 9**. Wave 8 (#563) filled caster-walk heal, 90° hostile pair-hinge, ally all-CD flush, isolated poke, delayed plate, gait seal, diagonal-only walk, brick shift, delayed tile heal, return-half poke, leftover-AP dump, dummy post, enter heal, unit next-hit amp, split heal, and a mass pair-hinge signature.

**Wave 8 explicitly deferred eight holes.** Same-day Discovery Wave 8 (#590) then claimed three of those as **SDE unique ids** (do not clone):

| Wave-8 leftover | Owner after #590 | This pass |
| :--- | :--- | :--- |
| Heal if **target walked** | SDE `spell-chase-mend` | Do not clone. This pass fills heal if **target was force-moved** (not walk MP). |
| +1 **all** remaining CDs | SDE `spell-cadence-stall` | Do not clone. This pass **doubles** remaining CDs (`×2`, zeros stay 0). |
| 180° of **player-side** pair | SDE `spell-about-hinge` (`BOSS_ONLY`) | Do not clone. Hostile 180° around a pair midpoint **is** Pawn Trade (they swap). Not re-proposed. |
| Four-cell occupy | Still open | **This pass:** Quad Span |
| Mid-RAF splice | Held (AGENTS.md) | Still held |
| Fourth `mpCost > 0` walk snipe | Held (Ley Toll / Undertow / Sanguine Toll) | Still held |
| Sixth echo id | Held | Still held |
| Player-owned Hex of Silence | Held (`BOSS_ONLY`) | Still held |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after the reserved set **and** after #590. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

Discovery Wave 9 may ship the same day — **do not mint SDE ids here**. Stamp family / observe metadata onto Wave-9 **tactical** ids only. If a same-day SDE file claims one of these ids, **SDE wins**; rename is not this pass’s job (same rule Wave 8 used vs #590).

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
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** | Unused | Shoulder Bash, Hook Line, Shove Face, Pair Slide (this pass reads a **new** `forcedMovedThisTurn` flag those callers must set) |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, WX 9389–9401 → `swapPositions`) | Swap | Pawn Trade / Ward Interpose / Home Step is **not** `isSwap` |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, never this set |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire |
| Walk / forced-move flags | Paper `walkMpSpentThisTurn` (Waves 6–8). **No** `forcedMovedThisTurn` | Absent | **This pass: Shove Mend / Gait Wick / Quiet Sill / Exit Sting / Must Span** |
| Four-cell occupy | Twin Span = 2; Triple Span = 3 | Absent | **This pass: Quad Span** |
| Carry leftover AP across turns | Leftover dies at turn end | Timestep is full **now** | **This pass: Purse Keep** (cap 3, once/battle, next-turn start — **not** a queue splice) |
| CD multiply | Stall is **+1** all; Flush zeroes ally; Crack zeroes highest | Inferno CD 3 is the only live lock | **This pass: Cadence Stretch (`×2` remaining)** |

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

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` (tactical W2 **and** Discovery W2); `spell-blood-tithe` (tactical W2 pet sacrifice **versus** Discovery W2 HP→AP). Wave 9 does not add a third.

**Do not alias** Shove Mend ↔ Gait Mend / Chase Mend / Enter Mend / Split Mend / Mend Wick / Shove Face / Blood Mend; Cadence Stretch ↔ Cadence Stall / Flush / Crack / Break / Theft / Lend; Quad Span ↔ Twin Span / Triple Span / Span Guard / Span Pylon / Void Span; Gait Wick ↔ Gait Mend / Gait Seal / Pit Wick / Mend Wick / Wick Bite / Fuse Tile / Boot Sting / Cast Mark / Wound Mark; Dry Sting ↔ Post Sting / Still Brand / Empty Plate / Empty Purse / Lone Sting / Wall Sting; Home Step ↔ Hinge Step / Relay Dash / Morrow Step / Cover Step / Ghost Step / Leash Hook / Ally Reel; Must Span ↔ Must Pace / Even Stride / Odd Stride / Walk Toll / Diag Lock / Rank Lock; Far Hood ↔ Fog Hood / Tick Hood / Sidestep Ward / Far Sting / Far Watch; Boot Lend ↔ Spare Pace / Gift Sill / Leftover Lend / Cadence Lend / Tempo Gift; Quiet Sill ↔ Quiet Hex / Strike Hold / Oath Blade / Verse First / Gift Sill / Pet Sill / Kennel Sill; Exit Sting ↔ Exit Tithe / Exit Boon / Enter Mend / Glyph Tax; Purse Keep ↔ Purse Cut / Purse Lock / Empty Purse / Late Purse / Leftover Lend / Timestep; Tick Plate ↔ Tick Hood / Ward Plate / Empty Plate / Morrow Plate / Thin Ward / Cleanse Rite; Last Mute ↔ Mute Thread / Stride Mute / Once Verse / Oath Blade / Hex of Silence / Last Ember / Last Ward; Pair Slide ↔ Pair Hinge / Pawn Trade / File Slide / Slide Tile / Draw Together / Court Shove; Court Stretch ↔ Court Hinge / Court Shove / Court Fold / Cadence Stretch / Pack Tithe.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved, live, or still held) |
| :--- | :--- | :--- |
| SUPPORT force-move heal | Heal iff the **target** was force-moved this turn | Chase Mend is **walk**. Gait Mend is **caster** walk. Enter Mend is a **tile**. |
| CONTROL CD stretch | **Double** each remaining CD (`×2`); zeros stay 0 | Stall is **+1**. Flush zeroes an **ally**. Crack zeroes the **highest one**. |
| SUMMONS four-cell | 2×2 occupy, counts as **four** | Twin Span = 2 walking. Triple Span = 3. Span Guard / Pylon are rigid 2-cell. |
| DAMAGE next-walk wick | Mark: next **walk MP** they spend deals 10, then consume | Boot Sting is already-walked **now**. Fuse is a **tile**. Cast Mark is **their cast**. Wound Mark is **they take a hit**. |
| DAMAGE dry bar | Bonus iff target leftover AP = 0 | Empty Plate is 0 leftover → **+RES**. Still Brand / Post Sting are **unmoved**. Empty Purse is leftover **economy**. |
| POSITION home step | Caster steps to a free Chebyshev-1 of a targeted **ally** | Hinge Step is 90° around the ally. Relay Dash is a **walk** 2. Leash Hook **pulls the ally**. Morrow Step is delayed **blink**. |
| CONTROL must-span | Next walks this turn must be Manhattan **exactly 2** | Must Pace requires walk to **cast**. Even/Odd are **parity**. Walk Toll is **+1 MP**. Diag Lock is **shape**. |
| DEFENSE far hood | Next applied hit from Chebyshev **≥ 3** → 0 | Sidestep is the **next** hit at any range. Fog Hood **cuts LoS range**. |
| SUPPORT boot lend | +1 current MP to an ally who has **not** walked | Spare Pace is +1 **now**, no gate. Gift Sill is **enter** +MP. |
| TERRAIN quiet sill | Occupant cannot resolve Strike / `isPhysical` | Strike Hold bans Strike until **walk**. Oath Blade / Verse First are **unit** brands. Quiet Hex is a different card. |
| TERRAIN exit sting | First **leave** deals 8, then consume | Exit Tithe is **AP**. Exit Boon is **positive**. Enter Mend is **enter** heal. |
| SUPPORT purse keep | Carry leftover AP (cap 3) to **next turn start**, once/battle | Timestep is full **now**. Purse Lock **freezes theirs**. Leftover Lend **dumps to an ally**. Not a queue splice. |
| DEFENSE tick plate | Next **DoT tick** on you is 0 (one stack) | Cleanse **strips**. Thin Ward / Ward Plate are **hits**. Tick Hood is a different W7 card. |
| CONTROL last mute | Their **last resolved spell id** is illegal for 1 of their turns | Mute Thread fizzles the **next any** id. Once Verse is the **echo** family. Hex of Silence is full-bar **lock**. |
| POSITION pair slide | Two adj hostiles **translate** 1 along caster→target | Pair Hinge **rotates**. Pawn Trade **swaps**. Slide Tile is a **conveyor**. Draw Together **attracts**. |
| CONTROL mass stretch | Signature: `×2` remaining CDs on **every other** body | Court Hinge / Shove / Fold. Player never owns this. |
| 180° hostile hinge | — | **Equals Pawn Trade.** About Hinge (#590) is player-side `BOSS_ONLY`. |
| RESOURCE fourth MP snipe | — | **Held forever** with Ley Toll / Undertow / Sanguine Toll |
| Sixth echo | — | Held for Discovery |
| Full-bar silence | — | Hex of Silence stays `BOSS_ONLY` |
| Mid-RAF splice | — | Held (AGENTS.md) |

**Still open after this wave (do not fill today):** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; a sixth echo id; player-owned Hex of Silence; player-owned About Hinge (stays `BOSS_ONLY`); five-cell occupy; carry leftover **MP** across turns; heal-if-**both** walked. Those stay Wave 10 / Discovery so this pass stays discrete.

---

## 3. Contract with Dynamic Spell Discovery

Coordinate with Discovery (`c26e5a83-…`) and Admin (`4efa22ec-…`). This pass only stamps acquisition so those layers can filter **by field**. Discovery Wave 9 may ship the same day — **do not mint SDE ids here**.

### 3.1 Discovery is still inert (reconfirmed @ `0f5363f`)

1. All 32 frontend spells are forced `isBaseSpell` (`WorldExploration.tsx` 2395–2408).
2. Recap grants XP/Doka/feats only.
3. Achievements (`defaultAchievements`, `admin.mo` 309–326) grant Doka only.
4. Challenges (`DEFAULT_CHALLENGES` 44–109) grant Doka/XP/badge only.
5. `upgradeSpell` levels a known id; it does not unlock ids.
6. `ENEMY_KITS` (`enemyAI.ts` 163–185) still reuse always-owned ids. Seeing a bishop cast Frost teaches nothing.
7. `buildEnemyKit` still takes `currentMap.levelZone` (`WorldExploration.tsx` 11920). Non-number → `NaN` → every kit stays zone 0.
8. `executeCastAttempt` still does not debit `spell.mpCost`. This pass adds **zero** `mpCost > 0` rows, so it does not widen that bug.
9. No `ownedSpellIds` / `observedSpellIds` persist maps. Character still has `spellLevelKeys` / `spellBarOrder`.

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 9 ids to `starterSpells` as base. Do **not** land Wave-9 data before Wave-1 ownership split (`SDE-2026-08-31-001`) through Wave-8 (#563 / #590) data.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "quadspan"` is a **string enum on the config**.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Pair Slide / Home Step / Boot Lend / Last Mute **cast** (AP spent) **is** observation, including a blocked landing / no-last-id / already-walked fizzle after AP.
- Shove Mend / Far Hood / Tick Plate / Must Span / Purse Keep / Cadence Stretch **arming** (AP spent) **is** observation. Later consume / convert is **not** a second observe.
- Gait Wick / Quiet Sill / Exit Sting **paint** is observation. Later walk / leave / convert ticks are not a second observe.
- Quad Span **summon** is observation. Later occupy / death is not a second observe.
- Court Stretch **arm** is observation for witness-only kits. Never written to owned ids.
- Do not require “see it N times” except where a boss adaptation already does. Wave 9 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.
- Do not stamp `survivor` (Last Ember / Last Ward). #590 left that feat leftover on purpose.

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

**Every live feat and every live challenge id is already a sole spell door or a MULTI child.** Wave 9 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 9 does **not** invent a 16th feat. #590 already stamped leftover `leader_slayer` / `spell_master` MULTI children (Crown Cut / Full Bar). SDE Wave 7 already claimed leftover `hard_1` / `legendary_1` MULTI children (Thin Ward / Clean Blood).

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

**New proposed extra doors for the boss designer (Wave 11 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `shove_cantor` first-win | Shove Mend MULTI child (observe+win still grants) |
| `stretch_precentor` first-win | Cadence Stretch MULTI child |
| `span_quad` first-win | Quad Span MULTI child |
| `keep_bursar` first-win | Purse Keep MULTI child |
| `court_stretch_regent` kit only | Court Stretch (`NOT_PLAYER_LEARNABLE`) |

Piece-type observe paths (not feat doors): wisps / cantors for Shove Mend; scribes / tempo for Cadence Stretch; masons / rooks ELITE for Quad Span; hex / pawns for Gait Wick; lurkers / knights for Dry Sting; porters / queens for Home Step; knights / pawns for Must Span; lurkers / bishops for Far Hood; buffers / bishops for Boot Lend; masons / rooks for Quiet Sill; masons / pawns for Exit Sting; hex / kings for Purse Keep; golems / wardens for Tick Plate; hex / bishops for Last Mute; queens / porters for Pair Slide.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 / #463 / #480 / #525 / #533 / #563 / #590 key names for a different meaning.

`mpCost` stays 0 on every Wave-9 row.

**New keys (Wave 9 only):**

```text
requireTargetForcedMovedHeal, shoveMendAmount,      // Shove Mend — 8 if forcedMovedThisTurn
stretchRemainingCdMul,                              // Cadence Stretch — 2; 0 stays 0
quadSpanCells,                                      // Quad Span — 4; NW-origin 2×2
gaitWickDamage,                                     // Gait Wick — 10 on next walk MP
requireTargetLeftoverApZero, dryStingBonus,         // Dry Sting — +8 if leftover AP = 0
homeStepNeedFreeAdj,                                // Home Step — land Chebyshev-1 of ally
mustWalkManhattan,                                  // Must Span — next walks == 2
farHoodMinChebyshev,                                // Far Hood — next hit ≥ 3 → 0
bootLendMp, requireTargetUnmoved,                   // Boot Lend — +1 MP if walk MP = 0
quietSillForbidPhysical, quietSillDuration,         // Quiet Sill — 2 turns
exitStingDamage, exitStingDuration,                 // Exit Sting — 8, 2 turns
purseKeepCap, purseKeepOnceBattle,                  // Purse Keep — 3, next-turn start
tickPlateNegateNextDot,                             // Tick Plate — one stack
lastResolvedIdIllegalTurns,                         // Last Mute — 1 of their turns
pairSlideDistance, pairSlideNeedAdj,                // Pair Slide — 1, shared dir
courtStretchExcludeCaster                           // Court Stretch
```

If a key is missing, the rider does not fire.

Nested kit-only id (not a player card): none. Quad Span’s kit is **empty**. Do not invent `spell-quad-shard`.

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Force-move heals are paid in **a body already displaced**, not in extra AP. Purse Keep is paid in **AP you already chose not to spend**.

---

## 5. Proposed spells (Wave 9)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-shove-mend`

NAME: Shove Mend  
ROLE: SUPPORT — heal if the target was force-moved  
ACQUISITION: MULTI_SOURCE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: true  
COOLDOWN: 1  
EFFECT: `spellType: "heal"`, `healAmount: 8`, `effectParams: {"requireTargetForcedMovedHeal":true,"shoveMendAmount":8}`. If the target has `forcedMovedThisTurn` (push / pull / swap / hinge / pair-slide / conveyor — **not** walk MP), heal 8 through the existing `heal` helper (honor `healRecv`, no new math). If they have not been force-moved, the heal is 0 — AP is still spent (observation fires). Distinct from Gait Mend (caster **walked**), Chase Mend (#590, target **walked**), Enter Mend (tile enter), Blood Mend (unconditional self). The decision is **displace them first, then take the 8**, or keep the body still and skip the heal.  
DURATION: instant  
SCALING: 8 follows healRecv only. Gate is boolean.  
SYNERGIES: Shoulder Bash / Hook Line / Shove Face / Pair Hinge / Pair Slide / Pawn Trade / Twin Gate landing **do** arm the flag. Slide / Back Step on the **target** arm it. Spare Pace does **not**. `no_healing` / `hard_1`: a **successful** heal (HP actually increased) fails those challenges; a 0-heal fizzle does not.  
COUNTERPLAY: Self Anchor so they cannot be moved; stay off conveyors; Cursed Wound halves the 8.  
POWER_BUDGET: Cheap. 8 is below Mend’s 12 because the shove is the rest of the cost.  
AI_USAGE: `aiHint: "heal_if_target_forced_moved"`. Wisps / cantors. Skip if `forcedMovedThisTurn` is false **or** missing HP < 8. Never shove **only** to enable this if a Strike would kill.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop"], levelZoneMin: 1 }` plus family observe (wisps / cantors) **or** `bossIds: ["shove_cantor"]`. First child wins.  
EDGE_CASES: Walk MP must not set `forcedMovedThisTurn`. Summon-control walks are walk MP, not force-move. Challenge: `challengeHealUsedRef` flips only when HP increased. Do not name-check `"Shove"`.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — one boolean on the existing heal path; the flag must be written by every force-move resolver.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-shove-mend
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
acquisitionModel: MULTI_SOURCE
effectParams: {"requireTargetForcedMovedHeal":true,"shoveMendAmount":8}
```

---

### SPELL_ID: `spell-cadence-stretch`

NAME: Cadence Stretch  
ROLE: CONTROL — double remaining CDs on one hostile  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: `effectParams: {"stretchRemainingCdMul":2}`. For each id in the target’s cooldown map with remaining **≥ 1**, set remaining to `remaining * 2`. Ids at 0 stay 0 (they are legal). Does **not** invent CDs the target does not have. Distinct from Cadence Stall (#590, **+1** all remaining), Cadence Flush (ally, all → 0), Cadence Crack (hostile **highest one** → 0), Cadence Theft (steal 1), Cadence Lend (ally −1). The decision is **stretch Inferno’s 2 into 4 before they recast**, not a blanket silence.  
DURATION: instant rewrite of remaining locks  
SCALING: none.  
SYNERGIES: Cast after they spend Inferno / Fuse / Timestep-class locks. Hex Toll after stretch makes the recast expensive **and** late.  
COUNTERPLAY: Cadence Break / Flush on their side; sit on ids with CD 0; do not show a long lock if Stretch is live.  
POWER_BUDGET: Standard utility, 0 damage, CD 2. Power is **turns they lose**, not a number on this card.  
AI_USAGE: `aiHint: "stretch_if_highest_remaining_cd_ge_2"`. Scribes / tempo. Skip if every remaining is 0 **or** the highest remaining is 1 (Stall is the +1 card).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1` **or** `bossIds: ["stretch_precentor"]`. First child wins.  
EDGE_CASES: Cap stretched remaining at 8 so a 4-turn lock does not become a 16-turn brick. Do not write spell levels. Once-per-battle flags (Timestep / Purse Keep / Cadence Flush) are **not** CDs — do not touch them. Do not name-check `"Cadence"`.  
IMPLEMENTATION_COMPLEXITY: LOW — iterate the existing cooldown map.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-quad-span`

NAME: Quad Span  
ROLE: SUMMONS — stationary 2×2 occupy, counts as four  
ACQUISITION: MULTI_SOURCE  
AP_COST: 4  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "quadspan"`, `summonLifespan: 3`, `effectParams: {"quadSpanCells":4}`. Target is the **north-west** cell of a 2×2. All four cells must be `isCellFree` at resolve (walkable, no barrier / portal / void / body). The summon occupies **all four** for pathing and LoS-block **as bodies** (not as `barrierTiles`). Empty kit. Shared HP 8. Counts as **four** toward the summon cap. Distinct from Twin Span (two **walking** cells), Triple Span (three), Span Guard / Span Pylon (rigid **two**), Bastion / Dummy Post (one cell). The decision is **spend four cap and a 2×2 to seal a corridor**, or keep the cap for a wolf.  
DURATION: 3 turns or until HP 0  
SCALING: HP 8 is fixed. No damage.  
SYNERGIES: Quiet Sill / Exit Sting / Fuse on a cell **outside** the 2×2 (the occupy is not paint). File Lance after they are forced around the block.  
COUNTERPLAY: Brick Shift does **not** move occupy cells (those are not `barrierTiles`). Ignite / execute the 8 HP. Open Pit under a cell is illegal at place; after place, a later pit on one cell of the 2×2 **must** fail the occupy (vacate that cell or the whole quad dies — implement as **whole quad dies**, document; do not silently punch a hole).  
POWER_BUDGET: Heavy, CD 3, 0 damage. Power is **four tiles**.  
AI_USAGE: `aiHint: "place_quadspan_if_2x2_seals_file"`. Masons / rooks ELITE. Skip if any of the four is blocked **or** summon-cap remaining < 4.  
DISCOVERY_ELIGIBILITY: true. `eliteOnly: true`, `pieceTypes: ["rook"]`, `levelZoneMin: 2` **or** `bossIds: ["span_quad"]`. First child wins.  
EDGE_CASES: `summonAI: "quadspan"` is a **string enum**. Never parse `"Quad Span"`. Do not reuse occupancy `portals`. The four cells are one combatant id with a `occupiedCells: 4` footprint helper — do not spawn four bodies (that would be four initiative seats). Attack Nearest / LoS treat all four as occupied.  
IMPLEMENTATION_COMPLEXITY: HIGH — first 4-cell footprint. Extract a helper; do not grow WX.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gait-wick`

NAME: Gait Wick  
ROLE: DAMAGE — delayed; detonates on their next walk MP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: `damage: 0`, `effectParams: {"gaitWickDamage":10}`. Apply a unit mark. The **next** time that unit spends ≥ 1 **walk** MP, deal 10 through the existing damage helper (RES/SR, no new math), then consume the mark. Forced-move does **not** detonate. If they never walk before the mark expires (2 of their turns), it falls off for 0. Distinct from Boot Sting (walked **already**, damage now), Post Sting (unmoved **now**), Fuse Tile (tile clock), Cast Mark (detonates on **their cast**), Wound Mark (detonates when **they take a hit**), Pit Wick (delayed **pit**). The decision is **tax the 2-step they still want**, or make them stand.  
DURATION: mark 2 of their turns or until walk  
SCALING: 10 follows existing damage growth.  
SYNERGIES: Must Pace / Must Span so they **must** walk; Rank Lock / Diag Lock so the walk is expensive geometry; Open Pit on the only legal 2-step.  
COUNTERPLAY: Stand. Blink / Swap / Home Step / hinge off the cell (those are not walk MP). Cleanse / Dispel if a later writer treats this as a strip-able debuff (`effectCategory: "debuff"` — yes, strip-able).  
POWER_BUDGET: Cheap tool. 10 is Strike-class, paid later.  
AI_USAGE: `aiHint: "mark_if_target_still_has_walk_mp"`. Hex / pawns. Skip if target current MP = 0 **or** they are already marked.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Summon-control walks spend the **player** walk pool today — if that is still true, a player-side summon walk detonates a mark **on the player** only if the marked id is the player. Document; do not silently retarget. Challenge: the delayed 10 is a spell-hit when it lands. Do not name-check `"Gait"` or `"Wick"`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — unit mark + walk-MP hook.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dry-sting`

NAME: Dry Sting  
ROLE: DAMAGE — bonus if the target has 0 leftover AP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: `damage: 12`, `effectParams: {"requireTargetLeftoverApZero":true,"dryStingBonus":8}`. Deal 12. If the target’s **current leftover AP this turn** is 0, deal +8 (20 total) through the same helper. Distinct from Empty Plate (#590, 0 leftover → **+RES**), Empty Purse / Purse Cut (economy), Still Brand / Post Sting (**unmoved**, walk MP), Lone Sting (isolated by **bodies**). The decision is **wait until they spend the last 2**, or poke now for 12.  
DURATION: instant  
SCALING: 12 / +8 follow existing damage growth. Gate is boolean.  
SYNERGIES: Drain Courage / Hex Toll / Leftover Lend (on **their** ally, not this) to empty the bar first. Act Tax so they spend down.  
COUNTERPLAY: Keep 1 AP unspent. Purse Keep does **not** empty the bar (it stores leftover; leftover is still > 0 until turn end).  
POWER_BUDGET: Standard. 12 is below Frost; 20 is Frost-class when the gate is paid.  
AI_USAGE: `aiHint: "sting_if_target_leftover_ap_zero"`. Lurkers / knights. Skip the card if leftover ≥ 2 **unless** 12 still kills.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 1`  
EDGE_CASES: Evaluate leftover **after** any AP debit from a just-finished action in the same turn, but **before** this card’s own AP debit on the **caster**. The target’s bar is the one that matters. Do not name-check `"Dry"`.  
IMPLEMENTATION_COMPLEXITY: LOW — one integer read on the existing AP pool.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-home-step`

NAME: Home Step  
ROLE: POSITION — caster steps adjacent to a targeted ally  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: ally  
LOS: true  
COOLDOWN: 2  
EFFECT: **Not** `isSwap`. `effectParams: {"homeStepNeedFreeAdj":true}`. Target a living ally (including a summon). Move the **caster** to a free Chebyshev-1 cell of that ally. Prefer the free cell with the smallest Chebyshev to the caster’s current cell, then lowest `(x,y)`. Caster’s origin becomes free. Target does not move. If no free adjacent cell, fizzle (AP spent). Distinct from Hinge Step (caster **rotates 90°** around the ally), Relay Dash (walk **max 2**), Morrow Step (delayed **blink**), Cover Step (hit **redirect**), Leash Hook (pull **the ally** to you), Ally Reel (pull 1 toward ally). The decision is **spend 3 to join them**, or keep the file.  
DURATION: instant  
SCALING: none.  
SYNERGIES: Split Mend / Flank Share after you land adj. Shove Mend does **not** arm (you moved; they did not). Quiet Sill / Exit Sting on the landing cell **do** tick.  
COUNTERPLAY: Occupy all six-to-eight adj cells; Open Pit / Barrier the only landing; Root the caster (this card is a **step**, not walk MP — Root blocks **walk**, not this resolve; **Grounded Lock / Blink Seal** should block this as a blink-class relocate — stamp `effectCategory: "relocate"` so those locks can filter by field, not by name).  
POWER_BUDGET: Standard utility, 0 damage, CD 2.  
AI_USAGE: `aiHint: "step_adjacent_to_ally_if_seals_or_rescues"`. Queens / porters. Skip if already Chebyshev-1 **or** no free adj.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Targeting `ally` includes player-side summons and, for an enemy caster, other hostiles. Do not allow targeting self. Hazard on landing **must tick** (MIMA-2026-08-31-001). Do not call `swapPositions`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy dest pick; new flag, not `isSwap`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-must-span`

NAME: Must Span  
ROLE: CONTROL — next walks this turn must be Manhattan 2  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: `effectParams: {"mustWalkManhattan":2}`. For the rest of the target’s **current turn**, every walk they start must have Manhattan length **exactly 2**. A 1-step is illegal. A 3-step is illegal. They may spend 0 walk MP. Forced-move is legal at any length. Distinct from Must Pace (they must walk to **cast**), Even Stride / Odd Stride (**parity** of the dest), Walk Toll (**+1 MP** per step), Diag Lock (**diagonal** shape), Rank Lock (axis). The decision is **make the 1-step peel illegal**, or let them take the cheap tile.  
DURATION: rest of their current turn  
SCALING: none.  
SYNERGIES: Gait Wick (the 2-step they are forced toward detonates). Open Pit / Exit Sting on both legal 2-step dests. Far Hood if they cannot close to 2.  
COUNTERPLAY: Stand. Blink / Home Step / Swap. Spare Pace does not help a 1-step.  
POWER_BUDGET: Cheap control.  
AI_USAGE: `aiHint: "must_span_if_target_wants_1_step_peel"`. Knights / pawns ELITE. Skip if target current MP < 2 **and** they are already at desired range.  
DISCOVERY_ELIGIBILITY: true. `eliteOnly: true`, `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Knight-style 2-1 jumps are not walks — this card filters **walk paths**, not `spell-vault`. If a legal 2-step path is blocked mid-way, the walk is illegal (same as today’s pathing). Do not name-check `"Span"`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — walk-dest filter on the existing pathing gate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-far-hood`

NAME: Far Hood  
ROLE: DEFENSE — next hit from Chebyshev ≥ 3 is 0  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: `effectParams: {"farHoodMinChebyshev":3}`. Arm a consume shield. The next **applied** damaging hit whose attacker is Chebyshev ≥ 3 from you at resolve deals 0, then consume. Hits from 1–2 still land and **do not** consume. Distinct from Sidestep Ward (next hit **any** range), Fog Hood (cuts **LoS range**), Tick Hood (W7), Return Sting (half back), Morrow Plate (delayed **absorb**). The decision is **walk in to 2, or waste the shot at 4**.  
DURATION: until consume or 2 of your turns  
SCALING: none. Gate is range, not a percent.  
SYNERGIES: Root / Gait Seal / Must Span so they cannot close. Open Pit on the 2-ring.  
COUNTERPLAY: Walk to Chebyshev 2, then Strike. Swap / Home Step into melee.  
POWER_BUDGET: Standard defense, CD 3. Power is the **range gate**, not a number.  
AI_USAGE: `aiHint: "hood_if_nearest_hostile_cheb_ge_3"`. Lurkers / bishops ELITE. Skip if a hostile is already Chebyshev ≤ 2.  
DISCOVERY_ELIGIBILITY: true. `eliteOnly: true`, `pieceTypes: ["bishop"]`, `levelZoneMin: 2`  
EDGE_CASES: Consume on the incoming-hit pipeline **before** HP write. Do not add a percent miss inside `combatMath.ts`. DoTs tick from the unit’s cell — if the DoT source is ≥ 3, this card does **not** eat DoT (Tick Plate owns that). Bounce hops use the **bouncer’s** cell as attacker.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — one consume gate with a Chebyshev read.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-boot-lend`

NAME: Boot Lend  
ROLE: SUPPORT — +1 current MP to an unmoved ally  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: true  
COOLDOWN: 1  
EFFECT: `effectParams: {"bootLendMp":1,"requireTargetUnmoved":true}`. If the target’s `walkMpSpentThisTurn` is 0, add 1 to their **current** MP this turn (cap at their max MP). If they already walked, fizzle (AP spent). Distinct from Spare Pace (+1 **now**, no gate), Gift Sill (cell **enter** +MP), Exit Boon (leave), Walk Toll (**+1 cost**), Haste (+2 MP **stat** for a turn — different writer). The decision is **fund the 2-step they have not taken**, or they already spent the tiles.  
DURATION: instant (current-turn MP)  
SCALING: none.  
SYNERGIES: Gait Mend after they spend the gifted tile. Must Pace so they can cast. Gait Wick on a hostile you just funded a chase toward — do not gift into a wick.  
COUNTERPLAY: Force them to walk first (conveyor / Pair Slide) so the lend fizzles.  
POWER_BUDGET: Cheap.  
AI_USAGE: `aiHint: "lend_mp_if_ally_unmoved_and_needs_2_step"`. Buffers / bishops. Skip if `walkMpSpentThisTurn ≥ 1` **or** they are at max MP.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Forced-move does **not** set `walkMpSpentThisTurn` (Wave 8 law) — a shoved ally can still receive Boot Lend. Do not write max MP. Do not name-check `"Boot"`.  
IMPLEMENTATION_COMPLEXITY: LOW — one boolean + current-MP add.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-quiet-sill`

NAME: Quiet Sill  
ROLE: TERRAIN — occupant cannot resolve Strike  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: false` (may paint under a body). `effectParams: {"quietSillForbidPhysical":true,"quietSillDuration":2}`. Paint the cell for 2 turns. While a combatant occupies it, they cannot resolve `isPhysical === true` **or** id `physical_attack`. Spells with `isPhysical` false stay legal. Walk on/off is legal. Distinct from Strike Hold (cannot Strike until **they walk**, unit-scoped), Oath Blade (other ids fizzle, Strike **hurts**), Verse First (cannot Strike until a **spell** resolves), Quiet Hex (W1, different), Ward Cell. The decision is **make the melee tile a spell-only tile**.  
DURATION: 2 turns  
SCALING: none.  
SYNERGIES: Goad / Dummy Post to force them onto it. Home Step / Pair Slide them onto it. File Lance still works (not physical).  
COUNTERPLAY: Step off. Cast Frost from the cell. Brick Shift does not move paint.  
POWER_BUDGET: Cheap terrain.  
AI_USAGE: `aiHint: "paint_quiet_sill_on_melee_tile"`. Masons / rooks. Skip if the cell is empty **and** no hostile can reach it this turn.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Filter by `isPhysical` / id `physical_attack`, **never** by name `"Strike"`. Attack Nearest that would resolve Strike from this cell **must** refuse (same gate). Paint under the caster is legal.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — tile paint + cast/walk-from-cell filter.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-exit-sting`

NAME: Exit Sting  
ROLE: TERRAIN — first leave deals 8  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `effectParams: {"exitStingDamage":8,"exitStingDuration":2}`. Paint for 2 turns. The first combatant who **leaves** the cell (walk or force-move) takes 8 through the existing damage helper, then the paint consumes. Enter does **not** tick. Standing does **not** tick. Distinct from Exit Tithe (**AP** on leave), Exit Boon (**positive** on leave), Enter Mend (enter **heal**), Glyph Tax (enter **AP**), Cinder Tile (enter / stand burn). The decision is **tax the peel**, or they stay and eat the file.  
DURATION: 2 turns or until first leave  
SCALING: 8 follows existing damage growth.  
SYNERGIES: Goad them onto it, then stretch their peel CD. Gait Wick + Exit Sting on the same body is two taxes on one leave-walk (both fire; do not merge).  
COUNTERPLAY: Never enter. Blink from an adjacent cell (you never occupied it). Safe Fall skips **hazard** ticks on force-move — Exit Sting is paint, not a lava/spike hazard; Safe Fall does **not** skip it unless a later writer unifies them (do not unify in this pass).  
POWER_BUDGET: Cheap. 8 is below Strike because the leave is optional.  
AI_USAGE: `aiHint: "paint_exit_sting_on_occupied_or_peel_tile"`. Masons / pawns. Skip empty cells no one will leave.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Swap/Home Step **off** the cell is a leave and **does** tick. Death on the cell is not a leave. Quad Span vacating a cell of the 2×2 (if the whole quad dies) is not a leave of a painted cell unless that cell was painted — the occupy cells are bodies, not paint.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — leave hook on walk + force-move.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-purse-keep`

NAME: Purse Keep  
ROLE: SUPPORT — carry leftover AP to next turn start  
ACQUISITION: MULTI_SOURCE  
AP_COST: 1  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 0  
EFFECT: `effectParams: {"purseKeepCap":3,"purseKeepOnceBattle":true}`. Once per battle. After paying this card’s 1 AP, arm a keep. At **your next turn start** (not mid-RAF, not end-of-round wrap), add `min(leftover AP at the end of this turn, 3)` to current AP (cap at max AP). If leftover at end of this turn is 0, the keep lands 0 — the once/battle is still spent. Distinct from Timestep (full AP/MP **now**), Purse Lock (freeze **their** leftover), Purse Cut / Empty Purse (economy on **them**), Leftover Lend (dump to an **ally**), Late Purse. **Does not splice the turn queue.** The decision is **bank 3 for Inferno next turn**, or spend it now.  
DURATION: arms now; pays at next own turn start  
SCALING: none. Cap 3 is fixed.  
SYNERGIES: Stretch a hostile Inferno **this** turn, spend 1 to keep, recast yours next. Dry Sting does **not** see 0 leftover while the keep is armed this turn (leftover is still on the bar until turn end).  
COUNTERPLAY: Kill / silence them before next turn. Hex Toll the recast. Cadence Stretch their Inferno so the banked 3 is not enough to recast on time.  
POWER_BUDGET: Cheap AP. The power is **turns**, not a number. Once/battle is the lid.  
AI_USAGE: `aiHint: "keep_if_leftover_ge_2_and_next_card_costs_4"`. Hex / kings. Skip if leftover after the 1-cost is 0 **or** already used this battle.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["king","queen"]`, `levelZoneMin: 1` **or** `bossIds: ["keep_bursar"]`. First child wins.  
EDGE_CASES: End-of-turn leftover is read **after** leftover-burn cards (Late Purse / Pack Tithe) if those resolve on the same end-of-turn pass — stamp order: **keep snapshots first**, then burn. Do not insert a new turn. Death before next turn start discards the bank. Do not name-check `"Purse"`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — once/battle flag + next-turn-start writer. Not a queue splice.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-tick-plate`

NAME: Tick Plate  
ROLE: DEFENSE — next DoT tick on you is 0  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"tickPlateNegateNextDot":true}`. Arm a consume. The next DoT stack tick that would apply HP loss to you deals 0, then consume. Other stacks on later ticks still land. Direct hits are unaffected. Distinct from Cleanse Rite / Dispel Thread (**strip** now), Thin Ward / Ward Plate / Morrow Plate (**hits**), Tick Hood (W7, different), Bloodless Plate. The decision is **eat Inferno’s next 8**, or strip the whole DoT for more AP if you own Absolve.  
DURATION: until consume or 2 of your turns  
SCALING: none.  
SYNERGIES: Cast after Inferno / Poison / Venom land, before the next tick. Cursed Wound does not interact.  
COUNTERPLAY: Two DoT types (Poison + Inferno) — this eats **one** tick. Ignite Stacks (reserved) still wants a later detonate writer.  
POWER_BUDGET: Cheap. One tick of Inferno is 8.  
AI_USAGE: `aiHint: "plate_if_own_dot_tick_ge_8_this_round"`. Golems / wardens. Skip if no DoT on self.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Consume in the existing DoT tick helper (`engine/dotStacks.ts`), not in `dealDamage`. A 0-tick still decrements that stack’s duration. `challengeHealUsedRef` is not involved. Do not name-check `"Tick"`.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — one consume in the tick loop.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-last-mute`

NAME: Last Mute  
ROLE: CONTROL — their last resolved spell id is illegal for 1 turn  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: `effectParams: {"lastResolvedIdIllegalTurns":1}`. Read the target’s `lastResolvedSpellId` (the last id that spent AP for them this battle). For 1 of **their** turns, that id is illegal (cast refuses, no AP). If they have no last id, fizzle (AP spent). Strike is illegal **only if** `physical_attack` was that last id. Distinct from Mute Thread (next **any** id fizzles), Once Verse (echo family), Oath Blade (other ids fizzle, Strike **hurts**), Hex of Silence (full bar **lock**, still unowned), Cast Hold (cannot resolve a **spell** until they walk). The decision is **ban the Inferno they just showed**, not a blanket silence.  
DURATION: 1 of their turns  
SCALING: none.  
SYNERGIES: Stretch that same id, then mute it — they cannot recast even after the stretch. Dry Sting after they spent the bar on that id.  
COUNTERPLAY: Cast a cheap legal id last (Strike) so mute bans Strike, then Inferno. Or never cast before the mute (fizzle).  
POWER_BUDGET: Standard control, 0 damage, CD 2.  
AI_USAGE: `aiHint: "mute_if_last_id_is_heavy"`. Hex / bishops. Skip if no last id **or** last id is Strike and they still have Frost.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: `lastResolvedSpellId` must be written by `executeCastAttempt` / enemy resolve on **successful AP spend** (cast / fizzle that spent AP). Observation of Last Mute is the mute cast, not the later refuse. Do not name-check `"Mute"`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — persist last-id on the combatant + a cast gate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pair-slide`

NAME: Pair Slide  
ROLE: POSITION — translate two adjacent hostiles 1 step  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: **Not** `isSwap`. `effectParams: {"pairSlideDistance":1,"pairSlideNeedAdj":true}`. Target one living hostile. Find the nearest **other** living hostile at Chebyshev **exactly 1** (4-adj first, then diagonals, then lowest id). Translate **both** 1 cell in the caster→target direction (sign of `(tx-cx, ty-cy)` stepped to a unit axis; if the vector is diagonal, step diagonally). Both destination cells must be `isCellFree` after vacating the pair. Caster does not move. If no second body, or either dest is blocked, fizzle (AP spent). Distinct from Pair Hinge (**90° rotate** around the pair midpoint), Pawn Trade (**swap**), Draw Together (**attract**), Slide Tile (**conveyor paint**), Court Shove (mass facing / shove signature), File Reel (axis toward **caster**). The decision is **walk the pair onto paint**, or they stay off it.  
DURATION: instant  
SCALING: none.  
SYNERGIES: Exit Sting / Fuse / Cinder / Open Pit / Quiet Sill on one dest. Shove Mend after (both arm `forcedMovedThisTurn`). Gait Wick does **not** detonate (not walk MP).  
COUNTERPLAY: Isolate (one body); Self Anchor on a body that must not move; stay Chebyshev ≥ 2 from every ally.  
POWER_BUDGET: Standard utility, 0 damage, CD 2. Power is the board.  
AI_USAGE: `aiHint: "slide_two_hostiles_if_adj_onto_paint_or_off_file"`. Queens / porters. Skip if pack size < 2 or both dests blocked. Enemy caster: the two hostiles are **player-side**.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","king"]`, `levelZoneMin: 1`  
EDGE_CASES: Same dest-hazard law as Pair Hinge (must tick). Do not call `swapPositions`. A diagonal caster→target with a 4-adj pair may push them off-axis — if either dest is blocked, whole card fizzles (no partial slide).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy pair translate; new flag, not `isSwap`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-stretch`

NAME: Court Stretch  
ROLE: CONTROL — mass remaining-CD double  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `effectParams: {"stretchRemainingCdMul":2,"courtStretchExcludeCaster":true}`. For every **other** living combatant, apply the Cadence Stretch rewrite (remaining ≥ 1 → `×2`, cap 8). Caster’s own CDs unchanged. Distinct from Court Hinge (mass **pair-hinge**), Court Shove (mass **shove / facing**), Court Fold (fold two player-side bodies), Pack Tithe (leftover AP siphon, never owned). Player never owns this.  
DURATION: instant  
SCALING: none.  
SYNERGIES: Kit with Inferno / Fuse queens so the player’s recast window dies.  
COUNTERPLAY: Cadence Flush / Break on your side; sit on CD-0 ids; do not show a 3-turn lock into a Court Stretch turn.  
POWER_BUDGET: Signature 6 / CD 4.  
AI_USAGE: `aiHint: "court_stretch_if_two_plus_hostiles_have_cd_ge_2"`. Kit-only on `court_stretch_regent`. Skip if fewer than two others have remaining ≥ 2.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. Observation may still record for telemetry; **grant never fires**. `usableByPlayer: false`, `usableByEnemy: true`.  
EDGE_CASES: Same cap-8 and once/battle-untouched laws as Cadence Stretch. Do not write owned ids.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — map-wide loop of the Stretch helper.  
STATUS: PROPOSED

---

## 6. Combination matrix (intended, not name-wired)

Interactions resolve from **fields and flags**, never from `spell.name`.

| Field / flag | Combines with | Intended decision |
| :--- | :--- | :--- |
| `forcedMovedThisTurn` | Shove Mend | Displace first, then 8 — or skip |
| `stretchRemainingCdMul` | Inferno / Fuse locks | Turn a 2 into a 4 |
| `quadSpanCells` | File Lance / Quiet Sill around the 2×2 | Seal a corridor for four cap |
| `gaitWickDamage` | Must Span / Must Pace | They must walk into the 10 |
| `requireTargetLeftoverApZero` | Drain Courage / Hex Toll | Empty the bar, then 20 |
| `homeStepNeedFreeAdj` | Split Mend / Quiet Sill | Join them, or eat the sill |
| `mustWalkManhattan` | Open Pit on both 2-steps | Stand, or pay the pit |
| `farHoodMinChebyshev` | Root / Gait Seal | They cannot close to 2 |
| `bootLendMp` | Gait Mend | Fund the walk that pays the heal |
| `quietSillForbidPhysical` | Goad / Dummy Post | Force melee onto a spell-only tile |
| `exitStingDamage` | Pair Slide / Home Step off the cell | Tax the peel |
| `purseKeepCap` | Cadence Stretch on **them** | Bank 3, recast after they are late |
| `tickPlateNegateNextDot` | Inferno / Poison | Eat one tick, eat the rest later |
| `lastResolvedIdIllegalTurns` | Stretch on that same id | Ban the card they just showed |
| `pairSlideNeedAdj` | Fuse / Exit Sting dest | Walk the pair onto paint |
| `courtStretchExcludeCaster` | Two Inferno queens | Signature window |

Do **not** implement a name table that says “if Shove Mend and Pair Slide then…”. If the flag is missing, the rider does not fire.

---

## 7. Recommended unlock order (pacing)

Discovery still inert. This is the **intended** observe curve once the ownership split lands, not a live drop table.

| Band | Ids | Why this order |
| :--- | :--- | :--- |
| Early observe (zone 1) | Dry Sting, Boot Lend, Quiet Sill, Exit Sting, Gait Wick | Cheap decisions on leftover AP, walk, and paint |
| Mid observe | Shove Mend, Home Step, Pair Slide, Tick Plate, Last Mute | Need force-move / last-id / DoT already in the kit |
| Elite / MULTI | Must Span, Far Hood, Quad Span, Cadence Stretch, Purse Keep | Geometry and economy lids |
| Witness only | Court Stretch | Never owned |

Do not append these to `starterSpells`.

---

## 8. Implementation notes (for a later, explicit implementation PR)

1. **No new `mpCost > 0`.** Ley Toll / Undertow / Sanguine Toll remain the only paper spenders.  
2. **No new facing card.** Wave 5 still owns `currentView` after a battle-walk writer exists.  
3. **No new queue / wrap / mid-RAF card.** Purse Keep pays at **next own turn start**. Do not splice the current actor.  
4. **Pair Slide / Home Step** are occupancy dests, not `isSwap`. Do not call `swapPositions`.  
5. **Cadence Stretch / Court Stretch** rewrite remaining locks only. Cap 8. Do not write spell levels or once/battle flags.  
6. **Shove Mend** flips `challengeHealUsedRef` only when player-side HP actually increased.  
7. **Far Hood / Tick Plate** consume on their pipelines **before** HP write. Do not add a percent miss inside `combatMath.ts`.  
8. **Must Span / Quiet Sill** are walk-dest / cast-from-cell filters. Forced movement stays legal except where a relocate lock (`Grounded Lock` / `Blink Seal`) already filters `effectCategory: "relocate"`.  
9. **Quad Span** uses `summonAI: "quadspan"`. Empty kit. Counts as **four**. Never parse `"Quad Span"`. One combatant id, four-cell footprint.  
10. **Gait Wick / Exit Sting / Quiet Sill** are paint or unit marks. Later ticks are not a second observe.  
11. **Purse Keep** snapshots leftover at **end of this turn**, pays at **next turn start**. Not a queue splice.  
12. Recap grant uses the reward funnel + `commitSpellDiscoveries` / `unlockOwnedSpell`, not `updateCharacter`.  
13. Do not append these ids to `starterSpells` as `isBaseSpell`. Add to `SPELL_ID_CATALOG` **only when implemented**, together with `spellData.ts` and kits.  
14. Extract helpers. Do not grow `WorldExploration.tsx` (19,213 lines).  
15. Do not touch RAF, map generation, turn order, or damage math.  
16. Write `forcedMovedThisTurn` from every force-move resolver (push / pull / swap / hinge / pair-slide / conveyor). Walk MP must not set it.

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
- No restamp of Wave-5 boss extra doors (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`).  
- No restamp of Wave-6 boss extra doors (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`).  
- No restamp of Wave-6 tactical extra doors (`oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`).  
- No restamp of Wave-7 boss extra doors (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`).  
- No restamp of Wave-8 boss extra doors (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`).  
- No restamp of Wave-7 tactical extra doors (`pace_prelate`, `span_triune`, `wick_mason`, `slip_castellan`, `court_usher`).  
- No restamp of Wave-8 tactical extra doors (`gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`).  
- No restamp of Wave-8 SDE extras (`about_hinge_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`).  
- No restamp of any live 19 first-win.  
- No wiring of `CharacterStats.evasion` as a percent.  
- No clone of Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Veil, Mirror / Reflect.  
- No 12-AP Void Collapse clone.  
- No third File Lance / Blood Tithe.  
- No SDE Wave-8 ids (`spell-chase-mend`, `spell-cadence-stall`, `spell-about-hinge`, …). That catalog already landed as #590.  
- No SDE Wave-9 ids (that catalog may land same-day; do not mint them here). If a same-day SDE file claims one of these tactical ids, **SDE wins**.

---

## 10. Proposal index

| ID | Acquisition | Complexity | Primary hole filled |
| :--- | :--- | :--- | :--- |
| `spell-shove-mend` | MULTI_SOURCE | LOW–MEDIUM | Heal if the target was force-moved |
| `spell-cadence-stretch` | MULTI_SOURCE | LOW | Double remaining CDs on one hostile |
| `spell-quad-span` | MULTI_SOURCE | HIGH | Four-cell 2×2 occupy |
| `spell-gait-wick` | ENEMY_DISCOVERY | MEDIUM | Detonate on their next walk MP |
| `spell-dry-sting` | ENEMY_DISCOVERY | LOW | Bonus if leftover AP = 0 |
| `spell-home-step` | ENEMY_DISCOVERY | MEDIUM | Caster steps adjacent to an ally |
| `spell-must-span` | ELITE | MEDIUM | Next walks must be Manhattan 2 |
| `spell-far-hood` | ELITE | MEDIUM | Next hit from Chebyshev ≥ 3 is 0 |
| `spell-boot-lend` | ENEMY_DISCOVERY | LOW | +1 MP to an unmoved ally |
| `spell-quiet-sill` | ENEMY_DISCOVERY | MEDIUM | Occupant cannot resolve Strike |
| `spell-exit-sting` | ENEMY_DISCOVERY | MEDIUM | First leave deals 8 |
| `spell-purse-keep` | MULTI_SOURCE | MEDIUM | Carry leftover AP to next turn start |
| `spell-tick-plate` | ENEMY_DISCOVERY | LOW–MEDIUM | Next DoT tick on you is 0 |
| `spell-last-mute` | ENEMY_DISCOVERY | MEDIUM | Their last resolved id is illegal 1 turn |
| `spell-pair-slide` | ENEMY_DISCOVERY | MEDIUM | Translate two adj hostiles 1 step |
| `spell-court-stretch` | NOT_PLAYER_LEARNABLE | MEDIUM | Mass remaining-CD double |

All STATUS: **PROPOSED**.

**Held, not filled:** mid-RAF splice; fourth `mpCost > 0` walk snipe; sixth echo id; player-owned Hex of Silence; player-owned About Hinge; five-cell occupy; carry leftover **MP**; heal-if-**both** walked.

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
| `swapPositions` copies coords | `src/frontend/src/components/WorldExploration.tsx` | 9389–9401 |
| Push / attract unused by casts | `src/frontend/src/engine/occupancy.ts` | 482–537 |
| Portals impassable | `src/frontend/src/engine/occupancy.ts` | 13–14, 40 |
| AP-only cast debit | `src/frontend/src/components/WorldExploration.tsx` | 17096–17207 |
| MP display only | `src/frontend/src/components/SpellbookModal.tsx` | 966–977 |
| Enemy kits (owned ids) | `src/frontend/src/engine/enemyAI.ts` | 163–185 |
| `buildEnemyKit` zone NaN | `src/frontend/src/components/WorldExploration.tsx` | 11920 |
| `inferArchetype` healAmount | `src/frontend/src/engine/enemyAI.ts` | 447–452 |
| Summon name fallback | `src/frontend/src/engine/enemyAI.ts` | 217–224 |
| Cooldown helper | `src/frontend/src/utils/challengeCompletion.ts` | 365–368 |
| Backend six | `src/backend/lib/admin.mo` | 168–191 |
| Feats | `src/backend/lib/admin.mo` | 309–326 |
| Challenges | `src/frontend/src/utils/challengeCompletion.ts` | 44–109 |
| Boss ids | `src/frontend/src/types/bossTypes.ts` | 390–410 |
| WX line count | `src/frontend/src/components/WorldExploration.tsx` | 19213 |

**Document status:** PROPOSED. Safe to review and implement in a later, explicit data PR. Not a license to land combat code in the same change as this spec.

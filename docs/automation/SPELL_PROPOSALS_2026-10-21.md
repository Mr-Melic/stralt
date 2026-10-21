# Spell and Tactical Mechanics — Design Pass 2026-10-21

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1 law [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) through still-open Wave 12 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-29.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-bd29/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-29.md) (#802)
- Spell, Discovery & Achievement Admin — still-open #677 / #729 / #791 / same-day **#815** (ACTION_IDs only; no unique spell ids)
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) … still-open Wave 12 [`SPELL_PROPOSALS_2026-09-29.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-ad8f/docs/automation/SPELL_PROPOSALS_2026-09-29.md) (#787)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); extra doors through #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / **#808** (Wave 13 bosses); tactical extras #463 / #525 / #563 / #636 / #695 / #726 / #787

This is **Wave 13** of the tactical catalog. No tactical-proposal PR opened after #787 (2026-09-29). Cron did not land Waves in the 2026-10-01…2026-10-20 window. Live HEAD is unchanged. Wave 12 (#787) filled leftover-MP=0 tools, remaining-CD copy, six-cell occupy, odd-Chebyshev hood, leftover-AP=0-and-leftover-MP≥1 poke, and a mass Imprint signature.

**Wave 12 explicitly deferred eight holes.** Same-day Discovery Wave 12 (#802, opened after #787) claimed **one** of those eight as a unique SDE id. This pass fills three leftovers and leaves the rest held:

| Wave-12 leftover | Owner after #802 | This pass |
| :--- | :--- | :--- |
| Heal if **both leftover MP = 0** | **#802 Dry Gait** (`spell-dry-gait`). #787 Parched Mend (`spell-parched-mend`) is **dropped** — SDE wins. Do **not** ship Parched Mend. | Stamp Dry Gait. Do **not** mint `spell-both-parched` / `spell-parched-mend` |
| Heal if **both leftover AP = 0 and leftover MP = 0** | Still open. Dry Mend (#747) is leftover **AP = 0** only. Dry Gait is leftover **MP = 0** only. | **This pass:** Gaunt Mend |
| Eight-cell occupy | Still open. Twin=2 … Six=6, Sept=7 | **This pass:** Oct Span (hollow 3×3 ring, counts as **eight**) |
| Swap remaining CDs caster ↔ target | Still open. Imprint **copies** (target keeps). Theft **steals**. Grace skips **starting** the next own CD. | **This pass:** Cadence Trade (matching ids; both keep the spells) |
| Mid-RAF splice | Held (AGENTS.md) | Still held |
| Fourth `mpCost > 0` walk snipe | Held (Ley Toll / Undertow / Sanguine Toll) | Still held |
| Sixth echo id | Held | Still held |
| Player-owned Hex of Silence | Held (`BOSS_ONLY`) | Still held |
| Player-owned About Hinge | Held (`BOSS_ONLY` on #590) | Still held. Hostile 180° around a pair midpoint is still Pawn Trade. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after the reserved set **and** after #726 / #747 / #787 / #802. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

Same-day Discovery Wave 13 had **not** opened at authoring (`created:>=2026-10-21` SDE search returned 0 PRs; #815 is admin ACTION_IDs). If a later SDE Wave-13 catalog claims a unique §11 id that matches one below, **SDE wins**; rename is not this pass’s job. Do **not** clone #747 / #802 unique ids (including Dry Mend / Dry Gait). Do **not** ship `spell-parched-mend`. Stamp family / observe metadata onto Wave-13 **tactical** ids only.

Do **not** mint `spell-both-dry` (Dry Mend owns both-leftover-AP heal), `spell-both-parched` / `spell-parched-mend` (Dry Gait owns both-leftover-MP heal), `spell-hex-span` / `spell-octa-span` / `spell-ring-span` / `spell-eight-span` (Oct Span owns eight-cell), `spell-cadence-copy` / `spell-cadence-swap` / `spell-cd-trade` (Cadence Trade owns the swap), or `spell-even-fold` / `spell-even-plate` (Even Hood owns even-Chebyshev miss; do **not** retag `even_gallery`).

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is unchanged since 2026-08-31. Discovery is still inert. WX is **19,213** lines (`wc -l`). Same HEAD as Waves 4–12. `WorldExploration.tsx` lives at `src/frontend/src/components/WorldExploration.tsx` (not `engine/`).

### 1.1 Frontend runtime catalog — `src/frontend/src/data/spellData.ts`

`SPELL_ID_CATALOG` (`src/frontend/src/data/bossKits.ts` 29–62) still lists **32** ids. `WorldExploration.tsx` 2395–2408 still maps **every** `starterSpells` row to `isBaseSpell: true` (“always shown, never removable”).

`ownedSpells` (2410–2440) still unions those 32 with backend rows that pass `shouldIncludeBackendSpellInLibrary`. That helper only drops `usableByPlayer === false` unless the id is already owned. It does **not** create a discovery path.

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

Live `ENEMY_SUMMON_CAP` is still **2** (`gameConstants.ts` 300). Quad Span (#636) counts as four, Penta Span (#695) as five, Six Span (#787) as six, Sept Span (#726) as seven on paper; all four are implementation-blocked until that cap (or a dedicated occupy-weight) exists. Oct Span is the same class: **propose the hole, do not pretend it can ship against cap 2**.

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
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** (tests only) | Unused | Shoulder Bash, Hook Line, Gaunt Step relocates the **caster** onto a free Chebyshev-1 of a both-leftover-0 ally — occupancy dest, not `isSwap` |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768 → WX `swapPositions` 9389–9401) | Swap | Pawn Trade / Ward Interpose / Cadence Trade is **not** `isSwap` (cooldown maps, not tiles) |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, never this set |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire |
| Walk / leftover / force flags | Paper `walkMpSpentThisTurn` (Waves 6–10). Paper `forcedMovedThisTurn` (Wave 9). Leftover AP/MP die at turn end unless Dual Keep / Purse Keep / Stride Keep | Haste grants **now**; Timestep is full **now** | **This pass: Gaunt Mend / Gaunt Hold / Gaunt* / Must Gaunt / Verse Gaunt / Odd Hold / Court Trade** |
| Eight-cell occupy | Twin=2; Triple=3; Quad=4; Penta=5; Six=6; Sept=7 | Absent | **This pass: Oct Span** (hollow 3×3 = 8) |
| Swap remaining CDs | Theft **steals**; Imprint **copies** (target keeps); Rest skips **own** tick; Halve **÷2**; Grace skips **starting** the next own CD | Inferno CD 3 is the only live lock | **This pass: Cadence Trade (swap matching remaining; both keep the spells)** |
| Even-Chebyshev miss | Near ≤ 1; Mid **exactly 2**; Far **≥ 3**; Odd **odd** | Unused live | **This pass: Even Hood (even Chebyshev)** |

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

**Discovery Wave 12 (#802 — still open; never re-propose / never clone):**  
`spell-orth-stride`, `spell-tri-oath`, `spell-brick-reel`, `spell-lone-bite`, `spell-wake-mark`, `spell-gait-plate`, `spell-glyph-skip`, `spell-full-gait`, `spell-summon-gait`, `spell-still-gift`, `spell-cadence-grace`, `spell-cast-debt`, `spell-brick-orbit`, `spell-watch-alms`, `spell-pair-gait`, `spell-leash-cut`, `spell-dry-gait`, `spell-pack-cap`, `spell-reach-fold`.

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` (tactical W2 **and** Discovery W2); `spell-blood-tithe` (tactical W2 pet sacrifice **versus** Discovery W2 HP→AP). Wave 13 does not add a third.

**Do not alias** Gaunt Mend ↔ Dry Mend / Dry Gait / Still Mend / Still Gift / Both Mend / Heave Mend / Shove Mend / Gait Mend / Chase Mend / Clash Mend / Bar Mend / Blood Mend / Parched Mend; Cadence Trade ↔ Cadence Theft / Rest / Grace / Halve / Trim / Shave / Stall / Flush / Stretch / Crack / Break / Lend / Brand / Pin / Imprint; Oct Span ↔ Twin Span / Triple Span / Quad Span / Penta Span / Six Span / Sept Span / Span Guard / Span Pylon / Void Span; Even Hood ↔ Odd Hood / Near Hood / Mid Hood / Far Hood / Fog Hood / Tick Hood / Own Plate / Off Plate / Gait Plate / Sidestep Ward; Gaunt Sting ↔ Dry Sting / Damp Sting / Ready Sting / Lean Sting / Pair Gait / Full Purse / Lone Purse / Pair Purse / Post Sting / Boot Sting / Shove Sting; Gaunt Step ↔ Home Step / Ally Step / Heave Step / Parched Step / Hinge Step / Cover Step / Ghost Step / Soft Step / Bias Step; Gaunt Sill ↔ Quiet Sill / Cast Sill / Drift Sill / Parched Sill / Gift Sill / Wake Mark / Ingress Mark / Dwell Mark; Odd Hold ↔ Dry Hold / Drift Hold / Tool Hold / Boot Hold / Cast Hold / Strike Hold / Hold Ground / Odd Stride / Even Stride; Gaunt Lend ↔ Spent Lend / Boot Lend / Drift Lend / Lean Lend / Leftover Lend / Cadence Lend / Tempo Gift / Watch Lend / Watch Alms; Bare Sip ↔ Gait Sip / Soul Sip / Ap Sip / Drift Sip / Parched Sip / Drain Courage; Gaunt Post ↔ Dummy Post / Drift Post / Lean Post / Bait Pylon / Spark Whelp / Ingress Mark / Dwell Mark / Wake Mark; Gaunt Bounce ↔ Chain Lightning / Ricochet Mark / Split Fang / Heave Bounce / Parched Bounce; Must Gaunt ↔ Must Step / Must Span / Must Pace / Must Drift / Must Lean / Rank Lock / Inch Stride / Cast Hold / Tool Hold; Verse Gaunt ↔ Verse Tax / Verse Pace / Verse Lean / Verse First / Last Mute / Once Verse / Stolen Verse / After Verse / Cast Hold; Gaunt Hold ↔ Strike Hold / Rite First / Tool Hold / Oath Blade / Boot Hold / Lean Hold; Court Trade ↔ Court Dual / Court Keep / Court Stretch / Court Hinge / Court Shove / Court Fold / Court Imprint / Adj Fold / Reach Fold.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved, live, or still held) |
| :--- | :--- | :--- |
| SUPPORT gaunt heal | Heal iff **caster and target** both have leftover **AP = 0 and leftover MP = 0** | Dry Mend is leftover **AP = 0**. Dry Gait / dropped Parched Mend is leftover **MP = 0**. Still Mend is caster **walk MP spent = 0**. Still Gift is **target** spent 0 walk MP. Both Mend is **both walked**. Heave Mend is **both force-moved**. |
| CONTROL CD trade | Swap remaining CDs on **ids both know**; both keep the spells | Cadence Theft **steals**. Cadence Imprint **copies** (target keeps). Cadence Rest skips **own** tick. Cadence Grace skips **starting** the next own CD. Halve **÷2**. Trim **−1**. Pin **freezes one**. |
| SUMMONS eight-cell | Hollow 3×3 ring, counts as **eight**; center hole stays unoccupied | Twin=2. Triple=3. Quad=2×2=4. Penta=plus=5. Six=2×3=6. Sept=stretched plus=7. |
| DEFENSE even hood | Next applied hit from **even** Chebyshev → 0 | Odd is **odd**. Near is **≤ 1**. Mid is **exactly 2**. Far is **≥ 3**. Gait Plate is leftover **MP ≥ 1**, any range. |
| DAMAGE gaunt sting | Bonus iff leftover **AP = 0 and leftover MP = 0** | Dry Sting is leftover **AP = 0** (no MP gate). Lean Sting is leftover **AP = 0 and MP ≥ 1**. Ready is leftover **AP ≥ 1 and MP ≥ 1**. Pair Gait is leftover MP **exactly 2**. |
| POSITION gaunt step | Caster lands on a free Chebyshev-1 of an ally with leftover **AP = 0 and leftover MP = 0** | Home Step is ungated. Parched Step is leftover **MP = 0** only. Heave Step is **force-moved** ally. Ally Step is **they** land next to the caster. |
| TERRAIN gaunt sill | Occupant whose leftover AP=0 **and** leftover MP=0 takes 8 at **start of their turn** | Wake Mark is start-turn detonate **any leftover**. Ingress is **walk enter**. Dwell is **end-turn occupy, any leftover**. Lean Post is a **summon** leftover-AP=0. Parched Sill forbids **walk spend**. |
| CONTROL odd hold | Cannot spend walk MP while leftover AP is **odd** | Dry Hold: until leftover **AP = 0**. Drift Hold: until **force-moved**. Boot Hold: until **Strike**. Cast Hold: cannot **spell** until walk. Odd Stride is **next walk dir**, not leftover parity. |
| SUPPORT gaunt lend | +1 current AP **and** +1 current MP to an ally whose leftover AP=0 **and** leftover MP=0 | Lean Lend is +1 **MP** if leftover **AP = 0**. Drift Lend is +1 **AP** if **forced**. Spent Lend is +1 **MP** if they **walked**. Watch Alms is overwatch +1 AP on a walker. |
| CONTROL bare sip | Steal 1 leftover AP **iff leftover MP = 0** | Parched Sip is leftover **MP** iff leftover **AP = 0**. Gait Sip is **MP** iff they **walked**. Drift Sip is leftover **AP** iff **forced**. Soul Sip is ungated MP. |
| SUMMONS gaunt post | Empty-kit body; **end-turn occupy with leftover AP = 0 and leftover MP = 0** deals 10 and it dies | Lean Post is leftover **AP = 0** only. Drift Post is **relocate landing**. Ingress Mark is **walk enter**. Dwell Mark is **end-turn occupy, any leftover**. Wake Mark is **start-turn** tile. Dummy Post is taunt. |
| DAMAGE gaunt bounce | 12 to primary; bounce 1 to nearest **other** leftover-AP=0-and-leftover-MP=0 hostile | Parched Bounce is leftover **MP = 0**. Heave Bounce is **force-moved**. Chain Lightning bounces to nearest **any**. |
| CONTROL must-gaunt | Remaining **non-Strike** spells illegal unless leftover MP = 0 **and** this spell spends last AP | Must Lean is leftover **MP = 0** only. Cast Hold bans **all** spells until they **walk**. Tool Hold bans tools until **Strike**. Must Drift is walk **dir**. |
| CONTROL verse gaunt | Last resolved id is **illegal until leftover AP = 0 and leftover MP = 0** | Verse Lean is until leftover **MP = 0**. Verse Pace is until they **walk**. Last Mute is duration. Verse Tax is legal but **+1 AP**. |
| CONTROL gaunt hold | Strike illegal unless leftover MP = 0 **and** leftover AP before Strike equals Strike’s AP cost | Lean Hold is leftover **MP = 0** only. Strike Hold is until they **walk**. Rite First is until a **spell**. Tool Hold is cannot-tool-until-Strike. |
| SUPPORT mass trade | Signature: Cadence Trade on **every other** body (chained, init order) | Court Imprint is mass Imprint. Reach Fold is Chebyshev-exactly-2 **position** swap, `BOSS_ONLY`. Player never owns this. |
| RESOURCE fourth MP snipe | — | **Held forever** with Ley Toll / Undertow / Sanguine Toll |
| Sixth echo | — | Held for Discovery |
| Full-bar silence | — | Hex of Silence stays `BOSS_ONLY` |
| Mid-RAF splice | — | Held (AGENTS.md) |
| Nine-cell occupy | — | **Skipped**. Wave 14 (solid 3×3). |
| Remaining CDs floor to 1 | — | **Skipped**. Wave 14 Cadence Floor. |

**Still open after this wave (do not fill today):** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; a sixth echo id; player-owned Hex of Silence; player-owned About Hinge (stays `BOSS_ONLY`); nine-cell occupy; remaining CDs `max(1)` floor; heal-if leftover AP **equals** leftover MP (including both nonzero); invert leftover AP with leftover MP on one body. Those stay Wave 14 / Discovery so this pass stays discrete.

---

## 3. Contract with Dynamic Spell Discovery

Coordinate with Discovery (`c26e5a83-…`) and Admin (`4efa22ec-…`). This pass only stamps acquisition so those layers can filter **by field**. Same-day Discovery Wave 13 had not opened at authoring — **do not mint or clone #747 / #802 unique §11 ids**. If SDE Wave 13 later claims one of this catalog’s ids, **SDE wins**.

### 3.1 Discovery is still inert (reconfirmed @ `0f5363f`)

1. All 32 frontend spells are forced `isBaseSpell` (`WorldExploration.tsx` 2395–2408).
2. Recap grants XP/Doka/feats only.
3. Achievements (`defaultAchievements`, `admin.mo` 309–326) grant Doka only.
4. Challenges grant Doka/XP/badge only.
5. `upgradeSpell` levels a known id; it does not unlock ids.
6. `ENEMY_KITS` (`enemyAI.ts` 163–185) still reuse always-owned ids. Seeing a bishop cast Frost teaches nothing.
7. `buildEnemyKit` still takes `currentMap.levelZone` (`WorldExploration.tsx` 11920). The zone object is `{ name, minLevel, maxLevel }` (4683–4687). `Math.floor(levelZone)` is `NaN` (`enemyAI.ts` 194–199) → every kit stays zone 0.
8. `executeCastAttempt` still does not debit `spell.mpCost`. This pass adds **zero** `mpCost > 0` rows, so it does not widen that bug.
9. No `ownedSpellIds` / `observedSpellIds` persist maps. Character still has `spellLevelKeys` / `spellBarOrder` (`main.mo` 132–142).

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 13 ids to `starterSpells` as base. Do **not** land Wave-13 data before Wave-1 ownership split (`SDE-2026-08-31-001`) through Wave-12 (#787 / #802) data. **Do not ship** `spell-parched-mend`.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "octspan"` and `"gauntpost"` are **string enums on the config**.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Gaunt Mend / Cadence Trade / Even Hood / Gaunt Sting / Odd Hold / Gaunt Lend / Bare Sip / Must Gaunt / Verse Gaunt / Gaunt Hold **arming** (AP spent) **is** observation, including a blocked / unmoved / no-last-id / leftover-gate fizzle after AP. Later consume / convert / peel is **not** a second observe.
- Gaunt Sill **paint** is observation. Later start-turn tax is not a second observe.
- Gaunt Step / Gaunt Bounce **cast** (AP spent) **is** observation, including a bounce that finds no second body.
- Oct Span / Gaunt Post **summon** is observation. Later occupy / detonate / death / hole-trap is not a second observe.
- Court Trade **arm** is observation for witness-only kits. Never written to owned ids.
- Do not require “see it N times” except where a boss adaptation already does. Wave 13 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.
- Do not stamp `survivor` (Last Ember / Last Ward). #646 / #679 / #747 / #802 left that feat leftover on purpose.

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

**Every live feat and every live challenge id is already a sole spell door or a MULTI child.** Wave 13 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 13 does **not** invent a 16th feat. #590 already stamped leftover `leader_slayer` / `spell_master` MULTI children (Crown Cut / Full Bar). SDE Wave 7 already claimed leftover `hard_1` / `legendary_1` MULTI children (Thin Ward / Clean Blood).

**Live 19 first-wins are all taken (do not restamp as the only door):**  
`starborn_queen` (Cut In), `pale_archivist` (After Verse), `starved_vampire_pawn` (Sanguine Toll), `lord_of_static` (Draw Together), `final_pawn` (Eclipse Fold), `mirror_sovereign` (Echo Cast), `crimson_countess` (Crimson Pact), `void_grandmaster` (Twin Gate), `midnight_bishop` (Life Tether), `chessboard_lich` (Claim Ward), `twin_monarchs` (Choir Hymn), `alabaster_fortress` (Pain Link / Aftershock), `bone_cavalier` (Vault / Caltrop), `pale_archbishop` (Reliquary / Glyph Snare extras), `fetid_rook` (Rot Brand), `broodmother_rook` (Brood Ward), `weeping_pawn` (Mute Thread, #411), `eternal_pawn_king` (Queue Cut, #411), `enthroned_void` (File Vault MULTI child, #411). `second_lament` remains kit-only False Cut.

**Wave-5…12 boss extra doors — do not restamp:** `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`, `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`, `mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`, `gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`, `toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`, `crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`, `sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`, `infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`.

**Wave-13 boss extra doors (#808 — do not restamp):** `flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`. `CHOIR_FLUSH` / `CHOIR_LONE` / `NAVE_PLATE` / `CHOIR_LEND` stay `BOSS_ONLY`.

**Wave-6…12 tactical extra doors — do not restamp:** `oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`, `pace_prelate`, `span_triune`, `wick_mason`, `slip_castellan`, `court_usher`, `gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`. `parched_cantor` is **not** Dry Gait’s door and **not** Gaunt Mend’s door.

**Wave-8…12 SDE extras — do not restamp:** `about_hinge_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `pair_gallery`, `knight_fold_regent`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `cap_precentor`, `reach_fold_regent`. Do **not** retag `even_gallery` as Even Hood.

**New proposed extra doors for the boss designer (Wave 14 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `gaunt_cantor` first-win | Gaunt Mend MULTI child (observe+win still grants). `parched_cantor` stays the dropped Parched Mend slot — **do not reuse**. Dry Mend / Dry Gait have **no** extra door — do not invent `dry_cantor` / `gait_cantor` (the latter is Wave-8 Gait Mend). |
| `trade_precentor` first-win | Cadence Trade MULTI child. `imprint_precentor` stays Imprint. `halve_precentor` stays Halve. `cap_precentor` stays Pack Cap (`ENEMY_ONLY`). |
| `span_oct` first-win | Oct Span MULTI child. `span_six` stays Six Span. `span_sept` stays Sept Span. `span_penta` stays Penta Span. `span_quad` stays Quad Span. `span_triune` stays Triple Span. |
| `court_trade_regent` kit only | Court Trade (`NOT_PLAYER_LEARNABLE`). `court_imprint_regent` stays Court Imprint. `reach_fold_regent` stays Reach Fold. `adj_fold_regent` stays Adj Fold. |

Piece-type observe paths (not feat doors): cantors / bishops for Gaunt Mend; scribes / tempo for Cadence Trade; masons / rooks ELITE for Oct Span; lurkers / knights for Even Hood; lurkers / pawns for Gaunt Sting; porters / queens for Gaunt Step; masons / rooks for Gaunt Sill; hex / knights for Odd Hold; buffers / bishops for Gaunt Lend; hex / pawns for Bare Sip; masons / pawns for Gaunt Post; queens / bishops for Gaunt Bounce; knights / pawns for Must Gaunt; hex / bishops for Verse Gaunt; knights / pawns for Gaunt Hold.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #787 / #802 key names for a different meaning.

`mpCost` stays 0 on every Wave-13 row.

**New keys (Wave 13 only):**

```text
requireCasterLeftoverApEq0, requireCasterLeftoverMpEq0,
requireTargetLeftoverApEq0, requireTargetLeftoverMpEq0, gauntMendAmount,   // Gaunt Mend
tradeMatchingCds,                                                         // Cadence Trade — swap matching remaining; both keep spells
octSpanCells, octSpanHole,                                                // Oct Span — 8; hollow 3×3, center unoccupied
evenHoodNextHit,                                                          // Even Hood — next hit even Chebyshev → 0
gauntLeftoverApEq0, gauntLeftoverMpEq0, gauntStingBonus,                  // Gaunt Sting
gauntStepNeedBothLeftoverEq0, gauntStepAdj,                               // Gaunt Step — dest Chebyshev 1 of target
gauntSillNeedBothLeftoverEq0, gauntSillDamage, gauntSillDuration,         // Gaunt Sill — start-of-their-turn tax
oddHoldWhileLeftoverApOdd, oddHoldDuration,                               // Odd Hold — 2 of their turns
gauntLendAp, gauntLendMp, requireTargetBothLeftoverEq0Lend,               // Gaunt Lend — +1 AP and +1 MP iff both leftover 0
bareSipAp, requireTargetLeftoverMpEq0Sip,                                 // Bare Sip — steal 1 leftover AP iff leftover MP = 0
gauntPostDetonateDamage, gauntPostNeedBothLeftoverEq0,                    // Gaunt Post — 10 on end-turn occupy if both leftover 0
gauntBounceNeedBothLeftoverEq0, gauntBounceSearchRadius, gauntBounceCount, // Gaunt Bounce
mustNonStrikeUnlessLeftoverMpEq0AndSpendsLastAp,                          // Must Gaunt
verseGauntUntilBothLeftoverEq0,                                           // Verse Gaunt
gauntHoldStrikeUnlessLeftoverMpEq0AndSpendsLastAp,                        // Gaunt Hold — Strike only as last AP of a dry-walk turn
courtTradeExcludeCaster                                                   // Court Trade
```

If a key is missing, the rider does not fire.

Nested kit-only id (not a player card): none new besides Court Trade itself. Gaunt Post’s detonate is **not** a second spell id (the summon row carries `gauntPostDetonateDamage`). Do not mint `spell-gaunt-burst`.

Leftover AP / leftover MP are **current remaining after this spell’s AP is paid**, read from the same pools the HUD uses. Walk spends must write leftover MP. Spell spends must write leftover AP. Missing leftover → the gate fails closed (fizzle rider, AP spent, observe). Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count as leftover for these gates.

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Cadence Trade’s swap is paid in **matching remaining locks**, not in extra AP. Gaunt Mend’s 8 is paid in **two empty bars on two bodies**.

Do **not** put Must Gaunt and Gaunt Hold in the same CORE: together they force every last AP packet of a dry-walk turn onto a single verb.

---

## 5. Proposed spells (Wave 13)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-gaunt-mend`

NAME: Gaunt Mend  
ROLE: SUPPORT — heal if caster **and** target both have leftover AP = 0 **and** leftover MP = 0  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"requireCasterLeftoverApEq0":true,"requireCasterLeftoverMpEq0":true,"requireTargetLeftoverApEq0":true,"requireTargetLeftoverMpEq0":true,"gauntMendAmount":8}`. If **both** caster and target have leftover AP **= 0** **and** leftover walk MP **= 0** at resolve (after this spell’s 3 AP is paid), heal the target 8 through the existing heal helper. If any of the four leftover reads is ≥ 1, fizzle rider (AP spent, no HP). Walk / force-move flags do **not** substitute. Distinct from Dry Mend (#747, both leftover **AP = 0**, MP unconstrained), Dry Gait (#802, both leftover **MP = 0**, AP unconstrained), dropped Parched Mend (same hole as Dry Gait — **do not ship**), Still Mend (#747, caster **spent 0 walk MP**), Still Gift (#802, **target** spent 0 walk MP), Both Mend (#695, both **walked**), Heave Mend (#726, both **force-moved**). The decision: two bodies dump **both** pools, then 8 — Dual Keep / Stride Keep / Purse Keep **block** this until the bank is spent. `healAmount` stays 0 on the row so `inferArchetype` (`enemyAI.ts` 447–452) does not treat a kit that only *carries* this id as healer unless the resolver actually wrote HP; **healer CORE only** when the row is in a live pool.  
DURATION: instant  
SCALING: 8 follows heal% if any; amount otherwise fixed.  
SYNERGIES: Walk Toll / Must Step / Drain Courage to dump both bars; Dual Keep / Stride Keep / Purse Keep **blocks** this until they spend the bank; Bare Sip / Parched Sip to land a leftover 0.  
COUNTERPLAY: Keep 1 leftover AP **or** 1 leftover MP; Cursed Wound; kill the cantor first.  
POWER_BUDGET: Standard heal, gated on **four** leftover-0 flags. Blood Mend is 12 ungated self. Dry Mend and Dry Gait are single-resource twins — do not stack Gaunt Mend with either in the same CORE.  
AI_USAGE: `aiHint: "heal_if_both_bodies_leftover_ap_eq_0_and_leftover_mp_eq_0"`. Cantors / bishops. Skip if any leftover ≥ 1. **Healer CORE only.** Do not dump leftover **only** to enable this if a Strike would kill.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop","queen"], levelZoneMin: 1 }`. MULTI child `gaunt_cantor`.  
EDGE_CASES: Targeting ally already allows self (`targeting.ts` 184–189). Self-cast requires the caster’s leftover AP and leftover MP are both 0 (one body, four keys, two reads). Player-side HP actually increased → `challengeHealUsedRef`. Missing keys → no heal. Do not clone Dry Mend or Dry Gait. Do not ship Parched Mend.  
IMPLEMENTATION_COMPLEXITY: LOW — four leftover reads + existing heal helper.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-gaunt-mend
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
effectParams: {"requireCasterLeftoverApEq0":true,"requireCasterLeftoverMpEq0":true,"requireTargetLeftoverApEq0":true,"requireTargetLeftoverMpEq0":true,"gauntMendAmount":8}
```

---

### SPELL_ID: `spell-cadence-trade`

NAME: Cadence Trade  
ROLE: CONTROL — swap remaining CDs on matching ids  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"tradeMatchingCds":true}`. For each spell id that appears in **both** remaining-CD maps, swap the two remaining integers (0 included). Target **keeps every spell**; caster **keeps every spell**; only the remaining numbers move. Ids only one side owns are ignored (no stolen kit, no gifted kit). Once/battle flags and spell levels are **not** CDs. Distinct from Cadence Theft (#411, **steals** remaining — target loses the lock), Cadence Imprint (#787, **copies** `max(caster, n)` onto the caster; target keeps), Cadence Rest (#747, **own** remaining do not tick), Cadence Grace (#802, **next own spell does not start** its cooldown), Cadence Halve (#726, **÷2** on the hostile), Cadence Trim (−1 on the hostile). The decision: give them your Inferno 0 and take their Inferno 3 — or skip because you wanted that id this turn.  
DURATION: instant rewrite of both matching remaining maps  
SCALING: none.  
SYNERGIES: Verse Gaunt / Must Gaunt after you took a 3-lock; Halve them **before** Trade if you do not want a 3; Imprint is the one-way cousin — do not stack both in the same CORE.  
COUNTERPLAY: Do not hold a 3-lock against a tempo bishop if your matching id is at 0; recast the locked id **before** Trade; Cadence Crack their highest to 0 before they swap.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **exchanged downtime**, not a steal and not a copy.  
AI_USAGE: `aiHint: "trade_if_target_matching_remaining_minus_caster_matching_remaining_ge_2"`. Scribes / tempo. Skip if no shared id where `|their remaining − our remaining| ≥ 2`, or if the caster’s next intended id would lock after the swap.  
DISCOVERY_ELIGIBILITY: true. MULTI child `trade_precentor`. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing key → no rewrite. Do not write `spellLevelValues`. Do not reset Dual Keep’s once/battle. Preview must show **both** maps after the swap. Empty intersection → fizzle rider (AP spent, observe). Swapping 0 with 0 is a legal no-op that still observes.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — intersect two cooldown maps by id and swap integers.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-cadence-trade
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
effectParams: {"tradeMatchingCds":true}
```

---

### SPELL_ID: `spell-oct-span`

NAME: Oct Span  
ROLE: SUMMONS — eight-cell occupy (hollow 3×3 ring)  
ACQUISITION: MULTI_SOURCE  
AP_COST: 4  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "octspan"`, `summonLifespan: 4`, empty kit (`summonUnitDef` with `pieceType: ""` / zero scales — a body, not a caster). `effectParams: {"octSpanCells":8,"octSpanHole":true}`. Click a free ground tile as the **center hole**. All 8 Chebyshev-1 neighbors must be free and in-bounds (`isCellFree`); else fizzle (AP spent). One combatant id, eight-cell footprint. The **center stays unoccupied** by the summon (walkable / targetable). Counts as **eight** toward the summon cap. Distinct from Twin Span (2 walking), Triple Span (3), Quad Span (2×2 = 4), Penta Span (ortho plus = 5), Six Span (2×3 = 6), Sept Span (stretched plus = 7). The decision: seal a one-cell cage for eight cap — a unit already on the hole cannot walk out through the ring — or you cannot afford the weight.  
DURATION: lifespan 4  
SCALING: footprint fixed.  
SYNERGIES: File Lance / Cast Sill / Gaunt Sill on the hole; Quiet Sill on a corner so Strike cannot peel through; Swap / Reach Fold to extract a trapped ally.  
COUNTERPLAY: Occupy any of the 8 before paint; stand off the intended hole; Coup the body (one HP pool); blink / swap out of the hole; walk around the ring.  
POWER_BUDGET: Heavy 4 / CD 3 / 0 damage. Power is **eight** cells of deny plus a one-cell cage.  
AI_USAGE: `aiHint: "oct_span_if_eight_free_ring_and_hole_occupied_by_player_and_cap_allows"`. Masons / rooks ELITE. Skip if any ring cell is occupied **or** remaining summon weight + 8 would exceed cap. Prefer a hole the player already occupies.  
DISCOVERY_ELIGIBILITY: true. MULTI child `span_oct`. `pieceTypes: ["rook"]`, `levelZoneMin: 2`  
EDGE_CASES: **Do not ship while `ENEMY_SUMMON_CAP === 2` without occupy-weight.** Never parse `"Oct Span"` / `"Octagon"` / `"Ring"`. One id, eight cells — destroying the body frees all eight **and** the hole. Player-side Oct Span counts toward the **player** summon economy, not `ENEMY_SUMMON_CAP`. Missing `octSpanCells` → do not spawn a 1-cell body and call it Oct Span. Missing `octSpanHole` → do not fill the center. Off-map neighbor → fizzle. Do not mint `spell-hex-span` / `spell-ring-span` / `spell-eight-span`.  
IMPLEMENTATION_COMPLEXITY: HIGH — multi-cell occupy + cap weight + hollow center. Same class as Quad / Penta / Six / Sept.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-oct-span
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
summonAI: octspan
summonLifespan: 4
usableByPlayer: true
usableByEnemy: true
minLevel: 2
isBaseSpell: false
effectParams: {"octSpanCells":8,"octSpanHole":true}
```

---

### SPELL_ID: `spell-even-hood`

NAME: Even Hood  
ROLE: DEFENSE — next hit from even Chebyshev is 0  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"evenHoodNextHit":true}`. The next **applied** damaging hit whose Chebyshev distance from the attacker’s tile to this unit is **even** (0, 2, 4, …) deals 0 and consumes the charge. Odd-Chebyshev hits (1, 3, 5, …) land and **do not** consume. Distinct from Odd Hood (#787, **odd**), Near Hood (≤ 1 — consumes on 1, which is odd), Mid Hood (**exactly 2**, even — a subset), Far Hood (**≥ 3**, mixed), Gait Plate (#802, leftover **MP ≥ 1**, any range), Own Plate (next hit on **your turn**, any range), Sidestep Ward (next hit any range). The decision: stand at odd range against a bishop’s range-2, or bait the mid-file poke into a 0.  
DURATION: until consumed or this unit’s next turn start (whichever first)  
SCALING: none.  
SYNERGIES: Must Step forces Chebyshev-1 walks (odd — they **land**); Odd Hood stacks poorly (parity split). Mid Hood is the exact-2 subset — do not CORE both.  
COUNTERPLAY: Hit from odd Chebyshev (Strike adjacent is 1 — **odd**, so melee lands; step to 2 then Strike to consume). Do **not** retag `even_gallery`.  
POWER_BUDGET: Cheap 2 / CD 2. Next-hit only. Elite because it blanks the common 0-and-2 bands (self-tile and Mid).  
AI_USAGE: `aiHint: "even_hood_if_likely_next_hit_even_chebyshev"`. Lurkers / knights. Skip if the only threat sits at 1.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 2`  
EDGE_CASES: Consume **before** `dealDamage`. Do not read `CharacterStats.evasion`. Self-damage / same-cell is Chebyshev 0 (even) — **whiffs and consumes**. Missing key → no negate. Do not mint `spell-even-fold` / `spell-even-plate`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — next-hit consume gated on Chebyshev parity.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gaunt-sting`

NAME: Gaunt Sting  
ROLE: DAMAGE — bonus if leftover AP = 0 **and** leftover MP = 0  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target’s leftover AP **= 0** **and** leftover walk MP **= 0** at resolve, deal an extra 8 as a second existing `dealDamage` call (`effectParams: {"gauntLeftoverApEq0":true,"gauntLeftoverMpEq0":true,"gauntStingBonus":8}`). Otherwise 10 only. Distinct from Dry Sting (leftover **AP = 0**, no MP gate), Lean Sting (#787, leftover **AP = 0 and MP ≥ 1**), Ready Sting (leftover **AP ≥ 1 and MP ≥ 1**), Damp Sting (leftover **MP ≥ 2**), Pair Gait (#802, leftover MP **exactly 2**), Pair Purse (leftover AP **exactly 2**). The decision: dump **both** bars and you are the Gaunt Sting window; keep a 1-MP chip and Lean Sting is the cousin, not this.  
DURATION: instant  
SCALING: both numbers follow dmg%.  
SYNERGIES: Drain Courage + Walk Toll to land both leftover 0; Dual Keep / Stride Keep **blocks** the bonus; Gaunt Mend wants the same window on allies.  
COUNTERPLAY: Keep 1 leftover AP **or** 1 leftover MP; bank with Purse Keep / Dual Keep.  
POWER_BUDGET: Cheap 2 / CD 1. 18 only on the two-flag empty window. Frost-adjacent **if** they sit fully spent.  
AI_USAGE: `aiHint: "bonus_if_leftover_ap_eq_0_and_leftover_mp_eq_0"`. Lurkers / pawns. Skip if either gate fails and Strike is better.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["pawn"]`, `levelZoneMin: 1`  
EDGE_CASES: After this spell’s cost is **their** leftover, not the caster’s. Missing keys → 10 only.  
IMPLEMENTATION_COMPLEXITY: LOW — two leftover reads + optional second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gaunt-step`

NAME: Gaunt Step  
ROLE: POSITION — caster lands adjacent to an ally with leftover AP = 0 **and** leftover MP = 0  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"gauntStepNeedBothLeftoverEq0":true,"gauntStepAdj":1}`. If the target’s leftover AP **= 0** **and** leftover walk MP **= 0**, relocate the **caster** onto a free Chebyshev-1 of the target (`isCellFree`). If no free dest, or either leftover ≥ 1, fizzle (AP spent, caster stays). Not `isSwap`. Distinct from Home Step (ungated caster → ally), Parched Step (#787, leftover **MP = 0** only), Heave Step (#726, ally must be **force-moved**), Ally Step (they land next to the caster), Cover Step. The decision: park an ally at both leftover 0, then step to them — Dual Keep on that ally **blocks** arrival.  
DURATION: instant relocate  
SCALING: none.  
SYNERGIES: Walk Toll / Drain Courage dump their bars; Gaunt Mend after both sit empty; Oct Span hole as the dest ring.  
COUNTERPLAY: Keep 1 leftover AP **or** 1 leftover MP on the ally; occupy every Chebyshev-1; Root the caster.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is a gated blink-to-ally.  
AI_USAGE: `aiHint: "gaunt_step_if_ally_both_leftover_eq_0_and_free_adj"`. Porters / queens. Skip if either leftover ≥ 1 or no free dest.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Dest hazards must tick (MIMA push/pull × hazards). Do not write `currentView` (facing cards still fail closed). Missing keys → no relocate. Self-target is illegal (need a second body).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy dest pick, not `swapPositions`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gaunt-sill`

NAME: Gaunt Sill  
ROLE: TERRAIN — occupant fully spent at **start of their turn** takes 8  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: Paint one free cell 2 turns. `effectParams: {"gauntSillNeedBothLeftoverEq0":true,"gauntSillDamage":8,"gauntSillDuration":2}`. When a body **starts their turn** occupying the cell, if leftover AP **= 0** **and** leftover MP **= 0**, deal 8 through `dealDamage` and keep the paint (can tax again next start). If either leftover ≥ 1 (Dual Keep / Purse Keep / Stride Keep / unspent last turn), no damage, paint remains. Walk-on, force-move, swap, blink onto or off are legal. Distinct from Wake Mark (#802, start-turn detonate **any leftover** and is a one-shot mark), Ingress Mark (walk **enter**), Dwell Mark (end-turn occupy, **any leftover**), Lean Post (summon leftover **AP = 0**), Parched Sill (occupant cannot **spend walk MP**). The decision: camp fully spent on the tile and eat 8, or keep a 1-chip bank and the tax misses.  
DURATION: 2 turns  
SCALING: 8 follows dmg% if the painter’s SP applies to tile ticks; otherwise fixed.  
SYNERGIES: Walk Toll / Drain Courage to empty them **before** their turn start; Dual Keep **saves** them; Gaunt Sting wants the same window on your turn, this tax wants it on **theirs**.  
COUNTERPLAY: Do not end the turn fully spent on it; swap off; Dual Keep; wait the 2.  
POWER_BUDGET: Cheap 2 / CD 2. Tile-scoped start-turn tax, gated.  
AI_USAGE: `aiHint: "gaunt_sill_on_likely_fully_spent_camp"`. Masons / rooks. Skip if the player can Dual Keep or walk off for 1 MP.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Paint is observation. Later tax is not a second observe. Missing keys → no paint. Controlled-summon turn starts honor the tile (MIMA occupancy). Do not clone Wake Mark.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — tile flag on turn-start leftover reads.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-odd-hold`

NAME: Odd Hold  
ROLE: CONTROL — cannot walk while leftover AP is odd  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: `effectParams: {"oddHoldWhileLeftoverApOdd":true,"oddHoldDuration":2}`. For 2 of **their** turns, confirm of a walk spend fails (MP not spent) while leftover AP is **odd** (1, 3, 5, …). Even leftover AP (0, 2, 4, …) may walk. Force-move / swap / blink still legal. Distinct from Dry Hold (#787, cannot walk until leftover **AP = 0** — 0 is even, so Dry Hold is stricter after dumping to 1), Drift Hold (until **force-moved**), Boot Hold (until **Strike**), Cast Hold (cannot **spell** until walk), Odd Stride (#590, **next walk must be odd-dir**, leftover unconstrained), Even Stride (#533, next walk even-dir). The decision: spend 1 more AP to even the pool, then walk — or skip the walk.  
DURATION: 2 of the target’s turns  
SCALING: none.  
SYNERGIES: Drain Courage to land leftover AP on 1; Must Gaunt wants last-AP spells (often leaves 0, which is even — walk legal). Dry Hold is the stricter cousin — do not CORE both.  
COUNTERPLAY: Spend 1 AP (Strike is 2 — even delta; a 3-cost Frost from 6 leaves 3, still odd); wait the 2; swap off.  
POWER_BUDGET: Standard 3 / CD 2 / 0 damage. Elite because leftover **parity** is a new walk key.  
AI_USAGE: `aiHint: "odd_hold_if_target_leftover_ap_odd_and_wants_to_walk"`. Hex / knights. Skip if leftover AP is already even and they have no 3-cost in kit.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: After this spell’s 3 AP is **the caster’s** leftover, not the target’s. Missing keys → no lock. Do not alias Odd Stride. Confirm fail does not spend MP.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — walk confirm gated on leftover-AP parity.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gaunt-lend`

NAME: Gaunt Lend  
ROLE: SUPPORT — +1 AP and +1 MP if the ally is fully spent  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"gauntLendAp":1,"gauntLendMp":1,"requireTargetBothLeftoverEq0Lend":true}`. If the target’s leftover AP **= 0** **and** leftover MP **= 0**, grant +1 current AP and +1 current walk MP (HUD pools, not a duration buff). If either leftover ≥ 1, fizzle rider (AP spent, no grant). Distinct from Lean Lend (#787, +1 **MP** if leftover **AP = 0**), Drift Lend (+1 **AP** if **forced**), Spent Lend (+1 **MP** if they **walked**), Tempo Gift / Loan Tempo (ungated / paper MP), Watch Alms (#802, overwatch +1 AP **on a walker**). The decision: dump both bars, then ask the bursar for a 1/1 refill — or keep a chip and the lend misses.  
DURATION: instant pool write  
SCALING: none.  
SYNERGIES: Gaunt Mend wants them empty for 8 HP **or** Gaunt Lend wants them empty for 1/1 — pick one window; Dual Keep **blocks** this.  
COUNTERPLAY: Keep 1 leftover; kill the bursar; Cursed Wound does not apply (not a heal).  
POWER_BUDGET: Cheap 2 / CD 2. 1/1 is small; the gate is the power.  
AI_USAGE: `aiHint: "lend_1ap_1mp_if_ally_both_leftover_eq_0"`. Buffers / bishops. Skip if either leftover ≥ 1 or if Gaunt Mend would save a kill.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Self-target legal if the caster’s leftover is already 0/0 **after paying 2 AP** (so they must have started the cast at leftover AP = 2 and leftover MP = 0). Missing keys → no grant. Do not write Dual Keep’s once/battle.  
IMPLEMENTATION_COMPLEXITY: LOW — two leftover reads + two pool increments.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-bare-sip`

NAME: Bare Sip  
ROLE: CONTROL — steal 1 leftover AP iff leftover MP = 0  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 8. If the target’s leftover walk MP **= 0** and leftover AP **≥ 1**, steal 1 leftover AP (their current AP −1, caster current AP +1, clamp at 0 / kit max). `effectParams: {"bareSipAp":1,"requireTargetLeftoverMpEq0Sip":true}`. If leftover MP ≥ 1 or leftover AP = 0, 8 only (no steal). Distinct from Parched Sip (#787, steal leftover **MP** iff leftover **AP = 0** — the inverse window), Gait Sip (MP iff they **walked**), Drift Sip (leftover AP iff **forced**), Soul Sip (ungated MP), Drain Courage (ungated AP debit + drain). The decision: dump walk and keep spell chips — you are the Bare Sip window. Lean Sting is leftover AP=0 **and** leftover MP≥1, the other diagonal.  
DURATION: instant  
SCALING: 8 follows dmg%. Stolen AP is 1, unscaled.  
SYNERGIES: Walk Toll to land leftover MP 0 while they still hold AP; Odd Hold wants leftover AP odd — stealing 1 flips parity.  
COUNTERPLAY: Keep 1 leftover MP; dump leftover AP first; Dual Keep leftover MP blocks the steal.  
POWER_BUDGET: Cheap 2 / CD 1. 8 + optional 1 AP. Inverse of Parched Sip — do not CORE both.  
AI_USAGE: `aiHint: "steal_1_leftover_ap_if_leftover_mp_eq_0"`. Hex / pawns. Skip if leftover MP ≥ 1 or leftover AP = 0 and Strike is better.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["pawn"]`, `levelZoneMin: 1`  
EDGE_CASES: After this spell’s cost is **their** leftover. Caster AP +1 does not ignore their own turn cap if one exists; clamp. Missing keys → 8 only.  
IMPLEMENTATION_COMPLEXITY: LOW — leftover MP gate + 1 AP steal + existing `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gaunt-post`

NAME: Gaunt Post  
ROLE: SUMMONS — empty-kit body; end-turn occupy detonates iff fully spent  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "gauntpost"`, `summonLifespan: 3`, empty kit. `effectParams: {"gauntPostDetonateDamage":10,"gauntPostNeedBothLeftoverEq0":true}`. Place on a free cell. Counts as **one** toward the summon cap. At the **end of a unit’s turn**, if that unit occupies this cell and leftover AP **= 0** **and** leftover MP **= 0**, deal 10 to that occupant and the post dies. Leftover AP ≥ 1 **or** leftover MP ≥ 1 is safe (no damage, post stays). Walk-on is legal. Relocate-landing is legal and does **not** detonate (Drift Post owns relocate). Start-of-turn occupy does **not** detonate (Wake Mark / Gaunt Sill own start-of-turn). Distinct from Lean Post (#787, leftover **AP = 0** only), Dummy Post (taunt), Drift Post (relocate-landing), Ingress Mark (walk **enter**), Dwell Mark (end-turn occupy, **any leftover**), Wake Mark (start-turn tile). The decision: end fully spent on the post and eat 10, or keep a 1-chip and camp.  
DURATION: lifespan 3 or until detonate  
SCALING: 10 follows dmg% of the **post’s owner** if SP applies to tile ticks; otherwise fixed.  
SYNERGIES: Walk Toll / Drain Courage to empty them before end of turn; Dual Keep **saves** them; Gaunt Sill taxes **start** of the next turn if they survive.  
COUNTERPLAY: Do not end fully spent on it; Coup the post; keep 1 leftover.  
POWER_BUDGET: Standard 3 / CD 3 / 0 on place. 10 is a gated mine.  
AI_USAGE: `aiHint: "gaunt_post_on_likely_fully_spent_end_tile"`. Masons / pawns. Skip if the player can Dual Keep or walk off.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["pawn","rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Summon is observation. Later detonate is not a second observe. Missing keys → place a dummy with no mine (do not). Cap 1 is legal while `ENEMY_SUMMON_CAP === 2`. Never parse `"Gaunt Post"`. Do not mint `spell-gaunt-burst`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — empty summon + end-turn leftover gate. Same class as Lean Post.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gaunt-bounce`

NAME: Gaunt Bounce  
ROLE: DAMAGE — bounce among fully-spent hostiles  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Deal 12 to the primary. Then bounce **once** to the nearest **other** hostile whose leftover AP **= 0** **and** leftover MP **= 0**, dealing 8 (`effectParams: {"gauntBounceNeedBothLeftoverEq0":true,"gauntBounceSearchRadius":4,"gauntBounceCount":1}`). If no second body matches, 12 only (still observes). Distinct from Parched Bounce (#787, leftover **MP = 0** only), Heave Bounce (#726, **force-moved**), Chain Lightning (nearest **any**, 2 bounces), Ricochet Mark, Split Fang. The decision: dump both bars on two bodies in a 4-Chebyshev cluster — or keep a chip on the second body and the bounce dies.  
DURATION: instant  
SCALING: both numbers follow dmg%.  
SYNERGIES: Walk Toll / Drain Courage on two hostiles; Dual Keep on the second body **saves** them; Chain Lightning is the ungated cousin — do not CORE both.  
COUNTERPLAY: Keep 1 leftover on every body but the primary; spread past radius 4.  
POWER_BUDGET: Standard 3 / CD 2. 20 only if a second fully-spent body is in range.  
AI_USAGE: `aiHint: "bounce_if_second_hostile_both_leftover_eq_0_in_r4"`. Queens / bishops. Skip if no second match and Frost is better.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Primary does **not** need leftover 0 (the bounce does). Search ignores the primary and allies. Missing keys → 12 only.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — existing bounce search with two leftover gates.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-must-gaunt`

NAME: Must Gaunt  
ROLE: CONTROL — non-Strike spells illegal unless leftover MP = 0 **and** this spell spends last AP  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: `effectParams: {"mustNonStrikeUnlessLeftoverMpEq0AndSpendsLastAp":true}`. For the rest of **this battle** (or until cleanse if one exists — Absolve / Dispel Thread; default **no** duration tick, peel only by those ids), the target’s remaining **non-Strike** spells confirm-fail unless leftover walk MP **= 0** **and** leftover AP **after paying that spell** would be 0. Strike remains legal under its own rules. Distinct from Must Lean (#787, leftover **MP = 0** only — leftover AP unconstrained), Cast Hold (cannot **any** spell until they **walk**), Tool Hold (cannot-tool-until-Strike), Must Drift (walk **dir**). The decision: on a dry-walk turn, dump the entire leftover AP on **one** last spell — or skip spells and Strike.  
DURATION: rest of battle (peel ids only)  
SCALING: none.  
SYNERGIES: Walk Toll to land leftover MP 0; Odd Hold wants leftover AP odd — a last-AP 3-cost from leftover 3 is even-to-0 and also satisfies Must Gaunt. **Do not CORE with Gaunt Hold.**  
COUNTERPLAY: Keep 1 leftover MP (all non-Strike fail); keep leftover AP above the next spell’s cost; Strike; Absolve / Dispel Thread.  
POWER_BUDGET: Standard 3 / CD 2 / 0 damage. Elite because it forces last-packet spells.  
AI_USAGE: `aiHint: "must_gaunt_if_target_has_leftover_mp_ge_1_or_leftover_ap_gt_next_spell_cost"`. Knights / pawns. Skip if they already sit dry-walk / last-AP.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 2`  
EDGE_CASES: `physical_attack` is Strike (id match, never name). Summon-kit casts are non-Strike. Missing key → no lock. Confirm fail does not spend AP.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — confirm gate on leftover MP and post-pay leftover AP.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-verse-gaunt`

NAME: Verse Gaunt  
ROLE: CONTROL — last resolved id illegal until leftover AP = 0 **and** leftover MP = 0  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: `effectParams: {"verseGauntUntilBothLeftoverEq0":true}`. Remember the target’s **last resolved spell id** at arm (id match). That id’s confirm fails until leftover AP **= 0** **and** leftover MP **= 0**. Other ids remain legal. Distinct from Verse Lean (#787, until leftover **MP = 0** only), Verse Pace (until they **walk**), Last Mute (duration silence of last id), Verse Tax (legal but +1 AP), Verse First (must spell before Strike). The decision: dump **both** bars to recast Inferno, or switch ids and keep a chip.  
DURATION: until both leftover 0 **or** the target’s next turn end, whichever first  
SCALING: none.  
SYNERGIES: Cadence Trade to put a 3-lock on the last id **and** this lock; Dual Keep **blocks** the unlock.  
COUNTERPLAY: Switch ids; Dual Keep then wait the turn end peel; dump both bars.  
POWER_BUDGET: Standard 3 / CD 2 / 0 damage. Last-id lock with a two-resource key.  
AI_USAGE: `aiHint: "verse_gaunt_if_target_last_id_is_their_best_and_they_hold_leftover"`. Hex / bishops. Skip if they have no last id or last id is Strike.  
DISCOVERY_ELIGIBILITY: true. ENEMY_DISCOVERY. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: No last id → fizzle rider (AP spent, observe). Turn-end peel even if leftover remains. Missing key → no lock. Do not parse names.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — last-id register + two leftover reads on confirm.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gaunt-hold`

NAME: Gaunt Hold  
ROLE: CONTROL — Strike illegal unless leftover MP = 0 **and** Strike spends last AP  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: `effectParams: {"gauntHoldStrikeUnlessLeftoverMpEq0AndSpendsLastAp":true}`. For 2 of **their** turns, confirm of `physical_attack` fails unless leftover walk MP **= 0** **and** leftover AP **before paying Strike equals Strike’s AP cost** (so leftover AP after Strike would be 0). Other spells remain legal under their own rules. Distinct from Lean Hold (#787, leftover **MP = 0** only — leftover AP unconstrained), Strike Hold (until they **walk**), Rite First (until a **spell**), Tool Hold (cannot-tool-until-Strike), Must Gaunt (non-Strike last-AP). The decision: melee only as the last 2 AP of a dry-walk turn — or skip Strike.  
DURATION: 2 of the target’s turns  
SCALING: none.  
SYNERGIES: Walk Toll to land leftover MP 0; Drain Courage to land leftover AP on 2. **Do not CORE with Must Gaunt.**  
COUNTERPLAY: Keep 1 leftover MP; keep leftover AP ≠ Strike cost; spell instead of Strike; wait the 2.  
POWER_BUDGET: Standard 3 / CD 2 / 0 damage. Elite because Strike’s window is a two-resource last packet.  
AI_USAGE: `aiHint: "gaunt_hold_if_target_wants_strike_with_leftover_mp_or_leftover_ap_ne_strike_cost"`. Knights / pawns. Skip if they already sit dry-walk / leftover AP = 2.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 2`  
EDGE_CASES: Strike id is `physical_attack`, never name. Attack Nearest is **not** Strike (Tool Hold / challenge helpers). Missing key → no lock. Confirm fail does not spend AP.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — Strike confirm gated on leftover MP and leftover AP == cost.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-trade`

NAME: Court Trade  
ROLE: SUPPORT — Cadence Trade against **every other** body  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `effectParams: {"tradeMatchingCds":true,"courtTradeExcludeCaster":true}`. In **live initiative order**, for each other combatant, swap matching remaining CDs with the **current** caster map (chained). Both sides keep their spells. Preview must show the **final** remaining maps. Distinct from Court Imprint (#787, mass **copy** onto the caster; targets keep), Court Dual / Court Keep (mass leftover banks), Reach Fold (#802, Chebyshev-exactly-2 **position** swap, `BOSS_ONLY` on `reach_fold_regent`). Player never owns this. Witness-only.  
DURATION: instant chained rewrites  
SCALING: none.  
SYNERGIES: Kit with Inferno / other CD-3 ids so the court can dump a 3 onto the player and pick up 0s. Do not kit with Cadence Trade as a second player-learnable door.  
COUNTERPLAY: Do not share CD-bearing ids with the court caster; recast before the arm; Cadence Crack the court’s highest to 0.  
POWER_BUDGET: Signature 6 / CD 4 / 0 damage. Kit-only because chained swaps scramble the board.  
AI_USAGE: `aiHint: "court_trade_if_any_other_body_matching_remaining_minus_ours_ge_2"`. Kit-only on `court_trade_regent`. Skip if no shared id with |Δ remaining| ≥ 2.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. `NOT_PLAYER_LEARNABLE`. Observe still logs for dim `UNKNOWN TECHNIQUE`. Never `ownedSpellIds`.  
EDGE_CASES: Arm is observation. Missing `courtTradeExcludeCaster` → do not self-swap. Empty field besides caster → fizzle (AP spent, observe). Do not write `spellLevelValues`.  
IMPLEMENTATION_COMPLEXITY: HIGH — chained remaining-map swaps + preview. Same class as Court Imprint.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-court-trade
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
minLevel: 8
isBaseSpell: false
acquisitionModel: NOT_PLAYER_LEARNABLE
effectParams: {"tradeMatchingCds":true,"courtTradeExcludeCaster":true}
```

---

## 6. Combination matrix (Wave 13 only)

| If this is true | Then this card cares |
| :--- | :--- |
| Leftover AP = 0 **and** leftover MP = 0 on an **ally** | Gaunt Mend, Gaunt Step, Gaunt Lend |
| Leftover AP = 0 **and** leftover MP = 0 on a **hostile** | Gaunt Sting, Gaunt Bounce (second body), Gaunt Sill (their turn start), Gaunt Post (their turn end) |
| Leftover MP = 0, leftover AP ≥ 1 | Bare Sip (steal AP). Lean Sting / Parched Sip / Dry Gait are **sibling** windows — not this pass |
| Leftover AP odd | Odd Hold blocks walk |
| Last AP packet of a dry-walk turn | Must Gaunt (non-Strike) **or** Gaunt Hold (Strike) — not both in one CORE |
| Shared remaining CD id | Cadence Trade / Court Trade |
| Hollow 3×3 ring free, hole occupied | Oct Span cages the hole |
| Next hit even Chebyshev | Even Hood blanks it |

Dual Keep / Purse Keep / Stride Keep leftover that survives turn start **blocks** every both-empty gate and **saves** Gaunt Sill / Gaunt Post victims.

---

## 7. Implementation order (not this pass)

1. Discovery ownership split (`SDE-2026-08-31-001`) — without it every Wave-13 id forced into `starterSpells` becomes always-owned.
2. Leftover AP / leftover MP writers (HUD pools after each spend). Dual Keep / Purse Keep / Stride Keep must write surviving leftover at turn start.
3. Cadence remaining-CD maps (already required by Waves 5–12). Trade is intersect-and-swap.
4. Occupy-weight **before** Oct Span (cap 2 cannot host weight 8).
5. Confirm gates for Must Gaunt / Gaunt Hold / Odd Hold / Verse Gaunt.
6. Hollow multi-cell occupy (`octspan`) and empty-kit mine (`gauntpost`).
7. Do **not** land `spell-parched-mend`.

Do not implement production code in this pass.

---

## 8. QA (design-level)

| ID | Check |
| :--- | :--- |
| W13-1 | No Wave-13 id appears in `spellData.ts` / `SPELL_ID_CATALOG` / §1.4 tombstone |
| W13-2 | `spell-parched-mend` is **not** shipped; Dry Gait owns leftover-MP=0 heal |
| W13-3 | `spell-gaunt-mend` requires **four** leftover-0 reads, not Dry Mend / Dry Gait |
| W13-4 | Cadence Trade **swaps** matching remaining; does not steal; does not copy-max |
| W13-5 | Oct Span is hollow 3×3, counts as **eight**, center unoccupied |
| W13-6 | Even Hood does **not** retag `even_gallery`; odd hits land and do not consume |
| W13-7 | Gaunt Sting bonus is leftover AP=0 **and** leftover MP=0, not Lean Sting’s MP≥1 |
| W13-8 | Bare Sip is leftover **AP** steal iff leftover **MP = 0** (inverse of Parched Sip) |
| W13-9 | Must Gaunt and Gaunt Hold are **not** in the same CORE |
| W13-10 | Court Trade is `NOT_PLAYER_LEARNABLE`; `court_trade_regent` is kit-only |
| W13-11 | Extra doors `gaunt_cantor` / `trade_precentor` / `span_oct` / `court_trade_regent` do not restamp #808 / #787 / #802 |
| W13-12 | `mpCost` is 0 on every Wave-13 row |
| W13-13 | `summonAI` values are `"octspan"` / `"gauntpost"` enums, never parsed names |
| W13-14 | Oct Span does not ship against `ENEMY_SUMMON_CAP === 2` without occupy-weight |

---

## 9. Out of scope

- Production TypeScript / Motoko / bindgen / PocketIC.
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / **#808** own extra doors).
- Restamping any door in §3.4.
- A fourth `mpCost > 0` walk snipe; Hex of Silence; About Hinge; mid-RAF splice; sixth echo; nine-cell occupy; Cadence Floor.
- Cloning Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Shadow Veil, Mirror / Reflect, Lens / Overcast, Short Sight / Paper Wind, Tempo Gift / Loan Tempo, Goad / Taunt Oath, Rime Tile / Rime Sheet, File Lance, Blood Tithe, Hex of Silence, Dry Mend, Dry Gait, Parched Mend.
- Putting unique #802 §11 ids in this catalog.

---

## 10. Catalog index

| SPELL_ID | NAME | ROLE | ACQUISITION | AP | CD | Door |
| :--- | :--- | :--- | :--- | ---: | ---: | :--- |
| `spell-gaunt-mend` | Gaunt Mend | SUPPORT | MULTI_SOURCE | 3 | 2 | `gaunt_cantor` |
| `spell-cadence-trade` | Cadence Trade | CONTROL | MULTI_SOURCE | 3 | 2 | `trade_precentor` |
| `spell-oct-span` | Oct Span | SUMMONS | MULTI_SOURCE | 4 | 3 | `span_oct` |
| `spell-even-hood` | Even Hood | DEFENSE | ELITE | 2 | 2 | (piece observe) |
| `spell-gaunt-sting` | Gaunt Sting | DAMAGE | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-gaunt-step` | Gaunt Step | POSITION | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-gaunt-sill` | Gaunt Sill | TERRAIN | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-odd-hold` | Odd Hold | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-gaunt-lend` | Gaunt Lend | SUPPORT | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-bare-sip` | Bare Sip | CONTROL | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-gaunt-post` | Gaunt Post | SUMMONS | ENEMY_DISCOVERY | 3 | 3 | (piece observe) |
| `spell-gaunt-bounce` | Gaunt Bounce | DAMAGE | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-must-gaunt` | Must Gaunt | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-verse-gaunt` | Verse Gaunt | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-gaunt-hold` | Gaunt Hold | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-court-trade` | Court Trade | SUPPORT | NOT_PLAYER_LEARNABLE | 6 | 4 | `court_trade_regent` (kit) |

STATUS: PROPOSED — no production code.

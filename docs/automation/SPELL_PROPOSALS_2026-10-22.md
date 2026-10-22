# Spell and Tactical Mechanics — Design Pass 2026-10-22

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1 law [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) through still-open Wave 13 [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-8100/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-21.md) (**#837**). Same-day Wave 14 SDE is **running** (`cursor/spell-discovery-evolution-2458`) and **has not opened a PR at authoring**.
- Spell, Discovery & Achievement Admin — still-open #677 / #729 / #791 / #815 (ACTION_IDs only; no unique spell ids)
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) … still-open Wave 13 [`SPELL_PROPOSALS_2026-10-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-1887/docs/automation/SPELL_PROPOSALS_2026-10-21.md) (**#849**)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); extra doors through #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 (Wave 13 bosses) / **#836** (Wave 14 bosses); tactical extras #463 / #525 / #563 / #636 / #695 / #726 / #787 / **#849**

This is **Wave 14** of the tactical catalog. Live HEAD is unchanged since Waves 4–13. Wave 13 (#849) filled four leftover-0 reads, remaining `n>0` → `n+2`, hollow 3×3 occupy (counts as eight), even-Chebyshev hood, leftover-AP=0-and-leftover-MP=0 tools, and a mass Lag signature.

**Wave 13 explicitly deferred nine holes.** Discovery Wave 13 (#837) already claimed target-only both-pools-empty heal (Hollow Gift) and remaining-CD map exchange (Cadence Swap). **SDE keeps those.** This pass fills the remaining leftovers Wave 13 left for Wave 14, plus a replacement invert that does **not** clone Tempo Invert:

| Wave-13 leftover | Owner after #837 / #849 | This pass |
| :--- | :--- | :--- |
| Heal if leftover AP **equals** leftover MP (including both nonzero) | Still open. Hollow Gift / Gaunt Mend own **0 = 0**. Dry Mend is leftover **AP = 0**. Dry Gait is leftover **MP = 0**. | **This pass:** Poise Mend — **caster and target** leftover AP **===** leftover MP **and leftover AP ≥ 1** (four equality reads, two ≥1 gates). **0 = 0 does not fire.** |
| Remaining CDs floor to 1 | Still open. Stall `+1`; Lag `+2`; Stretch `×2`; Halve `÷2`; Trim `−1`; Crack highest → 0; Flush all → 0; Swap exchanges maps. | **This pass:** Cadence Floor (remaining `n>1` → `1`; zeros stay 0; ones stay 1) |
| Nine-cell occupy (solid 3×3) | Still open. Oct Span is **hollow** 3×3, counts as **eight**, center hole unoccupied. | **This pass:** Nine Span (solid 3×3, counts as **nine**, center occupied) |
| Invert leftover AP with leftover MP on one body | **#282 Tempo Invert** (`spell-tempo-invert`) already owns **one-body ally/self** leftover AP↔MP (`invertApMp`). Ungated one-body invert is **not** a hole. | **This pass replacement:** Bar Cross — **two-body** leftover cross: caster AP ↔ target MP **and** caster MP ↔ target AP. Do **not** mint `spell-tempo-cross` / `spell-foe-invert`. |
| Mid-RAF splice | Held (AGENTS.md) | Still held |
| Fourth `mpCost > 0` walk snipe | Held (Ley Toll / Undertow / Sanguine Toll) | Still held |
| Sixth echo id | Held | Still held |
| Player-owned Hex of Silence | Held (`BOSS_ONLY`) | Still held |
| Player-owned About Hinge | Held (`BOSS_ONLY` on #590) | Still held. Hostile 180° around a pair midpoint is still Pawn Trade. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after the reserved set **and** after #726 / #747 / #787 / #802 / #837 / #849. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

Same-day Discovery Wave 14 **has not opened a PR at authoring** (agent `bc-8c8dd866` / branch `cursor/spell-discovery-evolution-2458` is running). **If that catalog later claims a unique leftover below, SDE wins** the unique §11 id; this catalog must not clone it. Do **not** clone #747 / #802 / #837 / #849 unique ids. Do **not** ship `spell-parched-mend` / `spell-cadence-trade` / `spell-court-trade` / `spell-hollow-mend`. Stamp family / observe metadata onto Wave-14 **tactical** ids only. #837 §12.3 already stamps #849 as Wave **14** family CORE. **This catalog stamps as Wave 15 family CORE.**

Do **not** mint `spell-tied-mend` / `spell-even-mend` / `spell-match-mend` / `spell-equal-mend` / `spell-both-poise` / `spell-poise-gift` (Poise Mend owns both-body AP===MP≥1 heal), `spell-cadence-ceil` / `spell-cd-floor` / `spell-cadence-arm` (Cadence Floor owns remaining `n>1` → `1`), `spell-nona-span` / `spell-solid-span` / `spell-block-span` / `spell-cube-span` / `spell-ten-span` (Nine Span owns solid nine), `spell-tempo-cross` / `spell-foe-invert` / `spell-pool-cross` / `spell-bar-invert` / `spell-ledger-flip` (Bar Cross owns two-body leftover cross; Tempo Invert owns one-body ally invert), `spell-court-arm` / `spell-court-ceil` (Court Floor is the mass signature), or `spell-poise-plate` / `spell-tied-hood` / `spell-match-hood` (Poise Hood owns tied-≥1 any-range miss; do **not** retag `even_gallery` / Spent Plate / Gait Plate).

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is unchanged since 2026-08-31. Discovery is still inert. WX is **19,213** lines (`wc -l`). Same HEAD as Waves 4–13. `WorldExploration.tsx` lives at `src/frontend/src/components/WorldExploration.tsx` (not `engine/`).

### 1.1 Frontend runtime catalog — `src/frontend/src/data/spellData.ts`

`SPELL_ID_CATALOG` (`src/frontend/src/data/bossKits.ts` 29–62) still lists **32** ids. `WorldExploration.tsx` 2396–2408 still maps **every** `starterSpells` row to `isBaseSpell: true` (“always shown, never removable”).

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

Live `ENEMY_SUMMON_CAP` is still **2** (`gameConstants.ts` 300). Quad Span (#636) counts as four, Penta Span (#695) as five, Six Span (#787) as six, Sept Span (#726) as seven, Oct Span (#849) as eight on paper; all five are implementation-blocked until that cap (or a dedicated occupy-weight) exists. Nine Span is the same class: **propose the hole, do not pretend it can ship against cap 2**.

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
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** (tests only) | Unused | Shoulder Bash, Hook Line. Poise Step / Bar Cross relocate leftover **pools**, not tiles. Bar Cross is **not** `isSwap`. |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768 → WX `swapPositions` 9389–9401) | Swap | Pawn Trade / Ward Interpose / Cadence Floor is **not** `isSwap` (cooldown remaining, not tiles) |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, never this set |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire |
| Walk / leftover / force flags | Paper `walkMpSpentThisTurn` (Waves 6–10). Paper `forcedMovedThisTurn` (Wave 9). Leftover AP/MP die at turn end unless Dual Keep / Purse Keep / Stride Keep | Haste grants **now**; Timestep is full **now** | **This pass: Poise Mend / Poise Hold / Poise* / Must Poise / Verse Poise / Bar Cross / Court Floor** |
| Nine-cell occupy | Twin=2 … Oct=8 hollow | Absent | **This pass: Nine Span** (solid 3×3 = 9) |
| Remaining CD rewrite | Theft **steals**; Imprint **copies**; Swap (#837) **exchanges full maps**; Rest skips **own** tick; Halve **÷2**; Grace skips **starting** the next own CD; Stall **+1**; Lag **+2** | Inferno CD 3 is the only live lock | **This pass: Cadence Floor (remaining n>1 → 1; zeros stay 0)** |
| Tied leftover (AP === MP, ≥ 1) | Gaunt family is **both leftover 0**. Hollow Gift is **target both 0**. Gait Plate is leftover **MP ≥ 1**. Spent Plate is leftover **AP ≥ 1**. Ready Sting is leftover **AP ≥ 1 and MP ≥ 1** (no equality). | Unused live | **This pass: Poise\*** |
| One-body leftover AP↔MP | Tempo Invert (`invertApMp`, ally/self) | Absent live | **This pass does not clone it.** Bar Cross is two-body. |

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

**Wave 13 tactical (#849 — still open; never re-propose / never clone; Wave-14 family CORE):**  
`spell-gaunt-mend`, `spell-cadence-lag`, `spell-oct-span`, `spell-even-hood`, `spell-gaunt-sting`, `spell-gaunt-step`, `spell-gaunt-sill`, `spell-odd-hold`, `spell-gaunt-lend`, `spell-bare-sip`, `spell-gaunt-post`, `spell-gaunt-bounce`, `spell-must-gaunt`, `spell-verse-gaunt`, `spell-gaunt-hold`, `spell-court-lag`.

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` (tactical W2 **and** Discovery W2); `spell-blood-tithe` (tactical W2 pet sacrifice **versus** Discovery W2 HP→AP). Wave 14 does not add a third.

**Do not alias** Poise Mend ↔ Gaunt Mend / Hollow Gift / Dry Mend / Dry Gait / Still Mend / Still Gift / Drift Gift / Both Mend / Heave Mend / Shove Mend / Gait Mend / Chase Mend / Clash Mend / Bar Mend / Blood Mend / Parched Mend; Cadence Floor ↔ Cadence Theft / Rest / Grace / Halve / Trim / Shave / Stall / Flush / Stretch / Crack / Break / Lend / Brand / Pin / Imprint / Swap / Lag; Nine Span ↔ Twin Span / Triple Span / Quad Span / Penta Span / Six Span / Sept Span / Oct Span / Span Guard / Span Pylon / Void Span; Bar Cross ↔ Tempo Invert / Dual Keep / Swap / Pawn Trade / Draw Together / Loan Tempo; Poise Hood ↔ Even Hood / Odd Hood / Near Hood / Mid Hood / Far Hood / Fog Hood / Tick Hood / Own Plate / Off Plate / Gait Plate / Spent Plate / Sidestep Ward; Poise Sting ↔ Gaunt Sting / Dry Sting / Damp Sting / Ready Sting / Lean Sting / Full Sting / Pair Gait / Lone Gait / Full Purse / Lone Purse / Pair Purse / Post Sting / Boot Sting / Shove Sting; Poise Step ↔ Gaunt Step / Home Step / Ally Step / Heave Step / Parched Step / Hinge Step / Cover Step / Ghost Step / Soft Step / Bias Step; Poise Sill ↔ Gaunt Sill / Quiet Sill / Cast Sill / Drift Sill / Parched Sill / Gift Sill / Wake Mark / Ingress Mark / Dwell Mark / Shove Mark; Poise Hold ↔ Odd Hold / Dry Hold / Drift Hold / Tool Hold / Boot Hold / Cast Hold / Strike Hold / Hold Ground / Odd Stride / Even Stride / Gaunt Hold; Poise Lend ↔ Gaunt Lend / Spent Lend / Boot Lend / Drift Lend / Lean Lend / Leftover Lend / Cadence Lend / Tempo Gift / Watch Lend / Watch Alms; Poise Sip ↔ Bare Sip / Watch Sip / Gait Sip / Soul Sip / Ap Sip / Drift Sip / Parched Sip / Drain Courage; Poise Post ↔ Gaunt Post / Dummy Post / Drift Post / Lean Post / Bait Pylon / Spark Whelp / Ingress Mark / Dwell Mark / Wake Mark / Shove Mark; Poise Bounce ↔ Gaunt Bounce / Chain Lightning / Ricochet Mark / Split Fang / Heave Bounce / Parched Bounce; Must Poise ↔ Must Gaunt / Must Step / Must Span / Must Pace / Must Drift / Must Lean / Rank Lock / Inch Stride / Cast Hold / Tool Hold / Gaunt Hold; Verse Poise ↔ Verse Gaunt / Verse Tax / Verse Pace / Verse Lean / Verse First / Last Mute / Once Verse / Stolen Verse / After Verse / Cast Hold; Court Floor ↔ Court Lag / Court Dual / Court Keep / Court Stretch / Court Hinge / Court Shove / Court Fold / Court Imprint / Adj Fold / Reach Fold / Diag Fold.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved, live, or still held) |
| :--- | :--- | :--- |
| SUPPORT poise heal | Heal iff **caster and target** leftover AP **===** leftover MP **and leftover AP ≥ 1** | Hollow Gift (#837) is **target** leftover AP=0 **and** leftover MP=0. Gaunt Mend (#849) is **both bodies leftover 0**. Dry Mend is leftover **AP = 0**. Dry Gait is leftover **MP = 0**. Ready Sting is leftover AP≥1 **and** MP≥1 with **no equality**. |
| CONTROL CD floor | Remaining `n>1` → `1`; zeros stay 0; ones stay 1 | Cadence Swap (#837) **exchanges full remaining maps**. Lag **+2**. Stall **+1**. Stretch **×2**. Halve **÷2**. Trim **−1**. Crack highest → 0. Flush all → 0. Pin **freezes one**. |
| SUMMONS nine-cell | Solid 3×3, counts as **nine**; center occupied | Twin=2. Triple=3. Quad=2×2=4. Penta=plus=5. Six=2×3=6. Sept=stretched plus=7. Oct=hollow 3×3=8, **center hole**. |
| SUPPORT two-body leftover cross | Caster leftover AP ↔ target leftover MP **and** caster leftover MP ↔ target leftover AP | Tempo Invert is **one-body ally/self**. Dual Keep **banks** leftover. Swap is **tiles**. Loan Tempo **grants** AP. |
| DEFENSE poise hood | Next applied hit is 0 **while leftover AP === leftover MP ≥ 1**, any range | Spent Plate is leftover **AP ≥ 1** (MP unconstrained). Gait Plate is leftover **MP ≥ 1** (AP unconstrained). Even Hood is **even Chebyshev**. Own Plate is **on your turn**. |
| DAMAGE poise sting | Bonus iff leftover AP === leftover MP ≥ 1 | Gaunt Sting is leftover **AP = 0 and MP = 0**. Ready is leftover **AP ≥ 1 and MP ≥ 1** (no equality). Full Sting is leftover **AP ≥ 3**. Pair Purse is leftover AP **exactly 2**. |
| POSITION poise step | Caster lands on a free Chebyshev-1 of an ally with leftover AP === leftover MP ≥ 1 | Gaunt Step is leftover **both 0**. Home Step is ungated. Parched Step is leftover **MP = 0**. Heave Step is **force-moved** ally. |
| TERRAIN poise sill | Occupant whose leftover AP === leftover MP ≥ 1 takes 8 at **start of their turn** | Gaunt Sill is leftover **both 0**. Wake Mark is start-turn detonate **any leftover**. Ingress is **walk enter**. Dwell is **end-turn occupy, any leftover**. |
| CONTROL poise hold | Cannot spend walk MP while leftover AP === leftover MP ≥ 1 | Odd Hold: while leftover AP is **odd**. Dry Hold: until leftover **AP = 0**. Cast Hold: cannot **spell** until walk. Gaunt Hold is **Strike** unless leftover MP=0 and last AP. |
| SUPPORT poise lend | +1 current AP **and** +1 current MP to an ally whose leftover AP === leftover MP ≥ 1 | Gaunt Lend is +1/+1 if leftover **both 0**. Lean Lend is +1 **MP** if leftover **AP = 0**. Dual Keep **banks**. Poise Lend **keeps** the tie (both pools +1). |
| CONTROL poise sip | Steal 1 leftover AP **iff leftover AP === leftover MP ≥ 1** | Bare Sip is leftover **AP** iff leftover **MP = 0**. Parched Sip is leftover **MP** iff leftover **AP = 0**. After Poise Sip the target is **no longer tied**. |
| SUMMONS poise post | Empty-kit body; **end-turn occupy with leftover AP === leftover MP ≥ 1** deals 10 and it dies | Gaunt Post is leftover **both 0**. Lean Post is leftover **AP = 0** only. Drift Post is **relocate landing**. Dwell Mark is **end-turn occupy, any leftover**. |
| DAMAGE poise bounce | 12 to primary; bounce 1 to nearest **other** leftover-AP===leftover-MP≥1 hostile | Gaunt Bounce is leftover **both 0**. Parched Bounce is leftover **MP = 0**. Heave Bounce is **force-moved**. Chain Lightning bounces to nearest **any**. |
| CONTROL must-poise | Remaining **non-Strike** spells illegal unless leftover AP === leftover MP ≥ 1 **and** this spell spends last AP | Must Gaunt is leftover **both 0** / leftover MP=0 last AP. Cast Hold bans **all** spells until they **walk**. Tool Hold bans tools until **Strike**. |
| CONTROL verse poise | Last resolved id is **illegal until leftover AP === leftover MP ≥ 1** | Verse Gaunt lifts at leftover **both 0**. Verse Lean lifts at leftover **MP = 0**. Last Mute is duration. **0 = 0 does not lift Verse Poise.** |
| SUPPORT mass floor | Signature: Cadence Floor on **every other** body (init order) | Court Lag is mass Lag. Cadence Floor is a **one-body** compress. Reach Fold / Diag Fold are **position** swaps, `BOSS_ONLY`. Player never owns this. |
| RESOURCE fourth MP snipe | — | **Held forever** with Ley Toll / Undertow / Sanguine Toll |
| Sixth echo | — | Held for Discovery |
| Full-bar silence | — | Hex of Silence stays `BOSS_ONLY` |
| Mid-RAF splice | — | Held (AGENTS.md) |
| One-body AP===MP≥1 heal | — | **Skipped.** Wave 15 / SDE. Poise Mend is **both bodies**. |
| Hostile one-body leftover invert | — | **Skipped.** Tempo Invert is ally. Wave 15. |
| Remaining 0 → 1 | — | **Skipped.** Wave 15 Cadence Arm (ready ids go on CD 1). |
| Ten-cell occupy | — | **Skipped.** Wave 15. |
| Leftover AP + leftover MP === N | — | **Skipped.** Wave 15 sum window (not equality). |

**Still open after this wave (do not fill today):** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; a sixth echo id; player-owned Hex of Silence; player-owned About Hinge (stays `BOSS_ONLY`); one-body AP===MP≥1 heal; hostile one-body leftover invert; remaining zeros → 1; ten-cell occupy; leftover AP + leftover MP equals a constant. Cadence Swap / Hollow Gift stay #837. Tempo Invert stays #282. Those stay Wave 15 / Discovery so this pass stays discrete.

The **tactical fork** Dual Keep / Purse Keep / Stride Keep now cuts both ways: a surviving **equal** leftover bank ≥ 1 **opens** every Poise gate and **blocks** every Gaunt / Hollow Gift gate. Dump both pools to 0 for Gaunt. Hold 2/2 or 1/1 for Poise. Spend one pool to break Poise Hold / Verse Poise.

---

## 3. Contract with Dynamic Spell Discovery

Coordinate with Discovery (`c26e5a83-…`) and Admin (`4efa22ec-…`). This pass only stamps acquisition so those layers can filter **by field**. Same-day Discovery Wave 14 **has not opened a PR at authoring**. **If it later claims a unique id below, SDE wins.** Do **not** mint or clone #747 / #802 / #837 / #849 unique ids.

### 3.1 Discovery is still inert (reconfirmed @ `0f5363f`)

1. All 32 frontend spells are forced `isBaseSpell` (`WorldExploration.tsx` 2396–2408).
2. Recap grants XP/Doka/feats only.
3. Achievements (`defaultAchievements`, `admin.mo` 309–326) grant Doka only.
4. Challenges grant Doka/XP/badge only (`easy_1`…`legendary_3` in `challengeCompletion.ts`).
5. `upgradeSpell` levels a known id; it does not unlock ids.
6. `ENEMY_KITS` (`enemyAI.ts` 163–185) still reuse always-owned ids. Seeing a bishop cast Frost teaches nothing.
7. `buildEnemyKit` still takes `currentMap.levelZone` (`WorldExploration.tsx` 11920). The zone object is `{ name, minLevel, maxLevel }` (4683–4687). `Math.floor(levelZone)` is `NaN` (`enemyAI.ts` 194–199) → every kit stays zone 0.
8. `executeCastAttempt` still does not debit `spell.mpCost`. This pass adds **zero** `mpCost > 0` rows, so it does not widen that bug.
9. No `ownedSpellIds` / `observedSpellIds` persist maps. Character still has `spellLevelKeys` / `spellBarOrder` (`main.mo` 132–142).

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 14 ids to `starterSpells` as base. Do **not** land Wave-14 data before Wave-1 ownership split (`SDE-2026-08-31-001`) through Wave-13 (#849 / #837) data. **Do not ship** `spell-parched-mend`.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "ninespan"` and `"poisepost"` are **string enums on the config**.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Poise Mend / Cadence Floor / Poise Hood / Poise Sting / Poise Hold / Poise Lend / Poise Sip / Must Poise / Verse Poise **arming** (AP spent) **is** observation, including a blocked / unmoved / no-last-id / leftover-gate fizzle after AP. Later consume / convert / peel is **not** a second observe.
- Poise Sill **paint** is observation. Later start-turn tax is not a second observe.
- Poise Step / Poise Bounce / Bar Cross **cast** (AP spent) **is** observation, including a bounce that finds no second body or a cross of two zeros (no-op writes, still observe).
- Nine Span / Poise Post **summon** is observation. Later occupy / detonate / death is not a second observe.
- Court Floor **arm** is observation for witness-only kits. Never written to owned ids.
- Do not require “see it N times” except where a boss adaptation already does. Wave 14 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.
- Do not stamp `survivor` (Last Ember / Last Ward). #646 / #679 / #747 / #802 / #837 / #849 left that feat leftover on purpose.

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

**Every live feat and every live challenge id is already a sole spell door or a MULTI child.** Wave 14 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 14 does **not** invent a 16th feat.

**Live 19 first-wins are all taken (do not restamp as the only door):**  
`starborn_queen` (Cut In), `pale_archivist` (After Verse), `starved_vampire_pawn` (Sanguine Toll), `lord_of_static` (Draw Together), `final_pawn` (Eclipse Fold), `mirror_sovereign` (Echo Cast), `crimson_countess` (Crimson Pact), `void_grandmaster` (Twin Gate), `midnight_bishop` (Life Tether), `chessboard_lich` (Claim Ward), `twin_monarchs` (Choir Hymn), `alabaster_fortress` (Pain Link / Aftershock), `bone_cavalier` (Vault / Caltrop), `pale_archbishop` (Reliquary / Glyph Snare extras), `fetid_rook` (Rot Brand), `broodmother_rook` (Brood Ward), `weeping_pawn` (Mute Thread, #411), `eternal_pawn_king` (Queue Cut, #411), `enthroned_void` (File Vault MULTI child, #411). `second_lament` remains kit-only False Cut.

**Wave-5…14 boss extra doors — do not restamp:** `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`, `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`, `mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`, `gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`, `toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`, `crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`, `sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`, `infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`, `flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`, `effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`. `CHOIR_FLUSH` / `CHOIR_LONE` / `NAVE_PLATE` / `CHOIR_LEND` / `CHOIR_EFFIGY` / `NAVE_THRESHOLD` / `CHOIR_SPLIT` / `NAVE_QUIET` stay `BOSS_ONLY`.

**Wave-6…13 tactical extra doors — do not restamp:** `oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`, `pace_prelate`, `span_triune`, `wick_mason`, `slip_castellan`, `court_usher`, `gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `gaunt_cantor`, `lag_precentor`, `span_oct`, `court_lag_regent`. `parched_cantor` is **not** Dry Gait’s door and **not** Poise Mend’s door. `gaunt_cantor` stays Gaunt Mend.

**Wave-8…13 SDE extras — do not restamp:** `about_hinge_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `pair_gallery`, `knight_fold_regent`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `cap_precentor`, `reach_fold_regent`, `knight_gallery`, `quad_nave`, `pit_aisle`, `shunt_pulpit`, `nudge_nave`, `file_precentor`, `diag_fold_regent`. Do **not** retag `even_gallery` as Poise Hood. Do **not** consume encounter-catalog `ENC-*` rooms.

**New proposed extra doors for the boss designer (Wave 15 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `poise_cantor` first-win | Poise Mend MULTI child (observe+win still grants). `gaunt_cantor` stays Gaunt Mend. `parched_cantor` stays the dropped Parched Mend slot — **do not reuse**. Hollow Gift (#837) has **no** extra door — do not invent `hollow_cantor` / `tied_cantor`. |
| `floor_precentor` first-win | Cadence Floor MULTI child. `lag_precentor` stays Lag. `imprint_precentor` stays Imprint. `halve_precentor` stays Halve. `cap_precentor` stays Pack Cap. `file_precentor` stays Pack File (`ENEMY_ONLY`). Do **not** mint `arm_precentor` / `ceil_precentor`. |
| `span_nine` first-win | Nine Span MULTI child. `span_oct` stays Oct Span. `span_six` stays Six Span. `span_sept` stays Sept Span. `span_penta` stays Penta Span. `span_quad` stays Quad Span. `span_triune` stays Triple Span. |
| `court_floor_regent` kit only | Court Floor (`NOT_PLAYER_LEARNABLE`). `court_lag_regent` stays Court Lag. `court_imprint_regent` stays Court Imprint. `reach_fold_regent` stays Reach Fold. `diag_fold_regent` stays Diag Fold. `adj_fold_regent` stays Adj Fold. Do **not** mint `court_arm_regent`. |

Piece-type observe paths (not feat doors): cantors / bishops for Poise Mend; scribes / tempo for Cadence Floor; masons / rooks ELITE for Nine Span; hex / queens for Bar Cross; lurkers / knights for Poise Hood; lurkers / pawns for Poise Sting; porters / queens for Poise Step; masons / rooks for Poise Sill; hex / knights for Poise Hold; buffers / bishops for Poise Lend; hex / pawns for Poise Sip; masons / pawns for Poise Post; queens / bishops for Poise Bounce; knights / pawns for Must Poise; hex / bishops for Verse Poise.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #787 / #802 / #837 / #849 key names for a different meaning. Do **not** reuse `invertApMp` (Tempo Invert).

`mpCost` stays 0 on every Wave-14 row.

**New keys (Wave 14 only):**

```text
requireCasterLeftoverApEqLeftoverMp, requireCasterLeftoverApGe1,
requireTargetLeftoverApEqLeftoverMp, requireTargetLeftoverApGe1, poiseMendAmount,  // Poise Mend
floorRemainingCdsTo1,                                                             // Cadence Floor — remaining n>1 → 1; zeros stay 0
nineSpanCells, nineSpanSolid,                                                     // Nine Span — 9; solid 3×3, center occupied
crossLeftoverApMpTwoBody,                                                         // Bar Cross — caster AP ↔ target MP; caster MP ↔ target AP
poiseHoodNextHit,                                                                 // Poise Hood — next hit while tied ≥1, any range → 0
poiseLeftoverApEqMpGe1, poiseStingBonus,                                          // Poise Sting
poiseStepNeedTiedGe1, poiseStepAdj,                                               // Poise Step — dest Chebyshev 1 of target
poiseSillNeedTiedGe1, poiseSillDamage, poiseSillDuration,                         // Poise Sill — start-of-their-turn tax
poiseHoldWhileTiedGe1, poiseHoldDuration,                                         // Poise Hold — 2 of their turns
poiseLendAp, poiseLendMp, requireTargetTiedGe1Lend,                               // Poise Lend — +1 AP and +1 MP iff tied ≥1
poiseSipAp, requireTargetTiedGe1Sip,                                              // Poise Sip — steal 1 leftover AP iff tied ≥1
poisePostDetonateDamage, poisePostNeedTiedGe1,                                    // Poise Post — 10 on end-turn occupy if tied ≥1
poiseBounceNeedTiedGe1, poiseBounceSearchRadius, poiseBounceCount,                // Poise Bounce
mustNonStrikeUnlessTiedGe1AndSpendsLastAp,                                        // Must Poise
versePoiseUntilTiedGe1,                                                           // Verse Poise
courtFloorExcludeCaster                                                           // Court Floor
```

If a key is missing, the rider does not fire.

Nested kit-only id (not a player card): none new besides Court Floor itself. Poise Post’s detonate is **not** a second spell id (the summon row carries `poisePostDetonateDamage`). Do not mint `spell-poise-burst`.

Leftover AP / leftover MP are **current remaining after this spell’s AP is paid**, read from the same pools the HUD uses. Walk spends must write leftover MP. Spell spends must write leftover AP. Missing leftover → the gate fails closed (fizzle rider, AP spent, observe). Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count as leftover for these gates. Equality is integer `===`. `leftover AP = 0` and `leftover MP = 0` is **not** a Poise window (`require*Ge1` fails closed).

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Cadence Floor’s compress is paid in **already-running remaining**, not in extra AP. Poise Mend’s 8 is paid in **two tied-nonzero bars on two bodies** (Hollow Gift is the one-body empty cousin; Gaunt Mend is the two-body empty cousin).

Do **not** put Must Poise in the same CORE as a Strike-only poise lock (this pass does not ship that lock). Do **not** CORE Poise Hood with Spent Plate or Gait Plate. Do **not** CORE Poise Mend with Hollow Gift or Gaunt Mend. Do **not** CORE Bar Cross with Tempo Invert. Do **not** CORE Cadence Floor with Cadence Halve, Trim, Crack, or Flush.

---

## 5. Proposed spells (Wave 14)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-poise-mend`

NAME: Poise Mend  
ROLE: SUPPORT — heal if caster **and** target leftover AP === leftover MP **and leftover AP ≥ 1**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"requireCasterLeftoverApEqLeftoverMp":true,"requireCasterLeftoverApGe1":true,"requireTargetLeftoverApEqLeftoverMp":true,"requireTargetLeftoverApGe1":true,"poiseMendAmount":8}`. If **both** caster and target have leftover AP **===** leftover walk MP **and leftover AP ≥ 1** at resolve (after this spell’s 3 AP is paid), heal the target 8 through the existing heal helper. If any equality fails **or** either leftover AP is 0, fizzle rider (AP spent, no HP). Walk / force-move flags do **not** substitute. Distinct from Hollow Gift (#837, **target only** leftover AP=0 **and** leftover MP=0 — caster leftover unconstrained), Gaunt Mend (#849, **both bodies leftover AP=0 and leftover MP=0**), Dry Mend (#747, both leftover **AP = 0**, MP unconstrained), Dry Gait (#802, both leftover **MP = 0**, AP unconstrained), dropped Parched Mend (same hole as Dry Gait — **do not ship**), Still Mend (#747, caster **spent 0 walk MP**), Still Gift (#802, **target** spent 0 walk MP), Drift Gift (#837, **target force-moved**), Both Mend (#695, both **walked**), Heave Mend (#726, both **force-moved**), Ready Sting (leftover AP≥1 **and** MP≥1 with **no equality**). The decision: two bodies **match** leftover ≥ 1 (1/1, 2/2, 3/3), then 8 — Dual Keep / Stride Keep / Purse Keep **enable** this when the surviving banks are equal and ≥ 1, and **block** Gaunt Mend / Hollow Gift until the bank is spent. `healAmount` stays 0 on the row so `inferArchetype` (`enemyAI.ts` 447–452) does not treat a kit that only *carries* this id as healer unless the resolver actually wrote HP; **healer CORE only** when the row is in a live pool.  
DURATION: instant  
SCALING: 8 follows heal% if any; amount otherwise fixed.  
SYNERGIES: Dual Keep / Stride Keep / Purse Keep to **hold** a tied bank; Haste then spend AP to match; Bar Cross to **create** a tie on one body; Poise Lend keeps the tie after the heal.  
COUNTERPLAY: Spend 1 leftover AP **or** 1 leftover MP to break the equality; Cursed Wound; kill the cantor first. Dumping both pools to 0 **also** breaks this (that window is Gaunt / Hollow Gift).  
POWER_BUDGET: Standard heal, gated on **four** leftover reads (two equalities, two ≥1). Blood Mend is 12 ungated self. Hollow Gift is 12 on **one** empty body. Gaunt Mend is 8 on **two** empty bodies. Do not stack Poise Mend with Hollow Gift or Gaunt Mend in the same CORE.  
AI_USAGE: `aiHint: "heal_if_both_bodies_leftover_ap_eq_leftover_mp_ge_1"`. Cantors / bishops. Skip if either leftover AP ≠ leftover MP **or** either leftover AP = 0. **Healer CORE only.** Do not dump leftover **only** to enable this if a Strike would kill.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop","queen"], levelZoneMin: 1 }`. MULTI child `poise_cantor`.  
EDGE_CASES: Targeting ally already allows self (`targeting.ts` 184–189). Self-cast requires the caster’s leftover AP === leftover MP **and leftover AP ≥ 1** (one body, four keys, two reads). Self-cast at leftover 0/0 **does not** collide with Hollow Gift / Gaunt Mend — `requireCasterLeftoverApGe1` fails closed. Player-side HP actually increased → `challengeHealUsedRef`. Missing keys → no heal. Do not clone Hollow Gift / Gaunt Mend / Dry Mend / Dry Gait. Do not ship Parched Mend. One-body AP===MP≥1 heal stays Wave 15 / SDE.  
IMPLEMENTATION_COMPLEXITY: LOW — four leftover reads + existing heal helper.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-poise-mend
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
effectParams: {"requireCasterLeftoverApEqLeftoverMp":true,"requireCasterLeftoverApGe1":true,"requireTargetLeftoverApEqLeftoverMp":true,"requireTargetLeftoverApGe1":true,"poiseMendAmount":8}
```

---

### SPELL_ID: `spell-cadence-floor`

NAME: Cadence Floor  
ROLE: CONTROL — remaining CDs `n>1` become `1`  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"floorRemainingCdsTo1":true}`. For each spell id in the **target’s** remaining-CD map with `n > 1`, write `1`. Zeros stay 0 (ready ids stay ready). Ones stay 1. Target **keeps every spell**. Once/battle flags and spell levels are **not** CDs. Distinct from Cadence Swap (#837, **exchange full remaining maps**; unknown ids dropped), Cadence Lag (#849, remaining `n>0` → `n+2`), Cadence Stall (#590, remaining `n>0` → `n+1`), Cadence Stretch (#636, remaining ×2), Cadence Theft (#411, **steals** remaining), Cadence Imprint (#787, **copies** onto the caster; target keeps), Cadence Rest (#747, **own** remaining do not tick), Cadence Grace (#802, **next own spell does not start** its cooldown), Cadence Halve (#726, **÷2** on the hostile), Cadence Trim (−1 on the hostile), Cadence Crack (highest → 0), Cadence Flush (all → 0). The decision: Inferno 3 becomes 1 — they recast **next** turn instead of in three — or Crack it to 0 first. Remaining 0 → 1 is **Cadence Arm**, Wave 15; do **not** mint `spell-cadence-arm`.  
DURATION: instant rewrite of remaining `n>1`  
SCALING: none.  
SYNERGIES: Verse Poise after you compressed their last id to 1; Lag / Stall are the **pad** cousins — do not CORE both; Crack / Flush are the **zero** cousins — do not CORE both; Halve / Trim can leave `n>1` that Floor then snaps to 1.  
COUNTERPLAY: Recast the locked id **before** Floor (zero stays zero); wait the remaining 1; Cadence Swap (#837) to dump the compressed map onto someone else.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **compressed downtime**, not a steal, copy, pad, or map swap.  
AI_USAGE: `aiHint: "floor_if_target_has_remaining_cd_ge_3"`. Scribes / tempo. Skip if every remaining is 0 or 1, or if the only lock is already 1 and a Strike would kill.  
DISCOVERY_ELIGIBILITY: true. MULTI child `floor_precentor`. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing key → no rewrite. Do not write `spellLevelValues`. Do not reset Dual Keep’s once/battle. Preview must show which remaining drop to 1. All-zero-or-one remaining → fizzle rider (AP spent, observe). If same-day SDE Wave 14 claims this leftover, **SDE wins** — do not keep a second Floor id.  
IMPLEMENTATION_COMPLEXITY: LOW — walk remaining map, write 1 when n>1.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-cadence-floor
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
effectParams: {"floorRemainingCdsTo1":true}
```

---

### SPELL_ID: `spell-nine-span`

NAME: Nine Span  
ROLE: SUMMONS — nine-cell occupy (solid 3×3)  
ACQUISITION: MULTI_SOURCE  
AP_COST: 4  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "ninespan"`, `summonLifespan: 4`, empty kit (`summonUnitDef` with `pieceType: ""` / zero scales — a body, not a caster). `effectParams: {"nineSpanCells":9,"nineSpanSolid":true}`. Click a free ground tile as the **center**. All 9 Chebyshev-≤1 cells (center + 8 neighbors) must be free and in-bounds (`isCellFree`); else fizzle (AP spent). One combatant id, nine-cell footprint. The **center is occupied** by the summon (not walkable / not a cage hole). Counts as **nine** toward the summon cap. Distinct from Twin Span (2 walking), Triple Span (3), Quad Span (2×2 = 4), Penta Span (ortho plus = 5), Six Span (2×3 = 6), Sept Span (stretched plus = 7), Oct Span (#849, hollow 3×3 = 8, **center hole unoccupied**). The decision: seal a nine-cell block for nine cap — no one stands in the middle — or you cannot afford the weight. Oct Span cages a hole; Nine Span **is** the hole.  
DURATION: lifespan 4  
SCALING: footprint fixed.  
SYNERGIES: File Lance / Cast Sill / Poise Sill on a neighbor; Quiet Sill on a corner so Strike cannot peel through; Swap / Reach Fold to extract an ally trapped against the block.  
COUNTERPLAY: Occupy any of the 9 before paint; Coup the body (one HP pool); blink / swap around the block; walk around. You cannot stand on the center because the summon occupies it.  
POWER_BUDGET: Heavy 4 / CD 3 / 0 damage. Power is **nine** cells of deny. Heavier than Oct Span’s eight-plus-hole because the center is not a cage you can occupy.  
AI_USAGE: `aiHint: "nine_span_if_nine_free_square_and_cap_allows"`. Masons / rooks ELITE. Skip if any of the 9 cells is occupied **or** remaining summon weight + 9 would exceed cap. Prefer a square that splits the player from an exit.  
DISCOVERY_ELIGIBILITY: true. MULTI child `span_nine`. `pieceTypes: ["rook"]`, `levelZoneMin: 2`  
EDGE_CASES: **Do not ship while `ENEMY_SUMMON_CAP === 2` without occupy-weight.** Never parse `"Nine Span"` / `"Nona"` / `"Solid"`. One id, nine cells — destroying the body frees all nine. Player-side Nine Span counts toward the **player** summon economy, not `ENEMY_SUMMON_CAP`. Missing `nineSpanCells` → do not spawn a 1-cell body and call it Nine Span. Missing `nineSpanSolid` → do not leave the center as a hole (that is Oct Span). Off-map neighbor → fizzle. Do not mint `spell-nona-span` / `spell-solid-span` / `spell-block-span` / `spell-ten-span`.  
IMPLEMENTATION_COMPLEXITY: HIGH — multi-cell occupy + cap weight. Same class as Quad / Penta / Six / Sept / Oct.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-nine-span
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
summonAI: ninespan
summonLifespan: 4
isBaseSpell: false
effectParams: {"nineSpanCells":9,"nineSpanSolid":true}
```

---

### SPELL_ID: `spell-bar-cross`

NAME: Bar Cross  
ROLE: CONTROL — two-body leftover AP↔MP cross  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"crossLeftoverApMpTwoBody":true}`. Write caster leftover AP ← target leftover MP, caster leftover MP ← target leftover AP, target leftover AP ← caster leftover MP, target leftover MP ← caster leftover AP, each **capped at that pool’s max**. Resolve as a simultaneous four-write (snapshot both leftover pairs first). Distinct from Tempo Invert (#282, **one-body ally/self** leftover AP↔MP via `invertApMp` — **do not reuse that key**), Dual Keep (banks leftover AP **and** MP on **one** body, no swap), Swap / Pawn Trade (**tiles**), Loan Tempo / Tempo Gift (**grants**), Drain Courage (AP debit), Soul Sip (ungated MP steal). The decision: you have 3 leftover AP and 0 leftover MP, they have 0 leftover AP and 2 leftover MP → you walk with 2 MP and they gain 3 leftover MP (and 0 AP). Do **not** mint `spell-tempo-cross` / `spell-foe-invert` / `spell-pool-cross`. Hostile one-body invert stays Wave 15.  
DURATION: instant leftover rewrite; no snap-back at turn end  
SCALING: none. Caps at each pool’s max.  
SYNERGIES: Poise Mend / Poise Sting after the cross **creates** a tie; Must Poise after you dump their AP into MP; Undertow / Ley Toll want MP on **you**; Dual Keep leftover that survives is legal input.  
COUNTERPLAY: Keep leftover AP === leftover MP so the cross is a no-op on equality (values still move **across bodies** — a 2/2 vs 1/1 becomes 1/1 vs 2/2); Quiet Hex after they cross into a 3-AP spell; Strike before they recast.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **moving leftover across two bodies and two pools**, not a grant and not a tile swap. Do not CORE with Tempo Invert.  
AI_USAGE: `aiHint: "cross_if_caster_leftover_ap_ge_2_and_target_leftover_mp_ge_2_or_inverse"`. Hex / queens. Skip if both leftover pairs are already 0/0 (no-op writes still spend AP — do not). Skip if a Strike would kill.  
DISCOVERY_ELIGIBILITY: true. Piece observe. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing key → no rewrite. Do not write max AP/MP. Do not write Dual Keep’s once/battle. Preview must show both leftover pairs after the cross. Self-target is illegal (`targetType: enemy`). Two 0/0 bodies → fizzle rider (AP spent, observe) so AI skip matches. Values equal on one body still **move across bodies**. Do not reuse `invertApMp`.  
IMPLEMENTATION_COMPLEXITY: LOW — snapshot two leftover pairs, four capped writes.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-bar-cross
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
effectParams: {"crossLeftoverApMpTwoBody":true}
```

---

### SPELL_ID: `spell-poise-hood`

NAME: Poise Hood  
ROLE: DEFENSE — next applied hit is 0 while leftover AP === leftover MP ≥ 1, any range  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"poiseHoodNextHit":true}`. Arm a one-hit consume: the next applied hit on the caster is 0 **if at impact** leftover AP === leftover MP **and leftover AP ≥ 1**. Any Chebyshev. The charge remains if the hit arrives while leftover AP ≠ leftover MP **or** leftover AP = 0 (hit lands fully; charge stays). Distinct from Spent Plate (#837, leftover **AP ≥ 1**, MP unconstrained), Gait Plate (#802, leftover **MP ≥ 1**, AP unconstrained), Even Hood (#849, **even Chebyshev**), Odd Hood (odd Chebyshev), Near / Mid / Far Hood (range bands), Own Plate (on your turn), Off Plate (off-turn). The decision: hold 1/1 through the hit — Dual Keep **helps** — or spend a pool and Spent Plate / Gait Plate still work, this does not. Do **not** CORE with Spent Plate or Gait Plate. Do **not** retag `even_gallery`.  
DURATION: until consumed or battle end (one hit)  
SCALING: none.  
SYNERGIES: Dual Keep / Poise Lend to **hold** 1/1; Bar Cross to create the tie before the hit; Cadence Floor on the attacker so they recast into the hood.  
COUNTERPLAY: Wait until they spend a pool; Drain Courage / Slow to break equality; Coup / execute that does not count as “applied hit” stays out of scope (this only blanks the next applied hit the existing hit pipeline writes).  
POWER_BUDGET: Cheap 2 / CD 2. Power is **holding a tie**, not a range band.  
AI_USAGE: `aiHint: "poise_hood_if_leftover_ap_eq_leftover_mp_ge_1"`. Lurkers / knights ELITE. Skip if leftover AP ≠ leftover MP or leftover AP = 0.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Missing key → no arm. Hit while leftover 0/0 lands and **does not** consume (Gaunt / Hollow Gift window). Hit while leftover 2/1 lands and **does not** consume (Spent Plate would). Do not clone Spent Plate / Gait Plate / Even Hood.  
IMPLEMENTATION_COMPLEXITY: LOW — one consume flag + two leftover reads at impact.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-poise-hood
effectType: buff
effectCategory: defense
targetType: self
areaShape: single
apCost: 2
mpCost: 0
damage: 0
range: 0
cooldown: 2
usableByPlayer: true
usableByEnemy: true
minLevel: 2
isBaseSpell: false
effectParams: {"poiseHoodNextHit":true}
```

---

### SPELL_ID: `spell-poise-sting`

NAME: Poise Sting  
ROLE: DAMAGE — bonus iff leftover AP === leftover MP ≥ 1  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: 10 damage. `effectParams: {"poiseLeftoverApEqMpGe1":true,"poiseStingBonus":6}` — if **the target’s** leftover AP === leftover MP **and leftover AP ≥ 1** at resolve (after this spell’s 2 AP is paid on the **caster**), add 6. Caster leftover unconstrained. Distinct from Gaunt Sting (#849, leftover **AP = 0 and MP = 0**), Dry Sting (leftover **AP = 0**), Lean Sting (leftover **AP = 0 and MP ≥ 1**), Ready Sting (leftover **AP ≥ 1 and MP ≥ 1**, no equality), Full Sting (#837, leftover **AP ≥ 3**), Pair Purse (leftover AP **exactly 2**), Pair Gait (leftover MP **exactly 2**), Lone Gait (leftover MP **exactly 1**). The decision: poke the 2/2 bishop for 16, or wait until they dump to 0/0 and Gaunt Sting instead.  
DURATION: instant  
SCALING: 10 + 6 follow damage%.  
SYNERGIES: Dual Keep on **them** keeps the window; Bar Cross to **create** a tie on them; Poise Sip **breaks** the window after you take 1 AP.  
COUNTERPLAY: Spend 1 leftover AP **or** 1 leftover MP before the poke; dump both to 0 (Gaunt window).  
POWER_BUDGET: Cheap 2 / CD 1. 10 ungated + 6 gated. Do not CORE with Ready Sting or Full Sting.  
AI_USAGE: `aiHint: "poise_sting_if_target_leftover_ap_eq_leftover_mp_ge_1"`. Lurkers / pawns. Skip the id if the target is not in the window **and** a Strike would kill; 10 still lands if you cast it anyway.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","knight"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing keys → 10 only. Target leftover 0/0 → 10 only (Gaunt Sting’s window). Target leftover 3/1 → 10 only (Full Sting’s AP≥3 window without equality). Do not clone Ready / Full / Gaunt Sting.  
IMPLEMENTATION_COMPLEXITY: LOW — two leftover reads + add.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-poise-sting
effectType: damage
spellType: damage
targetType: enemy
areaShape: single
apCost: 2
mpCost: 0
damage: 10
range: 3
cooldown: 1
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
effectParams: {"poiseLeftoverApEqMpGe1":true,"poiseStingBonus":6}
```

---

### SPELL_ID: `spell-poise-step`

NAME: Poise Step  
ROLE: POSITION — caster lands on a free Chebyshev-1 of an ally whose leftover AP === leftover MP ≥ 1  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"poiseStepNeedTiedGe1":true,"poiseStepAdj":1}`. If the **target ally** has leftover AP === leftover MP **and leftover AP ≥ 1**, the caster relocates onto a free Chebyshev-1 of that ally (`isCellFree`; occupancy dest, **not** `isSwap`, **not** `applyPushback`). If no free neighbor or the leftover gate fails, fizzle rider (AP spent, unmoved). Distinct from Gaunt Step (#849, leftover **both 0**), Home Step (ungated), Parched Step (leftover **MP = 0**), Heave Step (**force-moved** ally), Ally Step (**they** land next to the caster), Hinge Step / Cover Step / Ghost Step. The decision: walk to the 2/2 wisp’s hip, or wait until they dump to 0/0 and Gaunt Step.  
DURATION: instant relocate  
SCALING: none.  
SYNERGIES: Dual Keep on the ally; Poise Lend to **keep** the tie after they spent; File Lance after you land on-file.  
COUNTERPLAY: Occupy every Chebyshev-1 of the ally; Drain Courage / Slow to break their equality; kill the ally first.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **gated dash**, not a swap.  
AI_USAGE: `aiHint: "poise_step_if_ally_tied_ge_1_and_free_adj"`. Porters / queens. Skip if the ally is not in the window or every neighbor is occupied.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Self-target: Chebyshev-1 of self is a neighbor of the caster’s **current** tile — legal if a neighbor is free **and** the caster’s leftover AP === leftover MP ≥ 1 after paying 2 AP. Missing keys → no move. Do not call `applyPushback`. Do not clone Gaunt Step / Home Step.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — leftover gate + occupancy dest pick.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-poise-step
effectType: movement
effectCategory: position
targetType: ally
areaShape: single
apCost: 2
mpCost: 0
damage: 0
range: 4
cooldown: 2
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
effectParams: {"poiseStepNeedTiedGe1":true,"poiseStepAdj":1}
```

---

### SPELL_ID: `spell-poise-sill`

NAME: Poise Sill  
ROLE: TERRAIN — occupant whose leftover AP === leftover MP ≥ 1 takes 8 at start of their turn  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `effectParams: {"poiseSillNeedTiedGe1":true,"poiseSillDamage":8,"poiseSillDuration":2}`. Paint the clicked free ground tile. At the **start of the occupant’s turn**, if that combatant’s leftover AP === leftover MP **and leftover AP ≥ 1**, deal 8 through the existing combatant HP commit (`updateCombatant`). Walk-enter does **not** detonate (Ingress Mark). End-turn occupy does **not** detonate (Dwell / Poise Post). Relocate landing does **not** detonate (Drift Post). Distinct from Gaunt Sill (#849, leftover **both 0**), Wake Mark (start-turn **any leftover**), Ingress Mark (**walk enter**), Dwell Mark (**end-turn occupy, any leftover**), Parched Sill (forbids **walk spend**), Quiet Sill / Cast Sill / Drift Sill. The decision: stand on 2/2 and pay 8, or spend a pool and walk off, or dump to 0/0 and eat Gaunt Sill instead. Dual Keep **hurts** the occupant here.  
DURATION: 2 of the occupant’s turns  
SCALING: 8 follows damage% if any; otherwise fixed.  
SYNERGIES: Dual Keep / Poise Lend **keep** the occupant in the window; Bar Cross to **create** a tie on the tile; File Lance to pin them on it.  
COUNTERPLAY: Spend 1 leftover AP **or** 1 leftover MP before turn start; walk off (walk-safe); blink / swap off.  
POWER_BUDGET: Cheap 2 / CD 2. Power is **start-turn tax on a tie**, not a walk trap.  
AI_USAGE: `aiHint: "poise_sill_if_tile_will_be_occupied_by_tied_ge_1_foe"`. Masons / rooks. Skip if the tile is empty and no foe can occupy it this round.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Paint is observation. Later tax is not a second observe. Missing keys → no paint. Occupant leftover 0/0 at turn start → no tax (Gaunt Sill’s window). Empty tile at turn start → no tax, duration still ticks. Do not clone Wake / Ingress / Gaunt Sill.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — tile paint + start-turn leftover gate.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-poise-sill
effectType: terrain
effectCategory: terrain
targetType: ground
areaShape: single
apCost: 2
mpCost: 0
damage: 0
range: 3
cooldown: 2
freeCells: true
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
effectParams: {"poiseSillNeedTiedGe1":true,"poiseSillDamage":8,"poiseSillDuration":2}
```

---

### SPELL_ID: `spell-poise-hold`

NAME: Poise Hold  
ROLE: CONTROL — cannot spend walk MP while leftover AP === leftover MP ≥ 1  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"poiseHoldWhileTiedGe1":true,"poiseHoldDuration":2}`. For 2 of the **target’s** turns, any walk that would spend ≥ 1 leftover MP is illegal **while leftover AP === leftover MP and leftover AP ≥ 1**. Teleport / Swap / Phase Slip / Twin-gate step / Poise Step (caster relocate) do **not** pay walk MP and are legal. Distinct from Odd Hold (#849, cannot walk while leftover AP is **odd**), Dry Hold (until leftover **AP = 0**), Drift Hold (until **force-moved**), Cast Hold (cannot **spell** until walk), Strike Hold (cannot Strike until walk), Boot Hold (until Strike), Tool Hold (cannot tool until Strike), Gaunt Hold (Strike illegal unless leftover MP=0 and last AP), Even Stride / Odd Stride (**next walk dir**). The decision: they have 2/2 and wanted to walk — they must **break the tie** (cast, sip, get crossed) before walking, or wait 2 turns. At leftover 0/0 they have 0 MP anyway (Gaunt window).  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Dual Keep **locks** them in the window; Poise Lend **keeps** the tie; Bar Cross to **create** the tie; Must Poise after they cannot walk. Do **not** CORE with Must Poise as a Strike lock (this pass ships no Strike-only poise lock).  
COUNTERPLAY: Spend 1 leftover AP (cast) or 1 leftover MP (if a 0-MP walk exists it is still illegal while tied ≥1 — they must change a pool **without walking**, i.e. cast / get siphoned / get crossed); blink; wait.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **walk denial while tied**, not a root.  
AI_USAGE: `aiHint: "poise_hold_if_target_leftover_ap_eq_leftover_mp_ge_1_and_wants_to_walk"`. Hex / knights ELITE. Skip if leftover AP ≠ leftover MP or leftover AP = 0.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Missing keys → no arm. Leftover 2/1 → walk legal (equality failed). Leftover 0/0 → walk illegal for lack of MP, not because of this hold. Do not clone Odd Hold / Dry Hold / Cast Hold / Gaunt Hold.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — walk-spend gate + leftover equality.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-poise-hold
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
minLevel: 2
isBaseSpell: false
effectParams: {"poiseHoldWhileTiedGe1":true,"poiseHoldDuration":2}
```

---

### SPELL_ID: `spell-poise-lend`

NAME: Poise Lend  
ROLE: SUPPORT — +1 current AP **and** +1 current MP to an ally whose leftover AP === leftover MP ≥ 1  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"poiseLendAp":1,"poiseLendMp":1,"requireTargetTiedGe1Lend":true}`. If the **target** has leftover AP === leftover MP **and leftover AP ≥ 1**, grant +1 current AP and +1 current MP (capped at max). The tie **survives** (both pools +1). If the gate fails, fizzle rider (AP spent, no grant). Distinct from Gaunt Lend (#849, +1/+1 if leftover **both 0**), Lean Lend (+1 **MP** if leftover **AP = 0**), Drift Lend (+1 **AP** if **forced**), Spent Lend (+1 **MP** if they **walked**), Watch Alms (overwatch +1 AP on a walker), Tempo Gift / Loan Tempo / Haste (ungated grants), Dual Keep (**next-turn start cap**, not a now-grant). The decision: top up the 1/1 wisp to 2/2 so Poise Mend / Poise Hood still fire — Dual Keep then **banks** the new leftover.  
DURATION: instant grant  
SCALING: none. Caps at max.  
SYNERGIES: Dual Keep to **keep** the new leftover; Poise Mend / Poise Hood / Must Poise on the same body; Bar Cross first if they were 3/1.  
COUNTERPLAY: Drain Courage / Slow after the grant; kill the buffer; spend one pool so the next Poise tool fizzles.  
POWER_BUDGET: Cheap 2 / CD 2. Power is **keeping a tie**, not a Haste. Do not CORE with Haste / Loan Tempo / Gaunt Lend.  
AI_USAGE: `aiHint: "poise_lend_if_ally_tied_ge_1"`. Buffers / bishops. Skip if the ally is not in the window **or** both pools are already at max.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Self-cast legal if caster leftover AP === leftover MP ≥ 1 after paying 2 AP. Missing keys → no grant. Target leftover 0/0 → fizzle (Gaunt Lend’s window). Do not clone Gaunt Lend / Haste / Dual Keep.  
IMPLEMENTATION_COMPLEXITY: LOW — leftover gate + two capped grants.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-poise-lend
effectType: buff
effectCategory: support
targetType: ally
areaShape: single
apCost: 2
mpCost: 0
damage: 0
range: 3
cooldown: 2
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
effectParams: {"poiseLendAp":1,"poiseLendMp":1,"requireTargetTiedGe1Lend":true}
```

---

### SPELL_ID: `spell-poise-sip`

NAME: Poise Sip  
ROLE: CONTROL — steal 1 leftover AP iff leftover AP === leftover MP ≥ 1  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: No damage. `effectParams: {"poiseSipAp":1,"requireTargetTiedGe1Sip":true}`. If the **target** has leftover AP === leftover MP **and leftover AP ≥ 1**, steal 1 leftover AP (target −1 AP, caster +1 AP, each capped). After the steal the target is **no longer tied**. If the gate fails, fizzle rider (AP spent, no steal). Distinct from Bare Sip (#849, leftover **AP** iff leftover **MP = 0**), Parched Sip (leftover **MP** iff leftover **AP = 0**), Gait Sip (**MP** iff they **walked**), Drift Sip (leftover **AP** iff **forced**), Soul Sip (ungated MP), Drain Courage (drain + AP debit, not leftover-gated), Watch Sip (#837). The decision: break their 2/2 into 1/2 so Poise Hood / Poise Mend / Must Poise drop, and you gain 1 AP.  
DURATION: instant leftover steal  
SCALING: none.  
SYNERGIES: Poise Hold after you leave them 1/2 (walk legal again, but Poise tools drop); Cadence Floor on the same body; Must Poise **before** the sip while they are still tied.  
COUNTERPLAY: Spend a pool before the sip; leftover 0/0 is Bare Sip’s window, not this; leftover 3/1 is Full Sting’s window, not this.  
POWER_BUDGET: Cheap 2 / CD 1. Power is **breaking a tie by stealing AP**, not a drain.  
AI_USAGE: `aiHint: "poise_sip_if_target_tied_ge_1"`. Hex / pawns. Skip if not in the window.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing keys → no steal. Target leftover 1/1 → they go to 0/1 (Poise window closes; Bare Sip still closed because leftover MP ≠ 0). Caster at max AP → target still −1, caster gain discarded (cap). Do not clone Bare Sip / Parched Sip / Drain Courage.  
IMPLEMENTATION_COMPLEXITY: LOW — leftover gate + one AP steal.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-poise-sip
effectType: drain
effectCategory: control
targetType: enemy
areaShape: single
apCost: 2
mpCost: 0
damage: 0
range: 3
cooldown: 1
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
effectParams: {"poiseSipAp":1,"requireTargetTiedGe1Sip":true}
```

---

### SPELL_ID: `spell-poise-post`

NAME: Poise Post  
ROLE: SUMMONS — empty-kit mine; end-turn occupy detonates iff leftover AP === leftover MP ≥ 1  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "poisepost"`, `summonLifespan: 3`, empty kit. `effectParams: {"poisePostDetonateDamage":10,"poisePostNeedTiedGe1":true}`. Place on a free ground tile. At **end of a combatant’s turn**, if they **occupy** this body and leftover AP === leftover MP **and leftover AP ≥ 1**, deal 10 to that occupant through `updateCombatant` and this summon dies. Walk-enter does **not** detonate (Ingress). Relocate landing does **not** detonate (Drift Post). Start-of-turn does **not** detonate (Wake / Gaunt Sill / Poise Sill). Distinct from Gaunt Post (#849, leftover **both 0**), Lean Post (leftover **AP = 0** only), Dummy Post (taunt), Drift Post (**relocate landing**), Dwell Mark (**end-turn occupy, any leftover**), Wake Mark (**start-turn** tile). The decision: end the turn on 2/2 and eat 10, or spend a pool, or dump to 0/0 and eat Gaunt Post instead. Dual Keep **hurts**. Walk-safe. Relocate-safe. Start-turn-safe.  
DURATION: lifespan 3 or until detonate  
SCALING: 10 follows damage% if any; otherwise fixed.  
SYNERGIES: Dual Keep / Poise Lend **keep** the occupant in the window; Poise Hold so they cannot walk off; File Lance to pin.  
COUNTERPLAY: Spend a pool before turn end; walk off (walk-safe); Coup the post; blink.  
POWER_BUDGET: Standard 3 / CD 3 / 0 upfront. Power is **end-turn occupy on a tie**. Counts as **one** toward the summon cap.  
AI_USAGE: `aiHint: "poise_post_if_foe_will_end_turn_tied_ge_1_on_tile"`. Masons / pawns. Skip if cap is full.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","rook"]`, `levelZoneMin: 1`  
EDGE_CASES: **Summon is observation.** Later detonate / death is not a second observe. Missing keys → do not spawn a Dummy Post. Occupant leftover 0/0 at turn end → no detonate (Gaunt Post’s window). Empty tile → no detonate, lifespan ticks. Never parse `"Poise Post"`. Do not mint `spell-poise-burst`. Prefer fizzle-and-detonate if the body is displaced by Swap (body gone → no tile tax).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — empty-kit summon + end-turn leftover gate. Same class as Gaunt Post / Lean Post.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-poise-post
effectType: summon
spellType: summon
targetType: ground
areaShape: single
apCost: 3
mpCost: 0
damage: 0
range: 2
cooldown: 3
freeCells: true
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isSummon: true
summonAI: poisepost
summonLifespan: 3
isBaseSpell: false
effectParams: {"poisePostDetonateDamage":10,"poisePostNeedTiedGe1":true}
```

---

### SPELL_ID: `spell-poise-bounce`

NAME: Poise Bounce  
ROLE: DAMAGE — 12 to primary; bounce 1 to nearest other leftover-AP===leftover-MP≥1 hostile  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 12 to primary (ungated). `effectParams: {"poiseBounceNeedTiedGe1":true,"poiseBounceSearchRadius":4,"poiseBounceCount":1}` — search Chebyshev ≤ 4 for the nearest **other** living hostile whose leftover AP === leftover MP **and leftover AP ≥ 1**; deal 12 to that body too. Primary leftover unconstrained. Distinct from Gaunt Bounce (#849, second body leftover **both 0**), Parched Bounce (leftover **MP = 0**), Heave Bounce (**force-moved**), Chain Lightning (nearest **any**, 2 bounces), Ricochet Mark, Split Fang. The decision: open on whoever, splash the 2/2 bishop — or wait for two empty bodies and Gaunt Bounce.  
DURATION: instant  
SCALING: 12 follows damage%.  
SYNERGIES: Dual Keep on the backline; Bar Cross to **create** a second tied body; Poise Sip on the primary after (does not need the primary in-window).  
COUNTERPLAY: Break the backline’s equality; stack so no second body is in radius 4; kill the 2/2 first.  
POWER_BUDGET: Standard 3 / CD 2. 12 ungated + 12 gated on a **second** body. Bounce count 1. Do not CORE with Chain Lightning.  
AI_USAGE: `aiHint: "poise_bounce_if_second_tied_ge_1_hostile_in_r4"`. Queens / bishops. Skip if no second in-window body **and** a Strike would kill the primary; 12 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Cast (AP spent) **is** observation, including a bounce that finds no second body. Missing keys → 12 primary only. Primary leftover 2/2 does **not** consume the bounce (search is **other** bodies). Do not clone Chain Lightning / Gaunt Bounce.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — nearest-other search + leftover gate. Existing bounce helper if any; else one extra hit.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-poise-bounce
effectType: damage
spellType: damage
targetType: enemy
areaShape: single
apCost: 3
mpCost: 0
damage: 12
range: 3
cooldown: 2
hitsMultiple: true
bounces: 1
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
effectParams: {"poiseBounceNeedTiedGe1":true,"poiseBounceSearchRadius":4,"poiseBounceCount":1}
```

---

### SPELL_ID: `spell-must-poise`

NAME: Must Poise  
ROLE: CONTROL — remaining non-Strike spells illegal unless leftover AP === leftover MP ≥ 1 **and** this spell spends last AP  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"mustNonStrikeUnlessTiedGe1AndSpendsLastAp":true}`. Arm on the caster: until the end of this turn, every remaining **non-Strike** spell is illegal unless (a) leftover AP === leftover MP **and leftover AP ≥ 1** **immediately before** that spell **and** (b) that spell’s AP cost equals leftover AP (it spends last AP). Strike remains legal. Distinct from Must Gaunt (#849, leftover **MP = 0** and last AP), Must Lean (leftover **MP = 0** only), Must Drift / Must Span / Must Pace / Must Step (walk **dir** / occupy), Cast Hold (cannot **spell** until walk), Tool Hold (cannot tool until Strike), Rank Lock, Inch Stride. The decision: you wanted a 3-AP nuke with 3/3 leftover — legal as last packet — or you wanted two 2-AP tools off a 2/2 and the second is illegal. Do **not** ship a Strike-only poise lock this pass (Gaunt Hold’s cousin). Do **not** CORE Must Poise with Gaunt Hold / Must Gaunt.  
DURATION: rest of this turn  
SCALING: none.  
SYNERGIES: Dual Keep to **hold** 3/3 into the nuke; Poise Lend to rebuild a tie; Cadence Floor on the foe after the nuke.  
COUNTERPLAY: Drain Courage so leftover AP ≠ leftover MP; Quiet Hex the nuke; wait the turn.  
POWER_BUDGET: Standard self-control, 0 damage, CD 2. Power is **forcing the last packet of a tied turn onto one verb**.  
AI_USAGE: `aiHint: "must_poise_if_leftover_ap_eq_leftover_mp_ge_3_and_has_a_last_packet_spell"`. Knights / pawns ELITE. Skip if leftover AP ≠ leftover MP or leftover AP = 0. Do not arm if the only remaining legal verb is Strike and a walk would kill.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 2`  
EDGE_CASES: Arming (AP spent) **is** observation, including a later blocked spell. Missing key → no arm. Leftover 0/0 does **not** legalize non-Strike (Must Gaunt’s window). Leftover 2/2 and a 3-AP spell is illegal (does not spend last AP). Do not clone Must Gaunt / Cast Hold / Gaunt Hold.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — remaining-spell legality gate + leftover equality + last-AP check.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-must-poise
effectType: buff
effectCategory: control
targetType: self
areaShape: single
apCost: 3
mpCost: 0
damage: 0
range: 0
cooldown: 2
usableByPlayer: true
usableByEnemy: true
minLevel: 2
isBaseSpell: false
effectParams: {"mustNonStrikeUnlessTiedGe1AndSpendsLastAp":true}
```

---

### SPELL_ID: `spell-verse-poise`

NAME: Verse Poise  
ROLE: CONTROL — last resolved id is illegal until leftover AP === leftover MP ≥ 1  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"versePoiseUntilTiedGe1":true}`. The target’s **last resolved spell id** (not Strike unless Strike was the last resolved id) is illegal until leftover AP === leftover MP **and leftover AP ≥ 1**. Lifts the moment the leftover gate is true, even mid-turn. Distinct from Verse Gaunt (#849, lifts at leftover **both 0**), Verse Lean (lifts at leftover **MP = 0**), Verse Pace (lifts when they **walk**), Verse Tax (legal but **+1 AP**), Verse First, Last Mute (duration), Once Verse, Stolen Verse, After Verse, Cast Hold. **Leftover 0/0 does not lift this** — that is Verse Gaunt’s window. The decision: Inferno just resolved — they must **match leftover ≥ 1** (Dual Keep / Haste then spend) before recasting Inferno, or recast something else.  
DURATION: until leftover AP === leftover MP ≥ 1, or battle end  
SCALING: none.  
SYNERGIES: Cadence Floor so the locked id is also remaining 1; Poise Hold so they cannot walk-spend MP to break a future tie; Dual Keep **helps them** lift — do not CORE as a punish if the family already banks leftover.  
COUNTERPLAY: Dual Keep / Haste to **create** a tie; recast a different id; wait. Dumping both pools to 0 **does not** lift (Verse Gaunt would).  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **locking the last verse until a nonzero tie**.  
AI_USAGE: `aiHint: "verse_poise_if_target_last_id_is_their_win_condition"`. Hex / bishops. Skip if they have no last resolved id, or if they already sit on a ≥1 tie (instant lift — fizzle rider).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Arming (AP spent) **is** observation, including no-last-id fizzle. Missing key → no arm. Last id Strike → Strike is illegal until the tie (unusual; preview must say so). Do not clone Verse Gaunt / Last Mute / Hex of Silence.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — last-resolved-id lock + leftover equality lift. Same class as Verse Gaunt / Verse Lean.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-verse-poise
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
effectParams: {"versePoiseUntilTiedGe1":true}
```

---

### SPELL_ID: `spell-court-floor`

NAME: Court Floor  
ROLE: SUPPORT — Cadence Floor on **every other** body (init order)  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `effectParams: {"floorRemainingCdsTo1":true,"courtFloorExcludeCaster":true}`. In initiative order, every living combatant **except the caster** has remaining `n>1` rewritten to `1` (zeros stay 0; ones stay 1), same rewrite as Cadence Floor. Distinct from Court Lag (#849, mass Lag `n>0` → `n+2`), Court Imprint (mass Imprint), Court Dual / Court Keep / Court Stretch / Court Hinge / Court Shove / Court Fold, Cadence Floor (one body), Cadence Flush (all → 0, ally), Cadence Swap (two-body map exchange). Player never owns this. Witness without grant.  
DURATION: instant rewrite  
SCALING: none.  
SYNERGIES: Kit with Cadence Floor on the caster’s own target after, or Crack a remaining 1 to 0. Do **not** CORE with Court Lag.  
COUNTERPLAY: Recast before Court Floor; Cadence Break your own remaining to 0 first; kill the regent.  
POWER_BUDGET: Signature 6 / CD 4 / 0 damage. Power is **board-wide remaining compress**. Kit-only.  
AI_USAGE: `aiHint: "court_floor_if_two_plus_foes_have_remaining_cd_ge_3"`. Kit-only regent. Skip if every other remaining is already 0 or 1.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. `NOT_PLAYER_LEARNABLE`. `court_floor_regent` kit-only. Arm is observation for witness-only kits. Never written to owned ids.  
EDGE_CASES: Missing `courtFloorExcludeCaster` → do not floor the caster (fail closed, still observe). Do not write `spellLevelValues`. Do not mint `spell-court-arm`. Preview must list who compresses.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — init-order walk + Cadence Floor rewrite. Same class as Court Lag.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-court-floor
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
effectParams: {"floorRemainingCdsTo1":true,"courtFloorExcludeCaster":true}
```

---

## 6. Combination matrix (statuses × leftover × terrain)

| Window | Tools |
| :--- | :--- |
| Leftover AP === leftover MP **and leftover AP ≥ 1** on an **ally** | Poise Mend (both bodies), Poise Step, Poise Lend |
| Same window on a **hostile** | Poise Sting, Poise Sill (their turn start), Poise Hold (cannot walk), Poise Sip (breaks the tie), Poise Post (their turn end), Poise Bounce (second body), Must Poise (self), Verse Poise (lifts here) |
| Same window on **self** | Poise Hood, Must Poise |
| Leftover AP = 0 **and** leftover MP = 0 | **Not this pass.** Gaunt / Hollow Gift / Bare Sip / Verse Gaunt. Poise keys fail `Ge1`. |
| Dual Keep / Purse Keep / Stride Keep surviving equal bank ≥ 1 | **Opens** every Poise gate. **Blocks** every Gaunt / Hollow Gift gate. |
| Remaining CD `n>1` on a hostile | Cadence Floor / Court Floor |
| Solid 3×3 free | Nine Span occupies all nine. Oct Span would have left the center as a hole. |
| Two leftover pairs | Bar Cross moves AP↔MP **across bodies**. Tempo Invert stays one-body ally. |

Dual Keep leftover that survives turn start with **unequal** banks (3 AP / 1 MP) **blocks** Poise **and** Gaunt. Spend one pool to enter a window, or Bar Cross to reshuffle across bodies.

---

## 7. Implementation order (not this pass)

1. Discovery ownership split (`SDE-2026-08-31-001`) — without it every Wave-14 id forced into `starterSpells` becomes always-owned.
2. Leftover AP / leftover MP writers (HUD pools after each spend). Dual Keep / Purse Keep / Stride Keep must write surviving leftover at turn start.
3. Cadence remaining-CD maps (already required by Waves 5–13). Cadence Swap (#837) is full remaining-map exchange. Cadence Floor is remaining `n>1` → `1`.
4. Occupy-weight **before** Nine Span (cap 2 cannot host weight 9). Oct Span (weight 8) has the same prerequisite.
5. Confirm gates for Must Poise / Poise Hold / Verse Poise / Bar Cross.
6. Solid multi-cell occupy (`ninespan`) and empty-kit mine (`poisepost`).
7. Do **not** land `spell-parched-mend`. Do **not** reuse `invertApMp`.

Do not implement production code in this pass.

---

## 8. QA (design-level)

| ID | Check |
| :--- | :--- |
| W14-1 | No Wave-14 id appears in `spellData.ts` / `SPELL_ID_CATALOG` / §1.4 tombstone |
| W14-2 | `spell-parched-mend` is **not** shipped; Dry Gait owns leftover-MP=0 heal |
| W14-3 | `spell-poise-mend` requires leftover AP === leftover MP **and leftover AP ≥ 1** on **both** bodies. Hollow Gift / Gaunt Mend own **0 = 0**. |
| W14-4 | Cadence Floor is remaining `n>1` → `1`; zeros stay 0; ones stay 1. Does **not** clone Cadence Swap / Lag / Halve / Crack / Flush |
| W14-5 | Nine Span is solid 3×3, counts as **nine**, center occupied. Oct Span stays hollow eight |
| W14-6 | Bar Cross is two-body leftover AP↔MP. Does **not** clone Tempo Invert. Does **not** reuse `invertApMp` |
| W14-7 | Poise Hood does **not** retag `even_gallery` / Spent Plate / Gait Plate |
| W14-8 | Poise Sting bonus is leftover AP === leftover MP ≥ 1, not Ready Sting’s ungated both-≥1 and not Gaunt Sting’s both-0 |
| W14-9 | Poise Sip **breaks** the tie. Bare Sip stays leftover MP = 0 |
| W14-10 | Must Poise is **not** in the same CORE as a Strike-only poise lock (none shipped) |
| W14-11 | Court Floor is `NOT_PLAYER_LEARNABLE`; `court_floor_regent` is kit-only |
| W14-12 | Extra doors `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` do not restamp #808 / #836 / #849 / #837 |
| W14-13 | `mpCost` is 0 on every Wave-14 row |
| W14-14 | `summonAI` values are `"ninespan"` / `"poisepost"` enums, never parsed names |
| W14-15 | Nine Span does not ship against `ENEMY_SUMMON_CAP === 2` without occupy-weight |
| W14-16 | Verse Poise does **not** lift at leftover 0/0 (Verse Gaunt’s window) |

---

## 9. Out of scope

- Production TypeScript / Motoko / bindgen / PocketIC.
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / **#836** own extra doors).
- Restamping any door in §3.4.
- A fourth `mpCost > 0` walk snipe; Hex of Silence; About Hinge; mid-RAF splice; sixth echo; one-body AP===MP≥1 heal; hostile one-body leftover invert; remaining 0 → 1; ten-cell occupy; leftover-sum windows.
- Cloning Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Shadow Veil, Mirror / Reflect, Lens / Overcast, Short Sight / Paper Wind, Tempo Gift / Loan Tempo, Goad / Taunt Oath, Rime Tile / Rime Sheet, File Lance, Blood Tithe, Hex of Silence, Dry Mend, Dry Gait, Parched Mend, Hollow Gift, Cadence Swap, Gaunt Mend, Tempo Invert.
- Putting unique #802 / #837 / #849 ids in this catalog.

---

## 10. Catalog index

| SPELL_ID | NAME | ROLE | ACQUISITION | AP | CD | Door |
| :--- | :--- | :--- | :--- | ---: | ---: | :--- |
| `spell-poise-mend` | Poise Mend | SUPPORT | MULTI_SOURCE | 3 | 2 | `poise_cantor` |
| `spell-cadence-floor` | Cadence Floor | CONTROL | MULTI_SOURCE | 3 | 2 | `floor_precentor` |
| `spell-nine-span` | Nine Span | SUMMONS | MULTI_SOURCE | 4 | 3 | `span_nine` |
| `spell-bar-cross` | Bar Cross | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-poise-hood` | Poise Hood | DEFENSE | ELITE | 2 | 2 | (piece observe) |
| `spell-poise-sting` | Poise Sting | DAMAGE | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-poise-step` | Poise Step | POSITION | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-poise-sill` | Poise Sill | TERRAIN | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-poise-hold` | Poise Hold | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-poise-lend` | Poise Lend | SUPPORT | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-poise-sip` | Poise Sip | CONTROL | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-poise-post` | Poise Post | SUMMONS | ENEMY_DISCOVERY | 3 | 3 | (piece observe) |
| `spell-poise-bounce` | Poise Bounce | DAMAGE | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-must-poise` | Must Poise | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-verse-poise` | Verse Poise | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-court-floor` | Court Floor | SUPPORT | NOT_PLAYER_LEARNABLE | 6 | 4 | `court_floor_regent` (kit) |

STATUS: PROPOSED — no production code.

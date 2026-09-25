# Spell and Tactical Mechanics — Design Pass 2026-09-25

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Days since last tactical pass:** 1 (Wave 7 is still-open #525 @ same HEAD; Wave 6 is still-open #463; Wave 5 is still-open #411; Wave 4 is still-open #342; Wave 3 on `main` is 2026-09-02)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1–3 on `main`; Wave 4 still-open [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-2940/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md) (#371); Wave 6 still-open [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-df4f/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md) (#480); Wave 7 still-open [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-5522/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md) (#533). **No** `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` landed (Discovery Wave 5 unique catalog is memory-reserved only).
- Tactical Wave 7 still-open [`SPELL_PROPOSALS_2026-09-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-1feb/docs/automation/SPELL_PROPOSALS_2026-09-24.md) (#525)
- Tactical Wave 6 still-open [`SPELL_PROPOSALS_2026-09-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-f0eb/docs/automation/SPELL_PROPOSALS_2026-09-23.md) (#463)
- Tactical Wave 5 still-open [`SPELL_PROPOSALS_2026-09-22.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-7c26/docs/automation/SPELL_PROPOSALS_2026-09-22.md) (#411)
- Tactical Wave 4 still-open [`SPELL_PROPOSALS_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-f488/docs/automation/SPELL_PROPOSALS_2026-09-21.md) (#342)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); Wave 5 extra doors still-open #367; Wave 6 extra doors still-open #406; Wave 7 extra doors still-open #474; Wave 8 extra doors still-open #518
- Prior tactical passes on `main` — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) (Wave 1), [`SPELL_PROPOSALS_2026-09-01.md`](./SPELL_PROPOSALS_2026-09-01.md) (Wave 2), [`SPELL_PROPOSALS_2026-09-02.md`](./SPELL_PROPOSALS_2026-09-02.md) (Wave 3)

This is **Wave 8**. Waves 1–3 are on `main`. Waves 4–7, Discovery Wave 4 / Wave 6 / Wave 7, and Boss Waves 5–8 are still paper on open PRs. This pass treats those ids as **already reserved**.

**Wave 7 explicitly deferred seven holes to this pass:** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; a sixth echo id; player-owned Hex of Silence (full bar lock); heal-if-caster-moved; 90° hinge of **two hostiles as a pair**; reset **all** of another combatant’s CDs (Crack is highest-one only).

**This pass fills three of those and holds the other four:**

| Deferred hole | This pass |
| :--- | :--- |
| Heal if the caster moved | **Filled:** Gait Mend (`spell-gait-mend`) — heal 8 only if the caster spent ≥ 1 walk MP this turn. Inverse of Post Sting (damage if unmoved) and sibling of Boot Sting (damage if walked). |
| 90° hinge of two hostiles as a pair | **Filled:** Pair Hinge (`spell-pair-hinge`) — rotate **both** bodies 90° around their midpoint. Pivot Foe rotates one body around the caster. Hinge Step rotates the caster around an ally. Court Hinge is the mass signature. |
| Reset **all** of another combatant’s CDs | **Filled:** Cadence Flush (`spell-cadence-flush`) — **ally**, every remaining CD → 0, once/battle. Cadence Crack is **hostile**, highest-one only. Cadence Break is **self** last-id. This is a dump-the-bar gift, not a lockout. |
| Fourth `mpCost > 0` walk snipe | **Held.** Combined paper stays Ley Toll / Undertow / Sanguine Toll. Discovery W4 / W6 / W7 forbade a fourth. Catalog default stays `mpCost: 0`. |
| Sixth echo id | **Held.** After Verse / Stolen Verse / Echo Cast / False Echo / Choir Verse already cover the axis. Once Verse is a recast lock, not a replay. |
| Player-owned full-bar silence | **Held.** Hex of Silence stays unowned. Mute Thread / Oath Blade / Dull Edge / Once Verse / Must Pace / Strike Hold / Ground Oath already own narrower locks. |
| Mid-RAF splice of the current actor | **Held.** AGENTS.md forbids incidental turn-logic. Cut In / False Echo / Eclipse Fold consume the wrap PR. Queue Cut / Act Bell / False Cut consume the end-of-turn PR. Do not splice the current actor. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after that reserved set. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

If Discovery Wave 8 ships a unique catalog the same day, **those ids win on collision**; this file’s tombstone is the claim for Wave-8 **tactical** ids.

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is **byte-stable in identity** since 2026-08-31: still 32 frontend ids, still six backend seeds, still no discovery persist. Twenty-three days of merges (`58302bc` → `0f5363f`, through #332) plus the 2026-09-21 … 2026-09-24 open-PR stacks did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`.

`WorldExploration.tsx` is **19,213** lines (`wc -l`). Same count as Waves 6–7. The defects did not shrink.

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
| `spell-swap` | Swap | caster ↔ enemy | 3 | 0 | 3 | Only position spell; `isSwap` → `swapPositions` |
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
| `spell-drain-courage` | Drain Courage | drain + AP | 4 | 18 / heal 9 + AP−1 | 2 | Only AP debit (no grant) |
| `spell-cursed-wound` | Cursed Wound | dmg + anti-heal | 3 | 22 + healRecv ×0.5 / 2 | 3 | |
| `spell-shadow-veil` | Shadow Veil | dmg + RES/SP | 3 | 18 + ×0.85 / 2 | 3 | Near-duplicate of Expose |
| `spell-inferno` | Inferno | DoT burn | 5 | 8×3, CD 3 | 3 | Only frontend cooldown |
| `spell-frost-nova` | Frost Nova | AoE + slow | 4 | 15 + MP−1 r=2 | 1 | Circle only |
| `summon-dire-wolf` | Dire Wolf | hunter | 3 | Strike + Venom | 2 | Lifespan 4 |
| `summon-sentinel` | Sentinel | guardian | 3 | Shield + Iron Skin | 2 | Player-only |
| `summon-archer` | Archer | kiter | 3 | Poison + Slow | 2 | |
| `summon-bomber` | Bomber | kamikaze | 2 | Inferno | 2 | Player-only |
| `summon-wisp` | Wisp | mobile healer | 2 | Mend + Rally | 2 | Walks; not a totem |

**None** of these rows set `lineOfSight`, `linear`, `diagonal`, `modifiableRange`, `minRange`, or `maxRange`. **No row sets `mpCost` ≠ 0** (every literal is `BigInt(0)`). No row uses `targetType: "line"` even though `targeting.ts` 576–617 implements that branch. `areaShape` is typed as `circle | cone | line | cross | single` (`gameTypes.ts` 224) but **targeting never reads `areaShape`** — area expansion is Chebyshev around `areaRadius` (`targeting.ts` 690–727).

`Enemy.currentView` exists (`gameTypes.ts` 297). Overworld wander writes it (`WorldExploration.tsx` 6924–6938). Battle walks and the player body still do **not** write it. Combat never reads it for damage. Wave 5 Oncoming / Facing Pin / Glance Cut own that field after a battle-walk writer exists. This pass adds **zero** facing cards.

`CharacterStats.evasion` exists (`gameTypes.ts` 64) and is persisted. Combat never reads it. This pass does **not** wire a miss %.

### 1.2 Backend admin seed — `src/backend/lib/admin.mo` `defaultSpells()`

Six ids, still **not** in `SPELL_ID_CATALOG`. They carry targeting flags. All six still have `mpCost = 0`.

| ID | Name | AP | CD | Flags | Notes |
| :--- | :--- | ---: | :--- | :--- | :--- |
| `shadow_strike` | Shadow Strike | 3 | 2 | diagonal, no LoS, range 1–4 | Only diagonal poke — **not in the live catalog** |
| `soul_rend` | Soul Rend | 3 | 4 | LoS, DoT 25 | |
| `vampire_bite` | Vampire Bite | 3 | 2 | drain 20/20, adjacent | |
| `reflect_barrier` | Reflect Barrier | 3 | 3 | self, defense | Mirror clone |
| `thunder_clap` | Thunder Clap | 4 | 3 | 8-dir AoE 25 via `hitTiles` | Closest thing to a cross |
| `void_collapse` | Void Collapse | 12 | 5 | attract-all + 80 AoE, `minLevel` 30 | Do not copy |

`OLD_SPELL_NAMES_SET` (`WorldExploration.tsx` 2356–2389) still filters by **name and id**. That heuristic is forbidden going forward (Admin design §1.6).

### 1.3 Engine support vs catalog use (line numbers at this HEAD)

| Mechanic | Engine @ `0f5363f` | Live catalog | Already proposed (reserved) | This pass |
| :--- | :--- | :--- | :--- | :--- |
| Spell `mpCost` debit | `executeCastAttempt` (`WorldExploration.tsx` 17096–17207) gates **AP only**. Spellbook UI can *display* MP (`SpellbookModal.tsx` 966–977). | Always 0 | Ley Toll (2); Undertow (1); Sanguine Toll (1 + HP) | **No fourth.** Every Wave-8 row is `mpCost: 0`. |
| `areaShape` cone | Typed, **unread**. Area = Chebyshev (`targeting.ts` 690–727) | Unused | Fan Bolt / Gale Fan | Unused this pass |
| `targetType: "line"` | Implemented 8-dir ray (`targeting.ts` 576–617) | **No spell** | File Lance | Unused this pass |
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** | Unused | Shoulder Bash, Gale Fan, Draw Together, Body Check, File Reel, Board Tilt, Shove Face, Ally Reel | **Pair Hinge** rotates two bodies via occupancy dests, not `isSwap`. Court Hinge is mass. |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637; WX `swapPositions` 9389–9401 still copies coords) | Swap | Twin Guard / Pawn Trade / Ward Interpose / Pet Swap / Hinge Tile | Unused this pass. Pair Hinge is **not** `isSwap`. |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire | Brick Shift **moves** an existing barrier. Mend Wick is delayed **heal**, not a trap. |
| Heal-if-moved | Absent | Instant Mend / Rally only | Post Sting bonuses if **unmoved**; Boot Sting bonuses if **walked** (damage) | **Gait Mend** heals iff walked. Split Mend / Enter Mend / Mend Wick are other heal shapes. |
| Two-body pair rotate | Absent | Absent | Pivot Foe = one body around caster; Hinge Step = caster around ally; Pawn Trade = swap two hostiles | **Pair Hinge** = both hostiles 90° around **their** midpoint |
| Cooldown write | `executeCastAttempt` 17200–17203 + `nextSpellCooldownTurns` (`challengeCompletion.ts` 365–368) | Inferno CD 3 | Cadence Theft −1 / +1; Cadence Break = **self** last-id → 0; Cadence Lend ally −1; Cadence Crack = **hostile** highest → 0 | **Cadence Flush** = **ally**, **all** remaining → 0, once/battle |
| Hit return | Mirror reflects the **spell** | Mirror | Pain Link %; Cover Step whole hit; Flank Share 50/50; Thin Ward cap incoming | **Return Sting** stores the applied hit, deals 0 to you, pokes `floor(applied/2)` back. Not a reflect. |
| Unit next-hit amp | Mark is a **tile** | Mark | Split Mark / Twice Mark / Cast Mark (detonate on **their** cast) | **Body Mark** is unit-scoped ×1.5, 1 charge |
| Walk forbid, casts legal | Root is 0 walk; Rank Lock is axis; Must Pace **requires** walk to cast | Slow is MP | Gait Seal is new | **Gait Seal** = no walk MP spend, spells still legal |
| Diagonal-only walk | Rank Lock is rank XOR file | Absent as diagonal | Diag Lock is new | **Diag Lock** = next walks must be `|dx|===|dy|` |
| Move existing barrier | Barrier **places** | Barrier | Hinge Tile swaps a pad; Brick Shift is new | **Brick Shift** slides one barrier 1 Chebyshev |
| Delayed tile heal | Fuse is delayed **damage**; Pit Wick is delayed **pit** | Absent as heal | Mend Wick is new | **Mend Wick** converts after 1 turn: occupant heals 8 |
| Enter heal tile | Gift Sill is enter **+MP**; Exit Boon is leave +MP; Glyph Tax is enter AP | Absent as HP | Enter Mend is new | **Enter Mend** first enter heals 6 once |
| Isolated-target bonus | Split Fang / Crowd Tax want **clusters** | Absent as isolation | Lone Sting is new | **Lone Sting** +8 iff 0 Chebyshev-1 same-side hostiles |
| Delayed self absorb | Ward Plate is now; Surplus Ward / Thin Ward / Turn Cap are other caps | Absent as next-turn arm | Morrow Plate is new | **Morrow Plate** arms now, absorb 10 starts on **your next turn** |
| Leftover AP transfer | Purse Cut freezes **their** leftover; Split Purse splits **theirs**; Tempo Gift / Loan Tempo **grant** | Absent as dump-yours | Leftover Lend is new | **Leftover Lend** moves **your** leftover AP to an ally; your AP → 0. Does **not** splice the turn. |
| 1-HP taunt post | Bait Pylon / Bait Eat; Goad is unit-targeted | Five live AIs | Dummy Post is new | **`summonAI: "dummypost"`** empty kit, Chebyshev-1 taunt aura |
| Heal 50/50 | Flank Share is **damage** 50/50 | Instant self heals | Split Mend is new | **Split Mend** splits 12 HP with one adjacent ally |
| Mass pair-hinge | Court Fold / File Fold / Court Shove | Unused together | Court Hinge is new | **Court Hinge** (`NOT_PLAYER_LEARNABLE`) pair-hinges every Chebyshev-1 hostile pair |

`buildEnemyKit` is still called with `currentMap.levelZone` (`WorldExploration.tsx` 11920). Non-number → `NaN` → every kit stays zone 0. `inferArchetype` still treats `healAmount > 0` as healer (`enemyAI.ts` 447–452). Summon archetype still falls back to **name** (`enemyAI.ts` 217–224: `wolf` / `golem` / `wisp`). Forbidden for new ids: Dummy Post uses `summonAI: "dummypost"`. Never parse `"Dummy Post"`. Gait Mend / Split Mend / Enter Mend / Mend Wick **do** set `healAmount` / `spellType: "heal"` — AI that must not become a healer must not receive those ids in CORE.

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

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` (tactical W2 **and** Discovery W2); `spell-blood-tithe` (tactical W2 pet sacrifice **versus** Discovery W2 HP→AP). Wave 8 does not add a third.

**Do not alias** Gait Mend ↔ Blood Mend / Rally / Boot Sting / Post Sting / Planted Stance / Clean Blood / Mercy Hex; Pair Hinge ↔ Pivot Foe / Hinge Step / Pawn Trade / Twin Guard / Draw Together / Ally Reel / File Fold; Cadence Flush ↔ Cadence Crack / Break / Theft / Lend / Pet Verse; Lone Sting ↔ Split Fang / Crowd Tax / Wall Sting / Boot Sting / Sated Fang / Far Sting; Morrow Plate ↔ Morrow Step / Ward Plate / Surplus Ward / Thin Ward / Turn Cap / Bloodless Plate; Gait Seal ↔ Root Snare / Rank Lock / Must Pace / Stride Mute / Grounded Lock; Diag Lock ↔ Rank Lock / Axis Veil / Bias Ray / Bias Step; Brick Shift ↔ Barrier / Hinge Tile / Open Pit / Nail Down; Mend Wick ↔ Pit Wick / Fuse Tile / Wick Bite / Echo Paint / Mercy Font; Return Sting ↔ Mirror / Pain Link / Flank Share / Rebound Ward / Cover Step; Leftover Lend ↔ Purse Cut / Split Purse / Purse Lock / Tempo Gift / Loan Tempo / Cadence Lend; Dummy Post ↔ Bait Pylon / Bait Eat / Goad / Span Pylon / Bastion Pylon; Enter Mend ↔ Gift Sill / Exit Boon / Glyph Tax / Camp Tax / Cinder Tile; Body Mark ↔ Mark / Split Mark / Twice Mark / Cast Mark / File Brand; Split Mend ↔ Flank Share / Pet Share / Split Purse / Split Fang / Choir Hymn; Court Hinge ↔ Court Fold / Court Shove / File Fold / Board Tilt / Sovereign Fold.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved, live, or still held) |
| :--- | :--- | :--- |
| SUPPORT gait heal | Heal iff the caster spent ≥ 1 walk MP this turn | Post Sting is unmoved **damage**. Boot Sting is walked **damage**. Blood Mend is unconditional. |
| POSITION pair hinge | Two hostiles rotate 90° around **their** midpoint | Pivot Foe is one body around the caster. Hinge Step is the caster around an ally. Pawn Trade **swaps**. |
| SUPPORT ally CD flush | All of **their** remaining CDs → 0, once/battle | Cadence Crack is hostile highest-one. Cadence Break is self last-id. Cadence Lend is −1. |
| DAMAGE isolated | Bonus iff the target has 0 Chebyshev-1 same-side hostiles | Split Fang / Crowd Tax pay **clusters**. |
| DEFENSE delayed plate | Absorb starts on **your next turn**, not now | Ward Plate / Surplus Ward / Thin Ward / Turn Cap are immediate. Morrow Step is a blink. |
| CONTROL gait seal | Cannot spend walk MP; spells still legal | Root = 0 walk. Must Pace **requires** walk to cast. Rank Lock is axis. |
| CONTROL diag walk | Next walks must be diagonal | Rank Lock is rank XOR file. Axis Veil forbids primary on an axis. |
| TERRAIN brick shift | Move an **existing** barrier 1 Chebyshev | Barrier **places**. Hinge Tile is a pad swap. |
| TERRAIN delayed heal | Floor paint heals the occupant after 1 turn | Fuse is delayed **damage**. Pit Wick is delayed **pit**. Mercy Font pulses from a summon. |
| DEFENSE return poke | Next applied hit → 0 on you, `floor(n/2)` to the attacker | Mirror reflects the **spell**. Pain Link / Flank Share **share**. Rebound Ward is memory Wave-5. |
| SUPPORT leftover dump | Move **your** leftover AP to an ally; your AP → 0 | Purse Cut freezes **theirs**. Tempo Gift **grants**. Does not splice the queue. |
| SUMMONS dummy post | 1-HP empty-kit taunt aura Chebyshev 1 | Bait Pylon / Goad / Bastion. `summonAI: "dummypost"`. |
| TERRAIN enter heal | First enter heals 6 once | Gift Sill is enter **+MP**. Glyph Tax is enter AP. |
| DAMAGE unit mark | Next hit on **that unit** ×1.5, 1 charge | Mark / Split Mark are **tiles**. Cast Mark detonates on **their** cast. |
| SUPPORT split heal | 12 HP split 50/50 with one adjacent ally | Flank Share is **damage**. Choir Hymn is a different W1 card. |
| POSITION mass pair-hinge | Signature: every Chebyshev-1 hostile pair | Court Fold / File Fold / Court Shove. Player never owns this. |
| RESOURCE fourth MP snipe | — | **Held forever** with Ley Toll / Undertow / Sanguine Toll |
| Sixth echo | — | Held for Discovery (Choir Verse already exists) |
| Full-bar silence | — | Hex of Silence stays `BOSS_ONLY` |
| Mid-RAF splice | — | Held (AGENTS.md) |

**Still open after this wave (do not fill today):** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; a sixth echo id; player-owned Hex of Silence; heal-if-**target**-moved; 180° pair hinge; **refresh** (extend) all of a hostile’s remaining CDs rather than zero them; four-cell occupy. Those stay Wave 9 / Discovery so this pass stays discrete.

---

## 3. Contract with Dynamic Spell Discovery

Coordinate with Discovery (`c26e5a83-…`) and Admin (`4efa22ec-…`). This pass only stamps acquisition so those layers can filter **by field**. Discovery Wave 8 may ship the same day — **do not mint SDE ids here**. Stamp family / observe metadata onto Wave-8 **tactical** ids only. If a same-day SDE file claims one of these ids, SDE wins; rename is not this pass’s job (same rule Wave 7 used vs #533).

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

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 8 ids to `starterSpells` as base. Do **not** land Wave-8 data before Wave-1 ownership split (`SDE-2026-08-31-001`), Wave-2 G resolve, Wave-3 data, Wave-4 (#342 / #371) data, Wave-5 (#411) data, Wave-6 (#463 / #480) data, or Wave-7 (#525 / #533) data.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "dummypost"` is a **string enum on the config**.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Pair Hinge / Brick Shift / Leftover Lend **cast** (AP spent) **is** observation, including a blocked landing / no-leftover fizzle after AP.
- Gait Mend / Morrow Plate / Gait Seal / Diag Lock / Return Sting / Body Mark / Cadence Flush **arming** (AP spent) **is** observation. Later consume / convert is **not** a second observe.
- Mend Wick / Enter Mend **paint** is observation. Later enter / convert ticks are not a second observe.
- Dummy Post **summon** is observation. Later taunt consumes / deaths are not a second observe.
- Court Hinge **arm** is observation for witness-only kits. Never written to owned ids.
- Do not require “see it N times” except where a boss adaptation already does. Wave 8 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.

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

**Every live feat and every live challenge id is already a sole spell door.** Wave 8 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 8 does **not** invent a 16th feat. Discovery Wave 7 already claimed leftover `hard_1` / `legendary_1` MULTI children (Thin Ward / Clean Blood) — do not restamp those either.

**Live 19 first-wins are all taken (do not restamp as the only door):**  
`starborn_queen` (Cut In), `pale_archivist` (After Verse), `starved_vampire_pawn` (Sanguine Toll), `lord_of_static` (Draw Together), `final_pawn` (Eclipse Fold), `mirror_sovereign` (Echo Cast), `crimson_countess` (Crimson Pact), `void_grandmaster` (Twin Gate), `midnight_bishop` (Life Tether), `chessboard_lich` (Claim Ward), `twin_monarchs` (Choir Hymn), `alabaster_fortress` (Pain Link / Aftershock), `bone_cavalier` (Vault / Caltrop), `pale_archbishop` (Reliquary / Glyph Snare extras), `fetid_rook` (Rot Brand), `broodmother_rook` (Brood Ward), `weeping_pawn` (Mute Thread, #411), `eternal_pawn_king` (Queue Cut, #411), `enthroned_void` (File Vault MULTI child, #411). `second_lament` remains kit-only False Cut.

**Wave-5 boss extra doors (#367) — do not restamp:** `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`.

**Wave-6 boss extra doors (#406) — do not restamp:** `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`.

**Wave-6 tactical extra doors (#463) — do not restamp:** `oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`.

**Wave-7 boss extra doors (#474) — do not restamp:** `mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`.

**Wave-8 boss extra doors (#518) — do not restamp:** `gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`.

**Wave-7 tactical extra doors (#525) — do not restamp:** `pace_prelate`, `span_triune`, `wick_mason`, `slip_castellan`, `court_usher`.

**New proposed extra doors for the boss designer (Wave 10 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `gait_cantor` first-win | Gait Mend |
| `pair_usher` first-win | Pair Hinge MULTI child (observe+win still grants) |
| `flush_precentor` first-win | Cadence Flush MULTI child |
| `dummy_castellan` first-win | Dummy Post MULTI child |
| `court_hinge_regent` kit only | Court Hinge (`NOT_PLAYER_LEARNABLE`) |

Piece-type observe paths (not feat doors): wisps / cantors for Gait Mend; queens / porters for Pair Hinge; scribes / tempo for Cadence Flush; snipers / lurkers for Lone Sting; wardens / golems for Morrow Plate; hex / pawns for Gait Seal; bishops / knights for Diag Lock; masons / rooks for Brick Shift; fonts / wisps for Mend Wick; lurkers / mirrors for Return Sting; hex / buffers for Leftover Lend; castellans ELITE for Dummy Post; masons / fonts for Enter Mend; scribes / bishops for Body Mark; wisps ELITE for Split Mend.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 / #463 / #480 / #525 / #533 key names for a different meaning.

`mpCost` stays 0 on every Wave-8 row.

**New keys (Wave 8 only):**

```text
requireCasterWalkedHeal, gaitMendAmount,            // Gait Mend — 8 if walk MP ≥ 1
pairHingeClockwise, pairHingeNeedAdj,               // Pair Hinge — 90° around pair midpoint
flushAllyAllCooldowns,                              // Cadence Flush
requireTargetIsolated, loneStingBonus,              // Lone Sting — 0 Chebyshev-1 same-side
morrowPlateAbsorb, morrowPlateDelayTurns,           // Morrow Plate — 10, delay 1
forbidWalkMpSpend, gaitSealDuration,                // Gait Seal
walkDiagonalOnlyTurns,                              // Diag Lock
brickShiftDistance,                                 // Brick Shift — 1
mendWickDelayTurns, mendWickHeal,                   // Mend Wick — 1, 8
returnNextHitRatio,                                 // Return Sting — 0.5 of applied
leftoverLendCap, leftoverLendZeroCaster,            // Leftover Lend — cap 4, caster AP → 0
dummyPostTauntRadius, dummyPostHp,                  // Dummy Post — 1, 1
enterMendHeal, enterMendDuration,                   // Enter Mend — 6, 2
bodyMarkMul, bodyMarkCharges,                       // Body Mark — 1.5, 1
splitMendTotal, splitMendNeedAdjacentAlly,          // Split Mend — 12, 0.5
courtHingeNeedAdj, courtHingeExcludeCaster          // Court Hinge
```

If a key is missing, the rider does not fire.

Nested kit-only id (not a player card): none. Dummy Post’s kit is **empty**. Do not invent `spell-dummy-eat` (Bait Eat already owns that fantasy).

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Walk-gated heals are paid in **tiles already spent**, not in extra AP.

---

## 5. Proposed spells (Wave 8)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-gait-mend`

NAME: Gait Mend  
ROLE: SUPPORT — heal if the caster already walked  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 1  
EFFECT: `spellType: "heal"`, `healAmount: 8`, `effectParams: {"requireCasterWalkedHeal":true,"gaitMendAmount":8}`. If the caster spent ≥ 1 **walk** MP this turn (`walkMpSpentThisTurn`), heal 8 through the existing `heal` helper (honor `healRecv`, no new math). If they have not walked, the heal is 0 — AP is still spent (observation fires). Distinct from Blood Mend (12 + CHC, no walk gate), Rallying Cry, Boot Sting (walked **damage**), Post Sting (unmoved **damage**), Clean Blood (untouched LoS), Mercy Hex (invert their nuke). The decision is **spend the 2-step first, then take the 8**, or keep the tiles and skip the heal.  
DURATION: instant  
SCALING: 8 follows healRecv only. Gate is boolean.  
SYNERGIES: Slide / Back Step / Shove Face do **not** count (those are forced-move, not walk MP). Spare Pace / Exit Boon / Gift Sill can fund the walk. `no_healing` / `hard_1`: a **successful** heal (HP actually increased) fails those challenges; a 0-heal fizzle does not.  
COUNTERPLAY: Root / Gait Seal / Rank Lock so they cannot pay the walk; Cursed Wound halves the 8.  
POWER_BUDGET: Cheap. 8 is below Mend’s 12 because the walk is the rest of the cost.  
AI_USAGE: `aiHint: "heal_if_already_walked"`. Wisps / cantors. Skip if `walkMpSpentThisTurn < 1` **or** missing HP < 8. Never walk **only** to enable this if a Strike would kill.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop"], levelZoneMin: 1 }` plus family observe (wisps / cantors).  
EDGE_CASES: Forced-move flags must not set `walkMpSpentThisTurn`. Summon-control walks spend the **player** walk pool today — if that is still true at implement time, a player-side summon walk **does** arm Gait Mend on the player (document; do not silently use summon MP). Challenge: `challengeHealUsedRef` flips only when HP increased. Do not name-check `"Gait"`.  
IMPLEMENTATION_COMPLEXITY: LOW — one boolean on the existing heal path.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-gait-mend
effectType: heal
effectCategory: heal
spellType: heal
targetType: self
areaShape: single
apCost: 2
mpCost: 0
healAmount: 8
range: 0
cooldown: 1
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
effectParams: {"requireCasterWalkedHeal":true,"gaitMendAmount":8}
```

---

### SPELL_ID: `spell-pair-hinge`

NAME: Pair Hinge  
ROLE: POSITION — rotate two hostiles 90° around their midpoint  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: **Not** `isSwap`. `effectParams: {"pairHingeClockwise":true,"pairHingeNeedAdj":true}`. Target one living hostile. Find the nearest **other** living hostile at Chebyshev **exactly 1** (4-adj first, then diagonals, then lowest id). Rotate both bodies 90° clockwise around the **integer midpoint** of their two cells. Both destination cells must be `isCellFree` **after** vacating the pair (they may exchange or land on each other’s vacated cells). Caster does not move. If no second body, or either dest is blocked, fizzle (AP spent). Distinct from Pivot Foe (one body around the **caster**), Hinge Step (caster around an ally), Pawn Trade (swap two hostiles, no rotate), Draw Together (attract), Ally Reel (pull toward ally).  
DURATION: instant  
SCALING: none.  
SYNERGIES: Fuse / Cinder / Open Pit / Pit Wick / Slide / Enter Mend on one dest — the pair lands on the paint; File Lance after they share a file; Rank Lock / Diag Lock the landing axis.  
COUNTERPLAY: Isolate (one body); Self Anchor on a body that must not move; stay Chebyshev ≥ 2 from every ally.  
POWER_BUDGET: Standard utility, 0 damage, CD 2. Power is the board.  
AI_USAGE: `aiHint: "hinge_two_hostiles_if_adj"`. Queens / porters. Skip if pack size < 2 or both dests blocked. Enemy caster: the two hostiles are **player-side**.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","king"]`, `levelZoneMin: 1`  
EDGE_CASES: Midpoint of (x,y) and (x+1,y) is not a grid cell — dests are the 90° map of the **vector** around the pair’s center, snapped to integer cells (the two cells of a 4-adj pair rotate onto the other two cells of their 2×2). A diagonal pair rotates onto the opposite diagonal of that 2×2. Three-body ties: nearest Chebyshev 1, then lowest id. Hazard on landing: **must tick** (MIMA-2026-08-31-001 — Swap today copies coords only at WX 9389–9401; this card is not license to leave that broken, but do not rewrite global Swap in the same PR as the data). Challenge: the hinge is not a spell-hit; environmental dest damage uses existing helpers.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy pair rotate; new flag, not `isSwap`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-flush`

NAME: Cadence Flush  
ROLE: SUPPORT — ally, all remaining CDs → 0, once/battle  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 4  
RANGE: 3  
TARGET_TYPE: ally  
LOS: true  
COOLDOWN: 99 (once/battle; same pattern as Timestep’s once-lock, keyed on caster id)  
EFFECT: `effectParams: {"flushAllyAllCooldowns":true}`. Target one living **allied** combatant (including a player-side summon; not the caster). Set **every** remaining entry in that unit’s cooldown map to 0. Once/battle on the **caster**. If the target has no id with remaining CD > 0, fizzle (AP spent). Distinct from Cadence Crack (hostile, **highest one** → 0), Cadence Break (self last-id), Cadence Lend (ally −1), Cadence Theft (steal 1), Pet Verse (summon kit CD), Timestep (self AP/MP refill). This is a **dump-the-bar** gift: they can recast Inferno **and** everything else this turn.  
DURATION: instant; once/battle  
SCALING: none.  
SYNERGIES: Inferno / Fan Bolt / File Lance after flush; `hard_3` (≤8 AP/turn) — the **receiver’s** recasts count toward `maxApUsedInTurn` if they spend them. Leftover Lend the same ally so they can actually pay the bar.  
COUNTERPLAY: Quiet Hex / Hex Toll / Mute Thread the flushed ally; kill them before they dump; isolate so the 4 AP was wasted.  
POWER_BUDGET: Heavy AP, 0 damage, once/battle. The decision is **now vs never**.  
AI_USAGE: `aiHint: "flush_ally_if_big_cd"`. Scribes / tempo. Skip if no ally has remaining CD ≥ 2. Never flush the caster (illegal target).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 2`  
EDGE_CASES: Do not write `spellLevelKeys`. Do not call `upgradeSpell`. Once/battle is a caster flag, not a spell cooldown of 99 that `nextSpellCooldownTurns` would show as a 99-turn lock in the bar — implement as `oncePerBattleIds` on the caster, same family as Timestep. Player targeting `ally` must include player-side summons and exclude hostiles. Flushing the player from an allied summon is legal if that summon is the caster.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — cooldown map zero + once/battle flag.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-lone-sting`

NAME: Lone Sting  
ROLE: DAMAGE conditional — isolated target  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. `effectParams: {"requireTargetIsolated":true,"loneStingBonus":8}`. If the target has **zero** living same-side combatants at Chebyshev ≤ 1 (the target cell itself is not a neighbor), add 8 **before** existing SP/RES/SR/crit/Mark — pass the already-summed base into `dealDamage`. Distinct from Split Fang / Crowd Tax (cluster pay), Wall Sting (barrier-adj), Boot Sting (caster walked), Sated Fang (caster unhurt), Far Sting (distance). The decision is **peel them off the pack, then sting**, or take the 10 into a clump.  
DURATION: instant  
SCALING: 10+8 follow dmg%. Isolation is boolean.  
SYNERGIES: Pawn Trade / Pair Hinge / Shoulder Bash / File Reel to isolate; Smoke so they will not step adjacent; Null Brand / Kennel Lock so summons cannot cluster.  
COUNTERPLAY: Stand Chebyshev-1 from any ally; spawn a dummy / whelp adjacent; Self Anchor and hug a post.  
POWER_BUDGET: Standard. 10 = Strike at range 3; 18 requires the peel.  
AI_USAGE: `aiHint: "poke_if_target_isolated"`. Snipers / lurkers. Skip if the target is clustered **and** Frost is in kit.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Same-side means the target’s side (enemy-side includes enemy summons; player-side includes player summons). Adjacent **hostiles** (the other side) do **not** break isolation. The caster standing Chebyshev-1 does not count as a same-side neighbor of an enemy target.  
IMPLEMENTATION_COMPLEXITY: LOW  
STATUS: PROPOSED

---

### SPELL_ID: `spell-morrow-plate`

NAME: Morrow Plate  
ROLE: DEFENSE — delayed absorb, starts next own turn  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"morrowPlateAbsorb":10,"morrowPlateDelayTurns":1}`. Arm now. At the **start** of the caster’s next turn, gain absorb 10 that consumes against incoming applied hits (same absorb family as Ward Plate / Bloodless Plate — do not invent a second HP bar). Lasts until 10 is consumed or that turn ends, whichever first. Distinct from Ward Plate (absorb now), Surplus Ward, Thin Ward (incoming cap), Turn Cap (outgoing cap), Bloodless Plate (`easy_1` identity), Morrow Step (blink). The decision is **pay 2 AP now for a plate you will not have this turn**.  
DURATION: arm instant; absorb 1 turn after delay  
SCALING: 10 fixed.  
SYNERGIES: Goad / Dummy Post so the hit lands on the plated turn; Tick Hood the DoT so the plate is not eaten by a tick; Sidestep the unplated turn.  
COUNTERPLAY: Hit them **this** turn (no plate yet); Cadence Flush is unrelated; Quiet Hex the arm.  
POWER_BUDGET: Cheap. Delayed 10 is weaker than an immediate 10 because they can die on the arming turn.  
AI_USAGE: `aiHint: "arm_plate_if_not_threatened_this_turn"`. Wardens / golems. Skip if already the last living body in melee.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"]`, `levelZoneMin: 1`  
EDGE_CASES: If the caster dies before the delay, the arm expires. Delay is **their** next turn start, not a global round count. Do not read `CharacterStats.evasion`. Absorb is not a heal (`no_healing` stays true).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — delayed apply at turn start. Do not splice RAF.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gait-seal`

NAME: Gait Seal  
ROLE: CONTROL — cannot walk; can still cast  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: `effectParams: {"forbidWalkMpSpend":true,"gaitSealDuration":1}`. Target cannot spend walk MP until the start of their next turn. Spell casts remain legal. Distinct from Root Snare (typical root also blocks reposition tools in that card’s text), Rank Lock (walk allowed on an axis), Must Pace (next **spell** fizzles unless they walked), Stride Mute (spell fizzles **if** they walked), Grounded Lock (no swap/blink). The decision is **nail their feet, then out-range them**.  
DURATION: until their next turn start  
SCALING: none.  
SYNERGIES: Far Sting / Glass Shot / File Lance after they cannot close; Open Pit / Brick Shift to wall the only melee tile; Dummy Post so the melee they wanted is the post.  
COUNTERPLAY: Cast from where they stand; Back Step / Phase Slip / Swap (those are **not** walk MP — Gait Seal does **not** block them unless a later Grounded Lock is also up); wait.  
POWER_BUDGET: Standard control, 0 damage, CD 2.  
AI_USAGE: `aiHint: "seal_walk_if_target_needs_close"`. Hex / pawns. Skip if the target is already adjacent **and** has a melee id.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","pawn"]`, `levelZoneMin: 1`  
EDGE_CASES: Forced-move (push/pull/swap/hinge) still legal — this is a **walk-MP** gate, not occupancy. Summon-control walks: if they spend the player walk pool, Gait Seal on the player blocks that path. Do not block Attack Nearest (that is a cast).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — walk confirm must read the flag. Do not rewrite A*.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-diag-lock`

NAME: Diag Lock  
ROLE: CONTROL — next walks must be diagonal  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: `effectParams: {"walkDiagonalOnlyTurns":2}`. For 2 of the target’s turns, a walk dest is legal only if `|dx|===|dy|` and `dx≠0` from their **current** cell (each step of a path must be diagonal). Distinct from Rank Lock (rank XOR file — cardinal **or** that file), Axis Veil (forbids primary on a shared axis), Bias Ray / Bias Step (diagonal **cast** geometry), Even Stride (even Manhattan). Forced movement still legal.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Barrier / Brick Shift / Open Pit on the diagonal spokes; Fan Bolt along a diagonal; File Lance is **weaker** here (they cannot stay on a file by walking).  
COUNTERPLAY: Walk the diagonals; blink / swap off the lock; wait 2 turns.  
POWER_BUDGET: Standard elite control.  
AI_USAGE: `aiHint: "diag_lock_if_file_walker"`. Bishops / knights. Skip if the target is already only able to step diagonal (walled).  
DISCOVERY_ELIGIBILITY: true. Elite/champion tag. `pieceTypes: ["bishop"]`, `levelZoneMin: 2`  
EDGE_CASES: Preview, live gate, and execute of **walks** (not casts) share the filter. Knight Slip / Vault are teleports, not walks. Slide Tile conveyor is forced-move, not a walk.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — walk dest filter, same family as Rank Lock.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-shift`

NAME: Brick Shift  
ROLE: TERRAIN — move an existing barrier 1  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: false  
COOLDOWN: 1  
EFFECT: `freeCells: false` on the **clicked dest** (the dest must be free). `effectParams: {"brickShiftDistance":1}`. Click a cell that currently holds a **spell-placed** barrier (`barrierTiles`). The engine then requires a second dest at Chebyshev exactly 1 that is `isCellFree` (no occupant, not wall, not void, not portal, not another barrier). Move the barrier key. Duration remaining on that brick is unchanged. Distinct from Barrier (places a **new** brick), Hinge Tile (pad swap), Open Pit / Nail Down, Twin Gate pads. The decision is **reuse the wall you already paid for**.  
DURATION: remaining barrier duration unchanged  
SCALING: none.  
SYNERGIES: Blind Corner / Wall Sting / Wall Bite after you hug the new face; Low Lintel; Pair Hinge landing into the new wall; Fan Bolt the opened spoke.  
COUNTERPLAY: Do not leave a brick for them to slide; occupy every Chebyshev-1 dest; Gift Sill / Enter Mend are unrelated.  
POWER_BUDGET: Cheap tool. 0 damage.  
AI_USAGE: `aiHint: "shift_barrier_if_opens_or_blocks"`. Masons / rooks. Skip if no barrier in range.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"]`, `levelZoneMin: 1`  
EDGE_CASES: World walls are **not** `barrierTiles` — illegal source. Two-click UX: first click paints legal bricks, second click paints Chebyshev-1 dests. If the implementation cannot afford a two-click without growing WX, dest = the clicked free cell and the source is the unique barrier Chebyshev-1 from that dest (fizzle if 0 or >1). Last-writer on the dest cell: a pit / pad / slide already there **blocks** the move (do not silently overwrite).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy + barrier map move.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-mend-wick`

NAME: Mend Wick  
ROLE: TERRAIN — delayed tile heal  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint the tile. After 1 turn, if a living combatant occupies it, heal 8 through existing `heal` (honor `healRecv`). Then the paint expires. Empty at convert: expire, no heal. Distinct from Fuse Tile (delayed **damage**, still walkable), Pit Wick (delayed **pit**), Wick Bite (hazard-adj damage), Echo Paint (copy last paint), Mercy Font (summon pulse), Enter Mend (heal **on enter**, this pass). The decision is **stand on your wick or bait them onto it**.  
DURATION: 1 turn delay  
SCALING: 8 follows healRecv.  
SYNERGIES: Pair Hinge / Shoulder Bash onto the wick; Gait Seal so they cannot leave; Cursed Wound halves enemy-side heals. `no_healing` / `hard_1`: a convert that increases **player** HP fails those; healing an enemy does not set `healUsed`.  
COUNTERPLAY: Step off; occupy with a dummy you do not care about; Dispel the paint if a later cleanse-tile verb exists (today: walk off).  
POWER_BUDGET: Standard. Delayed 8 is a positioning puzzle, not a Mend clone.  
AI_USAGE: `aiHint: "paint_heal_tile_if_ally_can_stand"`. Fonts / wisps. Skip if no allied body can reach in 1 turn. Healer-inference: this id **does** carry `healAmount` — do not put it on a non-healer CORE.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Convert is a **turn-start** tile tick, not a mid-RAF splice. Observation is **paint**, not convert. Last-writer vs Pit Wick / Fuse / Cinder on the same cell: last paint wins; do not stack convert kinds.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — same delayed-tile family as Fuse / Pit Wick.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-return-sting`

NAME: Return Sting  
ROLE: DEFENSE reactive — next hit deals 0 to you, half to the attacker  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"returnNextHitRatio":0.5}`. Arm 1 charge. The next **applied** damaging hit against the caster (after existing RES/SR/crit/Mark, before HP write) deals **0** to the caster and deals `floor(applied * 0.5)` to the **attacker** through existing `dealDamage` (`isPhysical: false`). Charge consumes even if the attacker is already dead after other riders (then the poke fizzles). Distinct from Mirror (reflects the **spell** back as that spell), Pain Link / Flank Share (share the hit), Rebound Ward (memory Wave-5), Cover Step (redirect whole hit), Sidestep (miss). The decision is **eat the swing you can return**.  
DURATION: until 1 hit or battle end  
SCALING: ratio fixed.  
SYNERGIES: Goad / Dummy Post / Taunt Oath so the swing they must throw is the one you return; `legendary_1` / Untouchable — a 0 applied hit is not damage taken.  
COUNTERPLAY: Do not hit them; DoT ticks (Tick Hood is the DoT skip — Return Sting does **not** arm on a DoT tick unless the implementer documents ticks as hits; **this card picks spell/weapon hits only**, not lava/spikes/DoT); Wait the CD.  
POWER_BUDGET: Standard. Returning half of a 20 is 10 — Strike, paid with 3 AP + a hit you chose to take as 0.  
AI_USAGE: `aiHint: "arm_return_if_expect_hit"`. Lurkers / mirrors. Skip if already plated / sidestepped.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["knight"]`, `levelZoneMin: 1`  
EDGE_CASES: Consume **before** HP write. Do not edit `combatMath.ts` beyond passing the already-computed applied value into a consume helper. Challenge: 0 applied is not `recordChallengeDamageTaken`; the poke to the attacker **is** a spell-hit if it deals > 0. Self-hits / lava do not consume.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — consume gate on the incoming-hit pipeline, same family as Sidestep.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-leftover-lend`

NAME: Leftover Lend  
ROLE: SUPPORT — dump your leftover AP onto an ally  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 1  
RANGE: 3  
TARGET_TYPE: ally  
LOS: true  
COOLDOWN: 2  
EFFECT: `effectParams: {"leftoverLendCap":4,"leftoverLendZeroCaster":true}`. After paying this card’s 1 AP, let `n = min(remaining AP, 4)`. Add `n` to the target’s **current** AP this turn (cap at their max AP). Set the caster’s current AP to 0. **Do not** splice the turn queue — the caster may still walk if they have MP. Distinct from Tempo Gift / Loan Tempo (grant without dumping yours), Purse Cut (freeze **their** leftover), Split Purse (split **theirs**), Purse Lock (freeze leftover), Cadence Lend (CD −1). The decision is **keep a last Strike or fund their Inferno**.  
DURATION: this turn  
SCALING: cap 4.  
SYNERGIES: Cadence Flush the same ally; `hard_3` — the **receiver’s** spend counts; the caster’s 1 AP spend counts on the caster. Gait Mend after you dump AP but still have walk MP.  
COUNTERPLAY: Mute Thread the funded ally; kill them; isolate so they cannot use the AP.  
POWER_BUDGET: Cheap AP. The power is **their** leftover bar, not a number on this card.  
AI_USAGE: `aiHint: "lend_leftover_if_ally_can_spend"`. Hex / buffers. Skip if leftover after the 1-cost is 0 **or** the ally is at max AP.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: `n=0` still spends the 1 AP and observes (fizzle-like). Do not end the turn. Do not grant AP above the target’s max. Player `ally` includes player-side summons.  
IMPLEMENTATION_COMPLEXITY: LOW  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dummy-post`

NAME: Dummy Post  
ROLE: SUMMONS — 1-HP stationary taunt post  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ground  
LOS: false  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "dummypost"`, `summonLifespan: 3`, `summonUnitDef: { pieceType: "pawn", level: 1, hpScale: 0.1, damageScale: 0.0, ap: 0, mp: 0, summonKit: [] }`. Stationary (0 AP / 0 MP). 1 HP. Empty kit. `effectParams: {"dummyPostTauntRadius":1,"dummyPostHp":1}`. While the post lives, any hostile whose Chebyshev distance to the post is ≤ 1 and who casts a damaging id (`damage > 0` or `isDotSpell`) must choose the post as the primary target **if** the post is inside that spell’s current range/LoS; otherwise they may cast as normal. Distinct from Bait Pylon / Bait Eat (W4 bait + eat), Goad / Taunt Oath (unit-targeted, no body), Bastion Pylon (empty wall, no taunt), Span Pylon (two-cell occupy). Counts as **one** toward the summon cap.  
DURATION: lifespan 3  
SCALING: 1 HP fixed.  
SYNERGIES: Return Sting / Morrow Plate on the caster while the pack hits the post; Pair Hinge a body onto the post’s radius; Open Pit under the post’s neighbors. `no_healing` is unaffected (the post does not heal). Pacifist: the post dealing 0 damage does not fail the feat; a later enemy hitting the post is not a player-side summon kill.  
COUNTERPLAY: Kill the 1 HP; step Chebyshev ≥ 2; cast a non-damaging id (Slow / Swap); out-range the post.  
POWER_BUDGET: Heavy CD 3. The post is a body, not a number.  
AI_USAGE: `aiHint: "plant_dummy_if_melee_pack"`. Castellans ELITE. Skip if a Dummy Post already lives.  
DISCOVERY_ELIGIBILITY: true. Elite/champion tag.  
EDGE_CASES: `summonAI: "dummypost"` is the enum. Never parse `"Dummy"`. 0 AP means it never walks — occupancy still blocks the cell. Taunt is a **cast target filter**, not Goad’s `tauntNextHit` on a unit. Attack Nearest origin stays the **player** tile (`attackNearestLiveCasterPos`).  
IMPLEMENTATION_COMPLEXITY: MEDIUM–HIGH — summon spawn + target filter. Extract helpers; do not grow WX.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-enter-mend`

NAME: Enter Mend  
ROLE: TERRAIN — first enter heals 6 once  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint 2 turns. The first living combatant who **walks or is forced** onto the cell heals 6 through existing `heal`, then the paint expires. Distinct from Gift Sill (enter **+MP**), Exit Boon (leave +MP), Glyph Tax / Camp Tax (enter AP), Cinder Tile (enter damage), Mend Wick (delay, no enter trigger). The decision is **a heal pad they might steal**.  
DURATION: 2 turns or first enter  
SCALING: 6 follows healRecv.  
SYNERGIES: Pair Hinge / Shove Face onto your pad; Gait Seal so they cannot steal it; Cursed Wound on a thief. `no_healing`: player HP up fails the challenge.  
COUNTERPLAY: Step on it as the enemy (steal the 6); Brick Shift a wall onto the cell (last-writer: barrier blocks enter — paint remains until walked).  
POWER_BUDGET: Cheap. 6 is half of Mend because the pad is public.  
AI_USAGE: `aiHint: "paint_enter_heal_on_ally_path"`. Masons / fonts. Skip if the enemy is closer to the dest than the ally.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Observation is **paint**. Swap onto the cell must tick (MIMA-001). Forced-move counts as enter. Occupant already standing when painted does **not** trigger (enter, not occupy).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — enter hook shared with Glyph Tax / Gift Sill.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-body-mark`

NAME: Body Mark  
ROLE: DAMAGE conditional — next hit on **that unit** ×1.5  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: No damage. `effectParams: {"bodyMarkMul":1.5,"bodyMarkCharges":1}`. The next damaging hit **against that combatant** (any source, any id) applies ×1.5 to that hit’s **base** before SP/RES/SR/crit/tile-Mark. Charge consumes even if the hit fizzles. Distinct from Mark / Split Mark (tiles), Twice Mark, Cast Mark (detonates when **they** cast), File Brand (shared-axis rider), Enrage (duration DMG buff on the **caster**). The decision is **amp the unit, not the floor** — they can walk off a tile Mark; they cannot walk off a body mark.  
DURATION: until 1 damaging hit or battle end  
SCALING: multiplier fixed.  
SYNERGIES: Tile Mark **stacks in order**: body ×1.5 then tile ×2 if both are specified as sequential base muls — **this card applies first**, then existing tile Mark. Lone Sting after they peel. Coup de Grâce.  
COUNTERPLAY: Cleanse / Absolve / Dispel Thread; bait the charge with a 1-damage poke; Sidestep the amped hit.  
POWER_BUDGET: Cheap. 1.5× Frost 20 = 30, paid with 2+3 AP if you follow up. Without a follow-up it is a dead arm.  
AI_USAGE: `aiHint: "mark_unit_if_nuke_ready"`. Scribes / bishops. Skip if no damaging id is off cooldown.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Do not write a tile key. Last writer on the **unit** wins if a second Body Mark lands. DoT apply is a damaging hit (consumes); Tick Hood then zeroes the tick.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — unit flag, consume on incoming hit.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-split-mend`

NAME: Split Mend  
ROLE: SUPPORT — heal 12 split 50/50 with an adjacent ally  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: true  
COOLDOWN: 2  
EFFECT: `spellType: "heal"`, `healAmount: 12`, `effectParams: {"splitMendTotal":12,"splitMendNeedAdjacentAlly":true}`. Heal the target 6 and the nearest living **other** ally at Chebyshev ≤ 1 for 6 (same 4-adj then diagonal then lowest id rule as Pair Hinge). If no adjacent ally, the target receives the full 12. Distinct from Flank Share (damage 50/50), Pet Share (summon-only soak), Choir Hymn (W1), Blood Mend (self 12 + CHC). The decision is **stand together to split, or accept a single 12**.  
DURATION: instant  
SCALING: 12 follows healRecv per recipient independently.  
SYNERGIES: Dummy Post is **not** an ally heal target (empty kit pawn still **is** a living ally if player-side — it **can** eat 6, which is usually a mistake; AI skips if the only adjacent ally is `summonAI: "dummypost"`). Load Bearing / Chain Ward. `no_healing`: any player-side HP up fails.  
COUNTERPLAY: Isolate the target; Cursed Wound both; kill the adjacent ally first.  
POWER_BUDGET: Standard elite heal. Split 6+6 is worse than 12 on one body unless both are wounded.  
AI_USAGE: `aiHint: "split_heal_if_two_wounded_adj"`. Wisps ELITE. Skip if only one body is wounded **and** they are isolated (then it is just Mend).  
DISCOVERY_ELIGIBILITY: true. Elite/champion tag.  
EDGE_CASES: `targetType: "ally"` includes self if the engine already allows ally-self — **this card forbids self as the primary** (`playerSpellAllowsCasterTile` stays false for `ally` unless already true; do not special-case). Healer-inference fires (`healAmount > 0`) — CORE only on healer profiles.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-hinge`

NAME: Court Hinge  
ROLE: POSITION — mass pair-hinge (signature)  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `usableByPlayer: false`. `effectParams: {"courtHingeNeedAdj":true,"courtHingeExcludeCaster":true}`. For every Chebyshev-1 pair of living **player-side** bodies (player + summons), apply the Pair Hinge rotate once per pair (deterministic order: lowest id pair first). Skip a pair if either dest is blocked. Caster (the boss) does not move. Distinct from Court Fold (fold two bodies), File Fold (shared-file fold), Court Shove (mass push + facing), Board Tilt (mass shove 0 facing), Sovereign Fold (fold two player-side — BOSS_ONLY). Witness-only identity.  
DURATION: instant  
SCALING: none.  
SYNERGIES: Pits / slides pre-painted under likely dests.  
COUNTERPLAY: Isolate (no Chebyshev-1 pair); Self Anchor; stand on dests so the rotate fizzles per pair.  
POWER_BUDGET: Signature. 6 AP, CD 4, 0 damage.  
AI_USAGE: `aiHint: "mass_pair_hinge_if_two_adj_player_side"`. Boss AI only. Skip if < 2 player-side bodies are adjacent.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. Kit-only. Optional dim `UNKNOWN TECHNIQUE` log. Never written to owned ids.  
EDGE_CASES: Do not grant on any first-win. Observation for witness kits is the **arm**. Landing hazards must tick. Do not touch RAF.  
IMPLEMENTATION_COMPLEXITY: MEDIUM–HIGH — loops Pair Hinge; keep one helper.  
STATUS: PROPOSED

---

## 6. Combination matrix (intended, not name-wired)

Resolve only via flags / tile maps / effect keys.

| Setup (metadata) | Payoff (metadata) | Decision |
| :--- | :--- | :--- |
| `walkMpSpentThisTurn ≥ 1` | `requireCasterWalkedHeal` | Walk 2, then Gait Mend — or keep the tiles |
| `pairHingeClockwise` | dest `fuseTurns` / `pitBlocksWalk` / Enter Mend paint | Rotate the safe body onto the pad |
| `flushAllyAllCooldowns` | Inferno CD 3 / Fan Bolt CD 2 | Dump the bar this turn or never |
| `requireTargetIsolated` | Pair Hinge / Pawn Trade peel | 10 now or 18 after the peel |
| `morrowPlateDelayTurns` | Goad / Dummy Post | Eat this turn, plate the next |
| `forbidWalkMpSpend` | Far Sting / File Lance | They cannot close |
| `walkDiagonalOnlyTurns` | Brick Shift on the spokes | Diagonal or blink |
| `brickShiftDistance` | Wall Sting / Blind Corner | Reuse the brick |
| `mendWickDelayTurns` | Gait Seal on the occupant | Stand or steal |
| `returnNextHitRatio` | Goad so the swing is chosen | 0 taken, half back |
| `leftoverLendCap` | Flush the same ally | Fund the dumped bar |
| `dummyPostTauntRadius` | Return Sting on the owner | Pack hits the 1 HP |
| `enterMendHeal` | Pair Hinge onto the pad | Heal pad they might steal |
| `bodyMarkMul` | tile Mark sequential | Amp the unit, not the floor |
| `splitMendNeedAdjacentAlly` | Dummy Post adjacent (usually a mistake) | Hug a wounded ally, not the post |
| `courtHingeNeedAdj` | same paints as Pair Hinge | Witness-only scramble |

Map modifiers stay metadata-only. Frozen/Slime × **walk** MP does not inflate any Wave-8 `mpCost` (all 0). Gait Seal × Frozen is still “cannot spend walk MP” — they simply cannot pay the 2× either.

Mechanic Interaction Matrix still OPEN (do not “fix” in this spec, but do not ship new movement that repeats the gap):

- Swap × hazards (MIMA-2026-08-31-001) — Pair Hinge / Court Hinge / Brick Shift dests **must** tick dest hazards.
- Push/pull × hazards (MIMA-2026-08-31-005) — Pair Hinge uses occupancy dests; landing must tick.
- Controlled-summon walk × occupancy (MIMA-2026-08-31-002) — Gait Seal / Diag Lock must apply to summon-control walks.

---

## 7. Recommended unlock order (pacing)

Discovery designer should treat these as **bands**, not a shop list.

| Band | Spells | Why |
| :--- | :--- | :--- |
| Early (zone 0–1) | Gait Mend, Lone Sting, Body Mark, Enter Mend | Walk-vs-heal, peel, unit amp, public pad |
| Mid (zone 1–2) | Pair Hinge, Gait Seal, Brick Shift, Mend Wick, Return Sting, Leftover Lend | Pair rotate, feet-nail, reuse wall, delayed heal, return poke, dump AP |
| Late (elites / zone 2) | Cadence Flush, Diag Lock, Dummy Post, Split Mend, Morrow Plate | Bar dump, diagonal jail, taunt post, split heal, delayed plate |
| Witness only | Court Hinge | Mass pair-hinge stays identity |

**Still required for any of this to matter:** Discovery’s innate-four split, then Waves 4–7 data. This pass does not edit `spellData.ts`.

---

## 8. Implementation notes (for a later, explicit implementation PR)

1. **No new `mpCost > 0`.** Ley Toll / Undertow / Sanguine Toll remain the only paper spenders.  
2. **No new facing card.** Wave 5 still owns `currentView` after a battle-walk writer exists.  
3. **No new queue / wrap / mid-RAF card.** Do not splice the current actor. Morrow Plate’s delay is **their next turn start**, not a queue insert.  
4. **Pair Hinge / Court Hinge** are occupancy dests, not `isSwap`. Do not call `swapPositions`.  
5. **Cadence Flush** writes the **ally’s** cooldown map to 0. Once/battle on the caster. Do not write spell levels.  
6. **Gait Mend / Split Mend / Enter Mend / Mend Wick** flip `challengeHealUsedRef` only when player-side HP actually increased.  
7. **Return Sting** consumes on the incoming-hit pipeline **before** HP write. Do not add a percent miss inside `combatMath.ts`.  
8. **Gait Seal / Diag Lock** are walk-dest / walk-MP filters. Forced movement stays legal.  
9. **Brick Shift** moves `barrierTiles` keys. World walls are not sources.  
10. **Dummy Post** uses `summonAI: "dummypost"`. Empty kit. Counts as **one**. Never parse `"Dummy Post"`.  
11. **Leftover Lend** does not splice the turn. Caster AP → 0; they may still walk.  
12. Recap grant uses the reward funnel + `commitSpellDiscoveries` / `unlockOwnedSpell`, not `updateCharacter`.  
13. Do not append these ids to `starterSpells` as `isBaseSpell`. Add to `SPELL_ID_CATALOG` **only when implemented**, together with `spellData.ts` and kits.  
14. Extract helpers. Do not grow `WorldExploration.tsx` (19,213 lines).  
15. Do not touch RAF, map generation, turn order, or damage math.

---

## 9. Explicit non-goals this pass

- No production TypeScript / Motoko / Candid edits.  
- No new damage formula, crit, or RES/SR identity.  
- No fourth `mpCost > 0` walk-positioning snipe.  
- No sixth echo id (Choir Verse / Stolen Verse / After Verse / Echo Cast / False Echo already cover the axis).  
- No player-owned Hex of Silence (full bar lock).  
- No mid-RAF splice of the current actor.  
- No new facing card.  
- No restamp of any feat or `easy_*` / `hard_*` / `legendary_*` challenge door (including SDE Wave 7’s `hard_1` / `legendary_1` MULTI children).  
- No restamp of Wave-5 boss extra doors (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`).  
- No restamp of Wave-6 boss extra doors (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`).  
- No restamp of Wave-6 tactical extra doors (`oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`).  
- No restamp of Wave-7 boss extra doors (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`).  
- No restamp of Wave-8 boss extra doors (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`).  
- No restamp of Wave-7 tactical extra doors (`pace_prelate`, `span_triune`, `wick_mason`, `slip_castellan`, `court_usher`).  
- No restamp of any live 19 first-win.  
- No wiring of `CharacterStats.evasion` as a percent.  
- No clone of Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Veil, Mirror / Reflect.  
- No 12-AP Void Collapse clone.  
- No third File Lance / Blood Tithe.  
- No SDE Wave-8 ids (that catalog may land same-day; do not mint them here).  
- No heal-if-**target**-moved (held for Wave 9).  
- No 180° pair hinge.  
- No **refresh** (extend) of a hostile’s remaining CDs (Flush zeroes an **ally**).

---

## 10. Proposal index

| ID | Acquisition | Complexity | Primary hole filled |
| :--- | :--- | :--- | :--- |
| `spell-gait-mend` | ENEMY_DISCOVERY | LOW | Heal if the caster walked |
| `spell-pair-hinge` | ENEMY_DISCOVERY | MEDIUM | 90° hinge of two hostiles as a pair |
| `spell-cadence-flush` | ENEMY_DISCOVERY | LOW–MEDIUM | Ally, all remaining CDs → 0, once/battle |
| `spell-lone-sting` | ENEMY_DISCOVERY | LOW | Isolated-target damage bonus |
| `spell-morrow-plate` | ENEMY_DISCOVERY | MEDIUM | Delayed absorb, next own turn |
| `spell-gait-seal` | ENEMY_DISCOVERY | MEDIUM | Cannot walk; can still cast |
| `spell-diag-lock` | ELITE | MEDIUM | Diagonal-only walks |
| `spell-brick-shift` | ENEMY_DISCOVERY | MEDIUM | Move an existing barrier 1 |
| `spell-mend-wick` | ENEMY_DISCOVERY | MEDIUM | Delayed tile heal |
| `spell-return-sting` | ENEMY_DISCOVERY | MEDIUM | Next hit 0 to you, half to attacker |
| `spell-leftover-lend` | ENEMY_DISCOVERY | LOW | Dump leftover AP onto an ally |
| `spell-dummy-post` | ELITE | MEDIUM–HIGH | 1-HP taunt post, empty kit |
| `spell-enter-mend` | ENEMY_DISCOVERY | MEDIUM | First enter heals 6 once |
| `spell-body-mark` | ENEMY_DISCOVERY | LOW–MEDIUM | Unit-scoped next-hit ×1.5 |
| `spell-split-mend` | ELITE | LOW–MEDIUM | Heal 12 split 50/50 with adjacent ally |
| `spell-court-hinge` | NOT_PLAYER_LEARNABLE | MEDIUM–HIGH | Mass pair-hinge signature |

All STATUS: **PROPOSED**.

**Held, not filled:** mid-RAF splice; fourth `mpCost > 0` walk snipe; sixth echo id; player-owned Hex of Silence; heal-if-target-moved; 180° pair hinge; refresh-all hostile CDs; four-cell occupy.

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
| Caster-tile rule | `src/frontend/src/engine/targeting.ts` | 184–199 |
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

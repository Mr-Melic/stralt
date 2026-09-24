# Spell and Tactical Mechanics — Design Pass 2026-09-24

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Days since last tactical pass:** 1 (Wave 6 is still-open #463 @ same HEAD; Wave 5 is still-open #411; Wave 4 is still-open #342; Wave 3 on `main` is 2026-09-02)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1–3 on `main`; Wave 4 still-open [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-2940/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md) (#371); Wave 6 still-open [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-df4f/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md) (#480). **No** `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` landed (Discovery Wave 5 unique catalog is memory-reserved only).
- Tactical Wave 6 still-open [`SPELL_PROPOSALS_2026-09-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-f0eb/docs/automation/SPELL_PROPOSALS_2026-09-23.md) (#463)
- Tactical Wave 5 still-open [`SPELL_PROPOSALS_2026-09-22.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-7c26/docs/automation/SPELL_PROPOSALS_2026-09-22.md) (#411)
- Tactical Wave 4 still-open [`SPELL_PROPOSALS_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-f488/docs/automation/SPELL_PROPOSALS_2026-09-21.md) (#342)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); Wave 5 extra doors still-open #367; Wave 6 extra doors still-open #406; Wave 7 extra doors still-open #474; Wave 8 extra doors still-open #518
- Prior tactical passes on `main` — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) (Wave 1), [`SPELL_PROPOSALS_2026-09-01.md`](./SPELL_PROPOSALS_2026-09-01.md) (Wave 2), [`SPELL_PROPOSALS_2026-09-02.md`](./SPELL_PROPOSALS_2026-09-02.md) (Wave 3)

This is **Wave 7**. Waves 1–3 are on `main`. Waves 4–6, Discovery Wave 4 / Wave 6, and Boss Waves 5–7 are still paper on open PRs. This pass treats those ids as **already reserved**.

**Wave 6 explicitly deferred seven holes to this pass:** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; a fifth echo id; player-owned Hex of Silence (full bar lock); a three-cell occupy; cooldown reset of **another combatant’s** bar to 0 (Break is **self** last-id only); forced-move that **also** writes `currentView`.

**This pass fills three of those and holds the other four:**

| Deferred hole | This pass |
| :--- | :--- |
| Three-cell occupy | **Filled:** Triple Span (`spell-triple-span`) |
| Cooldown reset of **another** combatant to 0 | **Filled:** Cadence Crack (`spell-cadence-crack`) — hostile, highest remaining CD → 0, once/battle. Not a steal. Not self. |
| Forced-move that writes `currentView` | **Filled:** Shove Face (`spell-shove-face`) — `applyPushback` 1, then write facing from the step taken. Court Shove is the mass signature. |
| Fourth `mpCost > 0` walk snipe | **Held.** Combined paper stays Ley Toll / Undertow / Sanguine Toll. Discovery W4 / W6 forbade a fourth. Catalog default stays `mpCost: 0`. |
| Fifth echo id | **Held.** After Verse / Stolen Verse / Echo Cast / False Echo / Choir Verse already cover the axis. |
| Player-owned full-bar silence | **Held.** Hex of Silence stays unowned. Mute Thread / Oath Blade / Dull Edge / Once Verse already own narrower locks. |
| Mid-RAF splice of the current actor | **Held.** AGENTS.md forbids incidental turn-logic. Cut In / False Echo / Eclipse Fold consume the wrap PR. Queue Cut / Act Bell / False Cut consume the end-of-turn PR. Do not splice the current actor. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after that reserved set. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

If Discovery Wave 7 ships a unique catalog the same day, **those ids win on collision**; this file’s tombstone is the claim for Wave-7 **tactical** ids.

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is **byte-stable in identity** since 2026-08-31: still 32 frontend ids, still six backend seeds, still no discovery persist. Twenty-two days of merges (`58302bc` → `0f5363f`, through #332) plus the 2026-09-21 / 2026-09-22 / 2026-09-23 open-PR stacks did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`.

`WorldExploration.tsx` is **19,213** lines (`wc -l`). Same count as Wave 6. The defects did not shrink.

### 1.1 Frontend runtime catalog — `src/frontend/src/data/spellData.ts`

`SPELL_ID_CATALOG` (`src/frontend/src/data/bossKits.ts` 29–62) still lists **32** ids. `WorldExploration.tsx` 2395–2408 still maps **every** `starterSpells` row to `isBaseSpell: true` (“always shown, never removable”).

`ownedSpells` (2410–2424+) still unions those 32 with backend rows that pass `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718). That helper only drops `usableByPlayer === false` unless the id is already owned. It does **not** create a discovery path.

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

`Enemy.currentView` exists (`gameTypes.ts` 297). Overworld wander writes it (`WorldExploration.tsx` 6924–6938). Battle walks and the player body still do **not** write it. Combat never reads it for damage. Wave 5 Oncoming / Facing Pin / Glance Cut own that field after a battle-walk writer exists. Wave 6 About Face **inverts** stored views and does not move bodies. This pass’s Shove Face / Court Shove **write facing from the occupancy step**. They do not invent a second facing source.

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
| Spell `mpCost` debit | `executeCastAttempt` (`WorldExploration.tsx` 17096–17207) gates **AP only**. Spellbook UI can *display* MP (`SpellbookModal.tsx` 966–977). | Always 0 | Ley Toll (2); Undertow (1); Sanguine Toll (1 + HP) | **No fourth.** Every Wave-7 row is `mpCost: 0`. |
| `areaShape` cone | Typed, **unread**. Area = Chebyshev (`targeting.ts` 690–727) | Unused | Fan Bolt / Gale Fan | Unused this pass |
| `targetType: "line"` | Implemented 8-dir ray (`targeting.ts` 576–617) | **No spell** | File Lance | File Brand is a **single-target rider** if they already share rank XOR file, not a ray |
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** | Unused | Shoulder Bash, Gale Fan, Draw Together, Body Check, File Reel, Board Tilt, Shove Face’s resolver | **Shove Face** is the first paper caller that **also** writes `currentView`. Court Shove is mass + facing. |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768) | Swap | Twin Guard / Pawn Trade / Ward Interpose / Pet Swap / Hinge Tile | Unused this pass |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire | Pit Wick is delayed occupancy, not `isTrap` |
| `currentView` | Field + overworld wander writer. **Unread in combat.** | Cosmetic | Oncoming / Facing Pin / Glance Cut / Rear Cut / About Face / Face Away | **Shove Face** writes from the step. **Court Shove** writes every mover. |
| Initiative / queue | Wrap PR (Wave 4); end-of-turn PR (Wave 5) | Unused as a spell | Cut In / Queue Cut / False Cut / Act Bell / Eclipse Fold | **No new queue card.** Mid-RAF splice stays held. |
| Echo / replay | Absent in live combat | Absent | After Verse / Stolen Verse / Echo Cast / False Echo / Choir Verse | **No sixth echo id.** Once Verse is a **recast lock**, not a replay. |
| Ally reposition | Ally targeting (`targeting.ts` 527–545) | Unused for rotate | Hinge Step 90° around ally; Relay Dash walk ≤ 2; File Vault teleport 3–4 | **Knight Slip** is a (2,1) self teleport to a free cell. **Pivot Foe** rotates the **target** around the caster. |
| Silence / restrict | Absent in live | Absent | Hex of Silence = bar lock (`BOSS_ONLY`); Mute Thread = next spell fizzle; Oath Blade = Strike-only; Dull Edge = next Strike 0 | **Must Pace** = next spell fizzles unless they walked. **Once Verse** = cannot recast last resolved id. |
| Two-cell occupy | One body, one cell | Absent | Span Guard / Span Pylon / Twin Span | **Triple Span** = three 1-HP posts, connected 4-adj chain |
| Cooldown write | `executeCastAttempt` 17200–17203 + `nextSpellCooldownTurns` (`challengeCompletion.ts` 365–368) | Inferno CD 3 | Cadence Theft −1 / +1; Cadence Break = **self** last-id → 0; Cadence Lend ally −1 | **Cadence Crack** = **hostile** highest remaining → 0, once/battle |
| Hit redirect / soak | Mirror; Pain Link %; Cover Step next hit; Pet Share to a summon | No adjacent-ally 50/50 | Turn Cap = next hit ≤ 12 | **Flank Share** = 50/50 with an adjacent **ally unit** (not a summon-only path) |
| DoT consume | DoT apply + ticks | Poison / Venom / Inferno | Tick-less evade (Sidestep) is a **hit** miss | **Tick Hood** zeroes the **next DoT tick** on self, not the apply |
| Walk / unmoved gate | No live `movedThisTurn` / `walkMpSpentThisTurn` | Absent | Post Sting bonuses caster unmoved; Stride Mute walk-then-fizzle; Boot Sting is new | **Boot Sting** bonuses if the caster **did** spend walk MP. **Must Pace** inverts Mute. |
| Barrier adjacency | Barriers exist | Barrier blocks walk+LoS | Blind Corner wants LoS **blocked**; Wick Bite wants a **painted** hazard | **Wall Sting** bonuses if the **target** is Chebyshev-1 from a barrier tile |
| Shared axis rider | File Lance is a ray poke | Unused as a rider | Rank Lock constrains walk; Axis Veil forbids primary | **File Brand** +10 if they already share rank XOR file |
| Knight blink | Absent in live | Absent | Vault = once/battle (2,1) **through walls** | **Knight Slip** = CD 2, dest must be `isCellFree`, **no** wall ignore |
| Delayed pit | Fuse is delayed **damage** | Absent as occupancy delay | Open Pit is immediate; Pit Wick is new | **Pit Wick** paints floor; after 1 turn it becomes a pit |
| Exit MP | Exit Tithe is leave **+1 AP** | Absent as refund | Glyph Tax is enter AP | **Exit Boon** refunds 1 **walk MP** on leave (cap at max) |
| Mass shove + facing | Board Tilt mass shove 0 facing; About Face invert 0 move | Unused together | Court Fold folds two bodies | **Court Shove** (`NOT_PLAYER_LEARNABLE`) mass push 1 **and** writes facing |
| Summon count 3 | Twin Span counts as two | Five live AIs | `summonAI: "twinspan"` / `"spark"` / `"font"` | **`summonAI: "triplespan"`** counts as **three** |

`buildEnemyKit` is still called with `currentMap.levelZone` (`WorldExploration.tsx` 11920). Non-number → `NaN` → every kit stays zone 0. `inferArchetype` still treats `healAmount > 0` as healer (`enemyAI.ts` 447–450). Summon archetype still falls back to **name** (`enemyAI.ts` 217–224: `wolf` / `golem` / `wisp`). Forbidden for new ids: Triple Span uses `summonAI: "triplespan"`. Never parse `"Triple Span"`.

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

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` (tactical W2 **and** Discovery W2); `spell-blood-tithe` (tactical W2 pet sacrifice **versus** Discovery W2 HP→AP). Wave 7 does not add a third.

**Do not alias** Wall Sting ↔ Post Sting / Far Sting / Blind Corner / Wick Bite / Pit Sight; File Brand ↔ File Lance / File Reel / File Slide / File Vault / Axis Veil / Rank Lock; Boot Sting ↔ Post Sting / Spent Stride / Split Pace / Stride Brand / Planted Stance; Shove Face ↔ Shoulder Bash / Body Check / Back Step / About Face / Face Away / Facing Pin; Knight Slip ↔ Vault / Phase Slip / Mist Step / Knight Pierce / Morrow Step / Relay Dash; Pivot Foe ↔ Hinge Step / Pawn Trade / Twin Guard; Triple Span ↔ Twin Span / Span Guard / Span Pylon / Twin Gate / Triune Gate / Void Span / Court Fold; Cadence Crack ↔ Cadence Break / Cadence Theft / Cadence Brand / Cadence Lend / Timestep; Must Pace ↔ Stride Mute / Post Sting / Oath Blade / Mute Thread; Once Verse ↔ After Verse / Stolen Verse / Choir Verse / Echo Cast / False Echo / False Cut; Tick Hood ↔ Sidestep Ward / Fog Hood / Aim Veil / Shadow Veil / Cursed Wound; Flank Share ↔ Pet Share / Pain Link / Cover Step / Life Tether / Load Bearing; Spare Pace ↔ Haste / Second Wind / Split Pace / Waste Pace / Loan Tempo; Pit Wick ↔ Open Pit / Fuse Tile / Wick Bite / Cinder Tile; Exit Boon ↔ Exit Tithe / Glyph Tax / Second Wind / Haste; Court Shove ↔ Board Tilt / About Face / Court Fold / Crosswind.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved, live, or still held) |
| :--- | :--- | :--- |
| DAMAGE wall-hug | Bonus iff the **target** is Chebyshev-1 from a barrier | Blind Corner wants LoS blocked. Wick Bite wants a painted hazard. Pit Sight wants a pit on the ray. |
| DAMAGE shared-axis | Bonus iff caster and target already share rank XOR file | File Lance is a ray poke. Axis Veil forbids primary. Rank Lock constrains walk. |
| DAMAGE caster-walked | Bonus iff the caster spent **≥ 1** walk MP this turn | Post Sting is the unmoved inverse. Spent Stride taxes **their** walk. Split Pace is a self range rider. |
| POSITION shove+face | Push 1 **and** write `currentView` from the step | Shoulder Bash / Body Check shove without facing. About Face inverts without moving. |
| POSITION knight slip | (2,1) self teleport to a **free** cell, walls block dest | Vault ignores walls, once/battle. Phase Slip / Mist Step are Chebyshev blinks, not knight-shaped. |
| POSITION pivot foe | Rotate the **target** 90° around the caster | Hinge Step rotates the **caster** around an ally. |
| POSITION three-cell occupy | Three 1-HP posts, connected 4-adj chain | Twin Span is two. Span Guard / Span Pylon are rigid / stationary two-cell. Triune Gate is three **pads**, not bodies. |
| CONTROL hostile CD→0 | Set **their** highest remaining CD to 0 | Cadence Break is **self** last-id. Cadence Theft steals 1. Cadence Lend is ally −1. |
| CONTROL must-walk | Next spell fizzles unless they spent ≥ 1 walk MP | Stride Mute fizzles **if** they walked. Post Sting bonuses if **you** did not. |
| CONTROL recast lock | Cannot resolve the same id twice in a row | Echo family **replays**. Mute Thread fizzles the next **any** spell. Once Verse is last-id only. |
| DEFENSE tick skip | Next DoT **tick** on self deals 0 | Sidestep misses a **hit**. Tick Hood does not block apply. |
| DEFENSE adjacent share | Next hit 50/50 with an adjacent **ally** | Pet Share is summon-only. Pain Link is a % tether. Cover redirects the whole hit. |
| SUPPORT spare MP | +1 **current** walk MP now, not a duration buff | Haste is +2 MP / 1 turn `buffStat`. Second Wind is a Discovery refill. Spare Pace is a one-shot current. |
| TERRAIN delayed pit | Floor paint becomes a pit after 1 turn | Open Pit is immediate. Fuse is delayed **damage**, still walkable. |
| TERRAIN exit MP refund | Leaving the painted cell refunds 1 walk MP | Exit Tithe charges +1 **AP**. Glyph Tax is enter AP. |
| POSITION mass shove+face | Signature: Board Tilt **plus** facing write | Board Tilt is 0 facing. About Face is 0 move. Player never owns this. |
| RESOURCE fourth MP snipe | — | **Held forever** with Ley Toll / Undertow / Sanguine Toll |
| Echo of ally / sixth echo | — | Held for Discovery (Choir Verse already exists) |
| Full-bar silence | — | Hex of Silence stays `BOSS_ONLY` |
| Mid-RAF splice | — | Held (AGENTS.md) |

**Still open after this wave (do not fill today):** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; a sixth echo id; player-owned Hex of Silence; heal-if-caster-moved; 90° hinge of **two hostiles as a pair**; reset **all** of another combatant’s CDs (Crack is highest-one only). Those stay Wave 8 / Discovery so this pass stays discrete.

---

## 3. Contract with Dynamic Spell Discovery

Coordinate with Discovery (`c26e5a83-…`) and Admin (`4efa22ec-…`). This pass only stamps acquisition so those layers can filter **by field**. Discovery Wave 7 may ship the same day — **do not mint SDE ids here**. Stamp family / observe metadata onto Wave-7 **tactical** ids only. If a same-day SDE file claims one of these ids, SDE wins; rename is not this pass’s job (same rule Wave 6 used vs #480).

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

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 7 ids to `starterSpells` as base. Do **not** land Wave-7 data before Wave-1 ownership split (`SDE-2026-08-31-001`), Wave-2 G resolve, Wave-3 data, Wave-4 (#342 / #371) data, Wave-5 (#411) data, or Wave-6 (#463 / #480) data.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "triplespan"` is a **string enum on the config**.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Shove Face / Pivot Foe / Knight Slip **cast** (AP spent) **is** observation, including a blocked landing fizzle after AP.
- Must Pace / Once Verse / Tick Hood / Flank Share **arming** (AP spent) **is** observation. Later consume is **not** a second observe.
- Pit Wick / Exit Boon **paint** is observation. Later enter/exit / convert ticks are not a second observe.
- Triple Span **summon** is observation. Later walks / deaths are not a second observe.
- Cadence Crack **cast** is observation even if the target had no id on CD (fizzle after AP).
- Court Shove **arm** is observation for witness-only kits. Never written to owned ids.
- Do not require “see it N times” except where a boss adaptation already does. Wave 7 defaults `allowLaterVictory: false`.
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

**Every live feat and every live challenge id is already a sole spell door.** Wave 7 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 7 does **not** invent a 16th feat.

**Live 19 first-wins are all taken (do not restamp as the only door):**  
`starborn_queen` (Cut In), `pale_archivist` (After Verse), `starved_vampire_pawn` (Sanguine Toll), `lord_of_static` (Draw Together), `final_pawn` (Eclipse Fold), `mirror_sovereign` (Echo Cast), `crimson_countess` (Crimson Pact), `void_grandmaster` (Twin Gate), `midnight_bishop` (Life Tether), `chessboard_lich` (Claim Ward), `twin_monarchs` (Choir Hymn), `alabaster_fortress` (Pain Link / Aftershock), `bone_cavalier` (Vault / Caltrop), `pale_archbishop` (Reliquary / Glyph Snare extras), `fetid_rook` (Rot Brand), `broodmother_rook` (Brood Ward), `weeping_pawn` (Mute Thread, #411), `eternal_pawn_king` (Queue Cut, #411), `enthroned_void` (File Vault MULTI child, #411). `second_lament` remains kit-only False Cut.

**Wave-5 boss extra doors (#367) — do not restamp:** `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`.

**Wave-6 boss extra doors (#406) — do not restamp:** `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`.

**Wave-6 tactical extra doors (#463) — do not restamp:** `oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`.

**Wave-7 boss extra doors (#474) — do not restamp:** `mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`. (#474 extra-doored Slide Tile / Pawn Trade / Fan Bolt / Hex Toll. Do not also grant those from a Wave-7 tactical door.)

**Wave-8 boss extra doors (#518, same-day) — do not restamp:** `gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`. (#518 extra-doored Facing Pin / Span Guard / Cover Step / Low Lintel. Do not also grant those from a Wave-7 tactical door. `span_triune` is **not** `span_chamberlain`.)

**New proposed extra doors for the boss designer (Wave 9 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `pace_prelate` first-win | Must Pace |
| `span_triune` first-win | Triple Span MULTI child (observe+win still grants) |
| `wick_mason` first-win | Pit Wick MULTI child |
| `slip_castellan` first-win | Knight Slip MULTI child |
| `court_usher` kit only | Court Shove (`NOT_PLAYER_LEARNABLE`) |

Piece-type observe paths (not feat doors): masons / rooks for Wall Sting; rooks / bishops for File Brand; knights / chargers for Boot Sting; knights / recoil for Shove Face; knights for Knight Slip; queens / porters for Pivot Foe; castellans ELITE for Triple Span; scribes / tempo for Cadence Crack; hex / pawns for Must Pace; cantors / hex for Once Verse; mist / lurkers for Tick Hood; wardens ELITE for Flank Share; tide / kiter for Spare Pace; masons / ember for Pit Wick; masons / tide for Exit Boon.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 / #463 / #480 key names for a different meaning.

`mpCost` stays 0 on every Wave-7 row.

**New keys (Wave 7 only):**

```text
requireTargetAdjBarrier, wallStingBonus,           // Wall Sting
requireSharedAxisXor, fileBrandBonus,              // File Brand — rank XOR file
requireCasterWalked, bootStingBonus,               // Boot Sting — walk MP ≥ 1
shoveFaceDistance, shoveFaceWriteView,             // Shove Face
knightSlipDx, knightSlipDy,                        // Knight Slip — dest offset (2,1) any rotation
pivotClockwise,                                    // Pivot Foe — 90° around caster
tripleSpanCells, tripleSpanWalkMp,                 // Triple Span — 3; counts as 3
resetTargetHighestCooldownToZero,                  // Cadence Crack
mustWalkBeforeNextSpell, mustPaceDuration,         // Must Pace
forbidRepeatLastSpellId, onceVerseDuration,        // Once Verse
skipNextDotTick,                                   // Tick Hood
flankShareRatio, flankShareNeedAdjacentAlly,       // Flank Share — 0.5
sparePaceCurrentMp,                                // Spare Pace — +1 current
pitWickDelayTurns, pitWickBlocksWalk, pitWickBlocksLos,  // Pit Wick
exitBoonMp, exitBoonDuration,                      // Exit Boon — 1, 2
courtShoveDistance, courtShoveWriteView, courtShoveExcludeCaster  // Court Shove
```

If a key is missing, the rider does not fire.

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Wall Sting’s +10 is illegal if they are not hugging a wall. Cadence Crack is once/battle so Inferno does not loop from a hostile reset. Triple Span’s three bodies are 1 HP each.

No Wave-7 card rewrites the current actor. AGENTS.md forbids incidental turn-logic and RAF edits. Shove Face uses existing `applyPushback`. Knight Slip is occupancy teleport of **self** to a knight-offset free cell, not a queue splice.

---

## 5. Proposed spells (Wave 7)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-wall-sting`

NAME: Wall Sting  
ROLE: DAMAGE — bonus if the target is adjacent to a barrier  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal **12**. If the target’s cell is Chebyshev-1 from at least one **barrier** tile (`barrierTiles`), deal **+10** (`effectParams: {"requireTargetAdjBarrier":true,"wallStingBonus":10}`). Reads occupancy barriers, never `spell.name`, never pixels. Distinct from Blind Corner (LoS **blocked** along the ray), Wick Bite (painted **hazard** under them), Pit Sight (pit on the ray), Open Pit (they stand in a hole).  
DURATION: instant  
SCALING: 12 and +10 follow dmg%. Barrier gate fixed.  
SYNERGIES: Barrier / Stone Turret / Bastion on the flank; Rank Lock so they cannot step off the wall; File Brand if the wall is on-file.  
COUNTERPLAY: Step Chebyshev-2 from every wall; Dispel / wait the barrier out; Sidestep the 12.  
POWER_BUDGET: Standard. 22 only against a hugged wall — Frost-like with a readable tell.  
AI_USAGE: `aiHint: "bonus_if_target_adj_barrier"`. Masons / rooks zone ≥ 1. Skip if no barrier is Chebyshev-1 from the target (use Frost / Strike).  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 8`, `discoverySources: { pieceTypes: ["rook","pawn"], levelZoneMin: 1 }`. Observe+win.  
EDGE_CASES: Missing barrier set **fail closed** (12 only). Pits / smoke / rime / fuse paints are **not** barriers. World walls (`tiles[y][x] === false`) are **not** spell barriers — only `barrierTiles`. Challenge: both chunks through `recordChallengeDamageTaken`. Do not edit damage math.  
IMPLEMENTATION_COMPLEXITY: LOW — one Chebyshev scan of `barrierTiles`.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-wall-sting
effectType: damage
effectCategory: damage
spellType: damage
targetType: enemy
areaShape: single
apCost: 3
mpCost: 0
damage: 12
range: 3
cooldown: 1
lineOfSight: true
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
effectParams: {"requireTargetAdjBarrier":true,"wallStingBonus":10}
```

---

### SPELL_ID: `spell-file-brand`

NAME: File Brand  
ROLE: DAMAGE — bonus if caster and target share rank XOR file  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal **10**. If caster and target share **exactly one** axis (`x` equal XOR `y` equal — not both, not neither), deal **+10** (`effectParams: {"requireSharedAxisXor":true,"fileBrandBonus":10}`). Distinct from File Lance (ray poke, every body on the ray), File Reel (attract 1 along the shared axis), Rank Lock (walk constraint), Axis Veil (cannot be spell primary on the axis). Diagonal / knight-offset = 10 only. Same cell is illegal (`targetType: "enemy"`).  
DURATION: instant  
SCALING: 10 and +10 follow dmg%.  
SYNERGIES: Rank Lock / Open Pit to keep them on-file; File Reel then brand; Wall Sting if a barrier sits on the file.  
COUNTERPLAY: Step onto a diagonal; Smoke the file; hug the caster (same cell illegal; Chebyshev 0 never fires).  
POWER_BUDGET: Standard. 20 on-axis equals Frost without the MP debuff, but they can step off.  
AI_USAGE: `aiHint: "bonus_if_shared_rank_xor_file"`. Rooks / bishops zone ≥ 1. Skip if off-axis and File Lance is in kit.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 7`, `discoverySources: { pieceTypes: ["rook","bishop"], levelZoneMin: 1 }`. Observe+win.  
EDGE_CASES: Sharing **both** axes is the caster tile — already illegal. Missing key → 10 only. `linear: false` — this is not `targetType: "line"`. Mark on the dest tile still applies via existing Mark.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-boot-sting`

NAME: Boot Sting  
ROLE: DAMAGE — bonus if the caster already walked this turn  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal **12**. If the caster’s walk-MP spent this turn is **≥ 1**, deal **+10** (`effectParams: {"requireCasterWalked":true,"bootStingBonus":10}`). Reads the same first-class `walkMpSpentThisTurn` Post Sting uses. Distinct from Post Sting (unmoved inverse), Spent Stride (taxes **their** walk), Stride Brand (target moved), Planted Stance (self buff). Forced-move onto/off the cell does **not** count as walk MP (same rule as Stride Mute / Post Sting).  
DURATION: instant  
SCALING: 12 and +10 follow dmg%. Walked gate fixed.  
SYNERGIES: Spare Pace to fund the step; Must Pace on them so they cannot shoot back without walking; Shove Face after the sting to write facing.  
COUNTERPLAY: Root / Nail Down the caster so they cannot take the bonus; stay at range 4.  
POWER_BUDGET: Standard. 22 only after a paid step — they spent MP they could have used to kite further.  
AI_USAGE: `aiHint: "bonus_if_caster_walked"`. Knights / chargers zone ≥ 1. Skip if `walkMpSpentThisTurn === 0` (use Post Sting / Strike).  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 8`, `discoverySources: { pieceTypes: ["knight","pawn"], levelZoneMin: 1 }`. Observe+win.  
EDGE_CASES: Missing walk-spend field **fail closed** (12 only). Challenge: both chunks through `recordChallengeDamageTaken`. Do not edit damage math.  
IMPLEMENTATION_COMPLEXITY: LOW — same integer Post Sting needs.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-shove-face`

NAME: Shove Face  
ROLE: POSITION — push 1 and write `currentView` from the step  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 1  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 1  
EFFECT: `effectParams: {"shoveFaceDistance":1,"shoveFaceWriteView":true}`. Call `applyPushback(targetCell, casterCell, 1, occupancy)` — the **target** is pushed 1 away from the caster. If they actually changed cell, write `currentView` from that step using the **same mapping as overworld wander** (`WorldExploration.tsx` 6928–6931: +x → `"right"`, −x → `"left"`, +y → `"front"`, −y → `"back"`). No damage. Distinct from Shoulder Bash / Body Check (shove, no facing write), Back Step (self push), About Face (invert, no move), Face Away (invert one stored view, no move), Facing Pin (lock one view). This **is** the Wave-6-deferred forced-move facing writer.  
DURATION: instant  
SCALING: distance 1 fixed.  
SYNERGIES: Oncoming / Glance Cut after the facing write; Open Pit / Slide / Cinder one cell further; Boot Sting after you stepped in.  
COUNTERPLAY: Corner them (push distance 0 → facing unchanged); Self Anchor; occupy the dest.  
POWER_BUDGET: Cheap tool. 0 damage. CD 1 because collision already caps it.  
AI_USAGE: `aiHint: "push_and_write_view_if_adj"`. Knights / recoil zone ≥ 1. Skip if the dest is a pit / lava **or** push would be 0.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 8`, `discoverySources: { pieceTypes: ["knight"], levelZoneMin: 1 }`. Observe+win.  
EDGE_CASES: Range 1 Chebyshev. Diagonal adjacent is legal; dominant-axis push (existing `applyPushback`). If they do not move, **do not** rewrite facing. Missing `shoveFaceWriteView` → push only (fail closed on the facing rider). Dest hazard **must tick** (MIMA-2026-08-31-005). `movedThisTurn` = true on a successful ≥1 tile slide. Battle-walk writer (Wave 5 prerequisite) is still required for **walk** facing; this card only writes on **this** push. Do not edit RAF.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — resolver exists; facing write is one enum assign.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-knight-slip`

NAME: Knight Slip  
ROLE: POSITION — (2,1) self teleport to a free cell (walls block dest)  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"knightSlipDx":2,"knightSlipDy":1}`. The player **clicks a legal dest** via a self-cast that still needs a ground-adjacent picker: implementers expose eight (2,1) rotations as the only legal dests (range is the knight offset, not `SpellConfig.range`). Dest must be `isCellFree` (walkable, not barrier / portal / void / occupied). **Does not** pass through walls — only the dest cell is tested (knight jump over a wall **is** legal **if the dest is free**; a dest that **is** a wall / barrier fails). Distinct from Vault (once/battle, **ignores** walls, Achievement), Phase Slip / Mist Step (Chebyshev blink), Morrow Step, Relay Dash (walk ≤ 2), Knight Pierce (damage rider).  
DURATION: instant  
SCALING: offset fixed.  
SYNERGIES: Boot Sting after the slip (walk MP is **not** spent — slip is a teleport, so Boot Sting fail-closes unless they also walked); Shove Face a body then slip off the file; Pit Wick on the origin.  
COUNTERPLAY: Occupy all eight dests; Claim Ward a dest; Nail Down does **not** block teleport (Grounded Lock / Claim Ward do — honor those flags).  
POWER_BUDGET: Standard utility, 0 damage, CD 2. Vault stays the once/battle through-wall spectacular.  
AI_USAGE: `aiHint: "knight_slip_if_dest_free_and_safer"`. Knights zone ≥ 2. Skip if every dest fails `isCellFree` or the dest is a pit / lava.  
DISCOVERY_ELIGIBILITY: true. Knight observe+win (`pieceTypes: ["knight"]`, `levelZoneMin: 2`) **or** `bossIds: ["slip_castellan"]`. First grant wins. Observation **false** on the BOSS child (first victory).  
EDGE_CASES: Self targeting today has no dest picker (`targetType: "self"` is the caster tile). Implementers must add an explicit `targetType: "ground"` with `freeCells: true` **and** a dest filter that only accepts the eight knight offsets from the caster — **do not** name-check. Ground targeting rejects the caster tile (`targeting.ts` 129–137 / occupied rule) — good, dest is never self. Death-realm portal guards do **not** fire. `movedThisTurn` = true on a successful slip. Walk MP spent stays 0.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — dest filter + occupancy teleport. Do not reuse Vault’s wall-ignore.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pivot-foe`

NAME: Pivot Foe  
ROLE: POSITION — rotate the target 90° around the caster  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: `effectParams: {"pivotClockwise":true}`. Let `dx, dy` be target − caster. Dest = caster + `(dy, −dx)` (90° clockwise). If dest is `isCellFree`, move the **target** there (occupancy teleport, not `isSwap`). If dest is blocked, fizzle (AP spent). Caster does not move. Distinct from Hinge Step (caster rotates around an **ally**), Pawn Trade (two hostiles swap, caster stays), Twin Guard (two-ally swap).  
DURATION: instant  
SCALING: none.  
SYNERGIES: Open Pit / Fuse / Cinder / Wall on the dest; File Brand after they land on-file; Shove Face to then write facing; Rank Lock so they cannot walk back.  
COUNTERPLAY: Stand so every clockwise dest is a wall; Self Anchor; occupy the dest.  
POWER_BUDGET: Standard utility, 0 damage, CD 2.  
AI_USAGE: `aiHint: "pivot_foe_if_dest_improves_file_or_hazard"`. Queens / porters zone ≥ 1. Skip if dest is not free or is worse (lava under a Safe Fall they do not have is still a skip if they would die).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`. Observe+win.  
EDGE_CASES: Range 2 Chebyshev so a (2,0) body can land on (0,−2) still in-board. Counter-clockwise is **not** this card (`pivotClockwise: false` would be a later id — do not guess from the name). Dest hazard must tick. `movedThisTurn` = true on a successful pivot. Claim Ward on dest fizzles the whole move.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy teleport of the target.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-triple-span`

NAME: Triple Span  
ROLE: SUMMONS — three 1-HP posts, connected 4-adj chain  
ACQUISITION: ELITE  
AP_COST: 5  
RANGE: 2  
TARGET_TYPE: ground  
LOS: false  
COOLDOWN: 4  
EFFECT: `isSummon: true`, `summonAI: "triplespan"`, `summonLifespan: 4`, `freeCells: true`. `effectParams: {"tripleSpanCells":3,"tripleSpanWalkMp":1}`. One cast plants **three** 1-HP posts on a cardinal line of 3 starting at the targeted empty floor cell, along caster→target 4-dir (if the line is blocked, fizzle). `summonUnitDef`: pieceType `triplespan` (enum, not a name parse), hpScale 0.3, damageScale 0, `ap: 0`, `mp: 2`, empty kit. Posts **walk independently** at 1 MP/step but a post’s dest is illegal unless after the step the three living posts remain a **4-adjacency connected chain** (each living post Chebyshev-1 in 4-dir from at least one sibling). If one dies, the remaining two use Twin Span’s adjacent-pair rule. Counts as **three** toward the summon cap. Distinct from Twin Span (two), Span Guard (rigid self pair), Span Pylon (stationary 2-cell), Triune Gate (three **pads**), Court Fold (fold two bodies).  
DURATION: lifespan 4  
SCALING: hpScale with summon rules.  
SYNERGIES: File Lance / Fan Bolt against a packed chain; Load Bearing / Chain Ward on a post; Pet Sill to brick hostile pets around the chain.  
COUNTERPLAY: Kill one post (chain becomes two); Open Pit a required step; Null Brand lockout.  
POWER_BUDGET: Heavy, CD 4, 0 direct damage. Three bodies is the power.  
AI_USAGE: `aiHint: "triple_span_if_summon_cap_ge_3"`. Elite castellans. Skip if cap remaining < 3 **or** the 3-line is not free. `inferSummonArchetype` must key `summonAI === "triplespan"`, **never** `name.includes("span")`.  
DISCOVERY_ELIGIBILITY: true. `eliteOnly: true`, `pieceTypes: ["rook"]`, `levelZoneMin: 2` **or** `bossIds: ["span_triune"]`. First grant wins.  
EDGE_CASES: Three toward cap — a living Twin Span (2) plus Triple Span (3) is illegal if cap is 4; skip. Empty kit: posts do not Strike. Controlled-summon walk honors the chain predicate (MIMA-2026-08-31-002). Spawn reserved cells: same dual-path as other summons. Do not plant on occupancy `portals`.  
IMPLEMENTATION_COMPLEXITY: HIGH — three-body occupy + walk dest filter.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-crack`

NAME: Cadence Crack  
ROLE: CONTROL — reset another combatant’s highest remaining CD to 0  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 4  
EFFECT: No damage. `effectParams: {"resetTargetHighestCooldownToZero":true}`. Among the target’s owned ids with remaining CD > 0, pick the **highest remaining**, set it to **0**. Once per battle per caster (first-class `cadenceCrackUsedThisBattle` on the caster). If no id is on CD, fizzle (AP spent). Distinct from Cadence Break (**self**, last owned id), Cadence Theft (steal 1, they gain), Cadence Lend (ally −1), Timestep (AP/MP, not CD). Does **not** write spell levels.  
DURATION: instant (once/battle)  
SCALING: none.  
SYNERGIES: Inferno just went on CD 3 — crack it so they can Inferno again (hostile use: crack **your** ally? **No** — `targetType: "enemy"`). Player use: crack a bishop’s Frost CD so they waste the next turn recasting instead of walking. The decision is **whose** tempo you restore.  
COUNTERPLAY: Do not hold a high CD; Cadence Brand +1 after they crack; sit with all CDs at 0.  
POWER_BUDGET: Cheap AP, long CD, once/battle. Restoring Inferno is the ceiling — once.  
AI_USAGE: `aiHint: "reset_hostile_highest_cd_if_ge_2"`. Scribes / tempo zone ≥ 1. Skip if no remaining CD ≥ 2 or already used this battle.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","queen"], levelZoneMin: 1`. Observe+win. Fizzle after AP still observes.  
EDGE_CASES: Ties: highest remaining, then lowest id. Do not reset `physical_attack` if it has no CD. Once/battle is **caster**-scoped, not target-scoped. Challenge: not AP spend on them.  
IMPLEMENTATION_COMPLEXITY: LOW — cooldown map by id.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-must-pace`

NAME: Must Pace  
ROLE: CONTROL — next spell fizzles unless they walked  
ACQUISITION: BOSS  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: No damage. `effectParams: {"mustWalkBeforeNextSpell":true,"mustPaceDuration":2}`. For 2 turns or until they successfully resolve a spell, whichever first: if `walkMpSpentThisTurn === 0` at the moment of their next spell, that spell **fizzles** (AP spent, CD starts). If they already spent ≥ 1 walk MP this turn, the spell resolves and the brand consumes. Walk / potions do not consume it. Distinct from Stride Mute (fizzle **if** they walked), Post Sting (your unmoved bonus), Oath Blade (Strike-only), Mute Thread (next spell always fizzles).  
DURATION: 2 turns or 1 consumed spell attempt  
SCALING: none.  
SYNERGIES: Nail Down / Root so they cannot take the required step; Open Pit on the only step; Boot Sting is the inverse decision on **you**.  
COUNTERPLAY: Take a 1-MP step then cast; wait 2 turns; Cleanse / Absolve / Dispel Thread if those strip this **debuff** (`cleanseTypes` include `"mustPace"`).  
POWER_BUDGET: Standard control, 0 damage, CD 3.  
AI_USAGE: `aiHint: "must_pace_if_target_wants_to_plant"`. `pace_prelate` kit. World casters: hex / pawns zone ≥ 2. Skip if they already walked this turn.  
DISCOVERY_ELIGIBILITY: true. `bossIds: ["pace_prelate"]`. Observation **false** (BOSS route, first victory). Not room-0 farm.  
EDGE_CASES: Attack Nearest / canvas summon is a spell — honor the gate inside `executeCastAttempt` after AP debit (fizzle still spends AP, same as Mute Thread). Missing walk-spend field **fail closed** (treat as 0 → fizzle). Forced-move is not walk MP.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — one flag in the unified cast helper. Do not splice turns.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-once-verse`

NAME: Once Verse  
ROLE: CONTROL — cannot resolve the same id twice in a row  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: No damage. `effectParams: {"forbidRepeatLastSpellId":true,"onceVerseDuration":2}`. For 2 turns, the target’s next spell **fizzles** if `spell.id === lastResolvedSpellId` on that unit (the id they most recently successfully resolved this battle). A different id resolves and updates `lastResolvedSpellId`. Distinct from After Verse / Stolen Verse / Choir Verse / Echo Cast / False Echo (those **replay**). Distinct from Mute Thread (any next spell). Never `spell.name`.  
DURATION: 2 turns  
SCALING: none.  
SYNERGIES: Cadence Crack so their only remaining ready id is the banned one; Quiet Hex the alternative.  
COUNTERPLAY: Cast a 2-cost tool of a different id; wait 2 turns; they have no last-resolved yet (first spell of the fight is never a repeat — fail closed, brand still arms).  
POWER_BUDGET: Cheap control, 0 damage, CD 3.  
AI_USAGE: `aiHint: "once_verse_if_target_repeats_a_nuke"`. Cantors / hex zone ≥ 1. Skip if they have ≥ 3 off-CD ids.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","queen"], levelZoneMin: 1`. Observe+win.  
EDGE_CASES: `lastResolvedSpellId` is a first-class field, written only on `castResult === "cast"`, not fizzle. Strike is an id (`physical_attack`) — repeating Strike fizzles. Missing last-id → no fizzle (they have not resolved yet).  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — one id on the unit.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-tick-hood`

NAME: Tick Hood  
ROLE: DEFENSE — next DoT tick on self deals 0  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: No damage. `effectCategory: "defense"`. `effectParams: {"skipNextDotTick":true}`. The next **DoT tick** that would deal HP to this unit deals **0** (no HP loss, no challenge debit from that tick), then the charge consumes. The **apply** still lands (stacks exist). Distinct from Sidestep Ward (miss a **hit** / apply), Fog Hood (LoS), Cursed Wound (healRecv), Cleanse (strips the effect). Timeout: 2 turns (`buffDuration: 2`) if no tick fires.  
DURATION: until 1 skipped tick or 2 turns  
SCALING: charges fixed.  
SYNERGIES: Inferno / Poison already on you — skip the fat tick; Absolve later to strip leftover stacks.  
COUNTERPLAY: Wait 2 turns; throw a hit (does **not** consume Tick Hood); apply a new DoT after the skip.  
POWER_BUDGET: Cheap, long CD, 0 damage. One tick.  
AI_USAGE: `aiHint: "skip_next_dot_tick_if_dot_present"`. Mist / lurkers. Skip if the unit has no DoT.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","pawn"], levelZoneMin: 1`. Observe+win. Arming observes; the skipped tick does not.  
EDGE_CASES: Multiple DoTs: skip the **first** tick that would deal > 0 this unit this resolution order (lowest effect id). Lava/spikes are **not** DoT ticks (Safe Fall / environmental path). Sacrifice self-HP is not a DoT.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — one flag in the DoT ticker, not inside `computeDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-flank-share`

NAME: Flank Share  
ROLE: DEFENSE — next hit 50/50 with an adjacent ally  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: `effectParams: {"flankShareRatio":0.5,"flankShareNeedAdjacentAlly":true}`. The next damaging **hit** against this unit (spell-hit / Strike, not DoT tick, not lava) splits: this unit takes `ceil(applied * 0.5)`, the nearest living **ally** within Chebyshev 1 takes the remainder. Ally means same `side`, `hp > 0`, **including** player-side summons and excluding self. If no adjacent ally at **hit time**, the hit is unsplit (charge still consumes). Applied hit is post-RES, pre-HP write — **do not** rewrite `computeDamage`; split the already-computed applied value. Distinct from Pet Share (summon-only), Pain Link (% tether regardless of adjacency), Cover Step (redirect whole hit), Life Tether / Load Bearing (shared HP pool).  
DURATION: until 1 hit or 2 turns  
SCALING: ratio fixed.  
SYNERGIES: Goad so the hit they must throw is the split one; Triple Span posts as adjacent sponges; Turn Cap on the ally.  
COUNTERPLAY: Kill the adjacent ally first; AoE that hits both (each instance can consume once — first split, second full); wait 2.  
POWER_BUDGET: Standard, CD 3, 0 damage.  
AI_USAGE: `aiHint: "flank_share_if_adj_ally"`. Elite wardens. Skip if no adjacent ally.  
DISCOVERY_ELIGIBILITY: true. `eliteOnly: true`, `pieceTypes: ["rook","king"], levelZoneMin: 2`. Observe+win.  
EDGE_CASES: Remainder goes through `recordChallengeDamageTaken` on the **ally** if that ally is the player. Challenge `no_damage_taken`: the player’s half **does** count. Missing ally at hit time: full hit on the original, charge gone. Do not split True Overkill into a corpse.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — one split in the incoming-hit pipeline after RES.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-spare-pace`

NAME: Spare Pace  
ROLE: SUPPORT — +1 current walk MP now  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"sparePaceCurrentMp":1}`. Add 1 to **current** MP this turn, capped at max 20 (or the unit’s max MP). Not a `buffStat: "mp"` duration (that is Haste +2 / 1 turn). Not Second Wind (Discovery refill). Not Split Pace (walked ≥ 2 range rider). The decision is **2 AP for 1 extra step now**.  
DURATION: instant (current-turn MP only)  
SCALING: amount fixed.  
SYNERGIES: Boot Sting after the extra step; Must Pace so they had to walk anyway; Exit Boon refunds a later leave.  
COUNTERPLAY: Soul Sip the spare; ice / Rank Lock so the extra MP cannot be spent on a useful dest.  
POWER_BUDGET: Cheap, CD 2, 0 damage.  
AI_USAGE: `aiHint: "spare_pace_if_one_short_of_dest"`. Tide / kiter zone ≥ 1. Skip if already at max MP **or** no dest needs exactly +1.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["knight","bishop"], levelZoneMin: 1`. Observe+win.  
EDGE_CASES: Do not write persisted `CharacterStats.mp`. Frozen/Slime walk modifiers still apply to the **next** step; this card does not bypass them. Challenge: not AP.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pit-wick`

NAME: Pit Wick  
ROLE: TERRAIN — floor becomes a pit after 1 turn  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. `effectParams: {"pitWickDelayTurns":1,"pitWickBlocksWalk":true,"pitWickBlocksLos":false}`. Paint one floor cell as a **wick** (walkable, LoS open) for 1 turn. At the start of the caster’s next turn (or after 1 round if the caster is gone), convert that cell into an Open Pit for 2 more turns (`pitTiles`, not `barrierTiles`; LoS ignores pits). Units standing on it when it converts are **not** displaced (same as Open Pit). Distinct from Open Pit (immediate), Fuse Tile (delayed **damage**, still walkable), Wick Bite (bonus on painted hazard **now**), Cinder Tile (tick).  
DURATION: 1 turn wick + 2 turns pit  
SCALING: delays fixed.  
SYNERGIES: Shove Face / Pivot Foe onto the wick **before** it opens; File Brand through the later pit (LoS open); Twin Gate dest = pit fails `isCellFree` after convert.  
COUNTERPLAY: Do not stand there at convert; Barrier last-writer **fills** the pit; leave during the wick window.  
POWER_BUDGET: Standard utility.  
AI_USAGE: `aiHint: "pit_wick_on_melee_approach"`. Masons / ember zone ≥ 1. Skip if the player is already at range 4 with Far Sting (you will give them a LoS tunnel in 1 turn).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"], levelZoneMin: 1` **or** `bossIds: ["wick_mason"]`. First grant wins. Paint observes; convert does not.  
EDGE_CASES: Last writer vs fuse/rime/smoke: wick is a paint; Barrier wins vs wick **and** vs pit. Convert is occupancy, not damage — no `recordChallengeDamageTaken` until someone walks into a later hazard on a different card. Flying does not exist.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — delayed occupancy convert; share `pitTiles` with Open Pit.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-exit-boon`

NAME: Exit Boon  
ROLE: TERRAIN — leaving the cell refunds 1 walk MP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. `effectParams: {"exitBoonMp":1,"exitBoonDuration":2}`. Paint one floor cell for 2 turns. A unit that **leaves** the cell by **walk** (not teleport / swap / push) refunds 1 current MP, capped at max. Distinct from Exit Tithe (leave costs **+1 AP**), Glyph Tax (enter AP), Haste / Spare Pace (caster-scoped). Standing on it at paint time does not refund. Re-entering and leaving again in the same turn **does** refund again (one refund per leave event).  
DURATION: 2 turns  
SCALING: refund 1 fixed.  
SYNERGIES: Spare Pace + leave + Boot Sting; Must Pace so they must leave to cast; Rank Lock the only legal step onto the boon.  
COUNTERPLAY: Do not enter; Exit Tithe last-writer on the same cell (last writer: Tithe vs Boon — **do not** stack; last paint wins, documented in recap later, no name table).  
POWER_BUDGET: Cheap utility.  
AI_USAGE: `aiHint: "exit_boon_on_own_kiting_cell"`. Tide / masons zone ≥ 1. Skip if the cell is adjacent to a pit they would refund into.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","knight"], levelZoneMin: 1`. Observe+win. Paint observes; leave refunds do not.  
EDGE_CASES: Teleport / swap / shove leave does **not** refund (walk only). Challenge: not AP. Do not write persisted MP. Frozen/Slime still charged the step; refund happens after the spend (net −(cost−1)).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — leave hook shared with Exit Tithe’s walk-exit predicate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-shove`

NAME: Court Shove  
ROLE: POSITION — mass shove 1 and write each mover’s facing  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 5  
RANGE: 1  
TARGET_TYPE: ground  
LOS: false  
COOLDOWN: 4  
EFFECT: Click an adjacent cardinally aligned empty or occupied cell to choose dir. `effectParams: {"courtShoveDistance":1,"courtShoveWriteView":true,"courtShoveExcludeCaster":true}`. Every **other** living combatant is `applyPushback` 1 in that dir. Resolve **farthest-first** along the axis so they do not stack. Anyone who actually changed cell gets `currentView` written from that step (same mapping as Shove Face / WX 6928–6931). No damage. Distinct from Board Tilt (mass shove, **no** facing), About Face (invert facing, **no** move), Court Fold (fold two adjacent player-side bodies), Crosswind. Player **never** owns this.  
DURATION: instant  
SCALING: distance 1 fixed.  
SYNERGIES (as a witness puzzle): Oncoming / Glance Cut after the facing write; Open Pit / Fuse / Slide / Pit Wick in the dir; Rank Lock then shove off the lock (forced move is legal).  
COUNTERPLAY: Stand on the up-dir wall; Self Anchor; occupy so the farthest-first slide stops short.  
POWER_BUDGET: Signature control, 0 damage, CD 4, not learnable.  
AI_USAGE: `aiHint: "court_shove_if_three_plus_improve"`. `court_usher` kit only. Skip if fewer than 3 other bodies would move. Missing `aiHint` = drop from resolve (Discovery principle 6).  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. Observation may still record for telemetry; **grant never fires**. `usableByPlayer: false`, `usableByEnemy: true`.  
EDGE_CASES: Player-side summons move. Hazard ticks on landing. `movedThisTurn` on anyone who slid. Do not shove world-portal reserved cells onto sealed corridors (skip units whose dest is reserved; they stay; facing unchanged).  
IMPLEMENTATION_COMPLEXITY: MEDIUM–HIGH — multi-unit occupancy order + facing writes.  
STATUS: PROPOSED

---

## 6. Combination matrix (intended, not name-wired)

Resolve only via flags / tile maps / effect keys.

| Setup (metadata) | Payoff (metadata) | Decision |
| :--- | :--- | :--- |
| `barrierTiles` Chebyshev-1 | `requireTargetAdjBarrier` | Plant a wall, then sting — or refuse the hug |
| `requireSharedAxisXor` | `walkAxisLockTurns` / `fileAxisAttractSteps` | Keep them on-file, then brand |
| `requireCasterWalked` | `sparePaceCurrentMp` / `exitBoonMp` | Buy the step, then sting |
| `shoveFaceWriteView` | Oncoming / Glance Cut (`currentView`) | Push, then punish the new facing |
| `knightSlipDx/Dy` | dest `isCellFree` (pits/barriers fail) | Slip is a path, not a dump-into-pit |
| `pivotClockwise` | `pitWickDelayTurns` / `fuseTurns` | Park them on the wick before it opens |
| `tripleSpanCells: 3` | File Lance / Fan Bolt / Pet Sill | Three bodies is a wall **or** a liability |
| `resetTargetHighestCooldownToZero` | Inferno CD 3 | Restore **their** nuke once — or yours, never both from this id |
| `mustWalkBeforeNextSpell` | `requireCasterUnmoved` (Post Sting, on **them**) | They cannot plant **and** nuke |
| `forbidRepeatLastSpellId` | Cadence Crack | The restored id is the banned one |
| `skipNextDotTick` | Inferno / Poison apply already landed | Skip the fat tick; stacks remain |
| `flankShareRatio` | Triple Span adjacent post | Split onto a 1-HP sponge |
| `pitWickDelayTurns` | `shoveFaceDistance` / `pivotClockwise` | Enter during the wick or after the pit |
| `exitBoonMp` | `exitTitheAp` last-writer | Refund **or** tax — not both |
| `courtShoveWriteView` | Oncoming after mass shove | Witness-only scramble + facing |
| Barrier last-writer | pit / wick / boon / slide / fuse / rime / smoke | You built the answer |

Map modifiers stay metadata-only. Frozen/Slime × **walk** MP does not inflate a 0 `mpCost`. Arcane Surge × Must Pace is `applyApCost` then the walk gate. Plague + shove landing is two hooks if both fire — document in recap later, do not name-check.

Mechanic Interaction Matrix still OPEN (do not “fix” in this spec, but do not ship new movement that repeats the gap):

- Swap × hazards (MIMA-2026-08-31-001) — Knight Slip dest / Pivot Foe dest **must** tick dest hazards.
- Push/pull × hazards (MIMA-2026-08-31-005) — Shove Face / Court Shove use `applyPushback`; landing must tick.
- Controlled-summon walk × occupancy (MIMA-2026-08-31-002) — Triple Span chain dests must apply to summon-control walks.

---

## 7. Recommended unlock order (pacing)

Discovery designer should treat these as **bands**, not a shop list.

| Band | Spells | Why |
| :--- | :--- | :--- |
| Early (zone 0–1) | Spare Pace, Exit Boon, Once Verse, Tick Hood | Extra step, leave refund, recast lock, skip a tick |
| Mid (zone 1–2) | Wall Sting, File Brand, Boot Sting, Shove Face, Cadence Crack | Wall hug, axis rider, walked inverse, facing-write push, hostile CD |
| Late (elites / zone 2) | Knight Slip, Pivot Foe, Triple Span, Flank Share, Pit Wick | Knight blink, rotate them, three-cell occupy, 50/50, delayed pit |
| Boss recap | Must Pace (`pace_prelate`) | Walk-or-fizzle after living with Stride Mute |
| Feat / multi extras | Knight Slip (`slip_castellan`), Triple Span (`span_triune`), Pit Wick (`wick_mason`) | First child wins |
| Witness only | Court Shove (`court_usher`) | Mass shove+facing stays identity |

**Still required for any of this to matter:** Discovery’s innate-four split. This pass does not edit `spellData.ts`.

---

## 8. Implementation notes (for a later, explicit implementation PR)

1. **No new `mpCost > 0`.** Ley Toll / Undertow / Sanguine Toll remain the only paper spenders.  
2. **Battle facing writer** remains Wave 5’s prerequisite (walk steps set `currentView` with WX 6928–6931). Shove Face / Court Shove write from **push steps only**. They do not replace the walk writer.  
3. **No new queue / wrap / mid-RAF card.** Do not splice the current actor. Do not reuse the Wave-4 wrap PR or the Wave-5 end-of-turn PR.  
4. **Once Verse / Must Pace** gate on `spell.id` and `walkMpSpentThisTurn`. Never `spell.name`.  
5. **Shove Face / Court Shove** call existing `applyPushback`. Do not invent a second push helper.  
6. **Triple Span** uses `summonAI: "triplespan"`. Counts as **three** toward the summon cap.  
7. **Cadence Crack** reads the **target’s** cooldown map. Do not write spell levels. Once/battle on the **caster**.  
8. **Tick Hood** zeroes the next DoT **tick**. Do not miss the apply. Do not edit `combatMath.ts`.  
9. **Flank Share** splits the already-computed applied hit. Do not edit `combatMath.ts`.  
10. **Pit Wick** shares `pitTiles` with Open Pit after convert. Wick is walkable.  
11. **Knight Slip** dest filter is eight (2,1) offsets + `isCellFree`. Do not reuse Vault’s wall-ignore.  
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
- No restamp of any feat or `easy_*` / `hard_*` / `legendary_*` challenge door.  
- No restamp of Wave-5 boss extra doors (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`).  
- No restamp of Wave-6 boss extra doors (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`).  
- No restamp of Wave-6 tactical extra doors (`oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`).  
- No restamp of Wave-7 boss extra doors (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`).  
- No restamp of Wave-8 boss extra doors (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`).  
- No restamp of any live 19 first-win.  
- No wiring of `CharacterStats.evasion` as a percent.  
- No clone of Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Veil, Mirror / Reflect.  
- No 12-AP Void Collapse clone.  
- No third File Lance / Blood Tithe.  
- No SDE Wave-7 ids (that catalog may land same-day; do not mint them here).  
- No heal-if-caster-moved (held for Wave 8).  
- No reset of **all** of another combatant’s CDs (Crack is highest-one only).

---

## 10. Proposal index

| ID | Acquisition | Complexity | Primary hole filled |
| :--- | :--- | :--- | :--- |
| `spell-wall-sting` | ENEMY_DISCOVERY | LOW | Barrier-adjacent damage bonus |
| `spell-file-brand` | ENEMY_DISCOVERY | LOW | Shared rank XOR file damage bonus |
| `spell-boot-sting` | ENEMY_DISCOVERY | LOW | Caster-walked damage bonus (Post Sting inverse) |
| `spell-shove-face` | ENEMY_DISCOVERY | LOW–MEDIUM | Push 1 + write `currentView` |
| `spell-knight-slip` | MULTI_SOURCE | MEDIUM | (2,1) self teleport, dest must be free |
| `spell-pivot-foe` | ENEMY_DISCOVERY | MEDIUM | Rotate target 90° around caster |
| `spell-triple-span` | ELITE | HIGH | Three-cell occupy, connected chain |
| `spell-cadence-crack` | ENEMY_DISCOVERY | LOW | Hostile highest CD → 0, once/battle |
| `spell-must-pace` | BOSS | MEDIUM | Next spell fizzles unless they walked |
| `spell-once-verse` | ENEMY_DISCOVERY | LOW–MEDIUM | Cannot recast last resolved id |
| `spell-tick-hood` | ENEMY_DISCOVERY | LOW–MEDIUM | Next DoT tick deals 0 |
| `spell-flank-share` | ELITE | MEDIUM | Next hit 50/50 with adjacent ally |
| `spell-spare-pace` | ENEMY_DISCOVERY | LOW | +1 current walk MP now |
| `spell-pit-wick` | MULTI_SOURCE | MEDIUM | Delayed pit (occupancy, not fuse damage) |
| `spell-exit-boon` | ENEMY_DISCOVERY | MEDIUM | Walk-exit refunds 1 MP |
| `spell-court-shove` | NOT_PLAYER_LEARNABLE | MEDIUM–HIGH | Mass shove + facing write |

All STATUS: **PROPOSED**.

**Held, not filled:** mid-RAF splice; fourth `mpCost > 0` walk snipe; sixth echo id; player-owned Hex of Silence; heal-if-caster-moved; pair-hinge of two hostiles; reset-all CDs.

---

## 11. Source map (read-back)

| Topic | File | Lines |
| :--- | :--- | :--- |
| Live 32-id catalog | `src/frontend/src/data/spellData.ts` | 9–691 |
| Forced `isBaseSpell` | `src/frontend/src/components/WorldExploration.tsx` | 2395–2408 |
| Owned union | `src/frontend/src/components/WorldExploration.tsx` | 2410–2424 |
| Backend library filter | `src/frontend/src/utils/adminSafety.ts` | 712–718 |
| `SPELL_ID_CATALOG` | `src/frontend/src/data/bossKits.ts` | 29–62 |
| `SpellConfig` / `areaShape` | `src/frontend/src/types/gameTypes.ts` | 160–241 |
| `CharacterStats.evasion` | `src/frontend/src/types/gameTypes.ts` | 64 |
| `Enemy.currentView` | `src/frontend/src/types/gameTypes.ts` | 297 |
| Overworld facing write | `src/frontend/src/components/WorldExploration.tsx` | 6924–6938 |
| Summon default facing | `src/frontend/src/engine/summonSpawn.ts` | 177–178 |
| Ally targeting | `src/frontend/src/engine/targeting.ts` | 527–545 |
| Line targeting (unused by data) | `src/frontend/src/engine/targeting.ts` | 576–617 |
| Area = Chebyshev, no `areaShape` | `src/frontend/src/engine/targeting.ts` | 690–727 |
| Trap stub = barrier | `src/frontend/src/engine/spellEngine.ts` | 442–445 |
| `isSwap` flag | `src/frontend/src/engine/spellEngine.ts` | 637 |
| `isSwap` → `swapPositions` | `src/frontend/src/engine/spellEngine.ts` | 767–768 |
| Push / attract unused by casts | `src/frontend/src/engine/occupancy.ts` | 482–537 |
| AP-only cast debit | `src/frontend/src/components/WorldExploration.tsx` | 17096–17207 |
| Cooldown write in execute | `src/frontend/src/components/WorldExploration.tsx` | 17200–17203 |
| `nextSpellCooldownTurns` | `src/frontend/src/utils/challengeCompletion.ts` | 365–368 |
| MP display only | `src/frontend/src/components/SpellbookModal.tsx` | 966–977 |
| Enemy kits (owned ids) | `src/frontend/src/engine/enemyAI.ts` | 163–185 |
| Summon name fallback | `src/frontend/src/engine/enemyAI.ts` | 217–224 |
| Heal-amount healer infer | `src/frontend/src/engine/enemyAI.ts` | 447–450 |
| `buildEnemyKit(levelZone)` | `src/frontend/src/components/WorldExploration.tsx` | 11920 |
| Phase-2 multiplier apply site | `src/frontend/src/components/WorldExploration.tsx` | 15762 |
| WX size | `src/frontend/src/components/WorldExploration.tsx` | 19,213 lines |
| Backend six | `src/backend/lib/admin.mo` | 168–191 |
| Feats | `src/backend/lib/admin.mo` | 309–326 |
| Challenges | `src/frontend/src/utils/challengeCompletion.ts` | 44–109 |
| Boss ids | `src/frontend/src/types/bossTypes.ts` | 390–410 |
| OLD_SPELL_NAMES_SET | `src/frontend/src/components/WorldExploration.tsx` | 2356–2389 |

**Document status:** PROPOSED. Safe to review and implement in a later, explicit data PR after Wave-1 P0, Wave-2 / Wave-3 data, and after #342 / #371 / #411 / #463 / #480 land. Not a license to land combat code in the same change as this spec.

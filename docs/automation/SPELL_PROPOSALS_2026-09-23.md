# Spell and Tactical Mechanics — Design Pass 2026-09-23

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Days since last tactical pass:** 1 (Wave 5 is still-open #411 @ same HEAD; Wave 4 is still-open #342; Wave 3 on `main` is 2026-09-02)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1–3 on `main`; Wave 4 still-open [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-2940/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md) (#371). **No** `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` landed (Discovery Wave 5 did not ship a unique catalog on 2026-09-22).
- Tactical Wave 5 still-open [`SPELL_PROPOSALS_2026-09-22.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-7c26/docs/automation/SPELL_PROPOSALS_2026-09-22.md) (#411)
- Tactical Wave 4 still-open [`SPELL_PROPOSALS_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-f488/docs/automation/SPELL_PROPOSALS_2026-09-21.md) (#342)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); Wave 5 extra doors still-open #367; Wave 6 extra doors still-open #406
- Prior tactical passes on `main` — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) (Wave 1), [`SPELL_PROPOSALS_2026-09-01.md`](./SPELL_PROPOSALS_2026-09-01.md) (Wave 2), [`SPELL_PROPOSALS_2026-09-02.md`](./SPELL_PROPOSALS_2026-09-02.md) (Wave 3)

This is **Wave 6**. Waves 1–3 are on `main`. Waves 4–5 and Discovery Wave 4 are still paper on open PRs. This pass treats those ids as **already reserved**.

**Wave 5 explicitly deferred six holes to this pass:** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; a fifth echo id; player-owned Hex of Silence (full bar lock); independently walking two-cell occupy; cooldown **reset to 0**.

**This pass fills two of those and holds the other four:**

| Deferred hole | This pass |
| :--- | :--- |
| Independently walking two-cell occupy | **Filled:** Twin Span (`spell-twin-span`) |
| Cooldown reset to 0 | **Filled:** Cadence Break (`spell-cadence-break`) — self, last owned id on CD, once/battle. Not a steal. |
| Fourth `mpCost > 0` walk snipe | **Held.** Combined paper stays Ley Toll / Undertow / Sanguine Toll. Discovery W4 forbade a fourth. Catalog default stays `mpCost: 0`. |
| Fifth echo id | **Held.** After Verse / Stolen Verse / Echo Cast / False Echo already cover the axis. Left for Discovery. |
| Player-owned full-bar silence | **Held.** Hex of Silence stays unowned. Mute Thread already owns next-spell fizzle. |
| Mid-RAF splice of the current actor | **Held.** AGENTS.md forbids incidental turn-logic. Cut In / False Echo / Eclipse Fold consume the wrap PR. Queue Cut / Act Bell / False Cut consume the end-of-turn PR. Do not splice the current actor. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after that reserved set. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is **byte-stable in identity** since 2026-08-31: still 32 frontend ids, still six backend seeds, still no discovery persist. Twenty-one days of merges (`58302bc` → `0f5363f`, through #332) plus the 2026-09-21 / 2026-09-22 open-PR stacks did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`.

`WorldExploration.tsx` is **19,213** lines (`wc -l`). Wave 5 quoted 18,749; that count is wrong at this HEAD. The defects did not shrink.

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

`Enemy.currentView` exists (`gameTypes.ts` 297). Overworld wander writes it (`WorldExploration.tsx` 6924–6938). Battle walks and the player body still do **not** write it. Combat never reads it for damage. Wave 5 Oncoming / Facing Pin / Glance Cut own that field after a battle-walk writer exists. This pass’s About Face **inverts** stored `currentView`; it does not invent a second facing source.

`CharacterStatFields.evasion` exists (`gameTypes.ts` 64) and is persisted. Combat never reads it. This pass does **not** wire a miss %.

### 1.2 Backend admin seed — `src/backend/lib/admin.mo` `defaultSpells()`

Six ids, still **not** in `SPELL_ID_CATALOG`. They carry targeting flags. All six still have `mpCost = 0`.

| ID | Name | AP | CD | Flags | Notes |
| :--- | :--- | ---: | ---: | :--- | :--- |
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
| Spell `mpCost` debit | `executeCastAttempt` (`WorldExploration.tsx` 17096–17207) gates **AP only**. Spellbook UI can *display* MP (`SpellbookModal.tsx` 966–977). | Always 0 | Ley Toll (2); Undertow (1); Sanguine Toll (1 + HP) | **No fourth.** Every Wave-6 row is `mpCost: 0`. |
| `areaShape` cone | Typed, **unread**. Area = Chebyshev (`targeting.ts` 690–727) | Unused | Fan Bolt / Gale Fan | Unused this pass |
| `targetType: "line"` | Implemented 8-dir ray (`targeting.ts` 576–617) | **No spell** | File Lance | File Reel is **attract along a shared rank/file**, not a poke ray |
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** | Unused | Shoulder Bash, Gale Fan, Draw Together, Body Check, Hook Line, Undertow, File Slide | **File Reel** calls `applyAttract` **only** along the shared axis |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768) | Swap | Twin Guard / Pawn Trade / Ward Interpose | **Hinge Tile** is enter-swap with the **painter**, not `isSwap` |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire | Hinge Tile is not `isTrap` |
| `currentView` | Field + overworld wander writer. **Unread in combat.** | Cosmetic | Oncoming / Facing Pin / Glance Cut / Rear Cut | **About Face** inverts stored views. **Post Sting** does not read facing. |
| Initiative / queue | Wrap PR (Wave 4); end-of-turn PR (Wave 5) | Unused as a spell | Cut In / Queue Cut / False Cut / Act Bell / Eclipse Fold | **No new queue card.** Mid-RAF splice stays held. |
| Echo / replay | Absent in live combat | Absent | After Verse / Stolen Verse / Echo Cast / False Echo | **No fifth echo id.** |
| Ally reposition | Ally targeting (`targeting.ts` 528–545) | Unused for rotate | Relay Dash walk ≤ 2; File Vault teleport 3–4; Body Check shove 1 | **Hinge Step** = 90° rotate around the clicked ally |
| Silence / restrict | Absent in live | Absent | Hex of Silence = bar lock (`BOSS_ONLY`); Mute Thread = next spell fizzle | **Oath Blade** = Strike-only (other ids fizzle). **Aim Veil** = cannot be primary spell target |
| Two-cell occupy | One body, one cell | Absent | Span Guard = rigid self pair; Span Pylon = stationary 2-cell | **Twin Span** = two 1-HP posts that **walk independently** while adjacent |
| Cooldown write | `executeCastAttempt` 17200–17203 + `nextSpellCooldownTurns` (`challengeCompletion.ts` 365–368) | Inferno CD 3 | Cadence Theft −1 / +1; Cadence Brand +1 on attacker | **Cadence Break** = set remaining to **0** on last owned id. **Cadence Lend** = ally −1 |
| Hit redirect / soak | Mirror; Pain Link %; Cover Step next hit | No damage **cap** | Ward Plate absorb; Surplus / Sidestep evade | **Turn Cap** = next hit cannot exceed 12 after RES |
| Walk / unmoved gate | No live `movedThisTurn` | Absent | Still Brand punishes **target** standing; Camp Tax bonuses unmoved **hostile**; Stride Mute walk-then-fizzle | **Post Sting** bonuses if the **caster** spent 0 walk MP this turn |
| Leftover-AP payload | Absent as damage | Absent | Surplus Ward = leftover-AP **evade**; Act Tax = they act sooner | **Purse Cut** bonuses if **target** leftover AP ≥ 2. **Split Purse** moves 1 leftover AP to an ally |
| LoS-blocked poke | `lineOfSight: false` exists on backend Shadow Strike only | Unused in frontend rows | Glass Shot min-range; Far Sting distance; Pit Sight pit-on-ray | **Blind Corner** = 10, **+12 if LoS is blocked** |
| Exit tax | Glyph Tax is **enter** AP | Absent | Cast Snare is origin-tax; Low Lintel is HP%-gated walk | **Exit Tithe** = leaving the cell costs +1 AP (walk only) |
| Summon death tempo | Bomber = Inferno on death | Absent as AP grant | Blood Tithe / Convert Whelp / Spark is new | **Spark Whelp** dies → owner +1 AP if owner is current |
| Mass facing invert | Absent | Absent | Facing Pin locks **one** view | **About Face** (`NOT_PLAYER_LEARNABLE`) inverts all player-side views |

`buildEnemyKit` is still called with `currentMap.levelZone` (`WorldExploration.tsx` 11920). Non-number → `NaN` → every kit stays zone 0. `inferArchetype` still treats `healAmount > 0` as healer (`enemyAI.ts` 447–450). Summon archetype still falls back to **name** (`enemyAI.ts` 217–224: `wolf` / `golem` / `wisp`). Forbidden for new ids: Twin Span uses `summonAI: "twinspan"`; Spark Whelp uses `summonAI: "spark"`. Never parse `"Twin Span"` / `"Spark Whelp"`.

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

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` (tactical W2 **and** Discovery W2); `spell-blood-tithe` (tactical W2 pet sacrifice **versus** Discovery W2 HP→AP). Wave 6 does not add a third.

**Do not alias** Post Sting ↔ Still Brand / Planted Stance / Camp Tax; Purse Cut ↔ Spent Stride / Surplus Ward / Act Tax; Blind Corner ↔ Glass Shot / Far Sting / Pit Sight / Bias Ray / `shadow_strike`; Hinge Step ↔ Relay Dash / File Vault / Body Check / Mist Step / Vault / Morrow Step; File Reel ↔ Hook Line / Undertow / File Slide / File Lance / File Vault / Draw Together; Twin Span ↔ Span Guard / Span Pylon / Twin Guard / Twin Gate; Oath Blade ↔ Mute Thread / Hex of Silence / Quiet Hex / Goad / Taunt Oath / Oath Bind; Aim Veil ↔ Shadow Veil / Fog Hood / Haze Pane / Smoke Veil; Cadence Break ↔ Cadence Theft / Cadence Brand / Timestep; Cadence Lend ↔ Loan Tempo / Tempo Gift / AP Sip; Split Purse ↔ AP Sip / Tempo Invert / Drain Courage; Exit Tithe ↔ Glyph Tax / Ley Toll / Cast Snare / Camp Tax / Low Lintel; Hinge Tile ↔ Swap / Tripwire / Twin Gate / Pawn Trade; Spark Whelp ↔ Convert Whelp / Blood Tithe / Blood Familiar / Bomber / Last Ember; Turn Cap ↔ Ward Plate / Iron Skin / Brood Ward / Cover Step; About Face ↔ Facing Pin / Board Tilt / Rear Cut / Oncoming.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved, live, or still held) |
| :--- | :--- | :--- |
| DAMAGE caster-unmoved | Bonus iff the **caster** spent 0 walk MP this turn | Still Brand punishes the **target** standing. Camp Tax bonuses unmoved **hostile**. Planted Stance is a self buff, not a poke. |
| DAMAGE leftover-AP | Bonus iff the **target** still has ≥ 2 current AP | Surplus Ward is leftover-AP **evade**. Purse Cut is a hit. |
| DAMAGE LoS-blocked | Payload grows when Bresenham LoS is **blocked** | Glass Shot is min-range flat. Far Sting grows with Chebyshev. Pit Sight wants a pit on the ray. Shadow Strike is backend-only diagonal, no LoS, flat. |
| POSITION 90° hinge | Rotate the caster around a clicked ally | Relay Dash = walk ≤ 2 toward a cell. File Vault = teleport 3–4. Body Check = shove 1. |
| POSITION file attract | Pull 1 along a **shared rank or file only** | Hook / Leash / Undertow pull toward **caster** in any direction. File Slide is conveyor. File Lance is a poke. |
| POSITION walking pair | Two 1-HP posts walk independently while adjacent | Span Guard / Span Pylon are rigid / stationary two-cell occupy. |
| CONTROL Strike-only | Next spells that are not `physical_attack` fizzle | Mute Thread fizzles **every** next spell. Hex of Silence bricks the bar. Goad **forces target**, does not lock the bar to Strike. |
| CONTROL aim veil | Hostile spells cannot choose you as **primary** target | Shadow Veil is RES/SP. Fog / Haze / Smoke are LoS. Cover redirects a hit that already chose you. |
| CONTROL CD reset | Set remaining CD on last owned id to **0** | Cadence Theft steals 1. Timestep restores AP/MP, not CD. |
| SUPPORT ally CD −1 | Reduce an ally’s highest remaining CD by 1 | Loan Tempo / Tempo Gift grant **AP**. Cadence Theft is hostile. |
| SUPPORT share leftover AP | After paying cost, move 1 leftover AP to an adjacent ally | AP Sip is hostile zero-sum. Drain Courage debits without grant. |
| TERRAIN exit AP | Leaving the painted cell costs +1 AP (walk) | Glyph Tax is **enter**. Cast Snare is **cast-from**. Low Lintel is HP% walk gate. |
| TERRAIN enter-swap | Next enterer swaps with the **painter** | Swap is cast-time caster↔enemy. Twin Gate is a pad pair. Tripwire is hidden enter-root. |
| SUMMONS death tempo | 1-HP whelp; death grants the owner +1 AP if they are current | Bomber is Inferno. Blood Tithe is HP payload. Convert Whelp steals a dying pet. |
| DEFENSE hit cap | Next damaging hit cannot exceed 12 after RES | Ward Plate absorbs a pool. Iron Skin is RES%. Cover redirects. Evade misses. |
| POSITION mass facing invert | Invert all player-side `currentView` (signature) | Facing Pin locks one view. About Face is never owned. |
| RESOURCE fourth MP snipe | — | **Held forever** with Ley Toll / Undertow / Sanguine Toll |
| Echo of ally / fifth echo | — | Held for Discovery |
| Full-bar silence | — | Hex of Silence stays `BOSS_ONLY` |
| Mid-RAF splice | — | Held (AGENTS.md) |

**Still open after this wave (do not fill today):** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; a fifth echo id; player-owned Hex of Silence; a three-cell occupy; cooldown reset of **another combatant’s** bar to 0 (Break is **self** last-id only); forced-move that **also** writes `currentView`. Those stay Wave 7 / Discovery so this pass stays discrete.

---

## 3. Contract with Dynamic Spell Discovery

Coordinate with Discovery (`c26e5a83-…`) and Admin (`4efa22ec-…`). This pass only stamps acquisition so those layers can filter **by field**. Discovery Wave 5 did not land a unique catalog on 2026-09-22 — Wave 6 does **not** mint SDE ids. If Discovery Wave 5/6 ships the same day, those ids win on collision; this file’s tombstone is the claim.

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

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 6 ids to `starterSpells` as base. Do **not** land Wave-6 data before Wave-1 ownership split (`SDE-2026-08-31-001`), Wave-2 G resolve, Wave-3 data, Wave-4 (#342 / #371) data, or Wave-5 (#411) data.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "twinspan"` and `summonAI: "spark"` are **string enums on the config**.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Oath Blade / Aim Veil / Turn Cap **arming** (AP spent) **is** observation. Later consume is **not** a second observe.
- Hinge Step **cast** (AP spent) **is** observation, including a blocked landing fizzle after AP.
- Exit Tithe / Hinge Tile **paint** is observation. Later enter/exit ticks are not a second observe.
- Spark Whelp **summon** is observation. The later death AP grant is not a second observe.
- Cadence Break **cast** is observation even if no id was on CD (fizzle after AP).
- About Face **arm** is observation for witness-only kits. Never written to owned ids.
- Do not require “see it N times” except where a boss adaptation already does. Wave 6 defaults `allowLaterVictory: false`.
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

**Every live feat and every live challenge id is already a sole spell door.** Wave 6 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 6 does **not** invent a 16th feat.

**Live 19 first-wins are all taken (do not restamp as the only door):**  
`starborn_queen` (Cut In), `pale_archivist` (After Verse), `starved_vampire_pawn` (Sanguine Toll), `lord_of_static` (Draw Together), `final_pawn` (Eclipse Fold), `mirror_sovereign` (Echo Cast), `crimson_countess` (Crimson Pact), `void_grandmaster` (Twin Gate), `midnight_bishop` (Life Tether), `chessboard_lich` (Claim Ward), `twin_monarchs` (Choir Hymn), `alabaster_fortress` (Pain Link / Aftershock), `bone_cavalier` (Vault / Caltrop), `pale_archbishop` (Reliquary / Glyph Snare extras), `fetid_rook` (Rot Brand), `broodmother_rook` (Brood Ward), `weeping_pawn` (Mute Thread, #411), `eternal_pawn_king` (Queue Cut, #411), `enthroned_void` (File Vault MULTI child, #411). `second_lament` remains kit-only False Cut.

**Wave-5 boss extra doors (#367) — do not restamp:** `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`.

**Wave-6 boss extra doors (#406) — do not restamp:** `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`.

**New proposed extra doors for the boss designer (Wave 7 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `oath_censor` first-win | Oath Blade |
| `hinge_porter` first-win | Hinge Step MULTI child (observe+win still grants) |
| `exit_mason` first-win | Exit Tithe MULTI child |
| `about_regent` kit only | About Face (`NOT_PLAYER_LEARNABLE`) |

Piece-type observe paths (not feat doors): chargers / golems for Post Sting; scribes / queens for Purse Cut; lurkers / bishops for Blind Corner; porters / knights for Hinge Step; rooks / tide for File Reel; castellans ELITE for Twin Span; hex / pawns for Oath Blade; smoke / lurkers for Aim Veil; tempo / scribes for Cadence Break and Cadence Lend; buffers for Split Purse; masons for Exit Tithe and Hinge Tile; summoners ELITE for Spark Whelp; guardians for Turn Cap.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 key names for a different meaning.

`mpCost` stays 0 on every Wave-6 row.

**New keys (Wave 6 only):**

```text
requireCasterUnmoved, postStingBonus,              // Post Sting
requireTargetLeftoverAp, purseCutBonus,            // Purse Cut — leftover ≥ 2
requireLosBlocked, blindCornerBonus,               // Blind Corner
hingeClockwise,                                    // Hinge Step — 90° around ally
fileAxisAttractSteps,                              // File Reel — 1 along shared rank/file
twinSpanAdjacent, twinSpanWalkMp,                  // Twin Span
oathBladePhysicalOnly, oathBladeDuration,          // Oath Blade
aimVeilPrimaryOnly, aimVeilDuration,               // Aim Veil
resetLastOwnedCooldownToZero,                      // Cadence Break
lendAllyCooldownTurns,                             // Cadence Lend — 1
splitLeftoverApToAlly,                             // Split Purse — 1
exitTitheAp, exitTitheDuration,                    // Exit Tithe — 1, 2
hingeTileSwapOnEnter, hingeTileDuration,           // Hinge Tile
sparkApOnDeathIfOwnerCurrent,                      // Spark Whelp
turnCapMaxHit,                                     // Turn Cap — 12
aboutFaceInvertPlayerSide,                         // About Face
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

Conditional riders stay small so the **decision** is the power. Post Sting’s +10 is illegal if the caster already walked. Cadence Break is once/battle so Inferno does not loop. Twin Span’s two bodies are 1 HP each.

No Wave-6 card rewrites the current actor. AGENTS.md forbids incidental turn-logic and RAF edits. File Reel uses existing `applyAttract`. Hinge Step is occupancy teleport of **self** around an ally, not a queue splice.

---

## 5. Proposed spells (Wave 6)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-post-sting`

NAME: Post Sting  
ROLE: DAMAGE — bonus if the caster spent 0 walk MP this turn  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal **12**. If the caster’s walk-MP spent this turn is **0**, deal **+10** (`effectParams: {"requireCasterUnmoved":true,"postStingBonus":10}`). Reads a first-class `walkMpSpentThisTurn` (or equivalent) on the caster, not `spell.name`, not pixels. Distinct from Still Brand (bonus if the **target** did not change cell), Camp Tax (hostile unmoved), Planted Stance (self buff), Stride Brand (moved-target rider).  
DURATION: instant  
SCALING: 12 and +10 follow dmg%. Unmoved gate fixed.  
SYNERGIES: Nail Down / Root Snare the approach so you never need to walk; Rank Lock so they come to you; Aim Veil after the sting.  
COUNTERPLAY: Force them off the post (push / pull / swap) before they shoot; stay at range 4; Sidestep the 12.  
POWER_BUDGET: Standard. 22 only if they skipped the walk — Frost-like with a readable tell.  
AI_USAGE: `aiHint: "bonus_if_caster_unmoved"`. Golems / castellans zone ≥ 1. Skip the id if they already walked (use Strike).  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 8`, `discoverySources: { pieceTypes: ["rook","pawn"], levelZoneMin: 1 }`. Observe+win.  
EDGE_CASES: Missing walk-spend field **fail closed** (12 only). Forced-move onto/off the cell does **not** count as walk MP (same rule as Stride Mute). Challenge: both chunks through `recordChallengeDamageTaken`. Do not edit damage math.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — one integer on the turn actor.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-purse-cut`

NAME: Purse Cut  
ROLE: DAMAGE — bonus if the target still has leftover AP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal **10**. If the target’s **current AP ≥ 2**, deal **+12** (`effectParams: {"requireTargetLeftoverAp":2,"purseCutBonus":12}`). Does not debit their AP (AP Sip / Drain Courage own that). Distinct from Spent Stride (their **walk** debit), Surplus Ward (your leftover AP evade), Act Tax (they act sooner).  
DURATION: instant  
SCALING: 10 and +12 follow dmg%. Threshold fixed at 2.  
SYNERGIES: Cut them **before** they dump Inferno; Act Tax makes the leftover expensive; Mute Thread if they still want to cast.  
COUNTERPLAY: Spend down to 0–1 AP before the hiders reach you; Haste does not help (AP, not MP).  
POWER_BUDGET: Standard. 22 only against a loaded bar.  
AI_USAGE: `aiHint: "bonus_if_target_ap_ge_2"`. Scribes / queens. Skip if target AP ≤ 1 (use Frost).  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 7`, `discoverySources: { pieceTypes: ["bishop","queen"], levelZoneMin: 1 }`. Observe+win.  
EDGE_CASES: Missing `currentAp` fail closed (10 only). Summons use their own current AP. Challenge damage through `recordChallengeDamageTaken`.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-blind-corner`

NAME: Blind Corner  
ROLE: DAMAGE — bonus if LoS from caster to target is blocked  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 2  
EFFECT: Deal **10**. Cast is legal without LoS (`lineOfSight: false`). If the existing Bresenham LoS helper would have **failed** (wall, barrier, smoke, span body), deal **+12** (`effectParams: {"requireLosBlocked":true,"blindCornerBonus":12}`). Distinct from Glass Shot (min-range flat), Far Sting (Chebyshev scale), Pit Sight (pit on ray), Bias Ray (diagonal flags), backend `shadow_strike` (diagonal, no LoS, flat 35 — do not promote that id).  
DURATION: instant  
SCALING: 10 and +12 follow dmg%. LoS gate is the live helper, not a name table.  
SYNERGIES: Barrier / Smoke / Span / Haze Pane to **create** the block; File Reel them behind a wall.  
COUNTERPLAY: Step into open LoS so the rider dies; stay adjacent (block is rarer).  
POWER_BUDGET: Standard. 22 only around a corner.  
AI_USAGE: `aiHint: "bonus_if_los_blocked"`. Lurkers / bishops. Skip if LoS is open and Strike is better.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 8`, `discoverySources: { pieceTypes: ["bishop"], levelZoneMin: 2 }`. Observe+win.  
EDGE_CASES: Occupying bodies block LoS the same way live `hasLoS` does. Open pit does **not** block LoS (Wave 3 contract) — no +12. Challenge through `recordChallengeDamageTaken`.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — reuse LoS helper, invert the boolean.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-hinge-step`

NAME: Hinge Step  
ROLE: POSITION — 90° rotate the caster around a clicked ally  
ACQUISITION: MULTI_SOURCE  
AP_COST: 2  
RANGE: 1  
TARGET_TYPE: ally  
LOS: true  
COOLDOWN: 2  
EFFECT: Click an adjacent living ally (`targeting.ts` 528–545). Teleport the **caster** to the cell 90° **clockwise** around that ally (`effectParams: {"hingeClockwise":true}`). Landing must be in bounds, floor, unoccupied, not a portal, not a barrier, not a pit. Chebyshev from the ally stays 1. Distinct from Relay Dash (walk ≤ 2 toward a **cell**), File Vault (blink the **ally** 3–4), Body Check (shove the ally), Mist Step / Phase Slip / Vault / Morrow Step (self blink without a pivot).  
DURATION: instant  
SCALING: none. Distance is always the 90° adjacent.  
SYNERGIES: Cover Step the pivot after you swing; Glance Cut from the new front cell; Open Pit the vacated cell.  
COUNTERPLAY: Occupy the clockwise cell; Nail Down the caster (fizzle); kill the pivot.  
POWER_BUDGET: Cheap tool. 2 AP to rewrite two files.  
AI_USAGE: `aiHint: "rotate_around_ally_clockwise"`. Porters / knights with a living ally. Skip if landing illegal.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 7`. MULTI: observe+win (`pieceTypes: ["knight"]`, `levelZoneMin: 1`) **or** first victory vs proposed `hinge_porter`. First child wins. Observation **false** on the boss child.  
EDGE_CASES: Player body is a legal pivot when an enemy casts this (the player is not `isSummon`). Enemy AI must pass a living allied body, not the player, unless the kit is explicitly peel. Counterclockwise is **not** implemented — missing `hingeClockwise` fail closed (fizzle, AP spent). Forced-move does not write facing.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy teleport of self. Not RAF.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-file-reel`

NAME: File Reel  
ROLE: POSITION — pull 1 along a shared rank or file  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Legal only if the target shares the caster’s **rank or file** (not a diagonal). Pull **1** toward the caster along that axis via `applyAttract` (`effectParams: {"fileAxisAttractSteps":1}`). If the step is blocked, they stay (attract already fail-closes). Distinct from Hook Line / Leash / Undertow (any-direction pull to caster), Draw Together (pair toward each other), File Slide (conveyor), File Lance (ray poke), File Vault (ally blink).  
DURATION: instant  
SCALING: none.  
SYNERGIES: Open Pit / Exit Tithe / Cinder on the landing; Oncoming after they face you; Rank Lock so they cannot step off the file.  
COUNTERPLAY: Stand on a diagonal; Barrier the step; Grounded Lock / Nail Down.  
POWER_BUDGET: Standard control, 0 damage.  
AI_USAGE: `aiHint: "attract_one_along_shared_file"`. Rooks / tide. Skip if not aligned or step blocked into a worse tile than stay.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 8`, `discoverySources: { pieceTypes: ["rook"], levelZoneMin: 1 }`. Observe+win.  
EDGE_CASES: Diagonal share is illegal (not a fizzle after AP — targeting rejects). Attract does not write `currentView`. Challenge: movement is not HP; landing on lava uses existing hazard recorders.  
IMPLEMENTATION_COMPLEXITY: LOW — first cast caller of `applyAttract` on one axis.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-twin-span`

NAME: Twin Span  
ROLE: SUMMONS — two 1-HP posts that walk independently while adjacent  
ACQUISITION: ELITE  
AP_COST: 4  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: Click a free cell Chebyshev 1 from the caster. Spawn **two** 1-HP stationary-looking posts: one on a free cell adjacent to the caster, one on the clicked cell. They must be Chebyshev **1** from each other at spawn. `summonAI: "twinspan"`. Each has **1 MP**, **0 AP**, `twinSpanWalkMp: 1`. After any walk (theirs or a forced-move resolution), if Chebyshev between them is **> 1**, the post **farther from the owner** dies immediately (no Bomber Inferno). They block walk **and** LoS like Span Guard’s second cell. Distinct from Span Guard (one id, rigid pair, caster occupies both), Span Pylon (stationary 2-cell summon, no independent walk), Twin Guard (two-ally swap).  
DURATION: lifespan 3  
SCALING: HP 1 each. No dmg%. `summonUnitDef.level` ≤ 99. `hpScale` in 0–10.  
SYNERGIES: Plug a file then walk one cell to re-aim the plug; Low Lintel the gap; Cover Step behind the pair.  
COUNTERPLAY: Push one off adjacency (farther dies); AoE both (1 HP); File Vault over them.  
POWER_BUDGET: Heavy. Two bodies for 4 AP, each is a paper wall.  
AI_USAGE: `aiHint: "spawn_adjacent_walkable_pair"`. Castellan ELITE / CHAMPION. Skip if two adjacent free cells do not exist.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 5`, elite/champion tag. Observe+win.  
EDGE_CASES: Fourth player summon still rejected if the live cap is 3 — this id **counts as two** toward the cap (if placing the second would exceed, fizzle both, AP spent). `summonAI: "twinspan"` is an enum; **never** parse the name. Name-fallback in `inferSummonArchetype` must not treat `"span"` as wolf. Forced-move that keeps adjacency is legal. Portal tiles illegal.  
IMPLEMENTATION_COMPLEXITY: HIGH — dual occupancy + adjacency invariant. New helpers; do not grow WX.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-oath-blade`

NAME: Oath Blade  
ROLE: CONTROL — next spells that are not Strike fizzle  
ACQUISITION: BOSS  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: Brand the target for **1** of their turns (`effectParams: {"oathBladePhysicalOnly":true,"oathBladeDuration":1}`). While branded, any spell they resolve whose id is **not** `physical_attack` fizzles (AP spent, cooldown does **not** start — same as live fizzle). Strike / Attack Nearest / sprite-click Strike still resolve. Distinct from Mute Thread (every next spell fizzles), Hex of Silence (bar locked, `BOSS_ONLY`), Quiet Hex / Hex Toll (AP tax), Goad / Taunt Oath (forced **target**, not forced **id**), Oath Bind (Wave 1 Discovery — different verb). Gate is `spell.id === "physical_attack"`, never `spell.name === "Strike"`.  
DURATION: 1 of their turns  
SCALING: none.  
SYNERGIES: Purse Cut while they still hold AP they cannot spend on Inferno; Post Sting if they walk in to Strike; Cover Step the Strike.  
COUNTERPLAY: Just Strike; Dispel Thread / Absolve if those land; wait the turn.  
POWER_BUDGET: Standard control. They still act.  
AI_USAGE: `aiHint: "brand_physical_only"`. Proposed `oath_censor`. Skip if target AP < 3 (they were going to Strike anyway).  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`. `acquisitionModel: "BOSS"`, `bossIds: ["oath_censor"]` (proposed Wave-7 extra door). Observation **false** on first-win. Kit may demonstrate.  
EDGE_CASES: Summon kit casts honor the brand (id gate). Timestep is not Strike — fizzles. Sacrifice fizzles. Do not lock the HUD bar (that is Hex of Silence).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — consume gate on spell resolve, beside Mute Thread.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-aim-veil`

NAME: Aim Veil  
ROLE: CONTROL — hostile spells cannot choose you as primary target  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: For **1** round (`effectParams: {"aimVeilPrimaryOnly":true,"aimVeilDuration":1}`), hostile spells whose `targetType` is `enemy` / `self` directed at you **reject the tile** (`aim_veil_primary`). AoE / line / chain that includes your cell **still hits** you. Strike still hits. Distinct from Shadow Veil (RES/SP), Fog Hood / Haze Pane / Smoke (LoS), Cover Step (redirect a hit that already chose you), Mirror (reflect).  
DURATION: 1 round  
SCALING: none.  
SYNERGIES: Blind Corner from behind the veil; Twin Span as the AoE bait; Oath Blade so they must Strike into Cover.  
COUNTERPLAY: AoE / Frost Nova / chain; walk adjacent and Strike; wait the round.  
POWER_BUDGET: Standard. Not untargetable.  
AI_USAGE: `aiHint: "self_if_likely_primary_target"`. Lurkers / smoke. Skip if already veiled or the player is out of all hostile ranges.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 7`, `discoverySources: { pieceTypes: ["bishop","pawn"], levelZoneMin: 2 }`. Observe+win.  
EDGE_CASES: Attack Nearest that would pick you must skip to the next legal hostile. Bait Pylon intercept still runs if they aimed at the owner and the pylon eats it — veil does not apply to the pylon. Do not edit damage math.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — targeting reject + Attack Nearest skip.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-break`

NAME: Cadence Break  
ROLE: CONTROL — set remaining cooldown on your last owned id to 0  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 0  
EFFECT: Once per battle. Sets remaining CD to **0** on the last **owned** spell id you successfully resolved this battle that currently has remaining CD > 0 (`effectParams: {"resetLastOwnedCooldownToZero":true}`). Cannot reset this id, `spell-timestep`, `spell-sacrifice`, any `isSummon` id. If none qualify, fizzle (AP spent). Distinct from Cadence Theft (hostile −1 / you −1), Cadence Brand (+1 on attacker), Timestep (full AP/MP, not CD), Loan Tempo (AP grant). Does **not** write `spellLevelKeys`.  
DURATION: instant; once/battle  
SCALING: none.  
SYNERGIES: Inferno then Break then Inferno; Gale Fan twice; do **not** pair with After Verse (echo denylist still excludes verse-of-verse — Break is CD, not echo).  
COUNTERPLAY: Cadence Brand the Inferno so even a reset starts from a later write; Mute the second Inferno; kill them on the 4 AP dump.  
POWER_BUDGET: Heavy. The once/battle flag is the budget.  
AI_USAGE: `aiHint: "reset_last_owned_cooldown_if_gt_0"`. Tempo scribes. Skip if no owned id on CD.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 6`, `discoverySources: { pieceTypes: ["bishop","queen"], levelZoneMin: 2 }`. Observe+win.  
EDGE_CASES: Fizzle after AP **is** observation. Once/battle is a combatant flag, not a spell CD (CD field stays 0 so the once-flag is the lock). Enemy kits only reset ids they actually resolved.  
IMPLEMENTATION_COMPLEXITY: LOW — cooldown map write by id.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-lend`

NAME: Cadence Lend  
ROLE: SUPPORT — reduce an ally’s highest remaining cooldown by 1  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: true  
COOLDOWN: 2  
EFFECT: Find the ally’s spell id with the **highest** remaining CD > 0; subtract **1** (min 0) (`effectParams: {"lendAllyCooldownTurns":1}`). Ties: lowest id lexicographically. If none on CD, fizzle (AP spent). Distinct from Loan Tempo / Tempo Gift (grant **AP**), Cadence Theft (hostile), Cadence Break (self reset to 0).  
DURATION: instant  
SCALING: none.  
SYNERGIES: Lend Inferno on a Wisp’s empty kit — only if that ally actually has a CD; more often lend a Sentinel’s Iron Skin CD.  
COUNTERPLAY: Kill the ally; Dispel is not CD.  
POWER_BUDGET: Cheap tool.  
AI_USAGE: `aiHint: "ally_highest_cd_minus_1"`. Buffers. Skip if no ally on CD.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 7`, `discoverySources: { pieceTypes: ["bishop"], levelZoneMin: 1 }`. Observe+win.  
EDGE_CASES: Player targeting an allied summon is the live ally branch. Cannot lend to self (use Break). Does not write spell levels.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-split-purse`

NAME: Split Purse  
ROLE: SUPPORT — after paying cost, move 1 leftover AP to an adjacent ally  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 1  
TARGET_TYPE: ally  
LOS: true  
COOLDOWN: 1  
EFFECT: After the live AP debit, if the caster’s remaining current AP ≥ 1, move **1** AP to the clicked adjacent ally this turn (`effectParams: {"splitLeftoverApToAlly":1}`), capped at the ally’s max AP. If leftover is 0, the spell still resolves (buff chrome) but transfers **0**. Distinct from AP Sip (hostile zero-sum), Drain Courage (debit without grant), Tempo Invert (swap leftover AP/MP).  
DURATION: instant (this turn’s AP only)  
SCALING: none.  
SYNERGIES: Leave 1 AP on purpose; Queue Cut that ally next; Cadence Lend after they recast.  
COUNTERPLAY: Drain Courage the caster before they lend; kill the ally.  
POWER_BUDGET: Cheap tool. The decision is “do I dump my bar first.”  
AI_USAGE: `aiHint: "give_one_leftover_ap_to_adjacent_ally"`. Buffers with leftover ≥ 1 after a 2-cost. Skip if leftover would be 0.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 7`, `discoverySources: { pieceTypes: ["king","bishop"], levelZoneMin: 1 }`. Observe+win.  
EDGE_CASES: Challenge AP spend records the **2**, not the transferred 1 (the ally spends it later through their own gate). Cannot target a hostile.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — post-debit leftover read.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-exit-tithe`

NAME: Exit Tithe  
ROLE: TERRAIN — leaving the painted cell costs +1 AP (walk)  
ACQUISITION: MULTI_SOURCE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: Paint a free cell for **2** turns (`effectParams: {"exitTitheAp":1,"exitTitheDuration":2}`). A voluntary **walk** that **leaves** the cell costs +1 AP (in addition to the MP step). If they have 0 AP, the walk is illegal. Forced-move (push / pull / swap / blink / hinge) **exits free**. Distinct from Glyph Tax (**enter** AP), Cast Snare (cast-from), Ley Toll (`mpCost` amp), Camp Tax (unmoved bonus), Low Lintel (HP% walk gate).  
DURATION: 2 turns  
SCALING: tax fixed at 1 AP.  
SYNERGIES: File Reel them onto it; Rank Lock so walk-off is the only escape; Post Sting while they camp.  
COUNTERPLAY: Forced-move off; stay and cast; never enter.  
POWER_BUDGET: Cheap terrain.  
AI_USAGE: `aiHint: "paint_exit_ap_on_escape_cell"`. Masons. Skip if the cell is not on the player’s likely walk-off.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`. MULTI: observe+win (`pieceTypes: ["rook"], levelZoneMin: 2`) **or** first victory vs proposed `exit_mason`. First child wins.  
EDGE_CASES: Paint is observation; later exits are not. Do not edit map generation. Challenge: the extra AP is `recordChallengeApSpend` on the walker if they are the player.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy predicate on walk, not forced-move.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-hinge-tile`

NAME: Hinge Tile  
ROLE: TERRAIN — next enterer swaps with the painter  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: Paint a free cell for **2** turns (`effectParams: {"hingeTileSwapOnEnter":true,"hingeTileDuration":2}`). The next unit that **enters** (walk or forced-move) swaps with the **painter** if the painter is alive and the painter’s cell is a legal landing for the enterer (and vice versa). Then the tile expires. If the painter is dead, the tile fades on enter with **no** swap. Distinct from Swap (`isSwap` caster↔enemy at cast time), Twin Gate (pad pair), Pawn Trade (two hostiles, caster stays), Tripwire (hidden enter-root), Twin Guard (two allies). Does **not** set `isSwap`.  
DURATION: 2 turns or until one swap  
SCALING: none.  
SYNERGIES: Paint on a fuse / pit approach; Cover Step after you arrive; Aim Veil the body they wanted.  
COUNTERPLAY: Do not enter; kill the painter first; Nail Down the painter (swap fizzles, tile expires, enterer stays — AP/MP for the step already spent).  
POWER_BUDGET: Standard trick terrain.  
AI_USAGE: `aiHint: "paint_enter_swap_with_self"`. Glyph sowers. Skip if painter is already adjacent to the player (Swap is cheaper).  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 6`, `discoverySources: { pieceTypes: ["bishop","pawn"], levelZoneMin: 2 }`. Observe+win.  
EDGE_CASES: Paint is observation; the swap tick is not. Grounded Lock / Claim Ward on either cell: swap illegal, enterer stays, tile expires. Challenge: swap is movement, not HP.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — enter trigger + `swapPositions` of painter↔enterer.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-spark-whelp`

NAME: Spark Whelp  
ROLE: SUMMONS — 1-HP whelp; death grants the owner +1 AP if they are current  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: Spawn a 1-HP, lifespan **1**, kit `{ physical_attack }` pawn (`summonAI: "spark"`, `effectParams: {"sparkApOnDeathIfOwnerCurrent":true}`). On death **from any cause**, if the owner is the **current** turn actor, the owner gains **+1** current AP (capped at max). If the owner is not current, the +1 is **lost**. Distinct from Bomber (Inferno on death), Blood Tithe (HP payload), Convert Whelp (steal a dying pet), Blood Familiar, Last Ember (low-HP next physical).  
DURATION: lifespan 1  
SCALING: HP 1. AP grant fixed. `summonUnitDef.level` ≤ 99.  
SYNERGIES: Detonate on your turn (Sacrifice it / walk it onto lava / let it Strike and die); Split Purse after the +1; Cadence Break the follow-up.  
COUNTERPLAY: Kill it on **their** turn so the AP is lost; Aim Veil so it cannot be the primary nuke target — Strike still works.  
POWER_BUDGET: Cheap summon. The lost-grant is the counterplay.  
AI_USAGE: `aiHint: "spawn_spark_if_owner_current_next"`. Summoner ELITE. Skip if a fourth summon would exceed the cap.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 5`, elite/champion. Observe+win.  
EDGE_CASES: Summon **cast** is observation; death grant is not. Player-side death does not enter `applyRewards` (`countsTowardKillRewards`). `summonAI: "spark"` is an enum — **never** parse `"Spark Whelp"`. Challenge: the +1 AP is not an AP **spend**. Self-detonate onto lava: `recordInBattleChallengeDamage` if treated as environmental.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — death hook + current-actor test.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-turn-cap`

NAME: Turn Cap  
ROLE: DEFENSE — next damaging hit cannot exceed 12 after RES  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Arm one charge (`effectParams: {"turnCapMaxHit":12}`). The next damaging hit that would apply to you, **after** RES / SR / existing modifiers, is `min(applied, 12)`. Then consume. Expires at end of your next turn if unused. Distinct from Ward Plate (absorb pool), Iron Skin / Shield (RES%), Brood Ward (RES while a summon lives), Cover Step (redirect), Sidestep / Surplus (miss), Mirror (reflect). Cap is **not** a new identity in `combatMath.ts` — clamp the already-computed applied hit on the consume path.  
DURATION: until consumed or end of next turn  
SCALING: cap fixed at 12.  
SYNERGIES: Arm into Inferno / Void-class nukes; Cover the overflow by not being the target; Aim Veil so only Strike (10) comes through.  
COUNTERPLAY: Two small hits (Poison then Strike); Dispel the arm; wait the expiry.  
POWER_BUDGET: Standard. 12 is Strike-like; it does not beat a 10.  
AI_USAGE: `aiHint: "self_if_next_hit_would_exceed_12"`. Guardians. Skip if the likely next hit is already ≤ 12.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 7`, `discoverySources: { pieceTypes: ["rook","king"], levelZoneMin: 1 }`. Observe+win.  
EDGE_CASES: DoT ticks are damaging hits — a 4-tick does **not** consume unless a single tick would exceed 12 (they won’t). Multi-hit Nova: each target’s apply is separate; only the hit on **you** consumes. Challenge HP loss uses the **capped** amount through `recordChallengeDamageTaken`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — consume on the existing hit pipeline, not inside `dealDamage` math.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-about-face`

NAME: About Face  
ROLE: POSITION — invert all player-side `currentView` (signature)  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: Invert `currentView` on every living **player-side** body (player + player summons): `front`↔`back`, `left`↔`right` (`effectParams: {"aboutFaceInvertPlayerSide":true}`). Does not move anyone. Distinct from Facing Pin (lock **one** view to a literal), Board Tilt (mass shove), Rear Cut / Oncoming (read facing, do not write all). `usableByPlayer: false`. Never written to `ownedSpellIds`.  
DURATION: instant (views persist until the next walk writer)  
SCALING: none.  
SYNERGIES: Boss kit with Oncoming / Glance Cut after the invert; Facing Pin one body so invert does not take it (Pin wins — pinned views skip invert).  
COUNTERPLAY: Walk one step to rewrite your own view; Facing Pin yourself if a later player-owned pin exists (Wave 5 Pin is enemy-targeted).  
POWER_BUDGET: Signature. Kit-only.  
AI_USAGE: `aiHint: "invert_player_side_facing_if_oncoming_ready"`. Proposed `about_regent` only. Skip if player-side `currentView` is missing (fail closed, no invert).  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. Witness-only. Optional dim `UNKNOWN TECHNIQUE` log.  
EDGE_CASES: Prerequisite facing writer (Wave 5 §7.2) still required. Missing views skip that body, do not abort the whole cast. Forced-move still does not write facing. Never a recap grant.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — field write, no RAF.  
STATUS: PROPOSED

---

## 6. Combination mechanics (statuses × position × terrain × spells)

| Pair | What the player decides | Fail closed |
| :--- | :--- | :--- |
| Post Sting × Exit Tithe | Camp the tax cell and shoot | Walking off to kite drops the +10 |
| Purse Cut × Oath Blade | Brand then cut the loaded bar they cannot spend | AP ≤ 1 → 10 only |
| Blind Corner × Twin Span | Plug LoS, then shoot the +12 | Open pit does not block LoS |
| Hinge Step × Cover Step | Swing behind the pivot, then redirect | Occupied clockwise cell fizzles Hinge |
| File Reel × Exit Tithe | Pull them onto the tax | Diagonal share is illegal |
| Twin Span × File Lance | Two-cell plug that can **walk** the plug | Adjacency break kills the farther post |
| Oath Blade × Aim Veil | They must Strike, and they cannot spell-aim you | AoE still hits the veil |
| Cadence Break × Cadence Lend | Reset yours, shave an ally | Break once/battle; Lend fizzles if no CD |
| Split Purse × Spark Whelp | Transfer 1, then detonate +1 on your turn | Spark death on **their** turn loses the AP |
| Hinge Tile × Swap | Paint, or just Swap now | Dead painter = enter is free |
| Turn Cap × Cover Step | Cap the hit **or** redirect it — Cover does not cap the ally | Cover consume: you were not hit, cap stays |
| About Face × Oncoming (#411) | Invert then 22 | Missing `currentView` fail closed |
| Cadence Break × Inferno | Second Inferno the same fight | Brand +1 CD still applies after the reset if Brand consumes later |
| File Reel × Nail Down | Pull fails closed, they stay | AP spent, observe File Reel |

Do not implement a name table for any pair. Each card’s `effectParams` keys compose.

---

## 7. Implementation notes (for a later, explicit implementation PR)

1. **No new `mpCost > 0`.** Ley Toll / Undertow / Sanguine Toll remain the only paper spenders.  
2. **Battle facing writer** remains Wave 5’s prerequisite (walk steps set `currentView` with WX 6928–6931). About Face inverts that field. Forced-move does not write facing.  
3. **No new queue / wrap / mid-RAF card.** Do not splice the current actor. Do not reuse the Wave-4 wrap PR or the Wave-5 end-of-turn PR.  
4. **Oath Blade** gates on `spell.id === "physical_attack"`. Never `spell.name`.  
5. **File Reel** is the first production caller of `applyAttract` along one axis. Do not invent a second attract helper.  
6. **Twin Span / Spark** use `summonAI` enums `"twinspan"` / `"spark"`. Twin Span counts as **two** toward the summon cap.  
7. **Cadence Break / Lend** read cooldown maps by id. Do not write spell levels.  
8. **Turn Cap** clamps the already-computed applied hit. Do not edit `combatMath.ts`.  
9. **Exit Tithe** is an occupancy predicate on **walk**. Do not edit map generation.  
10. Recap grant uses the reward funnel + `commitSpellDiscoveries` / `unlockOwnedSpell`, not `updateCharacter`.  
11. Do not append these ids to `starterSpells` as `isBaseSpell`. Add to `SPELL_ID_CATALOG` **only when implemented**, together with `spellData.ts` and kits.  
12. Extract helpers. Do not grow `WorldExploration.tsx` (19,213 lines).

---

## 8. Explicit non-goals this pass

- No production TypeScript / Motoko / Candid edits.  
- No new damage formula, crit, or RES/SR identity.  
- No fourth `mpCost > 0` walk-positioning snipe.  
- No fifth echo id (Stolen Verse / After Verse / Echo Cast / False Echo already cover the axis).  
- No player-owned Hex of Silence (full bar lock).  
- No mid-RAF splice of the current actor.  
- No restamp of any feat or `easy_*` / `hard_*` / `legendary_*` challenge door.  
- No restamp of Wave-5 boss extra doors (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`).  
- No restamp of Wave-6 boss extra doors (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`).  
- No restamp of any live 19 first-win.  
- No wiring of `CharacterStatFields.evasion` as a percent.  
- No clone of Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Veil, Mirror / Reflect.  
- No 12-AP Void Collapse clone.  
- No third File Lance / Blood Tithe.  
- No SDE Wave-5 ids (that catalog did not land 2026-09-22; do not mint them here).

---

## 9. Proposal index

| ID | Acquisition | Complexity | Primary hole filled |
| :--- | :--- | :--- | :--- |
| `spell-post-sting` | ENEMY_DISCOVERY | LOW–MEDIUM | Caster-unmoved damage bonus |
| `spell-purse-cut` | ENEMY_DISCOVERY | LOW | Leftover-AP damage bonus |
| `spell-blind-corner` | ENEMY_DISCOVERY | LOW–MEDIUM | LoS-blocked damage bonus |
| `spell-hinge-step` | MULTI_SOURCE | MEDIUM | 90° rotate around ally |
| `spell-file-reel` | ENEMY_DISCOVERY | LOW | Attract 1 along shared file |
| `spell-twin-span` | ELITE | HIGH | Independently walking two-cell occupy |
| `spell-oath-blade` | BOSS | MEDIUM | Strike-only brand (not full silence) |
| `spell-aim-veil` | ENEMY_DISCOVERY | MEDIUM | Cannot be primary spell target |
| `spell-cadence-break` | ENEMY_DISCOVERY | LOW | Cooldown reset to 0 (self, last id) |
| `spell-cadence-lend` | ENEMY_DISCOVERY | LOW | Ally cooldown −1 |
| `spell-split-purse` | ENEMY_DISCOVERY | LOW–MEDIUM | Share 1 leftover AP |
| `spell-exit-tithe` | MULTI_SOURCE | MEDIUM | Walk-exit AP tax |
| `spell-hinge-tile` | ENEMY_DISCOVERY | MEDIUM | Enter-swap with painter |
| `spell-spark-whelp` | ELITE | MEDIUM | Death grants owner +1 AP if current |
| `spell-turn-cap` | ENEMY_DISCOVERY | MEDIUM | Next hit capped at 12 |
| `spell-about-face` | NOT_PLAYER_LEARNABLE | LOW–MEDIUM | Invert all player-side facing |

All STATUS: **PROPOSED**.

**Held, not filled:** mid-RAF splice; fourth `mpCost > 0` walk snipe; fifth echo id; player-owned Hex of Silence.

---

## 10. Source map (read-back)

| Topic | File | Lines |
| :--- | :--- | :--- |
| Live 32-id catalog | `src/frontend/src/data/spellData.ts` | 9–691 |
| Forced `isBaseSpell` | `src/frontend/src/components/WorldExploration.tsx` | 2395–2408 |
| Owned union | `src/frontend/src/components/WorldExploration.tsx` | 2410–2424 |
| Backend library filter | `src/frontend/src/utils/adminSafety.ts` | 712–718 |
| `SPELL_ID_CATALOG` | `src/frontend/src/data/bossKits.ts` | 29–62 |
| `SpellConfig` / `areaShape` | `src/frontend/src/types/gameTypes.ts` | 160–241 |
| `CharacterStatFields.evasion` | `src/frontend/src/types/gameTypes.ts` | 64 |
| `Enemy.currentView` | `src/frontend/src/types/gameTypes.ts` | 297 |
| Overworld facing write | `src/frontend/src/components/WorldExploration.tsx` | 6924–6938 |
| Summon default facing | `src/frontend/src/engine/summonSpawn.ts` | 177–178 |
| Ally targeting | `src/frontend/src/engine/targeting.ts` | 528–545 |
| Line targeting (unused by data) | `src/frontend/src/engine/targeting.ts` | 576–617 |
| Area = Chebyshev, no `areaShape` | `src/frontend/src/engine/targeting.ts` | 690–727 |
| Trap stub = barrier | `src/frontend/src/engine/spellEngine.ts` | 442–445 |
| `isSwap` flag | `src/frontend/src/engine/spellEngine.ts` | 637 |
| Push / attract unused by casts | `src/frontend/src/engine/occupancy.ts` | 482–537 |
| AP-only cast debit | `src/frontend/src/components/WorldExploration.tsx` | 17096–17207 |
| Cooldown write in execute | `src/frontend/src/components/WorldExploration.tsx` | 17200–17203 |
| `nextSpellCooldownTurns` | `src/frontend/src/utils/challengeCompletion.ts` | 365–368 |
| MP display only | `src/frontend/src/components/SpellbookModal.tsx` | 966–977 |
| Enemy kits (owned ids) | `src/frontend/src/engine/enemyAI.ts` | 163–185 |
| Summon name fallback | `src/frontend/src/engine/enemyAI.ts` | 217–224 |
| Heal-amount healer infer | `src/frontend/src/engine/enemyAI.ts` | 447–450 |
| `buildEnemyKit(levelZone)` | `src/frontend/src/components/WorldExploration.tsx` | 11920 |
| WX size | `src/frontend/src/components/WorldExploration.tsx` | 19,213 lines |
| Backend six | `src/backend/lib/admin.mo` | 168–191 |
| Feats | `src/backend/lib/admin.mo` | 309–326 |
| Challenges | `src/frontend/src/utils/challengeCompletion.ts` | 44–109 |
| Boss ids | `src/frontend/src/types/bossTypes.ts` | 390–410 |
| OLD_SPELL_NAMES_SET | `src/frontend/src/components/WorldExploration.tsx` | 2356–2389 |

**Document status:** PROPOSED. Safe to review and implement in a later, explicit data PR after Wave-1 P0, Wave-2 / Wave-3 data, and after #342 / #371 / #411 land. Not a license to land combat code in the same change as this spec.

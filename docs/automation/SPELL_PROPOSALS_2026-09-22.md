# Spell and Tactical Mechanics — Design Pass 2026-09-22

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Days since last tactical pass:** 1 (Wave 4 is still-open #342 @ same HEAD; Wave 3 on `main` is 2026-09-02)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1–3 on `main`; Wave 4 still-open [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-2940/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md) (#371)
- Tactical Wave 4 still-open [`SPELL_PROPOSALS_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-f488/docs/automation/SPELL_PROPOSALS_2026-09-21.md) (#342)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); Wave 5 extra doors still-open #367
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) (Wave 1), [`SPELL_PROPOSALS_2026-09-01.md`](./SPELL_PROPOSALS_2026-09-01.md) (Wave 2), [`SPELL_PROPOSALS_2026-09-02.md`](./SPELL_PROPOSALS_2026-09-02.md) (Wave 3)

This is **Wave 5**. Wave 1–3 are on `main`. Wave 4 (#342) and Discovery Wave 4 (#371) are still paper on open PRs. This pass treats those ids as **already reserved**.

**Wave 4 explicitly deferred six holes to this pass:** mid-turn `turnOrder` splice; fourth walk-MP snipe; sprite-facing damage; copy the enemy’s last spell; player-owned silence; ally dash to a clicked cell.

**Discovery Wave 4 already filled two of those and forbade a third:**
- Copy the enemy’s last id = `spell-stolen-verse` (#371). **Stamp, do not clone.**
- Ally walk toward a cell = `spell-relay-dash` (#371, **max 2 walk steps**). **Stamp, do not clone.**
- Combined paper `mpCost > 0` rows stay Ley Toll (2), Undertow (1), Sanguine Toll (1 + HP). **Do not add a fourth walk-MP snipe.** Catalog default stays `mpCost: 0`.

**Discovery Wave 4 leftover this pass honors:** mid-turn splice during the current actor is **held** (Cut In / False Echo already consume the wrap PR; AGENTS.md forbids incidental turn-logic). This pass specs an **end-of-current-turn insert** (after the current actor fully ends), not a mid-RAF splice. Sprite-facing, player-owned silence, ally **teleport** beyond Relay Dash’s 2 walk steps, two-cell occupy, and cooldown steal remain empty.

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after that reserved set. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is **byte-stable in identity** since 2026-08-31: still 32 frontend ids, still six backend seeds, still no discovery persist. Twenty days of merges (`58302bc` → `0f5363f`, through #332) plus the 2026-09-21 open-PR stack did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. `WorldExploration.tsx` shrank (Wave 4 quoted 19,213 → **18,749**); the defects did not.

### 1.1 Frontend runtime catalog — `src/frontend/src/data/spellData.ts`

`SPELL_ID_CATALOG` (`src/frontend/src/data/bossKits.ts` 29–62) still lists **32** ids. `WorldExploration.tsx` 2395–2408 still maps **every** `starterSpells` row to `isBaseSpell: true` (“always shown, never removable”).

`ownedSpells` (2410–2439) still unions those 32 with backend rows that pass `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718). That helper only drops `usableByPlayer === false` unless the id is already owned. It does **not** create a discovery path.

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

`Enemy.currentView` exists (`gameTypes.ts` 297: `"front" | "back" | "left" | "right"`). Overworld wander writes it (`WorldExploration.tsx` 6924–6938: +x → `right`, −x → `left`, +y → `front`, −y → `back`). Battle walks and the player body do **not** write it. Summons spawn `"front"` (`summonSpawn.ts` 177–178). Combat never reads `currentView` for damage. Rear Cut (#371 / SDE W2) owns **last-walk-vector** “not front-orthogonal.” This pass’s facing cards read the **`currentView` field** after a battle-walk writer exists. They do **not** parse sprite pixels or `spell.name`.

`CharacterStatFields.evasion` exists (`gameTypes.ts` 64) and is persisted. Combat never reads it. Sidestep / Surplus Ward remain `evadeNextHits`. This pass does **not** wire a miss %.

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
| Spell `mpCost` debit | `executeCastAttempt` (`WorldExploration.tsx` 17096–17207) gates **AP only**. Spellbook UI can *display* MP (`SpellbookModal.tsx` 966–977). | Always 0 | Ley Toll (2); Undertow (1); Sanguine Toll (1 + HP) | **No fourth.** Every Wave-5 row is `mpCost: 0`. |
| `areaShape` cone | Typed, **unread**. Area = Chebyshev (`targeting.ts` 690–727) | Unused | Fan Bolt / Gale Fan | Unused this pass |
| `targetType: "line"` | Implemented 8-dir ray (`targeting.ts` 576–617) | **No spell** | File Lance | Unused this pass |
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** | Unused | Shoulder Bash, Gale Fan, Draw Together, Body Check, Relay Dash landings | File Vault is a **teleport**, not a push. Span pair **translates** through occupancy, not `applyPushback`. |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768) | Swap | Twin Guard / Pawn Trade / Ward Interpose | Unused this pass |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire | Unused this pass |
| `currentView` | Field + overworld wander writer. **Unread in combat.** Battle walk does not write. Player has no battle facing. | Cosmetic | Rear Cut = last-walk-vector, not this field | **Oncoming / Facing Pin / Glance Cut** |
| Initiative wrap | Turn order built at battle start | Unused as a spell | Cut In / False Echo / Eclipse Fold = **round wrap only** | **Queue Cut / Act Bell / False Cut** = **end-of-current-turn** hook, not wrap, not mid-RAF |
| Echo / replay | Absent in live combat | Absent | After Verse = **your** last this turn; Stolen Verse = **hostile** last this battle; Echo Cast = prime **your next**; False Echo = copy player at wrap | Stamp Stolen Verse. Do not add a fifth echo id. |
| Ally reposition | Ally targeting exists (`targeting.ts` 528–545) | Unused for dash | Body Check = 1-tile shove; Relay Dash = walk **max 2** toward a cell; Leash Hook = pull to caster | **File Vault** = teleport Chebyshev **3–4** |
| Silence | Absent | Absent | Hex of Silence = `BOSS_ONLY` (bricks the bar). Ward Cell = **tile** primary-target fizzle. Quiet Hex / Hex Toll = next-cast **AP tax** | **Mute Thread** (next spell fizzle); **Stride Mute** (walk-then-fizzle) |
| Two-cell occupy | One body, one cell | Absent | Barrier = empty wall; Nail Down = no walk + immune displace | **Span Guard** (self pair); **Span Pylon** (2-cell summon) |
| Cooldown write | `executeCastAttempt` 17200–17203 writes the caster’s own id | Inferno CD 3 | No steal / no brand | **Cadence Theft** / **Cadence Brand** |
| Hit redirect | Mirror reflects; Pain Link shares %; Life Tether shared pool | No “ally eats the next hit” | Cover is empty | **Cover Step** |

`buildEnemyKit` is still called with `currentMap.levelZone` (`WorldExploration.tsx` 11920). Discovery already recorded that a non-number → `NaN` → every kit stays zone 0. `inferArchetype` still treats `healAmount > 0` as healer (`enemyAI.ts` 450). Summon archetype still falls back to **name** (`enemyAI.ts` 217–224: `wolf` / `golem` / `wisp`). Forbidden for new ids: Span Pylon uses `summonAI: "span"`, not a parse of `"Span Pylon"`.

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

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` (tactical W2 **and** Discovery W2); `spell-blood-tithe` (tactical W2 pet sacrifice **versus** Discovery W2 HP→AP). Wave 5 does not add a third.

**Do not alias** Oncoming ↔ Rear Cut / Cross Flank; Facing Pin ↔ Misstep / Rank Lock; Glance Cut ↔ File Lance / Pit Sight; Mute Thread ↔ Hex of Silence / Quiet Hex / Hex Toll / Ward Cell; Stride Mute ↔ Stride Brand / Camp Tax; Queue Cut ↔ Cut In / Leech Tempo / Tempo Invert; False Cut ↔ Eclipse Fold / False Echo / Cut In; File Vault ↔ Relay Dash / Body Check / Leash Hook / Mist Step / Vault / Morrow Step; Span Guard ↔ Barrier / Nail Down / Self Anchor / Planted Stance; Span Pylon ↔ Bastion / Bait / Stone Turret; Cadence Theft ↔ AP Sip / Loan Tempo; Cadence Brand ↔ Quiet Hex; Cover Step ↔ Pain Link / Life Tether / Ward Interpose / Mirror; Low Lintel ↔ Open Pit / Claim Ward; Act Tax ↔ Hex Toll / Drain Courage; Act Bell ↔ Grave Bell / Fuse Tile; Stolen Verse stays #371.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved, live, or still held) |
| :--- | :--- | :--- |
| DAMAGE sprite-facing | Bonus iff target `currentView` points at the caster | Rear Cut = last-walk-vector not-front. Cross Flank = two adjacent allies |
| DAMAGE front cell | Hit the occupant of the cell the target is **facing** | File Lance is a ray from the **caster**. Pit Sight is pit-on-Bresenham |
| CONTROL player silence | Next **one** spell fizzles (AP spent) | Hex of Silence bricks the bar (`BOSS_ONLY`). Ward Cell is a **tile**. Quiet Hex / Hex Toll tax AP |
| CONTROL walk-then-mute | If they walk ≥ 1 next turn, their next spell that turn fizzles | Stride Brand is a damage rider. Camp Tax bonuses **unmoved** |
| CONTROL end-of-turn insert | After the **current actor ends**, insert an ally as next | Cut In / False Echo / Eclipse Fold = **round wrap**. Mid-RAF splice stays **held** |
| POSITION ally teleport 3–4 | Blink an ally to a clicked free cell Chebyshev 3–4 from **them** | Relay Dash = walk max **2**. Body Check = shove 1. Leash = to caster. Vault is Cavalier dash |
| POSITION two-cell occupy | Caster occupies origin + one adjacent cell | Barrier = empty wall. Nail Down = 1 cell, no walk |
| SUMMONS two-cell body | Stationary 2-cell pylon | Bastion empty 1-cell. Bait intercepts. Turret shoots |
| CONTROL cooldown steal | They +1 remaining CD; you −1 remaining CD | AP Sip is current AP. Loan Tempo grants AP. No live CD transfer |
| DEFENSE incoming CD brand | Next spell that **hits you** writes +1 CD on that attacker’s id | Quiet Hex is a unit next-cast AP tax you apply |
| DEFENSE cover | Next hit on you redirects to an adjacent ally | Pain Link shares %. Life Tether is a pool. Mirror reflects |
| TERRAIN HP-gated walk | Cell walkable only if the walker HP% ≤ 50 | Open Pit = nobody walks. Claim Ward = no swap/blink onto |
| CONTROL act-before-you tax | If they still have an earlier remaining slot, next spell +1 AP | Hex Toll is unconditional next-cast +1 AP |
| DAMAGE delayed-on-act | Payload fires when they **become** current actor | Grave Bell / Fuse are tile timers. Act Bell is a turn-order trigger |
| SUMMONS skip (signature) | Boss inserts **themselves** as next after the player ends | Eclipse Fold skips **summon** turns at wrap. False Echo copies at wrap |
| RESOURCE fourth MP snipe | — | **Held forever** with Ley Toll / Undertow / Sanguine Toll |
| Echo of hostile last | — | Stolen Verse (#371) |
| Ally walk ≤ 2 | — | Relay Dash (#371) |

**Still open after this wave (do not fill today):** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; a fifth echo id; player-owned Hex of Silence (full bar lock); two-cell occupy that walks each cell independently; cooldown **reset to 0** (Theft only steals 1). Those stay Wave 6 so this pass stays discrete.

---

## 3. Contract with Dynamic Spell Discovery

Coordinate with Discovery (`c26e5a83-…`) and Admin (`4efa22ec-…`). This pass only stamps acquisition so those layers can filter **by field**.

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

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 5 ids to `starterSpells` as base. Do **not** land Wave-5 data before Wave-1 ownership split (`SDE-2026-08-31-001`), Wave-2 G resolve, Wave-3 data, or Wave-4 (#342 / #371) data.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "span"` is a **string enum on the config**, not a parse of `"Span Pylon"`.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Span Guard / Facing Pin / Mute Thread **arming** (AP spent) **is** observation. Later expiry / consume is **not** a second observe.
- File Vault **cast** (ally leaves, AP spent) **is** observation, including a blocked destination fizzle after AP.
- Act Bell **arm** is observation. The later turn-start hit is not a second observe.
- Cover Step **arm** is observation. The later redirect is not a second observe.
- Do not require “see it N times” except where a boss adaptation already does. Wave 5 defaults `allowLaterVictory: false`.
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

**Every live feat and every live challenge id is already a sole spell door.** Wave 5 does **not** restamp `first_blood`, `doka_hoarder`, `betrayal_witness`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`, `unstoppable`, or any door in Discovery W4 §4.1. Wave 5 does **not** invent a 16th feat.

**Boss first-wins already taken (do not restamp as the only door):**  
`starborn_queen` (Cut In), `pale_archivist` (After Verse), `starved_vampire_pawn` (Sanguine Toll), `lord_of_static` (Draw Together), `final_pawn` (Eclipse Fold), `mirror_sovereign` (Echo Cast), `crimson_countess` (Crimson Pact), `void_grandmaster` (Twin Gate), `midnight_bishop` (Life Tether), `chessboard_lich` (Claim Ward), `twin_monarchs` (Choir Hymn), `alabaster_fortress` (Pain Link / Aftershock), `bone_cavalier` (Vault / Caltrop), `pale_archbishop` (Reliquary / Glyph Snare extras), `fetid_rook` (Rot Brand), `broodmother_rook` (Brood Ward). Wave-5 boss extra doors (#367): `ram_castellan` (Shoulder Bash), `fosse_warden` (Open Pit), `stride_censor` (Stride Brand), `morrow_herald` (Morrow Step).

**Boss doors still empty (this pass):**

| Door | Spell |
| :--- | :--- |
| `weeping_pawn` first-win | Mute Thread (sheet currently `DISCOVERABLE_SPELLS: none`) |
| `eternal_pawn_king` first-win | Queue Cut (Advance identity; sheet currently none) |
| `enthroned_void` first-win | File Vault MULTI child (anchors stay `BOSS_ONLY`) |
| `second_lament` kit only | False Cut (`NOT_PLAYER_LEARNABLE`; Rush room-9 remap) |

Piece-type observe paths (not feat doors): knights / chargers for Oncoming; lurkers for Glance Cut; hex / scribes for Facing Pin, Cadence Theft, Act Tax; guardians for Cover Step; pit masons for Low Lintel; tempo / queens for Act Bell; golem / castellan ELITE for Span Guard demonstrate + Span Pylon grant; blink / porter for File Vault observe child.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 key names for a different meaning.

`mpCost` stays 0 on every Wave-5 row.

Reuse where the meaning is identical: none required. Facing reads `currentView` as a first-class combatant field, not an effectParam.

**New keys (Wave 5 only):**

```text
requireTargetFacingCaster, oncomingBonus,          // Oncoming
pinViewDuration, pinViewLiteral,                   // Facing Pin — literal "front"|"back"|"left"|"right"
hitFacingCell, glanceIfEmptyFizzle,                // Glance Cut
muteNextSpell, muteDurationTurns,                  // Mute Thread
muteIfWalkedThisTurn,                              // Stride Mute
insertAllyAfterCurrentEnd,                         // Queue Cut
insertSelfAfterPlayerEnd,                          // False Cut
allyBlinkMinCheb, allyBlinkMaxCheb,                // File Vault — 3, 4
spanAdjacent, spanDuration,                        // Span Guard
spanPylonAdjacent,                                 // Span Pylon
stealCooldownTurns,                                // Cadence Theft — 1
brandAttackerCooldownTurns,                        // Cadence Brand — 1
coverRedirectNextHit,                              // Cover Step
lintelMaxHpPct, lintelDuration,                    // Low Lintel — 50, 2
actBeforeYouApTax,                                 // Act Tax — 1
actBellDamage,                                     // Act Bell
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

Conditional riders stay small so the **decision** is the power. Oncoming’s +10 is illegal unless `currentView` actually faces the caster. File Vault’s 3–4 blink is the tax for not being Relay Dash’s 2-step walk.

Queue Cut / Act Bell / False Cut must **not** rewrite the current actor. AGENTS.md forbids incidental turn-logic edits. Those three cards are legal to *spec*, and legal to *implement* only in an explicit **end-of-turn queue** PR (separate from the Wave-4 wrap PR for Cut In / False Echo).

---

## 5. Proposed spells (Wave 5)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-oncoming`

NAME: Oncoming  
ROLE: DAMAGE — bonus if the target’s `currentView` faces the caster  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal **12**. If the target’s stored `currentView` faces the caster, deal **+10** (`effectParams: {"requireTargetFacingCaster":true,"oncomingBonus":10}`). Facing map is the same four-way write as overworld wander (`WorldExploration.tsx` 6928–6931): `right` = +x, `left` = −x, `front` = +y, `back` = −y. “Faces the caster” = the caster sits in the 90° front wedge of that vector (dominant axis; ties fail closed — no bonus). Distinct from Rear Cut (last-walk-vector, **not** front-orthogonal) and Cross Flank (two allied bodies adjacent). Does **not** read sprite pixels or `spell.name`.  
DURATION: instant  
SCALING: 12 and +10 follow dmg%. Facing gate fixed.  
SYNERGIES: Facing Pin the turn before; Glance Cut the cell they then face; File Vault an ally off the front wedge.  
COUNTERPLAY: Walk past them so `currentView` turns away; stay on a diagonal tie (fail closed); Sidestep the 12.  
POWER_BUDGET: Standard. 22 only if they look at you — Frost-like with a readable tell.  
AI_USAGE: `aiHint: "bonus_if_target_faces_caster"`. Knights / chargers zone ≥ 1. Skip the id if `currentView` is missing or not facing (use Strike).  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 8`, `discoverySources: { pieceTypes: ["knight","pawn"], levelZoneMin: 1 }`. Observe+win.  
EDGE_CASES: **Prerequisite writer (not this pass’s production code, not RAF, not damage math):** battle walks for enemies, summons, **and** the player must set `currentView` with the 6928–6931 map. Until that writer exists, missing `currentView` **fail closed** (12 only, no +10). Forced-move (push/pull/swap/blink) does **not** rewrite facing. Challenge: both chunks through `recordChallengeDamageTaken`. Preview must show the facing pip from the field, not from art.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — field read + battle-walk writer. Do not touch `combatMath.ts`.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-oncoming
effectType: damage
spellType: damage
targetType: enemy
areaShape: single
range: 2
lineOfSight: true
apCost: 3
mpCost: 0
damage: 12
cooldown: 1
isPhysical: true
usableByPlayer: true
usableByEnemy: true
isBaseSpell: false
effectParams: {"requireTargetFacingCaster":true,"oncomingBonus":10}
```

---

### SPELL_ID: `spell-facing-pin`

NAME: Facing Pin  
ROLE: CONTROL — lock `currentView` to a chosen literal for 2 turns  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Choose one literal `front|back|left|right` stored on the target for **2** of their turns (`effectParams: {"pinViewDuration":2,"pinViewLiteral":true}`). Walks still move the body. Walks do **not** rewrite `currentView` while pinned. Forced-move does not rewrite it either. Distinct from Misstep (rewrites the **next walk cell**), Rank Lock (walk axis), Root Snare (0 walk). The decision is **point their face at a file you own**.  
DURATION: 2 of the target’s turns  
SCALING: none.  
SYNERGIES: Oncoming / Glance Cut while pinned; Gale Fan into the locked front; File Vault out of their front cell.  
COUNTERPLAY: Dispel Thread; wait 2 turns; Nail Down and ignore facing.  
POWER_BUDGET: Cheap tool. 0 damage. CD 2.  
AI_USAGE: `aiHint: "pin_view_toward_caster_if_oncoming_ready"`. Skip if already pinned, or if no facing-gated id is in kit.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`. Observe+win.  
EDGE_CASES: Literal is metadata (`effectParams.view` on the cast payload / targeting extra), never parsed from the spell name. Invalid literal fizzles (AP spent). Player targets need the battle-walk writer + `playerViewRef`. Pin expiry restores “write on walk,” it does not snap to a remembered view.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — flag on the combatant; walk writer honors it.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-glance-cut`

NAME: Glance Cut  
ROLE: DAMAGE — hit the occupant of the cell the target is facing  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Target a living hostile. Resolve **16** physical on the occupant of the **one** cell in front of that target’s `currentView` (same +x/−x/+y/−y map). If that cell is empty, out of bounds, or a wall, the spell **fizzles** after AP (`effectParams: {"hitFacingCell":true,"glanceIfEmptyFizzle":true}`). The targeted body is **not** damaged unless they somehow occupy their own front cell (they do not). Distinct from File Lance (ray from **caster**), Pit Sight (bonus if a pit sits on caster→target LoS), Rear Cut (predicate on the target).  
DURATION: instant  
SCALING: 16 follows dmg%.  
SYNERGIES: Facing Pin so the front cell is a packed file; Cover Step a summon into that cell as a bait; Goad a body onto it.  
COUNTERPLAY: Turn away; leave the front cell empty; Barrier the front cell (fizzle); hug a wall.  
POWER_BUDGET: Standard. 16 at 3 AP only if they packed their front — otherwise you paid 3 AP for nothing.  
AI_USAGE: `aiHint: "hit_facing_cell_if_occupied"`. Lurkers / queens. Skip if the front cell is empty.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`. Observe+win.  
EDGE_CASES: Occupant can be an ally of the caster (friendly fire **off** — `hitsAllies: false` — fizzle if the front body is allied). Hostile summon in the front cell is legal. Missing `currentView` fizzles. Challenge: hit through `recordChallengeDamageTaken`. Preview highlights the **front cell**, not the targeted body.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — retarget after facing read.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-mute-thread`

NAME: Mute Thread  
ROLE: CONTROL — their **next** spell fizzles  
ACQUISITION: BOSS  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: 2 of the target’s turns, or until they attempt a spell, whichever first. The next spell they resolve with `effectType` in `damage|heal|drain|summon|teleport` (explicit set, not a name list) fizzles (`castResult` no-effect, **AP still spent**, inner id does **not** observe) (`effectParams: {"muteNextSpell":true,"muteDurationTurns":2}`). Walk, potions, Attack Nearest **physical** (`isPhysical` + `id === physical_attack` is **not** a name heuristic — gate on `isPhysical === true && apCost` path already shared), and end-turn are legal. Distinct from Hex of Silence (`BOSS_ONLY`, bricks the **bar** — #367: silence lanes stay unlearnable for that reason), Quiet Hex / Hex Toll (next-cast **+AP**, spell still resolves), Ward Cell (**tile** primary-target fizzle).  
DURATION: 2 of their turns or one consume  
SCALING: none.  
SYNERGIES: Act Tax so the fizzle also wasted a taxed spell; Queue Cut a summon to punish the wasted turn; Stolen Verse **after** they fizzle (no last-resolved — they wasted the verse too).  
COUNTERPLAY: Strike / walk instead of a spell; Dispel Thread; wait 2 turns; spend the mute on a cheap Slow.  
POWER_BUDGET: Standard utility, CD 3. One consume is the tax vs Hex of Silence.  
AI_USAGE: `aiHint: "mute_next_spell_if_nuke_ready"`. Skip if they have no non-physical id off cooldown. Boss `weeping_pawn` kit.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true` on first victory vs `weeping_pawn`. Observation during that fight is **not** required (BOSS door). `usableByEnemy: true` on that boss.  
EDGE_CASES: After Verse / Stolen Verse **are** spells and consume Mute. Timestep is a spell and consumes it. Summon **place** consumes it; the pet’s later kit does not. Do **not** disable the spell bar UI. Challenge: AP on the fizzled inner spell still `recordChallengeApSpend` for **their** spend when they are the player (enemy mute on player).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — consume gate in `executeCastAttempt` / enemy kit-cast, id-agnostic.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-stride-mute`

NAME: Stride Mute  
ROLE: CONTROL — if they walk ≥ 1 on their next turn, their next spell that turn fizzles  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: Arm until the end of the target’s **next** turn. If they spend ≥ 1 walk-MP that turn, the next spell they attempt that same turn fizzles (AP spent, same inner-observe rule as Mute Thread) (`effectParams: {"muteIfWalkedThisTurn":true}`). If they do not walk, the mark expires and they cast normally. Distinct from Stride Brand (caster-moved **damage** rider), Camp Tax (bonus vs **unmoved**), Mute Thread (unconditional next spell). The decision is **close or cast, not both**.  
DURATION: until the end of their next turn  
SCALING: none.  
SYNERGIES: Open Pit so the walk they want is illegal; Oncoming after they refuse to turn; Waste Pace so they cannot afford the walk.  
COUNTERPLAY: Cast first, then walk; don’t walk; blink / Swap (not a walk debit — mark does **not** consume, expires at turn end).  
POWER_BUDGET: Standard utility. Weaker than Mute Thread (they can refuse the walk).  
AI_USAGE: `aiHint: "stride_mute_if_they_must_close"`. Skip if they are already adjacent and will Strike.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","rook"]`, `levelZoneMin: 1`. Observe+win.  
EDGE_CASES: Forced-move is not a walk debit (same as Spent Stride / Misstep). Relay Dash moving **them** as an ally of the enemy caster **is** a walk if Relay Dash walks — player-side File Vault **teleport** does not trip this. Challenge: fizzled AP through existing helpers.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — walk-debit flag + mute consume.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-queue-cut`

NAME: Queue Cut  
ROLE: CONTROL — after the **current actor ends**, insert an ally as next  
ACQUISITION: BOSS  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 4  
EFFECT: Target a living player-side body **other than the caster**. Writes `effectParams: {"insertAllyAfterCurrentEnd":true}`. When the **current** `turnOrder` actor fully ends (end-of-turn hook: leftover AP discarded, DoT already ticked, strip advances), insert the targeted ally as the next living entry. If that ally still has a remaining slot this round, **move** that slot (do not double-act). If they already acted this round, they receive **one** bonus slot this round (once). Does **not** steal `init`. Does **not** rewrite the current actor. Does **not** wait for round wrap (that is Cut In). Distinct from Leech Tempo (`swapInitOrder`), Tempo Invert (swap leftover AP/MP), Eclipse Fold (skip summon turns at wrap).  
DURATION: until the current actor ends or battle end  
SCALING: none.  
SYNERGIES: File Vault the ally onto a fuse **then** cut them in; Cover Step so they eat a hit before their bonus slot; Mute Thread the threat that would punish the insert.  
COUNTERPLAY: Kill the flagged ally before the current actor ends; Root them so the stolen slot is stranded; Quiet Hex their first action.  
POWER_BUDGET: Standard utility, CD 4. Power is tempo.  
AI_USAGE: `aiHint: "queue_cut_ally_if_threat_acts_next"`. Skip if no second allied body, or if the ally is already next. Boss `eternal_pawn_king` kit.  
DISCOVERY_ELIGIBILITY: first victory vs `eternal_pawn_king`. Observation not required (BOSS door). `usableByEnemy: true` on that boss (their “ally” is an enemy-side summon / stone).  
EDGE_CASES: **Implementation is an explicit end-of-turn queue PR**, not the Wave-4 wrap PR, not RAF, not damage math. Casting this **on your own turn** targeting a summon means: you finish the rest of your turn, **then** the summon acts. If you are not the current actor (loaner / out-of-turn illegal), the spell is illegal. Dead ally before the hook: drop the flag. Chaos Initiative: apply after that modifier’s remaining list, still at end-of-current only. Challenge: AP spend is `recordChallengeApSpend`.  
IMPLEMENTATION_COMPLEXITY: HIGH — end-of-turn splice. Must not touch the current actor mid-resolve.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-false-cut`

NAME: False Cut  
ROLE: CONTROL — after the **player** ends, the caster inserts themselves as next  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 5  
EFFECT: Arm until the player fully ends their next turn. Then insert **this caster** as the next living `turnOrder` entry (`effectParams: {"insertSelfAfterPlayerEnd":true}`). Same legal hook as Queue Cut (end-of-turn, not wrap, not mid-RAF). Distinct from Eclipse Fold (skip **player-side summons** at wrap), False Echo (copy player last at wrap, 25%), Cut In (self first **next round**). Never owned.  
DURATION: until the player ends once  
SCALING: none.  
SYNERGIES: `second_lament` Grief Well — extra act to siphon. Do **not** also grant Queue Cut from this fight (Queue Cut is Eternal Pawn King).  
COUNTERPLAY: Kill the lament before you end; Mute Thread the extra act; Root them.  
POWER_BUDGET: Signature. Never player-learnable.  
AI_USAGE: `aiHint: "false_cut_after_player_end"`. **Boss AI only** on `second_lament`. Skip if already armed.  
DISCOVERY_ELIGIBILITY: false. `BOSS_ONLY`. Optional dim `UNKNOWN TECHNIQUE` on arm. **Never** `ownedSpellIds`.  
EDGE_CASES: Same end-of-turn PR as Queue Cut. If the player never ends (wipe), drop the flag. Do not insert if the boss is dead. Do not splice during the player’s RAF.  
IMPLEMENTATION_COMPLEXITY: HIGH — same hook as Queue Cut.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-file-vault`

NAME: File Vault  
ROLE: POSITION — ally **teleports** to a clicked cell Chebyshev 3–4 from them  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: ally  
LOS: true (to the **destination**, from the ally)  
COOLDOWN: 3  
EFFECT: Target a living allied body (player-side summon, or the player if an enemy casts this on their ally). Paint one free floor cell at Chebyshev **3 or 4** from that ally (`effectParams: {"allyBlinkMinCheb":3,"allyBlinkMaxCheb":4}`). The ally **teleports** if `isCellFree` and LoS from **their** origin to the cell. Not a walk. Blocked / occupied / Chebyshev 1–2 / 5+: fizzle (AP spent). Distinct from Relay Dash (walk **max 2** toward a cell), Body Check (`applyPushback` 1), Leash Hook (pull **to caster**), Mist Step / Phase Slip / Vault (self), Morrow Step (delayed **self**), Twin Gate (pads). Pushing through `applyPushback` is illegal on this card.  
DURATION: instant  
SCALING: none.  
SYNERGIES: Cross Flank pincer cell at 3; Cast Snare / Open Pit on the vacated cell; Queue Cut so they act on the landing; Glance Cut if you vault them into someone’s front.  
COUNTERPLAY: Claim Ward the destination; occupy it; Self Anchor the ally; Nail Down (teleport is a displace — Nail **fizzles** this body, AP spent).  
POWER_BUDGET: Standard utility, 0 damage, CD 3. The 3–4 floor is why this is not Relay Dash-2.  
AI_USAGE: `aiHint: "blink_ally_to_cell_3_4"`. Skip if no ally, or landing is lava while ally HP% < 40.  
DISCOVERY_ELIGIBILITY: true. MULTI children: (1) observe+win from blink / porter / void families (`pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`); (2) first victory vs `enthroned_void`. First child wins. Anchors / immune aura stay `BOSS_ONLY`.  
EDGE_CASES: Targeting is two-step (ally, then cell) — same UX shape as Relay Dash, different distance and **teleport**. Landing **must** tick hazards (MIMA-2026-08-31-005). Player as the moved body is legal for enemy casters, illegal as the **player** targeting themselves (self-blink stays Mist / Morrow). Challenge: not a hit; AP through `recordChallengeApSpend`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy teleport; not `applyPushback`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-span-guard`

NAME: Span Guard  
ROLE: DEFENSE / POSITION — occupy origin + one adjacent cell for 2 turns  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 1  
TARGET_TYPE: ground  
LOS: false  
COOLDOWN: 3  
EFFECT: Paint one **free** cell Chebyshev 1 from the caster (`freeCells: true`). For **2** of the caster’s turns the caster occupies **both** cells (`effectParams: {"spanAdjacent":true,"spanDuration":2}`). Both fail `isCellFree`. LoS treats the second cell as a body (blocked). Targeting either cell hits the caster. Walk is legal but the pair **translates**: the second cell stays in the same relative offset; if the new second cell is not `isCellFree`, the walk is illegal. Push/pull/swap targeting this unit move **both** cells or fizzle the displace. Distinct from Barrier (empty wall), Nail Down (1 cell, no walk, immune displace), Self Anchor (ignore displace, 1 cell, can walk), Planted Stance (0-walk RES).  
DURATION: 2 of the caster’s turns  
SCALING: none.  
SYNERGIES: File Lance / Rank Lock a file the span plugs; Cover Step is unnecessary while you are the plug; Low Lintel on the only bypass.  
COUNTERPLAY: Snipe; Glance Cut the span’s front; Mute Thread; wait 2 turns; Coup de Grace the one body.  
POWER_BUDGET: Standard utility. Two cells of body is a wall — **2 turns, CD 3, no RES rider**.  
AI_USAGE: `aiHint: "span_adjacent_if_plugs_file"`. Guardian. Skip if no free adjacent cell or if they still need to close 3+.  
DISCOVERY_ELIGIBILITY: true. Observe+win. `pieceTypes: ["rook"]`, `levelZoneMin: 1`. Golems / castellans may demonstrate. Do **not** restamp `alabaster_fortress` (Pain Link already).  
EDGE_CASES: Expiry frees the second cell. If the second cell is overwritten by a Barrier (last writer), the span **shrinks** to 1 cell and the buff ends. Death frees both. Two spans cannot share a cell. Challenge: not a hit. Occupancy tests must cover pair translate.  
IMPLEMENTATION_COMPLEXITY: HIGH — occupancy pair on one id.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-span-pylon`

NAME: Span Pylon  
ROLE: SUMMONS — stationary 2-cell wall, empty kit  
ACQUISITION: ELITE  
AP_COST: 4  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 4  
EFFECT: Paint a free cell. Place a summon (`summonAI: "span"`, lifespan 3, kit empty, Strike illegal, `hpScale: 1.2`, `damageScale: 0`) that immediately spans one chosen adjacent free cell (`effectParams: {"spanPylonAdjacent":true}`). Does not walk. Does not shoot. Distinct from Bastion Pylon (1-cell empty wall), Bait Pylon (1-HP intercept), Stone Turret (shoots), Mercy Font (heals).  
DURATION: lifespan 3  
SCALING: none.  
SYNERGIES: Queue Cut does **not** give it a useful act (empty kit) — use it as a plug; Goad it; Cross Flank counts it as a body.  
COUNTERPLAY: Kill the 1 body (both cells free); Glance Cut; Ignite.  
POWER_BUDGET: Heavy summon, CD 4, ELITE. Two cells, no damage.  
AI_USAGE: `aiHint: "place_span_pylon_if_plugs_file"`. Skip if Bastion already occupies one of the cells.  
DISCOVERY_ELIGIBILITY: true. ELITE observe+win. Families `iron_golem` / `stone_castellan` / rook zone ≥ 1. Nested kit empty — no `spell-span-block` extra id.  
EDGE_CASES: `summonAI: "span"` must be an allowed admin enum (same review as `bait` / `font`). Name fallback in `inferSummonArchetype` must **not** parse `"Span"`. Place fizzle if the adjacent cell is blocked. Landing / occupy must not punch map gen.  
IMPLEMENTATION_COMPLEXITY: HIGH — depends on Span Guard occupancy pair + new summonAI.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-theft`

NAME: Cadence Theft  
ROLE: CONTROL — steal 1 remaining cooldown turn  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: If the target has no spell id with remaining CD ≥ 1, fizzle. Else pick the id on them with the **highest** remaining CD (ties: lowest id string). Subtract **1** from that remaining (floor 0). Then subtract **1** from the caster’s own highest remaining CD (floor 0). If the caster has no remaining CD, they still steal (they just gain no personal reduction) (`effectParams: {"stealCooldownTurns":1}`). Does **not** copy an id. Does **not** reset a CD to 0 in one shot. Distinct from AP Sip (current AP), Loan Tempo / Tempo Gift (grant AP), Quiet Hex (future AP tax).  
DURATION: instant  
SCALING: none.  
SYNERGIES: Inferno / Gale Fan / Queue Cut sitting on CD 3–4; Act Tax the stolen id’s next use.  
COUNTERPLAY: Don’t sit on a long CD; Timestep does not clear CD (still legal to steal Inferno’s 3); hold the nuke until after they steal a Slow.  
POWER_BUDGET: Standard utility. One turn of tempo, CD 3.  
AI_USAGE: `aiHint: "steal_one_cooldown_if_theirs_ge_2"`. Skip if their max remaining CD is 0.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`. Observe+win.  
EDGE_CASES: Reads `spellCooldowns` / `spellCooldownsRef` by **id**, never by name. Unknown id keys ignored. Do not write persisted spell levels. Challenge: not a hit.  
IMPLEMENTATION_COMPLEXITY: LOW — map increment.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-brand`

NAME: Cadence Brand  
ROLE: DEFENSE — next spell that **hits you** writes +1 CD on that attacker’s id  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns or one consume. The next hostile spell that deals hit damage to the caster (not DoT ticks, not lava, not self-HP costs) writes +1 remaining cooldown on **that spell’s id** for the attacker (`effectParams: {"brandAttackerCooldownTurns":1}`). If that id has no cooldown field (0), write CD 1 anyway for this battle only. Distinct from Quiet Hex (you apply a next-cast **AP** tax), Mute Thread (fizzle), Mirror (reflect payload).  
DURATION: 2 turns or one consume  
SCALING: none.  
SYNERGIES: Surplus Ward / Sidestep so the hit **misses** — brand does **not** consume on a miss; Cover Step: the redirect is not “you were hit” (Cover consumes, Brand does **not**).  
COUNTERPLAY: Hit with Strike (`physical_attack` then sits on CD 1 — they may accept that); DoT; wait 2 turns.  
POWER_BUDGET: Cheap tool. ELITE so it is not a starter stall.  
AI_USAGE: `aiHint: "brand_attacker_cd_if_about_to_be_nuked"`. Skip if already branded.  
DISCOVERY_ELIGIBILITY: true. ELITE observe+win. Hex / plate families.  
EDGE_CASES: Attack Nearest Strike **does** consume (it is a spell id). Reflect: if Mirror reflects, the original attacker was not the hitter — brand does not write. Challenge hits through `recordChallengeDamageTaken` still count.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — consume on hit pipeline, not inside `dealDamage` formula.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cover-step`

NAME: Cover Step  
ROLE: DEFENSE — next hit on you redirects to an adjacent ally  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 1  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 3  
EFFECT: Target a living allied body at Chebyshev 1. Arm 2 turns or one consume. The next damaging **hit** that would apply to the caster (spell or Strike, not DoT, not lava the caster walked onto) applies to the cover ally instead if they are still alive **and** still Chebyshev ≤ 1 (`effectParams: {"coverRedirectNextHit":true}`). If they moved away or died, the hit lands on the caster and the mark expires. Distinct from Pain Link (share % to a linked target), Life Tether (shared pool, breaks at Chebyshev > 3), Ward Interpose (swap now), Mirror (reflect to attacker).  
DURATION: 2 turns or one consume  
SCALING: none. The redirected number is the original hit after existing RES/SR.  
SYNERGIES: Bait Pylon / Span Pylon / Wisp as the cover body; Queue Cut them after they eat the hit; File Vault them **away** after the consume if you need the body safe.  
COUNTERPLAY: Glance Cut / AoE that hits the cover body directly; pull the cover off (Leash / Draw Together); kill the 1-HP bait first.  
POWER_BUDGET: Cheap tool. You spend a body.  
AI_USAGE: `aiHint: "cover_to_adj_ally_if_low_hp"`. Skip if no Chebyshev-1 ally or if the ally HP% < 20 (they will die for nothing unless you want the intercept).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook","king"]`, `levelZoneMin: 1`. Observe+win.  
EDGE_CASES: Redirected hit uses existing `updateCombatant` / `recordChallengeDamageTaken` on the **cover** body. Player-side cover eating a hit is challenge damage if the cover is the player (enemy cast Cover onto a pawn, then hit the enemy — N/A). If the cover is a summon, player challenges do not count summon HP. Do not change damage math.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — consume on the hit pipeline.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-low-lintel`

NAME: Low Lintel  
ROLE: TERRAIN — cell walkable only if the walker’s HP% ≤ 50  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: Paint one free floor cell for **2** turns (`effectParams: {"lintelMaxHpPct":50,"lintelDuration":2}`). `isCellFree` for **walk** is true only when the walking unit’s current HP / max HP ≤ 0.50 (floor). LoS is **open**. Blink / swap / File Vault **onto** the cell use the same HP% gate (fail → fizzle that transit). Distinct from Open Pit (nobody walks, LoS open), Barrier (nobody walks, LoS blocked), Claim Ward (no swap/blink onto, walk OK), Ward Cell (targeted spells fizzle).  
DURATION: 2 turns  
SCALING: none. 50% fixed.  
SYNERGIES: Coup de Grace / Sated Fang identities; File Vault a wounded Wisp through; Span Guard the bypass.  
COUNTERPLAY: Heal above 50% before crossing; walk around; overwrite with Barrier (last writer).  
POWER_BUDGET: Standard terrain, CD 3.  
AI_USAGE: `aiHint: "lintel_if_player_hp_pct_gt_50"`. Skip if the player is already ≤ 50% (they walk through).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook","bishop"]`, `levelZoneMin: 1`. Pit-mason / plate observe+win.  
EDGE_CASES: Summon max HP is the spawned max, not catalog `hpScale` alone. Missing maxHp treats as 100% (cannot enter — fail closed). Do **not** edit `mapGen.ts`. Last-writer vs other painted terrain: same Wave-3 rule (do not stack; skip if a paint already occupies). Challenge: walk is not a hit.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy predicate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-act-tax`

NAME: Act Tax  
ROLE: CONTROL — if they still act before you this round, their next spell costs +1 AP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: If the target has a remaining `turnOrder` slot this round with index **less than** the caster’s remaining slot (they will act sooner), write +1 AP on their next spell (`effectParams: {"actBeforeYouApTax":1}`). If the caster already acted and the target has not, the tax **applies**. If the target has already acted this round (no remaining slot), fizzle. Distinct from Hex Toll (unconditional next-cast +1 AP), Drain Courage (immediate −1 AP), Quiet Hex (Discovery AP tax without a tempo gate).  
DURATION: until they cast or round wrap  
SCALING: none.  
SYNERGIES: Queue Cut so “before you” changes; Mute Thread the taxed spell; Cadence Theft so the taxed nuke also sits.  
COUNTERPLAY: Walk / Strike (physical still pays +1 if it is a spell id — Strike **is** taxed); already acted (they fizzle you); Cut In so wrap reorders next round (this mark expires at wrap).  
POWER_BUDGET: Cheap tool. The gate is the card.  
AI_USAGE: `aiHint: "act_tax_if_target_acts_sooner"`. Skip if they already acted or if Hex Toll is in kit **and** you would rather apply that (do not double-tax the same next spell — last writer wins, explicit).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`. Observe+win.  
EDGE_CASES: Reads live `turnOrder` + `currentTurnIndex`, not persisted `init`. Do not write `CharacterStatFields.init`. Challenge: the extra AP they pay is theirs.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — queue read, not a splice.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-act-bell`

NAME: Act Bell  
ROLE: DAMAGE — delayed payload when the target **becomes** current actor  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: Arm a mark on the target. The next time that unit **becomes** the current `turnOrder` actor (their turn **starts**), deal **14** (`effectParams: {"actBellDamage":14}`) and consume. If they die before they act, the mark drops. Distinct from Grave Bell (delayed **execute** / tile timer), Fuse Tile (cell timer), Morrow Step (self blink at **caster** turn start).  
DURATION: until they next act or battle end  
SCALING: 14 follows dmg%.  
SYNERGIES: Queue Cut a different ally so the marked threat acts **sooner** into the bell; Cut In yourself so you act first **after wrap** (does not fire the bell — different hook); Mute Thread so their turn start is a dead spell.  
COUNTERPLAY: Kill the marked unit before their slot; Cut In does not save them; Sidestep / Surplus Ward at turn start (evade **does** consume if the bell is a hit — explicit: Act Bell is a hit).  
POWER_BUDGET: Standard. 14 delayed is below Frost; the tempo is the rest.  
AI_USAGE: `aiHint: "act_bell_if_target_has_remaining_slot"`. Skip if they already acted and wrap is far **and** you have Frost.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","king"]`, `levelZoneMin: 1`. Observe+win. Observe on **arm**, not on the later hit.  
EDGE_CASES: **Same end-of-turn / turn-start PR family as Queue Cut**, not the wrap PR. Do not fire mid-RAF. Challenge: turn-start hit through `recordChallengeDamageTaken`. Do not touch RAF.  
IMPLEMENTATION_COMPLEXITY: HIGH — turn-start flag reader.  
STATUS: PROPOSED

---

## 6. Combination mechanics (statuses × position × terrain × spells)

| Pair | What the player decides | Fail closed |
| :--- | :--- | :--- |
| Facing Pin → Oncoming | Spend 2 AP to lock a face, then 3 for 22 | Pin expires; diagonal tie = no +10 |
| Facing Pin → Glance Cut | Point their face at a packed body | Empty front cell fizzles Glance |
| Mute Thread → Stolen Verse (#371) | They fizzle, so Stolen Verse has no last-resolved | Verse fizzle observes Verse only |
| Stride Mute × Open Pit | Walk is illegal, so they must cast (mute does not fire) or skip | Forced-move is not a walk |
| Queue Cut × File Vault | Blink a summon to a fuse, then give them the next slot | Dead ally drops the insert |
| Queue Cut × Act Bell | Pull a marked threat forward into the bell | Bell is turn-**start**, insert is after current **end** — order is explicit: hook A (end) then next start fires Bell |
| Cover Step × Glance Cut | Put a bait in someone’s front cell | Cover does not redirect Glance if Glance never targeted you |
| Span Guard × File Lance | Plug a file with two cells | Span shrinks if Barrier overwrites the second cell |
| Span Pylon × Low Lintel | Healthy walkers cannot bypass the plug | ≤50% walks through the lintel |
| Cadence Theft × Act Tax | Steal Inferno’s CD, tax the next nuke | Last-writer if Hex Toll also applied |
| Cadence Brand × Cover Step | Redirected hit does **not** brand (you were not hit) | Explicit consume order |
| File Vault × Nail Down | Nailed ally: vault fizzles | AP spent, observe File Vault |
| False Cut × Mute Thread | Mute the lament’s stolen extra act | False Cut never owned |
| Relay Dash (#371) × File Vault | 2-step walk **or** 3–4 blink — do not merge the ids | Different distance, walk vs teleport |
| After Verse (#342) × Mute Thread | Mute consumes the verse | Denylist still excludes verse-of-verse |

Do not implement a name table for any pair. Each card’s `effectParams` keys compose.

---

## 7. Implementation notes (for a later, explicit implementation PR)

1. **No new `mpCost > 0`.** Ley Toll / Undertow / Sanguine Toll remain the only paper spenders. File Vault is AP only.  
2. **Battle facing writer:** walk steps (player, enemy, summon) set `currentView` with WX 6928–6931. Forced-move does not. Missing field fail closed. Do not read pixels.  
3. **Queue Cut / Act Bell / False Cut** share an **end-of-turn / turn-start** PR. Do not reuse the Wave-4 wrap PR. Do not splice the current actor. Do not touch RAF.  
4. **Mute Thread** is a consume gate on spell resolve, not a UI lock. Hex of Silence stays unowned.  
5. **File Vault** is occupancy teleport, min 3 / max 4 from the **ally**. Not `applyPushback`. Not Relay Dash.  
6. **Span** is one combatant id on two cells. New occupancy helpers. `summonAI: "span"` is an enum.  
7. **Cadence** reads cooldown maps by id. Do not write spell levels.  
8. **Cover / Brand** consume on the existing hit pipeline, not inside `dealDamage` math.  
9. **Low Lintel** is an occupancy predicate. Do not edit map generation.  
10. Recap grant uses the reward funnel + `commitSpellDiscoveries` / `unlockOwnedSpell`, not `updateCharacter`.  
11. Do not append these ids to `starterSpells` as `isBaseSpell`. Add to `SPELL_ID_CATALOG` **only when implemented**, together with `spellData.ts` and kits.  
12. Extract helpers. Do not grow `WorldExploration.tsx` (18,749 lines).

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
- No wiring of `CharacterStatFields.evasion` as a percent.  
- No clone of Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Veil, Mirror / Reflect.  
- No 12-AP Void Collapse clone.  
- No third File Lance / Blood Tithe.

---

## 9. Proposal index

| ID | Acquisition | Complexity | Primary hole filled |
| :--- | :--- | :--- | :--- |
| `spell-oncoming` | ENEMY_DISCOVERY | MEDIUM | Sprite-facing bonus (`currentView`) |
| `spell-facing-pin` | ENEMY_DISCOVERY | LOW–MEDIUM | Lock `currentView` |
| `spell-glance-cut` | ENEMY_DISCOVERY | MEDIUM | Hit the facing cell |
| `spell-mute-thread` | BOSS | MEDIUM | Player-owned next-spell silence |
| `spell-stride-mute` | ENEMY_DISCOVERY | MEDIUM | Walk-then-fizzle |
| `spell-queue-cut` | BOSS | HIGH | End-of-turn ally insert |
| `spell-false-cut` | NOT_PLAYER_LEARNABLE | HIGH | Boss self-insert after player |
| `spell-file-vault` | MULTI_SOURCE | MEDIUM | Ally teleport Chebyshev 3–4 |
| `spell-span-guard` | ENEMY_DISCOVERY | HIGH | Two-cell occupy (self) |
| `spell-span-pylon` | ELITE | HIGH | Two-cell stationary summon |
| `spell-cadence-theft` | ENEMY_DISCOVERY | LOW | Cooldown steal 1 |
| `spell-cadence-brand` | ELITE | MEDIUM | Attacker inherits +1 CD |
| `spell-cover-step` | ENEMY_DISCOVERY | MEDIUM | Redirect next hit to ally |
| `spell-low-lintel` | ENEMY_DISCOVERY | MEDIUM | HP%-gated walk cell |
| `spell-act-tax` | ENEMY_DISCOVERY | LOW–MEDIUM | +1 AP if they act sooner |
| `spell-act-bell` | ENEMY_DISCOVERY | HIGH | Damage on their next turn start |

All STATUS: **PROPOSED**.

**Stamped, not cloned:** `spell-stolen-verse` (#371 hostile last id); `spell-relay-dash` (#371 ally walk max 2).

---

## 10. Source map (read-back)

| Topic | File | Lines |
| :--- | :--- | :--- |
| Live 32-id catalog | `src/frontend/src/data/spellData.ts` | 9–691 |
| Forced `isBaseSpell` | `src/frontend/src/components/WorldExploration.tsx` | 2395–2408 |
| Owned union + library filter call | `src/frontend/src/components/WorldExploration.tsx` | 2410–2439 |
| Backend library filter | `src/frontend/src/utils/adminSafety.ts` | 712–718 |
| `SPELL_ID_CATALOG` | `src/frontend/src/data/bossKits.ts` | 29–62 |
| `SpellConfig` / `areaShape` / evasion | `src/frontend/src/types/gameTypes.ts` | 64, 160–241 |
| `Enemy.currentView` | `src/frontend/src/types/gameTypes.ts` | 297 |
| Overworld facing write | `src/frontend/src/components/WorldExploration.tsx` | 6924–6938 |
| Summon default facing | `src/frontend/src/engine/summonSpawn.ts` | 177–178 |
| Ally targeting | `src/frontend/src/engine/targeting.ts` | 528–545 |
| Line targeting (unused by data) | `src/frontend/src/engine/targeting.ts` | 576–617 |
| `diagonal` / `linear` on enemy/area | `src/frontend/src/engine/targeting.ts` | 637–649, 711–712 |
| Area = Chebyshev, no `areaShape` | `src/frontend/src/engine/targeting.ts` | 690–727 |
| Trap stub = barrier | `src/frontend/src/engine/spellEngine.ts` | 442–445 |
| `isSwap` flag | `src/frontend/src/engine/spellEngine.ts` | 637 |
| Push / attract unused by casts | `src/frontend/src/engine/occupancy.ts` | 482–537 |
| AP-only cast debit | `src/frontend/src/components/WorldExploration.tsx` | 17096–17207 |
| MP display only | `src/frontend/src/components/SpellbookModal.tsx` | 966–977 |
| Enemy kits (owned ids) | `src/frontend/src/engine/enemyAI.ts` | 163–185 |
| Summon name fallback | `src/frontend/src/engine/enemyAI.ts` | 217–224 |
| Heal-amount healer infer | `src/frontend/src/engine/enemyAI.ts` | 450 |
| `buildEnemyKit(levelZone)` | `src/frontend/src/components/WorldExploration.tsx` | 11920 |
| WX size | `src/frontend/src/components/WorldExploration.tsx` | 18,749 lines |
| Backend six | `src/backend/lib/admin.mo` | 168–191 |
| Feats | `src/backend/lib/admin.mo` | 309–326 |
| Challenges | `src/frontend/src/utils/challengeCompletion.ts` | 44–109 |
| Boss ids | `src/frontend/src/types/bossTypes.ts` | 390–410 |
| OLD_SPELL_NAMES_SET | `src/frontend/src/components/WorldExploration.tsx` | 2356–2389 |

**Document status:** PROPOSED. Safe to review and implement in a later, explicit data PR after Wave-1 P0, Wave-2 / Wave-3 data, and after #342 / #371 land. Not a license to land combat code in the same change as this spec.

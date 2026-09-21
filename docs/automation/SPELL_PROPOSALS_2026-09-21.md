# Spell and Tactical Mechanics — Design Pass 2026-09-21

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Days since last tactical pass:** 19 (Wave 3 was 2026-09-02 @ `58302bc`)  
**Sibling systems:**
- Dynamic Spell Discovery — [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) (Wave 1 law), [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md) (G≥2), [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md) (G≥3)
- Spell, Discovery & Achievement Admin — [`SPELL_ADMIN_DESIGN_2026-09-02.md`](./SPELL_ADMIN_DESIGN_2026-09-02.md)
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) (Wave 1), [`SPELL_PROPOSALS_2026-09-01.md`](./SPELL_PROPOSALS_2026-09-01.md) (Wave 2), [`SPELL_PROPOSALS_2026-09-02.md`](./SPELL_PROPOSALS_2026-09-02.md) (Wave 3)
- Boss adaptations — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md)
- Mechanic pairs — [`MECHANIC_INTERACTION_MATRIX_2026-09-02.md`](./MECHANIC_INTERACTION_MATRIX_2026-09-02.md)

This is **Wave 4**. Wave 1 filled push, pull, self-teleport, delayed execute, root, range buff, absorb, redirect, self-cleanse, burn tile, real trap, AP-tax zone, turret, sacrificial familiar, conditional bounce, and a boss pull+root. Discovery Wave 1 formalized 19 more ids. Boss design reserved 10 adaptations. Wave 2 filled line poke, delayed tile fuse, instant execute, DoT detonate, range shrink, AP grant, ally cleanse, plus-shape, ice, smoke, tile-gravity, ally pull, defensive pylon, pet sacrifice, taunt, and shared HP. Wave 3 filled the first `mpCost > 0` amp, cone `areaShape`, two-hostile swap, self knockback, portal-pair, evade-next-hit, distance-scaled poke, MP steal, pit, heal totem, ally range, moved-this-turn bonus, unit next-cast AP tax, conveyor, axis lock, and a mass-shove signature.

**Wave 3 explicitly deferred seven holes to this pass:** cone+knockback as one id; two-ally swap; mid-combat initiative rewrite; player-owned Echo Cast; HP+MP hybrid cost; facing damage beyond Rear Cut; second `mpCost > 0` damage nuke.

**Discovery Wave 3 constraint this pass honors:** Ley Toll (`mpCost: 2` amp) and Undertow (`mpCost: 1` attract) are the two walk-pool spenders. Do **not** add a fourth pure walk-MP snipe. The deferred “second MP nuke” is **not** shipped as Undertow-2 / Ley Toll-2. The HP+MP hybrid (`spell-sanguine-toll`) is the third `mpCost > 0` row in the combined paper catalog, and it is a **payload** (HP floor + 1 walk MP), not a positioning clone.

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after that reserved set. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is **byte-stable in identity** since 2026-08-31: still 32 frontend ids, still six backend seeds, still no discovery persist. Nineteen days of merges (#316–#332 and siblings) did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`.

### 1.1 Frontend runtime catalog — `src/frontend/src/data/spellData.ts`

`SPELL_ID_CATALOG` (`src/frontend/src/data/bossKits.ts` 29–62) still lists **32** ids. `WorldExploration.tsx` 2395–2408 still maps **every** `starterSpells` row to `isBaseSpell: true` (“always shown, never removable”).

`ownedSpells` (2410–2434) still unions those 32 with backend rows that pass `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718). That helper only drops `usableByPlayer === false` unless the id is already owned. It does **not** create a discovery path.

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

**None** of these rows set `lineOfSight`, `linear`, `diagonal`, `modifiableRange`, `minRange`, or `maxRange`. **No row sets `mpCost` ≠ 0** (every literal is `BigInt(0)`). No row uses `targetType: "line"` even though `targeting.ts` 576–617 implements that branch. `areaShape` is typed as `circle | cone | line | cross | single` (`gameTypes.ts` 224) but **targeting never reads `areaShape`** — area expansion is Chebyshev around `areaRadius` (`targeting.ts` 690–727). Cross / cone / line *shapes* therefore still need `hitTiles` (`castHelpers.ts` 105–117) **or** the Wave-3 `areaShape: "cone"` wire (Fan Bolt, still paper).

`CharacterStatFields.evasion` exists (`gameTypes.ts` 64) and is persisted. Combat never reads it. Wave 3 Sidestep Ward remains the evade consume gate. This pass does **not** wire a miss %.

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

This pass’s diagonal card (`spell-bias-ray`) is a **new id**. It does not promote `shadow_strike` into `SPELL_ID_CATALOG` and does not branch on the name “Shadow Strike.”

### 1.3 Engine support vs catalog use (still true, line numbers at this HEAD)

| Mechanic | Engine @ `0f5363f` | Live catalog | Already proposed (reserved) | This pass |
| :--- | :--- | :--- | :--- | :--- |
| Spell `mpCost` debit | `executeCastAttempt` (`WorldExploration.tsx` 17162–17204) gates **AP only**. Spellbook UI can *display* MP (`SpellbookModal.tsx` 966–977). | Always 0 | Ley Toll (amp, 2 MP); Undertow (attract, 1 MP) | **Sanguine Toll** — hybrid HP+1 MP payload. **No fourth walk-MP snipe.** |
| `areaShape` cone | Typed, **unread**. Area = Chebyshev (`targeting.ts` 690–727) | Unused | Fan Bolt wires cone | **Gale Fan** reuses that helper + 1-tile push |
| `targetType: "line"` | Implemented 8-dir ray (`targeting.ts` 576–617). Does **not** read `spell.linear` (linear is only on enemy/area paths at 637 / 711) | **No spell** | File Lance | Unused this pass |
| `spell.diagonal` | Honored on enemy/area (`targeting.ts` 646–649, 712) | Unused in frontend rows | Backend `shadow_strike` only | **Bias Ray** |
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** | Unused | Shoulder Bash, Hook Line, Back Step, Slide, Board Tilt, Undertow, File Slide | **Gale Fan** (per-body push), **Draw Together** (pair attract), **Body Check** (ally push) |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768 → `swapPositions`) | Swap | Ward Interpose (ally↔caster); Pawn Trade (two hostiles) | **Twin Guard** (two allies, caster stays) |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, not this set | Morrow Step is a delayed blink, not a pad |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire | **Cast Snare** is origin-tax, not `isTrap` |
| `CharacterStatFields.evasion` | Persisted; **unread in combat** | Unused | Sidestep Ward (`evadeNextHits`) | Surplus Ward **reuses** `evadeNextHits` (gated on leftover AP) |
| Initiative mid-combat | Turn order built at battle start; `InitiativeStrip` displays it | Unused as a spell | Leech Tempo = steal init 1 round (`swapInitOrder`) | **Cut In** = round-boundary first-slot, no steal |
| Echo / replay | Absent in live combat | Absent | Boss `spell-echo-cast` (next-spell auto 50%, once/battle, `legendary_3` on Mirror Sovereign) | **After Verse** is a **manual** replay of the caster’s last resolved id this turn. **New id.** |
| Facing / flank | No walk-facing flag live | Strike always legal | Rear Cut = not front-orthogonal | **Cross Flank** = two allied bodies adjacent to the target (pincer), not sprite facing |
| HP + MP together | Sacrifice is HP only; all `mpCost` 0 | Absent | Crimson Pact is HP→next physical lifesteal; Ley Toll is MP→amp | **Sanguine Toll** |
| Zero-sum AP | Drain Courage debits AP, caster does not gain | Debit only | Loan Tempo / Tempo Gift grant | **AP Sip** |
| Two-ally swap | Ally targeting exists (`targeting.ts` 528–545) | Unused for swap | Ward Interpose is caster↔one ally | **Twin Guard** |
| Delayed self-teleport | Absent | Instant Swap / reserved blinks | Mist Step / Phase Slip / Vault instant | **Morrow Step** |
| Cast-origin tile tax | Glyph Tax is enter-AP | Absent | Quiet Hex / Hex Toll = unit next-spell | **Cast Snare** |
| Intercept summon | Mirror reflects; Bastion is empty wall | No eater | False Retreat is a decoy blink | **Bait Pylon** |
| High-HP gate | Absent | Absent | Last Ember / Last Ward are **low-HP** | **Sated Fang** is **high-HP%** legal |
| Skip player summons | Absent | Absent | Sovereign Fold folds two bodies | **Eclipse Fold** skips summon turns (`NOT_PLAYER_LEARNABLE`) |

`buildEnemyKit` is still called with `currentMap.levelZone` (`WorldExploration.tsx` 11920). Discovery already recorded that a non-number → `NaN` → every kit stays zone 0. `inferArchetype` still treats `healAmount > 0` as healer (`enemyAI.ts` 447+). Summon archetype still falls back to **name** (`enemyAI.ts` 217–221: `wolf` / `golem` / `wisp`). Forbidden for new ids: Bait Pylon uses `summonAI: "bait"`, not a parse of `"Bait Pylon"`.

### 1.4 Reserved id tombstone (do not collide)

**Wave 1 tactical (`SPELL_PROPOSALS_2026-08-31.md`):**  
`spell-shoulder-bash`, `spell-hook-line`, `spell-mist-step`, `spell-grave-bell`, `spell-root-snare`, `spell-lens-shift`, `spell-ward-plate`, `spell-pain-link`, `spell-cleanse-rite`, `spell-cinder-tile`, `spell-tripwire`, `spell-glyph-tax`, `spell-stone-turret`, `spell-turret-shard`, `spell-blood-familiar`, `spell-ricochet-mark`, `spell-void-anchor`.

**Discovery Wave 1 (`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md` §11):**  
`spell-quiet-hex`, `spell-chain-ward`, `spell-crosswind`, `spell-glass-shot`, `spell-ember-wake`, `spell-split-mark`, `spell-phase-slip`, `spell-sever-tether`, `spell-overcast`, `spell-second-wind`, `spell-choir-hymn`, `spell-oath-bind`, `spell-leech-tempo`, `spell-null-brand`, `spell-false-retreat`, `spell-blood-benediction`, `spell-ward-interpose`, `spell-martyr-fuse`, `spell-hex-of-silence`. Formal blink id remains `spell-phase-slip` (never add `spell-phase-step`).

**Boss adaptations (`BOSS_AND_SPELL_DISCOVERY.md` §5.2):**  
`spell-ember-step`, `spell-caltrop`, `spell-shock-glyph`, `spell-exsanguinate`, `spell-glyph-snare`, `spell-vault`, `spell-brood-ward`, `spell-aftershock`, `spell-rot-brand`, `spell-echo-cast`.

**Wave 2 tactical (`SPELL_PROPOSALS_2026-09-01.md`):**  
`spell-file-lance`, `spell-fuse-tile`, `spell-coup-de-grace`, `spell-ignite-stacks`, `spell-short-sight`, `spell-tempo-gift`, `spell-absolve`, `spell-cross-cut`, `spell-rime-tile`, `spell-smoke-veil`, `spell-sinkhole`, `spell-leash-hook`, `spell-bastion-pylon`, `spell-blood-tithe`, `spell-goad`, `spell-life-tether`.

**Discovery Wave 2 (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md` §11):**  
`spell-load-bearing`, `spell-void-glyph`, `spell-paper-wind`, `spell-rear-cut`, `spell-hold-ground`, `spell-rime-sheet`, `spell-hex-theft`, `spell-still-brand`, `spell-grounded-lock`, `spell-file-lance`, `spell-loan-tempo`, `spell-dispel-thread`, `spell-taunt-oath`, `spell-convert-whelp`, `spell-last-ember`, `spell-blood-tithe`, `spell-search-dust`, `spell-fog-hood`, `spell-claim-ward`, `spell-self-anchor`, `spell-pack-howl`, `spell-reliquary-lock`.

**Wave 3 tactical (`SPELL_PROPOSALS_2026-09-02.md`):**  
`spell-ley-toll`, `spell-fan-bolt`, `spell-pawn-trade`, `spell-back-step`, `spell-twin-gate`, `spell-sidestep-ward`, `spell-far-sting`, `spell-soul-sip`, `spell-open-pit`, `spell-mercy-font`, `spell-font-pulse`, `spell-lens-share`, `spell-stride-brand`, `spell-hex-toll`, `spell-slide-tile`, `spell-rank-lock`, `spell-board-tilt`.

**Discovery Wave 3 (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md` §11):**  
`spell-undertow`, `spell-mire-sheet`, `spell-borrowed-eye`, `spell-summon-bane`, `spell-planted-stance`, `spell-file-slide`, `spell-tempo-invert`, `spell-debt-mark`, `spell-knight-pierce`, `spell-split-pace`, `spell-last-ward`, `spell-kennel-lock`, `spell-far-watch`, `spell-mercy-hex`, `spell-bloodless-plate`, `spell-crimson-pact`, `spell-gate-sight`, `spell-pack-tempo`, `spell-sovereign-fold`.

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` (tactical W2 line poke **and** Discovery W2); `spell-blood-tithe` (tactical W2 pet sacrifice **versus** Discovery W2 HP→AP). Wave 4 does not add a third.

**Do not alias** After Verse ↔ Echo Cast, Gale Fan ↔ Fan Bolt, Twin Guard ↔ Twin Gate / Pawn Trade / Ward Interpose, Cut In ↔ Leech Tempo, Cross Flank ↔ Rear Cut, Sanguine Toll ↔ Ley Toll / Sacrifice / Crimson Pact, Bias Ray ↔ `shadow_strike`, AP Sip ↔ Drain Courage, Cast Snare ↔ Glyph Tax / Quiet Hex, Bait Pylon ↔ Mirror / False Retreat / Bastion, Morrow Step ↔ Mist Step / Twin Gate, Surplus Ward ↔ Sidestep Ward, Sated Fang ↔ Last Ember, Eclipse Fold ↔ Sovereign Fold.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved, live, or deferred again) |
| :--- | :--- | :--- |
| DAMAGE cone+knockback | One id: wedge **and** 1-tile push | Fan Bolt is damage-only cone |
| DAMAGE pincer | Bonus iff **two** allied bodies are adjacent to the target | Rear Cut is walk-facing / not-front |
| DAMAGE diagonal flags | First frontend-catalog `diagonal: true` poke | File Lance is `targetType: "line"`; `shadow_strike` is backend-only |
| DAMAGE high-HP gate | Legal only when caster HP% ≥ 70 | Last Ember / Last Ward are low-HP |
| RESOURCE HP+MP hybrid | Self HP floor **and** `mpCost: 1` on a nuke | Ley Toll = MP amp; Undertow = MP attract; Sacrifice = HP only. **No fourth walk-MP snipe** |
| POSITION two-ally swap | Swap two player-side bodies; caster stays | Swap caster↔enemy; Ward Interpose caster↔ally; Pawn Trade two hostiles |
| POSITION pair attract | Two hostiles move 1 toward each other | Hook/Leash/Undertow pull toward **caster**; Sinkhole toward **tile**; Void Collapse attract-all |
| POSITION ally shove | Push an ally 1 away from caster | Leash Hook pulls ally **toward** caster; Shoulder Bash is hostile |
| POSITION delayed blink | Paint now, teleport at **next turn start** | Mist Step / Phase Slip / Vault are instant; Twin Gate is a pad pair |
| CONTROL round-boundary init | Caster acts first **next round**, no steal | Leech Tempo steals init from a target for 1 round. **No mid-turn splice** of the current actor |
| CONTROL AP steal | They lose 1 current AP, you gain 1 this turn | Drain Courage debits without grant; Loan Tempo grants without steal |
| CONTROL echo (player) | Manual replay of **your last resolved id this turn** at 50% | `spell-echo-cast` primes the **next** spell, once/battle, Mirror Sovereign |
| DEFENSE leftover-AP evade | Evade charge only if ≥ 2 AP remains after paying | Sidestep Ward is unconditional evade |
| TERRAIN cast-origin tax | Tile: spells **cast from** it cost +1 AP | Glyph Tax is enter-AP; Quiet Hex / Hex Toll are unit next-spell |
| SUMMONS intercept | Stationary 1-HP eater of the next hostile spell aimed at the owner | Mirror reflects; Bastion empty wall; False Retreat decoy blink |
| SUMMONS skip (signature) | All player-side summons skip their next turn | Sovereign Fold folds two bodies. Never owned |
| COMBINATION | Cone × push × pit; pincer × Goad; delayed blink × Cast Snare; AP sip × Cut In | See §6 |

**Still open after this wave (do not fill today):** mid-turn live splice of `turnOrder` during the current actor; a fourth pure `mpCost > 0` walk-positioning snipe; sprite-facing damage (Rear Cut owns walk-facing); copy **the enemy’s** last spell (After Verse copies **yours**); player-owned silence (Hex of Silence stays BOSS_ONLY); ally **dash to a clicked cell** (Body Check is a 1-tile shove). Those stay Wave 5 so this pass stays discrete.

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
8. `executeCastAttempt` still does not debit `spell.mpCost`. Shipping Sanguine Toll (or Ley Toll / Undertow) without that debit makes the MP half free.
9. No `ownedSpellIds` / `observedSpellIds` persist maps. Character still has `spellLevelKeys` / `spellBarOrder`.

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 4 ids to `starterSpells` as base. Do **not** land Wave-4 data before Wave-1 ownership split (`SDE-2026-08-31-001`).

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "bait"` is a **string enum on the config**, not a parse of `"Bait Pylon"`.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend, and after the MP gate lands, MP spend too) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP/MP **does** observe.
- Morrow Step **arming** (cell painted, AP spent) **is** observation. The later teleport trigger is **not** a second observe (same rule as Twin Gate pads / Hold Ground / Far Watch).
- Bait Pylon **place** is observation. The later intercept is not a second observe.
- Do not require “see it N times” except where a boss adaptation already does. Wave 4 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10` (Discovery W2: that feat is a milestone, not a last tier).

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

Already claimed by prior waves (do not reuse as the **only** door):

| Door | Taken by |
| :--- | :--- |
| `unstoppable` | Tempo Gift (W2 tactical). Discovery: never a spell gate |
| `spell_scholar` | Lens Shift (W1) / Overcast (SDE W1). Live Barrier also tagged scholar |
| `survivor` / `easy_1` | Cleanse Rite (W1); Bloodless Plate (SDE W3) also claims `easy_1` |
| `jackpot` / `hard_1` | Absolve (W2) |
| `hard_2` | Blood Tithe (W2) |
| `hard_3` | Hook Line / Sinkhole (W2); Second Wind (SDE W1) also lists it |
| `legendary_1` | Mist Step (W1) |
| `legendary_2` | Timestep (SDE W1 live-catalog) |
| `legendary_3` | Echo Cast (boss); Back Step MULTI child (SDE W3) |
| `explorer` | Search Dust (SDE W2) |
| `pacifist_run` | Blood Benediction (SDE W1); Mercy Hex (SDE W3) |
| `leader_slayer` / `spell_master` | Ward Interpose / Stone Turret (W1) |
| `easy_2` | Self Anchor (SDE W2) |
| `easy_3` | Second Wind (SDE W1). Tactical W3 Back Step must **not** restamp it |
| `loot_hunter` | Mercy Font (W3) |
| `critical_striker` | Sidestep Ward (W3) |
| `double_betrayal` | Lens Share MULTI child (W3) |
| `midnight_bishop` | Life Tether (W2) |
| `chessboard_lich` | Claim Ward (SDE W2) |
| `twin_monarchs` | Choir Hymn (SDE W1) |
| `void_grandmaster` | Twin Gate (W3) |
| `crimson_countess` | Crimson Pact (SDE W3) |
| `mirror_sovereign` | Echo Cast / Sovereign Fold |

**All nine live `DEFAULT_CHALLENGES` ids are claimed.** Wave 4 does **not** restamp a challenge as a sole door.

**Feat doors still free (SDE W3 leftover §4.2, minus ones tactical already took):** `first_blood`, `doka_hoarder`, `betrayal_witness`, `rich_vampire`.

Wave 4 doors:

| Door | Spell |
| :--- | :--- |
| `first_blood` | Bias Ray |
| `doka_hoarder` | Surplus Ward |
| `betrayal_witness` | Twin Guard MULTI child |
| `rich_vampire` | Sated Fang |
| `pale_archivist` first-win | After Verse |
| `starved_vampire_pawn` first-win | Sanguine Toll |
| `starborn_queen` first-win | Cut In |
| `lord_of_static` first-win | Draw Together MULTI child |
| `final_pawn` kit only | Eclipse Fold (`NOT_PLAYER_LEARNABLE`) |

Piece-type observe paths (not feat doors): knights / queens for Gale Fan; summoner families for Bait Pylon; bishops for Body Check; scribes / hex for Cast Snare and AP Sip; lurkers for Cross Flank; void / blink for Morrow Step.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables.

`mpCost` is already a first-class `SpellConfig` field. Sanguine Toll sets it on the row; it is **not** an effectParam.

Reuse from earlier waves where the meaning is identical: `pushDistance` (Gale Fan per-hit), `attractDistance` (Draw Together per-body), `evadeNextHits` (Surplus Ward), `swapSearchRadius` (Twin Guard, ally-scoped).

**New keys (Wave 4 only):**

```text
conePushDistance,                       // Gale Fan — after cone hits, applyPushback 1
swapTwoAllies,                          // Twin Guard — NOT isSwap, NOT swapTwoHostiles
actFirstNextRound,                      // Cut In — flag read at round wrap only
echoLastResolvedThisTurn, echoPayloadMul, echoDenySelf,  // After Verse
hpCostPct, hpCostFloorRemain,           // Sanguine Toll — current HP, leave ≥ 1
requireAdjacentAllyCount,               // Cross Flank — pincer count (2)
diagonalOnly,                           // Bias Ray — redundant with SpellConfig.diagonal; keep both
pairAttractDistance,                    // Draw Together — each body 1 toward midpoint
stealApAmount,                          // AP Sip — this-turn current AP
allyPushDistance, allyPushFromCaster,   // Body Check
originCastApTax, originCastDuration,    // Cast Snare
interceptOwnerSpells, interceptRange,   // Bait Pylon
delayedBlinkTurns,                      // Morrow Step — 1 = next turn start
requireLeftoverAp,                      // Surplus Ward — after paying this spell
requireHpPctMin,                        // Sated Fang
skipPlayerSummonTurns                   // Eclipse Fold
```

If a key is missing, the rider does not fire.

Nested kit-only id (not a player card): `spell-bait-eat` — same pattern as `spell-turret-shard` / `spell-font-pulse`.

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Sanguine Toll’s MP is paid in **walk tiles**; its HP is paid in **challenge self-loss** (`recordChallengeSelfHpLoss`, floor at 1).

Cut In must **not** rewrite the current actor. AGENTS.md forbids incidental turn-logic edits; this card is legal to *spec*, and legal to *implement* only in an explicit turn-order PR that reads a flag at round wrap.

---

## 5. Proposed spells (Wave 4)

All rows: `STATUS: PROPOSED`. `mpCost: 0` unless noted. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-gale-fan`

NAME: Gale Fan  
ROLE: DAMAGE + POSITION — cone and 1-tile knockback on each hit  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 4  
RANGE: 3  
TARGET_TYPE: area  
LOS: true  
COOLDOWN: 3  
EFFECT: Same cone geometry as Fan Bolt (`areaShape: "cone"`, `areaRadius: 3`, 90° wedge, LoS, walls stop a spoke). Deal **8** to each hostile in the wedge, then `applyPushback` **1** away from the caster (`effectParams: {"coneLength":3,"conePushDistance":1}`). Distinct from Fan Bolt (10, no push, AP 3, CD 2) and from Crosswind (push without a cone). **Requires the Fan Bolt cone helper.** Do not ship a Chebyshev blob.  
DURATION: instant  
SCALING: 8 follows dmg%; push 1 fixed.  
SYNERGIES: Open Pit / Fuse / Cinder / Slide one cell behind the cluster; Rank Lock holds the wedge; Body Check an ally out of the fan.  
COUNTERPLAY: Step to the back-diagonal; Barrier a spoke; hug the caster (Chebyshev 0 excluded). Self Anchor ignores the push but still takes 8.  
POWER_BUDGET: Heavy. 8×2–3 + displacement. CD 3 and −2 damage vs Fan Bolt are the tax for the shove.  
AI_USAGE: `aiHint: "cone_push_if_two_and_landing_hurts"`. Queens / knights zone ≥ 1. Skip if no body would land on a hazard **and** Fan Bolt is in kit (cast Fan Bolt instead).  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 8`, `discoverySources: { pieceTypes: ["queen","knight"], levelZoneMin: 1 }`  
EDGE_CASES: Push after damage, same occupancy collision as `occupancy.ts` 482–496. Landing **must** tick hazards (MIMA-2026-08-31-005). Do not push allies. If a body dies to the 8, skip its push. Challenge: spell-hit damage through `recordChallengeDamageTaken`; landing lava/spikes through the existing environmental helper. Preview/live/execute share Fan Bolt’s cone helper.  
IMPLEMENTATION_COMPLEXITY: HIGH — depends on Wave-3 cone wire + first `applyPushback` cast caller on an AoE.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-gale-fan
effectType: damage
effectCategory: damage
spellType: damage
targetType: area
areaShape: cone
areaRadius: 3
range: 3
lineOfSight: true
hitsMultiple: true
aoe: true
hitsAllies: false
apCost: 4
mpCost: 0
damage: 8
cooldown: 3
usableByPlayer: true
usableByEnemy: true
isBaseSpell: false
effectParams: {"coneLength":3,"conePushDistance":1}
```

---

### SPELL_ID: `spell-twin-guard`

NAME: Twin Guard  
ROLE: POSITION — swap two allies (caster stays)  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: true  
COOLDOWN: 2  
EFFECT: **Not** `isSwap`. `effectParams: {"swapTwoAllies":true,"swapSearchRadius":3}`. Target one living **player-side** summon. Find the nearest **other** living player-side body within Chebyshev 3 of that target (the player counts; another summon counts). Swap those two through occupancy (vacated-pair). Caster does not move unless the caster **is** one of the two bodies (only if the player was the second body — then the player moves). If the only ally is the targeted summon and the player is outside the search radius, fizzle (AP spent). Distinct from Ward Interpose (always caster↔one ally), Pawn Trade (two hostiles), Swap (caster↔enemy).  
DURATION: instant  
SCALING: none.  
SYNERGIES: Bait Pylon / Mercy Font / Sentinel planted on a fuse — trade the safe body onto the trap’s neighbor; Goad the frontliner then trade them back; File Lance after they share a file.  
COUNTERPLAY: Isolate (one body); Self Anchor on a body that must not move; Claim Ward on a destination cell fizzles the whole swap.  
POWER_BUDGET: Standard utility, 0 damage, CD 2. Needs two player-side bodies to exist.  
AI_USAGE: `aiHint: "swap_two_allies_if_improves_frontline"`. Enemy caster: the two allies are **enemy-side** summons + maybe a leader. Skip if pack size < 2. Do not assign to kits that never summon.  
DISCOVERY_ELIGIBILITY: true. MULTI children: (1) observe+win from a summoner piece that uses this id; (2) claim `betrayal_witness`. First child wins. `pieceTypes: ["king","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Do not call `swapPositions(targetEnemyId)`. Three-body ties: nearest Chebyshev, then lowest id. Hazard on landing must tick (MIMA-2026-08-31-001). Player↔summon is a legal pair. Two summons is a legal pair. Caster-only (no summons) always fizzles.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — occupancy pair swap; new flag, not `isSwap` / not `swapTwoHostiles`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cut-in`

NAME: Cut In  
ROLE: CONTROL — act first at the **next round boundary**  
ACQUISITION: BOSS  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: No damage. `effectParams: {"actFirstNextRound":true}`. Writes a battle-only flag on the caster. When `currentTurnIndex` wraps past the last **living** entry (round boundary), the flagged combatant is moved to index 0 of the next round’s living list. Does **not** steal another unit’s `init` stat. Does **not** splice during the current actor. Does **not** write persisted `CharacterStatFields.init` / `saveBattleStats`. Distinct from Leech Tempo (`swapInitOrder` vs a target for 1 round), Haste (MP grant), Timestep (refill now). The decision is **spend 3 AP this round to take the first slot next round**.  
DURATION: until next round wrap or battle end  
SCALING: none.  
SYNERGIES: AP Sip the current threat so they cannot punish you before wrap; Ley Toll then Cut In then a nuke; Twin Gate so the first action is a teleport.  
COUNTERPLAY: Kill the flagged caster before wrap; Quiet Hex / Hex Toll the first action; Root them so the stolen slot is a stranded turn.  
POWER_BUDGET: Standard utility, CD 4. Power is tempo, not a number.  
AI_USAGE: `aiHint: "cut_in_if_not_first_and_nuke_ready"`. Skip if already first in the public strip, or if no damaging id will be off cooldown at wrap. Boss `starborn_queen` kit.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true` on first victory vs `starborn_queen`. Observation of the id during that fight is **not** required (BOSS door). Enemies may still demonstrate it (`usableByEnemy: true`).  
EDGE_CASES: **Implementation is an explicit turn-order PR.** Do not edit RAF, damage math, or map gen. Multiple Cut Ins: last writer wins (one first-slot). If the flagged unit dies before wrap, drop the flag. Chaos Initiative map modifier: apply Cut In **after** that modifier’s shuffle, still at wrap only. Do not change `InitiativeStrip` layout beyond showing a “NEXT: first” pip from the existing effect list. Challenge: AP spend is `recordChallengeApSpend`; this is not a hit.  
IMPLEMENTATION_COMPLEXITY: HIGH — round-wrap queue rewrite; must not touch the current actor.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-after-verse`

NAME: After Verse  
ROLE: DAMAGE / SUPPORT — manual echo of **your last resolved spell this turn**  
ACQUISITION: BOSS  
AP_COST: 2  
RANGE: (copied from the echoed id’s live range)  
TARGET_TYPE: (copied)  
LOS: (copied)  
COOLDOWN: 2  
EFFECT: `effectParams: {"echoLastResolvedThisTurn":true,"echoPayloadMul":0.5,"echoDenySelf":true}`. Legal only if the caster already **successfully resolved** (`castResult === "cast"`) a different owned spell id **this turn**. Re-resolve that id at **50%** `damage` / `healAmount` / `dotDamage` (round half up, min 1 if the original was > 0) against a **newly chosen legal target** using that id’s targeting metadata. AP paid is After Verse’s 2, not the original’s AP. MP / HP riders on the original **do not** re-fire (Ley Toll charges, Sacrifice HP, Sanguine Toll HP/MP stay spent). Distinct from `spell-echo-cast` (primes the **next** spell, 50%, once per **battle**, AP 4, Mirror Sovereign, `echoDenyIds` summons/timestep/sacrifice). After Verse is **manual**, **same-turn**, **last-resolved**, and a **new id**.  
DURATION: instant (replays one id)  
SCALING: 50% of the echoed row’s current upgraded numbers.  
SYNERGIES: Frost then After Verse on a second body; Heal then After Verse on a summon; Fan Bolt then After Verse is illegal if the second wedge is empty (fizzle, 2 AP spent).  
COUNTERPLAY: Force the first cast to fizzle (no “last resolved”); Sidestep the replay; Quiet Hex the verse itself.  
POWER_BUDGET: Cheap AP. Half a Frost is 10 — Strike-like — but you already spent the original. CD 2 stops verse-loops.  
AI_USAGE: `aiHint: "echo_last_if_second_legal_target"`. Pale Archivist / scribe casters. Skip if no last-resolved id, or if the echoed id is in the denylist, or if no second legal tile.  
DISCOVERY_ELIGIBILITY: first victory vs `pale_archivist`. `usableByEnemy: true` on that boss.  
EDGE_CASES: Denylist (explicit ids, not names): `spell-after-verse`, `spell-echo-cast`, `spell-timestep`, `spell-sacrifice`, any `isSummon`, `spell-twin-gate`, `spell-morrow-step`, `spell-cut-in`, `spell-ley-toll` (amp is not a payload). Summon **kits** cannot be echoed. If the original was a self-buff with duration, replay refreshes duration at the same modifier (not 50% of a duration). Targeting preview must use the echoed id’s `targetType` / LoS / range, not After Verse’s stub. Last-resolved is **per caster**, cleared at that caster’s turn start. Fizzle of After Verse does not clear last-resolved. Challenge: payload hits go through existing damage/heal recorders; After Verse AP is the only AP for the replay.  
IMPLEMENTATION_COMPLEXITY: HIGH — recast pipeline must copy metadata, not `spell.name`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-sanguine-toll`

NAME: Sanguine Toll  
ROLE: DAMAGE — HP + MP hybrid nuke  
ACQUISITION: BOSS  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: `mpCost: 1` (first-class). `effectParams: {"hpCostPct":0.15,"hpCostFloorRemain":1}`. Illegal if current MP < 1 **or** current HP ≤ 1. On resolve: pay 15% of **current** HP (round half up, leave at least 1) via `recordChallengeSelfHpLoss`; debit 1 MP on the same `castResultSpendsAp` path Ley Toll needs; deal **24** to the target. Distinct from Sacrifice (20% HP ×3 damage, no MP, range 1), Ley Toll (2 MP, no HP, no damage), Undertow (1 MP + attract 8), Crimson Pact (HP pay, next physical lifesteals). Discovery W3 forbade a third *walk-positioning* MP spender; this is the deferred **hybrid payload** hole — the third `mpCost > 0` paper row, not Undertow-2.  
DURATION: instant  
SCALING: 24 follows dmg%; HP% and mpCost fixed.  
SYNERGIES: Soul Sip to pay the MP; AP Sip the target so they cannot walk off; Mark the tile; Ley Toll does **not** multiply this (Ley Toll is next-spell amp — it can, and that is the greed line: 2 MP + 1 MP + 15% HP).  
COUNTERPLAY: Stay at Chebyshev 4; Quiet Hex; force them to walk the last MP onto ice first.  
POWER_BUDGET: Standard-plus. Frost is 20 for 3 AP 0 MP 0 HP. This is 24 for 3 AP + 1 walk + 15% HP + CD 2.  
AI_USAGE: `aiHint: "hybrid_nuke_if_hp_gt_40pct_and_mp_ge_1"`. Skip if HP% < 40 (self-loss would drop them into Last Ember range) or MP < 1. `starved_vampire_pawn`.  
DISCOVERY_ELIGIBILITY: first victory vs `starved_vampire_pawn`.  
EDGE_CASES: **Illegal to ship without the MP gate+debit** (`executeCastAttempt` 17162–17204 is AP-only today). Self-HP is `recordChallengeSelfHpLoss`, never `playerTakesDamage` (Untouchable / challenge). `no_healing` is unaffected (this is a cost, not a heal). Do not run walk `applyMpCost` on spell MP. Fizzle after the HP/MP check must not take HP/MP if the live gate rejected targeting; a FAIL roll after payment **does** consume (same as AP). Floor remain 1: a 7 HP caster pays 1 (15% of 7 = 1.05 → 1) and lives at 6.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — MP gate (shared with Ley Toll / Undertow) + self-HP helper already specified.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-sanguine-toll
effectType: damage
effectCategory: damage
spellType: damage
targetType: enemy
areaShape: single
apCost: 3
mpCost: 1
damage: 24
range: 3
lineOfSight: true
cooldown: 2
usableByPlayer: true
usableByEnemy: true
isBaseSpell: false
effectParams: {"hpCostPct":0.15,"hpCostFloorRemain":1}
```

---

### SPELL_ID: `spell-cross-flank`

NAME: Cross Flank  
ROLE: DAMAGE — pincer (two allied bodies adjacent)  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 1  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 0  
EFFECT: Physical. Deal **14**. Legal **only** if at least **two** living allied bodies (caster counts) occupy Chebyshev-1 cells of the **target** (`effectParams: {"requireAdjacentAllyCount":2}`). Typical: caster adjacent + one summon adjacent on another cell. Distinct from Rear Cut (walk-facing / not-front-orthogonal, 16, no ally required) and Strike (always legal, 10). If illegal, fizzle (AP spent — still observed).  
DURATION: instant  
SCALING: 14 follows dmg%; count 2 fixed.  
SYNERGIES: Twin Guard to park the second body; Body Check a summon onto the pincer cell; Goad so they cannot walk off the pair; Bait Pylon is a body (1 HP counts).  
COUNTERPLAY: Kill or shove the second body; stand in a 1-wide corridor so only one adjacent cell exists; Barrier an adjacent cell.  
POWER_BUDGET: Cheap. 14 vs Strike 10 is the pincer tax. Needs a second body.  
AI_USAGE: `aiHint: "pincer_if_two_adjacent"`. Flanker / summoner. Skip if pack size < 2; use Strike.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 1`. Families that already demonstrate Rear Cut may **also** demonstrate this — different id, different gate.  
EDGE_CASES: Occupied adjacent includes diagonals (Chebyshev 1 = 8-neighborhood). Dead bodies do not count. Enemy AI: allied = enemy-side. Fail closed if occupancy is missing. Do not read sprite `currentView`. Do not name-check “flank.” Challenge: physical hit through existing helpers.  
IMPLEMENTATION_COMPLEXITY: LOW — adjacency count on occupancy.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-bias-ray`

NAME: Bias Ray  
ROLE: DAMAGE direct — diagonal-only poke  
ACQUISITION: ACHIEVEMENT  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 1  
EFFECT: `diagonal: true`, `minRange: 1`, `maxRange: 4`, `modifiableRange: true`. Deal **12**. Legal only on `|dx|===|dy|` (`targeting.ts` 646–649 already honors `spell.diagonal`). Distinct from File Lance (`targetType: "line"`, cardinal ray, per-body), Far Sting (distance-scaled, any facing), Glass Shot (min-range sniper, flat), and backend `shadow_strike` (not in `SPELL_ID_CATALOG`; **do not reuse that id**). First frontend-catalog row that sets `diagonal`.  
DURATION: instant  
SCALING: 12 follows dmg%; geometry fixed.  
SYNERGIES: Lens Share / Overcast extend `modifiableRange`; Rank Lock on a diagonal; Open Pit on the escape cardinal.  
COUNTERPLAY: Stand cardinal to the caster; Barrier the diagonal spoke.  
POWER_BUDGET: Standard-cheap. Frost is 20 at 4 on any facing. This is 12 on a 4-diagonal with no LoS.  
AI_USAGE: `aiHint: "diagonal_if_on_bias"`. Bishops. Skip if the player is cardinal and Frost is in kit.  
DISCOVERY_ELIGIBILITY: claim `first_blood` (plus existing 50 Doka). `usableByEnemy: true` so bishops can demonstrate; grant is the feat, not observe+win.  
EDGE_CASES: `targetType: "enemy"` + `diagonal` already fizzles off-axis in the live gate. Do not add a name table. Do not import `shadow_strike` into `SPELL_ID_CATALOG`. Attack Nearest must use the same diagonal gate (origin = player tile).  
IMPLEMENTATION_COMPLEXITY: LOW — flags already wired; data-only once the catalog split exists.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-bias-ray
effectType: damage
spellType: damage
targetType: enemy
areaShape: single
diagonal: true
minRange: 1
maxRange: 4
modifiableRange: true
lineOfSight: false
apCost: 3
mpCost: 0
damage: 12
range: 4
cooldown: 1
usableByPlayer: true
usableByEnemy: true
isBaseSpell: false
effectParams: {"diagonalOnly":true}
```

---

### SPELL_ID: `spell-draw-together`

NAME: Draw Together  
ROLE: POSITION — two hostiles attract toward each other  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: **Not** attract-to-caster. `effectParams: {"pairAttractDistance":1,"swapSearchRadius":4}`. Target one living hostile. Find the nearest **other** living hostile within Chebyshev 4 of that target. Each body `applyAttract` **1** toward the **integer midpoint** of the pair (same collision rules as `occupancy.ts` 537+). Caster does not move. If no second body, fizzle. Distinct from Hook Line / Undertow / Leash (toward caster), Sinkhole (toward a painted tile), Void Collapse (attract-all + 80), Pawn Trade (swap).  
DURATION: instant  
SCALING: none.  
SYNERGIES: Inferno / Frost Nova / Gale Fan / Cross Cut after they share a cell-neighborhood; Fuse the midpoint; Chain Lightning bounce.  
COUNTERPLAY: Isolate; Self Anchor; stay outside the 4-radius pair.  
POWER_BUDGET: Standard utility, 0 damage.  
AI_USAGE: `aiHint: "pair_attract_if_two_and_aoe_ready"`. Skip if pack size < 2 or if pulling would un-cluster a tank from a squishy the AI wants split.  
DISCOVERY_ELIGIBILITY: MULTI: observe+win from static / coil casters **or** first victory vs `lord_of_static`. First child wins.  
EDGE_CASES: Midpoint of (2,2) and (4,6) is (3,4). Attract 1 toward that cell, not a swap. Odd distances: both move 1 or collide and stop. Same-cell midpoint with Chebyshev 1 pair: attract 1 may be a no-op (already adjacent) — still a successful cast (they were already together). Hazards on landing must tick (MIMA-005). Do not call Void Collapse.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — pair midpoint + two `applyAttract` calls.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-ap-sip`

NAME: AP Sip  
ROLE: CONTROL — zero-sum current AP steal  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: `effectParams: {"stealApAmount":1}`. If target **current** AP < 1, fizzle. Else target current AP −1 (floor 0) and caster current AP +1 (cap at that unit’s max AP). This-turn only; does not write persisted `CharacterStatFields.ap`. Distinct from Drain Courage (AP−1 **debuff duration**, caster does not gain, plus 18/9 drain), Loan Tempo / Tempo Gift (grant, no steal), Hex Toll (next **spell** +1 AP), Debt Mark (next **walk** +1 AP).  
DURATION: this turn’s leftover pools  
SCALING: none.  
SYNERGIES: Cut In (steal then act first next round); Quiet Hex the emptied caster; Sanguine Toll they now cannot walk off.  
COUNTERPLAY: Spend leftover AP before they sip; stay at 0 leftover (they fizzle).  
POWER_BUDGET: Cheap. Strike-cost for a tempo swap.  
AI_USAGE: `aiHint: "steal_ap_if_target_leftover_ge_1"`. Skip if target current AP is 0 (use Drain Courage / Frost instead). Controllers / bishops zone ≥ 1.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Caster already at max AP: they still steal (target loses 1) and the +1 is wasted — that is legal and the decision. Enemy AI vs player: reads public leftover AP from the initiative strip / orbs, not hidden stats. Challenge: not a damage event; AP spend is the 2 on this spell. Do not touch `saveBattleStats` AP.  
IMPLEMENTATION_COMPLEXITY: LOW — current AP integers already on combatants.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-body-check`

NAME: Body Check  
ROLE: SUPPORT / POSITION — shove an ally 1 away from the caster  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 2  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 1  
EFFECT: `effectParams: {"allyPushDistance":1,"allyPushFromCaster":true}`. Target a living player-side summon. `applyPushback` 1 on **that ally**, away from the caster. No damage. Distinct from Leash Hook (pull ally **toward** caster), Shoulder Bash (hostile), Back Step (self). You need a body; empty-tile blink is Morrow Step.  
DURATION: instant  
SCALING: none.  
SYNERGIES: Off a fuse / pit / Cast Snare; onto a Twin Gate pad; onto a Cross Flank cell; off Hold Ground’s overwatch.  
COUNTERPLAY: Self Anchor the summon; park them so the 1-step is blocked (collision stops, AP spent).  
POWER_BUDGET: Cheap tool.  
AI_USAGE: `aiHint: "shove_ally_off_hazard_or_onto_pincer"`. Guardian / summoner. Skip if no summon or if the landing is worse (lava while HP% < 40).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Targeting already allows ally = player-side summon (`targeting.ts` 528–545). Pushing the **player** is illegal on this card (targetType ally summon only — if the implementation allows ally-self, reject self). Landing ticks hazards (MIMA-005) — shoving a Wisp onto lava is a real decision (`no_healing` does not care; the Wisp takes the tick). Challenge: environmental helper if the ally is the player (it is not, on this card).  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — first ally-scoped `applyPushback`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cast-snare`

NAME: Cast Snare  
ROLE: TERRAIN — tile taxes spells **cast from** it  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: Paint one free floor cell for **2** turns (`effectParams: {"originCastApTax":1,"originCastDuration":2}`). Visible carved glyph (not hidden — Tripwire remains the hidden trap). Any unit whose **caster cell** equals this tile when they confirm a spell pays **+1 AP** on that spell (after map `applyApCost`). If they cannot pay, the cast is `no_ap` (no effect, no observation of the *inner* spell; the snare itself was already observed when painted). Walk is unaffected. Distinct from Glyph Tax (enter-AP zone + Mark), Quiet Hex / Hex Toll (unit next-spell, not tile), Debt Mark (next walk), Mire Sheet (enter MP).  
DURATION: 2 turns  
SCALING: tax 1 fixed.  
SYNERGIES: Body Check / Gale Fan / Draw Together onto the glyph; Rank Lock so they cannot step off before they want to cast; Twin Gate pad **on** the glyph is mean.  
COUNTERPLAY: Walk off before casting; melee from Chebyshev 1 off the glyph; Barrier overwrite (last writer wins, same as Wave 3 terrain).  
POWER_BUDGET: Standard utility.  
AI_USAGE: `aiHint: "paint_origin_tax_on_player_cast_cell"`. Skip if the player already has 0 leftover AP and must walk (they will step off). Scribes / hex.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Attack Nearest origin is the **player** tile (`attackNearestLiveCasterPos`) — if the player stands on the glyph, Attack Nearest pays +1. Summon casts from the summon cell. Do not use `isTrap` (that still places a barrier, `spellEngine.ts` 442–445). Do not block LoS or walk. Timestep refill does not bypass the +1. Challenge `hard_3` (under 8 AP/turn): the +1 counts.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — origin-cell check in the unified AP planner (`planPlayerCastAttempt` / enemy equivalent), not a name table.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-bait-pylon`

NAME: Bait Pylon  
ROLE: SUMMONS — stationary intercept of the next hostile spell aimed at the owner  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "bait"` (enum, **not** a name parse), `summonLifespan: 3`. 1 HP, 0 MP, 0 walk, kit `[spell-bait-eat]`. While the pylon lives and is Chebyshev ≤ 2 from its owner, the **next** hostile spell that would apply damage/debuff/DoT to the owner is redirected to the pylon (`effectParams: {"interceptOwnerSpells":true,"interceptRange":2}`). The pylon dies on that intercept (even if leftover HP would remain). AoE that includes both owner and pylon hits the pylon only for the owner’s share (the rest of the wedge still hits others). Distinct from Mirror (reflect to caster), Bastion (empty wall), False Retreat (self decoy blink), Pain Link / Life Tether (share, not eat).  
DURATION: lifespan 3 or until intercept  
SCALING: intercept is binary. Pylon HP stays 1.  
SYNERGIES: Cross Flank (the pylon is a body); Planted Stance on the owner; Goad so they throw the spell you eat.  
COUNTERPLAY: Kill the pylon with Strike first; aim the wedge so the owner is outside intercept range; wait 3 turns.  
POWER_BUDGET: Heavy utility, CD 3, 0 damage.  
AI_USAGE: `aiHint: "plant_bait_if_owner_is_next_spell_target"`. Guardian / summoner elites. Skip if a pylon already lives.  
DISCOVERY_ELIGIBILITY: true. Elite/champion tag. `generationMin` stamp is Discovery’s job (suggest 2).  
EDGE_CASES: `summonAI: "bait"` must be a **new allowed string** in admin summon validation (unknown `summonAI` is rejected today). Do not fall back to `pieceType.includes("pylon")`. Intercept does not fire on walks, lava, or Sacrifice self-HP. Mirror vs Bait: if both up, Bait eats **before** Mirror (explicit order in the incoming-hit pipeline, same layer as Sidestep `evadeNextHits`). Challenge: redirected hit is not damage to the player. Nested id `spell-bait-eat` is `NOT_PLAYER_LEARNABLE`.  
IMPLEMENTATION_COMPLEXITY: HIGH — intercept pipeline + new summon AI that never paths.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-bait-eat`

NAME: Bait Eat  
ROLE: SUMMONS kit — no-op marker the intercept reads  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 0  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 0  
EFFECT: Never on a player bar. Exists so `summonKit` is a real id, not an empty array the AI treats as Strike. The intercept is the pylon’s **presence** + `interceptOwnerSpells`, not this row’s damage.  
DURATION: n/a  
SCALING: n/a  
SYNERGIES: n/a  
COUNTERPLAY: n/a  
POWER_BUDGET: n/a  
AI_USAGE: Pylon AI never casts this.  
DISCOVERY_ELIGIBILITY: false. Never observed as a grant.  
EDGE_CASES: `usableByPlayer: false`, `usableByEnemy: false`.  
IMPLEMENTATION_COMPLEXITY: LOW  
STATUS: PROPOSED

---

### SPELL_ID: `spell-morrow-step`

NAME: Morrow Step  
ROLE: POSITION — delayed self-teleport  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: Paint one free floor cell. `effectParams: {"delayedBlinkTurns":1}`. At the **start** of the caster’s next turn, if that cell is still `isCellFree`, teleport the caster there. If occupied / pit / barrier / void / portal, the blink **fails closed** (no move, log fizzle, no second AP). Distinct from Mist Step / Phase Slip / Vault (instant), Twin Gate (two walkable pads), Swap (needs a body). Arming is the technique.  
DURATION: until next turn start  
SCALING: none.  
SYNERGIES: Cast Snare on the painted cell (you pay +1 when you arrive and cast); Open Pit next to it; Cut In so the arrival turn is first in the round.  
COUNTERPLAY: Stand on the cell; Barrier it; Body Check a summon onto it; kill the caster before their next start.  
POWER_BUDGET: Cheap. CD 3 because a guaranteed reposition is strong if uncontested.  
AI_USAGE: `aiHint: "paint_blink_if_cell_stays_free"`. Kiters. Skip if they need to walk **this** turn (2 AP now is expensive).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop","knight"]`, `levelZoneMin: 1`  
EDGE_CASES: Observation = paint (AP spent). Arrival is not a second observe. Do not use map `portals`. Twin Gate pads: a Morrow cell that coincides with a pad is legal; arrival then stepping through the pad is a later decision. Death before next start: drop the mark. Controlled-summon walk must not treat the mark as occupancy. Hazard on arrival must tick (MIMA-005 analogue for blink landings — Swap’s MIMA-001 is the same class: **must tick**).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — turn-start hook on the caster, not RAF.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-surplus-ward`

NAME: Surplus Ward  
ROLE: DEFENSE — evade the next hit **if leftover AP remains**  
ACQUISITION: ACHIEVEMENT  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Reuses Wave-3 `evadeNextHits` (consume **before** `dealDamage`, not a miss %). `effectParams: {"evadeNextHits":1,"requireLeftoverAp":2}`. After paying this spell’s 2 AP, caster current AP must be **≥ 2** or the evade **does not apply** (AP still spent, CD still written — a failed greed). Distinct from Sidestep Ward (unconditional evade, `critical_striker`) and Ward Plate (absorb). Decision: keep 2 AP in the bank instead of spending out.  
DURATION: until 1 incoming damaging hit or battle end  
SCALING: none.  
SYNERGIES: Haste does not help (AP, not MP); Loan Tempo / AP Sip to stay ≥ 2; Cut In so the banked AP is spent first next round.  
COUNTERPLAY: Goad a cheap Strike to eat the charge; Hex Toll so the next spell costs the bank.  
POWER_BUDGET: Cheap AP, CD 3, feat-gated. Weaker than Sidestep because of the leftover gate.  
AI_USAGE: `aiHint: "evade_if_leftover_ap_ge_2_after_pay"`. Skip if current AP < 4 (cannot satisfy leftover).  
DISCOVERY_ELIGIBILITY: claim `doka_hoarder` (plus existing 200 Doka). Economy feat used as a **non-damage identity** (SDE W3 leftover). `usableByEnemy: true` for demonstration; grant is the feat.  
EDGE_CASES: Same consume pipeline as Sidestep. Do not read `CharacterStatFields.evasion`. Do not read the Doka wallet in combat (the feat is the door, not a runtime check). `requireLeftoverAp` is **after** this spell’s debit. Timestep after a failed greed does not retroactively attach the charge.  
IMPLEMENTATION_COMPLEXITY: LOW — Sidestep consume + leftover AP check.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-sated-fang`

NAME: Sated Fang  
ROLE: DAMAGE — high-HP% gated physical  
ACQUISITION: ACHIEVEMENT  
AP_COST: 2  
RANGE: 1  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 1  
EFFECT: Physical. Deal **18**. Legal only if caster `currentHp / maxHp ≥ 0.70` (`effectParams: {"requireHpPctMin":0.7}`). Else fizzle (AP spent). Distinct from Last Ember / Last Ward / Coup de Grace (low-HP / execute) and Strike (always legal, 10). Decision: **stay healthy** to keep the nuke; spending Sanguine Toll or Sacrifice can turn this card off.  
DURATION: instant  
SCALING: 18 follows dmg%; 70% fixed.  
SYNERGIES: Blood Mend / Wisp to stay ≥ 70%; do **not** pair with Sanguine Toll the same turn unless leftover HP% still clears 70 after the cost.  
COUNTERPLAY: Chip them under 70%; Cursed Wound anti-heal; keep them at range 2.  
POWER_BUDGET: Cheap AP, 18 vs Strike 10, melee, HP gate.  
AI_USAGE: `aiHint: "sated_fang_if_hp_pct_ge_70_and_adjacent"`. Skip under 70% (use Strike / drain).  
DISCOVERY_ELIGIBILITY: claim `rich_vampire` (plus existing 1000 Doka). `usableByEnemy: true` on vampire / pawn kits for demonstration.  
EDGE_CASES: Fail closed if `maxHp` is 0. Percent uses current battle HP, not catalog. Challenge: physical hit. Pacifist: this is a damaging spell (fails pacifist). Do not read Doka.  
IMPLEMENTATION_COMPLEXITY: LOW  
STATUS: PROPOSED

---

### SPELL_ID: `spell-eclipse-fold`

NAME: Eclipse Fold  
ROLE: CONTROL — player-side summons skip their next turn  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 5  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 5  
EFFECT: `effectParams: {"skipPlayerSummonTurns":1}`. Every living **player-side** summon is flagged to skip its next time it comes up in `turnOrder` (lifespan still ticks). The player is not skipped. Distinct from Sovereign Fold (folds two player-side **bodies** together), Null Brand (lock `isSummon` **casts**), Kennel Lock (leash allied pets). Final Pawn / brood identity. Never written to owned ids.  
DURATION: one skip each  
SCALING: none.  
SYNERGIES: (witness) player must recast summons; Bait Pylon dies on timer.  
COUNTERPLAY: Do not summon; recast after the skip; Cut In does not unskip summons.  
POWER_BUDGET: Signature. 5 AP CD 5.  
AI_USAGE: `aiHint: "skip_player_summons_if_count_ge_2"`. Final Pawn phase 2. Skip if 0–1 player summons.  
DISCOVERY_ELIGIBILITY: false. Optional dim `UNKNOWN TECHNIQUE` log. `bossIds: ["final_pawn"]`.  
EDGE_CASES: Skip is a turn-order flag (same class as Cut In: explicit turn-order PR, wrap/advance only, not RAF). Controlled-summon UI must show the skip. Do not destroy the summons. Enemy-side summons are not skipped (the card is named from the player’s view when **they** witness it).  
IMPLEMENTATION_COMPLEXITY: HIGH — turn-advance skip list.  
STATUS: PROPOSED

---

## 6. Combination matrix (intended, not name-wired)

Resolve only via flags / tile maps / effect keys.

| Setup (metadata) | Payoff (metadata) | Decision |
| :--- | :--- | :--- |
| `areaShape: "cone"` + `conePushDistance` | `pitBlocksWalk` / `fuseTurns` / `hazardType: "ice"` | Fan them onto the trap |
| `swapTwoAllies` | `requireAdjacentAllyCount: 2` | Trade into a pincer |
| `actFirstNextRound` | `stealApAmount` | Empty them, then take the wrap |
| `echoLastResolvedThisTurn` | last id was Frost / Fan / Heal | Second body or second heal, half pay |
| `hpCostPct` + `mpCost: 1` | `requireHpPctMin: 0.7` | Sanguine Toll can **turn off** Sated Fang |
| `diagonalOnly` | `allyRangeDelta` | Range war on the bias |
| `pairAttractDistance` | `hitsMultiple` Inferno / Gale | Cluster then pay AoE |
| `allyPushDistance` | Twin Gate pad / Cast Snare | Rescue or tax |
| `originCastApTax` | Attack Nearest origin = player tile | Standing on the glyph taxes Strike |
| `interceptOwnerSpells` | `tauntNextHit` (Goad) | They throw the spell the pylon eats |
| `delayedBlinkTurns` | dest `isCellFree` at turn start | Contest the cell or let them leave |
| `requireLeftoverAp` | `evadeNextHits` | Bank 2 AP or fail the greed |
| `skipPlayerSummonTurns` | Bait / Wolf / Wisp | Witness-only: recast or play body-less |
| `mpCost: 1` Sanguine | `stealMpAmount` Soul Sip | Sip to afford the hybrid |

Map modifiers stay metadata-only. Frozen/Slime × **walk** MP does not inflate Sanguine Toll’s `mpCost`. Arcane Surge × Cast Snare is `applyApCost` then +1.

Mechanic Interaction Matrix still OPEN (do not “fix” in this spec, but do not ship new movement that repeats the gap):

- Swap × hazards (MIMA-2026-08-31-001) — Twin Guard **must** tick dest hazards.
- Push/pull × hazards (MIMA-2026-08-31-005) — Gale Fan / Draw Together / Body Check / Morrow Step arrival use occupancy movers; landing must tick.
- Controlled-summon walk × occupancy (MIMA-2026-08-31-002) — Body Check / pincer cells must apply to summon-control walks.

---

## 7. Recommended unlock order (pacing)

Discovery designer should treat these as **bands**, not a shop list.

| Band | Spells | Why |
| :--- | :--- | :--- |
| First feat | Bias Ray (`first_blood`) | Diagonal targeting lesson without a combat unlock tree |
| Early observe | AP Sip, Body Check, Cross Flank | Tempo steal, ally shove, pincer |
| Mid | Cast Snare, Morrow Step, Gale Fan | Origin tax, delayed blink, cone+push |
| Feat surplus / wealth | Surplus Ward (`doka_hoarder`), Sated Fang (`rich_vampire`) | Leftover-AP evade; stay-healthy melee |
| Elite | Bait Pylon | Intercept pet |
| Multi | Twin Guard (`betrayal_witness` or summoner observe), Draw Together (`lord_of_static` or observe) | Two-body board |
| Boss recap | After Verse (`pale_archivist`), Sanguine Toll (`starved_vampire_pawn`), Cut In (`starborn_queen`) | Echo, hybrid cost, round-wrap tempo |
| Witness only | Eclipse Fold (`final_pawn`) | Skip summons stays identity |

**Still required for any of this to matter:** Discovery’s innate-four split. This pass does not edit `spellData.ts`.

**Prerequisite engines (not this pass, not optional if those cards ship):**

1. `executeCastAttempt` MP gate+debit (Ley Toll / Undertow / Sanguine Toll).
2. `areaShape: "cone"` helper (Fan Bolt / Gale Fan).
3. Round-wrap flag reader (Cut In / Eclipse Fold) — dedicated turn-order PR.

---

## 8. Implementation notes (for a later, explicit implementation PR)

1. **MP debit:** `executeCastAttempt` (`WorldExploration.tsx` 17162–17204) must gate and spend `Number(spell.mpCost)` on the same success/fizzle path as AP. Until that exists, Sanguine Toll’s MP half is a bug. Do not use walk `applyMpCost` modifiers on spell MP. Shared with Ley Toll / Undertow.  
2. **Cone:** Gale Fan **reuses** Fan Bolt’s helper. Do not invent a second wedge. Push runs per surviving hit after damage.  
3. **`diagonal`** is already live on enemy/area paths. Bias Ray is data + catalog split. Do not promote `shadow_strike`.  
4. **Twin Guard ≠ `isSwap` ≠ `swapTwoHostiles`.** Ally-scoped pair.  
5. **Cut In / Eclipse Fold** read flags at round wrap / turn advance. Do not splice the current actor. Do not touch RAF.  
6. **After Verse** copies the last resolved **id’s metadata**. Denylist is an id list. Never `spell.name`. Do not reuse `spell-echo-cast`.  
7. **Sanguine Toll** HP is `recordChallengeSelfHpLoss` (floor 1). MP is the shared spell-MP debit.  
8. **Cross Flank** counts occupancy, not `currentView`.  
9. **Cast Snare** is not `isTrap` (trap still places a barrier).  
10. **`summonAI: "bait"`** is a new allowed enum value. Admin validation must accept it. Nested `spell-bait-eat` is not player-learnable.  
11. **Surplus Ward** reuses `evadeNextHits`. Do not wire `CharacterStatFields.evasion`.  
12. Recap grant uses the reward funnel + `commitSpellDiscoveries` / `unlockOwnedSpell`, not `updateCharacter`.  
13. Do not touch RAF, map generation, or damage math. Turn order only in the dedicated wrap PR.  
14. Add ids to `SPELL_ID_CATALOG` **only when implemented**, together with `spellData.ts` and kits.  
15. Do **not** append these ids to `starterSpells` as `isBaseSpell`.  
16. **No fourth** pure walk-MP positioning snipe in a later same-week Discovery stamp.

---

## 9. Explicit non-goals this pass

- No production TypeScript / Motoko / Candid edits.  
- No new damage formula, crit, or RES/SR identity.  
- No shop-bought spells.  
- No fourth RES% buff.  
- No second Chain Lightning, second absorb, second self-cleanse, second **self** range-buff.  
- No player-owned silence (Hex of Silence stays BOSS_ONLY).  
- No 12-AP Void Collapse clone.  
- No third File Lance / Blood Tithe.  
- No `spell-echo-cast` clone (After Verse is a different id and a different verb).  
- No mid-turn `turnOrder` splice.  
- No fourth walk-MP snipe (Sanguine Toll is the hybrid exception).  
- No wiring of `CharacterStatFields.evasion` as a percent.  
- No restamp of `easy_*` / `hard_*` / `legendary_*` challenge doors.

---

## 10. Proposal index

| ID | Acquisition | Complexity | Primary hole filled |
| :--- | :--- | :--- | :--- |
| `spell-gale-fan` | ENEMY_DISCOVERY | HIGH | Cone + knockback hybrid |
| `spell-twin-guard` | MULTI_SOURCE | MEDIUM | Two-ally swap |
| `spell-cut-in` | BOSS | HIGH | Round-boundary initiative |
| `spell-after-verse` | BOSS | HIGH | Player-owned echo (not `spell-echo-cast`) |
| `spell-sanguine-toll` | BOSS | MEDIUM | HP+MP hybrid payload |
| `spell-cross-flank` | ENEMY_DISCOVERY | LOW | Pincer (beyond Rear Cut) |
| `spell-bias-ray` | ACHIEVEMENT | LOW | Diagonal catalog poke |
| `spell-draw-together` | MULTI_SOURCE | MEDIUM | Pair attract |
| `spell-ap-sip` | ENEMY_DISCOVERY | LOW | Zero-sum AP steal |
| `spell-body-check` | ENEMY_DISCOVERY | LOW–MEDIUM | Ally shove |
| `spell-cast-snare` | ENEMY_DISCOVERY | MEDIUM | Cast-origin tile tax |
| `spell-bait-pylon` | ELITE | HIGH | Intercept summon |
| `spell-bait-eat` | NOT_PLAYER_LEARNABLE | LOW | Pylon kit marker |
| `spell-morrow-step` | ENEMY_DISCOVERY | MEDIUM | Delayed self-teleport |
| `spell-surplus-ward` | ACHIEVEMENT | LOW | Leftover-AP evade |
| `spell-sated-fang` | ACHIEVEMENT | LOW | High-HP% gate |
| `spell-eclipse-fold` | NOT_PLAYER_LEARNABLE | HIGH | Skip player summons |

All STATUS: **PROPOSED**.

---

## 11. Source map (read-back)

| Topic | File | Lines |
| :--- | :--- | :--- |
| Live 32-id catalog | `src/frontend/src/data/spellData.ts` | 9–691 |
| Forced `isBaseSpell` | `src/frontend/src/components/WorldExploration.tsx` | 2395–2408 |
| Owned union + library filter call | `src/frontend/src/components/WorldExploration.tsx` | 2410–2434 |
| Backend library filter | `src/frontend/src/utils/adminSafety.ts` | 712–718 |
| `SPELL_ID_CATALOG` | `src/frontend/src/data/bossKits.ts` | 29–62 |
| `SpellConfig` / `areaShape` / evasion | `src/frontend/src/types/gameTypes.ts` | 64, 160–241 |
| `CharacterStatFields` (12 fields) | `src/frontend/src/types/gameTypes.ts` | 53–66 |
| Ally targeting | `src/frontend/src/engine/targeting.ts` | 528–545 |
| Line targeting (unused by data; no `linear`) | `src/frontend/src/engine/targeting.ts` | 576–617 |
| `diagonal` / `linear` on enemy/area | `src/frontend/src/engine/targeting.ts` | 637–649, 711–712 |
| Area = Chebyshev, no `areaShape` | `src/frontend/src/engine/targeting.ts` | 690–727 |
| `hitTiles` AoE | `src/frontend/src/engine/castHelpers.ts` | 105–117 |
| Trap stub = barrier | `src/frontend/src/engine/spellEngine.ts` | 442–445 |
| `isSwap` → `swapPositions` | `src/frontend/src/engine/spellEngine.ts` | 637, 767–768 |
| Push / attract unused by casts | `src/frontend/src/engine/occupancy.ts` | 482–537 |
| Portals impassable | `src/frontend/src/engine/occupancy.ts` | 13–14, 40 |
| AP-only cast debit | `src/frontend/src/components/WorldExploration.tsx` | 17162–17204 |
| MP display only | `src/frontend/src/components/SpellbookModal.tsx` | 966–977 |
| Enemy kits (owned ids) | `src/frontend/src/engine/enemyAI.ts` | 163–185 |
| Summon name fallback | `src/frontend/src/engine/enemyAI.ts` | 217–221 |
| `buildEnemyKit(levelZone)` | `src/frontend/src/components/WorldExploration.tsx` | 11920 |
| Backend six | `src/backend/lib/admin.mo` | 168–191 |
| Feats | `src/backend/lib/admin.mo` | 309–326 |
| Challenges | `src/frontend/src/utils/challengeCompletion.ts` | 44–109 |
| Boss ids | `src/frontend/src/types/bossTypes.ts` | 390–410 |
| OLD_SPELL_NAMES_SET | `src/frontend/src/components/WorldExploration.tsx` | 2356–2389 |

**Document status:** PROPOSED. Safe to review and implement in a later, explicit data PR. Not a license to land combat code in the same change as this spec.

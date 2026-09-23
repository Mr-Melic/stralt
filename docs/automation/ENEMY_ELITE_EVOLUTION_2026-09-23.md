# Enemy and Elite Evolution Design — Wave 6

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-09-23  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Sixth daily pass. New world-pack families that consume **SPELL_PROPOSALS Wave 5 verbs** (`SPELL_PROPOSALS_2026-09-22.md`, open PR #411): sprite-facing bonus via stored `currentView`, lock that field, hit the facing cell, walk-then-fizzle, ally teleport Chebyshev 3–4, two-cell self occupy, two-cell empty pylon, steal 1 remaining cooldown, brand +1 CD on the attacker’s id, redirect next hit to an adjacent ally, HP%-gated walk cell, +1 AP if they still act sooner this round, delayed 14 when they **become** current actor. Bosses stay on the existing catalog. Mute Thread / Queue Cut / False Cut stay **boss / closed-class** — not world-pack CORE.

**Does not replace:**
- [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md) (Wave 1, 22 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-01.md`](./ENEMY_ELITE_EVOLUTION_2026-09-01.md) (Wave 2, 14 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-02.md`](./ENEMY_ELITE_EVOLUTION_2026-09-02.md) (Wave 3, 14 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-e9f5/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-21.md) (Wave 4, 15 family sheets — open PR #349; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-22.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-3823/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-22.md) (Wave 5, 15 family sheets — open PR #405; not on `main` yet)

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 5

Re-read against `HEAD` `0f5363f` (Merge PR #332). Wave 5 closed as docs in the 2026-09-22 pass (PR #405). SPELL_PROPOSALS Wave 5 (PR #411) stamped the six holes Wave 5 **held** (sprite-facing via `currentView`, player-owned next-spell silence, ally teleport beyond Relay Dash’s 2 walk steps, two-cell occupy, cooldown steal, plus end-of-current-turn insert / delayed-on-act / HP-gated walk / act-before-you tax). Stamping a verb onto `iron_golem` / `stone_castellan` as G≥4 extras is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (Wave 5 enemy sheet quoted the same; SPELL_PROPOSALS Wave 5 quoted 18,749 — that count was wrong at this HEAD). Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 5 claim | 2026-09-23 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–5 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287; WX 5862–5866 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16818; void 25% reflect `castHelpers.ts` 336–337 | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `0.12 + playerLevel * 0.02` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `font` / `pylon` / `turret` / `bait` / `decoy` / **`span`** |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** Battle walks and the player body do not write it. Summons spawn `"front"` (`summonSpawn.ts` 177–178) | Wave 6 facing families **fail closed** until a battle-walk writer exists. Do not read pixels. Rear Cut / Cross Flank stay older ids |
| `executeCastAttempt` | `WX` 17096–17207: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 6 CORE rows stay `mpCost: 0` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | File Vault is a **teleport**, not a push. Span pair **translates** through occupancy |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| Two-cell occupy / CD steal / next-spell fizzle / HP% walk / end-of-turn insert | Still absent in live catalog | Wave 6 primary opportunity |

**Wave 1 ids — do not re-propose:**  
`wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `crimson_spawn`, `shadow_lurker`, `storm_caller`, `glass_sniper`, `cinder_martyr`, `pale_cantor`, `hex_chorister`, `leash_warden`, `null_censor`, `rift_hook`, `brood_chanter`, `glyph_sower`, `blink_cutter`, `coil_arbiter`, `rust_reaver`.

**Wave 2 ids — do not re-propose:**  
`rank_lancer`, `bash_bruiser`, `snare_weaver`, `trip_mason`, `void_anchoret`, `bell_sexton`, `execute_jackal`, `plate_warden`, `pain_suture`, `stone_castellan`, `ricochet_vicar`, `tax_scribe`, `mist_walker`, `leech_familiar`.

**Wave 3 ids — do not re-propose:**  
`fuse_binder`, `coup_duelist`, `ignite_alchemist`, `dim_optic`, `tempo_precentor`, `ash_absolver`, `plus_cutter`, `rime_mason`, `smoke_thurifer`, `sink_chanter`, `hook_chaplain`, `pylon_prelate`, `goad_herald`, `twin_tether`.

**Wave 4 ids — do not re-propose:**  
`ley_tollkeeper`, `fan_prelate`, `pawn_broker`, `recoil_squire`, `twin_porter`, `sidestep_warder`, `far_stinger`, `soul_siphon`, `pit_mason`, `font_cantor`, `share_optic`, `stride_hunter`, `hex_teller`, `slide_mason`, `axis_locksmith`.

**Wave 5 ids — do not re-propose:**  
`gale_deacon`, `twin_sentry`, `pincer_acolyte`, `oblique_cantor`, `pair_binder`, `ledger_siphon`, `shove_chaplain`, `origin_mason`, `bait_prelate`, `morrow_walker`, `surplus_warder`, `sated_knight`, `verse_scribe`, `misstep_herald`, `bitter_censor`.

Same-day 2026-09-23 SPELL_PROPOSALS was **not** on `main` or in the open-PR list at audit time. If a Wave-6 tactical catalog lands later today, **Wave 7** consumes it. This run does not mint colliding `wave6:` spell ids.

---

## 1. Shared rules (inherit Wave 1 §2)

This pass does **not** retune `pickEnemyLevelFromTiers` percents, RAF, map generation, turn order, or damage math.

Reuse Wave 1:

- Relative band `R = enemy.level - player.level`, `T = tierSize` (default 10).
- Stat ratios after `calcEnemyMaxHp` / `getEnemyBaseStats` — family HP must **survive** battle start.
- Variant floors: BASE min `aiTier` 1, VETERAN 3, ELITE 6, CHAMPION 8.
- Rarity second roll after level pick (`wVeteran` / `wElite` / `wChampion` vs `R/T` + dungeon depth).
- Rewards: 1.00 / 1.15 / 1.35 / 1.60× on existing `level * 20` XP and Doka, **only** through `applyRewards`.
- Explicit `aiProfile` on every family. Non-healers: no `healAmount` in CORE.
- Preferred chassis forced on family roll.
- `usableByEnemy: false` stays false unless a sheet flips **that one id**.
- Proposed spells are `SpellConfig` rows with flags — never `spell.name` heuristics.

**Fifth variant (Wave 2 specified the 2% `wRare` skin):** palette + **one borrowed RARE spell from this family's allowed categories**. Never borrow a forbidden category. Never a new persist stat. This run does not invent a generator.

**Stationary-post cap (extend Wave 5):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon in the same pack, not two. Span Pylon shares `ENEMY_SUMMON_CAP` (`gameConstants.ts` 300 = 2). Do **not** also roll wolf/archer overlay onto a span body. Do **not** also roll `summonAI: "decoy"` (SDE Second Shadow) onto the same body.

**Span-body cap (new):** at most **one** two-cell occupant per pack — either a living `span_warder` under Span Guard **or** a Span Pylon, never both. Two spans sharing a cell is already illegal on the spell card; the pack rule makes the lesson readable.

**Facing prerequisite (new):** Oncoming / Facing Pin / Glance Cut **fail closed** until battle walks (player, enemy, summon) write `currentView` with the WX 6928–6931 map. Forced-move (push/pull/swap/blink/vault) does **not** rewrite facing. Missing field: Oncoming deals the 12 only; Glance Cut fizzles; Pin still writes a literal. Do not ship these three families as Chebyshev blobs or sprite-pixel reads.

**Queue / Bell hook (new):** Act Bell (world CORE) shares the **end-of-turn / turn-start** PR with Queue Cut / False Cut. That hook must **not** splice the current actor and must **not** reuse the Wave-4 wrap PR (Cut In / False Echo / Eclipse Fold). Spec is legal here; implementation is a later explicit PR. Do not touch RAF.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Mute Thread stays `weeping_pawn` first-win. Queue Cut stays `eternal_pawn_king` first-win. False Cut stays `second_lament` kit-only. File Vault MULTI child `enthroned_void` — first child wins vs family observe. Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `ram_castellan` / `fosse_warden` / `stride_censor`.

---

## 2. Why Wave 6 exists (gaps Waves 1–5 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + three SDE Wave 4 unique CORE verbs.

SPELL_PROPOSALS Wave 5 (#411) then stamped the holes Wave 5 **held**. A G≥4 extra on `iron_golem` is not a CORE sentence. Dedicated families own the verb.

| Unused Wave 5 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-oncoming` (bonus iff `currentView` faces caster) | `shadow_lurker` (rear 2× lore); Rear Cut (last-walk-vector); `pincer_acolyte` (two **bodies**) | Oncoming reads the **stored facing field**. Not occupancy. Not walk-vector. |
| `spell-facing-pin` (lock `currentView` literal 2 turns) | `misstep_herald` (next **walk cell** cardinal); `axis_locksmith` (walk **axis**); Root Snare (0 walk) | Pin does not move the body. Walks still happen. The **face** stays. |
| `spell-glance-cut` (16 on the cell they face) | `rank_lancer` (ray from **caster**); `glass_sniper` (min-range gun); Pit Sight (pit on Bresenham) | The gun is **their** front cell. Empty front = paid fizzle. |
| `spell-stride-mute` (walk ≥ 1 → next spell fizzles) | `stride_hunter` (moved-this-turn **damage**); Camp Tax (bonus vs **unmoved**); Mute Thread (**unconditional**, BOSS) | Close **or** cast, not both. They can refuse the walk. |
| `spell-file-vault` (ally teleport Chebyshev 3–4) | `hook_chaplain` (pull **to caster**); `shove_chaplain` (shove 1); Relay Dash (walk **max 2**); `mist_walker` / `morrow_walker` (**self**) | Blink **them**, not you. Distance floor is why it is not Relay Dash. |
| `spell-span-guard` (self occupies origin + adjacent) | `plate_warden` (absorb, 1 cell); Nail Down (1 cell, no walk); Barrier (empty wall); `leash_warden` (body-block 1) | One id, **two** `isCellFree` failures. Walk translates the pair. |
| `spell-span-pylon` (stationary 2-cell empty summon) | `pylon_prelate` (1-cell wall); `bait_prelate` (1-HP intercept); `stone_castellan` (shoots); `font_cantor` (heals) | Two cells, no kit, `summonAI: "span"`. Not a name parse of `"Span"`. |
| `spell-cadence-theft` (steal 1 remaining CD) | `ledger_siphon` (current **AP**); `soul_siphon` (current **MP**); Loan Tempo (grant AP) | Tempo on the **cooldown map**, by id. Does not copy a spell. Does not reset to 0. |
| `spell-cadence-brand` (next hit on you → +1 CD on that id) | Quiet Hex (you apply next-cast **AP** tax); `surplus_warder` (evade leftover AP); Mirror (reflect payload) | They chose the nuke. The nuke sits. Miss does **not** consume. |
| `spell-cover-step` (next hit redirects to Chebyshev-1 ally) | `pain_suture` (redirect to a **hostile**); `twin_tether` (shared pool); `bait_prelate` (spell **aimed at owner** dies); Ward Interpose (swap **now**) | A living body eats the hit. Glance / AoE that never targeted you bypasses it. |
| `spell-low-lintel` (walk iff walker HP% ≤ 50) | `pit_mason` (nobody walks, LoS open); Barrier (nobody, LoS blocked); Claim Ward (no blink onto, walk OK) | Healthy bodies walk **around**. Wounded bodies walk **through**. |
| `spell-act-tax` (+1 AP if they still act sooner this round) | `hex_teller` (unconditional next-cast +1 AP); Drain Courage (immediate −1 AP); `origin_mason` (tile origin tax) | The gate is **tempo**. Already-acted target = fizzle. |
| `spell-act-bell` (14 when they **become** current actor) | `bell_sexton` (unit clock / delayed execute); `fuse_binder` (tile timer); `morrow_walker` (self blink at **caster** turn start) | Payload is **their turn start**, not a cell and not an HP% execute. |

**Do not family (closed / boss):** `spell-mute-thread` (`weeping_pawn`), `spell-queue-cut` (`eternal_pawn_king`), `spell-false-cut` (`second_lament`, `NOT_PLAYER_LEARNABLE`). Same law as Wave 5 vs Cut In / After Verse / Sanguine Toll / Eclipse Fold / False Echo. World packs may **synergize** with those ids in a COURT later; they do not own them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 6 CORE rows are `mpCost: 0`.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a fifth echo (Stolen Verse / After Verse / Echo Cast / False Echo already cover the axis).  
Do **not** family player-owned Hex of Silence (full bar lock).  
Do **not** family mid-RAF splice of the current actor.  
Do **not** family cooldown **reset to 0** (Theft only steals 1).  
Do **not** family a two-cell occupant that walks each cell independently (Span translates as a pair).

---

## 3. Encounter synergy packs (Waves 1–6)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one pylon **or** turret **or** font **or** bait **or** span-pylon, not two, in the same pack. Cap one span body.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Face Court | `pin_cantor` + `oncoming_knight` + `glance_ward` | Lock the face, cash the +10, or fizzle Glance on an empty front |
| Gait Snare | `gait_muter` + `pit_mason` + `oncoming_knight` | Walk is illegal **or** the spell fizzles; staying still faces the charger |
| Vault File | `vault_chaplain` + `origin_mason` + `glance_ward` | Blink a pet into someone’s front; tax the vacated cell |
| Span Gate | `span_warder` + `lintel_mason` + `glass_sniper` | Two-cell plug + healthy bodies cannot bypass; gun behind |
| Span Plug | `span_prelate` + `goad_herald` + `rank_lancer` | Taunt into a 2-cell wall on the file |
| Cadence Choir | `cadence_thief` + `act_teller` + `gale_deacon` | Steal Inferno/Gale CD, tax the sooner actor, then fan |
| Brand Cover | `brand_plate` + `cover_squire` + `pale_cantor` | Redirected hit does **not** brand; heal the cover body |
| Lintel Coup | `lintel_mason` + `coup_duelist` + `sated_knight` | Healthy cannot cross; ≤25% dies; ≥70% still bites |
| Bell Tempo | `act_sexton` + `tempo_precentor` + `gait_muter` | Gift AP so they want to act into the bell; mute if they close |
| Vault Cover | `vault_chaplain` + `cover_squire` + `leash_warden` | Cover on the Warden; vault the cover off after consume |
| Pin Pit | `pin_cantor` + `gale_deacon` + `pit_mason` | Locked front into the wedge / hole |
| Cadence Mute | `cadence_thief` + `gait_muter` + `hex_chorister` | Steal the nuke CD; they must Strike or walk-fizzle |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), and Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font).

Do **not** pack as PAIR (COURT later is fine):

- `oncoming_knight` + `shadow_lurker` / `pincer_acolyte` (three “stand in my facing / adjacency” assassins)
- `pin_cantor` + `misstep_herald` / `axis_locksmith` (three walk/view rewrites)
- `glance_ward` + `glass_sniper` / `far_stinger` / `oblique_cantor` without a pin/span third (two guns, same lesson)
- `gait_muter` + `stride_hunter` (two stride verbs)
- `vault_chaplain` + `mist_walker` / `twin_porter` / `morrow_walker` / `hook_chaplain` / `shove_chaplain` / `blink_cutter` (six reposition engines)
- `span_warder` + `span_prelate` (two span bodies)
- `span_prelate` + `pylon_prelate` / `bait_prelate` / `stone_castellan` / `font_cantor` (two posts)
- `cadence_thief` + `ledger_siphon` / `soul_siphon` (two steals)
- `brand_plate` + `surplus_warder` / `cadence_thief` as PAIR (evade vs brand consume; two cadence engines)
- `cover_squire` + `pain_suture` / `twin_tether` / `bait_prelate` as PAIR (three “someone else eats it”)
- `lintel_mason` + `pit_mason` as PAIR (two walk-block cells — COURT with Coup is the lesson)
- `act_teller` + `hex_teller` / `tax_scribe` / `origin_mason` as PAIR (two AP taxes)
- `act_sexton` + `bell_sexton` / `fuse_binder` as PAIR (two delayed clocks)

Do not spawn Span Gate / Span Plug on a 1-tile closet (needs a file plus an adjacent free cell). Do not spawn Face Court until the battle-walk facing writer exists (otherwise Oncoming never pays the +10 and Glance always fizzles). Pits, lintels, origin glyphs, and span seconds are battle-time paints — `finalizePlayableLayout` still owns generated maps.

---

## 4. Family sheets — Wave 6

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-09-22.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-7c26/docs/automation/SPELL_PROPOSALS_2026-09-22.md) (PR #411) unless marked otherwise.

---

### ENEMY_ID: `oncoming_knight`

- **NAME:** Oncoming Knight
- **ROLE:** bruiser / anti-melee (facing-gated poke)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `shadow_lurker` (rear lore), `pincer_acolyte` (two-body occupancy), Rear Cut (last-walk-vector). At most one per pack until the battle-walk writer exists.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if `currentView` is missing or not facing; Oncoming only when the +10 is public. Peer: walk to the front wedge, then Oncoming. Above: refuse Oncoming on a diagonal tie (fail closed — Strike / Mark instead).
- **STAT_SCALING_RULE:** hp 1.05, sp 1.10, sr 0.90, res 0.95, init 1.15, chc 1.05. Identity is the **facing tell**, not a 22-every-turn Frost. If it tops the meter without ever showing a facing pip, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker` + melee gate. `aiHint: "bonus_if_target_faces_caster"`. VETERAN: skip Oncoming when field missing. ELITE: Pin-partner wait one turn if a `pin_cantor` is in the pack and Pin is not on CD. CHAMPION: refuse to stand Chebyshev 0 (hug denies the wedge).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-oncoming`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **wedge cell they must leave**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-expose` (the 12+10 still uses existing math)
- **ELITE_SPELL_POOL:** none new — honesty is the elite. Do **not** unlock Rear Cut as identity.
- **SIGNATURE_MECHANICS:** 12, +10 iff stored `currentView` faces the caster (WX 6928–6931 map; dominant axis; ties fail closed). Forced-move does not rewrite facing. Distinct from Cross Flank (allied adjacency).
- **VARIANT_PROGRESSION:** BASE strike-or-oncoming → VETERAN skip-missing-view → ELITE wait-for-pin → CHAMPION no-hug
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE on Face Court / Gait Snare.
- **SYNERGIES:** `pin_cantor`, `glance_ward`, `gait_muter`, `gale_deacon`
- **WEAKNESSES:** Walk past so the face turns; stay on a diagonal tie; Sidestep the 12
- **PLAYER_COUNTERPLAY:** Don’t look at them; hug; Nail Down and ignore the wedge
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-oncoming` (ENEMY_DISCOVERY; observe+win; do not restamp a feat)
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** MED (battle-walk writer + field read). Illegal as a flat 22.
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pin_cantor`

- **NAME:** Pin Cantor
- **ROLE:** controller (lock `currentView`)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `misstep_herald` (next walk **cell**), `axis_locksmith` (walk axis), `snare_weaver` (root). Reroll if pack has no facing-gated partner **and** Pin would be a 0-damage stall with no Oncoming / Glance / Gale in CORE/ADVANCED of any ally (BASE may Pin toward a file the player must leave anyway).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Pin toward the Cantor, then Frost. Peer: Pin only if an Oncoming / Glance / Gale ally can cash this turn or next. Above: refuse Pin if already pinned or if no facing-gated id is in the pack (Frost / Slow).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.00, sr 1.10, res 0.80, init 1.10, chc 0.85. Identity is the **literal**, not damage.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "pin_view_toward_caster_if_oncoming_ready"`. VETERAN: skip if already pinned. ELITE: pick the literal that points their front at a packed cell / pit / span. CHAMPION: never Pin away from the gun.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-facing-pin`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark` on the **front cell** (amp Glance / landing)
- **RARE_SPELL_POOL:** `spell-root-snare` only if a `snare_weaver` is **absent** (do not two-root)
- **ELITE_SPELL_POOL:** none — the elite is literal discipline
- **SIGNATURE_MECHANICS:** 2 of their turns, walks do not rewrite `currentView`. Invalid literal fizzles (AP spent). Metadata extra, never parsed from the spell name.
- **VARIANT_PROGRESSION:** BASE pin+frost → VETERAN skip-already-pinned → ELITE aim-the-front-cell → CHAMPION gun-first
- **RARITY_CURVE:** Standard. +ELITE on Face Court / Pin Pit.
- **SYNERGIES:** `oncoming_knight`, `glance_ward`, `gale_deacon`, `span_warder`
- **WEAKNESSES:** Dispel Thread; wait 2 turns; Nail Down and ignore facing
- **PLAYER_COUNTERPLAY:** Kill the Cantor before the Knight steps in; don’t pack the pinned front
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-facing-pin` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (flag + walk writer honors it)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `glance_ward`

- **NAME:** Glance Ward
- **ROLE:** sniper / assassin (hit the facing cell)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** `starter-heal`. Distinct from `glass_sniper` (min-range flat), `rank_lancer` (caster ray), `far_stinger` (distance tape). Reroll on maps with no packed files until Pin / Goad / Vault can fill a front cell.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the front cell is empty. Peer: Glance only if occupied by a **hostile** (`hitsAllies: false`). Above: refuse Glance on empty / wall / allied front (would be a 3-AP fizzle).
- **STAT_SCALING_RULE:** hp 0.70, sp 1.15, sr 0.85, res 0.75, init 1.20, chc 1.10. Payload is **16 on a different body** than the targeted one. If it is topping the meter by shooting the targeted body, the kit leaked toward File Lance.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "hit_facing_cell_if_occupied"`. VETERAN: skip empty front. ELITE: target the **pinner’s** victim, not the nearest. CHAMPION: preview-discipline — never Glance a wall hug.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-glance-cut`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **front cell occupant’s tile**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-shadow-veil` (approach, still existing math)
- **ELITE_SPELL_POOL:** none — empty-front honesty is the elite
- **SIGNATURE_MECHANICS:** Target a living hostile; resolve 16 physical on the one cell in front of **their** `currentView`. Missing view / empty / out of bounds / wall / allied occupant → fizzle after AP. Distinct from Pit Sight.
- **VARIANT_PROGRESSION:** BASE frost-or-glance → VETERAN skip-empty → ELITE hunt-the-pinned → CHAMPION no-wall-hug
- **RARITY_CURVE:** Standard. +VETERAN when a Pin Cantor is already in the pack. Never CHAMPION in a solo pack.
- **SYNERGIES:** `pin_cantor`, `vault_chaplain`, `goad_herald`, `cover_squire` (enemy-side: vault a pawn into the player’s front)
- **WEAKNESSES:** Turn away; leave the front empty; Barrier the front cell; hug a wall
- **PLAYER_COUNTERPLAY:** Don’t stack with a summon on your front; kill the Ward first in Face Court
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-glance-cut` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (retarget after facing read)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gait_muter`

- **NAME:** Gait Muter
- **ROLE:** anti-melee / debuffer (walk-then-fizzle)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop`. Distinct from `stride_hunter` (moved-this-turn **damage** rider), Camp Tax (bonus vs unmoved), Mute Thread (unconditional next spell, **BOSS** `weeping_pawn`). Do **not** name this `stride_censor` (boss extra door for Stride Brand, #367).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Slow if already adjacent (they will Strike). Peer: Stride Mute only if they must close ≥ 1 to threaten. Above: refuse if they are already adjacent **and** will Strike (mark would expire unused).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 1.05, res 0.80, init 1.10, chc 0.90. Identity is the **fork**, not silence. If every kit spell fizzles with no walk debit, the family leaked toward Mute Thread.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "stride_mute_if_they_must_close"`. VETERAN: skip adjacent-Strike. ELITE: pair with Open Pit so the walk they want is illegal (mute does not fire — they must cast or skip). CHAMPION: never Mute Thread (id not in pool).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-stride-mute`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-root-snare` only if `snare_weaver` absent
- **RARE_SPELL_POOL:** `spell-quiet-hex` (AP tax, spell still resolves — teaching contrast). Do **not** put Mute Thread here.
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Arm until end of their next turn. Walk-MP ≥ 1 that turn → next spell that turn fizzles (AP spent). No walk → mark expires, they cast. Forced-move / File Vault teleport does **not** trip. Distinct from Mute Thread.
- **VARIANT_PROGRESSION:** BASE frost+mute → VETERAN skip-adjacent → ELITE pit-fork → CHAMPION no-bar-lock
- **RARITY_CURVE:** Standard. +ELITE on Gait Snare / Bell Tempo.
- **SYNERGIES:** `pit_mason`, `oncoming_knight`, `act_sexton`, `cadence_thief`
- **WEAKNESSES:** Cast first, then walk; don’t walk; blink / Swap (not a walk debit)
- **PLAYER_COUNTERPLAY:** Strike instead of Frost after a close; wait the turn; Dispel Thread
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stride-mute` (ENEMY_DISCOVERY). Do **not** restamp `weeping_pawn` / `stride_censor`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk-debit flag + mute consume)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `vault_chaplain`

- **NAME:** Vault Chaplain
- **ROLE:** teleporter / displacement specialist (ally blink 3–4)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from `hook_chaplain` (pull to caster), `shove_chaplain` (push 1), Relay Dash (walk max 2), `mist_walker` / `morrow_walker` / `blink_cutter` (self or swap). At most one per pack. Needs a second allied body (summon overlay **or** another family). Reroll solo.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no ally or no legal 3–4 cell. Peer: Vault a pet onto a Glance front / fuse / origin glyph. Above: refuse Chebyshev 1–2 or 5+ (would be Relay Dash or a missed landing); skip lava landings if ally HP% < 40.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.95, sr 1.05, res 0.80, init 1.15, chc 0.90. Identity is the **teleport distance**, not damage. If the pet **walks** 3, the kit leaked toward Relay Dash.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "blink_ally_to_cell_3_4"`. VETERAN: skip no-ally / blocked dest. ELITE: land on Glance front / Cross Flank cell / Cast Snare vacated. CHAMPION: never self-blink (Mist / Morrow stay other families).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-file-vault`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **landing**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-leash-hook` only if `hook_chaplain` is absent (teaching: pull vs blink)
- **ELITE_SPELL_POOL:** none — 3–4 discipline is the elite
- **SIGNATURE_MECHANICS:** Two-step (ally, then cell). Teleport if `isCellFree` and LoS from **their** origin. Not `applyPushback`. Nail Down fizzles this body (AP spent, observe Vault). Landing **must** tick hazards (MIMA-005). Player targeting themselves is illegal (self-blink stays Mist / Morrow).
- **VARIANT_PROGRESSION:** BASE frost+vault → VETERAN skip-illegal-dest → ELITE land-for-glance → CHAMPION no-self
- **RARITY_CURVE:** Standard. +ELITE on Vault File / Vault Cover.
- **SYNERGIES:** `glance_ward`, `origin_mason`, `cover_squire`, `fuse_binder`, `pincer_acolyte`
- **WEAKNESSES:** Claim Ward the dest; occupy it; Self Anchor / Nail Down the ally; kill the pet first
- **PLAYER_COUNTERPLAY:** Stand on the only 3–4 floor; don’t leave a packed front for the landing
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-file-vault` (MULTI: family observe+win **or** `enthroned_void` first-win — first child wins). Anchors stay `BOSS_ONLY`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy teleport; not push)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `span_warder`

- **NAME:** Span Warder
- **ROLE:** tank (two-cell self occupy)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `plate_warden` (absorb, 1 cell), `leash_warden` (body-block 1), Nail Down (no walk), Barrier (empty wall). At most one span body per pack. Reroll if no free adjacent cell at spawn (closet).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if the file is already plugged. Peer: Span only if the second cell plugs a 2-wide file the player must use. Above: refuse Span if they still need to close 3+ (would stall out of the fight).
- **STAT_SCALING_RULE:** hp 1.40, sp 0.75, sr 1.10, res 1.20, init 0.85, chc 0.80. Identity is **two `isCellFree` failures**, not more HP. If a 1-cell Barrier clone appears, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `charger` (hold; not healer). `aiHint: "span_adjacent_if_plugs_file"`. VETERAN: skip no-free-adjacent. ELITE: translate-walk only when the new second cell is free; otherwise camp. CHAMPION: last-writer honesty — Barrier on the second cell **shrinks** the span (do not pretend both cells remain).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-span-guard`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `starter-shield` (self/ally RES — no `healAmount`)
- **RARE_SPELL_POOL:** `spell-hold-ground` only if Nail Down is absent from the pack
- **ELITE_SPELL_POOL:** Do **not** unlock Span Pylon on this body (that is `span_prelate`)
- **SIGNATURE_MECHANICS:** 2 of the caster’s turns, origin + one adjacent free cell. Targeting either cell hits the **one** id. Walk translates the relative offset. Push/pull/swap move both or fizzle. Death frees both. Two spans cannot share a cell.
- **VARIANT_PROGRESSION:** BASE strike+span → VETERAN skip-no-cell → ELITE legal-translate → CHAMPION shrink-honesty
- **RARITY_CURVE:** Standard. +ELITE on Span Gate. Never with `span_prelate`.
- **SYNERGIES:** `lintel_mason`, `glass_sniper`, `rank_lancer`, `pin_cantor`
- **WEAKNESSES:** Snipe the one body; Glance the span’s front; Mute Thread; wait 2 turns; Coup the one HP bar
- **PLAYER_COUNTERPLAY:** Don’t fight the plug — kill the Warder; overwrite the second cell with Barrier
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-span-guard` (ENEMY_DISCOVERY; rook observe+win). Do **not** restamp `alabaster_fortress` (Pain Link already).
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** HIGH (occupancy pair on one id)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `span_prelate`

- **NAME:** Span Prelate
- **ROLE:** summoner / protector (stationary 2-cell wall)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `king` **without** heal / Rally. Distinct from `pylon_prelate` (1-cell empty), `bait_prelate` (intercept), `stone_castellan` (turret), `font_cantor` (heal). Counts as the pack’s stationary post **and** span body. Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no 2-cell plug exists. Peer: place only if both cells free **and** they plug a file. Above: refuse if a Bastion / Bait / Font / Turret already occupies one of the cells.
- **STAT_SCALING_RULE:** hp 1.10, sp 0.80, sr 1.05, res 1.00, init 0.90, chc 0.80. Identity is the **empty two-cell summon**, not a shooting tower. `damageScale: 0`.
- **AI_TIER_PROGRESSION:** Profile `caster` (place, then camp). `aiHint: "place_span_pylon_if_plugs_file"`. VETERAN: skip blocked adjacent. ELITE: Goad-partner wait if a Herald can force the file. CHAMPION: never give the pylon a kit (no nested Strike).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-span-pylon`
- **ADVANCED_SPELL_POOL:** `starter-frost` (if they must act after the post is down), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-goad` only if `goad_herald` is absent
- **ELITE_SPELL_POOL:** the pylon itself is the elite unlock (acquisition ELITE on the spell)
- **SIGNATURE_MECHANICS:** `summonAI: "span"` enum on config, lifespan 3, kit empty, Strike illegal. Place fizzle if adjacent blocked. `inferSummonArchetype` must **not** parse `"Span"`. Admin summon writes already reject unknown `summonAI` — add `"span"` to that allow-list in the **implementation** PR, not here.
- **VARIANT_PROGRESSION:** BASE strike+place → VETERAN skip-blocked → ELITE wait-for-goad → CHAMPION empty-kit honesty
- **RARITY_CURVE:** Standard. +ELITE on Span Plug. Shares stationary-post cap.
- **SYNERGIES:** `goad_herald`, `rank_lancer`, `lintel_mason`, `pincer_acolyte` (pylon **is** a body for Cross Flank)
- **WEAKNESSES:** Kill the 1 body (both cells free); Glance; Ignite; Null Censor (anti-summon — pack as COURT not PAIR)
- **PLAYER_COUNTERPLAY:** Don’t stand on the file; burn the pylon; don’t Goad into it
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-span-pylon` (ELITE observe+win). Nested kit empty — no extra id.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** HIGH (depends on Span Guard occupancy + new summonAI)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_thief`

- **NAME:** Cadence Thief
- **ROLE:** debuffer (steal 1 remaining cooldown)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop`. Distinct from `ledger_siphon` (current AP), `soul_siphon` (current MP), `hex_teller` (next-cast AP tax). At most one steal-engine per pack as PAIR (COURT with Act Teller is allowed).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if their max remaining CD is 0. Peer: steal only if their highest remaining ≥ 2. Above: refuse steal-on-Slow when Inferno/Gale still sits (pick highest remaining, ties lowest id string — already on the card; AI must not override to a named id).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.05, sr 1.00, res 0.80, init 1.20, chc 0.90. Identity is **one turn of tempo**, not a copied spell. If they cast Inferno after the steal, the kit leaked toward Stolen Verse.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "steal_one_cooldown_if_theirs_ge_2"`. VETERAN: skip CD 0. ELITE: wait one turn if the nuke is not on CD yet. CHAMPION: still only −1 (never reset to 0).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cadence-theft`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-drain-courage` (immediate AP — teaching contrast vs CD)
- **ELITE_SPELL_POOL:** none — −1 honesty
- **SIGNATURE_MECHANICS:** Reads cooldown maps **by id**. Subtract 1 from their highest remaining, then 1 from the caster’s own highest remaining (caster may have none). Does not copy an id. Does not write spell levels.
- **VARIANT_PROGRESSION:** BASE frost+steal → VETERAN skip-zero → ELITE wait-for-nuke-cd → CHAMPION no-reset
- **RARITY_CURVE:** Standard. +ELITE on Cadence Choir.
- **SYNERGIES:** `act_teller`, `gale_deacon`, `gait_muter`, `ignite_alchemist` (Inferno CD 3 is the teach)
- **WEAKNESSES:** Don’t sit on a long CD; hold the nuke until after they steal a Slow; Timestep does not clear CD
- **PLAYER_COUNTERPLAY:** Dump Inferno before they act; spend CD 1 fillers
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-theft` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (map increment)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brand_plate`

- **NAME:** Brand Plate
- **ROLE:** protector / tank (attacker inherits +1 CD)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `surplus_warder` (evade if leftover AP ≥ 2), Quiet Hex (you apply AP tax), Mirror (reflect). ELITE acquisition on the spell — BASE still **demonstrates** Brand (kit includes it); grant to the player stays ELITE observe+win.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if already branded. Peer: Brand when a nuke is off CD on the player. Above: refuse Brand if Cover is armed on this same body this turn (redirected hit does **not** brand — don’t waste the arm).
- **STAT_SCALING_RULE:** hp 1.25, sp 0.80, sr 1.10, res 1.15, init 0.90, chc 0.80. Identity is the **consume-on-hit**, not more RES. If Strike never sits, the pipeline leaked.
- **AI_TIER_PROGRESSION:** Profile `charger`. `aiHint: "brand_attacker_cd_if_about_to_be_nuked"`. VETERAN: skip already-branded. ELITE: do not Cover-Step the same turn. CHAMPION: miss does **not** consume (Surplus partner is COURT, not PAIR).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-cadence-brand`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-ward-plate` only if `plate_warden` is absent
- **ELITE_SPELL_POOL:** Brand itself is the elite door
- **SIGNATURE_MECHANICS:** 2 turns or one consume. Next hostile **hit** (not DoT, not lava, not self-HP) writes +1 remaining CD on **that spell’s id**. Ids with cooldown 0 still write CD 1 for this battle. Attack Nearest Strike **does** consume. Mirror: original attacker was not the hitter — brand does not write.
- **VARIANT_PROGRESSION:** BASE strike+brand → VETERAN skip-double-arm → ELITE no-cover-same-turn → CHAMPION miss-honesty
- **RARITY_CURVE:** Standard. +ELITE on Brand Cover.
- **SYNERGIES:** `cover_squire` (COURT: teaching that redirect does **not** brand), `pale_cantor`, `act_teller`
- **WEAKNESSES:** Hit with Strike and accept CD 1; DoT; wait 2 turns; Cover them so you never “hit” the Plate
- **PLAYER_COUNTERPLAY:** Poison / Inferno ticks; kill the Plate before the nuke; Surplus so the hit misses (brand stays)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-brand` (ELITE observe+win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (consume on hit pipeline, not inside `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cover_squire`

- **NAME:** Cover Squire
- **ROLE:** protector (redirect next hit to an adjacent ally)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `king` **without** Rally heal. Distinct from `pain_suture` (redirect to a **hostile**), `twin_tether` (shared pool), `bait_prelate` (aimed spell dies on 1-HP post), Ward Interpose (swap now). Needs a Chebyshev-1 ally. Reroll solo.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if no adjacent ally. Peer: Cover only if the ally HP% ≥ 20 (unless the pack **wants** a 1-HP intercept — then Bait is the other family). Above: refuse Cover if the only ally is the Span Pylon with empty kit **and** the expected hit is Glance (Glance never targeted you).
- **STAT_SCALING_RULE:** hp 1.15, sp 0.85, sr 1.05, res 1.05, init 1.00, chc 0.85. Identity is **a living body eats the number**, not a % share.
- **AI_TIER_PROGRESSION:** Profile `charger`. `aiHint: "cover_to_adj_ally_if_low_hp"`. VETERAN: skip no-adj / ally HP% < 20 unless Bait is absent and a wolf is 1-HP. ELITE: Vault-partner — Cover, eat, then Chaplain blinks the cover off. CHAMPION: redirected hit uses existing RES/SR on the **cover** body; do not change damage math.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-cover-step`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-pain-link` only if `pain_suture` is absent (teaching: % share vs full redirect)
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Target living ally Chebyshev 1. Next damaging **hit** on the caster applies to the cover if still alive and still Chebyshev ≤ 1. Moved away / dead → hit lands on caster, mark expires. DoT / lava-walk do not consume. Challenge: `recordChallengeDamageTaken` on the **cover** if that body is the player.
- **VARIANT_PROGRESSION:** BASE strike+cover → VETERAN skip-dying-cover → ELITE vault-after-consume → CHAMPION math-honesty
- **RARITY_CURVE:** Standard. +ELITE on Brand Cover / Vault Cover.
- **SYNERGIES:** `vault_chaplain`, `brand_plate`, `leash_warden`, `pale_cantor`, `bait_prelate` (COURT later, not PAIR)
- **WEAKNESSES:** Glance / AoE that hits the cover directly; pull the cover off; kill the 1-HP bait first
- **PLAYER_COUNTERPLAY:** Don’t shoot the Squire — shoot the pawn; Draw Together the pair apart
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cover-step` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (consume on hit pipeline)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `lintel_mason`

- **NAME:** Lintel Mason
- **ROLE:** hazard creator / anti-tank (HP%-gated walk)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `bishop`. Distinct from `pit_mason` (nobody walks), `trip_mason` (enter trap + root), Barrier (LoS blocked), Claim Ward (no blink onto, walk OK). At most one walk-block paint specialist as PAIR vs Pit (COURT with Coup is the lesson).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the player is already ≤ 50% (they walk through). Peer: Lintel only if player HP% > 50 **and** the cell is the choke. Above: refuse if a Pit already occupies the cell (last-writer skip).
- **STAT_SCALING_RULE:** hp 0.90, sp 1.00, sr 1.00, res 0.90, init 1.00, chc 0.85. Identity is the **predicate**, not HP damage on enter. If the cell deals Inferno on paint, the kit leaked toward Cinder.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "lintel_if_player_hp_pct_gt_50"`. VETERAN: skip if player already ≤ 50%. ELITE: plug the bypass next to a Span. CHAMPION: blink/swap/File Vault onto the cell use the same HP% gate.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-low-lintel`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **bypass** cell, `spell-slow`
- **RARE_SPELL_POOL:** `spell-open-pit` only if `pit_mason` is absent
- **ELITE_SPELL_POOL:** none — 50% is fixed (not a scaling HP tax)
- **SIGNATURE_MECHANICS:** One free floor cell, 2 turns. Walk / blink / swap / vault onto it only if walker current/max ≤ 0.50. LoS **open**. Missing maxHp fail closed (cannot enter). Last-writer vs other paints: Wave-3 rule (do not stack). Do **not** edit `mapGen.ts`.
- **VARIANT_PROGRESSION:** BASE frost+lintel → VETERAN skip-already-wounded → ELITE span-bypass → CHAMPION transit-gate
- **RARITY_CURVE:** Standard. +ELITE on Span Gate / Lintel Coup.
- **SYNERGIES:** `span_warder`, `span_prelate`, `coup_duelist`, `sated_knight`, `vault_chaplain` (wounded Wisp **can** vault through)
- **WEAKNESSES:** Heal above 50% before crossing; walk around; overwrite with Barrier
- **PLAYER_COUNTERPLAY:** Mend first; don’t take the choke at 80%; Coup is the other side of the fork
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-low-lintel` (ENEMY_DISCOVERY). Do not restamp `fosse_warden` (Open Pit door).
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy predicate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `act_teller`

- **NAME:** Act Teller
- **ROLE:** debuffer / anti-ranged (tax if they still act sooner)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop`. Distinct from `hex_teller` (unconditional next-cast +1 AP), `tax_scribe` / `origin_mason` (tile enter / origin). At most one AP-tax engine as PAIR.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they already acted this round (tax would fizzle). Peer: tax only if live `turnOrder` index is **less than** the Teller’s remaining slot. Above: refuse double-tax if Hex Toll is also in the pack (last writer wins — don’t apply both).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.05, sr 1.00, res 0.80, init 0.85, chc 0.90. Identity is **reading the queue**, not a bigger Drain Courage. If they debit current AP, the kit leaked toward Ledger Siphon.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "act_tax_if_target_acts_sooner"`. VETERAN: skip already-acted. ELITE: tax the nuke, not the Slow, when both still have slots. CHAMPION: never splice the queue (Queue Cut is BOSS).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-act-tax`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-drain-courage` (immediate −1 — teaching contrast)
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** If they have a remaining slot this round sooner than the caster, next spell +1 AP. Strike **is** taxed (it is a spell id). Mark expires at wrap. Reads live `turnOrder` + `currentTurnIndex`, not persisted `init`. Do not write `CharacterStatFields.init`.
- **VARIANT_PROGRESSION:** BASE frost+tax → VETERAN skip-acted → ELITE nuke-not-slow → CHAMPION no-splice
- **RARITY_CURVE:** Standard. +ELITE on Cadence Choir.
- **SYNERGIES:** `cadence_thief`, `gale_deacon`, `brand_plate`, `gait_muter`
- **WEAKNESSES:** Already acted (they fizzle you); wrap expiry; pay +1 and cast anyway
- **PLAYER_COUNTERPLAY:** Act after them; spend the tax on Strike; kill the Teller before your slot
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-act-tax` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (queue read, not a splice)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `act_sexton`

- **NAME:** Act Sexton
- **ROLE:** controller (delayed payload on their turn start)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` or `king` **without** heal / Rally. Distinct from `bell_sexton` (delayed **execute** / unit clock), `fuse_binder` (tile timer), `morrow_walker` (self blink at **caster** turn start). At most one delayed-clock as PAIR vs Bell / Fuse (COURT later).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they already acted and wrap is far. Peer: Bell only if they have a remaining slot. Above: refuse if they will die before the slot (look-ahead HP; existing lethal lookahead at ELITE floor).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 0.95, res 0.80, init 1.05, chc 0.95. Payload is **14 delayed**. If it executes at 25%/30%, the kit leaked toward Coup / Grave Bell.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "act_bell_if_target_has_remaining_slot"`. VETERAN: skip no-remaining-slot. ELITE: Tempo-partner so they **want** to keep the slot. CHAMPION: observe on **arm**, not on the later hit (Discovery contract).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-act-bell`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-tempo-gift` only if `tempo_precentor` is absent
- **ELITE_SPELL_POOL:** none — 14 is the number; tempo is the rest
- **SIGNATURE_MECHANICS:** Arm a mark. Next time that unit **becomes** current `turnOrder` actor, deal 14 and consume. Death before the slot drops the mark. Evade **does** consume if the bell is a hit (explicit). Same end-of-turn / turn-start PR family as Queue Cut — **not** the wrap PR, **not** RAF. Challenge: turn-start hit through `recordChallengeDamageTaken`.
- **VARIANT_PROGRESSION:** BASE frost+arm → VETERAN skip-no-slot → ELITE gift-the-slot → CHAMPION observe-on-arm
- **RARITY_CURVE:** Standard. +ELITE on Bell Tempo.
- **SYNERGIES:** `tempo_precentor`, `gait_muter`, `cadence_thief`, `act_teller`
- **WEAKNESSES:** Kill the marked unit before their slot; Sidestep at turn start (evade consumes); don’t take the Tempo gift
- **PLAYER_COUNTERPLAY:** Burst the Sexton; spend the slot on a summon that isn’t marked; don’t Delay yourself into it
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-act-bell` (ENEMY_DISCOVERY; observe on arm)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** HIGH (turn-start flag reader; shared hook with Queue Cut / False Cut)
- **STATUS:** PROPOSED

---

## 5. Amendments to older waves (ids unchanged)

These are pointer notes, not new families and not new spell ids.

| Older family | Amendment |
| :--- | :--- |
| `iron_golem` / `stone_castellan` | May **demonstrate** Span Guard / Span Pylon at G≥4. CORE identity stays inertia / turret. Wave 6 families own the verbs. |
| `mist_walker` / `twin_porter` / `morrow_walker` | Do **not** gain File Vault. Self-blink / pads / delayed-self stay theirs. Vault Chaplain owns ally 3–4 teleport. |
| `hook_chaplain` / `shove_chaplain` | Pull-to-caster / shove-1 stay theirs. Not Vault. |
| `stride_hunter` | Moved-this-turn **damage**. Not Stride Mute. Do not rename to collide with boss `stride_censor`. |
| `hex_teller` / `tax_scribe` / `origin_mason` | Unconditional next-cast / enter / origin taxes. Act Teller owns the **queue gate**. |
| `bell_sexton` / `fuse_binder` | Execute clock / tile fuse. Act Sexton owns turn-**start** 14. |
| `plate_warden` / `pain_suture` / `bait_prelate` | Absorb / hostile redirect / intercept post. Cover Squire owns ally-eats-the-hit. Brand Plate owns attacker +1 CD. |
| `shadow_lurker` / `pincer_acolyte` | Rear lore / two-body occupancy. Oncoming Knight owns `currentView` bonus. |
| `misstep_herald` / `axis_locksmith` | Next walk cell / walk axis. Pin Cantor owns facing lock. |
| `glass_sniper` / `rank_lancer` | Min-range / caster ray. Glance Ward owns **their** front cell. |
| `ledger_siphon` / `soul_siphon` | Current AP / MP. Cadence Thief owns cooldown map −1. |
| `pit_mason` | Nobody walks. Lintel Mason owns HP% ≤ 50 walk. |
| `leash_warden` | 1-cell occupy. Span Warder owns two-cell self. |

`spell-stolen-verse` / `spell-relay-dash` stay Wave 5 / SDE Wave 4 stamps. Do not clone.

---

## 6. Implementation notes (for a later, explicit implementation PR)

1. **No production TypeScript / Motoko in this change.**  
2. **No new `mpCost > 0`.** Ley Toll / Undertow / Sanguine Toll remain the only paper spenders.  
3. **Battle facing writer** is a prerequisite for Face Court, not this doc’s job. Until it exists, Oncoming / Glance / Pin fail closed as specified.  
4. **Span occupancy** is one combatant id on two cells. New helpers in `occupancy.ts`. `summonAI: "span"` is an enum; extend admin allow-list then. Do not parse `"Span Pylon"`.  
5. **Act Bell / Queue Cut / False Cut** share an explicit end-of-turn / turn-start PR. Do not splice the current actor. Do not touch RAF. Do not reuse the wrap PR.  
6. **Cover / Brand** consume on the existing hit pipeline, not inside `dealDamage` math.  
7. **Cadence** reads cooldown maps by id. Do not write spell levels.  
8. **File Vault** is occupancy teleport, min 3 / max 4 from the **ally**. Not `applyPushback`. Not Relay Dash.  
9. **Low Lintel** is an occupancy predicate. Do not edit map generation.  
10. Family HP must **survive** `WX` 11970–11974. Fractional `res`/`sp` in `FAMILY_STAT_MULTS` must become ratios on `getEnemyBaseStats`, not 0.05–0.75 writes.  
11. `buildEnemyKit` must not receive the `levelZone` object. Re-key to relative band `R` / numeric zone.  
12. Forced `isBaseSpell` on all 32 starters (`WX` 2395–2408) stays a Discovery prerequisite. Do not append Wave 6 ids to `starterSpells`.  
13. Recap grant uses the reward funnel + `commitSpellDiscoveries` / `unlockOwnedSpell`, not `updateCharacter`.  
14. Extract helpers. Do not grow `WorldExploration.tsx` (19,213 lines).  
15. `usableByEnemy: false` stays false unless a sheet flips **that one id**. Rally / Mirror / Barrier / Timestep / sentinel / bomber / wisp stay false here.

---

## 7. Explicit non-goals this pass

- No production TypeScript / Motoko / Candid edits.  
- No re-proposal of the 22 Wave 1, 14 Wave 2, 14 Wave 3, 15 Wave 4, or 15 Wave 5 ids as new families.  
- No boss redesign (Mute Thread / Queue Cut / False Cut stay where #411 put them).  
- No player or enemy level cap. Do not treat `maxTier = floor(999 / ts)` as content endgame.  
- No RAF / mapGen / turn / damage-math edits.  
- No reward writers outside `applyRewards`.  
- No new persist stats (`wp` / `wr` / `scp` stay gone).  
- No `spell-blood-tithe` enemy family.  
- No fourth `mpCost > 0` walk snipe on CORE kits.  
- No fifth echo id.  
- No player-owned Hex of Silence.  
- No mid-RAF splice of the current actor.  
- No cooldown reset-to-0 family.  
- No two-cell occupant that walks each cell independently.  
- No `buffStat: "evasion"` miss formula (`CharacterStats.evasion` stays unread).  
- No Hex Toll pool.  
- No restamp of `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `ram_castellan` / `fosse_warden` / `stride_censor`.  
- No `EnemyRegister.tsx` lore rows presented as live.  
- No `wave6:` colliding spell ids.

---

## 8. Proposal index

| ENEMY_ID | Role | CORE verb | Complexity |
| :--- | :--- | :--- | :--- |
| `oncoming_knight` | bruiser / anti-melee | `spell-oncoming` | MED |
| `pin_cantor` | controller | `spell-facing-pin` | LOW–MED |
| `glance_ward` | sniper / assassin | `spell-glance-cut` | MED |
| `gait_muter` | anti-melee / debuffer | `spell-stride-mute` | MED |
| `vault_chaplain` | teleporter / displacement | `spell-file-vault` | MED |
| `span_warder` | tank | `spell-span-guard` | HIGH |
| `span_prelate` | summoner / protector | `spell-span-pylon` | HIGH |
| `cadence_thief` | debuffer | `spell-cadence-theft` | LOW |
| `brand_plate` | protector / tank | `spell-cadence-brand` | MED |
| `cover_squire` | protector | `spell-cover-step` | MED |
| `lintel_mason` | hazard creator / anti-tank | `spell-low-lintel` | MED |
| `act_teller` | debuffer / anti-ranged | `spell-act-tax` | LOW–MED |
| `act_sexton` | controller | `spell-act-bell` | HIGH |

All STATUS: **PROPOSED**. Variant model on every sheet: BASE → VETERAN → ELITE → CHAMPION (+ 2% `wRare` skin). These are mechanical identities, not level brackets.

**Not familied (boss / held):** `spell-mute-thread`, `spell-queue-cut`, `spell-false-cut`. Mid-RAF splice, fourth `mpCost`, player-owned full silence, CD reset to 0, independent two-cell walk, fifth echo — Wave 7+ if SPELL_PROPOSALS stamps them. Do not guess ids.

---

## 9. Source map (read-back)

| Topic | File | Lines |
| :--- | :--- | :--- |
| `EnemyFamily` union | `src/frontend/src/types/gameTypes.ts` | 12–20 |
| `Enemy.currentView` | `src/frontend/src/types/gameTypes.ts` | 297 |
| Family overlay | `src/frontend/src/engine/spawnPolicy.ts` | 34–35, 49–128, 258–297 |
| Family apply at generate | `src/frontend/src/components/WorldExploration.tsx` | 5862–5866 |
| `levelZone` object | `src/frontend/src/components/WorldExploration.tsx` | 4683–4687 |
| Forced `isBaseSpell` | `src/frontend/src/components/WorldExploration.tsx` | 2395–2408 |
| Overworld facing write | `src/frontend/src/components/WorldExploration.tsx` | 6924–6938 |
| `buildEnemyKit(levelZone)` | `src/frontend/src/components/WorldExploration.tsx` | 11920 |
| Summoner overlay | `src/frontend/src/components/WorldExploration.tsx` | 11932–11942 |
| Family HP wipe | `src/frontend/src/components/WorldExploration.tsx` | 11970–11974 |
| Ember / tide melee hooks | `src/frontend/src/components/WorldExploration.tsx` | 16789–16818 |
| AP-only `executeCastAttempt` | `src/frontend/src/components/WorldExploration.tsx` | 17096–17207 |
| WX size | `src/frontend/src/components/WorldExploration.tsx` | 19,213 lines |
| Void reflect | `src/frontend/src/engine/castHelpers.ts` | 336–337 |
| `pickEnemyLevelFromTiers` / `computeAITier` | `src/frontend/src/engine/combatMath.ts` | 36–107 |
| `getEnemyBaseStats` integers | `src/frontend/src/engine/progression.ts` | 151–186 |
| Kits / `buildEnemyKit` | `src/frontend/src/engine/enemyAI.ts` | 163–199 |
| Summon name fallback | `src/frontend/src/engine/enemyAI.ts` | 202–225 |
| Healer-first infer | `src/frontend/src/engine/enemyAI.ts` | 447–477 |
| Area = Chebyshev, no `areaShape` | `src/frontend/src/engine/targeting.ts` | 690–727 |
| Push / attract unused by casts | `src/frontend/src/engine/occupancy.ts` | 482, 537 |
| Summon default facing | `src/frontend/src/engine/summonSpawn.ts` | 177–178 |
| Register lore extras | `src/frontend/src/components/EnemyRegister.tsx` | 71–88 |
| Summoner chance / cap | `src/frontend/src/data/gameConstants.ts` | 298–300 |
| Wave 5 spells | PR #411 `SPELL_PROPOSALS_2026-09-22.md` | — |
| Wave 5 families | PR #405 `ENEMY_ELITE_EVOLUTION_2026-09-22.md` | — |
| Wave 4 families | PR #349 `ENEMY_ELITE_EVOLUTION_2026-09-21.md` | — |

**Document status:** PROPOSED. Safe to review. Not a license to land combat code in the same change as this spec.

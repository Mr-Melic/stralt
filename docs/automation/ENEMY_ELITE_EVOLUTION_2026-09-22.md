# Enemy and Elite Evolution Design — Wave 5

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-09-22  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Fifth daily pass. New world-pack families that consume **SPELL_PROPOSALS Wave 4 verbs** (`SPELL_PROPOSALS_2026-09-21.md`, open PR #342): cone+knockback as one id, two-ally swap, pincer occupancy, diagonal catalog poke, pair attract, current-AP steal, ally shove, cast-origin tile tax, intercept bait, delayed self-teleport, leftover-AP evade, high-HP% physical — plus three **SPELL_DISCOVERY Wave 4 unique verbs** (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md`, open PR #371) that must not stay as G≥4 stickers on older CORE identities: copy a hostile’s last id, force next walk cardinal, invert next heal. Bosses stay on the existing catalog. Cut In / After Verse / Sanguine Toll / Eclipse Fold stay **boss / closed-class** — not world-pack CORE.

**Does not replace:**
- [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md) (Wave 1, 22 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-01.md`](./ENEMY_ELITE_EVOLUTION_2026-09-01.md) (Wave 2, 14 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-02.md`](./ENEMY_ELITE_EVOLUTION_2026-09-02.md) (Wave 3, 14 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-21.md`](./ENEMY_ELITE_EVOLUTION_2026-09-21.md) (Wave 4, 15 family sheets — open PR #349; not on `main` yet)

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 4

Re-read against `HEAD` `0f5363f` (Merge PR #332). Wave 4 closed as docs in the 2026-09-21 pass (PR #349). SPELL_PROPOSALS Wave 4 (PR #342) stamped the seven verbs Wave 4 enemy evolution **held**, plus nine siblings. SPELL_DISCOVERY Wave 4 (PR #371) **stamped** those ids onto older families as G≥4 extras. Stamping a verb onto `ember_knight` / `bone_scribe` is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (Wave 4 quoted the same). Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 4 claim | 2026-09-22 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–4 sheet shipped |
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
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `font` / `pylon` / `turret` / `bait` / `decoy` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Wave 5 uses **cone push**, **pair attract**, **ally shove** |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Gale Deacon **reuses** Fan Bolt’s cone helper, then pushes |
| `executeCastAttempt` | `WX` 17096–17205: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 5 unique CORE rows stay `mpCost: 0` except the boss hybrid, which this wave does **not** family |
| `spell.diagonal` | Honored on enemy/area paths (`targeting.ts` 646–649, 712); unused in frontend catalog | Oblique Cantor is the first **family** that owns it |
| Delayed tile fuse / instant execute / cone reader / two-hostile swap / self knockback / pads / evade / distance tape / MP steal / pit / font / ally range / moved-brand / next-cast AP tax / conveyor / axis lock | Still absent in live catalog | Waves 2–4 still own those ids |

**Wave 1 ids — do not re-propose:**  
`wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `crimson_spawn`, `shadow_lurker`, `storm_caller`, `glass_sniper`, `cinder_martyr`, `pale_cantor`, `hex_chorister`, `leash_warden`, `null_censor`, `rift_hook`, `brood_chanter`, `glyph_sower`, `blink_cutter`, `coil_arbiter`, `rust_reaver`.

**Wave 2 ids — do not re-propose:**  
`rank_lancer`, `bash_bruiser`, `snare_weaver`, `trip_mason`, `void_anchoret`, `bell_sexton`, `execute_jackal`, `plate_warden`, `pain_suture`, `stone_castellan`, `ricochet_vicar`, `tax_scribe`, `mist_walker`, `leech_familiar`.

**Wave 3 ids — do not re-propose:**  
`fuse_binder`, `coup_duelist`, `ignite_alchemist`, `dim_optic`, `tempo_precentor`, `ash_absolver`, `plus_cutter`, `rime_mason`, `smoke_thurifer`, `sink_chanter`, `hook_chaplain`, `pylon_prelate`, `goad_herald`, `twin_tether`.

**Wave 4 ids — do not re-propose:**  
`ley_tollkeeper`, `fan_prelate`, `pawn_broker`, `recoil_squire`, `twin_porter`, `sidestep_warder`, `far_stinger`, `soul_siphon`, `pit_mason`, `font_cantor`, `share_optic`, `stride_hunter`, `hex_teller`, `slide_mason`, `axis_locksmith`.

Same-day 2026-09-22 SPELL_PROPOSALS was **not** on `main` or in the open-PR list at audit time. If a Wave-5 tactical catalog lands later today, **Wave 6** consumes it. This run does not mint colliding `wave5:` spell ids.

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

**Stationary-post cap (extend Wave 4):** one pylon **or** turret **or** mercy font **or** bait pylon in the same pack, not two. Bait shares `ENEMY_SUMMON_CAP`. Do **not** also roll wolf/archer overlay onto a bait body. Do **not** also roll `summonAI: "decoy"` (SDE Second Shadow, ENEMY_ONLY) onto the same body.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Bias Ray / Surplus Ward / Sated Fang grants stay `first_blood` / `doka_hoarder` / `rich_vampire`. Twin Guard MULTI child `betrayal_witness` is already claimed. Draw Together MULTI child `lord_of_static` is already claimed. Morrow Step MULTI child `morrow_herald` (boss PR #367) — first child wins. Gale Fan / Cross Flank / AP Sip / Body Check / Cast Snare / Bait Pylon / Stolen Verse / Misstep / Bitter Cup are observe+win (or ELITE) as stamped by #342 / #371.

---

## 2. Why Wave 5 exists (gaps Waves 1–4 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3 (#282).

SPELL_PROPOSALS Wave 4 (#342) then stamped the holes Wave 4 **held**. SPELL_DISCOVERY Wave 4 (#371) attached those ids as **G≥4 extras** on older families. A G≥4 extra is not a CORE sentence. Dedicated families own the verb.

| Unused Wave 4 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-gale-fan` (cone **and** 1-tile push) | `fan_prelate` (cone damage); `bash_bruiser` (hostile push, no wedge) | Fan Bolt does not move bodies. Bash is not a wedge. Gale is **one** id. |
| `spell-twin-guard` (two **allies** swap, caster stays) | `pawn_broker` (two **hostiles**); `blink_cutter` (caster ↔ ally); `rift_hook` (caster ↔ player) | Broker trades the player’s side. Blink moves the caster. Twin Sentry never moves. |
| `spell-cross-flank` (pincer occupancy) | `shadow_lurker` (rear 2×, sprite lore); Rear Cut (walk-facing) | Pincer counts **two allied bodies** adjacent to the target. Not `currentView`. |
| `spell-bias-ray` (`diagonal: true` poke) | `rank_lancer` (`targetType: "line"` cardinal); `glass_sniper` (min-range flat); backend `shadow_strike` (not in `SPELL_ID_CATALOG`) | First **frontend-catalog** diagonal family. Do not promote `shadow_strike`. |
| `spell-draw-together` (pair attract toward **midpoint**) | `void_anchoret` (Hook toward **caster**); `sink_chanter` (toward **tile**); Void Collapse (attract-all + 80) | The pair moves **toward each other**. Standing on the caster is not safety. |
| `spell-ap-sip` (zero-sum **current AP**) | `soul_siphon` (current **MP**); `hex_teller` (next-cast AP **tax**); Drain Courage (debit, no grant) | Sip is this-turn leftover AP, not a lingering tax and not walk-MP. |
| `spell-body-check` (ally shove 1 **away**) | `hook_chaplain` (pull ally **to caster**); `bash_bruiser` (hostile push); Relay Dash (ally **walk** ≤2) | Check is `applyPushback` on an **ally**. Not a walk. Not a hostile. |
| `spell-cast-snare` (spells **cast from** the tile +1 AP) | `tax_scribe` (enter-AP); `hex_teller` (unit next-spell); Glyph Tax (enter) | Origin tax. Attack Nearest origin is the **player** tile. Walk does not pay. |
| `spell-bait-pylon` (1-HP intercept) | `pylon_prelate` (empty wall); `void_mirror` (reflect); `pain_suture` (redirect to a **hostile**); False Retreat (self decoy blink) | Next hostile spell aimed at the **owner** dies on the bait. Nested `spell-bait-eat` never owned. |
| `spell-morrow-step` (paint now, blink at **next turn start**) | `mist_walker` (instant free cell); `twin_porter` (walkable pads); `blink_cutter` (ally swap) | Delayed **self**. Observation is paint. Arrival is not a second observe. |
| `spell-surplus-ward` (`evadeNextHits` iff leftover AP ≥ 2 after pay) | `sidestep_warder` (unconditional evade); `plate_warden` (absorb) | Greed fail if they dump AP first. Do not read `CharacterStats.evasion`. |
| `spell-sated-fang` (legal only at HP% ≥ 70) | `coup_duelist` (instant ≤25%); `execute_jackal` (wait 30–40%); `crimson_spawn` (lifesteal / low-HP lore); Last Ember (low-HP) | High bar, not execute. Heal to keep the fang legal. |
| `spell-stolen-verse` (replay a **hostile’s** last id at 50%) | `bone_scribe` (stat shred); After Verse (copies **yours**, BOSS); Echo Cast (primes **your next**, BOSS) | Verse is a CORE echo family. Scribe G≥4 stamp is not identity. |
| `spell-misstep` (force **next** 1-step cardinal) | `axis_locksmith` (whole walk on one **axis**); `glyph_sower` (hazard paint); File Slide (moves them **now**) | They still choose whether to walk. The **dir** is chosen. |
| `spell-bitter-cup` (next heal becomes damage) | `null_censor` (summon lockout); Cursed Wound (heal ×0.5); Mercy Hex (their **nuke** → ally heal) | Invert **once**, then consume. Self-HP costs are not heals. |

**Do not family (closed / boss):** `spell-cut-in` (`starborn_queen`), `spell-after-verse` (`pale_archivist`), `spell-sanguine-toll` (`starved_vampire_pawn` — third paper `mpCost > 0`; no tithe clone; `cinder_martyr` already exists), `spell-eclipse-fold` (`final_pawn`, `NOT_PLAYER_LEARNABLE`), `spell-false-echo` (`unbound_pendulum`, BOSS_ONLY), `spell-repel-ring` / `spell-second-shadow` (ENEMY_ONLY CHAMPION stamps on existing families).

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 5 CORE rows are `mpCost: 0`.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).

---

## 3. Encounter synergy packs (Waves 1–5)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one pylon **or** turret **or** font **or** bait, not two, in the same pack.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Gale Pit | `gale_deacon` + `pit_mason` + `fuse_binder` | Cone-push onto pit / fuse occupancy |
| Twin Kennel | `twin_sentry` + `brood_chanter` + `leash_warden` | Swap the pet into the choke; Warden occupies |
| Pincer Gate | `pincer_acolyte` + `goad_herald` + `leash_warden` | Taunt into two-body adjacency |
| Oblique File | `oblique_cantor` + `axis_locksmith` + `pit_mason` | Lock then diagonal poke through a LoS-open hole |
| Pair Court | `pair_binder` + `ignite_alchemist` + `plague_rat` | Draw the Wisp onto the DoT’d body, then cash |
| Ledger Choir | `ledger_siphon` + `ley_tollkeeper` + `far_stinger` | Steal leftover AP; Ley still spends **MP** (readable two resources) |
| Shove School | `shove_chaplain` + `hook_chaplain` + `stride_hunter` | Teaching: ally **away** vs ally **to caster**; brand the landing |
| Origin Tax | `origin_mason` + `glass_sniper` + `hex_teller` | Tile origin + unit next-cast — COURT, not a second Glyph Tax |
| Bait Gate | `bait_prelate` + `iron_golem` + `null_censor` | Intercept the snipe; Null is the **counter** to extra summons, not a second bait |
| Morrow Snare | `morrow_walker` + `origin_mason` + `trip_mason` | Paint the blink dest; tax whoever casts from the old cell |
| Surplus Goad | `surplus_warder` + `goad_herald` + `ash_absolver` | Forced swing misses if leftover AP held; Absolve the taunt |
| Sated Plate | `sated_knight` + `pale_cantor` + `plate_warden` | Heal to keep ≥70%; absorb the punish |
| Verse Pulpit | `verse_scribe` + `tempo_precentor` + `glass_sniper` | Gift AP so they fire a stealable Frost; do **not** PAIR two scribes |
| Misstep Pit | `misstep_herald` + `pit_mason` + `gale_deacon` | Force the cardinal onto the hole, then fan |
| Bitter Font | `bitter_censor` + `font_cantor` + `cinder_martyr` | Invert the pulse; Martyr is not a second Cantor |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), and Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit).

Do **not** pack as PAIR (COURT later is fine):

- `gale_deacon` + `fan_prelate` (two cones)
- `twin_sentry` + `pawn_broker` / `blink_cutter` / `rift_hook` (three swap engines)
- `surplus_warder` + `sidestep_warder` (two evades)
- `sated_knight` + `coup_duelist` / `execute_jackal` (three HP windows)
- `ledger_siphon` + `soul_siphon` / `hex_teller` (two steals / two AP engines)
- `origin_mason` + `tax_scribe` (two tile taxes)
- `bait_prelate` + `pylon_prelate` / `stone_castellan` / `font_cantor` (two posts)
- `morrow_walker` + `mist_walker` / `twin_porter` (two self-teleports)
- `verse_scribe` + `bone_scribe` (two scribes)
- `bitter_censor` + `null_censor` (two censors)
- `oblique_cantor` + `rank_lancer` / `far_stinger` / `glass_sniper` without a lock/pit third (two guns, same lesson)
- `pair_binder` + `sink_chanter` / `void_anchoret` (two attracts)
- `shove_chaplain` + `bash_bruiser` as PAIR (Shove School with Hook is the teach; Bash is a different body)
- `pincer_acolyte` + `shadow_lurker` as PAIR (two “stand next to me” assassins)
- `misstep_herald` + `axis_locksmith` as PAIR (two walk rewrites — COURT with Pit is the lesson)

Do not spawn Gale Pit / Oblique File on a map with no 3-tile wedge / diagonal. Do not spawn Twin Kennel in a 1-tile closet (needs two allied bodies). Pits, origin glyphs, and Morrow marks are battle-time paints — `finalizePlayableLayout` still owns generated maps.

---

## 4. Family sheets — Wave 5

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-09-21.md`](./SPELL_PROPOSALS_2026-09-21.md) (PR #342) or [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md) (PR #371) unless marked otherwise.

---

### ENEMY_ID: `gale_deacon`

- **NAME:** Gale Deacon
- **ROLE:** artillery / displacement specialist (cone + knockback)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` or `king` **without** heal. Distinct from `fan_prelate` (cone, no push) and `bash_bruiser` (push, no wedge). Reroll on maps with no 3-tile wedge. At most one per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the wedge covers < 2 hostiles. Peer: Gale Fan only if two player-side bodies sit in the 90° wedge **and** at least one push cell is free or a hazard. Above: refuse Gale without geometry (Frost / Mark instead); prefer a landing on pit / fuse / cinder.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.15, sr 0.90, res 0.80, init 1.00, chc 1.05. Payload is 8×bodies **then** move. If it is topping the meter **without** moving anyone, the kit leaked toward Fan Bolt.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint` from #342 (wedge occupancy **and** a legal push). VETERAN: skip if every push cell is blocked (would be Fan Bolt with extra AP). ELITE: wait one turn if Pit / Fuse / Axis Lock will hold the landing. CHAMPION: origin facing so the player cannot hug (Chebyshev 0 excluded).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-gale-fan`
- **ADVANCED_SPELL_POOL:** `spell-mark` on a **landing** cell (amp whoever arrives), `spell-slow`
- **RARE_SPELL_POOL:** `thunder_clap` only if Fan Bolt is absent from the pack (do not two-cone)
- **ELITE_SPELL_POOL:** Do **not** unlock Fan Bolt as identity. CHAMPION is landing-discipline.
- **SIGNATURE_MECHANICS:** Same cone helper as Fan Bolt, then `applyPushback` 1 away from caster per **surviving** hit. Allies not pushed. Landing **must** tick hazards (MIMA-005). Until `targeting.ts` **reads** `areaShape`, this family must not ship as a Chebyshev blob.
- **VARIANT_PROGRESSION:** BASE frost+gale → VETERAN no-noop-push → ELITE wait-for-hazard → CHAMPION facing-discipline
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE on `arcane_surge` / `chessboard` / Gale Pit.
- **SYNERGIES:** `pit_mason`, `fuse_binder`, `misstep_herald`, `slide_mason`
- **WEAKNESSES:** Back-diagonal of the facing; hug the caster; Nail Down / Self Anchor on the front body
- **PLAYER_COUNTERPLAY:** Split the wedge; occupy the push cell; step off before init
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gale-fan` (ENEMY_DISCOVERY / SDE G≥4 stamp on `fan_prelate` is MULTI — first child wins; do not restamp a feat)
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** HIGH (Fan Bolt cone helper **plus** per-body push). Illegal as a Chebyshev Inferno.
- **STATUS:** PROPOSED

---

### ENEMY_ID: `twin_sentry`

- **NAME:** Twin Sentry
- **ROLE:** protector (two-ally swap)
- **BASE_ELIGIBILITY:** New family; preferred chassis `king` **without** heal. Distinct from `pawn_broker` (two hostiles), `blink_cutter` (caster ↔ ally), `rift_hook` (caster ↔ player). Reroll if pack has no second allied body (no summon / no partner). Do **not** also roll random wolf/archer overlay unless that body is the swap partner. At most one per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if only one allied body. Peer: Twin Guard if the swap puts a squishy behind a golem / warden **or** puts the pet onto a choke the player wanted. Above: skip if the swap is safer for the player (they wanted the pet in melee).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 1.00, res 0.95, init 1.30, chc 0.75. **0 damage on the trade.** Init is high so the swap lands before the gun / pincer.
- **AI_TIER_PROGRESSION:** Profile `guardian` / protector. `aiHint: "swap_two_allies_if_improves_frontline"`. VETERAN: fizzle-aware (pack size < 2 → do not spend). ELITE: swap the pet onto a file the player must cross; never random. CHAMPION: Goad-ally pack so the body they swapped **into** is the one they must swing at.
- **CORE_SPELL_POOL:** `spell-twin-guard`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `starter-shield` on the newly fronted body, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-ward-interpose` **only if** `blink_cutter` is absent (do not double-swap a pack)
- **ELITE_SPELL_POOL:** none — CHAMPION is better trades, not Pawn Trade
- **SIGNATURE_MECHANICS:** Two **allied** bodies swap. Caster stays. Not `isSwap`. Hazard on landing **must** tick. Distinct from Twin Gate (pads) and Twin Tether (shared HP).
- **VARIANT_PROGRESSION:** BASE trade-if-two → VETERAN no-fizzle → ELITE choke-trade → CHAMPION goad-the-front
- **RARITY_CURVE:** Standard. +ELITE in Twin Kennel / Pincer Gate. Weight 0 on 1-body packs.
- **SYNERGIES:** `brood_chanter`, `leash_warden`, `pincer_acolyte`, `bait_prelate` (swap the bait into intercept range)
- **WEAKNESSES:** Isolate (one body); Self Anchor the pet; desummon
- **PLAYER_COUNTERPLAY:** Kill the second body first; stand so both landings are equal; Claim Ward the dest
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-twin-guard` (`betrayal_witness` MULTI child already claimed — family observe is a **second** door; do not restamp the feat)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy pair swap; new flag, not `swapPositions`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pincer_acolyte`

- **NAME:** Pincer Acolyte
- **ROLE:** assassin (pincer occupancy)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` or `pawn`. Distinct from `shadow_lurker` (rear 2× lore / Cross Flank G≥4 stamp) and Rear Cut (walk-facing). Reroll if pack size is 1 **and** the player has no summon (needs two allied bodies adjacent to the **target**).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if pincer is false (8, worse than a 2-body Cross Flank). Peer: Cross Flank only if two allied bodies are Chebyshev 1 to the target. Above: skip the 8; wait for Goad / Body Check to create the pincer.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 0.90, res 0.80, init 1.20, chc 1.10. 8 if solo. 8+10 if pincer (Frost-equal, **two** hits). Identity is **the occupancy check**, not a fatter Strike.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint` from #342 (count two allied Chebyshev-1, 8-neighborhood). VETERAN: skip bonus mentally if pincer is false and Strike is in kit at range 1. ELITE: path to a cell that **completes** a pincer with an existing ally, not the nearest. CHAMPION: Goad pack so they cannot walk off the sandwich.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-cross-flank`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-shadow-veil`
- **RARE_SPELL_POOL:** `spell-rear-cut` only if `shadow_lurker` is absent (do not two-flank a PAIR)
- **ELITE_SPELL_POOL:** none — honesty is the elite. Do not read sprite `currentView`.
- **SIGNATURE_MECHANICS:** `requireTwoAlliesAdjacent`. Dead bodies do not count. Player-side when the **player** casts it; enemy-side when this family casts it. Fail closed if occupancy is missing.
- **VARIANT_PROGRESSION:** BASE flank-or-strike → VETERAN occupancy-gate → ELITE complete-the-pincer → CHAMPION goad-the-sandwich
- **RARITY_CURVE:** Standard. +ELITE in Pincer Gate. Never CHAMPION in a solo pack.
- **SYNERGIES:** `goad_herald`, `leash_warden`, `shove_chaplain`, `twin_sentry`
- **WEAKNESSES:** Walk to Chebyshev 2 from one body; kill the second ally; desummon
- **PLAYER_COUNTERPLAY:** Split the pack; don’t hug two bodies; Slow the completer
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cross-flank` (ENEMY_DISCOVERY; SDE also stamps `shadow_lurker` G≥4 — first observe+win wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (occupancy count before `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `oblique_cantor`

- **NAME:** Oblique Cantor
- **ROLE:** sniper / artillery (diagonal poke)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop`. Distinct from `rank_lancer` (cardinal line), `glass_sniper` (min-range flat), `far_stinger` (distance tape). Do **not** import backend `shadow_strike` into `SPELL_ID_CATALOG`. Reroll on maps with no 3-tile diagonal (tiny `ruinsIslands` pockets).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the player is cardinal. Peer: Bias Ray only if `|dx| === |dy|` and Chebyshev ≥ 2. Above: refuse Ray on rank/file (Frost / Mark instead); refuse if a pit/haze blocks LoS (Bias Ray is LoS-true).
- **STAT_SCALING_RULE:** hp 0.70, sp 1.20, sr 0.90, res 0.75, init 1.15, chc 1.15. Payload 12 at AP 3. Identity is **the axis**, not more Frost.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint` from #342 (diagonal gate). VETERAN: skip off-axis. ELITE: wait for Axis Lock / Misstep to force a diagonal step. CHAMPION: Lens-Share ally so the ray reaches 6 still clamped by `maxSpellRange`.
- **CORE_SPELL_POOL:** `spell-bias-ray`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the diagonal spoke, `spell-expose`
- **RARE_SPELL_POOL:** `proposed:spell-glass-shot` only if `glass_sniper` is absent
- **ELITE_SPELL_POOL:** none — do not steal File Lance as CORE
- **SIGNATURE_MECHANICS:** `diagonal: true`, `lineOfSight: true`, range 2–5. Attack Nearest must use the same diagonal gate (origin = this unit’s tile). Distinct from File Lance (`targetType: "line"`).
- **VARIANT_PROGRESSION:** BASE ray-or-frost → VETERAN axis-gate → ELITE wait-for-lock → CHAMPION shared-lens
- **RARITY_CURVE:** Standard. +ELITE on `chessboard` / Oblique File. Never CHAMPION in a solo pack.
- **SYNERGIES:** `axis_locksmith`, `pit_mason`, `share_optic`, `misstep_herald`
- **WEAKNESSES:** Stand cardinal; Barrier a spoke; hug Chebyshev 1
- **PLAYER_COUNTERPLAY:** Walk rank/file; Smoke the diagonal; close
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-bias-ray` (`first_blood` is the official door — family observe is a **second** door; do not restamp the feat)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (`diagonal` already live on enemy/area paths; catalog split only)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pair_binder`

- **NAME:** Pair Binder
- **ROLE:** displacement specialist / controller (pair attract)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `queen` **without** heal. Distinct from `void_anchoret` (toward caster), `sink_chanter` (toward painted tile), Void Collapse (attract-all + 80). Reroll if only one player-side body (needs two hostiles). At most one per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if only one hostile. Peer: Draw Together if the midpoint sit is a fuse / plus origin / pincer cell **or** stacks the Wisp onto the player. Above: skip if the pair is already adjacent **and** that is safer for them (successful no-op is legal; AI still skips).
- **STAT_SCALING_RULE:** hp 0.75, sp 0.90, sr 1.05, res 0.80, init 1.25, chc 0.80. **0 HP on the attract.** If it is topping the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint` from #342 (two hostiles, midpoint improves). VETERAN: fizzle-aware (need two in radius). ELITE: attract onto ally hazard / plus / pincer, never random. CHAMPION: Ignite pack so stacked DoTs cash after the clump.
- **CORE_SPELL_POOL:** `spell-draw-together`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the midpoint, `spell-slow` after they land
- **RARE_SPELL_POOL:** `spell-sinkhole` **only if** `sink_chanter` is absent (do not two-attract a PAIR)
- **ELITE_SPELL_POOL:** none — CHAMPION is pack-clump, not Void Collapse
- **SIGNATURE_MECHANICS:** Each of two hostiles `applyAttract` 1 toward the Chebyshev midpoint. Not a swap. Odd distances: both move 1 or collide and stop. Hazard on landing **must** tick.
- **VARIANT_PROGRESSION:** BASE clump-if-two → VETERAN no-fizzle → ELITE hazard-midpoint → CHAMPION cash-the-stack
- **RARITY_CURVE:** Standard. +ELITE in Pair Court. Weight 0 if pack size is 1 and the player has no summon.
- **SYNERGIES:** `ignite_alchemist`, `plague_rat`, `plus_cutter`, `pincer_acolyte`, `gale_deacon`
- **WEAKNESSES:** Isolate; Self Anchor one body; already adjacent in a safe pocket
- **PLAYER_COUNTERPLAY:** Desummon; stand 5+ apart; Nail Down
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-draw-together` (`lord_of_static` MULTI already claimed — family observe is a **second** door; do not restamp)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (pair attract; do not call Void Collapse)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `ledger_siphon`

- **NAME:** Ledger Siphon
- **ROLE:** debuffer / controller (current AP steal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop`. Distinct from `soul_siphon` (current **MP**), `hex_teller` (next-cast AP tax), Drain Courage (debit, no grant). At most one per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Sip if target leftover AP ≥ 1. Peer: skip if target AP is 0 or caster is already at max AP **and** has no follow-up that needs the stolen point. Above: Sip then Hex-Toll **is forbidden as PAIR** — use Frost / Slow so they cannot spend the last AP walking into safety.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.00, sr 1.10, res 0.80, init 1.35, chc 0.80. **0 HP damage.** Init is high so the steal lands before their spell.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "steal_ap_if_target_leftover_ge_1"`. VETERAN: skip at target AP 0 (would fizzle). ELITE: Sip then Far-Sting-ally while they cannot Strike. CHAMPION: Sip the leftover **3** so Inferno becomes illegal this turn (public bar).
- **CORE_SPELL_POOL:** `spell-ap-sip`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-weaken`
- **RARE_SPELL_POOL:** `spell-drain-courage` (debit **after** the steal — readable two-step, still not Hex Toll)
- **ELITE_SPELL_POOL:** none — CHAMPION is sip-the-nuke-window, not a 2-AP steal
- **SIGNATURE_MECHANICS:** `stealApAmount: 1` from **current** leftover AP, add 1 to caster current AP this turn. No lingering `debuffStat: "ap"`. Caster at max AP: they still steal (target loses 1) and the +1 is wasted — legal. Not a heal.
- **VARIANT_PROGRESSION:** BASE steal-if-ap → VETERAN no-fizzle → ELITE deny-strike → CHAMPION deny-inferno
- **RARITY_CURVE:** Standard. +VETERAN in Ledger Choir. Do **not** PAIR with `soul_siphon` or `hex_teller`.
- **SYNERGIES:** `ley_tollkeeper` (MP axis, not AP), `far_stinger`, `origin_mason` (COURT: leftover AP **and** origin tax)
- **WEAKNESSES:** Spend leftover AP first; sit at 0; Timestep after
- **PLAYER_COUNTERPLAY:** Dump the spell before its init; cheap Strike; kill the Siphon first in Ledger Choir
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-ap-sip` (ENEMY_DISCOVERY; SDE also stamps `hex_teller` / `bone_scribe` G≥4 — first observe+win wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `shove_chaplain`

- **NAME:** Shove Chaplain
- **ROLE:** protector / displacement specialist (ally shove)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `king` **without** heal. Distinct from `hook_chaplain` (pull **to caster**), `bash_bruiser` (hostile push), Relay Dash (ally **walk** ≤2). Reroll if pack has no allied summon / partner. At most one per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no ally in range 2. Peer: Body Check if the push cell is free and improves a pincer / leaves a hazard / peels the pet off lava. Above: skip if landing is lava while ally HP% < 40, or if the push traps the ally in a closet.
- **STAT_SCALING_RULE:** hp 1.05, sp 0.85, sr 0.95, res 1.05, init 1.10, chc 0.80. **0 damage on the shove.** Threat is **the space it creates**.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint` from #342 (ally shove if landing improves). VETERAN: dest-check (pit / lava / void / occupied → skip). ELITE: shove into a pincer cell / off a fuse / onto a Twin Gate pad. CHAMPION: Stride-Hunter pack so `movedThisTurn` is public after the shove.
- **CORE_SPELL_POOL:** `spell-body-check`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-shield` on the shoved ally, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-leash-hook` **only if** `hook_chaplain` is absent (do not pull+push as CORE identity)
- **ELITE_SPELL_POOL:** Do **not** unlock Relay Dash as CORE (G≥4 stamp on `leash_warden` / `font_cantor` stays theirs). CHAMPION may take Relay Dash only if Warden and Font are absent.
- **SIGNATURE_MECHANICS:** `applyPushback` 1 on an **ally**, away from caster. Not a teleport. Landing **must** tick. Pushing the **player** is illegal on this card when the **player** casts it; when this family casts it, the ally is enemy-side.
- **VARIANT_PROGRESSION:** BASE shove-if-ally → VETERAN dest-check → ELITE combo-landing → CHAMPION brand-the-slide
- **RARITY_CURVE:** Standard. +ELITE in Shove School / Pincer Gate.
- **SYNERGIES:** `pincer_acolyte`, `stride_hunter`, `hook_chaplain` (COURT teach), `twin_sentry`
- **WEAKNESSES:** Isolate; Self Anchor the pet; occupy the push cell
- **PLAYER_COUNTERPLAY:** Desummon; Nail Down the pet; stand in the only push cell
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-body-check` (ENEMY_DISCOVERY; SDE stamps `iron_golem` / `leash_warden` G≥4 — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (resolver exists; zero cast callers today)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `origin_mason`

- **NAME:** Origin Mason
- **ROLE:** hazard creator / anti-ranged (cast-origin AP tax)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `bishop`. Distinct from `tax_scribe` (enter-AP), `hex_teller` (unit next-spell), Glyph Tax (enter). At most one per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: paint the tile the player currently occupies if they hold any `apCost >= 3`. Peer: skip if the player already has 0 leftover AP and must walk (they will step off). Above: paint the **Morrow dest** / Twin Gate pad they will arrive on, not the empty cell they left.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 1.05, res 1.00, init 1.20, chc 0.80. **0 HP on the paint.** Init is high so the glyph lands before their nuke.
- **AI_TIER_PROGRESSION:** Profile `caster` / setter. `aiHint: "paint_origin_tax_on_player_cast_cell"`. VETERAN: skip if they must walk off this turn. ELITE: paint then Far-Sting / Bias so staying to snipe is expensive. CHAMPION: two glyphs if AP allows (cap 2 live per Mason); last-writer vs Barrier (Barrier fills the cell — tax dies).
- **CORE_SPELL_POOL:** `spell-cast-snare`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark` on a **different** tile (decoy vs tax), `spell-slow`
- **RARE_SPELL_POOL:** `proposed:spell-glyph-tax` only if `tax_scribe` is absent (do not two-tax a PAIR)
- **ELITE_SPELL_POOL:** none — CHAMPION is dual-glyph discipline. Do not steal Hex Toll.
- **SIGNATURE_MECHANICS:** Tile: spells whose **caster origin** equals this cell cost +1 AP for 2 turns. Walk / potions do not pay. Attack Nearest origin is the **player** tile. Summon casts from the summon cell. Do **not** use `isTrap` (still a fake wall). Does not block LoS or walk.
- **VARIANT_PROGRESSION:** BASE paint-feet → VETERAN skip-if-they-must-walk → ELITE tax-the-gun → CHAMPION dual-glyph
- **RARITY_CURVE:** Standard. +ELITE in Origin Tax / Morrow Snare / dungeons. Do **not** PAIR with `tax_scribe`.
- **SYNERGIES:** `glass_sniper` (they want to camp), `hex_teller` (COURT: tile + unit), `morrow_walker`, `far_stinger`
- **WEAKNESSES:** Step off; Barrier the cell; cheap Strike from a neighbor
- **PLAYER_COUNTERPLAY:** Walk 1; Attack Nearest from a clean tile; kill the Mason first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cast-snare` (ENEMY_DISCOVERY; SDE stamps `tax_scribe` / `glyph_sower` G≥4 — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (origin check in `planPlayerCastAttempt` / enemy cast; Attack Nearest shares it)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `bait_prelate`

- **NAME:** Bait Prelate
- **ROLE:** anti-summon / protector (intercept post)
- **BASE_ELIGIBILITY:** New family; preferred chassis `king`. Replaces random overlay on this body. Distinct from `pylon_prelate` (empty kit wall), `void_mirror` (reflect), `pain_suture` (redirect to a hostile), `font_cantor` (heal pulse), False Retreat (self decoy). At most one per pack. Do **not** also roll wolf/archer overlay. Do not co-spawn with `pylon_prelate`, `stone_castellan`, or `font_cantor`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: plant bait Chebyshev ≤ 2 from self. Peer: skip if cap reached. Above: plant so intercept range covers the golem **and** not an easy Strike from the player (1 HP dies to any chip).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.90, sr 1.00, res 0.95, init 0.80, chc 0.70. Bait uses existing `getSummonBaseStats` with `damageScale: 0`, `hpScale` such that maxHp = 1 after rounding (do not mint Inf-HP; admin `hpScale` 0–10 still applies). **No `healAmount` on the Prelate CORE.**
- **AI_TIER_PROGRESSION:** New summon AI `bait` (#342): `mp: 0`, **must not path**, kit `spell-bait-eat` only. `inferSummonArchetype` must key `summonAI === "bait"`, never `name.includes("bait")`. VETERAN: skip if cap reached. ELITE: Shield the owner, not the 1-HP post. CHAMPION: Twin-Sentry pack so the bait is swapped into intercept range after the player commits a snipe angle.
- **CORE_SPELL_POOL:** `spell-bait-pylon` (**family flip** `usableByEnemy: true` for this id only if #342 shipped it player-first)
- **ADVANCED_SPELL_POOL:** `starter-shield` (on the **owner**), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-mirror` only if a family flip is approved — otherwise skip (Mirror is a different identity; Bait **eats**, Mirror **reflects**)
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / bomber / pylon / font / decoy on this body.
- **SIGNATURE_MECHANICS:** Occupies. Lifespan 3. While Chebyshev ≤ 2 from owner, the next hostile damaging/debuff/DoT aimed at the owner redirects to the bait and the bait dies. AoE: owner share eaten; rest of wedge still hits others. Intercept does **not** fire on walks, lava, or Sacrifice self-HP. Bait before Mirror before absorb (explicit order). 0 XP on bait death. Cap shares `ENEMY_SUMMON_CAP`. Nested `spell-bait-eat` is `NOT_PLAYER_LEARNABLE`.
- **VARIANT_PROGRESSION:** BASE plant → VETERAN respect-cap → ELITE skin-the-owner → CHAMPION swap-the-bait
- **RARITY_CURVE:** Standard. +ELITE in Bait Gate. Weight 0 on cramped 1-tile closets.
- **SYNERGIES:** `iron_golem`, `twin_sentry`, `null_censor` is a **counter** to extra summons, not a partner bait
- **WEAKNESSES:** Chip the 1 HP; sit outside intercept 2; Cursed Wound does not care — kill the post
- **PLAYER_COUNTERPLAY:** Strike the bait; AoE the owner after it dies; wait the lifespan
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-bait-pylon` (ELITE observe+win; SDE also stamps `brood_chanter` / `pylon_prelate` — first child wins). `spell-bait-eat` never owned.
- **REWARD_EXPECTATION:** Standard. Bait death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** MED–HIGH (new `SUMMON_KIT.bait`; admin `summonAI` allow-list; intercept **before** Mirror)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `morrow_walker`

- **NAME:** Morrow Walker
- **ROLE:** teleporter (delayed self-blink)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `knight`. Distinct from `mist_walker` (instant), `twin_porter` (pads), `blink_cutter` (ally swap), `wraith_bishop` (Swap lore). At most one per pack. Weight 0 on 1-tile closets.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: paint dest behind self if kiting. Peer: skip if dest is adjacent to the player (they will camp it). Above: paint onto a slide / Mark / origin-tax **empty** cell, never onto a pit (`isCellFree` false — arrival fizzles).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 1.00, res 0.80, init 1.20, chc 0.85. **0 damage on the paint.**
- **AI_TIER_PROGRESSION:** Profile `kiter` / caster. `aiHint` from #342 (delayed blink dest). VETERAN: skip if dest is adjacent to the player. ELITE: dest on a Cast-Snare they already painted (pack) or off a fuse. CHAMPION: Recoil/Body-Check pack so something occupies the **old** cell as they leave (not Second Shadow — that is lurker ENEMY_ONLY).
- **CORE_SPELL_POOL:** `spell-morrow-step`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark` on dest, `spell-shadow-veil` after paint
- **RARE_SPELL_POOL:** `spell-mist-step` **only if** `mist_walker` is absent (do not two-blink a PAIR)
- **ELITE_SPELL_POOL:** Do **not** unlock Twin Gate / Triune Gate as identity
- **SIGNATURE_MECHANICS:** Paint a free floor cell. At **this unit’s next turn start**, teleport if `isCellFree`. Occupied dest: fizzle arrival, mark dies. Death before start: drop the mark. Do **not** use map `portals`. Observation is paint, not arrival. Hazard on arrival **must** tick.
- **VARIANT_PROGRESSION:** BASE kite-paint → VETERAN no-gift-to-player → ELITE combo-dest → CHAMPION leave-the-old-cell-hot
- **RARITY_CURVE:** Standard. +ELITE on `void_rift` / Morrow Snare.
- **SYNERGIES:** `origin_mason`, `trip_mason`, `slide_mason`, `recoil_squire`
- **WEAKNESSES:** Occupy dest; Barrier dest; Cast Snare the dest; kill before turn start
- **PLAYER_COUNTERPLAY:** Sit on the mark; Origin-tax it; wait and Strike the arrival
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-morrow-step` (`morrow_herald` MULTI child on boss PR #367 — first child wins; family observe is a **second** door; do not restamp)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (turn-start arrival flag; not RAF; not `portals`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `surplus_warder`

- **NAME:** Surplus Warder
- **ROLE:** tank-lite / kiter (leftover-AP evade)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `sidestep_warder` (unconditional evade), `plate_warden` (absorb), `void_mirror` (reflect). At most one per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Surplus Ward only if current AP ≥ 4 (2 pay + 2 leftover). Peer: skip if already charged, or if they still need those 2 AP to Strike this turn. Above: Goad-ally pack so the forced swing is the one that misses **if** they held leftover.
- **STAT_SCALING_RULE:** hp 0.95, sp 0.80, sr 0.95, res 0.90, init 1.25, chc 1.10. **Lower HP than golem** — the miss is the extra life. Do **not** write `buffStat: "evasion"`.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "evade_if_leftover_ap_ge_2_after_pay"`. VETERAN: skip if current AP < 4. ELITE: evade then skip Strike (hold leftover). CHAMPION: Goad pack — they must throw the swing you dodge.
- **CORE_SPELL_POOL:** `spell-surplus-ward`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-shadow-veil`
- **RARE_SPELL_POOL:** `spell-sidestep-ward` **only if** `sidestep_warder` is absent (do not two-evade a PAIR)
- **ELITE_SPELL_POOL:** none — CHAMPION is greed-discipline, not percent miss
- **SIGNATURE_MECHANICS:** Same `evadeNextHits: 1` consume as Sidestep, **gated** on leftover AP ≥ 2 **after** this spell’s debit. Failed greed: AP spent, CD written, no charge. AoE: first instance vs this unit misses. 0-damage control does not consume. Lava/spikes do not consume. Sacrifice self-HP is not incoming.
- **VARIANT_PROGRESSION:** BASE evade-if-rich → VETERAN ap-gate → ELITE hold-leftover → CHAMPION bait-the-goad
- **RARITY_CURVE:** Standard. +ELITE in Surplus Goad. Do **not** PAIR with `sidestep_warder`.
- **SYNERGIES:** `goad_herald`, `ash_absolver`, `ledger_siphon` is a **counter** (steals the leftover the Ward needs)
- **WEAKNESSES:** Drain leftover AP first; wait CD 3; second damaging instance
- **PLAYER_COUNTERPLAY:** AP Sip / Drain Courage; cheap 2-cost to bait the greed; control then hit
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-surplus-ward` (`doka_hoarder` is the official door — family observe is a **second** door; do not restamp the feat)
- **REWARD_EXPECTATION:** Standard. No extra Doka for “tankiness.”
- **IMPLEMENTATION_COMPLEXITY:** LOW (Sidestep consume + leftover AP check)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `sated_knight`

- **NAME:** Sated Knight
- **ROLE:** bruiser (high-HP% physical)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` or `rook`. Distinct from `coup_duelist` (≤25% instant), `execute_jackal` (wait 30–40%), `crimson_spawn` (lifesteal / low-HP lore), Last Ember (low-HP next physical). At most one per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if HP% < 70. Peer: Sated Fang only while HP% ≥ 70. Above: refuse Fang under 70 (Strike / Shield instead); peel to Cantor range rather than dump HP into a 5-cost greed.
- **STAT_SCALING_RULE:** hp 1.15, sp 1.10, sr 0.90, res 0.95, init 1.05, chc 1.05. Identity is **the 70% gate**, not a fatter Strike. Do not grow HP just to stay legal — Cantor / Plate is the pack answer.
- **AI_TIER_PROGRESSION:** Profile `charger` (not healer — **no** `healAmount` on CORE). `aiHint` from #342 (HP% ≥ 70). VETERAN: skip Fang under 70. ELITE: path to Cantor / Plate rather than eat lava. CHAMPION: refuse Sacrifice / Sanguine Toll if those ids ever appear on the body (they would drop the bar).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-sated-fang`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `vampire_bite` only if `crimson_spawn` is absent (do not two-vamp a PAIR)
- **ELITE_SPELL_POOL:** none — honesty is the elite. Do not steal Coup.
- **SIGNATURE_MECHANICS:** Legal only when `hp / maxHp >= 0.70`. Fail closed if `maxHp` is 0. Percent is current battle HP. Physical hit through existing helpers. Pacifist: damaging.
- **VARIANT_PROGRESSION:** BASE fang-or-strike → VETERAN gate → ELITE stay-healthy → CHAMPION refuse-self-cost
- **RARITY_CURVE:** Standard. +ELITE in Sated Plate. Never CHAMPION in a solo pack without a heal source.
- **SYNERGIES:** `pale_cantor`, `plate_warden`, `font_cantor` is COURT not PAIR with Cantor (Wave 4 law)
- **WEAKNESSES:** Chip below 70%; Cursed Wound; Bitter Cup the next Mend
- **PLAYER_COUNTERPLAY:** Poke before they Fang; don’t let Cantor top them; Goad a waste Strike
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-sated-fang` (`rich_vampire` is the official door — family observe is a **second** door; `crimson_spawn` may also demonstrate; do not restamp the feat)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (HP% gate; no new damage formula)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `verse_scribe`

- **NAME:** Verse Scribe
- **ROLE:** controller / status specialist (copy hostile last id)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `queen` **without** heal. Distinct from `bone_scribe` (stat shred), After Verse (copies **yours**, BOSS), Echo Cast (primes **your next**, BOSS). At most one per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no last-resolved hostile id this battle. Peer: Stolen Verse only if a living player-side body has a last-resolved non-denylisted id and a second legal tile exists. Above: skip if the last id is Strike (use Frost); prefer stealing Frost / Inferno / Bias.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.10, sr 1.15, res 0.75, init 1.10, chc 0.90. Payload is **50% of their last spell**, not a bigger Frost. If it is topping the meter with raw CORE Frost, the echo never fired.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "echo_hostile_last"`. VETERAN: skip if no last-resolved / denylist / no legal tile. ELITE: wait one turn if they have not spent a stealable id yet (Tempo pack can bait Frost). CHAMPION: Goad a cheap Strike so the stolen id is Strike — only if Inferno is not already last.
- **CORE_SPELL_POOL:** `spell-stolen-verse`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-quiet-hex` only if a family flip exists — otherwise skip (Silence stays BOSS_ONLY as Hex of Silence)
- **ELITE_SPELL_POOL:** Do **not** unlock After Verse / Echo Cast / False Echo
- **SIGNATURE_MECHANICS:** Re-resolve a living hostile-to-caster’s last `castResult === "cast"` id at 50% `damage` / `healAmount` / `dotDamage` (round half up, min 1 if original > 0). AP paid is Stolen Verse’s 3. Original MP / HP riders **do not** re-fire. Denylist (ids, not names): Stolen Verse, After Verse, Echo Cast, Timestep, Sacrifice, any `isSummon`, Twin Gate, Triune Gate, Morrow Step, Cut In, Ley Toll, Sanguine Toll.
- **VARIANT_PROGRESSION:** BASE echo-or-frost → VETERAN no-empty-echo → ELITE wait-for-nuke → CHAMPION bait-the-id
- **RARITY_CURVE:** Standard. +ELITE in Verse Pulpit / `stolen_pulpit` teach room (#371). Do **not** PAIR with `bone_scribe`.
- **SYNERGIES:** `tempo_precentor`, `glass_sniper`, `goad_herald`
- **WEAKNESSES:** Hold the nuke until they have spent Verse; fizzle the original (no last-resolved); Quiet Hex
- **PLAYER_COUNTERPLAY:** Cast a denylisted utility last; kill the Scribe before you Inferno
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stolen-verse` (ENEMY_DISCOVERY; SDE stamps `bone_scribe` / `pale_cantor` G≥4 — first child wins). Observe Stolen Verse **cast**, not the stolen id (that id observes itself separately if eligible).
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** HIGH (last-resolved pipeline per combatant; denylist; 50% re-resolve)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `misstep_herald`

- **NAME:** Misstep Herald
- **ROLE:** controller (force next walk cardinal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `bishop`. Distinct from `axis_locksmith` (whole walk on one axis), `glyph_sower` (hazard paint), File Slide (moves them **now**), Root (0 walk). At most one per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Misstep if a chosen cardinal lands on pit / fuse / cinder / lava. Peer: skip if all four cardinals are blocked or all four are safe. Above: Misstep the only step that completes a Gale wedge / Oblique spoke.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 1.05, res 0.90, init 1.30, chc 0.80. **0 damage on the mark.** Init is high so the dir lands before their walk.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "force_next_step_cardinal"`. VETERAN: skip if no cardinal is a hazard / snare / pit. ELITE: pick the dir a Gale / Bias ally wants. CHAMPION: lock is **not** this family’s CORE — pack with Locksmith / Pit instead of stealing Rank Lock.
- **CORE_SPELL_POOL:** `spell-misstep`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the forced dest, `spell-slow`
- **RARE_SPELL_POOL:** `spell-rank-lock` **only if** `axis_locksmith` is absent (do not two-rewrite a PAIR)
- **ELITE_SPELL_POOL:** none — CHAMPION is better dirs, not a 3-turn root
- **SIGNATURE_MECHANICS:** Store N/E/S/W on the target for **1** of their walks. Next 1-step walk **must** be that cardinal if `isCellFree`; if blocked, they may walk another dir (mark consumes). Forced-move spells do **not** consume Misstep. Blink / Swap skip it. Self Anchor does **not** ignore a chosen next-step (walk rewrite, not a push). Landing **must** tick.
- **VARIANT_PROGRESSION:** BASE dir-if-hazard → VETERAN skip-safe-board → ELITE dir-for-ally-gun → CHAMPION pack-pit
- **RARITY_CURVE:** Standard. +ELITE in Misstep Pit / Oblique File. Do **not** PAIR with `axis_locksmith`.
- **SYNERGIES:** `pit_mason`, `gale_deacon`, `oblique_cantor`, `fuse_binder`, `origin_mason`
- **WEAKNESSES:** Don’t walk (duration 1); Swap / Morrow; occupy the dest
- **PLAYER_COUNTERPLAY:** Camp; walk the blocked-cell escape; Absolve does **not** strip unless `cleanseTypes` includes the misstep flag (explicit: it should — implementers add `misstepDir`)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-misstep` (ENEMY_DISCOVERY; SDE stamps `glyph_sower` / `axis_locksmith` G≥4 — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk stepper + preview parity; do not touch turn order)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `bitter_censor`

- **NAME:** Bitter Censor
- **ROLE:** debuffer / anti-heal (invert next heal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop`. Distinct from `null_censor` (summon lockout), Cursed Wound (heal ×0.5), Mercy Hex (their **nuke** → ally heal), `ash_absolver` (strips). At most one per pack. Reroll if no heal source is visible (Wisp / Cantor / Font / Blood Mend in public bar) unless BASE may apply Cup as a trap for a later Mend.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Cup if a heal source is visible. Peer: skip if Cup already live on that body. Above: Cup the body the Font will pulse, not the Font itself (pulse is ally-target heal).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.05, sr 1.10, res 0.80, init 1.25, chc 0.80. **0 damage on the Cup.** If it is killing you with raw damage, the kit is wrong.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "invert_next_heal"`. VETERAN: skip if no visible heal source. ELITE: do not also heal the same target this turn (no Cantor CORE). CHAMPION: Goad a Wisp into the Cup.
- **CORE_SPELL_POOL:** `spell-bitter-cup`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-cursed-wound` (if Cup already consumed — ×0.5 leftover; **order:** Cup consumes first if both would apply), `spell-weaken`
- **RARE_SPELL_POOL:** `spell-null-brand` only if `null_censor` is absent (do not two-censor a PAIR)
- **ELITE_SPELL_POOL:** none — CHAMPION is bait-the-wisp, not a 2× invert
- **SIGNATURE_MECHANICS:** 2 turns. Next `healAmount > 0` on the target (Wisp / Blood Mend / Font pulse / drain-heal portion) deals that amount as spell damage instead and consumes the Cup. Self-HP costs (`recordChallengeSelfHpLoss`) are **not** heals. Challenge: inverted heal is spell-hit through `recordChallengeDamageTaken`.
- **VARIANT_PROGRESSION:** BASE cup-if-healer → VETERAN no-refresh → ELITE cup-the-pulse-target → CHAMPION goad-the-wisp
- **RARITY_CURVE:** Standard. +ELITE in Bitter Font / Quiet Choir. Do **not** PAIR with `null_censor`.
- **SYNERGIES:** `font_cantor`, `cinder_martyr` (anti-synergy with Mend), `goad_herald`, `ash_absolver` is a **counter**
- **WEAKNESSES:** Do not heal; Dispel / Absolve; wait 2 turns; Shield instead of Mend
- **PLAYER_COUNTERPLAY:** Skip the pulse; kill the Censor first in Bitter Font; Iron Skin
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-bitter-cup` (ELITE observe+win; SDE stamps `null_censor` / `ash_absolver` G≥4 — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (heal pipeline invert once; explicit order vs Cursed Wound)
- **STATUS:** PROPOSED

---

## 5. Wave 1–4 amendments (not new ids)

| Family | Amendment | Why |
| :--- | :--- | :--- |
| `fan_prelate` / `ember_knight` | Do **not** steal `spell-gale-fan` as CORE | Cone damage stays Fan. Gale is cone **and** push. SDE G≥4 stamp may remain an extra slot |
| `plus_cutter` / `storm_caller` | Unchanged: do not steal Gale Fan | Plus / bounce ≠ cone+push |
| `pawn_broker` / `blink_cutter` / `rift_hook` | Do **not** steal `spell-twin-guard` as CORE | Hostile trade / caster-swap stay. SDE may stamp Twin Guard on Blink / Share Optic as G≥4 |
| `share_optic` | G≥4 Twin Guard stamp is a **slot**, not identity | Share Optic stays ally range |
| `shadow_lurker` | Do **not** steal `spell-cross-flank` as CORE | Rear / veil stay. G≥4 stamp OK |
| `rank_lancer` / `glass_sniper` / `far_stinger` | Do **not** steal `spell-bias-ray` as CORE | Cardinal line / min-range / tape stay. Bishops may **demonstrate** Bias Ray; grant stays `first_blood` |
| `void_anchoret` / `sink_chanter` | Do **not** steal `spell-draw-together` as CORE | Caster-Hook / tile-gravity stay. SDE G≥4 on Coil / Siphon is a slot |
| `soul_siphon` / `hex_teller` / `bone_scribe` | Do **not** steal `spell-ap-sip` as CORE | MP steal / next-cast tax / stat shred stay. G≥4 stamp OK |
| `hook_chaplain` / `bash_bruiser` / `iron_golem` / `leash_warden` | Do **not** steal `spell-body-check` as CORE | Pull / hostile push / inertia / occupy stay. G≥4 stamp OK |
| `tax_scribe` / `glyph_sower` | Do **not** steal `spell-cast-snare` as CORE | Enter-AP / hazard paint stay. G≥4 stamp OK |
| `pylon_prelate` / `brood_chanter` / `font_cantor` / `void_mirror` | Do **not** steal `spell-bait-pylon` as CORE | Empty wall / mobile pets / heal totem / reflect stay. G≥4 / ELITE stamp OK |
| `mist_walker` / `twin_porter` / `blink_cutter` | Do **not** steal `spell-morrow-step` as CORE | Instant dash / pads / ally swap stay. G≥4 stamp OK |
| `sidestep_warder` / `plate_warden` | Do **not** steal `spell-surplus-ward` as CORE | Unconditional evade / absorb stay. Sidestep may **demonstrate** Surplus; grant stays `doka_hoarder` |
| `coup_duelist` / `execute_jackal` / `crimson_spawn` | Do **not** steal `spell-sated-fang` as CORE | Low-HP windows / lifesteal stay. Crimson may **demonstrate** Fang; grant stays `rich_vampire` |
| `bone_scribe` / `pale_cantor` / `hex_chorister` | Do **not** steal `spell-stolen-verse` as CORE | Stat shred / heal / Enrage stay. G≥4 stamp OK |
| `axis_locksmith` / `glyph_sower` / `rank_lancer` | Do **not** steal `spell-misstep` as CORE | Axis lock / paint / file poke stay. G≥4 stamp OK |
| `null_censor` / `ash_absolver` / `cinder_martyr` | Do **not** steal `spell-bitter-cup` as CORE | Summon lockout / cleanse / martyr stay. ELITE stamp OK |
| `cinder_martyr` | Do **not** steal `spell-sanguine-toll` | Third `mpCost` hybrid is BOSS `starved_vampire_pawn`. No tithe family |
| `hex_chorister` | Do **not** steal Cut In / After Verse / Eclipse Fold | Round-wrap / player-echo / skip-summons stay boss / closed |
| `hex_chorister` CHAMPION | Still `spell-repel-ring` ENEMY_ONLY (SDE) | Not a 16th Wave-5 family |
| `shadow_lurker` CHAMPION | Still `spell-second-shadow` ENEMY_ONLY (SDE) | Not a 16th Wave-5 family |
| All prior waves | Fifth `wRare` 2% skin still applies | Mechanical identity, not a level bracket |
| Stationary-post cap | Now includes bait | One of pylon / turret / font / bait |

---

## 6. Identity matrix (Wave 5 — keep kits coherent)

When a future spell is assigned, it must match the family’s allowed categories. If it does not, drop it — do not “fill a slot.”

| Family | Allowed categories / flags | Forbidden |
| :--- | :--- | :--- |
| gale_deacon | `areaShape: cone` + push, damage, isMark | heal, isSummon, Fan Bolt as CORE, melee-only |
| twin_sentry | two-ally swap, defense, damage (frost) | healAmount, `isSwap` as CORE, Pawn Trade as CORE, inferno |
| pincer_acolyte | two-ally-adjacent damage, physical, veil, isMark | heal, isSummon, sprite-facing as identity, rear-cut as CORE |
| oblique_cantor | `diagonal: true` damage, isMark, `modifiableRange` | heal, isSummon, cardinal-line as CORE, `shadow_strike` import |
| pair_binder | pair attract toward midpoint, damage (frost), isMark | heal, isSummon, Hook-to-caster as CORE, Void Collapse |
| ledger_siphon | `stealApAmount`, damage, debuff(mp) | heal, isSummon, steal-MP as identity, next-cast tax as CORE, inferno |
| shove_chaplain | ally `applyPushback`, defense, physical | healAmount, isSummon, hostile-push as CORE, pull-to-caster as CORE |
| origin_mason | cast-origin AP tax tile, damage, isMark | heal, isSummon, enter-AP as identity, `isTrap`, Hex Toll |
| bait_prelate | isSummon (`bait`), defense | turret/wolf/archer/bomber/pylon/font/decoy, healAmount on the **caster**, inferno, reflect-as-identity |
| morrow_walker | delayed self-teleport, damage, isMark, veil | heal, isSummon, map-`portals`, Mist Step / Twin Gate as CORE |
| surplus_warder | leftover-AP `evadeNextHits`, damage (physical), defense | heal, isSummon, `buffStat: evasion`, unconditional Sidestep as CORE |
| sated_knight | high-HP% physical, defense | healAmount, isSummon, low-HP execute as CORE, Sanguine Toll |
| verse_scribe | `echoHostileLast`, damage, isMark, debuff | heal, isSummon, After Verse / Echo Cast / False Echo, Inferno as CORE |
| misstep_herald | `forceNextStepCardinal`, damage, isMark, debuff(mp) | heal, isSummon, axis-lock as CORE, root as CORE, File Slide as identity |
| bitter_censor | next-heal invert, damage, anti-heal | healAmount, isSummon, Null Brand as CORE, Mercy Hex as identity |

Wave 1 matrix in the 2026-08-31 doc, Wave 2 in 2026-09-01, Wave 3 in 2026-09-02, and Wave 4 in 2026-09-21 still apply to those ids.

---

## 7. Role coverage after Wave 5

| Archetype | Wave 1 owner | Wave 2 extra | Wave 3 extra | Wave 4 extra | Wave 5 extra (new verb) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| bruiser | crimson_spawn | rank_lancer, bash_bruiser | — | recoil is **self**-push | sated_knight (high-HP% physical) |
| sniper | glass_sniper | — | — | far_stinger (tape) | oblique_cantor (diagonal) |
| kiter | tide_shade | — | — | recoil_squire, sidestep_warder | surplus_warder (leftover-AP evade), morrow_walker |
| assassin | shadow_lurker | execute_jackal | coup_duelist | stride_hunter | pincer_acolyte (occupancy) |
| healer | pale_cantor | — | ash_absolver is **cleanse** | font_cantor is a **totem** | bitter_censor is **anti-heal**, not a second Cantor |
| buffer | hex_chorister | leech_familiar | tempo_precentor | ley_tollkeeper, share_optic | twin_sentry is **swap**, not a hymn |
| debuffer | bone_scribe | tax_scribe | dim_optic | hex_teller, soul_siphon | ledger_siphon (AP steal), bitter_censor |
| summoner | brood_chanter | stone_castellan, leech_familiar | pylon_prelate | font_cantor | bait_prelate (intercept post) |
| controller | coil_arbiter | snare_weaver, void_anchoret | rime/smoke/sink | axis_locksmith, soul_siphon | pair_binder, verse_scribe, misstep_herald, ledger_siphon |
| tank | iron_golem | plate_warden | goad_herald | sidestep is evade | surplus_warder is gated evade, not HP |
| protector | leash_warden | pain_suture | hook_chaplain, twin_tether | — | twin_sentry, shove_chaplain, bait_prelate |
| artillery | storm_caller | ricochet_vicar, stone_castellan | plus_cutter | fan_prelate (cone) | gale_deacon (cone+push), oblique_cantor |
| kamikaze | cinder_martyr | — | — | — | — (Sanguine Toll is BOSS, not a second martyr) |
| teleporter | wraith_bishop, blink_cutter | mist_walker | — | twin_porter (pads) | morrow_walker (delayed self) |
| displacement | rift_hook | bash_bruiser, void_anchoret | sink, hook_chaplain | pawn_broker, slide_mason, recoil_squire | gale_deacon, pair_binder, shove_chaplain |
| hazard creator | ember_knight, glyph_sower | trip_mason | fuse, rime, smoke | pit_mason, slide_mason | origin_mason (cast-origin tax) |
| status specialist | plague_rat | bell_sexton | ignite_alchemist | stride_hunter | verse_scribe, bitter_censor, sated_knight |
| anti-summon | null_censor | pain_suture | — | pawn_broker (trade the pet) | bait_prelate (eat the snipe) |
| anti-ranged | void_mirror, rust_reaver | rank_lancer | dim_optic, smoke | hex_teller | origin_mason, bait_prelate, surplus_warder |
| anti-melee | leash_warden | pain_suture, trip_mason | goad, pylon | pit, recoil, sidestep, locksmith | pincer_acolyte, shove_chaplain, misstep_herald |

Every requested archetype still has a Wave 1 owner. Wave 5 does not invent a 21st role word. It adds **verbs**.

---

## 8. Implementation prerequisites (still not this change)

Order from Wave 1 §6, Wave 2 §8, Wave 3 §8, Wave 4 §8, plus Wave 5 verbs:

1. Numeric kit band into `buildEnemyKit` (`WX` 11920) — `currentMap.levelZone` is still an object.
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974). Ratios live in `spawnPolicy.ts` `applyEnemyFamilyStats` after the extraction.
3. Stop writing `res`/`sp` as 0.05–0.75 (`spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128).
4. Explicit `aiProfile` / `familyKit`; stop healer inference and `family.includes("berserk")`.
5. Force preferred chassis on family roll (`maybeApplyEnemyFamilyVariant` still keeps random `pieceType`).
6. Wave 1 kits first (live ids), then Wave 2, Wave 3, Wave 4 **one at a time**, then Wave 5: Fan Bolt cone helper → Gale push-on-wedge → two-ally swap → pincer occupancy → `diagonal` catalog row → pair attract → AP steal → ally shove caller → origin-tax in `planPlayerCastAttempt` → `summonAI: "bait"` + intercept-before-Mirror → Morrow turn-start arrival → leftover-AP evade → HP% ≥ 70 gate → last-resolved echo pipeline → next-step cardinal preview → heal-invert consume.
7. Proposed spells are metadata rows. Wire `effectParams` keys from SPELL_PROPOSALS Wave 4 / SDE Wave 4, never names.
8. `inferSummonArchetype` must accept `"bait"` (and still `"font"` from Wave 4). Do not parse `"Bait Pylon"`. Admin summon validation must allow the new enum (unknown `summonAI` is rejected today).
9. Register text updates only when hooks land. Do not add Wave 5 names to `EnemyRegister.tsx` as if they were live.
10. Discovery: family observe must not double-grant ACHIEVEMENT / BOSS / MULTI_SOURCE doors (`bias-ray` / `surplus-ward` / `sated-fang` / `twin-guard` / `draw-together` / `morrow-step`).
11. MP debit in `executeCastAttempt` is still required for Ley Toll / Undertow / Sanguine Toll. **Do not** add a fourth `mpCost > 0` row on Wave 5 CORE kits.
12. Cut In / Eclipse Fold / False Echo stay on the dedicated turn-order wrap PR. Do not splice the current actor. Do not touch RAF.

Do **not** retune `pickEnemyLevelFromTiers` percents. Do not treat 999 as endgame. Do not implement `instantKill`. Do not add a parallel reward writer. Do not invent `wp` / `wr` / `scp`. Do not wire `CharacterStats.evasion` as a miss percent. Do not plant Morrow / Twin Gate / Triune into occupancy `portals`. Do not promote `shadow_strike` into `SPELL_ID_CATALOG`.

---

## 9. Held for a later wave (no ids reserved here)

SPELL_PROPOSALS Wave 4 leftover **spell** holes (do not mint colliding `wave5:` spell ids):

- Mid-turn live splice of `turnOrder` during the current actor (**hold** — AGENTS.md forbids incidental turn-logic edits; Cut In / Eclipse Fold already consume the wrap PR)
- A fourth pure `mpCost > 0` walk-positioning snipe
- Sprite-facing damage (Rear Cut owns walk-facing; Cross Flank owns occupancy)
- Player-owned silence (Hex of Silence stays BOSS_ONLY)
- Ally dash to a clicked cell **beyond 2 walk steps** (Relay Dash is the 2-step stamp; Body Check is a 1-tile shove)
- Two-cell occupy
- Cooldown steal
- Copy **the enemy’s** last spell as a **player** card is Stolen Verse (this wave families it). After Verse remains BOSS self-echo.

SDE Wave 4 unique ids that stay **stamps**, not new families:

- `spell-triune-gate` → `twin_porter` / `void_mirror`
- `spell-relay-dash` → `leash_warden` / `font_cantor`
- `spell-camp-tax` / `spell-still-brand` → `hex_chorister` / `execute_jackal` (still-brand was the late W2 stamp)
- `spell-rooted-sight` / `spell-nail-down` → `iron_golem` / `plate_warden` / `stone_castellan`
- `spell-haze-pane` → `smoke_thurifer`
- `spell-waste-pace` → `coil_arbiter` / `soul_siphon`
- `spell-keep-kennel` → `brood_chanter`
- `spell-momentum-cut` → `rust_reaver` / `stride_hunter`
- `spell-ward-cell` → `void_anchoret` / `void_mirror`
- `spell-spent-stride` → `tide_shade` / `ley_tollkeeper`
- `spell-wounded-lens` / `spell-pit-sight` → `glass_sniper` / `pit_mason`
- `spell-grounded-lock` → `void_mirror` (late W2 stamp)
- `spell-second-shadow` / `spell-repel-ring` / `spell-false-echo` → ENEMY_ONLY / BOSS_ONLY

If a 2026-09-22 SPELL_PROPOSALS wave stamps new verbs after this document, **Wave 6** owns those families. Do not guess their ids here.

---

## 10. What this run did not do

- No production TypeScript / Motoko.
- No re-proposal of the 22 Wave 1, 14 Wave 2, 14 Wave 3, or 15 Wave 4 ids as new families.
- No boss redesign (Cut In / After Verse / Sanguine Toll / Eclipse Fold stay where #342 / #367 put them).
- No player or enemy level cap.
- No RAF / mapGen / turn / damage-math edits.
- No reward writers outside `applyRewards`.
- No new persist stats (`wp` / `wr` / `scp` stay gone).
- No `spell-blood-tithe` enemy family (player-first; martyrs already exist).
- No fourth `mpCost > 0` walk snipe on CORE kits.
- No `buffStat: "evasion"` miss formula.
- No Morrow / bait reuse of world-portal occupancy.
- No Hex Toll pool.
- No restamp of `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald`.
- No `EnemyRegister.tsx` lore rows presented as live.
- No `wave5:` colliding spell ids.

# Enemy and Elite Evolution Design — Wave 9

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-09-26  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Ninth daily pass. New world-pack families that consume **SPELL_PROPOSALS Wave 8 verbs** (`SPELL_PROPOSALS_2026-09-25.md`, open PR #563): heal-if-caster-walked, 90° pair-hinge of two hostiles around their midpoint, ally all-CD flush, isolated-target poke, delayed next-turn absorb, walk-MP seal (casts legal), diagonal-only walk lock, slide an existing barrier, delayed tile heal, return-half poke, leftover-AP dump to ally, 1-HP dummy taunt post, enter-heal pad, unit-scoped next-hit amp, split-heal with an adjacent ally. Plus **SDE Wave 7 unique CORE** verbs Wave 8 held (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md`, open PR #533) because they still have no CORE owner. Bosses stay on the existing catalog. Court Hinge / Pack Still / File Fold stay **boss / closed-class / ENEMY_ONLY** — not world-pack CORE.

**Does not replace:**
- [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md) (Wave 1, 22 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-01.md`](./ENEMY_ELITE_EVOLUTION_2026-09-01.md) (Wave 2, 14 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-02.md`](./ENEMY_ELITE_EVOLUTION_2026-09-02.md) (Wave 3, 14 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-e9f5/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-21.md) (Wave 4, 15 family sheets — open PR #349; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-22.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-3823/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-22.md) (Wave 5, 15 family sheets — open PR #405; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-ef30/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-23.md) (Wave 6, 13 family sheets — open PR #452; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-a2f2/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-24.md) (Wave 7, 14 family sheets — open PR #535; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-8b4d/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-25.md) (Wave 8, 17 family sheets — open PR #558; not on `main` yet)

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 8

Re-read against `HEAD` `0f5363f` (Merge PR #332). Wave 8 closed as docs in the 2026-09-25 pass (PR #558). SPELL_PROPOSALS Wave 8 (PR #563) stamped three holes Wave 7 / Wave 8 **held** (heal-if-caster-moved; 90° hinge of two hostiles as a pair; reset **all** of another combatant’s CDs) plus thirteen siblings. SDE Wave 8 (PR #590) then stamped a **new** unique catalog (`spell-odd-stride` … `spell-about-hinge`). Stamping a verb onto `iron_golem` / `glass_sniper` as a G≥7 extra is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (`wc -l`). Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 8 claim | 2026-09-26 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–8 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16818; void 25% reflect `castHelpers.ts` 336–337 | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `0.12 + playerLevel * 0.02` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `ENEMY_SUMMON_CAP` | `gameConstants.ts` 300 = **2** | Dummy Post counts as **1**. Triple Span still counts as **3** — skip until remaining cap ≥ 3 |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile. Gait Mend / Mend Wick / Enter Mend / Split Mend **must** live only on healer profiles |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `font` / `pylon` / `turret` / `bait` / `decoy` / `span` / `twinspan` / `spark` / `triplespan` / **`dummypost`** |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** | Wave 6–8 facing families still fail closed until a battle-walk writer exists. Wave 9 adds **zero** facing cards |
| `executeCastAttempt` | `WX` 17096–17207: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 9 CORE rows stay `mpCost: 0`. Walk Toll is `nextWalkMpTax`, not `spell.mpCost` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Pair Hinge is occupancy dests, **not** `isSwap`. Ally Reel is the second **cast** caller of `applyAttract` (File Reel is the first) |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| Heal-if-walked / pair hinge / ally CD flush / isolated poke / delayed plate / gait seal / diag lock / brick shift / delayed tile heal / return poke / leftover dump / dummy post / enter heal / body mark / split heal | Still absent in live catalog | Wave 9 primary opportunity (SPELL_PROPOSALS Wave 8) |
| Even Manhattan / Strike-until-walk / ground-only next spell / walk +1 MP / leftover freeze / ally-pull / copy-paint / blink-seal / enter +MP / cluster split / wall-adj bonus / cast-detonate mark / pause summon life / steal summon CD / occupy last cell / incoming cap 30 / untouched LoS | Still absent as CORE identities | Wave 9 secondary opportunity (SDE Wave 7 unique CORE) |

**Live families (the only `EnemyFamily` union members besides `default`):**

| Id | Spawn overlay (`FAMILY_STAT_MULTS`) | Live combat identity | Why HP/dmg alone is not a family |
| :--- | :--- | :--- | :--- |
| `wraith_bishop` | hp 0.6 / dmg 1.4 / res 0.1 | Kit is still bishop Frost/Poison | Glass-cannon **numbers**, not a new verb |
| `iron_golem` | hp 2.5 / dmg 0.7 / res 0.75 | Kit is still rook Strike/Iron Skin | Sponge **numbers**; Strike Hold is not CORE here |
| `plague_rat` | hp 0.4 / dmg 0.6 / res 0.05 | Kit is still pawn Strike/Venom | Swarm **numbers**; Ignite is Wave 3 |
| `ember_knight` | hp 1.1 / dmg 1.0 / res 0.3 | Melee apply burn (`WX` 16789–16804) | Only live DoT hook. Echo Paint is not CORE here |
| `tide_shade` | hp 0.8 / dmg 0.9 / res 0.15 | Melee apply slow (`WX` 16805–16818) | Only live MP-debit hook. Walk Toll is not CORE here |
| `bone_scribe` | hp 0.7 / dmg 0.5 / res 0.1 | Kit is still bishop Frost/Poison | Lore debuffer. Purse Lock is not CORE here |
| `void_mirror` | hp 1.0 / dmg 0.8 / res 0.2 | 25% reflect (`castHelpers.ts` 336–337) | Only live reflect. Return Sting is not CORE here |

The 30% overlay never changes kit, AI profile, or preferred chassis. Wave 9 families exist so those verbs are **sentences**, not extra HP.

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

**Wave 6 ids — do not re-propose:**  
`oncoming_knight`, `pin_cantor`, `glance_ward`, `gait_muter`, `vault_chaplain`, `span_warder`, `span_prelate`, `cadence_thief`, `brand_plate`, `cover_squire`, `lintel_mason`, `act_teller`, `act_sexton`.

**Wave 7 ids — do not re-propose:**  
`post_stinger`, `purse_scribe`, `corner_bishop`, `hinge_squire`, `file_reeler`, `twin_span`, `veil_cantor`, `cadence_breaker`, `cadence_lender`, `purse_splitter`, `tithe_mason`, `hinge_mason`, `spark_chanter`, `cap_warder`.

**Wave 8 ids — do not re-propose:**  
`wall_stinger`, `file_brander`, `boot_stinger`, `face_shover`, `slip_squire`, `pivot_ward`, `triple_span`, `cadence_cracker`, `once_cantor`, `hood_lurker`, `share_warden`, `spare_pacer`, `wick_painter`, `boon_mason`, `dull_censor`, `pet_siller`, `leash_cutter`.

Same-day SPELL_PROPOSALS Wave 9 may open as a sibling cron. This Wave 9 family pass still consumes **#563** verbs plus leftover **#533** unique CORE. **Wave 10** consumes any 2026-09-26 tactical catalog. This run does not mint colliding `wave9:` spell ids.

SDE Wave 8 unique CORE (`spell-odd-stride`, `spell-cast-hold`, `spell-unit-oath`, `spell-step-rebate`, `spell-foe-reel`, `spell-echo-wipe`, `spell-field-bite`, `spell-wound-mark`, `spell-split-plate`, `spell-verse-first`, `spell-pit-skip`, `spell-empty-plate`, `spell-kennel-sill`, `spell-chase-mend`, `spell-cadence-stall`, `spell-crown-cut`, `spell-full-bar`, `spell-pack-tithe`, `spell-about-hinge`) stay **G≥8 extras** on older families this pass. Dedicated families for those verbs wait for Wave 10 if they still have no CORE owner. `spell-late-purse` / `spell-pet-share` stay G≥6 extras.

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

**Stationary-post / multi-body cap (extend Wave 8):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair **or** Triple Span chain **or** Dummy Post in the same pack, not two. Twin Span counts as **two**. Triple Span counts as **three**. Dummy Post counts as **one**. Do **not** also roll wolf/archer overlay onto a Twin Span, Spark, Triple Span, or Dummy Post body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-/three-cell system cap (unchanged):** at most **one** multi-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, a Twin Span pair, **or** a Triple Span chain, never two of those. Dummy Post is a **1-cell** post; it fills the stationary-post cap but is **not** a multi-cell system.

**Summon-cap prerequisite (unchanged):** live `ENEMY_SUMMON_CAP` is 2 (`gameConstants.ts` 300). Triple Span is illegal until remaining cap ≥ 3. Dummy Post is legal at remaining ≥ 1. Do not spawn `dummy_prelate` on a board that already has a Twin Span, a Spark overlay, or a wolf/archer overlay **and** remaining cap 0.

**Walk-spend prerequisite (extend Wave 8):** Gait Mend / Boot Sting / Must Pace / Ghost Step **fail closed** until battle walks write a first-class `walkMpSpentThisTurn` (and, for Ghost Step, the vacated cell) on the turn actor. Forced-move does **not** increment that field. Knight Slip is a teleport — it does **not** increment walk-spend and does **not** leave a Ghost Step occupancy. Do not invent a persist stat. Do not read pixels.

**Facing prerequisite (unchanged):** About Face / Oncoming / Facing Pin / Glance Cut still fail closed until battle walks write `currentView`. Shove Face writes facing from this push only. This pass adds **zero** facing cards.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Gait Mend stays `gait_cantor` first-win vs `gait_mender` observe — first child wins. Pair Hinge MULTI child `pair_usher` — first child wins vs `pair_porter` observe. Cadence Flush MULTI child `flush_precentor` — first child wins vs `cadence_flusher` observe. Dummy Post MULTI child `dummy_castellan` — first child wins vs `dummy_prelate` observe. Court Hinge stays `court_hinge_regent` kit-only / `pair_porter` CHAMPION witness. Even Stride MULTI child `even_gallery` — first child wins vs `even_warder` observe. Thin Ward MULTI child `hard_1` — first child wins vs `thin_warder` observe. Clean Blood MULTI child `legendary_1` — first child wins vs `clean_cantor` observe. Do **not** name families after extra doors (`gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `even_gallery`, `file_regent`). Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` / `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` / `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` / `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` / `pace_prelate` / `span_triune` / `wick_mason` / `slip_castellan` / `court_usher`.

---

## 2. Why Wave 9 exists (gaps Waves 1–8 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + three SDE Wave 4 unique CORE verbs. Wave 6 covered SPELL_PROPOSALS Wave 5. Wave 7 covered SPELL_PROPOSALS Wave 6. Wave 8 covered SPELL_PROPOSALS Wave 7 + three leftover SDE Wave 6 unique CORE verbs.

SPELL_PROPOSALS Wave 8 (#563) then stamped the holes Wave 7 / Wave 8 **held**. A G≥8 extra on `pale_cantor` is not a CORE sentence. Dedicated families own the verb.

SDE Wave 7 unique CORE still had no CORE owner after Wave 8 (Wave 8 held them as G≥7 stamps). Seventeen of those verbs fill holes Wave 8 tactical does not: even-Manhattan walk, Strike-until-walk, ground-only next spell, walk +1 MP tax, leftover freeze, pull toward **ally**, copy last paint, blink-seal, enter +MP, cluster 50/50, world-wall-adj bonus, detonate-on-cast mark, pause summon life, steal summon CD, occupy last cell left, incoming cap 30, untouched LoS. Pack Still and File Fold stay closed.

| Unused Wave 8 / SDE Wave 7 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-gait-mend` (heal 8 iff caster walked) | `pale_cantor` (unconditional Mend); `post_stinger` (unmoved **damage**); `boot_stinger` (walked **damage**) | Heal paid in **tiles already spent**. Standing is 0 HP. Extra door is `gait_cantor` — family is **`gait_mender`**. |
| `spell-pair-hinge` (rotate two hostiles 90° around **their** midpoint) | `hinge_squire` (caster around ally); `pivot_ward` (one body around **caster**); `pawn_broker` (swap two hostiles) | Caster stays. Dest is the other two cells of their 2×2. Extra door is `pair_usher` — family is **`pair_porter`**. |
| `spell-cadence-flush` (ally, **all** remaining CDs → 0, once/battle) | `cadence_cracker` (hostile **highest one**); `cadence_breaker` (self last-id); `cadence_lender` (ally −1) | Dump-the-bar gift. Extra door is `flush_precentor` — family is **`cadence_flusher`**. |
| `spell-lone-sting` (+8 iff 0 Chebyshev-1 same-side hostiles) | `split_fanger` (this pass, **cluster**); Crowd Tax / Split Fang extras | Isolation inverse of the cluster gun. |
| `spell-morrow-plate` (absorb 10 starts **next own turn**) | `plate_warden` (absorb **now**); `surplus_warder`; `morrow_walker` (blink) | Pay 2 AP for a plate you will not have this turn. |
| `spell-gait-seal` (cannot spend walk MP; casts legal) | `snare_weaver` (root); `gait_muter` (spell fizzles **if** walked); Must Pace (spell fizzles unless walked) | Nail their feet, then out-range. Swap / blink still legal. |
| `spell-diag-lock` (walks must be `\|dx\|===\|dy\|`) | `axis_locksmith` (rank XOR file); Bias Step (diagonal **cast**) | Cardinal walks fail. Distinct from Even Stride (Manhattan parity). |
| `spell-brick-shift` (move an existing `barrierTiles` 1) | `hinge_mason` (pad swap); Barrier **places** a new brick | Reuse the wall you already paid for. World walls are illegal sources. |
| `spell-mend-wick` (floor paint heals occupant after 1 turn) | `wick_painter` (delayed **pit**); `fuse_binder` (delayed **damage**); Mercy Font (summon pulse) | Delayed **heal**. Extra door stays `wick_mason` — family is **`wick_mender`**. |
| `spell-return-sting` (next applied hit → 0 on you, `floor(n/2)` to attacker) | `void_mirror` (25% of incoming as extra); Mirror (reflects the **spell**); `share_warden` (50/50 share) | Eat the swing you can return. DoT / lava do not consume. |
| `spell-leftover-lend` (dump **your** leftover AP to an ally) | `tempo_precentor` (next-turn +1 AP); `purse_scribe` (freeze **theirs**); `purse_splitter` (split **theirs**) | Keep a last Strike **or** fund their Inferno. Does not splice the turn. |
| `spell-dummy-post` (`summonAI: "dummypost"`, 1 HP, empty kit, Chebyshev-1 taunt) | `bait_prelate` (bait + eat); `goad_herald` (unit taunt, no body); `pylon_prelate` (wall, no taunt) | Cast-target filter. Extra door is `dummy_castellan` — family is **`dummy_prelate`**. |
| `spell-enter-mend` (first **enter** heals 6 once) | `gift_siller` (this pass, enter **+MP**); `boon_mason` (leave +MP); Glyph Tax (enter AP) | Public heal pad they might steal. Occupant at paint time does **not** trigger. |
| `spell-body-mark` (next hit on **that unit** ×1.5) | Tile Mark / Split Mark; File Brand (axis rider); Enrage (caster buff) | They can walk off a tile Mark. They cannot walk off a body. |
| `spell-split-mend` (12 split 6/6 with adjacent ally; else full 12) | `pale_cantor` (single Mend); `share_warden` (damage 50/50); Choir Hymn | Stand together to split, or accept a single 12. Healer CORE only. |
| `spell-even-stride` (next walk even Manhattan) | `axis_locksmith` G≥7 extra; `diag_locksmith` (diagonal **shape**); Misstep (cardinal) | Odd-length confirms fail. Dedicated CORE, not a locksmith extra. Encounter `even_gallery` is a MULTI child. |
| `spell-strike-hold` (cannot Strike until they walk) | `dull_censor` (Strike deals **0**); Oath Blade (other ids fizzle) | Strike is **illegal**, not zeroed. Other ids remain legal. |
| `spell-ground-oath` (next non-Strike spell must target empty/ground) | Aim Veil (unit cannot be primary); Axis Veil (axis cannot be primary) | Frost fizzles. Barrier / Open Pit remain legal. |
| `spell-walk-toll` (next walk costs +1 MP) | `ley_tollkeeper` (`spell.mpCost` on the **cast**); Exit Tithe (AP on leave) | Tax is the **walk pool**. Encounter `toll_nave` is a teach, not the family. |
| `spell-purse-lock` (leftover AP frozen this/next turn) | `purse_scribe` (Empty Purse **spends** leftover); `leftover_lender` (dump **yours**) | They may still spend AP that refreshes at turn start. Encounter `lock_nave` is a teach. |
| `spell-ally-reel` (pull 1 toward nearest **ally**) | `file_reeler` (along shared file toward **caster**); `hook_chaplain` (pull ally adjacent); `sink_chanter` (tile attract) | The hole is the **ally**, not the caster. Second `applyAttract` caller. |
| `spell-echo-paint` (copy last cinder/rime/mire/void onto a neighbor) | `fuse_binder` / `ember_knight` G≥7 extras; Cinder **places**; Wick Bite **bonuses** standing | Must copy an existing type. Encounter `paint_gallery` is a teach. |
| `spell-blink-seal` (cannot Swap / Phase Slip / pad / Pawn Trade) | Claim Ward (cell); Grounded Lock (root **walk**); Self Anchor (ignore push) | Walks remain legal. 2 turns. |
| `spell-gift-sill` (first walk-enter grants 1 leftover MP) | `enter_mender` (enter **HP**); `pet_siller` (summons cannot enter); `boon_mason` (leave +MP) | Public MP pad. Teleport does not grant. |
| `spell-split-fang` (16 + 16 if a second hostile Chebyshev ≤ 1) | `lone_stinger` (isolation inverse); Chain Lightning (bounce, full payload) | Cluster gate. Not a bounce. |
| `spell-wall-bite` (10 + 10 if target Chebyshev-1 from a **blocking** tile) | `wall_stinger` (target hugs a **spell barrier**); Wick Bite (paint); Corner Lens (blocked LoS) | World walls / unwalkable count. Barrier / pit / paint do **not** unless they already `blocksWalk`. |
| `spell-cast-mark` (detonates 12 if they **cast** a non-Strike spell) | `body_marker` (next **hit** ×1.5); Split Mark (detonate on **hit**); Debt Mark (AP tax) | Strike / walk / End Turn do not detonate. |
| `spell-still-leash` (pause hostile summon lifespan 2 of **its** turns) | `leash_cutter` (remaining → min(remaining, 1)); Sever Tether (**kills**) | Body stays. Not a cut and not a kill. |
| `spell-pet-verse` (steal 1 CD from a hostile **summon kit**) | `cadence_thief` (steal from a **caster**); `cadence_flusher` (ally all CDs → 0) | Summon-only. Stolen id is **not** granted. |
| `spell-ghost-step` (next walk leaves a 1-turn occupancy ghost on the cell left) | `slip_squire` / `mist_walker` / `blink_cutter` (the teleport); Twin Span (two posts) | Ghost is not a combatant. Teleport does not leave it. Encounter `ghost_court` is a teach. |
| `spell-thin-ward` (next incoming spell/Strike capped at 30 after RES/SR) | `morrow_warden` (delayed absorb); `cap_warder` (outgoing 12); `plate_warden` G≥7 extra | One hit. DoTs after the first tick are not “the next hit.” MULTI with `hard_1`. |
| `spell-clean-blood` (next spell ignores LoS if untouched last opposing turn) | `glass_sniper` G≥7 extra; Wounded Lens (ignore LoS **after being hit**); Corner Lens | Opposite of wounded. Poke for 1 before the snipe. MULTI with `legendary_1`. |

**Do not family (closed / boss / ENEMY_ONLY):** `spell-court-hinge` (`NOT_PLAYER_LEARNABLE`; `court_hinge_regent` kit / `pair_porter` CHAMPION witness — same law as Court Shove on `face_shover`), `spell-pack-still` (ENEMY_ONLY; stays `tempo_precentor` CHAMPION G≥7 SIGNATURE), `spell-file-fold` (BOSS_ONLY; `file_regent` kit — never a world pack). Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold / Oath Blade / About Face / Must Pace / Court Shove stay where Waves 5–8 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 9 CORE rows are `mpCost: 0`. Walk Toll is a **next-walk MP tax**.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a sixth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor. Morrow Plate’s delay is **their next turn start**.  
Do **not** family a four-cell occupy.  
Do **not** family heal-if-**target**-moved (Wave 8 leftover hole).  
Do **not** family 180° pair hinge (`spell-about-hinge` is SDE Wave 8 never-owned).  
Do **not** family refresh (extend) all of a hostile’s remaining CDs.  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint SDE Wave 8 unique CORE as this pass’s CORE (`spell-odd-stride` …).  
Do **not** mint `wave9:` colliding spell ids.  
Do **not** name the Gait Mend family `gait_cantor`, the Pair Hinge family `pair_usher`, the Cadence Flush family `flush_precentor`, the Dummy Post family `dummy_castellan`, or the Mend Wick family `wick_mason`.

---

## 3. Encounter synergy packs (Waves 1–9)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one multi-cell system. Cap one Dummy Post **or** bait **or** pylon **or** font **or** span.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Gait Choir | `gait_mender` + `spare_pacer` + `boot_stinger` | Buy the step, sting, then cash the walked heal |
| Pair Peel | `pair_porter` + `lone_stinger` + `gait_sealer` | Rotate off the clump, nail feet, sting the isolated body |
| Flush Lend | `cadence_flusher` + `leftover_lender` + `ignite_alchemist` | Dump leftover AP, flush Inferno, cash stacks |
| Morrow Dummy | `morrow_warden` + `dummy_prelate` + `return_stinger` | Arm plate, plant the 1 HP, return the swing that must hit the aura |
| Seal File | `gait_sealer` + `glass_sniper` + `far_stinger` | Nail feet, then out-range |
| Diag Brick | `diag_locksmith` + `brick_shifter` + `fan_prelate` | Diagonal jail, then slide the brick onto a spoke |
| Wick Mend | `wick_mender` + `gait_sealer` + `pair_porter` | Paint the heal, seal them on it, or rotate an ally onto it |
| Body Cast | `body_marker` + `cast_marker` + `coup_duelist` | Amp the unit, punish the cast, Coup the window |
| Split Pad | `split_cantor` + `enter_mender` + `dummy_prelate` | Split 6/6, or steal the public pad (Dummy is usually the wrong adjacent) |
| Even Toll | `even_warder` + `walk_toller` + `gait_muter` | Even Manhattan, then tax the remaining even step |
| Hold Range | `hold_knight` + `gait_sealer` + `far_stinger` | Strike illegal until they walk; feet nailed so they cannot pay |
| Ground Brick | `ground_oather` + `brick_shifter` + `echo_painter` | Next spell must be ground; slide / copy the paint they are forced to use |
| Purse Bell | `purse_locker` + `act_teller` + `cadence_flusher` | Freeze leftover, tax the act, dump the bar on an ally |
| Ally Wick | `ally_reeler` + `echo_painter` + `fuse_binder` | Pull toward the ally, onto copied paint / fuse |
| Blink Rank | `blink_sealer` + `axis_locksmith` + `rank_lancer` | Cannot blink the axis lock |
| Gift Boot | `gift_siller` + `walk_toller` + `boot_stinger` | Tax the walk, refund on the sill, sting the paid step |
| Cluster Dummy | `split_fanger` + `ally_reeler` + `dummy_prelate` | Pull onto the post, then 16+16 the clump |
| Wall Corridor | `wall_biter` + `rank_lancer` + `axis_locksmith` | Force the wall hug, cash the blocking-tile bonus |
| Cast Quiet | `cast_marker` + `once_cantor` + `ground_oather` | Mark the cast, lock recast, force a ground id |
| Still Sill | `still_leasher` + `pet_siller` + `verse_thief` | Pause the pet, forbid its next cell, steal its CD |
| Ghost Rear | `ghost_stepper` + `shadow_lurker` + `gait_sealer` | Leave a ghost, nail the chase, Rear Cut stays a RARE extra |
| Thin Goad | `thin_warder` + `goad_herald` + `dummy_prelate` | Cap 30, force the swing into the post |
| Clean Fog | `clean_cantor` + `smoke_thurifer` + `dim_optic` | Untouched LoS ignore through smoke, then range-shrink |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute), Wave 7 packs (Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark), and Wave 8 packs (Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood).

Do **not** pack as PAIR (COURT later is fine):

- `gait_mender` + `pale_cantor` / `post_stinger` as PAIR (walked heal vs unconditional Mend vs unmoved **damage**)
- `pair_porter` + `hinge_squire` / `pivot_ward` / `pawn_broker` / `hook_chaplain`
- `cadence_flusher` + `cadence_cracker` / `cadence_breaker` / `cadence_thief` / `cadence_lender` / `verse_thief`
- `lone_stinger` + `split_fanger` as PAIR (isolation vs cluster — COURT is Peel Court, never a two-body)
- `morrow_warden` + `plate_warden` / `surplus_warder` / `morrow_walker` / `thin_warder`
- `gait_sealer` + `snare_weaver` / `gait_muter`
- `diag_locksmith` + `axis_locksmith` / `even_warder` / `misstep_herald`
- `brick_shifter` + `hinge_mason`
- `wick_mender` + `wick_painter` / `fuse_binder` / `hinge_mason` as PAIR (delayed heal vs delayed pit vs delayed damage vs enter-swap)
- `return_stinger` + `void_mirror` / `pain_suture` / `share_warden` / `cover_squire`
- `leftover_lender` + `purse_scribe` / `purse_splitter` / `tempo_precentor` / `purse_locker`
- `dummy_prelate` + `bait_prelate` / `goad_herald` / `pylon_prelate` / `span_prelate` / `twin_span` / `triple_span` / `font_cantor` / `stone_castellan` / `spark_chanter`
- `enter_mender` + `gift_siller` / `boon_mason` / `glyph_sower` / `pet_siller`
- `body_marker` + `cast_marker` / `glyph_sower` as PAIR (unit amp vs detonate-on-cast vs tile Mark)
- `split_cantor` + `pale_cantor` / `share_warden`
- `even_warder` + `diag_locksmith` / `axis_locksmith` / `misstep_herald`
- `hold_knight` + `dull_censor` / `oath_censor`
- `ground_oather` + `pit_mason` / `origin_mason` as PAIR (SDE extras live there)
- `walk_toller` + `ley_tollkeeper` / `tide_shade` as PAIR (walk tax vs cast MP vs melee slow)
- `purse_locker` + `tax_scribe` / `ledger_siphon` / `bone_scribe` as PAIR (SDE extras live there)
- `ally_reeler` + `file_reeler` / `hook_chaplain` / `sink_chanter` / `pale_cantor` / `cover_squire`
- `echo_painter` + `ember_knight` / `fuse_binder` / `glyph_sower` as PAIR
- `blink_sealer` + `mist_walker` / `void_anchoret` / `slip_squire`
- `split_fanger` + `glance_ward` / `iron_golem` / `storm_caller` as PAIR
- `wall_biter` + `wall_stinger` / `stone_castellan` / `pit_mason` as PAIR (blocking-tile vs barrier-hug vs extras)
- `still_leasher` + `leash_cutter` / `null_censor`
- `verse_thief` + `cadence_thief` / `cadence_flusher`
- `ghost_stepper` + `blink_cutter` / `rift_hook` / `mist_walker` / `slip_squire` / `morrow_walker`
- `thin_warder` + `plate_warden` / `cap_warder` / `morrow_warden`
- `clean_cantor` + `glass_sniper` / `corner_bishop`

Do not spawn Morrow Dummy / Cluster Dummy in a 1-tile closet (needs Chebyshev-1 around the post). Do not spawn Diag Brick on a map with no diagonal spoke. Ghost paints and Dummy posts are battle-time — `finalizePlayableLayout` still owns generated maps.

---

## 4. Family sheets — Wave 9

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-09-25.md`](https://github.com/Mr-Melic/stralt/pull/563) (PR #563) unless marked SDE Wave 7 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-5522/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md), PR #533).

---

### ENEMY_ID: `gait_mender`

- **NAME:** Gait Mender
- **ROLE:** healer (heal iff caster already walked)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **with** heal. Distinct from `pale_cantor` (unconditional 12), `post_stinger` (unmoved damage), `boot_stinger` (walked damage). Extra door is `gait_cantor` — do not reuse that id. At most one walked-heal CORE per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Mend-shaped Frost if `walkMpSpentThisTurn < 1`. Peer: Gait Mend only after a legal walk of ≥ 1. Above: refuse the id if missing HP < 8 (would spend 2 AP for 0).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.05, chc 0.70. Identity is the **walk-then-8**, not a bigger Mend. If it tops the meter without walking, the kit leaked toward Rally.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_already_walked"`. VETERAN: skip if walk-spend < 1 **or** missing HP < 8. ELITE: never walk **only** to enable this if a Strike from an ally would kill. CHAMPION: Spare Pace / Exit Boon partner — do not count shove as walk.
- **CORE_SPELL_POOL:** `spell-gait-mend`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `starter-heal` only if already walked this turn would overheal (skip), `spell-slow`
- **RARE_SPELL_POOL:** `spell-spare-pace` only if `spare_pacer` is **absent**
- **ELITE_SPELL_POOL:** none — walk honesty is the elite. Do **not** unlock Rallying Cry as identity.
- **SIGNATURE_MECHANICS:** Heal 8 iff `walkMpSpentThisTurn ≥ 1`. Forced-move does not pay. 0-heal still spends AP (observation). `challengeHealUsedRef` only if player-side HP increased.
- **VARIANT_PROGRESSION:** BASE frost-or-mend → VETERAN skip-if-unmoved → ELITE never-walk-only-to-heal → CHAMPION partner-funded-step
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE on Gait Choir.
- **SYNERGIES:** `spare_pacer`, `boot_stinger`, `boon_mason`, `gift_siller`
- **WEAKNESSES:** Root / Gait Seal so they cannot pay; Cursed Wound halves the 8; poke them off the planned 2-step
- **PLAYER_COUNTERPLAY:** Nail their feet; don’t let Spare Pace land; kill before the second AP
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gait-mend` (ENEMY_DISCOVERY). `gait_cantor` first-win MULTI — first child wins. Do not restamp a feat.
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** LOW (boolean on existing heal; needs `walkMpSpentThisTurn`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pair_porter`

- **NAME:** Pair Porter
- **ROLE:** displacement specialist (90° pair hinge)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from `hinge_squire`, `pivot_ward`, `pawn_broker`. Extra door is `pair_usher`. At most one pair-rotate CORE per pack as PAIR.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if pack size < 2 player-side bodies. Peer: Pair Hinge only if two hostiles are Chebyshev-1 and both dests are free. Above: refuse if either dest is blocked (would spend 3 AP for 0).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is the **2×2 scramble**, not a damage spell. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "hinge_two_hostiles_if_adj"`. VETERAN: skip if < 2 adj hostiles. ELITE: dest onto fuse / pit wick / enter-mend if an ally owns the paint. CHAMPION: Court Hinge witness only — never grant Court Hinge.
- **CORE_SPELL_POOL:** `spell-pair-hinge`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark` on a **dest** cell, `spell-slow`
- **RARE_SPELL_POOL:** `spell-fuse-tile` only if `fuse_binder` is **absent**
- **ELITE_SPELL_POOL:** `spell-court-hinge` CHAMPION witness (`NOT_PLAYER_LEARNABLE`) — kit-only, never owned
- **SIGNATURE_MECHANICS:** Not `isSwap`. Clockwise 90° around the pair’s midpoint. Both dests `isCellFree` after vacating. Landing hazards **must tick**.
- **VARIANT_PROGRESSION:** BASE frost-or-hinge → VETERAN skip-if-isolated → ELITE dest-onto-paint → CHAMPION court-witness
- **RARITY_CURVE:** Standard. +ELITE on Pair Peel / Wick Mend.
- **SYNERGIES:** `lone_stinger`, `gait_sealer`, `wick_mender`, `fuse_binder`, `enter_mender`
- **WEAKNESSES:** Isolate (one body); Self Anchor; occupy dests
- **PLAYER_COUNTERPLAY:** Stay Chebyshev ≥ 2 from every ally; don’t stand on their wick
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pair-hinge` (ENEMY_DISCOVERY). `pair_usher` MULTI. Court Hinge never written to owned ids.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy pair rotate; do not call `swapPositions`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_flusher`

- **NAME:** Cadence Flusher
- **ROLE:** buffer (ally all remaining CDs → 0, once/battle)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `cadence_cracker` / `cadence_breaker` / `cadence_lender` / `cadence_thief`. Extra door is `flush_precentor`. At most one CD-flush CORE per pack as PAIR vs Crack/Break/Lend/Theft.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no ally has remaining CD ≥ 2. Peer: Flush only that ally. Above: refuse if the ally’s leftover AP cannot pay the dumped bar (Leftover Lend partner, else skip).
- **STAT_SCALING_RULE:** hp 0.75, sp 0.85, sr 0.90, res 0.75, init 1.20, chc 0.80. Identity is the **once/battle dump**, not a nuke. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "flush_ally_if_big_cd"`. VETERAN: skip if no ally CD ≥ 2. ELITE: prefer Inferno / Fan Bolt holders. CHAMPION: never flush the caster (illegal); never flush twice.
- **CORE_SPELL_POOL:** `spell-cadence-flush`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-tempo-gift` only if `tempo_precentor` is **absent**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-leftover-lend` only if `leftover_lender` is **absent**
- **ELITE_SPELL_POOL:** none — once/battle honesty is the elite. Do **not** unlock Cadence Crack as identity.
- **SIGNATURE_MECHANICS:** Ally cooldown map → 0. Once/battle on the **caster** (`oncePerBattleIds`, not a 99-turn bar lock). Target with no remaining CD fizzles (AP spent). Does not write `spellLevelKeys`.
- **VARIANT_PROGRESSION:** BASE frost-or-flush → VETERAN skip-if-no-CD → ELITE inferno-holder → CHAMPION never-self
- **RARITY_CURVE:** Standard. +ELITE on Flush Lend.
- **SYNERGIES:** `leftover_lender`, `ignite_alchemist`, `fan_prelate`, `once_cantor` (COURT: restore then ban recast)
- **WEAKNESSES:** Quiet Hex the flushed ally; kill them before they dump; isolate so 4 AP was wasted
- **PLAYER_COUNTERPLAY:** Mute Thread the receiver; don’t let Inferno come off CD twice
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-flush` (ENEMY_DISCOVERY). `flush_precentor` MULTI.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (cooldown map zero + once/battle flag)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `lone_stinger`

- **NAME:** Lone Stinger
- **ROLE:** sniper (isolated-target poke)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `queen` **without** heal. Distinct from `split_fanger` (cluster), `wall_stinger` (barrier-hug), `boot_stinger` (caster walked), `far_stinger` (distance), `glass_sniper` (min-range). At most one isolation-gun as PAIR vs Split Fang.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the target has a Chebyshev-1 same-side neighbor. Peer: Lone Sting only if isolated. Above: refuse the +8 lie on a clump (would be a 10 pretending to be 18).
- **STAT_SCALING_RULE:** hp 0.70, sp 1.15, sr 0.85, res 0.75, init 1.15, chc 1.10. Identity is the **peel-then-18**. If it tops the meter into a clump, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "poke_if_target_isolated"`. VETERAN: skip if clustered **and** Frost is in kit. ELITE: wait for Pair Hinge / Pawn Trade peel. CHAMPION: adjacent **hostiles** do not break isolation; the caster Chebyshev-1 does not count as a same-side neighbor of an enemy target.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-lone-sting`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the isolated body (`spell-body-mark` only if `body_marker` is absent), `spell-slow`
- **RARE_SPELL_POOL:** `spell-smoke-veil` only if `smoke_thurifer` is **absent**
- **ELITE_SPELL_POOL:** none — isolation honesty is the elite. Do **not** unlock Split Fang as identity.
- **SIGNATURE_MECHANICS:** 10, +8 iff 0 living same-side combatants at Chebyshev ≤ 1. Missing key fail closed (10 only). Player-side includes player summons.
- **VARIANT_PROGRESSION:** BASE frost-or-sting → VETERAN skip-if-clumped → ELITE wait-for-peel → CHAMPION side-honesty
- **RARITY_CURVE:** Standard. +ELITE on Pair Peel.
- **SYNERGIES:** `pair_porter`, `gait_sealer`, `pawn_broker`, `smoke_thurifer`
- **WEAKNESSES:** Stand Chebyshev-1 from any ally; spawn a dummy adjacent; Self Anchor and hug a post
- **PLAYER_COUNTERPLAY:** Hug a whelp; don’t let them peel you first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-lone-sting` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `morrow_warden`

- **NAME:** Morrow Warden
- **ROLE:** tank (delayed absorb)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` **without** heal. Distinct from `plate_warden` (absorb now), `surplus_warder`, `thin_warder` (incoming cap), `morrow_walker` (blink). At most one delayed-plate CORE per pack as PAIR vs Plate / Thin.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if already the last living body in melee. Peer: Morrow Plate when not threatened **this** turn. Above: refuse if they will die on the arming turn (would pay 2 AP for a plate they never see).
- **STAT_SCALING_RULE:** hp 1.40, sp 0.80, sr 1.10, res 1.20, init 0.75, chc 0.70. Identity is the **not-this-turn plate**. If it tops the meter, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "arm_plate_if_not_threatened_this_turn"`. VETERAN: skip if last body in melee. ELITE: Dummy / Goad partner so the hit lands on the plated turn. CHAMPION: delay is **their** next turn start, not a global round count; death before delay expires the arm.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-morrow-plate`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-goad` only if `goad_herald` is **absent**
- **ELITE_SPELL_POOL:** none — delay honesty is the elite. Do **not** unlock Ward Plate as identity.
- **SIGNATURE_MECHANICS:** Arm now. Absorb 10 at next own turn start until consumed or that turn ends. Absorb is not a heal (`no_healing` stays true). Do not read `CharacterStats.evasion`.
- **VARIANT_PROGRESSION:** BASE strike-or-arm → VETERAN skip-if-last-melee → ELITE goad-into-plate → CHAMPION turn-start-honesty
- **RARITY_CURVE:** Standard. +ELITE on Morrow Dummy.
- **SYNERGIES:** `dummy_prelate`, `return_stinger`, `goad_herald`, `hood_lurker`
- **WEAKNESSES:** Hit them **this** turn; Quiet Hex the arm; two small hits after it comes up
- **PLAYER_COUNTERPLAY:** Burst the arming turn; don’t wait for the plate
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-morrow-plate` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (delayed apply at turn start; do not splice RAF)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gait_sealer`

- **NAME:** Gait Sealer
- **ROLE:** controller (cannot walk; can still cast)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn` or `bishop` **without** heal. Distinct from `snare_weaver` (root), `gait_muter` (spell fizzles if walked), Must Pace (closed). At most one walk-forbid CORE per pack as PAIR vs Root / Stride Mute.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Slow if already adjacent **and** they have a melee id. Peer: Gait Seal if they need to close. Above: refuse if they are already adjacent with a melee id (would spend 3 AP to nail feet they do not need).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.90, sr 0.95, res 0.90, init 1.10, chc 0.80. Identity is the **feet-nail**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "seal_walk_if_target_needs_close"`. VETERAN: skip if already adjacent with melee. ELITE: Far Sting / Glass Shot partner. CHAMPION: forced-move still legal — this is a **walk-MP** gate, not occupancy.
- **CORE_SPELL_POOL:** `spell-gait-seal`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-far-sting` only if `far_stinger` is **absent**
- **RARE_SPELL_POOL:** `spell-open-pit` only if `pit_mason` is **absent**
- **ELITE_SPELL_POOL:** none — walk-MP honesty is the elite. Do **not** unlock Root Snare as identity.
- **SIGNATURE_MECHANICS:** Cannot spend walk MP until their next turn start. Spell casts remain legal. Swap / Phase Slip / Knight Slip / Attack Nearest are **not** walk MP.
- **VARIANT_PROGRESSION:** BASE frost-or-seal → VETERAN skip-if-melee-adj → ELITE out-range partner → CHAMPION forced-move-legal
- **RARITY_CURVE:** Standard. +ELITE on Seal File / Pair Peel / Wick Mend / Hold Range.
- **SYNERGIES:** `glass_sniper`, `far_stinger`, `wick_mender`, `hold_knight`, `dummy_prelate`
- **WEAKNESSES:** Cast from where they stand; blink / swap off; wait
- **PLAYER_COUNTERPLAY:** Don’t need to walk; Barrier the only melee tile they wanted
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gait-seal` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk confirm reads the flag; do not rewrite A*)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `diag_locksmith`

- **NAME:** Diag Locksmith
- **ROLE:** controller (diagonal-only walks)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `axis_locksmith` (rank XOR file), `even_warder` (even Manhattan), Bias Step (diagonal **cast**). ELITE acquisition on the spell — family may still spawn BASE with Frost. At most one walk-shape lock as PAIR vs Axis / Even / Misstep.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they are already walled into diagonal-only. Peer: Diag Lock if they are a file-walker. Above: refuse if already only able to step diagonal.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.95, sr 0.90, res 0.85, init 1.10, chc 0.85. Identity is the **diagonal jail**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "diag_lock_if_file_walker"`. VETERAN: skip if already diagonal-walled. ELITE: Brick Shift partner onto the spokes. CHAMPION: preview, live gate, and execute of **walks** (not casts) share the filter.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-diag-lock`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-barrier` only if a mason is **absent** and `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-brick-shift` only if `brick_shifter` is **absent**
- **ELITE_SPELL_POOL:** none — shape honesty is the elite. Do **not** unlock Rank Lock as identity.
- **SIGNATURE_MECHANICS:** 2 of their turns: walk dest legal only if `|dx|===|dy|` and `dx≠0` from current cell. Forced-move legal. Knight Slip / Vault are teleports, not walks.
- **VARIANT_PROGRESSION:** BASE frost-or-lock → VETERAN skip-if-already-diag → ELITE brick-the-spokes → CHAMPION walk-filter-honesty
- **RARITY_CURVE:** Standard. +ELITE on Diag Brick.
- **SYNERGIES:** `brick_shifter`, `fan_prelate`, `wall_stinger`
- **WEAKNESSES:** Walk the diagonals; blink / swap; wait 2 turns
- **PLAYER_COUNTERPLAY:** Keep a diagonal spoke open; don’t file-walk into this kit
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-diag-lock` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk dest filter, same family as Rank Lock)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brick_shifter`

- **NAME:** Brick Shifter
- **ROLE:** hazard creator (move an existing barrier 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` **without** heal. Distinct from Barrier (places new), `hinge_mason` (pad swap), `pit_mason` (Open Pit). At most one brick-slide CORE per pack as PAIR vs Hinge Tile.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no `barrierTiles` in range. Peer: Brick Shift only if a Chebyshev-1 dest is free. Above: refuse if 0 or >1 legal source for the dest (would be a silent overwrite).
- **STAT_SCALING_RULE:** hp 0.95, sp 0.85, sr 1.00, res 1.05, init 0.90, chc 0.75. Identity is **reuse the wall**. If it tops the meter, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "shift_barrier_if_opens_or_blocks"`. VETERAN: skip if no barrier in range. ELITE: open a Wall Sting hug or block a diagonal spoke. CHAMPION: world walls are **not** sources; last-writer on dest (pit/pad/slide) **blocks** the move.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-brick-shift`
- **ADVANCED_SPELL_POOL:** `spell-barrier` only if `usableByEnemy` is flipped for **that one id**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-wall-sting` only if `wall_stinger` is **absent**
- **ELITE_SPELL_POOL:** none — reuse honesty is the elite. Do **not** unlock Hinge Tile as identity.
- **SIGNATURE_MECHANICS:** Click a spell-placed barrier; dest Chebyshev 1, `isCellFree`. Duration remaining unchanged. Two-click UX **or** dest-clicked unique-source fallback (fizzle if 0 or >1).
- **VARIANT_PROGRESSION:** BASE strike-or-shift → VETERAN skip-if-no-brick → ELITE hug-or-spoke → CHAMPION no-world-wall
- **RARITY_CURVE:** Standard. +ELITE on Diag Brick / Ground Brick / Wall Corridor.
- **SYNERGIES:** `wall_stinger`, `diag_locksmith`, `ground_oather`, `pylon_prelate`
- **WEAKNESSES:** Do not leave a brick; occupy every Chebyshev-1 dest
- **PLAYER_COUNTERPLAY:** Dispel / wait the barrier; stand where it wants to slide
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-brick-shift` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy + barrier map move)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `wick_mender`

- **NAME:** Wick Mender
- **ROLE:** healer / hazard creator (delayed tile heal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **with** heal. Distinct from `wick_painter` (delayed **pit**), `fuse_binder` (delayed **damage**), `font_cantor` (summon pulse), `enter_mender` (heal **on enter**). Extra door stays `wick_mason`. At most one delayed-heal CORE per pack as PAIR vs Pit Wick / Fuse.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no allied body can stand on the dest in 1 turn. Peer: Mend Wick only if an ally can occupy at convert. Above: refuse if convert would heal the **player** (would gift 8).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.95, res 0.80, init 1.05, chc 0.70. Identity is the **stand-on-your-wick** puzzle. If it tops the meter on cast turn, the kit leaked — convert deals **0 on paint**.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "paint_heal_tile_if_ally_can_stand"`. VETERAN: skip if no ally can reach in 1. ELITE: Gait Seal / Pair Hinge partner. CHAMPION: last-writer vs Pit Wick / Fuse / Cinder — last paint wins; do not stack convert kinds. Observation is **paint**, not convert.
- **CORE_SPELL_POOL:** `spell-mend-wick`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `starter-heal` (self, not the tile), `spell-slow`
- **RARE_SPELL_POOL:** `spell-gait-seal` only if `gait_sealer` is **absent**
- **ELITE_SPELL_POOL:** none — delay honesty is the elite. Do **not** unlock Fuse as identity.
- **SIGNATURE_MECHANICS:** Paint. After 1 turn, occupant heals 8 (honor `healRecv`) then expire. Empty at convert: expire, no heal. Convert is a turn-start tile tick, not a mid-RAF splice. Enemy heal does not set `healUsed`.
- **VARIANT_PROGRESSION:** BASE frost-or-paint → VETERAN skip-if-unreachable → ELITE seal/hinge partner → CHAMPION last-writer
- **RARITY_CURVE:** Standard. +ELITE on Wick Mend.
- **SYNERGIES:** `gait_sealer`, `pair_porter`, `split_cantor`
- **WEAKNESSES:** Step off; occupy with a dummy you do not care about; Cursed Wound
- **PLAYER_COUNTERPLAY:** Steal the 8; kill the Mender before convert
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-mend-wick` (ENEMY_DISCOVERY). Do not restamp `wick_mason`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (same delayed-tile family as Fuse / Pit Wick)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `return_stinger`

- **NAME:** Return Stinger
- **ROLE:** protector (next hit deals 0 to you, half to the attacker)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` **without** heal. Distinct from `void_mirror` (25% extra), Mirror (spell reflect), `share_warden` (50/50 share), `cover_squire` (redirect whole hit), `sidestep_warder` (miss). At most one return-poke CORE per pack as PAIR vs Mirror / Share / Cover.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if already plated / sidestepped. Peer: Return Sting if expecting a hit this cycle. Above: refuse if already plated (would stack two consumes).
- **STAT_SCALING_RULE:** hp 1.05, sp 0.95, sr 1.00, res 1.05, init 1.10, chc 0.90. Identity is **eat the swing you can return**. If it tops the meter without being hit, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "arm_return_if_expect_hit"`. VETERAN: skip if already plated / sidestepped. ELITE: Goad / Dummy partner so the swing they must throw is the one you return. CHAMPION: consume **before** HP write; DoT / lava / spikes do **not** consume; 0 applied is not `recordChallengeDamageTaken`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-return-sting`
- **ADVANCED_SPELL_POOL:** `spell-shadow-veil`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-goad` only if `goad_herald` is **absent**
- **ELITE_SPELL_POOL:** none — consume honesty is the elite. Do **not** unlock Mirror as identity.
- **SIGNATURE_MECHANICS:** Next applied damaging **spell/weapon** hit → 0 to caster, `floor(applied * 0.5)` to attacker via existing `dealDamage` (`isPhysical: false`). Charge consumes even if attacker already dead (poke fizzles).
- **VARIANT_PROGRESSION:** BASE strike-or-arm → VETERAN skip-if-plated → ELITE goad-the-swing → CHAMPION hit-pipeline-honesty
- **RARITY_CURVE:** Standard. +ELITE on Morrow Dummy.
- **SYNERGIES:** `dummy_prelate`, `goad_herald`, `morrow_warden`
- **WEAKNESSES:** Do not hit them; DoT them; wait the CD
- **PLAYER_COUNTERPLAY:** Poison / Inferno; Attack the Dummy instead; Slow and walk away
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-return-sting` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (incoming-hit consume, same family as Sidestep)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `leftover_lender`

- **NAME:** Leftover Lender
- **ROLE:** buffer (dump leftover AP onto an ally)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `queen` **without** heal. Distinct from `tempo_precentor` (grant without dumping yours), `purse_scribe` (freeze **theirs**), `purse_splitter` (split **theirs**), `purse_locker` (freeze leftover). At most one leftover-dump CORE per pack as PAIR vs Purse / Tempo.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover after the 1-cost is 0. Peer: Lend only if the ally can spend. Above: refuse if the ally is at max AP.
- **STAT_SCALING_RULE:** hp 0.75, sp 0.85, sr 0.90, res 0.75, init 1.20, chc 0.80. Identity is **keep a last Strike or fund their Inferno**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "lend_leftover_if_ally_can_spend"`. VETERAN: skip if leftover after 1-cost is 0 **or** ally at max AP. ELITE: Cadence Flush partner. CHAMPION: `n=0` still spends 1 AP (observation); do **not** splice the turn; caster may still walk.
- **CORE_SPELL_POOL:** `spell-leftover-lend`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-tempo-gift` only if `tempo_precentor` is **absent**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-cadence-flush` only if `cadence_flusher` is **absent**
- **ELITE_SPELL_POOL:** none — dump honesty is the elite. Do **not** unlock Purse Cut as identity.
- **SIGNATURE_MECHANICS:** After paying 1 AP, `n = min(remaining AP, 4)` to ally current AP (cap at their max). Caster current AP → 0. Does not end the turn.
- **VARIANT_PROGRESSION:** BASE frost-or-lend → VETERAN skip-if-empty → ELITE flush-partner → CHAMPION no-splice
- **RARITY_CURVE:** Standard. +ELITE on Flush Lend.
- **SYNERGIES:** `cadence_flusher`, `ignite_alchemist`, `gait_mender`
- **WEAKNESSES:** Mute Thread the funded ally; kill them; isolate
- **PLAYER_COUNTERPLAY:** Kill the receiver first; don’t let Inferno get 4 extra AP
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-leftover-lend` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `dummy_prelate`

- **NAME:** Dummy Prelate
- **ROLE:** summoner / protector (1-HP taunt post)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` **without** heal. Distinct from `bait_prelate`, `goad_herald`, `pylon_prelate`, `span_prelate`. Extra door is `dummy_castellan`. Fills the stationary-post cap (one dummy **or** bait **or** pylon **or** font **or** span). Counts as **one** toward `ENEMY_SUMMON_CAP`. ELITE acquisition on the spell — family may still spawn BASE with Strike.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if a Dummy Post already lives. Peer: plant if a melee pack is in Chebyshev-1 of a free cell. Above: refuse if remaining summon cap < 1 **or** a Twin/Triple/Spark overlay already occupies the cap.
- **STAT_SCALING_RULE:** hp 1.10, sp 0.70, sr 1.05, res 1.10, init 0.80, chc 0.70. Identity is the **1-HP legal-target rewrite**. If the post deals damage, the kit leaked — empty kit, `damageScale: 0`.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "plant_dummy_if_melee_pack"`. VETERAN: skip if a Dummy already lives. ELITE: Return Sting / Morrow Plate on the caster while the pack hits the post. CHAMPION: `summonAI: "dummypost"` enum — never parse `"Dummy"`. Attack Nearest origin stays the **player** tile.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-dummy-post`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-return-sting` only if `return_stinger` is **absent**
- **ELITE_SPELL_POOL:** none — empty-kit honesty is the elite. Do **not** unlock Bait Eat as identity.
- **SIGNATURE_MECHANICS:** Stationary 0 AP / 0 MP, 1 HP, lifespan 3, empty kit. While alive, hostiles Chebyshev ≤ 1 who cast a damaging id must choose the post as primary **if** it is inside that spell’s range/LoS; otherwise they may cast as normal. Non-damaging ids (Slow / Swap) ignore the aura.
- **VARIANT_PROGRESSION:** BASE strike-or-plant → VETERAN one-post → ELITE return/plate partner → CHAMPION enum-honesty
- **RARITY_CURVE:** Standard. +ELITE on Morrow Dummy / Cluster Dummy / Thin Goad / Split Pad.
- **SYNERGIES:** `return_stinger`, `morrow_warden`, `split_fanger`, `ally_reeler`, `goad_herald`
- **WEAKNESSES:** Kill the 1 HP; step Chebyshev ≥ 2; cast Slow / Swap
- **PLAYER_COUNTERPLAY:** Poke the post; don’t throw Inferno into the aura
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-dummy-post` (ELITE observe). `dummy_castellan` MULTI. Summon is observation; later taunt / death is not a second observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED–HIGH (summon spawn + target filter; extract helpers; do not grow WX)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `enter_mender`

- **NAME:** Enter Mender
- **ROLE:** healer / hazard creator (first enter heals 6 once)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `bishop` **with** heal. Distinct from `gift_siller` (enter **+MP**), `boon_mason` (leave +MP), `glyph_sower` (enter AP), `wick_mender` (delay, no enter trigger). At most one enter-heal CORE per pack as PAIR vs Gift / Boon / Glyph.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the enemy is closer to the dest than the ally. Peer: paint on the ally path. Above: refuse if the player will steal the 6.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 0.95, res 0.85, init 1.00, chc 0.70. Identity is the **public pad**. If it tops the meter on paint, the kit leaked — enter deals the 6, not the cast.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "paint_enter_heal_on_ally_path"`. VETERAN: skip if the enemy is closer. ELITE: Pair Hinge / Shove Face onto the pad; Gait Seal so they cannot steal. CHAMPION: occupant already standing when painted does **not** trigger; Swap onto the cell **must tick** (MIMA-001). Observation is **paint**.
- **CORE_SPELL_POOL:** `spell-enter-mend`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-gait-seal` only if `gait_sealer` is **absent**
- **ELITE_SPELL_POOL:** none — enter honesty is the elite. Do **not** unlock Gift Sill as identity.
- **SIGNATURE_MECHANICS:** Paint 2 turns. First living combatant who **walks or is forced** onto the cell heals 6, then expire. Teleport/swap count as enter. Forced-move counts.
- **VARIANT_PROGRESSION:** BASE frost-or-paint → VETERAN skip-if-steal → ELITE hinge/seal partner → CHAMPION occupy-vs-enter
- **RARITY_CURVE:** Standard. +ELITE on Split Pad.
- **SYNERGIES:** `pair_porter`, `gait_sealer`, `split_cantor`, `face_shover`
- **WEAKNESSES:** Step on it as the enemy (steal the 6); Brick Shift a wall onto the cell
- **PLAYER_COUNTERPLAY:** Steal the pad; Cursed Wound; don’t walk onto their gift
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-enter-mend` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (enter hook shared with Glyph Tax / Gift Sill)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `body_marker`

- **NAME:** Body Marker
- **ROLE:** debuffer (next hit on **that unit** ×1.5)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from tile Mark / Split Mark, `cast_marker` (detonate on **their** cast), File Brand, Enrage. At most one unit-amp CORE per pack as PAIR vs Cast Mark / tile Mark.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no damaging id is off cooldown. Peer: Body Mark then follow up. Above: refuse if no follow-up this turn (would arm a charge they walk into a 1-damage poke).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.85, res 0.75, init 1.15, chc 1.00. Identity is **amp the unit, not the floor**. If it tops the meter without a follow-up, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "mark_unit_if_nuke_ready"`. VETERAN: skip if no damaging id off CD. ELITE: Coup / Lone Sting partner. CHAMPION: applies **first**, then existing tile Mark; last writer on the **unit** wins; DoT apply consumes.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-body-mark`
- **ADVANCED_SPELL_POOL:** `spell-mark` (tile, different cell), `spell-expose`
- **RARE_SPELL_POOL:** `spell-coup-de-grace` only if `coup_duelist` is **absent**
- **ELITE_SPELL_POOL:** none — follow-up honesty is the elite. Do **not** unlock Cast Mark as identity.
- **SIGNATURE_MECHANICS:** No damage. Next damaging hit against that combatant ×1.5 on that hit’s **base** before SP/RES/SR/crit/tile-Mark. Charge consumes even if the hit fizzles. Cleanse / Absolve strips.
- **VARIANT_PROGRESSION:** BASE frost-or-mark → VETERAN skip-if-no-nuke → ELITE coup-partner → CHAMPION sequential-mul
- **RARITY_CURVE:** Standard. +ELITE on Body Cast.
- **SYNERGIES:** `coup_duelist`, `lone_stinger`, `cast_marker` (COURT, not PAIR)
- **WEAKNESSES:** Cleanse; bait the charge with a 1-damage poke; Sidestep the amped hit
- **PLAYER_COUNTERPLAY:** Absolve; poke for 1; don’t stand in their Frost after the arm
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-body-mark` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (unit flag, consume on incoming hit)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `split_cantor`

- **NAME:** Split Cantor
- **ROLE:** healer (12 split 50/50 with an adjacent ally)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **with** heal. Distinct from `pale_cantor` (single 12), `share_warden` (damage 50/50), Choir Hymn. ELITE acquisition on the spell. At most one split-heal CORE per pack as PAIR vs Pale Cantor / Share.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: single-target Mend-shape if only one body is wounded **and** isolated. Peer: Split Mend if two wounded bodies are Chebyshev-1. Above: refuse if the only adjacent ally is `summonAI: "dummypost"` (would dump 6 into 1 HP).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.00, chc 0.70. Identity is **stand together to split**. If it tops the meter as a 12 into one isolated body every turn, the kit leaked toward Rally.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "split_heal_if_two_wounded_adj"`. VETERAN: skip if only one wounded **and** isolated (then it is just Mend). ELITE: skip Dummy Post as the adjacent. CHAMPION: primary is **not** self; each recipient honors `healRecv` independently.
- **CORE_SPELL_POOL:** `spell-split-mend`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-enter-mend` only if `enter_mender` is **absent**
- **ELITE_SPELL_POOL:** none — split honesty is the elite. Do **not** unlock Choir Hymn as identity.
- **SIGNATURE_MECHANICS:** Heal target 6 and nearest other ally at Chebyshev ≤ 1 for 6. If no adjacent ally, target receives the full 12. `no_healing`: any player-side HP up fails.
- **VARIANT_PROGRESSION:** BASE frost-or-split → VETERAN skip-if-single-isolated → ELITE skip-dummy → CHAMPION not-self-primary
- **RARITY_CURVE:** Standard. +ELITE on Split Pad.
- **SYNERGIES:** `enter_mender`, `wick_mender`, `gait_mender`
- **WEAKNESSES:** Isolate the target; Cursed Wound both; kill the adjacent ally first
- **PLAYER_COUNTERPLAY:** Peel the pack; don’t hug the wounded one
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-split-mend` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED
- **STATUS:** PROPOSED

---

### ENEMY_ID: `even_warder`

- **NAME:** Even Warder
- **ROLE:** controller (next walk even Manhattan) — **SDE Wave 7 unique CORE**
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn` or `bishop` **without** heal. Distinct from `axis_locksmith` (rank XOR file), `diag_locksmith` (diagonal shape), `misstep_herald` (cardinal). SDE G≥7 extras on locksmith / glyph / misstep are **not** CORE. Encounter `even_gallery` is a MULTI child — do not reuse that id.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if rooted or MP = 0. Peer: Even Stride if they have a 1-tile cardinal path. Above: refuse if they are already forced even (would spend 2 AP for 0).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.90, sr 0.95, res 0.90, init 1.10, chc 0.80. Identity is **odd steps fail**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "force_even_manhattan_walk"`. VETERAN: skip if rooted or MP = 0. ELITE: File Lance partner after they cannot take a 1-step file. CHAMPION: never BASE-kit Bias Step **and** Misstep on the same turn plan.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-even-stride`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-rank-lock` only if `axis_locksmith` is **absent**
- **RARE_SPELL_POOL:** `spell-walk-toll` only if `walk_toller` is **absent**
- **ELITE_SPELL_POOL:** none — parity honesty is the elite. Do **not** unlock Diag Lock as identity.
- **SIGNATURE_MECHANICS:** Next walk of ≥ 1 tile must have even Manhattan (`(abs(dx)+abs(dy)) % 2 === 0`). Odd-length confirms fail (MP not spent). Teleport / Swap / pads do not pay. Not `WF-ELT-EVEN_PICKET`.
- **VARIANT_PROGRESSION:** BASE frost-or-even → VETERAN skip-if-rooted → ELITE lance-the-file → CHAMPION no-triple-shape-brick
- **RARITY_CURVE:** Standard. +ELITE on Even Toll.
- **SYNERGIES:** `walk_toller`, `gait_muter`, `rank_lancer`
- **WEAKNESSES:** Blink; Strike in place; walk 2 the way they wanted
- **PLAYER_COUNTERPLAY:** Don’t take the 1-step; Phase Slip the odd gap
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-even-stride` (MULTI: family observe **or** `even_gallery` victory — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk confirm parity)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hold_knight`

- **NAME:** Hold Knight
- **ROLE:** anti-melee (cannot Strike until they walk)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` **without** heal. Distinct from `dull_censor` (Strike deals **0**), Oath Blade (other ids fizzle). SDE extras on `plate_warden` / `iron_golem` / `null_censor` are **not** CORE. At most one Strike-gate CORE per pack as PAIR vs Dull Edge.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they already walked this turn. Peer: Hold when adjacent and Strike is their likely next action. Above: refuse if they already walked (would spend 2 AP for 0).
- **STAT_SCALING_RULE:** hp 1.10, sp 0.95, sr 1.00, res 1.05, init 1.05, chc 0.90. Identity is **Strike is illegal**, not a bigger hit. If it tops the meter, the kit leaked toward charger numbers.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "forbid_strike_until_walk"`. VETERAN: skip if they already walked. ELITE: Gait Seal partner so they cannot pay the walk. CHAMPION: walk / blink / swap all count as “walked” for the flag; other spell ids remain legal.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-strike-hold`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-shadow-veil`
- **RARE_SPELL_POOL:** `spell-gait-seal` only if `gait_sealer` is **absent**
- **ELITE_SPELL_POOL:** none — gate honesty is the elite. Do **not** unlock Dull Edge as identity.
- **SIGNATURE_MECHANICS:** For 1 turn or until they complete a walk of ≥ 1 tile, `physical_attack` is illegal. Frost / Poison still work. Do not stack Dull Edge on the same BASE turn plan.
- **VARIANT_PROGRESSION:** BASE strike-or-hold → VETERAN skip-if-walked → ELITE seal-the-pay → CHAMPION blink-counts
- **RARITY_CURVE:** Standard. +ELITE on Hold Range.
- **SYNERGIES:** `gait_sealer`, `far_stinger`, `glass_sniper`
- **WEAKNESSES:** Cast Frost / Poison; walk 1 then Strike; Quiet Hex the Hold
- **PLAYER_COUNTERPLAY:** Don’t be a melee-only kit; take the 1-step then Strike
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-strike-hold` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (id gate on Strike)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `ground_oather`

- **NAME:** Ground Oather
- **ROLE:** controller (next non-Strike spell must target empty/ground)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from Aim Veil / Axis Veil. SDE extras on `pit_mason` / `origin_mason` are **not** CORE. At most one ground-only CORE per pack as PAIR vs those masons.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the target’s kit is Strike-only. Peer: Ground Oath if they have a unit-targeted nuke. Above: refuse Strike-only kits (would spend 2 AP for 0).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.95, sr 0.90, res 0.85, init 1.10, chc 0.85. Identity is **Frost fizzles**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "next_spell_ground_only"`. VETERAN: skip if Strike-only kit. ELITE: Brick Shift / Echo Paint partner so the forced ground cast is a bad cell. CHAMPION: Strike unaffected; summon ids that target ground remain legal.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-ground-oath`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-barrier` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-brick-shift` only if `brick_shifter` is **absent**
- **ELITE_SPELL_POOL:** none — ground honesty is the elite. Do **not** unlock Aim Veil as identity.
- **SIGNATURE_MECHANICS:** Next non-Strike spell this battle (or 2 turns) must have `targetType` in `{ground, empty, self}` or it fizzles (AP spent). CD 3.
- **VARIANT_PROGRESSION:** BASE frost-or-oath → VETERAN skip-if-melee-only → ELITE paint-the-forced-cast → CHAMPION strike-legal
- **RARITY_CURVE:** Standard. +ELITE on Ground Brick / Cast Quiet.
- **SYNERGIES:** `brick_shifter`, `echo_painter`, `cast_marker`, `once_cantor`
- **WEAKNESSES:** Strike; Barrier / Cinder / Open Pit as the ground cast; wait 2 turns
- **PLAYER_COUNTERPLAY:** Hit with Strike; dump a cheap Barrier and move on
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-ground-oath` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (next-spell targetType gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `walk_toller`

- **NAME:** Walk Toller
- **ROLE:** debuffer (next walk costs +1 MP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `ley_tollkeeper` (`spell.mpCost` on the **cast**), Exit Tithe (AP on leave), Crowd Tax (AP through me). SDE extras on `tide_shade` / `recoil_squire` / `gait_muter` are **not** CORE. Encounter `toll_nave` is a teach. At most one walk-MP-tax CORE per pack as PAIR vs Ley Toll.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if target MP = 0. Peer: Walk Toll if they have MP ≥ 1 and a path. Above: refuse if MP = 0 (would spend 2 AP for 0).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.95, sr 0.90, res 0.80, init 1.15, chc 0.85. Identity is the **walk-pool tax**. If it tops the meter, the kit leaked. Do **not** also add `spell.mpCost`.
- **AI_TIER_PROGRESSION:** Profile `kiter`. `aiHint: "tax_next_walk_mp"`. VETERAN: skip if MP = 0. ELITE: Gift Sill / Boot Sting partner. CHAMPION: teleport / swap / pads do **not** pay; if they cannot pay, walk confirm fails (no partial step).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-walk-toll`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-frost-nova`
- **RARE_SPELL_POOL:** `spell-gift-sill` only if `gift_siller` is **absent**
- **ELITE_SPELL_POOL:** none — tax honesty is the elite. Do **not** unlock Ley Toll as identity.
- **SIGNATURE_MECHANICS:** Next walk of ≥ 1 tile costs 1 extra MP from the walk pool. `spell.mpCost` stays 0. Not a fourth cast-MP snipe.
- **VARIANT_PROGRESSION:** BASE frost-or-toll → VETERAN skip-if-no-MP → ELITE sill/boot partner → CHAMPION no-partial
- **RARITY_CURVE:** Standard. +ELITE on Even Toll / Gift Boot.
- **SYNERGIES:** `even_warder`, `gift_siller`, `boot_stinger`, `gait_muter`
- **WEAKNESSES:** Blink; Strike in place; steal Gift Sill; stay put
- **PLAYER_COUNTERPLAY:** Don’t walk; Phase Slip; wait the CD
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-walk-toll` (ENEMY_DISCOVERY). `toll_nave` teach is not the family id.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk confirm extra MP; not `executeCastAttempt` MP debit)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `purse_locker`

- **NAME:** Purse Locker
- **ROLE:** debuffer (leftover AP frozen)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `purse_scribe` (Empty Purse **spends** leftover), `leftover_lender` (dump **yours**), `purse_splitter` (split **theirs**). SDE extras on `tax_scribe` / `ledger_siphon` / `bone_scribe` are **not** CORE. Encounter `lock_nave` is a teach. At most one leftover-freeze CORE per pack as PAIR vs those purses.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover ≤ 1. Peer: Purse Lock if leftover ≥ 2. Above: refuse leftover ≤ 1.
- **STAT_SCALING_RULE:** hp 0.75, sp 0.90, sr 0.90, res 0.75, init 1.20, chc 0.80. Identity is **the Inferno they cannot dump**. If it tops the meter, the kit leaked. Do not write persisted `CharacterStats.ap`.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "freeze_leftover_ap"`. VETERAN: skip if leftover ≤ 1. ELITE: Act Tax partner. CHAMPION: freeze is the rest of their **current** turn (if it is theirs) or their **next** turn; they may still spend AP that refreshes at turn start; do not stack Empty Purse on the same BASE turn plan.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-purse-lock`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-act-tax` only if `act_teller` is **absent**
- **RARE_SPELL_POOL:** `spell-cadence-flush` only if `cadence_flusher` is **absent** (COURT, not PAIR)
- **ELITE_SPELL_POOL:** none — freeze honesty is the elite. Do **not** unlock Empty Purse as identity.
- **SIGNATURE_MECHANICS:** Leftover AP cannot be spent on spells or Attack Nearest for the freeze window. Empty Purse / Late Purse read 0 leftover while frozen.
- **VARIANT_PROGRESSION:** BASE frost-or-lock → VETERAN skip-if-empty → ELITE act-tax partner → CHAMPION turn-window-honesty
- **RARITY_CURVE:** Standard. +ELITE on Purse Bell.
- **SYNERGIES:** `act_teller`, `cadence_flusher`
- **WEAKNESSES:** Spend leftover **before** they lock; Quiet Hex; End Turn
- **PLAYER_COUNTERPLAY:** Dump Inferno first; don’t hold 6 leftover into this kit
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-purse-lock` (ENEMY_DISCOVERY). `lock_nave` teach is not the family id.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (leftover spend gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `ally_reeler`

- **NAME:** Ally Reeler
- **ROLE:** displacement specialist / protector (pull 1 toward nearest ally)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `file_reeler` (shared file toward **caster**), `hook_chaplain` (pull **ally** adjacent), `sink_chanter` (tile attract). SDE extras on `pale_cantor` / `font_cantor` / `cover_squire` are **not** CORE. At most one ally-attract CORE per pack as PAIR vs File Reel / Leash Hook / Sinkhole.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no ally or already Chebyshev-adjacent to that ally. Peer: Ally Reel if landing is free. Above: refuse if landing blocked (fizzle).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **the ally is the attractor**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "attract_toward_nearest_ally"`. VETERAN: skip if no ally or already adj. ELITE: Echo Paint / Fuse on the landing. CHAMPION: uses `applyAttract` toward that ally’s cell — second cast caller after File Reel; lava/spikes on landing use existing ticks.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-ally-reel`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark` on the **landing**
- **RARE_SPELL_POOL:** `spell-echo-paint` only if `echo_painter` is **absent**
- **ELITE_SPELL_POOL:** none — ally-as-hole honesty is the elite. Do **not** unlock File Reel as identity.
- **SIGNATURE_MECHANICS:** Pull the **enemy** 1 tile toward the caster’s nearest living **ally** (not self). No ally or blocked landing → fizzle (AP spent).
- **VARIANT_PROGRESSION:** BASE frost-or-reel → VETERAN skip-if-no-ally → ELITE landing-paint → CHAMPION attract-caller
- **RARITY_CURVE:** Standard. +ELITE on Ally Wick / Cluster Dummy.
- **SYNERGIES:** `echo_painter`, `fuse_binder`, `dummy_prelate`, `split_fanger`
- **WEAKNESSES:** Kill the ally first; Claim Ward the landing; stand where the pull is a 0-step
- **PLAYER_COUNTERPLAY:** Isolate their pack; don’t stand on the fuse
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-ally-reel` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (`applyAttract` cast caller; landing hazards must tick)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `echo_painter`

- **NAME:** Echo Painter
- **ROLE:** hazard creator (copy last paint onto a neighbor)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from Cinder (places), Wick Bite (bonus on paint), Echo Cast (copies a **spell**). SDE extras on `ember_knight` / `fuse_binder` / `glyph_sower` are **not** CORE. Encounter `paint_gallery` is a teach. At most one copy-paint CORE per pack as PAIR vs those extras.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no cinder/rime/mire/void paint on the board. Peer: Echo Paint onto an empty Chebyshev-1 neighbor of the last-written type. Above: refuse if no paint (fizzle).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.05, sr 0.90, res 0.75, init 1.10, chc 0.85. Identity is **the second cell**. If it tops the meter on an empty board, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "copy_last_paint_adjacent"`. VETERAN: skip if no paint. ELITE: Ally Reel onto the new cell. CHAMPION: Open Pit / Barrier / world lava are **not** paint; respect `MAX_HAZARD_TILES = 50`.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-echo-paint`
- **ADVANCED_SPELL_POOL:** `spell-cinder-tile` only if `usableByEnemy` is flipped for **that one id** and `ember_knight` family overlay is **absent**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-rime-tile` only if `rime_mason` is **absent**
- **ELITE_SPELL_POOL:** none — copy honesty is the elite. Do **not** unlock Cinder as identity.
- **SIGNATURE_MECHANICS:** Copy last-written type in `{cinder, rime, mire, void}` onto one empty Chebyshev-1 neighbor of the clicked cell. Clicked cell must already hold that type **or** be empty adjacent to it. No paint → fizzle.
- **VARIANT_PROGRESSION:** BASE frost-or-copy → VETERAN skip-if-empty-board → ELITE reel-onto-copy → CHAMPION type-whitelist
- **RARITY_CURVE:** Standard. +ELITE on Ally Wick / Ground Brick.
- **SYNERGIES:** `ally_reeler`, `fuse_binder`, `ground_oather`
- **WEAKNESSES:** Barrier replaces last writer; step off both cells; do not let them paint the first cell
- **PLAYER_COUNTERPLAY:** Kill the first painter; Dispel; don’t hug the copy
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-echo-paint` (ENEMY_DISCOVERY). `paint_gallery` teach is not the family id.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (paint table copy)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `blink_sealer`

- **NAME:** Blink Sealer
- **ROLE:** anti-teleporter / controller (cannot Swap / blink / pad)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from Claim Ward (cell), Grounded Lock (root **walk**), Self Anchor (ignore push). SDE extras on `void_anchoret` / `mist_walker` are **not** CORE. At most one displace-forbid CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they have none of the forbidden ids and no pad is visible. Peer: Blink Seal if they own Swap / Phase Slip / Pawn Trade or a pad is on the board. Above: refuse if they have none (would spend 2 AP for 0).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.90, sr 0.95, res 0.90, init 1.10, chc 0.80. Identity is **walks remain legal**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "forbid_displace_ids"`. VETERAN: skip if no displace id and no pad. ELITE: Rank Lock / Axis partner. CHAMPION: 2 turns; `forbidDisplaceIds` is an id list — never name-parse `"blink"`.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-blink-seal`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-rank-lock` only if `axis_locksmith` is **absent**
- **RARE_SPELL_POOL:** `spell-root-snare` only if `snare_weaver` is **absent**
- **ELITE_SPELL_POOL:** none — id-list honesty is the elite. Do **not** unlock Claim Ward as identity.
- **SIGNATURE_MECHANICS:** 2 turns: cannot resolve `spell-swap`, `spell-phase-slip`, Twin/Triune/Twin Span **pad transit**, or `spell-pawn-trade`. Ordinary walks legal.
- **VARIANT_PROGRESSION:** BASE frost-or-seal → VETERAN skip-if-no-blink → ELITE axis-partner → CHAMPION id-list
- **RARITY_CURVE:** Standard. +ELITE on Blink Rank.
- **SYNERGIES:** `axis_locksmith`, `rank_lancer`, `even_warder`
- **WEAKNESSES:** Walk; wait 2 turns; Strike
- **PLAYER_COUNTERPLAY:** Don’t rely on Swap this fight; walk the tax
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-blink-seal` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (displace id gate + pad transit)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gift_siller`

- **NAME:** Gift Siller
- **ROLE:** buffer / hazard creator (enter cell +1 leftover MP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` **without** heal (`healAmount` would flip healer-first). Distinct from `enter_mender` (enter **HP**), `pet_siller` (summons cannot enter), `boon_mason` (leave +MP). SDE extras on `origin_mason` / `lintel_mason` are **not** CORE. At most one enter-MP CORE per pack as PAIR vs Enter Mend / Pet Sill / Exit Boon.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if already adjacent (no path cell). Peer: paint a cell on the player’s likely path **or** the cell the caster will enter after Walk Toll. Above: refuse if the player will steal the MP.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 1.00, res 0.95, init 0.95, chc 0.75. Identity is the **public MP pad**. If it tops the meter, the kit leaked. Not `spell.mpCost`.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "paint_enter_plus_mp"`. VETERAN: skip if already adjacent. ELITE: Walk Toll then step the sill. CHAMPION: first unit (either side) to **enter by walk** gains 1 leftover MP (cap at max); teleport / swap do **not** grant.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-gift-sill`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-walk-toll` only if `walk_toller` is **absent**
- **ELITE_SPELL_POOL:** none — enter-by-walk honesty is the elite. Do **not** unlock Enter Mend as identity.
- **SIGNATURE_MECHANICS:** Paint empty floor. First walk-enter this battle (or 2 turns) +1 leftover MP once. Allies can steal it. Observation is paint, not the grant step.
- **VARIANT_PROGRESSION:** BASE strike-or-paint → VETERAN skip-if-no-path → ELITE toll-then-step → CHAMPION walk-only-grant
- **RARITY_CURVE:** Standard. +ELITE on Gift Boot.
- **SYNERGIES:** `walk_toller`, `boot_stinger`, `cover_squire`
- **WEAKNESSES:** Don’t enter; push a pawn onto it; Walk Toll still taxes the grant
- **PLAYER_COUNTERPLAY:** Steal the MP; skip the cell
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gift-sill` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (enter hook; leftover MP grant)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `split_fanger`

- **NAME:** Split Fanger
- **ROLE:** artillery (16 + 16 if a second hostile is clustered)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` or `queen` **without** heal. Distinct from `lone_stinger` (isolation inverse), Chain Lightning (bounce, full payload), overkill retarget. SDE extras on `glance_ward` / `iron_golem` are **not** CORE. At most one cluster-split CORE per pack as PAIR vs Lone Sting / Storm Caller.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if 0 clustered pairs. Peer: Split Fang if a second living hostile is Chebyshev ≤ 1 from the primary. Above: refuse if 0 clustered pairs **and** Strike is better (would be a 16 pretending to be 32).
- **STAT_SCALING_RULE:** hp 0.95, sp 1.15, sr 0.90, res 0.90, init 1.05, chc 1.00. Identity is the **clump tell**. If it tops the meter into an isolated body every turn, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "split_hit_adjacent_hostile"`. VETERAN: skip if 0 clustered pairs and Strike is better. ELITE: Ally Reel / Dummy partner to cluster. CHAMPION: enemy-side AI = player + a player summon clustered; not a bounce (does not seek nearest beyond 1); one observe for both hits.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-split-fang`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-ally-reel` only if `ally_reeler` is **absent**
- **ELITE_SPELL_POOL:** none — cluster honesty is the elite. Do **not** unlock Chain Lightning as identity.
- **SIGNATURE_MECHANICS:** Deal 16 to primary. If a second living hostile is Chebyshev ≤ 1, deal 16 to that second as a **second** `dealDamage`. If none, 16 only (not a fizzle).
- **VARIANT_PROGRESSION:** BASE strike-or-split → VETERAN skip-if-isolated → ELITE reel/dummy cluster → CHAMPION no-bounce
- **RARITY_CURVE:** Standard. +ELITE on Cluster Dummy.
- **SYNERGIES:** `ally_reeler`, `dummy_prelate`, `pair_porter` (COURT peel vs cluster)
- **WEAKNESSES:** Spread summons Chebyshev ≥ 2; Barrier the primary; don’t stand on your whelp
- **PLAYER_COUNTERPLAY:** Unsummon / peel; don’t hug the Dummy
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-split-fang` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (second `dealDamage` if adj)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `wall_biter`

- **NAME:** Wall Biter
- **ROLE:** bruiser / anti-ranged (bonus if target hugs a **blocking** tile)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `pawn` **without** heal. Distinct from `wall_stinger` (target hugs a **spell barrier**), Wick Bite (paint), Corner Lens (blocked LoS). SDE extras on `stone_castellan` / `pit_mason` are **not** CORE. At most one blocking-tile gun as PAIR vs Wall Sting.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if open floor on all 8. Peer: Wall Bite only if the target is Chebyshev-1 from a blocking tile. Above: refuse open-floor (would be a 10 pretending to be 20).
- **STAT_SCALING_RULE:** hp 1.05, sp 1.10, sr 0.95, res 1.00, init 0.90, chc 0.95. Identity is the **corridor hug**. If it tops the meter in an empty field, the kit leaked. Do not also ignore LoS.
- **AI_TIER_PROGRESSION:** Profile `charger`. `aiHint: "bonus_if_adj_block"`. VETERAN: skip if open floor on all 8 and Strike is better. ELITE: Rank Lock / Axis partner into a wall. CHAMPION: painted hazards, Open Pit, and Barrier are **not** blocking unless they already `blocksWalk`; world walls / unwalkable count.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-wall-bite`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-rank-lock` only if `axis_locksmith` is **absent**
- **ELITE_SPELL_POOL:** none — blocking-tile honesty is the elite. Do **not** unlock Wall Sting as identity.
- **SIGNATURE_MECHANICS:** Deal 10. If the target’s cell is Chebyshev-adjacent to a blocking tile, extra 10 as a second `dealDamage`. Missing key fail closed (10 only).
- **VARIANT_PROGRESSION:** BASE strike-or-bite → VETERAN skip-if-open → ELITE lock-into-wall → CHAMPION blocksWalk-honesty
- **RARITY_CURVE:** Standard. +ELITE on Wall Corridor.
- **SYNERGIES:** `rank_lancer`, `axis_locksmith`, `bash_bruiser`
- **WEAKNESSES:** Step to open floor; don’t hug the corridor; Barrier is not a wall unless it blocks walk
- **PLAYER_COUNTERPLAY:** Fight in the open; don’t let Rank Lock pin you to a pillar
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-wall-bite` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (Chebyshev scan of blocking tiles)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cast_marker`

- **NAME:** Cast Marker
- **ROLE:** debuffer (mark detonates if they **cast**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `body_marker` (next **hit** ×1.5), Split Mark (detonate on **hit**), Debt Mark (AP tax), File Brand. SDE extras on `hex_chorister` / `fuse_binder` are **not** CORE. At most one detonate-on-cast CORE per pack as PAIR vs Body Mark.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they only have Strike. Peer: Cast Mark if they have a non-Strike spell. Above: refuse Strike-only kits.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.05, sr 0.85, res 0.75, init 1.15, chc 0.95. Identity is **punish the 3-AP tool**. If it tops the meter without a detonate, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "detonate_on_cast"`. VETERAN: skip if they only have Strike. ELITE: Ground Oath / Once Verse partner. CHAMPION: Strike, walk, End Turn, and potion Use do **not** detonate; detonation is not a second observe; uses explicit `isMark` metadata.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cast-mark`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-quiet-hex` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-ground-oath` only if `ground_oather` is **absent**
- **ELITE_SPELL_POOL:** none — Strike-legal honesty is the elite. Do **not** unlock Body Mark as identity.
- **SIGNATURE_MECHANICS:** Mark 2 turns. If the target casts a non-Strike spell while marked, detonate 12 (spell) and consume. CD 2.
- **VARIANT_PROGRESSION:** BASE frost-or-mark → VETERAN skip-if-melee-only → ELITE oath/once partner → CHAMPION strike-does-not-trip
- **RARITY_CURVE:** Standard. +ELITE on Body Cast / Cast Quiet.
- **SYNERGIES:** `ground_oather`, `once_cantor`, `body_marker` (COURT)
- **WEAKNESSES:** Strike; walk; wait out 2 turns; Quiet Hex so they cannot afford a detonate bait
- **PLAYER_COUNTERPLAY:** Hit with Strike; don’t recast Inferno into the mark
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cast-mark` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (mark + consume on non-Strike cast)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `still_leasher`

- **NAME:** Still Leasher
- **ROLE:** anti-summon (pause hostile summon lifespan)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `leash_cutter` (cut remaining to 1), Sever Tether (**kills**), Keep Kennel (add allied). SDE extra on `null_censor` is **not** CORE. At most one pause-life CORE per pack as PAIR vs Short Leash / Null Censor.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no hostile summon with remaining lifespan ≥ 2. Peer: Still Leash that summon. Above: refuse if the target is not `isSummon` (fizzle).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.90, res 0.80, init 1.10, chc 0.80. Identity is **the body stays**. If it tops the meter, the kit leaked. Do not steal.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "pause_hostile_summon_lifespan"`. VETERAN: skip if no summon with remaining ≥ 2. ELITE: Pet Sill partner after the pause. CHAMPION: do **not** put Short Leash and Still Leash on the same BASE turn plan; pause is 2 of **its** turns.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-still-leash`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-sever-tether` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-pet-sill` only if `pet_siller` is **absent**
- **ELITE_SPELL_POOL:** none — pause honesty is the elite. Do **not** unlock Short Leash as identity.
- **SIGNATURE_MECHANICS:** If target `isSummon`, pause remaining lifespan ticks for 2 of its turns. Non-summon → fizzle (AP spent). Never name-parse the summon.
- **VARIANT_PROGRESSION:** BASE frost-or-pause → VETERAN skip-if-no-pet → ELITE sill partner → CHAMPION no-double-leash
- **RARITY_CURVE:** Standard. +ELITE on Still Sill.
- **SYNERGIES:** `pet_siller`, `verse_thief`, `leash_cutter` (COURT, not PAIR)
- **WEAKNESSES:** Don’t summon; Sever Tether your own dying pet; wait 2
- **PLAYER_COUNTERPLAY:** Fight without pets; don’t let a bomber freeze on a cell
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-still-leash` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (lifespan pause flag on summon)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `verse_thief`

- **NAME:** Verse Thief
- **ROLE:** anti-summon (steal 1 CD from a hostile summon kit)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `cadence_thief` (steal from a **caster**), `cadence_flusher` (ally all CDs → 0), Choir Verse (copy last ally). SDE extra on `cadence_thief` is **not** CORE. ELITE acquisition on the spell. At most one summon-CD-steal CORE per pack as PAIR vs Cadence Theft / Flush.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no summon kit CD. Peer: Pet Verse that summon. Above: refuse if no summon or no CD (fizzle).
- **STAT_SCALING_RULE:** hp 0.75, sp 0.90, sr 0.85, res 0.75, init 1.20, chc 0.85. Identity is **steal from the pet, not the caster**. If it tops the meter, the kit leaked. Stolen id is **not** granted to the player.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "steal_summon_cooldown"`. VETERAN: skip if no summon kit CD. ELITE: Spark Whelp then steal. CHAMPION: largest remaining CD first; apply to this caster’s matching id if owned, else discard; never name-parse the summon.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-pet-verse`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-cadence-theft` only if `cadence_thief` is **absent**
- **RARE_SPELL_POOL:** `spell-still-leash` only if `still_leasher` is **absent**
- **ELITE_SPELL_POOL:** none — summon-only honesty is the elite. Do **not** unlock Cadence Flush as identity.
- **SIGNATURE_MECHANICS:** Target must be a hostile summon with a kit id on cooldown. Steal 1 remaining CD from one of those ids. CD 3.
- **VARIANT_PROGRESSION:** BASE frost-or-steal → VETERAN skip-if-no-CD → ELITE spark-then-steal → CHAMPION largest-first
- **RARITY_CURVE:** Standard. +ELITE on Still Sill.
- **SYNERGIES:** `still_leasher`, `spark_chanter`, `pet_siller`
- **WEAKNESSES:** Pets with Strike-only kits; wait CD to 0; don’t summon
- **PLAYER_COUNTERPLAY:** Strike-only whelps; unsummon before the steal
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pet-verse` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (summon cooldown map steal)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `ghost_stepper`

- **NAME:** Ghost Stepper
- **ROLE:** teleporter / kiter (occupy the last cell left)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` **without** heal. Distinct from `slip_squire` / `mist_walker` / `blink_cutter` (the teleport itself), Twin Span (two posts), Claim Ward (chosen cell). SDE extras on `blink_cutter` / `rift_hook` are **not** CORE. Encounter `ghost_court` is a teach. ELITE acquisition on the spell. At most one last-cell-ghost CORE per pack as PAIR vs those blinkers.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if MP = 0. Peer: arm Ghost Step then walk 1. Above: refuse if MP = 0 **or** the vacated cell would brick solvability (1-tile closet).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.95, sr 0.85, res 0.80, init 1.25, chc 1.00. Identity is **don’t chase the vacated cell**. If it tops the meter without walking, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "occupy_last_cell_left"`. VETERAN: skip if MP = 0. ELITE: Rear Cut / Shadow Lurker partner after they cannot re-enter. CHAMPION: teleport / swap do **not** leave a ghost; ghost blocks walk / summon enter / swap dest like a unit, but cannot be targeted, has no HP, is not a combatant; ghosts expire (maps stay solvable).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-ghost-step`
- **ADVANCED_SPELL_POOL:** `spell-shadow-veil`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-rear-cut` only if `usableByEnemy` is flipped for **that one id**
- **ELITE_SPELL_POOL:** none — walk-gated honesty is the elite. Do **not** unlock Knight Slip as identity.
- **SIGNATURE_MECHANICS:** Arm. Next walk of ≥ 1 tile leaves a 1-turn occupancy ghost on the **cell they left**. Needs vacated-cell write from battle walks (same prerequisite family as `walkMpSpentThisTurn`).
- **VARIANT_PROGRESSION:** BASE strike-or-arm → VETERAN skip-if-no-MP → ELITE rear-cut partner → CHAMPION teleport-does-not-ghost
- **RARITY_CURVE:** Standard. +ELITE on Ghost Rear.
- **SYNERGIES:** `shadow_lurker`, `crowd-tax` chassis, `gait_sealer`
- **WEAKNESSES:** Don’t chase the vacated cell; blink past; wait 1 turn
- **PLAYER_COUNTERPLAY:** Path around; Phase Slip; don’t re-enter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-ghost-step` (ELITE observe). `ghost_court` teach is not the family id.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy ghost; not a combatant; fail closed without vacated-cell write)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `thin_warder`

- **NAME:** Thin Warder
- **ROLE:** tank (next incoming hit capped at 30)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` **without** heal. Distinct from `morrow_warden` (delayed absorb), `cap_warder` (outgoing 12), `plate_warden` (absorb now; SDE G≥7 extra is **not** CORE), Surplus Ward (leftover-AP evade). MULTI child `hard_1` — first child wins vs family observe. At most one incoming-cap CORE per pack as PAIR vs Morrow / Plate / Cap.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if not expecting a 3+ AP nuke. Peer: Thin Ward when expecting Inferno / Fan. Above: refuse if already capped.
- **STAT_SCALING_RULE:** hp 1.35, sp 0.80, sr 1.15, res 1.20, init 0.75, chc 0.70. Identity is **two small hits beat one Inferno**. If it tops the meter, the kit leaked toward Strike. Do not also evade.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "cap_next_incoming"`. VETERAN: skip if already capped. ELITE: Goad / Dummy partner. CHAMPION: cap is after existing RES/SR via the already-computed hit; DoTs after the first tick are not “the next hit”; do not rewrite `combatMath.ts`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-thin-ward`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-goad` only if `goad_herald` is **absent**
- **ELITE_SPELL_POOL:** none — one-hit honesty is the elite. Do **not** unlock Morrow Plate as identity.
- **SIGNATURE_MECHANICS:** Next incoming **spell or Strike** that would deal damage is capped at 30 after RES/SR. CD 3. `hard_1` MULTI does not restamp challenge Doka.
- **VARIANT_PROGRESSION:** BASE strike-or-cap → VETERAN skip-if-capped → ELITE goad/dummy → CHAMPION computed-hit-honesty
- **RARITY_CURVE:** Standard. +ELITE on Thin Goad.
- **SYNERGIES:** `goad_herald`, `dummy_prelate`
- **WEAKNESSES:** Two small hits; DoT; wait 2 turns; Quiet Hex
- **PLAYER_COUNTERPLAY:** Poison then poke; don’t dump Inferno into the cap
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-thin-ward` (MULTI: family observe **or** `hard_1` complete — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (incoming-hit cap; do not edit damage math)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `clean_cantor`

- **NAME:** Clean Cantor
- **ROLE:** sniper (ignore LoS if untouched last opposing turn)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `queen` **without** heal (`healAmount` would flip healer-first; this id is LoS, not HP). Distinct from `glass_sniper` (min-range; SDE G≥7 extra is **not** CORE), Wounded Lens (ignore LoS **after being hit**), Corner Lens, Gate Sight. MULTI child `legendary_1` — first child wins. At most one untouched-LoS CORE per pack as PAIR vs Glass / Corner.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if already damaged. Peer: Clean Blood then snipe if untouched. Above: refuse if already damaged (fizzle).
- **STAT_SCALING_RULE:** hp 0.70, sp 1.20, sr 0.80, res 0.70, init 1.15, chc 1.10. Identity is **poke them for 1 before the snipe**. If it tops the meter after being hit, the kit leaked toward Frost-through-walls.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "ignore_los_if_untouched"`. VETERAN: skip if already damaged. ELITE: Smoke / Short Sight partner. CHAMPION: 0 damage during the previous opposing turn (round 1: this battle so far); next **spell** this turn ignores LoS; fizzle if already took damage.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-clean-blood`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-smoke-veil` only if `smoke_thurifer` is **absent**
- **ELITE_SPELL_POOL:** none — untouched honesty is the elite. Do **not** unlock Wounded Lens as identity.
- **SIGNATURE_MECHANICS:** Self buff. If untouched last opposing turn, next spell ignores LoS. `legendary_1` is the Untouchable **challenge door**, not this spell by itself. Duplicate challenge callback grants nothing.
- **VARIANT_PROGRESSION:** BASE frost-or-clean → VETERAN skip-if-poked → ELITE smoke partner → CHAMPION round-1-honesty
- **RARITY_CURVE:** Standard. +ELITE on Clean Fog.
- **SYNERGIES:** `smoke_thurifer`, `dim_optic`, `far_stinger`
- **WEAKNESSES:** Poke them for 1 before the snipe; Paper Wind; walk adjacent
- **PLAYER_COUNTERPLAY:** Any 1 damage last turn; don’t let them sit untouched behind a wall
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-clean-blood` (MULTI: family observe **or** `legendary_1` complete — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (untouched flag + next-spell LoS ignore)
- **STATUS:** PROPOSED

---

## 5. Implementation notes (for a later, explicit implementation PR)

1. **No production TypeScript / Motoko / Candid in this change.**  
2. **No new `mpCost > 0`.** Walk Toll is `nextWalkMpTax`. Ley Toll / Undertow / Sanguine Toll remain the only paper cast-MP spenders.  
3. **No new facing card.** Wave 5 still owns `currentView` after a battle-walk writer exists.  
4. **No new queue / wrap / mid-RAF card.** Morrow Plate’s delay is **their next turn start**. Cadence Flush does not splice the caster. Leftover Lend does not end the turn.  
5. **Pair Hinge / Court Hinge** are occupancy dests, not `isSwap`. Do not call `swapPositions`. Landing hazards must tick.  
6. **Gait Mend / Split Mend / Enter Mend / Mend Wick** flip `challengeHealUsedRef` only when player-side HP actually increased. Non-healer CORE must not receive those ids (`inferArchetype` is healer-first).  
7. **Dummy Post** uses `summonAI: "dummypost"`. Empty kit. Counts as **one**. Never parse `"Dummy Post"`. Add the enum to `inferSummonArchetype` in the implementation PR, not here.  
8. **Ghost Step / Gait Mend / Boot Sting** fail closed until battle walks write `walkMpSpentThisTurn` / vacated cell.  
9. **Ally Reel** is the second `applyAttract` cast caller (File Reel is first).  
10. **Thin Ward / Return Sting / Body Mark** consume on the incoming-hit pipeline. Do not add a percent miss inside `combatMath.ts`.  
11. Family HP must survive battle start (`WX` 11970–11974 still wipes it). Kit zone must stop passing `currentMap.levelZone` as a number (`WX` 11920). Those are **implementation prerequisites**, not new families.  
12. Recap grant uses the reward funnel + `commitSpellDiscoveries` / `unlockOwnedSpell`, not `updateCharacter`.  
13. Do not append these ids to `starterSpells` as `isBaseSpell`.  
14. Extract helpers. Do not grow `WorldExploration.tsx` (19,213 lines).  
15. Do not touch RAF, map generation, turn order, or damage math.

---

## 6. Explicit non-goals this pass

- No production code.  
- No retune of `pickEnemyLevelFromTiers` percents.  
- No fourth `mpCost > 0` walk snipe.  
- No sixth echo id.  
- No player-owned Hex of Silence.  
- No mid-RAF splice of the current actor.  
- No four-cell occupy.  
- No heal-if-**target**-moved.  
- No 180° pair hinge (SDE Wave 8 `spell-about-hinge`, never owned).  
- No refresh of all of a hostile’s remaining CDs.  
- No SDE Wave 8 unique CORE as this pass’s CORE.  
- No `wave9:` colliding spell ids.  
- No restamp of claimed feat / challenge / extra-door keys.

---

## 7. Wave 10 handoff

If SPELL_PROPOSALS 2026-09-26 stamps new verbs, Wave 10 consumes those — do not mint `wave9:` spell ids. SDE Wave 8 unique CORE (`spell-odd-stride` … `spell-about-hinge`) may become Wave 10 families if they still have no CORE owner. `spell-pack-tithe` / `spell-about-hinge` stay never-owned unless a later boss sheet claims them.

Hold: mid-RAF splice, fourth `mpCost` walk snipe, player-owned Hex of Silence, sixth echo, four-cell occupy, heal-if-target-moved, refresh-all hostile CDs.

Facing writer / `walkMpSpentThisTurn` / vacated-cell write / Triple Span cap ≥ 3 / Dummy Post `summonAI` enum / family HP surviving battle start / kit zone as a number remain **implementation prerequisites**, not new families.

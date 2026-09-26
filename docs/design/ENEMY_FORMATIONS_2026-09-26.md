# Enemy synergy and formation catalog (drop 9)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-09-26  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–8 already taught the seven pairing words and Waves 1–7 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 8 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-09-25.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-25.md) (open as PR #558) and deferred by drop 8 (PR #575): Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4, Wave 3 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5, Wave 4 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6, Wave 5 — open as PR #459), [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (drop 7, Wave 6 — open as PR #537), [`ENEMY_FORMATIONS_2026-09-25.md`](./ENEMY_FORMATIONS_2026-09-25.md) (drop 8, Wave 7 — open as PR #575). Family sheets: PR #558. Spell verbs: Wave 7 tactical ids in PR #525 (`spell-wall-sting` … `spell-exit-boon`) plus SDE Wave 6 unique CORE (`spell-dull-edge`, `spell-pet-sill`, `spell-short-leash`).

**Hard rules (Wave 8 pack law — plus every older law still stands):**

- Do **not** pack `wall_stinger` with `corner_bishop` / `post_stinger` / `far_stinger` / `glass_sniper` as a PAIR without a barrier / lock third (two guns, same lesson). `FSN-CAMP-TITHE` / `FSN-GLASS-WARD` / `FSN-CORNER-FOG` stay theirs.
- Do **not** pack `file_brander` with `file_reeler` / `rank_lancer` / `axis_locksmith` as a PAIR (rider vs attract vs ray vs walk-lock). CADRE `FSN-BRAND-REEL` is the three-body lesson.
- Do **not** pack `boot_stinger` with `post_stinger` as a PAIR (inverse walk guns). Spare Slip is a **third-body** variant, never a two-gun PAIR.
- Do **not** pack `face_shover` with `bash_bruiser` / `shove_chaplain` / `recoil_squire` as a PAIR (shove vs shove+face vs self-push). `FSN-HOOK-SLAM` / `FSN-SHOVE-SCHOOL` stay theirs.
- Do **not** pack `slip_squire` with `mist_walker` / `morrow_walker` / `blink_cutter` / `vault_chaplain` / `hinge_squire` as a PAIR (five other teleport engines). `FSN-MIST-HUNT` / `FSN-VAULT-ORIGIN` / `FSN-HINGE-GLANCE` stay theirs.
- Do **not** pack `pivot_ward` with `hinge_squire` / `pawn_broker` / `hook_chaplain` as a PAIR (three other rotate/swap engines). `FSN-HINGE-GLANCE` / `FSN-TRADE-HOLE` / `FSN-RESCUE-LINE` stay theirs.
- Do **not** pack `triple_span` with `twin_span` / `span_warder` / `span_prelate` / `pylon_prelate` / `bait_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter` (one multi-cell **or** post system). Triple Span counts as **three** and is illegal until remaining `ENEMY_SUMMON_CAP` ≥ 3 (live cap is **2**).
- Do **not** pack `cadence_cracker` with `cadence_breaker` / `cadence_thief` / `cadence_lender` as a PAIR (hostile reset vs self reset vs steal vs lend). `FSN-BREAK-CHOIR` / `FSN-CADENCE-MUTE` stay theirs.
- Do **not** pack `once_cantor` with `hex_chorister` / `verse_scribe` as a PAIR (recast lock vs replay). `FSN-HEX-BLOOD` / `FSN-VERSE-PULPIT` stay theirs.
- Do **not** pack `hood_lurker` with `sidestep_warder` / `cap_warder` as a PAIR (tick skip vs hit miss vs hit cap). `FSN-EVADE-GOAD` / `FSN-CAP-VEIL` stay theirs.
- Do **not** pack `share_warden` with `cover_squire` / `pain_suture` / `twin_tether` / `leash_warden` as a PAIR (split vs whole-hit redirect vs tether vs allied leash). `FSN-BRAND-COVER` / `FSN-PLATE-LINK` stay theirs.
- Do **not** pack `spare_pacer` with `tempo_precentor` as a PAIR (current walk MP vs next-turn AP). `FSN-TEMPO-CHOIR` / `FSN-ACT-GIFT` stay Tempo.
- Do **not** pack `wick_painter` with `pit_mason` / `fuse_binder` / `hinge_mason` as a PAIR (delayed pit vs immediate pit vs delayed damage vs enter-swap). CADRE `FSN-WICK-FACE` is the three-body lesson.
- Do **not** pack `boon_mason` with `tithe_mason` / `tax_scribe` / `origin_mason` / `glyph_sower` as a PAIR (exit refund vs exit tax vs enter tax vs Mark). `FSN-CAMP-TITHE` / `FSN-GRAVITY-TAX` stay theirs.
- Do **not** pack `dull_censor` with `null_censor` / `oath_censor` as a PAIR (Strike 0 vs other-id fizzle vs brand). `FSN-NULL-WALL` stays theirs.
- Do **not** pack `pet_siller` with `pit_mason` / `glyph_sower` as a PAIR (summon-only sill vs all-walk pit vs glyph tax).
- Do **not** pack `leash_cutter` with `null_censor` / `leash_warden` as a PAIR (cut hostile life vs lockout vs allied leash).
- Drop 4–8 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two span bodies; no two AP taxes; no two delayed clocks; no two leftover-AP engines).

Wave 9 **families** do not exist yet. Same-day SPELL_PROPOSALS Wave 8 (`SPELL_PROPOSALS_2026-09-25.md`, open as PR #563) still have **no family sheets**. Do not mint `FSN-*` ids that require Wave 8 spell verbs until that family pass exists.

Mute Thread / Queue Cut / False Cut / Must Pace / Court Shove stay **boss / closed-class**. Court Shove may appear as a CHAMPION **kit witness** on `face_shover` only — never as a world-pack CORE and never owned.

**Do not spawn Boot Sting sheets until a battle-walk writer exists for walk-MP spent this turn.** Missing field → Boot Sting pays **12 only** (fail closed). Forced-move / Swap / Knight Slip / Pivot **does not** count as walk. Until that writer lands, show `FSN-CAMP-TITHE` / `FSN-GLASS-WARD` instead of `FSN-BOOT-STEP` / `FSN-BOOT-SPARE` / `FSN-BOON-BOOT`.

**Shove Face writes `currentView` from this push only** (mapping WX 6928–6931). `FSN-FACE-WRITE` Glance may fire off that write without a battle-walk view writer. **Oncoming still fails closed** until combat walks write `currentView`. Until that writer lands, spawn `FSN-FACE-GLANCE` with Oncoming Frost-only, or skip to `FSN-FACE-WRITE`.

**Do not spawn Triple Plug until remaining `ENEMY_SUMMON_CAP` ≥ 3.** Live cap is 2 (`gameConstants.ts` 300). Raising the cap is **not** this catalog. Missing room → **reroll** this id; show `FSN-TWIN-PLUG` instead.

---

## Grounding (live, 2026-09-26)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 4–8. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

| Fact | Where |
| :--- | :--- |
| Kits by piece | `enemyAI.ts` `ENEMY_KITS` 163–185 |
| `buildEnemyKit` | `enemyAI.ts` 194–200 (`Math.floor(levelZone)`) |
| Battle-start kit assignment still passes `currentMap.levelZone` (object) | `WorldExploration.tsx` 11920; zone object at 4683–4687 |
| Summoner overlay still `BASE + characterStats.level * PER` (uncapped; saturates ~level 44) | `WorldExploration.tsx` 11932–11942; `gameConstants.ts` 298–299 |
| Family lottery 30%, seven live ids | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 35, `FAMILY_TYPES` 49–57; WX `applyFamilyVariantsToRoster` 5864–5866 |
| Family `res` / `sp` still written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) |
| Battle start still overwrites family HP | `WorldExploration.tsx` 11970–11974 `calcEnemyMaxHp(e.level)` |
| `inferArchetype` still heal-first | `enemyAI.ts` 447–452 |
| `decideEnemyAction` | `enemyAI.ts` 1662–1698 |
| `decideSummonerAction` still **skips** on missing spell / cap / cooldown | `enemyAI.ts` 1832–1888 |
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 218–221 — **no** `span` / `twinspan` / `triplespan` / `spark` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** Shove Face is the first **cast** writer of facing. |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 / 5855 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 (`ENEMY_SUMMON_CAP = 2`) |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 336–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 — Shove Face is the first **cast** caller of push that also writes facing; File Reel remains the first attract caller |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `areaShape` typed, unread | `targeting.ts` 690–727 (area = Chebyshev `areaRadius`); `spell.diagonal` at 712 |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated triple-span / twin-span / spark / span-pylon / bait / font / pylon / turret / familiar bodies **replace** the random overlay. Cap one of those engines. Triple Span **is** the three-cell system and needs remaining cap ≥ 3.
3. Any `healAmount` steals healer. **Do not put drain, nova, or `starter-heal` on Hug, Brand, Boot, Face, Slip, Pivot, Triple, Crack, Once, Hood, Share, Spare, Wick, Boon, Dull, Sill, or Cut.** Absolve on `FSN-HOOD-CHOIR` is the **one** heal-adjacent engine on that sheet (strip, not mend).
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Leash / Cover Step / Cadence Lend / Split Purse / Spare Pace / Flank Share.
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 8 CORE rows stay `mpCost: 0` (Ley Toll remains the first MP spender; do not add a fourth `mpCost > 0` walk snipe).
6. `inferSummonArchetype` must key `summonAI === "triplespan"` (and `"twinspan"` / `"spark"` / `"span"` / `"bait"` / `"font"` / `"pylon"` / `"turret"`) **before** any Triple Plug sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost / Shield, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies except the **one** Wall File rare Barrier on Hug **if** a dedicated mason is absent. Coup / Sated Fang / Act Bell / Post Sting / Boot Sting / Purse Cut / Cadence Crack are **not** `instantKill`.
8. Shove dest / pivot dest / slip dest / reel dest: free floor, not lava / spikes / void / portal / pit / live fuse, player keeps ≥ 1 escape tile. Shove Face collision = **0 facing rewrite**. Knight Slip dest-that-is-wall **fails** (Vault’s wall-ignore is not this card). Pivot is clockwise only.
9. Dual Slow / Frost / tide melee / rime: cap applied unit MP debuff at **−2**. One Slow source per pack. Do not also Root + Rank Lock + Facing Pin + Stride Mute + Exit Tithe + Exit Boon on the same AP bar.
10. Walk-spend: Boot Sting **fails closed** (12 only) until `walkMpSpentThisTurn` (or equivalent) exists on the turn actor. Knight Slip / shove / Swap / Pivot **does not** increment it. Spare Pace writes **current** walk MP this turn, never persisted `CharacterStats.mp`.

### Relative difficulty (same grades as drops 1–8)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…8 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a leftover-AP tell / a walk-tax / a facing write) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (hug / boot / face / share / wick / boon / triple-owner / pylon-owner / goad / locksmith / lancer / warden): pack median + one step.
- Backliner (brand / crack / once / hood / spare / dull / sill / cut / glance / oncoming / sniper / ignite / absolver / muter / spark / brood): pack median.
- Glass (brand, crack, once, hood, spare, dull, cut, glance, sniper, spark): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 9)

Drop 1–8 overlays still apply. These are **additional jobs** for Wave 8 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-HUG` | `rook` or `pawn` **without** heal | proposed `wall_stinger` | `starter-frost`, `spell-wall-sting` | artillery; skip the +10 unless target is Chebyshev-1 from `barrierTiles`; world walls / smoke / pits / span are **not** barriers |
| `ROLE-BRAND` | `rook` or `bishop` **without** heal | proposed `file_brander` | `starter-frost`, `spell-file-brand` | artillery; Brand only if they share **exactly one** axis; skip diagonal / same cell (Frost) |
| `ROLE-BOOT` | `knight` or `pawn` **without** heal | proposed `boot_stinger` | `physical_attack`, `spell-boot-sting` | flanker; skip the +10 if `walkMpSpentThisTurn` missing or 0 (Strike / 12-only); never count Slip / shove / Swap as walk |
| `ROLE-FACE` | `knight` **without** heal | proposed `face_shover` | `physical_attack`, `spell-shove-face` | flanker; skip if `applyPushback` would be 0 or dest is pit / lava; 0 damage; write `currentView` only if they changed cell |
| `ROLE-SLIP` | `knight` | proposed `slip_squire` | `physical_attack`, `spell-knight-slip` | flanker; (2,1) dest must be `isCellFree`; dest-is-wall fails; walk MP stays 0 |
| `ROLE-PIVOT` | `queen` or `bishop` **without** heal | proposed `pivot_ward` | `starter-frost`, `spell-pivot-foe` | caster; clockwise dest of the **target**; skip blocked / worse (lava) dest; caster stays |
| `ROLE-TRIPLE` | `rook` **without** heal | proposed `triple_span` | `physical_attack`, `spell-triple-span` | `isSummoner` for triple-span only; posts `summonAI: "triplespan"`, HP 1, empty kit, Strike illegal; skip if remaining cap < 3; no wolf/archer/pylon/turret/font/bait/span/twinspan/spark overlay |
| `ROLE-CRACK` | `bishop` or `queen` **without** heal | proposed `cadence_cracker` | `starter-frost`, `spell-cadence-crack` | caster; Crack once/battle on hostile highest remaining CD ≥ 2; skip a bar of 0s |
| `ROLE-ONCE` | `bishop` or `queen` **without** heal | proposed `once_cantor` | `starter-frost`, `spell-once-verse` | caster; skip if no `lastResolvedSpellId` (first spell of the fight never fizzles); never Mute Thread |
| `ROLE-HOOD` | `bishop` or `pawn` **without** heal | proposed `hood_lurker` | `starter-frost`, `spell-tick-hood` | caster; skip if no DoT; lava/spikes are **not** DoT ticks |
| `ROLE-SHARE` | `rook` or `king` **without** Rally | proposed `share_warden` | `physical_attack`, `spell-flank-share` | charger / holder; skip if no adjacent same-side ally; missing ally at **hit** time → full hit, charge gone |
| `ROLE-SPARE` | `knight` or `bishop` **without** heal | proposed `spare_pacer` | `starter-frost`, `spell-spare-pace` | buffer (`AI-ROL-05`); skip at max MP or no dest that needs +1; never persist `CharacterStats.mp` |
| `ROLE-WICK` | `rook` **without** heal | proposed `wick_painter` | `starter-frost`, `spell-pit-wick` | setter; paint a melee-approach cell that is walkable **now**; convert next turn to `pitTiles` (not `barrierTiles`); never `isTrap` |
| `ROLE-BOON` | `bishop` or `knight` **without** heal | proposed `boon_mason` | `starter-frost`, `spell-exit-boon` | setter; paint one free floor cell; skip if the cell dumps into a pit; teleport / swap / shove leave do **not** refund |
| `ROLE-DULL` | `bishop` **without** heal | proposed `dull_censor` | `starter-frost`, `spell-dull-edge` | caster; skip if they will not Strike (planted caster → Frost); never Mute Thread / Oath Blade |
| `ROLE-SILL` | `rook` or `pawn` **without** heal | proposed `pet_siller` | `starter-frost`, `spell-pet-sill` | setter; skip empty board (no hostile summon this fight); player body walks freely |
| `ROLE-CUT` | `bishop` **without** heal | proposed `leash_cutter` | `starter-frost`, `spell-short-leash` | caster; legal only if `isSummon` and remaining ≥ 2; 0 damage; skip player body |

Drop-2…8 `ROLE-PYLON` / `ROLE-MUTER` / `ROLE-GLANCE` / `ROLE-ONCOMING` / `ROLE-LOCK` / `ROLE-LINTEL` / `ROLE-SNIPER` / `ROLE-IGNITE` / `ROLE-ABSOLVER` / `ROLE-GOAD` / `ROLE-CAP` / `ROLE-FUSE` / `ROLE-POST` / `ROLE-SUMMONER` / `ROLE-SPARK` / `ROLE-REEL` are reused below. Do not also roll the random 12% summoner overlay onto Hug, Brand, Boot, Face, Slip, Pivot, Crack, Once, Hood, Share, Spare, Wick, Boon, Dull, Sill, or Cut. One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** pylon **or** font **or** bait **or** span-pylon **or** twin-span **or** triple-span **or** spark — never two). Triple Span occupies the three-cell **and** needs remaining cap ≥ 3.

### Fair-fight rules (every sheet)

Same as drops 1–8, plus Wave 8:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, barrier, live fuse, pit, lintel the player cannot enter, boon/tithe cell that is the only aisle, wick cell that is the only aisle, or a Triple Span chain that seals the only aisle.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Wall Sting: 12, +10 iff target Chebyshev-1 from `barrierTiles`. Missing set → 12 only. Step Chebyshev-2 from every planted wall.
- File Brand: 10, +10 iff share rank **XOR** file. Diagonal is 10 only. Same cell illegal. Leave one axis.
- Boot Sting: 12, +10 iff caster walk-MP spent this turn ≥ 1. Missing field → 12 only. Force a stand. Slip does not pay.
- Shove Face: push 1, 0 damage, write facing **only if** they changed cell. Collision = 0 rewrite. Dest hazard must tick. Occupy the dest.
- Knight Slip: eight (2,1) dests. Jump **over** a wall is legal if dest is free. Dest-is-wall fails. Plug the ring.
- Pivot Foe: dest = caster + `(dy, −dx)` from target − caster. Clockwise only. Blocked dest spends AP (fizzle). Hug a corner.
- Triple Span: three 1-HP posts, cardinal 3-line, lifespan 4, empty kit. Walk dest illegal unless living posts remain a 4-adj chain. Kill one (chain becomes two). Closet with no 3-line → **reroll**. Posts are not `countsTowardKillRewards`.
- Cadence Crack: target’s highest remaining CD → 0, once/battle. Ties: highest remaining, then lowest id. Sit with all CDs at 0.
- Once Verse: 2 turns; next spell fizzles if `spell.id === lastResolvedSpellId`. Strike is `physical_attack`. Missing last-id → no fizzle. Alternate ids.
- Tick Hood: next DoT tick that would deal HP deals 0, then consume. Apply still lands. Hits do **not** consume. Lava/spikes are not ticks. Wait 2 or apply after the skip.
- Flank Share: next damaging **hit** (not DoT, not lava) splits 50/50 after RES with nearest living Chebyshev-1 ally. Missing ally at hit → full hit, charge gone. Separate them.
- Spare Pace: +1 current walk MP this turn, cap at unit max. Not a duration buff. Soul Sip / Slow after the grant.
- Pit Wick: paint 1 turn (walkable, LoS open). Convert to Open Pit for 2 turns. Units standing on convert are **not** displaced. Leave during the wick window. Barrier last-writer fills the pit.
- Exit Boon: paint 2 turns. Voluntary **walk** leave refunds 1 current MP. Standing at paint does not. Teleport / swap / shove leave do not. Do not enter.
- Dull Edge: next `physical_attack` deals 0 after RES for 2 turns. Other ids resolve. Don’t Strike; poke from 4.
- Pet Sill: summons cannot **walk** onto the cell. Player body walks freely. Summon Swap/blink landing fizzles. Don’t park the wolf.
- Short Leash: remaining lifespan → `min(remaining, 1)`. Legal only if `isSummon`. Not a kill. Play without pets, or recast after the last turn.
- One Inferno cadence per pack unless a variant explicitly splits targets. Crack Verse’s restored Inferno is the **player’s** id after a public reset — still one cadence, two windows on **their** bar, not a second enemy Inferno.
- No Glass Realm on stacked-DoT, Ignite, Fuse, Tithe, Mute, Act Bell, Cap, Hood, or Wick sheets. No Time Warp on Tithe / Mute / Reel / Hinge / Bell / Wick / Crack windows.
- Summons stay at cap 2 except Triple Span **requires remaining ≥ 3** (do not spawn until that number exists). Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.

---

## Index (this drop + pointer)

Drops 1–8 union lives in [`ENEMY_FORMATIONS_2026-09-25.md`](./ENEMY_FORMATIONS_2026-09-25.md) (this-drop table) plus the drop-7 union. **Do not reuse those ids.** This drop adds:

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-WALL-HUG` | PAIR | hug-gun + planted wall | this drop |
| `FSN-BOOT-STEP` | PAIR | walked poke + current MP gift | this drop |
| `FSN-FACE-WRITE` | PAIR | shove+facing + glance | this drop |
| `FSN-DULL-PET` | PAIR | Strike 0 + summon sill | this drop |
| `FSN-SLIP-PIT` | CELL | knight-slip + delayed pit | this drop |
| `FSN-CRACK-VERSE` | CELL | hostile CD0 + recast lock | this drop |
| `FSN-SHARE-GOAD` | CELL | 50/50 share + taunt | this drop |
| `FSN-WALL-FILE` | BRIGADE | hug + pylon + axis brand | this drop |
| `FSN-BOOT-SPARE` | BRIGADE | walked poke + spare + mute | this drop |
| `FSN-FACE-GLANCE` | BRIGADE | shove-face + glance + oncoming | this drop |
| `FSN-BOON-BOOT` | BRIGADE | exit refund + walked poke + spare | this drop |
| `FSN-PIVOT-WICK` | CADRE | clockwise rotate + wick + rank lock | this drop |
| `FSN-HOOD-CHOIR` | CADRE | tick skip + ignite + absolve | this drop |
| `FSN-WICK-FACE` | CADRE | wick + shove-face + fuse | this drop |
| `FSN-BRAND-REEL` | CADRE | brand + reel + hug-gun | this drop |
| `FSN-TRIPLE-PLUG` | COURT | three-cell plug + lintel + sniper, leader | this drop |

Named Wave 8 packs that live as **variants** (not new ids): Slip Pit + brander → `FSN-SLIP-PIT/BRAND`; Crack Verse + ignite → `FSN-CRACK-VERSE/IGNITE`; Share Goad + cap → `FSN-SHARE-GOAD/CAP`; Dull Sill → `FSN-DULL-PET/LEASH`; Spare Slip → `FSN-BOOT-STEP/SLIP`; Sill Brood → `FSN-DULL-PET/BROOD`.

---

## Formations

### FSN-WALL-HUG

FORMATION_ID: `FSN-WALL-HUG`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-HUG` — `rook` / proposed `wall_stinger` — pack median — back, LoS down a **wide** lane
- `ROLE-PYLON` — `rook` or `bishop` / proposed `pylon_prelate` — pack median + 1 — plants **one** barrier cell the Hug can cash

VARIANT_RULES:

- Band 0: Hug Frost only (no barrier yet → no +10 anyway). Pylon is a body that will plant on band 1. The lesson is “the gun wants you hugging **their** wall, not a world wall.”
- Band 1: Hug Sting is legal **only if** a `barrierTiles` cell is Chebyshev-1 from the player; else Frost. Pylon plants then steps off (VETERAN). Never treat `tiles[y][x] === false` as a barrier.
- Elite: Hug only. Pylon stays junior so two elites cannot 22-every-turn a locked aisle.
- Unlock after `FSN-CAMP-TITHE` **or** `FSN-GLASS-WARD` (player has seen a gun that needs geometry).
- Random 30% family lottery is **off**. No File Brand on PAIR (that is `FSN-WALL-FILE`). No second gun (`post_stinger` / `corner_bishop` / `glass_sniper`).
- Rare Barrier on Hug is **off** on PAIR (Pylon is the mason).

SPELL_POOL_INTERACTIONS:

- Wall Sting 12 / 22 if they hug the planted cell. Step Chebyshev-2 and it is a Frost bishop. Dispel / wait the barrier out.
- Do not also attach Blind Corner (blocked-LoS poke is `FSN-CORNER-FOG`). One geometry gun.

TACTICAL_PLAN:

- Pylon plants on the aisle, then steps off. Hug holds and Stings if the player is adjacent to that cell. If the player never hugs the wall, this is a soft Frost gun — intended.

SYNERGY:

- Hug-gun + planted wall. Wave 8 Wall File minus the brander. You pay the hug **or** you walk around.

PLAYER_THREAT:

- Readable geometry. Fail is hugging their pylon “for one Frost.” Recoverable: step off, kill the wall first.

COUNTERPLAY:

- Stay Chebyshev-2 from every `barrierTiles` cell. Burst the glass Hug (hp ~0.90). Walk a gallery. Do not take the only aisle.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with a 4-tile file **plus** a gallery. Reject a 1-tile tunnel (hug on the only cell is a lock).
- No lava on the planted cell. No Time Warp.

AI_REQUIREMENTS:

- Hug: artillery; skip +10 on open hug; CHAMPION no-world-wall-lie.
- Pylon: summoner / setter; plant then step off; cap 1; fall-through Frost, never skip-lock.
- Soph 1–2.

VARIANTS:

- `FSN-WALL-HUG/BRAND` — BRIGADE: that is `FSN-WALL-FILE`.
- `FSN-WALL-HUG/E-HUG` — elite Hug, still no Brand.

STATUS: PROPOSED

---

### FSN-BOOT-STEP

FORMATION_ID: `FSN-BOOT-STEP`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-BOOT` — `knight` / proposed `boot_stinger` — pack median + 1 — starts wide, **wants** to walk
- `ROLE-SPARE` — `bishop` / proposed `spare_pacer` — pack median — buys the step

VARIANT_RULES:

- Band 0: **do not spawn this id** (Boot +10 needs a walk-spend writer; Spare is band 1). Show `FSN-CAMP-TITHE` instead (the inverse: the gun that wants to **stand**).
- Band 1: Boot Sting is legal **only if** the walk-spend writer exists **and** they spent ≥ 1; else Strike / 12-only. Spare skips at max MP.
- Elite: Boot only. Spare stays junior so two elites cannot 22-every-turn a bought close.
- Unlock after `FSN-CAMP-TITHE` (player has seen the unmoved inverse).
- No Post Stinger on this sheet (PAIR ban). No Haste (duration +2 is Tempo’s cousin — Spare is current-turn only).
- Knight Slip does **not** pay Boot. Do not also attach Slip on PAIR (that is `FSN-BOOT-STEP/SLIP`).

SPELL_POOL_INTERACTIONS:

- Spare Pace +1 current walk MP. Boot Sting 12 / 22 after the paid step. Standing drops the bonus — that is the tell.
- Do not also attach Post Sting (inverse). Do not also attach Stride Hunter (target-moved).

TACTICAL_PLAN:

- Spare grants if the Boot is one short of a dest. Boot walks, then Stings. If Root / Nail Down holds the Boot, Spare holds (no invented nuke).

SYNERGY:

- Walked poke + current MP gift. Wave 8 Boot Spare minus the muter. They buy the step; you force a stand.

PLAYER_THREAT:

- Readable close. Fail is standing in range 3 after they stepped. Recoverable: Root, occupy the dest, stay at 4.

COUNTERPLAY:

- Nail Down / Root the Boot. Occupy the tile they bought. Slow after the grant. Kill the glass Spare (hp ~0.80).

MAP_REQUIREMENTS:

- `openField` or `arena` with a 3-tile approach **plus** a side step. Reject a 1-tile tunnel (bought step into a closet is a lock).
- No ice on both approaches (ice + extra MP is a wasted grant **or** a forced walk into hazard).

AI_REQUIREMENTS:

- Boot: flanker; skip if walk-spend is 0; never count Slip as walk.
- Spare: buffer; skip at max MP; never persist `CharacterStats.mp`.
- Soph 1–2.

VARIANTS:

- `FSN-BOOT-STEP/MUTE` — BRIGADE: that is `FSN-BOOT-SPARE`.
- `FSN-BOOT-STEP/SLIP` — BRIGADE: replace Spare’s mute-less third with `ROLE-SLIP` + optional `ROLE-POST` (named pack Spare Slip). Slip does **not** pay Boot. Post is the stand-gun they can slip **to**, not a second walk-gun PAIR. Never Boot+Post as two bodies.
- `FSN-BOOT-STEP/E-BOOT` — elite Boot, still no Post.

STATUS: PROPOSED

---

### FSN-FACE-WRITE

FORMATION_ID: `FSN-FACE-WRITE`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-FACE` — `knight` / proposed `face_shover` — pack median + 1 — adjacent shove
- `ROLE-GLANCE` — `bishop` / proposed `glance_ward` — pack median — pokes the **new** front

VARIANT_RULES:

- Distinct from `FSN-FACE-PIN` (lock one view, no shove) and `FSN-HINGE-GLANCE` (self-rotate around ally). This sheet **writes** facing by moving the player.
- Band 0: Face Strike only (push caller missing → no rewrite). Glance Frost only.
- Band 1: Shove Face only if dest is free and a walk-off remains. Glance pays +10 only if `currentView` matches the Glance ray **after** the shove. Collision = 0 rewrite → Glance Frosts.
- Elite: Face only. Glance stays junior so two facing elites cannot pin.
- Unlock after `FSN-FACE-PIN` **or** `FSN-HINGE-GLANCE` (player has seen facing as a tell).
- No Bash / Chaplain / Recoil on this sheet (PAIR ban). No Oncoming on PAIR (that is `FSN-FACE-GLANCE`).
- Glance may use Shove Face’s write **without** a battle-walk view writer. Do not also require Oncoming on this id.

SPELL_POOL_INTERACTIONS:

- Shove Face: 0 damage, push 1, write view from that step. Glance Cut: bonus iff they now face the Glance. Stand on the dest and the shove is 0 — Glance never gets a new front.

TACTICAL_PLAN:

- Face Shoves only after the player has a tile behind them. Glance waits for the public rewrite. Never turn-1 shove into a dead-end.

SYNERGY:

- Displacement + new-front poke. Wave 8 Face Glance minus Oncoming. The board turns you; the bishop cashes it.

PLAYER_THREAT:

- Positional. Fail is backing a wall “for one Strike.” Recoverable: occupy the dest, Self Anchor, hug a corner.

COUNTERPLAY:

- Stand on the up-dir wall (push distance 0). Kill the glass Glance (hp ~0.70). Face them before they shove. Player Barrier the dest.

MAP_REQUIREMENTS:

- `arena` or `asymmetric` with **pillars / a wall 2 tiles from typical stand**, plus open floor the other way. Reject `corridorMaze` (shove + glance in a hallway is a lock).
- No lava dest. No Void Rift landing.

AI_REQUIREMENTS:

- Face: flanker; skip 0-slide / hazard dest; write view only on a real cell change.
- Glance: artillery; skip unless facing matches **after** a public rewrite (`AI-TEM-05`-style predicate).
- Soph 1–2.

VARIANTS:

- `FSN-FACE-WRITE/ONCOMING` — BRIGADE: that is `FSN-FACE-GLANCE`.
- `FSN-FACE-WRITE/E-FACE` — elite Face, still no Court Shove on PAIR (CHAMPION witness only, never this grade).

STATUS: PROPOSED

---

### FSN-DULL-PET

FORMATION_ID: `FSN-DULL-PET`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-DULL` — `bishop` / proposed `dull_censor` — pack median — next Strike deals 0
- `ROLE-SILL` — `rook` / proposed `pet_siller` — pack median — summons cannot enter one cell

VARIANT_RULES:

- Distinct from `FSN-NULL-WALL` (Weaken/Expose + golem). Pressure is **Strike is 0** plus **pets cannot park**, not a lockout brand.
- Weight ×2 if the player has a summon spell **equipped** (build, not level). Still valid if they do not — Dull zeros Strike and Sill holds Frost.
- Elite: Dull only. Sill stays junior so two anti-summon elites cannot also Mute Thread.
- Unlock after `FSN-NULL-WALL` **or** after the player has summoned once this run.
- No Null Censor / Oath Censor / Pit Mason on this sheet (PAIR bans). Short Leash is CELL+ (`FSN-DULL-PET/LEASH`).
- Sill skips empty board. If the player brought no pets, this is a softer Dull + Frost rook — fine.

SPELL_POOL_INTERACTIONS:

- Dull Edge: next `physical_attack` deals 0 for 2 turns. Frost / Inferno / Slow still resolve. Wait 2, or poke from 4.
- Pet Sill: player body walks the cell. Summon walk / summon landing fizzles. Do not paint the only tile that reaches Dull.

TACTICAL_PLAN:

- Dull brands when the player is adjacent and will Strike. Sill paints the midpoint the wolf wants. If no pet exists, Sill Frosts.

SYNERGY:

- Anti-melee + anti-summon park. Wave 8 Dull Sill minus the cutter. Combination, not a new sprite.

PLAYER_THREAT:

- Pets bounce; Strike whiffs. Spike is low. Fail is dumping a 4-AP Strike into Dull then parking the wolf on the sill.

COUNTERPLAY:

- Cast Frost / Slow instead. Walk the player body through the sill. Dismiss and recast off the cell. Burst the glass Dull (hp ~0.75).

MAP_REQUIREMENTS:

- `openField` or `fortress` courtyard. Sill needs a cell that is **not** the only approach to Dull.
- No sealed alcove for Dull.

AI_REQUIREMENTS:

- Dull: caster; skip planted casters; never Mute Thread.
- Sill: setter; skip empty board; never paint the only walk-off.
- Soph 1–2.

VARIANTS:

- `FSN-DULL-PET/LEASH` — BRIGADE: add `ROLE-CUT` (`leash_cutter`). Named pack Dull Sill. Remaining life → 1, then they cannot re-park. Still 0 damage. Still not Sever Tether.
- `FSN-DULL-PET/BROOD` — CADRE: replace Dull with `ROLE-SUMMONER` (`brood_chanter`, cap 1) + `ROLE-SPARK` (`spark_chanter`). Named pack Sill Brood. Hostile pets cannot enter; Spark still wants to die on **their** turn. Do not also roll wolf overlay onto Spark. PAIR ban brood+spark is waived **only** because Sill is the third verb.
- `FSN-DULL-PET/E-DULL` — elite Dull, still no Oath.

STATUS: PROPOSED

---

### FSN-SLIP-PIT

FORMATION_ID: `FSN-SLIP-PIT`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-SLIP` — `knight` / proposed `slip_squire` — pack median — (2,1) self teleport
- `ROLE-WICK` — `rook` / proposed `wick_painter` — pack median — origin becomes a pit next turn

VARIANT_RULES:

- Distinct from `FSN-HINGE-WICK` (enter-swap + delayed **damage**) and `FSN-MIST-HUNT` (Chebyshev blink). Slip is knight-shaped; Wick is occupancy convert, not fuse damage.
- CELL: one Slip, one Wick. Wick paints the cell Slip **leaves**, not both galleries.
- Elite: Slip only. Wick stays junior so two delayed-pit elites cannot seal.
- Unlock after `FSN-VAULT-ORIGIN` **or** `FSN-HINGE-WICK` (player has seen a teleport **or** a delayed floor).
- No Mist / Morrow / Blink / Vault / Hinge on this sheet (PAIR ban). No File Brand on CELL (that is `/BRAND`).
- No `isTrap` / `placeBarrier` for Wick. Convert writes `pitTiles`.

SPELL_POOL_INTERACTIONS:

- Knight Slip: dest free, non-void. Walk MP 0 — does **not** pay Boot if a Boot is later added. Wick: walkable now, pit later. Standing on convert is **not** a displace — walk off during the window.
- Do not also attach Open Pit (immediate). Do not also attach Fuse (delayed HP).

TACTICAL_PLAN:

- Wick paints a file cell the player wants. Slip occupies a (2,1) dest **off** that file, then Strikes next turn. Never turn-1 surround. Start ≥ 4 apart.

SYNERGY:

- Teleport + delayed pit. Wave 8 Slip Pit minus the brander. The origin becomes illegal later; the knight is already gone.

PLAYER_THREAT:

- Positional. Fail is chasing the Slip onto the wick. Recoverable: plug the knight ring, leave before convert.

COUNTERPLAY:

- Occupy all eight dests. Claim Ward a dest. Walk off the wick. Far Sting the painter (hp ~0.95). Nail Down does **not** block Slip — Grounded Lock / Claim Ward do.

MAP_REQUIREMENTS:

- `asymmetric` or `chessboard` with a 4-tile file **plus** at least three free (2,1) dests. Reject cramped `corridorMaze` (no knight ring).
- Wick must not be the only cell that leaves the file. No Time Warp.

AI_REQUIREMENTS:

- Slip: flanker; skip if every dest fails; ELITE slip-off-wick.
- Wick: setter; skip if the player already has a far gun at range 4; never paint the only walk-off.
- Soph 2–3.

VARIANTS:

- `FSN-SLIP-PIT/BRAND` — BRIGADE: add `ROLE-BRAND`. Named pack Slip Pit (full). Brand the file they slipped off. Still one Inferno cadence (none). Diagonal is a full answer to Brand.
- `FSN-SLIP-PIT/E-SLIP` — elite Slip, still no Vault wall-ignore.

STATUS: PROPOSED

---

### FSN-CRACK-VERSE

FORMATION_ID: `FSN-CRACK-VERSE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-CRACK` — `bishop` / proposed `cadence_cracker` — pack median — hostile highest CD → 0
- `ROLE-ONCE` — `bishop` / proposed `once_cantor` — pack median — cannot resolve the same id twice

VARIANT_RULES:

- Distinct from `FSN-BREAK-CHOIR` (self last-id → 0 + ignite) and `FSN-CADENCE-MUTE` (steal). This sheet **restores their nuke**, then **bans recasting it**.
- CELL: Crack once/battle. Once Verse 2 turns. No Inferno on either body (that is `/IGNITE` — they restored **yours**).
- Elite: Crack only. Once stays junior so two CD elites cannot also Mute Thread.
- Unlock after `FSN-BREAK-CHOIR` **or** `FSN-CADENCE-MUTE` (player has seen a CD verb).
- No Breaker / Thief / Lender on this sheet (PAIR ban). No Hex Chorister / Verse Scribe (PAIR ban).

SPELL_POOL_INTERACTIONS:

- Cadence Crack: highest remaining ≥ 2 → 0. Once Verse: next spell fizzles if it matches `lastResolvedSpellId`. Readable two-step: they give Inferno back, then Inferno fizzles if you recast it. Alternate Strike and Frost.
- Missing last-id (first spell of the fight) → Once does not fizzle. That is fail-closed, not a lock.

TACTICAL_PLAN:

- Crack fires if the player is holding a 3-turn Inferno. Once brands after a public resolve. If the player sits on a bar of 0s, both Frost — intended.

SYNERGY:

- Hostile CD reset + recast lock. Wave 8 Crack Verse minus Ignite. Tempo exam: dump the nuke **before** they act, or swap ids.

PLAYER_THREAT:

- High if you recast Inferno into the brand. Low if you alternate ids. Not unavoidable: first spell is free; wait 2.

COUNTERPLAY:

- Dump the nuke before Crack. Keep a cheap off-CD tool. Cadence Brand +1 after they crack (player-side). Kill the glass Once (hp ~0.70).

MAP_REQUIREMENTS:

- `openField` or `arena`. Both bishops need LoS **and** a retreat tile.
- No Time Warp (panic + recast lock). No Glass Realm.

AI_REQUIREMENTS:

- Crack: caster; skip empty CD bar; once/battle flag on **this** caster.
- Once: caster; `lastResolvedSpellId` only on `castResult === "cast"`; skip a 3-id toolbox.
- Soph 2–3.

VARIANTS:

- `FSN-CRACK-VERSE/IGNITE` — BRIGADE: add `ROLE-IGNITE` (`ignite_alchemist`). Named pack Crack Verse (full). They restore **your** Inferno, then ban recast, while the alchemist holds **one** enemy Inferno cadence (different id, 3-turn). Do not also Inferno from Crack.
- `FSN-CRACK-VERSE/E-CRACK` — elite Crack, lookahead to a public remaining ≥ 2.

STATUS: PROPOSED

---

### FSN-SHARE-GOAD

FORMATION_ID: `FSN-SHARE-GOAD`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-SHARE` — `rook` / proposed `share_warden` — pack median + 1 — next hit 50/50 with adjacent ally
- `ROLE-GOAD` — `king` or `pawn` / proposed `goad_herald` — pack median — forced swing is the split one

VARIANT_RULES:

- Distinct from `FSN-VEIL-GOAD` (untargetable + taunt) and `FSN-BRAND-COVER` (whole-hit redirect). Share is a **split**, not a miss and not a full redirect.
- CELL: Share only if a living ally is Chebyshev-1. Goad only if a legal Strike exists (not into lava / pit / 0-HP).
- Elite: Share only. Goad stays junior so two soak elites cannot also Cap.
- Unlock after `FSN-VEIL-GOAD` **or** `FSN-PINCH-GOAD` (player has seen a taunt).
- No Cover / Pain / Twin Tether / Leash Warden on this sheet (PAIR ban). Turn Cap is BRIGADE (`/CAP`).
- DoT ticks do **not** split. AoE that hits both: first split, second full.

SPELL_POOL_INTERACTIONS:

- Flank Share after RES: ceil(applied * 0.5) on Share, remainder on Goad. Missing ally at **hit** time → full hit, charge gone. Goad forces the swing they want to split.
- Iron Skin on Share is RES, not a second split.

TACTICAL_PLAN:

- Share stands adjacent to Goad and Shares. Goad taunts. If the player separates them, Share Frosts / Strikes (charge would waste).

SYNERGY:

- Protector + taunt. Wave 8 Share Goad minus Cap. Forced swing hits the sponge pair; peel the neighbor and the charge dumps.

PLAYER_THREAT:

- Long, structured. Spike is low. Fail is Inferno into a fresh Share next to Goad.

COUNTERPLAY:

- Kill the adjacent ally first. Separate them (Attract / Swap / walk around). DoT the Share (ticks do not split). Snipe the glass Goad.

MAP_REQUIREMENTS:

- `openField` or `arena` with space to peel. Reject a 1-tile tunnel (forced melee into Share is a lock).
- ≥ 2 walk-offs from the Share tile.

AI_REQUIREMENTS:

- Share: holder; skip no adjacent ally; CHAMPION consume-on-missed-ally.
- Goad: charger; legal-target rewrite (existing Goad contract from drop 6/8).
- Soph 2–3.

VARIANTS:

- `FSN-SHARE-GOAD/CAP` — BRIGADE: add `ROLE-CAP` (`cap_warder`) as the adjacent sponge. Named pack Share Goad (full). Forced swing splits, then the ally’s half caps at 12. Still one Cap charge. DoT ticks still do not consume Cap **or** Share.
- `FSN-SHARE-GOAD/E-SHARE` — elite Share, still no Cover redirect.

STATUS: PROPOSED

---

### FSN-WALL-FILE

FORMATION_ID: `FSN-WALL-FILE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-HUG` — `rook` / proposed `wall_stinger` — pack median
- `ROLE-PYLON` — `rook` / proposed `pylon_prelate` — pack median + 1 — `isLeader` optional (see variants)
- `ROLE-BRAND` — `bishop` / proposed `file_brander` — pack median — XOR-axis rider

VARIANT_RULES:

- Unlock after `FSN-WALL-HUG`. Wave 8 “Wall File.”
- Elite: Hug only. Pylon and Brand stay junior. Leader-boost is the escalation, not three elites.
- Brand only if they share exactly one axis. Hug only if they hug the planted wall. Plant then brand then sting is the readable three-step — never same AP bar on one body.
- No Rank Lock (that is `FSN-PIVOT-WICK`). No second gun. No File Reel on this sheet (that is `FSN-BRAND-REEL`).
- Rare: Hug Barrier **only if** Pylon is dead / absent. PAIR of Hug+Barrier without Pylon is off (mason is the plant).

SPELL_POOL_INTERACTIONS:

- Pylon plants. Brand +10 on the file. Hug +10 on the hug. Step off-axis **or** Chebyshev-2 from the wall. Diagonal is a full answer to Brand; open field is a full answer to Hug.
- One `hitsMultiple` source: none on BASE. Do not add `starter-blast`.

TACTICAL_PLAN:

- Turn 1–2: Pylon plants on the aisle. Brand Marks / Brands the file. Hug waits for a public hug. If the player never enters, this is a softer `FSN-WALL-HUG` plus a Frost bishop — fine.

SYNERGY:

- Plant the wall, cash the hug, then brand the file. Three Wave 8 / Wave 3 verbs, one aisle.

PLAYER_THREAT:

- High if you hug the file. Low if you never do. Fail is greed on the aisle after you already learned PAIR.

COUNTERPLAY:

- Leave the rank **or** the file. Step Chebyshev-2 from the wall. Burst Brand (hp ~0.75). Peel the Pylon-leader early if boost is on.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with a 4-tile file **and** two galleries. Reject maps with no 4-tile file (reroll).
- Planted cell must not be the only walk-off.

AI_REQUIREMENTS:

- Hug: skip open hug; ELITE wait-for-plant.
- Pylon: plant then step off; optional `isLeader`.
- Brand: skip diagonal; `linear: false` honesty.
- Soph 3–4. `groupTactics` at 4: one focus. Blackboard: `ownedFile` + `plantedBarrier`.

VARIANTS:

- `FSN-WALL-FILE/NO-LEADER` — teaching BRIGADE without boost.
- `FSN-WALL-FILE/NO-BRAND` — fallback to `FSN-WALL-HUG` if XOR-axis is not ready.

STATUS: PROPOSED

---

### FSN-BOOT-SPARE

FORMATION_ID: `FSN-BOOT-SPARE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-BOOT` — `knight` / proposed `boot_stinger` — pack median + 1
- `ROLE-SPARE` — `bishop` / proposed `spare_pacer` — pack median
- `ROLE-MUTER` — `bishop` / proposed `gait_muter` — pack median — walk-fizzle on the **player** after they spend to answer

VARIANT_RULES:

- Unlock after `FSN-BOOT-STEP`. Wave 8 “Boot Spare.”
- Elite: Boot only. Spare and Muter stay junior.
- Muter is the **one** rare. Do not also attach Rank Lock / Root / Exit Tithe (three walk stories). Dual Slow still capped at −2; Muter is a fizzle, not an MP tax.
- No Post Stinger. No Tempo Precentor (PAIR ban vs Spare).
- Walk-spend writer still required; else **do not spawn this id**.

SPELL_POOL_INTERACTIONS:

- Spare buys the Boot’s step. Boot Stings. Muter fizzles the player’s **next walk** (existing Gait Mute contract from drop 7) so chasing the Boot costs the spell, not a root. Spells stay legal.
- Ice / Rank Lock so the extra MP cannot be spent is a **counter**, not a member.

TACTICAL_PLAN:

- Spare grants. Boot walks and Stings. Muter brands after the player spends MP toward the Boot. Never turn-1 triple on one tile.

SYNERGY:

- Buy the step, sting, mute their walk back. Inverse of `FSN-CAMP-TITHE` (stand-gun + leave tax).

PLAYER_THREAT:

- Tempo. Fail is sprinting after the Boot through Mute. Recoverable: stay, Frost, kill Spare.

COUNTERPLAY:

- Don’t chase. Root the Boot before Spare. Kill Muter (glass). Soul Sip the spare. Stay at range 4.

MAP_REQUIREMENTS:

- `openField` or `arena`. Muter needs LoS. Boot needs a flank that is not the only exit.
- No Time Warp. No ice on both approaches.

AI_REQUIREMENTS:

- Same Boot / Spare as `FSN-BOOT-STEP`.
- Muter: caster; skip recast of an active mute (`AI-TEM-04`).
- Soph 3–4. Blackboard: `plannedStepDest` so Boot and Muter agree.

VARIANTS:

- `FSN-BOOT-SPARE/NO-MUTE` — fallback to `FSN-BOOT-STEP`.
- `FSN-BOOT-SPARE/E-BOOT` — elite Boot, still no Post.

STATUS: PROPOSED

---

### FSN-FACE-GLANCE

FORMATION_ID: `FSN-FACE-GLANCE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-FACE` — `knight` / proposed `face_shover` — pack median + 1
- `ROLE-GLANCE` — `bishop` / proposed `glance_ward` — pack median
- `ROLE-ONCOMING` — `knight` / proposed `oncoming_knight` — pack median — bonus iff they walk the **new** front

VARIANT_RULES:

- Unlock after `FSN-FACE-WRITE`. Wave 8 “Face Glance.”
- Elite: Face only. Glance and Oncoming stay junior so two facing elites cannot pin.
- Oncoming +10 still needs a battle-walk `currentView` writer. Until that lands: Oncoming Frost / Strike only (no +10). Glance may still cash Shove Face’s write.
- No lurker / pincer with Oncoming (drop 7 law). No Bash / Chaplain PAIR.
- Court Shove stays CHAMPION witness on Face, **not** this grade.

SPELL_POOL_INTERACTIONS:

- Shove writes facing. Glance cashes the new front. Oncoming cashes a **walk** into that front. Two tells, one rewrite. Collision = neither bonus.
- Do not also attach Facing Pin (lock) — write-then-poke is the identity.

TACTICAL_PLAN:

- Face Shoves toward Glance’s ray, not into a dead-end. Glance waits. Oncoming paths the new front and refuses a walk that would not pay (VETERAN).
- Never turn-1 surround. Start ≥ 4 apart.

SYNERGY:

- Write facing, then Glance / Oncoming the new front. Displacement sets up two readable guns, not a stun.

PLAYER_THREAT:

- Positional and tempo. Fail is backing a wall then walking the new front. Recoverable: occupy dest, don’t walk at them.

COUNTERPLAY:

- Occupy the shove dest. Don’t walk Oncoming’s file after the rewrite. Kill Glance. Diagonal-only stance vs Oncoming’s file.

MAP_REQUIREMENTS:

- `arena` or `asymmetric` with a wall **and** a gallery. Reject `corridorMaze`.
- ≥ 2 walk-offs after a shove.

AI_REQUIREMENTS:

- Face: skip 0-slide / hazard dest.
- Glance: skip unless facing matches after a public rewrite.
- Oncoming: skip +10 unless battle-walk view exists **or** they walked the new front; never lurker-path.
- Soph 3–4. Blackboard: `writtenView` so Glance and Oncoming do not require two rewrites.

VARIANTS:

- `FSN-FACE-GLANCE/NO-ONCOMING` — fallback to `FSN-FACE-WRITE` if walk-view is missing.
- `FSN-FACE-GLANCE/E-FACE` — elite Face, still no Court Shove at BRIGADE.

STATUS: PROPOSED

---

### FSN-BOON-BOOT

FORMATION_ID: `FSN-BOON-BOOT`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-BOON` — `bishop` / proposed `boon_mason` — pack median — walk-exit MP refund
- `ROLE-BOOT` — `knight` / proposed `boot_stinger` — pack median + 1
- `ROLE-SPARE` — `bishop` / proposed `spare_pacer` — pack median — optional if Boon already refunded; see variants

VARIANT_RULES:

- Unlock after `FSN-BOOT-STEP` **and** `FSN-CAMP-TITHE` (player has seen refund’s inverse: Exit Tithe). Wave 8 “Boon Boot.”
- Elite: Boot only. Boon and Spare stay junior.
- Boon never paints under an Exit Tithe last-writer (last paint wins — do not stack). No Tax / Origin / Glyph on this sheet (PAIR ban).
- Spare is the **one** extra current-MP engine. If Spare is present, Boon paints **their** kiting cell, not a second refund on the Boot’s dest.
- Walk-spend writer still required (Boot). Teleport / swap / shove leave do **not** refund.

SPELL_POOL_INTERACTIONS:

- Exit Boon: leave-by-walk refunds 1 MP. Spare: +1 now. Boot: sting after the paid step. Standing at paint does not refund. Re-enter and leave again in the same turn **does** — do not also attach Tithe on that cell.
- Frozen still charged the step (net −(cost−1)). That is honest, not a lock.

TACTICAL_PLAN:

- Boon paints a cell the Boot wants to leave after the sting. Spare grants if the Boot is still short. Boot walks, Stings, walks off the boon for the refund. If the player never enters the cell, this is a softer `FSN-BOOT-STEP` — fine.

SYNERGY:

- Refund the leave, sting after the paid step. Inverse of Post Tithe (camp + leave tax).

PLAYER_THREAT:

- Tempo kite. Fail is stepping on the boon to chase. Recoverable: don’t enter; Tithe-overwrite if you own that paint.

COUNTERPLAY:

- Don’t step on it. Soul Sip after the refund. Root the Boot. Kill glass Boon (hp ~0.85). Occupy the sting dest.

MAP_REQUIREMENTS:

- `openField` or `arena` with ≥ 8 free floor cells. Reject `corridorMaze`.
- Boon cell must not dump into a pit. No Time Warp.

AI_REQUIREMENTS:

- Boon: setter; skip-into-pit; CHAMPION walk-only refund.
- Boot / Spare: same as `FSN-BOOT-STEP`. ELITE Spare: buy-for-boot.
- Soph 3–4.

VARIANTS:

- `FSN-BOON-BOOT/NO-SPARE` — Boon + Boot only (if two current-MP engines feel redundant). Still BRIGADE (three verbs: paint, walk, sting).
- `FSN-BOON-BOOT/E-BOOT` — elite Boot, still no Tithe overwrite from this pack.

STATUS: PROPOSED

---

### FSN-PIVOT-WICK

FORMATION_ID: `FSN-PIVOT-WICK`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-PIVOT` — `bishop` / proposed `pivot_ward` — pack median — clockwise rotate of the **target**
- `ROLE-WICK` — `rook` / proposed `wick_painter` — pack median — dest becomes a pit next turn
- `ROLE-LOCK` — `bishop` / proposed `axis_locksmith` — pack median — they cannot walk off the file

VARIANT_RULES:

- Unlock after `FSN-SLIP-PIT` **and** `FSN-HINGE-GLANCE` (player has seen delayed floor **and** a rotate). Wave 8 “Pivot Wick.”
- Elite: Pivot only. Wick and Lock stay junior so two rotate elites cannot pin.
- Pivot dest must be free, not lava / pit **this** turn (wick converts **next**). Lock is Rank Lock / axis walk constraint (existing drop 4 contract) — spells stay legal. Never Root + Rank Lock + Wick convert on the same AP bar.
- No Hinge Squire / Broker / Hook Chaplain (PAIR ban). No File Brand as a fourth body (optional rare on Pivot only if Brand is absent).
- Do not ship until occupancy teleport of the **target** exists. Hinge Step (self around ally) is not this card.

SPELL_POOL_INTERACTIONS:

- Pivot Foe: clockwise dest. Pit Wick: dest is walkable now, pit later. Rank Lock: walk off the file fizzles; casts from the file remain. Leave during the wick window **along the file** if Lock has not landed, or wait convert and path a gallery.
- Mark on the dest cell is the telegraph. Player can occupy the dest (Pivot fizzles).

TACTICAL_PLAN:

- Wick paints a cell clockwise of typical stand. Pivot only if dest improves file / hazard **and** a walk-off after convert exists (gallery). Lock brands the file after landing. Never turn-1 triple.

SYNERGY:

- Clockwise onto the wick; they cannot walk off the file. Three verbs, one dest. Combination, not a new monster.

PLAYER_THREAT:

- High if you stand so the only clockwise dest is the wick **and** you dump MP. Still a gallery. Fail is hugging the Pivot on a file with no corner.

COUNTERPLAY:

- Hug a corner (clockwise dest is a wall). Occupy the dest. Wait convert off-file via gallery. Kill glass Pivot (hp ~0.80). Self Anchor.

MAP_REQUIREMENTS:

- `chessboard` or `fortress` with a 4-tile file **and** a gallery. Reject a 1-tile tunnel (pivot + lock + pit is a hardlock).
- Clockwise dest must leave ≥ 1 escape after convert (gallery tile, not the pit).

AI_REQUIREMENTS:

- Pivot: skip blocked / worse dest; `pivotClockwise: true` honesty.
- Wick: paint the planned dest only if an exit after convert exists.
- Lock: skip recast; spells remain legal.
- Soph 4–6. `groupTactics` on. Blackboard: `plannedPivotDest`.

VARIANTS:

- `FSN-PIVOT-WICK/NO-LOCK` — BRIGADE-shaped CADRE if Rank Lock is not ready.
- `FSN-PIVOT-WICK/E-PIVOT` — elite Pivot, still no Broker swap.

STATUS: PROPOSED

---

### FSN-HOOD-CHOIR

FORMATION_ID: `FSN-HOOD-CHOIR`  
RELATIVE_DIFFICULTY: CADRE (kit band 2 for Inferno, else skip this id)  
ENEMIES:

- `ROLE-HOOD` — `bishop` / proposed `hood_lurker` — pack median — skip the fat tick
- `ROLE-IGNITE` — `knight` or `pawn` / proposed `ignite_alchemist` — pack median — Inferno cadence
- `ROLE-ABSOLVER` — `queen` **without** `starter-heal` / proposed `ash_absolver` — pack median — strip leftover stacks

VARIANT_RULES:

- Unlock after `FSN-ASH-COURT` **or** `FSN-EMBER-MEND` (player has seen Inferno + a strip/heal). Wave 8 “Hood Choir.”
- Elite: Hood only. Ignite and Absolver stay junior.
- Inferno lives on the **alchemist**, 3-turn cooldown, one cadence. Hood skips the next DoT tick **on self** (the lurker), then Absolve leftover stacks **on the player** if a public DoT remains — not a double Inferno.
- No Sidestep / Cap PAIR. No Glass Realm. No second DoT source on Hood’s ADVANCED poison **and** Ignite the same AP bar.
- Absolver: Absolve only (strip). **No** Blood Mend (healAmount would steal healer and collapse the choir). If Absolve apply is missing, Absolver Frosts and the sheet is a softer skip + burn.

SPELL_POOL_INTERACTIONS:

- Tick Hood: next DoT tick on Hood deals 0. Player Inferno into Hood while Hood is up is the bait. Ignite Inferno on the **player** is the pack’s burn. Absolve strips leftover stacks after the skip window — wait 2 or apply **after** the skip.
- Hits do not consume Hood. Lava/spikes do not consume Hood.

TACTICAL_PLAN:

- Hood Hoods if a DoT is present (including a poison they applied last turn). Ignite holds Inferno until LoS and the player is not on a walk-hazard. Absolver strips after a public tick, else Frosts.
- If Hood dies, remaining pair is Ignite + strip — intended.

SYNERGY:

- Skip the fat tick, then strip leftover stacks. Wave 3 Absolve Race minus Plate, plus a tick-skip. You waste Inferno on Hood **or** you wait.

PLAYER_THREAT:

- High if you Inferno Hood during Hood. Low if you hit (does not consume) or wait. Interruptible: kill Hood (hp ~0.65), wait 2.

COUNTERPLAY:

- Don’t Inferno them while Hood is up. Poison **after** the skip. Cursed Wound does not interact with Hood (not healRecv). Burst Hood. Frost Ignite’s MP.

MAP_REQUIREMENTS:

- `ruinsIslands` or `asymmetric` with two approaches. One may be warm flavor; one must be clean. Reject lava-painted engagement + Inferno (double hazard that is **not** a DoT tick — CHAMPION Hood must not lie).
- ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Hood: skip empty DoT list; CHAMPION no-lava-lie.
- Ignite: flanker; **not** berserk; one Inferno cadence.
- Absolver: caster (heal-less); skip recast Absolve.
- Soph 4–6. Pack blackboard: only one Inferno **cast** this round.

VARIANTS:

- `FSN-HOOD-CHOIR/NO-ABSOLVE` — Hood + Ignite only if Absolve apply is missing.
- `FSN-HOOD-CHOIR/E-HOOD` — elite Hood, skip-then-strip.

STATUS: PROPOSED

---

### FSN-WICK-FACE

FORMATION_ID: `FSN-WICK-FACE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-WICK` — `rook` / proposed `wick_painter` — pack median
- `ROLE-FACE` — `knight` / proposed `face_shover` — pack median — shove onto the wick **before** convert
- `ROLE-FUSE` — `pawn` / proposed `fuse_binder` — pack median − 1 — delayed **damage** on a **different** cell

VARIANT_RULES:

- Unlock after `FSN-SLIP-PIT` **and** `FSN-FACE-WRITE`. Wave 8 “Wick Face.” PAIR of Wick+Fuse is **banned**; CADRE with Face as the third verb is the lesson (shove onto wick **or** fuse, never both dests on one tile).
- Elite: Face only. Wick and Fuse stay junior so two delayed-floor elites cannot seal.
- Wick convert is occupancy (`pitTiles`). Fuse is delayed HP, still walkable. **Never** shove onto lava. Prefer landing **on the wick** if a walk-off **before convert** remains — that is the identity, not a lock.
- No Pit Mason. No Hinge Tile. Martyr stays off (that is `FSN-HOOK-FUSE`).
- Kamikaze: Fuse is **not** a bomber. Do not set `aiStrategy: "berserk"`.

SPELL_POOL_INTERACTIONS:

- Shove Face onto the wick. Wick converts next turn. Fuse ticks on a **flank** cell, never the only walk-off and never the same cell as Wick. Dest hazard must tick (wick is still floor until convert — shove dest is legal).
- Collision = 0 facing rewrite and 0 shove — Glance is not on this sheet.

TACTICAL_PLAN:

- Wick paints. Face Shoves only if dest is the wick **and** a gallery exit exists before convert. Fuse walks a flank and plants away from the last exit.
- If Face dies, remaining pair is a delayed pit + delayed chip — intended, and still not a PAIR spawn of Wick+Fuse alone (Face must have been present at battle start; if Face is skipped at spawn, **reroll** this id).

SYNERGY:

- Shove onto the wick / fuse before convert. Displacement sets up a readable timer, not a stun.

PLAYER_THREAT:

- Positional. Fail is standing on the wick after a shove with no gallery. Recoverable: occupy dest, leave during the window, hug Face (minRange analog: adjacent shove may still push — stand so dest is a wall).

COUNTERPLAY:

- Occupy the dest. Leave before convert. Kill glass Fuse (hp ~0.70). Don’t clump with a wisp on the fuse cell.

MAP_REQUIREMENTS:

- `arena` or `ruinsIslands` with two bridges / two approaches. One may be warm flavor; one must be clean.
- Wick 3×3 of walk-offs must not all convert (only one cell is painted). Fuse cell ≠ wick cell.

AI_REQUIREMENTS:

- Wick: paint melee approach; ELITE Face-partner.
- Face: skip 0-slide / hazard dest; dest scoring prefers wick if an exit remains.
- Fuse: setter; never plant the last exit; never the wick cell.
- Soph 4–6. Blackboard: `plannedLanding` so Face and Wick agree; Fuse uses a **otherCell**.

VARIANTS:

- `FSN-WICK-FACE/NO-FUSE` — BRIGADE-shaped CADRE: Wick + Face only (if delayed-damage fuse is not ready). Then this is `FSN-FACE-WRITE` plus a timer — still distinct.
- `FSN-WICK-FACE/E-FACE` — elite Face, still no lava dest.

STATUS: PROPOSED

---

### FSN-BRAND-REEL

FORMATION_ID: `FSN-BRAND-REEL`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-BRAND` — `bishop` / proposed `file_brander` — pack median
- `ROLE-REEL` — `rook` / proposed `file_reeler` — pack median + 1 — `isLeader` optional
- `ROLE-HUG` — `rook` / proposed `wall_stinger` — pack median — hug-sting after they land on the file

VARIANT_RULES:

- Unlock after `FSN-WALL-FILE` **and** `FSN-REEL-TITHE` (player has seen plant-hug-brand **and** file pull). Wave 8 “Brand Reel.” PAIR of Brand+Reel is **banned**; CADRE with Hug is the lesson.
- Elite: Reel-leader only. Brand and Hug stay junior.
- Reel: shared rank **or** file; pull 1 via `applyAttract`; dest must leave a walk-off; 0 damage. Brand: XOR after they land. Hug: +10 only if a barrier exists — **optional** Pylon is off this sheet (one multi-cell/post cap: none). Hug Frosts if no barrier; a world wall is **not** a barrier. Teaching honesty: Hug is a file gun waiting for a **player Barrier** or a leftover Pylon from a prior fight — BASE Hug Frosts unless Brand’s Mark cell is also a planted barrier. Prefer: Hug uses Frost on BASE; `/PYLON` COURT adds the plant.
- No Rank Lock (Pivot Wick). No second attract engine.

SPELL_POOL_INTERACTIONS:

- File Reel onto the file. File Brand +10. Wall Sting +10 only with a real `barrierTiles` hug. Diagonal is a full answer to Reel **and** Brand. Hug the caster (Chebyshev 0) and Brand never fires.
- Confirm attract caller before shipping (same gate as `FSN-REEL-TITHE`).

TACTICAL_PLAN:

- Reel pulls only if dest is on-file, free, not pit, walk-off remains. Brand Brands after landing. Hug Frosts unless a barrier hug exists.
- If Reel dies, boost lands on glass — intended. Remaining pair is Brand + Hug Frost — a softer `FSN-WALL-HUG` without a plant.

SYNERGY:

- Pull onto the file, brand, hug-sting the wall. Three axis verbs, one file. Combination of Wave 7 Reel with Wave 8 Brand / Hug.

PLAYER_THREAT:

- High if you share the rank. Low if you stand diagonal. Fail is greed on the file after `FSN-REEL-TITHE`.

COUNTERPLAY:

- Diagonal. Occupy the landing. Gallery. Swap the Reeler. Sit adjacent to Brand. Kill the leader down a gallery.

MAP_REQUIREMENTS:

- `chessboard` or `fortress` with a 4-tile file **plus** a file the player can take. Never a closed ring.
- Reel dest must not be the only walk-off.

AI_REQUIREMENTS:

- Reel: skip diagonal / safer dest / no walk-off; optional `isLeader`.
- Brand: skip unless exactly one axis after landing.
- Hug: skip +10 without `barrierTiles`.
- Soph 4–6. Blackboard: `ownedFile` + `plannedLanding`.

VARIANTS:

- `FSN-BRAND-REEL/PYLON` — COURT: add Pylon (then Hug cashes). Cap 1. Do not also Triple Span.
- `FSN-BRAND-REEL/NO-HUG` — BRIGADE-shaped CADRE: Reel + Brand only if the run cannot support three backliners — **do not spawn** as PAIR; this variant still needs a third body (pawn charger, no extra spells) so the PAIR ban holds.

STATUS: PROPOSED

---

### FSN-TRIPLE-PLUG

FORMATION_ID: `FSN-TRIPLE-PLUG`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-TRIPLE` — `rook` / proposed `triple_span` — pack median + 1 — `isLeader` — three-cell occupy
- `ROLE-LINTEL` — `rook` / proposed `lintel_mason` — pack median — healthy bodies cannot bypass
- `ROLE-SNIPER` — `bishop` / proposed `glass_sniper` — pack median — Frost; Mark is the **one** elite rare
- Optional fourth: omit — dungeon depth may not add a fifth hostile to this id

VARIANT_RULES:

- Unlock after `FSN-TWIN-PLUG` **and** a leader-boost CADRE. Wave 8 “Triple Plug.”
- **Skip spawn** if remaining `ENEMY_SUMMON_CAP` < 3. Live cap is 2 — this id does **not** ship until that number exists. Show `FSN-TWIN-PLUG` instead.
- One elite only: the Triple-leader. Lintel and Sniper stay junior so boost is the late scare, not three elites.
- Triple cap 3 posts, lifespan 4, empty kit, `summonAI: "triplespan"`. Do not also roll wolf/archer/pylon/turret/font/bait/span/twinspan/spark. Kill one post: remaining two use Twin Span’s adjacent-pair rule.
- Lintel: existing low-lintel / healthy-bypass deny (drop 7 contract). Sniper Mark is optional and never combined with Inferno or `starter-blast` on this sheet.
- InstantKill / betrayal stay off. `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Triple walks to the gallery, not through the player.
- Closet with no cardinal 3-line plus adjacent free cells → **reroll**.

SPELL_POOL_INTERACTIONS:

- Three 1-HP posts plug a file. Lintel denies healthy bypass (walk around at full HP costs the lintel tax / fizzle — existing honesty). Sniper Frosts / Marks a step-off cell **off** the plug.
- Posts do not Strike. Targeting either cell hits that post. AoE both/all. Far Sting over the plug is fair.
- `spell-rallying-cry` stays false.

TACTICAL_PLAN:

- Turn 1–2: Triple plants across the only bypass if three cardinal cells are free. Lintel paints the gallery neck. Sniper holds minRange 3.
- If a post dies, the chain becomes two; the lane opens; Triple may retreat (`escapeRoute`) rather than suddenly one-shot.
- Leader boost 10% × fallen escort. Cut the leader early or accept a longer finish.

SYNERGY:

- Three-cell plug + healthy bodies cannot bypass + min-range gun. Court-scale geometry. Sophistication and a cap raise are the unlock, not a new monster.

PLAYER_THREAT:

- Highest occupancy-structured threat in this drop. Still turn-based. Failure is walking the 3-line at full HP into Lintel. Posts are glass.

COUNTERPLAY:

- Snipe a post (1 HP). Open Pit a required step. Walk the gallery if Lintel is down. Burst the Sniper (hp ~0.60). Kill the leader down a gallery.
- Player Chain Lightning into the posts is fair — empty-kit posts still occupy.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with a 4-tile file **plus** a file the player can take. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Placement ring: ≥ 3 cardinal free cells, none void. Player must have a tile off the 3-line.

AI_REQUIREMENTS:

- Triple owner: summoner + proposed cap/cooldown fall-through (Iron Skin or Strike, never skip-lock). New summon AI `triplespan` — do not reuse twinspan / bomber / `name.includes("span")`.
- Lintel: setter; never lintel the only gallery if that seals (always leave one bypass **or** a post-kill answer).
- Sniper: minRange 3 + Mark hygiene.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Triple.
- Proposed: escorts do not path a closed box.

VARIANTS:

- `FSN-TRIPLE-PLUG/LANE` — CADRE: Triple + Lintel only (ship if Sniper Mark is not ready **and** cap ≥ 3).
- `FSN-TRIPLE-PLUG/TWIN` — if cap remaining is 2: **do not spawn this id**; composer must emit `FSN-TWIN-PLUG` instead.
- `FSN-TRIPLE-PLUG/NO-MARK` — Sniper Frost only.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–8 still stand. This drop **meshes**; it does not replace.

```
PAIR:    WALL-HUG           BOOT-STEP           FACE-WRITE          DULL-PET
              \                 |                    |                    /
CELL:     (Wall File teach) SLIP-PIT         CRACK-VERSE         SHARE-GOAD
              \                 |                    |                    /
BRIGADE:  WALL-FILE        BOOT-SPARE        FACE-GLANCE         BOON-BOOT
              \                 |                    |                    /
CADRE:    PIVOT-WICK       HOOD-CHOIR     WICK-FACE     BRAND-REEL     (DULL-PET/BROOD)
              \                 |                    |                    /
COURT:                         TRIPLE-PLUG
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-WALL-HUG` | `FSN-CAMP-TITHE` **or** `FSN-GLASS-WARD` |
| `FSN-BOOT-STEP` | `FSN-CAMP-TITHE` (unmoved inverse) |
| `FSN-FACE-WRITE` | `FSN-FACE-PIN` **or** `FSN-HINGE-GLANCE` |
| `FSN-DULL-PET` | `FSN-NULL-WALL` **or** a summon this run |
| `FSN-SLIP-PIT` | `FSN-VAULT-ORIGIN` **or** `FSN-HINGE-WICK` |
| `FSN-CRACK-VERSE` | `FSN-BREAK-CHOIR` **or** `FSN-CADENCE-MUTE` |
| `FSN-SHARE-GOAD` | `FSN-VEIL-GOAD` **or** `FSN-PINCH-GOAD` |
| `FSN-WALL-FILE` | `FSN-WALL-HUG` |
| `FSN-BOOT-SPARE` | `FSN-BOOT-STEP` |
| `FSN-FACE-GLANCE` | `FSN-FACE-WRITE` |
| `FSN-BOON-BOOT` | `FSN-BOOT-STEP` + `FSN-CAMP-TITHE` |
| `FSN-PIVOT-WICK` | `FSN-SLIP-PIT` + `FSN-HINGE-GLANCE` |
| `FSN-HOOD-CHOIR` | `FSN-ASH-COURT` **or** `FSN-EMBER-MEND` |
| `FSN-WICK-FACE` | `FSN-SLIP-PIT` + `FSN-FACE-WRITE` |
| `FSN-BRAND-REEL` | `FSN-WALL-FILE` + `FSN-REEL-TITHE` |
| `FSN-TRIPLE-PLUG` | `FSN-TWIN-PLUG` + a leader CADRE **and** remaining summon cap ≥ 3 |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 9 packs and leftover spell verbs (not this drop)

Sibling [`docs/automation/SPELL_PROPOSALS_2026-09-25.md`](../automation/SPELL_PROPOSALS_2026-09-25.md) (open as PR #563) stamped Wave 8 verbs that **still have no family**. Elite-evolution Wave 8 left those for Wave 9. This catalog does **not** mint `FSN-*` ids that require Wave 8 verbs.

SDE Wave 7 unique CORE (`spell-even-stride` … `spell-file-fold`) stay G≥6 extras on older families until a dedicated Wave 9 family pass exists.

Do **not** pack `triple_span` until `ENEMY_SUMMON_CAP` remaining ≥ 3. Do **not** pack `act_sexton` with `bell_sexton` as a teaching pair. `FSN-BELL-CUT` stays the delayed-execute lesson; `FSN-ACT-GIFT` stays the turn-start 14 lesson; `FSN-CRACK-VERSE` stays restore-then-ban.

Must Pace / Court Shove stay boss / closed-class. Court Shove may witness on CHAMPION `face_shover` only.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–8, plus Wave 8 verbs in this order (from elite-evolution Wave 8 §8):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920).
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974). Stop writing `res`/`sp` as 0.05–0.75 (`spawnPolicy.ts` 69–128 / 270–271).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse. Hug / Brand / Boot / Face / Slip / Pivot / Crack / Once / Hood / Share / Spare / Wick / Boon / Dull / Sill / Cut **must not** carry `starter-heal`.
4. **Battle-walk walk-MP spent writer** — hard gate for every Boot Sting sheet. Forced-move / Swap / Slip / Pivot / Shove **does not** increment. Missing field fail closed (12 only). Same integer Post Sting needs.
5. **Shove Face `applyPushback` caller + facing write** from this push only (WX 6928–6931 mapping). Collision = 0 rewrite. **Battle-walk `currentView` writer** still required for Oncoming escorts (`FSN-FACE-GLANCE`). Glance after shove may use the push write.
6. Ally buff apply (`targetId` on Shield / Iron Skin / Spare Pace). Flank Share split **after** RES in the incoming-hit pipeline — do not rewrite `computeDamage` percents. Remainder through `recordChallengeDamageTaken` if the ally is the player.
7. Knight Slip occupancy teleport (eight (2,1) dests, dest-is-wall fails). Pivot Foe occupancy teleport of the **target** (clockwise only). Dest legality (not lava / pit / fuse / sealed aisle).
8. Pit Wick delayed convert to `pitTiles` (not `barrierTiles`, not `isTrap` / `placeBarrier`). Units on convert are not displaced. Exit Boon leave hook shared with Exit Tithe’s walk-exit predicate (refund vs tax).
9. Triple Span `summonAI: "triplespan"` allow-list (admin + `inferSummonArchetype` key, never `name.includes("span")`) + summoner fall-through + 4-adj chain walk filter + skip if remaining cap < 3. Posts are not `countsTowardKillRewards`.
10. Cadence Crack once/battle hostile highest remaining → 0 (never copy, never reset Crack itself). Once Verse `lastResolvedSpellId` only on successful cast. Tick Hood flag in the DoT ticker, not inside `computeDamage`. Dull Edge keys `physical_attack`, never `spell.name`. Pet Sill enter gate on `isSummon`. Short Leash `min(remaining, 1)` on `isSummon` only.
11. Cap the summoner overlay (`WX` 11932–11942). COURT triple-span sheets assume the lottery does not add a second engine **and** that remaining cap ≥ 3.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order splices, or damage-formula edits. Map **selection** is a filter on already generated maps. Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-WALL-HUG`, `FSN-WALL-FILE` | `barrierTiles` Chebyshev scan; world walls are not barriers; Pylon plant then step off |
| `FSN-BOOT-STEP`, `FSN-BOOT-SPARE`, `FSN-BOON-BOOT` | walk-MP spent writer; Slip / shove do not pay Boot; Spare does not persist `CharacterStats.mp` |
| `FSN-FACE-WRITE`, `FSN-FACE-GLANCE`, `FSN-WICK-FACE` | push caller + dest legality + facing write on cell change; Oncoming needs battle-walk view or Frost-only |
| `FSN-DULL-PET` | Dull keys `physical_attack`; Sill enter gate on `isSummon`; player body walks |
| `FSN-SLIP-PIT` | (2,1) dest filter; Wick convert is `pitTiles` not `placeBarrier` |
| `FSN-CRACK-VERSE` | once/battle hostile highest CD → 0; Once uses resolved last-id only |
| `FSN-SHARE-GOAD` | split after RES; missing ally consumes charge; Goad legal-target rewrite |
| `FSN-PIVOT-WICK` | clockwise dest occupancy; Rank Lock leaves spells legal; gallery after convert |
| `FSN-HOOD-CHOIR` | Tick Hood in DoT ticker; lava is not a tick; Absolve is strip not Blood Mend |
| `FSN-BRAND-REEL` | File Reel `applyAttract` caller + Brand XOR after landing; Hug +10 only with real barriers |
| `FSN-TRIPLE-PLUG` | remaining cap ≥ 3; `summonAI: "triplespan"`; empty-kit posts; lintel leaves a bypass |

---

## Sources (line-accurate, 2026-09-26)

- Kits / inference / decide / summoner skip: `src/frontend/src/engine/enemyAI.ts` 163–185, 194–200, 202–221, 447–452, 1662–1698, 1832–1888
- Kit assignment + summoner roll: `src/frontend/src/components/WorldExploration.tsx` 11920, 11932–11942; zone object 4683–4687
- Family lottery + HP overwrite: `spawnPolicy.ts` 35, 49–57, 69–128, 261–271; WX 5864–5866, 11970–11974
- Ember / tide melee hooks: `WorldExploration.tsx` 16789–16819
- Void reflect: `src/frontend/src/engine/castHelpers.ts` 336–337
- Push / attract (no caller): `src/frontend/src/engine/occupancy.ts` 482, 537
- Cast AP-only: `WorldExploration.tsx` `executeCastAttempt` 17096+
- Trap-as-barrier: `src/frontend/src/engine/spellEngine.ts` 442–445
- Area Chebyshev: `src/frontend/src/engine/targeting.ts` 690–727 (`spell.diagonal` at 712)
- Gates, summon cap, kamikaze: `src/frontend/src/data/gameConstants.ts` 200–209, 266–301
- Families / `currentView`: `src/frontend/src/types/gameTypes.ts` 12–20, 297; overworld wander writer WX 6924–6938
- Spells: `src/frontend/src/data/spellData.ts` (`starter-heal` 85–101 self-only; Enrage ally 274–291)
- Map archetypes: `src/frontend/src/engine/mapGen.ts` 6–44
- Wave 8 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-25.md` (PR #558) §3–§4
- Wave 8 spell verbs (unfamilied — not this drop): `docs/automation/SPELL_PROPOSALS_2026-09-25.md` (PR #563)
- Drop 8: `docs/design/ENEMY_FORMATIONS_2026-09-25.md` (PR #575)

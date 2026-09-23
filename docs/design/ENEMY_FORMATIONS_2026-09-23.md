# Enemy synergy and formation catalog (drop 6)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-09-23  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–5 already taught the seven pairing words and Waves 1–4 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 5 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-09-22.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-22.md) (open as PR #405): Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4, Wave 3 packs — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5, Wave 4 packs — open as PR #401). Family sheets: [`ENEMY_ELITE_EVOLUTION_2026-09-22.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-22.md). Spell verbs: [`SPELL_PROPOSALS_2026-09-21.md`](../automation/SPELL_PROPOSALS_2026-09-21.md) (Wave 4 ids this drop consumes, open as PR #342) and Discovery Wave 4 [`SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md`](../automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md) (open as PR #371: Stolen Verse, Misstep, Bitter Cup).

**Hard rules (Wave 5 pack law — plus every older law still stands):**

- Do **not** pack `gale_deacon` with `fan_prelate` as a PAIR (two cones). `FSN-LOCK-FAN` stays cone-without-push.
- Do **not** pack `twin_sentry` with `pawn_broker` / `blink_cutter` / `rift_hook` as a PAIR (three swap engines). `FSN-TRADE-HOLE` stays two-hostile; `FSN-EMBER-RIFT` stays caster↔player.
- Do **not** pack `surplus_warder` with `sidestep_warder` as a PAIR (two evades). `FSN-EVADE-GOAD` / `FSN-RECOIL-HUNT` stay unconditional miss.
- Do **not** pack `sated_knight` with `coup_duelist` / `execute_jackal` as a PAIR (three HP windows). `FSN-COUP-ROT` / `FSN-BELL-CUT` stay low-bar.
- Do **not** pack `ledger_siphon` with `soul_siphon` / `hex_teller` as a PAIR (two steals / two AP engines). `FSN-LEY-SIP` stays MP. COURT later may add Hex as a **second step**, never same AP bar.
- Do **not** pack `origin_mason` with `tax_scribe` as a PAIR (two tile taxes). `FSN-GRAVITY-TAX` stays enter-AP.
- Do **not** pack `bait_prelate` with `pylon_prelate` / `stone_castellan` / `font_cantor` (two stationary posts). One of pylon **or** turret **or** font **or** bait per pack.
- Do **not** pack `morrow_walker` with `mist_walker` / `twin_porter` as a PAIR (two self-teleports). `FSN-MIST-HUNT` / `FSN-GATE-COURT` stay instant / pads.
- Do **not** pack `verse_scribe` with `bone_scribe` as a PAIR (two scribes).
- Do **not** pack `bitter_censor` with `null_censor` as a PAIR (two censors). `FSN-NULL-WALL` stays summon lockout.
- Do **not** pack `oblique_cantor` with `rank_lancer` / `far_stinger` / `glass_sniper` as a PAIR without a lock/pit third (two guns, same lesson). `FSN-BIAS-PIT` is the teaching pair because the pit is the **other** verb.
- Do **not** pack `pair_binder` with `sink_chanter` / `void_anchoret` as a PAIR (two attracts).
- Do **not** pack `shove_chaplain` with `bash_bruiser` as a PAIR (ally-away vs hostile-push). Shove School with Hook is the teach.
- Do **not** pack `pincer_acolyte` with `shadow_lurker` as a PAIR (two “stand next to me” assassins).
- Do **not** pack `misstep_herald` with `axis_locksmith` as a PAIR (two walk rewrites). `FSN-OBLIQUE-FILE` is the COURT/CADRE that makes the difference readable, and even then Misstep is a **variant**, not the base roster.
- Drop 4/5 laws still stand: no `coup_duelist`+`bell_sexton` PAIR; no `twin_porter`+`mist_walker` PAIR; no `font_cantor`+`pale_cantor` PAIR; no `pawn_broker`+`rift_hook` PAIR; no `hex_teller`+`tax_scribe`/`coil_arbiter` PAIR; no `stride_hunter`+jackal/coup PAIR; no `far_stinger`+`glass_sniper` PAIR without `share_optic`.

Wave 5 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-09-22.md`, open as PR #411: Oncoming, Facing Pin, Glance Cut, Mute Thread, Queue Cut, File Vault, Span Guard / Span Pylon, Cadence Theft, Cover Step, Low Lintel, Act Tax, Act Bell, …) are sheeted as Wave 6 families in [`ENEMY_ELITE_EVOLUTION_2026-09-23.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-23.md) (open as PR #452). This drop does **not** mint `FSN-*` ids for them. The next formation drop packs those families.

Cut In / After Verse / Sanguine Toll / Eclipse Fold stay **boss / closed-class**.

---

## Grounding (live, 2026-09-23)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 4–5. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

| Fact | Where |
| :--- | :--- |
| Kits by piece | `enemyAI.ts` `ENEMY_KITS` 163–185 |
| `buildEnemyKit` | `enemyAI.ts` 194–199 (`Math.floor(levelZone)`) |
| Battle-start kit assignment still passes `currentMap.levelZone` (object) | `WorldExploration.tsx` 11920 |
| Summoner overlay roll still `0.12 + playerLevel * 0.02` (uncapped) | `WorldExploration.tsx` 11932–11942; `gameConstants.ts` 298–299 |
| Family lottery 30%, seven live ids | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 35, `FAMILY_TYPES` 49–57, `applyFamilyVariantsToRoster` 289–297; WX 5862–5866 |
| Family `res` / `sp` still written as 0.05–0.75 | `spawnPolicy.ts` `applyEnemyFamilyStats` 261–272 |
| Battle start still overwrites family HP | `WorldExploration.tsx` 11970–11974, 11991–11997 `calcEnemyMaxHp(e.level)` |
| `inferArchetype` still heal-first (`spellType === "heal"` **or** `healAmount > 0`) | `enemyAI.ts` 447–452 |
| `inferArchetype` never returns `summoner` | `enemyAI.ts` 447–476 |
| `decideEnemyAction` | `enemyAI.ts` 1662–1706 |
| `decideSummonerAction` still **skips** on missing spell / cap / cooldown | `enemyAI.ts` 1832–1888 |
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 218–223 — **no** `bait` / `font` / `pylon` / `turret` key |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763, 5855 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 |
| Kamikaze constants | `gameConstants.ts` 271–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16818 |
| Void Mirror 25% reflect | `castHelpers.ts` 335–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 (tests only) |
| Map `portals` are **impassable** | `occupancy.ts` 13–14, 40 |
| `areaShape` typed, **unread** | `gameTypes.ts` 224; area = Chebyshev `areaRadius` in `targeting.ts` 694–721 |
| `spell.diagonal` honored on enemy/area paths | `targeting.ts` 712 |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ / `planPlayerCastAttempt` |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442 |
| Enemy-legal unique spells | `spellData.ts` 143–686 (`usableByEnemy` flags) |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–289 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Summoner slots need `isSummoner` + a usable summon id. Dedicated bait / font / pylon / turret / familiar bodies **replace** the random overlay on that slot. Cap one pylon **or** turret **or** font **or** bait, not two.
3. Any `healAmount` steals healer. **Do not put drain, nova, or `starter-heal` on Gale, Sentry, Pincer, Oblique, Pair, Ledger, Shove, Origin, Morrow, Surplus, Sated, Verse, Misstep, or Bitter.** Bait plants; **planting is not a heal**. Font pulse is a heal (drop 5). Cantor on `FSN-SATED-PLATE` is the **one** heal engine on that sheet.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Leash Hook / Ward Plate / Lens Share / Twin Guard / Body Check until a ranged heal id exists.
5. `spell-rallying-cry` stays `usableByEnemy: false`. Gale Fan / Twin Guard / Cross Flank / Bias Ray / Draw Together / AP Sip / Body Check / Cast Snare / Bait Pylon / Morrow Step / Surplus Ward / Sated Fang / Stolen Verse / Misstep / Bitter Cup ship player-first — only the named overlay may family-flip **that one** id.
6. `summon-sentinel`, `summon-bomber`, `summon-wisp` stay enemy-false except as **late COURT flag-unlocks** already named in drop 1. Bait is a **different** id (`spell-bait-pylon`). Nested `spell-bait-eat` is `NOT_PLAYER_LEARNABLE`.
7. `starter-blast` has **no** `usableByEnemy` flag. Gale Deacon uses `spell-gale-fan` via `areaShape: "cone"` **then** `applyPushback` 1. **Do not ship as a Chebyshev blob.** Do not invent `thunder_clap` / `void_collapse` on a sheet unless that sheet names them as a COURT rare and the id is already in admin seed.
8. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies. Sated Fang is **not** `instantKill` — it is a ≥70% HP% gate on a profiled id. Stolen Verse is **not** After Verse (boss, copies the player).
9. Push dest, hook landing, sink landing, bash dest, slide dest, self-knockback dest, trade landing, **gale landing**, **pair-attract landing**, **ally-shove landing**, **morrow arrival**: free floor, not lava / spikes / void / portal / pit, player keeps ≥ 1 escape tile. Twin Gate pads must **not** reuse occupancy `portals`. Morrow paint is **not** a portal. Teleport / Mist Step does not pay rime or trip wires; fuse still ticks occupancy; gale / draw / shove **does** set `movedThisTurn` on the moved body.
10. Dual Slow / Frost / tide melee / rime enter MP tax: cap applied unit MP debuff at **−2**. Soul Sip is **current** MP steal. AP Sip is **current leftover AP** (separate axis). Ley Toll spends **caster** current MP. One Slow source per pack. Do not also Root + Rank Lock + Misstep + Slow on the same AP bar.
11. `inferSummonArchetype` must key `summonAI === "bait"` (and `"font"` / `"pylon"` / `"turret"`) before any bait sheet ships. Name heuristics stay a bug (`AI-SYS` on 09-21 / 09-22). Summoner skip-lock is `AI-FUT-49` — bait at cap must fall through to Shield, not skip the turn.
12. Wave 5 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-09-22.md`) are Wave 6 families in PR #452. Do not mint `FSN-*` for Oncoming / Facing Pin / Mute Thread / Queue Cut / File Vault / Span Pylon in this drop.

### Relative difficulty (same grades as drops 1–5)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…5 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a MP **or AP** decision / a cone) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (warden / tank / bruiser / pusher / lancer / goad / chaplain / pylon-owner / plate / tether / pit-mason / locksmith / recoil / pincer / shove / sated / surplus): pack median + one step.
- Backliner (sniper / stinger / ley / sip / fan / gale / broker / porter / share / hex / slide / font-owner / oblique / pair / ledger / origin / verse / misstep / bitter / morrow): pack median.
- Glass (rat, coup, mist, sidestep, bait-owner, verse): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 6)

Drop 1–5 overlays still apply. These are **additional jobs** for Wave 5 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-GALE` | `queen` or `king` **without** heal | proposed `gale_deacon` | `starter-frost`, `spell-gale-fan` at CELL+ | artillery; Gale only if two player-side bodies sit in the 90° wedge **and** at least one push cell is free or a hazard; hug = immune |
| `ROLE-SENTRY` | `king` **without** heal | proposed `twin_sentry` | `spell-twin-guard`, `starter-frost` — **0 damage on the trade**; **no** `isSwap` | guardian; skip if fewer than 2 allied bodies; skip if the swap is safer for the player |
| `ROLE-PINCER` | `knight` or `pawn` | proposed `pincer_acolyte` | `physical_attack`, `spell-cross-flank` | flanker; Cross only if two allied bodies are Chebyshev 1 to the **target**; skip the 8 if solo |
| `ROLE-OBLIQUE` | `bishop` | proposed `oblique_cantor` | `spell-bias-ray`, `starter-frost` — `diagonal: true` | caster; Ray only if `\|dx\| === \|dy\|` and Chebyshev ≥ 2; refuse rank/file (Frost) |
| `ROLE-PAIR` | `bishop` or `queen` **without** heal | proposed `pair_binder` | `spell-draw-together`, `starter-frost` — **0 HP on the attract** | caster; skip if only one player-side body; skip if already adjacent and that is safer |
| `ROLE-LEDGER` | `bishop` | proposed `ledger_siphon` | `spell-ap-sip`, `starter-frost` — **0 HP damage** | caster; skip if target leftover AP is 0; steal **current** AP, no lingering debuff |
| `ROLE-SHOVE` | `rook` or `king` **without** heal | proposed `shove_chaplain` | `spell-body-check`, `physical_attack` — **0 damage on the shove** | guardian; dest-check (pit / lava / void / occupied → skip); skip if no ally in range 2 |
| `ROLE-ORIGIN` | `rook` or `bishop` | proposed `origin_mason` | `spell-cast-snare`, `starter-frost` — **0 HP on the paint** | setter; paint the player’s current tile if they hold any `apCost ≥ 3`; skip if they must walk off |
| `ROLE-BAIT` | `king` | proposed `bait_prelate` | `spell-bait-pylon` (family flip `usableByEnemy` for this id only) — **no** `healAmount` on CORE | `isSummoner` for the bait id only; pet `mp: 0`, **must not path**; kit `spell-bait-eat` only; no wolf/archer/pylon/turret/font overlay |
| `ROLE-MORROW` | `bishop` or `knight` | proposed `morrow_walker` | `spell-morrow-step`, `starter-frost` — **0 damage on the paint** | kiter; skip if dest is adjacent to the player; arrival fizzles if occupied |
| `ROLE-SURPLUS` | `knight` | proposed `surplus_warder` | `spell-surplus-ward`, `physical_attack` — **no** `buffStat: "evasion"` | flanker; Ward only if leftover AP ≥ 2 **after** pay; skip if already charged |
| `ROLE-SATED` | `knight` or `rook` | proposed `sated_knight` | `physical_attack`, `spell-sated-fang` | charger; Fang only while HP% ≥ 70; refuse under 70 (Strike / Shield) |
| `ROLE-VERSE` | `bishop` or `queen` **without** heal | proposed `verse_scribe` | `spell-stolen-verse`, `starter-frost` | caster; skip if no last-resolved hostile id / denylist / no legal tile; skip echoing Strike if Frost is legal |
| `ROLE-MISSTEP` | `rook` or `bishop` | proposed `misstep_herald` | `spell-misstep`, `starter-frost` — **0 damage on the mark** | caster; skip if all four cardinals are blocked **or** all four are safe |
| `ROLE-BITTER` | `bishop` | proposed `bitter_censor` | `spell-bitter-cup`, `starter-frost` — **0 damage on the Cup** | caster; skip if no visible heal source; never also heal the same target |

Drop-2/3/4/5 `ROLE-LANCER` / `ROLE-PUSHER` / `ROLE-ROOTER` / `ROLE-SNIPER` / `ROLE-WARDEN` / `ROLE-TANK` / `ROLE-GOAD` / `ROLE-ABSOLVER` / `ROLE-FUSE` / `ROLE-TRAPPER` / `ROLE-PIT` / `ROLE-FONT` / `ROLE-LEY` / `ROLE-CANTOR` / `ROLE-PLATE` / `ROLE-TEMPO` are reused below. Do not also roll the random 12% summoner overlay onto Gale, Sentry, Pair, Ledger, Origin, Morrow, Verse, Misstep, Bitter, Surplus, Sated, Oblique, Pincer, or Bait. One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** pylon **or** font **or** bait — never two engines).

### Fair-fight rules (every sheet)

Same as drops 1–5, plus Wave 5:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, barrier, live fuse, pit, a slide whose stored dir dumps into those, or a Morrow mark the player is forced to occupy.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Kamikaze never detonates on a single full-HP player.
- Swap / pull / push / sink / slide / self-knockback / trade / **gale** / **draw** / **shove** dest: free floor, not lava / spikes / void / portal / pit, player keeps ≥ 1 escape tile.
- Gale Fan: same cone helper as Fan Bolt, **then** `applyPushback` 1 away from caster per surviving hit. Allies not pushed. Hug the caster. Diagonals of the facing are safe. Skip without two player-side bodies in the wedge **or** if every push cell is blocked (would be Fan Bolt with extra AP). **Do not ship as a Chebyshev blob.** Landing must tick hazards.
- Twin Guard: two **allied** bodies swap. Caster stays. Not `isSwap`. Hazard on landing must tick. Isolate (one body / desummon) is a complete answer. Never trade onto lava / the last exit.
- Cross Flank: 8, or 8+10 if two allied bodies are Chebyshev 1 to the target. Dead bodies do not count. Fail closed if occupancy is missing. Walk to Chebyshev 2 from one body is the answer. Do **not** read sprite `currentView`.
- Bias Ray: `diagonal: true`, LoS-true, range 2–5. Cardinals are safe. Hug Chebyshev 1. Do **not** import backend `shadow_strike`.
- Draw Together: each of two hostiles `applyAttract` 1 toward the Chebyshev midpoint. Not a swap. Odd distances: both move 1 or collide and stop. Isolate is a complete answer. Already-adjacent in a safe pocket → AI skips.
- AP Sip: steal 1 **current leftover AP**, grant 1 to caster this turn. Fizzles at target AP 0. Not a linger tax, not Hex Toll, not Drain Courage. Dump the spell before its init.
- Body Check: `applyPushback` 1 on an **ally**, away from caster. Not a hostile push. Not Leash Hook. Landing must tick. Occupying the only push cell is the counter.
- Cast Snare: tile — spells whose **caster origin** equals this cell cost +1 AP for 2 turns. Walk / potions do not pay. Attack Nearest origin is the **player** tile. Summon casts from the summon cell. Do **not** use `isTrap`. Does not block LoS or walk. Step off is the answer. Never paint **both** walk-offs as the only legal cast tiles.
- Bait Pylon: occupies, lifespan 3, 1 HP. While Chebyshev ≤ 2 from owner, the next hostile damaging/debuff/DoT aimed at the owner redirects to the bait and the bait dies. AoE: owner share eaten; rest of wedge still hits others. Intercept does **not** fire on walks, lava, or Sacrifice self-HP. Bait before Mirror before absorb. 0 XP on bait death. Chip the 1 HP. Sit outside intercept 2.
- Morrow Step: paint a free floor cell. At **this unit’s next turn start**, teleport if `isCellFree`. Occupied dest: fizzle arrival. Death before start: drop the mark. Do **not** use map `portals`. Sit on the mark.
- Surplus Ward: same `evadeNextHits: 1` consume as Sidestep, **gated** on leftover AP ≥ 2 after this spell’s debit. Failed greed: AP spent, CD written, no charge. Drain leftover AP first. 0-damage control does not consume.
- Sated Fang: legal only when `hp / maxHp >= 0.70`. Fail closed if `maxHp` is 0. Chip below 70% is a complete answer. Absorb is **not** HP. Never Fang a full-HP player as a “gotcha” on turn 1 if they can still walk away — the gate is **their** HP, readable.
- Stolen Verse: re-resolve a living hostile-to-caster’s last `castResult === "cast"` id at 50% payload. AP paid is Verse’s 3. Original MP / HP riders do **not** re-fire. Denylist (ids, not names): Stolen Verse, After Verse, Echo Cast, Timestep, Sacrifice, any `isSummon`, Twin Gate, Triune Gate, Morrow Step, Cut In, Ley Toll, Sanguine Toll. Hold the nuke until they have spent Verse. Cast a denylisted utility last.
- Misstep: store N/E/S/W on the target for **1** of their walks. Next 1-step walk **must** be that cardinal if `isCellFree`; if blocked, they may walk another dir (mark consumes). Forced-move does **not** consume. Blink / Swap skip it. **Don’t walk** (duration 1) is a complete answer.
- Bitter Cup: 2 turns. Next `healAmount > 0` on the target deals that amount as spell damage instead and consumes. Self-HP costs are **not** heals. Skip the pulse. Absolve strips. Order vs Cursed Wound: Cup consumes first if both would apply.
- Pain Link + Goad together is **COURT only**. Not on any base sheet in this drop.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- No Glass Realm on stacked-DoT, Ignite, Fuse, Brand, Ley-prime, Gale-landing, or Cup sheets. No Time Warp on Fuse / Brand / Hex / Lock / Trade / Morrow / Misstep windows.
- Summons stay at cap 2. Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.

---

## Index (all six catalogs)

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-IRON-BATTERY` | PAIR | protector + artillery | 2026-08-31 |
| `FSN-WARD-MEND` | PAIR | tank + healer | 2026-08-31 |
| `FSN-HEX-BLOOD` | PAIR | buffer + bruiser | 2026-09-01 |
| `FSN-GLASS-WARD` | PAIR | warden + sniper | 2026-09-01 |
| `FSN-IRON-TIDE` | PAIR | tank + kiter | 2026-09-02 |
| `FSN-FILE-GUARD` | PAIR | lancer + protector | 2026-09-02 |
| `FSN-MEND-KNIFE` | PAIR | healer + assassin | 2026-09-02 |
| `FSN-WICK-STEP` | PAIR | fuse + pusher | 2026-09-21 |
| `FSN-RIME-RANK` | PAIR | ice + lancer | 2026-09-21 |
| `FSN-SMOKE-GLASS` | PAIR | smoke + sniper | 2026-09-21 |
| `FSN-LEY-SIP` | PAIR | MP-prime + MP-steal | 2026-09-22 |
| `FSN-KICK-STING` | PAIR | self-knockback + distance sniper | 2026-09-22 |
| `FSN-FONT-IRON` | PAIR | heal totem + tank | 2026-09-22 |
| `FSN-PIT-RANK` | PAIR | pit + lancer | 2026-09-22 |
| `FSN-GALE-HOLE` | PAIR | cone-push + pit | this drop |
| `FSN-TWIN-BROOD` | PAIR | ally-swap + summoner | this drop |
| `FSN-PINCH-GOAD` | PAIR | pincer occupancy + taunt | this drop |
| `FSN-BIAS-PIT` | PAIR | diagonal poke + pit | this drop |
| `FSN-FROST-KNIFE` | CELL | controller + assassin | 2026-08-31 |
| `FSN-ROT-CUT` | CELL | debuffer + finisher | 2026-08-31 |
| `FSN-TIDE-LOCK` | CELL | kiter + mover | 2026-08-31 |
| `FSN-MIRROR-REAVE` | CELL | reflect + gap-closer | 2026-09-01 |
| `FSN-PAPER-PLAGUE` | CELL | dual applicator + scribe | 2026-09-01 |
| `FSN-NULL-WALL` | CELL | anti-summon + tank | 2026-09-01 |
| `FSN-HOOK-SLAM` | CELL | pull + push | 2026-09-02 |
| `FSN-BELL-CUT` | CELL | clock + execute | 2026-09-02 |
| `FSN-WIRE-ROOT` | CELL | trap + root | 2026-09-02 |
| `FSN-STACK-CASH` | CELL | applicator + ignite | 2026-09-21 |
| `FSN-COUP-ROT` | CELL | applicator + instant execute | 2026-09-21 |
| `FSN-TRADE-HOLE` | CELL | two-hostile swap + pit | 2026-09-22 |
| `FSN-SLIDE-BASH` | CELL | conveyor + push | 2026-09-22 |
| `FSN-LOCK-FAN` | CELL | walk-axis lock + cone | 2026-09-22 |
| `FSN-DRAW-CASH` | CELL | pair attract + ignite | this drop |
| `FSN-LEDGER-LEY` | CELL | AP-steal + MP-prime | this drop |
| `FSN-CHECK-LEASH` | CELL | ally-away + ally-to-caster | this drop |
| `FSN-KENNEL-LITANY` | BRIGADE | summoner + support | 2026-08-31 |
| `FSN-EMBER-RIFT` | BRIGADE | hazard + displacer | 2026-08-31 |
| `FSN-HOOK-FUSE` | BRIGADE | puller + kamikaze | 2026-09-01 |
| `FSN-TIDE-STORM` | BRIGADE | kiter + storm artillery | 2026-09-01 |
| `FSN-VEIL-HEX` | BRIGADE | lurker + buffer | 2026-09-01 |
| `FSN-EMBER-MEND` | BRIGADE | hazard + healer | 2026-09-02 |
| `FSN-GRAVITY-TAX` | BRIGADE | pull + slam + zone tax | 2026-09-02 |
| `FSN-WICK-COURT` | BRIGADE | fuse + sink + bash | 2026-09-21 |
| `FSN-TEMPO-CHOIR` | BRIGADE | tempo + ignite + rat | 2026-09-21 |
| `FSN-FOG-FUSE` | BRIGADE | smoke + fuse + mist | 2026-09-21 |
| `FSN-RESCUE-LINE` | BRIGADE | ally-pull + warden + sniper | 2026-09-21 |
| `FSN-LEY-COURT` | BRIGADE | prime + steal + sting | 2026-09-22 |
| `FSN-PUSH-SCHOOL` | BRIGADE | self-push + they-push + pit | 2026-09-22 |
| `FSN-TRADE-TRAP` | BRIGADE | trade + pit + fuse | 2026-09-22 |
| `FSN-FONT-GATE` | BRIGADE | font + warden + golem | 2026-09-22 |
| `FSN-GALE-PIT` | BRIGADE | cone-push + pit + fuse | this drop |
| `FSN-TWIN-KENNEL` | BRIGADE | ally-swap + summoner + occupy | this drop |
| `FSN-PINCER-GATE` | BRIGADE | pincer + taunt + occupy | this drop |
| `FSN-SHOVE-SCHOOL` | BRIGADE | ally-away + ally-to-caster + stride | this drop |
| `FSN-TRI-BASTION` | CADRE | tank + healer + artillery | 2026-08-31 |
| `FSN-MARK-CONFLAGRATION` | CADRE | mark + inferno + finisher | 2026-08-31 |
| `FSN-PACK-PINCER` | CADRE | summoner + assassin + tank | 2026-08-31 |
| `FSN-MIRROR-SCRIPTORIUM` | CADRE | displacer + support + assassin | 2026-08-31 |
| `FSN-ASH-COURT` | CADRE | ember + martyr + glyph | 2026-09-01 |
| `FSN-QUIET-CHOIR` | CADRE | cantor + chorister + warden | 2026-09-01 |
| `FSN-BROKEN-GLASS` | CADRE | sniper + mirror + reaver | 2026-09-01 |
| `FSN-RIFT-KNOT` | CADRE | puller + blinker + arbiter | 2026-09-01 |
| `FSN-NULL-BROOD` | CADRE | brood + censor + golem | 2026-09-01 |
| `FSN-FILE-WIRE` | CADRE | lancer + trap + root | 2026-09-02 |
| `FSN-BELL-COURT` | CADRE | clock + execute + scribe | 2026-09-02 |
| `FSN-PLATE-LINK` | CADRE | absorb + redirect + cantor | 2026-09-02 |
| `FSN-MIST-HUNT` | CADRE | dash + lurker + bait familiar | 2026-09-02 |
| `FSN-ICE-FILE` | CADRE | rime + lancer + root | 2026-09-21 |
| `FSN-SMOKE-HUNT` | CADRE | smoke + sniper + optic | 2026-09-21 |
| `FSN-PLUS-BATTERY` | CADRE | plus + sink + glyph | 2026-09-21 |
| `FSN-ABSOLVE-RACE` | CADRE | cleanse + plate + ignite | 2026-09-21 |
| `FSN-TWIN-PLATE` | CADRE | tether + plate + cantor | 2026-09-21 |
| `FSN-FINISH-LINE` | CADRE | coup + ignite + rat | 2026-09-21 |
| `FSN-FAN-FILE` | CADRE | cone + axis lock + root | 2026-09-22 |
| `FSN-RECOIL-HUNT` | CADRE | kick + sting + evade | 2026-09-22 |
| `FSN-GATE-COURT` | CADRE | pads + slide + stride brand | 2026-09-22 |
| `FSN-EVADE-GOAD` | CADRE | evade + taunt + cleanse | 2026-09-22 |
| `FSN-OBLIQUE-FILE` | CADRE | diagonal poke + axis lock + pit | this drop |
| `FSN-MORROW-SNARE` | CADRE | delayed blink + origin tax + trip | this drop |
| `FSN-SATED-PLATE` | CADRE | high-HP% physical + heal + absorb | this drop |
| `FSN-BAIT-GATE` | CADRE | intercept post + tank + anti-summon | this drop |
| `FSN-CROWN-ESCORT` | COURT | dual golem + king + controller | 2026-08-31 |
| `FSN-CHORUS-THRONE` | COURT | choir + sniper, leader | 2026-09-01 |
| `FSN-SHARD-BATTERY` | COURT | turret + ricochet + glyph | 2026-09-02 |
| `FSN-BASTION-GATE` | COURT | pylon + goad + sniper | 2026-09-21 |
| `FSN-LENS-BATTERY` | COURT | ally-range + two guns, leader | 2026-09-22 |
| `FSN-VERSE-PULPIT` | COURT | echo last id + tempo + gun, leader | this drop |

---

## Formations

### FSN-GALE-HOLE

FORMATION_ID: `FSN-GALE-HOLE`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-GALE` — `queen` **without heal** / proposed `gale_deacon` — pack median — back
- `ROLE-PIT` — `rook` / proposed `pit_mason` — pack median + 1 — paints **one** melee approach

VARIANT_RULES:

- Teaching pair for Gale Pit minus the Fuse. Distinct from `FSN-LOCK-FAN` (cone, no push) and `FSN-PIT-RANK` (pit + cardinal lancer). This cone **moves** a body onto a hole.
- Band 0: **do not spawn this id** until `areaShape: "cone"` is read **and** `applyPushback` has a spell caller. Show `FSN-PIT-RANK` or `FSN-HOOK-SLAM` instead. Do not fake Gale with Inferno or Fan Bolt.
- Band 1: Gale Fan + Open Pit. Pit a cell in the wedge’s push ring. Push dest must leave a walk-off **that is not the pit**.
- Elite: Deacon only. Mason stays junior so two pit elites cannot paint both exits.
- Unlock after `FSN-LOCK-FAN` **or** `FSN-PIT-RANK` (player has seen a cone **or** a pit).
- Random 30% family lottery is **off**.
- No Fuse, no Fan Prelate, no Misstep, no Inferno.

SPELL_POOL_INTERACTIONS:

- Gale: 8×bodies then `applyPushback` 1. Hug = immune. Blocked push cells → skip Gale (Frost).
- Open Pit: 0 HP paint, walk-block, LoS open. Occupant at paint stays. Teleport / Mist Step over works.
- Frost after a shove is a tax, not a root.

TACTICAL_PLAN:

- Mason pits a melee approach the player is likely to be pushed onto, never both walk-offs, never the only tile that reaches the Deacon.
- Deacon faces so the wedge covers player + Wisp (or player + a square they will occupy) and one push cell is the pit **or** open floor with a side step.
- Never turn-1 Gale onto a full-HP player whose only landing is the pit if they started outside the wedge.

SYNERGY:

- Hazard creator + displacement specialist. Wave 5 Gale standing on drop-5’s Pit. The hole is the landmine; the cone is why standing in the wedge is expensive — hugging is still complete.

PLAYER_THREAT:

- Positional. Fail state is “I stood in the wedge and slid onto a pit I already saw.” Recoverable: hug, split the wedge, occupy the push cell.

COUNTERPLAY:

- Hug the Deacon. Split so only one body is in the 90°. Occupy the pit (you stay; they cannot push you in). Kill the glass Deacon (`hp` ~0.85). Walk the back-diagonal of the facing.
- Do not stand still on Time Warp — that modifier is **banned** on this id.

MAP_REQUIREMENTS:

- `arena` or `openField` with a **3-tile wedge plus one side aisle**. Reject `corridorMaze` (cone-push + pit in a hallway is a lock).
- Reroll on tiny `ruinsIslands` pockets with no 3-tile wedge.
- No lava dest.

AI_REQUIREMENTS:

- Gale: caster + wedge occupancy **and** a legal push (`aiHint` from #342). VETERAN skip if every push cell is blocked.
- Pit: setter; on-path-only; never pit both exits.
- Soph 1–2. `groupTactics` not required.

VARIANTS:

- `FSN-GALE-HOLE/FROST` — Deacon Frost-only if cone+push apply is not ready; **reroll the id** rather than fake Gale with Fan Bolt.
- `FSN-GALE-HOLE/E-GALE` — elite Deacon, still one live pit.

STATUS: PROPOSED

---

### FSN-TWIN-BROOD

FORMATION_ID: `FSN-TWIN-BROOD`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-SENTRY` — `king` **without heal** / proposed `twin_sentry` — pack median — back, high init
- `ROLE` summoner — `bishop` / live `brood_chanter` (Wave 1) — pack median — plants the second allied body

VARIANT_RULES:

- Teaching pair for Twin Kennel minus the Warden. Twin Guard needs **two allied bodies**; the pet is that body. Distinct from `FSN-TRADE-HOLE` (two **hostiles** swap) and `FSN-KENNEL-LITANY` (wolf + cantor heal).
- Band 0: **do not spawn this id** until Twin Guard apply exists. Show `FSN-KENNEL-LITANY` instead. Do not fake the swap with `spell-swap` (that is caster↔player / caster↔ally).
- Band 1: Twin Guard + Dire Wolf (or existing brood kit). Sentry Frosts if only one allied body (before the pet lands).
- Elite: Sentry only. Chanter stays junior so two swap elites cannot yo-yo the pet onto lava.
- Unlock after `FSN-KENNEL-LITANY` (player has seen a dedicated summoner).
- Random 30% family lottery is **off**.
- No Pawn Broker, no Blink Cutter, no Rift Hook, no Bait / Pylon / Font on this PAIR (those are kennel / gate upgrades).
- Cap the random 12% summoner overlay — Chanter **is** the engine.

SPELL_POOL_INTERACTIONS:

- Twin Guard: two allies swap, caster stays. Hazard on landing ticks. 0 damage on the trade.
- Wolf occupies a choke the player wanted, or peels the pet off a bad tile. Summoner skip-lock (`decideSummonerAction` 1832–1888) **must** fall through (`AI-FUT-49`) or the Sentry never gets a partner.
- Frost is the only damage on the Sentry. Do not Inferno.

TACTICAL_PLAN:

- Chanter plants if cap allows, else Frosts (fall-through).
- Sentry swaps only if the trade puts the pet onto a choke **or** the squishy Chanter behind the pet. Skip if the player wanted the pet in melee.
- Hostiles start ≥ 4 apart so one Linear does not delete both before the pet exists.

SYNERGY:

- Protector (two-ally swap) + summoner. Wave 5 Twin Sentry standing on Wave 1 Brood. The pet is the second body; the swap is why killing the Chanter first is not free — the wolf can take the file.

PLAYER_THREAT:

- Tempo / occupancy. Fail state is “I lined up the Chanter and they swapped the wolf into my face.” Recoverable: desummon, isolate, Self Anchor the pet.

COUNTERPLAY:

- Kill the pet (0 extra XP still). Desummon / Null Brand. Stand so both landings are equal. Burst the glass Sentry (`hp` ~0.90) before the second swap.
- Do not hug both bodies (that teaches `FSN-PINCH-GOAD`).

MAP_REQUIREMENTS:

- `openField` or `fortress` with a **choke plus a backline pocket**. Reject a 1-tile closet (needs two allied bodies).
- Weight 0 until a summon placement cell exists that is unoccupied (`AI-SYS-14`).

AI_REQUIREMENTS:

- Sentry: guardian / protector (`aiHint: "swap_two_allies_if_improves_frontline"`). Fizzle-aware when fewer than 2 allied bodies exist.
- Chanter: `isSummoner` + fall-through to Frost. Placement dest unoccupied.
- Soph 1–2. Summon `allyCount` must be enemy-side (`AI-SYS-33`) before TEM modules attach.

VARIANTS:

- `FSN-TWIN-BROOD/GOLEM` — partner is live `iron_golem` instead of a pet (two bodies, no summon engine). Use when summon AI is not ready; still needs Twin Guard apply.
- `FSN-TWIN-BROOD/E-SWAP` — elite Sentry, still one pet.

STATUS: PROPOSED

---

### FSN-PINCH-GOAD

FORMATION_ID: `FSN-PINCH-GOAD`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-PINCER` — `knight` / proposed `pincer_acolyte` — pack median + 1 — completer
- `ROLE-GOAD` — `pawn` or `knight` / proposed `goad_herald` — pack median — the body they must swing at

VARIANT_RULES:

- Teaching pair for Pincer Gate minus the Warden. Distinct from `FSN-MEND-KNIFE` (heal + assassin) and `FSN-PACK-PINCER` (wolf + lurker + tank). Identity is **two allied Chebyshev-1**, not sprite facing.
- Band 0: both Strike only. Acolyte may show Cross Flank as an 8 (solo) — **do not spawn the bonus** until occupancy is counted. Herald Goad if the id exists, else Strike.
- Band 1: Cross Flank + Goad. Herald is one adjacency; Acolyte walks to complete.
- Elite: Acolyte only. Herald stays junior so two taunt elites cannot pin every damaging id.
- Unlock after `FSN-BASTION-GATE` **or** any Goad sheet (`FSN-EVADE-GOAD`) — player has seen “must swing at this body.”
- No Shadow Lurker, no Rear Cut, no Surplus Ward (that is `/SURPLUS` on the Gate).
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Cross Flank: 8 solo, 8+10 if two allied bodies are Chebyshev 1 to the target. Fail closed if missing.
- Goad: next **damaging** action must choose the Herald if they are a legal target. Slow / Barrier / Swap / Absolve ignore or strip it. AoE that already includes the Herald satisfies it.
- Strike from the Herald is ordinary melee. Do not also Inferno.

TACTICAL_PLAN:

- Herald walks adjacent and Goads if the player has a damaging id ready.
- Acolyte paths to a cell that **completes** the sandwich, then Crosses. If the player already walked to Chebyshev 2 from the Herald, Acolyte Strikes (8) rather than waiting forever.
- Never turn-1 surround (start ≥ 4).

SYNERGY:

- Assassin (pincer occupancy) + controller (taunt). Wave 5 Pincer standing on Wave 3 Goad. The taunt is why walking off one body is expensive — non-damage tools still ignore it.

PLAYER_THREAT:

- A burst you can see charging on occupancy. Spike is 18 on a completed sandwich, not a stun. Interruptible: walk off one body, Absolve the Goad, kill the glass Acolyte (`hp` ~0.80).

COUNTERPLAY:

- Walk to Chebyshev 2 from one body. Slow the completer. Strip Goad. Cheap Strike the Herald (satisfies taunt) then leave.
- Do not hug two bodies.

MAP_REQUIREMENTS:

- `openField` or `arena`. Needs space to walk off a sandwich. Reject a 1-tile tunnel (forced adjacency is a lock).
- Never CHAMPION in a solo-pack leftover after one death — demote Cross to Strike.

AI_REQUIREMENTS:

- Pincer: flanker; occupancy-gate (`aiHint` from #342). VETERAN skip bonus if pincer is false and Strike is in kit.
- Goad: charger; skip if already the only legal target; retreat disabled while taunt is live.
- Soph 1–2.

VARIANTS:

- `FSN-PINCH-GOAD/STRIKE` — Acolyte Strike-only if occupancy check is not ready; **reroll the id** rather than 2× Rear Cut lore.
- `FSN-PINCH-GOAD/E-PINCH` — elite Acolyte, still one Goad.

STATUS: PROPOSED

---

### FSN-BIAS-PIT

FORMATION_ID: `FSN-BIAS-PIT`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-OBLIQUE` — `bishop` / proposed `oblique_cantor` — pack median — owns **one** diagonal
- `ROLE-PIT` — `rook` / proposed `pit_mason` — pack median + 1 — paints a cardinal approach so the diagonal is the remaining gun lane

VARIANT_RULES:

- Teaching pair for Oblique File minus the Locksmith. Distinct from `FSN-RIME-RANK` / `FSN-PIT-RANK` (cardinal file) and `FSN-GLASS-WARD` (min-range cardinal sniper). Identity is **the axis**.
- Band 0: Cantor Frosts if the player is cardinal. Mason Strike / pit-paint if the id exists. Do not spawn if the map has no 3-tile diagonal.
- Band 1: Bias Ray + Open Pit. Pit a **cardinal** approach. Ray only on `|dx| === |dy|`, Chebyshev ≥ 2.
- Elite: Cantor only. Mason stays junior so two pit elites cannot close both galleries.
- Unlock after `FSN-PIT-RANK` (player already knows “leave the file”) **or** `FSN-GLASS-WARD`.
- No Rank Lock on PAIR (that is `FSN-OBLIQUE-FILE`). No Far Sting / Glass Shot (two guns). No Lancer.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Bias Ray: `diagonal: true`, LoS-true, 12 at AP 3. Cardinals are safe. Hug Chebyshev 1.
- Open Pit: walk-block on a cardinal spoke. LoS still open — Ray does **not** shoot through a pit (LoS-true, pit is a hole). The pit is why **walking the rank** costs an extra detour, not why the Ray ignores geometry.
- Frost if they stand cardinal. Mark stays off this PAIR so it does not clone `FSN-MARK-CONFLAGRATION`.

TACTICAL_PLAN:

- Mason pits the obvious cardinal approach to the Cantor.
- Cantor holds a diagonal spoke. If the player shares a rank, Frost. If they hug, step away, never Nova.
- Skip Ray if a pit/haze blocks LoS.

SYNERGY:

- Artillery (diagonal poke) + hazard creator. Wave 5 Oblique standing on drop-5’s Pit. The pit taxes the cardinal answer; the Ray is why you cannot shrug “I’ll just walk the file.”

PLAYER_THREAT:

- Readable geometry. Misplay is sharing a diagonal “for one Frost.” Recoverable: walk rank/file, close to 1.

COUNTERPLAY:

- Never share a diagonal. Detour cardinal (pay the pit or go around). Barrier a spoke. Hug. Kill the glass Cantor (`hp` ~0.70).
- If only the Mason lives, this is `FSN-PIT-RANK` minus the Lancer.

MAP_REQUIREMENTS:

- `chessboard` or `fortress` with **one 3-tile diagonal plus a cardinal gallery**. Reject a single-tile tunnel.
- Reroll on tiny `ruinsIslands` pockets with no 3-tile diagonal.
- No Barrier already occupying the spoke at spawn.

AI_REQUIREMENTS:

- Oblique: caster; diagonal-gate (`aiHint` from #342). VETERAN skip off-axis.
- Pit: setter; never pit the diagonal spoke the Cantor needs (that would be LoS suicide).
- Soph 1–2.

VARIANTS:

- `FSN-BIAS-PIT/FROST` — Cantor Frost-only if `diagonal` catalog split is not ready; **reroll the id** rather than import `shadow_strike`.
- `FSN-BIAS-PIT/E-RAY` — elite Cantor, still no Lock, still no second gun.

STATUS: PROPOSED

---

### FSN-DRAW-CASH

FORMATION_ID: `FSN-DRAW-CASH`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-PAIR` — `bishop` / proposed `pair_binder` — pack median — clumps
- `ROLE-IGNITE` — `queen` **without heal** / proposed `ignite_alchemist` — pack median — cashes

VARIANT_RULES:

- Teaching cell for Pair Court minus the Rat. Distinct from `FSN-STACK-CASH` (rat applies, alchemist cashes) and `FSN-HOOK-SLAM` (one-body pull). This attract is **two hostiles toward each other**.
- CELL: Binder Draw Together + Frost. Alchemist Poison + Ignite. Inferno stays off until a BRIGADE variant.
- Elite: Alchemist only. Binder stays junior so two attract elites cannot pin onto a fuse (no fuse on this sheet).
- Unlock after `FSN-STACK-CASH` **or** `FSN-TRADE-HOLE` (player has seen stacked DoT **or** two-body displacement).
- Weight 0 if the player has no summon **and** no second player-side body — Draw fizzles. Reroll rather than Frost-only fake.
- No Sink, no Hook, no Rat on the base sheet (`/RAT` is Pair Court).
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Draw Together: 0 HP. Each of two hostiles `applyAttract` 1 toward midpoint. Isolate (desummon) is a complete answer.
- Ignite: 8 + 6×stacks, then consume. VETERAN refuse at 1 stack. Do not also Inferno the same AP bar.
- Alchemist may apply **one** Poison if the player has no stacks yet (BASE). Binder does **not** apply DoT (healAmount / drain ban).

TACTICAL_PLAN:

- Binder Draws only if midpoint sit stacks the Wisp onto the player **or** onto a cell the Alchemist can Ignite next. Skip if already adjacent in a safe pocket.
- Alchemist waits until stacks ≥ 2 **or** the clump just happened, then Ignites.
- Hostiles start ≥ 4 apart so turn-1 is not attract+cash.

SYNERGY:

- Displacement specialist + debuffer/finisher (payoff). Wave 5 Pair Binder standing on Wave 3 Ignite. They clump your bodies; the cash is why standing together is expensive — isolate is still complete.

PLAYER_THREAT:

- A burst you can see charging on the bar **and** on occupancy. Spike is the cash-in, not a stun.

COUNTERPLAY:

- Desummon. Stand 5+ apart. Nail Down one body. Cleanse. Burst the Alchemist (`hp` ~0.75). Kill the glass Binder (`hp` ~0.75).
- Self Anchor one body.

MAP_REQUIREMENTS:

- `openField` or `arena`. Needs space to stand 5 apart. Reject `corridorMaze` (forced clump + Ignite is a lock).
- No Glass Realm. No Thorned Ground on every approach.

AI_REQUIREMENTS:

- Pair: caster; two-hostile + midpoint-improves (`aiHint` from #342). VETERAN fizzle-aware.
- Ignite: caster; stack gate. Soph 2–3.
- `groupTactics` optional at soph 3.

VARIANTS:

- `FSN-DRAW-CASH/RAT` — add live `plague_rat` (Pair Court). Still one Ignite cadence. Still no Sink.
- `FSN-DRAW-CASH/E-CASH` — elite Alchemist, two-turn clump-then-cash.

STATUS: PROPOSED

---

### FSN-LEDGER-LEY

FORMATION_ID: `FSN-LEDGER-LEY`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-LEDGER` — `bishop` / proposed `ledger_siphon` — pack median — steals leftover **AP**
- `ROLE-LEY` — `bishop` / proposed `ley_tollkeeper` — pack median — spends **MP** to prime

VARIANT_RULES:

- Teaching cell for Ledger Choir minus the Stinger. Distinct from `FSN-LEY-SIP` (MP-prime + **MP**-steal) and `FSN-HEX-BLOOD` (Enrage). This is **two resources**: leftover AP as a steal, current MP as a spend.
- Band 0: **do not spawn this id** (Ley Toll is illegal without an MP debit; AP Sip is invisible without leftover-AP on the decide context). Show `FSN-LEY-SIP` if that debit exists, else `FSN-TIDE-LOCK`.
- Band 1: AP Sip + Frost on the Ledger. Ley Toll + Frost on the Tollkeeper. **No** Inferno, no Slow on either body (Slow would hide the steal identity), no Hex Toll, no Soul Sip.
- Elite: Tollkeeper only. Ledger stays junior so two AP elites cannot pin leftover at 0.
- Unlock after `FSN-LEY-SIP` (player has seen MP as a spend **and** a steal).
- Random 30% family lottery is **off**.
- If enemy decide context has no `currentAp` / `currentMp`, **reroll this id**.

SPELL_POOL_INTERACTIONS:

- AP Sip: steal 1 current leftover AP, grant 1 to Ledger this turn. Fizzles at 0.
- Ley Toll: `mpCost: 2`, next-spell ×1.25, one charge. Charge consumes even on fizzle. Frost is the primed follow-up on CELL (Inferno is `/STING` BRIGADE+).
- Do not also attach tide melee −1 MP. Do not Hex Toll the same AP bar.

TACTICAL_PLAN:

- Ledger Sips if player leftover AP ≥ 1, else Frosts. Init 1.35 so the steal lands before their spell.
- Tollkeeper primes only if leftover MP still allows a 1-step **or** they do not need to walk this turn, then Frosts the primed charge.
- Hostiles start ≥ 4 apart so one Linear does not delete both.

SYNERGY:

- Debuffer (AP steal) + buffer (MP spend to prime). Wave 5 Ledger standing on drop-5’s Ley. Readable two-body, two resources — not a lock: dump AP before Sip init, dump walk before Toll.

PLAYER_THREAT:

- Tempo. Fail state is “I saved 3 AP for Inferno, they stole 1, then primed Frost.” Recoverable: spend the nuke first, sit at 0 AP, burst the glass Ledger (`hp` ~0.70).

COUNTERPLAY:

- Dump leftover AP before Sip init. Dump MP before Toll. Kill the Ledger first in Ledger Choir. Walk into melee — both are bishops.
- Hex Toll / Quiet Hex the primed body (player-side). Do not stand still on Time Warp.

MAP_REQUIREMENTS:

- `openField` or `arena`. Both bishops need range 3–4 and a retreat tile. Reject `corridorMaze`.
- No ice sheet on both approaches (ice + MP prime is a second MP story).

AI_REQUIREMENTS:

- Ledger: caster + skip-at-0 (`aiHint: "steal_ap_if_target_leftover_ge_1"`).
- Ley: caster + MP gate (`aiHint: "prime_if_mp_ge_2_and_nuke_ready"`).
- Soph 2–3. Blackboard (`plannedPrime`) is BRIGADE `/STING`.

VARIANTS:

- `FSN-LEDGER-LEY/NO-PRIME` — Tollkeeper Frost-only if MP debit is not ready; **reroll the id** rather than fake Ley with Enrage.
- `FSN-LEDGER-LEY/STING` — add `ROLE-STINGER` / `far_stinger` (Ledger Choir). Still no Hex Toll. Still one Slow source (none). Far Sting only at Chebyshev ≥ 3.

STATUS: PROPOSED

---

### FSN-CHECK-LEASH

FORMATION_ID: `FSN-CHECK-LEASH`  
RELATIVE_DIFFICULTY: CELL (kit band 0–1)  
ENEMIES:

- `ROLE-SHOVE` — `rook` / proposed `shove_chaplain` — pack median + 1 — ally **away**
- `ROLE-CHAPLAIN` — `rook` / proposed `hook_chaplain` — pack median — ally **to caster**

VARIANT_RULES:

- Teaching cell for Shove School minus the Stride Hunter. Distinct from `FSN-HOOK-SLAM` (hostile pull + hostile push) and `FSN-RESCUE-LINE` (Leash + warden + sniper). This is **two ally-move verbs** with opposite dirs.
- Band 0: both Strike / Shield if Body Check / Leash Hook apply is missing — **reroll** rather than fake with Bash (hostile). Show `FSN-RESCUE-LINE` if Leash exists but Check does not.
- Band 1: Body Check + Leash Hook. A third allied body is required (pet or a live `iron_golem` extra). If the pack would be two rooks and no pet, **add** a wolf overlay on **one** body only, or reroll.
- Elite: Shove only. Hook stays junior so two displacement elites cannot pin the pet onto lava.
- Unlock after `FSN-RESCUE-LINE` **or** `FSN-HOOK-SLAM` (player has seen an ally pull **or** a hostile push).
- No Bash Bruiser. No Pincer on CELL (that is Gate).
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Body Check: `applyPushback` 1 on an ally, away from caster. Dest-check.
- Leash Hook: pull ally to a free adjacent cell. Occupying the Chaplain’s ring is the counter. Root on the ally **blocks** the pull.
- Neither id damages. Strike is the only chip. Shield / Iron Skin on the moved ally (ally `targetId` apply — honesty gap from drop 2).

TACTICAL_PLAN:

- Hook pulls the pet onto a choke the player must cross **or** off lava.
- Shove peels the pet **away** from a fuse / onto a pincer cell / off a bad tile. Skip if landing is lava while ally HP% is under 40.
- They should not Check then Hook the same AP round on the same body (yo-yo). One move per allied body per round (TEM hygiene, `AI-FUT-51` analog).

SYNERGY:

- Protector + protector (opposite ally displacement). Wave 5 Shove standing on Wave 3 Hook. Teaching: **away** vs **to caster**. The pet is the payload, not a new sprite.

PLAYER_THREAT:

- Occupancy. Fail state is “I occupied the Hook ring and they shoved the pet through me onto the file.” Recoverable: desummon, Nail Down, occupy the only push cell.

COUNTERPLAY:

- Desummon. Self Anchor the pet. Stand in the only Check dest. Occupy Hook-adjacent cells. Kill the glasser of the two (`hp` ~1.05 / ~1.00 — burst the one that just spent).

MAP_REQUIREMENTS:

- `fortress` or `asymmetric` with a choke plus a peel pocket. Reject a 1-tile closet.
- Dest must leave a walk-off for the **player**.

AI_REQUIREMENTS:

- Shove: guardian; dest-check (`aiHint` from #342).
- Hook: guardian after pull; skip if no free adjacent cell.
- Soph 2–3. Both need enemy-side ally targeting (not “prefer the player,” `AI-FUT-50`).

VARIANTS:

- `FSN-CHECK-LEASH/GOLEM` — the moved body is live `iron_golem` (no summon engine).
- `FSN-CHECK-LEASH/E-SHOVE` — elite Chaplain, still one Leash.

STATUS: PROPOSED

---

### FSN-GALE-PIT

FORMATION_ID: `FSN-GALE-PIT`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-GALE` — `queen` **without heal** / proposed `gale_deacon` — pack median — back
- `ROLE-PIT` — `rook` / proposed `pit_mason` — pack median + 1 — front-mid
- `ROLE-FUSE` — `queen` **without heal** / proposed `fuse_binder` — pack median — opposite corner

VARIANT_RULES:

- Named Wave 5 pack. Distinct from `FSN-WICK-COURT` (fuse + sink + bash) and `FSN-TRADE-TRAP` (trade + pit + fuse). The cone **pushes** onto pit / fuse occupancy.
- Band 1: Gale + Pit + Fuse. One Inferno **off**. One live fuse. One live pit. Never fuse **and** pit both walk-offs.
- Elite: Deacon only.
- Unlock after `FSN-GALE-HOLE` **and** (`FSN-WICK-STEP` or `FSN-TRADE-TRAP`).
- No Fan Prelate. No Misstep on the base sheet (`/MISSTEP` below).
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Gale landing must tick fuse occupancy **and** pit (you stay on pit; fuse still ticks if you occupy at tock).
- Fuse: 0 on cast, 2-turn occupancy bomb. Caster death does not cancel. Step off / teleport off before tick.
- Do not also Root + Slow. Do not Glass Realm.

TACTICAL_PLAN:

- Binder fuses a choke, never both exits, never the tile under a full-HP player on turn 1 if they can still walk around.
- Mason pits the **other** likely landing in the Deacon’s wedge.
- Deacon Gales only if a push cell is pit **or** fuse **or** open with a side step. VETERAN skip if every push is blocked.
- ELITE Deacon may wait one turn if Pit / Fuse will hold the landing (`AI-TEM` wait).

SYNERGY:

- Hazard creator + displacement + delayed timer. `FSN-GALE-HOLE` plus drop-4’s wick. Two clocks, one shove — still two walk-offs.

PLAYER_THREAT:

- Positional, two timers. Fail state is “I stepped off the wick onto the pit, then they Galed me back.” Recoverable: hug, Barrier the fuse, occupy the pit.

COUNTERPLAY:

- Hug. Split the wedge. Leave fused cells. Barrier replaces fuse. Kill the glass Binder (`hp` ~0.80) so only one timer remains.

MAP_REQUIREMENTS:

- `arena` or `asymmetric` with pillars / a wall 2 tiles from typical stand, plus **two** walk-offs. Reject `corridorMaze`.
- No lava dest. No Void Rift as a legal landing.

AI_REQUIREMENTS:

- Gale: wait-for-hazard at ELITE.
- Pit / Fuse: never both exits; never the only tile that reaches the Deacon.
- Soph 3–4. `groupTactics` on.

VARIANTS:

- `FSN-GALE-PIT/MISSTEP` — replace Fuse with `ROLE-MISSTEP` / `misstep_herald` (Misstep Pit). Force a cardinal onto the hole, then fan. **Do not** also add Rank Lock (two walk rewrites). Don’t-walk is still a complete answer.
- `FSN-GALE-PIT/E-GALE` — elite Deacon, still one fuse, one pit.

STATUS: PROPOSED

---

### FSN-TWIN-KENNEL

FORMATION_ID: `FSN-TWIN-KENNEL`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-SENTRY` — `king` **without heal** / proposed `twin_sentry` — pack median — high init
- `ROLE` summoner — `bishop` / live `brood_chanter` — pack median
- `ROLE-WARDEN` — `rook` / live `leash_warden` (Wave 1) — pack median + 1 — occupies

VARIANT_RULES:

- Named Wave 5 pack. Distinct from `FSN-KENNEL-LITANY` (no swap) and `FSN-PACK-PINCER` (assassin, not swap). Swap the pet into the choke; Warden occupies.
- Band 1: Twin Guard + wolf + Warden Strike / occupy. No Inferno. No second summon engine.
- Elite: Sentry only.
- Unlock after `FSN-TWIN-BROOD`.
- No Bait / Pylon / Font on the base sheet (`/BAIT` below). No Pawn Trade.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Twin Guard swaps pet ↔ Warden or pet ↔ Chanter. Caster stays.
- Warden is the fat body the player must chew if swapped forward. Shield / Iron Skin on the newly fronted body (ally apply).
- Wolf 0 extra XP. Cap 2. Fall-through if cap/CD (`AI-FUT-49`).

TACTICAL_PLAN:

- Chanter plants. Warden walks the choke. Sentry swaps if the trade puts the squishy behind the Warden **or** the pet onto the file the player must cross.
- Skip if the swap is safer for the player.
- Leader is the Sentry (cut first). Boost from CADRE up does **not** apply at BRIGADE unless a variant says so — this sheet: no leader boost yet.

SYNERGY:

- Protector + summoner + tank. `FSN-TWIN-BROOD` plus Wave 1 occupy. Isolate is still complete.

PLAYER_THREAT:

- Occupancy yo-yo. Not a one-shot.

COUNTERPLAY:

- Desummon. Kill the pet. Null the Chanter. Burst Sentry. Stand so both landings are equal.
- Do not also get sandwiched (`FSN-PINCER-GATE` is the next sheet).

MAP_REQUIREMENTS:

- `fortress` or `openField` with a choke plus a backline pocket. Weight 0 on 1-tile closets.

AI_REQUIREMENTS:

- Sentry: ELITE choke-trade, never random.
- Warden: charger / occupy; `AI-FUT-50` ward is enemy-side.
- Soph 3–4.

VARIANTS:

- `FSN-TWIN-KENNEL/BAIT` — replace Warden with `ROLE-BAIT` / `bait_prelate` (Bait Gate lite: swap the bait into intercept range). **Do not** also keep a pylon/font/turret. Null Censor stays off this variant (full Gate is `FSN-BAIT-GATE`). Chip the 1 HP.
- `FSN-TWIN-KENNEL/E-SWAP` — elite Sentry, still one pet.

STATUS: PROPOSED

---

### FSN-PINCER-GATE

FORMATION_ID: `FSN-PINCER-GATE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-PINCER` — `knight` / proposed `pincer_acolyte` — pack median + 1
- `ROLE-GOAD` — `pawn` or `knight` / proposed `goad_herald` — pack median
- `ROLE-WARDEN` — `rook` / live `leash_warden` — pack median + 1 — second adjacency

VARIANT_RULES:

- Named Wave 5 pack. Distinct from `FSN-BASTION-GATE` (pylon + goad + sniper) and `FSN-PACK-PINCER`. Taunt into two-body adjacency.
- Band 1: Cross Flank + Goad + Warden occupy. No Rear Cut. No Shadow Lurker.
- Elite: Acolyte only.
- Unlock after `FSN-PINCH-GOAD`.
- No Surplus on the base sheet (`/SURPLUS` below). No Pain Link.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Goad forces the damaging swing at the Herald if legal. Warden + Herald are two bodies; Acolyte completes.
- AoE that includes the Herald satisfies Goad **and** can miss the Acolyte.
- Do not also Inferno.

TACTICAL_PLAN:

- Herald Goads adjacent. Warden walks the other flank (Chebyshev 1 to the player if they stay). Acolyte completes and Crosses.
- If the player already left one body, Acolyte Strikes rather than skip.

SYNERGY:

- Assassin + controller + tank. `FSN-PINCH-GOAD` plus occupy. Walk off one body is still complete; the Warden is why that walk costs a hit.

PLAYER_THREAT:

- Occupancy burst ~18 plus a forced swing. Not a lock: non-damage tools ignore Goad; Chebyshev 2 breaks pincer.

COUNTERPLAY:

- Walk to 2 from one body. Absolve Goad. Slow the completer. AoE the Herald. Kill Acolyte (`hp` ~0.80).

MAP_REQUIREMENTS:

- `openField` or `arena`. Reject 1-tile tunnel.

AI_REQUIREMENTS:

- Pincer: ELITE path to complete, not nearest.
- Goad / Warden: occupy. Soph 3–4. `groupTactics` on.

VARIANTS:

- `FSN-PINCER-GATE/SURPLUS` — replace Warden with `ROLE-SURPLUS` / `surplus_warder` + keep Goad (Surplus Goad minus Absolver). Forced swing misses **if** leftover AP ≥ 2 after Ward. **Do not** also add Sidestep. Drain leftover AP first. Full three-body with Absolver is `FSN-PINCER-GATE/SURPLUS-ABSOLVE` only after `FSN-EVADE-GOAD` (Absolve the taunt) — still not a new `FSN-*` base id.
- `FSN-PINCER-GATE/E-PINCH` — elite Acolyte, still one Goad.

STATUS: PROPOSED

---

### FSN-SHOVE-SCHOOL

FORMATION_ID: `FSN-SHOVE-SCHOOL`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-SHOVE` — `rook` / proposed `shove_chaplain` — pack median + 1
- `ROLE-CHAPLAIN` — `rook` / proposed `hook_chaplain` — pack median
- `ROLE-STRIDE` — `knight` / proposed `stride_hunter` — pack median — brands the landing

VARIANT_RULES:

- Named Wave 5 pack. Distinct from `FSN-GATE-COURT` (pads + slide + stride) and `FSN-CHECK-LEASH` (no brand). Ally **away** vs ally **to caster**; brand the landing because Check/Hook set `movedThisTurn`.
- Band 1: Body Check + Leash Hook + Stride Brand. Brand only if `movedThisTurn` is **public**. Skip Brand if they camped.
- Hook is the one summon engine (wolf). Do not also roll bait/font/pylon/turret.
- Elite: Hunter only (the payoff). Chaplains stay junior.
- Unlock after `FSN-CHECK-LEASH` **and** (`FSN-GATE-COURT` or `FSN-KICK-STING` — player has seen `movedThisTurn` as a brand window).
- No Bash. No Coup / Jackal (three wait-windows).
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Body Check and Leash Hook move **allies only**. Body Check on the player is illegal on this card.
- Pack size stays 3. Hook is the one summon engine (`isSummoner` wolf) so Check/Hook have a body to move. `/WOLF` is the default shipping variant; without a pet, Check/Hook reposition the Hunter (peel off lava / onto a file) and still never shove the player.
- Hunter Brands the **player** if the player’s `movedThisTurn` is public (their walk, Back Step, slide enter, gate enter). Ally shoves do not fake that flag on the player. Camping is a complete answer. Cleanse does **not** clear the flag (not a debuff).
- Stride Brand: 8, or 8+12 if `movedThisTurn`. Do not also Coup / Jackal.

TACTICAL_PLAN:

- Hook / Check reposition **allies**, never the player.
- Hunter Brands if the player moved this round (slide leftover, gate, self-knockback, ordinary walk). If they camped, Strike.
- One ally-move per body per round.

SYNERGY:

- Protector + protector + assassin (moved-window). `FSN-CHECK-LEASH` plus drop-5’s Stride. Camping answers the Hunter; occupying dests answers the Chaplains.

PLAYER_THREAT:

- Conditional 20 on a public flag. Not a stun.

COUNTERPLAY:

- Camp. Desummon. Nail Down. Occupy dests. Kill Hunter (`hp` ~glass-mid). Hex Toll is off this sheet.

MAP_REQUIREMENTS:

- `fortress` or `openField`. Reject closets.
- `movedThisTurn` plumbing required (`FSN-GATE-COURT` gate).

AI_REQUIREMENTS:

- Shove: ELITE combo-landing.
- Hook: skip no-dest.
- Stride: skip if flag false (`aiHint` from Wave 4).
- Soph 3–4.

VARIANTS:

- `FSN-SHOVE-SCHOOL/WOLF` — Hook is `isSummoner` wolf (one engine). Hunter never also summons.
- `FSN-SHOVE-SCHOOL/E-BRAND` — elite Hunter, still skip if they camped.

STATUS: PROPOSED

---

### FSN-OBLIQUE-FILE

FORMATION_ID: `FSN-OBLIQUE-FILE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-OBLIQUE` — `bishop` / proposed `oblique_cantor` — pack median
- `ROLE-LOCK` — `rook` / proposed `axis_locksmith` — pack median + 1
- `ROLE-PIT` — `rook` / proposed `pit_mason` — pack median + 1
- Optional 4th: none on base (Misstep is a variant of `FSN-GALE-PIT`, not this base — two walk rewrites)

VARIANT_RULES:

- Named Wave 5 pack. Distinct from `FSN-FAN-FILE` (cone + lock + root) and `FSN-BIAS-PIT` (no lock). Lock then diagonal poke through a LoS-open hole.
- Band 1–2: Bias Ray + Rank Lock + Open Pit. Root **off** (Fan-File already taught lock+root). Slow off. Inferno off.
- Elite: Cantor only. Locksmith junior so two rewrite elites cannot freeze a dead-end.
- Unlock after `FSN-BIAS-PIT` **and** `FSN-LOCK-FAN`.
- Leader: Cantor. Boost 10% per fallen non-leader. Player can cut the leader first.
- Random 30% family lottery is **off**.
- Never lock a player onto a 1-tile dead-end. Never pit both walk-offs.

SPELL_POOL_INTERACTIONS:

- Rank Lock: walk rank **or** file for 2 turns. Forced movement allowed. Swap / Back Step / Twin Gate / Absolve / wait are answers.
- Bias Ray still needs a diagonal. Lock a rank so the only cheap step is onto a diagonal spoke **or** a pit.
- Pit: LoS open. Ray does not cheat LoS.

TACTICAL_PLAN:

- Locksmith locks the axis that makes the diagonal the remaining gun lane.
- Mason pits the locked-axis escape that isn’t the spoke.
- Cantor Rays if `|dx| === |dy|`, else Frosts. ELITE waits for the lock.

SYNERGY:

- Artillery + movement controller + hazard. `FSN-BIAS-PIT` plus drop-5’s Lock. The lock is why “just walk cardinal” is slower; wait / swap still complete.

PLAYER_THREAT:

- Geometry plus a 2-turn walk rewrite. Not a stun. Not a hardlock: duration 2, forced-move legal, hug Chebyshev 1.

COUNTERPLAY:

- Wait the lock. Swap. Walk the blocked-cell rule if they also Misstep (they must not on this base). Hug. Barrier the spoke. Kill the Cantor first (leader).

MAP_REQUIREMENTS:

- `chessboard` or `fortress` with a 3-tile diagonal **and** a 4-tile file. Reject tunnels.
- `finalizePlayableLayout` still owns generated maps — pits are battle-time paints.

AI_REQUIREMENTS:

- Lock: skip if already locked; skip if already on a dead-end file.
- Oblique: ELITE wait-for-lock.
- Pit: never pit the spoke.
- Soph 4–6. Leader cut is public.

VARIANTS:

- `FSN-OBLIQUE-FILE/LENS` — add `ROLE-SHARE` / `share_optic` instead of Pit (ray to 6, still `maxSpellRange` clamp). Isolated 1v1 **reroll** Share. Do not also add Glass Sniper (two guns without pit).
- `FSN-OBLIQUE-FILE/E-RAY` — elite Cantor, still no Root, still no Misstep.

STATUS: PROPOSED

---

### FSN-MORROW-SNARE

FORMATION_ID: `FSN-MORROW-SNARE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-MORROW` — `bishop` / proposed `morrow_walker` — pack median — paints dest
- `ROLE-ORIGIN` — `rook` or `bishop` / proposed `origin_mason` — pack median — taxes whoever casts from the **old** cell and/or the dest
- `ROLE-TRAPPER` — `rook` / proposed `trip_mason` — pack median + 1 — wire on dest or old cell

VARIANT_RULES:

- Named Wave 5 pack. Distinct from `FSN-GATE-COURT` (pads, enter now) and `FSN-MIST-HUNT` (instant dash). Paint the blink dest; tax whoever casts from the old cell; trip the arrival.
- Band 1–2: Morrow Step + Cast Snare + Tripwire. **Today’s `isTrap → placeBarrier` must be redefined before Trip ships** (drop 3 law). If trip apply is still a fake wall, **reroll Trip** to Mark-as-decoy only and keep this id as Morrow + Origin (still CADRE, 2 bodies + a Mark tile) — do not ship a sealed pocket.
- Elite: Walker only.
- Unlock after `FSN-GATE-COURT` **or** `FSN-MIST-HUNT` (player has seen a self-teleport) **and** a tile-tax sheet (`FSN-GRAVITY-TAX` or Origin paint visible).
- No Mist Walker, no Twin Porter, no Tax Scribe, no Hex Toll on the base sheet (`/HEX` below).
- Leader: Origin Mason (the tax). Cut first.
- Random 30% family lottery is **off**.
- Teleport / Mist Step / Morrow arrival **does not** trip wires (Wave 2 trap identity) — the **landing cell** may still be taxed as a **cast origin** next turn. Trip on the dest fires on **walk enter**, not blink. Honest sheet: Trip the **old** cell they leave if something walks it, Origin-tax the dest so **casting on arrival** is expensive. Do not trip the dest as a blink-catch (would violate trap identity).

SPELL_POOL_INTERACTIONS:

- Morrow: paint now, blink at next turn start if `isCellFree`. Sit on the mark → fizzle.
- Cast Snare: +1 AP to cast **from** the cell. Walk does not pay. Attack Nearest origin is the player tile (if they camped the old cell, their nuke is taxed).
- Tripwire: hidden enter-damage + root on **walk**. Must not be the only tile that reaches the backliner. Probe with a summon must be possible.
- Do not Time Warp. Do not fuse the dest (two delayed clocks).

TACTICAL_PLAN:

- Walker paints dest behind self if kiting; skip if dest is adjacent to the player.
- Mason paints Cast Snare on the **current** player tile (if they hold a 3-cost) **and/or** the Morrow dest (ELITE). Cap 2 live glyphs.
- Trapper wires a walk-approach to the dest, never both walk-offs, never the dest itself as a blink-catch.

SYNERGY:

- Teleporter + hazard (origin tax) + trapper. Wave 5 Morrow standing on Wave 5 Origin and Wave 2 Trip. Occupy dest answers the blink; step off answers the tax; probe answers the wire.

PLAYER_THREAT:

- Delayed reposition plus expensive camping. Not unavoidable: sit on the mark, walk 1 off a glyph, wait arrival and Strike.

COUNTERPLAY:

- Sit on the Morrow mark. Barrier dest. Cast from a neighbor tile. Kill Walker before turn start (`hp` ~0.80). Kill Mason (leader). Probe wires with a summon.

MAP_REQUIREMENTS:

- `asymmetric` or `void_rift`-tagged maps with open floor dests. Weight 0 on 1-tile closets.
- Dest must be free floor at paint time. No portal reuse.

AI_REQUIREMENTS:

- Morrow: VETERAN skip dest-adjacent-to-player.
- Origin: skip if they must walk off; ELITE paint the Morrow dest.
- Trapper: place then step off (VETERAN); cap 2 live traps; blink does not trip.
- Soph 4–6. Summoner overlay **off**.

VARIANTS:

- `FSN-MORROW-SNARE/HEX` — replace Trip with `ROLE-HEX` / `hex_teller` (Origin Tax: origin + hex + a gun). Add `ROLE-SNIPER` / `glass_sniper` **instead of** Morrow if packing Origin Tax named pack: Mason + Sniper + Hex. **COURT-flavored CADRE.** Tile origin + unit next-cast — never also Tax Scribe. Cheap Strike burns Hex. Step off burns origin. Two AP stories, two answers.
- `FSN-MORROW-SNARE/E-BLINK` — elite Walker, still skip dest-adjacent.

STATUS: PROPOSED

---

### FSN-SATED-PLATE

FORMATION_ID: `FSN-SATED-PLATE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-SATED` — `knight` / proposed `sated_knight` — pack median + 1 — Fang while ≥70%
- `ROLE-CANTOR` — `queen` / live `pale_cantor` (Wave 1) — pack median — the **one** heal engine
- `ROLE-PLATE` — `rook` / proposed `plate_warden` — pack median + 1 — absorb the punish

VARIANT_RULES:

- Named Wave 5 pack. Distinct from `FSN-WARD-MEND` (tank + healer, no HP% gate), `FSN-MEND-KNIFE` (heal + assassin), `FSN-COUP-ROT` (≤25%). Heal to keep ≥70%; absorb the punish.
- Band 1–2: Sated Fang + Cantor ally-tools (`starter-shield` / Iron Skin; `starter-heal` is **self-only** — Cantor CORE must be the Wave 1 heal kit **without** putting `healAmount` on Sated or Plate). If live Cantor kit is still `starter-heal` self-only, this sheet **must not ship** until a ranged ally heal id exists **or** Font pulse is the heal (`/FONT` variant). Teaching fallback: Cantor Shields the Knight; Knight uses potions-equivalent? **No player potions on enemies.** Honest fallback: `ROLE-FONT` / `font_cantor` replaces Cantor (`FSN-SATED-PLATE/FONT`) — planting is not a heal; pulse is. Do **not** PAIR Font + Pale Cantor (drop 5 law) — this variant **replaces**, not stacks.
- Elite: Knight only. Never two heal engines.
- Unlock after `FSN-WARD-MEND` **and** (`FSN-COUP-ROT` or `FSN-BELL-CUT`) so the player has seen a heal tank **and** an HP% window (this one is the **high** bar).
- No Coup, no Jackal, no Crimson Spawn, no Sanguine Toll.
- Leader: Cantor / Font (the sustain). Cut first.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Sated Fang: legal only at HP% ≥ 70. Chip below → Strike / Shield. Absorb is **not** HP — Fang reads HP.
- Plate: unused plate expires. DoTs chew it. Do not dump two Infernos into a fresh plate on the same round. Replace, do not stack, plate.
- Cantor / Font: one heal cadence. `no_healing` / `hard_1` trip on pulse / mend. Pacifist: Fang is damaging.

TACTICAL_PLAN:

- Plate the Knight. Cantor / Font tops the bar. Knight Fangs only while ≥70%. ELITE Knight paths to Cantor range rather than eat lava.
- If the player chips below 70, Knight Strikes and peels to the heal engine rather than greed a 5-cost fail.

SYNERGY:

- Bruiser (high-HP% physical) + healer + tank (absorb). Wave 5 Sated standing on Wave 1 Cantor and Wave 2 Plate. Chip the bar; the Fang turns off. Cut the leader so it stays off.

PLAYER_THREAT:

- A heavy physical while they look healthy. Fail state is “I let the Cantor top them twice.” Recoverable: poke before Fang, Cursed Wound, Bitter Cup the next mend (`/CUP`).

COUNTERPLAY:

- Chip below 70%. Kill Cantor / Font first (leader). DoT the plate. Goad a waste Strike. Do not also Coup (banned).

MAP_REQUIREMENTS:

- `arena` or `openField`. Heal engine needs range 2–3. Reject lava-on-every-approach.

AI_REQUIREMENTS:

- Sated: charger; HP% gate (`aiHint` from #342). VETERAN skip Fang under 70. **No** `healAmount` on CORE (`inferArchetype` would steal healer).
- Cantor / Font: healer / font AI. Font: `summonAI === "font"`, `mp: 0`, no path. Fall-through (`AI-FUT-49`).
- Plate: charger; retreat disabled above 40% **effective** (HP+absorb).
- Soph 4–6.

VARIANTS:

- `FSN-SATED-PLATE/FONT` — Font replaces Cantor (still one heal engine). Pulse trips `no_healing`.
- `FSN-SATED-PLATE/CUP` — replace Plate with `ROLE-BITTER` / `bitter_censor` + replace Cantor with `font_cantor` + add live `cinder_martyr` (Bitter Font). Invert the pulse; Martyr is not a second Cantor. **Do not** also Null Censor. Skip the pulse. Absolve the Cup. Kill the Censor first. This variant is CADRE-hard; still not a PAIR of Bitter+Null.

STATUS: PROPOSED

---

### FSN-BAIT-GATE

FORMATION_ID: `FSN-BAIT-GATE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-BAIT` — `king` / proposed `bait_prelate` — pack median — plants intercept
- `ROLE-TANK` — `rook` / live `iron_golem` — pack median + 1 — the body they want to snipe
- `ROLE` anti-summon — `bishop` / live `null_censor` (Wave 1) — pack median — **counter** to extra summons, not a second bait

VARIANT_RULES:

- Named Wave 5 pack. Distinct from `FSN-BASTION-GATE` (empty pylon + goad + sniper), `FSN-NULL-WALL` (censor + tank, no intercept), `FSN-FONT-GATE` (heal totem). Intercept the snipe; Null is why you cannot just flood pets into the bait.
- Band 1–2: Bait Pylon + Golem Strike / Iron Skin + Null Brand. **No** second post. **No** wolf overlay on the Prelate. **No** Mirror as identity (Bait **eats**, Mirror **reflects**).
- Elite: Prelate only.
- Unlock after `FSN-NULL-WALL` **and** (`FSN-BASTION-GATE` or `FSN-FONT-GATE`) — player has seen a post **and** an anti-summon.
- Leader: Prelate. Cut first so the intercept dies with the owner’s next plant CD.
- Random 30% family lottery is **off**.
- Weight 0 on cramped 1-tile closets.

SPELL_POOL_INTERACTIONS:

- Bait: 1 HP, lifespan 3, intercept Chebyshev ≤ 2 from owner. Chip the 1 HP. Sit outside 2. AoE: owner share eaten, rest of wedge hits others. 0 XP on bait death. Cap shares `ENEMY_SUMMON_CAP`. Nested eat never owned.
- Golem: the snipe magnet. Shield the **owner**, not the 1-HP post (ELITE).
- Null: summon lockout. Player-side pets that would chip the bait get branded. Do **not** also Bitter (two censors).
- Fall-through if bait cap/CD (`AI-FUT-49`) → Shield the Golem.

TACTICAL_PLAN:

- Prelate plants bait covering the Golem, not an easy Strike from the player. Skip if cap reached.
- Golem occupies. Censor Brands a summon if present, else Frosts (no healAmount).
- CHAMPION may Twin-Sentry-pack — **not on this base** (that is `/SWAP` via `FSN-TWIN-KENNEL/BAIT`).

SYNERGY:

- Protector (intercept) + tank + anti-summon. Wave 5 Bait standing on live Golem and Wave 1 Null. Chip the post; sit outside 2; Null is the answer to “I’ll just send a wolf.”

PLAYER_THREAT:

- Wasted nuke on a 1-HP eat. Not unavoidable: Strike the bait, wait lifespan 3, AoE after it dies.

COUNTERPLAY:

- Chip the bait (1 HP). Cast from Chebyshev 3. Wait 3 turns. Kill Prelate (leader). Do not dump Inferno into intercept 2.

MAP_REQUIREMENTS:

- `fortress` or `openField` with a post pocket Chebyshev 2 from the Golem **and** a lane at 3. Reject closets.

AI_REQUIREMENTS:

- Bait: `summonAI === "bait"` — never `name.includes("bait")`. `mp: 0`, must not path. VETERAN respect cap. ELITE Shield the owner.
- Golem: charger / tank.
- Null: caster; skip if no summon.
- Soph 4–6.

VARIANTS:

- `FSN-BAIT-GATE/SWAP` — Sentry replaces Null (swap bait into intercept after the player commits an angle). Still one post. Still no Font/Pylon/Turret.
- `FSN-BAIT-GATE/E-POST` — elite Prelate, still 1-HP bait, still lifespan 3.

STATUS: PROPOSED

---

### FSN-VERSE-PULPIT

FORMATION_ID: `FSN-VERSE-PULPIT`  
RELATIVE_DIFFICULTY: COURT (kit band 2)  
ENEMIES:

- `ROLE-VERSE` — `bishop` or `queen` **without heal** / proposed `verse_scribe` — pack median — leader, echoes last id at 50%
- `ROLE-TEMPO` — `king` / proposed `tempo_precentor` — pack median — gifts AP so they fire a stealable Frost
- `ROLE-SNIPER` — `bishop` / proposed `glass_sniper` or live `wraith_bishop` — pack median — the gun that makes holding the nuke expensive
- `ROLE-WARDEN` — `rook` / live `iron_golem` or `leash_warden` — pack median + 1 — occupy / peel

VARIANT_RULES:

- Named Wave 5 pack as COURT (leader-boost CADRE prerequisite from **any** catalog). Distinct from `FSN-LENS-BATTERY` (ally-range + two guns) and `FSN-CHORUS-THRONE` (choir + sniper). Gift AP so they fire a stealable Frost; do **not** PAIR two scribes.
- Band 2: Stolen Verse + Tempo Gift + minRange sniper Frost + Warden occupy. Inferno **off** on Verse CORE (if they steal **your** Inferno that is the point — do not also kit Inferno on Verse). One elite rare: Verse may echo a legal last id; Tempo is the rare-adjacent gift (family-flip Tempo).
- Elite: Verse only. Tempo stays junior so two AP-gift elites cannot stack (Tempo replace, not stack — still one gift).
- Unlock after a leader-boost CADRE from **any** catalog **and** (`FSN-TEMPO-CHOIR` or `FSN-LEY-COURT`) **and** `FSN-GLASS-WARD`.
- No Bone Scribe. No After Verse / Echo Cast / False Echo. No Far Sting without Share (drop 5 gun law) — this COURT has **one** gun.
- Leader: Verse. Boost 10% per fallen non-leader. Cut first.
- Isolated Tempo 1v1 **reroll** that overlay — COURT always has three other bodies.
- Random 30% family lottery is **off**.
- Do not Time Warp (echo window). Do not Glass Realm.

SPELL_POOL_INTERACTIONS:

- Stolen Verse: 50% re-resolve of last `castResult === "cast"` hostile id. Denylist includes summons, gates, Morrow, Ley, Timestep, Sacrifice, Verse itself, After Verse, Echo, Cut In, Sanguine Toll. Skip echoing Strike if Frost is legal. Original MP / HP riders do not re-fire.
- Tempo: +1 AP **next** turn, replace not stack. Challenge `hard_3` still counts spends. Gift the **player**? **No** — gift the Sniper (payoff body), not self, not Verse (Verse already spends 3 to echo).
- Sniper: minRange 3, refuse dest ≤ 2. Closing is the answer; Tempo is why holding Frost “until Verse is spent” costs a Tempo’d shot.
- Warden: occupy / Iron Skin the Verse.

TACTICAL_PLAN:

- Tempo gifts the Sniper. Sniper Frosts if the player holds a nuke (bait a stealable id) or if Verse already spent.
- Verse waits one turn if they have not spent a stealable id yet (ELITE). Then echoes Frost / Bias / Inferno (yours) at 50%.
- Warden peels. Leader boost if Warden / Tempo fall — still cut Verse first.
- CHAMPION Verse may Goad a cheap Strike so the stolen id is Strike — **only if** Inferno is not already last. Goad is not on the base roster; `/GOAD` variant.

SYNERGY:

- Controller (echo) + buffer (tempo) + artillery + protector. Wave 5 Verse standing on Wave 3 Tempo and Wave 1 glass gun. Holding the nuke until Verse spends is the decision; Tempo + Sniper is why waiting is not free.

PLAYER_THREAT:

- Half your last spell plus a Tempo’d Frost. Not a lock: denylist utility last, kill Verse, fizzle the original (no last-resolved), close the Sniper.

COUNTERPLAY:

- Cast a denylisted utility last (Swap, Timestep if you have it — enemies may not). Kill Verse first (leader, `hp` ~0.70). Close the Sniper. Quiet Hex. Do not Inferno while Verse is up unless you can also kill Verse the same round.
- Spend Tempo’d AP on a walk if needed — wasted gift is fine.

MAP_REQUIREMENTS:

- `fortress` or `openField` with a main lane plus one side aisle (Sniper needs a kite ring). Reject a single-tile tunnel (gun + echo in a hallway is a lock).
- Four bodies start ≥ Chebyshev 4 from each other and the player.

AI_REQUIREMENTS:

- Verse: `aiHint: "echo_hostile_last"`. VETERAN skip empty/denylist. ELITE wait-for-nuke. Last-resolved is **public** (`castResult === "cast"` log) — no hidden intent (`AI-FUT-52` is last **player dest**, not last spell; do not conflate).
- Tempo: buffer (`AI-ROL-05`); skip duplicate Tempo; gift the gun.
- Sniper: minRange 3.
- Warden: occupy. Soph 6–8. `groupTactics` on. Focus-fire (`AI-SYS-08` still unread live — do not require it to ship the sheet; prefer public kill-the-leader).

VARIANTS:

- `FSN-VERSE-PULPIT/GOAD` — replace Warden with `ROLE-GOAD` so CHAMPION can force a cheap Strike (worse echo). Absolve the Goad. Still one gun.
- `FSN-VERSE-PULPIT/E-ECHO` — elite Verse, still no After Verse, still denylist.

STATUS: PROPOSED

---

## Unlock graph (relative — not a last band)

```
FSN-LOCK-FAN ─┐
FSN-PIT-RANK ─┴─ FSN-GALE-HOLE ── FSN-GALE-PIT [/MISSTEP]
FSN-WICK-STEP / FSN-TRADE-TRAP ──┘

FSN-KENNEL-LITANY ── FSN-TWIN-BROOD ── FSN-TWIN-KENNEL [/BAIT]

FSN-BASTION-GATE / FSN-EVADE-GOAD ── FSN-PINCH-GOAD ── FSN-PINCER-GATE [/SURPLUS]

FSN-PIT-RANK / FSN-GLASS-WARD ── FSN-BIAS-PIT ── FSN-OBLIQUE-FILE
FSN-LOCK-FAN ─────────────────────┘

FSN-STACK-CASH / FSN-TRADE-HOLE ── FSN-DRAW-CASH [/RAT]

FSN-LEY-SIP ── FSN-LEDGER-LEY [/STING]

FSN-RESCUE-LINE / FSN-HOOK-SLAM ── FSN-CHECK-LEASH ── FSN-SHOVE-SCHOOL
FSN-GATE-COURT / FSN-KICK-STING ─┘

FSN-GATE-COURT / FSN-MIST-HUNT ── FSN-MORROW-SNARE [/HEX]
FSN-GRAVITY-TAX ─────────────────┘

FSN-WARD-MEND ── FSN-SATED-PLATE [/FONT] [/CUP]
FSN-COUP-ROT / FSN-BELL-CUT ─┘

FSN-NULL-WALL ── FSN-BAIT-GATE [/SWAP]
FSN-BASTION-GATE / FSN-FONT-GATE ─┘

any leader CADRE ── FSN-VERSE-PULPIT
FSN-TEMPO-CHOIR / FSN-LEY-COURT ─┘
FSN-GLASS-WARD ─────────────────┘
```

A run may skip a **branch**. It must not skip a **grade**. Dungeon depth may add a body or a tier step; it must not jump `FSN-GALE-HOLE` to `FSN-VERSE-PULPIT`.

### Deferred — Wave 6 families / Wave 5 SPELL_PROPOSALS (not this drop)

Same-day sibling [`ENEMY_ELITE_EVOLUTION_2026-09-23.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-23.md) (open as PR #452) sheets **Wave 6** families that consume [`SPELL_PROPOSALS_2026-09-22.md`](../automation/SPELL_PROPOSALS_2026-09-22.md) (open as PR #411: Oncoming, Facing Pin, Glance Cut, Mute Thread, Stride Mute, Queue Cut, False Cut, File Vault, Span Guard, Span Pylon, Cadence Theft, Cadence Brand, Cover Step, Low Lintel, Act Tax, Act Bell). **This catalog does not mint `FSN-*` ids for them.** The next formation drop packs those families. Do not duplicate this drop’s 16 ids.

Discovery leftovers still unfamilied (do not steal): `spell-still-brand` (punish standing — opposite of Stride), `spell-grounded-lock` (no swap/blink — distinct from Rank Lock).

Keep older law: do **not** pack `coup_duelist` with `bell_sexton` as a teaching pair.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–5, plus Wave 5 verbs in this order (from elite-evolution 2026-09-22 §8 and AI 09-22):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920).
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11997). Stop writing `res`/`sp` as 0.05–0.75 (`spawnPolicy.ts` 261–272).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse (`docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04, AI-ROL-05).
4. **MP debit** in `executeCastAttempt` / enemy decide (`WX` 17096+). **`FSN-LEDGER-LEY` must not ship before that debit exists** (Ley half). Leftover **AP** on decide context for AP Sip / Surplus Ward.
5. Ally buff / ally-move apply (`targetId` on Shield / Iron Skin / Tempo / Twin Guard / Body Check / Leash). **`FSN-TWIN-BROOD`, `FSN-CHECK-LEASH`, `FSN-SATED-PLATE`, `FSN-VERSE-PULPIT` must not ship before that apply exists.**
6. `areaShape: "cone"` reader in `targeting.ts` (today unread; area is Chebyshev at 694–721). **`FSN-GALE-HOLE` / `FSN-GALE-PIT` must not ship as a blob.** Then per-body `applyPushback` 1.
7. `applyAttract` pair-midpoint caller. `applyPushback` on **allies** (Body Check) and on Gale landings. Dest legality.
8. `swapTwoAllies` (not `isSwap`, not `swapTwoHostiles`). Pit table (`isCellFree` false, LoS open). Morrow mark table that is **not** occupancy `portals`.
9. `evadeNextHits` consume **before** `dealDamage`, gated on leftover AP ≥ 2 after debit (Surplus). Cross Flank occupancy count before `dealDamage`. Bias Ray uses live `diagonal` gate (already on area paths at 712).
10. `movedThisTurn` plumbing on occupancy commits; clear at **that unit’s** turn start. Cast-origin AP tax in `planPlayerCastAttempt` / Attack Nearest (origin = player tile). Hex Toll remains a `/HEX` variant gate.
11. Bait / font summon AI (`mp: 0`, no path, `summonAI === "bait"|"font"` — never `name.includes`). Intercept **before** Mirror. Cap the summoner overlay (`WX` 11932–11942). Fall-through on cap/CD (`AI-FUT-49`). Summon snapshot `allyCount` is acting-side (`AI-SYS-33`).
12. Last-resolved `castResult === "cast"` pipeline per combatant (Stolen Verse). Denylist by **id**. 50% re-resolve; original MP/HP riders do not re-fire.
13. Misstep dir in the walk stepper + preview parity; duration 1; blocked dest → other dir legal. Bitter Cup in the heal pipeline; self-HP costs are not heals; order vs Cursed Wound.
14. Sated Fang HP% gate; absorb is not HP. Discovery: family observe must not double-grant ACHIEVEMENT / BOSS / CHALLENGE / MULTI_SOURCE doors (`first_blood`, `doka_hoarder`, `rich_vampire`, `betrayal_witness`, `lord_of_static`, `morrow_herald`).

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order changes, or damage-formula edits. Map **selection** is a filter on already generated maps. Queue Cut / Act Bell / False Cut stay off every sheet (turn-queue PR, not this catalog).

Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-GALE-HOLE`, `FSN-GALE-PIT` | `areaShape` cone reader + per-body push + dest legality |
| `FSN-TWIN-BROOD`, `FSN-TWIN-KENNEL` | `swapTwoAllies` + landing legality + summoner fall-through |
| `FSN-PINCH-GOAD`, `FSN-PINCER-GATE` | occupancy count (`requireTwoAlliesAdjacent`); `tauntCasterId` |
| `FSN-BIAS-PIT`, `FSN-OBLIQUE-FILE` | catalog `diagonal` on Bias Ray; pit LoS split; Rank Lock walk stepper on the CADRE |
| `FSN-DRAW-CASH` | pair `applyAttract` toward midpoint; Ignite stack gate |
| `FSN-LEDGER-LEY` | leftover AP on decide + MP debit (Ley) |
| `FSN-CHECK-LEASH`, `FSN-SHOVE-SCHOOL` | ally push / ally pull callers + dest legality; `movedThisTurn` for Brand |
| `FSN-MORROW-SNARE` | turn-start arrival; `gatePads`/marks ≠ world portals; Cast Snare origin check; trip ≠ `placeBarrier` |
| `FSN-SATED-PLATE` | HP% ≥ 70 gate; ally heal apply **or** font pulse; plate replace-not-stack |
| `FSN-BAIT-GATE` | `summonAI === "bait"`; intercept before Mirror; 1 HP after `hpScale` rounding |
| `FSN-VERSE-PULPIT` | last-resolved pipeline + denylist; Tempo gift the gun; ally apply |
| `FSN-GALE-PIT/MISSTEP` | walk stepper dir; skip if all cardinals safe |
| `FSN-SATED-PLATE/CUP` | heal invert; Cup before Cursed Wound; no Null Censor |
| `FSN-MORROW-SNARE/HEX` | Hex Toll AP gate; still no Tax Scribe |

---

## Sources (line-accurate, 2026-09-23)

- Kits / inference / decide / summoner skip / name heuristic: `src/frontend/src/engine/enemyAI.ts` 163–185, 194–199, 218–223, 447–476, 1662–1706, 1832–1888
- Kit assignment + summoner roll + HP overwrite: `src/frontend/src/components/WorldExploration.tsx` 11920, 11932–11942, 11970–11974, 11991–11997
- Cast helper (AP-only): `WorldExploration.tsx` `executeCastAttempt` 17096+
- Family lottery + spacing: `src/frontend/src/engine/spawnPolicy.ts` 35–57, 261–297, 38; WX 5763, 5855, 5862–5866
- Ember / tide melee hooks: `WorldExploration.tsx` 16789–16818
- Void reflect: `src/frontend/src/engine/castHelpers.ts` 335–337
- Push / attract (no spell caller): `src/frontend/src/engine/occupancy.ts` 482 / 537
- Portals impassable: `occupancy.ts` 13–14, 40
- Area = Chebyshev, `areaShape` unread: `targeting.ts` 694–721; type at `gameTypes.ts` 224
- `spell.diagonal` on area paths: `targeting.ts` 712
- Trap still Barrier: `spellEngine.ts` 442
- Gates, summon cap, kamikaze: `src/frontend/src/data/gameConstants.ts` 200–209, 271–301
- Families: `src/frontend/src/types/gameTypes.ts` 12–20
- Spells: `src/frontend/src/data/spellData.ts` (`starter-heal` 85–101 self-only; Enrage ally 274–289; unique flags 143–686)
- Map archetypes: `src/frontend/src/engine/mapGen.ts` 6–44
- Wave 5 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-22.md` §3–§4 (PR #405)
- Wave 4 spell verbs this drop consumes: `docs/automation/SPELL_PROPOSALS_2026-09-21.md` (PR #342) + Discovery Wave 4 (PR #371)
- Wave 5 leftover spells (Wave 6 families in PR #452; next formation drop): `docs/automation/SPELL_PROPOSALS_2026-09-22.md` (PR #411), `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-23.md` (PR #452)
- AI honesty this drop leans on: `docs/ENEMY_AI_EVOLUTION_2026-09-22.md` AI-SYS-33/34/35, AI-FUT-49/50/51 (PR #416)
- Drop 1: `docs/design/ENEMY_FORMATIONS_2026-08-31.md`
- Drop 2: `docs/design/ENEMY_FORMATIONS_2026-09-01.md`
- Drop 3: `docs/design/ENEMY_FORMATIONS_2026-09-02.md`
- Drop 4: `docs/design/ENEMY_FORMATIONS_2026-09-21.md` (PR #348)
- Drop 5: `docs/design/ENEMY_FORMATIONS_2026-09-22.md` (PR #401)

Every row above is **STATUS: PROPOSED**. No production spawn, kit, or AI in this change.

# Enemy synergy and formation catalog (drop 5)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-09-22  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–4 already taught the seven pairing words and Waves 1–3 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 4 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-09-21.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-21.md) (open as PR #349): Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Push School, Evade Goad.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4, Wave 3 packs — open as PR #348). Family sheets: [`ENEMY_ELITE_EVOLUTION_2026-09-21.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-21.md). Spell verbs: [`SPELL_PROPOSALS_2026-09-02.md`](../automation/SPELL_PROPOSALS_2026-09-02.md) (Wave 3 ids this drop consumes).

**Hard rules (Wave 4 pack law):**

- Do **not** pack `twin_porter` with `mist_walker` as a PAIR (two self-teleports). `FSN-MIST-HUNT` stays the dash lesson.
- Do **not** pack `font_cantor` with `pale_cantor` as a PAIR (two heal sources). `FSN-WARD-MEND` / `FSN-QUIET-CHOIR` stay caster-heal.
- Do **not** pack `pawn_broker` with `rift_hook` as a PAIR (two swaps). `FSN-EMBER-RIFT` / `FSN-HOOK-FUSE` stay caster↔player.
- Do **not** pack `hex_teller` with `tax_scribe` or `coil_arbiter` as a PAIR (two AP engines). COURT only, never this drop’s teaching pair.
- Do **not** pack `stride_hunter` with `execute_jackal` or `coup_duelist` as a PAIR (three “wait for the window” assassins). `FSN-BELL-CUT` / `FSN-COUP-ROT` stay HP-window.
- Do **not** pack `far_stinger` with `glass_sniper` as a PAIR without `share_optic`. Two long guns without a range **grant** is the same lesson twice. `FSN-LENS-BATTERY` is the COURT that makes the difference readable.
- Do **not** pack `coup_duelist` with `bell_sexton` as a PAIR (drop 4 law still stands).

Wave 4 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-09-21.md`: Gale Fan, Twin Guard, After Verse, Sanguine Toll, …) stay **unfamilied**. This drop does **not** mint `FSN-*` ids for them.

---

## Grounding (live, 2026-09-22)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drop 4’s 2026-09-21 pass. Family lottery still lives in `spawnPolicy.ts`.

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
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 218–223 |
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
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ / `planPlayerCastAttempt` |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442 |
| Enemy-legal unique spells | `spellData.ts` 143–686 (`usableByEnemy` flags) |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–289 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Summoner slots need `isSummoner` + a usable summon id. Dedicated font / pylon / turret / familiar bodies **replace** the random overlay on that slot. Cap one pylon **or** turret **or** font, not two.
3. Any `healAmount` steals healer. **Do not put drain, nova, or `starter-heal` on Ley, Sip, Fan, Broker, Recoil, Porter, Sidestep, Stinger, Pit, Share, Stride, Hex, Slide, or Lock.** Font Cantor plants; **planting is not a heal** — pulse is.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Leash Hook / Ward Plate / Lens Share until a ranged heal id exists.
5. `spell-rallying-cry` stays `usableByEnemy: false`. `spell-ley-toll` / `spell-mercy-font` / `spell-lens-share` ship player-first — only the named overlay may family-flip that one id.
6. `summon-sentinel`, `summon-bomber`, `summon-wisp` stay enemy-false except as **late COURT flag-unlocks** already named in drop 1. Font is a **different** id (`spell-mercy-font`). Do not co-spawn font with pylon or turret.
7. `starter-blast` has **no** `usableByEnemy` flag. Fan Prelate uses `spell-fan-bolt` via `areaShape: "cone"`, not blast, unless a variant says otherwise. Do not invent `thunder_clap` / `void_collapse` on a sheet unless that sheet names them as a COURT rare and the id is already in admin seed.
8. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies. Sidestep is **not** a miss formula — it is `evadeNextHits: 1`.
9. Push dest, hook landing, sink landing, bash dest, **slide dest**, **self-knockback dest**, **trade landing**: free floor, not lava / spikes / void / portal / pit, player keeps ≥ 1 escape tile. Twin Gate pads must **not** reuse occupancy `portals`. Teleport / Mist Step does not pay rime or trip wires; fuse still ticks occupancy; slide / gate enter **does** set `movedThisTurn`.
10. Dual Slow / Frost / tide melee / rime enter MP tax: cap applied unit MP debuff at **−2**. Soul Sip is **current** MP steal (separate axis). Ley Toll spends **caster** current MP. One Slow source per pack. Do not also Root + Rank Lock + Slow on the same AP bar.
11. `far_stinger` + `glass_sniper` as a PAIR without `share_optic` is **banned**. Hex Ledger in Wave 4’s pack table is therefore **not** a teaching pair in this catalog — it is a COURT variant of `FSN-LENS-BATTERY` (`/HEX`) after the player has seen both guns separately.
12. Wave 4 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-09-21.md`) stay **unfamilied**. A later elite-evolution wave must sheet families before a formation drop packs them.

### Relative difficulty (same grades as drops 1–4)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1/2/3/4 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a MP decision) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (warden / tank / bruiser / pusher / lancer / goad / chaplain / pylon-owner / plate / tether / pit-mason / locksmith / recoil): pack median + one step.
- Backliner (sniper / stinger / ley / sip / fan / broker / porter / share / hex / slide / font-owner): pack median.
- Glass (rat, coup, mist, sidestep): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 5)

Drop 1–4 overlays still apply. These are **additional jobs** for Wave 4 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-LEY` | `bishop` or `queen` **without** heal | proposed `ley_tollkeeper` | `spell-ley-toll`, `starter-frost` — **illegal to ship without MP debit** | caster; skip prime if `currentMp < 2` or no damaging id ready; never prime-then-stuck |
| `ROLE-SIP` | `bishop` | proposed `soul_siphon` | `spell-soul-sip`, `starter-frost` — **0 HP damage** | caster; skip if target MP is 0; steal **current** MP, no lingering debuff |
| `ROLE-FAN` | `queen` or `king` **without** heal | proposed `fan_prelate` | `starter-frost`, `spell-mark`; `spell-fan-bolt` at CELL+ | artillery; Fan only if two player-side bodies sit in the 90° wedge; hug = immune |
| `ROLE-BROKER` | `king` or `queen` **without** heal | proposed `pawn_broker` | `spell-pawn-trade`, `starter-frost` — **0 damage on the trade**; **no** `isSwap` | caster; skip if only one player-side body; skip if the swap is safer for the player |
| `ROLE-RECOIL` | `knight` or `pawn` | proposed `recoil_squire` | `physical_attack`, `spell-back-step` | flanker; self-push 2 if adjacent **and** dest is free, non-hazard, non-pit; skip in a corner |
| `ROLE-PORTER` | `bishop` | proposed `twin_porter` | `spell-twin-gate`, `starter-frost` — **0 damage on the plant** | caster; plant pad B behind self if kiting; skip if dest is adjacent to the player; never reuse occupancy `portals` |
| `ROLE-SIDESTEP` | `knight` | proposed `sidestep_warder` | `spell-sidestep-ward`, `physical_attack` — **no** `buffStat: "evasion"` | flanker; evade if player adjacent and can Strike; skip if already charged; 0-damage control does not consume |
| `ROLE-STINGER` | `bishop` | proposed `far_stinger` | `spell-far-sting`, `starter-frost` — `minRange: 2` | caster; Sting if Chebyshev ≥ 3; Frost at 2; refuse at 1; never the only body in a 1-pack |
| `ROLE-PIT` | `rook` | proposed `pit_mason` | `spell-open-pit`, `physical_attack` — **0 HP on the paint** | setter; pit a melee approach; never pit a cell the player can ignore; occupant at paint is **not** displaced |
| `ROLE-FONT` | `king` | proposed `font_cantor` | `spell-mercy-font` (family flip `usableByEnemy` for this id only) — **no** `healAmount` on CORE | `isSummoner` for the font id only; pet `mp: 0`, **must not path**; kit `spell-font-pulse` only; no wolf/archer/pylon/turret overlay |
| `ROLE-SHARE` | `bishop` | proposed `share_optic` | `spell-lens-share` — **no** heal, no Short Sight | buffer (`AI-ROL-05`); share the ally with the longest `modifiableRange` id; skip duplicate; isolated 1v1 **reroll** |
| `ROLE-STRIDE` | `knight` | proposed `stride_hunter` | `physical_attack`, `spell-stride-brand` | flanker; Brand only if `movedThisTurn` is **public**; skip if they camped (Strike / Frost) |
| `ROLE-HEX` | `bishop` | proposed `hex_teller` | `spell-hex-toll`, `starter-frost` — **0 damage** | caster; skip if tax already live; skip if the bar is all 2-cost; walk / potions do not consume |
| `ROLE-SLIDE` | `queen` **without** heal or `bishop` | proposed `slide_mason` | `spell-slide-tile`, `starter-frost` — **0 HP on the paint** | setter; skip no-op dirs; standing at paint does **not** slide; dest must leave a walk-off |
| `ROLE-LOCK` | `rook` | proposed `axis_locksmith` | `spell-rank-lock`, `starter-frost` — **0 damage on the lock** | caster; skip if already locked; skip if the player is already on a dead-end file; forced move still works |

Drop-2/3/4 `ROLE-LANCER` / `ROLE-PUSHER` / `ROLE-ROOTER` / `ROLE-SNIPER` / `ROLE-WARDEN` / `ROLE-TANK` / `ROLE-GOAD` / `ROLE-ABSOLVER` / `ROLE-FUSE` / `ROLE-TRAPPER` are reused below. Do not also roll the random 12% summoner overlay onto Ley, Sip, Fan, Broker, Porter, Share, Hex, Slide, Lock, Pit, or Font. One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** pylon **or** font — never two engines).

### Fair-fight rules (every sheet)

Same as drops 1–4, plus Wave 4:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, barrier, live fuse, pit, or a slide whose stored dir dumps into those.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Kamikaze never detonates on a single full-HP player.
- Swap / pull / push / sink / **slide** / **self-knockback** / **trade** dest: free floor, not lava / spikes / void / portal / pit, player keeps ≥ 1 escape tile.
- Ley Toll: `mpCost: 2`, next-spell ×1.25, one charge. Charge consumes even on fizzle. **Do not ship until `executeCastAttempt` / enemy decide debit MP.** Never prime as the last action if they still need to walk.
- Soul Sip: steal 1 **current** MP, grant 1 to caster this turn. Fizzles at target MP 0. Not a linger Slow.
- Fan Bolt: 90° wedge, radius 3. Hug the caster. Diagonals of the facing are safe. Skip without two player-side bodies in the wedge. **Do not ship as a Chebyshev blob.**
- Pawn Trade: two **player-side** bodies swap; caster stays. Isolate (desummon) is a complete answer. Hazard on landing must tick. Never trade onto lava / the last exit.
- Back Step: `applyPushback` on the **caster**, distance 2, from an adjacent hostile. Corner = 0. Sets `movedThisTurn`.
- Twin Gate: two **walkable** pads in a new `gatePads` table. Must **not** use occupancy `portals`. Enter teleports once per event. Barrier replaces a pad. Death-realm portal guards do **not** fire. Skip if dest is adjacent to the player (they will use it).
- Sidestep Ward: next damaging instance vs this unit **misses** (no HP, no absorb chew, no DoT apply). Timeout 2 turns. AoE: first instance misses, second hits. Slow / Barrier / Swap do not consume. Lava/spikes do not consume.
- Far Sting: 6 + 4×Chebyshev, bonus cap 16, `minRange: 2`. Close is the answer. Short Sight **hurts** this card (decision).
- Open Pit: walk-block, LoS **open**. Occupant at paint stays. Teleport / Mist Step over works. Never pit **both** walk-offs. Never pit the only tile that reaches the backliner.
- Mercy Font: occupies, lifespan 4, pulse 8 ally heal range 2, `mp: 0`, must not path. Planting is not a heal. `no_healing` / `hard_1` trip on the **pulse**. 0 XP on font death. Weight 0 on cramped 1-tile closets.
- Lens Share: +2 range for 2 turns on the **ally**. Strike stays unmodified. Isolated 1v1 rerolls this overlay.
- Stride Brand: 8, or 8+12 if `movedThisTurn`. Camping is a complete answer. Cleanse does **not** clear the flag (not a debuff).
- Hex Toll: next **spell** +1 AP, 2 turns or until a successful spell spend. Walk / potions do not consume. If they cannot pay, reject and the tax **remains**. Cheap Strike burns it.
- Slide Tile: enter → push 1 along stored dir. Standing at paint does not slide. One slide per cell; no bounce-loop. Sets `movedThisTurn`. Dest must leave a walk-off.
- Rank Lock: walk rank **or** file for 2 turns. Forced movement allowed. Swap / Back Step / Twin Gate / Absolve / wait are answers. Never lock a player onto a 1-tile dead-end.
- Pain Link + Goad together is **COURT only**. Not on any base sheet in this drop.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- No Glass Realm on stacked-DoT, Ignite, Fuse, Brand, or Ley-prime sheets. No Time Warp on Fuse / Brand / Hex / Lock / Trade windows.
- Summons stay at cap 2. Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.

---

## Index (all five catalogs)

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
| `FSN-LEY-SIP` | PAIR | MP-prime + MP-steal | this drop |
| `FSN-KICK-STING` | PAIR | self-knockback + distance sniper | this drop |
| `FSN-FONT-IRON` | PAIR | heal totem + tank | this drop |
| `FSN-PIT-RANK` | PAIR | pit + lancer | this drop |
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
| `FSN-TRADE-HOLE` | CELL | two-hostile swap + pit | this drop |
| `FSN-SLIDE-BASH` | CELL | conveyor + push | this drop |
| `FSN-LOCK-FAN` | CELL | walk-axis lock + cone | this drop |
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
| `FSN-LEY-COURT` | BRIGADE | prime + steal + sting | this drop |
| `FSN-PUSH-SCHOOL` | BRIGADE | self-push + they-push + pit | this drop |
| `FSN-TRADE-TRAP` | BRIGADE | trade + pit + fuse | this drop |
| `FSN-FONT-GATE` | BRIGADE | font + warden + golem | this drop |
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
| `FSN-FAN-FILE` | CADRE | cone + axis lock + root | this drop |
| `FSN-RECOIL-HUNT` | CADRE | kick + sting + evade | this drop |
| `FSN-GATE-COURT` | CADRE | pads + slide + stride brand | this drop |
| `FSN-EVADE-GOAD` | CADRE | evade + taunt + cleanse | this drop |
| `FSN-CROWN-ESCORT` | COURT | dual golem + king + controller | 2026-08-31 |
| `FSN-CHORUS-THRONE` | COURT | choir + sniper, leader | 2026-09-01 |
| `FSN-SHARD-BATTERY` | COURT | turret + ricochet + glyph | 2026-09-02 |
| `FSN-BASTION-GATE` | COURT | pylon + goad + sniper | 2026-09-21 |
| `FSN-LENS-BATTERY` | COURT | ally-range + two guns, leader | this drop |

---

## Formations

### FSN-LEY-SIP

FORMATION_ID: `FSN-LEY-SIP`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-LEY` — `bishop` / proposed `ley_tollkeeper` — pack median — back
- `ROLE-SIP` — `bishop` / proposed `soul_siphon` — pack median — mid-back, opposite corner

VARIANT_RULES:

- Teaching pair for Ley Court minus the gun. Distinct from `FSN-TIDE-LOCK` (Slow / Haste **debuff and grant**) and `FSN-HEX-BLOOD` (Enrage). This is **current MP as a spend** plus **current MP as a steal**.
- Band 0: **do not spawn this id** (Ley Toll is illegal without an MP debit, and band 0 kits have no extra verbs). Show `FSN-IRON-BATTERY` or `FSN-TIDE-LOCK` instead.
- Band 1: Ley Toll + Frost on the Tollkeeper. Soul Sip + Frost on the Siphon. **No** Inferno, no Slow on either body (Slow would hide the steal identity).
- Elite: Tollkeeper only. Siphon stays junior so two MP elites cannot pin current MP at 0.
- Unlock after `FSN-TIDE-LOCK` (player has seen an MP tax) **or** after they have spent MP to walk past a kiter this run.
- Random 30% family lottery is **off**.
- If enemy decide context has no `currentMp`, **reroll this id**.

SPELL_POOL_INTERACTIONS:

- Ley Toll costs 2 current MP and primes the next damaging spell ×1.25. Charge consumes even on fizzle. Frost is the primed follow-up on PAIR (Inferno is BRIGADE+).
- Soul Sip steals 1 current MP and grants it to the Siphon this turn. Fizzles at 0. Combined with Toll it can **pay** the 2-MP prime if the Siphon acts first (init 1.30 vs 1.20) — readable two-body, not a lock: the player can dump walk before Sip init.
- Do not also attach tide melee −1 MP (no `tide_shade` on this sheet).

TACTICAL_PLAN:

- Siphon Sips if player MP ≥ 2, else Frosts.
- Tollkeeper primes only if leftover MP still allows a 1-step **or** they do not need to walk this turn, then Frosts the primed charge.
- Hostiles start ≥ 4 apart so one Linear does not delete both.

SYNERGY:

- Buffer (MP spend to prime) + controller (MP steal). Wave 4 Ley Court minus the Stinger. The steal funds the prime; closing still works because neither body is a gun.

PLAYER_THREAT:

- Tempo. Fail state is “I saved 2 MP to close, they stole 1, then primed Frost.” Recoverable: spend walk first, sit at 0, burst the glass Siphon (`hp` ~0.70).

COUNTERPLAY:

- Dump MP before Sip init. Kill the Siphon. Hex Toll / Quiet Hex the primed body (player-side). Walk into melee — both are bishops.
- Do not stand still on Time Warp — that modifier is **banned** on this id.

MAP_REQUIREMENTS:

- `openField` or `arena`. Both bishops need range 3–4 and a retreat tile. Reject `corridorMaze` (two backliners in a hallway plus MP tax is a lock).
- No ice sheet on both approaches (ice + steal + prime is three MP stories).

AI_REQUIREMENTS:

- Ley: caster + MP gate (`aiHint: "prime_if_mp_ge_2_and_nuke_ready"`).
- Sip: caster + skip-at-0.
- Soph 1–2. `groupTactics` not required. Blackboard later (`plannedPrime`) is BRIGADE.

VARIANTS:

- `FSN-LEY-SIP/NO-PRIME` — Tollkeeper Frost-only if MP debit is not ready; **reroll the id** rather than fake Ley with Enrage.
- `FSN-LEY-SIP/E-TOLL` — elite Tollkeeper, still no Inferno on PAIR.

STATUS: PROPOSED

---

### FSN-KICK-STING

FORMATION_ID: `FSN-KICK-STING`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-RECOIL` — `knight` / proposed `recoil_squire` — pack median — starts wide
- `ROLE-STINGER` — `bishop` / proposed `far_stinger` — pack median — back, LoS down a **wide** lane

VARIANT_RULES:

- Teaching pair for Recoil Hunt minus Sidestep. Distinct from `FSN-GLASS-WARD` (flat min-range sniper + peel) and `FSN-IRON-TIDE` (golem + kite). The knight **creates** the tape measure by kicking itself to 2–3.
- Band 0: Recoil is Strike only **if** Back Step has no caller — **do not spawn this id** until `applyPushback` has a self-push caller. Stinger may Frost-only until Far Sting’s distance rider exists; if both verbs are missing, **reroll**.
- Band 1: Back Step + Far Sting. Recoil never carries Far Sting on CORE (CHAMPION pack-sting is Recoil Hunt).
- Elite: Stinger only. Recoil stays junior so two elites cannot kick-then-delete from full HP.
- Unlock after `FSN-GLASS-WARD` **or** `FSN-IRON-TIDE` (player has seen a keep-range gun **or** a kiter).
- If pack size would be 1, **reroll** (Stinger must not spawn solo — Wave 4 family rule).
- No Swap, no Inferno, no Sidestep, no Share Optic (that is COURT).

SPELL_POOL_INTERACTIONS:

- Back Step: self push 2 from an adjacent hostile. Corner = 0. Sets `movedThisTurn` (unused on PAIR — Stride is CADRE).
- Far Sting: 6 + 4×Chebyshev, `minRange: 2`. At dist 2 the Stinger Frosts instead (VETERAN). Closing to 1 is a complete answer.
- Recoil landing must not be a pit / lava / the player’s last exit.

TACTICAL_PLAN:

- Stinger holds Chebyshev ≥ 3 and Stings. Recoil walks a flank, Strikes if already at 2–3, Back Steps if the player stepped adjacent.
- Recoil does not path through the Stinger’s tile. Never turn-1 surround.

SYNERGY:

- Kiter (self-knockback) + artillery (distance-scaled). Combination, not a new sprite. The kick is why hugging the knight does not also hug the gun.

PLAYER_THREAT:

- Readable geometry. Fail state is “I punched the knight and it skated to 3, then the bishop’s tape measured 4.” Recoverable: fight in a closet, occupy the two tiles behind the knight.

COUNTERPLAY:

- Close to Chebyshev 1 on the Stinger (hp ~0.65). Corner the Recoil. Slow after they land. Do not give them a 2-tile aisle.
- Smoke / Barrier the file. Short Sight (player) hurts Far Sting — intended.

MAP_REQUIREMENTS:

- `openField`, `arena`, or `chessboard` with **wide** files. Reject a 1-tile tunnel (kick in a closet is either 0 or a lock).
- Recoil needs two free cells behind typical melee. Stinger needs a step-off.

AI_REQUIREMENTS:

- Recoil: flanker + dest-check (VETERAN skip pit/lava).
- Stinger: caster + minRange 2 + dist-gate.
- Soph 1–2.

VARIANTS:

- `FSN-KICK-STING/FROST` — Stinger Frost-only if the distance rider is not ready (softer PAIR; still two bodies).
- `FSN-KICK-STING/E-TAPE` — elite Stinger, hold the 4–5 band, still no Nova.

STATUS: PROPOSED

---

### FSN-FONT-IRON

FORMATION_ID: `FSN-FONT-IRON`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-FONT` — `king` / proposed `font_cantor` — pack median — back, `isSummoner` for the font id only
- `ROLE-TANK` — `rook` / live `iron_golem` — pack median + 1 — front

VARIANT_RULES:

- Teaching pair for Font Gate minus the Warden. Distinct from `FSN-WARD-MEND` (caster self-heal) and `FSN-KENNEL-LITANY` (mobile wolf). The refill is a **stationary post**.
- Band 0: **do not spawn this id** (font is a summon id, not band 0 Strike). Show `FSN-WARD-MEND` if heal band is numeric, else `FSN-IRON-BATTERY`.
- Font kit: Mercy Font only on CORE. **No** `starter-heal` on the Cantor (heal-first would skip planting). Shield / Iron Skin land on the **font**, not as a second heal identity.
- Elite: Tank only. Font stays junior so two elites cannot sponge plus pulse.
- Unlock after `FSN-WARD-MEND` **or** `FSN-KENNEL-LITANY` (player has seen a heal body **or** a summon engine).
- Do not also roll wolf/archer/pylon/turret overlay. Cap 1 living font (below global cap 2).
- `pale_cantor` is **absent** (two heal sources is the banned PAIR).

SPELL_POOL_INTERACTIONS:

- Font pulse 8 ally heal, range 2, lifespan 4. Planting is not a heal. `no_healing` / `hard_1` trip on the **pulse**.
- Iron Skin on the Golem. Font death is 0 XP.
- Proposed fall-through: Cantor Shields / Frosts when cap/cooldown hits (today summoner skip-locks — must not ship as a wasted-turn bug).

TACTICAL_PLAN:

- Turn 1–2: Golem walks up. Cantor waits for a **legal plant** behind the Golem (free, non-hazard, not the player’s only exit, pulse range covers the Tank); else ring-scan.
- If the font dies, remaining pair is a golem + a king with no nuke — intended.

SYNERGY:

- Tank + healer, **re-keyed** as inertia + totem. Same chassis as `FSN-WARD-MEND`, different contract: kill the post, not a queen.

PLAYER_THREAT:

- Long fight. Spike is low. Fail is ignoring the font for four pulses.

COUNTERPLAY:

- Burst the font (`hpScale` 0.6). Sit on the placement cell. Cursed Wound the Golem. Walk around (`iron_golem` MP is low).
- Null Censor is a **counter**, not a member.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Font placement ring: ≥ 3 free cells, none void. Reject cramped 1-tile closets (weight 0).
- No Thorned Ground on the only path to the font.

AI_REQUIREMENTS:

- Font owner: summoner + proposed cap/cooldown fall-through. New summon AI `font` — `inferSummonArchetype` must key `summonAI === "font"`, never `name.includes("font")`.
- Tank: charger.
- Soph 1–2.

VARIANTS:

- `FSN-FONT-IRON/WARD` — BRIGADE-shaped: add `ROLE-WARDEN` (that is `FSN-FONT-GATE`).
- `FSN-FONT-IRON/E-IRON` — elite Tank, font stays junior.

STATUS: PROPOSED

---

### FSN-PIT-RANK

FORMATION_ID: `FSN-PIT-RANK`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-PIT` — `rook` / proposed `pit_mason` — pack median — owns the gallery
- `ROLE-LANCER` — `rook` / proposed `rank_lancer` — pack median + 1 — owns one open file

VARIANT_RULES:

- Teaching pair for Pit File minus the Stinger. Distinct from `FSN-FILE-GUARD` (golem peels the gallery) and `FSN-RIME-RANK` (ice MP tax on the file). The pit is a **walk-block with LoS open** — artillery would love it; this PAIR has no gun yet, so the Lancer is the reason you care about the file.
- Band 0: Lancer uses ordinary Strike but **only commits on a shared file**. Pit Mason is a body-block until `spell-open-pit` apply exists — **do not spawn this id** as “fake Barrier” (Barrier blocks LoS; pit must not).
- Band 1: Pit paint + File Lance (`spell-file-lance`). Mason never gets Barrier as identity.
- Elite: Lancer only. Mason stays junior so two pit elites cannot paint both galleries.
- Unlock after `FSN-FILE-GUARD` **or** `FSN-RIME-RANK` (player has seen a file **or** a painted file tax).
- If the map has no 4-tile open file plus a gallery, **reroll**.
- No Stinger, no Fan, no Rank Lock (lock + pit on PAIR is CELL+ `FSN-LOCK-FAN` / CADRE `FSN-FAN-FILE`).

SPELL_POOL_INTERACTIONS:

- Open Pit: `isCellFree` false, Bresenham ignores pits. Occupant at paint is not displaced. Teleport / Mist Step over works.
- File-thrust / File Lance is physical along the rank. Off-axis you are safe. The pit on the **approach** means melee cannot step the file; the Lancer still can shoot it.
- Never pit both galleries. Never pit the only cell that leaves the file.

TACTICAL_PLAN:

- Lancer holds until the player shares the file. Mason pits the melee approach of that file, then steps off the pit cell if they painted under themselves (they should not).
- If the Lancer dies, remaining Mason is a slow pit painter — intended.

SYNERGY:

- Hazard creator + lancer. Wave 4 pit standing on drop-3’s file. The hole is why you cannot walk the rank; stepping off-file is still complete.

PLAYER_THREAT:

- Readable geometry. Misplay is sharing the rank “for one Frost.” Recoverable: walk the gallery, Barrier fills the pit, Mist Step over.

COUNTERPLAY:

- Never share a rank. Detour. Occupy the pit (you can leave). Kill the Lancer (`hp` ~1.05, not a 2.5× golem). Swap the Mason onto a cell they wanted to pit.

MAP_REQUIREMENTS:

- `chessboard` or `fortress` with **one 4-tile file plus a gallery**. Reject a single-tile tunnel (file + forced pit is a lock).
- No Barrier already occupying the file at spawn.

AI_REQUIREMENTS:

- Lancer: charger + linear-only approach (`AI-SYS-06`).
- Pit: setter; on-path-only (VETERAN); cap 2 live pits at CHAMPION — PAIR cap 1.
- Soph 1–2.

VARIANTS:

- `FSN-PIT-RANK/STING` — CADRE: add `ROLE-STINGER` (that is Wave 4 “Pit File”). Still one pit. Stinger shoots **through** the hole.
- `FSN-PIT-RANK/E-RANK` — elite Lancer, still no bash / Inferno.

STATUS: PROPOSED

---

### FSN-TRADE-HOLE

FORMATION_ID: `FSN-TRADE-HOLE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-BROKER` — `king` / proposed `pawn_broker` — pack median — mid
- `ROLE-PIT` — `rook` / proposed `pit_mason` — pack median — front/gallery

VARIANT_RULES:

- Distinct from `FSN-HOOK-SLAM` (attract then push) and `FSN-EMBER-RIFT` (Swap caster↔player). This sheet is **two player-side bodies trade**; the caster stays. Pit is the landing tax.
- CELL: Broker has Pawn Trade + Frost. Mason cap 1 live pit. Trade dest must not be lava / the last exit. Prefer landing **adjacent** to the pit or **into** it only if a walk-off **out** exists after — standing in a pit is legal (you can leave); being traded onto a pit with no walk-off is a **lock — banned**.
- Elite: Broker only. Mason stays junior so two displacement elites cannot pin.
- Unlock after `FSN-EMBER-RIFT` **or** when the player has summoned once this run (Trade needs two hostiles — weight ×2 if a summon is equipped).
- If the player has no summon **and** pack size would not include a third body, Trade fizzles forever — then this is Frost king + pit rook. **Still valid**, but prefer the `/PAWN` variant (optional junior pawn so two hostiles exist without the player’s pet).
- No Fuse on CELL (that is BRIGADE `FSN-TRADE-TRAP`). No `isSwap` / `rift_hook`. No Goad (that is `FSN-EVADE-GOAD` / Broker Pit variant).

SPELL_POOL_INTERACTIONS:

- Pawn Trade: `swapTwoHostiles`, radius 3. 0 damage. Hazard on landing must tick — pit blocks the **next** walk, it does not deal HP.
- Frost after a trade is a tax, not a root.
- Isolate (desummon, or stand 4+ from the pet) is the designed immune.

TACTICAL_PLAN:

- Mason pits a flank choke, never both approaches. Broker Trades only if the swap puts the player onto/toward the pit **or** puts the Wisp into melee, **and** a walk-off remains.
- Never turn-1 trade onto the pit.

SYNERGY:

- Displacement specialist + hazard creator. Wave 4 Trade Trap minus the fuse. You choose which body stands in the hole.

PLAYER_THREAT:

- Positional. Fail state is “I clumped with the wisp and swapped onto a pit I already saw.” Recoverable: desummon, stand 4 apart, occupy the landing.

COUNTERPLAY:

- Isolate. Barrier fills the pit. Self Anchor (player, if owned). Kill the glass Broker (`hp` ~0.80). Fight without a pet — the sheet goes soft, which is fine.

MAP_REQUIREMENTS:

- `arena` or `asymmetric` with two approaches and ≥ 8 free floor cells. Reject `corridorMaze` (trade + pit in a hallway is a lock).
- Pit must not cover **all** walk-offs from a legal trade landing.

AI_REQUIREMENTS:

- Broker: caster + fizzle-aware (no second body → Frost). Skip safer-for-player trades.
- Pit: setter; on-path-only.
- Soph 2–3.

VARIANTS:

- `FSN-TRADE-HOLE/PAWN` — optional junior `pawn` charger with **no** extra spells (second hostile so Trade can legally fire without a player pet).
- `FSN-TRADE-HOLE/E-TRADE` — elite Broker, still no lava dest.

STATUS: PROPOSED

---

### FSN-SLIDE-BASH

FORMATION_ID: `FSN-SLIDE-BASH`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-SLIDE` — `bishop` / proposed `slide_mason` — pack median
- `ROLE-PUSHER` — `pawn` / proposed `bash_bruiser` — pack median + 1

VARIANT_RULES:

- Distinct from `FSN-HOOK-SLAM` (hook then bash) and `FSN-WICK-STEP` (fuse then bash). The conveyor is **enter**; bash is **cast**. Standing on the paint does not slide.
- CELL: one slide, one bash. Dest of each must leave a walk-off. Bash into open floor is skipped (VETERAN). Slide whose stored dir is blocked is skipped (would no-op).
- Elite: Pusher only. Mason stays junior so two displacement elites cannot pin.
- Unlock after `FSN-HOOK-SLAM` **or** `FSN-WICK-STEP` (player has seen a board-move).
- Do not ship until `applyPushback` has **both** a spell caller (bash) **and** an enter-hook (slide).
- No Stride Hunter on CELL (that is CADRE `FSN-GATE-COURT`). No pit dest. No lava dest. No Board Tilt (CHAMPION witness only).

SPELL_POOL_INTERACTIONS:

- Slide Tile: enter → push 1 along stored 8-dir. Sets `movedThisTurn`. Barrier clears.
- Shoulder Bash: 2-step ray. Collision vs wall allowed if a side step remains.
- Prefer bash **onto** a slide whose dir dumps toward a wall **beside** the engagement, never the last exit.

TACTICAL_PLAN:

- Mason paints a slide on a **flank choke**, stored dir toward a pillar, never toward lava. Pusher walks a flank and Bashes after the paint is public.
- Never turn-1 double displace onto one tile.

SYNERGY:

- Hazard / conveyor + displacement. Wave 4 Slide Slam minus the Hunter. The board shoves you one extra step; you can still refuse to enter.

PLAYER_THREAT:

- Positional. Fail state is “I stepped onto a conveyor I saw, then got banged into a pillar.” Recoverable: detour, occupy the cell, Root before you would step.

COUNTERPLAY:

- Do not enter. Barrier the cell. Hug the Mason. Kill the glass painter (`hp` ~0.85). Occupy the bash landing.

MAP_REQUIREMENTS:

- `arena` or `asymmetric` with **pillars / a wall 2 tiles from typical stand**, plus open floor the other way. Reject `corridorMaze`.
- Slide dest must not be void / portal / lava.

AI_REQUIREMENTS:

- Slide: setter; skip no-op dirs; dest scoring must not use lava.
- Pusher: charger; skip bash into open floor.
- Soph 2–3.

VARIANTS:

- `FSN-SLIDE-BASH/STRIDE` — CADRE: add `ROLE-STRIDE` (Wave 4 “Slide Slam”). Brand only if the flag is public.
- `FSN-SLIDE-BASH/E-BASH` — elite Pusher, still no lava dest.

STATUS: PROPOSED

---

### FSN-LOCK-FAN

FORMATION_ID: `FSN-LOCK-FAN`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-LOCK` — `rook` / proposed `axis_locksmith` — pack median + 1
- `ROLE-FAN` — `queen` **without heal** / proposed `fan_prelate` — pack median

VARIANT_RULES:

- Teaching pair for Fan File minus Root. Distinct from `FSN-FILE-GUARD` (linear **attack**) and `FSN-PLUS-BATTERY` (plus via `hitTiles`). Rank Lock is a **walk axis**; Fan is a **facing wedge**.
- CELL: Locksmith Rank Lock + Frost. Fan Frost + Mark; Fan Bolt only if two player-side bodies sit in the wedge — solo player → Frost, not Fan (`AI-TEM-05`).
- Elite: Fan only. Locksmith stays junior so lock + cone elites cannot pin a 1-tile file.
- Unlock after `FSN-FILE-GUARD` **or** `FSN-PIT-RANK` (player has seen a file).
- If the map has no 3-tile wedge, **reroll**.
- No Root on CELL (that is CADRE `FSN-FAN-FILE`). No Slow (third MP/walk story). No `starter-blast` (second `hitsMultiple`).
- **Do not ship until `targeting.ts` reads `areaShape: "cone"`.** Faking Fan with Chebyshev is a different card.

SPELL_POOL_INTERACTIONS:

- Rank Lock: 2 turns, one axis. Forced move still works. Absolve / wait / Swap / Back Step / Twin Gate are answers. Never lock a player onto a dead-end file (Locksmith VETERAN skip).
- Fan Bolt: 10× bodies in the 90° wedge, radius 3. Hug the caster. Back-diagonal of the facing is safe.
- Mark on a cell in the wedge is CELL-optional; player can step off.

TACTICAL_PLAN:

- Locksmith Locks if a 4-tile file exists **and** the player is not already on a dead-end. Fan holds facing the locked axis and spends Fan only if a wisp also sits in the wedge; else Frost / Mark.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Controller (walk-axis) + artillery (cone). Wave 4 Fan File minus Weaver. You may walk — only on one axis — and the wedge punishes clumping on that axis.

PLAYER_THREAT:

- Frustration and a periodic cone, not a lock. Failure is standing on the locked file with a wisp clumped. Recoverable: hug the Fan, walk the allowed axis into safety, split from the pet.

COUNTERPLAY:

- Hug the Fan. Walk off the wedge. Desummon. Absolve the lock. Kill the glass Fan (`hp` ~0.85). Swap off-axis.

MAP_REQUIREMENTS:

- `chessboard` or `fortress` with a 4-tile file **plus** a 3-tile wedge that is not the only aisle. Reject a 1-tile tunnel.
- Player must have a tile off the locked axis **or** a forced-move answer.

AI_REQUIREMENTS:

- Lock: caster; no refresh; skip dead-end files.
- Fan: artillery; skip Fan without wedge occupancy. Heal-less so inference stays caster.
- Soph 2–3.

VARIANTS:

- `FSN-LOCK-FAN/ROOT` — CADRE: add `ROLE-ROOTER` (that is `FSN-FAN-FILE`). Root **or** Lock on a target, never both on the same AP bar.
- `FSN-LOCK-FAN/FROST` — Fan Frost-only if cone reader is not ready; **reroll** rather than fake a blob.

STATUS: PROPOSED

---

### FSN-LEY-COURT

FORMATION_ID: `FSN-LEY-COURT`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-LEY` — `bishop` / proposed `ley_tollkeeper` — pack median
- `ROLE-SIP` — `bishop` / proposed `soul_siphon` — pack median
- `ROLE-STINGER` — `bishop` / proposed `far_stinger` — pack median — the primed gun

VARIANT_RULES:

- Unlock after `FSN-LEY-SIP` **and** `FSN-KICK-STING` (or any fight where the player closed a keep-range gun). Wave 4 “Ley Court.”
- Elite: Tollkeeper only. Siphon and Stinger stay junior so two MP elites cannot starve the close.
- Inferno stays off the Tollkeeper (Frost / Far Sting is the primed follow-up). Stinger is the **one** rare if Far Sting is treated as rare; otherwise Frost-only Stinger is still a brigade of poke.
- Three bishops, three jobs. Combination, not a new sprite. Start ≥ 4 apart, **opposite corners** so one Linear does not delete the court.
- No Share Optic (that is COURT). No Hex Teller (two AP/MP engines + a gun is CADRE+ `/HEX` on Lens Battery). No Recoil (Recoil Hunt).
- If kit band is still 0, **do not spawn this id**.

SPELL_POOL_INTERACTIONS:

- Sip (init 1.30) → Ley (init 1.20) spends the stolen MP → Stinger (init 1.10) fires the primed tape. Readable three-step. If Sip fizzles (player at 0), Ley may skip prime and the sheet is a softer `FSN-KICK-STING` without the kick.
- Far Sting still has `minRange: 2`. Closing is the answer. Short Sight (player) is fair.
- One Slow source: **none** on the base sheet (Sip is the MP verb).

TACTICAL_PLAN:

- Siphon Sips if MP ≥ 2. Tollkeeper primes only if a damaging follow-up is ready **and** leftover MP allows a step if needed. Stinger holds 4–5 and Stings the primed target.
- If the Stinger dies, remaining pair is `FSN-LEY-SIP` — intended.

SYNERGY:

- Steal the 2 MP, prime, sting from 4–5. Wave 4 Ley Court. Sophistication is the third body, not a new monster.

PLAYER_THREAT:

- High if you save MP to close and eat primed Far Sting at 5. Still interruptible: sit at 0, burst the Stinger (glass), walk to 1.

COUNTERPLAY:

- Spend walk before Sip init. Kill the Stinger. Kill the Siphon so Ley cannot pay. Hug the gun. Barrier the file.

MAP_REQUIREMENTS:

- `openField` or `chessboard` with wide files. Reject `corridorMaze`. ≥ 2 walk-offs from wherever Sting can land.
- No Time Warp. No ice on both approaches.

AI_REQUIREMENTS:

- Same MP gates as `FSN-LEY-SIP`.
- Stinger: dist-gate; never Nova.
- Soph 3–4. `groupTactics` at 4: one focus. Blackboard: `plannedPrime` so Ley and Stinger agree.

VARIANTS:

- `FSN-LEY-COURT/NO-SIP` — teaching BRIGADE: Ley + Stinger only (if steal apply is not ready).
- `FSN-LEY-COURT/E-TOLL` — elite Tollkeeper, CHAMPION sip-pays-toll (already the pack).

STATUS: PROPOSED

---

### FSN-PUSH-SCHOOL

FORMATION_ID: `FSN-PUSH-SCHOOL`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-RECOIL` — `knight` / proposed `recoil_squire` — pack median
- `ROLE-PUSHER` — `pawn` / proposed `bash_bruiser` — pack median + 1
- `ROLE-PIT` — `rook` / proposed `pit_mason` — pack median

VARIANT_RULES:

- Unlock after `FSN-KICK-STING` **and** `FSN-SLIDE-BASH` (or `FSN-HOOK-SLAM`). Wave 4 “Push School.” Teaching contrast: **they** move vs **you** move; pit on the follow.
- Elite: Recoil only. Bruiser and Mason stay junior so two bash elites cannot pin onto a pit.
- Recoil dest and bash dest still banned from lava / pit / the last exit. Pit sits on a **flank** so following the Recoil is expensive, not mandatory.
- No Slide (that is `FSN-SLIDE-BASH`). No Stride. No Goad. No Trade.
- Optional: Recoil may Back Step **onto** a Twin Gate pad only in CADRE `FSN-GATE-COURT` — not here.

SPELL_POOL_INTERACTIONS:

- Back Step creates range. Shoulder Bash spends their range. Pit punishes the chase. Three displacement verbs, three readable windows.
- Recoil skip if dest is the pit. Bruiser skip bash into the pit unless a walk-off **around** the hole remains — **prefer never** on BRIGADE (that is TRADE-TRAP’s job).

TACTICAL_PLAN:

- Mason pits the melee approach of the Stinger-less lane. Recoil kites with Back Step. Bruiser Bashes toward a wall **beside** the pit, never into it.
- If Recoil dies, remaining pair is a softer bash + pit — intended.

SYNERGY:

- Self-knockback + player-push + pit. Combination of Wave 2 bash with Wave 4 recoil and pit. The lesson is which body moves.

PLAYER_THREAT:

- Positional. Fail is chasing the knight through the hole then eating a bash. Recoverable: corner the Recoil, walk around the pit, face the Bruiser in a doorway you choose.

COUNTERPLAY:

- Fight in a closet. Occupy Recoil’s rear two tiles. Detour the pit. Kill the Recoil (hp ~0.85). Slow after they land.

MAP_REQUIREMENTS:

- `arena` or `asymmetric` with a 2-tile aisle **and** a gallery. Reject `corridorMaze` (three displacers in a hallway is a lock).
- ≥ 2 walk-offs after a bash.

AI_REQUIREMENTS:

- Recoil: dest-check (skip pit/lava).
- Pusher: skip bash into pit / open floor.
- Pit: on-path-only; never both approaches.
- Soph 3–4. Blackboard: `plannedKickDest` so Pit does not paint Recoil’s only landing.

VARIANTS:

- `FSN-PUSH-SCHOOL/NO-PIT` — Recoil + Bruiser only (CELL-shaped BRIGADE if pit apply is not ready).
- `FSN-PUSH-SCHOOL/E-KICK` — elite Recoil, still no lava dest.

STATUS: PROPOSED

---

### FSN-TRADE-TRAP

FORMATION_ID: `FSN-TRADE-TRAP`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-BROKER` — `king` / proposed `pawn_broker` — pack median
- `ROLE-PIT` — `rook` / proposed `pit_mason` — pack median
- `ROLE-FUSE` — `queen` **without heal** / proposed `fuse_binder` — pack median

VARIANT_RULES:

- Unlock after `FSN-TRADE-HOLE` **and** `FSN-WICK-STEP`. Wave 4 “Trade Trap.”
- Elite: Broker only. Pit and Fuse stay junior so two clocks cannot stack on one landing.
- Fuse and pit are **different cells**. Never fuse a pit (last-writer is a lie). Trade onto **one** of them, not both in one action.
- Fuse: 2-turn occupancy bomb. Step off / teleport off before tick. Never fuse both walk-offs.
- No `rift_hook`. No Goad on the base sheet (variant `/GOAD` is Broker Pit with **wire**, not this id).
- Time Warp banned. Glass Realm banned.

SPELL_POOL_INTERACTIONS:

- Trade puts a body onto a public pit **or** toward a public wick. Fuse deals 0 on cast. Pit deals 0 on paint.
- Mark (optional on Broker) sits on a **different** tile as a decoy — Mark does not amp the fuse.
- Teleport off the wick works; walking on at tick does not.

TACTICAL_PLAN:

- Turn 1: Mason pits a flank. Binder fuses the **other** choke, never the pit cell. Broker holds.
- Turn 2+: Broker Trades only if the swap improves frontline onto one public hazard **and** a walk-off from the other remains.
- Optional junior pawn (`/PAWN` from the CELL) if the player brought no pet.

SYNERGY:

- Two-hostile swap + pit + delayed tile bomb. You pick which clock to eat; isolate still shuts Trade off.

PLAYER_THREAT:

- High if you clump. Low if you isolate. Failure is greed on a pet next to a wick you already learned in `FSN-WICK-STEP`.

COUNTERPLAY:

- Desummon. Stand 4 apart. Leave the fused cell. Barrier fills pit **or** replaces fuse. Kill the Binder (`hp` ~0.80).

MAP_REQUIREMENTS:

- `arena` or `ruinsIslands` with **two** chokes plus open floor. Reject a 1-tile tunnel.
- ≥ 2 walk-offs that are not the fused cell.

AI_REQUIREMENTS:

- Broker: skip safer trades; skip if only one hostile.
- Pit / Fuse: never same cell; never both exits.
- Soph 3–4. Blackboard: `ownedHazardA` / `ownedHazardB`.

VARIANTS:

- `FSN-TRADE-TRAP/WIRE` — replace Fuse with `ROLE-TRAPPER` (`trip_mason`) — Wave 4 “Broker Pit” **minus** Goad. Do not add Goad on this variant (that is `FSN-EVADE-GOAD` adjacent; three of Trade+wire+taunt is CADRE `/GOAD` only after this BRIGADE is answered).
- `FSN-TRADE-TRAP/PAWN` — junior body so Trade can fire without a player pet.
- `FSN-TRADE-TRAP/GOAD` — CADRE: add `ROLE-GOAD` after this BRIGADE; still no Pain Link.

STATUS: PROPOSED

---

### FSN-FONT-GATE

FORMATION_ID: `FSN-FONT-GATE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-FONT` — `king` / proposed `font_cantor` — pack median — `isSummoner`
- `ROLE-WARDEN` — `rook` / proposed `leash_warden` or live `iron_golem` — pack median + 1 — on the font’s threat axis
- `ROLE-TANK` — `rook` / live `iron_golem` — pack median + 1 — front (*if* Warden is `leash_warden`; if Warden already is a golem, **omit** this third and treat as `FSN-FONT-IRON/WARD` with a second junior pawn instead — never two identical 2.5× golems as the identity)

VARIANT_RULES:

- Unlock after `FSN-FONT-IRON`. Wave 4 “Font Gate.” Stationary pulse behind a wall.
- Preferred read: Font + Leash Warden + Iron Golem. Warden interposes; Golem is the pulse target; Font plants off-axis.
- Elite: Golem only (or Warden if the Golem slot is the pawn fallback). Font stays junior.
- Do not co-spawn pylon / turret / wolf. Cap 1 font. `pale_cantor` absent.
- Ally Shield apply on the font is the honesty gap — if missing, Warden **body-blocks** only and the sheet still ships (softer).
- No Inferno. No Swap peel on BRIGADE (Warden Swap peel is CADRE rare, legal dest only).

SPELL_POOL_INTERACTIONS:

- Pulse 8 / range 2 / lifespan 4. Iron Skin / Shield on the font. Golem is inertia.
- Cursed Wound on the Golem halves incoming mends that are HP — pulse is a heal; Wound still bites the **target**.
- `spell-rallying-cry` stays false.

TACTICAL_PLAN:

- Golem walks up. Warden stands on the line between player and Font (`AI_BACKLINE_GUARD_DISTANCE` 1). Font plants behind the Warden so pulse covers Golem **and** Warden, not an easy Strike from the player’s spawn.
- If the font dies, remaining pair is `FSN-GLASS-WARD` minus the gun / a double tank — intended.

SYNERGY:

- Summoner (heal totem) + protector + tank. Same pairing family as Quiet Choir, different payload: a post you can sit on.

PLAYER_THREAT:

- Long, structured. Spike is low. Fail is never looking at the font.

COUNTERPLAY:

- Burst the font. Sit on the plant cell. Walk the gallery. Cursed Wound the Golem. Peel the Warden to open the gap.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery. Font placement ring ≥ 3 free cells. Never a closed ring.
- Weight 0 on cramped 1-tile closets.

AI_REQUIREMENTS:

- Font: summoner + font AI + fall-through.
- Warden: guardian-style interpose.
- Tank: charger. `chokepointCamp` only if a side aisle exists (soph ≥ 3).
- Soph 3–4. `AI_BACKLINE_PROTECT` at 4.

VARIANTS:

- `FSN-FONT-GATE/CHAPLAIN` — CADRE: replace Warden with `ROLE-CHAPLAIN` (rescue pull the font-owner, not the post — posts do not walk). Root on the Cantor **blocks** the pull.
- `FSN-FONT-GATE/NO-GOLEM` — Font + Warden only (if three tanks would sponge).

STATUS: PROPOSED

---

### FSN-FAN-FILE

FORMATION_ID: `FSN-FAN-FILE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-FAN` — `queen` **without heal** / proposed `fan_prelate` — pack median — `isLeader` optional
- `ROLE-LOCK` — `rook` / proposed `axis_locksmith` — pack median + 1
- `ROLE-ROOTER` — `bishop` / proposed `snare_weaver` — pack median

VARIANT_RULES:

- Unlock after `FSN-LOCK-FAN` **and** (`FSN-WIRE-ROOT` **or** `FSN-FILE-WIRE`). Wave 4 “Fan File.”
- Elite: Fan-leader only. Locksmith and Weaver stay junior. Leader-boost is the escalation, not three elites.
- Root **or** Lock on a target, never both on the same AP bar (walk 0 plus axis lock is a hardlock). Weaver Roots only if a **cast-from-tile** exists. Locksmith skips dead-end files.
- No Pit on the base sheet (CHAMPION Locksmith pack-pit is `FSN-PIT-RANK/STING` adjacent — do not merge). No second `hitsMultiple`.
- COURT variant `FSN-FAN-FILE/PLUS` may add `ROLE-PLUS` **or** a Turret, not both, and only after this CADRE is answered.

SPELL_POOL_INTERACTIONS:

- Lock the axis the Fan wants. Root holds a body in the wedge. Fan Bolt counts occupancy, never names. Hug the Fan is still complete.
- Frost from Weaver after Root taxes the cast, does not add a second walk lock.
- Haste on the Locksmith is off (buffer honesty).

TACTICAL_PLAN:

- Locksmith Locks the file/rank the Fan faces. Weaver Roots a clumped wisp **or** the on-axis player if a legal cast remains. Fan waits one turn if the wedge is empty (ELITE).
- If the Fan dies, boost lands on glass — intended. Remaining pair is Lock + Root (`FSN-WIRE-ROOT`-adjacent, walk-axis not wire).

SYNERGY:

- Cone + axis lock + root. Three Wave 2/4 verbs, one wedge. Combination, not a new monster.

PLAYER_THREAT:

- High if you clump on the locked file. Low if you hug or split. The fail is greed on the wedge after you already learned CELL.

COUNTERPLAY:

- Hug the Fan. Split from the wisp. Absolve Lock **or** wait Root expiry. Cast from the rooted tile. Peel the Fan-leader early if boost is on.

MAP_REQUIREMENTS:

- `chessboard` or `fortress` with a 4-tile file **and** a 3-tile wedge **and** a gallery. Reject maps with no 3-tile wedge (reroll).
- Root tile must allow a spell. Lock must leave a forced-move or wait answer.

AI_REQUIREMENTS:

- Fan: cone-gate + optional `isLeader`.
- Lock: axis the Fan faces (`ownedWedge` blackboard).
- Rooter: no refresh; no double-stop with Lock on the same target the same round.
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-FAN-FILE/NO-LEADER` — teaching CADRE without boost.
- `FSN-FAN-FILE/NO-ROOT` — fallback to `FSN-LOCK-FAN` if Root id is not ready.
- `FSN-FAN-FILE/PLUS` — COURT: add Plus Cutter; still one `hitsMultiple` **shape** per turn (plus **or** cone, not both same AP bar).

STATUS: PROPOSED

---

### FSN-RECOIL-HUNT

FORMATION_ID: `FSN-RECOIL-HUNT`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-RECOIL` — `knight` / proposed `recoil_squire` — pack median
- `ROLE-STINGER` — `bishop` / proposed `far_stinger` — pack median
- `ROLE-SIDESTEP` — `knight` / proposed `sidestep_warder` — pack median or −1

VARIANT_RULES:

- Unlock after `FSN-KICK-STING`. Wave 4 “Recoil Hunt.” Kick to min-range, sting, miss the close.
- Two knights, two jobs: Recoil **self-pushes**; Sidestep **misses one hit**. Distinct from `FSN-MIST-HUNT` (dash + veil). No Mist, no Swap.
- Elite: Stinger only. Knights stay junior so two kick/evade elites cannot surround.
- Sidestep: evade if the player is adjacent and can Strike. Skip if already charged. 0-damage control does not consume. Do **not** also Ward Plate (Plate is `FSN-PLATE-LINK`).
- Recoil dest still banned from pit / lava. No Goad on the base sheet (that is `FSN-EVADE-GOAD`).
- Fog of War is **not** required.

SPELL_POOL_INTERACTIONS:

- Back Step sets range for Far Sting. Sidestep wastes the Strike you spent to punish the kick.
- Far Sting `minRange: 2` — if Recoil kicks to 2, Stinger Frosts (VETERAN), not Stings. The Hunt wants 3–5.
- AoE: first instance vs Sidestep misses, second hits. Fair.

TACTICAL_PLAN:

- Stinger holds 4–5. Recoil takes one flank and kicks if hugged. Sidestep takes the **other** flank and evades the first melee.
- Never turn-1 surround. Start ≥ 4 apart. Blackboard: `plannedKickDest` so Recoil and Sidestep do not stack.

SYNERGY:

- Self-knockback + distance gun + evade. Three answers to “I walked in.” Combination of PAIR Kick-Sting with Wave 4 Sidestep.

PLAYER_THREAT:

- Getting kicked to 4, stung, then whiffing the knight. Spike is a Far Sting, not a nuke. Interruptible: closet the Recoil, wait 2 on Sidestep, hug the Stinger.

COUNTERPLAY:

- Slow / Short Sight first (does not consume evade). Wait 2 turns. AoE twice. Corner Recoil. Walk to Chebyshev 1 on the Stinger.
- Do not dump Inferno into Sidestep as the first damaging instance.

MAP_REQUIREMENTS:

- `asymmetric` or `openField` with **two** flanks plus a rear 2-tile aisle that is not the only exit. Reject cramped `corridorMaze`.
- No sealed alcove.

AI_REQUIREMENTS:

- Recoil: dest-check.
- Stinger: dist-gate.
- Sidestep: evade-if-melee; no refresh.
- Soph 4–6. `groupTactics`: one focus. Do not enable all three to peel the wisp.

VARIANTS:

- `FSN-RECOIL-HUNT/NO-STEP` — fallback to `FSN-KICK-STING` if evade apply is not ready.
- `FSN-RECOIL-HUNT/E-TAPE` — elite Stinger, hold 4–5, still no Nova.

STATUS: PROPOSED

---

### FSN-GATE-COURT

FORMATION_ID: `FSN-GATE-COURT`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-PORTER` — `bishop` / proposed `twin_porter` — pack median
- `ROLE-SLIDE` — `bishop` / proposed `slide_mason` — pack median
- `ROLE-STRIDE` — `knight` / proposed `stride_hunter` — pack median − 1

VARIANT_RULES:

- Unlock after `FSN-SLIDE-BASH` **and** (`FSN-KICK-STING` **or** `FSN-MIST-HUNT`). Wave 4 “Gate Court.” Pad/slide sets `movedThisTurn`, then Brand.
- Elite: Porter only. Slide and Stride stay junior so two teleports cannot surround (`mist_walker` **absent** — banned PAIR).
- Twin Gate pads must **not** reuse occupancy `portals`. Pad B must not be adjacent to the player at plant (they will use it). Never plant B on a pit (teleport fizzles). Slide may feed **toward** pad A; fuse the **approach**, not the dest pad (Fuse is off this sheet — that is Fog Fuse / Wick).
- Stride Brand only if the flag is **public**. Camping is a complete answer. Do not also pack Jackal / Coup.
- Weight 0 on 1-tile closets.
- No Board Tilt on the base sheet (CHAMPION Slide witness only, and only if ≥3 other bodies would move).

SPELL_POOL_INTERACTIONS:

- Enter pad A → B (walk/push/pull/slide/swap) once per event. Sets `movedThisTurn`. Barrier replaces a pad.
- Slide enter also sets the flag. Standing on paint does not.
- Brand: 8, or 8+12 if they moved. Mark (optional on Stride) can amp both hits — player can step off Mark.

TACTICAL_PLAN:

- Porter plants pad B behind self if kiting, never next to the player. Mason paints a slide whose dir is toward pad A **or** off melee, skip no-op. Stride paths to a body that just gated/slid; Strikes if they camped.
- Never turn-1 triple on one tile.

SYNERGY:

- Portal-pair + conveyor + moved-this-turn assassin. The board is a path; damage is incidental unless you take it.

PLAYER_THREAT:

- Positional. Fail is stepping the slide onto pad A, landing on B, then eating Brand. Recoverable: sit on pad B, Barrier it, camp, kill the Hunter (`hp` ~0.80).

COUNTERPLAY:

- Occupy dest. Use the pair yourself. Do not enter the slide. Root before you would step. Grounded Lock (player, if owned) does not stop **walk** — camp anyway.
- Kill the Porter so the pair expires (second cast replaces; death should clear that caster’s pads — **proposed**; if pads persist, Barrier is the answer).

MAP_REQUIREMENTS:

- `openField` or `chessboard` with ≥ 10 free floor cells. Reject cramped `corridorMaze` and 1-tile closets.
- Pad B and slide dest: free, non-void, not lava, not the last exit.
- Death-realm world portals must not fire on gate enter.

AI_REQUIREMENTS:

- Porter: skip gift-to-player dest; never occupancy `portals`.
- Slide: skip no-op; dest legality.
- Stride: flag-gate; hunt-the-shove at soph 4.
- Soph 4–6. Blackboard: `padB` / `slideDir` so Stride and Porter do not stack the player onto a dead-end.

VARIANTS:

- `FSN-GATE-COURT/NO-STRIDE` — BRIGADE-shaped CADRE if `movedThisTurn` plumbing is missing.
- `FSN-GATE-COURT/SLAM` — replace Porter with `ROLE-PUSHER` (that is Slide Slam). Same Brand rule. **Do not** also keep Porter (two displacers + bash + brand is COURT).
- `FSN-GATE-COURT/E-GATE` — elite Porter, still no dest-adjacent-to-player.

STATUS: PROPOSED

---

### FSN-EVADE-GOAD

FORMATION_ID: `FSN-EVADE-GOAD`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-SIDESTEP` — `knight` / proposed `sidestep_warder` — pack median — `isLeader` optional
- `ROLE-GOAD` — `pawn` or `knight` / proposed `goad_herald` — pack median + 1
- `ROLE-ABSOLVER` — `queen` **without heal** / proposed `ash_absolver` — pack median — **no** `healAmount`

VARIANT_RULES:

- Unlock after `FSN-RECOIL-HUNT` **or** `FSN-BASTION-GATE` (player has seen evade **or** taunt). Wave 4 “Evade Goad.” Forced swing misses; Absolve the taunt.
- Elite: Goad only (the taunt is the identity). Sidestep and Absolver stay junior.
- Pain Link is **off** (forced swing into redirect is COURT-only, not this sheet).
- Absolver: Absolve Root / Short Sight / **Goad** first (control), DoTs second. Never Absolve a clean ally. **Not** a healer — Shield / Iron Skin only.
- Sidestep skip if Plate is already up (Plate absent). Goad skip if already the only legal target.
- `pale_cantor` absent. Random summoner overlay off.

SPELL_POOL_INTERACTIONS:

- Goad: next **damaging** action must choose the Herald if they are a legal target. Slow / Barrier / Swap / Absolve ignore or strip it. AoE that already includes the Herald satisfies it.
- Sidestep: that forced Strike **misses**. Second damaging instance hits.
- Absolve strips Goad (`effectCategory: "cc"`). Readable three-step: taunt → miss → strip, or taunt → you Absolve-yourself (player) / wait.

TACTICAL_PLAN:

- Herald Goads when an ally is the real threat (Sidestep / Absolver). Sidestep stands legal-Strike-adjacent so the forced swing can land on them. Absolver peels Goad **after** the miss (ELITE) or Shields the Herald (BASE).
- If the Herald dies, remaining pair is evade + cleanse — intended, soft.

SYNERGY:

- Evade + taunt + ally cleanse. Hit the tank, whiff, watch them strip your follow-up control. Combination of Wave 3 Goad/Absolver with Wave 4 Sidestep.

PLAYER_THREAT:

- Tempo and information. Spike is low. Fail is dumping the only 5-AP nuke into a charged Sidestep under Goad.

COUNTERPLAY:

- Cast a non-damaging tool. Wait 2 turns. AoE twice (first miss, second hit — include the Herald to satisfy Goad). Kill the Absolver (glass, no heal). Walk out of Goad range so taunt drops.
- Cursed Wound does not care about cleanse of other types if you never heal — fair.

MAP_REQUIREMENTS:

- `arena` or `fortress` courtyard + gallery. Absolver needs two walk-offs. Never a closed ring.
- Goad range must leave a tile where the Herald is **not** a legal Strike (the drop-out).

AI_REQUIREMENTS:

- Sidestep: evade-if-melee; optional `isLeader`.
- Goad: charger; retreat disabled while taunt is live; skip redundant.
- Absolver: buffer, not healer; VETERAN no-waste.
- Soph 4–6. `groupTactics` on. Ally `targetId` apply **must** exist for Absolve / Shield — **do not ship this id before that apply exists.**

VARIANTS:

- `FSN-EVADE-GOAD/NO-ABS` — BRIGADE-shaped: Sidestep + Goad only (if ally cleanse is not ready).
- `FSN-EVADE-GOAD/NO-LEADER` — teaching CADRE without boost.

STATUS: PROPOSED

---

### FSN-LENS-BATTERY

FORMATION_ID: `FSN-LENS-BATTERY`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-SHARE` — `bishop` / proposed `share_optic` — pack median — `isLeader`
- `ROLE-SNIPER` — `bishop` / proposed `glass_sniper` — pack median — Frost; Mark is the **one** elite rare; **minRange 3, flat**
- `ROLE-STINGER` — `bishop` / proposed `far_stinger` — pack median — distance tape, minRange 2
- Optional fourth: `ROLE-LEY` junior **or** `ROLE-WARDEN` junior — if Ley, primes the Stinger not the Sniper; if Warden, peels the Share Optic. Never both.

VARIANT_RULES:

- Unlock after `FSN-LEY-COURT` **or** `FSN-KICK-STING` **and** `FSN-GLASS-WARD` **and** a leader-boost CADRE. Wave 4 “Lens Battery.”
- One elite only: the Share-leader. Others stay junior so boost is the late scare, not four elites.
- **This is the sheet that is allowed to stand Far Stinger next to Glass Sniper** — because Share Optic is the third verb (+range on one gun). Without Share, **reroll** to `FSN-LEY-COURT` or `FSN-GLASS-WARD`.
- Sniper Mark is optional and never combined with Inferno or `starter-blast` or Fan on this sheet.
- Isolated 1v1 Share is banned (family rule) — if escorts die, remaining Share Frosts (RARE self-buff only if isolated; prefer retreat `escapeRoute`).
- `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Share walks to the gallery, not through the player.
- InstantKill / betrayal stay off.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE `FSN-LENS-BATTERY/TAPE` (variant): drop Sniper — Share + Stinger only (ship if dual-gun read is not ready).
- `dim_optic` is **absent** on the base sheet (that is `/DUEL`).

SPELL_POOL_INTERACTIONS:

- Lens Share +2 range for 2 turns on the **target**. Share the Stinger (tape grows, still capped by `maxSpellRange`) **or** the Sniper (flat gun reaches further), never both the same turn (replace, not stack).
- Short Sight on the gifted gun fights the share (add then clamp min 1) — player tool, or `/DUEL`.
- Two guns occupy **different bands**: Sniper refuses dest Chebyshev ≤ 2; Stinger refuses Sting at 1–2. They must not stack on one tile.
- `spell-rallying-cry` stays false. Hex Teller is `/HEX` only (after this COURT is answered as a variant, still not + `tax_scribe`).

TACTICAL_PLAN:

- Share acts first (init 1.35) and gifts the Stinger if the player is at 4–5, else the Sniper if the player is at 3. Sniper holds minRange 3. Stinger holds 4–5.
- Optional Ley primes the Stinger after Share. Optional Warden interposes on the Share axis.
- If a gun dies, the wall opens; Share may retreat rather than suddenly one-shot.

SYNERGY:

- Ally-range buffer + flat min-range gun + distance tape. Court-scale geometry. The grant is why two snipers are not the same lesson.

PLAYER_THREAT:

- Highest range-structured threat in this drop. Still turn-based. Failure is eating a shared Far Sting at 6 while the Sniper holds the close-band. Bounce/Fan are off — you choose whether to clump.

COUNTERPLAY:

- Kill the Share (glass, hp ~0.70). Walk into minRange of the gifted gun. Short Sight the gun. Split from the wisp. Sit on the Share. Barrier the file.
- Player Chain Lightning into the clump is fair — the pack itself has no bounce.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with two files. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Both guns need a step-off. Share needs two walk-offs.

AI_REQUIREMENTS:

- Share: ally-first buffer; skip duplicate; `escapeRoute` at soph 6 on the leader.
- Sniper: minRange 3 + Mark hygiene.
- Stinger: dist-gate; never Nova.
- Optional Ley: MP gate; prime the Stinger.
- Optional Warden: guardian, `chokepointCamp` only with a gap.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Share.
- Proposed: escorts do not path a closed box.

VARIANTS:

- `FSN-LENS-BATTERY/TAPE` — BRIGADE: Share + Stinger only.
- `FSN-LENS-BATTERY/NO-LEY` — COURT of three.
- `FSN-LENS-BATTERY/HEX` — COURT: replace optional Ley with `ROLE-HEX`. Tax the long cast. **Still no** `tax_scribe` / `coil_arbiter`. Cheap Strike burns the tax.
- `FSN-LENS-BATTERY/DUEL` — COURT: replace Stinger with `ROLE-OPTIC` (`dim_optic`). Last-writer range war (Wave 4 “Lens Duel”). Player Short Sight / Lens Share is the designed third vote. Still one Share-leader.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–4 still stand. This drop **meshes**; it does not replace.

```
PAIR:    LEY-SIP            KICK-STING           FONT-IRON          PIT-RANK
              \                 |                     |                 /
CELL:     (LEY-SIP)        TRADE-HOLE           SLIDE-BASH         LOCK-FAN
              \                 |                     |                 /
BRIGADE:  LEY-COURT        TRADE-TRAP           PUSH-SCHOOL        FONT-GATE
              \                 |                     |                 /
CADRE:    FAN-FILE         RECOIL-HUNT          GATE-COURT         EVADE-GOAD
              \                 |                     |                 /
COURT:                         LENS-BATTERY     LENS-BATTERY/DUEL   LENS-BATTERY/HEX
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-LEY-SIP` | `FSN-TIDE-LOCK` (or spent MP to walk past a kiter) |
| `FSN-KICK-STING` | `FSN-GLASS-WARD` **or** `FSN-IRON-TIDE` |
| `FSN-FONT-IRON` | `FSN-WARD-MEND` **or** `FSN-KENNEL-LITANY` |
| `FSN-PIT-RANK` | `FSN-FILE-GUARD` **or** `FSN-RIME-RANK` |
| `FSN-TRADE-HOLE` | `FSN-EMBER-RIFT` **or** a summon this run |
| `FSN-SLIDE-BASH` | `FSN-HOOK-SLAM` **or** `FSN-WICK-STEP` |
| `FSN-LOCK-FAN` | `FSN-FILE-GUARD` **or** `FSN-PIT-RANK` |
| `FSN-LEY-COURT` | `FSN-LEY-SIP` + `FSN-KICK-STING` |
| `FSN-PUSH-SCHOOL` | `FSN-KICK-STING` + (`FSN-SLIDE-BASH` or `FSN-HOOK-SLAM`) |
| `FSN-TRADE-TRAP` | `FSN-TRADE-HOLE` + `FSN-WICK-STEP` |
| `FSN-FONT-GATE` | `FSN-FONT-IRON` |
| `FSN-FAN-FILE` | `FSN-LOCK-FAN` + (`FSN-WIRE-ROOT` or `FSN-FILE-WIRE`) |
| `FSN-RECOIL-HUNT` | `FSN-KICK-STING` |
| `FSN-GATE-COURT` | `FSN-SLIDE-BASH` + (`FSN-KICK-STING` or `FSN-MIST-HUNT`) |
| `FSN-EVADE-GOAD` | `FSN-RECOIL-HUNT` **or** `FSN-BASTION-GATE` |
| `FSN-LENS-BATTERY` | (`FSN-LEY-COURT` or `FSN-KICK-STING`) + `FSN-GLASS-WARD` + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 4 SPELL_PROPOSALS verbs (not this drop)

Sibling [`SPELL_PROPOSALS_2026-09-21.md`](../automation/SPELL_PROPOSALS_2026-09-21.md) (open as PR #342) stamps Gale Fan, Twin Guard, Cut In, After Verse, Sanguine Toll, Cross Flank, Bias Ray, Draw Together, AP Sip, Body Check, Cast Snare, Bait Pylon, Morrow Step, Surplus Ward, Sated Fang, Eclipse Fold. **No family owns them yet.** This catalog does **not** mint `FSN-*` ids for them. A later elite-evolution wave must sheet families before a formation drop packs them.

Discovery W2 still unfamilied (do not steal): `spell-still-brand` (punish standing — opposite of Stride), `spell-grounded-lock` (no swap/blink — distinct from Rank Lock).

Keep drop-4 law: do **not** pack `coup_duelist` with `bell_sexton` as a teaching pair.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–4, plus Wave 4 verbs in this order (from elite-evolution 2026-09-21 §8):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920).
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11997). Stop writing `res`/`sp` as 0.05–0.75 (`spawnPolicy.ts` 261–272).
3. Explicit `enemy.role` / `aiProfile` so healAmount and Ley/Share kits do not collapse (`docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04, AI-ROL-05).
4. **MP debit** in `executeCastAttempt` / enemy decide (`WX` 17096+). **`FSN-LEY-SIP` / `FSN-LEY-COURT` must not ship before that debit exists.**
5. Ally buff apply (`targetId` on Shield / Iron Skin / Lens Share / Absolve / Tempo). **`FSN-LENS-BATTERY`, `FSN-EVADE-GOAD`, `FSN-FONT-GATE`’s ally Shield must not ship before that apply exists.** `FSN-FONT-IRON` plants; pulse is the heal.
6. `areaShape: "cone"` reader in `targeting.ts` (today unread; area is Chebyshev at 694–721). **`FSN-LOCK-FAN` / `FSN-FAN-FILE` must not ship as a blob.**
7. `effectCategory` callers for `applyPushback` — **self** (Back Step) and **enter** (Slide). Dest legality.
8. `swapTwoHostiles` (not `isSwap`). Pit table (`isCellFree` false, LoS open). `gatePads` table that is **not** occupancy `portals`.
9. `evadeNextHits` consume **before** `dealDamage` (not `buffStat: "evasion"`). Far Sting Chebyshev multiply before `dealDamage` (do not retune live damage math).
10. `movedThisTurn` plumbing on occupancy commits; clear at **that unit’s** turn start. Hex Toll flag in the AP gate. Rank Lock in the walk stepper + preview parity.
11. Font summon AI (`mp: 0`, no path, `summonAI === "font"` — never `name.includes("font")`). Cap the summoner overlay (`WX` 11932–11942).
12. Discovery: family observe must not double-grant ACHIEVEMENT / BOSS / CHALLENGE / MULTI_SOURCE doors (`back-step`, `twin-gate`, `sidestep-ward`, `mercy-font`, `lens-share`).

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order changes, or damage-formula edits. Map **selection** is a filter on already generated maps.

Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-LEY-SIP`, `FSN-LEY-COURT` | MP debit + enemy `currentMp` on decide context |
| `FSN-KICK-STING`, `FSN-PUSH-SCHOOL`, `FSN-RECOIL-HUNT` | self-push caller + dest legality |
| `FSN-KICK-STING`, `FSN-LEY-COURT`, `FSN-LENS-BATTERY` | Far Sting distance rider (not a new `computeDamage`) |
| `FSN-FONT-IRON`, `FSN-FONT-GATE` | font AI + `summonAI === "font"` + skip-lock fall-through |
| `FSN-PIT-RANK`, `FSN-TRADE-HOLE`, `FSN-PUSH-SCHOOL`, `FSN-TRADE-TRAP` | pit occupancy + LoS split; never `placeBarrier` |
| `FSN-TRADE-HOLE`, `FSN-TRADE-TRAP` | `swapTwoHostiles` + landing legality |
| `FSN-SLIDE-BASH`, `FSN-GATE-COURT` | slide enter-hook; Gate also needs `gatePads` ≠ world portals |
| `FSN-LOCK-FAN`, `FSN-FAN-FILE` | `areaShape` cone reader + Rank Lock walk stepper |
| `FSN-RECOIL-HUNT`, `FSN-EVADE-GOAD` | `evadeNextHits` before `dealDamage` |
| `FSN-GATE-COURT` | `movedThisTurn` flag; Stride skip if false |
| `FSN-EVADE-GOAD` | `tauntCasterId` + ally Absolve apply |
| `FSN-LENS-BATTERY` | ally `modifiableRange` write + Share skip-if-isolated |

---

## Sources (line-accurate, 2026-09-22)

- Kits / inference / decide / summoner skip / name heuristic: `src/frontend/src/engine/enemyAI.ts` 163–185, 194–199, 218–223, 447–476, 1662–1706, 1832–1888
- Kit assignment + summoner roll + HP overwrite: `src/frontend/src/components/WorldExploration.tsx` 11920, 11932–11942, 11970–11974, 11991–11997
- Cast helper (AP-only): `WorldExploration.tsx` `executeCastAttempt` 17096+
- Family lottery + spacing: `src/frontend/src/engine/spawnPolicy.ts` 35–57, 261–297, 38; WX 5763, 5855, 5862–5866
- Ember / tide melee hooks: `WorldExploration.tsx` 16789–16818
- Void reflect: `src/frontend/src/engine/castHelpers.ts` 335–337
- Push / attract (no spell caller): `src/frontend/src/engine/occupancy.ts` 482 / 537
- Portals impassable: `occupancy.ts` 13–14, 40
- Area = Chebyshev, `areaShape` unread: `targeting.ts` 694–721; type at `gameTypes.ts` 224
- Trap still Barrier: `spellEngine.ts` 442
- Gates, summon cap, kamikaze: `src/frontend/src/data/gameConstants.ts` 200–209, 271–301
- Families: `src/frontend/src/types/gameTypes.ts` 12–20
- Spells: `src/frontend/src/data/spellData.ts` (`starter-heal` 85–101 self-only; Enrage ally 274–289; unique flags 143–686)
- Map archetypes: `src/frontend/src/engine/mapGen.ts` 6–44
- Wave 4 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-21.md` §3–§4 (PR #349)
- Wave 3 spell verbs this drop consumes: `docs/automation/SPELL_PROPOSALS_2026-09-02.md`
- Wave 4 leftover spells (deferred): `docs/automation/SPELL_PROPOSALS_2026-09-21.md` (PR #342)
- AI modules referenced: `docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04, AI-SYS-06, AI-ROL-05, AI-TEM-04, AI-TEM-05
- Drop 1: `docs/design/ENEMY_FORMATIONS_2026-08-31.md`
- Drop 2: `docs/design/ENEMY_FORMATIONS_2026-09-01.md`
- Drop 3: `docs/design/ENEMY_FORMATIONS_2026-09-02.md`
- Drop 4: `docs/design/ENEMY_FORMATIONS_2026-09-21.md` (PR #348)

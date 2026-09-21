# Enemy synergy and formation catalog (drop 4)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-09-21  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–3 already taught the seven pairing words and Waves 1–2 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 3 packs** deferred in [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md): Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3). Family sheets: [`ENEMY_ELITE_EVOLUTION_2026-09-02.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-02.md). Spell verbs: [`SPELL_PROPOSALS_2026-09-01.md`](../automation/SPELL_PROPOSALS_2026-09-01.md).

**Hard rule:** do **not** pack `coup_duelist` with `bell_sexton` as a PAIR. `FSN-BELL-CUT` stays the delayed-clock lesson. `FSN-COUP-ROT` is the instant-25% lesson.

---

## Grounding (live, 2026-09-21)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers moved since 2026-09-02. Family lottery now lives in `spawnPolicy.ts`.

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
| Enemy-legal unique spells | `spellData.ts` 143–686 (`usableByEnemy` flags) |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–289 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Summoner slots need `isSummoner` + a usable summon id. Dedicated pylon / turret / familiar bodies **replace** the random overlay on that slot.
3. Any `healAmount` steals healer. **Do not put drain, nova, or `starter-heal` on Fuse, Tempo, Absolver, Plus, Ignite, Smoke, Sink, Optic, or Coup.**
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Leash Hook / Ward Plate until a ranged heal id exists.
5. `spell-rallying-cry` stays `usableByEnemy: false`. `spell-tempo-gift` ships player-first — only `ROLE-TEMPO` may family-flip it.
6. `summon-sentinel`, `summon-bomber`, `summon-wisp` stay enemy-false except as **late COURT flag-unlocks** already named in drop 1. Pylon is a **different** id (`spell-bastion-pylon`). Do not co-spawn pylon with turret (`stone_castellan`).
7. `starter-blast` has **no** `usableByEnemy` flag. Plus Cutter uses `spell-cross-cut` via `hitTiles`, not blast, unless a variant says otherwise. Do not invent `thunder_clap` / `void_collapse` on a sheet unless that sheet names them as a COURT rare and the id is already in admin seed.
8. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies. Coup is **not** `instantKill` — it is a 25% HP% gate on a profiled id.
9. Push dest, hook landing, **sink landing**, bash dest: free floor, not lava / spikes / void / portal, player keeps ≥ 1 escape tile. Teleport / Mist Step **does not** trip wires **or** pay rime; fuse still ticks occupancy if they stand on it at tick.
10. Dual Slow / Frost / tide melee / **rime enter** MP tax: cap applied MP debuff at **−2** from unit Slow/Frost. Rime is a **tile** tax on the next step (separate axis). One Slow source per pack. Do not also Root + Rime + Slow on the same AP bar.
11. **Do not** pack `coup_duelist` with `bell_sexton` as a PAIR. They may share a COURT later, never a teaching pair.
12. Wave 3 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-09-02.md`: Ley Toll, Fan Bolt, Back Step, Pawn Trade, Twin Gate, Sidestep Ward, Far Sting, …) stay **unfamilied**. This drop does **not** mint `FSN-*` ids for them.

### Relative difficulty (same grades as drops 1–3)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1/2/3 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (warden / tank / bruiser / pusher / lancer / goad / chaplain / pylon-owner / plate / tether): pack median + one step.
- Backliner (sniper / fuse / rime / smoke / sink / optic / plus / tempo / absolver / ignite / glyph): pack median.
- Glass (rat, coup, mist): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 4)

Drop 1–3 overlays still apply. These are **additional jobs** for Wave 3 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-FUSE` | `queen` **without** heal | proposed `fuse_binder` | `spell-fuse-tile`, `starter-frost` — **no** Inferno on PAIR | caster; Fuse deals **0 on cast**; never stack two fuses on one cell; skip if player MP ≥ 3 and an open ring exists (VETERAN) |
| `ROLE-SINK` | `bishop` | proposed `sink_chanter` | `spell-sinkhole`, `starter-frost` — **no** Hook Line if `void_anchoret` is in the pack | caster; attractor is the **tile**, not self; skip if the hole is safer for the player; radius 3 = immune |
| `ROLE-RIME` | `bishop` | proposed `rime_mason` | `spell-rime-tile`, `starter-frost` — **0 HP on the paint** | setter; never ice a cell the player can ignore; cap 2 live rime cells; last-writer vs map ice (one tax) |
| `ROLE-SMOKE` | `bishop` | proposed `smoke_thurifer` | `spell-smoke-veil`, `starter-frost` | caster; smoke only cells that currently break a live LoS; skip if player is adjacent |
| `ROLE-OPTIC` | `bishop` | proposed `dim_optic` | `spell-short-sight`, `starter-frost` — **no** reflect, no Swap | caster; skip Sight if **all** player equipped ids have `modifiableRange !== true`; Strike stays melee |
| `ROLE-IGNITE` | `queen` **without** heal | proposed `ignite_alchemist` | `starter-poison`, `spell-ignite-stacks` | caster; Ignite only if matching stacks ≥ 2 (VETERAN); BASE may apply one stack then cash later |
| `ROLE-COUP` | `knight` | proposed `coup_duelist` | `physical_attack`, `spell-coup-de-grace` | flanker; skip Coup if HP% > 25; refuse frontal if target is healthy; absorb is **not** HP |
| `ROLE-TEMPO` | `king` | proposed `tempo_precentor` | `spell-tempo-gift` (family flip `usableByEnemy` for this id only) — **no** heal | buffer (`AI-ROL-05`); skip duplicate Tempo; gift the payoff body, not self |
| `ROLE-ABSOLVER` | `queen` **without** heal | proposed `ash_absolver` | `spell-absolve`, `starter-shield` — **no** `healAmount` | buffer (not healer); never Absolve a clean ally; peel Root / Short Sight / Goad before DoTs |
| `ROLE-PLUS` | `rook` or `queen` **without** heal | proposed `plus_cutter` | `starter-frost`, `spell-mark`; `spell-cross-cut` at CELL+ | artillery; Cross only if two player-side bodies sit on the plus; diagonals are safe |
| `ROLE-CHAPLAIN` | `rook` | proposed `hook_chaplain` | `spell-leash-hook`, `physical_attack` | guardian after pull; skip if no free adjacent cell; Root on the ally **blocks** the pull |
| `ROLE-PYLON` | `rook` | proposed `pylon_prelate` | `spell-bastion-pylon`; Shield / Iron Skin on the **pylon** | `isSummoner` for the pylon id only; pet `ap: 0`, `mp: 0`, **must not path or cast**; no wolf/archer/turret overlay |
| `ROLE-GOAD` | `pawn` or `knight` | proposed `goad_herald` | `spell-goad`, `physical_attack` | charger; retreat disabled while taunt is live; skip if already the only legal target; non-damage tools ignore taunt |
| `ROLE-TETHER` | `king` or `rook` | proposed `twin_tether` | `spell-life-tether`, `physical_attack` | holder; will not Tether if already > 3 Chebyshev with no MP to close; split is 50/50 after absorb |

Drop-2/3 `ROLE-LANCER` / `ROLE-PUSHER` / `ROLE-ROOTER` / `ROLE-SNIPER` / `ROLE-WARDEN` / `ROLE-PLATE` / `ROLE-CANTOR` / `ROLE-MIST` / `ROLE-GLYPH` / `ROLE-DEBUFFER` are reused below. Do not also roll the random 12% summoner overlay onto Fuse, Tempo, Absolver, Plus, Ignite, Smoke, Sink, Optic, Plate, or Cantor. One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** pylon — never two engines).

### Fair-fight rules (every sheet)

Same as drops 1–3, plus Wave 3:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, barrier, or a live fuse.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Kamikaze never detonates on a single full-HP player.
- Swap / pull / push / **sink** dest: free floor, not lava / spikes / void / portal, player keeps ≥ 1 escape tile.
- Fuse: 2-turn occupancy bomb. Caster death does **not** cancel. Step off / teleport off before tick. Never fuse **both** walk-offs. Never fuse the only tile that reaches the backliner.
- Coup: HP% ≤ 25 public. Ward Plate absorb can fake a healthy bar — Coup must read **HP**, not effective+absorb. Heal above 25% is a complete answer. Never Coup a full-HP player.
- Ignite: consume public DoT stacks. Player may cleanse, wait ticks, or eat the burst. Do not Ignite + Inferno the same AP bar.
- Short Sight: −2 range on `modifiableRange: true` only. Do **not** silently flip Frost to modifiable to make Optic work.
- Tempo: +1 AP **next** turn, replace not stack. Challenge `hard_3` still counts spends. Isolated 1v1 **reroll** this overlay.
- Absolve: strip `debuff` + `dot` from an ally. Does not strip absorb, buffs, or Mark tiles. Pacifist / no-heal challenges stay valid.
- Cross Cut: plus via `hitTiles`. Diagonals safe. Skip without two player-side bodies on the plus.
- Rime: 0 damage paint. Start-turn or walk/push/pull enter pays +1 MP for the **next** step. Teleport does not pay.
- Smoke: walkable LoS block. Barrier on the same cell wins (solid). Spells with `lineOfSight: false` ignore it. Walk through is legal.
- Sinkhole: radius-2 Chebyshev pull **1 step toward a ground cell**. Adjacent to the Chanter is **not** immunity (that is Hook). Standing at radius 3 is.
- Leash Hook: pull **ally** to a free adjacent cell. Occupying the Chaplain’s ring is the counter. Cannot pull enemies.
- Pylon: occupies + blocks LoS. Lifespan 4. 0 damage, 0 XP on death. Weight 0 on cramped 1-tile closets.
- Goad: next **damaging** action must choose the Herald if they are a legal target. Slow / Barrier / Swap / Absolve ignore or strip it. AoE that already includes the Herald satisfies it.
- Life Tether: 50/50 split after absorb, before death, while Chebyshev ≤ 3. Pull them apart. AoE that hits both splits **each** hit. Leftover from a lethal half does **not** rebound.
- Pain Link + Goad together is **COURT only** (forced swing into redirect). Not on any base sheet in this drop.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- No Glass Realm on stacked-DoT, Ignite, Fuse, or Bell sheets. No Time Warp on Fuse / Coup / Mark / Root windows.
- Summons stay at cap 2. Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.

---

## Index (all four catalogs)

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-IRON-BATTERY` | PAIR | protector + artillery | 2026-08-31 |
| `FSN-WARD-MEND` | PAIR | tank + healer | 2026-08-31 |
| `FSN-HEX-BLOOD` | PAIR | buffer + bruiser | 2026-09-01 |
| `FSN-GLASS-WARD` | PAIR | warden + sniper | 2026-09-01 |
| `FSN-IRON-TIDE` | PAIR | tank + kiter | 2026-09-02 |
| `FSN-FILE-GUARD` | PAIR | lancer + protector | 2026-09-02 |
| `FSN-MEND-KNIFE` | PAIR | healer + assassin | 2026-09-02 |
| `FSN-WICK-STEP` | PAIR | fuse + pusher | this drop |
| `FSN-RIME-RANK` | PAIR | ice + lancer | this drop |
| `FSN-SMOKE-GLASS` | PAIR | smoke + sniper | this drop |
| `FSN-FROST-KNIFE` | CELL | controller + assassin | 2026-08-31 |
| `FSN-ROT-CUT` | CELL | debuffer + finisher | 2026-08-31 |
| `FSN-TIDE-LOCK` | CELL | kiter + mover | 2026-08-31 |
| `FSN-MIRROR-REAVE` | CELL | reflect + gap-closer | 2026-09-01 |
| `FSN-PAPER-PLAGUE` | CELL | dual applicator + scribe | 2026-09-01 |
| `FSN-NULL-WALL` | CELL | anti-summon + tank | 2026-09-01 |
| `FSN-HOOK-SLAM` | CELL | pull + push | 2026-09-02 |
| `FSN-BELL-CUT` | CELL | clock + execute | 2026-09-02 |
| `FSN-WIRE-ROOT` | CELL | trap + root | 2026-09-02 |
| `FSN-STACK-CASH` | CELL | applicator + ignite | this drop |
| `FSN-COUP-ROT` | CELL | applicator + instant execute | this drop |
| `FSN-KENNEL-LITANY` | BRIGADE | summoner + support | 2026-08-31 |
| `FSN-EMBER-RIFT` | BRIGADE | hazard + displacer | 2026-08-31 |
| `FSN-HOOK-FUSE` | BRIGADE | puller + kamikaze | 2026-09-01 |
| `FSN-TIDE-STORM` | BRIGADE | kiter + storm artillery | 2026-09-01 |
| `FSN-VEIL-HEX` | BRIGADE | lurker + buffer | 2026-09-01 |
| `FSN-EMBER-MEND` | BRIGADE | hazard + healer | 2026-09-02 |
| `FSN-GRAVITY-TAX` | BRIGADE | pull + slam + zone tax | 2026-09-02 |
| `FSN-WICK-COURT` | BRIGADE | fuse + sink + bash | this drop |
| `FSN-TEMPO-CHOIR` | BRIGADE | tempo + ignite + rat | this drop |
| `FSN-FOG-FUSE` | BRIGADE | smoke + fuse + mist | this drop |
| `FSN-RESCUE-LINE` | BRIGADE | ally-pull + warden + sniper | this drop |
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
| `FSN-ICE-FILE` | CADRE | rime + lancer + root | this drop |
| `FSN-SMOKE-HUNT` | CADRE | smoke + sniper + optic | this drop |
| `FSN-PLUS-BATTERY` | CADRE | plus + sink + glyph | this drop |
| `FSN-ABSOLVE-RACE` | CADRE | cleanse + plate + ignite | this drop |
| `FSN-TWIN-PLATE` | CADRE | tether + plate + cantor | this drop |
| `FSN-FINISH-LINE` | CADRE | coup + ignite + rat | this drop |
| `FSN-CROWN-ESCORT` | COURT | dual golem + king + controller | 2026-08-31 |
| `FSN-CHORUS-THRONE` | COURT | choir + sniper, leader | 2026-09-01 |
| `FSN-SHARD-BATTERY` | COURT | turret + ricochet + glyph | 2026-09-02 |
| `FSN-BASTION-GATE` | COURT | pylon + goad + sniper | this drop |

---

## Formations

### FSN-WICK-STEP

FORMATION_ID: `FSN-WICK-STEP`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-FUSE` — `queen` **without heal** / proposed `fuse_binder` — pack median — back
- `ROLE-PUSHER` — `pawn` / proposed `bash_bruiser` — pack median + 1 — front

VARIANT_RULES:

- Teaching pair for Wick Court minus the Sink. Distinct from `FSN-HOOK-FUSE` (Swap + martyr) and `FSN-BELL-CUT` (unit clock). This bomb is a **tile**.
- Band 0: Binder Frosts only **and shows a fused cell** if the fuse id is missing — **do not spawn this id** until `spell-fuse-tile` apply exists. Pusher is Strike only (no bash) until `applyPushback` has a spell caller.
- Band 1: Fuse + Shoulder Bash. Bash dest must leave a walk-off **that is not the fused cell**.
- Elite: Binder only. Pusher stays junior so two displacement elites cannot pin onto the wick.
- Unlock after `FSN-HOOK-SLAM` **or** `FSN-BELL-CUT` (player has seen a board-move **or** a 2-turn clock).
- Random 30% family lottery is **off**.
- No Sink, no Smoke, no Inferno, no Coup, no Bell.

SPELL_POOL_INTERACTIONS:

- Fuse deals 0 on cast. Identity is occupancy at tick. Mark (band 1 optional) sits on a **different** tile as a decoy — Mark does not amp the fuse (environmental).
- Shoulder Bash is 2-step ray. Collision vs wall is allowed if a side step remains. Bash onto the wick is the identity **only if** a second walk-off exists.
- Frost after a bash is a tax, not a root.

TACTICAL_PLAN:

- Binder fuses a choke the player is likely to enter next turn, never both exits, never the tile under a full-HP player on turn 1 if they can still walk around.
- Pusher walks a flank and Bashes **after** the wick is public, aiming at a wall **beside** the engagement, never lava.
- Never turn-1 fuse+bash onto one tile.

SYNERGY:

- Hazard creator + displacement specialist. Wave 3 Fuse Binder standing on drop-3’s Pusher. The bomb is the clock; the bash is why standing still is expensive — stepping off is still complete.

PLAYER_THREAT:

- Positional. Fail state is “I got banged onto a wick I already saw.” Recoverable: step off, Barrier the cell, Swap the Binder onto their wick.

COUNTERPLAY:

- Leave the cell. Occupy the bash landing. Kill the glass Binder (`hp` ~0.80). Hug a wall the **other** way.
- Player Barrier replaces fuse (solid wins). Do not stand still on Time Warp — that modifier is **banned** on this id.

MAP_REQUIREMENTS:

- `arena` or `asymmetric` with **pillars / a wall 2 tiles from typical stand**, plus two walk-offs. Reject `corridorMaze` (fuse + bash in a hallway is a lock).
- No lava dest. No Void Rift as a legal landing.

AI_REQUIREMENTS:

- Fuse: caster + fuse legality (not both exits; VETERAN skip if MP ≥ 3 and a ring exists).
- Pusher: charger; skip bash into open floor; dest scoring must not use lava **or** the last unfused exit.
- Soph 1–2. `groupTactics` not required.

VARIANTS:

- `FSN-WICK-STEP/FROST` — Binder Frost-only if fuse apply is not ready; **reroll the id** rather than fake a fuse with Inferno.
- `FSN-WICK-STEP/E-WICK` — elite Binder, still one live fuse.

STATUS: PROPOSED

---

### FSN-RIME-RANK

FORMATION_ID: `FSN-RIME-RANK`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-RIME` — `bishop` / proposed `rime_mason` — pack median — paints **one** file
- `ROLE-LANCER` — `rook` / proposed `rank_lancer` — pack median + 1 — owns that file

VARIANT_RULES:

- Teaching pair for Ice File minus the Weaver. Distinct from `FSN-FILE-GUARD` (golem peels the gallery) and `FSN-TIDE-LOCK` (unit Slow kite). Rime is a **painted ice cell**.
- Band 0: Lancer uses ordinary Strike but **only commits on a shared file**. Mason Frosts. Do not spawn if the map has no 4-tile open file.
- Band 1: Mason paints the file the Lancer wants. Lancer may hold `spell-file-lance` (official id; do not invent `wave2:spell-file-thrust`).
- Elite: Lancer only. Mason stays junior so two ice elites cannot paint both galleries.
- Unlock after `FSN-FILE-GUARD` (player already knows “leave the file”).
- No Root on PAIR (that is `FSN-ICE-FILE`). No Slow (second MP story). No Sink.

SPELL_POOL_INTERACTIONS:

- Rime: 0 HP. Enter (walk/push/pull) pays +1 MP for the next step. Teleport / Mist Step does not pay.
- File-thrust is physical along the rank. Off-axis you are safe. Ice on the file makes **staying** expensive, not illegal.
- Tide live melee −1 MP is **off** (Mason is not a shade).

TACTICAL_PLAN:

- Lancer holds or walks the file and only charges when the player shares x or y with a clear ray.
- Mason paints the **escape cell on that file**, then Frosts. It does not ice the gallery (that would close the designed answer).

SYNERGY:

- Hazard creator + lancer. Wave 3 ice standing on drop-3’s file. The file is the weapon; the ice is why you cannot shrug the extra step.

PLAYER_THREAT:

- Readable geometry plus a tile tax. Misplay is sharing the rank “for one Frost.” Recoverable: step off.

COUNTERPLAY:

- Never share a rank. Detour. Barrier replaces ice. High leftover MP. Kill the Mason (`hp` ~0.85).
- If only the Lancer lives, this is `FSN-FILE-GUARD` minus the golem.

MAP_REQUIREMENTS:

- `chessboard` or `fortress` with **one 4-tile file plus a gallery**. Reject a single-tile tunnel (file + forced ice is a lock).
- Reroll on tiny `ruinsIslands` pockets with no 4-tile file.
- No Barrier already occupying the file at spawn.

AI_REQUIREMENTS:

- Lancer: charger + linear-only approach (`AI-SYS-06`).
- Rime: setter; on-path-only (VETERAN); never ice both galleries.
- Soph 1–2.

VARIANTS:

- `FSN-RIME-RANK/FROST` — Mason Frost-only (softer PAIR if rime apply is not ready). Do not fake rime with Slow.
- `FSN-RIME-RANK/E-RANK` — elite Lancer, Haste to re-align, still no Root.

STATUS: PROPOSED

---

### FSN-SMOKE-GLASS

FORMATION_ID: `FSN-SMOKE-GLASS`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-SMOKE` — `bishop` / proposed `smoke_thurifer` — pack median — paints LoS
- `ROLE-SNIPER` — `bishop` / proposed `glass_sniper` or live `wraith_bishop` — pack median — minRange 3

VARIANT_RULES:

- Teaching pair for Smoke Hunt minus the Optic. Distinct from `FSN-GLASS-WARD` (solid body-block) and `FSN-MIRROR-REAVE` (reflect). Smoke is **walk-through fog**, not a wall.
- Band 0: Sniper Frost only. Thurifer Frosts. Smoke id missing → **reroll** (do not fake smoke with Barrier — Barrier + min-range sniper in a corridor is a lock).
- Band 1: Smoke the LoS tile between player and Sniper. Sniper still refuses dest Chebyshev ≤ 2.
- Elite: Sniper only. Thurifer stays junior so two LoS elites cannot fog every aisle.
- Unlock after `FSN-GLASS-WARD` (player has seen a sniper that dies if caught).
- No Short Sight on PAIR (that is `FSN-SMOKE-HUNT`). No Fuse (that is `FSN-FOG-FUSE`).
- Two bishops, two jobs. Combination, not a new sprite.

SPELL_POOL_INTERACTIONS:

- Smoke: Bresenham treats the cell as opaque. Walking onto it is legal. `lineOfSight: false` tools ignore it. Player Barrier on the same cell **replaces** smoke with a wall — that is the player’s choice, not the pack’s.
- Frost from minRange 3. Closing is the correct play; the smoke is why the first shot is free **if you stay at 4**.
- Mark stays off this PAIR so it does not clone `FSN-MARK-CONFLAGRATION`.

TACTICAL_PLAN:

- Thurifer smokes only a cell that currently breaks live LoS to the Sniper, then steps aside (the smoke cell must remain walkable).
- Sniper holds Chebyshev ≥ 3. If the player enters 2, the Sniper steps away, never Nova.
- Skip smoke if the player is already adjacent (smoke is useless in melee).

SYNERGY:

- Controller (LoS) + artillery. Same chassis as `FSN-GLASS-WARD`, different contract: you **can** walk the lane, you just cannot shoot through it until you do.

PLAYER_THREAT:

- Slow poke while the ray is fogged. Not a one-shot. Not a wall.

COUNTERPLAY:

- Walk through the smoke and collapse the Sniper (hpMult ~0.6). Occupy the smoke cell. Diagonal around. Shadow Strike / Swap (no-LoS or teleport).
- Kill the Thurifer (glass). The Sniper without fog is `FSN-GLASS-WARD` minus the Warden.

MAP_REQUIREMENTS:

- `fortress` or `openField` with a **main lane plus one side aisle**. Reject a single-tile tunnel (smoke + forced melee is either useless or a lock).
- No Fog of War required. If it is up, do not also give CHAMPION fog-reentry on this sheet.

AI_REQUIREMENTS:

- Smoke: caster; live-ray-only (VETERAN).
- Sniper: caster + minRange 3 + refuse dest ≤ 2.
- Soph 1–2.

VARIANTS:

- `FSN-SMOKE-GLASS/WRAITH` — Sniper family stays live `wraith_bishop`.
- `FSN-SMOKE-GLASS/E-SHOT` — elite Sniper, still no Mark on PAIR.

STATUS: PROPOSED

---

### FSN-STACK-CASH

FORMATION_ID: `FSN-STACK-CASH`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-DEBUFFER` — `pawn` / live `plague_rat` — pack median − 1 — applies
- `ROLE-IGNITE` — `queen` **without heal** / proposed `ignite_alchemist` — pack median — cashes

VARIANT_RULES:

- Distinct from `FSN-ROT-CUT` (rat + **Sacrifice pawn**) and `FSN-PAPER-PLAGUE` (dual rats + Weaken). There is **no** finisher Strike window — pressure is apply then **consume**.
- CELL: Rat has `spell-venom-strike` + `starter-poison`. Alchemist has Poison + Ignite. Inferno stays off until BRIGADE (`FSN-TEMPO-CHOIR`).
- Elite: Alchemist only. Never two elite rats (double puddles).
- Unlock after `FSN-ROT-CUT` **or** `FSN-PAPER-PLAGUE` (player has seen stacked DoT).
- If pack would have no DoT applicator and Alchemist Inferno is locked, Alchemist applies **one** Poison then waits (family BASE). Still two bodies.
- No Coup on this sheet (that is `FSN-COUP-ROT` / `FSN-FINISH-LINE`). No Tempo. No Absolve (player-side cleanse is the counter, not a member).

SPELL_POOL_INTERACTIONS:

- Poison + Venom stack (`appendDotStack`). Ignite is 8 + 6×stacks, then consume. Readable: ticks exist, then they vanish into a burst.
- Alchemist VETERAN: refuse Ignite at 1 stack (Frost instead). BASE may cash 1 stack so the verb still teaches.
- Do not also Inferno the same AP bar (hides the consume window).

TACTICAL_PLAN:

- Rat applies and **leaves** (proposed VETERAN: refuse melee on a target that already has this rat’s venom).
- Alchemist waits until stacks ≥ 2, then Ignites. Hostiles start ≥ 4 apart so turn-1 is not apply+cash.

SYNERGY:

- Debuffer + status specialist (payoff). Live `plague_rat` so the pack is not two proposed sprites. Wave 3 “they apply / this one cashes.”

PLAYER_THREAT:

- A burst you can see charging on the bar. Spike is the cash-in, not a stun. Interruptible: cleanse, kill the Alchemist, or never stack 2.

COUNTERPLAY:

- Kill the rat immediately (hpMult ~0.4). Strip DoTs (`spell-cleanse-rite` / Absolve if the player brought it). Burst the Alchemist (hp ~0.75). Do not triple-stack if you see this kit.
- Shield does not stop Ignite (it is damage, not a DoT tick).

MAP_REQUIREMENTS:

- `openField` or `arena`. Rat needs space to apply-and-leave. Alchemist needs range 3–4.
- No Glass Realm. No Thorned Ground on every approach.

AI_REQUIREMENTS:

- Rat: flanker profile even on pawn (proposed). Fallback: charger that does not camp the only exit.
- Ignite: caster; stack gate (`aiHint: "detonate_if_dot_stacks_ge_2"` — read `stackId` / `dotType`, never names).
- Soph 2–3.

VARIANTS:

- `FSN-STACK-CASH/EMBER` — replace rat with live `ember_knight` melee-burn as the applicator (still one Ignite cadence).
- `FSN-STACK-CASH/E-CASH` — elite Alchemist, two-turn apply-then-cash.

STATUS: PROPOSED

---

### FSN-COUP-ROT

FORMATION_ID: `FSN-COUP-ROT`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-DEBUFFER` — `pawn` / live `plague_rat` — pack median − 1 — paints
- `ROLE-COUP` — `knight` / proposed `coup_duelist` — pack median — instant ≤25%

VARIANT_RULES:

- Distinct from `FSN-BELL-CUT` (2-turn clock, 30% tick) and `FSN-ROT-CUT` (Sacrifice pawn). Coup **punishes a wounded target now**. **Do not** add `bell_sexton` to this id. Do not spawn this id as a PAIR with a Sexton.
- CELL: Rat applies. Coup has Strike + Coup. Veil / Expose are BRIGADE (`FSN-FINISH-LINE`).
- Elite: Coup only. Rat stays junior so two elites cannot 100–0 from 26%.
- Unlock after `FSN-ROT-CUT` (setup → finish) **and** after the player has healed out of a DoT window this run. Parallel to `FSN-BELL-CUT`, never combined with it as the teaching pair.
- Absorb (Ward Plate) is a **counter**, not a member — Coup must not treat absorb as HP.
- No Inferno. No Glass Realm. No Time Warp. No Sacrifice on the rat.

SPELL_POOL_INTERACTIONS:

- Rat DoT ticks the bar down. Coup is illegal above 25%. The player sees the threshold; the knight waits.
- Mark on the Coup (variant) is the execute amp. Player can step off. Confirm Coup reads HP% not Mark.
- Do not invent `instantKill`. 25% of a full bar is still a large number — Coup is a **finisher**, not a delete.

TACTICAL_PLAN:

- Turn 1: Rat applies if reachable; Coup paths to 1 and **Strikes only if HP% > 25**, or holds.
- Coup commits Coup when the window is public. Never Coup a full-HP player. Never turn-1 surround.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Debuffer + assassin (instant execute). Live rat + Wave 3 Coup. You bleed, then a threshold Strike. The delayed-clock lesson stays on `FSN-BELL-CUT`.

PLAYER_THREAT:

- High if you sit at 20% and trade the knight. Low if you mend above 25%. Not unavoidable: heal, or kill the glass Coup (`hp` ~0.75) before the window.

COUNTERPLAY:

- Blood Mend / Shield before they step in. Slow the last tile. Keep Chebyshev ≥ 2. Burst the knight. Do not dump Inferno into a fresh absorb if you brought a Plate fight into this one.
- Kill the rat so ticks stop; the Coup without a painter is a Strike knight that refuses Coup.

MAP_REQUIREMENTS:

- `openField` or `asymmetric` with two approaches. Coup’s flank must not be the only player exit.
- No Thorned Ground on the only path to the rat (taxes the correct “stop the ticks” play).

AI_REQUIREMENTS:

- Rat: apply-and-leave.
- Coup: flanker + HP% gate (`ROLE-COUP`). ELITE: path to the DoT’d body, not the nearest.
- Soph 2–3.

VARIANTS:

- `FSN-COUP-ROT/VEIL` — BRIGADE: Coup adds Shadow Veil on the approach. Still no Bell.
- `FSN-COUP-ROT/E-COUP` — elite Coup, still no turn-1 Coup on full HP.

STATUS: PROPOSED

---

### FSN-WICK-COURT

FORMATION_ID: `FSN-WICK-COURT`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-FUSE` — `queen` **without heal** / proposed `fuse_binder` — pack median
- `ROLE-SINK` — `bishop` / proposed `sink_chanter` — pack median
- `ROLE-PUSHER` — `pawn` / proposed `bash_bruiser` — pack median

VARIANT_RULES:

- Unlock after `FSN-WICK-STEP`. Wave 3 “Wick Court.”
- Elite: Binder only. Sink and Pusher stay junior so two displacement elites cannot pin.
- Sink is the **one** rare (tile gravity). Hook Line stays off (Anchoret is a different pull). Drain Courage stays off.
- Hole = fused cell **only if** a walk-off **out of** the hole’s 1-step remain. Never sink onto lava / void.
- No Root, no Smoke, no Coup, no second fuse engine.
- Do not ship until `applyAttract` has a **tile** attractor caller (not caster-Hook) **and** `applyPushback` has a spell caller.

SPELL_POOL_INTERACTIONS:

- Fuse the landing, Sink toward it, Bash the last step. Three verbs, one occupancy bomb. Fuse still 0 on cast.
- Sink VETERAN: skip if the hole is safer for the player. Radius 3 is immune — standing out is a full answer.
- Frost from Binder/Sink after landing is a tax, not a root. One Slow source max — **none** on the base sheet.

TACTICAL_PLAN:

- Binder fuses a choke. Sink holes that cell only if ≥1 hostile would move **or** the player would land on the wick, **and** an exit exists. Pusher Bashes toward a wall **beside** the wick if a side step off remains.
- If the player never enters radius 2, this is a softer `FSN-WICK-STEP` plus a Frost bishop — fine.

SYNERGY:

- Pull/push onto a 2-turn bomb. Displacement sets up occupancy, not a stun.

PLAYER_THREAT:

- Positional and tempo. Failure is standing in radius 2 at tick. Recoverable: radius 3, step off, Barrier the wick, hug a diagonal.

COUNTERPLAY:

- Spread. Occupy the sink cell first. Body-block with a summon. Kill the glass Binder. Do not clump at radius 2.
- Swap the Binder onto their wick.

MAP_REQUIREMENTS:

- `arena` or `openField` with ≥ 8 free floor cells and at least one pillar. Reject `corridorMaze`.
- Sink radius-2 must not cover **all** walk-offs from the fused cell.

AI_REQUIREMENTS:

- Same fuse/bash legality as `FSN-WICK-STEP`.
- Sink: `attractTowardTile` scoring; skip safer holes; ELITE hole = fuse cell.
- Soph 3–4. Blackboard: `plannedWick` so all three agree.
- `groupTactics` at 4: one focus.

VARIANTS:

- `FSN-WICK-COURT/NO-SINK` — fallback to `FSN-WICK-STEP` if tile-attract is not ready.
- `FSN-WICK-COURT/ASH` — replace Sink with live `ember_knight` (bash toward the ember **body**, still no lava dest).

STATUS: PROPOSED

---

### FSN-TEMPO-CHOIR

FORMATION_ID: `FSN-TEMPO-CHOIR`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-TEMPO` — `king` / proposed `tempo_precentor` — pack median — `isLeader` optional (see variants)
- `ROLE-IGNITE` — `queen` **without heal** / proposed `ignite_alchemist` — pack median
- `ROLE-DEBUFFER` — `pawn` / live `plague_rat` — pack median − 1

VARIANT_RULES:

- Unlock after `FSN-STACK-CASH` **and** `FSN-HEX-BLOOD` (player has seen consume **and** a buffer). Wave 3 “Tempo Choir.”
- Elite: Precentor only. Alchemist and Rat stay junior. Leader-boost is the escalation, not three elites.
- Tempo is the **one** rare (family-flip `spell-tempo-gift`). Enrage / Haste are CHAMPION Precentor (AP then MP) — off the base sheet so two buff axes are a later scare.
- Reroll if the Precentor would spawn with no ally (isolated Tempo is a wasted king).
- No Coup on this sheet (that is `FSN-FINISH-LINE`). No Absolve. No Inferno on the Precentor (heal-less king stays buffer).
- **Do not ship until ally `targetId` apply exists** for Tempo (same gate as Enrage).

SPELL_POOL_INTERACTIONS:

- Tempo +1 AP next turn on the Alchemist so Ignite **and** a second Poison can land in one window. Replace, not +2. Challenge still counts the spends.
- Rat still apply-and-leave. Alchemist still refuses 1-stack Ignite at VETERAN.
- `spell-rallying-cry` stays false. Precentor never gets `starter-heal` (inference would steal buffer).

TACTICAL_PLAN:

- Turn 1: Precentor Tempos the Alchemist if in range 3; else steps into range and holds. Rat applies. Alchemist waits.
- Turn 2: Alchemist spends the gifted AP on Ignite if stacks ≥ 2, else Poison. Precentor holds (no invented nuke).
- If the Alchemist dies, remaining pair is a weak buffer + rat — intended.

SYNERGY:

- Buffer (AP grant) + payoff + applicator. Haste was walk budget (`FSN-HEX-BLOOD`). Tempo is **action** budget.

PLAYER_THREAT:

- A two-spell cash window. Spike is Ignite, not a lock. The Precentor is the off-switch.

COUNTERPLAY:

- Kill the Precentor first (hp ~0.70, high init so it acts before the gift — focus it on sight). Drain Courage on the Alchemist. Wait CD 3. Cleanse before the gifted turn.
- Null Field / Cursed Wound do not stop Tempo (not a heal). Just delete the king.

MAP_REQUIREMENTS:

- `openField` or `arena`. Precentor needs a tile at range 3 from the Alchemist that is **not** the player’s only exit.
- Reject a 1-tile tunnel (gift + forced melee reads as a lock).

AI_REQUIREMENTS:

- Tempo: ally-first buffer (`AI-ROL-05`); skip duplicate gift; ELITE gift the body that has Ignite in kit.
- Ignite: stack gate.
- Rat: apply-and-leave.
- Soph 3–4. `groupTactics` at 4: one focus. Do not enable all three to peel the wisp.
- Init on the Precentor is **why** the gift lands first — do not shuffle initiative to hide that.

VARIANTS:

- `FSN-TEMPO-CHOIR/NO-LEADER` — teaching BRIGADE without boost.
- `FSN-TEMPO-CHOIR/HASTE` — CADRE: CHAMPION sequence Tempo then Haste the Alchemist. Still no Coup.

STATUS: PROPOSED

---

### FSN-FOG-FUSE

FORMATION_ID: `FSN-FOG-FUSE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-SMOKE` — `bishop` / proposed `smoke_thurifer` — pack median
- `ROLE-FUSE` — `queen` **without heal** / proposed `fuse_binder` — pack median
- `ROLE-MIST` — `knight` / proposed `mist_walker` — pack median — self dash

VARIANT_RULES:

- Unlock after `FSN-WICK-STEP` **and** (`FSN-SMOKE-GLASS` **or** `FSN-MIST-HUNT`). Wave 3 “Fog Fuse.”
- Elite: Binder only. Smoke and Mist stay junior so two dash/fog elites cannot surround.
- Smoke the **fused cell** (hide the wick). Fuse icon / intent log must still fire — hidden occupancy without a tell is a hardlock. If the UI cannot show a wick under smoke, **do not ship this id**.
- Mist Step does **not** trip wires and does **not** pay rime; fuse **does** tick if Mist ends on the cell. Dest must be free, non-void, not the player’s last exit.
- No Sink (that is Wick Court). No Optic (that is Smoke Hunt). No Coup.
- Fog of War map modifier is **not** required. If it is up, do not also give CHAMPION fog-reentry.

SPELL_POOL_INTERACTIONS:

- Smoke + Fuse: LoS block on the bomb tile. Player can still walk through smoke onto the wick — that is a mistake they can see if the wick tell exists.
- Mist Step: self free-cell dash, CD 2, ignores LoS. Teaching contrast: dash **off** the wick works; dash **onto** it does not save you at tick.
- No Inferno. Binder Frost if fuse is illegal.

TACTICAL_PLAN:

- Binder fuses a choke. Thurifer smokes that cell only if it currently breaks LoS **and** the wick tell is public. Mist Steps to a rear/side tile, never ending on the wick, never stacking on the Thurifer.
- Never turn-1 surround. Start ≥ 4 apart.

SYNERGY:

- Hide the fuse; dash does not trip, fuse still ticks occupancy. Combination of Wave 2 Mist with Wave 3 smoke and fuse.

PLAYER_THREAT:

- Missing the wick because LoS died, then standing on it. Not unavoidable if the tell is public and a second approach exists.

COUNTERPLAY:

- Walk through smoke and **look at the tell**. Step off. Occupy the smoke cell. Kill the Binder. Face the Mist in a doorway. Root does not stop Mist Step — zone the landing ring.

MAP_REQUIREMENTS:

- `asymmetric` or `ruinsIslands` with **two** flanks plus a rear tile that is not the only exit. Reject cramped `corridorMaze` (smoke + fuse + dash in a closet is a lock).
- Wick tell must be visible from at least one walk-off (HUD icon / fused-tile highlight).

AI_REQUIREMENTS:

- Smoke: ELITE smoke-the-fuse; BASE cover-glass (the Binder).
- Fuse: same legality as `FSN-WICK-STEP`; never fuse both exits.
- Mist: flanker + valued Step (VETERAN); blackboard `plannedStepDest` so Mist does not land on the wick.
- Soph 3–4.

VARIANTS:

- `FSN-FOG-FUSE/NO-MIST` — BRIGADE of two if Mist Step is not ready (smoke + fuse only).
- `FSN-FOG-FUSE/E-WICK` — elite Binder, still one live fuse, still a public tell.

STATUS: PROPOSED

---

### FSN-RESCUE-LINE

FORMATION_ID: `FSN-RESCUE-LINE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-CHAPLAIN` — `rook` / proposed `hook_chaplain` — pack median + 1 — ally rescue
- `ROLE-WARDEN` — `rook` / proposed `leash_warden` or live `iron_golem` — pack median — occupies
- `ROLE-SNIPER` — `bishop` / proposed `glass_sniper` or live `wraith_bishop` — pack median — minRange 3

VARIANT_RULES:

- Unlock after `FSN-GLASS-WARD`. Wave 3 “Rescue Line.” Warden stays occupy / Swap peel — it does **not** steal `spell-leash-hook` (amendment: rescue pull is Chaplain).
- Elite: Chaplain only. Warden and Sniper stay junior.
- Leash Hook is the **one** rare. Swap peel on the Warden is CADRE (`FSN-BROKEN-GLASS` already taught Swap-in on a closer — here Swap is **ally peel**, dest legal).
- Reroll if no ally (Chaplain cannot self-pull). If pack size would be 1, reroll (sniper must not spawn solo).
- No Pylon on this sheet (that is `FSN-BASTION-GATE`). No Tempo. No Inferno on the Sniper at BRIGADE.

SPELL_POOL_INTERACTIONS:

- Chaplain pulls the Sniper (or Warden if the Sniper is already safe) to a free adjacent cell. Occupying the ring fizzles the pull (VETERAN: do not spend). Root on the Sniper blocks the pull (ELITE: skip).
- Warden body-blocks the Chaplain–Sniper axis (`AI_BACKLINE_GUARD_DISTANCE`). Shield / Iron Skin on the Sniper if ally apply exists; else the Warden is a fat body (`FSN-GLASS-WARD/GOLEM`).
- Sniper Frost from minRange 3. Closing is still correct; the rescue is why one dive may not stick.

TACTICAL_PLAN:

- Warden stands on the line. Sniper holds ≥ 3. Chaplain pulls only if the Sniper is in melee or on a hazard **and** a free ring cell exists that is not the player’s last exit.
- If the Sniper dies, remaining pair is two rooks — a slow `FSN-WARD-MEND` minus the heal. Intended.

SYNERGY:

- Protector (rescue pull) + protector (occupy) + artillery. Same gun as Glass Ward; the new verb is **yank the gun off melee**.

PLAYER_THREAT:

- A sniper that leaves the pocket you paid MP to enter. Spike is low. Misplay is ignoring the Chaplain.

COUNTERPLAY:

- Stand on the landing tiles. Root the Sniper first (if the player brought Root / a snare). Slow the Sniper before the pull. Focus the backline with no-LoS tools. Kill the Chaplain (hp ~1.10, not a 2.5× golem).

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars. Sniper needs a step-off. Chaplain ring needs ≥ 2 free cells.
- Reject a 1-tile closet (pull into a box is a lock **or** a fizzle forever).

AI_REQUIREMENTS:

- Chaplain: rescue; fizzle-aware; ELITE respect-root; reuse guardian spacing after the pull.
- Warden: guardian interpose.
- Sniper: minRange 3.
- Soph 3–4. `AI_BACKLINE_PROTECT` on.

VARIANTS:

- `FSN-RESCUE-LINE/SHOT` — teaching CELL: Chaplain + Sniper only (if three bodies is too many).
- `FSN-RESCUE-LINE/GOLEM` — Warden family stays live `iron_golem`.
- `FSN-RESCUE-LINE/CANTOR` — CADRE: replace Sniper with `ROLE-CANTOR` (pull the healer). Still no Inferno.

STATUS: PROPOSED

---

### FSN-ICE-FILE

FORMATION_ID: `FSN-ICE-FILE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-RIME` — `bishop` / proposed `rime_mason` — pack median
- `ROLE-LANCER` — `rook` / proposed `rank_lancer` — pack median + 1 — `isLeader` optional
- `ROLE-ROOTER` — `bishop` / proposed `snare_weaver` — pack median

VARIANT_RULES:

- Unlock after `FSN-RIME-RANK` **and** (`FSN-WIRE-ROOT` **or** `FSN-FILE-WIRE`). Wave 3 “Ice File.”
- Elite: Lancer-leader only. Mason and Weaver stay junior. Leader-boost is the escalation, not three elites.
- Mason ices the file the Lancer wants, **not** both galleries. Weaver Roots when the player is on-file **or** one tile off (ELITE Weaver) — base sheet Roots only on-file so stepping off is still complete.
- No Trap (File & Wire already taught hidden enter). No Sink. No Fuse. No Slow on the base sheet (rime is the tile tax; Frost after Root taxes the **cast**).
- COURT variant `FSN-ICE-FILE/VICAR` may add `ROLE-RICOCHET` **or** a Turret, not both, and only after this CADRE is answered. Do not also add a Pylon (two stationary guns).

SPELL_POOL_INTERACTIONS:

- Ice tax then Root on the file. Teleport / Mist Step skips the rime pay and does not trip wires (no wire here). Casts stay legal on Root.
- File-lance into a rooted, iced cell is physical. Off-axis you are safe.
- Dual MP: rime enter + Frost −1. Cap unit Slow at −2 if a variant adds Slow; base has **no** Slow.

TACTICAL_PLAN:

- Lancer holds until the player shares the file. Mason paints then Frosts. Weaver Roots the on-file player if a cast-from-tile exists.
- If the Lancer dies, boost lands on glass — intended. Remaining pair is rime + root, still walkable around.

SYNERGY:

- Ice tax then root on the file. Three Wave 2–3 verbs, one file. Combination, not a new monster.

PLAYER_THREAT:

- High if you share the rank. Low if you never do. The fail is greed on the file after you already learned PAIR.

COUNTERPLAY:

- Step off the file. Detour. Cast from Root. Barrier the ray / ice. Burst the Weaver. Peel the Lancer-leader early if boost is on.
- High leftover MP shrugs rime.

MAP_REQUIREMENTS:

- `chessboard` or `fortress` with a 4-tile file **and** two galleries. Reject maps with no 4-tile file (reroll).
- Ice must not cover both galleries. Root must leave spells legal.

AI_REQUIREMENTS:

- Lancer: linear-only + optional `isLeader`.
- Rime: file-prefer at CADRE.
- Rooter: on-file Root only on the base sheet; no refresh.
- Soph 4–6. `groupTactics` on. Blackboard: `ownedFile`.
- `chokepointCamp` only with a gallery.

VARIANTS:

- `FSN-ICE-FILE/NO-LEADER` — teaching CADRE without boost.
- `FSN-ICE-FILE/NO-ROOT` — fallback to `FSN-RIME-RANK` if `rootTurns` is not ready.
- `FSN-ICE-FILE/VICAR` — COURT: add Ricochet; bounce only if Root/Mark/hazard is public; still one `hitsMultiple`.

STATUS: PROPOSED

---

### FSN-SMOKE-HUNT

FORMATION_ID: `FSN-SMOKE-HUNT`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-SMOKE` — `bishop` / proposed `smoke_thurifer` — pack median
- `ROLE-SNIPER` — `bishop` / proposed `glass_sniper` — pack median — Mark + Frost, minRange 3
- `ROLE-OPTIC` — `bishop` / proposed `dim_optic` — pack median — range shrink

VARIANT_RULES:

- Unlock after `FSN-SMOKE-GLASS`. Wave 3 “Smoke Hunt.”
- Three bishops, three jobs: fog, min-range gun, range brick. Combination, not a new sprite.
- Elite: Sniper only. Smoke and Optic stay junior.
- Short Sight is the **one** rare. Mark on the Sniper is optional and never combined with Inferno or `starter-blast`.
- Optic VETERAN: skip Sight if **all** player equipped ids have `modifiableRange !== true` — then this body Frosts (still a trio of poke). Do **not** silently flag Frost as modifiable.
- No Fuse (Fog Fuse). No Reaver Swap-in (Broken Glass). No Mirror (reflect is a different anti-range).
- Weight ×1.5 if the player’s last battle used a majority range>2 kit (optional history; skip if none).

SPELL_POOL_INTERACTIONS:

- Smoke bricks LoS. Sight bricks `modifiableRange` by −2 for 2 turns. Sniper still has minRange 3 — the player cannot snipe back **with those guns**, but Strike / Barrier / Swap still work.
- Sniper Marks a cell the player can step off, then Frosts. Confirm Mark × Frost (Frost has upfront 20).
- Drain Courage is CHAMPION Optic (tax the whiff) — off the base sheet (`healAmount` would steal healer; Drain has heal — **do not put Drain on Optic** even at CHAMPION unless `aiProfile` exists; use Slow instead).

TACTICAL_PLAN:

- Thurifer smokes the Sniper’s ray. Optic Sights if a modifiable gun is equipped, then steps to Chebyshev 2 (dead zone vs Glass Shot). Sniper holds ≥ 3.
- One of the three peels a wisp (`focusAlreadySet`); the others stay on the player.
- If the player brought only Strike, Optic Frosts and the sheet is Smoke Glass + a Frost bishop — fine.

SYNERGY:

- LoS brick + range shrink + min-range gun. Anti-ranged exam with three readable answers: walk in, unmodified tools, occupy fog.

PLAYER_THREAT:

- High if you try to win a sniper duel. Low if you walk the gallery. Failure is dumping a long `modifiableRange` cast into fog **and** Sight.

COUNTERPLAY:

- Melee. Absolve / Cleanse Sight. Walk through smoke. Occupy the fog cell. Kill the Sniper (glass). Ignore Optic if your kit is unmodified.
- Player Barrier (enemy cannot have it) is a fair panic if you need cover while closing.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with two files. Sniper must have a tile to step off **and** the player must have a file that is not the smoked ray.
- Reject single-file maze.

AI_REQUIREMENTS:

- Smoke: live-ray-only; pack-brick with Optic at soph 4 (ELITE).
- Sniper: minRange 3 + Mark hygiene.
- Optic: skip-if-useless; do not chase into Chebyshev 1 (Sight is not a melee kit).
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-SMOKE-HUNT/NO-SIGHT` — fallback to `FSN-SMOKE-GLASS` + a junior Frost bishop if Short Sight apply is not ready.
- `FSN-SMOKE-HUNT/E-GLASS` — elite Sniper, Mark + Frost.

STATUS: PROPOSED

---

### FSN-PLUS-BATTERY

FORMATION_ID: `FSN-PLUS-BATTERY`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-PLUS` — `rook` or `queen` **without heal** / proposed `plus_cutter` — pack median + 1 — `isLeader` optional
- `ROLE-SINK` — `bishop` / proposed `sink_chanter` — pack median
- `ROLE-GLYPH` — `bishop` / proposed `glyph_sower` or live default — pack median — Mark + Poison

VARIANT_RULES:

- Unlock after (`FSN-WICK-COURT` **or** `FSN-MARK-CONFLAGRATION`). Wave 3 “Plus Battery.”
- Elite: Plus-leader only. Sink and Glyph stay junior.
- Cross Cut is the **one** elite rare. It fires only if two player-side bodies sit on the plus (player + wisp, or player after a sink cluster). Solo unmarked player → Frost, not plus. No `starter-blast` on this sheet (second `hitsMultiple`).
- Glyph Marks a tile the player can step off. Poison is the DoT; do not also Inferno (plus is the gun).
- Reroll on maps with no 5-tile plus (tiny `ruinsIslands` pockets).
- No Fuse (Wick Court). No Turret / Pylon (Shard Battery / Bastion Gate). No second `hitsMultiple`.

SPELL_POOL_INTERACTIONS:

- Sink clusters toward a plus origin. Glyph Mark on a cell of an arm ×2 the **next** spell (confirm Mark × Cross; if Mark is tile-next-spell, Cross must be a real spell apply).
- Cross via `hitTiles`. Diagonals are safe. CHAMPION Plus may origin on an empty tile so the player cannot “stand off the caster.”
- Sink dest still banned from lava / void. Prefer landing **on an arm** if a diagonal walk-off remains.

TACTICAL_PLAN:

- Glyph Marks a step-off cell on a plus arm, then Poison. Sink holes toward the origin only if an exit exists. Plus waits for two bodies or Frosts.
- If the player never clumps, this is a Frost/Mark trio — still a cadre of poke.

SYNERGY:

- Cluster on the plus origin, then Mark. Geometry artillery, not a bounce table (`FSN-SHARD-BATTERY` / Storm).

PLAYER_THREAT:

- High if you clump with a wisp on a plus arm. Low on a diagonal. Bounce/plus is optional.

COUNTERPLAY:

- Diagonal stance. Split from the Wisp. Desummon so the plus has one body. Barrier an arm. Kill the Plus (hp ~0.85). Occupy the sink cell.
- Player Chain Lightning into the clump is fair — the pack’s own plus is predicate-gated.

MAP_REQUIREMENTS:

- `chessboard`, `openField`, or `arena` with a 5-tile plus **and** diagonal walk-offs. Weight 0 on cramped closets.
- Sink radius-2 must not force both player-side bodies onto the plus with no diagonal.

AI_REQUIREMENTS:

- Plus: count `hitTiles` occupancy, never name; skip Cross without geometry (`AI-TEM-05` cousin).
- Sink: tile attractor; ELITE hole = plus origin.
- Glyph: do not recast Mark on a vacated tile.
- Soph 4–6. Blackboard: `plusOrigin`.
- Heal-less Plus so inference stays caster.

VARIANTS:

- `FSN-PLUS-BATTERY/LANE` — BRIGADE: Plus + Glyph only (ship if Sink tile-attract is not ready).
- `FSN-PLUS-BATTERY/NO-MARK` — Glyph Poison only; Plus then needs two bodies without a Mark amp.
- `FSN-PLUS-BATTERY/NO-LEADER` — teaching CADRE without boost.

STATUS: PROPOSED

---

### FSN-ABSOLVE-RACE

FORMATION_ID: `FSN-ABSOLVE-RACE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-ABSOLVER` — `queen` **without heal** / proposed `ash_absolver` — pack median
- `ROLE-PLATE` — `rook` / proposed `plate_warden` (else live `iron_golem` **without** absorb — teaching fallback) — pack median + 1
- `ROLE-IGNITE` — `queen` **without** heal / proposed `ignite_alchemist` — pack median

VARIANT_RULES:

- Unlock after (`FSN-PLATE-LINK` **or** `FSN-WARD-MEND`) **and** `FSN-STACK-CASH`. Wave 3 “Absolve Race.”
- Elite: Plate only. Absolver and Alchemist stay junior.
- The puzzle is **cleanse the plate vs cash the stacks**. Absolver does **not** carry `starter-heal` (must not infer healer). Cantor HP refill is `FSN-TWIN-PLATE` / `FSN-QUIET-CHOIR`.
- Absorb is the extra life — Plate HP is **lower** than golem. Fallback `FSN-ABSOLVE-RACE/GOLEM` if absorb is not ready: then this is Iron Skin + cleanse vs Ignite, still distinct, but **do not** call it absorb.
- No Pain Link (Plate Choir). No Tempo. No Coup. No Inferno on the Absolver.
- **Do not ship until ally `targetId` apply exists** (Absolve / Shield / Ward Plate).

SPELL_POOL_INTERACTIONS:

- Player (or Alchemist) paints DoTs. Absolver strips `debuff` + `dot` from the Plate (control first: Root / Short Sight / Goad, DoTs second). Ignite wants those stacks **before** the strip.
- Unused absorb expires. DoTs chew the plate. Cursed Wound does not reduce absorb; Absolve does not strip absorb.
- Two queens, two kits: Absolver has **zero** `healAmount`; Ignite has Poison + Ignite. Inference stays buffer + caster.

TACTICAL_PLAN:

- Plate walks into the path and Plates self (BASE) or the Absolver (ELITE). Absolver Absolves when the Plate has ≥1 matching effect; else Shields. Alchemist Ignites if stacks ≥ 2 **and** the Absolver is on cooldown.
- If the Absolver dies, remaining pair is plate + ignite — the race is over, cash is free. Intended (kill the cleanse).

SYNERGY:

- Cleanse vs cash. Support (not healer) + absorb + payoff. The player chooses which clock to respect.

PLAYER_THREAT:

- Long, structured. Spike is Ignite into a stripped plate **or** Ignite into a fresh plate you wasted Inferno on. Interruptible: kill the Absolver, or wait expiry, or cleanse yourself.

COUNTERPLAY:

- Kill the Absolver. Double-apply DoT after the strip (CD 2). Burst during the window. DoT the plate (chews absorb). Walk around (init 0.80 / MP-poor).
- Do not dump two Infernos into a fresh plate on the same round (fair-fight: one Inferno cadence — the Alchemist should not also Inferno).

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Absolver needs two walk-offs. Never a closed ring.
- No Thorned Ground on the only path to the Absolver.

AI_REQUIREMENTS:

- Absolver: buffer; never Absolve a clean ally; ELITE peel the Plate, not self, unless self is rooted.
- Plate: charger; no retreat above 40% effective; replace-don’t-stack plate.
- Ignite: stack gate; skip if Absolve just stripped this turn (blackboard `lastAbsolveTurn`) — otherwise the cash is a lie.
- Soph 4–6. `AI_BACKLINE_PROTECT` on. `groupTactics` on.

VARIANTS:

- `FSN-ABSOLVE-RACE/GOLEM` — live `iron_golem` if absorb is not ready.
- `FSN-ABSOLVE-RACE/NO-IGNITE` — BRIGADE-shaped: Absolver + Plate only (cleanse exam without cash).

STATUS: PROPOSED

---

### FSN-TWIN-PLATE

FORMATION_ID: `FSN-TWIN-PLATE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-TETHER` — `king` or `rook` / proposed `twin_tether` — pack median + 1
- `ROLE-PLATE` — `rook` / proposed `plate_warden` — pack median
- `ROLE-CANTOR` — `queen` / proposed `pale_cantor` or live default with `starter-heal` — pack median — self-heal + Shield

VARIANT_RULES:

- Unlock after `FSN-PLATE-LINK` **or** `FSN-QUIET-CHOIR`. Wave 3 “Twin Plate.”
- Elite: Tether only. Plate and Cantor stay junior.
- Distinct from Pain Link (redirect to **hostile**) and from Absolve Race (cleanse vs cash). Shared HP is **50/50 split** while Chebyshev ≤ 3.
- Do not also spawn `iron_golem` on this sheet. Do not also roll random summoner overlay.
- Cantor: Blood Mend (self) + Shield (ally). **No** Inferno. At most one Cantor. **Do not ship until ally `targetId` apply exists.**
- Pain Link stays off (redirect + split is COURT caution, not this id). Goad stays off (forced swing + split is too many incoming rules).
- Reroll if no ally (Tether cannot bind self).

SPELL_POOL_INTERACTIONS:

- Ward Plate absorb then HP. Tether splits leftover after absorb. Pull/Swap/Sink one body beyond 3 **breaks** the band — that is the designed answer.
- AoE that hits both splits **each** hit (no rebound of a lethal half). Challenge records the HP each body actually lost.
- Cantor Shields the Plate when the Plate is under 50% effective, else self-mends. Cursed Wound halves the mend, not the split.

TACTICAL_PLAN:

- Tether binds the Cantor (ELITE) or the lowest-HP ally (BASE), then walks to keep Chebyshev ≤ 3. Plate walks the path. Cantor stays at 4 with two walk-offs.
- If the Tether dies, remaining pair is plate + glass healer — `FSN-WARD-MEND` with absorb. Intended.

SYNERGY:

- Absorb then split; healer keeps both halves. Hit one body and both twitch; separate them and it becomes two ordinary fights.

PLAYER_THREAT:

- Long, structured. Spike is low. Fail is dumping a single-target nuke into the plated half without breaking range.

COUNTERPLAY:

- Break the band (Hook / Swap / Sink / walk them apart). Focus the Tether. Two independent DoTs. Hook the Cantor out. Wait absorb expiry.
- Do not clump your wisp into an AoE that also hits both tethered bodies unless you want that.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Room to pull them > 3 apart. Never a closed ring.
- No Thorned Ground on the only path to the Cantor.

AI_REQUIREMENTS:

- Tether: holder; VETERAN range-check; ELITE tether-the-carry; Haste self to stay in band is RARE (optional).
- Plate: same as `FSN-PLATE-LINK`.
- Cantor: healer + ally Shield. Same apply gate as `FSN-QUIET-CHOIR`.
- Soph 4–6. `AI_BACKLINE_PROTECT` on. `groupTactics` on.
- Incoming pipeline must exist (HIGH complexity — **do not ship** before split apply).

VARIANTS:

- `FSN-TWIN-PLATE/NO-CANTOR` — BRIGADE-shaped: Tether + Plate only.
- `FSN-TWIN-PLATE/ABSOLVE` — COURT: add `ROLE-ABSOLVER` instead of Cantor (keep both halves **clean**, not HP). Still no Goad. Discovery: family observe must not double-grant the Midnight Bishop `life-tether` door.

STATUS: PROPOSED

---

### FSN-FINISH-LINE

FORMATION_ID: `FSN-FINISH-LINE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-COUP` — `knight` / proposed `coup_duelist` — pack median — `isLeader` optional
- `ROLE-IGNITE` — `queen` **without heal** / proposed `ignite_alchemist` — pack median
- `ROLE-DEBUFFER` — `pawn` / live `plague_rat` — pack median − 1

VARIANT_RULES:

- Unlock after `FSN-COUP-ROT` **and** `FSN-STACK-CASH`. Wave 3 “Finish Line.”
- Elite: Coup-leader only. Alchemist and Rat stay junior.
- Cash stacks under 25%, then instant execute. **No `bell_sexton`.** Pale Cantor is a **counter** (heal out of window), not a member.
- Veil on the Coup is the **one** rare. Expose instead of Veil is a variant, never both on the same AP bar.
- Sacrifice stays off. Inferno stays off the Alchemist unless a variant says so (then still not the same AP bar as Ignite).
- Never CHAMPION Coup in a pack that lost its applicators (if Alchemist and Rat are dead, remaining Coup is a CELL leftover — intended).

SPELL_POOL_INTERACTIONS:

- Rat + Alchemist paint. Ignite consumes. If the cash drops the player through 25%, Coup is now legal. Readable three-step. If Ignite would kill now, Alchemist should still Ignite (Coup does not need to exist) — overkill is retarget, not a second hidden hit (`AI-SYS-19`).
- Coup refuses Strike on a target already ≤ 25% at ELITE (never waste the execute on a 10). BASE may Strike if Coup is on CD.
- Mark on Coup is optional. Player can step off.

TACTICAL_PLAN:

- Turn 1: Rat applies. Alchemist holds. Coup lurks at 3.
- Turn 2+: Alchemist Ignites at ≥ 2 stacks. Coup paths to the DoT’d body and Coups only when HP% ≤ 25 is public.
- One of the three peels a wisp; the others stay on the player. Do not enable all three to pile the wisp.

SYNERGY:

- Instant execute + DoT payoff + applicator. Setup, cash, threshold. Live rat so the pack is not three proposed sprites.

PLAYER_THREAT:

- High under 25% with Veil up. Still a heal-out. Failure is trading the Coup at 20% after eating Ignite.

COUNTERPLAY:

- Mend above 25% before they step in. Kill the Coup (hp ~0.75). Strip DoTs before cash. Kill the Alchemist first in this pack (family sheet says so). Plate then walk (absorb fakes the bar).
- Do not sit in melee at 26% “to finish the rat.”

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. No Time Warp. No Glass Realm.
- ≥ 2 walk-offs from wherever Coup can land.

AI_REQUIREMENTS:

- Coup: threshold hold + DoT-target at soph 4; optional `isLeader`.
- Ignite: stack gate; blackboard `hpAfterIgnite` so Coup does not also spend if the cash already kills (skip, not a cheat execute).
- Rat: apply-and-leave.
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-FINISH-LINE/NO-LEADER` — teaching CADRE.
- `FSN-FINISH-LINE/NO-IGNITE` — fallback to `FSN-COUP-ROT` if consume apply is not ready.
- `FSN-FINISH-LINE/TEMPO` — COURT caution: add Precentor **or** Veil, not both. Gift the Alchemist, not the Coup (gifting Coup a second AP to Coup+Strike a 26% target is a lock-adjacent spike — **forbidden**).

STATUS: PROPOSED

---

### FSN-BASTION-GATE

FORMATION_ID: `FSN-BASTION-GATE`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-PYLON` — `rook` / proposed `pylon_prelate` — pack median + 1 — `isLeader` — stationary 0-damage summon
- `ROLE-GOAD` — `pawn` or `knight` / proposed `goad_herald` — pack median — taunt
- `ROLE-SNIPER` — `bishop` / proposed `glass_sniper` — pack median — Frost; Mark is the **one** elite rare
- Optional fourth: `ROLE-SMOKE` junior **or** omit — if present, smokes the gallery, not the only approach

VARIANT_RULES:

- Unlock after `FSN-RESCUE-LINE` **or** `FSN-GLASS-WARD` **and** a leader-boost CADRE. Wave 3 “Bastion Gate.”
- One elite only: the Prelate-leader. Others stay junior so boost is the late scare, not four elites.
- Pylon cap 1, lifespan 4, `ap: 0`, `mp: 0`, must not path, must not cast, `damageScale: 0`. Do not also roll wolf/archer/turret. Do not co-spawn `stone_castellan`. Global summon cap still 2 — this sheet uses 1.
- Goad is CORE on the Herald, not a second rare. Mark on the Sniper is the elite rare. Never combined with Inferno or Cross Cut on this sheet.
- InstantKill / betrayal stay off. `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Prelate walks to the gallery, not through the player.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE `FSN-BASTION-GATE/POST` (variant): drop Sniper and optional Smoke — Pylon + Goad only.
- Weight 0 on cramped 1-tile closets (solvability). Pain Link stays **off** (forced swing into redirect is a later COURT, not this id).

SPELL_POOL_INTERACTIONS:

- Pylon occupies + blocks LoS like a unit. Weak in open field, strong in corridors. 0 XP on pylon death. Shield / Iron Skin on the **pylon**, not a second post.
- Goad: next damaging action must choose the Herald if they are a legal target. Non-damage (Slow, Barrier, Haste, Absolve, Smoke) ignores taunt. AoE that already includes the Herald satisfies it. Absolve **does** strip Goad (`effectCategory: "cc"`).
- Sniper Frost / Mark down the file the pylon does **not** occupy — the player is goaded around the post into the gun, or they take the gallery.
- `spell-rallying-cry` stays false.

TACTICAL_PLAN:

- Turn 1–2: Prelate places the pylon on the player’s approach aisle (peer) or off-axis (above), then Shields it. Herald Goads when an ally is lower HP, then steps so it **is** a legal Strike target. Sniper holds minRange 3 on the **other** file.
- Optional Smoke fogs the gallery LoS, never both approaches.
- If the pylon dies, the aisle opens; Prelate may retreat (`escapeRoute`) rather than suddenly one-shot.
- Leader boost 10% × fallen escort. Four bodies means a late Prelate can become stout — cut the leader early or accept a longer finish.

SYNERGY:

- Taunt into a pylon file, sniper on the wrap. Court-scale geometry. Sophistication and a fourth body are the unlock, not a new monster.

PLAYER_THREAT:

- Highest structure-and-legal-target threat in this drop. Still turn-based. Failure is pumping a 5-AP Inferno into the Herald while the Sniper Marks the wrap, **or** walking the only aisle into a post. Goad is optional if you cast a non-damaging tool.

COUNTERPLAY:

- Cast Slow / Barrier / Swap / Absolve (taunt ignores or strips). Kill the pylon (it has HP, no gun). Walk around. Sit on the placement cell. Burst the Herald with an AoE that also clips the Sniper. Snipe the Prelate down a gallery.
- Open field: this court is **weak** — that is intended. Do not retune pylon damage to “fix” open maps; **reroll** the id.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `corridorMaze` **with a detour**. Never a closed ring. Weight 0 on 1-tile closets.
- Pylon placement ring: ≥ 3 free cells, none void. Player must have a tile off the blocked file.
- Optional Smoke must not fog **both** the aisle and the gallery.

AI_REQUIREMENTS:

- Pylon owner: summoner + proposed cap/cooldown fall-through (Shield or Frost, never skip-lock). New summon AI `pylon` — do not reuse turret or bomber.
- Goad: charger; skip redundant Goad; ELITE protect-glass (the Sniper).
- Sniper: minRange 3 + Mark hygiene.
- Optional Smoke: live-ray-only on the gallery.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Prelate.
- Proposed: escorts do not path a closed box. Taunt targeting must exist for **player and AI** (HIGH — **do not ship** before `tauntCasterId`).

VARIANTS:

- `FSN-BASTION-GATE/POST` — BRIGADE: Pylon + Goad only (ship if Sniper min-range is not the run’s lesson).
- `FSN-BASTION-GATE/NO-SMOKE` — COURT of three.
- `FSN-BASTION-GATE/NO-MARK` — Sniper Frost only.
- `FSN-SHARD-BATTERY` remains the turret COURT; do not merge ids. Pylon does not shoot.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–3 still stand. This drop **meshes**; it does not replace.

```
PAIR:     WICK-STEP           RIME-RANK           SMOKE-GLASS
              \                   |                    /
CELL:      STACK-CASH          COUP-ROT          (RESCUE-LINE/SHOT)
              \                   |                    /
BRIGADE:  WICK-COURT     TEMPO-CHOIR     FOG-FUSE     RESCUE-LINE
              \                   |                    /
CADRE:    ICE-FILE     SMOKE-HUNT     PLUS-BATTERY     ABSOLVE-RACE
          TWIN-PLATE                 FINISH-LINE
              \                   |                    /
COURT:                    BASTION-GATE     ICE-FILE/VICAR     FINISH-LINE/TEMPO
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-WICK-STEP` | `FSN-HOOK-SLAM` **or** `FSN-BELL-CUT` |
| `FSN-RIME-RANK` | `FSN-FILE-GUARD` |
| `FSN-SMOKE-GLASS` | `FSN-GLASS-WARD` |
| `FSN-STACK-CASH` | `FSN-ROT-CUT` **or** `FSN-PAPER-PLAGUE` |
| `FSN-COUP-ROT` | `FSN-ROT-CUT` (heal-out this run). **Never** pair with `FSN-BELL-CUT` as the teaching pair |
| `FSN-WICK-COURT` | `FSN-WICK-STEP` |
| `FSN-TEMPO-CHOIR` | `FSN-STACK-CASH` + `FSN-HEX-BLOOD` |
| `FSN-FOG-FUSE` | `FSN-WICK-STEP` + (`FSN-SMOKE-GLASS` **or** `FSN-MIST-HUNT`) |
| `FSN-RESCUE-LINE` | `FSN-GLASS-WARD` |
| `FSN-ICE-FILE` | `FSN-RIME-RANK` + (`FSN-WIRE-ROOT` **or** `FSN-FILE-WIRE`) |
| `FSN-SMOKE-HUNT` | `FSN-SMOKE-GLASS` |
| `FSN-PLUS-BATTERY` | `FSN-WICK-COURT` **or** `FSN-MARK-CONFLAGRATION` |
| `FSN-ABSOLVE-RACE` | (`FSN-PLATE-LINK` **or** `FSN-WARD-MEND`) + `FSN-STACK-CASH` |
| `FSN-TWIN-PLATE` | `FSN-PLATE-LINK` **or** `FSN-QUIET-CHOIR` |
| `FSN-FINISH-LINE` | `FSN-COUP-ROT` + `FSN-STACK-CASH` |
| `FSN-BASTION-GATE` | (`FSN-RESCUE-LINE` **or** `FSN-GLASS-WARD`) + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 3 SPELL_PROPOSALS verbs (not this drop)

Sibling [`SPELL_PROPOSALS_2026-09-02.md`](../automation/SPELL_PROPOSALS_2026-09-02.md) stamps Ley Toll, Fan Bolt, Back Step, Pawn Trade, Twin Gate, Sidestep Ward, Far Sting, and other Wave 3 spell ids. **No family owns them yet.** This catalog does **not** mint `FSN-*` ids for them. A later elite-evolution wave must sheet families before a formation drop packs them.

Do **not** pack `coup_duelist` with `bell_sexton` as a teaching pair. `FSN-BELL-CUT` stays the delayed-clock lesson; `FSN-COUP-ROT` is the instant-25% lesson.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–3, plus Wave 3 verbs in this order (from elite-evolution 2026-09-02 §8):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920). Earlier PAIR sheets (`FSN-IRON-TIDE`, `FSN-WICK-STEP` band 0 Frost-only) can ship first.
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11997). Stop writing `res`/`sp` as 0.05–0.75 (`spawnPolicy.ts` 261–272).
3. Explicit `enemy.role` / `aiProfile` so healAmount and Enrage/Tempo kits do not collapse (`docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04, AI-ROL-05).
4. Ally buff apply (`targetId` on Shield / Iron Skin / Ward Plate / Tempo / Absolve / Leash Hook). **`FSN-TEMPO-CHOIR`, `FSN-ABSOLVE-RACE`, `FSN-TWIN-PLATE`, `FSN-RESCUE-LINE` must not ship before that apply exists.**
5. Linear kit clone + `AI-SYS-06` for `ROLE-LANCER` (Ice File). Official id `spell-file-lance`.
6. `effectCategory` callers for `applyPushback` / `applyAttract` — including **tile** attractor for Sink.
7. Fuse table; instant execute HP% gate (not `instantKill`); DoT consume; range debuff; next-turn AP; ally cleanse; `hitTiles` plus; ice paint; smoke LoS; ally pull; pylon AI; taunt targeting; incoming split.
8. Summoner cooldown fall-through (pylon skip-lock today).
9. Cap the summoner overlay (`WX` 11932–11942) — COURT pylon sheets assume the lottery does not add a second engine.
10. Discovery: family observe must not double-grant ACHIEVEMENT / BOSS / MULTI_SOURCE doors (`tempo-gift`, `absolve`, `sinkhole`, `life-tether`).

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order changes, or damage-formula edits. Map **selection** is a filter on already generated maps.

Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-WICK-STEP`, `FSN-WICK-COURT` | fuse table + push caller + dest legality |
| `FSN-WICK-COURT`, `FSN-PLUS-BATTERY` | tile-attractor `applyAttract` |
| `FSN-RIME-RANK`, `FSN-ICE-FILE` | rime paint; Ice File also needs `rootTurns` |
| `FSN-SMOKE-GLASS`, `FSN-SMOKE-HUNT`, `FSN-FOG-FUSE` | smoke LoS helper (not `placeBarrier`) |
| `FSN-FOG-FUSE` | public wick tell under smoke |
| `FSN-STACK-CASH`, `FSN-TEMPO-CHOIR`, `FSN-FINISH-LINE`, `FSN-ABSOLVE-RACE` | Ignite consume + stackId |
| `FSN-COUP-ROT`, `FSN-FINISH-LINE` | HP% ≤ 25 gate; Coup reads HP not absorb |
| `FSN-TEMPO-CHOIR` | next-turn AP overlay + ally `targetId` + family flag flip |
| `FSN-ABSOLVE-RACE` | ally cleanse apply (no `healAmount`) |
| `FSN-PLUS-BATTERY` | `hitTiles` plus + skip without geometry |
| `FSN-RESCUE-LINE` | ally pull + fizzle-aware ring |
| `FSN-TWIN-PLATE` | incoming 50/50 split + absorb order |
| `FSN-BASTION-GATE` | pylon AI (`ap: 0`, `mp: 0`, no path, no cast) + `tauntCasterId` |
| `FSN-SMOKE-HUNT` | Short Sight writes **target** range, not caster bonus |

---

## Sources (line-accurate, 2026-09-21)

- Kits / inference / decide / summoner skip / name heuristic: `src/frontend/src/engine/enemyAI.ts` 163–185, 194–199, 218–223, 447–476, 1662–1706, 1832–1888
- Kit assignment + summoner roll + HP overwrite: `src/frontend/src/components/WorldExploration.tsx` 11920, 11932–11942, 11970–11974, 11991–11997
- Family lottery + spacing: `src/frontend/src/engine/spawnPolicy.ts` 35–57, 261–297, 38; WX 5763, 5855, 5862–5866
- Ember / tide melee hooks: `WorldExploration.tsx` 16789–16818
- Void reflect: `src/frontend/src/engine/castHelpers.ts` 335–337
- Push / attract (no spell caller): `src/frontend/src/engine/occupancy.ts` 482 / 537
- Gates, summon cap, kamikaze: `src/frontend/src/data/gameConstants.ts` 200–209, 271–301
- Families: `src/frontend/src/types/gameTypes.ts` 12–20
- Spells: `src/frontend/src/data/spellData.ts` (`starter-heal` 85–101 self-only; Enrage ally 274–289; unique flags 143–686)
- Map archetypes: `src/frontend/src/engine/mapGen.ts` 6–44
- Wave 3 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-02.md` §3–§4
- Wave 3 spell verbs: `docs/automation/SPELL_PROPOSALS_2026-09-01.md`
- Wave 3 leftover spells (deferred): `docs/automation/SPELL_PROPOSALS_2026-09-02.md`
- AI modules referenced: `docs/ENEMY_AI_EVOLUTION.md` / `docs/ENEMY_AI_EVOLUTION_2026-09-02.md` AI-SYS-04, AI-SYS-06, AI-SYS-19, AI-ROL-05, AI-TEM-04, AI-TEM-05
- Drop 1: `docs/design/ENEMY_FORMATIONS_2026-08-31.md`
- Drop 2: `docs/design/ENEMY_FORMATIONS_2026-09-01.md`
- Drop 3: `docs/design/ENEMY_FORMATIONS_2026-09-02.md`

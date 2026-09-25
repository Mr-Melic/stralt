# World Dynamics Catalog

**Role:** World Dynamics Designer  
**Date:** 2026-09-25 (wave 8)  
**Canonical IDs:** `src/frontend/src/engine/worldFeatures.ts`  
**Status:** Designed. Not wired into map generation, the RAF loop, turn advance, or combat damage formulas.  
**ACTION_IDs:** `WDD-2026-08-31-001` (wave 1) · `WDD-2026-09-01-001` (wave 2) · `WDD-2026-09-02-001` (wave 3) · `WDD-2026-09-21-001` (wave 4) · `WDD-2026-09-22-001` (wave 5) · `WDD-2026-09-23-001` (wave 6) · `WDD-2026-09-24-001` (wave 7) · `WDD-2026-09-25-001` (wave 8)

These features exist so a long-lived character still meets new spatial and risk decisions after the 22 live map modifiers and lava / ice / spikes have been seen many times. Variation comes from **rarity weights** and **relative difficulty versus same-tier content**, not from “unlocks at level N”.

## Non-negotiables

Every feature below:

1. **Creates a decision** — skip, path, spend, or engage.
2. **Is visually understandable** — glyph + carved-slate tint + tooltip (not color-only).
3. **Preserves solvability** — `evaluateSolvability` still passes: legal spawn, reachable hostiles, at least one reachable portal, spawn not on an exit.
4. **Obeys combat rules** — AP/MP spends, initiative, occupancy, LoS, explicit spell metadata. No name-based heuristics.
5. **Has counterplay** — a readable way to refuse, delay, or invert the threat.

Hard product rules this catalog must not break:

- Credits (XP / Doka) only through `applyRewards` on `createProgressPersist`.
- Player heals and death penalties through `saveBattleStats` on that same lock.
- Hazard HP through `recordChallengeDamageTaken` (combat) or `recordInBattleChallengeDamage` (in-battle lava-like ticks).
- Death Realm 1.5s guards: no portals and no encounters until the timer fires.
- Run maps: `filterRunPortals` still allows only the progression portal.
- Caps: `MAX_HAZARD_TILES` 50, `MAX_ENEMIES` 20, 16×16 grid.
- Do not place on spawn ±3 or on portal cells (same exclusion as modifier hazard seeding).
- Do not touch RAF, `mapGen.ts` generation, turn logic, or existing damage math to implement this catalog. Place as a post-finalize overlay, then re-run solvability.

## Variation model (indefinite progression)

| Knob | Rule |
| :--- | :--- |
| Rarity weights | common 40 · uncommon 20 · rare 8 · epic 3 · legendary 1 |
| Relative difficulty | soft / medium / hard / extreme versus **same-tier** templates |
| Threat multipliers | 0.6 / 1.0 / 1.35 / 1.75 |
| Reward multipliers | 1.0 / 1.25 / 1.75 / 2.5 on the map’s normal `applyRewards` grant |
| HP taxes | fraction of **current max HP** so a seam still matters at 1000 HP |
| Slots per map | tile 55% · encounter 25% · event 15% · max 3 features |
| Death Realm | no features |
| Dungeon / Boss Rush | no Flicker Gate, no Gambit Chest, no Echo Gate, no Pilgrim Banners, no Latch Gate, no Wager Gate, no Pact Gate, no Twilight Gate, no Ash Gate, no Hearth Gate (portal-filter + run integrity) |
| Live modifiers | the existing 22 still roll on their own two-roll; this catalog does not replace them |

`pickWeightedFeatures` never receives player level.

Elite / invasion bodies are **same-tier spawn config × threat multiplier**. Extra spells are rows with `usableByEnemy === true`.

## Live systems this catalog does not clone

- Hazard types `lava` / `ice` / `spikes` (flat 8–16 / slow / 5–11).
- Map modifiers in `engine/mapModifiers.ts` (including Void Rift’s map-wide tick + displacement).
- Regular, dungeon, boss-rush, death-realm, white, and progression portals.
- Ground Doka coins.

New seams, clouds, and bars use **% max HP** so they stay relevant beside those flat tiles.

## Placement contract (for a later implementer)

1. Generate and finalize the map as today.
2. Roll `pickWeightedFeatures`.
3. For each pick, place only on floor cells that are not spawn±3 and not portals.
4. If `blocksWalk` or `requiresBypass`, skip the feature when `evaluateSolvability` would fail with it present.
5. If `canAddHazardTiles` / `canAddEnemies` is false, skip or shrink the band.
6. Arena maps with no wall-adjacent floor skip Ash Rain (no shelter).
7. Maps that would start with only one living unit skip Isolation Chill (no warm pair).
8. Do not add a second copy of the same `WORLD_FEATURE_ID` on one map.
9. Do not place two `blocksWalk` features on the same cell.
10. Maps that cannot fit 3 extra enemies skip Phalanx Line and Quiet Camp.
11. Maps that would start with fewer than 3 living units skip Crowd Press (no press trio).
12. All-corridor maps with no open-center floor skip Cramped Stone (no shelter).
13. Maps that cannot fit 1 extra enemy skip Horn Relay.

## Visual language

Carved stone, dark slate, crimson accents. Each feature: **inlay glyph + tile wash + hover label**. Motion is slow (ember pulse, ash drift, portcullis rust) so it reads in a turn-based game. Color-blind players get the glyph and the tooltip, not hue alone.

---

## Features

### WF-HAZ-EMBER_VEIN

WORLD_FEATURE_ID: WF-HAZ-EMBER_VEIN  
NAME: Ember Vein  
MECHANIC: A cracked slate seam glows ember-orange. Stepping on it costs 4% of the unit’s current max HP. Walkable. Does not replace lava tiles.  
PLAYER_DECISION: Spend MP to path around the seam, or cut through and pay the HP tax.  
RELATIVE_DIFFICULTY: medium (threat 1.0 — a short-cut tax, not a fight)  
RARITY: common (weight 40)  
VISUAL: Ember inlay, `#8a2a12` wash, flame-dot pulse, tooltip “step tax as % of your max HP”.  
SOLVABILITY: Floor only. Never on spawn±3 or portals. Never the only cell in a corridor (does not block).  
COMBAT_RULES: Challenge HP recorders. Wounded enemy AI avoids it like lava. Counts toward `MAX_HAZARD_TILES` (3–6 tiles).  
COUNTERPLAY: Walk around, teleport (ground/self metadata), or send a summon.

### WF-HAZ-CREEP_MIST

WORLD_FEATURE_ID: WF-HAZ-CREEP_MIST  
NAME: Creeping Ash  
MECHANIC: A 3-tile ash cloud on a painted lane advances one tile at the start of each round. Ending a turn inside it costs 6% max HP.  
PLAYER_DECISION: Move now before it arrives, stand just behind it, or lure an enemy into the next cell.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare (weight 8)  
VISUAL: Grey-violet cloud, lane chevrons, drifting ash.  
SOLVABILITY: Lane on floor only. Cloud never covers the only portal or spawn. A parallel floor path remains.  
COMBAT_RULES: Round-start move only. Tax via in-battle challenge HP. No AP/MP spend, no skipped turns.  
COUNTERPLAY: Read the chevrons; end turns off-lane; push/attract a foe onto the next cell.

### WF-TRP-GLYPH_PLATE

WORLD_FEATURE_ID: WF-TRP-GLYPH_PLATE  
NAME: Glyph Plate  
MECHANIC: A carved rune is visible from an adjacent tile. The first unit to step on it takes 8% max HP once; the plate then becomes floor.  
PLAYER_DECISION: Path around, spend the trap yourself, or bait an enemy onto it.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon (weight 20)  
VISUAL: Crimson rune plate, dim until adjacent, bright when armed.  
SOLVABILITY: Walkable before and after. Never hidden. Never on spawn/portals.  
COMBAT_RULES: One-shot step trigger. Challenge HP. No name-based “trap spell” lookup.  
COUNTERPLAY: Approach from a seen side, send a summon first, or shove an enemy on.

### WF-TER-CRUMBLE_PILLAR

WORLD_FEATURE_ID: WF-TER-CRUMBLE_PILLAR  
NAME: Crumble Pillar  
MECHANIC: A cracked column blocks walk and LoS. Any adjacent combatant may spend 2 AP (no spell) to shatter it into floor.  
PLAYER_DECISION: Spend 2 AP for a shortcut / LoS, leave it as cover, or make the enemy break it.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Carved column with crack inlay, chips on break.  
SOLVABILITY: Must not be a cut-vertex. If the pillar would fail `evaluateSolvability`, skip the feature.  
COMBAT_RULES: 2 AP occupancy action. No damage. Counts as a wall for LoS until broken.  
COUNTERPLAY: Ignore when a bypass exists; break when the cell is worth 2 AP; hide from linear spells.

### WF-OBS-FALLEN_GATE

WORLD_FEATURE_ID: WF-OBS-FALLEN_GATE  
NAME: Fallen Gate  
MECHANIC: A rusted portcullis blocks one corridor cell for 2 rounds, then becomes floor. A painted 2→1 timer sits on the tile.  
PLAYER_DECISION: Wait two rounds for the short path, or spend MP on the long way now.  
RELATIVE_DIFFICULTY: medium  
RARITY: common  
VISUAL: Iron portcullis on slate, rusting as the timer drops.  
SOLVABILITY: Place only when a second spawn→portal route already exists. Never the only exit.  
COMBAT_RULES: Wall occupancy while up. No damage. Timer ticks at round end.  
COUNTERPLAY: Take the long path, wait, or teleport past if metadata allows.

### WF-ZON-SHRINE_POOL

WORLD_FEATURE_ID: WF-ZON-SHRINE_POOL  
NAME: Shrine Pool  
MECHANIC: A teal basin heals 8% max HP the first time a unit ends its turn on the tile, then dries. Enemies can drink it.  
PLAYER_DECISION: Contest it this turn, save it, or deny the enemy.  
RELATIVE_DIFFICULTY: soft  
RARITY: common  
VISUAL: Teal water, rising motes, dry stone after use.  
SOLVABILITY: Walkable. Optional. Never on spawn/portals.  
COMBAT_RULES: Zone tick, not a spell. Player HP persist via `saveBattleStats` on the progress lock.  
COUNTERPLAY: Step on first, shove the enemy off, or ignore when healthy.

### WF-ZON-WARD_CIRCLE

WORLD_FEATURE_ID: WF-ZON-WARD_CIRCLE  
NAME: Ward Circle  
MECHANIC: A gold inlay grants +20% RES while a unit stands on it. Lost on leaving. Either side may hold it.  
PLAYER_DECISION: Plant on the ring, pull the fight onto it, or deny the tile.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Gold ring inlay on dark slate.  
SOLVABILITY: One walkable cell. Does not seal a path.  
COMBAT_RULES: Standing-zone RES, not a buff spell (Null Field does not strip it). Existing RES mitigation; no new damage formula.  
COUNTERPLAY: Occupy, push the holder off, or fight at range.

### WF-TEL-MIRROR_STEP

WORLD_FEATURE_ID: WF-TEL-MIRROR_STEP  
NAME: Mirror Step  
MECHANIC: Two linked cyan glyphs. Entering one for 1 MP exits the other. If the exit is occupied, the travelers swap. Either side may use the pair.  
PLAYER_DECISION: Spend 1 MP to reposition, walk, or leave the pair as an enemy escape.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Paired cyan glyphs that pulse in sync.  
SOLVABILITY: Both on floor, not on spawn/portals. The map is solvable without using them.  
COMBAT_RULES: 1 MP from the unit’s current MP. Not a teleport spell — do not key off `effectCategory`.  
COUNTERPLAY: Stand on the exit to block or force a swap; ignore the pair.

### WF-PRT-FLICKER_GATE

WORLD_FEATURE_ID: WF-PRT-FLICKER_GATE  
NAME: Flicker Gate  
MECHANIC: An extra cracked-rim portal. Entering rolls a random eligible overworld map and pays a bonus `applyRewards` grant at the hard/extreme multiplier. It is never the only exit.  
PLAYER_DECISION: Take the stable portal you can see, or gamble the flicker.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic (weight 3)  
VISUAL: Portal with cracked stone rim, alpha flicker.  
SOLVABILITY: Always in addition to a reachable stable portal. Forbidden in dungeon, boss rush, and Death Realm.  
COMBAT_RULES: Portal transition, not a combat action. Bonus via `applyRewards` on the persist lock. Death-realm guards still block entry.  
COUNTERPLAY: Ignore it. The stable exit always works.

### WF-INV-WARBAND

WORLD_FEATURE_ID: WF-INV-WARBAND  
NAME: Warband Incursion  
MECHANIC: A warhorn announces +3 to +5 extra same-tier enemies (tier spawn config × extreme threat). Clearing them pays extreme reward multiplier.  
PLAYER_DECISION: Fight the packed field for a large grant, or walk to a portal and leave.  
RELATIVE_DIFFICULTY: extreme  
RARITY: legendary (weight 1)  
VISUAL: Extra war banners, crimson announce strip.  
SOLVABILITY: Add enemies only up to `MAX_ENEMIES`, all on the spawn flood-fill. Skip if the roster is already at cap.  
COMBAT_RULES: Normal hostiles. Rewards only through `applyRewards` after victory (no per-kill resolver). Death guards still block encounter start.  
COUNTERPLAY: Leave without engaging; kite with summons; focus a flagged leader.

### WF-ELT-BANNER_PATROL

WORLD_FEATURE_ID: WF-ELT-BANNER_PATROL  
NAME: Banner Patrol  
MECHANIC: One elite (same-tier × hard threat) walks a 4–6 tile loop marked by banner dots. Touch starts combat. Kill pays hard reward multiplier.  
PLAYER_DECISION: Intercept the loop, wait until they are far from the exit, or never touch them.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare  
VISUAL: Banner dots on the loop, elite with a pennant.  
SOLVABILITY: Loop is floor. Elite counts as 1 enemy. Exit reachable without crossing the loop.  
COMBAT_RULES: World contact starts a normal battle. Extra spells from `usableByEnemy` only. Victory → `applyRewards`.  
COUNTERPLAY: Stand off the loop; fight when isolated.

### WF-TRS-RELIC_CACHE

WORLD_FEATURE_ID: WF-TRS-RELIC_CACHE  
NAME: Relic Cache  
MECHANIC: A locked chest. 2 AP adjacent opens it: `applyRewards` at medium multiplier, 40% chance of one same-tier guardian.  
PLAYER_DECISION: Spend 2 AP (and maybe fight) or walk past.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Locked chest, gold trim, carved lock.  
SOLVABILITY: Adjacent-open, not a wall. Guardian only on a reachable floor cell.  
COMBAT_RULES: AP cost, not a spell. Credits via persist-lock `applyRewards`. No `updateCharacter` Doka.  
COUNTERPLAY: Skip; open after the map is clear.

### WF-SPL-RUNE_BEARER

WORLD_FEATURE_ID: WF-SPL-RUNE_BEARER  
NAME: Rune Bearer  
MECHANIC: One same-tier enemy carries extra spells from `SpellConfig` rows with `usableByEnemy === true` (1–3 by rarity roll, not level). On death the player may attune one of those ids for the rest of this map.  
PLAYER_DECISION: Focus the bearer to steal a spell, or ignore them.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic  
VISUAL: Enemy with a hovering spell orb.  
SOLVABILITY: Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable.  
COMBAT_RULES: Metadata only (`usableByEnemy`, `targetType`, costs). Temporary attune does not call `upgradeSpell` and does not persist `spellLevel*` arrays.  
COUNTERPLAY: Kite and ignore, burst first, or steal a utility spell and leave.

### WF-RSK-BLOOD_ALTAR

WORLD_FEATURE_ID: WF-RSK-BLOOD_ALTAR  
NAME: Blood Altar  
MECHANIC: End a turn on the basin to pay 15% max HP once and flag this map’s next `applyRewards` credit with the hard multiplier.  
PLAYER_DECISION: Pay HP for a fatter victory/portal purse, or keep the HP.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic  
VISUAL: Crimson basin, slow drip.  
SOLVABILITY: Optional floor tile. Map is solvable if never used.  
COMBAT_RULES: HP via challenge recorders. Multiplier on the next `applyRewards` enqueue only. Death still uses `saveBattleStats`.  
COUNTERPLAY: Skip unless you can survive the tax and expect a credit.

### WF-RSK-GAMBIT_CHEST

WORLD_FEATURE_ID: WF-RSK-GAMBIT_CHEST  
NAME: Gambit Chest  
MECHANIC: Safe lock: small `applyRewards` (soft). Risk lock: 50% extreme grant, 50% ambush of 2 same-tier enemies and no grant.  
PLAYER_DECISION: Sure purse, coin-flip, or walk away.  
RELATIVE_DIFFICULTY: extreme  
RARITY: legendary  
VISUAL: Two-tone lock (slate / crimson).  
SOLVABILITY: Optional. If two ambush cells cannot be placed under the cap, the risk lock pays the grant instead of soft-locking. Exploration only.  
COMBAT_RULES: Both locks credit only through `applyRewards`. No out-of-lock jackpot mint.  
COUNTERPLAY: Walk away; pick safe when wounded.

### WF-MOD-CROSSWIND

WORLD_FEATURE_ID: WF-MOD-CROSSWIND  
NAME: Crosswind  
MECHANIC: After a unit spends MP to move, if the next cell in the painted wind direction is floor and empty, they slide one extra tile at no MP. Hazards on the slide resolve normally.  
PLAYER_DECISION: Path so the slide helps, or stop short of a dump onto ember / lava / spikes.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Dust streaks, wind chevrons on the rim.  
SOLVABILITY: Slide stays on the walkable graph. A unit can always choose a paid path that does not slide into a wall.  
COMBAT_RULES: Forced step after a legal MP spend. Does not change AP costs or damage formulas. Ice / slime doublers apply to paid steps only.  
COUNTERPLAY: End the paid path so the next wind cell is a wall (no slide).

### WF-MOD-LOW_CEILING

WORLD_FEATURE_ID: WF-MOD-LOW_CEILING  
NAME: Low Ceiling  
MECHANIC: Spells with `linear === true` keep metadata range. All other targeted spells lose 1 `maxRange` (min 1).  
PLAYER_DECISION: Switch to linear spells, walk closer, or accept shorter reach.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Darker vignette, hanging stone teeth.  
SOLVABILITY: No tile change. Melee and linear kits remain usable.  
COMBAT_RULES: Reads `SpellConfig.linear` / `maxRange` / `minRange` only. Attack Nearest and summons are not spells. No damage rewrite.  
COUNTERPLAY: Cast linear, close distance, or ignore ranged options this map.

### WF-EVT-ECLIPSE

WORLD_FEATURE_ID: WF-EVT-ECLIPSE  
NAME: Eclipse Hour  
MECHANIC: This map only: all `maxRange` −1 (min 1), and melee adjacency deals +15% of the **already computed** hit (after existing RES/SR).  
PLAYER_DECISION: Close for the melee bonus, hold a kite at reduced range, or skip fights.  
RELATIVE_DIFFICULTY: extreme  
RARITY: legendary  
VISUAL: Dim field, crimson corona at the horizon.  
SOLVABILITY: No blocks. Leaving is always legal. Exploration only.  
COMBAT_RULES: Range clamp is metadata. The +15% scales the post-formula number — it does not replace `combatMath`. Enemies gain it too.  
COUNTERPLAY: Refuse the fight, summon a front-liner, or lean into melee.

### WF-ENV-ASH_RAIN

WORLD_FEATURE_ID: WF-ENV-ASH_RAIN  
NAME: Ash Rain  
MECHANIC: At the end of each combatant turn, if they are not adjacent to a wall, they pay 3% max HP. Wall-adjacent cells show a shelter hatch.  
PLAYER_DECISION: Hug walls, hold the center and pay, or shove foes off the wall.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare  
VISUAL: Falling ash overlay, hatch marks on shelter cells.  
SOLVABILITY: Skip on maps with no wall-adjacent floor (open arena) so shelter exists.  
COMBAT_RULES: End-of-turn challenge HP. Summons pay it. No skipped turns. No spell-damage change.  
COUNTERPLAY: End turns on hatched cells, or pay to hold an angle.

### WF-ENV-TIDE_SPIKE

WORLD_FEATURE_ID: WF-ENV-TIDE_SPIKE  
NAME: Tide Spikes  
MECHANIC: A 3-tile spike bar on a painted lane shifts one cell at each round start. Occupying the bar when it arrives costs 5% max HP (not the flat 5–11 spike roll).  
PLAYER_DECISION: Stand off-lane, time a cross, or bait an enemy onto the next cells.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare  
VISUAL: Charcoal bar, gold chevrons, spike tips.  
SOLVABILITY: Lane never includes the only portal or spawn. A floor path around the lane exists.  
COMBAT_RULES: Round-start move, then tax. Challenge HP. 3 tiles toward the hazard cap. Wounded AI avoids the next bar cells.  
COUNTERPLAY: Read chevrons; cross after it passes; push a foe onto the incoming bar.

---

## Wave 2 (2026-09-01)

Second-wave seams so a long-lived character still meets new decisions after wave 1 has been seen many times. Same rarity weights and relative difficulty. Same overlay contract. Do not clone lava / ice / spikes, the live 22 modifiers, or wave-1 ids.

### WF-HAZ-SALT_CRUST

WORLD_FEATURE_ID: WF-HAZ-SALT_CRUST  
NAME: Salt Crust  
MECHANIC: Pale salt tiles. The first salt tile entered in a turn is free. Each extra salt tile entered that same turn costs 3% max HP. Walkable. Does not replace ice or lava.  
PLAYER_DECISION: Hop on and off after one tile, or pay to traverse a long salt path in a single turn.  
RELATIVE_DIFFICULTY: medium (threat 1.0 — a path tax, not a fight)  
RARITY: common (weight 40)  
VISUAL: Salt inlay, `#5a5648` wash, pale crust glyph, tooltip “first salt step free; extras tax % max HP”.  
SOLVABILITY: Floor only. Never on spawn±3 or portals. Never the only cell in a corridor (does not block).  
COMBAT_RULES: Challenge HP recorders. Wounded AI avoids a second salt step like lava. Counts toward `MAX_HAZARD_TILES` (4–8 tiles).  
COUNTERPLAY: Step off after one tile, teleport (ground/self metadata), or send a summon to spend the free step.

### WF-HAZ-HUNT_LANTERN

WORLD_FEATURE_ID: WF-HAZ-HUNT_LANTERN  
NAME: Hunting Lantern  
MECHANIC: A single lantern orb. In battle it steps one tile at round start toward the last unit that spent MP this round (painted facing). Landing on a unit costs 5% max HP. Out of battle it sits still; walking onto it pays the same tax.  
PLAYER_DECISION: Stay still so it does not advance, step off its painted facing, or bait it onto an enemy.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare (weight 8)  
VISUAL: Lantern glyph, `#4a3010` wash, facing chevron, ember pulse.  
SOLVABILITY: Never starts on spawn/portal. A floor path around the orb remains. Not a wall.  
COMBAT_RULES: Round-start 1-tile step. Challenge HP. No AP/MP spend, no skipped turns. 1 hazard budget.  
COUNTERPLAY: Do not spend MP; end off the chevron; push/attract a foe onto the next cell.

### WF-TRP-PRESSURE_MOSAIC

WORLD_FEATURE_ID: WF-TRP-PRESSURE_MOSAIC  
NAME: Pressure Mosaic  
MECHANIC: A visible 2×2 carved mosaic. If two or more units occupy it at end of a combatant turn, every unit on the mosaic pays 7% max HP once; the mosaic then becomes floor.  
PLAYER_DECISION: Do not share the mosaic, bait a second body onto it, or detonate it with a summon.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon (weight 20)  
VISUAL: Four-tile mosaic, `#3a2418` wash, carved joints, always visible.  
SOLVABILITY: Walkable before and after. Never covers spawn/portals.  
COMBAT_RULES: End-of-turn occupancy check. Challenge HP. No hidden tiles. No name-based trap lookup.  
COUNTERPLAY: Leave before a second unit enters; send a summon; shove a foe onto a second cell.

### WF-TER-CINDER_BARREL

WORLD_FEATURE_ID: WF-TER-CINDER_BARREL  
NAME: Cinder Barrel  
MECHANIC: A barrel blocks walk and LoS. Adjacent: 1 AP to roll it one tile in a chosen cardinal if empty; if the next cell holds a unit the barrel stops and that unit pays 5% max HP. 2 AP adjacent smashes it to floor.  
PLAYER_DECISION: Roll it as a projectile, smash it for the cell, or leave it as cover.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Iron-bound barrel, `#3a2218` wash, crack chips on smash.  
SOLVABILITY: Must not be a cut-vertex. Skip if `evaluateSolvability` would fail with it intact.  
COMBAT_RULES: AP occupancy actions, not spells. Hit tax via challenge HP. Wall LoS until smashed.  
COUNTERPLAY: Ignore when a bypass exists; smash when the cell is worth 2 AP; roll to tax a stacked foe.

### WF-OBS-TIDE_DOOR

WORLD_FEATURE_ID: WF-OBS-TIDE_DOOR  
NAME: Tide Door  
MECHANIC: One corridor cell is a wall on odd rounds and floor on even rounds. A painted open/shut glyph flips at round start.  
PLAYER_DECISION: Cross on even rounds, wait a round, or spend MP on the always-open long path.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Stone sluice, `#2a3438` wash, open/shut glyph.  
SOLVABILITY: Place only when a second spawn→portal route already exists. Never the only exit. Do not share a cell with another `blocksWalk` feature.  
COMBAT_RULES: Wall occupancy while shut. No damage. Flip at round start.  
COUNTERPLAY: Wait for even; take the long path; teleport past if metadata allows.

### WF-ZON-SECOND_WIND

WORLD_FEATURE_ID: WF-ZON-SECOND_WIND  
NAME: Second Wind  
MECHANIC: A copper inlay. The first unit to end a turn here this map recovers 1 AP already spent this turn (cannot exceed max AP), then the tile dries. Enemies can use it.  
PLAYER_DECISION: End movement here to cast more this turn, deny the enemy the tile, or ignore it.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Copper inlay, `#4a3018` wash, rising spark, dry stone after use.  
SOLVABILITY: Walkable. Optional. Never on spawn/portals.  
COMBAT_RULES: AP refund, not a spell and not a heal. Does not call `saveBattleStats` or `applyRewards`. Null Field does not strip it.  
COUNTERPLAY: Step on first; shove the enemy off; ignore when you still have AP.

### WF-TEL-SLIPSTREAM

WORLD_FEATURE_ID: WF-TEL-SLIPSTREAM  
NAME: Slipstream  
MECHANIC: One-way pair: cyan arrow A → B. Entering A for 1 MP exits at B. B does not return. If B is occupied, the travelers swap.  
PLAYER_DECISION: Spend 1 MP for a one-way skip, walk, or leave A as an enemy escape toward B.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: One-way cyan arrow pair, `#0e3a4a` wash, pulse from A toward B.  
SOLVABILITY: Both on floor, not on spawn/portals. The map is solvable without using them.  
COMBAT_RULES: 1 MP from the unit’s current MP. Not a teleport spell — do not key off `effectCategory`.  
COUNTERPLAY: Stand on B to block or force a swap; ignore the pair.

### WF-PRT-ECHO_GATE

WORLD_FEATURE_ID: WF-PRT-ECHO_GATE  
NAME: Echo Gate  
MECHANIC: An extra backward-notch portal. Entering returns you to the previous overworld map this session and pays a medium `applyRewards` grant. If there is no previous map, it behaves as a regular portal with no bonus. It is never the only exit.  
PLAYER_DECISION: Retreat to the last map for a medium purse, or take the stable forward portal.  
RELATIVE_DIFFICULTY: medium  
RARITY: epic (weight 3)  
VISUAL: Portal with backward notch, `#1a2a4a` wash, blue flicker.  
SOLVABILITY: Always in addition to a reachable stable portal. Forbidden in dungeon, boss rush, and Death Realm.  
COMBAT_RULES: Portal transition, not a combat action. Bonus via `applyRewards` on the persist lock. Death-realm guards still block entry.  
COUNTERPLAY: Ignore it. The stable exit always works.

### WF-INV-DUELIST_CIRCLE

WORLD_FEATURE_ID: WF-INV-DUELIST_CIRCLE  
NAME: Duelist Circle  
MECHANIC: Two same-tier elites (hard threat) circle a painted ring. Out of battle both lose 8% max HP on each enemy-wander interval. If one hits 0 they vanish. Touching either starts a normal battle at remaining HP. Victory pays hard if both still stood at contact, medium if one already vanished.  
PLAYER_DECISION: Wait for a wounded survivor, join early for two purses, or never enter the ring (exploration).  
RELATIVE_DIFFICULTY: hard  
RARITY: epic  
VISUAL: Painted ring, two pennants, `#4a1818` wash.  
SOLVABILITY: Ring is floor. Exit reachable without entering. Counts as 2 toward `MAX_ENEMIES`. In dungeon / boss rush they count as hostiles for map-clear.  
COMBAT_RULES: World attrition does not call `applyRewards`. Contact is a normal battle. Extra spells from `usableByEnemy` only. Victory → `applyRewards`.  
COUNTERPLAY: Stay off the ring in exploration; join when one is low; in a run, fight the survivor or both.

### WF-ELT-TOLL_KEEPER

WORLD_FEATURE_ID: WF-ELT-TOLL_KEEPER  
NAME: Toll Keeper  
MECHANIC: One elite (same-tier × hard) stands on a painted short-path cell. In exploration: touch to fight, or pay 10% max HP once adjacent to pass this map without combat. A long path bypasses them. In dungeon / boss rush the toll is disabled — they are a normal elite required for map-clear.  
PLAYER_DECISION: Fight for the hard purse, pay the toll, or walk the long way.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare  
VISUAL: Stationary elite with a toll staff, `#3a2010` wash, short-path paint.  
SOLVABILITY: Place only when a second spawn→portal route exists. Counts as 1 enemy.  
COMBAT_RULES: World contact starts a normal battle. Toll HP via challenge recorders. Extra spells from `usableByEnemy` only. Victory → `applyRewards`.  
COUNTERPLAY: Long path; pay the toll when wounded (exploration); fight when you want the purse.

### WF-TRS-SEALED_URN

WORLD_FEATURE_ID: WF-TRS-SEALED_URN  
NAME: Sealed Urn  
MECHANIC: A sealed urn. 1 AP adjacent opens it: 70% medium `applyRewards` grant, 30% 6% max-HP tax and no grant. No guardian.  
PLAYER_DECISION: Spend 1 AP on a biased coin, or walk past.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Sealed urn, `#3a2a18` wash, wax cord, gold trim.  
SOLVABILITY: Adjacent-open, not a wall. Optional.  
COMBAT_RULES: AP cost, not a spell. Credits via persist-lock `applyRewards`. Fail uses challenge HP. No `updateCharacter` Doka.  
COUNTERPLAY: Skip; open after fights when a 6% miss is cheap.

### WF-SPL-GRIMOIRE_STALKER

WORLD_FEATURE_ID: WF-SPL-GRIMOIRE_STALKER  
NAME: Grimoire Stalker  
MECHANIC: One same-tier enemy (medium threat) carries 1 extra `usableByEnemy` spell. On death the player may take that spell id as a **single remaining cast** this map — not a full-map attune.  
PLAYER_DECISION: Kill the stalker for a one-shot catalog spell, or ignore them.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Enemy with a hovering book, `#241a38` wash.  
SOLVABILITY: Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable.  
COMBAT_RULES: Metadata only (`usableByEnemy`, `targetType`, costs). One-cast does not call `upgradeSpell` and does not persist `spellLevel*` arrays.  
COUNTERPLAY: Kite and ignore, burst first, or save the cast for a key turn.

### WF-RSK-SCOURGE_COMPACT

WORLD_FEATURE_ID: WF-RSK-SCOURGE_COMPACT  
NAME: Scourge Compact  
MECHANIC: End a turn on the black inlay to flag this map: you take +10% of already-computed incoming hits (after RES/SR), and the next `applyRewards` uses the hard multiplier. One flag, this map only. Enemies do not gain the bonus.  
PLAYER_DECISION: Accept incoming tax for a fatter purse, or stay unflagged.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic  
VISUAL: Black inlay, `#1a1018` wash, slow crimson tick.  
SOLVABILITY: Optional floor tile. Map is solvable if never used.  
COMBAT_RULES: +10% scales the post-formula number — it does not replace `combatMath`. Multiplier on the next `applyRewards` enqueue only. Death still uses `saveBattleStats`.  
COUNTERPLAY: Skip unless you can kite or out-heal and expect a credit.

### WF-MOD-ECHO_HALL

WORLD_FEATURE_ID: WF-MOD-ECHO_HALL  
NAME: Echoing Halls  
MECHANIC: Spells with `linear === true` may continue one extra empty floor cell beyond the first target along the line. Non-linear spells unchanged.  
PLAYER_DECISION: Line up shots through empty cells, or hide with your back to a wall so you cannot be echoed.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Hanging stone teeth, `#2a2830` wash, faint echo lines.  
SOLVABILITY: No tile change. Melee and non-linear kits remain usable.  
COMBAT_RULES: Reads `SpellConfig.linear` / `maxRange` / `minRange` / `targetType` only. Extra cell must be empty floor. Attack Nearest and summons are not spells. No damage rewrite.  
COUNTERPLAY: Stand with a wall behind you; close to melee; ignore linear.

### WF-EVT-PILGRIM_BANNERS

WORLD_FEATURE_ID: WF-EVT-PILGRIM_BANNERS  
NAME: Pilgrim Banners  
MECHANIC: This map only: leave through a portal without starting any encounter and the portal `applyRewards` grant uses the medium multiplier. Start any fight and win, and victory uses the hard multiplier. Starting a fight locks the peaceful path.  
PLAYER_DECISION: Take a peaceful medium portal purse, or fight for a hard victory purse.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Hanging pilgrim cloths, `#2a2418` wash, gold thread.  
SOLVABILITY: No blocks. Leaving is always legal. Exploration only (run maps require a clear).  
COMBAT_RULES: Multipliers on persist-lock `applyRewards` only. `inBattleRef` locks the peaceful path.  
COUNTERPLAY: Leave immediately, or fight if you want the hard purse.

### WF-ENV-GUTTER_STEAM

WORLD_FEATURE_ID: WF-ENV-GUTTER_STEAM  
NAME: Gutter Steam  
MECHANIC: Two painted vent tiles. On even rounds they jet; occupying a jetting vent at end of turn costs 4% max HP. Odd rounds they are inert floor. A painted even/odd pip sits on each vent.  
PLAYER_DECISION: Cross vents on odd rounds, hold off them on even, or bait a foe onto a jetting vent.  
RELATIVE_DIFFICULTY: hard  
RARITY: uncommon  
VISUAL: Iron grate, `#2a2820` wash, steam plume on even, pip.  
SOLVABILITY: Vents never include the only portal or spawn. A floor path around the vents exists.  
COMBAT_RULES: End-of-turn tax when even. Challenge HP. 2 tiles toward the hazard cap. Wounded AI avoids vents on even rounds.  
COUNTERPLAY: Read the pip; stand off on even; shove a foe onto a jetting vent.

---

## Wave 3 (2026-09-02)

Third-wave seams so a long-lived character still meets new decisions after waves 1–2 have been seen many times. Same rarity weights and relative difficulty. Same overlay contract. Do not clone lava / ice / spikes, the live 22 modifiers, or wave-1 / wave-2 ids.

### WF-HAZ-NEEDLE_GRASS

WORLD_FEATURE_ID: WF-HAZ-NEEDLE_GRASS  
NAME: Needle Grass  
MECHANIC: Pale-green barbs. Walking through is free. Ending a turn on a needle tile costs 4% max HP. Walkable. Does not replace lava, ice, ember, or salt.  
PLAYER_DECISION: Cut through and keep moving, camp on the barbs and pay, or spend MP to end off the grass.  
RELATIVE_DIFFICULTY: medium (threat 1.0 — a camping tax, not a fight)  
RARITY: common (weight 40)  
VISUAL: Needle inlay, `#2a3a18` wash, barb glyph, tooltip “walk-through free; ending a turn here taxes % max HP”.  
SOLVABILITY: Floor only. Never on spawn±3 or portals. Never the only cell in a corridor (does not block).  
COMBAT_RULES: Challenge HP recorders. Wounded AI avoids ending a turn on grass like lava. Counts toward `MAX_HAZARD_TILES` (4–8 tiles).  
COUNTERPLAY: End on adjacent floor, teleport (ground/self metadata), or send a summon to hold the cell.

### WF-HAZ-ORBIT_CINDER

WORLD_FEATURE_ID: WF-HAZ-ORBIT_CINDER  
NAME: Orbiting Cinder  
MECHANIC: A cinder orb occupies one cell of a painted 4-tile square and steps one cell clockwise at each round start. Landing on a unit costs 5% max HP.  
PLAYER_DECISION: Stand in the hollow of the square, time a cross after it passes, or bait an enemy onto the next cell.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare (weight 8)  
VISUAL: Cinder glyph, `#5a2810` wash, clockwise chevrons on the square.  
SOLVABILITY: Square is floor. Never covers spawn/portal. A path around the square remains. Not a wall.  
COMBAT_RULES: Round-start 1-tile step. Challenge HP. No AP/MP spend, no skipped turns. 1 hazard budget.  
COUNTERPLAY: Stand off the square; end off the next clockwise cell; push/attract a foe onto that cell.

### WF-TRP-CHEVRON_PLATE

WORLD_FEATURE_ID: WF-TRP-CHEVRON_PLATE  
NAME: Chevron Plate  
MECHANIC: A visible rune plate with a painted chevron. Stepping onto it from the chevron’s facing is free. Any other approach costs 8% max HP once; the plate then becomes floor.  
PLAYER_DECISION: Approach from the marked side, spend MP to go around, or bait an enemy from the wrong side.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon (weight 20)  
VISUAL: Crimson plate, `#4a1818` wash, always-visible chevron.  
SOLVABILITY: Walkable before and after. Never hidden. Never on spawn/portals.  
COMBAT_RULES: One-shot step trigger from a non-facing side. Challenge HP. No name-based trap lookup.  
COUNTERPLAY: Enter from the chevron; send a summon from the unsafe side; shove a foe from a flank.

### WF-TER-FROST_PANE

WORLD_FEATURE_ID: WF-TER-FROST_PANE  
NAME: Frost Pane  
MECHANIC: Carved ice occupies a cell: units may walk through it, but it blocks LoS. Adjacent: 1 AP (no spell) smashes it to clear floor.  
PLAYER_DECISION: Spend 1 AP for LoS, hide behind the pane, or walk through and accept the blind.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Ice sheet, `#2a3a48` wash, crack chips on smash.  
SOLVABILITY: Does not block walk. Smash is optional. Never on spawn/portals.  
COMBAT_RULES: 1 AP occupancy action. No damage. Wall for LoS until smashed. Walk occupancy is floor.  
COUNTERPLAY: Walk through; smash when a linear shot is worth 1 AP; stand behind it against linear spells.

### WF-OBS-SPENT_BRIDGE

WORLD_FEATURE_ID: WF-OBS-SPENT_BRIDGE  
NAME: Spent Bridge  
MECHANIC: A short-path floor cell with three painted pips. Each time a unit leaves the cell, one pip burns. After three crossings the cell becomes a wall for the rest of the map.  
PLAYER_DECISION: Burn crossings on the short path now, save pips for a later retreat, or never use it and keep the long path.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Timber span, `#3a3020` wash, three pips that burn out.  
SOLVABILITY: Place only when a second spawn→portal route already exists. Evaluate solvability as if the bridge were already a wall. Never the only exit.  
COMBAT_RULES: Walkable until the third leave, then wall occupancy. No damage. Any unit’s leave spends a pip.  
COUNTERPLAY: Take the long path; spend the three crossings when tempo matters; teleport past if metadata allows.

### WF-ZON-RALLY_DRUM

WORLD_FEATURE_ID: WF-ZON-RALLY_DRUM  
NAME: Rally Drum  
MECHANIC: A bronze inlay. The first unit to end a turn here this map recovers 1 MP already spent this turn (cannot exceed max MP), then the tile dries. Enemies can use it.  
PLAYER_DECISION: End movement here to walk farther this turn, deny the enemy the tile, or ignore it.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Bronze drum, `#3a2810` wash, rising spark, dry stone after use.  
SOLVABILITY: Walkable. Optional. Never on spawn/portals.  
COMBAT_RULES: MP refund, not a spell and not a heal. Does not call `saveBattleStats` or `applyRewards`. Null Field does not strip it.  
COUNTERPLAY: Step on first; shove the enemy off; ignore when you still have MP.

### WF-TEL-TRIUNE_PADS

WORLD_FEATURE_ID: WF-TEL-TRIUNE_PADS  
NAME: Triune Pads  
MECHANIC: Three linked cyan pads painted 1→2→3→1. Entering a pad for 1 MP exits at the next clockwise pad. If occupied, the travelers swap.  
PLAYER_DECISION: Spend 1 MP to rotate positions, walk, or leave a pad as an enemy carousel.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Three numbered cyan pads, `#0e2a42` wash, clockwise pulse.  
SOLVABILITY: All three on floor, not on spawn/portals. The map is solvable without using them.  
COMBAT_RULES: 1 MP from the unit’s current MP. Not a teleport spell — do not key off `effectCategory`.  
COUNTERPLAY: Stand on the next clockwise pad to block or force a swap; ignore the trio.

### WF-PRT-LATCH_GATE

WORLD_FEATURE_ID: WF-PRT-LATCH_GATE  
NAME: Latch Gate  
MECHANIC: An extra sealed portal. Adjacent 1 AP arms it. Entering the armed gate rolls a random eligible overworld map and pays a hard `applyRewards` grant. Unarmed, it is not an exit. It is never the only portal.  
PLAYER_DECISION: Spend 1 AP to arm a bonus gamble exit, or take the stable portal you can already see.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic (weight 3)  
VISUAL: Sealed portal with latch glyph, `#2a1a38` wash, glyph flips open when armed.  
SOLVABILITY: Always in addition to a reachable stable portal. Forbidden in dungeon, boss rush, and Death Realm. Unarmed it does not count as an exit.  
COMBAT_RULES: Arm cost is AP. Entry is a portal transition. Bonus via `applyRewards` on the persist lock. Death-realm guards still block entry.  
COUNTERPLAY: Ignore it. The stable exit always works.

### WF-INV-SLEEPING_VANGUARD

WORLD_FEATURE_ID: WF-INV-SLEEPING_VANGUARD  
NAME: Sleeping Vanguard  
MECHANIC: Two extra same-tier elites (hard threat) lie on painted cots. They do not wander. Adjacent contact wakes them and starts a normal battle. Victory pays hard reward multiplier. Exploration: leave without waking. Dungeon / boss rush: they count as hostiles for map-clear.  
PLAYER_DECISION: Give the cots a wide berth, wake them for the hard purse, or (in a run) clear them because the portal will not open.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic  
VISUAL: Two cots, pennants at rest, `#2a2430` wash.  
SOLVABILITY: Cots are floor. Exit reachable without stepping adjacent. Counts as 2 toward `MAX_ENEMIES`.  
COMBAT_RULES: World contact starts a normal battle. Extra spells from `usableByEnemy` only. Victory → `applyRewards`.  
COUNTERPLAY: Stay off the cots in exploration; wake when you want the purse; in a run, fight them.

### WF-ELT-CART_GUARD

WORLD_FEATURE_ID: WF-ELT-CART_GUARD  
NAME: Cart Guard  
MECHANIC: One elite (same-tier × hard) escorts a painted cart one tile per wander along a 5–7 tile path toward a marked departure cell. Touch to fight (hard purse). In exploration, if the cart reaches departure both leave (no fight, no purse). In dungeon / boss rush they do not depart — required for map-clear.  
PLAYER_DECISION: Intercept before they leave, let them depart (exploration), or fight them as a required hostile in a run.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare  
VISUAL: Cart + escort pennant, `#3a2818` wash, departure marker.  
SOLVABILITY: Path is floor. Exit reachable without touching the elite. Counts as 1 enemy. Departure is never a portal and never spawn±3.  
COMBAT_RULES: World contact starts a normal battle. Extra spells from `usableByEnemy` only. Victory → `applyRewards`. Departure does not call `applyRewards`.  
COUNTERPLAY: Stand off the path; intercept far from departure; in exploration, let them go.

### WF-TRS-SPLIT_CACHE

WORLD_FEATURE_ID: WF-TRS-SPLIT_CACHE  
NAME: Split Cache  
MECHANIC: Two adjacent niches. 1 AP opens one and collapses the other. Left: soft `applyRewards`, no guardian. Right: hard `applyRewards`, 50% one same-tier guardian.  
PLAYER_DECISION: Take the sure small purse, gamble the hard niche, or walk past both.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Twin niches, `#3a2e10` wash, left slate / right gold trim.  
SOLVABILITY: Adjacent-open, not walls. If no guardian cell, the right niche pays the hard grant with no guardian.  
COMBAT_RULES: AP cost, not a spell. Credits via persist-lock `applyRewards`. Opening one destroys the other — no double grant.  
COUNTERPLAY: Skip both; pick left when wounded; pick right when you can handle a possible extra body.

### WF-SPL-LOANER_MAGE

WORLD_FEATURE_ID: WF-SPL-LOANER_MAGE  
NAME: Loaner Mage  
MECHANIC: One same-tier enemy (medium threat) carries 1 extra `usableByEnemy` spell. Adjacent 1 AP loans that spell id as a **single remaining cast** this map without killing them. Killing them grants the same one-cast if you have not already taken it (does not stack). They stay hostile after a loan.  
PLAYER_DECISION: Spend 1 AP to borrow a one-shot without the kill, kill them for the purse plus the same one-cast, or ignore them.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Enemy with an offered orb, `#1a2438` wash.  
SOLVABILITY: Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable.  
COMBAT_RULES: Metadata only (`usableByEnemy`, `targetType`, costs). Loan and kill-grant do not call `upgradeSpell` and do not persist `spellLevel*` arrays.  
COUNTERPLAY: Kite and ignore; borrow then leave; kill for the purse if you already hold the cast.

### WF-RSK-STILLNESS_OATH

WORLD_FEATURE_ID: WF-RSK-STILLNESS_OATH  
NAME: Stillness Oath  
MECHANIC: End a turn on the slate inlay to flag this map. While flagged, any player MP spend clears the flag. If the flag is still held at the next `applyRewards`, that credit uses the hard multiplier.  
PLAYER_DECISION: Wager that you can win or leave without walking, or stay unflagged and move freely.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic  
VISUAL: Slate inlay, `#1a1a24` wash, still-air glyph.  
SOLVABILITY: Optional floor tile. Map is solvable if never used.  
COMBAT_RULES: Flag is not a buff spell. Walk and 1 MP tiles clear it. Attack Nearest, AP spells, and summons do not. Multiplier on the next `applyRewards` enqueue only. Death still uses `saveBattleStats`.  
COUNTERPLAY: Skip unless enemies will come to you, a summon can walk, or a portal is already adjacent.

### WF-MOD-SHORT_FUSE

WORLD_FEATURE_ID: WF-MOD-SHORT_FUSE  
NAME: Short Fuse  
MECHANIC: Spells with `cooldown > 0` cannot be cast on round 1 (already expended). Zero-cooldown spells are unchanged. Uses `SpellConfig.cooldown` only — never the spell name.  
PLAYER_DECISION: Open with 0-cooldown spells or Attack Nearest, wait a round, or skip the fight.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Ember wick overlay, `#3a2018` wash, spent-fuse glyph on cooldown spells round 1.  
SOLVABILITY: No tile change. Melee, Attack Nearest, summons, and 0-cooldown kits remain usable.  
COMBAT_RULES: Reads `SpellConfig.cooldown` only. Attack Nearest and summons are not spells. No damage rewrite. Round 2+ uses the normal cooldown clock.  
COUNTERPLAY: Cast 0-cooldown; close to melee; wait one round; refuse the fight.

### WF-EVT-HARVEST_MOON

WORLD_FEATURE_ID: WF-EVT-HARVEST_MOON  
NAME: Harvest Moon  
MECHANIC: This map only: if the player’s current HP never dropped below 70% of max HP, the next `applyRewards` uses the hard multiplier. If it did, that credit is unchanged.  
PLAYER_DECISION: Play a clean fight or skip optional trades for a hard purse, or take damage and accept normal rewards.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Copper corona, `#3a1810` wash, harvest disc at the horizon.  
SOLVABILITY: No blocks. Leaving is always legal.  
COMBAT_RULES: HP checks after challenge recorders and combat. Multipliers on persist-lock `applyRewards` only. Does not rewrite `combatMath`. Death still uses `saveBattleStats`.  
COUNTERPLAY: Leave without fighting; kite and heal to hold 70%; ignore the corona.

### WF-ENV-ISOLATION_CHILL

WORLD_FEATURE_ID: WF-ENV-ISOLATION_CHILL  
NAME: Isolation Chill  
MECHANIC: At the end of each combatant turn, if no other living unit is within 3 Chebyshev tiles, they pay 3% max HP. A painted warm ring of radius 3 sits around every living body.  
PLAYER_DECISION: Clump to stay warm, summon a body to share the ring, or kite alone and pay.  
RELATIVE_DIFFICULTY: hard  
RARITY: uncommon  
VISUAL: Cold wash `#1a2838`, warm rings around bodies, frost at the rim.  
SOLVABILITY: Skip if the map would start with only one living unit so a warm pair cannot exist. Tax is not a wall.  
COMBAT_RULES: End-of-turn challenge HP. Summons count as living units. No skipped turns. No spell-damage change.  
COUNTERPLAY: End turns inside a ring; summon a front-liner; shove a foe to 3 tiles; pay to hold a kite.

---

## Wave 4 (2026-09-21)

Fourth-wave seams so a long-lived character still meets new decisions after waves 1–3 have been seen many times. Same rarity weights and relative difficulty. Same overlay contract. Do not clone lava / ice / spikes, the live 22 modifiers, or wave-1 / wave-2 / wave-3 ids.

### WF-HAZ-FLINT_DUST

WORLD_FEATURE_ID: WF-HAZ-FLINT_DUST  
NAME: Flint Dust  
MECHANIC: Pale flint tiles. Walking through and ending a turn are free. Spending AP (a spell or Attack Nearest) while occupying a flint tile costs 4% max HP. Walkable. Does not replace lava, ice, ember, salt, or needle grass.  
PLAYER_DECISION: Fight from clean floor, pay to hold a flint angle, or shove a caster onto the dust.  
RELATIVE_DIFFICULTY: medium (threat 1.0 — a casting tax, not a fight)  
RARITY: common (weight 40)  
VISUAL: Flint inlay, `#3a3428` wash, dust glyph, tooltip “walk free; spending AP here taxes % max HP”.  
SOLVABILITY: Floor only. Never on spawn±3 or portals. Never the only cell in a corridor (does not block).  
COMBAT_RULES: Challenge HP recorders. Trigger is AP spend while occupying, not a spell name. Wounded AI avoids casting from dust like lava. Counts toward `MAX_HAZARD_TILES` (4–8 tiles).  
COUNTERPLAY: Step off before spending AP, teleport (ground/self metadata), or send a summon to hold the cell.

### WF-HAZ-PENDULUM_CENSER

WORLD_FEATURE_ID: WF-HAZ-PENDULUM_CENSER  
NAME: Pendulum Censer  
MECHANIC: A censer occupies one cell of a painted 5-tile nave line and steps one cell along that line at each round start, reversing at the ends. Landing on a unit costs 5% max HP.  
PLAYER_DECISION: Stand off the nave, cross just after it passes, or bait an enemy onto the next cell.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare (weight 8)  
VISUAL: Censer glyph, `#3a2418` wash, reverse chevrons at both ends of the nave.  
SOLVABILITY: Line is floor. Never covers spawn/portal. A path around the nave remains. Not a wall.  
COMBAT_RULES: Round-start 1-tile step, then reverse at either end. Challenge HP. No AP/MP spend, no skipped turns. 1 hazard budget.  
COUNTERPLAY: Stand off the nave; end off the next cell; push/attract a foe onto that cell.

### WF-TRP-DELAY_GNOMON

WORLD_FEATURE_ID: WF-TRP-DELAY_GNOMON  
NAME: Delay Gnomon  
MECHANIC: A visible sundial. The first unit to step on it arms a 2-round fuse (no tax). Two round-starts later every unit on that cell pays 6% max HP once; the plate then becomes floor. If nobody steps, it never detonates.  
PLAYER_DECISION: Arm it as area denial and leave, bait a foe to stay two rounds, or never step on it.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon (weight 20)  
VISUAL: Sundial plate, `#3a2a18` wash, painted 2→1 pips after arming. Always visible.  
SOLVABILITY: Walkable before and after. Never hidden. Never on spawn/portals.  
COMBAT_RULES: Arm on first step. Detonate on the second following round start. Challenge HP. No name-based trap lookup.  
COUNTERPLAY: Never arm it; arm and leave before pip 0; send a summon to arm it; shove a foe onto the armed cell.

### WF-TER-REED_SCREEN

WORLD_FEATURE_ID: WF-TER-REED_SCREEN  
NAME: Reed Screen  
MECHANIC: A carved reed lattice blocks walk and occupancy but does not block LoS. Adjacent: 1 AP (no spell) cuts it to clear floor. Inverse of Frost Pane.  
PLAYER_DECISION: Spend 1 AP for the cell, leave it as a walk-block you can shoot through, or make the enemy cut it.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Reed lattice, `#2a3220` wash, cut chips on break.  
SOLVABILITY: Must not be a cut-vertex. Skip if `evaluateSolvability` would fail with it intact.  
COMBAT_RULES: 1 AP occupancy action. No damage. Wall for walk until cut. LoS treats it as empty floor.  
COUNTERPLAY: Ignore when a bypass exists; cut when the cell is worth 1 AP; shoot linear spells through it.

### WF-OBS-HOURGLASS_ARCH

WORLD_FEATURE_ID: WF-OBS-HOURGLASS_ARCH  
NAME: Hourglass Arch  
MECHANIC: A short-path floor cell with three painted sand pips. It starts walkable. After three round-starts the sand runs out and the cell becomes a wall for the rest of the map. Inverse of Fallen Gate.  
PLAYER_DECISION: Use the short path in the first three rounds, or never rely on it and keep the long path.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Stone arch, `#3a3024` wash, three sand pips that empty.  
SOLVABILITY: Place only when a second spawn→portal route already exists. Evaluate solvability as if the arch were already a wall. Never the only exit.  
COMBAT_RULES: Walkable until the third round start, then wall occupancy. No damage. Timer ticks at round start.  
COUNTERPLAY: Take the long path; cross during the first three rounds; teleport past if metadata allows.

### WF-ZON-VEIL_FONT

WORLD_FEATURE_ID: WF-ZON-VEIL_FONT  
NAME: Veil Font  
MECHANIC: A pale inlay. While a unit occupies it, spells with `linear === true` treat that cell as a LoS wall in both directions. Non-linear spells, Attack Nearest, and summons are unchanged. Lost on leaving. Either side may hold it.  
PLAYER_DECISION: Plant on the font to hide from linear shots (and give up linear yourself), yank the holder off, or ignore it.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Pale veil inlay, `#2a2a38` wash, hanging-cloth glyph.  
SOLVABILITY: Walkable. Optional. Never on spawn/portals. The veil is not a walk wall.  
COMBAT_RULES: Reads `SpellConfig.linear` / `lineOfSight` only. Not a buff spell (Null Field does not strip it). No damage rewrite.  
COUNTERPLAY: Occupy it against a linear kit; push the holder off; cast non-linear; fight where the font is irrelevant.

### WF-TEL-SWAP_ANCHOR

WORLD_FEATURE_ID: WF-TEL-SWAP_ANCHOR  
NAME: Swap Anchor  
MECHANIC: A single cyan anchor. Entering it for 1 MP swaps you with the nearest other living unit (Chebyshev; ties break by live initiative order). If no other living unit exists, the 1 MP is not spent.  
PLAYER_DECISION: Spend 1 MP to swap with the nearest body, walk, or leave the pad as an enemy yank.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Single cyan anchor, `#0e2a3a` wash, twin-arrow glyph.  
SOLVABILITY: Floor, not on spawn/portals. The map is solvable without using it. Swap stays on the walkable graph.  
COMBAT_RULES: 1 MP from the unit’s current MP only if a swap occurs. Occupancy swap. Not a teleport spell — do not key off `effectCategory`.  
COUNTERPLAY: Stand farther than the unit you do not want swapped; ignore the pad; yank a foe onto a hazard.

### WF-PRT-WAGER_GATE

WORLD_FEATURE_ID: WF-PRT-WAGER_GATE  
NAME: Wager Gate  
MECHANIC: An extra coin-rim portal. Entering while current HP is at least 50% of max HP rolls a random eligible overworld map and pays a hard `applyRewards` grant. Entering below 50% is a regular extra portal with no bonus. It is never the only exit.  
PLAYER_DECISION: Heal or hold HP to gamble the hard purse, take it wounded as a spare exit, or use the stable portal you can already see.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic (weight 3)  
VISUAL: Portal with coin rim, `#2a1a28` wash, gold flicker.  
SOLVABILITY: Always in addition to a reachable stable portal. Forbidden in dungeon, boss rush, and Death Realm. HP check is current/max — no level cutoff.  
COMBAT_RULES: Portal transition, not a combat action. Bonus via `applyRewards` on the persist lock only when the 50% check passes. Death-realm guards still block entry.  
COUNTERPLAY: Ignore it. The stable exit always works. Enter wounded for no bonus, or drink a shrine first.

### WF-INV-PHALANX_LINE

WORLD_FEATURE_ID: WF-INV-PHALANX_LINE  
NAME: Phalanx Line  
MECHANIC: Three extra same-tier elites (hard threat) stand in a painted 3-tile line. They do not wander. Touching any one starts a normal battle with all three at full HP. Victory pays hard reward multiplier. Exploration: leave without touching. Dungeon / boss rush: they count as hostiles for map-clear.  
PLAYER_DECISION: Give the line a wide berth, engage all three for the hard purse, or (in a run) clear them because the portal will not open.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic  
VISUAL: Three shields in a line, `#3a1818` wash, pennants upright.  
SOLVABILITY: Line is floor. Exit reachable without stepping adjacent. Counts as 3 toward `MAX_ENEMIES`. Skip if the roster cannot fit 3.  
COMBAT_RULES: World contact starts a normal battle. Extra spells from `usableByEnemy` only. Victory → `applyRewards`.  
COUNTERPLAY: Stay off the line in exploration; engage when you want the purse; in a run, fight them.

### WF-ELT-LEASH_WARDEN

WORLD_FEATURE_ID: WF-ELT-LEASH_WARDEN  
NAME: Leash Warden  
MECHANIC: One elite (same-tier × hard) wanders only inside a painted Chebyshev-3 leash around a post. Touch to fight (hard purse). Exploration: walk around the leash. Dungeon / boss rush: they count as a hostile for map-clear — you must enter the leash.  
PLAYER_DECISION: Circle the leash, step in when the warden is isolated, or (in a run) enter because the portal will not open.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare  
VISUAL: Post + leash ring, `#3a2018` wash, tether glyph.  
SOLVABILITY: Post and leash are floor. Exit reachable without entering the leash. Counts as 1 enemy. Post is never a portal and never spawn±3.  
COMBAT_RULES: World contact starts a normal battle. Extra spells from `usableByEnemy` only. Victory → `applyRewards`. The leash is not a wall.  
COUNTERPLAY: Stay off the leash in exploration; enter when isolated; in a run they cannot be skipped for clear.

### WF-TRS-PATIENCE_CACHE

WORLD_FEATURE_ID: WF-TRS-PATIENCE_CACHE  
NAME: Patience Cache  
MECHANIC: A visible chest with two sand pips. Adjacent 1 AP opens it now for a guaranteed soft `applyRewards` grant and no guardian. If left closed, after two round-starts (or two wander ticks out of battle) it auto-opens: 50% medium grant, 50% one same-tier guardian and no grant.  
PLAYER_DECISION: Take the sure small purse now, wait for a maybe-better auto-open, or walk past.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Chest with sand pips, `#3a2a14` wash, gold trim.  
SOLVABILITY: Adjacent-open, not a wall. If no guardian cell, a failed auto-open pays the medium grant with no guardian.  
COMBAT_RULES: AP cost, not a spell. Credits via persist-lock `applyRewards`. Manual open cancels the auto-open — no double grant.  
COUNTERPLAY: Skip; open now when wounded; wait when you can handle a possible extra body.

### WF-SPL-ECHO_SCRIBE

WORLD_FEATURE_ID: WF-SPL-ECHO_SCRIBE  
NAME: Echo Scribe  
MECHANIC: One same-tier enemy (medium threat) carries extra `usableByEnemy` spells. On death the player may take the last spell id that scribe actually cast this fight as a **single remaining cast** this map. If they never cast a spell (only Attack Nearest / movement), there is no grant.  
PLAYER_DECISION: Bait a cast then kill for that one-shot, burst them before they show a spell, or ignore them.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Enemy with a hovering quill, `#241828` wash.  
SOLVABILITY: Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable.  
COMBAT_RULES: Copied id is the last spell they cast, metadata only. Attack Nearest is not a spell and yields no grant. One-cast does not call `upgradeSpell` and does not persist `spellLevel*` arrays.  
COUNTERPLAY: Kite and ignore; burst before they cast; wait for a utility cast then take it.

### WF-RSK-SEEPING_TITHE

WORLD_FEATURE_ID: WF-RSK-SEEPING_TITHE  
NAME: Seeping Tithe  
MECHANIC: End a turn on the copper-black inlay to pay 8% max HP once and flag this map: at the start of each of your turns you pay 4% max HP. The next `applyRewards` uses the extreme multiplier. One flag, this map only. Enemies do not pay the tithe.  
PLAYER_DECISION: Accept a repeating HP tax for an extreme purse, or stay unflagged.  
RELATIVE_DIFFICULTY: extreme  
RARITY: epic  
VISUAL: Copper-black inlay, `#2a1410` wash, slow drip glyph.  
SOLVABILITY: Optional floor tile. Map is solvable if never used.  
COMBAT_RULES: HP via challenge recorders. Per-turn tax is at the start of player turns only. Multiplier on the next `applyRewards` enqueue only. Death still uses `saveBattleStats`.  
COUNTERPLAY: Skip unless the fight will be short, you can out-heal the drip, or a portal credit is already in reach.

### WF-MOD-HEAVY_INCANT

WORLD_FEATURE_ID: WF-MOD-HEAVY_INCANT  
NAME: Heavy Incant  
MECHANIC: Spells with `apCost >= 3` also spend 1 MP if the caster has at least 1 current MP. If they have 0 MP the spell still casts. Uses `SpellConfig.apCost` only — never the spell name.  
PLAYER_DECISION: Cast heavy spells and accept the MP tax, open with 1–2 AP spells, or close to melee / Attack Nearest.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Heavy-sigil overlay, `#2a1a28` wash, extra-MP pip on high-AP spells.  
SOLVABILITY: No tile change. Melee, Attack Nearest, summons, and 1–2 AP kits remain usable.  
COMBAT_RULES: Reads `SpellConfig.apCost` only. Attack Nearest and summons are not spells. No damage rewrite. 0 MP does not block the cast.  
COUNTERPLAY: Cast low-AP spells; Attack Nearest; spend MP first then accept a 0-MP heavy cast; refuse the fight.

### WF-EVT-IRON_LENT

WORLD_FEATURE_ID: WF-EVT-IRON_LENT  
NAME: Iron Lent  
MECHANIC: This map only: if the player’s current HP never increased (no shrine, potion, zone heal, or other HP gain), the next `applyRewards` uses the hard multiplier. Taking damage is allowed. If HP ever went up, that credit is unchanged.  
PLAYER_DECISION: Skip heals for a hard purse, or drink and accept normal rewards.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Iron corona, `#2a2420` wash, empty-cup glyph at the horizon.  
SOLVABILITY: No blocks. Leaving is always legal.  
COMBAT_RULES: HP-increase checks compare current HP to the previous value this map. Multipliers on persist-lock `applyRewards` only. Does not rewrite `combatMath`. Death still uses `saveBattleStats`.  
COUNTERPLAY: Leave without fighting; play the fight without drinking; ignore the overlay and heal.

### WF-ENV-STAGNANT_HAZE

WORLD_FEATURE_ID: WF-ENV-STAGNANT_HAZE  
NAME: Stagnant Haze  
MECHANIC: At the end of each combatant turn, if that unit spent 0 MP this turn, they pay 3% max HP. Spending any MP this turn clears the haze for that unit.  
PLAYER_DECISION: Spend 1 MP even to shuffle, plant and pay, or shove a planted foe.  
RELATIVE_DIFFICULTY: hard  
RARITY: uncommon  
VISUAL: Green-grey haze, `#243028` wash, clinging motes on planted units.  
SOLVABILITY: Tax is not a wall. Optional fights can be refused in exploration.  
COMBAT_RULES: End-of-turn challenge HP. Summons pay it. Attack Nearest and AP spells do not count as MP. No skipped turns. No spell-damage change.  
COUNTERPLAY: Spend 1 MP to an adjacent floor; summon a walker; pay to plant for a linear shot.

---

## Wave 5 (2026-09-22)

Fifth-wave seams so a long-lived character still meets new decisions after waves 1–4 have been seen many times. Same rarity weights and relative difficulty. Same overlay contract. Do not clone lava / ice / spikes, the live 22 modifiers, or wave-1 / wave-2 / wave-3 / wave-4 ids.

### WF-HAZ-GLASS_SHARD

WORLD_FEATURE_ID: WF-HAZ-GLASS_SHARD  
NAME: Glass Shard  
MECHANIC: Pale glass tiles. Voluntary walk-on and ending a turn are free. Occupying a shard because of forced movement (push, attract, wind slide, swap, or a teleport tile) costs 5% max HP. Walkable. Does not replace lava, ice, ember, salt, needle grass, or flint.  
PLAYER_DECISION: Stand on glass as cover, path so a shove cannot dump you onto it, or shove a foe onto a shard.  
RELATIVE_DIFFICULTY: medium (threat 1.0 — a dump tax, not a fight)  
RARITY: common (weight 40)  
VISUAL: Glass inlay, `#4a4850` wash, shard glyph, tooltip “walk free; forced occupancy taxes % max HP”.  
SOLVABILITY: Floor only. Never on spawn±3 or portals. Never the only cell in a corridor (does not block).  
COMBAT_RULES: Challenge HP recorders. Trigger is forced occupancy, not voluntary walk and not a spell-name check. Counts toward `MAX_HAZARD_TILES` (4–8 tiles).  
COUNTERPLAY: Walk onto shards yourself; end so the next forced cell is not glass; send a summon to occupy a dump cell.

### WF-HAZ-RATCHET_COG

WORLD_FEATURE_ID: WF-HAZ-RATCHET_COG  
NAME: Ratchet Cog  
MECHANIC: A cog occupies one of two painted adjacent floor cells and swaps to the other at each round start. Landing on a unit costs 5% max HP.  
PLAYER_DECISION: Stand off the pair, occupy the cell it just left, or bait an enemy onto the next cell.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare (weight 8)  
VISUAL: Cog glyph, `#3a3020` wash, two-cell pip that flips.  
SOLVABILITY: Pair is floor. Never covers spawn/portal. A path around the pair remains. Not a wall.  
COMBAT_RULES: Round-start swap. Challenge HP. No AP/MP spend, no skipped turns. 1 hazard budget.  
COUNTERPLAY: Stand off the pair; end on the cell it just left; push/attract a foe onto the next cell.

### WF-TRP-SECOND_FOOT

WORLD_FEATURE_ID: WF-TRP-SECOND_FOOT  
NAME: Second Foot  
MECHANIC: A visible print plate. The first unit to step on it leaves a painted print and takes no tax. The next occupancy of that cell this map pays 8% max HP once; the plate then becomes floor.  
PLAYER_DECISION: Spend the first print yourself so a foe pays the second, bait a second body onto it, or never step.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon (weight 20)  
VISUAL: Print plate, `#4a2018` wash, always-visible print after the first step.  
SOLVABILITY: Walkable before and after. Never hidden. Never on spawn/portals.  
COMBAT_RULES: First step arms (no tax). Second occupancy detonates once. Challenge HP. No name-based trap lookup.  
COUNTERPLAY: Never step; spend the first print then leave; send a summon for the second occupancy; shove a foe onto the print.

### WF-TER-SANDBAG

WORLD_FEATURE_ID: WF-TER-SANDBAG  
NAME: Sandbag  
MECHANIC: A sandbag blocks walk and occupancy but does not block LoS. Adjacent: 1 AP pushes it one cardinal into empty floor; 1 AP dumps it to clear floor. No damage. Distinct from Reed Screen (cut in place) and Cinder Barrel (roll tax).  
PLAYER_DECISION: Push it as moving cover, dump it for the cell, or leave it as a walk-block you can shoot through.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Sandbag, `#3a3428` wash, dump chips.  
SOLVABILITY: Must not be a cut-vertex. Skip if `evaluateSolvability` would fail with it intact. Push stays on the walkable graph.  
COMBAT_RULES: 1 AP occupancy actions. No damage. Wall for walk until dumped. LoS treats it as empty floor.  
COUNTERPLAY: Ignore when a bypass exists; dump when the cell is worth 1 AP; push it to plug a lane; shoot linear spells through it.

### WF-OBS-SHIFT_SLAB

WORLD_FEATURE_ID: WF-OBS-SHIFT_SLAB  
NAME: Shift Slab  
MECHANIC: Two painted adjacent short-path cells. Exactly one is a wall and the other is floor. They swap at each round start. A painted pip shows which cell is open.  
PLAYER_DECISION: Cross on the currently open slab, wait one round for the other lane, or spend MP on the always-open long path.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Twin slabs, `#2a3238` wash, open/shut pip.  
SOLVABILITY: Place only when spawn→portal remains with cell A walled AND with cell B walled. Never the only exit. Never both open or both shut.  
COMBAT_RULES: Wall occupancy on the shut cell. No damage. Swap ticks at round start.  
COUNTERPLAY: Wait one round; take the long path; teleport past if metadata allows.

### WF-ZON-KEEN_EDGE

WORLD_FEATURE_ID: WF-ZON-KEEN_EDGE  
NAME: Keen Edge  
MECHANIC: A bronze grindstone. While a unit occupies it, Attack Nearest deals +15% of the already-computed hit (after RES/SR). Spells and summons are unchanged. Lost on leaving. Either side may hold it.  
PLAYER_DECISION: Plant for a harder basic attack, yank the holder off, or ignore it and cast spells.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Bronze grindstone, `#3a2810` wash, edge glyph.  
SOLVABILITY: Walkable. Optional. Never on spawn/portals. Not a walk wall.  
COMBAT_RULES: Bonus applies only to Attack Nearest (not a spell). The +15% scales the post-formula number — it does not replace `combatMath`. Null Field does not strip it.  
COUNTERPLAY: Occupy it; push the holder off; fight with spells; ignore it.

### WF-TEL-RECALL_PIN

WORLD_FEATURE_ID: WF-TEL-RECALL_PIN  
NAME: Recall Pin  
MECHANIC: A single cyan pin-stone. Adjacent 1 AP plants your recall mark on your current cell (one pin per side). Later, entering the stone for 1 MP exits at your pin. If occupied, the travelers swap. Entering with no pin spends nothing.  
PLAYER_DECISION: Spend 1 AP to mark a cell worth returning to, 1 MP later to recall, walk, or leave the stone as an enemy recall.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Cyan pin-stone, `#0e2438` wash, painted pin on the marked cell.  
SOLVABILITY: Floor, not on spawn/portals. The map is solvable without using it. Recall stays on the walkable graph.  
COMBAT_RULES: Plant is 1 AP, recall is 1 MP only if a pin exists. Occupancy swap. Not a teleport spell — do not key off `effectCategory`.  
COUNTERPLAY: Stand on an enemy pin to force a swap; ignore the stone; plant next to a portal or hazard.

### WF-PRT-PACT_GATE

WORLD_FEATURE_ID: WF-PRT-PACT_GATE  
NAME: Pact Gate  
MECHANIC: An extra pact-rim portal. Entering while a living allied summon is within 2 Chebyshev rolls a random eligible overworld map and pays a hard `applyRewards` grant. Entering without that summon is a spare exit with no bonus. It is never the only exit.  
PLAYER_DECISION: Bring a summon into range for the hard gamble, take it as a spare exit, or use the stable portal you can already see.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic (weight 3)  
VISUAL: Portal with pact rim, `#1a2430` wash, teal flicker.  
SOLVABILITY: Always in addition to a reachable stable portal. Forbidden in dungeon, boss rush, and Death Realm. No summon is required to leave.  
COMBAT_RULES: Portal transition, not a combat action. Bonus via `applyRewards` on the persist lock only when a living allied summon is within 2 Chebyshev. Death-realm guards still block entry.  
COUNTERPLAY: Ignore it. The stable exit always works. Enter without a summon for no bonus, or summon then step in.

### WF-INV-MIRROR_HOST

WORLD_FEATURE_ID: WF-INV-MIRROR_HOST  
NAME: Mirror Host  
MECHANIC: One extra same-tier elite (hard threat) stands on a painted tether. Out of battle, whenever the player pays HP, the host loses the same percent of its max HP. Touch starts a normal battle at remaining HP. Victory pays hard if the host was above 50% at contact, medium if already wounded. Exploration: leave. Dungeon / boss rush: they count as a hostile for map-clear.  
PLAYER_DECISION: Fight it healthy, tax yourself first to weaken the tether, or never touch it (exploration).  
RELATIVE_DIFFICULTY: hard  
RARITY: epic  
VISUAL: Tethered elite, `#2a1a28` wash, mirrored HP pip.  
SOLVABILITY: Tether is floor. Exit reachable without touching. Counts as 1 toward `MAX_ENEMIES`.  
COMBAT_RULES: World attrition does not call `applyRewards`. Contact is a normal battle. Extra spells from `usableByEnemy` only. Victory → `applyRewards`.  
COUNTERPLAY: Stay off the tether in exploration; step on a hazard first to wound it; in a run, fight it.

### WF-ELT-DRIFT_SENTINEL

WORLD_FEATURE_ID: WF-ELT-DRIFT_SENTINEL  
NAME: Drift Sentinel  
MECHANIC: One elite (same-tier × hard) wanders only on odd rounds along a 4–6 tile loop (painted odd pip). On even rounds it stands still. Touch to fight (hard purse). Exploration: skip. Dungeon / boss rush: required for map-clear.  
PLAYER_DECISION: Intercept on even rounds while it stands, cross the loop on odd while it moves, or never touch them.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare  
VISUAL: Loop + odd pip, `#2a2820` wash, sentinel pennant.  
SOLVABILITY: Loop is floor. Exit reachable without crossing. Counts as 1 enemy.  
COMBAT_RULES: World contact starts a normal battle. Extra spells from `usableByEnemy` only. Victory → `applyRewards`. Odd/even is round index, not a skipped turn.  
COUNTERPLAY: Stand off the loop; fight when planted on even; in exploration, leave.

### WF-TRS-BLOOD_LOCK

WORLD_FEATURE_ID: WF-TRS-BLOOD_LOCK  
NAME: Blood Lock  
MECHANIC: A sealed chest with a crimson lock. 1 AP adjacent plus 5% max HP opens it: a hard `applyRewards` grant, no guardian, no coin-flip.  
PLAYER_DECISION: Pay AP and HP for a sure hard purse, or walk past.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Crimson-lock chest, `#3a1418` wash, gold trim.  
SOLVABILITY: Adjacent-open, not a wall. Optional.  
COMBAT_RULES: AP plus challenge HP, not a spell. Credits via persist-lock `applyRewards`. No guardian. No `updateCharacter` Doka.  
COUNTERPLAY: Skip; open when 5% is cheap and you expect the credit.

### WF-SPL-OATH_CANTOR

WORLD_FEATURE_ID: WF-SPL-OATH_CANTOR  
NAME: Oath Cantor  
MECHANIC: One same-tier enemy (medium threat) carries 1 extra `usableByEnemy` spell. Adjacent 1 AP binds that spell id as a cast you may use this map only while the cantor is still alive. Killing them ends the bind. They stay hostile. Inverse of Loaner Mage.  
PLAYER_DECISION: Borrow a spell you must keep them alive to use, kill them for the purse and lose the bind, or ignore them.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Enemy with a bound ribbon, `#1a2030` wash.  
SOLVABILITY: Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable.  
COMBAT_RULES: Metadata only (`usableByEnemy`, `targetType`, costs). Bind does not call `upgradeSpell` and does not persist `spellLevel*` arrays.  
COUNTERPLAY: Kite and ignore; bind then leave them alive; kill for the purse if you do not need the spell.

### WF-RSK-OPEN_VEIN

WORLD_FEATURE_ID: WF-RSK-OPEN_VEIN  
NAME: Open Vein  
MECHANIC: End a turn on the crimson inlay to pay 10% max HP once and flag this map: if you start at least one encounter, the next `applyRewards` uses the hard multiplier. If you leave without fighting, the tax is a sunk cost. Inverse of Pilgrim Banners.  
PLAYER_DECISION: Pay HP only if you intend to fight, or stay unflagged.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic  
VISUAL: Crimson inlay, `#2a1014` wash, open-vein glyph.  
SOLVABILITY: Optional floor tile. Map is solvable if never used.  
COMBAT_RULES: HP via challenge recorders. Multiplier on the next `applyRewards` enqueue only if a fight started. Death still uses `saveBattleStats`.  
COUNTERPLAY: Skip unless you already plan a fight. In a run the clear still counts as starting encounters.

### WF-MOD-THIN_AIR

WORLD_FEATURE_ID: WF-MOD-THIN_AIR  
NAME: Thin Air  
MECHANIC: Spells with `apCost === 1` cost 2 AP this map. Spells with `apCost` 0 or 2+ are unchanged. Uses `SpellConfig.apCost` only — never the spell name. Distinct from Heavy Incant (which taxes AP≥3 with MP).  
PLAYER_DECISION: Open with 2+ AP spells or Attack Nearest, pay 2 AP for cheap spells, or skip the fight.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Thin-air overlay, `#1a2830` wash, extra-AP pip on 1-AP spells.  
SOLVABILITY: No tile change. Melee, Attack Nearest, summons, and 2+ AP kits remain usable.  
COMBAT_RULES: Reads `SpellConfig.apCost` only. Attack Nearest and summons are not spells. No damage rewrite.  
COUNTERPLAY: Cast 2+ AP spells; Attack Nearest; wait for AP; refuse the fight.

### WF-EVT-FIRST_BLOOD

WORLD_FEATURE_ID: WF-EVT-FIRST_BLOOD  
NAME: First Blood  
MECHANIC: This map only: if the first HP debit is suffered by an enemy, the next `applyRewards` uses the hard multiplier. If the player or a player-side summon takes the first debit, that credit is unchanged.  
PLAYER_DECISION: Strike or dump a foe onto a hazard first for a hard purse, or accept normal rewards if you take the first hit.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Crimson first-strike overlay, `#3a1818` wash, first-blood disc.  
SOLVABILITY: No blocks. Leaving is always legal.  
COMBAT_RULES: First debit is the first challenge/combat HP loss this map. Player-side summons count as player-side. Multipliers on persist-lock `applyRewards` only. Does not rewrite `combatMath`. Death still uses `saveBattleStats`.  
COUNTERPLAY: Leave without anyone taking HP; shove a foe onto a tax first; ignore the overlay.

### WF-ENV-CROWD_PRESS

WORLD_FEATURE_ID: WF-ENV-CROWD_PRESS  
NAME: Crowd Press  
MECHANIC: At the end of each combatant turn, if two or more other living units are within 2 Chebyshev tiles, they pay 3% max HP. Inverse of Isolation Chill.  
PLAYER_DECISION: Kite alone to stay unpressed, clump and pay, or shove a pair onto each other.  
RELATIVE_DIFFICULTY: hard  
RARITY: uncommon  
VISUAL: Press wash `#2a2028`, rings of radius 2 around bodies.  
SOLVABILITY: Skip if the map would start with fewer than 3 living units so a press trio cannot exist. Tax is not a wall.  
COMBAT_RULES: End-of-turn challenge HP. Summons count as living units. No skipped turns. No spell-damage change.  
COUNTERPLAY: End turns with at most one other body in the ring; kite; pay to hold a clump.

---

## Wave 6 (2026-09-23)

Sixth-wave seams so a long-lived character still meets new decisions after waves 1–5 have been seen many times. Same rarity weights and relative difficulty. Same overlay contract. Do not clone lava / ice / spikes, the live 22 modifiers, or wave-1 through wave-5 ids.

### WF-HAZ-SOOT_LIP

WORLD_FEATURE_ID: WF-HAZ-SOOT_LIP  
NAME: Soot Lip  
MECHANIC: Charcoal lip tiles. Walking through and ending a turn are free. Starting a turn while occupying a soot tile costs 4% max HP. Walkable. Does not replace lava, ice, ember, salt, needle grass, flint, or glass. Inverse of Needle Grass.  
PLAYER_DECISION: Cut through and leave before your next start, camp on the lip and pay, or shove a foe onto it before their turn.  
RELATIVE_DIFFICULTY: medium (threat 1.0 — a start-of-turn tax, not a fight)  
RARITY: common (weight 40)  
VISUAL: Soot inlay, `#2a2420` wash, lip glyph, tooltip “walk-through free; starting a turn here taxes % max HP”.  
SOLVABILITY: Floor only. Never on spawn±3 or portals. Never the only cell in a corridor (does not block).  
COMBAT_RULES: Challenge HP recorders. Trigger is start-of-turn occupancy, not a spell name. Wounded AI avoids starting a turn on soot like lava. Counts toward `MAX_HAZARD_TILES` (4–8 tiles).  
COUNTERPLAY: Leave before your next turn starts, teleport (ground/self metadata), or send a summon to hold the cell.

### WF-HAZ-TWIN_SPARK

WORLD_FEATURE_ID: WF-HAZ-TWIN_SPARK  
NAME: Twin Sparks  
MECHANIC: Two spark orbs occupy opposite cells of a painted 4-tile line and swap places at each round start. Landing on a unit costs 5% max HP.  
PLAYER_DECISION: Stand in the two empty line cells, time a cross after they swap, or bait an enemy onto a spark's next cell.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare (weight 8)  
VISUAL: Twin spark glyphs, `#4a2010` wash, swap chevrons on the line.  
SOLVABILITY: Line is floor. Never covers spawn/portal. A path around the line remains. Not a wall.  
COMBAT_RULES: Round-start swap, not a 1-tile step. Challenge HP. No AP/MP spend, no skipped turns. 2 hazard budget.  
COUNTERPLAY: Stand on the empty cells; end off both landing cells; push/attract a foe onto a landing cell.

### WF-TRP-LEAVE_BELL

WORLD_FEATURE_ID: WF-TRP-LEAVE_BELL  
NAME: Leave Bell  
MECHANIC: A visible bronze bell. Stepping onto it is free. The first unit to leave the cell pays 7% max HP once; the plate then becomes floor. Inverse of Glyph Plate.  
PLAYER_DECISION: Step on and stay, send a summon to spend the leave, bait an enemy to walk off, or never step on it.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon (weight 20)  
VISUAL: Bronze bell plate, `#3a2a14` wash, always visible.  
SOLVABILITY: Walkable before and after. Never hidden. Never on spawn/portals.  
COMBAT_RULES: One-shot leave trigger. Challenge HP. No name-based trap lookup.  
COUNTERPLAY: Never arm it; stay on it; send a summon to spend the leave; shove a foe off it.

### WF-TER-PYRE_STACK

WORLD_FEATURE_ID: WF-TER-PYRE_STACK  
NAME: Pyre Stack  
MECHANIC: A timber pyre blocks walk and LoS. Adjacent 1 AP (no spell) lights it: the cell becomes floor immediately, and at the next round start anyone on that cell or adjacent pays 5% max HP once.  
PLAYER_DECISION: Spend 1 AP to open the cell and accept the blast, leave it as cover, or make the enemy light it.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Timber pyre, `#3a2210` wash, flame on light, blast ring.  
SOLVABILITY: Must not be a cut-vertex. Skip if `evaluateSolvability` would fail with it intact.  
COMBAT_RULES: 1 AP occupancy action. Blast tax via challenge HP. Wall LoS until lit.  
COUNTERPLAY: Ignore when a bypass exists; light when the cell is worth 1 AP and you can step off before the blast; hide from linear spells.

### WF-OBS-MERCY_PORT

WORLD_FEATURE_ID: WF-OBS-MERCY_PORT  
NAME: Mercy Port  
MECHANIC: A short-path corridor cell starts as a wall. After the first round start it becomes floor for one round, then walls off for the rest of the map. A painted shut→open→shut glyph sits on the tile.  
PLAYER_DECISION: Wait for the one-round window, miss it and keep the long path, or teleport past if metadata allows.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Stone port, `#2a2830` wash, shut→open→shut glyph.  
SOLVABILITY: Place only when a second spawn→portal route already exists. Evaluate solvability as if the port were already a wall. Never the only exit.  
COMBAT_RULES: Wall occupancy except during the single open round. No damage. Glyph flips at round start.  
COUNTERPLAY: Take the long path; cross during the open round; teleport past if metadata allows.

### WF-ZON-IRON_PULSE

WORLD_FEATURE_ID: WF-ZON-IRON_PULSE  
NAME: Iron Pulse  
MECHANIC: An iron inlay. While a unit occupies it, incoming already-computed hits against that unit are reduced by 15% (after existing RES/SR). Lost on leaving. Either side may hold it. Distinct from Ward Circle (RES).  
PLAYER_DECISION: Plant on the pulse against incoming hits, yank the holder off, or ignore it.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Iron inlay, `#2a2a28` wash, pulse glyph.  
SOLVABILITY: Walkable. Optional. Never on spawn/portals. The pulse is not a walk wall.  
COMBAT_RULES: −15% scales the post-formula number — it does not replace `combatMath`. Not a buff spell (Null Field does not strip it).  
COUNTERPLAY: Occupy it; push the holder off; fight from range so the pulse is irrelevant.

### WF-TEL-CARDINAL_KICK

WORLD_FEATURE_ID: WF-TEL-CARDINAL_KICK  
NAME: Cardinal Kick  
MECHANIC: A single cyan boot. Entering it for 1 MP kicks you two tiles in your current facing if both cells are empty floor. If either cell is blocked, the 1 MP is not spent. Distinct from Crosswind (forced slide after a paid move).  
PLAYER_DECISION: Face a two-tile gap and spend 1 MP to skip, walk, or leave the boot as an enemy launch.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Cyan boot, `#0e2a3a` wash, facing chevron.  
SOLVABILITY: Floor, not on spawn/portals. The map is solvable without using it. Kick stays on the walkable graph.  
COMBAT_RULES: 1 MP from the unit’s current MP only if both destination cells are empty floor. No swap. Not a teleport spell — do not key off `effectCategory`.  
COUNTERPLAY: Stand in the two-tile lane to deny the kick; ignore the boot; face a gap to break melee.

### WF-PRT-TWILIGHT_GATE

WORLD_FEATURE_ID: WF-PRT-TWILIGHT_GATE  
NAME: Twilight Gate  
MECHANIC: An extra dusk-rim portal. Entering on an even round rolls a random eligible overworld map and pays a hard `applyRewards` grant. Entering on an odd round is a regular extra portal with no bonus. It is never the only exit.  
PLAYER_DECISION: Wait for an even round to gamble the hard purse, take it on odd as a spare exit, or use the stable portal you can already see.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic (weight 3)  
VISUAL: Portal with dusk rim, `#1a1428` wash, even/odd pip.  
SOLVABILITY: Always in addition to a reachable stable portal. Forbidden in dungeon, boss rush, and Death Realm. Even/odd is round index — no level cutoff.  
COMBAT_RULES: Portal transition, not a combat action. Bonus via `applyRewards` on the persist lock only on even rounds. Death-realm guards still block entry.  
COUNTERPLAY: Ignore it. The stable exit always works. Enter on odd for no bonus, or wait one round for even.

### WF-INV-SPLIT_BANNER

WORLD_FEATURE_ID: WF-INV-SPLIT_BANNER  
NAME: Split Banner  
MECHANIC: Two extra same-tier elites (hard threat) stand on opposite painted posts. They do not wander. Touching one starts a normal battle with only that elite. Victory pays hard per elite fought. Exploration: fight one, both, or neither. Dungeon / boss rush: both count as hostiles for map-clear. Distinct from Phalanx Line (all three at once).  
PLAYER_DECISION: Pick one post, clear both for two purses, or (in exploration) leave without touching either.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic  
VISUAL: Two distant pennants, `#3a1814` wash.  
SOLVABILITY: Posts are floor. Exit reachable without touching either. Counts as 2 toward `MAX_ENEMIES`. Skip if the roster cannot fit 2.  
COMBAT_RULES: World contact starts a normal battle with the touched elite only. Extra spells from `usableByEnemy` only. Victory → `applyRewards`.  
COUNTERPLAY: Stay off both posts in exploration; fight one when you want a single purse; in a run, both are required for clear.

### WF-ELT-STILL_WATCH

WORLD_FEATURE_ID: WF-ELT-STILL_WATCH  
NAME: Still Watch  
MECHANIC: One elite (same-tier × hard) stands still with a painted 3-tile facing cone. Entering the cone or touching the elite starts combat. Kill pays hard reward multiplier. Exploration: walk around the cone. Dungeon / boss rush: they count as a hostile for map-clear.  
PLAYER_DECISION: Circle the cone, step in when you want the purse, or (in a run) enter because the portal will not open.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare  
VISUAL: Stationary elite + cone, `#2a2418` wash, facing chevron.  
SOLVABILITY: Post and cone are floor. Exit reachable without entering the cone. Counts as 1 enemy. Post is never a portal and never spawn±3.  
COMBAT_RULES: World contact (tile or cone) starts a normal battle. Extra spells from `usableByEnemy` only. Victory → `applyRewards`. The cone is not a wall.  
COUNTERPLAY: Stay off the cone in exploration; enter when you want the purse; in a run they cannot be skipped for clear.

### WF-TRS-TRIP_CACHE

WORLD_FEATURE_ID: WF-TRS-TRIP_CACHE  
NAME: Trip Cache  
MECHANIC: A visible chest. 1 AP adjacent opens it: if you spent 0 MP this turn, a medium `applyRewards` grant and no guardian; if you spent any MP this turn, a 5% max-HP tax and no grant. Distinct from Stillness Oath (map-long flag).  
PLAYER_DECISION: Open it before walking this turn for a medium purse, or walk past.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Trip chest, `#3a2a10` wash, still-foot glyph, gold trim.  
SOLVABILITY: Adjacent-open, not a wall. Optional.  
COMBAT_RULES: AP cost, not a spell. Credits via persist-lock `applyRewards`. Fail uses challenge HP. No `updateCharacter` Doka.  
COUNTERPLAY: Skip; open at the start of a turn before spending MP.

### WF-SPL-HUSH_BEARER

WORLD_FEATURE_ID: WF-SPL-HUSH_BEARER  
NAME: Hush Bearer  
MECHANIC: One same-tier enemy (medium threat) carries 1 extra `usableByEnemy` spell. On death the player may hush that spell id: no enemy on this map may cast it for the rest of the map. Inverse of Rune Bearer (deny vs attune).  
PLAYER_DECISION: Kill the bearer to silence that catalog spell this map, or ignore them.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Enemy with a muted orb, `#1a1a28` wash.  
SOLVABILITY: Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable.  
COMBAT_RULES: Metadata only (`usableByEnemy`, `targetType`, costs). Hush does not call `upgradeSpell` and does not persist `spellLevel*` arrays. Attack Nearest is not a spell and is never hushed.  
COUNTERPLAY: Kite and ignore; burst them first to deny a dangerous extra; leave the extra in the kit.

### WF-RSK-LAST_STAND

WORLD_FEATURE_ID: WF-RSK-LAST_STAND  
NAME: Last Stand  
MECHANIC: End a turn on the cracked inlay to flag this map. If the next `applyRewards` happens while current HP is at or below 30% of max HP, that credit uses the extreme multiplier. If HP is above 30% at credit time, the flag is spent with no bonus. Inverse of Harvest Moon.  
PLAYER_DECISION: Cash out wounded for an extreme purse, heal first and waste the flag, or stay unflagged.  
RELATIVE_DIFFICULTY: extreme  
RARITY: epic  
VISUAL: Cracked inlay, `#2a1010` wash, last-stand glyph.  
SOLVABILITY: Optional floor tile. Map is solvable if never used.  
COMBAT_RULES: HP check uses current/max at `applyRewards` enqueue. Multiplier on the next `applyRewards` enqueue only. Death still uses `saveBattleStats`.  
COUNTERPLAY: Skip unless you can survive at ≤30% HP through the next credit.

### WF-MOD-TIGHT_GRIP

WORLD_FEATURE_ID: WF-MOD-TIGHT_GRIP  
NAME: Tight Grip  
MECHANIC: Spells with `mpCost === 0` cost 1 MP this map. Spells with `mpCost` greater than 0 are unchanged. Uses `SpellConfig.mpCost` only — never the spell name. Distinct from Thin Air (AP 1→2) and Heavy Incant (AP≥3 extra MP).  
PLAYER_DECISION: Open with spells that already cost MP, pay 1 MP for free spells, Attack Nearest, or skip the fight.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Tight-grip overlay, `#1a2430` wash, extra-MP pip on 0-MP spells.  
SOLVABILITY: No tile change. Melee, Attack Nearest, summons, and already-paid-MP kits remain usable.  
COMBAT_RULES: Reads `SpellConfig.mpCost` only. Attack Nearest and summons are not spells. No damage rewrite. 0 current MP blocks a formerly-free spell until the caster has 1 MP.  
COUNTERPLAY: Cast paid-MP spells; Attack Nearest; wait for 1 MP; refuse the fight.

### WF-EVT-SWIFT_MARCH

WORLD_FEATURE_ID: WF-EVT-SWIFT_MARCH  
NAME: Swift March  
MECHANIC: This map only: if the player wins a fight that never reached round 2, the next `applyRewards` uses the hard multiplier. If any fight this map reaches round 2 or later, that credit is unchanged. Leaving without fighting does not grant the bonus.  
PLAYER_DECISION: Alpha-strike a round-1 win for a hard purse, or accept a longer fight and normal rewards.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Swift corona, `#2a2018` wash, marching disc.  
SOLVABILITY: No blocks. Leaving is always legal.  
COMBAT_RULES: Round index is the combat round clock. Multipliers on persist-lock `applyRewards` only. Does not rewrite `combatMath`. Death still uses `saveBattleStats`.  
COUNTERPLAY: Leave without fighting; burst in round 1; ignore the overlay and take a longer fight.

### WF-ENV-EXPOSED_LINE

WORLD_FEATURE_ID: WF-ENV-EXPOSED_LINE  
NAME: Exposed Line  
MECHANIC: At the end of each combatant turn, if they have unblocked linear line of sight to two or more other living units, they pay 3% max HP. Distinct from Ash Rain (wall adjacency) and Crowd Press (Chebyshev clump).  
PLAYER_DECISION: Break LoS behind a wall, isolate so you see at most one body, or hold an open angle and pay.  
RELATIVE_DIFFICULTY: hard  
RARITY: uncommon  
VISUAL: Exposed wash `#2a1a20`, sight ticks on bodies that see two others.  
SOLVABILITY: Skip if the generated map has no LoS-blocking wall so shelter cannot exist. Tax is not a wall.  
COMBAT_RULES: End-of-turn challenge HP. LoS uses the existing linear occupancy check. Summons count as living units. No skipped turns. No spell-damage change.  
COUNTERPLAY: End turns behind a wall; isolate to one visible body; summon a blocker; pay to hold an open shot.

---

## Wave 7 (2026-09-24)

Seventh-wave seams so a long-lived character still meets new decisions after waves 1–6 have been seen many times. Same rarity weights and relative difficulty. Same overlay contract. Do not clone lava / ice / spikes, the live 22 modifiers, or wave-1 through wave-6 ids. This file **unions** still-open PR #344 (wave 4), PR #399 (wave 5), and PR #454 (wave 6) rather than overwriting those catalogs.

### WF-HAZ-RIME_HEEL

WORLD_FEATURE_ID: WF-HAZ-RIME_HEEL  
NAME: Rime Heel  
MECHANIC: Pale rime tiles. Walking through is free. Ending a turn on rime after spending any AP this turn is free. Ending a turn on rime after spending 0 AP this turn costs 4% max HP. Walkable. Does not replace ice, ember, salt, needle, flint, glass, or soot.  
PLAYER_DECISION: Act from the rime (spend AP and stay), cut through and keep moving, or spend MP to end off the frost.  
RELATIVE_DIFFICULTY: medium (threat 1.0 — an idle-camp tax, not a fight)  
RARITY: common (weight 40)  
VISUAL: Rime inlay, `#2a3a44` wash, heel glyph, tooltip “idle end-turn here taxes % max HP; spending AP this turn is safe”.  
SOLVABILITY: Floor only. Never on spawn±3 or portals. Never the only cell in a corridor (does not block).  
COMBAT_RULES: Challenge HP recorders. Attack Nearest and spells both count as AP spends. Wounded AI treats an idle end-turn on rime like lava. Counts toward `MAX_HAZARD_TILES` (4–8 tiles).  
COUNTERPLAY: Spend AP before ending on rime; end on adjacent floor; teleport (ground/self metadata); send a summon to idle there.

### WF-HAZ-WINDROW

WORLD_FEATURE_ID: WF-HAZ-WINDROW  
NAME: Windrow  
MECHANIC: A 2-tile ember bar occupies one painted pair of adjacent floor cells and hops to the parallel adjacent pair at each round start (a 2-cycle in-out). Landing on a unit costs 5% max HP.  
PLAYER_DECISION: Stand in the hollow between the two pairs, time a cross after it hops away, or bait an enemy onto the next pair.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare (weight 8)  
VISUAL: Windrow glyph, `#4a2810` wash, in-out chevrons on both pairs.  
SOLVABILITY: Both pairs are floor. Never covers spawn/portal. A path around both pairs remains. Not a wall.  
COMBAT_RULES: Round-start hop. Challenge HP. No AP/MP spend, no skipped turns. 2 hazard budget. Distinct from Tide Spikes (along-lane) and Twin Sparks (swap on a line).  
COUNTERPLAY: Stand off both pairs; end off the next pair; push/attract a foe onto that pair.

### WF-TRP-IDLE_PIN

WORLD_FEATURE_ID: WF-TRP-IDLE_PIN  
NAME: Idle Pin  
MECHANIC: A visible bronze pin. Stepping onto it is free. The first unit to end a turn on it after spending 0 MP this turn pays 8% max HP once; the plate then becomes floor. Inverse of Leave Bell (leaving). Distinct from Needle Grass (always taxes end-turn).  
PLAYER_DECISION: Step through without stopping, spend MP before ending on it, or bait an enemy to idle there.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon (weight 20)  
VISUAL: Bronze pin, `#3a2a18` wash, always visible.  
SOLVABILITY: Walkable before and after. Never hidden. Never on spawn/portals.  
COMBAT_RULES: One-shot end-of-turn trigger with 0 MP spent this turn. Challenge HP. No name-based trap lookup.  
COUNTERPLAY: Spend MP before ending on it; walk through; send a summon to idle; shove a foe onto it and wait.

### WF-TER-WATTLE_HURDLE

WORLD_FEATURE_ID: WF-TER-WATTLE_HURDLE  
NAME: Wattle Hurdle  
MECHANIC: A woven hurdle blocks walk and occupancy but does not block LoS. Adjacent: 1 AP vaults you to the opposite cell if that cell is empty floor; 2 AP cuts it to clear floor. No damage.  
PLAYER_DECISION: Spend 1 AP to vault the shortcut, spend 2 AP to open the cell for everyone, or leave it as a gate.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Wattle hurdle, `#3a3420` wash, vault chevron.  
SOLVABILITY: Must not be a cut-vertex. Skip if `evaluateSolvability` would fail with it intact. Vault dest must be empty floor or the 1 AP is not spent.  
COMBAT_RULES: AP occupancy actions, not spells. Vault is a 1-tile skip through the hurdle — do not key off `effectCategory`. Occupancy wall until cut. LoS is open.  
COUNTERPLAY: Take the long path; vault when the far cell is empty; cut when everyone needs the cell.

### WF-OBS-LATCH_SILL

WORLD_FEATURE_ID: WF-OBS-LATCH_SILL  
NAME: Latch Sill  
MECHANIC: A short-path corridor cell starts as a wall with a painted latch. The first unit to end a turn on an adjacent cell opens it to floor for the rest of the map. A long path always exists.  
PLAYER_DECISION: Camp adjacent one turn to unlatch the short path, spend MP on the long way now, or leave it shut.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Stone sill, `#2a2824` wash, latch glyph that flips open.  
SOLVABILITY: Place only when a second spawn→portal route already exists. Evaluate solvability with the sill as a wall. Never the only exit. Do not share a cell with another `blocksWalk` feature.  
COMBAT_RULES: Wall occupancy until the first adjacent end-turn. Then floor. No damage. Distinct from Mercy Port (timed window) and Fallen Gate (opens on a clock).  
COUNTERPLAY: Take the long path; unlatch with a summon; teleport past if metadata allows.

### WF-ZON-LONG_ARM

WORLD_FEATURE_ID: WF-ZON-LONG_ARM  
NAME: Long Arm  
MECHANIC: A brass inlay. While a unit occupies it, spells with `linear === false` gain +1 `maxRange` (`minRange` unchanged). Linear spells, Attack Nearest, and summons are unchanged. Lost on leaving. Either side may hold it.  
PLAYER_DECISION: Plant for extra non-linear reach, deny the enemy the tile, or ignore it.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Brass inlay, `#3a3018` wash, long-arm glyph.  
SOLVABILITY: Walkable. One cell. Does not seal a path.  
COMBAT_RULES: Reads `SpellConfig.linear` / `maxRange` / `minRange` only. Standing-zone modifier, not a buff spell (Null Field does not strip it). Attack Nearest and summons are not spells. No damage rewrite.  
COUNTERPLAY: Occupy; push the holder off; cast linear; close to melee.

### WF-TEL-FILE_SLIDE

WORLD_FEATURE_ID: WF-TEL-FILE_SLIDE  
NAME: File Slide  
MECHANIC: A cyan file inlay with a painted cardinal. Entering it for 1 MP slides you along that file to the farthest empty floor cell before a wall or occupied cell. If that dest is your current cell, the 1 MP is not spent.  
PLAYER_DECISION: Spend 1 MP for a long file skip, walk, or leave the inlay as an enemy escape down the file.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Cyan file, `#0e2a3a` wash, cardinal chevron.  
SOLVABILITY: Inlay on floor, not on spawn/portals. Dest stays on the walkable graph. The map is solvable without using it.  
COMBAT_RULES: 1 MP from the unit’s current MP. Dest must be empty floor (no swap). Not a teleport spell — do not key off `effectCategory`. Distinct from Cardinal Kick (fixed 2-tile facing hop).  
COUNTERPLAY: Stand on the dest to block the slide; ignore the inlay; use it to break melee down the file.

### WF-PRT-ASH_GATE

WORLD_FEATURE_ID: WF-PRT-ASH_GATE  
NAME: Ash Gate  
MECHANIC: An extra ash-rim portal. Entering after this map has started at least one encounter rolls a random eligible overworld map and pays a hard `applyRewards` grant. Entering without having fought is a regular extra portal with no bonus. It is never the only exit.  
PLAYER_DECISION: Fight first then gamble the ash exit for a hard purse, or take the stable portal without fighting.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic (weight 3)  
VISUAL: Ash-rim portal, `#3a2418` wash, ember flicker.  
SOLVABILITY: Always in addition to a reachable stable portal. Forbidden in dungeon, boss rush, and Death Realm. Distinct from Pilgrim Banners (peace bonus vs fight-on-this-exit bonus).  
COMBAT_RULES: Portal transition, not a combat action. Bonus via `applyRewards` on the persist lock. Death-realm guards still block entry. `inBattleRef` ever-true this map arms the bonus.  
COUNTERPLAY: Ignore it. The stable exit always works.

### WF-INV-QUIET_CAMP

WORLD_FEATURE_ID: WF-INV-QUIET_CAMP  
NAME: Quiet Camp  
MECHANIC: Three extra same-tier elites (hard threat) sit around a painted fire. They do not wander. Ending a turn within Chebyshev 2 of any of them, or touching one, starts a normal battle with all three. Victory pays hard reward multiplier. Exploration: path around the ring. Dungeon / boss rush: they count as hostiles for map-clear.  
PLAYER_DECISION: Give the fire a 2-tile berth, step in for the hard purse, or (in a run) enter because the portal will not open.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic  
VISUAL: Three elites at a fire, `#2a2018` wash, painted Chebyshev-2 ring.  
SOLVABILITY: Fire ring is floor. Exit reachable without entering Chebyshev 2. Counts as 3 toward `MAX_ENEMIES`. Skip if the roster cannot fit 3.  
COMBAT_RULES: World contact or Chebyshev-2 end-turn starts a normal battle. Extra spells from `usableByEnemy` only. Victory → `applyRewards`. Distinct from Sleeping Vanguard (adjacent only, two cots).  
COUNTERPLAY: Stay outside the ring in exploration; enter when you want the purse; in a run, fight them.

### WF-ELT-EVEN_PICKET

WORLD_FEATURE_ID: WF-ELT-EVEN_PICKET  
NAME: Even Picket  
MECHANIC: One elite (same-tier × hard) stands on a painted post on even rounds and is off the board on odd rounds (the post is empty floor). Touching the elite while present starts combat. Kill pays hard reward multiplier. Exploration: cross the post on odd. Dungeon / boss rush they still appear on even rounds and are required for map-clear.  
PLAYER_DECISION: Wait for even to fight, cross the empty post on odd (exploration), or (in a run) wait for even because they are required.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare  
VISUAL: Post + even pip, `#2a2420` wash, empty on odd.  
SOLVABILITY: Post is floor. Exit reachable without touching the elite. Counts as 1 enemy. Absent on odd is not a wall. Distinct from Drift Sentinel (stays on-board and loops on odd).  
COMBAT_RULES: World contact while present starts a normal battle. Extra spells from `usableByEnemy` only. Victory → `applyRewards`. Odd-round absence is not a kill.  
COUNTERPLAY: Cross on odd in exploration; wait for even to fight; in a run, engage on even.

### WF-TRS-WATCH_CACHE

WORLD_FEATURE_ID: WF-TRS-WATCH_CACHE  
NAME: Watch Cache  
MECHANIC: A visible chest. 1 AP adjacent opens it only if no hostile is within 3 Chebyshev tiles: medium `applyRewards` grant, no guardian. If a hostile is that close, 5% max-HP tax and the chest stays (can retry).  
PLAYER_DECISION: Clear nearby hostiles then open, spend the tax and retry later, or walk past.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Watch chest, `#3a2e14` wash, painted 3-tile quiet ring.  
SOLVABILITY: Adjacent-open, not a wall. Optional.  
COMBAT_RULES: AP cost, not a spell. Success credits via persist-lock `applyRewards`. Fail uses challenge HP and does not consume the chest. Distinct from Trip Cache (0-MP gate) and Blood Lock (HP gate).  
COUNTERPLAY: Skip; open after nearby hostiles are dead or far; accept the tax and retry.

### WF-SPL-PAGE_THIEF

WORLD_FEATURE_ID: WF-SPL-PAGE_THIEF  
NAME: Page Thief  
MECHANIC: One same-tier enemy (medium threat) carries 1 extra `usableByEnemy` spell. Adjacent 1 AP steals that spell id as a **single remaining cast** this map and they lose it (they can no longer cast it). Killing them without stealing grants the same one-cast. Does not stack.  
PLAYER_DECISION: Spend 1 AP to disarm them and borrow a one-shot, kill them for the purse plus the same one-cast, or ignore them.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Enemy with a stolen page, `#1a2030` wash.  
SOLVABILITY: Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable.  
COMBAT_RULES: Metadata only (`usableByEnemy`, `targetType`, costs). Steal and kill-grant do not call `upgradeSpell` and do not persist `spellLevel*` arrays. Distinct from Loaner Mage (they keep the spell after a loan).  
COUNTERPLAY: Kite and ignore; steal then leave; kill for the purse if you already hold the cast.

### WF-RSK-SOLO_OATH

WORLD_FEATURE_ID: WF-RSK-SOLO_OATH  
NAME: Solo Oath  
MECHANIC: End a turn on the slate-gold inlay to flag this map. If the next `applyRewards` happens with zero living player-side summons, that credit uses the hard multiplier. If any allied summon is alive at credit, the flag does nothing.  
PLAYER_DECISION: Wager that you can win or leave without a living summon, or stay unflagged and summon freely.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic  
VISUAL: Slate-gold inlay, `#1a1a20` wash, solo glyph.  
SOLVABILITY: Optional floor tile. Map is solvable if never used.  
COMBAT_RULES: Flag is not a buff spell. Checks living player-side summons at the next `applyRewards` enqueue only. Enemy summons do not break it. Death still uses `saveBattleStats`.  
COUNTERPLAY: Skip unless you will not summon, or dismiss/expire summons before the credit.

### WF-MOD-LONG_SHADOW

WORLD_FEATURE_ID: WF-MOD-LONG_SHADOW  
NAME: Long Shadow  
MECHANIC: This map only: spells with `linear === false` gain +1 `maxRange`. Linear spells unchanged. Uses `SpellConfig.linear` / `maxRange` only — never the spell name. Inverse of Low Ceiling.  
PLAYER_DECISION: Lean into non-linear spells at extra reach, hide so enemies get the same bonus, or ignore ranged options.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Long-shadow overlay, `#1a1a24` wash, extra-range pip on non-linear spells.  
SOLVABILITY: No tile change. Melee and linear kits remain usable.  
COMBAT_RULES: Reads `SpellConfig.linear` / `maxRange` / `minRange`. Attack Nearest and summons are not spells. No damage rewrite. Distinct from Echoing Halls (linear extra empty cell) and Long Arm (standing-zone only).  
COUNTERPLAY: Cast linear; close to melee; stand behind a wall; refuse the fight.

### WF-EVT-STEEL_HOUR

WORLD_FEATURE_ID: WF-EVT-STEEL_HOUR  
NAME: Steel Hour  
MECHANIC: This map only: if the player never casts a spell whose `SpellConfig.apCost` is at least 1, the next `applyRewards` uses the hard multiplier. Casting any such spell locks normal rewards. Attack Nearest, 0-AP spells, summons, and walking do not lock it.  
PLAYER_DECISION: Win or leave on Attack Nearest / summons / 0-AP spells for a hard purse, or spend AP on a spell and take normal rewards.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Steel corona, `#2a2420` wash, bare-hand disc.  
SOLVABILITY: No blocks. Leaving is always legal.  
COMBAT_RULES: Reads `SpellConfig.apCost` only. Attack Nearest and summons are not spells. Multipliers on persist-lock `applyRewards` only. Does not rewrite `combatMath`. Distinct from Swift March (round-1 win) and Stillness Oath (no MP).  
COUNTERPLAY: Leave without fighting; Attack Nearest and summons; ignore the overlay and cast paid-AP spells.

### WF-ENV-CRAMPED_STONE

WORLD_FEATURE_ID: WF-ENV-CRAMPED_STONE  
NAME: Cramped Stone  
MECHANIC: At the end of each combatant turn, if they are adjacent to a wall, they pay 3% max HP. Open cells (not wall-adjacent) show a shelter hatch. Inverse of Ash Rain.  
PLAYER_DECISION: Hold the open center, hug walls and pay, or shove foes onto a wall.  
RELATIVE_DIFFICULTY: hard  
RARITY: uncommon  
VISUAL: Cramped wash `#2a2824`, hatch marks on open-center cells.  
SOLVABILITY: Skip on maps with no non-wall-adjacent floor (all corridors) so open-center shelter exists.  
COMBAT_RULES: End-of-turn challenge HP. Summons pay it. No skipped turns. No spell-damage change. Distinct from Ash Rain (taxes the open center).  
COUNTERPLAY: End turns on hatched open cells, or pay to hold a wall angle.

---

## Wave 8 (2026-09-25)

Eighth-wave seams so a long-lived character still meets new decisions after waves 1–7 have been seen many times. Same rarity weights and relative difficulty. Same overlay contract. Do not clone lava / ice / spikes, the live 22 modifiers, or wave-1 through wave-7 ids. This file **unions** still-open PR #344 (wave 4), PR #399 (wave 5), PR #454 (wave 6), and PR #503 (wave 7) rather than overwriting those catalogs.

### WF-HAZ-BOG_SILT

WORLD_FEATURE_ID: WF-HAZ-BOG_SILT  
NAME: Bog Silt  
MECHANIC: Pale silt tiles. Walking onto and ending a turn are free. Spending MP while occupying a silt tile (the first step of a walk from that cell, or a 1 MP tile) costs 4% max HP. Walkable. Inverse of Flint Dust (AP). Does not replace lava, ice, ember, salt, needle, flint, glass, soot, or rime.  
PLAYER_DECISION: Stand and spend AP from the silt, cut around it, or pay to walk off the bog.  
RELATIVE_DIFFICULTY: medium (threat 1.0 — a launch tax, not a fight)  
RARITY: common (weight 40)  
VISUAL: Silt inlay, `#2a3428` wash, bog glyph, tooltip “spending MP while here taxes % max HP”.  
SOLVABILITY: Floor only. Never on spawn±3 or portals. Never the only cell in a corridor (does not block).  
COMBAT_RULES: Challenge HP recorders. Teleport tiles and Attack Nearest do not count as MP spends. Wounded AI treats walking off silt like lava. Counts toward `MAX_HAZARD_TILES` (4–8 tiles).  
COUNTERPLAY: End on silt and spend AP, walk around, teleport (ground/self metadata), or send a summon to spend the MP tax.

### WF-HAZ-TURNSTILE_EMBER

WORLD_FEATURE_ID: WF-HAZ-TURNSTILE_EMBER  
NAME: Turnstile Ember  
MECHANIC: A cinder occupies one arm of a painted 4-tile plus and rotates 90° clockwise onto the next arm at each round start. Landing on a unit costs 5% max HP.  
PLAYER_DECISION: Stand in the hollow of the plus, time a cross after it leaves an arm, or bait an enemy onto the next arm.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare (weight 8)  
VISUAL: Turnstile glyph, `#5a2010` wash, clockwise chevrons on the plus.  
SOLVABILITY: Plus is floor. Never covers spawn/portal. A path around the plus remains. Not a wall.  
COMBAT_RULES: Round-start 1-tile rotate. Challenge HP. No AP/MP spend, no skipped turns. 1 hazard budget. Distinct from Orbiting Cinder (square) and Pendulum Censer (line reverse).  
COUNTERPLAY: Stand off the plus; end off the next clockwise arm; push/attract a foe onto that arm.

### WF-TRP-WEARY_PLATE

WORLD_FEATURE_ID: WF-TRP-WEARY_PLATE  
NAME: Weary Plate  
MECHANIC: A visible bronze plate. Stepping onto it is free. The first unit to end a turn on it after spending 2 or more AP this turn pays 8% max HP once; the plate then becomes floor. Inverse of Idle Pin (0 MP). Distinct from Rime Heel (0 AP idle is the hazard).  
PLAYER_DECISION: End a spend-heavy turn off the plate, camp after a 0–1 AP turn, or bait an enemy who just spent.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon (weight 20)  
VISUAL: Bronze plate, `#3a2418` wash, weary glyph, always visible.  
SOLVABILITY: Walkable before and after. Never hidden. Never on spawn/portals.  
COMBAT_RULES: End-of-turn occupancy after 2+ AP, once. Challenge HP. Attack Nearest counts as AP. No name-based trap lookup.  
COUNTERPLAY: End a 2+ AP turn on adjacent floor; walk through without stopping; send a summon; shove a foe onto it after they act.

### WF-TER-MASON_CRATE

WORLD_FEATURE_ID: WF-TER-MASON_CRATE  
NAME: Mason Crate  
MECHANIC: A stone crate blocks walk, occupancy, and LoS. Adjacent: 1 AP slides it one cardinal into empty floor (no damage); 2 AP smashes it to clear floor. Distinct from Cinder Barrel (roll damages) and Sandbag (does not block LoS).  
PLAYER_DECISION: Slide it as cover, smash it for the cell, or leave it as a LoS wall.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Stone crate, `#3a3830` wash, mason glyph, chips on smash.  
SOLVABILITY: Must not be a cut-vertex. Skip if `evaluateSolvability` would fail with it intact.  
COMBAT_RULES: AP occupancy actions, not spells. No HP tax. Wall LoS until smashed or slid away.  
COUNTERPLAY: Ignore when a bypass exists; smash when the cell is worth 2 AP; slide to steal cover or open a line.

### WF-OBS-COIN_SILL

WORLD_FEATURE_ID: WF-OBS-COIN_SILL  
NAME: Coin Sill  
MECHANIC: A short-path corridor cell starts as a wall with a painted coin latch. Adjacent 1 AP opens it to floor for the rest of the map. A long path always exists. Distinct from Latch Sill (free adjacent end-turn) and Fallen Gate (opens on a clock).  
PLAYER_DECISION: Spend 1 AP to buy the short path, spend MP on the long way, or leave it shut.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Coin latch, `#2a2820` wash, gold pip.  
SOLVABILITY: Place only when a second spawn→portal route already exists. Evaluate solvability with the sill as a wall. Never the only exit.  
COMBAT_RULES: Wall occupancy until the first adjacent 1 AP. Then floor. No damage. Any side may unlatch.  
COUNTERPLAY: Take the long path; pay 1 AP; unlatch with a summon; teleport past if metadata allows.

### WF-ZON-TRUE_STRIKE

WORLD_FEATURE_ID: WF-ZON-TRUE_STRIKE  
NAME: True Strike  
MECHANIC: A steel inlay. While a unit occupies it, spells with `linear === true` deal +15% of the already-computed hit (after existing RES/SR). Non-linear spells, Attack Nearest, and leaving lose it. Either side may hold it. Distinct from Keen Edge (Attack Nearest) and Eclipse Hour (map-wide melee).  
PLAYER_DECISION: Plant for linear shots, deny the enemy the tile, or ignore it.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Steel inlay, `#2a2a30` wash, true-strike glyph.  
SOLVABILITY: Walkable. One cell. Does not seal a path.  
COMBAT_RULES: Reads `SpellConfig.linear` only. Scales the post-formula number — it does not replace `combatMath`. Standing-zone modifier, not a buff spell (Null Field does not strip it).  
COUNTERPLAY: Occupy; push the holder off; fight at non-linear range; ignore it.

### WF-TEL-BACKSTEP

WORLD_FEATURE_ID: WF-TEL-BACKSTEP  
NAME: Backstep  
MECHANIC: A single cyan heel inlay. Entering it for 1 MP steps you one tile opposite your current facing if that cell is empty floor. If the dest is blocked or occupied, the 1 MP is not spent. Distinct from Cardinal Kick (two tiles forward) and File Slide (full file).  
PLAYER_DECISION: Spend 1 MP to disengage backward, walk, or leave the heel as an enemy retreat.  
RELATIVE_DIFFICULTY: soft  
RARITY: uncommon  
VISUAL: Cyan heel, `#0e2a38` wash, reverse chevron.  
SOLVABILITY: Inlay on floor, not on spawn/portals. Dest stays on the walkable graph. The map is solvable without using it.  
COMBAT_RULES: 1 MP from the unit’s current MP. Dest must be empty floor (no swap). Not a teleport spell — do not key off `effectCategory`.  
COUNTERPLAY: Stand on the dest to block the step; ignore the inlay; use it to break melee.

### WF-PRT-HEARTH_GATE

WORLD_FEATURE_ID: WF-PRT-HEARTH_GATE  
NAME: Hearth Gate  
MECHANIC: An extra hearth-rim portal. Entering while current HP is at 100% of max HP rolls a random eligible overworld map and pays a hard `applyRewards` grant. Entering wounded is a regular extra portal with no bonus. It is never the only exit. Distinct from Wager Gate (≥50% HP) and Ash Gate (requires a fight).  
PLAYER_DECISION: Keep full HP and gamble the hearth, or take the stable portal after trading.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic (weight 3)  
VISUAL: Hearth-rim portal, `#3a1810` wash, full-HP glow.  
SOLVABILITY: Always in addition to a reachable stable portal. Forbidden in dungeon, boss rush, and Death Realm.  
COMBAT_RULES: Portal transition, not a combat action. Bonus via `applyRewards` on the persist lock. Death-realm guards still block entry. HP check is current/max after challenge recorders.  
COUNTERPLAY: Ignore it. The stable exit always works. Enter wounded for no bonus, or skip fights to keep the hearth armed.

### WF-INV-HORN_RELAY

WORLD_FEATURE_ID: WF-INV-HORN_RELAY  
NAME: Horn Relay  
MECHANIC: One extra same-tier elite (hard threat) stands on a painted horn. They do not wander. If still untouched after two wander ticks, a second same-tier body arrives on an adjacent floor cell (skip if at `MAX_ENEMIES`). Touching the horn or either body starts a normal battle with whoever is present. Victory pays hard if two stood at contact, medium if only one. Exploration: leave before the second arrives. Dungeon / boss rush: they count as hostiles for map-clear.  
PLAYER_DECISION: Fight the single elite now, wait and maybe face two for a harder purse, or never touch the horn (exploration).  
RELATIVE_DIFFICULTY: hard  
RARITY: epic  
VISUAL: Horn post, `#4a1810` wash, second-body pip after two ticks.  
SOLVABILITY: Horn is floor. Exit reachable without touching. Counts as 1 toward `MAX_ENEMIES` at start, 2 if the relay fires. Distinct from Cart Guard (they leave) and Duelist Circle (they weaken).  
COMBAT_RULES: World contact starts a normal battle. Extra spells from `usableByEnemy` only. Victory → `applyRewards`.  
COUNTERPLAY: Leave in exploration before the second arrives; fight early for one body; in a run, fight whoever is present.

### WF-ELT-ODD_PICKET

WORLD_FEATURE_ID: WF-ELT-ODD_PICKET  
NAME: Odd Picket  
MECHANIC: One elite (same-tier × hard) stands on a painted post on odd rounds and is off the board on even rounds (the post is empty floor). Touching the elite while present starts combat. Kill pays hard reward multiplier. Exploration: cross the post on even. Dungeon / boss rush they still appear on odd rounds and are required for map-clear. Inverse of Even Picket.  
PLAYER_DECISION: Wait for odd to fight, cross the empty post on even (exploration), or (in a run) wait for odd because they are required.  
RELATIVE_DIFFICULTY: hard  
RARITY: rare  
VISUAL: Post + odd pip, `#242028` wash, empty on even.  
SOLVABILITY: Post is floor. Exit reachable without touching the elite. Counts as 1 enemy. Absent on even is not a wall. Distinct from Even Picket (present on even) and Drift Sentinel (stays on-board).  
COMBAT_RULES: World contact while present starts a normal battle. Extra spells from `usableByEnemy` only. Victory → `applyRewards`. Even-round absence is not a kill.  
COUNTERPLAY: Cross on even in exploration; wait for odd to fight; in a run, engage on odd.

### WF-TRS-WOUND_CACHE

WORLD_FEATURE_ID: WF-TRS-WOUND_CACHE  
NAME: Wound Cache  
MECHANIC: A visible chest with a cracked lock. 1 AP adjacent opens it only if current HP is below 50% of max: medium `applyRewards` grant, no guardian. If you are at or above 50%, 5% max-HP tax and the chest stays (can retry). Distinct from Blood Lock (pay HP to open) and Watch Cache (isolation gate).  
PLAYER_DECISION: Open while wounded, take a fight or tax to dip below 50%, or walk past.  
RELATIVE_DIFFICULTY: medium  
RARITY: uncommon  
VISUAL: Cracked chest, `#3a1818` wash, wound lock.  
SOLVABILITY: Adjacent-open, not a wall. Optional.  
COMBAT_RULES: AP cost, not a spell. Success credits via persist-lock `applyRewards`. Fail uses challenge HP and does not consume the chest.  
COUNTERPLAY: Skip; open after you are already wounded; accept the tax and retry below 50%.

### WF-SPL-VOW_KEEPER

WORLD_FEATURE_ID: WF-SPL-VOW_KEEPER  
NAME: Vow Keeper  
MECHANIC: One same-tier enemy (medium threat) carries 1 extra `usableByEnemy` spell. Adjacent 1 AP silences that spell id for this map — they lose it and you do not gain it. Killing them without silencing grants that spell as a **single remaining cast** this map. Does not stack. Distinct from Page Thief (you steal the cast) and Hush Bearer (hush on death only).  
PLAYER_DECISION: Spend 1 AP to disarm them without taking the spell, kill them for the purse plus a one-cast, or ignore them.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Enemy with a sealed orb, `#1a1828` wash.  
SOLVABILITY: Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable.  
COMBAT_RULES: Metadata only (`usableByEnemy`, `targetType`, costs). Silence and kill-grant do not call `upgradeSpell` and do not persist `spellLevel*` arrays.  
COUNTERPLAY: Kite and ignore; silence then leave; kill for the purse and the one-cast.

### WF-RSK-BOND_OATH

WORLD_FEATURE_ID: WF-RSK-BOND_OATH  
NAME: Bond Oath  
MECHANIC: End a turn on the bronze-slate inlay to flag this map. If the next `applyRewards` happens with at least one living player-side summon, that credit uses the hard multiplier. If no allied summon is alive at credit, the flag does nothing. Inverse of Solo Oath.  
PLAYER_DECISION: Wager that you can keep a summon alive until credit, or stay unflagged and fight alone.  
RELATIVE_DIFFICULTY: hard  
RARITY: epic  
VISUAL: Bronze-slate inlay, `#1a1810` wash, bond glyph.  
SOLVABILITY: Optional floor tile. Map is solvable if never used.  
COMBAT_RULES: Flag is not a buff spell. Checks living player-side summons at the next `applyRewards` enqueue only. Enemy summons do not count. Death still uses `saveBattleStats`.  
COUNTERPLAY: Skip unless you will summon and can keep that body alive until the credit.

### WF-MOD-CLOSE_QUARTERS

WORLD_FEATURE_ID: WF-MOD-CLOSE_QUARTERS  
NAME: Close Quarters  
MECHANIC: This map only: spells with `linear === true` lose 1 `maxRange` (min 1). Non-linear spells unchanged. Uses `SpellConfig.linear` / `maxRange` only — never the spell name. Inverse of Echoing Halls. Distinct from Low Ceiling (nerfs non-linear).  
PLAYER_DECISION: Switch to non-linear or melee, walk closer, or accept shorter linear reach.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Close-quarters overlay, `#2a2420` wash, shortened linear ticks.  
SOLVABILITY: No tile change. Melee and non-linear kits remain usable.  
COMBAT_RULES: Reads `SpellConfig.linear` / `maxRange` / `minRange`. Attack Nearest and summons are not spells. No damage rewrite.  
COUNTERPLAY: Cast non-linear; close to melee; refuse the fight.

### WF-EVT-KINDLED_HOUR

WORLD_FEATURE_ID: WF-EVT-KINDLED_HOUR  
NAME: Kindled Hour  
MECHANIC: This map only: if the player casts at least one spell whose `SpellConfig.apCost` is at least 1, the next `applyRewards` uses the hard multiplier. If they never do, that credit is unchanged. Attack Nearest, 0-AP spells, summons, and walking do not kindle it. Inverse of Steel Hour.  
PLAYER_DECISION: Spend AP on a spell for a hard purse, or conserve AP and take normal rewards.  
RELATIVE_DIFFICULTY: medium  
RARITY: rare  
VISUAL: Kindled corona, `#3a1810` wash, spark disc.  
SOLVABILITY: No blocks. Leaving is always legal.  
COMBAT_RULES: Reads `SpellConfig.apCost` only. Attack Nearest and summons are not spells. Multipliers on persist-lock `applyRewards` only. Does not rewrite `combatMath`.  
COUNTERPLAY: Leave without fighting; skip paid-AP spells; kindle with one cheap AP spell then kite.

### WF-ENV-GALE_BITE

WORLD_FEATURE_ID: WF-ENV-GALE_BITE  
NAME: Gale Bite  
MECHANIC: At the end of each combatant turn, if that unit spent 1 or more MP this turn, they pay 3% max HP. Spending 0 MP this turn is shelter. Inverse of Stagnant Haze.  
PLAYER_DECISION: Plant and skip walking, pay to reposition, or shove a foe after they move.  
RELATIVE_DIFFICULTY: hard  
RARITY: uncommon  
VISUAL: Gale wash `#1a2830`, still-air hatch on units that did not spend MP.  
SOLVABILITY: No walls added. The tax is not a block.  
COMBAT_RULES: End-of-turn challenge HP. Teleport tiles count as MP spends. Attack Nearest and AP spells do not. Summons pay it. No skipped turns. Distinct from Stagnant Haze (taxes 0 MP).  
COUNTERPLAY: End turns without spending MP, or pay to reposition.

---

## Composition examples (same level, different maps)

1. Ember Vein + Banner Patrol + Crosswind — path taxes, a moving elite, slides that can dump you onto the seam.  
2. Shrine Pool + Relic Cache + Low Ceiling — contest a heal, optional chest, linear-spell map.  
3. Creeping Ash + Blood Altar + Ash Rain — two timing taxes plus a voluntary HP spend for rewards.  
4. Fallen Gate + Mirror Step — wait vs long path vs 1 MP skip.  
5. Warband + Eclipse — optional packed melee brawl; leaving is legal.  
6. Salt Crust + Toll Keeper + Echoing Halls — hop-tax paths, a short-path elite, linear echo shots.  
7. Hunting Lantern + Second Wind + Gutter Steam — a chasing orb, an AP refund race, even-round vents.  
8. Tide Door + Slipstream — wait vs long path vs 1 MP one-way skip.  
9. Duelist Circle + Scourge Compact — wait-or-join elites plus a voluntary incoming tax.  
10. Sealed Urn + Pilgrim Banners — biased-coin purse, or leave in peace for a medium portal grant.  
11. Needle Grass + Cart Guard + Short Fuse — camping tax, intercept-or-let-go elite, cooldown spells locked round 1.  
12. Orbiting Cinder + Rally Drum + Isolation Chill — clockwise orb, an MP refund race, clump-or-pay cold.  
13. Spent Bridge + Triune Pads — three-crossing shortcut vs 1 MP carousel skip.  
14. Sleeping Vanguard + Stillness Oath — wake-or-leave elites plus a no-walk reward wager.  
15. Split Cache + Harvest Moon — pick a niche, then hold 70% HP for a hard purse.  
16. Flint Dust + Leash Warden + Heavy Incant — do not cast from dust, circle-or-enter an elite, high-AP spells cost MP.  
17. Pendulum Censer + Veil Font + Stagnant Haze — time the nave, hide from linear, keep moving.  
18. Hourglass Arch + Swap Anchor — three-round shortcut vs 1 MP nearest-body swap.  
19. Phalanx Line + Seeping Tithe — optional three-elite line plus a repeating HP tax for an extreme purse.  
20. Patience Cache + Iron Lent — wait-or-open a chest, then skip heals for a hard grant.  
21. Glass Shard + Drift Sentinel + Thin Air — dump-tax tiles, odd-round elite, 1-AP spells cost 2.  
22. Ratchet Cog + Keen Edge + Crowd Press — two-cell cog, plant for Attack Nearest, kite or pay the clump.  
23. Shift Slab + Recall Pin — wait-or-swap shortcut vs 1 AP mark / 1 MP return.  
24. Mirror Host + Open Vein — bleed-or-fight elite plus HP tax that only pays if you start a fight.  
25. Blood Lock + First Blood — sure hard chest, then land the first HP debit for another hard grant.  
26. Soot Lip + Still Watch + Tight Grip — leave before turn-start, circle a facing cone, 0-MP spells cost 1.  
27. Twin Sparks + Iron Pulse + Exposed Line — stand in the empty swap cells, plant for −15% incoming, break LoS to two bodies.  
28. Mercy Port + Cardinal Kick — one-round shortcut vs 1 MP two-tile facing skip.  
29. Split Banner + Last Stand — pick one distant elite, then cash out at ≤30% HP for an extreme purse.  
30. Trip Cache + Swift March — open before walking, then win in round 1 for a hard grant.  
31. Rime Heel + Even Picket + Long Shadow — idle-camp tax, even-round elite, extra non-linear range.  
32. Windrow + Long Arm + Cramped Stone — hop the bar, plant for reach, hold the open center.  
33. Latch Sill + File Slide — camp-adjacent to unlatch vs 1 MP file skip.  
34. Quiet Camp + Solo Oath — 2-tile fire ring plus a no-summon reward wager.  
35. Watch Cache + Steel Hour — open when hostiles are far, then skip paid-AP spells for a hard purse.  
36. Bog Silt + Odd Picket + Close Quarters — do not walk from silt, odd-round elite, shorter linear range.  
37. Turnstile Ember + True Strike + Gale Bite — time the plus, plant for linear shots, plant or pay to move.  
38. Coin Sill + Backstep — 1 AP to buy the short path vs 1 MP reverse step.  
39. Horn Relay + Bond Oath — fight-now-or-wait elites plus a keep-a-summon reward wager.  
40. Wound Cache + Kindled Hour — open below 50% HP, then spend AP on a spell for a hard purse.

None of these require a higher character level. The warband is scarier because it is a larger same-tier pack, not because it is “level 40 content”.

## Implementation gate

Do not wire this into `mapGen.ts`, `WorldExploration.tsx` RAF / turn / damage, or the live 22-modifier registry until a human or orchestrator picks **WDD-2026-08-31-001**, **WDD-2026-09-01-001**, **WDD-2026-09-02-001**, **WDD-2026-09-21-001**, **WDD-2026-09-22-001**, **WDD-2026-09-23-001**, **WDD-2026-09-24-001**, or **WDD-2026-09-25-001**. The catalog and `pickWeightedFeatures` are safe to import from tests and future overlay helpers.

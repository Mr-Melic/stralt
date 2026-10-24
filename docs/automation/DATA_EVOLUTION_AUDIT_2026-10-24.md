# Player data evolution audit — 2026-10-24

**Guardian:** Save / Data Evolution Guardian  
**HEAD:** `0f5363f`  
**Scope:** spell ownership/discovery/IDs/visuals, achievements, challenges, inventory, dungeon, Boss Rush, config refs; plus prior stale-overwrite pass (001–007).  
**Forbidden edits (this run):** `WorldExploration.tsx`, `main.mo`, `BuffShop.tsx`, `versionGate.ts`, `deathPenalty.ts`, `App.tsx`, `AchievementsPanel.tsx`, `combatMath.ts`.  
**Do not clone:** #362 #385 #386 #388 #400 #408 #437 #466 #490 #508 #577 #622 #667 #731 #778 #803 #828 #893.

Excluded known items (not re-reported): OLD_SPELL_IDS purge including physical_attack; ownership is catalog union starters; minLevel unenforced; empty-keys fall back to slot localStorage spell levels; upgradeSpell length ungarded; isBuiltInSpellId omits innates; dual loadout Text vs Nat; empty keys drop Text bar; pixelPattern unused / sprite URLs optional; adminDeletePlayerSpriteConfig does not delete Character; BuffShop ids/costs ≠ BUFF_CATALOG + unbounded purchaseBuff + localStorage vs buffInventories; dungeon Principal-scoped + non-idempotent (official never writes); claim uses current dokaReward / Feats hide inactive; achievementProgress survives delete; boss_defeated_* not allowlisted; pickEnemyLevel 999; region levelMax miss; tierSpawn JSON bigint throw; changelog unused / APP_VERSION live; nextGameKeyRequestId wraps; CharacterStats 12-field; saveBattleStats never-raise; no writeGeneration; APP_VERSION unpaid-death; deepNormalizeBigInts; profile full-replace; getSessionState blood=50; MAX_PERSISTED 20; killCount 0 official.

## NEW findings

See `ACTION_IDS_SDEG_2026-10-24.md`. Summary:

| ID | Title | Overwrite risk |
| :--- | :--- | :--- |
| SDEG-2026-10-24-001 | `readApplyRewardsOk` Number() write-path cut into persist lock | High at L48+ leftover / huge Nat |
| SDEG-2026-10-24-002 | Principal Doka + slot death 20/40 cross-tax; unpaid key slot-only | High multi-slot / shared browser |
| SDEG-2026-10-24-003 | mapsVisited / ground-doka localStorage: wipe resets; delete inherits | Medium feat progress |
| SDEG-2026-10-24-004 | `applyRewards` never mutates CharacterStats vitals | Medium long-horizon vitals lag |
| SDEG-2026-10-24-005 | Starter ap≤10/mp≤5 above PLAYER_BASE 8/4 | Low–medium formula vs store |
| SDEG-2026-10-24-006 | `gameTypes.Character.dokaBalance` false SoT; forge still sends | Low (stripped) / agent trap |
| SDEG-2026-10-24-007 | `saveCallerUserProfile` silent void on reject | Medium stale HUD / name |
| SDEG-2026-10-24-008 | Live boss configs = `pbv_boss_configs`; canister unused + schema skew | Medium cross-device boss edits |
| SDEG-2026-10-24-009 | SummonUnitDef persist drops summonKit/ap/mp | High admin summons / kit control |
| SDEG-2026-10-24-010 | Frontend clearBossRushForSlot = reset only vs canister remove | Medium latent slot reuse |
| SDEG-2026-10-24-011 | setBossRushProgress +1 walk mints master without combat | High raw-client integrity |
| SDEG-2026-10-24-012 | Legendary challenge badges never persist | Low cosmetic |
| SDEG-2026-10-24-013 | Spell level/bar localStorage keyed by display-name userId | Medium empty-keys hydrate |
| SDEG-2026-10-24-014 | Enemy hard-delete; ghost spellLevelKeys after catalog purge | Medium rename/retire |
| SDEG-2026-10-24-015 | purchaseBuff without occupied character slot | Low official / med raw |
| SDEG-2026-10-24-016 | WX JSON.stringify of getBossRushConfig Text double-encodes `pbv_boss_rush_config` | Low today / high if a later client reads the wrapped blob |
| SDEG-2026-10-24-017 | Legacy `pbv_active_spells` copy overwrites a newer namespaced spell bar | High first replay while both keys exist |
| SDEG-2026-10-24-018 | Region and map-modifier catalogs hard-delete; Character stores none of those ids | Low today / high if required Character fields ship |
| SDEG-2026-10-24-019 | Color palette blob is not a mandatory gameplay persist dependency | Low today / high if palette becomes required |

Helpers (001–015 pass): `bossConfigPersist.ts`, `summonUnitDefPersist.ts`, `bossRushSlotClear.ts`, `challengeBadgePersist.ts`, `slotLocalProgressKeys.ts`, `catalogDeletePolicy.ts` (+ tests).  
Helpers (016–019 pass): `bossRushConfigLocalCache.ts`, `legacyActiveSpellsMigrate.ts`, `configCatalogHardDelete.ts`, `colorPaletteGameplayDependency.ts` (+ tests). No forbidden-file edits. No persist-schema / EOP chain change.

Still open (not NEW; vehicles exist): victory HP floor vs linear cap (#386); unpaid-death owner key (#385/#508/#667); BuffShop canister wire (#408/#490); complete(9) ordering (#803 landed).

## MAX_LEVEL / silent caps / Number() on XP·Doka·level

- **No `MAX_LEVEL`.** `applyRewards` levels with unbounded Motoko `Nat` (`main.mo` 2134–2139). Admin UI: “No player level cap.”
- **Silent caps (not level):** `MAX_PERSISTED_AP/MP=20`; `applyRewards` dokaΔ>100_000 / xpΔ>500_000 `#err` (official client clamps); `pickEnemyLevelFromTiers` 999; summon `level>99`; region `levelMax` miss; HUD XP threshold saturates at `Number.MAX_SAFE_INTEGER` from level **48** (`xpForNextLevel`).
- **Number() on XP/Doka/level (persist-adjacent):**
  - `deepNormalizeBigInts` — character slot hydrate (known)
  - `readApplyRewardsOk` 28–30 — credit ok payload (**NEW-001**)
  - `resolveBattleRewards` 215–219 — double Number on recap
  - `progressPersist.toNat` / `CommittedProgress` — IEEE lock
  - `normalizeCallerDokaBalance` — wallet query
  - `deathPenalty` / `experienceFromCharacterRecord` — absolute writes
  - `achievementReward` / `shopPurchase` / `spellUpgrade` / `dokaPersist` — credit/spend paths
  - WX init `Number(character.level|experience|stats.*)` 3227–3243

## Cohort (NEW only)

| Owner | Effect |
| :--- | :--- |
| Yesterday | Shared wallet death tax; display-name spell/maps keys; boss drafts local-only; WX Boss Rush cache double-encoded (016, unread) |
| Six months | High-level Number cut (001); ghost OLD_SPELL keys still on bar ownership; stale global `pbv_active_spells` can clobber namespaced bar once (017) |
| Pre-feature | Optional Character fields null OK; challenge badges never stored; no region/modifier ids on Character (018); palette blob not required (019) |
| Renamed/retired | Enemy hard-delete orphans; region/modifier hard-delete (018); no alias map; ghost spellLevelKeys after purge |
| Slot delete + recreate | Inherits mapsVisited / spell_levels / active_spells localStorage + achievement/buff maps; Boss Rush full-clear only if canister remove ran |
| Admin summons | Kit/ap/mp lost on round-trip (009); starter pieceType kits still work from spellData |
| Raw client | Boss Rush walk-to-master (011); purchaseBuff into empty slot (015) |
| Visuals | Palette / sprite URL delete cannot unload a Character today (019; known pixel-fallback) |

## Helper-only without forbidden files?

| Finding | Helper+tests only? |
| :--- | :--- |
| 008–019 | Yes for lock/docs; wiring needs WX / main.mo / BuffShop / vehicles listed above |
| Sprite URLs required | No new bug — enemy/player spriteUrl optional (`adminGuard.mo` 282–290, 312–328); ads require https (not player persist) |
| saveActiveSpells / dual Nat | Still do not wire (known 10-23-004); no new helper |
| changelog / GameKey wrap | Known; unchanged |

## What this run will not do

- Edit forbidden files or clone open helper PRs
- Add required persist fields / migrations
- Wire `writeGeneration` without a later chain file after `20260901`

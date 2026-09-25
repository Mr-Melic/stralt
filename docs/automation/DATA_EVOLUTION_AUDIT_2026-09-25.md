# Player data evolution audit — 2026-09-25

**Guardian:** Save / Data Evolution Guardian  
**HEAD inspected:** `0f5363f`  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

Does **not** approve any new required persist field. Does **not** edit `main.mo`, `WorldExploration.tsx`, `BuffShop.tsx`, or `deathPenalty.ts`. Does **not** clone #362 / #385 / #386 / #388 / #400 / #408 / #437 / #466 / #490 helpers. Does **not** edit `versionGate.ts` (stack-compat: #508 owns unpaid-death preserve). Feat-key keep is `versionGateFeatEvolve.ts` to OR after #508. Incremental pass after #577 first commit: revert versionGate overlap, correct 007 (Nat does not wrap), add 008/009.

## Cohort questions

| Player | What happens today |
| :--- | :--- |
| Created yesterday | 12-field Character, leftover XP, per-principal Doka, empty `spellLevelKeys`. Library = starters ∪ every `usableByPlayer` catalog row. Feat counters still drop on APP_VERSION wipe until #508 ORs `versionGateFeatEvolve.ts` (001). explore/loot still have **no canister counter** (008). |
| Created six months ago | Optional Character fields default null. `getSessionState` blood **50** if someone queries it (official UI does not). Purged spell ids stay in arrays; UI also hides **names**. HP/AP/MP grandfather. New device mid-grind on explore_25 starts at 0 (008). |
| Created before a feature | Missing dungeon/rush/achievement/GameKey rows → 0 / [] / null. Challenges session-only. **Unsafe** if a required field is added without a later chain file. |
| Created before a spell/enemy/feat rename | No spell alias table. Boot `OLD_SPELL_IDS` still deletes catalog rows every upgrade. Achievement rename-by-new-id orphans `principal#oldId` (009). Enemy ids are config-only. Unknown `pieceType` paints `king.front`. |
| Owns now-retired content | Arrays keep the id. Retired catalog stays in the library only if already in keys/bar/starters. Claim still pays **current** `dokaReward`. Delete-character does not drop principal dungeon, slot canister buffs, or browser feat keys (002). |

## Already tracked (not re-minted)

SREG/SDEG 001–011; applyRewards clamps; victory HP floor; GameKey wrap; redeem credits caller; KYC pending; saveActiveSpells keep-store (#362); OLD_SPELL_NAMES_SET; AP/MP cap 20; applyRewards pow2; compounding HP; empty keys bar/hydrate; atk/res never grow; unpaid death slot-only; greater_health_potion alias; upgradeSpell minLevel; saveKillCount additive; getSessionState blood 50 / covenant by name; version-gate unpaid death (#508); saveCallerUserProfile uiLayout wipe; deleteCharacter dungeon+buff leftovers (#508); Motoko boss seeds vs OLD_SPELL_IDS.

## New findings (this run)

| ID | Hazard | Evidence (HEAD lines) | Cohort | Helper-only? |
| :--- | :--- | :--- | :--- | :--- |
| SDEG-2026-09-25-001 | APP_VERSION wipe drops feat counters + shrine/covenant caches | `versionGate.ts` **7–13** on main (inventory/spawn/levelup only); `App.tsx` **297–317**; counters `WorldExploration.tsx` **2193–2200**, **6471–6477**, **11398–11406**; covenant/shrine **1373–1403**, **11330–11352** | Yesterday / six-month players mid-grind on `explore_25_maps` / `loot_10_doka` / shrine feats lose progress on every deploy bump; already-unlocked canister rows stay | **Yes** — `versionGateFeatEvolve.ts` (do not edit `versionGate.ts`; #508 owns it) |
| SDEG-2026-09-25-002 | deleteCharacter leaves slot-scoped **browser** leftovers | `deleteCharacter` `main.mo` **450–492** (clears slot + Boss Rush only); `CharacterSelection.tsx` **875** no localStorage clear; keys listed in `slotBrowserLeftoverEvolve.ts` | Recreate-in-slot inherits maps/ground-doka/covenant/shrine/spell caches + unpaid death slot key | **Yes** — contract helper; wire clear in CharacterSelection later (not on older persist PRs) |
| SDEG-2026-09-25-003 | Official UI never calls session/loadout canister writers | No `.updateSessionState` / `.getSessionState` / `.saveActiveSpells(` in components; WX **2830–2831** documents saveActiveSpells removal; backend still at `main.mo` **3120–3207**, **3211–3236** | Six-month rows with null blood/covenant/shrine never heal via official path; localStorage is sole authority and is wipe-sensitive (001) | **Yes** — `sessionStateEvolve.ts` locks orphan contract |
| SDEG-2026-09-25-004 | `spellLevelKeys` longer than `spellLevelValues` traps `upgradeSpell` | `main.mo` **998–1000** unbound `spellLevelValues[idx]` | Corrupted / raw-client rows; create clears both (**225–226**); update keep-stores (**429–430**) | **Yes** — frontend preflight helper; Motoko bounds check needs human after older persist PRs |
| SDEG-2026-09-25-005 | One-shot Doka claim ids are memory-only | `claimedGroundLootIdsRef` WX **1371**; `tryClaimPickupId` `dokaPersist.ts` **71–75**; Set reset WX **6790 / 6799** | Not wiped by version bump (not stored). Remount / loot regen can remint if `collected` flags reset with the Set | **Yes** — `oneShotClaimStorageEvolve.ts` documents; remint path still needs WX for durable claims |
| SDEG-2026-09-25-006 | `gameTypes.Character` drifts from Motoko/bindgen | `gameTypes.ts` **29–50** (`dokaBalance?`, optional `pixelPattern`/`stats`, index sig); Motoko `main.mo` **122–145** (required pattern/stats, no dokaBalance); CharacterCreation **266–280** still sends `dokaBalance` | Stale clients; ActorAny drops unknown fields but hides missing requireds | **Yes** — `characterClientShapeEvolve.ts`; align gameTypes without Motoko |
| SDEG-2026-09-25-007 | `upgradeSpell` cost `* 2` unguarded (Motoko Nat does **not** wrap) | `main.mo` **1018–1023** | Extreme spell levels burn IC instructions / huge debit — they do not undercharge via wrap | **Yes** — frontend refuse helper; Motoko `#err` later, never saturate-undercharge |
| SDEG-2026-09-25-008 | explore/loot feat counters are browser-only; `achievementUnlockRejected` skips them and `spell_master_8` | `adminGuard.mo` **677–694**; WX **2193–2200**; `featConditionAuthorityEvolve.ts` | New device / raw client mid-grind; already-unlocked canister rows stay | **Yes** — contract helper; canister counters need a later file after 20260901 |
| SDEG-2026-09-25-009 | Achievement id rename-by-recreate orphans `principal#id` progress | `main.mo` **2495**, **2528**, **2389–2405**; `achievementIdAliasEvolve.ts` | Six-month unlock + admin new id → Feats cannot claim | **Yes** — keep-id contract; no alias map without a later file |

## Investigated — not new gaps

| Topic | Verdict |
| :--- | :--- |
| applyRewards / completeBossRush missing character | Both `#err` (`main.mo` **2121–2123**, **3323–3331**) |
| claim after retire | Still pays without `active` check (`main.mo` **2517–2550`) — already SDEG-008 / #437 |
| Achievements principal vs slot | By design (`principal#id`); #508 says do not wipe on delete |
| pixelPattern / pieceType / sprite URLs | Pattern+pieceType required Text; sprite URLs optional. CharacterCreation **125–136** JSON.parse falls back to catalog; live play uses `getPersistedPiecePattern` (`pieceArt.ts` **653–658**) not stored JSON. **Pass** — owner-uploaded URLs are not mandatory persist. |
| Achievement condition rename | `knownAchievementCondition` closed list — unknown strings reject. Keep-id is 009. |
| Chat / ads / name pools / color palettes | Chat `transient` (**2603–2604**); ads/names/palettes admin-global, not per-player progress |
| processPendingPurchases / getCallerDokaBalance | No-op credit + query — tracked KYC / shop |
| resetBossRush / setBossRushProgress traps | Intentional abort guards |
| adminDeleteSpell / Achievement | Retire-when-referenced (**882–901**, **2389–2409**) |
| adminDeleteEnemy / Region / MapModifier / Sprite | Hard remove; Character does not store those ids — low player-data risk |
| saveUserUiLayout vs saveCallerUserProfile | Tracked 09-24-002 |
| Panel layout wipe | #508 intentionally leaves wipeable (canister `uiLayout` authority) |
| activeSpells Nat keep-store | Tracked #362; this run adds orphan-API evidence (003) |

## Version-gate preserve matrix

| Key pattern | On main today | After #508 + OR 001 helper |
| :--- | :--- | :--- |
| `*_inventory` | yes | yes |
| `pbv_tier_spawn_config` / `pbv_levelup_config` | yes | yes |
| `pbv_pending_death_penalty*` | no | yes (#508) |
| `*_pbv_maps_visited_count` / `*_pbv_ground_doka_pickups` | no | yes (`versionGateFeatEvolve.ts`) |
| `pbv_covenant_buff_*` / `pbv_shrine_count_*` | no | yes (`versionGateFeatEvolve.ts`) |
| `*_pbv_active_spells` / `*_pbv_spell_levels` | no | no (#388 empty-keys hydrate) |
| `pbv_panel_layout_*` | no | no (canister uiLayout) |
| One-shot claim Sets | n/a (memory) | n/a |

## What this run will not approve

- New required Character fields or Motoko edits while older persist PRs own `main.mo`
- Editing WorldExploration / BuffShop / deathPenalty
- Cloning #466 / #490 / #508 non-versionGate helpers
- Making sprite URLs mandatory

# Player data evolution audit — 2026-09-25

**Guardian:** Save / Data Evolution Guardian  
**HEAD inspected:** `0f5363f`  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

Does **not** approve any new required persist field. Does **not** edit `main.mo`, `WorldExploration.tsx`, `BuffShop.tsx`, or `deathPenalty.ts`. Does **not** clone #362 / #385 / #386 / #388 / #400 / #408 / #437 / #466 / #490 helpers. **Unions** #508 `versionGate` unpaid-death preserve and extends it for feat / shrine / covenant keys.

## Already tracked (not re-minted)

SREG/SDEG 001–011; applyRewards clamps; victory HP floor; GameKey wrap; redeem credits caller; KYC pending; saveActiveSpells keep-store (#362); OLD_SPELL_NAMES_SET; AP/MP cap 20; applyRewards pow2; compounding HP; empty keys bar/hydrate; atk/res never grow; unpaid death slot-only; greater_health_potion alias; upgradeSpell minLevel; saveKillCount additive; getSessionState blood 50 / covenant by name; version-gate unpaid death (#508); saveCallerUserProfile uiLayout wipe; deleteCharacter dungeon+buff leftovers (#508); Motoko boss seeds vs OLD_SPELL_IDS.

## New findings (this run)

| ID | Hazard | Evidence (HEAD lines) | Cohort | Helper-only? |
| :--- | :--- | :--- | :--- | :--- |
| SDEG-2026-09-25-001 | APP_VERSION wipe drops feat counters + shrine/covenant caches | `versionGate.ts` **7–13** (pre-fix: inventory/spawn/levelup only); `App.tsx` **297–317**; counters `WorldExploration.tsx` **2193–2200**, **6471–6477**, **11398–11406**; covenant/shrine **1373–1403**, **11330–11352** | Yesterday / six-month players mid-grind on `explore_25_maps` / `loot_10_doka` / shrine feats lose progress on every deploy bump; already-unlocked canister rows stay | **Yes** — extend `shouldPreserveVersionGateKey` (this PR unions #508) |
| SDEG-2026-09-25-002 | deleteCharacter leaves slot-scoped **browser** leftovers | `deleteCharacter` `main.mo` **450–492** (clears slot + Boss Rush only); `CharacterSelection.tsx` **875** no localStorage clear; keys listed in `slotBrowserLeftoverEvolve.ts` | Recreate-in-slot inherits maps/ground-doka/covenant/shrine/spell caches + unpaid death slot key | **Yes** — contract helper; wire clear in CharacterSelection later (not on older persist PRs) |
| SDEG-2026-09-25-003 | Official UI never calls session/loadout canister writers | No `.updateSessionState` / `.getSessionState` / `.saveActiveSpells(` in components; WX **2830–2831** documents saveActiveSpells removal; backend still at `main.mo` **3120–3207**, **3211–3236** | Six-month rows with null blood/covenant/shrine never heal via official path; localStorage is sole authority and is wipe-sensitive (001) | **Yes** — `sessionStateEvolve.ts` locks orphan contract |
| SDEG-2026-09-25-004 | `spellLevelKeys` longer than `spellLevelValues` traps `upgradeSpell` | `main.mo` **998–1000** unbound `spellLevelValues[idx]` | Corrupted / raw-client rows; create clears both (**225–226**); update keep-stores (**429–430**) | **Yes** — frontend preflight helper; Motoko bounds check needs human after older persist PRs |
| SDEG-2026-09-25-005 | One-shot Doka claim ids are memory-only | `claimedGroundLootIdsRef` WX **1371**; `tryClaimPickupId` `dokaPersist.ts` **71–75**; Set reset WX **6790 / 6799** | Not wiped by version bump (not stored). Remount / loot regen can remint if `collected` flags reset with the Set | **Yes** — `oneShotClaimStorageEvolve.ts` documents; remint path still needs WX for durable claims |
| SDEG-2026-09-25-006 | `gameTypes.Character` drifts from Motoko/bindgen | `gameTypes.ts` **29–50** (`dokaBalance?`, optional `pixelPattern`/`stats`, index sig); Motoko `main.mo` **122–145** (required pattern/stats, no dokaBalance); CharacterCreation **266–280** still sends `dokaBalance` | Stale clients; ActorAny drops unknown fields but hides missing requireds | **Yes** — `characterClientShapeEvolve.ts`; align gameTypes without Motoko |
| SDEG-2026-09-25-007 | `upgradeSpell` cost `* 2` Nat wrap | `main.mo` **1018–1023** | Extreme spell levels undercharge after wrap | **Yes** — frontend refuse helper; Motoko saturating mul later |

## Investigated — not new gaps

| Topic | Verdict |
| :--- | :--- |
| applyRewards / completeBossRush missing character | Both `#err` (`main.mo` **2121–2123**, **3323–3331**) |
| claim after retire | Still pays without `active` check (`main.mo` **2517–2550`) — already SDEG-008 / #437 |
| Achievements principal vs slot | By design (`principal#id`); #508 says do not wipe on delete |
| pixelPattern / pieceType / sprite URLs | Pattern+pieceType required Text; sprite URLs optional — pass (09-24 visuals) |
| Chat / ads / name pools / color palettes | Chat `transient` (**2603–2604**); ads/names/palettes admin-global, not per-player progress |
| processPendingPurchases / getCallerDokaBalance | No-op credit + query — tracked KYC / shop |
| resetBossRush / setBossRushProgress traps | Intentional abort guards |
| adminDeleteSpell / Achievement | Retire-when-referenced (**882–901**, **2389–2409**) |
| adminDeleteEnemy / Region / MapModifier / Sprite | Hard remove; Character does not store those ids — low player-data risk |
| saveUserUiLayout vs saveCallerUserProfile | Tracked 09-24-002 |
| Panel layout wipe | #508 intentionally leaves wipeable (canister `uiLayout` authority) |
| activeSpells Nat keep-store | Tracked #362; this run adds orphan-API evidence (003) |

## Version-gate preserve matrix (after this PR)

| Key pattern | Preserved? |
| :--- | :--- |
| `*_inventory` | yes |
| `pbv_tier_spawn_config` / `pbv_levelup_config` | yes |
| `pbv_pending_death_penalty*` | yes (#508 union) |
| `*_pbv_maps_visited_count` / `*_pbv_ground_doka_pickups` | **yes (new)** |
| `pbv_covenant_buff_*` / `pbv_shrine_count_*` | **yes (new)** |
| `*_pbv_active_spells` / `*_pbv_spell_levels` | no (canister bar/levels authority; empty-keys hydrate is #388) |
| `pbv_panel_layout_*` | no (canister uiLayout) |
| One-shot claim Sets | n/a (memory) |

## What this run will not approve

- New required Character fields or Motoko edits while older persist PRs own `main.mo`
- Editing WorldExploration / BuffShop / deathPenalty
- Cloning #466 / #490 / #508 non-versionGate helpers
- Making sprite URLs mandatory

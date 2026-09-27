# Content retirement and compatibility audit — 2026-09-27

**Guardian:** Content Retirement & Compatibility Manager  
**Trigger:** cron `0 16 * * 0`  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`)  
**Gameplay / production catalogs:** **not modified.** This run classifies only.

Never assume deletion is safe. Persistent IDs (`spellLevelKeys`, achievement progress keys, Boss Rush room ids, shop `packageId`, GameKey maps, Character `pieceType` / `pixelPattern`) stay until a later file + alias table + human-approved lifecycle write. Soft-retire (`usableByPlayer=false`, achievement `active=false`, spawn-off) is the default.

Do **not** mint twins of SDA / SDEG / CDA / VAL / WDEAD ids. CRC ids are the **deletion-safety** gate: whether an obsolete-looking row may be removed, remapped, or must stay.

## Verdict

**Zero candidates are `SAFE_TO_REMOVE` as persistent IDs.** Several items are *wrongly listed as obsolete while still live* (starter `physical_attack`, Boss Rush `weeping_pawn_2`). Unpublished design catalogs (`WF-*`, `FSN-*`, `EED-*`) are not production content — keep the docs; do not treat “unwired” as “delete the live system.”

| Bucket | Count | Dominant lifecycle |
| :--- | ---: | :--- |
| Live ids wrongly on a purge/obsolete list | 2 | **ACTIVE** (fix the list, do not delete) |
| Purged / superseded ids that may still sit on characters | 15+ | **LEGACY_SUPPORTED** + **MIGRATION_REQUIRED** |
| Parallel catalogs (backend seed vs frontend combat) | 2 | **ACTIVE** both; align, do not drop either set |
| Unpublished design ids (`WF-*`, `FSN-*`, encounter sheets) | many | Design-only — **not** player persist |
| Candid / IAP stubs | 3 | **LEGACY_SUPPORTED** (signature kept) |
| Telemetry increment fields | 0 shipped | Nothing to retire |

## How live retirement works today

| Mechanism | Where | What it actually does |
| :--- | :--- | :--- |
| `OLD_SPELL_IDS` boot purge | `src/backend/main.mo` **686–697** | `spellConfigs.remove` on **every** start/upgrade. Includes live starter `physical_attack`. |
| `OLD_SPELL_NAMES_SET` | `WorldExploration.tsx` **2356–2393** | Filters catalog **by id and display name**. Same list as Motoko, plus human names. |
| `usableByPlayer=false` | `adminDeleteSpellConfig` **882–897**; `upgradeSpell` **1007–1012** | Used as **retire**. Built-in six cannot hard-delete. Owned-but-never-upgraded ids are **not** in `spellLevelKeys`. See SDA-2026-09-02-001 — do not extend this flag. |
| Achievement `active=false` | `main.mo` **2398–2405** / **2473** | Soft-retire when progress rows exist. Claim still pays **current** `dokaReward`. |
| Enemy / boss / region delete | `adminDeleteEnemyConfig` **798–802** | Unconditional `remove`. No player-id scan. World spawn does **not** read `enemyConfigs`. |
| Sprite delete | `adminDeletePlayerSpriteConfig` **854–860** | Drops catalog row. Character record stays. Combat already uses pixel fallback. |

## Player persist that can hold content ids

| Store | Ids that can linger |
| :--- | :--- |
| `Character.spellLevelKeys` / `spellLevelValues` | Any catalog id ever upgraded, including purged OLD ids |
| `Character.spellBarOrder` | Same; `setSpellBarOrder` drops ids not in keys |
| `achievementProgress` keyed `principal#id` | Achievement config ids |
| `shopPackages` + `purchaseRecords.packageId` | `pkg_10` … `pkg_1_6m` even after GameKey replaced checkout |
| `buffInventories` (canister) vs `${principal}_inventory` (BuffShop) | Potion ids; **two catalogs** |
| `pbv_boss_configs` localStorage | Frontend 19-boss table (not canister seed) |
| Boss Rush `currentRoom` 0–9 | Room index only — **not** boss ids. Room 9 still *spawns* `weeping_pawn_2` |
| `Character.pieceType` / `pixelPattern` | Chess / creature string; unknown → `king.front` |
| Challenges | **Session-only.** No canister history. |

## Category notes (do not delete from this file)

### Spells

Combat ids live in `src/frontend/src/data/spellData.ts` (32 unique ids, including `physical_attack` / Strike). Canister seed is the six `defaultSpells` (`shadow_strike` … `void_collapse`, `admin.mo` **168–191**). `upgradeSpell` requires `spellConfigs.get`. Enemy kits request `physical_attack` (`enemyAI.ts` `ENEMY_KITS`). Both the Motoko purge and the WX name set treat that id as obsolete, so kit resolve against `normalizedSpellPool` (`WorldExploration.tsx` **2688–2694**, **11919–11924**) drops Strike whenever the backend pool is non-empty **or** the starter fallback is filtered.

Clone pairs (Shield / Iron Skin, Poison / Venom, …) are **ACTIVE duplicates**. CDA-2026-09-02-005 is the verb-split ticket. CRC stance: **do not delete** an id to “dedupe” without ownership remap.

### Enemies

Seven live family ids in `FAMILY_TYPES` (`spawnPolicy.ts` **49–57**). Catalog `ap` / `mp` are unused at spawn (comment **64–66**). Admin `EnemyConfig` (`types/admin.mo` **15–26**) is spawn-unused; `spriteUrl` is catalog-only (`adminVisualStatus.ts`). Paper families (`hex_chorister`, …) exist only in design docs — **zero** `src/` hits.

### Bosses

Frontend `BOSS_IDS` is 19 (`bossTypes.ts` **390–410**). Motoko `defaultBossConfigs` seeds **12** (`admin.mo` **349–568**). Live overworld / Rush reads `DEFAULT_BOSS_CONFIGS` / `pbv_boss_configs`, not the canister seed. Room 9 `boss2Id` is `"weeping_pawn_2"` (`useBossRush.ts` **127**) — **not** in `BOSS_IDS` or `DEFAULT_BOSS_CONFIGS`. Motoko phase pools still list purged ids (`fireball`, `blood_nova`, `physical_attack`, …).

### Achievements / challenges

Fifteen seeded feats, all `active = true` (`admin.mo` **308–326**). Soft-retire path exists. Nine `DEFAULT_CHALLENGES` (`challengeCompletion.ts` **44–109**) are session-only; badges (`Untouchable` / `Blitz` / `Striker`) are recap chrome, not persist keys.

### Visuals

`getPersistedPiecePattern` (`pieceArt.ts` **653–658**) falls back to `king.front`. Sprite URLs are stored, not drawn. Deleting a URL row does not delete the Character.

### Encounters / formations / world features

`worldFeatures.ts` is imported by tests only — **not** `WorldExploration.tsx`. `FSN-*` formation ids and `EED-*` encounter sheets are design-only (zero production spawn tables). Do not delete live lava/ice/spikes, 22 `MAP_MODIFIERS`, or the seven families to “make room.”

### Admin configuration

`defaultMapModifiers` seeds only `slime_flood` + `paper_windstorm`. Engine registry has 22 ids. Admin still offers `lava_fields` / `ice_fields` / `spike_pit` as legacy types; WX maps them to spikes/ice/lava (`WorldExploration.tsx` **6696–6709**). Shop `pkg_*` rows still seed; player UI is GameKey (`AdminDashboard.tsx` **6932–6934**). Buff canister `greater_potion` ≠ BuffShop `greater_health_potion`.

### Telemetry

No increment sidecar, no Intelligence store. `longHorizonSim.telemetry.available` is false. KYC `PurchaseRecord` fields and `GameKeyRequest.email` are **PII persist**, not metrics — do not “retire” them into a dashboard.

## What this run will not do

- Delete or rename any catalog / persist id
- Blank `.old`, edit shipped migrations, or add stables
- Extend `usableByPlayer=false` as lifecycle (SDA owns that)
- Clone CDA clone-pair retires as CRC deletes
- Treat unpublished `WF-*` / `FSN-*` / `EED-*` as dead production code

Ledger: [`ACTION_IDS_CRC_2026-09-27.md`](./ACTION_IDS_CRC_2026-09-27.md).

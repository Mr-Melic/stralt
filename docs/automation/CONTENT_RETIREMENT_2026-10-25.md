# Content retirement and compatibility — 2026-10-25

**Guardian:** Content Retirement & Compatibility Manager  
**Trigger:** cron `0 16 * * 0`  
**HEAD:** `0f5363f` (same SHA as the 2026-09-27 CRC pass; `origin/main` last merge 2026-09-03)  
**Production catalogs not modified this run.** Lifecycle cards are in [`ACTION_IDS_CRC_2026-10-25.md`](./ACTION_IDS_CRC_2026-10-25.md).

Do not twin SDA / CDA / SDEG / EBA / DCA ids. CRC classifies deletion safety and graceful retirement only.

## Rule applied

Never assume deletion is safe. Prefer graceful retirement:

- A spell can leave discovery / catalog seed while remaining on `spellLevelKeys` / `spellBarOrder` / innate starters.
- An enemy or boss can stop spawning while its id stays for rush labels, kits, pixels, or admin maps.
- A custom visual URL can be dropped because the default pixel fallback is live, **if** no persisted gameplay field depends on that asset.
- Persistent ids are not deleted because a replacement exists. `second_lament` is still spec-only on `docs/design/BOSS_AND_SPELL_DISCOVERY.md`; live room 9 still stores `weeping_pawn_2`.

**Zero persistent ids are SAFE_TO_REMOVE.**

## Verdict

| Area | SAFE_TO_REMOVE persistent ids? | Headline |
| :--- | :--- | :--- |
| Spells | No | Live starter `physical_attack` (Strike) is still on the every-upgrade purge list and the client tombstone set. |
| Enemies | No | Admin `EnemyConfig` is catalog-only; live spawn is chess-piece + 7 families. Register extras are flavor. |
| Bosses | No | `weeping_pawn_2` is an orphan rush label. AdminLib seeds 12 of 19 frontend bosses. |
| Achievements | No | Soft-retire via `active=false`. Claim still pays. `boss_defeated_*` is an unallowlisted emitter. |
| Challenges | No | Nine session ids, all rolled. No canister challenge store. |
| Visuals | No persistent gameplay ids | Hosted sprite URLs are stored, not rendered. `pieceType` + king.front fallback is the live path. |
| Encounters / formations | None in runtime | Formation docs only. Nothing to delete from `src/`. |
| World / modifiers | No | `lava_fields` / `ice_fields` / `spike_pit` still drive hazard placement despite admin “no engine hook” copy. |
| Admin / IAP | No | GameKey replaced packages; `pkg_*` maps, KYC `purchaseRecords`, and Candid stubs remain. |
| Telemetry | N/A | No live counters to retire. Architecture docs never shipped. |

## Candidates

### Spells

`OLD_SPELL_IDS` (`src/backend/main.mo` 689–697) removes 16 texts from `spellConfigs` on **every** start/upgrade, after `defaultSpells()` seeds the six built-ins when the map is empty.

| Id | Live starter / kit? | Lifecycle |
| :--- | :--- | :--- |
| `physical_attack` | **Yes** — `spellData.ts` 9–25, name **Strike**. `ENEMY_KITS`, `SUMMON_KIT`, `bossKits.ts`, Attack Nearest. | **ACTIVE** frontend + **MIGRATION_REQUIRED** purge/tombstone |
| `inferno` | Superseded by `spell-inferno` (same display name **Inferno**) | Catalog **MIGRATED**; keys **LEGACY_SUPPORTED** |
| `frost_nova` | Superseded by `spell-frost-nova` (same display name **Frost Nova**) | Catalog **MIGRATED**; keys **LEGACY_SUPPORTED** |
| `heal` | Superseded by `starter-heal` (**Blood Mend**) | **NO_LONGER_ACQUIRABLE** / **LEGACY_SUPPORTED** |
| `drain_life` | Approx. `starter-drain` (**Life Drain**); no alias table | **NO_LONGER_ACQUIRABLE** / **LEGACY_SUPPORTED** |
| Other 11 purge ids | No live starter id | **NO_LONGER_ACQUIRABLE** / **LEGACY_SUPPORTED** |

`OLD_SPELL_NAMES_SET` (`WorldExploration.tsx` 2356–2389) filters **ids and display names**. That drops live `spell-inferno` / `spell-frost-nova` by name and live Strike by id from `filteredBackendSpells` and from the empty-backend starter fallback (`2688–2694`). Kits resolve through `normalizedSpellPool.find` (`11919–11923`). When any backend row survives (the six built-ins), the pool is backend-only → Strike / Inferno kit misses.

No spell-id alias table exists. `_spellReferencedByPlayers` (`main.mo` 273–284) only walks character `spellLevelKeys` + `spellBarOrder`. Soft-retire is `usableByPlayer=false` (`889–897`). `upgradeSpell` needs `spellConfigs.get` (`1008–1012`) → purged ids return **Spell not found**. Built-ins (`adminGuard.mo` 21–24) cannot be deleted.

Do not strip purged ids from character arrays without a generation + alias table (SDEG / SDA vehicles).

### Bosses / enemies / encounters

- `BOSS_IDS` / `DEFAULT_BOSS_CONFIGS` / frontend kits: 19 ids (`bossTypes.ts` 390–410).
- AdminLib `defaultBossConfigs()`: **12** (`admin.mo` 349–568). Missing: `alabaster_fortress`, `chessboard_lich`, `mirror_sovereign`, `starved_vampire_pawn`, `pale_archivist`, `twin_monarchs`, `enthroned_void`.
- `BOSS_RUSH_ROOMS[9].boss2Id` = `weeping_pawn_2` (`useBossRush.ts` 127). Not in `BOSS_IDS`. Admin copy already admits it (`AdminDashboard.tsx` 7142–7145). Rush spawn stamps `boss-rush-${room}-N` placeholders; still do not empty the slot. Spec remap target `second_lament` is **not** a live `BossId`.
- AdminLib phase pools still list purged ids (`fireball`, `blood_nova`, `physical_attack`, …). Live portal combat uses frontend `BOSS_KITS` / `starterSpells`. Seed is **SUPERSEDED_KEEP**.
- Live overworld enemies: piece roll + `FAMILY_TYPES` 7 (`spawnPolicy.ts` 49–57). Admin `getEnemyConfigs` is dashboard-only (`AdminDashboard.tsx` 2117–2121).
- Enemy Register extras (Crimson Spawn, Shadow Lurker, Storm Caller, “Final Enthroned Void”) are flavor (`enemyRegisterCopy.ts` 11–12). Not `EnemyFamily` ids.
- Formations: design docs only. No runtime formation ids in `src/frontend`.
- `kiter` / `kamikaze` remain legal `summonAI` aliases (`enemyAI.ts` 205–207, `gameConstants.ts` 69–77, `adminSafety.ts` 19–27).

### World / admin / IAP

- Hazard aliases `lava_fields` / `ice_fields` / `spike_pit` **do** place lava/ice/spikes (`WorldExploration.tsx` 6696–6709). Admin labels say “legacy id (no engine hook)” (`AdminDashboard.tsx` 4943–4950). Registry test correctly omits them from `listAdminModifierTypeOptions` (`mapModifiers.test.ts` 16–17). Lifecycle: **LEGACY_SUPPORTED**, still wired.
- `blood_moon` is a registry placeholder (`mapModifiers.ts` 260–268) **and** a spikes alias in the same WX block (6697–6700). Do not delete.
- Shop UI: “Multi-tier Doka packages are retired” (`AdminDashboard.tsx` 6932–6934). Canister still seeds `pkg_10`…`pkg_1_6m` (`admin.mo` 265–282); last-row delete is blocked (`main.mo` 1105–1107). Hard delete vs KYC `packageId` is **SDEG-2026-10-25-005** (open #1083) — CRC does not twin it.
- `initiatePurchase` always `#err` (`main.mo` 1152–1169). `processPendingPurchases` returns `0` (`1338–1348`); world remount still calls it (`shopPurchase.ts`). `calculateAndAwardDoka` returns `0` (`3070–3076`). Candid **LEGACY_SUPPORTED**.
- `purchaseRecords` is an EOP map. Official client no longer writes it. Do not drop the stable.

### Achievements / challenges / visuals / telemetry / persist leftovers

- Fifteen default feats all `active=true` (`admin.mo` 309–326). Delete-with-progress sets `active=false` (`main.mo` 2397–2404). Unlock rejects retired (`2472–2473`). Claim does **not** check `active` and pays **current** `dokaReward` (`2517–2550`).
- `boss_defeated_${bossId}` is emitted (`victoryAchievements.ts` 41–44) but not in `knownAchievementCondition` (`adminGuard.mo` 515–530). Fails closed. Not a catalog id to delete.
- Challenges: `easy_1`…`legendary_3` (`challengeCompletion.ts` 44–109). Session-only. All used.
- Visuals: `getPersistedPiecePattern` → unknown `pieceType` uses king.front (`pieceArt.ts` 653–658). Sprite URL catalog unused in world (`adminVisualStatus.ts`). `adminDeletePlayerSpriteConfig` does not touch Character (`main.mo` 854–860). `pixelPattern` JSON is still a required Character text field.
- Numbered boss pixels `boss_1`…`boss_12` are the unknown-id fallback (`enemyPixelPatterns.ts` 430–431). Named keys exist for the seven wave-2 bosses only. Do not delete numbered keys.
- Telemetry: `longHorizonSim.ts` reports `available: false`. No actor counters to remove.
- CharacterStats remains 12 fields including unread-in-combat `evasion` / `resilience` (`main.mo` 147–160). `backend_extended` still has `wp`/`wr`/`scp`. Optional `bloodBalance` / `covenantBuff` / `shrineCount` have no official `updateSessionState` caller. None of these are removable without an EOP later file after `20260901`.

## What this run will not do

- Remove or remap any catalog / character / Candid id
- Edit `OLD_SPELL_IDS`, `BOSS_RUSH_ROOMS`, AdminLib seeds, or WorldExploration
- Clone SDA lifecycle-enum work, CDA family/kit work, SDEG shop-package helpers, or Wave-3 `second_lament` kits
- Classify any persistent id SAFE_TO_REMOVE

Implementers pick CRC ids through the usual human / orchestrator path. First cuts if a human asks: **001** (Strike off the purge list) then **004** (`weeping_pawn_2` alias or real id) — both are compatibility fixes, not deletions.

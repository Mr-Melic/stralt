# Architecture

Intent: one Motoko canister is the source of truth for characters, Doka, config, and rewards. The React client owns live combat, map generation, and presentation. Bindgen (`src/frontend/src/backend.ts`) is the typed contract between them.

```
Internet Identity
        │
        ▼
   App.tsx  ── auth / profile / version gate / PostBattleRecap
        │
        ▼
   GameFlow  ── selection → creation → world
        │
        ├─ WorldExploration   (canvas, combat, portals)
        ├─ src/frontend/src/engine/*   (pure combat helpers)
        └─ TanStack Query hooks ──► backend actor
                                        │
                                        ▼
                              src/backend/main.mo
```

## Canonical vs stale paths

| Use this | Do not treat as current |
| :--- | :--- |
| `src/backend/main.mo` | `backend_extended/main.mo` (15-field stats, dfx-only) |
| `src/frontend/src/backend.ts` + `src/frontend/src/declarations/` | Root `declarations/backend/backend.did` (still has `wp`/`wr`/`scp`) |
| Root `mops.toml` (moc 1.11.2, migrations chain) | `src/backend/mops.toml` (older moc 1.9.0, no migrations) |
| Frontend `EnemyConfig` in `types/gameTypes.ts` (admin spawn template) | `src/backend/types/common.mo` `EnemyConfig` (runtime combat template — different fields) |

`src/backend/mixins/*` are unused scaffolds. `src/backend/lib/admin.mo` is the live helper for default configs and admin CRUD.

## Persistence

The actor is a default-persistent Motoko actor (`--default-persistent-actors`). State is top-level `let`/`var` maps.

| Store | Key | Authority |
| :--- | :--- | :--- |
| `characterSlots` | Principal → 3 slots | Character progress |
| `dokaBalances` | Principal → Nat | **Only** Doka store. Not a field on `Character` |
| `userProfiles` | Principal | Display name + `uiLayout` JSON blob |
| `buffInventories` | `"principal#slot"` | Buff shop items |
| `achievementProgress` | `"principal#achievementId"` | Unlock / claim |
| `bossRushStates` | `"principal#slot"` | Current / best room |
| `dungeonRecords` | Principal | Chain depth / maps |
| Config maps | Text ids | Enemies, regions, spells, bosses, shop, ads |

**Not persisted across upgrades:** `chatMessages` (capped at 200, in-memory by design).

Frontend `localStorage` is cache or UI-only. Backend wins on conflict:

| Cache key | Backend winner |
| :--- | :--- |
| `{userId}_slot{N}_pbv_active_spells` | `Character.spellBarOrder` |
| `pbv_panel_layout_{userId}` | `UserProfile.uiLayout` via `saveUserUiLayout` |
| `pbv_tier_spawn_config` | `getTierSpawnConfig` (hydrated on world mount) |

Exceptions still living only in `localStorage`: `pbv_boss_configs` (admin hook comment), some achievement counters, chat channel prefs.

## Character contract

Slots are `1 | 2 | 3`. `Character` required fields: `name`, `pieceType`, `level`, `experience`, `stats`, `pixelPattern`, `colors` (max 16), `rotation`, `spellLevelKeys`, `spellLevelValues`. Optional session fields: `bloodBalance`, `covenantBuff`, `shrineCount`, `activeSpells` (max 8), `spellBarOrder` (max 8), `bossRushMasterComplete`.

### CharacterStats (12 fields)

Persisted type in `src/backend/main.mo` (lines 117–130). WP / WR / SCP are gone.

| Field | Meaning |
| :--- | :--- |
| `hp` | Current hit points. `updateCharacter` cap: `level * 200 + 100` |
| `ap` / `mp` | Action / movement points. `updateCharacter` cap: 20 |
| `atk` | Physical attack |
| `res` | Resistance — reduces **all** incoming damage, including DoT |
| `sp` | Spell Power — increases spell damage / heal % |
| `sr` | Spell Resistance — reduces incoming spell damage; excludes DoT |
| `chc` | Crit chance % |
| `init` | Initiative (higher acts earlier) |
| `resilience` | Persist-only combat stat |
| `evasion` | Persist-only combat stat |
| `killCount` | Required on every Candid `CharacterStats` payload. Cannot decrease |

TypeScript mirrors this in `src/frontend/src/backend.ts` and `types/gameTypes.ts` (`CharacterStatFields`). All values are `bigint` on the wire.

Creation defaults (`CharacterCreation.tsx`):

```ts
{
  hp: 100n, ap: 10n, mp: 5n, atk: 15n, res: 10n,
  evasion: 5n, init: 10n, sp: 8n, sr: 5n,
  resilience: 8n, chc: 5n, killCount: 0n,
}
```

`updateCharacter` also rejects a **decreasing** `level`. Empty slot → error. Missing slot map → error.

## Public canister surface

Auth: `mo:caffeineai-authorization`. Roles `#admin | #user | #guest`. First non-anonymous caller of `getUserRole` becomes admin (`AccessControl.initialize`). Password admin is removed. Most writes require `#user` or `#admin`. Banned principals are blocked on purchases, buffs, achievements, boss rush, and Doka awards.

### Player

| Method | Notes |
| :--- | :--- |
| `createCharacter(slot, character)` | Slots 1–3; fails if occupied |
| `updateCharacter(slot, character)` | Full record replace + validation above |
| `deleteCharacter(slot)` | |
| `getCharacterSlots` / `getCharacter` / `getCharacterStats` | Caller-scoped |
| `renameCharacter(slot, newName)` | 1–20 chars, unique per account, **100 Doka** from `dokaBalances` |
| `setSpellBarOrder(slot, spellIds)` | Drops unknown ids; keeps max 8 |
| `saveActiveSpells` / `updateSessionState` / `getSessionState` | Session fields on `Character` |
| `saveKillCount(slot, kills)` | Increments `stats.killCount`. Hook exists; no UI caller yet |
| `applyRewards(slot, dokaDelta, xpDelta)` | **Atomic** XP + level + Doka. See reward funnel |
| `saveBattleStats(...)` | HP/AP/MP/atk/res/init + spell levels. `dokaBalance` arg writes `dokaBalances` (compat) |
| `getCallerDokaBalance` / `getDokaBalance` | Same per-principal map |
| `upgradeSpell(slot, spellId)` | Spends Doka |
| `getBuffCatalog` / `purchaseBuff` / `useBuffItem` | |
| `markAchievementUnlocked` / `claimAchievementReward` | |
| `sendMessage` / `getMessages` | Chat; lost on upgrade |
| `getLeaderboard` | Top 50 by level |

### Rewards (`applyRewards`)

```
newXp = experience + xpDelta
while newXp >= 100 * 2^level:
    newXp -= 100 * 2^level
    level += 1
dokaBalances[caller] += dokaDelta
```

Deltas are `Nat` (non-negative). Frontend `resolveBattleRewards` clamps to `>= 0` then calls this once.

### Admin (gated)

CRUD for enemy / region / sprite / spell / map-modifier / shop / achievement / boss / ad-box configs, plus bans, Doka grants, version / changelog, color palette, boss-rush config. Reads of most configs are public queries.

### OQL

`schema()` and `execute(qJson)` are included via `mo:caffeineai-oql/Expose` at the **end** of `main.mo` so every persisted `let` exists first. Player collections are scoped; admin configs are controller-only.

## Frontend flow

`main.tsx` wraps TanStack Query + Internet Identity. Viewport `< 768px` is blocked (`SmallScreenGuard`).

`App.tsx` (`APP_VERSION = "v164"`):

1. Version mismatch → wipe `localStorage` except `pbv_tier_spawn_config` / `pbv_levelup_config` → reload.
2. No identity → `LandingPage`.
3. Profile fetch timeout 8s → treat as no profile.
4. No profile → `ProfileSetup` (must send `{ name, uiLayout: "" }`).
5. Profile present → `GameFlow` + root `PostBattleRecap`.

`GameFlow` stages: `"selection"` → `"character"` → `"world"` (canvas + `ChatPanel` + stone top bar).

### Character create

`CharacterCreation.handleSave` builds a full `Character` (including `killCount: 0n`) and calls `createCharacter` / `updateCharacter`. Extra frontend-only fields such as `dokaBalance` are **dropped** by the bindgen serializer — they never reach the canister.

### Battle → recap

1. Combatants mutate through `engine/combatantStore.ts` (atomic roster + turn-order + mirrors).
2. Deaths go through `engine/deathPipeline.ts` (10-step, idempotent). Per-kill code **must not** call `resolveBattleRewards`.
3. Victory: `WorldExploration` builds recap locally, calls `onShowBattleSummary` **first**, then `resolveBattleRewards` → `actor.applyRewards`.
4. Recap popup is only mounted in `App.tsx` (z-index 9999) so it survives the battle → exploration transition.

### Portals

`engine/portalRules.ts` `filterRunPortals`: free exploration keeps generator candidates; dungeon / boss-rush keeps only `"progression"` and only when the map is cleared. Portal checks must read `inBattleRef`, not stale `inBattle` state.

## Combat engine (`src/frontend/src/engine/`)

These modules are React-free. `WorldExploration.tsx` remains the orchestrator and still owns refs/setters.

| Module | Job |
| :--- | :--- |
| `combatantStore.ts` | Atomic add/remove/patch/sync of combatants + turn order |
| `turnQueue.ts` | Index-safe removal from the turn queue |
| `deathPipeline.ts` | Idempotent death sequence + optional reconcile hook |
| `spellEngine.ts` | Pure player / enemy spell resolution |
| `targeting.ts` | Preview + live cast gate from **explicit** spell metadata |
| `occupancy.ts` | Tile passability, pushback, attract |
| `battleSetup.ts` | Liveness / remaining-hostile predicates |
| `combatMath.ts` | Spawn clustering, damage helpers |
| `progression.ts` | Level-derived base stats (player / enemy / summon) |
| `mapGen.ts` | Map archetypes (do not casually rewrite) |
| `portalRules.ts` | Run-mode portal filter |
| `summonSpawn.ts` / `summonAI.ts` / `summonExecutor.ts` / `summonIntegration.ts` | Summon lifecycle; lifespan decrements on the summon's **own** turn |

Spell targeting source of truth: `SpellConfig.targetType`, `minRange` / `maxRange`, `lineOfSight`, `linear`, `diagonal`, `freeCells`, `areaRadius`, `isBarrier`. `spell.name` is UI/log only.

## Auth, admin, debug

- Actor hook: `hooks/useActor.ts`. `VITE_USE_MOCK=true` returns the shared `mocks/backend.ts` singleton.
- Admin UI is lazy-loaded. Button is `isAdmin && onOpenAdmin`. Backend still enforces `#admin` on writes.
- Debug overlay lives in `ChatPanel` (always mounted on the world stage). **Shift+D** opens the Debug channel. Ring buffer (`debug/debugLogger.ts`) runs in production; console output is dev-only. Click-trace / geometry overlay are `import.meta.env.DEV`.

## Migrations

`mops.toml` `[canisters.backend.migrations] chain = "src/backend/migrations"`. Current module: `src/backend/migrations/20260803_185500.mo`.

- Inlined `OldActor` / `NewActor` (no project type imports).
- This build: `NewActor = OldActor`; upgrade returns `old` unchanged.
- Fresh install (`BUFF_CATALOG.size() == 0`) seeds default buffs, enemy names, ad boxes, `appVersion = "v163"`.
- Current `main.mo` is a plain `actor {` — it does **not** use `(with migration = Migration.run)`. That annotation exists only on the legacy `backend_extended` actor.

A deployed canister still running the old 15-field `CharacterStats` will reject 12-field saves until it is upgraded so the migration / type change actually lands on-chain.

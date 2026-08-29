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
| `{userId}_slot{N}_pbv_spell_levels` | `Character.spellLevelKeys` / `spellLevelValues` via `upgradeSpell` |
| `pbv_panel_layout_{userId}` | `UserProfile.uiLayout` via `saveUserUiLayout` |
| `pbv_tier_spawn_config` | `getTierSpawnConfig` (hydrated on world mount) |

Exceptions still living only in `localStorage`: `pbv_boss_configs` (admin hook comment), some achievement counters, chat channel prefs.

## Character contract

Slots are `1 | 2 | 3`. `Character` required fields: `name`, `pieceType`, `level`, `experience`, `stats`, `pixelPattern`, `colors` (max 16), `rotation`, `spellLevelKeys`, `spellLevelValues`. Optional session fields: `bloodBalance`, `covenantBuff`, `shrineCount`, `activeSpells` (max 8), `spellBarOrder` (max 8), `bossRushMasterComplete`.

### CharacterStats (12 fields)

Persisted type in `src/backend/main.mo` (lines 123–136). WP / WR / SCP are gone.

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
| `createCharacter(slot, character)` | Slots 1–3; fails if occupied. Clears slot-scoped boss-rush state |
| `updateCharacter(slot, character)` | Full record replace + validation above |
| `deleteCharacter(slot)` | Also clears slot-scoped boss-rush state |
| `getCharacterSlots` / `getCharacter` / `getCharacterStats` | Caller-scoped |
| `renameCharacter(slot, newName)` | 1–20 chars, unique per account, **100 Doka** from `dokaBalances` |
| `setSpellBarOrder(slot, spellIds)` | Drops unknown ids; keeps max 8 |
| `saveActiveSpells` / `updateSessionState` / `getSessionState` | Session fields on `Character` |
| `saveKillCount(slot, kills)` | Increments `stats.killCount`. Hook exists; no UI caller yet |
| `applyRewards(slot, dokaDelta, xpDelta)` | **Atomic additive** XP + level + Doka. `Nat` only — cannot subtract |
| `saveBattleStats(...)` | Absolute HP/AP/MP/atk/res/init + XP + Doka snapshot. **Ignores** spell-level arrays (`upgradeSpell` owns those) |
| `getCallerDokaBalance` / `getDokaBalance` | Same per-principal map |
| `upgradeSpell(slot, spellId)` | Spends Doka |
| `getBuffCatalog` / `purchaseBuff` / `useBuffItem` | |
| `markAchievementUnlocked` / `claimAchievementReward` | Claim is a Doka delta — enqueue on the persist lock |
| `initiatePurchase` / `processPendingPurchases` | Nine positional Text args; 60s auto-complete |
| `getBossRushState` / `setBossRushProgress` / `completeBossRushRoom` / `resetBossRush` | Slot-scoped; query `userId` must be the caller principal |
| `sendMessage` / `getMessages` | Chat; lost on upgrade |
| `getLeaderboard` | Top 50 by level |

### Rewards (`applyRewards`)

Canonical curve (must match `utils/xpCurve.ts` `xpForNextLevel`):

```
threshold(N) = 100 * 2^(N-1)     // 1→2 = 100, 2→3 = 200, 3→4 = 400, …
newXp = experience + xpDelta
while newXp >= threshold(level):
    newXp -= threshold(level)
    level += 1
dokaBalances[caller] += dokaDelta
```

`100 * 2^N` is off-by-one and silently blocks intended level-ups. Deltas are `Nat` (non-negative). Frontend `resolveBattleRewards` / `persistIncrementalRewards` clamp to `>= 0` then call this.

Victory XP: explicit grant if `> 0`, else sum of defeated `level * 20`, else `characterLevel * 20` (`computeVictoryExp`). Dungeon chain multipliers already baked into the recap must pass `PREAPPLIED_REWARD_MULTIPLIER` (`1`) so Doka is not squared.

### Progress persist lock

`createProgressPersist` (`utils/progressPersist.ts`) is the world-session queue. Recap / shop / heal become usable while `applyRewards` is still in flight. An absolute `saveBattleStats` snapshot taken then overwrites the just-credited wallet.

| Kind | Writer | Typical callers |
| :--- | :--- | :--- |
| Additive credit | `applyRewards` | Victory, portal +10 XP, world Doka pickups, boss-rush room clear |
| Paid spend | `upgradeSpell` | Spellbook. Deducts from `dokaBalances`; sole writer of spell levels |
| Paid credit | `claimAchievementReward` | Feat claim. Returns granted Nat |
| Paid credit | `processPendingPurchases` | Shop packages aged ≥ 60s |
| Absolute snapshot | `saveBattleStats` | Recap heals, item-shop spends, death 20% XP / 40% Doka |

Rules verified in `WorldExploration` + the persist unit tests:

1. Enqueue **both** credits and snapshots on `progressPersistRef`.
2. `commit({ doka, xp, level })` inside the queued fn after the canister write.
3. `hydrateWhenIdle` returns false while `pending > 0` — do not copy UI over an in-flight credit.
4. Live UI **adds deltas** (`applyShopCreditDeltaToUi`). Replacing with an absolute backend read refunds a heal/shop spend the player already applied locally.
5. After world hydrate, `shouldApplyCallerDokaHydrate` ignores `['callerDokaBalance']` refetches (claim invalidate / window focus).
6. After death has fired, `shouldApplyVictoryLiveHydrate` is false — a late `applyRewards` hydrate must not restore HP or unpenalized XP.

Death penalty cannot use `applyRewards` (Nat-only add). `persistDeathPenalty` writes the already-reduced absolute XP/Doka through `saveBattleStats`, then `raiseUiAfterDeathPersist` so a short optimistic UI cannot overwrite the post-credit cut.

| Helper | Path |
| :--- | :--- |
| `createProgressPersist` | `utils/progressPersist.ts` |
| `resolveBattleRewards` / `computeVictoryExp` / `PREAPPLIED_REWARD_MULTIPLIER` | `utils/rewardResolver.ts` |
| `persistIncrementalRewards` / `readApplyRewardsOk` | `utils/applyRewardsResult.ts` |
| `persistDeathPenalty` / `shouldApplyVictoryLiveHydrate` | `utils/deathPenalty.ts` |
| `creditPendingPurchasesThroughPersist` | `utils/shopPurchase.ts` |
| `creditAchievementRewardThroughPersist` | `utils/achievementReward.ts` |
| `persistSpellUpgrade` | `utils/spellUpgrade.ts` |
| `shouldApplyCallerDokaHydrate` | `utils/dokaBalanceQuery.ts` |
| `persistBossRushRoomClear` / `resolveBossRushQueryPrincipalText` | `hooks/bossRushProgress.ts` |

### Shop and item purchases

`initiatePurchase` takes **nine positional `Text` args** (`utils/shopPurchase.ts` `buildInitiatePurchaseArgs`). A customer-data object is rejected by Candid and no purchase record is created.

Backend `_autoCompletePendingPurchases` credits packages with `status == "pending"` older than 60s (`PENDING_PURCHASE_CREDIT_DELAY_MS`). The player must call `processPendingPurchases`. That credit **and** the following `commit` go through `creditPendingPurchasesThroughPersist`. Shop-credit timers live in `shopCreditTimersRef` — `cleanupBattle` clears `pendingTimeoutsRef` on every portal/death/victory.

`BuffShop` is hosted in `WorldExploration` (not `GameFlow`). A GameFlow-only local deduct + no-op `onUseItem` refunds the spend on the next wallet refetch and makes bought items unusable.

### Admin (gated)

CRUD for enemy / region / sprite / spell / map-modifier / shop / achievement / boss / ad-box configs, plus bans, Doka grants, version / changelog, color palette, boss-rush config. Reads of most configs are public queries.

### OQL

`schema()` and `execute(qJson)` are included via `mo:caffeineai-oql/Expose` at the **end** of `main.mo` so every persisted `let` exists first. Player collections are scoped; admin configs are controller-only.

## Frontend flow

`main.tsx` wraps TanStack Query + Internet Identity. Viewport `< 768px` is blocked (`SmallScreenGuard`).

`App.tsx` (`APP_VERSION = "v163"`):

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
2. Deaths go through `engine/deathPipeline.ts` (10-step, idempotent). Per-kill code **must not** call `resolveBattleRewards`. `selectDefeatedEnemiesForRewards` prefers the attributed-kill roster — `recheckVictory` used to pass `[]`.
3. Victory: `WorldExploration` builds recap locally, calls `onShowBattleSummary` **first**, then enqueues `resolveBattleRewards` → `actor.applyRewards` on the persist lock.
4. Challenge XP/Doka must be read from **live refs** (`liveBattleChallengePersistEntries`). `handleBattleEnd` omits `challengeAccepted` / `currentChallenge` from its deps; a stale `accepted === false` drops the 400–1000 XP the panel advertised.
5. Recap popup is only mounted in `App.tsx` (z-index 9999) so it survives the battle → exploration transition. The full-screen wrapper is `pointer-events: none` (the card itself is `auto`) — lava/spike tiles under the recap still receive input while persist is in flight.
6. Both React `inBattle` **and** `inBattleRef` must be false after `handleBattleEnd` / room clear / death. `cleanupBattle` only clears the ref; leaving React state true blocks the next fight (`shouldAllowBattleTrigger`).

### Boss rush persist / resume

`bossRushStates` is keyed `principalText#slot`. `getBossRushState(userId, slot)` returns `(0,0,0)` unless `userId == caller`. GameFlow `userId` is the **display name** — `Principal.fromText("VampireBob")` throws. Query with the authenticated II principal (`resolveBossRushQueryPrincipalText`).

On room clear (`persistBossRushRoomClear` + `persistBossRushRewardsThroughLock`):

1. Write `currentRoom` (`setBossRushProgress` or `resetBossRush` on the final room) **before** `applyRewards`.
2. Call `completeBossRushRoom(slot, roomIndex, 0, 0)` — progress / master flag only. Wallet/XP still go through `applyRewards`.
3. Both writes stay on the persist lock so a lava death cannot jump the queue and let the credit land after the penalty.
4. `createCharacter` / `deleteCharacter` call `_clearBossRushForSlot` so a new occupant cannot resume mid-tree.
5. Lava/spike death calls `abortBossRush` → `resetBossRush` (`currentRoom = 0`). A late in-flight room-clear write is superseded (`wasSuperseded`).

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

`mops.toml` `[canisters.backend.migrations] chain = "src/backend/migrations"`. Current module: `src/backend/migrations/20260827_000000.mo`.

- Inlined `OldActor` / `NewActor` (no project type imports).
- Legacy → enhanced-orthogonal upgrade: `NewActor` drops transients that `main.mo` now marks `transient` (`BUFF_CATALOG`, `DEFAULT_ENEMY_NAMES`, `ROLE_CHANGE_MIN_NS`, `chatMessages`, `nextChatId`, `enemyNamesInitialised`). Player/config maps copy through unchanged.
- Fresh-install seeds live in `main.mo` `do { }` blocks (empty `appVersion` → `"v163"`, default game config, etc.) — not in the migration module.
- Current `main.mo` is a plain `actor {` — it does **not** use `(with migration = Migration.run)`. That annotation exists only on the legacy `backend_extended` actor.

A deployed canister still running the old 15-field `CharacterStats` will reject 12-field saves until it is upgraded so the type change actually lands on-chain.

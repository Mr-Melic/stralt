# Setup and troubleshooting

## Environment

| Need | Notes |
| :--- | :--- |
| Node `>=16`, pnpm `>=7` | Root `package.json` engines |
| Motoko via Caffeine | `caffeine check --fix`, `caffeine build` |
| `dfx` | Often **missing** in this container. `mops build` then exits 127 |
| Frontend env | `src/frontend/env.json` (`backend_host`, `backend_canister_id`, II origin). Copied to `dist/` on build |

Verified from repo root:

```bash
pnpm typecheck
pnpm fix
pnpm build
pnpm bindgen    # after Candid / Motoko public-type changes
```

Frontend scripts (`src/frontend/package.json`): `dev` (Vite), `build`, `typecheck`, `check` / `fix` (Biome).

Local UI without a canister:

```bash
VITE_USE_MOCK=true pnpm --filter '@caffeine/template-frontend' dev
```

`useActor` then returns the shared `mocks/backend.ts` instance so every hook sees the same in-memory actor.

## Bindgen and Candid

After changing public Motoko types or methods:

1. Rebuild the backend so `src/backend/dist/backend.did` updates.
2. Run `pnpm bindgen`.
3. Commit `src/frontend/src/backend.ts`, `backend.d.ts`, and `src/frontend/src/declarations/*` together.

Trust `src/frontend/src/backend.ts`. The root `declarations/backend/` tree is a stale 15-field snapshot (`wp` / `wr` / `scp`) and will mislead hand-written clients.

## Common pitfalls

### Character save rejected (missing field)

Candid requires **all 12** `CharacterStats` fields. Omitting `killCount` (or any other field) fails at serialize time, before Motoko runs.

Fix: always send the full record. Carry `character.stats.killCount` or `0n` on create.

`updateCharacter` then applies Motoko checks:

- `hp <= level * 200 + 100`
- `ap <= 20`, `mp <= 20`
- `level` and `killCount` cannot decrease
- `colors.length <= 16`
- slot must already exist

### Profile create rejected

`saveCallerUserProfile` writes the payload as-is (no field merge). `{ name }` without `uiLayout` fails Candid. New accounts must send `uiLayout: ""`.

### Rewards applied twice, wiped, or not at all

- Persist **credits** (victory, portal XP, pickups, boss-rush room) only with `applyRewards` (`rewardResolver.ts` / `applyRewardsResult.ts`).
- Persist **penalties and spends** with `saveBattleStats` through the persist lock. `applyRewards` is `Nat`-only and cannot subtract.
- Do **not** call `updateCharacter` to write reward XP/Doka (or to debit the wallet — `Character` has no `dokaBalance`).
- Do **not** call `resolveBattleRewards` per kill. Death pipeline attributes kills into a list; victory calls the resolver once.
- Enqueue every credit **and** every `saveBattleStats` on `createProgressPersist`. A recap heal/shop click that snapshots the pre-credit wallet wipes the grant.
- Recap must stay mounted in `App.tsx`. Showing it from `WorldExploration` loses it on the battle → map transition.

`saveBattleStats` writes HP / AP / MP / atk / res / init / XP and the per-principal `dokaBalances` map. It **ignores** the spell-level arrays — `upgradeSpell` is the sole writer. It is not the battle-reward funnel.

### `dokaBalance` on `Character`

The field was removed from the Motoko `Character` type. Frontend `gameTypes.Character.dokaBalance` is a convenience alias. Bindgen drops unknown fields. Balance APIs: `getCallerDokaBalance`, `applyRewards`, admin grants.

### Recap heal refunds a just-claimed or just-won wallet

`saveBattleStats` is an absolute write. After victory / shop credit / feat claim, the recap is already clickable. A heal that reconstructs from the pre-credit snapshot (or from `getCallerDokaBalance` after a query invalidate) persists the old balance.

Fix: run the credit on the persist lock and `commit` the post-credit Doka. Add the granted delta onto the live UI (`applyShopCreditDeltaToUi`). Do not `invalidateQueries(['callerDokaBalance'])` after a persist-lock claim (`shouldInvalidateCallerDokaAfterClaim`). Once the world is hydrated, `shouldApplyCallerDokaHydrate` must stay false — window-focus refetch is the same class of bug.

### Shop purchase never credits / nine-arg Candid reject

`initiatePurchase` is nine positional `Text` fields (`packageId`, name, surname, email, address, city, country, postal, proof URL). Passing one customer object fails at serialize time.

Credits are **not** instant: backend auto-completes pending records ≥ 60s. The client must call `processPendingPurchases` via `creditPendingPurchasesThroughPersist`. Shop-credit timers must **not** live in `pendingTimeoutsRef` — `cleanupBattle` clears that set on portal/death/victory (`shopCreditUsesBattleTimeoutSet` is false).

### Item shop spend refunds and items do nothing

`BuffShop` returns `null` unless `isOpen === true`. Host it in `WorldExploration` so buys go through `saveBattleStats` on the persist lock and uses reach `handleUseItem`. A `GameFlow`-only local deduct is restored on the next `getCallerDokaBalance` hydrate.

### Challenge XP advertised but never persisted

`handleBattleEnd` is a `useCallback` that omits `challengeAccepted` / `currentChallenge`. Pass the live accept flag and challenge from refs (`liveBattleChallengePersistEntries`). Persist both `dokaReward` **and** `xpReward` (hard/legendary objectives show 400–1000 XP).

### Spell upgrade wiped by the next heal

`upgradeSpell` must enqueue on the persist lock and update `spellLevelsRef` **inside** that queued fn, before any later `saveBattleStats`. The canister now ignores heal/death spell-level arrays, but a local map rollback still shows the pre-upgrade level until reload. Deduct Doka as a UI delta (`dokaBalance - cost`); do not replace the wallet with the absolute post-upgrade read.

### `killCount` never increments in the client

`useSaveKillCount` is defined in `useLeaderboardQueries.ts` and is unused. World saves only **preserve** the current count. Leaderboard kill totals will stall until a caller invokes `saveKillCount`.

### Deployed canister still on 15-field stats

Source on disk can be 12-field while the live canister is not. Symptom: Candid / upgrade errors on create or update. Fix: upgrade the canister so `src/backend/migrations/20260827_000000.mo` (and the new type) actually run. Restarting the frontend is not enough.

### `dfx.json` vs `mops.toml`

`dfx.json` → `backend_extended/main.mo` (legacy, 15-field).  
Root `mops.toml` → `src/backend/main.mo` (canonical).

Do not `dfx deploy` expecting the current game actor unless `dfx.json` is updated.

### OQL / `caffeine check` M0010

`caffeineai-oql@0.4.0` is a real dependency and **is imported** at the bottom of `main.mo`. Some `caffeine check` toolchains fail with `M0010 package not defined` even when `mops sources` resolves the package. If check fails on OQL only, it is a toolchain mismatch — do not delete the `Expose` block without a replacement plan.

### Chat vanished after upgrade

Expected. `sendMessage` / `getMessages` are in-memory (`main.mo` comment at the chat block).

### Version bump logs everyone out

Changing `APP_VERSION` in `App.tsx` clears almost all `localStorage` and reloads. Keep `pbv_tier_spawn_config` and `pbv_levelup_config` if you add another exception. Bump `CHANGELOG_ITEMS` in the same change.

### First user is admin

`getUserRole` calls `_ensureRegistered` → `AccessControl.initialize`. The first non-anonymous Internet Identity principal becomes `#admin`. Later callers are `#user`. `assignUserRole` is admin-only and rate-limited to once per 30 seconds.

### Circular hook imports

`hooks/useQueries.ts` is a barrel. Importing it from another file under `hooks/` creates a cycle. Import the specific hook file instead.

### Two `EnemyConfig` types

| Type | Fields | Use |
| :--- | :--- | :--- |
| Admin / frontend `EnemyConfig` | `hp`, `ap`, `mp`, `initStat`, level range, `regions`, `spriteUrl` | Spawn templates, admin UI |
| `types/common.mo` `EnemyConfig` | `damage`, `res`, `sp`, `sr`, `chc`, `init`, rewards, `side` | Runtime combat template |

Do not pass one into an API expecting the other.

### Spell bar silently shrinks

`setSpellBarOrder` drops ids not present in `spellLevelKeys`. It does not return an error for unknown ids. Max 8.

### Debug overlay missing

On the world stage, press **Shift+D** (ignored while typing in an input). The Debug channel is hidden from the default channel list but the panel is always mounted. Canvas crash UI (`CanvasErrorBoundary`) has its own “Copy Debug Report” at z-index 99999.

### Portal / death double-fire

- Portal interaction must read `inBattleRef` / `transitionInProgressRef`.
- Transition lock has a 5s timeout and must release in `finally`.
- Player death uses `deathTriggeredRef` so the death-realm flow cannot run twice.
- Re-arm both death guards (`armDeathGuards`) after Death Realm entry or Respawn. Leaving them set skips the next exploration death (0 HP, no penalty, no Game Over).

### Lava death after victory / portal refunds the penalty

The recap wrapper in `App.tsx` is `pointer-events: none` (world tiles still receive input); a portal swap has no overlay. `applyRewards` can still be in flight when lava/spikes fire. The death write already penalized the post-credit committed snapshot. Applying the post-await live hydrate (`shouldApplyVictoryLiveHydrate`) restores HP and unpenalized XP; `hydrateWhenIdle` then copies that into committed and the next persist refunds the death.

### Boss rush resume / farm / stuck between rooms

- `getBossRushState` requires `userId == caller` as a **principal**. Pass the II identity text (`isPrincipalText`), not the profile display name.
- Persist `currentRoom` on room clear **before** `applyRewards`, both on the persist lock. Otherwise a reload re-enters room 0 and farms the same credit.
- `createCharacter` / `deleteCharacter` clear slot-scoped progress. Lava/spike death must `abortBossRush` so a late room-clear write cannot resume mid-tree.
- After a room clear, `setInBattle(false)` as well as `inBattleRef = false`. `cleanupBattle` only clears the ref; React `inBattle === true` blocks `checkBattleTrigger` and room 2 never starts.

### Motoko / frontend level-up floors differ

`progression.getPlayerBaseStats` uses floors AP=8, MP=4 (plus optional `LevelUpConfig` growth). Character creation defaults AP=10, MP=5. Battle init prefers the formula when they diverge — do not “fix” one without checking the other.

## Operational checklist (canister upgrade)

1. Confirm `src/backend/main.mo` and `migrations/` match the intended `CharacterStats` (12 fields, `killCount` present, no `wp`/`wr`/`scp`). Current chain module: `20260827_000000.mo`.
2. Confirm `applyRewards` uses `100 * 2^(N-1)` (same as `utils/xpCurve.ts`).
3. `caffeine check --fix` then `caffeine build` (or the project’s deploy pipeline). Do not use `dfx` against `backend_extended` by accident.
4. `pnpm bindgen` and commit generated client files.
5. Smoke: create character (full stats), play, win a battle **and** a boss-rush room, confirm recap + wallet/XP moved **once**; then heal once and confirm the credit was not refunded.
6. Smoke: accept a battle challenge, complete it, confirm advertised XP landed. Die on lava after a recap — HP stays down and the 20/40 penalty sticks.
7. Confirm chat empty after upgrade is expected; Doka / slots / configs / boss-rush `currentRoom` are not.

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

### Rewards applied twice or not at all

- Persist XP/Doka **only** with `applyRewards` (`src/frontend/src/utils/rewardResolver.ts`).
- Do **not** call `updateCharacter` to write reward XP/Doka.
- Do **not** call `resolveBattleRewards` per kill. Death pipeline attributes kills into a list; victory calls the resolver once.
- Recap must stay mounted in `App.tsx`. Showing it from `WorldExploration` loses it on the battle → map transition.

`saveBattleStats` still exists for HP / caps / spell levels. Its `dokaBalance` argument writes the **per-principal** `dokaBalances` map. It is not the battle-reward funnel.

### `dokaBalance` on `Character`

The field was removed from the Motoko `Character` type. Frontend `gameTypes.Character.dokaBalance` is a convenience alias. Bindgen drops unknown fields. Balance APIs: `getCallerDokaBalance`, `applyRewards`, admin grants.

### Some `WorldExploration` saves zero combat stats

Several `updateCharacter` sites (spell-bar / portal XP / heal pickups) still hardcode `atk`, `resilience`, and `evasion` to `0n` while carrying `killCount`. That is a real overwrite risk — do not copy that pattern for new saves. Carry the existing `character.stats` values.

### `killCount` never increments in the client

`useSaveKillCount` is defined in `useLeaderboardQueries.ts` and is unused. World saves only **preserve** the current count. Leaderboard kill totals will stall until a caller invokes `saveKillCount`.

### Deployed canister still on 15-field stats

Source on disk can be 12-field while the live canister is not. Symptom: Candid / upgrade errors on create or update. Fix: upgrade the canister so `src/backend/migrations/20260803_185500.mo` (and the new type) actually run. Restarting the frontend is not enough.

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

### Motoko / frontend level-up floors differ

`progression.getPlayerBaseStats` uses floors AP=8, MP=4 (plus optional `LevelUpConfig` growth). Character creation defaults AP=10, MP=5. Battle init prefers the formula when they diverge — do not “fix” one without checking the other.

## Operational checklist (canister upgrade)

1. Confirm `src/backend/main.mo` and `migrations/` match the intended `CharacterStats` (12 fields, `killCount` present, no `wp`/`wr`/`scp`).
2. `caffeine check --fix` then `caffeine build` (or the project’s deploy pipeline). Do not use `dfx` against `backend_extended` by accident.
3. `pnpm bindgen` and commit generated client files.
4. Smoke: create character (full stats), play, win a battle, confirm recap + `getCallerDokaBalance` / slot XP moved **once**.
5. Confirm chat empty after upgrade is expected; Doka / slots / configs are not.

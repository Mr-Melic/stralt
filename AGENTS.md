# Project Guidance

## User Preferences

- Do not touch RAF loop, map generation, turn logic, damage math, or unrelated features.
- All fixes must be discrete, verified, and read back with real line numbers.
- Builds must end at zero TypeScript and zero lint errors.
- UI/UX must match the Ankama/Dofus-inspired carved-stone, dark slate, crimson-accented style.
- All admin and debug features must be dev-only/gated and never ship to normal players.
- All state persistence must be backend-authoritative, with localStorage as a cache only.
- All spell targeting and effect logic must use explicit metadata, never name-based heuristics.
- All reward/recap flows must use the single atomic backend funnel and recap popup at app root.
- Debug overlay must be always reachable, even during loading/crash.

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **check**: `pnpm check` (Biome: unused locals and exhaustive hook deps are **errors**. Same as Caffeine frontend `[check]`. Do not skip.)
- **fix**: `pnpm fix` (then re-run `pnpm check`)
- **build**: `pnpm build`
- **motoko**: `mops check` or `caffeine check` (syntax, types, migrations, check-stable vs `.old`). Required when Motoko, migrations, mocks, or `mops.toml` change. Missing toolchain is a failure, not a skip. Do not require `caffeine build` / PocketIC unless deploying.
- **import gate**: `bash scripts/caffeine-import-gate.sh all` — `pnpm typecheck && pnpm check` then `mops check`. Treating unused-vars, hook-deps, mock TS2740, Motoko compile, or empty-canister M0263 as “pre-existing, skip” is forbidden.

## Mandatory finish gate

Before opening a PR or declaring work done: run the import gate. Frontend always. Backend when Motoko / migrations / `.old` / mocks change. See `docs/automation/CAFFEINE_IMPORT_GATES.md` and `.cursor/rules/caffeine-import-gate.mdc`.

## Learnings

- CharacterStats is 12 required fields: hp, ap, mp, sp, sr, atk, res, chc, init, resilience, evasion, killCount. No wp/wr/scp on the persisted path. Type lives at `src/backend/main.mo` lines 137–150. Bindgen: `src/frontend/src/backend.ts`.
- Character-update / create payloads must include every CharacterStats field. Omitting `killCount` fails in the Candid serializer before Motoko runs. Carry `BigInt(0)` or the existing value.
- Deployed canister can lag source: a live 15-field actor rejects 12-field saves until it is upgraded. Source-correct is not enough. The same class of lag applies to admin `SpellConfig` summon fields (`isSummon`, `summonAI`, `summonLifespan`, `summonUnitDef`) — regenerate bindgen after the Motoko rebuild.
- Canonical actor is `src/backend/main.mo` (root `mops.toml`). `dfx.json` points at missing `src/backend_extended/main.mo`; the stale 15-field actor is root `backend_extended/`. Do not `dfx deploy` expecting the current game.
- Migrations: `mops.toml` chain `src/backend/migrations`, `check-limit = 3`, empty-canister baseline `.old/src/backend/dist/backend.most`. Lex order: `20260826_000000.mo` (empty-canister genesis for Caffeine M0263), `20260827_000000.mo` (drop transients), `20260831_000000.mo` (SpellConfig summon fields + rollback stables + `adminAuditLog`). Live `main.mo` is a plain persistent `actor {` (no `(with migration = Migration.run)`). That annotation exists only on `backend_extended`. `BaseToCore.mo` is the completed mo:base→mo:core marker.
- `caffeineai-oql@0.4.0` **is** a dependency and **is imported** (`schema` / `execute` via `Expose` at the end of `main.mo`). Some `caffeine check` runs still hit M0010 (`package not defined`) even when `mops sources` resolves it — toolchain mismatch, not a missing import.
- dfx is often absent in this container — `mops build` exits 127. Use `caffeine check --fix` and `caffeine build`.
- Two EnemyConfig types: admin/frontend spawn template (`hp/ap/mp/initStat/...`) vs `types/common.mo` runtime combat template (`damage/res/sp/sr/chc/init`, no wp/wr/scp).
- Battle XP/Doka persist only through `applyRewards` (`utils/rewardResolver.ts`). Do not write rewards with `updateCharacter` or call the resolver per kill.
- `applyRewards` XP curve is `100 * 2^(N-1)` (`utils/xpCurve.ts`). `100 * 2^N` silently blocks level-ups. Experience is leftover in the current level — HUD uses `xpHudProgress`, not a cumulative subtract. Thresholds use bigint (`xpThresholdBigInt`) so level 48+ does not freeze on `MAX_SAFE_INTEGER`.
- `applyRewards` rejects `dokaDelta > 100_000` or `xpDelta > 500_000`. Official client clamps (`clampApplyRewardsDeltas`) so a Doka-Fever roll cannot drop the whole XP grant.
- `saveBattleStats` never mints: incoming Doka/XP/atk/res/init above stored are ignored. Official `clampSaveBattleStatsWrite` also keeps stored level. A stale lower client level can still downgrade the canister — do not pass Play-entry / pre-level UI after `applyRewards`.
- World wallet writes share `createProgressPersist`. Credits (`applyRewards`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`) and absolute snapshots (`saveBattleStats` heals/spends/death) must enqueue on that lock and `commit` after the canister write. Do not replace the live UI wallet with an absolute backend read after world hydrate.
- `saveBattleStats` ignores spell-level arrays — `upgradeSpell` is the sole writer. Death penalty is 20% XP / 40% Doka via `saveBattleStats` (Nat-only `applyRewards` cannot subtract).
- New profiles must send `uiLayout: ""` — `saveCallerUserProfile` does not merge fields.
- Challenge HP loss must go through `recordChallengeDamageTaken` (combat / reflect / modifiers) or `recordInBattleChallengeDamage` (lava/spikes only while `inBattleRef`). Attack Nearest and canvas `"summon"` must debit AP + `recordChallengeApSpend`.
- Persist lock starts at placeholder Doka 0. Seed only from an authoritative read/credit. Unseeded `saveBattleStats` must `resolveCommittedDokaForAbsoluteWrite`. Idle hydrate must not cut a seeded wallet (`shouldCopyIdleWalletDoka`).
- Death Realm 1.5s timer: `persistDeathPenalty` restores HP immediately. Block portals **and** encounters until the timer fires; `armDeathGuards` after realm entry / Respawn.
- `getPlayerAchievements` requires the caller Principal (`identity.getPrincipal()`), not the display name.
- `upgradeSpell` charges `spellLevelingBaseCost * 2^level` (base 10). Summon UI advertises 10× that — debit with `spellUpgradeUiSpend`.
- Dungeon-chain refs are zeroed by `cleanupMap`. Snapshot with `snapshotDungeonChain` **before** cleanup, then `decideDungeonChainPortal`. Rest-exit must re-arm depth 1 on the refs (`shouldArmDungeonChainOnRestExit`). White sanctuary portal colocates with spawn (`placeWhitePortalAtSpawn`), never `(0, 0)`.
- Portal +10 XP (`PORTAL_TRANSITION_XP`) must not update the HUD until `applyRewards` commits.
- Shop remount / no-op `processPendingPurchases` commits the persist lock only when that pair observed a gain (`shouldCommitShopCredit`). Never cut a higher lock snapshot. `upgradeSpell` then `getCallerDokaBalance` is a query — commit only when the wallet decreased.
- `completeBossRushRoom` ignores client `dokaReward`/`xpReward` (frontend already passes 0, 0). Character must exist before mutation. Room-clear `applyRewards` only after `currentRoom` actually advanced.
- Death persist HP is `respawnHpAfterDeath`: 50% of `100 * (1 + (level-1) * 0.05)`. Idle hydrate must not copy leftover XP from a lower UI level over a post-`applyRewards` level-up (`resolveHydratedXp`).
- Version-gate wipe (`utils/versionGate.ts`) keeps `pbv_tier_spawn_config`, `pbv_levelup_config`, and keys ending `_inventory`. BuffShop potions live only in `${principal}_inventory`.
- Generated maps must stay solvable: `finalizePlayableLayout` / `applyFinalizedLayout` after generateEnemies, Boss Rush preferred cells, and rest-exit. Do not skip that pass.
- Challenge: count the opening player turn (`shouldCountOpeningPlayerTurn`); overworld Doka-to-HP must not set `healUsed`. Sprite-click / Attack Nearest / summon-kit casts honor cooldown and Striker range. Sacrifice self-HP (`recordChallengeSelfHpLoss`, floor at 1) never entered `playerTakesDamage` — record the HP actually lost or Untouchable still persists.
- Combatant HP (lava/spikes, DoT/plague, player spells, enemy heal/phase) must commit through `updateCombatant`. Enemy summons use `spawnEnemySummonUnit` (`side: "enemy"`, turn type `"enemy"`). Player-side kills do not enter `applyRewards` (`countsTowardKillRewards`). Attack Nearest range/LoS uses the **player** tile (`attackNearestLiveCasterPos`), not a controlled summon. Canvas `onTouchEnd` + `onClick`: drop the synthetic click for 400ms (`shouldIgnoreClickAfterTouch`).
- Ground Doka, shrine altar, and dungeon-complete bonus must claim a one-shot id (`utils/dokaPersist.ts`) before `applyRewards`. The method is not idempotent.
- Unpaid death 20/40 lives in `localStorage` (`pbv_pending_death_penalty_slotN`). Replay compares canister XP (`experienceFromCharacterRecord`), not GameFlow's Play-entry `character.experience`. Heal/shop after a failed persist uses `applyUnpaidDeathPenaltyToWrite`.
- `upgradeSpell` cannot add a retired (`usableByPlayer=false`) spell the player never owned. Built-in spell ids cannot be deleted — retire them. `setBossRushProgress` traps if `currentRoom` decreases — use `resetBossRush`. `completeBossRushRoom` accepts `roomIndex == currentRoom` or `currentRoom - 1`.
- `sendMessage` binds `playerName` to the caller's `userProfiles` name. Viewport `< 768px` is a warning with Continue (`sessionStorage` `pbv_small_screen_continue`), not a hard block.
- Admin writes validate in `src/backend/lib/adminGuard.mo` (URL schemes, grants, JSON blobs). Ads reject `javascript:`/`data:`/`vbscript:`. Shop proof allows `data:` but not script schemes. Rollback: `adminRollbackLevelUpConfig` / `GameConfig` / `TierSpawnConfig` / `ColorPalette` / `BossRushConfig`.
- In-battle feat unlocks travel on `BattleRecapData.newlyUnlockedAchievements` (`attachRecapUnlocks`). A WorldExploration-only list never reaches the app-root recap.
- `calculateAndAwardDoka` is a no-op stub (returns `0`; Candid kept). Do not call it from the official reward funnel. `saveKillCount` rejects `kills > 64`.
- Developer docs: `README.md`, `docs/ARCHITECTURE.md`, `docs/TROUBLESHOOTING.md`.

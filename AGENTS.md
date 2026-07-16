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
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- Backend migration for WP/WR/SCP removal is complete and bindgen is regenerated. CharacterStats now has 12 required fields: hp, ap, mp, sp, sr, atk, res, chc, init, resilience, evasion, killCount. No wp/wr/scp in the persisted path.
- Character-creation blocker root cause: WorldExploration.tsx character-update payload sites must include killCount (BigInt(0) or carried value) — omitting it causes the Candid serializer to reject the save with a missing-field error.
- No caffeineai-oql dependency in this workspace; mops.toml has core, base, and caffeineai-authorization only. OQL companion lanes are not applicable here.
- Migration model: standard migrating-motoko-actors pattern with explicit (with migration = Migration.run) on the actor plus hand-written migration.mo consuming OldActor and producing NewActor. BaseToCore.mo exists as completed mo:base→mo:core migration marker.
- Character-creation blocker root cause: deployed canister was never upgraded with the new 12-field CharacterStats type + migration. The backend SOURCE on disk was correct but the deployed canister still ran the old 15-field type. Fix was to deploy/upgrade the canister so the migration runs.
- caffeineai-oql@0.4.0 package causes M0010 'package not defined' error in caffeine check --fix due to moc/mops toolchain resolution mismatch. mops sources resolves it but caffeine check (moc) cannot. OQL imports were temporarily commented out to unblock the build. OQL exposure needs to be re-enabled when the toolchain issue is resolved.
- dfx is not installed in the build container — mops build fails with exit 127. Use caffeine check --fix and caffeine build instead of mops build.
- EnemyConfig in src/backend/types/common.mo was cleaned to remove wp/wr/scp fields per the stat-overhaul spec, matching the CharacterStats cleanup.

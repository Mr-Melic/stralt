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

- CharacterStats is 12 required fields: hp, ap, mp, sp, sr, atk, res, chc, init, resilience, evasion, killCount. No wp/wr/scp on the persisted path. Bindgen: `src/frontend/src/backend.ts`.
- Character-update / create payloads must include every CharacterStats field. Omitting `killCount` fails in the Candid serializer before Motoko runs. Carry `BigInt(0)` or the existing value.
- Deployed canister can lag source: a live 15-field actor rejects 12-field saves until it is upgraded. Source-correct is not enough.
- Canonical actor is `src/backend/main.mo` (root `mops.toml`). `dfx.json` still points at stale `backend_extended/` (15-field stats) — do not deploy that path by accident.
- Migrations: `mops.toml` `[canisters.backend.migrations] chain = "src/backend/migrations"`. Current module inlines OldActor/NewActor. Live `main.mo` is a plain persistent `actor {` (no `(with migration = Migration.run)`). That annotation exists only on `backend_extended`. `BaseToCore.mo` is the completed mo:base→mo:core marker.
- `caffeineai-oql@0.4.0` **is** a dependency and **is imported** (`schema` / `execute` via `Expose` at the end of `main.mo`). Some `caffeine check` runs still hit M0010 (`package not defined`) even when `mops sources` resolves it — toolchain mismatch, not a missing import.
- dfx is often absent in this container — `mops build` exits 127. Use `caffeine check --fix` and `caffeine build`.
- Two EnemyConfig types: admin/frontend spawn template (`hp/ap/mp/initStat/...`) vs `types/common.mo` runtime combat template (`damage/res/sp/sr/chc/init`, no wp/wr/scp).
- Battle XP/Doka persist only through `applyRewards` (`utils/rewardResolver.ts`). Do not write rewards with `updateCharacter` or call the resolver per kill.
- New profiles must send `uiLayout: ""` — `saveCallerUserProfile` does not merge fields.
- Developer docs: `README.md`, `docs/ARCHITECTURE.md`, `docs/TROUBLESHOOTING.md`.

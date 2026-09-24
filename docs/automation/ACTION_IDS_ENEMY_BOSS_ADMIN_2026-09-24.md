# ACTION_IDs — 2026-09-24 Enemy & Boss Admin Content Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Enemy & Boss Admin Content Designer.  
Prior contract: [`ENEMY_BOSS_ADMIN_DESIGN_2026-08-31.md`](./ENEMY_BOSS_ADMIN_DESIGN_2026-08-31.md).  
Re-audit: [`ENEMY_BOSS_ADMIN_REAUDIT_2026-09-24.md`](./ENEMY_BOSS_ADMIN_REAUDIT_2026-09-24.md).  
Verified against `origin/main` @ `0f5363f` (unchanged since the 2026-09-21 EBA re-audit).

**No new ACTION_ID records this run.** `origin/main` is still `0f5363f`. Open draft PR [#360](https://github.com/Mr-Melic/stralt/pull/360) already covers `EBA-2026-09-21-001` (drive EnemyDefinition spawn through `engine/spawnPolicy.ts`). Open draft PRs [#404](https://github.com/Mr-Melic/stralt/pull/404) and [#449](https://github.com/Mr-Melic/stralt/pull/449) already recorded zero-ID passes at the same SHA. Re-filing those IDs, or any `EBA-2026-08-31-*` / `EBA-2026-09-01-*` / `EBA-2026-09-02-*` ID, would be a duplicate.

Do not implement gameplay from this file. This run ships **docs only**.

Sibling IDs to consume, not duplicate: `SDA-*`, `VAL-*`, `AFDA-2026-08-31-002` / `011`, `WDEAD-*`, `AEE-*`, Enemy Elite Evolution, Enemy Formations / EBMA.

Actionable work remains the OPEN IDs in:

- [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-08-31.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-08-31.md) (`EBA-2026-08-31-001` … `024`)
- [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-01.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-01.md) (`EBA-2026-09-01-001` … `006`; 006 copy PARTIAL)
- [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-02.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-02.md) (`EBA-2026-09-02-001` … `002`)
- [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/enemy-boss-admin-content-27f6/docs/automation/ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-21.md) (`EBA-2026-09-21-001`, PR #360)

Product rule (unchanged): Stralt has **no character level cap**. Do not treat `levelMax = 9999`, `floor(999/ts)`, `summonUnitDef.level ≤ 99`, or `DUNGEON_SPAWN_DEPTH_CAP = 5` as a career ceiling. Prefer relative offsets, probability curves, eligibility thresholds, and scalable formulas.

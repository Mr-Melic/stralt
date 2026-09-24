# Motoko / Candid / dfx drift audit — 2026-09-24

**Automation:** Motoko backend + declarations + dfx + legacy actors  
**HEAD inspected:** `0f5363f`  
**Branch:** `cursor/stralt-codebase-audit-bafd`  
**Scope:** verify known facts with file reads / grep; classify only. **Nothing deleted.**

Gameplay / RAF / mapGen / turn / damage math: not modified.

---

## Fact verification (all confirmed)

| Claim | Result | Evidence |
| :--- | :--- | :--- |
| Canonical actor is `src/backend/main.mo` with 12-field `CharacterStats` (no `wp`/`wr`/`scp`; has `killCount`) | **True** | `src/backend/main.mo` 147–160 |
| `dfx.json` points at missing `src/backend_extended/main.mo` | **True** | `dfx.json` 4; path **MISSING** on disk |
| Real leftover actor is repo-root `backend_extended/` with **14** Motoko fields (`wp`/`wr`/`scp`, no `killCount`) | **True** | `backend_extended/main.mo` 46–61. Docs that say “15-field” are **off by one** (Motoko/Candid count is 14). |
| Root `declarations/backend/` is stale 14-field snapshot | **True** | `declarations/backend/backend.did` 8–24; `backend.did.d.ts` 21–36 — has `wp`/`wr`/`scp`, no `killCount`; ~14 service methods vs ~250 in live DID |
| Canonical bindgen: `src/frontend/src/backend.ts` + `src/frontend/src/declarations/` + `src/backend/dist/backend.did` | **True** | All three show 12-field `CharacterStats` with `killCount` |
| Migrations under `src/backend/migrations/` are **REQUIRED** | **True** | Root `mops.toml` 29–33 `chain` + `check-limit = 5`; five chain files present. **Never delete.** |
| `mixins/*`, `lib/types.mo`, `types/common.mo`, `types/chat.mo` unused by `main.mo`; `ChatMessage` inlined | **True** | Import graph below; `ChatMessage` at `main.mo` 2595–2601 |
| `BaseToCore.mo` is documented marker | **True** | File header lines 1–16; unreachable from `main.mo`; kept per `AGENTS.md` |
| Root `mops.toml` `ic = "4.2.0"` **IS used** | **True** | `main.mo` 16 `import { ic } "mo:ic"`; `ic.raw_rand()` at 1379 (GameKey entropy) |
| `system-idl/aaaaa-aa.did` not imported by current `main.mo` | **True** | No import / `actor "aaaaa-aa"` in `main.mo`; only `include MixinAuthorization` / `include Expose` |
| Nested `src/backend/mops.toml` moc **1.9.0** vs root **1.11.2** | **True** | `src/backend/mops.toml` 8, 21 vs root `mops.toml` 37 |
| `calculateAndAwardDoka` is a live Candid stub returning `0` | **True** | `main.mo` 3070–3076 |

### `main.mo` import audit (question 1)

**Imports (lines 1–27):** `mo:caffeineai-authorization/*`, `mo:core/*`, `types/admin`, `lib/admin`, `lib/adminGuard`, `mo:ic`, `lib/gameKey`, `mo:caffeineai-oql/*`.

| Module | Imported by `main.mo`? |
| :--- | :--- |
| `mixins/*` | **No** |
| `types/common.mo` | **No** |
| `types/chat.mo` | **No** |
| `lib/types.mo` | **No** |
| `system-idl/aaaaa-aa.did` | **No** |
| `BaseToCore.mo` | **No** |

Reachable local Motoko from `main.mo`: `types/admin.mo`, `lib/admin.mo`, `lib/adminGuard.mo`, `lib/gameKey.mo` (+ migrations via mops, not `import`).

Unreachable non-migration Motoko: `BaseToCore.mo`, `lib/types.mo`, `mixins/admin-api.mo`, `mixins/types-api.mo`, `types/chat.mo`, `types/common.mo`.

---

## CharacterStats comparison (question 2)

| Source | Field count | Fields of interest | Classification |
| :--- | ---: | :--- | :--- |
| `src/backend/main.mo` 147–160 | **12** | `killCount`; **no** `wp`/`wr`/`scp` | Canonical |
| `src/backend/dist/backend.did` 191–205 | **12** | same | Canonical generated |
| `src/frontend/src/backend.ts` 247–260 | **12** | same | Canonical bindgen |
| `src/frontend/src/backend.d.ts` ~201–210 | **12** | same | Canonical |
| `src/frontend/src/declarations/backend.did.d.ts` 108–121 | **12** | same | Canonical |
| `backend_extended/main.mo` 46–61 | **14** | `wp`/`wr`/`scp`; **no** `killCount` | Legacy leftover |
| `backend_extended/migration.mo` 11–24 | **14** | same | Legacy leftover |
| `declarations/backend/backend.did` 8–24 | **14** | same | Stale dfx snapshot |
| `declarations/backend/backend.did.d.ts` 21–36 | **14** | same | Stale dfx snapshot |

**Doc drift:** `AGENTS.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/TROUBLESHOOTING.md` often say “15-field” for `backend_extended` / root declarations. On-disk Motoko and Candid records are **14** fields. Prefer “14-field (`wp`/`wr`/`scp`, no `killCount`)” in new prose.

---

## `types/common.mo` EnemyConfig (question 3)

**Not used by the live actor.**

| `EnemyConfig` shape | Location | Used by |
| :--- | :--- | :--- |
| Admin/spawn template (`hp`/`ap`/`mp`/`initStat`/`levelMin`/`levelMax`/`regions`/`spriteUrl`) | Inlined `main.mo` 549–560; duplicate `types/admin.mo` 15–26 | Live admin CRUD + `AdminGuard.validateEnemyConfig` |
| Runtime combat template (`damage`/`res`/`sp`/`sr`/`chc`/`init`/`xpReward`/`dokaReward`/`side`, …) | `types/common.mo` 97–112 | Only `lib/types.mo` + `mixins/types-api.mo` (both unreachable from `main.mo`) |

Frontend combat uses its own TS `computeEnemyStats` (`engine/combatMath.ts` / `progression.ts`), not the Motoko helper in `types/common.mo` 116+.

---

## `.old` files (question 4)

Only one file under `.old/`:

- `.old/src/backend/dist/backend.most` (git-tracked)

No other `.old` trees. **LEGACY BUT REQUIRED** for `mops check-stable` / Caffeine previous-version signature (Aug-31 import, no GameKey).

---

## `frontend/public` vs `src/frontend/public` (question 5)

| Path | Role | Classification |
| :--- | :--- | :--- |
| `src/frontend/public/` | Live Vite package public dir (fonts, images, JPEGs, favicon, generated sprite) | **LEGACY BUT REQUIRED** (active assets) |
| Root `frontend/public/assets/` | Git-tracked Caffeine screenshots + duplicate `generated/skateboard-sprite.png` | **STALE GENERATED ARTIFACT** — do not delete without human asset decision |
| Root `frontend/` | Outside `pnpm-workspace.yaml` (`packages: src/**/*`) | Not a live package |

---

## Unused Motoko under `src/backend/` (question 6)

| Path | Notes |
| :--- | :--- |
| `mixins/admin-api.mo` | Dead mixin; unguarded `AdminLib.setEnemyConfig` (no `AdminGuard` / audit). Documented risk if ever `include`d. |
| `mixins/types-api.mo` | Re-exports only; unused. |
| `lib/types.mo` | Re-exports `types/common`; unused. |
| `types/common.mo` | Combat types + helpers; unused by actor. |
| `types/chat.mo` | Duplicate of inlined `ChatMessage`. |
| `BaseToCore.mo` | Marker; not imported (keep as documented). |
| `system-idl/aaaaa-aa.did` | Not imported. |
| `src/backend/mops.toml` | Nested stale moc 1.9.0 / no migrations; root `mops.toml` is authoritative. |
| Partial dead helpers inside live `lib/admin.mo` | `setEnemyConfig` / `deleteEnemyConfig` / `getEnemyConfigs` / region / sprite / spell CRUD wrappers are **only** called from dead `mixins/admin-api.mo`. Live `main.mo` uses `AdminLib.default*` seeders + `setMapModifierChance` only. |

Migrations (`20260801`…`20260901`) and snapshots: **required**.

---

## Abandoned-looking comments / stubs in `main.mo` (question 7)

| Location | What it is | Classification |
| :--- | :--- | :--- |
| Lines 29–43 | ~15 blank lines after imports (likely removed prior imports); no leftover code | Cosmetic; **SAFE TO REMOVE** blank lines only |
| 1152–1168 `initiatePurchase` | Legacy nine-arg KYC stub → always `#err` with GameKey message | **LEGACY BUT REQUIRED** (Candid surface) |
| 1333–1348 `_autoCompletePendingPurchases` / `processPendingPurchases` | No-op; returns `0` | **LEGACY BUT REQUIRED** (shop remount / Candid) |
| 3070–3076 `calculateAndAwardDoka` | Documented unused mint; returns `0` | **LEGACY BUT REQUIRED** (Candid stub; do not call from reward funnel) |

---

## Root `mops.toml` dependencies (question 8)

| Dep | Used by canonical `src/backend`? | Classification |
| :--- | :--- | :--- |
| `core` | Yes (`mo:core/*`) | Required |
| `caffeineai-authorization` | Yes | Required |
| `caffeineai-oql` | Yes (`OQL` / `Expose` at end of `main.mo`) | Required |
| `ic` | Yes (`mo:ic` / `raw_rand`) | Required — **do not list as unused** |
| `base` | **No** `mo:base` import under `src/backend/*.mo`. Only `backend_extended/` imports `mo:base` | **NEEDS HUMAN DECISION** — drop from root deps after confirming no toolchain/package expectation, or keep for local experiments on `backend_extended/` |

---

## Structured classification

### SAFE TO REMOVE

High confidence for deletion **only after a dedicated cleanup PR**; this audit deleted nothing.

| Item | Evidence |
| :--- | :--- |
| Blank line gap `main.mo` 29–43 | Cosmetic only |
| (None other without human confirm) | Stale trees below look removable but collide with dfx/bindgen/docs — keep classified as human decision |

### LEGACY BUT REQUIRED

| Item | Why |
| :--- | :--- |
| `src/backend/migrations/**` (all five chain files + snapshots) | EOP / `mops check` / Caffeine deploy |
| `.old/src/backend/dist/backend.most` | Caffeine previous-version signature |
| `src/backend/main.mo` + `lib/admin.mo` / `adminGuard.mo` / `gameKey.mo` / `types/admin.mo` | Live actor graph |
| `src/backend/BaseToCore.mo` | Documented mo:base→mo:core marker |
| `src/backend/dist/backend.did` (+ `.most` / wasm when built) | Canonical Candid |
| `src/frontend/src/backend.ts`, `backend.d.ts`, `src/frontend/src/declarations/*` | Canonical bindgen (12-field) |
| `src/frontend/public/**` | Live Vite assets |
| `src/backend/caffeine.toml` | Caffeine `mops build` / `mops check` entry |
| Candid stubs: `calculateAndAwardDoka`, `initiatePurchase`, `processPendingPurchases` | Live surface; bodies are intentional no-ops |
| Root `mops.toml` `ic = "4.2.0"` | Live GameKey entropy |

### STALE GENERATED ARTIFACT

| Item | Evidence |
| :--- | :--- |
| Root `declarations/backend/` | 14-field DID (~60 lines) vs live `src/backend/dist/backend.did` (~913 lines). Not imported by frontend (imports `./declarations/...` under `src/frontend/src/`). |
| Root `frontend/public/assets/` screenshots / duplicate sprite | Git-tracked; outside pnpm workspace |
| Frontend `tsconfig` path `"declarations/*": ["../declarations/*"]` | Resolves to missing `src/declarations/` (not root `declarations/`). Footgun if alias is used. |

### NEEDS HUMAN DECISION

| Item | Question |
| :--- | :--- |
| `dfx.json` → missing `src/backend_extended/main.mo` | Retarget to `src/backend/main.mo` (+ packtool/mops) vs keep broken path as a deploy guard |
| Repo-root `backend_extended/` | Delete after dfx retarget vs keep as upgrade/compat reference |
| Root `declarations/backend/` | Delete after dfx retarget / regenerate vs keep as cautionary stale snapshot |
| `src/backend/mixins/*`, `lib/types.mo`, `types/common.mo`, `types/chat.mo` | Delete scaffolds vs reserve for a future mixin split (note: `admin-api.mo` is unguarded) |
| `src/backend/system-idl/aaaaa-aa.did` | Drop vs keep for hypothetical management-canister IDL |
| `src/backend/mops.toml` moc 1.9.0 | Delete nested pin vs sync to 1.11.2 |
| Root `mops.toml` `base = "0.16.0"` | Remove if unused by canonical build vs keep for `backend_extended` local builds |
| Doc “15-field” wording | Correct to **14-field** across `AGENTS.md` / README / ARCHITECTURE / TROUBLESHOOTING |
| Dead `AdminLib` CRUD wrappers | Delete or wire only through guarded `main.mo` paths; never `include` unguarded mixin |

---

## Recommended next human actions (no code this PR)

1. Retarget or explicitly document `dfx.json` as non-authoritative.
2. Fix “15-field” → “14-field” doc drift.
3. Decide fate of `backend_extended/` + root `declarations/` together.
4. Do **not** delete migrations, `.old`, or Candid stubs without a Candid compatibility plan.
5. Do **not** treat root `ic` as unused.

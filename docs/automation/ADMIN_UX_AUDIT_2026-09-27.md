# Admin UX & Information Architecture Audit — 2026-09-27

**Auditor:** Admin UX & Information Architecture Auditor  
**SOURCE_AUTOMATION:** Admin UX & Information Architecture Auditor  
**HEAD inspected:** `origin/main` `0f5363f` (PR #332 merge)  
**Scope:** Owner tool only (`AdminDashboard.tsx`, `AdminGameKeyPurchases.tsx`, admin hooks, backend admin API). Gameplay math / RAF / map gen not touched.  
**Prior pass:** memories `2026-09-26` (#631 helpers). Repo copies of 09-26 files live on that PR, not on `main`. Do not recreate `adminOwnerUx.shopBusy.ts`, `adminOwnerUx.visualPreview.ts`, `adminOwnerUx.ts`, `adminOwnerUx.summon.ts`, `adminOwnerUx.catalogPublish.ts`, or `SpellSummonFields.tsx`.

This is an **owner console**, not a player HUD. Optimize for speed, clarity, safety, discoverability, density, low operator error, and content scale.

DESIGN.md identity (carved-stone, gold, crimson) is preserved on the owner tool. Decorative orbs / player HUD patterns are not imposed. Owner `C` tokens remain raw hex (AUX-HEX-VS-OKLCH).

---

## Capability map (inspected, not imposed)

| Domain (prompt) | Actual capability | Admin surface today |
| :--- | :--- | :--- |
| OVERVIEW | None | Missing |
| ENEMIES | Canister CRUD spawn templates (`hp/ap/mp/init/level/regions/spriteUrl`) | Enemies tab + list search. Thumbnail helper queued #631; editor insert skipped (stack) |
| BOSSES | 19 kits; **localStorage** `pbv_boss_configs` — Motoko `getAllBossConfigs` / `setBossConfig` exist; frontend record still diverges (`iconEmoji`/`loreText`/`chc` vs `defeated`/`adminNotes`) | Bosses tab (draft copy + ability filter + Save browser draft) |
| SPELLS | Canister CRUD + large targeting/effect form; summon fields persist via adapter; **no summon controls on `main`** | Spells tab + list search. Summon editor queued in #564 |
| SPELL DISCOVERY | Player `starterSpells` + minLevel; no discovery catalog | Missing |
| ACHIEVEMENTS | Canister CRUD + `active` flag | Achievements tab + list search |
| CHALLENGES | Hardcoded `DEFAULT_CHALLENGES` | Missing — do not add an empty tab |
| AI | Constants in `gameConstants.ts` / `engine/enemyAI.ts` | Missing |
| FORMATIONS | Not a first-class config type | Missing |
| ENCOUNTERS | Runtime spawn + tiers + regions | Enemy Tiers + Regions only |
| DUNGEONS | `DungeonRecord` / chain persist | Missing |
| WORLD | Regions + map modifiers + paper palette | Regions / Modifiers / Visuals |
| VISUAL ASSETS | Enemy URL, player 4-facing URLs, ad image URLs | Scattered; no pool/weights. Empty = Default Pixel Visual (valid, never an error) |
| ECONOMY | GameKey/Mollie (PR #258) + grant/ban; packages API still on actor | Shop / Purchases |
| SYSTEM CONFIG | All nine LevelUpConfig fields, role grant, Boss Rush (canister-live), palette | Settings / Boss Rush / Visuals |
| SIMULATION | None | Missing — do not add a writer |
| TELEMETRY | None | Missing |
| HEALTH / AUDIT | Canister `getAdminAuditLog` + rollback writers; frontend mock stub; **no owner tab**. `setAppVersion` / `setChangelog` have no editors | Tab error banners + Settings honesty note only |
| BANS | `getBannedPrincipals` | Shop banned list |

**Live tabs (15, still flat):** Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.  
File: `src/frontend/src/components/AdminDashboard.tsx` (~8.2k lines, one module). Purchases: `AdminGameKeyPurchases.tsx`.

Do **not** vendor older AdminDashboard PRs onto `main`. Unique hunks only so `--self` 3-way-merges after #334 / #341 / #413 / #415 / #437 / #457 / #460 / #470 / #512 / #531 / #539 / #564. Purchases overlap is #492 only.

---

## Recapture — do not reopen AUTO_FIXED (queued PRs still open)

| ACTION_ID | Status 2026-09-27 |
| :--- | :--- |
| AUX-DEL-NO-CONFIRM | AUTO_FIXED (present on `main`) |
| AUX-SHOP-NO-CONFIRM | AUTO_FIXED (present; unban + GameKey confirms) |
| AUX-TRANSFER-COPY-MISLEAD | AUTO_FIXED |
| AUX-VIS-NO-DEFAULT-DISTINCTION | AUTO_FIXED |
| AUX-ID-MUTABLE | AUTO_FIXED |
| AUX-VALIDATION-EMPTY-SAVE | AUTO_FIXED |
| AUX-SPRITE-FR-LABELS | AUTO_FIXED |
| AUX-UNBAN-NO-CONFIRM | AUTO_FIXED |
| AUX-SHOP-SHARED-PRINCIPAL | AUTO_FIXED |
| AUX-SPRITE-LEAVE-UNWARNED | AUTO_FIXED |
| AUX-THEME-SPLIT | AUTO_FIXED |
| AUX-AD-CLEAR-NO-CONFIRM | AUTO_FIXED |
| AUX-AD-EMPTY-AS-ERROR | AUTO_FIXED |
| AUX-BOSSRUSH-LIVE-UNLABELED | AUTO_FIXED |
| AUX-ACCESS-FIRST-PLAYER-COPY | AUTO_FIXED |
| AUX-LEVELUP-PARTIAL | AUTO_FIXED (nine fields visible) |
| AUX-GAMEKEY-NO-CONFIRM | AUTO_FIXED |
| AUX-UNBAN-COPY-STALE | AUTO_FIXED |
| AUX-UNBAN-NO-ASSERT | AUTO_FIXED |
| AUX-NO-BANNED-LIST | AUTO_FIXED |
| AUX-SPELL-DELETE-BUILTIN | AUTO_FIXED queued #341 |
| AUX-PRESET-DELETE-NO-CONFIRM | AUTO_FIXED queued #341 |
| AUX-LOADING-INCOMPLETE | AUTO_FIXED queued #341 + boss Save #413 |
| AUX-BOSS-SPELL-POOL-UNFILTERED | AUTO_FIXED queued #341 (`main` still unfiltered) |
| AUX-VISUALS-TAB-SCOPE | AUTO_FIXED queued #341 |
| AUX-SIDEBAR-COUNTS-INCOMPLETE | AUTO_FIXED queued #341 (`main` still missing bosses/names) |
| AUX-BOSS-LEAVE-UNWARNED | AUTO_FIXED queued #413 (`hasOpenEditor` still omits bosses) |
| AUX-SPELL-RETIRED-UNLABELED | AUTO_FIXED queued #413 |
| AUX-PRESET-OVERWRITE-NO-CONFIRM | AUTO_FIXED queued #413 |
| AUX-NAMES-INIT-NO-CONFIRM | AUTO_FIXED queued #470 |
| AUX-BOSSRUSH-PUBLISH-NO-CONFIRM | AUTO_FIXED queued #470 |
| AUX-PALETTE-RESET-NO-CONFIRM | AUTO_FIXED queued #470 |
| AUX-ADS-SAVE-SILENT-ERROR | AUTO_FIXED queued #470 (`main` catch still has no toast) |
| AUX-LEVELUP-NO-SAVING | AUTO_FIXED queued #470 |
| AUX-PALETTE-NO-SAVING | AUTO_FIXED queued #470 |
| AUX-ACHIEVEMENT-DUP-CONDITION | AUTO_FIXED queued #460/#470 |
| AUX-TIER-PUBLISH-NO-CONFIRM | AUTO_FIXED queued #539 |
| AUX-GAMECONFIG-PUBLISH-NO-CONFIRM | AUTO_FIXED queued #539 |
| AUX-LEVELUP-PUBLISH-NO-CONFIRM | AUTO_FIXED queued #539 |
| AUX-PALETTE-SAVE-NO-CONFIRM | AUTO_FIXED queued #539 |
| AUX-SPELL-RANGE-UNBOUNDED | AUTO_FIXED queued #512/#539 |
| AUX-CONFIRM-NO-ESCAPE | AUTO_FIXED queued #539 (`ConfirmDialog` on `main` has no Escape) |
| AUX-PURCHASE-CONFIRM-NO-ESCAPE | AUTO_FIXED queued #492 |
| AUX-SPELL-NO-SUMMON-CONTROLS | AUTO_FIXED queued #564 |
| AUX-SHOP-GRANT-DOUBLE-SUBMIT | PARTIAL queued #631 — helpers; dashboard wiring skipped |
| AUX-ENEMY-NO-THUMBNAIL | PARTIAL queued #631 — helper; editor insert skipped |
| AUX-PURCHASE-CONFIRM-DOUBLE-SUBMIT | AUTO_FIXED this run — GameKey actor lock |
| AUX-CONFIRM-DOUBLE-CLICK | PARTIAL this run — helper; ConfirmDialog wiring skipped (stack vs #539) |
| AUX-CATALOG-SAVE-LOOKS-LIKE-DRAFT | PARTIAL |
| AUX-PII-PURCHASES | PARTIAL — search/status; no redact |
| AUX-LIST-NO-FILTER-SORT | PARTIAL — substring search; no sort/facets |
| AUX-BOSS-ABILITY-WALL | PARTIAL — filter only |
| AUX-DIRTY-UNUSED | PARTIAL |
| AUX-BOSS-LOCALSTORAGE-AS-LIVE | PARTIAL |
| AUX-NAV-FLAT-15 | PARTIAL |
| AUX-ENEMY-STATS-INCOMPLETE | PARTIAL |
| AUX-SHOP-PACKAGES-MISSING | SUPERSEDED |
| AUX-LIFE-NO-STATES | NEW — do not implement without approval |
| AUX-NO-HEALTH-AUDIT | NEW |
| AUX-NO-VERSION-EDITOR | NEW |
| AUX-ROLLBACK-NO-UI | NEW |
| AUX-ENTITY-SAVE-NO-CONFIRM | NEW |
| AUX-DOMAIN-GAPS | REPORT_ONLY |

---

## Recommended IA (proposal — do not implement until approved)

```
OVERVIEW          last writes (getAdminAuditLog), draft vs live counts
CONTENT
  Enemies         list + search → editor + dependency rail
  Bosses          staged edit (local draft ≠ live; type-align Motoko)
  Spells          sectioned editor + acquisition
  Achievements
  Challenges      (new; currently hardcoded)
  Enemy Names
WORLD
  Regions
  Tiers / Encounters
  Map Modifiers
  Dungeons        (new)
PRESENTATION
  Player Sprites
  Visual Assets   pools, weights (new)
  Ad Boxes
ECONOMY / OPS
  Shop            GameKey grant/ban + banned list (packages retired)
  Purchases       GameKey approve/reject
  Boss Rush
  System Config   LevelUp + version/changelog + rollbacks
HEALTH
  Audit           getAdminAuditLog + orphan IDs
  Telemetry       persist-ok/fail, grants, bans
```

Do **not** add Simulation until there is a read-only runner that cannot write wallets.

---

## Auto-fixes this run (SAFE_TO_AUTO_IMPLEMENT only)

Did **not** patch `AdminDashboard.tsx` (oldest-first stack still starts at #334/#341). Did **not** recreate #631 shopBusy / visualPreview files.

1. GameKey Purchases in-flight lock: `adminOwnerUx.gameKeyBusy.ts`. Approve / Reject / Show code / Mark emailed refuse a second begin until `endGameKeyAdminOp`. Row actions disable while any op is running. Distinct from Shop grant/ban (`shopBusy` on #631).
2. Generic ConfirmDialog latch helper: `adminOwnerUx.confirmOnce.ts`. Not wired into `ConfirmDialog` (that function is also edited by #539 Escape). After #539 lands, arm-once the confirm button.

Major grouping, lifecycle state machine, dependency graph, new domains, Health tab, version editor, rollback UI, and boss canister writer remain **HUMAN_APPROVAL_REQUIRED**.

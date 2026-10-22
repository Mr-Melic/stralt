# Admin UX & Information Architecture Audit — 2026-10-22

**Auditor:** Admin UX & Information Architecture Auditor  
**SOURCE_AUTOMATION:** Admin UX & Information Architecture Auditor  
**HEAD inspected:** `origin/main` `0f5363f` (PR #332 merge) — same tip as 2026-09-29 / 2026-10-21  
**Scope:** Owner tool only (`AdminDashboard.tsx` ~8280 lines, `AdminGameKeyPurchases.tsx`, admin hooks, backend admin API). Gameplay math / RAF / map gen not touched.  
**Prior pass:** memories `2026-10-21` (#838 audit/rollback/PII/dirty/jump/changelog helpers). Repo copies of 09-21…10-21 files live on those PRs, not on `main`. Oldest owner-UX sibling is still #341; last owner-UX code PR before this pass is #838.

Do **not** recreate `adminOwnerUx.ts`, `adminOwnerUx.summon.ts`, `adminOwnerUx.catalogPublish.ts`, `adminOwnerUx.shopBusy.ts`, `adminOwnerUx.visualPreview.ts`, `adminOwnerUx.gameKeyBusy.ts`, `adminOwnerUx.confirmOnce.ts`, `adminOwnerUx.lifecycle.ts`, `adminOwnerUx.visualPool.ts`, `adminOwnerUx.deps.ts`, `adminOwnerUx.publishGate.ts`, `adminOwnerUx.listQuery.ts`, `adminOwnerUx.editorChrome.ts`, `adminOwnerUx.auditView.ts`, `adminOwnerUx.rollbackConfirm.ts`, `adminOwnerUx.piiRedact.ts`, `adminOwnerUx.dirty.ts`, `adminOwnerUx.entityJump.ts`, `adminOwnerUx.changelogPublish.ts`, or `SpellSummonFields.tsx`.  
Do **not** vendor #334 / #341 / #413 / #470 / #539 / #564 `AdminDashboard.tsx` onto `main`. Unique hunks only.

This is an **owner console**, not a player HUD. Optimize for speed, clarity, safety, discoverability, density, low operator error, and content scale.

DESIGN.md identity (carved-stone, gold, crimson) is preserved on the owner tool. Decorative orbs / player HUD patterns are not imposed. Owner `C` tokens remain raw hex (AUX-HEX-VS-OKLCH).

---

## Capability map (inspected, not imposed)

| Domain (prompt) | Actual capability | Admin surface today |
| :--- | :--- | :--- |
| OVERVIEW | None | Missing |
| ENEMIES | Canister CRUD spawn templates (`hp/ap/mp/init/level/regions/spriteUrl`) | Enemies tab + list search + Default Pixel / stored-URL chips. List glyph is still 👾. Thumbnail helper queued #631 |
| BOSSES | 19 kits; **localStorage** `pbv_boss_configs` — Motoko `getAllBossConfigs` / `setBossConfig` exist; frontend record still diverges (`iconEmoji`/`loreText`/`chc` vs `defeated`/`adminNotes`) | Bosses tab (draft copy + ability filter + Save browser draft). Collapsed row still has no DRAFT chip. `hasOpenEditor` still omits bosses |
| SPELLS | Canister CRUD + large targeting/effect form; summon fields persist via adapter; **no summon controls on `main`** | Spells tab + list search. Summon editor queued in #564. Dropdown still omits `spellType` summon. `SPELL_EFFECT_TYPES` omits summon |
| SPELL DISCOVERY | Player `starterSpells` + minLevel; no discovery catalog | Missing |
| ACHIEVEMENTS | Canister CRUD + `active` flag | Achievements tab + list search + Active/Inactive chip (binary eligible, not the six-state vocabulary) |
| CHALLENGES | Hardcoded `DEFAULT_CHALLENGES` | Missing — do not add an empty tab |
| AI | Constants in `gameConstants.ts` / `engine/enemyAI.ts` | Missing |
| FORMATIONS | Not a first-class config type | Missing |
| ENCOUNTERS | Runtime spawn + tiers + regions | Enemy Tiers + Regions only |
| DUNGEONS | `DungeonRecord` / chain persist | Missing |
| WORLD | Regions + map modifiers + paper palette | Regions / Modifiers / Visuals |
| VISUAL ASSETS | Enemy URL, player 4-facing URLs, ad image URLs | Scattered; no pool/weights. Empty = Default Pixel Visual (valid, never an error). Pool copy helper queued #724 |
| ECONOMY | GameKey/Mollie (PR #258) + grant/ban; packages API still on actor | Shop / Purchases |
| SYSTEM CONFIG | All nine LevelUpConfig fields, role grant, Boss Rush (canister-live), palette | Settings / Boss Rush / Visuals. Level-up / palette / Boss Rush still seed from localStorage before hydrate. No confirm; no busy lock |
| SIMULATION | None | Missing — do not add a writer |
| TELEMETRY | None | Missing |
| HEALTH / AUDIT | Canister `getAdminAuditLog` + rollback writers; frontend mock stub returns `notAdmin`; **no owner tab**. `setAppVersion` / `setChangelog` have no editors | Tab error banners + Settings honesty note only. Reader helper queued #838 |
| BANS | `getBannedPrincipals` | Shop banned list (empty = valid default) |

**Live tabs (15, still flat):** Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.  
File: `src/frontend/src/components/AdminDashboard.tsx` (~8280 lines, one module). Purchases: `AdminGameKeyPurchases.tsx`.

Do **not** vendor older AdminDashboard PRs onto `main`. Unique hunks only so `--self` 3-way-merges after #334 / #341 / #413 / #415 / #437 / #457 / #460 / #470 / #512 / #531 / #539 / #564. Purchases overlap is #492 / #664. Lifecycle helpers overlap is #724. Chrome helpers overlap is #775. 10-21 helpers overlap is #838.

---

## Recapture — do not reopen AUTO_FIXED (queued PRs still open)

| ACTION_ID | Status 2026-10-22 |
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
| AUX-NAMES-INIT-NO-CONFIRM | AUTO_FIXED queued #470 (`Load Defaults` still one-click on `main`) |
| AUX-BOSSRUSH-PUBLISH-NO-CONFIRM | AUTO_FIXED queued #470 |
| AUX-PALETTE-RESET-NO-CONFIRM | AUTO_FIXED queued #470 |
| AUX-ADS-SAVE-SILENT-ERROR | AUTO_FIXED queued #470 (catch still `setStatus("Error")` only) |
| AUX-LEVELUP-NO-SAVING | AUTO_FIXED queued #470 |
| AUX-PALETTE-NO-SAVING | AUTO_FIXED queued #470 |
| AUX-ACHIEVEMENT-DUP-CONDITION | AUTO_FIXED queued #460/#470 |
| AUX-TIER-PUBLISH-NO-CONFIRM | AUTO_FIXED queued #539 |
| AUX-GAMECONFIG-PUBLISH-NO-CONFIRM | AUTO_FIXED queued #539 |
| AUX-LEVELUP-PUBLISH-NO-CONFIRM | AUTO_FIXED queued #539 |
| AUX-PALETTE-SAVE-NO-CONFIRM | AUTO_FIXED queued #539 |
| AUX-SPELL-RANGE-UNBOUNDED | AUTO_FIXED queued #512/#539 |
| AUX-CONFIRM-NO-ESCAPE | AUTO_FIXED queued #539 |
| AUX-PURCHASE-CONFIRM-NO-ESCAPE | AUTO_FIXED queued #492 (reveal overlay still has no Escape on `main`) |
| AUX-SPELL-NO-SUMMON-CONTROLS | AUTO_FIXED queued #564 |
| AUX-SHOP-GRANT-DOUBLE-SUBMIT | PARTIAL queued #631 — helpers; dashboard wiring skipped |
| AUX-ENEMY-NO-THUMBNAIL | PARTIAL queued #631 — helper; editor insert skipped; list still 👾 + status chip |
| AUX-PURCHASE-CONFIRM-DOUBLE-SUBMIT | AUTO_FIXED queued #664 — GameKey actor lock |
| AUX-CONFIRM-DOUBLE-CLICK | PARTIAL queued #664 — helper; ConfirmDialog wiring skipped |
| AUX-LIFE-COPY-HELPER | AUTO_FIXED queued #724 |
| AUX-ASSET-POOL-COPY | AUTO_FIXED queued #724 |
| AUX-DEP-RAIL-HELPER | AUTO_FIXED queued #724 |
| AUX-CONFIG-CACHE-PREEMPT-PUBLISH | AUTO_FIXED queued #775 — helper; editors unwired |
| AUX-LIST-SORT-HELPER | AUTO_FIXED queued #775 — helper; lists unwired |
| AUX-EDITOR-CHROME-HELPER | AUTO_FIXED queued #775 — helper; chrome unwired |
| AUX-AUDIT-VIEW-HELPER | AUTO_FIXED queued #838 — helper; no Health tab |
| AUX-ROLLBACK-CONFIRM-HELPER | AUTO_FIXED queued #838 — helper; no buttons |
| AUX-PII-REDACT-HELPER | AUTO_FIXED queued #838 — helper; Purchases unwired |
| AUX-DIRTY-HELPER | AUTO_FIXED queued #838 — helper; `isDirty` still false |
| AUX-ENTITY-JUMP-HELPER | AUTO_FIXED queued #838 — helper; no ⌘K |
| AUX-CHANGELOG-CONFIRM-HELPER | AUTO_FIXED queued #838 — helper; no Settings form |
| AUX-SPRITE-SAVE-CLOSE-HELPER | AUTO_FIXED this run — helper; SpriteList still closes immediately |
| AUX-SAVE-FEEDBACK-HELPER | AUTO_FIXED this run — helper; Shop grant still toast + hex pill |
| AUX-ENTITY-SAVE-CONFIRM-HELPER | AUTO_FIXED this run — helper; catalog Save still one-click live |
| AUX-CONFIG-WRITER-BUSY-HELPER | AUTO_FIXED this run — helper; Boss Rush / ads / level-up / palette / tiers still unlocked |
| AUX-CATALOG-SAVE-LOOKS-LIKE-DRAFT | PARTIAL — helper on #724; editor labels still “Save …” on `main` |
| AUX-PII-PURCHASES | PARTIAL — search/status; redact helper on #838; UI unwired |
| AUX-LIST-NO-FILTER-SORT | PARTIAL — substring search; sort/facet helper on #775; UI unwired |
| AUX-BOSS-ABILITY-WALL | PARTIAL — filter only |
| AUX-DIRTY-UNUSED | PARTIAL — helper on #838; leave-editor still fires for clean forms |
| AUX-BOSS-LOCALSTORAGE-AS-LIVE | PARTIAL — collapsed row still has no DRAFT chip |
| AUX-NAV-FLAT-15 | PARTIAL — group map helper on #775; sidebar still flat |
| AUX-ENEMY-STATS-INCOMPLETE | PARTIAL |
| AUX-SHOP-PACKAGES-MISSING | SUPERSEDED |
| AUX-LIFE-NO-STATES | PARTIAL — copy helper on #724; no canister states |
| AUX-NO-HEALTH-AUDIT | PARTIAL — reader helper on #838; still no tab |
| AUX-NO-VERSION-EDITOR | PARTIAL — confirm helper on #838; still no inputs |
| AUX-ROLLBACK-NO-UI | PARTIAL — typed ROLLBACK helper on #838; still no buttons |
| AUX-ENTITY-SAVE-NO-CONFIRM | PARTIAL — confirm copy this run; do not auto-add six dialogs |
| AUX-SPRITE-SAVE-CLOSES-BEFORE-OK | PARTIAL — helper this run; `handleSave` ~1715 still closes then validates |
| AUX-SAVE-FEEDBACK-SPLIT | PARTIAL — helper this run; writers still mixed |
| AUX-CONFIG-WRITER-DOUBLE-SUBMIT | NEW — helper this run; Boss Rush Publish / ads / level-up / palette / tiers have no lock |
| AUX-DOMAIN-GAPS | REPORT_ONLY |
| AUX-NO-GLOBAL-SEARCH | PARTIAL — index helper on #838; chrome unwired |

---

## Recommended IA (proposal — do not implement until approved)

```
OVERVIEW          last writes (getAdminAuditLog), draft vs live counts
CONTENT
  Enemies         list + search + sort → editor + dependency rail
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

Recommended chrome once IA is approved: breadcrumbs (#775), `⌘K` entity jump (`queryOwnerJumpIndex` #838), unsaved-change warnings (`ownerFormIsDirty` + `beforeunload` #838), staged editing, preview-before-activate, version comparison, validation summaries (#775), dependency badges (#724), change summaries (`ownerAuditChangeSummary` #838), live-catalog confirm (`shouldPublishLiveCatalog`), simulation shortcuts (read-only only).

---

## Auto-fixes this run (SAFE_TO_AUTO_IMPLEMENT only)

Did **not** patch `AdminDashboard.tsx` (oldest-first stack still starts at #334/#341).  
Did **not** patch `AdminGameKeyPurchases.tsx` (#492 / #664).  
Did **not** recreate #564 / #631 / #664 / #724 / #775 / #838 helper files.

1. Sprite save close: `adminOwnerUx.spriteSaveClose.ts`. Close the editor only after `#ok`. Validation failure, pending, and `#err` keep the form. Documents SpriteList `handleSave` (~1715) closing before parent walk-URL validation. Not wired.
2. Save feedback: `adminOwnerUx.saveFeedback.ts`. One vocabulary — Published (live) / Draft saved (this browser) / Failed. Hex pill drops when a toast already reported the write. Flags Shop grant toast + hex `Saved` as split. Not wired.
3. Live catalog confirm: `adminOwnerUx.entitySaveConfirm.ts`. Per-kind confirm title/body for enemy, spell, region, modifier, achievement, sprite. Cancel does not write. Distinct from #539 system-config bodies and #564 list notes. Not wired.
4. Config writer busy: `adminOwnerUx.configWriterBusy.ts`. Sync lock for level-up, palette, tiers, game config, Boss Rush, and ads. Distinct from `shopBusy` / `gameKeyBusy`. Not wired.

Major grouping, canister lifecycle state machine, Health tab, version/rollback UI, boss canister writer, visual pools/weights, and wiring any of the above into `AdminDashboard` remain **HUMAN_APPROVAL_REQUIRED**.

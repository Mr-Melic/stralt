# Admin UX & Information Architecture Audit — 2026-09-21

**Auditor:** Admin UX & Information Architecture Auditor  
**SOURCE_AUTOMATION:** Admin UX & Information Architecture Auditor  
**HEAD inspected:** `cursor/admin-dashboard-audit-3bea` @ `0f5363f` (origin/main)  
**Scope:** Owner tool only (`AdminDashboard.tsx`, `AdminGameKeyPurchases.tsx`, admin hooks, `adminSafety.ts`, backend admin API). Gameplay math / RAF / map gen not touched.  
**Prior pass:** [`ADMIN_UX_AUDIT_2026-09-02.md`](./ADMIN_UX_AUDIT_2026-09-02.md)

This is an **owner console**, not a player HUD. Optimize for speed, clarity, safety, discoverability, density, low operator error, and content scale.

DESIGN.md identity (carved-stone, gold, crimson) is preserved on the owner tool. Decorative orbs / player HUD patterns are not imposed. Admin `C` tokens remain hex (owner-tool-only; see AUX-HEX-VS-OKLCH).

---

## Capability map (inspected, not imposed)

| Domain (prompt) | Actual capability | Admin surface today |
| :--- | :--- | :--- |
| OVERVIEW | None | Missing |
| ENEMIES | Canister CRUD spawn templates (`hp/ap/mp/init/level/regions/spriteUrl`) | Enemies tab + list search + spawn-template copy |
| BOSSES | 19 kits; **localStorage** `pbv_boss_configs` — Motoko `getAllBossConfigs` / `adminSetBossConfig` exist but frontend record does not match | Bosses tab (draft copy + ability + spell-pool filter) |
| SPELLS | Canister CRUD + large targeting/effect form; built-in ids cannot be deleted | Spells tab + list search + Retire for built-ins (this run) |
| SPELL DISCOVERY | Player `starterSpells` + minLevel; no discovery catalog | Missing |
| ACHIEVEMENTS | Canister CRUD + `active` flag | Achievements tab + list search + Active/Inactive chips |
| CHALLENGES | Hardcoded `DEFAULT_CHALLENGES` | Missing — do not add an empty tab |
| AI | Constants in `gameConstants.ts` / `engine/enemyAI.ts` | Missing |
| FORMATIONS | Not a first-class config type | Missing |
| ENCOUNTERS | Runtime spawn + tiers + regions | Enemy Tiers + Regions only |
| DUNGEONS | `DungeonRecord` / chain persist | Missing |
| WORLD | Regions + map modifiers + paper palette | Regions / Modifiers / Visuals |
| VISUAL ASSETS | Enemy URL, player 4-facing URLs, ad image URLs | Scattered; Visuals tab is palette-only (copy this run); no pool/weights |
| ECONOMY | GameKey/Mollie (PR #258) + grant/ban; packages API unused by player path | Shop / Purchases |
| SYSTEM CONFIG | All nine LevelUpConfig fields, role grant, Boss Rush (canister-live), palette | Settings / Boss Rush / Visuals |
| SIMULATION | None | Missing — do not add a writer |
| TELEMETRY | None | Missing |
| HEALTH / AUDIT | Canister `getAdminAuditLog` + rollback writers; frontend mock stub; **no owner tab** | Settings CatalogNote only |
| BANS | `getBannedPrincipals` | Shop banned list |

**Live tabs (15, still flat):** Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.  
File: `src/frontend/src/components/AdminDashboard.tsx` (one ~8.3k-line module). Purchases: `AdminGameKeyPurchases.tsx`.

Older still-open PRs: #327 / #331 do not overlap admin files. #333 is docs-only. **#334** (`AdminDashboard.tsx` tier leftover + Settings/Boss Rush copy) is older in the merge queue — this branch **unions** that delta (one `TierConfigTab`, no overwrite).

---

## Recapture — do not reopen AUTO_FIXED

| ACTION_ID | Status 2026-09-21 |
| :--- | :--- |
| AUX-DEL-NO-CONFIRM | AUTO_FIXED (still present) |
| AUX-SHOP-NO-CONFIRM | AUTO_FIXED (still present) |
| AUX-TRANSFER-COPY-MISLEAD | AUTO_FIXED — heading/button still say “Transfer”; body is honest grant |
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
| AUX-LEVELUP-PARTIAL | AUTO_FIXED (all nine fields + disclosure) |
| AUX-GAMEKEY-NO-CONFIRM | AUTO_FIXED |
| AUX-UNBAN-COPY-STALE | AUTO_FIXED |
| AUX-UNBAN-NO-ASSERT | AUTO_FIXED |
| AUX-NO-BANNED-LIST | AUTO_FIXED |
| AUX-SPELL-DELETE-BUILTIN | AUTO_FIXED this run |
| AUX-PRESET-DELETE-NO-CONFIRM | AUTO_FIXED this run |
| AUX-LOADING-INCOMPLETE | AUTO_FIXED this run |
| AUX-BOSS-SPELL-POOL-UNFILTERED | AUTO_FIXED this run |
| AUX-VISUALS-TAB-SCOPE | AUTO_FIXED this run (copy) |
| AUX-SIDEBAR-COUNTS-INCOMPLETE | AUTO_FIXED this run (names + bosses) |
| AUX-PII-PURCHASES | PARTIAL — search/status; no redact |
| AUX-LIST-NO-FILTER-SORT | PARTIAL — substring search; no sort/facets |
| AUX-BOSS-ABILITY-WALL | PARTIAL — filter only |
| AUX-DIRTY-UNUSED | PARTIAL — leave-editor; `isDirty` still false; bosses not covered |
| AUX-BOSS-LOCALSTORAGE-AS-LIVE | PARTIAL — draft copy + Save browser draft; no canister writer |
| AUX-NAV-FLAT-15 | PARTIAL — overflow only; no grouped IA |
| AUX-ENEMY-STATS-INCOMPLETE | PARTIAL — spawn-template copy; combat fields not on persist path |
| AUX-SHOP-PACKAGES-MISSING | SUPERSEDED — GameKey/Mollie |
| AUX-LIFE-NO-STATES | NEW — do not implement without approval |
| AUX-NO-HEALTH-AUDIT | NEW — `getAdminAuditLog` exists; no tab |
| AUX-SPELL-FORM-MONOLITH | NEW |
| AUX-SPELL-NO-SUMMON-CONTROLS | NEW this recapture |
| AUX-BOSS-LEAVE-UNWARNED | NEW this recapture |
| AUX-NO-DEPENDENCY-VIEWS | NEW |
| AUX-NAV-NO-OVERVIEW | NEW |
| AUX-NO-GLOBAL-SEARCH | NEW |
| AUX-ASSET-NO-POOL | NEW |
| AUX-DOMAIN-GAPS | REPORT_ONLY |
| AUX-NO-BULK-OPS | NEW |
| AUX-NO-SIMULATION | REPORT_ONLY |
| AUX-NO-TELEMETRY | REPORT_ONLY |
| AUX-MODIFIER-DOKA-MISPLACED | NEW |
| AUX-SAVE-FEEDBACK-SPLIT | NEW |
| AUX-NO-BREADCRUMBS | NEW |
| AUX-NO-MOBILE-ADMIN | REPORT_ONLY |
| AUX-HEX-VS-OKLCH | REPORT_ONLY |
| AUX-LANDING-EASTER-EGG | REPORT_ONLY |

---

## Recommended IA (proposal — do not implement until approved)

```
OVERVIEW          last writes (getAdminAuditLog), draft vs live counts
CONTENT
  Enemies         list + search → editor + dependency rail
  Bosses          staged edit (local draft ≠ live; type-align Motoko)
  Spells          sectioned editor + summon controls + retire (not delete) for built-ins
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
  Visual Assets   pools, weights (new) — Visuals today is palette only
  Ad Boxes
ECONOMY / OPS
  Shop            GameKey grant/ban + banned list (packages retired)
  Purchases       GameKey approve/reject
  Boss Rush
  System Config
HEALTH
  Audit           getAdminAuditLog + orphan IDs + rollback confirms
  Telemetry       persist-ok/fail, grants, bans
```

Do **not** add Simulation until there is a read-only runner that cannot write wallets.  
Do **not** add empty Challenges/AI/Formations/Dungeons/Telemetry tabs.

---

## Auto-fixes this run (SAFE_TO_AUTO_IMPLEMENT only)

1. Built-in spell ids: hide ×, show Retire → editor, client + mutation guard matching Motoko (`usableByPlayer=false`)
2. Enemy local presets: confirm before delete (catalog rows unchanged)
3. Header “Saving…” includes achievement / name / game-config mutations
4. Boss phase spell pool: same substring filter as abilities
5. Visuals tab CatalogNote: palette only; empty custom visual is valid
6. Sidebar counts: Enemy Names + Bosses (19 kits)

Major grouping, lifecycle state machine, dependency graph, new domains, Health tab, summon editor, and boss canister writer remain **HUMAN_APPROVAL_REQUIRED**.

# Admin UX & Information Architecture Audit — 2026-09-23

**Auditor:** Admin UX & Information Architecture Auditor  
**SOURCE_AUTOMATION:** Admin UX & Information Architecture Auditor  
**HEAD inspected:** `cursor/admin-dashboard-audit-4bef` @ origin/main `0f5363f`  
**Scope:** Owner tool only (`AdminDashboard.tsx`, `AdminGameKeyPurchases.tsx`, admin hooks, `adminSafety.ts`, backend admin API). Gameplay math / RAF / map gen not touched.  
**Prior pass:** [`ADMIN_UX_AUDIT_2026-09-22.md`](./ADMIN_UX_AUDIT_2026-09-22.md) (queued on #413; not on main)

This is an **owner console**, not a player HUD. Optimize for speed, clarity, safety, discoverability, density, low operator error, and content scale.

DESIGN.md identity (carved-stone, gold, crimson) is preserved on the owner tool. Decorative orbs / player HUD patterns are not imposed. Admin `C` tokens remain hex (owner-tool-only; see AUX-HEX-VS-OKLCH).

---

## Capability map (inspected, not imposed)

| Domain (prompt) | Actual capability | Admin surface today |
| :--- | :--- | :--- |
| OVERVIEW | None | Missing |
| ENEMIES | Canister CRUD spawn templates (`hp/ap/mp/init/level/regions/spriteUrl`) | Enemies tab + list search + spawn-template copy + preset confirm/overwrite |
| BOSSES | 19 kits; **localStorage** `pbv_boss_configs` — Motoko writer unused; frontend types diverge | Bosses tab (draft copy + ability + spell-pool filter + leave warning + schema note) |
| SPELLS | Canister CRUD + large targeting/effect form; built-in ids cannot be deleted | Spells tab + Retire + Retired/Built-in chips |
| SPELL DISCOVERY | Player `starterSpells` + minLevel; no discovery catalog | Missing |
| ACHIEVEMENTS | Canister CRUD + `active` flag | Achievements tab + list search + Active/Inactive chips + live CatalogNote |
| CHALLENGES | Hardcoded `DEFAULT_CHALLENGES` | Missing — do not add an empty tab |
| AI | Constants in `gameConstants.ts` / `engine/enemyAI.ts` | Missing |
| FORMATIONS | Not a first-class config type | Missing |
| ENCOUNTERS | Runtime spawn + tiers + regions | Enemy Tiers + Regions only |
| DUNGEONS | `DungeonRecord` / chain persist | Missing |
| WORLD | Regions + map modifiers + paper palette | Regions / Modifiers / Visuals |
| VISUAL ASSETS | Enemy URL, player 4-facing URLs, ad image URLs | Scattered; Visuals tab is palette-only; no pool/weights |
| ECONOMY | GameKey/Mollie (PR #258) + grant/ban; packages API unused by player path | Shop / Purchases |
| SYSTEM CONFIG | All nine LevelUpConfig fields, role grant, Boss Rush (canister-live), palette | Settings / Boss Rush / Visuals |
| SIMULATION | None | Missing — do not add a writer |
| TELEMETRY | None | Missing |
| HEALTH / AUDIT | Canister `getAdminAuditLog` + rollback writers; frontend mock stub; **no owner tab** | Settings CatalogNote only |
| BANS | `getBannedPrincipals` | Shop banned list |

**Live tabs (15, still flat):** Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.  
File: `src/frontend/src/components/AdminDashboard.tsx` (one ~8.6k-line module). Purchases: `AdminGameKeyPurchases.tsx`.

Older still-open PRs overlapping this file: **#334**, **#341**, **#413**, **#415**, **#437**, **#457**, **#460**. This branch **unions** those deltas (one `TierConfigTab` / one `SpellList` / one `BossesTab` header / one `achievementConditionTaken`, no overwrite).

---

## Recapture — do not reopen AUTO_FIXED

| ACTION_ID | Status 2026-09-23 |
| :--- | :--- |
| AUX-DEL-NO-CONFIRM | AUTO_FIXED |
| AUX-SHOP-NO-CONFIRM | AUTO_FIXED |
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
| AUX-LEVELUP-PARTIAL | AUTO_FIXED |
| AUX-GAMEKEY-NO-CONFIRM | AUTO_FIXED |
| AUX-UNBAN-COPY-STALE | AUTO_FIXED |
| AUX-UNBAN-NO-ASSERT | AUTO_FIXED |
| AUX-NO-BANNED-LIST | AUTO_FIXED |
| AUX-SPELL-DELETE-BUILTIN | AUTO_FIXED (union #341/#413) |
| AUX-PRESET-DELETE-NO-CONFIRM | AUTO_FIXED (union #341/#413) |
| AUX-LOADING-INCOMPLETE | AUTO_FIXED (union #341; this run also LevelUp / palette / ads / Boss Rush Saving…) |
| AUX-BOSS-SPELL-POOL-UNFILTERED | AUTO_FIXED (union #341/#413) |
| AUX-VISUALS-TAB-SCOPE | AUTO_FIXED (union #341/#413) |
| AUX-SIDEBAR-COUNTS-INCOMPLETE | AUTO_FIXED (union #341/#413; names + 19 kits) |
| AUX-BOSS-LEAVE-UNWARNED | AUTO_FIXED (union #413) |
| AUX-SPELL-RETIRED-UNLABELED | AUTO_FIXED (union #413) |
| AUX-PRESET-OVERWRITE-NO-CONFIRM | AUTO_FIXED (union #413) |
| AUX-NAMES-INIT-NO-CONFIRM | AUTO_FIXED this run |
| AUX-BOSSRUSH-PUBLISH-NO-CONFIRM | AUTO_FIXED this run |
| AUX-PALETTE-RESET-NO-CONFIRM | AUTO_FIXED this run |
| AUX-ADS-SAVE-SILENT-ERROR | AUTO_FIXED this run |
| AUX-LEVELUP-NO-SAVING | AUTO_FIXED this run |
| AUX-PALETTE-NO-SAVING | AUTO_FIXED this run |
| AUX-ACHIEVEMENT-DUP-CONDITION | AUTO_FIXED this run (UI; helper union #460) |
| AUX-PII-PURCHASES | PARTIAL — search/status; no redact |
| AUX-LIST-NO-FILTER-SORT | PARTIAL — substring search; no sort/facets |
| AUX-BOSS-ABILITY-WALL | PARTIAL — filter only |
| AUX-DIRTY-UNUSED | PARTIAL — leave-editor covers bosses; `isDirty` still false |
| AUX-BOSS-LOCALSTORAGE-AS-LIVE | PARTIAL — draft copy + Save browser draft; no canister writer |
| AUX-NAV-FLAT-15 | PARTIAL — overflow only; no grouped IA |
| AUX-ENEMY-STATS-INCOMPLETE | PARTIAL — spawn-template copy; combat fields not on persist path |
| AUX-SHOP-PACKAGES-MISSING | SUPERSEDED — GameKey/Mollie |
| AUX-LIFE-NO-STATES | NEW — do not implement without approval |
| AUX-NO-HEALTH-AUDIT | NEW — `getAdminAuditLog` exists; no tab |
| AUX-SPELL-FORM-MONOLITH | NEW |
| AUX-SPELL-NO-SUMMON-CONTROLS | NEW |
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

Unique vs #413 / #341 / #334 / #415 / #457 / #460:

1. Enemy Names **Load Defaults** confirms before the live 90-name pool write; button shows Saving…
2. Boss Rush **Publish** confirms (live JSON, not a draft) and the button shows Saving…
3. Visuals **Reset editor to Random** confirms (local cache only; canister unchanged until Save Palette); Save Palette shows Saving…
4. Ad box Save/Clear toast on actor failure (was a silent “Error” chip) and Saving…; missing slots use `adBoxAt` empty default
5. Level-up Save Config shows Saving… while `adminSetLevelUpConfig` is in flight
6. Achievement Save blocks a second **active** row with the same condition (`achievementConditionTaken`, helper unioned from #460)

1. Enemy Names **Load Defaults** confirms before the live 90-name pool write; button shows Saving…
2. Boss Rush **Publish** confirms (live JSON, not a draft) and the button shows Saving…
3. Visuals **Reset editor to Random** confirms (local cache only; canister unchanged until Save Palette); Save Palette shows Saving…
4. Ad box Save/Clear toast on actor failure (was a silent “Error” chip) and Saving…; missing slots use `adBoxAt` empty default
5. Level-up Save Config shows Saving… while `adminSetLevelUpConfig` is in flight

Unioned from older still-open PRs so oldest-first merge stays one implementation per name:

- Built-in spell delete blocked (Retire → editor + client/mutation guard)
- Enemy preset delete + same-name overwrite confirm
- Header Saving… includes achievement / name / game-config / name-pool init / Boss Rush
- Boss spell-pool filter; leave-editor covers expanded kits
- Visuals palette-only copy; sidebar names + 19 boss kits
- Spell list Retired chip (never looks live)
- Tier leftover 95% default + Settings/Boss Rush/achievement CatalogNotes
- Boss schema (frontend vs Motoko) + empty custom art is valid default
- `adBoxAt` / `achievementLiveRewardRejected` (#437)

Major grouping, lifecycle state machine, dependency graph, new domains, Health tab, summon editor, and boss canister writer remain **HUMAN_APPROVAL_REQUIRED**.

# Admin UX & Information Architecture Audit — 2026-09-24

**Auditor:** Admin UX & Information Architecture Auditor  
**SOURCE_AUTOMATION:** Admin UX & Information Architecture Auditor  
**HEAD inspected:** `cursor/admin-dashboard-audit-e451` @ origin/main `0f5363f`  
**Scope:** Owner tool only (`AdminDashboard.tsx`, `AdminGameKeyPurchases.tsx`, admin hooks, `adminSafety.ts`, backend admin API). Gameplay math / RAF / map gen not touched.  
**Prior pass:** [`ADMIN_UX_AUDIT_2026-09-23.md`](./ADMIN_UX_AUDIT_2026-09-23.md) (queued on #470; not on main)

This is an **owner console**, not a player HUD. Optimize for speed, clarity, safety, discoverability, density, low operator error, and content scale.

DESIGN.md identity (carved-stone, gold, crimson) is preserved on the owner tool. Decorative orbs / player HUD patterns are not imposed. Admin `C` tokens remain hex (owner-tool-only; see AUX-HEX-VS-OKLCH).

---

## Capability map (inspected, not imposed)

| Domain (prompt) | Actual capability | Admin surface today |
| :--- | :--- | :--- |
| OVERVIEW | None | Missing |
| ENEMIES | Canister CRUD spawn templates (`hp/ap/mp/init/level/regions/spriteUrl`) | Enemies tab + list search + spawn-template copy + preset confirm/overwrite |
| BOSSES | 19 kits; **localStorage** `pbv_boss_configs` — Motoko writer unused; frontend types diverge | Bosses tab (draft copy + ability + spell-pool filter + leave warning + schema note) |
| SPELLS | Canister CRUD + large targeting/effect form; built-in ids cannot be deleted; `range` now capped at 20 in the editor/mutation | Spells tab + Retire + Retired/Built-in chips + Range hint |
| SPELL DISCOVERY | Player `starterSpells` + minLevel; no discovery catalog | Missing |
| ACHIEVEMENTS | Canister CRUD + `active` flag | Achievements tab + list search + Active/Inactive chips + live CatalogNote |
| CHALLENGES | Hardcoded `DEFAULT_CHALLENGES` | Missing — do not add an empty tab |
| AI | Constants in `gameConstants.ts` / `engine/enemyAI.ts` | Missing |
| FORMATIONS | Not a first-class config type | Missing |
| ENCOUNTERS | Runtime spawn + tiers + regions | Enemy Tiers + Regions only |
| DUNGEONS | `DungeonRecord` / chain persist | Missing |
| WORLD | Regions + map modifiers + paper palette | Regions / Modifiers / Visuals |
| VISUAL ASSETS | Enemy URL, player 4-facing URLs, ad image URLs | Scattered; Visuals tab is palette-only; no pool/weights. Empty custom visual is a valid default. |
| ECONOMY | GameKey/Mollie (PR #258) + grant/ban; packages API unused by player path | Shop / Purchases |
| SYSTEM CONFIG | All nine LevelUpConfig fields, role grant, Boss Rush, palette, tiers, ground Doka | Settings / Boss Rush / Visuals / Tiers / Modifiers |
| SIMULATION | None | Missing — do not add a writer |
| TELEMETRY | None | Missing |
| HEALTH / AUDIT | Canister `getAdminAuditLog` + rollback writers; frontend mock stub; **no owner tab** | Settings CatalogNote only |
| BANS | `getBannedPrincipals` | Shop banned list |

**Live tabs (15, still flat):** Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.  
File: `src/frontend/src/components/AdminDashboard.tsx` (one ~8.7k-line module). Purchases: `AdminGameKeyPurchases.tsx`.

Older still-open PRs overlapping AdminDashboard: **#334**, **#341**, **#413**, **#415**, **#437**, **#457**, **#460**, **#470**, **#512**, **#531**. This branch keeps **unique 09-24 hunks only** on `AdminDashboard.tsx` (Btn intercept, ConfirmDialog Escape, spell range) so oldest-first 3-way merge applies them onto those unions. Do not vendor #470’s 800-line delta vs `main`. `spellTargetingRejected` matches **#512** (frontend file only; Motoko gate stays on #512). Live-publish copy lives in `adminOwnerUx.livePublish.ts`. `adminOwnerUx.ts` matches #470 so both-add is identical.

---

## Recapture — do not reopen AUTO_FIXED

| ACTION_ID | Status 2026-09-24 |
| :--- | :--- |
| AUX-DEL-NO-CONFIRM … AUX-ACHIEVEMENT-DUP-CONDITION | AUTO_FIXED on #470 / earlier (unioned) |
| AUX-NAMES-INIT-NO-CONFIRM | AUTO_FIXED (#470) |
| AUX-BOSSRUSH-PUBLISH-NO-CONFIRM | AUTO_FIXED (#470) |
| AUX-PALETTE-RESET-NO-CONFIRM | AUTO_FIXED (#470) |
| AUX-ADS-SAVE-SILENT-ERROR | AUTO_FIXED (#470) |
| AUX-LEVELUP-NO-SAVING | AUTO_FIXED (#470) |
| AUX-PALETTE-NO-SAVING | AUTO_FIXED (#470) |
| AUX-TIER-PUBLISH-NO-CONFIRM | AUTO_FIXED this run |
| AUX-GAMECONFIG-PUBLISH-NO-CONFIRM | AUTO_FIXED this run |
| AUX-LEVELUP-PUBLISH-NO-CONFIRM | AUTO_FIXED this run |
| AUX-PALETTE-SAVE-NO-CONFIRM | AUTO_FIXED this run |
| AUX-SPELL-RANGE-UNBOUNDED | AUTO_FIXED this run (UI + mutation; Motoko on #512) |
| AUX-CONFIRM-NO-ESCAPE | AUTO_FIXED this run |
| AUX-PII-PURCHASES | PARTIAL — search/status; no redact. Escape on Purchases is #492. |
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
| AUX-SPELL-NO-SUMMON-CONTROLS | NEW — CatalogNote only; no summon field editor |
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

**Visual-asset UX (still missing as a system):** Default Pixel Visual vs Custom Override is labeled on enemies/sprites/ads. There is still no weighted pool, activate/deactivate, or first-class revert-to-default control. Empty remains a valid default — never an error.

**Content lifecycle:** Achievement `active` and modifier `active` remain the only lifecycle bits. Boss Save is still a browser draft. Other Saves publish live after confirm (this run: tiers / ground Doka / level-up / palette).

**Dependency UX:** still none. Spell → pools/achievements/challenges and enemy → formations/encounters stay HUMAN.

---

## Auto-fixes this run (SAFE_TO_AUTO_IMPLEMENT only)

Unique vs the oldest-first prefix (includes #470 + #531 Visuals copy):

1. Enemy Tiers / Level-up / Palette / ground Doka gold **Save** buttons intercept through `Btn` (`adminLivePublishSpec`) and show a ConfirmDialog before the live write. PREFIX tab hunks stay untouched so oldest-first 3-way merge stays clean.
2. Spell editor rejects `range` / hitTiles offsets beyond 20 (`spellTargetingRejected`, same helper as #512). Motoko gate stays on #512.
3. Owner `ConfirmDialog` cancels on Escape and dimmer click (never the confirm action)

Unioned from older still-open admin PRs so oldest-first merge stays one implementation per name:

- Built-in spell Retire; Retired catalog chip; preset delete/overwrite confirm
- Boss leave-editor; spell-pool filter; Visuals palette-only; sidebar names + 19 kits
- Names Load Defaults confirm; Boss Rush Publish confirm + Saving…
- Ad Save/Clear toast + Saving… + `adBoxAt`; LevelUp/Palette Saving…
- Duplicate active achievement condition blocked
- Tier leftover / Settings / feat CatalogNotes; ShopPackage leftover copy

Major grouping, lifecycle state machine, dependency graph, new domains, Health tab, summon editor, and boss canister writer remain **HUMAN_APPROVAL_REQUIRED**.

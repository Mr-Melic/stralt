# Admin UX & Information Architecture Audit — 2026-09-25

**Auditor:** Admin UX & Information Architecture Auditor  
**SOURCE_AUTOMATION:** Admin UX & Information Architecture Auditor  
**HEAD inspected:** `cursor/admin-dashboard-audit-c1e0` on `origin/main` `0f5363f` (#332), plus still-open owner-tool siblings (#334, #341, #413, #415, #437, #457, #460, #470, #512, #531, #539).  
**Scope:** Owner tool only (`AdminDashboard.tsx`, `AdminGameKeyPurchases.tsx`, admin hooks, backend admin API). Gameplay math / RAF / map gen not touched.  
**Prior pass:** 2026-09-24 (#539) — system-config live-publish confirms, ConfirmDialog Escape, spell range cap. IDs: [`ACTION_IDS_ADMIN_UX_2026-09-25.md`](./ACTION_IDS_ADMIN_UX_2026-09-25.md)

This is an **owner console**, not a player HUD. Optimize for speed, clarity, safety, discoverability, density, low operator error, and content scale.

DESIGN.md identity (carved-stone, gold, crimson) is preserved on the owner tool. Decorative orbs / player HUD patterns are not imposed. Admin `C` tokens stay owner-tool hex.

---

## Capability map (inspected, not imposed)

| Domain (prompt) | Actual capability | Admin surface today |
| :--- | :--- | :--- |
| OVERVIEW | None | Missing |
| ENEMIES | Canister CRUD spawn templates (`hp/ap/mp/init/level/regions/spriteUrl`) | Enemies tab + list search |
| BOSSES | 19 kits; **localStorage** `pbv_boss_configs` — Motoko `getAllBossConfigs` / `adminSetBossConfig` exist but frontend record does not match | Bosses tab (draft copy + ability filter) |
| SPELLS | Canister CRUD + large targeting/effect form; summon fields persist | Spells tab + **summon controls this run** |
| SPELL DISCOVERY | Player `starterSpells` + minLevel; no discovery catalog | Missing |
| ACHIEVEMENTS | Canister CRUD + `active` flag | Achievements tab + list search |
| CHALLENGES | Hardcoded `DEFAULT_CHALLENGES` | Missing — do not add an empty tab |
| AI | Constants in `gameConstants.ts` / `engine/enemyAI.ts` | Missing |
| FORMATIONS | Not a first-class config type | Missing |
| ENCOUNTERS | Runtime spawn + tiers + regions | Enemy Tiers + Regions only |
| DUNGEONS | `DungeonRecord` / chain persist | Missing |
| WORLD | Regions + map modifiers + paper palette | Regions / Modifiers / Visuals |
| VISUAL ASSETS | Enemy URL, player 4-facing URLs, ad image URLs | Scattered; no pool/weights. Empty = Default Pixel Visual (valid) |
| ECONOMY | GameKey/Mollie (PR #258) + grant/ban | Shop / Purchases |
| SYSTEM CONFIG | All nine LevelUpConfig fields, role grant, Boss Rush (canister-live), palette | Settings / Boss Rush / Visuals |
| SIMULATION | None | Missing — do not add a writer |
| TELEMETRY | None | Missing |
| HEALTH / AUDIT | Canister `getAdminAuditLog` + rollback writers; frontend mock stub; **no owner tab** | Tab error banners only |
| BANS | `getBannedPrincipals` | Shop banned list |

**Live tabs (15, still flat):** Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.

---

## Recapture — do not reopen AUTO_FIXED

Queued on older still-open PRs (do not vendor their dashboards onto `main`):

| ACTION_ID | Status 2026-09-25 |
| :--- | :--- |
| AUX-DEL-NO-CONFIRM … AUX-GAMEKEY-NO-CONFIRM | AUTO_FIXED (still present on main or queued) |
| AUX-SPELL-DELETE-BUILTIN / AUX-PRESET-* / AUX-LOADING-INCOMPLETE / AUX-BOSS-SPELL-POOL-UNFILTERED / AUX-VISUALS-TAB-SCOPE / AUX-SIDEBAR-COUNTS-INCOMPLETE | AUTO_FIXED #341 |
| AUX-BOSS-LEAVE-UNWARNED / AUX-SPELL-RETIRED-UNLABELED / AUX-PRESET-OVERWRITE-NO-CONFIRM | AUTO_FIXED #413 |
| AUX-NAMES-INIT-NO-CONFIRM / AUX-BOSSRUSH-PUBLISH-NO-CONFIRM / AUX-PALETTE-RESET-NO-CONFIRM / AUX-ADS-SAVE-SILENT-ERROR / AUX-LEVELUP-NO-SAVING / AUX-PALETTE-NO-SAVING / AUX-ACHIEVEMENT-DUP-CONDITION | AUTO_FIXED #470 |
| AUX-TIER-PUBLISH-NO-CONFIRM / AUX-GAMECONFIG-PUBLISH-NO-CONFIRM / AUX-LEVELUP-PUBLISH-NO-CONFIRM / AUX-PALETTE-SAVE-NO-CONFIRM / AUX-SPELL-RANGE-UNBOUNDED / AUX-CONFIRM-NO-ESCAPE | AUTO_FIXED #539 |
| AUX-SHOP-PACKAGES-MISSING | SUPERSEDED — GameKey/Mollie |
| AUX-SPELL-NO-SUMMON-CONTROLS | AUTO_FIXED this run (`SpellSummonFields`) |
| AUX-CATALOG-SAVE-LOOKS-LIKE-DRAFT | PARTIAL — note on summon section only |
| AUX-SHOP-GRANT-DOUBLE-SUBMIT | NEW — not patched (AdminDashboard #341 overlap) |
| AUX-LIFE-NO-STATES / AUX-NAV-FLAT-15 / AUX-NO-HEALTH-AUDIT | NEW — HUMAN_APPROVAL_REQUIRED |
| AUX-DOMAIN-GAPS | REPORT_ONLY — no fake tabs |

---

## Recommended IA (proposal — do not implement until approved)

```
OVERVIEW          last writes (getAdminAuditLog), draft vs live counts
CONTENT
  Enemies         list + search → editor + dependency rail
  Bosses          staged edit (local draft ≠ live; type-align Motoko)
  Spells          sectioned editor + acquisition (summon fields now present)
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
  System Config
HEALTH
  Audit           getAdminAuditLog + orphan IDs
  Telemetry       persist-ok/fail, grants, bans
```

Do **not** add Simulation until there is a read-only runner that cannot write wallets.  
Do **not** add empty Challenges/AI/Formations/Dungeons/Telemetry tabs.

---

## Auto-fixes this run (SAFE_TO_AUTO_IMPLEMENT only)

1. Spell editor: Summon section (AI, lifespan, piece, level, hp/damage scale) via a unique insert after Physical Attack. Files: `adminOwnerUx.summon.ts`, `SpellSummonFields.tsx`. Checkbox enables summon (fills hunter/pawn/lifespan 3).
2. Live-catalog copy on that Summon section (`adminOwnerUx.catalogPublish.ts`). Other entity Save rows left unlabeled so `--self` 3-way-merges after #341.

Shop grant busy-lock and flat IA remain unpatched on `AdminDashboard.tsx`.

Major grouping, lifecycle state machine, dependency graph, new domains, Health tab, and boss canister writer remain **HUMAN_APPROVAL_REQUIRED**.

Restack: do **not** vendor #470 / #539 AdminDashboard onto `main`. Unique 09-25 dashboard hunk is `SpellSummonFields` only. New helpers: `adminOwnerUx.summon.ts`, `adminOwnerUx.catalogPublish.ts` (not `adminOwnerUx.ts`).

# Admin UX & Information Architecture Audit — 2026-10-31

**Auditor:** Admin UX & Information Architecture Auditor  
**SOURCE_AUTOMATION:** Admin UX & Information Architecture Auditor  
**HEAD inspected:** `0f5363f` (`origin/main`, PR #332 merge)  
**Branch:** `cursor/admin-dashboard-ux-audit-8a0d`  
**Scope:** Owner tool only (`AdminDashboard.tsx`, `AdminGameKeyPurchases.tsx`, admin hooks, backend admin API). Gameplay math / RAF / map gen not touched.  
**Prior pass:** PR #1286 (`ADMIN_UX_AUDIT_2026-10-29.md`) — helpers only, not on this tree.

This is an **owner console**, not a player HUD. Optimize for speed, clarity, safety, discoverability, density, low operator error, and content scale.

DESIGN.md identity (carved-stone, gold, crimson, Space Grotesk / Inter / JetBrains Mono) is preserved. Decorative orbs / player HUD patterns are not imposed. Owner chrome uses the existing `C` hex tokens (AUX-HEX-VS-OKLCH).

---

## Capability map (inspected, not imposed)

| Domain (prompt) | Actual capability | Admin surface today |
| :--- | :--- | :--- |
| OVERVIEW | None | Missing — default tab is Enemies |
| ENEMIES | Canister CRUD spawn templates (`hp/ap/mp/init/level/regions/spriteUrl`) | Enemies tab + list search. Confirm copy still overclaims live encounters. |
| BOSSES | 19 kits; **localStorage** `pbv_boss_configs` — Motoko `getAllBossConfigs` / `adminSetBossConfig` exist but frontend record does not match | Bosses tab. Save = browser draft. Collapsed rows have no DRAFT chip. Leave-guard omits bosses. |
| SPELLS | Canister CRUD + large targeting/effect form. Built-in delete **retires** (`usableByPlayer=false`). Summon metadata saved but **no summon controls** on this tree | Spells tab + list search. No ACTIVE/RETIRED chip. |
| SPELL DISCOVERY | Player `starterSpells` + minLevel; no discovery catalog | Missing — do not add an empty tab |
| ACHIEVEMENTS | Canister CRUD + `active` flag | Achievements tab + list search |
| CHALLENGES | Hardcoded `DEFAULT_CHALLENGES` | Missing — do not add an empty tab |
| AI | Constants in `gameConstants.ts` / `engine/enemyAI.ts` | Missing |
| FORMATIONS | Not a first-class config type | Missing |
| ENCOUNTERS | Runtime spawn + tiers + regions | Enemy Tiers + Regions only |
| DUNGEONS | `DungeonRecord` / chain persist | Missing |
| WORLD | Regions + map modifiers + paper palette | Regions / Modifiers / Visuals |
| VISUAL ASSETS | Enemy URL, player 4-facing URLs, ad image URLs | Scattered; no pool/weights. Empty = valid Default Pixel Visual. Sprite **list** still lacks that chip. |
| ECONOMY | GameKey/Mollie (PR #258) + grant/ban; packages API unused by player path | Shop / Purchases. Ground Doka lives on Map Modifiers. |
| SYSTEM CONFIG | All nine LevelUpConfig fields, role grant, Boss Rush (canister-live), palette | Settings / Boss Rush / Visuals / Tiers. Tiers/Visuals never hydrate from canister. |
| SIMULATION | None | Missing — do not add a writer |
| TELEMETRY | None | Missing |
| HEALTH / AUDIT | Canister `getAdminAuditLog` + rollback writers; Settings CatalogNote admits no editor | No owner tab. Do not invent a second log. |
| BANS | `getBannedPrincipals` | Shop banned list (click fills unban field) |

**Live tabs (15, still flat):** Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.  
File: `src/frontend/src/components/AdminDashboard.tsx` (one ~8281-line module). Purchases: `AdminGameKeyPurchases.tsx`.

---

## Recapture — do not reopen AUTO_FIXED

| ACTION_ID | Status 2026-10-31 |
| :--- | :--- |
| AUX-DEL-NO-CONFIRM / AUX-SHOP-NO-CONFIRM / AUX-UNBAN-NO-CONFIRM / AUX-GAMEKEY-NO-CONFIRM | AUTO_FIXED (confirms still present) |
| AUX-VIS-NO-DEFAULT-DISTINCTION | AUTO_FIXED on **editors**; sprite **list** still missing the chip |
| AUX-ID-MUTABLE / AUX-VALIDATION-EMPTY-SAVE / AUX-SPRITE-FR-LABELS | AUTO_FIXED |
| AUX-AD-EMPTY-AS-ERROR / AUX-AD-CLEAR-NO-CONFIRM | AUTO_FIXED (empty = hidden valid default) |
| AUX-BOSSRUSH-LIVE-UNLABELED | AUTO_FIXED (CatalogNote + Publish copy) |
| AUX-ACCESS-FIRST-PLAYER-COPY | AUTO_FIXED |
| AUX-SHOP-PACKAGES-MISSING | SUPERSEDED — GameKey/Mollie |
| AUX-ENEMY-DELETE-COPY-HELPER / AUX-REVEAL-DEST-HELPER / AUX-MAILTO-DEAD-HELPER / AUX-SWALLOWED-HYDRATE-HELPER | AUTO_FIXED queued **#1286** (helpers, not wired) |
| AUX-OWNER-STATUS-HELPER / AUX-CONSENT-GATE-HELPER / AUX-SPELL-DELETE-COPY-HELPER / AUX-AD-HYDRATE-HELPER | AUTO_FIXED queued **#1223** |
| AUX-SPELL-NO-SUMMON-CONTROLS | AUTO_FIXED queued **#564** (`SpellSummonFields.tsx` — do not recreate) |
| AUX-ENEMY-DELETE-CONFIRM-COPY | NEW — helper #1286; EnemyList ~2278 still inverted |
| AUX-REVEAL-NO-DESTINATION | NEW — overlay hides destination email |
| AUX-MAILTO-HASH-LOOKS-LIVE | NEW — `href="#"` still painted as Open mailto |
| AUX-GAMECONFIG-CATCH-AS-LIVE | NEW / P0 — catch returns 10/40/5 as success |
| AUX-LEVELUP-HYDRATE-FAIL-SILENT | NEW — catch keeps `pbv_levelup_config` |
| AUX-BOSSRUSH-HYDRATE-FAIL-SILENT | NEW — catch `console.error` only |
| AUX-BOSS-ROW-NO-DRAFT-CHIP | NEW — helper this run; not wired |
| AUX-SPRITE-LIST-NO-DEFAULT-CHIP | NEW — helper this run; not wired |
| AUX-LIFE-NO-STATES | PARTIAL — HUMAN |
| AUX-BOSS-LOCALSTORAGE-AS-LIVE | PARTIAL — still `pbv_boss_configs` |
| AUX-NAV-FLAT-15 | PARTIAL |
| AUX-NO-HEALTH-AUDIT | PARTIAL — helper #838; Settings note only |
| AUX-DOMAIN-GAPS | REPORT_ONLY — no fake tabs |
| AUX-TIER-NO-CANISTER-HYDRATE | PARTIAL — Tiers never calls `getTierSpawnConfig` |
| AUX-VISUALS-NO-CANISTER-HYDRATE | PARTIAL — Visuals never calls `getColorPalette` |
| AUX-NO-MOBILE-ADMIN | PARTIAL — 44px helper #1115; Btn/Field/tabs still &lt;44px |

Restack: do **not** vendor #341/#413/#470/#539/#564/#838/#883/#945/#1001/#1066/#1115/#1190/#1223/#1286 `AdminDashboard` onto `main`. Unique hunks only.

---

## Visual-asset UX

Always distinguish **Default Pixel Visual** vs **custom override**. Empty is valid.

| Surface | Default vs custom | Gaps |
| :--- | :--- | :--- |
| Enemy editor | Status line uses `enemyVisualStatusCopy` (~726, ~835–844). Help before the URL field. | Single URL, no pool / weights / activate / revert control |
| Enemy list | Chip Default Pixel / Stored URL — not rendered (~2173–2234) | Thumbnail is the 👾 glyph, not the stored URL |
| Sprite editor | Preview shows “Default Pixel Visual — Active fallback” when empty (~1513–1523). Honesty copy before paste. | No revert-to-default control besides clearing URLs |
| Sprite list | Empty `frontUrl` uses chess-piece glyph (~1889–1904) — not an error | **Only chip is `characterPieceType`** (~1935). Helper this run. |
| Ads | “No custom ad — box hidden (valid default)” (~8220–8222). Specs before URL. Thumbnail when https. | Hydrate catch still swallows (#1223 helper) |
| Visuals (palette) | Reset copy is LS-only; Save publishes (~4924–4926) | Never hydrates `getColorPalette`. Reset has no confirm. |

Do not treat “no custom visual” as an error. Do not bind unused URLs into combat to make the copy true.

---

## Content lifecycle UX

Required states: **DRAFT / VALIDATION FAILED / READY TO ACTIVATE / ACTIVE / INACTIVE / LEGACY**.

Today:

- Most canister Saves publish **immediately** (enemies, regions, spells, modifiers, achievements, names, GameConfig, LevelUp, Boss Rush, palette, ads).
- Boss Save is a **browser draft** next to those live Saves. Collapsed rows have no DRAFT chip.
- Built-in spell Delete **retires** (`main.mo` ~882–894) but SpellList still looks ACTIVE. Confirm copy still says “removes the live spell immediately” (~3794).
- Failed GameConfig / LevelUp / Boss Rush hydrates still look like live values (10/40/5, LS draft, all rooms enabled).
- `dashState.isDirty` is hardcoded `false` (~5361). Leave-editor warns whenever an editor is open, not when dirty — and **omits bosses**.

Never make a saved draft appear live. Do not add a fake ACTIVE badge on `pbv_boss_configs`.

---

## Dependency UX

No relationship pane.

- Spell → enemy pools / achievements / challenges / bosses / AI / acquisition: only boss phase spell-pool chips when expanded.
- Enemy → spells / visual pool / formations / encounters / dungeon usage: regions checkboxes only. CatalogNote already says overworld spawn does **not** read `getEnemyConfigs`.
- Asset → enemy/boss usage: none.

Recommend read-only rails + badges after HUMAN approval. Helper queued #724. Do not fake counts.

---

## Recommended IA (proposal — do not implement until approved)

```
OVERVIEW          last writes (getAdminAuditLog), draft vs live counts
CONTENT
  Enemies         list + search → editor + dependency rail
  Bosses          staged edit (local draft ≠ live; type-align Motoko)
  Spells          sectioned editor + summon controls + lifecycle chips
  Achievements
  Enemy Names
WORLD
  Regions
  Tiers / Encounters   hydrate getTierSpawnConfig before publish
  Map Modifiers
PRESENTATION
  Player Sprites       Default Pixel chip on the list
  Visual Assets        hydrate getColorPalette; pools later
  Ad Boxes
ECONOMY / OPS
  Shop                 GameKey grant/ban + banned list
  Purchases            reveal destination + dead mailto
  Boss Rush            hydrate-fail banner
  System Config        GameConfig out of Modifiers; LevelUp
HEALTH
  Audit                getAdminAuditLog + rollback confirms
```

Do **not** add Simulation until there is a read-only runner that cannot write wallets.  
Do **not** add Challenges / AI / Formations / Dungeons / Telemetry / Spell Discovery tabs without a reader/writer.

---

## Auto-fixes this run (SAFE_TO_AUTO_IMPLEMENT only)

Helpers only — **not wired** into `AdminDashboard` / `AdminGameKeyPurchases` / `useAdminQueries` (oldest-first stack; unique files).

1. `adminOwnerUx.bossDraftChip.ts` — collapsed-row DRAFT copy  
2. `adminOwnerUx.spriteListChip.ts` — Default Pixel vs stored-URL chip (empty is valid)  
3. `adminOwnerUx.bossLeaveGuard.ts` — leave-guard must include expanded / unsaved boss drafts  
4. `adminOwnerUx.spellLifecycleChip.ts` — ACTIVE / RETIRED / INACTIVE (never DRAFT for canister rows)

Major grouping, lifecycle state machine, dependency graph, new domains, Health tab, summon controls, canister boss writer, Tiers/Visuals hydrate wiring remain **HUMAN_APPROVAL_REQUIRED**.

---

## Operator-risk highlights (still on `main`)

1. **P0** `useGetGameConfig` catch returns `{10, 40, 5}` as a successful query (`useAdminQueries.ts` ~239–244). Modifiers Save publishes that draft.  
2. **P0** Boss kits are localStorage while every other entity Save is live.  
3. **P0** Grant/Approve can resample the amount after the confirm title (#1115 helper).  
4. **P0** mailto embeds the 120-char GameKey (#1115 helper).  
5. **P1** Enemy Delete confirm is inverted vs CatalogNote.  
6. **P1** Tiers/Visuals save to canister from a form that never read canister.  
7. **P1** Built-in spell retire looks like a live delete on the list.  
8. **P1** Expanded boss editor is not in the unsaved-leave dialog.

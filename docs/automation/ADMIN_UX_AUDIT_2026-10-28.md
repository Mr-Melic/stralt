# Admin UX & Information Architecture Audit — 2026-10-28

**Auditor:** Admin UX & Information Architecture Auditor  
**SOURCE_AUTOMATION:** Admin UX & Information Architecture Auditor  
**HEAD inspected:** `origin/main` `0f5363f` (PR #332 merge) — same tip as 2026-09-29 / 2026-10-21…10-27  
**Scope:** Owner tool only (`AdminDashboard.tsx` 8280 lines, `AdminGameKeyPurchases.tsx` 885 lines, admin hooks, backend admin API). Gameplay math / RAF / map gen not touched.  
**Prior pass:** memories `2026-10-27` (#1190 reveal-format / purchase-busy / grant-draft / copy-followup helpers). Repo copies of 09-21…10-27 files live on those PRs, not on `main`. Oldest owner-UX sibling is still #341; last owner-UX code PR before this pass is #1190.

Do **not** recreate `adminOwnerUx.ts`, `adminOwnerUx.summon.ts`, `adminOwnerUx.catalogPublish.ts`, `adminOwnerUx.shopBusy.ts`, `adminOwnerUx.visualPreview.ts`, `adminOwnerUx.gameKeyBusy.ts`, `adminOwnerUx.confirmOnce.ts`, `adminOwnerUx.lifecycle.ts`, `adminOwnerUx.visualPool.ts`, `adminOwnerUx.deps.ts`, `adminOwnerUx.publishGate.ts`, `adminOwnerUx.listQuery.ts`, `adminOwnerUx.editorChrome.ts`, `adminOwnerUx.auditView.ts`, `adminOwnerUx.rollbackConfirm.ts`, `adminOwnerUx.piiRedact.ts`, `adminOwnerUx.dirty.ts`, `adminOwnerUx.entityJump.ts`, `adminOwnerUx.changelogPublish.ts`, `adminOwnerUx.spriteSaveClose.ts`, `adminOwnerUx.saveFeedback.ts`, `adminOwnerUx.entitySaveConfirm.ts`, `adminOwnerUx.configWriterBusy.ts`, `adminOwnerUx.confirmDismiss.ts`, `adminOwnerUx.configHydrate.ts`, `adminOwnerUx.overlayKey.ts`, `adminOwnerUx.visualRevert.ts`, `adminOwnerUx.namesBusy.ts`, `adminOwnerUx.roleGrant.ts`, `adminOwnerUx.confirmChrome.ts`, `adminOwnerUx.grantLink.ts`, `adminOwnerUx.principalGate.ts`, `adminOwnerUx.confirmEnter.ts`, `adminOwnerUx.revealMask.ts`, `adminOwnerUx.banReason.ts`, `adminOwnerUx.confirmSnapshot.ts`, `adminOwnerUx.mailtoSecret.ts`, `adminOwnerUx.confirmA11y.ts`, `adminOwnerUx.hitTarget.ts`, `adminOwnerUx.revealFormat.ts`, `adminOwnerUx.purchaseGlobalBusy.ts`, `adminOwnerUx.grantDraft.ts`, `adminOwnerUx.copyFollowup.ts`, or `SpellSummonFields.tsx`.  
Do **not** vendor #334 / #341 / #413 / #470 / #539 / #564 `AdminDashboard.tsx` onto `main`. Unique hunks only.

This is an **owner console**, not a player HUD. Optimize for speed, clarity, safety, discoverability, density, low operator error, and content scale.

DESIGN.md identity (carved-stone, gold, crimson) is preserved on the owner tool. Decorative orbs / player HUD patterns are not imposed. Owner `C` tokens remain raw hex (AUX-HEX-VS-OKLCH).

---

## Capability map (inspected, not imposed)

| Domain (prompt) | Actual capability | Admin surface today |
| :--- | :--- | :--- |
| OVERVIEW | None | Missing |
| ENEMIES | Canister CRUD spawn templates (`hp/ap/mp/init/level/regions/spriteUrl`) | Enemies tab + list search + Default Pixel / stored-URL chips. List glyph is still 👾. No revert control. Thumbnail helper queued #631 |
| BOSSES | 19 kits; **localStorage** `pbv_boss_configs` — Motoko `getAllBossConfigs` / `setBossConfig` exist; frontend record still diverges (`iconEmoji`/`loreText`/`chc` vs `defeated`/`adminNotes`) | Bosses tab (draft copy + ability filter + Save browser draft). Collapsed row still has no DRAFT chip. `hasOpenEditor` still omits bosses |
| SPELLS | Canister CRUD + large targeting/effect form; summon fields persist via adapter; **no summon controls on `main`**. Spell Type dropdown is damage/heal/drain only. Delete confirm claims immediate remove; built-in `#err` is toasted as “Failed to delete spell”; player-owned `#ok` retire is toasted as “Spell deleted” | Spells tab + list search. Summon editor queued in #564. Builtin-delete block queued in #341 |
| SPELL DISCOVERY | Player `starterSpells` + minLevel; no discovery catalog | Missing |
| ACHIEVEMENTS | Canister CRUD + `active` flag | Achievements tab + list search + Active/Inactive chip (binary eligible, not the six-state vocabulary) |
| CHALLENGES | Hardcoded `DEFAULT_CHALLENGES` | Missing — do not add an empty tab |
| AI | Constants in `gameConstants.ts` / `engine/enemyAI.ts` | Missing |
| FORMATIONS | Not a first-class config type | Missing |
| ENCOUNTERS | Runtime spawn + tiers + regions | Enemy Tiers + Regions only. **Tiers form never calls `getTierSpawnConfig`** |
| DUNGEONS | `DungeonRecord` / chain persist | Missing |
| WORLD | Regions + map modifiers + paper palette | Regions / Modifiers / Visuals. **Visuals never calls `getColorPalette`**. Ground Doka + leader boost sit on Map Modifiers |
| VISUAL ASSETS | Enemy URL, player 4-facing URLs, ad image URLs | Scattered; no pool/weights. Empty = Default Pixel Visual (valid, never an error). Ads have Clear to default + requirements before paste; **`getAdBoxes` catch leaves ""** so a failed load looks like the hidden default. Enemy/sprite have no Revert |
| ECONOMY | GameKey/Mollie (PR #258) + grant/ban; packages API still on actor | Shop / Purchases. Grant third arg is always `null`. **Purchases status uses `playerGameKeyStatusCopy`.** **`emailConsent` is mapped and never shown; Open mailto is not gated.** Grant amount Field coerces empty → 0. Grant/Ban/Unban parse `Principal.fromText` after confirm. Ban uses `adminBanAccount` with no reason |
| SYSTEM CONFIG | All nine LevelUpConfig fields, role grant, Boss Rush (canister-live), palette | Settings / Boss Rush / Visuals. Level-up and Boss Rush hydrate. Tiers and Visuals do not. Palette Reset is localStorage only. Transfer Admin is typed TRANSFER with no ConfirmDialog |
| SIMULATION | None | Missing — do not add a writer |
| TELEMETRY | None | Missing |
| HEALTH / AUDIT | Canister `getAdminAuditLog` + rollback writers; frontend mock stub returns `notAdmin`; **no owner tab**. `setAppVersion` / `setChangelog` have no editors | Tab error banners + Settings honesty note only. Reader helper queued #838 |
| BANS | `getBannedPrincipals` | Shop banned list (empty = valid default). No reason field |

**Live tabs (15, still flat):** Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.  
File: `src/frontend/src/components/AdminDashboard.tsx` (8280 lines, one module). Purchases: `AdminGameKeyPurchases.tsx` (885 lines).

Do **not** vendor older AdminDashboard PRs onto `main`. Unique hunks only so `--self` 3-way-merges after #334 / #341 / #413 / #415 / #437 / #457 / #460 / #470 / #512 / #531 / #539 / #564. Purchases overlap is #492 / #664 / #838 / #1066 / #1115 / #1190.

---

## Recapture — do not reopen AUTO_FIXED (queued PRs still open)

| ACTION_ID | Status 2026-10-28 |
| :--- | :--- |
| AUX-DEL-NO-CONFIRM | AUTO_FIXED (present on `main`) |
| AUX-SHOP-NO-CONFIRM | AUTO_FIXED (present; unban + GameKey confirms) |
| AUX-TRANSFER-COPY-MISLEAD | AUTO_FIXED (copy honest; dialog still missing) |
| AUX-VIS-NO-DEFAULT-DISTINCTION | AUTO_FIXED |
| AUX-ID-MUTABLE | AUTO_FIXED |
| AUX-VALIDATION-EMPTY-SAVE | AUTO_FIXED |
| AUX-SPRITE-FR-LABELS | AUTO_FIXED |
| AUX-UNBAN-NO-CONFIRM | AUTO_FIXED |
| AUX-SHOP-SHARED-PRINCIPAL | AUTO_FIXED |
| AUX-SPRITE-LEAVE-UNWARNED | AUTO_FIXED |
| AUX-THEME-SPLIT | AUTO_FIXED |
| AUX-AD-CLEAR-NO-CONFIRM | AUTO_FIXED |
| AUX-AD-EMPTY-AS-ERROR | AUTO_FIXED (empty after a **successful** load is still valid) |
| AUX-BOSSRUSH-LIVE-UNLABELED | AUTO_FIXED |
| AUX-ACCESS-FIRST-PLAYER-COPY | AUTO_FIXED |
| AUX-LEVELUP-PARTIAL | AUTO_FIXED (nine fields visible; hydrates `getLevelUpConfig`) |
| AUX-GAMEKEY-NO-CONFIRM | AUTO_FIXED |
| AUX-UNBAN-COPY-STALE | AUTO_FIXED |
| AUX-UNBAN-NO-ASSERT | AUTO_FIXED |
| AUX-NO-BANNED-LIST | AUTO_FIXED |
| AUX-SPELL-DELETE-BUILTIN | AUTO_FIXED queued #341 (Delete still shown on `main`; canister `#err`) |
| AUX-PRESET-DELETE-NO-CONFIRM | AUTO_FIXED queued #341 |
| AUX-LOADING-INCOMPLETE | AUTO_FIXED queued #341 (`anyPending` still omits names/achievements/gameConfig/ads/shop/bossRush ~5628) |
| AUX-BOSS-SPELL-POOL-UNFILTERED | AUTO_FIXED queued #341 |
| AUX-VISUALS-TAB-SCOPE | AUTO_FIXED queued #341 |
| AUX-SIDEBAR-COUNTS-INCOMPLETE | AUTO_FIXED queued #341 |
| AUX-BOSS-LEAVE-UNWARNED | AUTO_FIXED queued #413 |
| AUX-SPELL-RETIRED-UNLABELED | AUTO_FIXED queued #413 |
| AUX-PRESET-OVERWRITE-NO-CONFIRM | AUTO_FIXED queued #413 |
| AUX-NAMES-INIT-NO-CONFIRM | AUTO_FIXED queued #470 |
| AUX-BOSSRUSH-PUBLISH-NO-CONFIRM | AUTO_FIXED queued #470 |
| AUX-PALETTE-RESET-NO-CONFIRM | AUTO_FIXED queued #470 |
| AUX-ADS-SAVE-SILENT-ERROR | AUTO_FIXED queued #470 (save/clear catch still `setStatus("Error")` only ~8158). Distinct from this run’s load-fail honesty |
| AUX-LEVELUP-NO-SAVING | AUTO_FIXED queued #470 |
| AUX-PALETTE-NO-SAVING | AUTO_FIXED queued #470 |
| AUX-ACHIEVEMENT-DUP-CONDITION | AUTO_FIXED queued #460/#470 |
| AUX-TIER-PUBLISH-NO-CONFIRM | AUTO_FIXED queued #539 |
| AUX-GAMECONFIG-PUBLISH-NO-CONFIRM | AUTO_FIXED queued #539 |
| AUX-LEVELUP-PUBLISH-NO-CONFIRM | AUTO_FIXED queued #539 |
| AUX-PALETTE-SAVE-NO-CONFIRM | AUTO_FIXED queued #539 |
| AUX-SPELL-RANGE-UNBOUNDED | AUTO_FIXED queued #512/#539 |
| AUX-CONFIRM-NO-ESCAPE | AUTO_FIXED queued #539 |
| AUX-PURCHASE-CONFIRM-NO-ESCAPE | AUTO_FIXED queued #492 |
| AUX-SPELL-NO-SUMMON-CONTROLS | AUTO_FIXED queued #564 |
| AUX-SHOP-GRANT-DOUBLE-SUBMIT | PARTIAL queued #631 |
| AUX-ENEMY-NO-THUMBNAIL | PARTIAL queued #631 |
| AUX-PURCHASE-CONFIRM-DOUBLE-SUBMIT | AUTO_FIXED queued #664 |
| AUX-CONFIRM-DOUBLE-CLICK | PARTIAL queued #664 |
| AUX-LIFE-COPY-HELPER | AUTO_FIXED queued #724 |
| AUX-ASSET-POOL-COPY | AUTO_FIXED queued #724 |
| AUX-DEP-RAIL-HELPER | AUTO_FIXED queued #724 |
| AUX-CONFIG-CACHE-PREEMPT-PUBLISH | AUTO_FIXED queued #775 |
| AUX-LIST-SORT-HELPER | AUTO_FIXED queued #775 |
| AUX-EDITOR-CHROME-HELPER | AUTO_FIXED queued #775 |
| AUX-AUDIT-VIEW-HELPER | AUTO_FIXED queued #838 |
| AUX-ROLLBACK-CONFIRM-HELPER | AUTO_FIXED queued #838 |
| AUX-PII-REDACT-HELPER | AUTO_FIXED queued #838 |
| AUX-DIRTY-HELPER | AUTO_FIXED queued #838 (`isDirty` still false; leave still uses `hasOpenEditor`) |
| AUX-ENTITY-JUMP-HELPER | AUTO_FIXED queued #838 |
| AUX-CHANGELOG-CONFIRM-HELPER | AUTO_FIXED queued #838 |
| AUX-SPRITE-SAVE-CLOSE-HELPER | AUTO_FIXED queued #883 |
| AUX-SAVE-FEEDBACK-HELPER | AUTO_FIXED queued #883 |
| AUX-ENTITY-SAVE-CONFIRM-HELPER | AUTO_FIXED queued #883 |
| AUX-CONFIG-WRITER-BUSY-HELPER | AUTO_FIXED queued #883 |
| AUX-CONFIRM-DISMISS-HELPER | AUTO_FIXED queued #945 |
| AUX-CONFIG-HYDRATE-HELPER | AUTO_FIXED queued #945 |
| AUX-OVERLAY-KEY-HELPER | AUTO_FIXED queued #945 |
| AUX-VISUAL-REVERT-HELPER | AUTO_FIXED queued #945 |
| AUX-NAMES-BUSY-HELPER | AUTO_FIXED queued #1001 |
| AUX-ROLE-GRANT-HELPER | AUTO_FIXED queued #1001 |
| AUX-CONFIRM-CHROME-HELPER | AUTO_FIXED queued #1001 |
| AUX-GRANT-UNLINKED-HELPER | AUTO_FIXED queued #1001 |
| AUX-PRINCIPAL-GATE-HELPER | AUTO_FIXED queued #1066 |
| AUX-CONFIRM-ENTER-HELPER | AUTO_FIXED queued #1066 |
| AUX-REVEAL-MASK-HELPER | AUTO_FIXED queued #1066 |
| AUX-BAN-REASON-HELPER | AUTO_FIXED queued #1066 |
| AUX-CONFIRM-SNAPSHOT-HELPER | AUTO_FIXED queued #1115 |
| AUX-MAILTO-SECRET-HELPER | AUTO_FIXED queued #1115 (mailto still embeds the key **and** ignores consent) |
| AUX-CONFIRM-A11Y-HELPER | AUTO_FIXED queued #1115 |
| AUX-HIT-TARGET-HELPER | AUTO_FIXED queued #1115 (Purchases row actions still minHeight 36) |
| AUX-REVEAL-FORMAT-HELPER | AUTO_FIXED queued #1190 |
| AUX-PURCHASE-GLOBAL-BUSY-HELPER | AUTO_FIXED queued #1190 |
| AUX-GRANT-DRAFT-HELPER | AUTO_FIXED queued #1190 |
| AUX-COPY-FOLLOWUP-HELPER | AUTO_FIXED queued #1190 |
| AUX-OWNER-STATUS-HELPER | AUTO_FIXED this run |
| AUX-CONSENT-GATE-HELPER | AUTO_FIXED this run |
| AUX-SPELL-DELETE-COPY-HELPER | AUTO_FIXED this run |
| AUX-AD-HYDRATE-HELPER | AUTO_FIXED this run |

---

## Recommended IA (proposal — do not implement until approved)

```
OVERVIEW          last writes (getAdminAuditLog), draft vs live counts
CONTENT
  Enemies         list + search + sort → editor + dependency rail + revert
  Bosses          staged edit (local draft ≠ live; type-align Motoko)
  Spells          sectioned editor + summon + acquisition; Delete ≠ retire
  Achievements
  Challenges      (new; currently hardcoded)
  Enemy Names     busy-lock Add / ignore duplicates
WORLD
  Regions
  Tiers / Encounters   hydrate from getTierSpawnConfig before publish
  Map Modifiers        (move Ground Doka off this tab)
  Dungeons        (new)
PRESENTATION
  Player Sprites  revert-to-default
  Visual Assets   pools, weights, hydrate from getColorPalette (new)
  Ad Boxes        hydrate-fail ≠ hidden default
ECONOMY / OPS
  Shop            GameKey grant/ban + banned list; parse principal before confirm;
                  Ban reason required; Grant ≠ Purchases Approve;
                  confirm snapshot of amount/principal; string amount draft
  Purchases       Owner status copy (not player “check email”); consent badge;
                  mailto only with consent; mask reveal; format-gate; table-wide busy;
                  copy toast reminds Mark emailed; mailto without embedding the key
  Boss Rush
  System Config   LevelUp + version/changelog + rollbacks + role-grant dialog
HEALTH
  Audit           getAdminAuditLog + orphan IDs + ban reasons
  Telemetry       persist-ok/fail, grants, bans
```

Do **not** add Simulation until there is a read-only runner that cannot write wallets.

Recommended chrome once IA is approved: breadcrumbs (#775), `⌘K` entity jump (#838), unsaved-change warnings covering bosses and inline config tabs, staged editing, preview-before-activate, version comparison, validation summaries, dependency badges (#724), change summaries, live-catalog confirm (#883), keep-confirm-until-#ok (#945), hydrate-before-publish for Tiers/Visuals (#945), Revert to Default Pixel Visual (#945), names busy lock, role-grant dialog, unlinked-grant copy, parse-before-confirm, Enter-to-confirm, masked GameKey, ban reason, confirm snapshot, mailto without the key **and** without consent, alertdialog + inert, 44px owner targets, reveal format gate, table-wide purchase busy, string grant draft, copy follow-up, **owner status copy**, **consent gate**, **spell retire vs delete copy**, **ad hydrate-fail lock**, simulation shortcuts (read-only only).

---

## Auto-fixes this run (SAFE_TO_AUTO_IMPLEMENT only)

Helpers only — not wired (oldest owner-UX sibling remains #341).

1. Owner GameKey status copy (`adminOwnerUx.ownerStatus.ts`) — never “check email for your GameKey”
2. Consent gate (`adminOwnerUx.consentGate.ts`) — mailto disabled without `emailConsent`
3. Spell delete / retire copy (`adminOwnerUx.spellDeleteCopy.ts`) — built-in block reason, retire vs remove toast, surface canister `#err`
4. Ad hydrate honesty (`adminOwnerUx.adHydrate.ts`) — failed `getAdBoxes` is not the hidden-default valid empty

Major grouping, lifecycle state machine, dependency graph, new domains, Health tab, boss canister writer, and wiring into AdminDashboard / AdminGameKeyPurchases remain **HUMAN_APPROVAL_REQUIRED**.

Could not exercise the role-gated dashboard in a browser in this environment (no admin II session). Verified with unit tests, typecheck, Biome, and vite build.

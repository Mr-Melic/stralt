# Admin UX & Information Architecture Audit — 2026-10-29

**Auditor:** Admin UX & Information Architecture Auditor  
**SOURCE_AUTOMATION:** Admin UX & Information Architecture Auditor  
**HEAD inspected:** `origin/main` `0f5363f` (PR #332 merge) — same tip as 2026-09-29 / 2026-10-21…10-28  
**Scope:** Owner tool only (`AdminDashboard.tsx` 8280 lines, `AdminGameKeyPurchases.tsx` 885 lines, admin hooks, backend admin API). Gameplay math / RAF / map gen not touched.  
**Prior pass:** memories `2026-10-28` (#1223 owner-status / consent-gate / spell-delete / ad-hydrate helpers). Repo copies of 09-21…10-28 files live on those PRs, not on `main`. Oldest owner-UX sibling is still #341; last owner-UX code PR before this pass is #1223.

Do **not** recreate `adminOwnerUx.ts`, `adminOwnerUx.summon.ts`, `adminOwnerUx.catalogPublish.ts`, `adminOwnerUx.shopBusy.ts`, `adminOwnerUx.visualPreview.ts`, `adminOwnerUx.gameKeyBusy.ts`, `adminOwnerUx.confirmOnce.ts`, `adminOwnerUx.lifecycle.ts`, `adminOwnerUx.visualPool.ts`, `adminOwnerUx.deps.ts`, `adminOwnerUx.publishGate.ts`, `adminOwnerUx.listQuery.ts`, `adminOwnerUx.editorChrome.ts`, `adminOwnerUx.auditView.ts`, `adminOwnerUx.rollbackConfirm.ts`, `adminOwnerUx.piiRedact.ts`, `adminOwnerUx.dirty.ts`, `adminOwnerUx.entityJump.ts`, `adminOwnerUx.changelogPublish.ts`, `adminOwnerUx.spriteSaveClose.ts`, `adminOwnerUx.saveFeedback.ts`, `adminOwnerUx.entitySaveConfirm.ts`, `adminOwnerUx.configWriterBusy.ts`, `adminOwnerUx.confirmDismiss.ts`, `adminOwnerUx.configHydrate.ts`, `adminOwnerUx.overlayKey.ts`, `adminOwnerUx.visualRevert.ts`, `adminOwnerUx.namesBusy.ts`, `adminOwnerUx.roleGrant.ts`, `adminOwnerUx.confirmChrome.ts`, `adminOwnerUx.grantLink.ts`, `adminOwnerUx.principalGate.ts`, `adminOwnerUx.confirmEnter.ts`, `adminOwnerUx.revealMask.ts`, `adminOwnerUx.banReason.ts`, `adminOwnerUx.confirmSnapshot.ts`, `adminOwnerUx.mailtoSecret.ts`, `adminOwnerUx.confirmA11y.ts`, `adminOwnerUx.hitTarget.ts`, `adminOwnerUx.revealFormat.ts`, `adminOwnerUx.purchaseGlobalBusy.ts`, `adminOwnerUx.grantDraft.ts`, `adminOwnerUx.copyFollowup.ts`, `adminOwnerUx.ownerStatus.ts`, `adminOwnerUx.consentGate.ts`, `adminOwnerUx.spellDeleteCopy.ts`, `adminOwnerUx.adHydrate.ts`, or `SpellSummonFields.tsx`.  
Do **not** vendor #334 / #341 / #413 / #470 / #539 / #564 `AdminDashboard.tsx` onto `main`. Unique hunks only.

This is an **owner console**, not a player HUD. Optimize for speed, clarity, safety, discoverability, density, low operator error, and content scale.

DESIGN.md identity (carved-stone, gold, crimson) is preserved on the owner tool. Decorative orbs / player HUD patterns are not imposed. Owner `C` tokens remain raw hex (AUX-HEX-VS-OKLCH).

---

## Capability map (inspected, not imposed)

| Domain (prompt) | Actual capability | Admin surface today |
| :--- | :--- | :--- |
| OVERVIEW | None | Missing |
| ENEMIES | Canister CRUD spawn templates (`hp/ap/mp/init/level/regions/spriteUrl`) | Enemies tab + list search + Default Pixel / stored-URL chips. List glyph is still 👾. Delete confirm still says players can encounter the row until recreate. No revert. Thumbnail helper queued #631 |
| BOSSES | 19 kits; **localStorage** `pbv_boss_configs` — Motoko `getAllBossConfigs` / `setBossConfig` exist; frontend record still diverges | Bosses tab (draft copy + ability filter + Save browser draft). Collapsed row still has no DRAFT chip. `hasOpenEditor` still omits bosses |
| SPELLS | Canister CRUD + large targeting/effect form; summon fields persist via adapter; **no summon controls on `main`**. Spell Type dropdown is damage/heal/drain only. Delete confirm claims immediate remove; built-in `#err` toasted generic; player-owned `#ok` retire toasted “Spell deleted” | Spells tab + list search. Summon editor queued in #564. Builtin-delete block queued in #341. Retire/delete copy helper queued #1223 |
| SPELL DISCOVERY | Player `starterSpells` + minLevel; no discovery catalog | Missing |
| ACHIEVEMENTS | Canister CRUD + `active` flag | Achievements tab + list search + Active/Inactive chip (binary, not six-state) |
| CHALLENGES | Hardcoded `DEFAULT_CHALLENGES` | Missing — do not add an empty tab |
| AI | Constants in `gameConstants.ts` / `engine/enemyAI.ts` | Missing |
| FORMATIONS | Not a first-class config type | Missing |
| ENCOUNTERS | Runtime spawn + tiers + regions | Enemy Tiers + Regions only. **Tiers form never calls `getTierSpawnConfig`** |
| DUNGEONS | `DungeonRecord` / chain persist | Missing |
| WORLD | Regions + map modifiers + paper palette | Regions / Modifiers / Visuals. **Visuals never calls `getColorPalette`**. Ground Doka + leader boost sit on Map Modifiers. **`useGetGameConfig` catch returns hardcoded 10/40/5 as success** |
| VISUAL ASSETS | Enemy URL, player 4-facing URLs, ad image URLs | Scattered; no pool/weights. Empty = Default Pixel Visual (valid). Ads have Clear to default; **`getAdBoxes` catch leaves ""**. Sprite list empty thumb uses chess glyph (good) but no Default Pixel chip |
| ECONOMY | GameKey/Mollie (PR #258) + grant/ban; packages API still on actor | Shop / Purchases. Grant third arg always `null`. **Purchases status uses `playerGameKeyStatusCopy`.** **`emailConsent` unused; Open mailto unguarded.** Reveal overlay hides destination email. `href="#"` still looks like Open mailto |
| SYSTEM CONFIG | All nine LevelUpConfig fields, role grant, Boss Rush (canister-live), palette | Settings / Boss Rush / Visuals. Level-up and Boss Rush call the canister but **fail silent** (keep LS). Tiers and Visuals do not call. Palette Reset is localStorage only. Transfer Admin is typed TRANSFER with no ConfirmDialog |
| SIMULATION | None | Missing — do not add a writer |
| TELEMETRY | None | Missing |
| HEALTH / AUDIT | Canister `getAdminAuditLog` + rollback writers; frontend mock stub returns `notAdmin`; **no owner tab**. `setAppVersion` / `setChangelog` have no editors | Tab error banners + Settings honesty note only. Reader helper queued #838 |
| BANS | `getBannedPrincipals` | Shop banned list (empty = valid default). No reason field |

**Live tabs (15, still flat):** Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.  
File: `src/frontend/src/components/AdminDashboard.tsx` (8280 lines, one module). Purchases: `AdminGameKeyPurchases.tsx` (885 lines).

Do **not** vendor older AdminDashboard PRs onto `main`. Unique hunks only so `--self` 3-way-merges after #334 / #341 / #413 / #415 / #437 / #457 / #460 / #470 / #512 / #531 / #539 / #564. Purchases overlap is #492 / #664 / #838 / #1066 / #1115 / #1190 / #1223.

---

## Recapture — do not reopen AUTO_FIXED (queued PRs still open)

| ACTION_ID | Status 2026-10-29 |
| :--- | :--- |
| AUX-DEL-NO-CONFIRM … AUX-NO-BANNED-LIST | AUTO_FIXED (present on `main`; see 2026-10-28 table) |
| AUX-SPELL-DELETE-BUILTIN | AUTO_FIXED queued #341 |
| AUX-PRESET-DELETE-NO-CONFIRM | AUTO_FIXED queued #341 |
| AUX-SPELL-RETIRED-UNLABELED | AUTO_FIXED queued #413 |
| AUX-BOSS-LEAVE-UNWARNED | AUTO_FIXED queued #413 (`hasOpenEditor` still omits bosses ~5479) |
| AUX-NAMES-INIT-NO-CONFIRM / AUX-BOSSRUSH-PUBLISH-NO-CONFIRM / AUX-PALETTE-RESET-NO-CONFIRM | AUTO_FIXED queued #470 |
| AUX-CONFIRM-NO-ESCAPE | AUTO_FIXED queued #539 |
| AUX-PURCHASE-CONFIRM-NO-ESCAPE | AUTO_FIXED queued #492 |
| AUX-SPELL-NO-SUMMON-CONTROLS | AUTO_FIXED queued #564 |
| AUX-SHOP-GRANT-DOUBLE-SUBMIT / AUX-ENEMY-NO-THUMBNAIL | PARTIAL queued #631 |
| AUX-LIFE-COPY-HELPER / AUX-ASSET-POOL-COPY / AUX-DEP-RAIL-HELPER | AUTO_FIXED queued #724 |
| AUX-AUDIT-VIEW-HELPER … AUX-CHANGELOG-CONFIRM-HELPER | AUTO_FIXED queued #838 |
| AUX-SPRITE-SAVE-CLOSE-HELPER … AUX-CONFIG-WRITER-BUSY-HELPER | AUTO_FIXED queued #883 |
| AUX-CONFIRM-DISMISS-HELPER … AUX-VISUAL-REVERT-HELPER | AUTO_FIXED queued #945 |
| AUX-NAMES-BUSY-HELPER … AUX-GRANT-UNLINKED-HELPER | AUTO_FIXED queued #1001 |
| AUX-PRINCIPAL-GATE-HELPER … AUX-BAN-REASON-HELPER | AUTO_FIXED queued #1066 |
| AUX-CONFIRM-SNAPSHOT-HELPER … AUX-HIT-TARGET-HELPER | AUTO_FIXED queued #1115 |
| AUX-REVEAL-FORMAT-HELPER … AUX-COPY-FOLLOWUP-HELPER | AUTO_FIXED queued #1190 |
| AUX-OWNER-STATUS-HELPER / AUX-CONSENT-GATE-HELPER / AUX-SPELL-DELETE-COPY-HELPER / AUX-AD-HYDRATE-HELPER | AUTO_FIXED queued #1223 (helpers only) |
| AUX-PURCHASE-PLAYER-STATUS-COPY / AUX-PURCHASE-CONSENT-HIDDEN / AUX-MAILTO-NO-CONSENT-GATE | NEW queued #1223 HUMAN wiring |
| AUX-SPELL-RETIRE-TOAST-AS-DELETE / AUX-SPELL-DELETE-SWALLOWS-ERR / AUX-AD-LOAD-SILENT-FAIL | NEW queued #1223 HUMAN wiring |
| AUX-ENEMY-DELETE-COPY-HELPER | AUTO_FIXED this run |
| AUX-REVEAL-DEST-HELPER | AUTO_FIXED this run |
| AUX-MAILTO-DEAD-HELPER | AUTO_FIXED this run |
| AUX-SWALLOWED-HYDRATE-HELPER | AUTO_FIXED this run |

---

## Recommended IA (proposal — do not implement until approved)

```
OVERVIEW          last writes (getAdminAuditLog), draft vs live counts
CONTENT
  Enemies         list + search + sort → editor + dependency rail + revert
                  honest catalog-only delete confirm
  Bosses          staged edit (local draft ≠ live; type-align Motoko)
                  collapsed DRAFT chip; include in hasOpenEditor
  Spells          sectioned editor + summon + acquisition; Delete ≠ retire
  Achievements
  Challenges      (new; currently hardcoded)
  Enemy Names     busy-lock Add / ignore duplicates
WORLD
  Regions
  Tiers / Encounters   hydrate from getTierSpawnConfig before publish
  Map Modifiers        (move Ground Doka off this tab)
                       GameConfig load-fail ≠ hardcoded 10/40/5 live
  Dungeons        (new)
PRESENTATION
  Player Sprites  revert-to-default; Default Pixel chip on the list
  Visual Assets   pools, weights, hydrate from getColorPalette (new)
  Ad Boxes        hydrate-fail ≠ hidden default
ECONOMY / OPS
  Shop            GameKey grant/ban + banned list; parse principal before confirm
  Purchases       Owner status copy; consent badge; mailto only with consent;
                  reveal shows destination email; dead href ≠ Open mailto
  Boss Rush       hydrate-fail banner; do not Save LS over unknown live
  System Config   LevelUp hydrate-fail banner + version/changelog + rollbacks
HEALTH
  Audit           getAdminAuditLog + orphan IDs + ban reasons
  Telemetry       persist-ok/fail, grants, bans
```

Do **not** add Simulation until there is a read-only runner that cannot write wallets.

Recommended chrome once IA is approved: breadcrumbs (#775), `⌘K` entity jump (#838), unsaved-change warnings covering bosses and inline config tabs, staged editing, preview-before-activate, version comparison, validation summaries, dependency badges (#724), change summaries, live-catalog confirm (#883), keep-confirm-until-#ok (#945), hydrate-before-publish for Tiers/Visuals (#945), Revert to Default Pixel Visual (#945), names busy lock, role-grant dialog, unlinked-grant copy, parse-before-confirm, Enter-to-confirm, masked GameKey, ban reason, confirm snapshot, mailto without the key **and** without consent **and** without a live-looking `#` link, alertdialog + inert, 44px owner targets, reveal format gate, table-wide purchase busy, string grant draft, copy follow-up, **owner status copy**, **consent gate**, **spell retire vs delete copy**, **ad hydrate-fail lock**, **catalog-only enemy delete copy**, **reveal destination**, **dead-mailto control**, **swallowed GameConfig/LevelUp/Boss Rush hydrate**, simulation shortcuts (read-only only).

---

## Auto-fixes this run (SAFE_TO_AUTO_IMPLEMENT only)

Helpers only — not wired (oldest owner-UX sibling remains #341).

1. Enemy catalog-only delete copy (`adminOwnerUx.enemyDeleteCopy.ts`) — never “Players can encounter it until you recreate it”
2. Reveal destination (`adminOwnerUx.revealDest.ts`) — overlay must name the email + consent; missing address is not mail-anyway
3. Dead mailto control (`adminOwnerUx.mailtoDead.ts`) — `href="#"` must not look like Open mailto
4. Swallowed hydrate (`adminOwnerUx.swallowedHydrate.ts`) — GameConfig/LevelUp/Boss Rush actor catch is not live; disable Save

Major grouping, lifecycle state machine, dependency graph, new domains, Health tab, boss canister writer, and wiring into AdminDashboard / AdminGameKeyPurchases remain **HUMAN_APPROVAL_REQUIRED**.

Could not exercise the role-gated dashboard in a browser in this environment (no admin II session). Verified with unit tests, typecheck, Biome, and vite build.

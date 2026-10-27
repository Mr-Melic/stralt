# Admin UX & Information Architecture Audit — 2026-10-27

**Auditor:** Admin UX & Information Architecture Auditor  
**SOURCE_AUTOMATION:** Admin UX & Information Architecture Auditor  
**HEAD inspected:** `origin/main` `0f5363f` (PR #332 merge) — same tip as 2026-09-29 / 2026-10-21…10-26  
**Scope:** Owner tool only (`AdminDashboard.tsx` 8280 lines, `AdminGameKeyPurchases.tsx` 885 lines, admin hooks, backend admin API). Gameplay math / RAF / map gen not touched.  
**Prior pass:** memories `2026-10-26` (#1115 confirm-snapshot / mailto-secret / confirm-a11y / hit-target helpers). Repo copies of 09-21…10-26 files live on those PRs, not on `main`. Oldest owner-UX sibling is still #341; last owner-UX code PR before this pass is #1115.

Do **not** recreate `adminOwnerUx.ts`, `adminOwnerUx.summon.ts`, `adminOwnerUx.catalogPublish.ts`, `adminOwnerUx.shopBusy.ts`, `adminOwnerUx.visualPreview.ts`, `adminOwnerUx.gameKeyBusy.ts`, `adminOwnerUx.confirmOnce.ts`, `adminOwnerUx.lifecycle.ts`, `adminOwnerUx.visualPool.ts`, `adminOwnerUx.deps.ts`, `adminOwnerUx.publishGate.ts`, `adminOwnerUx.listQuery.ts`, `adminOwnerUx.editorChrome.ts`, `adminOwnerUx.auditView.ts`, `adminOwnerUx.rollbackConfirm.ts`, `adminOwnerUx.piiRedact.ts`, `adminOwnerUx.dirty.ts`, `adminOwnerUx.entityJump.ts`, `adminOwnerUx.changelogPublish.ts`, `adminOwnerUx.spriteSaveClose.ts`, `adminOwnerUx.saveFeedback.ts`, `adminOwnerUx.entitySaveConfirm.ts`, `adminOwnerUx.configWriterBusy.ts`, `adminOwnerUx.confirmDismiss.ts`, `adminOwnerUx.configHydrate.ts`, `adminOwnerUx.overlayKey.ts`, `adminOwnerUx.visualRevert.ts`, `adminOwnerUx.namesBusy.ts`, `adminOwnerUx.roleGrant.ts`, `adminOwnerUx.confirmChrome.ts`, `adminOwnerUx.grantLink.ts`, `adminOwnerUx.principalGate.ts`, `adminOwnerUx.confirmEnter.ts`, `adminOwnerUx.revealMask.ts`, `adminOwnerUx.banReason.ts`, `adminOwnerUx.confirmSnapshot.ts`, `adminOwnerUx.mailtoSecret.ts`, `adminOwnerUx.confirmA11y.ts`, `adminOwnerUx.hitTarget.ts`, or `SpellSummonFields.tsx`.  
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
| SPELLS | Canister CRUD + large targeting/effect form; summon fields persist via adapter; **no summon controls on `main`**. Spell Type dropdown is damage/heal/drain only. `SPELL_EFFECT_TYPES` omits summon/drain | Spells tab + list search. Summon editor queued in #564 |
| SPELL DISCOVERY | Player `starterSpells` + minLevel; no discovery catalog | Missing |
| ACHIEVEMENTS | Canister CRUD + `active` flag | Achievements tab + list search + Active/Inactive chip (binary eligible, not the six-state vocabulary) |
| CHALLENGES | Hardcoded `DEFAULT_CHALLENGES` | Missing — do not add an empty tab |
| AI | Constants in `gameConstants.ts` / `engine/enemyAI.ts` | Missing |
| FORMATIONS | Not a first-class config type | Missing |
| ENCOUNTERS | Runtime spawn + tiers + regions | Enemy Tiers + Regions only. **Tiers form never calls `getTierSpawnConfig`** |
| DUNGEONS | `DungeonRecord` / chain persist | Missing |
| WORLD | Regions + map modifiers + paper palette | Regions / Modifiers / Visuals. **Visuals never calls `getColorPalette`** |
| VISUAL ASSETS | Enemy URL, player 4-facing URLs, ad image URLs | Scattered; no pool/weights. Empty = Default Pixel Visual (valid, never an error). Ads have Clear to default + requirements before paste; enemy/sprite have no Revert. Pool copy helper queued #724. Revert copy helper queued #945 |
| ECONOMY | GameKey/Mollie (PR #258) + grant/ban; packages API still on actor | Shop / Purchases. Grant third arg is always `null`. Grant amount Field coerces empty → 0 via `parseInt \|\| 0`. Grant/Ban/Unban parse `Principal.fromText` **after** confirm dismisses. Ban uses `adminBanAccount` with no reason. **Reveal/copy skip `validateGameKeyFormat`.** **Row busy is per-id only.** **Copy toast does not remind Mark emailed.** |
| SYSTEM CONFIG | All nine LevelUpConfig fields, role grant, Boss Rush (canister-live), palette | Settings / Boss Rush / Visuals. Level-up and Boss Rush hydrate. Tiers and Visuals do not. Palette Reset is localStorage only. Transfer Admin is typed TRANSFER with no ConfirmDialog |
| SIMULATION | None | Missing — do not add a writer |
| TELEMETRY | None | Missing |
| HEALTH / AUDIT | Canister `getAdminAuditLog` + rollback writers; frontend mock stub returns `notAdmin`; **no owner tab**. `setAppVersion` / `setChangelog` have no editors | Tab error banners + Settings honesty note only. Reader helper queued #838 |
| BANS | `getBannedPrincipals` | Shop banned list (empty = valid default). No reason field |

**Live tabs (15, still flat):** Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.  
File: `src/frontend/src/components/AdminDashboard.tsx` (8280 lines, one module). Purchases: `AdminGameKeyPurchases.tsx` (885 lines).

Do **not** vendor older AdminDashboard PRs onto `main`. Unique hunks only so `--self` 3-way-merges after #334 / #341 / #413 / #415 / #437 / #457 / #460 / #470 / #512 / #531 / #539 / #564. Purchases overlap is #492 / #664. Lifecycle helpers overlap is #724. Chrome helpers overlap is #775. 10-21 helpers overlap is #838. 10-22 helpers overlap is #883. 10-23 helpers overlap is #945. 10-24 helpers overlap is #1001. 10-25 helpers overlap is #1066. 10-26 helpers overlap is #1115.

---

## Recapture — do not reopen AUTO_FIXED (queued PRs still open)

| ACTION_ID | Status 2026-10-27 |
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
| AUX-AD-EMPTY-AS-ERROR | AUTO_FIXED |
| AUX-BOSSRUSH-LIVE-UNLABELED | AUTO_FIXED |
| AUX-ACCESS-FIRST-PLAYER-COPY | AUTO_FIXED |
| AUX-LEVELUP-PARTIAL | AUTO_FIXED (nine fields visible) |
| AUX-GAMEKEY-NO-CONFIRM | AUTO_FIXED |
| AUX-UNBAN-COPY-STALE | AUTO_FIXED |
| AUX-UNBAN-NO-ASSERT | AUTO_FIXED |
| AUX-NO-BANNED-LIST | AUTO_FIXED |
| AUX-SPELL-DELETE-BUILTIN | AUTO_FIXED queued #341 |
| AUX-PRESET-DELETE-NO-CONFIRM | AUTO_FIXED queued #341 (`handleDelete` still one-click on `main` ~603) |
| AUX-LOADING-INCOMPLETE | AUTO_FIXED queued #341 + boss Save #413 (`anyPending` still omits names/achievements/gameConfig/ads/shop/bossRush ~5628) |
| AUX-BOSS-SPELL-POOL-UNFILTERED | AUTO_FIXED queued #341 (`main` still unfiltered ~7712) |
| AUX-VISUALS-TAB-SCOPE | AUTO_FIXED queued #341 |
| AUX-SIDEBAR-COUNTS-INCOMPLETE | AUTO_FIXED queued #341 (`main` still missing bosses/names ~5935) |
| AUX-BOSS-LEAVE-UNWARNED | AUTO_FIXED queued #413 (`hasOpenEditor` still omits bosses ~5479) |
| AUX-SPELL-RETIRED-UNLABELED | AUTO_FIXED queued #413 |
| AUX-PRESET-OVERWRITE-NO-CONFIRM | AUTO_FIXED queued #413 |
| AUX-NAMES-INIT-NO-CONFIRM | AUTO_FIXED queued #470 (`Load Defaults` still one-click on `main` ~7347) |
| AUX-BOSSRUSH-PUBLISH-NO-CONFIRM | AUTO_FIXED queued #470 |
| AUX-PALETTE-RESET-NO-CONFIRM | AUTO_FIXED queued #470 (Reset still no dialog; still local-only) |
| AUX-ADS-SAVE-SILENT-ERROR | AUTO_FIXED queued #470 (catch still `setStatus("Error")` only ~8158) |
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
| AUX-SPELL-NO-SUMMON-CONTROLS | AUTO_FIXED queued #564. Extra evidence: Spell Type select is damage/heal/drain only (~2684) |
| AUX-SHOP-GRANT-DOUBLE-SUBMIT | PARTIAL queued #631 — helpers; dashboard wiring skipped |
| AUX-ENEMY-NO-THUMBNAIL | PARTIAL queued #631 — helper; editor insert skipped; list still 👾 + status chip |
| AUX-PURCHASE-CONFIRM-DOUBLE-SUBMIT | AUTO_FIXED queued #664 — GameKey same-request actor lock |
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
| AUX-SPRITE-SAVE-CLOSE-HELPER | AUTO_FIXED queued #883 — helper; SpriteList still closes immediately ~1715 |
| AUX-SAVE-FEEDBACK-HELPER | AUTO_FIXED queued #883 — helper; Shop grant still toast + hex pill |
| AUX-ENTITY-SAVE-CONFIRM-HELPER | AUTO_FIXED queued #883 — helper; catalog Save still one-click live |
| AUX-CONFIG-WRITER-BUSY-HELPER | AUTO_FIXED queued #883 — helper; Boss Rush / ads / level-up / palette / tiers still unlocked |
| AUX-CONFIRM-DISMISS-HELPER | AUTO_FIXED queued #945 — helper; dialogs still unmount then write |
| AUX-CONFIG-HYDRATE-HELPER | AUTO_FIXED queued #945 — helper; Tiers / Visuals still local-only |
| AUX-OVERLAY-KEY-HELPER | AUTO_FIXED queued #945 — helper; GameKey reveal still no Escape |
| AUX-VISUAL-REVERT-HELPER | AUTO_FIXED queued #945 — helper; enemy/sprite still have no Revert |
| AUX-NAMES-BUSY-HELPER | AUTO_FIXED queued #1001 — helper; Add / Enter / Load Defaults still unlocked |
| AUX-ROLE-GRANT-HELPER | AUTO_FIXED queued #1001 — helper; Transfer still no ConfirmDialog |
| AUX-CONFIRM-CHROME-HELPER | AUTO_FIXED queued #1001 — helper; ConfirmDialog still has no pending/error slots |
| AUX-GRANT-UNLINKED-HELPER | AUTO_FIXED queued #1001 — helper; Shop Grant still passes `null` purchaseId |
| AUX-PRINCIPAL-GATE-HELPER | AUTO_FIXED queued #1066 — helper; Grant/Ban/Unban/Transfer still parse after confirm |
| AUX-CONFIRM-ENTER-HELPER | AUTO_FIXED queued #1066 — helper; ConfirmDialog / PurchaseConfirm still ignore Enter |
| AUX-REVEAL-MASK-HELPER | AUTO_FIXED queued #1066 — helper; reveal textarea still full plaintext |
| AUX-BAN-REASON-HELPER | AUTO_FIXED queued #1066 — helper; Shop Ban still has no reason field |
| AUX-CONFIRM-SNAPSHOT-HELPER | AUTO_FIXED queued #1115 — helper; Grant/Approve still resample live state |
| AUX-MAILTO-SECRET-HELPER | AUTO_FIXED queued #1115 — helper; Open mailto still embeds the key |
| AUX-CONFIRM-A11Y-HELPER | AUTO_FIXED queued #1115 — helper; overlays still unlabelled divs |
| AUX-HIT-TARGET-HELPER | AUTO_FIXED queued #1115 — helper; dashboard Btn/Field/tabs still <44px. Purchases overlay is 44; **row Approve/Reject/Show code stay 36** |
| AUX-REVEAL-FORMAT-HELPER | AUTO_FIXED this run — helper; reveal/copy still skip format check |
| AUX-PURCHASE-GLOBAL-BUSY-HELPER | AUTO_FIXED this run — helper; row `disabled` still `busyId === rec.id` |
| AUX-GRANT-DRAFT-HELPER | AUTO_FIXED this run — helper; Field still `parseInt \|\| 0` |
| AUX-COPY-FOLLOWUP-HELPER | AUTO_FIXED this run — helper; toast still “GameKey copied” |

---

## Recommended IA (proposal — do not implement until approved)

```
OVERVIEW          last writes (getAdminAuditLog), draft vs live counts
CONTENT
  Enemies         list + search + sort → editor + dependency rail + revert
  Bosses          staged edit (local draft ≠ live; type-align Motoko)
  Spells          sectioned editor + summon + acquisition
  Achievements
  Challenges      (new; currently hardcoded)
  Enemy Names     busy-lock Add / ignore duplicates
WORLD
  Regions
  Tiers / Encounters   hydrate from getTierSpawnConfig before publish
  Map Modifiers
  Dungeons        (new)
PRESENTATION
  Player Sprites  revert-to-default
  Visual Assets   pools, weights, hydrate from getColorPalette (new)
  Ad Boxes
ECONOMY / OPS
  Shop            GameKey grant/ban + banned list; parse principal before confirm;
                  Ban reason required; Grant ≠ Purchases Approve;
                  confirm snapshot of amount/principal; string amount draft
  Purchases       GameKey approve/reject; mask reveal until click; Escape on overlay;
                  mailto without embedding the key; Approve writes dialog amount;
                  format-gate reveal/copy; table-wide busy; copy toast reminds Mark emailed
  Boss Rush
  System Config   LevelUp + version/changelog + rollbacks + role-grant dialog
HEALTH
  Audit           getAdminAuditLog + orphan IDs + ban reasons
  Telemetry       persist-ok/fail, grants, bans
```

Do **not** add Simulation until there is a read-only runner that cannot write wallets.

Recommended chrome once IA is approved: breadcrumbs (#775), `⌘K` entity jump (`queryOwnerJumpIndex` #838), unsaved-change warnings (`ownerFormIsDirty` + `beforeunload` #838) covering bosses and inline config tabs, staged editing, preview-before-activate, version comparison, validation summaries (#775), dependency badges (#724), change summaries (`ownerAuditChangeSummary` #838), live-catalog confirm (`shouldPublishLiveCatalog` #883), keep-confirm-until-#ok (`shouldDismissOwnerConfirm` #945) using `ownerConfirmChrome`, hydrate-before-publish for Tiers/Visuals (`ownerConfigFormIsLive` #945), Revert to Default Pixel Visual (`ownerVisualRevertLabel` #945), names busy lock (`shouldSubmitOwnerNameAdd`), role-grant dialog (`shouldAssignOwnerRole`), unlinked-grant copy (`ownerShopGrantConfirmBody`), parse-before-confirm (`shouldOpenOwnerPrincipalConfirm`), Enter-to-confirm (`shouldSubmitOwnerConfirmOnKey`), masked GameKey (`maskOwnerGameKey`), ban reason (`shouldSubmitOwnerBan`), confirm snapshot (`ownerConfirmWriteAmount`), mailto without the key (`ownerGameKeyMailtoHref`), alertdialog + inert (`ownerConfirmA11yProps`), 44px owner targets (`OWNER_MIN_HIT_PX`), reveal format gate (`shouldShowOwnerGameKeyReveal`), table-wide purchase busy (`shouldDisableOwnerPurchaseRowActions`), string grant draft (`parseOwnerGrantAmountDraft`), copy follow-up (`ownerGameKeyCopiedToast`), simulation shortcuts (read-only only).

---

## Auto-fixes this run (SAFE_TO_AUTO_IMPLEMENT only)

Did **not** patch `AdminDashboard.tsx` (oldest-first stack still starts at #334/#341).  
Did **not** patch `AdminGameKeyPurchases.tsx` (#492 / #664).  
Did **not** patch `dokaGameKey.ts` (mailto tests + Purchases overlap).  
Did **not** recreate #564 / #631 / #664 / #724 / #775 / #838 / #883 / #945 / #1001 / #1066 / #1115 helper files.

1. Reveal format: `adminOwnerUx.revealFormat.ts`. Do not show or copy a GameKey unless `validateGameKeyFormat` passes. Documents that Approve / Show code / Copy on `main` accept any `cmd.ok` string. Distinct from #1066 mask and #1115 mailto. Not wired.
2. Purchase global busy: `adminOwnerUx.purchaseGlobalBusy.ts`. Any in-flight request disables every row action. Documents that `main` only disables `busyId === rec.id`. Distinct from #664 same-request lock. Not wired.
3. Grant amount draft: `adminOwnerUx.grantDraft.ts`. Keep a string draft; parse whole decimal amounts only when opening confirm. Documents `Number.parseInt(v) || 0` (no radix) on `main`. Distinct from #1115 snapshot. Not wired.
4. Copy follow-up: `adminOwnerUx.copyFollowup.ts`. Toast must remind Mark emailed after copy. Documents `main` toast is only “GameKey copied”. Distinct from mask / mailto. Not wired.

Major grouping, canister lifecycle state machine, Health tab, version/rollback UI, boss canister writer, visual pools/weights, Tiers/Visuals hydrate wiring, and wiring any of the above into `AdminDashboard` / `AdminGameKeyPurchases` remain **HUMAN_APPROVAL_REQUIRED**.

Could not exercise the role-gated dashboard in a browser in this environment (no admin Internet Identity). Verified with typecheck, Biome, vite build, and unit tests.

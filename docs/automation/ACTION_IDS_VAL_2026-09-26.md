# ACTION_IDs — 2026-09-26 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source: Visual Asset Library & Assignment Designer.  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-26.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-26.md).  
HEAD inspected: `0f5363f`. Gameplay / production code was **not** modified.

Prior IDs on this tree:

- `VAL-2026-08-31-001` … `019` — still NEW except as noted
- `VAL-2026-09-01-001` — **IMPLEMENTED** (admin copy honesty)
- `VAL-2026-09-01-002` … `011` — NEW
- `VAL-2026-09-02-001` … (see `ACTION_IDS_VAL_2026-09-02.md`) — NEW

This run does **not** re-issue those IDs. New IDs below refresh citations to live line numbers at `0f5363f` and record 09-26 deltas.

---

## Prior IDs — status 2026-09-26

| ID | Status 2026-09-26 |
| :--- | :--- |
| VAL-2026-09-01-001 | **IMPLEMENTED** — `adminVisualStatus.ts` honesty copy |
| All other VAL-* | NEW — no `visualAssets.ts`, zero `drawImage` in `src/` |
| Claimed 09-21…09-25 docs/PRs | **Not present on this tree** (only 08-31 / 09-01 / 09-02 design files + this run) |

---

ACTION_ID: VAL-2026-09-26-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Freeze RENDER_PROFILES from live 80×40 / 3px / +9 / 24×24 / hit 80×41 / wall 28  
CATEGORY: render-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `gameConstants.ts` 6–7, 17; WX `drawPixelPattern` 3855; hit `h=41` at 8086–8092; wallHeight 4085; `king.front` 8×8 at `pieceArt.ts` 85–94. Checklist claims all match.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (proposed), preview  
RECOMMENDED_ACTION: Cite 09-26 design §0–§7. Do not invent 64×64 / 128×128 boxes.  
AUTONOMY: DOCUMENT_ONLY until implementer picks VAL-2026-08-31-004  
DEPENDENCIES: VAL-2026-08-31-004  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Re-read cited lines after any renderer edit.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not key boss_large off isBoss / family===boss — portal live paints chess@1.4  
CATEGORY: render-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Portal Enemy WX 6522–6569 has scale 1.4 + family "boss" but **no** isBoss/bossId. Boss tables 8×12 at `enemyPixelPatterns.ts` 11–24. `drawCombatant` branch 1 needs `isBoss && bossId` (`pieceArt.ts` 856). Battle flags only on CombatantEntry 11958–11984; syncCombatants does not copy them onto Enemy.  
SYSTEMS_AFFECTED: boss visual profile, spawn bind  
RECOMMENDED_ACTION: Profile `portal_boss_live` ≈34×34 (8×8×1.4). Keep `boss_table` ≈34×50 for a future path that actually sets bossId on combatantsRef.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-007  
DEPENDENCIES: VAL-2026-08-31-007; VAL-2026-08-31-005  
REGRESSION_RISK: HIGH if implementers stretch PNGs to 8×12 based on family==="boss"  
VALIDATION_REQUIRED: Portal boss screenshot stays chess-shaped at ~34×34.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Hit-test uses stored h=41 (80×41), not drawSize h=60  
CATEGORY: hit-test  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: WX 8086–8092 / 8335–8341: `w=effectiveTileW`, `h=th/2+CHARACTER_Y_OFFSET+(th*1.5)/2` → 41. `drawSize.h` stores 60. `hitTestSprite` 8885–8917 reads `entry.h`. Padding 10/14 at 10127 / 10819.  
SYSTEMS_AFFECTED: spriteRectsRef, custom art click targets  
RECOMMENDED_ACTION: Custom hit rects must match the **computed** 80×41 (or mobile-scaled equivalent), or intentionally replace both w/h together — never trust drawSize alone.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-01-003  
DEPENDENCIES: VAL-2026-09-01-003  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Click top of sprite body still registers; drawSize dump ≠ hit math.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Family pixel tables remain Ghost/minion-only; 30% family roll is stats-only  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `FAMILY_VARIANT_CHANCE=0.3` `spawnPolicy.ts` 35; roster apply WX 5864–5866; family art gate `pieceArt.ts` 932; grids `enemyPixelPatterns.ts` 434–498.  
SYSTEMS_AFFECTED: family visuals  
RECOMMENDED_ACTION: Do not bind family PNGs to the 30% stat roll unless product explicitly wants art change. Default stays chess pieceType.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-013  
DEPENDENCIES: VAL-2026-08-31-013  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Family-stat enemy still shows chess art.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Bind custom visuals on combatantsRef Enemy — CombatantEntry strips scale/family/view  
CATEGORY: architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `toCombatantEntry` `combatantStore.ts` 141–168 keeps isBoss/bossId but drops scaleX/Y, family, assignedName, currentView. Player not in combatantsRef (WX player draw 8315–8326).  
SYSTEMS_AFFECTED: spawn bind, store  
RECOMMENDED_ACTION: Store `visualAssetId` (or decoded handle) on Enemy in combatantsRef; never only on turnOrder.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-005  
DEPENDENCIES: VAL-2026-08-31-005  
REGRESSION_RISK: HIGH if bind lives only on CombatantEntry  
VALIDATION_REQUIRED: After battle init, combatantsRef still carries visual id; turnOrder strip does not erase it.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: drawPixelPattern trailing restore has no matching save — do not add save without audit  
CATEGORY: renderer  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 3841–3886: no `ctx.save()`; ends `ctx.restore()` at 3883. Moving-enemy wrapper saves at 8058 and relies on that restore (8076). `drawPatternInline` correctly skips restore (`pieceArt.ts` 750–751).  
SYSTEMS_AFFECTED: RAF canvas state  
RECOMMENDED_ACTION: Fix by pairing save/restore or removing restore — but audit all callers first. Custom drawImage path must not inherit unpaired restore.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: none  
REGRESSION_RISK: HIGH (canvas state leak / clip)  
VALIDATION_REQUIRED: Moving-enemy glow + subsequent draw still correct after fix.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Tablet 768–1024 is unzoomed tiles + camera follow — preview that band  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `useIsMobile` default 768 (`use-mobile.tsx` 17–20); `isDesktop` is `innerWidth > 1024` (WX 877); MOBILE_ZOOM only when isMobile (957–959); camera follow when !isDesktop (5895–5900).  
SYSTEMS_AFFECTED: preview, camera profiles  
RECOMMENDED_ACTION: Three preview panes: phone (&lt;768 @1.75), tablet (768–1024 follow), desktop (&gt;1024 locked).  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-02-001  
DEPENDENCIES: VAL-2026-09-02-001; VAL-2026-08-31-009  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: 900px-wide viewport: tiles 80×40, camera follows.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: canvas.width= clears context — cache ImageBitmap; every-frame setTransform resets smoothing  
CATEGORY: renderer  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 13972–13973, 7256–7264; contextlost restore uses window.innerWidth (13830–13836). `imageSmoothingEnabled` never set; CSS pixelated at 17890 + `index.css` 652–655.  
SYSTEMS_AFFECTED: asset decode cache, DPR path  
RECOMMENDED_ACTION: Decode once; survive resize/contextlost. Explicitly set `imageSmoothingEnabled=false` after every scale(dpr) if bitmaps land.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-011  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-02-002  
REGRESSION_RISK: HIGH if bitmaps re-decoded every frame  
VALIDATION_REQUIRED: Resize mid-battle; contextlost synthetic; no black flash from lost bitmap.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Portal whirlpool radius 25 is not the portal Enemy footprint — keep profiles separate  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `drawPortalWhirlpool` radius 25 at WX 3898; portal Enemy chess@1.4 at 6535–6536.  
SYSTEMS_AFFECTED: portal FX vs boss unit art  
RECOMMENDED_ACTION: Do not size boss PNGs from whirlpool radius. Unit profile ≠ portal FX profile.  
AUTONOMY: DOCUMENT_ONLY  
DEPENDENCIES: VAL-2026-09-26-002  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Design cites both separately.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Rush lore pieceType falls back to king.front 24×24 — do not assume boss tables  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Rush spawn WX 5325–5346 `isBoss:true` without bossId/scale; `drawCombatant` falls through to king.front (`pieceArt.ts` 1006–1022).  
SYSTEMS_AFFECTED: Boss Rush art  
RECOMMENDED_ACTION: Either assign real pieceType/bossId at Rush spawn or document Rush as 24×24 king fallback.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-26-002  
DEPENDENCIES: VAL-2026-09-26-002  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Rush room unit is 24×24 king-shaped.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Version-gate wipe preserves only tier/levelup/*_inventory — visual binds must not live only in wiped keys  
CATEGORY: persistence  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `versionGate.ts` 7–12; App.tsx 300–313 clear+restore.  
SYSTEMS_AFFECTED: localStorage visual cache  
RECOMMENDED_ACTION: Authoritative visual assignment on canister; local cache keys must be in preserve list or rehydratable.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-002  
DEPENDENCIES: VAL-2026-08-31-002; VAL-2026-08-31-014  
REGRESSION_RISK: HIGH if binds only in cleared keys  
VALIDATION_REQUIRED: Version bump keeps inventory; custom bind rehydrates from canister.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: No isElite / no encounter seed / no visualAssets.ts — still empty-library identity  
CATEGORY: architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: grep `isElite` empty; no encounterSeed; `engine/visualAssets.ts` absent; zero drawImage; WX 19213 lines; `nsKey` is localStorage namespacing (866–871) not a library; InitiativeStrip ENEMY_ICONS (65–81) not a catalog; battle-init skips 3 frames (7238–7245); iso Δ (40,20)≈44.7.  
SYSTEMS_AFFECTED: library foundation  
RECOMMENDED_ACTION: Reaffirm VAL-2026-08-31-001 empty-library fallback. Ship resolver in engine/ next to enemyPixelPatterns.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-02-002  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-09-02-002  
REGRESSION_RISK: HIGH if WX grows with inline drawImage  
VALIDATION_REQUIRED: Empty library screenshot ≡ today; `pnpm typecheck` + `pnpm check`.  
STATUS: NEW  

---

*End of 2026-09-26 ACTION_IDs. Production code not modified.*

# ACTION_IDs — 2026-09-23 Performance Auditor

Inspection scope (HEAD `0f5363f` / `origin/main`): App, ChatPanel, BattleUIPanel,
SpellbookModal, CharacterSelection/Creation, LandingPage, PostBattleRecap, BuffShop,
AchievementsPanel, AchievementToast, debug/*, soundEngine, index.css, useQueries,
usePanelLayout, pieceArt, barrierRender.

Did **not** touch `WorldExploration.tsx` (open #327 / #331 stack) or the world RAF loop.

NEW this run: PERF-2026-09-23-086..090 (reported only).
Do not re-file: PERF-2026-08-31-001..010, PERF-2026-09-01-011..036,
PERF-2026-09-02-037..060, PERF-2026-09-21-061..070, PERF-2026-09-22-071..085.

## Unfixed SAFE at HEAD (already ledgered — prefer implementing these)

Open PRs that already contain the fixes (not merged): #350 (061–064), #392 / #412 (073–074, 080, 083–085).

| ID | HEAD evidence | Autonomy |
|----|---------------|----------|
| PERF-2026-09-21-061 | `useSpellQueries.ts` / `useAdminQueries.ts` catalog hooks lack `refetchOnWindowFocus: false` (only feats at useAdminQueries.ts:341) | SAFE — on #350 |
| PERF-2026-09-21-062 | `soundEngine.ts:220-225` still `createBuffer` + `Math.random` fill per `playNoise` | SAFE — on #350 |
| PERF-2026-09-21-063 | `ChatPanel.tsx:925` `fetchMessages` deps `[actor, isFolded, activeChannel]` | SAFE — on #350 |
| PERF-2026-09-21-064 | `ChatPanel.tsx:661` `setChatWidth(next)` inside pointermove (no rAF coalesce) | SAFE — on #350 |
| PERF-2026-09-22-071 | `WorldExploration.tsx:3883` `drawPixelPattern` ends with unmatched `ctx.restore()` | SAFE — WE file; stack with #327/#331 |
| PERF-2026-09-22-073 | `ChatPanel.tsx:1754` `URL.createObjectURL` without `revokeObjectURL` | SAFE — on #392 |
| PERF-2026-09-22-074 | `BloodParticles.tsx` hidden path stops RAF but does not shrink canvas to 1×1 | SAFE — on #392/#412 |
| PERF-2026-09-22-080 | `ChatPanel.tsx:972-999` focus effect deps include `messages` / battle-log arrays | SAFE — on #392 |
| PERF-2026-09-22-081 | `ChatPanel.tsx:1114+` full channel trees always under `DraggablePanel` when folded | SAFE |
| PERF-2026-09-22-083 | `useAdminQueries.ts:358,382-391` `[FEATS] UNLOCK/CLAIM` `console.log` ungated | SAFE — on #392 |
| PERF-2026-09-22-084 | `ChatPanel.tsx:745-748` click-trace re-snap on every `debugEntries` tick | SAFE — on #392 |
| PERF-2026-09-22-085 | `useLeaderboardQueries.ts:15-40` no `refetchOnWindowFocus: false` | SAFE — on #392 |

Also still NEW (HUMAN) at HEAD from prior ledgers in this file set: 065–070, 072, 075–079, 066–068, 026, 054/042, 057, 060, 069.

---

ACTION_ID: PERF-2026-09-23-086
TITLE: ChatPanel hydrates the full debug ring buffer into React state on mount
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (~L709–720, ~L506)
CURRENT_BEHAVIOUR: On mount, ChatPanel always runs `setDebugEntries([...getDebugLogBuffer()])`, copying up to 2000 buffered log objects into React state even when the Debug tab is never opened. PERF-003 already gated *live* subscriber updates to the Debug channel, but the initial snapshot still retains the full history for the whole world session. Any later ChatPanel setState (poll, width, unread) keeps that array alive.
DESIRED_BEHAVIOUR: Leave `debugEntries` empty until `activeChannel === "debug"` (the existing effect at ~722–725 already re-snaps the buffer on tab enter).
EVIDENCE: useEffect `[]` at ChatPanel.tsx:709–720 calls `setDebugEntries([...getDebugLogBuffer()])` before subscribe; initial state is `[]` at :506.
RECOMMENDED_ACTION: Remove the mount hydrate; keep subscribe gate + channel-enter snap. Distinct from PERF-003 (live mirror), PERF-077 (module buffer), PERF-084 (click-trace tick).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Opening Debug the first time must still show history via the activeChannel effect.
VALIDATION_REQUIRED: Enter world without opening Debug; React state for debugEntries stays empty; open Debug tab and see buffer; leave tab; no per-log setState.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-23-087
TITLE: Active-turn battle caret runs infinite CSS transform + drop-shadow during combat
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/index.css (.stone-battle-caret ~L840–858); src/frontend/src/components/BattleUIPanel.tsx (~L264–265)
CURRENT_BEHAVIOUR: While `inBattle` and a turn chip is active, `.stone-battle-caret` runs `bounceCaret` forever with `filter: drop-shadow(...)`. That is a continuous compositor animation on the live battle HUD under the world canvas. Distinct from PERF-072 (landing `chessDrift` CSS under dual landing RAFs).
DESIRED_BEHAVIOUR: Honor `prefers-reduced-motion`; optionally drop the filter and use opacity-only or a static marker. Keep the active-turn read.
EVIDENCE: BattleUIPanel renders `<div className="stone-battle-caret" />` when `isActive`; index.css sets `animation: bounceCaret 1s ease-in-out infinite` plus drop-shadow.
RECOMMENDED_ACTION: CSS-only reduced-motion / cheaper shadow. Do not change turn-order logic.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Active-turn affordance is combat UX; a static caret must stay visible on dark chips.
VALIDATION_REQUIRED: Battle screenshot with active caret; reduced-motion OS setting; no layout shift on turn change.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-23-088
TITLE: Barrier tower draw does 18 save/restore + dim rgba strings per tile per frame
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/barrierRender.ts (drawBarrierLayer ~L28–101; drawBarrierTower ~L108–125)
CURRENT_BEHAVIOUR: Each barrier tile stacks 6 layers × 3 faces. Every face does `ctx.save` / fill / optional dim fill with a fresh `` `rgba(0,0,0,${dim})` `` string / stroke / `restore`. With several barriers this is dozens of state flips per RAF on the world canvas. Distinct from PERF-035 (entity foot shadows), PERF-066 (pixel bake), PERF-022 (barrier Set rebuild).
DESIRED_BEHAVIOUR: Hoist dim fillStyles (finite shade steps), reduce save/restore to one outer (or draw without per-face save), or blit a cached tower ImageBitmap keyed by tile size/DPR.
EVIDENCE: drawBarrierLayer three save/restore blocks; dim strings at ~56 and ~76; tower loop `BARRIER_LAYERS = 6` at :120–124.
RECOMMENDED_ACTION: Visual-approved cheap path first (style reuse + fewer saves). Full sprite cache is HUMAN.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Iso painter order / outline weight must match current towers; depth sort vs entities must stay correct.
VALIDATION_REQUIRED: Place barriers in battle; side-by-side screenshot; frame time with 3+ towers.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-23-089
TITLE: Spellbook SummonAbilitiesBlock does O(n) spell finds for every summon card every render
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/SpellbookModal.tsx (SummonAbilitiesBlock ~L261–264; mount site ~L1034–1041)
CURRENT_BEHAVIOUR: Every summon spell card always mounts `SummonAbilitiesBlock`, which resolves kit ids with `allSpells.find` per id on every modal re-render (upgrade clicks, selection, doka updates). Catalog size × kit size linear scans while the modal is open over the live world. Distinct from PERF-025 (battle summon-control kit memo in WE).
DESIRED_BEHAVIOUR: Build a `Map<id, SpellConfig>` once per `allSpells` identity; memo kit rows per spell id + levels.
EVIDENCE: `kitIds.map((id) => allSpells.find(...))` at :262–264; unconditional `{spell.isSummon && spell.summonUnitDef && (<SummonAbilitiesBlock .../>)}` in the catalog grid.
RECOMMENDED_ACTION: Id map + useMemo. Do not change summon HP/AP/MP formulas.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Missing kit ids must still skip cleanly; leveled stats must match current chips.
VALIDATION_REQUIRED: Open spellbook with multiple summons; expand/upgrade; kit names and HP chips unchanged.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-23-090
TITLE: Spellbook RangePatternGrid recomputes targeting geometry without memo
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/SpellbookModal.tsx (computePreviewCells ~L81–117; RangePatternGrid ~L119–200; preview mount ~L1021–1029)
CURRENT_BEHAVIOUR: When a spell is selected for preview, each parent re-render calls `computePreviewCells`, which allocates a 9×9 `tiles` grid, an empty enemies array, a barrier Map, runs `computeTargetableTiles`, then builds a new Set and 81 styled DOM cells via nested `Array.from`. Distinct from live canvas highlight string keys (PERF-076) and from bake/pixel work.
DESIRED_BEHAVIOUR: `useMemo(() => computePreviewCells(spell), [spell.id, range fields…])`; keep the 9×9 DOM or swap to one canvas blit.
EVIDENCE: `const hitSet = computePreviewCells(spell)` with no memo at :123; `previewSpellId === spell.id` gate at :1021.
RECOMMENDED_ACTION: Memoize hitSet by spell identity. Do not change `#296` targeting parity.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Preview must still match `computeTargetableTiles` / `spellHighlightRangeBase` after level or spell edits.
VALIDATION_REQUIRED: Select several spell types (self/line/aoe); preview cells match prior screenshots.
STATUS: NEW

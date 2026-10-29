# ACTION_IDs — 2026-10-29 Performance Auditor (React / subscriptions)

Scope: `src/frontend/src/components`, `hooks`, `App.tsx`, `main.tsx`.
WorldExploration RAF internals excluded except React `setState` from RAF.
Do not re-file PERF-2026-08-31-001 … PERF-2026-10-28-204.
Known leftovers (not re-filed): 201 chat poll during Game Over, 202 drag
offsetWidth, 203 closed Achievements dual-subscribe, 204 closed BuffShop
inventory rewrite, 055 doka HUD island, 057 BuffShop always mounted,
060 Achievements always mounted.

This run: report NEW PERF-205 … PERF-209 only. No implementation.

---

ACTION_ID: PERF-2026-10-29-205
TITLE: Stats HUD DraggablePanel starts unfolded with the full character-sheet DOM live
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (stats-panel DraggablePanel ~L18061–18072; sheet body ~L18073–18820)
CURRENT_BEHAVIOUR: `panelId="stats-panel"` uses `defaultFolded={false}`. From world entry the portrait, vitals orbs, XP bar, heal controls, and in-battle effect lists are committed DOM. Every WorldExploration setState (1 Hz turn timer, idle HP regen, wander `syncCombatants`, battle AP/MP) re-reconciles that sheet. Same class as Chat/MapModifiers starting unfolded (103 / 113), but the Stats sheet is the largest always-live HUD body and was not previously ledgered.
DESIRED_BEHAVIOUR: Start folded (`defaultFolded={true}`) or mount the heavy sheet body only while unfolded, matching SettingsPanel’s folded-by-default posture.
EVIDENCE: Read `WorldExploration.tsx` L18069 `defaultFolded={false}` and the large children block that follows. Distinct from PERF-106 (double `activeEffects` filter inside the sheet) and PERF-113 (Map Effects panel).
RECOMMENDED_ACTION: Flip default fold or gate children behind fold state inside a Stats shell. Do not change persist-lock / heal math in a perf-only PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Players who relied on an always-open Stats sheet must unfold once; saved layout `folded` still wins after first persist.
VALIDATION_REQUIRED: Enter world; Stats starts folded; unfold shows vitals; HP/AP update while open; layout save restores fold preference.
DISJOINT_HELPER: No — requires WorldExploration (stacked) or DraggablePanel panelId default (also stacked).
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-206
TITLE: ChatPanel isFolded never syncs when DraggablePanel restores a folded layout
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (~L496 `useState(false)`, ~L1125 `onFoldChange`); src/frontend/src/components/DraggablePanel.tsx (~L459 localStorage `setFolded`, ~L528 backend reconcile `setFolded`, ~L784 `onFoldChange` only on toggle)
CURRENT_BEHAVIOUR: Chat keeps its own `isFolded` starting at `false`. DraggablePanel can restore `folded: true` from localStorage / `getUserUiLayout` without calling `onFoldChange`. Chat then treats a visually folded panel as open: the open-path focus effect (~L972–999) still schedules `inputRef.focus()` on every poll / battle-log / effects length change, and unread/scroll guards use the wrong flag. Complements PERF-080 / PERF-081 (focus + tree build) with a restore desync that keeps the open-path hot after a folded session.
DESIRED_BEHAVIOUR: When applying a saved/backend fold state, notify `onFoldChange(saved.folded)` (or initialize Chat `isFolded` from the same layout key).
EVIDENCE: DraggablePanel mount effect sets folded at L459 / L528 with no `onFoldChange` call; only `handleFoldToggle` (~L779–785) notifies. ChatPanel L496 / L1125.
RECOMMENDED_ACTION: One `onFoldChange?.(saved.folded)` after each restore path, or read layout once in ChatPanel. Do not change channel poll interval here (177 / 201).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Restored-folded chat must not steal focus; unread badges must still increment while folded.
VALIDATION_REQUIRED: Fold chat, reload world; panel stays folded; battle log lines do not focus a hidden input; unfold clears unread.
DISJOINT_HELPER: No — ChatPanel and DraggablePanel are both stacked.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-207
TITLE: Achievement check useCallback depends on the whole markAchievementUnlocked mutation object
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (`checkAndFireAchievement` ~L2217–2252; consumers ~L2260–2284, ~L2287–2291, ~L3629–3642)
CURRENT_BEHAVIOUR: `useCallback(..., [achievementConfigs, playerAchievements, markAchievementUnlocked])` lists the entire mutation result. TanStack Query returns a new mutation object identity every render, so `checkAndFireAchievement` is a new function every WorldExploration render. Effects that depend on it (doka/maps, jackpot, level/spell mastery) tear down and re-run on every wander commit, HP regen tick, turn timer tick, and other WX setStates — re-walking configs with `.find` / `.some` even when values are unchanged.
DESIRED_BEHAVIOUR: Depend on the stable `markAchievementUnlocked.mutate` (or a ref-held unlock fn). Keep `achievementsShownRef` / already-unlocked guards.
EVIDENCE: L2252 dependency array uses `markAchievementUnlocked`; L2284 / L2291 / L3642 effects list `checkAndFireAchievement`. Distinct from PERF-050 (feats query focus refetch) and PERF-203 (closed AchievementsPanel subscription).
RECOMMENDED_ACTION: Switch deps to `.mutate` or `useRef` the mutator. Do not weaken unlock/claim invalidate paths.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Missing a real config/progress dep could skip a legitimate unlock; prefer `.mutate` + existing config/progress deps.
VALIDATION_REQUIRED: Unlock doka_1000 / level_10 in-session; toast once; alt-tab and wander without repeat toasts; typecheck.
DISJOINT_HELPER: Partial — a small `useStableAchievementUnlock()` helper can live outside stacked files, but WorldExploration must call it (stacked).
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-208
TITLE: Idle HP regen still setStates WorldExploration during the Game Over early-return
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (regen interval ~L3617–3627; Game Over early-return ~L17425–17438)
CURRENT_BEHAVIOUR: Overworld regen `setInterval` (10s) calls `setCharacterStats` whenever `!inBattleRef`. Death clears battle and sets `showGameOver`, which early-returns only `<GameOverModal />` — but all hooks stay mounted. Each regen tick still re-renders the full `WorldExplorationInner` tree only to hit the Game Over early-return again. Distinct from PERF-128 (regen cost during normal idle) and PERF-200 / PERF-201 (watchdog RAF / chat poll during Game Over).
DESIRED_BEHAVIOUR: Skip regen while `showGameOver` or `deathTriggeredRef` is set; resume after Death Realm entry.
EVIDENCE: L3618–3624 interval ignores `showGameOver`; L17425 early-return leaves hooks alive. Regen is React setState, not RAF internals.
RECOMMENDED_ACTION: Guard with a ref mirrored from `showGameOver` / death. Do not change `respawnHpAfterDeath` math.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: After Enter Death Realm, idle regen must resume on the realm map.
VALIDATION_REQUIRED: Die with HP&lt;max; wait &gt;10s on Game Over modal; no characterStats-driven work; respawn; regen works in realm/overworld.
DISJOINT_HELPER: Partial — `shouldRunIdleHpRegen({ inBattle, showGameOver })` can be a disjoint helper; WorldExploration still needs the guard (stacked).
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-209
TITLE: Character slots query uses staleTime 0 and refetchOnMount always on the select screen
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/hooks/useCharacterQueries.ts (`useGetCharacterSlots` ~L67–88); src/frontend/src/components/CharacterSelection.tsx (~L848–853)
CURRENT_BEHAVIOUR: Lobby `useGetCharacterSlots` sets `staleTime: 0` and `refetchOnMount: "always"`. Every visit to character select (including create → back) refetches all three slots from the canister before paint, hitching the BloodParticles + Starfield select screen. Mutations already `invalidateQueries(["characterSlots"])`. Distinct from PERF-123 (callerDokaBalance on select — CharacterSelection no longer subscribes) and PERF-009 / PERF-070 (global QueryClient / doka).
DESIRED_BEHAVIOUR: `staleTime` ~30s; `refetchOnMount` if stale (default) or `true` only when empty; keep `refetchOnWindowFocus: false`.
EVIDENCE: `useCharacterQueries.ts` L83–85; CharacterSelection L853 `useGetCharacterSlots()`.
RECOMMENDED_ACTION: Raise staleTime; drop forced always-remount refetch. Do not weaken create/delete/rename invalidation.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Slot list may lag briefly after an external-tab change until invalidate/refetch.
VALIDATION_REQUIRED: Create/delete/rename slot updates list; revisit select without a redundant canister round-trip within staleTime; typecheck.
DISJOINT_HELPER: Yes — change only `useCharacterQueries.ts` (not a stacked file).
STATUS: NEW

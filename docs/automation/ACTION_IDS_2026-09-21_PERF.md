# ACTION_IDs — 2026-09-21 Performance Auditor

Implemented this run: PERF-2026-09-21-061, 062, 063, 064.
Reported only: PERF-2026-09-21-065 through 070.
Already ledgered (do not re-file): PERF-2026-08-31-001..010, PERF-2026-09-01-011..036, PERF-2026-09-02-037..060.

---

ACTION_ID: PERF-2026-09-21-061
TITLE: Stop WorldExploration catalog queries from refetching on window focus
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/hooks/useAdminQueries.ts (useGetMapModifiers, useGetGameConfig, useGetAchievementConfigs, useGetEnemyNames); src/frontend/src/hooks/useSpellQueries.ts (useGetSpellConfigs, useGetRegionConfigs); src/frontend/src/components/WorldExploration.tsx (~L2161)
CURRENT_BEHAVIOUR: QueryClient default `refetchOnWindowFocus` is true. After staleTime (30–60s), alt-tab back into play fired six canister catalog fetches. Each queryFn ran Candid decode + `deepNormalizeBigInts` on the main thread; any identity change re-rendered the ~19k-line WorldExploration tree (spell library, modifiers, names). Distinct from PERF-050 (playerAchievements) and PERF-009 (callerDokaBalance / wallet hydrate).
DESIRED_BEHAVIOUR: Catalog queries skip window-focus refetch. Admin mutations still invalidate. First mount / staleTime expiry on remount still loads.
EVIDENCE: WorldExplorationInner subscribes to the six hooks listed. Only `useGetPlayerAchievements` had `refetchOnWindowFocus: false`.
RECOMMENDED_ACTION: Keep `refetchOnWindowFocus: false` on those six hooks. Do not change `useGetCallerDokaBalance` here (PERF-009).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Admin catalog edits in another tab lag until invalidate or remount (same class as feats after PERF-050). In-session admin writes still invalidate.
VALIDATION_REQUIRED: Typecheck; enter world; alt-tab after 30s does not hitch the canvas; opening Admin and saving a spell still refreshes the library.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-21-062
TITLE: Reuse one white-noise AudioBuffer in SoundEngine
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/soundEngine.ts (playNoise); src/frontend/src/hooks/useSoundHooks.ts
CURRENT_BEHAVIOUR: Every `spell_hit`, `critical_hit`, and `map_transition` allocated a new AudioBuffer and filled it with `Math.random` at sample rate (6.6k–26k floats). Combat hit strings caused GC hitch / input latency, especially on mobile.
DESIRED_BEHAVIOUR: One 1s shared noise buffer per AudioContext; BufferSourceNodes share it and stop at the event duration. Envelope lengths unchanged.
EVIDENCE: playNoise created `ctx.createBuffer(1, sampleRate * duration, sampleRate)` per call. Longest burst is map_transition 0.6s.
RECOMMENDED_ACTION: Keep getSharedNoiseBuffer. Do not change oscillator playTone paths or VOICE_CAP.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Overlapping hits share the same noise grain (inaudible at these lengths). Context recreate must drop the cache (ctor already nulls it).
VALIDATION_REQUIRED: node --experimental-strip-types --test src/frontend/src/engine/soundEngine.test.ts; cast a spell, crit, and portal whoosh still play.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-21-063
TITLE: Keep ChatPanel getMessages poll off fold/channel identity
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx; src/frontend/src/engine/chatPollActivity.ts
CURRENT_BEHAVIOUR: `fetchMessages` closed over `isFolded` and `activeChannel`, so folding chat or switching tabs tore down the 2s interval and immediately hit `getMessages()`. During world play that is extra canister work plus ChatPanel setState under the live canvas.
DESIRED_BEHAVIOUR: Poll identity depends on actor (and isPaused for battle pause). Unread counting reads fold/channel refs. Hidden-tab and in-battle skips unchanged.
EVIDENCE: ChatPanel fetchMessages deps were `[actor, isFolded, activeChannel]`; the interval effect depended on fetchMessages.
RECOMMENDED_ACTION: Keep the refs. Distinct from PERF-020 (client cap / virtualize the General list).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Unread badge must still increment when folded or on another tab; opening General still clears it. Battle pause must still stop polling.
VALIDATION_REQUIRED: node --experimental-strip-types --test src/frontend/src/engine/chatPollActivity.test.ts; fold chat, switch to Battle Log, send a line from another session; unread increments; leave battle and poll resumes.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-21-064
TITLE: Coalesce ChatPanel width-drag setState to one update per animation frame
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (right-edge drag handle)
CURRENT_BEHAVIOUR: pointermove called setChatWidth at input rate and a width effect wrote localStorage on every commit. ChatPanel is memoized vs GameFlow siblings, but its own setState still reconciled the 2k-line chat tree (and up to 500 battle-log nodes) while the world canvas is live. Same class as PERF-012 (DraggablePanel) / PERF-021 (ChallengePanel).
DESIRED_BEHAVIOUR: Queue the latest width and flush once per animation frame; commit the last width on pointerup. Listeners still attach only during drag.
EVIDENCE: onDragHandlePointerDown onMove setChatWidth(next) per event; useEffect persisted chatWidth immediately.
RECOMMENDED_ACTION: Keep the pending-width rAF flush. Do not virtualize the battle log in this change (PERF-019).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Width must still clamp to DEFAULT/MAX; localStorage must store the released width.
VALIDATION_REQUIRED: Typecheck; drag the chat right edge; panel tracks; release persists after reload.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-21-065
TITLE: ChallengePanel stays mounted (hooks run) while no challenge is offered
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: medium
FILES_OR_SYSTEMS: src/frontend/src/components/ChallengePanel.tsx; src/frontend/src/components/WorldExploration.tsx (~L19177)
CURRENT_BEHAVIOUR: WorldExploration always mounts ChallengePanel. Closed/hidden path returns null after layout localStorage parse, position state, and drag refs. Every world setState still re-executes that hook tree. Same class as PERF-057 (BuffShop) and PERF-060 (AchievementsPanel).
DESIRED_BEHAVIOUR: Mount the body only while `shouldShowChallengeHud` is true, without losing persisted position across battles.
EVIDENCE: WorldExploration always renders `<ChallengePanel visible={...} />`; ChallengePanel early-returns after hooks.
RECOMMENDED_ACTION: Split shell/body or gate the mount on visible+challenge. Preserve STORAGE_KEY_PREFIX layout.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Position/fold localStorage can reset if the panel unmounts between offer and accept; HUD must still appear before the first action.
VALIDATION_REQUIRED: Start a battle with a challenge; accept; HUD remains after the first action; decline dismisses; next fight restores the saved pose.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-21-066
TITLE: Bake combatant pixel-art to an offscreen sprite instead of fillRect per pixel per frame
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/data/pieceArt.ts (drawPixelPattern / drawCombatant); src/frontend/src/components/WorldExploration.tsx (entity pass)
CURRENT_BEHAVIOUR: PERF-031 hoisted pattern tables, but every entity still nested-loops fillRect for each non-zero pixel every RAF (8–16 combatants × ~100 rects × 60fps). Dominant canvas CPU after the static tile pass (PERF-005). Mobile frame pacing and input latency.
DESIRED_BEHAVIOUR: Cache an OffscreenCanvas / ImageBitmap keyed by pattern identity + palette + scale + DPR; blit one drawImage per entity. Invalidate on those keys.
EVIDENCE: pieceArt.ts draw() fillRect loop; drawCombatant calls it per entity per frame. Distinct from PERF-031 (lookup tables only).
RECOMMENDED_ACTION: Visual-approved sprite cache. Do not fold into RAF scheduling. Do not change CHARACTERY_OFFSET or owner tint rules in the same PR if those stay live overlays.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Scale/DPR mismatch blurs pixel art; hit-flash/owner-tint/moving-shadow overlays can bake into the sprite if the cache key is incomplete.
VALIDATION_REQUIRED: Side-by-side player, family, boss, and summon sprites on desktop and a narrow viewport; hit-flash still tints; owner outline still green/red.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-21-067
TITLE: Summon owner-tint uses per-entity canvas shadowBlur every frame
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/data/pieceArt.ts (strokeOwnerTint)
CURRENT_BEHAVIOUR: Each summon save + shadowBlur 8 + strokeRect + restore every RAF. Same expensive 2D op as landing starfield (PERF-008) and logo cubes (PERF-054), but on the live world canvas during combat (player + enemy summons). Distinct from foot-shadow radial gradients (PERF-035).
DESIRED_BEHAVIOUR: Cheap outline (stroke without shadowBlur, or a cached glow). Keep green/red owner read.
EVIDENCE: strokeOwnerTint sets ctx.shadowBlur = 8 then strokeRect. drawCombatant applies it on the isSummon branch.
RECOMMENDED_ACTION: Visual-approved substitute. Do not change tint colors or when the outline is applied.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Summon ownership glow is a combat readability cue; a flat stroke may be harder to see on lava/hazard tiles.
VALIDATION_REQUIRED: Player summon and enemy summon side-by-side screenshot in explore-adjacent battle.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-21-068
TITLE: BattleUIPanel always mounts and rebuilds unit records while exploring
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~L18829); src/frontend/src/components/BattleUIPanel.tsx
CURRENT_BEHAVIOUR: Comment says “always visible; battle-only sections gated by inBattle”. The panel (DraggablePanel + turn-order map + Escape keydown + unitStats allocation) stays in the WorldExploration tree for the whole session. 1 Hz timer / HP regen / walk setState still reconcilie it. Complements PERF-026 (internal unitStats memo) and PERF-051 (turnOrder identity) but does not isolate the panel while `inBattle` is false.
DESIRED_BEHAVIOUR: Mount battle chrome only in battle, or React.memo with stable callbacks so explore-only setStates skip it. Spell bar / inspect paths must still work the first player turn.
EVIDENCE: WorldExploration always renders `<BattleUIPanel inBattle={inBattle} ...>` with inline onSelectSpell / onAttackNearest lambdas (new identity each parent render), so even a memo wrapper would miss. Escape listener is attached in overworld.
RECOMMENDED_ACTION: Stabilize callbacks then memo, or defer mount until inBattle. Do not change spell-bar dirty guards in the same PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: First-turn spell selection, Attack Nearest, and inspect-from-sprite can miss if the panel mounts a frame late or callbacks close over stale AP.
VALIDATION_REQUIRED: Enter battle; select a spell on turn 1; Attack Nearest; inspect a chip; leave battle; panel chrome hides; overworld walk does not attach battle hotkeys.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-21-069
TITLE: ChatPanel persist-writes chat width on every rAF commit during drag
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: medium
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (CHAT_WIDTH_KEY effect)
CURRENT_BEHAVIOUR: After PERF-064, setChatWidth still flushes once per frame and a useEffect writes localStorage each commit. Synchronous localStorage on the main thread during a live canvas is avoidable; persist on pointerup is enough.
DESIRED_BEHAVIOUR: Write CHAT_WIDTH_KEY on pointerup (and unmount if a pending width exists). Keep load-on-mount.
EVIDENCE: useEffect([chatWidth]) localStorage.setItem. 064 reduced rate from pointer-rate to 60Hz; this is the remaining storage cost.
RECOMMENDED_ACTION: Move persist into onUp / unmount. Do not change DEFAULT/MAX clamps.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: A crash mid-drag would lose the in-flight width (acceptable; last committed width remains).
VALIDATION_REQUIRED: Drag, release, reload; width restored. Unmount mid-drag must not leak the rAF (already cancelled in 064 cleanup).
STATUS: NEW

---

ACTION_ID: PERF-2026-09-21-070
TITLE: QueryClient global refetchOnWindowFocus remains true (wallet + lobby queries)
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: medium
FILES_OR_SYSTEMS: src/frontend/src/main.tsx; src/frontend/src/hooks/useCharacterQueries.ts (useGetCallerDokaBalance is PERF-009; useGetCharacterSlots staleTime 0)
CURRENT_BEHAVIOUR: `new QueryClient()` with no defaults. 061 only gated WorldExploration catalogs. Character-select `characterSlots` still refetches on focus (staleTime 0). GameFlow Doka query still focus-refetches (wallet correctness, PERF-009). Lobby BloodParticles + Starfield already compete for RAF (PERF-041).
DESIRED_BEHAVIOUR: Conservative QueryClient default `refetchOnWindowFocus: false`, with explicit true only where a human wants it. Wallet hydrate rules in shouldApplyCallerDokaHydrate stay authoritative.
EVIDENCE: main.tsx QueryClient(); useGetCharacterSlots refetchOnMount always + staleTime 0 + default focus refetch.
RECOMMENDED_ACTION: Do not land a global default in a perf-only PR without hydrate fixtures. 009 remains the Doka-specific path.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Players who expect focus to refresh another-tab Doka/slot edits would not. Persist-lock already skips the Doka key.
VALIDATION_REQUIRED: Focus during a heal/spend does not change the HUD; character select still shows slots after create/delete; first world hydrate still seeds from the canister.
STATUS: NEW

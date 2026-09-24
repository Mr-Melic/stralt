# ACTION_IDs — 2026-09-24 Performance Auditor

Implemented this increment: PERF-2026-09-24-102.
Reported only: PERF-2026-09-24-103 through 107.

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060,
09-21-061..070, 09-22-071..085, 09-23-086..101.

Starfield hunk is disjoint from open perf PRs #350 (catalog/SFX/chat poll),
#392/#412 (BloodParticles GPU + ChatPanel), #429 (uiLayout fetch), #447
(useIsMobile / profile focus / ChatPanel debug snapshot).

## Residual on HEAD (already ledgered; still open in older PRs)

| ID | Still on HEAD | Where it lives |
|---|---|---|
| 061 | Catalog `refetchOnWindowFocus` default true | #350 |
| 062 | `playNoise` still allocates a buffer per hit | #350 |
| 009 / 070 | `callerDokaBalance` staleTime 0; global QC default | HUMAN |
| 083 | `[FEATS] UNLOCK/CLAIM` `console.log` | #392 |
| 085 | Leaderboard focus refetch | #392 |
| 094–096 | useIsMobile equality, profile focus, debug mount copy | #447 |
| 005–008, 013, 016, 019, 027, 032, 035, 037–041, 054–055, 057, 060, 065–068, 071, 077, 081–082, 086–093, 097–101 | Reported earlier | Do not re-file |

---

ACTION_ID: PERF-2026-09-24-102
TITLE: Stop landing starfield from reallocating ~250 stars on every resize
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/StarfieldBackground.tsx; src/frontend/src/engine/starfieldActivity.ts
CURRENT_BEHAVIOUR: Window `resize` always assigned `canvas.width`/`height` (clears the 2D buffer) then `createStars()` (~250 objects + milky-way clusters). A ResizeObserver did the same assign. Mobile URL-bar chrome and duplicate window+RO events hit this on landing and character select while Starfield shadowBlur RAF (PERF-008) and BloodParticles already run. Distinct from PERF-049 (skip resize while the world canvas covers the starfield).
DESIRED_BEHAVIOUR: Skip backing-store assign when the integer size is unchanged. After GPU 1×1 release or an empty list, rebuild. Otherwise scale existing star x/y into the new CSS size.
EVIDENCE: Prior `handleResize` called `resizeCanvas(); createStars();` with no size equality guard. RO assigned `clientWidth`/`clientHeight` even when already equal.
RECOMMENDED_ACTION: Keep `shouldAssignStarfieldBacking` / `shouldRebuildStarfieldStars` / `starfieldPositionScale`. Do not change per-star shadowBlur (PERF-008).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Rotate/maximize must still fill the new viewport (positions scale). Leaving the world must still `createStars` after 1×1 release.
VALIDATION_REQUIRED: node --experimental-strip-types --test src/frontend/src/engine/starfieldActivity.test.ts; landing resize without a hitch; enter world (starfield stays paused); leave world, stars resume.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-24-103
TITLE: ChatPanel starts unfolded so the full channel DOM is live from world entry
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (`defaultFolded={false}`); src/frontend/src/components/DraggablePanel.tsx
CURRENT_BEHAVIOUR: Chat mounts unfolded. PERF-081's "skip body while folded" would not apply to the default session. The panel maps General messages, up to 500 battle-log rows when that tab is selected, and the 2s `getMessages` poll runs under the live canvas. Distinct from PERF-019 (virtualize when open), PERF-020 (cap history), PERF-080 (input focus on poll).
DESIRED_BEHAVIOUR: Default folded (or remember last fold), so world entry does not mount the message list until the player opens chat. Unread badges on the title must still work.
EVIDENCE: ChatPanel `defaultFolded={false}`. Layout persistence can unfold later; first paint is open.
RECOMMENDED_ACTION: Change default to folded after UX sign-off. ChatPanel is in #350 / #392 / #447 — union, do not overwrite.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Players who expect chat open on Play would need an extra tap. Persisted unfold must still win over the new default.
VALIDATION_REQUIRED: Fresh profile: chat starts folded; unfold shows General; battle-log unread while folded; layout restore after reload.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-24-104
TITLE: Always-mounted BuffShop receives new getLiveDoka / onDeductDoka closures every WorldExploration render
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~17908–17939); src/frontend/src/components/BuffShop.tsx
CURRENT_BEHAVIOUR: PERF-057 already notes BuffShop stays mounted while closed. Parent still passes `getLiveDoka={() => dokaBalanceRef.current}` and a large `onDeductDoka` lambda, so even a future `React.memo(BuffShop)` cannot skip the 1 Hz turn-timer / HP-regen / walk setStates. Distinct from 057 (shell/body split) and from persist-lock spend math.
DESIRED_BEHAVIOUR: Stable useCallback wrappers (empty deps, refs inside) before memoizing the shop. Do not change debit/rollback rules.
EVIDENCE: Inline lambdas at the BuffShop mount in WorldExplorationInner. BuffShop is not memoized.
RECOMMENDED_ACTION: Extract stable callbacks, then memo. WorldExploration is in older combat/map PRs (#327/#331/…) — restack/union.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Stale wallet ref would allow a double-spend or skip rollback. Callbacks must read `dokaBalanceRef` / persist helpers, not a render snapshot.
VALIDATION_REQUIRED: Buy a potion, failed persist rolls back stack and HUD; battle-only items stay gated.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-24-105
TITLE: ChallengePanel gets a fresh progress object and accept/decline lambdas on every world render
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~19177–19200); src/frontend/src/components/ChallengePanel.tsx
CURRENT_BEHAVIOUR: PERF-065 already notes the panel stays mounted while no challenge is offered (hooks + layout JSON still run). Parent additionally allocates `progress={{ turnCount: challengeTurnCountRef.current, ... }}` and new `onAccept`/`onDecline` functions every WorldExploration setState, including the 1 Hz battle timer. Distinct from 065 (gate the mount) and 021 (drag rAF).
DESIRED_BEHAVIOUR: Mount only while `shouldShowChallengeHud`; or memo with a progress version bump and stable callbacks. Keep STORAGE_KEY_PREFIX pose.
EVIDENCE: Always-rendered `<ChallengePanel progress={{...}} onAccept={() => {...}} />`.
RECOMMENDED_ACTION: Pair with 065. Do not change accept-after-first-action HUD persistence (recent UX fix).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HUD must remain after the first action; decline must still clear; next fight restores saved pose.
VALIDATION_REQUIRED: Offer, accept, first action, HUD stays; decline dismisses; next battle pose restored.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-24-106
TITLE: Stats HUD filters activeEffects twice in JSX on every in-battle WorldExploration render
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~18342–18355)
CURRENT_BEHAVIOUR: The player status-badge row does `activeEffects.filter(e => e.targetId === "player")` for the map and again for the empty-state length check. The 1 Hz turn timer (PERF-007) re-runs both filters. Distinct from PERF-034 (canvas entity pass filters the same array per combatant per RAF).
DESIRED_BEHAVIOUR: One useMemo (or a ref index from 034) shared by badges and empty copy.
EVIDENCE: Consecutive `.filter` calls in the inBattle stats overlay.
RECOMMENDED_ACTION: Memoize with 034's targetId index if that lands. Do not change badge contents.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Empty copy must still appear when the player has no effects; stack keys must stay unique.
VALIDATION_REQUIRED: Apply a player buff; badges show; expiry shows "No active effects"; 1 Hz timer does not rebuild a new filtered array (profiler).
STATUS: NEW

---

ACTION_ID: PERF-2026-09-24-107
TITLE: Enemy stats overlay also filters activeEffects per listed enemy during battle
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~18715–18726)
CURRENT_BEHAVIOUR: The side-panel enemy list maps living enemies and filters `activeEffects` per enemy for badges (and again for empty). Complements 106 and canvas 034. N is small (8–16) but runs on every parent setState while the panel is open in battle.
DESIRED_BEHAVIOUR: Same targetId index as 034/106.
EVIDENCE: `activeEffects.filter((e) => e.targetId === enemy.id)` in the enemy-card JSX.
RECOMMENDED_ACTION: Share the index. Do not change inspect popup contents (PERF-026).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: DoT icons missing on a newly spawned summon if the index is stale.
VALIDATION_REQUIRED: DoT two enemies; both cards show icons; expiry clears them.
STATUS: NEW

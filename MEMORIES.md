# Bug-hunt memory

Open or rejected only. Delete an entry when its PR merges or the bug is gone.

- Leftover XP HUD: character select treated `experience` as cumulative, GameFlow top bar read a never-written App `selectedCharacter.xp`/`blood`, recap used `level * 100` / `xpForNextLevel: 0`. Persist already stores leftover via `100 * 2^(N-1)`. This run. Supersedes stale #108.
- Plague Zone player death is still `setCharacterStats` HP-2 only (`WorldExploration.tsx` ~14353); victory can credit after a lethal tick. Barrier LoS is still missing from `isTileCastableLive`. Draft #114. Recorded: 2026-08-31.
- Touch battle-walk hazards now share `applyBattleWalkHazards` with mouse. Ghost-click window is 400ms (`pointerParity` + `pointerGesture`). Recorded: 2026-08-30; still true 2026-09-26.
- GameFlow no longer covers the live WX HUD with a second opaque bar. Items/Board/Feats/Bosses still sit at `calc(var(--app-top-hud-height) + 2px)` over the map (`MAA-2026-08-31-006`). Recorded: 2026-09-26.
- BattleUIPanel is a persisted DraggablePanel, not a sticky mobile dock (DESIGN.md bottom-menu rule). `MAA-2026-08-31-007`. Recorded: 2026-08-31.
- Spell / status `title=` tooltips and mouse-only hover preview have no touch equivalent. Documented long-press inspect is not implemented. `MAA-2026-08-31-008/009`. Recorded: 2026-08-31.
- Sprite hit padding is 10px mouse vs 14px touch; live gates match after target pick. `MAA-2026-08-31-010`. Recorded: 2026-08-31.
- Inspect card with a missing chip rect sat at 0,0. `clampInspectPopupPosition` centers and clamps. Close is 44px. Recorded: 2026-09-26.

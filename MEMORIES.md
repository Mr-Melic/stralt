# Bug-hunt memory

Open or rejected only. Delete an entry when its PR merges or the bug is gone.

- Leftover XP HUD: character select treated `experience` as cumulative, GameFlow top bar read a never-written App `selectedCharacter.xp`/`blood`, recap used `level * 100` / `xpForNextLevel: 0`. Persist already stores leftover via `100 * 2^(N-1)`. This run. Supersedes stale #108.
- Plague Zone player death is still `setCharacterStats` HP-2 only (`WorldExploration.tsx` ~14353); victory can credit after a lethal tick. Barrier LoS is still missing from `isTileCastableLive`. Draft #114. Recorded: 2026-08-31.

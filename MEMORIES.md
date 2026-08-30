# Bug-hunt memory

Open or rejected only. Delete an entry when its PR merges or the bug is gone.

- Dungeon-chain completion attached the white sanctuary portal at hardcoded `(0, 0)`. Fortress corners and chessboard even/even cells wall that tile; portal entry is coordinate-based, so the advertised gateway was unwalkable. Relocate with `placeWhitePortalAtSpawn` onto `spawnPosition` (same contract as boss-rush `whiteSpawn`). Same change: betrayal / boss phase-2 / enemy-boss heals wrote `setTurnOrder` / `enemyHpMap` only — `enemyTakesDamage` reads store HP and could ignore a heal or kill a phase-2 boss at phase-1 HP. Jackpot heal used render-closure `dokaBalance` instead of `dokaBalanceRef`. Recorded: 2026-08-30.

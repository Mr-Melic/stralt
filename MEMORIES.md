# Bug-hunt memory

Open or rejected only. Delete an entry when its PR merges or the bug is gone.

- Touch battle-walk (`handleCanvasTouch`) skipped Thorned Ground and Void Rift HP / challenge debits that mouse walk applied, so tablet/touch players could complete Untouchable and under-damage challenges the mouse path fails. Shared `battleWalkHazardDamages` + `applyBattleWalkHazards`. Recorded: 2026-08-30.

# Player data evolution audit — 2026-10-25

**Guardian:** Save / Data Evolution Guardian  
**Trigger:** cron / automation  
**HEAD:** `0f5363f`  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

This run does **not** approve any new required persist field and does **not** edit
`WorldExploration.tsx`, `main.mo`, `BuffShop.tsx`, `versionGate.ts`,
`deathPenalty.ts`, `App.tsx`, `AchievementsPanel.tsx`, or `combatMath.ts`.

## Scope

Frontend persist/evolution under `src/frontend` (localStorage / sessionStorage /
hydrate `Number()` / config JSON caches / delete cleanup / display-name vs
principal / shrine-covenant-feat / HUD layout / visuals / leaderboard / chat /
one-shot Doka / death markers / BuffShop / GameKey / challenge / dungeon refs).

## Explicitly not re-reported

Everything in the 2026-10-24 ledger and the operator known-list, including:
OLD_SPELL_IDS, catalog ownership, empty-keys spell levels, display-name spell
keys, BuffShop local vs canister, mapsVisited/ground-doka wipe/inherit
(SDEG-2026-10-24-003 / vehicle #490 name-key half), legacy active-spells
overwrite, dual boss-rush config encode, feat/covenant/shrine version-gate,
leaderboard claimed/`Number()`, pieceType vs pixelPattern, killCount 0,
readApplyRewardsOk `Number()`, profile full-replace, dungeon session refs,
challenge badges session-only, WX never `getLevelUpConfig`, etc.

Vehicle **#490** (draft) still owns BuffShop + feat-counter **keying** by II
principal. This run does not restack that.

## NEW findings

### SDEG-2026-10-25-001 — Ground-Doka feat counter advances before credit settle

`WorldExploration.tsx` 11366–11407: after `tryClaimPickupId`, the code
unconditionally increments `groundDokaPickupCountRef` and writes
`${userId}_slotN_pbv_ground_doka_pickups` **before** `resolveOneShotCreditSettle`.
On `settle.kind === "release"` the pickup id is released (11391–11392) so a
retry can remint the wallet path correctly — but the feat counter is **not**
decremented, so each failed credit + retry adds another count toward
`loot_10_doka` → `markAchievementUnlocked` → claimable Doka.

| Cohort | Impact |
| :--- | :--- |
| Yesterday | Flaky network / `#err` on `applyRewards` inflates the counter; 10 “attempts” unlock loot feat without 10 credits |
| 6 months | Same; localStorage counter survives APP_VERSION wipe? **No** (not in versionGate keep-list) — wipe resets; in-session + across reloads until wipe |
| Pre-feature | n/a (counter is client-trusted) |
| Renamed / retired | Feat id `loot_10_doka` still allowlisted |

**Helper-only without WX?** Policy helper yes (`shouldCountGroundDokaPickupForFeat(settle)`); **lock requires WX call-site** (forbidden this stack).

### SDEG-2026-10-25-002 — Overworld `loot_10_doka` only rechecks on mapsVisited delta

`WorldExploration.tsx` 2260–2284: the idle achievement effect checks
`groundDokaPickupCountRef >= 10` **only inside** `if (mapsVisited !== prev.mapsVisited)`.
A `dokaBalance` change (pickup commit) updates `prev.doka` but never evaluates
loot_10. Victory path still passes `groundDokaPickups` into
`clientTrustedVictoryAchievementConditions` (12483–12496). Pure overworld
farming of the 10th coin therefore waits for the next portal (or a battle win).

| Cohort | Impact |
| :--- | :--- |
| Yesterday | Delayed unlock; players who never portal after the 10th coin stay locked until a fight |
| 6 months | Same client gate |
| Pre-feature | n/a |

**Helper-only without WX?** Predicate helper yes; **wiring needs WX** (or a tiny state tick WX already owns).

### SDEG-2026-10-25-003 — Display-name HUD localStorage can poison `saveUserUiLayout`

GameFlow passes `userId = userProfile.id ?? name` (`GameFlow.tsx` 256 / 278).
Candid `UserProfile` has no `id`, so this is the display name.
`DraggablePanel.tsx` 45–68 / 517–519 caches under `pbv_panel_layout_${userId}`;
`saveLayoutToBackend` 80–88 loads that cache and calls `saveUserUiLayout`.
When `getUserUiLayout` returns empty (`if (!blob) return` at 475) or fails
(533–538), the name-keyed cache is kept. Any later drag/fold (552–571) uploads
that cache to the **caller principal**. Two Internet Identities that chose the
same profile name on one browser can therefore copy each other’s HUD blob onto
the canister. Challenge panel (`ChallengePanel.tsx` 26 / 56 / 88–90) is
name-keyed and local-only (no canister) — shared-PC collision only.

Distinct from SDEG-2026-10-24-013 (spell keys) and from profile
`uiLayout:""` full-replace (SDEG-2026-09-29-003).

| Cohort | Impact |
| :--- | :--- |
| Yesterday | Shared browser + duplicate display names + empty/failed uiLayout fetch |
| 6 months | Same; names were never unique-checked |
| Renamed profile | Official UI has no profile rename after setup — collision is cross-principal same name |

**Helper-only without forbidden files?** **Yes.** `DraggablePanel.tsx` /
`GameFlow.tsx` / `ChallengePanel.tsx` are not in the do-not-edit list. Helper:
`resolveUiLayoutStorageKey(principalText)` + refuse backend save from a
name-keyed cache when backend blob was empty/missing this session.

## Surfaces checked — no new issue

| Surface | Notes |
| :--- | :--- |
| GameKey | No localStorage cache; status/redeem from canister |
| Chat messages | Canister `sendMessage` binds profile name; only width/channels in localStorage (`aestralto-chat-*`, device-global prefs) |
| One-shot Doka ids | Memory `Set` + settle keep/release (known remint class) |
| Pending death | Slot marker; known principal-wallet vs slot-marker skew |
| Dungeon chain | Session refs only; canister unused by official UI (known) |
| Challenge badges | Session-only (known) |
| Config JSON caches | tier bigint throw / boss-rush double-encode / palette optional / WX levelup — known |
| Visuals | `pieceType` draw path; `pixelPattern` catalog write — known |
| Leaderboard hydrate | `Number()` + claimed count — known |
| Delete local cleanup | Boss Rush reset only; maps/ground inherit — known 10-24-003 / #490 |

## What this run will not approve

- New required Character / stats / config fields
- Cloning #466 / #490 / #508 / #577 / #622 / #667 / #731 / #778 / #828 / #893 / #1014 helpers
- Editing WX / main.mo / BuffShop / versionGate / deathPenalty / App / AchievementsPanel / combatMath while older persist PRs queue

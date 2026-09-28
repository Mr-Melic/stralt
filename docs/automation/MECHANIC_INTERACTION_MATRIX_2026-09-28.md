# Mechanic Interaction Matrix — 2026-09-28

HEAD: `0f5363f` (unchanged since 09-21…09-27 / #332).

Focus: LIVE challenge recording, achievement unlock vs persist, Death Realm 1.5s remaining actions, reward persist × unpaid death, spell discovery. Read-only.

## New ACTION_IDs

`docs/automation/ACTION_IDS_MIMA_2026-09-28.md` 001–002.

- 001: `jackpot_heal` unlocks on banner before heal persist; rollback leaves Claim
- 002: `upgradeSpell` / `renameCharacter` spend uncut canister Doka without unpaid-death honour

## Focus CLOSED / in-flight (do not re-file)

- Challenge AP / Striker / healUsed / damageTaken paths asked in the focus list: CLOSED except known OPEN skips (09-21-003 Striker AI, 09-02-005 Pacifist summon / #714 kit half, 09-25-001/002 Surge).
- Death Realm Items / Doka heal / Rename / Upgrade / Feats / GameKey: **#595** / **#576** / **#602** / **#604**. Canvas walk **#554**. Shrine/ground/lava **09-27-003**.
- `loot_10_doka` **09-27-004**. `doka_1000` defer. Feat claim unpaid **09-25-004**.
- Spell discovery: no observe path.

Do not re-file 08-31 / 09-01 / 09-02 / 09-21…09-27 or clone the listed open PRs.

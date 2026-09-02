# EOP stable-signature snapshots

`.most` files here are stand-ins for the stable signature of canisters that may
receive an upgrade of `src/backend/main.mo`. This agent environment cannot talk
to the live replica; each file was rebuilt from the git commit named in its
header with moc 1.11.2 exactly as `mops build` does (root `mops.toml`, chain
`--enhanced-migration=src/backend/migrations`), and cross-checked against the
`.old/src/backend/dist/backend.most` that Caffeine itself committed after each of
its own builds (#305 … #354).

## How moc decides whether an upgrade is compatible

The runtime keeps the list of migration names it has applied. On upgrade it
looks up the **latest applied name** in the new program's chain, loads the
stored state as the chain type at that position (no extra, no missing, no
type-changed fields) and runs every later chain file. A latest name that is not
in the chain falls back to the genesis input `{}`, which traps on any populated
canister:

```
RTS error: Memory-incompatible program upgrade      (extra / retyped fields)
stable variable `x` … not found in persisted state  (missing fields)
```

So every name ever recorded on a canister we still want to upgrade must remain
a chain file (a `migration(_ : {}) : {}` no-op is enough), and the cumulative
chain type at that name must equal what that canister actually holds.

## Files

| File | Latest applied | Where it comes from | Upgradable by this chain |
| :--- | :--- | :--- | :--- |
| `../../../../.old/src/backend/dist/backend.most` (tracked) | `20260831_000000` (GameKey on it) | PR #258 build `58302bc` — reconstructed `zh6cg-aaaaa-aaaad-aar2q-cai` | yes (`mops check`) |
| `deployed/pr258-tail-20260831-gamekey.most` | same | same content, kept next to the others | yes |
| `deployed/caffeine-354-tail-20260827.most` | `20260827_000000` | Caffeine build #354 `10d44dd` — `cwofb-yqaaa-aaaap-qp45q-cai` if #354 deployed | yes |
| `deployed/caffeine-348-tail-20260803.most` | `20260803_185500` | Caffeine build #348 `214fc41` — `cwofb…` if #354 never deployed | yes (via the `20260803_185500` no-op) |
| `deployed/pr259-tail-20260901.most` | `20260901_000000` | main between PR #259 and #309 `1d5395a`, fresh install | yes (via the `20260901_000000` no-op) |
| `empty-canister.most` | none | brand-new Caffeine project / first install | yes (whole chain runs) |
| `unsupported/pr177-tail-20260831-no-gamekey.most` | `20260831_000000` (no GameKey) | PR #177 … #256 `036600f` | **no** — same name as the #258 tail but fewer fields. Deploy `origin/main@eb03bdc` (#309: pr177-style 20260831 + 20260901 adds GameKey) first, then this chain. |
| `unsupported/caffeine-340-legacy-no-chain.most` | none, 37 legacy stables | Caffeine build #340 `cfe614b` | **no** — only a chain whose first input is the 37-field legacy actor could adopt it (that is what #347's `20260803_185500` did). |

`mops check-stable <file> backend` is expected to pass for every `deployed/`
file and `empty-canister.most`, and to fail (M0169 / M0263) for `unsupported/`.
`scripts/caffeine-import-gate.sh backend` runs all of them.

## Identifying the state of a live canister

```
dfx canister --network ic metadata <canister-id> motoko:stable-types > deployed.most
```

moc 1.11.2 embeds the full `.most` (chain block + actor signature) as the
`icp:private motoko:stable-types` custom section — verified on our wasm; it is
byte-identical to `src/backend/dist/backend.most`. Being **private**, only a
controller of the canister can read it; a Caffeine-managed canister is
controlled by Caffeine, so ask Caffeine support / use the Caffeine dashboard
export if the command is rejected. (Newer moc versions strip this section under
`--enhanced-migration`; if the answer is empty, fall back to the options below.)

Fallbacks when the metadata is not readable:

- the `.most` of the last build Caffeine reported as deployed (Caffeine commits
  it to `.old/src/backend/dist/backend.most` after its own builds), or
- rebuild the commit you believe is deployed with `mops build` and diff
  `src/backend/dist/backend.most`, or
- `dfx canister --network ic metadata <id> candid:service` (public) and match
  the Candid interface to a commit (`src/backend/dist/backend.did` history).

Then run `mops check-stable <that.most> backend` and, when PocketIC is
available, `node scripts/eop-upgrade-matrix.mjs` for the runtime proof.

## Refreshing after a successful deploy

Copy the deployed program's `.most` (the `src/backend/dist/backend.most` of the
commit Caffeine deployed, built with `mops build`) over
`.old/src/backend/dist/backend.most` and add it under `deployed/` with a header
naming the canister, the commit and the latest applied migration. Never replace
`.old` with a blank `actor { };` again — that is how PRs #177/#259/#309 lost the
real incompatibility.

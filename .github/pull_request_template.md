## Caffeine import gate

Same commands as GitHub → Caffeine import. Do not skip.

- [ ] `pnpm typecheck` and `pnpm check` pass (or `pnpm fix` then `pnpm check`)
- [ ] If Motoko / migrations / `.old` / mocks / `mops.toml` changed: `mops check` or `caffeine check` passes

```bash
bash scripts/caffeine-import-gate.sh all
```

## Oldest-first open PR stack

Still-open PRs merge oldest `createdAt` first. Rebase onto bare `main` is not enough.

- [ ] Older still-open PRs listed (`gh pr list`, `createdAt` ascending); overlapping files **unioned**, not overwritten
- [ ] `bash scripts/open-pr-stack-compat.sh --self` is clean vs `origin/main` and as the next oldest-first queue item


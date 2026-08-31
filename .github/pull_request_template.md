## Caffeine import gate

Same commands as GitHub → Caffeine import. Do not skip.

- [ ] `pnpm typecheck` and `pnpm check` pass (or `pnpm fix` then `pnpm check`)
- [ ] If Motoko / migrations / `.old` / mocks / `mops.toml` changed: `mops check` or `caffeine check` passes

```bash
bash scripts/caffeine-import-gate.sh all
```

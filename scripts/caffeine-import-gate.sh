#!/usr/bin/env bash
# Same commands Caffeine GitHub → import uses.
#   frontend: src/frontend/caffeine.toml [check] = pnpm typecheck && pnpm check
#   backend:  src/backend/caffeine.toml [check] = mops check
# Do not treat unused-vars, hook-deps, mock TS, Motoko syntax, or
# empty-canister stable-compat as "pre-existing, skip".
# Do not run caffeine build / mops build here (PocketIC / dfx).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

usage() {
  echo "usage: $0 [all|frontend|backend] [-- mops-check-args...]" >&2
  exit 2
}

mode="${1:-all}"
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
fi
if [[ $# -gt 0 ]]; then
  shift
fi
if [[ "${1:-}" == "--" ]]; then
  shift
fi

run_frontend() {
  echo "==> pnpm typecheck (Caffeine frontend [check])"
  pnpm typecheck
  echo "==> pnpm check (Biome: unused vars + exhaustive hook deps are errors)"
  pnpm check
}

run_backend() {
  if command -v mops >/dev/null 2>&1; then
    echo "==> mops check (Motoko syntax/types, check-stable vs .old, migrations)"
    mops check "$@"
    return
  fi
  if command -v caffeine >/dev/null 2>&1; then
    if [[ $# -gt 0 ]]; then
      echo "note: caffeine check ignores mops flags ($*); running caffeine check" >&2
    fi
    echo "==> caffeine check (workspace: frontend [check] + backend mops check)"
    caffeine check
    return
  fi
  echo "caffeine-import-gate: mops and caffeine are not on PATH." >&2
  echo "Motoko gate did not run. That is a failure, not a skip." >&2
  echo "Install ic-mops (npm i -g ic-mops) or the Caffeine CLI, then re-run." >&2
  exit 1
}

case "$mode" in
  frontend)
    run_frontend
    ;;
  backend)
    run_backend "$@"
    ;;
  all)
    run_frontend
    run_backend "$@"
    ;;
  *)
    usage
    ;;
esac

#!/usr/bin/env bash
# Same commands Caffeine GitHub → import uses.
#   frontend: src/frontend/caffeine.toml [check] = pnpm typecheck && pnpm check
#   backend:  src/backend/caffeine.toml [check] = mops check
# Do not treat unused-vars, hook-deps, mock TS, Motoko syntax, or
# empty-canister stable-compat as "pre-existing, skip".
# Empty `.old` check-stable is fresh-canister import only. New persistent
# stables also need mops check-stable vs snapshots/post-20260831.most
# (populated Caffeine tail). Do not amend a shipped NewActor.
# Do not run caffeine build / mops build here (PocketIC / dfx).
# Before opening a PR also run: bash scripts/open-pr-stack-compat.sh --self
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

run_populated_stable() {
  local populated="${ROOT}/src/backend/migrations/snapshots/post-20260831.most"
  local stable_args=()
  local a
  for a in "$@"; do
    if [[ "$a" != "--no-lint" ]]; then
      stable_args+=("$a")
    fi
  done
  if [[ ! -f "$populated" ]]; then
    echo "caffeine-import-gate: missing populated EOP snapshot: $populated" >&2
    echo "Empty .old check is not a populated Caffeine upgrade." >&2
    exit 1
  fi
  echo "==> mops check-stable vs populated post-20260831 (Caffeine live layout, not empty .old)"
  mops check-stable "$populated" backend "${stable_args[@]}"
}

run_backend() {
  if command -v mops >/dev/null 2>&1; then
    echo "==> mops check (Motoko syntax/types, check-stable vs empty .old, migrations)"
    mops check "$@"
    run_populated_stable "$@"
    return
  fi
  if command -v caffeine >/dev/null 2>&1; then
    if [[ $# -gt 0 ]]; then
      echo "note: caffeine check ignores mops flags ($*); running caffeine check" >&2
    fi
    echo "==> caffeine check (workspace: frontend [check] + backend mops check)"
    caffeine check
    echo "note: caffeine-only path skipped populated EOP check-stable (needs mops)." >&2
    echo "note: empty-canister check is not a populated Caffeine upgrade." >&2
    echo "note: install ic-mops and re-run: mops check-stable src/backend/migrations/snapshots/post-20260831.most backend" >&2
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

#!/usr/bin/env bash
# Same commands Caffeine GitHub → import uses.
#   frontend: src/frontend/caffeine.toml [check] = pnpm typecheck && pnpm check
#              [build] = pnpm build (vite/esbuild — this is what failed on
#              duplicate export shouldFloatWorldUnreachable)
#   backend:  src/backend/caffeine.toml [check] = mops check
# Do not treat unused-vars, hook-deps, mock TS, Motoko syntax, or
# empty-canister stable-compat as "pre-existing, skip".
# Empty `.old` check-stable is fresh-canister import only. New persistent
# stables also need mops check-stable vs snapshots/post-20260831.most
# (20260901 never applied) AND post-20260901.most (20260901 applied).
# Do not amend a shipped NewActor. python3 scripts/check-eop-stables.py
# refuses new main.mo stables without a later chain file.
# Do not run caffeine build / mops build here (PocketIC / dfx).
# Before opening a PR also run: bash scripts/open-pr-stack-compat.sh --self
# Stack-compat "union" means keep one export implementation, not concatenate
# two `export function` copies of the same helper.
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

stable_args_without_no_lint() {
  local a
  for a in "$@"; do
    if [[ "$a" != "--no-lint" ]]; then
      printf '%s\n' "$a"
    fi
  done
}

run_frontend() {
  echo "==> duplicate export implementations (restack union ≠ concatenate)"
  python3 "$ROOT/scripts/check-duplicate-exports.py" --self-test
  python3 "$ROOT/scripts/check-duplicate-exports.py" src/frontend/src
  echo "==> pnpm typecheck (Caffeine frontend [check]; TS2393 redeclare)"
  pnpm typecheck
  echo "==> pnpm check (Biome: unused vars, hook deps, noRedeclare are errors)"
  pnpm check
  echo "==> pnpm --dir src/frontend build (Caffeine frontend [build] / vite esbuild)"
  pnpm --dir src/frontend build
}

run_one_populated_stable() {
  local populated="$1"
  shift
  local -a stable_args=("$@")
  if [[ ! -f "$populated" ]]; then
    echo "caffeine-import-gate: missing populated EOP snapshot: $populated" >&2
    echo "Empty .old check is not a populated Caffeine upgrade." >&2
    exit 1
  fi
  echo "==> mops check-stable vs ${populated#"$ROOT"/} (populated Caffeine, not empty .old)"
  mops check-stable "$populated" backend "${stable_args[@]}"
}

run_populated_stable() {
  local -a stable_args=()
  local a
  while IFS= read -r a; do
    [[ -n "$a" ]] && stable_args+=("$a")
  done < <(stable_args_without_no_lint "$@")
  run_one_populated_stable \
    "${ROOT}/src/backend/migrations/snapshots/post-20260831.most" \
    "${stable_args[@]}"
  run_one_populated_stable \
    "${ROOT}/src/backend/migrations/snapshots/post-20260901.most" \
    "${stable_args[@]}"
}

run_backend() {
  echo "==> EOP stables vs latest NewActor / frozen NewActor / check-limit"
  python3 "$ROOT/scripts/check-eop-stables.py"
  if command -v mops >/dev/null 2>&1; then
    echo "==> mops check (Motoko syntax/types, check-stable vs empty .old, migrations)"
    mops check "$@"
    echo "==> mops check --no-lint --no-check-limit (full chain, empty-canister genesis kept)"
    mops check --no-lint --no-check-limit "$@"
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
    echo "note: install ic-mops and re-run:" >&2
    echo "  mops check-stable src/backend/migrations/snapshots/post-20260831.most backend" >&2
    echo "  mops check-stable src/backend/migrations/snapshots/post-20260901.most backend" >&2
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

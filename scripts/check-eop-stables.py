#!/usr/bin/env python3
"""Fail if new persistent main.mo stables ship without a later migration.

Caffeine `install_code` onto a populated canister traps

  RTS error: Memory-incompatible program upgrade / IC0503

when a persistent `let`/`var` is stuffed into an already-applied migration
`NewActor` (GameKey maps on frozen `20260831` after that tail had run).

Rules this script enforces:

1. Actor-level `let`/`var` on `src/backend/main.mo` (not `transient`) must be
   either on the latest chain `NewActor` or in the frozen orthogonal allowlist.
   New names cannot be added to the allowlist; they need a later `NewActor`.
2. `NewActor` field sets for files at or before `FROZEN_THROUGH` must match
   `src/backend/migrations/snapshots/frozen-newactor-fields.json`.
3. `mops.toml` `check-limit` must be >= the number of chain files (dropping
   `20260826` with `OldActor = {}` breaks empty-canister import / M0263).
4. `20260826` `OldActor` must stay `{}`.
5. If the latest `NewActor` introduces fields vs the previous file, a populated
   snapshot `snapshots/post-<previous>.most` must exist. `post-20260831.most`
   is the live Caffeine tail (GameKey never applied). `post-20260901.most` is
   the same layout after 20260901 applied — stuffing into 20260901 must fail
   that check-stable in the gate, and this script forbids editing that NewActor.

Does not talk to the replica. Does not require PocketIC / dfx.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAIN = ROOT / "src/backend/main.mo"
MIGRATIONS = ROOT / "src/backend/migrations"
SNAPSHOTS = MIGRATIONS / "snapshots"
MOPS = ROOT / "mops.toml"
ORTHOGONAL = SNAPSHOTS / "orthogonal-stables.txt"
FROZEN_JSON = SNAPSHOTS / "frozen-newactor-fields.json"
FROZEN_THROUGH = "20260901_000000"
REQUIRED_POPULATED = (
    "post-20260831.most",  # first failed deploy / 20260901 never applied
    "post-20260901.most",  # 20260901 applied; further stables need 20260902+
)

ACTOR_FIELD = re.compile(r"^    (let|var) ([A-Za-z_][A-Za-z0-9_]*)\b")
TYPE_NEW = re.compile(r"\btype NewActor\s*=")
TYPE_OLD = re.compile(r"\btype OldActor\s*=")
CHECK_LIMIT = re.compile(
    r"\[canisters\.backend\.migrations\][\s\S]*?check-limit\s*=\s*(\d+)",
    re.M,
)
CHAIN_FILE = re.compile(r"^(\d{8}_\d{6})\.mo$")


def _matching_brace_block(src: str, open_at: int) -> str:
    if open_at < 0 or open_at >= len(src) or src[open_at] != "{":
        raise ValueError("expected '{'")
    depth = 0
    i = open_at
    while i < len(src):
        ch = src[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return src[open_at : i + 1]
        i += 1
    raise ValueError("unbalanced braces")


def _type_block(src: str, header: re.Pattern[str]) -> str | None:
    m = header.search(src)
    if not m:
        return None
    brace = src.find("{", m.end())
    if brace < 0:
        return None
    return _matching_brace_block(src, brace)


def _fields_from_actor_type(block: str) -> list[str]:
    """Field names in `type NewActor = { … }` / `type OldActor = { … }`."""
    names: list[str] = []
    depth = 0
    for raw in block.splitlines():
        line = raw.strip()
        if not line or line.startswith("//"):
            continue
        if depth == 1:
            m = re.match(r"^(?:var\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*:", line)
            if m:
                names.append(m.group(1))
        depth += line.count("{") - line.count("}")
    seen: set[str] = set()
    out: list[str] = []
    for n in names:
        if n in seen:
            continue
        seen.add(n)
        out.append(n)
    return out


def extract_new_actor_fields(src: str) -> list[str]:
    block = _type_block(src, TYPE_NEW)
    if block is None:
        raise ValueError("no type NewActor")
    return _fields_from_actor_type(block)


def extract_old_actor_fields(src: str) -> list[str]:
    block = _type_block(src, TYPE_OLD)
    if block is None:
        raise ValueError("no type OldActor")
    inner = block.strip()
    if inner in {"{}", "{ }"}:
        return []
    return _fields_from_actor_type(block)


def extract_main_stables(src: str) -> list[str]:
    names: list[str] = []
    for line in src.splitlines():
        if re.match(r"^    transient (let|var)\b", line):
            continue
        m = ACTOR_FIELD.match(line)
        if not m:
            continue
        names.append(m.group(2))
    return names


def chain_files() -> list[Path]:
    files = []
    for p in sorted(MIGRATIONS.glob("*.mo")):
        if CHAIN_FILE.match(p.name):
            files.append(p)
    return files


def load_orthogonal() -> set[str]:
    if not ORTHOGONAL.is_file():
        raise SystemExit(f"missing {ORTHOGONAL}")
    names: set[str] = set()
    for line in ORTHOGONAL.read_text(encoding="utf-8").splitlines():
        t = line.strip()
        if not t or t.startswith("#"):
            continue
        names.add(t)
    return names


def load_frozen() -> dict[str, list[str]]:
    if not FROZEN_JSON.is_file():
        raise SystemExit(f"missing {FROZEN_JSON}")
    data = json.loads(FROZEN_JSON.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise SystemExit(f"{FROZEN_JSON} must be an object")
    return {k: list(v) for k, v in data.items()}


def parse_check_limit() -> int:
    text = MOPS.read_text(encoding="utf-8")
    m = CHECK_LIMIT.search(text)
    if not m:
        raise SystemExit("mops.toml: missing [canisters.backend.migrations] check-limit")
    return int(m.group(1))


def stem(path: Path) -> str:
    return path.stem  # 20260901_000000


def date_prefix(st: str) -> str:
    """20260901_000000 → 20260901 (snapshot filenames omit _HHMMSS)."""
    return st.split("_", 1)[0]


def write_manifests() -> None:
    SNAPSHOTS.mkdir(parents=True, exist_ok=True)
    main_fields = extract_main_stables(MAIN.read_text(encoding="utf-8"))
    files = chain_files()
    frozen: dict[str, list[str]] = {}
    latest_new: list[str] = []
    for p in files:
        src = p.read_text(encoding="utf-8")
        fields = extract_new_actor_fields(src)
        if stem(p) <= FROZEN_THROUGH:
            frozen[stem(p)] = fields
        latest_new = fields
    latest_set = set(latest_new)
    ortho = [n for n in main_fields if n not in latest_set]
    ORTHOGONAL.write_text(
        "# Actor-level stables on main.mo that persist orthogonally (not listed\n"
        "# on the latest NewActor). Frozen at 20260901. Do not add names here.\n"
        "# New persistent let/var must appear on a later NewActor instead.\n"
        + "\n".join(ortho)
        + "\n",
        encoding="utf-8",
    )
    FROZEN_JSON.write_text(
        json.dumps(frozen, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {ORTHOGONAL} ({len(ortho)} names)")
    print(f"wrote {FROZEN_JSON} ({len(frozen)} files)")


def check() -> int:
    errors: list[str] = []
    files = chain_files()
    if not files:
        errors.append(f"no migration files in {MIGRATIONS}")
        _print(errors)
        return 1

    genesis = files[0]
    if stem(genesis) != "20260826_000000":
        errors.append(
            f"empty-canister genesis must stay first in lex order "
            f"(got {genesis.name}, expected 20260826_000000.mo)"
        )
    genesis_src = genesis.read_text(encoding="utf-8")
    try:
        old_fields = extract_old_actor_fields(genesis_src)
    except ValueError as exc:
        errors.append(f"{genesis.name}: {exc}")
        old_fields = ["<parse-error>"]
    if old_fields:
        errors.append(
            f"{genesis.name} OldActor must be {{}} for empty-canister import "
            f"(M0263); found {old_fields}"
        )

    limit = parse_check_limit()
    if limit < len(files):
        errors.append(
            f"mops.toml check-limit={limit} < chain length {len(files)}. "
            "Bumping is required so 20260826 (OldActor = {}) is not dropped."
        )

    frozen_expected = load_frozen()
    orthogonal = load_orthogonal()
    new_by_stem: dict[str, list[str]] = {}
    for p in files:
        src = p.read_text(encoding="utf-8")
        try:
            fields = extract_new_actor_fields(src)
        except ValueError as exc:
            errors.append(f"{p.name}: {exc}")
            continue
        new_by_stem[stem(p)] = fields
        if stem(p) <= FROZEN_THROUGH:
            expected = frozen_expected.get(stem(p))
            if expected is None:
                errors.append(
                    f"{p.name}: frozen through {FROZEN_THROUGH} but missing from "
                    f"{FROZEN_JSON.name}. Do not invent a NewActor rewrite; "
                    "copy the extracted field list only when bootstrapping."
                )
            elif list(expected) != fields:
                errors.append(
                    f"{p.name}: frozen NewActor fields changed. "
                    "Do not amend a shipped NewActor (IC0503). "
                    f"expected {expected}; found {fields}. "
                    "Add a later YYYYMMDD_*.mo instead."
                )

    latest = files[-1]
    latest_fields = new_by_stem.get(stem(latest), [])
    latest_set = set(latest_fields)
    main_src = MAIN.read_text(encoding="utf-8")
    main_fields = extract_main_stables(main_src)
    main_set = set(main_fields)

    extras = [n for n in main_fields if n not in latest_set]
    extra_set = set(extras)
    sneaked = sorted(extra_set - orthogonal)
    deleted = sorted(orthogonal - extra_set)
    if sneaked:
        errors.append(
            "new persistent main.mo stables not on latest NewActor and not in "
            f"frozen orthogonal allowlist: {sneaked}. Add a later migration "
            f"(OldActor = {stem(latest)} NewActor; NewActor = +these fields). "
            f"Do not edit {FROZEN_THROUGH} or earlier NewActor. "
            "Do not append names to orthogonal-stables.txt."
        )
    if deleted:
        errors.append(
            "do not delete live orthogonal stables from main.mo to force an "
            f"upgrade match: {deleted}"
        )

    missing_on_main = sorted(latest_set - main_set)
    if missing_on_main:
        errors.append(
            f"latest NewActor fields missing from main.mo: {missing_on_main}"
        )

    if len(files) >= 2:
        prev = files[-2]
        prev_set = set(new_by_stem.get(stem(prev), []))
        introduced = [n for n in latest_fields if n not in prev_set]
        if introduced:
            snap = SNAPSHOTS / f"post-{date_prefix(stem(prev))}.most"
            if not snap.is_file():
                errors.append(
                    f"latest migration {latest.name} introduces {introduced} "
                    f"but missing populated snapshot {snap}. "
                    "Empty .old is not a populated Caffeine upgrade."
                )

    for name in REQUIRED_POPULATED:
        path = SNAPSHOTS / name
        if not path.is_file():
            errors.append(
                f"missing populated EOP snapshot {path}. "
                "Need both post-20260831 (20260901 never applied) and "
                "post-20260901 (20260901 applied) so later stables cannot ship "
                "by stuffing a frozen NewActor."
            )

    if "gameKeyRequests" not in latest_set:
        errors.append(
            "latest NewActor is missing gameKeyRequests; populated Caffeine "
            "upgrade of a post-20260831 canister would still IC0503 or drop GameKey."
        )

    _print(errors)
    return 1 if errors else 0


def _print(errors: list[str]) -> None:
    if errors:
        print("check-eop-stables: FAILED", file=sys.stderr)
        for e in errors:
            print(f"  {e}", file=sys.stderr)
        return
    print("check-eop-stables: clean")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--write-manifests",
        action="store_true",
        help="rewrite orthogonal-stables.txt and frozen-newactor-fields.json from current sources (bootstrap only)",
    )
    args = parser.parse_args()
    if args.write_manifests:
        write_manifests()
        return 0
    return check()


if __name__ == "__main__":
    sys.exit(main())

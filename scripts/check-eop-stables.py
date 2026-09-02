#!/usr/bin/env python3
"""Fail if the EOP migration chain can no longer upgrade the deployed canisters.

How moc's enhanced migration chain is resolved at upgrade time (moc 1.11,
src/lowering/desugar.ml `rts_was_migration_performed`): the runtime keeps a
list of applied migration names and looks up the *latest applied name* in the
new program's chain. The stored state is then loaded as the chain type at that
position (no extra fields, no missing fields, compatible types) and every later
chain file runs. A latest name that is missing from the chain falls back to the
genesis input `{}`, which traps on any populated canister with

  RTS error: Memory-incompatible program upgrade / IC0503

Three deploys of this project trapped that way (PR #258 → #259 → #309); the
reconstruction and PocketIC proof are in docs/automation/CAFFEINE_IMPORT_GATES.md.

Rules this script enforces (no replica, no PocketIC, no dfx):

1. The genesis file is `20260801_000000.mo` with `OldActor = {}` so a fresh
   canister installs, and it sorts before every recorded Caffeine name.
2. `NewActor` field sets for every file at or before `FROZEN_THROUGH` match
   `snapshots/frozen-newactor-fields.json`. Name-only files (`20260803_185500`,
   `20260901_000000`) stay `migration(_ : {}) : {}`.
3. Actor-level `let`/`var` on `src/backend/main.mo` (not `transient`) must be
   on the latest field-introducing `NewActor` or in the frozen orthogonal
   allowlist. New names need a NEW later chain file (never edit a frozen one).
4. `mops.toml` `check-limit` >= number of chain files.
5. `.old/src/backend/dist/backend.most` and every
   `snapshots/deployed/*.most` must be Version 4.0.0 signatures whose latest
   applied migration name is a chain file. A blank `actor { };` baseline is
   rejected (that is what hid the real incompatibility). `snapshots/empty-canister.most`
   must exist for the fresh-import check.
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
DEPLOYED = SNAPSHOTS / "deployed"
MOPS = ROOT / "mops.toml"
OLD_BASELINE = ROOT / ".old/src/backend/dist/backend.most"
EMPTY_SNAPSHOT = SNAPSHOTS / "empty-canister.most"
ORTHOGONAL = SNAPSHOTS / "orthogonal-stables.txt"
FROZEN_JSON = SNAPSHOTS / "frozen-newactor-fields.json"
GENESIS = "20260801_000000"
FROZEN_THROUGH = "20260901_000000"
# Names recorded on real Caffeine canisters. Each must stay a chain file.
DEPLOYED_TAILS = {
    "20260803_185500": "cwofb-yqaaa-aaaap-qp45q-cai at Caffeine build #347/#348",
    "20260827_000000": "cwofb-yqaaa-aaaap-qp45q-cai at Caffeine build #354",
    "20260831_000000": "zh6cg-aaaaa-aaaad-aar2q-cai (PR #258 fresh install, GameKey on this tail)",
    "20260901_000000": "any canister created from main between PR #259 and #309",
}
REQUIRED_DEPLOYED_SNAPSHOTS = (
    "caffeine-348-tail-20260803.most",
    "caffeine-354-tail-20260827.most",
    "pr258-tail-20260831-gamekey.most",
    "pr259-tail-20260901.most",
)

ACTOR_FIELD = re.compile(r"^    (let|var) ([A-Za-z_][A-Za-z0-9_]*)\b")
TYPE_NEW = re.compile(r"\btype NewActor\s*=")
TYPE_OLD = re.compile(r"\btype OldActor\s*=")
NOOP_MIGRATION = re.compile(
    r"public\s+func\s+migration\s*\(\s*_\s*:\s*\{\s*\}\s*\)\s*:\s*\{\s*\}\s*\{\s*\{\s*\}\s*;?\s*\}\s*;?",
    re.S,
)
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


def is_noop_migration(src: str) -> bool:
    return NOOP_MIGRATION.search(src) is not None and not TYPE_NEW.search(src)


def extract_new_actor_fields(src: str) -> list[str]:
    if is_noop_migration(src):
        return []
    block = _type_block(src, TYPE_NEW)
    if block is None:
        raise ValueError("no type NewActor (and not a `migration(_ : {}) : {}` no-op)")
    return _fields_from_actor_type(block)


def extract_old_actor_fields(src: str) -> list[str]:
    if is_noop_migration(src):
        return []
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


def most_applied_names(content: str) -> list[str] | None:
    """Migration names recorded in a Version 4.0.0 `.most` chain block.

    Mirrors ic-mops `parseMostAppliedMigrationNames`. Returns [] for a
    Version 1.0.0 signature (no chain), None if the file is not a `.most`.
    """
    m = re.search(r"^// Version: ([^\n]+)", content, re.M)
    if not m:
        return None
    if m.group(1).strip() != "4.0.0":
        return []
    actor_idx = re.search(r"\nactor\b", content)
    if actor_idx is None:
        return None
    block = content[: actor_idx.start()]
    return re.findall(r'[{;]\s*"([^"]+)"\s*:', block)


def most_stable_names(content: str) -> list[str]:
    actor_idx = re.search(r"\nactor\b", content)
    if actor_idx is None:
        return []
    body = content[actor_idx.start() :]
    return re.findall(r"^\s+stable (?:var )?([A-Za-z_][A-Za-z0-9_]*)\s*:", body, re.M)


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
    return path.stem  # 20260831_000000


def latest_introducing(files: list[Path], new_by_stem: dict[str, list[str]]) -> Path | None:
    """Last chain file whose NewActor lists fields (skips name-only no-ops)."""
    for p in reversed(files):
        if new_by_stem.get(stem(p)):
            return p
    return None


def write_manifests() -> None:
    SNAPSHOTS.mkdir(parents=True, exist_ok=True)
    main_fields = extract_main_stables(MAIN.read_text(encoding="utf-8"))
    files = chain_files()
    frozen: dict[str, list[str]] = {}
    new_by_stem: dict[str, list[str]] = {}
    for p in files:
        fields = extract_new_actor_fields(p.read_text(encoding="utf-8"))
        new_by_stem[stem(p)] = fields
        if stem(p) <= FROZEN_THROUGH:
            frozen[stem(p)] = fields
    latest = latest_introducing(files, new_by_stem)
    latest_set = set(new_by_stem.get(stem(latest), [])) if latest else set()
    ortho = [n for n in main_fields if n not in latest_set]
    ORTHOGONAL.write_text(
        "# Actor-level stables on main.mo that persist orthogonally (not listed\n"
        "# on the latest field-introducing NewActor, 20260831_000000). Frozen.\n"
        "# Do not add names here. New persistent let/var must appear on a later\n"
        "# NewActor instead.\n"
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


def check_baseline(path: Path, chain_stems: set[str], errors: list[str], *, label: str) -> None:
    if not path.is_file():
        errors.append(f"missing {label}: {path}")
        return
    content = path.read_text(encoding="utf-8")
    applied = most_applied_names(content)
    if applied is None:
        errors.append(f"{label} {path} is not a moc .most signature")
        return
    if not applied:
        errors.append(
            f"{label} {path} has no migration chain block (blank `actor {{ }};` or "
            "Version 1.0.0). It must be the signature actually deployed "
            "(`dfx canister metadata <id> motoko:stable-types` or the last "
            "successful `mops build` .most), not an empty placeholder."
        )
        return
    latest = max(applied)
    if latest not in chain_stems:
        errors.append(
            f"{label} {path}: latest applied migration `{latest}` is not a chain "
            f"file. moc falls back to the genesis input `{{}}` for an unknown "
            "name and traps with `RTS error: Memory-incompatible program upgrade` "
            "on a populated canister. Keep a (no-op) file with that name."
        )


def check() -> int:
    errors: list[str] = []
    files = chain_files()
    if not files:
        errors.append(f"no migration files in {MIGRATIONS}")
        _print(errors)
        return 1
    chain_stems = {stem(p) for p in files}

    genesis = files[0]
    if stem(genesis) != GENESIS:
        errors.append(
            f"empty-canister genesis must stay first in lex order and sort before "
            f"every recorded Caffeine name (got {genesis.name}, expected {GENESIS}.mo)"
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

    for name, where in DEPLOYED_TAILS.items():
        if name not in chain_stems:
            errors.append(
                f"chain file {name}.mo is missing but that name is the latest "
                f"applied migration on {where}. Deleting or renaming it makes moc "
                "fall back to the genesis input and trap (IC0503)."
            )

    limit = parse_check_limit()
    if limit < len(files):
        errors.append(
            f"mops.toml check-limit={limit} < chain length {len(files)}. "
            f"Bump it so {GENESIS} (OldActor = {{}}) is not dropped."
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
            if expected == [] and not is_noop_migration(src):
                errors.append(
                    f"{p.name}: must stay a name-only `migration(_ : {{}}) : {{}}` no-op."
                )

    latest = latest_introducing(files, new_by_stem)
    latest_fields = new_by_stem.get(stem(latest), []) if latest else []
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
            "new persistent main.mo stables not on the latest field-introducing "
            f"NewActor ({stem(latest) if latest else '?'}) and not in the frozen "
            f"orthogonal allowlist: {sneaked}. Add a NEW later migration file "
            "(input {} or the fields you transform; NewActor = the new fields) and "
            f"bump mops.toml check-limit. Do not edit {FROZEN_THROUGH} or earlier. "
            "Do not append to orthogonal-stables.txt."
        )
    if deleted:
        errors.append(
            f"orthogonal stables removed from main.mo without a consuming migration: {deleted}. "
            "Dropping a stable requires a later migration that lists it as input only."
        )

    missing_on_main = sorted(latest_set - main_set)
    if missing_on_main:
        errors.append(
            f"latest NewActor fields missing from main.mo: {missing_on_main}"
        )

    if "gameKeyRequests" not in latest_set:
        errors.append(
            "latest field-introducing NewActor is missing gameKeyRequests; the "
            "deployed 20260831 tail carries GameKey (PR #258 build)."
        )

    check_baseline(OLD_BASELINE, chain_stems, errors, label="check-stable baseline")
    for name in REQUIRED_DEPLOYED_SNAPSHOTS:
        check_baseline(DEPLOYED / name, chain_stems, errors, label="deployed snapshot")
    for p in sorted(DEPLOYED.glob("*.most")) if DEPLOYED.is_dir() else []:
        if p.name not in REQUIRED_DEPLOYED_SNAPSHOTS:
            check_baseline(p, chain_stems, errors, label="deployed snapshot")
    if not EMPTY_SNAPSHOT.is_file():
        errors.append(f"missing {EMPTY_SNAPSHOT} (fresh-import check-stable baseline)")

    old_content = OLD_BASELINE.read_text(encoding="utf-8") if OLD_BASELINE.is_file() else ""
    old_names = set(most_stable_names(old_content))
    if old_names and old_names != main_set:
        introduced_after_tail = sorted(main_set - old_names)
        gone = sorted(old_names - main_set)
        if introduced_after_tail:
            latest_applied = max(most_applied_names(old_content) or [""])
            later = [p.name for p in files if stem(p) > latest_applied]
            if not later:
                errors.append(
                    f"main.mo has stables {introduced_after_tail} that the deployed "
                    f"baseline lacks, but no chain file sorts after the deployed tail "
                    f"`{latest_applied}` to introduce them (runtime trap: 'not found "
                    "in persisted state')."
                )
        if gone:
            errors.append(
                f"deployed baseline has stables {gone} that main.mo no longer declares; "
                "a later migration must consume them or the upgrade traps."
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

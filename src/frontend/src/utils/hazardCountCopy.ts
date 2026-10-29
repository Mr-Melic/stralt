/**
 * Map-entry hazard announce chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-HAZARD-COUNT-DETECTED (reported 2026-10-28, helper locked this run):
 * `⚠️ N hazard tile(s) detected on this map!` then a separate modifier-name
 * line. “Detected” is engineer. Tiles stay unnamed until the player steps
 * (UX-HAZARD-TILE-LEGEND). Distinct from that ID.
 */

function titleKind(raw: string): string {
  const kind = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (kind === "lava") return "lava";
  if (kind === "ice") return "ice";
  if (kind === "spikes") return "spikes";
  return "";
}

/** Unique lava / ice / spikes names, in that order. */
export function hazardKindList(kinds: Iterable<string>): string[] {
  const seen = new Set<string>();
  for (const raw of kinds) {
    const named = titleKind(raw);
    if (named) seen.add(named);
  }
  const order = ["lava", "ice", "spikes"];
  return order.filter((k) => seen.has(k));
}

export function hazardCountLog(kinds: Iterable<string>): string {
  const named = hazardKindList(kinds);
  if (named.length === 0) {
    return "This map has hazards — watch the tiles.";
  }
  if (named.length === 1) {
    return `This map has ${named[0]}. Watch your step.`;
  }
  if (named.length === 2) {
    return `This map has ${named[0]} and ${named[1]}.`;
  }
  return `This map has ${named[0]}, ${named[1]}, and ${named[2]}.`;
}

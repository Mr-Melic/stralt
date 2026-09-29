/**
 * Owner list sort + facet helpers.
 *
 * Per-list substring search already ships. Sort by name/id/level and
 * Active/Inactive facets are still missing from AdminDashboard (stack).
 */

export type OwnerListSortKey = "name" | "id" | "levelMin";
export type OwnerListSortDir = "asc" | "desc";
export type OwnerActiveFacet = "all" | "active" | "inactive";

export function matchesOwnerQuery(
  query: string,
  ...parts: Array<string | undefined>
): boolean {
  const n = query.trim().toLowerCase();
  if (!n) return true;
  return parts.some((p) => (p ?? "").toLowerCase().includes(n));
}

function comparableText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function comparableLevel(value: bigint | number | undefined): number {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return 0;
}

export function sortOwnerListRows<
  T extends {
    id: string;
    name?: string;
    levelMin?: bigint | number;
  },
>(
  rows: readonly T[],
  sort: { key: OwnerListSortKey; dir: OwnerListSortDir },
): T[] {
  const dir = sort.dir === "desc" ? -1 : 1;
  return [...rows].sort((a, b) => {
    let cmp = 0;
    if (sort.key === "levelMin") {
      cmp = comparableLevel(a.levelMin) - comparableLevel(b.levelMin);
    } else if (sort.key === "id") {
      cmp = comparableText(a.id).localeCompare(comparableText(b.id));
    } else {
      cmp = comparableText(a.name || a.id).localeCompare(
        comparableText(b.name || b.id),
      );
    }
    if (cmp === 0) {
      cmp = comparableText(a.id).localeCompare(comparableText(b.id));
    }
    return cmp * dir;
  });
}

export function facetOwnerListRows<T>(
  rows: readonly T[],
  args: {
    facet: OwnerActiveFacet;
    isActive: (row: T) => boolean;
  },
): T[] {
  if (args.facet === "all") return [...rows];
  const wantActive = args.facet === "active";
  return rows.filter((row) => args.isActive(row) === wantActive);
}

/**
 * Owner Health / audit-log helpers.
 *
 * `getAdminAuditLog` exists on the actor; AdminDashboard never calls it.
 * Empty `#ok` is a valid default (no writes yet) — never an error.
 * Not wired into a Health tab (stack + HUMAN_APPROVAL_REQUIRED).
 */

export type OwnerAuditRow = {
  adminPrincipal: string;
  action: string;
  objectId: string;
  previousSummary: string;
  newSummary: string;
  timestampNs: bigint;
  atMs: number;
};

export type OwnerAuditRead =
  | { ok: OwnerAuditRow[]; err?: undefined }
  | { err: string; ok?: undefined };

function textOf(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return String(value);
}

function nsToMs(raw: unknown): number {
  const n =
    typeof raw === "bigint"
      ? Number(raw)
      : typeof raw === "number"
        ? raw
        : Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n > 1e15 ? Math.floor(n / 1_000_000) : Math.floor(n);
}

function asNs(raw: unknown): bigint {
  if (typeof raw === "bigint") return raw;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return BigInt(Math.trunc(raw));
  }
  if (typeof raw === "string" && raw.trim().length > 0) {
    try {
      return BigInt(raw);
    } catch {
      return 0n;
    }
  }
  return 0n;
}

function mapEntry(raw: unknown): OwnerAuditRow {
  const r = (raw ?? {}) as Record<string, unknown>;
  const timestampNs = asNs(r.timestampNs ?? r.timestamp);
  return {
    adminPrincipal: textOf(r.adminPrincipal),
    action: textOf(r.action),
    objectId: textOf(r.objectId),
    previousSummary: textOf(r.previousSummary),
    newSummary: textOf(r.newSummary),
    timestampNs,
    atMs: nsToMs(timestampNs),
  };
}

export function readOwnerAuditLog(result: unknown): OwnerAuditRead {
  if (Array.isArray(result)) {
    return { ok: result.map(mapEntry) };
  }
  if (result == null || typeof result !== "object") {
    return { err: "getAdminAuditLog returned an empty result" };
  }
  const r = result as Record<string, unknown>;
  if (
    r.__kind__ === "err" ||
    (r.err != null && r.ok == null && r._ok == null)
  ) {
    return { err: String(r.err ?? r._err ?? "getAdminAuditLog failed") };
  }
  const ok = r.ok ?? r._ok;
  if (!Array.isArray(ok)) {
    return { err: "getAdminAuditLog missing ok payload" };
  }
  return { ok: ok.map(mapEntry) };
}

export function sortOwnerAuditNewestFirst(
  rows: readonly OwnerAuditRow[],
): OwnerAuditRow[] {
  return [...rows].sort((a, b) => {
    if (a.timestampNs === b.timestampNs) return 0;
    return a.timestampNs > b.timestampNs ? -1 : 1;
  });
}

/** Empty log is a valid default — never surface it as VALIDATION FAILED. */
export function ownerAuditEmptyCopy(count: number): string {
  if (count <= 0) return "No admin writes recorded — valid default.";
  return `${count} recorded admin write${count === 1 ? "" : "s"}`;
}

export function ownerAuditChangeSummary(row: OwnerAuditRow): string {
  const objectId = row.objectId.trim() || "—";
  const prev = row.previousSummary.trim() || "(empty)";
  const next = row.newSummary.trim() || "(empty)";
  return `${row.action || "write"} ${objectId}: ${prev} → ${next}`;
}

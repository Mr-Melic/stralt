/**
 * Owner editor chrome helpers (breadcrumbs, close-after-save, validation
 * summary, proposed nav groups). Not wired into AdminDashboard (stack).
 *
 * Live groups list only the 15 tabs that exist today. Overview / Health
 * stay proposed — do not add empty Challenges / AI / Formations tabs.
 */

export type OwnerLiveTab =
  | "enemies"
  | "regions"
  | "sprites"
  | "spells"
  | "modifiers"
  | "tiers"
  | "visuals"
  | "settings"
  | "purchases"
  | "achievements"
  | "names"
  | "bosses"
  | "ads"
  | "shop"
  | "bossRush";

export type OwnerNavGroup = {
  id: string;
  label: string;
  tabs: readonly OwnerLiveTab[];
};

export const OWNER_LIVE_NAV_GROUPS: readonly OwnerNavGroup[] = [
  {
    id: "content",
    label: "Content",
    tabs: ["enemies", "bosses", "spells", "achievements", "names"],
  },
  {
    id: "world",
    label: "World",
    tabs: ["regions", "tiers", "modifiers"],
  },
  {
    id: "presentation",
    label: "Presentation",
    tabs: ["sprites", "visuals", "ads"],
  },
  {
    id: "economy",
    label: "Economy / Ops",
    tabs: ["shop", "purchases", "bossRush"],
  },
  {
    id: "system",
    label: "System",
    tabs: ["settings"],
  },
];

export const OWNER_PROPOSED_DOMAINS = [
  {
    id: "overview",
    label: "Overview",
    reason: "No home tab. Default is still Enemies.",
  },
  {
    id: "health",
    label: "Health / Audit",
    reason: "getAdminAuditLog and five rollback writers have no owner view.",
  },
] as const;

export function ownerEditorBreadcrumb(args: {
  tabLabel: string;
  entityName?: string | null;
  isNew?: boolean;
}): { trail: string[]; label: string } {
  const tab = args.tabLabel.trim() || "Catalog";
  const name =
    args.isNew === true ? "New" : (args.entityName ?? "").trim() || "Untitled";
  const trail = [tab, name];
  return { trail, label: trail.join(" / ") };
}

export function shouldClearOwnerEditorAfterSave(args: {
  succeeded: boolean;
  pending?: boolean;
}): boolean {
  return args.succeeded === true && args.pending !== true;
}

export function ownerValidationSummary(
  errors: ReadonlyArray<string | null | undefined>,
): {
  ok: boolean;
  messages: string[];
  headline: string | null;
} {
  const messages = errors
    .map((e) => (typeof e === "string" ? e.trim() : ""))
    .filter((e) => e.length > 0);
  if (messages.length === 0) {
    return { ok: true, messages: [], headline: null };
  }
  return {
    ok: false,
    messages,
    headline:
      messages.length === 1
        ? (messages[0] ?? "Validation failed")
        : `${messages.length} fields need attention before publish`,
  };
}

export function ownerLiveTabGroup(tab: OwnerLiveTab): OwnerNavGroup | null {
  return OWNER_LIVE_NAV_GROUPS.find((g) => g.tabs.includes(tab)) ?? null;
}

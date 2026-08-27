/**
 * Shop checkout helpers. The canister initiatePurchase endpoint takes nine
 * positional Text arguments — passing a customer-data object is rejected by
 * Candid and the purchase record is never created.
 */

export type ShopCustomerFields = {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
};

export type InitiatePurchaseArgs = [
  packageId: string,
  customerName: string,
  customerSurname: string,
  customerEmail: string,
  customerAddress: string,
  customerCity: string,
  customerCountry: string,
  customerPostal: string,
  proofFileUrl: string,
];

function field(value: string | undefined): string {
  return (value ?? "").trim();
}

/** Map the shop form + proof payload onto the canister's positional args. */
export function buildInitiatePurchaseArgs(
  packageId: string,
  customer: ShopCustomerFields,
  proofFileUrl: string,
): InitiatePurchaseArgs {
  return [
    packageId,
    field(customer.firstName),
    field(customer.lastName),
    field(customer.email),
    field(customer.address),
    field(customer.city),
    field(customer.country),
    field(customer.postalCode),
    proofFileUrl,
  ];
}

export function readInitiatePurchaseResult(
  result: unknown,
): { ok: string } | { err: string } {
  if (result == null || typeof result !== "object") {
    return { err: "initiatePurchase returned an empty result" };
  }
  const r = result as Record<string, unknown>;
  if (
    r.__kind__ === "err" ||
    (r.err != null && r.ok == null && r._ok == null)
  ) {
    return { err: String(r.err ?? r._err ?? "initiatePurchase failed") };
  }
  const ok = r.ok ?? r._ok;
  if (typeof ok !== "string" || ok.length === 0) {
    return { err: "initiatePurchase missing purchase id" };
  }
  return { ok };
}

export function readCallerDokaBalance(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

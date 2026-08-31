import { useMutation, useQuery } from "@tanstack/react-query";
import { buildInitiatePurchaseArgs } from "../utils/shopPurchase";
import { useActor } from "./useActor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = Record<string, any>;

/** Wraps a backend promise with a 10-second timeout so slow responses never hang UI */
function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Query timed out after ${ms}ms`)), ms),
    ),
  ]);
}

export interface ShopPackage {
  id: string;
  dokaAmount: number;
  priceEur: number;
  paymentLink: string;
}

export interface PurchaseRecord {
  id: string;
  packageId: string;
  dokaAmount: number;
  priceEur: number;
  timestamp: string;
  status: string;
  customerData: Record<string, string>;
  proofOfAddressBase64?: string;
  proofOfAddressName?: string;
  userId?: string;
}

export function useGetShopPackages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ShopPackage[]>({
    queryKey: ["shopPackages"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await withTimeout((actor as ActorAny).getShopPackages());
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 60000,
    gcTime: 300000,
  });
}

export function useInitiatePurchase() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      packageId,
      customerData,
    }: { packageId: string; customerData: Record<string, string> }) => {
      if (!actor) throw new Error("Actor not available");
      if (!actor)
        throw new Error("Not connected — please log in before purchasing");
      const proofFileUrl =
        customerData.proofFileUrl ?? customerData.proofOfAddressBase64 ?? "";
      return (actor as ActorAny).initiatePurchase(
        ...buildInitiatePurchaseArgs(packageId, customerData, proofFileUrl),
      );
    },
  });
}

export function useGetPurchaseRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PurchaseRecord[]>({
    queryKey: ["purchaseRecords"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const raw = (await withTimeout((actor as ActorAny).getPurchases())) as
          | { __kind__?: string; ok?: unknown[]; err?: string }
          | { ok?: unknown[] }
          | unknown[]
          | null
          | undefined;
        const rows = Array.isArray(raw)
          ? raw
          : raw &&
              typeof raw === "object" &&
              "ok" in raw &&
              Array.isArray(raw.ok)
            ? raw.ok
            : [];
        return rows.map((row) => {
          const r = row as Record<string, unknown>;
          const timestampRaw = r.timestamp;
          const timestampNs =
            typeof timestampRaw === "bigint"
              ? Number(timestampRaw)
              : Number(timestampRaw ?? 0);
          return {
            id: String(r.id ?? ""),
            packageId: String(r.packageId ?? ""),
            dokaAmount: Number(r.dokaAmount ?? 0),
            priceEur: Number(r.priceEur ?? 0),
            timestamp:
              timestampNs > 1e15
                ? new Date(timestampNs / 1_000_000).toISOString()
                : timestampNs
                  ? new Date(timestampNs).toISOString()
                  : "",
            status: String(r.status ?? "pending"),
            customerData: {
              firstName: String(r.customerName ?? ""),
              lastName: String(r.customerSurname ?? ""),
              email: String(r.customerEmail ?? ""),
              address: String(r.customerAddress ?? ""),
              city: String(r.customerCity ?? ""),
              postalCode: String(r.customerPostal ?? ""),
              country: String(r.customerCountry ?? ""),
            },
            proofOfAddressBase64: undefined,
            proofOfAddressName: String(r.proofFileUrl ?? ""),
            userId:
              r.userPrincipal &&
              typeof r.userPrincipal === "object" &&
              "toText" in r.userPrincipal
                ? String((r.userPrincipal as { toText: () => string }).toText())
                : String(r.userPrincipal ?? ""),
          } as PurchaseRecord;
        });
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30000,
    gcTime: 120000,
  });
}
